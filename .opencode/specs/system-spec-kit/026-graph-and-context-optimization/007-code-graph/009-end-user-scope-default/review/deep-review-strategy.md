# Deep Review Strategy v4 — VERIFICATION on FIX-009-v3

## Charter

3-iter VERIFICATION sweep on FIX-009-v3 (closes RUN3-I3-P0-001 regex multi-path leak).
Confirm: relativizeScanError() now handles ALL delimiter cases (colon, NUL, quote, bracket,
whitespace) without leaking absolute paths.

## V3 closed finding (do NOT re-flag unless evidence of regression)

- RUN3-I3-P0-001 (regex multi-path leak) → fixed via split-then-relativize approach in
  scan.ts (relativizeScanError + relativizeScanWarning). New describe.each tests added
  in code-graph-scan.vitest.ts covering colon/NUL/quote/bracket/mixed delimiters.

## Dimension queue (3 iters)

1. security — regression on the regex fix (test the SAME multi-path delimiter cases)
2. security — edge cases (empty, long, unicode, non-ASCII path chars)
3. correctness — cross-cutting (do prior single-path tests still pass? all prior P0/P1 fixes still hold?)

## IDEAL OUTCOME

0 findings. PASS verdict. If anything found, signals fix is incomplete.

## Covered

- Iteration 1 — security regression check for RUN3-I3-P0-001: PASS, no findings.
- Iteration 2 — security edge cases (empty, long, unicode, newline delimiter, root, outside-workspace, consecutive/trailing delimiters): PASS, no findings.

## Next Focus

- Iteration 3 — correctness cross-cutting (prior single-path tests and prior P0/P1 fixes).
