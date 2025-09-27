import { describe, expect, it } from 'vitest';
import {
  runComputationReducer,
  initialState,
  setRuns,
  setModels,
  addRun,
} from '../-context/actions';
import { Run, Model } from '../-config/taskflow.types';

const mockRuns: Run[] = [
  {
    runId: 'run-001',
    datasetId: 'd1',
    modelId: 'm1',
    status: 'completed',
    createdAt: '',
    completedAt: '',
    parameters: {},
    resultsPath: '',
  },
];

const mockModels: Model[] = [
  { modelId: 'm1', name: 'Model 1', description: '', parameters: [] },
];

describe('runComputationReducer', () => {
  it('should handle SET_RUNS', () => {
    const state = runComputationReducer(initialState, setRuns(mockRuns));
    expect(state.runs).toEqual(mockRuns);
  });

  it('should handle SET_MODELS', () => {
    const state = runComputationReducer(initialState, setModels(mockModels));
    expect(state.models).toEqual(mockModels);
  });

  it('should handle ADD_RUN', () => {
    const newRun: Run = {
      runId: 'run-002',
      datasetId: 'd2',
      modelId: 'm2',
      status: 'pending',
      createdAt: '',
      completedAt: null,
      parameters: {},
      resultsPath: null,
    };
    const state = runComputationReducer(
      { ...initialState, runs: mockRuns },
      addRun(newRun)
    );
    expect(state.runs).toHaveLength(2);
    expect(state.runs[0]).toEqual(newRun);
  });
});
