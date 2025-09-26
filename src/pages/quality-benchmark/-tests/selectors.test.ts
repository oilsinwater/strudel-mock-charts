import { describe, expect, it } from 'vitest';
import { deriveFiltersFromExplore, getBaselineRow } from '../-context/actions';
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

describe('getBaselineRow', () => {
  it('returns first row when baseline missing', () => {
    const row = getBaselineRow(sampleRows, null);
    expect(row?.id).toBe('ds-001');
  });

  it('returns matching baseline when present', () => {
    const row = getBaselineRow(sampleRows, 'ds-002');
    expect(row?.id).toBe('ds-002');
  });
});

describe('deriveFiltersFromExplore', () => {
  it('maps explore quality_score filters to metric filters', () => {
    const filters = deriveFiltersFromExplore([
      { field: 'quality_score', op: 'gte', value: 0.8 },
      { field: 'completeness', op: 'lte', value: 90 },
    ]);

    expect(filters).toHaveLength(2);
    expect(filters[0]).toEqual({
      metric: 'qualityScore',
      threshold: 0.8,
      direction: 'gt',
    });
    expect(filters[1]).toEqual({
      metric: 'completeness',
      threshold: 90,
      direction: 'lt',
    });
  });
});
