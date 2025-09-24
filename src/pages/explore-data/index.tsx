import React from 'react';
import { Box, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../components/PageHeader';
import {
  ExploreDataProvider,
  useExploreDataContext,
} from './-context/ContextProvider';
import { exploreDataConfig } from './-config/taskflow.config';
import { updateSearch, selectDataset } from './-context/actions';
import { FiltersPanel } from './-components/FiltersPanel';
import { PreviewPanel } from './-components/PreviewPanel';
import { PrimaryActions } from './-components/PrimaryActions';

export const Route = createFileRoute('/explore-data/')({
  component: ExploreDataPage,
});

const ExploreDataContent: React.FC = () => {
  const { state, dispatch, filteredRows } = useExploreDataContext();
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearch(event.target.value));
  };

  const handleRowClick = (params: GridRowParams) => {
    dispatch(selectDataset(params.id as string));
  };

  const handleViewDetail = () => {
    if (state.selectedIds.length > 0) {
      navigate({ to: `/explore-data/detail/${state.selectedIds[0]}` });
    }
  };

  const handleVisualize = () => {
    if (state.selectedIds.length > 0) {
      navigate({ to: `/explore-data/visualize/${state.selectedIds[0]}` });
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box data-testid="ed-header" sx={{ p: 3 }}>
        <PageHeader
          pageTitle={exploreDataConfig.title}
          description={exploreDataConfig.description}
        />
        <Box sx={{ mt: 2 }}>
          <TextField
            data-testid="search-input"
            fullWidth
            label="Search datasets..."
            variant="outlined"
            value={state.searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, description, or domain"
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 3, pt: 0 }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} md={3}>
            <Box data-testid="ed-filters" sx={{ height: '100%' }}>
              <FiltersPanel />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  Datasets ({filteredRows.length})
                </Typography>
              </Box>
              <Box data-testid="ed-grid" sx={{ flex: 1 }}>
                {state.loading ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Loading datasets...</Typography>
                  </Box>
                ) : state.error ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="error">{state.error}</Typography>
                  </Box>
                ) : (
                  <DataGrid
                    rows={filteredRows}
                    columns={exploreDataConfig.columns}
                    pageSizeOptions={[25, 50, 100]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    onRowClick={handleRowClick}
                    rowSelectionModel={state.selectedIds}
                    onRowSelectionModelChange={(newSelection) => {
                      if (newSelection.length > 0) {
                        dispatch(selectDataset(newSelection[0] as string));
                      }
                    }}
                    sx={{
                      '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      },
                    }}
                    slotProps={{
                      row: {
                        'data-testid': 'grid-row',
                      },
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Box data-testid="ed-preview" sx={{ flex: 1 }}>
                <PreviewPanel />
              </Box>
              <Box data-testid="ed-actions">
                <PrimaryActions
                  onViewDetail={handleViewDetail}
                  onVisualize={handleVisualize}
                  disabled={state.selectedIds.length === 0}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

function ExploreDataPage() {
  return (
    <ExploreDataProvider>
      <ExploreDataContent />
    </ExploreDataProvider>
  );
}
