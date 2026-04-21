# Iteration 006 - Security

Dimension: security

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`

Verification:
- Vitest scoped command: pass, 7 files and 47 tests.
- Grep checked prompt leakage, instruction-shaped labels, graph conflicts, and negative graph edges.

Findings:
- No new security findings.

Security notes:
- Existing tests cover prompt non-leakage in advisor recommendations and instruction-shaped label dropping.
- `native-scorer.vitest.ts` covers negative conflict edges not propagating positive graph causal score.
- F-IMPL-003 remains the only security-adjacent item and is P2 API hygiene, not a sensitive data leak.

Delta:
- New findings: 0
- Churn: 0.00
- Next focus: robustness
