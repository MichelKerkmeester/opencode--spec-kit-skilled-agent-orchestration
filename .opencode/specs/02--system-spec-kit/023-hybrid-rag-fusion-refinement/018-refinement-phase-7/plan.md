---
title: "Implementation Plan: Review Audit"
description: "Wave-based multi-model audit using cli-gemini, cli-codex, and Opus sub-agents"
---
# Implementation Plan: Review Audit

<!-- SPECKIT_LEVEL: 2 -->

## Approach

4-wave orchestrated review using cross-AI validation (Gemini, Codex, Opus).

### Wave 1: Script Location Analysis (HIGHEST PRIORITY)
1. Gemini: Architecture boundary review (scripts/ vs mcp_server/ vs shared/)
2. Codex: Build system & dependency flow (tsconfig, package.json)
3. Opus: Import path mapping (scripts/ → mcp_server/ direct imports)

### Wave 2: Summary Document Verification
4. Gemini: New features summary vs actual code (15 features sampled)
5. Codex: Existing features tool schemas vs code (23 tools, 89 flags)
6. Opus: Cross-reference consistency between both summaries

### Wave 3: Code Standards & Quality
7. Gemini: MCP server code vs sk-code--opencode (10 files)
8. Codex: Scripts code vs sk-code--opencode (10 files)

### Wave 4: Bug Detection & Phase Verification
9. Gemini: Phase 017 fix verification (35 fixes)
10. Codex: Edge case & bug hunt (SQL, scoring, races)

### Final Synthesis
- Merge all wave findings into implementation-summary.md
- Apply P0/P1 fixes
- Update tasks.md with resolution status

## Dependencies

- cli-gemini and cli-codex must be installed and configured
- Access to the system-spec-kit codebase (read-only for review, write for fixes)
