# Applied: AGENTS.md

## Source Flagging
- Sub-packets: 01,05,09
- Severity (from merged report): HIGH

## Changes Applied
- Updated the Session Start & Recovery note to describe the post-05 Codex hook state instead of the old "no lifecycle startup hook" wording.
  Before: `Codex has prompt hooks but no lifecycle startup hook.`
  After: `Codex supports native \`SessionStart\` and \`UserPromptSubmit\` hooks ...; \`/spec_kit:resume\` remains the fallback ...`
  Line refs: `AGENTS.md:92` before, `AGENTS.md:92` after
  Flagged by: 05

- Narrowed the `sk-code-opencode` JavaScript guidance so the CommonJS rule no longer reads as a blanket rule for OpenCode plugins and plugin helpers.
  Before: `For ALL OpenCode system code ...`
  After: `For OpenCode system code ... OpenCode plugins and plugin helpers ... follow the plugin-loader ESM exemption ...`
  Before: `| JavaScript | MCP servers, CommonJS modules | \`require\`/\`module.exports\`, strict mode |`
  After: `| JavaScript | MCP servers, CommonJS modules, non-plugin JS | \`require\`/\`module.exports\`, strict mode; OpenCode plugins/plugin helpers use ESM default export |`
  Line refs: `AGENTS.md:373,379` before, `AGENTS.md:373,379` after
  Flagged by: 09

## Evidence Links
- Merged report: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/merged-impact-report.md:180-190`
- 01 impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/01-impact.md:35-47`
- 05 impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/05-impact.md:26-29`
- 09 impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/09-impact.md:28-34`
- 01 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/009-documentation-and-release-contract/implementation-summary.md:50-53,61-68,113-116`
- 05 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation/implementation-summary.md:50-66`
- 09 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/009-skill-advisor-standards-alignment/implementation-summary.md:49-50`

## Verification
- Frontmatter parses: `AGENTS.md` has no YAML frontmatter; none was added or removed.
- Anchors are still paired: `AGENTS.md` contains no `<!-- ANCHOR:* -->` blocks, and none were introduced or deleted.
- No unrelated content was deleted: only the Session Start & Recovery sentence and the `sk-code-opencode` scope/language guidance were changed.

## Deferred / Unchanged
- Did not change the existing Gate 2 hook-first wording at `AGENTS.md:55`, `AGENTS.md:177-178`, `AGENTS.md:352`, and `AGENTS.md:365` because it already matches the merged report's `[01]` guidance: automatic Skill Advisor Hook brief first, `skill_advisor.py` as fallback.
- Did not add new sections or alter section ordering because the merged report only called for targeted wording fixes in existing sections.
