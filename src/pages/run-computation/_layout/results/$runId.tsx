import React from 'react';
import { Stack, Button } from '@mui/material';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { PageHeader } from '../../../components/PageHeader';
import { useRunComputationContext } from '../-context/ContextProvider';
import { ResultsSummary } from '../-components/ResultsSummary';
import { OutputDataTable } from '../-components/OutputDataTable';
import { OutputChart } from '../-components/OutputChart';

export const Route = createFileRoute('/run-computation/_layout/results/$runId')(
  {
    component: ComputationResults,
  }
);

function ComputationResults() {
  const { runId } = useParams({
    from: '/run-computation/_layout/results/$runId',
  });
  const { state } = useRunComputationContext();
  const navigate = useNavigate();

  const run = state.runs.find((r) => r.runId === runId);

  const handleExploreOutput = () => {
    if (run?.resultsPath) {
      // This is a mock navigation, assuming the output of a run
      // becomes a new dataset in the explore-data task flow.
      // The id is hardcoded for now.
      navigate({ to: '/explore-data/detail/exp-2024-03-A' });
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader pageTitle={`Results for ${runId}`} />
      <ResultsSummary run={run} />
      <OutputChart resultsPath={run?.resultsPath || null} />
      <OutputDataTable resultsPath={run?.resultsPath || null} />
      <Button
        variant="contained"
        onClick={handleExploreOutput}
        disabled={!run?.resultsPath || run?.status !== 'completed'}
        data-testid="rc-explore-output-button"
      >
        Explore Output Dataset
      </Button>
    </Stack>
  );
}
