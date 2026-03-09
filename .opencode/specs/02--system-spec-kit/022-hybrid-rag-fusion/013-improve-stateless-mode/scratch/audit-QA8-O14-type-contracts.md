# Audit QA8-O14: Cross-Cutting Type Contract Verification

**Auditor:** @review (Claude Opus 4.6)
**Date:** 2026-03-09
**Scope:** `SessionData` interface satisfaction across all producers and consumers
**Severity convention:** P0 = Blocker, P1 = Required fix, P2 = Suggestion

---

## 1. Executive Summary

The `SessionData` interface in `session-types.ts` declares 37 explicit fields. The primary producer (`collectSessionData` in `collect-session-data.ts`) returns an object that satisfies all 37 declared fields **plus** spreads in 3 additional data structures via `...implementationGuide`, `...preflightPostflightData`, and `...continueSessionData`, injecting up to ~40 extra runtime fields that are invisible to the declared interface. The `[key: string]: unknown` index signature on `SessionData` silently absorbs all of these, defeating compile-time type checking for consumers.

**Verdict:** 3 P1 findings, 4 P2 findings, 0 P0 findings.

---

## 2. Interface Satisfaction Analysis

### 2.1 SessionData Declared Fields (37 explicit)

All 37 explicit fields declared in `SessionData` (session-types.ts:177-216) are populated by `collectSessionData` at lines 791-832. Verified field-by-field:

| Field | Populated At | Type Match |
|-------|-------------|------------|
| TITLE | L792 | string — OK |
| DATE | L793 | string — OK |
| TIME | L794 | string — OK |
| SPEC_FOLDER | L795 | string — OK |
| DURATION | L796 | string — OK |
| SUMMARY | L797 | string — OK |
| FILES | L798 | FileChange[] — OK |
| HAS_FILES | L799 | boolean — OK |
| FILE_COUNT | L800 | number — OK |
| OUTCOMES | L801 | OutcomeEntry[] — **WEAK** (see Finding F-03) |
| TOOL_COUNT | L802 | number — OK |
| MESSAGE_COUNT | L803 | number — OK |
| QUICK_SUMMARY | L804 | string — OK |
| SKILL_VERSION | L805 | string — OK |
| OBSERVATIONS | L806 | ObservationDetailed[] — OK |
| HAS_OBSERVATIONS | L807 | boolean — OK |
| SPEC_FILES | L808 | SpecFileEntry[] — OK |
| HAS_SPEC_FILES | L809 | boolean — OK |
| SESSION_ID | L810 | string — OK |
| CHANNEL | L811 | string — OK |
| IMPORTANCE_TIER | L812 | string — OK |
| CONTEXT_TYPE | L813 | string — OK |
| CREATED_AT_EPOCH | L814 | number — OK |
| LAST_ACCESSED_EPOCH | L815 | number — OK |
| EXPIRES_AT_EPOCH | L816 | number — OK |
| TOOL_COUNTS | L817 | ToolCounts — OK |
| DECISION_COUNT | L818 | number — OK |
| ACCESS_COUNT | L819 | number — OK |
| LAST_SEARCH_QUERY | L820 | string — OK |
| RELEVANCE_BOOST | L821 | number — OK |
| PROJECT_PHASE | L822 | string — OK |
| ACTIVE_FILE | L823 | string — OK |
| LAST_ACTION | L824 | string — OK |
| NEXT_ACTION | L825 | string — OK |
| BLOCKERS | L826 | string — OK |
| FILE_PROGRESS | L827 | Array<{FILE_NAME, FILE_STATUS}> — OK |
| HAS_FILE_PROGRESS | L828 | boolean — OK |

**Result:** All 37 declared fields are satisfied with correct types.

### 2.2 Simulation Factory Satisfaction (simulation-factory.ts)

`createSessionData` (simulation-factory.ts:146-208) also returns `SessionData`. Verified:

- All 37 explicit fields present: **YES**
- Extra undeclared fields present:
  - `HAS_IMPLEMENTATION_GUIDE: false` (L201)
  - `TOPIC: ''` (L202)
  - `IMPLEMENTATIONS: []` (L203)
  - `IMPL_KEY_FILES: []` (L204)
  - `EXTENSION_GUIDES: []` (L205)
  - `PATTERNS: []` (L206)

These 6 fields from `ImplementationGuideData` are explicitly added for "backward compatibility with consumers expecting implementation guide data" (L200 comment). They are absorbed by the index signature.

**Result:** Satisfies declared interface. Extra fields are intentional but undeclared.

---

## 3. Hidden Fields Analysis

### 3.1 Fields Injected via Spread Operators

`collectSessionData` (collect-session-data.ts:810-831) uses three spread operators that inject fields not declared in `SessionData`:

#### Spread 1: `...implementationGuide` (L810)

Source: `buildImplementationGuideData()` returns `ImplementationGuideData` (implementation-guide-extractor.ts:38-45)

Injected fields (6):
```
HAS_IMPLEMENTATION_GUIDE: boolean
TOPIC: string
IMPLEMENTATIONS: ImplementationStep[]
IMPL_KEY_FILES: KeyFileWithRole[]
EXTENSION_GUIDES: ExtensionGuide[]
PATTERNS: CodePattern[]
```

#### Spread 2: `...preflightPostflightData` (L830)

Source: `extractPreflightPostflightData()` returns `PreflightPostflightResult` (collect-session-data.ts:80-107)

Injected fields (24):
```
HAS_PREFLIGHT_BASELINE: boolean
HAS_POSTFLIGHT_DELTA: boolean
PREFLIGHT_KNOW_SCORE: number | null
PREFLIGHT_UNCERTAINTY_SCORE: number | null
PREFLIGHT_CONTEXT_SCORE: number | null
PREFLIGHT_KNOW_ASSESSMENT: string
PREFLIGHT_UNCERTAINTY_ASSESSMENT: string
PREFLIGHT_CONTEXT_ASSESSMENT: string
PREFLIGHT_TIMESTAMP: string | null
PREFLIGHT_GAPS: GapDescription[]
PREFLIGHT_CONFIDENCE: number | null
PREFLIGHT_UNCERTAINTY_RAW: number | null
PREFLIGHT_READINESS: string | null
POSTFLIGHT_KNOW_SCORE: number | null
POSTFLIGHT_UNCERTAINTY_SCORE: number | null
POSTFLIGHT_CONTEXT_SCORE: number | null
DELTA_KNOW_SCORE: string | null
DELTA_UNCERTAINTY_SCORE: string | null
DELTA_CONTEXT_SCORE: string | null
DELTA_KNOW_TREND: string
DELTA_UNCERTAINTY_TREND: string
DELTA_CONTEXT_TREND: string
LEARNING_INDEX: number | null
LEARNING_SUMMARY: string
```

#### Spread 3: `...continueSessionData` (L831)

Source: `buildContinueSessionData()` returns `ContinueSessionData` (collect-session-data.ts:122-132)

Injected fields (9):
```
SESSION_STATUS: string
COMPLETION_PERCENT: number
LAST_ACTIVITY_TIMESTAMP: string
SESSION_DURATION: string
CONTINUATION_COUNT: number
CONTEXT_SUMMARY: string
PENDING_TASKS: PendingTask[]
NEXT_CONTINUATION_COUNT: number
RESUME_CONTEXT: ContextItem[]
```

#### Spread Overlap: `DURATION` vs `SESSION_DURATION`

`SessionData` declares `DURATION: string` (populated at L796). `ContinueSessionData` injects `SESSION_DURATION: string` (L831 spread). These are distinct fields — no collision — but the naming inconsistency suggests they represent the same concept.

### 3.2 Total Hidden Field Count

| Source | Fields Injected | Declared in SessionData |
|--------|----------------|------------------------|
| implementationGuide | 6 | 0 of 6 |
| preflightPostflightData | 24 | 0 of 24 |
| continueSessionData | 9 | 0 of 9 |
| **Total** | **39** | **0 of 39** |

**All 39 hidden fields are absorbed by `[key: string]: unknown` and invisible to consumers at compile time.**

---

## 4. Index Signature Abuse Analysis

### 4.1 `SessionData` — `[key: string]: unknown`

**Location:** session-types.ts:215

**Impact:** The index signature `[key: string]: unknown` on `SessionData` means:
1. TypeScript will NOT error if a consumer accesses `sessionData.NONEXISTENT_FIELD` — it just returns `unknown`.
2. The 39 spread fields are silently accepted without type checking.
3. A consumer reading `sessionData.HAS_IMPLEMENTATION_GUIDE` gets type `unknown`, not `boolean`, requiring an unsafe cast or runtime check.
4. Misspelled field names (e.g., `sessionData.IMPLMENTATIONS`) compile without error.

### 4.2 Other Interfaces with Index Signatures

| Interface | File | Index Signature | Justified? |
|-----------|------|----------------|------------|
| DecisionOption | session-types.ts:22 | `[key: string]: unknown` | WEAK — only 6 fields, extensibility unclear |
| DecisionRecord | session-types.ts:49 | `[key: string]: unknown` | WEAK — 20 fields, fully enumerated |
| PhaseEntry | session-types.ts:71 | `[key: string]: unknown` | MARGINAL — has ACTIVITIES optional, may have custom phases |
| ToolCallEntry | session-types.ts:81 | `[key: string]: unknown` | WEAK — 5 fields, stable interface |
| ConversationPhase | session-types.ts:96 | `[key: string]: unknown` | WEAK — 2 fields only |
| DiagramOutput | session-types.ts:130 | `[key: string]: unknown` | WEAK — 10 fields, fully enumerated |
| ToolCounts | session-extractor.ts:36 | `[key: string]: number` | JUSTIFIED — tool names are dynamic by nature |
| CollectedDataFull | collect-session-data.ts:154 | `[key: string]: unknown` | JUSTIFIED — upstream data bag with unknown schema |
| CollectedDataForFiles | file-extractor.ts:67 | `[key: string]: unknown` | JUSTIFIED — same reason as CollectedDataFull |

### 4.3 Workflow Consumer Impact

In `workflow.ts:887-933`, the workflow spreads `...sessionData` into the template data object. Because `SessionData` has `[key: string]: unknown`, TypeScript cannot verify that the template receives the expected implementation guide fields, preflight/postflight fields, or continue-session fields. If any spread in `collectSessionData` is removed or renamed, the workflow will compile cleanly but produce empty template sections at runtime.

---

## 5. Cross-Extractor Consistency

### 5.1 Duplicate Type Definitions

**`ObservationInput` defined twice:**
- `file-extractor.ts:34-41` — includes `facts?: Array<string | { text?: string; files?: string[] }>`
- `implementation-guide-extractor.ts:48-54` — identical definition

These are structurally identical but not shared. They should import from a common source.

**`Observation` (session-extractor.ts:71-80) vs `ObservationInput` (file-extractor.ts:34-41):**
- `Observation.facts` is `Array<string | { text?: string }>` — no `files` sub-field
- `ObservationInput.facts` is `Array<string | { text?: string; files?: string[] }>` — HAS `files` sub-field
- Both represent the same domain concept (observation data) but with incompatible `facts` array types

### 5.2 Naming Inconsistencies

| Concept | session-extractor.ts | file-extractor.ts | implementation-guide-extractor.ts |
|---------|---------------------|-------------------|-----------------------------------|
| File entry | `FileEntry` (.FILE_PATH, .FILE_NAME?, .DESCRIPTION?) | `FileChange` (.FILE_PATH, .DESCRIPTION, .ACTION?) | `FileInput` (.FILE_PATH?, .path?, .DESCRIPTION?, .description?) |
| Observation | `Observation` | `ObservationInput` | `ObservationInput` |

The `FileEntry`/`FileChange`/`FileInput` split is concerning:
- `FileEntry` requires `FILE_PATH` (non-optional)
- `FileChange` requires `FILE_PATH` and `DESCRIPTION` (non-optional)
- `FileInput` makes BOTH `FILE_PATH` and `path` optional, plus dual-casing for `DESCRIPTION`/`description`

### 5.3 `SpecFileEntry` vs `RelatedDoc`

Both represent spec folder documentation files:
- `SpecFileEntry` (session-extractor.ts:96-100): `FILE_NAME` required, `FILE_PATH?`, `DESCRIPTION?`
- `RelatedDoc` (session-extractor.ts:64-68): all three required

`detectRelatedDocs()` returns `RelatedDoc[]` but is cast to `SpecFileEntry[]` at collect-session-data.ts:748:
```ts
SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[];
```
This cast is safe because `RelatedDoc` is a superset of `SpecFileEntry`, but the cast hides the structural mismatch and bypasses TypeScript's checking.

### 5.4 `OutcomeEntry` Missing `TYPE` in Interface

`OutcomeEntry` (session-types.ts:171-174):
```ts
export interface OutcomeEntry {
  OUTCOME: string;
  TYPE?: string;
}
```

Production code at collect-session-data.ts:690-695 always populates `TYPE`:
```ts
const OUTCOMES: OutcomeEntry[] = observations
  .slice(0, 10)
  .map((obs) => ({
    OUTCOME: obs.title || obs.narrative?.substring(0, 300) || '',
    TYPE: detectObservationType(obs)
  }));
```

But the fallback at L801 omits `TYPE`:
```ts
OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress' }],
```

This is technically correct (TYPE is optional), but consumers may depend on TYPE being present based on the happy-path behavior.

---

## 6. Findings

### P1 — Required Fixes

#### F-01: 39 hidden runtime fields on SessionData absorbed by index signature

**File:** `session-types.ts:215`, `collect-session-data.ts:810-831`
**Evidence:** Three spread operators inject `ImplementationGuideData` (6 fields), `PreflightPostflightResult` (24 fields), and `ContinueSessionData` (9 fields) into the return value. None are declared in `SessionData`.
**Impact:** Consumers cannot access these fields with type safety. Any consumer reading e.g. `sessionData.HAS_IMPLEMENTATION_GUIDE` gets `unknown`, not `boolean`. Refactoring any of the spread sources silently breaks consumers without compile errors.
**Recommended fix:** Either (a) add the 39 fields explicitly to `SessionData`, or (b) create a `SessionDataFull` type that extends `SessionData` with `ImplementationGuideData & PreflightPostflightResult & ContinueSessionData`, or (c) use intersection types at the `collectSessionData` return type.

| Hunter | Skeptic | Referee |
|--------|---------|---------|
| P1: 39 undeclared fields, all hidden | The index signature is likely intentional — it enables flexible template rendering without strict typing | CONFIRMED P1: intentional or not, the hidden fields create a maintenance trap. Refactoring spreads will silently break consumers. The fix is additive (no breaking changes). |

#### F-02: `Observation` vs `ObservationInput` incompatible `facts` types

**File:** `session-extractor.ts:74` vs `file-extractor.ts:38`
**Evidence:** `Observation.facts` = `Array<string | { text?: string }>`. `ObservationInput.facts` = `Array<string | { text?: string; files?: string[] }>`. Both represent the same domain concept.
**Impact:** `collectSessionData` passes `Observation[]` to functions expecting `ObservationInput[]` (e.g., `extractFilesFromData` at L688, `buildObservationsWithAnchors` at L721). TypeScript allows this because `ObservationInput.facts` is a wider type, but the `files` sub-field within facts is only used by `file-extractor.ts:192-199` — and it works only because of the structural cast at runtime. If `Observation` is ever used directly as `ObservationInput`, the `files` sub-field will always be `undefined`.
**Recommended fix:** Unify to a single `Observation` type with the broader `facts` type, exported from a shared types file.

| Hunter | Skeptic | Referee |
|--------|---------|---------|
| P1: Incompatible types for same concept | The broader type is always used at call sites, so it works at runtime. The narrower `Observation` definition in session-extractor is just incomplete. | CONFIRMED P1: The divergence is a latent bug. If someone refactors `extractFilesFromData` to accept `Observation[]` (the narrower type), the `files` extraction from facts would be silently removed. |

#### F-03: `FileEntry` / `FileChange` / `FileInput` represent the same concept with incompatible shapes

**File:** `session-extractor.ts:89-93`, `file-extractor.ts:25-31`, `implementation-guide-extractor.ts:57-62`
**Evidence:** Three separate interfaces for "a file referenced in the session" with different optionality and casing:
- `FileEntry`: `FILE_PATH` required
- `FileChange`: `FILE_PATH` + `DESCRIPTION` required
- `FileInput`: all optional, dual-cased (`FILE_PATH`/`path`, `DESCRIPTION`/`description`)
**Impact:** `collectSessionData` casts `FILES as FileEntry[]` at L702/L765 to satisfy `detectSessionCharacteristics` and `buildProjectStateSnapshot`. The cast is lossy — `FileChange` has `DESCRIPTION` and `ACTION` which `FileEntry` lacks. `FileInput` dual-casing means `implementation-guide-extractor.ts` must check both `file.FILE_PATH || file.path` at every usage.
**Recommended fix:** Create a canonical `FileReference` type in `session-types.ts` with a union or normalized shape. Keep `FileChange` as a concrete subtype for the extraction pipeline output.

| Hunter | Skeptic | Referee |
|--------|---------|---------|
| P1: Three incompatible shapes for the same concept | The dual-cased `FileInput` is intentional — it handles both upstream formats. The casts in collectSessionData are harmless. | CONFIRMED P1: While the casts are currently safe, the proliferation of shapes makes it easy to introduce bugs when adding file-related logic. The dual-cased `FileInput` is a code smell that should be resolved by normalizing upstream. |

### P2 — Suggestions

#### F-04: Index signatures on stable, fully-enumerated interfaces

**File:** `session-types.ts:22,49,71,81,96,130`
**Evidence:** `DecisionOption`, `DecisionRecord`, `PhaseEntry`, `ToolCallEntry`, `ConversationPhase`, and `DiagramOutput` all have `[key: string]: unknown` despite having fully-enumerated fields.
**Impact:** Reduces type safety. Misspelled field access compiles silently.
**Recommended fix:** Remove index signatures from interfaces that do not need dynamic keys. If extensibility is needed, use a separate `extras?: Record<string, unknown>` field.

#### F-05: `RelatedDoc[]` cast to `SpecFileEntry[]` at collect-session-data.ts:748

**File:** `collect-session-data.ts:748`
**Evidence:** `SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[]`
**Impact:** Safe today (RelatedDoc is a superset), but if `RelatedDoc` adds a non-optional field not in `SpecFileEntry`, the cast would silently accept an incompatible type.
**Recommended fix:** Either (a) have `detectRelatedDocs` return `SpecFileEntry[]` directly, or (b) make `SpecFileEntry` require all three fields to match `RelatedDoc`.

#### F-06: `DURATION` vs `SESSION_DURATION` naming inconsistency

**File:** `session-types.ts:182` vs `collect-session-data.ts:124`
**Evidence:** `SessionData.DURATION` and `ContinueSessionData.SESSION_DURATION` both represent session duration strings. After spread, the returned object has both.
**Impact:** Consumer confusion — which field to use? Templates may reference one or the other inconsistently.
**Recommended fix:** Either rename `SESSION_DURATION` to `CONTINUATION_DURATION` (if semantically different) or remove the duplicate and use `DURATION` everywhere.

#### F-07: `ObservationInput` duplicated in two files

**File:** `file-extractor.ts:34-41`, `implementation-guide-extractor.ts:48-54`
**Evidence:** Identical interface definition in two files, not shared.
**Impact:** If one is updated and the other is not, they will silently diverge.
**Recommended fix:** Export from a single location (e.g., `session-types.ts` or `file-extractor.ts`) and import in `implementation-guide-extractor.ts`.

---

## 7. Adversarial Self-Check Summary

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final |
|---------|----------------|-------------------|-----------------|-------|
| F-01: 39 hidden fields | P0 | Index sig is intentional for template flexibility | Confirmed but downgraded: maintenance trap, not data loss risk | **P1** |
| F-02: Observation vs ObservationInput facts | P1 | Broader type always used at call sites | Confirmed: latent refactoring trap | **P1** |
| F-03: FileEntry/FileChange/FileInput shapes | P1 | Dual-casing handles upstream formats | Confirmed: proliferation of shapes is maintenance burden | **P1** |
| F-04: Unnecessary index signatures | P2 | May be needed for Mustache template rendering | Confirmed P2: stable interfaces should not have escape hatches | **P2** |
| F-05: RelatedDoc cast to SpecFileEntry | P2 | Currently safe (superset) | Confirmed P2: fragile but not urgent | **P2** |
| F-06: DURATION vs SESSION_DURATION | P2 | Semantically distinct (total vs continuation) | Confirmed P2: naming unclear to consumers | **P2** |
| F-07: Duplicate ObservationInput | P2 | Identical today | Confirmed P2: divergence risk | **P2** |

---

## 8. Positive Observations

1. **Canonical type location:** `session-types.ts` is a well-organized single source of truth for shared types. The separation of concerns (types file vs extractor files) is clean.
2. **Simulation factory parity:** `createSessionData` in `simulation-factory.ts` satisfies all 37 declared fields and adds the 6 implementation guide fields explicitly, showing awareness of consumer expectations.
3. **Import discipline:** Both `simulation-factory.ts` and `collect-session-data.ts` import canonical types from `session-types.ts` rather than redeclaring them.
4. **Path traversal guard:** `collect-session-data.ts:737-743` validates `SPEC_FOLDER` against a boundary directory before use — good security practice.
5. **Re-exports for backward compatibility:** `collect-session-data.ts:46-47` re-exports `SessionData` and `OutcomeEntry` for modules that previously imported from this file.

---

## 9. Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Correctness | 22/30 | All declared fields satisfied; but 39 hidden fields create refactoring risk |
| Security | 25/25 | Path traversal guard present; no credential exposure |
| Patterns | 13/20 | Good canonical type location; poor cross-extractor type consistency |
| Maintainability | 8/15 | Index signature abuse hides contract violations; duplicate interfaces |
| Performance | 10/10 | No performance concerns in type contracts |

**Total: 78/100 — ACCEPTABLE (PASS with notes)**

---

## 10. Files Reviewed

| File | Lines | Role |
|------|-------|------|
| scripts/types/session-types.ts | 217 | Canonical type definitions |
| scripts/extractors/collect-session-data.ts | 854 | Primary SessionData producer |
| scripts/extractors/session-extractor.ts | 476 | Session metadata extraction + types |
| scripts/extractors/file-extractor.ts | 392 | File extraction + ObservationDetailed type |
| scripts/extractors/implementation-guide-extractor.ts | 401 | Implementation guide data producer |
| scripts/lib/simulation-factory.ts | 493 | Simulation SessionData producer |
| scripts/core/workflow.ts | ~1100 | Primary SessionData consumer |
