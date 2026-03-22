---
title: "Save quality gate exceptions"
description: "Save quality gate exceptions allow decision-type documents with sufficient structural signals to bypass the minimum content length check, preventing false rejections of short but high-value memories, gated by the SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS flag."
---

# Save quality gate exceptions

## 1. OVERVIEW

Save quality gate exceptions allow decision-type documents with sufficient structural signals to bypass the minimum content length check, preventing false rejections of short but high-value memories, gated by the `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` flag.

Some memories are short by nature. A decision record might say "We chose SQLite over PostgreSQL for embedded deployment" in under 50 characters, but it carries high value. Without this exception, the quality gate would reject it for failing the minimum content length check. This feature recognizes that certain context types (decision) combined with strong structural signals (good title, anchors, triggers) should be allowed through even when the content itself is brief.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false` to disable.

The `isSaveQualityGateExceptionsEnabled()` function in `search-flags.ts` checks the flag. When enabled, the quality gate (`save-quality-gate.ts`) evaluates an exception path for documents where:
- The `context_type` is `decision`.
- The document has at least `SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS = 2` structural signals (title quality, trigger quality, anchor quality, metadata quality).

Documents meeting both criteria bypass the `MIN_CONTENT_LENGTH = 50` character check in Layer 1 structural validation. The quality gate itself is a 3-layer validation system: Layer 1 (structural), Layer 2 (content quality scoring with weighted dimensions), and Layer 3 (semantic deduplication at threshold 0.92).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Quality gate layers, short-critical exception logic, structural signal counting |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isSaveQualityGateExceptionsEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/short-critical-quality-gate.vitest.ts` | Short-critical exception behavior, structural signal thresholds, flag gating |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Save quality gate exceptions
- Current reality source: mcp_server/lib/validation/save-quality-gate.ts REQ-D4-003 section and implementation
