# Deep Research Iteration 2 of 10

You are operating as the @deep-research agent in a single iteration of a 10-iter loop. Your job is to produce ONE iteration's worth of focused investigation, write findings to disk, and stop.

## RESEARCH TOPIC

Apply the testing methodology from packet 059 (`@code` stress-test campaign documented in `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md`) to evaluate and produce concrete improvement recommendations for the **sk-improve-agent triad**:

- `.opencode/skill/sk-improve-agent/SKILL.md` (463 lines)
- `.opencode/agent/improve-agent.md` (246 lines)
- `.opencode/command/improve/agent.md` (456 lines)

Plus the secondary surface: `references/` (12 docs), `scripts/` (14 .cjs), `assets/` (6 items) under sk-improve-agent.

This packet is RESEARCH-ONLY. Do NOT modify any source files in the triad. You may read freely, write to /tmp/ for scratch work, and write your iteration findings to `research/iterations/iteration-002.md`.

## RESEARCH QUESTIONS

- **RQ-1** — Does sk-improve-agent have an analog of "stress-test the failure paths"? If not, what would it look like?
- **RQ-2** — Where in the improve-loop does an active Critic challenge live, vs reactive anti-pattern reference text?
- **RQ-3** — Do sk-improve-agent's 14 scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?
- **RQ-4** — Does the candidate-scoring pipeline test across multiple models for attribution discipline?
- **RQ-5** — What does Call A (baseline improve attempt) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?
- **RQ-6** — When sk-improve-agent improves an agent that lives in 4 runtime mirrors (.opencode/.claude/.gemini/.codex), does it know to mirror the patch?
- **RQ-7** — Are the 5 legal-stop gates (contractGate / behaviorGate / integrationGate / evidenceGate / improvementGate) actually grep-checkable from journal output, or LLM-judge-based?

## METHODOLOGY REFERENCE

The 059 test-report.md §9 lessons-learned (read it fully if you haven't):
- L1: Single-task structural tests are insufficient
- L2: Anti-patterns alone are reactive; Critic challenges are preventive
- L3: Audit transcripts for tool-routing fidelity, not just RETURN field presence
- L4: Multi-model baseline matters for attribution
- L5: `skill(X)` invocation is not equivalent to applying X's protocol

Plus the 059 framework lessons (same-task A/B, sandbox discipline, grep-only signals, multi-round score progression 5/2/1 → 6/2/0 → 8/0/0).

## PRIOR ITERATION FINDINGS

The following are structured summaries from prior iterations. Read them carefully — your job is to ADD NEW findings, not duplicate prior ones. Mark RQs as ANSWERED only when prior + your iteration's evidence is strong enough.

### Iteration 1 summary (excerpt)

---
iteration: 1
date: 2026-05-02T09:06:41Z
focus_rqs: []
new_findings_count: 0
rqs_now_answerable: []
convergence_signal: yes
---

# Iteration 1 — DISPATCH FAILED

Copilot exit code 0; output not written to expected path.

See `run-log.txt` for transcript.

---


## YOUR TASK THIS ITERATION

1. Focus on RQs that are still open or under-evidenced (see prior findings above)
2. Read the relevant target files (cite specific file:line ranges)
3. For each finding, prefer **specific evidence** over general assertions
4. Write your iteration findings to `research/iterations/iteration-002.md` using the EXACT structure below
5. Stop after writing — do not continue investigating beyond this iteration

## OUTPUT FORMAT (write to research/iterations/iteration-002.md)

```markdown
---
iteration: 2
date: 2026-05-02T09:06:41Z
focus_rqs: [list of RQ IDs you addressed this iteration]
new_findings_count: [integer]
rqs_now_answerable: [list of RQ IDs you believe are now answerable]
convergence_signal: [yes/no — yes if you found nothing genuinely new beyond prior iterations]
---

# Iteration 2

## Focus

[1-2 sentences: which RQs you targeted and why, given prior findings]

## Method

[2-3 sentences: which files you read, what you grepped for, what you traced]

## Findings

### RQ-X: [Question text abbreviated]

[Evidence with file:line citations. State definitively whether the RQ is answered or remains open.]

### RQ-Y: ...

(repeat for each RQ you addressed)

## New Open Questions

[Anything you uncovered that wasn't in the original 7 RQs]

## Ruled Out

[Approaches you investigated and ruled out, with reasons]

## Sketched Diff (if any)

[For target file X.md at section §N or ANCHOR:foo, propose a specific diff. Be concrete — quote the current text and the proposed text.]

## Sketched Stress-Test Scenario (if any)

[If you can sketch a CP-XXX scenario this iteration, do so following CP-027/CP-028 format from 059.]

## Next Focus Suggestion

[Recommend what iteration 3 should focus on, given what's now answered vs still open]

## Convergence Assessment

[Did this iteration add genuinely new value? Or did it largely confirm prior findings? Use that to set convergence_signal in frontmatter.]
```

## CONSTRAINTS

- Read-only on the triad (no edits to SKILL.md, improve-agent.md, /improve:agent.md, scripts, references, or assets)
- Write only to `research/iterations/iteration-002.md`
- Stay within ~10 minutes of compute and ~12 tool calls per the deep-research budget
- Cite file:line ranges, don't assert without evidence
- If you find nothing genuinely new beyond prior iterations, set `convergence_signal: yes` in frontmatter — the loop will stop early
- DO NOT re-read the entire sk-improve-agent triad if you can target your reads. Be surgical.
