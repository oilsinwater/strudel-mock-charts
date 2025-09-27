import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, Typography } from '@mui/material';
import { csv } from 'd3-fetch';

interface OutputDataTableProps {
  resultsPath: string | null;
}

// This is a mock structure for the results data
const columns: GridColDef[] = [
  { field: 'time', headerName: 'Time (s)', width: 150, type: 'number' },
  {
    field: 'temperature',
    headerName: 'Temperature (C)',
    width: 150,
    type: 'number',
  },
  {
    field: 'pressure',
    headerName: 'Pressure (bar)',
    width: 150,
    type: 'number',
  },
  { field: 'yield', headerName: 'Yield (%)', width: 150, type: 'number' },
];

export const OutputDataTable: React.FC<OutputDataTableProps> = ({
  resultsPath,
}) => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (resultsPath) {
      csv(resultsPath).then((data) => {
        // Add a unique id to each row for the data grid
        const dataWithIds = data.map((row, index) => ({ ...row, id: index }));
        setRows(dataWithIds);
      });
    }
  }, [resultsPath]);

  if (!resultsPath) {
    return null;
  }

  return (
    <Paper sx={{ height: 400, width: '100%' }} data-testid="rc-output-table">
      <Typography variant="h6" sx={{ p: 2 }}>
        Output Data
      </Typography>
      <DataGrid rows={rows} columns={columns} />
    </Paper>
  );
};
