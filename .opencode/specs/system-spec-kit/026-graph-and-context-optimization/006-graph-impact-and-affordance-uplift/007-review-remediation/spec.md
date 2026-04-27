---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Review Remediation (010/007)"
description: "Remediation sub-phase consolidating 21 P1 + 22 P2 findings from the 7-iteration deep-review pass across 010/001-006. Excludes the P0 license-quote finding (resolved by scrubbing the External Project name from the codebase, removing the need for the LICENSE quote)."
trigger_phrases:
  - "010 review remediation"
  - "010/007 remediation"
  - "phase 010 remediation"
  - "p1 p2 follow-up"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/007-review-remediation"
    last_updated_at: "2026-04-25T13:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized remediation sub-phase with 6 themed task groups derived from per-sub-phase deep-review reports"
    next_safe_action: "Pick highest-leverage theme (T-A wire detect_changes MCP surface) and implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Review Remediation (010/007)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-25 |
| **Branch** | `010/007-review-remediation` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 010 sub-phases 001-006 shipped under sandbox-blocked verification. A 7-iteration deep-review pass (6 cli-codex agents in parallel) surfaced 1 P0 + 21 P1 + 22 P2 findings. The P0 (LICENSE quote) was resolved by scrubbing the External Project name from the codebase (removing the need to quote any external license at all). The remaining 43 findings cluster into 6 themed task groups that need a focused remediation pass.

### Purpose
Close all P1 findings + the actionable P2 findings; defer the rest with explicit notes; rerun verification commands operator-side; produce a clean phase-level closeout.

---

## 3. SCOPE

### In Scope
- All 21 P1 findings across 010/001-006
- Actionable P2 findings (drift, duplication, observability gaps)
- Re-running validate.sh / vitest / tsc with real evidence captured per sub-phase
- Aligning the `detect_changes` MCP-tool-surface decision (wire it OR mark internal-only across all docs)
- Adding `minConfidence` and other deferred MCP-schema fields
- Test-rig fixes for skipped trust-badges tests
- Doc sync (broken links, conflicting tool counts, phase numbering drift)

### Out of Scope
- New features beyond the 6 sub-phases of 010
- Architectural rewrites
- pt-02 Packet 5 (route/tool/shape contract safety) — still deferred
- Performance optimizations marked P2 that are bounded and documented (e.g., `O(files × hunks × nodes)` symbol attribution)

### Files to Change
See `tasks.md` for per-task file targets. Summary by theme:

| Theme | Files Touched (Summary) |
|-------|-------------------------|
| **T-A** detect_changes MCP wiring | `code_graph/tools/code-graph-tools.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `code_graph/handlers/index.ts`, plus doc sync in 6 umbrella surfaces |
| **T-B** Verification evidence sync | All 6 sub-phase implementation-summary.md + checklist.md files (uncheck operator-pending items, paste real command output) |
| **T-C** Public API surface gaps | `schemas/tool-input-schemas.ts` (minConfidence + affordances), advisor input schemas |
| **T-D** Sanitization hardening | `affordance-normalizer.ts` (TS), `skill_graph_compiler.py` (PY), edge metadata read path in `query.ts`, age-label allowlist in `formatters/search-results.ts` |
| **T-E** Test rig fixes | `tests/memory/trust-badges.test.ts` (unskip via DI fixture or real-DB integration) |
| **T-F** Doc + label cleanup | Broken `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` link, conflicting tool counts, 012/010 phase-naming drift, INSTALL_GUIDE smoke-test cwd bug |

---

## 4. REQUIREMENTS

### P0 — Already resolved
| ID | Status |
|----|--------|
| ~~LICENSE verbatim quote~~ | RESOLVED — External Project name scrubbed from codebase; no LICENSE quote needed |

### P1 — In scope (21 findings)

| ID | Sub-phase | Theme | Description |
|----|-----------|-------|-------------|
| R-007-1 | 001 | T-F | Drop "GitNexus"-era continuity + status mismatch in 001 (covered by scrub) |
| R-007-2 | 002 | T-A | Wire `detect_changes` to MCP dispatcher (or mark internal-only in all docs) |
| R-007-3 | 002 | T-D | Diff path canonicalization — reject paths outside `canonicalRootDir` |
| R-007-4 | 002 | T-D | `parseUnifiedDiff` multi-file boundary fix (track expected hunk line counts) |
| R-007-5 | 002 | T-B | Run vitest + tsc + validate.sh; record real evidence in 002 implementation-summary |
| R-007-6 | 003 | T-C | Add `minConfidence` to MCP tool schema, Zod validator, allowed-parameter ledger |
| R-007-7 | 003 | T-B | Run code_graph vitest + tsc + validate.sh; record real evidence in 003 |
| R-007-8 | 004 | T-A | Decide `conflicts_with` affordance edge contract (validate-or-serialize) |
| R-007-9 | 004 | T-D | Broaden prompt-injection denylist (TS + PY) for affordance-normalizer |
| R-007-10 | 004 | T-C | Expose score-time `affordances` via public advisor-recommend input schema OR document compile-time-only |
| R-007-11 | 005 | T-D | Reject incomplete explicit `trustBadges` payloads (or merge per-field) |
| R-007-12 | 005 | T-A | Memory_search cache invalidation on causal-edge mutations (causal-edge generation in cache key) |
| R-007-13 | 005 | T-E | Unskip trust-badges SQL tests via DI fixture or real-DB integration |
| R-007-14 | 006 | T-A | Sync `detect_changes` integration story across handler/schema/dispatcher/docs |
| R-007-15 | 006 | T-B | Mark verification operator-pending where commands didn't run; separate "estimated" from "passed" |
| R-007-16 | 006 | T-F | Fix INSTALL_GUIDE smoke-test cwd bug (Python path mismatch after `cd`) |
| R-007-17 | 006 | T-F | Resolve conflicting MCP tool counts across umbrella docs (one canonical source) |
| R-007-18 | 006 | T-F | Restore or remove `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` link |
| R-007-19 | 002 | T-B | Update 002 checklist to uncheck operator-pending items (no premature PASS) |
| R-007-20 | 003 | T-B | Update 003 checklist same way |
| R-007-21 | 005 | T-B | Update 005 checklist same way |

### P2 — Actionable subset (12 of 22 findings; rest deferred per below)

| ID | Sub-phase | Theme | Description |
|----|-----------|-------|-------------|
| R-007-P2-1 | 002 | T-D | Phase runner reject duplicate output keys (mirror duplicate-name rejection) |
| R-007-P2-2 | 002 | T-D | Wrap `runPhases` in try/finally so failures emit error-outcome metric |
| R-007-P2-3 | 003 | T-D | Edge `reason`/`step` allowlist on read path (sanitize stale/imported rows) |
| R-007-P2-4 | 003 | T-F | `computeBlastRadius` off-by-one on `limit_reached` (request `limit + 1`) |
| R-007-P2-5 | 003 | T-F | Multi-subject blast-radius preserves resolved seeds when sibling fails |
| R-007-P2-6 | 003 | T-D | Failure-fallback emits stable `code` + log/metric (operator visibility) |
| R-007-P2-7 | 003 | T-F | Extract shared relationship-edge mapper (deduplicate 4 switch branches) |
| R-007-P2-8 | 004 | T-D | Shared adversarial fixture for TS + PY sanitizers |
| R-007-P2-9 | 004 | T-D | Debug counters for affordance-input drop categories |
| R-007-P2-10 | 005 | T-D | Sanitize/cap `extractionAge` / `lastAccessAge` strings to allowlisted grammar |
| R-007-P2-11 | 005 | T-D | Trace flag `{attempted, derivedCount, failureReason}` for badge derivation |
| R-007-P2-12 | 006 | T-F | Phase-naming alias note (012 → 010 wrapper) where docs still reference 012 |

### P2 — Deferred (10 findings — track but don't fix in 010/007)

- 002 — Hunk-to-symbol attribution `O(files × hunks × nodes)` (not a hot path; defer to perf packet)
- 003 — `IMPORTS` whole-graph load on every blast-radius (defer to perf packet with frontier-scoped lookups)
- 003 — N+1 ambiguity re-rank edge counts (defer; bounded by typical ambiguity set size)
- 004 — Score-time affordance scan `skills × affordances` (only a problem if affordances become public input — covered by R-007-10)
- 004 — Compiled affordance evidence loses source context (design item for richer evidence schema — defer)
- 005 — Trust-badge SQL runs even for `quick` profile (bounded; documented cost)
- 005 — `MemoryTrustBadges` shape duplicated with optionality drift (cleanup; defer to a typing pass)
- 006 — `detect_changes` deferred-contract follow-up tracking (covered by R-007-2 / R-007-14)
- 001 — Phase numbering drift in titles (covered by R-007-P2-12)
- 001 — Required Notice handling (resolved by scrub — no upstream notice to track)

---

## 5. VERIFICATION

- [ ] All 21 P1 findings closed with evidence in `implementation-summary.md`
- [ ] 12 actionable P2 findings closed with evidence
- [ ] 10 deferred P2 findings each have a "Deferred to: <packet/never>" entry in `implementation-summary.md`
- [ ] Per-sub-phase implementation-summary + checklist files have REAL command output (not "operator-pending estimates")
- [ ] `tsc --noEmit` clean across mcp_server
- [ ] `vitest run` all phase-010 test files pass (no `.skip` left except documented-deferred)
- [ ] `bash validate.sh --strict` per sub-phase: pass OR explicit cosmetic-warning exception
- [ ] Final `/spec_kit:deep-review:auto` over 010 phase root: P0=0, P1≤2 (allowing minor residuals), P2 documented

---

## 6. REFERENCES

- Phase-level review summary: `010/review/phase-review-summary.md`
- Per-sub-phase reports: `010/{001..006}/review/review-report.md`
- ADR-012-001 (clean-room rule, now superseded by full-name scrub)
- Plan source: `/Users/michelkerkmeester/.claude/plans/create-new-phase-with-zazzy-lighthouse.md`
