---
title: "Cross-AI validation fixes"
description: "Covers 14 issues found by independent Gemini and Codex reviews, including test suite false-pass patterns, deletion exception propagation and re-sort after feedback mutations."
---

# Cross-AI validation fixes

## 1. OVERVIEW

Covers 14 issues found by independent Gemini and Codex reviews, including test suite false-pass patterns, deletion exception propagation and re-sort after feedback mutations.

Three different AI reviewers independently checked the codebase and found 14 issues that the original review missed. This is like getting a second and third opinion from different doctors: each one catches things the others overlooked. The fixes addressed problems ranging from tests that secretly passed when they should have failed to errors that were silently swallowed instead of reported.

---

## 2. CURRENT REALITY

Independent reviews by Gemini 3.1 Pro and Codex gpt-5.3-codex identified 14 issues missed by the original audit. Key fixes:

- **CR-P0-1:** Test suite false-pass patterns. 21 silent-return guards converted to `it.skipIf()`, fail-fast imports with throw on required handler/vectorIndex missing.
- **CR-P1-1:** Deletion exception propagation. Causal edge cleanup errors in single-delete now propagate (previously swallowed).
- **CR-P1-2:** Re-sort after feedback mutations before top-K slice in Stage 2 fusion.
- **CR-P1-3:** Dedup/orphan queries gained parent-scoped filters, including `AND parent.parent_id IS NULL`, to exclude chunk rows.
- **CR-P1-4:** Session dedup `id != null` guards against undefined collapse.
- **CR-P1-5:** Cache lookup moved before embedding readiness gate in search handler.
- **CR-P1-6:** Partial-update DB mutations wrapped inside transaction.
- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
- **CR-P2-3:** Dashboard row limit configurable via `SPECKIT_DASHBOARD_LIMIT` (default 10000) with NaN guard.
- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.

All 14 items verified through 3-stage review: Codex implemented, Gemini reviewed, Claude final-reviewed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Re-sort behavior after feedback mutations before top-K slicing |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Dedup/orphan query hardening with `parent.parent_id IS NULL` filters |
| `mcp_server/lib/search/evidence-gap-detector.ts` | Lib | `Number.isFinite` guards for score safety |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Lib | Dashboard row-limit configurability (`SPECKIT_DASHBOARD_LIMIT`) |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction safety for partial-update mutation paths |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Deletion-path error propagation hardening |
| `mcp_server/handlers/memory-search.ts` | Handler | Search-handler flow fix moving cache lookup ahead of the embedding-readiness wait |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/integration-search-pipeline.vitest.ts` | Pipeline and guard behavior validation |
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Dashboard configuration and metrics reporting |
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction boundary and rollback correctness |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal-edge cleanup and failure-path behavior |
| `mcp_server/tests/memory-save-extended.vitest.ts` | False-pass guard pattern remediation coverage |
| `mcp_server/tests/hybrid-search.vitest.ts` | Search-handler ordering and integration behavior |

---

## 4. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Cross-AI validation fixes
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 088
