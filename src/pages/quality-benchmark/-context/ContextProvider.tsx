import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { csv } from 'd3-fetch';
import {
  BenchmarkHistoryEntry,
  BenchmarkRow,
  QualityBenchmarkContextValue,
} from '../-config/taskflow.types';
import { qualityBenchmarkConfig } from '../-config/taskflow.config';
import {
  getBaselineRow,
  getComparisonRows,
  getHistoryForDataset,
  getSharedContext,
  initialQualityBenchmarkState,
  qualityBenchmarkReducer,
  setBenchmarkHistory,
  setBenchmarkRows,
  setError,
  setLoading,
} from './actions';

const QualityBenchmarkContext = createContext<
  QualityBenchmarkContextValue | undefined
>(undefined);

export const useQualityBenchmarkContext = (): QualityBenchmarkContextValue => {
  const context = useContext(QualityBenchmarkContext);
  if (!context) {
    throw new Error(
      'useQualityBenchmarkContext must be used within QualityBenchmarkProvider'
    );
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

const parseBenchmarkRow = (row: Record<string, string>): BenchmarkRow => ({
  id: row.id ?? '',
  baseline: row.baseline ?? '',
  qualityScore: Number(row.qualityScore ?? row.quality_score ?? 0),
  completeness: Number(row.completeness ?? 0),
  anomalyRate: Number(row.anomalyRate ?? 0),
  drift: Number(row.drift ?? 0),
  lastUpdated: row.lastUpdated ?? row.last_updated ?? '',
});

const parseHistoryRow = (
  row: Record<string, string>
): BenchmarkHistoryEntry => ({
  entryId: row.entryId ?? row.entry_id ?? '',
  datasetId: row.datasetId ?? row.dataset_id ?? '',
  date: row.date ?? '',
  qualityScore: Number(row.qualityScore ?? row.quality_score ?? 0),
  anomalyCount: Number(row.anomalyCount ?? row.anomaly_count ?? 0),
  outlierColumns: Number(row.outlierColumns ?? row.outlier_columns ?? 0),
  meanTemperature: Number(row.meanTemperature ?? row.mean_temperature ?? 0),
  meanPressure: Number(row.meanPressure ?? row.mean_pressure ?? 0),
});

export const QualityBenchmarkProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    qualityBenchmarkReducer,
    initialQualityBenchmarkState
  );

  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading(true));
      try {
        const [benchmarkData, historyData] = await Promise.all([
          csv(qualityBenchmarkConfig.dataSource.main),
          csv(qualityBenchmarkConfig.dataSource.history),
        ]);

        const rows = benchmarkData
          .map((row) => parseBenchmarkRow(row as Record<string, string>))
          .filter((row) => row.id);
        const history = historyData
          .map((row) => parseHistoryRow(row as Record<string, string>))
          .filter((row) => row.datasetId);

        dispatch(setBenchmarkRows(rows));
        dispatch(setBenchmarkHistory(history));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError('Failed to load benchmark data'));
      }
    };

    loadData();
  }, []);

  const comparisonRows = useMemo(() => {
    return getComparisonRows(
      state.benchmarkRows,
      state.selectedIds,
      state.metricFilters
    );
  }, [state.benchmarkRows, state.metricFilters, state.selectedIds]);

  const baselineRow = useMemo(() => {
    return getBaselineRow(comparisonRows, state.baselineId);
  }, [comparisonRows, state.baselineId]);

  const selectedHistory = useMemo(() => {
    return getHistoryForDataset(
      state.benchmarkHistory,
      baselineRow?.id ?? null
    );
  }, [baselineRow?.id, state.benchmarkHistory]);

  const sharedContext = useMemo(() => {
    return getSharedContext(state);
  }, [state]);

  const value: QualityBenchmarkContextValue = {
    state,
    dispatch,
    comparisonRows,
    baselineRow,
    selectedHistory,
    sharedContext,
  };

  return (
    <QualityBenchmarkContext.Provider value={value}>
      {children}
    </QualityBenchmarkContext.Provider>
  );
};
