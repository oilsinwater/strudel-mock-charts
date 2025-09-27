import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import Plot from 'react-plotly.js';
import { csv } from 'd3-fetch';

interface OutputChartProps {
  resultsPath: string | null;
}

export const OutputChart: React.FC<OutputChartProps> = ({ resultsPath }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (resultsPath) {
      csv(resultsPath).then((loadedData) => {
        setData(loadedData);
      });
    }
  }, [resultsPath]);

  if (!resultsPath) {
    return null;
  }

  return (
    <Paper sx={{ p: 2 }} data-testid="rc-output-chart">
      <Typography variant="h6" gutterBottom>
        Output Chart
      </Typography>
      <Plot
        data={[
          {
            x: data.map((d) => d.temperature),
            y: data.map((d) => d.yield),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
          },
        ]}
        layout={{
          width: 800,
          height: 400,
          title: 'Yield vs. Temperature',
          xaxis: { title: 'Temperature (C)' },
          yaxis: { title: 'Yield (%)' },
        }}
      />
    </Paper>
  );
};
