import React, { useMemo } from 'react';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../../../components/PageHeader';
import { useQualityBenchmarkContext } from '../../-context/ContextProvider';
import { HistoryTimeline } from '../../-components/HistoryTimeline';
import { qualityBenchmarkConfig } from '../../-config/taskflow.config';

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

function QualityBenchmarkReport() {
  const { state } = useQualityBenchmarkContext();
  const params = Route.useParams();
  const { ids: idsParam, origin, baseline } = Route.useSearch();
  const navigate = useNavigate();

  const row = useMemo(
    () => state.benchmarkRows.find((item) => item.id === params.id),
    [params.id, state.benchmarkRows]
  );

  const history = useMemo(
    () =>
      state.benchmarkHistory.filter((entry) => entry.datasetId === params.id),
    [params.id, state.benchmarkHistory]
  );

  const handleBack = () => {
    navigate({
      to: '/quality-benchmark/compare',
      params: {},
      search: {
        ids: idsParam ?? state.selectedIds.join(','),
        baseline: baseline ?? state.baselineId ?? undefined,
        origin: origin ?? state.originFlow ?? undefined,
      },
    });
  };

  const handleReturnToExplore = () => {
    navigate({
      to: '/explore-data/detail/$id',
      params: { id: params.id },
      search: {
        origin: 'quality-benchmark',
        ids: idsParam ?? state.selectedIds.join(','),
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="text" onClick={handleBack}>
            ← Back to Compare
          </Button>
          <Button
            data-testid="return-explore"
            variant="outlined"
            onClick={handleReturnToExplore}
          >
            Open in Explore Detail
          </Button>
        </Stack>
        <PageHeader
          pageTitle={`${qualityBenchmarkConfig.routes.report}: ${params.id}`}
          description="Historical audit metrics and anomaly diagnostics for the chosen dataset."
        />

        {row ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Snapshot
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatBlock
                  label="Quality Score"
                  value={formatPercent(row.qualityScore)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatBlock
                  label="Completeness"
                  value={`${Math.round(row.completeness)}%`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatBlock
                  label="Anomaly Rate"
                  value={`${row.anomalyRate.toFixed(1)}%`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatBlock label="Drift" value={row.drift.toFixed(2)} />
              </Grid>
            </Grid>
          </Paper>
        ) : null}

        <HistoryTimeline entries={history} />

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Anomaly Breakdown</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor anomaly counts and pressure/temperature baselines to
            diagnose deviations.
          </Typography>
          {history.slice(0, 5).map((entry) => (
            <Stack
              key={entry.entryId}
              direction="row"
              spacing={2}
              sx={{ mt: 1 }}
            >
              <Typography sx={{ width: 120 }}>{entry.date}</Typography>
              <Typography sx={{ width: 120 }}>
                Anomalies: <strong>{entry.anomalyCount}</strong>
              </Typography>
              <Typography sx={{ width: 160 }}>
                Outlier Columns: <strong>{entry.outlierColumns}</strong>
              </Typography>
              <Typography sx={{ flex: 1 }}>
                Avg Temp: {entry.meanTemperature.toFixed(1)}°C, Pressure:{' '}
                {entry.meanPressure.toFixed(1)} bar
              </Typography>
            </Stack>
          ))}
        </Paper>
      </Stack>
    </Box>
  );
}

export const Route = createFileRoute('/quality-benchmark/_layout/report/$id')({
  component: QualityBenchmarkReport,
  validateSearch: (search: Record<string, unknown>) => ({
    ids: typeof search.ids === 'string' ? search.ids : undefined,
    origin: typeof search.origin === 'string' ? search.origin : undefined,
    baseline: typeof search.baseline === 'string' ? search.baseline : undefined,
  }),
});

interface StatBlockProps {
  label: string;
  value: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value }) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h5">{value}</Typography>
  </Paper>
);
