# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E**. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 5 of 18
Last 3 ratios: 0.66 -> 0.52 -> 0.34 | Stuck count: 0 | Rolling avg: 0.507
Findings: Q2-F1 P1 (trigger-phrase mismatch), Q3-F1 P1 (shape-only validation), Q3-S1 severity bound (no shell/file/SQL sink). Round-trip stability mostly holds with known exceptions.

Iteration: 5 of 18
Focus Area: Complete hardening proposals + start synthesis draft.

**1. Finalize Q5 hardening proposals**:
Produce 5-7 concrete hardening proposals with:
- Proposal name
- Target surface (gate3 / shared-provenance / trigger-phrase-sanitizer / sanitizeRecoveredPayload / Zod schemas)
- Trigger/mitigation
- Severity of finding it addresses
- Implementation cost (S/M/L)
- Backward compatibility

**2. Residual-threat inventory**:
Build the ≥10 concrete attacker-construction inventory from iter 1-4 findings. Each construction: input string, which surface it bypasses, severity, mitigation mapping.

**3. Synthesis prep**:
Draft outline for `research.md` with sections (Executive Summary, Surface Map, Bypass Inventory, Hardening Proposals, Severity Analysis, Recommended Implementation Order, Open Questions).

Remaining Key Questions:
- Q1-Q4 substantively answered
- Q5 (finalize this iter)

## STATE FILES

- Prior: iter 1-4 (MUST read)
- Write findings to: iterations/iteration-005.md
- Write per-iter delta: deltas/iter-005.jsonl
- APPEND `{"type":"iteration"...}` to state log

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- **CRITICAL CONTRACT**: Use `"type":"iteration"` (exactly) in the state log append. NOT `"iteration_delta"`. The reducer counts `type === 'iteration'` only.

## OUTPUT CONTRACT

1. iterations/iteration-005.md
2. JSONL delta APPENDED to state log with `"type":"iteration"` exactly.
3. deltas/iter-005.jsonl
