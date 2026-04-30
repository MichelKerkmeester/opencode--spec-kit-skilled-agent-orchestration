---
title: "Implementation Plan: Harness Telemetry Export Mode"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Extend the search-quality harness with optional in-memory telemetry preservation and opt-in JSONL export. The implementation stays in test infrastructure and adds a focused telemetry-mode test without changing runtime code or corpus fixtures."
trigger_phrases:
  - "024-harness-telemetry-export-mode"
  - "harness telemetry export"
  - "search quality telemetry mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/024-harness-telemetry-export-mode"
    last_updated_at: "2026-04-29T09:05:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored implementation plan for harness telemetry export mode"
    next_safe_action: "Extend harness types and add opt-in JSONL export"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts"
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Use three sibling JSONL files: envelopes, audit, shadow"
      - "Keep telemetry supplied directly by channel runner output"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Harness Telemetry Export Mode

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js ESM |
| **Framework** | Vitest test harness |
| **Storage** | Optional JSONL files under caller-provided temp/export path |
| **Testing** | `npx vitest run stress_test/search-quality/`, `npx tsc --noEmit` |

### Overview
Add an optional telemetry object to the search-quality runner output, preserve it through channel captures and per-case results, and export it only when `telemetryExportPath` is provided. The harness remains fixture-only and back-compatible: existing runners need no changes, and no runtime code or corpus fixtures are modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] REQ-001 telemetry fields propagate through harness types
- [x] REQ-002 opt-in export writes sibling JSONL files
- [x] REQ-003 existing search-quality tests pass unchanged
- [x] REQ-004 new telemetry-mode test passes
- [x] REQ-005 strict packet validator passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture harness extension with optional side-effect export.

### Key Components
- **Runner output telemetry**: Optional `telemetry` object supplied by a search-quality channel runner.
- **Channel capture telemetry**: Per-channel preservation of the runner-provided telemetry object.
- **Case telemetry aggregate**: Per-case arrays used by result assertions and JSONL export.
- **Export writer**: Appends envelopes, audit rows, and shadow rows to three sibling JSONL files when requested.

### Data Flow
A runner returns candidates plus optional telemetry. The harness normalizes candidates, copies telemetry into the channel capture, aggregates telemetry rows after all expected channels complete, and appends rows to `<base>.envelopes.jsonl`, `<base>.audit.jsonl`, and `<base>.shadow.jsonl` only when the caller sets `telemetryExportPath`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet spec and template requirements
- [x] Read harness, corpus, back-compat consumers, and telemetry type definitions
- [x] Create plan and tasks docs

### Phase 2: Core Implementation
- [x] Add telemetry type imports and optional telemetry fields
- [x] Add harness options type with `telemetryExportPath`
- [x] Append per-case telemetry to three sibling JSONL files
- [x] Preserve behavior when telemetry is absent or export path is omitted

### Phase 3: Verification
- [x] Add inline-corpus telemetry export test
- [x] Run all search-quality tests
- [x] Run TypeScript typecheck
- [x] Run strict packet validation
- [x] Write implementation summary and continuity update
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Telemetry preservation and export behavior | Vitest |
| Regression | Existing search-quality harness consumers | `npx vitest run stress_test/search-quality/` |
| Typecheck | Harness/test TypeScript contracts | `npx tsc --noEmit` |
| Spec validation | Packet documentation hygiene | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `SearchDecisionEnvelope` type | Internal | Green | Needed for envelope and audit row typing |
| `ShadowDeltaRecord` type | Internal | Green | Needed for shadow JSONL typing |
| Existing search-quality corpus | Internal | Green | Read-only baseline verification input |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing search-quality tests regress, typecheck fails, or telemetry export changes default harness behavior.
- **Procedure**: Revert the harness telemetry/export additions and remove the new telemetry-mode test while leaving packet docs with the failure evidence.
<!-- /ANCHOR:rollback -->
