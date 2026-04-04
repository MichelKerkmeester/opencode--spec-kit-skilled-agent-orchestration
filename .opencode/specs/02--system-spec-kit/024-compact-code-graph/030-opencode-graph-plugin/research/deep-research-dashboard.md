# Deep Research Dashboard

## Run Summary

- Topic: `opencode-lcm` plugin method for packet 024 compact code graph + memory-system improvements
- Execution mode: `auto`
- Status: `complete`
- Iterations completed: `26`
- Stop reason: `converged`
- Research output: `research/research.md`
- Extension method: `cli-copilot` with `gpt-5.4` `high` in 5 waves of 2 delegated research passes
- Runtime-loader extension: `10` additional local deep-research iterations focused on the surviving `plugin.auth` startup crash in live OpenCode

## Iteration Ledger

| Iteration | Focus | New Info Ratio | Outcome |
|-----------|-------|----------------|---------|
| 001 | Plugin architecture and injection points | 0.42 | Verified OpenCode event + transform + compaction hook model |
| 002 | Storage, retrieval, privacy, repair | 0.31 | Verified searchable archive, ranking, redaction, and doctor model |
| 003 | Compare to packet 024 and current Spec Kit Memory | 0.19 | Confirmed overlap and isolated the real gap: OpenCode-native prompt-time injection |
| 004 | Synthesis and recommendation | 0.08 | Converged on adapter-not-backend adoption strategy |
| 005 | Broader code-graph + hook runtime comparison | 0.24 | Identified missing graph-runtime ops: snapshots, retention, worktree safety, and artifact previews |
| 006 | Broader graph/hook upgrade recommendations | 0.11 | Converged on doctor/export-import/provenance-preview hardening for existing graph logic |
| 007 | Startup/resume/provenance refinement | 0.17 | Distinguished surface provenance vs data provenance and added imported-unverified lifecycle guidance |
| 008 | Compaction/working-set/pre-merge shaping | 0.18 | Identified unused `WorkingSetTracker`, pre-merge selector gap, and anti-feedback sanitization need |
| 009 | Snapshot/export/import contract design | 0.16 | Identified path-derived identity as the core portability blocker and import-finalize as a required stage |
| 010 | Retention/dedup/privacy/preview handling | 0.14 | Added lineage-aware pruning, hash-after-redaction dedupe, and memory-vs-runtime archival asymmetry detail |
| 011 | Graph retrieval shaping and semantic bridge quality | 0.15 | Mapped query-aware seed disambiguation, first-anchor bias, and low-signal suppression gaps |
| 012 | Readiness/staleness/self-healing consistency | 0.14 | Identified conflicting freshness semantics and hidden diagnostics across graph health surfaces |
| 013 | OpenCode adapter boundary refinement | 0.12 | Clarified adapter as transport facade and runtime as policy/composition/ops owner |
| 014 | Over-port failure modes and hidden costs | 0.13 | Identified competing recovery authorities, duplicate snapshot planes, and hook-latency regression risks |
| 015 | Dependency-ordered roadmap | 0.10 | Established shared payload/provenance layer as prerequisite, adapter second, hardening third |
| 016 | Future packet and workstream decomposition | 0.11 | Converged on 3-packet split: adapter under 024, graph ops under 024, memory durability outside 024 |
| 017 | Live OpenCode plugin loader flow | 0.22 | Confirmed the packed runtime imports configured plugins and invokes each unique module export as a plugin function |
| 018 | Local plugin auto-discovery | 0.18 | Confirmed `{plugin,plugins}/*.{ts,js}` files are auto-loaded as `file://` plugin specifiers |
| 019 | Explicit plugin specifier semantics | 0.17 | Confirmed non-`file://` plugin entries are package installs, not local-file references |
| 020 | Export invocation semantics | 0.21 | Confirmed non-function exports are unsafe because the live loader calls every unique export value |
| 021 | Working plugin pattern comparison | 0.14 | Confirmed working Superset and `opencode-lcm` plugins both align with single-function export patterns |
| 022 | Wrapper/runtime/config root tracing | 0.16 | Confirmed Superset wrapper config roots and Homebrew binary behavior both shape live startup |
| 023 | Version-skew assessment | 0.12 | Confirmed local `@opencode-ai/plugin` types are not a reliable proxy for the packed binary semantics |
| 024 | `plugin.auth` crash-path re-evaluation | 0.11 | Re-centered the issue on nullish hook materialization rather than prompt payload shape |
| 025 | Root-cause ranking | 0.10 | Narrowed the highest-risk causes to export shape, duplicate name resolution, and runtime-version mismatch |
| 026 | Fix-strategy synthesis | 0.09 | Converged on single-function export + local file loading/file URI registration as the next implementation path |

## Final Recommendation Snapshot

- **Packet 024 recommendation:** Reuse the plugin method by building an OpenCode adapter plugin that injects our own retrieval output into OpenCode transforms.
- **Do not do in v1:** Fork `opencode-lcm` into the core memory path or create a second long-memory source of truth.
- **Broader memory wins:** Doctor/repair tooling, deduplicated large-payload storage, privacy pre-index filtering, portable snapshots, and optional summary DAGs.
- **Broader graph/runtime wins:** Add `code_graph_doctor`, worktree-aware snapshot export/import, provenance-richer startup/compaction payloads, workspace-safe path resolution, and metadata-only artifact previews.
- **New dependency insight:** Build a shared payload/provenance layer first, then the OpenCode adapter, then graph-runtime hardening.
- **New boundary insight:** Decompose follow-on work into 3 packets: transport adapter under 024, graph ops under 024, memory archive durability outside 024.
- **Live runtime correction:** Treat the packed OpenCode binary as the source of truth for plugin loading, not just the local `@opencode-ai/plugin` type definitions.
- **Startup-crash fix direction:** Use a single callable plugin export only, remove non-function exports, and stop using the bare package-style plugin specifier for the local packet-030 plugin.

## Evidence Base

- External plugin sources: `README.md`, `src/index.ts`, `src/store.ts`, `src/store-search.ts`, `src/privacy.ts`, `src/store-snapshot.ts`, `src/store-retention.ts`, `src/workspace-path.ts`, `src/worktree-key.ts`, `src/preview-providers.ts`, `tests/options-plugin.test.mjs`
- Internal packet docs: `decision-record.md`, `009-code-graph-storage-query/spec.md`, `research/research.md`
- Internal runtime surfaces: `context-server.ts`, `hooks/memory-surface.ts`, `references/config/hook_system.md`, `lib/code-graph/startup-brief.ts`, `lib/session/session-snapshot.ts`, `hooks/claude/session-prime.ts`, `hooks/claude/hook-state.ts`, `hooks/claude/compact-inject.ts`, `lib/code-graph/compact-merger.ts`, `lib/code-graph/ensure-ready.ts`, `lib/code-graph/working-set-tracker.ts`, `lib/code-graph/seed-resolver.ts`, `lib/code-graph/query-intent-classifier.ts`, `handlers/code-graph/context.ts`, `handlers/code-graph/query.ts`, `handlers/code-graph/status.ts`, `handlers/session-bootstrap.ts`, `handlers/session-resume.ts`, `handlers/session-health.ts`, `lib/storage/checkpoints.ts`
- Live runtime evidence: Homebrew packed binary extraction from `/opt/homebrew/lib/node_modules/opencode-ai/bin/.opencode`, Superset wrapper at `~/.superset/bin/opencode`, Superset config-root plugin `~/.superset/hooks/opencode/plugin/superset-notify.js`, repo `opencode.json`, and local packet-030 plugin files under `.opencode/plugins/`
