# Iteration 1 - Closure Verification: Correctness

## Summary

Correctness closure is mostly successful: 13 of 14 prior correctness findings no longer reproduce on the current command/YAML state. One P2 rollback wording finding is PARTIAL because the command markdown now uses the per-run rollback script consistently, but the auto YAML still contains one stale `git checkout HEAD --` rollback instruction.

## Closure Verdict per Finding

| Finding | Verdict | Evidence (file:line) | Notes |
|---|---|---|---|
| F-CORR-001 | CLOSED | `skill-advisor.md:46`; `skill-advisor.md:59-62` | Top-level says no suffix prompts for execution mode, matching the setup parser's no-suffix `ASK` path. |
| F-CORR-002 | CLOSED | `skill-advisor.md:13-18`; `skill-advisor.md:26-27`; `skill-advisor.md:196-199` | Markdown now owns setup first; YAML is loaded only after `execution_mode`, `scope`, `skip_tests`, and `dry_run` are resolved. |
| F-CORR-003 | CLOSED | `skill-advisor.md:188-190`; `spec_kit_skill-advisor_auto.yaml:155-160`; `spec_kit_skill-advisor_auto.yaml:168`; `spec_kit_skill-advisor_confirm.yaml:250` | Dry-run proposal path is packet-local scratch, and dry-run skips all writes plus Phase 4 in both YAML workflows. |
| F-CORR-004 | PARTIAL | `skill-advisor.md:40`; `skill-advisor.md:313`; `spec_kit_skill-advisor_auto.yaml:259` | Command markdown now consistently references the per-run rollback script, but auto YAML `error_recovery.build_fails` still says `git checkout HEAD --`, which conflicts with the generated rollback-script contract. |
| F-CORR-005 | CLOSED | `spec_kit_skill-advisor_auto.yaml:86`; `spec_kit_skill-advisor_auto.yaml:115`; `spec_kit_skill-advisor_auto.yaml:131` | Auto workflow now uses `derived.trigger_phrases` and `derived.key_topics` for graph metadata. |
| F-CORR-006 | CLOSED | `spec_kit_skill-advisor_auto.yaml:58-69`; `spec_kit_skill-advisor_auto.yaml:165`; `spec_kit_skill-advisor_auto.yaml:183` | Phase 3 now starts with canonical target validation before any write and fails before mutation on violation. |
| F-CORR-007 | CLOSED | `spec_kit_skill-advisor_auto.yaml:203-205`; `spec_kit_skill-advisor_auto.yaml:224-228`; `spec_kit_skill-advisor_auto.yaml:261` | Graph-scan failure is now a hard `STATUS=FAIL` path in Phase 4, quality gates, and error recovery. |
| F-CORR-008 | CLOSED | `spec_kit_skill-advisor_auto.yaml:143-144`; `spec_kit_skill-advisor_auto.yaml:218-220`; `spec_kit_skill-advisor_auto.yaml:241-245`; `spec_kit_skill-advisor_auto.yaml:305` | `confidence_by_skill` and scoped proposal outputs are wired into the pre-Phase 3 gate, with low-confidence proposals blocked. |
| F-CORR-009 | CLOSED | `spec_kit_skill-advisor_auto.yaml:134`; `spec_kit_skill-advisor_auto.yaml:169-171`; `spec_kit_skill-advisor_auto.yaml:218`; `spec_kit_skill-advisor_auto.yaml:294` | Phase 3 lane edits are conditional on non-empty scoped diffs and matching active scope. |
| F-CORR-010 | CLOSED | `spec_kit_skill-advisor_confirm.yaml:171-172`; `spec_kit_skill-advisor_confirm.yaml:200`; `spec_kit_skill-advisor_confirm.yaml:215` | Confirm workflow now uses `derived.trigger_phrases` and `derived.key_topics`, matching the auto workflow's corrected schema. |
| F-CORR-011 | CLOSED | `spec_kit_skill-advisor_confirm.yaml:99-102`; `spec_kit_skill-advisor_confirm.yaml:251-254`; `spec_kit_skill-advisor_confirm.yaml:300` | `C <lane>` is validated against explicit/derived/lexical and Phase 3 applies only approved scoped diffs. |
| F-CORR-012 | CLOSED | `spec_kit_skill-advisor_confirm.yaml:149-155`; `spec_kit_skill-advisor_confirm.yaml:269` | `post_phase_4` now exposes and wires `rollback_action: "bash {rollback_script_path}"`. |
| F-CORR-013 | CLOSED | `spec_kit_skill-advisor_confirm.yaml:119-140`; `spec_kit_skill-advisor_confirm.yaml:141` | Pre-Phase 4 now branches by `build_status`; failure disables verification choices and only permits rollback or abort/report. |
| F-CORR-014 | CLOSED | `spec_kit_skill-advisor_confirm.yaml:109-115`; `spec_kit_skill-advisor_confirm.yaml:261-264` | Per-skill `C <replacement-diff>` schema is defined and edited/skipped counters are represented in outputs. |

## New findings (if any introduced by remediation)

None. The stale rollback wording is recorded as a PARTIAL closure for prior F-CORR-004 rather than a new finding.

## Closure Stats

- closed: 13/14
- regressed: 0/14
- partial: 1/14
- new findings: 0

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review-pt-02/deep-review-strategy.md:1-85`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-001.md:1-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md:1-77`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-003.md:1-70`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md:139-185`
- `.opencode/command/spec_kit/skill-advisor.md:1-319`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:1-310`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml:1-375`

## Convergence Signals

- newFindingsRatio: 0.0
- dimensionsCovered: ["correctness"]
