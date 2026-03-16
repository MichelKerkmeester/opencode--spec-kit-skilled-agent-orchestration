---
title: "Implementation Plan: Template Compliance"
description: "Live template contract derivation, validator hardening, runtime prompt updates, and targeted coverage."
trigger_phrases:
  - "template compliance"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Template Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, CommonJS, Vitest, Markdown/YAML agent assets |
| **Framework** | system-spec-kit validator and command runtime |
| **Storage** | Live template files under `templates/level_*` |
| **Testing** | Shell validation runs, Node assertion script, Vitest |

### Overview
The implementation replaces the draft sidecar-fingerprint idea with one runtime helper that resolves the active template contract directly from the existing level templates. Validator rules consume that contract for header and anchor enforcement, while runtime speckit agents and workflow assets now carry inline scaffold guidance and strict post-write validation so spec docs are checked immediately after authoring.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent `010` docs and phases `001` through `009` reviewed as context
- [x] Actual runtime surfaces identified (`.opencode`, `.claude`, `.gemini`; no separate Codex speckit file present)
- [x] Draft-phase mismatches identified (`.fingerprint` sidecars, stale prompt-builder reference)

### Definition of Done
- [x] Shared live template contract helper shipped
- [x] Header and anchor validators enforce live structural requirements
- [x] Runtime speckit prompts include inline scaffold guidance and strict post-write validation
- [x] Targeted fixture, shell, and Vitest coverage added
- [x] `012-template-compliance` docs updated to reflect the shipped design
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source template contract derivation with shared validator and prompt enforcement.

### Key Components
- **`template-structure.js`**: Resolves template path by level/basename, parses required/optional headers, derives ordered required anchors, and compares docs against the live contract
- **`check-template-headers.sh`**: Consumes the shared contract, fails missing/out-of-order required headers, preserves warning-only behavior for extra custom headers, and enforces checklist H1 / `CHK-NNN` format
- **`check-anchors.sh`**: Validates anchor balance plus ordered required anchor presence/order against the same live contract
- **Runtime speckit agents and YAML assets**: Carry inline scaffold snippets and require `validate.sh [SPEC_FOLDER] --strict` after spec-doc writes
- **Targeted fixtures/tests**: Provide one compliant Level 2 folder and focused mutation folders for warning/error paths

### Data Flow
1. `validate.sh` determines level and runs rules.
2. Template rules call `template-structure.js` with level + basename to load the active template contract.
3. Header and anchor rules compare the real document against the shared contract and return pass/warn/fail.
4. Runtime speckit prompts instruct agents to write from inline scaffolds, then run `validate.sh --strict` before continuing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Live Contract Runtime
- [x] Add `template-structure.js`
- [x] Support level normalization and template path resolution
- [x] Derive required/optional headers and allowed anchor IDs from live templates

### Phase 2: Validator Hardening
- [x] Wire shared contract into `check-template-headers.sh`
- [x] Wire shared contract into `check-anchors.sh`
- [x] Promote `TEMPLATE_HEADERS` structural failures to errors in `validate.sh`

### Phase 3: Runtime Prompt Hardening
- [x] Update the shared/OpenCode runtime speckit agent docs under `.agents/agents/` and `.opencode/agent/`
- [x] Update the Claude and Gemini runtime speckit agent docs
- [x] Update `/spec_kit` plan, implement, and complete auto/confirm assets with inline scaffolds and strict post-write validation

### Phase 4: Verification
- [x] Add compliant and mutated fixtures `053` through `060`
- [x] Add `template-structure.vitest.ts`
- [x] Extend workflow assertion coverage in `test-phase-command-workflows.js`
- [x] Update shell test suites to use the compliant/mutation fixture set for template-compliance paths
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Template path resolution, required header/anchor extraction, optional-template allowance, dynamic decision-record handling | `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts` |
| Integration | Runtime agent and workflow prompt assertions | `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js` |
| Integration | Compliant fixture strict validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../053-template-compliant-level2 --strict` |
| Integration | Warning/failure fixtures and targeted shell suite categories | `test-validation.sh`, `test-validation-extended.sh` targeted categories |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `templates/level_*` | Internal | Green | Shared contract cannot resolve structure |
| Existing validator entrypoint | Internal | Green | Template errors cannot be surfaced consistently |
| Runtime speckit agent assets | Internal | Green | Prompt guidance would stay path-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live template comparison causes false positives on compliant spec docs
- **Procedure**: Revert the shared helper and validator rule wiring, then restore the previous prompt/workflow text
- **Fallback**: Keep the fixture and test additions to preserve a clear reproduction lane for the regression
<!-- /ANCHOR:rollback -->
