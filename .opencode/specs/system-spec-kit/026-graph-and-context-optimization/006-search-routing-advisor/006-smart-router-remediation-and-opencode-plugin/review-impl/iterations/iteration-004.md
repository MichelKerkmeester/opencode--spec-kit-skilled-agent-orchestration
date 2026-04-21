# Iteration 004 - Testing

Focus: test coverage for the implementation contracts found in iterations 001-003.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

Verification:
- Scoped vitest command passed.
- `rg` found no `check-smart-router` test references outside the script itself.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F006 | P1 | The packet-scoped plugin suite mocks `node:child_process` and asserts only selected bridge payload fields, so it misses the native bridge contract that ignores `thresholdConfidence` and prints fabricated uncertainty. The real bridge compat tests are outside this packet's requested scoped test set. | `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:8`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:293`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:297`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:187` |

Additional coverage note:
- There is no dedicated static-checker test covering path containment or traversal-shaped resources for `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:100`.
