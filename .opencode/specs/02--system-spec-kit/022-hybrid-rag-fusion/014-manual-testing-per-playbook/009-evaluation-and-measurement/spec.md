---
title: "Feature Specification: evaluation-and-measurement [template:level_1/spec.md]"
description: "Phase 009 manual testing packet for evaluation-and-measurement coverage. Documents the 16 mapped playbook scenarios, feature catalog links, and evidence-driven acceptance criteria for measurement-focused validation."
trigger_phrases:
  - "evaluation and measurement manual testing"
  - "phase 009 measurement tests"
  - "manual testing playbook NEW-005"
  - "manual testing playbook NEW-126"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: evaluation-and-measurement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `008-bug-fixes-and-data-integrity` |
| **Successor Phase** | `010-graph-signal-activation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for evaluation-and-measurement need structured per-phase documentation instead of relying on scattered playbook rows. Phase 009 covers 16 measurement-focused scenarios, so reviewers need one packet that preserves the mapped feature links, acceptance criteria, and evidence expectations for each test.

### Purpose
Provide a single Phase 009 specification that maps every evaluation-and-measurement scenario to its feature catalog entry and defines the documentation requirements needed for consistent manual execution and verdicting.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 009 manual testing documentation for all 16 `NEW-*` scenarios assigned to `Measurement tests` in the parent phase map.
- Per-scenario mapping from playbook test ID to the evaluation-and-measurement feature catalog entry.
- Documentation expectations for prompts, execution records, evidence, and verdict capture.

### Out of Scope
- Executing the tests and recording final runtime outcomes.
- Code or schema changes in the MCP server or evaluation libraries.
- Creating evidence artifacts beyond the documentation packet itself.

### Scenario Mapping

| Test ID | Scenario Name | Feature Catalog Link | Playbook Command Summary | Evidence Focus |
|---------|---------------|----------------------|--------------------------|----------------|
| NEW-005 | Evaluation database and schema | [09--evaluation-and-measurement/01-evaluation-database-and-schema.md](../../feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md) | Trigger retrieval events, inspect eval DB tables, and confirm separation from the main memory DB. | Eval DB schema dump, retrieval event rows, and main DB integrity check. |
| NEW-006 | Core metric computation | [09--evaluation-and-measurement/02-core-metric-computation.md](../../feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md) | Seed ground truth, run the metric battery, and verify the returned metric set. | Per-metric output showing precision, recall, MRR, and NDCG values. |
| NEW-007 | Observer effect mitigation | [09--evaluation-and-measurement/03-observer-effect-mitigation.md](../../feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md) | Induce an eval logging failure, run search, and compare behavior with and without the fault. | Search output and timing comparison during forced logging failure. |
| NEW-008 | Full-context ceiling evaluation | [09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md](../../feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md) | Build the title-summary corpus, run ceiling ranking, and compare against hybrid and BM25 baselines. | Ceiling ranking output and comparison table against other baselines. |
| NEW-009 | Quality proxy formula | [09--evaluation-and-measurement/05-quality-proxy-formula.md](../../feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md) | Export logs, compute the proxy formula manually, and compare the stored value. | Log export, manual worksheet, and stored proxy comparison. |
| NEW-010 | Synthetic ground truth corpus | [09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../../feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md) | Open the corpus, count intents and tiers, and verify hard negatives plus non-trigger prompts. | Corpus audit report with intent counts, hard negatives, and tier histogram. |
| NEW-011 | BM25-only baseline | [09--evaluation-and-measurement/07-bm25-only-baseline.md](../../feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md) | Disable non-BM25 channels, run the corpus twice, and record MRR@5. | Baseline output with MRR@5 and a trace showing BM25-only activity. |
| NEW-012 | Agent consumption instrumentation | [09--evaluation-and-measurement/08-agent-consumption-instrumentation.md](../../feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md) | Trigger retrieval handlers, inspect the logger gate, and confirm inert telemetry behavior. | Instrumentation trace showing handler wiring, gate state, and no telemetry output. |
| NEW-013 | Scoring observability | [09--evaluation-and-measurement/09-scoring-observability.md](../../feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md) | Run repeated searches, inspect sampled rows, then force a write error to confirm fail-safe behavior. | Observability log rows, forced-error output, and sampling-rate verification. |
| NEW-014 | Full reporting and ablation study framework | [09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../../feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md) | Run a channel-off ablation, inspect persisted snapshots, and validate dashboard output. | Ablation snapshots plus dashboard text or JSON output with per-channel metrics. |
| NEW-015 | Shadow scoring and channel attribution | [09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md](../../feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md) | Toggle shadow flags, confirm inert ranking behavior, and inspect attribution metadata. | Search output showing attribution metadata and unchanged live ranking. |
| NEW-072 | Test quality improvements | [09--evaluation-and-measurement/12-test-quality-improvements.md](../../feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md) | Inspect changed tests, verify teardown and assertion quality, and record reliability notes. | Test inspection notes covering teardown, assertion specificity, and flake signals. |
| NEW-082 | Evaluation and housekeeping fixes | [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md) | Run restart plus eval checks, verify run ID and upsert behavior, and inspect boundary guards. | Eval run output, run ID evidence, upsert verification, and boundary guard checks. |
| NEW-088 | Cross-AI validation fixes | [09--evaluation-and-measurement/14-cross-ai-validation-fixes.md](../../feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md) | Inspect each Tier-4 fix location, run representative flows, and record corrected behavior. | Fix-location inspection notes, representative flow output, and regression checks. |
| NEW-090 | INT8 quantization evaluation | [09--evaluation-and-measurement/16-int8-quantization-evaluation.md](../../feature_catalog/09--evaluation-and-measurement/16-int8-quantization-evaluation.md) | Gather threshold metrics, compare against go/no-go criteria, and record the decision outcome. | Metrics summary and documented decision rationale. |
| NEW-126 | Memory roadmap baseline snapshot | [09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md](../../feature_catalog/09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md) | Run `cd .opencode/skill/system-spec-kit/mcp_server && npm test -- --run tests/memory-state-baseline.vitest.ts`. | Targeted test transcript showing persisted snapshots and missing-context fallback coverage. |

### Acceptance Scenarios

#### Acceptance Scenario A: Runtime measurement checks
- Cover MCP-backed execution for NEW-005 through NEW-015 and NEW-126.
- Verify the packet preserves prompts, command sequences, evidence targets, and PASS/FAIL verdict rules for eval DB isolation, metric computation, observer-effect protection, ablation reporting, channel attribution, and baseline snapshot persistence.

#### Acceptance Scenario B: Audit and decision review checks
- Cover inspection-heavy scenarios NEW-072, NEW-082, NEW-088, and NEW-090.
- Verify the packet preserves inspection guidance, evidence expectations, and PASS/PARTIAL/FAIL decision paths for test quality review, housekeeping reliability, cross-AI fix verification, and INT8 no-go re-evaluation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 009 requirements and scenario mapping for measurement tests |
| `plan.md` | Create | Phase 009 execution plan for manual and MCP-based measurement coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-005 evaluation database/schema isolation checks. | PASS: Eval data isolated in dedicated tables; main DB unaffected; FAIL: Eval writes pollute main memory tables |
| REQ-002 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-006 core metric computation coverage. | PASS: All core metrics computed with values in [0,1] range; FAIL: Missing metrics or out-of-range values |
| REQ-003 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-007 observer-effect mitigation behavior. | PASS: Search completes successfully and returns expected results despite logging failure; FAIL: Search fails or blocks on logging error |
| REQ-004 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-008 full-context ceiling evaluation. | PASS: Ceiling evaluation completes with scores >= other baselines; FAIL: Ceiling score lower than hybrid or BM25 |
| REQ-005 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-009 quality proxy verification. | PASS: Stored quality proxy matches manual computation within 0.01 tolerance; FAIL: Deviation > 0.01 or missing formula components |
| REQ-006 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-010 synthetic ground-truth corpus auditing. | PASS: >=3 intent categories covered, >=5 hard negatives, >=3 non-trigger prompts; FAIL: Missing category or zero hard negatives |
| REQ-007 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-011 BM25-only baseline measurement. | PASS: MRR@5 is deterministic across 2 runs and only BM25 channel active; FAIL: Non-BM25 channels contribute or MRR varies |
| REQ-008 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-012 agent consumption instrumentation in inert mode. | PASS: Handlers execute without error and produce no telemetry output (inert mode); FAIL: Telemetry output produced or handler errors |
| REQ-009 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-013 scoring observability sampling and fail-safe logging. | PASS: Sampled rows logged at expected rate and write error produces graceful fallback; FAIL: No sampled rows or search crashes on write error |
| REQ-010 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-014 ablation and reporting workflow coverage. | PASS: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output; FAIL: Missing channel data or dashboard generation error |
| REQ-011 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-015 shadow scoring deactivation and attribution continuity. | PASS: Shadow flags produce no ranking change and attribution metadata is intact; FAIL: Shadow mode affects live ranking or attribution missing |
| REQ-012 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-072 test quality review coverage. | PASS if changed tests follow quality patterns (proper teardown, specific assertions, no flaky timing) |
| REQ-013 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-082 evaluation and housekeeping reliability checks. | PASS if run-IDs are unique, upserts produce consistent state, and boundary guards reject invalid values |
| REQ-014 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-088 cross-AI validation fix verification. | PASS if all tier-4 fix locations produce corrected behavior and no regressions are observed |
| REQ-015 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-090 INT8 quantization decision review. | PASS if no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale |
| REQ-016 | Document how Phase 009 captures prompt, execution record, evidence, and verdict details for NEW-126 memory roadmap baseline snapshot verification. | PASS if `memory-state-baseline.vitest.ts` completes with all tests passing and no failures |

### P1 - Required (complete OR user-approved deferral)
- No additional P1 requirements; Phase 009 readiness depends on complete P0 coverage for all 16 mapped scenarios.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 16 Phase 009 tests are documented with their exact prompts, mapped feature links, expected execution method, required evidence, and final verdict path.
- **SC-002**: The packet preserves the parent phase-map coverage for `Measurement tests` with no missing IDs and no duplicate scenario mappings.
- **SC-003**: Reviewers can evaluate every scenario against the playbook verdict model using prompts, commands or inspections, evidence notes, and PASS/PARTIAL/FAIL outcomes.
- **SC-004**: Release-readiness review for this phase can confirm 100% feature coverage with no scenario left undocumented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manual testing playbook source | Source of prompts, evidence expectations, and pass/fail criteria | Keep Phase 009 language aligned to the playbook rows for NEW-005..015, NEW-072, NEW-082, NEW-088, NEW-090, and NEW-126 |
| Dependency | Feature catalog group `09--evaluation-and-measurement` | Source of feature summaries such as isolated eval DB schema, ablation reporting, baseline snapshot persistence, and INT8 NO-GO status | Preserve one catalog link per test ID and use catalog summaries to frame execution context |
| Dependency | MCP runtime and test harness | Needed for retrieval events, ablation runs, dashboard output, and `memory-state-baseline.vitest.ts` execution | Limit runtime-oriented scenarios to environments where MCP tools and Node test commands are available |
| Risk | Stateful evaluation artifacts contaminate repeated measurements | Re-runs may blur isolation or reproducibility checks | Use disposable eval/context DBs or reset fixtures before repeated measurement scenarios |
| Risk | Evidence capture is incomplete even when behavior passes | Reviewers may only reach PARTIAL verdicts | Require prompt, command or inspection notes, evidence references, and verdict rationale for every scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which seeded dataset or fixture set should be treated as the canonical baseline for repeatable comparisons in NEW-008, NEW-011, and NEW-014?
- Should NEW-005, NEW-082, and NEW-126 always run against disposable eval/context databases, or is a shared sandbox with explicit reset steps sufficient?
<!-- /ANCHOR:questions -->

---
