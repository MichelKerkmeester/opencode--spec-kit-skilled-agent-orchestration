TASK #4: Cross-Cutting Verification + Synthesis Validation
Depth: 1
Agent Tier: LEAF
Model Expectation: gpt-5.4 (high reasoning)
Objective: Validate the governance audit itself for internal consistency and missed issues across code + docs + tests.
Scope:
All files used by tasks #1-#3, plus:
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/017-governance/description.json
- .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts (focus lines ~519-555)
- .opencode/skill/system-spec-kit/mcp_server/tests/dead-code-regression.vitest.ts
Boundary:
- Read-only analysis only.
- Do NOT modify files.
- Do NOT delegate any sub-task.
LEAF NESTING CONSTRAINT:
You are a LEAF agent at depth 1. Nested dispatch is illegal. You MUST NOT dispatch sub-agents or use any task/delegation mechanism. Execute directly and return findings.
Checks:
1. Implementation-summary narrative consistency vs checklist claims.
2. Verify whether quality-loop.vitest.ts:523 truly tests isQualityLoopEnabled.
3. Evaluate potential missed issues: rollout-policy duplication paths, isFeatureEnabled behavior for 0%-rollout/no-identity path.
4. Assess backlog completeness of tracked issues.
5. Validate description.json integrity (specFolder, parentChain, keywords coherence).
6. Assess CHK-003 "NEW-095+" vs CHK-021 "NEW-063/NEW-064" as material vs cosmetic issue.
7. Provide overall audit quality score from 1-10 with rationale.
Output format:
- Verdict: PASS | WARN | FAIL
- Consistency findings
- Missed issues list (if any)
- Quality score (1-10)
- Recommended actions prioritized
- file:line evidence for every non-trivial claim
