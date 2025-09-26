import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { BenchmarkRow } from '../-config/taskflow.types';

interface TrendMiniChartsProps {
  rows: BenchmarkRow[];
  metric: 'qualityScore' | 'completeness' | 'anomalyRate' | 'drift';
}

const formatMetric = (
  metric: TrendMiniChartsProps['metric'],
  value: number
): string => {
  switch (metric) {
    case 'qualityScore':
      return `${Math.round(value * 100)}%`;
    case 'completeness':
      return `${Math.round(value)}%`;
    case 'anomalyRate':
      return `${value.toFixed(1)}%`;
    case 'drift':
      return value.toFixed(2);
    default:
      return String(value);
  }
};

export const TrendMiniCharts: React.FC<TrendMiniChartsProps> = ({
  rows,
  metric,
}) => {
  return (
    <Grid container spacing={2}>
      {rows.slice(0, 4).map((row) => (
        <Grid item xs={12} sm={6} key={row.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                {row.id}
              </Typography>
              <Typography variant="h5">
                {formatMetric(metric, row[metric])}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Metric snapshot for recent audit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
