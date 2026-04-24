---
title: "...6-graph-and-context-optimization/005-release-cleanup-playbooks/research/005-release-cleanup-playbooks-pt-01/research]"
description: "This investigation found that the release-cleanup/playbook wrapper is blocked less by fresh code failures than by contradictory release evidence. The most serious live issue is ..."
trigger_phrases:
  - "graph"
  - "and"
  - "context"
  - "optimization"
  - "005"
  - "research"
  - "release"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/research/005-release-cleanup-playbooks-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 005-release-cleanup-playbooks

## Summary
This investigation found that the release-cleanup/playbook wrapper is blocked less by fresh code failures than by contradictory release evidence. The most serious live issue is a contract split between the manual playbook, which forbids `UNAUTOMATABLE`, and the runner plus Phase 015 packet, which depend on that status for most outcomes. Several packet-local narratives are also stale: Phase 014 now fails current strict validation on continuity freshness, Phase 015 still records two automated blockers that no longer reproduce, and the manual-playbook runner still defaults to an old packet path under the retired `006-canonical-continuity-refactor` lineage. The dead-code audit itself appears sound within scope, but no wrapper-level release gate revalidated these cross-packet surfaces after later remediation and packet migration work.

## Scope
This research covered the `005-release-cleanup-playbooks` wrapper, its child packets under `001-release-alignment-revisits/`, `002-cleanup-and-audit/`, and `003-playbook-and-remediation/`, and the live playbook/runner/runtime surfaces those packets reference. The investigation focused on execution risks, playbook coverage gaps, dead-code audit follow-ups, and missing release-readiness checks. Cross-phase reads were limited to the root `026` packet where they clarified active wrapper status and ownership.

## Key Findings
### P0
- `F-001` The manual-testing release contract is internally inconsistent: the root playbook forbids `UNAUTOMATABLE`, but the runner and Phase 015 packet use it as the dominant classification (`273` cases), so the release surface has no single truthful execution policy. Evidence: [iteration-06.md](./iterations/iteration-06.md).

### P1
- `F-002` `001-playbook-prompt-rewrite` is still open and currently fails strict validation because continuity freshness drifted after graph metadata moved forward, so its old “strict validation passed” claim is no longer trustworthy. Evidence: [iteration-02.md](./iterations/iteration-02.md), [iteration-03.md](./iterations/iteration-03.md).
- `F-003` Phase 015 still publishes two automated blockers (`handler-helpers`, `spec-doc-structure`) that no longer reproduce on current targeted Vitest runs, leaving the wrapper with stale release-readiness prose. Evidence: [iteration-04.md](./iterations/iteration-04.md).
- `F-004` The manual-playbook runner and fixture still default to the retired `006-canonical-continuity-refactor/.../015-full-playbook-execution` artifact root, even though the packet claims evidence is now packet-local under the current `005-release-cleanup-playbooks/.../002-full-playbook-execution` path. Evidence: [iteration-05.md](./iterations/iteration-05.md).
- `F-005` Playbook coverage accounting is stale: the root playbook contains conflicting `300` and `305` active-scenario audits, while Phase 015 still hard-codes `297`; the current runner-style filesystem count is `300`. Evidence: [iteration-07.md](./iterations/iteration-07.md).
- `F-006` `003-deep-review-remediation` closed with “all findings resolved” and “no new P0/P1 findings,” but there is no wrapper-level post-remediation sweep proving that packet docs, playbook policy, artifact roots, and current verification outputs still agree. Evidence: [iteration-08.md](./iterations/iteration-08.md), [iteration-10.md](./iterations/iteration-10.md).

### P2
- `F-007` The dead-code/architecture audit did not fail its own brief; the remaining issues mostly sit outside its explicit scope and should be tracked as follow-up release debt instead of retroactively assigned to Phase 013. Evidence: [iteration-09.md](./iterations/iteration-09.md).

## Evidence Trail
- `iteration-03.md`: “The packet checklist still records `CHK-020` as passed for `validate.sh --strict`” but the current rerun fails on `CONTINUITY_FRESHNESS`.
- `iteration-04.md`: “The checklist still publishes a release-readiness verdict of ‘Automated suite green status: No’” even though the current targeted Vitest rerun passes `78/78`.
- `iteration-05.md`: “The live runner still defaults to the old archived phase path” under `006-canonical-continuity-refactor`.
- `iteration-06.md`: “Either the playbook policy is wrong, or the runner and packet result model are wrong, but they cannot both represent the release contract at the same time.”
- `iteration-07.md`: “The current runner-style filesystem count is `300`,” which no longer matches the `297` packet baseline.
- `iteration-08.md`: The wrapper still contains unresolved P1-class issues after the remediation packet declared “all 22 findings resolved.”

## Recommended Fixes
- `[P0][wrapper+runner+playbook]` Decide the canonical execution classification model and align all three surfaces: either document `UNAUTOMATABLE` as valid, or remove it from the runner/result model and redesign scenarios so only PASS/FAIL/SKIP remain.
- `[P1][001-playbook-prompt-rewrite]` Refresh `_memory.continuity.last_updated_at`, rerun `validate.sh --strict`, and either complete `CHK-023` or explicitly re-scope it in the packet so the packet can close honestly.
- `[P1][002-full-playbook-execution]` Update Phase 015 continuity, task, checklist, and implementation-summary text to remove the no-longer-live automated blockers and replace them with the current verified state.
- `[P1][runner+fixture]` Change the default report roots in `manual-playbook-runner.ts` and `manual-playbook-fixture.ts` from the old `006-canonical-continuity-refactor` path to the active `005-release-cleanup-playbooks/.../002-full-playbook-execution` path.
- `[P1][playbook accounting]` Regenerate the root playbook audit counts from the same discovery rule the runner uses, then rerun Phase 015 coverage accounting so packet totals match the live tree.
- `[P1][wrapper governance]` Add a wrapper-level release gate that runs four checks together: Phase 014 strict validation, targeted Vitest for prior blockers, runner report-root integrity, and scenario-count reconciliation.
- `[P2][cleanup tracking]` Track the remaining stale-path and stale-prose surfaces as explicit follow-up debt under `003-playbook-and-remediation` instead of assuming the dead-code audit covered them.

## Convergence Report
The research converged without early stopping. Iterations `04` through `08` contributed the highest-value new information because they tested live contradictions against current code and commands instead of relying on packet prose alone. Iterations `09` and `10` mostly refined ownership and release-gate design, which indicates the investigation moved from discovery into synthesis by the end of the loop.

## Open Questions
- Should `UNAUTOMATABLE` become a first-class documented outcome, or should the playbook contract force a PASS/FAIL/SKIP-only redesign?
- Which three scenario files explain the gap between the stale `297` packet count and the current `300` runner-style filesystem count?
- Is there any canonical downstream consumer that trusts packet prose without rerunning live verification, and therefore could be misled by the stale Phase 015 blockers?
- Should wrapper `005-release-cleanup-playbooks` get its own permanent release dashboard/checklist, or should those checks live in `003-playbook-and-remediation`?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/context-index.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/001-playbook-prompt-rewrite/*`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/*`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/003-deep-review-remediation/*`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/004-dead-code-and-architecture-audit/*`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts`
