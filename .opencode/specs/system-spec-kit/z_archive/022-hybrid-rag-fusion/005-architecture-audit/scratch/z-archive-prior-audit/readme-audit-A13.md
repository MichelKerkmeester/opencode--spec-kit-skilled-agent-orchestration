# README Audit A13 -- MCP Server lib Subfolders (providers, utils, response)

**Date**: 2026-03-08
**Scope**: 3 folders under `mcp_server/lib/`
**Base path**: `.opencode/skill/system-spec-kit/mcp_server/lib/`

---

## 1. `providers/` -- PASS

**Status**: PASS

**Actual files**: `embeddings.ts`, `retry-manager.ts`, `README.md`

**Checks**:
- README lists all files: YES (embeddings.ts, retry-manager.ts)
- File descriptions accurate: YES -- embeddings.ts described as re-export from `@spec-kit/shared/embeddings` (confirmed), retry-manager.ts described with correct exports (11 functions, 3 constants -- all verified against source)
- Module structure matches code: YES
- YAML frontmatter present: YES (title, description, trigger_phrases)
- Numbered ALL CAPS H2 sections: YES (1. OVERVIEW through 5. RELATED RESOURCES)
- HVR-banned words: NONE found

**Evidence**: File tree in README (lines 59-63) matches glob results exactly. Exported function table (lines 116-127) matches `export {}` block in retry-manager.ts (lines 558-573).

---

## 2. `utils/` -- UPDATED

**Status**: UPDATED (was misaligned)

**Actual files**: `canonical-path.ts`, `format-helpers.ts`, `logger.ts`, `path-security.ts`, `README.md`

**Issues found**:
1. **Phantom file**: README listed `retry.ts` which does not exist in the folder
2. **Missing file**: `canonical-path.ts` was not documented (active module imported by 4 other files: `incremental-index.ts`, `memory-parser.ts`, `vector-index-schema.ts`, `vector-index-mutations.ts`)
3. **Stale description/trigger_phrases**: Did not mention canonical path or logger

**Actions taken**:
- Removed `retry.ts` from structure tree, key files table, and features section
- Added `canonical-path.ts` to structure tree, key files table, and features section (with `getCanonicalPathKey` function description)
- Updated module statistics source line to replace `retry.ts` with `canonical-path.ts`
- Added `"canonical path"` and `"logger"` to YAML `trigger_phrases`
- Updated description in YAML frontmatter and H1 subtitle to include all four modules

**Post-update checks**:
- YAML frontmatter present: YES
- Numbered ALL CAPS H2 sections: YES
- HVR-banned words: NONE
- All 4 source files documented: YES

---

## 3. `response/` -- PASS

**Status**: PASS

**Actual files**: `envelope.ts`, `README.md`

**Checks**:
- README lists all files: YES (envelope.ts only)
- File descriptions accurate: YES -- 4 core envelope functions, 5 MCP wrapper functions, types and constants all match source (verified against envelope.ts lines 124-284)
- Module structure matches code: YES
- YAML frontmatter present: YES (title, description, trigger_phrases)
- Numbered ALL CAPS H2 sections: YES (1. OVERVIEW through 5. RELATED RESOURCES)
- HVR-banned words: NONE found

**Evidence**: Structure tree (lines 67-70) lists only `envelope.ts` and `README.md`, matching glob results. Exported types list (line 115) matches interface/type declarations in source. Function table (lines 89-103) matches all exported functions.

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `providers/` | PASS | 0 | None |
| `utils/` | UPDATED | 3 (phantom file, missing file, stale metadata) | Replaced `retry.ts` with `canonical-path.ts`, updated frontmatter |
| `response/` | PASS | 0 | None |

**Files modified**: 1
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md`
