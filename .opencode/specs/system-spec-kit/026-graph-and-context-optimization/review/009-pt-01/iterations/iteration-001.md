# Review Iteration 001 (Batch 007/010): Traceability - Cross-skill playbook matrix regressions

## Focus

Verify whether the prompt rewrite Phase 014 describes as already completed is actually reflected in the shipped `sk-deep-review` and `sk-deep-research` scenario files.

## Scope

- Review target: Phase 014 packet plus representative scenarios from `sk-deep-review` and `sk-deep-research`
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:51] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41]
- Dimension: traceability

## Scorecard

| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `014/spec.md` | 8 | 8 | 7 | 8 |
| `014/implementation-summary.md` | 8 | 8 | 7 | 8 |
| `sk-deep-review/.../004-fresh-review-initialization-creates-canonical-state-files.md` | 5 | 8 | 3 | 4 |
| `sk-deep-research/.../008-iteration-writes-iteration-jsonl-and-strategy-update.md` | 5 | 8 | 3 | 4 |

## Findings

### P1-001: sk-deep-review playbook still ships the old execution matrix format
- Dimension: traceability
- Evidence: The packet says the prompt rewrite was already completed and that this phase is only a documentation repair [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:51] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41]. The reviewed sk-deep-review scenario still uses the old execution matrix immediately under `## 3. TEST EXECUTION` [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:36] [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:45].
- Impact: Reviewers are told the rewrite is done, but a shipped sk-deep-review scenario still requires the old table interpretation.
- Final severity: P1

### P1-002: sk-deep-research playbook still ships the old execution matrix format
- Dimension: traceability
- Evidence: The same "already rewritten" packet framing does not match the current sk-deep-research scenario, which still uses the legacy execution matrix under `## 3. TEST EXECUTION` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:36] [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:45].
- Impact: The cross-skill prompt rewrite remains incomplete in another shipped playbook root, not just in one stray file.
- Final severity: P1

## Cross-Reference Results

### Core Protocols
- Contradictions: both reviewed cross-skill playbook roots still expose the old matrix format despite the packet's "already completed" framing.
- Unknowns: full remaining-file count was not needed once representative shipped files confirmed the regression.

### Overlay Protocols
- Not applicable in this slice.

## Ruled Out

- Broken playbook-index reference inside the packet repair itself: ruled out.

## Sources Reviewed

- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:51]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:61]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41]
- [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:36]
- [SOURCE: .opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:45]
- [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:36]
- [SOURCE: .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:45]

## Assessment

- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: The first pass proved the rewrite is not merely imperfectly documented; it is visibly incomplete in two shipped cross-skill playbook roots.
- Dimensions addressed: traceability, maintainability

## Reflection

- What worked: Sampling one live scenario from each named playbook root was enough to falsify the packet's "already rewritten" claim.
- What did not work: None.
- Next adjustment: Check whether the primary system-spec-kit playbook corpus is at least uniformly on the required headed prose format, or whether the rewrite is partial there too.
