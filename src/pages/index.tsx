import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { PropsWithChildren } from 'react';
import { AppLink } from '../components/AppLink';
import { ImageWrapper } from '../components/ImageWrapper';

export const Route = createFileRoute('/')({
  component: Index,
});

/**
 * Home page component that renders at the root route /
 */
function Index() {
  const PaperWithHover: React.FC<PropsWithChildren> = ({ children }) => (
    <Paper
      sx={{
        padding: 2,
        transition: '0.25s',
        '&:hover': {
          backgroundColor: 'grey.200',
        },
      }}
    >
      {children}
    </Paper>
  );

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: 'grey.200',
          height: '280px',
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Stack alignItems="center" justifyContent="center" height="100%">
            <ImageWrapper height={60}>
              <img src="strudel-logo-icon.png" />
            </ImageWrapper>
            <Typography variant="h4" component="h1" fontWeight="bold">
              SciData Hub
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mt: 1, opacity: 0.8 }}
            >
              Explore, benchmark, and compute with scientific datasets
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              fontWeight="bold"
            >
              Scientific Workflows
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Choose a workflow to get started with your scientific data
              analysis
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <AppLink to="/explore-data">
                  <PaperWithHover>
                    <Stack spacing={2}>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        📊 Explore Datasets
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Browse, filter, and preview scientific datasets with
                        interactive visualizations across multiple domains
                      </Typography>
                    </Stack>
                  </PaperWithHover>
                </AppLink>
              </Grid>
              <Grid item xs={12} md={4}>
                <AppLink to="/quality-benchmark">
                  <PaperWithHover>
                    <Stack spacing={2}>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        🎯 Quality Benchmark
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Compare data readiness scores, anomaly rates, and drift
                        metrics across laboratory datasets
                      </Typography>
                    </Stack>
                  </PaperWithHover>
                </AppLink>
              </Grid>
              <Grid item xs={12} md={4}>
                <AppLink to="/run-computation">
                  <PaperWithHover>
                    <Stack spacing={2}>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        ⚙️ Run Computation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Execute process simulations and computational models on
                        your datasets with parameter configuration
                      </Typography>
                    </Stack>
                  </PaperWithHover>
                </AppLink>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
