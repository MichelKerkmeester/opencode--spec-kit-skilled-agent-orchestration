# Iteration 4: extract-learnings + auditor vs discoverer

## Focus
This iteration traced how `extract-learnings` turns recalled conversation signal into proposed memory edits instead of writing raw recall directly into storage. The main goal was to pin down the consolidation pipeline and the work split between verification-oriented auditing and discovery-oriented signal mining.

## Findings
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` defines a four-phase consolidation flow: orient on the current hierarchy and existing memory state, gather with two parallel specialists, synthesize into 3-7 ranked candidates with explicit layer/action decisions, then execute only approved edits. That matters for `Code_Environment/Public` because our `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` work already extracts signals, but this source shows a stronger post-recall contract: dedupe, layer placement, proposal review, and bounded candidate count before mutation. Recommendation label: (adopt now)
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` and `external/plugins/claude-memory/agents/memory-auditor.md` make `memory-auditor` a strict verifier of existing memory, not a discoverer: it parses concrete entities already stored in memories, checks them against codebase and git evidence, and emits only `STALE`, `CONTRADICT`, `MERGE`, or `DATE_FIX` findings with proof and replacement text. Compared with our existing `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` direction, this suggests consolidation should reserve one lane for evidence-backed memory maintenance instead of mixing stale-checking into raw signal extraction or scoring. Recommendation label: (adopt now)
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` and `external/plugins/claude-memory/agents/signal-discoverer.md` make `signal-discoverer` responsible for mining recent sessions, generalizing incidents into reusable principles, and classifying them as `UPDATE`, `CONTRADICT`, `FILL_GAP`, or `NOISE`, with optional promotion to `Meta` when a pattern should become a skill. For `Code_Environment/Public`, this is a useful complement to the existing `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` packet because it separates "find new durable knowledge" from "verify current memory truth," which should reduce noisy or overly session-specific memory writes. Recommendation label: (adopt now)
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` also distinguishes simple capture from true consolidation: if the user already supplied explicit content and did not trigger consolidation mode, the workflow skips subagents and jumps straight to propose-and-execute; if `MEMORY.md` is brand new, it skips `memory-auditor` entirely and runs only discovery. That matters for our signal-extraction work because it argues for two operating modes in `Code_Environment/Public`: lightweight direct capture for explicit saves, and a heavier consolidation pass only when reconciling recall output with the memory hierarchy. Recommendation label: (prototype later)

## Ruled Out
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution.

## Dead Ends
- No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/agents/memory-auditor.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/agents/signal-discoverer.md`

## Reflection
- What worked and why: Reading the skill first made the later agent docs much easier to map onto the overall consolidation lifecycle.
- What did not work and why: The initial path assumption was too shallow because this packet vendors `claude-memory` under the spec-local `external/` tree, not repo root.
- What I would do differently: I would resolve the spec-local external root first on future iterations before using narrower path assumptions.

## Recommended Next Focus
Q7 is the best next target because it complements this iteration's consolidation findings with the token-observability side of the system. Read `get-token-insights/SKILL.md`, `scripts/ingest_token_data.py`, and `templates/dashboard.html` to map how Claudest turns raw token logs into operator-facing analysis and where a comparable dashboard would fit in `Code_Environment/Public`.
