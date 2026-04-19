# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E**. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 6 of 18
Last 3 ratios: 0.52 -> 0.34 -> 0.27 | Stuck count: 0 | Rolling avg: 0.377
All 5 questions substantively answered. 6 hardening proposals + 10 threat inventory items ready for synthesis.

Iteration: 6 of 18
Focus Area: Write `research.md` synthesis draft (200-300 lines) consolidating all iter 1-5 findings. Sections:

1. **Executive Summary** (300 words): scope, 6 hardening proposals, 10 threat inventory, severity ceiling (P1, no P0 with strong evidence), recommended implementation order, handoff target.

2. **Surface Map**: NFKC call sites + normalization chain differences (Gate 3 vs shared-provenance vs trigger-phrase-sanitizer + sanitizeRecoveredPayload).

3. **Bypass Inventory** (≥10 concrete constructions): input string class, affected surface, severity, downstream impact.

4. **Hardening Proposals** (6 ranked): per proposal — name, target surface, mitigation, severity, cost (S/M/L), compat.

5. **Severity Analysis**: why P1 ceiling (no shell/file/SQL sink per iter 4 Q3-S1). Amplifiers that could escalate to P0 if future code adds sinks.

6. **Round-Trip Stability** (Q4 outputs): ZWJ/ZWNJ stable, fullwidth colon folds, combining marks stable, Node ICU version implications.

7. **Recommended Implementation Order** + handoff target.

8. **Open Questions / Out of Scope**.

## STATE FILES

- Prior: iter 1-5 (MUST read)
- Write synthesis to: research.md (NEW)
- Write iter delta to: iterations/iteration-006.md
- Write deltas/iter-006.jsonl
- APPEND `"type":"iteration"` to state log

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Use `"type":"iteration"` exactly.
- If synthesis reveals no new info, newInfoRatio should be < 0.15 (convergence).

## OUTPUT CONTRACT

1. research.md (synthesis)
2. iterations/iteration-006.md
3. JSONL appended to state log
4. deltas/iter-006.jsonl
