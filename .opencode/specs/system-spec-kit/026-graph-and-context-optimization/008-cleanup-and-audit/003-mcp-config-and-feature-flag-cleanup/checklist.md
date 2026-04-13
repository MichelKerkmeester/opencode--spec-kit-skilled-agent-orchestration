---
title: "018 / 012 — MCP config and feature-flag cleanup checklist"
description: "Verification Date: 2026-04-12"
trigger_phrases: ["018 012 checklist", "mcp config cleanup checklist", "feature flag cleanup checklist"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/003-mcp-config-and-feature-flag-cleanup"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the final verification checklist"
    next_safe_action: "Review implementation-summary.md"
    key_files: ["checklist.md", "implementation-summary.md", "tasks.md"]
---
# Verification Checklist: 018 / 012 — MCP config and feature-flag cleanup

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

- [x] CHK-001 [P0] The five Public config files and three runtime default files were read directly before any edits. [EVIDENCE: task setup completed in `tasks.md`]
- [x] CHK-002 [P0] Strict validation was run before packet repair to capture the missing-file and template defects. [EVIDENCE: validator output recorded during the review pass]
- [x] CHK-003 [P1] Phase scope stayed limited to the five Public configs plus packet-local docs. [EVIDENCE: no Barter or non-Public config files changed]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `cross-encoder.ts` uses `rerank-2.5`. [EVIDENCE: runtime file read plus targeted Vitest pass]
- [x] CHK-011 [P0] `vector-index-store.ts` derives `EMBEDDING_DIM` from `getEmbeddingDimension()`. [EVIDENCE: runtime file read plus targeted Vitest pass]
- [x] CHK-012 [P1] `rollout-policy.ts` keeps default-on semantics for undefined flags. [EVIDENCE: runtime file read plus `rollout-policy.vitest.ts`]
- [x] CHK-013 [P1] The five Public config env blocks stay identical in content and ordering. [EVIDENCE: direct file comparison and `rg` sweeps]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm run --workspace=@spec-kit/mcp-server typecheck` passes from `.opencode/skill/system-spec-kit`. [EVIDENCE: command output]
- [x] CHK-021 [P0] `npm run --workspace=@spec-kit/scripts typecheck` passes from `.opencode/skill/system-spec-kit`. [EVIDENCE: command output]
- [x] CHK-022 [P1] Targeted Vitest suites for schemas, graph metadata, reranker, rollout policy, and feature-flag docs all pass. [EVIDENCE: final Vitest runs recorded in `implementation-summary.md`]
- [x] CHK-023 [P1] Final config sweeps confirm no `MEMORY_DB_PATH` and no redundant checked-in feature flags in the five Public configs. [EVIDENCE: final `rg` sweep]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Minimal configs do not rely on hidden default-off behavior. [EVIDENCE: `rollout-policy.ts` treats undefined flags as enabled]
- [x] CHK-031 [P0] Removing checked-in feature flags does not remove the ability to opt out at runtime. [EVIDENCE: `_NOTE_7_FEATURE_FLAGS` documents the seven opt-out flags consistently]
- [x] CHK-032 [P1] Packet docs avoid claiming broader config scope than the operator approved. [EVIDENCE: packet docs reference five Public configs only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are all present and template-aligned. [EVIDENCE: strict validation pass]
- [x] CHK-041 [P1] Packet docs consistently describe five Public configs instead of six or Barter-specific scope. [EVIDENCE: packet-local doc sweep]
- [x] CHK-042 [P2] `implementation-summary.md` records the exact verification commands used for closeout. [EVIDENCE: verification table]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All packet docs and review state stay inside the `012-mcp-config-and-feature-flag-cleanup` folder. [EVIDENCE: folder inventory]
- [x] CHK-051 [P1] `graph-metadata.json` exists at the packet root and passes the rollout shape check. [EVIDENCE: strict validation pass]
- [x] CHK-052 [P2] No unrelated config families were modified to satisfy this packet. [EVIDENCE: focused diff scope]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-04-12
<!-- /ANCHOR:summary -->
