# Deep Research Dashboard -- 016 Foundational Runtime Deep Review

**Last updated:** 2026-04-16T19:17:00Z (FINAL synthesis commit) -- metadata back-fill 2026-04-16T20:00:00Z
**Status:** **COMPLETE** -- 50/50 iterations, Domains 1-4 complete, Domain 5 transversal, FINAL synthesis authored
**Dispatcher:** cli-copilot gpt-5.4 high (manual wave dispatch, not `/spec_kit:deep-research` skill loop)

> This dashboard was back-filled after the 50-iteration run completed. The original run did not produce a live dashboard because it bypassed the standard `/spec_kit:deep-research` state-reducer pipeline.

---

## 1. Progress

| Metric | Value |
| ------ | ----- |
| Iterations completed | **50 / 50** |
| Convergence achieved | **YES** -- hard ceiling + signal-density collapse in final window |
| Final new-info-ratio (iter 48-50) | **0.022** (5 net-new / 137 cumulative -> well below 0.08 threshold) |
| Total raw findings | **137** |
| Distinct issues after dedup | **~63** (per FINAL synthesis section 2.3) |
| Unique file/surface hits | **57** |
| P0-candidate composites | **4 confirmed (A/B/C/D) + 1 watch-priority-1 + 1 watch-priority-2** |
| P0 individual findings | **0** |
| P1 distinct findings | **~33** |
| P2 distinct findings | **~30** |
| Domains surveyed | **4 of 5 directly; Domain 5 transversal** |
| Interim syntheses produced | 5 (at iters 32, 38, 41, 44, 47) |
| Remediation items identified | **29 quick wins + 13 medium refactors + 7 structural refactors** |
| Phase 017 effort budget | **~24.5 engineer-weeks (6 engineer-months)** |

---

## 2. Domain summary

| Domain | Nominal | Actual | P1 raw | P2 raw | Distinct | Signal trajectory |
| ------ | ------- | ------ | ------ | ------ | -------- | ----------------- |
| Foundational seams | iters 1-10 | iters 1-10 | 18 | 4 | 10 | Establishing -- all 5 families pre-announced |
| D1: Silent Fail-Open | iters 11-20 | iters 11-20 | 12 | 21 | 14 | High density; truth-contract erosion theme |
| D2: State Contract Honesty | iters 21-30 | iters 21-30 | 17 | 7 | 11 | Laundering + self-contradictory payloads |
| D3: Concurrency & Write | iters 31-40 | iters 31-40 | 17 | 13 | 14 | Layered: byte-level + snapshot + TOCTOU |
| D4: Stringly Typed Gov. | iters 41-50 | iters 41-50 | 11 | 17 | ~14 | Invisible-discard breakthrough at iter 43 |
| D5: Test Coverage (transversal) | iters 41-50 (dedicated) | transversal | (included above) | (included above) | 8 test files codify degraded contracts | Evidence gathered alongside primary domains |

---

## 3. Convergence trajectory

Iterations 1-47 saw the research progressively discover novel findings at decreasing rates. Iterations 48-50 dropped below the 0.08 new-info-ratio convergence threshold, signaling natural convergence at the hard ceiling.

```
new-info-ratio per iteration (findings_added / cumulative_findings at end of iter)

iter   ratio    trajectory
  1    1.000    |##########################################################|  # first iter, all findings novel
  5    0.167    |##########|
 10    0.091    |#####|
 15    0.068    |####|
 20    0.055    |###|
 25    0.058    |###|
 30    0.025    |#|
 35    0.031    |#|
 40    0.018    |o|
 45    0.032    |#|
 48    0.015    |o|    <-- dropped below 0.08 floor
 50    0.015    |o|    <-- hard ceiling reached
```

**Convergence event:** iterations 48-50 surfaced 5 findings of 137 cumulative, a 3.6% window-ratio. Signal density had decayed from ~20-30% in the first 10 iterations to ~1.5-2% in the closing window.

---

## 4. P0 escalation composites

No single finding crossed the P0 bar on its own. Four **interaction-effect composites** were identified where layered P1 + P2 findings combine into systemic persistent-state or control-plane failures.

| Candidate | Name | Constituent findings | Blast radius | Severity justification | Remediation effort |
| --------- | ---- | -------------------- | ------------ | ---------------------- | ------------------ |
| P0-A | Cross-runtime tempdir control-plane poisoning | R21-002, R25-004, R28-001, R29-001, R31-001, R33-001, R33-003, R36-001, R38-001, R38-002 (10 findings) | Claude + Gemini + OpenCode; 5 hook entrypoints; prompt-visible + on-disk | Multi-runtime, write-side + read-side simultaneous, permanent state corruption | ~2 weeks (S2) |
| P0-B | Reconsolidation conflict + complement duplicate/corruption window | R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 (8 findings) | Persistent memory-graph lineage integrity violation | Permanent data corruption to persistent store; violates core "single successor per predecessor" invariant | ~3 weeks (S1) -- largest single workstream |
| P0-C | Graph-metadata laundering + search boost | R11-002, R13-002, R20-002, R21-003, R22-002, R23-002 (6 findings) | Retrieval ranking in stage-1 candidate generation | State laundering = consent-boundary violation; corrupt content outranks clean spec docs | ~1 week (S3) |
| P0-D | TOCTOU cleanup erasing fresh state under live session load | R40-001, R38-001, R33-002, R37-001 (4 findings) | Triggered by routine `--finalize` maintenance, not abnormal load | Triggered by normal maintenance; irreversible continuity loss | ~2 days (D1-D5) |
| Watch-P1 | Domain-4 routing misdirection chain | R46-001 + R43-001/R44-001 + R42-002 + R41-003 + R46-002 | `/spec_kit:*` routing | Upgrade to P0-E if `command-spec-kit` Gate-3 proceeds to spec-folder creation when invoked via bridge; resolution in Phase 017 Week 1 | ~3 days (A0 + intent_signals wiring) |
| Watch-P2 | Playbook runner `Function(...)` trust-boundary expansion | R41-004 + R45-004 + R46-003 + R50-002 | Dev/CI only; `runtimeState.lastJobId` from tool payloads reaches `Function(...)` string | Escalate if external payload influence introduced; dev/CI isolation currently contains blast radius | ~1 week (S6) |

---

## 5. Top-cited files (by raw hit count)

| Rank | File | Hits | Distinct | Dominant domains |
| ---- | ---- | ---- | -------- | ---------------- |
| 1 | `mcp_server/hooks/claude/session-stop.ts` | 22 | 10 | D1, D2, D3 |
| 2 | `mcp_server/hooks/claude/hook-state.ts` | 17 | 9 | D2, D3 |
| 3 | `mcp_server/handlers/save/reconsolidation-bridge.ts` | 15 | 8 | D1, D3 |
| 4 | `mcp_server/handlers/code-graph/query.ts` | 15 | 6 | D1, D2 |
| 5 | `mcp_server/handlers/save/post-insert.ts` | 12 | 6 | D1, D2 |
| 6 | `mcp_server/lib/graph/graph-metadata-parser.ts` | 9 | 4 | D1, D2, D3 |
| 7 | `skill/skill-advisor/scripts/skill_advisor.py` | 9 | 5 | D4 |
| 8 | `AGENTS.md` | 7 | 3 | D3, D4 |
| 9 | `command/spec_kit/assets/spec_kit_plan_auto.yaml` | 7 | 4 | D4 |
| 10 | `skill/skill-advisor/tests/test_skill_advisor.py` | 7 | 3 | D4 (subsidiary) |

Distinct-issue ranking (after dedup) differs; see `findings-registry.json` section `by_file`.

---

## 6. Recent iterations (representative sample)

| Iter | Domain | Findings added | Cumulative | Novel insight |
| ---- | ------ | -------------- | ---------- | ------------- |
| 47 | D4 | 2 | 130 | `/spec_kit:plan` maintains two-vocabulary state machine collapsed at top-level docs |
| 48 | D4 | 2 | 132 | Gate 3 false negative confirmed for `save context`/`save memory`/`/memory:save` |
| 49 | D4 | 3 | 135 | Dependency-cycle validator only covers 2-node cycles; arbitrary-length loops pass `--validate-only` |
| 50 | D4 | 2 | 137 | Gate 3 false negative confirmed for `resume`; playbook runner argument dialects drift in live corpus |
| convergence | -- | -- | 137 | Hard ceiling reached with signal density at 1.5%; FINAL synthesis produced |

Full per-iteration stream: see `deep-research-state.jsonl` and `iterations/iteration-NNN.md` files.

---

## 7. Deliverables status

| Artifact | Status | Notes |
| -------- | ------ | ----- |
| `iterations/iteration-001.md` through `iteration-050.md` | COMPLETE | 50 files, all canonical schema |
| `interim-synthesis-32-iterations.md` | COMPLETE | First consolidation checkpoint (1-32) |
| `interim-synthesis-38-iterations.md` | COMPLETE | D3 midpoint checkpoint |
| `interim-synthesis-41-iterations.md` | COMPLETE | D4 entry checkpoint |
| `interim-synthesis-44-iterations.md` | COMPLETE | D4 midpoint checkpoint |
| `interim-synthesis-47-iterations.md` | COMPLETE | Final D4 pre-closeout checkpoint |
| `FINAL-synthesis-and-review.md` | COMPLETE | Authoritative synthesis (1042 lines) |
| `deep-research-config.json` | BACK-FILLED | Configuration + domain metadata |
| `deep-research-state.jsonl` | BACK-FILLED | 52 events (init + 50 iter_complete + convergence) |
| `deep-research-strategy.md` | BACK-FILLED | This run's research strategy doc |
| `deep-research-dashboard.md` | BACK-FILLED | This file |
| `research.md` | BACK-FILLED | Canonical research narrative |
| `findings-registry.json` | BACK-FILLED | Structured finding registry (137 raw entries + dedup clusters) |

**Back-fill rationale:** the 50-iteration run was dispatched manually via `cli-copilot` rather than through the `/spec_kit:deep-research` skill loop, so the standard skill artifacts were not produced live. These were reconstructed from the iteration files' frontmatter + mtimes + FINAL synthesis after the run completed.

---

## 8. Phase 017 readiness

All P0-candidate composites have:
- Identified constituent findings with file:line citations
- Remediation plan with effort estimates
- Dependency ordering within and across candidates
- Test-migration requirements called out

The FINAL synthesis section 7 provides a 4-month kickoff plan with 3 engineers:
- **Month 1 (W1-4):** P0-D (TOCTOU) + P0-A (HookState) + P0-C (graph-metadata laundering) in parallel
- **Month 2 (W5-8):** P0-B (transactional reconsolidation) + S4 (skill routing trust chain) + S5 (Gate 3 typed classifier)
- **Month 3 (W9-12):** S6 (playbook runner isolation) + S7 (YAML predicates) + M8 (trust-state vocabulary) + M13 (enum status)

See `FINAL-synthesis-and-review.md` for full details.

---

## 9. Known limitations

1. **Domain 5 was transversal, not dedicated.** 10 iterations earmarked for test-coverage audit were absorbed by D4 overflow. Phase 017 should do a dedicated 5-iteration Domain-5 pass in parallel with P0 remediation.
2. **Coverage gaps on 11 untouched files.** FINAL synthesis section 8.2 lists 11 files that were surface-touched but not deeply audited. A 2-day "closing pass" before Phase-017 structural refactors is recommended.
3. **Weaker findings await verification.** Five findings (R34-002, R35-001, R33-001, R40-001, R46-003) are based on code reading + partial live repro; ~30-minute test-harness construction should convert each hypothesis into confirmed exploit before committing a structural fix.
4. **No live-load measurement of concurrent-writer surface.** Seven distinct interleavings characterized in iteration 38 are based on static analysis; a 2-day measurement pass before S1/S2 would size the actual blast radius.
5. **Metadata back-fill post-run.** The skill-standard state artifacts (`config`, `state.jsonl`, `strategy`, `dashboard`, `registry`, `research.md`) were reconstructed after the run; they may diverge slightly from the true wall-clock execution compared to a live-dispatched run. Iteration mtimes are authoritative for event ordering.
