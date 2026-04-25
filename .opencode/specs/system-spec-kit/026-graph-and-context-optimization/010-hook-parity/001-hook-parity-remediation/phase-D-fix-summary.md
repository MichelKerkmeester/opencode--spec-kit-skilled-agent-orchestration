# Phase D Fix Summary

## Findings Addressed

- HOOK-P2-002: Codex PreToolUse policy now accepts both `bashDenylist` and `bash_denylist`, and reads Bash commands from `toolInput.command`.
- HOOK-P2-003: PreToolUse no longer bootstraps policy files on the runtime path. Missing policy files use in-memory defaults and emit a stderr diagnostic with `status:"in_memory_default"`.

## Files Modified

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/codex/setup.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/package.json`

## Verification Output

```text
cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck
> @spec-kit/mcp-server@1.8.0 typecheck
> tsc --noEmit --composite false -p tsconfig.json
exit 0

cd .opencode/skill/system-spec-kit/mcp_server && npm run build
> @spec-kit/mcp-server@1.8.0 build
> tsc --build
exit 0

cd .opencode/skill/system-spec-kit/mcp_server && timeout 80 ../scripts/node_modules/.bin/vitest run tests/codex-pre-tool-use.vitest.ts --reporter=default
✓ mcp_server/tests/codex-pre-tool-use.vitest.ts (10 tests) 12ms
Test Files 1 passed (1)
Tests 10 passed (10)
exit 0

node -e 'const {handleCodexPreToolUse}=await import("./dist/hooks/codex/pre-tool-use.js"); const out=handleCodexPreToolUse({tool:"Bash", command:"git reset --hard HEAD~1"}); console.log(JSON.stringify(out));'
{"hook":"codex-pre-tool-use","status":"in_memory_default","policyPath":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.codex/policy.json"}
{"decision":"deny","reason":"Codex PreToolUse denied Bash command matching git reset --hard"}
exit 0
```

Full-suite note: the required whole-repo vitest gate remains blocked by the same out-of-scope baseline failures previously observed in `scripts/tests/progressive-validation.vitest.ts`. The requested `.codex/policy.json` edit was also blocked by sandbox `EPERM`; to preserve behavior, the runtime supplements existing policy files with the in-memory default denylist containing bare `git reset --hard`, and the setup bootstrap emits that same default for new policy files.

## Proposed Commit Message

```text
feat(029/D): Codex PreToolUse policy hardening (HOOK-P2-002 + HOOK-P2-003)
```
