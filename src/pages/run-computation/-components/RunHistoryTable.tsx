import React from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Paper, Chip } from '@mui/material';
import { Run } from '../-config/taskflow.types';

interface RunHistoryTableProps {
  runs: Run[];
  onRowClick: (runId: string) => void;
}

const columns: GridColDef[] = [
  { field: 'runId', headerName: 'Run ID', width: 150 },
  { field: 'datasetId', headerName: 'Dataset ID', width: 150 },
  { field: 'modelId', headerName: 'Model ID', width: 200 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      const status = params.value as Run['status'];
      let color: 'success' | 'info' | 'warning' | 'error' | 'default' =
        'default';
      if (status === 'completed') color = 'success';
      if (status === 'running') color = 'info';
      if (status === 'pending') color = 'warning';
      if (status === 'failed') color = 'error';
      return <Chip label={status} color={color} size="small" />;
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200,
    type: 'dateTime',
    valueGetter: (value) => new Date(value),
  },
];

export const RunHistoryTable: React.FC<RunHistoryTableProps> = ({
  runs,
  onRowClick,
}) => {
  const handleRowClick = (params: GridRowParams) => {
    onRowClick(params.id as string);
  };

  return (
    <Paper sx={{ height: 600, width: '100%' }} data-testid="rc-history-table">
      <DataGrid
        rows={runs}
        columns={columns}
        getRowId={(row) => row.runId}
        onRowClick={handleRowClick}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
          },
        }}
        sx={{ cursor: 'pointer' }}
      />
    </Paper>
  );
};
