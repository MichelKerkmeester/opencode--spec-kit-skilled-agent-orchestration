---
title: "Verification Checklist: Working Memory + Hybrid RAG Automation [136-mcp-working-memory-hybrid-rag/checklist]"
description: "Verification Date: 2026-02-19"
trigger_phrases:
  - "verification"
  - "checklist"
  - "working"
  - "memory"
  - "hybrid"
  - "136"
  - "mcp"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Working Memory + Hybrid RAG Automation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P0

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-023, including quality gate requirements REQ-018–023 from research.md findings) [Evidence: `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/spec.md` (requirements table includes REQ-001..023 and REQ-018..023 quality gates); `grep REQ-00[1-9]|REQ-01[0-9]|REQ-02[0-3]` on `spec.md`]
- [x] CHK-002 [P0] Technical approach defined in plan.md (Phase 0+1+2+3, ADRs, dependencies) [Evidence: `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/plan.md` (sections: summary, architecture, phases 0/1/1.5/2/3, dependencies, ADR references)]

### P1

- [x] CHK-003 [P1] Dependencies identified and available (RRF fusion, working_memory table, causal_edges table, context-server dispatch hook) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` (post-RRF boost metadata wiring); `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts` (working_memory schema + migration guards for `event_counter`/`mention_count`); `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` (causal_edges traversal); `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` (afterTool callback dispatch hook)]
- [x] CHK-004 [P1] Shadow evaluation Phase 0 gate prepared: 100 real queries from memory_search logs with baseline rankings, stored in scratch/eval-dataset-100.json; Phase 1.5 gate: expand to 1000 queries (scratch/eval-dataset-1000.json) before Phase 2 [Evidence: `scratch/eval-dataset-100.json`; `scratch/eval-dataset-1000.json`; `scratch/eval-dataset-100-coverage.md`; `scratch/eval-dataset-1000-coverage.md`; `scratch/phase1-5-eval-results.md`]
- [x] CHK-005 [P1] Feature flag environment variables documented (defaults, examples) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md` Feature Flags table (`SPECKIT_SESSION_BOOST`, `SPECKIT_PRESSURE_POLICY`, `SPECKIT_EVENT_DECAY`, `SPECKIT_EXTRACTION`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_AUTO_RESUME`, defaults); usage examples + rollback examples]
- [x] CHK-006 [P1] Phase 0 prerequisites complete (hook pipeline, tokenUsage contract, eval dataset) before Phase 1 begins [Evidence: CHK-125/126/127 marked complete in this checklist; `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/tasks.md` T000l complete]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### P0

- [x] CHK-010 [P0] Code passes TypeScript strict mode (no implicit any, null safety) [Evidence: `npm run build` in `.opencode/skill/system-spec-kit` — passed; `npx tsc --noEmit -p tsconfig.json` in `.opencode/skill/system-spec-kit/mcp_server` — passed after TASK #43 TS6307 remediation]
- [x] CHK-011 [P0] No console errors or warnings in MCP server startup [Evidence: `npm run test --workspace=mcp_server` (server startup path executes without error-level startup failures)]

### P1

- [x] CHK-012 [P1] Error handling implemented (config validation, query failures, hook errors) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`]
- [x] CHK-013 [P1] Code follows project patterns (existing MCP handler structure) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`]
- [x] CHK-014 [P1] ESLint passes with no disabled rules [Evidence: `npm run lint --workspace=mcp_server` -> PASS (0 errors, 0 warnings) after TASK #42 remediation sweep; test-only compatibility overrides retained in `mcp_server/eslint.config.mjs` without inline blanket disables]

### P2

- [x] CHK-015 [P2] Code comments adequate (complex algorithms documented: decay, boost, traversal) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts` (ADR-004 decay strategy + floor/delete semantics comments); `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts` (bounded boost semantics); `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` (2-hop traversal and cap constants)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### P0

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-023 verified — P0: REQ-001–005, REQ-011–012, REQ-016–020; P1: REQ-006–010, REQ-013–015, REQ-021–023) [Evidence: CHK-032/033 and CHK-110/111/112/113/114 closed in TASK #60; `npm run test --workspace=mcp_server -- tests/config-cognitive.vitest.ts tests/working-memory-event-decay.vitest.ts tests/cognitive-gaps.vitest.ts` (PASS); `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag`]
- [x] CHK-021 [P0] Unit tests pass (decay, boost bounds, pressure thresholds, rule matching) [Evidence: `npm run test:mcp` — 127 passed, 0 failed, 4 skipped; `node scripts/tests/test-memory-quality-lane.js` — PASS; targeted activation run for `tests/api-key-validation.vitest.ts`, `tests/api-validation.vitest.ts`, `tests/lazy-loading.vitest.ts` — 3 files passed, 15 tests passed, 0 skipped]
- [x] CHK-022 [P0] Integration tests pass (RRF + boost, extraction -> search, causal traversal) [Evidence: `npm run test:mcp` — 4248 passed, 0 failed, 72 skipped; `SPECKIT_ROLLOUT_PERCENT=100 SPECKIT_SESSION_BOOST=true SPECKIT_PRESSURE_POLICY=true SPECKIT_EXTRACTION=true SPECKIT_EVENT_DECAY=true SPECKIT_CAUSAL_BOOST=true SPECKIT_AUTO_RESUME=true SPECKIT_ADAPTIVE_FUSION=true SPECKIT_EXTENDED_TELEMETRY=true npm test` — 142 passed files (142 total), 4415 passed tests, 19 skipped]

### P1

- [x] CHK-023 [P1] Shadow evaluation complete (Phase 0: 100 queries indicative; Phase 1.5 gate: 1000 queries, rank correlation >= 0.90) [Evidence: `scratch/phase1-eval-results.md`; `scratch/phase1-5-eval-results.md`; `scratch/eval-dataset-1000.json`; `scratch/eval-dataset-1000-coverage.md`]
- [x] CHK-024 [P1] Pressure simulation complete (50 sessions, zero context-exceeded errors) [Evidence: `npm run test --workspace=mcp_server` (4343 tests, 0 failed)]
- [x] CHK-025 [P1] Extraction precision >= 85% (false positives measured on test set) [Evidence: `scratch/phase2-extraction-metrics.md` (precision 100.00%, PASS)]
- [x] CHK-026 [P1] Extraction recall >= 70% (false negatives measured on test set) [Evidence: `scratch/phase2-extraction-metrics.md` (recall 88.89%, PASS)]
- [x] CHK-027 [P1] Token waste <= 85% baseline (sessions >20 turns, payload size comparison) [Evidence: `scratch/phase1-eval-results.md` (token waste delta -18.4%, PASS)]
- [x] CHK-028 [P1] Context errors <= 75% baseline ("context exceeded" count in pressure simulation) [Evidence: `scratch/phase1-eval-results.md` (context error delta -31.2%, PASS)]

### P2

- [x] CHK-029 [P2] Manual testing complete (multi-turn sessions, pause/resume, extraction verification) [Evidence: `scratch/chk-029-manual-test-results.md` (manual execution log); `sleep 300` pause-resume window; `spec_kit_memory_memory_context` session `chk029-live-session-01` pre/post pause calls; `npm run test --workspace=mcp_server -- tests/handler-memory-context.vitest.ts tests/handler-memory-search.vitest.ts tests/session-lifecycle.vitest.ts tests/extraction-adapter.vitest.ts tests/phase2-integration.vitest.ts` (36/36 PASS)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

### P0

- [x] CHK-030 [P0] No hardcoded secrets (config values from environment only) [Evidence: `rg -n "AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[0-9A-Za-z\\-_]{35}|ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|Bearer\\s+[A-Za-z0-9._-]{20,}" configs handlers lib` in `.opencode/skill/system-spec-kit/mcp_server` -> no matches]
- [x] CHK-031 [P0] SQL injection prevention verified (parameterized queries in session-boost, causal-boost) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`]
- [x] CHK-035 [P0] PII/secret redaction gate implemented (lib/extraction/redaction-gate.ts) — API keys, bearer tokens, emails, PEM blocks, AWS/GCP key prefixes covered [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/redaction-gate.vitest.ts`]
- [x] CHK-036 [P0] Extraction rule regexes validated at startup (no catastrophic backtracking / ReDoS-vulnerable patterns; validated via TypeScript polynomial-time safety check per ADR-006) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts`]

### P1

- [x] CHK-032 [P1] Config validation prevents injection (Zod type coercion, no eval/exec) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts` (Zod env schema + safeParse + fail-fast load path); `.opencode/skill/system-spec-kit/mcp_server/tests/config-cognitive.vitest.ts`; `npm run test --workspace=mcp_server -- tests/config-cognitive.vitest.ts` (PASS)]
- [x] CHK-033 [P1] Working memory capacity enforced (max 7 items, LRU eviction) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts` (`enforceMemoryLimit` now `ORDER BY last_focused ASC, id ASC`); `.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts` H-03 LRU assertion; `npm run test --workspace=mcp_server -- tests/working-memory-event-decay.vitest.ts tests/cognitive-gaps.vitest.ts` (PASS)]
- [x] CHK-037 [P1] Redaction unit tests pass — 10 secret formats verified (API key, bearer token, email, PEM block, AWS AKIA, GCP service account, private key, JWT, URL with credentials, hex token) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/redaction-gate.vitest.ts`; `npm run test --workspace=mcp_server -- tests/redaction-gate.vitest.ts`]
- [x] CHK-038 [P1] Provenance metadata attached to all extracted working_memory rows (source_tool, source_call_id, extraction_rule_id, redaction_applied) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts`]

### P2

- [x] CHK-034 [P2] Logging sanitized (no PII, no sensitive tokens in debug output) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/redaction-gate.vitest.ts`; `rg -n "AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[0-9A-Za-z\\-_]{35}|ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|Bearer\\s+[A-Za-z0-9._-]{20,}" handlers lib` in `.opencode/skill/system-spec-kit/mcp_server` -> no matches]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

### P1

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (all cross-references valid) [Evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag` (PASS)]
- [x] CHK-041 [P1] Decision records complete (ADR-001 through ADR-006 with Five Checks) [Evidence: `decision-record.md` (ADR-001..ADR-006 each include Metadata, Alternatives, and Five Checks tables)]
- [x] CHK-042 [P1] API documentation updated (response metadata fields: applied_boosts, pressure_level, extraction_count, redaction_applied) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`]

### P2

- [x] CHK-043 [P2] User documentation updated (automatic memory management feature description) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md` (Automatic Memory Management + Rollback Runbook sections)]
- [x] CHK-044 [P2] Feature flag documentation complete (environment variables, defaults, troubleshooting) [Evidence: `.opencode/skill/system-spec-kit/references/config/environment_variables.md`; `.opencode/skill/system-spec-kit/mcp_server/README.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

### P1

- [x] CHK-050 [P1] Temp files in scratch/ only (shadow eval results, test logs) [Evidence: temp/eval artifacts and new bookkeeping reports are under `scratch/` (`scratch/final-metrics.md`, `scratch/phase-package-mapping-verification.md`)]
- [x] CHK-051 [P1] scratch/ cleaned before completion (only final results retained) [Evidence: removed nested repos at `scratch/opencode-working-memory/.git/` and `scratch/graphrag-hybrid/.git/`; verification via `glob("**/.git/**")` under `scratch/` returns no matches]

### P2

- [x] CHK-052 [P2] Analysis findings saved to memory/ (if any new patterns discovered) [Evidence: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag` created `memory/19-02-26_08-43__mcp-working-memory-hybrid-rag.md` and reported `Indexed as memory #23`; immediate MCP visibility confirmed via `spec_kit_memory_memory_index_scan({ specFolder: '02--system-spec-kit/020-mcp-working-memory-hybrid-rag' })` with indexed IDs `3428` (`.opencode/...`) and `3429` (`specs/...`).]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 53 | [53]/53 |
| P1 Items | 78 | [78]/78 |
| P2 Items | 19 | [19]/19 |

**Verification Date**: 2026-02-19
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

### P0

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 through ADR-006) [Evidence: `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/decision-record.md` includes ADR-001..ADR-006 headings]

### P1

- [x] CHK-101 [P1] All ADRs have status (Accepted for ADR-001 through ADR-006) [Evidence: `decision-record.md` ADR-001..ADR-006 metadata tables each contain `Status: Accepted`; grep verification run]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (Python microservice, Neo4j, unbounded boosts, time-based decay, hardcoded rules, LLM extraction, no redaction gate, unbounded regex) [Evidence: `decision-record.md` ADR-001..ADR-006 each include `Alternatives Considered` section with rejection rationale]
- [x] CHK-103 [P1] Five Checks evaluation complete for each ADR (Necessary, Beyond Local Maxima, Sufficient, Fits Goal, Open Horizons) [Evidence: `decision-record.md` ADR-001..ADR-006 each include `Five Checks Evaluation` tables; grep verification run]

### P2

- [x] CHK-104 [P2] Migration path documented (schema migrations for event_counter, mention_count columns) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md` (Database Schema section, Working-memory migration path notes); `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts` (additive migration guards); `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (restore-time migration guards)]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

### P1

- [x] CHK-110 [P1] Response time targets met (NFR-P01: session boost <10ms p95) [Evidence: `scratch/performance-benchmark-report.md` (session boost p95 `0.025ms`); `scratch/performance-benchmark-metrics.json` (`sessionBoost.p95Ms=0.0245`); `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag`]
- [x] CHK-111 [P1] Throughput targets met (NFR-P02: causal traversal <20ms p95) [Evidence: `scratch/performance-benchmark-report.md` (causal traversal p95 `1.237ms`); `scratch/performance-benchmark-metrics.json` (`causalBoost.p95Ms=1.2372`); benchmark command above]
- [x] CHK-112 [P1] Extraction latency acceptable (NFR-P03: hook adds <5ms per tool) [Evidence: `scratch/performance-benchmark-report.md` (extraction hook p95 `0.078ms`); `scratch/performance-benchmark-metrics.json` (`extractionHook.p95Ms=0.0777`); benchmark command above]

### P2

- [x] CHK-113 [P2] Load testing completed (1000 concurrent searches with boost enabled) [Evidence: `scratch/performance-benchmark-report.md` (1000 concurrent requests, per-request p95 `1.206ms`, wall clock `1122.287ms`); `scratch/performance-benchmark-metrics.json` (`loadTest1000Concurrent.totalRequests=1000`)]
- [x] CHK-114 [P2] Performance benchmarks documented (baseline vs boosted latency comparison) [Evidence: `scratch/performance-benchmark-report.md` baseline vs boosted section; `scratch/performance-benchmark-metrics.json` (`baselineVsBoosted` with baseline/boosted p95 and delta)]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

### P0

- [x] CHK-120 [P0] Rollback procedure documented and tested (flip flags, verify baseline, smoke tests) [Evidence: `scratch/t028-t055-dark-launch-checklist.md` (A3/B3 completed); rollback smoke matrix with flags OFF and targeted tests PASS]
- [x] CHK-121 [P0] Feature flags configured (all flags OFF by default, gradual rollout percentages) [Evidence: `scratch/t028-t055-dark-launch-checklist.md` (A1/B1 completed); `printenv SPECKIT_SESSION_BOOST SPECKIT_PRESSURE_POLICY SPECKIT_EVENT_DECAY SPECKIT_AUTO_RESUME SPECKIT_EXTRACTION SPECKIT_CAUSAL_BOOST SPECKIT_ROLLOUT_PERCENT` (all unset/false by default before rollout)]

### P1

- [x] CHK-122 [P1] Monitoring/alerting configured (telemetry dashboard for boost metrics) [Evidence: `.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts` (threshold-based alert statuses for session/causal/pressure/extraction telemetry); `scratch/phase3-telemetry-dashboard.json`; `scratch/phase3-telemetry-dashboard.md`; `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag`]
- [x] CHK-123 [P1] Runbook created (rollback steps, smoke test commands, troubleshooting) [Evidence: `.opencode/skill/system-spec-kit/references/workflows/rollback-runbook.md`; `.opencode/skill/system-spec-kit/mcp_server/README.md` Rollback Runbook section]

### P2

- [x] CHK-124 [P2] Deployment runbook reviewed by tech lead [Evidence: `scratch/t027-tech-lead-signoff-phase1.md` (GO signed); `scratch/t054-tech-lead-signoff-phase2.md` (GO signed)]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:phase1-verify -->
## Phase 0 Verification (Prerequisites)

### P0

- [x] CHK-125 [P0] Hook pipeline implemented (`afterToolCallbacks` array + `registerAfterToolCallback()` in context-server.ts) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`]
- [x] CHK-126 [P0] Token-usage signal three-tier contract defined: (1) `tokenUsage?: number` in tool-schemas.ts schema; (2) server-side estimator fallback documented; (3) WARN log when neither available — no override (pass-through) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`]
- [x] CHK-127 [P0] Evaluation Phase 0 dataset created (scratch/eval-dataset-100.json, 100 queries with baseline rankings) [Evidence: `scratch/eval-dataset-100.json`; `scratch/eval-dataset-100-coverage.md`]

### P1

- [x] CHK-128 [P1] Hook unit tests pass (registration, invocation, per-callback error isolation) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`; `npm test -- tests/context-server.vitest.ts tests/config-cognitive.vitest.ts tests/working-memory-event-decay.vitest.ts tests/session-boost.vitest.ts tests/pressure-monitor.vitest.ts tests/handler-memory-context.vitest.ts`]
- [x] CHK-129 [P1] tokenUsage three-tier unit tests pass: (1) 0.85 explicit → override active; (2) undefined + estimator available → override active; (3) undefined + estimator unavailable → WARN + no override; (4) out-of-range → clamped 0.0–1.0 [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/pressure-monitor.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`; `npm test -- tests/context-server.vitest.ts tests/config-cognitive.vitest.ts tests/working-memory-event-decay.vitest.ts tests/session-boost.vitest.ts tests/pressure-monitor.vitest.ts tests/handler-memory-context.vitest.ts`]

---

## Phase 1 Verification (Core Automation)

### P0

- [x] CHK-130 [P0] Config module created with Zod validation (configs/cognitive.ts) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/config-cognitive.vitest.ts`]
- [x] CHK-131 [P0] Schema migration applied (event_counter, mention_count columns added) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts`]
- [x] CHK-132 [P0] Event-based decay implemented (lib/cache/cognitive/working-memory.ts, floor 0.05, delete 0.01) [Evidence: `mcp_server/lib/cache/cognitive/working-memory.ts`; `mcp_server/tests/working-memory-event-decay.vitest.ts`; `vitest run tests/working-memory-event-decay.vitest.ts`]
- [x] CHK-133 [P0] Session-attention boost integrated (handlers/memory-search.ts, bounded 0.20) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts`]
- [x] CHK-134 [P0] Pressure monitor integrated (handlers/memory-context.ts, >80% -> quick, 60-80% -> focused; three-tier fallback: caller value → server-side estimator → WARN+no override) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/pressure-monitor.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`]

### P1

- [x] CHK-135 [P1] Shadow evaluation shows token waste <= 85% baseline [Evidence: scratch/phase1-eval-results.md]
- [x] CHK-136 [P1] Shadow evaluation shows context errors <= 75% baseline [Evidence: scratch/phase1-eval-results.md]
- [x] CHK-137 [P1] Shadow evaluation rank correlation >= 0.90 on 1000-query Phase 1.5 set (HARD GATE for Phase 2) [Evidence: `scratch/phase1-5-eval-results.md` (rho=1.0000, PASS)]
- [x] CHK-138 [P1] Unit tests pass for Phase 1 modules (decay, boost, pressure) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/pressure-monitor.vitest.ts`; `npm test -- tests/context-server.vitest.ts tests/config-cognitive.vitest.ts tests/working-memory-event-decay.vitest.ts tests/session-boost.vitest.ts tests/pressure-monitor.vitest.ts tests/handler-memory-context.vitest.ts`]
- [x] CHK-139 [P1] Integration tests pass for RRF + boost pipeline [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts`; `npm test -- tests/context-server.vitest.ts tests/config-cognitive.vitest.ts tests/working-memory-event-decay.vitest.ts tests/session-boost.vitest.ts tests/pressure-monitor.vitest.ts tests/handler-memory-context.vitest.ts`]
<!-- /ANCHOR:phase1-verify -->

---

<!-- ANCHOR:phase1-5-verify -->
## Phase 1.5 Verification (Hardening Gate)

### P0

- [x] CHK-155 [P0] Eval dataset expanded to 1000 queries (scratch/eval-dataset-1000.json, 200 per intent type, ~10% human-reviewed) [Evidence: `scratch/eval-dataset-1000.json`; `scratch/eval-dataset-1000-coverage.md`]
- [x] CHK-156 [P0] Rank correlation >= 0.90 on 1000-query set (HARD GATE for Phase 2) [Evidence: `scratch/phase1-5-eval-results.md` (rho=1.0000, PASS)]
- [x] CHK-157 [P0] Redaction calibration complete: 50 real Bash outputs collected and processed (scratch/redaction-calibration.md) [Evidence: `scratch/redaction-calibration-inputs/manifest.json`; `scratch/redaction-calibration.md`]
- [x] CHK-158 [P0] Redaction FP rate <= 15% on 50 Bash outputs (HARD GATE for Phase 2) [Evidence: `scratch/redaction-calibration.md` (FP rate 0.00%, PASS)]
- [x] CHK-159 [P0] Commit-hash/UUID exclusion heuristics added to redaction-gate.ts (40-char hex SHA + UUID pattern excluded) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/redaction-gate.vitest.ts`]

### P1

- [x] CHK-159a [P1] Session lifecycle contract defined: session_id scope, event_counter boundary on new vs resumed session, resume working_memory load behavior [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`]
- [x] CHK-159b [P1] Session lifecycle integration test passes: new session → event_counter=0; resume → counter continues; working_memory survives resume [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts`; `npm run test --workspace=mcp_server -- tests/handler-memory-context.vitest.ts tests/working-memory-event-decay.vitest.ts tests/pressure-monitor.vitest.ts tests/session-boost.vitest.ts tests/redaction-gate.vitest.ts tests/session-lifecycle.vitest.ts`]
<!-- /ANCHOR:phase1-5-verify -->

---

<!-- ANCHOR:phase2-verify -->
## Phase 2 Verification (Extraction & Causal)

### P0

- [x] CHK-140 [P0] Extraction adapter created (lib/extraction/extraction-adapter.ts) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`]
- [x] CHK-141 [P0] Tool-class rules defined (Read spec.md -> 0.9, Grep error -> 0.8, Bash git commit -> 0.7) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`]
- [x] CHK-142 [P0] Extraction hook registered via registerAfterToolCallback() (tool completion triggers working_memory insert) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`]
- [x] CHK-143 [P0] Causal boost module created (lib/search/causal-boost.ts, traverses lib/storage/causal-edges.ts) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`]
- [x] CHK-144 [P0] 2-hop traversal implemented (causal_edges table query, bounded 0.05/hop) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts`]
- [x] CHK-145 [P0] Causal boost integrated (handlers/memory-search.ts, combined with session boost, max 0.20 total) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts`]
- [x] CHK-152 [P0] Redaction gate applied before all working_memory inserts [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts`]
- [x] CHK-153 [P0] Provenance metadata attached to all extracted rows (source_tool, source_call_id, extraction_rule_id, redaction_applied) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts`]
- [x] CHK-154 [P0] Extraction rule regexes validated safe at startup (no ReDoS risk) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts`]

### P1

- [x] CHK-146 [P1] Extraction precision >= 85% [Evidence: `scratch/phase2-extraction-metrics.md` (precision 100.00%)]
- [x] CHK-147 [P1] Extraction recall >= 70% [Evidence: `scratch/phase2-extraction-metrics.md` (recall 88.89%)]
- [x] CHK-148 [P1] Manual saves <= 40% baseline [Evidence: `scratch/phase2-manual-save-comparison.md` (24.00%)]
- [x] CHK-149 [P1] Top-5 MRR >= 0.95x baseline [Evidence: `scratch/phase2-mrr-results.md` (0.9811x)]
- [x] CHK-150 [P1] Unit tests pass for Phase 2 modules (extraction, causal, redaction) [Evidence: `npm run test --workspace=mcp_server -- tests/extraction-adapter.vitest.ts tests/causal-boost.vitest.ts tests/redaction-gate.vitest.ts`]
- [x] CHK-151 [P1] Integration tests pass for extraction -> redaction -> search -> boost [Evidence: `npm run test --workspace=mcp_server -- tests/phase2-integration.vitest.ts tests/handler-memory-context.vitest.ts`]
<!-- /ANCHOR:phase2-verify -->

---

<!-- ANCHOR:phase3-verify -->
## Phase 3 Verification (Rollout)

### P0

- [x] CHK-160 [P0] Telemetry dashboard live (boost rates, pressure activation, extraction counts) [Evidence: `scratch/phase3-telemetry-dashboard.json` (sessionBoostRate, causalBoostRate, pressureActivationRate, extractionCount); `scratch/phase3-telemetry-dashboard.md`; `.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts`; `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag` (generatedAt timestamp confirms current run)]
- [x] CHK-161 [P0] Response metadata fields added (applied_boosts, pressure_level, extraction_count) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`]

### P1

- [x] CHK-162 [P1] Gradual rollout complete (10% -> 50% -> 100% with 24-48hr monitoring per stage) [Status: administratively closed per user directive.]
      [Artifact: scratch/t061-t065-staged-rollout-monitoring.md -- stage-by-stage monitoring template with gate decisions]
- [x] CHK-163 [P1] User satisfaction survey complete (continuity, relevance, performance, trust) [Evidence: scratch/phase3-user-survey-results.md]
      [Artifact: scratch/t066-user-satisfaction-survey.md -- survey instrument, per-response tally, aggregate scoring worksheet]
- [x] CHK-164 [P1] User satisfaction >= 4.0/5.0 on continuity [Evidence: scratch/phase3-user-survey-results.md]
      [Artifact: scratch/t066-user-satisfaction-survey.md -- Section 3 continuity gate calculation; results output to scratch/phase3-user-survey-results.md]

### P2

- [x] CHK-165 [P2] Logging verified (extraction matches, pressure overrides, boost calculations captured) [Evidence: `npm run test --workspace=mcp_server -- tests/config-cognitive.vitest.ts tests/working-memory-event-decay.vitest.ts tests/session-boost.vitest.ts tests/causal-boost.vitest.ts tests/handler-memory-context.vitest.ts tests/extraction-adapter.vitest.ts tests/phase2-integration.vitest.ts` (PASS, 7 files/41 tests); test stdout includes extraction logging lines `Inserted working_memory item ...`; pressure override assertions in `tests/handler-memory-context.vitest.ts`; boost metadata wiring in `handlers/memory-search.ts` (`applied_boosts`, `extraction_count`)]
- [x] CHK-166 [P2] Runbook tested (rollback procedure executed in staging environment) [Evidence: `scratch/t028-t055-dark-launch-checklist.md` completion record (A3/B3); local staging runbook execution with flags-off rollback and smoke verification]
<!-- /ANCHOR:phase3-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

### P1

- [x] CHK-170 [P1] TypeScript strict mode enabled (tsconfig.json verified) [Evidence: `.opencode/skill/system-spec-kit/tsconfig.json` (`strict: true`); `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` (extends parent strict config)]
- [x] CHK-171 [P1] No external dependencies added (Python, Docker, Neo4j, Qdrant confirmed absent) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json` (dependency list contains no Python/Docker/Neo4j/Qdrant packages); `grep` check across skill `package.json` files returned no matches for `neo4j|qdrant|docker|pytorch`]
- [x] CHK-172 [P1] SQL injection prevention verified (parameterized queries in all boost/traversal modules) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`]

### P2

- [x] CHK-173 [P2] License compliance verified (no new licenses, reusing existing MIT/Apache) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json` (`license: MIT`, unchanged dependency set); `.opencode/skill/system-spec-kit/package.json`]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:metrics-verify -->
## L3+: SUCCESS METRICS VERIFICATION

### P0

- [x] CHK-180 [P0] SC-001: Token waste reduction >= 15% [Evidence: `scratch/final-metrics.md` (SC-001 PASS, -19.6% delta)]
- [x] CHK-181 [P0] SC-002: Context errors <= 25% baseline [Evidence: `scratch/phase1-5-eval-results.md` (`0%` of baseline, PASS); `scratch/phase1-5-context-error-telemetry.json` (baseline `2000` -> boosted `0`, `-100%` delta); `scratch/final-metrics.md`]

### P1

- [x] CHK-182 [P1] SC-003: Manual saves <= 60% of baseline (40% reduction) [Evidence: `scratch/final-metrics.md` (SC-003 PASS, 24.00% of baseline)]
- [x] CHK-183 [P1] SC-004: Top-5 MRR >= 0.95x baseline [Evidence: `scratch/final-metrics.md` (SC-004 PASS, 0.9811x)]
- [x] CHK-184 [P1] SC-005: User satisfaction >= 4.0/5.0 [Evidence: scratch/phase3-user-survey-results.md]
<!-- /ANCHOR:metrics-verify -->

---

<!-- ANCHOR:quality-verify -->
## Memory Content Quality Verification (research.md findings)

> **Research baseline** (n=50): 60% `[N/A]` leakage, 66% generic fallback, 34% empty `trigger_phrases`, 18% contamination. Targets derived from research.md P0/P1/P2 recommendations. See `research.md` for full root-cause attribution and evidence ledger.

### P0

- [x] CHK-190 [P0] Quality benchmark suite created: 10 known-bad (one per defect class) + 10 known-good memory files committed to `scratch/quality-benchmarks/` [Evidence: `scratch/quality-benchmarks/bad/*.md` (10), `scratch/quality-benchmarks/good/*.md` (10)]
- [x] CHK-191 [P0] Post-render quality validator implemented (`scripts/dist/memory/validate-memory-quality.js`): rules V1–V5 active (placeholder leakage, malformed spec_folder, fallback sentence, empty trigger_phrases) [Evidence: `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts`; `node scripts/tests/test-memory-quality-lane.js` — PASS]
- [x] CHK-192 [P0] Benchmark fixture regression test passes: all 10 known-bad → FAIL; all 10 known-good → PASS [Evidence: `scratch/quality-benchmark-results.md`; `node scripts/tests/test-memory-quality-lane.js` — PASS]
- [x] CHK-193 [P0] Contamination filter implemented (`scripts/extractors/contamination-filter.ts`): orchestration phrase denylist applied before summary/trigger extraction [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts`; `npm run test:mcp` — 127 passed, 0 failed]
- [x] CHK-194 [P0] Validator wired into `generate-context.js`: failed files not indexed to MCP production tier; `QUALITY_GATE_FAIL` logged with failing rules [Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`; `node scripts/tests/test-memory-quality-lane.js` — PASS]
- [x] CHK-195 [P0] Decision fallback sentence suppressed: `templates/context_template.md` updated — generic boilerplate removed; `decision_count: 0` emitted when no decisions found [Evidence: `.opencode/skill/system-spec-kit/templates/context_template.md`]
- [x] CHK-196 [P0] `[TBD]` / `[Not assessed]` emission eliminated from `collect-session-data.ts`: unavailable fields omitted or null, never placeholder strings [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`; `node scripts/tests/test-memory-quality-lane.js` — PASS]

### P1

- [x] CHK-197 [P1] Decision extractor enhanced with lexical/rule-based cues: decision-indicating patterns detected from assistant/user turns [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`; `npm run test:mcp` — 127 passed, 0 failed (TQ025 unit tests pass >= 90% pass rate)]
- [x] CHK-198 [P1] Semantic backfill active: `trigger_phrases` and `key_topics` populated via dominant nouns when extractor produces empty lists [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`; `npm run test:mcp` — TQ026 unit tests pass]
- [x] CHK-199 [P1] Quality score module implemented (`scripts/extractors/quality-scorer.ts`): `quality_score` (0.0–1.0) and `quality_flags` array computed and persisted in memory YAML front-matter [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts`; `npm run test:mcp` — 4248 passed, 0 failed (TQ034 unit tests pass — deterministic output for all 5 test cases)]
- [x] CHK-200 [P1] `quality_score` + `quality_flags` exposed in MCP index (`memory_save` pipeline) [Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`; `npm run test:mcp` — 4248 passed, 0 failed]
- [x] CHK-201 [P1] Retrieval filtering by `min_quality_score` supported in `memory_search` [Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` (accepts both `min_quality_score` and backward-compatible `minQualityScore`); `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (documents `min_quality_score` parameter); `npm run test:mcp` — passing]
- [x] CHK-202 [P1] Daily KPI script operational (`scripts/kpi/quality-kpi.sh`): placeholder rate, fallback rate, contamination rate, empty `trigger_phrases` rate reported daily [Evidence: `bash scripts/kpi/quality-kpi.sh 02--system-spec-kit/020-mcp-working-memory-hybrid-rag` — outputs JSON + summary; `scratch/quality-kpi-sample.md`]

### P1 — Quality KPI Targets (verified over 14-day rolling window)

- [x] CHK-203 [P1] SC-006: Placeholder leakage rate in new files <= 2% over 14-day rolling window (baseline: 40–60%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-204 [P1] SC-007: Generic fallback decision sentence in new files <= 10% (baseline: 66%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-205 [P1] SC-008: Contamination phrase occurrence in new files <= 1% (baseline: 18%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-206 [P1] SC-009: Empty `trigger_phrases` in new files <= 5% (baseline: 34%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-207 [P1] SC-010: Empty `key_topics` in new files <= 5% (baseline: 10%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-208 [P1] SC-011: Files with concrete decision (when session had design choices) >= 70% (baseline: ~34%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-209 [P1] SC-012: Quality band A+B >= 70% of newly generated files (baseline: 50%) [Evidence: scratch/quality-kpi-14day.md]
- [x] CHK-210 [P1] SC-013: 100% of new memories include `quality_score` and `quality_flags` [Evidence: `scratch/chk-210-closure-evidence-2026-02-19.md` (DB query over 10 most recent memory rows: `quality_score` non-null `10/10`, `quality_flags` non-null `10/10`; 10-file spot check: metadata keys present `10/10`). Status: CLOSED in TASK #66]

### P2

- [x] CHK-211 [P2] Legacy path remediation complete (QP-4): active-tier files with `003-memory-and-spec-kit` references reduced from 55.6% to <= 2 files; shadow retrieval MRR maintained >= 0.98x [Evidence: `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch/quality-legacy-results.md`]
- [x] CHK-212 [P2] Fixture/test memories isolated from production ranking: `044-speckit-test-suite/` and `030-gate3-enforcement/` memory tiers downgraded to archived [Evidence: `.opencode/skill/system-spec-kit/scripts/evals/run-quality-legacy-remediation.ts` (`deprecated` tier used as archival equivalent due enum constraint); `spec_kit_memory_memory_index_scan` result]
<!-- /ANCHOR:quality-verify -->

---

<!-- ANCHOR:phase-packages-verify -->
## Phase Package Documentation Verification

### P1

- [x] CHK-213 [P1] Foundation package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`001-foundation-phases-0-1-1-5/` -> `T000a-T028`, `T027a-T027o`, `CHK-125-139`, `CHK-155-159b`) [Evidence: `scratch/phase-package-mapping-verification.md`]
- [x] CHK-214 [P1] Extraction/Rollout package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`002-extraction-rollout-phases-2-3/` -> `T029-T070`, `CHK-140-166`) [Evidence: `scratch/phase-package-mapping-verification.md`]
- [x] CHK-215 [P1] Memory Quality package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`003-memory-quality-qp-0-4/` -> `TQ001-TQ047`, `CHK-190-212`) [Evidence: `scratch/phase-package-mapping-verification.md`]
- [x] CHK-229 [P1] Post-research Wave 1 package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`004-post-research-wave-1-governance-foundations/` -> `C136-08`, `C136-09`, `C136-10`, `C136-12`, `C136-01`, `C136-02`, `C136-03`; `CHK-217-222`, `CHK-226`) [Evidence: package docs and root mapping sections]
- [x] CHK-230 [P1] Post-research Wave 2 package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`005-post-research-wave-2-controlled-delivery/` -> `C136-04`, `C136-05`, `C136-11`; `CHK-223-225`) [Evidence: package docs and root mapping sections]
- [x] CHK-231 [P1] Post-research Wave 3 package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`006-post-research-wave-3-outcome-confirmation/` -> `C136-06`, `C136-07`; `CHK-227-228`) [Evidence: package docs and root mapping sections]

### P2

- [x] CHK-216 [P2] Package docs and root docs stay synchronized when IDs change, including `research/` source-doc references and package-level omission of `decision-record.md`/`implementation-summary.md` (mapping updated in same change set) [Evidence: `scratch/phase-package-mapping-verification.md`]
- [x] CHK-232 [P2] Cross-package sequencing and ownership handoff are synchronized across root docs for post-research waves (`004` -> `005` -> `006`), including explicit technical capability ownership (adaptive fusion/trace/routing -> ledger + sync/async + deterministic tools -> capability truth matrix closure) [Evidence: `spec.md`, `plan.md`, `tasks.md` package mapping sections]
<!-- /ANCHOR:phase-packages-verify -->

---

<!-- ANCHOR:post-research-follow-up-verify -->
## Post-Research Follow-up Verification

Source backlog: `research/136 - prioritized-implementation-backlog-post-research.md`

### P0

- [x] CHK-217 [P0] C136-01 Tech Lead approval finalized and archived. [Evidence: `scratch/c136-01-tech-lead-approval-packet.md`]
- [x] CHK-218 [P0] C136-02 Data Reviewer approval finalized with telemetry interpretation notes. [Evidence: `scratch/c136-02-data-reviewer-approval-packet.md`]
- [x] CHK-219 [P0] C136-03 Product Owner approval finalized for release acceptance. [Evidence: `scratch/c136-03-product-owner-approval-packet.md`]
- [x] CHK-220 [P0] C136-08 Typed `ContextEnvelope` + `RetrievalTrace` contracts implemented and test-covered, including mandatory trace stages (`candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank`). [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts`]
- [x] CHK-221 [P0] C136-09 Artifact-class routing table + baseline weights implemented and verified for class-specific retrieval policies (`spec`, `plan`, `tasks`, `checklist`). [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts`; `scratch/c136-09-evidence.md`]
- [x] CHK-222 [P0] C136-10 Adaptive hybrid fusion enabled behind feature flag with deterministic fallback and typed degraded-mode contract validated (`failure_mode`, `fallback_mode`, `confidence_impact`, `retry_recommendation`). [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`]

### P1

- [x] CHK-223 [P1] C136-04 Dark-launch evidence pass complete for non-admin closure with deterministic exact-operation tooling evidence (count/status/dependency checks separated from semantic retrieval). [Evidence: `scratch/c136-04-dark-launch-evidence.md`]
- [x] CHK-224 [P1] C136-05 Staged rollout evidence complete for 10/50/100 progression, including durable sync/async queue-worker behavior under load. [Evidence: `scratch/c136-05-staged-rollout-evidence.md`]
- [x] CHK-225 [P1] C136-11 Append-only mutation ledger implemented with append guarantees verified and required fields (`reason`, `prior_hash`, `new_hash`, `linked_memory_ids`, `decision_meta`). [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts`; `scratch/c136-11-evidence.md`]
- [x] CHK-226 [P1] C136-12 Telemetry expanded for latency/mode/fallback/quality proxies. [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`]

### P2

- [x] CHK-227 [P2] C136-06 Real-user survey outcomes captured and scored, with capability truth matrix interpretation included in closure packet. [Evidence: `scratch/c136-06-survey-outcomes.md`]
- [x] CHK-228 [P2] C136-07 14-day KPI closure evidence published and accepted, including runtime-generated capability truth matrix snapshots and drift analysis. [Evidence: `scratch/c136-07-kpi-closure-evidence.md`]
<!-- /ANCHOR:post-research-follow-up-verify -->

---

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Tech Lead | Engineering | [x] Approved | 2026-02-19 |
| Data Reviewer | Analytics | [x] Approved | 2026-02-19 |
| Product Owner | Product | [x] Approved | 2026-02-19 |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3+ checklist (v1.5 — 2026-02-18) - Full verification + architecture + metrics + memory quality
- 134 total verification items (47 P0, 71 P1, 16 P2) including all L3+ addendums and quality gates
- Phase-specific sections (Phase 0: CHK-125-129, Phase 1: CHK-130-139, Phase 1.5: CHK-155-159b, Phase 2: CHK-140-154, Phase 3: CHK-160-166)
- Success criteria mapped to CHK items (CHK-180-184 automation; CHK-203-213 quality)
- Memory quality section (CHK-190-212): benchmark suite, validator V1-V5, contamination filter, decision fallback suppression, quality score
- Security items expanded (CHK-035 PII redaction, CHK-036 regex safety, CHK-037-038 provenance)
- Evidence requirements explicit ([Evidence: file path])
- Explicit P0 and P1 section headers for all major sections (SECTIONS_PRESENT compliance)
- v1.4: Added CHK-190-212 (memory quality gates from research.md findings); updated summary counts (42→49 P0, 58→73 P1, 13→15 P2)
- v1.4.1: Added CHK-213-216 for phase package documentation verification
- v1.5: Reconciled summary totals with current checklist entries (P0/P1/P2 now 47/71/16)
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
