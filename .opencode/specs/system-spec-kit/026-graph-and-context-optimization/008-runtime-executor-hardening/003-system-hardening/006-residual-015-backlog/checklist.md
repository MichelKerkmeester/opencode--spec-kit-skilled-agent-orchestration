---
title: "...raph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/006-residual-015-backlog/checklist]"
description: "Verification checklist for closing 19 residual findings across 6 clusters."
trigger_phrases:
  - "015 residuals checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/006-residual-015-backlog"
    last_updated_at: "2026-04-19T00:55:00+02:00"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Cluster regressions green; final validation pending"
    next_safe_action: "Run build and strict spec validation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Delta review source read. [EVIDENCE: `../../review/019-system-hardening-pt-01/review-report.md` reviewed before edits.]
- [x] CHK-002 [P0] 19 residuals enumerated by cluster. [EVIDENCE: C1-C6 scope mirrored from `spec.md`, `plan.md`, and source review.]
- [x] CHK-003 [P1] Existing dirty worktree respected. [EVIDENCE: target files were read and diffs checked before edits; no unrelated dirty files reverted.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] C1 DB path boundary fixed. [EVIDENCE: `config.ts` canonicalizes realpaths and refreshes DB path bindings on late env overrides.]
- [x] CHK-011 [P1] C2 advisor degraded-state fixed. [EVIDENCE: `skill_advisor.py` and `skill_advisor_runtime.py` surface corrupt source metadata and skipped cache files as degraded health.]
- [x] CHK-012 [P1] C3 resume minimal contract fixed. [EVIDENCE: `session-resume.ts` skips the resume ladder and omits full memory payload in minimal mode.]
- [x] CHK-013 [P1] C4 review-graph semantics fixed. [EVIDENCE: `coverage_gaps` and `uncovered_questions` now route through distinct branches and status fails closed.]
- [x] CHK-014 [P2] C6 save/startup hygiene fixed. [EVIDENCE: whitespace-only trigger phrases score zero and startup-brief regressions are visible in hook output.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] W0+A regression tests passed. [EVIDENCE: `npm run test:core -- tests/memory-roadmap-flags.vitest.ts tests/session-resume.vitest.ts` passed 15 tests.]
- [x] CHK-021 [P0] W0+B regression tests passed. [EVIDENCE: `npm run test:core -- tests/deep-loop-graph-query.vitest.ts tests/coverage-graph-status.vitest.ts tests/coverage-graph-signals.vitest.ts` passed 31 tests.]
- [x] CHK-022 [P0] W0+C regression tests passed. [EVIDENCE: `python3 .opencode/skill/skill-advisor/tests/test_skill_advisor.py` passed 46 tests.]
- [x] CHK-023 [P0] W0+D regression tests passed. [EVIDENCE: `npm run test:core -- tests/save-quality-gate.vitest.ts tests/hook-session-start.vitest.ts` passed 94 tests.]
- [x] CHK-024 [P0] Final build/type verification passed. [EVIDENCE: `npm run build` passed in `.opencode/skill/system-spec-kit/mcp_server`.]
- [x] CHK-025 [P0] Strict packet validation passed. [EVIDENCE: `validate.sh --strict` passed with 0 errors and 0 warnings.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] DB boundary prevents symlink escape. [EVIDENCE: regression covers repo-local symlink resolving outside allowed roots.]
- [x] CHK-031 [P1] Minimal resume avoids oversized recovery disclosure. [EVIDENCE: minimal payload excludes `memory`, `payloadContract`, and `opencodeTransport`.]
- [x] CHK-032 [P2] Advisor health no longer masks malformed local metadata. [EVIDENCE: corrupt `graph-metadata.json` degrades `source_metadata` health.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] C5 doc parity updated. [EVIDENCE: `mcp-code-mode`, folder routing, troubleshooting, `AUTO_SAVE_MODE`, `sk-code-full-stack`, and `cli-copilot` docs patched.]
- [x] CHK-041 [P1] Tasks synchronized with implementation evidence. [EVIDENCE: `tasks.md` uses Level 2 anchors and marks wave tasks with command evidence.]
- [x] CHK-042 [P1] Implementation summary updated. [EVIDENCE: `implementation-summary.md` records cluster outcomes and verification commands.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No orphan scratch artifacts created for this packet. [EVIDENCE: implementation used existing source/test/doc locations only.]
- [x] CHK-051 [P1] Commit/push left to orchestrator. [EVIDENCE: no git commit or push executed in this dispatch.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-04-19
<!-- /ANCHOR:summary -->
