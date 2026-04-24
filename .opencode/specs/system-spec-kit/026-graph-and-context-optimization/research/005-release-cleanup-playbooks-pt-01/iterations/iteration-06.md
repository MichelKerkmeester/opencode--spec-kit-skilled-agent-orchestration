## Iteration 06
### Focus
Compare the manual testing playbook’s execution contract against the runner and Phase 015 result model.

### Findings
- The root playbook explicitly forbids `UNAUTOMATABLE` as a status and says the only valid classifications are `PASS`, `FAIL`, or `SKIP`. Evidence: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:7-10`.
- The runner’s live type system still defines `UNAUTOMATABLE` as a first-class scenario status, and the execution path preclassifies scenarios into that bucket before real handler execution for several flows. Evidence: `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:8-9`, `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:507-517`, `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:1657-1683`.
- Phase 015 depends on that status for its core result narrative: it records `273 UNAUTOMATABLE` scenarios and treats that as an honest automation boundary rather than a failure state. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/tasks.md:92-116`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/implementation-summary.md:54-59`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/checklist.md:85-87`.
- This is a live contract contradiction, not just stale prose: either the playbook policy is wrong, or the runner and packet result model are wrong, but they cannot both represent the release contract at the same time.

### New Questions
- Should `UNAUTOMATABLE` be restored as a documented release classification, or should those scenarios be reworked into PASS/FAIL/SKIP-only flows?
- Which downstream dashboards or reports currently assume `UNAUTOMATABLE` is valid?
- Is there any wrapper-level approval that intentionally overrode the root playbook policy?

### Status
new-territory
