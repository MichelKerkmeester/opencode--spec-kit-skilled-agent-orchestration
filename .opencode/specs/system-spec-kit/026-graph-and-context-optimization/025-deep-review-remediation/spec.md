---
title: "Feature Specification: Phase 025 — Deep-Review Remediation"
description: "Close the 7 deduplicated findings (5 P1 + 2 P2) surfaced by the 40-iteration r02 deep-review of the skill-advisor phase stack (Phases 020-024). Privacy, cache correctness, telemetry fidelity, plugin parity, operator docs."
trigger_phrases:
  - "deep-review remediation"
  - "phase 025"
  - "advisor remediation"
  - "dr-p1"
  - "dr-p2"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/025-deep-review-remediation"
    last_updated_at: "2026-04-19T21:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded Phase 025 remediation packet from r02 deep-review findings"
    next_safe_action: "Dispatch cli-codex to implement all 7 remediations"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts"
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md"
      - ".opencode/skill/skill-advisor/README.md"
      - ".opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 025 — Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-19 |
| **Branch** | `main` |
| **Parent** | `../020-skill-advisor-hook-surface/` |
| **Source** | `../020-skill-advisor-hook-surface/review/findings-registry.json` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The 40-iteration r02 deep-review of the skill-advisor phase stack (020 + 021/001 + 021/002 + 022 + 023 + 024) surfaced 5 P1 and 2 P2 deduplicated findings. While the verdict was PASS (0 P0, P1 ≤ 5), all 7 findings are legitimate correctness/privacy/parity gaps that weaken privacy confidence, cache fidelity, telemetry accuracy, plugin parity, and operator-doc executability.

### Purpose
Close all 7 findings with concrete code + test + doc fixes such that a re-run of the deep-review would find no residual P1/P2 from this set. No architectural changes; all fixes are mechanical and scoped to shipped files.

---

## 3. SCOPE

### In Scope

| ID | Dim | Change | Files |
|---|---|---|---|
| **DR-P1-001** | D1 | Move prompt to stdin; centralize label sanitization at producer boundary | `subprocess.ts`, `skill-advisor-brief.ts`, `shared-payload.ts`, `render.ts` |
| **DR-P1-002** | D2 | Pass tokenCap to renderer; include maxTokens in cache key; rebuild provenance on cache hit | `skill-advisor-brief.ts`, `render.ts`, 4 runtime hooks, `shared-payload.ts` |
| **DR-P1-003** | D3 | Separate static vs live telemetry default streams; add prompt finalize API; preserve skill-qualified reads; key analyzer by promptId | `smart-router-measurement.ts`, `live-session-wrapper.ts`, `smart-router-telemetry.ts`, `smart-router-analyze.ts` |
| **DR-P1-004** | D5 | Plugin honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`; SIGKILL escalation after SIGTERM; source-signature in host cache; plugin in parity harness | `spec-kit-skill-advisor.js`, `advisor-runtime-parity.vitest.ts` |
| **DR-P1-005** | D7 | Fix workspace build command; correct Copilot integration model; regenerate playbook denominator; align Codex status; correct measurement artifact name | `skill-advisor-hook.md`, `README.md`, `feature_catalog.md`, `manual_testing_playbook.md`, `LIVE_SESSION_WRAPPER_SETUP.md` |
| **DR-P2-001** | D4 | Prompt-cache size cap + insertion sweep; remove or document normalizer alias; add JSDoc to exported advisor helpers | `prompt-cache.ts`, `normalize-adapter-output.ts`, 6+ files under `lib/skill-advisor/` |
| **DR-P2-002** | D6 | Plugin negative-path tests; subprocess error-code tests; telemetry path-precedence + report-writer tests; end-to-end hook-to-builder parity | `spec-kit-skill-advisor-plugin.vitest.ts`, `advisor-subprocess.vitest.ts`, telemetry tests, `advisor-runtime-parity.vitest.ts` |

### Out of Scope
- New skills or SKILL.md content changes
- Architectural changes to advisor contract or shared-payload envelope shape
- Live-AI measurement collection (still deferred; primitive shipped in 024)
- Cross-repo skill discovery
- Refactoring beyond what a finding requires

---

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
None.

### 4.2 P1 (Required)

1. **DR-P1-001 — Prompt boundary hardening**
   - `skill_advisor.py` accepts prompt on stdin (`--stdin` mode)
   - `subprocess.ts` uses `stdio: ['pipe', 'pipe', 'pipe']` and writes prompt to stdin; argv contains no raw prompt
   - `shared-payload.ts` applies the same instruction-label sanitizer as `render.ts` before accepting `skillLabel`
   - Regression tests: spawn-args contain no prompt string; instruction-shaped envelope labels rejected

2. **DR-P1-002 — Renderer/cache contract**
   - Producer `tokenCap` passed to every hook's `renderAdvisorBrief()` call OR renderer reads from `result.metrics.tokenCap`
   - Exact prompt cache key includes normalized `maxTokens`
   - Cache-hit path rebuilds `sharedPayload.provenance.generatedAt` to match top-level `generatedAt`
   - Regression tests: ambiguous top-two renders across all 4 runtimes; different tokenCaps produce distinct cache entries; cache hit envelope provenance is fresh

3. **DR-P1-003 — Telemetry fidelity**
   - `smart-router-measurement.ts` emits to a separate default stream (e.g., `.opencode/reports/smart-router-static/…`) or requires explicit `--live-stream` flag
   - `live-session-wrapper.ts` gains `finalizePrompt(promptId)` that flushes the session; Read events record observed skill identity (not just resource path)
   - `smart-router-analyze.ts` aggregates by `promptId`; analyzer treats baseline SKILL.md reads as non-violating
   - Regression tests: zero-read session produces a compliance record; multi-read prompt produces one session record; cross-skill read classified as non-compliant

4. **DR-P1-004 — Plugin parity with native hooks**
   - Plugin honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (same flag as runtime hooks); plugin-specific flag is either removed or aliased
   - On timeout, plugin SIGTERM then SIGKILL after 1s if child still running; wait for child exit before resolving
   - Plugin host cache key includes advisor source signature for invalidation on source change
   - `advisor-runtime-parity.vitest.ts` harness runs the plugin as a 5th runtime path and compares against the 4 native hooks
   - Regression tests: disable flag suppresses plugin injection; bridge child exits after timeout; source change invalidates cache

5. **DR-P1-005 — Operator docs**
   - Workspace build command updated to a command that works in this checkout (e.g., `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`) OR the workspace is properly defined in root `package.json`
   - Copilot integration doc reflects callback-based model per `LIVE_SESSION_WRAPPER_SETUP.md`
   - Manual-testing playbook denominator regenerated to match current scenario count
   - Codex registration status aligned across hook reference + feature catalog + playbook
   - Measurement artifact name unified across docs and code (single canonical name)

### 4.3 P2 (Suggestion)

6. **DR-P2-001 — API hygiene**
   - `prompt-cache.ts` evicts on insertion when >N entries; size cap documented
   - `normalizeAdapterOutput` alias removed OR documented as legacy surface with JSDoc pointer to canonical
   - JSDoc on exported public symbols in: `source-cache.ts`, `prompt-cache.ts`, `generation.ts`, `prompt-policy.ts`, `subprocess.ts`, `skill-advisor-brief.ts`, `metrics.ts`

7. **DR-P2-002 — Test coverage gaps**
   - Plugin tests cover: invalid bridge stdout, nonzero close exit, session cache isolation, targeted session eviction
   - Subprocess tests cover: schema-invalid JSON output, non-busy nonzero exit, SQLITE_BUSY retry exhaustion
   - Telemetry tests cover: explicit file override precedence, markdown report write path
   - Parity test: one end-to-end case that exercises the full hook → builder → renderer path without stubs

---

## 5. ACCEPTANCE SCENARIOS

1. **AC-1 Privacy**: Given a prompt containing a secret string, when the advisor subprocess spawns, then `ps`/argv inspection of the child process reveals no raw prompt text (only flags).
2. **AC-2 Instruction-label blocked at envelope**: Given a shared-payload envelope with an instruction-shaped `skillLabel`, when `coerceSharedPayloadEnvelope` runs, then the envelope is rejected at the same sanitizer threshold as `render.ts`.
3. **AC-3 Ambiguity rendered**: Given an advisor result with two skills within 0.05 confidence, when rendered via any of Claude/Gemini/Copilot/Codex/Plugin, then the brief shows ambiguous top-two text.
4. **AC-4 Cache isolation on tokenCap**: Given two calls with identical prompt+runtime+source but different `maxTokens`, when both run, then cache returns distinct briefs.
5. **AC-5 Telemetry session accuracy**: Given a prompt that reads two files (SKILL.md baseline + one non-SKILL file) within one session, when analyzer processes the stream, then it produces exactly one session record with correct classification.
6. **AC-6 Plugin parity**: Given the 6 canonical renderer fixtures, when run through the plugin path, then output matches the 4 native hook paths after transport normalization.
7. **AC-7 Docs executable**: Given a fresh checkout, when operator runs the command from `skill-advisor-hook.md` §Setup, then the build succeeds (or the doc is updated to a command that does succeed).
8. **AC-8 Test suite green**: All existing tests + new regression tests pass (`npm --prefix .opencode/skill/system-spec-kit/mcp_server test`).

---

## 6. FILES TO CHANGE

### Source (modify)
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` — add `--stdin` mode
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts` — stdin-based spawn
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts` — tokenCap propagation, cache key maxTokens, provenance rebuild on hit
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts` — expose sanitizer OR re-export for envelope
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts` — size cap + insertion eviction
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts` — remove alias OR JSDoc it
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` — strong label sanitizer at envelope boundary
- `.opencode/skill/system-spec-kit/mcp_server/hooks/{claude,gemini,copilot,codex}/user-prompt-submit.ts` — renderer call-site if tokenCap plumbing needed
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts` — separate static default stream
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts` — finalize API + skill-identity preservation
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts` — session-level aggregation
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts` — promptId grouping + baseline-SKILL handling
- `.opencode/plugins/spec-kit-skill-advisor.js` — shared disable flag, SIGKILL escalation, source-signature cache key

### Tests (modify + add)
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts` — spawn argv assertion
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts` — error-code + stdin coverage
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts` — envelope instruction-label rejection
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief.vitest.ts` — cache-key maxTokens, cache-hit provenance
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` — plugin 5th path, end-to-end hook→builder
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` — disable flag, SIGKILL, negative paths
- `.opencode/skill/system-spec-kit/mcp_server/tests/telemetry-*.vitest.ts` — path precedence, report writer

### Docs (modify)
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` — workspace command, Codex status
- `.opencode/skill/skill-advisor/README.md` — workspace command, integration note
- `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md` — measurement artifact name alignment
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` — regenerate denominator, align Codex/Copilot status
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` — if command names change

### Docs (new)
None.
