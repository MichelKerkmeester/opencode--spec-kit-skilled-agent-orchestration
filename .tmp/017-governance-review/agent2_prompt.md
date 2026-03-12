TASK #2: Feature Catalog + Manual Testing Playbook Accuracy
Depth: 1
Agent Tier: LEAF
Model Expectation: gpt-5.3-codex (xhigh)
Objective: Verify governance feature docs and manual testing scenarios match code reality.
Scope:
- .opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md
- .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
- .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md (NEW-063, NEW-064)
- .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts (cross-reference)
Boundary:
- Read-only analysis only.
- Do NOT modify files.
- Do NOT delegate any sub-task.
LEAF NESTING CONSTRAINT:
You are a LEAF agent at depth 1. Nested dispatch is illegal. You MUST NOT dispatch sub-agents or use any task/delegation mechanism. Execute directly and return findings.
Checks:
1. F-01: Verify B8 signal ceiling is documented as governance target (not runtime-enforced), and confirm code has no enforcement.
2. F-02: Verify documented counts (24 is* functions, 79 SPECKIT_ flags) against code reality.
3. F-02: Validate Sprint 8 dead-code removals are accurately reflected.
4. F-02: Verify isPipelineV2Enabled() behavior description is accurate.
5. Evaluate NEW-063/NEW-064 test scenarios for adequacy/completeness for governance verification.
6. Confirm whether master feature-catalog stale-count backlog item is correctly identified.
Output format:
- Verdict: PASS | WARN | FAIL
- Per-feature accuracy matrix (claim -> status -> evidence)
- Playbook coverage adequacy (good/partial/gap)
- Missing or stale backlog items
- Findings with file:line evidence
