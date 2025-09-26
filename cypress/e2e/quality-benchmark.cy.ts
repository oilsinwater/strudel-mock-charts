describe('Quality Benchmark Taskflow', () => {
  beforeEach(() => {
    cy.visit('/quality-benchmark');
  });

  it('loads index and shows header', () => {
    cy.get('[data-testid="qb-header"]').should('exist');
    cy.contains('Benchmark Dataset Quality').should('exist');
    cy.contains(
      'Compare data readiness scores, anomaly rates, and drift metrics'
    ).should('exist');
  });

  it('displays dataset picker and selection summary', () => {
    cy.get('[data-testid="dataset-picker"]').should('exist');
    cy.get('[data-testid="selection-summary"]').should('exist');
  });

  it('can filter benchmarks by quality metrics', () => {
    cy.get('[data-testid="metric-filters"]').should('exist');

    // Enable quality score filter
    cy.get('[data-testid="metric-quality-score-toggle"]').click();
    cy.get('[data-testid="quality-score-slider"]').should('exist');

    // Enable completeness filter
    cy.get('[data-testid="metric-completeness-toggle"]').click();
    cy.get('[data-testid="completeness-slider"]').should('exist');

    // Clear all filters
    cy.get('[data-testid="clear-filters-button"]').click();
  });

  it('can select datasets and navigate to compare', () => {
    // Select first two datasets
    cy.get('[data-testid="dataset-picker"] .MuiDataGrid-row').first().click();
    cy.get('[data-testid="dataset-picker"] .MuiDataGrid-row').eq(1).click();

    // Compare button should be enabled
    cy.contains('Compare Selected').should('not.be.disabled');
    cy.contains('Compare Selected').click();

    // Should navigate to compare page
    cy.url().should('include', '/quality-benchmark/compare');
  });

  it('can select baseline and view report', () => {
    // Select first dataset as baseline
    cy.get('[data-testid="dataset-picker"] .MuiDataGrid-row').first().click();

    // View report button should be enabled
    cy.get('[data-testid="view-report"]').should('not.be.disabled');
    cy.get('[data-testid="view-report"]').click();

    // Should navigate to report page
    cy.url().should('include', '/quality-benchmark/report/');
  });

  it('integrates with explore-data taskflow', () => {
    // Visit with pre-selected datasets from explore-data
    cy.visit('/quality-benchmark?ids=ds-001,ds-002&origin=explore-data');

    // Should show origin flow information
    cy.get('[data-testid="selection-summary"]').should(
      'contain',
      'explore-data'
    );

    // Should have datasets pre-selected
    cy.get('[data-testid="dataset-picker"] .Mui-selected').should(
      'have.length',
      2
    );
  });

  it('displays quality metrics correctly', () => {
    cy.get('[data-testid="dataset-picker"]').should('contain', 'Quality Score');
    cy.get('[data-testid="dataset-picker"]').should('contain', 'Completeness');
    cy.get('[data-testid="dataset-picker"]').should('contain', 'Anomaly Rate');
    cy.get('[data-testid="dataset-picker"]').should('contain', 'Drift');

    // Check that values are formatted correctly
    cy.get('[data-testid="dataset-picker"]').should('contain', '%');
  });
});

describe('Quality Benchmark Compare Page', () => {
  beforeEach(() => {
    cy.visit('/quality-benchmark/compare?ids=ds-001,ds-002&baseline=ds-001');
  });

  it('displays comparison metrics matrix', () => {
    cy.get('[data-testid="metrics-matrix"]').should('exist');
    cy.contains('Quality Score').should('exist');
    cy.contains('Completeness').should('exist');
    cy.contains('Anomaly Rate').should('exist');
    cy.contains('Drift').should('exist');
  });

  it('shows insights panel with comparison analysis', () => {
    cy.get('[data-testid="insights-panel"]').should('exist');
    cy.contains('Key Insights').should('exist');
  });

  it('displays trend mini charts for selected datasets', () => {
    cy.get('[data-testid="trend-mini-charts"]').should('exist');
  });
});

describe('Quality Benchmark Report Page', () => {
  beforeEach(() => {
    cy.visit(
      '/quality-benchmark/report/ds-001?origin=explore-data&baseline=ds-001'
    );
  });

  it('displays detailed quality report', () => {
    cy.contains('Quality Report').should('exist');
    cy.get('[data-testid="quality-metrics"]').should('exist');
  });

  it('shows historical timeline', () => {
    cy.get('[data-testid="history-timeline"]').should('exist');
  });

  it('provides navigation back to origin taskflow', () => {
    cy.get('[data-testid="back-to-origin"]').should('exist');
    cy.get('[data-testid="back-to-origin"]').click();
    cy.url().should('include', '/explore-data');
  });
});
