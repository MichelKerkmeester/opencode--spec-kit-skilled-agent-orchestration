# Phrasing Audit — Memory→Behavioral Language

> Working diff target for `spec.md` REQ-002, REQ-003, REQ-004, REQ-007, REQ-008. Each row is `file:line | current text | proposed text | rationale`. Implementation phase ships these in PRs grouped by surface class (A markdown / B1 tool descriptions / B2 runtime outputs).
>
> **Scope guard**: only prose / docs / output strings change. No identifier — tool name, command name, frontmatter key, SQL table, handler filename, folder name — gets renamed. See `spec.md` §3 for the full out-of-scope list.

## Vocabulary key

When this audit replaces "memory / memories", it picks the most accurate concrete noun for the local context:

| Concrete noun | Use when describing… |
|---|---|
| **spec-doc record** | A row in `memory_index` produced by indexing a spec-folder markdown file. Singular unit of indexed continuity. |
| **indexed continuity** | The entire body of indexed spec-folder docs as a corpus. Plural. |
| **constitutional rule** | A row in `memory_index` with `importance_tier='constitutional'`. Always-surface, never-decay. |
| **packet** / **spec folder** | The folder unit (`specs/<NNN-name>/`) itself. |
| **continuity update** | The contents of a `_memory.continuity` YAML frontmatter block, or the `description.json` / `graph-metadata.json` refresh produced by `generate-context.js`. |
| **session continuity** | The recovered state when `/spec_kit:resume` walks `handover.md → _memory.continuity → spec docs`. |
| **causal-graph node** | A row in `causal_edges` (decision-lineage relationships). |
| **canary**: keep "memory" verbatim | Cognitive-science literature: Miller's-Law `working_memory` table, FSRS doc-comments saying "long-term memory" / "working memory", Collins-Loftus "spreading activation" terms. These are cited literature; do not soften. |

---

## Surface class A — Markdown prose

### A.1 SKILL.md

| Line | Current | Proposed | Rationale |
|---|---|---|---|
| `SKILL.md:623` | `**Decay scoring** - FSRS v4 power-law model; recent memories rank higher` | `**Decay scoring** - FSRS v4 power-law model; recent spec-doc records rank higher than older ones` | "memories" → "spec-doc records"; the system ranks indexed records, not abstract memories. |
| `SKILL.md:141` | `"MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]}` | (no change — this is the smart-router internal intent label, not user-facing prose) | Internal config; reader is the router code, not a contributor. |
| `SKILL.md:503-506` (Memory Save Rule heading + body) | `Trigger: /memory:save, "save context", or "save memory"` | `Trigger: /memory:save, "save context", or "save continuity"` (slash command name unchanged) | "save memory" trigger phrase is documentation prose; the slash command name `/memory:save` stays. |

### A.2 references/memory/memory_system.md

| Line | Current | Proposed | Rationale |
|---|---|---|---|
| `:34` | `**Decay scoring** - Recent memories rank higher than old ones` | `**Decay scoring** - Recent indexed spec-doc records rank higher than older ones` | Same rewrite as `SKILL.md:623`. |
| Section "Indexable Content Sources" table | Column header `Memory Type` | Column header `Record category` | Column describes record classification (per-type / meta-cognitive / etc.), not "memory type". |

### A.3 references/debugging/troubleshooting.md

| Line | Current | Proposed | Rationale |
|---|---|---|---|
| `:124` | `**Memory folder empty** \| No previous sessions found \| Save context first via skill workflow` | `**Indexed-continuity store empty** \| No previous sessions found \| Save context first via skill workflow` | "Memory folder" is ambiguous; this row describes the SQLite + spec-doc index. |
| `:135` | `Recent memories not prioritized \| Decay rate too high \| Check tier-specific rates (normal=0.80, temporary=0.60)` | `Recent spec-doc records not prioritized \| Decay rate too high \| Check tier-specific rates (normal=0.80, temporary=0.60)` | Same rewrite. |
| `:237` | `// List recent memories` | `// List recent indexed spec-doc records` | Comment in a code example. |

### A.4 references/validation/decision_format.md

| Line | Current | Proposed | Rationale |
|---|---|---|---|
| `:281` | `\| 2024-01-15 10:32 \| MEMORY CONTEXT \| PASS \| HIGH \| 0.25 \| Loaded 3 memories \|` | `\| 2024-01-15 10:32 \| MEMORY CONTEXT \| PASS \| HIGH \| 0.25 \| Loaded 3 spec-doc records (e.g., spec.md from packet 026-…, decision-record.md from packet 023-…) \|` | This is the example the user flagged ("load recent memories — say which ones"). Change the format-string template to name the actual sources. |

### A.5 constitutional/README.md

| Line | Current | Proposed | Rationale |
|---|---|---|---|
| `:42` (added during PR1 application) | `The constitutional/ directory contains constitutional memory docs that are always surfaced…` | `The constitutional/ directory contains constitutional rules that are always surfaced…` | Same paragraph as :44; paragraph coherence. |
| `:44` | `Think of constitutional memories as the "system prompt" for your memory system: rules that apply globally and should never be forgotten.` | `Think of constitutional rules as the "system prompt" for your indexed continuity: rules that apply globally and should never be forgotten.` | "constitutional memories" → "constitutional rules"; "memory system" → "indexed continuity". |
| `:46` (added during PR1 application) | `For spec-folder continuity, constitutional memories are supporting guidance…` | `For spec-folder continuity, constitutional rules are supporting guidance…` | Same paragraph; paragraph coherence. |
| `:189` | `// 1. Fetches ALL constitutional memories first` | `// 1. Fetches ALL constitutional rules first` | Code comment in walkthrough. |
| `:674` | `**Symptom:** memory_match_triggers() doesn't return your memory` | `**Symptom:** memory_match_triggers() doesn't return your constitutional rule` | Diagnostic row about constitutional-tier triggers. |

### PR1 application notes (added 2026-04-26 after edits applied)

The following lines were touched during PR1 application even though they were not in the original audit grid above. They appeared adjacent to grid-listed lines and shared the same abstract-memory pattern, so paragraph coherence required including them in the same Edit call:

- `references/memory/memory_system.md:32` — "Find memories by meaning" → "Find indexed spec-doc records by meaning"
- `references/memory/memory_system.md:35` — "Save/restore memory state snapshots" → "Save/restore indexed-continuity state snapshots"
- `references/debugging/troubleshooting.md:125` — "Wrong memory loaded" → "Wrong spec-doc record loaded"
- `references/debugging/troubleshooting.md:128` — "No memories found matching" → "No spec-doc records found matching"
- `references/debugging/troubleshooting.md:134` — "Old memories ranked too high" → "Old spec-doc records ranked too high"
- `constitutional/README.md:42` — same-paragraph extension above
- `constitutional/README.md:46` — same-paragraph extension above

Verified clean by `grep -nE '(your|the|recent|old|all)\s+(\w+\s+)?memor(y|ies)'` against the five PR1 files post-edit. PR2–PR5 grids carry forward unchanged.

### A.6 feature_catalog/feature_catalog.md (highest-density surface — REQ-008)

| Line | Current | Proposed | Rationale |
|---|---|---|---|
| `:905` (causal-graph statistics paragraph — 4 abstract uses in one paragraph) | `This gives you a health report on the web of connections between your memories. It tells you how many connections exist, how strong they are and whether enough memories are linked together. If too many memories are isolated with no connections, the system warns you because it means the relationship network is too thin to be useful for tracing decisions.` | `This gives you a health report on the web of connections between your spec-doc records. It tells you how many causal-graph edges exist, how strong they are, and whether enough spec-doc records are linked together. If too many records are isolated with no edges, the system warns you because it means the decision-lineage network is too thin to be useful for tracing decisions.` | "your memories" / "memories are linked" / "memories are isolated" → "spec-doc records" / "causal-graph edges" / "decision-lineage". |
| `:1177, 08--bug-fixes-and-data-integrity/06:23` | `**E2: Wrong-memory fallback:** extraction-adapter.ts fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory.` | `**E2: Wrong-record fallback:** extraction-adapter.ts fell back to resolving the most-recent spec-doc record ID on entity resolution failure, silently linking to the wrong record.` | "Wrong-memory fallback" → "Wrong-record fallback"; "memory ID" → "spec-doc record ID". |
| `:2663, 13--memory-quality-and-indexing/06:13` | `When you save a new memory that is very similar to one already stored, the system decides what to do with the overlap. If the two are nearly identical, it merges them into one stronger memory. If the new one contradicts the old one, the old one is retired and the new one takes over. If they are different enough, both are kept side by side. This keeps your memory collection clean and up to date instead of cluttered with redundant notes.` | `When you save a new spec-doc record that is very similar to one already stored, the system decides what to do with the overlap. If the two are nearly identical, it merges them into one stronger record. If the new one contradicts the old one, the old one is retired and the new one takes over. If they are different enough, both are kept side by side. This keeps your indexed continuity clean and up to date instead of cluttered with redundant entries.` | Reconsolidation paragraph — "memory" → "spec-doc record"; "memory collection" → "indexed continuity"; "redundant notes" → "redundant entries". |
| `:3362, 14--pipeline-architecture/19:13` | `Creating a numerical fingerprint for each memory requires calling an external service that can sometimes be unavailable. When that service fails, the memory is saved without a fingerprint and queued for a retry. […] this way, a temporary service outage does not permanently prevent your memories from being fully searchable.` | `Creating a numerical fingerprint (embedding) for each spec-doc record requires calling an external service that can sometimes be unavailable. When that service fails, the record is saved without an embedding and queued for a retry. […] this way, a temporary service outage does not permanently prevent your indexed continuity from being fully searchable.` | "fingerprint for each memory" → "fingerprint (embedding) for each spec-doc record". Note: "embedding" is the technical term for the fingerprint; spelling it out is a clarity bonus. |
| `:4208` | `The system has two ways to save memories: a standard path and a faster "atomic" path. […] make sure both […] give you different information depending on which path ran.` | `The system has two ways to save a spec-doc record: a standard path and a faster "atomic" path. […] make sure both […] give you the same information depending on which path ran.` | Save paths — singular record per save invocation. |
| `feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md:13` | (same paragraph as `:905`) | (apply same rewrite as `:905`) | Catalog and source share text. |
| `feature_catalog/10--graph-signal-activation/02:23` | `Similarity-neighbor hydration batches memory detail fetches with a single WHERE id IN (...) query` | `Similarity-neighbor hydration batches spec-doc-record detail fetches with a single WHERE id IN (...) query` | "memory detail" → "spec-doc-record detail" in code-mechanics description. |
| `feature_catalog/17--governance/05:28` | `cross-checks handoff messages against recent memory` | `cross-checks handoff messages against recent indexed continuity` | Continuation-validation workflow. |

### A.7 Slash-command bodies (`.opencode/command/memory/{save,search,learn,manage}.md`)

| File / area | Current | Proposed | Rationale |
|---|---|---|---|
| `save.md` description (frontmatter) | `description: Save current conversation context into canonical spec-doc continuity surfaces with semantic indexing` | (no change — already concrete and behavioral) | This description is already good; surface listed is "spec-doc continuity surfaces". |
| `search.md` description | `description: Unified continuity retrieval and analysis - canonical spec-doc context search, epistemic baselines, causal graph, ablation studies, and dashboards` | (no change — already concrete) | "canonical spec-doc context search" is the right level. |
| `learn.md` description | `description: Create and manage constitutional memories — always-surface rules that appear at the top of every search result.` | `description: Create and manage constitutional rules — always-surface entries that appear at the top of every search result.` | "constitutional memories" → "constitutional rules"; "rules that … rules" was redundant. |
| `manage.md` description | `description: Manage memory database maintenance and lifecycle tasks - stats, scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest operations` | `description: Manage indexed-continuity database maintenance and lifecycle tasks - stats, scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest operations` | "memory database" → "indexed-continuity database". |
| All four `.md` body sections | scattered "memory" prose; audit each body in implementation phase against vocabulary key | per-occurrence rewrite | Body audits are mechanical once the description-line patterns above are agreed. |

### A.8 Cross-cutting top-doc triad (CLAUDE.md, AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md)

The triad references memory tools by their canonical names (which stay) at `:141, :164, :170` (CLAUDE / AGENTS), `:181, :213, :219` (Barter), `:160, :193, :199` (fs-enterprises). The PROSE around these references is what gets re-phrased (the tool names in code-fences stay verbatim). Per REQ-006, edits commit in lockstep across all four (Barter is cross-repo).

| File:line | Current | Proposed |
|---|---|---|
| `CLAUDE.md:144` | `Save context: \`/memory:save\` OR compose JSON → \`generate-context.js --json '<data>' [spec-folder]\` → Auto-indexed` | `Save context: \`/memory:save\` OR compose JSON → \`generate-context.js --json '<data>' [spec-folder]\` → Auto-indexed into the spec-doc continuity store` |
| `CLAUDE.md:226` | `**Full save (DB + embeddings + graph):** \`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js\`` | `**Full save (indexed continuity DB + embeddings + causal graph):** \`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js\`` |
| `CLAUDE.md:230` | `**Indexing:** For immediate MCP visibility after save: \`memory_index_scan({ specFolder })\` or \`memory_save()\`` | `**Indexing:** For immediate MCP visibility after save (so subsequent searches see the new record): \`memory_index_scan({ specFolder })\` or \`memory_save()\`` |

(Apply same rewrites in AGENTS.md / AGENTS_Barter.md / AGENTS_example_fs_enterprises.md at the equivalent line numbers — content propagates verbatim per the synced-triad rule.)

### A.9 Agent definitions (`.claude/agents/*.md`, `.opencode/agent/*.md`)

| File | Pattern | Action |
|---|---|---|
| `context.md`, `deep-research.md`, `deep-review.md`, `orchestrate.md`, `review.md` | Each agent definition references `memory_context()` / `memory_search()` / `memory_match_triggers()` in workflow prose ("Do NOT redundantly call \`memory_context\` …"). Tool names stay verbatim (REQ-001). Surrounding prose ("memory operations" / "your memory" / "the memory system") gets the standard rewrite. | Apply vocabulary-key replacements to surrounding prose; leave backtick-quoted tool names alone. |

### A.10 Manual testing playbook (`MANUAL_TESTING_PLAYBOOK.md` — 62 hits)

The playbook scenarios script tool calls (e.g., "run `memory_search('semantic search')`"). Tool calls stay literal. Prose around them ("Verify that recent memories are returned") gets re-phrased per vocabulary key. ~62 occurrences, mostly mechanical.

---

## Surface class B1 — MCP tool description strings (`mcp_server/tool-schemas.ts`)

These strings ship to AI agents at every tool-list call. ~10 of the 21 tools have abstract phrasing in their `description:` field. The `name:` field stays exactly as-is.

| Tool | Current `description:` (excerpt) | Proposed `description:` (excerpt) |
|---|---|---|
| `memory_context` (`:48`) | `[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. […]` | `[L1:Orchestration] Unified entry point for spec-doc continuity retrieval with intent-aware routing. START HERE for most context-retrieval operations across indexed spec docs and constitutional rules. […]` |
| `memory_search` (`:55`) | `[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. […]` | `[L2:Core] Search the indexed spec-doc continuity store semantically using vector similarity. Returns ranked records (one record = one indexed spec-doc surface) with similarity scores. Constitutional tier rules are ALWAYS included at the top of results (~2000 tokens max), regardless of query. […]` |
| `memory_search` `sessionId` param (`:81`) | `Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).` | `Session identifier for working-memory cache and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate spec-doc records from being returned in the same session (~50% token savings on follow-up queries).` |
| `memory_search` `enableDedup` param (`:86`) | `Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.` | `Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent spec-doc records.` |
| `memory_search` `includeContiguity` param (`:91`) | `Include adjacent/contiguous memories in results` | `Include adjacent/contiguous spec-doc records in results (records from the same packet, neighboring sections)` |
| `memory_search` `includeConstitutional` param (`:95`) | `Include constitutional tier memories at top of results (default: true)` | `Include constitutional tier rules at top of results (default: true)` |
| `memory_save` description | (similar pattern) | "Save … into the indexed spec-doc continuity store" |
| `memory_match_triggers` description | (similar pattern) | "Match trigger phrases against indexed spec-doc records and surface the matching records (no embedding round-trip)" |
| `memory_list` description | (similar pattern) | "List indexed spec-doc records by spec-folder, tier, or recency" |
| `memory_stats` description | (similar pattern) | "Aggregate statistics for the indexed spec-doc continuity store (counts, tier distribution, freshness)" |
| `memory_health` description | (similar pattern) | "Health diagnostics for the indexed-continuity database (FTS sync, embedding-retry stats, divergent aliases)" |

(Implementation phase audits all 21 tool descriptions against the vocabulary key; only ~10 need touches per current grep.)

**Working-memory cognitive-science term**: "working memory" inside `tool-schemas.ts:81` (`sessionId` description) is a Miller's-Law literature reference and stays. The replacement above moves "memories" → "spec-doc records" but keeps "working memory" verbatim.

---

## Surface class B2 — Runtime output strings

These are the user-visible messages tools emit at run-time. Per the user's "load recent memories — say which ones" example, REQ-003 mandates that runtime outputs name specific spec folders, files, or named-source counts.

### B2.1 `memory_context` and `memory_search` result formatters

Most likely live in `mcp_server/lib/.../formatters/` (response shaping) or inline in `mcp_server/handlers/memory-context.ts` / `memory-search.ts`. Implementation phase needs to grep for "Loaded N memor" / "Found N memor" / "Returning N memor" patterns in handler + formatter source files.

| Pattern | Current (illustrative) | Proposed |
|---|---|---|
| Result-count summary | `Loaded 3 memories` | `Loaded 3 spec-doc records: implementation-summary.md from packet 026-…, decision-record.md from packet 023-…, handover.md from packet 011-…` |
| Empty-result message | `No memories found for this query` | `No spec-doc records matched this query in the indexed continuity store` |
| Constitutional tier summary | `Including 5 constitutional memories at top of results` | `Including 5 constitutional rules at top of results (always-surface tier)` |
| Save acknowledgment | `Saved memory to spec folder` | `Wrote continuity update to implementation-summary.md (\`_memory.continuity\` block); refreshed description.json + graph-metadata.json` |
| Telemetry / log message | `Failed to load memory entities` (`mcp_server/lib/search/entity-linker.ts:552`) | `Failed to load spec-doc-record entities` |

### B2.2 Cognitive subsystem doc-strings (REQ-007 scope)

The cognitive subsystem identifiers stay verbatim (Miller's-Law `working_memory` table, FSRS constants, Collins-Loftus terms). Doc-strings inside `cognitive/` that reference *spec-kit rows passed as parameters* — not literature — get clarified to "spec-doc record":

| File:line | Current JSDoc | Proposed JSDoc |
|---|---|---|
| `fsrs-scheduler.ts:187` | `Create initial FSRS parameters for a new memory` | `Create initial FSRS parameters for a new spec-doc record` |
| `fsrs-scheduler.ts:318, 342, 343, 448` | `@param Memory context_type` | `@param Continuity-row context_type` |
| `prediction-error-gate.ts:198, 283` | `Evaluate whether a new memory should create, update, or supersede` | `Evaluate whether a new spec-doc record should create, update, or supersede an existing record` |
| `temporal-contiguity.ts:114, 136` | log: `Invalid anchor timestamp for memory N` | log: `Invalid anchor timestamp for spec-doc record N` |
| `adaptive-ranking.ts:15, 27` | `Stored adaptive feedback event for a single memory` | `Stored adaptive feedback event for a single spec-doc record` |

**Explicitly stays (cognitive-science loanwords)**:
- `working-memory.ts` — entire file, including SQL table name `working_memory` and Miller's-Law citation at line 29
- `co-activation.ts` — Collins-Loftus 1975 spreading-activation terminology
- All `FSRS_*` algorithmic constants in `fsrs-scheduler.ts`
- "long-term memory" / "working memory" doc comments in `fsrs-scheduler.ts` (lines 9, 13–15, 187, 244–245)

---

## Surface class — what's NOT in the audit (out-of-scope reminder)

| Identifier class | Examples | Disposition |
|---|---|---|
| MCP tool names | `memory_search`, `memory_save`, `memory_context`, `memory_match_triggers`, `memory_index_scan`, all 21 | UNCHANGED |
| Slash command names | `/memory:save`, `/memory:search`, `/memory:learn`, `/memory:manage` | UNCHANGED |
| Frontmatter keys | `_memory:`, `_memory.continuity` | UNCHANGED |
| SQL tables | `memory_index`, `memory_fts`, `memory_lineage`, `vec_memories`, all 8 | UNCHANGED |
| Handler filenames | `memory-search.ts`, `memory-save.ts`, all 17 | UNCHANGED |
| Folder names | `references/memory/`, `scripts/dist/memory/` | UNCHANGED |
| `mcp__spec_kit_memory` MCP server registration | `opencode.json`, `.utcp_config.json` | UNCHANGED |
| Cognitive `working_memory` SQL table | `mcp_server/lib/cognitive/working-memory.ts` | UNCHANGED (Miller's-Law literature) |
| FSRS algorithmic constants | `FSRS_FACTOR`, `FSRS_DECAY`, etc. | UNCHANGED |
| Trigger phrases that match user speech | "save memory", "save context" registered as trigger phrases in skill-advisor scoring | UNCHANGED (these match user input, not what we display back to user) |

---

## Implementation phase suggestions

Once this audit is reviewed and red-lined:

1. **PR1 (surface A.1–A.5 — top-level skill prose)**: SKILL.md, references/, debugging, validation, constitutional/README.md. ~10 file edits, low-risk.
2. **PR2 (surface A.6 — feature_catalog + manual_testing_playbook)**: dense single-file edits. ~30+ paragraph rewrites. Highest reviewer effort; warrants its own PR.
3. **PR3 (surface A.7–A.10 + cross-cutting)**: slash-command bodies + agent definitions + synced top-doc triad. Triad commit must propagate to Barter cross-repo.
4. **PR4 (surface B1 — MCP tool descriptions)**: `tool-schemas.ts` `description:` field rewrites. ~10 string edits in one file.
5. **PR5 (surface B2 — runtime outputs + cognitive doc-strings)**: handler / formatter output strings + cognitive JSDoc. ~10–20 file edits; requires snapshot-test updates.

PR1, PR2, PR4 are independent. PR3 has the triad cross-repo coordination requirement. PR5 has the snapshot-test risk. Linear sequencing optional; pure-prose PRs (1, 2, 3, 4) can land in any order.
