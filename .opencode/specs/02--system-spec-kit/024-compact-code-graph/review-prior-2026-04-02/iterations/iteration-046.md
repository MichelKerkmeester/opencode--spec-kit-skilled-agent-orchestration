# Review Iteration 046
## Dimension: D2 Security
## Focus: Phase 022 Gemini hooks — stdin parsing, output sanitization, state file handling

## Findings

### [P2] F055 - compact-inject.ts uses unsanitized payload in wrappedPayload but sanitizedPayload only for logging
- File: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:53-54
- Evidence: Line 53 calls `sanitizeRecoveredPayload(payload)` and stores result in `sanitizedPayload`, but this value is only used for the log message (line 55 — char count). Line 54 passes the original unsanitized `payload` to `wrapRecoveredCompactPayload(payload, cachedAt)`. The sanitized version is never actually used for output. If `sanitizeRecoveredPayload` strips dangerous content (e.g., prompt injection markers), this sanitization is bypassed.
- Fix: Pass `sanitizedPayload` to `wrapRecoveredCompactPayload` instead of `payload`.

### [P2] F056 - session-stop.ts reads transcript file without size limit
- File: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:27-28
- Evidence: `detectSpecFolder(transcriptPath)` calls `readFileSync(transcriptPath, 'utf-8')` without any size limit. A very large transcript file (e.g., multi-MB from a long session) could cause high memory usage in the hook process. The hook has a global timeout via `withTimeout` for stdin reading, but the file read itself has no guard.
- Fix: Read only the last N bytes of the transcript (e.g., `fs.readFileSync` with a range, or tail the file) since we're only looking for spec folder patterns.

## Verified Correct (Security perspective)
- shared.ts: parseGeminiStdin safely parses JSON, returns null on failure — no injection vector
- shared.ts: formatGeminiOutput correctly wraps in JSON structure, no raw string concatenation with user input
- session-prime.ts: handleCompact checks cache TTL and rejects stale payloads (30-min TTL)
- session-prime.ts: handleCompact checks for NaN cachedAt to prevent invalid date injection
- compact-cache.ts: buildCompactContext filters transcript lines, limits file paths to 20, topics to 10
- compact-cache.ts: tailFile only reads last 50 lines — bounded memory usage
- compact-cache.ts: truncateToTokenBudget enforces COMPACTION_TOKEN_BUDGET on cached payload
- compact-inject.ts: checks CACHE_TTL_MS (30 min) before injecting — stale payloads rejected
- All hooks use process.exit(0) in finally block — clean exit even on unhandled errors
- All hooks wrap main() in .catch() — unhandled errors logged via hookLog, not thrown
- No file writes to user-controlled paths — state writes go through hook-state.ts
- No dynamic code execution, no shell spawning, no network calls in any Gemini hook

## Iteration Summary
- New findings: 2 (P2)
- Items verified correct: 12
- Reviewer: Claude Opus 4.6 (1M context)
