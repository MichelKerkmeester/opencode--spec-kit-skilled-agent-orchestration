● skill(sk-code--review)

I’m pulling the review baseline plus the actual core files now, then I’ll extract concrete findings with file:line evidence.

● Review Review core files
  └ Agent started in background with agent_id: core-audit-second-pass. You can us...

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ 369 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read solid_checklist.md
  │ .agents/skills/sk-code--review/references/solid_checklist.md
  └ 114 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read subfolder-utils.ts
  │ .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
  └ 223 lines read

● Read file-writer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  └ 231 lines read

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ 239 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/scripts/core/index.ts
  └ 39 lines read

● Read tree-thinning.ts
  │ .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
  └ 285 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read topic-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
  └ 59 lines read

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
  └ 356 lines read

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/fac1a547-d042-4a15-a1d1-8780d45c86ca/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read review guidance and all requested core files completely.…
  └ 6 lines...

● skill(sk-code--opencode)

`workflow.ts` is the main hotspot, so I’m chunking it and mapping the big functions before I score the concrete risks.

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:250 (250 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L251:500 (250 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L751:1000 (250 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L501:750 (250 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1001:1250 (249 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1251:1500 (249 lines read)

● Count lines and map workflow functions (shell)
  │ wc -l
  │ '.opencode/skill/system-spec-kit/scripts/core/'{config.ts,workflow.ts,memory-indexer.ts,qualit
  │ y-scorer.ts,topic-extractor.ts,file-writer.ts,subfolder-utils.ts,tree-thinning.ts,index.ts} &&
  │ printf '\n--- workflow functions ---\n' && rg -n
  │ "^(export\s+)?(async\s+)?function|^const\s+[A-Za-z0-9_]+\s*=\s*(async\s*)?\(" …
  └ 60 lines...

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1501:1750 (250 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1751:2000 (250 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2001:2250 (249 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2251:2398 (148 lines read)

● Search (grep)
  │ "TODO|FIXME|HACK|catch \(_error|catch \{|console\.warn|console\.error|readFileSync|writeFileSync
  │ |existsSync|readdirSync|statSync|realpathSync" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/core)
  └ 57 lines found

● Search (grep)
  │ "normalizeFilePath\(|readNamedObject\(|readStringArray\(|readNumber\(|readString\(|ensureMinTrig
  │ gerPhrases\(|ensureMinSemanticTopics\(|validateDescription\(|qualityAbortThreshold|SEARCH_MAX_DE
  │ PTH|DEFAULT_THINNING_CONFIG|MIN_SUBSTANCE_CHARS" in **/*.ts
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 94 lines found

I’ve got the full code in view now. I’m doing one pass for correctness/perf/maintainability, then I’ll cross-check with a separate reviewer to weed out weak findings.

● Read (Review agent — Review core files)
  └ Running

I’ve narrowed it to a handful of real defects plus a few structural hotspots. I’m sanity-checking the trickier regex/path cases so the final audit stays high-signal.

● Read file-helpers.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts
  └ L121:170 (50 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L525:590 (66 lines read)

● Read git-context-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts
  └ L100:160 (61 lines read)

● Read tree-thinning.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts
  └ L1:80 (80 lines read)

● Read spec-folder-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts
  └ L150:210 (61 lines read)

● Validate regex and memory path edge cases (shell)
  │ node - <<'NODE'
  │ const extractFrontmatterTitle = (content) => {
  │ const titleMatch = content.match(/^title:\s*"([^"]+)"$/m);
  │ return titleMatch?.[1]?.trim() || '';
  │ };…
  └ 13 lines...

The second-pass reviewer finished, so I’m folding that into my own notes and trimming anything that doesn’t hold up against the code.

● Read (Review agent — Review core files)
  └ idle

I read all 9 files completely and cross-checked the riskiest points with a second review pass. Here are the concrete findings, file by file.

## Findings

### `config.ts`

- **P1** `125-148`, `156-170`: the code comments say these are “positive integer” / “non-negative integer” fields, but validation only checks `Number.isFinite(...)` plus range. Values like `1.5` for `maxConversationMessages` or `0.5` for `contextPreviewHeadLines` pass and then leak into count/slice logic.

- **P2** `249-274`: invalid or unreadable `config.jsonc` only logs a warning and silently falls back to defaults. That makes config corruption operationally indistinguishable from a defaulted run.


### `workflow.ts`

- **P1** `654`, `1756-1760`: tree-thinning decisions are made from `readFileSync(...).slice(0, 500)`, so token counts are computed from a truncated preview, not the real file. Large files can be misclassified as “small” and merged incorrectly.

- **P1** `1910-1922`: decision confidence fields are rounded without a finite-number guard. If upstream hands back `undefined`, `null`, or `NaN`, the rendered template can contain `NaN` percentages.

- **P1** `2075-2098`, `2172-2177`: the template contract is validated before warning banners are prepended, but those banners are then inserted *before* YAML frontmatter. Saved memories no longer start with frontmatter, which will break any downstream parser that expects frontmatter at byte 0.

- **P2** `1283-2388`: `runWorkflow()` is a 1,100+ line god function doing loading, alignment, contamination cleanup, enrichment, extraction, thinning, rendering, scoring, writing, indexing, and retry processing. This is the biggest SRP/testability problem in the directory.

- **P2** `381-396`: `resolveAlignmentTargets()` swallows spec-context extraction failures and falls back to keyword-only matching. That weakens the contamination gate while hiding why it degraded.

- **P2** `660-690`, `698-707`: `listSpecFolderKeyFiles()` wraps the full recursive walk in one `try/catch` and returns `[]` on any failure. One unreadable directory silently erases all fallback `KEY_FILES` context.

- **P2** `943-959`: `withWorkflowRunLock()` is a global in-process queue with no timeout/cancellation. One hung run blocks every later run in the same process indefinitely.


### `memory-indexer.ts`

- **P2** `118-123`: manual trigger phrase merging never updates `existingLower` after pushing a phrase, so duplicate manual phrases can still be appended multiple times in one pass.

- **P2** `196-214`: metadata status updates are read/parse/write with warning-only failure and no atomic write. Indexing can succeed while `metadata.json` stays stale or half-updated.

- **P2** `143-144`: `recencyFactor` is a constant, not an actual recency calculation. The formula looks dynamic but gives every memory the same “recency” contribution.


### `quality-scorer.ts`

- **P1** `128-129`: `extractFrontmatterTitle()` only matches `title: "..."`. Bare titles (`title: Hello`) and single-quoted titles (`title: 'Hello'`) are ignored, which can incorrectly trigger `generic_title` penalties. I verified this behavior.

- **P1** `252-257`: leaked HTML detection subtracts the number of tags found in fenced code blocks from the total tag count in the whole document. A `<div>` inside code can cancel out a real leaked `<div>` outside code, producing false negatives.

- **P2** `211-218`: `validateDescription()` is recomputed multiple times for the same file set (`filesWithDesc`, quality average). Small cost, but unnecessary repeated work in a scoring path.


### `topic-extractor.ts`

- **P2** `33-36`: spec-folder parsing assumes a flat `NNN-name` slug. When `specFolderName` is a nested relative path like `02--system-spec-kit/013-foo`, category/path noise leaks straight into topic extraction.

- **P2** `31-58`: weighting is implemented by pushing the same strings multiple times, and the extractor is always called even if every input is empty. That makes weighting opaque and hard to tune or validate.


### `file-writer.ts`

- **P2** `83-108`, `119-127`: duplicate detection re-reads and re-hashes every existing `.md` file for each outgoing file. As the memory directory grows, save latency scales with total historical content size.

- **P2** `131-138`: filename validation blocks absolute paths and `..`, but it still accepts empty or dot-like relative names, which then fail later and less clearly.

- **P2** `176`, `215`, `227`: temp/backup cleanup failures are swallowed with bare catches. That can leave `.tmp.*` / `.bak.*` artifacts behind with no signal.


### `subfolder-utils.ts`

- **P2** `39-127` vs `130-223`: the sync and async implementations are near-copy-paste duplicates. Root dedupe, traversal, ambiguity handling, and warning collection should be shared.

- **P2** `40-41`, `131-132`: `childName` is only truthy-checked. Inputs containing `/` or `\\` still trigger a full recursive tree scan instead of being rejected at the boundary.

- **P2** `60-97`, `158-194`: traversal always scans the whole tree even when one unique match has already been found. No early exit, no caching, and `SEARCH_MAX_DEPTH` is a hardcoded magic number.


### `tree-thinning.ts`

- **P1** `83-86`: `isMemoryFile('memory/foo.md')` returns `false` because it only checks for `'/memory/'`. I verified this. Root-level `memory/...` paths are misclassified as non-memory files.

- **P2** `236-249`: the implementation is one-pass grouping by parent, not true bottom-up recursive merging as the comments claim.

- **P2** `218`: merged config is never validated. Negative thresholds or inverted ordering (`mergeThreshold > contentAsTextThreshold`, etc.) are accepted silently.


### `index.ts`

- No material correctness bug. Minor maintainability note: `8-39` exposes a partial barrel, so callers still have to mix barrel imports with direct `./core/*` imports.

No code changes made. If you want, I can turn this into a prioritized fix plan or patch the top P1s first.

