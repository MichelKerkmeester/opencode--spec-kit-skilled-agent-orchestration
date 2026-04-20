---
title: "Phase 027 — Plan"
description: "Research-first phase: r01 research converged, 7 implementation children scaffolded (000 validator prereq + 001-006) per research roadmap §9 + §13.6 delta."
importance_tier: "high"
contextType: "research"
---

# Plan: Phase 027

## Phase Sequence (overview)

```
Phase 027 parent
  |
  +-- r01 research (converged): 60 iters, 43 adopt_now / 3 prototype_later / 0 reject
  |     artifacts: ../research/027-skill-graph-daemon-and-advisor-unification-pt-01/
  |
  +-- 7 implementation children (scaffolded):
        000 (validator ESM prereq) → 001 → 002 → 003 → {004, 006} (parallel) → 005
```

## Research Phase (complete)

- Driver: `/tmp/run-deep-research-027.sh` (archived)
- Research artifacts: `../research/027-skill-graph-daemon-and-advisor-unification-pt-01/`
- Total: 40 r01 + 20 follow-up = 60 iterations + 2 synthesis passes
- Verdicts: 43 `adopt_now` / 3 `prototype_later` / 0 `reject`
- Final synthesis recommendation: dispatch 027/001 now; no pt-02 needed

## Implementation Chain (7 children)

```
   [000]  validator ESM migration (Node 25 compat)                  [PREREQ — unblocks post-phase validate.sh for 001-006]
     |
     v
   [001]  daemon + freshness + single-writer lease + benchmark gate (≤1% CPU / <20MB RSS)
     |
     v
   [002]  lifecycle + derived metadata + schema v2 + rollback
     |
     v
   [003]  native advisor core + 5-lane fusion + Py↔TS parity       [HARD GATE — consumes 002 lifecycle-normalized inputs per Y3]
     |
     +------+
     |      |
     v      v
   [004]  [006]   (MCP surface + promotion gates parallel after 003)
     |
     v
   [005]  compat + migration + bootstrap (finalizes after 006)
```

**Depends-on chain (per child `graph-metadata.json.manual.depends_on`):**
- 000: (none; infrastructure prereq for 001-006 post-phase verification)
- 001: (none inside 027; implicit soft-dep on 000 for validator tooling)
- 002: 001
- 003: 001, 002
- 004: 003
- 005: 004
- 006: 003, 004

**Effort estimate (research roadmap §9 + §13.6):** 27-40 engineering days total + ~0.5-1 day for 000 (ESM migration only).

## Deferred tracks (documented, not scaffolded)

Per `../research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md` §4:
- **Track H** (robustness + edge cases, 5 questions) — handled **inline during implementation**, NOT as a separate sub-packet. H1-H4 covered in 027/001 (reindex-storm back-pressure, malformed SKILL.md quarantine, partial-write resilience). H5 operator alerting playbook covered in 027/005.
- **Track I** (causal edge discovery, 4 questions) — **deferred to post-027**. 027/003 uses existing / hand-authored `skill_edges` for causal traversal. Automated edge discovery (SKILL.md cross-references, shared references, trigger co-occurrence, command-bridge log inference) is NOT in scope for Phase 027. Revisit in a future phase if implementation evidence makes it blocking.

## Architectural decisions captured in ADRs

See `decision-record.md` for ADR-001..ADR-006 covering:
- Chokidar + hash-aware SQLite indexer as daemon substrate
- Self-contained `mcp_server/skill-advisor/` package layout (NOT `lib/skill-advisor/`)
- 5-lane analytical fusion initial weights 0.45/0.30/0.15/0.10/0.00
- Workspace-scoped single-writer lease; one daemon writer per workspace
- Schema v1↔v2 additive migration + additive rollback
- Semantic live weight stays 0.00 through first promotion wave

## Per-child dispatch

Each child is a separate `/spec_kit:implement :auto` dispatch:
```
/spec_kit:implement :auto --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/001-daemon-freshness-foundation
```
(And similar for 002 through 006, in dependency order.)

## Verification (parent-level)

- All 7 children (000 + 001-006) have the required 7-file set
- Each child's `graph-metadata.json.parent_id` points at this parent
- Parent `spec.md` Child Layout lists all 7
- `decision-record.md` has ADR-001 through ADR-006 (+ ADR-007 for 000 if added)
- Children Convergence Log (this packet's `implementation-summary.md`) updated as each child lands
