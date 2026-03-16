# Implementation Summary: Multi-CLI Parity Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

## Overview

Implemented 4 targeted fixes to eliminate implicit Claude Code assumptions in the session-capture pipeline that degraded results for Copilot, Codex, and Gemini sessions.

---

## Components Implemented

### 1. Tool Name Aliases (REQ-001)

**File**: `scripts/utils/phase-classifier.ts`

Added `TOOL_NAME_ALIASES` constant mapping alternative CLI tool names to canonical names:
- `view` → `read` (Copilot CLI)
- `shell` → `bash`
- `execute` → `bash`
- `search` → `grep`
- `find` → `glob`

Applied normalization in `buildExchangeSignals()` before tool names are added to the weighted vector and returned to downstream consumers. This ensures `scoreCluster()` correctly matches Copilot's `'view'` calls against `RESEARCH_TOOLS`.

### 2. CLI-Agnostic Noise Patterns (REQ-002)

**File**: `scripts/lib/content-filter.ts`

Added 5 patterns to `NOISE_PATTERNS`:
- Generic empty XML wrapper tags: `^<[a-z_-]+>\s*<\/[a-z_-]+>$`
- Copilot lifecycle noise: `tool.execution_start`, `tool.execution_complete`
- Codex reasoning markers: `^reasoning$`, `^<reasoning>.*<\/reasoning>$`

### 3. CLI File Provenance (REQ-003)

**File**: `scripts/utils/input-normalizer.ts`

Set `_provenance: 'tool'` on every `FileEntry` built from CLI tool calls in `transformOpencodeCapture()`. This ensures the quality scorer applies proper trust weighting to files discovered through tool-call evidence.

### 4. View Tool Title (REQ-004)

**File**: `scripts/utils/input-normalizer.ts`

Added `case 'view':` alongside `case 'read':` in `buildToolObservationTitle()` so Copilot's `'view'` tool generates descriptive titles like "Read path/file.ts" instead of the generic "Tool: view" fallback.

---

## Files Changed

| Path | Change | LOC |
|------|--------|-----|
| `scripts/utils/phase-classifier.ts` | Added `TOOL_NAME_ALIASES`, normalized tool names in `buildExchangeSignals()` | +15 |
| `scripts/lib/content-filter.ts` | Added 5 CLI-agnostic noise patterns | +6 |
| `scripts/utils/input-normalizer.ts` | Added `_provenance: 'tool'` on CLI files, added `case 'view':` in title builder | +3 |

**Total**: ~24 lines added across 3 files.

---

## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` | PASS — zero errors |
| `npm run build` | PASS |
| `phase-classification.vitest.ts` | PASS — 6/6 tests |
| `task-enrichment.vitest.ts` | PASS — 43/43 tests |
| `runtime-memory-inputs.vitest.ts` | PASS — 25/25 tests |
| `description-enrichment.vitest.ts` | PASS — 5/5 tests |
| `stateless-enrichment.vitest.ts` | PASS — 15/15 tests |
| `test-extractors-loaders.js` | PASS — 305/305 tests |

**Verification Date**: 2026-03-16
