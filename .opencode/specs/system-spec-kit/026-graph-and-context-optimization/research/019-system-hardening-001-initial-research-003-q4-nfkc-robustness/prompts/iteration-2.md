# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/019-system-hardening-001-initial-research-003-q4-nfkc-robustness/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 18
Last 2 ratios: N/A -> 0.78 | Stuck count: 0
Iter 1 found: Gate 3 + shared-provenance use **same** normalization chain (NFKC + hidden-char-strip + NFD-mark-strip + confusable-fold), but **trigger-phrase-sanitizer differs** — surface mismatch that could allow bypass. Read iteration-001.md for full details.

Iteration: 2 of 18
Focus Area: Q2 bypass constructions. Build concrete proof-of-concept strings that exploit the surface mismatch:
- Inputs that trigger-phrase-sanitizer passes but Gate 3 / shared-provenance reject (or vice versa)
- Inputs that contain visually-identical-to-dangerous tokens after one surface's normalization but not the other's
- Try: fullwidth Latin, ligatures (ﬀﬁﬂ), mathematical alphanumerics, Cyrillic/Latin lookalikes, hidden chars (ZWJ/ZWNJ/ZWSP/BOM), combining marks.

Also start Q3 on `sanitizeRecoveredPayload`: read the function, identify its normalization + downstream Zod validation. Can an attacker payload pass sanitization then pass/fail validation unexpectedly?

Remaining Key Questions:
- Q1 (iter 1 partial): Character class catalogue underway
- Q2 (active focus): Bypass constructions on surface mismatch
- Q3 (active): sanitizeRecoveredPayload + Zod chain
- Q4 (blocked): round-trip
- Q5 (blocked on findings)

## STATE FILES

- Config/state/strategy/registry: same as iter 1
- Prior iteration: iterations/iteration-001.md (read first)
- Write findings to: `iterations/iteration-002.md`
- ALSO write `deltas/iter-002.jsonl` with structured records (iteration + finding + edge + ruled_out if any)

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Practical bypasses → P0 finding (set blocker, halt signal).
- Keep exploit payloads in local `research/` tree — NEVER publish externally.
- APPEND JSONL delta to state log AND write per-iteration delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-002.md` with Focus, Actions, PoC Bypass Constructions (with severity), Q3 Progress, Next Focus.
2. JSONL delta APPENDED to state log.
3. `deltas/iter-002.jsonl` structured delta file.
