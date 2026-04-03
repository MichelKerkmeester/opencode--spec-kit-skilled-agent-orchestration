# Iteration 9: Deep-Read validate-memory-quality.ts (V1-V14 Rules)

## Focus
Exhaustive documentation of every validation rule in `validate-memory-quality.ts`, including trigger conditions, severity classification, disposition (blockOnWrite / blockOnIndex), and specific interaction patterns with JSON-mode saves.

## Findings

### 1. Rule Metadata Architecture (lines 23-157)

The validation system defines 14 rules (V1-V14) with a typed metadata registry `VALIDATION_RULE_METADATA`. Each rule has:
- `ruleId`: QualityRuleId (V1-V14)
- `severity`: 'low' | 'medium' | 'high'
- `blockOnWrite`: boolean -- if true, the memory file is NOT written to disk
- `blockOnIndex`: boolean -- if true, the file is written but NOT indexed into MCP
- `appliesToSources`: 'all' | readonly KnownDataSource[] -- currently ALL rules apply to ALL sources

**Critical finding**: `appliesToSources` is set to `'all'` for every single rule. There is NO source-specific rule differentiation. This means JSON-mode saves (`_source: 'file'`) face the exact same validation gauntlet as captured-session saves, despite having fundamentally different data shapes.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:44-157]

### 2. Disposition Engine (lines 588-618)

The `determineValidationDisposition()` function computes one of three outcomes:
- `abort_write` -- at least one failed rule has `blockOnWrite: true`
- `write_skip_index` -- no write-blockers, but at least one failed rule has `blockOnIndex: true`
- `write_and_index` -- all failed rules are soft (low severity)

Hard-block rules (blockOnWrite=true): V1, V3, V8, V9, V11, V13
Index-block rules (blockOnIndex=true, blockOnWrite=false): V2, V12

The `shouldBlockWrite()` and `shouldBlockIndex()` functions (lines 578-586) check `ruleAppliesToSource()` before blocking, BUT since all rules have `appliesToSources: 'all'`, this gate is effectively a no-op.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:588-618]

### 3. V1: Placeholder Leakage in Durable Fields (HIGH, blocks write+index)

**Trigger**: Any of `decisions`, `next_actions`, `blockers`, `readiness` fields contain `[TBD]` in the rendered frontmatter.
**Check**: Regex `^field:.*\[TBD\]` per field (line 642-645).
**JSON-mode interaction**: When JSON-mode saves provide `keyDecisions` but the template renderer fails to populate the `decisions` frontmatter field (because the extractor returns empty data), the template may emit `[TBD]` placeholders. This is a **primary failure path** for JSON-mode.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:642-652]

### 4. V2: Placeholder with Tool Evidence (MEDIUM, blocks index only)

**Trigger**: `[N/A]` appears anywhere in content AND `tool_count > 0`.
**Check**: Regex `/\[N\/A\]/i` combined with tool count from frontmatter or markdown table (lines 654-661).
**JSON-mode interaction**: If the JSON payload includes `toolCalls` data that gets counted, but the template renders `[N/A]` for sections where no conversation data was extracted, V2 fires. This is a **secondary failure path** -- the memory gets written but is invisible to search.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:654-661]

### 5. V3: Malformed spec_folder (HIGH, blocks write+index)

**Trigger**: `spec_folder` frontmatter value contains `**`, `*`, `[`, or "Before I proceed".
**Check**: Regex on extracted spec_folder string (lines 663-669).
**JSON-mode interaction**: Low risk for JSON-mode since `specFolder` comes from CLI argument or payload field, not from AI-generated conversation text. Rarely fires on structured input.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:663-669]

### 6. V4: Fallback Decision Text (LOW, soft diagnostic)

**Trigger**: Content matches `/No (specific )?decisions were made/i`.
**JSON-mode interaction**: HIGH relevance. When `keyDecisions` in JSON payload fails to flow through to the rendered template (due to extractor gaps), the template emits fallback text like "No specific decisions were made", triggering V4. While V4 itself is soft, it is a **canary signal** that the decision pipeline is broken for JSON-mode.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:672-677]

### 7. V5: Sparse Trigger Phrases (LOW, soft diagnostic)

**Trigger**: `tool_count >= 5` AND `trigger_phrases` list in frontmatter is empty.
**JSON-mode interaction**: Moderate risk. The trigger phrase extractor (`extractTriggerPhrases`) operates on rendered content. If the template produces thin content from JSON-mode data, the trigger extractor finds nothing to extract. However, V5 only fires when combined with high tool count.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:679-685]

### 8. V6: Template Placeholder Remnants (LOW, soft diagnostic)

**Trigger**: Any of 8 specific placeholder patterns detected in content (after stripping code blocks):
- `/100` dangling score denominators
- `Confidence: %` with no value
- Empty preflight score table cells
- Empty preflight timestamp cells
- Empty readiness value
- Template instructional banner leakage
- Template configuration comment leakage
- Template footer leakage

**JSON-mode interaction**: HIGH relevance. When the template renderer receives empty/null values from extractors that failed to process JSON-mode data, placeholder patterns leak into the rendered output. The `/100` and empty table cell patterns are the most common JSON-mode failures because preflight/postflight scores from JSON payload may not reach the template variables.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:178-187, 687-693]

### 9. V7: Contradictory Tool State (LOW, soft diagnostic)

**Trigger**: `tool_count === 0` in frontmatter/table BUT content contains execution signal patterns (`**Tool:`, `| Tool Executions | N |` with N>0, `tool_calls`).
**JSON-mode interaction**: When JSON payload includes `toolCalls` array, the workflow patches `TOOL_COUNT` from the captured evidence count (workflow.ts line 1038-1043). This usually prevents V7 from firing. Low risk for JSON-mode.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:695-700]

### 10. V8: Foreign Spec Contamination (HIGH, blocks write+index)

**Trigger**: Three sub-checks, any of which can fail V8:
1. **Frontmatter foreign**: `trigger_phrases` or `key_topics` contain spec IDs not in the allowed set
2. **Body dominance**: A foreign spec ID appears >= 3 times AND >= (current spec mentions + 2)
3. **Body scatter**: >= 2 distinct foreign spec IDs each appearing 1-2 times

**Allowed set** (lines 524-555): Current spec ID + all ancestor IDs from path + child phase folder IDs + `related_specs` from spec.md.

**JSON-mode interaction**: CRITICAL. When the JSON `sessionSummary` or `keyDecisions` reference related spec folders (common in cross-cutting work), those references pass through contamination cleaning but then appear in the rendered memory body. If the allowed set does not include them, V8 triggers a hard block. This is the single most reported failure mode for JSON-mode saves doing cross-phase work.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:701-775]

### 11. V9: Contaminated Title (HIGH, blocks write+index)

**Trigger**: Title matches any of 4 contamination patterns:
- Template instructional heading (e.g., "to promote a memory")
- Placeholder bracket title (e.g., "[Untitled]")
- Generic stub title (e.g., "untitled", "draft", "todo", "tbd")
- Spec-ID-only title (e.g., "012-memory-save-quality-pipeline")

**JSON-mode interaction**: Low risk. JSON-mode saves usually provide a `sessionSummary` that becomes the title candidate. The title builder has multiple fallback layers (preferredMemoryTask, specTitle, folderBase). Only fires if ALL title sources produce contaminated output.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:777-783, 194-199]

### 12. V10: Session Source Mismatch (LOW, soft diagnostic)

**Trigger**: `filesystem_file_count` and `captured_file_count` frontmatter values diverge by >= 2x ratio AND >= 5 absolute difference, with neither being 0.
**JSON-mode interaction**: Minimal. JSON-mode saves don't typically produce both filesystem and captured file counts.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:785-794]

### 13. V11: API Error Content Leakage (HIGH, blocks write+index)

**Trigger**: Three sub-checks:
- Description contains API error pattern (`API Error: NNN`) or JSON error pattern
- Title contains API error patterns
- More than 50% of trigger phrases match error vocabulary

**JSON-mode interaction**: Low risk for well-formed JSON input. Only fires if the AI accidentally includes API error messages in `sessionSummary` or `keyDecisions`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:796-816]

### 14. V12: Topical Coherence (MEDIUM, blocks index only)

**Trigger**: Zero overlap between rendered memory content and the spec folder's `trigger_phrases` from `spec.md`. Skipped for files in `memory/` directories or known spec doc filenames.
**JSON-mode interaction**: Moderate risk. If the spec's `spec.md` has well-defined trigger phrases but the JSON payload's content (after rendering) uses different terminology, V12 flags it. This is especially problematic for research-focused sessions that use broader vocabulary than the spec's trigger phrases.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:818-872]

### 15. V13: Frontmatter Integrity and Content Density (HIGH, blocks write+index)

**Trigger**: Two sub-checks:
1. YAML syntax error in frontmatter (malformed YAML)
2. Body content has fewer than 50 non-whitespace characters after stripping frontmatter and YAML code blocks

**JSON-mode interaction**: HIGH relevance. When extractors fail to populate template variables from JSON data, the rendered body may contain only empty headings and whitespace, falling below the 50-character threshold. This is a **primary hard-block** for thin JSON-mode saves.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:874-895]

### 16. V14: Status/Percentage Contradiction (LOW, soft diagnostic)

**Trigger**: `status` is "complete" but `percentage` is < 100 in frontmatter.
**JSON-mode interaction**: Minimal. These fields come from session metadata, not from JSON payload content.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:897-916]

## Summary: JSON-Mode Failure Risk by Rule

| Rule | Severity | Block Type | JSON-Mode Risk | Failure Mechanism |
|------|----------|------------|----------------|-------------------|
| V1   | HIGH     | write+index | HIGH | Empty extractors -> template placeholders [TBD] |
| V2   | MEDIUM   | index only | MEDIUM | [N/A] with tool evidence from JSON toolCalls |
| V3   | HIGH     | write+index | LOW | Structured input prevents malformed spec_folder |
| V4   | LOW      | soft | HIGH (canary) | Fallback decision text from empty decision pipeline |
| V5   | LOW      | soft | MODERATE | Thin rendered content -> empty trigger extraction |
| V6   | LOW      | soft | HIGH | Empty template variables -> placeholder remnants |
| V7   | LOW      | soft | LOW | Workflow patches TOOL_COUNT from JSON evidence |
| V8   | HIGH     | write+index | CRITICAL | Cross-spec references in JSON data -> contamination block |
| V9   | HIGH     | write+index | LOW | Multiple title fallback layers prevent this |
| V10  | LOW      | soft | MINIMAL | JSON-mode doesn't produce dual file counts |
| V11  | HIGH     | write+index | LOW | Only with malformed JSON including API errors |
| V12  | MEDIUM   | index only | MODERATE | Different vocabulary between spec and JSON content |
| V13  | HIGH     | write+index | HIGH | Empty extractors -> thin body below 50 chars |
| V14  | LOW      | soft | MINIMAL | Metadata fields, not content-driven |

## Ruled Out
None -- this iteration was pure code reading with no dead-end searches.

## Dead Ends
None discovered.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` (lines 1-998, complete file)
- `.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts` (lines 8-18, KnownDataSource type)

## Assessment
- New information ratio: 1.0
- Questions addressed: ["How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?"]
- Questions answered: ["How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?" -- V8 already extracts allowed IDs from path ancestors, child phase folders, and related_specs. The gap is that JSON payload content referencing specs NOT in these lists gets blocked.]

## Reflection
- What worked and why: Reading the complete validation file line-by-line yielded full rule inventory. The metadata registry pattern made it efficient to catalog all rules at once.
- What did not work and why: N/A -- single-file deep read was the right approach.
- What I would do differently: Would cross-reference with actual V8 failure logs from JSON-mode saves to validate the risk assessment empirically.

## Recommended Next Focus
Map the complete end-to-end data flow for a JSON-mode save (--json argument through to final file write) to identify where structured JSON data is lost or ignored by the extraction pipeline.
