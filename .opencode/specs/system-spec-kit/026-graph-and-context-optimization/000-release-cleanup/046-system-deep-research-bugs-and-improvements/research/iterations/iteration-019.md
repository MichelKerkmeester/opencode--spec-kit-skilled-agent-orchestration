# Iteration 019 — D4: Spec-kit folder topology sustainability

## Focus
Audited `.opencode/specs/system-spec-kit/` folder depth, numeric naming conventions, phase-parent detection, and packet sprawl under the active 026 release-cleanup tree. The key question was whether the topology scales once a remediation parent reaches dozens of direct child packets and multiple nested numeric levels.

## Actions Taken
- Ran `find .opencode/specs/system-spec-kit -type d | awk -F/ '{print NF-1, $0}' | sort -nr` to locate maximum depth and confirm archived/external research payloads can reach depth 16.
- Enumerated `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation` with `find`, confirming 48 direct numeric child folders.
- Enumerated `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation`, confirming 30 direct numeric child folders under a child parent.
- Read `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` for `findAncestorSpecFolder()`, `resolveArtifactRoot()`, and `allocateShortSubfolder()`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` and `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh` for the TypeScript and shell phase-parent rules.
- Read `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, and `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` for workflow path assumptions.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, and the live `005-review-remediation/graph-metadata.json`.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-019-D4-01 | P1 | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:419-425` | `updatePhaseParentPointer()` only rewrites `derived.last_active_child_id` and `derived.last_active_at`; when a child packet is saved, `updatePhaseParentPointersAfterSave()` calls that narrow updater at `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:439-445` instead of refreshing the parent metadata. The live parent proves the drift: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/graph-metadata.json:6-12` lists only children `001`-`005`, while `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/graph-metadata.json:57-58` points to child `046`. `resolveChildrenIds()` can derive the full direct-child list at `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:658-663`, but that path is not used for the parent during child saves. | Refresh the full parent graph metadata on child save, or at minimum update `children_ids` and `derived.key_files` alongside `last_active_child_id`. Add a regression fixture with a parent containing `001`, `002`, then save `003` and assert `children_ids` includes all three. |
| F-019-D4-02 | P2 | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:56-61` | Workflow field handling documents only `specs/{NNN-parent}/{NNN-phase}/`, but the active topology uses at least four numeric levels, for example `026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements`. `findAncestorSpecFolder()` walks to any ancestor with `spec.md` at `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:87-102`, and `resolveArtifactRoot()` treats any such folder as a child at `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:200-204`, so runtime behavior is more permissive than the documented path grammar. | Replace the two-level `parent/phase` language with explicit topology terms: program, track, packet, subpacket. Define supported max depth and ID derivation for nested paths such as `026/000/005/046`, then update resume/implement docs and tests around that grammar. |
| F-019-D4-03 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts:23-38` | `isPhaseParent()` classifies any folder with at least one direct `NNN-*` child containing `spec.md` or `description.json` as a phase parent. That is correct for detection, but there is no grouping threshold or sustainability warning when the direct-child count grows large. The active `005-review-remediation` parent has 48 direct numeric children, and `015-mcp-runtime-stress-remediation` has 30. Resume then falls back to listing children with per-child status when the pointer is stale, per `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:59-64`, which becomes noisy at this scale. | Keep `isPhaseParent()` simple, but add a separate topology health check that warns above a configurable direct-child threshold, suggests splitting into grouped parents such as `032-release-readiness/`, `stress-tests/`, `docs/`, or `deep-research/`, and emits a manifest summary instead of a flat 48-item selection list. |

## Questions Answered
- The structure is not scaling cleanly under `026/000/005`: 48 direct child packets make resume selection, graph metadata, and human scanning brittle.
- Numeric naming remains machine-friendly, but repeated local `000`, `005`, and `046` segments become hard to discuss without the full path.
- The code supports arbitrary ancestor depth in places, but workflow docs still describe a shallower two-level phase-child model.
- Parent graph metadata is not keeping up with packet sprawl when child saves only update the last-active pointer.

## Questions Remaining
- Should `026-graph-and-context-optimization/000-release-cleanup/005-review-remediation` be reorganized physically, or should the graph layer introduce virtual grouping while preserving paths?
- What direct-child threshold should trigger a topology warning: 20, 30, or 40?
- Should archived external research payloads under `z_future/.../external` be excluded from depth health metrics, or tracked separately as vendored/reference payloads?

## Next Focus
D5 should audit build/dist/runtime separation, but a follow-on topology packet should first fix parent metadata refresh and define an explicit nested spec-folder grammar before moving or renaming folders.
