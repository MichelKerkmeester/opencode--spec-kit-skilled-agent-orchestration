## Audit QA6-C08: opencode-capture.ts — Copilot Cross-Validation
### P0 Blockers: 0 — None
### P1 Required: 4 —
- [.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:178-186,460-476] Exchange start detection is nondeterministic: prompts come from global `prompt-history.jsonl` and are matched only by a +/- tolerance timestamp check, so nearby prompts from other work can be reused for the wrong user message.
- [.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:344-367,478-485] Exchange end detection stops at the first assistant text part whose parent matches the user turn; multipart or regenerated assistant replies are reduced to the earliest chunk instead of the full final response.
- [.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:181-183,472-476] Timestamp parsing is format-fragile: raw prompt timestamps are fed straight into `new Date(...)` with no normalization or invalid-date guard, so timezone-less strings, Unix-second values, and unsupported numeric-string formats silently fail or skew matching.
- [.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:484-495] Long exchanges are not truncation-safe: assistant replies are hard-cut with `substring(0, CONFIG.TOOL_OUTPUT_MAX_LENGTH)` and no truncation marker or tail preservation, which irreversibly drops the rest of the exchange.
### P2 Suggestions: 1 —
- [.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:399-405,484-485] Reuse the explicit head+tail truncation strategy for exchange text (or store structured excerpts) so truncation remains visible and preserves both setup and outcome context.
### Score: 58
