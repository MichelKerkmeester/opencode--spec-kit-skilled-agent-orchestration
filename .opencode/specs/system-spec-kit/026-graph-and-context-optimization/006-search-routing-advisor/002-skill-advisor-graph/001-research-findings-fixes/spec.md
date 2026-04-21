---
title: "Feature Specification: Skill Graph Research Findings Fixes [template:level_2/spec.md]"
description: "Fix the 5 P0 and 5 P1 issues found by 10-iteration deep research audit of the skill graph system."
trigger_phrases:
  - "001-research-findings-fixes"
  - "skill graph fixes"
  - "graph findings fixes"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes"
    last_updated_at: "2026-04-13T16:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created spec"
    next_safe_action: "Implement fixes"
    key_files: ["spec.md"]

---
# Feature Specification: Skill Graph Research Findings Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Fix the issues found by a 10-iteration GPT-5.4 deep research audit of the skill graph system. The audit concluded the system is safe as an assist layer but not production-ready. This phase addresses 5 blocking (P0) issues and 5 important (P1) issues to bring the graph to production quality.

**Source:** `../research/iterations/iteration-010.md` (final synthesis)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete (P0 + P1-1/P1-3 landed; P1-2/P1-4/P1-5 deferred) |
| **Created** | 2026-04-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `011-skill-advisor-graph` (initial implementation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEMS TO FIX

### P0 — Blocking Issues

**P0-1: Graph-only candidate creation**
Family and sibling boosts can push a skill into results with zero lexical evidence. A user asks about one CLI tool and all four CLI siblings appear.
- File: `skill_advisor.py` functions `_apply_graph_boosts()` and `_apply_family_affinity()`
- Fix: Only boost skills that already have some non-graph evidence (lexical, phrase, semantic, or explicit name match)

**P0-2: Hub/orphan edge gaps**
Four important skills have zero outbound edges and are invisible to the graph:
- `system-spec-kit` — most central skill, routes to sk-doc, sk-git, sk-code-opencode
- `mcp-coco-index` — used in semantic search workflows
- `sk-doc` — creates docs for spec folders, closely related to system-spec-kit
- `sk-improve-prompt` — all 4 CLI skills ALWAYS load its prompt quality card
- File: `graph-metadata.json` in each of these 4 skill folders

**P0-3: Compiler drops routing metadata**
`intent_signals` and `domains` are validated but excluded from compiled `skill-graph.json`. The graph carries topology but not routing intelligence.
- File: `skill_graph_compiler.py` compile_graph() function
- Fix: Include `intent_signals` in compiled output (relax 2KB target to ~3.5KB)

**P0-4: `prerequisite_for` edges are inert**
Present in source metadata (e.g., mcp-code-mode lists 3 prerequisite_for edges) but stripped at compile time. These edges are decoration only.
- File: `skill_graph_compiler.py` line where edge types are filtered
- Fix: Either compile them into runtime adjacency or remove from source schema

**P0-5: Graph evidence mixed with direct evidence**
Confidence/uncertainty treats a graph-derived boost identically to a direct keyword match. This inflates certainty for indirectly-related skills.
- File: `skill_advisor.py` calibration and threshold functions
- Fix: Tag graph boosts differently so calibration can weight them lower

### P1 — Should Fix

**P1-1: Compiler missing validation checks**
No warnings for self-edges, zero-edge skills, dependency cycles, or enhances weight asymmetry.
- File: `skill_graph_compiler.py` validate_skill_metadata()

**P1-2: Phrase booster drift**
21 phrase-skill pairs in hardcoded PHRASE_INTENT_BOOSTERS duplicate `intent_signals` in graph metadata. Two systems saying the same thing.
- File: `skill_graph_compiler.py` (add drift audit flag)

**P1-3: sk-deep-review ↔ sk-deep-research sibling leaks wrong mode**
Sibling boost can suggest research when user wants review (and vice versa).
- File: `sk-deep-review/graph-metadata.json` and `sk-deep-research/graph-metadata.json`

**P1-4: Reason field truncation hides evidence**
Advisor output sorts reasons alphabetically and truncates to 5, so graph tokens can crowd out stronger direct evidence.
- File: `skill_advisor.py` recommendation formatting

**P1-5: CocoIndex failure is silent**
Semantic search subprocess failures return empty `[]` with no diagnostic trace.
- File: `skill_advisor.py` _apply_semantic_boosts()
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix all 5 P0 issues
- Fix P0 issues and selected P1 issues (P1-1, P1-3); remaining P1 items deferred
- Update regression test cases as needed
- Re-run compiler to regenerate skill-graph.json

### Out of Scope
- Replacing hardcoded booster maps with graph-derived boosters (future work)
- Session bootstrap injection of the graph
- Graph visualization tooling
- Tuning edge weights (wait until P0 fixes land)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:files -->
## 4. KEY FILES

| File | Action | Issues |
|------|--------|--------|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modify | P0-1, P0-5, P1-4, P1-5 |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Modify | P0-3, P0-4, P1-1, P1-2 |
| `.opencode/skill/system-spec-kit/graph-metadata.json` | Modify | P0-2 |
| `.opencode/skill/mcp-coco-index/graph-metadata.json` | Modify | P0-2 |
| `.opencode/skill/sk-doc/graph-metadata.json` | Modify | P0-2 |
| `.opencode/skill/sk-improve-prompt/graph-metadata.json` | Modify | P0-2 |
| `.opencode/skill/sk-deep-review/graph-metadata.json` | Modify | P1-3 |
| `.opencode/skill/sk-deep-research/graph-metadata.json` | Modify | P1-3 |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Regenerate | After all metadata fixes |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modify | New test cases |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- [x] Ghost candidate prevention: DONE [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` functions `_apply_graph_boosts()` and `_apply_family_affinity()` both gate graph/family boosts on pre-graph snapshot evidence.]
- [x] Edge gaps filled: DONE [EVIDENCE: `.opencode/skill/system-spec-kit/graph-metadata.json` adds 3 outbound enhances edges; `.opencode/skill/sk-doc/graph-metadata.json` adds 1; `.opencode/skill/mcp-coco-index/graph-metadata.json` adds 1; `.opencode/skill/sk-improve-prompt/graph-metadata.json` adds 4.]
- [x] `intent_signals` in compiled output: DONE [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill-graph.json` contains the top-level `signals` field.]
- [x] `prerequisite_for` compiled: DONE [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill-graph.json` adjacency includes `mcp-code-mode.prerequisite_for` and `sk-code-review.prerequisite_for`.]
- [x] Graph evidence separation: DONE [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` tracks `_graph_boost_count` before confidence calibration.]
- [x] Compiler warnings: DONE [EVIDENCE: `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` returns zero-edge warnings and the compiler source validates self-edges and dependency cycles.]
- [x] Regression passes: DONE [EVIDENCE: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` returned 44/44 passing, including 12/12 P0.]
- [ ] Audit-drift diagnostics: DEFERRED [DEFERRED: P1-2 `--audit-drift` flag remains unimplemented.]
- [x] Deep-review/deep-research sibling leak fixed: DONE [EVIDENCE: `.opencode/skill/sk-deep-review/graph-metadata.json` and `.opencode/skill/sk-deep-research/graph-metadata.json` both set `"siblings": []`.]
- [ ] Reason ordering: DEFERRED [DEFERRED: P1-4 still sorts reasons alphabetically.]
- [ ] CocoIndex diagnostics: DEFERRED [DEFERRED: P1-5 semantic-search failures still return without diagnostic trace.]
<!-- /ANCHOR:success -->
