## Iteration 10

### Focus

This final iteration checked what the shipped tests actually guard and whether any important packet-02 findings remain unanchored. The goal was to ensure synthesis stops for the right reason: enough evidence for follow-up implementation, not because the investigation lost momentum.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-09.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`

### Findings

- The runtime-parity suite asserts equal visible briefs across normalized runtime outputs, but it does so around the shared builder/renderer path; it does not validate the real OpenCode native helper's separate renderer or threshold-plumbing branch [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts:257-288] [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:189-241].
- The real bridge compat tests cover native-route success, uncertainty rendering, Python fallback, and disabled behavior, but they do not assert ambiguous-brief parity or configured-threshold propagation inside the native branch [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:36-73].
- The validator test suite locks schema shape and strict input parsing, but it does not assert the semantics of `confirmHeavyRun`, explicit workspace selection, or corpus-path configurability, so the packet-02 MCP-surface gaps remain effectively untested [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:10-49].

### Evidence

> expect(new Set(visibleBriefs).size).toBe(1);
> expect(Object.fromEntries(outputs)).toMatchObject({
>   claude: { additionalContext: visibleBriefs[0] },
>   gemini: { additionalContext: visibleBriefs[0] },
>   ...
>   'opencode-plugin': { additionalContext: visibleBriefs[0] }, [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts:257-265]

> it('delegates to native advisor_recommend when the daemon probe is available', () => {
> ...
> it('renders native uncertainty from the recommendation instead of a literal zero', () => {
> ...
> it('falls back to the Python-backed brief producer when native is forced local', () => {
> ...
> it('returns a prompt-safe disabled brief for the shared disabled flag', () => { [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:36-73]

> it('returns the required slice bundle schema for a skill subset', async () => {
> ...
> it('preserves privacy by excluding raw prompts and PII-shaped content', async () => {
> ...
> it('rejects invalid strict input clearly', () => { [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:10-49]

### Negative Knowledge

- I did not find an unresolved packet-02 question that still lacks code anchors; the remaining open questions are implementation and prioritization choices.
- I also did not find test coverage that invalidates the earlier packet-02 findings; the current suites mostly guard adjacent but narrower behavior.

### New Questions

#### Follow-Up Implementation

- Which bucket should land first: threshold unification, runtime-brief parity, MCP-surface normalization, or telemetry/outcome plumbing?
- Should test hardening happen alongside each fix or in a dedicated parity packet?

#### Residual Unknowns

- Is the team willing to narrow docs first for weights/promotion persistence, or should those docs remain aspirational while implementation catches up?

### Status

converging
