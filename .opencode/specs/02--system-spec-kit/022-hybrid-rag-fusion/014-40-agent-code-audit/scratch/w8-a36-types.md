● skill(sk-code--review)

● SQL: Create audit todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Todo started:

● Grep "\bas any\b|as unknown as|Record<[^>]*any|:\s*any\b|<any>|Array<any>|Promise<any>" in
{core/file-writer.ts,core/workflow.ts,core/config.ts,extractors/collect-session-data.ts,extractors/c
ontamination-filter.ts,extractors/decision-extractor.ts,extractors/file-extractor.ts,extractors/open
code-capture.ts,utils/file-helpers.ts,utils/input-normalizer.ts,utils/slug-utils.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep
"^export\s+(async\s+)?function\s+|^export\s+const\s+\w+\s*=\s*(async\s*)?\(|^export\s+class\s+" in
{core/file-writer.ts,core/workflow.ts,core/config.ts,extractors/collect-session-data.ts,extractors/c
ontamination-filter.ts,extractors/decision-extractor.ts,extractors/file-extractor.ts,extractors/open
code-capture.ts,utils/file-helpers.ts,utils/input-normalizer.ts,utils/slug-utils.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Get line counts for audit files
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts' && wc -l core/file-writer.ts
  core/workflow.ts core/config.ts extractors/collect-session-data.ts
  extractors/contamination-filter.ts extractors/decision-extractor.ts
  extractors/file-extractor.ts extractors/opencode-capture.ts utils/file-helpers.ts ...
  └ 14 lines...

● Run TypeScript scripts checks
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts' && npm run -s check
  └ 5 lines...

● Parse AST for assertions and exports
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts' && node - <<'NODE'
  const ts = require('typescript');
  const files = [
    'core/file-writer.ts','core/workflow.ts','core/config.ts',...
  └ 533 lines...

● Read .opencode/skill/system-spec-kit/scripts/core/file-writer.ts lines 1-130
  └ 130 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 740-920
  └ 181 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 90-280
  └ 191 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 430-780
  └ 351 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts lines 120-470
  └ 351 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts lines 130-420
  └ 291 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 120-560
  └ 441 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 130-440
  └ 311 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts lines 1-120
  └ 87 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts lines 1-120
  └ 88 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts lines 1-220
  └ 185 lines read

● Build and lint scripts workspace
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts' && npm run -s build && npm run -s lint
  └ 1 line...

● Run repository typecheck
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && npm run -s typecheck
  └ 1 line...

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 1-220
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts lines 1-120
  └ 120 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 1-130
  └ 129 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-120
  └ 120 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 1-120
  └ 120 lines read

● Grep "^export\s*\{" in
{core/file-writer.ts,core/workflow.ts,core/config.ts,extractors/collect-session-data.ts,extractors/c
ontamination-filter.ts,extractors/decision-extractor.ts,extractors/file-extractor.ts,extractors/open
code-capture.ts,utils/file-helpers.ts,utils/input-normalizer.ts,utils/slug-utils.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "^function\s+\w+\(" in
{core/file-writer.ts,core/workflow.ts,core/config.ts,extractors/collect-session-data.ts,extractors/c
ontamination-filter.ts,extractors/decision-extractor.ts,extractors/file-extractor.ts,extractors/open
code-capture.ts,utils/file-helpers.ts,utils/input-normalizer.ts,utils/slug-utils.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● List exported functions and return type annotations
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts' && node - <<'NODE'
  const ts = require('typescript');
  const files = [
    'core/file-writer.ts','core/workflow.ts','core/config.ts',...
  └ 119 lines...

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts lines 1-140
  └ 139 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 1-120
  └ 120 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 240-340
  └ 101 lines read

● Grep "export\s+(async\s+)?function\s+extractConversations|export\s*\{\s*extractConversations|funct
ion\s+extractConversations" in **/*.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Grep "export\s+function\s+validateDataStructure|function\s+validateDataStructure|export\s*\{\s*val
idateDataStructure" in **/*.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Grep "export\s+(async\s+)?function\s+extractDiagrams|export\s*\{\s*extractDiagrams|function\s+extr
actDiagrams" in **/*.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Read .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts lines 1-90
  └ 90 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts lines 1-160
  └ 160 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts lines 1-130
  └ 122 lines read

● Grep "export interface FileEntry" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 1 line found

● Read .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts lines 80-120
  └ 40 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts lines 90-200
  └ 111 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 415-620
  └ 206 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 780-857
  └ 78 lines read

● Grep "export interface DecisionNode|type DecisionNode"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts)
  └ 1 line found

● Read .opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts lines 55-110
  └ 56 lines read

● Todo completed: inspect-target-files, produce-audit

No `as any` casts or missing return types on exported functions were present in these 11 files; the issues below are the unsafe assertions, generic misuse, and permissive contracts that still weaken type safety.

### FINDING-01: Generic JSON helpers can return arbitrarily shaped data as trusted types
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:127-130,136-167`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `readJsonSafe<T>` and `readJsonlTail<T>` parse JSON and immediately cast the result to `T`, so any malformed storage payload is treated as a valid typed object by every caller.
- **Expected Behavior:** Parsed JSON should remain `unknown` until it passes an explicit runtime validator for the expected shape.
- **Root Cause:** The generic type parameter is being used as an unchecked assertion boundary instead of a proven conversion.
- **Suggested Fix:** Change both helpers to return `unknown`/`unknown[]` (or accept a validator callback such as `readJsonSafe(file, isSessionRecord)`), and only produce typed values after guard/schema validation.

### FINDING-02: Direct field assertions silently manufacture typed session/message/tool records from unknown storage
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:191-198,279-287,323-334,392-427,544-545`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Storage records are read as `Record<string, unknown>` and then fields are asserted with casts like `msg.id as string`, `msg.time as Record<string, number>`, and `part.state as Record<string, unknown>`, with invalid values quietly falling back to `0`, `null`, or `'unknown'`.
- **Expected Behavior:** Invalid records should be rejected or normalized via guarded parsing, so ordering, session matching, and tool correlation never proceed on fabricated typed data.
- **Root Cause:** There is no typed parsing layer between raw JSON storage and the `SessionInfo` / `MessageInfo` / `ToolExecution` domain types.
- **Suggested Fix:** Add dedicated parsers/guards (`parseSessionInfo`, `parseMessageInfo`, `parseToolPart`, `parseTimeRecord`) that check each field with `typeof`/shape guards and skip or log malformed records instead of casting.

### FINDING-03: `transformKeyDecision` can put non-strings into a `string[]`
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:143-149`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Alternative objects are normalized with chained assertions like `(alt as Record<string, unknown>).label as string`, so numbers/objects can flow into `alternatives: string[]` and later string operations (`join`, narrative building) run on values that were never proven to be strings.
- **Expected Behavior:** Only actual strings should enter `alternatives`; non-string labels should be ignored or explicitly stringified in one controlled fallback path.
- **Root Cause:** Assertions are being used where field-by-field narrowing is required.
- **Suggested Fix:** Replace the chained casts with a helper such as `getFirstString(alt, ['label', 'title', 'name'])`, and fall back to `JSON.stringify(alt)` only when no string field is present.

### FINDING-04: `transformOpencodeCapture` hides a real contract mismatch behind a double assertion
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:415-425`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** The function casts `capture` through `unknown` to `Record<string, unknown>` in order to read `session_title`, `session_id`, and `captured_at`, even though those fields are part of the accepted runtime shape.
- **Expected Behavior:** The accepted capture type should explicitly model both camelCase and snake_case aliases, so no `unknown as` bridge is needed.
- **Root Cause:** The runtime contract is broader than the declared `OpencodeCapture` interface, so the code escapes the type system instead of expressing the union/alias shape.
- **Suggested Fix:** Define a proper input type such as `type CaptureLike = OpencodeCapture & Partial<{ session_title: string; session_id: string; captured_at: string }>;` and normalize from that typed shape.

### FINDING-05: Workflow-level parameter casts suppress extractor contract drift
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:765-831,900-905`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `runWorkflow` repeatedly forces `collectedData` into extractor-specific parameter types with casts like `as Parameters<typeof extractConversations>[0]` and `as Parameters<typeof extractDecisions>[0]`, plus observation-array casts for summary helpers.
- **Expected Behavior:** The workflow should pass a shared, structurally compatible collected-data type to downstream extractors without any call-site assertions.
- **Root Cause:** Multiple near-duplicate collected-data interfaces have drifted apart, and the workflow now bypasses the compiler instead of reconciling them.
- **Suggested Fix:** Introduce a shared `ReadonlyCollectedData`/normalized extractor input type, update extractors to consume that shared contract, and remove the `Parameters<typeof ...>[0]` casts entirely.

### FINDING-06: Broad index signatures plus shallow validation keep forcing unsafe downstream assertions
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:46-59,74-83,307-356`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `RawInputData` and `NormalizedData` accept arbitrary keys via `[key: string]: unknown`, while `validateInputData` mostly checks only that top-level arrays exist; malformed element shapes can still pass through and later require `as FileEntry`, `as Record<string, unknown>`, or `as RecentContextEntry` elsewhere in the pipeline.
- **Expected Behavior:** Supported input shapes should be explicit and validated deeply enough that downstream code can narrow instead of assert.
- **Root Cause:** The index signatures are acting as an escape hatch for unmodeled payload variants, which weakens the compiler’s ability to catch typos and incompatible shapes.
- **Suggested Fix:** Replace the open-ended index signatures with explicit unions for manual/MCP/OpenCode input forms plus a dedicated `extra?: Record<string, unknown>` bag, and add element-level guards for `FILES`, `keyDecisions`, `recentContext`, and `observations`.

### SUMMARY - Total: 6, Critical: 0, High: 2, Medium: 4, Low: 0


Total usage est:        1 Premium request
API time spent:         6m 34s
Total session time:     7m 1s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 1.6m in, 19.1k out, 1.4m cached (Est. 1 Premium request)
