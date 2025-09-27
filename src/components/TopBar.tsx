import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Box,
  Button,
} from '@mui/material';
import React from 'react';
import { cleanPath } from '../utils/queryParams.utils';
import { AppLink } from './AppLink';
import { ImageWrapper } from './ImageWrapper';

/**
 * Top navigation bar component
 */
export const TopBar: React.FC = () => {
  return (
    <AppBar
      color="default"
      position="static"
      component="nav"
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderBottomColor: 'grey.300',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <AppLink to="/">
            <ImageWrapper height={30}>
              <img
                src={cleanPath(
                  `${import.meta.env.BASE_URL}/strudel-logo-icon.png`
                )}
              />
            </ImageWrapper>
          </AppLink>
          <AppLink to="/">
            <Typography variant="h6" component="div" fontWeight="bold">
              SciData Hub
            </Typography>
          </AppLink>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AppLink to="/explore-data">
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              Explore Data
            </Button>
          </AppLink>
          <AppLink to="/quality-benchmark">
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              Quality Benchmark
            </Button>
          </AppLink>
          <AppLink to="/run-computation">
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              Run Computation
            </Button>
          </AppLink>
          <IconButton size="large" edge="start" color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
