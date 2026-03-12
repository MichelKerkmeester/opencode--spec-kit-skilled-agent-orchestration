TASK #1: Code Quality Review — Governance Feature Flags
Depth: 1
Agent Tier: LEAF
Model Expectation: gpt-5.3-codex (xhigh)
Objective: Verify governance-related feature-flag code correctness, bug risk, and sk-code--opencode alignment.
Scope:
- .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts (focus around lines 400-460)
- .opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts
Boundary:
- Read-only analysis only.
- Do NOT modify any file.
- Do NOT delegate any sub-task.
LEAF NESTING CONSTRAINT:
You are a LEAF agent at depth 1. Nested dispatch is illegal. You MUST NOT dispatch sub-agents or use any task/delegation mechanism. Execute directly and return findings.
Checks:
1. Count all exported is* functions in search-flags.ts and verify whether count is exactly 24.
2. Categorize each function into default-ON, opt-in/OFF, deprecated and verify expected split: 19 / 4 / 1.
3. Verify isPipelineV2Enabled() always returns true and is marked deprecated in JSDoc.
4. Verify isFeatureEnabled semantics: undefined/missing env => enabled; only 'false' or '0' disable.
5. Identify potential bugs and edge cases (null safety, empty string env vars, whitespace input, type hazards).
6. Confirm isInShadowPeriod in learned-feedback.ts is module-private (not exported).
7. Evaluate conventions against sk-code--opencode expectations (clarity, naming, behavior consistency, testability).
Output format:
- Verdict: PASS | WARN | FAIL
- Function count + category table
- Findings ordered by severity (Critical/Major/Minor/Cosmetic)
- Include file:line evidence for each claim
- Residual risk/test gaps
