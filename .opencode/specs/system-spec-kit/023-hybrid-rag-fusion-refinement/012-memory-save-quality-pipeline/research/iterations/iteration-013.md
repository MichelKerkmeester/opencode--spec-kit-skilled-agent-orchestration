# Iteration 13: Design the V8 Contamination Filter Fix

## Focus
Design concrete fixes for V8 (foreign-spec contamination) so that JSON-mode saves referencing same-parent spec phases are not falsely blocked. The V8 rule currently blocks writes when foreign spec IDs dominate the content, but legitimate cross-phase references within the same parent epic should be allowed.

## Findings

### 1. V8 Rule Mechanics (Current State)

The V8 rule lives in `validate-memory-quality.ts` (lines 700-775). It works as follows:

**Detection logic:**
- Extracts `spec_folder` from frontmatter (or file path fallback)
- Builds an `allowedSpecIds` set via `extractAllowedSpecIds()`:
  - All `\b\d{3}-[a-z0-9][a-z0-9-]*\b` matches from the spec folder path itself
  - Child directories matching `^\d{3}-` that contain a `spec.md`
  - `related_specs` YAML list from the spec folder's own `spec.md`
- Scans body content for all spec ID mentions, counts each
- Fails V8 if any of:
  - **Dominance**: A foreign spec has >= 3 mentions AND >= currentSpecMentions + 2
  - **Scattered**: 2+ foreign specs each with <= 2 mentions AND total foreign >= 2
  - **Frontmatter**: Any foreign spec ID in `trigger_phrases` or `key_topics` YAML

**Consequence:** `blockOnWrite: true, blockOnIndex: true` -- hard abort.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:101-775]

### 2. Same-Parent Phase Reference Problem

When a JSON-mode save for spec `023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline` references sibling phases like `009-perfect-session-capturing`, `010-template-compliance-enforcement`, or `008-hydra-db-based-features`, these are **sibling specs under the same parent epic** (`022-hybrid-rag-fusion`). The current allowlist logic:

- Extracts IDs from the spec folder path: `023-hybrid-rag-fusion-refinement`, `012-memory-save-quality-pipeline`
- Scans child directories of `012-memory-save-quality-pipeline` for children
- Reads `related_specs` from `012-memory-save-quality-pipeline/spec.md`

It does NOT:
- Walk UP to the parent directory and enumerate siblings
- Recognize that `009-perfect-session-capturing` is a peer under `022-hybrid-rag-fusion`

This means JSON payloads that discuss related work in sibling phases trigger V8 false positives.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:524-555]
[INFERENCE: based on extractAllowedSpecIds only walking down (children) never up (siblings)]

### 3. Contamination Filter vs V8 Rule (Separate Concerns)

The file `contamination-filter.ts` handles *text pattern contamination* (orchestration chatter, AI self-references, tool scaffolding). It is NOT involved in spec-ID foreign-reference detection. V8 is purely in `validate-memory-quality.ts`.

The term "contamination" is overloaded:
- **contamination-filter.ts**: Removes AI orchestration phrases from text
- **V8 rule**: Detects foreign spec ID contamination in rendered memory content

The fix for same-parent references is entirely within `validate-memory-quality.ts`, specifically in `extractAllowedSpecIds()`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:1-225]
[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:524-555]

### 4. Design: Same-Parent Sibling Allowlisting

**Proposed change to `extractAllowedSpecIds()`:**

After scanning child directories (current behavior), add an upward walk:

```typescript
// NEW: Walk up to parent directory and enumerate sibling spec folders
const parentDir = path.dirname(resolvedSpecFolder);
try {
  const siblingEntries = fs.readdirSync(parentDir, { withFileTypes: true });
  for (const entry of siblingEntries) {
    if (!entry.isDirectory() || !/^\d{3}-/.test(entry.name)) {
      continue;
    }
    // Only add siblings that are actual spec folders (have spec.md)
    const siblingSpecPath = path.resolve(parentDir, entry.name, 'spec.md');
    if (fs.existsSync(siblingSpecPath)) {
      allowedSpecIds.add(entry.name);
    }
  }
} catch (error: unknown) {
  // Non-fatal: sibling enumeration failure degrades gracefully
}
```

**Scope:** This adds 1 level of upward walk (parent directory siblings). It does NOT walk to grandparent or beyond, keeping the blast radius contained.

**Estimated LOC:** ~15 lines added to `extractAllowedSpecIds()`.

### 5. JSON-Mode Relaxation for Scattered Foreign References

For JSON-mode saves specifically, the `scattered` check (2+ foreign specs with <= 2 mentions each) is overly aggressive. When the AI composes a JSON payload, it naturally references related specs that informed the work. The `sessionSummary` field often mentions prior work.

**Proposed relaxation options:**

**Option A (Recommended): Source-aware threshold adjustment**
- When `captureSource === 'json-file'` (or detected as JSON-mode), raise the scattered threshold from `scatteredForeignMentions.length >= 2` to `>= 4`
- Rationale: JSON payloads are AI-composed with full context; scattered references indicate breadth, not contamination

**Option B: Allowlist from JSON `relatedSpecs` field**
- Allow the JSON payload to declare `relatedSpecs: ["009-perfect-session-capturing"]`
- These get added to `allowedSpecIds`
- Rationale: The AI knows which specs are related; trust the structured declaration

**Option C: Combine A + B**
- Use both approaches: threshold relaxation for scattered + explicit allowlist

I recommend **Option C** because:
- Option A alone could still block legitimate references above the threshold
- Option B alone requires JSON callers to declare all related specs (fragile)
- Combined: the explicit declarations handle known references, the relaxed threshold handles incidental mentions

### 6. Risk Assessment for Over-Relaxation

| Risk | Severity | Mitigation |
|------|----------|------------|
| Sibling allowlist too broad (parent has 30+ children) | Low | Cap sibling enumeration at 25; beyond that, require explicit `related_specs` |
| JSON-mode scattered threshold too lax | Medium | Only relax for `_source === 'file'` (JSON file input); keep strict for captured sessions |
| Grandparent walk creep | Low | Hard-code single-level upward walk; document the boundary |
| Test regression in existing V8 tests | Medium | Existing tests (task-enrichment.vitest.ts:704-774) test explicit contamination scenarios; add new test for sibling allowlisting |
| Genuine cross-spec contamination slips through | Medium | Dominance check (>= 3 mentions, >= current + 2) remains unchanged; only scattered is relaxed for JSON mode |

**Key invariant to preserve:** The dominance check (`strongestForeignMentions >= 3 && >= currentSpecMentions + 2`) must NEVER be relaxed. This catches the primary contamination case (session saved to wrong spec folder).

## Ruled Out

- **Relaxing V8 entirely for JSON mode**: Too dangerous. Genuine cross-spec contamination in JSON payloads would corrupt the memory index.
- **Walking to grandparent directories**: Scope explosion. A grandparent like `system-spec-kit` contains all specs.
- **Removing the scattered check entirely**: Removes a useful signal for captured-session mode.

## Dead Ends

None -- all approaches explored this iteration produced viable designs.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:101-775` (V8 rule, extractAllowedSpecIds, detection logic)
- `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:1-225` (contamination filter -- confirmed NOT involved in V8)
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:704-774` (existing V8 test cases)
- `.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:29-39` (V8 metadata tests)

## Assessment
- New information ratio: 0.90
- Questions addressed: ["How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?"]
- Questions answered: ["How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?"]

## Reflection
- What worked and why: Direct code reading of `validate-memory-quality.ts` revealed the exact detection algorithm and its allowlist gaps. The `extractAllowedSpecIds()` function is cleanly scoped and extensible, making the sibling walk straightforward.
- What did not work and why: Initial assumption that `contamination-filter.ts` was involved in V8 was incorrect -- the module only handles text pattern removal. Clarifying this distinction early prevented wasted design effort.
- What I would do differently: Start by reading the test file first to understand expected V8 behavior before reading the implementation.

## Recommended Next Focus
Template population and key_files scoping fixes (iteration 014 focus as specified).
