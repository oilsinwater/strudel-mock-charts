export interface DatasetRow {
  id: string;
  name: string;
  description: string;
  rowCount: number;
  columnCount: number;
  fileSize: number;
  format: string;
  domain: string;
  lastModified: string;
  quality_score: number;
  completeness: number;
}

export interface SampleDataRow {
  rowId: string;
  datasetId: string;
  temperature: number;
  pressure: number;
  concentration: number;
  ph_level: number;
  timestamp: string;
}

export interface Filter {
  field: string;
  op: string;
  value: any;
}

export interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  rowCount: number;
  columns: string[];
  lastModified: string;
  fileSize: number;
  format: string;
  domain: string;
  quality_score: number;
  completeness: number;
  sampleData: SampleDataRow[];
}

export interface ChartConfig {
  type: 'scatter' | 'line' | 'bar' | 'histogram';
  xAxis: string;
  yAxis: string;
  groupBy?: string;
}

export interface ExploreDataState {
  selectedIds: string[];
  filters: Filter[];
  searchTerm: string;
  currentDataset: DatasetInfo | null;
  chartConfig: ChartConfig;
  loading: boolean;
  error: string | null;
  previewData: SampleDataRow[];
  datasets: DatasetRow[];
}

export type ExploreDataAction =
  | { type: 'APPLY_FILTER'; payload: Filter }
  | { type: 'REMOVE_FILTER'; payload: { field: string } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'UPDATE_SEARCH'; payload: { term: string } }
  | { type: 'SELECT_DATASET'; payload: { id: string } }
  | { type: 'LOAD_DATASET_DETAIL'; payload: { id: string } }
  | { type: 'FINISH_LOAD_DETAIL'; payload: { dataset: DatasetInfo } }
  | { type: 'UPDATE_CHART_CONFIG'; payload: { config: ChartConfig } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'SET_DATASETS'; payload: { datasets: DatasetRow[] } };

export interface ExploreDataContextValue {
  state: ExploreDataState;
  dispatch: React.Dispatch<ExploreDataAction>;
  filteredRows: DatasetRow[];
  selectedDataset: DatasetInfo | null;
}
