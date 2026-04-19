# Iteration 009: Correctness stability pass on live retired-path rejection

## Focus
This iteration re-ran a correctness stability pass over the live public entry points named for the remediation: `memory_save` runtime acceptance, `memory_index_scan` discovery, `create_agent_auto.yaml`, `create_agent_confirm.yaml`, and one representative F007-family workflow surface (`spec_kit_complete_confirm.yaml`). Public-entry-point verdict: no reviewed shipped runtime or live prompt emission path re-opened retired spec-folder `memory/*.md` acceptance or emission after remediation; the residual defect set remains documentary (`F005` / `F006` / `F007` / `F008`), not a reopened live retired-path bug. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:573] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:661] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:842] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1113]

## Files reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/command/create/assets/create_agent_auto.yaml`
- `.opencode/command/create/assets/create_agent_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`

## Findings

### P0
- None.

### P1
- None.

### P2
- None.

## Ruled Out
- `memory_save` no longer accepts retired spec-folder `memory/*.md` targets; it validates the path and rejects anything outside canonical spec docs or constitutional memory. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:975]
- `memory_index_scan` discovery still excludes `memory/` directories from spec-doc discovery, so retired packet memory files are not rediscovered by the live scan path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:52] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:56] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213]
- `create_agent_auto.yaml` and `create_agent_confirm.yaml` emit canonical `implementation-summary.md` save targets and explicitly say retired `memory/*.md` files are rejected, so the create-agent surface did not regress into live retired-path emission. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:573] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:579] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:661] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:667]
- The representative F007-family workflow surface still contains stale `checkpoint_file: "[SPEC_FOLDER]/memory/..."` metadata, but the same live workflow hard-blocks manual retired-path authoring and routes generated continuity into canonical spec docs; this remains documentary drift, not a reopened live acceptance or emission bypass. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:842] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1020] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1113] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1117] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1118]

## Dead Ends
- Re-reading the representative `spec_kit_complete_*` workflow did not justify reopening `F007` as a live runtime bypass: the stale `checkpoint_file` outputs conflict with, but are overridden by, the same asset's explicit retired-path prohibition and canonical-doc recovery path. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:783] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:945] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1036] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:842] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1020] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1117]

## Recommended Next Focus
Iteration 010 should be convergence and final-synthesis preparation: carry forward `F005` / `F006` / `F007` / `F008` as documentary and traceability residuals and close the loop without reopening a live retired-path correctness bug.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: This stability pass re-checked the named live entry points and found no new or refined defects; the only remaining retired-path references are the already-open documentary drift surfaces (`F005` / `F006` / `F007` / `F008`).
