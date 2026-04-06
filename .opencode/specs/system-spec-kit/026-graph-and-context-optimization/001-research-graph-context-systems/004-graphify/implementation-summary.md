---
title: "Implementation Summary: 004-graphify Research Phase"
description: "Outcome summary of the graphify external repo research phase"
trigger_phrases:
  - "graphify implementation summary"
  - "004-graphify outcome"
importance_tier: "important"
contextType: "summary"
---
# Implementation Summary: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v1.0 -->

## 1. Status: COMPLETE

Research-only phase. No production code modified. Canonical output: `research/research.md`.

## 2. What Was Investigated

graphify (external Python Claude Code skill, ~5,500 LOC across 18 modules + a 650-line `skill.md` orchestration prompt, located at `external/graphify/` and `external/skills/graphify/`). 7-iteration deep-research loop converged at 91.7% question coverage (11 of 12 research questions answered; Q12 was the synthesis question itself).

## 3. Key Findings (12 total — full list in research/research.md §13)

**Architectural**:
- K1: 71.5x token reduction claim mathematically reproducible but rests on three load-bearing assumptions
- K2: Pipeline is `detect → extract → build → cluster → analyze → report → export` with extract internally split into parallel AST + semantic branches
- K3: Cache invalidation is a TWO-LAYER stack (manifest mtime + SHA256 content hash)

**AST Extraction**:
- K4: 12 extractors covering 18 extensions; Swift detected but never extracted (3-layer structural gap)
- K5: Python is uniquely powerful — only language with call graph, cross-file `uses`, and rationale nodes

**Semantic Extraction**:
- K6: Semantic subagent prompt embedded verbatim in skill.md (not Python) — defines 4 knowledge primitives + 6 per-image-type strategies
- K7: Merge logic is also in skill.md, NOT in graphify Python — orchestration/data layer coupling

**Evidence Tagging**:
- K8: Evidence labeling is a transport-level guarantee; every edge has both categorical and numeric confidence
- K9: Confidence score has TWO sources of truth — AST defaults vs LLM-emitted scores diverge for INFERRED edges

**Clustering & Analysis**:
- K10: Leiden clustering uses graspologic with hardcoded constants (`_MAX_COMMUNITY_FRACTION = 0.25`, `_MIN_SPLIT_SIZE = 10`) and NO tunable parameters
- K11: Surprising connections use a 6-factor composite score with human-readable `reasons` array

**Operational**:
- K12: PreToolUse hook payload is a one-line conditional nudge against matcher `Glob|Grep` — surgical insertion against the exact tools Public uses for raw search

## 4. Recommendations

**ADOPT (4)**: evidence-tagging contract, PreToolUse hook with `Glob|Grep` matcher, two-layer cache invalidation, CLAUDE.md companion section
**ADAPT (5)**: semantic prompt-as-data with versioning, per-image-type extraction strategies, generic git auto-rebuild hooks, suggested questions generator, Leiden clustering with exposed tunable parameters
**REJECT (4)**: graphify's 12-language AST extractor (covered by phase 002), MCP server (covered by phase 003), HTML viewer (out of scope), wholesale replacement of Code Graph MCP/CocoIndex

Full table with adoption plans and source citations in `research/research.md` §12.

## 5. Implementation Order (recommended)

1. **Sprint 1 (week 1)**: A1 evidence tagging + A2 PreToolUse hook + A4 CLAUDE.md companion — three low-effort high-impact wins
2. **Sprint 2 (week 2)**: A3 two-layer cache invalidation + D2 per-image-type strategies
3. **Sprint 3 (week 3-4)**: D1 semantic prompt skill + D3 auto-rebuild hooks
4. **Sprint 4 (later)**: D4 suggested questions + D5 Leiden clustering (only if 1-3 prove valuable)

## 6. Engine Notes

- **Iteration 1**: codex CLI gpt-5.4 reasoning effort=high (per user directive "use cli-codex wherever possible") — 8 findings, 106K tokens, ~4 minutes
- **Iteration 2 attempted**: codex starved on parallel-job API contention (~20 minutes, 0 CPU time) — killed
- **Iterations 2-7**: switched to claude-opus-direct reads (per user directive "do faster") — finished each iteration in 1-3 minutes

## 7. Cross-Phase Notes

- Did NOT propose adopting graphify's AST extractors (covered by phase 002 codesight)
- Did NOT propose adopting graphify's MCP server (covered by phase 003 contextador)
- Focused recommendations on 4 unique-to-graphify capabilities: clustering + multimodal + evidence tagging + hook patterns + cache invalidation

## 8. Next Steps

- Review `research/research.md` and the §12 Adopt/Adapt/Reject table
- If A1 (evidence tagging) approved: extend `code_graph_query` and `mcp__cocoindex_code__search` response payloads
- If A2 (PreToolUse hook) approved: install conditional hook in `.claude/settings.json`
- Run `/spec_kit:plan` to convert recommendations into an implementation plan
- Cross-reference with phase 005 (claudest) findings before finalizing recommendations across the 026 packet

## 9. Artifacts

- `spec.md`, `plan.md`, `tasks.md` (Level 1 stubs)
- `implementation-summary.md` (this file)
- `research/research.md` (canonical synthesis, 17 sections, 12 findings)
- `research/iterations/iteration-{001..007}.md` (7 iterations, all findings with file:line citations)
- `research/deep-research-{config,state,strategy,dashboard,findings-registry}.{json,md,jsonl}` (state)
- `memory/*.md` (memory artifact via generate-context.js)
