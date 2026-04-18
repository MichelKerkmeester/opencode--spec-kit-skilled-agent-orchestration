---
title: "Feature Specification: Template/Validator Contract Alignment"
description: "Canonicalize validator rule registry, add semantic frontmatter validation, align anchor-check with preflight, repair malformed decision-record placeholder. From 019/001/006 joint audit."
trigger_phrases:
  - "validator contract alignment"
  - "rule registry canonicalization"
  - "semantic frontmatter validation"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T23:52:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Remediation child scaffolded from 019/001/006 audit"
    next_safe_action: "Dispatch implementation"
    blockers: []

---
# Feature Specification: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Review** | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/review-report.md |
| **Priority** | P1 |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (1 P1 + 3 P2) |
| **Status** | Spec Ready |
| **Effort Estimate** | 3-4 days |
| **Executor** | cli-codex gpt-5.4 high fast |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

019/001/006 audit found 4 findings on the template+validator joint surface:

- **P1-001**: `validate.sh show_help()` omits 7 live-dispatched rules (AI_PROTOCOLS, COMPLEXITY_MATCH, FOLDER_NAMING, FRONTMATTER_VALID, LINKS_VALID, SECTION_COUNTS, TEMPLATE_SOURCE). Packet prompts and operator invocations under-describe real enforcement.

- **P2-001**: Level 3 decision-record template ships malformed frontmatter description placeholder with stray comment terminator.

- **P2-002**: Template-audit surface mixes authored-template invariants with operational/save-time guards; 9 authored metadata field groups (title, description, trigger_phrases, importance_tier, contextType, completion_pct, open_questions, answered_questions, HVR_REFERENCE) are structurally unowned.

- **P2-004**: `check-anchors.sh` allows balanced duplicate anchor IDs while `preflight.ts` rejects them — packet validation and preflight disagree.

### Purpose

Land 5 ranked proposals from research:
1. Canonicalize rule registry: dispatch + severity + show_help() from one source
2. Semantic non-empty frontmatter + continuity validation
3. Align check-anchors.sh with preflight (reject duplicates)
4. Split authored-template coverage from operational reporting
5. Fix decision-record.md placeholder
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- **P1 rank 1** — Rule registry canonicalization: single source of truth for dispatch, severity, show_help
- **P1 rank 2** — Semantic non-empty frontmatter validation
- **P2 rank 3** — check-anchors.sh parity with preflight (reject duplicate IDs)
- **P2 rank 4** — Separate authored-template vs operational-rule reporting (lower priority, defer-able)
- **P2 rank 5** — Fix decision-record.md malformed description placeholder

### 3.2 Out of Scope

- Inventing new rule families
- Reopening P2-003 (TEMPLATE_SOURCE README parity already landed)

### 3.3 Files to Change

- `scripts/spec/validate.sh` — dispatch + show_help from registry
- `scripts/lib/validator-registry.ts` (NEW) — single source of truth
- `scripts/rules/check-frontmatter.sh` — semantic non-empty checks
- `scripts/rules/check-anchors.sh` — reject duplicate IDs
- `mcp_server/lib/validation/spec-doc-structure.ts:518-567` — `requiredPairs` semantic check
- `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` — fix placeholder
- Tests
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **REQ-001** (P1 rank 1): Rule registry becomes the single source; dispatch + severity + help derive from it
- **REQ-002** (P1 rank 2): Empty frontmatter `title`/`description`/`trigger_phrases` fails validation
- **REQ-003** (P2 rank 3): Duplicate anchor IDs rejected consistently by packet validation + preflight
- **REQ-004** (P2 rank 5): decision-record template placeholder is valid

### 4.2 P1 - Required

- **REQ-005** (P2 rank 4): Coverage matrix separates authored-template vs operational-rule reporting (defer-able)

### 4.3 Acceptance Scenarios

1. **Given** `validate.sh --help` is invoked, **when** rule help is rendered, **then** every registry rule appears with the same severity used by dispatch.
2. **Given** a spec document has empty required frontmatter, **when** `FRONTMATTER_VALID` runs, **then** validation exits with an error and names the empty fields.
3. **Given** `_memory.continuity.recent_action` is an empty string, **when** `FRONTMATTER_MEMORY_BLOCK` runs, **then** the TypeScript bridge treats it as missing.
4. **Given** duplicate opening anchor IDs are present, **when** `ANCHORS_VALID` runs, **then** packet validation fails with the same uniqueness invariant as preflight.
5. **Given** the Level 3 decision-record template is read, **when** frontmatter is parsed, **then** the description is valid prose without a stray comment terminator.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `validate.sh show_help()` lists exactly the rules that dispatch runs
- [ ] Empty frontmatter fields fail validation with clear error
- [ ] Duplicate anchor IDs fail packet validation (not just preflight)
- [ ] `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` frontmatter valid
- [ ] Full regression suite green
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Registry refactor changes rule-names | Preserve public rule IDs for script compat |
| Semantic frontmatter check breaks legacy packets | Grandfathering allowlist for a cutoff window |
| Duplicate-anchor rejection surfaces latent issues | Pre-scan active packets, surface list before release |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Canonicalization scope: just `validate.sh`, or include `.opencode/skill/system-spec-kit/scripts/rules/README.md` as generated doc?
- Grandfathering cutoff for semantic frontmatter validation?
<!-- /ANCHOR:questions -->
