# 025 -- Capture Quality Parity

## Goal

Improve content and memory quality across all 4 CLI capture pipelines (Claude Code, Codex, Copilot, Gemini) by centralizing shared utilities, adding missing filters, and softening an overly punitive contamination default.

## Scope

- Centralize `sanitizeToolInputPaths` into `scripts/utils/tool-sanitizer.ts` (was duplicated in 3 extractors, missing from Claude Code)
- Add `isApiErrorContent` filter to Codex, Copilot, Gemini (Claude Code already had it)
- Add `normalizeToolStatus` shared function replacing inline status mapping
- Soften contamination severity default from `null -> 'high'` to `null -> 'medium'`
- Fix Gemini agent path reference (`.agents/agents/*.md` -> `.gemini/agents/*.md`)

## Out of Scope

- Phase B deep research (separate iteration)
- Phase C post-research enhancements (conditional on B findings)
- Activity richness scoring dimension
- Cross-CLI quality parity test suite

## Key Files

| File | Change |
|------|--------|
| `scripts/utils/tool-sanitizer.ts` | Added `sanitizeToolInputPaths`, `normalizeToolStatus`, `isApiErrorContent` |
| `scripts/utils/index.ts` | Barrel export for new functions |
| `scripts/extractors/claude-code-capture.ts` | Import + apply `sanitizeToolInputPaths` to tool inputs |
| `scripts/extractors/codex-cli-capture.ts` | Remove local copy, import shared, add API error filter |
| `scripts/extractors/copilot-cli-capture.ts` | Remove local copy, import shared, add API error filter |
| `scripts/extractors/gemini-cli-capture.ts` | Remove local copy, import shared, add API error filter, use `normalizeToolStatus` |
| `scripts/core/quality-scorer.ts` | `null` severity -> `'medium'` (was `'high'`) |
| `scripts/extractors/quality-scorer.ts` | `null` severity -> `'medium'` (was `'high'`) |
| `scripts/tests/tool-sanitizer.vitest.ts` | NEW: 18 tests for shared functions |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Updated null severity test |
| `scripts/tests/codex-cli-capture.vitest.ts` | Added API error exclusion test |
| `scripts/tests/copilot-cli-capture.vitest.ts` | Added API error exclusion test |
| `scripts/tests/gemini-cli-capture.vitest.ts` | Added API error exclusion test |
| `.gemini/agents/deep-research.md` | Path reference fix |

## Documentation Level

Level 3 (500+ LOC cross-cutting architecture changes)
