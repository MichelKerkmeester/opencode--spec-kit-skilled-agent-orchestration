---
title: "Implementation Summary: Broad-Suite Vitest Honesty"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Recorded the actual broad Vitest state and corrected 026's claim so it no longer implies the full suite is green."
trigger_phrases:
  - "012-broad-suite-vitest-honesty"
  - "broad suite vitest implementation summary"
  - "F-005 vitest honesty summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/012-broad-suite-vitest-honesty"
    last_updated_at: "2026-04-29T12:20:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed broad Vitest investigation and corrected 026 verification claim"
    next_safe_action: "F-005 can be closed after review"
    blockers: []
    key_files:
      - "specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts"
      - ".opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:012-broad-suite-vitest-honesty-implementation-summary"
      session_id: "012-broad-suite-vitest-honesty"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No 026-induced failure was confirmed; no runtime or test fixes were applied"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-broad-suite-vitest-honesty |
| **Completed** | 2026-04-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The broad-suite claim is now scoped to evidence. The readiness-relevant targeted Vitest suites pass, while the full broad suite times out and contains unrelated stale assertion, environment/path, and slow progressive-validation failures.

### Requirement Disposition

| Requirement | Status | Evidence |
|-------------|--------|----------|
| REQ-001 | Partially met | Targeted and subgroup commands produce numeric counts; full broad suite still timed out at 600s. |
| REQ-002 | Met | This summary lists PASS / FAIL / HANG by subgroup and names every failed or hanging file observed. |
| REQ-003 | Met | 026 implementation summary now scopes Vitest green to the targeted readiness subset and names the broad-suite timeout. |
| REQ-004 | Met | No 026-induced failure was confirmed; no surgical test or runtime fix was applied. |
| REQ-005 | Met | Strict validator passed for this packet and for the edited 026 packet. |

### Vitest Inventory

| Scope | Result | Files / Tests | Failed or Hanging Files |
|-------|--------|---------------|--------------------------|
| `tests/handler-*.vitest.ts` | FAIL, exit 1, 7.4s | 1 failed / 18 passed; 1 failed / 448 passed / 3 skipped | FAIL: `mcp_server/tests/handler-memory-save.vitest.ts` |
| `tests/search-quality/` | PASS, exit 0, 2.7s | 15 passed; 27 passed | None |
| `tests/memory-*.vitest.ts` | PASS, exit 0, 36.1s | 29 passed; 560 passed / 5 todo | None |
| `tests/code_graph/ tests/graph-*.vitest.ts` | FAIL, exit 1, 4.4s | 2 failed / 13 passed; 2 failed / 325 passed | FAIL: `mcp_server/tests/graph-metadata-integration.vitest.ts`, `mcp_server/tests/graph-payload-validator.vitest.ts` |
| `skill_advisor/tests/` | FAIL, exit 1, 64.8s | 2 failed / 32 passed; 3 failed / 233 passed | FAIL: `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts`, `mcp_server/skill_advisor/tests/legacy/advisor-graph-health.vitest.ts` |
| Full broad suite | HANG, timed out at 600s | No final count emitted | HANG: full command; partial output includes the failed files listed below |
| `mcp_server/code_graph/tests/` | FAIL, exit 1, 2.7s | 3 failed / 9 passed; 9 failed / 172 passed | FAIL: `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`, `mcp_server/code_graph/tests/code-graph-scan.vitest.ts`, `mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` |
| `scripts/tests/` | HANG, timed out at 240s | No final count emitted | FAIL before hang: `scripts/tests/graph-metadata-backfill.vitest.ts`, `scripts/tests/memory-learn-command-docs.vitest.ts`, `scripts/tests/outsourced-agent-handback-docs.vitest.ts`; HANG narrowed to `scripts/tests/progressive-validation.vitest.ts` |
| `mcp_server/tests/` minus handler/memory/graph/search-quality | HANG, timed out at 300s | No final count emitted | FAIL before hang: `checkpoints-extended`, `context-server`, `ensure-ready`, `migration-lineage-identity`, `modularization`, `stdio-logging-safety`, `review-fixes`, `codex-prompt-wrapper`, `remediation-008-docs`, `structural-contract`; HANG narrowed to `mcp_server/tests/progressive-validation.vitest.ts` |
| Targeted readiness subset | PASS, exit 0, 3.9s | 19 passed; 109 passed / 5 todo | None |

### Classification

| File | Classification | Evidence |
|------|----------------|----------|
| `mcp_server/tests/handler-memory-save.vitest.ts` | Pre-existing / non-026-induced | Last changed 2026-04-24, before `733ce07c3`; assertion expected one natural-routing call but saw two. |
| `mcp_server/tests/graph-metadata-integration.vitest.ts` | Pre-existing / environment-path sensitive | Last changed 2026-04-17; failure concerns discovered graph metadata roots, not readiness scaffolding. |
| `mcp_server/tests/graph-payload-validator.vitest.ts` | Pre-existing | Last changed 2026-04-25; failure expects trust source `ast` but receives `regex`. |
| `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` | Pre-existing | Last changed 2026-04-26; failure expects stale bridge source text. |
| `mcp_server/skill_advisor/tests/legacy/advisor-graph-health.vitest.ts` | Pre-existing / environment-path sensitive | Last changed 2026-04-25; failure reports orphan graph metadata and degraded health. |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Pre-existing | Last changed 2026-04-28; alias and star re-export expectations fail. |
| `mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Pre-existing | Last changed 2026-04-26; edge baseline readiness expectation fails. |
| `mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Pre-existing | Last changed 2026-04-26; code-graph readiness metadata expectations fail. |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Pre-existing | Last changed 2026-04-12; null-row restore validation expectation fails. |
| `mcp_server/tests/codex-prompt-wrapper.vitest.ts` | Pre-existing | Last changed 2026-04-25; expected call omits current `subprocessTimeoutMs`. |
| `mcp_server/tests/context-server.vitest.ts` | 026-touched, not 026-induced | `733ce07c3` removed readiness mocks/tests only; current failures are dispatch/schema/source-shape assertions outside that diff. |
| `mcp_server/tests/ensure-ready.vitest.ts` | Pre-existing | Last changed 2026-04-25; code-graph DB mock lacks `getLastGoldVerification`. |
| `mcp_server/tests/migration-lineage-identity.vitest.ts` | Environment/path sensitive | Missing legacy `.opencode/specs/.../006-search-routing-advisor/...` files. |
| `mcp_server/tests/modularization.vitest.ts` | 026-touched, not 026-induced | `733ce07c3` only removed the readiness export expectation; current failures are line-limit checks for unrelated modules. |
| `mcp_server/tests/progressive-validation.vitest.ts` | Pre-existing hang | Last changed 2026-04-21; single-file run timed out at 300s. |
| `mcp_server/tests/remediation-008-docs.vitest.ts` | Environment/path sensitive | Missing legacy `.opencode/specs/.../006-search-routing-advisor/...` docs. |
| `mcp_server/tests/review-fixes.vitest.ts` | Pre-existing | Last changed 2026-04-21; expected tool count is stale. |
| `mcp_server/tests/stdio-logging-safety.vitest.ts` | Pre-existing | Last changed 2026-04-21; stderr-safe logging scan reports existing violations. |
| `mcp_server/tests/structural-contract.vitest.ts` | Pre-existing | Last changed 2026-04-25; code-graph DB mock lacks `getCodeGraphMetadata`. |
| `scripts/tests/graph-metadata-backfill.vitest.ts` | Environment/path sensitive | Last changed 2026-04-13; temp path is outside supported specs root. |
| `scripts/tests/memory-learn-command-docs.vitest.ts` | Environment/path sensitive | Last changed 2026-04-21; expected workspace README under dot-opencode is missing. |
| `scripts/tests/outsourced-agent-handback-docs.vitest.ts` | Pre-existing doc alignment debt | Last changed 2026-03-17; expects handback delimiter in CLI skill docs. |
| `scripts/tests/progressive-validation.vitest.ts` | Pre-existing hang | Last changed 2026-04-21; single-file run timed out at 300s. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `plan.md` | Created | Planned the progressive Vitest investigation |
| `tasks.md` | Created | Tracked investigation and validation work |
| `checklist.md` | Created | Added Level 2 verification checklist required by strict validation |
| `implementation-summary.md` | Created | Recorded actual test state and classifications |
| `spec.md` | Modified | Updated continuity and Level 2 validator hygiene |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md` | Modified | Replaced broad green wording with targeted-pass plus broad-suite timeout evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The investigation used bounded Vitest runs with captured logs under `/tmp/vitest-012-*`. Broad commands were followed by narrower excludes and single-file runs until the timeout had concrete file-level evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Did not fix broad-suite failures | The failures were not confirmed as 026-induced; most files pre-date `733ce07c3`, and the two 026-touched files fail assertions outside the readiness-removal diff. |
| Scoped 026's claim to targeted readiness suites | Those suites are the only green Vitest evidence tied to 026's readiness-scaffolding cleanup. |
| Documented hangs as out-of-scope debt | Both progressive-validation files timed out individually at 300s, and fixing them would be a separate test-infrastructure packet. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Handler file pattern | FAIL: 1 failed file / 18 passed files |
| Search-quality subgroup | PASS: 15 files / 27 tests |
| Memory subgroup | PASS: 29 files / 560 tests / 5 todo |
| Graph subgroup | FAIL: 2 failed files / 13 passed files |
| Skill-advisor subgroup | FAIL: 2 failed files / 32 passed files |
| Full broad suite | HANG: timeout at 600s |
| File-level hang check | HANG: both progressive-validation files timed out at 300s |
| Targeted readiness subset | PASS: 19 files / 109 tests / 5 todo |
| Strict validator on this packet | PASS: exit 0, 0 errors, 0 warnings |
| Strict validator on 026 packet | PASS: exit 0, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full broad Vitest remains red/stuck.** This packet documents the state and does not repair pre-existing or environment-sensitive failures.
2. **Full per-file pass inventory is represented by subgroup counts.** The failing and hanging files are named; the many passing files are summarized by Vitest's file counts to keep the summary readable.
3. **No 026-induced fix was applied.** The two files touched by `733ce07c3` fail assertions outside the readiness-removal diff, so changing them here would exceed this packet's scope.
<!-- /ANCHOR:limitations -->
