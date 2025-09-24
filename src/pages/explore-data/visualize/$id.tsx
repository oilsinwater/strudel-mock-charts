import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack, GetApp, Save } from '@mui/icons-material';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import Plot from 'react-plotly.js';
import { csv } from 'd3-fetch';
import { PageHeader } from '../../../components/PageHeader';
import {
  ExploreDataProvider,
  useExploreDataContext,
} from '../-context/ContextProvider';
import {
  loadDatasetDetail,
  finishLoadDetail,
  updateChartConfig,
} from '../-context/actions';
import { exploreDataConfig } from '../-config/taskflow.config';
import { ChartConfig, SampleDataRow } from '../-config/taskflow.types';

export const Route = createFileRoute('/explore-data/visualize/$id')({
  component: VisualizePage,
});

const VisualizeContent: React.FC = () => {
  const { id } = useParams({ from: '/explore-data/visualize/$id' });
  const navigate = useNavigate();
  const { state, dispatch } = useExploreDataContext();
  const [visualizationData, setVisualizationData] = useState<SampleDataRow[]>(
    []
  );

  useEffect(() => {
    const loadDetail = async () => {
      dispatch(loadDatasetDetail(id));

      try {
        // Load main dataset to find the selected one
        const mainData = await csv(exploreDataConfig.dataSource.main);
        const datasetRow = mainData.find((row) => row.id === id);

        if (datasetRow) {
          // Load sample data for visualization
          const sampleData = await csv(exploreDataConfig.dataSource.sample);
          const datasetSamples = sampleData
            .filter((row) => row.datasetId === id)
            .map((row) => ({
              rowId: row.rowId || '',
              datasetId: row.datasetId || '',
              temperature: parseFloat(row.temperature || '0'),
              pressure: parseFloat(row.pressure || '0'),
              concentration: parseFloat(row.concentration || '0'),
              ph_level: parseFloat(row.ph_level || '0'),
              timestamp: row.timestamp || '',
            }));

          const dataset = {
            id: datasetRow.id || '',
            name: datasetRow.name || '',
            description: datasetRow.description || '',
            rowCount: parseInt(datasetRow.rowCount || '0', 10),
            columns: [
              'temperature',
              'pressure',
              'concentration',
              'ph_level',
              'timestamp',
            ],
            lastModified: datasetRow.lastModified || '',
            fileSize: parseInt(datasetRow.fileSize || '0', 10),
            format: datasetRow.format || '',
            domain: datasetRow.domain || '',
            quality_score: parseFloat(datasetRow.quality_score || '0'),
            completeness: parseInt(datasetRow.completeness || '0', 10),
            sampleData: datasetSamples,
          };

          dispatch(finishLoadDetail(dataset));
          setVisualizationData(datasetSamples);

          // Set default chart config if not set
          if (!state.chartConfig.xAxis && !state.chartConfig.yAxis) {
            dispatch(
              updateChartConfig({
                type: 'scatter',
                xAxis: 'temperature',
                yAxis: 'pressure',
              })
            );
          }
        }
      } catch (error) {}
    };

    loadDetail();
  }, [id, dispatch]);

  const handleBack = () => {
    navigate({ to: '/explore-data' });
  };

  const handleChartTypeChange = (type: string) => {
    dispatch(
      updateChartConfig({
        ...state.chartConfig,
        type: type as ChartConfig['type'],
      })
    );
  };

  const handleAxisChange = (axis: 'xAxis' | 'yAxis', value: string) => {
    dispatch(
      updateChartConfig({
        ...state.chartConfig,
        [axis]: value,
      })
    );
  };

  const getPlotData = () => {
    if (
      !visualizationData.length ||
      !state.chartConfig.xAxis ||
      !state.chartConfig.yAxis
    ) {
      return [];
    }

    const xData = visualizationData.map(
      (row) => row[state.chartConfig.xAxis as keyof SampleDataRow]
    );
    const yData = visualizationData.map(
      (row) => row[state.chartConfig.yAxis as keyof SampleDataRow]
    );

    const trace: any = {
      x: xData,
      y: yData,
      mode: state.chartConfig.type === 'scatter' ? 'markers' : 'lines+markers',
      type: state.chartConfig.type === 'bar' ? 'bar' : 'scatter',
      name: `${state.chartConfig.yAxis} vs ${state.chartConfig.xAxis}`,
      marker: {
        color: '#1976d2',
        size: 8,
      },
    };

    if (state.chartConfig.type === 'line') {
      trace.mode = 'lines+markers';
      trace.line = { color: '#1976d2' };
    }

    return [trace];
  };

  const getStatistics = () => {
    if (
      !visualizationData.length ||
      !state.chartConfig.xAxis ||
      !state.chartConfig.yAxis
    ) {
      return null;
    }

    const xValues = visualizationData.map((row) =>
      Number(row[state.chartConfig.xAxis as keyof SampleDataRow])
    );
    const yValues = visualizationData.map((row) =>
      Number(row[state.chartConfig.yAxis as keyof SampleDataRow])
    );

    const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
    const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;

    // Calculate correlation coefficient
    const xDev = xValues.map((x) => x - xMean);
    const yDev = yValues.map((y) => y - yMean);
    const correlation =
      xDev.reduce((acc, xd, i) => acc + xd * yDev[i], 0) /
      Math.sqrt(
        xDev.reduce((acc, xd) => acc + xd * xd, 0) *
          yDev.reduce((acc, yd) => acc + yd * yd, 0)
      );

    return {
      selectedPoints: visualizationData.length,
      xMean: xMean.toFixed(2),
      yMean: yMean.toFixed(2),
      correlation: correlation.toFixed(3),
    };
  };

  const columnOptions = [
    { value: 'temperature', label: 'Temperature (°C)' },
    { value: 'pressure', label: 'Pressure (bar)' },
    { value: 'concentration', label: 'Concentration (mol/L)' },
    { value: 'ph_level', label: 'pH Level' },
  ];

  const statistics = getStatistics();

  if (state.loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading visualization...</Typography>
      </Box>
    );
  }

  if (!state.currentDataset) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Dataset not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box data-testid="ed-header" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton data-testid="back-button" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <PageHeader
              pageTitle={`${state.currentDataset.name} - Visualization`}
              description="Interactive data visualization and analysis"
            />
          </Box>
        </Stack>
      </Box>

      <Box data-testid="ed-controls" sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Chart Configuration
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    data-testid="chart-type-select"
                    value={state.chartConfig.type}
                    label="Chart Type"
                    onChange={(e) => handleChartTypeChange(e.target.value)}
                  >
                    <MenuItem value="scatter">Scatter Plot</MenuItem>
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>X-Axis</InputLabel>
                  <Select
                    data-testid="x-axis-select"
                    value={state.chartConfig.xAxis}
                    label="X-Axis"
                    onChange={(e) => handleAxisChange('xAxis', e.target.value)}
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Y-Axis</InputLabel>
                  <Select
                    data-testid="y-axis-select"
                    value={state.chartConfig.yAxis}
                    label="Y-Axis"
                    onChange={(e) => handleAxisChange('yAxis', e.target.value)}
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack direction="row" spacing={1}>
                  <Button startIcon={<GetApp />} size="small">
                    Export Chart
                  </Button>
                  <Button startIcon={<Save />} size="small">
                    Save Config
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 600 }}>
            <Box data-testid="ed-chart" sx={{ width: '100%', height: '100%' }}>
              <Plot
                data={getPlotData()}
                layout={{
                  title: `${state.chartConfig.yAxis} vs ${state.chartConfig.xAxis}`,
                  xaxis: { title: state.chartConfig.xAxis },
                  yaxis: { title: state.chartConfig.yAxis },
                  autosize: true,
                  margin: { t: 50, r: 50, b: 50, l: 50 },
                }}
                config={{
                  displayModeBar: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box data-testid="ed-summary">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Summary
                </Typography>
                {statistics && (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">
                        Selected Points
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {statistics.selectedPoints}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Statistics</Typography>
                      <Typography variant="body2">
                        <strong>Mean {state.chartConfig.xAxis}:</strong>{' '}
                        {statistics.xMean}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Mean {state.chartConfig.yAxis}:</strong>{' '}
                        {statistics.yMean}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Correlation</Typography>
                      <Typography variant="body2">
                        <strong>Correlation Coefficient:</strong>{' '}
                        {statistics.correlation}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {Math.abs(parseFloat(statistics.correlation)) > 0.7
                          ? 'Strong'
                          : Math.abs(parseFloat(statistics.correlation)) > 0.4
                            ? 'Moderate'
                            : 'Weak'}{' '}
                        correlation
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

function VisualizePage() {
  return (
    <ExploreDataProvider>
      <VisualizeContent />
    </ExploreDataProvider>
  );
}
