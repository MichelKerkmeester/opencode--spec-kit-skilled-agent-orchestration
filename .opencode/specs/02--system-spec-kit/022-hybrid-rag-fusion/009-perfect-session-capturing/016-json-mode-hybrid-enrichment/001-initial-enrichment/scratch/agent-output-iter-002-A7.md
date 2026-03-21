# Iteration 6 (A7): V-Rule Gap Analysis + Unknown Fields + V12 Degradation

## Focus
Complete three remaining questions from the research agenda:
- **Q2**: Exhaustive V-rule gap analysis -- for each V-rule (V1-V12), what does it catch and what does it miss?
- **Q12**: What happens when unexpected fields arrive in the JSON payload?
- **Q13**: How often does V12 topical coherence degrade to no-op, and what triggers the degradation?

## Findings

### Finding 1: Complete V-Rule Coverage Map (Q2)

Each V-rule analyzed for what it catches vs. what it misses:

| Rule | Severity | Catches | Misses |
|------|----------|---------|--------|
| **V1** | HIGH (blocks write) | `[TBD]` placeholders in 4 hardcoded non-optional fields: `decisions`, `next_actions`, `blockers`, `readiness` | Other placeholder patterns (e.g., `[TODO]`, `[PLACEHOLDER]`, `{{var}}`). Only checks 4 fields by name, not the full content. A TBD in `sessionSummary` or `trigger_phrases` passes V1. |
| **V2** | MEDIUM (blocks index) | `[N/A]` when `tool_count > 0` (indicating real tool usage but N/A placeholders remain) | `[N/A]` when `tool_count == 0` (passes silently even if observations or files exist). Does not check for `N/A` in frontmatter fields. |
| **V3** | HIGH (blocks write) | Malformed spec_folder containing `*`, `**`, `[`, or "Before I proceed" text | Does not check for: empty string spec_folder, spec_folder with trailing slashes, spec_folder pointing to nonexistent directory, spec_folder with spaces or special chars beyond `*[`. |
| **V4** | LOW (soft) | Regex match for "No (specific )?decisions were made" | Only catches this exact phrasing. Paraphrases like "No decisions recorded", "Decisions: none", "No key decisions identified" pass through. |
| **V5** | LOW (soft) | Empty `trigger_phrases` array when `tool_count >= 5` | Trigger phrases with only 1-2 generic tokens (e.g., `["and", "the"]`) pass. Does not check trigger phrase quality, only quantity. Threshold of tool_count >= 5 is arbitrary -- sessions with 3-4 tools and no triggers also have poor discoverability. |
| **V6** | LOW (soft) | 8 specific placeholder patterns (dangling `/100`, empty `Confidence: %`, empty preflight scores, template instructional banners, template config/footer leakage) | Does not check for: Handlebars-style `{{placeholders}}`, Mustache `{{{triple}}}`, or arbitrary `[BRACKET_PLACEHOLDER]` patterns beyond the 8 hardcoded ones. Template evolution that adds new placeholder patterns requires manual V6 updates. |
| **V7** | LOW (soft) | `tool_count == 0` but execution signal patterns present in content (tool invocation text, non-zero tool table, `tool_calls` reference) | Inverse case: `tool_count > 0` but no execution signals (inflated count from metadata, no actual tool content). Also does not check for contradictory `message_count` (messages=0 but conversation text present). |
| **V8** | HIGH (blocks write) | Foreign spec IDs dominating content (>=3 mentions, >=2 more than current spec) OR scattered foreign mentions (>=2 distinct foreign IDs with <=2 each) OR foreign spec IDs in frontmatter trigger_phrases/key_topics | CG-07c ancestor allowance may be too permissive: a child spec memory that actually discusses a sibling spec extensively would have the sibling's parent ID allowed. Does not detect topical drift to non-spec-numbered areas (e.g., memory about "git" stored under a UI spec). |
| **V9** | HIGH (blocks write) | 4 title contamination patterns: template instructional headings, `[placeholder]` bracket titles, generic stub titles (Untitled/Draft/TODO/TBD), spec-ID-only titles | Titles that are technically non-generic but meaningless (e.g., "Session Notes", "Work Done", "Updates") pass. Does not detect duplicated titles across memories (same title used repeatedly). |
| **V10** | LOW (soft) | Significant divergence between `filesystem_file_count` and `captured_file_count` (ratio >= 2x AND absolute diff >= 5, unless max <= 2 or min == 0) | The `minCount == 0` skip is over-permissive: a session with 20 filesystem files but 0 captured files may indicate a pipeline failure, not a "newly created spec". Also does not detect when both counts are present but both are 0 (potential data loss). |
| **V11** | HIGH (blocks write) | API error vocabulary in description or title, error-dominated trigger phrases (>50% error vocab) | Does not check body/narrative content for error dominance. A memory whose rendered markdown body is 90% error stack traces but has a clean title/description passes V11. Does not detect timeout-only content (long-running operations that timed out without explicit error messages). |
| **V12** | MEDIUM (blocks index) | Zero topical overlap between memory content (case-insensitive substring match) and spec's `trigger_phrases` from `spec.md` | Degrades to no-op silently (see Finding 3). Substring matching is crude: a spec trigger phrase "memory quality" matches content containing "memory quality" anywhere, including in unrelated contexts like "I have a good memory quality is important". No semantic similarity, just string inclusion. |

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:42-650]

### Finding 2: Three Additional Uncovered Failure Modes Beyond A1 (Q2)

Beyond what prior iterations identified, three more failure modes have no V-rule coverage:

**Failure Mode A: Observation deduplication is not validated.**
The `duplicate_observations` quality flag exists in the QualityFlag type (line 295 of session-types.ts) but NO V-rule checks for it. The quality scorer maps V-rule failures to flags, but `duplicate_observations` has no V-rule trigger. Duplicate observations in rendered content (e.g., the same finding stated twice from different extraction paths) produce no penalty or warning.

[SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:295 -- QualityFlag includes 'duplicate_observations' but no V-rule maps to it]
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:122-157 -- flag mappings skip duplicate_observations]

**Failure Mode B: Frontmatter YAML syntax validity is never validated.**
No V-rule checks that the YAML frontmatter is syntactically valid. The `extractFrontMatter` function uses regex (`/^---\n([\s\S]*?)\n---/`) rather than a YAML parser. Malformed YAML (unquoted colons in values, tab characters, duplicate keys, missing closing `---`) silently produces wrong extractions rather than validation failures. This means downstream V-rules that depend on frontmatter parsing (V5, V8, V9, V11, V12) operate on potentially incorrect data.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:183-191 -- extractFrontMatter uses regex, not YAML parser]

**Failure Mode C: Content length/emptiness below the rendered body.**
The quality scorer has an empty content check (lines 85-106 of quality-scorer.ts) that catches completely empty content. But there is no V-rule for "content is present but trivially short" -- a rendered memory with just `# Title\n\nOne sentence.` and valid frontmatter passes all V-rules. The `short_content` quality flag exists in the type system but no V-rule triggers it. The `P3-4: minimum_message_ratio` check in the scorer partially addresses this (flagging `insufficient_capture` when message/tool ratio < 0.05), but it is a heuristic about session shape, not content adequacy.

[SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:293 -- QualityFlag includes 'short_content' with no V-rule]
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:85-106 -- empty content path, lines 189-193 -- minimum_message_ratio]

### Finding 3: V12 Degrades to No-Op Under Three Conditions (Q13)

The V12 implementation (validate-memory-quality.ts lines 612-650) degrades silently to a no-op (always passes) when ANY of these conditions are met:

**Condition 1: `specFolder` is empty or falsy.**
Line 614: `if (specFolder)` -- if spec_folder is missing from frontmatter, the entire V12 block is skipped. This happens when the memory was generated without a spec folder argument or the spec_folder frontmatter field was not populated. V12 passes trivially.

**Condition 2: `path.resolve(specFolder, 'spec.md')` does not exist on disk.**
Lines 617-625: V12 only tries `path.resolve(specFolder, 'spec.md')` as a candidate. If `specFolder` is a relative name like `"016-json-mode-hybrid-enrichment"` (not a full path like `".opencode/specs/02.../016-.../"`), `path.resolve` resolves against the CWD, which likely does not contain a `spec.md`. The `fs.existsSync` check fails, `specTriggerPhrases` stays empty, and V12 passes trivially.

**Condition 3: spec.md exists but has zero trigger_phrases.**
Line 637: `if (specTriggerPhrases.length > 0)` -- if the spec.md file has no `trigger_phrases` YAML list (or the YAML parsing fails to extract them), V12 passes trivially.

**Frequency estimate**: Condition 2 is likely the MOST common degradation path. Memory files store `spec_folder` in frontmatter as a relative path (e.g., `specs/02--system-spec-kit/022-hybrid-rag-fusion/.../016-json-mode-hybrid-enrichment`), but `validateMemoryQualityContent` receives the rendered content string -- it extracts `spec_folder` from frontmatter via regex (line 459), then calls `path.resolve(specFolder, 'spec.md')`. If the script's CWD is not the project root, the resolved path is wrong. Even if CWD IS the project root, the relative path must be correct -- and there is no normalization (e.g., stripping quotes, handling `.opencode/` prefix variants).

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:612-650]

### Finding 4: RawInputData Silently Accepts Unknown Fields (Q12)

The `RawInputData` interface (input-normalizer.ts line 97) has an explicit index signature:
```typescript
[key: string]: unknown;
```

The `validateInputData` function (lines 621-703) performs type checks on ~12 KNOWN fields (specFolder, triggerPhrases, keyDecisions, filesModified, nextSteps, importanceTier, FILES, observations, user_prompts, recent_context) but has NO unknown-field detection. There is no loop over `Object.keys(data)` to compare against known fields.

**Consequence**: When an AI composes JSON with a typo (e.g., `"sesionSummary"` instead of `"sessionSummary"`, or `"keydecisions"` instead of `"keyDecisions"`), the field is:
1. Accepted silently by `validateInputData` (no warning)
2. Preserved in the `RawInputData` object via the index signature
3. Ignored by `normalizeInputData` which only reads known field names
4. Lost -- never reaches the rendered memory output

There is a TODO comment on `NormalizedData` (line 123): `// TODO(O3-12): Remove index signature once all dynamic fields are explicitly declared` -- confirming the team knows this is technical debt but has not yet resolved it.

**Practical impact**: The `CollectedDataBase` interface (session-types.ts) has ~45 explicitly declared fields. Any JSON field not matching one of these names is silently dropped. No warning log, no validation error, no metric. This is the primary mechanism for "silent field drops" that Domain A is concerned about.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:72-98 -- RawInputData index signature]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:621-703 -- validateInputData checks known fields only]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:123 -- TODO(O3-12)]

### Finding 5: Quality Scorer Penalty Math Still Allows Perfect Scores on Failed Rules (Q2 Supplement)

Confirming and extending the A1 finding: the quality scorer (extractors/quality-scorer.ts) sums severity-weighted penalties from failed V-rules, then adds bonuses (+0.05 messages, +0.05 tools, +0.10 decisions = +0.20 max). Since HIGH severity rules block writes (they never reach the scorer), the maximum penalty that reaches scoring is MEDIUM (0.15 per rule). A single medium-severity failure (e.g., V2 or V12) with all three bonuses present yields: `1.0 - 0.15 + 0.20 = 1.05`, clamped to `1.0`. Two medium failures: `1.0 - 0.30 + 0.20 = 0.90`. LOW severity failures (0.05 each) are fully compensated by a single bonus.

This means: a memory that fails V4 (fallback decision), V5 (sparse triggers), V6 (placeholder remnants), V7 (tool state mismatch), AND V10 (session source mismatch) -- five simultaneous soft failures -- with a session that had messages, tools, and decisions: `1.0 - (5 * 0.05) + 0.20 = 0.95`. Five failed rules, score 95%.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:113-205 -- penalty sum + bonus logic]
[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:42-139 -- severity assignments]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` (full file, 731 lines) -- V-rule implementations
- `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts` (full file, 247 lines) -- scoring logic
- `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` (full file, 639 lines) -- type definitions, QualityFlag enum
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 1-260, 620-720) -- RawInputData interface, validateInputData

## Assessment
- New information ratio: 0.70
- Questions addressed: Q2, Q12, Q13
- Questions answered: Q2 (fully -- exhaustive V-rule gap analysis with 3+ new failure modes), Q12 (fully -- unknown fields silently dropped), Q13 (fully -- three degradation conditions identified)

## Reflection
- What worked and why: Reading the complete validate-memory-quality.ts file end-to-end was essential for Q2. The V-rule implementations are all in one function (`validateMemoryQualityContent`), making exhaustive analysis tractable in a single pass. Cross-referencing QualityFlag types against V-rule flag mappings in quality-scorer.ts revealed orphan flags (duplicate_observations, short_content) that no V-rule activates.
- What did not work: N/A -- all research actions produced useful data.
- What I would do differently: For a deeper Q2 analysis, I would also read the test files (validation-rule-metadata.vitest.ts) to check whether tests exercise edge cases that the code itself doesn't handle.

## Recommended Next Focus
With Q2, Q12, and Q13 now fully answered, the remaining open questions are Q1, Q3, Q7, Q8, Q9, Q10, Q11. Priority should be:
1. Q1 (field propagation tracing -- the most architecturally impactful question)
2. Q9 (trigger phrase rendering chain -- directly affects MCP discoverability)
3. Q7 (contamination filter coverage gaps -- extends A4's finding about missing field cleaning)
