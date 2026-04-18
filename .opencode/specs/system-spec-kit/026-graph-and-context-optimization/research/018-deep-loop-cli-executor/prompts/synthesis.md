# Deep-Research Synthesis Prompt

You are generating the final research.md deliverable for the 30-iteration deep-research session on Phase 017 refinements.

## Context

- All 30 iteration narratives live at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/iterations/iteration-001.md` through `iteration-030.md`.
- State log with per-iteration JSONL deltas (status, focus, newInfoRatio, graphEvents) lives at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-state.jsonl`.
- Strategy doc (topic, key questions, non-goals, stop conditions) lives at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-strategy.md`.
- Stop reason: `max_iterations_reached`. Convergence ratios bounced between 0.04 and 0.10 in the final 15 iterations; did not produce 3 consecutive below 0.05.

## Output

Write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/research.md` — the canonical 17-section deep-research synthesis per `sk-deep-research` convention.

Required sections (each as `## N. TITLE` H2):

1. **EXECUTIVE SUMMARY** — 3-5 sentences: what was researched, headline conclusions, recommended next step.
2. **TOPIC** — verbatim from strategy.md.
3. **KEY QUESTIONS** — the 10 from strategy.md, each marked `[answered]`, `[partial]`, or `[ruled-out]` with a one-line conclusion.
4. **METHODOLOGY** — how the 30-iteration loop ran (native vs cli-codex, executor config, convergence criteria, file-based state).
5. **FINDINGS BY SEVERITY** — P0/P1/P2 findings, each with: claim, evidence refs (iteration numbers + file paths), confidence, remediation sketch. Aim for ~10-20 findings total.
6. **PER-QUESTION DEEP DIVE** — for each of the 10 key questions, summarize what was established across all iterations that touched it.
7. **CROSS-CUTTING THEMES** — themes that emerged spanning multiple questions (e.g., "policy-driven vs empirical thresholds", "preserve-on-regen gaps", "contract-first vs runtime-first").
8. **NEGATIVE KNOWLEDGE** — ruled-out directions, dead ends, conclusively-not-the-case items.
9. **GRAPH EVENTS SUMMARY** — aggregated nodes + edges from all iterations' `graphEvents` arrays. Produce a compact causal map of question-to-finding relationships.
10. **REMEDIATION CANDIDATES FOR PHASE-019+** — concrete, prioritized list of actions, each with: priority (P0/P1/P2), scope, est effort, dependency chain. This is the Phase-019+ scoping deliverable.
11. **ATOMIC-SHIP GROUPS** — which remediation candidates must ship together (file-collision groups, contract-dependency groups).
12. **VERIFICATION CHECKLIST** — what to check after each remediation (tests, validators, commits).
13. **OPEN QUESTIONS** — what the 30-iteration pass did NOT resolve; residual investigation suggestions.
14. **LIMITATIONS & BIASES** — constraints of this run (sandbox limits, validator EPERM issues, test-suite execution gaps, model biases).
15. **INTEGRATION GAPS WITH EXISTING ROADMAP** — where these findings connect or conflict with Phase 018/019 shipped work.
16. **TRACEABILITY TABLE** — question → iterations → findings → remediation candidates. Many-to-many mapping.
17. **NEXT STEPS** — concrete first actions the user should take. Order-of-operations with decision points.

## Output style

- Write for a technical reader who will use this to scope Phase-019+ work.
- Every claim needs a citation (`[iter-NNN:path/to/file.md#section]` or `[file-path:line-range]`).
- No em dashes, no Oxford commas, no semicolons.
- Short paragraphs, scannable bullets, tables where helpful.
- Do NOT reproduce full iteration content; synthesize and link.

## Process

1. Read ALL 30 iteration files (they're short; each ~30-80 lines).
2. Read the JSONL state log to build the finding/graph-event aggregate.
3. Read strategy.md for the 10 questions and topic charter.
4. Write `research.md` in the 17-section shape above.
5. Verify the file exists with `wc -l research.md` at the end.

## Output contract

Produce ONLY the file `research.md`. No additional JSONL updates (this is synthesis, not an iteration).

Final line of your stdout output: `SYNTHESIS_STATUS: OK | PATH: <absolute-path-to-research.md> | LINES: <line-count>`
</content>
</invoke>
