# Applied: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md

## Source Flagging

- Sub-packets: 03
- Severity (from merged report): MED

## Changes Applied

### Added `SPECKIT_CODEX_HOOK_TIMEOUT_MS` row to §2 INFRASTRUCTURE

Flagged by sub-packet 03 (`003-hook-parity-remediation`). The env reference previously documented adjacent Codex/session knobs (`MCP_SESSION_RESUME_AUTH_MODE`, session/planner flags) but had no entry for the Codex hook timeout knob even though it is read at runtime and covered by Phase B verification tests.

**Before** (last row in §2 table):
```
| `SPECKIT_QUALITY_AUTO_FIX` | `false` | boolean | Opt-in save-time quality auto-fix retries for planner-first flows. Disabled by default on saves. | `lib/search/search-flags.ts` |
```

**After** (new row appended just before the `<!-- /ANCHOR:infrastructure -->` close):
```
| `SPECKIT_CODEX_HOOK_TIMEOUT_MS` | `3000` | number | Timeout (ms) for the Codex `UserPromptSubmit` hook and the skill-advisor subprocess execution when invoked from Codex. On timeout, the Codex hook returns a stale advisory brief instead of empty output, so operators who raise this value trade responsiveness for fresher advisor data. Set via environment variable before launching Codex. [026/009/012, flagged by 03] | `hooks/codex/user-prompt-submit.ts`, `skill-advisor/lib/subprocess.ts` |
```

Sources for the default value `3000`:

- `mcp_server/hooks/codex/user-prompt-submit.ts:86` — `const DEFAULT_CODEX_HOOK_TIMEOUT_MS = 3000;`
- `mcp_server/skill-advisor/lib/subprocess.ts:63` — `const DEFAULT_TIMEOUT_MS = 3000;`

Runtime-read sites (both in production code paths):

- `mcp_server/hooks/codex/user-prompt-submit.ts:145` — `return positiveIntFromEnv(process.env.SPECKIT_CODEX_HOOK_TIMEOUT_MS, DEFAULT_CODEX_HOOK_TIMEOUT_MS);`
- `mcp_server/skill-advisor/lib/subprocess.ts:75` — `return parsePositiveInt(process.env.SPECKIT_CODEX_HOOK_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);`

Test coverage:

- `mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:245` — `SPECKIT_CODEX_HOOK_TIMEOUT_MS: '3000',`

## Evidence Links

- Merged-report row: `merged-impact-report.md` — `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, MED severity, flagged by 03 only.
- Per-sub-packet evidence source: `impact-analysis/03-impact.md` — row reading `Phase B verification exercises SPECKIT_CODEX_HOOK_TIMEOUT_MS, and the timeout behavior now matters because Codex returns a stale advisory instead of empty output on timeout.`
- Sub-packet implementation-summary: `003-hook-parity-remediation/implementation-summary.md` (not re-read here — the 03-impact.md row already captures the relevant Evidence).

## Verification

- **Frontmatter parses**: ENV_REFERENCE.md has no YAML frontmatter (standard markdown doc); H1/heading structure unchanged.
- **Anchors paired**: `<!-- ANCHOR:infrastructure -->` / `<!-- /ANCHOR:infrastructure -->` preserved; the new row was inserted INSIDE the anchor block, before the closing tag.
- **No unrelated content deleted**: Only one new line inserted; all existing INFRASTRUCTURE rows (including `SPECKIT_DB_DIR` through `SPECKIT_QUALITY_AUTO_FIX`) remain intact.
- **Column alignment**: New row uses the same 5-column structure (`Variable | Default | Type | Description | Source`) as siblings.

## Deferred / Unchanged

- **NEEDS VERIFICATION flag from 03-impact.md**: The original 03-impact.md called out that packet docs do not explicitly say whether this is a public operator-facing knob or an internal/debug override. Resolution: the code clearly uses `process.env.SPECKIT_CODEX_HOOK_TIMEOUT_MS` as a normal user-overridable env var (same shape as every other `SPECKIT_*` knob in §2 INFRASTRUCTURE), and Phase B test fixtures set it explicitly. Documenting it as public is the correct call. If the project later decides it is internal-only, this row can be moved to §17 DEPRECATED or prefixed with "(internal)" without further analysis.
- No changes applied to §1 OVERVIEW, §18 QUICK START EXAMPLES, or §17 DEPRECATED — the flag only required the one-row addition.
- **Slot 12 agent failure note**: The originally dispatched codex gpt-5.4 agent (PID 6956) hung at startup without producing output or applying the edit. It was killed and the change was applied manually by the claude-opus-4-7 orchestrator using the same evidence base the agent would have consumed.
