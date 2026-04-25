# Planning Review: Phase 012 GitNexus Adoption

You are reviewing a freshly-scaffolded implementation phase for **planning mistakes** (logical inconsistencies, scope drift, broken cross-references, contradictory ADRs, sub-phase ordering errors, out-of-scope content, false claims about Public's current code state, missing dependencies).

You are **NOT** reviewing for code quality (no code shipped yet) — you are reviewing the planning artifacts BEFORE implementation begins.

## Read these in order

### 1. Source research (the ground truth that 012 is supposed to implement)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-01/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/research.md`

### 2. The plan file (what was approved)
- `/Users/michelkerkmeester/.claude/plans/create-new-phase-with-zazzy-lighthouse.md`

### 3. Phase 012 root files
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/spec.md`
- `.../012-graph-impact-and-affordance-uplift/plan.md`
- `.../012-graph-impact-and-affordance-uplift/tasks.md`
- `.../012-graph-impact-and-affordance-uplift/checklist.md`
- `.../012-graph-impact-and-affordance-uplift/decision-record.md`
- `.../012-graph-impact-and-affordance-uplift/implementation-summary.md`

### 4. Six sub-phase folders (each has spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md)
- `001-clean-room-license-audit/`
- `002-code-graph-phase-runner-and-detect-changes/`
- `003-code-graph-edge-explanation-and-impact-uplift/`
- `004-skill-advisor-affordance-evidence/`
- `005-memory-causal-trust-display/`
- `006-docs-and-catalogs-rollup/`

### 5. Public code state (anchors cited in 012 specs — verify they exist + line numbers are reasonable)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` (cited at :92 for code_edges metadata column)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` (cited at :85-94 metadata writer, :1369 indexFiles entry)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` (cited at :862-909 computeBlastRadius, :978-981 query output)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` (cited at :82-94 schema)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` (cited at :49-77 freshness decay)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` (cited at :43 ALLOWED_ENTITY_KINDS)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` (cited at :9-43)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` (cited at :12-18 EDGE_MULTIPLIER, :20-81 lane logic)

## What to check (severity-tagged findings)

### P0 — Material mistakes that will cause implementation to fail or break invariants
- [ ] Any sub-phase scope contradicts pt-02 §11 (Implementation Roadmap), §12 (Risk Plan), or §13 (Ownership Boundary Contracts)?
- [ ] Any cited Public file path or line range that doesn't exist or is materially wrong?
- [ ] Sub-phase 002 (`detect_changes`) hard rule "status: blocked on stale; never empty" — properly enforced in the spec/checklist?
- [ ] Sub-phase 005 (Memory) hard rule "no schema change; no new relations" — properly enforced?
- [ ] Sub-phase 004 (Skill Advisor) hard rules "no new lane; no new entity_kinds" — properly enforced?
- [ ] Any ADR in `decision-record.md` contradicting another ADR?
- [ ] pt-02 Packet 5 (route/tool/shape) treated as deferred everywhere it appears?
- [ ] Mutating `rename` rejected everywhere it appears (only read-only preview allowed)?

### P1 — Logical/sequencing problems
- [ ] Sub-phase dependency graph (001 → 002 → {003, 004, 005} → 006) consistent across phase plan.md, sub-phase plan.md files, and tasks.md?
- [ ] Any sub-phase claiming a dependency that isn't actually there?
- [ ] Any task in `tasks.md` referenced in `checklist.md` but missing from the actual `tasks.md`?
- [ ] `merged-phase-map.md` consistency — does the phase map need updating? (note: 006 plans this in step D13)
- [ ] Per-packet docs split (002-005 inline) vs trailing rollup (006) — consistent in ADR-012-007 + sub-phase specs + 006/spec.md scope?
- [ ] Memory↔CodeGraph evidence bridge — pt-01 proposed it; pt-02 deferred it. 012 should defer it. Confirmed?
- [ ] feature_catalog/manual_testing_playbook category numbers (03, 06, 11, 13, 14) — match where each sub-phase plans to write?

### P2 — Style/conformance issues
- [ ] Custom section headers in implementation-summary.md and checklist.md that don't match active templates (this caused 38 strict-validation errors — confirm these are cosmetic, not load-bearing)
- [ ] Any frontmatter `_memory.continuity` placeholders that should be real
- [ ] Trigger phrase quality (specific enough to be useful in routing)

### Bonus checks
- [ ] Are there findings from pt-01 OR pt-02 that 012 should have included but didn't?
- [ ] Are there findings that 012 INCLUDED but pt-02 explicitly rejected/deferred?
- [ ] Sub-phase 001 ADR halt criterion — under what specific LICENSE outcome would it actually halt? Spec is reasonable?

## Output format

Produce a concise findings report. For each finding:
```
[Severity] [Finding ID] Location: <file:line>
Issue: <one-sentence problem>
Evidence: <quote or cross-reference>
Suggested fix: <one sentence>
```

If you find ZERO P0 issues, say so explicitly. If you find P0 issues, list them first.

Skip findings that are pure cosmetic preference (template section header style is already acknowledged as cosmetic — only flag if it's actually a contract violation).

Final line: `OK — N P0, M P1, K P2 findings. Plan is/is-not implementation-ready.`
