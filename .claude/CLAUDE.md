# Claude-Specific Recovery Notes

This file supplements `../CLAUDE.md`.

## Hook-Aware Recovery

- If Claude hook payloads appear in the conversation, treat them as additive context rather than a replacement for the root recovery protocol.
- If compaction happens and no hook payload is visible, use `/spec_kit:resume` as the canonical recovery surface and then rebuild context in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs.
- Use `memory_context()` or `memory_search()` only after those packet-local continuity sources are exhausted.
- Keep the root `../CLAUDE.md` file as the source of truth for gates, tool routing, and cross-runtime recovery behavior.

## SessionStart Guidance

- `source=compact`: use the injected compact-recovery payload first, then continue through the same `handover.md` -> `_memory.continuity` -> spec-doc recovery order if more context is needed.
- `source=startup`, `source=resume`, or `source=clear`: use the injected bootstrap context when present, then continue under the same guardrails and canonical `/spec_kit:resume` recovery contract defined in `../CLAUDE.md`.
