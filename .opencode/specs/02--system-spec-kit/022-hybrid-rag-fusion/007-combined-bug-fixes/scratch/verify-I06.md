# Agent I06: Type Interface Contract Verification

**Date:** 2026-03-08
**Scope:** Cross-module type contract audit across the extractor pipeline
**Files reviewed:**
- `scripts/extractors/git-context-extractor.ts`
- `scripts/extractors/spec-folder-extractor.ts`
- `scripts/extractors/collect-session-data.ts`
- `scripts/extractors/session-extractor.ts`
- `scripts/types/session-types.ts`
- `scripts/core/workflow.ts` (merge logic at lines 438-520)

---

## Summary

The type interface contracts across the pipeline are **generally well-structured** with explicit provenance tagging and formal interfaces. However, there are concrete type safety gaps in the merge layer within `workflow.ts` where `as any` casts bypass the type system, and a structural mismatch between the observation types produced by the new extractors versus the `Observation` interface consumed by `collect-session-data.ts`. The provenance/synthetic fields exist in extractor return types but are absent from the canonical `Observation` interface, creating a silent type widening that relies on the index signature escape hatch.

**Overall Assessment:** CONDITIONAL PASS (score: 74/100)

---

## Interface Audit

### 1. GitContextExtraction (git-context-extractor.ts:26-46)

**Return type fields:**

| Field | Type | Populated by `extractGitContext()` | Verified |
|---|---|---|---|
| `observations` | `Array<{type, title, narrative, timestamp, facts, files, _provenance, _synthetic}>` | Lines 148-170 | YES - all fields assigned |
| `FILES` | `Array<{FILE_PATH, DESCRIPTION, ACTION?, _provenance}>` | Lines 136-146 | YES - all fields assigned |
| `summary` | `string` | Line 180 | YES |
| `commitCount` | `number` | Line 181 (commits.length) | YES |
| `uncommittedCount` | `number` | Line 182 (statusEntries.length) | YES |

**Empty-result contract:** `emptyResult()` at line 47-49 returns valid empty arrays and zero counts. Correctly typed.

**Verdict:** All interface fields are populated. The `_provenance: 'git'` literal and `_synthetic: true` literal are correctly assigned as const values matching the interface.

### 2. SpecFolderExtraction (spec-folder-extractor.ts:14-31)

**Return type fields:**

| Field | Type | Populated by `extractSpecFolderContext()` | Verified |
|---|---|---|---|
| `observations` | `Array<{type, title, narrative, timestamp, facts, files, _provenance, _synthetic}>` | Lines 230-275 | YES |
| `FILES` | `Array<{FILE_PATH, DESCRIPTION, _provenance}>` | Line 279 | YES |
| `recentContext` | `Array<{learning, request, files}>` | Lines 280-284 | YES |
| `summary` | `string` | Lines 223-228 | YES |
| `triggerPhrases` | `string[]` | Lines 286-289 | YES |
| `decisions` | `Array<{title, rationale, chosen, _provenance}>` | Line 290 | YES |
| `sessionPhase` | `string` | Line 291 | YES |

**Verdict:** All interface fields populated. Uses `as const` for provenance literals correctly.

### 3. CollectedDataFull (collect-session-data.ts:135-148)

| Field | Type | Notes |
|---|---|---|
| `recentContext?` | `RecentContextEntry[]` | Optional, matches session-extractor export |
| `observations?` | `Observation[]` | **TYPE MISMATCH** -- see finding F-01 |
| `userPrompts?` | `UserPrompt[]` | Optional, matches session-extractor export |
| `SPEC_FOLDER?` | `string` | Optional |
| `FILES?` | `Array<{FILE_PATH?, path?, DESCRIPTION?, description?}>` | Dual-name pattern for compat |
| `filesModified?` | `Array<{path, changes_summary?}>` | Optional |
| `_manualDecisions?` | `unknown[]` | **Untyped** -- see finding F-02 |
| `_manualTriggerPhrases?` | `string[]` | Correctly typed |
| `_isSimulation?` | `boolean` | Correctly typed |
| `preflight?` | `PreflightData` | Correctly typed |
| `postflight?` | `PostflightData` | Correctly typed |
| `[key: string]: unknown` | Index signature | **Escape hatch** -- see finding F-03 |

### 4. SessionData (types/session-types.ts:177-216)

| Field | Type | Notes |
|---|---|---|
| `SESSION_ID` | `string` | Receives `generateSessionId()` output (line 716) |
| All 30+ fields | Various | Fully populated by `collectSessionData()` |
| `[key: string]: unknown` | Index signature | **Escape hatch** -- see finding F-03 |

### 5. Session ID Type (session-extractor.ts:125-128)

```typescript
function generateSessionId(): string {
  const randomPart = crypto.randomBytes(6).toString('hex');
  return `session-${Date.now()}-${randomPart}`;
}
```

**Verification:** Uses `crypto.randomBytes(6)` (CSPRNG, 48 bits entropy). Output is `string` matching `SESSION_ID: string` in `SessionData`. The hex encoding guarantees `[a-f0-9]` charset. Return type `string` is correct -- `crypto.randomBytes().toString('hex')` always returns `string`.

### 6. Observation Interface (session-extractor.ts:71-78)

```typescript
export interface Observation {
  type?: string;
  narrative?: string;
  facts?: Array<string | { text?: string }>;
  title?: string;
  timestamp?: string;
  files?: string[];
}
```

**Critical:** This interface has NO `_provenance` or `_synthetic` fields. Both extractors produce observations with these fields. See finding F-01.

---

## Type Safety Issues

### F-01: Observation type mismatch (P1)

**Location:** workflow.ts:451-454, workflow.ts:498-502
**Evidence:**

The `Observation` interface (session-extractor.ts:71-78) defines:
```typescript
{ type?, narrative?, facts?, title?, timestamp?, files? }
```

But `GitContextExtraction.observations` and `SpecFolderExtraction.observations` produce objects with additional fields:
```typescript
{ type, title, narrative, timestamp, facts, files, _provenance: 'git', _synthetic: true }
```

In `workflow.ts:451-454`, these are merged directly into `collectedData.observations` which is typed as `Observation[]`:
```typescript
collectedData.observations = [...existingObs, ...specContext.observations];
```

This assignment succeeds at compile time because TypeScript uses structural typing -- the extractor observations are a supertype of `Observation` (they have all required fields plus extras). However, the `_provenance` and `_synthetic` fields are **silently dropped from the type information**. Any downstream code consuming `Observation[]` has no awareness these fields exist.

**Impact:** Code that later reads `_provenance` or `_synthetic` from observations must use unsafe casts or runtime checks. The provenance data IS present at runtime but invisible to the type system.

**Hunter severity:** P1 -- type contract gap enabling silent data loss in type narrowing
**Skeptic challenge:** TypeScript structural typing means the data IS preserved at runtime. The fields are accessible via `(obs as any)._provenance`. The `Observation` interface intentionally uses optional fields for flexibility. No downstream code currently fails.
**Referee verdict:** CONFIRMED P1 -- the provenance fields serve a real purpose (filtering, deduplication) and should be formally typed. The structural typing makes it "work" but the contract is incomplete.

### F-02: `_manualDecisions` typed as `unknown[]` (P2)

**Location:** collect-session-data.ts:142
**Evidence:**
```typescript
_manualDecisions?: unknown[];
```

In workflow.ts:476-479, spec-folder decisions with type `{title, rationale, chosen, _provenance}` are pushed into this field. The `unknown[]` type erases all structure. Downstream consumers must cast.

**Impact:** Low immediate risk since this is an intermediate transport field. But any consumer must cast blindly.

**Hunter severity:** P2
**Skeptic challenge:** This is intentionally loose to accept decisions from multiple sources with different shapes. The field is consumed by template rendering which accesses properties dynamically anyway.
**Referee verdict:** CONFIRMED P2 -- suggestion to type as `Array<{title: string; rationale: string; chosen: string; _provenance?: string}>` or similar.

### F-03: Index signature escape hatches on `CollectedDataFull` and `SessionData` (P2)

**Location:** collect-session-data.ts:147, session-types.ts:215
**Evidence:**
```typescript
[key: string]: unknown;  // on both interfaces
```

These index signatures allow arbitrary properties to be set without type errors. In workflow.ts:727:
```typescript
(sessionData as any).TOOL_COUNT = (collectedData.FILES as any[]).length;
```

The `as any` cast here is unnecessary -- `SessionData` already has `TOOL_COUNT: number` as a named field, and the index signature would also allow assignment. The cast suggests the author was unsure about the type contract.

**Hunter severity:** P1 -- `as any` bypasses type safety
**Skeptic challenge:** The index signatures exist because `SessionData` is spread into Mustache templates that expect arbitrary keys. The `as any` at line 727 is a code smell but functionally harmless since it assigns a number to a number field.
**Referee verdict:** DOWNGRADED to P2 -- the `as any` is unnecessary but not dangerous. The index signatures are architectural decisions for template compatibility.

### F-04: `as any` casts in FILE deduplication (P1)

**Location:** workflow.ts:459, workflow.ts:462, workflow.ts:507, workflow.ts:510
**Evidence:**
```typescript
existingFiles.map((f: any) => (f.FILE_PATH || f.path || '').toLowerCase())
```

and:
```typescript
const newFiles = specContext.FILES.filter(
  (f: any) => !existingPaths.has(f.FILE_PATH.toLowerCase())
);
```

The `(f: any)` casts appear four times in the merge logic. For the `existingFiles` from `collectedData.FILES`, the type is already `Array<{FILE_PATH?, path?, DESCRIPTION?, description?}>` -- which supports both field names. The `as any` is used to avoid dealing with the optional types, but it silences any property access errors.

For `specContext.FILES`, the type is `Array<{FILE_PATH: string; DESCRIPTION: string; _provenance: 'spec-folder'}>` where `FILE_PATH` is NOT optional -- the `as any` cast is entirely unnecessary.

For `gitContext.FILES`, the type is `Array<{FILE_PATH: string; DESCRIPTION: string; ACTION?: string; _provenance: 'git'}>` where `FILE_PATH` is also NOT optional -- again unnecessary.

**Hunter severity:** P1 -- four `as any` casts that bypass type checking on well-typed data
**Skeptic challenge:** The casts handle the mixed-origin data in `collectedData.FILES` where both `FILE_PATH` and `path` naming conventions exist. The `as any` on extractor outputs is copy-paste from the existing-files handling.
**Referee verdict:** CONFIRMED P1 -- the casts on extractor outputs (`specContext.FILES`, `gitContext.FILES`) are unnecessary and should be removed. The cast on `existingFiles` could be replaced with a proper type guard.

### F-05: Missing `SUMMARY` field on `CollectedDataFull` (P2)

**Location:** workflow.ts:483-485
**Evidence:**
```typescript
if (specContext.summary && (!collectedData.SUMMARY || collectedData.SUMMARY === 'Development session')) {
  collectedData.SUMMARY = specContext.summary;
}
```

`CollectedDataFull` has no declared `SUMMARY` field. This assignment works only because of the `[key: string]: unknown` index signature. The property is consumed later in `collectSessionData` at line 687 where it's accessed as `(sessionInfo as RecentContextEntry).learning || observations...`. The `SUMMARY` field is actually never read from `CollectedDataFull` directly by `collectSessionData` -- it rebuilds the summary from observations. So this assignment may be dead code, or it's consumed by a different code path.

**Hunter severity:** P2
**Skeptic challenge:** The index signature makes this valid TypeScript. The field may be consumed by template rendering or other downstream consumers not in scope.
**Referee verdict:** CONFIRMED P2 -- should either add `SUMMARY?: string` to `CollectedDataFull` or verify the field is actually consumed.

---

## Adversarial Self-Check Summary

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---|---|---|---|
| F-01: Observation provenance fields not in Observation interface | P1 | Structural typing preserves data at runtime | Confirmed -- contract is incomplete | **P1** |
| F-02: `_manualDecisions` typed as `unknown[]` | P2 | Intentionally loose for multi-source input | Confirmed -- suggestion to narrow | **P2** |
| F-03: Index signature escape hatches + unnecessary `as any` | P1 | Architectural for template compat | Downgraded -- not dangerous | **P2** |
| F-04: Four `as any` casts in FILE merge logic | P1 | Handles mixed naming conventions | Confirmed -- unnecessary on extractor outputs | **P1** |
| F-05: `SUMMARY` field undeclared on `CollectedDataFull` | P2 | Index signature makes it valid | Confirmed -- should be declared or verified | **P2** |

---

## Findings

### P0 (Blockers)

None.

### P1 (Required)

**F-01: Observation type lacks provenance fields**
- **File:** `scripts/extractors/session-extractor.ts:71-78`
- **Impact:** `_provenance` and `_synthetic` fields from git/spec extractors are invisible to the type system after merge into `Observation[]`. Downstream filtering or deduplication by provenance requires unsafe casts.
- **Fix:** Add optional fields to `Observation`: `_provenance?: string; _synthetic?: boolean;`

**F-04: Unnecessary `as any` casts in merge logic**
- **File:** `scripts/core/workflow.ts:459, 462, 507, 510`
- **Impact:** Type checking disabled on well-typed extractor outputs. Copy-paste from mixed-source handling applied to strongly-typed data.
- **Fix:** Remove `as any` from extractor output lambdas. For `existingFiles`, use proper type narrowing: `(f) => (f.FILE_PATH || f.path || '').toLowerCase()`

### P2 (Suggestions)

**F-02:** Narrow `_manualDecisions` from `unknown[]` to a decision-specific type.

**F-03:** Remove the unnecessary `as any` at workflow.ts:727 -- `TOOL_COUNT` is already a named field on `SessionData`.

**F-05:** Add `SUMMARY?: string` to `CollectedDataFull` or verify the assignment at workflow.ts:484 reaches downstream consumers.

---

## Positive Observations

1. **Strong provenance tagging** -- Both extractors tag every observation and file entry with `_provenance` and `_synthetic` literals, enabling downstream filtering by source. This is a well-designed pattern.

2. **Session ID entropy** -- `generateSessionId()` correctly uses `crypto.randomBytes(6)` (CSPRNG, 48 bits) with hex encoding. The return type `string` correctly matches `SessionData.SESSION_ID: string`.

3. **Parallel extraction** -- `workflow.ts:443-446` runs both extractors via `Promise.all` with `.catch(() => null)` guards, ensuring one failure does not block the other.

4. **Canonical types in session-types.ts** -- The `SessionData` and related types are well-structured canonical definitions shared across the pipeline, eliminating parallel type hierarchies.

5. **Path traversal guard** -- `collect-session-data.ts:724-730` validates spec folder paths against a boundary before use, preventing directory traversal attacks.

6. **Empty-result contracts** -- Both extractors have explicit empty-result functions that return correctly typed zero-value objects, ensuring callers always receive valid data.

---

## Score Breakdown

| Dimension | Score | Notes |
|---|---|---|
| **Correctness** (30) | 24/30 | All fields populated; observation type mismatch is structural, not runtime-breaking |
| **Security** (25) | 23/25 | Session ID uses CSPRNG; path traversal guarded; no secrets exposed |
| **Patterns** (20) | 14/20 | Provenance pattern is good but `as any` casts violate TypeScript discipline; index signatures used as escape hatch |
| **Maintainability** (15) | 10/15 | Interfaces are well-documented; but provenance fields invisible to type system hurts discoverability |
| **Performance** (10) | 9/10 | Parallel extraction; efficient deduplication via Set; no obvious issues |

**Total: 80/100 -- ACCEPTABLE (PASS with notes)**

---

## Verdict

**CONDITIONAL PASS**

The type interface contracts across the pipeline are fundamentally sound. All extractor return types are fully populated, the session ID uses proper cryptographic randomness, and the canonical `SessionData` type is comprehensive. Two P1 issues require attention:

1. The `Observation` interface should be extended with `_provenance` and `_synthetic` optional fields to make provenance data visible to the type system after merge.
2. Four `as any` casts in the workflow merge logic should be removed where they operate on already-typed extractor outputs.

Neither issue causes runtime failures, but both weaken type-level guarantees that TypeScript is supposed to enforce.
