---
title: "Implemen [skilled-agent-orchestration/041-sk-recursive-agent-loop/005-sk-recursive-agent-package-runtime-alignment/plan]"
description: "Plan for phase 005 under packet 041 covering stricter template alignment, runtime agent rename, command alignment, and .agents mirror sync."
trigger_phrases:
  - "041 phase 005 plan"
  - "recursive agent package runtime alignment plan"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/005-sk-recursive-agent-package-runtime-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Recursive Agent Package and Runtime Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, JSON/JSONC config, YAML workflows, JavaScript CommonJS scripts, TOML wrappers |
| **Framework** | `sk-doc`, `sk-code-opencode`, and system-spec-kit |
| **Storage** | Recursive-agent package surfaces plus packet docs and registry metadata |
| **Testing** | `package_skill.py --check`, `validate_document.py`, `node --check`, `validate.sh --strict`, `python3` JSON parse |

### Overview
This phase corrects the gap between validator-clean output and exact template-faithful packaging. It normalizes the agent-improver source package, renames the mutator to `agent-improver` across runtimes, aligns the command and wrappers, resynchronizes the `.agents` skill mirror, and records that correction as phase `005`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is bounded to package and runtime alignment
- [x] Required templates and source files identified
- [x] Parent packet continuation path already defined

### Definition of Done
- [x] Recursive-agent source package validates cleanly
- [x] Renamed runtime agents are synchronized
- [x] Command and wrapper surfaces are synchronized
- [x] `.agents/skills/sk-improve-agent/` is resynchronized
- [x] Root `041` and phase `005` validate strictly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source package correction plus downstream runtime and mirror synchronization

### Key Components
- **Source package**: `.opencode/skill/sk-improve-agent/`
- **Runtime agents**: `.opencode/agent/agent-improver.md` plus runtime mirrors
- **Command surfaces**: canonical command doc, YAML workflows, and TOML wrappers
- **Mirror package**: `.agents/skills/sk-improve-agent/`
- **Packet docs**: new phase `005` plus parent packet updates

### Data Flow
The source package is corrected first, runtime agent and command surfaces are aligned next, then the `.agents` mirror package is resynchronized from the corrected source. Packet docs and registry metadata are updated last so the historical record matches the delivered state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Package Alignment

- [x] Rewrite `.opencode/skill/sk-improve-agent/SKILL.md` to the `sk-doc` skill template shape
- [x] Rewrite `.opencode/skill/sk-improve-agent/README.md` to the `sk-doc` README template shape
- [x] Rewrite `references/*.md` and markdown `assets/*.md` to the matching template family

### Phase 2: Runtime and Command Alignment

- [x] Rename the mutator to `agent-improver` across runtimes
- [x] Align the runtime agent files with the `sk-doc` agent template family
- [x] Align the command doc and wrapper TOMLs with the `sk-doc` command template family
- [x] Update YAML dispatch to `@agent-improver`

### Phase 3: Mirror Sync and Verification

- [x] Resynchronize `.agents/skills/sk-improve-agent/`
- [x] Re-run package, document, syntax, and packet validators
- [x] Update root `041` to record phase `005`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging | Source agent-improver package | `package_skill.py --check` |
| Validation | Skill docs, README, agent, command, references, assets | `validate_document.py` |
| Syntax | Recursive-agent scripts and Codex TOML | `node --check`, `python3` parse |
| Validation | Root `041` and phase `005` packet docs | `validate.sh --strict` |
| Sync | `.agents` mirror package parity | `rsync` plus file sweep |
| Sweep | Stale mutator-path references | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc` templates | Internal | Green | Package shape cannot be corrected precisely |
| `sk-code-opencode` standards | Internal | Green | Script-layer alignment cannot be justified |
| Runtime agent mirrors | Internal | Green | Rename cannot stay cross-runtime consistent |
| system-spec-kit strict validator | Internal | Green | Packet closeout cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template alignment breaks validators, runtime rename leaves stale dispatch paths, or mirror sync drifts.
- **Procedure**: Restore the last good source package and runtime agent names, then replay the correction in the order source package -> runtime surfaces -> mirror package -> packet docs.

Future agent-improver work must continue as `006-*` and later child phases under `041-sk-improve-agent-loop/`.
<!-- /ANCHOR:rollback -->

---
