export interface Run {
  runId: string;
  datasetId: string;
  modelId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt: string | null;
  parameters: Record<string, any>;
  resultsPath: string | null;
}

export interface Model {
  modelId: string;
  name: string;
  description: string;
  parameters: {
    id: string;
    label: string;
    type: 'number' | 'string';
    defaultValue: any;
  }[];
}

export interface Parameter {
  id: string;
  value: any;
}

export interface RunComputationState {
  runs: Run[];
  models: Model[];
  selectedDatasetId: string | null;
  selectedModelId: string | null;
  runParameters: Record<string, any>;
  loading: boolean;
  error: string | null;
}

export type RunComputationAction =
  | { type: 'SET_RUNS'; payload: Run[] }
  | { type: 'SET_MODELS'; payload: Model[] }
  | { type: 'ADD_RUN'; payload: Run }
  | { type: 'SET_SELECTED_DATASET'; payload: string | null }
  | { type: 'SET_SELECTED_MODEL'; payload: string | null }
  | { type: 'SET_RUN_PARAMETERS'; payload: Record<string, any> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface RunComputationContextValue {
  state: RunComputationState;
  dispatch: React.Dispatch<RunComputationAction>;
}
