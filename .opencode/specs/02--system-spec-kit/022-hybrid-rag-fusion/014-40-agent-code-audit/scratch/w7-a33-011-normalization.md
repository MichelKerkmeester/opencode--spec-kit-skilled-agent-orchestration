● Todo added: Read spec and implementation files

● Read
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing/spec.md
  └ 283 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing/checkl
  ist.md
  └ 129 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ 587 lines read

● Todo started: read-spec-and-code

● Grep "RC-(2|8|10)|snake_case|camelCase|timestamp|normalize|session_id|captured_at|total_messages|s
ession_created" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing)
  └ 5 lines found

● Grep "snake_case|camelCase|session_id|sessionTitle|captured_at|capturedAt|total_messages|totalMess
ages|session_created|sessionCreated|normalized|timestamp|toISOString|Date\.parse|new
Date|TIMESTAMP_MATCH_TOLERANCE_MS|normalize" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 41 lines found

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 521-680
  └ 107 lines read

● Grep "RC-2|RC-8|RC-10|missing field normalization|timestamp format|snake_case conversion"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/011-perfect-session-capturing/spec.md)
  └ No matches found

● Grep "RC-2|RC-8|RC-10|snake_case|timestamp" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing/c
hecklist.md)
  └ 4 lines found

● Preview spec rg output
  $ python3 - <<'PY'
  from pathlib import Path
  p = Path('/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773089896166-t
  y8rb1.txt')
  if p.exists():...
  └ 10 lines...

● Grep "field-name mismatch|snake_case/camelCase|prompt relevance filtering|Synthetic
timestamps|timestamp|camelCase|snake_case|Phase 0|OpenCode-path defects"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/011-perfect-session-capturing/spec.md)
  └ 41 lines found

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773089905302-wxf17e.txt
  lines 1-220
  └ 67 lines read

● Grep "RC-8" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing)
  └ No matches found

● Grep "RC-2" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing)
  └ No matches found

● Grep "RC-10" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing)
  └ No matches found

● Grep "timestamp format|timestamp matching|loose timestamp|ISO string|toISOString|Synthetic
timestamps|timestamp tolerance" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing)
  └ 5 lines found

● Grep "missing field normalization|field normalization|normalize
missing|backfill|fallback|sessionTitle|sessionId|capturedAt"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing)
  └ 5 lines found

● Todo completed: compare-requirements, write-audit

✗ Memory stored: metadata schema
  └ ConversationCapture emits snake_case metadata keys under metadata and duplicated…

### FINDING-01: RC-2 missing-field normalization is not fully implemented
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:238-246,419-426`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `normalizeInputData()` returns a clone as soon as any of `userPrompts`, `observations`, or `recentContext` exists, so partial inputs are not backfilled; `transformOpencodeCapture()` only aliases `sessionTitle`, `sessionId`, and `capturedAt` and does not normalize absent structural fields.
- **Expected Behavior:** If RC-2 is in scope as missing-field normalization, partial capture payloads should be normalized into a complete safe shape before downstream use, with missing arrays/objects backfilled rather than passed through as-is.
- **Root Cause:** The normalizer treats partially normalized input as fully normalized and limits field repair to three top-level aliases.
- **Suggested Fix:** Backfill missing arrays/objects in both normalization paths (`exchanges ?? []`, `toolCalls ?? []`, `metadata ?? {}`, and missing MCP arrays) before returning transformed data.

### FINDING-02: RC-8 timestamp normalization uses wall-clock fallback instead of stable ordering
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:458-468`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `toSafeISOString()` converts undefined or invalid timestamps to `new Date().toISOString()`, so transformed prompts/observations get the audit-time wall clock rather than a stable capture-order timestamp.
- **Expected Behavior:** Timestamp normalization should preserve stable ordering and avoid distorting downstream `lastAction`/`nextAction`, matching the spec edge-case requirement for synthetic timestamps (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing/spec.md:251`) and checklist CHK-022 (`checklist.md:117-118`).
- **Root Cause:** The fallback path uses “now” instead of a deterministic capture-scoped value or sentinel.
- **Suggested Fix:** Fall back to `normalizedCapture.capturedAt`, source-order offsets, or a fixed sentinel strategy instead of the current wall-clock timestamp.

### FINDING-03: RC-10 snake_case conversion is only partial
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:90-97,501-507; .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:419-425`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** `opencode-capture.ts` emits snake_case metadata keys such as `total_messages`, `total_tool_calls`, `session_created`, and `session_updated`, but `input-normalizer.ts` only normalizes `session_title`, `session_id`, and `captured_at`.
- **Expected Behavior:** REQ-004 and CHK-006 require snake_case capture fields to be correctly mapped to camelCase (`spec.md:176`, `checklist.md:64-66`); the implementation should normalize the documented capture schema, not just three top-level aliases.
- **Root Cause:** The conversion step is scoped to a narrow subset of the payload and leaves `metadata` as a raw record with snake_case keys.
- **Suggested Fix:** Add a typed metadata normalizer (`totalMessages`, `totalResponses`, `totalToolCalls`, `sessionCreated`, `sessionUpdated`, `fileSummary`) or normalize the documented `ConversationCapture` schema recursively before downstream use.

### SUMMARY - Total: 3, Critical: 0, High: 1, Medium: 2, Low: 0


Total usage est:        1 Premium request
API time spent:         3m 16s
Total session time:     3m 28s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 400.5k in, 11.1k out, 233.9k cached (Est. 1 Premium request)
