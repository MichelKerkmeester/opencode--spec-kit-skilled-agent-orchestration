# Iteration 25 - security - scripts_lib

## Dispatcher
- iteration: 25 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:06:29.600Z

## Files Reviewed
- .opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts
- .opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs
- .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
- .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
- .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs
- .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs
- .opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### P1-001 [P1] `renderDashboard()` lets unescaped metadata forge the human review surface
- File: `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:487-562`
- Evidence: `renderDashboard()` interpolates `board.sessionId`, `board.target`, `seg.segmentId`, `seg.waveId`, `conflict.findingId`, and promotion fields directly into markdown headings/tables without escaping `|`, `\n`, or `\r` (`wave-coordination-board.cjs:502-557`). A direct runtime probe showed `target: 'repo\n## Forged'` and `segmentId: 'seg-1\n| fake | row |'` produce a forged heading and a forged table row in the generated dashboard, so a compromised worker or hostile target string can tamper with the operator-facing output while leaving `board.json` different.
- Recommendation: escape markdown table cells before rendering dashboard rows/fields, or render untrusted identifiers via fenced/code-span encoding so newline/pipe characters cannot rewrite the derived dashboard.

```json
{
  "claim": "The dashboard renderer is vulnerable to markdown/table injection because it writes untrusted identifiers and target text into markdown tables without escaping control characters.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:502-557",
    "bash reproduction in repo root at 2026-04-16T06:06:29Z showing injected heading and forged table row from newline/pipe characters",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:187-211"
  ],
  "counterevidenceSought": "I looked for any existing markdown/table-cell escaping helper or a caller-side sanitization contract for target, segmentId, waveId, and findingId, and found neither in the reviewed scripts.",
  "alternativeExplanation": "If every producer guarantees sanitized identifiers and the dashboard is never consumed outside tests, the impact drops; the current module comments, though, describe dashboard.md as the derived human-readable surface.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if this renderer is proven unreachable in shipped flows and all upstream producers hard-guarantee newline/pipe-free metadata."
}
```

### P2 Findings
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:290-298,321-326` accepts empty-string merge identifiers as "valid" because both `parseJsonl()` and `validateMergeKeys()` only check `key in record`, not whether `sessionId`, `segment`, `wave`, or `findingId` are meaningful values. A direct probe with `{"sessionId":"","generation":1,"segment":"","wave":"","findingId":""}` returns `valid: true` and no `validationErrors`, which weakens the provenance guarantees documented for replayable segment artifacts.
- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:187-211,363-383` only exercises happy-path dashboard rendering and missing/null merge keys. There is no regression coverage for markdown-control characters in dashboard fields or for blank-but-present merge keys, so both integrity issues can regress while the current suite stays green.

## Traceability Checks
- `wave-coordination-board.cjs` matches the spec intent of keeping `board.json` canonical and `dashboard.md` derived, but the current renderer does **not** preserve that "derived human-readable render" guarantee under hostile metadata because table/control characters are emitted verbatim.
- The remaining reviewed libs align with the intended helper-only architecture: no `child_process`, shell execution, filesystem mutation, or outbound network requests appear in the reviewed implementation surface.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` - pure string handling; no I/O, dynamic execution, or path handling.
- `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs` - numeric convergence/pruning helpers only; no injection sinks or privileged operations.
- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` - orchestration state helpers only; no shell/process spawning despite fan-out terminology.
- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` - deterministic grouping/parsing logic only; `URL()` is used for hostname extraction, not fetching.

## Next Focus
- Check adjacent reducer/optimizer helpers for the same integrity pattern: unescaped markdown/log rendering and replay parsers that treat blank identifiers as valid namespace keys.
