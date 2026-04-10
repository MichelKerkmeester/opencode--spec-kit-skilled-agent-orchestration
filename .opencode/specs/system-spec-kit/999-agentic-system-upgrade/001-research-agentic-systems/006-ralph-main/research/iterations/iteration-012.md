# Iteration 012 — Split Run-State from Semantic Memory

## Research question
Is `system-spec-kit`'s memory architecture the right shape for agentic execution, or does Ralph's `prd.json` plus `progress.txt` model suggest a cleaner split between execution state and archival memory?

## Hypothesis
`system-spec-kit` needs its rich semantic memory stack, but it likely lacks a thin run-local bridge artifact for "what the next iteration needs right now."

## Method
Compared Ralph's persisted working set in `ralph.sh`, `prompt.md`, `README.md`, and `.gitignore` against the architecture and save workflow documented in `memory_system.md` and `save_workflow.md`.

## Evidence
- Ralph persists only a tiny bridge between runs: `prd.json`, `progress.txt`, git history, and `.last-branch`; those generated files are explicitly ignored from version control. [SOURCE: external/README.md:165-168] [SOURCE: external/ralph.sh:37-40] [SOURCE: external/.gitignore:1-7]
- The execution prompt requires every iteration to append progress, preserve reusable patterns at the top of the log, and resume from that compact bridge before doing new work. [SOURCE: external/prompt.md:18-48]
- `system-spec-kit`'s memory system is much broader: vector search, FTS5 plus embeddings, constitutional injection, indexed spec docs, checkpoints, causal tools, and 43 MCP tools. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-18] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:23-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- The save workflow routes both slash-command and direct-script paths through `generate-context.js`, producing indexed memory artifacts intended for durable retrieval rather than a lightweight next-iteration bridge. [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:29-74] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:146-152]

## Analysis
Phase 1 already concluded that Ralph's minimal persistence model is too weak to replace Spec Kit Memory. Phase 2 changes the question: not "replace memory," but "separate memory concerns." Ralph makes a sharp distinction between execution bridge state and long-term audit history. `system-spec-kit` currently has excellent long-term retrieval, but the bridge between consecutive autonomous runs is comparatively heavy: handovers, indexed memory files, and command setup flows all carry more structure than the next iteration usually needs. That suggests an architectural refactor, not a replacement: add a first-class, append-only run-state artifact that feeds or summarizes into semantic memory later.

## Conclusion
confidence: high

finding: `system-spec-kit` should REFACTOR continuity into two layers: a lightweight execution bridge for the next autonomous run, and the existing semantic memory/archive layer for broader retrieval and historical reasoning.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`
- **Change type:** new subsystem + modified existing
- **Blast radius:** architectural
- **Prerequisites:** define the bridge artifact schema and how it rolls up into `generate-context.js`
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Memory save and retrieval are optimized for durable, searchable context with indexed files, semantic search, and governance-aware boundaries. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-18] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- **External repo's approach:** Ralph uses a tiny local bridge: one structured task-state file, one append-only progress log, and git as supporting audit context. [SOURCE: external/README.md:165-168] [SOURCE: external/prompt.md:18-48] [SOURCE: external/.gitignore:1-7]
- **Why the external approach might be better:** It minimizes restart cost for the next iteration because the agent only has to ingest a narrow, execution-oriented state bundle. [SOURCE: external/prompt.md:7-16] [SOURCE: external/prompt.md:18-35]
- **Why system-spec-kit's approach might still be correct:** The current memory stack solves broader cross-session, cross-packet, and governance problems that Ralph does not try to solve. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:38-50] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:205-221]
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce a phase-local append-only run-state artifact, likely under `scratch/` or `research/`, with two sections: current verified task state and reusable local patterns. Keep `generate-context.js` as the archival/indexed save path, but let it ingest and condense the bridge artifact rather than being the only continuity surface.
- **Blast radius of the change:** architectural
- **Migration path:** Prototype the bridge in one workflow first, add docs and reducer support, then make memory save optionally summarize bridge state into long-term memory artifacts.

## Counter-evidence sought
I looked for an existing lightweight next-iteration bridge artifact in `system-spec-kit` and found rich handover and memory save paths, but not a narrow append-only execution log equivalent to Ralph's `progress.txt`. [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:20-27] [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:42-77]

## Follow-up questions for next iteration
- If continuity is split into two layers, does the current agent-role architecture still make sense?
- Should the bridge artifact be command-owned, agent-owned, or phase-owned?
- How much of the current command surface exists only because there is no explicit lightweight execution bridge?
