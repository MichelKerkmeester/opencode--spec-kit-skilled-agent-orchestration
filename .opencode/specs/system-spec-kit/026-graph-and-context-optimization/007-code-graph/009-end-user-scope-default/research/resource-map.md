# Resource Map: End-User Scope Default Research

## Summary

- Total references: 39
- Missing on disk: 0
- Scope: files investigated, files created or updated by the research loop, likely implementation paths, and paths expected to remain read-only.
- Generated: 2026-05-02T11:18:20Z

## Paths Investigated

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md` | Analyzed | OK | Packet framing and research questions |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/research/deep-research-config.json` | Analyzed | OK | Loop settings |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/research/deep-research-strategy.md` | Updated | OK | Loop strategy |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/research/deep-research-state.jsonl` | Updated | OK | Iteration state |
| `.opencode/skill/sk-deep-research/SKILL.md` | Analyzed | OK | Protocol overview |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Analyzed | OK | Loop contract |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Analyzed | OK | Stop rules |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Analyzed | OK | Scan entry point and pruning |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Analyzed | OK | Default globs |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Analyzed | OK | Candidate walk |
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Analyzed | OK | Scope guard |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Analyzed | OK | Env flag patterns |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` | Analyzed | OK | Default-on helper behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Analyzed | OK | Tool schema |
| `opencode.json` | Analyzed | OK | MCP env setup |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts` | Analyzed | OK | Non-runtime gate model |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh` | Analyzed | OK | Renderer wrapper |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Analyzed | OK | Readiness and migration gap |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Analyzed | OK | DB schema and row deletion |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Analyzed | OK | Skill graph and graph context wiring |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Analyzed | OK | Separate skill graph DB |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Analyzed | OK | Advisor status scan |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Analyzed | OK | Query readiness |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Analyzed | OK | Context readiness |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Analyzed | OK | Status readiness |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts` | Analyzed | OK | CocoIndex bridge |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts` | Analyzed | OK | CocoIndex status |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts` | Analyzed | OK | Read-only readiness |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Analyzed | OK | Verification readiness |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Analyzed | OK | Startup graph summary |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | Analyzed | OK | Existing scan docs |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts` | Analyzed | OK | Dispatch path |
| `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Analyzed | OK | Schema tests |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Analyzed | OK | Default config tests |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md` | Analyzed | OK | ADR-005 workflow invariance |
| `.opencode/skill/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Analyzed | OK | Ledger format reference |

## Paths Likely to Be Modified

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Planned | OK | Add `includeSkills` handling |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Planned | OK | Add default exclude and scope option |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Planned | OK | Thread opt-in through candidate walk |
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Planned | OK | Make code graph scope guard opt-in aware |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Planned | OK | Add `includeSkills` schema field |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Planned | OK | Add scope fingerprint readiness |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Planned | OK | Surface scope mismatch |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Planned | OK | Surface scope mismatch in startup summary |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | Planned | OK | Document default and opt-in |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Planned | OK | Document env opt-in |
| `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Planned | OK | Add schema case |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Planned | OK | Add default exclude and opt-in cases |

## Paths to Be Deleted

| Path | Action | Status | Note |
|------|--------|--------|------|
| None | Planned | OK | Code rows are deleted from SQLite by full scan; no source files should be removed |

## Paths to Remain Unchanged

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Cited | OK | Separate skill graph storage |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Cited | OK | Separate advisor status path |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts` | Cited | OK | CocoIndex follow-up only |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts` | Cited | OK | CocoIndex follow-up only |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md` | Cited | OK | ADR-005 source only |
