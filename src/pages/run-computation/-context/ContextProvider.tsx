import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { csv, json } from 'd3-fetch';
import {
  RunComputationContextValue,
  Run,
  Model,
} from '../-config/taskflow.types';
import {
  initialState,
  runComputationReducer,
  setRuns,
  setModels,
  setLoading,
  setError,
} from './actions';
import { runComputationConfig } from '../-config/taskflow.config';

const RunComputationContext = createContext<
  RunComputationContextValue | undefined
>(undefined);

export const useRunComputationContext = (): RunComputationContextValue => {
  const context = useContext(RunComputationContext);
  if (!context) {
    throw new Error(
      'useRunComputationContext must be used within a RunComputationProvider'
    );
  }
  return context;
};

export const RunComputationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(runComputationReducer, initialState);

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch(setLoading(true));
      try {
        const [runsData, modelsData] = await Promise.all([
          csv(runComputationConfig.dataSource.runs) as Promise<Run[]>,
          json(runComputationConfig.dataSource.models) as Promise<Model[]>,
        ]);
        dispatch(setRuns(runsData));
        dispatch(setModels(modelsData));
      } catch (e) {
        dispatch(setError('Failed to load initial data.'));
      }
      dispatch(setLoading(false));
    };

    loadInitialData();
  }, []);

  const value: RunComputationContextValue = {
    state,
    dispatch,
  };

  return (
    <RunComputationContext.Provider value={value}>
      {children}
    </RunComputationContext.Provider>
  );
};
