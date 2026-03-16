# Implementation Plan: Multi-CLI Parity Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fix 4 cross-CLI gaps in the session-capture pipeline where implicit Claude Code assumptions degrade classification, filtering, and scoring for Copilot, Codex, and Gemini sessions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `tsc --noEmit` — zero errors
- `npm run build` — passes
- All targeted Vitest suites pass
- `test-extractors-loaders.js` baseline passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new modules or interfaces. All changes are additive to existing constants and functions:

- `phase-classifier.ts`: New `TOOL_NAME_ALIASES` constant + normalization step in `buildExchangeSignals()`
- `content-filter.ts`: New entries in `NOISE_PATTERNS` array
- `input-normalizer.ts`: New `_provenance` field on FileEntry + new `case` in switch statement
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Tool Name Aliases (REQ-001)

**File**: `scripts/utils/phase-classifier.ts`

Add a `TOOL_NAME_ALIASES` constant mapping alternative CLI tool names to canonical names:
- `view` → `read` (Copilot CLI)
- `shell` → `bash` (alternative CLI names)
- `execute` → `bash`
- `search` → `grep`
- `find` → `glob`

Apply aliases in `buildExchangeSignals()` before tool names are added to the vector, and normalize the returned `toolNames` array so downstream `scoreCluster()` matches against `RESEARCH_TOOLS` and `IMPLEMENTATION_TOOLS` correctly.

### Phase 2: CLI-Agnostic Noise Patterns (REQ-002)

**File**: `scripts/lib/content-filter.ts`

Add patterns to `NOISE_PATTERNS`:
- Generic XML wrapper tag catch-all: `^<[a-z_-]+>\s*<\/[a-z_-]+>$` (empty single-line tags)
- Copilot lifecycle noise: `tool.execution_start`, `tool.execution_complete`
- Codex reasoning block markers: `^reasoning$`, `^<reasoning>.*<\/reasoning>$`

### Phase 3: CLI File Provenance (REQ-003)

**File**: `scripts/utils/input-normalizer.ts`

In the FILES-building loop of `transformOpencodeCapture()`, set `_provenance: 'tool'` on every `FileEntry` pushed to the `FILES` array. This ensures the quality scorer applies proper trust weighting.

### Phase 4: View Tool Title (REQ-004)

**File**: `scripts/utils/input-normalizer.ts`

Add `case 'view':` alongside `case 'read':` in the `buildToolObservationTitle()` switch statement so Copilot's `'view'` tool gets the same descriptive title as `'read'`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Run existing test suites to verify no regressions
2. Verify Copilot tool names now classify correctly in phase-classification tests
3. Verify contamination audit still passes in task-enrichment tests
4. Verify provenance metadata flows through in runtime-memory-inputs tests
5. TypeScript static check: `tsc --noEmit`
6. Build verification: `npm run build`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase classifier (007-phase-classification) — completed
- Content filter (002-contamination-detection) — completed
- Input normalizer (003-data-fidelity) — completed
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are additive constants and switch cases. Rollback is a simple revert of the 3 files. No database migrations, no config changes, no new modules.
<!-- /ANCHOR:rollback -->
