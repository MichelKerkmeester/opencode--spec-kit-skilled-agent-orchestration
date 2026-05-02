# Iteration 2: Flag Surface and Default Decision

## Focus
Q2 and Q3: the right opt-in surface, and whether end-user-only should be the default.

## Findings
- The current scan schema is strict: `code_graph_scan` allows `rootDir`, `includeGlobs`, `excludeGlobs`, `incremental`, `verify`, and `persistBaseline`; `additionalProperties:false` means a new per-call option must be added to the schema before clients can pass it. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562` and `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:566`.
- The current handler interface mirrors that strict schema and has no explicit skill-indexing option today. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:25`.
- The existing `excludeGlobs` argument is additive only, so it can remove more files but cannot override the hard guard once `.opencode/skill` is added there. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:216` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1298`.
- Existing runtime switches are environment-variable based. `SPECKIT_PARSER` is documented as a structural parser selector and is evaluated at runtime from the config module. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:31` and `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:45`.
- The config module already supports default-off opt-ins: `isMemoryRoadmapCapabilityEnabled(..., defaultValue = true)` returns false when `defaultValue` is false and no explicit true value is present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:76` and `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:94`.
- The shared rollout helper has opposite semantics for most graduated features: undefined env values are treated as enabled unless explicitly set to `false` or `0`. That helper is the wrong primitive for this packet's default-off requirement unless wrapped carefully. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:53` and `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:60`.
- `opencode.json` already carries MCP server environment entries and explanatory notes, so it is a good operator setup location but a poor source of truth for library behavior. Evidence: `opencode.json:19` and `opencode.json:25`.
- The inline gate renderer only understands a `level:` axis for template rendering, so it is not a suitable model for runtime scan options. Evidence: `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts:107` and `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts:112`.
- Existing schema tests cover optional scan controls and should be extended when the per-call override is added. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534` and `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:537`.

## Decisions Made
- Recommend a default-off environment variable as the primary maintainer opt-in, with a per-call boolean as a deliberate override for one-off scans. Rationale: env configuration matches current runtime setup patterns, while a per-call field keeps tests and tools able to request old behavior without editing process state.
- Recommend end-user-only as the default. Rationale: the packet goal, current public schema, and additive exclude behavior all point to a safe default where skill internals are absent unless the caller opts in.
- Do not use `opencode.json` as the only source of truth. Rationale: it configures one runtime launch, but the scanner runs as library code and tests should not depend on a user config file.

## Open Questions Discovered
- Should the per-call override be named `includeSkills` or `includeSkillInternals`? The latter is more explicit, but the former is shorter and easier for MCP callers.
- Should the environment variable be read once at config creation or during every scan? Reading at config creation is simpler and matches parser behavior.

## What Worked
Comparing the scan schema, handler interface, environment flag helpers, and `opencode.json` separated runtime defaults from user-facing tool arguments.

## What Failed
The inline gate renderer was not useful as a runtime flag model; it is a template renderer with only a documentation-level `level:` expression axis.

## Convergence Signal
narrowing

## Tokens / Confidence
0.88
