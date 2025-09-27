import React from 'react';
import { Paper, Stack, TextField, Typography } from '@mui/material';
import { Model } from '../-config/taskflow.types';

interface ParameterFormProps {
  model: Model | undefined;
  parameters: Record<string, any>;
  onParametersChange: (params: Record<string, any>) => void;
}

export const ParameterForm: React.FC<ParameterFormProps> = ({
  model,
  parameters,
  onParametersChange,
}) => {
  const handleParamChange = (id: string, value: any) => {
    onParametersChange({ ...parameters, [id]: value });
  };

  if (!model) {
    return (
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
        data-testid="rc-parameter-form"
      >
        <Typography color="textSecondary">
          Select a model to configure its parameters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }} data-testid="rc-parameter-form">
      <Typography variant="h6" gutterBottom>
        Parameters
      </Typography>
      <Stack spacing={2}>
        {model.parameters.map((param) => (
          <TextField
            key={param.id}
            label={param.label}
            type={param.type}
            value={parameters[param.id] || ''}
            onChange={(e) => handleParamChange(param.id, e.target.value)}
          />
        ))}
      </Stack>
    </Paper>
  );
};
