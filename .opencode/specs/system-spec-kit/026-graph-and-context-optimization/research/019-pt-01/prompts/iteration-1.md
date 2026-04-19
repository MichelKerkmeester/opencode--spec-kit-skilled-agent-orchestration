# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/019-system-hardening-001-initial-research-004-description-regen-strategy/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 1 of 12
Questions: 0/5 answered | Last focus: none
Research Topic: description.json rich-content preservation under canonical-save regen. 4 strategy candidates. 86 description.json files + 29 "rich" subset per 018 research.md §5. Interacts with P0 #2 from sub-packet 001 (save_lineage writeback bug in same regen path).

Iteration: 1 of 12
Focus Area: Read `generate-description.ts` regen logic + auto-fill points. Scan 20+ description.json files for initial field catalogue. Tag fields "always derived" vs "can be authored".

Remaining Key Questions:
- Q1: Field catalogue (derived vs authored)
- Q2: Best strategy among 4 candidates
- Q3: Authored-content patterns in 29 rich files
- Q4: Interaction with 018 R4 description-repair-helper
- Q5: Concrete implementation

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-004-description-regen-strategy/deep-research-config.json
- State Log: .../deep-research-state.jsonl
- Strategy: .../deep-research-strategy.md
- Registry: .../findings-registry.json
- Deltas dir: .../deltas/
- Write findings to: .../iterations/iteration-001.md

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Focus iter 1 on current main source + field sample. No strategy evaluation yet.
- IMPORTANT: APPEND JSONL delta to state log at end (`echo '...' >> ...jsonl`).
- ALSO write per-iteration delta JSONL to `.../deltas/iter-001.jsonl` with structured records: iteration, finding, invariant, edge, etc. (matching 016 pattern).

## OUTPUT CONTRACT

1. `.../iterations/iteration-001.md` with Focus, Actions, Field Catalogue Draft, Next Focus.
2. JSONL delta APPENDED to state log.
3. `.../deltas/iter-001.jsonl` with structured per-iteration delta (iteration record + finding records + any other structured records).
