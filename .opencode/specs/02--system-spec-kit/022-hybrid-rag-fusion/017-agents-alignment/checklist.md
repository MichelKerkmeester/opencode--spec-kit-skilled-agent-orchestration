---
title: "Checklist: 017 — Agent Alignment"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: 017 — Agent Alignment

**Date:** 2026-03-15
**Status:** Complete

---

<!-- ANCHOR:protocol -->
## Pre-Implementation

- [x] Spec.md created with 9 requirements (AA-001 to AA-009)
- [x] Plan.md created with 4-phase approach
- [x] Tasks.md created with 31 tasks
- [x] Drift analysis completed — identified 18 stale files across 2 runtimes

<!-- /ANCHOR:protocol -->
## P0 Requirements

- [x] **AA-001:** Body content parity — verified for context, orchestrate, speckit across canonical/Claude/Gemini
- [x] **AA-002:** Claude frontmatter preserved — `tools:` list, `model:` field, `mcpServers:` intact for all 9 agents
- [x] **AA-003:** Gemini frontmatter preserved — `kind:`, `model:`, `tools:`, `max_turns:`, `timeout_mins:` intact for all 9 agents
- [x] **AA-004:** Path convention directives updated per runtime (`.claude/agents/*.md`, `.gemini/agents/*.md`)
- [x] **AA-005:** No behavioral modifications — body content copied verbatim from canonical, only frontmatter and path directives adapted

## P1 Requirements

- [x] **AA-006:** File sizes within acceptable variance — max 7.6% for orchestrate (expected due to frontmatter differences)
- [x] **AA-007:** All 9 agents present in all 5 runtimes (45 files confirmed)
- [x] **AA-008:** Nesting rules (§0 ILLEGAL NESTING, LEAF NESTING CONSTRAINT) preserved in body content

## P2 Requirements

- [x] **AA-009:** ChatGPT and Codex spot-checked (speckit) — still in sync with canonical

## Summary

| Category | Items | Verified |
| -------- | ----- | -------- |
| P0       | 5     | 5/5      |
| P1       | 3     | 3/3      |
| P2       | 1     | 1/1      |
| **Total**| **9** | **9/9**  |
