# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Modus’s MCP health surface is thinner than advertised, and thinner than Public’s actual hygiene control plane
- **Source**: `external/internal/mcp/memory.go:7-39`; `external/internal/mcp/vault.go:219-227`; `external/internal/vault/vault.go:123-158`; `external/cmd/modus-memory/doctor.go:19-31`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-594`
- **What it does**: Modus exposes `vault_status` as its only MCP-visible hygiene/status tool in the memory toolset, and the tool description claims “file counts, index size, cross-ref stats.” But `StatusJSON()` only returns `total_files`, `index_docs`, and a top-level directory breakdown. The richer cross-ref counts are only computed inside the separate `doctor` CLI. Public’s `memory_health`, by contrast, reports database/connectivity state, embedding/provider metadata, alias conflicts, FTS drift, orphan cleanup outcomes, and gated `autoRepair`.
- **Why it matters for us**: For agent-facing hygiene, status needs to be both truthful and actionable. Modus splits diagnostics between MCP and an offline CLI and under-delivers on the MCP side; Public already has the stronger operational pattern.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus’s `doctor` has one reusable hygiene idea Public does not fully cover yet: content-level contradiction and duplicate-fact linting
- **Source**: `external/cmd/modus-memory/doctor.go:42-84`; `external/cmd/modus-memory/doctor.go:108-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:296-376`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:445-594`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:647-680`
- **What it does**: Modus `doctor` explicitly scans fact files for missing `subject`/`predicate`, duplicate `subject+predicate` pairs, and “same subject, same predicate, different value” contradictions. Public `memory_health` is stronger on infrastructure integrity and repair, but its current checks center on schema/DB/FTS/alias/vector/orphan health. Public’s contradiction tooling today is causal-edge oriented, not fact-content oriented.
- **Why it matters for us**: This is the clearest hygiene gap where Modus has a useful idea. A content-level contradiction/duplicate pass would complement Public’s existing infra health tooling instead of duplicating it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Modus cross-references are associative adjacency maps, not a causal-memory hygiene system
- **Source**: `external/internal/index/crossref.go:9-214`; `external/internal/mcp/vault.go:75-101`; `external/internal/mcp/vault.go:899-925`; `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:339-540`; `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557-847`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18-52`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:173-247`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:616-760`
- **What it does**: Modus builds an in-memory `bySubject`/`byTag`/`byEntity` cross-index, scores connections with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected docs to search results or returns them via `vault_connected`. Public stores typed causal edges (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), exposes traversal in both directions, tracks graph coverage/orphans, records `weight_history`, and applies contradiction detection and edge bounds.
- **Why it matters for us**: Modus’s cross-links are useful for loose discovery, but they do not preserve decision lineage or graph hygiene. They cannot answer the same class of “why was this decision made?” questions that Public’s causal graph can.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Modus has no trigger-recall plane; its query hygiene stops at query expansion
- **Source**: `external/internal/mcp/memory.go:7-39`; `external/internal/mcp/vault.go:21-104`; `external/internal/mcp/vault.go:273-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-229`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:273-550`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157-185`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337-440`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:644-689`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:695-791`
- **What it does**: Modus exposes search plus Librarian expansion, but no trigger-phrase cache, no prompt-signal vocabulary, no scope/session validation, no degraded-mode reporting for trigger sources, and no co-activation or tiered-context recall path. Public’s trigger system caches validated phrases from `memory_index`, uses Unicode-aware boundary matching plus candidate indexing, fails closed on scope errors, reports degraded source parsing, supports signal boosts, and layers session-aware decay/co-activation/tier filtering on top.
- **Why it matters for us**: Trigger recall is a hygiene/control feature as much as a retrieval feature: it governs safe latent-context surfacing. Modus does not offer a comparable mechanism to borrow here.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus’s markdown pipeline is intentionally permissive, but that permissiveness weakens authoritative memory hygiene
- **Source**: `external/internal/markdown/parser.go:98-159`; `external/internal/markdown/parser.go:161-186`; `external/internal/markdown/writer.go:10-51`; `external/internal/vault/facts.go:348-375`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1273-1418`
- **What it does**: Modus treats malformed YAML frontmatter as raw body, skips parse failures during directory scans, writes frontmatter/body directly with no validation gate, and handles duplicate fact writes by suffixing filenames (`-2`, `-3`, ...). Public’s `memory_save` path runs explicit preflight checks for anchors, duplicates, tokens, and size, supports dry-run, and rejects invalid saves unless the caller deliberately bypasses preflight.
- **Why it matters for us**: Modus is optimized for lightweight human-editable vault ergonomics, not for high-integrity memory ingestion. That tradeoff is fine for a personal markdown vault, but it is weaker than Public’s current hygiene bar for durable indexed memory artifacts.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- `external/internal/index/crossref.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/internal/vault/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/cmd/modus-memory/doctor.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

## Assessment
- **New information ratio**: 0.76
- **Questions addressed**: whether Modus has a real MCP-visible hygiene/status plane; whether its cross-references overlap with Public causal links; whether Modus has any trigger-recall equivalent; whether its markdown pipeline enforces memory quality; whether any doctor-style checks should transfer into Public.
- **Questions answered**: Modus’s MCP status tooling is materially weaker than Public’s health surface; its adjacency maps are not substitutes for Public’s causal graph; it has no trigger-recall system comparable to Public’s; its markdown ingestion is permissive rather than hygiene-enforcing; the one transfer-worthy idea is a doctor-style duplicate/contradictory fact audit for Public.

## Reflection
- **What worked**: Tracing tool registration first and then following the actual handler implementations separated “claimed hygiene” from “agent-visible hygiene” quickly. Comparing `doctor` against `memory_health` also made it easy to distinguish useful content checks from overall control-plane strength.
- **What did not work**: Broad keyword searches on the Modus tree were noisy for hygiene because most of the relevant behavior is split across MCP handlers, vault helpers, and the standalone CLI. The trigger comparison was mostly an absence proof, so it only became solid after checking the full Modus memory tool surface rather than individual files.

## Recommended Next Focus
Compare against a system that combines **content-level memory linting, session-scoped recall controls, and typed relationship hygiene** in one agent-visible surface, so the next pass can separate “good markdown ergonomics” from a genuinely complete memory-governance design.


Total usage est:        1 Premium request
API time spent:         3m 55s
Total session time:     4m 16s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 12.8k out, 1.1m cached, 6.3k reasoning (Est. 1 Premium request)
