# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/019-system-hardening-001-initial-research-003-q4-nfkc-robustness/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 3 of 18
Last 2 ratios: 0.78 -> 0.66 | Stuck count: 0
Iter 1 mapped surfaces, iter 2 confirmed **P1 bypass**: trigger-phrase-sanitizer keeps fullwidth/mathematical/zero-width/soft-hyphen instruction phrases that shared-provenance strips (surface mismatch). iter-001.md and iter-002.md contain details.

Iteration: 3 of 18
Focus Area: Continue bypass exploitation + trace downstream. Three sub-tasks:

**1. Quantify severity of Q2-F1 bypass**:
- Can an attacker embed instruction phrases using the kept characters that pass trigger-phrase-sanitizer but downstream consumers interpret as-if they were plain ASCII? (Because visually they look identical.)
- Is this a P0-level practical bypass (attacker gets arbitrary instruction through) or P1 (attacker-controlled input shape differs)?
- Document concrete attack scenario: input → sanitizer passes → consumer action → unintended effect.

**2. Q3 sanitizeRecoveredPayload trace**:
Now trace `sanitizeRecoveredPayload` into its consumer + Zod schema boundary. Can the same surface-mismatch class bypass payload sanitization and pass/fail validation unexpectedly? Read the function, the consumer call sites, the Zod schemas.

**3. Q4 round-trip stability start**:
If time remains, begin Q4: input → NFKC → serialize → deserialize → NFKC. Is the output stable? Look for round-trip inconsistencies that could cause the bypass to present differently on read vs write.

Remaining Key Questions:
- Q1 (largely done, iter 1): normalization chain mapped
- Q2 (active): severity quantification of Q2-F1 bypass
- Q3 (active): sanitizeRecoveredPayload downstream
- Q4 (emerging): round-trip stability
- Q5 (blocked on findings): hardening proposals

## STATE FILES

- Prior: iteration-001.md, iteration-002.md (MUST read first)
- Write findings to: iterations/iteration-003.md
- ALSO write `deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- **P0 escalation**: if Q2-F1 is practically exploitable end-to-end, emit P0 event (append to state log with `stopReason: "p0_escalation"` or similar).
- Keep PoC payloads local.
- APPEND JSONL delta + write deltas/iter-003.jsonl.

## OUTPUT CONTRACT

1. iterations/iteration-003.md
2. JSONL delta APPENDED
3. deltas/iter-003.jsonl
