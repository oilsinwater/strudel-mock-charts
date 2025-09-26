import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';
import { BenchmarkRow } from '../-config/taskflow.types';
import { qualityBenchmarkConfig } from '../-config/taskflow.config';

interface MetricsMatrixProps {
  rows: BenchmarkRow[];
  baselineId: string | null;
  onRowClick: (id: string) => void;
}

export const MetricsMatrix: React.FC<MetricsMatrixProps> = ({
  rows,
  baselineId,
  onRowClick,
}) => {
  return (
    <Paper sx={{ height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Comparison Matrix</Typography>
        <Typography variant="caption" color="text.secondary">
          Baseline rows are highlighted; click any row to open a detailed
          report.
        </Typography>
      </Box>
      <Box sx={{ height: 'calc(100% - 72px)' }} data-testid="qb-matrix">
        <DataGrid
          rows={rows}
          columns={qualityBenchmarkConfig.columns}
          hideFooterSelectedRowCount
          disableColumnMenu
          onRowClick={(params) => onRowClick(String(params.id))}
          getRowClassName={(params) =>
            String(params.id) === baselineId ? 'qb-baseline-row' : ''
          }
          sx={{
            '& .qb-baseline-row': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        />
      </Box>
    </Paper>
  );
};
