# QA8-O16: Provenance Marker Pipeline Audit

**Audit Type:** Cross-cutting trace analysis  
**Scope:** `_provenance` and `_synthetic` marker survival through the full pipeline  
**Date:** 2026-03-09  
**Reviewer:** Claude Opus 4.6 (@review agent)  
**Confidence:** HIGH — all source files read, all paths traced

---

## 1. Executive Summary

The `_provenance` and `_synthetic` markers introduced in Spec 013 **survive through the FILES pipeline** (creation → merge → dedup → output) but are **stripped from the OBSERVATIONS pipeline** at the `buildObservationsWithAnchors` transformation stage. Two additional stripping points exist in the file pipeline at the `enhanceFilesWithSemanticDescriptions` function and the `applyThinningToFileChanges` + carrier-merge stage. Template rendering (`.hbs` files) does not reference markers at all. No tests exist for marker survival.

**Verdict:** PARTIAL PASS — Files pipeline preserves markers; Observations pipeline strips them; Templates ignore them; No test coverage.

---

## 2. Marker Creation Points

### 2.1 spec-folder-extractor.ts

**Observations** — Created with mandatory literal markers:
- Interface `SpecFolderExtraction.observations` declares `_provenance: 'spec-folder'` and `_synthetic: true` as **required (non-optional)** fields (lines 22-23)
- All observation construction sites set markers using `as const` assertions:
  - `parseSpecDoc` requirements loop (lines 147-148)
  - metadata observation (lines 251-252)
  - task progress observation (lines 262-263)
  - checklist verification observation (lines 272-273)

**FILES** — Created with `_provenance` only (no `_synthetic`):
- Interface declares `_provenance: 'spec-folder'` as **required** on FILES (line 25)
- Construction at line 136: `files.push({ ..., _provenance: 'spec-folder' })`

**Decisions** — Created with `_provenance` only:
- Interface declares `_provenance: 'spec-folder'` as **required** (line 29)
- Construction at line 194: `{ ..., _provenance: 'spec-folder' as const }`

**Assessment:** SOUND. All creation sites set markers. Type system enforces them as non-optional. No code path can omit them.

### 2.2 git-context-extractor.ts

**Observations** — Created with mandatory literal markers:
- Interface `GitContextExtraction.observations` declares `_provenance: 'git'` and `_synthetic: true` as **required** (lines 34-35)
- Uncommitted-change observations (lines 155-156)
- Commit observations (lines 167-168)

**FILES** — Created with `_provenance` only (no `_synthetic`):
- Interface declares `_provenance: 'git'` as **required** (line 41)
- Construction at line 140: `FILES.push({ ..., _provenance: 'git' })`

**Assessment:** SOUND. Same pattern as spec-folder-extractor. Type-enforced, no omission paths.

---

## 3. Marker Survival Through Pipeline

### 3.1 Pipeline: enrichStatelessData (workflow.ts:433-527)

The merge function in `enrichStatelessData` concatenates arrays directly:

**Observations merge (lines 450-454):**
```typescript
collectedData.observations = [...existingObs, ...specContext.observations];
```
Markers survive — objects are spread into the new array without transformation.

**FILES merge (lines 457-464):**
```typescript
const newFiles = specContext.FILES.filter(f => !existingPaths.has(...));
collectedData.FILES = [...existingFiles, ...newFiles];
```
Markers survive — only path-based dedup filtering occurs; no field stripping.

**Git context merge (lines 497-512):**
Same pattern as spec-folder. Direct concatenation, no field stripping.

**Assessment:** PASS. Markers fully survive the enrichStatelessData merge stage.

### 3.2 Pipeline: extractFilesFromData (file-extractor.ts:113-221)

This function deduplicates files by normalized path and handles marker propagation explicitly.

**addFile function (lines 127-163):**
- Accepts `provenance` and `synthetic` as explicit parameters
- For new entries: spreads `{ _provenance, _synthetic }` if provenance is truthy (line 161)
- For existing entries with better description: spreads markers (line 148)
- For existing entries needing provenance update: explicitly sets both fields (lines 153-154)

**Source 1 — FILES array (lines 167-173):**
- Reads `fileInfo._provenance` and `fileInfo._synthetic` and passes them to `addFile` (line 172)

**Source 2 — filesModified (lines 177-180):**
- Legacy format — does NOT pass provenance. Files from this source get `undefined` provenance.
- **Minor gap:** If a file appears ONLY in `filesModified` (not in `FILES`), it will have no provenance marker. Acceptable since `filesModified` is the legacy format and real session data, not synthetic.

**Source 3 — observations (lines 184-201):**
- Files extracted from observation `.files` and `.facts[].files` arrays do NOT receive provenance markers.
- **Expected behavior:** These are file paths mentioned in observations, not the observation metadata itself. The observation's own provenance is not inherited by extracted file paths.

**Output mapping (lines 213-220):**
- Conditional spread: `...(data._provenance ? { _provenance, _synthetic } : {})` — preserves markers if present, omits if absent.

**Assessment:** PASS. Markers survive deduplication. The conditional spread ensures files without provenance (real session files) correctly lack markers, while enriched files retain them.

### 3.3 Pipeline: enhanceFilesWithSemanticDescriptions (file-extractor.ts:227-272)

**P1 FINDING — Marker Stripping on Semantic Match**

When a semantic match is found (exact path match at line 236, or unique basename match at line 261), a **new object is constructed** that includes only `FILE_PATH`, `DESCRIPTION`, and `ACTION`:

```typescript
// Line 238-242 (exact match)
return {
  FILE_PATH: file.FILE_PATH,
  DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
  ACTION: normalizeFileAction(info.action)
};
```

The `_provenance` and `_synthetic` fields from the original `file` object are **NOT carried forward** into the new object.

**When no match is found (line 270):** the original `file` object is returned unchanged — markers survive.

**Impact:** Any file that receives a semantic description enhancement will lose its provenance markers. In stateless mode, this applies to files where the `generateImplementationSummary` function successfully extracts semantic file change info from user prompts/observations. This could affect a significant portion of enriched files.

**Severity assessment:**

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| enhanceFilesWithSemanticDescriptions strips markers on match | P1 | Semantic enhancement comes from real session messages, so enhanced files arguably have "session" provenance, not "git"/"spec-folder" provenance. But the original marker IS lost without replacement. | Confirmed — markers are silently dropped with no substitute. Downstream cannot distinguish enriched-then-enhanced from purely real. | P1 |

### 3.4 Pipeline: applyThinningToFileChanges (workflow.ts:205-270)

**Shallow copy (line 227):** `.map((file) => ({ ...file }))` — uses object spread, which **preserves** `_provenance` and `_synthetic` since spread copies all own enumerable properties.

**Carrier merge (lines 258-264):** When tree-thinning merges children into a parent's description, only the `DESCRIPTION` field is mutated on the carrier file object. The `_provenance` and `_synthetic` fields are not touched.

**Assessment:** PASS. Markers survive tree thinning.

### 3.5 Pipeline: buildObservationsWithAnchors (file-extractor.ts:278-318)

**P1 FINDING — Observations Pipeline Strips All Provenance Markers**

The `buildObservationsWithAnchors` function transforms `ObservationInput[]` into `ObservationDetailed[]`. The output interface has these fields:

```typescript
interface ObservationDetailed {
  TYPE: string;        // Uppercase observation type
  TITLE: string;
  NARRATIVE: string;
  HAS_FILES: boolean;
  FILES_LIST: string;
  HAS_FACTS: boolean;
  FACTS_LIST: string;
  ANCHOR_ID: string;
  IS_DECISION: boolean;
}
```

There is **no `_provenance` or `_synthetic` field** in `ObservationDetailed`. The transformation at lines 306-317 constructs new objects with only the listed fields. All provenance metadata is discarded.

The `OBSERVATIONS` field in the final `SessionData` output uses `ObservationDetailed[]` (session-types.ts line 192), confirming the markers are permanently lost at this stage.

**Impact:** Downstream consumers receiving `SessionData.OBSERVATIONS` cannot distinguish synthetic observations (from spec-folder/git enrichment) from real session observations. The original `observations` array in `collectedData` still has markers, but only the transformed version reaches templates and output.

**Severity assessment:**

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| buildObservationsWithAnchors strips _provenance/_synthetic | P1 | The TYPE field partially compensates: git observations get types like "uncommitted-change", "bugfix", "feature" from detectCommitType; spec-folder observations get "requirement", "metadata", "progress", "verification". But this is indirect — not a clean provenance signal. Also, the deduplicateObservations stage (called within buildObservationsWithAnchors) merges observations regardless of provenance, so a synthetic observation could absorb a real one or vice versa. | Confirmed — markers lost. TYPE is an imperfect proxy. | P1 |

### 3.6 Pipeline: collectSessionData → SessionData output

The final `SessionData` object (collect-session-data.ts lines 791-832) includes:
- `FILES: FileChange[]` — markers survive from `extractFilesFromData` (but may be stripped by later `enhanceFilesWithSemanticDescriptions`)
- `OBSERVATIONS: ObservationDetailed[]` — markers already stripped by `buildObservationsWithAnchors`

However, in `workflow.ts` (line 891), the template receives `FILES: effectiveFiles` which is the output of `applyThinningToFileChanges(enhancedFiles, ...)` where `enhancedFiles` came from `enhanceFilesWithSemanticDescriptions(sessionData.FILES, ...)`.

**Net path for FILES:** extractors create markers → enrichStatelessData preserves → extractFilesFromData preserves → collectSessionData preserves → enhanceFilesWithSemanticDescriptions **may strip** → applyThinningToFileChanges preserves → template receives (markers present only on files NOT semantically enhanced).

---

## 4. Template Rendering

**No `.hbs` template references `_provenance` or `_synthetic`** (confirmed via Grep: zero matches across all `.hbs` files in the system-spec-kit directory).

This means even when markers survive to the template rendering stage, they are not rendered into the output markdown files. They exist only as in-memory metadata during pipeline execution.

**Assessment:** This is not inherently a bug — markers could be useful for:
1. Quality scoring (distinguishing synthetic from real content)
2. Downstream MCP consumers reading the JSON representation
3. Future template enhancements showing data provenance

But currently, no consumer reads them from the final output.

---

## 5. Consumer Analysis

### 5.1 Quality Scorer (quality-scorer.ts)

The quality scorer operates on `SessionData` which includes `FileChange[]` with optional markers. However:

- **Not verified:** Whether the scorer uses `_provenance` or `_synthetic` for scoring decisions.

### 5.2 MCP Memory Index

The memory indexing pipeline receives the rendered markdown (not the raw SessionData objects). Since templates do not emit markers, the MCP memory system has **no visibility into provenance**.

### 5.3 Simulation Factory

The `simulation-factory.ts` does **not** set `_provenance` or `_synthetic` on any generated data (confirmed via Grep). This means simulated data is indistinguishable from real session data that lacks enrichment.

---

## 6. Findings Summary

### P1 — Required Fixes

| ID | Location | Issue | Impact |
|----|----------|-------|--------|
| P1-01 | `file-extractor.ts:238-242, 262-268` | `enhanceFilesWithSemanticDescriptions` creates new file objects without carrying forward `_provenance` and `_synthetic` from the original file | Files that receive semantic description enhancement lose provenance markers |
| P1-02 | `file-extractor.ts:278-318` | `buildObservationsWithAnchors` transforms observations into `ObservationDetailed` which has no provenance fields | All observation provenance markers are permanently stripped at this pipeline stage |

### P2 — Suggestions

| ID | Location | Issue | Recommendation |
|----|----------|-------|----------------|
| P2-01 | `session-types.ts:44` | `ObservationDetailed` interface lacks provenance fields | Add optional `_provenance?: string` and `_synthetic?: boolean` to interface |
| P2-02 | Templates (`.hbs` files) | No template renders provenance markers | Consider adding provenance indicators (e.g., `[git]`, `[spec]` badges) to context files for transparency |
| P2-03 | Tests | Zero test coverage for marker survival through pipeline | Add integration test: create enriched data → run through extractFilesFromData → enhanceFilesWithSemanticDescriptions → verify markers present |
| P2-04 | `simulation-factory.ts` | Simulated data does not set `_provenance` or `_synthetic` | Consider setting `_provenance: 'simulation'` on simulated data for consistency |
| P2-05 | `file-extractor.ts:184-201` | Observation-extracted file paths inherit no provenance from their parent observation | Low priority — these are incidental file mentions, not the enriched entries themselves |

---

## 7. Recommended Fixes

### Fix P1-01: enhanceFilesWithSemanticDescriptions marker preservation

In `file-extractor.ts`, the three return paths in `enhanceFilesWithSemanticDescriptions` that construct new objects (lines 238-242, 262-268) should carry forward provenance markers:

```typescript
// Exact match return — add marker preservation
return {
  FILE_PATH: file.FILE_PATH,
  DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
  ACTION: normalizeFileAction(info.action),
  ...(file._provenance ? { _provenance: file._provenance, _synthetic: file._synthetic } : {}),
};
```

Same pattern for the basename match return path (lines 262-268).

### Fix P1-02: ObservationDetailed marker propagation

Two options:

**Option A (Minimal):** Add optional `_provenance` and `_synthetic` fields to `ObservationDetailed` and propagate them in `buildObservationsWithAnchors`:

```typescript
interface ObservationDetailed {
  // ... existing fields ...
  _PROVENANCE?: string;
  _SYNTHETIC?: boolean;
}
```

**Option B (Clean separation):** Keep `ObservationDetailed` as a presentation type (for templates) and add a separate `ObservationEnriched` type that extends it with provenance for internal pipeline use.

---

## 8. Pipeline Diagram

```
CREATION                    MERGE                     TRANSFORM              OUTPUT
─────────                   ─────                     ─────────              ──────

spec-folder-extractor ──┐
  obs: _provenance ✓    │
  FILES: _provenance ✓  ├─► enrichStatelessData ──► collectSessionData
  decisions: _prov ✓    │     markers: PRESERVED       │
                        │                              ├── FILES ──► enhanceFilesWithSemantic ──► applyThinning ──► template
git-context-extractor ──┘                              │              markers: STRIPPED on match    markers: OK      markers: NOT RENDERED
  obs: _provenance ✓                                   │
  FILES: _provenance ✓                                 └── observations ──► buildObservationsWithAnchors ──► template
                                                                             markers: STRIPPED (always)       markers: N/A
```

**Legend:** ✓ = markers present | PRESERVED = markers survive | STRIPPED = markers lost | NOT RENDERED = markers present but unused

---

## 9. Conclusion

The provenance marker system has solid **creation** (type-enforced, no omission paths) and solid **merge** (enrichStatelessData is marker-transparent), but has two **transformation** stages that strip markers. The P1-01 fix is straightforward (3-line change per return path). The P1-02 fix requires an interface change and is a design decision about whether observations need provenance at the presentation layer. Neither issue causes data corruption — the impact is loss of metadata that downstream consumers could use for quality assessment and transparency.
