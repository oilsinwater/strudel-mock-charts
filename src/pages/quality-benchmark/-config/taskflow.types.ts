export interface BenchmarkRow {
  id: string;
  baseline: string;
  qualityScore: number;
  completeness: number;
  anomalyRate: number;
  drift: number;
  lastUpdated: string;
}

export interface BenchmarkHistoryEntry {
  entryId: string;
  datasetId: string;
  date: string;
  qualityScore: number;
  anomalyCount: number;
  outlierColumns: number;
  meanTemperature: number;
  meanPressure: number;
}

export interface MetricFilter {
  metric: keyof Pick<
    BenchmarkRow,
    'qualityScore' | 'completeness' | 'anomalyRate' | 'drift'
  >;
  threshold?: number;
  direction?: 'gt' | 'lt';
}

export interface SharedDatasetContext {
  originFlow: string | null;
  selectedIds: string[];
  metricFilters: MetricFilter[];
}

export interface QualityBenchmarkState {
  originFlow: string | null;
  selectedIds: string[];
  baselineId: string | null;
  metricFilters: MetricFilter[];
  highlightedMetric: keyof Pick<
    BenchmarkRow,
    'qualityScore' | 'completeness' | 'anomalyRate' | 'drift'
  >;
  loading: boolean;
  error: string | null;
  benchmarkRows: BenchmarkRow[];
  benchmarkHistory: BenchmarkHistoryEntry[];
}

export type QualityBenchmarkAction =
  | {
      type: 'HYDRATE_FROM_EXPLORE';
      payload: {
        ids?: string[];
        origin?: string | null;
        filters?: unknown;
      };
    }
  | { type: 'SET_SELECTED_IDS'; payload: { ids: string[] } }
  | { type: 'TOGGLE_BASELINE'; payload: { id: string } }
  | { type: 'UPDATE_METRIC_FILTER'; payload: { filter: MetricFilter } }
  | {
      type: 'REMOVE_METRIC_FILTER';
      payload: { metric: MetricFilter['metric'] };
    }
  | { type: 'CLEAR_METRIC_FILTERS' }
  | {
      type: 'SET_HIGHLIGHTED_METRIC';
      payload: { metric: QualityBenchmarkState['highlightedMetric'] };
    }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'SET_BENCHMARK_ROWS'; payload: { rows: BenchmarkRow[] } }
  | {
      type: 'SET_BENCHMARK_HISTORY';
      payload: { rows: BenchmarkHistoryEntry[] };
    };

export interface QualityBenchmarkContextValue {
  state: QualityBenchmarkState;
  dispatch: React.Dispatch<QualityBenchmarkAction>;
  comparisonRows: BenchmarkRow[];
  baselineRow: BenchmarkRow | undefined;
  selectedHistory: BenchmarkHistoryEntry[];
  sharedContext: SharedDatasetContext;
}
