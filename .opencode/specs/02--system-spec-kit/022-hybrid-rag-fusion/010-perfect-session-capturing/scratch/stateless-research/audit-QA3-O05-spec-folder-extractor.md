# Audit QA3-O05: spec-folder-extractor.ts

**File:** `.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts`
**LOC:** 293
**Auditor:** Claude Opus 4.6 (Reviewer agent)
**Date:** 2026-03-09
**Scope:** Deep code quality audit — frontmatter parsing, observation capping, provenance markers, path safety, regex safety, table parsing

---

## Score Breakdown

| Dimension        | Score | Max | Notes |
|------------------|-------|-----|-------|
| Correctness      | 21    | 30  | Frontmatter parser silently corrupts data on mixed value/list keys; observation capping drops important status data; JSON.stringify dedup is fragile |
| Security         | 22    | 25  | No path traversal in readDoc (hardcoded filenames), but no validation on specFolderPath itself; no secrets exposure |
| Patterns         | 17    | 20  | Consistent provenance tagging; follows codebase conventions; not exported from barrel (minor) |
| Maintainability  | 13    | 15  | Clean structure, good separation; missing JSDoc on exported function; some inline complexity |
| Performance      | 9     | 10  | Sync I/O appropriate for this use case; no obvious bottlenecks |
| **TOTAL**        | **82**| 100 | **ACCEPTABLE — PASS with required fixes** |

---

## Adversarial Self-Check (Hunter/Skeptic/Referee)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final |
|---|---------|----------------|-------------------|-----------------|-------|
| 1 | Observation capping silently drops progress/checklist | P1 | "15 is generous; real specs rarely have >14 requirements" | Confirmed: progress and checklist carry unique status data that downstream consumers rely on. Silent loss is incorrect output | P1 |
| 2 | parseFrontmatter overwrites string values when list items follow | P1 | "Spec frontmatter rarely mixes scalar+list under same key" | Confirmed: the bug is real and reproducible. Even if rare, it causes silent data corruption when triggered | P1 |
| 3 | parseFrontmatter treats quote-only values as empty arrays | P1 | "Edge case so rare it may never occur in practice" | Downgraded: extremely unlikely with real frontmatter content | P2 |
| 4 | FILES dedup via JSON.stringify is key-order-dependent | P1 | "All FILE objects are constructed in spec-folder-extractor itself with consistent key order" | Downgraded: since construction is internal and consistent, this is a latent fragility not an active bug | P2 |
| 5 | cleanText does not handle unclosed HTML comments | P1 | "Regex /<!--[\s\S]*?-->/ simply does not match unclosed comments, leaving them intact — no crash" | Downgraded: correct, unclosed comments pass through as text, which is acceptable degradation | P2 |
| 6 | determineSessionPhase returns "testing" when no tasks exist but checklist is incomplete | P1 | "If a checklist exists with incomplete items, 'testing' is a reasonable phase regardless of task state" | Dropped: the phase label is semantically reasonable — having a checklist implies the spec is being verified | Dropped |
| 7 | specFolderPath not validated against traversal | P1 | "specFolderPath comes from trusted internal sources (CONFIG.SPEC_FOLDER_ARG parsed from CLI), not user input" | Downgraded: defense-in-depth would be nice, but the attack surface is minimal since it requires CLI argument control | P2 |

---

## P0 Findings (Blockers)

None.

---

## P1 Findings (Required)

### P1-1: Observation capping silently drops progress and checklist data

**File:** `spec-folder-extractor.ts:275`
**Evidence:**
```typescript
].slice(0, MAX_SPEC_OBSERVATIONS);
```

**Impact:** When a spec has many requirements (>13 with metadata), the `.slice(0, 15)` cap drops the progress observation (task completion stats) and checklist verification observation from the end of the array. These carry unique status information that `determineSessionPhase` and downstream consumers rely on. The session phase is still computed correctly (it reads raw stats, not observations), but the progress/checklist observations are lost from the memory output.

**Reproduction:** A spec with 14+ requirements in its REQUIREMENTS table causes progress and checklist observations to be silently dropped.

**Fix:** Reserve slots for structural observations (metadata, progress, verification) before filling with requirement observations. For example:
```typescript
const structural = observations.filter(o => ['metadata','progress','verification'].includes(o.type));
const requirements = observations.filter(o => o.type === 'requirement');
const capped = [...structural, ...requirements.slice(0, MAX_SPEC_OBSERVATIONS - structural.length)];
```

---

### P1-2: parseFrontmatter overwrites string value when followed by YAML list items

**File:** `spec-folder-extractor.ts:54-65`
**Evidence:**
```typescript
data[currentKey] = value || [];   // line 57: sets "active" as string
// ...
const existing = Array.isArray(data[currentKey]) ? data[currentKey] as string[] : [];  // line 62: string is not array, so existing=[]
existing.push(item[1].trim()...);
data[currentKey] = existing;  // line 64: overwrites "active" with ["item1"]
```

**Impact:** If frontmatter has a key with a string value followed by indented list items (malformed but plausible YAML), the string value is silently replaced by an array of just the list items. Example:
```yaml
status: active
  - override
```
Produces `{ status: ["override"] }` instead of `{ status: "active" }`.

**Reproduction:** Confirmed via test — `parseFrontmatter("---\nstatus: active\n  - item1\n---\n")` returns `{ data: { status: ["item1"] }, body: "" }`.

**Fix:** When `currentKey` has a non-array value, skip list item parsing for that key (treat the line as unstructured content):
```typescript
if (item && currentKey && Array.isArray(data[currentKey])) {
  (data[currentKey] as string[]).push(item[1].trim().replace(/^['"]|['"]$/g, ''));
}
```

---

## P2 Findings (Suggestions)

### P2-1: FILES deduplication via JSON.stringify is key-order-dependent

**File:** `spec-folder-extractor.ts:279`
**Evidence:**
```typescript
FILES: dedupe(spec.files.map((file) => JSON.stringify(file))).map((file) => JSON.parse(file) as ...),
```

**Impact:** If two objects have identical data but different key insertion order, `JSON.stringify` produces different strings and deduplication fails. Currently all FILE objects are constructed internally with consistent key order, so this is latent fragility rather than an active bug.

**Suggestion:** Use path-based deduplication instead:
```typescript
const seen = new Set<string>();
const uniqueFiles = spec.files.filter(f => {
  if (seen.has(f.FILE_PATH)) return false;
  seen.add(f.FILE_PATH);
  return true;
});
```

---

### P2-2: parseFrontmatter quote stripping can produce false empty values

**File:** `spec-folder-extractor.ts:56`
**Evidence:**
```typescript
const value = kv[2].trim().replace(/^['"]|['"]$/g, '');
```

A value like `"'` (just a single quote) gets stripped to empty string, triggering `value || []` to set the key as an empty array instead of a string. Extremely unlikely in practice but demonstrates the `||` fallback is over-aggressive.

**Suggestion:** Use explicit empty check: `data[currentKey] = value !== '' ? value : [];`

---

### P2-3: specFolderPath is not validated for path traversal

**File:** `spec-folder-extractor.ts:38-39`
**Evidence:**
```typescript
function readDoc(specFolderPath: string, fileName: string): string | null {
  return fs.readFileSync(path.join(specFolderPath, fileName), 'utf8');
```

While `fileName` is always hardcoded (e.g., `'spec.md'`, `'plan.md'`), `specFolderPath` comes from the caller. If an attacker controlled `specFolderPath`, they could read arbitrary files. In practice, `specFolderPath` comes from `CONFIG.SPEC_FOLDER_ARG` (CLI argument), making exploitation unlikely.

**Suggestion:** Add a guard that `specFolderPath` is within `CONFIG.PROJECT_ROOT`:
```typescript
const resolved = path.resolve(specFolderPath);
if (!resolved.startsWith(path.resolve(CONFIG.PROJECT_ROOT))) {
  throw new Error('specFolderPath is outside project root');
}
```

---

### P2-4: cleanText leaves unclosed HTML comments intact

**File:** `spec-folder-extractor.ts:72`
**Evidence:**
```typescript
.replace(/<!--[\s\S]*?-->/g, ' ')
```

An unclosed `<!-- comment` passes through as literal text. The lazy `*?` quantifier means no ReDoS risk, and the behavior (leaving unclosed comments as-is) is acceptable graceful degradation. Just noting for awareness.

---

### P2-5: Hardcoded MAX_SPEC_OBSERVATIONS diverges from CONFIG.MAX_OBSERVATIONS

**File:** `spec-folder-extractor.ts:12`
**Evidence:**
```typescript
const MAX_SPEC_OBSERVATIONS = 15;
```

The config system provides `CONFIG.MAX_OBSERVATIONS` (default: 3) for observation limits, but this extractor uses its own hardcoded constant of 15. This is intentional (spec-folder extraction needs more slots than live session extraction), but the divergence is undocumented. A comment explaining the rationale would aid maintainability.

---

### P2-6: Not exported from barrel index

**File:** `extractors/index.ts`

The `spec-folder-extractor` module is not re-exported from the barrel `index.ts`. It is imported directly by `workflow.ts`. This is acceptable if the module is considered internal, but inconsistent with how other extractors are exported.

---

### P2-7: normalizeFilePath does not normalize slashes or strip ./ prefix

**File:** `spec-folder-extractor.ts:110-114`
**Evidence:**
```typescript
function normalizeFilePath(rawPath: string): string {
  const cleaned = rawPath.replace(/`/g, '').trim();
  if (!cleaned) return '';
  return path.isAbsolute(cleaned) ? path.relative(CONFIG.PROJECT_ROOT, cleaned) : cleaned;
}
```

Compare with `workflow.ts:151-157` which also normalizes backslashes and strips `./` prefix, and `git-context-extractor.ts:59-64` which does the same. The spec-folder-extractor's version does not normalize separators, which could cause duplicate entries when merging with git-context data that uses forward slashes.

**Suggestion:** Align with the normalization in `git-context-extractor.ts`:
```typescript
return relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
```

---

## Positive Highlights

1. **Solid provenance tagging:** Every extracted observation and file entry is consistently marked with `_provenance: 'spec-folder'` and `_synthetic: true`, enabling clean merge logic in `enrichStatelessData`.

2. **Graceful null handling:** The `readDoc` function returns `null` on missing files, and every parser (`parseSpecDoc`, `parsePlanDoc`, `parseTasksDoc`, etc.) handles `null` input gracefully with early returns.

3. **No ReDoS risk:** All regex patterns were tested against adversarial input (100k+ character strings). The lazy quantifiers (`*?`) and bounded character classes prevent catastrophic backtracking.

4. **Clean separation of concerns:** Each document type has its own parser function with a focused responsibility. The main `extractSpecFolderContext` function cleanly orchestrates them.

5. **Appropriate use of synchronous I/O:** The `readDoc` function uses `readFileSync` which is appropriate since the files are small (spec documents) and the function is called during a pipeline that benefits from simplicity over concurrency at this level.

---

## Files Reviewed

| Path | Changes | Issues |
|------|---------|--------|
| `.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts` | 293 LOC (new) | 2 P1, 7 P2 |

**Reviewed against:** `core/config.ts`, `extractors/index.ts`, `extractors/file-extractor.ts`, `extractors/session-extractor.ts`, `extractors/contamination-filter.ts`, `extractors/git-context-extractor.ts`, `core/workflow.ts` (consumer)

---

## Recommendation

**PASS with required fixes.** Score 82/100 (ACCEPTABLE band). Two P1 issues require attention before the module can be considered production-ready:

1. **P1-1** (observation capping) should be fixed to reserve slots for structural observations
2. **P1-2** (frontmatter parser data corruption) should be fixed to prevent silent value overwrite

Both fixes are localized (2-5 lines each) and do not require architectural changes.
