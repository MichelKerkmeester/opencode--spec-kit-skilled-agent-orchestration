## Iteration 05
### Focus
Audit whether the manual-playbook runner still writes artifacts to the packet-local location that Phase 015 claims.

### Findings
- Phase 015 says the runner was retargeted to the current packet-local scratch root and that packet-local evidence lands under `015-full-playbook-execution/scratch/manual-playbook-results/`. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/tasks.md:66-69`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/checklist.md:105-107`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/implementation-summary.md:62-70`.
- The live runner still defaults to the old archived phase path under `006-canonical-continuity-refactor/015-full-playbook-execution/scratch/manual-playbook-results`, not the current `005-release-cleanup-playbooks/.../002-full-playbook-execution` path. Evidence: `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:111-119`.
- The shared fixture module mirrors the same stale default report directory, so fresh runs can continue seeding artifacts into the wrong packet lineage unless `MANUAL_PLAYBOOK_REPORT_ROOT` is overridden. Evidence: `.opencode/skill/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:47-50`.

### New Questions
- Are the current scratch artifacts under `003-playbook-and-remediation/002-full-playbook-execution/` produced only because an override was set during the original run?
- Could future operators accidentally regenerate results into the retired 006 path and trust the wrong packet-local evidence?
- Should the runner expose the resolved report root in its output as a release check?

### Status
new-territory
