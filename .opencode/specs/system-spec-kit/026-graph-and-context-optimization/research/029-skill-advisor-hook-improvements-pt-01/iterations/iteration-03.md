## Iteration 03

### Focus
Cache invalidation and freshness parity between OpenCode and the shared hook brief pipeline.

### Findings
- The OpenCode plugin’s cache signature is derived from bridge/build file mtimes and sizes, not from advisor freshness, generation, or skill-graph source signatures. Citation: `.opencode/plugins/spec-kit-skill-advisor.js:37`, `.opencode/plugins/spec-kit-skill-advisor.js:72`.
- The plugin reuses cached responses for five minutes when that bridge-source signature is unchanged, so skill-graph/content updates can stay invisible to OpenCode until TTL expiry or session cleanup. Citation: `.opencode/plugins/spec-kit-skill-advisor.js:27`, `.opencode/plugins/spec-kit-skill-advisor.js:491`, `.opencode/plugins/spec-kit-skill-advisor.js:516`.
- The shared hook pipeline does the safer thing: it keys cache invalidation off `freshness.sourceSignature` and removes deleted-skill cache entries before reuse. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:384`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:395`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:462`.
- `getAdvisorFreshness()` already computes a content-based source signature across `SKILL.md`, `graph-metadata.json`, required scripts, and the SQLite/JSON artifacts, so the parity-safe invalidation primitive exists and the OpenCode plugin is simply not using it. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:149`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:173`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:191`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:206`.

### New Questions
- Should the OpenCode plugin ask the bridge for `generation` and `sourceSignature` and include those in its cache key?
- Is there any reason the plugin cannot simply cache on the shared brief pipeline’s freshness state instead of its own bridge-file fingerprint?
- Are stale OpenCode briefs currently observable after a skill edit followed by another prompt inside the same session?
- Should `spec_kit_skill_advisor_status` expose the effective freshness/generation of the most recent cached brief?

### Status
new-territory
