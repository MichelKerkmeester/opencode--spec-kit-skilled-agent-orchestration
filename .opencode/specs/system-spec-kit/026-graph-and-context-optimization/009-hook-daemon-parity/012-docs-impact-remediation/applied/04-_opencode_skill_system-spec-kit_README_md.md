# Applied: .opencode/skill/system-spec-kit/README.md

## Source Flagging
- Sub-packets: 01,02,03,04
- Severity (from merged report): HIGH

## Changes Applied
- Expanded the `Skill Advisor` overview to make hook briefs the primary runtime surface, keep the Python CLI as the compatibility fallback, and point readers to the runtime hook reference/playbook/matrix.
  - Before (`.opencode/skill/system-spec-kit/README.md:118-120`): "the Python script ... remains a compatibility shim with native-first routing and local fallback. ... Runtime hooks cover Claude Code, Copilot CLI, Gemini CLI, Codex CLI, and the OpenCode plugin bridge."
  - After (`.opencode/skill/system-spec-kit/README.md:118-120`): "the Python script ... remains a compatibility shim, while runtime hook briefs are the primary surface when the active runtime supports them. ... For runtime wiring and operator checks, see the Skill Advisor hook reference, the validation playbook, and the hook system matrix."
  - Flagged by: 01,03,04
- Replaced the generic runtime summary with a transport-specific one: Claude/Gemini direct prompt briefs, OpenCode plugin bridge, Copilot file-based refresh via `$HOME/.copilot/copilot-instructions.md`, and the POST-05 Codex state (`SessionStart` + `UserPromptSubmit` when `[features].codex_hooks = true` and `~/.codex/hooks.json` is wired, `/spec_kit:resume` as fallback).
  - Before (`.opencode/skill/system-spec-kit/README.md:118-118`): "Runtime hooks cover Claude Code, Copilot CLI, Gemini CLI, Codex CLI, and the OpenCode plugin bridge. Copilot CLI is file-based..."
  - After (`.opencode/skill/system-spec-kit/README.md:118-118`): "Runtime capability is intentionally split by transport: Claude Code and Gemini CLI inject prompt-time briefs directly, Codex supports native `SessionStart` and `UserPromptSubmit` hooks ... OpenCode delivers advisor context through the plugin bridge, and Copilot CLI refreshes a Spec Kit managed block in `$HOME/.copilot/copilot-instructions.md` ..."
  - Flagged by: 03,04
- Corrected the workspace module profile so `scripts/` is documented as ESM instead of CommonJS.
  - Before (`.opencode/skill/system-spec-kit/README.md:133-134`): "`scripts/` remains CommonJS (`\"type\": \"commonjs\"`) with explicit ESM interop..."
  - After (`.opencode/skill/system-spec-kit/README.md:133-134`): "`scripts/` is also ESM (`\"type\": \"module\"`), with built CLI entrypoints under `dist/`..."
  - Flagged by: 02

## Evidence Links
- Merged report row: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/merged-impact-report.md:92-106`
- 01 impact row: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/01-impact.md:26`
- 01 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/implementation-summary.md:48-54`
- 02 impact row and evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/02-impact.md:20,36-38`
- 02 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/001-validator-esm-fix/implementation-summary.md:37-46`
- 03 impact row: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/03-impact.md:19`
- 03 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/implementation-summary.md:47-50`
- 04 impact row: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/04-impact.md:19`
- 04 implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation/implementation-summary.md:63-75,83-90`

## Verification
- Frontmatter parses: confirmed with `python3` + `yaml.safe_load` on `.opencode/skill/system-spec-kit/README.md`.
- Anchors are still paired: confirmed all `<!-- ANCHOR:* -->` / `<!-- /ANCHOR:* -->` pairs match after the edit.
- No unrelated content was deleted: `git diff -- .opencode/skill/system-spec-kit/README.md` shows changes only in the `Skill Advisor` paragraph/link sentence and the `Workspace module profile` bullet inside the existing `overview` anchor.

## Deferred / Unchanged
- None. All suggested changes for this target were applied in-place within the existing `overview` section.
