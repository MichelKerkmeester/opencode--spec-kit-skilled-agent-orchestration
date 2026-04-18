# Deep-Research Iteration Prompt Pack — 005 routing-accuracy

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/019-system-hardening-001-initial-research-005-routing-accuracy/`. Proceed WITHOUT asking about spec folder — all file writes into that folder are pre-authorized.

**Autonomous-completion context**: This iteration is part of a continuous overnight run authorized by user directive 2026-04-18. Do NOT pause for confirmation. Do NOT ask A/B/C/D questions. Produce the three required artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 1 of 15
Questions: 0/8 answered | Last focus: none
Research Topic: Gate 3 classifier (`.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` / `classifyPrompt()`) + skill-advisor (`.opencode/skill/skill-advisor/scripts/skill_advisor.py`) routing accuracy. Build labeled corpus, compute per-router precision/recall/F1, enumerate false-positive classes, rank rule-change proposals.

Focus Area (iter 1): read + enumerate current routing surfaces. (a) `gate-3-classifier.ts` — extract positive trigger list, disqualifier list, edge cases, return schema. (b) `skill_advisor.py` — extract advisor algorithm (embedding vs phrase match), threshold logic, confidence scoring, skill registry source. (c) scan `.opencode/skill/*/SKILL.md` frontmatter to enumerate triggerPhrases of all skills. Output: complete enumeration as the foundation for corpus construction.

Remaining Key Questions:
- Q1: What is the labeled ground-truth corpus (size, composition, annotation protocol)?
- Q2: Gate 3 classifier verdicts (precision, recall, F1 per class)
- Q3: Skill-advisor top-1 picks (precision, recall, F1 per skill)
- Q4: False-positive token classes (analyze, decompose, phase)
- Q5: Joint Gate 3 × skill-advisor error rate
- Q6: Ranked rule-change proposals
- Q7: Simulated before/after delta per proposal
- Q8: Cost/latency trade-offs

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/iterations/iteration-001.md`
- Write per-iteration delta to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/deltas/iter-001.jsonl`

## CONSTRAINTS

- LEAF agent. Soft cap 9 tool calls, hard max 13.
- Focus iter 1 on enumeration only. No corpus labeling or classifier running yet.
- IMPORTANT: APPEND canonical JSONL record to state log at end (`echo '...' >> ...jsonl`).
  - The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant.
- ALSO write per-iteration delta JSONL to `.../deltas/iter-001.jsonl` with structured records (iteration record + finding + observation + ruled_out).
- Review target is READ-ONLY. Do not modify gate-3-classifier.ts or skill_advisor.py.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. `iterations/iteration-001.md` — narrative with Focus, Actions, Enumeration Results (Gate 3 rules, advisor algorithm, skill triggerPhrases catalogue), Questions Answered (even partial), Next Focus, Ruled Out (if any).

2. Canonical JSONL iteration record APPENDED to state log. Exact schema:
   ```
   {"type":"iteration","iteration":1,"newInfoRatio":0.92,"status":"in_progress","focus":"enumerate routing surfaces","findingsCount":0,"keyQuestions":8,"answeredQuestions":N,"timestamp":"2026-04-18T...","durationMs":NNN,"graphEvents":[]}
   ```
   Single-line JSON with newline terminator. Must land in the state log FILE, not stdout only.

3. `deltas/iter-001.jsonl` — per-iteration structured delta. One `{"type":"iteration",...}` record (same as state-log append) plus per-event records (one per finding, observation, ruled-out direction). Each record on its own JSON line.

All three artifacts REQUIRED. Missing or type-drift fails the validator.
