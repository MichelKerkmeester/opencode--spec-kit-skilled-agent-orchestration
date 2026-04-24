## Iteration 07

### Focus
Whether the system captures real recommendation outcomes well enough to tune recommendation quality over time.

### Findings
- The current hook diagnostic record has no field for “suggested skill was invoked”, “user corrected route”, or “recommendation was accepted/rejected”, so there is no direct recommendation-to-outcome linkage in the shipped hook telemetry schema. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:52`.
- `advisor_validate()` measures quality from a static labeled corpus, holdout slice, regression fixtures, and synthetic safety/latency probes; it does not consume live hook diagnostics or real operator corrections. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:53`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:64`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:282`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:298`.
- The only “feedback loop” code I found under `skill-advisor` is promotion/rollback telemetry around candidate weights, not runtime recommendation outcomes; that means tuning is gated around offline validation cycles, not online routing quality drift. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:49`.
- Inference from the searched advisor/hook sources: I did not find a production path that records post-recommendation acceptance, correction, or skill-activation outcomes, so recommendation quality cannot currently be correlated with real usage inside this subsystem.

### New Questions
- Should outcome capture happen in the hook adapters, the orchestrator layer, or the skill-invocation surface itself?
- What is the smallest prompt-safe event schema that can record acceptance/correction without leaking prompt content?
- Can existing memory-system adaptive-ranking patterns be reused here, or does advisor tuning need its own bounded store?
- Should outcome feedback be limited to explicit corrections to avoid silent-label bias?

### Status
converging
