# Deep Research Dashboard

## Run Summary

- Topic: `opencode-lcm` plugin method for packet 024 compact code graph + memory-system improvements
- Execution mode: `auto`
- Status: `complete`
- Iterations completed: `6`
- Stop reason: `converged`
- Research output: `research/research.md`

## Iteration Ledger

| Iteration | Focus | New Info Ratio | Outcome |
|-----------|-------|----------------|---------|
| 001 | Plugin architecture and injection points | 0.42 | Verified OpenCode event + transform + compaction hook model |
| 002 | Storage, retrieval, privacy, repair | 0.31 | Verified searchable archive, ranking, redaction, and doctor model |
| 003 | Compare to packet 024 and current Spec Kit Memory | 0.19 | Confirmed overlap and isolated the real gap: OpenCode-native prompt-time injection |
| 004 | Synthesis and recommendation | 0.08 | Converged on adapter-not-backend adoption strategy |
| 005 | Broader code-graph + hook runtime comparison | 0.24 | Identified missing graph-runtime ops: snapshots, retention, worktree safety, and artifact previews |
| 006 | Broader graph/hook upgrade recommendations | 0.11 | Converged on doctor/export-import/provenance-preview hardening for existing graph logic |

## Final Recommendation Snapshot

- **Packet 024 recommendation:** Reuse the plugin method by building an OpenCode adapter plugin that injects our own retrieval output into OpenCode transforms.
- **Do not do in v1:** Fork `opencode-lcm` into the core memory path or create a second long-memory source of truth.
- **Broader memory wins:** Doctor/repair tooling, deduplicated large-payload storage, privacy pre-index filtering, portable snapshots, and optional summary DAGs.
- **Broader graph/runtime wins:** Add `code_graph_doctor`, worktree-aware snapshot export/import, provenance-richer startup/compaction payloads, workspace-safe path resolution, and metadata-only artifact previews.

## Evidence Base

- External plugin sources: `README.md`, `src/index.ts`, `src/store.ts`, `src/store-search.ts`, `src/privacy.ts`, `src/store-snapshot.ts`, `src/store-retention.ts`, `src/workspace-path.ts`, `src/worktree-key.ts`, `src/preview-providers.ts`, `tests/options-plugin.test.mjs`
- Internal packet docs: `decision-record.md`, `009-code-graph-storage-query/spec.md`, `research/research.md`
- Internal runtime surfaces: `context-server.ts`, `hooks/memory-surface.ts`, `references/config/hook_system.md`, `lib/code-graph/startup-brief.ts`, `lib/session/session-snapshot.ts`, `hooks/claude/session-prime.ts`, `hooks/claude/hook-state.ts`, `lib/code-graph/compact-merger.ts`, `lib/code-graph/ensure-ready.ts`, `handlers/code-graph/status.ts`
