# Deep-Research Synthesis Pass

You are completing a 10-iteration deep-research loop comparing external SPAR-Kit (jed-tech, npm @spar-kit/install Beta1, Specify→Plan→Act→Retain) at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/` against internal `system-spec-kit` (`.opencode/skill/system-spec-kit/SKILL.md`, templates/, `.opencode/command/spec_kit/`, `.opencode/command/memory/`, `.opencode/command/create/`, `.opencode/agent/`).

## Read state
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-001.md` … `iteration-010.md` (whichever exist)
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-strategy.md`

## Write
**`.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/research.md`** with the canonical 17-section template:

1. Title + frontmatter (title, description, sessionId, generation, completedAt)
2. Executive Summary (3-5 bullets, headline findings + adoption verdict counts)
3. Research Charter (topic, axes covered, success criteria — copy from spec.md §3 In Scope)
4. Methodology (10 cli-codex/gpt-5.5/high/fast iterations, fresh context, externalized state)
5. Coverage Map (per-axis: # findings, evidence depth, gaps)
6. Findings Index (table: ID | Axis | Verdict tag | Title | Risk | Follow-on packet)
7. Detailed Findings — one subsection per finding. For each:
   - **Verdict**: `adopt-as-is` | `adapt` | `inspired-by` | `reject-with-rationale`
   - **Axis**: 1-6
   - **Description** (2-3 paragraphs)
   - **Evidence** (bullet list — cite ≥1 path in external/ AND ≥1 path in internal surface)
   - **Adoption Risk** (low/med/high + 1 sentence)
   - **Follow-on Packet**: `058-<slug>` etc. with 1-2 sentence scope
8. Cross-cutting Themes (3-5 patterns spanning multiple axes)
9. Reject-with-rationale Section (consolidated list with reasons)
10. Adoption Roadmap (suggested ordering of follow-on packets, dependencies between them)
11. Open Questions Resolved (Q1-Q8 from spec.md §10, each with a decisive answer or "deferred to packet 058-X")
12. Open Questions Remaining (anything still unanswered, with reason)
13. Negative Knowledge / Ruled-out Directions
14. Risks to Adoption (cross-cutting — sync triad, hook contracts, ~800 spec folder migration, advisor scoring)
15. Out of Scope For This Research (and where each lands)
16. Verification Hooks (commands to validate findings post-adoption)
17. References (every cited path, both external/ and internal/)

10-20 ranked findings minimum. Each tagged + cited (both surfaces) + with follow-on packet.

Also write **`.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/resource-map.md`** — a lean ledger of every external/ AND internal path cited in research.md, grouped by surface and category.

When done, append a single record to `deep-research-state.jsonl`:
```json
{"type":"event","event":"synthesis_complete","timestamp":"<ISO>","artifacts":["research.md","resource-map.md"]}
```

DO NOT dispatch sub-agents. You are running as cli-codex on this single pass.
