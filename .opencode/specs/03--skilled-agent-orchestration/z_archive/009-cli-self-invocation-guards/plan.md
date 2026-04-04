---
title: "Implementation Plan: CLI Self-Invocation Guards [03--commands-and-skills/009-cli-self-invocation-guards/plan]"
description: "Plan for adding consistent self-invocation guard language across the CLI bridge skills."
trigger_phrases:
  - "implementation"
  - "plan"
  - "cli"
  - "self"
  - "invocation"
  - "009"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: CLI Self-Invocation Guards

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | CLI bridge skill guidance |
| **Storage** | Repository files only |
| **Testing** | Manual document review + spec validation |

### Overview
The plan applies one self-invocation guard pattern across the CLI bridge skills, then customizes each instance with runtime-specific native capabilities and detection hints. The work is documentation-only and focuses on preventing circular delegation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target CLI bridge skills identified.
- [x] Guard pattern defined.
- [x] Scope limited to documentation changes.

### Definition of Done
- [x] Guard language appears in all targeted skill docs.
- [x] Native-capability fallback guidance is present.
- [x] Spec folder validates structurally.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only guidance normalization.

### Key Components
- **Self-invocation guard**: tells the runtime not to delegate to itself.
- **NEVER rule**: states the anti-pattern explicitly.
- **Detection note**: references env vars or conceptual runtime checks where available.

### Data Flow
Runtime reads CLI bridge skill -> recognizes it is the targeted runtime -> uses native capabilities instead of self-delegating.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Review all four CLI bridge skills for existing guard language.
- [x] Define a common self-invocation pattern.

### Phase 2: Core Implementation
- [x] Update `cli-claude-code` guidance.
- [x] Add or update guard language in `cli-gemini`, `cli-codex`, and `cli-copilot`.
- [x] Reframe detection wording where available.

### Phase 3: Verification
- [x] Confirm all four targeted skills contain the guard pattern.
- [x] Confirm native-capability fallback guidance is present.
- [x] Validate the spec folder structure.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation review | Guard presence and wording | Manual inspection |
| Consistency review | Pattern alignment across four skills | Manual comparison |
| Structural validation | Spec folder | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing CLI bridge skill docs | Internal | Green | Guard language has nowhere to land |
| Runtime detection hints | Internal | Yellow | Some runtimes rely on conceptual guidance only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guard wording becomes misleading or inconsistent.
- **Procedure**: Revert the scoped skill-doc edits and reapply the shared pattern with corrected runtime wording.
<!-- /ANCHOR:rollback -->

---
