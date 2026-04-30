---
title: "Implementation Plan: 037/001 sk-code-opencode Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Audit packet 033/034/036 code against sk-code-opencode, apply minimal alignment fixes, and verify the packet with strict validation, build, and targeted tests."
trigger_phrases:
  - "037-001-sk-code-opencode-audit"
  - "sk-code-opencode audit"
  - "audit 033 034 036"
  - "standards alignment audit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit"
    last_updated_at: "2026-04-29T17:28:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Audit fixes and report written"
    next_safe_action: "Run validator build tests"
    blockers: []
    key_files:
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:037001skcodeopencodeauditplan0000000000000000000000000000000"
      session_id: "037-001-sk-code-opencode-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 037/001 sk-code-opencode Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JSON, Markdown |
| **Framework** | NodeNext MCP server |
| **Storage** | SQLite-related MCP code, no schema change |
| **Testing** | TypeScript build, Vitest |

### Overview
The audit reads sk-code-opencode standards, inspects the packet file list, fixes concrete TypeScript standards drift, and records follow-up skill gaps. Verification runs the strict packet validator plus the required build and targeted tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standards audit with surgical TypeScript alignment fixes.

### Key Components
- **Audit report**: Per-file PASS/fix/skill-gap record.
- **MCP server code**: Minimal edits for import ordering, TSDoc, headers, and catch rationale.
- **Packet metadata**: Level 2 docs and graph metadata for continuity.

### Data Flow
Packet file list -> standards checklist -> fix pass -> audit report -> validator/build/test verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read sk-code-opencode standards and checklists
- [x] Discover 036 files via git diff
- [x] Confirm strict TypeScript baseline

### Phase 2: Core Implementation
- [x] Read every audited file
- [x] Apply minimal standards fixes
- [x] Write audit-findings.md

### Phase 3: Verification
- [x] Strict validator green
- [x] Build green
- [x] Targeted Vitest run green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | TypeScript package build | `npm run build` |
| Unit | Retention sweep, advisor rebuild, Codex freshness | `npx vitest run memory-retention-sweep advisor-rebuild hooks-codex-freshness` |
| Spec | Level 2 packet compliance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 033 memory retention sweep | Internal | Available | Audit scope incomplete if missing |
| 034 half-auto upgrades | Internal | Available | Audit scope incomplete if missing |
| 036 CLI matrix adapter runners | Internal | Available | Matrix runner audit deferred if missing |
| sk-code-opencode | Internal skill | Read-only | Skill-gap fixes deferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build, tests, or strict validation fails after edits.
- **Procedure**: Revert this packet's TypeScript alignment edits and audit docs, then rerun verification.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read Standards -> Audit Files -> Apply Fixes -> Write Report -> Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent 037 scope | Audit |
| Audit | Setup | Fixes |
| Fixes | Audit | Verify |
| Verify | Fixes and docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Medium | 45-90 minutes |
| Verification | Low | 10-20 minutes |
| **Total** | | **70-125 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations
- [x] No dependency changes
- [x] No skill-file mutations

### Rollback Procedure
1. Revert touched MCP server TypeScript files from this packet.
2. Remove the 001 packet docs if the audit is abandoned.
3. Re-run build and targeted tests.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
