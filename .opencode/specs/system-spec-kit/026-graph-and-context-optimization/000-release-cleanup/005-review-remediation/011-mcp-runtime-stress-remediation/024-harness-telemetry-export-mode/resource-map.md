---
title: "Resource Map: 024 Harness Telemetry Export Mode (PP-2)"
description: "Path ledger for harness type extension + telemetry-export test, plus packet docs."
trigger_phrases:
  - "024-harness-telemetry-export-mode resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/024-harness-telemetry-export-mode"
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
- **By category**: Tests=2, Specs=5, Scripts=2, Meta=2
- **Missing on disk**: 0
- **Scope**: Files modified during packet `026/011/024-harness-telemetry-export-mode` (commit `c4f738b1d`) plus cited contracts.
- **Generated**: 2026-04-29T10:10:00+02:00

---

## 1. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts` | Updated | OK | Added optional `telemetry?` field to `SearchQualityChannelOutput`; propagated through `SearchQualityChannelCapture` and `SearchQualityCaseResult`; added `options.telemetryExportPath` writing 3 sibling JSONL files |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts` | Created | OK | Telemetry-mode test: TC-1 in-memory preservation, TC-2 JSONL export shape, TC-3 no-export-without-path |

---

## 2. Scripts (cited contracts)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts` | Cited | OK | `SearchDecisionEnvelope` type imported into harness |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/shadow/shadow-sink.ts` | Cited | OK | `ShadowDeltaRecord` type imported into harness |

---

## 3. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `spec.md` | Created | OK | Level 1 charter |
| `plan.md` | Created | OK | Plan |
| `tasks.md` | Created | OK | Task ledger |
| `implementation-summary.md` | Created | OK | Disposition + back-compat verification |
| `.../024/description.json` | Created | OK | Continuity index |

---

## 4. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.../024/graph-metadata.json` | Created | OK | Graph rollout metadata |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts` | Analyzed | OK | Read-only contract reference (intentionally NOT modified) |
