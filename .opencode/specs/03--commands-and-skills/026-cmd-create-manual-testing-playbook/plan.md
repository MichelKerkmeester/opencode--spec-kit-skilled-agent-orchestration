---
title: "Implementation Plan: /create:testing-playbook Command [template:level_3/plan.md]"
description: "Plan the new create command, its YAML pair, runtime mirror, and discovery-doc updates using the shipped sk-doc testing-playbook references and templates."
trigger_phrases:
  - "testing playbook command plan"
  - "/create:testing-playbook plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: /create:testing-playbook Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, TOML, command-routing docs |
| **Framework** | OpenCode create-command pattern + `sk-doc` playbook references |
| **Storage** | Git working tree |
| **Testing** | `validate_document.py`, YAML/TOML parse checks, grep/path sweeps, spec validator |

### Overview
Implementation is organized around one command family: canonical markdown entrypoint, paired YAML flows, one `.agents` mirror, and synchronized runtime-facing command inventories. The command must materialize the integrated `manual_testing_playbook/` contract defined in spec `021-sk-doc-feature-catalog-testing-playbook` and the shipped `sk-doc` testing-playbook reference/template bundle.
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
- [x] Runtime-facing create-command inventories list `/create:testing-playbook` consistently
- [x] Validation checks pass or any residual limitation is documented honestly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference-driven create command that scaffolds a multi-file documentation package with integrated root guidance and per-feature scenario files.

### Key Components
- **Canonical command doc**: `.opencode/command/create/testing-playbook.md`
- **Execution variants**: auto/confirm YAML assets under `.opencode/command/create/assets/`
- **Runtime mirror**: `.agents/commands/create/testing-playbook.toml`
- **Authoring source inputs**:
  - `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`
  - `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md`
  - `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md`
- **Discovery surfaces**: create-command READMEs plus runtime write-agent docs

### Data Flow
User invokes `/create:testing-playbook` -> command captures target skill path, operation, source strategy, and mode -> `@write` loads the playbook creation reference and both templates -> generated output lands in `<skill-root>/manual_testing_playbook/` -> root playbook owns shared rules while per-feature files hold scenario truth -> runtime docs remain aligned with the new command surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract lock
- [x] Reconfirm the command contract against spec `021` and the `sk-doc` manual-testing-playbook creation reference.
- [x] Inspect existing create-command patterns for markdown, YAML, and `.agents` mirror structure.
- [x] Freeze the naming translation `/create:testing-playbook` -> `manual_testing_playbook/`.

### Phase 2: Command family implementation
- [x] Create `.opencode/command/create/testing-playbook.md`.
- [x] Create `.opencode/command/create/assets/create_testing_playbook_auto.yaml`.
- [x] Create `.opencode/command/create/assets/create_testing_playbook_confirm.yaml`.
- [x] Create `.agents/commands/create/testing-playbook.toml`.

### Phase 3: Runtime-discovery sync
- [x] Update `.opencode/command/create/README.txt`.
- [x] Update `.opencode/command/README.txt`.
- [x] Update `.opencode/README.md`.
- [x] Update `.opencode/agent/write.md`, `.opencode/agent/chatgpt/write.md`, `.codex/agents/write.toml`, and `.agents/agents/write.md`.

### Phase 4: Validation and closure
- [x] Validate the command markdown doc.
- [x] Parse the YAML assets and TOML mirror.
- [x] Run stale-path and command-name sweeps across runtime docs.
- [x] Verify the planned scaffold forbids sidecar files and a `snippets/` subtree.
- [x] Validate the spec folder and capture implementation evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command-doc validation | `.opencode/command/create/testing-playbook.md` | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| YAML structure | `create_testing_playbook_auto.yaml`, `create_testing_playbook_confirm.yaml` | YAML parser or equivalent script check |
| TOML structure | `.agents/commands/create/testing-playbook.toml` | `python3` with `tomllib` |
| Discovery sync | Runtime-facing create-command listings | `rg`, targeted reads |
| Scenario inspection | `create/update` plus `:auto/:confirm` command shapes | path and content review |
| Contract inspection | Generated package rules for sidecars, root guidance, prompt scaffolds | targeted review against spec `021` |
| Spec validation | This packet | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../026-cmd-create-manual-testing-playbook` |

### Planned Scenario Checks

- **PC-001 Create mode, auto**: `/create:testing-playbook my-skill create :auto`
- **PC-002 Update mode, confirm**: `/create:testing-playbook my-skill update :confirm`
- **PC-003 Custom root**: `/create:testing-playbook my-skill create --path custom/skills :confirm`
- **PC-004 Output contract**: generated paths land in `manual_testing_playbook/` with root-level numbered category folders and per-feature files
- **PC-005 Legacy-structure prevention**: generated package contains no legacy review/ledger sidecars or `snippets/`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec `021-sk-doc-feature-catalog-testing-playbook` | Internal | Available | Defines the playbook contract this command must generate |
| `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md` | Internal | Available | Defines when and how the command should scaffold the package |
| Testing-playbook template bundle | Internal | Available | Provides the root and per-feature scaffold source |
| Existing create-command conventions | Internal | Available | Needed to keep the new command consistent with live workflows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken command routing, invalid YAML/TOML, discovery docs that point to a missing command, or generated docs that regress to deprecated playbook structure.
- **Procedure**:
  1. Revert the new command doc, YAMLs, and `.agents` mirror together.
  2. Revert the runtime discovery-doc updates in the same batch.
  3. Re-run validation and path sweeps before reapplying in smaller phases.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
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
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Lock | Low | 30-45 minutes |
| Command Family Implementation | Medium | 1.5-2.5 hours |
| Runtime-Discovery Sync | Medium | 45-90 minutes |
| Validation and Closure | Medium | 60-90 minutes |
| **Total** | | **3.75-5.75 hours** |
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
spec 021 + sk-doc playbook references/templates
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
   contract validation for no-sidecar output
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
| Legacy-structure guard | command markdown, `021` contract | sidecar/snippets prevention checks | completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Lock command contract and source inputs** - 30-45 minutes - CRITICAL
2. **Create canonical markdown command and YAML pair** - 90-150 minutes - CRITICAL
3. **Create `.agents` mirror and sync runtime discovery docs** - 60-90 minutes - CRITICAL
4. **Verify no-sidecar and no-`snippets/` regressions in the scaffold contract** - 20-30 minutes - CRITICAL
5. **Run validation and spec closure checks** - 45-75 minutes - CRITICAL

**Total Critical Path**: 4.1-6.5 hours

**Parallel Opportunities**:
- Runtime discovery-doc edits can begin once filenames and command names are locked.
- YAML and TOML syntax checks can run in parallel after the command family files exist.
<!-- /ANCHOR:critical-path -->

### Pre-Task Checklist
- [x] Confirm spec `021-sk-doc-feature-catalog-testing-playbook` is the source of truth.
- [x] Confirm the command loads the playbook creation guide and both templates.
- [x] Confirm the generated scaffold forbids legacy sidecar files and a `snippets/` subtree.
- [x] Confirm validation commands are prepared before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Only touch the command family, runtime inventories, and this spec packet |
| Contract fidelity | Keep `/create:testing-playbook` -> `manual_testing_playbook/` and the integrated root-guidance model explicit everywhere |
| Validation before close | Re-run command-doc, YAML/TOML, contract, and spec validation before finalizing |
| Honest residuals | Record follow-up warnings exactly instead of masking them |

### Status Reporting Format
Use `DONE`, `IN_PROGRESS`, or `BLOCKED`, always paired with the file family touched and the latest validator evidence.

### Blocked Task Protocol
1. Stop on missing template/reference inputs, validator regressions, mirror drift, or playbook-contract regressions.
2. Record the blocked surface and the failing check.
3. Resolve the inconsistency before continuing with downstream docs.
