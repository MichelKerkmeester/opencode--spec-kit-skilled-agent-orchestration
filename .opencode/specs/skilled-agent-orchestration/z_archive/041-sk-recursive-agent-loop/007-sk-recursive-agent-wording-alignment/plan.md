---
title: "Implementation [skilled-agent-orchestration/041-sk-recursive-agent-loop/007-sk-recursive-agent-wording-alignment/plan]"
description: "Plan for phase 007 under packet 041 covering wording cleanup across the current agent-improver package, runtime mirrors, wrapper prompts, and active packet docs."
trigger_phrases:
  - "041 phase 007 plan"
  - "recursive agent wording alignment plan"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/007-sk-recursive-agent-wording-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Recursive Agent Wording Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, TOML wrappers, and JSON registry metadata |
| **Framework** | `sk-doc`, runtime wrapper surfaces, and system-spec-kit |
| **Storage** | Recursive-agent source docs, runtime mirrors, and packet docs |
| **Testing** | `validate_document.py`, TOML parse, `validate.sh --strict`, `rg` sweeps |

### Overview
This phase cleans up wording across the current agent-improver program. It improves clarity in the source skill package, runtime mirrors, wrapper prompts, and parent packet docs while keeping the shipped behavior and historical evidence intact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is bounded to wording cleanup on current agent-improver surfaces
- [x] Historical `research/` and `memory/` artifacts are explicitly out of scope
- [x] Current wording issues were identified before editing

### Definition of Done
- [x] Source package docs and references read more clearly
- [x] Command and runtime mirrors use accurate runtime-specific wording
- [x] Root `041` and phase `007` validate strictly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Wording-only cleanup across current source, mirror, and packet surfaces

### Key Components
- **Source package**: `.opencode/skill/sk-improve-agent/`
- **Canonical command**: `.opencode/command/spec_kit/agent-improver.md`
- **Wrapper prompts**: `.agents/commands/spec_kit/agent-improver.toml` and `.gemini/commands/spec_kit/agent-improver.toml`
- **Runtime mirrors**: agent-improver files under OpenCode, Claude, Gemini, `.agents`, and Codex
- **Packet docs**: phase `007` plus root packet `041`

### Data Flow
Read the current agent-improver source and mirror surfaces first, update wording without changing behavior, then re-run document validation, TOML parsing, and strict packet validation so the cleanup is both accurate and auditable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the new `007-sk-improve-agent-wording-alignment/` phase packet
- [x] Identify the current agent-improver surfaces with awkward or inaccurate wording before editing
- [x] Confirm the wording pass remains bounded to current agent-improver surfaces and active packet docs

### Phase 2: Implementation

- [x] Clean up wording in the source skill package and reference docs
- [x] Clean up wording in the canonical command and mirrored wrapper prompts
- [x] Clean up wording in the runtime agent mirrors and fix runtime-path wording bugs
- [x] Update root `041` docs and phase metadata to record the wording-alignment pass

### Phase 3: Verification

- [x] Run document validation for the updated skill and command surfaces
- [x] Parse the updated wrapper TOMLs and `descriptions.json`
- [x] Run strict validation for phase `007`
- [x] Run strict validation for root `041`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Updated skill docs and references | `validate_document.py` |
| Validation | Updated command doc | `validate_document.py --type command` |
| Parsing | Updated wrapper TOMLs and registry metadata | `python3.11` |
| Validation | Root `041` and phase `007` packet docs | `validate.sh --strict` |
| Sweep | Remaining current-surface wording regressions | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current `sk-improve-agent` source docs | Internal | Green | Wording cleanup cannot be applied cleanly |
| Runtime mirror files | Internal | Green | Runtime-specific guidance would remain inconsistent |
| Parent packet `041` docs | Internal | Green | The wording pass would not be recorded honestly |
| `sk-doc` validators | Internal | Green | Wording cleanup could not be proven template-safe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validators fail, runtime wording becomes inconsistent, or a wording edit changes the stated behavior incorrectly.
- **Procedure**: Restore the affected wording surfaces to the previous phase-`006` state, repair the inaccurate edits, then re-run the validation stack.

Future work must continue inside `041-sk-improve-agent-loop/` as additional child phases such as `008-*` and later folders.
<!-- /ANCHOR:rollback -->

---
