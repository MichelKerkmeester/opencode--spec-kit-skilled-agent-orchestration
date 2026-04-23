# Applied: .opencode/skill/system-spec-kit/SKILL.md

## Source Flagging
- Sub-packets: 01,03,04,06,10
- Severity (from merged report): HIGH

## Changes Applied
- Rewrote the startup-surfaces intro and cross-runtime paragraph to split prompt-hook vs startup behavior, reconcile Codex to the POST-05 native-hook state, keep OpenCode aligned with the plugin bridge, and make Copilot's file-based startup surface explicit. Before: `SKILL.md:733` said "runtime-specific startup surfaces" and `SKILL.md:745` said "Claude, Gemini, and Codex use SessionStart hook scripts". After: [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:733) and [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:748) describe native Codex `SessionStart` + `UserPromptSubmit` behind `codex_hooks`, `/spec_kit:resume` or `session_bootstrap()` fallback, and Copilot's `.claude/settings.local.json` wrapper path refreshing `$HOME/.copilot/copilot-instructions.md`. Flagged by: 01,03,04,10.
- Added the missing Claude `UserPromptSubmit` hook row and documented the normalized Claude registration shape. Before: `SKILL.md:735-741` listed only `PreCompact`, `SessionStart`, and `Stop`. After: [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:735) through [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:744) include `UserPromptSubmit` plus the note that project-local Claude settings use nested `hooks` groups without outer `bash` / `timeoutSec` wrappers. Flagged by: 06.
- Updated the Claude lifecycle prose so prompt-time delivery and cached startup reinjection are described separately. Before: `SKILL.md:743` only described `PreCompact -> SessionStart(compact) -> inject cached context`. After: [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:746) now states that `UserPromptSubmit` handles prompt-time advisor delivery while `PreCompact -> SessionStart(compact)` handles cached context reinjection. Flagged by: 06,01,03.

## Evidence Links
- Merged report: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/merged-impact-report.md:108-124`
- 01-impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/01-impact.md:39-41`
- 03-impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/03-impact.md:28-30`
- 04-impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/04-impact.md:20,27-33`
- 06-impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/06-impact.md:27-31`
- 10-impact evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/10-impact.md:31`

## Verification
- Frontmatter parses: `ruby -e 'require "yaml"; ... YAML.safe_load(...)'` returned `frontmatter: ok`.
- Anchors are still paired: `anchor_starts=7 anchor_ends=7`, `anchor_pairs: ok`.
- Markdown structure remained intact: the edited section still renders as normal paragraphs plus a valid pipe table, and the diff is confined to the startup/recovery block ending before `session_resume()` at [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:750).
- No unrelated content was deleted: `git diff --unified=3 -- .opencode/skill/system-spec-kit/SKILL.md` shows changes only inside the `### Startup Injection and Recovery Surfaces` section.

## Deferred / Unchanged
- None. The only reconciliation choice was Codex: impact rows 01/03 captured the pre-05 prompt-only interim, but the file now documents the POST-05 native `SessionStart` + `UserPromptSubmit` state required by this packet.
