---
title: "Tasks: Skill Alignment — system-spec-kit"
description: "Actionable backlog for the still-open documentation alignment work in 015-skill-alignment."
trigger_phrases: ["tasks", "skill alignment", "015 alignment"]
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Skill Alignment — system-spec-kit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Spec-Folder Remediation

- [x] T001 Upgrade `spec.md`, `plan.md`, and `tasks.md` to Level 2 metadata and anchors (`./spec.md`, `./plan.md`, `./tasks.md`)
- [x] T002 Fix local relative references so links resolve from `015-skill-alignment` (`./spec.md`, `./plan.md`, `./tasks.md`)
- [x] T003 Create a Level 2 checklist tailored to this documentation-only phase (`./checklist.md`)
- [x] T004 Rewrite the folder narrative so the phase is clearly draft, docs-only, and pre-implementation (`./spec.md`, `./plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Open Skill-Guide Backlog

- [ ] T005 Retain stale metadata fixes that are still open: LOC, handler count, lib directory count, tool count, schema version, token approximation, and document-type list (`../../../../skill/system-spec-kit/SKILL.md`)
- [ ] T006 Retain routing and keyword gaps still open in Smart Routing: new RAG intents, expanded RESOURCE_MAP, and `/memory:*` command boosts (`../../../../skill/system-spec-kit/SKILL.md`)
- [ ] T007 Retain rules/guidance gaps still open for phase integrity, feature-flag governance, campaign execution, and shared-space/shared-memory tool treatment (`../../../../skill/system-spec-kit/SKILL.md`)
- [ ] T008 Remove from the future backlog any skill-guide work that is already satisfied elsewhere in current repo docs (`../../../../skill/system-spec-kit/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Open Reference and Asset Backlog

- [ ] T009 [P] Keep only open memory-reference tasks for `../../../../skill/system-spec-kit/references/memory/memory_system.md`, `../../../../skill/system-spec-kit/references/memory/save_workflow.md`, `../../../../skill/system-spec-kit/references/memory/trigger_config.md`, `../../../../skill/system-spec-kit/references/memory/embedding_resilience.md`, and `../../../../skill/system-spec-kit/references/memory/epistemic_vectors.md` (`../../../../skill/system-spec-kit/references/memory/**`)
- [ ] T010 [P] Keep only open validation/structure/workflow/debugging tasks for files still missing epic-scale guidance (`.opencode/skill/system-spec-kit/references/**`)
- [ ] T011 Retain config work only for gaps still open in env-var docs, especially runtime `SPECKIT_GRAPH_UNIFIED` coverage and stale `SPEC_KIT_ENABLE_CAUSAL` wording (`.opencode/skill/system-spec-kit/references/config/environment_variables.md`)
- [ ] T012 Retain only open asset work for dispatch, complexity, level-decision, and template-mapping docs (`.opencode/skill/system-spec-kit/assets/**`)
- [ ] T013 Explicitly exclude already-landed items from this backlog, including recursive validation shortcuts, phase-aware template guidance, nested child-path support, and env-var entries that are already documented (`./spec.md`, `./tasks.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Guardrails

- [ ] T014 Replace brittle tool-count verification with a canonical-source method that counts actual tool definition entries rather than every `name:` token (`./spec.md`, `./tasks.md`)
- [ ] T015 Add an explicit guard that future implementation must not change runtime TypeScript behavior while executing this phase (`./spec.md`, `./tasks.md`, `./checklist.md`)
- [ ] T016 Run `validate.sh` for the `015-skill-alignment` folder and record any remaining policy conflicts honestly (`./checklist.md`)
- [ ] T017 Run `check-completion.sh` and confirm the new Level 2 checklist is recognized (`./checklist.md`)
- [ ] T018 Run `verify_alignment_drift.py --root .opencode/skill/system-spec-kit` and confirm this planning phase did not introduce runtime/code drift (`./checklist.md`)
- [ ] T019 Re-run targeted searches to confirm every retained open task still maps to scratch research or live repo evidence (`./spec.md`, `./tasks.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All spec-folder remediation tasks are complete
- [ ] Only still-open documentation work remains in the backlog
- [ ] No runtime behavior changes were performed under this phase
- [ ] Verification results are captured in `checklist.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `./spec.md`
- **Plan**: See `./plan.md`
- **Checklist**: See `./checklist.md`
- **Research Evidence**: See `./scratch/agent-01-skill-routing.md` through `./scratch/agent-10-refs-config.md`
<!-- /ANCHOR:cross-refs -->

---
