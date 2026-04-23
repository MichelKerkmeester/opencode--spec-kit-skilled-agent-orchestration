## Iteration 01

### Focus
Codex runtime agent path references that still point to `.md` files instead of the live `.toml` runtime copies.

### Findings
- Codex agent files self-declare `.toml` as the canonical runtime path convention (`.codex/agents/deep-research.toml:19`, `.codex/agents/context.toml:15`), but the Codex orchestrator's Agent Files table still points dispatchers to `.md` files for `@context`, `@deep-research`, `@ultra-think`, `@review`, `@write`, and `@debug` (`.codex/agents/orchestrate.toml:154-163`).
- Codex context docs repeat the same stale `.md` references for both the orchestrator and `@deep-research` (`.codex/agents/context.toml:364-372`), so the mismatch is multi-surface rather than a single-table typo.
- The mismatch is Codex-specific: equivalent OpenCode, Claude, and Gemini orchestrator tables still point at path shapes that match their runtime conventions (`.opencode/agent/orchestrate.md:162-171`, `.claude/agents/orchestrate.md:162-171`, `.gemini/agents/orchestrate.md:162-171`).

### New Questions
- Is the Codex drift limited to human-facing tables, or do workflow assets also privilege the wrong source file?
- Do runtime README files still describe the deleted or renamed agent surfaces accurately?
- Is `@general` expected to live in the runtime directory, or is it treated as a built-in special case?

### Status
new-territory
