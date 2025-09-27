import { Box } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { RunComputationProvider } from './-context/ContextProvider';

export const Route = createFileRoute('/run-computation/_layout')({
  component: RunComputationLayout,
});

function RunComputationLayout() {
  return (
    <RunComputationProvider>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </RunComputationProvider>
  );
}
