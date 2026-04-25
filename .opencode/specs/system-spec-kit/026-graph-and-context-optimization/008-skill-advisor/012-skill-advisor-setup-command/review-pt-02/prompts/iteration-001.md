You are running iteration 1 of 5 in a CLOSURE re-review loop. This is NOT a fresh review — your job is to verify whether the 14 correctness findings from review-pt-01 are now closed by the remediation that landed.

# Iteration 1 — Closure Verification: Correctness (F-CORR-001..014)

## Required reads
1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review-pt-02/deep-review-strategy.md` (this run's strategy)
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-001.md` (prior P1 findings F-CORR-001..004)
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md` (F-CORR-005..009)
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-003.md` (F-CORR-010..014)
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md` (post-review-fixes section)
6. CURRENT state of: `.opencode/command/spec_kit/skill-advisor.md`, both YAMLs

## What to verify (per-finding closure check)

For each F-CORR-NNN, output one of:
- **CLOSED** — finding no longer reproduces on current file state; cite the file:line of the fix
- **REGRESSED** — finding still reproduces; cite the file:line still showing the issue
- **PARTIAL** — partly fixed; cite what closed and what didn't

Findings to re-verify:
- F-CORR-001: No-suffix execution mode contract (top-level vs setup parser)
- F-CORR-002: First-action contradiction (load YAML first vs after setup)
- F-CORR-003: Dry-run skips Phase 3+4 + proposal artifact path
- F-CORR-004 (P2): Rollback wording inconsistency
- F-CORR-005: derived.triggers/keywords schema mismatch in auto.yaml
- F-CORR-006: Mutation-boundary enforcement (pre-write canonical validator)
- F-CORR-007: Graph-scan failure handling contradiction
- F-CORR-008: Confidence framework not wired to outputs/gates
- F-CORR-009 (P2): Scope filter unconditional Phase 3 edits
- F-CORR-010: Confirm mode inherits derived.triggers/keywords mismatch
- F-CORR-011: Confirm `C <lane>` flowing into unconditional edits
- F-CORR-012: post_phase_4 rollback option missing rollback_action
- F-CORR-013: pre_phase_4 allowing verification on build_status=failure
- F-CORR-014 (P2): Per-skill loop `C` schema undefined

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review-pt-02/iterations/iteration-001.md`

Structure:
```
# Iteration 1 - Closure Verification: Correctness

## Summary
[1-2 sentences on closure rate]

## Closure Verdict per Finding

| Finding | Verdict | Evidence (file:line) | Notes |
|---|---|---|---|
| F-CORR-001 | CLOSED | skill-advisor.md:43 | top-level says "no suffix prompts for execution mode" matching parser |
| ... | ... | ... | ... |

## New findings (if any introduced by remediation)
[zero is the goal; any introduced get P0/P1/P2 severity with file:line]

## Closure Stats
- closed: N/14
- regressed: N/14
- partial: N/14
- new findings: N

## Files Reviewed
- [list with line ranges]

## Convergence Signals
- newFindingsRatio: [number 0-1]
- dimensionsCovered: ["correctness"]
```

### 2. Delta JSON
Path: `review-pt-02/deltas/iteration-001.json`
Schema same as pt-01 deltas, plus a `closure` block: `{"closed": ["F-CORR-..."], "regressed": [...], "partial": [...], "new": [...]}`

### 3. State log append
Append a JSONL line to `review-pt-02/deep-review-state.jsonl` with type:"iteration", iteration:1, dimensions:["correctness"], closure:{...}, newFindingsRatio.

## Constraints
- Read-only on review targets.
- Cite file:line for every verdict.
- Do NOT introduce new dimension audits — closure focus only.
- If you discover a brand-new issue introduced by the remediation, classify it as a NEW finding (severity-tagged) — these block PASS.
