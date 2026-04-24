## Focus

Q9: Evidence-marker bracket-depth lint false positives. Inspect whether nested fences, mismatched code blocks, or delimiter-heavy prose can trigger false positives in the current marker-depth checks.

## Actions Taken

1. Recovered the active iteration context from `deep-research-state.jsonl` and confirmed the packet-local deep-research contract from `sk-deep-research/SKILL.md`.
2. Inspected the parser and lint bridge in `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts` and `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts`.
3. Reviewed the current regression coverage in `.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts` and `.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-lint.vitest.ts`.
4. Reproduced uncovered edge cases against the compiled parser at `.opencode/skill/system-spec-kit/scripts/dist/validation/evidence-marker-audit.js` using four synthetic inputs: indented fenced blocks, nested triple-backtick lines inside an open fence, delimiter-heavy prose with nested brackets/parens, and a genuinely unclosed code fence.

## Findings

### P1. Indented triple-backtick examples are parsed as live prose, so evidence examples inside them become false positives

- The parser only toggles fenced-code mode when ````` appears at exact column 0 (`i === lineStart`), and the source comment explicitly says leading whitespace is not supported in spec docs (`.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:132-146`).
- Current tests cover only flush-left fenced blocks (`.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:111-123`), so this column-0 restriction is not guarded by regression coverage.
- Reproduction: an indented block
  - `Example:`
  - `  ````
  - `[EVIDENCE: inside indented fence)`
  - `  ````
  yields one `malformed` marker instead of zero.
- Risk: any markdown author who indents a code example for list nesting or readability can trip strict validation even though the marker is example text, not a real citation.
- Remediation candidate: normalize fence detection to accept up to 3 leading spaces before a backtick fence, then add a dedicated regression test for indented fences.

### P1. A nested triple-backtick line inside an already-open fence can prematurely exit fenced-code mode and expose later example text to lint

- Fence detection runs before the `inFencedCode` swallow branch and blindly flips `inFencedCode = !inFencedCode` on any line-start triple-backtick sequence (`.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:134-150`).
- That means a literal line such as `````json` inside an open fence is treated as the closing fence, even though it may just be example content for a nested snippet.
- Current tests prove only the happy path of one balanced outer fence and do not cover nested fence-like lines inside fenced content (`.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:111-149`).
- Reproduction:
  - outer line ` ``` `
  - inner line ` ```json `
  - payload line `{"example":"[EVIDENCE: fake marker)"}` 
  - closing lines ` ``` ` and ` ``` `
  yields one `unclosed` marker instead of zero because the parser exits fenced mode on the inner ` ```json ` line and reads the JSON string as prose.
- Risk: documentation that teaches nested snippets or shows fenced markdown inside fenced markdown can generate validator noise or block unrelated packet work.
- Remediation candidate: once inside fenced mode, only close on a fence that matches the active opener family/indent contract, rather than toggling on any line-start triple-backtick sequence.

### P2. Delimiter-heavy prose is currently safe; the remaining Q9 risk is concentrated in code-context detection, not bracket-depth accounting

- The core bracket-depth logic separately counts `[` and `]` while ignoring parens as legal content (`.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts:218-258`).
- Existing tests already cover paren-heavy content, trailing `(verified)]`, nested square brackets, and multiple markers on one line as valid or intentionally malformed (`.opencode/skill/system-spec-kit/scripts/tests/evidence-marker-audit.vitest.ts:63-97` and `156-183`).
- Reproduction with delimiter-heavy prose
  - `[EVIDENCE: compare foo(bar[baz]) vs qux((alpha)) and keep trailing prose ]`
  still returns `ok`.
- Conclusion: the false-positive surface is narrower than initially suspected. The parser is robust against prose-level delimiter density, but not against fence-shape ambiguity.

### P2. The lint bridge inherits parser false positives unchanged and offers no context downgrade for example-heavy files

- `lintEvidenceMarkers()` simply calls `auditFolder(..., { rewrap: false })`, filters non-`ok` markers, and turns any hit into `warn`/strict-exit 1 (`.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts:75-110`).
- There is no secondary heuristic for "likely code-example context" after parsing, so any fence-detection miss becomes a hard validator warning rather than a soft diagnostic.
- Remediation candidate: keep the parser fix primary, but Phase 019 could also consider a secondary diagnostic message that explicitly points to suspected fence-shape ambiguity when invalid markers are preceded by nearby fence lines.

## Questions Answered

- Q9 is mostly answered.
- The bracket-depth state machine itself is not the main false-positive source for prose. Nested brackets and paren-heavy evidence text are already handled correctly.
- The real false-positive surface is code-context recognition:
  - indented fences are missed entirely
  - nested triple-backtick lines inside an open fence can terminate fence mode too early

## Questions Remaining

- How common are indented or nested-fence markdown examples across active spec folders, especially inside review/research artifacts that routinely embed markdown examples?
- Should Phase 019 fix only triple-backtick handling, or also expand to tilde fences if the validator wants broader CommonMark parity?
- Is parser-only remediation sufficient, or should the lint bridge emit a clearer "possible code-example fence ambiguity" hint to speed operator triage?

## Next Focus

Q10: continuity-freshness threshold calibration. Inspect whether the current 10-minute `_memory.continuity.last_updated_at` versus `graph-metadata.derived.last_save_at` threshold reflects real refresh latency or remains an unvalidated guess.
