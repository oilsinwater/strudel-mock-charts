import { describe, expect, it } from 'vitest';
import {
  getComparisonRows,
  getHistoryForDataset,
  initialQualityBenchmarkState,
  qualityBenchmarkReducer,
  setBenchmarkRows,
  setSelectedIds,
  toggleBaseline,
} from '../-context/actions';
import { BenchmarkRow } from '../-config/taskflow.types';

const sampleRows: BenchmarkRow[] = [
  {
    id: 'ds-001',
    baseline: 'ds-001',
    qualityScore: 0.9,
    completeness: 95,
    anomalyRate: 4.2,
    drift: 0.1,
    lastUpdated: '2024-03-20',
  },
  {
    id: 'ds-002',
    baseline: 'ds-001',
    qualityScore: 0.85,
    completeness: 91,
    anomalyRate: 6.1,
    drift: 0.4,
    lastUpdated: '2024-03-19',
  },
];

describe('qualityBenchmarkReducer', () => {
  it('sets benchmark rows and defaults baseline to first row', () => {
    const nextState = qualityBenchmarkReducer(
      initialQualityBenchmarkState,
      setBenchmarkRows(sampleRows)
    );

    expect(nextState.benchmarkRows).toHaveLength(2);
    expect(nextState.baselineId).toBe('ds-001');
  });

  it('updates selected ids and keeps baseline within selection', () => {
    const withRows = qualityBenchmarkReducer(
      initialQualityBenchmarkState,
      setBenchmarkRows(sampleRows)
    );

    const withSelection = qualityBenchmarkReducer(
      { ...withRows, baselineId: 'ds-002' },
      setSelectedIds(['ds-002'])
    );

    expect(withSelection.selectedIds).toEqual(['ds-002']);
    expect(withSelection.baselineId).toBe('ds-002');
  });

  it('toggles baseline when requested', () => {
    const withRows = qualityBenchmarkReducer(
      initialQualityBenchmarkState,
      setBenchmarkRows(sampleRows)
    );

    const toggled = qualityBenchmarkReducer(withRows, toggleBaseline('ds-002'));
    expect(toggled.baselineId).toBe('ds-002');
  });
});

describe('selectors', () => {
  it('filters comparison rows by selected ids', () => {
    const rows = getComparisonRows(sampleRows, ['ds-002'], []);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe('ds-002');
  });

  it('returns history entries for matching dataset', () => {
    const history = getHistoryForDataset(
      [
        {
          entryId: 'bh-001',
          datasetId: 'ds-001',
          date: '2024-03-20',
          qualityScore: 0.88,
          anomalyCount: 4,
          outlierColumns: 1,
          meanTemperature: 42,
          meanPressure: 2.1,
        },
        {
          entryId: 'bh-002',
          datasetId: 'ds-002',
          date: '2024-03-20',
          qualityScore: 0.9,
          anomalyCount: 3,
          outlierColumns: 0,
          meanTemperature: 37,
          meanPressure: 1.6,
        },
      ],
      'ds-002'
    );

    expect(history).toHaveLength(1);
    expect(history[0].datasetId).toBe('ds-002');
  });
});
