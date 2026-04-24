---
title: "Implementation [skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename/plan]"
description: "Plan for phase 006 under packet 041 covering the command-entrypoint rename, command-asset rename, wrapper rename, and packet-history sync."
trigger_phrases:
  - "041 phase 006 plan"
  - "recursive agent command rename plan"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Recursive Agent Command Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command docs, YAML workflows, TOML wrappers, packet markdown, JSON registry metadata |
| **Framework** | `sk-doc`, runtime wrapper surfaces, and system-spec-kit |
| **Storage** | Canonical command files plus packet docs and registry metadata |
| **Testing** | `validate_document.py`, TOML parse, `validate.sh --strict`, `rg` sweeps |

### Overview
This phase closes the last naming mismatch in the agent-improver program by renaming the command entrypoint itself. It renames the command markdown, YAML workflow assets, and wrapper TOMLs to the agent-improver family, updates runtime and skill references, and records that rename as phase `006`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is bounded to command-surface rename and packet-history sync
- [x] The renamed runtime mutator and aligned package from phase `005` are already in place
- [x] Current command references were identified before editing

### Definition of Done
- [x] Canonical command markdown, YAML assets, and wrapper TOMLs use the agent-improver family
- [x] Runtime docs and skill docs point at `/improve:agent-improver`
- [x] Root `041` and phase `006` validate strictly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-surface rename with wrapper and packet-history synchronization

### Key Components
- **Canonical command**: `.opencode/command/spec_kit/agent-improver.md`
- **Workflow assets**: `improve_agent-improver_auto.yaml` and `improve_agent-improver_confirm.yaml`
- **Runtime wrappers**: `.agents/commands/spec_kit/agent-improver.toml` and `.gemini/commands/spec_kit/agent-improver.toml`
- **Reference surfaces**: runtime agent docs, skill docs, README examples, and active packet docs
- **Packet docs**: phase `006` plus parent packet updates

### Data Flow
Rename the canonical command files first, update all command references second, then re-run command validation, TOML parsing, and strict packet validation so the rename is both structurally and historically consistent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the new `006-sk-improve-agent-command-rename/` phase packet
- [x] Identify all active command-name and command-path references before editing
- [x] Confirm the rename remains bounded to command surfaces and packet history

### Phase 2: Implementation

- [x] Rename the canonical command markdown file
- [x] Rename the YAML workflow asset files
- [x] Rename the runtime wrapper TOMLs
- [x] Update runtime docs, skill docs, README examples, and active packet docs to the new command name and path

### Phase 3: Verification

- [x] Run command document validation for the renamed command
- [x] Parse the renamed wrapper TOMLs and `descriptions.json`
- [x] Run strict validation for phase `006`
- [x] Run strict validation for root `041`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Renamed canonical command markdown | `validate_document.py --type command` |
| Parsing | Renamed wrapper TOMLs and `descriptions.json` | `python3.11` TOML and JSON parse |
| Validation | Root `041` and phase `006` packet docs | `validate.sh --strict` |
| Sweep | Removed command-name and command-path references | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc` command validator | Internal | Green | Renamed command cannot be proven structurally correct |
| Runtime wrapper TOMLs | Internal | Green | Wrapper rename cannot be proven safe |
| Parent packet `041` docs | Internal | Green | The rename cannot be recorded honestly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Renamed command files break wrapper parsing, validation, or packet integrity.
- **Procedure**: Restore the prior command filenames and wrapper names, then replay the rename in the order command markdown -> YAML assets -> wrappers -> references -> packet docs.

Future agent-improver work must continue as `007-*` and later child phases under `041-sk-improve-agent-loop/`.
<!-- /ANCHOR:rollback -->

---
