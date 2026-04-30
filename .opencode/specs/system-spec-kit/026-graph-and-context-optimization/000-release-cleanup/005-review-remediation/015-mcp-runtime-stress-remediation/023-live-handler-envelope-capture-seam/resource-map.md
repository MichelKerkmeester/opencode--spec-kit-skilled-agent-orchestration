---
title: "Resource Map: 023 Live Handler Envelope Capture Seam (PP-1)"
description: "Path ledger for the PP-1 behavioral test that exercises handleMemorySearch end-to-end, plus packet docs and runtime files cited as test boundaries."
trigger_phrases:
  - "023-live-handler-envelope-capture-seam resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam"
    last_updated_at: "2026-04-29T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored lean resource-map for today batch"
    next_safe_action: "Reference for blast-radius audit; refresh on next material change"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 11
- **By category**: Tests=1, Specs=5, Scripts=4, Meta=1
- **Missing on disk**: 0
- **Scope**: Files created during packet `026/011/023-live-handler-envelope-capture-seam` (commit `af22aa045`) plus runtime files cited as test boundaries.
- **Generated**: 2026-04-29T10:10:00+02:00

---

## 1. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Created | OK | Behavioral test with TC-1 (envelope on response), TC-2 (audit JSONL emission), TC-3 (degradedReadiness — initially expected_fail, flipped by 025) |

---

## 2. Scripts (cited boundaries)

> Read but NOT modified by 023; mocked or invoked by the test.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Cited | OK | Test exercises this real handler |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts` | Cited | OK | Envelope shape asserted |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Cited | OK | recordSearchDecision JSONL append asserted |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts` | Cited | OK | executePipeline mocked at retrieval boundary |

---

## 3. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `spec.md` | Created | OK | Level 1 charter |
| `plan.md` | Created | OK | Plan |
| `tasks.md` | Created | OK | Task ledger |
| `implementation-summary.md` | Created | OK | Disposition + layer disclosure |
| `.../023/description.json` | Created | OK | Continuity index |

---

## 4. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.../023/graph-metadata.json` | Created | OK | Graph rollout metadata |
