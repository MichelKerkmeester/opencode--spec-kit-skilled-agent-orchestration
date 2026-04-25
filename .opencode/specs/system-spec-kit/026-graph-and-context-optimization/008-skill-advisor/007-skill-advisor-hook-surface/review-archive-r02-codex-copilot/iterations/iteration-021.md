# Iteration 021 — Dimension(s): D7

## Scope this iteration
Reviewed D7 Documentation accuracy because iteration 21 rotates to D7. This pass focused on whether the root operator docs still describe the current measurement and validation surface after the Phase 023-024 additions.

## Evidence read
- .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:35-43 → the table of contents now advertises nine scenario groups: Routing Accuracy, Graph Boosts, Compiler, Regression Safety, SQLite Graph, Hook Routing, Plugin Path, Measurement Run, and Live-Session Telemetry.
- .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:51-53 → the overview still says the playbook provides "34 deterministic scenarios across 6 categories" and repeats that "all 34 scenarios" follow the split-document contract.
- .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:145-149 → the release-readiness rule still requires coverage of "100% of the 34 scenarios linked in this root document."
- .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291 → MR-001 tells operators to expect "`results.jsonl` has 200 records."
- .opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:635 → the feature catalog names the emitted per-prompt JSONL as `smart-router-measurement-results.jsonl`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:103-104 → the measurement harness defaults to `smart-router-measurement-report.md` and `smart-router-measurement-results.jsonl`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-021-01, dimension D7, the root manual-testing playbook understates its own validation scope and hard-codes a stale release-readiness denominator. Evidence: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:35-43` lists nine active scenario groups (including Plugin Path, Measurement Run, and Live-Session Telemetry), but `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:51-53` still describes the package as "34 deterministic scenarios across 6 categories", and `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:145-149` still declares release readiness at "100% of the 34 scenarios linked in this root document." Impact: operators can follow the root playbook and incorrectly judge readiness against an outdated scenario/category count, which weakens the package's own release gate after Phase 023-024 expanded the documented surface. Remediation: update the root summary and readiness rule to the current scenario/category totals derived from the published sections, or derive the denominator from the linked scenario tables instead of freezing it in prose.

### P2 (Suggestion)
id P2-021-01, dimension D7, the measurement run playbook names the wrong output JSONL artifact. Evidence: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291` tells operators to look for `results.jsonl`, while `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:635` documents `smart-router-measurement-results.jsonl` and `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:103-104` sets `DEFAULT_JSONL_PATH` to `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl`. Impact: the MR-001 procedure can send reviewers to a nonexistent or ambiguous filename after a corpus run, creating avoidable validation friction. Remediation: rename the expected MR-001 artifact in the root playbook to `smart-router-measurement-results.jsonl` for consistency with the script and feature catalog.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.10
- cumulative_p0: 0
- cumulative_p1: 12
- cumulative_p2: 12
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Advance D1 by re-checking whether the documented privacy and disable-flag guarantees still match the plugin and runtime hook implementations.
