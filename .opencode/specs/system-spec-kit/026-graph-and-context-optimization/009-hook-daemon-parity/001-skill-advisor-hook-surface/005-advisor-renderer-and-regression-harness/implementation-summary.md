---
title: "...hook-daemon-parity/001-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/implementation-summary]"
description: "020/005 hard gate shipped: pure renderer, 10 fixtures, 5 advisor harnesses, metrics/privacy contract, 200/200 parity, cache-hit p95 gate, and gate-lift confirmation."
trigger_phrases:
  - "020 005 summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
    last_updated_at: "2026-04-19T15:51:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented renderer, fixtures, observability, parity, timing, and privacy harnesses"
    next_safe_action: "Dispatch 020/006 Claude hook wiring"
    blockers: []
    key_files: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Advisor Renderer + 200-Prompt Regression Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Gate lifted.** Children 006, 007, and 008 may proceed from this shared renderer + regression-harness baseline.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-advisor-renderer-and-regression-harness |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessor** | `../004-advisor-brief-producer-cache-policy/` |
| **Position in train** | 4 of 8 (HARD GATE) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the 020/005 hard gate as a shared trust-boundary package:

- Pure `renderAdvisorBrief(result, options)` in `render.ts`; it emits only freshness, confidence, uncertainty, and a canonical-folded sanitized skill label.
- `NormalizedAdvisorRuntimeOutput` plus runtime normalizer aliases for later 006/007/008 adapter parity checks.
- `speckit_advisor_hook_*` metric definitions, diagnostic JSONL schema helpers, alert-threshold env overrides, and an `advisor-hook-health` section builder.
- 10 JSON fixtures covering live, stale, no-passing, fail-open, skipped, ambiguity, Unicode instruction labels, empty prompts, command-only prompts, and prompt-poisoning input.
- Five Vitest harnesses: renderer, observability, 200-prompt corpus parity, timing/cache gates, and privacy audit.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts` | Created | Pure model-visible advisor renderer + label sanitizer |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts` | Created | Runtime-neutral comparator type and normalizer |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts` | Created | Metrics namespace, diagnostic JSONL schema, alert thresholds, health section |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/*.json` | Created | 10 canonical renderer/privacy fixtures |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts` | Created | Renderer snapshot + sanitization harness |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts` | Created | Metric, label, JSONL, env, and health-section contract tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts` | Created | 200-prompt direct CLI vs hook top-1 parity harness |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts` | Created | 4-lane timing harness + corrected 30-turn replay gate |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts` | Created | Raw-prompt absence audit across serialized surfaces |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Updated | Contract, checklist, task, and verification evidence alignment |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The renderer was kept deliberately separate from predecessor 004's producer formatter because 005 owns the shared trust boundary and regression harness, while 006/007/008 own runtime adapter wiring. Corpus parity compares direct CLI batch output against `buildSkillAdvisorBrief()` hook-path output for every corpus row.

**Gate-lift declaration**: 006/007/008 are unblocked as of 2026-04-19 after the five advisor suites, scoped TypeScript check, and strict spec validation passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Inherits ADR-002 + ADR-003 from parent. This child embodies the "renderer-first" principle (research-extended §Executive Summary): no runtime adapter renders advisor content before the shared renderer + harness land.

- The renderer returns `null` for `skipped`, `degraded`, `fail_open`, `absent`, `unavailable`, empty recommendations, and failed label sanitization.
- Ambiguous top-two rendering is only enabled through the 120-token path; default output stays single-skill and under the 80-token cap.
- Observability is represented as a shared contract module rather than runtime-handler wiring; runtime integration remains owned by 006/007/008.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Renderer suite | PASS | `node mcp_server/node_modules/vitest/vitest.mjs run ...advisor-renderer.vitest.ts...` included in 5-suite run; 20/20 total tests passed across suites |
| Observability suite | PASS | Metric names, label enums, diagnostic JSONL, forbidden fields, env thresholds, and `advisor-hook-health` passed |
| Corpus parity | 200/200 PASS | `advisor-corpus-parity.vitest.ts` passed against 200-line 019/004 corpus |
| Timing cache-hit p95 | PASS | cache-hit p95 = 0.016 ms |
| Replay hit rate | PASS | 20/30 hits = 66.7% |
| Privacy audit | PASS | Sensitive prompt literals absent from envelope, metrics, diagnostic JSONL, health, and cache-key surfaces |
| TypeScript | PASS | `npx tsc --noEmit --composite false -p mcp_server/tsconfig.json` exited 0 |

### Timing Bench

| Lane | p50 ms | p95 ms | p99 ms | Gate |
|------|--------|--------|--------|------|
| Cold subprocess lane | 0.010 | 0.052 | 0.999 | Diagnostic only |
| Warm subprocess lane | 0.010 | 0.019 | 0.022 | Diagnostic only |
| Cache hit lane | 0.007 | 0.016 | 0.021 | PASS: ≤ 50 ms |
| Cache miss lane | 0.009 | 0.018 | 0.020 | Diagnostic only |

### Commands Run

```bash
node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/advisor-renderer.vitest.ts mcp_server/tests/advisor-observability.vitest.ts mcp_server/tests/advisor-timing.vitest.ts mcp_server/tests/advisor-privacy.vitest.ts mcp_server/tests/advisor-corpus-parity.vitest.ts --config mcp_server/vitest.config.ts
node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/advisor-timing.vitest.ts --config mcp_server/vitest.config.ts --reporter verbose
npx tsc --noEmit --composite false -p mcp_server/tsconfig.json
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The timing harness uses mocked subprocess/freshness dependencies to make cache-path gates deterministic in CI. It verifies producer cache behavior and records lane statistics, but does not benchmark actual Python subprocess wall time.
- Full workspace `npm run --workspaces=false typecheck:root` still reports existing `scripts/` `import.meta` module-setting errors outside this child scope. The MCP server package containing the new production modules typechecks cleanly.
<!-- /ANCHOR:limitations -->
