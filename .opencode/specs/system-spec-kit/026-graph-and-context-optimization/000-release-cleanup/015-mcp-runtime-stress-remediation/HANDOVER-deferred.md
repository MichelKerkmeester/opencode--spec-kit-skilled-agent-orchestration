# HANDOVER — Deferred Items After Autonomous Run

> Residual work from the 2026-04-26 to 2026-04-27 autonomous run. Updated after item 2.1 was scaffolded into the new `010-stress-test-rerun-v1-0-2/` packet on 2026-04-27. Reorganization history (carve-out + renumber) lives in `./context-index.md`, not here.
>
> **Note**: this file was lost in commit `2e8b35dcc0` (the staged delete of the predecessor path dominated the rename) and recreated in this session with the §2.1 Scaffolded status reflecting the new `010-stress-test-rerun-v1-0-2/` packet. The fork-doc-tidy edits that landed earlier in the same session (§2.1 weak-quality probe sub-target, refusal-contract field references, etc.) are preserved below.

---

## 1. OVERVIEW

The autonomous run shipped 6 of 7 remediation packets (003, 005, 006, 007, 008, 009 in current numbering) plus rubric v1.0.1 plus the 10-iter deep research synthesis. Packet 004 (cocoindex-overfetch-dedup) was deferred pending a vendor-vs-fork decision and closed on 2026-04-27 by vendoring `cocoindex-code` into `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` as soft-fork `0.2.3+spec-kit-fork.0.2.0`. Item 2.1 (live MCP probes for packets 003/005/006/007/009) closed later on 2026-04-27 once a fresh Claude Code session restart picked up the rebuilt `dist/`.

After live probes closed, the remaining work was the close-the-loop measurement: re-run the 30-cell sweep against the post-fix dist and produce v1.0.2 findings with per-packet verdicts. That work is now scaffolded as the new `010-stress-test-rerun-v1-0-2/` sibling packet at this folder root; sweep execution is downstream of the scaffold.

The v1.0.2 sweep and the four post-stress follow-up proposals have now been split into owned child packets. Items still listed in this handover either point to the owning downstream packet or remain deferred with an explicit reason.

### Closed Since the Original Handover

| Item | Closure date | Closure evidence |
|------|--------------|------------------|
| Packet 004 (cocoindex-overfetch-dedup) vendor-vs-fork decision | 2026-04-27 | Commits `3711ad221`, `1b62e976d`, `b08dc8494`, `6e284285a`, `f60d97c79` on `main`. Live probes pass: `dedupedAliases` 29 and 30 across REQ-018 and REQ-019. |
| Live MCP probes for packets 003, 005, 006, 007 | 2026-04-27T10:12:36–10:12:38Z | Fresh Claude Code session post-2026-04-26 dist rebuild. Verbatim probe output now in each packet's verification row: 003 (`memory_context` token-budget fields populated, `preEnforcementTokens:7410`, `returnedTokens:1278`); 005 (`code_graph_query` fresh-graph branch, `freshnessAuthority:"live"`, no `fallbackDecision`); 006 (`memory_causal_stats`, all 6 by_relation keys, `health:"healthy"`, `meetsTarget:true`, idle-window `balanceStatus:"insufficient_data"`); 007 (`memory_context` intent telemetry, `taskIntent.intent:"understand"`, `paraphraseGroup:"search-semantic"`, `backendRouting.route:"semantic"`). All five packets re-validated PASS strict. |
| Live MCP probe for packet 009 (cite_results branch) | 2026-04-27T10:12:37Z | `memory_search` good-quality call returned `citationPolicy:"cite_results"`, `requestQuality.label:"good"`, `evidenceGapWarning` still surfaces (`Z=1.21`). Weak-quality branch (`do_not_cite_results`/`responsePolicy.noCanonicalPathClaims`/`safeResponse`/`ask_disambiguation`) NOT exercised on this probe — folded into item 2.1 as a sub-target. |
| Cocoindex fork doc clarity sweep | 2026-04-27T14:25Z | New §7 Fork-Specific Output Telemetry in references/tool_reference.md; explicit spec-folder paths in skill README + SKILL + mcp_server README + MAINTENANCE; outside-skill clarity nudges in system-spec-kit ARCHITECTURE + doctor mcp_install + context agent definitions; root README plain-language fork explainer. Commit `2e8b35dcc0` on `main`. |

---

## 2. STILL DEFERRED

### 2.1 RE-RUN THE 001 STRESS-TEST SWEEP (v1.0.2) — **CLOSED 2026-04-27**

| Field | Value |
|-------|-------|
| Source | 001 packet (predecessor) |
| Status | **CLOSED 2026-04-27T17:30Z.** Sweep complete: 30/30 cells dispatched (exit_code:0), 30/30 scored, findings.md synthesized at `./010-stress-test-rerun-v1-0-2/findings.md`. |
| Closure evidence | Overall 76.7% → 83.8% (+7.2pp), 0 REGRESSIONs, 6/7 packets PROVEN (003, 004, 006, 007, 008, 009). **SC-003 PROVEN at I2/cli-opencode-1**: recovered from v1.0.1's 1/10 catastrophic hallucination to 6/8 with 3-of-4 paths verified, 0 fabricated spec packets. Packet 005 (code-graph-fast-fail) NEUTRAL — graph healthy post-pre-flight, weak-state path not exercised; flagged as P1 follow-up. |
| Follow-ups surfaced | (P0) cli-copilot `/memory:save` Gate 3 bypass on I1 — see findings.md Recommendation #1. (P1) Re-test packet 005 under deterministically degraded graph. (P2) File-watcher debounce, REQ-003 vocabulary sweep, higher-N variance pass on I2 load-bearing cell. |

### 2.2 PACKET 006 PRODUCTION TUNING

| Field | Value |
|-------|-------|
| Source | 006 implementation-summary.md |
| Status | Detection-only at the default cap (100 edges per relation per 15-minute window) |
| Blocker | Needs live telemetry from item 2.1 to inform the production cap |
| Tuning surface | Env vars per `./006-causal-graph-window-metrics/implementation-summary.md` |
| Why it matters | Without tuning, the window cap stays detection-only. Causal-edge over-emission can still degrade graph quality in production. |

### 2.3 PACKET 007 V2 INTENT CLASSIFIER

| Field | Value |
|-------|-------|
| Source | 007 implementation-summary.md |
| Status | v1 LANDED with sorted-token paraphrase grouping heuristic |
| Upgrade scope | Replace sorted-token grouping with embedding-based paraphrase grouping |
| Why it matters | Sorted-token grouping misses semantic paraphrases. Embedding-based grouping would close the remaining intent stability gap surfaced in 002/Q8. |

### 2.4 MODEL-SIDE HALLUCINATION GUARD

| Field | Value |
|-------|-------|
| Source | 002/Q4 deep research |
| Status | Server-side response policy LANDED in packet 009 |
| Upgrade scope | Add client-side guardrails (uncertainty markers in CLI output rendering, confidence-aware result truncation) |
| Why it matters | Packet 009 hardens the server contract, but the model can still produce ungrounded text when confidence is low. Client-side rendering is the second half of the defense. |

---

## 3. RECOMMENDED ORDER

1. ~~**Item 2.1** (execute the v1.0.2 sweep)~~ — **CLOSED 2026-04-27.** Findings at `./010-stress-test-rerun-v1-0-2/findings.md`.
2. **Item 2.2** (packet 006 production tuning) — now unblocked by v1.0.2 telemetry.
3. **Item 2.3** (packet 007 v2) and **Item 2.4** (hallucination guard) — independent enhancements. Run when prioritized.

### Newly surfaced from v1.0.2 sweep (2026-04-27)

> **Status**: the research packet at [`./011-post-stress-followup-research/`](./011-post-stress-followup-research/) is complete. Its follow-up work is now tracked downstream in child packets 012-018, not as ambiguous deferred research.

4. **(P0)** cli-copilot `/memory:save` Gate 3 bypass — tracked downstream in [`./012-copilot-target-authority-helper/`](./012-copilot-target-authority-helper/) and regression-tested by [`./017-cli-copilot-dispatch-test-parity/`](./017-cli-copilot-dispatch-test-parity/).
5. **(P1)** Re-test packet 005 under deterministically-degraded graph — tracked downstream in [`./013-graph-degraded-stress-cell/`](./013-graph-degraded-stress-cell/).
6. **(P2)** Code-graph file-watcher debounce / status observability — tracked downstream in [`./014-graph-status-readiness-snapshot/`](./014-graph-status-readiness-snapshot/) with degraded-envelope parity work in [`./016-degraded-readiness-envelope-parity/`](./016-degraded-readiness-envelope-parity/).
7. **(opportunity)** CocoIndex fork telemetry not yet leveraged downstream — tracked downstream in [`./015-cocoindex-seed-telemetry-passthrough/`](./015-cocoindex-seed-telemetry-passthrough/) and catalog/playbook alignment in [`./018-catalog-playbook-degraded-alignment/`](./018-catalog-playbook-degraded-alignment/).

### Downstream Ownership Snapshot

| Follow-up | Current owner | Status |
|-----------|---------------|--------|
| cli-copilot target-authority helper | `012-copilot-target-authority-helper/` | complete |
| deterministic degraded graph sweep | `013-graph-degraded-stress-cell/` | complete |
| read-only graph readiness snapshot | `014-graph-status-readiness-snapshot/` | complete |
| CocoIndex seed telemetry passthrough | `015-cocoindex-seed-telemetry-passthrough/` | complete |
| degraded-readiness envelope parity | `016-degraded-readiness-envelope-parity/` | complete |
| cli-copilot dispatch test parity | `017-cli-copilot-dispatch-test-parity/` | complete |
| catalog/playbook degraded alignment | `018-catalog-playbook-degraded-alignment/` | in progress |

Items 2.2, 2.3, and 2.4 above remain deferred because they are product-tuning or client-side hardening work that needs a separate owner and acceptance criteria; they are no longer mixed with the v1.0.2 P0/P1/P2 remediation packets.

---

## 4. WHERE TO READ MORE

| Document | Purpose |
|----------|---------|
| Original autonomous-run handover document (deleted before this session; preserved only via git history at the prior path under `003-continuity-memory-runtime/`) | Frozen historical record of the 2026-04-26 to 2026-04-27 autonomous run |
| [`./010-stress-test-rerun-v1-0-2/spec.md`](./010-stress-test-rerun-v1-0-2/spec.md) | v1.0.2 packet root: REQ-001 pre-flight, REQ-002..014 sweep + scoring, SC-001..007 success criteria, cell-to-packet attribution table |
| [`./010-stress-test-rerun-v1-0-2/tasks.md`](./010-stress-test-rerun-v1-0-2/tasks.md) | T001-T305 ledger covering pre-flight, dispatch, scoring, synthesis |
| [`./002-mcp-runtime-improvement-research/research/research.md`](./002-mcp-runtime-improvement-research/research/research.md) | 17-section convergent research underpinning packets 003-009 |
| [`./001-search-intelligence-stress-test/002-scenario-execution/findings.md`](./001-search-intelligence-stress-test/002-scenario-execution/findings.md) | v1.0.1 30-cell sweep results (frozen baseline). Re-run target for item 2.1. |
| [`./003-memory-context-truncation-contract/implementation-summary.md`](./003-memory-context-truncation-contract/implementation-summary.md) | Packet 003 verification row (live probe LANDED 2026-04-27) |
| [`./004-cocoindex-overfetch-dedup/implementation-summary.md`](./004-cocoindex-overfetch-dedup/implementation-summary.md) | Packet 004 closure evidence |
| [`./005-code-graph-fast-fail/implementation-summary.md`](./005-code-graph-fast-fail/implementation-summary.md) | Packet 005 verification row (live probe LANDED 2026-04-27) |
| [`./006-causal-graph-window-metrics/implementation-summary.md`](./006-causal-graph-window-metrics/implementation-summary.md) | Packet 006 verification row plus tuning surface (item 2.2) |
| [`./007-intent-classifier-stability/implementation-summary.md`](./007-intent-classifier-stability/implementation-summary.md) | Packet 007 verification row plus v2 scope (item 2.3) |
| [`./008-mcp-daemon-rebuild-protocol/references/live-probe-template.md`](./008-mcp-daemon-rebuild-protocol/references/live-probe-template.md) | Canonical probe template (used 2026-04-27 to close prior live-probe item; reused by item 2.1 pre-flight) |
| [`./009-memory-search-response-policy/implementation-summary.md`](./009-memory-search-response-policy/implementation-summary.md) | Packet 009 verification row (cite_results probe LANDED 2026-04-27) plus client-side guard scope (item 2.4) |

---

## 5. ACTIVATION ON WAKE-UP

```bash
# 1. Confirm the autonomous-run commits + the v1.0.2 scaffold are present.
git log --oneline --since="2026-04-26"

# 2. Verify the cocoindex fork is live.
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc --version
# Expected: 0.2.3+spec-kit-fork.0.2.0

# 3. (Optional spot-check) Re-run a single live MCP probe to confirm the
#    daemon still has the rebuilt dist loaded; the canonical probes already
#    landed on 2026-04-27 in each packet's verification row.
#    See 008-mcp-daemon-rebuild-protocol/references/live-probe-template.md.

# 4. Execute the v1.0.2 sweep per item 2.1.
#    Entry point: 010-stress-test-rerun-v1-0-2/tasks.md T001 (daemon attestation).
#    Closes HANDOVER §2.1 when 010/findings.md ships.
```
