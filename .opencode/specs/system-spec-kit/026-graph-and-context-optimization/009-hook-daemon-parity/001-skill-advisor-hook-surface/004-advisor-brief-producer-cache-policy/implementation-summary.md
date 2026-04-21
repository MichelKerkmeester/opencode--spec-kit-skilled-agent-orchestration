---
title: "Implementation Summary: Advisor Brief Producer + Cache Policy"
description: "020/004 shipped buildSkillAdvisorBrief() with prompt policy, HMAC exact cache, subprocess fail-open, typed AdvisorHookResult, tests, latency benches, and privacy audit."
trigger_phrases:
  - "020 004 summary"
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy"
    last_updated_at: "2026-04-19T15:33:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Shipped advisor brief producer orchestration core"
    next_safe_action: "Dispatch child 005 renderer + parity harness"
    blockers: []
    key_files: []

---
# Implementation Summary: Advisor Brief Producer + Cache Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Placeholder.** Populated after `/spec_kit:implement :auto` converges.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-advisor-brief-producer-cache-policy |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessors** | `../002-shared-payload-advisor-contract/`, `../003-advisor-freshness-and-source-cache/` |
| **Position in train** | 3 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Shipped `buildSkillAdvisorBrief(prompt, options)` as the Phase 020 orchestration core. The producer now evaluates prompt policy, canonical-folds prompt text, checks the exact HMAC cache, probes advisor freshness, invokes `skill_advisor.py` with fail-open subprocess semantics, renders a compact producer brief, wraps typed advisor metadata in the shared payload envelope, and returns `AdvisorHookResult`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts` | Created | Prompt firing policy, NFKC canonical fold, metalinguistic skill mention extraction |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts` | Created | 5-minute exact HMAC prompt cache with session-scoped secret and source-signature invalidation |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts` | Created | `python3 skill_advisor.py` subprocess runner with 1000 ms timeout, strict JSON parse, SIGKILL, and SQLite-busy retry |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts` | Created | `buildSkillAdvisorBrief()` orchestration, typed result/diagnostics/metrics, envelope wrapping, token caps, deleted-skill suppression |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-policy.vitest.ts` | Created | Prompt policy unit coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts` | Created | TTL, source-signature invalidation, and HMAC opacity coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts` | Created | Timeout, parse failure, SQLite-busy retry, and missing script coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts` | Created | 10 acceptance scenarios plus unavailable freshness and privacy diagnostics |
| `spec.md` | Updated | Synced non-live freshness posture and removed stale 60-token-floor/options drift |
| `plan.md` | Updated | Synced token cap wording |
| `tasks.md` | Updated | Marked T001-T028 complete with evidence |
| `checklist.md` | Updated | Marked all verification items complete with evidence |
| `implementation-summary.md` | Updated | Captured delivery, files changed, benchmarks, and privacy audit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation followed the predecessor contracts from 002 (`createSharedPayloadEnvelope({ producer: 'advisor' })`) and 003 (`getAdvisorFreshness()`). The public producer options intentionally stay narrow: `workspaceRoot`, `runtime`, optional `maxTokens`, and optional `thresholdConfig`.

The stale checked-in 60-token floor was removed from packet docs and code. Producer output enforces an 80-token default and a 120-token hard cap, with no similarity cache and no raw-prompt persistence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Public `SkillAdvisorBriefOptions` stays narrow; freshness and cache internals are owned by the producer.
- Non-live freshness follows the final Phase 020/004 mapping: stale remains `ok` with a stale badge, absent is `skipped`, unavailable is `degraded`, and subprocess timeout is `fail_open`.
- Cache reuse is exact HMAC only. Deleted skills invalidate cached entries and force a fresh advisor run instead of rendering stale labels.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| `advisor-prompt-policy.vitest.ts` | PASS | 6/6 |
| `advisor-prompt-cache.vitest.ts` | PASS | 3/3 |
| `advisor-subprocess.vitest.ts` | PASS | 5/5 |
| `advisor-brief-producer.vitest.ts` | PASS | 12/12 |
| Combined advisor suite | PASS | `npx vitest run tests/advisor-prompt-policy.vitest.ts tests/advisor-prompt-cache.vitest.ts tests/advisor-subprocess.vitest.ts tests/advisor-brief-producer.vitest.ts` — 26/26 |
| TypeScript | PASS | `npx tsc --noEmit` |
| Warm-cache producer p95 | PASS | 0.452 ms (30 samples) |
| Cold subprocess producer p95 | PASS | 58.373 ms (30 samples) |
| Privacy audit | PASS | `rg -n "secret customer token prompt" ...` found no matches |
| Strict spec validation | PASS | `validate.sh ... --strict --no-recursive` returned errors=0, warnings=0 |

Strict spec validation:

```text
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Child 005 owns the full renderer and parity harness. The current producer includes a compact placeholder renderer only to provide typed `brief` output for downstream tests.
- The Python advisor still owns ranking; this packet intentionally did not modify `skill_advisor.py`.
<!-- /ANCHOR:limitations -->
