# Template Consolidation Research Resource Map

## READMEs

Theme: Helper documentation should move out of rendered runtime level directories and into the master template README.

- `.opencode/skill/system-spec-kit/templates/README.md`
- `.opencode/skill/system-spec-kit/templates/level_1/README.md`
- `.opencode/skill/system-spec-kit/templates/level_2/README.md`
- `.opencode/skill/system-spec-kit/templates/level_3/README.md`
- `.opencode/skill/system-spec-kit/templates/level_3+/README.md`

## Documents

Theme: Cross-cutting and generated template documents define the byte-parity and scaffold contract.

- `.opencode/skill/system-spec-kit/templates`
- `.opencode/skill/system-spec-kit/templates/addendum`
- `.opencode/skill/system-spec-kit/templates/addendum/phase`
- `.opencode/skill/system-spec-kit/templates/context-index.md`
- `.opencode/skill/system-spec-kit/templates/core`
- `.opencode/skill/system-spec-kit/templates/debug-delegation.md`
- `.opencode/skill/system-spec-kit/templates/handover.md`
- `.opencode/skill/system-spec-kit/templates/level_1`
- `.opencode/skill/system-spec-kit/templates/level_1/spec.md`
- `.opencode/skill/system-spec-kit/templates/level_2`
- `.opencode/skill/system-spec-kit/templates/level_3`
- `.opencode/skill/system-spec-kit/templates/level_3+`
- `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md`
- `.opencode/skill/system-spec-kit/templates/research.md`
- `.opencode/skill/system-spec-kit/templates/resource-map.md`

## Commands

Theme: Command YAMLs are path-contract consumers and should migrate after the resolver wrapper exists.

- `.opencode/command/create/assets/create_agent_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`

## Agents

Theme: Runtime agent docs cite template sources and should change only after command and resolver behavior is stable.

- `.claude/agents`
- `.codex/agents`
- `.gemini/agents`
- `.opencode/agent`

## Skills

Theme: The system-spec-kit skill owns the template tree, generator, validation scripts, and migration surface.

- `.opencode/skill/system-spec-kit`

## Specs

Theme: The research packet preserves the iteration trail, state log, deltas, and synthesis evidence for planning.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-009.md`

## Scripts

Theme: Scripts are the active migration surface for generation, copying, validation, staleness checks, and maintenance-only wrappers.

- `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`
- `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts`
- `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh`
- `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts`

## Tests

Theme: Tests should enforce golden byte parity, resolver behavior, ANCHOR invariants, and normalized validator output.

- `.opencode/skill/system-spec-kit/scripts/tests/template-rendered-parity.vitest.ts`

## Config

Theme: Package-level test wiring is the enforceable local CI surface for the new parity and resolver tests.

- `.opencode/skill/system-spec-kit/scripts/package.json`

## Meta

Theme: Governance files and absent direct references frame the migration but are not runtime templates.

- `AGENTS.md`
- `CLAUDE.md`
- No direct `mcp_server/` paths are referenced in `research.md`.
