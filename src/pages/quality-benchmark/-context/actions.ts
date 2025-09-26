import {
  BenchmarkHistoryEntry,
  BenchmarkRow,
  MetricFilter,
  QualityBenchmarkAction,
  QualityBenchmarkState,
  SharedDatasetContext,
} from '../-config/taskflow.types';

const EXPLORE_TO_METRIC_MAP: Record<string, MetricFilter['metric']> = {
  quality_score: 'qualityScore',
  completeness: 'completeness',
  anomalyRate: 'anomalyRate',
  drift: 'drift',
};

export const initialQualityBenchmarkState: QualityBenchmarkState = {
  originFlow: null,
  selectedIds: [],
  baselineId: null,
  metricFilters: [],
  highlightedMetric: 'qualityScore',
  loading: false,
  error: null,
  benchmarkRows: [],
  benchmarkHistory: [],
};

export const qualityBenchmarkReducer = (
  state: QualityBenchmarkState,
  action: QualityBenchmarkAction
): QualityBenchmarkState => {
  switch (action.type) {
    case 'HYDRATE_FROM_EXPLORE': {
      const ids = action.payload.ids ?? [];
      const derivedMetricFilters = deriveFiltersFromExplore(
        action.payload.filters
      );
      return {
        ...state,
        originFlow: action.payload.origin ?? null,
        selectedIds: ids,
        baselineId: ids.length > 0 ? ids[0] : state.baselineId,
        metricFilters: derivedMetricFilters.length
          ? derivedMetricFilters
          : state.metricFilters,
      };
    }
    case 'SET_SELECTED_IDS': {
      const { ids } = action.payload;
      const nextBaseline = ids.includes(state.baselineId ?? '')
        ? state.baselineId
        : (ids[0] ?? null);
      return {
        ...state,
        selectedIds: ids,
        baselineId: nextBaseline,
      };
    }
    case 'TOGGLE_BASELINE':
      return {
        ...state,
        baselineId: action.payload.id,
      };
    case 'UPDATE_METRIC_FILTER': {
      const { filter } = action.payload;
      const existingIndex = state.metricFilters.findIndex(
        (item) => item.metric === filter.metric
      );
      const metricFilters = [...state.metricFilters];
      if (existingIndex >= 0) {
        metricFilters[existingIndex] = filter;
      } else {
        metricFilters.push(filter);
      }
      return {
        ...state,
        metricFilters,
      };
    }
    case 'REMOVE_METRIC_FILTER':
      return {
        ...state,
        metricFilters: state.metricFilters.filter(
          (item) => item.metric !== action.payload.metric
        ),
      };
    case 'CLEAR_METRIC_FILTERS':
      return {
        ...state,
        metricFilters: [],
      };
    case 'SET_HIGHLIGHTED_METRIC':
      return {
        ...state,
        highlightedMetric: action.payload.metric,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    case 'SET_BENCHMARK_ROWS': {
      const { rows } = action.payload;
      const currentBaseline =
        state.baselineId && rows.some((row) => row.id === state.baselineId)
          ? state.baselineId
          : (rows[0]?.id ?? null);
      return {
        ...state,
        benchmarkRows: rows,
        baselineId: currentBaseline,
      };
    }
    case 'SET_BENCHMARK_HISTORY':
      return {
        ...state,
        benchmarkHistory: action.payload.rows,
      };
    default:
      return state;
  }
};

export const hydrateFromExplore = (
  ids?: string[],
  origin?: string | null,
  filters?: unknown
): QualityBenchmarkAction => ({
  type: 'HYDRATE_FROM_EXPLORE',
  payload: { ids, origin, filters },
});

export const setSelectedIds = (ids: string[]): QualityBenchmarkAction => ({
  type: 'SET_SELECTED_IDS',
  payload: { ids },
});

export const toggleBaseline = (id: string): QualityBenchmarkAction => ({
  type: 'TOGGLE_BASELINE',
  payload: { id },
});

export const updateMetricFilter = (
  filter: MetricFilter
): QualityBenchmarkAction => ({
  type: 'UPDATE_METRIC_FILTER',
  payload: { filter },
});

export const removeMetricFilter = (
  metric: MetricFilter['metric']
): QualityBenchmarkAction => ({
  type: 'REMOVE_METRIC_FILTER',
  payload: { metric },
});

export const clearMetricFilters = (): QualityBenchmarkAction => ({
  type: 'CLEAR_METRIC_FILTERS',
});

export const setHighlightedMetric = (
  metric: QualityBenchmarkState['highlightedMetric']
): QualityBenchmarkAction => ({
  type: 'SET_HIGHLIGHTED_METRIC',
  payload: { metric },
});

export const setLoading = (loading: boolean): QualityBenchmarkAction => ({
  type: 'SET_LOADING',
  payload: { loading },
});

export const setError = (error: string | null): QualityBenchmarkAction => ({
  type: 'SET_ERROR',
  payload: { error },
});

export const setBenchmarkRows = (
  rows: BenchmarkRow[]
): QualityBenchmarkAction => ({
  type: 'SET_BENCHMARK_ROWS',
  payload: { rows },
});

export const setBenchmarkHistory = (
  rows: BenchmarkHistoryEntry[]
): QualityBenchmarkAction => ({
  type: 'SET_BENCHMARK_HISTORY',
  payload: { rows },
});

export const getComparisonRows = (
  rows: BenchmarkRow[],
  selectedIds: string[],
  metricFilters: MetricFilter[]
): BenchmarkRow[] => {
  let workingRows = [...rows];

  if (selectedIds.length > 0) {
    workingRows = workingRows.filter((row) => selectedIds.includes(row.id));
  }

  metricFilters.forEach((filter) => {
    workingRows = workingRows.filter((row) => {
      const value = row[filter.metric];
      if (filter.threshold === undefined) {
        return true;
      }
      if (filter.direction === 'gt') {
        return value >= filter.threshold;
      }
      if (filter.direction === 'lt') {
        return value <= filter.threshold;
      }
      return true;
    });
  });

  return workingRows;
};

export const getBaselineRow = (
  rows: BenchmarkRow[],
  baselineId: string | null
): BenchmarkRow | undefined => {
  if (!rows.length) return undefined;
  if (!baselineId) return rows[0];
  return rows.find((row) => row.id === baselineId) ?? rows[0];
};

export const getHistoryForDataset = (
  history: BenchmarkHistoryEntry[],
  datasetId: string | null
): BenchmarkHistoryEntry[] => {
  if (!datasetId) return [];
  return history.filter((entry) => entry.datasetId === datasetId);
};

export const getSharedContext = (
  state: QualityBenchmarkState
): SharedDatasetContext => ({
  originFlow: state.originFlow,
  selectedIds: state.selectedIds,
  metricFilters: state.metricFilters,
});

export const deriveFiltersFromExplore = (filters: unknown): MetricFilter[] => {
  if (!Array.isArray(filters)) {
    return [];
  }

  const derived: MetricFilter[] = [];

  filters.forEach((filter) => {
    if (typeof filter !== 'object' || filter === null) return;
    const field = (filter as Record<string, unknown>).field as
      | string
      | undefined;
    if (!field) return;
    const metric = EXPLORE_TO_METRIC_MAP[field];
    if (!metric) return;

    const op = (filter as Record<string, unknown>).op as string | undefined;
    const value = (filter as Record<string, unknown>).value as
      | number
      | undefined;

    if (!op || value === undefined) return;

    if (op === 'gte') {
      derived.push({ metric, threshold: Number(value), direction: 'gt' });
    } else if (op === 'lte') {
      derived.push({ metric, threshold: Number(value), direction: 'lt' });
    }
  });

  return derived;
};
