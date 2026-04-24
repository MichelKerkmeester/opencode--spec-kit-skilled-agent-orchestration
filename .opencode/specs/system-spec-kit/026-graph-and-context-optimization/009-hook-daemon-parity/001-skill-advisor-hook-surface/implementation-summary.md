---
title: "...-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/implementation-summary]"
description: "Phase 020 complete: cross-runtime advisor hook surface shipped across Claude/Gemini/Copilot/Codex with 4-runtime parity, 200/200 corpus parity, cache-hit p95 0.016ms, hit rate 66.7%, DQI 97 reference doc."
trigger_phrases:
  - "026/009/001 implementation summary"
  - "skill advisor hook summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface"
    last_updated_at: "2026-04-21T15:42:05Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Already shipped"
    next_safe_action: "Keep validation green"
    completion_pct: 100
    dispatch_policy: "cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Skill-Advisor Hook Surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Release ready.** All 8 implementation children converged; T9 integration gauntlet PASS.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-skill-advisor-hook-surface |
| **Completed** | 2026-04-19 |
| **Level** | 3 |
| **Child Layout** | `001-initial-research` (converged); `002-shared-payload-advisor-contract`; `003-advisor-freshness-and-source-cache`; `004-advisor-brief-producer-cache-policy`; `005-advisor-renderer-and-regression-harness` (HARD GATE); `006-claude-hook-wiring`; `007-gemini-copilot-hook-wiring`; `008-codex-integration-and-hook-policy`; `009-documentation-and-release-contract` |
| **Predecessor** | 019-system-hardening (shipped 2026-04-19, incl. 019/004 routing-accuracy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Cross-runtime proactive skill-advisor hook surface. Each `UserPromptSubmit` event in Claude, Gemini, Copilot, and Codex runtimes runs `buildSkillAdvisorBrief(prompt, {runtime})` which returns a typed `AdvisorHookResult` rendered to the model as `hookSpecificOutput.additionalContext` (JSON transport) or wrapper-preamble (fallback). Brief emits a sanitized skill recommendation with freshness/confidence/uncertainty fields; fail-open contract returns `{}` (no-op) on any error.

Component stack (landed on main; commits listed in Dispatch Log):

- **020/002 shared-payload advisor contract** — extends `lib/context/shared-payload.ts` with `advisor` producer + skill-inventory/skill-graph/advisor-runtime source kinds, `AdvisorEnvelopeMetadata` type, producer-gated metadata, privacy rejection for prompt-derived provenance (`kind:user-prompt`, unanchored `sha256:*`).
- **020/003 freshness + source cache** — `lib/skill-advisor/freshness.ts` (`getAdvisorFreshness()`), `source-cache.ts` (15-min LRU), `generation.ts` (atomic counter + corrupt recovery). Per-skill fingerprints, generation-tagged snapshots, JSON-fallback always-stale.
- **020/004 brief producer + cache + subprocess** — `prompt-policy.ts` (NFKC canonical fold, fire/skip rules), `prompt-cache.ts` (5-min HMAC exact cache), `subprocess.ts` (`python3 skill_advisor.py` runner with SQLITE_BUSY retry + SIGKILL timeout), `skill-advisor-brief.ts` orchestration.
- **020/005 renderer + 200-prompt parity harness [HARD GATE]** — `render.ts` pure renderer with whitelist fields + canonical-fold sanitization + instruction-regex deny, `normalize-adapter-output.ts` cross-runtime comparator, `metrics.ts` observability contract (`speckit_advisor_hook_*`, `AdvisorHookDiagnosticRecord` JSONL, `advisor-hook-health` session section), 10 canonical fixtures + 5 test harnesses (renderer/observability/corpus-parity/timing/privacy).
- **020/006 Claude hook** — `hooks/claude/user-prompt-submit.ts` via JSON `hookSpecificOutput.additionalContext`; registered in `.claude/settings.local.json`.
- **020/007 Gemini + Copilot hooks** — `hooks/gemini/user-prompt-submit.ts` (JSON additionalContext), `hooks/copilot/user-prompt-submit.ts` (SDK `onUserPromptSubmitted` preferred, wrapper-fallback when SDK local-unavailable). Wrapper explicitly rejects notification-only `{}` as model-visible.
- **020/008 Codex integration** — `lib/codex-hook-policy.ts` dynamic detector (500ms probes → live/partial/unavailable), `hooks/codex/user-prompt-submit.ts` (stdin-canonical, argv-fallback), `hooks/codex/pre-tool-use.ts` (Bash-only deny from `.codex/policy.json`; PostToolUse is audit-only), `hooks/codex/prompt-wrapper.ts` fallback. Parity test extended to 4 runtimes.
- **020/009 documentation + release contract** — 650-line reference doc (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, DQI 97/100) with capability matrix + failure-mode playbook + observability contract + performance budgets + migration notes + concurrency + disable flag + privacy contract + troubleshooting; validation playbook; CLAUDE.md §Gate 2 update; 4 runtime READMEs.

Live dogfood: the Claude hook fired in the orchestrating session itself during T5-T10 — observed `Advisor: stale; use cli-codex 0.95/0.15 pass` (and later `sk-doc`, `cli-claude-code`) context injections matching the prompt topic.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three-wave research + 8-child implementation train + integration gauntlet + release sign-off. Full critical path executed in ~6 hours of autonomous orchestration on 2026-04-19.

**Research (020/001):**
- Wave 1: cli-codex gpt-5.4 high fast, 10 iterations → converged 2026-04-19T08:30Z
- Wave 2 (extended): cli-copilot gpt-5.4 high, 10 iterations → converged 2026-04-19T09:15Z
- Wave 3 (validation): cli-copilot gpt-5.4 high, 13 iterations early-convergence → 2026-04-19T10:53Z, delivered 1 P0 + 9 P1 patches that landed before implementation.

**Implementation (020/002-009):** 10-campaign battle plan (see `battle-plan.md`). Executor policy: **cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback**. Orchestrator = Claude Opus 4.7 (1M context). Each campaign: pre-flight verify → dispatch codex via `codex exec --model gpt-5.4 -c model_reasoning_effort=high -c service_tier=fast -c approval_policy=never --sandbox workspace-write` → monitor background → verify tests/tsc/validate independently → commit (orchestrator; codex sandbox blocks git) → TaskUpdate → next.

**Pattern reuse from code-graph:** the advisor hook mirrors `buildStartupBrief()` in `lib/code-graph/` — same freshness vocabulary (live/stale/absent/unavailable), same envelope shape, same pure-renderer boundary. The 005 HARD GATE parity harness reuses the 019/004 200-prompt corpus. NFKC normalization comes from Phase 019/003 `shared/unicode-normalization.ts`.

**Verification gate structure:** 005 HARD GATE blocked 006-008 runtime adapters until 200/200 parity + cache-hit p95 + 66.7% hit rate all converged. 006 had to land before parallel 007+008 could target `advisor-runtime-parity.vitest.ts` (to avoid shared-file race). 009 docs closed the train.

**Dispatch pattern (all 8 children):** codex exec in background → Monitor task for test/validate signals → independent re-run of tests by orchestrator → 2 conventional commits per packet (feat for src+tests, docs for spec folder updates) → TaskUpdate + next dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

See `decision-record.md` for ADR-001 (research-first), ADR-002 (pattern reuse), ADR-003 (fail-open).

Additional decisions populated as implementation proceeds.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**T9 Integration Gauntlet (2026-04-19T17:48Z) — PASS.**

| Gate | Result | Evidence |
|------|--------|----------|
| Phase 020 vitest (all 020 suites) | PASS | 19 files / 118 tests / 16.12s |
| `npx tsc --noEmit` mcp_server | PASS | exit 0 |
| validate.sh --strict per-child (8 children) | PASS | 0 errors across all; 002 has 1 pre-existing warning |
| validate.sh --strict 020 parent | PASS | 0 errors; 5 pre-existing template-header warnings |
| 200-prompt corpus parity (005 HARD GATE) | PASS | 200/200 top-1 match via `advisor-corpus-parity.vitest.ts` |
| 4-runtime parity (5 fixtures × Claude/Gemini/Copilot/Codex) | PASS | identical `additionalContext` after transport normalization |
| Cache-hit lane p95 (gate ≤ 50 ms) | PASS | 0.016 ms (bench in 005 + T8 reference doc) |
| 30-turn replay cache hit rate (gate ≥ 60%) | PASS | 66.7% (10 unique + 20 repeats corrected trace from wave-3 P0 patch) |
| Privacy audit (raw prompt absence) | PASS | zero hits across envelope sources, metrics labels, stderr JSONL, session_health, cache keys |
| Disable flag smoke | PASS | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` short-circuits producer; verified in 006 suite |
| Reference doc DQI (target ≥ 85) | PASS | `extract_structure.py` returned DQI 97 |

**Out-of-gauntlet (pre-existing, not Phase 020):** 2 non-020 test failures reproduce without any Phase 020 code (confirmed via targeted stash test):
- `transcript-planner-export.vitest.ts`: missing fixture file in 026/015 scratch folder
- `deep-loop/prompt-pack.vitest.ts`: `state_paths_delta_pattern` variable missing

These are documented as out-of-scope; they do not block Phase 020 release.

**Cross-references:** 005 `implementation-summary.md` (bench tables, parity harness), `advisor-corpus-parity.vitest.ts`, `advisor-runtime-parity.vitest.ts`, `advisor-timing.vitest.ts`, `advisor-privacy.vitest.ts`, 020/009 reference doc (§5 observability contract, §6 performance budgets, §9 disable flag, §10 privacy contract).
<!-- /ANCHOR:verification -->

---

### Dispatch Log

| Timestamp (UTC) | Event | Child | Repo SHA (HEAD) | Notes |
|-----------------|-------|-------|-----------------|-------|
| 2026-04-19T06:40:00Z | Charter scaffolded | — | b960887db | Level 3 umbrella, research-first per ADR-001 |
| 2026-04-19T06:50:00Z | 020/001 scaffolded | 020/001-initial-research | (see commits) | — |
| 2026-04-19T07:00:00Z | 020/001 wave-1 dispatch | 020/001-initial-research | (see commits) | cli-codex gpt-5.4 high fast, 10 iterations |
| 2026-04-19T08:30:00Z | 020/001 wave-1 converged | 020/001-initial-research | 0715ac5d0 | 10 iter, research synthesis written |
| 2026-04-19T08:45:00Z | 020/001/002 wave-2 dispatch | 020/001-initial-research/002-extended-wave-copilot | (see commits) | cli-copilot gpt-5.4 high, 10 iterations |
| 2026-04-19T09:15:00Z | 020/001/002 wave-2 converged | 020/001-initial-research/002-extended-wave-copilot | (see commits) | 10 iter, extended research synthesis written |
| 2026-04-19T09:30:00Z | Children 002-009 scaffolded | 020/002-009 | (pending commit) | 56 new files + metadata; ADR-004 recorded handoff |
| 2026-04-19T10:00:00Z | 020/001/003 wave-3 dispatch | 020/001-initial-research/003-implementation-plan-validation-copilot | (see commits) | cli-copilot gpt-5.4 high, 20-iter budget, validation of 8-child scaffold |
| 2026-04-19T10:53:06Z | 020/001/003 wave-3 converged (early) | 020/001-initial-research/003-implementation-plan-validation-copilot | (see commits) | 13 iter (rolling avg 0.0367 < 0.05), all V1-V10 answered, 1 P0 found in 005, 9 P1 patches recommended |
| 2026-04-19T11:00:00Z | Wave-3 synthesis written | — | (pending commit) | research-validation.md, 111 lines, per-child delta + severity action list |
| 2026-04-19T11:05:00Z | Wave-3 artifact folder renamed | — | (pending commit) | `research/020-skill-advisor-hook-surface-pt-03/` per new short-name convention |
| 2026-04-19T11:20:00Z | Wave-3 P0 patch landed | 020/005-advisor-renderer-and-regression-harness | (pending commit) | Replaced impossible ≥60% cache-hit gate on "20 unique + 10 repeats" (= 33.3%) with mathematically consistent "10 unique + 20 repeats" (= 66.7% nominal ≥ 60% with flake margin); restated 50 ms p95 as cache-hit-lane-only gate; updated spec/plan/tasks |
| 2026-04-19T11:30:00Z | Wave-3 P1 patches landed (9 items) | 020/003,004,005,007,008,009 | (pending commit) | 003: generation.json malformed recovery; 004: removed semanticMode + 60-token-floor, pinned non-live branches; 005: 3 new fixtures (skip-policy + X5) + observability contract tightening (JSONL schema + label catalog + alert thresholds); 007: Copilot SDK merge gate + Gemini schema-version matrix + brief:null no-emit + wrapper privacy; 008: PostToolUse audit/repair slice + stdin/argv precedence; 009: validation playbook + prompt-artifact privacy contract |
| 2026-04-19T11:40:00Z | All 6 patched children validate.sh --strict | 003/004/005/007/008/009 | (pending commit) | 0 errors, pre-existing warnings only (RELATED DOCUMENTS custom header + implementation-summary verification baseline — same as pre-patch state) |
| 2026-04-19T13:05:00Z | T1 complete: 020/002 implementation | 020/002-shared-payload-advisor-contract | 9c5fa135b4 | Shared-payload advisor contract shipped; summary populated |
| 2026-04-19T09:30:00Z | T2 complete: 020/003 implementation | 020/003-advisor-freshness-and-source-cache | 5f081f71e9 | Freshness, source cache, generation counter, corrupt recovery |
| 2026-04-19T15:33:00Z | T3 complete: 020/004 implementation | 020/004-advisor-brief-producer-cache-policy | 25c8976e98 | Producer, HMAC cache, subprocess fail-open |
| 2026-04-19T15:51:00Z | T4 complete: 020/005 HARD GATE | 020/005-advisor-renderer-and-regression-harness | e19bf2e213 | 200/200 corpus parity, cache-hit p95 0.016 ms, replay hit rate 66.7% |
| 2026-04-19T14:04:00Z | T5 complete: 020/006 implementation | 020/006-claude-hook-wiring | 6d4b41a9f6 | Claude UserPromptSubmit registered and tested |
| 2026-04-19T14:25:00Z | T6 complete: 020/007 implementation | 020/007-gemini-copilot-hook-wiring | 11ad3e8a5f | Gemini + Copilot hooks and parity shipped |
| 2026-04-19T16:40:00Z | T7 complete: 020/008 implementation | 020/008-codex-integration-and-hook-policy | 8dc1bd065b | Codex adapter and parity shipped; `.codex` registration snippets deferred |
| 2026-04-19T14:51:54Z | T8 complete: 020/009 implementation | 020/009-documentation-and-release-contract | workspace | Reference doc DQI 97, validation playbook, CLAUDE.md and runtime READMEs updated |
| 2026-04-19T17:48:00Z | T9 complete: integration gauntlet | 020 release train | 6750934d7 | Full suite + tsc + validate per-child all PASS; 2 pre-existing non-020 failures documented as out-of-scope |
| 2026-04-19T18:00:00Z | T10 complete: release sign-off | 020 release train | (this commit) | Parent implementation-summary populated; all 8 children converged; ready for release |

---

### Children Convergence Log

| Child | Status | Converged at | Evidence |
|-------|--------|--------------|----------|
| 001-initial-research | Converged | 2026-04-19T08:30Z (wave-1) + 2026-04-19T09:15Z (wave-2) + 2026-04-19T10:53Z (wave-3) | Research synthesis under ../research/020-skill-advisor-hook-surface-pt-01/, .../001-skill-advisor-hook-surface-pt-02/, .../001-skill-advisor-hook-surface-pt-03/ |
| 002-shared-payload-advisor-contract | Converged | 2026-04-19T13:05Z | [implementation-summary.md](002-shared-payload-advisor-contract/implementation-summary.md) |
| 003-advisor-freshness-and-source-cache | Converged | 2026-04-19T09:30Z | [implementation-summary.md](003-advisor-freshness-and-source-cache/implementation-summary.md) |
| 004-advisor-brief-producer-cache-policy | Converged | 2026-04-19T15:33Z | [implementation-summary.md](004-advisor-brief-producer-cache-policy/implementation-summary.md) |
| 005-advisor-renderer-and-regression-harness | Converged | 2026-04-19T15:51Z | [implementation-summary.md](005-advisor-renderer-and-regression-harness/implementation-summary.md) |
| 006-claude-hook-wiring | Converged | 2026-04-19T14:04Z | [implementation-summary.md](006-claude-hook-wiring/implementation-summary.md) |
| 007-gemini-copilot-hook-wiring | Converged | 2026-04-19T14:25Z | [implementation-summary.md](007-gemini-copilot-hook-wiring/implementation-summary.md) |
| 008-codex-integration-and-hook-policy | Converged with documented config deferral | 2026-04-19T16:40Z | [implementation-summary.md](008-codex-integration-and-hook-policy/implementation-summary.md) |
| 009-documentation-and-release-contract | Converged | 2026-04-19T14:51Z | [implementation-summary.md](009-documentation-and-release-contract/implementation-summary.md) |

---

### Release Prep

- [x] All 8 implementation children converged — [002](002-shared-payload-advisor-contract/implementation-summary.md), [003](003-advisor-freshness-and-source-cache/implementation-summary.md), [004](004-advisor-brief-producer-cache-policy/implementation-summary.md), [005](005-advisor-renderer-and-regression-harness/implementation-summary.md), [006](006-claude-hook-wiring/implementation-summary.md), [007](007-gemini-copilot-hook-wiring/implementation-summary.md), [008](008-codex-integration-and-hook-policy/implementation-summary.md), [009](009-documentation-and-release-contract/implementation-summary.md)
- [x] Cross-runtime parity: 4 runtimes × 5 canonical fixtures = identical additionalContext — [advisor-runtime-parity.vitest.ts](../../../../skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts), extended by 008
- [x] 019/004 200-prompt corpus: 200/200 top-1 parity — [advisor-corpus-parity.vitest.ts](../../../../skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts) and [005 summary](005-advisor-renderer-and-regression-harness/implementation-summary.md)
- [x] Cache hit p95 ≤ 50 ms + cache hit rate ≥ 60% on 30-turn replay — [advisor-timing.vitest.ts](../../../../skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts), 005 bench: p95 `0.016 ms`, hit rate `66.7%`
- [x] Disable flag verified: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` stops adapter work — [skill-advisor-hook.md](../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md#9--disable-flag) and runtime hook tests for Claude, Gemini, Copilot and Codex
- [x] Documentation published — [reference doc](../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md), [validation playbook](../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md), `CLAUDE.md` §Gate 2, and runtime READMEs under [hooks/](../../../../skill/system-spec-kit/mcp_server/hooks/README.md)

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **.codex/settings.json + .codex/policy.json not auto-registered.** Codex sandbox blocked the orchestrator dispatch from writing these; registration snippets documented in 020/009 reference doc §3 Setup Per Runtime. Apply manually per the reference doc when enabling Codex runtime.
2. **Copilot SDK runtime capture deferred.** `@github/copilot-cli` SDK package not locally available during 020/007 development; wrapper fallback path tested via mocks. SDK-path behavior will be validated when the SDK lands locally (tracked as non-blocker; wrapper path is production-ready).
3. **Interactive smoke tests deferred per runtime.** Claude/Gemini/Copilot/Codex adapters have CLI smoke tests with simulated stdin but real interactive session smoke is deferred. Phase 020/006-008 implementation-summary files document this explicitly.
4. **Pre-existing non-020 test failures** (`transcript-planner-export.vitest.ts`, `deep-loop/prompt-pack.vitest.ts`) will need follow-up in their respective packets (015, deep-loop). Confirmed unrelated to Phase 020 via stash-test.
5. **T11 follow-up:** investigation + measurement of smart-router context-load efficacy (do advisor briefs actually reduce context load for AI assistants?) is queued as a separate phase; sub-task includes OpenCode plugin architecture research (20 iterations) using the working code-graph OpenCode plugin as reference.
<!-- /ANCHOR:limitations -->
