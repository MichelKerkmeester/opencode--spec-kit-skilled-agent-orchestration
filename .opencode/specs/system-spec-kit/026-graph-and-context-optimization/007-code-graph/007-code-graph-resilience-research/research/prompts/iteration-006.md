You are running iteration 6 of 7 in a deep-research loop on code-graph resilience.

# Iteration 6 — Edge Weight Drift + Symbol Resolution Failures

## Research Questions
- Q7: Edge weight drift — do current edge weights need re-tuning over time as the codebase evolves? How would we detect drift?
- Q8: Symbol resolution failure modes — where do current resolvers fail (cross-module imports, dynamic imports, decorator-mutated names, type-only imports)?

## Required reads
1. Strategy + iterations 1-5 outputs
2. Code-graph edge weight definitions (locate via grep for "edge_weight" or "EDGE_MULTIPLIER")
3. Symbol resolver implementation (look for resolver / resolve functions in code-graph)
4. Existing resolver tests and any fixtures that exercise edge cases

## What to look for
- How are edge weights configured today? (constants? config file? per-edge-type?)
- Are weights tunable post-deploy, or hard-coded?
- Drift signals: which edge types' relative importance shifts as the codebase grows?
- Resolver failure patterns:
  - Cross-module imports (TS / JS): does the resolver handle path aliases?
  - Dynamic imports (`import('foo')`): are these tracked?
  - Decorators that rename or wrap functions
  - Type-only imports (TS `import type`)
  - Re-exports (`export * from './foo'`)
  - Default exports vs named exports

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-006.md`

Required sections: Summary, Edge Weight Catalog (current values + how they're set), Drift Detection Proposal, Resolver Failure Catalog (per-failure-mode with file:line evidence), Files Reviewed, Convergence Signals.

### 2. Delta JSON
Path: `research/deltas/iteration-006.json`. Schema with `research_questions_answered: ["Q7", "Q8"]`.

### 3. State log append
JSONL line to `research/deep-research-state.jsonl` with iteration:6.

## Constraints
- Read-only.
- Drift detection must be measurable (not just "intuitively check sometimes").
- Resolver failures must reproduce against current code (cite the broken case).
