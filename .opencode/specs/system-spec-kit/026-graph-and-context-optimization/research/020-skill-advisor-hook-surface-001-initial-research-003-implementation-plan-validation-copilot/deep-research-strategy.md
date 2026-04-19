# Deep Research Strategy — 020 Wave-3 Validation

## Topic

Wave-3 validation research for Phase 020 skill-advisor hook surface. Cross-check the 8-child implementation scaffold (020/002-009) against wave-1 research.md + wave-2 research-extended.md convergence.

## Execution

| Field | Value |
|-------|-------|
| Max iterations | 20 |
| Convergence threshold | 0.05 |
| Executor | cli-copilot gpt-5.4 high |
| Parent session | dr-020-extended-copilot-20260419T090500Z (wave-2 converged) |

## Key Questions (10 validation angles)

- [ ] V1: Gap analysis across 8 children vs wave-1 + wave-2 findings
- [ ] V2: Per-child risk hotspots (under-scoped, over-scoped, mis-ordered)
- [ ] V3: Hidden dependency cycles beyond the linear 002-009 chain
- [ ] V4: 019/004 corpus adequacy for 005 hard gate including adversarial class
- [ ] V5: Runtime-specific edge cases for 006/007/008 not captured
- [ ] V6: Observability contract completeness (metric namespace, JSONL, alerts, health)
- [ ] V7: Fail-open correctness across all error modes
- [ ] V8: Migration compatibility when hook lands in existing sessions
- [ ] V9: Privacy audit scope — every channel where prompt content could leak
- [ ] V10: Hard-gate realism — p95 cache hit 50 ms + cache hit rate 60% budget math

## Known Context

### Wave-1 (cli-codex, converged)

- 10 questions answered; research.md at `.../research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Architecture: shared-payload contract → freshness → producer → renderer → runtime adapters
- 8-child decomposition finalized: 002-009

### Wave-2 (cli-copilot extended, converged)

- 10 iterations; research-extended.md at `.../research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/research-extended.md`
- Refinements: 200-prompt parity harness design (X1), Claude UserPromptSubmit semantics (X2), Copilot transport split (X3), Codex enforcement boundary (X4), adversarial advisor (X5), observability (X6), migration (X7), concurrency (X8), NFKC renderer boundary (X9)
- No architecture reversal

### Current 8-child scaffold

- `020/002-shared-payload-advisor-contract`
- `020/003-advisor-freshness-and-source-cache`
- `020/004-advisor-brief-producer-cache-policy`
- `020/005-advisor-renderer-and-regression-harness` (HARD GATE)
- `020/006-claude-hook-wiring`
- `020/007-gemini-copilot-hook-wiring`
- `020/008-codex-integration-and-hook-policy`
- `020/009-documentation-and-release-contract`

Each child has spec.md + plan.md + tasks.md + checklist.md + implementation-summary.md placeholder + metadata.

## Next Focus

Iteration 1: V1 gap analysis — read each child's spec.md and compare scope against wave-1 §Implementation Cluster Decomposition + wave-2 §Refined Cluster Decomposition

## What Worked

TBD (populated post-convergence)

## What Failed

TBD

## Exhausted Approaches

TBD

## Ruled Out Directions

(Pre-committed, not reopening):
- Re-opening wave-1 architecture decisions
- Re-opening wave-2 contract semantics (trust state, fail-open, token caps)
- Proposing new children beyond 002-009
- Modifying scaffolded files (wave-3 produces proposals only)
