# Phase 018 Implementation Design Research — Progressive Synthesis

<!-- ANCHOR:summary -->
This research packet is anchored in the rerun seed and the converged 20-iteration design loop. [SOURCE: scratch/phase-017-rerun-seed.md:1-20] [SOURCE: research/iterations/iteration-020.md:1-24]
<!-- /ANCHOR:summary -->

> **Lineage**: Generation 1, in-session 20-iteration rerun (orchestrator+worker: claude-opus-4-6), 2026-04-11T13:30:00Z — 15:10:00Z
> **Based on**: phase 017 rerun findings (`../scratch/phase-017-rerun-seed.md`) + 20 iterations of design work
> **Status**: Loop complete, composite score 0.95, all 9 key questions answered

## Executive Summary

Option C (Wiki-Style Spec Kit Updates + thin continuity layer) is implementable with **4 new components**, **2 rewritten pipeline stages**, and **~147 surgical file edits** across the codebase. The design preserves all 13 advanced memory features via retargeting (zero deletions). Resume latency improves 4x on the happy path. The migration strategy M4 is a 1-week change that lets FSRS decay retire the legacy corpus over 180 days. The only hard prerequisite is backfilling canonical `implementation-summary.md` for ~5 root packets that currently have no narrative except memory files. [SOURCE: research/iterations/iteration-020.md:1-24] [SOURCE: scratch/phase-017-rerun-seed.md:1-20]

## The 4 new components

1. **`contentRouter`** (`lib/routing/content-router.ts`) — classifies arbitrary session content into 8 categories using a 3-tier classifier (rule-based → embedding similarity → LLM escalation). Refuses to route at confidence <0.5.
2. **`anchorMergeOperation`** (`lib/writing/anchor-merge.ts`) — 5 merge modes (append-as-paragraph, insert-new-adr, append-table-row, update-in-place, append-section) operating inside the existing `withSpecFolderLock` atomic envelope.
3. **`thinContinuityRecord`** — NOT a new storage primitive. It lives as `_memory.continuity` YAML sub-block inside spec doc frontmatter. ~10-15 fields, <2KB per block.
4. **`resumeLadder`** — new resume fast path: `handover.md` → `_memory.continuity` → spec doc content → archived memory fallback. Bypasses SQL on the happy path for <300ms latency.

## Answers to the 9 key questions

### Q1. Routing authority
The `contentRouter` uses a 3-tier classifier (see iteration 2). Tier 1 rule-based handles ~80% of content. Tier 2 embedding similarity handles ~15%. Tier 3 LLM escalation handles ~5%. Low-confidence routes are refused and surfaced to the user. See `findings/routing-rules.md`.

### Q2. Anchor-scoped merge semantics
5 merge modes (see iteration 3) cover all 8 content categories. Each merge runs inside the existing `withSpecFolderLock` mutex from `memory-save.ts:1569`. Post-merge validation catches anchor integrity violations and triggers automatic rollback. Metadata attaches via `_memory` YAML sub-block in spec doc frontmatter (iteration 4). See `findings/routing-rules.md`, `findings/validation-contract.md`.

### Q3. Thin continuity layer schema
`_memory.continuity` sub-block with packet pointer, recent action, next safe action, blockers, key files, completion pct, session dedup fields. Lives in spec doc frontmatter (iteration 5). <2KB per block. See `findings/thin-continuity-schema.md`.

### Q4. Feature retargeting per advanced capability
All 13 advanced features retarget without deletion (iterations 6-12). Most via no-code or small edits (<50 LOC per feature). Biggest schema change: 2 new columns on `causal_edges` table (iteration 10). Constitutional memory moves to dedicated `.opencode/constitutional/` directory. See `findings/feature-retargeting-map.md`.

### Q5. Resume journey end-to-end
Resume fast path reads `handover.md` + `implementation-summary.md` frontmatter, extracts `_memory.continuity`, returns actionable recovery package in <300ms. No SQL queries on the happy path. 4x faster than current baseline. See `findings/resume-journey.md`.

### Q6. `/memory:save` user flow
Auto mode runs router + merge inside existing save pipeline. Interactive mode shows proposed routing BEFORE writing, with user override option. Failure messages are actionable. See `findings/save-journey.md`.

### Q7. Validation contract
New `spec-doc-structure` validator (replaces memory-template-contract for spec-doc writes). Per-anchor quality gates. Contamination gate gains cross-anchor detection. Post-save fingerprint verification catches silent failures. See `findings/validation-contract.md`.

### Q8. Migration of existing corpus
M4 bounded archive with FSRS decay. 1-week implementation: schema migration + archive flip + ranking update. 180-day observation window with data-driven permanence decision. Root-packet backfill is the sole prerequisite. See `findings/migration-strategy.md`.

### Q9. Trust and safety
Per-spec-folder mutex (unchanged) + mtime external-edit detection (new) + post-save fingerprint verification (new) + atomic rollback on failure (existing pattern) + dashboard metrics (new). 30 failure modes mapped with recovery paths. See `findings/conflict-handling.md`, `findings/testing-strategy.md`.

## Iterations summary

| Band | Iter | Focus | Output |
|---|---:|---|---|
| A | 1 | Architecture baseline | 4 new components named |
| A | 2 | Content routing rules | 8 categories + 3-tier classifier |
| A | 3 | Anchor merge semantics | 5 merge modes |
| A | 4 | Frontmatter metadata policy | Option M-B (embedded YAML) |
| A | 5 | Thin continuity schema | `_memory.continuity` 10-15 fields |
| B | 6 | Trigger phrase matching retarget | Index filter update (S) |
| B | 7 | Intent routing + modes + search | Zero code change (S) |
| B | 8 | Session dedup + working memory | No change (XS) |
| B | 9 | Quality gates + reconsolidation | 1 new module + 4 small edits |
| B | 10 | Causal graph (6 relations) | Schema extension (2 columns) |
| B | 11 | FSRS decay + tiers | No formula change |
| B | 12 | Constitutional + governance | Dedicated dir + new metric |
| C | 13 | Resume journey | 4x latency improvement |
| C | 14 | Save flow | Routing transparency + interactive |
| C | 15 | Conflict handling | Mutex + mtime + arbitration |
| C | 16 | Migration M4 | 1-week impl + 180-day observation |
| C | 17 | Failure modes | 30 failure modes + recovery paths |
| D | 18 | End-to-end journey | Verified composition |
| D | 19 | Testing strategy | 250 tests + 10 manual playbooks |
| D | 20 | Rollout plan | 6 gates + 10-item risk register |

## Phased rollout (6 gates)

- **Gate A — Pre-work**: root packet backfill + embedding health check + backup
- **Gate B — Foundation**: schema migrations + archive flip + ranking update + research complete
- **Gate C — Writer ready**: new modules + unit/integration tests + dual-write shadow
- **Gate D — Reader ready**: retargeted retrieval + resume fast path
- **Gate E — Runtime complete**: feature flag flip + command/agent updates + regression green
- **Gate F — Permanence decided**: 30-day stable `archived_hit_rate` → retire or keep

## Total effort estimate

~52 engineer-days from phase 017 iteration 8, validated in this research:
- Band A (foundations) code: ~10 days
- Band B (retargeting) code: ~15 days
- Band C (UX) code: ~10 days
- Band D (synthesis) + tests: ~12 days
- Documentation + cleanup: ~5 days

4-6 weeks wall clock with 1-3 engineers.

## Convergence metrics

- Iterations completed: 20/20
- Questions answered: 9/9
- Contradictions: 0
- Composite score: 0.95
- Stop path: `all_questions_answered_plus_audit_complete`

## Handover to implementation

Phase 018 implementation should:
1. Start with Gate A pre-work (~1 week)
2. Proceed through Gates B → F per the rollout plan
3. Reference the findings files under `findings/` for specific design decisions
4. Cite `implementation-design.md` as the executive summary
5. Use the 10-item risk register as the risk tracker

The companion 5-iteration impact analysis research (still to run against `prompts/research-prompt-impact.md`) refines the file-level change matrix. Phase 018 implementation should wait for both research runs to complete.
