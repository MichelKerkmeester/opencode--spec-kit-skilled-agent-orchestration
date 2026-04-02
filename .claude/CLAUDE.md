# Claude-Specific Recovery Notes

This file supplements `../CLAUDE.md`.

## Hook-Aware Recovery

- If Claude hook payloads appear in the conversation, treat them as additive context rather than a replacement for the root recovery protocol.
- If compaction happens and no hook payload is visible, immediately follow the recovery steps in `../CLAUDE.md`.
- Keep the root `../CLAUDE.md` file as the source of truth for gates, tool routing, and cross-runtime recovery behavior.

## SessionStart Guidance

- `source=compact`: use the injected compact-recovery payload first, then continue with the normal root recovery flow if more context is needed.
- `source=startup`, `source=resume`, or `source=clear`: use the injected bootstrap context when present, then continue under the same guardrails and search-routing rules defined in `../CLAUDE.md`.
