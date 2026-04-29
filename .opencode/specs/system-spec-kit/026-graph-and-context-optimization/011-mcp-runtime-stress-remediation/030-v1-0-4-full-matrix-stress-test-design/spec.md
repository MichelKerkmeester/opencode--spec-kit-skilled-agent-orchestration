---
title: "Spec: v1.0.4 Full-Matrix Stress Test Design"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2"
description: "Design-only Level 3 packet for the full v1.0.4 stress matrix across system-spec-kit feature surfaces and CLI executors. This packet freezes the corpus design, rubric, harness-extension approach, executor matrix, and future execution task ledger without running the stress matrix."
trigger_phrases:
  - "030-v1-0-4-full-matrix-stress-test-design"
  - "v1.0.4 full matrix stress test"
  - "system-spec-kit feature cli matrix"
  - "full-matrix stress design"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"
    last_updated_at: "2026-04-29T11:40:34Z"
    last_updated_by: "codex"
    recent_action: "Design phase complete"
    next_safe_action: "Create or authorize an execution-phase packet, then run T001 smoke validation only"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "corpus-plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:030-v1-0-4-full-matrix-stress-test-design"
      session_id: "030-full-matrix-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Level 3 selected because the design spans 14 feature surfaces, 7 executor surfaces, non-applicable cells, rubric policy, and harness architecture decisions."
      - "This packet is design-only and does not execute any stress matrix cells."
---

# Spec: v1.0.4 Full-Matrix Stress Test Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

This packet designs the full v1.0.4 stress matrix that packet 029 explicitly did not attempt. Packet 029 proved a narrow 12-case telemetry posture: it produced 16 live handler envelopes, scored `93/96 = 96.9%`, kept harness quality flat at `75.4%`, and warned that v1.0.2's 30-cell CLI-model baseline is not exact same-cell comparable (`029-stress-test-v1-0-4/findings-v1-0-4.md:19`, `:23`, `:24`, `:25`, `:27`).

The full-matrix design expands from "search telemetry wiring" to "system-spec-kit feature surface x executor surface x representative scenario." The theoretical maximum is `14 features x 7 executors x 3 scenarios = 294` scenario cells; the execution packet must mark non-applicable cells explicitly and should expect roughly 220-260 applicable or fixture-only cells after reachability pruning.

**Key Decisions**: Use Level 3, keep this packet design-only, score on the generalized 4-dimension rubric, choose per-feature runners plus a meta-aggregator, and treat the full matrix as a new baseline rather than comparing percentages directly to v1.0.2, v1.0.3, or packet 029.

**Critical Dependencies**: The execution phase needs CLI authentication, disposable spec sandboxes, stable MCP/build state, optional CocoIndex availability, and a declared aggregation artifact contract before any matrix run starts.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Design Complete; Execution Pending |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Target authority** | Writes only under this packet folder |
| **Executor requested for this design phase** | cli-codex gpt-5.5 xhigh, service-tier=null; current Codex session authored directly because cli-codex self-invocation is prohibited by its own skill (`.opencode/skill/cli-codex/SKILL.md:12`, `:16`, `:38`). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The prior v1.0.4 run was scoped honestly but narrowly. It reused the v1.0.3 12-case search-quality telemetry layout, mocked retrieval at the `executePipeline` boundary, and validated handler/harness telemetry rather than the complete system-spec-kit feature surface (`029-stress-test-v1-0-4/findings-v1-0-4.md:31`, `:33`, `:35`, `:150`, `:151`).

The current catalog and manual testing playbook are much broader. The feature catalog root lists categories from retrieval through context preservation/code graph (`feature_catalog.md:18`, `:39`), while the manual playbook declares 22 numbered category roots and a real-execution policy for scenarios (`manual_testing_playbook.md:9`, `:18`, `:40`). The stress design therefore needs a matrix that covers feature breadth and executor variance instead of another mcp_server-only proof.

### Purpose

Define a complete, reproducible, future-run-ready full-matrix stress test for system-spec-kit v1.0.4 across feature surfaces, CLI executors, scenarios, rubric scoring, non-applicable cells, telemetry artifacts, and regression review policy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Area | Design Output |
|------|---------------|
| Feature surface inventory | F1-F14 matrix categories with source evidence and representative scenarios |
| Executor surface inventory | cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode, native Task-tool agents, and inline/no-executor MCP |
| Corpus design | Stable scenario IDs, applicability labels, real-vs-fixture classification, skip rules, sample-size guards |
| Rubric design | `correctness`, `robustness`, `telemetry`, `regression-safety`, each scored 0-2 and rolled up per `feature x executor` |
| Harness-extension design | Options A/B/C documented with rationale; recommended architecture chosen in `decision-record.md` |
| Execution sequencing | Future task ledger in `tasks.md`; no matrix execution in this packet |
| Spec hygiene | Description, graph metadata, continuity, strict validator |

### Out of Scope

| Exclusion | Reason |
|-----------|--------|
| Running any matrix cell | The user requested design only. |
| Editing runtime code, harness code, prior packets, or CLI skills | Target authority limits writes to this packet folder. |
| Creating stress findings artifacts | The execution phase owns the full findings markdown artifact, `findings-rubric-v1-0-4-full.json`, and `measurements/*`. |
| Claiming direct comparability to prior percentages | v1.0.2, v1.0.3/029, and the future full matrix use different cell universes. |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Design charter and matrix authority |
| `plan.md` | Create | Corpus, rubric, harness, executor, and sequencing design |
| `tasks.md` | Create | Future execution-phase task ledger |
| `checklist.md` | Create | Design verification and execution DQI gates |
| `decision-record.md` | Create | Level 3 design decisions |
| `corpus-plan.md` | Create | Detailed feature/executor/scenario corpus plan |
| `implementation-summary.md` | Create | Design-phase completion summary |
| `description.json` | Create | Spec folder discovery metadata |
| `graph-metadata.json` | Create | Graph rollout metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Do not run the stress matrix in this packet. | No findings, measurements, CLI dispatch transcripts, or stress execution artifacts are created here. |
| REQ-002 | Do not write outside this packet folder. | `git status --short` shows only files under `030-v1-0-4-full-matrix-stress-test-design/` from this work. |
| REQ-003 | Preserve honest comparability. | Docs state v1.0.2, v1.0.3/029, and the future full matrix are not directly comparable by aggregate percent. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Inventory current feature breadth. | Docs cite the feature catalog and manual playbook category surfaces and note the catalog currently exceeds the shorthand 00-14 framing. |
| REQ-005 | Define F1-F14. | Spec and plan cover all requested surfaces from spec-folder workflow through W3-W13 search features. |
| REQ-006 | Define executor reachability. | Plan identifies entry point, budget, timeout, output contract, and non-applicable examples for every executor. |
| REQ-007 | Define full matrix cell model. | Corpus plan uses stable IDs, `featureId`, `executorId`, `scenarioId`, applicability, invocation type, and expected evidence. |
| REQ-008 | Define scoring and regression policy. | Rubric is the 4 canonical dimensions on 0-2 scale; dropped prior same-cell scores require Hunter -> Skeptic -> Referee. |
| REQ-009 | Choose harness architecture. | Decision record documents Options A/B/C and recommends one. |
| REQ-010 | Provide future execution tasks. | `tasks.md` is ready for a separate execution phase and includes smoke, batches, aggregation, adversarial review, and strict validation. |
| REQ-011 | Strict validator passes. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The execution runner can construct the full planned matrix without reading this conversation.
- **SC-002**: Non-applicable cells are first-class outputs, not silent omissions.
- **SC-003**: Every feature surface has at least two scenario seeds and at least one telemetry or artifact requirement.
- **SC-004**: Every executor surface has a dispatch and return-artifact contract.
- **SC-005**: The design docs make it impossible to misread the future full matrix as a direct continuation of v1.0.2's 30 CLI-model cells or packet 029's 12 telemetry cells.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | CLI auth and provider availability | Real executor cells may be unavailable | Future T001 smoke marks blocked providers `SKIP` with evidence. |
| Dependency | CocoIndex index availability | F8 real-search cells may be blocked | Execution rechecks index status and runs missing-index scenarios when unavailable. |
| Dependency | Disposable write sandboxes | F1/F9/F12 destructive or write cells cannot safely run in-place | Execution packet must create sandbox paths before per-feature batches. |
| Risk | Matrix size reaches roughly 220-260 applicable cells | Cost and rate limits can interrupt the first run | Batch by feature, stream JSONL, and resume by cell ID. |
| Risk | Prior-cycle aggregate comparisons look tempting but invalid | Misleading release verdict | Treat the full matrix as baseline `full-matrix-v1`; prior cycles are directional only. |
| Risk | Fixture-only cells overstate live readiness | False confidence | Require invocation type and telemetry dimension scoring per cell. |

### Discovery Evidence

### Catalog and Playbook Breadth

The root feature catalog says it is the canonical inventory for current runtime behavior and delivered refinements (`feature_catalog.md:142`, `:144`). It also records active category entries and audit totals in the hundreds (`feature_catalog.md:67`, `:69`, `:107`, `:109`). The manual playbook requires real execution, not mock-only claims, and defines the evidence shape for realistic user-driven tests (`manual_testing_playbook.md:9`, `:177`, `:184`, `:205`, `:213`).

The folder inventory found 23 category directories when counting the duplicate `14--pipeline-architecture` and `14--stress-testing` roots separately, plus a `.github` support folder. That means the user's "00-14" shorthand is not the current on-disk category boundary; this design maps that larger current inventory into the requested F1-F14 stress categories rather than pretending the catalog stops at 14.

### Stress-Test Pattern Evidence

The stress-test feature catalog defines a cycle as a frozen corpus, executed cells, evidence, dimension scores, narrative findings, and machine-readable rubric sidecar (`feature_catalog/14--stress-testing/01-stress-test-cycle.md:11`, `:38`, `:49`, `:51`, `:57`). It also defines the verdict ladder and requires Hunter -> Skeptic -> Referee for every REGRESSION (`feature_catalog/14--stress-testing/01-stress-test-cycle.md:59`, `:68`). The manual playbook adds freeze, score, sidecar, aggregate, comparison, telemetry, and strict validator steps (`manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md:29`, `:45`, `:71`, `:85`, `:98`, `:109`, `:117`).

### Current Harness Evidence

The search-quality corpus is deterministic and fixture-based: cases encode expected outcomes and do not call production memory stores (`mcp_server/stress_test/search-quality/corpus.ts:4`, `:5`). The extended corpus has 12 cases after adding W3-W7 workstream cases (`corpus.ts:192`, `:198`). The harness now preserves optional envelope, audit, and shadow telemetry and can write sibling JSONL files through `telemetryExportPath` (`harness.ts:33`, `:45`, `:90`, `:103`, `:199`, `:239`). PP-1's live handler test describes the real and mocked layers explicitly (`handler-memory-search-live-envelope.vitest.ts:3`, `:15`).

### Recent Refinement Evidence

Today's main branch commits include the stress pattern docs, embedding-readiness gate removal, Phase J/K packets, PP-1, PP-2, degraded readiness wiring, deep-review/research contract fixes, and packet 029 v1.0.4 PASS. The relevant commit sequence observed from `git log main --since='2026-04-29 00:00' -14` includes `e91d2c7c2`, `af22aa045`, `c4f738b1d`, `bd0de4b6b`, `649b46576`, and `1dffd42b0`.
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Feature Matrix

| Feature | Surface | Existing Evidence | Scenario Families |
|---------|---------|-------------------|-------------------|
| F1 | Spec-folder workflow | Gate 3 classifier tokens (`shared/gate-3-classifier.ts:68`, `:88`), canonical continuity substrate (`13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md:17`, `:29`) | create/level-routing, strict validation, continuity frontmatter |
| F2 | Skill advisor + skill graph | Native tools and 5-lane fusion (`skill_advisor/README.md:42`, `:47`, `:135`, `:147`) | exact routing, ambiguous routing, stale/disabled fail-open |
| F3 | `memory_search` | Hybrid pipeline, wide parameter surface, response policy (`01--retrieval/02-semantic-and-lexical-search-memorysearch.md:20`, `:32`) | semantic/hybrid, multi-concept, refusal/envelope |
| F4 | `memory_context` | Intent routing, modes, token budget, session transition (`01--retrieval/01-unified-context-retrieval-memorycontext.md:19`, `:29`) | mode routing, pressure/budget, resume/session |
| F5 | `code_graph_query` | Query/status/context tools and fallback decision (`22--context-preservation-and-code-graph/08-code-graph-storage-query.md:11`, `:14`) | outline/calls/imports, blocked full-scan, degraded readiness |
| F6 | `code_graph_scan` / verify | Scan handler and readiness/status tests (`22--context-preservation-and-code-graph/08-code-graph-storage-query.md:29`, `:40`) | incremental scan, full scan, gold battery verify |
| F7 | Causal graph | Six relations, stats, balance metrics (`06--analysis/01-causal-edge-creation-memorycausallink.md:19`, `:25`; `06--analysis/02-causal-graph-statistics-memorycausalstats.md:19`, `:25`) | link/unlink/stats, relation balance, deltaByRelation |
| F8 | CocoIndex search | Semantic search skill and bridge metadata (`mcp-coco-index/SKILL.md:12`, `:22`, `:34`; `22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:13`) | semantic code search, missing index, calibration/fidelity |
| F9 | Continuity / generate-context | Save routing, metadata refresh, resume ladder (`13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md:19`, `:29`, `:41`, `:47`) | canonical save, indexing, description/graph refresh |
| F10 | Deep-research / deep-review | Command-owned loops and executor invariants (`sk-deep-research/SKILL.md:47`, `:65`, `:94`, `:120`; `sk-deep-review/SKILL.md:44`, `:61`, `:91`, `:117`) | externalized state, convergence, flat-first artifacts |
| F11 | Hooks | Runtime matrix and shared fail-open behavior (`references/hooks/skill-advisor-hook.md:55`, `:64`, `:76`, `:85`) | advisor hook, Gate 3 classifier, session stop/precompact |
| F12 | Validators | Spec-doc validator rules (`13--memory-quality-and-indexing/26-spec-doc-structure-validator.md:17`, `:25`) | frontmatter block, anchor lint, strict validator |
| F13 | Stress-test cycle pattern | Rubric, sidecar, verdict ladder (`14--stress-testing/01-stress-test-cycle.md:40`, `:49`, `:55`, `:68`) | meta-cycle compliance, honest verdicts, regression review |
| F14 | Search W3-W13 features | Phase F recommended W8-W13 and packet 029 reports W3-W13 verdicts (`020-w3-w7-verification-and-expansion-research/research/research-report.md:64`, `:66`; `029-stress-test-v1-0-4/findings-v1-0-4.md:87`, `:99`) | trust tree, rerank, shadow, calibration, readiness, audit/SLA |

---

### Executor Matrix

| Executor | Reachability | Dispatch Contract | Notes |
|----------|--------------|-------------------|-------|
| cli-codex | Broad from a non-Codex parent; not self-invoked from Codex | `codex exec --model gpt-5.5 -c model_reasoning_effort="xhigh" -c approval_policy=never --sandbox workspace-write`, with service-tier null honored by the execution packet | Skill documents self-invocation prohibition and default invocation shape (`cli-codex/SKILL.md:12`, `:16`, `:168`, `:180`). |
| cli-copilot | Broad but context parity differs | `copilot -p "<cell prompt>" --allow-all-tools --no-ask-user --model <declared>` | Hook context uses custom instructions because stdout does not mutate prompts (`cli-copilot/SKILL.md:183`, `:188`). User-supplied cap: max 3 concurrent dispatches. |
| cli-gemini | Subset; good for codebase/search-style tasks | `gemini "<cell prompt>" -m gemini-3.1-pro-preview -o text`; avoid write cells unless approved in execution packet | Gemini skill documents the only supported model (`cli-gemini/SKILL.md:171`, `:176`, `:180`, `:183`). |
| cli-claude-code | Subset; strong structured output and plan mode | `claude -p "<cell prompt>" --output-format json --permission-mode plan` for read-only cells; execution packet must declare any edit mode | Claude Code supports plan/read-only, JSON, schema, and agent routing (`cli-claude-code/SKILL.md:171`, `:190`, `:204`, `:218`). |
| cli-opencode | Full plugin/skill/MCP surface but heavyweight | `opencode run --agent general --format json --dir <repo> "<cell prompt>"` after provider preflight | OpenCode is the full Spec Kit bridge for plugin/MCP runtime (`cli-opencode/SKILL.md:27`, `:33`, `:179`, `:231`). |
| native | Task tool agents and command-owned deep loops | `/spec_kit:deep-review:auto`, `/spec_kit:deep-research:auto`, or Task-tool agent cells where applicable | Deep-loop skills make YAML state ownership mandatory and LEAF agents non-looping (`sk-deep-review/SKILL.md:44`, `:61`; `sk-deep-research/SKILL.md:47`, `:65`). |
| inline | Current runtime, direct shell/MCP/tool calls, no external model dispatch | Direct handler, script, validator, MCP, or fixture runner call | Best for deterministic tool cells, harness smoke, metadata validation, and non-model scenario setup. |

---

### Execution Constraints

### Performance

- **NFR-P01**: Execution phase must timebox deterministic inline cells to 5 minutes, CLI model cells to 20 minutes, and deep-loop cells to their command-owned executor timeout.
- **NFR-P02**: The aggregator must stream JSONL and avoid loading all raw transcripts into memory at once.

### Reliability

- **NFR-R01**: Every scenario result must be one of `PASS`, `FAIL`, `SKIP`, `UNAUTOMATABLE`, or `NA`.
- **NFR-R02**: Percentiles, rates, and SLA claims below N=30 must carry a directional/sample-size advisory, following packet 029's guard (`029-stress-test-v1-0-4/findings-v1-0-4.md:27`, `:152`).
- **NFR-R03**: Every dropped prior same-cell score must run Hunter -> Skeptic -> Referee before final REGRESSION classification.

### Security

- **NFR-S01**: No production secrets are required by the design. Execution must mark cells `SKIP` with a concrete blocker if a CLI auth surface, provider login, or index credential is missing.
- **NFR-S02**: Destructive memory or spec-folder scenarios must run only in disposable sandboxes, matching playbook destructive-scenario policy (`manual_testing_playbook.md:195`, `:201`).

---

## 8. EDGE CASES

- **Non-applicable cells**: Hook prompt mutation is not reachable through every CLI. Mark those `NA`, and optionally run adapter-level simulation as an inline deterministic companion.
- **Fixture-only cells**: A scenario can pass fixture correctness while failing telemetry or real-invocation robustness. Score dimensions independently.
- **CLI auth unavailable**: Mark `SKIP`, cite the command output, and do not substitute another executor silently.
- **CocoIndex index missing**: Mark the F8 real-search cell `SKIP` or run only the missing-index recovery scenario. The mcp-coco-index skill says not to use semantic search when the codebase has not been indexed (`mcp-coco-index/SKILL.md:45`, `:52`).
- **Deep-loop command misuse**: A direct Task-tool `@deep-review` loop is invalid. The command-owned YAML workflow must own state and convergence (`sk-deep-review/SKILL.md:44`, `:61`).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | 14 feature surfaces, 7 executor surfaces, ~294 theoretical scenario cells |
| Risk | 18/25 | CLI auth variance, MCP runtime variance, sandbox destructive-cell risk, comparability risk |
| Research | 18/20 | Catalog/playbook, 14 commits, prior research, templates, harness, CLI skill surfaces |
| Multi-Agent | 12/15 | Native agents and external CLI executors in execution phase |
| Coordination | 13/15 | Corpus freeze, aggregator, per-feature runners, regression adjudication |
| **Total** | **85/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Matrix size exceeds a single practical run | High | Medium | Batch by feature, stream JSONL, and allow resume from completed cell IDs. |
| R-002 | Aggregates hide non-applicable or skipped surfaces | High | Medium | Report `NA`, `SKIP`, and `UNAUTOMATABLE` outside the denominator and in headline counts. |
| R-003 | Future runner compares aggregate percent to v1.0.2 or 029 as if same-cell | High | High | Sidecar must set `comparison.comparable=false` for those cycles and create this run as baseline `full-matrix-v1`. |
| R-004 | CLI models mutate workspace during test | Medium | Medium | Execution packet must use disposable sandboxes and scoped prompts; write cells get explicit target authority. |
| R-005 | Feature cannot be stressed without secrets or unavailable index | Medium | Medium | Mark `SKIP` with concrete blocker; do not fabricate fixture proof as live proof. |

---

## 11. USER STORIES

### US-001: Full Feature Coverage (Priority: P0)

**As a** system-spec-kit maintainer, **I want** a matrix that covers every requested feature surface, **so that** stress results cannot overfit to the memory_search telemetry seam.

**Acceptance Criteria**:
1. **Given** the execution corpus, **When** the matrix is built, **Then** F1-F14 each have scenario cells and evidence requirements.
2. **Given** any F-category has fewer than two scenario seeds, **When** the manifest freezes, **Then** the aggregator rejects the manifest before scoring starts.

### US-002: Executor Variance Coverage (Priority: P0)

**As a** runtime operator, **I want** the same feature cells tested through every applicable CLI executor, **so that** executor-specific failures are visible instead of collapsed into inline-only results.

**Acceptance Criteria**:
1. **Given** the executor roster, **When** a cell is not reachable, **Then** the result records `NA` with a reason rather than silently omitting the executor.
2. **Given** CLI auth is unavailable, **When** T001 smoke runs, **Then** the executor records `SKIP` with command evidence instead of substituting another CLI.

### US-003: Honest Regression Reporting (Priority: P1)

**As a** release reviewer, **I want** dropped scores reviewed adversarially, **so that** noisy sample variance does not become an unearned REGRESSION label.

**Acceptance Criteria**:
1. **Given** a dropped same-cell score, **When** findings are authored, **Then** Hunter -> Skeptic -> Referee appears inline before any final REGRESSION verdict.
2. **Given** the only available prior cycle is v1.0.2, v1.0.3, or packet 029, **When** regression-safety is scored, **Then** the sidecar marks that comparison `comparable=false`.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None for the design phase. Execution may still need operator answers for provider auth, run budget, whether to create a sibling execution packet, and whether to implement the recommended meta-aggregator before the first full run.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Corpus Plan**: See `corpus-plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
