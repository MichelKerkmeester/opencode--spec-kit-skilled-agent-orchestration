# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/019-system-hardening-001-initial-research-003-q4-nfkc-robustness/`. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 1 of 18
Questions: 0/5 answered | Last focus: none
Last 2 ratios: N/A -> N/A | Stuck count: 0
Research Topic: Q4 NFKC robustness research for canonical-equivalence attack surface on sanitizeRecoveredPayload, trigger-phrase-sanitizer, Gate 3 classifier (phase 016 T-SAN-01/02/03). Adversarial model: sanitizer bypass via NFKC-equivalent characters. Produce residual-threat inventory + hardening proposals.

Iteration: 1 of 18
Focus Area: Read the 3 sanitizer surfaces in current main to identify NFKC call sites + downstream filter/validation chain. Build initial Q1 answer (character classes Node.js NFKC normalizes). Start Q2 bypass construction drafts.

Remaining Key Questions:
- Q1: Enumerate NFKC canonical-equivalence pairs in Node.js V8 runtime
- Q2: Attacker constructions that survive NFKC and bypass trigger-phrase-sanitizer
- Q3: Attacker payloads that survive sanitizeRecoveredPayload and pass/fail Zod validation
- Q4: Round-trip stability across platforms and Unicode versions
- Q5: Concrete hardening mitigations

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-003-q4-nfkc-robustness/deep-research-config.json
- State Log: .../deep-research-state.jsonl
- Strategy: .../deep-research-strategy.md
- Registry: .../findings-registry.json
- Write findings to: .../iterations/iteration-001.md

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Bypass constructions stay in local research tree. Do NOT publish exploit payloads externally.
- P0 findings (practical bypass with clear exploit path) trigger halt — emit P0 event.
- IMPORTANT: APPEND JSONL delta to state log at end. Use `echo '...' >> <path>`.

## OUTPUT CONTRACT

1. `.../iterations/iteration-001.md` with Focus, Actions, Initial NFKC Call-Site Map, Q1 Partial Draft, Q2 Bypass Hypothesis, Next Focus.
2. JSONL delta APPENDED:
```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
