import React, { useMemo, useRef } from 'react';
import { Box, Grid, Stack, Button } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../../components/PageHeader';
import { useQualityBenchmarkContext } from '../-context/ContextProvider';
import {
  clearMetricFilters,
  hydrateFromExplore,
  removeMetricFilter,
  setSelectedIds,
  updateMetricFilter,
} from '../-context/actions';
import { SelectionSummary } from '../-components/SelectionSummary';
import { DatasetPicker } from '../-components/DatasetPicker';
import { MetricFilters } from '../-components/MetricFilters';
import { qualityBenchmarkConfig } from '../-config/taskflow.config';

const metricDefaultThreshold: Record<
  'qualityScore' | 'completeness' | 'anomalyRate' | 'drift',
  number
> = {
  qualityScore: 0.75,
  completeness: 85,
  anomalyRate: 10,
  drift: 0,
};

export function QualityBenchmarkIndexPage() {
  const { state, dispatch, comparisonRows } = useQualityBenchmarkContext();
  const navigate = useNavigate();
  const { ids: idsParam, origin } = Route.useSearch();
  const hydrated = useRef(false);

  React.useEffect(() => {
    if (hydrated.current) return;
    const ids = idsParam ? idsParam.split(',').filter(Boolean) : undefined;
    if (ids?.length || origin) {
      dispatch(hydrateFromExplore(ids, origin ?? null));
    }
    hydrated.current = true;
  }, [dispatch, idsParam, origin]);

  const handleSelectionChange = (ids: string[]) => {
    dispatch(setSelectedIds(ids));
  };

  const handleReset = () => {
    dispatch(setSelectedIds([]));
    dispatch(clearMetricFilters());
  };

  const enabledMetrics = useMemo(() => {
    return new Set(state.metricFilters.map((filter) => filter.metric));
  }, [state.metricFilters]);

  const handleCompare = () => {
    if (state.selectedIds.length < 2) return;
    navigate({
      to: '/quality-benchmark/compare',
      params: {},
      search: {
        ids: state.selectedIds.join(','),
        origin: state.originFlow ?? 'explore-data',
        baseline: state.baselineId ?? undefined,
      },
    });
  };

  const handleViewReport = () => {
    if (!state.baselineId) return;
    navigate({
      to: '/quality-benchmark/report/$id',
      params: { id: state.baselineId },
      search: {
        origin: state.originFlow ?? 'explore-data',
        ids: state.selectedIds.join(','),
        baseline: state.baselineId,
      },
    });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3 }} data-testid="qb-header">
        <PageHeader
          pageTitle={qualityBenchmarkConfig.title}
          description={qualityBenchmarkConfig.description}
        />
      </Box>

      <Box sx={{ flex: 1, p: 3, pt: 0 }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} md={4} lg={3} sx={{ height: '100%' }}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <SelectionSummary
                originFlow={state.originFlow}
                selectedIds={state.selectedIds}
                baselineId={state.baselineId}
                onReset={handleReset}
              />
              <MetricFilters
                filters={state.metricFilters}
                onFilterChange={(filter) =>
                  dispatch(updateMetricFilter(filter))
                }
                onClear={() => dispatch(clearMetricFilters())}
                enabledMetrics={enabledMetrics}
                onMetricToggle={(metric, enabled) => {
                  if (enabled) {
                    dispatch(
                      updateMetricFilter({
                        metric,
                        threshold: metricDefaultThreshold[metric],
                        direction: metric === 'anomalyRate' ? 'lt' : 'gt',
                      })
                    );
                  } else {
                    dispatch(removeMetricFilter(metric));
                  }
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <DatasetPicker
                  rows={state.benchmarkRows}
                  selectedIds={state.selectedIds}
                  onSelectionChange={handleSelectionChange}
                />
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={state.selectedIds.length < 2}
                  onClick={handleCompare}
                >
                  Compare Selected
                </Button>
                <Button
                  data-testid="view-report"
                  variant="outlined"
                  disabled={!state.baselineId}
                  onClick={handleViewReport}
                >
                  View Report for Baseline
                </Button>
                <Button
                  variant="text"
                  onClick={() =>
                    handleSelectionChange(comparisonRows.map((row) => row.id))
                  }
                >
                  Select All in View
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export const Route = createFileRoute('/quality-benchmark/_layout/')({
  component: QualityBenchmarkIndexPage,
  validateSearch: (search: Record<string, unknown>) => ({
    ids: typeof search.ids === 'string' ? search.ids : undefined,
    origin: typeof search.origin === 'string' ? search.origin : undefined,
    baseline: typeof search.baseline === 'string' ? search.baseline : undefined,
  }),
});
