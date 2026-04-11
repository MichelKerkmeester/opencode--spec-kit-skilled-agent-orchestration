# Implementation Design — Phase 018 Canonical Continuity Refactor

> **One-page executive summary** of the 20-iteration implementation design research.
> Based on: `research/research.md` + `research/iterations/iteration-001.md` through `iteration-020.md` + `../phase-017-rerun-seed.md`

## The Recommendation

Adopt **Option C — Wiki-Style Spec Kit Updates with thin continuity layer**. Canonical narrative routes into existing spec kit docs. A minimal continuity layer (~2KB per spec doc) lives in the doc's frontmatter under `_memory.continuity`. All 13 advanced memory features retarget onto the new substrate. Zero deletions.

## The 4 New Components

1. **`contentRouter`** — classifies session content into 8 categories via a 3-tier classifier (rule → embedding → LLM)
2. **`anchorMergeOperation`** — 5 merge modes inside the existing `withSpecFolderLock` atomic envelope
3. **`thinContinuityRecord`** — YAML sub-block `_memory.continuity` in spec doc frontmatter (NOT a new storage primitive)
4. **`resumeLadder`** — fast path: `handover.md` → `_memory.continuity` → spec docs → archived memory

## Code Change Footprint

- **2 pipeline stages rewritten** (out of 16 in `memory-save.ts`): template contract + atomic save
- **6 stages adapted** with small edits
- **8 stages pass through unchanged**
- **~147 total files touched** across commands, agents, handlers, templates, docs, tests
- **~52 engineer-days** total effort (4-6 weeks with 1-3 engineers)

## Feature Preservation

All 13 advanced memory features retargeted, not deleted:

| Feature | Effort |
|---|:---:|
| Trigger phrase matching | S (index filter update) |
| Intent-aware retrieval | S (mapping table update) |
| Session dedup | XS (no code change) |
| Quality gates | M (1 new module + 4 small edits) |
| Reconsolidation | S (unified with merge idempotency) |
| Causal graph (6 relations) | M (schema: 2 new columns) |
| Memory tiers | XS (optional anchor override) |
| FSRS cognitive decay | XS (no formula change) |
| Shared memory governance | XS (no code change) |
| Ablation / drift analysis | S (new metric) |
| Constitutional memory | M (moved to dedicated dir) |
| Embedding semantic search | XS (no change) |
| 4-stage search pipeline | XS (no change) |

## UX Wins

- **Resume latency**: ~1200ms → ~300ms (4x improvement, no embedding compute on happy path)
- **Resume content**: ~10KB → ~3KB (3x reduction, no duplicate memory narrative)
- **Save transparency**: user sees routing decisions BEFORE writing (current system is a black box)
- **Routing overrideable**: confidence tiers + human-wins arbitration + interactive mode

## Migration Strategy (M4)

- **Week 0**: Backfill ~5 root packets with canonical `implementation-summary.md` (prerequisite)
- **Day 0**: Flip `is_archived=1` on all 155 memory files; deprioritize in ranking (weight × 0.3)
- **Days 1-30**: Phase 018 code work lands; fresh spec-doc writes begin
- **Day 180**: Data-driven permanence decision via `archived_hit_rate`
  - < 0.5% → retire, pursue Option F in phase 021
  - 0.5-2% → keep thin layer permanently
  - \> 2% → investigate routing rules

## Phased Rollout (6 Gates)

| Gate | Phase | Duration | Deliverable |
|---|---|---|---|
| A | 018.0 — Pre-work | ~1 week | Root packet backfill + embedding health + backup |
| B | 018.1 — Foundation | ~2 weeks | Schema migrations + archive flip + research complete |
| C | 018.2 — Writer ready | ~2 weeks | `contentRouter` + `anchorMerge` + tests + shadow |
| D | 018.3 — Reader ready | ~2 weeks | Retargeted retrieval + resume fast path |
| E | 019 — Runtime | ~3 weeks | Feature flag flip + cmd/agent updates + regression |
| F | 020 — Permanence | ~3 weeks | Cleanup + 30-day stable archived_hit_rate → decide |

**Total wall clock**: ~13 weeks end-to-end (~3 months). With 2-3 engineers working in parallel after Gate B, reducible to ~8-10 weeks.

## Top 5 Risks

1. **Schema migration corrupts `memory_index`** — LOW/HIGH — backup + test on copy + rollback script
2. **Routing classifier misroutes silently** — MED/MED — routing log + confidence thresholds + audits
3. **Resume latency regresses** — LOW/HIGH — benchmark + feature flag + auto-rollback on >20% regression
4. **Root packet missing canonical doc** — MED/MED — Gate A pre-work catches this
5. **Concurrent anchor write corrupts spec doc** — LOW/HIGH — mutex + mtime check + fingerprint verification

Full 10-item register in `research/iterations/iteration-020.md`.

## Testing Strategy

- ~250 tests across 4 classes (unit, integration, regression, performance) + 10 manual playbooks
- Regression tests per advanced feature lock in the preserve-13-features constraint
- `archived_hit_rate` metric gates phase 020 permanence decision
- Test budget: ~50 M-equivalent (12% of total), same as phase 017 iteration 8 estimate

## Go/No-Go Criteria per Gate

Each gate has explicit criteria in `research/iterations/iteration-020.md`. Summary:
- **Gate A**: 5 root packets backfilled + embedding <5s warmup + SQLite backup
- **Gate B**: schema tested + rollback verified + research converged + 155 files archived
- **Gate C**: >80% unit coverage + integration green + dual-write shadow equivalent
- **Gate D**: resume p95 <500ms + search p95 <300ms + archived_hit_rate <15%
- **Gate E**: all 13 regressions green + manual playbooks pass + metrics healthy
- **Gate F**: 30-day stable `archived_hit_rate` data → decision recorded

## Handover

Phase 018 implementation should:
1. Run the companion 5-iteration impact analysis research (`prompts/research-prompt-impact.md`) to get file-level change matrix
2. Start with Gate A pre-work
3. Use findings files under `findings/` for specific design decisions:
   - `findings/routing-rules.md` — content classification rules
   - `findings/feature-retargeting-map.md` — 13 features × retarget mechanism
   - `findings/resume-journey.md` — resume UX walkthrough
   - `findings/rollout-plan.md` — 6-gate rollout
4. Cite this document as the executive summary for sprint planning

## Decision

The research is converged. Option C is implementable. Phase 018 can proceed to Gate A pre-work immediately.
