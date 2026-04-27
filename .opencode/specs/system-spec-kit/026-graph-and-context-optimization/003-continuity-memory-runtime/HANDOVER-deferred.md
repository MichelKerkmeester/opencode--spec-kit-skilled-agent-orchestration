# HANDOVER — Deferred Items After Autonomous Run

> Residual work from the 2026-04-26 to 2026-04-27 autonomous run, updated after the 009 cocoindex fork closed on 2026-04-27.

---

## 1. OVERVIEW

The autonomous run that started 2026-04-26 shipped 6 of 7 remediation packets (008, 010, 011, 012, 013, 014) plus rubric v1.0.1 plus the 10-iter deep research synthesis. Packet 009 was deferred pending a vendor-vs-fork decision and closed on 2026-04-27 by vendoring `cocoindex-code` into `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` as soft-fork `0.2.3+spec-kit-fork.0.2.0`.

Five follow-up items remain. They split into one prerequisite (live verification probes), one closing-the-loop measurement (re-run 006), and three optional enhancements (packets 011 v2, 012 v2, hallucination guard expansion).

### Closed Since the Original Handover

| Item | Closure date | Closure evidence |
|------|--------------|------------------|
| Packet 009 vendor-vs-fork decision | 2026-04-27 | Commits `3711ad221`, `1b62e976d`, `b08dc8494`, `6e284285a`, `f60d97c79` on `main`. Live probes pass: `dedupedAliases` 29 and 30 across REQ-018 and REQ-019. |

---

## 2. STILL DEFERRED

### 2.1 LIVE PROBES FOR PACKETS 008, 010, 011, 012, 014

| Field | Value |
|-------|-------|
| Source | Phase C remediation packets |
| Status | Source patches LANDED, daemon restart REQUIRED |
| Blocker | MCP-owning client must restart so the running daemon picks up the rebuilt `dist/` |
| Probe location | `013-mcp-daemon-rebuild-protocol/references/live-probe-template.md` plus 005/spec.md §7 (Probes A, B, C) |
| Why it matters | The 005 phantom-fix lesson: source patches plus dist rebuild remain phantom until the daemon child process restarts. Without these probes there is no proof that the patches are running in production. |

### 2.2 RE-RUN THE 006 STRESS-TEST SWEEP

| Field | Value |
|-------|-------|
| Source | 006 packet |
| Status | Pending |
| Blocker | Item 2.1 (probes prove the patches are live) plus daemon restart |
| Output target | `006/002-scenario-execution/findings.md` v1.0.2 amendment with post-fix per-CLI averages |
| Why it matters | This is the close-the-loop measurement. It is the only item that proves the autonomous run actually moved the needle on retrieval quality, latency, and intent stability. Highest impact of the five deferred items. |

### 2.3 PACKET 011 PRODUCTION TUNING

| Field | Value |
|-------|-------|
| Source | 011 implementation-summary.md |
| Status | Detection-only at the default cap (100 edges per relation per 15-minute window) |
| Blocker | Needs live telemetry from item 2.2 to inform the production cap |
| Tuning surface | Env vars per `011/implementation-summary.md` |
| Why it matters | Without tuning, the window cap stays detection-only. Causal-edge over-emission can still degrade graph quality in production. |

### 2.4 PACKET 012 V2 INTENT CLASSIFIER

| Field | Value |
|-------|-------|
| Source | 012 implementation-summary.md |
| Status | v1 LANDED with sorted-token paraphrase grouping heuristic |
| Upgrade scope | Replace sorted-token grouping with embedding-based paraphrase grouping |
| Why it matters | Sorted-token grouping misses semantic paraphrases. Embedding-based grouping would close the remaining intent stability gap surfaced in 007/Q8. |

### 2.5 MODEL-SIDE HALLUCINATION GUARD

| Field | Value |
|-------|-------|
| Source | 007/Q4 deep research |
| Status | Server-side response policy LANDED in packet 014 |
| Upgrade scope | Add client-side guardrails (uncertainty markers in CLI output rendering, confidence-aware result truncation) |
| Why it matters | 014 hardens the server contract, but the model can still produce ungrounded text when confidence is low. Client-side rendering is the second half of the defense. |

---

## 3. RECOMMENDED ORDER

1. **Item 2.1** (live probes) — prerequisite for everything else. Restart the MCP-owning client, run probes, record verbatim results in each packet's implementation-summary.md "Verification" row.
2. **Item 2.2** (re-run 006 sweep) — highest impact. Produces the post-fix improvement deltas the autonomous run was set up to demonstrate.
3. **Item 2.3** (packet 011 tuning) — informed by item 2.2 telemetry.
4. **Item 2.4** (packet 012 v2) and **Item 2.5** (hallucination guard) — independent enhancements. Run when prioritized.

---

## 4. WHERE TO READ MORE

| Document | Purpose |
|----------|---------|
| [`./HANDOVER.md`](./HANDOVER.md) | Original autonomous-run handover (2026-04-26 to 2026-04-27, frozen historical record) |
| [`./007-mcp-runtime-improvement-research/research/research.md`](./007-mcp-runtime-improvement-research/research/research.md) | 17-section convergent research underpinning packets 008-014 |
| [`./006-search-intelligence-stress-test/002-scenario-execution/findings.md`](./006-search-intelligence-stress-test/002-scenario-execution/findings.md) | 30-cell sweep results (v1.0.0 plus v1.0.1 amendment). Re-run target for item 2.2. |
| [`./008-memory-context-truncation-contract/implementation-summary.md`](./008-memory-context-truncation-contract/implementation-summary.md) | Packet 008 verification row (item 2.1 target) |
| [`./009-cocoindex-overfetch-dedup/implementation-summary.md`](./009-cocoindex-overfetch-dedup/implementation-summary.md) | Packet 009 closure evidence |
| [`./010-code-graph-fast-fail/implementation-summary.md`](./010-code-graph-fast-fail/implementation-summary.md) | Packet 010 verification row (item 2.1 target) |
| [`./011-causal-graph-window-metrics/implementation-summary.md`](./011-causal-graph-window-metrics/implementation-summary.md) | Packet 011 verification row plus tuning surface (items 2.1, 2.3) |
| [`./012-intent-classifier-stability/implementation-summary.md`](./012-intent-classifier-stability/implementation-summary.md) | Packet 012 verification row plus v2 scope (items 2.1, 2.4) |
| [`./013-mcp-daemon-rebuild-protocol/references/live-probe-template.md`](./013-mcp-daemon-rebuild-protocol/references/live-probe-template.md) | Canonical probe template (item 2.1) |
| [`./014-memory-search-response-policy/implementation-summary.md`](./014-memory-search-response-policy/implementation-summary.md) | Packet 014 verification row plus client-side guard scope (items 2.1, 2.5) |

---

## 5. ACTIVATION ON WAKE-UP

```bash
# 1. Confirm the autonomous-run commits are present.
git log --oneline --since="2026-04-26"

# 2. Restart the MCP-owning client (OpenCode, Codex, or Claude Code).
#    This makes packets 008, 010, 011, 012, 014 LIVE.

# 3. Verify the cocoindex fork is live.
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc --version
# Expected: 0.2.3+spec-kit-fork.0.2.0

# 4. Run live probes per item 2.1.
#    See 013-mcp-daemon-rebuild-protocol/references/live-probe-template.md.

# 5. Re-run the 006 stress-test sweep per item 2.2.
#    See 006-search-intelligence-stress-test/playbook for the sweep harness.
```
