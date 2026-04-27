---
_memory:
  continuity:
    next_safe_action: "Iteration 003 should focus on 010/003 reason/step round-trip and blast_radius enrichment per strategy.md."
---
# Iteration 002 — 010/002 defensive input validation audit

**Focus:** Extend iter 1's F1/F2/F3 with the A/B/C/D checklist; produce per-item HANDLED or GAP verdicts with citations.
**Iteration:** 2 of 10
**Convergence score:** 0.50

## Section A verdicts (diff path containment, extends F1)

- A1: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:141` because `resolveCandidatePath` selects `newPath` whenever it is not `/dev/null`; an escaping `oldPath` paired with an in-root `newPath` is not containment-checked, and the handler can proceed to `status: "ok"` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:311`.
- A2: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:149` because the selected escaping `newPath` fails the canonical-root prefix check and returns a rejection reason at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:152`.
- A3: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:142` because both paths resolving to `/dev/null` become a skip result, and the caller skips that diff file at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:243`.
- A4: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:141` because pure-add selects the in-root `newPath`, normalizes/resolves it at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143`, and accepts it only after containment succeeds at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:156`.
- A5: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:141` because pure-delete selects the in-root `oldPath`, normalizes/resolves it at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143`, and accepts it only after containment succeeds at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:156`.

## Section B verdicts (path string sanitization, extends F2)

- B1: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:182` because NUL bytes in header paths are trimmed/stored with no character validation; `detect-changes` then only normalizes the string at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143`.
- B2: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:182` because C0 controls and DEL are accepted as path characters; there is no printable-character allowlist before containment normalization at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143`.
- B3: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:117` because raw newlines split the diff before path validation, while tabs inside a header path survive the `.trim()` assignment at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171`; malformed delimiter-bearing paths are not rejected as malformed paths.
- B4: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143` because `node:path.normalize()` is platform-dependent and there is no explicit rejection of backslash separators; on POSIX they can be accepted as literal filename characters, while on Windows they can behave as separators.
- B5: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143` because embedded `..` segments are collapsed by normalization, resolved at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:144`, and rejected when the resolved path escapes root at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:149`.
- B6: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143` because single-dot segments are collapsed by `normalize()` before the canonical-root containment check.
- B7: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:156` because a trailing-slash path is accepted after string containment; no layer checks whether the selected diff path denotes a file rather than a directory before it is added to affected files at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:263`.
- B8: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171` because `--- a/` can become an empty stripped path, and `detect-changes` treats `!path` as a skip at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:142` instead of a parse error.
- B9: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:182` because no path-length cap is enforced before the path is normalized at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143`.

## Section C verdicts (diff parser line counter)

- C1: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:197` because hunk ranges are recorded from the header immediately, and finalization at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:282` does not check that `remainingOldLines` / `remainingNewLines` reached zero.
- C2: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:282` because a truncated hunk at EOF is finalized with no remaining-budget validation, and the parser still returns `status: "ok"` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:284`.
- C3: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:256` because an over-budget `+` line terminates the hunk and is reprocessed, then unrecognized outside-hunk lines are tolerated at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:275`; attribution remains limited to the originally declared range recorded at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:197`.
- C4: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:234` because `\ No newline at end of file` marker lines enter the backslash branch and neither old nor new counters advance at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:235`.
- C5: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:275` because `Binary files differ` is tolerated outside hunk bodies as unrecognized git preamble/body metadata; if no `---`/`+++` file headers are present, no file is emitted by the finalizer at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:132`.
- C6: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:151` because `diff --git` paths are explicitly not trusted or stored, and rename/copy metadata then falls through the tolerant outside-hunk branch at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:275`; rename-only and copy-only diffs can return no touched file rather than a parse error or an affected-file attribution.

## Section D verdicts (phase runner runtime guards)

- D1: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:94` because an empty `phase.name` is inserted into `phasesByName` with no non-empty string validation, and it can later publish under an empty output key at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:235`.
- D2: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:69` because `outputKey` returns `phase.output ?? phase.name`, so `phase.output = ""` is a valid nullish-coalescing result rather than being rejected.
- D3: GAP at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:69` because runtime callers can pass non-string `output` values despite the TypeScript interface; `Map` lookups use that raw value at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:105`, and object assignment coerces it at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:235`. `undefined` alone falls back to `phase.name` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:70`.
- D4: HANDLED at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:138` because unknown `phase.inputs` values are rejected when neither an output key nor a phase name matches, throwing `PhaseRunnerError("missing-dependency")` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:139`.

## New findings (above and beyond the checklist)

### F6: Mixed old/new diff headers still bypass one-sided containment validation
- **Severity:** P1
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Extends iter 1 F#:** F1
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:141` validates only the selected path, so escaping `oldPath` plus in-root `newPath` proceeds; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:185` covers only the both-side escape case.
- **Suggested action:** Validate `oldPath` and `newPath` independently unless the side is exactly `/dev/null`; add mixed-header tests for old-escape/new-safe and old-safe/new-escape.

### F7: Diff path grammar has no byte-level safety contract
- **Severity:** P2
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Extends iter 1 F#:** F2
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:182` store header paths after trim/prefix stripping only; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143` normalizes path strings but does not reject NUL, C0 controls, DEL, tabs, backslash separator ambiguity, path length, empty stripped paths, or trailing-slash directory forms.
- **Suggested action:** Introduce a shared diff-path validator before containment resolution: non-empty, max byte length, slash-only separators, no NUL/C0/DEL, no trailing slash, and explicit `/dev/null` handling.

### F8: Hunk body counters bound parser greed but do not validate hunk completeness
- **Severity:** P2
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Extends iter 1 F#:** N/A
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:215` stops a hunk from consuming later headers when counters reach zero, but `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:282` finalizes at EOF without checking under-budget hunks, and over-budget lines can be ignored outside hunk parsing at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:275`.
- **Suggested action:** Return `parse_error` when EOF or a new header arrives before both counters reach zero, and when a `+`/`-` body line exceeds the declared side budget without being a valid next header.

### F9: Rename/copy-only diffs are silently dropped
- **Severity:** P2
- **Remediation type:** test-add
- **Maps to:** RQ5
- **Extends iter 1 F#:** N/A
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:151` ignores `diff --git` paths by design, while `rename from`, `rename to`, `copy from`, and `copy to` lines fall through the tolerated outside-hunk branch at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:275`; without `---`/`+++` headers, finalization at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:132` emits no file.
- **Suggested action:** Decide whether rename/copy-only diffs should be attributed as touched files or explicitly documented as out of scope; add regression tests either way.

### F10: Phase runner accepts malformed runtime keys outside TypeScript
- **Severity:** P2
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Extends iter 1 F#:** F3
- **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:69` returns `phase.output ?? phase.name` with no runtime type or non-empty validation; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:94` accepts empty names; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:235` writes malformed keys into the output object.
- **Suggested action:** Add runtime validation for `name`, every `inputs[]` entry, and `output`: non-empty strings matching the intended key grammar; reject before duplicate/cycle checks.

## Negative findings (cleared this iteration)

- New-side escapes are rejected when `newPath` is the selected path: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:149`.
- Pure-add and pure-delete in-root paths pass through the same normalize/resolve/containment path: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:141`.
- Embedded `..` and `./` segments are normalized before containment: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143`.
- `\ No newline at end of file` markers do not decrement either side's hunk budget: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:234`.
- Binary patch metadata does not get counted as hunk body: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:275`.
- Unknown phase inputs are rejected before execution: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:138`.

## RQ coverage cumulative through iter 2

- RQ1: partial
- RQ2: partial
- RQ3: covered
- RQ4: partial
- RQ5: partial

## Next iteration recommendation

Iter 003 should focus on 010/003 reason/step round-trip and blast_radius enrichment per strategy.md, with special attention to whether enriched fields survive persistence, query, and response formatting without silent fallback loss.
