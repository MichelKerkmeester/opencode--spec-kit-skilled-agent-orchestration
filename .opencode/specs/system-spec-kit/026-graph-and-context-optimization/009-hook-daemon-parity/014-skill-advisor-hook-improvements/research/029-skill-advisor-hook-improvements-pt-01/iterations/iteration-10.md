## Iteration 10

### Focus
Operator-documentation parity and residual low-severity gaps that would still slow follow-up implementation.

### Findings
- The feature catalog still points operators at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`, but the real bridge lives under `.opencode/plugin-helpers/` and the plugin resolves that exact helper path at runtime. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md:31`, `.opencode/plugins/spec-kit-skill-advisor.js:37`.
- The hook reference uses the same stale `.opencode/plugins/...bridge.mjs` path in its smoke-test example, so a literal operator copy/paste would fail. Citation: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:136`.
- The actual compatibility test suite uses `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, confirming the docs drift instead of the runtime. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:13`.
- This is lower severity than the parity/telemetry issues above, but it is still worth fixing because the packet’s follow-up implementation work will need reliable smoke-test instructions. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md:49`.

### New Questions
- Were these path docs missed during packet 012 because the bridge moved after the docs pass?
- Are there other runtime examples still pointing at pre-hardening paths or filenames?
- Should smoke-test docs be generated from runtime constants to avoid path drift?
- Can the follow-up implementation packet batch doc cleanup with threshold/cache parity fixes?

### Status
converging
