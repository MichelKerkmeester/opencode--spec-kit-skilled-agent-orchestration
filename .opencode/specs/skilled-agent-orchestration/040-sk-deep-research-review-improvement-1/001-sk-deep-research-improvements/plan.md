---
title: "Implementation Plan: Phase 1 -- sk-deep-research Improvements [template:level_1/plan.md]"
description: "Implement and verify the complete Phase 1 lineage, reducer, and runtime-parity contract across deep-research docs, helpers, mirrors, and packet surfaces."
trigger_phrases:
  - "deep research plan"
  - "lineage plan"
  - "runtime parity plan"
  - "phase 1 plan"
  - "reducer plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Phase 1 -- sk-deep-research Improvements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON, TOML, CommonJS, Vitest |
| **Framework** | Spec Kit command workflow assets, runtime agent mirrors, and focused reducer/parity tests |
| **Storage** | Disk-first packet files under `research/` |
| **Testing** | `validate_document.py`, Vitest, JSON/TOML parsing, Ruby YAML parsing, `validate.sh --strict` |

### Overview
This phase updates the deep-research contract where it is actually expressed today: skill docs, references, packet assets, command YAML, runtime mirrors, executable helper scripts, and focused verification tests. After the runtime/documentation pass, the packet itself is normalized to the active Level 1 template so strict validation can represent the work accurately.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase intent and recommendations are readable from [spec.md](../spec.md) and [recommendations-sk-deep-research.md](../research/recommendations-sk-deep-research.md).
- [x] Named target surfaces for Phase 1 are identified from this packet.
- [x] Deep-research runtime mirrors and workflow assets are available in the workspace.

### Definition of Done
- [x] Targeted deep-research docs/assets/mirrors are updated to the new lineage and reducer contract.
- [x] Changed JSON, TOML, YAML, and Markdown surfaces pass targeted validation.
- [x] Every Phase 1 task is complete, including reducer executable tests and the machine-readable capability lookup path.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative workflow contract plus runtime-mirror parity

### Key Components
- **Skill and references**: [../../../../skill/sk-deep-research/SKILL.md](../../../../skill/sk-deep-research/SKILL.md) and the `references/` files define the durable research packet contract.
- **Workflow assets**: [../../../../command/spec_kit/assets/spec_kit_deep-research_auto.yaml](../../../../command/spec_kit/assets/spec_kit_deep-research_auto.yaml) and [../../../../command/spec_kit/assets/spec_kit_deep-research_confirm.yaml](../../../../command/spec_kit/assets/spec_kit_deep-research_confirm.yaml) describe loop execution, lifecycle handling, and reducer sequencing.
- **Runtime mirrors**: OpenCode, Claude, Gemini, and Codex deep-research mirrors must all consume the same packet contract and registry ownership model.
- **Executable helpers**: `runtime-capabilities.cjs` exposes the live runtime capability matrix, and `reduce-state.cjs` reduces packet state into synchronized artifacts.
- **Focused tests**: Deep-research contract parity and reducer Vitest suites keep the packet contract executable.

### Data Flow
The command YAML initializes or resumes a `research/` packet, dispatches a single-iteration `@deep-research` mirror, then invokes the reducer helper to synchronize registry, strategy, and dashboard outputs. This phase hardens the contract around those handoffs and proves the behavior through focused helper and parity tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Load parent phase context and research recommendations.
- [x] Inspect existing deep-research skill, asset, YAML, and runtime mirror surfaces.
- [x] Identify strict-validation gaps in the named spec folder.

### Phase 2: Core Implementation
- [x] Apply lineage, naming, registry, dashboard, and ownership updates across the deep-research target surfaces.
- [x] Add runtime capability matrix and propagate parity language to runtime mirrors.
- [x] Add executable helper surfaces for capability lookup and reducer synchronization.
- [x] Restore this phase packet to Level 1 template structure with accurate task tracking.

### Phase 3: Verification
- [x] Run targeted Markdown validation on changed deep-research docs.
- [x] Parse changed JSON, TOML, and YAML assets.
- [x] Run focused Vitest coverage for contract parity and reducer idempotency.
- [x] Run strict packet validation after packet-template remediation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document validation | Changed skill docs, references, and runtime mirror Markdown | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| Focused unit/integration verification | Deep-research contract parity and reducer behavior | `node mcp_server/node_modules/vitest/vitest.mjs run tests/deep-research-contract-parity.vitest.ts tests/deep-research-reducer.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` |
| Syntax parsing | Changed config, command YAML, and Codex TOML mirror | `python3.11`, Ruby `YAML.load_file` |
| Packet validation | This phase folder only | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [../research/recommendations-sk-deep-research.md](../research/recommendations-sk-deep-research.md) | Internal | Green | Terminology and acceptance goals would drift from the parent packet |
| Deep-research runtime mirror files under `.opencode/`, `.claude/`, `.gemini/`, `.codex/` | Internal | Green | Runtime parity could not be validated |
| Reducer helper and focused Vitest surfaces under `sk-deep-research/scripts/` and `system-spec-kit/scripts/tests/` | Internal | Green | Phase 1 completion depends on these executable checks staying in sync with the docs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Targeted validators or strict packet validation fail after the edits, or the runtime contract becomes less consistent across mirrors.
- **Procedure**: Revert the scoped deep-research and packet-doc changes, then re-apply only the validated contract updates once the failing surface is isolated.
<!-- /ANCHOR:rollback -->

---
