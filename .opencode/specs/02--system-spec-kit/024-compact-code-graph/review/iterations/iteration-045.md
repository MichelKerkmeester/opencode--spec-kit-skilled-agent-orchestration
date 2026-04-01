# Review Iteration 045
## Dimension: D2 Security
## Focus: Phases 018-020 input validation, path traversal in ensure-ready, injection in session-resume

## Findings

### [P2] F053 - ensure-ready.ts passes unsanitized file paths from DB to indexFiles
- File: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:78-84
- Evidence: `trackedFiles` are read from `code_files` table and passed directly to `ensureFreshFiles()` and eventually to `indexFiles()` as includeGlobs. If a malicious or corrupted DB entry contains a path traversal string (e.g., `../../../../etc/passwd`), it would be passed through. However, practical risk is LOW because: (a) the DB is local and not user-writeable externally, (b) indexFiles reads file content for parsing, not execution, (c) the attacker would need to have already compromised the local DB.
- Fix: Add a path sanity check (must be under rootDir) before passing stale files to indexFiles.

### [P2] F054 - session-resume.ts leaks absolute binary path in response
- File: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:105-108
- Evidence: `binaryPath: cccBin` exposes the full absolute filesystem path (e.g., `/Users/michel/.../.venv/bin/ccc`) in the MCP response sent to the LLM. This is information disclosure of the local filesystem structure.
- Fix: Omit `binaryPath` from the response, or replace with a relative path.

## Verified Correct (Security perspective)
- ensure-ready.ts: getCurrentGitHead uses execSync with `stdio: ['ignore', 'pipe', 'pipe']` — no stdin injection possible
- ensure-ready.ts: 5s timeout on git command prevents hanging
- ensure-ready.ts: AUTO_INDEX_TIMEOUT_MS (10s) prevents resource exhaustion from runaway indexing
- memory-surface.ts: extractContextHint validates type and minimum length (>= 3 chars)
- memory-surface.ts: constitutional memory SQL uses parameterized queries (no injection)
- memory-surface.ts: token budget enforcement caps output size
- session-resume.ts: all three sub-calls are wrapped in independent try/catch
- context.ts/query.ts: ensureCodeGraphReady failure is non-blocking (caught and ignored)
- Gemini shared.ts: parseGeminiStdin uses JSON.parse which rejects non-JSON input
- No eval(), no dynamic require(), no shell injection vectors found in phases 018-020

## Iteration Summary
- New findings: 2 (P2)
- Items verified correct: 10
- Reviewer: Claude Opus 4.6 (1M context)
