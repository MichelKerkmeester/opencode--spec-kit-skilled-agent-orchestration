# Iteration 6 — Q-E + Q-C combined

## Method
- Inputs: `research/cross-phase-matrix.md`, `research/iterations/q-a-token-honesty.md`, `research/iterations/iteration-2.md`, `research/iterations/iteration-3.md`, `research/iterations/gap-closure-phases-1-2.json`, `research/iterations/gap-closure-phases-3-4-5.json`, `research/phase-1-inventory.json`.
- New external reads: `003-contextador/external/LICENSE`, `002-codesight/external/package.json`, `003-contextador/external/package.json`, `004-graphify/external/pyproject.toml`, `004-graphify/external/README.md`, `005-claudest/external/pyproject.toml`, `005-claudest/external/README.md`, `005-claudest/external/plugins/claude-memory/README.md`, plus targeted source files for Graphify and Claudest candidate details.
- Public surface evidence read from: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md`, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md`.

## Q-E summary

| System | Verdict |
|---|---|
| 001 Claude Optimization Settings | `concept-transfer-only` |
| 002 CodeSight | `mixed` |
| 003 Contextador | `concept-transfer-only` |
| 004 Graphify | `mixed` |
| 005 Claudest | `mixed` |

`source-portable = 0`, `concept-transfer-only = 2`, `mixed = 3`. The hard blocker was not runtime alone; it was evidence quality around licensing. Only Contextador had a checked-in canonical `LICENSE` file, and that file was AGPL. [SOURCE: 003-contextador/external/LICENSE:1-26]

## Q-C summary

| Risk | Count |
|---|---:|
| Low | 16 |
| Med | 9 |
| High | 3 |

The highest-risk candidates all tried to collapse Public's split routing into a higher-order shared abstraction: CodeSight's single canonical scan, Contextador's bootstrap facade, and Graphify's cross-surface rebuild coordinator. The lowest-risk wins were bounded utilities inside one existing owner surface. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543]

## Surprises
- The stricter Q-E rule changed the tone of the matrix: CodeSight, Graphify, and Claudest all looked permissive in earlier synthesis, but none could be upgraded to `source-portable` because their checked-in snapshots lacked a canonical `LICENSE` file.
- Contextador is the cleanest legal read because it is the only repo with a real `LICENSE` file in-tree, and that certainty makes the rejection firmer, not softer. [SOURCE: 003-contextador/external/LICENSE:1-26]
- Claudest ended up with the safest composition wins despite the same license-evidence gap as CodeSight and Graphify. Its best candidates stay inside Spec Kit Memory instead of trying to own semantic or structural query. [SOURCE: phase-5/research/research.md:395-405] [SOURCE: research/cross-phase-matrix.md:14-16]
- CodeSight's nicest design move in isolation, the one-canonical-scan pattern, is one of the worst fits for Public specifically because Public already has a deliberate semantic/structural/session split. [SOURCE: phase-2/research/research.md:469-469] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543]
- Graphify's graph-first hook is a better compositional fit than its more ambitious orchestration ideas because it teaches the model to respect the split rather than bypass it. [SOURCE: phase-4/research/research.md:561-563] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:543-543]
- Q-A meaningfully changed Q-C scoring: candidates that improve measurement clarity or stay honest about uncertainty composed better than candidates whose parent systems still rely on synthetic or heuristic savings math. [SOURCE: research/iterations/q-a-token-honesty.md:6-14]

## Handoff to iteration 7 (Q-D + Q-F)
- Best low-risk feeders for Q-D sequencing: Claudest `context_summary` fast path, Claudest deterministic Stop-time summaries, Graphify graph-first hook, CodeSight F1 harness, Contextador MCP scaffold hints, and Graphify schema-boundary validation.
- Best medium-risk sequencing candidates: Claudest FTS cascade, Graphify evidence/confidence tagging, Graphify two-layer invalidation, Claudest auditor-vs-discoverer split, and Graphify Leiden clustering.
- High-risk items should stay late in Q-D and probably feed Q-F only as "combo after proof" ideas: CodeSight's canonical scan, Contextador's bootstrap layering, and Graphify's cross-surface rebuild policy.
- Early Q-F combo signal: Claudest's cached summary producer + Graphify's graph-first hook + existing Public split routing looks much more promising than any attempt to import a monolithic scan/bootstrap surface.
