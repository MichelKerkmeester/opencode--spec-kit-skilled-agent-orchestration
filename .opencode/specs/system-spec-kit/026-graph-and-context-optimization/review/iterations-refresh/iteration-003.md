# Iteration 003 — V8 and V12 Calibration Semantics

## Dimension
D1

## Focus area
New packet 010: validate-memory-quality.ts V8/V12 changes — are the narrowed regex and slug normalization correct and complete? Edge cases?

## Findings

No findings — dimension clean for this focus area.

The V8 and V12 rules now describe the intended contract clearly: V8 remains a hard contamination blocker, V12 remains an index-blocking topical mismatch, and the narrowed `SPEC_ID_REGEX` plus slug or prose variant builder match the packet's stated calibration goals. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:109-161] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209-210] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:646-656]

The focused regressions also hit the right edge cases. V8 keeps legitimate packet slugs while rejecting date, range, session-id, and finding-id false positives, then still fails a fabricated foreign-spec body. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:27-80] V12 passes both slug-form and prose-form matches, and the workflow now supplies `filePath` during validation so empty `spec_folder` frontmatter can still resolve the packet correctly. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:42-122] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1662-1666]

## Counter-evidence sought

I specifically looked for two failure modes: V8 still over-matching packet-adjacent tokens, and V12 silently depending on frontmatter-only `spec_folder` instead of runtime file path. I did not find either behavior in the current source or the focused fixtures.

## Iteration summary

The V8 and V12 calibration work looks correct and complete for the packet's claimed scope. This is one of the stronger parts of packet `010`.
