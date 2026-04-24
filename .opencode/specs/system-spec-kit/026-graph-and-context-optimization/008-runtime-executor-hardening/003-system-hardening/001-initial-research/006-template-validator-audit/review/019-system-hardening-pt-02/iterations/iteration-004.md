# Iteration 004

## Dimension

- `maintainability`

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deltas/iter-001.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deltas/iter-002.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deltas/iter-003.jsonl`
- `.opencode/skill/system-spec-kit/scripts/rules/README.md`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

## Ranked Proposals

Ranking uses packet coverage estimate x audit-noise reduction weight. Noise reduction is estimated as `high=3`, `medium=2`, `low=1`, using the iteration-003 taxonomy counts as the evidence base.

| Rank | Proposal | Coverage estimate | Noise reduction estimate | Score | Why it ranks here |
| --- | --- | --- | --- | --- | --- |
| 1 | Add semantic validation for shared frontmatter fields (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`) | 6/6 canonical packet docs | high | 18 | This removes the largest remaining authored-field gap across every canonical packet type and directly addresses the most repeated `orphan_field` cluster from iteration 003. |
| 2 | Split operational/save-time guards out of "template coverage" reporting | Indirectly all 6 canonical packet docs, plus 6 operational-only rules | high | 18 | It does not add validation, but it removes the biggest classification-noise source: six rules currently distort template-coverage reporting even though they target runtime payloads or generated artifacts. |
| 3 | Document `TEMPLATE_SOURCE` as a first-class live rule in help, README, and packet prompt surfaces | 6/6 canonical packet docs | medium | 12 | The direct blast radius is broad, but the mismatch is a single live-rule omission rather than a whole field family. This is high leverage and cheap, but narrower than rank 1 and 2 in structural payoff. |
| 4 | Add semantic validation for continuity bookkeeping (`completion_pct`, `open_questions`, `answered_questions`) | 1 canonical packet doc (`implementation-summary.md`) | medium | 2 | Real gap, but its authored surface is narrow compared with the shared-frontmatter contract and the reporting-noise proposals above. |

## Proposal Classification

| Proposal | Classification | Reasoning |
| --- | --- | --- |
| Document `TEMPLATE_SOURCE` in help + README + prompt inventory | `quick-win` | Low-LoC documentation and inventory sync. It changes published operator surfaces without altering validator behavior. |
| Add semantic validation for shared frontmatter fields | `medium` | Requires a new validator rule or extension of existing TypeScript validation, plus tests/docs/help updates. |
| Add semantic validation for continuity bookkeeping | `medium` | Also requires script/TypeScript validation changes, but limited to one authored packet type. |
| Split operational/save-time guards out of template-coverage reporting | `major` | Requires redesign of how the validator/review workflow groups and reports rule families so audits stop conflating authored-template checks with runtime-only guards. |

## Dependency Chains

1. `TEMPLATE_SOURCE` inventory sync should land before any broader surface redesign because it fixes a known false mismatch in the published rule inventory and gives reviewers a cleaner baseline.
2. The operational/template reporting split should land before adding new semantic validators if the goal is audit clarity first. Otherwise new validators will be measured against a still-misaligned reporting taxonomy.
3. Shared-frontmatter semantic validation should land before continuity-bookkeeping validation because the continuity fields are a narrower subset of the same "frontmatter semantics are under-validated" problem.
4. Continuity-bookkeeping validation is last-mile work once the broader authored-frontmatter contract and reporting model are stable.

## New Findings

- No new P0/P1/P2 findings were evidenced in this iteration.
- No current evidence supports elevating `P1-001` to `P0`. The mismatch remains serious for maintainability and operator trust, but the reviewed evidence still points to audit/reporting drift rather than destructive data loss, packet corruption, or release-blocking runtime failure.

## Verdict

- `CONDITIONAL`

The remediation backlog now has a defensible maintainability order: two broad-scope changes attack the largest noise sources, one quick documentation sync removes a recurring false mismatch, and one narrow semantic gap can safely wait. The packet is not converged yet because the ranking still needs traceability validation against representative packet outcomes.

## Next Dimension

- `traceability`
- Planned focus: test the ranked proposals against real warning clusters from representative packets so the next iteration can confirm whether the maintainability scores match observed operator pain.
