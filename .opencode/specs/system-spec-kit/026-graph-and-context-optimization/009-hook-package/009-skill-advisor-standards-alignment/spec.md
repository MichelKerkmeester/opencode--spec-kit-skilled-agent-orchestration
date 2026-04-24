---
title: "F [system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/spec]"
description: "Two-part standards alignment from packet 008 audit: (A) add OpenCode Plugin Exemption Tier to sk-code-opencode quality_standards.md + javascript_checklist.md (recognizes ESM is required for plugins, not a violation of CommonJS rule); (B) bring spec-kit-skill-advisor.js into alignment with non-exempt standards (box header COMPONENT/PURPOSE fields, JSDoc on default export + helpers, numbered ALL-CAPS section dividers mirroring sibling compact plugin)."
trigger_phrases:
  - "skill advisor standards alignment"
  - "opencode plugin exemption tier"
  - "sk-code-opencode esm exemption"
  - "skill advisor jsdoc"
  - "skill advisor box header"
  - "026/009/009"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment"
    last_updated_at: "2026-04-23T10:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Completed documentation/cosmetic standards alignment"
    next_safe_action: "Dispatch implementation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "OpenCode plugins MUST be ESM per @opencode-ai/plugin/dist/index.d.ts:23"
      - "sk-code-opencode CommonJS rule conflicts with plugin loader contract"
      - "Plugin file has 3 small alignment gaps: header fields, JSDoc, section dividers"
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Skill-Advisor Standards Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

Packet 008 audit surfaced one standards gap and three plugin alignment items. This packet addresses both in one focused pass. No behavior change; documentation + code-cosmetic only.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (standards alignment, no behavior change) |
| **Status** | Complete |
| **Created** | 2026-04-23 |
| **Parent** | `026-graph-and-context-optimization/009-hook-package/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../008-skill-advisor-plugin-hardening/spec.md` |
| **Successor** | `../010-copilot-wrapper-schema-fix/spec.md` |
| **Related** | `008-skill-advisor-plugin-hardening/` (audit source) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two findings from the packet 008 audit:

1. **sk-code-opencode CommonJS rule conflicts with OpenCode plugin loader contract.** The skill's the JavaScript checklist P1 item requires `module.exports`, but `@opencode-ai/plugin/dist/index.d.ts:23` requires ESM default export. All plugins (`spec-kit-skill-advisor.js`, `spec-kit-compact-code-graph.js`) and helpers (`spec-kit-*-bridge.mjs`, `spec-kit-opencode-message-schema.mjs`) MUST use ESM or the loader rejects them. The standard already has a parallel "Test File Exemption Tier" — needs an analogous "OpenCode Plugin Exemption Tier."

2. **`spec-kit-skill-advisor.js` has 3 small gaps against non-exempt standards.** Box header at line 1-3 is missing `COMPONENT:` and `PURPOSE:` fields the standard requires. The default-export plugin factory (`SpecKitSkillAdvisorPlugin` line 291) and ~5-6 internal helpers lack JSDoc. The file has no numbered ALL-CAPS section dividers (`// 1. CONSTANTS`, `// 2. UTILITIES`, etc.) — its sibling `spec-kit-compact-code-graph.js` does follow that pattern.

### Purpose

Reconcile the standard with the OpenCode plugin contract reality, AND bring the skill-advisor plugin file fully into alignment with everything that does apply.

### Non-goals

- No behavior change to the plugin (no logic edits, no test changes).
- No changes to the compact plugin (already standards-compliant on these axes).
- No changes to plugin-helpers/ (covered by the new exemption tier).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skill/sk-code-opencode/references/javascript/quality_standards.md` — add §10 OpenCode Plugin Exemption Tier (mirrors §9 Test File Exemption Tier structure)
- `.opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md` — add a one-paragraph note next to the CommonJS P1 item pointing at the new exemption
- `.opencode/plugins/spec-kit-skill-advisor.js` — add `COMPONENT:`/`PURPOSE:` lines to box header; add JSDoc to default export and missing helpers; add numbered ALL-CAPS section dividers mirroring compact plugin's pattern

### Out of Scope

- `.opencode/plugins/spec-kit-compact-code-graph.js` (already compliant)
- `.opencode/plugin-helpers/*` (covered by new exemption)
- Any behavior change in the plugin
- New tests (no behavior change → existing 30 tests are sufficient regression)

### Files Expected to Change

| Path | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skill/sk-code-opencode/references/javascript/quality_standards.md` | Modify | Append §10 OpenCode Plugin Exemption Tier |
| `.opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md` | Modify | Annotate CommonJS P1 item with link to new exemption |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | Header fields + JSDoc + section dividers (no logic change) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OpenCode Plugin Exemption Tier added to standards | the quality standards reference has new §10 mirroring §9 structure; explains ESM is required by `@opencode-ai/plugin`; lists CommonJS rule as exempted; clarifies all other standards still apply |
| REQ-002 | Checklist updated to point at exemption | the JavaScript checklist CommonJS P1 item has annotation linking to the quality standards reference §10 |
| REQ-003 | Plugin file box header complete | Box header at lines 1-3 of `spec-kit-skill-advisor.js` includes `COMPONENT:` and `PURPOSE:` fields per standard |
| REQ-004 | No behavior change | All 30 existing skill-advisor vitest tests still pass; no logic edits in plugin file |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | JSDoc on default export | `SpecKitSkillAdvisorPlugin` (line ~291) has JSDoc covering ctx + options params and returned `Hooks` shape |
| REQ-006 | JSDoc on key internal helpers | At minimum: `getAdvisorContext`, `runBridge`, `appendAdvisorBrief`, `clampPrompt`, `clampBrief`, `insertWithEviction` have JSDoc |
| REQ-007 | Numbered ALL-CAPS section dividers | Plugin file has divider comments matching compact plugin's pattern (e.g., `// 1. IMPORTS`, `// 2. CONSTANTS`, `// 3. STATE TYPES`, `// 4. UTILITIES`, `// 5. PLUGIN`) |
| REQ-008 | Strict spec validation | `validate.sh --strict` returns 0/0 on this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running the packet 008 standards audit against `spec-kit-skill-advisor.js` produces zero standards-violation findings.
- **SC-002**: Re-running the audit against `.opencode/plugins/*` and `.opencode/plugin-helpers/*` recognizes ESM as exempt (no CommonJS finding).
- **SC-003**: All 30 skill-advisor vitest tests pass unchanged.
- **SC-004**: Strict spec validation 0/0 on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | JSDoc/section-divider edits accidentally touch logic | All edits should be additive comments or header reorganization only; vitest 30/30 is the regression guard |
| Risk | Exemption wording is too broad and excuses real CommonJS violations elsewhere | Scope explicitly to `.opencode/plugins/` and `.opencode/plugin-helpers/`; mirror §9 Test File Exemption Tier structure for precedent |
| Dependency | sk-code-opencode skill structure (sections, checklist format) | Already mature; just append in §9-style |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The exemption pattern is established (§9 Test File Exemption Tier), the plugin file gaps are mechanical, and the audit findings are unambiguous.

### Acceptance Scenarios

- **Given** the new §10 OpenCode Plugin Exemption Tier in the quality standards reference, **When** a future review audits `.opencode/plugins/spec-kit-skill-advisor.js`, **Then** the ESM `import`/`export default` is recognized as exempt from the CommonJS P1 rule.
- **Given** the updated plugin file with `COMPONENT:`/`PURPOSE:` header, JSDoc on default export and key helpers, and numbered ALL-CAPS section dividers, **When** the same audit re-runs, **Then** zero standards-violation findings remain on these axes.
- **Given** documentation/cosmetic edits only (no logic change), **When** the focused vitest suite runs, **Then** all 30 tests still pass.
<!-- /ANCHOR:questions -->

---

**Related documents**:

- Audit source: in-conversation analysis 2026-04-23 against the quality standards reference and the JavaScript checklist
- Sibling reference: `.opencode/plugins/spec-kit-compact-code-graph.js` (already follows section-divider pattern)
- OpenCode contract: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:23`
- Source packet (audit): `../008-skill-advisor-plugin-hardening/`
