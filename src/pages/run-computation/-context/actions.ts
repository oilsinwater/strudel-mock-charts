import {
  RunComputationAction,
  RunComputationState,
  Run,
  Model,
} from '../-config/taskflow.types';

export const initialState: RunComputationState = {
  runs: [],
  models: [],
  selectedDatasetId: null,
  selectedModelId: null,
  runParameters: {},
  loading: false,
  error: null,
};

export const runComputationReducer = (
  state: RunComputationState,
  action: RunComputationAction
): RunComputationState => {
  switch (action.type) {
    case 'SET_RUNS':
      return { ...state, runs: action.payload };
    case 'SET_MODELS':
      return { ...state, models: action.payload };
    case 'ADD_RUN':
      return { ...state, runs: [action.payload, ...state.runs] };
    case 'SET_SELECTED_DATASET':
      return { ...state, selectedDatasetId: action.payload };
    case 'SET_SELECTED_MODEL':
      return { ...state, selectedModelId: action.payload, runParameters: {} };
    case 'SET_RUN_PARAMETERS':
      return { ...state, runParameters: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Action Creators
export const setRuns = (runs: Run[]): RunComputationAction => ({
  type: 'SET_RUNS',
  payload: runs,
});

export const setModels = (models: Model[]): RunComputationAction => ({
  type: 'SET_MODELS',
  payload: models,
});

export const addRun = (run: Run): RunComputationAction => ({
  type: 'ADD_RUN',
  payload: run,
});

export const setSelectedDataset = (
  id: string | null
): RunComputationAction => ({
  type: 'SET_SELECTED_DATASET',
  payload: id,
});

export const setSelectedModel = (id: string | null): RunComputationAction => ({
  type: 'SET_SELECTED_MODEL',
  payload: id,
});

export const setRunParameters = (
  params: Record<string, any>
): RunComputationAction => ({
  type: 'SET_RUN_PARAMETERS',
  payload: params,
});

export const setLoading = (loading: boolean): RunComputationAction => ({
  type: 'SET_LOADING',
  payload: loading,
});

export const setError = (error: string | null): RunComputationAction => ({
  type: 'SET_ERROR',
  payload: error,
});
