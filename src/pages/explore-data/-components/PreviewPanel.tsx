import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useExploreDataContext } from '../-context/ContextProvider';

export const PreviewPanel: React.FC = () => {
  const { state, filteredRows } = useExploreDataContext();

  const selectedDataset =
    state.selectedIds.length > 0
      ? filteredRows.find((ds) => ds.id === state.selectedIds[0])
      : null;

  if (!selectedDataset) {
    return (
      <Paper
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="textSecondary" align="center">
          Select a dataset to preview its details
        </Typography>
      </Paper>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    if (bytes < 1073741824) return `${Math.round(bytes / 1048576)} MB`;
    return `${Math.round(bytes / 1073741824)} GB`;
  };

  return (
    <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {selectedDataset.name}
          </Typography>

          <Typography variant="body2" color="textSecondary" paragraph>
            {selectedDataset.description}
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Format & Domain
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={selectedDataset.format} size="small" />
                <Chip
                  label={selectedDataset.domain}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Dataset Size
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Rows:</strong>{' '}
                  {selectedDataset.rowCount.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Columns:</strong> {selectedDataset.columnCount}
                </Typography>
                <Typography variant="body2">
                  <strong>File Size:</strong>{' '}
                  {formatFileSize(selectedDataset.fileSize)}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Data Quality
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Quality Score:</strong>{' '}
                  {Math.round(selectedDataset.quality_score * 100)}%
                </Typography>
                <Typography variant="body2">
                  <strong>Completeness:</strong> {selectedDataset.completeness}%
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Last Modified
              </Typography>
              <Typography variant="body2">
                {new Date(selectedDataset.lastModified).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  );
};
