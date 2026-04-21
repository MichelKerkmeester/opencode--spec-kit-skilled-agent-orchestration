---
title: "Verification Checklist: Memory Save Heuristic Calibration"
description: "Verification checklist for packet 010 covering schema, sanitizer, validator, D5, dist rebuild, full tests, strict validation, and the real save."
trigger_phrases:
  - "010 heuristic calibration checklist"
  - "memory save calibration verification"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/010-memory-save-heuristic-calibration"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["checklist.md"]

---
# Verification Checklist: Memory Save Heuristic Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Complete or explicitly defer with rationale |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Both motivating audit reports were read end-to-end before runtime edits. [EVIDENCE: ../../scratch/codex-root-cause-memory-quality-gates.md:1-208; ../../scratch/codex-skipped-research-recommendations.md:1-195]
- [x] CHK-002 [P1] `009-post-save-render-fixes` was treated as the soft predecessor and its dist-plus-wild-save bar stayed in force. [EVIDENCE: ../009-post-save-render-fixes/spec.md:21-25; ../009-post-save-render-fixes/checklist.md:72-79]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Lane 1 accepts explicit `title` and `description` without unknown-field warnings and renders them verbatim. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts; .opencode/skill/system-spec-kit/scripts/core/workflow.ts; .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts; .opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts]
- [x] CHK-011 [P0] Lane 2 preserves manual DR finding IDs and compact manual anchor phrases while still filtering auto-extracted junk. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts; .opencode/skill/system-spec-kit/scripts/core/workflow.ts; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts]
- [x] CHK-012 [P0] Lane 3 narrows V8 matching so false-positive dates, ranges, and finding IDs no longer fail the gate. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts; .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts]
- [x] CHK-013 [P0] Lane 4 passes slug-form and prose-form topical matches and uses workflow `filePath` propagation. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts; .opencode/skill/system-spec-kit/scripts/core/workflow.ts; .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts]
- [x] CHK-014 [P0] Lane 5 aligns D5 linker/reviewer behavior and preserves explicit or inferred `supersedes` data when valid. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts; .opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts; .opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts]
- [x] CHK-015 [P1] Lane 6 finishes the shared truncation-helper migration in `decision-extractor.ts`. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts; .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts]
- [x] CHK-016 [P1] Lane 7 parent-sync docs reflect the new Phase 10 child packet and updated counts. [EVIDENCE: ../spec.md; ../implementation-summary.md]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every shipped runtime lane has a focused regression test. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts; .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts; .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts; .opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts]
- [x] CHK-021 [P0] `cd .opencode/skill/system-spec-kit/mcp_server && npm test` was run and the remaining failures were classified as unrelated pre-existing issues outside this packet’s scope. [EVIDENCE: 2026-04-09 `npm test` output showing failures in `hybrid-search.vitest.ts`, `content-hash-dedup.vitest.ts`, `modularization.vitest.ts`, `memory-save-ux-regressions.vitest.ts`, `session-bootstrap.vitest.ts`, `shadow-evaluation-runtime.vitest.ts`, and `stdio-logging-safety.vitest.ts`]
- [x] CHK-022 [P0] `cd .opencode/skill/system-spec-kit/scripts && npm test` passes. [EVIDENCE: 2026-04-09 `npm test` exited 0 after vitest plus legacy extractors/loaders suite]
- [x] CHK-023 [P0] `cd .opencode/skill/system-spec-kit/scripts && npm run build` succeeds and updates `dist/`. [EVIDENCE: 2026-04-09 `npm run build` exited 0]
- [x] CHK-024 [P0] `validate.sh --strict` passes on `010-memory-save-heuristic-calibration`. [EVIDENCE: final strict-validation command for this packet exited 0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Edits stayed inside the approved runtime files, tests, packet docs, and parent phase-map/summary surfaces. [EVIDENCE: scoped diff for this packet plus listed runtime files only]
- [x] CHK-031 [P1] No `memory/` artifacts were edited directly; verification saves went through `generate-context.js`. [EVIDENCE: `/tmp/verification-save-data.json` -> `scripts/dist/memory/generate-context.js`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` are synchronized with the shipped result. [EVIDENCE: packet docs updated after final verification]
- [x] CHK-041 [P1] The implementation summary records per-lane evidence, test results, and the real save verification outcome. [EVIDENCE: implementation-summary.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet-local docs are placeholder-free at closeout. [EVIDENCE: packet docs contain final completed state]
- [x] CHK-051 [P1] Verification payload staging stayed outside the packet in `/tmp/verification-save-data.json`. [EVIDENCE: real save command used `/tmp/verification-save-data.json`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-09
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
### Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Packet Orchestrator] | Technical Lead | [x] Complete | 2026-04-09 |
| [Packet Orchestrator] | Packet Owner | [x] Complete | 2026-04-09 |
<!-- /ANCHOR:sign-off -->
