## Iteration 09

### Focus
Promotion telemetry and persistence claims that affect future adaptive-tuning work.

### Findings
- The feature catalog says the two-cycle promotion counter is persisted across daemon restarts through the promotion telemetry surface. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:29`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:31`.
- The actual `two-cycle-requirement` implementation is a pure history-array helper with no file, DB, or telemetry I/O, so persistence is not implemented there. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:15`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:30`.
- Rollback telemetry is likewise only an interface contract plus callback (`emitTelemetry`); it has no built-in durable sink in the core implementation. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:37`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:58`.
- That leaves the promotion subsystem in the same general state as hook diagnostics: telemetry shapes exist, but persistence depends on an external consumer that is not wired in the investigated code. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:63`.

### New Questions
- Is promotion persistence intentionally deferred, or is this an undocumented implementation gap?
- Should promotion telemetry and hook telemetry share a single durable event sink?
- If live weights are not yet mutable, should the feature catalog down-scope these claims to avoid operator confusion?
- Which packet should own persistence: skill-advisor core, daemon lifecycle, or a higher-level observability layer?

### Status
converging
