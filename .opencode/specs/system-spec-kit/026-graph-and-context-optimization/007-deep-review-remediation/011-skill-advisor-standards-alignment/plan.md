---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
title: "Implementation Plan: Skill-Advisor Standards Alignment"
description: "Single focused pass: append exemption tier to standards docs, then add header fields/JSDoc/section dividers to plugin file. No behavior change. Vitest 30/30 is the regression guard."
trigger_phrases:
  - "026/007/011 plan"
  - "skill advisor standards alignment plan"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/011-skill-advisor-standards-alignment"
    last_updated_at: "2026-04-23T10:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan drafted"
    next_safe_action: "Dispatch codex"
    completion_pct: 5
---
# Implementation Plan: Skill-Advisor Standards Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two-part standards alignment. Part A updates sk-code-opencode to recognize OpenCode plugins must be ESM (new exemption tier). Part B brings the skill-advisor plugin file into alignment with non-exempt standards (header fields, JSDoc, section dividers). No behavior change; existing 30 vitest assertions are the regression guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Pass Criteria |
|------|---------------|
| Standards exemption added | the quality standards reference has §10 OpenCode Plugin Exemption Tier mirroring §9 structure |
| Checklist annotated | the JavaScript checklist CommonJS P1 has note pointing at exemption |
| Plugin header complete | `COMPONENT:` and `PURPOSE:` lines in box header |
| Plugin JSDoc | Default export + 6 internal helpers have JSDoc |
| Plugin section dividers | Numbered ALL-CAPS dividers (mirrors compact plugin's pattern) |
| Vitest regression | All 30 skill-advisor tests still pass |
| Build | `npm run build` clean |
| Strict spec validation | 0/0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Technical Context

sk-code-opencode is a multi-language standards skill versioned at v1.2.0.0. Its JavaScript references and checklists are the contract that codify what plugin code must satisfy. The OpenCode plugin runtime (`@opencode-ai/plugin` v1.3.15 installed under OpenCode binary 1.3.17) requires ESM default-export factory functions returning a `Hooks` object — making CommonJS strictly incompatible with plugin loading. The standard already has §9 Test File Exemption Tier as precedent for exempting specific file paths from specific rules; §10 OpenCode Plugin Exemption Tier follows that pattern.

The skill-advisor plugin file follows ESM conventions (necessarily) but its file structure (header, JSDoc, section dividers) lags behind its sibling compact-code-graph plugin. This packet brings them into structural parity.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Standards exemption (sk-code-opencode)

1. Append §10 to the quality standards reference after §9 Test File Exemption Tier. Use the same structure: scope, exempted standards table, what still applies, example. Scope = `.opencode/plugins/*.{js,mjs,ts}` and `.opencode/plugin-helpers/*.{js,mjs,ts}`. Exempted = CommonJS `module.exports` requirement (only). Reason = OpenCode plugin loader requires ESM per `@opencode-ai/plugin/dist/index.d.ts`.
2. In the JavaScript checklist, add a one-line note next to the CommonJS P1 item: "**Exception**: OpenCode plugins (`.opencode/plugins/`, `.opencode/plugin-helpers/`) must use ESM — see the quality standards reference §10."

### Phase 2: Plugin file alignment (`spec-kit-skill-advisor.js`)

1. Update box header (lines 1-3) to include `COMPONENT:` and `PURPOSE:` lines. Keep the decorative box style.
2. Insert numbered ALL-CAPS section dividers mirroring compact plugin's structure. Suggested layout:
   - `// 1. IMPORTS`
   - `// 2. CONSTANTS`
   - `// 3. PURE UTILITIES` (normalizers, hash, parsers)
   - `// 4. SIZE-CAP HELPERS` (clampPrompt, clampBrief, insertWithEviction)
   - `// 5. EVENT HELPERS` (eventTypeFrom, etc.)
   - `// 6. PLUGIN FACTORY` (default export and all closure helpers)
3. Add JSDoc:
   - `SpecKitSkillAdvisorPlugin(ctx, rawOptions)` — params + Hooks return shape
   - `getAdvisorContext({ ... })` — params + return + cache/dedup behavior
   - `runBridge({ ... })` — bridge subprocess contract
   - `appendAdvisorBrief(input, output)` — OpenCode hook signature
   - `clampPrompt(prompt, maxBytes)` — byte-aware truncation
   - `clampBrief(brief, maxChars)` — char-count truncation
   - `insertWithEviction(cache, key, value, maxEntries)` — LRU eviction
4. Do NOT touch any logic, identifier, or test. Pure documentation/cosmetic edits.

### Phase 3: Verify

1. `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` → expect 30/30.
2. `npm run build` in mcp_server → clean.
3. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → 0/0.
4. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for canonical save.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No new tests. Existing 30 skill-advisor vitest cases are the regression guard. If any fail, the cosmetic edits accidentally touched logic — back out.

`node --check .opencode/plugins/spec-kit-skill-advisor.js` validates JSDoc/comment edits don't break syntax (no JS comment can break parsing, but defense-in-depth).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Packet 010 baseline (30 tests passing) | Shipped |
| sk-code-opencode v1.2.0.0 §9 Test File Exemption Tier as template | Exists |
| Compact plugin section-divider pattern as reference | Exists at `.opencode/plugins/spec-kit-compact-code-graph.js` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the single commit. Pure documentation/cosmetic; no live state, no MCP restart needed.
<!-- /ANCHOR:rollback -->
