# Iteration 12 - correctness - scripts_lib

## Dispatcher
- iteration: 12 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:37:27Z

## Files Reviewed
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs
- .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts
- .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts
- .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts
- .opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts
- .opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts
- .opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts
- .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
- .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js
- .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts
- .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts
- .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **List-style frontmatter values keep trailing YAML comments as data** - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:581-624` (`parseSectionValue`): inline scalars correctly call `stripTrailingYamlComment()`, but list entries only run `stripWrappingQuotes()`. A valid item like `- "alpha" # note` is therefore parsed as the literal value `"alpha" # note`, and any rewrite through `buildFrontmatterContent()` persists the comment text into `trigger_phrases` instead of discarding it.

```json
{
  "claim": "parseSectionValue misparses valid YAML list items with trailing comments, so frontmatter normalization can silently rewrite comment text into trigger phrase data.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:592-617",
    ".opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:179-203",
    "Local repro via scripts/dist/lib/frontmatter-migration.js on 2026-04-16: parseSectionValue(parseFrontmatterSections('trigger_phrases:\\n  - \"alpha\" # note\\n  - beta')[0]) => [\"\\\"alpha\\\" # note\",\"beta\"]"
  ],
  "counterevidenceSought": "I checked whether the parser strips comments for any multi-line YAML form or whether tests already lock list-comment handling. It only strips comments for the first inline scalar, and current tests cover inline arrays with comments but not list entries.",
  "alternativeExplanation": "This could be intentional if list-item comments were treated as part of the payload, but that would contradict YAML semantics and the module's stated 'safe markdown frontmatter normalization' goal.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the caller guarantees frontmatter lists never include YAML comments and the migration path intentionally rejects that otherwise-valid YAML subset."
}
```

- **`MEMORY METADATA` inline comments can override the real tier with stale frontmatter defaults** - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1032-1052,1092-1111,1232-1279`: `extractMemoryMetadataScalar()` does not strip trailing YAML comments before `normalizeImportanceTier()`. For a metadata line like `importance_tier: "important"  # ...`, normalization fails, `resolveManagedImportanceTier()` falls back to the older top-level tier, and `buildFrontmatterContent()` rewrites both locations to that stale value. Local repro produced `normal` for both the top-level field and the metadata block even though the metadata source said `important`.

```json
{
  "claim": "frontmatter migration can downgrade a valid commented MEMORY METADATA importance_tier to a stale top-level value because the metadata parser keeps the inline comment in the scalar.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1032-1052",
    ".opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1092-1111",
    ".opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1232-1279",
    ".opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:125-155",
    "Local repro via scripts/dist/lib/frontmatter-migration.js on 2026-04-16: metadata importance_tier 'important  # ...' + top-level 'normal' => rewritten output sets both locations to 'normal'"
  ],
  "counterevidenceSought": "I looked for an existing comment-stripping step on MEMORY METADATA scalars or a migration test that exercises commented metadata during buildFrontmatterContent(). There is a post-save-review assertion for matching commented tiers, but no buildFrontmatterContent regression and no scalar comment stripping here.",
  "alternativeExplanation": "If commented metadata were intentionally unsupported, the function should fail closed instead of silently trusting the stale top-level value and rewriting the canonical field.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if commented MEMORY METADATA is formally invalid for this pipeline and callers reject it before buildFrontmatterContent() runs."
}
```

- **Quoted trigger phrases generate invalid YAML inside `## MEMORY METADATA`** - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:627-639,1170-1180`: the main frontmatter serializer escapes quotes and backslashes through `escapeYamlString()`, but `syncMemoryMetadataTriggerPhrases()` interpolates raw strings into `  - "${triggerPhrase}"`. A trigger phrase containing `"` therefore emits malformed YAML such as `- "say "hi""`, corrupting the metadata block after migration.

```json
{
  "claim": "syncMemoryMetadataTriggerPhrases writes unescaped trigger phrase content into YAML, so quoted phrases corrupt the MEMORY METADATA block.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:627-639",
    ".opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1170-1180",
    "Local repro via scripts/dist/lib/frontmatter-migration.js on 2026-04-16: trigger phrase 'say \"hi\"' rewrites as '  - \"say \"hi\"\"' inside ## MEMORY METADATA"
  ],
  "counterevidenceSought": "I checked whether trigger phrases are sanitized or escaped before reaching syncMemoryMetadataTriggerPhrases(), and whether tests cover quoted phrases. The only escaping helper is used for top-level frontmatter, and no reviewed test exercises quoted/backslash metadata serialization.",
  "alternativeExplanation": "If upstream sanitization forbade quotes entirely, this would be unreachable. The reviewed code does not enforce that invariant here, and manual phrases can bypass most extracted-mode filters.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if upstream code proves trigger phrases cannot contain quotes or backslashes before buildFrontmatterContent() is called."
}
```

### P2 Findings
- **Frontmatter regression coverage misses the exact failure modes above** - `.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:179-203,306-330` only checks inline-array comments, while `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:125-155` checks commented tiers in post-save review rather than in `buildFrontmatterContent()`. The current suite would stay green while list-item comments are ingested as data and quoted trigger phrases break the metadata YAML.

## Traceability Checks
- `coverage-graph-signals.cjs` still matches the intended signal semantics in this slice: session filtering is wired through every public metric, and depth handling correctly collapses SCC cycles, with direct coverage in `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts`.
- `semantic-signal-extractor.ts` remains broadly aligned with the frozen trigger/topic baselines exercised by `.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts`.
- `frontmatter-migration.ts` does **not** fully satisfy its "safe markdown frontmatter normalization" contract: valid YAML comments and quoted strings survive parsing/serialization incorrectly in the reviewed paths above.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs` - degree/depth/activity/cluster logic is internally consistent, and the dedicated Vitest file covers the important SCC, rootless-cycle, and session-filtered paths.
- `.opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts` - pure helper layer with straightforward lowercasing and short-token allowlisting; no correctness defect surfaced in reviewed call sites.
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts` - extracted/manual branching, contamination/path blocking, and allowlist handling all matched the reviewed tests and spot probes.

## Next Focus
- Iteration 13 should stay on correctness around the frontmatter pipeline's callers (`core/frontmatter-editor.ts`, `memory/backfill-frontmatter.ts`, and post-save validators) to see whether they mask or amplify these migration bugs.
