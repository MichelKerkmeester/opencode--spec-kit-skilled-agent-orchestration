## Iteration 08

### Focus
Coverage limits in the exposed MCP tool surface, especially `advisor_validate()`.

### Findings
- The `advisor_validate` tool schema accepts only `confirmHeavyRun: true` and optional `skillSlug`; there is no selector for runtime transport parity, cache behavior, bridge-only checks, or corpus-path overrides. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:89`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:92`.
- The validator implementation measures scorer corpus, holdout, TS/Python parity, safety, and latency, but it does not execute Claude/Gemini/Codex/Copilot/OpenCode hook adapters or compare rendered briefs across runtimes. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:292`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:297`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:321`.
- The corpus path is hard-coded to a specific Phase 019 research artifact, which makes the validation surface packet-dependent instead of portable or easily retargetable. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:54`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:56`.
- README/operator docs describe “real corpus, holdout, parity, safety, and latency slices”, but they do not warn that runtime-hook parity is outside the tool’s current measurement scope. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:65`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:77`.

### New Questions
- Should runtime parity move into `advisor_validate`, or should a separate `advisor_validate_hooks` tool exist?
- Should the corpus path be an input parameter so implementation packets can validate against packet-local datasets?
- Would it be safer for `advisor_validate` to publish which slices are offline-only versus runtime-integrated?
- Is there a minimal parity fixture set that can cover bridge/wrapper differences without re-running the entire corpus?

### Status
converging
