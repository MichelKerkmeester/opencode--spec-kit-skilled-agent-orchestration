# Review Iteration 002 (Batch 008/010): Correctness - system-spec-kit rewrite remains partial

## Focus

Verify whether the primary `system-spec-kit` playbook corpus actually uses the required headed prose format or merely a mix of older dash-prefixed execution blocks.

## Scope

- Review target: Phase 014 packet plus representative `system-spec-kit/manual_testing_playbook/` scenarios
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:45]
- Dimension: correctness

## Scorecard

| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `014/spec.md` | 8 | 8 | 7 | 8 |
| `014/implementation-summary.md` | 8 | 8 | 7 | 8 |
| `01--retrieval/001-context-recovery-and-continuation.md` | 6 | 8 | 4 | 5 |
| `13--memory-quality-and-indexing/003-context-save-index-update.md` | 6 | 8 | 4 | 5 |
| `16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md` | 6 | 8 | 4 | 5 |

## Findings

### P1-003: system-spec-kit playbook rewrite is still partial
- Dimension: correctness
- Evidence: The phase says it is only documenting already-completed prompt rewrite work [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:45], but representative system-spec-kit scenarios still use older dash-prefixed execution blocks such as `- Prompt:` and `- Commands:` instead of the required headed prose sections [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:22] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:23] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:25] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:20] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:22].
- Impact: The primary playbook corpus still mixes old and new prompt formats, so the rewrite is not complete enough to be treated as finished work.
- Final severity: P1

## Cross-Reference Results

### Core Protocols
- Contradictions: the packet frames the rewrite as completed, while the primary playbook corpus still shows older execution-block structure in representative shipped scenarios.
- Unknowns: a full remaining-file count was not required once the representative files confirmed the mixed-format state.

### Overlay Protocols
- Not applicable in this slice.

## Ruled Out

- Packet-local structural drift in `spec.md` / `implementation-summary.md`: ruled out.

## Sources Reviewed

- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:45]
- [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:22]
- [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24]
- [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:23]
- [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:25]
- [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:20]
- [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:22]

## Assessment

- Confirmed findings: 3 active / 1 new
- New findings ratio: 0.33
- noveltyJustification: The second pass confirmed the rewrite gap is not limited to cross-skill playbooks; it also persists in the primary system-spec-kit corpus.
- Dimensions addressed: correctness, traceability, maintainability

## Reflection

- What worked: Reviewing representative current files from the primary corpus kept the verdict grounded in shipped reality instead of packet optimism.
- What did not work: None.
- Next adjustment: none; the allocated review budget is exhausted.
