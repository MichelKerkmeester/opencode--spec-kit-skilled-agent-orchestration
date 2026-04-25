---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Memory Causal Trust Display (012/005)"
description: "Display-only trust badges (confidence, extraction_age, last_access_age, orphan, weight_history) on MemoryResultEnvelope. NO schema change. NO new relations. NO storage of code/process/tool facts."
trigger_phrases:
  - "012 memory trust display"
  - "memory trust badges"
  - "causal edge freshness display"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized sub-phase scaffold"
    next_safe_action: "Wait for 012/001 license sign-off; then read formatters/search-results.ts"
    completion_pct: 0
    blockers: ["012/001 license audit pending"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Feature Specification: Memory Causal Trust Display (012/005)

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft (blocked on 012/001) |
| **Created** | 2026-04-25 |
| **Branch** | `012/005-memory-causal-trust-display` |

---

## 2. PROBLEM & PURPOSE

**Problem:** `MemoryResultEnvelope` exposes `confidence` and `trace.graphContribution` but no unified trust/freshness badge surface. Memory's existing causal-edge schema (`lib/storage/causal-edges.ts:82-94`) already stores `strength`, `evidence`, `source_anchor`, `target_anchor`, `extracted_at`, `created_by`, `last_accessed`. `lib/search/causal-boost.ts:327-338` (`computeTraversalFreshnessFactor`) already implements freshness decay using `FRESHNESS_DECAY_WINDOW_MS`. The data exists; the display doesn't.

**Purpose:** Add display-only `trustBadges` to memory search results. Pure presentation layer. No schema change. No new relation types. No code-fact storage.

---

## 3. SCOPE

### In Scope
- Add `trustBadges: { confidence, extractionAge, lastAccessAge, orphan, weightHistoryChanged }` to `MemoryResultEnvelope`
- Compute badges from existing causal-edge columns
- Surface in `memory_search` and `memory_context` response shapers
- Per-packet feature_catalog + manual_testing_playbook entries

### Out of Scope (HARD RULES per pt-02 §12 RISK-06)
- New columns on `causal_edges` table
- New relation types (the 6: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` — unchanged)
- Storage of code/process/tool facts in Memory
- Memory↔CodeGraph evidence bridge (deferred per pt-02 §15)
- Modifying causal-boost decay logic

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/formatters/search-results.ts` | MODIFY | Add `trustBadges` to envelope |
| `mcp_server/lib/response/profile-formatters.ts` | MODIFY | Propagate badges into search results |
| `feature_catalog/13--memory-quality-and-indexing/` | NEW entry | Trust display |
| `manual_testing_playbook/13--memory-quality-and-indexing/` | NEW entry | Badge testing |

---

## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R-005-1 | `trustBadges` is computed from existing columns: `strength` → confidence; `extracted_at` → extractionAge; `last_accessed` → lastAccessAge; orphan flag derivable; weight history derivable from existing edge mutation log if present |
| R-005-2 | NO schema change to `causal_edges` |
| R-005-3 | NO new relation types added |
| R-005-4 | Existing causal-boost decay logic untouched |
| R-005-5 | Backward compat: callers that don't expect `trustBadges` get unchanged shape (additive only) |
| R-005-6 | Memory does NOT receive Code Graph structural facts (verified by static check) |
| R-005-7 | Display placement decision recorded in implementation-summary.md (open question per 012/spec.md) |

---

## 5. VERIFICATION

- [ ] Unit test: badge population from fixture causal edges
- [ ] Unit test: extractionAge / lastAccessAge calculated correctly
- [ ] Unit test: orphan detection (no incoming edges)
- [ ] Static check: `causal_edges` schema unchanged in `lib/storage/causal-edges.ts`
- [ ] Static check: relation type list unchanged
- [ ] Integration: memory_search returns `trustBadges` in envelope
- [ ] `validate.sh --strict` passes
- [ ] sk-doc DQI ≥85 on feature_catalog + playbook entries

---

## 6. REFERENCES
- 012/spec.md §3 (scope), §4 (R-005 row)
- 012/decision-record.md ADR-012-005
- pt-02 §5 (Memory findings — Boundary, Rejected import, Freshness adaptation, Trust metadata, Owner risk, Near-term recommendation rows)
- pt-02 §11 Packet 4
- pt-02 §12 RISK-06
- Verified anchors: `lib/storage/causal-edges.ts:82-94` (schema), `lib/search/causal-boost.ts:327-338` (`computeTraversalFreshnessFactor` decay logic), `formatters/search-results.ts`, `lib/response/profile-formatters.ts`
