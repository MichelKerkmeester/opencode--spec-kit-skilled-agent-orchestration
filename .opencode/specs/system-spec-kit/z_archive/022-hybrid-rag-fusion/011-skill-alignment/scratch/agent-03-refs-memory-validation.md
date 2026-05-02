## Per-File Gap Analysis

### memory/memory_system.md
- Gap 1: `Tool Reference (23 tools)` is stale versus current MCP surface (bulk delete, shared-memory rollout, eval ablation/reporting, async ingest, governance scopes), so this file under-represents delivered capability breadth (P0).
- Gap 2: No documentation for Sprint 3-5 retrieval behavior changes: adaptive/shadow fusion context, single-fusion-point pipeline invariants, or channel-attribution telemetry (P1).
- Gap 3: Missing references to Sprint 4+ quality controls (pre-storage quality gate, reconsolidation-on-save, learned feedback safeguards, negative/interference signal handling) despite epic delivery (P1).
- Gap 4: No explicit status note for entity linking as gated/skipped work in Sprint 7, which risks implying full availability (P2).

### memory/save_workflow.md
- Gap 1: Save workflow lacks quality-gate documentation (reject threshold behavior, flag-controlled rollout) for Sprint 4 save-path enforcement (P1).
- Gap 2: No reconsolidation-on-save operational flow (merge / soft-replace / store-new decision outcomes) even though it is a core save-path deliverable (P1).
- Gap 3: No mutation-ledger/weight-history provenance guidance for save-triggered changes and post-save traceability (P1).
- Gap 4: Missing save-path telemetry expectations (fallback mode, quality outcome, Hydra phase tag) needed for auditability (P2).

### memory/epistemic_vectors.md
- Gap 1: Dual-threshold guidance is conceptually strong but detached from R13 metric-gated retrieval evidence delivered across Sprint 0-7 (P2).
- Gap 2: No integration guidance for adaptive retrieval loops or telemetry-driven uncertainty reduction in Hydra phase workflows (P2).
- Gap 3: No treatment of learned selection / negative feedback signals as uncertainty modifiers for retrieval decisions (P2).

### memory/embedding_resilience.md
- Gap 1: Documents fallback mechanics but not retrieval telemetry fields needed to audit degraded-mode behavior and channel quality drift (P1).
- Gap 2: No alignment section for adaptive fusion/routing behavior when embeddings degrade (query complexity + fusion consequences) (P1).
- Gap 3: Lacks audit linkage to mutation ledger/history records when fallback materially changes ranking outcomes (P2).

### memory/trigger_config.md
- Gap 1: Trigger model is static/manual; no documentation for learned trigger/selection behavior and safeguard stack delivered in Sprint 4 (P1).
- Gap 2: No negative-feedback loop guidance for suppressing harmful or low-quality learned triggers (P1).
- Gap 3: No trigger-performance telemetry/quality-gate tie-in (precision/false positive trends) for ongoing calibration (P2).
- Gap 4: Missing explicit note that entity-linking-driven trigger enrichment remains gated/deferred (P2).

### validation/validation_rules.md
- Gap 1: Folder/path assumptions center on `specs/###-name`, not the epic’s real hierarchical `.opencode/specs/02--.../022-.../NNN-child` structure and nested phase decomposition patterns (P0).
- Gap 2: `PHASE_LINKS` is too generic for proven 21-child and 6-child verification campaigns; no rule for parent rollup integrity (counts, statuses, unresolved children) (P0).
- Gap 3: No required evidence contract for multi-child verification sweeps (recursive validate + tsc/build/vitest/alignment/manual smoke) (P1).
- Gap 4: No rule coverage for Sprint 4+ quality artifacts (quality gate outcomes, reconsolidation decisions, learned-feedback safety evidence) in completion validation (P1).

### validation/decision_format.md
- Gap 1: Decision schema lacks retrieval telemetry fields (latency/mode/fallback/channel attribution) needed to document adaptive fusion choices (P1).
- Gap 2: No field for mutation-ledger/weight-history references that support rollback and forensic traceability (P1).
- Gap 3: No explicit structure for recording quality-gate pass/fail and reconsolidation branch taken (P1).
- Gap 4: No compact format for multi-child audit decisions (child totals, pass/fail/deferred matrix) (P2).

### validation/five_checks.md
- Gap 1: Checks do not explicitly require measured retrieval evidence (R13 metrics/ablation deltas) before approving ranking or fusion changes (P1).
- Gap 2: Missing explicit feature-flag safety/rollback evidence requirement for adaptive retrieval and quality mechanisms (P1).
- Gap 3: No criterion for phase-campaign governance (large child-set completeness and deferred finding accountability) (P2).

### validation/path_scoped_rules.md
- Gap 1: Path patterns are not aligned to epic-era nested spec topologies (`.opencode/specs/**` + deep child folders), creating blind spots for real phase trees (P0).
- Gap 2: `**/memory/**` described as “minimal validation (planned)” under-represents current memory rigor and can mislead enforcement posture (P1).
- Gap 3: Level scoping omits always-required `implementation-summary.md` and lacks child-phase-specific required-file matrices (P1).
- Gap 4: No scoped handling guidance for mixed-content phase roots (`feature_catalog`, playbooks, synthesis files) coexisting with child spec folders (P2).

### validation/phase_checklists.md
- Gap 1: Checklists do not cover multi-child verification workflows (21-child code audit, 6-child Hydra sequence), including parent rollup and unresolved-child blocking logic (P0).
- Gap 2: Missing checklist items for audit-campaign closure (per-child evidence, deferred item disposition, draft/fail remediation loops) (P1).
- Gap 3: Missing Hydra-specific governance checks (phase-order constraints, architecture boundary compliance, pending sign-off capture) (P1).
- Gap 4: No explicit checklist coverage for adaptive fusion telemetry, save quality gate, reconsolidation outcomes, learned feedback, and deferred entity-linking decisions (P1).

## Cross-Cutting Gaps

- Sprint 0-7 traceability is fragmented: references do not consistently map documented behavior to delivered sprint outcomes and current feature-flag status.
- Hydra roadmap coverage is mostly absent in memory/validation references, especially for adaptive retrieval loops, governed rollout semantics, and shared-memory controls.
- Code-audit (21-child) and Hydra (6-child) verification patterns are not encoded into validation/checklist references, so documentation standards lag actual delivery practice.
- Missing/under-documented requested topics across the set:
  - Adaptive fusion: absent as a first-class concept in all ten target files.
  - Mutation ledger: absent (only indirect mentions elsewhere).
  - Retrieval telemetry: absent in decision/checklist/validation references.
  - Quality gate: not operationalized in save + validation references.
  - Reconsolidation: not operationalized in save + validation references.
  - Negative feedback: not documented as a governed signal flow.
  - Learned selection: not documented as a lifecycle with safeguards.
  - Entity linking: deferred/skipped status is not clearly represented in these references.

## Recommendations

1. Prioritize a P0 documentation patch to `validation_rules.md`, `path_scoped_rules.md`, and `phase_checklists.md` for nested phase-tree support and explicit 21-child/6-child verification rollups.
2. Expand `memory_system.md` with a current MCP capability matrix and a “Sprint 0-7 Delivered Retrieval Features” section (including adaptive/shadow fusion, telemetry, and guardrails).
3. Add a “Save Pipeline Quality Controls” section to `save_workflow.md` covering quality gate thresholds, reconsolidation branches, and mutation-ledger provenance.
4. Add a shared “Feedback & Learning Signals” subsection across `trigger_config.md` and validation references to define negative feedback, learned selection, and safety constraints.
5. Extend `decision_format.md` with structured fields for telemetry snapshot, fusion strategy, quality-gate result, and ledger linkage.
6. Add deferred-status callouts for gated items (notably entity linking) in relevant references to prevent false assumptions of production readiness.
