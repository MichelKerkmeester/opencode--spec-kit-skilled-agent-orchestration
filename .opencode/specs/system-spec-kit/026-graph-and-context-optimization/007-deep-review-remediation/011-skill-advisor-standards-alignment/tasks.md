---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Task Breakdown: Skill-Advisor Standards Alignment"
description: "Tasks T-01..T-08: standards exemption, plugin file alignment, verification."
trigger_phrases:
  - "026/007/011 tasks"
  - "skill advisor standards alignment tasks"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/011-skill-advisor-standards-alignment"
    last_updated_at: "2026-04-23T10:52:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed T-01 through T-08 with verification evidence"
    next_safe_action: "Use /spec_kit:resume if continuing the parent remediation packet"
    completion_pct: 100
---
# Task Breakdown: Skill-Advisor Standards Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending; `[x]` complete with evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-01** Read `.opencode/skill/sk-code-opencode/references/javascript/quality_standards.md` §9 Test File Exemption Tier and the JavaScript checklist asset to confirm the exemption pattern. [EVIDENCE: §9 structure mirrored: Scope, Exempted Standards table, What Still Applies, and Example/Brief Example; CommonJS P1 item found under `### CommonJS Exports` in the JavaScript checklist.]
- [x] **T-02** Read `.opencode/plugins/spec-kit-compact-code-graph.js` lines 1-50 to confirm the section-divider pattern that will be mirrored in the skill-advisor file. [EVIDENCE: divider format mirrored as separator / `// N. ALL-CAPS TITLE` / separator.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-03** Append §10 OpenCode Plugin Exemption Tier to the quality standards reference mirroring §9 structure (scope, exempted-standards table, what-still-applies, brief example). [EVIDENCE: `opencode-plugin-exemption-tier` anchor exists; exempted standards table lists only `module.exports` with the OpenCode ESM-loader reason; Related Resources renumbered to §11.]
- [x] **T-04** Annotate the CommonJS P1 item in the JavaScript checklist with a one-line note pointing at the new exemption. [EVIDENCE: note text references §10 OpenCode Plugin Exemption Tier in the quality standards reference.]
- [x] **T-05** Update `spec-kit-skill-advisor.js` box header to include `COMPONENT:` and `PURPOSE:` lines matching the standard format. [EVIDENCE: plugin header now contains `COMPONENT: Spec Kit Skill Advisor OpenCode Plugin` and a multi-line `PURPOSE:` block.]
- [x] **T-06** Insert numbered ALL-CAPS section dividers in `spec-kit-skill-advisor.js` mirroring the compact plugin's pattern. [EVIDENCE: 6 dividers added: `IMPORTS`, `CONSTANTS`, `PURE UTILITIES`, `SIZE-CAP HELPERS`, `EVENT HELPERS`, `PLUGIN FACTORY`; before/after diff confirms no logic moved or modified.]
- [x] **T-07** Add JSDoc to `SpecKitSkillAdvisorPlugin` (default export) plus `getAdvisorContext`, `runBridge`, `appendAdvisorBrief`, `clampPrompt`, `clampBrief`, `insertWithEviction`. [EVIDENCE: 7 new JSDoc blocks above the required functions.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-08** Run regression + validation gates:
  - `node --check .opencode/plugins/spec-kit-skill-advisor.js`
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`
  - `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` → expect 30/30
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → expect 0/0
  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` → expect exit 0
  - Update `implementation-summary.md` with outcome; update parent handover with 011 row.
  [EVIDENCE: `node --check` exit 0; `npm run build` exit 0; focused Vitest 30/30; strict validation 0 errors / 0 warnings; `generate-context.js --json` exit 0 with deferred embedding fallback; implementation summary and parent handover updated.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 + P1 items in spec.md have evidence in implementation-summary.md.
- Vitest still 30/30; build clean; validate strict 0/0.
- No logic edits in plugin file (diff is comments + JSDoc + section dividers + box-header fields only).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Implementation summary: `implementation-summary.md`
- Audit source: in-conversation analysis 2026-04-23
- Sibling reference: `.opencode/plugins/spec-kit-compact-code-graph.js`
<!-- /ANCHOR:cross-refs -->
