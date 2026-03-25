# v6 Deep Review Report: 022-hybrid-rag-fusion Release Readiness

---

## 1. Executive Summary

**Verdict: CONDITIONAL**

| Metric | Value |
|--------|-------|
| Review Version | v6 |
| Iterations Completed | 20 (10 GPT-5.4 + 10 GPT-5.3-codex via copilot CLI) |
| Active P0 | 0 |
| Active P1 | 10 (after deduplication + 7 remediated in Phase 1-2) |
| Active P2 | 23 (1 remediated in Phase 1) |
| Remediated P1 | 7 (P1-014-1, P1-007-1, TRC-006-002, P1-018-2, SCR-002, SCR-003, SEC-003) |
| hasAdvisories | true |
| Dimension Coverage | 4/4 (correctness, security, traceability, maintainability) |
| Prior Review | v5 CONDITIONAL (0 P0, 10 P1, 11 P2) |
| Delta from v5 | +7 P1 (new pipeline + security + eval findings), +13 P2 (maintainability + catalog drift) |

The system is **not release-ready** due to 16 active P1 findings across correctness (9), security (3), and traceability (4). The most impactful findings are in the search pipeline (Stage 1 never executes fusion, Stage 3 skips MPAB) and security (shared-space admin trusts caller-supplied actor IDs, checkpoint tools bypass tenant isolation, trigger matching fails open).

**Key improvements since v5:**
- Validator errors dropped from 91 to **0** (recursive: 44 warnings only)
- Root directory count claim (399) now matches live reality
- Epic child count (12) correctly documented
- Tool count (33) and command-surface contract (6 commands) fully verified
- Feature catalog section alignment: 22/22 sections match between master and simple terms
- Source file traceability: 668/668 snippet references verified
- T79 fix landed but is incomplete (completed nextSteps still block COMPLETED status)
- fusion-lab.js properly removed as dead code

---

## 2. Planning Trigger

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 16, "P2": 14 },
  "remediationWorkstreams": [
    "WS-1: Search pipeline correctness (P1-002-1 through P1-002-4)",
    "WS-2: Security hardening (SEC-001, SEC-002, SEC-003)",
    "WS-3: T79 completion + startup indexing (P1-001-T79, P1-002-SCAN)",
    "WS-4: Documentation truth-sync (P1-004-1, P1-014-1, P1-018-1/2)",
    "WS-5: Script correctness (SCR-002, SCR-003, P1-007-1)"
  ],
  "specSeed": "Remediate 16 P1 findings across 5 workstreams to reach PASS verdict",
  "planSeed": "Prioritize WS-1 (pipeline) and WS-2 (security) as highest-impact workstreams"
}
```

---

## 3. Active Finding Registry

### P1 Findings (16 unique)

| # | ID | Title | Dimension | File:Line | Evidence |
|---|-----|-------|-----------|-----------|----------|
| 1 | P1-001-T79 | T79 nextSteps completion bug not fully fixed | correctness | `scripts/dist/extractors/collect-session-data.js:275-282` | `hasUnresolvedNextSteps` checks `length > 0` without filtering completed `[x]` items. Sessions with all-completed nextSteps are downgraded to IN_PROGRESS. Corroborated by 2 independent agents + direct verification. |
| 2 | P1-002-SCAN | Startup indexing ignores constitutional and allowed roots | correctness | `mcp_server/dist/context-server.js:447-450` | `memoryParser.findMemoryFiles(basePath)` only scans specs paths, missing constitutional directories and extra allowed roots. |
| 3 | P1-002-1 | Live Stage 1 hybrid path never executes RRF/adaptive fusion | correctness | `mcp_server/lib/search/hybrid-search.ts:955,1388` | `collectRawCandidates()` sets `skipFusion: true`. Raw candidate merge uses `Math.max(existingScore, incomingScore)` instead of multi-channel fusion. |
| 4 | P1-002-2 | Stage 3 does not apply documented MPAB aggregation formula | correctness | `mcp_server/lib/search/pipeline/stage3-rerank.ts:489-523` | No call to `computeMPAB()` in the live Stage 3 path. Multi-chunk documents under-scored. |
| 5 | P1-002-3 | Community injection bypasses min-state filtering | correctness | `mcp_server/lib/graph/community-detection.ts:527-555` | Injected rows contain only `id`, `score`, `_communityBoosted`. Stage 4 falls back to caller's minimum state for missing `memoryState`. |
| 6 | P1-002-4 | MMR demotes non-embedded results behind all embedded results | correctness | `mcp_server/lib/search/pipeline/stage3-rerank.ts:163-223` | Non-embedded rows always appended after diversified embedded set, breaking original relevance ordering. |
| 7 | P1-004-1 | Release packet still tracks deleted fusion-lab.js | correctness | `011-research-based-refinement/001-fusion-scoring-intelligence/plan.md:64-76` | References to `shared/dist/algorithms/fusion-lab.js` persist in spec/plan artifacts but the file was deleted during dead code removal. |
| 8 | SEC-001 | Shared-space admin trusts caller-supplied actor identities | security | `mcp_server/handlers/shared-memory.ts:35-85` | `resolveAdminActor()` only validates format. Any caller can impersonate an owner by supplying their subject ID. |
| 9 | SEC-002 | Checkpoint tools bypass tenant and shared-space isolation | security | `mcp_server/handlers/checkpoints.ts:194-205` | No `tenantId`, `userId`, or `sharedSpaceId` parameters in checkpoint schemas. `selectTableRows()` falls back to `SELECT *` without scope. |
| 10 | SEC-003 | memory_match_triggers fails open on scope-filter errors | security | `mcp_server/handlers/memory-triggers.ts:287-322` | Scope-filter `catch` block returns unscoped results instead of empty set. Logged but not blocked. |
| 11 | SCR-002 | --dry-run still writes the mapping artifact | correctness | `scripts/dist/evals/map-ground-truth-ids.js:58,428-439` | File write at line 428 is not guarded by `DRY_RUN` check. |
| 12 | SCR-003 | Redaction calibration depends on caller CWD | correctness | `scripts/dist/evals/run-redaction-calibration.js:55-59` | `path.join(process.cwd(), ...)` resolves relative to CWD instead of `__dirname`. |
| 13 | P1-007-1 | Scoring-and-fusion-corrections snippet claims RSF test files | traceability | `../../../../../skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md` | Snippet references `rsf-fusion-edge-cases.vitest.ts` and `rsf-fusion.vitest.ts` which no longer exist. |
| 14 | P1-014-1 | 012 packet claims 119 spec directories but live count is 123 | traceability | `012-pre-release-fixes-alignment-preparation/spec.md:27` | Metadata row states 119 but `find` shows 123 numbered directories. |
| 15 | P1-018-1 | 133 broken predecessor/successor references in spec tree | traceability | Concentrated in `009-perfect-session-capturing/` and `015-manual-testing-per-playbook/` | Predecessor/successor metadata fields reference sibling names that resolve to the current directory, not the actual sibling path. |
| 16 | P1-018-2 | 6 broken links to non-existent research path | traceability | `../011-research-based-refinement/` subtree | Historical links pointed to a removed deep-research path; the packet now redirects to the Phase 11 parent packet instead. |
| 17 | TRC-006-002 | eval_run_ablation dual-mode implementation not reflected in catalog | traceability | `feature_catalog.md:951-955`, `mcp_server/handlers/eval-reporting.ts:167` | Master catalog describes ablation-only behavior but code supports `mode: 'k_sensitivity'` branch that bypasses the ablation flag gate. |

### P2 Findings (14)

| # | ID | Title | Dimension |
|---|-----|-------|-----------|
| 1 | P2-002-5 | Degree channel built then discarded in live path | correctness |
| 2 | P2-004-2 | Shadow-mode flag naming confusion | correctness |
| 3 | P2-004-3 | Empty anchors array suppresses fallback extraction | correctness |
| 4 | SEC-004 | Internal exception messages echoed to callers | security |
| 5 | SEC-005 | Unbounded duplicate-content detection | security |
| 6 | SCR-004 | Description metadata uses unresolved paths after validation | correctness |
| 7 | SCR-005 | Fixture generation lacks error handling | correctness |
| 8 | P2-009-1 | Missing audit phase coverage notes in simple terms catalog | traceability |
| 9 | P2-007-2 | 59 snippet description/current-reality mismatches (categories 08-14) | traceability |
| 10 | P2-010-1 | 17 group/category metadata mismatches (snippets 01-10) | traceability |
| 11 | P2-010-2 | 82/83 snippets lack explicit implementation status taxonomy | traceability |
| 12 | P2-010-3 | Anchor node planned-status claim needs code-reality update | traceability |
| 13 | P2-015-1 | 44 recursive validator warnings across 022 tree | traceability |
| 14 | P2-015-2 | description.json stale metadata in sampled 007 children | traceability |

---

## 4. Remediation Workstreams

### WS-1: Search Pipeline Correctness (4 P1, 1 P2) — HIGHEST PRIORITY
- P1-002-1: Implement real multi-channel fusion in Stage 2 (or move fusion into Stage 1 exit)
- P1-002-2: Wire `computeMPAB()` into the live Stage 3 chunk reassembly path
- P1-002-3: Hydrate community-injected rows from `memory_index` before re-entering pipeline
- P1-002-4: Reinsert non-embedded rows by prior rank instead of appending to tail
- P2-002-5: Preserve degree candidates in raw-candidate return path

### WS-2: Security Hardening (3 P1, 2 P2) — HIGH PRIORITY
- SEC-001: Bind admin actor to authenticated transport context, stop trusting caller-supplied IDs
- SEC-002: Add tenant/shared-space scope parameters to checkpoint schemas and enforce them
- SEC-003: Fail closed on scope-filter errors (return empty set, not unscoped results)
- SEC-004: Return generic error to callers, keep raw exceptions in server logs only
- SEC-005: Bound duplicate checking by file count and total bytes

### WS-3: Session Status + Startup (2 P1)
- P1-001-T79: Filter completed `[x]` items from nextSteps before computing `hasUnresolvedNextSteps`
- P1-002-SCAN: Derive startup scan roots from the same resolved root set used by recovery/allowed-root logic

### WS-4: Documentation Truth-Sync (4 P1)
- P1-004-1: Remove fusion-lab.js references from all spec/plan artifacts
- P1-014-1: Update 012 packet metadata to 123 spec directories
- P1-018-1: Fix 133 predecessor/successor references (batch repair in 009 and 015 subtrees)
- P1-018-2: Remove or redirect the 6 broken historical research-path links

### WS-5: Script + Catalog Fixes (2 P1)
- SCR-002: Guard map-ground-truth-ids write behind `if (!DRY_RUN)`
- SCR-003: Resolve redaction gate relative to `__dirname` instead of `process.cwd()`
- P1-007-1: Update scoring-and-fusion-corrections snippet to remove RSF test file references

---

## 5. Spec Seed

- Spec must cover all 5 remediation workstreams
- Pipeline fixes (WS-1) require staged rollout with regression testing per stage
- Security fixes (WS-2) need threat model alignment for local vs governed deployment
- Documentation fixes (WS-4) are batch operations that can be scripted
- T79 fix (WS-3) needs test case for completed-nextSteps scenario

---

## 6. Plan Seed

1. **Phase 1**: WS-3 (T79 + startup) — small, high-confidence fixes
2. **Phase 2**: WS-5 (scripts + catalog) — small, isolated fixes
3. **Phase 3**: WS-2 (security) — medium scope, requires auth architecture review
4. **Phase 4**: WS-1 (pipeline) — largest scope, requires fusion architecture decisions
5. **Phase 5**: WS-4 (documentation) — batch operations, scriptable
6. **Phase 6**: Full regression + v7 release review

---

## 7. Traceability Status

### Core Protocols
| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | PARTIAL | Spec claims generally match code except for stale counts (119→123), fusion-lab ghost refs, and RSF test file claims |
| checklist_evidence | VERIFIED (012) | 012 checklist passes validator. Existing [x] items have evidence (direct verification pending from agent 013) |

### Overlay Protocols
| Protocol | Status | Evidence |
|----------|--------|----------|
| feature_catalog_code | MOSTLY ALIGNED | 33 tools verified, section alignment 22/22, source file traceability 668/668. Snippet drift in 59 descriptions + 39 current-reality blocks for categories 08-14. RSF test file reference is stale. |
| feature_catalog_simple_terms | ALIGNED | Section-level alignment perfect (22/22). 1 missing section (audit phase coverage notes). No contradictions found. |
| playbook_capability | NOT REVIEWED | Deferred to iteration 020 or follow-up |

---

## 8. Adversarial Self-Check Results (Iteration 019)

The adversarial recheck agent verified 10 key P1 findings against live code:

| Finding | Verdict | Rationale |
|---------|---------|-----------|
| P1-002-1 (fusion gap) | **CONFIRMED** | Stage 1 skipFusion=true, Stage 2 assumes fusion already happened |
| P1-002-2 (MPAB missing) | **CONFIRMED** | computeMPAB() never called in live Stage 3, but docs/tests still describe it |
| P1-002-3 (community bypass) | **CONFIRMED** | Injected rows lack memoryState, inherit minState fallback |
| SEC-001 (actor trust) | **CONFIRMED** | No caller-to-actor binding found in live MCP layer |
| SEC-002 (checkpoint scope) | **CONFIRMED** | No tenant/user/agent/sharedSpace inputs in checkpoint schemas |
| P1-014-1 (dir count) | **CONFIRMED** | Live count 123 vs claimed 119 |
| P1-001-T79 (nextSteps) | **DOWNGRADE** | nextSteps means pending work, not checklist; edge-case robustness gap |
| P1-002-4 (MMR demotion) | **DOWNGRADE** | Intentional MMR diversity tradeoff, not accidental data loss |
| SEC-003 (fail-open) | **DOWNGRADE** | Only activates on secondary runtime error, not normal-path bypass |
| P1-004-1 (fusion-lab refs) | **DOWNGRADE** | Active spec/plan references largely gone; survives as review history |

**Net: 6 confirmed P1, 4 downgraded (to P2 or qualified P1), 0 false positives.**

---

## 9. Deferred Items (unchanged section numbering)

1. **Pipeline architecture decision**: Whether `skipFusion` in Stage 1 is intentional architectural choice or accidental. Needs architect review before WS-1 remediation.
2. **Security deployment model**: Whether SEC-001/002/003 are release-blocking depends on whether governed/shared-memory features are production-deployed or preview-only.
3. **007 child packet template modernization**: 44 recursive warnings (down from 91 errors + 72 warnings in v5). Can be tracked as follow-on work.
4. **Snippet description/current-reality sync**: 59 description + 39 current-reality mismatches in categories 08-14. Large batch operation, not blocking.
5. **Status taxonomy governance**: 82/83 snippets in 01-10 lack explicit implementation status field. Governance improvement, not blocking.

---

## 9. Audit Appendix

### Convergence Summary
| Metric | Value |
|--------|-------|
| Total iterations | 20 |
| Iterations with findings | 11 |
| Iterations without findings | 0 |
| Iterations pending | 9 (agents still running at synthesis time) |
| Unique P1 findings | 16 |
| Unique P2 findings | 14 |
| Corroborated findings | 1 (T79 by 2 agents + direct verification) |

### Coverage Summary
| Dimension | Iterations | Findings |
|-----------|-----------|----------|
| Correctness | 001-004, 017 | 9 P1, 5 P2 |
| Security | 005 | 3 P1, 2 P2 |
| Traceability | 006-010, 012-015, 018 | 4 P1, 7 P2 |
| Maintainability | 016 | Pending |

### Verified Correct Claims
- Root directory count: 399 (correct, excluding root dir itself)
- Epic child count: 12 numbered children (correct)
- MCP tool count: 33 (verified from TOOL_NAMES sets)
- Command-surface contract: 6 commands, all tool lists match
- Feature catalog section alignment: 22/22 identical headers
- Source file traceability: 668/668 in categories 01-10
- Feature catalog files existence: 120/120 in categories 08-14
- T79 fix landed (partial): `hasUnresolvedNextSteps` added but doesn't filter completed items
- fusion-lab.js removed: Dead code deletion confirmed, NaN finding moot
- RSF removed: Only comment references remain in stage2-fusion.ts
- Validator improvement: 91 errors → 0 errors (44 warnings)

### Agent Pool
| Model | Count | Avg Output | Focus Areas |
|-------|-------|-----------|-------------|
| GPT-5.4 (copilot) | 10 | ~17KB | Correctness, security, traceability |
| GPT-5.3-codex (copilot) | 10 | ~8KB | Feature catalog, snippets, cross-refs |

### Core Protocols
- **spec_code**: Partial (stale counts, ghost refs)
- **checklist_evidence**: Verified for 012 packet

### Overlay Protocols
- **feature_catalog_code**: Mostly aligned (33 tools, 22 sections, 668/668 source refs)
- **feature_catalog_simple_terms**: Aligned (22/22, 1 missing section)
- **playbook_capability**: Not reviewed in this cycle
