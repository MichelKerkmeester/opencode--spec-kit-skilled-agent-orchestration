# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E**. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 4 of 18
Last 3 ratios: N/A -> 0.78 -> 0.66 -> 0.52 | Stuck count: 0 | Rolling avg: 0.65
Iter 3 refined Q2-F1 severity to P1 (metadata/filter poisoning, not arbitrary instruction delivery); Q3-F1 new P1: payload only shape-validates at z.string() without semantic schema. Read iter-003.md.

Iteration: 4 of 18
Focus Area: Deepen Q3 + Q4 + start Q5.

**1. Q3 — expand sanitizeRecoveredPayload findings**:
- If z.string() is shape-only, what do downstream consumers do with the string? Any string-content-sensitive logic?
- Are there places where recovered payload flows into pattern matching, regex, or command construction that would amplify the P1?
- Scan for any high-severity downstream (command execution, file path construction, SQL-like queries).

**2. Q4 — round-trip stability**:
Test cases:
- Input with ZWJ/ZWNJ → NFKC → JSON.stringify → JSON.parse → NFKC: same?
- Fullwidth colon (U+FF1A) → NFKC (no change) → roundtrip: same?
- Combining marks: single char with combining marks → NFKC → round-trip: same canonical form?
- Node.js version drift (if different ICU versions available to check).

**3. Q5 — start hardening proposals**:
Based on Q2-F1 + Q3-F1, draft 3-5 hardening proposals:
- Canonicalize all surfaces to same normalization chain (unify trigger-phrase-sanitizer with shared-provenance)
- Add post-normalization deny-list for dangerous equivalence classes
- Add semantic schema for payload content (beyond shape validation)
- Round-trip invariant assertion
- Unicode version pinning / detection

Remaining Key Questions:
- Q1 ✓ (iter 1): surface map complete
- Q2 (iter 2-3): bypass confirmed P1
- Q3 (active): downstream scan
- Q4 (active): round-trip
- Q5 (active): hardening draft

## STATE FILES

- Prior: iter 1-3 (read)
- Write findings to: iterations/iteration-004.md
- ALSO write `deltas/iter-004.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- APPEND JSONL.
- Write `deltas/iter-004.jsonl`.

## OUTPUT CONTRACT

1. iterations/iteration-004.md
2. JSONL delta APPENDED
3. deltas/iter-004.jsonl
