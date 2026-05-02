# Root-Cause Analysis: Memory Corruption in `013-improve-stateless-mode`

**Investigation date:** 2026-03-26  
**Scope:** Four anomalies in the five memory files under `013-improve-stateless-mode/memory/`  
**Status:** Evidence-complete, no files modified

---

## Executive Summary

All five memory files in `013-improve-stateless-mode/memory/` are corrupted by a cascade of four independent bugs in the stateless save pipeline. The root cause of three of the four bugs is the **same single session problem**: `opencode-capture.ts` picked up an old OpenCode session (last active Feb 20, 2026 — working on `036-skill-graphs`) and passed it through `transformOpencodeCapture()` as if it were the current `013-improve-stateless-mode` session. Because the relevance keyword filter uses a parent-folder segment (`system-spec-kit`) that matches both specs, the 036-skill-graphs content was not blocked. The fourth bug (quality_score discrepancy) is an independent design defect: two scoring systems with different scales write to two different fields using the same conceptual name.

---

## Affected Files

| File | Anomalies Present |
|------|------------------|
| `memory/08-03-26_21-07__improve-stateless-mode-quality.md` | All 4 |
| `memory/08-03-26_21-07__improve-stateless-mode-quality-1.md` | All 4 (same-minute duplicate) |
| `memory/08-03-26_21-08__improve-stateless-mode-quality.md` | All 4 |
| `memory/08-03-26_21-09__improve-stateless-mode-quality.md` | All 4 |
| `memory/08-03-26_21-11__improve-stateless-mode-quality.md` | All 4 |
| `memory/metadata.json` | Bugs 2, 3 |

---

## Bug 1 — Cross-Spec Contamination: `036-skill-graphs` / SGQS Content in `013` Memory

### Observed Evidence

Memory file `08-03-26_21-07__improve-stateless-mode-quality.md` line 79:
```
**Summary:** Based on an analysis of the `036-skill-graphs` implementation and its
associated scripts, the Skill Graph system and its memory integration consist of an
elegant, entirely in-memory graph database (SG...
```

Line 192 (OVERVIEW section):
```
Based on an analysis of the `036-skill-graphs` implementation and its associated scripts,
the Skill Graph system and its memory integration consist of an elegant, entirely
in-memory graph database (SGQS) that enriches the existing semantic memory pipeline...
```

Lines 102, 133–159, 213–220 list exclusively `036-skill-graphs` files:
- `sgqs-query.ts`, `handlers/index.ts`, `tool-schemas.ts`, `causal-tools.ts`,
  `scripts/sgqs/index.ts`, `tests/prediction-error-gate.vitest.ts`, etc.

Line 122 (Key Topics): includes `skill graph`, `skill`, `graph` — unrelated to stateless mode.

### Root Cause A: `recentContext.learning` is Never Relevance-Filtered

In `scripts/utils/input-normalizer.ts:500-503`:

```typescript
const recentContext: RecentContext[] = exchanges.length > 0 ? [{
  request: exchanges[0].userInput || sessionTitle || 'OpenCode session',
  learning: exchanges[exchanges.length - 1]?.assistantResponse || ''
}] : [];
```

`recentContext[0].learning` is set to **the last exchange's full assistant response** with zero spec-folder relevance checking. The relevance filter at lines 452–462 only guards the `observations[]`-building loop:

```typescript
// lines 452-462: Only applied inside the for-loop for observations
if (specFolderHint && relevanceKeywords.length > 0) {
  const responseRelevant = relevanceKeywords.some(kw =>
    lowerResponse.includes(kw.toLowerCase()));
  const inputRelevant = ex.userInput ? ...;
  if (!responseRelevant && !inputRelevant) {
    continue; // skip THIS EXCHANGE from observations[]
  }
}
```

The `recentContext` is constructed at lines 500–503 — **outside** this loop, reading `exchanges[exchanges.length - 1]` directly from the raw (unfiltered) array.

Then in `scripts/extractors/collect-session-data.ts:697-699`:

```typescript
const SUMMARY: string = (sessionInfo as RecentContextEntry).learning
  || observations.slice(0, 3).map((o) => o.narrative)...
  || 'Session focused on implementing and testing features.';
```

`sessionInfo` is `collectedData.recentContext?.[0]`, so `SUMMARY = recentContext[0].learning` = the full 036-skill-graphs analysis text. This propagates to the `OVERVIEW` section and `Context Summary`.

### Root Cause B: Relevance Keywords Include Broad Parent-Folder Segments

In `scripts/utils/input-normalizer.ts:408-416`:

```typescript
const segments = specFolderHint.split('/').map(s => s.replace(/^\d+--?/, ''));
relevanceKeywords.push(...segments.filter(s => s.length > 2));
relevanceKeywords.push(specFolderHint);
```

For `specFolderHint = "system-spec-kit/022-hybrid-rag-fusion/013-improve-stateless-mode"`, the extracted keywords are:
- `"system-spec-kit"` — matches every file under `.opencode/skill/system-spec-kit/`
- `"hybrid-rag-fusion"`
- `"improve-stateless-mode"`
- the full path string

Because `"system-spec-kit"` is a parent-folder keyword, **any** tool call that touched any file under `.opencode/skill/system-spec-kit/...` passes `isToolRelevant()`:

```typescript
function isToolRelevant(tool: CaptureToolCall): boolean {
  const combined = `${filePath} ${title}`.toLowerCase();
  return relevanceKeywords.some(kw => combined.includes(kw.toLowerCase()));
}
```

`sgqs-query.ts`, `handlers/index.ts`, `tool-schemas.ts` all resolve to paths like `.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts` — which contains the string `system-spec-kit`. These pass the filter and populate `observations[]` and `FILES[]` with 036-skill-graphs content.

### Root Cause C: Alignment Check is Bypassed When `allFilePaths` is Empty

In `scripts/core/workflow.ts:594-609` (Step 1.5):

```typescript
const allFilePaths = (collectedData.observations || [])
  .flatMap((obs) => obs.files || [])
  .concat((collectedData.FILES || [])...);

const totalPaths = allFilePaths.length;
if (totalPaths > 0 && specKeywords.length > 0) {
  // alignment check fires only here
  const overlapRatio = relevantPaths.length / totalPaths;
  if (overlapRatio < 0.05) { throw new Error('ALIGNMENT_BLOCK...'); }
}
```

If `collectedData.observations = []` and `collectedData.FILES = []` at that point (e.g., OpenCode capture returned no data, or all observations were filtered), `totalPaths = 0` → the condition `if (totalPaths > 0 ...)` is false → the check is skipped entirely. The contaminated `recentContext.learning` still flows through unimpeded.

Additionally, the alignment check uses only the **leaf folder** keywords:
- `"013-improve-stateless-mode"` → strip prefix → `"improve-stateless-mode"` → split on `-` → `["improve", "stateless", "mode"]`

None of the 036-skill-graphs file paths contain "improve", "stateless", or "mode", so even if `totalPaths > 0`, `overlapRatio = 0/N = 0 < 0.05` → would block. But as noted, with zero files at Step 1.5, the block is never reached.

### Root Cause D: Wrong OpenCode Session Selected

In `scripts/extractors/opencode-capture.ts:430-437`:

```typescript
const session = await getCurrentSession(projectId);
// ↑ calls getRecentSessions(projectId, 1) which sorts by session.updated DESC
```

`getCurrentSession` retrieves the session most recently **updated** (not most recently messaged). The `036-skill-graphs` session from Feb 20 could have a higher `updated` epoch than any newer, shorter session, making it appear as the "current" session. Its message exchanges are from Feb 20.

---

## Bug 2 — Multiple Near-Duplicate Files Emitted Within Minutes

### Observed Evidence

Five files generated on 2026-03-26 between 21:07 and 21:11 (4 minutes):
```
08-03-26_21-07__improve-stateless-mode-quality.md    # Session ID: session-1773000425427-f4b9ef046
08-03-26_21-07__improve-stateless-mode-quality-1.md  # Session ID: session-1773000436158-f60cca50e
08-03-26_21-08__improve-stateless-mode-quality.md    # Session ID: session-1773000517086-645fa1102
08-03-26_21-09__improve-stateless-mode-quality.md    # (separate session ID)
08-03-26_21-11__improve-stateless-mode-quality.md    # Session ID: session-1773000718765-9ac5f2d75
```

`metadata.json` line 16: `"duplicatesRemoved": 1` — confirming the filter pipeline detected 1 duplicate **within a single invocation's messages**, not across files.

### Root Cause A: Unique Session ID + Epoch Break SHA-256 Dedup Guard

In `scripts/core/file-writer.ts:30-53`:

```typescript
async function checkForDuplicateContent(contextDir, content, filename) {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  for (const existing of entries) {
    const existingHash = crypto.createHash('sha256').update(existingContent).digest('hex');
    if (hash === existingHash) {
      throw new Error(`Duplicate content: ${filename} matches existing ${existing}`);
    }
  }
}
```

Each invocation generates a **unique** `SESSION_ID` at `collect-session-data.ts:726`:
```typescript
const sessionId: string = generateSessionId();
// → "session-{Date.now()}-{randomHex}"
```

And a unique `createdAtEpoch` at line 728:
```typescript
const createdAtEpoch: number = Math.floor(Date.now() / 1000);
```

Both appear in the rendered markdown (`Session ID`, `Created At (Epoch)`, `Last Accessed (Epoch)`). This makes every file's SHA-256 hash unique even though 100% of the semantic content is identical. The content-dedup guard is therefore systematically defeated by design.

### Root Cause B: In-Process Lock Offers No Cross-Process Protection

In `scripts/core/workflow.ts:366-382`:

```typescript
let workflowRunQueue: Promise<void> = Promise.resolve(); // module-level, not file-system

async function withWorkflowRunLock<TResult>(operation) {
  const priorRun = workflowRunQueue;
  // ... sequential queue within ONE process only
}
```

`workflowRunQueue` is a module-level in-memory Promise. Each `node generate-context.js` invocation is a separate OS process with its own JavaScript heap. The lock is completely invisible across processes. No file-system lock, no advisory lock, no lock file exists to prevent rapid re-invocation.

### Root Cause C: `ensureUniqueMemoryFilename` Prevents Only Same-Minute Same-Name Collisions

In `scripts/utils/slug-utils.ts:139-164`:

```typescript
export function ensureUniqueMemoryFilename(contextDir, filename) {
  if (!existing.has(filename)) return filename;
  for (let i = 1; i <= 100; i++) {
    const candidate = `${base}-${i}${ext}`;
    if (!existing.has(candidate)) return candidate;
  }
}
```

This only appends `-1`, `-2` etc. when the exact filename already exists. Two invocations at 21:07 within the same minute collide on the name (producing the `-1` suffix file). Invocations at 21:08, 21:09, and 21:11 each get a distinct time prefix and no suffix, so five unique filenames are produced for identical content.

---

## Bug 3 — `quality_score: 30` (metadata.json) Conflicts With `quality_score: 0.85` (frontmatter)

### Observed Evidence

`memory/metadata.json` lines 12-13:
```json
"qualityScore": 30,
```

All five memory files, YAML frontmatter lines 10-12:
```yaml
quality_score: 0.85
quality_flags:
  - "has_tool_state_mismatch"
```

### Root Cause: Two Scoring Systems — Different Scales, Different Algorithms, Same Field Name

**Score 1 — `metadata.json qualityScore: 30` (0–100 integer scale)**  
Origin: `scripts/lib/content-filter.ts` → `filterPipeline.getStats().qualityScore`  
Written at `scripts/core/workflow.ts:934-954`:
```typescript
'metadata.json': JSON.stringify({
  ...
  filtering: filterPipeline.getStats(),  // ← contains qualityScore
  ...
})
```
This measures **input message content quality**: noise ratio, duplicate ratio, total messages processed. With only 2 messages and 1 duplicate (`metadata.json`: `totalProcessed: 2`, `duplicatesRemoved: 1`), the content filter legitimately scores 30/100.

**Score 2 — frontmatter `quality_score: 0.85` (0.0–1.0 float scale)**  
Origin: `scripts/extractors/quality-scorer.ts` → `scoreMemoryQualityV2()`  
Written at `scripts/core/workflow.ts:1000-1008`:
```typescript
const qualityV2 = scoreMemoryQualityV2({
  content: files[ctxFilename],
  validatorSignals: qualitySignals,  // from validateMemoryQualityContent()
  hadContamination,
  messageCount: conversations.MESSAGES.length,
  toolCount: sessionData.TOOL_COUNT,
  decisionCount: decisions.DECISIONS.length,
});
files[ctxFilename] = injectQualityMetadata(files[ctxFilename], qualityV2.qualityScore, qualityV2.qualityFlags);
```
This measures **rendered markdown structural quality**: does the content pass V-rule validators? Is the template properly populated? It does not check semantic density or whether the content is from the right spec.

**Score 3 — logged only, not persisted (0–100 integer, legacy)**  
The legacy `scoreMemoryQuality()` runs at `workflow.ts:1014-1020` and is only emitted to console at line 1021:
```typescript
log(`   Memory quality score: ${qualityResult.score}/100 (legacy), ${qualityV2.qualityScore.toFixed(2)} (v2)`);
```

Three scorers exist. Two persist their results using the same conceptual name ("quality_score") in two different locations, using two different scales (0–100 vs 0.0–1.0), measuring two completely different things. No field in either output indicates which scale or which algorithm applies.

---

## Bug 4 — Session Date 2026-03-08 Differs From Last Activity 2026-02-20 by 16 Days

### Observed Evidence

All five memory files, SESSION SUMMARY table:
```
| Session Date   | 2026-03-08                       |
| Last Activity  | 2026-02-20T11:27:19.723Z         |
```

Epoch for Last Activity: `1740048439723 ms` = 2026-02-20T11:27:19.723 UTC.  
Epoch for Session Date: `2026-03-08` = 16 days later.

### Root Cause: Two Timestamps From Different Clocks

**Session Date (`DATE`)** — wall clock at script execution time  
`scripts/extractors/collect-session-data.ts:666`:
```typescript
const now = Date.now();
const dateOnly: string = formatTimestamp(now, 'date-dutch');
```
`now` = current OS time when the save runs. On 2026-03-08, this produces `"08-03-26"` (Dutch format DD-MM-YY = 2026-03-08). ✓ correct.

**Last Activity (`LAST_ACTIVITY_TIMESTAMP`)** — embedded timestamp from OpenCode session storage  
`scripts/extractors/collect-session-data.ts:582-585`:
```typescript
const lastPrompt = userPrompts[userPrompts.length - 1];
const lastActivity = lastPrompt?.timestamp
  ? new Date(lastPrompt.timestamp).toISOString()
  : new Date().toISOString();
```

`userPrompts[last].timestamp` comes from `input-normalizer.ts:430-432`:
```typescript
const userPrompts: UserPrompt[] = exchanges.map((ex: CaptureExchange): UserPrompt => ({
  prompt: ex.userInput || '',
  timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
}));
```

`ex.timestamp` comes from `opencode-capture.ts:493`:
```typescript
exchanges.unshift({
  ...
  timestamp: userMsg.created,   // ← OpenCode storage msg.time.created
  ...
});
```

`userMsg.created` = `msg.time.created` from the OpenCode session file — the epoch when that user message was CREATED in the session. For the captured session (a `036-skill-graphs` session active on Feb 20, 2026), the last user message `time.created = 1740048439723 ms = 2026-02-20T11:27:19.723Z`.

**The session selection mechanism** (`opencode-capture.ts:261-264`):
```typescript
async function getCurrentSession(projectId: string): Promise<SessionInfo | null> {
  const sessions = await getRecentSessions(projectId, 1);
  return sessions[0] || null;
}
// getRecentSessions sorts by session.updated DESC
```

The session selected is the one with the highest `time.updated` epoch — which is not necessarily the session with the most recent message exchanges. The 036-skill-graphs session could have been "updated" (re-opened, viewed, or had metadata modified) more recently than any newer short session, causing it to be selected on 2026-03-08 despite its exchanges being from 2026-02-20.

**Effect**: `DATE` = "today" (2026-03-08). `LAST_ACTIVITY_TIMESTAMP` = Feb 20 from the stale session. Gap = 16 days.

---

## Data Flow Diagram

```
node generate-context.js 013-improve-stateless-mode
         │
         ▼ generate-context.ts:429
    parseArguments() → CONFIG.DATA_FILE = null (stateless mode)
         │
         ▼ data-loader.ts:76-186
    loadCollectedData()
         │
         ├─ JSON branch: SKIPPED (DATA_FILE = null)
         │
         ▼
    opencode-capture.captureConversation(20, PROJECT_ROOT)
         │
         ├─ getProjectId() → finds project in ~/.local/share/opencode/storage
         │
         ├─ getCurrentSession() → sorts sessions by time.updated DESC
         │    └─ picks WRONG session: 036-skill-graphs (updated recently,
         │       but messages from 2026-02-20)        ← BUG 4 source
         │
         ▼ input-normalizer.ts:399-529
    transformOpencodeCapture(conversation, "013-improve-stateless-mode")
         │
         ├─ relevanceKeywords = ["system-spec-kit", "hybrid-rag-fusion",
         │                       "improve-stateless-mode", fullPath]
         │
         ├─ filteredToolCalls: sgqs-query.ts PASSES because path contains
         │   "system-spec-kit"                        ← BUG 1B source
         │
         ├─ observations[]: exchange filter may skip 036-skill-graphs
         │   responses (if they don't mention relevant terms), but...
         │
         └─ recentContext[0].learning = exchanges[last].assistantResponse
              = "Based on an analysis of 036-skill-graphs..."  ← BUG 1A source
              (NO RELEVANCE FILTER APPLIED HERE)
         │
         ▼ workflow.ts:578-609 (Step 1.5)
    Alignment check:
         │
         └─ if (totalPaths == 0) → CHECK SKIPPED      ← BUG 1C source
         │   (empty observations + empty FILES bypass the guard)
         │
         ▼ collect-session-data.ts:697-699
    SUMMARY = recentContext[0].learning               ← 036-skill-graphs text flows in
         │
         ├─ DATE = formatTimestamp(Date.now()) = "2026-03-08"
         │
         ├─ LAST_ACTIVITY = lastPrompt.timestamp
         │    = userMsg.created from Feb 20 session   ← BUG 4 manifests (16-day gap)
         │
         ▼ workflow.ts:886-955
    populateTemplate() + metadata.json
         │
         ├─ metadata.json qualityScore: filterPipeline.getStats() = 30   ← BUG 3A
         │
         ▼ workflow.ts:1000-1008
    injectQualityMetadata(content, qualityV2.qualityScore, ...)
         └─ frontmatter quality_score: 0.85  (different scale, different metric) ← BUG 3B
         │
         ▼ file-writer.ts:30-53
    checkForDuplicateContent():
         └─ SHA-256 differs (unique SESSION_ID/epoch per invocation) → PASSES ← BUG 2A
         │
         ▼ slug-utils.ts:139-164
    ensureUniqueMemoryFilename():
         └─ same-minute: adds "-1" suffix
         └─ different minutes: unique prefix, no block  ← BUG 2B-C
         │
         ▼ 5 files written to memory/
```

---

## Root-Cause Hypothesis List

### H1 — `recentContext.learning` Bypass (Primary Contamination Source)
**Hypothesis:** `transformOpencodeCapture()` constructs `recentContext[0].learning` from the raw last exchange's `assistantResponse` at `input-normalizer.ts:500-503` without applying the spec-folder relevance filter. Any assistant response from the captured session's last exchange — regardless of which spec it discusses — flows directly into `SUMMARY` via `collect-session-data.ts:697` and then into the OVERVIEW and Context Summary sections of the memory file.

**Evidence:** Memory file line 79 / line 192: 036-skill-graphs analysis text appears verbatim as SUMMARY. Filter loop at `input-normalizer.ts:444-472` applies the relevance check only inside its `for` loop; `recentContext` is built at lines 500-503 outside that loop.

### H2 — Broad Parent-Folder Keyword Allows SGQS File Leakage (Secondary Contamination)
**Hypothesis:** The relevance keyword `"system-spec-kit"` (extracted from the spec folder path at `input-normalizer.ts:412`) is too broad — it matches every file under `.opencode/skill/system-spec-kit/`, including all 036-skill-graphs implementation files (`sgqs-query.ts`, `handlers/index.ts`, `tool-schemas.ts`, etc.). `isToolRelevant()` at lines 418–424 therefore passes these tool calls, letting their file paths populate `observations[]`, `FILES[]`, and the IMPLEMENTATION GUIDE section.

**Evidence:** Memory file lines 102, 133–159, 211–222 all list `system-spec-kit/mcp_server/*` files from 036-skill-graphs work. These paths contain the string `system-spec-kit`, which matches the keyword.

### H3 — Stale Session Selection Produces Wrong-Project Exchanges (Primary Cause of Bug 4 + Bug 1)
**Hypothesis:** `getCurrentSession()` in `opencode-capture.ts:261-264` selects the session with the highest `time.updated` epoch, not the session with the most recent message exchanges. The 036-skill-graphs session (which was working on `sgqs-query.ts` et al.) has a high `updated` value but its message exchanges are timestamped from 2026-02-20T11:27:19.723Z — 16 days before the save runs on 2026-03-08. This single wrong-session selection is the root cause of both the 16-day Last Activity gap (Bug 4) and the 036-skill-graphs contamination (Bug 1).

**Evidence:** `opencode-capture.ts:253-255` sorts by `b.updated - a.updated`. Exchange timestamp `1740048439723ms = 2026-02-20T11:27:19.723Z` appears as `LAST_ACTIVITY_TIMESTAMP` in all 5 memory files.

### H4 — Alignment Check Bypassed When Observations Are Empty (Tertiary Contamination Enabler)
**Hypothesis:** The alignment check at `workflow.ts:594-609` fires only when `allFilePaths.length > 0`. If the OpenCode capture returns no observations with attached file paths (either because the capture returned minimal data, or all exchanges were filtered), `totalPaths = 0`, the guard condition is false, and contaminated `recentContext.learning` and `SUMMARY` flow through without any cross-spec check.

**Evidence:** `workflow.ts:594-609`: `if (totalPaths > 0 && specKeywords.length > 0)` — the inner block (including the `throw`) is unreachable when `totalPaths == 0`.

### H5 — Unique SESSION_ID/Epoch Defeats SHA-256 Content-Dedup Guard (Primary Near-Duplicate Cause)
**Hypothesis:** `file-writer.ts:checkForDuplicateContent()` compares SHA-256 hashes. Each invocation embeds a freshly-generated `SESSION_ID` (`generateSessionId()` at `collect-session-data.ts:726`) and `createdAtEpoch` (`Math.floor(Date.now()/1000)` at line 728) into the rendered markdown. These unique values change the hash on every run even when all substantive content is identical, systematically defeating the content-dedup guard.

**Evidence:** Five memory files with identical substantive content but different Session IDs (1773000425427, 1773000436158, 1773000517086, ..., 1773000718765) and different `Created At (Epoch)` values. All five pass `checkForDuplicateContent()`.

### H6 — In-Process Workflow Lock Provides No Cross-Invocation Protection (Secondary Near-Duplicate Cause)
**Hypothesis:** `withWorkflowRunLock` at `workflow.ts:366-382` uses an in-process Promise queue. Each `node generate-context.js` process has its own JavaScript heap; the queue variable `workflowRunQueue` is not shared across OS processes. Five invocations within 4 minutes create 5 independent processes, each unaware of the others, all writing the same content with different hashes.

**Evidence:** `workflow.ts:366`: `let workflowRunQueue: Promise<void> = Promise.resolve();` — module-level variable, process-local. No file-system lock, advisory lock, or lock file is created.

### H7 — Two Quality Scores on Different Scales Write to the Same Conceptual Field (Quality-Score Conflict)
**Hypothesis:** `metadata.json`'s `filtering.qualityScore: 30` and the frontmatter `quality_score: 0.85` are produced by two completely different scoring systems:  
- **30/100** = `filterPipeline.getStats().qualityScore` (content filter pipeline, 0–100 scale) measuring message noise/deduplication quality. Stored at `workflow.ts:941` inside the `filtering` key of metadata.json.  
- **0.85/1.00** = `qualityV2.qualityScore` from `scoreMemoryQualityV2()` (structural validator, 0.0–1.0 scale) measuring rendered markdown structural compliance. Injected into frontmatter via `injectQualityMetadata()` at `workflow.ts:1008`.

Neither output includes the scale or algorithm name. A third scorer (`scoreMemoryQuality()`, legacy 0–100) runs at line 1014 but is only logged, never persisted.

**Evidence:** `workflow.ts:934-954` (metadata.json write); `workflow.ts:1000-1008` (frontmatter inject); `core/quality-scorer.ts:49-146` (legacy scorer); `metadata.json:12` (`qualityScore: 30`); memory file frontmatter line 10 (`quality_score: 0.85`).

---

## Key Code Locations Summary

| Bug | File | Lines | Issue |
|-----|------|-------|-------|
| H1 — recentContext leak | `scripts/utils/input-normalizer.ts` | 500–503 | `recentContext` built from raw unfiltered last exchange |
| H1 — SUMMARY reads learning | `scripts/extractors/collect-session-data.ts` | 697–699 | `SUMMARY = sessionInfo.learning` (no spec check) |
| H2 — broad keyword | `scripts/utils/input-normalizer.ts` | 408–416 | Splits spec path, uses parent segments as keywords |
| H2 — filter too permissive | `scripts/utils/input-normalizer.ts` | 418–424 | `isToolRelevant` matches `system-spec-kit` everywhere |
| H3 — wrong session | `scripts/extractors/opencode-capture.ts` | 253–264 | Sorts by `updated`, not by last message timestamp |
| H3 — timestamp propagation | `scripts/extractors/opencode-capture.ts` | 493 | `exchange.timestamp = userMsg.created` |
| H4 — alignment bypass | `scripts/core/workflow.ts` | 594–609 | `if (totalPaths > 0)` guard skips check when empty |
| H5 — SHA-256 defeated | `scripts/core/file-writer.ts` | 30–53 | Hash comparison; doesn't strip volatile fields |
| H5 — unique session ID | `scripts/extractors/collect-session-data.ts` | 726–728 | `generateSessionId()` + `Date.now()/1000` per run |
| H6 — in-process lock | `scripts/core/workflow.ts` | 366–382 | Module-level Promise queue, no FS lock |
| H6 — no-suffix across minutes | `scripts/utils/slug-utils.ts` | 139–164 | Only handles same-minute name collisions |
| H7 — filter score → JSON | `scripts/core/workflow.ts` | 934–954 | `filterPipeline.getStats()` into metadata.json |
| H7 — v2 score → frontmatter | `scripts/core/workflow.ts` | 1000–1008 | `qualityV2.qualityScore` into YAML (different scale) |
| H7 — legacy scorer | `scripts/core/quality-scorer.ts` | 49–146 | Third scorer, logged only, not persisted |

---

## Confidence Assessment

| Finding | Confidence | Basis |
|---------|-----------|-------|
| H1: recentContext.learning bypass | **High** | Source code at `input-normalizer.ts:500-503` is unambiguous; observed text matches |
| H2: broad keyword contamination | **High** | `isToolRelevant` logic and "system-spec-kit" keyword verified; file paths in memory file confirm |
| H3: stale session selection | **High** | `getRecentSessions` sorts by `updated`; exchange timestamp = 1740048439723ms = Feb 20, 2026 confirmed |
| H4: alignment check bypass | **High** | Code path at `workflow.ts:594` is explicit; condition `totalPaths > 0` is clear |
| H5: SHA-256 defeat | **High** | SESSION_ID and epoch confirmed unique per file; `checkForDuplicateContent` reads full rendered content |
| H6: in-process lock | **High** | `workflowRunQueue` is module-level variable; no FS lock present |
| H7: dual quality scores | **High** | Both write sites confirmed; scales are mathematically incompatible (30/100 ≠ 30% of 0.85/1.0) |

All findings are based directly on source code and observed file contents. No speculation was required.

---

## Footnotes

[^1]: `scripts/utils/input-normalizer.ts:500-503` — `recentContext` built from `exchanges[0]` and `exchanges[last]` with no relevance filter.

[^2]: `scripts/utils/input-normalizer.ts:408-416` — Relevance keyword extraction from spec folder path segments.

[^3]: `scripts/utils/input-normalizer.ts:418-428` — `isToolRelevant()` and `filteredToolCalls` using the broad `system-spec-kit` keyword.

[^4]: `scripts/utils/input-normalizer.ts:444-472` — Exchange relevance filter only applies inside the `observations[]` loop.

[^5]: `scripts/extractors/collect-session-data.ts:697-699` — `SUMMARY = sessionInfo.learning` first-precedence.

[^6]: `scripts/extractors/collect-session-data.ts:678` — `sessionInfo = collectedData.recentContext?.[0]`.

[^7]: `scripts/core/workflow.ts:578-609` — Step 1.5 alignment check; `if (totalPaths > 0 && specKeywords.length > 0)` guard.

[^8]: `scripts/extractors/opencode-capture.ts:253-264` — `getRecentSessions` sorts by `b.updated - a.updated`; `getCurrentSession` takes first result.

[^9]: `scripts/extractors/opencode-capture.ts:493` — `exchange.timestamp = userMsg.created` (OpenCode storage epoch).

[^10]: `scripts/extractors/collect-session-data.ts:582-585` — `lastActivity = new Date(lastPrompt.timestamp).toISOString()`.

[^11]: `scripts/extractors/collect-session-data.ts:666` — `dateOnly = formatTimestamp(Date.now(), 'date-dutch')` (wall clock).

[^12]: `scripts/extractors/collect-session-data.ts:726-728` — `generateSessionId()` and `Math.floor(Date.now()/1000)`.

[^13]: `scripts/core/file-writer.ts:30-53` — `checkForDuplicateContent` SHA-256 hash comparison.

[^14]: `scripts/core/workflow.ts:366-382` — `withWorkflowRunLock` in-process Promise queue.

[^15]: `scripts/utils/slug-utils.ts:139-164` — `ensureUniqueMemoryFilename` appends `-1` suffix only for same-minute collisions.

[^16]: `scripts/core/workflow.ts:934-954` — `filterPipeline.getStats()` written to `metadata.json` as `filtering` object.

[^17]: `scripts/core/workflow.ts:1000-1008` — `scoreMemoryQualityV2()` result injected into frontmatter via `injectQualityMetadata()`.

[^18]: `scripts/core/quality-scorer.ts:49-146` — Legacy `scoreMemoryQuality()` function; result logged only at `workflow.ts:1021`.

[^19]: `memory/08-03-26_21-07__improve-stateless-mode-quality.md:79,192` — 036-skill-graphs text appears as SUMMARY/OVERVIEW.

[^20]: `memory/08-03-26_21-07__improve-stateless-mode-quality.md:69` — `Last Activity: 2026-02-20T11:27:19.723Z`.

[^21]: `memory/metadata.json:12` — `qualityScore: 30`.

[^22]: `memory/08-03-26_21-07__improve-stateless-mode-quality.md:10` — `quality_score: 0.85`.
