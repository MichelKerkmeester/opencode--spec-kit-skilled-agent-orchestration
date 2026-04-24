---
title: "Feature Specification: Advisor Renderer + 200-Prompt Regression Harness (HARD GATE)"
description: "Pure renderAdvisorBrief() + normalized comparator + 019/004 200-prompt parity harness + 4 timing lanes + Unicode-label sanitization + observability/privacy tests. No runtime adapter (006/007/008) may ship before this converges."
trigger_phrases:
  - "020 advisor renderer"
  - "renderAdvisorBrief"
  - "200 prompt parity harness"
  - "advisor hard gate"
  - "unicode skill label sanitization"
  - "advisor observability contract"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research; hard gate for 006/007/008"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 004 converges"
    blockers: ["004-advisor-brief-producer-cache-policy"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"

---
# Feature Specification: Advisor Renderer + 200-Prompt Regression Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

> **⚠️ HARD GATE** — No runtime adapter (006, 007, 008) ships before this child converges. Wave-2 research (§Executive Summary) tightened this from advisory to mandatory.

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../004-advisor-brief-producer-cache-policy/ |
| **Successor** | ../006-claude-hook-wiring/ (blocked until this converges) |
| **Position in train** | 4 of 8 |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (HARD GATE for runtime rollout) |
| **Status** | Spec Ready, Blocked by 004 |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 1-2.25 engineering days |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Wave-2 §X5 + §X9 established that the renderer, not the advisor subprocess, is the actual trust boundary for model-visible content. If runtime adapters render free-form advisor output (e.g., `reason` strings, descriptions), the advisor subprocess becomes a prompt-injection vector. Wave-2 §X1 also established that the full 200-prompt corpus parity harness is a validation gap that must close before runtime rollout — wave-1's sampled measurements were bounded, not full-corpus.

Without this child:
- Runtime adapters would render arbitrary free text from `skill_advisor.py` output
- No regression protection against the 019/004 routing-accuracy work
- No cross-runtime parity guarantee (each adapter might produce different visible text)
- No observability / privacy assertions in CI

### Purpose

Ship the single trust-boundary renderer + a full regression harness that gates runtime rollout. Three deliverables:
1. `renderAdvisorBrief(result, options)` pure renderer with whitelist-only visible fields + Unicode label sanitization
2. 200-prompt parity harness against 019/004 corpus with 4 timing lanes + cache-hit-rate measurement
3. Observability + privacy assertion suite (`speckit_advisor_hook_*` metrics, JSONL stderr schema, `advisor-hook-health` session_health section, raw-prompt privacy audit)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

#### 3.1 Pure renderer

- New `mcp_server/lib/skill-advisor/render.ts` with `renderAdvisorBrief(result: AdvisorHookResult, options: RenderOptions): string | null`
- **Whitelist-only visible fields**: `freshness`, `confidence`, `uncertainty`, sanitized `skillLabel`
- **Never** rendered: `reason`, `description`, prompt fragments, raw advisor stdout, semantic snippets, candidate details beyond top-1 (top-2 allowed only in `ambiguousTopTwo` 120-token mode)
- Visible-label sanitization pipeline:
  1. Canonical-fold skillLabel via Phase 019/003 `canonicalFold()`
  2. Normalize to single line (strip control chars, collapse whitespace)
  3. Deny instruction-shaped normalized labels (regex pattern match for imperative verbs + common injection shapes like `"instruction:"`, `"ignore previous"`, `"system:"`)
  4. If sanitization fails → return `null` (no brief emitted)
- Default brief format: `"Advisor: live; use sk-code-opencode 0.95/0.23 pass."`
- Stale format: `"Advisor: stale; use sk-code-opencode 0.95/0.23 pass."`
- Failed / degraded / skipped: `null`
- Ambiguous (top-2, 120-token): `"Advisor: live; ambiguous: sk-code-opencode 0.80/0.35 vs sk-doc 0.75/0.32 pass."`
- No model-visible advisor brief for `status: "fail_open"` or `"skipped"`
- Pure function: no I/O, no subprocess, no side effects

#### 3.2 Fixture library

- New `mcp_server/tests/advisor-fixtures/` directory with **10 canonical fixtures** (7 original + 3 wave-3 additions):
  - `livePassingSkill.json` — 80-token advisor brief
  - `staleHighConfidenceSkill.json` — stale brief with explicit wording
  - `noPassingSkill.json` — no model-visible brief
  - `failOpenTimeout.json` — no brief
  - `skippedShortCasual.json` — no brief
  - `ambiguousTopTwo.json` — 120-token form
  - `unicodeInstructionalSkillLabel.json` — label looks like instruction → sanitization blocks render
  - **`skipPolicyEmptyPrompt.json`** (wave-3 P1 addition, V4 corpus-adequacy) — empty / whitespace-only prompt → `status: "skipped"`, `brief: null`, no subprocess invocation
  - **`skipPolicyCommandOnly.json`** (wave-3 P1 addition, V4) — prompt is just `/help` / `/clear` / `/exit` → skipped
  - **`promptPoisoningAdversarial.json`** (wave-3 P1 addition, X5 prompt-poisoning class) — prompt contains injection-shaped sub-strings (`"ignore previous instructions"`, `"system: you are now"`, Unicode-hidden-mark tricks). Producer must still run normally; renderer must not echo any prompt content in the brief; sanitizer must still evaluate on `skillLabel`, not the prompt

#### 3.3 Normalized runtime comparator

- New `mcp_server/lib/skill-advisor/normalize-adapter-output.ts` with:
  ```ts
  type NormalizedAdvisorRuntimeOutput = {
    runtime: 'claude' | 'gemini' | 'copilot' | 'codex';
    transport: 'plain_stdout' | 'json_additional_context' | 'prompt_wrapper';
    additionalContext: string | null;
    stderrVisible: boolean;
    decision?: 'allow' | 'block' | 'deny';
  };
  ```
- `normalizeAdapterOutput(raw, runtime): NormalizedAdvisorRuntimeOutput` transforms each adapter's native shape into the comparator type
- Used by 006/007/008 parity tests after each child lands

#### 3.4 200-prompt parity harness

- New `mcp_server/tests/advisor-corpus-parity.vitest.ts`:
  - Reads `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
  - For each of 200 prompts:
    - Invoke direct CLI `python3 skill_advisor.py --format json "<prompt>"` (baseline)
    - Invoke `buildSkillAdvisorBrief(prompt, opts)` (hook path)
    - Compare: hook top-1 recommendation must equal direct-CLI top-1 (100% match gate)
    - Allow confidence tolerance ± 0.001
  - Records failures per prompt for debugging
  - Must achieve 100% top-1 parity to pass gate

#### 3.5 Timing harness

- New `mcp_server/tests/advisor-timing.vitest.ts` with 4 lanes:
  - **Cold subprocess**: fresh MCP server, no cache — measure `buildSkillAdvisorBrief()` wall time
  - **Warm subprocess**: second invocation, cache miss (different prompt) — measure wall time
  - **Cache hit**: same prompt + unchanged source signature — measure producer-only wall time
  - **Cache miss**: signature changed mid-session — measure full re-probe
- For each lane: record p50, p95, p99 across 50 invocations
- Pass/fail thresholds (**hard gates**):
  - **Cache-hit lane p95 ≤ 50 ms** (parent 020/spec.md §7 NFR-P01) — applies to the `cache hit` lane only; the cold, warm, and cache-miss lanes are measured and reported but NOT hard-gated on a wall-clock budget
  - **Cache hit rate ≥ 60%** on synthetic 30-turn replay using the corrected trace: **10 unique prompts interleaved with 20 repeats** in a fixed pattern (each unique prompt appears 2-4x; first occurrence misses, subsequent appearances hit). This yields 20/30 = 66.7% hits, which exceeds the ≥ 60% gate with margin for single-prompt flake (e.g., one SQLite-busy fail-open among the 30 turns still leaves ≥ 19/30 = 63.3%)
- Non-gate measurements (recorded for diagnostics in implementation-summary.md, never a ship blocker):
  - Warm subprocess p95 ≤ 1100 ms (target; surfaces regression when exceeded, does not fail CI)
  - Cold subprocess p95 ≤ 1500 ms (target; same)

#### 3.6 Observability + privacy suite

**Metric namespace (exact names + label catalog — wave-3 V6 tightening):**

| Metric (counter unless noted) | Type | Labels | Emit on |
|-------------------------------|------|--------|---------|
| `speckit_advisor_hook_invocations_total` | Counter | `runtime`, `status` | Every producer invocation |
| `speckit_advisor_hook_duration_ms` | Histogram | `runtime`, `status`, `freshness`, `cacheHit` | Every invocation |
| `speckit_advisor_hook_cache_hits_total` | Counter | `runtime` | Every cache hit |
| `speckit_advisor_hook_cache_misses_total` | Counter | `runtime` | Every cache miss |
| `speckit_advisor_hook_fail_open_total` | Counter | `runtime`, `errorCode` ∈ {`TIMEOUT`, `SCRIPT_MISSING`, `SQLITE_BUSY`, `PARSE_FAIL`, `SIGNAL_KILLED`, `GENERATION_COUNTER_CORRUPT`, `PYTHON_MISSING`, `NONZERO_EXIT`, `SQLITE_BUSY_EXHAUSTED`, `DELETED_SKILL`, `UNKNOWN`} | Fail-open paths |
| `speckit_advisor_hook_freshness_state` | Gauge | `runtime`, `state` ∈ {`live`, `stale`, `absent`, `unavailable`} | Every freshness probe |

**Label value whitelist (no free-form values):**
- `runtime` ∈ `{claude, gemini, copilot, codex}`
- `status` ∈ `{ok, skipped, fail_open, degraded}`
- `freshness` ∈ `{live, stale, absent, unavailable}`
- `errorCode` — closed enum above; unknown errors map to `UNKNOWN` (not free-form)

**Stderr diagnostic JSONL schema (exact wave-3 V6 contract):**

```ts
type AdvisorHookDiagnosticRecord = {
  timestamp: string;           // ISO 8601
  runtime: 'claude' | 'gemini' | 'copilot' | 'codex';
  status: 'ok' | 'skipped' | 'fail_open' | 'degraded';
  freshness: 'live' | 'stale' | 'absent' | 'unavailable';
  durationMs: number;          // integer
  cacheHit: boolean;
  errorCode?: AdvisorErrorCode; // present only when status !== 'ok'
  errorDetails?: string;       // non-prompt diagnostic text (e.g., "sqlite locked after 2 retries")
  skillLabel?: string;         // sanitized label rendered to user (if any); never raw prompt
  generation?: number;         // freshness generation counter
  // FORBIDDEN: prompt, promptFingerprint, promptExcerpt, stdout, stderr
};
```

Privacy: the schema omits every prompt-bearing field. The audit test (see below) asserts these field names never appear in serialized output.

**Alert thresholds (wave-3 V6 operator contract):**

| Metric | Warn | Page | Window |
|--------|------|------|--------|
| `speckit_advisor_hook_fail_open_total` rate | ≥ 2% of invocations | ≥ 5% of invocations | rolling 5 min |
| `speckit_advisor_hook_duration_ms` p95 (cacheHit=true) | ≥ 75 ms | ≥ 150 ms | rolling 5 min |
| `speckit_advisor_hook_freshness_state{state="unavailable"}` | any sustained non-zero > 60 s | ≥ 5 min sustained | continuous |

**`advisor-hook-health` section** injectable into `session_health`: last 30 invocations (timestamp, status, freshness, durationMs, cacheHit), rolling fail-open rate, cache-hit-lane p95.

**Observability test file** — `mcp_server/tests/advisor-observability.vitest.ts`:
- Asserts every metric name + label tuple above
- Asserts JSONL record conforms to schema + no forbidden field appears
- Asserts alert thresholds are configurable via env (not hard-coded)
- Asserts `session_health` integration round-trip

**Privacy test file** — `mcp_server/tests/advisor-privacy.vitest.ts`:
- Raw prompt content not in any test-serializable surface (metrics labels, envelope, stderr JSONL, cache key cleartext, `advisor-hook-health` output)
- Prompt fingerprint is HMAC, never raw
- Fingerprint never appears in shared-payload source refs
- Sensitive fixture prompts (`"api_key=SECRET_ABC123"`, `"PASSWORD=hunter2"`) used across all serialization paths; asserts literal substring absent from every surface

### Out of Scope

- Runtime adapter wiring (belongs to 006/007/008)
- Documentation / release contract (belongs to 009)
- Modifying `skill_advisor.py` (advisor ranking stays at 019/004)
- Gate 3 classifier changes (separate phase)
- New corpus prompts — uses 019/004's existing 200-prompt labeled set

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts` | Create | Pure `renderAdvisorBrief()` + sanitization |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts` | Create | `NormalizedAdvisorRuntimeOutput` comparator |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts` | Create | `speckit_advisor_hook_*` metric namespace |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/` | Create | 10 JSON fixtures |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts` | Create | Renderer fixture snapshots |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts` | Create | 200-prompt parity |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts` | Create | 4-lane timing harness |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts` | Create | Metrics + health section |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts` | Create | Raw-prompt assertion suite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers (HARD GATE)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `renderAdvisorBrief()` is pure (no I/O) | Fixture-based snapshot tests deterministic |
| REQ-002 | Whitelist-only visible fields | Code review + grep test asserts no `reason`/`description`/`prompt` reads |
| REQ-003 | Unicode skill label sanitization blocks instruction-shaped labels | `unicodeInstructionalSkillLabel` fixture → render returns `null` |
| REQ-004 | 200-prompt corpus: 100% top-1 parity hook vs direct CLI | `advisor-corpus-parity.vitest.ts` passes all 200 |
| REQ-005 | Cache-hit lane p95 ≤ 50 ms (hard gate applies to cache-hit lane only; cold/warm/miss lanes are measured but not hard-gated) | Timing harness records + asserts cache-hit lane |
| REQ-006 | Cache hit rate ≥ 60% on synthetic 30-turn replay using 10 unique prompts + 20 repeats (20/30 = 66.7% hits nominal; ≥ 60% after single-flake tolerance) | Timing harness records + asserts with the mathematically consistent trace |
| REQ-007 | Metrics namespace `speckit_advisor_hook_*` populated | Observability test asserts metric names + labels |
| REQ-008 | Stderr JSONL schema never contains prompt content | Privacy test asserts |
| REQ-009 | `advisor-hook-health` section injectable into `session_health` | Integration test |
| REQ-010 | Token cap assertions: 80 default, 120 hard cap | Fixture tests |
| REQ-011 | Normalized runtime comparator type exported | `NormalizedAdvisorRuntimeOutput` importable from `lib/skill-advisor/` |
| REQ-012 | No runtime adapter may merge before this child converges | Documented in 006/007/008 spec.md as HARD GATE dependency |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Corpus parity failures surfaced with per-prompt diagnostics | Failure report includes prompt, hook top-1, CLI top-1, confidence delta |
| REQ-021 | Timing harness records cold/warm lanes (non-gate but measured) | Implementation-summary.md table |
| REQ-022 | 10 fixtures committed (7 baseline + 3 wave-3 P1 additions) | `advisor-fixtures/` has 10 JSON files including `skipPolicyEmptyPrompt`, `skipPolicyCommandOnly`, `promptPoisoningAdversarial` |
| REQ-023 | Observability contract: exact metric names, closed-enum label values, JSONL schema, alert thresholds | `advisor-observability.vitest.ts` asserts every row in §3.6 table |
| REQ-024 | Alert thresholds configurable via env (not hard-coded in app code) | Env-override test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 test files green (`advisor-renderer`, `advisor-corpus-parity`, `advisor-timing`, `advisor-observability`, `advisor-privacy`)
- **SC-002**: 200-prompt parity at 100% match gate
- **SC-003**: Cache-hit lane p95 ≤ 50 ms (cache-hit lane only; cold/warm/miss lanes measured but not gated)
- **SC-004**: Cache hit rate ≥ 60% on corrected replay (10 unique + 20 repeats → 20/30 = 66.7% nominal)
- **SC-005**: Metrics namespace verified
- **SC-006**: Privacy audit: no raw prompt in any test-observable surface
- **SC-007**: `tsc --noEmit` clean

### Acceptance Scenario 1: Live fixture renders correctly
**Given** `livePassingSkill.json` fixture, **when** `renderAdvisorBrief()` runs, **then** output equals `"Advisor: live; use sk-code-opencode 0.95/0.23 pass."` (snapshot test).

### Acceptance Scenario 2: Stale fixture renders with explicit wording
**Given** `staleHighConfidenceSkill.json`, **when** rendered, **then** output begins with `"Advisor: stale; "`.

### Acceptance Scenario 3: No-passing-skill → null
**Given** `noPassingSkill.json`, **when** rendered, **then** output is `null`.

### Acceptance Scenario 4: Fail-open → null
**Given** `failOpenTimeout.json`, **when** rendered, **then** output is `null`.

### Acceptance Scenario 5: Skipped → null
**Given** `skippedShortCasual.json`, **when** rendered, **then** output is `null`.

### Acceptance Scenario 6: Ambiguous → 120-token form
**Given** `ambiguousTopTwo.json` with `options.ambiguousMode: true`, **when** rendered, **then** output includes both candidates and char-count ≤ 480 (≈ 120 tokens).

### Acceptance Scenario 7: Unicode instruction label blocked
**Given** `unicodeInstructionalSkillLabel.json` with skillLabel containing NFKC-decomposed instruction chars, **when** rendered, **then** output is `null` + `diagnostics.reason: "LABEL_SANITIZATION_FAILED"`.

### Acceptance Scenario 8: 200-prompt parity — 100%
**Given** the 019/004 corpus, **when** hook vs direct CLI compared across all 200 prompts, **then** top-1 matches 200/200.

### Acceptance Scenario 9: Cache-hit lane p95 ≤ 50 ms
**Given** 50 repeated cache-hit invocations (same prompt + unchanged source signature), **when** timing harness runs the cache-hit lane, **then** p95 ≤ 50 ms. Cold/warm/miss lanes are recorded for diagnostics but not gated on a wall-clock budget.

### Acceptance Scenario 10: Cache hit rate ≥ 60% on corrected synthetic replay
**Given** a 30-turn synthetic session composed of **10 unique prompts + 20 repeats** (fixed pattern where each unique prompt first-appears once and then repeats 2-4x later in the stream), **when** the producer runs each turn in sequence with a stable source signature, **then** cache hit rate is 20/30 = 66.7% nominal (≥ 60% gate). A single SQLite-busy fail-open among the 30 turns still yields ≥ 19/30 = 63.3%, preserving the gate.

### Acceptance Scenario 11: Metrics namespace present
**Given** a series of producer invocations, **when** observability suite runs, **then** metrics exist for `speckit_advisor_hook_invocations_total`, `_duration_ms`, `_cache_hits_total`, `_cache_misses_total`, `_fail_open_total`, `_freshness_state` with correct labels.

### Acceptance Scenario 12: Privacy — no raw prompt in any surface
**Given** a set of sensitive prompts passed through the producer, **when** privacy suite runs, **then** no serialized surface contains the raw prompt text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| 200-prompt parity test flakes on SQLite-busy | Medium | Hook path uses 004's single-retry; corpus test uses fresh workspace fixture per run |
| Timing harness unstable on CI | Medium | Record p50/p95/p99 only; fail only on hard threshold (cache hit p95 ≤ 50 ms) |
| Label sanitization over-blocks legitimate skill names | Low | Curate denylist from canonical-folded imperative tokens only |
| Fixture regressions not caught | Medium | Snapshot tests in vitest — PR diffs surface all fixture changes |
| Metrics module clashes with existing metrics surface | Low | Namespace prefixed with `speckit_advisor_hook_` |
| Privacy audit too narrow | High | Grep every serialized surface: metrics, envelope, stderr, session_health, cache keys |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Renderer pure function, no I/O — < 1 ms per invocation
- **NFR-P02**: Corpus harness completes in < 10 minutes on CI (200 × ~1100 ms cold + cache hits)
- **NFR-P03**: Timing harness completes in < 2 minutes (50 invocations × 4 lanes)

### Security
- **NFR-S01**: Sanitization denylist reviewed for instruction-pattern coverage
- **NFR-S02**: Privacy audit is blocking for green status

### Reliability
- **NFR-R01**: Renderer never throws — invalid inputs return `null` with diagnostic
- **NFR-R02**: Parity harness tolerates subprocess flake up to 1 retry per prompt; second failure is hard fail
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `skillLabel` contains only whitespace: render returns `null`
- `confidence` exactly at threshold: render includes brief
- `freshness: "unavailable"` with valid recommendations: render returns `null` (research.md rule)
- Empty `recommendations` array: render returns `null`

### Error Scenarios
- Corpus file missing: corpus test fails with clear error; not silent skip
- Fixture file malformed: vitest surface at suite setup
- Metrics library unavailable: observability test fails
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Renderer + fixtures + 3 test harnesses + metrics |
| Risk | 18/25 | Hard gate + privacy + parity — high blast radius |
| Research | 5/20 | Research converged; contract fully specified |
| **Total** | **43/70** | **Level 2 (upper)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1: Should the renderer expose a `debugMode: true` option that includes diagnostics inline (top-2, freshness reason)? Default off; fixture-gated.
- Q2: Is the metrics emission backend OpenTelemetry or a custom counter bag? Research-extended §X6 recommends a namespace; implementation detail.
<!-- /ANCHOR:questions -->

---

### Related Documents

- Parent: `../spec.md`
- Predecessor: `../004-advisor-brief-producer-cache-policy/`
- Research: `../../../research/020-skill-advisor-hook-surface-pt-01/research.md §Cross-Runtime Testing + Privacy`
- Extended research: `../../../research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X1 §X5 §X6 §X9`
- Corpus: `../../../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- NFKC utility: `../../../../../skill/system-spec-kit/shared/unicode-normalization.ts`
