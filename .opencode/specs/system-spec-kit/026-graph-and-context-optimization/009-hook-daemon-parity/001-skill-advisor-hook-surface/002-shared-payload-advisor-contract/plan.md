---
title: "...-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/002-shared-payload-advisor-contract/plan]"
description: "Additive TypeScript enum + type extension on lib/context/shared-payload.ts. Adds advisor producer/source vocabulary + typed AdvisorEnvelopeMetadata + privacy rejection validator. Vitest coverage for 6 acceptance scenarios."
trigger_phrases:
  - "020 002 plan"
  - "shared payload advisor plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/002-shared-payload-advisor-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto"
    blockers: []
    key_files: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Shared-Payload Advisor Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict, ESM) |
| **Module** | `mcp_server/lib/context/shared-payload.ts` |
| **Testing** | vitest |
| **Pattern Reference** | Phase 018 R4 envelope (same module; additive) |

### Overview

Extend the Phase 018 R4 shared-payload envelope with first-class advisor vocabulary. This is a contract-only change: no producer logic, no freshness probe, no hook wiring. Ship producer + source enums, `AdvisorEnvelopeMetadata` type, privacy-rejection validator, and transport tests. Gate for children 003-008.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001-initial-research converged (2026-04-19)
- [x] Parent 020 spec.md + decision-record.md reference advisor envelope requirement
- [x] Research synthesis captures advisor metadata shape (research.md §Pattern Parallel Map)

### Definition of Done
- [ ] All 6 acceptance scenarios pass (shared-payload-advisor.vitest.ts)
- [ ] `tsc --noEmit` clean
- [ ] Existing shared-payload tests still green
- [ ] `checklist.md` P0 items all `[x]`
- [ ] `/spec_kit:implement :auto` exit OK
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive enum + type extension. No new files in `lib/`; the module is scoped to `shared-payload.ts` because the envelope is a transport primitive, not a consumer-specific module.

### Key Components

```
mcp_server/
  lib/context/
    shared-payload.ts        EDIT — producer + source enums, AdvisorEnvelopeMetadata,
                                    coerceSharedPayloadEnvelope() validator
  tests/
    shared-payload-advisor.vitest.ts   NEW — 6 acceptance scenarios + privacy assertion
```

### Data Flow

```
Producer (future 004)
  → createSharedPayloadEnvelope({ producer: "advisor", metadata: AdvisorEnvelopeMetadata, sources: [...] })
  → JSON-serializable envelope
  → coerceSharedPayloadEnvelope(json) validates enums + metadata shape + privacy rules
  → Typed envelope for downstream transport
```

Privacy validator check list inside `coerceSharedPayloadEnvelope`:
1. Enum check on producer
2. Enum check on source kinds
3. Metadata shape: whitelist-only + range check on confidence/uncertainty + single-line check on skillLabel
4. Provenance source refs: reject `kind: "user-prompt"` and paths matching `/^sha256:[0-9a-f]+$/` without a file anchor prefix
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract
- [ ] Extend producer enum with `"advisor"`
- [ ] Extend source enum with `"skill-inventory"`, `"skill-graph"`, `"advisor-runtime"`
- [ ] Define `AdvisorEnvelopeMetadata` interface (whitelist per spec.md §4)

### Phase 2: Validator
- [ ] Update `coerceSharedPayloadEnvelope()` with advisor-metadata branch
- [ ] Add privacy validator (reject prompt-derived provenance)
- [ ] Add range checks on confidence/uncertainty and single-line check on skillLabel

### Phase 3: Tests
- [ ] Write 6 acceptance scenarios in `shared-payload-advisor.vitest.ts`
- [ ] Run full `mcp_server/tests/shared-payload*.vitest.ts` suite

### Phase 4: Verification
- [ ] `tsc --noEmit` clean
- [ ] `vitest run --reporter=verbose shared-payload-advisor` green
- [ ] All P0 checklist items marked with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Enum round-trip, metadata whitelist, privacy rejection | vitest |
| Regression | Existing shared-payload consumers (code-graph, startup-brief, compact-recovery) | vitest |
| Type | Compile-time exhaustive switch on new producer | tsc --noEmit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase 018 R4 envelope | Internal | Live |
| 020/001-initial-research | Research | Converged 2026-04-19 |
| vitest | Dev tool | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: `tsc --noEmit` regression across broad consumer tree OR existing shared-payload tests fail.

**Procedure**: revert the single commit; tests pre-revert are the authoritative contract. No runtime callers of the new enum exist yet (003-008 are not implemented), so rollback has zero downstream impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ──► Phase 2 (Validator) ──► Phase 3 (Tests) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract | 001 research converged | Validator |
| Validator | Contract | Tests |
| Tests | Validator | Verify |
| Verify | Tests | Child 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract | Low | 1-2 hours |
| Validator | Low-Med | 1-2 hours |
| Tests | Low | 1-2 hours |
| Verification | Low | 30 min |
| **Total** | | **4-7 hours (0.5-1 day)** |
<!-- /ANCHOR:effort -->
