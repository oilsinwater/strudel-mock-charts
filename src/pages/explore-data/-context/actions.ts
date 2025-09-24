import {
  ExploreDataAction,
  ExploreDataState,
  Filter,
  DatasetRow,
} from '../-config/taskflow.types';

export const exploreDataReducer = (
  state: ExploreDataState,
  action: ExploreDataAction
): ExploreDataState => {
  switch (action.type) {
    case 'APPLY_FILTER':
      const existingFilterIndex = state.filters.findIndex(
        (filter) => filter.field === action.payload.field
      );

      let newFilters;
      if (existingFilterIndex >= 0) {
        newFilters = [...state.filters];
        newFilters[existingFilterIndex] = action.payload;
      } else {
        newFilters = [...state.filters, action.payload];
      }

      return {
        ...state,
        filters: newFilters,
      };

    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: state.filters.filter(
          (filter) => filter.field !== action.payload.field
        ),
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: [],
      };

    case 'UPDATE_SEARCH':
      return {
        ...state,
        searchTerm: action.payload.term,
      };

    case 'SELECT_DATASET':
      const selectedDataset = state.datasets.find(
        (ds) => ds.id === action.payload.id
      );
      const previewData = selectedDataset ? [] : state.previewData; // Mock preview data loading

      return {
        ...state,
        selectedIds: [action.payload.id],
        previewData,
      };

    case 'LOAD_DATASET_DETAIL':
      return {
        ...state,
        loading: true,
        currentDataset: null,
        error: null,
      };

    case 'FINISH_LOAD_DETAIL':
      return {
        ...state,
        loading: false,
        currentDataset: action.payload.dataset,
        error: null,
      };

    case 'UPDATE_CHART_CONFIG':
      return {
        ...state,
        chartConfig: action.payload.config,
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

    case 'SET_DATASETS':
      return {
        ...state,
        datasets: action.payload.datasets,
      };

    default:
      return state;
  }
};

// Action creators
export const applyFilter = (filter: Filter): ExploreDataAction => ({
  type: 'APPLY_FILTER',
  payload: filter,
});

export const removeFilter = (field: string): ExploreDataAction => ({
  type: 'REMOVE_FILTER',
  payload: { field },
});

export const clearFilters = (): ExploreDataAction => ({
  type: 'CLEAR_FILTERS',
});

export const updateSearch = (term: string): ExploreDataAction => ({
  type: 'UPDATE_SEARCH',
  payload: { term },
});

export const selectDataset = (id: string): ExploreDataAction => ({
  type: 'SELECT_DATASET',
  payload: { id },
});

export const loadDatasetDetail = (id: string): ExploreDataAction => ({
  type: 'LOAD_DATASET_DETAIL',
  payload: { id },
});

export const finishLoadDetail = (dataset: any): ExploreDataAction => ({
  type: 'FINISH_LOAD_DETAIL',
  payload: { dataset },
});

export const updateChartConfig = (config: any): ExploreDataAction => ({
  type: 'UPDATE_CHART_CONFIG',
  payload: { config },
});

export const setLoading = (loading: boolean): ExploreDataAction => ({
  type: 'SET_LOADING',
  payload: { loading },
});

export const setError = (error: string | null): ExploreDataAction => ({
  type: 'SET_ERROR',
  payload: { error },
});

export const setDatasets = (datasets: DatasetRow[]): ExploreDataAction => ({
  type: 'SET_DATASETS',
  payload: { datasets },
});

// Selectors
export const getFilteredRows = (
  datasets: DatasetRow[],
  filters: Filter[],
  searchTerm: string
): DatasetRow[] => {
  let filtered = [...datasets];

  // Apply text search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.description.toLowerCase().includes(term) ||
        row.domain.toLowerCase().includes(term)
    );
  }

  // Apply filters
  filters.forEach((filter) => {
    switch (filter.op) {
      case 'equals':
        filtered = filtered.filter(
          (row) => row[filter.field as keyof DatasetRow] === filter.value
        );
        break;
      case 'contains':
        filtered = filtered.filter((row) =>
          String(row[filter.field as keyof DatasetRow])
            .toLowerCase()
            .includes(filter.value.toLowerCase())
        );
        break;
      case 'gte':
        filtered = filtered.filter(
          (row) => Number(row[filter.field as keyof DatasetRow]) >= filter.value
        );
        break;
      case 'lte':
        filtered = filtered.filter(
          (row) => Number(row[filter.field as keyof DatasetRow]) <= filter.value
        );
        break;
      case 'range':
        filtered = filtered.filter((row) => {
          const value = Number(row[filter.field as keyof DatasetRow]);
          return value >= filter.value.min && value <= filter.value.max;
        });
        break;
      default:
        break;
    }
  });

  return filtered;
};
