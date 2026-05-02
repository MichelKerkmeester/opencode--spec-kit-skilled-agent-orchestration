## Audit QA7-C12: contamination-filter.ts + session-types.ts — Copilot Cross-Validation
### P0 Blockers: 0 — none

### P1 Required: 2 — [file:line findings]
1. **contamination-filter.ts:6-43,58-75 — denylist-only filtering is easy to bypass, so orchestration chatter can still leak into downstream summaries.**
   - The filter only strips exact canned phrases. Straightforward variants such as `I'm going to inspect the file structure...`, `We should first read the codebase...`, and `Now I will use the bash tool.` are left untouched, while `Let me analyze...` is removed. I verified those cases with `npx tsx` against the current implementation.
   - This matters because the cleaned prompts are fed directly into semantic summarization in `scripts/core/workflow.ts:736-767`. The current implementation therefore treats many common planning/tool-usage phrasings as valid content instead of contamination.
   - Risk: generated implementation summaries and extracted file changes can preserve assistant process narration instead of user intent, which degrades retrieval quality and can misclassify sessions.

2. **session-types.ts:177-215 — the “canonical” `SessionData` interface no longer matches the real runtime object shape.**
   - `collectSessionData()` returns preflight/postflight analytics and continuation payload fields such as `PREFLIGHT_KNOW_SCORE`, `HAS_POSTFLIGHT_DELTA`, `SESSION_STATUS`, `PENDING_TASKS`, and `RESUME_CONTEXT` (`scripts/extractors/collect-session-data.ts:208-309,566-597,791-831`), but none of those fields are declared on `SessionData`.
   - The broad `[key: string]: unknown` index signature hides this drift instead of surfacing it, so callers lose type safety and autocomplete for fields that are actually present at runtime. The mismatch is already visible in fixtures that construct real-looking session objects with those extra properties (`scripts/tests/memory-render-fixture.vitest.ts:82-121`).
   - Risk: downstream code can silently depend on undocumented fields or forget to populate them, and TypeScript will not flag the schema mismatch even though this file claims to define the canonical session contract.

### P2 Suggestions: 1 — [file:line findings]
1. **contamination-filter.ts:36-42 — boundary coverage is too narrow for filler/tool-call variants.**
   - Some patterns are whitespace-sensitive (`Sure!\\s`, `Absolutely!\\s`) or assume a single `\\w+` tool name, so end-of-message filler and nontrivial tool identifiers are likely to survive.
   - Add regression coverage for empty input, contamination-only input, multiline prompts, contraction variants (`I'm going to`, `I will`, `we should first`), and tool-name variants before expanding the filter. This will keep future denylist changes measurable instead of guess-based.

### Score: 74
