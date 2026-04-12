# Iteration 001 — Rulebook Layering

## Research question
Does the starter kit's single-file `CLAUDE.md` rulebook provide a better Claude-facing control surface than this repo's split root `CLAUDE.md` plus `.claude/CLAUDE.md` supplement?

## Hypothesis
The external rulebook will be easier for Claude to obey quickly, but the local split will be stronger for cross-runtime governance and recovery.

## Method
Read the external `CLAUDE.md` quick-reference and critical-rules sections, then compared them to this repo's root `CLAUDE.md` gate/recovery sections and the local Claude-specific supplement.

## Evidence
- The starter kit puts scripts, slash commands, and critical rules into one runtime-facing file, starting with a command table and then numbered rules for secrets, TypeScript, API versioning, and StrictDB. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:76-103]
- The local root `CLAUDE.md` is broader and more constitutional: it defines mandatory MCP tools, code-search routing, common workflows, recovery steps, Gate 1-3, memory-save rules, and completion verification. [SOURCE: CLAUDE.md:34-56] [SOURCE: CLAUDE.md:72-81] [SOURCE: CLAUDE.md:107-175]
- The local Claude-specific file is intentionally lightweight and defers to the root file for gates and recovery, while clarifying how injected hook payloads should be interpreted. [SOURCE: .claude/CLAUDE.md:1-14]

## Analysis
The external repo optimizes for a single Claude runtime: one file contains the quick-reference, hard rules, and command reminders that Claude can act on immediately. This repo optimizes for a governed multi-runtime environment, so the root file carries repo-wide rules while `.claude/CLAUDE.md` only explains how Claude hook payloads fit into that framework. The external shape is lower-friction for Claude-first work, but the local shape is better aligned with cross-runtime consistency and Spec Kit governance.

## Conclusion
confidence: high

finding: The external rulebook is better as a fast Claude-facing operator surface, but the local split architecture is better as the source of truth. `system-spec-kit` should borrow the compact "Claude-first quick reference" pattern without collapsing the existing root governance file into a runtime-specific document.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.claude/CLAUDE.md`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** decide which root `CLAUDE.md` sections deserve a concise Claude-only mirror
- **Priority:** should-have

## Counter-evidence sought
I looked for signs that the starter kit also splits governance across multiple runtime-specific files. None were evident in the core external Claude-facing instructions I reviewed.

## Follow-up questions for next iteration
How much of the external repo's speed comes from its MDD command, not the rulebook alone?
Would a local Claude-only quick-reference risk drifting from the root `CLAUDE.md`?
Which local workflows most need a more compact front door?
