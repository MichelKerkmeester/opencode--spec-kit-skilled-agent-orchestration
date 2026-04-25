# Strategy - 012-skill-advisor-setup-command Closure Re-Review (pt-02)

## Goal

Verify all 30 findings opened by the first deep-review pass (review/) are now closed by the 12-step in-place remediation that landed between review-pt-01 and pt-02. This is a closure check, not a fresh-eyes review — the iteration budget is 5 (reduced from 7) and each iteration walks a specific finding cluster against the current file state.

## Prior-Run Context (review-pt-01)

- 7 iterations, cli-copilot gpt-5.5 high, sequential, 22m39s wall-clock
- Verdict: CONDITIONAL (0 P0, 25 P1, 5 P2) | newFindingsRatio iter 7: 0.0333
- Findings by category:
  - Correctness: 11 P1 + 3 P2
  - Security: 5 P1 + 1 P2
  - Traceability: 6 P1
  - Maintainability: 2 P1 + 1 P2
  - Convergence: 1 P1 (artifact-gap; resolved post-loop)
- Full report: `review/review-report.md`
- Resource map: `review/resource-map.md`

## Remediation landed (for re-verification)

| Priority | Fix landed | Closes |
|---|---|---|
| P1 | Phase 3 canonical target validator (realpath + allowlist exact-match before write) | F-CORR-006, F-SEC-002, F-MAINT-002 |
| P2 | Per-run rollback script + clean-tree guard, build_status branching | F-CORR-004, F-CORR-012, F-CORR-013, F-SEC-003 |
| P3 | Dry-run skips Phase 3+4; proposal in packet scratch/ not /tmp | F-CORR-003, F-SEC-005 |
| P4 | derived.triggers/keywords → derived.trigger_phrases/key_topics | F-CORR-005, F-CORR-010, F-TRACE-001, F-TRACE-002 |
| P5 | confidence_by_skill, conditional lane edits, per_skill_loop schema | F-CORR-008, F-CORR-009, F-CORR-011, F-CORR-014 |
| P6 | No-suffix mode + first-action contradictions resolved | F-CORR-001, F-CORR-002 |
| P7 | Graph-scan partial-recovery removed (hard-fail) | F-CORR-007 |
| P8 | README counts corrected, parent docs synced, changelog rows + paths | F-TRACE-003, F-TRACE-004, F-TRACE-005, F-TRACE-006 |
| P9 | SCORING SYSTEM REFERENCE folded into REFERENCE | F-MAINT-001 |
| P10 | Task removed from tools, data-only rules, runner.sh security note | F-SEC-001, F-SEC-004 |
| P11 | proposal_validation block (TOKEN/PHRASE schema, key length, boost range) | F-SEC-006 |
| P12 | "per-phase walkthrough" → "phase overview diagram" | F-MAINT-003 |
| post-loop | iter 3 + 6 markdown materialized from logs | F-CONV-001 |

## Stop Conditions

- newFindingsRatio < 0.10 (convergence)
- All 30 prior findings re-verified as closed (success)
- Any closure regression promoted to P0 with file:line evidence (failure)
- 5 iterations complete

## Success Criteria

- Each of the 30 prior findings has a verdict (closed | regressed | partial) with file:line evidence on the current file state
- Verdict matrix: 30 closed = PASS; any regressed = CONDITIONAL; new P0 = FAIL
- No new dimension audits (this is closure-focused; broader scope would need a fresh review packet, not pt-02)

## Iteration Plan

| Iter | Dim | Focus | Findings re-verified |
|---|---|---|---|
| 1 | correctness | Re-check 14 correctness findings (P1 + P2) | F-CORR-001..014 |
| 2 | security | Re-check 6 security findings | F-SEC-001..006 |
| 3 | traceability | Re-check 6 traceability findings (run real `find` for counts) | F-TRACE-001..006 |
| 4 | maintainability | Re-check 3 maintainability findings + DQI baseline | F-MAINT-001..003 |
| 5 | convergence | Final closure verdict + any new findings introduced by remediation | F-CONV-001 + cross-cutting |

## Files to Audit

Same scope as review-pt-01 — see `review-pt-01/resource-map.md` Section 1. Key targets after remediation:

- `.opencode/command/spec_kit/skill-advisor.md` (renumbered 1-12, GATE 3 EXEMPT updated, USER INPUT + KEY BEHAVIORS sections; Task removed from allowed-tools)
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml` (mutation_boundaries.validator added; phase_3_apply now 9 numbered steps with validate_targets first; proposal_validation block; conditional lane edits; rules.NEVER expanded)
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml` (same patterns; pre_phase_4 branched on build_status; per_skill_loop accepted_responses_schema)
- `.opencode/install_guides/SET-UP - Skill Advisor.md` (Section 5 ROLLBACK rewritten with per-run script + git stash safety)
- `.opencode/README.md` (counts: 22/30 with breakdown including doctor)
- `.opencode/skill/system-spec-kit/mcp_server/README.md` (Section 3.1.14 wording: "validated in Phase 3 by canonical-path validator")
- Parent `008-skill-advisor/{context-index,spec,tasks}.md` (trigger_phrases include 012; description text 12 children)
- Parent `008-skill-advisor/changelog/changelog-008-012-*.md` (3 added rows, .opencode/ prefixes)
- Packet docs (this file)
- `review-pt-01/runner.sh` (security note added)

## Dispatch Notes

- Executor: cli-copilot gpt-5.5 reasoningEffort=high (no service-tier)
- Concurrency: sequential within this pt-02 packet
- Per-iteration prompt: `review-pt-02/prompts/iteration-NNN.md`
- Per-iteration findings: `review-pt-02/iterations/iteration-NNN.md`
- Per-iteration delta JSON: `review-pt-02/deltas/iteration-NNN.json`
- State log: `review-pt-02/deep-review-state.jsonl`
- Final report: `review-pt-02/review-report.md`
