# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/019-system-hardening-001-initial-research-004-description-regen-strategy/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 12
Last 2 ratios: N/A -> 0.76 | Stuck count: 0
Iter 1 catalogued initial fields across ~25 description.json files. Read iteration-001.md for context.

Iteration: 2 of 12
Focus Area: Q2 strategy evaluation + Q3 rich file audit. Two targeted tasks:

**Part A — Q3 rich file audit**:
Audit the 29 "rich" description.json files (those with authored content beyond template). Identify:
- Which fields they customize (description text? keywords? custom additions?)
- Pattern by packet type (research vs implementation vs archived)
- What gets lost under current regen behavior (iter 1 findings + prior classification)

Run a scan like: `find .opencode/specs -name description.json -exec node -e '...' \;` to identify files with non-template content.

**Part B — Q2 strategy comparison**:
Evaluate the 4 candidate strategies against the iter 1 field catalogue + Part A's rich-file patterns:
1. Opt-in regen flag — pro/con, migration cost
2. Hash-based change detection — pro/con, hash mgmt complexity
3. Schema-versioned authored layer — pro/con, schema migration
4. Field-level merge policy — pro/con, per-field bookkeeping

Produce a comparison matrix with migration cost, preservation reliability, complexity, backward compatibility, and a tentative recommendation.

Remaining Key Questions:
- Q1 (iter 1 partial): field catalogue underway
- Q2 (active): strategy comparison
- Q3 (active): rich file audit
- Q4 (iter 3+): 018 R4 interaction
- Q5 (iter 3+): concrete implementation

## STATE FILES

- Prior iteration: iterations/iteration-001.md (read first)
- Write findings to: iterations/iteration-002.md
- ALSO write `deltas/iter-002.jsonl` with structured records (iteration + finding + edge + ruled_out if any). codex already proved this works on iter 1.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- APPEND JSONL delta to state log.
- Write per-iteration `deltas/iter-002.jsonl` file.

## OUTPUT CONTRACT

1. iterations/iteration-002.md with Focus, Actions, Rich File Audit Results, Strategy Comparison Matrix, Tentative Recommendation, Next Focus.
2. JSONL delta APPENDED to state log.
3. `deltas/iter-002.jsonl` structured delta.
