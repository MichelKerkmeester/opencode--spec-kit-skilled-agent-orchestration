# HANDOVER — Autonomous Run 2026-04-26 → 2026-04-27

> Multi-phase autonomous orchestration of the system-spec-kit MCP server hardening cycle. User slept; no confirmation gates fired during the run.

## Run timeline

| Marker | UTC |
|--------|-----|
| Run started | 2026-04-26 ~14:30 (005 findings packet authored) |
| Phase A complete (rubric v1.0.1) | 2026-04-26 ~22:50 (commit 71456fe86) |
| Phase B complete (10-iter deep research) | 2026-04-27 ~07:25 (commit 997f9f686) |
| Phase C complete (6 of 7 remediation packets shipped) | 2026-04-27 ~07:50 (commit a8275c305) |
| Phase D complete (this handover) | 2026-04-27 ~07:55 |

Total wall-clock: ~17 hours. Total commits on main: 19 (since 71456fe86).

## Phase outcomes

### Phase A — Rubric v1.0.1 calibration ✓ COMPLETE
- Dropped Token Efficiency dimension entirely (30/30 cells scored 0 on v1.0.0; bytes/4 estimator counted CLI tool-result dumps as model output)
- Recalibrated Latency thresholds 0=>300s / 1=60-300s / 2=<60s (was 0=>60s / 1=10-60s / 2=<10s; only 1 of 30 cells scored 2 under v1.0.0)
- Re-scored all 30 cells on the new 8-pt scale; v1.0.0 sections preserved as historical record
- v1.0.1 amendment appended to 006/002-scenario-execution/findings.md
- New per-CLI averages on the 8-pt scale recorded inside the amendment

### Phase B — 10-iter deep research ✓ COMPLETE — CONVERGED
- New packet: `007-mcp-runtime-improvement-research/`
- Scope: 8 sub-questions (Q1-Q8) covering MCP daemon rebuild protocol, cocoindex dedup + ranking, model hallucination, memory_context truncation, code-graph recovery, causal-graph drift, intent classifier stability
- Executor: cli-codex gpt-5.5 reasoning=high service_tier=fast (per user override)
- Stop reason: `converged` — newInfoRatio decreased 0.86 → 0.42 across iter 1 → 10
- Output: `007/research/research.md` (57.9 KB, 17-section format + Eliminated Alternatives + Open Questions)
- All 10 iterations exit code 0; validate.sh strict 0 errors / 0 warnings

### Phase C — Remediation packets ✓ COMPLETE — 6 LANDED, 1 DEFERRED

| Packet | Status | Live verification | Source surface |
|--------|--------|-------------------|----------------|
| 008 — memory-context truncation contract | ✓ LANDED | PENDING daemon restart | mcp_server/handlers/memory-context.ts |
| 009 — cocoindex overfetch + dedup | ⏸ DEFERRED | needs vendor-vs-fork decision | source at ~/.local/pipx/venvs/cocoindex-code/... |
| 010 — code-graph fast-fail | ✓ LANDED | PENDING daemon restart | mcp_server/code_graph/handlers/query.ts |
| 011 — causal-graph window metrics | ✓ LANDED | PENDING daemon restart | mcp_server/handlers/causal-graph.ts + lib/storage/causal-edges.ts |
| 012 — intent classifier stability | ✓ LANDED | PENDING daemon restart | mcp_server/lib/search/intent-classifier.ts |
| 013 — MCP daemon rebuild protocol | ✓ LANDED | doc-only (no live verify needed) | references/mcp-rebuild-restart-protocol.md + 3 sibling docs |
| 014 — memory search response policy | ✓ LANDED | PENDING daemon restart | mcp_server/formatters/search-results.ts + lib/search/recovery-payload.ts |

All 5 source-patching packets rebuild dist cleanly (`cd .opencode/skill/system-spec-kit/mcp_server && npm run build`) and ship vitest coverage that passes. Strict spec validation passes on all 7 packets.

### Phase D — Handover ✓ COMPLETE (this file)

## ⚠ User actions required (Phase D blockers — out of band)

### 1. Restart the MCP-owning client to make Phase C fixes LIVE

Per the 005 phantom-fix lesson and packet 013's protocol: source patches without daemon restart are phantom. All 5 source-patching packets (008, 010, 011, 012, 014) have rebuilt dist correctly with markers verified — the running MCP daemon child process is still serving pre-fix code.

```text
1. Quit the MCP-owning client (OpenCode / Codex / Claude Code).
2. Relaunch it.
3. Run live probes per: 013-mcp-daemon-rebuild-protocol/references/live-probe-template.md
4. Record verbatim probe results in each packet's implementation-summary.md "Verification" row.
```

Use the canonical probes from 005/spec.md §7 (Probes A, B, C) plus 013's live-probe-template.

### 2. CocoIndex vendor-vs-fork decision (packet 009)

The CocoIndex source lives outside the repo at `~/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code`. Two options:

- **Vendor**: pull the source into the repo as a vendored copy + apply 009's overfetch+dedup patch
- **Fork**: maintain a fork of the upstream cocoindex package + publish patched releases

The independently applicable mitigation (a settings.yml exclude rule covering `.gemini/specs/**`, `.agents/specs/**`, `.claude/specs/**`, `.codex/specs/**` mirror folders) is documented in 009/spec.md and recovers ~80% of REQ-018 without touching cocoindex source. Apply that as a quick win regardless of the long-term decision.

### 3. Tune packet 011's per-relation per-window cap

Currently `enforceRelationWindowCap` defaults to detection-only (100 edges per 15-min window per relation). Production tuning recommended once live telemetry collected. Settings live in env vars per 011/implementation-summary.md.

## Read order on wake-up

1. **`HANDOVER.md`** (this file)
2. `git log --oneline --since="20 hours ago"` to see all 19 commits
3. **`007-mcp-runtime-improvement-research/research/research.md`** — convergent research with 17 sections
4. **`006-search-intelligence-stress-test/002-scenario-execution/findings.md`** — v1.0.0 + v1.0.1 amendment with rubric calibration math
5. Per-packet implementation-summary.md for 008-014 to see what landed and what verification is pending

## Memory entries refreshed

- `~/.claude/projects/.../memory/project_autonomous_run_2026_04_26.md` updated with COMPLETE status (see below)
- `~/.claude/projects/.../memory/feedback_opencode_provider_fallback.md` (created earlier in run, applies to future cli-opencode dispatches)
- `~/.claude/projects/.../memory/MEMORY.md` index updated

## Open items deferred to follow-up sessions

- **Live verification probes** for 008, 010, 011, 012, 014 (after daemon restart)
- **Packet 009** vendor-vs-fork decision + cocoindex patch implementation
- **Re-run 006 sweep** against post-fix runtime to measure improvement deltas
- **Packet 011** production tuning of relation-window caps
- **Packet 012** v2: embedding-based paraphrase grouping (currently sorted-token heuristic)
- **Model-side hallucination guard** beyond packet 014's response policy contract — additional client-side guardrails per 007/Q4 (e.g., uncertainty markers in CLI output rendering)

## Notable observations

- **Phase A** uncovered the rubric calibration flaw on the FIRST sweep — playbook is doing its job (SC-003 met by the rubric finding alone)
- **Phase B** convergence pattern: Q5 (memory_context truncation) and Q6 (code-graph recovery) closed by iter 7-8; Q4 (hallucination) and Q8 (intent stability) needed iter 9-10
- **Phase C** mid-run: build temporarily exited non-zero when packet 011 landed before packet 012's `intentEvidence` field — resolved automatically once 012 completed; no regression
- **Phase C** discovery: cli-codex consistently faster than cli-copilot for these scoped fixes; no opencode dispatches needed (all routed cleanly through cli-codex)

## Ready for next session

Run `git status` (should show small linter touches; nothing pending). The autonomous run is complete. Pick up from "User actions required" above when ready.
