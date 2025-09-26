import React from 'react';
import { Button, Paper, Stack } from '@mui/material';
import { Visibility, BarChart, Assessment } from '@mui/icons-material';

interface PrimaryActionsProps {
  onViewDetail: () => void;
  onVisualize: () => void;
  onBenchmarkQuality: () => void;
  disabled: boolean;
}

export const PrimaryActions: React.FC<PrimaryActionsProps> = ({
  onViewDetail,
  onVisualize,
  onBenchmarkQuality,
  disabled,
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Button
          data-testid="view-detail-button"
          variant="contained"
          startIcon={<Visibility />}
          onClick={onViewDetail}
          disabled={disabled}
          fullWidth
        >
          View Details
        </Button>
        <Button
          data-testid="visualize-button"
          variant="outlined"
          startIcon={<BarChart />}
          onClick={onVisualize}
          disabled={disabled}
          fullWidth
        >
          Visualize
        </Button>
        <Button
          data-testid="benchmark-quality-button"
          variant="outlined"
          color="secondary"
          startIcon={<Assessment />}
          onClick={onBenchmarkQuality}
          disabled={disabled}
          fullWidth
        >
          Benchmark Quality
        </Button>
      </Stack>
    </Paper>
  );
};
