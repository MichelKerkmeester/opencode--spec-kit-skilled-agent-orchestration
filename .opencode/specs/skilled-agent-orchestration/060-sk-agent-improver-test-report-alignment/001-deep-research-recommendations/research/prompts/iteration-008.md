# Deep Research Iteration 8 of 10

You are operating as the @deep-research agent in a single iteration of a 10-iter loop. Your job is to produce ONE iteration's worth of focused investigation, write findings to disk, and stop.

## CRITICAL: OUTPUT PATH

Write your iteration findings to this EXACT path (use this absolute-from-repo-root path; do NOT use a path like `research/iterations/...` which would resolve to the repo root):

`.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-008.md`

The full absolute path is:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-008.md`

## RESEARCH TOPIC

Apply the testing methodology from packet 059 (`@code` stress-test campaign documented in `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md`) to evaluate and produce concrete improvement recommendations for the **sk-improve-agent triad**:

- `.opencode/skill/sk-improve-agent/SKILL.md` (463 lines)
- `.opencode/agent/improve-agent.md` (246 lines)
- `.opencode/command/improve/agent.md` (456 lines)

Plus the secondary surface: `references/` (12 docs), `scripts/` (13 .cjs — note: prior iteration found 13, not 14 as originally stated), `assets/` (6 items) under sk-improve-agent.

## RESEARCH QUESTIONS

- **RQ-1** — Does sk-improve-agent have an analog of "stress-test the failure paths"?
- **RQ-2** — Where in the improve-loop does an active Critic challenge live, vs reactive anti-pattern reference text?
- **RQ-3** — Do sk-improve-agent's ~13 scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?
- **RQ-4** — Does the candidate-scoring pipeline test across multiple models for attribution discipline?
- **RQ-5** — What does Call A (baseline) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?
- **RQ-6** — When sk-improve-agent improves an agent that lives in 4 runtime mirrors, does it know to mirror the patch?
- **RQ-7** — Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

## PRIOR ITERATION FINDINGS

Read these files first to understand what has already been answered:

- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-001.md`
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-002.md`
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-003.md`
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-004.md`
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-005.md`
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-006.md`
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-007.md`

Each prior iteration's frontmatter shows:
- `focus_rqs:` — which RQs that iteration addressed
- `rqs_now_answerable:` — which RQs are answerable from that iteration's evidence
- `convergence_signal:` — yes/no (yes = nothing genuinely new, no = real new value added)

Your job is to ADD NEW value, not duplicate prior findings. If iteration N already gave a definitive answer to RQ-X with strong evidence, don't re-answer RQ-X — instead either (a) deepen it with new evidence not yet cited, or (b) move to under-answered RQs, or (c) look for cross-cutting insights spanning multiple RQs.

## YOUR TASK THIS ITERATION

1. Read all prior iteration files listed above
2. Identify the highest-leverage gap: which RQ has the weakest evidence, OR what cross-cutting insight has no iteration captured yet
3. Read targeted files in the triad (don't re-read everything; be surgical)
4. Write your findings to `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-008.md` using the EXACT structure below
5. Stop after writing — do not continue investigating beyond this iteration

## OUTPUT FORMAT (write to .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-008.md)

```markdown
---
iteration: 8
date: <ISO 8601 now>
focus_rqs: [list of RQ IDs you addressed this iteration]
new_findings_count: <integer of NEW findings beyond prior iterations>
rqs_now_answerable: [list of RQ IDs you believe are now fully answerable from cumulative evidence]
convergence_signal: <yes if you found nothing genuinely new beyond prior iterations; no if you added real new value>
---

# Iteration 8

## Focus

[1-2 sentences: which RQs/gaps you targeted and why]

## Method

[2-3 sentences: which files you read, what you grepped, what you traced]

## Findings

### RQ-X: [Question]
[Evidence with file:line citations]

(repeat for each RQ you addressed)

## New Open Questions

## Ruled Out

## Sketched Diff (if any)

[Per target file at section §N or ANCHOR:foo, propose specific diff. Quote current text and proposed text.]

## Sketched Stress-Test Scenario (if any)

[CP-XXX format if applicable. Pick a number that doesn't conflict with prior iterations' suggestions.]

## Next Focus Suggestion

## Convergence Assessment

[Did this iteration add genuinely new value? Set convergence_signal accordingly.]
```

## CONSTRAINTS

- Read-only on the triad
- Write only to `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/research/iterations/iteration-008.md` (the absolute-from-repo-root path)
- Stay within ~10 minutes and ~12 tool calls
- Cite file:line ranges
- If nothing genuinely new: set `convergence_signal: yes` — the loop will stop early
- DO NOT re-read everything; target your reads based on prior findings
