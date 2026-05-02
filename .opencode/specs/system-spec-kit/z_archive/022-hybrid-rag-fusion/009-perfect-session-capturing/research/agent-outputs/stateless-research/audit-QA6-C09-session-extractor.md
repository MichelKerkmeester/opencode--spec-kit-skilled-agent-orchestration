## Audit QA6-C09: session-extractor.ts — Copilot Cross-Validation
### P0 Blockers: [0] — [none]
- None. `generateSessionId` (`session-extractor.ts:127-130`) uses `crypto.randomBytes(6)` for 48 bits of CSPRNG entropy and prefixes `Date.now()`, which is sufficient for session-scale uniqueness. `calculateExpiryEpoch` (`session-extractor.ts:295-300`) is also unit-consistent with `createdAtEpoch = Math.floor(Date.now() / 1000)` in `collect-session-data.ts:728`.

### P1 Required: [2] — [session-extractor.ts:251-278, session-extractor.ts:271-276]
- `session-extractor.ts:251-278` undercounts real tool usage because it only recognizes the fixed legacy set `Read/Edit/Write/Bash/Grep/Glob/Task/WebFetch/WebSearch/Skill`. The capture pipeline accepts arbitrary `tool: string` values (`input-normalizer.ts:92-103`) and stores raw tool names verbatim as `facts: [\`Tool: ${tool.tool}\`]` (`input-normalizer.ts:476-483`), so modern exchange tools like `view`, `rg`, `sql`, `report_intent`, `read_bash`, `write_bash`, and `apply_patch` are silently dropped. That cascades into wrong `toolCounts`, then wrong `detectContextType` / `detectProjectPhase` classifications.
- `session-extractor.ts:271-276` overcounts non-executed tools by scanning `userPrompts` for `Tool(` syntax even though `userPrompts` are populated from raw `ex.userInput` (`input-normalizer.ts:430-433`), not executed tool-call logs. A user can mention `Bash(...)` or paste example tool syntax without any actual exchange execution, and the extractor will still increment counts, so the aggregation is not execution-accurate.

### P2 Suggestions: [1] — [session-extractor.ts:255-266]
- `session-extractor.ts:255-266` increments at most once per tool per fact because it uses boolean `includes()` checks instead of counting matches. Current normalization usually emits one `Tool: X` fact per tool call, so impact is limited today, but the extractor is not robust if future batching or denser fact encoding places multiple same-tool invocations in one fact string.

### Score: [84]
