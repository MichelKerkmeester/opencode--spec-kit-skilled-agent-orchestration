---
title: "Verificat [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist]"
description: "Verification Date: 2026-04-10"
trigger_phrases:
  - "042"
  - "verification checklist"
  - "deep research"
  - "deep review"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# Verification Checklist: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim runtime-truth completion until verified |
| **[P1]** | Required | Must complete or be explicitly deferred |
| **[P2]** | Optional | Not used in this planning packet |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] REQ-001 stop contract is documented consistently across both loop products with `stopReason`, `legalStop`, and a legacy mapping table [EVIDENCE: exact artifact paths and JSON field names for `stopReason`, `legalStop.blockedBy`, `legalStop.gateResults`, `legalStop.replayInputs`, plus convergence-doc mapping table] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [x] CHK-002 [P0] REQ-002a legal-stop gate design requires convergence, coverage, and quality gates to pass together [EVIDENCE: workflow/state excerpts showing the combined gate bundle rather than scalar-only STOP] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [x] CHK-003 [P0] REQ-002b blocked-stop persistence and replay are first-class contracts [EVIDENCE: workflow steps and fixture outputs showing a persisted blocked-stop event with reason, gate results, and recovery path rather than silent termination] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [x] CHK-004 [P0] REQ-003 `continuedFromRun` semantics are defined consistently for both active resume and completed-continue flows [EVIDENCE: command/state excerpts naming `continuedFromRun` or equivalent cursor fields across both continuation modes] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [x] CHK-005 [P1] REQ-020 agent instruction cleanup lands before broader runtime work begins [EVIDENCE: normalized agent field names, reducer ownership boundary language, and deep-review strategy-edit expectations] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [x] CHK-006 [P1] Required Level 3 packet files exist and remain synchronized [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`] [TESTS: strict validator]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] REQ-004 audit journals are separate packet-local append-only artifacts in both loop contracts [EVIDENCE: journal path, append-only rules, JSONL/event-stream separation, and reducer/dashboard references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
- [x] CHK-011 [P0] REQ-005 claim-verification ledger is defined with `verified`, `contradicted`, and `unresolved` statuses [EVIDENCE: ledger schema/path and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-reducer.vitest.ts`]
- [x] CHK-012 [P1] REQ-013 parity alignment is enforced by contract tests and does not depend on manual memory of the change set [EVIDENCE: parity assertions referencing the new artifact paths and lifecycle fields] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [x] CHK-013 [P1] REQ-015 delta replay plus periodic snapshot/compaction is defined for both loops [EVIDENCE: snapshot artifact path, compaction trigger policy, and replay-equivalence statement] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
- [x] CHK-014 [P1] REQ-019 and REQ-020 keep deep-review machine-owned strategy sections reducer-owned and not directly agent-edited [EVIDENCE: reducer-owned section markers, normalized agent boundary language, and review contract fields] [TESTS: `deep-review-reducer-schema.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-006 behavior-first tests exist for deep research and deep review [EVIDENCE: new behavioral test file paths and scenario coverage] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [x] CHK-021 [P1] REQ-007 richer dashboard metrics are validated in reducer/schema coverage [EVIDENCE: dashboard sections and reducer-metric references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
- [x] CHK-022 [P1] REQ-010 council-style synthesis remains opt-in and does not alter default flows [EVIDENCE: command/profile docs and optional-mode fixture output] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-contract-parity.vitest.ts`]
- [x] CHK-023 [P1] REQ-011 coordination board remains packet-local and optional [EVIDENCE: board schema/strategy sections and fixture output] [TESTS: `deep-research-behavioral.vitest.ts`]
- [x] CHK-024 [P1] REQ-016 packet-local observability exposes timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down [EVIDENCE: dashboard section names plus `durationMs`, `toolsUsed`, `sourcesQueried`, and anomaly/state-diff fields] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`; `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [x] CHK-025 [P1] REQ-017 large-target decomposition rules exist for both 1000+ file review scopes and 50+ domain research scopes [EVIDENCE: review inventory/hotspot fields, research clustering/sampling fields, and large-scope fixture scenarios] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [x] CHK-026 [P1] REQ-018 semantic convergence participates in typed stop-decision traces instead of scalar-only thresholds [EVIDENCE: semantic novelty, contradiction density, citation-overlap fields, and blocked-stop examples] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`; `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] REQ-002a, REQ-002b, and REQ-014 keep STOP legality, blocked-stop persistence, and state truth explicit enough to avoid hidden runtime state or non-auditable termination behavior [EVIDENCE: explicit stop-gate, blocked-stop artifact, and packet-local replay rules] [TESTS: behavior and parity suites]
- [x] CHK-031 [P1] REQ-008 publication critique keeps weaker evidence classes visible instead of silently promoting them [EVIDENCE: evidence-class or critique fields in research contracts] [TESTS: `deep-research-behavioral.vitest.ts`]
- [x] CHK-032 [P1] REQ-009 promotion checkpoints prevent low-evidence findings from being treated as adoption-ready [EVIDENCE: checkpoint threshold fields and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-contract-parity.vitest.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] REQ-012 keeps default command guidance compact while advanced modes remain discoverable [EVIDENCE: quick-reference and command examples] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [x] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` remain synchronized after implementation planning updates [EVIDENCE: manual doc cross-check] [TESTS: strict validator]
- [x] CHK-042 [P1] `implementation-summary.md` remains a placeholder only until implementation finishes [EVIDENCE: placeholder-only content review] [TESTS: strict validator]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Planned runtime artifacts stay inside existing `research/` or `review/` packet boundaries unless the packet explicitly creates an optional advanced-mode artifact there [EVIDENCE: file-path review in spec/tasks] [TESTS: parity suites]
- [x] CHK-051 [P1] New behavior-test files remain under `.opencode/skill/system-spec-kit/scripts/tests/` as planned [EVIDENCE: test file paths present in repo and referenced in docs] [TESTS: `rg --files` plus `pnpm vitest`]
- [x] CHK-052 [P1] Strict packet validation passes after the documentation and implementation work are complete [EVIDENCE: validator PASS output] [TESTS: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 --strict`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8 |
| P1 Items | 19 | 19 |

**Verification Date**: 2026-04-10
**Packet Status**: Implemented. All checklist items verified through 3 rounds of deep review.
<!-- /ANCHOR:summary -->
