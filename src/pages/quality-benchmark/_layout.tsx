import { Box } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { QualityBenchmarkProvider } from './-context/ContextProvider';

export const Route = createFileRoute('/quality-benchmark/_layout')({
  component: QualityBenchmarkLayout,
});

function QualityBenchmarkLayout() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <QualityBenchmarkProvider>
        <Outlet />
      </QualityBenchmarkProvider>
    </Box>
  );
}
