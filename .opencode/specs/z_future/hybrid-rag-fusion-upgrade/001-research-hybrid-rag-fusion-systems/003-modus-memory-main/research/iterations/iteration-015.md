# Iteration 015: DEEP DIVE - SECOND PATTERN

## Focus
DEEP DIVE - SECOND PATTERN: Go deep on the second most impactful pattern. Full implementation analysis.

## Findings

### Finding 1: **Modus treats successful recall as a default write-on-read event**
- **Source**: `external/internal/mcp/vault.go:273-343`; `external/internal/vault/facts.go:160-217`; `external/internal/index/indexer.go:307-364`
- **What it does**: `memory_search` merges fact hits across librarian-expanded queries, then asynchronously calls `go v.ReinforceFact(f.ID)` for every returned fact. `MemFact.ID` is the relative markdown path loaded at index time, so the search result is directly wired back to the underlying file. `ReinforceFact()` then raises confidence toward `0.99`, grows `stability`, lowers `difficulty`, stamps `last_accessed`, and increments `access_count`.
- **Why it matters for us**: This is the core of Modus’s second pattern: recall is not just ranking telemetry, it is a lifecycle event that mutates memory state by default. Public already has the underlying primitive, but keeps it deliberately opt-in via `trackAccess` rather than making every search a write.
- **Recommendation**: **prototype later**
- **Impact**: **high**

### Finding 2: **Modus exposes decay, reinforcement, and archival as an operator-facing memory hygiene loop**
- **Source**: `external/internal/vault/facts.go:18-30`; `external/internal/vault/facts.go:64-157`; `external/internal/vault/facts.go:219-264`; `external/internal/mcp/vault.go:854-897`
- **What it does**: Fact decay is a first-class maintenance action (`memory_decay_facts`), archival is a first-class cleanup action (`memory_archive_stale`), and reinforcement is both implicit (`memory_search`) and explicit (`memory_reinforce`). The FSRS state lives in markdown frontmatter (`confidence`, `stability`, `difficulty`, `last_accessed`, `access_count`, `archived`), so operators can inspect and edit the lifecycle directly.
- **Why it matters for us**: Public has stronger internals than Modus here, but not the same explicit operating surface. Our FSRS, archival, and feedback systems mostly live behind retrieval and storage handlers; Modus shows the value of turning memory freshness into a visible maintenance workflow.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 3: **The visible “stale” surface in Modus is useful, but its actual scheduling heuristic is much cruder than it looks**
- **Source**: `external/internal/index/facts.go:53-79`; `external/internal/index/facts.go:187-229`; `external/internal/mcp/vault.go:319-331`; `external/internal/vault/facts.go:140-157`
- **What it does**: Search ranking uses simple age buckets from `createdAt` (`hot`, `warm`, `recent`, `cold`), and result rendering appends `⚠ >30d old` / `⚠ >90d old` warnings from `StalenessWarning()`. Those warnings are based on creation age, not `last_accessed`, `stability`, `difficulty`, or a real due-review timestamp. Archival is then driven by a confidence threshold, not a due queue.
- **Why it matters for us**: The surface is good; the heuristic is not. Public should not copy this exact implementation because our FSRS stack can already express a more truthful notion of “due,” “cold,” or “review-needed” than crude age bands.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 4: **Public already has richer decay/governance primitives than Modus, but they are intentionally hidden behind safer defaults**
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202-203`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:840-883`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1207`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-795`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:13-20`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:192-200`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361-404`
- **What it does**: Public’s `memory_search` defaults `trackAccess=false`, and Stage 2 only applies FSRS strengthening when that opt-in flag is set. `memory_validate` records positive/negative usefulness, adaptive signals, auto-promotion, learned feedback, and ground-truth selection. Batch learning is shadow-only, and archival uses protected tiers plus age/access/confidence filters. In other words, Public already has the mechanics Modus needs several explicit tools to approximate.
- **Why it matters for us**: The gap is no longer retrieval math or decay correctness. The gap is that Public’s stronger primitives are distributed across internals and safety rails, while Modus packages a simpler subset as an obvious operator workflow.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 5: **The best transfer is a thin review/due-items layer on top of Public’s existing systems—not Modus’s exact fact model**
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:471-479`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733-776`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:64-79`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:237-454`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-795`
- **What it does**: Public already exposes session readiness (`session_health`, `session_bootstrap`) and task-learning analytics (`task_preflight`, `task_postflight`), but not a comparable operator surface for memory hygiene. The right abstraction is a dedicated queue for memories that are due for review, repeatedly unhelpful, promotion-eligible, or archival candidates—fed by existing FSRS, validation, and archival signals.
- **Why it matters for us**: This is the concrete implementation delta. Modus proves the value of an operator-visible control plane, but Public should build that plane from its own stronger state model rather than regress to Modus’s simpler markdown-fact lifecycle.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

## Sources Consulted
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/index/crossref.go`
- `external/internal/vault/missions.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/prs.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- New information ratio: **0.81**
- Questions addressed: whether the second pattern is really a decay/review workflow rather than another retrieval feature; whether Modus’s recall loop mutates real source files or only in-memory state; whether its stale signals are true FSRS due-state or just age heuristics; whether Public already has equivalent primitives hidden behind safer defaults; whether the real gap is workflow/control-plane rather than memory math.
- Questions answered: **yes** — the second most impactful pattern is **operator-visible decay workflow**. Modus’s distinctive move is making recall, decay, stale detection, and archival obvious MCP actions. Public already has stronger FSRS/governance machinery, so the actionable gap is a **review/due-items surface**, not algorithm replacement.

## Reflection
- What worked: Tracing `memory_search` into `ReinforceFact()` and then confirming that `MemFact.ID` is the indexed relative markdown path made the write-on-read loop unambiguous. Comparing that directly against Public’s `trackAccess` gate and Stage 2 testing-effect path exposed the real difference very quickly.
- What did not work: Looking only at the FSRS formulas would have been misleading. The important difference is not that Modus has “better FSRS”; it is that Modus turns freshness into an operator workflow, while Public mostly keeps equivalent signals inside retrieval, validation, and background maintenance layers.

## Recommended Next Focus
Investigate a system with a real **due-items scheduler / review queue / approval inbox** so the next pass can determine how Public should surface review-needed, stale, promotion-eligible, and archival-candidate memories without inheriting Modus’s coarse age-based heuristics.


Total usage est:        1 Premium request
API time spent:         3m 36s
Total session time:     3m 55s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 12.4k out, 944.6k cached, 5.7k reasoning (Est. 1 Premium request)
