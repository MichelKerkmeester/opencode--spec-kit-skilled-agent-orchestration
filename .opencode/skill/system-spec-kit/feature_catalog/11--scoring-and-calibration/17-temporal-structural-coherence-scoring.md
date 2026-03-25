---
title: "Temporal-structural coherence scoring"
description: "Describes the coherence dimension in the quality loop that scores basic content structure, future-dated completion claims, and unresolved or self-referential causal links."
---

# Temporal-structural coherence scoring

## 1. OVERVIEW

Describes the coherence dimension in the quality loop that scores basic content structure, future-dated completion claims, and unresolved or self-referential causal links.

This checks whether a memory clears a few structural basics and avoids a narrow set of temporal and causal-link problems. If content is empty, too short, missing headings, or claims completion dates that are later than its last-modified time, the score drops. Self-referential or unresolved causal links also reduce the score. Think of it like a lightweight intake checklist rather than a full chronology engine.

---

## 2. CURRENT REALITY

The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The implementation starts with four structural checks: non-empty content, length over 50 characters, at least one Markdown heading, and length over 200 characters. It then applies bounded penalties for future-dated completion claims and for causal-link metadata that points back to the same memory or to unresolved references. The handler does not perform broader spec-folder chronology analysis or predecessor inference.

The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing structurally weak or narrowly inconsistent content from entering the index.

---

## 3. RETRY BEHAVIOR (QUALITY LOOP)

The verify-fix-verify retry cycle in `mcp_server/handlers/quality-loop.ts` is **immediate by design** (no backoff delay between attempts). Retries are bounded by `maxRetries` (default: `2`) and run synchronously because the auto-fix steps are deterministic local transforms (trigger re-extraction, anchor normalization, token-budget trimming). This keeps ingestion latency predictable while still allowing corrective passes.

---

## 4. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop with coherence scoring |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/quality-loop.vitest.ts` | Quality loop tests |

---

## 5. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Temporal-structural coherence scoring
- Current reality source: audit-D04 gap backfill
