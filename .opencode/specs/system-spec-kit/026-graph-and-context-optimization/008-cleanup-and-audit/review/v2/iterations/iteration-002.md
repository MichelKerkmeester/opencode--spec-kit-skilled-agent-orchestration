# Iteration 002

- Dimension: Correctness
- Focus: Adversarially test public command workflows for retired memory-path routing
- State read first: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`

## Findings

### P1

- **NF001 - Create-agent workflows still route operators into retired `specs/**/memory/*.md` save paths.** Both create-agent YAMLs emit `memory_file` outputs under `specs/[NNN]-[agent-name]/memory/...` and immediately call `memory_save` on that path, but the shipped runtime now rejects any noncanonical path after `isMemoryFile()` validation. This leaves a live public workflow pointed at an invalid retired surface. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:568-578] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:649-666] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976]

## Notes

- This does **not** revive the original runtime parser acceptance path from F001; it introduces a new correctness mismatch between active command workflows and the repaired runtime contract.

## Next Focus

Iteration 003 will switch to security and confirm that no shared-memory governance/auth residues remain reachable in runtime, scripts, templates, or feature-catalog surfaces.
