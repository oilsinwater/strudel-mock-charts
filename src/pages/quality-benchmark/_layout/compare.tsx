import React, { useMemo, useRef } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  createFileRoute,
  Link as RouterLink,
  useNavigate,
} from '@tanstack/react-router';
import { PageHeader } from '../../../components/PageHeader';
import { useQualityBenchmarkContext } from '../-context/ContextProvider';
import {
  setHighlightedMetric,
  setSelectedIds,
  toggleBaseline,
} from '../-context/actions';
import { MetricsMatrix } from '../-components/MetricsMatrix';
import { InsightsPanel } from '../-components/InsightsPanel';
import { TrendMiniCharts } from '../-components/TrendMiniCharts';
import { qualityBenchmarkConfig } from '../-config/taskflow.config';

function QualityBenchmarkCompare() {
  const { state, dispatch, comparisonRows, baselineRow } =
    useQualityBenchmarkContext();
  const { ids: idsParam, origin, baseline } = Route.useSearch();
  const navigate = useNavigate();
  const hydrated = useRef(false);

  React.useEffect(() => {
    if (hydrated.current) return;
    const ids = idsParam ? idsParam.split(',').filter(Boolean) : undefined;
    if (ids?.length) {
      dispatch(setSelectedIds(ids));
    }
    if (baseline) {
      dispatch(toggleBaseline(baseline));
    }
    hydrated.current = true;
  }, [baseline, dispatch, idsParam]);

  const baselineOptions = useMemo(() => {
    if (state.selectedIds.length > 0) {
      return state.selectedIds;
    }
    return comparisonRows.map((row) => row.id);
  }, [comparisonRows, state.selectedIds]);

  const handleBaselineChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    if (value) {
      dispatch(toggleBaseline(value));
    }
  };

  const handleOpenReport = (id: string) => {
    navigate({
      to: '/quality-benchmark/report/$id',
      params: { id },
      search: {
        ids: state.selectedIds.join(','),
        origin: origin ?? state.originFlow ?? 'quality-benchmark',
        baseline: state.baselineId ?? undefined,
      },
    });
  };

  const handleReturnToExplore = (id: string) => {
    navigate({
      to: '/explore-data/detail/$id',
      params: { id },
      search: {
        origin: 'quality-benchmark',
        ids: state.selectedIds.join(','),
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Breadcrumbs>
          <Link component={RouterLink} to="/explore-data" underline="hover">
            Explore Data
          </Link>
          <Typography color="text.primary">Quality Benchmark</Typography>
        </Breadcrumbs>
        <Box data-testid="qb-header">
          <PageHeader
            pageTitle={qualityBenchmarkConfig.routes.compare}
            description="Baseline-adjusted comparisons across selected datasets."
          />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">Baseline dataset:</Typography>
          <ToggleButtonGroup
            value={state.baselineId}
            exclusive
            onChange={handleBaselineChange}
            size="small"
            data-testid="baseline-toggle"
          >
            {baselineOptions.map((option) => (
              <ToggleButton key={option} value={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MetricsMatrix
              rows={comparisonRows}
              baselineId={state.baselineId}
              onRowClick={handleOpenReport}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InsightsPanel
              baselineRow={baselineRow}
              comparisonRows={comparisonRows}
            />
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                data-testid="view-report"
                variant="contained"
                color="primary"
                onClick={() => baselineRow && handleOpenReport(baselineRow.id)}
                disabled={!baselineRow}
              >
                Open Report
              </Button>
              <Button
                data-testid="return-explore"
                variant="outlined"
                onClick={() =>
                  baselineRow && handleReturnToExplore(baselineRow.id)
                }
                disabled={!baselineRow}
              >
                Return to Explore
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <TrendMiniCharts
          rows={comparisonRows}
          metric={state.highlightedMetric}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">Highlight metric:</Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={state.highlightedMetric}
            onChange={(_, value) => {
              if (value) {
                dispatch(setHighlightedMetric(value));
              }
            }}
          >
            {qualityBenchmarkConfig.metrics.map((metric) => (
              <ToggleButton key={metric.field} value={metric.field}>
                {metric.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
}

export const Route = createFileRoute('/quality-benchmark/_layout/compare')({
  component: QualityBenchmarkCompare,
  validateSearch: (search: Record<string, unknown>) => ({
    ids: typeof search.ids === 'string' ? search.ids : undefined,
    origin: typeof search.origin === 'string' ? search.origin : undefined,
    baseline: typeof search.baseline === 'string' ? search.baseline : undefined,
  }),
});
