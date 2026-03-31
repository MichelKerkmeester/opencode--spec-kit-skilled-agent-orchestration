---
title: "Review Report: Hybrid Context Injection — Hook + Tool Architecture"
description: "Deep review report for spec 024-compact-code-graph. 30 iterations across 4 dimensions via Codex CLI + Copilot CLI. Verdict: CONDITIONAL."
---

# Review Report: Spec 024 — Compact Code Graph

## 1. EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|
| **Spec** | 02--system-spec-kit/024-compact-code-graph |
| **Title** | Hybrid Context Injection — Hook + Tool Architecture |
| **Review Date** | 2026-03-31 |
| **Total Iterations** | 30 (10 via Codex CLI + 20 via Copilot CLI) |
| **Verdict** | **CONDITIONAL** |
| **P0 (Blocker)** | 0 |
| **P1 (Required)** | 16 |
| **P2 (Suggestion)** | 16 |
| **Phase 1 Reviewer** | GPT-5.4 high via Codex CLI (iterations 1-10) |
| **Phase 2 Reviewer** | GPT-5.4 high via Copilot CLI (iterations 11-30) |

**Verdict rationale:** No confirmed P0 blockers, but 16 active P1 findings across all 4 dimensions prevent a clean PASS. Phase 2 (iterations 11-30) re-verified all Phase 1 findings and confirmed them accurate against current code, while uncovering 8 additional P1s and 7 additional P2s in previously unexamined areas.

---

## 2. DIMENSION VERDICTS

| Dimension | Verdict | Primary Iterations | P1 Count | P2 Count |
|-----------|---------|-------------------|----------|----------|
| D1 Correctness | CONDITIONAL | 1,2,6,7,9,11,12,15,16,19,21,23,27 | 9 | 6 |
| D2 Security | CONDITIONAL | 3,7,13,20,24,28 | 4 | 2 |
| D3 Traceability | CONDITIONAL | 4,8,14,18,22,26,29 | 2 | 5 |
| D4 Maintainability | PASS (advisories) | 5,9,10,17,25,30 | 1 | 3 |

---

## 3. FINDING REGISTRY

### P1 Findings (16 active — block clean PASS)

| ID | Dim | File | Summary | Verified |
|----|-----|------|---------|----------|
| F001 | D1 | session-prime.ts | Clears `pendingCompactPrime` before stdout completes; output failure drops recovery payload | iter 11 |
| F002 | D1 | hook-state.ts / compact-inject.ts | Swallows save failures; logs success unconditionally | iter 11 |
| F003 | D1 | session-prime.ts | No `cachedAt` staleness check; stale payloads injectable indefinitely | iter 11 |
| F009 | D2 | session-prime.ts | Replays transcript text as trusted `Recovered Context` without injection fencing | iter 13 |
| F010 | D2 | code-graph-tools.ts | Schema validators exist but live dispatch still bypasses them | iter 13 |
| F011 | D1 | budget-allocator.ts | Hard-coded 4000-token ceiling; larger budgets silently ignored | iter 15 |
| F012 | D1 | compact-merger.ts | Truncation marker outside budget; zero-budget sections rendered | iter 15 |
| F020 | D1 | compact-merger.ts | `sessionState` bypasses allocation entirely; brief can exceed caller budget | iter 15 |
| F021 | D1 | code-graph-db.ts / scan.ts | `code_graph_scan` throws on fresh runtime — DB never initialized on live path | iter 16 |
| F022 | D1 | compact-inject.ts / session-prime.ts | Claude hook path bypasses `memory-surface.ts`; constitutional/triggered payloads lost at compaction | iter 19 |
| F023 | D1 | code-graph-db.ts | `initDb()` has no schema migration guard; poisoned singleton on setup failure | iter 21 |
| F024 | D1 | code-graph-db.ts | `replaceNodes/Edges` deletes outside transaction; constraint error wipes file's graph | iter 21 |
| F026 | D1 | query handler | Transitive `code_graph_query` leaks nodes beyond `maxDepth`; duplicates converging paths | iter 23 |
| F027 | D2 | hook-state.ts | Lossy session_id filename sanitization aliases distinct sessions onto one state file | iter 20 |
| F028 | D2 | hook-state.ts | Temp JSON persists assistant summaries without restrictive permissions (0700/0600) | iter 20 |
| F033 | D1 | code_graph_context | `includeTrace` advertised in schema + Phase 010 but handler never emits trace payload | iter 27 |

### P2 Findings (16 active — PASS with advisories)

| ID | Dim | File | Summary | Verified |
|----|-----|------|---------|----------|
| F004 | D1 | session-prime.ts | Dead `workingSet` branch; field never persisted | iter 11 |
| F005 | D1 | structural-indexer.ts | One-line symbol ranges break multi-line CALLS | iter 16 |
| F006 | D1 | context handler | Erases provider-typed seed identity | iter 16 |
| F007 | D1 | code-graph-db.ts | Stale edges after symbol churn; orphan cleanup never runs | iter 16 |
| F008 | D1 | structural-indexer.ts | Never emits JS/TS method nodes | iter 16 |
| F013 | D1 | working-set-tracker.ts | Exceeds maxFiles until 2x capacity | iter 15 |
| F014 | D4 | seed-resolver.ts | DB failures silently become placeholder anchors | iter 17 |
| F015 | D4 | structural-indexer.ts | Dead per-file TESTED_BY branch | iter 17 |
| F016 | D4 | structural-indexer.ts | `excludeGlobs` exposed but never consulted | iter 17 |
| F017 | D4 | indexer-types.ts | `.zsh` mapped but default globs never discover `.zsh` files | iter 17 |
| F018 | D4 | CLAUDE.md / .claude/CLAUDE.md | Overlapping recovery authority between root and Claude docs | iter 17 |
| F019 | D4 | response-hints.ts / envelope.ts | Duplicated token-count sync logic | iter 17 |
| F025 | D3 | decision-record.md | DR-004 stale: 4-phase plan never superseded after 12-phase expansion | iter 22 |
| F029 | D4 | tests/ | Only 4/6 hook scripts and 6/10 code-graph libs have direct test coverage | iter 25 |
| F030 | D3 | spec.md / settings.local.json | Spec describes source-scoped SessionStart matchers; settings registers single unscoped entry | iter 26 |
| F031 | D2 | ccc_feedback handler | Caller-controlled `comment`/`resultFile` bypass schema length bounds before disk write | iter 28 |
| F032 | D4 | session-prime.ts | Drifted private pressure-budget helper duplicates shared tested helper | iter 30 |

### Traceability: Phase Completion Status

| Phase | Claimed | Actual | Iterations |
|-------|---------|--------|------------|
| 001-precompact-hook | Complete | **Partial** — F001-F003 correctness defects | 1, 11 |
| 002-session-start-hook | Complete | **Partial** — F001, F003, F022 | 1, 11, 19 |
| 003-stop-hook-tracking | Complete | **Partial** — Stop hook skips normal events | 2, 12 |
| 004-cross-runtime-fallback | Complete | **Verified** | 14, 18 |
| 005-command-agent-alignment | Complete | **Partial** — commands not truth-synced | 14, 18 |
| 006-documentation-alignment | Complete | **Partial** — docs overstate hook behavior | 14, 18 |
| 007-testing-validation | Complete | **Verified** | 14, 18 |
| 008-structural-indexer | Complete | **Partial** — regex parser, not tree-sitter as spec claims | 14 |
| 009-code-graph-storage-query | Complete | **Partial** — F021, F023, F024 DB defects | 16, 21 |
| 010-cocoindex-bridge-context | Complete | **Partial** — F033 trace metadata missing | 27 |
| 011-compaction-working-set | Complete | **Partial** — working-set unwired to compaction | 14, 18 |
| 012-cocoindex-ux-utilization | Complete | **Partial** — wrappers only, not full automation | 14, 18 |

### Parent Checklist Audit (iteration 29)

Sampled 18 of 30 checked items:
- **12 VERIFIED** — implementation matches claim
- **5 PARTIAL** — implementation exists but doesn't fully satisfy
- **1 UNVERIFIED** — Claude session_id → Spec Kit bridge claimed but not implemented

---

## 4. RE-VERIFICATION RESULTS (Phase 2, iterations 11-18)

All 19 original findings (F001-F019) from Phase 1 were re-verified against current code:

| Finding | Status | Notes |
|---------|--------|-------|
| F001-F004 | **CONFIRMED** (iter 11) | No code changes; all 4 hook cache defects active |
| F005-F008 | **CONFIRMED** (iter 16) | No code changes; indexer/graph defects active |
| F009 | **CONFIRMED** (iter 13) | Transcript replay still unfenced |
| F010 | **CHANGED but still active** (iter 13) | Schema declarations now exist but dispatch still bypasses them |
| F011-F013 | **CONFIRMED** (iter 15) | Budget/merger/tracker defects active |
| F014-F017 | **CONFIRMED** (iter 17) | All maintainability items active |
| F018 | **NARROWED** (iter 17) | From "divergent docs" to "overlapping authority" |
| F019 | **CONFIRMED** (iter 17) | Token-count duplication active |

---

## 5. REMEDIATION PRIORITIES

### Tier 1: Correctness blockers (9 P1)

1. **F001-F003:** Fix hook cache lifecycle — move clear after stdout, propagate save errors, add staleness TTL
2. **F011, F012, F020:** Fix budget math — remove 4000 ceiling, respect grants, budget sessionState
3. **F021, F023, F024:** Fix code-graph DB — init guard, migration safety, atomic replace operations
4. **F022:** Wire Claude hooks to `memory-surface.ts` so constitutional/triggered payloads survive compaction
5. **F026:** Fix transitive query traversal — respect maxDepth, deduplicate converging paths
6. **F033:** Either implement `includeTrace` or remove it from schema + Phase 010

### Tier 2: Security fixes (4 P1)

7. **F009:** Fence recovered context with provenance markers
8. **F010:** Route code-graph tool inputs through `validateToolArgs()` before dispatch
9. **F027:** Use collision-resistant session_id hashing or exact-match verification on state load
10. **F028:** Set explicit 0700/0600 permissions on hook-state temp directory and files

### Tier 3: Truth-sync specs (D3)

11. **Phases 005/006/011/012:** Downgrade checklist claims to match shipped behavior
12. **Phase 008:** Update spec to describe regex parser, not tree-sitter
13. **DR-004:** Add superseding DR for 12-phase expansion
14. **Parent checklist:** Fix 5 PARTIAL + 1 UNVERIFIED items

### Tier 4: Maintainability cleanup (P2)

15. Remove dead branches (F004 workingSet, F015 TESTED_BY)
16. Consolidate duplicated helpers (F019, F032)
17. Wire or remove dead options (F016 excludeGlobs, F017 .zsh)
18. Improve test coverage (F029)

---

## 6. ITERATION LOG

| Iter | CLI | Dimension | Focus | New P1 | New P2 |
|------|-----|-----------|-------|--------|--------|
| 1 | Codex | D1 | Hook scripts | 2 | 2 |
| 2 | Codex | D1 | Stop/transcript | 2 | 2 |
| 3 | Codex | D2 | Hook state security | 1 | 1 |
| 4 | Codex | D3 | Spec alignment | 3 | 1 |
| 5 | Codex | D4 | Code graph tools | 2 | 4 |
| 6 | Codex | D1 | Stop deep-dive (confirm) | 0 | 0 |
| 7 | Codex | D1 | Budget/merger | 2 | 2 |
| 8 | Codex | D3 | Phase verification | 7 | 1 |
| 9 | Codex | D1 | Adversarial F001-F004 | 0 | 0 |
| 10 | Codex | D4 | Hook registration/docs | 0 | 2 |
| 11 | Copilot | D1 | **Re-verify** F001-F004 | 0 | 0 |
| 12 | Copilot | D1 | **Re-verify** Stop/transcript | 0 | 0 |
| 13 | Copilot | D2 | **Re-verify** F009-F010 | 0 | 0 |
| 14 | Copilot | D3 | **Re-verify** spec/phase drift | 0 | 1 |
| 15 | Copilot | D1 | **Re-verify** F011-F013 | 1 | 0 |
| 16 | Copilot | D1 | **Re-verify** F005-F008 | 1 | 0 |
| 17 | Copilot | D4 | **Re-verify** F014-F019 | 0 | 0 |
| 18 | Copilot | D3 | **Re-verify** phases 005/006/011/012 | 0 | 0 |
| 19 | Copilot | D1 | Fresh: memory-surface integration | 1 | 0 |
| 20 | Copilot | D2 | Fresh: temp file security | 2 | 0 |
| 21 | Copilot | D1 | Fresh: code-graph-db | 2 | 0 |
| 22 | Copilot | D3 | Fresh: decision records | 0 | 1 |
| 23 | Copilot | D1 | Fresh: handler correctness | 1 | 0 |
| 24 | Copilot | D2 | Fresh: memory-context security | 0 | 0 |
| 25 | Copilot | D4 | Fresh: test coverage | 0 | 1 |
| 26 | Copilot | D3 | Fresh: hook registration | 0 | 1 |
| 27 | Copilot | D1 | Convergence: remaining files | 1 | 0 |
| 28 | Copilot | D2 | Convergence: handler sweep | 0 | 1 |
| 29 | Copilot | D3 | Convergence: checklist audit | 0 | 0 |
| 30 | Copilot | D4 | Convergence: patterns/exports | 0 | 1 |

---

## 7. CONVERGENCE NOTES

- Phase 1 (1-10): 8 P1, 9 P2. All findings confirmed by Phase 2.
- Phase 2 re-verification (11-18): All 19 original findings confirmed active. Added F020, F021.
- Phase 2 fresh dives (19-25): Found 8 new issues (F022-F029) in previously unexamined code.
- Phase 2 convergence (26-30): Found 4 more issues (F030-F033). Low new-findings ratio indicates approaching saturation.
- Iterations 6, 9, 11, 12, 13, 17, 18, 24, 29 produced 0 new findings (confirmation/convergence passes).

---

## 8. SYNTHESIS EVENT

```json
{
  "type": "event",
  "event": "synthesis_complete",
  "mode": "review",
  "totalIterations": 30,
  "verdict": "CONDITIONAL",
  "activeP0": 0,
  "activeP1": 16,
  "activeP2": 16,
  "hasAdvisories": true,
  "dimensionCoverage": 1.0,
  "reVerificationPass": true,
  "allPhase1FindingsConfirmed": true,
  "stopReason": "planned_iteration_cap",
  "nextAction": "/spec_kit:plan — remediate 16 P1 findings",
  "timestamp": "2026-03-31T16:30:00Z"
}
```

---

## 9. METHODOLOGY

- **Phase 1 (iters 1-10):** `codex exec -p deep-review --model gpt-5.4 -c model_reasoning_effort="high"` — 2 batches of 5 parallel terminals
- **Phase 2 (iters 11-30):** `copilot -p "..." --model gpt-5.4 --allow-all-tools` — 5 waves of 4 parallel terminals (effortLevel: high via config)
- **State:** Externalized via JSONL (41 records) + strategy.md + 30 iteration markdown files
- **Coverage:** All 4 dimensions covered 7+ times each across 30+ implementation files, 12 phase specs, and supporting documentation
- **Cross-validation:** Phase 2 independently re-verified all Phase 1 findings against current code before exploring new territory
