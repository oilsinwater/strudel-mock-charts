import React from 'react';
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';
import { BenchmarkHistoryEntry } from '../-config/taskflow.types';

interface HistoryTimelineProps {
  entries: BenchmarkHistoryEntry[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  entries,
}) => {
  if (!entries.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2">
          No audit history available for this dataset.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }} data-testid="qb-timeline">
      <Stack spacing={2}>
        <Typography variant="h6">Quality Score Timeline</Typography>
        {entries.map((entry) => (
          <Box key={entry.entryId}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">{entry.date}</Typography>
              <Typography variant="body2">
                {Math.round(entry.qualityScore * 100)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(entry.qualityScore * 100, 100)}
              sx={{ height: 6, borderRadius: 1, my: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Anomalies: {entry.anomalyCount} • Outlier Columns:{' '}
              {entry.outlierColumns}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};
