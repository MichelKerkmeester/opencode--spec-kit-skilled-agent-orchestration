# Review Report: 011-skill-advisor-graph

## 1. Executive Summary

20-iteration autonomous deep review of the `011-skill-advisor-graph` spec folder, covering the skill advisor graph metadata system (20 per-skill `graph-metadata.json` files, `skill_graph_compiler.py`, compiled `skill-graph.json`, and `skill_advisor.py` integration with graph-derived boosts).

**Verdict: FAIL** -- 4 active P0 findings block release readiness. All are traceability contradictions where spec documentation no longer matches the shipped implementation state.

| Metric | Value |
|--------|-------|
| Iterations completed | 20 |
| Dimensions covered | 4/4 (Correctness, Security, Traceability, Maintainability) |
| Active P0 | 4 |
| Active P1 | 17 |
| Active P2 | 2 |
| Verdict | **FAIL** |
| Release readiness | release-blocking |
| Stop reason | maxIterationsReached |
| Model | GPT 5.4 (high reasoning) via Copilot CLI |
| Session | rvw-011-2026-04-13T16-50-00Z |

---

## 2. Planning Trigger

The FAIL verdict triggers `/spec_kit:plan` for remediation. Four remediation workstreams are recommended.

---

## 3. Active Finding Registry

### P0 -- Blockers (4)

| ID | Dimension | Title | First Seen | Revalidated |
|----|-----------|-------|------------|-------------|
| **F020** | Traceability | Schema-version contract is false: spec says "always 1", compiler accepts v1+v2, live metadata uses v2 | Iter 003 | Iter 017 |
| **F021** | Traceability | Skill count contract is false: spec/checklist say 20, compiled graph has 21 (includes non-routable skill-advisor) | Iter 003 | Iter 017 |
| **F022** | Traceability | Size claim is false: spec/checklist say <2KB/1950 bytes, current artifact is 4667 bytes | Iter 003 | Iter 017 |
| **F060** | Traceability | Phase 005 path-migration closure is false: handover.md retains legacy non-scripts/ paths within the declared grep scope | Iter 007 | Iter 017 |

All P0s were adversarially rechecked in iteration 017 and confirmed genuine. None could be downgraded.

### P1 -- Required (17)

| ID | Dimension | Title | First Seen |
|----|-----------|-------|------------|
| **F001** | Correctness | `_apply_graph_conflict_penalty()` is a no-op: filters on `passes_threshold` before it is computed | Iter 001 |
| **F010** | Security | Derived metadata validation accepts path traversal outside intended roots | Iter 002 |
| **F023** | Traceability | Hub-skill evidence stale: docs say 2, runtime has 10 | Iter 003 |
| **F030** | Maintainability | Edge-type relation contract duplicated across 3 code paths | Iter 004 |
| **F040** | Correctness | Validator does not enforce spec-defined edge-type weight bands | Iter 005 |
| **F041** | Correctness | Symmetry validation ignores reciprocal weight parity | Iter 005 |
| **F050** | Traceability | Phase 001 spec overstates scope: claims "fix all 5 P1" but 3 remain deferred | Iter 006 |
| **F052** | Traceability | Phase 003 provenance anchored to stale pre-remediation review artifact | Iter 006 |
| **F061** | Traceability | Phase 004 CHK-014 cites evidence files not actually serialized in packet metadata | Iter 007 |
| **F080** | Security | Live skill-advisor metadata ships 20 `enhances` edges at 0.8 (spec says 0.3-0.7) | Iter 009 |
| **F081** | Security | skill-advisor/mcp-coco-index `depends_on` pair at 0.4 (spec says 0.7-1.0) | Iter 009 |
| **F090** | Traceability | "Fixed 3 wrong expectations" claim untraceable from repository evidence | Iter 010 |
| **F110** | Correctness | Health check reports "ok" when graph missing/corrupt; no distinction between failure modes | Iter 012 |
| **F130** | Traceability | CHK-031 freezes stale confidence score (0.92 vs actual 0.95) | Iter 014 |
| **F131** | Traceability | CHK-032 family-affinity example prompt no longer reproduces | Iter 014 |
| **F150** | Maintainability | Feature catalog schema reference still documents v1-only while compiler/corpus are v2 | Iter 016 |
| **F170** | Maintainability | Parent tasks.md shows "all complete" while child ledgers carry deferred items | Iter 018 |

### P2 -- Suggestions (2)

| ID | Dimension | Title | First Seen |
|----|-----------|-------|------------|
| **F011** | Security | Advisor trusts syntactically valid but structurally malformed graph payloads | Iter 002 |
| **F031** | Maintainability | Mixed path conventions in derived metadata (skill-relative vs repo-relative) | Iter 004 |

### Deduped / Merged

| ID | Disposition |
|----|-------------|
| F051 | Merged into F021 (same 20-vs-21 contradiction) |
| F160-F163 | Recheck aliases for F020/F021/F022/F060 (not standalone) |

---

## 4. Remediation Workstreams

### WS-1: Schema & Contract Repair (resolves F020, F021, F022, F023)

Update `spec.md`, `checklist.md`, and `implementation-summary.md` to reflect current reality:
- Schema version: document v1+v2 support, update CHK-006
- Skill count: document 21 (or exclude skill-advisor from compiled graph)
- Compiled size: update to current size or set new target
- Hub skills: update evidence to match current algorithm output

### WS-2: Phase 005 Handover Cleanup (resolves F060)

Fix legacy paths in `handover.md` to use `scripts/` layout, then re-verify REQ-004 grep.

### WS-3: Runtime & Validator Hardening (resolves F001, F010, F040, F041, F080, F081, F110)

- Reorder conflict penalty to run after threshold assignment (F001)
- Add path boundary checks to `validate_derived_metadata()` (F010)
- Enforce edge-type weight bands in compiler validation (F040)
- Add weight parity check to symmetry validation (F041)
- Fix off-band weights in skill-advisor and mcp-coco-index metadata (F080, F081)
- Add degraded status and failure-mode distinction to health check (F110)

### WS-4: Packet Evidence & Documentation Drift (resolves F050, F052, F061, F090, F130, F131, F150, F170)

- Update stale checklist evidence claims (F130, F131)
- Update feature catalog schema reference to v2 (F150)
- Fix parent tasks.md to reflect child deferred state (F170)
- Fix Phase 001 scope claim (F050)
- Fix Phase 003 provenance source (F052)
- Fix Phase 004 CHK-014 evidence (F061)
- Add provenance for "3 fixed expectations" or remove claim (F090)

---

## 5. Spec Seed

```yaml
title: "Remediation: 011-skill-advisor-graph Review Findings"
priority: P0
parent: 011-skill-advisor-graph
workstreams: 4
estimated_files: ~25
```

---

## 6. Plan Seed

1. WS-1 first (unblocks P0 verdict)
2. WS-2 second (simple handover fix)
3. WS-3 third (code changes with regression risk)
4. WS-4 fourth (documentation alignment)

---

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | **fail** | F020, F021, F022, F060 |
| `checklist_evidence` | core | **fail** | F023, F130, F131, F170 |
| `playbook_capability` | overlay | **pass** | Iter 011, 015 |
| `feature_catalog_code` | overlay | **fail** | F150 |

---

## 8. Deferred Items

- **CHK-033** (conflict penalty behavioral verification): Legitimately deferred -- no conflicts defined yet. Mechanism exists but cannot be tested without conflict data.
- **F011** (P2): Advisor graph trust model improvement -- low priority, defense-in-depth
- **F031** (P2): Path convention unification -- low priority, authoring convenience

---

## 9. Audit Appendix

### Iteration Coverage Map

| Iter | Dimension | Focus | New Findings |
|------|-----------|-------|-------------|
| 001 | D1 Correctness | Graph integration functions | F001 |
| 002 | D2 Security | Trust boundaries compiler/advisor | F010, F011 |
| 003 | D3 Traceability | Spec/code alignment | F020, F021, F022, F023 |
| 004 | D4 Maintainability | Code quality patterns | F030, F031 |
| 005 | D1 Correctness | Compiler deep pass | F040, F041 |
| 006 | D3 Traceability | Sub-phases 001/003 | F050, F052 |
| 007 | D3 Traceability | Sub-phases 004/005 | F060, F061 |
| 008 | D1 Correctness | 21-node routing impact | None (ruled out) |
| 009 | D2 Security | Metadata integrity (6+ files) | F080, F081 |
| 010 | D3 Traceability | Regression fixture accuracy | F090 |
| 011 | D4 Maintainability | Playbook executability | None (verified) |
| 012 | D1 Correctness | Health check extension | F110 |
| 013 | D2 Security | Metadata integrity (duplicate) | F080, F081 (confirmed) |
| 014 | D3 Traceability | Checklist evidence replay | F130, F131 |
| 015 | D2 Security | Confidence calibration | None (verified) |
| 016 | D4 Maintainability | Feature catalog accuracy | F150 |
| 017 | D1 Correctness | P0 adversarial recheck | F160-F163 (all confirmed) |
| 018 | D4 Maintainability | Tasks.md accuracy | F170 |
| 019 | D1 Correctness | Snapshot pattern verification | None (verified) |
| 020 | All | Final stabilization/synthesis | None (registry frozen) |

### Convergence

- All 4 dimensions covered with multiple passes each
- P0 findings adversarially rechecked and confirmed (iter 017)
- No new findings in iterations 15, 17, 19, 20 (convergence achieved)
- Final newFindingsRatio: 0.00 (last 4 iterations)

### Session Metadata

- Session ID: `rvw-011-2026-04-13T16-50-00Z`
- Generation: 1
- Lineage mode: new
- Max iterations: 20
- Model: GPT 5.4 (high reasoning effort) via GitHub Copilot CLI
- Orchestrator: Claude Opus 4.6
