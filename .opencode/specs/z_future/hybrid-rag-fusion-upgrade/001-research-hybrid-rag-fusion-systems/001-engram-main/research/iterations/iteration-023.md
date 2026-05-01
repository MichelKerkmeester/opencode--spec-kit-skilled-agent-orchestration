# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Engram does not implement retrieval-time forgetting; it uses recency formatting and consolidation instead
- **Source**: `001-engram-main/external/internal/store/store.go:754-840,1076-1105,1462-1584,1613-1667,3384-3392`; `001-engram-main/external/internal/mcp/mcp.go:375-395,460-562`; `001-engram-main/external/docs/ARCHITECTURE.md:40-48,86-95`
- **What it does**: Engram persists sessions with `CreateSession()`/`EndSession()`, shows recent sessions/prompts/observations via `FormatContext()`, orders recent observations by `created_at DESC`, and searches by direct `topic_key` lookup plus FTS5 `rank`. There is no search-time decay factor, no archival state, no TTL, and no age-based demotion beyond those recency-oriented list orderings.
- **Why it matters**: Engram’s answer to aging is not automatic forgetting; it is durable search plus a bounded recent-context surface. For Spec Kit Memory, that argues against flattening long-lived memory into plain recency or FTS ranking.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Engram’s main anti-decay mechanism is memory hygiene through reconsolidation, not scheduled retention policy
- **Source**: `001-engram-main/external/internal/store/store.go:948-1074,1313-1349,3328-3337`; `001-engram-main/external/docs/ARCHITECTURE.md:86-117`
- **What it does**: `AddObservation()` upserts by `topic_key`, increments `revision_count`, collapses exact duplicates inside a 15-minute dedupe window, increments `duplicate_count`, and refreshes `last_seen_at`/`updated_at`. Deletion is soft by default through `deleted_at`, so stale memories are hidden rather than physically forgotten.
- **Why it matters**: Engram’s real retention policy is “reduce noise before it becomes clutter.” The transferable lesson for Public is stronger reconsolidation/thread hygiene, not weaker decay.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Public already has the temporal primitives Engram lacks, so the right strategy is tiered permanence plus archival, not flatter recency
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:8-25,76-135,237-367,369-454`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:37-71,238-329,496-510`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:181-201,357-445,558-685`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:188-203,505-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:52-80,128-195`; `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:133-145,216-234`
- **What it does**: Public applies canonical FSRS long-term decay, classification-aware stability multipliers, no-decay treatment for permanent planning/constitutional/critical contexts, five memory states (`HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED`), optional state filtering, and a 90-day archival lane for low-access, low-confidence memories while protecting critical tiers.
- **Why it matters**: Long-lived memory systems need explicit permanence classes, retrievability decay for engagement-sensitive material, and separate archival for low-value stale material. Engram is useful on consolidation hygiene, but Public already has the stronger temporal model.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Recent-session digesting should stay separate from decay policy
- **Source**: `001-engram-main/external/internal/store/store.go:818-840,1076-1105,1613-1667`; `001-engram-main/external/internal/mcp/mcp.go:375-395,460-562`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400-614`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-240`
- **What it does**: Engram keeps startup continuity cheap by formatting a recent-session digest over sessions, prompts, and recent observations, while long-term search stays separate. Public’s richer resume/bootstrap path should preserve that separation.
- **Why it matters**: Short-term continuity is not a substitute for durable forgetting policy. The right model is two-lane: deterministic recent-session briefing for startup/compaction recovery, plus independent long-term decay and archival for the corpus.
- **Recommendation**: adopt now
- **Impact**: medium

## Assessment
- New information ratio: 0.33

## Recommended Next Focus
Compare Engram’s consolidation-first hygiene against Modus Memory’s FSRS-first design and OpenCode Mnemosyne’s hybrid recall stack to decide which Public improvements belong in reconsolidation/thread management versus long-term ranking and archival.

**Blocked on persistence**: this runtime denied writes to the phase folder, so I could not save `iteration-023.md`.


Total usage est:        1 Premium request
API time spent:         5m 9s
Total session time:     5m 33s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.3m in, 22.7k out, 2.2m cached, 6.7k reasoning (Est. 1 Premium request)
