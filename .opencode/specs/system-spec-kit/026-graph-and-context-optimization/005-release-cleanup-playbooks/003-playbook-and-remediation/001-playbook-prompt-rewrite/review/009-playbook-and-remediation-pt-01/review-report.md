# Deep Review Report: 014-playbook-prompt-rewrite

## 1. Executive Summary

- Verdict: **CONDITIONAL**
- Scope: Phase 014 packet truthfulness vs actual playbook scenario files under `sk-deep-review`, `sk-deep-research`, and `system-spec-kit`
- Active findings: 0 P0 / 3 P1 / 0 P2
- hasAdvisories: false

## 2. Planning Trigger

Phase 014 needs a real follow-on remediation pass. The packet repair is structurally valid, but the claimed prompt rewrite is not actually complete across the shipped playbook corpus named by the user.

## 3. Active Finding Registry

### P1-001 [P1] sk-deep-review playbook still ships the old execution matrix format
- File: `.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:45`
- Evidence: Phase 014 says the prompt rewrite was already completed in the playbook scenario files and that this packet repair should only document that finished work [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:51] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:45]. The current sk-deep-review scenario still uses `### RECOMMENDED ORCHESTRATION PROCESS` followed by the legacy 9-column execution table instead of the required headed prose sections [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:36] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:38] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:45] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:47].
- Recommendation: Rewrite the sk-deep-review scenario corpus to the required section-headed prose format and remove the legacy matrix rows.

### P1-002 [P1] sk-deep-research playbook still ships the old execution matrix format
- File: `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:45`
- Evidence: The packet and implementation summary describe the prompt rewrite as already complete [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41], but the current sk-deep-research scenario still uses the same legacy execution table pattern [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:36] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:38] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:45] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:47].
- Recommendation: Rewrite the sk-deep-research scenario corpus to the required section-headed prose format and remove the legacy matrix rows.

### P1-003 [P1] system-spec-kit playbook rewrite is still partial
- File: `.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24`
- Evidence: Phase 014 says it is only documenting already-completed prompt rewrite work [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:45]. Representative system-spec-kit scenarios still use older dash-prefixed `- Prompt:` / `- Commands:` / `- Expected:` blocks instead of the required headed prose sections [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:22] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:23] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:25] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:20] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:22].
- Recommendation: Finish the rewrite in the primary system-spec-kit playbook corpus so the headed prose format is consistent across the shipped scenarios.

## 4. Remediation Workstreams

- Workstream A: Rewrite the remaining sk-deep-review playbook scenarios out of the legacy matrix format.
- Workstream B: Rewrite the remaining sk-deep-research playbook scenarios out of the legacy matrix format.
- Workstream C: Finish the headed prose conversion in the remaining system-spec-kit scenarios that still use older dash-prefixed execution blocks.

## 5. Spec Seed

- The next packet should describe the current state as "packet repair complete, corpus rewrite still partial" rather than implying the rewrite is already finished.

## 6. Plan Seed

- Audit all three named playbook roots for the required headed prose sections.
- Rewrite remaining legacy matrix or dash-prefixed scenarios.
- Refresh Phase 014 to point at the fully migrated corpus.

## 7. Traceability Status

- Core protocols: `spec_code=partial`, `checklist_evidence=partial`
- Overlay protocols: not applicable in this slice

## 8. Deferred Items

- No distinct security defect surfaced in this document-format slice beyond the truthfulness / traceability regressions above.

## 9. Audit Appendix

- Iterations completed: 2
- Dimensions covered: correctness, traceability, maintainability
- Ruled out: packet-structure regressions inside the Phase 014 docs themselves; playbook-index path drift inside the packet repair
