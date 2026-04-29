# sk-code-opencode Audit Findings

## Summary

- Files audited: 51
- PASS after fixes: 51
- VIOLATIONS (fixed): 24 files
- VIOLATIONS (skill gap - not fixed in this packet): 3 patterns
- 036 status: present. Commit `999c8ea47a8806f08640ef152954b259b654c544` was found and included.
- Strict mode baseline: `.opencode/skill/system-spec-kit/tsconfig.json:4` sets `"strict": true`; `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:2` extends that baseline.
- Verification: `npm run build` passed; `npx vitest run memory-retention-sweep advisor-rebuild hooks-codex-freshness` passed with 3 files and 10 tests.

## Audit Scope Notes

- The official 036 diff listed 50 files under `.opencode/skill/system-spec-kit/mcp_server/`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts` was also audited because the 036 matrix adapter tests import it and it exists in the worktree.
- README, JSON, and prompt-template Markdown assets were read and checked for applicable standards. TypeScript-specific checks are marked N/A for those assets.

## Per-file Results

### README.md

- PASS: Documentation asset, TypeScript checklist N/A.
- PASS: 036 matrix-runner references were inspected in the changed README context; no code-standard fix required. Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:576`.

### handlers/index.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:1`.
- PASS: Packet-added retention sweep lazy export is typed through the existing lazy module pattern. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:73` and `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:277`.
- PASS: No `any`, `@ts-ignore`, `console.log`, skipped tests, or `.only` found in this file.

### handlers/memory-retention-sweep.ts

- FIX APPLIED: Split mixed value/type import into separate `import type` block. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:6` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:10`.
- FIX APPLIED: Added TSDoc for the handler public surface. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:13`.
- PASS: Catch uses `unknown` and reports a contextual MCP error. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:68`.

### hooks/codex/lib/freshness-smoke-check.ts

- FIX APPLIED: Split type-only import from value import. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:6` and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:8`.
- FIX APPLIED: Added TSDoc for exported interfaces and function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:10`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:17`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:27`.
- FIX APPLIED: Added rationale for intentional fail-closed catch. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:40`.

### hooks/codex/user-prompt-submit.ts

- PASS: TypeScript header and shebang present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:1`.
- PASS: Dynamic input is narrowed through explicit interfaces and parse helpers. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:30` and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:221`.
- PASS: No skipped tests, `.only`, `any`, or `@ts-ignore` found.

### hooks/copilot/custom-instructions.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:1`.
- PASS: Public surfaces use interfaces and explicit return types. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:15`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:101`.
- PASS: Lock and file write errors are handled with contextual returns. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:162` and `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:205`.

### lib/governance/memory-retention-sweep.ts

- FIX APPLIED: Moved type-only import after value imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:7` and `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:12`.
- FIX APPLIED: Added TSDoc for exported interfaces. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:15`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:20`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:33`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:42`.
- FIX APPLIED: Replaced redundant `dryRun ? 0 : 0` with `0`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:137`.
- PASS: Ledger failure is not swallowed; it warns with context and returns `false`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:100`.

### lib/governance/scope-governance.ts

- FIX APPLIED: Moved type-only import after value import to satisfy type-import ordering. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:8` and `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:10`.
- PASS: Retention-related public types already had TSDoc. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:13`.

### lib/session/session-manager.ts

- FIX APPLIED: Moved type-only imports after local value imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:10` and `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:13`.
- PASS: Packet-added retention sweep integration is a value import, not a dynamic untyped boundary. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:11`.

### matrix_runners/README.md

- PASS: Documentation asset, TypeScript checklist N/A.
- PASS: Matrix runner usage and output contract are documented. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md:1`.

### matrix_runners/adapter-cli-claude-code.ts

- FIX APPLIED: Split mixed value/type import into value and type-only imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts:5` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts:7`.
- FIX APPLIED: Added TSDoc to exported adapter function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts:11`.
- PASS: Filename is kebab-case and module header is present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts:1`.

### matrix_runners/adapter-cli-codex.ts

- FIX APPLIED: Split mixed value/type import into value and type-only imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts:5` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts:7`.
- FIX APPLIED: Added TSDoc to exported adapter function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts:13`.
- PASS: Constants are named in UPPER_SNAKE_CASE. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts:9`.

### matrix_runners/adapter-cli-copilot.ts

- FIX APPLIED: Split mixed value/type import into value and type-only imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts:5` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts:7`.
- FIX APPLIED: Added TSDoc to exported adapter function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts:11`.
- PASS: Filename is kebab-case and module header is present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts:1`.

### matrix_runners/adapter-cli-gemini.ts

- FIX APPLIED: Split mixed value/type import into value and type-only imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts:5` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts:7`.
- FIX APPLIED: Added TSDoc to exported adapter function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts:11`.
- PASS: Filename is kebab-case and module header is present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts:1`.

### matrix_runners/adapter-cli-opencode.ts

- FIX APPLIED: Split mixed value/type import into value and type-only imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts:5` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts:7`.
- FIX APPLIED: Added TSDoc to exported adapter function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts:13`.
- PASS: Constants are named in UPPER_SNAKE_CASE. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts:9`.

### matrix_runners/adapter-common.ts

- FIX APPLIED: Added TSDoc to exported types, interfaces, and function. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:14`, `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:17`, `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:26`, `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:38`, `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:45`, `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:103`.
- FIX APPLIED: Added rationale for invalid regex catch. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:89`.
- PASS: No `any` leak in the CLI process boundary; stdout/stderr evidence has named interfaces. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:27`.

### matrix_runners/matrix-manifest.json

- PASS: Valid JSON manifest read as data by the runner. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json:1`.
- SKILL GAP: JSON cannot use the JSONC header pattern without becoming invalid JSON. Proposed skill update recorded below.

### matrix_runners/run-matrix.ts

- FIX APPLIED: Added TSDoc to exported `runMatrix`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts:238`.
- PASS: CLI output uses `process.stdout.write` and `process.stderr.write`, not `console.log`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts:273` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts:281`.
- PASS: Dynamic manifest parsing is constrained by `MatrixManifest` and `MatrixCell` interfaces. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts:23` and `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts:34`.

### matrix_runners/templates/F1-spec-folder

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Feature-ID filename is intentional manifest addressing, but sk-code-opencode does not document an exception to kebab-case. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder`, line 1.

### matrix_runners/templates/F2-skill-advisor

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F2-skill-advisor`, line 1.

### matrix_runners/templates/F3-memory-search

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F3-memory-search`, line 1.

### matrix_runners/templates/F4-memory-context

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F4-memory-context`, line 1.

### matrix_runners/templates/F5-code-graph-query

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F5-code-graph-query`, line 1.

### matrix_runners/templates/F6-code-graph-scan

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F6-code-graph-scan`, line 1.

### matrix_runners/templates/F7-causal-graph

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F7-causal-graph`, line 1.

### matrix_runners/templates/F8-cocoindex

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F8-cocoindex`, line 1.

### matrix_runners/templates/F9-continuity

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F9-continuity`, line 1.

### matrix_runners/templates/F10-deep-loop

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F10-deep-loop`, line 1.

### matrix_runners/templates/F11-hooks

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F11-hooks`, line 1.

### matrix_runners/templates/F12-validators

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F12-validators`, line 1.

### matrix_runners/templates/F13-stress-cycle

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F13-stress-cycle`, line 1.

### matrix_runners/templates/F14-search-w3-w13

- PASS: Prompt template asset, TypeScript checklist N/A.
- SKILL GAP: Same feature-ID filename exception as F1. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F14-search-w3-w13`, line 1.

### schemas/tool-input-schemas.ts

- FIX APPLIED: Split `ZodType` into a type-only import and kept type imports after value imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:11` and `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:14`.
- PASS: Packet-added schemas use Zod object schemas rather than ad hoc parsing. Evidence: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:298`.

### skill_advisor/handlers/advisor-rebuild.ts

- FIX APPLIED: Split mixed value/type imports into value and type-only groups. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:7` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:16`.
- FIX APPLIED: Added TSDoc for exported MCP handler and snake_case alias. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:103` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:114`.
- PASS: Public rebuild function already had TSDoc and explicit return type. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:46` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:53`.

### skill_advisor/handlers/advisor-status.ts

- FIX APPLIED: Split schema value imports from type-only imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:14` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:19`.
- FIX APPLIED: Added TSDoc for exported MCP handler and snake_case alias. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:185` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:196`.
- PASS: Dynamic state narrowing uses `isFreshness`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:31`.

### skill_advisor/handlers/index.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/index.ts:1`.
- PASS: Advisor rebuild export follows the existing barrel pattern. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/index.ts:5`.

### skill_advisor/tools/advisor-rebuild.ts

- FIX APPLIED: Added TSDoc to exported tool descriptor. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:7`.
- PASS: Type-only import already uses `import type`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:5`.

### skill_advisor/tools/index.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/index.ts:1`.
- PASS: Advisor rebuild tool export follows existing barrel pattern. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/index.ts:5`.

### tests/advisor-rebuild.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:1`.
- PASS: Uses Vitest `describe`/`it` and behavior-focused test names. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:33` and `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:34`.
- PASS: No `.only` or `.skip` found.

### tests/hooks-codex-freshness.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts:1`.
- FIX APPLIED: Split type-only hook input import. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts:8` and `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts:12`.
- PASS: Behavior-focused Vitest cases cover stale timeout fallback and freshness smoke check. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts:38` and `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts:39`.

### tests/matrix-adapter-claude-code.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-claude-code.vitest.ts:1`.
- PASS: Uses Vitest teardown to clear timers and mocks. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-claude-code.vitest.ts:9`.
- PASS: No `.only` or `.skip` found.

### tests/matrix-adapter-codex.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts:1`.
- PASS: Behavior-focused PASS and timeout tests. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts:14` and `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts:37`.
- PASS: No `.only` or `.skip` found.

### tests/matrix-adapter-copilot.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts:1`.
- PASS: Uses Vitest teardown to isolate mocks. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts:9`.
- PASS: No `.only` or `.skip` found.

### tests/matrix-adapter-gemini.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts:1`.
- PASS: Behavior-focused PASS and timeout tests. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts:14` and `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts:30`.
- PASS: No `.only` or `.skip` found.

### tests/matrix-adapter-opencode.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts:1`.
- PASS: Uses Vitest teardown to isolate mocks. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts:9`.
- PASS: No `.only` or `.skip` found.

### tests/matrix-adapter-test-utils.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:1`.
- FIX APPLIED: Split Vitest value and type imports. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:8` and `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:10`.
- FIX APPLIED: Added TSDoc to exported helper surfaces. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:17`, `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:42`, `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:47`, `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:63`, `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts:70`.

### tests/memory-retention-sweep.vitest.ts

- FIX APPLIED: Added TypeScript module header. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:1`.
- PASS: Uses Vitest `describe`/`it`, with behavior-focused names and no skipped tests. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:68` and `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:69`.
- PASS: Mocks/global state are not used; database state is local per test. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:70`.

### tool-schemas.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:1`.
- PASS: Tool definition interface is named and exported. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:35`.
- PASS: Packet-added advisor and retention tool registrations use the existing typed `ToolDefinition` shape. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:12`.

### tools/index.ts

- FIX APPLIED: Split `MCPResponse` into a type-only import. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:23` and `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:25`.
- PASS: Tool dispatch responses are typed through `MCPResponse`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:27`.

### tools/memory-tools.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:1`.
- PASS: Retention sweep dispatch uses typed args and existing validation. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:17` and `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:34`.

### tools/types.ts

- PASS: TypeScript header present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:1`.
- PASS: Protocol-boundary cast is centralized and documented. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:8`.
- PASS: Added retention sweep args use named interface. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:336`.

## Skill-gap Findings (proposed sk-code-opencode updates)

- JSON manifest headers: `matrix-manifest.json` must remain valid JSON, so it cannot carry JSONC-style header comments. Suggested addition: document a pure-JSON exception where manifests use sibling README/module docs for purpose metadata. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json:1`.
- Matrix prompt-template filenames: `F1-spec-folder` through `F14-search-w3-w13` use feature IDs for manifest addressing, which intentionally violates pure kebab-case. Suggested addition: allow feature-ID-prefixed prompt templates when IDs are declared in a manifest. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder`, line 1.
- TypeScript CLI output: `run-matrix.ts` correctly avoids `console.log` and writes TSV/status output through stdout/stderr, but sk-code-opencode has clearer JavaScript console guidance than TypeScript CLI guidance. Suggested addition: document `process.stdout.write`/`process.stderr.write` as the preferred TypeScript CLI reporting pattern. Evidence: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts:273`.

## Verification Evidence

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit --strict`: PASS.
- `npm run build`: PASS.
- `npx vitest run memory-retention-sweep advisor-rebuild hooks-codex-freshness`: PASS, 3 test files and 10 tests.
