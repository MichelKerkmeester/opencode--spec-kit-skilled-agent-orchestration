# Applied: .opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md

## Source Flagging
- Sub-packets: 02,10
- Severity (from merged report): HIGH

## Changes Applied
- Added native Skill Advisor verification guidance to the install verification step.
  - Before: the tool list ended at `session_bootstrap` / `session_resume` and did not mention `advisor_recommend`, `advisor_status`, or `advisor_validate`.
  - After: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:440-445` now adds the three advisor tools and points installers to `./skill-advisor/INSTALL_GUIDE.md` and `./skill-advisor/README.md`.
  - After: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:470-475` now includes an explicit checklist item for the advisor tools.
  - Flagged by: 02

- Replaced the stale Copilot runtime row that still described the old `.github/hooks/...` startup path.
  - Before: `| Copilot | .vscode/mcp.json | ... .github/hooks/superset-notify.json ... .github/hooks/scripts/session-start.sh ... |`
  - After: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:139` now says Copilot uses merged `.claude/settings.local.json` matcher wrappers with top-level `type` / `bash` / `timeoutSec` fields and writer-backed `UserPromptSubmit` / `SessionStart` commands.
  - Flagged by: 10

- Reconciled the Codex runtime row to the POST-05 canonical state while updating the same runtime coverage table.
  - Before: `| Codex | .codex/config.toml | ... not a native SessionStart lifecycle hook. |`
  - After: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137` now states native `SessionStart` and `UserPromptSubmit` support when `[features].codex_hooks = true` and `~/.codex/hooks.json` is wired, with `/spec_kit:resume` or `session_bootstrap` as fallback.
  - Required by: POST-05 Codex reconciliation rule in the packet instructions

## Evidence Links
- Merged report: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/merged-impact-report.md:41`
- Sub-packet 02 row: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/02-impact.md:21`
- Sub-packet 02 evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/02-impact.md:34`
- Sub-packet 10 row: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/10-impact.md:29`
- Sub-packet 10 evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/10-impact.md:46-48`
- Deeper evidence read:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:41-55`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:22-33`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:22-24`

## Verification
- Frontmatter parses: no YAML frontmatter block existed before or after the edit; the file still begins with the H1 heading, so there was no frontmatter to corrupt.
- Anchors are still paired: the file contains no `<!-- ANCHOR:* -->` blocks before or after the edit.
- No unrelated content was deleted: `git diff -- .opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` shows only the runtime coverage table and the verification section hunks.

## Deferred / Unchanged
- Left the OpenCode, Claude Code, and Gemini runtime rows unchanged because the merged report row for this target only required the advisor verification expansion and the Copilot runtime-path correction. No other runtime-row rewrite was needed in this packet.
