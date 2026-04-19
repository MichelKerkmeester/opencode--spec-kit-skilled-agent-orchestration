# Deep-Research Iteration Prompt Pack — 005 routing-accuracy iter 2

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to `026/research/019-system-hardening-001-initial-research-005-routing-accuracy/` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates, produce artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 2 of 15
Last Focus: enumerate routing surfaces (iter 1 complete — Gate 3 vocabulary + skill-advisor pipeline + 20-skill trigger catalogue)
newInfoRatio so far: 0.92 (iter 1)

Focus Area (iter 2): Build labeled corpus design and start population. (a) Define ~6 buckets (true write, true read-only, memory-save/resume, mixed/ambiguous, deep-loop prompts, skill-routing prompts) with target sizes (~30-40 each → 200 total). (b) Annotation protocol: gold labels for Gate 3 (triggers=[yes|no], reason_category) and skill-advisor (top_1_skill, correct=[yes|no]). (c) Source: synthetic edge cases modeled on CLAUDE.md false-positive tokens + real-looking prompts. Write 50-80 labeled prompts to `corpus/labeled-prompts.jsonl` in this folder (create the `corpus/` subdir). (d) Document corpus schema + annotation rules in iteration-002.md.

Remaining Key Questions: 8 total, 0 fully answered (Q4 partially progressed).

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/deep-research-config.json`
- State Log: `.../deep-research-state.jsonl` (APPEND to, use `"type":"iteration"` EXACTLY)
- Strategy: `.../deep-research-strategy.md`
- Registry: `.../findings-registry.json`
- Iter narrative: `.../iterations/iteration-002.md`
- Per-iter delta: `.../deltas/iter-002.jsonl`
- NEW: Corpus file: `.../corpus/labeled-prompts.jsonl` (create if not exists)

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Iter 2 focus: corpus design + initial ~50-80 labeled prompts. Don't run classifiers yet.
- REQUIRED canonical JSONL iteration record + delta file with `type="iteration"` records.

## OUTPUT CONTRACT

1. `iterations/iteration-002.md` — narrative: Focus, Actions, Corpus Design (buckets, annotation protocol, gold-label schema), Sample Labeled Prompts Summary (counts per bucket), Questions Answered, Next Focus (iter 3: populate to 200 + run Gate 3 on first 50 to sanity-check).

2. Canonical JSONL record APPENDED to state log:
   ```
   {"type":"iteration","iteration":2,"newInfoRatio":0.85,"status":"in_progress","focus":"corpus design + initial labeled prompts","findingsCount":0,"keyQuestions":8,"answeredQuestions":0,"timestamp":"2026-04-18T...","durationMs":NNN,"graphEvents":[]}
   ```

3. `deltas/iter-002.jsonl` — structured delta (iteration record + observations + corpus-design record).

All three required.
