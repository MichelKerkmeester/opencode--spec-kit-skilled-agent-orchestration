---
title: Deep Research Strategy Template
description: Strategy file tracking research progress across iterations for Hydra DB features assessment.
---

# Research Strategy

## Topic
Hydra DB features assessment — determine if features delivered during 008-hydra-db-based-features need refinement, upgrade, or bugfix. Covers 6 phases: baseline/safety rails, versioned memory state, unified graph retrieval, adaptive retrieval loops, hierarchical scope governance, shared memory rollout.

## Key Questions (remaining)
- [ ] Q1: Are there undiscovered bugs or regressions in the Hydra runtime modules (capability-flags.ts, lineage-state.ts, scope-governance.ts, shared-spaces.ts, shared-memory handlers) since the March 17 2026 closure verification?
- [ ] Q2: Do the current Hydra capability flags and rollout defaults need refinement for production readiness, and are the phase gate transitions correctly governed?
- [ ] Q3: Are the lineage/asOf internals and shared-memory collaboration features complete enough for real-world multi-workspace usage, or do they need enhancement?
- [ ] Q4: Are there code quality, architectural, or performance issues in the Hydra modules that would benefit from refactoring (dead code, unused exports, over-coupling)?
- [ ] Q5: Do the test suites (7790 tests, 53 Hydra-specific) adequately cover edge cases, failure modes, and concurrent access patterns for all six phases?

## Answered Questions
[None yet — populated as iterations answer questions]

## What Worked
- Static source audit with line-level tracing: all 3 agents found genuine issues (iteration 1)
- Module cluster splitting across agents: minimal overlap, good coverage (iteration 1)
- Cross-referencing callers and test files alongside source: reveals test gaps and integration bugs (iteration 1)

## What Failed
- Codex-5.3 output truncated by head limit: lost retention.ts and vector-index-mutations.ts deep analysis (iteration 1)
- Codex MCP servers (cocoindex_code, spec_kit_memory) failed to start for Codex CLI agents (iteration 1)

## Exhausted Approaches (do not retry)
[None yet]

## Next Focus
Iteration 3: Focus on remaining unaudited Hydra phases:
- Phase 3 (unified graph retrieval): graph-roadmap-finalization.ts, graph signal modules
- Phase 4 (adaptive retrieval): adaptive-ranking.ts, shadow scoring
- Schema-level FK analysis across all Hydra tables (migration paths)
- Cross-cutting theme: quantify the systemic transaction boundary problem
Assign Opus to adaptive-ranking + schema FK analysis, GPT-5.4 to graph modules, Codex-5.3 to cross-cutting transaction/atomicity pattern analysis

## Known Context
- Spec folder status: Complete (Level 3, closed 2026-03-17)
- Six delivered phases: 001-baseline-and-safety-rails through 006-shared-memory-rollout
- Two runtime defects were fixed during closure: owner-only shared-space enforcement, retention sweep deletion routing
- Verification evidence: 283 passed files, 7790 passed tests, 11 skipped, 28 todo
- 53 Hydra-specific tests across feature-flag-reference, hydra-spec-pack-consistency, shared-spaces, memory-governance, memory-lineage-state, memory-lineage-backfill, adaptive-ranking, graph-roadmap-finalization
- Key runtime surfaces: capability-flags.ts, lineage-state.ts, scope-governance.ts, shared-spaces.ts, shared-memory handlers, retention.ts, vector-index-mutations.ts
- No prior memory context found in the memory system

## Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Delegation: 3 agents per iteration (Opus + GPT-5.4 high + Codex-5.3 high)
- Current segment: 1
- Started: 2026-03-19T07:04:00Z
