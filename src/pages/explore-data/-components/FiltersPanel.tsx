import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { useExploreDataContext } from '../-context/ContextProvider';
import { applyFilter, removeFilter, clearFilters } from '../-context/actions';
import { exploreDataConfig } from '../-config/taskflow.config';

export const FiltersPanel: React.FC = () => {
  const { state, dispatch } = useExploreDataContext();

  const handleSelectFilter = (field: string, value: string) => {
    if (value) {
      dispatch(applyFilter({ field, op: 'equals', value }));
    } else {
      dispatch(removeFilter(field));
    }
  };

  const handleRangeFilter = (field: string, values: number[]) => {
    dispatch(
      applyFilter({
        field,
        op: 'range',
        value: { min: values[0], max: values[1] },
      })
    );
  };

  const getFilterValue = (field: string) => {
    const filter = state.filters.find((f) => f.field === field);
    return filter?.value || '';
  };

  const getRangeValue = (field: string) => {
    const filter = state.filters.find((f) => f.field === field);
    if (filter && filter.op === 'range') {
      return [filter.value.min, filter.value.max];
    }
    const filterConfig = exploreDataConfig.filters.find(
      (f) => f.field === field
    );
    return [filterConfig?.min || 0, filterConfig?.max || 100];
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <Stack spacing={3}>
        {exploreDataConfig.filters.map((filterConfig) => (
          <Box key={filterConfig.field}>
            {filterConfig.type === 'select' ? (
              <FormControl fullWidth size="small">
                <InputLabel>{filterConfig.label}</InputLabel>
                <Select
                  value={getFilterValue(filterConfig.field)}
                  label={filterConfig.label}
                  onChange={(e) =>
                    handleSelectFilter(filterConfig.field, e.target.value)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {filterConfig.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterConfig.type === 'range' ? (
              <Box>
                <Typography variant="body2" gutterBottom>
                  {filterConfig.label}
                </Typography>
                <Slider
                  value={getRangeValue(filterConfig.field)}
                  onChange={(_, newValue) =>
                    handleRangeFilter(filterConfig.field, newValue as number[])
                  }
                  valueLabelDisplay="auto"
                  min={filterConfig.min}
                  max={filterConfig.max}
                  step={filterConfig.step}
                  marks={[
                    {
                      value: filterConfig.min || 0,
                      label: String(filterConfig.min || 0),
                    },
                    {
                      value: filterConfig.max || 100,
                      label: String(filterConfig.max || 100),
                    },
                  ]}
                  sx={{ mt: 1 }}
                />
              </Box>
            ) : null}
          </Box>
        ))}

        {state.filters.length > 0 && (
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              data-testid="filters-apply"
              variant="outlined"
              size="small"
              onClick={() => dispatch(clearFilters())}
              fullWidth
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
