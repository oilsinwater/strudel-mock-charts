import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import { csv } from 'd3-fetch';
import {
  ExploreDataState,
  ExploreDataContextValue,
  DatasetRow,
} from '../-config/taskflow.types';
import {
  exploreDataReducer,
  getFilteredRows,
  setDatasets,
  setError,
  setLoading,
} from './actions';
import { exploreDataConfig } from '../-config/taskflow.config';

const initialState: ExploreDataState = {
  selectedIds: [],
  filters: [],
  searchTerm: '',
  currentDataset: null,
  chartConfig: {
    type: 'scatter',
    xAxis: '',
    yAxis: '',
  },
  loading: false,
  error: null,
  previewData: [],
  datasets: [],
};

const ExploreDataContext = createContext<ExploreDataContextValue | undefined>(
  undefined
);

export const useExploreDataContext = (): ExploreDataContextValue => {
  const context = useContext(ExploreDataContext);
  if (!context) {
    throw new Error(
      'useExploreDataContext must be used within ExploreDataProvider'
    );
  }
  return context;
};

interface ExploreDataProviderProps {
  children: React.ReactNode;
}

export const ExploreDataProvider: React.FC<ExploreDataProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(exploreDataReducer, initialState);

  // Load datasets on mount
  useEffect(() => {
    const loadDatasets = async () => {
      dispatch(setLoading(true));
      try {
        const data = await csv(exploreDataConfig.dataSource.main);
        const datasets: DatasetRow[] = data.map((row) => ({
          id: row.id || '',
          name: row.name || '',
          description: row.description || '',
          rowCount: parseInt(row.rowCount || '0', 10),
          columnCount: parseInt(row.columnCount || '0', 10),
          fileSize: parseInt(row.fileSize || '0', 10),
          format: row.format || '',
          domain: row.domain || '',
          lastModified: row.lastModified || '',
          quality_score: parseFloat(row.quality_score || '0'),
          completeness: parseInt(row.completeness || '0', 10),
        }));

        dispatch(setDatasets(datasets));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError('Failed to load datasets'));
      }
    };

    loadDatasets();
  }, []);

  // Memoized selectors
  const filteredRows = useMemo(() => {
    return getFilteredRows(state.datasets, state.filters, state.searchTerm);
  }, [state.datasets, state.filters, state.searchTerm]);

  const selectedDataset = useMemo(() => {
    return state.currentDataset;
  }, [state.currentDataset]);

  const contextValue: ExploreDataContextValue = {
    state,
    dispatch,
    filteredRows,
    selectedDataset,
  };

  return (
    <ExploreDataContext.Provider value={contextValue}>
      {children}
    </ExploreDataContext.Provider>
  );
};
