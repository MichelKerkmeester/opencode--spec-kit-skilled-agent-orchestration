# Iteration 16: AC-1..AC-8 Fixture Design (Q13)

## Focus
This iteration translates spec acceptance criteria AC-1..AC-8 into unit-test-ready JSON fixture shapes. The goal is not to re-prove Gen-1 root causes, but to turn them into small, reproducible payloads that fail on exactly one defect class at a time and therefore make the eventual remediation patches easy to verify without full-session replay noise. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:83-95] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-195]

Gen-2 Q13 is specifically about testing artifacts, so the useful output here is a fixture catalog, not more diagnosis. The catalog below keeps each AC fixture as close as possible to the real JSON-mode contract consumed by `generate-context.ts`, while avoiding fields that would accidentally activate a second defect class and muddy the before/after signal. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-341] [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:123-192]

## Approach
- Start from the live structured-input parser, not the historical markdown artifacts, so every fixture matches the current JSON-mode entry contract. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:301-309] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:368-385]
- Use `CollectedDataBase` as the canonical field inventory, but prefer the smallest payload that still reaches the target defect owner. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:123-192]
- Reuse `filesChanged` rather than `filesModified` where possible because the alias is explicitly documented in the shared type contract. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:134-136]
- Keep D2 fixtures dependent on `userPrompts.prompt`, because the pre-fix extractor only reads `_manualDecisions`, `userPrompts`, and `observations` and ignores raw `keyDecisions`. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:72-76] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-384]
- Treat D5 and D7 as harness-assisted fixtures: the JSON payload stays minimal, while the unit test seeds one predecessor memory (D5) or stubs `extractGitContext()` (D7). [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- Explicitly note D6 as out-of-band for the AC fixture set because the spec does not assign it a dedicated acceptance criterion and Gen-1 reclassified it as historical/stale-sample pending a better reproducer. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:40-45]

## JSON schema (discovered)
- Input type: `CollectedDataBase` at [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:123-192]
- Required fields: `specFolder` **or** an explicit CLI spec-folder override; in structured modes the parser rejects payloads with no target folder and injects `_source: "file"` automatically. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:301-309] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:369-385]
- Optional fields: `sessionSummary`, `keyDecisions`, `nextSteps`, `userPrompts`, `observations`, `recentContext`, `filesChanged`, `filesModified`, `importanceTier`, `importance_tier`, `preflight`, `postflight`, `toolCalls`, `exchanges`, `headRef`, `commitRef`, `repositoryState`, `isDetachedHead`, `causal_links`, `causalLinks`, `contextType`, `context_type`, `projectPhase`, `project_phase`. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:126-192]
- Real sample payloads already use convenience keys such as `specFolder`, `sessionSummary`, `keyDecisions`, `filesModified`, `triggerPhrases`, and `technicalContext`, so fixture loaders should preserve runtime normalization behavior instead of assuming the TS contract is the whole surface area. [SOURCE: .opencode/specs/00--anobel.com/033-form-upload-issues/scratch/save-context-data.json:1-44]

### Fields directly relevant to D1-D8

| Defect | Primary payload field(s) | Why this field matters |
| --- | --- | --- |
| D1 | `sessionSummary` | `collectSessionData()` prefers `sessionSummary` and currently clamps it with `substring(0, 500)`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] |
| D2 | `keyDecisions` + `userPrompts` | Raw authored decisions are present in JSON, but pre-fix extraction only sees `_manualDecisions`/`userPrompts`/`observations`, so `userPrompts` is needed to trigger the bad lexical fallback. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-384] |
| D3 | `specFolder` (+ optionally `filesChanged`) | The bad tokens are injected from folder-name tokens after filtering, so the folder path itself is enough to reproduce the leak. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298] |
| D4 | `importanceTier` / `importance_tier` + severity-bearing content | The drift happens when managed frontmatter infers one tier while the rendered bottom metadata block preserves another. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1115-1169] |
| D5 | `specFolder` + continuation wording; omit `causal_links` | Current workflow only passes through existing causal links, so auto-supersedes can only be tested when the payload does **not** pre-seed the answer. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1308] |
| D6 | Trigger phrase output only | Duplicate trigger phrases are still tied to the same output array, but there is no dedicated AC fixture because the active owner is unresolved and the spec omits a standalone criterion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:40-45] |
| D7 | Any JSON-mode payload; expected outputs are `headRef` / `commitRef` / `repositoryState` | JSON mode skips the captured-session enrichment branch that normally fills provenance. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] |
| D8 | Any payload with `sessionSummary` | Once OVERVIEW renders, the template mismatch between TOC `overview` and comment anchor `summary` becomes observable. [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:172-183] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:330-352] |

## Fixture catalog (8 fixtures, one per AC)

### Fixture F-AC1 — OVERVIEW mid-word truncation
**Target defect:** D1  
**What it proves:** Before the fix, OVERVIEW can end mid-token because `sessionSummary` is hard-clamped at 500 chars; after the fix, truncation happens on a word boundary with an explicit suffix. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-878] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283]
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "sessionSummary": "Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega repeated until the string is just over 520 characters long, with character 500 landing inside the word boundarybreaker so the pre-fix substring cut is visibly wrong while the post-fix version trims cleanly at the previous whitespace boundary."
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC1);
const overview = getSection(result.markdown, 'OVERVIEW');

expect(overview.length).toBeLessThanOrEqual(510);
expect(overview).not.toMatch(/[A-Za-z][.]{3}$|[A-Za-z]…$/);
expect(overview).toMatch(/\s(?:\.\.\.|…)$/);
```

### Fixture F-AC2 — Authored decisions preserved
**Target defect:** D2  
**What it proves:** With non-empty raw `keyDecisions`, authored decisions must outrank lexical fallback; before the fix, the extractor ignores raw JSON decisions and may synthesize `user decision 1` from prompts instead. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-384]
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "sessionSummary": "Short neutral session summary for decision precedence testing.",
  "keyDecisions": [
    "Adopt strict TypeScript config",
    "Use Voyage-4 embeddings"
  ],
  "userPrompts": [
    {
      "prompt": "We decided to adopt strict TypeScript config for this remediation."
    },
    {
      "prompt": "We chose Voyage-4 embeddings for the retrieval path."
    }
  ]
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC2);
const decisions = getDecisionTitles(result.markdown);

expect(decisions).toEqual(
  expect.arrayContaining([
    'Adopt strict TypeScript config',
    'Use Voyage-4 embeddings'
  ])
);
expect(decisions.join('\n')).not.toMatch(/(?:user|observation) decision \d+/i);
```

### Fixture F-AC3 — Clean trigger phrases
**Target defect:** D3  
**What it proves:** Folder-derived garbage is gone; before the fix, `workflow.ts` appends folder tokens like `and`, `graph`, or path-ish fragments after filtering, while after the fix the final trigger phrase list contains only semantically valid phrases. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298]
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "sessionSummary": "Fixture planning for memory quality backend verification.",
  "filesChanged": [
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts"
  ]
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC3);
const triggers = parseTriggerPhrases(result.markdown);

expect(triggers).not.toEqual(
  expect.arrayContaining(['and', 'graph', 'issues', 'kit/026', 'optimization/003'])
);
expect(triggers.every((phrase) => !phrase.includes('/'))).toBe(true);
expect(triggers.every((phrase) => phrase.trim().length >= 3)).toBe(true);
```

### Fixture F-AC4 — Frontmatter/YAML tier agreement
**Target defect:** D4  
**What it proves:** Frontmatter `importance_tier` and the bottom metadata block stay in lockstep. The payload intentionally combines a low baseline tier with high-severity language so pre-fix managed-frontmatter rewrite can diverge from the already-rendered bottom block. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1115-1169]
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "importanceTier": "normal",
  "sessionSummary": "Critical production-blocking corruption fix for JSON-mode memory saves affecting every generated artifact and blocking research continuity until repaired."
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC4);
const frontmatterTier = parseFrontmatter(result.markdown).importance_tier;
const metadataTier = parseBottomMetadata(result.markdown).importance_tier;

expect(frontmatterTier).toBe(metadataTier);
```

### Fixture F-AC5 — Causal supersedes on continuation run
**Target defect:** D5  
**What it proves:** A continuation-style JSON save auto-populates `causal_links.supersedes` with the immediate predecessor when the harness seeds exactly one prior memory and the current payload carries clear continuation wording. Before the fix, the workflow only passes through existing `causal_links`, so the field stays empty. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1308]
**Harness precondition:** Create a temp spec folder with exactly one prior memory file whose `session_id` is `mem-prev-001`.
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "sessionSummary": "Continuation run extending the previous deep-research pass from 8 to 13 total iterations.",
  "filesChanged": [
    "research/research.md"
  ]
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC5, { seededPreviousSessionId: 'mem-prev-001' });
const links = parseCausalLinks(result.markdown);

expect(links.supersedes).toEqual(['mem-prev-001']);
```

### Fixture F-AC6 — Git provenance populated
**Target defect:** D7  
**What it proves:** JSON mode receives provenance fields even though it is not a captured-session save. The fixture itself stays tiny; the unit test stubs git extraction to prove the bug is the branch gate, not repository state. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
**Harness precondition:** Stub `extractGitContext()` (or the workflow seam that wraps it) to return deterministic values.
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "sessionSummary": "Short neutral summary for provenance-only JSON-mode testing."
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC6, {
  gitContext: {
    headRef: 'refs/heads/main',
    commitRef: 'abc1234',
    repositoryState: 'clean'
  }
});
const metadata = parseBottomMetadata(result.markdown);

expect(metadata.head_ref).toBe('refs/heads/main');
expect(metadata.commit_ref).toBe('abc1234');
expect(metadata.repository_state).toBe('clean');
```

### Fixture F-AC7 — Anchor consistency
**Target defect:** D8  
**What it proves:** The TOC target, HTML `id`, and comment anchor all agree on `overview`. Because this is a pure template defect, the payload only needs to be sufficient to render the OVERVIEW section. [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:172-183] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:330-352]
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "sessionSummary": "Small summary used solely to render the overview section."
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC7);

expect(result.markdown).toContain('- [OVERVIEW](#overview)');
expect(result.markdown).toContain('<a id="overview"></a>');
expect(result.markdown).toContain('<!-- ANCHOR:overview -->');
expect(result.markdown).not.toContain('<!-- ANCHOR:summary -->');
```

### Fixture F-AC8 — End-to-end (all 8 defects absent)
**Target defect:** ALL  
**What it proves:** A realistic JSON save can exercise the whole repaired path at once: clean OVERVIEW truncation, authored decisions preserved, no garbage or duplicate triggers, tier agreement, supersedes linkage, provenance populated, and anchor consistency. This is the only intentionally multi-defect fixture. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:87-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:65-77]
**Harness precondition:** Seed one predecessor memory (`mem-prev-001`) and stub git context.
**JSON payload (minimal):**
```json
{
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues",
  "importanceTier": "important",
  "sessionSummary": "Continuation run extending the earlier investigation with a longer narrative that exceeds five hundred characters so the overview path must truncate cleanly without breaking a word boundary. The summary also mentions that the work fixes memory-quality regressions across JSON-mode saves, preserves authored decisions, and validates provenance, anchors, and causal lineage in one pass while remaining semantically clean enough that trigger extraction should not fall back to folder junk or duplicated phrases. Repeat this final sentence until the string is comfortably above the truncation threshold.",
  "keyDecisions": [
    "Adopt strict TypeScript config",
    "Use Voyage-4 embeddings"
  ],
  "userPrompts": [
    {
      "prompt": "We decided to adopt strict TypeScript config for this remediation."
    },
    {
      "prompt": "We chose Voyage-4 embeddings for the retrieval path."
    }
  ],
  "filesChanged": [
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts"
  ]
}
```
**Assertion (pseudocode):**
```ts
const result = await generateContext(fixture_F_AC8, {
  seededPreviousSessionId: 'mem-prev-001',
  gitContext: {
    headRef: 'refs/heads/main',
    commitRef: 'abc1234',
    repositoryState: 'clean'
  }
});
const overview = getSection(result.markdown, 'OVERVIEW');
const decisions = getDecisionTitles(result.markdown);
const triggers = parseTriggerPhrases(result.markdown);
const metadata = parseBottomMetadata(result.markdown);
const frontmatter = parseFrontmatter(result.markdown);
const links = parseCausalLinks(result.markdown);

expect(overview).not.toMatch(/[A-Za-z][.]{3}$|[A-Za-z]…$/);
expect(decisions).toEqual(expect.arrayContaining(['Adopt strict TypeScript config', 'Use Voyage-4 embeddings']));
expect(decisions.join('\n')).not.toMatch(/(?:user|observation) decision \d+/i);
expect(triggers).not.toEqual(expect.arrayContaining(['and', 'graph', 'issues', 'kit/026', 'optimization/003']));
expect(new Set(triggers.map((p) => p.toLowerCase())).size).toBe(triggers.length);
expect(frontmatter.importance_tier).toBe(metadata.importance_tier);
expect(links.supersedes).toEqual(['mem-prev-001']);
expect(metadata.head_ref).toBe('refs/heads/main');
expect(metadata.commit_ref).toBe('abc1234');
expect(metadata.repository_state).toBe('clean');
expect(result.markdown).toContain('<!-- ANCHOR:overview -->');
expect(result.markdown).not.toContain('<!-- ANCHOR:summary -->');
```

## Fixture storage proposal
- Directory: `.opencode/skill/system-spec-kit/scripts/test/fixtures/memory-quality/`
- Naming: `F-AC{n}-{short-name}.json`
- Loader: `loadFixture("F-AC1-truncation")`

## Findings
1. The only hard requirement for structured JSON mode is a resolvable target spec folder; the parser accepts any JSON object and then injects `_source: "file"`. That means AC fixtures can stay tiny and do not need transcript-shaped noise to enter the real workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-341] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:369-385]
2. D2 fixtures must include both raw `keyDecisions` and decision-like `userPrompts`, otherwise pre-fix behavior may yield an empty DECISIONS section instead of the bad placeholder branch. The extractor currently ignores raw `keyDecisions` and only lexical-mines when both manual and observation decisions are absent. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-384]
3. D3 is the easiest defect to isolate with almost no payload because the folder-token leak happens after trigger filtering; the spec folder path itself is already enough to reproduce the issue. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298]
4. D5 and D7 are not pure-payload bugs: one needs seeded predecessor state and the other needs a git seam. The JSON fixture should therefore stay minimal while the harness supplies the missing environmental preconditions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
5. AC-1’s suffix expectation is still slightly underspecified: the existing word-boundary helper uses ASCII `...`, while the spec text uses the single-character ellipsis `…`. The implementation PR should pin one canonical suffix so fixture assertions do not encode punctuation ambiguity. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:87-88]

## Ruled out / not reproducible
- I did **not** base the fixtures on top-level `triggerPhrases` even though real saved JSON payloads use that convenience key, because the canonical shared TS contract does not declare it and the AC set does not require testing that normalization seam directly. Using `specFolder` + `filesChanged` gives a cleaner D3 reproducer. [SOURCE: .opencode/specs/00--anobel.com/033-form-upload-issues/scratch/save-context-data.json:27-42] [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:126-192]
- D6 does not get its own AC fixture in this catalog. The spec’s AC table omits a standalone duplicate-trigger criterion, and Gen-1 final synthesis explicitly downgraded D6 to historical/stale-sample pending a better reproducer. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:85-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:40-45]

## New questions raised
- Should the eventual fixture loader normalize convenience payload keys from real saved JSON samples (for example `filesModified` string arrays) before handing them to type-strict unit helpers, or should tests only use canonical `CollectedDataBase` keys? [SOURCE: .opencode/specs/00--anobel.com/033-form-upload-issues/scratch/save-context-data.json:11-25] [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:134-136]
- For D5, is it safer for the unit harness to stub the generated title/continuation signal directly rather than rely on title inference from `sessionSummary` text? The current fixture design assumes continuation wording is enough, but the generation seam was not part of this iteration’s scope. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1308]
- Should AC-4 add a dedicated non-heuristic tier-classification seam so the divergence test does not depend on whatever phrases `inferImportanceTier()` happens to rank highly in the future? [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1115-1118]

## Next focus recommendation
Iteration 17 should execute Q14 (refactor dependency map). See strategy §14. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:192-193]
