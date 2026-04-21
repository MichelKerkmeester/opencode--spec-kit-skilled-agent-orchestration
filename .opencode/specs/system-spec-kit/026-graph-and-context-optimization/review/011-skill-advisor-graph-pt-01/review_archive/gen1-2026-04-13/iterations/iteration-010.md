# Iteration 010: D3 Traceability - regression fixture audit

## Focus
D3 Traceability - verify the regression fixture accuracy for `P1-GRAPH-001/002/003` and audit whether the packet's "fixed 3 wrong expectations" claim is actually evidenced.

## Verified claims
- `P1-GRAPH-001` matches the live router. The fixture expects `mcp-figma`, the playbook says the direct Figma match must stay top-1 while `mcp-code-mode` appears via `!graph:depends`, and the current analyzer still behaves that way. [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:42] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:193] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:120-127] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1512-1514]
- `P1-GRAPH-002` also matches the live router. The fixture allows either `sk-code-review` or `sk-code-opencode` on top, while the playbook only requires both overlays to appear with visible `!graph:enhances` evidence; the current analyzer returns `sk-code-review` first and `sk-code-opencode` second, which satisfies both contracts. [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:43] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:194] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/002-enhances-overlay.md:29-30] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:100-108] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1512-1514]
- `P1-GRAPH-003` matches the current graph model. `mcp-clickup` still declares `mcp-code-mode` as a `depends_on` prerequisite, and the current analyzer keeps `mcp-clickup` top-1 while surfacing `mcp-code-mode` as the graph-promoted companion. [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:44] [SOURCE: .opencode/skill/mcp-clickup/graph-metadata.json:7-12] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:120-127] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1512-1514]
- The canonical regression run still reports `44/44` passing with no GRAPH-case failures, so the three new graph-specific fixture rows are not stale expectations.

## Findings

### P1 - Required
- **F090**: The packet claim that the regression fixture "fixed 3 wrong expectations" is not traceable from repository evidence. The top-level implementation summary, the Phase 001 implementation summary, and the handover all repeat the claim, but the fixture path's visible git history in this repo is a single add commit (`a931525421`) that already contains the current 44-case dataset. Because no file in the packet names the three case IDs or preserves the old -> new expectation deltas, reviewers can confirm that the new `P1-GRAPH-*` rows match live behavior, but they cannot verify that the supposed three corrected expectations were genuine fixes rather than silent expectation rewrites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/implementation-summary.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/implementation-summary.md:93] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:91] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/handover.md:55]

## Ruled Out
- The three new graph-specific fixtures are not the source of drift: direct analyzer runs, the graph metadata, and the canonical regression harness all agree with their current expectations.

## Dead Ends
- Searching repo-local history for which three expectations were corrected only finds the fixture file's initial add commit, so the missing before/after provenance cannot be reconstructed from the current packet.

## Recommended Next Focus
Convergence / synthesis - either add the exact three corrected case IDs with old -> new expectation evidence, or remove/downgrade the unsupported "3 wrong expectations fixed" claim before treating D3 as closed.
