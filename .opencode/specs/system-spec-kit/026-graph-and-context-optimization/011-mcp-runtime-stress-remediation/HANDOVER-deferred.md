# HANDOVER — Deferred Items After Autonomous Run

> Residual work from the 2026-04-26 to 2026-04-27 autonomous run. Updated after item 2.1 was scaffolded into the new `010-stress-test-rerun-v1-0-2/` packet on 2026-04-27. Reorganization history (carve-out + renumber) lives in `./context-index.md`, not here.
>
> **Note**: this file was lost in commit `2e8b35dcc0` (the staged delete of the predecessor path dominated the rename) and recreated in this session with the §2.1 Scaffolded status reflecting the new `010-stress-test-rerun-v1-0-2/` packet. The fork-doc-tidy edits that landed earlier in the same session (§2.1 weak-quality probe sub-target, refusal-contract field references, etc.) are preserved below.

---

## 1. OVERVIEW

The autonomous run shipped 6 of 7 remediation packets (003, 005, 006, 007, 008, 009 in current numbering) plus rubric v1.0.1 plus the 10-iter deep research synthesis. Packet 004 (cocoindex-overfetch-dedup) was deferred pending a vendor-vs-fork decision and closed on 2026-04-27 by vendoring `cocoindex-code` into `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` as soft-fork `0.2.3+spec-kit-fork.0.2.0`. Item 2.1 (live MCP probes for packets 003/005/006/007/009) closed later on 2026-04-27 once a fresh Claude Code session restart picked up the rebuilt `dist/`.

After live probes closed, the remaining work was the close-the-loop measurement: re-run the 30-cell sweep against the post-fix dist and produce v1.0.2 findings with per-packet verdicts. That work is now scaffolded as the new `010-stress-test-rerun-v1-0-2/` sibling packet at this folder root; sweep execution is downstream of the scaffold.

Three follow-up items remain after the v1.0.2 scaffold lands. They split into the v1.0.2 sweep execution itself (item 2.1) and three optional enhancements (006 production tuning, 007 v2 classifier, client-side hallucination guard).

### Closed Since the Original Handover

| Item | Closure date | Closure evidence |
|------|--------------|------------------|
| Packet 004 (cocoindex-overfetch-dedup) vendor-vs-fork decision | 2026-04-27 | Commits `3711ad221`, `1b62e976d`, `b08dc8494`, `6e284285a`, `f60d97c79` on `main`. Live probes pass: `dedupedAliases` 29 and 30 across REQ-018 and REQ-019. |
| Live MCP probes for packets 003, 005, 006, 007 | 2026-04-27T10:12:36–10:12:38Z | Fresh Claude Code session post-2026-04-26 dist rebuild. Verbatim probe output now in each packet's verification row: 003 (`memory_context` token-budget fields populated, `preEnforcementTokens:7410`, `returnedTokens:1278`); 005 (`code_graph_query` fresh-graph branch, `freshnessAuthority:"live"`, no `fallbackDecision`); 006 (`memory_causal_stats`, all 6 by_relation keys, `health:"healthy"`, `meetsTarget:true`, idle-window `balanceStatus:"insufficient_data"`); 007 (`memory_context` intent telemetry, `taskIntent.intent:"understand"`, `paraphraseGroup:"search-semantic"`, `backendRouting.route:"semantic"`). All five packets re-validated PASS strict. |
| Live MCP probe for packet 009 (cite_results branch) | 2026-04-27T10:12:37Z | `memory_search` good-quality call returned `citationPolicy:"cite_results"`, `requestQuality.label:"good"`, `evidenceGapWarning` still surfaces (`Z=1.21`). Weak-quality branch (`do_not_cite_results`/`responsePolicy.noCanonicalPathClaims`/`safeResponse`/`ask_disambiguation`) NOT exercised on this probe — folded into item 2.1 as a sub-target. |
| Cocoindex fork doc clarity sweep | 2026-04-27T14:25Z | New §7 Fork-Specific Output Telemetry in `references/tool_reference.md`; explicit spec-folder paths in skill README + SKILL + mcp_server README + MAINTENANCE; outside-skill clarity nudges in system-spec-kit ARCHITECTURE + doctor mcp_install + context agent definitions; root README plain-language fork explainer. Commit `2e8b35dcc0` on `main`. |

---

## 2. STILL DEFERRED

### 2.1 RE-RUN THE 001 STRESS-TEST SWEEP (v1.0.2)

| Field | Value |
|-------|-------|
| Source | 001 packet (predecessor) |
| Status | **Scaffolded — see ./010-stress-test-rerun-v1-0-2/.** Sweep execution pending daemon-restart attestation gate (REQ-001 in the new packet). |
| Blocker | Daemon must be live at fork version 0.2.3+spec-kit-fork.0.2.0 when execution starts. The new packet's pre-flight gate enforces this; no other blockers. |
| Output target | `./010-stress-test-rerun-v1-0-2/findings.md` (created at execution time) with v1.0.1 baseline + v1.0.2 score + delta + classification per cell, per-CLI averages side-by-side, and a per-packet verdict for packets 003-009. The 001 v1.0.1 findings stays frozen as the baseline — only a one-line forward pointer is appended. Sub-target: weak-quality `memory_search` reproduction probe that exercises the `do_not_cite_results` / `responsePolicy.noCanonicalPathClaims` / `safeResponse` / `ask_disambiguation` branch (the branch the 2026-04-27 cite_results probe did not cover). |
| Why it matters | This is the close-the-loop measurement. It is the only remaining item that proves the autonomous run actually moved the needle on retrieval quality, latency, and intent stability. Highest impact of the three deferred items. Headline closure evidence: SC-003 in the new packet (I2 cli-opencode recovers from v1.0.1's 1/10 catastrophic hallucination to ≥6/8 under the v1.0.1 rubric). |

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

1. **Item 2.1** (execute the v1.0.2 sweep at `./010-stress-test-rerun-v1-0-2/`) — highest impact. Now scaffolded; execution unblocks all other items by surfacing real telemetry.
2. **Item 2.2** (packet 006 production tuning) — informed by item 2.1 telemetry.
3. **Item 2.3** (packet 007 v2) and **Item 2.4** (hallucination guard) — independent enhancements. Run when prioritized.

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
