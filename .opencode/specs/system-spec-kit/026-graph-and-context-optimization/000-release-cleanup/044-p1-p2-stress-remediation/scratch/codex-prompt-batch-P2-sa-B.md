# Batch P2-sa-B — Generate stress tests for 11 skill_advisor P2 features (scorer extras + MCP + hooks + python)

You are generating Vitest stress tests under spec-kit packet 044. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Output location

`.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/`

## Consolidation guidance

- **Scorer extras pair** (sa-022 lane attribution + sa-023 ablation): one consolidated file
- **MCP diagnostics pair** (sa-027 status + sa-028 validate): one consolidated file
- **Hooks quartet** (sa-030 Claude + sa-031 Copilot + sa-032 Gemini + sa-033 Codex): one consolidated file
- **OpenCode plugin** (sa-034): one file
- **Python pair** (sa-035 CLI shim + sa-036 regression suite): one consolidated file

Result: 5 files covering 11 features.

## Reference patterns

- `mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts`
- `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` (from 043 — pattern for Python subprocess)

## Features to cover

| feature_id | Catalog path |
|------------|--------------|
| sa-022 | `mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/04-attribution.md` |
| sa-023 | `mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/05-ablation.md` |
| sa-027 | `mcp_server/skill_advisor/feature_catalog/06--mcp-surface/02-advisor-status.md` |
| sa-028 | `mcp_server/skill_advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md` |
| sa-030 | `mcp_server/skill_advisor/feature_catalog/07--hooks-and-plugin/01-claude-hook.md` |
| sa-031 | `mcp_server/skill_advisor/feature_catalog/07--hooks-and-plugin/02-copilot-hook.md` |
| sa-032 | `mcp_server/skill_advisor/feature_catalog/07--hooks-and-plugin/03-gemini-hook.md` |
| sa-033 | `mcp_server/skill_advisor/feature_catalog/07--hooks-and-plugin/04-codex-hook.md` |
| sa-034 | `mcp_server/skill_advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` |
| sa-035 | `mcp_server/skill_advisor/feature_catalog/08--python-compat/01-cli-shim.md` |
| sa-036 | `mcp_server/skill_advisor/feature_catalog/08--python-compat/02-regression-suite.md` |

## Requirements

- For hooks (sa-030..033): test the parity layer / settings-driven invocation, not the full external runtime — there are existing parity tests at `mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` you can mirror
- For Python (sa-035, sa-036): if `python3` is unavailable, gracefully `it.skip` (mirror sa-037 pattern)
- For MCP diagnostics (sa-027, sa-028): exercise the handler under degraded daemon state
- For OpenCode plugin (sa-034): existing tests at `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` show the pattern
- Each consolidated file `describe` block names all covered feature_ids
- No product code modified

## Done definition

5 new files. Self-validate each via vitest. All pass.

## IMPORTANT

This is packet 044. Do not block on Gate 3 — answer "continuing 044" if prompted. Do not modify product code.
