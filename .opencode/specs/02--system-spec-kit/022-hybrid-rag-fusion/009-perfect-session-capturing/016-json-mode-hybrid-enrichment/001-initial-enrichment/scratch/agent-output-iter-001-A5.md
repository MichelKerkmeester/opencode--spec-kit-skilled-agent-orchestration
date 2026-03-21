# Iteration 1: Domain F -- Semantic Quality & Cross-Session Coherence

## Focus
Investigate Q6 (mapped to Q11 + Q12 in dispatch): Which session-types.ts fields are never consumed by templates? Which template placeholders have no data source? How does the system prevent duplicate/contradictory information across memory files for the same spec folder?

## Findings

### F1: OPTIONAL_PLACEHOLDERS Suppress Warnings for 30 Unimplemented Template Sections
The template-renderer.ts (lines 32-53) maintains a hardcoded `OPTIONAL_PLACEHOLDERS` set of 30 placeholder names that suppress "missing template data" warnings. These fall into four categories:
- **Session Integrity Checks** (8 placeholders): `MEMORY_FILE_EXISTS`, `MEMORY_FILE_PATH`, `INDEX_ENTRY_VALID`, `LAST_INDEXED`, `CHECKSUMS_MATCH`, `CHECKSUM_DETAILS`, `NO_DEDUP_CONFLICTS`, `DEDUP_CONFLICT_DETAILS`
- **Memory Classification** (6 placeholders): `MEMORY_TYPE`, `HALF_LIFE_DAYS`, `BASE_DECAY_RATE`, `ACCESS_BOOST_FACTOR`, `RECENCY_WEIGHT`, `IMPORTANCE_MULTIPLIER`
- **Session Deduplication** (3 placeholders): `MEMORIES_SURFACED_COUNT`, `DEDUP_SAVINGS_TOKENS`, `FINGERPRINT_HASH`
- **Postflight Learning Delta** (12 placeholders): `PREFLIGHT_KNOW_SCORE`, `POSTFLIGHT_KNOW_SCORE`, etc.

However, the Memory Classification and Session Deduplication placeholders ARE now populated by `buildMemoryClassificationContext()` and `buildSessionDedupContext()` in memory-metadata.ts, and are spread into the template context at workflow.ts:1088-1090. **These 9 placeholders (MEMORY_TYPE, HALF_LIFE_DAYS, BASE_DECAY_RATE, ACCESS_BOOST_FACTOR, RECENCY_WEIGHT, IMPORTANCE_MULTIPLIER, MEMORIES_SURFACED_COUNT, DEDUP_SAVINGS_TOKENS, FINGERPRINT_HASH) should be REMOVED from OPTIONAL_PLACEHOLDERS** because their warnings are now suppressed when they actually have data sources. If the data source fails silently, the developer will never know because the warning is suppressed.

[SOURCE: .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:32-53]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:121-225]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1088-1090]

### F2: 8 Session Integrity Check Placeholders Have NO Data Source Whatsoever
The first group of OPTIONAL_PLACEHOLDERS -- `MEMORY_FILE_EXISTS`, `MEMORY_FILE_PATH`, `INDEX_ENTRY_VALID`, `LAST_INDEXED`, `CHECKSUMS_MATCH`, `CHECKSUM_DETAILS`, `NO_DEDUP_CONFLICTS`, `DEDUP_CONFLICT_DETAILS` -- are tagged `@planned(V2.2)` and have zero construction sites anywhere in the codebase. No function builds these values, no workflow spreads them into template context. These are phantom placeholders in the template that will always render as empty strings.

[SOURCE: .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:36-38]
[INFERENCE: Grep for these identifiers across scripts/ returned zero hits outside the OPTIONAL_PLACEHOLDERS definition]

### F3: CollectedDataBase Has 15+ Fields With No Template Consumption Path
Cross-referencing CollectedDataBase (session-types.ts:126-186) against SessionData (session-types.ts:544-638) and the template context spread at workflow.ts:1031-1099, these CollectedDataBase fields are ingested but never surface in the final memory file:
- `toolCalls` (ToolCallSummary[]) -- JSON-mode tool call summaries. No template renders individual tool call details with input/output summaries.
- `exchanges` (ExchangeSummary[]) -- JSON-mode conversation highlights. No template uses these rich exchange summaries.
- `_narrativeObservations` -- Captured but not spread to template.
- `_specContextLoaded`, `_gitContextLoaded`, `_relevanceFallback` -- Boolean pipeline-internal flags, never rendered.
- `_capturedAt` -- Capture timestamp, not surfaced in output.
- `_toolCallCount` -- Numeric tool count from captured sessions, separate from TOOL_COUNT.
- `importance_tier` / `importance_tier` (snake_case duplicates) -- Exist for JSON compat but the workflow reads these through normalize helpers, not directly consumed.
- `memory_classification`, `memory_type`, `session_dedup`, `causal_links` and their camelCase variants -- These ARE consumed via `readNamedObject()` in memory-metadata.ts, but only to build derived template context. The raw objects themselves are never spread.

The most significant gap: `toolCalls` and `exchanges` are AI-composed rich session data that the pipeline accepts but silently discards during rendering. This is a semantic quality loss.

[SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:140-143]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1031-1099]

### F4: Cross-Session Dedup Is Entirely AI-Dependent With No Automated Verification
The `buildSessionDedupContext()` function (memory-metadata.ts:171-225) constructs dedup metadata purely from AI-provided JSON input:
- `similar_memories` / `similarMemories` -- an array the AI is expected to populate with memory IDs it considers similar. No MCP query or database lookup is performed to validate these IDs actually exist.
- `fingerprint_hash` -- If the AI doesn't provide one, a SHA1 fallback is generated from `sessionId + memoryTitle + summary`. But this fingerprint is never compared against existing memories.
- `dedup_savings_tokens` -- Passthrough from AI input, never validated or computed.

**There is no automated mechanism to:**
1. Query the memory database for existing memories in the same spec folder before saving
2. Compare fingerprint hashes against prior memories
3. Detect semantic overlap or contradiction between the new memory and existing ones
4. Warn or block when a contradictory memory would be created

The `SIMILAR_MEMORIES` array is passed to the template but the template section for it is in OPTIONAL_PLACEHOLDERS (`NO_DEDUP_CONFLICTS`, `DEDUP_CONFLICT_DETAILS`), meaning even if populated, no dedup conflict information renders.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:171-225]
[SOURCE: .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:38]

### F5: Causal Links Are Pass-Through With No Graph Validation
The `buildCausalLinksContext()` function (memory-metadata.ts:227-237) reads five causal relationship arrays from AI-provided JSON:
- `CAUSED_BY`, `SUPERSEDES`, `DERIVED_FROM`, `BLOCKS`, `RELATED_TO`

These are string arrays of memory identifiers. No validation checks:
1. Whether referenced memory IDs/titles actually exist in the memory index
2. Whether the relationship is logically consistent (e.g., a memory can't both supersede and be derived_from the same memory)
3. Whether the graph would contain cycles
4. Whether the AI-provided links align with actual memory_causal_link records in the MCP database

The pipeline captures the intent for causal links but doesn't connect to the MCP `memory_causal_link` tool or the causal_edges table in the database. The template renders these links as text, but there's no mechanism to ensure they're actionable.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-237]

### F6: Observation Dedup Only Operates Within a Single Memory File
The quality-scorer.ts (lines 233-248) includes an `observation_dedup` dimension that checks for duplicate observation titles within a single memory file's observations array. However, this does NOT check across memory files. Two separate saves for the same spec folder can produce memories with identical observations, and no mechanism detects or merges them. The `dedupRatio` calculation is purely intra-document.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:233-248]

### F7: V12 Topical Coherence Validation Is the Only Cross-Reference Check
The `validate-memory-quality.ts` (line 611) implements a V12 "topical coherence" rule that compares memory content against the spec folder's `spec.md` trigger phrases. This is the sole automated check that connects a new memory to existing spec-folder context. But it only validates topical alignment -- it does NOT check for contradictions with existing memories, nor does it detect redundancy.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:611-628]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` (full file, 639 lines)
- `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts` (full file, 224 lines)
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` (full file, 331 lines)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 1020-1099, template context construction)
- Grep for dedup/causal/coherence across scripts/ directory

## Assessment
- New information ratio: 1.0
- Questions addressed: Q11 (session-types fields vs template consumption), Q12 (cross-session dedup/contradiction prevention)
- Questions answered: Q11 (fully), Q12 (fully)

## Reflection
- What worked and why: Systematic cross-referencing of type definitions (session-types.ts), template engine (template-renderer.ts OPTIONAL_PLACEHOLDERS), data construction (memory-metadata.ts builders), and template binding (workflow.ts spread). Following the data flow end-to-end revealed both the supply-side gaps (fields with no consumer) and demand-side gaps (placeholders with no supplier).
- What did not work and why: N/A -- first iteration, all approaches were productive.
- What I would do differently: Could also check the actual .md template files to see exactly which placeholders exist in the template markup, not just in the renderer code. This would catch any placeholders in templates that aren't even in OPTIONAL_PLACEHOLDERS.

## Recommended Next Focus
Domain A (Pipeline Data Integrity): Trace field propagation through input-normalizer.ts and collect-session-data.ts to find silent drops/mutations. The current iteration revealed the template-side gaps; the next should focus on the input-side integrity to find where data gets lost before it even reaches the template.
