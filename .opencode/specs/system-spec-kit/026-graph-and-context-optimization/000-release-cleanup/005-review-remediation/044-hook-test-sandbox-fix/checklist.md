---
title: "Checklist: Hook Test Sandbox Fix"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for sandbox-aware runtime hook test methodology."
trigger_phrases:
  - "044-hook-test-sandbox-fix"
  - "hook test methodology"
  - "sandbox detection"
  - "BLOCKED_BY_TEST_SANDBOX"
  - "operator-run-outside-sandbox"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/044-hook-test-sandbox-fix"
    last_updated_at: "2026-04-29T21:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Checklist complete"
    next_safe_action: "Use normal shell for live verdict"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Hook Test Sandbox Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or document blocker |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md`]
- [x] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md`]
- [x] CHK-003 [P1] Historical evidence reviewed. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/results/*.jsonl`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runner changes are scoped to methodology files. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/runners/*.ts`]
- [x] CHK-011 [P0] Hook and plugin source code is unchanged. [EVIDENCE: `git status --short`]
- [x] CHK-012 [P1] `SKIPPED_SANDBOX` remains distinct from `SKIPPED`. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/runners/common.ts`]
- [x] CHK-013 [P1] Runner output avoids rewriting historical results. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/run-output/latest/`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Sandboxed runner reports direct smokes separately from live skips. [EVIDENCE: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests`]
- [x] CHK-021 [P0] MCP server build passes. [EVIDENCE: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`]
- [x] CHK-022 [P1] Strict validator exits 0 for this packet. [EVIDENCE: `validate.sh --strict`]
- [x] CHK-023 [P1] Prior findings amendment preserves the original verdict as history. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/findings.md`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or auth material added to docs or runner output. [EVIDENCE: reviewed changed files]
- [x] CHK-031 [P1] Sandbox probe writes only a temporary home probe and removes it. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/runners/common.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Methodology correction written. [EVIDENCE: `methodology-correction.md`]
- [x] CHK-041 [P1] Operator run path documented. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/runners/README.md`]
- [x] CHK-042 [P1] Prior findings reclassified. [EVIDENCE: `../043-hook-plugin-per-runtime-testing/findings.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Required Level 2 docs exist. [EVIDENCE: strict validator file check]
- [x] CHK-051 [P0] `description.json` and `graph-metadata.json` exist. [EVIDENCE: strict validator file check]
- [x] CHK-052 [P1] Packet root includes methodology correction. [EVIDENCE: `methodology-correction.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29
<!-- /ANCHOR:summary -->

