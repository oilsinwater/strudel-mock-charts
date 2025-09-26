import React from 'react';
import { Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';

interface SelectionSummaryProps {
  originFlow: string | null;
  selectedIds: string[];
  baselineId: string | null;
  onReset: () => void;
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  originFlow,
  selectedIds,
  baselineId,
  onReset,
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">Selection Summary</Typography>
          {originFlow ? (
            <Chip label={`Origin: ${originFlow}`} size="small" />
          ) : null}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Choose at least two datasets to unlock comparison metrics. Baseline
          determines the reference row used for delta calculations.
        </Typography>
        <Divider flexItem sx={{ my: 1 }} />
        <Typography variant="body2">
          Selected datasets: <strong>{selectedIds.length}</strong>
        </Typography>
        <Typography variant="body2">
          Baseline dataset:{' '}
          {baselineId ? (
            <Chip label={baselineId} size="small" color="primary" />
          ) : (
            '—'
          )}
        </Typography>
        <Button variant="text" color="secondary" onClick={onReset} size="small">
          Reset selection
        </Button>
      </Stack>
    </Paper>
  );
};
