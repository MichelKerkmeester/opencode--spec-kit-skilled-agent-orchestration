● skill(sk-code--review)

● skill(sk-code--opencode)

● Todo added: Audit opencode capture parser

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 1-end
  └ 587 lines read

● Grep "\bConversationCapture\b" in **/*.{ts,tsx}
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public)
  └ 4 lines found

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 380-460
  └ 81 lines read

● Grep "TIMESTAMP_MATCH_TOLERANCE_MS|TOOL_OUTPUT_MAX_LENGTH" in **/*.{ts,tsx}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 7 lines found

● Grep "captureConversation\(|getRecentPrompts\(|getProjectId\(|readJsonlTail\(" in **/*.{ts,tsx}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 7 lines found

● Grep "prompt-history.jsonl|\.local/share/opencode/storage|sessionID|parentID|modelID|callID" in
**/*.{ts,tsx,js,json,md} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 7 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 1-140
  └ 140 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 260-320
  └ 61 lines read

● Read .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts lines 1-220
  └ 195 lines read

● Glob "**/*opencode-capture*.{ts,tsx,js}" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts
  └ 1 file found

● Grep "interface OpencodeCapture|type OpencodeCapture" in **/*.{ts,tsx}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 80-180
  └ 101 lines read

● Grep
"buildExchanges|truncateOutput\(|getSessionResponses\(|getToolExecutions\(|getRecentSessions\(" in
**/*.{ts,tsx} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 10 lines found

● Grep "TOOL_OUTPUT_MAX_LENGTH|timestampMatchToleranceMs|toolOutputMaxLength" in
**/*.{json,jsonc,ts,tsx,md} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 11 lines found

● Grep "ses_|msg_|prt_" in **/*.{ts,tsx,md,js} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 4 lines found

● Grep "RC-1|RC-8|RC-10|16-day|timestamp match|prompt history|opencode capture" in
**/*.{ts,tsx,md,json} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 9 lines found

● Grep "\.local/share/opencode/storage|prompt-history\.jsonl|session/|message/|part/" in
**/*.{ts,tsx,md,js,json} (/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public)
  └ 5 lines found

● Inspect local OpenCode storage schema safely
  $ python3 - <<'PY'
  from pathlib import Path
  import json
  home = Path.home()
  base = home / '.local/share/opencode/storage'...
  └ 118 lines...

● Count prompt timestamps and inspect part snapshot shape
  $ python3 - <<'PY'
  from pathlib import Path
  import json
  home = Path.home()
  prompt = home / '.local/state/opencode/prompt-history.jsonl'...
  └ 66 lines...

● read_bash
  └ 5 lines...

● stop_bash
  └ 1 line...

● Inspect sample part snapshot keys only
  $ python3 - <<'PY'
  from pathlib import Path
  import json
  base = Path.home() / '.local/share/opencode/storage/part'
  text_sample = tool_sample = None...
  └ 59 lines...

● Sample message schema frequencies
  $ python3 - <<'PY'
  from pathlib import Path
  import json
  base = Path.home() / '.local/share/opencode/storage/message'
  count = 0...
  └ 34 lines...

● Inspect prompt history part keys only
  $ python3 - <<'PY'
  from pathlib import Path
  import json
  prompt = Path.home() / '.local/state/opencode/prompt-history.jsonl'
  if not prompt.exists():...
  └ 19 lines...

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 186-218
  └ 33 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 136-176
  └ 41 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 225-301
  └ 77 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 382-458
  └ 77 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 464-565
  └ 102 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 118-135
  └ 17 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 308-380
  └ 73 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 415-430
  └ 16 lines read

● Todo completed: audit-opencode-capture

### FINDING-01: Session-scoped prompt capture breaks when prompt-history entries omit timestamps
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:193-195,206-210,483,525-531,544-556`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The code treats `entry.timestamp` as required for session filtering and prompt/message pairing. When prompt-history rows do not carry that field, `getRecentPrompts()` drops every prompt and `buildExchanges()` falls back to `summary.title` or generic placeholder text.
- **Expected Behavior:** Real user prompts should still be recovered when prompt-history timestamps are absent, or the capture should fail explicitly instead of silently producing placeholder exchanges.
- **Root Cause:** The implementation hard-depends on an optional/undocumented `timestamp` property in JSONL prompt-history rows.
- **Suggested Fix:** Validate the prompt-history schema up front; if timestamps are unavailable, pair prompts by order/session context or fall back to message-derived content instead of silently degrading.

### FINDING-02: `readJsonlTail()` is not a true tail reader and limits before filtering
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:136-167,191-213`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** The function streams the entire JSONL file from the beginning, keeps only the last `limit` parsed rows, and only then applies session-time filtering. Relevant prompts can be lost if unrelated rows occupy the raw tail, and runtime scales linearly with total history size.
- **Expected Behavior:** Tail parsing should collect the last `limit` relevant prompts for the target session without scanning the full file on every capture.
- **Root Cause:** The limit is applied to global rows instead of matching rows, and the implementation is a full-file forward scan rather than a reverse tail scan.
- **Suggested Fix:** Implement block-based reverse scanning, or keep scanning until `limit` in-window prompts have been collected.

### FINDING-03: Session window filtering ignores the configured timestamp tolerance
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:203-210,531`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `getRecentPrompts()` requires `sessionStart <= ts <= sessionEnd` exactly, while `buildExchanges()` separately allows a tolerance window. Prompts that are only slightly outside the stored session bounds are discarded before matching, and a delta exactly equal to the configured tolerance is rejected because the comparison uses `<` instead of `<=`.
- **Expected Behavior:** Session scoping and prompt/message matching should follow one consistent tolerance policy.
- **Root Cause:** Time-window filtering and prompt matching implement different comparison semantics.
- **Suggested Fix:** Expand session bounds by `CONFIG.TIMESTAMP_MATCH_TOLERANCE_MS` and make the final tolerance comparison inclusive.

### FINDING-04: Prompt/message pairing can attach the wrong prompt to a user message
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:522-535`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The matcher uses `findIndex()` and the first unused prompt whose absolute timestamp delta is within tolerance. In bursts of nearby prompts, the newest user message can claim an older prompt, and a later prompt can match an earlier message because causality is ignored.
- **Expected Behavior:** Each user message should be matched to the nearest valid prompt in causal order.
- **Root Cause:** The algorithm searches from the start of the prompt list and uses `Math.abs()` instead of choosing the nearest preceding candidate.
- **Suggested Fix:** Search prompts in reverse chronological order, require causal ordering, and select the smallest unused delta rather than the first hit.

### FINDING-05: Project discovery depends on raw directory string equality
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:225-250,472-475`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `getProjectId()` only matches when `session.directory === directory`. Equivalent paths that differ by symlink resolution, trailing slash, relative vs absolute form, or platform-specific casing can fail discovery and make `captureConversation()` throw `No OpenCode sessions found`.
- **Expected Behavior:** Semantically identical directories should resolve to the same project.
- **Root Cause:** The comparison is performed on raw strings without normalization or canonicalization.
- **Suggested Fix:** Canonicalize both paths with `realpath`/`normalize` before comparison, and apply case folding on case-insensitive platforms.

### FINDING-06: I/O and parse failures are silently downgraded to empty data
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:118-133,168-175,271-296,315-379`
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Permission errors, malformed JSON, directory read failures, and other storage problems are mostly swallowed as `false`, `null`, or `[]`. Callers cannot distinguish “missing” from “corrupt,” so capture can return partial or misleading data with little or no diagnostics.
- **Expected Behavior:** Only true absence should degrade to empty results; corruption and access failures should be surfaced or logged with file-level context.
- **Root Cause:** Core file/directory helpers use blanket catch blocks and broad success-shaped fallbacks.
- **Suggested Fix:** Treat `ENOENT` separately from parse/access errors, log path-specific failures, and propagate non-recoverable errors or collect structured warnings in the capture payload.

### FINDING-07: `ConversationCapture` is only nominally type-safe
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:127-133,279-287,323-335,418-427,501-507`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Untrusted JSON from disk is cast directly into typed objects. Truthy non-object values can flow into `summary`, `input`, and metadata fields, and string/invalid numeric values can populate properties declared as numbers.
- **Expected Behavior:** The exported `ConversationCapture` contract should be enforced at runtime, not just in TypeScript annotations.
- **Root Cause:** `as Record<string, unknown>` and similar assertions are used as if they were validation.
- **Suggested Fix:** Add runtime schema guards/parsers for session, message, and part files before constructing typed capture objects.

### FINDING-08: Truncation is inconsistent and not grapheme-safe
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:437-453,545-548`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Truncation uses `Array.from()`, which is code-point aware but can still split grapheme clusters such as flags, ZWJ emoji, and combining characters. Assistant responses are also hard-cut with no truncation marker, while tool outputs use a separate mid-string marker strategy.
- **Expected Behavior:** All visible truncation should be grapheme-safe and consistently signal when content has been shortened.
- **Root Cause:** There are two ad hoc truncation paths, both based on code-point slicing rather than grapheme segmentation.
- **Suggested Fix:** Centralize truncation in one helper using `Intl.Segmenter` (or equivalent) and apply the same marked policy to assistant responses and tool outputs.

### FINDING-09: `captureConversation()` re-reads the same storage trees multiple times
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:382-434,484-486,538-540`
- **Severity:** LOW
- **Category:** PERFORMANCE
- **Current Behavior:** `captureConversation()` loads session messages once, then `getSessionResponses()` and `getToolExecutions()` each reload messages and rewalk part directories. Response assembly also repeatedly scans `messages` with `find()` inside a filter.
- **Expected Behavior:** One capture pass should load messages and parts once and reuse indexed data.
- **Root Cause:** The helper layer has no shared cache/index and repeatedly performs filesystem and linear-search work.
- **Suggested Fix:** Load messages once, memoize parts per message, and build message/parent lookup maps before assembling responses and tool calls.

### SUMMARY - Total: 9, Critical: 0, High: 3, Medium: 4, Low: 2


Total usage est:        1 Premium request
API time spent:         7m 1s
Total session time:     8m 4s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 1.0m in, 23.5k out, 852.4k cached (Est. 1 Premium request)
