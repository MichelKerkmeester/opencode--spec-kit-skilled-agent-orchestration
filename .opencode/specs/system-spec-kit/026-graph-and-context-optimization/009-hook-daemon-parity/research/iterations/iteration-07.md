## Iteration 07

### Focus
Operator-facing daemon status: does `advisor_status` distinguish real daemon presence from freshness state, or are those concepts currently conflated?

### Findings
- `advisor_status` derives `daemonAvailable` from freshness generation state alone: anything except `'unavailable'` is treated as daemon-available. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:80`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:87`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:93`
- The handler optionally exposes a daemon PID, but only when `SPECKIT_SKILL_GRAPH_DAEMON_PID` is set. Nothing in the main availability decision requires that PID to exist. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:30`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:34`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:112`
- The trust-state helper reinforces that conflation: it marks the graph `unavailable` only when `daemonAvailable` is false, and otherwise collapses the world into `absent`, `stale`, or `live`. That is useful for freshness, but not for reporting whether a long-lived daemon is actually running. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:19`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:29`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:39`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:49`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:59`
- The public README advertises `advisor_status` as a daemon-health surface, which means the current implementation can mislead operators into reading "freshness readable" as "daemon running". Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:551`, `.opencode/skill/system-spec-kit/mcp_server/README.md:554`

### New Questions
- Should `advisor_status` expose two separate fields, such as `daemonProcess` and `freshness`, instead of deriving one from the other?
- Is there an existing lease or watcher state file that could provide stronger daemon-running evidence than an env var PID?
- Would the operator experience improve if `advisor_status` reported `daemonAvailable: false` whenever no PID or lease holder is known, even if cached artifacts remain readable?
- Are any tests currently asserting the conflated behavior and therefore blocking a cleaner split?

### Status
new-territory
