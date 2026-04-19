---
title: "Feature Specification: Advisor Brief Producer + Cache Policy"
description: "buildSkillAdvisorBrief() producer + AdvisorHookResult + prompt policy + fail-open contract + optional HMAC exact prompt cache + 60/80/120 token caps. Depends on 002 and 003. Mirrors buildStartupBrief() orchestration shape."
trigger_phrases:
  - "020 advisor brief producer"
  - "buildSkillAdvisorBrief"
  - "AdvisorHookResult"
  - "advisor fail open"
  - "advisor prompt policy"
  - "advisor exact cache"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 003 converges"
    blockers: ["002-shared-payload-advisor-contract", "003-advisor-freshness-and-source-cache"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"

---
# Feature Specification: Advisor Brief Producer + Cache Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessors** | ../002-shared-payload-advisor-contract/, ../003-advisor-freshness-and-source-cache/ |
| **Successor** | ../005-advisor-renderer-and-regression-harness/ |
| **Position in train** | 3 of 8 |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (gate for renderer + runtime wiring) |
| **Status** | Spec Ready, Blocked by 002 + 003 |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 1.25-2 engineering days |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 002 (envelope) + 003 (freshness) land, the remaining core artifact is the producer that orchestrates: (a) prompt policy (when to fire), (b) prompt normalization + metalinguistic-name suppression, (c) cached exact-match reuse, (d) subprocess invocation of `skill_advisor.py` with timeout, (e) parsing + token capping, (f) fail-open error mapping, (g) envelope wrapping. Wave-1 §Failure Modes + wave-2 X5 (prompt poisoning) + X7 (migration) all require producer-owned rules that the renderer/adapter layers cannot enforce.

Without a single `buildSkillAdvisorBrief()`, each runtime adapter would re-implement policy inconsistently and the fail-open contract would drift.

### Purpose

Ship `buildSkillAdvisorBrief(prompt, options)` returning `AdvisorHookResult` with:
- Prompt policy (skip / fire matrix from research.md §Cross-Runtime Testing + Privacy)
- NFKC canonical fold via Phase 019/003 `shared/unicode-normalization.ts`
- Metalinguistic skill-name suppression (user prompts that literally name skills do not bias scoring without the user's intent signal)
- Optional HMAC exact prompt cache (5-min TTL, session-scoped secret)
- Similarity-only cache reuse is **rejected** (research.md §Rejected ideas)
- Fail-open on subprocess timeout, missing binary, JSON parse error, concurrent graph rebuild
- 60/80/120 token caps depending on fixture class (minimum/default/ambiguity)
- Deleted-skill fail-open behavior (if cached skill no longer in fingerprint map, treat as fail-open)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New `mcp_server/lib/skill-advisor/skill-advisor-brief.ts` with:
  - `buildSkillAdvisorBrief(prompt: string, options: SkillAdvisorBriefOptions): Promise<AdvisorHookResult>`
  - `AdvisorHookResult` interface (matches research.md §Failure Modes shape):
    ```ts
    { status: 'ok' | 'skipped' | 'degraded' | 'fail_open';
      freshness: 'live' | 'stale' | 'absent' | 'unavailable';
      brief: string | null;
      recommendations: AdvisorRecommendation[];
      diagnostics: AdvisorHookDiagnostics | null;
      metrics: AdvisorHookMetrics;
      generatedAt: string; }
    ```
- New `mcp_server/lib/skill-advisor/prompt-policy.ts` with `shouldFireAdvisor(prompt)` implementing:
  - Skip: empty / whitespace / `/help` / `/clear` / `/exit` / `/quit` / short casual acknowledgements
  - Fire: explicit skill / command / governance marker OR work-intent verb + ≥3 meaningful tokens OR ≥20 visible chars + ≥4 meaningful tokens OR ≥50 visible chars and not casual
  - Tests per the 6 prompt classes in research.md §Cross-Runtime Testing + Privacy
- New `mcp_server/lib/skill-advisor/prompt-cache.ts` with:
  - HMAC exact prompt cache (key = canonical prompt + source signature + runtime + threshold config + semantic mode)
  - 5-min TTL
  - Session-scoped secret derived from process PID + launch time
  - Cache entry invalidation on source-signature change (from 003 freshness result)
- Prompt normalization pipeline using Phase 019/003 `shared/unicode-normalization.ts` `canonicalFold()`
- Metalinguistic skill-name suppression: scan canonical-folded prompt for literal skill slugs (`sk-*` from fingerprint map); note suppression in diagnostics; do **not** reduce scoring weight without user intent signal — research.md notes this as a recommendation integrity rule, not a scoring change
- Subprocess invocation: `python3 skill_advisor.py --threshold 0.8 --format json "<prompt>"` with:
  - 1000ms hard timeout
  - stdout parse via strict JSON schema
  - stderr suppressed (fail-open diagnostic capture only)
  - Environment: inherit ambient; never inject prompt fingerprint into env
- Fail-open error table (from research.md §Failure Modes):
  - Python missing → `status: 'fail_open'`, `freshness: 'unavailable'`, `brief: null`
  - Script missing → `status: 'fail_open'`, `freshness: 'absent'`, `brief: null`
  - Subprocess timeout → `status: 'fail_open'`, `freshness: 'unavailable'`, `brief: null`
  - JSON parse failure → `status: 'fail_open'`, `freshness: 'unavailable'`
  - Non-zero exit → `status: 'fail_open'`, `freshness: 'unavailable'`
  - SQLite busy → single 75-125ms retry if ≥500ms budget remains; else fail-open
  - Deleted-skill in cache → `status: 'fail_open'`, `brief: null` (do not render suppressed skill)
- Token caps: 60 minimum, 80 default, 120 ambiguity/debug — enforced via char-heuristic (tokens ≈ chars/4) at producer level; renderer (005) enforces hard cap
- `SkillAdvisorBriefOptions`:
  ```ts
  { runtime: 'claude' | 'gemini' | 'copilot' | 'codex';
    workspaceRoot: string;
    freshness?: AdvisorFreshnessResult;  // if omitted, producer calls getAdvisorFreshness()
    cacheSecret?: Buffer;
    disableExactCache?: boolean;
    semanticModeEnabled?: boolean;  // default false — research §Rejected ideas rules out similarity-only reuse
    timeoutMs?: number;  // default 1000
  }
  ```
- Privacy: raw prompt never logged, never persisted in shared-payload envelope sources, never embedded in cache key cleartext
- Envelope wrapping via 002's `createSharedPayloadEnvelope({ producer: 'advisor', metadata: AdvisorEnvelopeMetadata, ... })`
- Vitest unit tests covering: policy classes, normalization, cache hit/miss, fail-open branches, deleted-skill suppression, envelope shape

### Out of Scope

- Renderer / visible-label sanitization (belongs to 005)
- 200-prompt parity harness (belongs to 005)
- Runtime adapter wiring (belongs to 006/007/008)
- Metric emission surface (diagnostics recorded in result shape; emission hook to `session_health` is child 005's concern)
- Modifying `skill_advisor.py` (advisor ranking stays at 019/004 shipped state)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts` | Create | `buildSkillAdvisorBrief()` orchestration + `AdvisorHookResult` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts` | Create | `shouldFireAdvisor()` + prompt-class classifier |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts` | Create | HMAC exact prompt cache with 5-min TTL |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts` | Create | `runAdvisorSubprocess()` with timeout + parse |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts` | Create | Orchestration tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-policy.vitest.ts` | Create | Prompt-class classifier tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts` | Create | HMAC cache tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts` | Create | Subprocess timeout + fail-open tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `buildSkillAdvisorBrief()` returns `AdvisorHookResult` shape | Interface matches research.md §Failure Modes |
| REQ-002 | Prompt policy: skip empty/help/exit/clear/casual prompts | 6 prompt-class tests green |
| REQ-003 | Prompt policy: fire on explicit-skill marker OR work-intent OR length+token threshold | Scenario coverage |
| REQ-004 | NFKC canonical fold applied to prompt before policy + cache | Phase 019/003 `canonicalFold()` imported and called |
| REQ-005 | HMAC exact prompt cache: 5-min TTL, session secret, signature-gated | Cache hit only when source signature matches |
| REQ-006 | Similarity-only cache reuse is **not** implemented | Code review + test asserts no `similarity` branch |
| REQ-007 | Fail-open on Python missing, script missing, timeout, parse fail, non-zero exit | 5 fail-open scenarios green |
| REQ-008 | Deleted-skill fail-open: cached skill no longer in fingerprint map → brief: null | Acceptance scenario |
| REQ-009 | SQLite busy retry: single 75-125ms retry if ≥500ms budget remaining | Retry test via mocked subprocess |
| REQ-010 | Raw prompt never logged, persisted, or embedded in cache key cleartext | Test assertion: cache key is HMAC, not raw |
| REQ-011 | Fires within parent 020 p95 ≤ 50ms cap (warm cache hit) | Bench lane |
| REQ-012 | Envelope wrapping uses 002's `createSharedPayloadEnvelope({ producer: 'advisor', ... })` | Integration test |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Metalinguistic skill-name suppression diagnosed | Prompts containing `sk-*` slugs record `diagnostics.skillNameSuppressions` |
| REQ-021 | `semanticModeEnabled: false` by default | Default opts do not invoke similarity reuse |
| REQ-022 | Token caps enforced at producer: 60/80/120 | brief-length heuristic tested |
| REQ-023 | `AdvisorHookMetrics` populated: durationMs, cacheHit, subprocessInvoked, retriesAttempted | Field presence test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 4 vitest files green (producer + policy + cache + subprocess)
- **SC-002**: `tsc --noEmit` clean
- **SC-003**: Warm cache hit bench p95 ≤ 10 ms (producer only; does not include subprocess)
- **SC-004**: Cold probe + subprocess bench recorded (cached + uncached lanes)
- **SC-005**: No raw prompt strings found in test mocks' persisted state

### Acceptance Scenario 1: Empty prompt skip
**Given** prompt is `""`, **when** `buildSkillAdvisorBrief()` runs, **then** returns `status: "skipped"`, `brief: null`, no subprocess invocation.

### Acceptance Scenario 2: Work-intent prompt fires
**Given** prompt `"refactor the auth middleware to use JWT"`, **when** producer runs, **then** `status: "ok"`, subprocess invoked, envelope wrapped with advisor producer.

### Acceptance Scenario 3: Exact cache hit
**Given** two identical prompts in the same session at T+0 and T+60s with unchanged source signature, **when** producer runs twice, **then** second call returns from cache (`metrics.cacheHit: true`, no subprocess).

### Acceptance Scenario 4: Cache invalidation on source-signature change
**Given** a cached prompt + a new SKILL.md edit mid-session, **when** producer runs, **then** source signature differs → cache miss → fresh subprocess.

### Acceptance Scenario 5: Python missing fail-open
**Given** `python3` not in PATH, **when** producer runs, **then** `status: "fail_open"`, `freshness: "unavailable"`, `brief: null`, no turn error.

### Acceptance Scenario 6: Subprocess timeout fail-open
**Given** a mocked subprocess exceeding `timeoutMs`, **when** producer runs, **then** `status: "fail_open"`, `freshness: "unavailable"`.

### Acceptance Scenario 7: SQLite busy retry
**Given** subprocess exits with SQLite-busy error and ≥500ms budget remains, **when** producer runs, **then** one retry attempted (75-125ms); if retry succeeds, `status: "ok"`; if retry fails, `status: "fail_open"`.

### Acceptance Scenario 8: Deleted-skill suppression
**Given** a cached brief referencing `sk-old-skill` but the current fingerprint map lacks that skill, **when** producer runs, **then** cache entry suppressed; result is fail-open.

### Acceptance Scenario 9: Metalinguistic skill-name diagnostic
**Given** prompt `"use sk-code-opencode to refactor X"`, **when** producer runs, **then** `diagnostics.skillNameSuppressions: ["sk-code-opencode"]` recorded; scoring not modified.

### Acceptance Scenario 10: Privacy — raw prompt never persisted
**Given** a prompt containing sensitive text, **when** producer runs, **then** no test-observable location (cache key, envelope source ref, diagnostics, metrics) contains the raw prompt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Subprocess spawn cost dominates latency | High | HMAC exact cache + 5-min TTL absorbs repeated prompts |
| HMAC secret leakage | Low | Session-scoped (process lifetime), never persisted |
| Cache invalidation lag after skill edit | Medium | Source-signature gate ensures instant invalidation via 003 |
| Fail-open masking real advisor outage | Medium | Diagnostics populate; metric emission in 005 gates alerts |
| Token-cap heuristic underestimates actual tokens | Low | Renderer (005) enforces hard cap; producer caps are advisory |
| Metalinguistic suppression over-reports | Low | Diagnostic-only, no scoring impact |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Warm cache hit p95 ≤ 10 ms (producer only)
- **NFR-P02**: Cold (subprocess invoke) p95 ≤ 1100 ms
- **NFR-P03**: Per-invocation memory ≤ 512 KB transient

### Security
- **NFR-S01**: Raw prompt never logged, persisted, or in cache key cleartext
- **NFR-S02**: Subprocess env never receives prompt fingerprint or raw prompt

### Reliability
- **NFR-R01**: Producer never throws — all failure paths map to `AdvisorHookResult` with `status: "fail_open"`
- **NFR-R02**: Concurrent calls with same prompt serialize on cache write
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Prompt length 0: skip (scenario 1)
- Prompt length > 10 KB: truncate to 2 KB fingerprint window for cache key; pass full prompt to subprocess
- Unicode prompts (emoji, RTL, CJK): canonical-fold before policy + cache key
- Prompt containing only whitespace or control chars: skip

### Error Scenarios
- Subprocess killed by signal: fail-open with `diagnostics.reason: "SIGNAL_KILLED"`
- Advisor returns valid JSON but empty recommendations: `status: "ok"`, `brief: null`, `recommendations: []`
- Advisor returns threshold-failing recommendation: `status: "ok"`, `brief: null` (no model-visible brief)
- Session-secret not available (e.g., first invocation): derive from process start; never block
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 4 new lib files + 4 test files |
| Risk | 15/25 | Subprocess + cache + fail-open orchestration |
| Research | 5/20 | Research converged; rules fully specified |
| **Total** | **38/70** | **Level 2 (upper)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1: Should the session-secret persist across MCP server restarts within the same workspace? Research deferred; default: no (session-scoped).
- Q2: Exact format of `AdvisorHookDiagnostics` (structured vs free-form string reasons)? Recommend enum-based `reason` codes + optional `details` blob.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessors: `../002-shared-payload-advisor-contract/`, `../003-advisor-freshness-and-source-cache/`
- Research: `../../../research/020-skill-advisor-hook-surface-001-initial-research/research.md §Failure Modes + §Cross-Runtime Testing + Privacy`
- Extended research: `../../../research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/research-extended.md §X1 §X5 §X7`
- Pattern analog: `../../../../../skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- NFKC utility: `../../../../../skill/system-spec-kit/shared/unicode-normalization.ts` (Phase 019/003)
- Advisor source: `../../../../../skill/skill-advisor/scripts/skill_advisor.py`
