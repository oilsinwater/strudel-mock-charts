import { GridColDef } from '@mui/x-data-grid';

export interface QualityBenchmarkConfig {
  title: string;
  description: string;
  columns: GridColDef[];
  metrics: {
    field: 'qualityScore' | 'completeness' | 'anomalyRate' | 'drift';
    label: string;
    description: string;
    formatter?: (value: number) => string;
  }[];
  filters: {
    field:
      | 'qualityScore'
      | 'completeness'
      | 'anomalyRate'
      | 'drift'
      | 'baseline';
    type: 'range' | 'percent' | 'select';
    label: string;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  }[];
  dataSource: {
    main: string;
    history: string;
    exploreMain: string;
  };
  routes: {
    index: string;
    compare: string;
    report: string;
  };
}

export const qualityBenchmarkConfig: QualityBenchmarkConfig = {
  title: 'Benchmark Dataset Quality',
  description:
    'Compare data readiness scores, anomaly rates, and drift metrics across curated laboratory datasets.',
  columns: [
    {
      field: 'id',
      headerName: 'Dataset ID',
      width: 140,
    },
    {
      field: 'qualityScore',
      headerName: 'Quality Score',
      type: 'number',
      width: 180,
      valueFormatter: (value) => `${Math.round(Number(value) * 100)}%`,
    },
    {
      field: 'completeness',
      headerName: 'Completeness',
      type: 'number',
      width: 160,
      valueFormatter: (value) => `${Math.round(Number(value))}%`,
    },
    {
      field: 'anomalyRate',
      headerName: 'Anomaly Rate',
      type: 'number',
      width: 160,
      valueFormatter: (value) => `${Number(value).toFixed(1)}%`,
    },
    {
      field: 'drift',
      headerName: 'Drift (z-score)',
      type: 'number',
      width: 160,
      valueFormatter: (value) => Number(value).toFixed(2),
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      width: 160,
    },
  ],
  metrics: [
    {
      field: 'qualityScore',
      label: 'Quality Score',
      description:
        'Composite readiness score derived from schema checks, coverage, and anomaly audits.',
      formatter: (value) => `${Math.round(value * 100)}%`,
    },
    {
      field: 'completeness',
      label: 'Completeness',
      description: 'Percentage of non-null critical fields across the dataset.',
      formatter: (value) => `${Math.round(value)}%`,
    },
    {
      field: 'anomalyRate',
      label: 'Anomaly Rate',
      description:
        'Proportion of rows triggering anomaly rules in the latest audit.',
      formatter: (value) => `${value.toFixed(1)}%`,
    },
    {
      field: 'drift',
      label: 'Drift (z-score)',
      description:
        'Feature drift comparison versus baseline reference distributions; higher magnitude indicates drift.',
      formatter: (value) => value.toFixed(2),
    },
  ],
  filters: [
    {
      field: 'qualityScore',
      type: 'range',
      label: 'Quality Score',
      min: 0.4,
      max: 1,
      step: 0.05,
    },
    {
      field: 'anomalyRate',
      type: 'range',
      label: 'Anomaly Rate (%)',
      min: 0,
      max: 20,
      step: 1,
    },
    {
      field: 'drift',
      type: 'range',
      label: 'Drift (z-score)',
      min: -3,
      max: 3,
      step: 0.25,
    },
    {
      field: 'baseline',
      type: 'select',
      label: 'Baseline Dataset',
      options: [],
    },
  ],
  dataSource: {
    main: '/data/explore-data-benchmark.csv',
    history: '/data/explore-data-benchmark-history.csv',
    exploreMain: '/data/explore-data-main.csv',
  },
  routes: {
    index: 'Seed Benchmark',
    compare: 'Compare Quality Benchmarks',
    report: 'Quality Report',
  },
};
