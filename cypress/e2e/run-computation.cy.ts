describe('Run Computation Task Flow', () => {
  beforeEach(() => {
    cy.visit('/run-computation');
  });

  it('should load the index page and display a history of runs', () => {
    cy.findByTestId('rc-history-table').should('be.visible');
    cy.findByText('Run Process Simulation').should('be.visible');
  });

  it('should navigate to the new page', () => {
    cy.findByTestId('rc-new-run-button').click();
    cy.url().should('include', '/new');
    cy.findByText('New Computation Run').should('be.visible');
  });

  it('should allow selecting a dataset and model', () => {
    cy.visit('/run-computation/new');
    cy.findByTestId('rc-dataset-selector').click();
    cy.findByText('exp-2024-03-A').click();
    cy.findByTestId('rc-model-selector').click();
    cy.findByText('Reactor Yield Optimizer').click();
    cy.findByTestId('rc-parameter-form').should('not.be.empty');
  });

  it('should allow configuring parameters and starting a run', () => {
    cy.visit('/run-computation/new');
    cy.findByTestId('rc-dataset-selector').click();
    cy.findByText('exp-2024-03-A').click();
    cy.findByTestId('rc-model-selector').click();
    cy.findByText('Reactor Yield Optimizer').click();
    cy.findByLabelText('Temperature (C)').clear().type('400');
    cy.findByTestId('rc-run-button').click();
    cy.url().should('include', '/results/');
  });

  it('should display run results, including a chart and data table', () => {
    cy.visit('/run-computation/results/run-001');
    cy.findByTestId('rc-results-summary').should('be.visible');
    cy.findByTestId('rc-output-chart').should('be.visible');
    cy.findByTestId('rc-output-table').should('be.visible');
  });

  it('should allow navigating to explore-data with the output dataset', () => {
    cy.visit('/run-computation/results/run-001');
    cy.findByTestId('rc-explore-output-button').click();
    cy.url().should('include', '/explore-data/detail/');
  });
});
