---
title: "Changelog: Nested Changelog Per Spec [025-nested-changelog-per-spec/root]"
description: "Chronological changelog for the Nested Changelog Per Spec spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-04-03

> Spec folder: `specs/system-spec-kit/025-nested-changelog-per-spec` (Level 3)

### Summary

Packet-local changelog generation now lives beside the existing implementation summary workflow. You can generate a changelog for a packet root or a nested phase folder without inventing filenames or hand-assembling markdown, and the result lands in the parent packet's changelog/ directory with a consistent naming rule.

### Added

- Review /create:changelog command and assets for current release-note behavior (.opencode/command/create/changelog.md)
- Create nested changelog generator with root/phase detection (.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts)
- Create canonical packet changelog templates (.opencode/skill/system-spec-kit/templates/changelog/root.md, .opencode/skill/system-spec-kit/templates/changelog/phase.md)
- [P] Update system-spec-kit skill/template/reference guidance for nested changelog workflow (.opencode/skill/system-spec-kit/SKILL.md, references, template READMEs, phase addendum docs)
- Add nested changelog mode to /create:changelog docs and YAML assets (.opencode/command/create/changelog.md, .opencode/command/create/assets/create_changelog_*.yaml)
- Update /spec_kit:implement to generate nested changelog output for packet-aware targets (.opencode/command/spec_kit/implement.md, .opencode/command/spec_kit/assets/spec_kit_implement_*.yaml)

### Changed

- Review packet-local changelog examples in 024-compact-code-graph/changelog (.opencode/specs/system-spec-kit/024-compact-code-graph/changelog/)
- Define packet-root and child-phase naming/output rules (.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts)
- [P] Export and document the generator in scripts package surfaces (.opencode/skill/system-spec-kit/scripts/spec-folder/index.ts, .opencode/skill/system-spec-kit/scripts/spec-folder/README.md, .opencode/skill/system-spec-kit/scripts/scripts-registry.json)
- Update /spec_kit:complete to generate nested changelog output for packet-aware targets (.opencode/command/spec_kit/complete.md, .opencode/command/spec_kit/assets/spec_kit_complete_*.yaml)
- Run focused nested changelog Vitest verification (.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts)
- Update packet 025 documentation to match the shipped workflow (.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/)

### Fixed

- Fix template path resolution in the generator after the first test failure (.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts)

### Verification

- npm run build --workspace=@spec-kit/scripts - PASS
- npx vitest run tests/nested-changelog.vitest.ts --config ../mcp_server/vitest.config.ts --root . - PASS
- Root output path contract - PASS - focused test asserts changelog-<packet>-root.md
- Phase output path contract - PASS - focused test asserts parent-packet changelog-<packet>-<phase-folder>.md output
- Command/workflow alignment review - PASS - /create:changelog, /spec_kit:implement, /spec_kit:complete, skill docs, templates, and references updated together
- P0 - CHK-001 Requirements documented in spec.md (EVIDENCE: spec.md requirements and scope sections)
- P0 - CHK-002 Technical approach defined in plan.md (EVIDENCE: plan.md architecture and implementation phases)
- P1 - CHK-003 Existing packet changelog patterns and command dependencies identified (EVIDENCE: packet 024 changelog review plus /create:changelog analysis captured in tasks.md)

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts` | Added the packet-local nested changelog generator with root/phase detection, path validation, markdown rendering, and output writing. |
| `.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts` | Added focused coverage for root-packet and child-phase changelog generation, including output-path assertions. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/index.ts` | Exported the nested changelog generator from the spec-folder package surface. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md` and `.opencode/skill/system-spec-kit/scripts/scripts-registry.json` | Documented and registered the new nested changelog generator in the scripts workspace. |
| `.opencode/skill/system-spec-kit/templates/changelog/root.md`, `.opencode/skill/system-spec-kit/templates/changelog/phase.md`, and `.opencode/skill/system-spec-kit/templates/changelog/README.md` | Added canonical templates and template guidance for packet-root and phase-child changelog output. |
| `.opencode/skill/system-spec-kit/references/workflows/nested_changelog.md` | Added the canonical workflow reference for packet-local nested changelog generation. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Updated the core System Spec Kit skill guidance to explain nested changelog generation as additive to `implementation-summary.md`. |
| `.opencode/command/create/changelog.md`, `.opencode/command/create/assets/create_changelog_auto.yaml`, and `.opencode/command/create/assets/create_changelog_confirm.yaml` | Added nested spec/phase changelog mode alongside the existing global release-note workflow. |
| `.opencode/command/spec_kit/implement.md` and `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` / `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Updated implementation workflow guidance so packet-aware folders generate nested changelogs during closeout. |
| `.opencode/command/spec_kit/complete.md` and `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` / `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Updated completion workflow guidance so packet roots and child phases create nested changelogs when applicable. |
| `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/spec.md`, `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/plan.md`, `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/tasks.md`, `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/checklist.md`, `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/decision-record.md`, and `.opencode/specs/system-spec-kit/025-nested-changelog-per-spec/implementation-summary.md` | Added and finalized the Level 3 packet documentation for the nested changelog workflow, including strict-validation compliance and closeout evidence. |

### Follow-Ups

- CHK-052 Historical packet changelogs normalized to the new format
- CHK-112 Load testing completed
- CHK-113 Performance benchmarks documented
- CHK-132 OWASP Top 10 checklist completed
- Nested changelog generation is workflow-aware, not a universal validator gate. This packet teaches the commands when to create packet changelogs, but it does not force every packet in the repository to have one.
- Generated quality depends on packet document quality. If implementation-summary.md, tasks.md, or checklist.md are sparse, the changelog will fall back to simpler derived bullets.
