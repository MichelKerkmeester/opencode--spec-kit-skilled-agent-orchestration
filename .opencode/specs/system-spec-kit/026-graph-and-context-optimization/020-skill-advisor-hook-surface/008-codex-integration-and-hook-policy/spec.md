---
title: "Feature Specification: Codex Integration + Hook Policy"
description: "New hooks/codex/ adapter directory, dynamic hook-policy detection (replace hardcoded 'unavailable'), UserPromptSubmit for prompt-time advice, PreToolUse deny for Bash-only gates, prompt-wrapper fallback for older Codex or restricted configs."
trigger_phrases:
  - "020 codex integration"
  - "codex UserPromptSubmit advisor"
  - "dynamic hook policy detection"
  - "codex bash pretooluse advisor"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 005 converges"
    blockers: ["005-advisor-renderer-and-regression-harness"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"

---
# Feature Specification: Codex Integration + Hook Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessors** | ../002-*, ../004-*, ../005-* (HARD GATE) |
| **Successor** | ../009-documentation-and-release-contract/ |
| **Position in train** | 7 of 8 (can run in parallel with 007 after 006 lands) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (parity expansion; not blocking doc release) |
| **Status** | Spec Ready, Blocked by 005 |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 1.25-2.25 engineering days |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Codex currently has no adapter in `mcp_server/hooks/`. Existing repo policy hard-codes `hookPolicy: "unavailable"` for Codex. Wave-1 §Codex Integration Strategy + wave-2 §X4 together established:
- Codex **does** expose a hook contract in modern versions (repo assumption was outdated)
- `UserPromptSubmit` is supported and accepts `hookSpecificOutput.additionalContext` for model-visible injection
- JSON input can arrive via stdin **or** argv (defensive parser needed)
- `PreToolUse` supports partial enforcement — Bash-only deny per wave-2 X4
- `PostToolUse` is for audit/repair context, not enforcement
- Notification-only hooks (Superset) are NOT model-visible injection and must not be used as the advisor integration

Without this adapter, Codex users can't benefit from the advisor; repo policy remains misleading ("unavailable" when runtime is actually capable).

### Purpose

Ship three deliverables:
1. `hooks/codex/` adapter directory mirroring claude/gemini/copilot patterns
2. Dynamic hook-policy detection replacing hard-coded `"unavailable"` — probe at runtime and report `live` when the installed Codex binary supports hooks
3. Narrow, precise scope per wave-2 X4: prompt-time advice via `UserPromptSubmit`, Bash-only gating via `PreToolUse deny`, audit context via `PostToolUse` — no universal mutation control
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

#### 3.1 Codex adapter directory

- New `mcp_server/hooks/codex/` directory
- New `mcp_server/hooks/codex/user-prompt-submit.ts`:
  - Defensive JSON input parse (stdin OR argv — wave-1 found JSON arrives via argv in some wrappers)
  - Call `buildSkillAdvisorBrief(prompt, { runtime: 'codex' })`
  - Emit `{ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: <brief> } }`
  - Fail-open on any error
- New `mcp_server/hooks/codex/session-prime.ts` (optional, deferred; NOT in P0 scope unless wave-2 §X4 session_start advice is adopted)

#### 3.2 Dynamic hook-policy detection

- New `mcp_server/lib/codex-hook-policy.ts` (or extend existing runtime-detection module)
- Probes installed Codex binary for hook capability (version check + hook list command)
- Reports `hookPolicy: "live" | "partial" | "unavailable"` at invocation time (not static)
- `partial`: UserPromptSubmit supported, PreToolUse/PostToolUse unknown
- `unavailable`: true legacy Codex or stripped install
- Replace all hard-coded `"unavailable"` references in existing code; cite which callsites changed

#### 3.3 Bash-only PreToolUse deny (advice-to-enforcement bridge)

- Optional narrow enforcement: when `PreToolUse` event fires for Bash tool with specific risky patterns (configurable denylist), emit `decision: "deny"`
- **NOT** universal mutation control — only Bash event, only curated denylist
- Scope denylist from existing repo safety patterns (ownership-stripping commands, secret exfiltration shapes)
- Fail-open on policy-check error

#### 3.4 Prompt-wrapper fallback

- For older Codex binaries or restricted configs where hooks don't fire:
- Provide `runtime/codex/prompt-wrapper.ts` that, when invoked manually, wraps the next outgoing prompt with a brief preamble
- Not user-visible by default; escape-hatch path for legacy setups

#### 3.5 Parity + tests

- New `mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` — stdin + argv parse, JSON output, fail-open, SDK detection
- Extend `advisor-runtime-parity.vitest.ts` (from 007) to include Codex as 4th runtime
- Runtime-capability capture: fixture proving `additionalContext` lands in model prompt (from wave-2 research evidence)

### Out of Scope

- Universal tool-use enforcement via PreToolUse (narrow per wave-2 X4)
- Superset notification hooks (not model-visible)
- Documentation (belongs to 009)
- Modifying Codex binary itself

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Create | Codex advisor adapter |
| `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Create | Dynamic policy detection |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Create | Bash-only deny (narrow scope) |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Create | Fallback wrapper for legacy Codex |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Create | Codex adapter tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts` | Create | Policy detection tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Modify | Add Codex as 4th runtime |
| `.codex/settings.json` or equivalent | Modify/Create | Register hooks |
| (callsites of current hard-coded `hookPolicy: "unavailable"`) | Modify | Route via new dynamic detector |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Codex UserPromptSubmit adapter emits JSON `hookSpecificOutput.additionalContext` | Snapshot test |
| REQ-002 | Defensive input parse: stdin OR argv | Two integration tests |
| REQ-003 | Dynamic hook-policy detector replaces all hard-coded `"unavailable"` | grep post-impl yields zero |
| REQ-004 | Narrow PreToolUse deny: Bash-only, curated denylist | Scope review + unit test |
| REQ-005 | Fail-open on any adapter error | Error-injection tests |
| REQ-006 | Cross-runtime parity extended to 4 runtimes | `advisor-runtime-parity.vitest.ts` asserts 4 identical |
| REQ-007 | Runtime-capability capture: fixture proving `additionalContext` lands in model prompt | Fixture committed |
| REQ-008 | Codex adapter registered in `.codex/settings.json` (or equivalent) | File diff |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Prompt-wrapper fallback exists for legacy Codex | File created + documented |
| REQ-021 | Bash denylist initial content curated from existing repo safety patterns | Review |
| REQ-022 | Latency: p95 ≤ 60 ms cache hit | Bench lane |
| REQ-023 | `session-prime.ts` for Codex is explicitly deferred with rationale | Noted in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 2 new test files green (`codex-user-prompt-submit-hook`, `codex-hook-policy`)
- **SC-002**: Parity test extended: 4 runtimes identical on 5 fixtures
- **SC-003**: Grep for `hookPolicy: "unavailable"` hardcoded yields zero post-impl
- **SC-004**: Manual smoke test in real Codex session
- **SC-005**: `tsc --noEmit` clean
- **SC-006**: Runtime-capability fixture committed

### Acceptance Scenario 1: Codex live brief via additionalContext
**Given** Codex hook receives live passing fixture via stdin, **when** invoked, **then** stdout is JSON `{ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: <brief> } }`.

### Acceptance Scenario 2: Codex hook receives JSON via argv
**Given** Codex wrapper passes JSON as argv, **when** adapter invoked, **then** defensive parse reads from argv; behavior identical to stdin case.

### Acceptance Scenario 3: Dynamic policy detection returns live
**Given** a Codex binary supporting UserPromptSubmit, **when** `detectCodexHookPolicy()` runs, **then** returns `"live"`.

### Acceptance Scenario 4: Dynamic policy detection returns unavailable
**Given** a Codex binary not supporting hooks (legacy or stripped), **when** detection runs, **then** returns `"unavailable"`.

### Acceptance Scenario 5: Bash-only PreToolUse deny
**Given** Bash command matches curated denylist, **when** `PreToolUse` fires, **then** emits `decision: "deny"` with reason.

### Acceptance Scenario 6: Non-Bash PreToolUse passthrough
**Given** a non-Bash tool invocation triggers `PreToolUse`, **when** adapter runs, **then** emits no decision (allow).

### Acceptance Scenario 7: Fail-open
**Given** producer error (Python missing), **when** Codex adapter runs, **then** empty stdout + exit 0.

### Acceptance Scenario 8: Cross-runtime parity (4 runtimes)
**Given** 5 canonical fixtures, **when** normalized across Claude/Gemini/Copilot/Codex via 005's comparator, **then** all four produce identical `additionalContext` per fixture.

### Acceptance Scenario 9: Notification-only does not count
**Given** Codex exposes only notification hooks (no stdout return path), **when** asserted, **then** adapter falls back to prompt-wrapper, not notification.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Codex binary version variance | High | Dynamic detection + prompt-wrapper fallback |
| `codex_hooks` marked under development upstream | Medium | Fail-open behavior covers in-flux API |
| PreToolUse denylist over-blocks legitimate commands | Medium | Curate narrowly; document + version denylist |
| argv-passed JSON varies by wrapper | Medium | Defensive parse handles both shapes |
| Superset notification hooks misused as injection | High | Assertion in policy detector that notification ≠ live |
| Installed Codex removes hooks mid-session | Low | Fail-open on probe failure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Codex adapter p95 ≤ 60 ms cache hit
- **NFR-P02**: Hook-policy detection amortized (cache per session) — ≤ 1 probe per session

### Security
- **NFR-S01**: No prompt content in adapter logs
- **NFR-S02**: Bash denylist is transparent (documented); no silent hidden rules

### Reliability
- **NFR-R01**: Adapter never throws; fail-open on any error
- **NFR-R02**: Policy detection failure yields `"unavailable"`, never throws
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- stdin + argv both empty: fail-open
- Codex binary present but hook subcommand absent: `hookPolicy: "unavailable"`
- Bash denylist entry matches partially: require full-word match (no substring spoof)

### Error Scenarios
- Hook-policy probe hangs: 500ms timeout → `"unavailable"`
- PreToolUse denylist file corrupt: load empty list + log warning
- Prompt-wrapper invoked without producer result: emit empty preamble
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 4 new files + policy detector + parity extension |
| Risk | 16/25 | Variable runtime + enforcement boundary |
| Research | 4/20 | Wave-2 §X4 clarified; validation remaining |
| **Total** | **36/70** | **Level 2 (upper)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1 (validation-only): Exact shape of Codex PreToolUse payload — wave-1 noted repo-unverified; fixture-capture during this child closes it
- Q2: Should the Bash denylist live in `.codex/policy.json` or embedded in the adapter? Recommend external JSON for auditability
- Q3: Is Codex `PostToolUse` worth wiring for repair/audit context? Defer to future phase unless current phase surfaces a concrete need
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessors: `../002-*`, `../004-*`, `../005-*` (HARD GATE)
- Research: `../../../research/020-skill-advisor-hook-surface-pt-01/research.md §Codex Integration Strategy`
- Extended research: `../../../research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X4`
- 005 comparator: `../005-advisor-renderer-and-regression-harness/`
