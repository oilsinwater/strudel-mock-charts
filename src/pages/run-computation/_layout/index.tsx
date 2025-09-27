import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../../components/PageHeader';
import { useRunComputationContext } from '../-context/ContextProvider';
import { RunHistoryTable } from '../-components/RunHistoryTable';
import { runComputationConfig } from '../-config/taskflow.config';

export const Route = createFileRoute('/run-computation/_layout/')({
  component: RunComputationIndex,
});

function RunComputationIndex() {
  const { state } = useRunComputationContext();
  const navigate = useNavigate();

  const handleNewRun = () => {
    navigate({ to: '/run-computation/new' });
  };

  const handleRowClick = (runId: string) => {
    navigate({ to: '/run-computation/results/$runId', params: { runId } });
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        pageTitle={runComputationConfig.title}
        description="Select a process dataset, choose a simulation model, configure its parameters, and execute a computation. Monitor the run and analyze the resulting output data."
      />
      <RunHistoryTable runs={state.runs} onRowClick={handleRowClick} />
      <Box>
        <Button
          variant="contained"
          onClick={handleNewRun}
          data-testid="rc-new-run-button"
        >
          New Run
        </Button>
      </Box>
    </Stack>
  );
}
