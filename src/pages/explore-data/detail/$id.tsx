import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack, Download, Share } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { csv } from 'd3-fetch';
import { PageHeader } from '../../../components/PageHeader';
import {
  ExploreDataProvider,
  useExploreDataContext,
} from '../-context/ContextProvider';
import { loadDatasetDetail, finishLoadDetail } from '../-context/actions';
import { exploreDataConfig } from '../-config/taskflow.config';

export const Route = createFileRoute('/explore-data/detail/$id')({
  component: DatasetDetailPage,
});

const DatasetDetailContent: React.FC = () => {
  const { id } = useParams({ from: '/explore-data/detail/$id' });
  const navigate = useNavigate();
  const { state, dispatch } = useExploreDataContext();

  useEffect(() => {
    const loadDetail = async () => {
      dispatch(loadDatasetDetail(id));

      try {
        // Load main dataset to find the selected one
        const mainData = await csv(exploreDataConfig.dataSource.main);
        const datasetRow = mainData.find((row) => row.id === id);

        if (datasetRow) {
          // Load sample data
          const sampleData = await csv(exploreDataConfig.dataSource.sample);
          const datasetSamples = sampleData
            .filter((row) => row.datasetId === id)
            .slice(0, 100); // First 100 rows for preview

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
            sampleData: datasetSamples.map((row) => ({
              rowId: row.rowId || '',
              datasetId: row.datasetId || '',
              temperature: parseFloat(row.temperature || '0'),
              pressure: parseFloat(row.pressure || '0'),
              concentration: parseFloat(row.concentration || '0'),
              ph_level: parseFloat(row.ph_level || '0'),
              timestamp: row.timestamp || '',
            })),
          };

          dispatch(finishLoadDetail(dataset));
        }
      } catch (error) {}
    };

    loadDetail();
  }, [id, dispatch]);

  const handleBack = () => {
    navigate({ to: '/explore-data' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    if (bytes < 1073741824) return `${Math.round(bytes / 1048576)} MB`;
    return `${Math.round(bytes / 1073741824)} GB`;
  };

  const sampleColumns = [
    { field: 'temperature', headerName: 'Temperature (°C)', width: 150 },
    { field: 'pressure', headerName: 'Pressure (bar)', width: 150 },
    { field: 'concentration', headerName: 'Concentration (mol/L)', width: 180 },
    { field: 'ph_level', headerName: 'pH Level', width: 120 },
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
  ];

  if (state.loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading dataset details...</Typography>
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
              pageTitle={state.currentDataset.name}
              description="Dataset details and sample data"
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Download />} size="small">
              Download
            </Button>
            <Button startIcon={<Share />} size="small">
              Export Metadata
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box data-testid="ed-metadata">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {state.currentDataset.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      File Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Format:</strong> {state.currentDataset.format}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Size:</strong>{' '}
                      {formatFileSize(state.currentDataset.fileSize)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Modified:</strong>{' '}
                      {new Date(
                        state.currentDataset.lastModified
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Domain</Typography>
                    <Typography variant="body2">
                      {state.currentDataset.domain}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box data-testid="ed-statistics">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistics
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">
                      Dataset Dimensions
                    </Typography>
                    <Typography variant="body2">
                      <strong>Rows:</strong>{' '}
                      {state.currentDataset.rowCount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Columns:</strong>{' '}
                      {state.currentDataset.columns.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      Data Quality Metrics
                    </Typography>
                    <Typography variant="body2">
                      <strong>Quality Score:</strong>{' '}
                      {Math.round(state.currentDataset.quality_score * 100)}%
                    </Typography>
                    <Typography variant="body2">
                      <strong>Completeness:</strong>{' '}
                      {state.currentDataset.completeness}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      Available Columns
                    </Typography>
                    <Typography variant="body2">
                      {state.currentDataset.columns.join(', ')}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ height: 600 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Sample Data (First 100 rows)</Typography>
            </Box>
            <Box data-testid="ed-grid" sx={{ height: 'calc(100% - 64px)' }}>
              <DataGrid
                rows={state.currentDataset.sampleData}
                columns={sampleColumns}
                getRowId={(row) => row.rowId}
                pageSizeOptions={[25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                density="compact"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

function DatasetDetailPage() {
  return (
    <ExploreDataProvider>
      <DatasetDetailContent />
    </ExploreDataProvider>
  );
}
