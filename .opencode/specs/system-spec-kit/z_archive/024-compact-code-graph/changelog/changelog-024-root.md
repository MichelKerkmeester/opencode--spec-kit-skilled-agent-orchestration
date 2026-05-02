# Changelog: 024-compact-code-graph (Root)

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 024-compact-code-graph — 2026-04-02

Long AI coding sessions in this repo no longer depend on the user re-explaining context after compaction, restart, or runtime switches. This packet grew from the original 25-phase delivery into a 30-phase program that now covers Claude hook rescue, hookless bootstrap recovery, structural code-graph retrieval, CocoIndex bridging, cross-runtime instruction parity, startup-orientation quality fixes, the packet-030 OpenCode transport/startup-parity extension, and the follow-on review/remediation work that brought the packet back to a clean validation state. The end result is a context-preservation stack that can recover active work, point the AI at the right retrieval tools, and surface structural code context without pretending that every intermediate phase shipped as fully complete.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/` (Level 3)

---

## New Features (7)

These are the new capabilities the packet added across the runtime, retrieval, and recovery surfaces.

### Compaction rescue for Claude sessions

**Problem:** Claude compaction wiped out the AI's short-term memory. After a compact, the assistant often lost the active spec folder, recent code focus, and the rules that were guiding the work.

**Fix:** The packet introduced a two-step rescue path: PreCompact caches a compact recovery payload, and SessionStart injects that payload back only for `source=compact`. Working-memory attention signals, spec-folder detection, and token-budget controls make the recovered brief small enough to fit while still being useful.

### Source-aware session priming

**Problem:** Startup, resume, clear, and compact were treated too similarly, which meant the assistant either got too much context or the wrong context for the situation.

**Fix:** Session priming now branches by source. Compacts restore cached context, resumes point at the compact brief flow, startups surface tool and freshness guidance, and clears fall back to minimal recovery instructions instead of pretending a full recovery already happened.

### Stop-hook tracking and best-effort auto-save

**Problem:** The system had little durable insight into session usage and no reliable way to capture end-of-session state automatically.

**Fix:** Stop-hook tracking parses transcript usage data, stores hook-state metrics, estimates token spend, and can trigger a best-effort `generate-context.js` save path when configured thresholds are met. That gives the packet a stronger handoff story than the original design.

### Structural code graph retrieval

**Problem:** Semantic search could find code by meaning, but it could not answer structural questions like "who calls this?" or "what does this file import?".

**Fix:** The packet added a SQLite-backed code graph with scan, query, status, and context-expansion tools. The graph moved from regex-only indexing toward tree-sitter-backed parsing, and later follow-up phases hardened the parser, freshness model, and startup summaries.

### CocoIndex bridge and intent-aware routing

**Problem:** Semantic search, structural search, and memory search lived beside each other without enough guidance about when to use which system.

**Fix:** Seed-resolution and context orchestration now let CocoIndex hits expand into structural neighborhoods, while intent metadata and later routing-enforcement phases push semantic questions toward CocoIndex, structural questions toward the graph, and session-history questions toward memory surfaces.

### Hookless auto-priming and bootstrap recovery

**Problem:** Claude hooks covered only one runtime family. Other runtimes still depended on the AI remembering to prime itself manually.

**Fix:** The packet added MCP first-call priming groundwork, `session_resume`, `session_health`, and then `session_bootstrap` so non-hook or degraded-hook runtimes can still recover with a single canonical path. Later phases introduced structural bootstrap contracts, freshness-aware startup briefs, the packet-030 OpenCode transport layer, and a repo-local Copilot startup wrapper so the public recovery story no longer depends on a single universal auto-prime mechanism.

### Startup orientation and transport follow-ons

**Problem:** The first rollout of startup structural highlights was real but noisy. Duplicates, vendored code, and the wrong centrality heuristic made the output harder to trust than the surrounding recovery guidance.

**Fix:** Follow-on phases `026-028` repaired that experience with shared startup brief builders, an explicit structural bootstrap contract, and a final SQL remediation pass that deduplicates symbols, excludes non-project paths, and ranks by incoming callers instead of the noisiest outgoing callers. Packet `030-opencode-graph-plugin` then extended the same startup surface into OpenCode transport digests, bounded structural-read freshness handling, and repo-local Copilot startup wiring. The review issue here was not a token-budget increase from 100 to 2000. It was that the startup highlights were consuming roughly 100 tokens out of the existing 2000-token session-prime budget while delivering weak signal, so the fix focused on quality, not a bigger budget.

---

## Architecture (5)

These are the structural decisions that shaped how the packet works across runtimes.

### Hybrid hook plus tool transport

**Problem:** A hook-only design would have made the packet feel great in Claude and second-class everywhere else.

**Fix:** The packet kept hooks where they are strong and added tool-driven recovery everywhere else. That let the implementation share logic between Claude, Gemini, and hookless runtimes instead of forking the whole recovery model.

### Floors plus overflow budgeting

**Problem:** A fixed split wastes budget when one source is empty, but a pure pool can starve the most important context.

**Fix:** Budgeting moved to a floors-plus-overflow model so constitutional context, graph context, semantic hints, and triggered memories each have a baseline allocation while still sharing spare capacity when one channel is quiet.

### Tree-sitter migration with regex fallback

**Problem:** Regex-only parsing was fast to ship but too brittle for long-term graph correctness.

**Fix:** The packet introduced parser adapters, then progressively moved toward tree-sitter-backed extraction while retaining regex as a fallback. That made the graph more accurate without turning parser availability into a single point of failure.

### Cross-runtime contract parity

**Problem:** Runtime instructions, context-prime agents, and bootstrap surfaces drifted apart. The same recovery concept had different wording and different guarantees depending on where the AI looked.

**Fix:** The packet standardized non-hook recovery around explicit contracts: ready/stale/missing structural state, a canonical `session_bootstrap` path, and mirrored routing/recovery tables across runtime-facing docs and agent definitions.

### Review-driven retention criteria

**Problem:** Some late packet features were useful in principle but weak in practice until the review waves forced stricter quality gates.

**Fix:** The packet now treats review findings as architecture pressure, not just bug backlog. Startup highlights stayed only after deduplication, path-filtering, heuristic, and traceability fixes restored enough signal to justify the feature.

---

## Bug Fixes (8)

These are the major repair lanes that changed behavior, not just documentation.

### Correctness and boundary repair

**Problem:** Early graph/indexing work had correctness holes: collapsed line spans, unsafe DB initialization, transaction gaps, depth leaks, and missing validation.

**Fix:** Phase 013 hardened the graph pipeline end to end. Multi-line symbol spans, DB initialization/migration guards, atomic replace operations, strict depth handling, better seed identity, and safer handler validation all landed here.

### Hook durability and security hardening

**Problem:** Cache races, weak temp-file handling, session-state collisions, and insufficient provenance markers made the hook path more fragile than it looked on paper.

**Fix:** Phase 014 tightened the hook-state lifecycle with TTL checks, SHA-256-based state names, restrictive file permissions, provenance fencing, stale-on-read checks, and response-envelope cleanup.

### Tree-sitter and classifier repair

**Problem:** The migration foundation was incomplete, and the first tree-sitter/classifier pass still misclassified several real-world patterns.

**Fix:** Phase 017 repaired abstract methods, class-expression detection, multi-import capture, nested Python class names, and intent-classifier confidence behavior so the parser and routing layers matched the newer contract more closely.

### Freshness and bounded auto-index fixes

**Problem:** A stale graph is worse than no graph because it looks authoritative while pointing at the wrong branch state, but silent full rescans on every read would make structural tools unpredictable and too expensive.

**Fix:** Phases 019 and later follow-ons added `ensureCodeGraphReady()` logic, HEAD-change detection, tracked-file mtime checks, and true fresh/stale/empty reporting. In the current packet state, structural read paths can auto-index lightly stale graphs inline through bounded `selective_reindex`, while empty or broadly stale states surface explicit `full_scan` readiness and keep `code_graph_scan` as the operator-controlled rebuild step.

### Tool-routing enforcement

**Problem:** "Must use CocoIndex" style instructions were too passive. The AI often defaulted back to Grep/Glob even when the better tool was available.

**Fix:** Phase 025 added five layers of routing enforcement across server instructions, PrimePackage state, tool hints, runtime docs, and context-prime agents. The system now nudges tool choice where those decisions are actually made.

### Session-start injection debugging

**Problem:** Startup structural context for hook runtimes was still too weak and too coupled to older assumptions about available graph metadata.

**Fix:** Phase 026 added `loadMostRecentState()`, a shared startup-brief builder, and runtime-specific startup wiring for Claude and Gemini so structural startup summaries could reuse real session continuity data.

### Structural bootstrap for OpenCode flows

**Problem:** Hookless recovery needed a contract that said more than "the graph exists". It needed to tell the AI whether the graph was ready, stale, or missing and what to do next.

**Fix:** Phase 027 pushed that contract into `session_bootstrap`, `session_resume`, `session_health`, PrimePackage output, and OpenCode-oriented instructions so hookless runtimes could recover consistently without guessing.

### Startup highlight remediation

**Problem:** Review found that startup highlights were wasting space on duplicates, vendored/test code, and the wrong ranking signal.

**Fix:** Phase 028 rewrote the highlight query with deduplicated grouping, hard path exclusions, and incoming-call ranking. The final live query output is project-relevant again, which closed the review findings that triggered the follow-on phase.

---

## Documentation and Verification (4)

These changes made the packet shippable and explainable, not just functional.

### Runtime guidance and packet truth-sync

**Problem:** Several phases initially overstated what had shipped or let runtime-specific guidance drift away from actual behavior.

**Fix:** The packet repeatedly truth-synced its phase docs, root summaries, and recovery instructions so partial phases stayed marked as partial and later follow-on work could close those gaps honestly.

### Feature catalog and playbook coverage

**Problem:** Cross-runtime recovery and context-preservation work had landed faster than the catalog and manual-playbook surfaces could keep up.

**Fix:** Documentation phases expanded the feature catalog, testing playbook, and skill/reference docs so the new hook, graph, bootstrap, and routing behavior had operator-facing coverage.

### Focused and broad test lanes

**Problem:** This packet touched hooks, MCP handlers, graph storage, parser behavior, and user-facing guidance. A single narrow test pass would not be credible.

**Fix:** The work accumulated focused suites for hook-state, startup-brief, structural contract, parser/indexer, graph scan/query flows, and runtime fallback behavior, alongside broader build, lint, and `check:full` passes used during review remediation.

### Final validation cleanup

**Problem:** The packet hit a point where behavior had improved but validation, lint, and packet metadata still failed, which blocked a trustworthy closeout.

**Fix:** The 2026-04-02 review and remediation wave drove the packet back to a clean state: recursive packet validation passed at `0 errors / 0 warnings`, `npm run build` passed, `npm run check` passed, and `npm run check:full` passed after the cleanup lane.

### Post-review contract and checklist hardening

**Problem:** A post-remediation review found that the `session_bootstrap` tool schema lacked a formal output schema (the handler returned `nextActions` but the schema only documented input parameters), and two checklist evidence descriptions overstated the actual implementation mechanisms.

**Fix:** An `outputSchema` was added to the `session_bootstrap` tool definition documenting the full response shape, the `ToolDefinition` interface gained an optional `outputSchema` field, and checklist items CHK-010 and CHK-012 were tightened to describe the actual contract surfaces and validation mechanisms.

---

<details>
<summary>Technical Details: Files Changed (representative areas)</summary>

### Hooks and Session Recovery

| File | Changes |
| ---- | ------- |
| `mcp_server/hooks/claude/compact-inject.ts` | Compaction rescue payload generation, cache write path, later durability fixes |
| `mcp_server/hooks/claude/session-prime.ts` | Source-aware compact/startup/resume routing and startup-brief integration |
| `mcp_server/hooks/claude/session-stop.ts` | Stop-hook token tracking and best-effort save behavior |
| `mcp_server/hooks/gemini/session-prime.ts` | Gemini startup brief wiring and follow-on hook parity work |
| `mcp_server/hooks/memory-surface.ts` | Auto-priming, routing guidance, and bootstrap telemetry |

### Code Graph and Routing

| File | Changes |
| ---- | ------- |
| `mcp_server/lib/code-graph/structural-indexer.ts` | Symbol extraction, parser adapter work, correctness fixes |
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | Tree-sitter-backed parser implementation |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Graph storage, freshness checks, startup highlights query, remediation SQL |
| `mcp_server/lib/code-graph/seed-resolver.ts` | CocoIndex seed anchoring and confidence handling |
| `mcp_server/lib/code-graph/query-intent-classifier.ts` | Structural/semantic/hybrid intent classification |

### Runtime Surfaces and Docs

| File | Changes |
| ---- | ------- |
| `mcp_server/context-server.ts` | Server instructions, session-recovery sections, routing guidance |
| `mcp_server/handlers/session-bootstrap.ts` | Canonical hookless bootstrap surface |
| `mcp_server/tool-schemas.ts` | `ToolDefinition` interface, formal `outputSchema` for `session_bootstrap` |
| `AGENTS.md` | Startup/recovery and tool-routing parity for hookless flows |
| `CLAUDE.md` / `CODEX.md` / `GEMINI.md` | Cross-runtime recovery and routing instructions |
| `.opencode/agent/context-prime.md` | Structural bootstrap and tool-routing output guidance |

</details>

---

## Upgrade

No migration is required for operators already using the packet in-repo. The behavior changes are additive, but the packet history is not a flat "all phases fully complete" story: several middle phases were foundation or partial phases that were later tightened by follow-on work in phases `017`, `025`, and `026-028`. Treat the packet as complete at the current root state, not at any single intermediate checkpoint.
