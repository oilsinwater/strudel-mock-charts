import React, { useCallback } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../../components/PageHeader';
import { useRunComputationContext } from '../-context/ContextProvider';
import { DatasetSelector } from '../-components/DatasetSelector';
import { ModelSelector } from '../-components/ModelSelector';
import { ParameterForm } from '../-components/ParameterForm';
import {
  setSelectedDataset,
  setSelectedModel,
  setRunParameters,
  addRun,
  setLoading,
} from '../-context/actions';

export const Route = createFileRoute('/run-computation/_layout/new')({
  component: NewComputationRun,
});

function NewComputationRun() {
  const { state, dispatch } = useRunComputationContext();
  const navigate = useNavigate();

  const selectedModel = state.models.find(
    (m) => m.modelId === state.selectedModelId
  );

  const handleStartComputation = () => {
    if (!state.selectedDatasetId || !state.selectedModelId) return;

    dispatch(setLoading(true));
    // In a real app, this would be an API call.
    const newRun = {
      runId: `run-${Math.random().toString(36).substring(2, 11)}`,
      datasetId: state.selectedDatasetId,
      modelId: state.selectedModelId,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      parameters: state.runParameters,
      resultsPath: `/data/run-001-results.csv`, // Mock result
    };

    setTimeout(() => {
      dispatch(addRun(newRun));
      dispatch(setLoading(false));
      navigate({
        to: '/run-computation/results/$runId',
        params: { runId: newRun.runId },
      });
    }, 1000);
  };

  const handleParametersChange = useCallback(
    (params: Record<string, any>) => {
      dispatch(setRunParameters(params));
    },
    [dispatch]
  );

  return (
    <Stack spacing={3}>
      <PageHeader pageTitle="New Computation Run" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <DatasetSelector
              selectedDatasetId={state.selectedDatasetId}
              onSelect={(id) => dispatch(setSelectedDataset(id))}
            />
            <ModelSelector
              models={state.models}
              selectedModelId={state.selectedModelId}
              onSelect={(id) => dispatch(setSelectedModel(id))}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <ParameterForm
            model={selectedModel}
            parameters={state.runParameters}
            onParametersChange={handleParametersChange}
          />
        </Grid>
      </Grid>
      <Box>
        <Button
          variant="contained"
          data-testid="rc-run-button"
          disabled={
            !state.selectedDatasetId || !state.selectedModelId || state.loading
          }
          onClick={handleStartComputation}
        >
          {state.loading ? 'Running...' : 'Run Computation'}
        </Button>
      </Box>
    </Stack>
  );
}
