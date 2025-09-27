import React from 'react';
import { Paper, Typography, Stack, Chip } from '@mui/material';
import { Run } from '../-config/taskflow.types';

interface ResultsSummaryProps {
  run: Run | undefined;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ run }) => {
  if (!run) {
    return null;
  }

  return (
    <Paper sx={{ p: 2 }} data-testid="rc-results-summary">
      <Typography variant="h6" gutterBottom>
        Run Summary
      </Typography>
      <Stack spacing={1}>
        <Typography>
          <strong>Run ID:</strong> {run.runId}
        </Typography>
        <Typography>
          <strong>Dataset ID:</strong> {run.datasetId}
        </Typography>
        <Typography>
          <strong>Model ID:</strong> {run.modelId}
        </Typography>
        <Typography>
          <strong>Status:</strong>{' '}
          <Chip
            label={run.status}
            color={run.status === 'completed' ? 'success' : 'default'}
            size="small"
          />
        </Typography>
        <Typography>
          <strong>Created:</strong> {new Date(run.createdAt).toLocaleString()}
        </Typography>
        {run.completedAt && (
          <Typography>
            <strong>Completed:</strong>{' '}
            {new Date(run.completedAt).toLocaleString()}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
