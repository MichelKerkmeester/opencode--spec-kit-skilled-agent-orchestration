# Deep-Research SYNTHESIS — 007 MCP Runtime Improvement

## CONTEXT

10 deep-research iterations have completed for the 007 packet investigating MCP runtime root causes for memory layer, code graph, cocoindex, and intent classifier defects from 005 + 006 findings. Convergence achieved: ratios trended 0.86 -> 0.82 -> 0.68 -> 0.74 -> 0.70 -> 0.46 -> 0.64 -> 0.67 -> 0.64 -> 0.42. All 8 sub-questions answered.

## TASK

Compile the canonical `research.md` synthesis output from all iteration files plus deltas plus findings registry. Use the standard 17-section template at `.opencode/skill/system-spec-kit/templates/research.md` adapted for an MCP-runtime-improvement research packet (not a Webflow component, so adapt section content to match: API/Markup/CSS sections become protocol/handler/contract sections; etc.).

## SOURCES (READ ALL)

- Iteration files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/iterations/iteration-001.md` through `iteration-010.md`
- Delta files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deltas/iter-001.jsonl` through `iter-010.jsonl`
- Findings registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deep-research-strategy.md`
- State log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl`
- Spec doc: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/spec.md`

## OUTPUT

Write to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/research.md`

## REQUIRED STRUCTURE

Adapt the 17-section template from `.opencode/skill/system-spec-kit/templates/research.md` for runtime-systems research. Sections:

1. Metadata (Research ID = RESEARCH-007, Status = Complete, Date = 2026-04-27)
2. Investigation Report (Request Summary, Current Behavior, Key Findings × 8 = one per Q1-Q8, Recommendations summarized)
3. Executive Overview (Summary, Architecture diagram of MCP runtime touchpoints, Quick reference)
4. Core Architecture (memory layer, code graph, cocoindex, causal graph, intent classifier — components + data flow + integration points)
5. Technical Specifications (per-question: contract changes, handler changes, recovery field shapes)
6. Constraints & Limitations (which fixes are read-only-research vs require runtime mutation, daemon rebuild + restart cost)
7. Integration Patterns (how cli-codex / cli-copilot / cli-opencode interact with these layers; cross-CLI consistency)
8. Implementation Guide (high-level "what to change" — handler X, helper Y, schema field Z; include code-level paths from iteration evidence)
9. Code Examples (snippets showing recommended fix patterns from iteration findings — actual file paths, line ranges)
10. Testing & Debugging (regression coverage gaps identified, recommended new tests)
11. Performance Optimization (token-budget telemetry, scan latency, dedup over-fetch sizing)
12. Security Considerations (path canonicalization preventing data leakage via mirror aliases, refusal-policy guardrails preventing hallucinated citations)
13. Future-Proofing (Phase C/D backlog for runtime fixes, packet ordering by blast radius)
14. API Reference (memory_context, memory_search, code_graph_query, recovery payload — current vs recommended schema)
15. Troubleshooting Guide (per-question failure modes from iterations + solutions)
16. Acknowledgements (cli-codex executor, cli-opencode + cli-copilot for live probes, prior packets 005/006)
17. Appendix (glossary, related research = 005 + 006, change log)

PLUS mandatory:
- **Eliminated Alternatives** section (after Section 11, before Section 12) — table of approaches considered but ruled out, citing iteration evidence
- **Open Questions** section (Section 12 placement per loop_protocol.md) — list any residual gaps beyond the 8 originals

## SECTION 11 RECOMMENDATIONS (TOP 5)

Surface the top 5 cross-cutting recommendations prominently in Section 2 (Recommendations) AND Section 11 (or wherever Recommendations land). These should be the highest-leverage Phase C remediations spanning Q1-Q8.

## CONSTRAINTS

- Read-only investigation; do not mutate mcp_server source. Cite file paths + line numbers from iteration evidence.
- Do not include filler/placeholders — only real findings from iteration files.
- Each Key Finding (Section 2) must reference its Q-number (Q1 through Q8).
- Sections that have no real content (e.g., Browser Compatibility — irrelevant for this packet) may be marked "N/A — runtime-systems research".
- Keep total length to ~600-1000 lines.

## ALSO

Append to state log: `{"type":"event","event":"synthesis_complete","totalIterations":10,"answeredCount":8,"totalQuestions":8,"stopReason":"converged","timestamp":"<ISO8601>"}`

Update config.status to "complete" by editing `deep-research-config.json` field `"status":"complete"`.

Begin synthesis now.
