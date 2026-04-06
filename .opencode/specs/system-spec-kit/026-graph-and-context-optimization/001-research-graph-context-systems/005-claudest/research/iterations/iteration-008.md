# Iteration 8: Q10 synthesis matrix

## Focus
This iteration resolved Q10 by rolling iterations 1-7 into one explicit recommendation matrix across the nine requested tracks. The goal was not to gather new source material, but to compress the existing evidence into clear `adopt now` / `prototype later` / `reject` decisions and resolve the remaining tensions between "borrow the pattern" and "copy the subsystem."

## Findings
- **Recommendation matrix**

| Track | Label | Justification |
|---|---|---|
| Marketplace discovery + versioning | `prototype later` | The discovery model is a top-level marketplace catalog plus thin per-plugin manifests, but that layer only matters if Public starts shipping distributable bundles; if it does, keep manifests thin and validate catalog-to-plugin version parity from day one. [SOURCE: external/.claude-plugin/marketplace.json] [SOURCE: external/plugins/claude-memory/.claude-plugin/plugin.json] |
| claude-memory SQLite schema | `prototype later` | The schema is powerful because it stores messages once and ranks active branches via a session/branch graph, but that depends on branch infrastructure Public does not currently maintain. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] |
| recall-conversations BM25/FTS5 cascade | `adopt now` | The portable core is the runtime FTS capability cascade, BM25-on-FTS5 when available, graceful FTS4 degradation, and separate search-vs-browse paths; Public can adopt that search contract now without copying the full branch model. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py] |
| SessionStart context injection | `adopt now` | The part to borrow now is the cached `context_summary` fast path plus deterministic Stop-time summarization, while the exact Claude hook-driven session-selection heuristic stays optional and should not replace Public's spec-folder-aware resume/bootstrap flow. [SOURCE: external/plugins/claude-memory/hooks/memory-context.py] [SOURCE: external/plugins/claude-memory/hooks/sync_current.py] [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py] |
| extract-learnings pipeline + memory-auditor/signal-discoverer | `adopt now` | The four-phase consolidation contract and the auditor/discoverer split are directly transferable and explicitly rule out dumping raw recalled conversation text straight into memory. [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md] [SOURCE: external/plugins/claude-memory/agents/memory-auditor.md] [SOURCE: external/plugins/claude-memory/agents/signal-discoverer.md] |
| get-token-insights ingestion | `adopt now` | The ingestion pipeline already carries the most reusable observability logic: session aggregation, subagent-aware parsing, pricing normalization, cache-tier accounting, and cache-cliff derivation, all independent of the dashboard shell. [SOURCE: external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py] [SOURCE: external/plugins/claude-memory/skills/get-token-insights/SKILL.md] |
| get-token-insights dashboard contract | `adopt now` | The durable value is the JSON contract for KPIs, per-project spend, trends, skill/agent/hook usage, findings, and recommendations; the single-file themed dashboard is just one rendering choice. [SOURCE: external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html] [SOURCE: external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py] |
| Memory hierarchy comparison | `reject` | Public should not import Claudest's extra always-loaded `MEMORY.md` hierarchy or replace its existing memory stack; the only part worth keeping is the placement rubric, and that fits under the extract-learnings/consolidation lane instead of as a second memory system. [SOURCE: external/plugins/claude-memory/README.md] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md] |
| Plugin auto-update | `reject` | Auto-update is only described in README-level `/plugin` runtime flows, while the marketplace and plugin manifests carry no update policy; that makes it Claude-runtime behavior, not portable repository metadata. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json] [SOURCE: external/plugins/claude-memory/.claude-plugin/plugin.json] |

- **Contradictions resolved**
  1. The recall work no longer conflicts with the schema recommendation: adopt the FTS capability cascade now, but leave branch-ranked recall and its schema dependencies in the prototype lane.
  2. The SessionStart work no longer conflicts with Public's existing recovery design: adopt precomputed-summary injection, but not the full Claude hook-push selection model as a replacement for `session_bootstrap()` / `session_resume()`. [SOURCE: external/plugins/claude-memory/hooks/memory-context.py] [SOURCE: external/plugins/claude-memory/hooks/sync_current.py]
  3. The memory-hierarchy comparison no longer competes with extract-learnings: reject the extra hierarchy as a new system, but adopt the placement rubric through the consolidation workflow instead. [SOURCE: external/plugins/claude-memory/README.md] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md]

## Ruled Out
- Treating the nine-track matrix as nine independent imports. The evidence keeps splitting cleanly into "portable pattern" versus "requires missing infrastructure," so several tracks only make sense when scoped that way. [SOURCE: external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py] [SOURCE: external/plugins/claude-memory/skills/extract-learnings/SKILL.md]
- Reopening the prior dead-end around repo-owned auto-update metadata. Iteration 1 already showed the manifests do not encode update policy, so the synthesis keeps that conclusion closed. [SOURCE: external/README.md] [SOURCE: external/.claude-plugin/marketplace.json]

## Dead Ends
- No new dead ends in this iteration. This was a synthesis-only pass over iterations 1-7 plus the progressive synthesis document and findings registry.

## Sources Consulted
- `external/.claude-plugin/marketplace.json`
- `external/plugins/claude-memory/.claude-plugin/plugin.json`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py`
- `external/plugins/claude-memory/hooks/memory-context.py`
- `external/plugins/claude-memory/hooks/sync_current.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md`
- `external/plugins/claude-memory/agents/memory-auditor.md`
- `external/plugins/claude-memory/agents/signal-discoverer.md`
- `external/plugins/claude-memory/skills/get-token-insights/SKILL.md`
- `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py`
- `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html`
- `external/plugins/claude-memory/README.md`
- `external/README.md`

## Reflection
- What worked and why: The prior iterations had already isolated the evidence clearly enough that Q10 was mostly a decision-compression problem, not a discovery problem.
- What did not work and why: The main friction was semantic, not evidentiary; several tracks mixed a reusable pattern with a larger subsystem, so the synthesis had to make that split explicit.
- What I would do differently: I would ask future runs to keep a running "track -> label" scratch table earlier in the loop so the final synthesis can be appended with less reconciliation work.

## Recommended Next Focus
Iterations 9-12 should treat Q10 as answered and move into sequencing: convert this matrix into an implementation-order view that identifies which `adopt now` items are independent, which depend on existing Public packets (FTS, stop-hook tracking, signal extraction), and which `prototype later` items need prerequisites before they can be trialed safely.
