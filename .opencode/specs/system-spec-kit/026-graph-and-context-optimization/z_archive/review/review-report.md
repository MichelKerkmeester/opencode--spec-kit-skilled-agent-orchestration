---
title: "Batch Phase Review Consolidated Report — 026 Phases 002-014"
description: "Consolidated verdict across 13 child phases of 026-graph-and-context-optimization. Aggregate findings: 0 P0 / 7 P1 / 0 P2. Overall program verdict: CONDITIONAL."
trigger_phrases:
  - "026 batch review consolidated"
  - "026 phase-by-phase review synthesis"
  - "026 aggregate findings report"
  - "026 program verdict"
importance_tier: "important"
contextType: "review-report"
---

# Batch Phase Review Consolidated Report — 026 Phases 002-014

## 1. Executive Summary

- **Scope**: 13 phases under `026-graph-and-context-optimization/`, reviewed via per-phase deep-review packets. The original batch plan targeted 5 iterations per phase (65 planned), but extension reruns and convergence-driven stops produced 108 actual executed iterations across the available reports.
- **Phases with per-phase review reports available**: 13 of 13 — `002-implement-cache-warning-hooks`, `003-memory-quality-issues`, `004-agent-execution-guardrails`, `005-provisional-measurement-contract`, `006-structural-trust-axis-contract`, `007-detector-provenance-and-regression-floor`, `008-graph-first-routing-nudge`, `009-auditable-savings-publication-contract`, `010-fts-capability-cascade-floor`, `011-graph-payload-validator-and-trust-preservation`, `012-cached-sessionstart-consumer-gated`, `013-warm-start-bundle-conditional-validation`, `014-code-graph-upgrades`
- **Phases MISSING review reports**: none
- **Total iterations executed across available phases**: 108
- **Aggregate findings by severity**:
  - P0 (Blockers): 0
  - P1 (Required): 7
  - P2 (Suggestions): 0
- **Phases that early-stopped on convergence**: `011-graph-payload-validator-and-trust-preservation` (4 iterations), `012-cached-sessionstart-consumer-gated` (4 iterations)
- **Dimension coverage across the batch**: every per-phase review covered D1, D2, D3, and D4 before synthesis or convergence.
- **Overall 026 program verdict**: CONDITIONAL
- **Rationale for verdict**: The phase-level sweep confirms that the parent review's runtime-heavy packet cluster in `009`, `011`, and `012` has been remediated, and `004`, `005`, `006`, `007`, and `009` now read as clean PASS packets. The remaining open work is entirely P1 rather than P0, but it is still release-relevant: six phase lanes carry seven truthfulness or surface-contract findings, with the heaviest concentration in packet-state accuracy (`002`, `003`, `013`) and adjacent-surface overclaim (`008`, `010`, `014`). Under the specified verdict rule, zero P0 and nonzero P1 yields a program-level `CONDITIONAL`.

---

## 2. Per-Phase Verdict Table

| Phase | Iterations | Verdict | P0 | P1 | P2 | Top Finding |
|-------|-----------|---------|----|----|----|-------------|
| 002-implement-cache-warning-hooks | 10 | CONDITIONAL | 0 | 1 | 0 | Packet metadata still advertises `Blocked` while the same packet records shipped completion and PASS verification. |
| 003-memory-quality-issues | 10 | FAIL | 0 | 2 | 0 | Parent packet `003` is no longer a trustworthy roll-up for the actual child topology or later child status story. |
| 004-agent-execution-guardrails | 10 | PASS | 0 | 0 | 0 | None active. |
| 005-provisional-measurement-contract | 10 | PASS | 0 | 0 | 0 | None active. |
| 006-structural-trust-axis-contract | 10 | PASS | 0 | 0 | 0 | None active. |
| 007-detector-provenance-and-regression-floor | 10 | PASS | 0 | 0 | 0 | None active. |
| 008-graph-first-routing-nudge | 10 | CONDITIONAL | 0 | 1 | 0 | `session-prime.ts` emits the structural routing hint on graph readiness alone, without the promised activation-scaffold gate. |
| 009-auditable-savings-publication-contract | 10 | PASS | 0 | 0 | 0 | None active; the helper now has a real `memory-search.ts` consumer. |
| 010-fts-capability-cascade-floor | 10 | CONDITIONAL | 0 | 1 | 0 | `bm25_fallback` is reported as the executed degraded lane even though no lexical fallback actually runs. |
| 011-graph-payload-validator-and-trust-preservation | 4 | PASS | 0 | 0 | 0 | None active after convergence. |
| 012-cached-sessionstart-consumer-gated | 4 | PASS | 0 | 0 | 0 | None active after convergence. |
| 013-warm-start-bundle-conditional-validation | 5 | CONDITIONAL | 0 | 1 | 0 | CHK-022 still cites stale `pass 28` evidence while the shipped benchmark source of truth reports `38/40`. |
| 014-code-graph-upgrades | 5 | CONDITIONAL | 0 | 1 | 0 | Resume/bootstrap graph-edge enrichment preservation is claimed but not implemented. |

Convergence note: every phase covered D1-D4. `011` and `012` stopped after four iterations because those four baseline dimensions cleared with no active findings; both per-phase review reports say all reviewed claims matched the shipped runtime and packet evidence rather than needing the operator-requested stability extension used elsewhere in the batch.

---

## 3. Aggregate Findings — All Active P0 and P1

No active P0 findings were reported by any available phase review.

After normalizing by file plus claim title, the active set remains 7 unique P1 findings. No two phase reports described the same underlying defect closely enough to collapse into a single shared finding record.

### 002-implement-cache-warning-hooks

- **Finding ID**: `DR-002-I003-P1-001`
- **Title**: Packet `002` still presents itself as blocked even though the packet records completed delivery and passing verification
- **Affected phase(s)**: `002-implement-cache-warning-hooks`
- **Severity**: P1
- **Dimension**: D3 Traceability
- **Summary**: The packet's `spec.md` metadata still says `Blocked — awaiting 010 predecessor verification`, while the same packet's `implementation-summary.md` records completed delivery and passing verification evidence. That contradiction makes the packet an unreliable status signal for downstream operators and for any later consolidated program review.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md:36`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:25`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:35`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:81`
- **Typed claim-adjudication block**:

```json
{
  "claim": "Packet 002 still advertises a blocked status even though its own implementation summary and verification table say the producer seam shipped successfully.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md:36",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:25",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:81"
  ],
  "counterevidenceSought": "Checked for any qualification that completion was provisional or future-dated; none was present.",
  "alternativeExplanation": "The spec metadata may simply have been left stale after the predecessor lane landed.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the packet is intentionally treated as a frozen pre-implementation snapshot and operators are told not to trust its status field."
}
```

### 003-memory-quality-issues

- **Finding ID**: `DR-003-I001-P1-001`
- **Title**: Parent packet `003` omits actual child phase `008-input-normalizer-fastpath-fix/` and renumbers `009-post-save-render-fixes` as phase 8
- **Affected phase(s)**: `003-memory-quality-issues`
- **Severity**: P1
- **Dimension**: D1 Correctness
- **Summary**: The parent phase map no longer matches the real child packet set. Because packet `003` still presents itself as the roll-up for the remediation train, this topology drift breaks its authority as a navigation and status artifact.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:33`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:84`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:95`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/008-input-normalizer-fastpath-fix/spec.md:21`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/008-input-normalizer-fastpath-fix/spec.md:25`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:23`
- **Typed claim-adjudication block**:

```json
{
  "claim": "The parent roll-up omits actual child phase 008 and renumbers 009 as phase 8, so the packet's phase map no longer matches the real child packet set.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:33",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:84",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:95",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/008-input-normalizer-fastpath-fix/spec.md:21",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/008-input-normalizer-fastpath-fix/spec.md:25",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:23"
  ],
  "counterevidenceSought": "Looked for an explicit parent note that 008 was intentionally excluded from the phase map; none exists.",
  "alternativeExplanation": "The parent map may have been updated quickly for 009 and accidentally skipped the new 008 child.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the parent packet is explicitly re-scoped to ignore post-Phase-7 children."
}
```

- **Finding ID**: `DR-003-I003-P1-001`
- **Title**: Parent packet `003` status roll-up contradicts both its own success criteria and child metadata for phases `006` and `007`
- **Affected phase(s)**: `003-memory-quality-issues`
- **Severity**: P1
- **Dimension**: D3 Traceability
- **Summary**: The parent phase map says phases `006` and `007` are effectively complete, while `SC-001` still expects placeholder work and the child specs still show `Status | Draft`. That mismatch leaves packet `003` unable to serve as a trustworthy later-phase status roll-up.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:93`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:94`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:178`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/spec.md:30`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/007-skill-catalog-sync/spec.md:30`
- **Typed claim-adjudication block**:

```json
{
  "claim": "The parent roll-up contradicts both its own success criteria and the child phase metadata for phases 006 and 007.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:93",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:94",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:178",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/spec.md:30",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/007-skill-catalog-sync/spec.md:30"
  ],
  "counterevidenceSought": "Checked for a child-level note or parent waiver that explicitly permits Draft child metadata while the parent marks them complete; none exists in the cited files.",
  "alternativeExplanation": "The parent remediation wave may have updated roll-up prose before the child metadata cleanup happened.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if the parent packet is updated to explain that 006 and 007 child specs intentionally remain frozen Draft snapshots."
}
```

### 008-graph-first-routing-nudge

- **Finding ID**: `DR-008-I001-P1-001`
- **Title**: `session-prime.ts` emits a structural routing hint without the activation-scaffold gate promised by packet `008`
- **Affected phase(s)**: `008-graph-first-routing-nudge`
- **Severity**: P1
- **Dimension**: D1 Correctness
- **Summary**: Packet `008` documents a readiness-plus-activation-scaffolding gate, but the startup or resume hook path in `session-prime.ts` emits the hint whenever `graphState === "ready"`. The focused regression suite only proves the stricter helper surface, so the hook path is both out of contract and under-tested.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:92`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:120`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:35`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:37`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:45`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:56`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:114`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:15`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67`
- **Typed claim-adjudication block**:

```json
{
  "claim": "session-prime emits a structural routing hint on graph readiness alone, violating packet 008's promised readiness-plus-activation-scaffolding gate.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:92",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:120",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:37",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:45",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/implementation-summary.md:56",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:114",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:15",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67"
  ],
  "counterevidenceSought": "Reviewed the hook implementation and the focused regression file for any activation-scaffold or task-shape gate on the startup hint path.",
  "alternativeExplanation": "The generic startup hint may have been intentional because SessionStart has no user task, but that scope exception is not what the packet documents or tests claim.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if packet 008 is explicitly re-scoped so the readiness-plus-scaffolding gate excludes the startup hook surface."
}
```

### 010-fts-capability-cascade-floor

- **Finding ID**: `DR-010-I001-P1-001`
- **Title**: Packet `010` labels degraded requests as `bm25_fallback` even though no fallback lexical lane executes
- **Affected phase(s)**: `010-fts-capability-cascade-floor`
- **Severity**: P1
- **Dimension**: D1 Correctness
- **Summary**: The runtime records degraded capability states, but the lane name overstates what actually happened. `sqlite-fts.ts` logs `bm25_fallback` and returns an empty lexical result set as soon as FTS5 is unavailable, so the named fallback lane is a vocabulary overclaim rather than an executed path.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:95`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:98`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:125`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/implementation-summary.md:34`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/implementation-summary.md:36`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/implementation-summary.md:56`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:99`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:210`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:212`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185`
- **Typed claim-adjudication block**:

```json
{
  "claim": "Packet 010 labels degraded requests as bm25_fallback even though the runtime returns empty lexical results instead of executing a fallback lexical lane.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:95",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:98",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:125",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/implementation-summary.md:34",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/implementation-summary.md:36",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/implementation-summary.md:56",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:99",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:210",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:212",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185"
  ],
  "counterevidenceSought": "Reviewed sqlite-fts.ts, handler metadata wiring, README text, and focused tests for any actual non-FTS lexical query behind the bm25_fallback label.",
  "alternativeExplanation": "The label may have been intended as capability shorthand rather than a description of executed work, but that is not how the packet documents or response field are worded today.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the packet docs and metadata are rewritten so bm25_fallback is explicitly only a capability-status label for an empty lexical lane."
}
```

### 013-warm-start-bundle-conditional-validation

- **Finding ID**: `DR-013-I003-P1-001`
- **Title**: Checklist evidence for CHK-022 is stale and contradicts the shipped benchmark totals
- **Affected phase(s)**: `013-warm-start-bundle-conditional-validation`
- **Severity**: P1
- **Dimension**: D3 Traceability
- **Summary**: The shipped benchmark sources agree on `38/40`, but the checklist still cites `pass 28`. That leaves a P0 benchmark gate with stale evidence even though the runtime benchmark and implementation summary were updated.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/spec.md:98`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/checklist.md:55`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md:71`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/scratch/benchmark-matrix.md:20`; `.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:188`; `.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:192`
- **Typed claim-adjudication block**:

```json
{
  "claim": "CHK-022 cites stale benchmark evidence and therefore no longer matches the packet's shipped benchmark totals.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/spec.md:98",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/checklist.md:55",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md:71",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/scratch/benchmark-matrix.md:20",
    ".opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:188",
    ".opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:192"
  ],
  "counterevidenceSought": "Checked the implementation summary, scratch benchmark matrix, and benchmark assertions for a matching 28-pass result; none existed in the current packet state.",
  "alternativeExplanation": "The checklist line appears to have been copied from an older benchmark revision and never refreshed after the discriminating pass metric landed.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the benchmark source of truth is intentionally 28 and the implementation summary plus scratch matrix were accidentally updated without rerunning the packet evidence."
}
```

### 014-code-graph-upgrades

- **Finding ID**: `DR-014-I001-P1-001`
- **Title**: Resume/bootstrap graph-edge enrichment preservation is claimed but not implemented
- **Affected phase(s)**: `014-code-graph-upgrades`
- **Severity**: P1
- **Dimension**: D1 Correctness
- **Summary**: Packet `014` says `session_resume` and `session_bootstrap` preserve additive graph-edge enrichment, yet neither handler carries `graphEdgeEnrichment`, `edgeEvidenceClass`, or `numericConfidence`, and the cited tests do not assert those fields. The graph-local query upgrades may have landed, but the resume/bootstrap preservation story remains overclaimed.
- **Evidence references**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:83`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:84`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:89`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:90`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:106`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/implementation-summary.md:48`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/implementation-summary.md:75`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/checklist.md:55`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:518`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:587`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:246`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:326`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198`; `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:228`
- **Typed claim-adjudication block**:

```json
{
  "claim": "Packet 014 claims resume/bootstrap preserve graph-edge enrichment, but neither handler or test currently carries or asserts those fields.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:83",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:84",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:89",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:90",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:106",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/implementation-summary.md:48",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/implementation-summary.md:75",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/checklist.md:55",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:518",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:587",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:246",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:326",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198",
    ".opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:228"
  ],
  "counterevidenceSought": "Searched both handlers and the claimed preservation tests for graphEdgeEnrichment, edgeEvidenceClass, and numericConfidence. No hits existed outside graph-local query surfaces.",
  "alternativeExplanation": "The implementation may have intentionally limited edge enrichment to graph-local outputs, but the packet docs and checklist were not rewritten to reflect that narrower scope.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if another shipped resume/bootstrap serialization path injects graphEdgeEnrichment before MCP responses are returned, or if packet 014 is formally re-scoped to exclude resume/bootstrap preservation."
}
```

P2 appendix table: None applicable.

---

## 4. Cross-Phase Patterns

### Pattern 1: Packet-truth drift and overclaim vs ship

- **Phases affected**: `002-implement-cache-warning-hooks`, `003-memory-quality-issues`, `010-fts-capability-cascade-floor`, `013-warm-start-bundle-conditional-validation`, `014-code-graph-upgrades`
- **Severity cluster**: P1
- **Recommended structural remediation**: Run one packet-truth reconciliation sweep across `spec.md`, `implementation-summary.md`, `checklist.md`, phase maps, and emitted runtime vocabulary before any release claim. The root cause is not only missing code; it is stale metadata, stale evidence, or broader narrative scope than the current runtime actually supports.

### Pattern 2: Adjacent claimed surfaces are less constrained than the tested helper or handler path

- **Phases affected**: `008-graph-first-routing-nudge`, `010-fts-capability-cascade-floor`, `014-code-graph-upgrades`
- **Severity cluster**: P1
- **Recommended structural remediation**: Add a release gate that requires one focused assertion against every named surface in the packet claim, not just the helper or primary handler. If a packet says a hook, degraded lane, or resume/bootstrap path is governed, the test and checklist evidence must hit that exact surface.

### Pattern 3: Parent and child roll-up artifacts can become less trustworthy than the child runtime itself

- **Phases affected**: `002-implement-cache-warning-hooks`, `003-memory-quality-issues`, `013-warm-start-bundle-conditional-validation`
- **Severity cluster**: P1
- **Recommended structural remediation**: Treat packet-state artifacts as first-class release surfaces. Before closing a phase family, require a single "state consistency" pass that checks status fields, success-criteria summaries, and checklist evidence against child specs and current benchmark sources of truth.

### Pattern 4: Earlier parent-review runtime concerns were mostly corrected once real consumers and real-surface coverage landed

- **Phases affected**: `009-auditable-savings-publication-contract`, `011-graph-payload-validator-and-trust-preservation`, `012-cached-sessionstart-consumer-gated`
- **Severity cluster**: Historically P1 in the parent review, now PASS in the phase reviews
- **Recommended structural remediation**: Keep the same discipline for later packets: helper-first work is acceptable only if the packet docs explicitly say helper-only, and any "implemented" closeout must be backed by a real consumer or real end-to-end surface proof.

### Pattern 5: Counterevidence repeatedly failed to find explicit scope waivers or frozen-snapshot disclaimers

- **Phases affected**: `002-implement-cache-warning-hooks`, `003-memory-quality-issues`, `008-graph-first-routing-nudge`, `010-fts-capability-cascade-floor`, `014-code-graph-upgrades`
- **Severity cluster**: P1
- **Recommended structural remediation**: When a packet is intentionally narrower than its broader prose, or when an artifact is meant to be historical rather than live status, state that exception directly in the packet and checklist. Multiple review lanes searched for those disclaimers and found none, which is why the defects remained P1 truthfulness failures instead of being downgraded to intentional scope notes.

---

## 5. Comparison with the Earlier 15-iter Parent Review

The existing `026/review/review-report.md` (session `2026-04-09T03:59:45Z`) reviewed the 026 parent packet with 15 iterations and surfaced 6 P1 findings clustered in packets 009/011/012/013:

- DR-026-I001: Packet 011 does not preserve structural trust through session_resume payload
- DR-026-I002: Packet 012's frozen-corpus proof does not exercise real session_resume/session_bootstrap/session-prime surfaces
- DR-026-I003: Packet 013's bundle benchmark cannot observe pass-rate regressions
- DR-026-I004: Packet 009 marks publication contract implemented without a live consumer
- DR-026-I005: session_bootstrap synthesizes live structural trust onto errored resume outputs
- DR-026-I006: Unscoped cached continuity selection reuses newest project hook state cross-session

For each of the 6 parent-review findings, the batch review points to the following status:

| Parent Finding ID | Status in Batch Review | Evidence |
|-------------------|------------------------|----------|
| DR-026-I001 | RESOLVED | Parent findings registry marks it resolved at iteration 16, and the per-phase `011` review now reports PASS with no active findings and says packet 011 behaves like the actual trust-preservation prerequisite for packets 012 and 014. |
| DR-026-I002 | RESOLVED | Parent findings registry marks it resolved, and the per-phase `012` review now reports PASS and explicitly says the frozen-corpus test mounts the real session surfaces through hook-state fixtures. |
| DR-026-I003 | RESOLVED | Parent findings registry marks it resolved. The per-phase `013` review no longer reports an unfalsifiable pass-rate gate; its only remaining P1 is stale CHK-022 evidence, which is a different packet-truth issue. |
| DR-026-I004 | RESOLVED | Parent findings registry marks it resolved, and the per-phase `009` review now reports PASS and explicitly states that the helper has a real `memory-search.ts` consumer. |
| DR-026-I005 | RESOLVED | Parent findings registry marks it resolved, while the per-phase `005`, `011`, and `012` reviews all report PASS with no active fail-open or trust-widening finding remaining. |
| DR-026-I006 | RESOLVED | Parent findings registry marks it resolved, and the per-phase `012` review now reports PASS across cached session-start gating, hook-state fail-closed behavior, and real-surface coverage. |

Also note:

- **NEW findings caught by the batch review that the parent review missed**: 7 active P1 findings. They cluster in `002` blocked-state drift, two separate `003` parent-roll-up integrity failures, `008` startup-hook gate drift, `010` degraded-lane overstatement, `013` stale checklist evidence, and `014` resume/bootstrap enrichment overclaim.
- **Findings both reviews missed**: None identifiable from the current artifacts. The batch sweep broadened coverage into packet-truth and roll-up integrity, which is the main category the earlier parent review did not emphasize.

---

## 6. Remediation Priority Queue

1. **Lane 1 — Repair packet `003` parent topology and status truthfulness** (P1, affected phases: `003-memory-quality-issues`)
   - Target files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:33`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:84`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:93`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:178`
   - Effort: M
   - Recommended fix: Restore the correct child topology, then reconcile the later-phase status table against the child specs and `SC-001`. If packet `003` is meant to stop at the earlier remediation train, explicitly re-scope it and remove the broken later-phase roll-up.
   - Downgrade path: Doc-only re-scope to a frozen earlier train is acceptable if operators are told not to use `003` as a current child-phase index.

2. **Lane 2 — Honor or narrow packet `014`'s resume/bootstrap enrichment preservation claim** (P1, affected phases: `014-code-graph-upgrades`, with downstream coupling to `011-graph-payload-validator-and-trust-preservation`)
   - Target files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:83`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/implementation-summary.md:48`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:518`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:246`
   - Effort: M/L
   - Recommended fix: Either carry `graphEdgeEnrichment`, `edgeEvidenceClass`, and `numericConfidence` through `session-resume.ts` and `session-bootstrap.ts` with matching tests, or narrow the packet docs and checklist so the claim stays limited to graph-local query surfaces.
   - Downgrade path: Doc-only re-scope to graph-local outputs converts the finding from a runtime delivery gap into a documentation honesty fix.

3. **Lane 3 — Add the missing startup-hook gate in packet `008` or narrow the claimed surface** (P1, affected phases: `008-graph-first-routing-nudge`)
   - Target files: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:114`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:15`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:92`
   - Effort: S/M
   - Recommended fix: Add the promised activation-scaffold or task-shape gate to the startup or resume hook path and extend the focused regression suite to assert that surface. If the startup hook is intentionally broader, narrow the packet language so it no longer claims the stricter gate there.
   - Downgrade path: Explicitly exclude the startup hook surface from the readiness-plus-scaffolding contract.

4. **Lane 4 — Make packet `010`'s degraded-lane vocabulary truthful** (P1, affected phases: `010-fts-capability-cascade-floor`, with downstream wording impact on `002-implement-cache-warning-hooks`)
   - Target files: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:210`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/010-fts-capability-cascade-floor/spec.md:95`
   - Effort: S/M
   - Recommended fix: Either implement a real degraded lexical fallback or rename the lane and docs so they describe an explicit empty lexical state rather than a fallback that actually ran.
   - Downgrade path: Rename `bm25_fallback` to an honest capability-status label and update docs plus tests to match.

5. **Lane 5 — Clear packet `002`'s stale blocked-state metadata** (P1, affected phases: `002-implement-cache-warning-hooks`)
   - Target files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md:36`
   - Effort: S
   - Recommended fix: Update the packet status to match the already-shipped implementation summary and verification table, keeping predecessor notes under dependencies or limitations instead of the main packet state.
   - Downgrade path: If the packet is intentionally treated as a frozen historical snapshot, state that explicitly and tell operators not to trust the live status field.

6. **Lane 6 — Refresh packet `013`'s CHK-022 benchmark evidence** (P1, affected phases: `013-warm-start-bundle-conditional-validation`)
   - Target files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/checklist.md:55`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md:71`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/scratch/benchmark-matrix.md:20`
   - Effort: S
   - Recommended fix: Refresh CHK-022 so its cited totals and evidence match the current `38/40` benchmark source of truth, then check sibling artifacts for copied `pass 28` text.
   - Downgrade path: None meaningful beyond correcting the stale evidence; this is already a documentation-truth fix.

---

## 7. Verdict Trajectory for the 026 Train

- **Pre-session state** (before 2026-04-08): the 026 train already contained earlier foundation packets and planning artifacts, but it did not yet have a completed parent deep-review cycle or a phase-by-phase synthesized verdict.
- **After the original 9-packet ship** (commit `33823d006`): the runtime and packet docs for `005` through `013` were shipped together, but they were still effectively unreviewed as a coordinated train.
- **After the 15-iter parent review** (2026-04-09T03:59:45Z): `CONDITIONAL` with 6 P1 findings, clustered in packets `009`, `011`, `012`, and `013`.
- **After the 9-packet remediation** (commit `ef30b31f7` + verification): the parent-review cluster was remediated; the current parent findings registry now records all six `DR-026-I001` through `DR-026-I006` findings as resolved.
- **After packet 014 shipped + regression floor** (commits `2837e157a` + `66bd323bb` + `df4c14745`): packet `014` added graph-local upgrades and regression-floor work, but the batch review still found one open P1 because the resume/bootstrap enrichment-preservation claim is broader than the current runtime.
- **After 009 render-layer fix + gap closure** (commit `eb1f49c3e` + `f90ba01cd`): the memory-quality pipeline and render-layer fixes closed the earlier runtime gap, but the batch review still found packet `003` roll-up truth drift inside the parent packet itself.
- **Current verdict from this batch review**: CONDITIONAL with 0 P0 / 7 P1 / 0 P2 across 13 reviewed phases.
- **Recommended next step**: hold the 026 train for the six remediation lanes above, then rerun targeted per-phase reviews on the touched packets and regenerate this synthesis before any release-readiness or merge claim.

---

## 8. Next Steps

1. For each P0 finding: None applicable.
2. For each P1 finding: remediate packet `003` roll-up truth, then packet `014` enrichment scope, packet `008` startup-hook gate, packet `010` degraded-lane wording or runtime, packet `002` blocked-state metadata, and packet `013` stale benchmark evidence before the next release-readiness claim.
3. For each recurring pattern in §4: add one structural packet-truth and named-surface parity gate so later packets cannot ship helper-only or stale-evidence overclaims without a matching test plus checklist assertion on the exact claimed surface.
4. For each MISSING per-phase review: None applicable.
5. For the 026 branch itself: hold for remediation, then rerun targeted phase reviews and refresh this consolidated report before opening or advancing any release-oriented PR.

---

## 9. Data Provenance

- Batch state consulted: `026/review/batch-phase-review-state.json`
- Per-phase reports read:
  - `026/review/002-implement-cache-warning-hooks/review-report.md`
  - `026/review/003-memory-quality-issues/review-report.md`
  - `026/review/004-agent-execution-guardrails/review-report.md`
  - `026/review/005-provisional-measurement-contract/review-report.md`
  - `026/review/006-structural-trust-axis-contract/review-report.md`
  - `026/review/007-detector-provenance-and-regression-floor/review-report.md`
  - `026/review/008-graph-first-routing-nudge/review-report.md`
  - `026/review/009-auditable-savings-publication-contract/review-report.md`
  - `026/review/010-fts-capability-cascade-floor/review-report.md`
  - `026/review/011-graph-payload-validator-and-trust-preservation/review-report.md`
  - `026/review/012-cached-sessionstart-consumer-gated/review-report.md`
  - `026/review/013-warm-start-bundle-conditional-validation/review-report.md`
  - `026/review/014-code-graph-upgrades/review-report.md`
- Per-phase findings registries read:
  - `026/review/002-implement-cache-warning-hooks/deep-review-findings-registry.json`
  - `026/review/003-memory-quality-issues/deep-review-findings-registry.json`
  - `026/review/004-agent-execution-guardrails/deep-review-findings-registry.json`
  - `026/review/005-provisional-measurement-contract/deep-review-findings-registry.json`
  - `026/review/006-structural-trust-axis-contract/deep-review-findings-registry.json`
  - `026/review/007-detector-provenance-and-regression-floor/deep-review-findings-registry.json`
  - `026/review/008-graph-first-routing-nudge/deep-review-findings-registry.json`
  - `026/review/009-auditable-savings-publication-contract/deep-review-findings-registry.json`
  - `026/review/010-fts-capability-cascade-floor/deep-review-findings-registry.json`
  - `026/review/011-graph-payload-validator-and-trust-preservation/deep-review-findings-registry.json`
  - `026/review/012-cached-sessionstart-consumer-gated/deep-review-findings-registry.json`
  - `026/review/013-warm-start-bundle-conditional-validation/deep-review-findings-registry.json`
  - `026/review/014-code-graph-upgrades/deep-review-findings-registry.json`
- Per-phase stop reasons and dimension coverage:

| Phase | Stop reason | Dimensions covered | Notes |
|-------|-------------|--------------------|-------|
| `002-implement-cache-warning-hooks` | `max_iterations` | `D1, D2, D3, D4` | Operator-extended from the original 5-iteration plan to 10 iterations. |
| `003-memory-quality-issues` | `max_iterations` | `D1, D2, D3, D4` | Operator-extended from the original 5-iteration plan to 10 iterations. |
| `004-agent-execution-guardrails` | `max_iterations` | `D1, D2, D3, D4` | Operator-extended from the original 5-iteration plan to 10 iterations. |
| `005-provisional-measurement-contract` | `max_iterations` | `D1, D2, D3, D4` | Operator-extended from the original 5-iteration plan to 10 iterations. |
| `006-structural-trust-axis-contract` | `max_iterations` | `D1, D2, D3, D4` | Dashboard records 4-of-4 dimension coverage in bullet-list form rather than the later table layout. |
| `007-detector-provenance-and-regression-floor` | `max_iterations` | `D1, D2, D3, D4` | Dashboard records 4-of-4 dimension coverage in bullet-list form rather than the later table layout. |
| `008-graph-first-routing-nudge` | `max_iterations` | `D1, D2, D3, D4` | Dashboard records 4-of-4 dimension coverage in bullet-list form rather than the later table layout. |
| `009-auditable-savings-publication-contract` | `max_iterations` | `D1, D2, D3, D4` | Dashboard records 4-of-4 dimension coverage in bullet-list form rather than the later table layout. |
| `010-fts-capability-cascade-floor` | `max_iterations` | `D1, D2, D3, D4` | Dashboard records 4-of-4 dimension coverage in bullet-list form rather than the later table layout. |
| `011-graph-payload-validator-and-trust-preservation` | `converged` | `D1, D2, D3, D4` | Early stop after D1-D4 because the phase report says all reviewed claims matched shipped runtime and packet evidence. |
| `012-cached-sessionstart-consumer-gated` | `converged` | `D1, D2, D3, D4` | Early stop after D1-D4 because the phase report says all reviewed claims matched shipped runtime and packet evidence, including real session-surface mounting through hook-state fixtures. |
| `013-warm-start-bundle-conditional-validation` | `max_iterations` | `D1, D2, D3, D4` | Completed the full 5-iteration plan with one remaining P1 traceability finding. |
| `014-code-graph-upgrades` | `max_iterations` | `D1, D2, D3, D4` | Completed the full 5-iteration plan with one remaining P1 correctness finding. |
- Parent review consulted: `026/review/review-report.md` (session `2026-04-09T03:59:45Z`)
- Parent findings registry consulted: `026/review/deep-review-findings-registry.json`
- Data-quality note: `011` and `012` frontmatter descriptions say "5-iteration deep review," but both the phase overview sections and `batch-phase-review-state.json` record 4 converged iterations. This synthesis uses the batch-state counts for iteration totals and flags the discrepancy here rather than smoothing it over.
- Synthesis timestamp: `2026-04-09T15:22:59Z`
- Synthesis session id: `2026-04-09T15:22:59Z-consolidated`
- Synthesizer: `cli-codex gpt-5.4 high fast`
