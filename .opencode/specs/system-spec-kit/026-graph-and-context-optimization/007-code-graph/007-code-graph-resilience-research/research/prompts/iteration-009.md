You are running iteration 9 of 12 in a deep-research loop on code-graph resilience. Iterations 1-7 produced the staleness-model + gold-queries + recovery-playbook + exclude-rule-confidence assets. Iteration 8 designed the content-hash predicate patch. Iteration 9 designs the resolver upgrades.

# Iteration 9 — Resolver Upgrades for Cross-File Edges

## Goal

Iteration 6 cataloged 6 resolver failure modes (cross-module imports, path aliases, dynamic imports, type-only imports, re-export barrels, default-import aliasing). Iteration 9 produces concrete patch plans for the 3 highest-impact failure modes.

## Research Questions
- Q12A: Path aliases — how does the current resolver discover tsconfig.json `paths` mappings? What's the patch to consume them?
- Q12B: Type-only imports (`import type { X }`) — current parser behavior; how to track them as edges with a `TYPE_ONLY` weight class?
- Q12C: Re-export barrels (`export * from './foo'`) — current parser behavior; how to chase the re-export chain to the original symbol?
- Q12D: Which failure mode has the largest "missing edges" footprint in this repo? Quantify with concrete grep counts.

## Required reads
1. `research/iterations/iteration-006.md` — resolver failure catalog
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` — focus on import/export resolution paths (lines 850-1085 already cited)
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts` — TS query patterns, focus on import/export captures (lines 340-525)
4. `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` — current path alias configuration in this repo
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` — edge type enum + weight constants

## What to look for
- Where the resolver translates a string import specifier (`'./foo'`, `'@app/foo'`) to a concrete file path
- Whether `tsconfig.json paths` is read at scan time or ignored
- How the current parser tags type-only vs. value imports (any AST node type info in the captures)
- How `export * from` is captured by tree-sitter and whether it produces a node
- Concrete repo-local examples: grep for `import type`, `export *`, and `paths:` in `tsconfig.json` to count actual usage

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-009.md`

Required sections:
- **Summary**
- **Failure Mode A: Path Aliases** — current behavior + patch surface (file:line) + pseudocode + test plan
- **Failure Mode B: Type-Only Imports** — current behavior + patch surface + pseudocode + new edge type proposal
- **Failure Mode C: Re-Export Barrels** — current behavior + patch surface + pseudocode + chain-resolution algorithm
- **Quantitative Impact** — grep counts of each pattern in this repo
- **Patch Order Recommendation** — which to land first based on impact and risk
- **Files Reviewed**
- **Convergence Signals**

### 2. Delta JSON
Path: `research/deltas/iteration-009.json`. `research_questions_answered: ["Q12A", "Q12B", "Q12C", "Q12D"]`, `iteration: 9`, `focus: "resolver upgrade patch design"`.

### 3. State log append
JSONL with `iteration: 9`, `status: "insight"`, citations array.

## Constraints
- Read-only research.
- Pseudocode only; no actual TS edits.
- Quantitative impact MUST come from real grep counts on this repo, not estimates.
- Minimum 10 distinct file:line citations.
