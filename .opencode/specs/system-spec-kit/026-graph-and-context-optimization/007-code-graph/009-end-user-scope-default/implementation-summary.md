---
title: "Implementation Summary: End-User Scope Default Implementation"
description: "Phase 1-3 implementation completed: code graph scans now default to end-user repository scope, skill indexing requires explicit maintainer opt-in, scope fingerprints drive full-scan migration, and docs/tests are updated."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T13:06:10Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Phase 1-3 + remediation complete"
    next_safe_action: "Re-run deep-review or commit + push"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope decision lives in code_graph/lib/indexer-types.ts plus lib/utils/index-scope.ts."
      - "Default exclusion should be path-prefix based for .opencode/skill/**."
      - "Opt-in granularity should be all skill internals on/off via SPECKIT_CODE_GRAPH_INDEX_SKILLS=true or includeSkills:true."
      - "Existing graph migration should force a loud full scan because incremental cleanup will not remove existing out-of-scope files."
      - "Advisor and skill graph use separate metadata storage and should not block this change."
      - "Validation/readiness surfaces need messaging only; no broad validation orchestrator scope rewrite is required."
      - "CocoIndex is separate and should be a follow-up if semantic scope cleanup is needed."
      - "Current live DB impact is 1,571/1,619 files and 34,274/34,850 nodes under .opencode/skill."
      - "Backward compatibility is explicit maintainer opt-in, not old default behavior."
      - "ADR-005 invariance holds if Gate 3/spec-level/public workflow text stays unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-end-user-scope-default |
| **Completed** | 2026-05-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the planned three-phase refactor. `code_graph_scan` now defaults to end-user repository code, excludes `.opencode/skill/**`, and keeps `mcp-coco-index/mcp_server` excluded even when a maintainer opts into skill indexing.

### Scope Policy

Added `code_graph/lib/index-scope-policy.ts` and threaded its policy through `indexer-types.ts`, `scan.ts`, `structural-indexer.ts`, and `lib/utils/index-scope.ts`. The shared policy resolves the default, `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, and one-call `includeSkills:true`.

### Opt-In Surface

`tool-schemas.ts` and `schemas/tool-input-schemas.ts` now accept `includeSkills` as a strict boolean field. Tests cover schema acceptance, schema rejection, env opt-in, and per-call opt-in without process-env leakage.

### Fingerprint Migration

`code_graph_metadata` now stores `scope_fingerprint` and `scope_label` after successful scans. Readiness compares stored and active scope and returns the existing full-scan-required blocked shape when they differ. Status reports `activeScope`, `storedScope`, `scopeMismatch`, and `excludedTrackedFiles`.

### Documentation

The code graph README documents default exclusions, `includeSkills:true`, the env opt-in, and full-scan migration. `ENV_REFERENCE.md` documents `SPECKIT_CODE_GRAPH_INDEX_SKILLS=false` as a maintainer opt-in.

### Remediation

Remediated all six deep-review findings from `review/review-report.md`. Per-call `includeSkills` now overrides the env default when provided, so `includeSkills:false` can request an end-user-only scan from an env-enabled process. `scan.ts` now passes the canonical root into `getDefaultConfig()`, which closes the symlinked-root bypass before the default `.opencode/skill/**` guard runs. Scan validation errors and returned warnings now avoid absolute workspace paths. `resource-map.md`, README/env docs, ADR-002, the plan decision table, and focused tests were updated to lock the new contract.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 added the scope helper, config defaults, walker guard, scan/schema wiring, and focused tests. Phase 2 persisted the scope fingerprint, added mismatch detection, reused the blocked read shape, and exposed status/startup messaging. Phase 3 updated docs, ran regression gates, and measured the live local graph delta after an explicit default full scan.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Default Applied | Why |
|----------|-----------------|-----|
| Helper name | `resolveIndexScopePolicy()` | Matches the plan default and clearly describes env plus scan-argument resolution. |
| Fingerprint field | `scope_fingerprint` | Stored in the existing `code_graph_metadata` table with `scope_label`. |
| Status payload | `activeScope`, `storedScope`, `scopeMismatch`, `excludedTrackedFiles` | Matches the plan default and keeps detailed counts in status. |
| Query/context breadth | Concise blocked payloads; detailed counts in status | Reuses `requiredAction:"code_graph_scan"` and avoids a new response family. |
| Helper file | Created `index-scope-policy.ts` | Prevents import-order coupling between generic path guards and indexer config. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Remediation focused Vitest | PASS: `code-graph-indexer.vitest.ts`, `code-graph-scan.vitest.ts`, `code-graph-siblings-readiness.vitest.ts`, and `tool-input-schema.vitest.ts`; 4 files, 152 tests passed. |
| Phase 1 grep gates | PASS: `includeSkills` appears in `tool-schemas.ts` and `scan.ts`; `.opencode/skill/**` default exclusion appears in `indexer-types.ts`. |
| Phase 2 code graph suite | PASS: `mcp_server/code_graph/tests/`; 19 files, 216 tests passed. |
| Phase 2 blocked shape | PASS: `context.ts` and `query.ts` still emit `requiredAction:"code_graph_scan"`. |
| Resource-map drift | PASS: Gate E diff returned no output. |
| Workflow invariance | PASS: `scripts/tests/workflow-invariance.vitest.ts`; 1 file, 2 tests passed. |
| Strict validation 009 | PASS: `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default --strict`; Errors: 0, Warnings: 0. |
| Strict validation 008 | PASS: `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience --strict`; Errors: 0, Warnings: 0. |
| Sentinel validation | PASS: `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl --strict`; Errors: 0, Warnings: 0. |
| Performance baseline | PASS: local DB count changed from 1,619 files / 34,850 nodes / 16,530 edges to 48 files / 646 nodes / 1,231 edges after default full scan. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

None identified.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
