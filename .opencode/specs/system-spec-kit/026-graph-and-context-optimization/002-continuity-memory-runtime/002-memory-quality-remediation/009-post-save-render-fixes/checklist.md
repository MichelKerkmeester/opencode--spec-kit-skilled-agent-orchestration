---
title: "Verification Checklist: Post-Save Render Fixes"
description: "Verification checklist for the 009 render-layer fixes in the memory-save pipeline."
trigger_phrases:
  - "009 render checklist"
  - "post-save render verification"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["checklist.md"]

---
# Verification Checklist: Post-Save Render Fixes

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

- [x] CHK-001 [P0] The 014 planning and runtime memory saves were read as the motivating evidence set. [SOURCE: ../../001-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:2] [SOURCE: ../../001-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:2] [EVIDENCE: ../../001-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:2-35; ../../001-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:2-39]
- [x] CHK-002 [P0] The positive reference save with manual patches was read before implementation started. [SOURCE: ../../memory/09-04-26_07-37__ran-15-deep-review-iterations-on-the-full-026.md:134-145] [EVIDENCE: ../../memory/09-04-26_07-37__ran-15-deep-review-iterations-on-the-full-026.md:134-181]
- [x] CHK-003 [P1] Packet `003/006-memory-duplication-reduction` is treated as a soft predecessor and its shipped boundaries remain intact. [SOURCE: ../006-memory-duplication-reduction/implementation-summary.md:25-67] [EVIDENCE: ../006-memory-duplication-reduction/implementation-summary.md:25-67]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Lane B canonical sources auto-populates authoritative doc links in the saved wrapper. [SOURCE: spec.md:77] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:463-500; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:757-840,1446-1453; .opencode/skill/system-spec-kit/templates/context_template.md:240-250; .opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:19-50; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:117-120]
- [x] CHK-011 [P0] Lane C file counts render truthful captured, filesystem, and git-changed counts in structured JSON mode. [SOURCE: spec.md:78] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:243-272; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1094-1271; .opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:13-46; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:128-130]
- [x] CHK-012 [P0] Lane A removes filename-garbage title suffixes from saved titles. [SOURCE: spec.md:76] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/title-builder.ts:61-65; .opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12-28; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:117-117]
- [x] CHK-013 [P1] Lane D removes prose-bigram trigger noise while preserving explicit trigger phrases. [SOURCE: spec.md:79] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1367; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:56-96; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:125-125]
- [x] CHK-014 [P1] Lane E deduplicates distinguishing evidence and prefers anchor-bearing bullets. [SOURCE: spec.md:80] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:847-909,1469-1479; .opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:5-27; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:122-124]
- [x] CHK-015 [P1] Lane F renders truthful phase and session-status values instead of stale defaults. [SOURCE: spec.md:81] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:360-563,1345-1467; .opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:5-28; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:126-127]
- [x] CHK-016 [P2] Lane G auto-populates `derived_from` and planning-to-implementation `supersedes` when applicable. [SOURCE: spec.md:82] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:292-335; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1411-1424; .opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:37-90]
- [x] CHK-017 [P2] Lane H resolves `parent_spec` to a parent packet or null, never to the same `spec_folder`. [SOURCE: spec.md:83] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:337-350; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1484-1487; .opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts:9-36; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:131-133]
- [x] CHK-018 [P2] Lane I disambiguates rendered-memory quality from input completeness by field name. [SOURCE: spec.md:84] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:27-75; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:65-100; .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:358-365; .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:225-242; .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts:12-33; .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:134-139]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All new per-lane tests pass. [SOURCE: tasks.md:43-51] [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:79-88]
- [x] CHK-021 [P0] The round-trip test proves the fresh save satisfies all wrapper-contract checks. [SOURCE: plan.md:152-157] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:60-140; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:79-88]
- [x] CHK-022 [P0] Existing memory-quality regression guards remain green. [SOURCE: spec.md:151] [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:79-88]
- [x] CHK-023 [P0] `validate.sh --strict` passes on the `009-post-save-render-fixes` packet. [SOURCE: plan.md:44-49] [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:84-88]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Edits stay inside the approved render-helper, additive template, and test-file scope only. [SOURCE: spec.md:67] [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:58-66]
- [x] CHK-031 [P1] No runtime packet `005-014` files are modified as part of 009. [SOURCE: spec.md:91-93] [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:90-96]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized. [SOURCE: tasks.md:59-60] [EVIDENCE: spec.md:29-278; plan.md:18-289; tasks.md:33-92; decision-record.md:18-90; implementation-summary.md:1-96]
- [x] CHK-041 [P1] The parent phase map in `../spec.md` includes `009-post-save-render-fixes` and cites the 014 audit as the motivation. [SOURCE: ../spec.md:80-91] [EVIDENCE: ../spec.md:80-91]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet-local docs are placeholder-free at closeout. [SOURCE: plan.md:44-49] [EVIDENCE: implementation-summary.md:1-96]
- [x] CHK-051 [P1] The round-trip fixture stays under `scripts/tests/fixtures/post-save-render/` only. [SOURCE: spec.md:109-110] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/title-fixture.json:1-5; .opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/spec.md:1-15]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-04-09
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] The packet remains render-layer only and does not reopen the wrapper-template body or collector-to-contract data flow. [SOURCE: spec.md:64-67] [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:51-69]
- [x] CHK-101 [P1] Canonical-source discovery, lineage, and parent-spec logic stay bounded to the current packet and its `memory/` folder. [SOURCE: plan.md:91-102] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:463-500; .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:292-350]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Canonical-source and lineage discovery stay bounded and do not require unscoped repository scans. [SOURCE: spec.md:196-196] [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:463-500; .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:298-333]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] A rollback procedure exists before code changes begin. [SOURCE: plan.md:176-188] [EVIDENCE: plan.md:176-188; plan.md:233-247]
- [x] CHK-121 [P1] Final verification records typecheck, vitest, round-trip, and strict validation outputs. [SOURCE: plan.md:145-157] [EVIDENCE: implementation-summary.md:79-88]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Template changes, if any, are additive-only and limited to canonical-source rendering. [SOURCE: spec.md:109] [EVIDENCE: .opencode/skill/system-spec-kit/templates/context_template.md:240-250]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] The final implementation summary records the real lane fixes, verification, and remaining follow-on recommendation. [SOURCE: tasks.md:59-60] [EVIDENCE: implementation-summary.md:32-96]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Packet Orchestrator] | Technical Lead | [x] Complete | 2026-04-09 |
| [Packet Orchestrator] | Packet Owner | [x] Complete | 2026-04-09 |
<!-- /ANCHOR:sign-off -->
