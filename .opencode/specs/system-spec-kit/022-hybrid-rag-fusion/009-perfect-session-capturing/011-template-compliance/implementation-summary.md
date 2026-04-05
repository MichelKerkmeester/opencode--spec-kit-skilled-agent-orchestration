---
title: "...--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/011-template-compliance/implementation-summary]"
description: "Live template compliance now comes from the current templates, not draft sidecar files."
trigger_phrases:
  - "template compliance"
importance_tier: "important"
contextType: "general"
---
# Implementation Summary: Template Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-template-compliance |
| **Completed** | 2026-03-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Template compliance is now enforced from the live level templates that already exist in the repo. The validator no longer depends on draft `.fingerprint` sidecars or stale prompt-builder assumptions. Instead, one shared helper resolves required headers, optional headers, required anchor order, and allowed anchor IDs from the active template file at runtime, and both structural rules consume that same contract.

The runtime prompt side now matches the validator. The shared `.agents` runtime plus the OpenCode x2, Claude, and Gemini speckit agents now instruct writers to include inline scaffolds for the exact doc being authored and to run `validate.sh [SPEC_FOLDER] --strict` immediately after spec-doc writes. The `/spec_kit` plan, implement, and complete workflows now carry the same scaffold contract and strict post-write validation step.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skill/system-spec-kit/scripts/utils/template-structure.js | Created | Shared live template contract parsing/comparison |
| .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh | Modified | Enforce required header presence/order and checklist format |
| .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh | Modified | Enforce required anchor presence/order from live templates |
| .opencode/skill/system-spec-kit/scripts/spec/validate.sh | Modified | Promote `TEMPLATE_HEADERS` structural failures to errors |
| `.agents/agents/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
| `.opencode/agent/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
| `.claude/agents/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
| `.gemini/agents/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
| .opencode/command/spec_kit/assets/spec_kit_{plan,implement,complete}_{auto,confirm}.yaml | Modified | Embed scaffold contracts and strict validation steps |
| System-spec-kit fixture and test lanes under `.opencode/skill/system-spec-kit/scripts/` | Created/Modified | Add compliant/mutation fixture lanes and targeted coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The work landed in three passes. First, the shared template helper and validator wiring were added so normal validation could fail on genuine structural drift while still warning on appended custom sections. Second, the runtime speckit surfaces were updated so agent-authored docs receive inline scaffold guidance and strict post-write validation instead of path-only template references. Third, new compliant and mutation fixtures were added so the coverage lane could prove pass, warn, and fail behavior against the live template contract.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Derive structure from live template files at runtime | The repo already has canonical templates, so adding `.fingerprint` sidecars would duplicate state and drift |
| Keep extra custom sections as warnings in normal mode | The plan called for appended custom content to remain allowed as long as required structure stays intact |
| Update `.agents`, OpenCode x2, Claude, and Gemini runtime docs, but not invent a Codex file | A missing runtime file should be reported honestly instead of silently creating unsupported surface area |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts` | PASS |
| `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2 --strict` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header` | PASS with warnings |
| `bash .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh -c "Positive Tests"` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh -c "Individual Rule: TEMPLATE_HEADERS"` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. No separate Codex runtime speckit agent document exists under the workspace or `/Users/michelkerkmeester/.codex`, so Codex parity is documented as an absence rather than patched as a file.
2. The broader historical shell suites still contain many legacy minimalist fixtures. This phase updated the targeted template-compliance categories to the new compliant/mutation lane rather than rewriting every older fixture family in one pass.
<!-- /ANCHOR:limitations -->


Reference links: [spec.md](spec.md) and [plan.md](plan.md).
---

<!-- ANCHOR:limitations -->
## Known Limitations

No known limitations.
<!-- /ANCHOR:limitations -->
