# Iteration 001: correctness

## State Read

- Prior iterations considered: none; fresh review packet initialization
- Registry before pass: 0 open finding(s)
- Focus dimension: correctness

## Scope Reviewed

- spec.md
- plan.md
- tasks.md
- checklist.md
- implementation-summary.md
- description.json
- graph-metadata.json
- handover.md
- memory/13-04-26_18-25__completed-20-iteration-deep-review-via-gpt-5-4.md
- 001-research-findings-fixes/{spec,plan,tasks,checklist,implementation-summary}.md
- 002-manual-testing-playbook/{spec,plan,tasks,checklist,decision-record}.md
- 003-skill-advisor-packaging/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md
- Additional implementation and child packet evidence listed in `deep-review-strategy.md`

## Findings

### F001 [P0] Completed compiler validation gate is false in current repo state

Dimension: correctness

Evidence:
- Root checklist CHK-010 marks `skill_graph_compiler.py --validate-only` complete with evidence "VALIDATION PASSED".
- Current command `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only` exits 2 and reports ZERO-EDGE WARNINGS for `sk-deep-research` and `sk-git`.
- The same command discovers 21 skill graph-metadata files, so the failure is not from missing discovery.

Impact: The packet cannot honestly claim its P0 compiler gate complete; downstream agents following the checklist will get a hard validation failure.

Remediation: Either add legitimate graph edges for the orphan skills or intentionally downgrade zero-edge warnings so `--validate-only` exits 0, then update checklist evidence with the current command output.

### F003 [P1] Advisor health is degraded even though the packet only records graph-loaded success

Dimension: correctness

Evidence:
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health` returns `status: degraded`.
- The same output shows `skill_graph_loaded: true`, `skill_graph_source: sqlite`, and `inventory_parity.in_sync: false` because skill discovery reports 20 routable skills while the graph contains 21 nodes including `skill-advisor`.
- Root checklist CHK-020 only asserts `skill_graph_loaded: true`, missing the degraded health status.

Impact: Operators can see a passing checklist while the actual health surface is degraded, which weakens Gate 2 operational readiness.

Remediation: Decide whether `skill-advisor` should be included in health parity; then adjust parity logic or checklist criteria so health status is `ok` or explicitly accepted as degraded with rationale.

### F008 [P2] Parent plan still carries obsolete 20-skill and 2KB targets

Dimension: correctness

Evidence:
- Root plan Definition of Done says all 20 graph-metadata files pass validation and compiled graph is under 2KB.
- Root spec and implementation summary describe 21 graph metadata files and a 4667 byte compiled graph under the later 5KB target.
- Current `skill-graph.json` reports `skill_count: 21` and `wc -c` reports 4667 bytes.

Impact: This is not blocking by itself, but it causes repeated false positives during review and obscures the real acceptance threshold.

Remediation: Update the parent plan targets to 21 graph metadata files and the accepted current size budget, or record the 2KB target as a retired constraint.


## Dimension Assessment

The first pass focused on whether claimed acceptance checks still pass. The compiler validation gate is false today, health is degraded, and the parent plan still contains obsolete count and size targets.

Evidence highlights:
- Compiler validate-only exits 2 with zero-edge warnings for sk-deep-research and sk-git.
- Advisor health loads SQLite but reports `status: degraded` due inventory parity mismatch.
- Current graph JSON is 21 skills and 4667 bytes, while the parent plan still mentions 20 files and 2KB.

## Delta

- New finding IDs: F001, F003, F008
- Severity-weighted newFindingsRatio: 0.63
- Convergence note: New material finding(s) keep the loop active.
