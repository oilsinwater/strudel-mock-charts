import React from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';
import { BenchmarkRow } from '../-config/taskflow.types';
import { qualityBenchmarkConfig } from '../-config/taskflow.config';

interface DatasetPickerProps {
  rows: BenchmarkRow[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const DatasetPicker: React.FC<DatasetPickerProps> = ({
  rows,
  selectedIds,
  onSelectionChange,
}) => {
  const handleSelection = (model: GridRowSelectionModel) => {
    onSelectionChange(model.map(String));
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1 }} data-testid="qb-picker">
        <DataGrid
          rows={rows}
          columns={qualityBenchmarkConfig.columns}
          checkboxSelection
          disableRowSelectionOnClick={false}
          onRowSelectionModelChange={handleSelection}
          rowSelectionModel={selectedIds}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          getRowClassName={(params) =>
            selectedIds.includes(String(params.id)) ? 'qb-selected-row' : ''
          }
          sx={{
            '& .qb-selected-row': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>
    </Paper>
  );
};
