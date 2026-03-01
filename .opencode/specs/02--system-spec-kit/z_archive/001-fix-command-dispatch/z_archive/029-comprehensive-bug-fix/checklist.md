---
title: "Checklist - Comprehensive Bug Fix [029-comprehensive-bug-fix/checklist]"
description: "checklist document for 029-comprehensive-bug-fix."
trigger_phrases:
  - "checklist"
  - "comprehensive"
  - "bug"
  - "fix"
  - "029"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist - Comprehensive Bug Fix

> All items completed and verified.

---

## P0: Critical Security Issues

- [x] **SEC-001**: Add `.utcp_config.json` to .gitignore
- [x] **SEC-002**: Add `.env` and related patterns to .gitignore
- [x] **SEC-003**: Restrict path validation from `/Users` to workspace only

---

## P0: High Severity Bugs

### MCP Server Core
- [x] **BUG-001**: Update version to 12.4.0 in semantic-memory.js (JSDoc and Server)
- [x] **BUG-002**: Add `safeJsonParse()` helper function
- [x] **BUG-003**: Replace unsafe JSON.parse calls with safeJsonParse
- [x] **BUG-004**: Add limit/offset validation (Math.max/Math.min)
- [x] **BUG-005**: Add global error handlers (uncaughtException, unhandledRejection)
- [x] **BUG-006**: Add null check to `isFtsAvailable()` in vector-index.js
- [x] **BUG-007**: Add `toEmbeddingBuffer()` helper for type handling
- [x] **BUG-008**: Add embedding dimension validation
- [x] **BUG-009**: Forward `useDecay` parameter in hybrid-search.js
- [x] **BUG-010**: Add consistent result shape for single-source fallbacks

### Scoring/Tiers
- [x] **BUG-011**: Add constitutional tier to `getTierBoost()` in composite-scoring.js
- [x] **BUG-012**: Add score overflow capping (Math.min(100, ...)) in scoring.js
- [x] **BUG-013**: Add Infinity handling (!isFinite) in importance-tiers.js

### Documentation
- [x] **BUG-014**: Fix Gate references (Gate 3 → Gate 4) in system-memory SKILL.md
- [x] **BUG-015**: Fix MCP tool syntax (remove mcp__ prefix)
- [x] **BUG-016**: Update tool names to leann_leann_* pattern
- [x] **BUG-017**: Remove duplicate line in mcp-code-mode SKILL.md

---

## P1: Medium Severity Bugs

### MCP Server
- [x] **MED-001**: Add init validation in hybrid-search.js
- [x] **MED-002**: Extend FTS5 escaping for ^{}[] characters
- [x] **MED-003**: Rename RECENCY_HALF_LIFE_DAYS to RECENCY_SCALE_DAYS
- [x] **MED-004**: Add gunzip error handling in checkpoints.js
- [x] **MED-005**: Fix race condition with INSERT OR IGNORE
- [x] **MED-006**: Add size validation before compression
- [x] **MED-007**: Add stripJsonComments for JSONC support
- [x] **MED-008**: Fix null handling in deepMerge
- [x] **MED-009**: Add path validation in config-loader.js
- [x] **MED-010**: Add regex pre-compilation in trigger-matcher.js
- [x] **MED-011**: Add db null check in loadTriggerCache
- [x] **MED-012**: Fix token count bug (MIN_TOKEN_COUNT vs MIN_WORD_LENGTH)

### Documentation
- [x] **MED-013**: Fix memory_load parameter documentation
- [x] **MED-014**: Add missing Gate Alignment section
- [x] **MED-015**: Document file path limitation in mcp-code-context
- [x] **MED-016**: Add context parameter documentation
- [x] **MED-017**: Add tool name translation note
- [x] **MED-018**: Fix broken anchor links in workflows-code
- [x] **MED-019**: Add missing GitHub tools to sk-git
- [x] **MED-020**: Add missing DevTools tools documentation
- [x] **MED-021**: Add session cleanup section

---

## P2: Low Severity Issues

### MCP Server
- [x] **LOW-001**: Add batch delete optimization in checkpoints.js
- [x] **LOW-002**: Add logging for trigger extractor failures
- [x] **LOW-003**: Fix redundant case-insensitive flag in regex

### Documentation
- [x] **LOW-004**: Add includeContiguity parameter explanation
- [x] **LOW-005**: Add constitutional tier token budget docs
- [x] **LOW-006**: Add database reset/rebuild procedure
- [x] **LOW-007**: Add Two-Stage Flow clarification note
- [x] **LOW-008**: Add script count clarification
- [x] **LOW-009**: Add Phase Transitions section
- [x] **LOW-010**: Add Error Handling section to sk-git
- [x] **LOW-011**: Add allowed-tools update for mcp-code-mode
- [x] **LOW-012**: Add troubleshooting section to mcp-code-context

### Config
- [x] **LOW-013**: Fix trailing comma in opencode.json

---

## P2: Reference File Cleanup

- [x] **REF-001**: Fix MCP syntax in troubleshooting.md
- [x] **REF-002**: Fix tool names in tool_catalog.md
- [x] **REF-003**: Fix function call syntax in usage_examples.md

---

## Verification

- [x] **VER-001**: All semantic-memory.js fixes verified
- [x] **VER-002**: All vector-index.js fixes verified
- [x] **VER-003**: All hybrid-search.js fixes verified
- [x] **VER-004**: All scoring libs fixes verified
- [x] **VER-005**: All integration libs fixes verified
- [x] **VER-006**: All SKILL.md files verified
- [x] **VER-007**: All config files verified
- [x] **VER-008**: Cross-file consistency verified
- [x] **VER-009**: README.md verified
- [x] **VER-010**: No new issues introduced

---

## Summary

| Priority | Total | Completed |
|----------|-------|-----------|
| P0 (Critical) | 17 | 17 ✓ |
| P1 (Medium) | 21 | 21 ✓ |
| P2 (Low) | 16 | 16 ✓ |
| Reference | 3 | 3 ✓ |
| Verification | 10 | 10 ✓ |
| **TOTAL** | **67** | **67 ✓** |
