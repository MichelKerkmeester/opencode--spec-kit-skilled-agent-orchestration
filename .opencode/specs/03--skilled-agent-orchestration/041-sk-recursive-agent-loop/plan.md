---
title: "Implementation Plan: 041 Recursive Agent Loop [template:level_2/plan.md]"
description: "Plan for maintaining 041 as the parent packet with completed child phases 001, 002, 003, 004, 005, 006, and 007."
trigger_phrases:
  - "041 plan"
  - "recursive agent phase plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: 041 Recursive Agent Loop

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs and JSON registry metadata |
| **Framework** | system-spec-kit phased spec workflow |
| **Storage** | Spec-folder markdown plus packet-local evidence artifacts |
| **Testing** | `validate.sh --strict`, `rg` sweeps, `python3.11` JSON parse |

### Overview
This plan keeps `041-sk-agent-improver-loop` as the parent packet for the agent-improver program. The completed MVP lives in phase `001`, the full-skill expansion lives in phase `002`, the sk-doc alignment closeout lives in phase `003`, the promotion-verification closeout lives in phase `004`, the package-and-runtime alignment closeout lives in phase `005`, the command-entrypoint rename lives in phase `006`, the wording-alignment cleanup lives in phase `007`, and the root folder remains the shared phase index for all future continuation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Root `041/` validates strictly
- [x] All completed child phases validate strictly
- [x] No stale standalone packet paths remain
- [x] Future continuation is documented as additional child phases under `041/`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent packet with child implementation phases

### Key Components
- **Root `041/` packet docs**: phase map, continuation rule, and shared evidence index
- **Phase `001` folder**: MVP packet docs and runtime evidence
- **Phase `002` folder**: full-skill packet docs, runtime evidence, and review artifacts
- **Phase `003` folder**: sk-doc alignment docs and closeout evidence
- **Phase `004` folder**: promotion-path verification docs and runtime evidence
- **Phase `005` folder**: package-template, runtime rename, mirror-sync, and command-alignment docs
- **Phase `006` folder**: command-entrypoint rename, command-asset rename, wrapper sync, and packet-history updates
- **Phase `007` folder**: wording cleanup across current source, mirror, and packet surfaces

| Layer | Purpose |
|------|---------|
| Root `041/` | Parent packet docs plus shared `research/`, `external/`, and `memory/` |
| `001-sk-agent-improver-mvp/` | Phase 1 MVP docs and runtime evidence |
| `002-sk-agent-improver-full-skill/` | Phase 2 expansion docs, runtime evidence, and review artifacts |
| `003-sk-agent-improver-doc-alignment/` | Phase 3 documentation-alignment docs and verification evidence |
| `004-sk-agent-improver-promotion-verification/` | Phase 4 promotion-path verification docs and runtime evidence |
| `005-sk-agent-improver-package-runtime-alignment/` | Phase 5 package-template and runtime-alignment docs plus verification evidence |
| `006-sk-agent-improver-command-rename/` | Phase 6 command-entrypoint rename docs plus verification evidence |
| `007-sk-agent-improver-wording-alignment/` | Phase 7 wording-alignment docs plus verification evidence |

### Data Flow
Shared research and imported evidence stay at the root packet. Phase-specific implementation docs and runtime artifacts live in `001/`, `002/`, `003/`, `004/`, `005/`, `006/`, and `007/`, while the root packet links into those phases and defines the continuation rule for future `008-*` work.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Folder: [`001-sk-agent-improver-mvp/`](./001-sk-agent-improver-mvp/)

- [x] Original `041` implementation docs moved into `001-sk-agent-improver-mvp/`
- [x] Shared research and external evidence kept at the root
- [x] New parent docs created at root `041/`

### Phase 2: Core Implementation

Folder: [`002-sk-agent-improver-full-skill/`](./002-sk-agent-improver-full-skill/)

- [x] Former standalone `042` packet moved into `002-sk-agent-improver-full-skill/`
- [x] Stale phase paths and packet wording repaired
- [x] Operator references updated to the phase-based layout

### Phase 3: Verification

- [x] Removed standalone-path sweeps completed
- [x] Root `041/` validation passed
- [x] Phase `001` and phase `002` validation passed

### Phase 4: Documentation Alignment

Folder: [`003-sk-agent-improver-doc-alignment/`](./003-sk-agent-improver-doc-alignment/)

- [x] `sk-agent-improver` package docs normalized to `sk-doc`
- [x] Canonical loop command and agent normalized to `sk-doc`
- [x] Root `041/` and phase `003` validation passed

### Phase 5: Promotion Verification

Folder: [`004-sk-agent-improver-promotion-verification/`](./004-sk-agent-improver-promotion-verification/)

- [x] Guarded promotion and rollback proved for the canonical handover target
- [x] `context-prime` repeatability evidence added
- [x] Root `041/` and phase `004` validation passed

### Phase 6: Package and Runtime Alignment

Folder: [`005-sk-agent-improver-package-runtime-alignment/`](./005-sk-agent-improver-package-runtime-alignment/)

- [x] `sk-agent-improver` package surfaces brought into stricter `sk-doc` template fidelity
- [x] Runtime mutator renamed from `agent-improvement-loop` to `agent-improver` across supported runtimes
- [x] Historical packet references repaired so removed mutator paths are not presented as current
- [x] Root `041/` and phase `005` validation passed

### Phase 7: Command Entrypoint Rename

Folder: [`006-sk-agent-improver-command-rename/`](./006-sk-agent-improver-command-rename/)

- [x] Command entrypoint renamed from `/spec_kit:agent-improvement-loop` to `/improve:agent-improver`
- [x] Command markdown, YAML assets, and runtime wrapper filenames renamed to the agent-improver family
- [x] Runtime agent tables, skill docs, and packet docs updated to the new command path
- [x] Root `041/` and phase `006` validation passed

### Phase 8: Wording Alignment

Folder: [`007-sk-agent-improver-wording-alignment/`](./007-sk-agent-improver-wording-alignment/)

- [x] Current agent-improver source docs, mirrors, and wrapper prompts cleaned up for wording clarity
- [x] Runtime-path wording bugs corrected without changing behavior
- [x] Root `041/` and phase `007` validation passed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Root `041/` packet structure | `validate.sh --strict` |
| Validation | Phase `001`, `002`, `003`, `004`, `005`, `006`, and `007` packet structure | `validate.sh --strict` |
| Packaging | `sk-agent-improver` skill package shape | `package_skill.py --check` |
| Validation | Skill package docs, command, and agent | `validate_document.py` |
| Verification | Promotion, rollback, and repeatability artifacts | `promote-candidate.cjs`, `rollback-candidate.cjs`, `run-benchmark.cjs`, `cmp` |
| Verification | `.agents` skill mirror script parsing after resync | `node --check` |
| Sweep | Removed standalone packet paths | `rg` |
| Parsing | Packet registry updates | `python3.11` JSON parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-sk-agent-improver-mvp/` docs and evidence | Internal | Green | Parent packet cannot describe the MVP phase cleanly |
| `002-sk-agent-improver-full-skill/` docs and evidence | Internal | Green | Parent packet cannot describe the full-skill phase cleanly |
| `003-sk-agent-improver-doc-alignment/` docs and evidence | Internal | Green | Parent packet cannot describe the doc-alignment closeout cleanly |
| `004-sk-agent-improver-promotion-verification/` docs and evidence | Internal | Green | Parent packet cannot describe the promotion-verification closeout cleanly |
| `005-sk-agent-improver-package-runtime-alignment/` docs and evidence | Internal | Green | Parent packet cannot describe the package/runtime alignment closeout cleanly |
| `006-sk-agent-improver-command-rename/` docs and evidence | Internal | Green | Parent packet cannot describe the command-entrypoint rename cleanly |
| `007-sk-agent-improver-wording-alignment/` docs and evidence | Internal | Green | Parent packet cannot describe the wording-alignment cleanup cleanly |
| Root `research/` and `external/` evidence | Internal | Green | Shared evidence links would break |
| system-spec-kit strict validator | Internal | Green | Completion cannot be proven cleanly |
| `sk-doc` package and document validators | Internal | Green | Documentation alignment cannot be proven cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation fails, phase links break, or stale flat-layout references remain after restructuring.
- **Procedure**: Restore the prior flat packet layout, repair references back to the known-good structure, then repeat the restructure with validator findings as the checklist.

Future work must continue inside `041-sk-agent-improver-loop/` as additional child phases such as `008-*` and later folders. Do not open a new sibling packet for agent-improver continuation unless the scope explicitly leaves this program family.
<!-- /ANCHOR:rollback -->

---
