## Iteration 07
### Focus
Reconcile the active scenario counts claimed by the root playbook, the Phase 015 packet, and the current filesystem/runner logic.

### Findings
- The root playbook already contains two conflicting audit counts: Phase 017 says there are `300` active scenarios, while the older Phase 018 audit still says `305`. Evidence: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:63-71`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:103-111`.
- Phase 015 hard-codes `297` as the live active-scenario count across its spec, task ledger, checklist, and implementation summary. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/spec.md:131-134`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/tasks.md:56-69`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/checklist.md:74-77`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/implementation-summary.md:54-59`.
- The runner’s current discovery logic only excludes `manual_testing_playbook.md` and `_deprecated/`, so it is designed to count all other markdown scenario files under the playbook tree. Evidence: `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:261-279`, `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:454-477`.
- A current filesystem count using the runner-equivalent exclusions yields `300` candidate scenario files, which means the `297` packet total is stale against today’s playbook tree. Evidence: current filesystem count on 2026-04-23 returned `300` non-root, non-`_deprecated` markdown files under `.opencode/skill/system-spec-kit/manual_testing_playbook/`.

### New Questions
- Which three files were added after the original Phase 015 accounting run, and were they ever intentionally excluded?
- Should the root playbook regenerate its audit block from the same discovery function the runner uses?
- Does any release gate currently fail when packet counts lag the live playbook tree?

### Status
converging
