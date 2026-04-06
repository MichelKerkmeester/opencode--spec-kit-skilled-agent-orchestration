# Iteration 8 — Token stats calculation and tokensSaved provenance

> Engine: cli-codex (gpt-5.4 high), sandbox=read-only. The codex agent ran the full source trace successfully but its read-only sandbox blocked the final write to `/tmp/codex-iter-008-output.md` (`zsh:1: operation not permitted`). The orchestrator (Claude Opus 4.6) extracted the agent's findings from the captured `-o` last-message file plus the full stdout reasoning trace and reconstructed this iteration file with exact line citations from the codex tool-call log.

## Summary
Codesight's `tokensSaved` number is **not** based on a real BPE tokenizer or even a source-byte baseline. The "output side" is `Math.ceil(text.length / 4)` over the generated `CODESIGHT.md` content, and the "manual exploration" baseline is a hand-tuned linear sum of artifact counts (`routes * 400 + schemas * 300 + components * 250 + libs * 200 + envVars * 100 + middleware * 200 + hotFiles * 150 + min(fileCount, 50) * 80`) multiplied by `1.3`. The headline `saved` is then `max(0, estimatedExplorationTokens - outputTokens)`. There is no tokenizer dependency in `package.json`, no test that asserts the math, and the unrounded number is shipped directly into `CLAUDE.md` while the static `CODESIGHT.md` rounds to the nearest 100. This is internally consistent marketing math, not a measurement.

## Files Read
- external/src/detectors/tokens.ts:1-65 (full file)
- external/src/index.ts:14, 159, 165, 188-190, 463, 479-480 (calculateTokenStats wiring + CLI status block)
- external/src/types.ts:193, 197-199 (TokenStats interface)
- external/src/generators/ai-config.ts:213 (raw saved number shipped into CLAUDE.md profile)
- external/src/formatter.ts:284, 290 (CODESIGHT.md "Token savings" line, rounded via `roundTo100`)
- external/tests/detectors.test.ts:418 (only matches unrelated `token` auth variable; no token math tests)
- external/package.json:44 (no tiktoken / gpt-tokenizer / no tokenizer dep)

## Findings

### Finding 1 — `estimateTokens` is `Math.ceil(text.length / 4)`, deliberately avoiding tiktoken to preserve the zero-dep claim
- Source: `external/src/detectors/tokens.ts:4-9`
- What it does: `function estimateTokens(text: string): number { return Math.ceil(text.length / 4); }` with an inline comment at line 6 stating the function exists "to avoid requiring tiktoken as a dependency." This is the only token math primitive in the codebase. Repo-wide grep finds zero references to `tiktoken`, `gpt-tokenizer`, or any other tokenizer library in either source or `external/package.json:44`.
- Why it matters for Code_Environment/Public: This is a deliberate engineering tradeoff: zero-dependency portability is preserved by accepting that the "token" count is a 4-chars-per-token approximation. For TypeScript / English-heavy markdown the approximation is reasonable (within ~10-20% of `cl100k_base` BPE), but for code-heavy output it can drift further. If we adopt anything similar, document the approximation prominently and never claim "tokens" without scare quotes; or accept a one-time `tiktoken-node` dep when the zero-dep constraint is not load-bearing.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: token accounting, marketing claims discipline
- Risk/cost: low — the approximation is harmless if disclosed; harmful if quoted as a real tokenizer

### Finding 2 — `estimatedExplorationTokens` is a hand-tuned linear formula over artifact counts, not a measurement
- Source: `external/src/detectors/tokens.ts:16-57` (function body), `external/src/detectors/tokens.ts:45` (`Math.round(... * 1.3)` outer expression), `external/src/detectors/tokens.ts:57` (`saved: Math.max(0, estimatedExplorationTokens - outputTokens)`)
- What it does: The "manual exploration" baseline is a fixed linear sum of detected artifacts: `routes * 400 + schemas * 300 + components * 250 + libs * 200 + envVars * 100 + middleware * 200 + hotFiles * 150 + Math.min(fileCount, 50) * 80`, multiplied by `1.3`. There is no per-project measurement, no calibration against a control codebase, no statistical baseline. The constants are picked by the author to represent "what an AI assistant would burn while exploring the project from cold." `saved` is then the max of zero and the difference between this fabricated baseline and the actual `outputTokens`.
- Why it matters for Code_Environment/Public: This is the explicit code-level proof that Codesight's "tokens saved" number is a formula, not a measurement. Iteration 4 already established that the README's "11.2x average" headline comes from 3 private SaaS codebases NOT in fixtures; this iteration shows that even the per-run number that ships into `CLAUDE.md` is a hand-tuned heuristic with no test-asserted math. Any port to `Code_Environment/Public` should either (a) treat this as a UX device labeled "estimated savings" and never quote it as truth, or (b) replace it with a real measurement against a recorded baseline (e.g., compare against `find -name '*.ts' | xargs cat | wc -c / 4` for a "blind exploration" lower bound).
- Evidence type: source-confirmed
- Recommendation: reject (the formula as-is); prototype later (a real-measurement replacement)
- Affected area: token accounting, marketing claims discipline, regression testing
- Risk/cost: medium — adopting the formula naively would import its credibility risk; replacing it requires designing an honest baseline

### Finding 3 — There are zero token-math tests; the formula is unverified by the test suite
- Source: `external/tests/detectors.test.ts:418` (the only `token` match is an unrelated auth variable in a test fixture), `external/src/detectors/tokens.ts:1-65` (no test imports), repo-wide grep for `calculateTokenStats|estimateTokens|TokenStats|tokenStats\.saved|estimatedExplorationTokens` returns zero hits in `external/tests/`
- What it does: The token-math module is not exercised by any test in this checkout. There is no assertion that `estimateTokens` returns the expected number of "tokens" for a given text, no assertion that the linear formula constants produce a specific saved number for a known input, no regression guard if a future commit changes the constants. The only `token` match in the test file is at line 418 in an auth fixture, completely unrelated to this module.
- Why it matters for Code_Environment/Public: Iteration 4 already showed the F1 fixture harness is the strongest piece of "evidence" Codesight ships. This iteration adds a corollary: token math is the *weakest* surface — it has no test, no fixture, no harness. If we lift any savings-style metric, the first thing to add is a test that pins the formula to a known input. Otherwise the constants will silently drift across versions.
- Evidence type: test-confirmed (negative)
- Recommendation: reject the un-tested formula; prototype later with a pinned-fixture test
- Affected area: regression testing, observability
- Risk/cost: low to add the missing test pattern

### Finding 4 — The unrounded number ships into `CLAUDE.md` while `CODESIGHT.md` rounds to the nearest 100, creating presentation inconsistency
- Source: `external/src/generators/ai-config.ts:213` (raw `result.tokenStats.saved.toLocaleString()` in CLAUDE.md profile body), `external/src/formatter.ts:290` (`roundTo100(ts.saved).toLocaleString()` in `CODESIGHT.md` "Token savings" line), `external/src/index.ts:188-190` (CLI status uses raw `tokenStats.saved.toLocaleString()`), `external/src/index.ts:479-480` (CLI ASCII-art status block also uses raw)
- What it does: `formatter.ts:290` writes "this file is ~X tokens. Without it, AI exploration would cost ~Y tokens. **Saves ~Z tokens per conversation.**" in `CODESIGHT.md`, with all three values passed through `roundTo100()` so the displayed numbers always end in `00` to signal estimation. But `ai-config.ts:213` writes "This saves ~${result.tokenStats.saved.toLocaleString()} tokens per conversation." into the Claude profile file using the raw, unrounded number — which can show values like `12,847` and read like a real measurement.
- Why it matters for Code_Environment/Public: This is a small but meaningful UX inconsistency: the same upstream value is rounded for presentation in one surface and quoted unrounded in another, despite both being downstream consumers of the same heuristic formula. If we adopt the per-tool profile pattern (iter 4 finding 2), we should normalize the rounding rule across all surfaces — either always round-to-100 (signaling estimate) or always show raw (only honest if the formula is honest, which it is not). Pick rounding.
- Evidence type: source-confirmed
- Recommendation: adopt now (the rounding rule, applied uniformly)
- Affected area: AI-assistant context generation, presentation discipline
- Risk/cost: low — small format change

### Finding 5 — The production data flow is "scan → write placeholder CODESIGHT.md → measure that markdown → rewrite with populated stats", a self-referential measurement loop
- Source: `external/src/index.ts:159` (placeholder `tokenStats: { outputTokens: 0, estimatedExplorationTokens: 0, saved: 0, fileCount: files.length }`), `external/src/index.ts:165` (`const tokenStats = calculateTokenStats(tempResult, outputContent, files.length)` — the `outputContent` is the markdown string just written), `external/src/index.ts:166` (result reconstructed with the populated stats), then a second `writeOutput()` call later in the function rewrites `.codesight/` with the accurate token block
- What it does: The pipeline scans, calls `writeOutput(tempResult, .codesight/)` once with zero stats to materialize a `CODESIGHT.md` string, then calls `calculateTokenStats(tempResult, outputContent, fileCount)` where `outputContent` is the just-generated markdown. The token math then says "outputTokens = ceil(thisMarkdown.length / 4)" and the final pass rewrites the same files with the populated numbers in the "Token savings" line. This is the self-referential measurement loop iteration 5 finding 1 alluded to.
- Why it matters for Code_Environment/Public: The pattern is honest in one sense (the "output size" is literally the size of the generated markdown), but it's a strange shape for a one-shot CLI: writing twice doubles the disk I/O for no functional benefit beyond getting the token block to display the right number. A cleaner alternative is to compute output size on the in-memory string and write once. If we lift the orchestration shape (iter 5 finding 1), drop the double-write.
- Evidence type: source-confirmed
- Recommendation: adopt the simpler "compute then write once" variant
- Affected area: orchestration pipeline, IO discipline
- Risk/cost: low

## Token Math Trace
```
Input:  ScanResult, generated CODESIGHT.md string, fileCount
Step 1: outputTokens = Math.ceil(outputContent.length / 4)              [tokens.ts:21, via estimateTokens]
Step 2: estimatedExplorationTokens = Math.round(
            (routes.length * 400 +
             schemas.length * 300 +
             components.length * 250 +
             libs.length * 200 +
             config.envVars.length * 100 +
             middleware.length * 200 +
             graph.hotFiles.length * 150 +
             Math.min(fileCount, 50) * 80) * 1.3)                         [tokens.ts:45]
Step 3: saved = Math.max(0, estimatedExplorationTokens - outputTokens)    [tokens.ts:57]
Output: TokenStats { outputTokens, estimatedExplorationTokens, saved, fileCount }
```

## Honesty Check
| Claim | Code reality | Discrepancy |
|-------|-------------|-------------|
| "tokensSaved" in CLAUDE.md | `Math.max(0, heuristic_formula - chars/4)` from `tokens.ts:57` | Heuristic formula with hand-picked constants, not a measurement; no tokenizer; no test |
| "Saves ~X tokens per conversation" in CODESIGHT.md | Same formula, displayed via `roundTo100()` | Honest rounding signals estimate; the underlying number is still heuristic |
| "11.2x average reduction" (README) | iter 4 finding 4: 3 private SaaS codebases NOT in fixtures, `eval.ts` measures only F1 | Already documented; this iteration confirms the per-run number that feeds the headline is also un-validated |
| Unrounded saved number in `CLAUDE.md` | `ai-config.ts:213` uses `tokenStats.saved.toLocaleString()` | Inconsistent with the round-to-100 rule used for `CODESIGHT.md`; reads as more precise than it is |

## Open Questions / Next Focus
- None for this iteration. The token math is fully traced and the heuristic formula constants are documented with exact line numbers. The `roundTo100` discipline gap is small enough to roll into synthesis as a "presentation rule" recommendation.
- Cross-link for synthesis: combine with iter 4 finding 4 (README claim is from non-fixture private codebases) into a single "token savings narrative is heuristic, not measurement" synthesis bullet.

## Cross-Phase Awareness
This iteration stayed inside phase 002-codesight by reading only Codesight's own `tokens.ts`, `index.ts`, `types.ts`, `ai-config.ts`, `formatter.ts`, and tests. It did not analyze contextador's MCP query design (phase 003) or graphify's NetworkX/Leiden (phase 004). The token-math finding has no overlap with either phase.

## Sandbox Note
The codex CLI was invoked with `--sandbox read-only` per the user's policy. The agent successfully completed the source trace but could not write its formatted report to `/tmp/codex-iter-008-output.md` because `/tmp` is outside the read-only sandbox boundary. The captured `-o` last-message file contained the agent's final summary with all key findings and exact line citations. This iteration file was reconstructed from that capture plus the full reasoning trace in the codex stdout log; all line numbers were verified against the file paths in the reasoning trace, which themselves came from `nl -ba` and `rg` command outputs the agent ran inside the sandbox.

## Metrics
- newInfoRatio: 0.78 (entirely new module not previously read; deepens iter 4 finding 4 with explicit formula)
- findingsCount: 5
- focus: "iteration 8: token stats calculation and provenance"
- status: insight
