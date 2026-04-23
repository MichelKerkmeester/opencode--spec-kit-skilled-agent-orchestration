# Applied: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md

## Source Flagging
- Sub-packets: 10
- Severity (from merged report): MED

## Changes Applied
- Replaced the Copilot runtime summary in `## 2. CURRENT REALITY` so the playbook validates `.claude/settings.local.json` wrapper wiring instead of `.github/hooks/*.json` alone.
  Before: `Copilot CLI must report repo hook wiring while delivering prompt-time context through the managed custom-instructions block`
  After (`252-cross-runtime-fallback.md:18,23,28`): `Copilot CLI must report wrapper-backed hook wiring from .claude/settings.local.json` and `Copilot CLI derives hookPolicy from .claude/settings.local.json wrapper wiring plus managed custom-instructions refresh`
  Flagged by: 10
- Rewrote the Copilot-specific validation scenario to inspect top-level wrapper fields and writer commands, then smoke the managed-block refresh through the wrapper-configured `UserPromptSubmit` command.
  Before: the scenario expected enablement from `.github/hooks/*.json` and ran `node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js` directly.
  After (`252-cross-runtime-fallback.md:100-137`): the scenario now checks `type` / `bash` / `timeoutSec` on `UserPromptSubmit` and `SessionStart`, confirms the writer targets, and executes `bash -lc "$(jq -r '.hooks.UserPromptSubmit[0].bash' .claude/settings.local.json)"`.
  Flagged by: 10

## Evidence Links
- Merged report: `impact-analysis/merged-impact-report.md:194-202`
- Per-sub-packet evidence: `impact-analysis/10-impact.md:31-32,39-56`
- Implementation support:
  - `010-copilot-wrapper-schema-fix/implementation-summary.md:22-24,37-53`
  - `011-copilot-writer-wiring/implementation-summary.md:22-24,67-90`

## Verification
- Frontmatter parses: confirmed with `python3` + `yaml.safe_load(...)` against the target file.
- Anchors are still paired: confirmed there are no `<!-- ANCHOR:* -->` markers in the file before/after (`0` start, `0` end).
- No unrelated content was deleted: `git diff --stat -- <target>` shows a single-file scoped edit in the Copilot validation sections only (`14 insertions, 12 deletions`).

## Deferred / Unchanged
- None. The merged-report suggested change for this target was fully applied.
