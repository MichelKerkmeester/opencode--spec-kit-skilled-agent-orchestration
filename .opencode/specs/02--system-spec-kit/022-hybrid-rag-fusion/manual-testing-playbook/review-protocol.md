# Main-Agent Review Protocol (Merged)

## Inputs Required
1. `manual-test-playbooks.md`
2. Scenario execution evidence (logs, tool outputs, artifacts)
3. Feature-to-scenario coverage map
4. Triage notes for all non-pass outcomes

## Scenario Acceptance Rules
For each executed scenario, check:
1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

## Feature Verdict Rules
- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

## Release Readiness Rule
Release is `READY` only when:
1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of features currently defined in `manual-test-playbooks.md` (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

Otherwise release is `NOT READY`.

Deterministic coverage check (run from repository root):
- `TOTAL_FEATURES=$(rg -n '^\| (EX|NEW)-[0-9]{3} \|' specs/02--system-spec-kit/022-hybrid-rag-fusion/manual-testing-playbook/manual-test-playbooks.md | wc -l | tr -d ' ')`
- Final verdict report must include `COVERED_FEATURES/TOTAL_FEATURES`.

## Memory/Spec-Kit Mandatory Flows
Use `manual-test-playbooks.md` as the single source of truth:
- `M-001 Context Recovery and Continuation`
- `M-002 Targeted Memory Lookup`
- `M-003 Context Save + Index Update`
- `M-004 Main-Agent Review and Verdict Handoff`
Rule: do not duplicate or restate command text in this protocol; update playbook scenarios when commands change.
