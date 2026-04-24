---
title: "Implementation Plan: /create:feature-catalog Command [skilled-agent-orchestration/025-cmd-create-feature-catalog/plan]"
description: "Plan the new create command, its YAML pair, runtime mirror, and discovery-doc updates using the shipped sk-doc feature-catalog references and templates."
trigger_phrases:
  - "feature catalog command plan"
  - "/create:feature-catalog plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/025-cmd-create-feature-catalog"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: /create:feature-catalog Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, TOML, command-routing docs |
| **Framework** | OpenCode create-command pattern + `sk-doc` scaffolding references |
| **Storage** | Git working tree |
| **Testing** | `validate_document.py`, YAML/TOML parse checks, grep/path sweeps, spec validator |

### Overview
Implementation is organized around one command family: canonical markdown entrypoint, paired YAML flows, one `.agents` mirror, and synchronized runtime-facing command inventories. The command must materialize the feature-catalog contract defined in spec `021-sk-doc-feature-catalog-testing-playbook` and the shipped `sk-doc` feature-catalog reference/template bundle.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source-of-truth package contract identified in spec `021-sk-doc-feature-catalog-testing-playbook`
- [x] Required `sk-doc` creation reference and template inputs identified
- [x] Runtime surfaces to sync are enumerated in `spec.md`

### Definition of Done
- [x] Canonical command markdown, YAML pair, and `.agents` mirror all exist and agree
- [x] Runtime-facing create-command inventories list `/create:feature-catalog` consistently
- [x] Validation checks pass or any residual limitation is documented honestly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference-driven create command that scaffolds a multi-file documentation package.

### Key Components
- **Canonical command doc**: `.opencode/command/create/feature-catalog.md`
- **Execution variants**: auto/confirm YAML assets under `.opencode/command/create/assets/`
- **Runtime mirror**: `.agents/commands/create/feature-catalog.toml`
- **Authoring source inputs**:
  - `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`
  - `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`
  - `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md`
- **Discovery surfaces**: create-command READMEs plus runtime write-agent docs

### Data Flow
User invokes `/create:feature-catalog` -> command captures target skill path, operation, source strategy, and mode -> `@write` loads the feature-catalog creation reference and both templates -> generated output lands in `<skill-root>/feature_catalog/` -> runtime docs remain aligned with the new command surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract lock
- [x] Reconfirm the command contract against spec `021` and the `sk-doc` feature-catalog creation reference.
- [x] Inspect existing create-command patterns for markdown, YAML, and `.agents` mirror structure.
- [x] Freeze the naming translation `/create:feature-catalog` -> `feature_catalog/`.

### Phase 2: Command family implementation
- [x] Create `.opencode/command/create/feature-catalog.md`.
- [x] Create `.opencode/command/create/assets/create_feature_catalog_auto.yaml`.
- [x] Create `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`.
- [x] Create `.agents/commands/create/feature-catalog.toml`.

### Phase 3: Runtime-discovery sync
- [x] Update `.opencode/command/create/README.txt`.
- [x] Update `.opencode/command/README.txt`.
- [x] Update `.opencode/README.md`.
- [x] Update `.opencode/agent/write.md`, `.claude/agents/write.md`, `.codex/agents/write.toml`, and `.agents/agents/write.md`.

### Phase 4: Validation and closure
- [x] Validate the command markdown doc.
- [x] Parse the YAML assets and TOML mirror.
- [x] Run stale-path and command-name sweeps across runtime docs.
- [x] Validate the spec folder and capture implementation evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command-doc validation | `.opencode/command/create/feature-catalog.md` | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| YAML structure | `create_feature_catalog_auto.yaml`, `create_feature_catalog_confirm.yaml` | YAML parser or equivalent script check |
| TOML structure | `.agents/commands/create/feature-catalog.toml` | `python3` with `tomllib` |
| Discovery sync | Runtime-facing create-command listings | `rg`, targeted reads |
| Scenario inspection | `create/update` plus `:auto/:confirm` command shapes | path and content review |
| Spec validation | This packet | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../025-cmd-create-feature-catalog` |

### Planned Scenario Checks

- **PC-001 Create mode, auto**: `/create:feature-catalog my-skill create :auto`
- **PC-002 Update mode, confirm**: `/create:feature-catalog my-skill update :confirm`
- **PC-003 Custom root**: `/create:feature-catalog my-skill create --path custom/skills :confirm`
- **PC-004 Output contract**: generated paths land in `feature_catalog/` with root-level numbered category folders and per-feature files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec `021-sk-doc-feature-catalog-testing-playbook` | Internal | Available | Defines the package contract this command must generate |
| `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md` | Internal | Available | Defines when and how the command should scaffold the package |
| Feature-catalog template bundle | Internal | Available | Provides the root and per-feature scaffold source |
| Existing create-command conventions | Internal | Available | Needed to keep the new command consistent with live workflows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken command routing, invalid YAML/TOML, or discovery docs that point to a missing command.
- **Procedure**:
  1. Revert the new command doc, YAMLs, and `.agents` mirror together.
  2. Revert the runtime discovery-doc updates in the same batch.
  3. Re-run validation and path sweeps before reapplying in smaller phases.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Contract Lock -> Command Family Implementation -> Runtime-Discovery Sync -> Validation and Closure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Lock | None | Command Family Implementation |
| Command Family Implementation | Contract Lock | Runtime-Discovery Sync |
| Runtime-Discovery Sync | Command Family Implementation | Validation and Closure |
| Validation and Closure | All prior phases | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Lock | Low | 30-45 minutes |
| Command Family Implementation | Medium | 1.5-2.5 hours |
| Runtime-Discovery Sync | Medium | 45-90 minutes |
| Validation and Closure | Medium | 45-75 minutes |
| **Total** | | **3.5-5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Canonical command doc drafted before runtime-doc updates
- [x] YAML and TOML filenames locked before discovery-doc edits
- [x] Validation commands prepared before claiming completion

### Rollback Procedure
1. Remove the new command family files.
2. Remove the command from runtime discovery docs.
3. Re-run path sweeps so no stale references remain.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-level revert only
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
spec 021 + sk-doc references/templates
                |
                v
     command markdown + YAML pair
                |
                v
        .agents runtime mirror
                |
                v
     runtime command inventories
                |
                v
        validation + spec closure
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Command contract lock | spec `021`, `sk-doc` reference bundle | final command shape | YAMLs, mirror, docs |
| Command markdown | contract lock | canonical command instructions | YAMLs, discovery sync |
| YAML pair | command markdown | executable workflow variants | validation |
| `.agents` mirror | command markdown | runtime parity | validation |
| Discovery docs | command markdown, filenames | user-facing discoverability | completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Lock command contract and source inputs** - 30-45 minutes - CRITICAL
2. **Create canonical markdown command and YAML pair** - 90-150 minutes - CRITICAL
3. **Create `.agents` mirror and sync runtime discovery docs** - 60-90 minutes - CRITICAL
4. **Run validation and spec closure checks** - 45-75 minutes - CRITICAL

**Total Critical Path**: 3.75-6 hours

**Parallel Opportunities**:
- Runtime discovery-doc edits can begin once filenames and command names are locked.
- YAML and TOML syntax checks can run in parallel after the command family files exist.
<!-- /ANCHOR:critical-path -->

### Pre-Task Checklist
- [x] Confirm spec `021-sk-doc-feature-catalog-testing-playbook` is the source of truth.
- [x] Confirm the command loads the feature-catalog creation guide and both templates.
- [x] Confirm runtime-doc sync stays limited to the scoped create-command surfaces.
- [x] Confirm validation commands are prepared before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Only touch the command family, runtime inventories, and this spec packet |
| Source fidelity | Keep `/create:feature-catalog` -> `feature_catalog/` naming explicit everywhere |
| Validation before close | Re-run command-doc, YAML/TOML, and spec validation before finalizing |
| Honest residuals | Record follow-up warnings exactly instead of masking them |

### Status Reporting Format
Use `DONE`, `IN_PROGRESS`, or `BLOCKED`, always paired with the file family touched and the latest validator evidence.

### Blocked Task Protocol
1. Stop on missing template/reference inputs, validator regressions, or mirror drift.
2. Record the blocked surface and the failing check.
3. Resolve the inconsistency before continuing with downstream docs.
