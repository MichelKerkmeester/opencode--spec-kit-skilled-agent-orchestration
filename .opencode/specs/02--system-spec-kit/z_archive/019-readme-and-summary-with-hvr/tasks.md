---
title: "Tasks: Human Voice Rules — Template Integration [137-readme-and-summary-with-hvr/tasks]"
description: "Before starting any task in this spec"
trigger_phrases:
  - "tasks"
  - "human"
  - "voice"
  - "rules"
  - "template"
  - "137"
  - "readme"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Human Voice Rules — Template Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:ai-protocol -->
## AI Execution Protocol

### Pre-Task Checklist

Before starting any task in this spec:

- [ ] Confirm spec folder path is `.opencode/specs/02--system-spec-kit/z_archive/019-readme-and-summary-with-hvr`
- [ ] Read the target file in full before editing (no blind writes)
- [ ] Confirm template ANCHOR tags present in target file before modification
- [ ] Verify `hvr_rules.md` canonical path before referencing it in any annotation block

### Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ-001 | Read file before editing — always | Hard block |
| TASK-SEQ-002 | Complete Phase 1 (HVR extraction) before Phase 3 or 4 (template edits) | Hard block |
| TASK-SCOPE-001 | Do not modify HVR rule content — only framing changes | Hard block |
| TASK-SCOPE-002 | Preserve all ANCHOR tags in modified template files | Hard block |

### Status Reporting Format

After each completed phase, report:

```
Phase [N] complete.
Files modified: [list]
Verification: [grep results or validate.sh output]
Next: [Phase N+1 description]
```

### Blocked Task Protocol

If a task is BLOCKED:

1. Mark it `[B]` in this file with the reason
2. Note the blocking dependency explicitly
3. Continue with unblocked tasks if any exist
4. Escalate to project owner if all remaining tasks are blocked

<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Extract HVR Standalone Asset

These tasks extract the Human Voice Rules from the Barter-specific source document and produce the canonical system-agnostic file.

- [ ] T001 Read full source HVR document (`context/Rules - Human Voice - v0.101.md`)
- [ ] T002 Identify all Barter-specific references: proper nouns, system names (MEQT, DEAL, CONTENT), project-specific scoring integrations
- [ ] T003 Rewrite loading condition from Barter-scoped to general ("Always active for documentation generation tasks")
- [ ] T004 Rewrite scope statement from "6 Barter content systems" to system-agnostic language
- [ ] T005 Write cleaned document to `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`
- [ ] T006 Grep for "Barter", "MEQT", "DEAL", "CONTENT", "LinkedIn" — confirm zero results in hvr_rules.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Draft HVR Annotation Blocks

The annotation block is what goes inside each template. Draft the four variants before touching any template file.

- [ ] T007 Draft base HVR block (shared structure and content — reference line, hard blockers, structural patterns)
- [ ] T008 [P] Write implementation-summary variant — emphasis on narrative prose, "why things matter" guidance
- [ ] T009 [P] Write decision-record variant — emphasis on plain-language context/rationale sections
- [ ] T010 [P] Write README variant — emphasis on direct address, active voice in capability descriptions
- [ ] T011 [P] Write install-guide variant — emphasis on imperative verbs in step instructions, no hedging

T008-T011 are parallelizable (each variant is independent). All depend on T007.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Update SpecKit Templates

Six template files across four levels. Read each in full before editing. Preserve all ANCHOR tags and SPECKIT markers.

- [ ] T012 Locate and confirm all implementation-summary template files at levels 1, 2, 3, 3+
- [ ] T013 Read `templates/level_1/implementation-summary.md` in full
- [ ] T014 Insert implementation-summary HVR block into level_1 template (after SPECKIT_TEMPLATE_SOURCE line, before first content section)
- [ ] T015 Read `templates/level_2/implementation-summary.md` in full
- [ ] T016 Insert implementation-summary HVR block into level_2 template
- [ ] T017 Read `templates/level_3/implementation-summary.md` in full
- [ ] T018 Insert implementation-summary HVR block into level_3 template
- [ ] T019 Read `templates/level_3+/implementation-summary.md` in full
- [ ] T020 Insert implementation-summary HVR block into level_3+ template
- [ ] T021 Read `templates/level_3/decision-record.md` in full
- [ ] T022 Insert decision-record HVR block into level_3 template
- [ ] T023 Read `templates/level_3+/decision-record.md` in full
- [ ] T024 Insert decision-record HVR block into level_3+ template
- [ ] T025 Verify all six edited SpecKit files retain ANCHOR tags and SPECKIT markers (grep check)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Update Workflows-Doc Templates

Two files. Same approach: read first, insert block, verify structure.

- [ ] T026 Read `.opencode/skill/sk-doc/assets/documentation/readme_template.md` in full
- [ ] T027 Insert README HVR block after template headers in readme_template.md
- [ ] T028 Read `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` in full
- [ ] T029 Insert install-guide HVR block after template headers in install_guide_template.md
- [ ] T030 Verify both workflows-doc files retain their existing structure and frontmatter
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [ ] T031 Run `scripts/spec/validate.sh` on this spec folder — confirm exit code 0 or 1
- [ ] T032 Grep all modified template files for top hard-blocker words: delve, embark, leverage, seamless, holistic, ecosystem, paradigm, utilize, revolutionise, groundbreaking
- [ ] T033 Grep this spec folder's documents (spec.md, plan.md, tasks.md, decision-record.md) for same hard-blocker words
- [ ] T034 Manual read-through of each HVR annotation block — confirm readable, actionable, under 30 lines
- [ ] T035 Confirm `hvr_rules.md` loads cleanly and has no broken ANCHOR tags
- [ ] T036 Update checklist.md with verification evidence
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh exit code 0 or 1
- [ ] grep for hard-blocker words returns no hits in spec folder documents
- [ ] All nine target files (1 new + 8 modified) verified as changed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **HVR Source**: `context/Rules - Human Voice - v0.101.md`
<!-- /ANCHOR:cross-refs -->

---

## Workstream Tags

Tasks are tagged by workstream for tracking:

| Tag | Workstream | Tasks |
|-----|------------|-------|
| [W:HVR] | HVR Asset extraction | T001-T006 |
| [W:BLOCKS] | Annotation block drafting | T007-T011 |
| [W:SPECKIT] | SpecKit template editing | T012-T025 |
| [W:WFDOC] | Workflows-doc template editing | T026-T030 |
| [W:VERIFY] | Verification | T031-T036 |
