# Deep Review Iteration 10 of 10 (FINAL)

You are a LEAF review agent performing the FINAL review iteration. READ-ONLY review. NEVER modify code under review. NEVER dispatch sub-agents.

## STATE SUMMARY
- Iteration: 10 of 10 (FINAL)
- Dimension: All — Synthesis and Verification Pass
- Prior Findings: check JSONL for iterations 1-9

## REVIEW TARGET
ESM Module Compliance — spec-023. Spec folder: .opencode/specs/02--system-spec-kit/023-esm-module-compliance

## FOCUS: Final Verification and Severity Adjudication
1. Read ALL prior iteration files: review/iterations/iteration-001.md through iteration-009.md
2. Challenge any P0 findings: do they still stand with all evidence?
3. Re-evaluate P1 findings: upgrade to P0 or downgrade to P2?
4. Check for contradictions across iterations
5. Verify core traceability protocols (spec_code, checklist_evidence) are covered
6. Set provisional verdict: PASS, CONDITIONAL, or FAIL
7. Recommend next focus areas if remediation needed

## FILE PATHS
- State: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/
- Write to: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/iterations/iteration-010.md
- Read: review/iterations/iteration-001.md through iteration-009.md

## CONSTRAINTS
LEAF-only. READ-ONLY target. Target 9, max 13 tool calls. JSONL append-only. Strategy via Edit.

## FINAL ITERATION REQUIREMENTS
- Update strategy.md with final dimension coverage and mark all dimensions
- Set provisional verdict in strategy.md
- Append final JSONL record with complete dimension coverage
- Include a "Final Assessment" section summarizing the entire 10-iteration review
- Recommend PASS (no active P0/P1), CONDITIONAL (active P1 but no P0), or FAIL (active P0)

## SEVERITY + CLAIM ADJUDICATION
P0: Blocker (H/S/R). P1: Required. P2: Suggestion. newFindingsRatio: severity-weighted.
P0/P1 need claim-adjudication JSON.

Execute the review now.
