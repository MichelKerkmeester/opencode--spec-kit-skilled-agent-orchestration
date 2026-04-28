---
title: "008-skill-graph-daemon-and-advisor-unification implementation summary"
description: "Phase 027 shipped the skill-graph daemon, derived metadata, native advisor, MCP tools, compatibility shims, and promotion gates."
trigger_phrases:
  - "026/008/008 implementation summary"
  - "advisor daemon shipped"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification"
    last_updated_at: "2026-04-28T15:30:03Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Shipped implementation preserved; strict validation follow-up still pending"
    next_safe_action: "Run strict validation follow-up and close the remaining checklist items"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-skill-graph-daemon-and-advisor-unification |
| **Completed** | 2026-04-20 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 027 shipped a unified advisor architecture across seven child packets. The work moved durable advisor behavior into the system-spec-kit MCP server while preserving legacy Python and plugin caller compatibility.

Primary artifact roots include `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, and `.opencode/plugins/spec-kit-skill-advisor.js`.

### Delivered Areas

| Area | Delivered |
|------|-----------|
| Validator prerequisite | Node-compatible validator migration for downstream checks. |
| Daemon freshness | Watcher, single-writer lease, generation freshness, and benchmark gate. |
| Derived metadata | Provenance, trust lanes, lifecycle normalization, schema v2 additivity. |
| Native scorer | TypeScript scorer with five-lane fusion and regression-protection parity. |
| MCP surface | Advisor recommendation, status, and validation tools. |
| Compatibility | Python and plugin shims routed to native advisor behavior. |
| Promotion gates | Shadow-cycle and gate bundle for learned and semantic influence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation was delivered through child packets in dependency order: validator prerequisite, daemon freshness, lifecycle metadata, native scorer, MCP surface, compatibility/bootstrap, and promotion gates. The parent packet records the dependency order, decisions, and convergence evidence.

### Children Convergence Log

| # | Child | Convergence |
|---|-------|-------------|
| 001 | validator ESM fix | Shipped on 2026-04-20, SHA `77b0f59e2`. |
| 002 | daemon freshness foundation | Shipped on 2026-04-20, SHA `32fd9197c`. |
| 003 | lifecycle and derived metadata | Shipped on 2026-04-20, SHA `8318dfaf8`. |
| 004 | native advisor core | Shipped on 2026-04-20, SHAs `1146faeec` and `e35f93b52`. |
| 005 | MCP advisor surface | Shipped on 2026-04-20, SHA `08bd30145`. |
| 006 | compatibility migration and bootstrap | Shipped on 2026-04-20, SHA `a61547796`. |
| 007 | promotion gates | Shipped on 2026-04-20, SHA `5696acf4a`. |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Chokidar plus hash-aware SQLite indexer | Keeps graph freshness incremental and cross-platform. |
| Self-contained MCP advisor package | Gives the advisor a clear ownership boundary. |
| Five-lane fusion with semantic shadow | Improves deterministic scoring without unproven prompt-time semantic latency. |
| Additive schema migration | Preserves rollback and author-authored metadata. |
| Regression-protection parity | Protects Python-correct decisions while allowing native improvements. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Child shipment | PASS; children convergence log records shipped SHAs and measured outcomes. |
| Native scorer | PASS; TypeScript scorer preserved Python-correct behavior and improved corpus accuracy during shipment. |
| Promotion policy | PASS; semantic lane remains shadow-only until promotion gates pass. |
| 2026-04-28 release remediation | PASS; unavailable fail-open, trusted scan gate, live DB recovery, rebuild serialization, diagnostic redaction, lane registry, compat contract, and response envelope regressions pass. |
| 2026-04-28 strict validation | PASS; parent packet validation re-run during release remediation. |
<!-- /ANCHOR:verification -->

---

### Sub-phase summaries

### 001-validator-esm-fix
**Status:** Complete (2026-04-20, SHA `77b0f59e2`). Migrated `.opencode/skill/system-spec-kit/scripts/` from CommonJS to pure ESM. Changes: flipped `package.json` `"type"` to `"module"`, added `esm-entry.ts` helpers (`isMainModule`, `dirnameFromImportMeta`), converted 16 entrypoint guards from `require.main === module`, converted 4 `require()` assignments, replaced `__dirname` with `dirnameFromImportMeta`, added `.js` suffixes to relative TS imports, updated `validate.sh` to use `--import tsx` loader fallback on Node 20.19.5. Post-migration: Node 25 and Node 20.19.5 both reach ordinary validation failures without CJS/ESM SyntaxError. 98 files changed total.

### 002-daemon-freshness-foundation
**Status:** Complete (2026-04-20, SHA `32fd9197c`). Shipped 11 files under `mcp_server/skill_advisor/`: daemon watcher (`watcher.ts` — Chokidar narrow-scope, 2s+1s debounce, hash-aware reindex, ENOENT tolerance), single-writer lease (`lease.ts` — SQLite heartbeat, stale-lease reclaim, SQLITE_BUSY backoff), lifecycle (`lifecycle.ts` — SIGTERM, `unavailable` on exit). Freshness: `generation.ts` (generation-tagged snapshots), `trust-state.ts` (live/stale/absent/unavailable), `rebuild-from-source.ts` (corrupted SQLite recovery), `cache-invalidation.ts`. Track H hardening: reindex-storm circuit breaker, malformed SKILL.md quarantine, partial-write resilience (atomic rename), SQLITE_BUSY retry. Benchmark gate: idle CPU 0.031% / RSS delta 5.516MB (gate ≤1% CPU / <20MB delta).

### 003-lifecycle-and-derived-metadata
**Status:** Complete (2026-04-20, SHA `8318dfaf8`). Shipped derived extraction from SKILL.md author metadata, headings, body n-grams, examples, references, assets filenames, graph intent_signals, prior derived.source_docs/key_files. Schema-v2 `graph-metadata.json.derived` with provenance fingerprints, source/key file tracking, lifecycle status, redirects, trust lane, `sanitizer_version`. Additive v1→v2 migration + rollback stripping `derived`. Lifecycle routing: derived-lane-only age/status haircuts, asymmetric supersession, `z_archive`/`z_future` indexed-but-not-default-routable. Anti-stuffing caps, DF/IDF corpus stats. Tests: 13 tests PASS. Watcher→reindex→derived refresh→generation bump pipeline verified under 10s window.

### 004-native-advisor-core
**Status:** Complete (2026-04-20, SHAs `1146faeec` + `e35f93b52`). Shipped native TS scorer under `mcp_server/skill_advisor/lib/scorer/` with 5-lane fusion: `explicit_author` (0.45), `lexical` (0.30), `graph_causal` (0.15), `derived_generated` (0.15), `semantic_shadow` (0.00 shadow-only). Projection reads `skill_nodes`/`skill_edges` from SQLite when available, falls back to `graph-metadata.json`. ADR-007: parity semantics = regression-protection parity (not exact-match). Results: 120/120 Python-correct preserved with 0 regressions; TS full-corpus 161/200 (80.5%); stratified holdout 31/40 (77.5%); explicit-skill no-regression/no-abstain PASS. Bench: cached p95 6.989ms, uncached p95 11.45ms.

### 005-mcp-advisor-surface
**Status:** Complete (2026-04-20, SHA `08bd30145`). Added `advisor_recommend`, `advisor_status`, `advisor_validate` MCP tools registered in existing dispatcher. `advisor_recommend`: strict input schema, calls `scoreAdvisorPrompt()`, uses HMAC prompt cache, sanitizes labels/redirect metadata/lifecycle status before output. `advisor_status`: reads generation metadata + trust-state, returns daemon PID/errors/scan time/skill count/lane weights. `advisor_validate`: runs measured corpus/holdout/parity/safety/latency slices. Privacy: no raw prompt text returned; PII-shaped content, unsafe labels, and prompt-derived evidence stripped. Handler tests: 167 tests PASS post legacy-test consolidation.

### 006-compat-migration-and-bootstrap
**Status:** Complete (2026-04-20, SHA `a61547796`). Shipped Python shim routing: `skill_advisor.py` now probes native advisor MCP status via `daemon-probe.ts`, delegates to `advisor_recommend` when available, falls back to Python scorer with `--force-local` bypass or `--force-native` hard-require flags. OpenCode plugin bridge (`spec-kit-skill-advisor-bridge.mjs`) mirrors native delegation. Gate 7 carry-over closed: Python scorer now routes `/spec_kit:plan` to `command-spec-kit` (kind:command) and `/memory:save this context` to `command-memory-save` (kind:command). Regression suite: 52/52 PASS. `daemon-probe.ts` maps freshness live/stale→available, absent/unavailable→unavailable. Docs: skill-advisor-native-bootstrap install guide (`.opencode/skill/system-spec-kit/install_guide/`), manual testing playbook (NC-001 through NC-005 + H5 scenarios).

### 007-promotion-gates
**Status:** Complete (2026-04-20, SHA `5696acf4a`). Promotion gates are exposed through measured `advisor_validate` slices: full-corpus top-1, stratified holdout, UNKNOWN target, gold-`none` no-increase, explicit-skill no-regression, ambiguity stability, derived-lane attribution, adversarial-stuffing rejection, latency, regression-suite, and semantic-lock. Semantic lane remains locked at 0.00 shadow-only until promotion gates pass; candidate learned/adaptive weight deltas bounded. Any gate failure produces a named failed slice for audit. Tests: 93/93 PASS (pre-consolidation) → 167/167 post legacy-test consolidation. Python regression 52/52.

<!-- ANCHOR:limitations -->
## Known Limitations

1. Semantic scoring remains shadow-only until future promotion evidence exists.
2. Compatibility shims remain supported until a future deprecation packet replaces them.
3. This 2026-04-21 pass repairs documentation parity and validation shape; it does not reopen shipped implementation scope.
<!-- /ANCHOR:limitations -->
