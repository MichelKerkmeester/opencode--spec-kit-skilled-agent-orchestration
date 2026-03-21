# QA Audit: file-extractor.ts

**Auditor:** Opus 4.6 (Reviewer agent)
**Date:** 2026-03-09
**File:** `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` (391 LOC)
**Scope:** ACTION field preservation, file dedup logic, backward compat with stateful mode, empty file list handling, rename detection
**Severity:** P0=data loss/security/crash, P1=incorrect output/silent corruption, P2=code quality

---

## Score Breakdown

| Dimension        | Score   | Notes                                                   |
|:-----------------|:--------|:--------------------------------------------------------|
| Correctness      | 24/30   | ACTION field lost in dedup merge; path truncation breaks dedup |
| Security         | 24/25   | No injection vectors; relies on upstream sanitization   |
| Patterns         | 18/20   | Good alignment with project conventions                 |
| Maintainability  | 13/15   | Clear structure; minor doc gaps on merge semantics      |
| Performance      | 9/10    | Efficient Map-based dedup; minor O(n*m) in basename match |

**Total: 88/100 — ACCEPTABLE (PASS with notes)**

---

## Adversarial Self-Check (Hunter/Skeptic/Referee)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---------|-----------------|-------------------|-----------------|----------------|
| 1 | ACTION field silently lost during addFile dedup merge | P1 | "action is carried forward via `action \|\| existing.action`" — but only when description wins; provenance-only branch drops it | Confirmed: line 150-155 provenance-only update path omits `action`, so a later Source 2/3 entry with no action can trigger this branch and fail to carry the original action forward. However, for provenance-only updates the existing action IS preserved via spread (`...existing`) at line 152. Downgraded — the spread does carry `action`. | Dropped |
| 2 | Path truncation in toRelativePath breaks dedup key identity | P1 | "Paths >60 chars get middle-collapsed to `a/.../y/z`, making two distinct deep paths collide if they share root+basename" | Confirmed: Two files `src/components/deep/nested/feature/ButtonPrimary.tsx` and `src/components/deep/nested/admin/ButtonPrimary.tsx` both collapse to `src/.../nested/ButtonPrimary.tsx` → false dedup merge. This is in file-helpers.ts, not file-extractor.ts, but file-extractor is the primary consumer. | P1 |
| 3 | ACTION field not rendered in template — data carried but never shown | P1 | "Template at line 337 renders `FILE_PATH` and `DESCRIPTION` only; ACTION is structurally present but invisible to the user" | Confirmed but by design: ACTION is consumed by `enhanceFilesWithSemanticDescriptions` and tree thinning, not only by the template. It's metadata for intermediate processing. | Dropped |
| 4 | Rename detection does not track old+new path pair | P1 | "git-context-extractor resolves renames to just the new path (line 78: `rest[rest.length - 1]`); old path is discarded. file-extractor has 'Renamed' in ACTION_MAP but no mechanism to link old→new" | Confirmed: Rename tracking is lossy. The old path from `R100 old.ts new.ts` is silently dropped. In file-extractor the ACTION 'Renamed' is preserved but the semantic information of WHAT was renamed FROM is lost. However, this is an upstream issue (git-context-extractor), not file-extractor's fault. | P2 (for file-extractor; P1 for git-context-extractor) |
| 5 | Observation dedup narrative mutation corrupts on 3+ repeats if original narrative contains "(repeated N times)" text | P1 | "Line 365 regex `\(repeated \d+ times\)` could match user-authored text containing that phrase, replacing the wrong substring" | Confirmed but extremely unlikely in practice — observations are machine-generated with short titles/narratives. | Downgraded to P2 |
| 6 | Empty collectedData.FILES handled but null FILES array inside collectedData is not guarded | P1 | "Line 167 checks `collectedData.FILES && Array.isArray(...)` which handles null/undefined" | Dropped: the guard is correct. `null`, `undefined`, and non-array values all skip the loop. | Dropped |

---

## P0 Findings (Blockers)

None.

---

## P1 Findings (Required)

### P1-1: Path truncation in `toRelativePath` creates false dedup collisions

**File:** `scripts/utils/file-helpers.ts:19-24` (consumed at `file-extractor.ts:134`)
**Evidence:**
```typescript
// file-helpers.ts lines 19-24
if (cleaned.length > 60) {
  const parts: string[] = cleaned.replace(/\\/g, '/').split('/');
  if (parts.length > 3) {
    return `${parts[0]}/.../${parts.slice(-2).join('/')}`;
  }
}
```
**Impact:** When two files share a common root directory and last two path segments but differ in intermediate directories, `toRelativePath` collapses them to the same string. Since `file-extractor.ts` uses the return value of `toRelativePath` as the `Map` key (line 134), these files are falsely merged — the second file's data overwrites (or is discarded by) the first. This is a **silent data loss** of distinct file entries.

**Example:** Both paths below exceed 60 characters:
- `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` (69 chars) → `.opencode/.../extractors/file-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/file-extractor.ts` (64 chars) → `.opencode/.../tests/file-extractor.ts`

These would NOT collide (different last-2 segments). But consider:
- `src/modules/admin/components/shared/Button.tsx` → `src/.../shared/Button.tsx`
- `src/modules/user/components/shared/Button.tsx` → `src/.../shared/Button.tsx`

These WOULD collide (same root + same last-2 segments = identical truncated key).

**Fix:** Use the full normalized path as the dedup key in `extractFilesFromData`, and only truncate for display purposes when emitting the final `FILE_PATH` value — or increase the truncation threshold significantly (e.g., 120 chars).

---

## P2 Findings (Suggestions)

### P2-1: `normalizeFileAction` defaults unknown actions to 'Modified' — could mask upstream bugs

**File:** `file-extractor.ts:84-86`
**Evidence:**
```typescript
function normalizeFileAction(action: string): string {
  return ACTION_MAP[action.toLowerCase()] || 'Modified';
}
```
**Impact:** If an upstream source introduces a new action type (e.g., 'moved', 'copied'), it silently becomes 'Modified'. While this is safe fallback behavior, adding a `console.warn` for unknown action values would improve debuggability.

### P2-2: `(fileInfo as any).ACTION` type assertion bypasses TypeScript safety

**File:** `file-extractor.ts:171`
**Evidence:**
```typescript
const action = (fileInfo as any).ACTION || (fileInfo as any).action;
```
**Impact:** The `CollectedDataForFiles.FILES` interface (lines 58-65) does not declare `ACTION` or `action` fields. The `as any` cast works at runtime but defeats the type system. The interface should be extended to include `ACTION?: string; action?: string;` for full type safety.

### P2-3: Observation dedup narrative regex could match user-authored text

**File:** `file-extractor.ts:365`
**Evidence:**
```typescript
existing.obs.narrative = (existing.obs.narrative || title).replace(
  /\(repeated \d+ times\)/,
  `(repeated ${existing.count} times)`
);
```
**Impact:** If an observation's original narrative happens to contain the substring "(repeated 5 times)", the regex will replace that text instead of appending a count. Low probability with machine-generated data, but the fix is simple: anchor the pattern to the end of the string (`/\(repeated \d+ times\)$/`).

### P2-4: Rename tracking loses the source path

**File:** `file-extractor.ts:81` (ACTION_MAP entry) + `git-context-extractor.ts:78`
**Evidence:** The ACTION_MAP includes `renamed: 'Renamed'` but the file-extractor has no mechanism to store or display the original (source) path of a rename. The git-context-extractor discards the old path when parsing `R100 old.ts new.ts` status lines (takes only `rest[rest.length - 1]`). This means rename operations are tracked as "Renamed" with no indication of what the file was previously named.

**Impact:** Memory context loses rename provenance. Users reviewing generated memory files cannot determine what file was renamed from. This is primarily an upstream issue in git-context-extractor, but file-extractor's `FileChange` interface could be extended with an optional `RENAMED_FROM?: string` field to support it.

### P2-5: Basename matching in `enhanceFilesWithSemanticDescriptions` has O(n*m) complexity

**File:** `file-extractor.ts:246-256`
**Evidence:** For each file in the input array (n), the function iterates over all entries in `semanticFileChanges` (m) looking for basename matches. For typical workloads (n < 50, m < 50) this is negligible, but if files or semantic changes grow large, a pre-built basename index (Map from basename to entries) would be more efficient.

### P2-6: `_synthetic` field can be `undefined` when spread into output

**File:** `file-extractor.ts:148, 154, 161, 219`
**Evidence:** The `_synthetic` field is typed as `boolean | undefined`. When it flows through `nextSynthetic = synthetic ?? existing?._synthetic`, the result can be `undefined`. The spread `_synthetic: nextSynthetic` then sets `_synthetic: undefined` on the output object, which differs semantically from the field being absent. While downstream consumers likely treat both the same, explicit filtering (`nextSynthetic !== undefined ? { _synthetic: nextSynthetic } : {}`) would be cleaner.

---

## Positive Highlights

1. **Robust null/empty handling:** Lines 114, 124-126 — both `collectedData` and `observations` are gracefully defaulted to empty structures. The function never throws on missing input.

2. **Multi-source extraction with priority:** The `addFile` closure (lines 127-164) correctly implements a priority-based merge strategy: longer valid descriptions win, provenance metadata is preserved, and the first entry establishes the baseline.

3. **Observation dedup is well-designed:** The `deduplicateObservations` function (lines 325-378) properly deep-copies arrays before mutation, uses a composite key (title + sorted files), and tracks merge counts — a solid implementation for reducing noise in generated memory files.

4. **Clean separation of concerns:** The module cleanly separates extraction (Section 3), semantic enhancement (Section 4), and observation anchoring (Section 5) into independent, testable functions.

5. **Backward compatibility:** The `CollectedDataForFiles` interface (lines 57-68) supports both new format (`FILES[].FILE_PATH`) and legacy format (`filesModified[].path`), ensuring stateful mode data still works.

---

## Files Reviewed

| File | Lines | Issues |
|:-----|:------|:-------|
| `scripts/extractors/file-extractor.ts` | 391 | 1 P1, 6 P2 |
| `scripts/utils/file-helpers.ts` | 82 | (P1-1 root cause) |
| `scripts/utils/path-utils.ts` | 108 | (context) |
| `scripts/core/config.ts` | 311 | (context) |
| `scripts/core/workflow.ts` | 880-920 | (consumer context) |
| `scripts/extractors/git-context-extractor.ts` | 176 | (upstream context) |
| `scripts/extractors/collect-session-data.ts` | 688-724 | (consumer context) |
| `templates/context_template.md` | 331-338 | (template context) |
| `scripts/lib/anchor-generator.ts` | 311 | (dependency context) |

---

## Recommendation

**PASS with notes.** Score 88/100. No P0 blockers. One P1 (path truncation causing false dedup collisions) should be addressed in a follow-up, but it requires changes in `file-helpers.ts` not in the audited file itself. The P2 items are quality improvements that can be addressed opportunistically.
