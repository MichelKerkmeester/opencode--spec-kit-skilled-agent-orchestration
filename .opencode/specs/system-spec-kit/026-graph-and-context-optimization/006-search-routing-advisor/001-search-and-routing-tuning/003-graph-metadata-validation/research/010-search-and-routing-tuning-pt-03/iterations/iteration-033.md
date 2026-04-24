# Iteration 33: Manual Entity Sample and Residual Anomalies

## Focus
Validate the post-dedup entity output with a random sample and inspect the remaining suspicious names one by one.

## Findings
1. A 50-entity random sample across 10 folders came back clean: `0` duplicate names, `0` newline-bearing names, `0` version tokens, and `0` slash-joined or command-like names in the sample. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The single `python` anomaly comes from code-fence language capture in `skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync`, not from key-file seeding. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/spec.md:52-53] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/graph-metadata.json:133]
3. The two `README.md / ARCHITECTURE.md` anomalies come from heading extraction in the 017 and 018 doc-alignment packets, where slash-joined surface labels are being retained as heading entities. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/005-doc-surface-alignment/graph-metadata.json:101-110] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/004-doc-surface-alignment/graph-metadata.json:93-102]
4. The residual entity problems are therefore narrow and extraction-specific: code-fence language tokens and combined heading labels. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Opening another broad entity-cleanup wave before checking whether the remaining suspicious rows were just a handful of concrete extraction artifacts.

## Dead Ends
- None. The anomaly set was small enough that every surviving row could be traced back to a concrete doc pattern.

## Sources Consulted
- 50-entry random entity sample over `/tmp/phase019-research2/entity-sample.tsv`
- `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/005-doc-surface-alignment/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/004-doc-surface-alignment/graph-metadata.json`

## Assessment
- New information ratio: `0.10`
- Questions addressed: `PVQ-4`
- Questions answered: `PVQ-4`

## Reflection
- What worked and why: the random sample made it clear that the entity problem space is now tiny and specific rather than broad and systemic.
- What did not work and why: without tracing the anomalies back to source docs, it would have been easy to mislabel them as residual key-file contamination.
- What I would do differently: add extraction-level guards for fenced-language tokens and slash-joined headings while the context for those two patterns is still fresh.

## Recommended Next Focus
Collapse the structural, status, key-file, entity, and freshness results into one heuristic health score and identify the smallest useful next improvement phase.
