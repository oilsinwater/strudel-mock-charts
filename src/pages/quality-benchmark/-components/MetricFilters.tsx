import React from 'react';
import {
  Box,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { MetricFilter } from '../-config/taskflow.types';
import { qualityBenchmarkConfig } from '../-config/taskflow.config';

interface MetricFiltersProps {
  filters: MetricFilter[];
  onFilterChange: (filter: MetricFilter) => void;
  onClear: () => void;
  enabledMetrics: Set<MetricFilter['metric']>;
  onMetricToggle: (metric: MetricFilter['metric'], enabled: boolean) => void;
}

const metricRanges: Record<
  MetricFilter['metric'],
  { min: number; max: number; step: number }
> = {
  qualityScore: { min: 0.4, max: 1, step: 0.05 },
  completeness: { min: 60, max: 100, step: 1 },
  anomalyRate: { min: 0, max: 20, step: 1 },
  drift: { min: -3, max: 3, step: 0.25 },
};

export const MetricFilters: React.FC<MetricFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  enabledMetrics,
  onMetricToggle,
}) => {
  const findFilterValue = (metric: MetricFilter['metric']): number => {
    const current = filters.find((filter) => filter.metric === metric);
    if (!current || current.threshold === undefined) {
      return metricRanges[metric].min;
    }
    return current.threshold;
  };

  return (
    <Paper sx={{ p: 2 }} data-testid="metric-filter">
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Metric Filters</Typography>
          <Typography
            component="button"
            variant="body2"
            color="primary"
            onClick={onClear}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear all
          </Typography>
        </Stack>

        {qualityBenchmarkConfig.metrics.map((metric) => {
          const range = metricRanges[metric.field];
          const enabled = enabledMetrics.has(metric.field);
          return (
            <Box
              key={metric.field}
              data-testid={`metric-filter-${metric.field}`}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">{metric.label}</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={enabled}
                      onChange={(event) =>
                        onMetricToggle(metric.field, event.target.checked)
                      }
                    />
                  }
                  label={enabled ? 'On' : 'Off'}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {metric.description}
              </Typography>
              <Slider
                value={findFilterValue(metric.field)}
                onChange={(_, value) => {
                  onFilterChange({
                    metric: metric.field,
                    threshold: Array.isArray(value)
                      ? value[0]
                      : (value as number),
                    direction: metric.field === 'anomalyRate' ? 'lt' : 'gt',
                  });
                }}
                valueLabelDisplay="auto"
                min={range.min}
                max={range.max}
                step={range.step}
                disabled={!enabled}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};
