---
title: "AI-002 A7 Sanitizer at Every Write Boundary"
description: "Manual validation that the A7 sanitizer in lib/derived/sanitizer.ts runs at every write boundary (SQLite, graph-metadata derived, envelope, diagnostics) and rejects unsafe labels."
trigger_phrases:
  - "ai-002"
  - "a7 sanitizer"
  - "sanitizeSkillLabel"
  - "write boundary sanitization"
---

# AI-002 A7 Sanitizer at Every Write Boundary

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/derived/sanitizer.ts` is invoked at every public write boundary: SQLite persistence, `graph-metadata.json.derived` writes, response envelopes emitted by `handlers/advisor-recommend.ts`, and diagnostic records written by adapters.

---

## 2. SETUP

- Repo root working directory.
- MCP server built.
- Disposable copy if introducing a synthetic malformed skill label is needed.
- Privacy-review mindset; prompt text must never appear in envelope or diagnostic fields.

---

## 3. STEPS

1. Call `advisor_recommend` with a benign prompt that should match an active skill:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":2,"includeAttribution":true}})
```

2. Inspect `laneBreakdown`, `trustState`, `cache`, and `warnings` for any non-slug skill labels.
3. In a disposable copy, inject a fixture skill whose name contains control characters or unsafe path segments, touch to reindex, then repeat step 1.
4. Call `advisor_status` and verify `skillCount` is either unchanged (rejected) or the label appears sanitized.
5. Read the `graph-metadata.json.derived` block for the injected fixture and confirm all string fields are sanitized.

---

## 4. EXPECTED

- Every skill label surfaced through public boundaries conforms to the slug shape `[a-z0-9][a-z0-9-]*`.
- Control characters, path separators, and prompt fragments never appear in envelope or diagnostic output.
- Malformed labels are either rejected (skill excluded) or normalized.
- Derived entries written to `graph-metadata.json` use the sanitized label only.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Control chars in envelope | `laneBreakdown` or `warnings` contains non-printable bytes | Block release; treat as a privacy failure. |
| Unsanitized label in DB | SQLite row contains raw input | Audit `sanitizer.ts` invocation at persistence layer. |
| Sanitizer silently skips | Label passes through unchanged despite control chars | Add regression case and inspect sanitizer input path. |

---

## 6. RELATED

- Scenario [AI-001](./001-derived-extraction.md) — derived extraction correctness.
- Scenario [AI-005](./005-anti-stuffing.md) — repetition-density and adversarial rejection.
- Feature [`02--auto-indexing/02-sanitizer.md`](../../feature_catalog/02--auto-indexing/02-sanitizer.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sanitizer.ts`.
