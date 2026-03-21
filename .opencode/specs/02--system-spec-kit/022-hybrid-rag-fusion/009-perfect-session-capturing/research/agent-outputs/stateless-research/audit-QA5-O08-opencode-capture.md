# Audit QA5-O08: opencode-capture.ts

**File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts`
**LOC:** 523
**Auditor:** Claude Opus 4.6 (Reviewer Agent)
**Date:** 2026-03-09
**Spec:** 012 (Perfect Session Capturing) / 013 (Improve Stateless Mode)
**Confidence:** HIGH — all 523 lines read, all consumer modules traced, all findings verified against source

---

## Score Breakdown

| Dimension         | Score | Max | Notes |
|-------------------|-------|-----|-------|
| **Correctness**   | 18    | 30  | Interface mismatch causes silent data loss; timestamp matching fragile |
| **Security**      | 21    | 25  | Path construction from env vars acceptable; no injection surface |
| **Patterns**      | 16    | 20  | Mixed sync/async; missing error detail propagation |
| **Maintainability** | 11  | 15  | Well-sectioned but no JSDoc on key functions; silent fallbacks |
| **Performance**   | 8     | 10  | Sequential I/O for parts retrieval; JSONL full-scan |
| **TOTAL**         | **74** | **100** | **ACCEPTABLE — PASS with required fixes** |

---

## Adversarial Self-Check (P0/P1 Findings)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---------|-----------------|-------------------|-----------------|----------------|
| 1 | ConversationCapture vs OpencodeCapture naming mismatch | P0 | "Maybe consumer uses duck typing?" — No, data-loader.ts:160 accesses `conversation.sessionTitle` which is `undefined` on `ConversationCapture` | Confirmed — field name mismatch causes silent data loss at runtime | **P0** |
| 2 | getProjectId checks only first session file per project | P1 | "Maybe directories have only one project?" — No, multiple sessions exist per project dir | Confirmed — misses correct project if first session's directory doesn't match | **P1** |
| 3 | Prompt-to-message timestamp matching is fragile | P1 | "5s tolerance is configurable" — True, but Date parse of null/undefined yields NaN, causing all comparisons to fail silently | Confirmed — NaN propagation silently drops all prompt matches | **P1** |
| 4 | readJsonlTail leaks file handle on readline error | P1 | "readline auto-closes on end" — But errors mid-stream may not trigger close | Downgraded — Node readline does close stream on error, but file handle reference held separately | **P1** |
| 5 | buildExchanges iterates in reverse but uses forward index for prompts.find | P1 | "find() scans all prompts regardless of order" — True, but first match wins, potentially pairing wrong prompt to message | Confirmed — greedy first-match can pair wrong prompt when timestamps cluster | **P1** |
| 6 | truncateOutput off-by-one leaves room for only `limit - 20` chars of content | P2 | "Cosmetic, no data loss" | Downgraded from P1 | **P2** |

---

## P0 — BLOCKERS

### P0-1: ConversationCapture / OpencodeCapture Interface Naming Mismatch (Data Loss)

**File:** `opencode-capture.ts:79-95` vs `input-normalizer.ts:106-113`
**Impact:** Silent data loss — session metadata fields are `undefined` at consumer site

The `ConversationCapture` interface returned by `captureConversation()` uses snake_case field names:

```typescript
// opencode-capture.ts:79-95
interface ConversationCapture {
  session_id: string;     // snake_case
  session_title: string;  // snake_case
  captured_at: string;    // snake_case
  ...
}
```

But the consumer (`data-loader.ts:42,153-160`) types the result as `OpencodeCapture` from `input-normalizer.ts`, which uses camelCase:

```typescript
// input-normalizer.ts:106-113
interface OpencodeCapture {
  sessionTitle?: string;  // camelCase
  sessionId?: string;     // camelCase
  capturedAt?: string;    // camelCase
  ...
}
```

At runtime:
- `data-loader.ts:160` logs `conversation.sessionTitle` — this is **always `undefined`** because the actual field is `session_title`
- `input-normalizer.ts:527-528` passes `capture.sessionId` and `capture.capturedAt` to `TransformedCapture` — both are **always `undefined`**
- `input-normalizer.ts:501` accesses `sessionTitle` in `recentContext` — **always `undefined`**, falls back to `'OpenCode session'`

The dynamic import + `as` cast in `data-loader.ts:55` bypasses TypeScript's structural checking, so this compiles without error but fails silently at runtime.

**Evidence chain:**
1. `captureConversation()` returns `{ session_id, session_title, captured_at, ... }` (lines 441-446)
2. `data-loader.ts:55` does `await import(...) as OpencodeCaptureMod` — unsafe cast
3. `data-loader.ts:153` types result as `OpencodeCapture | null`
4. `data-loader.ts:160` reads `conversation.sessionTitle` — **undefined**
5. `transformOpencodeCapture` at `input-normalizer.ts:400` destructures `{ sessionTitle }` — **undefined**
6. Net result: session title, session ID, and captured timestamp are lost in the pipeline

**Fix:** Either rename `ConversationCapture` fields to camelCase to match `OpencodeCapture`, or add a mapping layer in the consumer. The simpler fix is aligning `ConversationCapture` to camelCase since the rest of the codebase uses camelCase.

---

## P1 — REQUIRED CHANGES

### P1-1: getProjectId Checks Only First Session File (Incorrect Project Resolution)

**File:** `opencode-capture.ts:200-218`

```typescript
if (sessions.length > 0) {
  const sessionFile = path.join(projectPath, sessions[0]);  // Only checks first!
  const content = fsSync.readFileSync(sessionFile, 'utf-8');
  const session = JSON.parse(content) as Record<string, unknown>;
  if (session.directory === directory) {
    return projectId;
  }
}
```

The function iterates project directories but only reads the **first** session file (`sessions[0]`) in each directory. If the first session file's `directory` field doesn't match, the entire project is skipped even if other session files in that directory do match.

**Impact:** `captureConversation()` throws "No OpenCode sessions found" for a valid project when the first session file alphabetically doesn't match the target directory.

**Fix:** Iterate all session files in each project directory:
```typescript
for (const sessionFile of sessions) {
  const content = fsSync.readFileSync(path.join(projectPath, sessionFile), 'utf-8');
  const session = JSON.parse(content);
  if (session.directory === directory) return projectId;
}
```

### P1-2: Timestamp Matching Produces NaN on Missing/Invalid Timestamps

**File:** `opencode-capture.ts:472-475`

```typescript
const prompt = prompts.find((p) => {
  if (!p.timestamp && !userMsg.created) return false;
  const promptTime = new Date(p.timestamp || '').getTime();
  return Math.abs(promptTime - userMsg.created) < CONFIG.TIMESTAMP_MATCH_TOLERANCE_MS;
});
```

When `p.timestamp` is `null`, `new Date(null || '')` returns `Invalid Date`, and `.getTime()` returns `NaN`. `Math.abs(NaN - number)` is `NaN`, and `NaN < 5000` is `false`. This means **every prompt with a null timestamp silently fails to match**.

The guard `if (!p.timestamp && !userMsg.created)` only returns false when **both** are falsy. If `p.timestamp` is null but `userMsg.created` is non-zero, the guard passes through to the NaN comparison.

**Impact:** Prompts without timestamps (which is legal per the `PromptEntry` interface where `timestamp: string | null`) are never matched to messages, producing exchanges with placeholder text ("User initiated conversation") instead of actual user input.

**Fix:**
```typescript
const prompt = prompts.find((p) => {
  if (!p.timestamp || !userMsg.created) return false;  // Guard BOTH individually
  const promptTime = new Date(p.timestamp).getTime();
  if (isNaN(promptTime)) return false;  // Explicit NaN guard
  return Math.abs(promptTime - userMsg.created) < CONFIG.TIMESTAMP_MATCH_TOLERANCE_MS;
});
```

### P1-3: buildExchanges Greedy First-Match Can Pair Wrong Prompt

**File:** `opencode-capture.ts:460-501`

`buildExchanges` iterates user messages in reverse order but uses `prompts.find()` which returns the **first** matching prompt. When multiple prompts fall within the tolerance window (e.g., rapid-fire commands), the same prompt can match different messages, or the wrong prompt matches first.

Additionally, matched prompts are not consumed/removed, so the same prompt can be paired to multiple user messages.

**Impact:** Exchanges may contain the wrong user input text, or the same input text duplicated across multiple exchanges.

**Fix:** Track consumed prompt indices:
```typescript
const usedPromptIndices = new Set<number>();
for (let i = 0; i < Math.min(userMessages.length, limit); i++) {
  const userMsg = userMessages[userMessages.length - 1 - i];
  const promptIdx = prompts.findIndex((p, idx) => {
    if (usedPromptIndices.has(idx)) return false;
    // ... timestamp matching logic
  });
  if (promptIdx >= 0) {
    usedPromptIndices.add(promptIdx);
    // use prompts[promptIdx]
  }
}
```

### P1-4: File Handle Leak in readJsonlTail on Partial Read Errors

**File:** `opencode-capture.ts:133-172`

The `fileHandle.close()` at line 165 is only reached on the happy path. If the `for await` loop throws after opening the file handle but before completing iteration, the outer `catch` at line 167 does not close the handle.

```typescript
const fileHandle = await fs.open(filePath, 'r');
const stream = fileHandle.createReadStream({ encoding: 'utf-8' });
// ... if error thrown here, fileHandle leaks
```

**Impact:** File descriptor leak on I/O errors. Under sustained load with many JSONL reads, could exhaust file descriptors.

**Fix:** Use `try/finally`:
```typescript
const fileHandle = await fs.open(filePath, 'r');
try {
  // ... readline logic
} finally {
  await fileHandle.close();
}
```

### P1-5: getProjectId Uses Synchronous I/O in an Otherwise Async Module

**File:** `opencode-capture.ts:193-224`

`getProjectId` is the only function using synchronous `fs` operations (`existsSync`, `readdirSync`, `readFileSync`) while every other function in the module uses `async/await`. This is called from `captureConversation` (async context), meaning it blocks the event loop while scanning potentially many project directories and reading session files.

**Impact:** Event loop blocking during directory scanning. With many project directories or large session files, this can cause noticeable latency.

**Fix:** Convert to async using `fs.promises.readdir` and `fs.promises.readFile`, matching the pattern used by every other function in this module.

---

## P2 — SUGGESTIONS

### P2-1: truncateOutput Content Budget Calculation

**File:** `opencode-capture.ts:399-406`

```typescript
const half = Math.floor(limit / 2) - 10;
```

When `limit` is small (e.g., 20), `half` becomes 0, and the result is just the truncation marker with no content. With the default `limit` of 500, `half` = 240, so 480 chars of content + 20 chars of marker = 500. The `-10` accounts for the marker text (`\n... [truncated] ...\n` = 23 chars), but the math is imprecise — the actual marker is 23 chars, not 20.

**Suggestion:** Use `Math.floor((limit - marker.length) / 2)` for precise budget allocation.

### P2-2: Silent Error Swallowing in readJsonlTail

**File:** `opencode-capture.ts:157-161`

```typescript
} catch (error: unknown) {
  if (error instanceof Error) {
    // Skip malformed lines
  }
}
```

The `if (error instanceof Error)` block is empty and the condition serves no purpose — non-Error exceptions are also silently swallowed because there's no `else` branch with any action. The entire catch block is equivalent to just `catch { }`.

**Suggestion:** Either remove the dead `instanceof` check or add a debug-level log for malformed lines to aid troubleshooting.

### P2-3: OPENCODE_STORAGE and PROMPT_HISTORY Exported as Mutable

**File:** `opencode-capture.ts:101-109, 521-522`

Both constants are declared with `const` but exported directly. Since they're strings (immutable primitives), this is safe, but the export surface is larger than necessary for internal implementation details.

**Suggestion:** Consider not exporting these constants unless external consumers need them. Currently no external consumer references them.

### P2-4: PromptEntry.parts is typed as unknown[]

**File:** `opencode-capture.ts:20`

The `parts` field is typed `unknown[]` and populated from the raw JSONL data without validation. It's never consumed by any downstream code in the codebase (only `input`, `timestamp`, and `mode` are used in `buildExchanges`).

**Suggestion:** Either type it more precisely based on actual JSONL schema, or remove it from the interface if unused.

### P2-5: Missing Error Context in captureConversation Throws

**File:** `opencode-capture.ts:422-428`

The function throws generic `Error` objects without codes or structured context:
```typescript
throw new Error('OpenCode storage not found');
throw new Error(`No OpenCode sessions found for: ${directory}`);
throw new Error('No active session found');
```

**Suggestion:** Use structured errors or error codes to allow callers to distinguish between "OpenCode not installed" vs "wrong project" vs "no active session" without string parsing.

### P2-6: getRecentSessions Reads All Session Files Before Sorting

**File:** `opencode-capture.ts:226-258`

All session files are read and parsed, then sorted by `updated`, then sliced to `limit`. For projects with many sessions, this reads unnecessary files.

**Suggestion:** Consider using file modification time as a pre-filter or implementing pagination.

### P2-7: buildExchanges Missing Type for `response` Variable

**File:** `opencode-capture.ts:478-481`

```typescript
const response = responses.find((r) => {
  const responseMsg = messages.find((m) => m.id === r.messageId);
  return responseMsg?.parent_id === userMsg.id;
});
```

The nested `messages.find()` inside `responses.find()` creates O(n*m) complexity per user message. With many messages and responses, this becomes O(n^2 * m).

**Suggestion:** Pre-build a `Map<string, MessageInfo>` for O(1) message lookups.

---

## Positive Highlights

1. **Well-organized module structure** — The 9-section layout (Interfaces, Storage Paths, Utilities, Prompt History, Session Discovery, Message Retrieval, Part Retrieval, Full Conversation Capture, Exports) makes navigation straightforward.

2. **Defensive null handling** — `readJsonSafe`, `pathExists`, and the `readJsonlTail` buffer management all handle errors gracefully without crashing.

3. **Configurable truncation** — `truncateOutput` uses `CONFIG.TOOL_OUTPUT_MAX_LENGTH` rather than magic numbers, allowing runtime tuning.

4. **Smart JSONL tail reading** — The buffer pruning strategy (`buffer.splice(0, buffer.length - limit)` when buffer exceeds `limit * 2`) keeps memory bounded while reading large JSONL files.

5. **Clean separation of concerns** — Each function handles exactly one storage artifact type (sessions, messages, parts), making the module easy to test in isolation.

---

## Files Reviewed

| File | Lines | Issues |
|------|-------|--------|
| `extractors/opencode-capture.ts` | 523 | 1 P0, 5 P1, 7 P2 |
| `core/config.ts` | 310 | (reference only) |
| `utils/input-normalizer.ts` | 546 | (consumer, interface mismatch source) |
| `loaders/data-loader.ts` | 196 | (consumer, unsafe cast source) |
| `extractors/session-extractor.ts` | 475 | (sibling, pattern reference) |
| `extractors/collect-session-data.ts` | 853 | (consumer, pattern reference) |
| `extractors/conversation-extractor.ts` | 253 | (sibling, pattern reference) |
| `extractors/index.ts` | 37 | (barrel export check) |

---

## Recommendation

**CONDITIONAL PASS (74/100)** — The module is structurally sound and well-organized, but the P0 interface mismatch (ConversationCapture vs OpencodeCapture naming) causes silent data loss of session title, session ID, and capture timestamp in production. This must be fixed before the module can be considered reliable. The five P1 issues (incomplete project scanning, NaN timestamp propagation, greedy prompt matching, file handle leak, sync I/O blocking) should be addressed in the same fix batch.
