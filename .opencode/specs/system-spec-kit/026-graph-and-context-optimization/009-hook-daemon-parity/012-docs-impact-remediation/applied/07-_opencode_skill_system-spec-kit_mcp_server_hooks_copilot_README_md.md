# Applied: .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md

## Source Flagging
- Sub-packets: 01,10
- Severity (from merged report): HIGH

## Changes Applied
- Replaced the stale repo-wrapper registration example in `## 2. HOOK REGISTRATION` with the `.claude/settings.local.json` wrapper contract, including top-level `type` / `bash` / `timeoutSec` fields and the Copilot writer commands for `UserPromptSubmit` and `SessionStart`.
  Before (`README.md:27-49`, pre-edit): `Use repo-local wrappers...`, `"bash": ".github/hooks/scripts/session-start.sh"`, `"bash": ".github/hooks/scripts/user-prompt-submitted.sh"`
  After (`README.md:27-62`): "Use the shared `.claude/settings.local.json` matcher wrappers...", `"bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js"`, `"bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js"`
  Flagged by: 01, 10
- Added the clarifying note that Copilot uses the outer wrapper while Claude continues to use the nested `hooks` entries in the same matcher groups.
  Before (`README.md`, pre-edit): no note explaining the split between Copilot top-level fields and Claude nested commands
  After (`README.md:64`): "For Copilot, the effective writer path is the outer `.claude/settings.local.json` wrapper. Claude continues to use the nested `hooks` entries in the same matcher groups."
  Flagged by: 10

## Evidence Links
- Merged report row: `impact-analysis/merged-impact-report.md:138-146`
- Sub-packet 01 wildcard row: `impact-analysis/01-impact.md:27`
- Sub-packet 01 supporting evidence: `001-skill-advisor-hook-surface/009-documentation-and-release-contract/implementation-summary.md:63-68`
- Sub-packet 10 concrete row: `impact-analysis/10-impact.md:28`
- Sub-packet 10 evidence pointer: `impact-analysis/10-impact.md:43-45`
- Packet 010 wrapper-field shape: `010-copilot-wrapper-schema-fix/implementation-summary.md:35-52`
- Packet 011 writer-command shape: `011-copilot-writer-wiring/implementation-summary.md:67-87`

## Verification
- Frontmatter parses: verified with `ruby` `YAML.safe_load` against the opening frontmatter block.
- Anchors are still paired: verified `0` `<!-- ANCHOR:* -->` and `0` `<!-- /ANCHOR:* -->` markers after the edit.
- Markdown structure remains valid enough to render: fenced code blocks remain balanced and the section order stayed `OVERVIEW -> HOOK REGISTRATION -> RELATED`.
- No unrelated content was deleted: diff is limited to the `## 2. HOOK REGISTRATION` block and its immediately related explanatory sentence.

## Deferred / Unchanged
- Did not add Codex-specific deferred config guidance here. The `[01]` merged-report note covers the runtime-hook README family as a whole, but Codex guidance belongs in the Codex runtime README, not the Copilot README.
