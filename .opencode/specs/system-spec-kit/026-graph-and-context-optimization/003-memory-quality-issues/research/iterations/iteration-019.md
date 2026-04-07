# Iteration 19: Post-save Reviewer Contract Upgrade (Q16)

## Focus
Generation 2 shifts from root-cause discovery to post-fix drift detection, so the reviewer contract now matters as much as the underlying remediations. The current `post-save-review.ts` still behaves like a narrow payload-vs-frontmatter comparator: it catches generic titles, path-fragment triggers, explicit payload/frontmatter tier drift, missing decision counts, context type drift, and generic descriptions, but it does not inspect the rendered markdown for the D1-D8 regression shapes that matter after the fixes land. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:173-173]

Q16 therefore is not "add more warnings" in the abstract. It is about turning the reviewer into a cheap structural guardrail that can detect whether the shipped D1-D8 fixes silently drifted back, using only the saved file plus the JSON payload. That constraint rules out repo scans, git probes, or embedding-based validation, and it favors regex- and parser-based assertions that reuse the reviewer's existing frontmatter parser, metadata-block parser, and content-level string matching. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:56-157]

## Approach
- Read the canonical Gen-2 scope and the D4/D3/D5 prior design iterations to keep this pass inside Q16 and aligned with the frozen remediation matrix. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:65-77]
- Inventory the current reviewer's real surface area, including parser helpers, existing severity model, and current checks 1-6. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:17-45] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343]
- Reuse the corpus-derived D3 blocklist/allowlist and the D5 continuation regex rather than inventing new heuristics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39]
- Propose only O(1)/O(N) checks over the saved file and payload, with no network, no repo grep, and no dependency on runtime-global state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200]
- Separate blocking regressions (HIGH) from advisory guardrails (MEDIUM) so the contract matches the existing "manual patch HIGH before continuing" behavior. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:401-418]

## Current post-save-review.ts checks (baseline)
| Check ID | Severity | Purpose | File:lines |
|----------|----------|---------|-----------|
| PSR-1 title-quality | HIGH | Flags generic titles when the payload had a substantive `sessionSummary`. | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-248` |
| PSR-2 trigger-phrases | HIGH / MEDIUM | Flags saved trigger path fragments, then warns when manual trigger phrases are missing from saved output. | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:250-277` |
| PSR-3 importance-tier | MEDIUM | Compares payload `importanceTier` / `importance_tier` with frontmatter `importance_tier`. | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-291` |
| PSR-4 decision-count | MEDIUM | Warns when payload decisions exist but saved `decision_count` resolved to zero. | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:293-308` |
| PSR-5 context-type | LOW | Compares payload `contextType` / `context_type` with frontmatter `context_type`. | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:310-322` |
| PSR-6 description-quality | LOW | Flags generic boilerplate descriptions when the payload summary was substantive. | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:324-343` |

## Proposed new checks (one per defect class)

### CHECK-D1: OVERVIEW mid-word truncation detector
- Severity: HIGH
- Logic: parse the `## OVERVIEW` section body and compare its end state with the payload `sessionSummary`. If the payload summary is materially longer than the rendered overview and the overview ends with an alphanumeric token fragment or `...`/`…` immediately after an alphanumeric character, flag a truncation regression. The payload-length gate keeps the check focused on the historical hard clamp rather than any naturally short summary. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:68-69]
- False-positive risk: LOW. A legitimate overview can end with an acronym or bare identifier, but the risk drops sharply if the detector only fires when `sessionSummary.length` is significantly larger than the rendered overview and the ending lacks sentence punctuation. Mitigation: require both (a) payload summary overflow and (b) a terminal shape matching mid-token or ellipsis-after-alnum.
- Pseudocode:
  ```ts
  const overview = extractSection(fileContent, 'OVERVIEW');
  const trimmed = overview.trimEnd();
  const payloadSummary = collectedData.sessionSummary ?? '';
  const beforeEllipsis = trimmed.match(/([A-Za-z0-9])(?:…|\.{3})$/)?.[1];
  const endsMidToken = /[A-Za-z0-9]$/.test(trimmed) && !/[.!?)"'\]]$/.test(trimmed);
  if (
    payloadSummary.length >= trimmed.length + 40 &&
    (Boolean(beforeEllipsis) || endsMidToken)
  ) {
    flag('HIGH', 'overview', 'Possible D1 truncation regression');
  }
  ```

### CHECK-D2: Generic decision placeholder detector
- Severity: HIGH
- Logic: parse the `## DECISIONS` section and flag if it contains lexical placeholder patterns such as `observation decision 1` or `user decision 1`, which Gen-1 traced to the fallback branch in `decision-extractor.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:51-53]
- False-positive risk: VERY LOW. The matched phrases are implementation-shaped placeholder labels, not normal prose. Mitigation: constrain the regex to the exact placeholder families rather than generic `decision \d+`.
- Pseudocode:
  ```ts
  const decisions = extractSection(fileContent, 'DECISIONS');
  if (/\b(?:observation|user)\s+decision\s+\d+\b/i.test(decisions)) {
    flag('HIGH', 'decisions', 'Generic decision placeholder detected');
  }
  ```

### CHECK-D3: Garbage trigger phrase detector
- Severity: MEDIUM
- Logic: apply iteration 15's tuned D3 blocklist to the parsed `trigger_phrases` array after reusing the current `parseFrontmatterArray()` helper. The safe first-pass blocklist is the empirical one: path fragments, standalone stopwords, single-character tokens, synthetic stopword-bigrams, and narrow ID/prefix junk. Preserve the short-name allowlist (`mcp`, `api`, `ai`, `ts`, `js`, `pr`, `ci`, `cd`, `ui`, `ux`, `db`, `qa`, `llm`, `rag`, `sdk`, `cli`, `sql`). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:41-55]
- False-positive risk: LOW. Iteration 15's simulation removed 230 trigger occurrences with zero observed false positives, but only because the blocklist stayed shape-based and kept a short-name allowlist. Mitigation: do not escalate residue singletons like `graph` or `research` into regex blocks here; keep those as future reviewer heuristics, not hard regex rules. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:41-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:55-59]
- Pseudocode:
  ```ts
  const allow = new Set(['mcp','api','ai','ts','js','pr','ci','cd','ui','ux','db','qa','llm','rag','sdk','cli','sql']);
  const triggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
  const junk = triggers.filter((phrase) => {
    const p = phrase.trim().toLowerCase();
    if (allow.has(p)) return false;
    return (
      PATH_FRAGMENT_REGEX.test(phrase) ||
      STOPWORD_REGEX.test(p) ||
      SINGLE_CHAR_REGEX.test(phrase) ||
      SYNTHETIC_BIGRAM_REGEX.test(phrase) ||
      SUSPICIOUS_PREFIX_REGEX.test(phrase)
    );
  });
  if (junk.length > 0) flag('MEDIUM', 'trigger_phrases', `D3 junk phrases: ${JSON.stringify(junk.slice(0, 5))}`);
  ```

### CHECK-D4: Importance-tier divergence detector
- Severity: HIGH
- Logic: parse frontmatter `importance_tier` and the `## MEMORY METADATA` YAML block's `importance_tier`; if both exist and differ, flag immediately. This directly covers the D4 blind spot that iteration 5 and the canonical report called out. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-005.md:13-17] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:55-57]
- False-positive risk: NONE in the intended contract. After the D4 fix, both rendered representations should be derived from one resolved value, so disagreement is pure drift.
- Pseudocode:
  ```ts
  const frontmatterTier = frontmatter['importance_tier'] || '';
  const metadataTier = memoryMetadata['importance_tier'] || '';
  if (frontmatterTier && metadataTier && frontmatterTier !== metadataTier) {
    flag('HIGH', 'importance_tier', `Frontmatter "${frontmatterTier}" != metadata "${metadataTier}"`);
  }
  ```

### CHECK-D5: Missing supersedes on continuation-title detector
- Severity: MEDIUM
- Logic: if the saved title matches the high-precision continuation regex from iteration 14 and the rendered `causal_links.supersedes` value is empty, emit a warning. Reuse only the precise continuation families (`extended`, `continuation`, `continue`, `resume`, `follow-up`, `part N`, `round N`, and iteration carry-forward forms), and explicitly exclude noisy `phase N` / `vN` shapes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:48-56]
- False-positive risk: MEDIUM but acceptable for a warning. Some titles that say `extended` or `follow-up` can still be fresh work rather than lineage continuation, especially because the reviewer cannot scan sibling files under the determinism constraint. Mitigation: keep this MEDIUM only, and keep the regex tight by excluding `phase N` and `vN`, which iteration 14 proved noisy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:38-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:48-56]
- Pseudocode:
  ```ts
  const title = frontmatter['title'] || '';
  const continuationRe = /\b(?:extended|continu(?:ation|e)|resume|follow[- ]up|part\s*\d+|round\s*\d+|iter(?:ation)?\s*\d+|\d+[- ]*iterations?(?:[- ]*total[- ]*\d+)?)\b/i;
  const supersedes = memoryMetadata['supersedes'] || extractYamlNestedValue(fileContent, 'causal_links', 'supersedes');
  if (continuationRe.test(title) && !supersedes) {
    flag('MEDIUM', 'causal_links.supersedes', 'Continuation title without supersedes lineage');
  }
  ```

### CHECK-D6: Duplicate trigger phrase detector
- Severity: MEDIUM
- Logic: detect duplicate saved trigger phrases directly from the parsed `trigger_phrases` array. This is cheap, deterministic, and valuable even though the active producer for D6 is still unresolved. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:73-73]
- False-positive risk: NONE for exact duplicates. If the implementation later wants case-insensitive duplicate collapse, that should be a second pass with its own explicit contract.
- Pseudocode:
  ```ts
  const triggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
  if (new Set(triggers).size !== triggers.length) {
    flag('MEDIUM', 'trigger_phrases', 'Duplicate trigger phrase detected');
  }
  ```

### CHECK-D7: Empty provenance in JSON-mode detector
- Severity: HIGH
- Logic: when JSON-mode save review is active and the payload contract says provenance enrichment was expected, require non-empty `head_ref`, `commit_ref`, and a non-`unavailable` `repository_state` in the saved artifact. The deterministic reviewer-safe version of this check should not shell out to git; instead, the save path should materialize the pre-check result into the payload as a boolean such as `gitRepoAvailable` / `provenanceExpected`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:61-61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:1-49]
- False-positive risk: LOW once the contract carries the pre-check boolean. The only meaningful false-positive class is non-git or detached test environments, and that is avoided by requiring the payload-side "provenance expected" flag rather than probing runtime state inside the reviewer.
- Pseudocode:
  ```ts
  const provenanceExpected = collectedData._source === 'file' && collectedData.gitRepoAvailable === true;
  const headRef = frontmatter['head_ref'] || memoryMetadata['head_ref'] || '';
  const commitRef = frontmatter['commit_ref'] || memoryMetadata['commit_ref'] || '';
  const repositoryState = frontmatter['repository_state'] || memoryMetadata['repository_state'] || '';
  if (
    provenanceExpected &&
    (!headRef || !commitRef || repositoryState === 'unavailable')
  ) {
    flag('HIGH', 'git_provenance', 'JSON-mode save missing expected git provenance');
  }
  ```

### CHECK-D8: Anchor ID mismatch detector
- Severity: MEDIUM
- Logic: scan the rendered markdown for paired comment anchors (`<!-- ANCHOR:name -->`) and nearby HTML IDs / TOC targets, then flag when the names diverge. This catches the exact `summary` vs `overview` template drift that caused D8. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:63-63] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:172-183] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:330-352]
- False-positive risk: LOW. The only realistic noise source is intentional aliasing during template transitions. Mitigation: keep a tiny allowlist for any known transitional pairs and otherwise require exact equality.
- Pseudocode:
  ```ts
  const pairs = extractAnchorPairs(fileContent); // [{ comment: 'summary', htmlId: 'overview' }, ...]
  const allow = new Set(['legacy-summary->overview']);
  for (const pair of pairs) {
    const key = `${pair.comment}->${pair.htmlId}`;
    if (pair.comment !== pair.htmlId && !allow.has(key)) {
      flag('MEDIUM', 'anchors', `Anchor mismatch ${pair.comment} -> ${pair.htmlId}`);
    }
  }
  ```

## Composite regression check
- A single CHECK-GEN-2 should run CHECK-D1 through CHECK-D8 after the existing six baseline checks and then promote the review result to blocking whenever any new HIGH fires. This aligns with the current output contract ("The AI MUST manually patch HIGH severity fields before continuing") while making the D1/D2/D4/D7 regressions first-class blockers instead of downstream surprises. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:401-418]

## Call graph (proposed)
post-save-review.ts::review(memory, payload)
  ├─ CHECK-D1 ... CHECK-D8
  └─ CHECK-GEN-2 (composite)

## Findings
1. The live reviewer only implements six checks, and all of them are payload/frontmatter/content-quality comparisons; none inspect the rendered markdown for D1/D2/D5/D8-style structural regressions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343]
2. D4 is already a documented reviewer blind spot: the current code compares payload tier to frontmatter tier, but never frontmatter tier to the bottom metadata block. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-005.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-291]
3. The D3 reviewer-safe filter should reuse iteration 15's empirical regex set and allowlist instead of inventing a broader semantic blocklist, because the tuned corpus simulation removed 10.08% of trigger occurrences with zero observed false positives. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-44]
4. D5 title gating must exclude `phase N` and `vN`; iteration 14 showed those are the dominant noisy matches, while `extended` and `continuation` are the high-precision continuation signals. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:22-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-56]
5. D6's active producer is still unresolved, which makes a cheap duplicate-trigger assertion especially valuable as a guardrail even before the true owner is isolated. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:73-73]
6. D7 cannot safely depend on reviewer-time git probing if the contract must stay deterministic; the save pipeline needs to pass a payload-side `provenanceExpected`/`gitRepoAvailable` signal into `post-save-review.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:74-74]

## Ruled out / not reproducible
- Repo-wide grep, sibling-folder scans, or git-shell probes inside `post-save-review.ts` are ruled out for Q16 because they violate the deterministic saved-file-plus-payload constraint and the O(1)/O(N) runtime budget. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200]
- A D5 reviewer regex that includes `phase N` or `vN` is ruled out by corpus evidence: those shapes mostly hit unrelated phase bookkeeping or version labels, not continuation runs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:38-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:55-56]
- A broader D3 singleton blocklist for words like `graph` or `research` is not yet justified for a reviewer assertion. Iteration 15 showed those are the main false-negative residue, but solving that with regex alone would overreach compared with the validated shape-based blocklist. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:45-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:55-59]

## New questions raised
- Should the D7 remediation formally extend `PostSaveReviewInput['collectedData']` with `gitRepoAvailable` / `provenanceExpected` so the reviewer can stay deterministic without runtime git calls?
- Should CHECK-D1 key off a fixed overflow delta (for example `+40` chars) or a ratio between `sessionSummary` and `OVERVIEW` length to reduce acronym-ending false positives on legitimate short summaries?

## Next focus recommendation
Iteration 20 should execute Q17 (PR breakdown + rollout sequence). See strategy §14.
