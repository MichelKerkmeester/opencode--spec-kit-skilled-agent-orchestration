# Iteration 004

## Focus

Q9: evidence-marker bracket-depth lint false-positive surface. Inspect whether nested fences, mismatched fenced content, or parenthesis-heavy evidence blocks can trigger invalid bracket-depth diagnostics despite syntactically acceptable markdown.

## Actions Taken

1. Read the bracket-depth parser in [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:132) and the strict bridge in [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts:77) to confirm that strict validation trusts the audit parser wholesale.
2. Read the shipped unit tests in [.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:53) to map which false-positive cases are already covered versus still untested.
3. Compared the parser's code-context grammar against CommonMark/GFM fence behavior, focusing on column-0 only fence recognition and unconditional three-backtick toggling.
4. Attempted a direct runtime probe for uncovered fence shapes, but the local iteration environment lacks a ready TS loader/package boundary for importing the audit module. The uncovered fence findings below are therefore source-derived inferences rather than executed fixture results.

## Findings

### P1. Parenthesis-heavy evidence content is intentionally false-positive-safe on the covered path

Reproduction path:
- Read [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:218) through line 269.
- Once `[EVIDENCE:` is entered, the parser increments depth only on `[` and decrements only on `]`; `(` and `)` are recorded only via `contentHasParens` and never affect closure.
- The shipped tests explicitly cover parens-in-content closed with `]`, trailing `(verified)]`, and the adversarial "contains parens but ends with `)`" case in [.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:63), [.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:90), and [.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:174).

Impact:
- The Phase 017 claim that bracket-depth parsing removed the earlier parenthesis false positives is substantiated for the covered single-line cases.
- Q9 is not primarily a "too many parentheses" problem anymore; the more credible residual risk has shifted to markdown code-context detection.

### P1. The parser still has a source-confirmed false-positive surface for syntactically valid fenced code that is not exactly column-0 triple backticks

Reproduction path:
- Read the fence recognizer in [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:132).
- Fence entry/exit happens only when `i === lineStart` and the next three bytes are backticks.
- The inline comment explicitly says leading-whitespace fences are intentionally unsupported, but CommonMark/GFM allow up to three leading spaces before a fence and allow longer fences (` ```` ` etc.) to wrap content that itself contains triple backticks.

Source-derived examples:
- An indented fenced block such as `   ```md` ... `   ```` is valid markdown, but this parser will not enter `inFencedCode`, so any `[EVIDENCE: ... )` example inside can be misclassified as a real malformed marker.
- A four-backtick outer fence containing a literal triple-backtick example will be toggled by the first column-0 ` ``` ` line the parser sees, because it does not track fence length. That can prematurely exit code mode and expose later example markers inside the still-open markdown fence to false-positive linting.

Impact:
- The current parser is safe for the exact fence style used in existing tests, but it is not grammar-complete for markdown fence variants that operators may reasonably paste into research or checklist notes.
- Phase 019 should treat this as a real residual false-positive risk, not just a hypothetical parser nicety, because the strict lint wrapper in [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts:77) promotes whatever the audit parser reports.

### P2. "Mismatched fenced content" is more likely to cause false negatives than false positives unless a longer outer fence contains an inner triple-backtick line

Reproduction path:
- In [.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:149), once `inFencedCode` is true the parser swallows all content until another column-0 triple-backtick line toggles it off.
- An actually unclosed triple-backtick fence therefore keeps the parser in code mode until EOF, hiding later real markers instead of falsely flagging them.
- The false-positive variant appears when the markdown author uses a longer outer fence to safely show inner triple-backtick content; the parser cannot distinguish outer-fence width from inner content and may close early.

Impact:
- Q9 splits into two separate sub-risks:
  - false negatives from truly unclosed fences
  - false positives from valid but unsupported fence forms
- The Phase 019 remediation should not overfocus on newline/parenthesis heuristics alone; the higher-leverage fix is a more faithful fence state machine.

### P2. The shipped tests leave the real residual fence risks unguarded

Reproduction path:
- The current unit suite covers plain fenced code blocks, inline backticks, nested square brackets, paren-heavy content, multiline unclosed markers, and rewrap behavior in [.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:104) through line 190.
- There are no tests for:
  - indented fences
  - fences with info strings plus indentation
  - outer fences longer than three backticks
  - inner triple-backtick literals inside longer fences

Impact:
- Even if the parser behavior is currently "good enough" for the team's preferred markdown style, the regression surface is under-specified.
- Phase 019 can scope a low-cost hardening path: add failing fixtures for the uncovered fence forms first, then change the parser with a bounded test oracle.

## Questions Answered

- Q9. Does evidence-marker bracket-depth lint produce false positives in edge cases?
  Partially answered: parenthesis-heavy evidence text and ordinary column-0 triple-backtick code fences are already false-positive-safe. The remaining credible false-positive surface is not bracket depth itself, but incomplete markdown fence recognition: indented valid fences and longer-fence nesting can plausibly expose code-example markers to strict linting. That conclusion is source-derived from the parser grammar and not yet backed by an executed fixture in this iteration environment.

## Questions Remaining

- Can a minimal fixture harness be added so the indented-fence and four-backtick-nesting cases are reproduced in CI rather than inferred from source?
- Does the spec corpus currently contain any indented or longer-fence evidence examples, or is this a latent risk with low present incidence?
- Should Phase 019 aim for full CommonMark fence support, or merely the narrower subset actually used in `system-spec-kit` docs?

## Next Focus

Q10: continuity-freshness threshold calibration. Inspect whether the 10-minute `_memory.continuity.last_updated_at` vs `graph-metadata.derived.last_save_at` tolerance is backed by observed save-path latency or only by packet-era intuition.
