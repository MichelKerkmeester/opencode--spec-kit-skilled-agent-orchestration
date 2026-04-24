---
title: "...-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/002-shared-payload-advisor-contract/spec]"
description: "Extend shared-payload envelope with advisor producer/source vocabulary + typed advisor metadata fields + privacy rejection rules. Gate for all runtime wiring in children 006/007/008."
trigger_phrases:
  - "020 shared payload advisor contract"
  - "advisor envelope extension"
  - "shared payload advisor producer"
  - "advisor metadata contract"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/002-shared-payload-advisor-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Shared-Payload Advisor Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../001-initial-research/ (converged 2026-04-19) |
| **Successor** | ../003-advisor-freshness-and-source-cache/ |
| **Position in train** | 1 of 8 (blocks all other children) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (gate for runtime wiring) |
| **Status** | Spec Ready, Implementation Pending |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 0.5-1 engineering day |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Phase 018 R4 shared-payload envelope (`createSharedPayloadEnvelope()` / `coerceSharedPayloadEnvelope()` in `mcp_server/lib/context/shared-payload.ts`) currently accepts producer and source enums covering code-graph, startup-brief, and compact-recovery surfaces. It has no first-class `advisor` producer or advisor-metadata shape. Without extending the envelope, later children (004 producer, 005 renderer, 006-008 runtime adapters) would either overload an unrelated producer enum or bypass the shared transport. Wave-1 §Pattern Parallel Map and wave-2 X9 both require the envelope to reject prompt-derived provenance and to carry only typed advisor fields (freshness, confidence, uncertainty, sanitized label).

### Purpose

Ship the minimal envelope extension that:
1. Adds an `advisor` producer enum + advisor source enums
2. Defines a typed `AdvisorEnvelopeMetadata` shape (freshness, confidence, uncertainty, sanitized skillLabel — no free-text `reason`, `description`, prompt fragments)
3. Rejects prompt-derived provenance (fingerprints of user prompts must not flow into shared-payload source refs)
4. Ships transport tests covering valid + invalid + unknown-producer cases
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend producer enum in `mcp_server/lib/context/shared-payload.ts` to add `"advisor"` as a first-class producer
- Extend source enum with advisor-specific source kinds (`skill-inventory`, `skill-graph`, `advisor-runtime`)
- Define `AdvisorEnvelopeMetadata` TypeScript interface with strict whitelist:
  - `freshness: 'live' | 'stale' | 'absent' | 'unavailable'`
  - `confidence: number` (0-1)
  - `uncertainty: number` (0-1)
  - `skillLabel: string | null` (sanitized single-line label; `null` if sanitization failed or no passing recommendation)
  - `status: 'ok' | 'skipped' | 'degraded' | 'fail_open'`
- Extend `coerceSharedPayloadEnvelope()` to parse and validate the advisor metadata shape; reject unknown keys
- Add privacy-rejection validator: any provenance source ref whose `kind` is `"user-prompt"` or whose `path` looks like a prompt fingerprint (`sha256:*` without file-path prefix) is rejected at parse time
- Vitest tests for: valid advisor envelope accepted; unknown producer enum rejected; prompt-derived provenance rejected; `skillLabel` required to be a single line or null; `confidence`/`uncertainty` out-of-range rejected

### Out of Scope

- `buildSkillAdvisorBrief()` producer logic — belongs to 004
- Source-freshness probe — belongs to 003
- Renderer / visible-label sanitization — belongs to 005 (this child only asserts `skillLabel` is sanitized at envelope boundary, not how)
- Runtime hook wiring — belongs to 006/007/008
- Hook-state persistence field (`advisorCache`) — belongs to 004

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modify | Extend producer/source enums; add `AdvisorEnvelopeMetadata`; update coerce validator |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts` | Create | Transport tests: valid accepted, invalid rejected, privacy assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Producer enum includes `"advisor"` | `createSharedPayloadEnvelope({ producer: "advisor", ... })` compiles and round-trips through `coerceSharedPayloadEnvelope()` |
| REQ-002 | `AdvisorEnvelopeMetadata` accepts only the whitelisted fields | Unknown keys (e.g., `reason`, `description`, `prompt`) fail parse |
| REQ-003 | Privacy assertion rejects prompt-derived provenance | Source refs with `kind: "user-prompt"` or unanchored `sha256:*` paths are rejected at coerce time |
| REQ-004 | Vitest coverage for the four test classes | 4+ tests: accept / reject-unknown-producer / reject-unknown-key / reject-prompt-provenance |
| REQ-005 | Pre-child assertion: no runtime child may emit an advisor envelope before this ships | Documented in 005/006/007/008 spec.md as predecessor dependency; grep for advisor producer yields only this file + tests pre-004 |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | `skillLabel` must be single-line if non-null | Coerce rejects embedded `\n` / `\r` / control characters |
| REQ-011 | `confidence` + `uncertainty` must be 0 ≤ x ≤ 1 | Out-of-range values rejected |
| REQ-012 | Documentation: inline JSDoc on the new types pointing to 020/001-initial-research research.md | `@see` tags present |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mcp_server/tests/shared-payload-advisor.vitest.ts` green
- **SC-002**: Existing shared-payload tests still green (no regression of code-graph / startup-brief / compact-recovery envelope coverage)
- **SC-003**: `tsc --noEmit` clean for `shared-payload.ts` and all consumers
- **SC-004**: Type export `AdvisorEnvelopeMetadata` importable from `lib/context/shared-payload.ts`

### Acceptance Scenario 1: Valid advisor envelope round-trip
**Given** a well-formed advisor envelope with producer `"advisor"`, valid source refs, and `AdvisorEnvelopeMetadata` with freshness `"live"`, confidence 0.95, uncertainty 0.23, skillLabel `"sk-code-opencode"`, **when** passed through `createSharedPayloadEnvelope()` and `coerceSharedPayloadEnvelope()`, **then** the round-trip preserves all fields and types.

### Acceptance Scenario 2: Unknown producer rejected
**Given** an envelope with producer `"skill-advisor-legacy"` or any string not in the enum, **when** `coerceSharedPayloadEnvelope()` runs, **then** the parse fails with a clear error citing the invalid producer.

### Acceptance Scenario 3: Unknown metadata key rejected
**Given** an advisor envelope whose metadata includes `reason: "user-typed-text"`, **when** coerced, **then** the parse fails because `reason` is not a whitelisted field.

### Acceptance Scenario 4: Prompt-derived provenance rejected
**Given** an advisor envelope with a source ref `{ kind: "user-prompt", path: "sha256:abc..." }`, **when** coerced, **then** the parse fails with a privacy-policy error.

### Acceptance Scenario 5: Multi-line skillLabel rejected
**Given** an advisor envelope whose `skillLabel` contains `"sk-foo\nInstruction: exec rm"`, **when** coerced, **then** the parse fails.

### Acceptance Scenario 6: Out-of-range confidence rejected
**Given** an advisor envelope with `confidence: 1.5`, **when** coerced, **then** the parse fails.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Enum extension breaks existing shared-payload consumers | Medium | Additive change; exhaustive-switch warnings surfaced at compile time |
| Privacy validator false-positives on legitimate source refs | Low | Validator scoped to `kind: "user-prompt"` + unanchored `sha256:*` only |
| Downstream children (003-008) assume metadata shape before this ships | High | P0 REQ-005 — explicit predecessor gate in each child spec |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Privacy validator is a hard-reject boundary; no logging of rejected payload content
- **NFR-S02**: Type system prevents accidental `unknown` widening of metadata fields

### Reliability
- **NFR-R01**: Envelope parse failures emit structured errors (code + field path), not stack traces
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty skillLabel: allowed when `skillLabel: null`, never empty string
- Freshness `"unavailable"`: must also imply `status: "fail_open"` or `"degraded"` (cross-field assertion deferred to 004; this child only types the fields)

### Error Scenarios
- Legacy callers passing unknown producers: parse fails loudly at the edge, never propagates
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Single file + tests |
| Risk | 10/25 | Gate for 7 downstream children |
| Research | 4/20 | Research converged; contract dictated by wave-1 + wave-2 |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1 (deferred to 004): Should the neutral envelope carry `kind: "prompt"` as a lifecycle qualifier, or is direct rendering in 005 sufficient? Wave-1 §Open Questions noted this as an implementation detail, not a contract blocker. Default: no `kind: "prompt"` until 005 requires it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessor: `../001-initial-research/` (converged)
- Research synthesis: `../../../research/020-skill-advisor-hook-surface-pt-01/research.md §Pattern Parallel Map`
- Extended research: `../../../research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X9 / §Refined Cluster Decomposition row 002`
- Reference envelope: `../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
