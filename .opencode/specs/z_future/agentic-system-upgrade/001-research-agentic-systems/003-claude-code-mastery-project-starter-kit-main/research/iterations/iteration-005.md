# Iteration 005 — Hook Model

## Research question
Is the starter kit's deterministic enforcement-hook architecture a better default than this repo's current recovery-first hook stack?

## Hypothesis
The external hook model will be stronger for edit-time guardrails, while the local hook model will be stronger for context continuity and recovery.

## Method
Compared external hook wiring in `.claude/settings.json` plus the external hook summary in the README to the local `.claude/settings.local.json` and Claude hook source files.

## Evidence
- The starter kit wires enforcement hooks into `PreToolUse`, `PostToolUse`, and `Stop`, including secret blocking, branch checks, port checks, E2E checks, lint-on-save, secret verification, RuleCatch, and env sync. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:2-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:98-104]
- The local Claude config uses hooks for `PreCompact`, `SessionStart`, and `Stop`, not edit-time enforcement. [SOURCE: .claude/settings.local.json:7-42]
- The local `session-prime` hook injects startup and recovery context, exposes memory/code-graph tools, and adjusts output to token pressure. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-173] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:245-260]
- The local `compact-inject` hook caches compact context using transcript analysis plus merged memory/code-graph signals, while `session-stop` stores token snapshots and can auto-save a session summary. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:5-8] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-225] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:175-192]

## Analysis
These hook systems serve different goals. The starter kit uses hooks as deterministic policy enforcement on Claude actions. The local repo uses hooks as continuity infrastructure that keeps long-running governed work recoverable across startup, compaction, and stop. Replacing one with the other would be a category error. The better move is a hybrid: keep recovery hooks as the backbone, then selectively add low-risk enforcement hooks where prose-only rules remain fragile.

## Conclusion
confidence: high

finding: The starter kit demonstrates a hook role that the local repo underuses: deterministic guardrails at tool time. `system-spec-kit` should not replace its recovery stack, but it should consider a thin Claude-only enforcement layer on top of it.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.claude/settings.local.json`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** choose a minimal set of non-conflicting enforcement hooks and keep them clearly separated from recovery hooks
- **Priority:** should-have

## Counter-evidence sought
I looked for signs that the local repo already uses Claude tool-time enforcement hooks elsewhere. I did not find equivalent enforcement wiring in the local Claude config I reviewed.

## Follow-up questions for next iteration
Which external hooks are low-risk enough to adopt immediately?
Which hooks would conflict with existing Spec Kit or git workflows?
Should enforcement hooks live under `.claude/hooks/` or the system-spec-kit hook package?
