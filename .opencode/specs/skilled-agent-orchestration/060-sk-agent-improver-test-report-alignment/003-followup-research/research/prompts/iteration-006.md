# Deep Research Iteration 6 of 10 — packet 060/003

You are operating as the @deep-research agent in a single iteration of a 10-iter loop. Your job is ONE iteration of focused investigation, write findings to disk, stop.

## CRITICAL: OUTPUT PATH

Write your iteration findings to this EXACT path (use this absolute-from-repo-root path; do NOT use a relative path like `research/iterations/...` because copilot resolves that to repo root and creates strays):

`.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-006.md`

The full absolute path is:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-006.md`

## RESEARCH TOPIC

Followup research on 060/002 R1 results. Phase 002 just shipped: 6 P0/P1 diff sketches applied to sk-improve-agent triad, 6 CP-XXX scenarios authored, R1 stress run scored 0 PASS / 2 PARTIAL / 4 FAIL with a meta-finding (test-layer-selection: the 059 prepend-agent-body pattern works for body-level discipline like @code, breaks for command-orchestrator-level discipline like @improve-agent which is intentionally proposal-only per ADR-001).

Now: given those R1 results + the meta-finding, **how do we further improve sk-improve-agent + the testing methodology + downstream packets?**

## RESEARCH QUESTIONS

- **RQ-1** Of the 6 P0/P1 diffs already applied in 060/002, which would meaningfully improve under further iteration vs which are functionally complete as shipped?
- **RQ-2** What's the EXACT dispatch shape for 063's Call B? (`/improve:agent <target> :auto --spec-folder=...`, or YAML-step-by-step, or something else?)
- **RQ-3** What grep contract should 063's Call B verdict use? List specific journal events + artifact paths + script invocation traces with file:line evidence.
- **RQ-4** Which OTHER meta-agents in the system share @improve-agent's command-orchestrator pattern (discipline in command, not body)? Read each `.opencode/agent/*.md` and classify body-level vs command-level. Candidates: @write, @improve-prompt, @debug, @deep-research, @deep-review, @context, @orchestrate, @review.
- **RQ-5** Are there gaps in 060/001's research that R1 surfaced (i.e. things the 854-line synthesis missed that the actual stress run revealed)?
- **RQ-6** What's the right rubric for grading meta-agent stress tests? Should the 5-dim Coder Acceptance Rubric (from 059) be adapted, or is a different shape needed for command-orchestrator agents?
- **RQ-7** How do we generalize the test-layer-selection finding into a reusable template? What questions should a future packet author ask BEFORE authoring CP-XXX scenarios for any new agent?

## PRIMARY EVIDENCE TO READ

1. `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md` — R1 narrative + meta-finding (the source of the puzzle)
2. `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md` — verdict table
3. `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt` — full transcripts (large file; grep don't cat)
4. `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md` — 854-line synthesis (look for what R1 disagreed with)
5. `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md` (and 014-018) — the actual CP-040..CP-045 scenario specs
6. Modified source files (state after 002): `.opencode/agent/improve-agent.md` + 3 mirrors, `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/skill/sk-improve-agent/scripts/{scan-integration,score-candidate}.cjs`, `.opencode/command/improve/assets/improve_improve-agent_{auto,confirm}.yaml`
7. For RQ-4: `.opencode/agent/{write,improve-prompt,debug,deep-research,deep-review,context,orchestrate,review,code}.md`

## PRIOR ITERATION FINDINGS

The following are prior iterations' summaries. ADD NEW value, don't duplicate. If RQ-X already has strong evidence, deepen it or move to under-answered RQs.

- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-001.md` (read frontmatter + Findings sections)
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-002.md` (read frontmatter + Findings sections)
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-003.md` (read frontmatter + Findings sections)
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-004.md` (read frontmatter + Findings sections)
- `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-005.md` (read frontmatter + Findings sections)

## YOUR TASK THIS ITERATION

1. Read prior iteration files listed above (frontmatter + key sections; don't re-read everything)
2. Identify highest-leverage gap: which RQ has weakest evidence, OR what cross-cutting insight has no iteration captured yet
3. Read targeted files (be surgical; don't dump the whole codebase into context)
4. Write findings to `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-006.md` using the EXACT structure below
5. Stop after writing

## OUTPUT FORMAT

```markdown
---
iteration: 6
date: <ISO 8601 now>
focus_rqs: [list]
new_findings_count: <int>
rqs_now_answerable: [list]
convergence_signal: <yes|no>
---

# Iteration 6

## Focus
[1-2 sentences]

## Method
[2-3 sentences]

## Findings

### RQ-X: [abbrev]
[Evidence with file:line citations]

(repeat per RQ addressed)

## New Open Questions
[Any uncovered]

## Ruled Out
[With reasons]

## Sketches (if any)
[Concrete artifacts: 063 spec sketch, rubric template, etc.]

## Next Focus Suggestion
[For iteration 7]

## Convergence Assessment
[Did this add real new value? Set convergence_signal accordingly.]
```

## CONSTRAINTS

- Read-only on the codebase (no edits this packet)
- Write only to `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-006.md` (the absolute-from-repo-root path)
- ~10 minutes, ~12 tool calls budget
- Cite file:line ranges
- If nothing genuinely new: `convergence_signal: yes` — loop will stop early
