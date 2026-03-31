---
title: "Review Report: Hybrid Context Injection — Hook + Tool Architecture"
description: "Deep review report for spec 024-compact-code-graph. 10 iterations across 4 dimensions. Verdict: CONDITIONAL."
---

# Review Report: Spec 024 — Compact Code Graph

## 1. EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|
| **Spec** | 02--system-spec-kit/024-compact-code-graph |
| **Title** | Hybrid Context Injection — Hook + Tool Architecture |
| **Review Date** | 2026-03-31 |
| **Iterations** | 10 (hard cap reached) |
| **Verdict** | **CONDITIONAL** |
| **P0 (Blocker)** | 0 |
| **P1 (Required)** | 8 |
| **P2 (Suggestion)** | 9 |
| **Reviewer** | GPT-5.4 (high reasoning) via Codex CLI, 5-parallel batches |

**Verdict rationale:** No confirmed P0 blockers, but 8 active P1 findings across correctness (4), security (2), and traceability (2) prevent a clean PASS. Release readiness is conditional on remediating the P1 set and performing a verification rerun.

---

## 2. DIMENSION VERDICTS

| Dimension | Verdict | Iterations | Key Findings |
|-----------|---------|------------|--------------|
| D1 Correctness | CONDITIONAL | 1, 2, 6, 7, 9 | Hook cache lifecycle defects (F001-F004), budget allocator ceiling (F011), compact merger overflow (F012) |
| D2 Security | CONDITIONAL | 3, 7 | Transcript replay without injection fencing (F009), unvalidated code-graph scan scope (F010) |
| D3 Traceability | CONDITIONAL | 4, 8 | Spec/checklist claims overstate shipped behavior; phases 005/006/011/012 partially implemented but marked complete |
| D4 Maintainability | PASS (advisories) | 5, 9, 10 | Dead code branches, duplicated ownership, split recovery docs — all P2 |

---

## 3. FINDING REGISTRY

### P1 Findings (Required — block clean PASS)

| ID | Dimension | File | Summary |
|----|-----------|------|---------|
| F001 | D1 | session-prime.ts | Clears `pendingCompactPrime` before stdout injection completes; output failure drops the only compact-recovery payload |
| F002 | D1 | hook-state.ts / compact-inject.ts | Swallows save failures and logs cache success unconditionally, creating false-positive recovery state |
| F003 | D1 | session-prime.ts | Never validates `cachedAt`; stale compact payloads remain injectable indefinitely |
| F009 | D2 | session-prime.ts | Replays transcript-derived text as trusted `Recovered Context` without prompt-injection fencing or provenance separation |
| F010 | D2 | code-graph-tools.ts | `code_graph_*` and `ccc_*` tool calls bypass centralized argument validation; caller-controlled scan roots reach handlers directly |
| F011 | D1 | budget-allocator.ts | Hard-codes a 4000-token distribution ceiling; larger caller budgets silently ignored |
| F012 | D1 | compact-merger.ts | Appends truncation marker outside granted budget and still renders zero-budget sections |
| -- | D3 | spec.md / checklist.md | Phases 005, 006, 011, 012 checklists claim completion but implementation is partial |

### P2 Findings (Suggestions — PASS with advisories)

| ID | Dimension | File | Summary |
|----|-----------|------|---------|
| F004 | D1 | session-prime.ts / hook-state.ts | References `workingSet` but field is never defined or persisted (dead branch) |
| F005 | D1 | structural-indexer.ts | One-line symbol ranges break multi-line `CALLS` extraction |
| F006 | D1 | context handler | Erases provider-typed seed identity during normalization |
| F007 | D1 | code-graph-db.ts / scan.ts | Stale inbound edges left after symbol churn (orphan cleanup never runs on incremental path) |
| F008 | D1 | structural-indexer.ts | Never emits JS/TS `method` nodes; class containment incomplete |
| F013 | D1 | working-set-tracker.ts | Lets map exceed `maxFiles` until 2x capacity |
| F014 | D4 | seed-resolver.ts | Converts graph-DB failures into placeholder anchors silently |
| F015 | D4 | structural-indexer.ts | Dead per-file `TESTED_BY` branch superseded by `indexFiles()` |
| F016 | D4 | structural-indexer.ts | `excludeGlobs` exposed but never consulted by walker |
| F017 | D4 | indexer-types.ts | `.zsh` mapped to `bash` but default include globs never discover `.zsh` files |
| F018 | D4 | CLAUDE.md / .claude/CLAUDE.md | Split recovery guidance across two docs with divergent authority |
| F019 | D4 | response-hints.ts / envelope.ts | Duplicated token-count synchronization with two separate maintainers |

---

## 4. REMEDIATION PRIORITIES

### Tier 1: Fix before release (P1 correctness + security)

1. **F001 + F002:** Move `pendingCompactPrime` clear to AFTER successful stdout write; propagate save errors instead of swallowing
2. **F003:** Add `cachedAt` staleness check with configurable TTL (e.g., 30 minutes)
3. **F009:** Fence recovered context with provenance markers; separate model-authored vs transcript-derived content
4. **F010:** Route code-graph tool inputs through centralized schema validation before handler dispatch
5. **F011 + F012:** Remove hard-coded 4000 ceiling in allocator; fix merger to respect granted budgets and suppress zero-budget sections

### Tier 2: Truth-sync spec documentation (P1 traceability)

6. **Phase specs 005/006/011/012:** Either reopen and implement fully, or downgrade checklist claims to match shipped behavior
7. **Spec references:** Update file paths and module names to match current `mcp_server/` structure

### Tier 3: Maintainability cleanup (P2 advisories)

8. Remove dead `workingSet` branch in session-prime.ts
9. Consolidate recovery docs into single authoritative source
10. Collapse token-count ownership to one module

---

## 5. VERIFICATION PLAN

After remediation:

1. Run existing Vitest suite: `cd mcp_server && npx vitest run`
2. Add regression tests for:
   - Stdout write failure after cache clear (F001)
   - Save failure propagation (F002)
   - Stale `cachedAt` rejection (F003)
   - Budget allocation >4000 tokens (F011)
   - Zero-budget section suppression (F012)
3. Manual hook smoke test:
   - `printf '{}' | node dist/hooks/claude/compact-inject.js`
   - `printf '{}' | node dist/hooks/claude/session-prime.js`
   - `printf '{}' | node dist/hooks/claude/session-stop.js`
4. Re-run deep review (3-5 iterations) on remediated files to confirm convergence

---

## 6. ITERATION LOG

| Iter | Dimension | Focus | New P1 | New P2 | Key Finding |
|------|-----------|-------|--------|--------|-------------|
| 1 | D1 Correctness | Hook scripts (compact-inject, session-prime, hook-state) | 2 | 2 | F001-F004: cache lifecycle defects |
| 2 | D1 Correctness | Session-stop, transcript, shared | 2 | 2 | Stop hook skips normal events; transcript parsing gaps |
| 3 | D2 Security | Hook state management, temp files | 1 | 1 | Integrity boundary around temp-state reuse |
| 4 | D3 Traceability | Spec/code alignment, checklist | 3 | 1 | Spec claims overstate hook integration |
| 5 | D4 Maintainability | Code graph tools, architecture layer | 2 | 4 | Layer metadata drift, split budget ownership |
| 6 | D1 Correctness | Deep-dive session-stop control flow | 0 | 0 | Confirmed existing Stop-hook P1s (no new findings) |
| 7 | D1 Correctness | Budget allocator, compact merger, working-set | 2 | 2 | F011-F013: budget ceiling, merger overflow |
| 8 | D3 Traceability | Phase sub-folder verification (004-012) | 7 | 1 | Phases 005/006/011/012 overclaim completion |
| 9 | D1 Correctness | Adversarial re-read F001-F004 | 0 | 0 | All 4 findings confirmed (no false positives) |
| 10 | D4 Maintainability | Hook registration, CLAUDE.md, integration | 0 | 2 | F018-F019: split docs, duplicated token sync |

---

## 7. CONVERGENCE NOTES

- Iterations 6 and 9 produced `newFindingsRatio: 0.0` (confirmation-only passes)
- Iteration 7 broke convergence with 2 new P1s in previously unexamined budget/merger code
- Iteration 8 found 7 new P1s in phase traceability (broad surface)
- The 10-iteration hard cap was reached before natural convergence
- All 4 dimensions were covered at least twice

---

## 8. SYNTHESIS EVENT

```json
{
  "type": "event",
  "event": "synthesis_complete",
  "mode": "review",
  "totalIterations": 10,
  "verdict": "CONDITIONAL",
  "activeP0": 0,
  "activeP1": 8,
  "activeP2": 9,
  "hasAdvisories": true,
  "dimensionCoverage": 1.0,
  "stopReason": "max_iterations_reached",
  "nextAction": "/spec_kit:plan — remediate P1 findings",
  "timestamp": "2026-03-31T13:00:00Z"
}
```

---

## 9. METHODOLOGY

- **Tool:** 10 iterations of `@deep-review` LEAF agent dispatched via `codex exec -p deep-review --model gpt-5.4 -c model_reasoning_effort="high"`
- **Concurrency:** 2 batches of 5 parallel terminals (system memory constraint)
- **State:** Externalized via JSONL + strategy.md + per-iteration markdown files
- **Coverage:** All 4 review dimensions (correctness, security, traceability, maintainability) covered across 15 implementation files, 12 phase specs, and supporting documentation
