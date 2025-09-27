import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { Model } from '../-config/taskflow.types';

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string | null;
  onSelect: (id: string | null) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onSelect,
}) => {
  return (
    <Paper sx={{ p: 2 }} data-testid="rc-model-selector">
      <Typography variant="h6" gutterBottom>
        Model
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Select a model</InputLabel>
        <Select
          value={selectedModelId || ''}
          onChange={(e) => onSelect(e.target.value as string)}
          label="Select a model"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {models.map((m) => (
            <MenuItem key={m.modelId} value={m.modelId}>
              {m.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};
