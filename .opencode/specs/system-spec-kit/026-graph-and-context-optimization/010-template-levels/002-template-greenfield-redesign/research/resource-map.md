# Resource Map

## READMEs

Template-system documentation and legacy source orientation.

- `.opencode/skill/system-spec-kit/templates/README.md` - current template taxonomy and addon guidance.
- `.opencode/skill/system-spec-kit/templates/addendum/README.md` - legacy addendum layout targeted for deletion or consolidation.
- `.opencode/skill/system-spec-kit/templates/core/README.md` - legacy core template layout targeted for consolidation.
- `.opencode/skill/system-spec-kit/templates/changelog/README.md` - changelog templates that should be classified outside the new spec-doc template source surface if retained.
- `.opencode/skill/system-spec-kit/templates/examples/README.md` - example templates targeted for deletion after golden snapshots replace them.
- `.opencode/skill/system-spec-kit/templates/stress_test/README.md` - stress-test assets to relocate if still useful.

## Documents

Authored or workflow-owned markdown documents governed by the manifest.

- `spec.md` - primary authored packet spec and the only authored doc with template-contract frontmatter.
- `plan.md` - authored implementation plan for implementation and investigation packets.
- `tasks.md` - authored task ledger for implementation and investigation packets.
- `checklist.md` - authored QA doc added by `qa-verification`.
- `decision-record.md` - authored ADR doc added by `architecture-decisions`.
- `implementation-summary.md` - completion and continuity doc, lifecycle-sensitive.
- `handover.md` - command-owned lazy continuity artifact.
- `debug-delegation.md` - command-scaffolded and agent-owned debug artifact.
- `research/research.md` - workflow-owned research synthesis.
- `research/resource-map.md` - workflow-owned research resource map.
- `review/resource-map.md` - workflow-owned review resource map.
- `resource-map.md` - optional root author-maintained path ledger.
- `context-index.md` - optional phase migration bridge.

## Commands

Command surfaces and workflow entry points that create or consume docs.

- `.opencode/command/spec_kit/deep-research.md` - owns deep-research synthesis workflow.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` - owns automatic deep-research state flow.
- `.opencode/command/spec_kit/complete.md` - references canonical save and completion behavior.
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` - debug delegation trigger context.
- `/spec_kit:deep-research` - workflow trigger for `research/research.md`.
- `/spec_kit:deep-review` - workflow trigger for review packet outputs.
- `/memory:save` - command trigger for `handover.md`.

## Agents

Agent-owned behavior relevant to lifecycle classification.

- `.opencode/agent/deep-research.md` - workflow-owned research output behavior.
- `.opencode/agent/orchestrate.md` - debug delegation routing and exclusive debug ownership notes.
- `@debug` - owns debug pass after `debug-delegation.md` dispatch.
- `@deep-research` - LEAF research iteration executor when native workflow is used.

## Skills

Skill documentation and scripts used as protocol sources.

- `.opencode/skill/sk-deep-research/SKILL.md` - deep-research loop protocol.
- `.opencode/skill/sk-deep-research/references/convergence.md` - convergence and resource-map behavior.
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` - reducer, state parser, and workflow resource-map emitter.
- `.opencode/skill/system-spec-kit/SKILL.md` - spec folder and validation workflow.
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` - current level model reference.
- `.opencode/skill/system-spec-kit/references/templates/template_guide.md` - template composition reference.
- `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md` - validation contract reference.

## Specs

Research packet sources and cross-validation context.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-config.json` - loop configuration.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-state.jsonl` - iteration state log.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-strategy.md` - loop strategy.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/findings-registry.json` - findings registry.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md` - parser contract and core inventory.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-002.md` - addon lifecycle and validator survey.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-003.md` - design elimination.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-004.md` - manifest schema and golden tests.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-005.md` - refactor plan and risk register.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-006.md` - inline gates, evolution policy, edge probes.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-007.md` - concrete diffs.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-008.md` - dry-run verification.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-009.md` - final synthesis narrative.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-010.md` - workflow-invariant constraint pass and public/private contract correction.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-011.md` - ADR-005 draft, `resolveLevelContract(level)` API, and revised level-only diffs.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-012.md` - 11-surface ground-truth leakage probe.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-013.md` - five user-conversation transcript dry-runs.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-014.md` - final workflow-invariance synthesis and convergence declaration.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-009.jsonl` - final delta findings.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-010.jsonl` - workflow-invariant constraint findings.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-011.jsonl` - ADR-005 and resolver findings.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-012.jsonl` - live-surface leakage findings.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-013.jsonl` - AI-conversation dry-run findings.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-014.jsonl` - final synthesis delta findings.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-10.md` - rendered prompt for iteration 10.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-11.md` - rendered prompt for iteration 11.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-12.md` - rendered prompt for iteration 12.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-13.md` - rendered prompt for iteration 13.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-14.md` - rendered prompt for iteration 14.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-10.codex-stdout.log` - cli-codex stdout log for iteration 10.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-10.codex-stderr.log` - cli-codex stderr log for iteration 10.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-11.codex-stdout.log` - cli-codex stdout log for iteration 11.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-11.codex-stderr.log` - cli-codex stderr log for iteration 11.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-12.codex-stdout.log` - cli-codex stdout log for iteration 12.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-12.codex-stderr.log` - cli-codex stderr log for iteration 12.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-13.codex-stdout.log` - cli-codex stdout log for iteration 13.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-13.codex-stderr.log` - cli-codex stderr log for iteration 13.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-14.codex-stdout.log` - cli-codex stdout log for iteration 14.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/prompts/iteration-14.codex-stderr.log` - cli-codex stderr log for iteration 14.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md` - canonical synthesis.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md` - independent cross-validation framing.

## Scripts

Production and proposed implementation files affected by the refactor.

- `.opencode/skill/system-spec-kit/scripts/spec/create.sh` - scaffolder entry point that keeps public `--level` while resolving private template contracts internally.
- `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` - shell bridge for manifest helpers.
- `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` - required-doc validation.
- `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` - required-section validation.
- `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` - profile-derived count validation.
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` - post-gate template header validation.
- `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh` - legacy level consistency rule to split or retire.
- `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh` - packet metadata provenance rule, not part of capability matrix.
- `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs` - canonical save helper.
- `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` - current semantic frontmatter validator.
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh` - current template-source marker validator.
- `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` - link and metadata integrity checks.
- `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh` - phase-parent content discipline.
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` - required `compare-manifest` integration point.
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` - debug delegation lifecycle source.
- `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js` - metadata contract mirror target.

## Tests

Verification surfaces for the manifest redesign.

- `.opencode/skill/system-spec-kit/scripts/tests/template-scaffold.vitest.ts` - proposed golden snapshot test file.
- `.opencode/skill/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts` - proposed single regression test for level-only public workflow vocabulary across live outputs, templates, fixtures, command docs, skill text, and agent prompts.
- `.opencode/skill/system-spec-kit/scripts/package.json` - existing Vitest script surface.
- `.opencode/skill/system-spec-kit/package.json` - root workspace test integration.

## Config

Metadata, manifests, schemas, and generated packet state.

- `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json` - proposed single manifest.
- `.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts` - proposed canonical manifest loader.
- `.opencode/skill/system-spec-kit/mcp_server/lib/templates/inline-gates.ts` - proposed canonical gate renderer.
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` - TS validation registry integration.
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` - resume priority source.
- `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` - continuity contract source.
- `.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts` - description metadata schema.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` - graph metadata schema.
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` - metadata indexing parser.
- `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts` - current doc health parser.
- `.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts` - memory sufficiency parser.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` - memory-save content routing.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/description.json` - current packet description metadata.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/graph-metadata.json` - current packet graph metadata.

## Meta

Legacy directories and migration targets referenced by the synthesis.

- `.opencode/skill/system-spec-kit/templates/level_1/` - legacy Level 1 templates to remove after parity.
- `.opencode/skill/system-spec-kit/templates/level_2/` - legacy Level 2 templates to remove after parity.
- `.opencode/skill/system-spec-kit/templates/level_3/` - legacy Level 3 templates to remove after parity.
- `.opencode/skill/system-spec-kit/templates/level_3+/` - legacy Level 3+ templates to remove after parity.
- `.opencode/skill/system-spec-kit/templates/addendum/` - legacy addendum composition source to consolidate.
- `.opencode/skill/system-spec-kit/templates/core/` - legacy core composition source to consolidate.
- `.opencode/skill/system-spec-kit/templates/examples/` - legacy examples replaced by golden snapshots.
- `.opencode/skill/system-spec-kit/templates/phase_parent/` - legacy phase parent template location.
- `.opencode/skill/system-spec-kit/templates/stress_test/` - assets to relocate if retained.
