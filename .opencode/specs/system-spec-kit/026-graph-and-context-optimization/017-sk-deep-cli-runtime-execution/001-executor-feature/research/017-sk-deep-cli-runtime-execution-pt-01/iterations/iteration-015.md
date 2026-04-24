# Iteration 015

## Focus

Q9: refine the evidence-marker bracket-depth lint audit around nested fences, mismatched fences, and paren-heavy markdown so Phase 019 can separate true false-positive risks from adjacent parser failure modes.

## Actions Taken

1. Re-read the current parser implementation in [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:106) and the existing regression coverage in [.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:104).
2. Re-read the earlier Q9 write-up in [iteration-010.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-001-executor-feature/iterations/iteration-010.md:1) to avoid re-reporting the same surface without adding new evidence.
3. Ran the compiled parser at `.opencode/skill/system-spec-kit/scripts/dist/validation/evidence-marker-audit.js` against six synthetic cases: indented triple-backtick fences, four-backtick fences, nested line-start triple fences inside an outer fence, mismatched/unclosed fences, paren-heavy valid markers, and paren-heavy malformed markers.
4. Searched packet and skill markdown trees for indented and longer fences to estimate whether the remaining parser gaps are purely theoretical or likely to appear in real docs.

## Findings

### P1. Indented triple-backtick fences are still the only confirmed Q9 false-positive path in this narrowed audit

Evidence:
- The parser only enters fenced-code mode when the first three backticks begin exactly at `lineStart`, so leading spaces are explicitly unsupported in the implementation comment and the condition itself ([evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:132)).
- The shipped tests only cover flush-left fences; there is still no regression for indented fences ([evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:111)).
- Direct reproduction against the compiled parser returned one `malformed` marker for:

```text
  ```
[EVIDENCE: inside indented triple fence)
  ```
```

Why this matters:
- Indented code fences are common in packet scratch files, research iterations, and install/docs content, so this is not just a synthetic markdown corner.
- Any example marker placed inside an indented fenced block can still trip strict validation as if it were live prose.

Risk-ranked remediation candidates:
- P1: accept up to three leading spaces before a backtick fence opener/closer, matching normal GFM fenced-code expectations.
- P2: add an explicit regression fixture for indented fences before touching broader fence-family support.

### P1. Nested line-start triple-backtick lines still cause premature fence exit, but four-backtick fences are safer than the earlier Q9 pass implied

Evidence:
- Fence mode toggles on any line-start triple-backtick prefix before the `inFencedCode` swallow branch, so an inner ```` ```json ```` line inside an open fence still flips the parser back to prose ([evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:134)).
- Reproduction against the compiled parser still yields one `unclosed` marker for:

```text
```
```json
{"example":"[EVIDENCE: fake marker)"}
```
```
```

- By contrast, a fence opened and closed with four backticks produced zero markers in the same reproduction run because the current prefix check accidentally treats the first three backticks of ```` as a valid opener and closer, then skips the rest of the line.

Why this matters:
- The real remaining false-positive/false-warning driver is not "longer fences in general"; it is premature exit on nested line-start triple-backtick content.
- That narrows Phase 019 scope: we need opener/closer matching discipline more than blanket support for every backtick count.

Risk-ranked remediation candidates:
- P1: store the active fence opener shape and only close when the closer matches that active fence contract.
- P2: add a nested-fence regression that proves inner line-start triple backticks inside an outer fence do not expose example text to marker parsing.

### P2. Mismatched or unclosed fences are a false-negative suppression problem, not a false-positive problem

Evidence:
- Once `inFencedCode` is true, the parser swallows everything until it sees another recognized closer; there is no EOF warning for an unclosed fence ([evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:149)).
- Reproduction against the compiled parser returned zero markers for:

```text
```
[EVIDENCE: inside unclosed fence]
after fence [EVIDENCE: real outside marker]
```

Why this matters:
- The parser does not mis-report example text here; instead it suppresses both the bad example marker and the later real marker.
- This belongs in Phase 019 as a separate auditability gap, but it should not be counted as additional Q9 false-positive evidence.

Risk-ranked remediation candidates:
- P2: emit a dedicated "unterminated fenced block" diagnostic at EOF when `inFencedCode` is still active.
- P2: keep this scoped separately from bracket-depth false-positive fixes so the remediation plan does not blur warning inflation with warning loss.

### P2. Paren-heavy evidence text remains robust; bracket depth is not the active issue

Evidence:
- The parser intentionally ignores `(` and `)` while inside a marker and only tracks them for reporting metadata ([evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:218)).
- Existing tests already cover paren-heavy OK and malformed cases ([evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:174)).
- The compiled parser reproduced the expected split:
  - `- [x] item — [EVIDENCE: see fn(foo(bar(baz))) and parser(state)]` → `ok`
  - `- [x] item — [EVIDENCE: see fn(foo(bar(baz))) and parser(state))` → `malformed`

Why this matters:
- Phase 019 should not spend time redesigning bracket-depth accounting for delimiter-heavy prose.
- The real remaining risk remains code-context recognition, not marker-content punctuation.

Risk-ranked remediation candidates:
- P2: leave bracket-depth logic intact and keep fixes focused on fence recognition.
- P2: if operator triage remains confusing, improve lint messaging to hint at nearby fence ambiguity rather than implying prose-level marker syntax is at fault.

## Questions Answered

- Q9 refinement: yes, there is still a real false-positive surface, but it is narrower than the prompt framing suggested.
- Confirmed false-positive / false-warning paths:
  - indented triple-backtick fences
  - nested line-start triple-backtick content inside an open fence
- Confirmed non-issues for this question:
  - four-backtick fences in isolation
  - paren-heavy but correctly closed evidence markers
- Reclassified adjacent issue:
  - mismatched or unclosed fences are a false-negative suppression problem, not a false-positive one

## Questions Remaining

- How often do live strict-validation targets contain example `[EVIDENCE: ...]` markers inside indented or nested-fence code samples, not just indented fences alone?
- Should Phase 019 keep the fix narrowly on backtick fences, or also add tilde-fence parity while touching this parser?
- Does the lint bridge need a more explicit "possible fence ambiguity" diagnostic once parser fixes land, or will parser-side remediation be enough?

## Next Focus

Move to Q5: inspect whether the `N=3` retry budget for `partial_causal_link_unresolved` is empirically grounded or still a policy guess, and quantify the failure-resolution distribution if the checked-in artifacts allow it.
