# Deep Review Report: 002-manual-testing-playbook

## 1. Executive summary

Verdict: CONDITIONAL

Stop reason: maxIterationsReached

Iterations completed: 10

Active findings: P0: 0, P1: 5, P2: 4

The packet should not be used as a current release/readiness source without remediation. It describes a non-existent Skill Advisor package root, a 24-scenario legacy playbook, and a 5-section RCAF snippet contract, while the live Skill Advisor package is under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/` and its root playbook documents 47 scenarios across ten groups. No P0 was found, but five P1 findings meet the requested CONDITIONAL threshold.

## 2. Scope

Reviewed packet:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `description.json`
- `graph-metadata.json`
- `implementation-summary.md` (requested, absent)

Live reference evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill-graph.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/**`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md`

Write boundary honored: only `review/**` was written.

## 3. Method

The loop ran 10 iterations and rotated dimensions in this order:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Traceability protocols covered:

| Protocol | Gate | Result |
| --- | --- | --- |
| spec_code | hard | fail |
| checklist_evidence | hard | fail |
| feature_catalog_code | advisory | fail |
| playbook_capability | advisory | fail |

## 4. Findings by severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 found. | n/a |

### P1

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| F001 | correctness | Packet routes operators to a non-existent Skill Advisor package root. | `spec.md:73`, `spec.md:104`, `graph-metadata.json:41`, `graph-metadata.json:48` |
| F002 | correctness | The reviewed 24-scenario corpus no longer matches the live 47-scenario playbook. | `spec.md:30`, `spec.md:56`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:40`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:101` |
| F003 | traceability | Completion metadata contradicts verification state. | `spec.md:40`, `tasks.md:40`, `tasks.md:79`, `checklist.md:38`, `checklist.md:79`, `graph-metadata.json:39` |
| F004 | correctness | The specified 5-section RCAF template contract is incompatible with live scenario files. | `spec.md:87`, `spec.md:95`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:13`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:24` |
| F005 | security | Current prompt-leakage release gates are omitted from the packet acceptance scope. | `spec.md:120`, `spec.md:132`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:101`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:56` |

### P2

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| F006 | maintainability | `graph-metadata.json` `key_files` is stale and truncated against the current surface. | `graph-metadata.json:40`, `graph-metadata.json:60`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:55` |
| F007 | maintainability | Decision record documents obsolete expansion assumptions. | `decision-record.md:40`, `decision-record.md:72`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:42` |
| F008 | traceability | `description.json` parentChain still points at the old `011-skill-advisor-graph` phase identifier. | `description.json:14`, `description.json:19`, `description.json:30`, `description.json:36` |
| F009 | traceability | Task evidence is summary-only and cannot reproduce the claimed checks. | `tasks.md:40`, `tasks.md:79`, `checklist.md:38`, `checklist.md:79` |

## 5. Findings by dimension

| Dimension | Findings | Assessment |
| --- | --- | --- |
| correctness | F001, F002, F004 | The packet validates the wrong paths, wrong corpus, and wrong scenario template contract. |
| security | F005 | The current live prompt-leakage release gate is absent from packet acceptance criteria. |
| traceability | F003, F008, F009 | Completion, migration, and evidence links are inconsistent. |
| maintainability | F006, F007 | Metadata and ADRs preserve obsolete context that will mislead future repair work. |

## 6. Adversarial self-check for P0

No P0 was assigned after adversarial review.

Reasons P1, not P0:

- The defects are release-readiness and validation-contract blockers, but the review found no direct production code mutation, destructive command, credential exposure, or immediate data-loss path.
- The wrong package root is severe because it breaks operator execution, but the live package still exists at a discoverable path.
- The prompt-leakage omission is security-relevant, but the live playbook does contain the prompt-leakage rule; the reviewed packet is the stale component.

P0 escalation trigger:

- Escalate F005 to P0 if this stale packet is the only release gate used for prompt-safety approval.
- Escalate F001/F002 to P0 if automation consumes these paths and blocks or corrupts current release validation without fallback.

## 7. Remediation order

1. Fix F001 by replacing all `.opencode/skill/skill-advisor/...` paths with `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...`, or explicitly archive this packet as historical.
2. Fix F002 and F004 by deciding whether the packet should describe the current 47-scenario native-first playbook or be archived as a superseded 24-scenario/RCAF packet.
3. Fix F005 by adding prompt-leakage and prompt-safe attribution release gates to the packet if it remains active.
4. Fix F003 by reconciling status: update checklist evidence, regenerate graph metadata, and create or restore `implementation-summary.md`.
5. Fix F006-F009 by regenerating derived metadata and refreshing ADR/task evidence after the active scope is corrected.

## 8. Verification suggestions

- Run a path existence sweep for every file path in `spec.md`, `plan.md`, `tasks.md`, and `graph-metadata.json`.
- Count live Skill Advisor playbook scenarios under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/` and compare against packet scope.
- Verify the root playbook's scenario inventory against actual files.
- Re-run checklist evidence after remediation and mark each checked item only with command output or cited file evidence.
- Regenerate `description.json` and `graph-metadata.json` through the canonical memory save pipeline after packet correction.

## 9. Appendix

### Iteration list

| Iteration | Dimension | New findings | Ratio | Churn |
| --- | --- | --- | ---: | ---: |
| 001 | correctness | F001, F002 | 0.42 | 0.42 |
| 002 | security | F005 | 0.22 | 0.22 |
| 003 | traceability | F003, F008 | 0.24 | 0.24 |
| 004 | maintainability | F006, F007 | 0.12 | 0.12 |
| 005 | correctness | F004 | 0.18 | 0.18 |
| 006 | security | none | 0.07 | 0.07 |
| 007 | traceability | F009 | 0.11 | 0.11 |
| 008 | maintainability | none | 0.06 | 0.06 |
| 009 | correctness | none | 0.05 | 0.05 |
| 010 | security | none | 0.03 | 0.03 |

### Verdict calculation

Requested rule:

- P0 -> FAIL
- >=5 P1 -> CONDITIONAL
- otherwise PASS, with advisories when P2 exists

Observed:

- P0: 0
- P1: 5
- P2: 4

Result: CONDITIONAL.

### Artifact index

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/deep-review-strategy.md`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
- `review/review-report.md`
