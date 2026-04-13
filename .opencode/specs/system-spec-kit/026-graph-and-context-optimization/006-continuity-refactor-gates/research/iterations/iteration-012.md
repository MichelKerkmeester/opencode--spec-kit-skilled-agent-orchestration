---
title: "Iteration 012 — Constitutional memory + shared memory governance + ablation (Features 9, 10, 11)"
iteration: 12
band: B
timestamp: 2026-04-11T14:30:00Z
worker: claude-opus-4-6
scope: q4_features_9_10_11
status: complete
focus: "Retarget governance, provenance, constitutional memory, ablation studies, drift analysis. Complete Band B."
maps_to_questions: [Q4, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-012.md"]

---

# Iteration 012 — Features 9, 10, 11: Governance, Ablation, Constitutional

## Features covered

- **Feature 9**: Shared memory governance — deny-by-default membership, provenance tracking (tenant_id, user_id, agent_id, session_id, shared_space_id)
- **Feature 10**: Ablation studies, dashboards, drift analysis (`memory_drift_why`)
- **Feature 11**: Constitutional memory — always-surface rules injected at top of results

## Shared memory governance retarget

**Current**: scope fields (tenant_id, user_id, agent_id, session_id, shared_space_id) are stored per `memory_index` row. Governance audit log tracks allow/deny decisions.

**Target**: same fields, same audit log. Scope is orthogonal to content storage — a spec doc row can carry the same governance metadata as a memory row.

**Provenance attachment**: in the `_memory.provenance` sub-block (iteration 4 schema). Every spec doc that gets indexed records which tenant/user/agent authored which write.

**Shared space access**: unchanged. `assertSharedSpaceAccess()` runs at save time and read time. If a write touches a shared-space doc, the governance check confirms the writer has edit rights. If a read queries a shared space, the governance check confirms the reader has view rights.

**Conflict handling**: `recordSharedConflict()` from `lib/collab/shared-spaces.ts` still detects when two writers claim the same doc concurrently. Under Option C, the conflict resolution is the merge operation from iteration 3 plus the iteration 15 arbitration rules (coming up).

## Ablation studies retarget

**Current**: `handlers/eval-reporting.ts` runs ablation tests against the memory corpus, measuring per-channel recall@20 deltas.

**Target**: same ablation framework, but ground-truth queries now target spec_doc rows. The eval corpus becomes `{ spec_doc + continuity + archived_memory }` instead of just memory.

**Implementation change**: the ablation script accepts a `document_type` filter. Operators can run ablation on "fresh only" (exclude archived) or "full corpus" for baseline comparison during phase 019 transition.

**New metric**: `archived_hit_rate` — the percentage of ablation queries where the top result is an archived memory. This metric is the phase 020 permanence gate (if <0.5% for 180 days, move to Option F).

## Drift analysis (`memory_drift_why`)

**Current**: follows causal chains to explain why a memory was promoted/demoted/rejected.

**Target**: same chains, now spanning (spec_folder, doc, anchor) tuples via the causal graph retarget from iteration 10. The explanation output includes anchor references where relevant.

Example output:
```
{
  "memory_id": 12345,
  "source": "implementation-summary.md::decisions",
  "drift_reason": "superseded by adr-005",
  "chain": [
    { "node": "adr-005::decision", "relation": "supersedes", "strength": 1.5 }
  ]
}
```

## Constitutional memory retarget

**Current**: constitutional rows have `importance_tier = 'constitutional'`, which forces them to the top of search results regardless of score.

**Target**: same flag, different storage location.

**New storage**: `.opencode/constitutional/*.md` — dedicated top-level directory for repo-wide rules. Each file is a markdown doc with frontmatter, indexed as a spec_doc row with `importance_tier: constitutional`.

**Why a dedicated directory**: constitutional rules are cross-packet (repo-wide). They shouldn't live in a specific packet folder because they apply everywhere. The existing memory system stores them as memory rows, which works but is structurally awkward.

**Migration**: phase 018 runs a one-time script that:
1. Finds existing rows with `importance_tier = 'constitutional'`
2. Extracts their content into `.opencode/constitutional/*.md` files
3. Re-indexes them as spec_doc rows
4. Marks the original memory rows as archived

## Code changes

| File | Effort | Change |
|---|:---:|---|
| `lib/governance/scope-governance.ts` | XS | no change (scope is row-level) |
| `lib/collab/shared-spaces.ts` | XS | no change |
| `handlers/eval-reporting.ts` | S | accept document_type filter, add archived_hit_rate metric |
| `lib/search/causal-graph.ts` | XS | no change (uses iteration 10 retarget) |
| `.opencode/constitutional/` | **new** | new top-level directory |
| `scripts/migrate-constitutional-to-files.ts` | M | new one-time migration script |
| `handlers/memory-index.ts` | S | recognize constitutional files as spec_doc type with tier flag |

## Findings

- **F12.1**: Governance features retarget with **zero code change** — scope fields are row-level and content-agnostic.
- **F12.2**: Ablation gets a new `archived_hit_rate` metric that drives the phase 020 permanence decision. This is an enhancement, not a loss.
- **F12.3**: Constitutional memory moves from "memory row with special flag" to "dedicated file with special flag". This is structurally cleaner — cross-packet content lives outside packet folders.
- **F12.4**: The `_memory.provenance` sub-block from iteration 4 carries governance fields into spec doc frontmatter. Provenance is now visible to humans reading the doc, not hidden in a database row.

## Band B summary (iterations 6-12)

Band B retargeted all 13 advanced features:

| Feature | Iteration | Retarget class |
|---|:---:|---|
| 1. Trigger phrase fast matching | 6 | index filter update (S) |
| 2. Intent-aware retrieval | 7 | mapping table update (S) |
| 3. Session dedup | 8 | no code change |
| 4. Quality scoring | 9 | 1 new module + small edits |
| 5. Reconsolidation | 9 | unified with iteration 3 idempotency |
| 6. Causal graph (6 relations) | 10 | schema extension (2 columns) |
| 7. Memory tiers | 11 | optional anchor override |
| 8. FSRS cognitive decay | 11 | no formula change |
| 9. Shared memory governance | 12 | no code change |
| 10. Ablation / drift analysis | 12 | new metric |
| 11. Constitutional memory | 12 | moved to dedicated dir |
| 12. Embedding semantic search | 7 | no change |
| 13. 4-stage search pipeline | 7 | no change |

**All 13 features retarget without deletion.** The preserve-13-features constraint from the user is satisfied.

## What worked

- Grouping related features in single iterations (e.g., 2+12+13 in iter 7, 4+5 in iter 9, 9+10+11 in iter 12) kept the analysis compact without losing rigor.
- Recognizing that many features are already row-level and content-agnostic made the retarget effort estimates realistic.

## Next focus

Iteration 13 — begin Band C (UX). End-to-end resume user journey walkthrough.
