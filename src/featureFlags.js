// Feature flags — Level 3 is baseline. Level 4/5 features are disabled.
export const FEATURE_FLAGS = {
  // Level 3 — ENABLED
  inventoryReconciliation: true,
  auditApprovalWorkflow: true,
  foundationModelRegistry: true,
  doraMappingPanel: true,
  roleBasedViews: true,

  // TODO: Level 4 — Predictive risk scoring, SIEM/CSPM live feeds
  predictiveRiskScoring: false,
  siemLiveFeed: false,
  continuousBiasMonitoring: false,

  // TODO: Level 5 — Hallucination pipelines, board scenario simulators
  hallucinationTestingPipeline: false,
  boardScenarioSimulator: false,
};
