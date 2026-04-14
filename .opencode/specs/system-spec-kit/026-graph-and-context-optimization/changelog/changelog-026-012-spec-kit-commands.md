---
title: "Changelog: Spec Kit Command Intake Refactor [026-graph-and-context-optimization/012-spec-kit-commands]"
description: "Chronological changelog for the Spec Kit Command Intake Refactor phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-14

> Spec folder: `specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands` (Level 2)
> Parent packet: `specs/system-spec-kit/026-graph-and-context-optimization`

### Summary

Packet 012 is complete. The work introduced /spec_kit:start as the canonical intake surface, anchored /spec_kit:deep-research to real spec-folder state, taught /spec_kit:plan and /spec_kit:complete to inline-absorb /start when a target folder is not healthy, and finished the M9 middleware cleanup that removed deprecated wrapper surfaces while preserving continuity, recovery, and debugging pathways. This final pass converted the remaining unchecked checklist rows to source-contract verification, refreshed the packet summary artifacts, and separated packet-doc hygiene debt from the implemented command behavior.

### Added

- Draft the /spec_kit:start command card contract, folder-state vocabulary, and direct versus delegated setup flow (start command surface). Depends on: none. Evidence: completed in prior sessions M1 — .opencode/command/spec_kit/start.md (+312 new lines) per implementation-summary.md §M1.
- Finalize the shared /start canonical trio publication versus optional memory-save contract as one logical implementation unit. Depends on: T002, T003. Evidence: completed in prior sessions M1 — shared state graph enforced in both YAML workflows with staged canonical commit semantics.
- Patch the deep-research command card for advisory lock timing, late-INIT spec detection, and folder_state classification (.opencode/command/spec_kit/deep-research.md). Depends on: T001. Evidence: completed in prior sessions M2 — .opencode/command/spec_kit/deep-research.md (+7 net) per implementation-summary.md §M2.
- [P] Patch the deep-research auto YAML INIT phase for no-spec, spec-present, spec-just-created-by-this-run, and conflict-detected branches (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml). Depends on: T005. Evidence: completed in prior sessions M2 — spec_kit_deep-research_auto.yaml (+85 net) per implementation-summary.md §M2.
- [P] Patch the deep-research confirm YAML INIT phase with the same branches plus confirm-mode conflict handling (.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml). Depends on: T005. Evidence: completed in prior sessions M2 — spec_kit_deep-research_confirm.yaml (+138 net) per implementation-summary.md §M2.
- Create the canonical spec-check protocol reference covering lock, seed-marker, host-anchor, generated-fence, audit, and idempotency rules (spec_check_protocol reference). Depends on: T005. Evidence: completed in prior sessions M2 — .opencode/skill/sk-deep-research/references/spec_check_protocol.md (+241 new lines) per implementation-summary.md §M2.

### Changed

- README & SKILL content update (NFR-Q06, part 2): For each file from T028, update stale references. Required changes per file category:
- Delete @handover agent across 4 runtime mirrors (.opencode/agent/handover.md, .claude/agents/handover.md, .codex/agents/handover.toml, .gemini/agents/handover.md). Depends on: T031. Evidence: all 4 mirrors deleted; .codex/agents/handover.toml removed via follow-up rm -f from parent orchestrator after codex sandbox permission block.
- Delete @speckit agent across 4 runtime mirrors (.opencode/agent/speckit.md, .claude/agents/speckit.md, .codex/agents/speckit.toml, .gemini/agents/speckit.md). Depends on: T031. Evidence: all 4 mirrors deleted; .codex/agents/speckit.toml removed via follow-up rm -f from parent orchestrator after codex sandbox permission block.
- Update AGENTS.md and AGENTS_example_fs_enterprises.md: same edits as T035. Depends on: T035. Evidence: patched both root docs, then verified with sed -n '140,146p' + sed -n '299,313p' AGENTS.md and sed -n '160,166p' + sed -n '327,342p' AGENTS_example_fs_enterprises.md.
- CHK-001 REQ-001: Source contract verified.
- CHK-002 REQ-002: Source contract verified.

### Fixed

- [P] Author the auto-mode /start workflow for create, repair, placeholder-upgrade, and optional memory-save branching (.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml). Depends on: T001. Evidence: completed in prior sessions M1 — .opencode/command/spec_kit/assets/spec_kit_start_auto.yaml (+474 new lines) per implementation-summary.md §M1.
- [P] Author the confirm-mode /start workflow with approvals around overwrite, repair, resume, and relationship capture (.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml). Depends on: T001. Evidence: completed in prior sessions M1 — .opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml (+551 new lines) per implementation-summary.md §M1.
- [P] Patch the plan auto YAML to inject /start intake for no-spec, partial-folder, repair-mode, and placeholder-upgrade (.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml). Depends on: T013. Evidence: completed in prior sessions M4 — spec_kit_plan_auto.yaml (+52 net) per implementation-summary.md §M4.
- Implement normalized-topic dedupe, tracked seed-marker handling, and manual-relationship dedupe as one shared hardening unit. Depends on: T002, T003, T011, T012, T014, T015, T017, T018. Evidence: completed in prior sessions M5 — hardening contracts in start + deep-research YAMLs + spec_check_protocol.md per implementation-summary.md §M5.
- Validate repair-mode and re-entry coverage against the five-state intake contract (empty-folder, partial-folder, repair-mode, placeholder-upgrade, populated-folder). Depends on: T019. Evidence: completed in prior sessions M5 — five-state intake contract enforced across start_{auto,confirm}.yaml per implementation-summary.md §M5.
- Run packet-local regression and strict validation, including deep-research on this same packet after implementation. Depends on: T009, T011, T012, T014, T015, T017, T018, T021. Evidence: baseline-only rerun of bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands --strict captured current packet debt outside the M7/M8 slice; no fresh deep-research runtime pass was introduced in this doc-only remediation.

### Verification

- Source-contract sweep for CHK-001 through CHK-035 - PASS - all previously unchecked rows are now marked [x] with grep-based evidence in the checklist
- Existing verification tail - PASS - CHK-036 through CHK-054 are now all marked [x], including source-contract closure for the two stale blocker rows
- Final checklist state - PASS - 54/54 checklist items are marked [x] (10/10 P0, 7/7 P1, 29/29 P2)
- Nested changelog generation - PENDING - packet-local changelog will be generated after this summary update
- Final sk-doc validator batch - PENDING - rerun after changelog generation
- Final packet strict validation - PENDING - rerun after changelog generation
- P0 - CHK-001 REQ-001: Source contract verified. (EVIDENCE: rg -n 'folder_state|spec_check_result|deep-research.lock' returned 34 matches across .opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml, .opencode/command/spec_kit/deep-research.md, and .opencode/skill/sk-deep-research/references/spec_check_protocol.md, including the advisory lock path, folder_state enum, and typed spec_check_result audit event.)
- P0 - CHK-002 REQ-002: Source contract verified. (EVIDENCE: rg -n 'spec_seed_created|deep-research seed|seed.?marker' returned 12 matches across .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml and .opencode/skill/sk-deep-research/references/spec_check_protocol.md, including spec_seed_created, DR seed markers, and the pre-LOOP seeding path.)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- All tasks marked [x]
- No [B] blocked tasks remaining
- Packet-local regression and strict validation evidence captured
