---
title: "Implementation Plan: Deferred Remediation + Telemetry Measurement Run"
description: "Delivery plan for Phase 024: Codex registration, static predicted-route measurement, live-session wrapper and analyzer."
trigger_phrases:
  - "024 plan"
  - "telemetry measurement plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/024-deferred-remediation-and-telemetry-run"
    last_updated_at: "2026-04-19T18:10:00Z"
    last_updated_by: "codex"
    recent_action: "Plan aligned with Level 2 template"
    next_safe_action: "Codex config retry"
    blockers:
      - ".codex writes denied"
    key_files:
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts"
    completion_pct: 85
---
# Implementation Plan: Deferred Remediation + Telemetry Measurement Run

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Bash, JSON |
| **Framework** | Spec Kit scripts and MCP server Vitest |
| **Storage** | JSONL telemetry under `.opencode/skill/.smart-router-telemetry/` |
| **Testing** | Vitest, TypeScript noEmit, strict spec validation |

### Overview
Phase 024 adds predicted-route measurement and live-session telemetry tooling around the existing smart-router system. Runtime code from Phases 020-023 stays unchanged; the new code imports shipped primitives and records only observe-only data.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Required predecessor files identified

### Definition of Done
- [x] Tracks 2-4 implemented
- [x] Tests passing for new code
- [x] Static 200-prompt report generated
- [ ] Track 1 config files created under `.codex`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive observability scripts over existing advisor and telemetry primitives.

### Key Components
- **Measurement harness**: runs corpus prompts through `buildSkillAdvisorBrief` and predicts SMART ROUTING resource sets.
- **Live wrapper**: records runtime `Read` tool calls against predicted resources.
- **Analyzer**: aggregates compliance JSONL into markdown.
- **Reports**: preserve predicted-route methodology and caveats.

### Data Flow
Corpus prompt or live prompt selects a skill, smart-router parsing predicts allowed resources, telemetry records JSONL, and analyzer summarizes compliance classes and route-size metrics.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read predecessor docs and shipped primitives.
- [B] Add Codex registration files if the sandbox permits `.codex` writes.

### Phase 2: Core Implementation
- [x] Port smart-router parser logic into TypeScript.
- [x] Implement static measurement summary and report.
- [x] Implement live-session observe-only wrapper.
- [x] Implement telemetry analyzer.

### Phase 3: Verification
- [x] Run targeted tests.
- [x] Run typechecks.
- [x] Run full static corpus.
- [B] Run strict validation to pass state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Measurement and analyzer fixtures | Vitest |
| Integration | 200-prompt corpus and analyzer report | Node with tsx loader |
| Regression | Phase 020 advisor and hook surface | Vitest targeted suite |
| Validation | Spec folder structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 advisor producer | Internal | Green | Static harness cannot compute top-1 skill |
| Phase 023 telemetry primitive | Internal | Green | Wrapper/analyzer cannot share compliance schema |
| `.codex` directory writability | Filesystem | Red | Track 1 cannot create registration files |
| validator compiled JS runtime | Tooling | Yellow | Strict validation can fail before rule output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Measurement or analyzer reports corrupt output, or live wrapper blocks runtime behavior.
- **Procedure**: Remove the new observability files and reports from the phase; no runtime files need rollback because Phase 020-023 code was not modified.
<!-- /ANCHOR:rollback -->
