# Deep Audit: Research Scratch Files for `013-improve-stateless-mode`

**Spec path:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-improve-stateless-mode/`
**Audited files:** `plan.md`, `scratch/R01` through `scratch/R10`
**Code baseline:** Current working tree (verified at audit time)

---

## Executive Summary

Ten parallel research agents produced a well-structured body of evidence that is broadly accurate about the stateless code path. However, **three reports contain demonstrably stale findings** (R02, R04, R06) because the codebase advanced during or after the research phase. One Phase 0 fix (`SPEC_FOLDER` backfill, `collect-session-data.ts:733–734`) is already implemented. The `buildToolObservationTitle()` function (`input-normalizer.ts:358–393`) was added between research and plan finalization, partially resolving the primary concern in R02 and R06. R04's description of the spec folder as "early-phase with only spec.md and description.json" is now entirely false: the folder contains a complete plan, checklist, five memory saves, and ten-plus scratch files. R01's five data-loss-point taxonomy matches the plan.md root-cause table exactly and remains the most internally consistent piece of research. R10's Option B recommendation is well-reasoned and correctly supported by the pipeline structure. Key gaps in coverage include: insufficient depth on V-rule interaction with enriched content, no analysis of how provenance markers are consumed downstream, and no verification that the dedup-ratio problem persists after `buildToolObservationTitle()`.

---

## 1. Evidence Quality by Report

### R01 — Code Path Trace
**Overall quality: HIGH. Findings grounded in current code.**

| Claim | Code Evidence | Status |
|-------|--------------|--------|
| `CONFIG.DATA_FILE = null` in stateless mode | `generate-context.ts:266–279` | ✅ Valid |
| JSON branch skipped when `dataFile` is falsy | `data-loader.ts:80–140` | ✅ Valid |
| OpenCode fallback chain | `data-loader.ts:142–178` | ✅ Valid |
| `transformOpencodeCapture()` omits `SPEC_FOLDER`, `preflight`, `postflight` | `input-normalizer.ts:453–482` (now 521–529) | ✅ Valid |
| `specFolderPath` built only from `collectedData.SPEC_FOLDER` | `collect-session-data.ts:725–730` (now 737–744) | ✅ Valid but partially superseded — Phase 0 backfill at :733–734 is now live |
| Simulation fallback returns `{ _isSimulation: true }` | `data-loader.ts:180–186` | ✅ Valid |
| Workflow adds simulation warning | `workflow.ts:781–786` | ✅ Valid |

**Citation quality:** All claims carry `file:line` references. Lines are close-but-slightly-drifted in the current tree (approximately ±5–10 lines in most places) — a normal consequence of subsequent edits, not a research failure.

**One important update since R01:** The Phase 0 backfill at `collect-session-data.ts:733–734` now sets `collectedData.SPEC_FOLDER = folderName` when it is missing. Data loss point 3 is therefore **partially fixed**; `detectRelatedDocs()` now runs in stateless mode when the CLI folder name is provided. R01 correctly identified this as an "avoidable" loss, and it has since been addressed.

---

### R02 — OpenCode Capture Analysis
**Overall quality: MEDIUM-HIGH. Core findings accurate; tool-title section is STALE.**

R02 is the most nuanced staleness case. The bulk of the analysis — snake_case/camelCase mismatch, `recentContext` being a single entry, metadata counts being dropped, file extraction limited to edit/write, relevance filter hurting recall — remains accurate against the current code.

**Stale finding — generic `Tool: X` titles:**

R02 at the "Tool-call observations" section states:
```
title: `Tool: ${tool.tool}`,
```
citing `input-normalizer.ts:430–451`.

The **current code** at `input-normalizer.ts:358–393` contains `buildToolObservationTitle()`:
```ts
function buildToolObservationTitle(tool: CaptureToolCall): string {
  ...
  switch (toolName.toLowerCase()) {
    case 'read':  return shortPath ? `Read ${shortPath}` : 'Read file';
    case 'edit':  return shortPath ? `Edit ${shortPath}` : 'Edit file';
    case 'grep':  return pattern  ? `Grep: ${pattern}`  : 'Grep search';
    // ... etc.
  }
}
```
And at `input-normalizer.ts:477`: `const toolTitle = buildToolObservationTitle(tool);` is used instead of the raw `Tool: ${tool.tool}` template.

**The plan.md itself acknowledges this staleness** at line 175:
> "Stale research note: R02/R06 describe generic `Tool: read` observation titles, but current code already has `buildToolObservationTitle()` in `input-normalizer.ts:353`."

**Still-valid findings in R02:**
- Snake_case/camelCase mismatch for `session_title` → `sessionTitle` (`opencode-capture.ts:441–446` vs `input-normalizer.ts:354,453–481`) — **still present**[^1]
- Single `recentContext` entry keeping only first/last exchange — **still present** at `input-normalizer.ts:500–503`
- `FILES` only from edit/write — **still present** at `input-normalizer.ts:508–519`
- Relevance filter dropping semantically relevant but path-mismatched tool calls — **still present** at `input-normalizer.ts:418–428`
- Metadata counts discarded — **still present**, `metadata` destructured but unused in transform

---

### R03 — Git History Mining
**Overall quality: HIGH. Purely forward-looking; no stale assertions.**

R03 contains no assertions about current code state that could be stale. It establishes that git is used only for branch detection via `git rev-parse` (`session-extractor.ts:130–141`) and proposes five bounded commands. All code citations that describe current behavior are verified:
- `file-extractor.ts:24–29` — `FileChange` interface (now enhanced with `_provenance` and `_synthetic` fields)
- `config.ts:143–154,235–240` — `CONFIG.MAX_FILES_IN_MEMORY` default of 10

One forward-looking note: R03 proposes `HEAD~5` as the default diff base. The plan.md at line 181 correctly adds: "Check available rev count first: `git rev-list --count HEAD` to avoid HEAD~5 failure on shallow repos." R03 missed this shallow-clone edge case.

---

### R04 — Spec Folder Mining
**Overall quality: MEDIUM. Framework excellent; folder-state description STALE.**

R04's general framework for parsing spec folder docs (file type roles, parse order, extraction signals, `SpecFolderMiningResult` interface) is sound and remains reference-quality guidance. However, its ground-truth description of the 013 target folder is **entirely stale**.

**R04 stale claim (verbatim):**
> "The target `013-improve-stateless-mode` folder is currently a good example of an early-phase folder: it has `spec.md` and `description.json`, but no `plan.md`, `tasks.md`, `checklist.md`, or `implementation-summary.md` yet."

**Current actual folder state (verified):**

| File / Directory | R04 Said | Current State |
|-----------------|----------|---------------|
| `spec.md` | Present | ✅ Present |
| `description.json` | Present | ✅ Present |
| `plan.md` | Absent | ❌ **Exists** (21.9 KB, full Level-2 plan) |
| `checklist.md` | Absent | ❌ **Exists** |
| `tasks.md` | Absent | Still absent |
| `memory/` | Not mentioned | ❌ **Exists** (5 saved memory files) |
| `scratch/` | Not mentioned | ❌ **Exists** (10+ research + audit files) |

The 013 folder is no longer "early-phase." It is in active implementation phase with a complete plan, verification tracking, and five prior memory saves. R04 was accurate when written but is now out of date by one full spec lifecycle stage.

---

### R05 — Claude Code Session Logs
**Overall quality: HIGH. Empirically grounded; no stale code claims.**

R05 describes live observations from `~/.claude/` filesystem inspection. No current-codebase code paths are claimed to be implemented (correctly noting no Claude-specific transformer exists). All findings are about external data structures and extraction strategy, not internal code state. The multi-source join recommendation (history.jsonl + project transcript + tool-results/) is the strongest Claude-specific guidance in the corpus. Security considerations at section 7 are thorough.

Minor note: R05 doesn't address the privacy risk of extracting `thinking` content blocks. The plan.md adds this at line 210: "**Exclude** `thinking` content blocks from extraction (privacy/size)." This is an important addition not in R05.

---

### R06 — Quality Scoring Gap
**Overall quality: HIGH conceptually; STALE on dedup mechanism.**

R06's core thesis — that scorers overestimate stateless quality because floors and length rescue weak saves — remains correct. The scorer analysis is verified against current code:
- `quality-scorer.ts:130–141`: dedup algorithm compares `TITLE` via Set, confirmed
- `quality-scorer.ts:66–145`: all dimension weights and thresholds verified
- `workflow.ts:113–139`: `ensureMinTriggerPhrases()` floor confirmed
- `validate-memory-quality.ts:192–292`: V1–V9 rules confirmed

**Stale finding — dedup root cause:**

R06 states: "Every tool call becomes an observation with titles like `Tool: read`, `Tool: bash`, `Tool: edit`" citing `input-normalizer.ts:430–450`.

With `buildToolObservationTitle()` now at `input-normalizer.ts:358–393`, the generated titles are now `Read scripts/core/workflow.ts`, `Edit input-normalizer.ts`, `Grep: pattern`, etc. The extreme-repetition case ("5 out of 8 observations titled `Tool: read`") is no longer the accurate baseline.

**What this means for the dedup analysis:**
The dedup problem is now smaller in magnitude but not eliminated. A session that reads the same file multiple times still produces duplicate `Read workflow.ts` entries. The practical dedup ratio has improved from ~2–4 unique / 8 total to something closer to ~5–7 unique / 8 total, but the scorer at `quality-scorer.ts:130–141` remains title-only comparison. The full impact of `buildToolObservationTitle()` on dedup scores has not been re-measured.

**Still-valid findings:**
- Legacy scorer overestimates: file descriptions awarded full credit for "Edited via edit tool" — **confirmed** (`quality-scorer.ts:31–42,88–99`)
- Content length always maxes out at 15/15 — **confirmed** (`quality-scorer.ts:101–111`)
- V8 (cross-spec contamination) is the highest realistic stateless v2 failure — **confirmed** (`validate-memory-quality.ts:264–281`)
- V9 (generic title) second-highest risk — **confirmed** (`validate-memory-quality.ts:283–291`)
- Simulation fallback gets `15/15` for dedup because it has no observations — **confirmed** (`quality-scorer.ts:132–138`)

**Table correction (R06 table row for "Stateless with OpenCode capture"):**
R06's expected legacy range of `~55–75/100` assumed generic `Tool: X` titles. With `buildToolObservationTitle()`, the observationDedup dimension likely scores 8–12/15 instead of 5–9/15, pushing the actual range to approximately `~60–80/100`.

---

### R07 — Input Normalizer Enhancement
**Overall quality: HIGH. Actionable, well-cited, forward-looking.**

R07 correctly identifies that `detectObservationType()` at `file-extractor.ts:92–107` is not called from `transformOpencodeCapture()` and proposes reusing it. The current code confirms this gap: `input-normalizer.ts:464–471` creates `feature` observations without calling `detectObservationType()`. The decision extraction patterns (`DECISION_PATTERNS`) and `preflight`/`postflight` synthesis heuristics are well-designed. No stale claims identified.

---

### R08 — File Detection Enhancement
**Overall quality: MEDIUM-HIGH. Core gap accurate; some interfaces already updated.**

R08's description of the current gap is accurate: `extractFilesFromData()` reads only three sources (FILES, filesModified, observation file arrays) at `file-extractor.ts:104–181`. Git is not consulted.

However, R08 recommends adding `_provenance`, `_synthetic`, and `ACTION` support to the `FileChange` interface, which is **already done** in the current code:

```ts
// file-extractor.ts:24–31 (current)
export interface FileChange {
  FILE_PATH: string;
  DESCRIPTION: string;
  ACTION?: string;
  _provenance?: 'git' | 'spec-folder';
  _synthetic?: boolean;
}
```

The `CollectedDataForFiles` interface at `file-extractor.ts:57–68` also already supports `_provenance?: 'git' | 'spec-folder'` on FILES entries. This means Phase 1 type scaffold work in file-extractor.ts is complete; only the git command execution and merge logic remains unimplemented.

---

### R09 — Observation and Decision Building
**Overall quality: HIGH. Accurately identifies current gaps; no stale claims.**

R09 identifies that `detectSessionCharacteristics()` at `session-extractor.ts:426–437` depends entirely on the observation/prompt/file stream quality, creating a cascading deficit in stateless mode. This is a genuine gap not covered elsewhere. The proposed observation synthesis from git commits (section 1) and the synthetic `preflight`/`postflight` heuristics (R07/R09 combined) are the most implementation-ready contributions in the corpus.

R09's cross-reference to R03 for git commit mining and to R07 for normalizer enhancement shows good inter-report coherence.

---

### R10 — Integration Architecture
**Overall quality: HIGH. Strongest architectural analysis; well-supported.**

Addressed in dedicated section 5 below.

---

## 2. Staleness Detection

### 2.1 R02: Generic `Tool: read` Titles — **CONFIRMED STALE**

**Claim:** `title: \`Tool: ${tool.tool}\`` in tool-call observations.

**Current code:**
```ts
// input-normalizer.ts:358–393
function buildToolObservationTitle(tool: CaptureToolCall): string {
  const toolName = tool.tool || 'unknown';
  const input = tool.input || {};
  if (tool.title && tool.title.length > 10 && !/^Tool:\s/i.test(tool.title)) {
    return tool.title.substring(0, 80);
  }
  switch (toolName.toLowerCase()) {
    case 'read': return shortPath ? `Read ${shortPath}` : 'Read file';
    case 'edit': return shortPath ? `Edit ${shortPath}` : 'Edit file';
    // ...
  }
}
// input-normalizer.ts:477
const toolTitle = buildToolObservationTitle(tool);
```

**Verdict:** R02's tool-title section is stale. The `buildToolObservationTitle()` function did not exist when R02 was written. The function is called at `input-normalizer.ts:477` and replaces the raw `` `Tool: ${tool.tool}` `` template. The plan.md self-flags this at line 175.

**Remaining R02 concerns that are still valid:**
- snake_case/camelCase mismatch for session metadata fields (plan.md Phase 0, task still unchecked)
- Single `recentContext` entry (plan.md Phase 0/1 concern)
- `FILES` limited to edit/write only

---

### 2.2 R04: Spec Folder "Early Phase" Description — **CONFIRMED STALE**

**R04 claim:** The target `013-improve-stateless-mode` folder has `spec.md` and `description.json` but no `plan.md`, `tasks.md`, `checklist.md`.

**Current folder contents (verified):**
- `plan.md` — exists, 21.9 KB
- `checklist.md` — exists
- `memory/` — 5 saved memory files (`08-03-26_21-07__...` through `08-03-26_21-11__...`)
- `scratch/` — R01–R10, 5 audit files, `.gitkeep`

**Verdict:** R04 was accurate when produced (early research phase) but is now a full spec lifecycle stage behind. The folder is in active implementation phase. R04's framework guidance remains valid; only the specific example state is wrong. Any new spec-folder-extractor implementation must be tested against a folder like 013 (with plan.md + checklist.md), not the sparse state R04 used as its example.

---

### 2.3 R06: Dedup Analysis via Generic Tool Titles — **PARTIALLY STALE**

**R06 claim:** "Every tool call becomes an observation with titles like `Tool: read`, `Tool: bash`, `Tool: edit`."

**Current code:** `buildToolObservationTitle()` at `input-normalizer.ts:358–393` generates file-path-aware titles. The old generic template is replaced.

**Verdict:** The specific mechanism R06 described for poor dedup (identical `Tool: X` strings) is now partially mitigated. However, the dedup algorithm itself (`quality-scorer.ts:130–141`) has not changed and still uses only the title string. Sessions reading the same file multiple times will still generate duplicate `Read scripts/core/workflow.ts` titles. The quantitative dedup ratios R06 reports (`4/8 = 0.50`) are now over-pessimistic; actual ratios are likely 10–20 percentage points higher.

The broader conclusion (scorer overestimates, semantic thinness is the real problem) remains **fully valid**.

---

## 3. Cross-Reference Accuracy: R01's Five Data Loss Points vs. plan.md

The plan.md root cause table at lines 38–44 directly encodes R01's five loss points. Below is a point-by-point verification:

| R01 Loss Point | plan.md Claim | Code Line (R01) | Code Line (current) | Match? | Phase 0 Status |
|---|---|---|---|---|---|
| 1. JSON normalization skipped | "`CONFIG.DATA_FILE = null` — JSON branch skipped" | `data-loader.ts:80–140` | `data-loader.ts:80–140` | ✅ Exact | N/A (by design) |
| 2. OpenCode transform produces thin data | "80-char titles, edit/write-only files, no decisions" | `input-normalizer.ts:353–482` | `input-normalizer.ts:399–529` | ✅ Concept correct; lines drifted | Partially addressed (buildToolObservationTitle) |
| 3. Missing `SPEC_FOLDER` disables related-doc enrichment | `collect-session-data.ts:725–739` | `collect-session-data.ts:725–730` | `collect-session-data.ts:733–734` | ✅ Correct root cause; **now fixed** | ✅ Implemented (backfill present) |
| 4. Learning telemetry collapses to null | `collect-session-data.ts:198–304` | `collect-session-data.ts:198–304` | `collect-session-data.ts:186–303` | ✅ Exact | Not yet addressed |
| 5. Simulation fallback loses all semantic content | `data-loader.ts:180–186` | `data-loader.ts:180–186` | `data-loader.ts:180–186` | ✅ Exact | Not yet addressed (by design: last resort) |

**Discrepancy detected — loss point 3:**

R01 states: "specFolderPath becomes `null` because it is only built from `collectedData.SPEC_FOLDER`" citing `collect-session-data.ts:725–730`.

The current code at `collect-session-data.ts:733–734` shows the Phase 0 fix is live:
```ts
// collect-session-data.ts:733–734
if (!collectedData.SPEC_FOLDER && folderName) {
  collectedData.SPEC_FOLDER = folderName;
}
```

This means `specFolderPath` computation at `:737–744` now correctly resolves the spec folder in stateless mode when a CLI folder name is provided. R01's diagnosis was correct; the fix has been applied. The plan.md checklist still shows this task unchecked (`- [ ] Backfill SPEC_FOLDER...`), which is inaccurate — the checklist needs to be updated.

**Additional discrepancy — plan.md summary vs. R01:**

The plan.md summary at line 46 states:
> "Quality scoring gap analysis [R06] revealed the legacy scorer **overestimates** stateless quality (~55–75, not ~30)"

But the plan.md goal is to raise quality from "~30/100 to 60+/100." This is internally inconsistent: if the scorer already gives 55–75 in stateless mode, the 60+ target is already partially met on paper. The genuine gap is **semantic quality**, not numeric score. R06 correctly identifies this as the crux at its conclusion (section 5). R01 doesn't analyze scoring at all, which is appropriate to its scope. The plan.md correctly frames both: the ~30 figure likely reflects user-perceived utility, not the legacy numeric score.

---

## 4. Completeness: Missing Research Areas

### 4.1 V-Rule Interaction with Enriched Content — **Not Covered**

R06 analyzes V1–V9 against current sparse stateless output. No research addresses what happens when the proposed enrichment layer (spec folder mining + git mining) produces synthetic observations referencing external spec IDs, file paths, or plans that contain foreign spec ID patterns.

Specifically: the V8 rule at `validate-memory-quality.ts:264–281` uses this logic:
```ts
dominatesForeignSpec = strongestForeignMentions >= 3 && strongestForeignMentions >= currentSpecMentions + 2;
```

A spec-folder-extractor that includes content from `plan.md` referencing parent spec IDs (e.g., `022-hybrid-rag-fusion`) could introduce V8 failures if those IDs appear 3+ times and the current spec ID appears less often. No research evaluates this risk.

**Recommended addition:** A targeted analysis of how enriched content from `plan.md`, parent-spec references, and git commit messages (which often include spec IDs) interacts with V8 detection.

### 4.2 Dedup Algorithm Coverage After `buildToolObservationTitle()` — **Not Re-Measured**

R06 establishes that dedup scores suffer from repeated generic titles. The introduction of `buildToolObservationTitle()` partially addresses this but hasn't been re-measured. The dedup algorithm at `quality-scorer.ts:130–141` remains unchanged (title-only comparison). A session that reads `workflow.ts` three times still generates three `Read workflow.ts` entries.

Missing: empirical re-measurement of actual dedup ratios with `buildToolObservationTitle()` active. The plan.md at Phase 2 line 196 says "Only add changes if dedup ratio still below 0.7" — but no measurement has been done to establish the current baseline.

### 4.3 Provenance Marker Downstream Consumption — **Not Covered**

R08 proposes `_provenance?: 'git' | 'spec-folder'` on `FileChange` and `CollectedDataForFiles`, and these type fields are already implemented in `file-extractor.ts:24–31,57–68`. However, no research covers how downstream consumers (quality scorer, renderer, validate-memory-quality) handle or ignore provenance markers. Questions not answered:
- Does the legacy scorer penalize or reward provenance-marked entries differently? (No — it ignores `_provenance`)
- Does the renderer expose provenance in the output? (Unclear without renderer analysis)
- Can validate-memory-quality distinguish synthetic vs real observations to avoid penalizing thin synthetic content? (No — V-rules are content-based, not provenance-based)

### 4.4 `detectObservationType()` Integration Path — **Identified but Not Verified**

R07 recommends reusing `detectObservationType()` from `file-extractor.ts:92–107` inside the input normalizer. No research verifies whether this function is already reachable from `input-normalizer.ts` (circular import risk) or whether it needs to be extracted to a shared utility. The plan.md mentions this as Phase 1 work but doesn't verify the import topology.

### 4.5 `ensureMinTriggerPhrases()` Interaction with Enrichment — **Not Covered**

R06 identifies `ensureMinTriggerPhrases()` at `workflow.ts:113–139` as the floor preventing trigger-phrase collapse. No research analyzes whether enriched data (spec.md frontmatter `trigger_phrases` directly available) would make this floor redundant, or whether there is a risk of double-counting when both the extractor and the floor contribute trigger phrases.

### 4.6 Simulation-to-Enriched Fallback Ordering — **Partially Covered**

R10 proposes making simulation the final fallback after capture + enrichment. R03 and R09 both support this. However, no research analyzes the case where stateless enrichment produces data but git is unavailable and spec folder is empty — i.e., the "enrichment layer returns nothing" edge case. The plan.md's rollback procedure at lines 288–290 only addresses removing the enrichment call, not the case where enrichment runs but produces empty output.

---

## 5. R10 Integration Architecture: Assessment of Option B

### Architecture Summary

R10 recommends **Option B** (dedicated enrichment layer between data-loader and fan-out) as primary, with Option A (alternate acquisition inside data-loader) for Claude Code capture only, and Option C (sparse-data guards inside collect-session-data) reserved for safety nets.

### Justification Assessment

**Is Option B well-justified against alternatives?**

**Against Option A (all enrichment inside data-loader.ts):**

R10 argues: "Putting all mining inside `data-loader.ts` would overload one module with acquisition, parsing, git execution, normalization, and merge policy."

This is **well-justified**. Current `data-loader.ts:76–186` already handles three code paths (file, OpenCode, simulation). Adding spec-folder parsing and git command execution would violate single-responsibility and make the stateful/stateless branching harder to reason about. The module boundary argument is sound.

**Against Option C (enrichment inside collect-session-data.ts):**

R10 argues at line 67: "Because `collectSessionData()` is only one branch of the `Promise.all()` fan-out. If mining happens there, `extractDecisions()` and `extractConversations()` still operate on the thin pre-enriched payload."

This is **precisely correct**. The fan-out at `workflow.ts:488–506` (R10 cites `:423–549`) passes the same `collectedData` object to four extractors simultaneously:
```ts
// workflow.ts (R10 citing :500–548)
await Promise.all([
  collectSessionData(collectedData, specFolderName),
  extractConversations(collectedData),
  extractDecisions(collectedData),
  extractDiagrams(collectedData)
])
```
Enriching only inside `collectSessionData()` means `extractDecisions()` and `extractConversations()` see un-enriched data. Option C is ruled out correctly.

**Is Option B placement (AFTER guards, BEFORE fan-out) correct?**

The plan.md adds a critical constraint at lines 112–114 not present in R10:
> "Critical timing: Enrichment runs AFTER the existing contamination/alignment guards (workflow.ts:443–472) and spec folder resolution, not immediately after data loading. This prevents synthetic files from masking cross-spec contamination."

R10 proposes insertion "immediately after `collectedData` is loaded" (section 4). The plan.md refines this to after the alignment guards. This is a meaningful correction: running enrichment before the contamination guards could cause git-derived `FILES` from the wrong spec area to pass the guard unchecked. The plan.md's refinement is correct and represents progress beyond R10.

**Hybrid recommendation accuracy:**

R10's recommendation to keep Claude Code capture in the loader tier (Option A) rather than the enrichment tier is correct because it is an alternate primary conversation source, not metadata augmentation. The distinction between "acquiring primary evidence" (loader) and "augmenting sparse data" (enrichment) is architecturally sound.

**Weaknesses in R10's Option B justification:**

1. R10 doesn't analyze what happens when enrichment itself is slow (git commands on large repos). The plan.md adds: "Use bounded commands (`status`, `name-only`, `--stat`, last N commits), parallelize git/spec reads inside enrichment." This concern was raised in R03 with empirical timings (`git status --porcelain`: 102ms, `git diff --stat HEAD~5`: 179ms on this repo) but wasn't integrated into R10's risk section.

2. R10's merge rules (section 6) don't specify what happens when `collectedData` is a simulation marker (`_isSimulation: true`). Should enrichment still run? Running enrichment on simulation output would produce a hybrid artifact that is neither clearly synthetic nor real. The plan.md doesn't address this edge case either.

3. R10 doesn't mention the provenance/V8 interaction risk: enriched observations from spec folder docs that reference parent spec IDs could trigger V8 cross-contamination detection (`validate-memory-quality.ts:264–281`). This was not flagged as a risk.

**Overall verdict on R10:** Option B is the correct choice for the reasons stated. The fan-out argument against Option C is decisive and code-verified. The module-responsibility argument against Option A is sound. The hybrid with Option A for Claude capture is well-designed. R10 is the strongest architectural analysis in the corpus, with the caveat that the precise insertion point was refined by the plan.md.

---

## 6. Summary: Stale vs. Still-Valid by Report

| Report | Status | Key Stale Finding | Key Valid Finding |
|--------|--------|-------------------|-------------------|
| R01 | ✅ Valid (minor drift) | Loss point 3 is now fixed | 5-loss-point taxonomy remains canonical |
| R02 | ⚠️ Partially stale | Generic `Tool: X` titles (superseded by `buildToolObservationTitle()`) | snake_case/camelCase mismatch, single recentContext, FILES limited to edit/write |
| R03 | ✅ Valid | Missed shallow-clone edge case | Git barely used, 5 bounded commands, performance data |
| R04 | ⚠️ Stale on folder state | "Early-phase with only spec.md + description.json" | Parsing framework, SpecFolderMiningResult interface |
| R05 | ✅ Valid | Missing `thinking` block exclusion | Multi-source join architecture for Claude logs |
| R06 | ⚠️ Partially stale | Dedup root cause (generic Tool: X titles) | Scorer overestimates, semantic thinness is real issue, V8/V9 risks |
| R07 | ✅ Valid | None | detectObservationType reuse, decision extraction patterns, preflight synthesis |
| R08 | ✅ Valid (interfaces already updated) | _provenance/_synthetic interfaces (already implemented) | git Source 4 logic, ACTION field preservation |
| R09 | ✅ Valid | None | detectSessionCharacteristics cascade effect, git commit as strongest stateless signal |
| R10 | ✅ Valid (placement refined) | Insertion point was pre-guards (refined by plan.md) | Option B fan-out argument, Option A for Claude capture, Option C ruled out |

---

## 7. Confidence Assessment

**High confidence (code-verified):**
- `buildToolObservationTitle()` exists and is called in current `input-normalizer.ts:358,477`
- Phase 0 SPEC_FOLDER backfill is live at `collect-session-data.ts:733–734`
- `_provenance` and `_synthetic` fields already in `FileChange` at `file-extractor.ts:24–31`
- V1–V9 validation rules match R06's description at `validate-memory-quality.ts:198–299`
- Fan-out architecture matches R10's description (four parallel extractors on same `collectedData`)
- R04's folder-state description is wrong (actual folder contents verified)

**Medium confidence (code-consistent but not exhaustively traced):**
- Dedup ratios have improved but not been re-measured since `buildToolObservationTitle()` addition
- V8 risk from enriched spec content referencing parent spec IDs (plausible, not tested)

**Inferred (reasonable but not code-verified):**
- The plan.md checklist for Phase 0 SPEC_FOLDER backfill should be marked complete (implementation visible in code)
- Quality score range update for OpenCode stateless mode: approximately `~60–80/100` with `buildToolObservationTitle()` active, not the `~55–75/100` R06 projected

---

## Footnotes

[^1]: **snake_case/camelCase mismatch still present:** `opencode-capture.ts` returns `session_title`, `session_id`, `captured_at`; `input-normalizer.ts:OpencodeCapture` interface (lines 106–113) expects `sessionTitle`, `sessionId`, `capturedAt`. The Phase 0 fix for this field mapping is still listed as unchecked in plan.md:134–137. The `TransformedCapture` result at `input-normalizer.ts:521–529` returns `_sessionId: capture.sessionId` and `_capturedAt: capture.capturedAt` — both will be `undefined` until the loader normalizes snake_case → camelCase before passing to `transformOpencodeCapture()`.
