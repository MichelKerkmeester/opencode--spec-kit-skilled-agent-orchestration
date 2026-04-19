# Q-C — Composition Risk vs Public's Split Topology

> Iteration 6 of master consolidation. Cross-phase synthesis #4 of 6.

## Public's split topology (recap)
- **CocoIndex** = semantic code search and vector-index management. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:231-241] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:267-305]
- **Code Graph MCP** = structural analysis, graph neighborhoods, callers/imports traversal, and freshness-aware inline readiness. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-237] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:661-695]
- **Spec Kit Memory** = session continuity, recovery, memory retrieval, and orchestration glue such as `session_resume` and `session_bootstrap`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:737-775] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217]
- **Ground rule** = Public intentionally routes structural, semantic, and memory queries to different owners. That split is explicit in the server README. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:529-543]

## TL;DR
- Scored candidates: `28`
- Risk split: `low = 16`, `med = 9`, `high = 3`
- Biggest composition risk: candidates that try to invent one canonical upstream scan/bootstrap layer across semantic, structural, and memory surfaces instead of respecting Public's existing routing split. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543]
- Safest fast wins: Claudest's cached `context_summary` fast path, Graphify's graph-first hook nudge, CodeSight's F1 harness, Contextador's MCP scaffold ergonomics, and Graphify's schema-boundary validator. [SOURCE: phase-5/research/research.md:396-396] [SOURCE: phase-4/research/research.md:561-561] [SOURCE: phase-2/research/research.md:481-481] [SOURCE: phase-3/research/research.md:277-279] [SOURCE: phase-4/research/research.md:730-730]
- Q-A matters to Q-C: Public already dominates semantic and structural query, so candidates that blur those surfaces without improving measurement discipline compose badly. [SOURCE: research/cross-phase-matrix.md:12-18] [SOURCE: research/iterations/q-a-token-honesty.md:13-14]

## Candidate composition table

| # | Candidate | Phase | Q-E verdict | Surface(s) touched | Composition risk | Conflict notes |
|---|-----------|-------|-------------|---------------------|------------------|----------------|
| 1 | Single-canonical-ScanResult orchestration shape | 002 | `mixed` | CocoIndex + Code Graph + Spec Kit Memory | `high` | Assumes one upstream scan feeding multiple surfaces; clashes with explicit split routing. [SOURCE: phase-2/research/research.md:469-469] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] |
| 2 | AST-first / regex-fallback / confidence labels | 002 | `mixed` | Code Graph | `low` | Single-surface structural improvement; no semantic/memory overlap. [SOURCE: phase-2/research/research.md:471-471] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-237] |
| 3 | Per-tool profile overlay split | 002 | `mixed` | new surface | `low` | Static assistant-profile generation sits beside the three core surfaces. [SOURCE: phase-2/research/research.md:473-473] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] |
| 4 | Static artifacts as default + MCP as overlay | 002 | `mixed` | new surface + Code Graph/Memory projections | `med` | Adds a packaging layer above existing surfaces and needs careful source-of-truth boundaries. [SOURCE: phase-2/research/research.md:475-475] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] |
| 5 | F1 fixture harness for detector regression | 002 | `mixed` | new surface | `low` | Test-only utility; zero routing conflict. [SOURCE: phase-2/research/research.md:481-481] [SOURCE: research/iterations/q-a-token-honesty.md:8-8] |
| 6 | Hot-file ranking by incoming import count | 002 | `mixed` | Code Graph | `low` | Fits structural analysis only if named honestly as degree count. [SOURCE: phase-2/research/research.md:485-485] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:200-237] |
| 7 | SQLAlchemy AST schema extraction | 002 | `mixed` | Code Graph | `med` | New detector/schema work inside one surface; no cross-surface ownership conflict. [SOURCE: phase-2/research/research.md:720-720] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:529-539] |
| 8 | Config-gated bootstrap layering | 003 | `concept-transfer-only` | CocoIndex + Code Graph + Spec Kit Memory | `high` | Pushes toward one bootstrap facade over all three substrates; risks turning split routing into a monolith. [SOURCE: phase-3/research/research.md:273-275] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:737-775] |
| 9 | Generated `.mcp.json` scaffold plus setup hints | 003 | `concept-transfer-only` | new surface | `low` | Activation ergonomics only; no schema conflict with core surfaces. [SOURCE: phase-3/research/research.md:277-279] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md:54-54] |
| 10 | Benchmark-honest token reporting | 003 | `concept-transfer-only` | Spec Kit Memory | `low` | Measurement rubric layers cleanly onto existing telemetry/reporting. [SOURCE: phase-3/research/research.md:281-283] [SOURCE: research/iterations/q-a-token-honesty.md:13-14] |
| 11 | Evidence-tagging contract + `confidence_score` | 004 | `mixed` | CocoIndex + Code Graph | `med` | Additive schema extension across two read surfaces; safe if tiers remain surface-local, risky if treated as one merged truth scale. [SOURCE: phase-4/research/research.md:560-560] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] |
| 12 | Graph-first PreToolUse hook | 004 | `mixed` | new surface routing to CocoIndex + Code Graph | `low` | Nudges the model toward the existing split instead of replacing it. [SOURCE: phase-4/research/research.md:561-561] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:543-543] |
| 13 | Two-layer cache invalidation | 004 | `mixed` | CocoIndex + Code Graph | `med` | Cross-surface freshness policy work, but still preserves separate owners and indexes. [SOURCE: phase-4/research/research.md:562-562] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:539-541] |
| 14 | CLAUDE.md companion section pattern | 004 | `mixed` | new surface | `low` | Guidance layer only; composes by reinforcing split routing. [SOURCE: phase-4/research/research.md:563-563] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:543-543] |
| 15 | `validate.py` schema-boundary validator | 004 | `mixed` | Code Graph / new surface | `low` | Local validation layer at interchange boundary; no routing conflict. [SOURCE: phase-4/research/research.md:730-730] [SOURCE: 004-graphify/external/ARCHITECTURE.md:27-47] |
| 16 | Leiden clustering | 004 | `mixed` | Code Graph | `med` | Optional structural overlay; one-surface change with tunable params needed from day one. [SOURCE: phase-4/research/research.md:573-573] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:529-539] |
| 17 | Modality-aware rebuild policy layer | 004 | `mixed` | CocoIndex + Code Graph + new orchestration layer | `high` | Coordinates freshness across multiple surfaces and can blur who owns rebuild state. [SOURCE: phase-4/research/research.md:734-734] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:539-543] |
| 18 | Stable JSON interchange artifact | 004 | `mixed` | new surface + Code Graph | `med` | Adds a durable projection boundary, but needs provenance ownership rules. [SOURCE: phase-4/research/research.md:736-736] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] |
| 19 | Runtime FTS capability cascade | 005 | `mixed` | Spec Kit Memory | `med` | Single-surface storage/search change, but it touches schema, migration, and query fallback behavior. [SOURCE: phase-5/research/research.md:395-395] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:47-55] |
| 20 | Cached `context_summary` SessionStart fast path | 005 | `mixed` | Spec Kit Memory | `low` | Direct fit for continuity/recovery surface; no semantic or structural overlap. [SOURCE: phase-5/research/research.md:396-396] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-775] |
| 21 | Deterministic summary computation at Stop time | 005 | `mixed` | Spec Kit Memory | `low` | Producer-side improvement inside the same memory pipeline. [SOURCE: phase-5/research/research.md:397-397] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:112-217] |
| 22 | Auditor vs discoverer split | 005 | `mixed` | Spec Kit Memory | `med` | Reorganizes memory-quality workflow inside one surface; no cross-surface conflict, but non-trivial pipeline split. [SOURCE: phase-5/research/research.md:398-398] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:84-92] |
| 23 | 4-phase consolidation contract | 005 | `mixed` | Spec Kit Memory | `low` | Workflow scaffold for existing memory review flows. [SOURCE: phase-5/research/research.md:399-399] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:84-92] |
| 24 | Per-tier pricing and cache normalization | 005 | `mixed` | Spec Kit Memory | `med` | Analytics schema extension within one surface; moderate implementation cost, low topology risk. [SOURCE: phase-5/research/research.md:400-400] [SOURCE: research/iterations/q-a-token-honesty.md:11-14] |
| 25 | Cache-cliff metric | 005 | `mixed` | Spec Kit Memory | `low` | Observability metric on top of existing session/telemetry data. [SOURCE: phase-5/research/research.md:401-401] [SOURCE: research/iterations/q-a-token-honesty.md:11-14] |
| 26 | Dashboard JSON contracts | 005 | `mixed` | Spec Kit Memory / new observability surface | `low` | Presentation contract only if HTML is not imported wholesale. [SOURCE: phase-5/research/research.md:402-402] [SOURCE: research/iterations/q-a-token-honesty.md:123-125] |
| 27 | Placement rubric for memory consolidation | 005 | `mixed` | Spec Kit Memory | `low` | Policy layer over existing memory destinations, not a new retrieval surface. [SOURCE: phase-5/research/research.md:404-404] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:84-92] |
| 28 | Search/browse separation | 005 | `mixed` | Spec Kit Memory | `low` | Strengthens one surface's API clarity and already partly matches Public's mode split. [SOURCE: phase-5/research/research.md:405-405] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:62-62] |

## Per-candidate rationale (top 10)

### Candidate 1 — Single-canonical-ScanResult orchestration shape
**Phase:** 002  
**Q-E verdict:** `mixed`  
**Risk:** `high`  
**Touches:** CocoIndex + Code Graph + Spec Kit Memory  
**Conflict:** wants one canonical upstream scan that every surface projects from  
**Why this risk score:** Public's architecture document is explicit that semantic, structural, and memory queries already have separate owners and routes. CodeSight's "one canonical scan, late-bound projections" is elegant in isolation, but here it would pressure Public toward a monolithic upstream model that weakens the split-by-type boundary. Q-A also matters: CodeSight's own token story is heuristic, so centralizing everything behind its pattern would make per-surface measurement murkier, not cleaner. [SOURCE: phase-2/research/research.md:469-469] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] [SOURCE: research/iterations/q-a-token-honesty.md:8-14]

### Candidate 2 — Config-gated bootstrap layering
**Phase:** 003  
**Q-E verdict:** `concept-transfer-only`  
**Risk:** `high`  
**Touches:** CocoIndex + Code Graph + Spec Kit Memory  
**Conflict:** encourages one bootstrap facade above all three substrates  
**Why this risk score:** Public already has `session_resume` and `session_bootstrap`, but those are recovery/orchestration surfaces, not a universal retrieval facade. Expanding that idea into the main composition layer would blur semantic, structural, and memory ownership and pull Public toward the monolithic surface model Q-C is supposed to resist. [SOURCE: phase-3/research/research.md:273-275] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-775] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543]

### Candidate 3 — Modality-aware rebuild policy layer
**Phase:** 004  
**Q-E verdict:** `mixed`  
**Risk:** `high`  
**Touches:** CocoIndex + Code Graph + new orchestration layer  
**Conflict:** needs a shared freshness scheduler spanning multiple indexes  
**Why this risk score:** The idea is valuable, but it crosses ownership lines. Public's read-path readiness already treats code-graph freshness as a local concern, and CocoIndex has its own indexing lifecycle. A modality-aware rebuild coordinator would need to decide when each surface is authoritative, which is precisely where split-topology systems get accidental coupling. [SOURCE: phase-4/research/research.md:734-734] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:539-543] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:267-305]

### Candidate 4 — Cached `context_summary` SessionStart fast path
**Phase:** 005  
**Q-E verdict:** `mixed`  
**Risk:** `low`  
**Touches:** Spec Kit Memory  
**Conflict:** none beyond producer/consumer plumbing  
**Why this risk score:** This pattern slots directly into Public's continuity surface. It improves startup recall without claiming ownership over semantic or structural query, and Q-A already identified Claudest's cached summary path as the most measurement-mature savings vector in the set. [SOURCE: phase-5/research/research.md:396-396] [SOURCE: research/iterations/q-a-token-honesty.md:11-14] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-775]

### Candidate 5 — Runtime FTS capability cascade
**Phase:** 005  
**Q-E verdict:** `mixed`  
**Risk:** `med`  
**Touches:** Spec Kit Memory  
**Conflict:** requires storage and fallback-path changes inside one surface  
**Why this risk score:** The cascade lives entirely inside Memory's storage/query layer, so it does not threaten the split topology. The reason it is `med`, not `low`, is operational: it touches schema creation, migration, and fallback semantics, so the implementation cost is real even though the architecture conflict is small. [SOURCE: phase-5/research/research.md:395-395] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:47-55]

### Candidate 6 — Evidence-tagging contract + `confidence_score`
**Phase:** 004  
**Q-E verdict:** `mixed`  
**Risk:** `med`  
**Touches:** CocoIndex + Code Graph  
**Conflict:** additive schema work across two surfaces  
**Why this risk score:** This is attractive because it makes uncertainty explicit, but Public must avoid pretending that vector relevance and structural certainty are the same kind of signal. If the fields stay additive and surface-local, the idea composes. If Public tries to collapse them into one unified truth scale, it starts fighting the split topology. [SOURCE: phase-4/research/research.md:560-560] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543] [SOURCE: research/iterations/q-a-token-honesty.md:13-14]

### Candidate 7 — Graph-first PreToolUse hook
**Phase:** 004  
**Q-E verdict:** `mixed`  
**Risk:** `low`  
**Touches:** new routing surface pointing to Code Graph + CocoIndex  
**Conflict:** none; it reinforces existing surface ownership  
**Why this risk score:** The hook is valuable precisely because it teaches the model to choose the right already-existing surface: structural queries to `code_graph_query`, semantic ones to CocoIndex, raw grep last. That is composition help, not composition pressure. [SOURCE: phase-4/research/research.md:561-561] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:543-543]

### Candidate 8 — Per-tool profile overlay split
**Phase:** 002  
**Q-E verdict:** `mixed`  
**Risk:** `low`  
**Touches:** new surface  
**Conflict:** none if kept as a generator, not as a fourth retrieval owner  
**Why this risk score:** Public already produces assistant-facing prompts and wrappers. A shared summary plus profile-specific overlays is a packaging pattern above the core retrieval surfaces, so it composes cleanly as long as it does not become a second source of routing truth. [SOURCE: phase-2/research/research.md:473-473] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md:170-170]

### Candidate 9 — `validate.py` schema-boundary validator
**Phase:** 004  
**Q-E verdict:** `mixed`  
**Risk:** `low`  
**Touches:** Code Graph / new interchange surface  
**Conflict:** none  
**Why this risk score:** This is a classic low-risk utility. It validates interchange payloads before graph assembly, which improves robustness without changing the surface split. It is the kind of bounded hardening layer that composes well in a split system. [SOURCE: phase-4/research/research.md:730-730] [SOURCE: 004-graphify/external/ARCHITECTURE.md:27-47] [SOURCE: 004-graphify/external/graphify/validate.py:1-71]

### Candidate 10 — Benchmark-honest token reporting
**Phase:** 003  
**Q-E verdict:** `concept-transfer-only`  
**Risk:** `low`  
**Touches:** Spec Kit Memory  
**Conflict:** none  
**Why this risk score:** Q-A already concluded that Public needs stricter publication discipline for token claims. A reporting rubric is additive observability logic, not a topology change, so it composes cleanly and strengthens cross-surface accountability rather than weakening it. [SOURCE: phase-3/research/research.md:281-283] [SOURCE: research/iterations/q-a-token-honesty.md:13-14] [SOURCE: research/iterations/q-a-token-honesty.md:121-125]

## High-risk candidates (full list, even if not in top 10)

### Single-canonical-ScanResult orchestration shape
This would cost the most conceptually. Public would need a shared upstream representation capable of serving semantic search, structural traversal, and session continuity at once, then keep freshness semantics coherent across all three. That is not a "small adapter"; it is a redesign pressure toward one super-surface. [SOURCE: phase-2/research/research.md:469-469] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:531-543]

### Config-gated bootstrap layering
This one looks safer than it is because Public already has bootstrap tools. The cost comes from scope creep: once bootstrap becomes the central abstraction for all context work, semantic, structural, and memory concerns start competing inside one facade. Public would spend effort deciding who owns routing, freshness, and failure semantics that are currently separated cleanly. [SOURCE: phase-3/research/research.md:273-275] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-775]

### Modality-aware rebuild policy layer
The policy is useful, but implementing it well means designing a repo-change classifier, a cross-surface invalidation contract, and a freshness-reporting story that spans both Code Graph and CocoIndex. That is moderate-to-high integration work because the split topology currently keeps those responsibilities mostly local to each surface. [SOURCE: phase-4/research/research.md:734-734] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:539-543]

## Risk distribution

| Phase | Low risk | Med risk | High risk | Excluded by Q-E |
|---|---:|---:|---:|---:|
| 002 CodeSight | 4 | 2 | 1 | 0 |
| 003 Contextador | 2 | 0 | 1 | 0 |
| 004 Graphify | 3 | 4 | 1 | 0 |
| 005 Claudest | 7 | 3 | 0 | 0 |
