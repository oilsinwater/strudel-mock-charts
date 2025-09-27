import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { csv } from 'd3-fetch';
import { runComputationConfig } from '../-config/taskflow.config';

interface DatasetSelectorProps {
  selectedDatasetId: string | null;
  onSelect: (id: string | null) => void;
}

interface Dataset {
  id: string;
  name: string;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  selectedDatasetId,
  onSelect,
}) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    csv(runComputationConfig.dataSource.inputDatasets).then((data) => {
      const loadedDatasets = data
        .map((d) => ({ id: d.id || '', name: d.name || '' }))
        .filter((d) => d.id);
      setDatasets(loadedDatasets);
    });
  }, []);

  return (
    <Paper sx={{ p: 2 }} data-testid="rc-dataset-selector">
      <Typography variant="h6" gutterBottom>
        Dataset
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Select a dataset</InputLabel>
        <Select
          value={selectedDatasetId || ''}
          onChange={(e) => onSelect(e.target.value as string)}
          label="Select a dataset"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {datasets.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};
