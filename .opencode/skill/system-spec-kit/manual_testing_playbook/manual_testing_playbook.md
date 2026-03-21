---
title: "Spec Kit Memory: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the Spec Kit Memory MCP server."
---

# Spec Kit Memory: Manual Testing Playbook

This document combines the full manual-validation contract for the Spec Kit Memory MCP server into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for canonical Spec Kit operator validation. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail now lives in the numbered category folders at the playbook root.

Canonical source artifacts:
- `.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/07--evaluation/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. EXISTING FEATURES](#7--existing-features)
- [8. FEATURES](#8--features)
- [9. PHASE SYSTEM FEATURES](#9--phase-system-features)
- [10. DEDICATED MEMORY/SPEC-KIT SCENARIOS](#10--dedicated-memoryspec-kit-scenarios-required)
- [11. AUTOMATED TEST CROSS-REFERENCE](#11--automated-test-cross-reference)
- [12. FEATURE CATALOG CROSS-REFERENCE INDEX](#12--feature-catalog-cross-reference-index)
- [13. GEMINI OVERLAY SCENARIO PACKS](#13--gemini-overlay-scenario-packs)

---

## 1. OVERVIEW

This playbook is the operator-facing manual validation directory for canonical Spec Kit features. It preserves the existing EX/PHASE/M scenario IDs and numbered feature entries, keeps root-level summaries readable, and links each scenario to a dedicated feature file with the full execution contract. Those per-feature files should mirror the feature-catalog snippet style: prose-first explanation, current reality, structured source references, and concise metadata.

Coverage note (2026-03-18): runtime-labeled scenarios in this playbook primarily prove shared-backend behavior plus multi-runtime capture/save-path handling. Unless a scenario explicitly drives a Hydra feature through a given CLI, treat runtime labels as repo-backed coverage only and not as full end-to-end Hydra parity proof for that CLI.

### Realistic Test Model

These manual tests should mimic real user behavior, not just isolated command execution. The preferred execution shape is:

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What The Feature Files Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome, not just the internal tool output

---

## 2. GLOBAL PRECONDITIONS
1. Working directory is project root.
2. Feature summary files are accessible.
3. Spec/memory commands are available in the runtime.
4. Manual execution logging is enabled (terminal transcript capture).
5. Destructive scenarios (`EX-008`, `EX-009`, `EX-018`, `EX-021`) MUST run only in a disposable sandbox spec folder (for example `specs/test-sandbox`), never in active project folders.
6. Before each destructive scenario, create and record a named checkpoint for rollback evidence.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS
- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets
- Final user-facing response or outcome summary
- Artifact path or output reference
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION
- Replace placeholders before execution: `<target-spec>`, `<sandbox-spec>`, `<memory-id>`, `<checkpoint-name>`.
- Do not execute literal ellipsis (`...`) or omitted-argument forms; transcripts must contain fully resolved commands.
- For shorthand tool syntax, execute with explicit argument keys in runtime calls.
- When a scenario is orchestrator-led, capture both the realistic user request and the explicit orchestrator prompt before executing the deterministic steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (logs, tool outputs, artifacts)
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-scenario files (`COVERED_SCENARIOS == TOTAL_SCENARIOS`).
4. Feature-catalog cross-reference coverage has been reviewed separately; scenario coverage does not imply a 1:1 feature-file count because the playbook currently contains 201 scenario files while the feature catalog contains 194 feature files.
5. No unresolved blocking triage item remains.

Otherwise release is `NOT READY`.

Deterministic coverage check (run from repository root):

```bash
TOTAL_FEATURES=$(python3 - <<'PY'
from pathlib import Path

root = Path('.opencode/skill/system-spec-kit/manual_testing_playbook')
count = sum(
    1
    for path in root.glob('[0-9][0-9]--*/*.md')
    if path.is_file()
)
print(count)
PY
)
```

Final verdict report must include `COVERED_SCENARIOS/TOTAL_SCENARIOS` and should call out any remaining feature-catalog entries that are automated-only, indirect, or intentionally operator-only.

### Destructive Scenario Rules

- `EX-008`, `EX-009`, `EX-018`, and `EX-021` MUST run on non-production data only.
- Before executing, verify the affected resource can be rebuilt from scratch.
- Never run destructive scenarios in parallel with other scenarios that depend on the same resource.

### Memory/Spec-Kit Mandatory Flows

Treat the root playbook plus referenced per-feature files as the canonical source of truth:
- `M-001 Context Recovery and Continuation`
- `M-002 Targeted Memory Lookup`
- `M-003 Context Save + Index Update`
- `M-004 Main-Agent Review and Verdict Handoff`
- `M-005 Outsourced Agent Memory Capture Round-Trip`
- `M-006 Stateless Enrichment and Alignment Guardrails`

Rule: keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the relevant per-feature file instead of in a separate sidecar document.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

This section records coordinator/worker utilization guidance for assembling or reviewing playbook bundles. It is not a runtime support matrix and does not, by itself, prove Hydra feature parity for Codex, Gemini, or any other CLI.

The wave plans here apply to the split playbook package: the root `manual_testing_playbook.md` acts as the directory, review surface, and orchestration guide, while the detailed scenario contracts live in the numbered category folders at the playbook root.

### Run A: Codex 5.3 xhigh (Observed)

Observed orchestration:
- Hard cap detected: 6 total sub-agent threads
- Effective model: 1 coordinator + 5 workers
- Saturation strategy: full worker saturation in waves

| Runtime | Reported/Observed Capacity | Workers Used | Coordinator | Wave Count | Saturation |
|---|---:|---:|---:|---:|---:|
| Codex 5.3 xhigh | 6 total | 5 | 1 | 2 | 100% while active |

### Run B: Gemini 3.1 Pro Preview (Reported)

Reported orchestration in output:
- 1 coordinator + 14 workers
- 2 waves, 100% stated saturation

| Runtime | Reported/Observed Capacity | Workers Used | Coordinator | Wave Count | Saturation |
|---|---:|---:|---:|---:|---:|
| Gemini 3.1 Pro Preview | 15 total (reported) | 14 | 1 | 2 | 100% (reported) |

### Merged Operational Rule

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs, per-feature files, and ranges to each wave before execution.
5. Run destructive scenarios (`EX-008`, `EX-009`, `EX-018`, `EX-021`) in dedicated sandbox-only waves.
6. After each wave, execute playbook `M-003` (save + index), then begin the next wave via `M-001` continuation.
7. Record utilization table and evidence paths in the final report.

### What Belongs In Per-Feature Files

Use the per-feature files for feature-specific:
- Real user requests
- Orchestrator prompts
- Expected delegation or alternate-CLI routing
- Desired user-visible outcomes
- Isolation constraints or acceptance caveats that do not apply globally

---

## 7. EXISTING FEATURES

### EX-001 | Unified context retrieval (memory_context)

#### Description
Intent-aware context pull.

#### Current Reality
Prompt: `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.`

Relevant bounded context returned; no empty response

#### Test Execution
> **Feature File:** [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md)
> **Catalog:** [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

### EX-002 | Semantic and lexical search (memory_search)

#### Description
Hybrid precision check.

#### Current Reality
Prompt: `Search for checkpoint restore clearExisting transaction rollback. Capture the evidence needed to prove Relevant ranked results with hybrid signals. Return a concise user-facing pass/fail verdict with the main reason.`

Relevant ranked results with hybrid signals

#### Test Execution
> **Feature File:** [EX-002](01--retrieval/002-semantic-and-lexical-search-memory-search.md)
> **Catalog:** [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

### EX-003 | Trigger phrase matching (memory_match_triggers)

#### Description
Fast recall path.

#### Current Reality
Prompt: `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment. Return a concise user-facing pass/fail verdict with the main reason.`

Fast trigger hits + cognitive enrichment

#### Test Execution
> **Feature File:** [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md)
> **Catalog:** [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md)

### EX-004 | Hybrid search pipeline

#### Description
Channel fusion sanity.

#### Current Reality
Prompt: `Validate graph search fallback tiers behavior. Capture the evidence needed to prove Non-empty diverse results; fallback not empty. Return a concise user-facing pass/fail verdict with the main reason.`

Non-empty diverse results; fallback not empty

#### Test Execution
> **Feature File:** [EX-004](01--retrieval/004-hybrid-search-pipeline.md)
> **Catalog:** [01--retrieval/04-hybrid-search-pipeline.md](../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md)

### EX-005 | 4-stage pipeline architecture

#### Description
Stage invariant verification.

#### Current Reality
Prompt: `Search Stage4Invariant score snapshot verifyScoreInvariant. Capture the evidence needed to prove No invariant errors; stable final scoring. Return a concise user-facing pass/fail verdict with the main reason.`

No invariant errors; stable final scoring

#### Test Execution
> **Feature File:** [EX-005](01--retrieval/005-4-stage-pipeline-architecture.md)
> **Catalog:** [01--retrieval/05-4-stage-pipeline-architecture.md](../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md)

### EX-006 | Memory indexing (memory_save)

#### Description
New memory ingestion.

#### Current Reality
Prompt: `Index memory file and report action. Capture the evidence needed to prove Save action reported; searchable result appears; no template-contract or insufficiency rejection. Return a concise user-facing pass/fail verdict with the main reason.`

Save action reported; searchable result appears; no template-contract or insufficiency rejection

#### Test Execution
> **Feature File:** [EX-006](02--mutation/006-memory-indexing-memory-save.md)
> **Catalog:** [02--mutation/01-memory-indexing-memorysave.md](../feature_catalog/02--mutation/01-memory-indexing-memorysave.md)

### EX-007 | Memory metadata update (memory_update)

#### Description
Metadata + re-embed update.

#### Current Reality
Prompt: `Update memory title and triggers. Capture the evidence needed to prove Updated metadata reflected in retrieval. Return a concise user-facing pass/fail verdict with the main reason.`

Updated metadata reflected in retrieval

#### Test Execution
> **Feature File:** [EX-007](02--mutation/007-memory-metadata-update-memory-update.md)
> **Catalog:** [02--mutation/02-memory-metadata-update-memoryupdate.md](../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md)

### EX-008 | Single and folder delete (memory_delete)

#### Description
Atomic single delete.

#### Current Reality
Prompt: `Delete memory ID and verify removal. Capture the evidence needed to prove Deleted item absent from retrieval. Return a concise user-facing pass/fail verdict with the main reason.`

Deleted item absent from retrieval

#### Test Execution
> **Feature File:** [EX-008](02--mutation/008-single-and-folder-delete-memory-delete.md)
> **Catalog:** [02--mutation/03-single-and-folder-delete-memorydelete.md](../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md)

### EX-009 | Tier-based bulk deletion (memory_bulk_delete)

#### Description
Tier cleanup with safety.

#### Current Reality
Prompt: `Delete deprecated tier in scoped folder. Capture the evidence needed to prove Deletion count + checkpoint created. Return a concise user-facing pass/fail verdict with the main reason.`

Deletion count + checkpoint created

#### Test Execution
> **Feature File:** [EX-009](02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md)
> **Catalog:** [02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md)

### EX-010 | Validation feedback (memory_validate)

#### Description
Feedback learning loop.

#### Current Reality
Prompt: `Record positive validation with queryId. Capture the evidence needed to prove Confidence/promotion metadata updates. Return a concise user-facing pass/fail verdict with the main reason.`

Confidence/promotion metadata updates

#### Test Execution
> **Feature File:** [EX-010](02--mutation/010-validation-feedback-memory-validate.md)
> **Catalog:** [02--mutation/05-validation-feedback-memoryvalidate.md](../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md)

### EX-011 | Memory browser (memory_list)

#### Description
Folder inventory audit.

#### Current Reality
Prompt: `List memories in target spec folder. Capture the evidence needed to prove Paginated list and totals. Return a concise user-facing pass/fail verdict with the main reason.`

Paginated list and totals

#### Test Execution
> **Feature File:** [EX-011](03--discovery/011-memory-browser-memory-list.md)
> **Catalog:** [03--discovery/01-memory-browser-memorylist.md](../feature_catalog/03--discovery/01-memory-browser-memorylist.md)

### EX-012 | System statistics (memory_stats)

#### Description
System baseline snapshot.

#### Current Reality
Prompt: `Return stats with composite ranking. Capture the evidence needed to prove Counts, tiers, folder ranking present. Return a concise user-facing pass/fail verdict with the main reason.`

Counts, tiers, folder ranking present

#### Test Execution
> **Feature File:** [EX-012](03--discovery/012-system-statistics-memory-stats.md)
> **Catalog:** [03--discovery/02-system-statistics-memorystats.md](../feature_catalog/03--discovery/02-system-statistics-memorystats.md)

### EX-013 | Health diagnostics (memory_health)

#### Description
Index/FTS integrity check.

#### Current Reality
Prompt: `Run full health and divergent_aliases. Capture the evidence needed to prove healthy/degraded status and diagnostics. Return a concise user-facing pass/fail verdict with the main reason.`

healthy/degraded status and diagnostics

#### Test Execution
> **Feature File:** [EX-013](03--discovery/013-health-diagnostics-memory-health.md)
> **Catalog:** [03--discovery/03-health-diagnostics-memoryhealth.md](../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md)

### EX-014 | Workspace scanning and indexing (memory_index_scan)

#### Description
Incremental sync run.

#### Current Reality
Prompt: `Run index scan for changed docs. Capture the evidence needed to prove Scan summary and updated index state. Return a concise user-facing pass/fail verdict with the main reason.`

Scan summary and updated index state

#### Test Execution
> **Feature File:** [EX-014](04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md)
> **Catalog:** [04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md](../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md)

### EX-015 | Checkpoint creation (checkpoint_create)

#### Description
Pre-destructive backup.

#### Current Reality
Prompt: `Create checkpoint pre-bulk-delete. Capture the evidence needed to prove New checkpoint listed. Return a concise user-facing pass/fail verdict with the main reason.`

New checkpoint listed

#### Test Execution
> **Feature File:** [EX-015](05--lifecycle/015-checkpoint-creation-checkpoint-create.md)
> **Catalog:** [05--lifecycle/01-checkpoint-creation-checkpointcreate.md](../feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md)

### EX-016 | Checkpoint listing (checkpoint_list)

#### Description
Recovery asset discovery.

#### Current Reality
Prompt: `List checkpoints newest first. Capture the evidence needed to prove Available restore points displayed. Return a concise user-facing pass/fail verdict with the main reason.`

Available restore points displayed

#### Test Execution
> **Feature File:** [EX-016](05--lifecycle/016-checkpoint-listing-checkpoint-list.md)
> **Catalog:** [05--lifecycle/02-checkpoint-listing-checkpointlist.md](../feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md)

### EX-017 | Checkpoint restore (checkpoint_restore)

#### Description
Rollback restore drill.

#### Current Reality
Prompt: `Restore checkpoint with merge mode. Capture the evidence needed to prove Restored data + healthy state. Return a concise user-facing pass/fail verdict with the main reason.`

Restored data + healthy state

#### Test Execution
> **Feature File:** [EX-017](05--lifecycle/017-checkpoint-restore-checkpoint-restore.md)
> **Catalog:** [05--lifecycle/03-checkpoint-restore-checkpointrestore.md](../feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md)

### EX-018 | Checkpoint deletion (checkpoint_delete)

#### Description
Old snapshot cleanup.

#### Current Reality
Prompt: `Delete stale checkpoint by name. Capture the evidence needed to prove Removed checkpoint absent from list. Return a concise user-facing pass/fail verdict with the main reason.`

Removed checkpoint absent from list

#### Test Execution
> **Feature File:** [EX-018](05--lifecycle/018-checkpoint-deletion-checkpoint-delete.md)
> **Catalog:** [05--lifecycle/04-checkpoint-deletion-checkpointdelete.md](../feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md)

### EX-019 | Causal edge creation (memory_causal_link)

#### Description
Causal provenance linking.

#### Current Reality
Prompt: `Link source->target supports strength 0.8. Capture the evidence needed to prove Edge appears in chain trace. Return a concise user-facing pass/fail verdict with the main reason.`

Edge appears in chain trace

#### Test Execution
> **Feature File:** [EX-019](06--analysis/019-causal-edge-creation-memory-causal-link.md)
> **Catalog:** [06--analysis/01-causal-edge-creation-memorycausallink.md](../feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md)

### EX-020 | Causal graph statistics (memory_causal_stats)

#### Description
Graph coverage review.

#### Current Reality
Prompt: `Return causal stats and coverage. Capture the evidence needed to prove Coverage and edge metrics present. Return a concise user-facing pass/fail verdict with the main reason.`

Coverage and edge metrics present

#### Test Execution
> **Feature File:** [EX-020](06--analysis/020-causal-graph-statistics-memory-causal-stats.md)
> **Catalog:** [06--analysis/02-causal-graph-statistics-memorycausalstats.md](../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md)

### EX-021 | Causal edge deletion (memory_causal_unlink)

#### Description
Edge correction.

#### Current Reality
Prompt: `Delete edge and re-trace. Capture the evidence needed to prove Removed edge absent in trace. Return a concise user-facing pass/fail verdict with the main reason.`

Removed edge absent in trace

#### Test Execution
> **Feature File:** [EX-021](06--analysis/021-causal-edge-deletion-memory-causal-unlink.md)
> **Catalog:** [06--analysis/03-causal-edge-deletion-memorycausalunlink.md](../feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md)

### EX-022 | Causal chain tracing (memory_drift_why)

#### Description
Decision why-trace.

#### Current Reality
Prompt: `Trace both directions to depth 4. Capture the evidence needed to prove Chain includes expected relations. Return a concise user-facing pass/fail verdict with the main reason.`

Chain includes expected relations

#### Test Execution
> **Feature File:** [EX-022](06--analysis/022-causal-chain-tracing-memory-drift-why.md)
> **Catalog:** [06--analysis/04-causal-chain-tracing-memorydriftwhy.md](../feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md)

### EX-023 | Epistemic baseline capture (task_preflight)

#### Description
Pre-task baseline logging.

#### Current Reality
Prompt: `Create preflight for pipeline-v2-audit. Capture the evidence needed to prove Baseline record created. Return a concise user-facing pass/fail verdict with the main reason.`

Baseline record created

#### Test Execution
> **Feature File:** [EX-023](06--analysis/023-epistemic-baseline-capture-task-preflight.md)
> **Catalog:** [06--analysis/05-epistemic-baseline-capture-taskpreflight.md](../feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md)

### EX-024 | Post-task learning measurement (task_postflight)

#### Description
Learning closeout.

#### Current Reality
Prompt: `Complete postflight for pipeline-v2-audit. Capture the evidence needed to prove Delta/learning record saved. Return a concise user-facing pass/fail verdict with the main reason.`

Delta/learning record saved

#### Test Execution
> **Feature File:** [EX-024](06--analysis/024-post-task-learning-measurement-task-postflight.md)
> **Catalog:** [06--analysis/06-post-task-learning-measurement-taskpostflight.md](../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md)

### EX-025 | Learning history (memory_get_learning_history)

#### Description
Trend review.

#### Current Reality
Prompt: `Show completed learning history. Capture the evidence needed to prove Historical entries returned. Return a concise user-facing pass/fail verdict with the main reason.`

Historical entries returned

#### Test Execution
> **Feature File:** [EX-025](06--analysis/025-learning-history-memory-get-learning-history.md)
> **Catalog:** [06--analysis/07-learning-history-memorygetlearninghistory.md](../feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md)

### EX-026 | Ablation studies (eval_run_ablation)

#### Description
Channel impact experiment.

#### Current Reality
Prompt: `Run ablation on retrieval channels. Capture the evidence needed to prove Per-channel deltas reported. Return a concise user-facing pass/fail verdict with the main reason.`

Per-channel deltas reported

#### Test Execution
> **Feature File:** [EX-026](07--evaluation/026-ablation-studies-eval-run-ablation.md)
> **Catalog:** [07--evaluation/01-ablation-studies-evalrunablation.md](../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md)

### EX-027 | Reporting dashboard (eval_reporting_dashboard)

#### Description
Eval reporting pass.

#### Current Reality
Prompt: `Generate the latest dashboard report. Capture the evidence needed to prove Trend/channel/summary data present in supported runtime formats. Return a concise user-facing pass/fail verdict with the main reason.`

Trend/channel/summary data present in supported runtime formats

#### Test Execution
> **Feature File:** [EX-027](07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md)
> **Catalog:** [07--evaluation/02-reporting-dashboard-evalreportingdashboard.md](../feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md)

### EX-028 | 1. Search Pipeline Features (SPECKIT_*)

#### Description
Flag catalog verification.

#### Current Reality
Prompt: `List SPECKIT flags active/inert/deprecated. Capture the evidence needed to prove Accurate flag classification. Return a concise user-facing pass/fail verdict with the main reason.`

Accurate flag classification

#### Test Execution
> **Feature File:** [EX-028](19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
> **Catalog:** [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)

### EX-029 | 2. Session and Cache

#### Description
Session policy audit.

#### Current Reality
Prompt: `Retrieve dedup/cache policy settings. Capture the evidence needed to prove Session/cache controls found. Return a concise user-facing pass/fail verdict with the main reason.`

Session/cache controls found

#### Test Execution
> **Feature File:** [EX-029](19--feature-flag-reference/029-2-session-and-cache.md)
> **Catalog:** [19--feature-flag-reference/02-2-session-and-cache.md](../feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md)

### EX-030 | 3. MCP Configuration

#### Description
MCP limits audit.

#### Current Reality
Prompt: `Find MCP validation settings defaults. Capture the evidence needed to prove MCP guardrails returned. Return a concise user-facing pass/fail verdict with the main reason.`

MCP guardrails returned

#### Test Execution
> **Feature File:** [EX-030](19--feature-flag-reference/030-3-mcp-configuration.md)
> **Catalog:** [19--feature-flag-reference/03-3-mcp-configuration.md](../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md)

### EX-031 | 4. Memory and Storage

#### Description
Storage precedence check.

#### Current Reality
Prompt: `Explain DB path precedence env vars. Capture the evidence needed to prove Precedence chain identified. Return a concise user-facing pass/fail verdict with the main reason.`

Precedence chain identified

#### Test Execution
> **Feature File:** [EX-031](19--feature-flag-reference/031-4-memory-and-storage.md)
> **Catalog:** [19--feature-flag-reference/04-4-memory-and-storage.md](../feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md)

### EX-032 | 5. Embedding and API

#### Description
Provider selection audit.

#### Current Reality
Prompt: `Retrieve embedding provider selection rules. Capture the evidence needed to prove Provider rules and key precedence shown. Return a concise user-facing pass/fail verdict with the main reason.`

Provider rules and key precedence shown

#### Test Execution
> **Feature File:** [EX-032](19--feature-flag-reference/032-5-embedding-and-api.md)
> **Catalog:** [19--feature-flag-reference/05-5-embedding-and-api.md](../feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md)

### EX-033 | 6. Debug and Telemetry

#### Description
Observability toggle check.

#### Current Reality
Prompt: `List telemetry/debug vars and separate opt-in flags from inert flags. Capture the evidence needed to prove Debug/telemetry controls identified. Return a concise user-facing pass/fail verdict with the main reason.`

Debug/telemetry controls identified

#### Test Execution
> **Feature File:** [EX-033](19--feature-flag-reference/033-6-debug-and-telemetry.md)
> **Catalog:** [19--feature-flag-reference/06-6-debug-and-telemetry.md](../feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md)

### EX-034 | 7. CI and Build (informational)

#### Description
Branch metadata source audit.

#### Current Reality
Prompt: `Find branch env vars used in checkpoint metadata. Capture the evidence needed to prove Branch source vars surfaced. Return a concise user-facing pass/fail verdict with the main reason.`

Branch source vars surfaced

#### Test Execution
> **Feature File:** [EX-034](19--feature-flag-reference/034-7-ci-and-build-informational.md)
> **Catalog:** [19--feature-flag-reference/07-7-ci-and-build-informational.md](../feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md)

### EX-035 | Startup runtime compatibility guards

#### Description
Startup diagnostics verification.

#### Current Reality
Prompt: `Run the dedicated startup guard validation suite. Capture the evidence needed to prove Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript. Return a concise user-facing pass/fail verdict with the main reason.`

Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript

#### Test Execution
> **Feature File:** [EX-035](04--maintenance/035-startup-runtime-compatibility-guards.md)
> **Catalog:** [04--maintenance/02-startup-runtime-compatibility-guards.md](../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md)

---

## 8. FEATURES

Note: 042, 119, 131, and 132 all map to the same catalog entry for spec folder description discovery.

### 001 | Graph channel ID fix (G1)

#### Description
Confirm graph hits are non-zero when edges exist.

#### Current Reality
Prompt: `Verify Graph channel ID fix (G1) manually with causal-edge data. Capture the evidence needed to prove Graph channel returns >0 hits; channel attribution includes graph source. Return a concise user-facing pass/fail verdict with the main reason.`

Graph channel returns >0 hits; channel attribution includes graph source

#### Test Execution
> **Feature File:** [001](08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md](../feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md)

### 002 | Chunk collapse deduplication (G3)

#### Description
Confirm dedup in default mode.

#### Current Reality
Prompt: `Validate chunk collapse deduplication (G3) in default search mode. Capture the evidence needed to prove No duplicate memory IDs in results; collapsed chunks yield unique parents only. Return a concise user-facing pass/fail verdict with the main reason.`

No duplicate memory IDs in results; collapsed chunks yield unique parents only

#### Test Execution
> **Feature File:** [002](08--bug-fixes-and-data-integrity/002-chunk-collapse-deduplication-g3.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md](../feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md)

### 003 | Co-activation fan-effect divisor (R17)

#### Description
Confirm hub dampening.

#### Current Reality
Prompt: `Verify co-activation fan-effect divisor (R17). Capture the evidence needed to prove Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected. Return a concise user-facing pass/fail verdict with the main reason.`

Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected

#### Test Execution
> **Feature File:** [003](08--bug-fixes-and-data-integrity/003-co-activation-fan-effect-divisor-r17.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md](../feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md)

### 004 | SHA-256 content-hash deduplication (TM-02)

#### Description
Confirm identical re-save skips embedding.

#### Current Reality
Prompt: `Check SHA-256 dedup (TM-02) on re-save. Capture the evidence needed to prove Second save returns skip/no-op status; no new embedding row created; content hash matches. Return a concise user-facing pass/fail verdict with the main reason.`

Second save returns skip/no-op status; no new embedding row created; content hash matches

#### Test Execution
> **Feature File:** [004](08--bug-fixes-and-data-integrity/004-sha-256-content-hash-deduplication-tm-02.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md](../feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md)

### 005 | Evaluation database and schema (R13-S1)

#### Description
Confirm eval data isolation.

#### Current Reality
Prompt: `Verify evaluation DB/schema writes. Capture the evidence needed to prove Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB. Return a concise user-facing pass/fail verdict with the main reason.`

Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB

#### Test Execution
> **Feature File:** [005](09--evaluation-and-measurement/005-evaluation-database-and-schema-r13-s1.md)
> **Catalog:** [09--evaluation-and-measurement/01-evaluation-database-and-schema.md](../feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md)

### 006 | Core metric computation (R13-S1)

#### Description
Confirm metric battery outputs.

#### Current Reality
Prompt: `Validate core metric computation (R13-S1). Capture the evidence needed to prove Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges. Return a concise user-facing pass/fail verdict with the main reason.`

Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges

#### Test Execution
> **Feature File:** [006](09--evaluation-and-measurement/006-core-metric-computation-r13-s1.md)
> **Catalog:** [09--evaluation-and-measurement/02-core-metric-computation.md](../feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md)

### 007 | Observer effect mitigation (D4)

#### Description
Confirm non-blocking logging failures.

#### Current Reality
Prompt: `Check observer effect mitigation (D4). Capture the evidence needed to prove Search returns normal results even when eval logging throws; no latency spike from logging failure. Return a concise user-facing pass/fail verdict with the main reason.`

Search returns normal results even when eval logging throws; no latency spike from logging failure

#### Test Execution
> **Feature File:** [007](09--evaluation-and-measurement/007-observer-effect-mitigation-d4.md)
> **Catalog:** [09--evaluation-and-measurement/03-observer-effect-mitigation.md](../feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md)

### 008 | Full-context ceiling evaluation (A2)

#### Description
Confirm ceiling benchmark run.

#### Current Reality
Prompt: `Run full-context ceiling evaluation (A2). Capture the evidence needed to prove Ceiling benchmark produces ranked output; ceiling score >= hybrid and BM25 baselines. Return a concise user-facing pass/fail verdict with the main reason.`

Ceiling benchmark produces ranked output; ceiling score >= hybrid and BM25 baselines

#### Test Execution
> **Feature File:** [008](09--evaluation-and-measurement/008-full-context-ceiling-evaluation-a2.md)
> **Catalog:** [09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md](../feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md)

### 009 | Quality proxy formula (B7)

#### Description
Confirm proxy formula correctness.

#### Current Reality
Prompt: `Compute and verify quality proxy formula (B7). Capture the evidence needed to prove Computed proxy value matches manual formula calculation within tolerance; formula components are all present. Return a concise user-facing pass/fail verdict with the main reason.`

Computed proxy value matches manual formula calculation within tolerance; formula components are all present

#### Test Execution
> **Feature File:** [009](09--evaluation-and-measurement/009-quality-proxy-formula-b7.md)
> **Catalog:** [09--evaluation-and-measurement/05-quality-proxy-formula.md](../feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md)

### 010 | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

#### Description
Confirm corpus coverage and hard negatives.

#### Current Reality
Prompt: `Audit synthetic ground-truth corpus coverage. Capture the evidence needed to prove Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced. Return a concise user-facing pass/fail verdict with the main reason.`

Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced

#### Test Execution
> **Feature File:** [010](09--evaluation-and-measurement/010-synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a.md)
> **Catalog:** [09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md)

### 011 | BM25-only baseline (G-NEW-1)

#### Description
Confirm baseline reproducibility.

#### Current Reality
Prompt: `Run BM25-only baseline measurement. Capture the evidence needed to prove BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace. Return a concise user-facing pass/fail verdict with the main reason.`

BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace

#### Test Execution
> **Feature File:** [011](09--evaluation-and-measurement/011-bm25-only-baseline-g-new-1.md)
> **Catalog:** [09--evaluation-and-measurement/07-bm25-only-baseline.md](../feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md)

### 012 | Agent consumption instrumentation (G-NEW-2)

#### Description
Confirm wiring with inert runtime.

#### Current Reality
Prompt: `Validate G-NEW-2 instrumentation behavior. Capture the evidence needed to prove Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors. Return a concise user-facing pass/fail verdict with the main reason.`

Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors

#### Test Execution
> **Feature File:** [012](09--evaluation-and-measurement/012-agent-consumption-instrumentation-g-new-2.md)
> **Catalog:** [09--evaluation-and-measurement/08-agent-consumption-instrumentation.md](../feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md)

### 013 | Scoring observability (T010)

#### Description
Confirm sample logging + fail-safe.

#### Current Reality
Prompt: `Verify scoring observability (T010). Capture the evidence needed to prove Sampled scoring rows appear in observability log; write error does not crash search; sample rate respected. Return a concise user-facing pass/fail verdict with the main reason.`

Sampled scoring rows appear in observability log; write error does not crash search; sample rate respected

#### Test Execution
> **Feature File:** [013](09--evaluation-and-measurement/013-scoring-observability-t010.md)
> **Catalog:** [09--evaluation-and-measurement/09-scoring-observability.md](../feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md)

### 014 | Full reporting and ablation study framework (R13-S3)

#### Description
Confirm ablation+report workflow.

#### Current Reality
Prompt: `Execute manual ablation run (R13-S3). Capture the evidence needed to prove Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report. Return a concise user-facing pass/fail verdict with the main reason.`

Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report

#### Test Execution
> **Feature File:** [014](09--evaluation-and-measurement/014-full-reporting-and-ablation-study-framework-r13-s3.md)
> **Catalog:** [09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md)

### 015 | Shadow scoring and channel attribution (R13-S2)

#### Description
Confirm shadow deactivation and attribution continuity.

#### Current Reality
Prompt: `Verify shadow scoring deactivation and attribution continuity. Capture the evidence needed to prove Shadow scoring flags are inert (no live ranking impact); attribution metadata still attached to results. Return a concise user-facing pass/fail verdict with the main reason.`

Shadow scoring flags are inert (no live ranking impact); attribution metadata still attached to results

#### Test Execution
> **Feature File:** [015](09--evaluation-and-measurement/015-shadow-scoring-and-channel-attribution-r13-s2.md)
> **Catalog:** [09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md](../feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md)

### 016 | Typed-weighted degree channel (R4)

#### Description
Confirm bounded typed-degree boost.

#### Current Reality
Prompt: `Test typed-weighted degree channel (R4). Capture the evidence needed to prove Typed-degree boost bounded within configured cap; fallback activates when edge types missing; varied types produce different scores. Return a concise user-facing pass/fail verdict with the main reason.`

Typed-degree boost bounded within configured cap; fallback activates when edge types missing; varied types produce different scores

#### Test Execution
> **Feature File:** [016](10--graph-signal-activation/016-typed-weighted-degree-channel-r4.md)
> **Catalog:** [10--graph-signal-activation/01-typed-weighted-degree-channel.md](../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md)

### 017 | Co-activation boost strength increase (A7)

#### Description
Confirm multiplier impact.

#### Current Reality
Prompt: `Compare co-activation strength values for A7. Capture the evidence needed to prove Increased co-activation strength produces measurably higher contribution delta vs baseline. Return a concise user-facing pass/fail verdict with the main reason.`

Increased co-activation strength produces measurably higher contribution delta vs baseline

#### Test Execution
> **Feature File:** [017](10--graph-signal-activation/017-co-activation-boost-strength-increase-a7.md)
> **Catalog:** [10--graph-signal-activation/02-co-activation-boost-strength-increase.md](../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md)

### 018 | Edge density measurement

#### Description
Confirm edges-per-node thresholding.

#### Current Reality
Prompt: `Verify edge density measurement and gate behavior. Capture the evidence needed to prove Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary. Return a concise user-facing pass/fail verdict with the main reason.`

Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary

#### Test Execution
> **Feature File:** [018](10--graph-signal-activation/018-edge-density-measurement.md)
> **Catalog:** [10--graph-signal-activation/03-edge-density-measurement.md](../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md)

### 019 | Weight history audit tracking

#### Description
Confirm edge change logging + rollback.

#### Current Reality
Prompt: `Validate weight history audit tracking. Capture the evidence needed to prove Audit rows logged for each edge strength mutation; rollback restores previous weights; audit history is append-only. Return a concise user-facing pass/fail verdict with the main reason.`

Audit rows logged for each edge strength mutation; rollback restores previous weights; audit history is append-only

#### Test Execution
> **Feature File:** [019](10--graph-signal-activation/019-weight-history-audit-tracking.md)
> **Catalog:** [10--graph-signal-activation/04-weight-history-audit-tracking.md](../feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md)

### 020 | Graph momentum scoring (N2a)

#### Description
Confirm 7-day delta bonus.

#### Current Reality
Prompt: `Verify graph momentum scoring (N2a). Capture the evidence needed to prove 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced. Return a concise user-facing pass/fail verdict with the main reason.`

7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced

#### Test Execution
> **Feature File:** [020](10--graph-signal-activation/020-graph-momentum-scoring-n2a.md)
> **Catalog:** [10--graph-signal-activation/05-graph-momentum-scoring.md](../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md)

### 021 | Causal depth signal (N2b)

#### Description
Confirm normalized depth scoring.

#### Current Reality
Prompt: `Test causal depth signal (N2b). Capture the evidence needed to prove Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer. Return a concise user-facing pass/fail verdict with the main reason.`

Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer

#### Test Execution
> **Feature File:** [021](10--graph-signal-activation/021-causal-depth-signal-n2b.md)
> **Catalog:** [10--graph-signal-activation/06-causal-depth-signal.md](../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md)

### 022 | Community detection (N2c)

#### Description
Confirm community boost injection.

#### Current Reality
Prompt: `Validate community detection (N2c). Capture the evidence needed to prove Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum. Return a concise user-facing pass/fail verdict with the main reason.`

Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum

#### Test Execution
> **Feature File:** [022](10--graph-signal-activation/022-community-detection-n2c.md)
> **Catalog:** [10--graph-signal-activation/07-community-detection.md](../feature_catalog/10--graph-signal-activation/07-community-detection.md)

### 023 | Score normalization

#### Description
Confirm batch min-max behavior.

#### Current Reality
Prompt: `Verify score normalization output ranges. Capture the evidence needed to prove Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled. Return a concise user-facing pass/fail verdict with the main reason.`

Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled

#### Test Execution
> **Feature File:** [023](11--scoring-and-calibration/023-score-normalization.md)
> **Catalog:** [11--scoring-and-calibration/01-score-normalization.md](../feature_catalog/11--scoring-and-calibration/01-score-normalization.md)

### 024 | Cold-start novelty boost (N4)

#### Description
Confirm novelty removed from hot path.

#### Current Reality
Prompt: `Confirm N4 novelty hot-path removal. Capture the evidence needed to prove Novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path. Return a concise user-facing pass/fail verdict with the main reason.`

Novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path

#### Test Execution
> **Feature File:** [024](11--scoring-and-calibration/024-cold-start-novelty-boost-n4.md)
> **Catalog:** [11--scoring-and-calibration/02-cold-start-novelty-boost.md](../feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md)

### 025 | Interference scoring (TM-01)

#### Description
Confirm cluster penalty.

#### Current Reality
Prompt: `Validate interference scoring (TM-01). Capture the evidence needed to prove Near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected. Return a concise user-facing pass/fail verdict with the main reason.`

Near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected

#### Test Execution
> **Feature File:** [025](11--scoring-and-calibration/025-interference-scoring-tm-01.md)
> **Catalog:** [11--scoring-and-calibration/03-interference-scoring.md](../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md)

### 026 | Classification-based decay (TM-03)

#### Description
Confirm class+tier decay matrix.

#### Current Reality
Prompt: `Verify TM-03 classification-based decay. Capture the evidence needed to prove Decay multipliers differ by classification and tier; matrix values match documented configuration. Return a concise user-facing pass/fail verdict with the main reason.`

Decay multipliers differ by classification and tier; matrix values match documented configuration

#### Test Execution
> **Feature File:** [026](11--scoring-and-calibration/026-classification-based-decay-tm-03.md)
> **Catalog:** [11--scoring-and-calibration/04-classification-based-decay.md](../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md)

### 027 | Folder-level relevance scoring (PI-A1)

#### Description
Confirm folder-first retrieval.

#### Current Reality
Prompt: `Validate folder-level relevance scoring (PI-A1). Capture the evidence needed to prove Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking. Return a concise user-facing pass/fail verdict with the main reason.`

Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking

#### Test Execution
> **Feature File:** [027](11--scoring-and-calibration/027-folder-level-relevance-scoring-pi-a1.md)
> **Catalog:** [11--scoring-and-calibration/05-folder-level-relevance-scoring.md](../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md)

### 028 | Embedding cache (R18)

#### Description
Confirm cache hit/miss behavior.

#### Current Reality
Prompt: `Verify embedding cache (R18). Capture the evidence needed to prove Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit. Return a concise user-facing pass/fail verdict with the main reason.`

Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit

#### Test Execution
> **Feature File:** [028](11--scoring-and-calibration/028-embedding-cache-r18.md)
> **Catalog:** [11--scoring-and-calibration/06-embedding-cache.md](../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md)

### 029 | Double intent weighting investigation (G2)

#### Description
Confirm no hybrid double-weight.

#### Current Reality
Prompt: `Validate G2 guard in active pipeline. Capture the evidence needed to prove Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally. Return a concise user-facing pass/fail verdict with the main reason.`

Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally

#### Test Execution
> **Feature File:** [029](11--scoring-and-calibration/029-double-intent-weighting-investigation-g2.md)
> **Catalog:** [11--scoring-and-calibration/07-double-intent-weighting-investigation.md](../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md)

### 030 | RRF K-value sensitivity analysis (FUT-5)

#### Description
Confirm K sensitivity measurements.

#### Current Reality
Prompt: `Run RRF K sensitivity analysis. Capture the evidence needed to prove K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns. Return a concise user-facing pass/fail verdict with the main reason.`

K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns

#### Test Execution
> **Feature File:** [030](11--scoring-and-calibration/030-rrf-k-value-sensitivity-analysis-fut-5.md)
> **Catalog:** [11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md](../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md)

### 031 | Negative feedback confidence signal (A4)

#### Description
Confirm demotion floor+recovery.

#### Current Reality
Prompt: `Verify negative feedback confidence (A4). Capture the evidence needed to prove Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time. Return a concise user-facing pass/fail verdict with the main reason.`

Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time

#### Test Execution
> **Feature File:** [031](11--scoring-and-calibration/031-negative-feedback-confidence-signal-a4.md)
> **Catalog:** [11--scoring-and-calibration/09-negative-feedback-confidence-signal.md](../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md)

### 032 | Auto-promotion on validation (T002a)

#### Description
Confirm promotion thresholds/throttle.

#### Current Reality
Prompt: `Validate auto-promotion on validation (T002a). Capture the evidence needed to prove Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged. Return a concise user-facing pass/fail verdict with the main reason.`

Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged

#### Test Execution
> **Feature File:** [032](11--scoring-and-calibration/032-auto-promotion-on-validation-t002a.md)
> **Catalog:** [11--scoring-and-calibration/10-auto-promotion-on-validation.md](../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md)

### 033 | Query complexity router (R15)

#### Description
Confirm query-class routing.

#### Current Reality
Prompt: `Verify query complexity router (R15). Capture the evidence needed to prove Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise user-facing pass/fail verdict with the main reason.`

Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing

#### Test Execution
> **Feature File:** [033](12--query-intelligence/033-query-complexity-router-r15.md)
> **Catalog:** [12--query-intelligence/01-query-complexity-router.md](../feature_catalog/12--query-intelligence/01-query-complexity-router.md)

### 034 | Relative score fusion in shadow mode (R14/N1)

#### Description
Confirm RSF stays off the live ranking path.

#### Current Reality
Prompt: `Check RSF shadow behavior post-cleanup. Capture the evidence needed to prove RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field. Return a concise user-facing pass/fail verdict with the main reason.`

RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field

#### Test Execution
> **Feature File:** [034](12--query-intelligence/034-relative-score-fusion-in-shadow-mode-r14-n1.md)
> **Catalog:** [12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md](../feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md)

### 035 | Channel min-representation (R2)

#### Description
Confirm top-k channel diversity rule.

#### Current Reality
Prompt: `Validate channel min-representation (R2). Capture the evidence needed to prove Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise user-facing pass/fail verdict with the main reason.`

Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection

#### Test Execution
> **Feature File:** [035](12--query-intelligence/035-channel-min-representation-r2.md)
> **Catalog:** [12--query-intelligence/03-channel-min-representation.md](../feature_catalog/12--query-intelligence/03-channel-min-representation.md)

### 036 | Confidence-based result truncation (R15-ext)

#### Description
Confirm relevance-cliff cutoff.

#### Current Reality
Prompt: `Verify confidence-based truncation (R15-ext). Capture the evidence needed to prove Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise user-facing pass/fail verdict with the main reason.`

Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace

#### Test Execution
> **Feature File:** [036](12--query-intelligence/036-confidence-based-result-truncation-r15-ext.md)
> **Catalog:** [12--query-intelligence/04-confidence-based-result-truncation.md](../feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md)

### 037 | Dynamic token budget allocation (FUT-7)

#### Description
Confirm complexity-tier budgets.

#### Current Reality
Prompt: `Verify dynamic token budgets (FUT-7). Capture the evidence needed to prove Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise user-facing pass/fail verdict with the main reason.`

Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget

#### Test Execution
> **Feature File:** [037](12--query-intelligence/037-dynamic-token-budget-allocation-fut-7.md)
> **Catalog:** [12--query-intelligence/05-dynamic-token-budget-allocation.md](../feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md)

### 038 | Query expansion (R12)

#### Description
Confirm parallel expansion + dedup.

#### Current Reality
Prompt: `Validate query expansion (R12). Capture the evidence needed to prove Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise user-facing pass/fail verdict with the main reason.`

Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion

#### Test Execution
> **Feature File:** [038](12--query-intelligence/038-query-expansion-r12.md)
> **Catalog:** [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md)

### 039 | Verify-fix-verify memory quality loop (PI-A5)

#### Description
Confirm retry then reject path.

#### Current Reality
Prompt: `Verify PI-A5 quality loop behavior. Capture the evidence needed to prove Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged. Return a concise user-facing pass/fail verdict with the main reason.`

Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged

#### Test Execution
> **Feature File:** [039](13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md)
> **Catalog:** [13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md](../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md)

### 040 | Signal vocabulary expansion (TM-08)

#### Description
Confirm signal category detection.

#### Current Reality
Prompt: `Validate signal vocabulary expansion (TM-08). Capture the evidence needed to prove Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary. Return a concise user-facing pass/fail verdict with the main reason.`

Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary

#### Test Execution
> **Feature File:** [040](13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md)
> **Catalog:** [13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md](../feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md)

### 041 | Pre-flight token budget validation (PI-A3)

#### Description
Confirm save-time preflight warn/fail behavior.

#### Current Reality
Prompt: `Verify pre-flight token budget validation (PI-A3). Capture the evidence needed to prove Token estimate is computed before embedding/database writes; near-limit input emits PF021 warning; over-limit input emits PF020 failure; behavior follows MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, and MCP_TOKEN_WARNING_THRESHOLD. Return a concise user-facing pass/fail verdict with the main reason.`

Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`

#### Test Execution
> **Feature File:** [041](13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md)
> **Catalog:** [13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md](../feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md)

### 042 | Spec folder description discovery (PI-B3)

#### Description
Confirm per-folder + aggregated routing.

#### Current Reality
Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`

description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files

#### Test Execution
> **Feature File:** [042](13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md)
> **Catalog:** [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

### 043 | Pre-storage quality gate (TM-04)

#### Description
Confirm 3-layer gate behavior.

#### Current Reality
Prompt: `Verify pre-storage quality gate (TM-04). Capture the evidence needed to prove 3-layer gate: structural check, semantic check, duplication check; each layer can warn or reject; decision log captures all gate evaluations. Return a concise user-facing pass/fail verdict with the main reason.`

3-layer gate: structural check, semantic check, duplication check; each layer can warn or reject; decision log captures all gate evaluations

#### Test Execution
> **Feature File:** [043](13--memory-quality-and-indexing/043-pre-storage-quality-gate-tm-04.md)
> **Catalog:** [13--memory-quality-and-indexing/05-pre-storage-quality-gate.md](../feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md)

### 044 | Reconsolidation-on-save (TM-06)

#### Description
Confirm merge/deprecate thresholds.

#### Current Reality
Prompt: `Validate reconsolidation-on-save (TM-06). Capture the evidence needed to prove Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output. Return a concise user-facing pass/fail verdict with the main reason.`

Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output

#### Test Execution
> **Feature File:** [044](13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md)
> **Catalog:** [13--memory-quality-and-indexing/06-reconsolidation-on-save.md](../feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md)

### 045 | Smarter memory content generation (S1)

#### Description
Confirm quality/structure output.

#### Current Reality
Prompt: `Assess smarter memory content generation (S1). Capture the evidence needed to prove Generated content retains structural elements (headings, lists, code blocks); output is concise; coherence maintained across sections. Return a concise user-facing pass/fail verdict with the main reason.`

Generated content retains structural elements (headings, lists, code blocks); output is concise; coherence maintained across sections

#### Test Execution
> **Feature File:** [045](13--memory-quality-and-indexing/045-smarter-memory-content-generation-s1.md)
> **Catalog:** [13--memory-quality-and-indexing/07-smarter-memory-content-generation.md](../feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md)

### 046 | Anchor-aware chunk thinning (R7)

#### Description
Confirm anchor-priority thinning.

#### Current Reality
Prompt: `Validate anchor-aware chunk thinning (R7). Capture the evidence needed to prove Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise user-facing pass/fail verdict with the main reason.`

Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order

#### Test Execution
> **Feature File:** [046](13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md)
> **Catalog:** [13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md](../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md)

### 047 | Encoding-intent capture at index time (R16)

#### Description
Confirm persisted intent labels.

#### Current Reality
Prompt: `Verify encoding-intent capture (R16). Capture the evidence needed to prove Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels. Return a concise user-facing pass/fail verdict with the main reason.`

Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels

#### Test Execution
> **Feature File:** [047](13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md)
> **Catalog:** [13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md](../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md)

### 048 | Auto entity extraction (R10)

#### Description
Confirm entity pipeline persistence.

#### Current Reality
Prompt: `Validate auto entity extraction (R10). Capture the evidence needed to prove Entities extracted and persisted in entity tables; normalization applied (case, aliases); denylist entities excluded. Return a concise user-facing pass/fail verdict with the main reason.`

Entities extracted and persisted in entity tables; normalization applied (case, aliases); denylist entities excluded

#### Test Execution
> **Feature File:** [048](13--memory-quality-and-indexing/048-auto-entity-extraction-r10.md)
> **Catalog:** [13--memory-quality-and-indexing/10-auto-entity-extraction.md](../feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md)

### 049 | 4-stage pipeline refactor (R6)

#### Description
Confirm stage flow and invariant.

#### Current Reality
Prompt: `Trace one query through all 4 stages. Capture the evidence needed to prove Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage. Return a concise user-facing pass/fail verdict with the main reason.`

Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage

#### Test Execution
> **Feature File:** [049](14--pipeline-architecture/049-4-stage-pipeline-refactor-r6.md)
> **Catalog:** [14--pipeline-architecture/01-4-stage-pipeline-refactor.md](../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md)

### 050 | MPAB chunk-to-memory aggregation (R1)

#### Description
Confirm MPAB formula.

#### Current Reality
Prompt: `Verify MPAB chunk aggregation (R1). Capture the evidence needed to prove MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value. Return a concise user-facing pass/fail verdict with the main reason.`

MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value

#### Test Execution
> **Feature File:** [050](14--pipeline-architecture/050-mpab-chunk-to-memory-aggregation-r1.md)
> **Catalog:** [14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md](../feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md)

### 051 | Chunk ordering preservation (B2)

#### Description
Confirm ordered reassembly.

#### Current Reality
Prompt: `Validate chunk ordering preservation (B2). Capture the evidence needed to prove Collapsed chunks reassembled in original document order; marker sequence preserved; no reordering artifacts. Return a concise user-facing pass/fail verdict with the main reason.`

Collapsed chunks reassembled in original document order; marker sequence preserved; no reordering artifacts

#### Test Execution
> **Feature File:** [051](14--pipeline-architecture/051-chunk-ordering-preservation-b2.md)
> **Catalog:** [14--pipeline-architecture/03-chunk-ordering-preservation.md](../feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md)

### 052 | Template anchor optimization (S2)

#### Description
Confirm anchor metadata enrichment.

#### Current Reality
Prompt: `Verify template anchor optimization (S2). Capture the evidence needed to prove Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence. Return a concise user-facing pass/fail verdict with the main reason.`

Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence

#### Test Execution
> **Feature File:** [052](14--pipeline-architecture/052-template-anchor-optimization-s2.md)
> **Catalog:** [14--pipeline-architecture/04-template-anchor-optimization.md](../feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md)

### 053 | Validation signals as retrieval metadata (S3)

#### Description
Confirm bounded multiplier.

#### Current Reality
Prompt: `Validate S3 retrieval metadata weighting. Capture the evidence needed to prove Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier. Return a concise user-facing pass/fail verdict with the main reason.`

Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier

#### Test Execution
> **Feature File:** [053](14--pipeline-architecture/053-validation-signals-as-retrieval-metadata-s3.md)
> **Catalog:** [14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md](../feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md)

### 054 | Learned relevance feedback (R11)

#### Description
Confirm learned trigger safeguards.

#### Current Reality
Prompt: `Verify learned relevance feedback (R11). Capture the evidence needed to prove Learned triggers added from helpful validations; safeguards prevent trigger flooding; queryId required for trigger learning. Return a concise user-facing pass/fail verdict with the main reason.`

Learned triggers added from helpful validations; safeguards prevent trigger flooding; queryId required for trigger learning

#### Test Execution
> **Feature File:** [054](14--pipeline-architecture/054-learned-relevance-feedback-r11.md)
> **Catalog:** [14--pipeline-architecture/06-learned-relevance-feedback.md](../feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md)

### 055 | Dual-scope memory auto-surface (TM-05)

#### Description
Confirm auto-surface hooks.

#### Current Reality
Prompt: `Validate dual-scope auto-surface (TM-05). Capture the evidence needed to prove Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise user-facing pass/fail verdict with the main reason.`

Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context

#### Test Execution
> **Feature File:** [055](15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md)
> **Catalog:** [15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md](../feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md)

### 056 | Constitutional memory as expert knowledge injection (PI-A4)

#### Description
Confirm directive enrichment.

#### Current Reality
Prompt: `Verify constitutional memory directive injection (PI-A4). Capture the evidence needed to prove Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise user-facing pass/fail verdict with the main reason.`

Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated

#### Test Execution
> **Feature File:** [056](15--retrieval-enhancements/056-constitutional-memory-as-expert-knowledge-injection-pi-a4.md)
> **Catalog:** [15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md](../feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md)

### 057 | Spec folder hierarchy as retrieval structure (S4)

#### Description
Confirm hierarchy-aware retrieval.

#### Current Reality
Prompt: `Validate spec-folder hierarchy retrieval (S4). Capture the evidence needed to prove Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking. Return a concise user-facing pass/fail verdict with the main reason.`

Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking

#### Test Execution
> **Feature File:** [057](15--retrieval-enhancements/057-spec-folder-hierarchy-as-retrieval-structure-s4.md)
> **Catalog:** [15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md](../feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md)

### 058 | Lightweight consolidation (N3-lite)

#### Description
Confirm maintenance cycle behavior.

#### Current Reality
Prompt: `Run lightweight consolidation cycle (N3-lite). Capture the evidence needed to prove Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise user-facing pass/fail verdict with the main reason.`

Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs

#### Test Execution
> **Feature File:** [058](15--retrieval-enhancements/058-lightweight-consolidation-n3-lite.md)
> **Catalog:** [15--retrieval-enhancements/04-lightweight-consolidation.md](../feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md)

### 059 | Memory summary search channel (R8)

#### Description
Confirm scale-gated summary channel.

#### Current Reality
Prompt: `Verify memory summary search channel (R8). Capture the evidence needed to prove Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold. Return a concise user-facing pass/fail verdict with the main reason.`

Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold

#### Test Execution
> **Feature File:** [059](15--retrieval-enhancements/059-memory-summary-search-channel-r8.md)
> **Catalog:** [15--retrieval-enhancements/05-memory-summary-search-channel.md](../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md)

### 060 | Cross-document entity linking (S5)

#### Description
Confirm guarded supports-edge linking.

#### Current Reality
Prompt: `Validate cross-document entity linking (S5). Capture the evidence needed to prove Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied. Return a concise user-facing pass/fail verdict with the main reason.`

Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied

#### Test Execution
> **Feature File:** [060](15--retrieval-enhancements/060-cross-document-entity-linking-s5.md)
> **Catalog:** [15--retrieval-enhancements/06-cross-document-entity-linking.md](../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md)

### 061 | Tree thinning for spec folder consolidation (PI-B1)

#### Description
Confirm small-file merge thinning.

#### Current Reality
Prompt: `Validate tree thinning behavior (PI-B1). Capture the evidence needed to prove Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity. Return a concise user-facing pass/fail verdict with the main reason.`

Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity

#### Test Execution
> **Feature File:** [061](16--tooling-and-scripts/061-tree-thinning-for-spec-folder-consolidation-pi-b1.md)
> **Catalog:** [16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md](../feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md)

### 062 | Progressive validation for spec documents (PI-B2)

#### Description
Confirm level 1-4 behavior.

#### Current Reality
Prompt: `Run progressive validation (PI-B2). Capture the evidence needed to prove Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels. Return a concise user-facing pass/fail verdict with the main reason.`

Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels

#### Test Execution
> **Feature File:** [062](16--tooling-and-scripts/062-progressive-validation-for-spec-documents-pi-b2.md)
> **Catalog:** [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

### 063 | Feature flag governance

#### Description
Confirm governance policy conformance.

#### Current Reality
Prompt: `Audit feature flag governance conformance. Capture the evidence needed to prove All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found. Return a concise user-facing pass/fail verdict with the main reason.`

All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found

#### Test Execution
> **Feature File:** [063](17--governance/063-feature-flag-governance.md)
> **Catalog:** [17--governance/01-feature-flag-governance.md](../feature_catalog/17--governance/01-feature-flag-governance.md)

### 064 | Feature flag sunset audit

#### Description
Confirm sunset dispositions.

#### Current Reality
Prompt: `Verify feature flag sunset audit outcomes. Capture the evidence needed to prove Documented dispositions match code state; deprecated flags are no-ops; deltas between docs and code identified. Return a concise user-facing pass/fail verdict with the main reason.`

Documented dispositions match code state; deprecated flags are no-ops; deltas between docs and code identified

#### Test Execution
> **Feature File:** [064](17--governance/064-feature-flag-sunset-audit.md)
> **Catalog:** [17--governance/02-feature-flag-sunset-audit.md](../feature_catalog/17--governance/02-feature-flag-sunset-audit.md)

### 065 | Database and schema safety

#### Description
Confirm Sprint 8 DB safety bundle.

#### Current Reality
Prompt: `Validate database and schema safety bundle. Capture the evidence needed to prove Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure. Return a concise user-facing pass/fail verdict with the main reason.`

Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure

#### Test Execution
> **Feature File:** [065](08--bug-fixes-and-data-integrity/065-database-and-schema-safety.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md](../feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md)

### 066 | Scoring and ranking corrections

#### Description
Confirm Sprint 8 scoring fixes.

#### Current Reality
Prompt: `Validate scoring and ranking corrections bundle. Capture the evidence needed to prove Score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values. Return a concise user-facing pass/fail verdict with the main reason.`

Score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values

#### Test Execution
> **Feature File:** [066](11--scoring-and-calibration/066-scoring-and-ranking-corrections.md)
> **Catalog:** [11--scoring-and-calibration/11-scoring-and-ranking-corrections.md](../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md)

### 067 | Search pipeline safety

#### Description
Confirm Sprint 8 pipeline safety fixes.

#### Current Reality
Prompt: `Validate search pipeline safety bundle. Capture the evidence needed to prove Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions. Return a concise user-facing pass/fail verdict with the main reason.`

Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions

#### Test Execution
> **Feature File:** [067](14--pipeline-architecture/067-search-pipeline-safety.md)
> **Catalog:** [14--pipeline-architecture/07-search-pipeline-safety.md](../feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md)

### 068 | Guards and edge cases

#### Description
Confirm edge-case guard fixes.

#### Current Reality
Prompt: `Validate guards and edge-cases bundle. Capture the evidence needed to prove No double-counting in aggregation; fallback paths trigger correctly; guard conditions prevent invalid state. Return a concise user-facing pass/fail verdict with the main reason.`

No double-counting in aggregation; fallback paths trigger correctly; guard conditions prevent invalid state

#### Test Execution
> **Feature File:** [068](08--bug-fixes-and-data-integrity/068-guards-and-edge-cases.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md](../feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md)

### 069 | Entity normalization consolidation

#### Description
Confirm shared normalization path.

#### Current Reality
Prompt: `Validate entity normalization consolidation. Capture the evidence needed to prove Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence. Return a concise user-facing pass/fail verdict with the main reason.`

Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence

#### Test Execution
> **Feature File:** [069](13--memory-quality-and-indexing/069-entity-normalization-consolidation.md)
> **Catalog:** [13--memory-quality-and-indexing/13-entity-normalization-consolidation.md](../feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md)

### 070 | Dead code removal

#### Description
Confirm dead path elimination.

#### Current Reality
Prompt: `Audit dead code removal outcomes. Capture the evidence needed to prove Removed symbols not found in codebase; representative flows execute without missing-reference errors; no dead imports remain. Return a concise user-facing pass/fail verdict with the main reason.`

Removed symbols not found in codebase; representative flows execute without missing-reference errors; no dead imports remain

#### Test Execution
> **Feature File:** [070](16--tooling-and-scripts/070-dead-code-removal.md)
> **Catalog:** [16--tooling-and-scripts/04-dead-code-removal.md](../feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md)

### 071 | Performance improvements

#### Description
Confirm key perf remediations active.

#### Current Reality
Prompt: `Verify performance improvements (Sprint 8). Capture the evidence needed to prove Optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions. Return a concise user-facing pass/fail verdict with the main reason.`

Optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions

#### Test Execution
> **Feature File:** [071](14--pipeline-architecture/071-performance-improvements.md)
> **Catalog:** [14--pipeline-architecture/08-performance-improvements.md](../feature_catalog/14--pipeline-architecture/08-performance-improvements.md)

### 072 | Test quality improvements

#### Description
Confirm test quality remediations.

#### Current Reality
Prompt: `Audit test quality improvements. Capture the evidence needed to prove Tests use proper teardown; assertions are specific (not generic truthy checks); no flaky timing-dependent patterns; test isolation maintained. Return a concise user-facing pass/fail verdict with the main reason.`

Tests use proper teardown; assertions are specific (not generic truthy checks); no flaky timing-dependent patterns; test isolation maintained

#### Test Execution
> **Feature File:** [072](09--evaluation-and-measurement/072-test-quality-improvements.md)
> **Catalog:** [09--evaluation-and-measurement/12-test-quality-improvements.md](../feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md)

### 073 | Quality gate timer persistence

#### Description
Confirm restart persistence.

#### Current Reality
Prompt: `Verify quality gate timer persistence. Capture the evidence needed to prove Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart. Return a concise user-facing pass/fail verdict with the main reason.`

Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart

#### Test Execution
> **Feature File:** [073](13--memory-quality-and-indexing/073-quality-gate-timer-persistence.md)
> **Catalog:** [13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md](../feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md)

### 074 | Stage 3 effectiveScore fallback chain

#### Description
Confirm fallback order correctness.

#### Current Reality
Prompt: `Validate Stage 3 effectiveScore fallback chain. Capture the evidence needed to prove Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise user-facing pass/fail verdict with the main reason.`

Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score

#### Test Execution
> **Feature File:** [074](11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md)
> **Catalog:** [11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md](../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md)

### 075 | Canonical ID dedup hardening

#### Description
Confirm mixed-format ID dedup.

#### Current Reality
Prompt: `Verify canonical ID dedup hardening. Capture the evidence needed to prove Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity. Return a concise user-facing pass/fail verdict with the main reason.`

Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity

#### Test Execution
> **Feature File:** [075](08--bug-fixes-and-data-integrity/075-canonical-id-dedup-hardening.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md](../feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md)

### 076 | Activation window persistence

#### Description
Confirm warn-only window persistence.

#### Current Reality
Prompt: `Verify activation window persistence. Capture the evidence needed to prove Activation window timestamp persists across restart; warn-only mode respects persisted window; no timestamp reset on service restart. Return a concise user-facing pass/fail verdict with the main reason.`

Activation window timestamp persists across restart; warn-only mode respects persisted window; no timestamp reset on service restart

#### Test Execution
> **Feature File:** [076](14--pipeline-architecture/076-activation-window-persistence.md)
> **Catalog:** [14--pipeline-architecture/09-activation-window-persistence.md](../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md)

### 077 | Tier-2 fallback channel forcing

#### Description
Confirm force-all-channels in tier-2.

#### Current Reality
Prompt: `Validate tier-2 fallback channel forcing. Capture the evidence needed to prove Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise user-facing pass/fail verdict with the main reason.`

Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels

#### Test Execution
> **Feature File:** [077](15--retrieval-enhancements/077-tier-2-fallback-channel-forcing.md)
> **Catalog:** [15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md](../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md)

### 078 | Legacy V1 pipeline removal

#### Description
Confirm V2-only runtime.

#### Current Reality
Prompt: `Verify legacy V1 removal. Capture the evidence needed to prove V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain. Return a concise user-facing pass/fail verdict with the main reason.`

V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain

#### Test Execution
> **Feature File:** [078](14--pipeline-architecture/078-legacy-v1-pipeline-removal.md)
> **Catalog:** [14--pipeline-architecture/10-legacy-v1-pipeline-removal.md](../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md)

### 079 | Scoring and fusion corrections

#### Description
Confirm phase-017 correction bundle.

#### Current Reality
Prompt: `Validate phase-017 scoring and fusion corrections. Capture the evidence needed to prove Scoring math produces correct values; normalization stays within bounds; fusion formula applies corrected weights. Return a concise user-facing pass/fail verdict with the main reason.`

Scoring math produces correct values; normalization stays within bounds; fusion formula applies corrected weights

#### Test Execution
> **Feature File:** [079](11--scoring-and-calibration/079-scoring-and-fusion-corrections.md)
> **Catalog:** [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)

### 080 | Pipeline and mutation hardening

#### Description
Confirm mutation hardening bundle.

#### Current Reality
Prompt: `Validate phase-017 pipeline and mutation hardening. Capture the evidence needed to prove CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure. Return a concise user-facing pass/fail verdict with the main reason.`

CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure

#### Test Execution
> **Feature File:** [080](14--pipeline-architecture/080-pipeline-and-mutation-hardening.md)
> **Catalog:** [14--pipeline-architecture/11-pipeline-and-mutation-hardening.md](../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md)

### 081 | Graph and cognitive memory fixes

#### Description
Confirm graph/cognitive fix bundle.

#### Current Reality
Prompt: `Validate graph and cognitive memory fixes. Capture the evidence needed to prove Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned. Return a concise user-facing pass/fail verdict with the main reason.`

Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned

#### Test Execution
> **Feature File:** [081](10--graph-signal-activation/081-graph-and-cognitive-memory-fixes.md)
> **Catalog:** [10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md](../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md)

### 082 | Evaluation and housekeeping fixes

#### Description
Confirm eval/housekeeping reliability.

#### Current Reality
Prompt: `Validate evaluation and housekeeping fixes. Capture the evidence needed to prove Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise user-facing pass/fail verdict with the main reason.`

Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly

#### Test Execution
> **Feature File:** [082](09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md)
> **Catalog:** [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md)

### 083 | Math.max/min stack overflow elimination

#### Description
Confirm large-array safety.

#### Current Reality
Prompt: `Validate Math.max/min stack overflow elimination. Capture the evidence needed to prove Large arrays (10k+ elements) processed without RangeError; numeric outputs match expected min/max values; no stack overflow in any code path. Return a concise user-facing pass/fail verdict with the main reason.`

Large arrays (10k+ elements) processed without RangeError; numeric outputs match expected min/max values; no stack overflow in any code path

#### Test Execution
> **Feature File:** [083](08--bug-fixes-and-data-integrity/083-math-max-min-stack-overflow-elimination.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md](../feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md)

### 084 | Session-manager transaction gap fixes

#### Description
Confirm transactional limit enforcement.

#### Current Reality
Prompt: `Validate session-manager transaction gap fixes. Capture the evidence needed to prove Concurrent writes are serialized via transactions; session limits enforced; no data corruption from concurrent access. Return a concise user-facing pass/fail verdict with the main reason.`

Concurrent writes are serialized via transactions; session limits enforced; no data corruption from concurrent access

#### Test Execution
> **Feature File:** [084](08--bug-fixes-and-data-integrity/084-session-manager-transaction-gap-fixes.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md](../feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md)

### 085 | Transaction wrappers on mutation handlers

#### Description
Confirm atomic wrapper behavior.

#### Current Reality
Prompt: `Validate mutation transaction wrappers. Capture the evidence needed to prove Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist. Return a concise user-facing pass/fail verdict with the main reason.`

Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist

#### Test Execution
> **Feature File:** [085](02--mutation/085-transaction-wrappers-on-mutation-handlers.md)
> **Catalog:** [02--mutation/06-transaction-wrappers-on-mutation-handlers.md](../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md)

### 086 | BM25 trigger phrase re-index gate

#### Description
Confirm trigger edit causes re-index.

#### Current Reality
Prompt: `Validate BM25 trigger phrase re-index gate. Capture the evidence needed to prove Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed. Return a concise user-facing pass/fail verdict with the main reason.`

Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed

#### Test Execution
> **Feature File:** [086](01--retrieval/086-bm25-trigger-phrase-re-index-gate.md)
> **Catalog:** [01--retrieval/06-bm25-trigger-phrase-re-index-gate.md](../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md)

### 087 | DB_PATH extraction and import standardization

#### Description
Confirm shared DB path resolution.

#### Current Reality
Prompt: `Validate DB_PATH extraction/import standardization. Capture the evidence needed to prove All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge. Return a concise user-facing pass/fail verdict with the main reason.`

All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge

#### Test Execution
> **Feature File:** [087](14--pipeline-architecture/087-db-path-extraction-and-import-standardization.md)
> **Catalog:** [14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md](../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md)

### 088 | Cross-AI validation fixes (Tier 4)

#### Description
Confirm tier-4 fix pack behavior.

#### Current Reality
Prompt: `Validate Phase 018 Tier-4 cross-AI fixes. Capture the evidence needed to prove Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality. Return a concise user-facing pass/fail verdict with the main reason.`

Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality

#### Test Execution
> **Feature File:** [088](09--evaluation-and-measurement/088-cross-ai-validation-fixes-tier-4.md)
> **Catalog:** [09--evaluation-and-measurement/14-cross-ai-validation-fixes.md](../feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md)

### 089 | Code standards alignment

#### Description
Confirm standards conformance.

#### Current Reality
Prompt: `Validate code standards alignment outcomes. Capture the evidence needed to prove Affected files follow naming conventions; comments are meaningful (not boilerplate); import order matches standard; no mismatches found. Return a concise user-facing pass/fail verdict with the main reason.`

Affected files follow naming conventions; comments are meaningful (not boilerplate); import order matches standard; no mismatches found

#### Test Execution
> **Feature File:** [089](16--tooling-and-scripts/089-code-standards-alignment.md)
> **Catalog:** [16--tooling-and-scripts/05-code-standards-alignment.md](../feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md)

### 090 | INT8 quantization evaluation (R5)

#### Description
Confirm no-go decision remains valid.

#### Current Reality
Prompt: `Re-evaluate INT8 quantization decision criteria. Capture the evidence needed to prove Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data. Return a concise user-facing pass/fail verdict with the main reason.`

Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data

#### Test Execution
> **Feature File:** [090](09--evaluation-and-measurement/090-int8-quantization-evaluation-r5.md)
> **Catalog:** [09--evaluation-and-measurement/16-int8-quantization-evaluation.md](../feature_catalog/09--evaluation-and-measurement/16-int8-quantization-evaluation.md)

### 091 | Implemented: graph centrality and community detection (N2)

#### Description
Confirm deferred->implemented status.

#### Current Reality
Prompt: `Verify N2 implemented and active. Capture the evidence needed to prove N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores. Return a concise user-facing pass/fail verdict with the main reason.`

N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores

#### Test Execution
> **Feature File:** [091](10--graph-signal-activation/091-implemented-graph-centrality-and-community-detection-n2.md)
> **Catalog:** [10--graph-signal-activation/07-community-detection.md](../feature_catalog/10--graph-signal-activation/07-community-detection.md)

### 092 | Implemented: auto entity extraction (R10)

#### Description
Confirm deferred->implemented status.

#### Current Reality
Prompt: `Verify R10 implemented and active. Capture the evidence needed to prove Entities automatically extracted on save; entity outputs contain expected entity types; default extraction settings are applied. Return a concise user-facing pass/fail verdict with the main reason.`

Entities automatically extracted on save; entity outputs contain expected entity types; default extraction settings are applied

#### Test Execution
> **Feature File:** [092](13--memory-quality-and-indexing/092-implemented-auto-entity-extraction-r10.md)
> **Catalog:** [13--memory-quality-and-indexing/10-auto-entity-extraction.md](../feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md)

### 093 | Implemented: memory summary generation (R8)

#### Description
Confirm deferred->implemented status.

#### Current Reality
Prompt: `Verify R8 implemented and gated. Capture the evidence needed to prove Summary generated for long memories; summary persisted in DB; scale gate prevents summary generation below corpus threshold. Return a concise user-facing pass/fail verdict with the main reason.`

Summary generated for long memories; summary persisted in DB; scale gate prevents summary generation below corpus threshold

#### Test Execution
> **Feature File:** [093](15--retrieval-enhancements/093-implemented-memory-summary-generation-r8.md)
> **Catalog:** [15--retrieval-enhancements/05-memory-summary-search-channel.md](../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md)

### 094 | Implemented: cross-document entity linking (S5)

#### Description
Confirm deferred->implemented status.

#### Current Reality
Prompt: `Verify S5 implemented and guarded. Capture the evidence needed to prove Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified. Return a concise user-facing pass/fail verdict with the main reason.`

Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified

#### Test Execution
> **Feature File:** [094](15--retrieval-enhancements/094-implemented-cross-document-entity-linking-s5.md)
> **Catalog:** [15--retrieval-enhancements/06-cross-document-entity-linking.md](../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md)

### 095 | Strict Zod schema validation (P0-1)

#### Description
Confirm schema enforcement rejects hallucinated params.

#### Current Reality
Prompt: `Validate SPECKIT_STRICT_SCHEMAS enforcement. Capture the evidence needed to prove Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise user-facing pass/fail verdict with the main reason.`

Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer

#### Test Execution
> **Feature File:** [095](14--pipeline-architecture/095-strict-zod-schema-validation-p0-1.md)
> **Catalog:** [14--pipeline-architecture/13-strict-zod-schema-validation.md](../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md)

### 096 | Provenance-rich response envelopes (P0-2)

#### Description
Confirm includeTrace opt-in exposes scores/source/trace.

#### Current Reality
Prompt: `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior. Capture the evidence needed to prove Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise user-facing pass/fail verdict with the main reason.`

Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields

#### Test Execution
> **Feature File:** [096](15--retrieval-enhancements/096-provenance-rich-response-envelopes-p0-2.md)
> **Catalog:** [15--retrieval-enhancements/08-provenance-rich-response-envelopes.md](../feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md)

### 097 | Async ingestion job lifecycle (P0-3)

#### Description
Confirm job state machine and crash recovery.

#### Current Reality
Prompt: `Validate memory_ingest_start/status/cancel lifecycle. Capture the evidence needed to prove Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart. Return a concise user-facing pass/fail verdict with the main reason.`

Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart

#### Test Execution
> **Feature File:** [097](05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md)
> **Catalog:** [05--lifecycle/05-async-ingestion-job-lifecycle.md](../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

### 098 | Local GGUF reranker via node-llama-cpp (P1-5)

#### Description
Confirm reranker gating and graceful fallback.

#### Current Reality
Prompt: `Validate RERANKER_LOCAL strict check and memory thresholds. Capture the evidence needed to prove Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; scoring runs sequentially in logs. Return a concise user-facing pass/fail verdict with the main reason.`

Reranker not activated for truthy-but-not-'true' values; silent fallback when model file missing; custom model path lowers the total-memory threshold to 2GB from the default 8GB; scoring runs sequentially in logs

#### Test Execution
> **Feature File:** [098](11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md)
> **Catalog:** [11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md](../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md)

### 099 | Real-time filesystem watching (P1-7)

#### Description
Confirm file watcher debounce, hash seeding, and ENOENT grace.

#### Current Reality
Prompt: `Validate SPECKIT_FILE_WATCHER behavior. Capture the evidence needed to prove File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash. Return a concise user-facing pass/fail verdict with the main reason.`

File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash

#### Test Execution
> **Feature File:** [099](16--tooling-and-scripts/099-real-time-filesystem-watching-p1-7.md)
> **Catalog:** [16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md](../feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md)

### 100 | Async shutdown with deadline (server lifecycle)

#### Description
Confirm graceful shutdown completes async cleanup.

#### Current Reality
Prompt: `Validate server shutdown deadline behavior. Capture the evidence needed to prove File watcher closes; local reranker disposes; vector index closes; shutdown completes within 5s; force exit fires if cleanup exceeds deadline. Return a concise user-facing pass/fail verdict with the main reason.`

File watcher closes; local reranker disposes; vector index closes; shutdown completes within 5s; force exit fires if cleanup exceeds deadline

#### Test Execution
> **Feature File:** [100](05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md)
> **Catalog:** *(server lifecycle — no dedicated catalog entry)*

### 101 | memory_delete confirm schema tightening

#### Description
Confirm confirm field accepts only literal true.

#### Current Reality
Prompt: `Validate memory_delete confirm:z.literal(true) enforcement. Capture the evidence needed to prove confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path. Return a concise user-facing pass/fail verdict with the main reason.`

confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path

#### Test Execution
> **Feature File:** [101](02--mutation/101-memory-delete-confirm-schema-tightening.md)
> **Catalog:** *(memory_delete confirm schema — covered by `02--mutation/03`)*

### 102 | node-llama-cpp optionalDependencies

#### Description
Confirm install succeeds without native build tools.

#### Current Reality
Prompt: `Validate node-llama-cpp as optionalDependency. Capture the evidence needed to prove node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent. Return a concise user-facing pass/fail verdict with the main reason.`

node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent

#### Test Execution
> **Feature File:** [102](11--scoring-and-calibration/102-node-llama-cpp-optionaldependencies.md)
> **Catalog:** *(node-llama-cpp optionalDependencies — covered by `11--scoring-and-calibration/14`)*

### 103 | UX hook module coverage (`mutation-feedback`, `response-hints`)

#### Description
Confirm new hook modules return the finalized metadata and hint shape.

#### Current Reality
Prompt: `Validate 103 hook module behavior for mutation feedback and response hints. Capture the evidence needed to prove Test output shows suite pass, including latency/cache-clear booleans and finalized hint payload assertions. Return a concise user-facing pass/fail verdict with the main reason.`

Test output shows suite pass, including latency/cache-clear booleans and finalized hint payload assertions

#### Test Execution
> **Feature File:** [103](18--ux-hooks/103-ux-hook-module-coverage-mutation-feedback-response-hints.md)
> **Catalog:** [18--ux-hooks/05-dedicated-ux-hook-modules.md](../feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md)

### 104 | Mutation save-path UX parity and no-op hardening

#### Description
Confirm duplicate-save no-op behavior and atomic-save parity/hints.

#### Current Reality
Prompt: `Run save-path UX scenarios and verify duplicate-save no-op behavior plus atomic-save parity. Capture the evidence needed to prove Suite passes and assertions show no false postMutationHooks on no-op saves, cache-left-unchanged messaging, and parity between standard and atomic save responses. Return a concise user-facing pass/fail verdict with the main reason.`

Suite passes and assertions show no false `postMutationHooks` on no-op saves, cache-left-unchanged messaging, and parity between standard and atomic save responses

#### Test Execution
> **Feature File:** [104](18--ux-hooks/104-mutation-save-path-ux-parity-and-no-op-hardening.md)
> **Catalog:** [18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md](../feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md)

### 105 | Context-server success-envelope finalization

#### Description
Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract.

#### Current Reality
Prompt: `Validate the finalized context-server success-envelope path, including token metadata recomputation. Capture the evidence needed to prove Context-server suite passes with end-to-end assertions for appended hints, preserved autoSurfacedContext, and finalized token metadata. Return a concise user-facing pass/fail verdict with the main reason.`

Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata

#### Test Execution
> **Feature File:** [105](18--ux-hooks/105-context-server-success-envelope-finalization.md)
> **Catalog:** [18--ux-hooks/08-context-server-success-hint-append.md](../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md)

### 106 | Hooks barrel + README synchronization

#### Description
Confirm hooks index exports and docs cover the finalized modules and contract fields.

#### Current Reality
Prompt: `Validate hook barrel and README coverage for the finalized UX-hook surface. Capture the evidence needed to prove Both barrel and README reference mutation-feedback, response-hints, MutationHookResult, and postMutationHooks. Return a concise user-facing pass/fail verdict with the main reason.`

Expected signals: Both barrel (`hooks/index.ts`) and README (`hooks/README.md`) reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`
Pass/fail: PASS if both files reference the new modules and contract fields

#### Test Execution
> **Feature File:** [106](18--ux-hooks/106-hooks-barrel-readme-synchronization.md)
> **Catalog:** [18--ux-hooks/12-hooks-readme-and-export-alignment.md](../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md)

### 107 | Checkpoint confirmName and schema enforcement

#### Description
Confirm delete safety is required across handler and validation layers.

#### Current Reality
Prompt: `Validate checkpoint delete confirmName enforcement across handler and schema layers. Capture the evidence needed to prove Validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting. Return a concise user-facing pass/fail verdict with the main reason.`

Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting

#### Test Execution
> **Feature File:** [107](18--ux-hooks/107-checkpoint-confirmname-and-schema-enforcement.md)
> **Catalog:** [18--ux-hooks/03-checkpoint-delete-confirmname-safety.md](../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md)

### 108 | Spec 007 finalized verification command suite evidence

#### Description
Confirm the recorded verification set matches the current Spec 007 evidence.

#### Current Reality
Prompt: `Run the finalized Spec 007 verification command suite and record evidence. Capture the evidence needed to prove npx tsc -b. Return a concise user-facing pass/fail verdict with the main reason.`

`npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed

#### Test Execution
> **Feature File:** [108](16--tooling-and-scripts/108-spec-007-finalized-verification-command-suite-evidence.md)
> **Catalog:** *(Spec 007 verification suite — no dedicated catalog entry)*

### 109 | Quality-aware 3-tier search fallback

#### Description
Confirm 3-tier degradation chain triggers correctly.

#### Current Reality
Prompt: `Validate SPECKIT_SEARCH_FALLBACK tiered degradation. Capture the evidence needed to prove Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation. Return a concise user-facing pass/fail verdict with the main reason.`

Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation

#### Test Execution
> **Feature File:** [109](01--retrieval/109-quality-aware-3-tier-search-fallback.md)
> **Catalog:** [01--retrieval/08-quality-aware-3-tier-search-fallback.md](../feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md)

### 110 | Prediction-error save arbitration

#### Description
Confirm 5-action PE decision engine during save.

#### Current Reality
Prompt: `Validate prediction-error save arbitration actions. Capture the evidence needed to prove Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration. Return a concise user-facing pass/fail verdict with the main reason.`

Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration

#### Test Execution
> **Feature File:** [110](02--mutation/110-prediction-error-save-arbitration.md)
> **Catalog:** [02--mutation/08-prediction-error-save-arbitration.md](../feature_catalog/02--mutation/08-prediction-error-save-arbitration.md)

### 111 | Deferred lexical-only indexing

#### Description
Confirm embedding-failure fallback and BM25 searchability.

#### Current Reality
Prompt: `Validate deferred lexical-only indexing fallback. Capture the evidence needed to prove Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex. Return a concise user-facing pass/fail verdict with the main reason.`

Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex

#### Test Execution
> **Feature File:** [111](13--memory-quality-and-indexing/111-deferred-lexical-only-indexing.md)
> **Catalog:** [13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md](../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md)

### 112 | Cross-process DB hot rebinding

#### Description
Confirm marker-file triggers DB reinitialization.

#### Current Reality
Prompt: `Validate cross-process DB hot rebinding via marker file. Capture the evidence needed to prove Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind. Return a concise user-facing pass/fail verdict with the main reason.`

Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind

#### Test Execution
> **Feature File:** [112](14--pipeline-architecture/112-cross-process-db-hot-rebinding.md)
> **Catalog:** [14--pipeline-architecture/17-cross-process-db-hot-rebinding.md](../feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md)

### 113 | Standalone admin CLI

#### Description
Confirm 4 CLI commands execute correctly.

#### Current Reality
Prompt: `Validate standalone admin CLI commands. Capture the evidence needed to prove stats shows tier distribution and schema version; dry-run shows plan without executing deletions; reindex completes with summary; schema-downgrade without --confirm shows safety prompt; destructive bulk-delete attempts a pre-delete checkpoint and warns rather than aborting if checkpoint persistence fails. Return a concise user-facing pass/fail verdict with the main reason.`

stats shows tier distribution and schema version; dry-run shows plan without executing deletions; reindex completes with summary; schema-downgrade without `--confirm` shows safety prompt; destructive bulk-delete attempts a pre-delete checkpoint and warns rather than aborting if checkpoint persistence fails

#### Test Execution
> **Feature File:** [113](16--tooling-and-scripts/113-standalone-admin-cli.md)
> **Catalog:** [16--tooling-and-scripts/07-standalone-admin-cli.md](../feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md)

### 114 | Path traversal validation (P0-4)

#### Description
Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments.

#### Current Reality
Prompt: `"Ingest a file using a path with ../ segments and verify rejection". Capture the evidence needed to prove Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created. Return a concise user-facing pass/fail verdict with the main reason.`

Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created

#### Test Execution
> **Feature File:** [114](05--lifecycle/114-path-traversal-validation-p0-4.md)
> **Catalog:** [05--lifecycle/05-async-ingestion-job-lifecycle.md](../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

### 115 | Transaction atomicity on rename failure (P0-5)

#### Description
Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.

#### Current Reality
Prompt: `"Simulate rename failure after DB commit and verify pending file survives". Capture the evidence needed to prove Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file. Return a concise user-facing pass/fail verdict with the main reason.`

Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file

#### Test Execution
> **Feature File:** [115](14--pipeline-architecture/115-transaction-atomicity-on-rename-failure-p0-5.md)
> **Catalog:** [14--pipeline-architecture/21-atomic-pending-file-recovery.md](../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md)

### 116 | Chunking safe swap atomicity (P0-6)

#### Description
Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails.

#### Current Reality
Prompt: `"Re-chunk a parent memory and verify old children survive indexing failure". Capture the evidence needed to prove New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure. Return a concise user-facing pass/fail verdict with the main reason.`

New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure

#### Test Execution
> **Feature File:** [116](08--bug-fixes-and-data-integrity/116-chunking-safe-swap-atomicity-p0-6.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md](../feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md)

### 117 | SQLite datetime session cleanup (P0-7)

#### Description
Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format.

#### Current Reality
Prompt: `"Create sessions with known timestamps and verify cleanup deletes only expired ones". Capture the evidence needed to prove Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats. Return a concise user-facing pass/fail verdict with the main reason.`

Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats

#### Test Execution
> **Feature File:** [117](08--bug-fixes-and-data-integrity/117-sqlite-datetime-session-cleanup-p0-7.md)
> **Catalog:** [08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md](../feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md)

### 118 | Stage-2 score field synchronization (P0-8)

#### Description
Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting.

#### Current Reality
Prompt: `Run a non-hybrid search with intent weighting and verify score fields stay synchronized. Capture the evidence needed to prove intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value. Return a concise user-facing pass/fail verdict with the main reason.`

intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value

#### Test Execution
> **Feature File:** [118](11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md)
> **Catalog:** [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)

### 119 | Memory filename uniqueness (ensureUniqueMemoryFilename)

#### Description
Confirm collision resolution.

#### Current Reality
Prompt: `Validate memory filename collision prevention. Return a concise user-facing pass/fail verdict with the main reason.`



#### Test Execution
> **Feature File:** [119](13--memory-quality-and-indexing/119-memory-filename-uniqueness-ensureuniquememoryfilename.md)
> **Catalog:** [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

### 120 | Unified graph rollback and explainability (Phase 3)

#### Description
Confirm graph kill switch removes graph-side effects while traces still explain enabled runs.

#### Current Reality
Prompt: `Validate Phase 3 graph rollback and explainability. Capture the evidence needed to prove When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; when disabled, graph-side effects are absent and baseline ordering remains deterministic. Return a concise user-facing pass/fail verdict with the main reason.`

When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; when disabled, graph-side effects are absent and baseline ordering remains deterministic

#### Test Execution
> **Feature File:** [120](10--graph-signal-activation/120-unified-graph-rollback-and-explainability-phase-3.md)
> **Catalog:** [10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md](../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md)

### 121 | Adaptive shadow proposal and rollback (Phase 4)

#### Description
Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly.

#### Current Reality
Prompt: `Validate Phase 4 adaptive shadow proposal flow. Capture the evidence needed to prove Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output. Return a concise user-facing pass/fail verdict with the main reason.`

Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output

#### Test Execution
> **Feature File:** [121](11--scoring-and-calibration/121-adaptive-shadow-proposal-and-rollback-phase-4.md)
> **Catalog:** [11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md](../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md)

### 122 | Governed ingest and scope isolation (Phase 5)

#### Description
Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage.

#### Current Reality
Prompt: `Validate Phase 5 governed ingest and retrieval isolation. Capture the evidence needed to prove agentId,sessionId,provenanceSource,provenanceActor} metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review governance_audit rows. Return a concise user-facing pass/fail verdict with the main reason.`

agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows

#### Test Execution
> **Feature File:** [122](17--governance/122-governed-ingest-and-scope-isolation-phase-5.md)
> **Catalog:** [17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md)

### 123 | Shared-space deny-by-default rollout (Phase 6)

#### Description
Confirm shared-memory spaces require explicit membership and respect rollout/kill-switch controls.

#### Current Reality
Prompt: `Validate Phase 6 shared-memory rollout controls. Capture the evidence needed to prove Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members. Return a concise user-facing pass/fail verdict with the main reason.`

Non-members are denied by default; explicit membership grants access; kill switch blocks access immediately even for existing members

#### Test Execution
> **Feature File:** [123](17--governance/123-shared-space-deny-by-default-rollout-phase-6.md)
> **Catalog:** [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md)

### 124 | Automatic archival lifecycle coverage

#### Description
Verify archive/unarchive keeps metadata rows while syncing BM25 and vec_memories behavior.

#### Current Reality
Prompt: `Validate automatic archival subsystem vector/BM25 parity and protected tier behavior. Capture the evidence needed to prove Archived memory keeps metadata row with is_archived=1, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived. Return a concise user-facing pass/fail verdict with the main reason.`

Archived memory keeps metadata row with `is_archived=1`, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived

#### Test Execution
> **Feature File:** [124](05--lifecycle/124-automatic-archival-lifecycle-coverage.md)
> **Catalog:** [05--lifecycle/07-automatic-archival-subsystem.md](../feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md)

### 125 | Hydra roadmap capability flags

#### Description
Verify prefixed Hydra roadmap flags stay distinct from live runtime flags while remaining default-on unless explicitly opted out.

#### Current Reality
Prompt: `Validate memory roadmap flag snapshots without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove First snapshot remains phase:"shared-rollout" with capabilities.graphUnified:true; second snapshot reports phase:"graph" with capabilities.graphUnified:false. Return a concise user-facing pass/fail verdict with the main reason.`

First snapshot remains `phase:\"shared-rollout\"` with `capabilities.graphUnified:true`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false`

#### Test Execution
> **Feature File:** [125](19--feature-flag-reference/125-hydra-roadmap-capability-flags.md)
> **Catalog:** [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)

### 126 | Memory roadmap baseline snapshot

#### Description
Verify Phase 1 readiness baselines capture/persist metrics and handle missing context DBs without throwing.

#### Current Reality
Prompt: `Run the memory roadmap baseline snapshot verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows persisted snapshot rows and missing-context DB zero fallback coverage. Return a concise user-facing pass/fail verdict with the main reason.`

Targeted suite passes; transcript shows persisted snapshot rows and missing-context DB zero fallback coverage

#### Test Execution
> **Feature File:** [126](09--evaluation-and-measurement/126-memory-roadmap-baseline-snapshot.md)
> **Catalog:** [09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md](../feature_catalog/09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md)

### 127 | Migration checkpoint scripts

#### Description
Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.

#### Current Reality
Prompt: `Run the migration checkpoint script verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage. Return a concise user-facing pass/fail verdict with the main reason.`

Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage

#### Test Execution
> **Feature File:** [127](16--tooling-and-scripts/127-migration-checkpoint-scripts.md)
> **Catalog:** [16--tooling-and-scripts/09-migration-checkpoint-scripts.md](../feature_catalog/16--tooling-and-scripts/09-migration-checkpoint-scripts.md)

### 128 | Schema compatibility validation

#### Description
Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.

#### Current Reality
Prompt: `Run the schema compatibility validation suite. Capture the evidence needed to prove Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage. Return a concise user-facing pass/fail verdict with the main reason.`

Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage

#### Test Execution
> **Feature File:** [128](16--tooling-and-scripts/128-schema-compatibility-validation.md)
> **Catalog:** [16--tooling-and-scripts/10-schema-compatibility-validation.md](../feature_catalog/16--tooling-and-scripts/10-schema-compatibility-validation.md)

### 129 | Lineage state active projection and asOf resolution

#### Description
Verify append-first lineage projection and deterministic `asOf` resolution.

#### Current Reality
Prompt: `Run the lineage state verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows active projection selection, deterministic asOf resolution, and malformed-chain detection. Return a concise user-facing pass/fail verdict with the main reason.`

Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, and malformed-chain detection

#### Test Execution
> **Feature File:** [129](14--pipeline-architecture/129-lineage-state-active-projection-and-asof-resolution.md)
> **Catalog:** [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)

### 130 | Lineage backfill rollback drill

#### Description
Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout.

#### Current Reality
Prompt: `Run the lineage backfill + rollback verification suite. Capture the evidence needed to prove Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback. Return a concise user-facing pass/fail verdict with the main reason.`

Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback

#### Test Execution
> **Feature File:** [130](14--pipeline-architecture/130-lineage-backfill-rollback-drill.md)
> **Catalog:** [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md)

### 131 | Description.json batch backfill validation (PI-B3)

#### Description
Confirm batch-generated folder descriptions exist and conform to schema.

#### Current Reality
Prompt: `Validate PI-B3 batch backfill results. Capture the evidence needed to prove Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with specId string, parentChain array of strings, and memorySequence number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback. Return a concise user-facing pass/fail verdict with the main reason.`

Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback

#### Test Execution
> **Feature File:** [131](13--memory-quality-and-indexing/131-description-json-batch-backfill-validation-pi-b3.md)
> **Catalog:** [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

### 132 | description.json schema field validation

#### Description
Confirm per-folder description metadata matches schema contract.

#### Current Reality
Prompt: `Validate description.json required fields and types. Capture the evidence needed to prove description.json generated on folder creation with all 9 required fields; field types match contract with strings for specId, folderSlug, specFolder, description, and lastUpdated, arrays of strings for parentChain, memoryNameHistory, and keywords, and number for memorySequence; memorySequence and memoryNameHistory update on save; corrupted fields repaired on regeneration. Return a concise user-facing pass/fail verdict with the main reason.`

description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration

#### Test Execution
> **Feature File:** [132](13--memory-quality-and-indexing/132-description-json-schema-field-validation.md)
> **Catalog:** [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

### 133 | Dry-run preflight for memory_save

#### Description
Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects.

#### Current Reality
Prompt: `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.`

Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file

#### Test Execution
> **Feature File:** [133](13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md)
> **Catalog:** [13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md](../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md)

### 134 | Startup pending-file recovery lifecycle coverage

#### Description
Verify startup recovery scans allowed roots and preserves stale pending files for manual review.

#### Current Reality
Prompt: `Validate startup pending-file recovery behavior across committed and stale files. Capture the evidence needed to prove Committed pending file recovers to original path; stale pending file remains with explicit stale classification; startup scan covers configured/allowed roots without scanning unrelated workspace trees. Return a concise user-facing pass/fail verdict with the main reason.`

Committed pending file recovers to original path; stale pending file remains with explicit stale classification; startup scan covers configured/allowed roots without scanning unrelated workspace trees

#### Test Execution
> **Feature File:** [134](05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md)
> **Catalog:** [05--lifecycle/06-startup-pending-file-recovery.md](../feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md)

### 135 | Grep traceability for feature catalog code references

#### Description
Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits.

#### Current Reality
Prompt: `Validate feature catalog grep traceability. Capture the evidence needed to prove Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist. Return a concise user-facing pass/fail verdict with the main reason.`

Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist

#### Test Execution
> **Feature File:** [135](16--tooling-and-scripts/135-grep-traceability-for-feature-catalog-code-references.md)
> **Catalog:** [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

### 136 | Feature catalog annotation name validity

#### Description
Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.

#### Current Reality
Prompt: `Validate all Feature catalog annotation names against catalog. Capture the evidence needed to prove sort -u 2) Extract all H3 headings from feature_catalog/feature_catalog.md: grep "^### " feature_catalog.md 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches. Return a concise user-facing pass/fail verdict with the main reason.`

sort -u` 2) Extract all H3 headings from `feature_catalog/feature_catalog.md`: `grep "^### " feature_catalog.md` 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches

#### Test Execution
> **Feature File:** [136](16--tooling-and-scripts/136-feature-catalog-annotation-name-validity.md)
> **Catalog:** [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

### 137 | Multi-feature annotation coverage

#### Description
Verify known multi-feature files have annotation count >= 2.

#### Current Reality
Prompt: `Validate multi-feature files carry all applicable annotations. Capture the evidence needed to prove All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate. Return a concise user-facing pass/fail verdict with the main reason.`

All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate

#### Test Execution
> **Feature File:** [137](16--tooling-and-scripts/137-multi-feature-annotation-coverage.md)
> **Catalog:** [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

### 138 | MODULE: header compliance via verify_alignment_drift.py

#### Description
Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings.

#### Current Reality
Prompt: `Validate MODULE: header compliance across all non-test .ts files. Capture the evidence needed to prove verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings. Return a concise user-facing pass/fail verdict with the main reason.`

verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings

#### Test Execution
> **Feature File:** [138](16--tooling-and-scripts/138-module-header-compliance-via-verify-alignment-drift-py.md)
> **Catalog:** [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

### 139 | Session capturing pipeline quality

#### Description
Canonical coverage sourced from M-007 session-capturing closure verification.

#### Current Reality
Prompt: `Run the canonical M-007 session-capturing closure verification scenario. Capture the evidence needed to prove Coverage is sourced from the M-007 closure suite, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, Phase 018 output-quality hardening, insufficiency rejection, and indexing readiness. Return a concise user-facing pass/fail verdict with the main reason.`

Coverage is sourced from the M-007 closure suite, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, Phase 018 output-quality hardening, insufficiency rejection, and indexing readiness.

Current claim boundary:
- Automated parity proves the shared runtime contract.
- Retained live artifacts are still required before claiming flawless current coverage across every supported CLI and save mode.

#### Test Execution
> **Feature File:** [139](16--tooling-and-scripts/139-session-capturing-pipeline-quality.md)
> **Catalog:** [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

### 142 | Session transition trace contract

#### Description
Verify `memory_context` emits trace-only session transitions with no non-trace leakage.

#### Current Reality
Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`

Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled

#### Test Execution
> **Feature File:** [142](01--retrieval/142-session-transition-trace-contract.md)
> **Catalog:** [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

### 143 | Bounded graph-walk rollout and diagnostics

#### Description
Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering.

#### Current Reality
Prompt: `Validate bounded graph-walk rollout states and trace diagnostics. Capture the evidence needed to prove Rollout states switch cleanly between trace_only, bounded_runtime, and off; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; off disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering. Return a concise user-facing pass/fail verdict with the main reason.`

Rollout states switch cleanly between `trace_only`, `bounded_runtime`, and `off`; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; `off` disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering

#### Test Execution
> **Feature File:** [143](01--retrieval/143-bounded-graph-walk-rollout-and-diagnostics.md)
> **Catalog:** [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

### 144 | Advisory ingest lifecycle forecast

#### Description
Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress.

#### Current Reality
Prompt: `Validate ingest forecast contract and early-progress caveats. Capture the evidence needed to prove Status payloads always include a forecast object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive. Return a concise user-facing pass/fail verdict with the main reason.`

Status payloads always include a `forecast` object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive

#### Test Execution
> **Feature File:** [144](05--lifecycle/144-advisory-ingest-lifecycle-forecast.md)
> **Catalog:** [05--lifecycle/05-async-ingestion-job-lifecycle.md](../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

### 145 | Contextual tree injection (P1-4)

#### Description
Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.

#### Current Reality
Prompt: `Validate contextual tree injection header format and flag toggle. Capture the evidence needed to prove Enabled: results with spec-folder paths have [parent > child — description] headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. Return a concise user-facing pass/fail verdict with the main reason.`

Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged

#### Test Execution
> **Feature File:** [145](15--retrieval-enhancements/145-contextual-tree-injection-p1-4.md)
> **Catalog:** [15--retrieval-enhancements/09-contextual-tree-injection.md](../feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md)

### 146 | Dynamic server instructions (P1-6)

#### Description
Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning.

#### Current Reality
Prompt: `Validate dynamic server instructions at MCP initialization. Capture the evidence needed to prove Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions. Return a concise user-facing pass/fail verdict with the main reason.`

Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions

#### Test Execution
> **Feature File:** [146](14--pipeline-architecture/146-dynamic-server-instructions-p1-6.md)
> **Catalog:** [14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md](../feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md)

### 147 | Constitutional memory manager command

#### Description
Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.

#### Current Reality
Prompt: `Validate /memory:learn constitutional manager flow and documentation consistency. Capture the evidence needed to prove Constitutional memory manager. Return a concise user-facing pass/fail verdict with the main reason.`

Constitutional memory manager

#### Test Execution
> **Feature File:** [147](16--tooling-and-scripts/147-constitutional-memory-manager-command.md)
> **Catalog:** [16--tooling-and-scripts/13-constitutional-memory-manager-command.md](../feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md)

### 148 | Shared-memory disabled-by-default and first-run setup

#### Description
Confirm shared memory is off by default, enable flow works, persistence survives restart, env var overrides DB, and enable is idempotent.

#### Current Reality
Prompt: `Validate shared-memory default-off enablement and first-run setup. Capture the evidence needed to prove Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; /memory:shared command shows setup prompt when disabled. Return a concise user-facing pass/fail verdict with the main reason.`

Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; /memory:shared command shows setup prompt when disabled

#### Test Execution
> **Feature File:** [148](17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md)
> **Catalog:** [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md)

### 149 | Rendered memory template contract

#### Description
Confirm malformed rendered memories fail before write/index and valid rendered output remains validator-clean.

#### Current Reality
Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`

Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean

#### Test Execution
> **Feature File:** [149](16--tooling-and-scripts/149-rendered-memory-template-contract.md)
> **Catalog:** [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

### 153 | JSON mode hybrid enrichment

#### Description
Verify the structured JSON summary contract for `generate-context.js`, including `toolCalls`/`exchanges` fields, file-backed JSON authority, and Wave 2 hardening.

#### Current Reality
Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a concise user-facing pass/fail verdict.`

Structured fields preserved in rendered output, counts match explicit input, no fallback into stateless reconstruction

#### Test Execution
> **Feature File:** [153](16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md)
> **Catalog:** [16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md](../feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md)

### 154 | JSON-primary deprecation posture

#### Description
Verify the JSON-only save contract: `--json` succeeds, direct positional rejects.

#### Current Reality
Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`

Path 1 exits 0, Path 2 exits non-zero with guidance text

#### Test Execution
> **Feature File:** [154](16--tooling-and-scripts/154-json-primary-deprecation-posture.md)
> **Catalog:** [16--tooling-and-scripts/17-json-primary-deprecation-posture.md](../feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md)

### 155 | Post-save quality review

#### Description
Confirm the POST-SAVE QUALITY REVIEW hook fires after JSON mode saves, surfaces field-propagation failures with severity-graded instructions, and guides AI remediation.

#### Current Reality
Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`

REVIEW block present in stdout; issue count and severity match the scenario; fix instructions are actionable

#### Test Execution
> **Feature File:** [155](13--memory-quality-and-indexing/155-post-save-quality-review.md)
> **Catalog:** [13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md](../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md)

---

## 9. PHASE SYSTEM FEATURES

### PHASE-001 | Phase detection scoring

#### Description
Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output.

#### Current Reality
Prompt: `Verify phase detection scoring produces valid 4-dimension output for a complex spec folder. Capture the evidence needed to prove JSON output contains recommended_phases (boolean), phase_score (number), suggested_phase_count (number), and 4 dimension scores (LOC Factor 35%, File Count 20%, Risk Factors 25%, Complexity 20%); simple specs score low. Return a concise user-facing pass/fail verdict with the main reason.`

JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low

#### Test Execution
> **Feature File:** [PHASE-001](16--tooling-and-scripts/001-phase-detection-scoring.md)

### PHASE-002 | Phase folder creation

#### Description
Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure.

#### Current Reality
Prompt: `Create a phase-decomposed spec folder and verify parent and child structure. Capture the evidence needed to prove Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders. Return a concise user-facing pass/fail verdict with the main reason.`

Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders

#### Test Execution
> **Feature File:** [PHASE-002](16--tooling-and-scripts/002-phase-folder-creation.md)

### PHASE-003 | Recursive phase validation

#### Description
Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.

#### Current Reality
Prompt: `Run recursive validation on a phase parent and verify aggregated per-phase results. Capture the evidence needed to prove Per-phase pass/fail in output; JSON phases array; combined exit code reflects worst child; error propagation works. Return a concise user-facing pass/fail verdict with the main reason.`

Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works

#### Test Execution
> **Feature File:** [PHASE-003](16--tooling-and-scripts/003-recursive-phase-validation.md)

### PHASE-004 | Phase link validation

#### Description
Run `check-phase-links.sh` on a phase folder and verify 4 link checks at warn severity.

#### Current Reality
Prompt: `Validate phase link integrity across parent and child folders. Capture the evidence needed to prove 4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity. Return a concise user-facing pass/fail verdict with the main reason.`

4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity

#### Test Execution
> **Feature File:** [PHASE-004](16--tooling-and-scripts/004-phase-link-validation.md)

### PHASE-005 | Phase command workflow

#### Description
Execute `/spec_kit:phase` command in auto mode and verify 7-step workflow.

#### Current Reality
Prompt: `Run the spec_kit:phase command end-to-end and verify all 7 workflow steps complete. Capture the evidence needed to prove All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths. Return a concise user-facing pass/fail verdict with the main reason.`

All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths

#### Test Execution
> **Feature File:** [PHASE-005](16--tooling-and-scripts/005-phase-command-workflow.md)

### Catalog Coverage Notes for Phases 001-018

These 30 catalog entries are explicitly documented here even when validation is automated-only or routed through a shared operator scenario.

| Catalog Entry | Coverage Status | Coverage Path / Notes |
|---|---|---|
| `01--retrieval/07-ast-level-section-retrieval-tool.md` | Deferred | Not yet implemented |
| `01--retrieval/09-tool-result-extraction-to-working-memory.md` | Automated only | Covered by `working-memory.vitest.ts`, `working-memory-event-decay.vitest.ts`, and `checkpoint-working-memory.vitest.ts` |
| `02--mutation/07-namespace-management-crud-tools.md` | Deferred | Not yet implemented |
| `02--mutation/09-correction-tracking-with-undo.md` | Automated only | Covered by mutation regression tests; no dedicated operator scenario yet |
| `02--mutation/10-per-memory-history-log.md` | Manual + automated | Covered by mutation/history suites and dedicated direct manual scenario M-008 |
| `10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md` | Deferred | Planned for Sprint 019; not yet implemented |
| `11--scoring-and-calibration/15-tool-level-ttl-cache.md` | Automated only | Cache policy behavior is exercised in scoring/cache tests |
| `11--scoring-and-calibration/16-access-driven-popularity-scoring.md` | Automated only | Popularity heuristics are validated by ranking tests |
| `11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md` | Automated only | Temporal/structural scoring logic is covered by scoring suites |
| `13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md` | Indirect scenario coverage | Covered implicitly via 045 (smarter content generation) |
| `13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md` | Indirect scenario coverage | Covered implicitly via 004 (SHA-256 deduplication) |
| `13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` | Manual + automated | Dedicated memory workflow coverage exists in M-005 |
| `14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md` | Automated only | Startup concern; validated implicitly by startup/runtime coverage |
| `14--pipeline-architecture/15-warm-server-daemon-mode.md` | Deferred | Not yet implemented |
| `14--pipeline-architecture/16-backend-storage-adapter-abstraction.md` | Automated only | Covered by `interfaces.vitest.ts`, `pipeline-architecture-remediation.vitest.ts`, and `vector-index-impl.vitest.ts`; no operator-facing manual step is required today |
| `14--pipeline-architecture/18-atomic-write-then-index-api.md` | Indirect scenario coverage | Covered by 104 and atomic-save failure-injection tests |
| `14--pipeline-architecture/19-embedding-retry-orchestrator.md` | Automated only | Covered by `retry-manager.vitest.ts` and `index-refresh.vitest.ts` |
| `14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md` | Automated only | Dispatch behavior is covered by context-server and dispatch-matrix tests |
| `15--retrieval-enhancements/09-contextual-tree-injection.md` | Manual + automated | Covered directly by 145 and `hybrid-search-context-headers.vitest.ts` |
| `16--tooling-and-scripts/02-architecture-boundary-enforcement.md` | Build-time only | Enforced by build/test tooling rather than runtime playbook steps |
| `16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md` | Automated only | Covered by `mcp_server/tests/file-watcher.vitest.ts`; no dedicated manual operator scenario yet |
| `18--ux-hooks/01-shared-post-mutation-hook-wiring.md` | Indirect scenario coverage | Covered by 085, 103, and 104 |
| `18--ux-hooks/02-memory-health-autorepair-metadata.md` | Automated only | Covered by `handler-memory-health-edge.vitest.ts` and `memory-crud-extended.vitest.ts` (autoRepair, confirmation-only, partialSuccess). EX-013 covers basic health diagnostics only |
| `18--ux-hooks/04-schema-and-type-contract-synchronization.md` | Indirect scenario coverage | Covered by 107 (confirmName enforcement) and hook-contract tests. 095 covers strict-param rejection only |
| `18--ux-hooks/06-mutation-hook-result-contract-expansion.md` | Indirect scenario coverage | Covered by 103 |
| `18--ux-hooks/07-mutation-response-ux-payload-exposure.md` | Indirect scenario coverage | Covered by 104 |
| `18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md` | Indirect scenario coverage | Covered by 104 |
| `18--ux-hooks/11-final-token-metadata-recomputation.md` | Indirect scenario coverage | Covered by 105 |
| `18--ux-hooks/13-end-to-end-success-envelope-verification.md` | Indirect scenario coverage | Covered by 105 |
| `16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` | Manual + automated | Absorbs phases 002 (contamination-detection), 004 (type-consolidation), 005 (confidence-calibration), 007 (phase-classification), 008 (signal-extraction), and 014 (spec-descriptions). Covered by M-007 compound scenario, build/typecheck, and automated extractor/loader suites |

---

## 10. DEDICATED MEMORY/SPEC-KIT SCENARIOS (REQUIRED)

### M-001 | Context Recovery and Continuation

#### Description
Canonical memory/spec-kit workflow.

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

#### Test Execution
> **Feature File:** [M-001](01--retrieval/001-context-recovery-and-continuation.md)

### M-002 | Targeted Memory Lookup

#### Description
Canonical memory/spec-kit workflow.

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

#### Test Execution
> **Feature File:** [M-002](01--retrieval/002-targeted-memory-lookup.md)

### M-003 | Context Save + Index Update

#### Description
Canonical memory/spec-kit workflow.

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

Prompt: `Save fresh context for the target spec folder, run an index scan immediately after the save, and verify the saved artifacts are discoverable in retrieval results. Capture the save and index evidence, and return a concise user-facing pass/fail verdict with the main reason.`


#### Test Execution
> **Feature File:** [M-003](13--memory-quality-and-indexing/003-context-save-index-update.md)

### M-004 | Main-Agent Review and Verdict Handoff

#### Description
Canonical memory/spec-kit workflow.

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

#### Test Execution
> **Feature File:** [M-004](16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md)

### M-005 | Outsourced Agent Memory Capture Round-Trip

#### Description
#### M-005a: JSON-mode hard-fail (REQ-001)

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

#### Test Execution
> **Feature File:** [M-005](13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md)

### M-006 | Stateless Enrichment and Alignment Guardrails

#### Description
#### M-006a: Unborn-HEAD and dirty snapshot fallback

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

#### Test Execution
> **Feature File:** [M-006](13--memory-quality-and-indexing/006-stateless-enrichment-and-alignment-guardrails.md)

### M-007 | Session Capturing Pipeline Quality

#### Description
Canonical memory/spec-kit workflow.

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

Minimum scenario family now required for M-007:
- structured `--stdin` save with explicit CLI target precedence
- structured `--json` save with payload-target fallback when no explicit CLI override exists
- same-minute repeated saves that prove unique filenames and stable `description.json` tracking
- direct positional save without `--json`/`--stdin` that rejects with migration guidance to structured JSON

Proof rule:
- Treat automated M-007 parity as the runtime contract baseline.
- Only claim “flawless across every CLI” when the current verification run captures fresh live artifacts for each supported CLI and each supported save mode covered by the current contract.

#### Test Execution
> **Feature File:** [M-007](16--tooling-and-scripts/007-session-capturing-pipeline-quality.md)

### M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log)

#### Description
Canonical memory/spec-kit workflow.

#### Current Reality
Canonical prose workflow retained in the snippet because the scenario includes multi-step operator logic, supplemental checks, or shared closure rules.

#### Test Execution
> **Feature File:** [M-008](02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

This split playbook keeps automated coverage references in three places:
- Per-feature catalog links in the root directory and snippet references.
- The catalog coverage notes section for automated-only, indirect, or deferred coverage.
- Dedicated memory/spec-kit snippets where shared manual scenarios absorb multiple catalog entries.

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

| Playbook ID | Category | Feature Name | Snippet | Catalog Entry |
|---|---|---|---|---|
| EX-001 | Existing Features | Unified context retrieval (memory_context) | [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md) | [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) |
| EX-002 | Existing Features | Semantic and lexical search (memory_search) | [EX-002](01--retrieval/002-semantic-and-lexical-search-memory-search.md) | [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) |
| EX-003 | Existing Features | Trigger phrase matching (memory_match_triggers) | [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md) | [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) |
| EX-004 | Existing Features | Hybrid search pipeline | [EX-004](01--retrieval/004-hybrid-search-pipeline.md) | [01--retrieval/04-hybrid-search-pipeline.md](../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md) |
| EX-005 | Existing Features | 4-stage pipeline architecture | [EX-005](01--retrieval/005-4-stage-pipeline-architecture.md) | [01--retrieval/05-4-stage-pipeline-architecture.md](../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md) |
| EX-006 | Existing Features | Memory indexing (memory_save) | [EX-006](02--mutation/006-memory-indexing-memory-save.md) | [02--mutation/01-memory-indexing-memorysave.md](../feature_catalog/02--mutation/01-memory-indexing-memorysave.md) |
| EX-007 | Existing Features | Memory metadata update (memory_update) | [EX-007](02--mutation/007-memory-metadata-update-memory-update.md) | [02--mutation/02-memory-metadata-update-memoryupdate.md](../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md) |
| EX-008 | Existing Features | Single and folder delete (memory_delete) | [EX-008](02--mutation/008-single-and-folder-delete-memory-delete.md) | [02--mutation/03-single-and-folder-delete-memorydelete.md](../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md) |
| EX-009 | Existing Features | Tier-based bulk deletion (memory_bulk_delete) | [EX-009](02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md) | [02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md) |
| EX-010 | Existing Features | Validation feedback (memory_validate) | [EX-010](02--mutation/010-validation-feedback-memory-validate.md) | [02--mutation/05-validation-feedback-memoryvalidate.md](../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md) |
| EX-011 | Existing Features | Memory browser (memory_list) | [EX-011](03--discovery/011-memory-browser-memory-list.md) | [03--discovery/01-memory-browser-memorylist.md](../feature_catalog/03--discovery/01-memory-browser-memorylist.md) |
| EX-012 | Existing Features | System statistics (memory_stats) | [EX-012](03--discovery/012-system-statistics-memory-stats.md) | [03--discovery/02-system-statistics-memorystats.md](../feature_catalog/03--discovery/02-system-statistics-memorystats.md) |
| EX-013 | Existing Features | Health diagnostics (memory_health) | [EX-013](03--discovery/013-health-diagnostics-memory-health.md) | [03--discovery/03-health-diagnostics-memoryhealth.md](../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md) |
| EX-014 | Existing Features | Workspace scanning and indexing (memory_index_scan) | [EX-014](04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md) | [04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md](../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md) |
| EX-015 | Existing Features | Checkpoint creation (checkpoint_create) | [EX-015](05--lifecycle/015-checkpoint-creation-checkpoint-create.md) | [05--lifecycle/01-checkpoint-creation-checkpointcreate.md](../feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md) |
| EX-016 | Existing Features | Checkpoint listing (checkpoint_list) | [EX-016](05--lifecycle/016-checkpoint-listing-checkpoint-list.md) | [05--lifecycle/02-checkpoint-listing-checkpointlist.md](../feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md) |
| EX-017 | Existing Features | Checkpoint restore (checkpoint_restore) | [EX-017](05--lifecycle/017-checkpoint-restore-checkpoint-restore.md) | [05--lifecycle/03-checkpoint-restore-checkpointrestore.md](../feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md) |
| EX-018 | Existing Features | Checkpoint deletion (checkpoint_delete) | [EX-018](05--lifecycle/018-checkpoint-deletion-checkpoint-delete.md) | [05--lifecycle/04-checkpoint-deletion-checkpointdelete.md](../feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md) |
| EX-019 | Existing Features | Causal edge creation (memory_causal_link) | [EX-019](06--analysis/019-causal-edge-creation-memory-causal-link.md) | [06--analysis/01-causal-edge-creation-memorycausallink.md](../feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md) |
| EX-020 | Existing Features | Causal graph statistics (memory_causal_stats) | [EX-020](06--analysis/020-causal-graph-statistics-memory-causal-stats.md) | [06--analysis/02-causal-graph-statistics-memorycausalstats.md](../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md) |
| EX-021 | Existing Features | Causal edge deletion (memory_causal_unlink) | [EX-021](06--analysis/021-causal-edge-deletion-memory-causal-unlink.md) | [06--analysis/03-causal-edge-deletion-memorycausalunlink.md](../feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md) |
| EX-022 | Existing Features | Causal chain tracing (memory_drift_why) | [EX-022](06--analysis/022-causal-chain-tracing-memory-drift-why.md) | [06--analysis/04-causal-chain-tracing-memorydriftwhy.md](../feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md) |
| EX-023 | Existing Features | Epistemic baseline capture (task_preflight) | [EX-023](06--analysis/023-epistemic-baseline-capture-task-preflight.md) | [06--analysis/05-epistemic-baseline-capture-taskpreflight.md](../feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md) |
| EX-024 | Existing Features | Post-task learning measurement (task_postflight) | [EX-024](06--analysis/024-post-task-learning-measurement-task-postflight.md) | [06--analysis/06-post-task-learning-measurement-taskpostflight.md](../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md) |
| EX-025 | Existing Features | Learning history (memory_get_learning_history) | [EX-025](06--analysis/025-learning-history-memory-get-learning-history.md) | [06--analysis/07-learning-history-memorygetlearninghistory.md](../feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md) |
| EX-026 | Existing Features | Ablation studies (eval_run_ablation) | [EX-026](07--evaluation/026-ablation-studies-eval-run-ablation.md) | [07--evaluation/01-ablation-studies-evalrunablation.md](../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md) |
| EX-027 | Existing Features | Reporting dashboard (eval_reporting_dashboard) | [EX-027](07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md) | [07--evaluation/02-reporting-dashboard-evalreportingdashboard.md](../feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md) |
| EX-028 | Existing Features | 1. Search Pipeline Features (SPECKIT_*) | [EX-028](19--feature-flag-reference/028-1-search-pipeline-features-speckit.md) | [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) |
| EX-029 | Existing Features | 2. Session and Cache | [EX-029](19--feature-flag-reference/029-2-session-and-cache.md) | [19--feature-flag-reference/02-2-session-and-cache.md](../feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md) |
| EX-030 | Existing Features | 3. MCP Configuration | [EX-030](19--feature-flag-reference/030-3-mcp-configuration.md) | [19--feature-flag-reference/03-3-mcp-configuration.md](../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md) |
| EX-031 | Existing Features | 4. Memory and Storage | [EX-031](19--feature-flag-reference/031-4-memory-and-storage.md) | [19--feature-flag-reference/04-4-memory-and-storage.md](../feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md) |
| EX-032 | Existing Features | 5. Embedding and API | [EX-032](19--feature-flag-reference/032-5-embedding-and-api.md) | [19--feature-flag-reference/05-5-embedding-and-api.md](../feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md) |
| EX-033 | Existing Features | 6. Debug and Telemetry | [EX-033](19--feature-flag-reference/033-6-debug-and-telemetry.md) | [19--feature-flag-reference/06-6-debug-and-telemetry.md](../feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md) |
| EX-034 | Existing Features | 7. CI and Build (informational) | [EX-034](19--feature-flag-reference/034-7-ci-and-build-informational.md) | [19--feature-flag-reference/07-7-ci-and-build-informational.md](../feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md) |
| EX-035 | Existing Features | Startup runtime compatibility guards | [EX-035](04--maintenance/035-startup-runtime-compatibility-guards.md) | [04--maintenance/02-startup-runtime-compatibility-guards.md](../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md) |
| 001 | Features | Graph channel ID fix (G1) | [001](08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md) | [08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md](../feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md) |
| 002 | Features | Chunk collapse deduplication (G3) | [002](08--bug-fixes-and-data-integrity/002-chunk-collapse-deduplication-g3.md) | [08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md](../feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md) |
| 003 | Features | Co-activation fan-effect divisor (R17) | [003](08--bug-fixes-and-data-integrity/003-co-activation-fan-effect-divisor-r17.md) | [08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md](../feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md) |
| 004 | Features | SHA-256 content-hash deduplication (TM-02) | [004](08--bug-fixes-and-data-integrity/004-sha-256-content-hash-deduplication-tm-02.md) | [08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md](../feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md) |
| 005 | Features | Evaluation database and schema (R13-S1) | [005](09--evaluation-and-measurement/005-evaluation-database-and-schema-r13-s1.md) | [09--evaluation-and-measurement/01-evaluation-database-and-schema.md](../feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md) |
| 006 | Features | Core metric computation (R13-S1) | [006](09--evaluation-and-measurement/006-core-metric-computation-r13-s1.md) | [09--evaluation-and-measurement/02-core-metric-computation.md](../feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md) |
| 007 | Features | Observer effect mitigation (D4) | [007](09--evaluation-and-measurement/007-observer-effect-mitigation-d4.md) | [09--evaluation-and-measurement/03-observer-effect-mitigation.md](../feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md) |
| 008 | Features | Full-context ceiling evaluation (A2) | [008](09--evaluation-and-measurement/008-full-context-ceiling-evaluation-a2.md) | [09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md](../feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md) |
| 009 | Features | Quality proxy formula (B7) | [009](09--evaluation-and-measurement/009-quality-proxy-formula-b7.md) | [09--evaluation-and-measurement/05-quality-proxy-formula.md](../feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md) |
| 010 | Features | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) | [010](09--evaluation-and-measurement/010-synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a.md) | [09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md) |
| 011 | Features | BM25-only baseline (G-NEW-1) | [011](09--evaluation-and-measurement/011-bm25-only-baseline-g-new-1.md) | [09--evaluation-and-measurement/07-bm25-only-baseline.md](../feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md) |
| 012 | Features | Agent consumption instrumentation (G-NEW-2) | [012](09--evaluation-and-measurement/012-agent-consumption-instrumentation-g-new-2.md) | [09--evaluation-and-measurement/08-agent-consumption-instrumentation.md](../feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md) |
| 013 | Features | Scoring observability (T010) | [013](09--evaluation-and-measurement/013-scoring-observability-t010.md) | [09--evaluation-and-measurement/09-scoring-observability.md](../feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md) |
| 014 | Features | Full reporting and ablation study framework (R13-S3) | [014](09--evaluation-and-measurement/014-full-reporting-and-ablation-study-framework-r13-s3.md) | [09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md) |
| 015 | Features | Shadow scoring and channel attribution (R13-S2) | [015](09--evaluation-and-measurement/015-shadow-scoring-and-channel-attribution-r13-s2.md) | [09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md](../feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md) |
| 016 | Features | Typed-weighted degree channel (R4) | [016](10--graph-signal-activation/016-typed-weighted-degree-channel-r4.md) | [10--graph-signal-activation/01-typed-weighted-degree-channel.md](../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md) |
| 017 | Features | Co-activation boost strength increase (A7) | [017](10--graph-signal-activation/017-co-activation-boost-strength-increase-a7.md) | [10--graph-signal-activation/02-co-activation-boost-strength-increase.md](../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md) |
| 018 | Features | Edge density measurement | [018](10--graph-signal-activation/018-edge-density-measurement.md) | [10--graph-signal-activation/03-edge-density-measurement.md](../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md) |
| 019 | Features | Weight history audit tracking | [019](10--graph-signal-activation/019-weight-history-audit-tracking.md) | [10--graph-signal-activation/04-weight-history-audit-tracking.md](../feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md) |
| 020 | Features | Graph momentum scoring (N2a) | [020](10--graph-signal-activation/020-graph-momentum-scoring-n2a.md) | [10--graph-signal-activation/05-graph-momentum-scoring.md](../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md) |
| 021 | Features | Causal depth signal (N2b) | [021](10--graph-signal-activation/021-causal-depth-signal-n2b.md) | [10--graph-signal-activation/06-causal-depth-signal.md](../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md) |
| 022 | Features | Community detection (N2c) | [022](10--graph-signal-activation/022-community-detection-n2c.md) | [10--graph-signal-activation/07-community-detection.md](../feature_catalog/10--graph-signal-activation/07-community-detection.md) |
| 023 | Features | Score normalization | [023](11--scoring-and-calibration/023-score-normalization.md) | [11--scoring-and-calibration/01-score-normalization.md](../feature_catalog/11--scoring-and-calibration/01-score-normalization.md) |
| 024 | Features | Cold-start novelty boost (N4) | [024](11--scoring-and-calibration/024-cold-start-novelty-boost-n4.md) | [11--scoring-and-calibration/02-cold-start-novelty-boost.md](../feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md) |
| 025 | Features | Interference scoring (TM-01) | [025](11--scoring-and-calibration/025-interference-scoring-tm-01.md) | [11--scoring-and-calibration/03-interference-scoring.md](../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md) |
| 026 | Features | Classification-based decay (TM-03) | [026](11--scoring-and-calibration/026-classification-based-decay-tm-03.md) | [11--scoring-and-calibration/04-classification-based-decay.md](../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md) |
| 027 | Features | Folder-level relevance scoring (PI-A1) | [027](11--scoring-and-calibration/027-folder-level-relevance-scoring-pi-a1.md) | [11--scoring-and-calibration/05-folder-level-relevance-scoring.md](../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md) |
| 028 | Features | Embedding cache (R18) | [028](11--scoring-and-calibration/028-embedding-cache-r18.md) | [11--scoring-and-calibration/06-embedding-cache.md](../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md) |
| 029 | Features | Double intent weighting investigation (G2) | [029](11--scoring-and-calibration/029-double-intent-weighting-investigation-g2.md) | [11--scoring-and-calibration/07-double-intent-weighting-investigation.md](../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md) |
| 030 | Features | RRF K-value sensitivity analysis (FUT-5) | [030](11--scoring-and-calibration/030-rrf-k-value-sensitivity-analysis-fut-5.md) | [11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md](../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md) |
| 031 | Features | Negative feedback confidence signal (A4) | [031](11--scoring-and-calibration/031-negative-feedback-confidence-signal-a4.md) | [11--scoring-and-calibration/09-negative-feedback-confidence-signal.md](../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md) |
| 032 | Features | Auto-promotion on validation (T002a) | [032](11--scoring-and-calibration/032-auto-promotion-on-validation-t002a.md) | [11--scoring-and-calibration/10-auto-promotion-on-validation.md](../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md) |
| 033 | Features | Query complexity router (R15) | [033](12--query-intelligence/033-query-complexity-router-r15.md) | [12--query-intelligence/01-query-complexity-router.md](../feature_catalog/12--query-intelligence/01-query-complexity-router.md) |
| 034 | Features | Relative score fusion in shadow mode (R14/N1) | [034](12--query-intelligence/034-relative-score-fusion-in-shadow-mode-r14-n1.md) | [12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md](../feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md) |
| 035 | Features | Channel min-representation (R2) | [035](12--query-intelligence/035-channel-min-representation-r2.md) | [12--query-intelligence/03-channel-min-representation.md](../feature_catalog/12--query-intelligence/03-channel-min-representation.md) |
| 036 | Features | Confidence-based result truncation (R15-ext) | [036](12--query-intelligence/036-confidence-based-result-truncation-r15-ext.md) | [12--query-intelligence/04-confidence-based-result-truncation.md](../feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md) |
| 037 | Features | Dynamic token budget allocation (FUT-7) | [037](12--query-intelligence/037-dynamic-token-budget-allocation-fut-7.md) | [12--query-intelligence/05-dynamic-token-budget-allocation.md](../feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md) |
| 038 | Features | Query expansion (R12) | [038](12--query-intelligence/038-query-expansion-r12.md) | [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md) |
| 039 | Features | Verify-fix-verify memory quality loop (PI-A5) | [039](13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md) | [13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md](../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md) |
| 040 | Features | Signal vocabulary expansion (TM-08) | [040](13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md) | [13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md](../feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md) |
| 041 | Features | Pre-flight token budget validation (PI-A3) | [041](13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md) | [13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md](../feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md) |
| 042 | Features | Spec folder description discovery (PI-B3) | [042](13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md) | [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) |
| 043 | Features | Pre-storage quality gate (TM-04) | [043](13--memory-quality-and-indexing/043-pre-storage-quality-gate-tm-04.md) | [13--memory-quality-and-indexing/05-pre-storage-quality-gate.md](../feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md) |
| 044 | Features | Reconsolidation-on-save (TM-06) | [044](13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md) | [13--memory-quality-and-indexing/06-reconsolidation-on-save.md](../feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md) |
| 045 | Features | Smarter memory content generation (S1) | [045](13--memory-quality-and-indexing/045-smarter-memory-content-generation-s1.md) | [13--memory-quality-and-indexing/07-smarter-memory-content-generation.md](../feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md) |
| 046 | Features | Anchor-aware chunk thinning (R7) | [046](13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md) | [13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md](../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) |
| 047 | Features | Encoding-intent capture at index time (R16) | [047](13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md) | [13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md](../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md) |
| 048 | Features | Auto entity extraction (R10) | [048](13--memory-quality-and-indexing/048-auto-entity-extraction-r10.md) | [13--memory-quality-and-indexing/10-auto-entity-extraction.md](../feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) |
| 049 | Features | 4-stage pipeline refactor (R6) | [049](14--pipeline-architecture/049-4-stage-pipeline-refactor-r6.md) | [14--pipeline-architecture/01-4-stage-pipeline-refactor.md](../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md) |
| 050 | Features | MPAB chunk-to-memory aggregation (R1) | [050](14--pipeline-architecture/050-mpab-chunk-to-memory-aggregation-r1.md) | [14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md](../feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md) |
| 051 | Features | Chunk ordering preservation (B2) | [051](14--pipeline-architecture/051-chunk-ordering-preservation-b2.md) | [14--pipeline-architecture/03-chunk-ordering-preservation.md](../feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md) |
| 052 | Features | Template anchor optimization (S2) | [052](14--pipeline-architecture/052-template-anchor-optimization-s2.md) | [14--pipeline-architecture/04-template-anchor-optimization.md](../feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md) |
| 053 | Features | Validation signals as retrieval metadata (S3) | [053](14--pipeline-architecture/053-validation-signals-as-retrieval-metadata-s3.md) | [14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md](../feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md) |
| 054 | Features | Learned relevance feedback (R11) | [054](14--pipeline-architecture/054-learned-relevance-feedback-r11.md) | [14--pipeline-architecture/06-learned-relevance-feedback.md](../feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md) |
| 055 | Features | Dual-scope memory auto-surface (TM-05) | [055](15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md) | [15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md](../feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md) |
| 056 | Features | Constitutional memory as expert knowledge injection (PI-A4) | [056](15--retrieval-enhancements/056-constitutional-memory-as-expert-knowledge-injection-pi-a4.md) | [15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md](../feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md) |
| 057 | Features | Spec folder hierarchy as retrieval structure (S4) | [057](15--retrieval-enhancements/057-spec-folder-hierarchy-as-retrieval-structure-s4.md) | [15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md](../feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md) |
| 058 | Features | Lightweight consolidation (N3-lite) | [058](15--retrieval-enhancements/058-lightweight-consolidation-n3-lite.md) | [15--retrieval-enhancements/04-lightweight-consolidation.md](../feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md) |
| 059 | Features | Memory summary search channel (R8) | [059](15--retrieval-enhancements/059-memory-summary-search-channel-r8.md) | [15--retrieval-enhancements/05-memory-summary-search-channel.md](../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md) |
| 060 | Features | Cross-document entity linking (S5) | [060](15--retrieval-enhancements/060-cross-document-entity-linking-s5.md) | [15--retrieval-enhancements/06-cross-document-entity-linking.md](../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md) |
| 061 | Features | Tree thinning for spec folder consolidation (PI-B1) | [061](16--tooling-and-scripts/061-tree-thinning-for-spec-folder-consolidation-pi-b1.md) | [16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md](../feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md) |
| 062 | Features | Progressive validation for spec documents (PI-B2) | [062](16--tooling-and-scripts/062-progressive-validation-for-spec-documents-pi-b2.md) | [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md) |
| 063 | Features | Feature flag governance | [063](17--governance/063-feature-flag-governance.md) | [17--governance/01-feature-flag-governance.md](../feature_catalog/17--governance/01-feature-flag-governance.md) |
| 064 | Features | Feature flag sunset audit | [064](17--governance/064-feature-flag-sunset-audit.md) | [17--governance/02-feature-flag-sunset-audit.md](../feature_catalog/17--governance/02-feature-flag-sunset-audit.md) |
| 065 | Features | Database and schema safety | [065](08--bug-fixes-and-data-integrity/065-database-and-schema-safety.md) | [08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md](../feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md) |
| 066 | Features | Scoring and ranking corrections | [066](11--scoring-and-calibration/066-scoring-and-ranking-corrections.md) | [11--scoring-and-calibration/11-scoring-and-ranking-corrections.md](../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md) |
| 067 | Features | Search pipeline safety | [067](14--pipeline-architecture/067-search-pipeline-safety.md) | [14--pipeline-architecture/07-search-pipeline-safety.md](../feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md) |
| 068 | Features | Guards and edge cases | [068](08--bug-fixes-and-data-integrity/068-guards-and-edge-cases.md) | [08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md](../feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md) |
| 069 | Features | Entity normalization consolidation | [069](13--memory-quality-and-indexing/069-entity-normalization-consolidation.md) | [13--memory-quality-and-indexing/13-entity-normalization-consolidation.md](../feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md) |
| 070 | Features | Dead code removal | [070](16--tooling-and-scripts/070-dead-code-removal.md) | [16--tooling-and-scripts/04-dead-code-removal.md](../feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md) |
| 071 | Features | Performance improvements | [071](14--pipeline-architecture/071-performance-improvements.md) | [14--pipeline-architecture/08-performance-improvements.md](../feature_catalog/14--pipeline-architecture/08-performance-improvements.md) |
| 072 | Features | Test quality improvements | [072](09--evaluation-and-measurement/072-test-quality-improvements.md) | [09--evaluation-and-measurement/12-test-quality-improvements.md](../feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md) |
| 073 | Features | Quality gate timer persistence | [073](13--memory-quality-and-indexing/073-quality-gate-timer-persistence.md) | [13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md](../feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md) |
| 074 | Features | Stage 3 effectiveScore fallback chain | [074](11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md) | [11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md](../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md) |
| 075 | Features | Canonical ID dedup hardening | [075](08--bug-fixes-and-data-integrity/075-canonical-id-dedup-hardening.md) | [08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md](../feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md) |
| 076 | Features | Activation window persistence | [076](14--pipeline-architecture/076-activation-window-persistence.md) | [14--pipeline-architecture/09-activation-window-persistence.md](../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md) |
| 077 | Features | Tier-2 fallback channel forcing | [077](15--retrieval-enhancements/077-tier-2-fallback-channel-forcing.md) | [15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md](../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md) |
| 078 | Features | Legacy V1 pipeline removal | [078](14--pipeline-architecture/078-legacy-v1-pipeline-removal.md) | [14--pipeline-architecture/10-legacy-v1-pipeline-removal.md](../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md) |
| 079 | Features | Scoring and fusion corrections | [079](11--scoring-and-calibration/079-scoring-and-fusion-corrections.md) | [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) |
| 080 | Features | Pipeline and mutation hardening | [080](14--pipeline-architecture/080-pipeline-and-mutation-hardening.md) | [14--pipeline-architecture/11-pipeline-and-mutation-hardening.md](../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md) |
| 081 | Features | Graph and cognitive memory fixes | [081](10--graph-signal-activation/081-graph-and-cognitive-memory-fixes.md) | [10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md](../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md) |
| 082 | Features | Evaluation and housekeeping fixes | [082](09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md) | [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md) |
| 083 | Features | Math.max/min stack overflow elimination | [083](08--bug-fixes-and-data-integrity/083-math-max-min-stack-overflow-elimination.md) | [08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md](../feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md) |
| 084 | Features | Session-manager transaction gap fixes | [084](08--bug-fixes-and-data-integrity/084-session-manager-transaction-gap-fixes.md) | [08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md](../feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md) |
| 085 | Features | Transaction wrappers on mutation handlers | [085](02--mutation/085-transaction-wrappers-on-mutation-handlers.md) | [02--mutation/06-transaction-wrappers-on-mutation-handlers.md](../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md) |
| 086 | Features | BM25 trigger phrase re-index gate | [086](01--retrieval/086-bm25-trigger-phrase-re-index-gate.md) | [01--retrieval/06-bm25-trigger-phrase-re-index-gate.md](../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md) |
| 087 | Features | DB_PATH extraction and import standardization | [087](14--pipeline-architecture/087-db-path-extraction-and-import-standardization.md) | [14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md](../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md) |
| 088 | Features | Cross-AI validation fixes (Tier 4) | [088](09--evaluation-and-measurement/088-cross-ai-validation-fixes-tier-4.md) | [09--evaluation-and-measurement/14-cross-ai-validation-fixes.md](../feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md) |
| 089 | Features | Code standards alignment | [089](16--tooling-and-scripts/089-code-standards-alignment.md) | [16--tooling-and-scripts/05-code-standards-alignment.md](../feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md) |
| 090 | Features | INT8 quantization evaluation (R5) | [090](09--evaluation-and-measurement/090-int8-quantization-evaluation-r5.md) | [09--evaluation-and-measurement/16-int8-quantization-evaluation.md](../feature_catalog/09--evaluation-and-measurement/16-int8-quantization-evaluation.md) |
| 091 | Features | Implemented: graph centrality and community detection (N2) | [091](10--graph-signal-activation/091-implemented-graph-centrality-and-community-detection-n2.md) | [10--graph-signal-activation/07-community-detection.md](../feature_catalog/10--graph-signal-activation/07-community-detection.md) |
| 092 | Features | Implemented: auto entity extraction (R10) | [092](13--memory-quality-and-indexing/092-implemented-auto-entity-extraction-r10.md) | [13--memory-quality-and-indexing/10-auto-entity-extraction.md](../feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) |
| 093 | Features | Implemented: memory summary generation (R8) | [093](15--retrieval-enhancements/093-implemented-memory-summary-generation-r8.md) | [15--retrieval-enhancements/05-memory-summary-search-channel.md](../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md) |
| 094 | Features | Implemented: cross-document entity linking (S5) | [094](15--retrieval-enhancements/094-implemented-cross-document-entity-linking-s5.md) | [15--retrieval-enhancements/06-cross-document-entity-linking.md](../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md) |
| 095 | Features | Strict Zod schema validation (P0-1) | [095](14--pipeline-architecture/095-strict-zod-schema-validation-p0-1.md) | [14--pipeline-architecture/13-strict-zod-schema-validation.md](../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md) |
| 096 | Features | Provenance-rich response envelopes (P0-2) | [096](15--retrieval-enhancements/096-provenance-rich-response-envelopes-p0-2.md) | [15--retrieval-enhancements/08-provenance-rich-response-envelopes.md](../feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md) |
| 097 | Features | Async ingestion job lifecycle (P0-3) | [097](05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md) | [05--lifecycle/05-async-ingestion-job-lifecycle.md](../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md) |
| 098 | Features | Local GGUF reranker via node-llama-cpp (P1-5) | [098](11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md) | [11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md](../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md) |
| 099 | Features | Real-time filesystem watching (P1-7) | [099](16--tooling-and-scripts/099-real-time-filesystem-watching-p1-7.md) | [16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md](../feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md) |
| 100 | Features | Async shutdown with deadline (server lifecycle) | [100](05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md) | *(server lifecycle — no dedicated catalog entry)* |
| 101 | Features | memory_delete confirm schema tightening | [101](02--mutation/101-memory-delete-confirm-schema-tightening.md) | *(memory_delete confirm schema — covered by `02--mutation/03`)* |
| 102 | Features | node-llama-cpp optionalDependencies | [102](11--scoring-and-calibration/102-node-llama-cpp-optionaldependencies.md) | *(node-llama-cpp optionalDependencies — covered by `11--scoring-and-calibration/14`)* |
| 103 | Features | UX hook module coverage (`mutation-feedback`, `response-hints`) | [103](18--ux-hooks/103-ux-hook-module-coverage-mutation-feedback-response-hints.md) | [18--ux-hooks/05-dedicated-ux-hook-modules.md](../feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md) |
| 104 | Features | Mutation save-path UX parity and no-op hardening | [104](18--ux-hooks/104-mutation-save-path-ux-parity-and-no-op-hardening.md) | [18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md](../feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md) |
| 105 | Features | Context-server success-envelope finalization | [105](18--ux-hooks/105-context-server-success-envelope-finalization.md) | [18--ux-hooks/08-context-server-success-hint-append.md](../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md) |
| 106 | Features | Hooks barrel + README synchronization | [106](18--ux-hooks/106-hooks-barrel-readme-synchronization.md) | [18--ux-hooks/12-hooks-readme-and-export-alignment.md](../feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md) |
| 107 | Features | Checkpoint confirmName and schema enforcement | [107](18--ux-hooks/107-checkpoint-confirmname-and-schema-enforcement.md) | [18--ux-hooks/03-checkpoint-delete-confirmname-safety.md](../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md) |
| 108 | Features | Spec 007 finalized verification command suite evidence | [108](16--tooling-and-scripts/108-spec-007-finalized-verification-command-suite-evidence.md) | *(Spec 007 verification suite — no dedicated catalog entry)* |
| 109 | Features | Quality-aware 3-tier search fallback | [109](01--retrieval/109-quality-aware-3-tier-search-fallback.md) | [01--retrieval/08-quality-aware-3-tier-search-fallback.md](../feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md) |
| 110 | Features | Prediction-error save arbitration | [110](02--mutation/110-prediction-error-save-arbitration.md) | [02--mutation/08-prediction-error-save-arbitration.md](../feature_catalog/02--mutation/08-prediction-error-save-arbitration.md) |
| 111 | Features | Deferred lexical-only indexing | [111](13--memory-quality-and-indexing/111-deferred-lexical-only-indexing.md) | [13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md](../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) |
| 112 | Features | Cross-process DB hot rebinding | [112](14--pipeline-architecture/112-cross-process-db-hot-rebinding.md) | [14--pipeline-architecture/17-cross-process-db-hot-rebinding.md](../feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md) |
| 113 | Features | Standalone admin CLI | [113](16--tooling-and-scripts/113-standalone-admin-cli.md) | [16--tooling-and-scripts/07-standalone-admin-cli.md](../feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md) |
| 114 | Features | Path traversal validation (P0-4) | [114](05--lifecycle/114-path-traversal-validation-p0-4.md) | [05--lifecycle/05-async-ingestion-job-lifecycle.md](../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md) |
| 115 | Features | Transaction atomicity on rename failure (P0-5) | [115](14--pipeline-architecture/115-transaction-atomicity-on-rename-failure-p0-5.md) | [14--pipeline-architecture/21-atomic-pending-file-recovery.md](../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md) |
| 116 | Features | Chunking safe swap atomicity (P0-6) | [116](08--bug-fixes-and-data-integrity/116-chunking-safe-swap-atomicity-p0-6.md) | [08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md](../feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md) |
| 117 | Features | SQLite datetime session cleanup (P0-7) | [117](08--bug-fixes-and-data-integrity/117-sqlite-datetime-session-cleanup-p0-7.md) | [08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md](../feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md) |
| 118 | Features | Stage-2 score field synchronization (P0-8) | [118](11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md) | [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) |
| 119 | Features | Memory filename uniqueness (ensureUniqueMemoryFilename) | [119](13--memory-quality-and-indexing/119-memory-filename-uniqueness-ensureuniquememoryfilename.md) | [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) |
| 120 | Features | Unified graph rollback and explainability (Phase 3) | [120](10--graph-signal-activation/120-unified-graph-rollback-and-explainability-phase-3.md) | [10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md](../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md) |
| 121 | Features | Adaptive shadow proposal and rollback (Phase 4) | [121](11--scoring-and-calibration/121-adaptive-shadow-proposal-and-rollback-phase-4.md) | [11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md](../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md) |
| 122 | Features | Governed ingest and scope isolation (Phase 5) | [122](17--governance/122-governed-ingest-and-scope-isolation-phase-5.md) | [17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md) |
| 123 | Features | Shared-space deny-by-default rollout (Phase 6) | [123](17--governance/123-shared-space-deny-by-default-rollout-phase-6.md) | [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) |
| 124 | Features | Automatic archival lifecycle coverage | [124](05--lifecycle/124-automatic-archival-lifecycle-coverage.md) | [05--lifecycle/07-automatic-archival-subsystem.md](../feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md) |
| 125 | Features | Hydra roadmap capability flags | [125](19--feature-flag-reference/125-hydra-roadmap-capability-flags.md) | [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) |
| 126 | Features | Memory roadmap baseline snapshot | [126](09--evaluation-and-measurement/126-memory-roadmap-baseline-snapshot.md) | [09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md](../feature_catalog/09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md) |
| 127 | Features | Migration checkpoint scripts | [127](16--tooling-and-scripts/127-migration-checkpoint-scripts.md) | [16--tooling-and-scripts/09-migration-checkpoint-scripts.md](../feature_catalog/16--tooling-and-scripts/09-migration-checkpoint-scripts.md) |
| 128 | Features | Schema compatibility validation | [128](16--tooling-and-scripts/128-schema-compatibility-validation.md) | [16--tooling-and-scripts/10-schema-compatibility-validation.md](../feature_catalog/16--tooling-and-scripts/10-schema-compatibility-validation.md) |
| 129 | Features | Lineage state active projection and asOf resolution | [129](14--pipeline-architecture/129-lineage-state-active-projection-and-asof-resolution.md) | [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md) |
| 130 | Features | Lineage backfill rollback drill | [130](14--pipeline-architecture/130-lineage-backfill-rollback-drill.md) | [14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md](../feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md) |
| 131 | Features | Description.json batch backfill validation (PI-B3) | [131](13--memory-quality-and-indexing/131-description-json-batch-backfill-validation-pi-b3.md) | [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) |
| 132 | Features | description.json schema field validation | [132](13--memory-quality-and-indexing/132-description-json-schema-field-validation.md) | [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) |
| 133 | Features | Dry-run preflight for memory_save | [133](13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md) | [13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md](../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md) |
| 134 | Features | Startup pending-file recovery lifecycle coverage | [134](05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md) | [05--lifecycle/06-startup-pending-file-recovery.md](../feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md) |
| 135 | Features | Grep traceability for feature catalog code references | [135](16--tooling-and-scripts/135-grep-traceability-for-feature-catalog-code-references.md) | [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| 136 | Features | Feature catalog annotation name validity | [136](16--tooling-and-scripts/136-feature-catalog-annotation-name-validity.md) | [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| 137 | Features | Multi-feature annotation coverage | [137](16--tooling-and-scripts/137-multi-feature-annotation-coverage.md) | [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| 138 | Features | MODULE: header compliance via verify_alignment_drift.py | [138](16--tooling-and-scripts/138-module-header-compliance-via-verify-alignment-drift-py.md) | [16--tooling-and-scripts/11-feature-catalog-code-references.md](../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| 139 | Features | Session capturing pipeline quality | [139](16--tooling-and-scripts/139-session-capturing-pipeline-quality.md) | [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) |
| 142 | Features | Session transition trace contract | [142](01--retrieval/142-session-transition-trace-contract.md) | [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) |
| 143 | Features | Bounded graph-walk rollout and diagnostics | [143](01--retrieval/143-bounded-graph-walk-rollout-and-diagnostics.md) | [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) |
| 144 | Features | Advisory ingest lifecycle forecast | [144](05--lifecycle/144-advisory-ingest-lifecycle-forecast.md) | [05--lifecycle/05-async-ingestion-job-lifecycle.md](../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md) |
| 145 | Features | Contextual tree injection (P1-4) | [145](15--retrieval-enhancements/145-contextual-tree-injection-p1-4.md) | [15--retrieval-enhancements/09-contextual-tree-injection.md](../feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md) |
| 146 | Features | Dynamic server instructions (P1-6) | [146](14--pipeline-architecture/146-dynamic-server-instructions-p1-6.md) | [14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md](../feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md) |
| 147 | Features | Constitutional memory manager command | [147](16--tooling-and-scripts/147-constitutional-memory-manager-command.md) | [16--tooling-and-scripts/13-constitutional-memory-manager-command.md](../feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md) |
| 148 | Features | Shared-memory disabled-by-default and first-run setup | [148](17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md) | [17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md](../feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) |
| 149 | Features | Rendered memory template contract | [149](16--tooling-and-scripts/149-rendered-memory-template-contract.md) | [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) |
| 150 | Features | Source-dist alignment validation | [150](16--tooling-and-scripts/150-source-dist-alignment-validation.md) | [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md) |
| 151 | Features | MODULE_MAP.md accuracy validation | [151](16--tooling-and-scripts/151-module-map-accuracy.md) | [16--tooling-and-scripts/15-module-boundary-map.md](../feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md) |
| 152 | Features | No symlinks in lib/ tree | [152](16--tooling-and-scripts/152-no-symlinks-in-lib-tree.md) | [16--tooling-and-scripts/15-module-boundary-map.md](../feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md) |
| 153 | Features | JSON mode hybrid enrichment | [153](16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md) | [16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md](../feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md) |
| 154 | Features | JSON-primary deprecation posture | [154](16--tooling-and-scripts/154-json-primary-deprecation-posture.md) | [16--tooling-and-scripts/17-json-primary-deprecation-posture.md](../feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md) |
| 155 | Features | Post-save quality review | [155](13--memory-quality-and-indexing/155-post-save-quality-review.md) | [13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md](../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md) |
| PHASE-001 | Phase System Features | Phase detection scoring | [PHASE-001](16--tooling-and-scripts/001-phase-detection-scoring.md) |  |
| PHASE-002 | Phase System Features | Phase folder creation | [PHASE-002](16--tooling-and-scripts/002-phase-folder-creation.md) |  |
| PHASE-003 | Phase System Features | Recursive phase validation | [PHASE-003](16--tooling-and-scripts/003-recursive-phase-validation.md) |  |
| PHASE-004 | Phase System Features | Phase link validation | [PHASE-004](16--tooling-and-scripts/004-phase-link-validation.md) |  |
| PHASE-005 | Phase System Features | Phase command workflow | [PHASE-005](16--tooling-and-scripts/005-phase-command-workflow.md) |  |
| M-001 | Dedicated Memory/Spec-Kit Scenarios | Context Recovery and Continuation | [M-001](01--retrieval/001-context-recovery-and-continuation.md) |  |
| M-002 | Dedicated Memory/Spec-Kit Scenarios | Targeted Memory Lookup | [M-002](01--retrieval/002-targeted-memory-lookup.md) |  |
| M-003 | Dedicated Memory/Spec-Kit Scenarios | Context Save + Index Update | [M-003](13--memory-quality-and-indexing/003-context-save-index-update.md) |  |
| M-004 | Dedicated Memory/Spec-Kit Scenarios | Main-Agent Review and Verdict Handoff | [M-004](16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md) |  |
| M-005 | Dedicated Memory/Spec-Kit Scenarios | Outsourced Agent Memory Capture Round-Trip | [M-005](13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md) |  |
| M-006 | Dedicated Memory/Spec-Kit Scenarios | Stateless Enrichment and Alignment Guardrails | [M-006](13--memory-quality-and-indexing/006-stateless-enrichment-and-alignment-guardrails.md) |  |
| M-007 | Dedicated Memory/Spec-Kit Scenarios | Session Capturing Pipeline Quality | [M-007](16--tooling-and-scripts/007-session-capturing-pipeline-quality.md) |  |
| M-008 | Dedicated Memory/Spec-Kit Scenarios | Feature 09 Direct Manual Scenario (Per-memory History Log) | [M-008](02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md) |  |

---

## 13. GEMINI OVERLAY SCENARIO PACKS

Use these as execution bundles over the canonical per-feature matrix:

1. Full-Pipeline Search Routing
2. Cognitive Fast-Path and Triggers
3. Memory Storage, Quality and Deduplication
4. Chunking and Rendering
5. Graph Traversals and Topology
6. Feedback and System Intelligence
7. Lifecycle, Folders and Administration
8. Evaluation and Telemetry

Integrated source sections:
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5-review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6-sub-agent-orchestration-and-wave-planning)
