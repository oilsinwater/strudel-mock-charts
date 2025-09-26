import React, { useMemo } from 'react';
import { Card, CardContent, List, ListItem, Typography } from '@mui/material';
import { BenchmarkRow } from '../-config/taskflow.types';

interface InsightsPanelProps {
  baselineRow?: BenchmarkRow;
  comparisonRows: BenchmarkRow[];
  onReturnToExplore?: (id: string, target: 'detail' | 'visualize') => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  baselineRow,
  comparisonRows,
}) => {
  const topInsights = useMemo(() => {
    if (!baselineRow) return [];
    const rowsExcludingBaseline = comparisonRows.filter(
      (row) => row.id !== baselineRow.id
    );
    const sorted = [...rowsExcludingBaseline].sort(
      (a, b) => b.qualityScore - a.qualityScore
    );
    return sorted.slice(0, 3);
  }, [baselineRow, comparisonRows]);

  if (!baselineRow) {
    return null;
  }

  return (
    <Card data-testid="qb-insights">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Insights
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Highlighted metrics relative to baseline{' '}
          <strong>{baselineRow.id}</strong>.
        </Typography>
        <List dense>
          {topInsights.map((row) => (
            <ListItem key={row.id} sx={{ display: 'block' }}>
              <Typography variant="subtitle2">{row.id}</Typography>
              <Typography variant="caption" color="text.secondary">
                Quality +
                {Math.round(
                  (row.qualityScore - baselineRow.qualityScore) * 100
                )}
                % , Anomaly Rate {row.anomalyRate.toFixed(1)}%
              </Typography>
            </ListItem>
          ))}
        </List>
        {topInsights.length === 0 ? (
          <Typography variant="body2">
            Select additional datasets to compare.
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};
