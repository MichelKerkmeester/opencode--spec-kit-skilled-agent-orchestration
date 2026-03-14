# Agent I03: Provenance Marker Survival

**Auditor:** Agent I03 (Claude Opus 4.6, @review)
**Date:** 2026-03-08
**Scope:** Trace `_provenance` and `_synthetic` markers through the full generate-context pipeline
**Confidence:** HIGH — all 7 pipeline files read and verified

---

## Summary

Provenance markers (`_provenance: 'git' | 'spec-folder'`, `_synthetic: true`) are **correctly generated** at the two source extractors and **correctly preserved through the merge step** via spread operators in `enrichStatelessData()`. However, markers are **silently stripped** at multiple downstream consumption points because intermediate type definitions (`FileChange`, `ObservationInput`, `ObservationDetailed`, `CollectedDataFull.FILES`) do not declare these fields. The markers survive at runtime (JavaScript objects carry them regardless of TypeScript types), but they are **actively discarded** when `file-extractor.ts` maps to `FileChange` (which only has `FILE_PATH`, `DESCRIPTION`, `ACTION?`). Provenance markers **never reach the rendered output** because no template references them.

**Verdict: PARTIAL PASS** — Source generation and merge are correct; downstream consumption and output rendering have structural gaps.

---

## Source Verification

### 1. git-context-extractor.ts

**File:** `scripts/extractors/git-context-extractor.ts`

| Check | Result | Evidence |
|-------|--------|----------|
| Type definition includes `_provenance: 'git'` on observations | PASS | Line 34: `_provenance: 'git';` in `GitContextExtraction.observations` |
| Type definition includes `_synthetic: true` on observations | PASS | Line 35: `_synthetic: true;` in `GitContextExtraction.observations` |
| Type definition includes `_provenance: 'git'` on FILES | PASS | Line 41: `_provenance: 'git';` in `GitContextExtraction.FILES` |
| Runtime: observations get `_provenance` | PASS | Lines 155-156 (uncommitted), Lines 167-168 (commits) |
| Runtime: FILES get `_provenance` | PASS | Line 140: `_provenance: 'git'` in `addFile()` |
| FILES missing `_synthetic` | NOTE | `FILES` type has `_provenance` but not `_synthetic` — intentional (files are references, not synthetic observations) |

### 2. spec-folder-extractor.ts

**File:** `scripts/extractors/spec-folder-extractor.ts`

| Check | Result | Evidence |
|-------|--------|----------|
| Type definition includes `_provenance: 'spec-folder'` on observations | PASS | Line 22 |
| Type definition includes `_synthetic: true` on observations | PASS | Line 23 |
| Type definition includes `_provenance: 'spec-folder'` on FILES | PASS | Line 25 |
| Type definition includes `_provenance: 'spec-folder'` on decisions | PASS | Line 29 |
| Runtime: observations get markers | PASS | Lines 147-148 (requirements), 251-252 (metadata), 262-263 (tasks), 272-273 (checklist) |
| Runtime: FILES get markers | PASS | Line 136 |
| Runtime: decisions get markers | PASS | Line 194 |

---

## Pipeline Trace

### 3. workflow.ts — enrichStatelessData() (Merge Step)

**File:** `scripts/core/workflow.ts`, lines 433-527

| Check | Result | Evidence |
|-------|--------|----------|
| Observations merged via spread (preserves markers) | PASS | Lines 450-454: `collectedData.observations = [...existingObs, ...specContext.observations]` |
| FILES merged via spread (preserves markers) | PASS | Lines 457-464: `collectedData.FILES = [...existingFiles, ...newFiles]` |
| Git observations merged via spread | PASS | Lines 498-502: `collectedData.observations = [...existingObs, ...gitContext.observations]` |
| Git FILES merged via spread | PASS | Lines 505-512: `collectedData.FILES = [...existingFiles, ...newFiles]` |
| Decisions merged via spread | PASS | Lines 475-480: `...specContext.decisions` |
| No `Object.keys()` or destructuring that strips markers | PASS | Merge uses array spread only |

**Assessment:** The merge step is clean. All provenance markers survive into `collectedData` post-enrichment.

---

## Consumption Points

### 4. collect-session-data.ts — Does it read/respect provenance markers?

**File:** `scripts/extractors/collect-session-data.ts`

| Check | Result | Evidence |
|-------|--------|----------|
| `CollectedDataFull.FILES` type includes `_provenance` | **FAIL** | Line 140: `Array<{ FILE_PATH?: string; path?: string; DESCRIPTION?: string; description?: string }>` — no `_provenance` field |
| `CollectedDataFull.observations` typed as `Observation[]` | NEUTRAL | Imported from session-extractor; need to check that type |
| `extractFilesFromData()` called at line 678 | See #6 below | Delegates to file-extractor |
| `buildObservationsWithAnchors()` called at line 711 | See #6 below | Delegates to file-extractor |
| Observations in `OUTCOMES` mapping (line 680-685) | **STRIP** | Maps to `{ OUTCOME, TYPE }` — provenance lost |
| SessionData return object includes `_provenance` | **FAIL** | Lines 777-818: Final SessionData has no `_provenance` fields on FILES or OBSERVATIONS |

**Assessment:** `collect-session-data.ts` does not read, filter, or act on `_provenance` or `_synthetic`. It does not distinguish synthetic from live data. Markers on observation objects survive in memory (JavaScript runtime), but the SessionData output structure has no slot for them.

### 5. decision-extractor.ts — Does it handle synthetic observations differently?

**File:** `scripts/extractors/decision-extractor.ts`

| Check | Result | Evidence |
|-------|--------|----------|
| `CollectedDataForDecisions.observations` type includes `_provenance` | **FAIL** | Lines 26-34: Type has `type?, narrative?, facts?, title?, timestamp?, files?` — no `_provenance` |
| Runtime filtering for synthetic observations | **FAIL** | Line 194: `filter((obs) => obs.type === 'decision')` — filters by `type`, ignores provenance |
| Lexical fallback processes synthetic observations | **CONCERN** | Lines 96-98: `buildLexicalDecisionObservations` iterates ALL observations including synthetic ones — no provenance-based exclusion |
| Output `DecisionRecord` includes provenance | **FAIL** | Lines 322-345: No `_provenance` on output records |

**Assessment:** The decision extractor processes synthetic observations identically to live ones. This means synthetic spec-folder requirements or git commit observations could be incorrectly interpreted as "decisions" if they happen to contain decision-cue words (e.g., "decided", "chose", "selected"). There is no provenance-aware filtering.

### 6. file-extractor.ts — Does it preserve ACTION and _provenance through extraction?

**File:** `scripts/extractors/file-extractor.ts`

| Check | Result | Evidence |
|-------|--------|----------|
| `FileChange` interface includes `_provenance` | **FAIL** | Lines 25-29: Only `FILE_PATH`, `DESCRIPTION`, `ACTION?` |
| `ObservationInput` interface includes `_provenance` | **FAIL** | Lines 32-39: No `_provenance` or `_synthetic` |
| `extractFilesFromData` output preserves `_provenance` | **FAIL** | Lines 177-183: Maps to `{ FILE_PATH, DESCRIPTION, ...(action ? { ACTION } : {}) }` — explicit construction drops `_provenance` |
| `ObservationDetailed` output includes `_provenance` | **FAIL** | Lines 42-52: No `_provenance` field in output |
| `ACTION` field preserved from source | **PARTIAL** | Line 135: `(fileInfo as any).ACTION || (fileInfo as any).action` — uses `any` cast to read ACTION, but same approach not used for `_provenance` |
| `enhanceFilesWithSemanticDescriptions` preserves markers | **FAIL** | Lines 201-204: Constructs new objects with only `FILE_PATH`, `DESCRIPTION`, `ACTION` |

**Assessment:** This is the primary stripping point. `extractFilesFromData()` explicitly constructs new `FileChange` objects with only three fields, dropping `_provenance`. The `(fileInfo as any).ACTION` pattern at line 135 shows the developer was aware of extra fields on the input but chose to extract only `ACTION`, not `_provenance`. The `enhanceFilesWithSemanticDescriptions` function at line 201 also constructs new objects that exclude provenance.

### 7. file-writer.ts — Do provenance markers survive to rendered output?

**File:** `scripts/core/file-writer.ts`

| Check | Result | Evidence |
|-------|--------|----------|
| Writer is content-agnostic | N/A | `writeFilesAtomically` writes pre-rendered markdown strings; it does not inspect or strip data fields |
| Templates reference `_provenance` | **FAIL** | Grep across `*.hbs` and template files: zero matches for `_provenance` or `_synthetic` |

**Assessment:** The file writer itself is a pass-through, but the templates that render data into markdown never reference provenance markers. Even if markers survived to the template data context (which they do not, per findings above), they would not appear in output.

---

## Findings

### Adversarial Self-Check (Hunter/Skeptic/Referee)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| F1: `FileChange` interface missing `_provenance` — markers stripped in `extractFilesFromData()` | P1 | "At runtime, JS objects carry extra fields; only explicit construction drops them." The construction at lines 177-183 IS explicit and DOES drop markers. | Confirmed | **P1** |
| F2: `ObservationInput` / `ObservationDetailed` missing `_provenance` — observations lose markers in `buildObservationsWithAnchors()` | P1 | "Observations are used for rendering, not for data integrity decisions." True, but spec 013 requires markers survive to output for quality scoring. | Confirmed | **P1** |
| F3: `CollectedDataFull.FILES` type missing `_provenance` — TypeScript won't enforce marker presence | P2 | "Type-level only; runtime data still has the fields." True, but type safety is the whole point of TypeScript; any refactor could lose the fields silently. | Confirmed | **P2** |
| F4: decision-extractor processes synthetic observations without filtering | P1 | "Synthetic observations from spec-folder have `type: 'requirement'` or `type: 'metadata'`, not `type: 'decision'`, so they get filtered at line 194." Partially valid — but lexical fallback at line 197-203 has NO type filter and WILL process synthetic observations. | Confirmed, downgraded | **P2** |
| F5: `enhanceFilesWithSemanticDescriptions` constructs new objects that drop `_provenance` | P1 | "This function only fires for files that have semantic matches, so it is a partial strip." True, but any matched file loses provenance. | Confirmed | **P1** |
| F6: Templates never render `_provenance` or `_synthetic` | P1 | "Spec 013 says markers should survive for quality scoring, not necessarily for template rendering." Need to check if quality-scorer reads provenance. | Downgraded — quality scorer path needs separate verification | **P2** |
| F7: SessionData output (collect-session-data.ts lines 777-818) has no `_provenance` slots | P1 | "SessionData is consumed by template rendering and memory indexing. If quality scoring happens before SessionData construction, markers may not need to be in SessionData." The quality scorer is called AFTER SessionData in the workflow. | Confirmed | **P1** |

### P0 — Blockers
None.

### P1 — Required

**F1: `FileChange` interface strips `_provenance` during extraction**
- **File:** `scripts/extractors/file-extractor.ts:177-183`
- **Evidence:** Output mapping: `{ FILE_PATH, DESCRIPTION, ...(data.action ? { ACTION } : {}) }` — no `_provenance`
- **Impact:** All file provenance markers from git-context-extractor and spec-folder-extractor are dropped here
- **Fix:** Add `_provenance?: 'git' | 'spec-folder'` to `FileChange` interface and include in output mapping

**F2: `ObservationDetailed` strips `_provenance` and `_synthetic` during anchoring**
- **File:** `scripts/extractors/file-extractor.ts:269-280`
- **Evidence:** `buildObservationsWithAnchors` maps to `{ TYPE, TITLE, NARRATIVE, HAS_FILES, FILES_LIST, HAS_FACTS, FACTS_LIST, ANCHOR_ID, IS_DECISION }` — no provenance fields
- **Impact:** Downstream consumers cannot distinguish synthetic from live observations in the output
- **Fix:** Add `IS_SYNTHETIC?: boolean` and `PROVENANCE?: string` to `ObservationDetailed` interface

**F5: `enhanceFilesWithSemanticDescriptions` drops `_provenance` when constructing enhanced files**
- **File:** `scripts/extractors/file-extractor.ts:201-204`
- **Evidence:** Returns `{ FILE_PATH, DESCRIPTION, ACTION }` — no `_provenance`
- **Impact:** Even files that enter this function with provenance lose it
- **Fix:** Spread original file and override only `DESCRIPTION` and `ACTION`: `return { ...file, DESCRIPTION: ..., ACTION: ... }`

**F7: SessionData output has no provenance slots for FILES or OBSERVATIONS**
- **File:** `scripts/extractors/collect-session-data.ts:777-818`
- **Evidence:** `FILES: FILES.length > 0 ? FILES : []` — FILES are already stripped `FileChange[]` at this point (see F1)
- **Impact:** By the time SessionData is constructed, provenance is already lost from upstream stripping
- **Fix:** Dependent on F1/F2 being fixed first; then SessionData inherits the markers

### P2 — Suggestions

**F3:** Add `_provenance?: 'git' | 'spec-folder'` to `CollectedDataFull.FILES` array type at `collect-session-data.ts:140` for type safety.

**F4:** In `decision-extractor.ts`, the lexical fallback at line 197 could optionally skip observations where `(obs as any)._synthetic === true` to avoid mining synthetic observations for decision cues. Low risk since synthetic observations tend to have non-decision types.

**F6:** If spec 013 intends provenance markers to appear in rendered memory files for quality scoring, add `{{#if PROVENANCE}}(source: {{PROVENANCE}}){{/if}}` to the observation rows in the Handlebars template.

---

## Verdict

| Pipeline Stage | Provenance Preserved? | Notes |
|---|---|---|
| Source: git-context-extractor | **YES** | Both type-level and runtime |
| Source: spec-folder-extractor | **YES** | Both type-level and runtime |
| Merge: enrichStatelessData() | **YES** | Spread operators preserve all fields |
| Consumption: collect-session-data | **NO** | Type definitions omit markers; downstream FILES already stripped |
| Consumption: decision-extractor | **NO** | Does not read or respect provenance; processes all observations equally |
| Consumption: file-extractor | **NO** | Primary stripping point — `FileChange` lacks `_provenance`, explicit object construction drops it |
| Output: file-writer + templates | **NO** | Templates never reference provenance markers |

**Overall:** Provenance markers are correctly born and survive the merge, but die at the extraction/consumption layer. The pipeline is half-complete. Four P1 fixes are needed to achieve end-to-end provenance survival as spec 013 requires.

**Score: 55/100 (NEEDS REVISION)**
- Correctness: 15/30 — markers generated correctly but stripped downstream
- Security: 25/25 — no security issues
- Patterns: 8/20 — inconsistent: source extractors follow the pattern, consumers do not
- Maintainability: 5/15 — type definitions are incomplete, making accidental stripping easy
- Performance: 10/10 — no performance concerns
