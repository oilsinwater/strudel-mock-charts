export interface RunComputationConfig {
  title: string;
  dataSource: {
    runs: string;
    models: string;
    inputDatasets: string;
  };
}

export const runComputationConfig: RunComputationConfig = {
  title: 'Run Process Simulation',
  dataSource: {
    runs: '/data/computation-runs.csv',
    models: '/data/computation-models.json',
    inputDatasets: '/data/explore-data-main.csv',
  },
};
