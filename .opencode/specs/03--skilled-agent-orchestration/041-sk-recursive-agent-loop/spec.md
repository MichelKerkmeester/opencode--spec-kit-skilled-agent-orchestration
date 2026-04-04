---
title: "Feature Specification: 041 Recursive Agent Loop [template:level_2/spec.md]"
description: "Parent packet for the sk-agent-improver program. Phases 001-007 build the evaluator-first MVP through doc alignment, promotion verification, runtime alignment, command rename, and wording cleanup. Phase 008 adds holistic 5-dimension evaluation with integration scanning, dynamic profiling, and any-agent support. Renamed from sk-recursive-agent to sk-agent-improver."
trigger_phrases:
  - "041 spec"
  - "recursive agent loop"
  - "recursive agent phases"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: 041 Recursive Agent Loop

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |

### PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | [`001-sk-agent-improver-mvp/`](./001-sk-agent-improver-mvp/) | Complete | Evaluator-first MVP for `sk-agent-improver`: proposal-only loop, canonical handover target, append-only ledger, guarded promotion and rollback. [Implementation summary](./001-sk-agent-improver-mvp/implementation-summary.md). |
| 2 | [`002-sk-agent-improver-full-skill/`](./002-sk-agent-improver-full-skill/) | Complete | Full-skill expansion: benchmark harness, target profiles, second structured target, stronger no-go rules, and downstream mirror-sync guidance. [Implementation summary](./002-sk-agent-improver-full-skill/implementation-summary.md). |
| 3 | [`003-sk-agent-improver-doc-alignment/`](./003-sk-agent-improver-doc-alignment/) | Complete | sk-doc alignment for `sk-agent-improver`, related command and agent surfaces, and parent packet closeout. [Implementation summary](./003-sk-agent-improver-doc-alignment/implementation-summary.md). |
| 4 | [`004-sk-agent-improver-promotion-verification/`](./004-sk-agent-improver-promotion-verification/) | Complete | Guarded promotion verification for handover plus explicit `context-prime` repeatability evidence. [Implementation summary](./004-sk-agent-improver-promotion-verification/implementation-summary.md). |
| 5 | [`005-sk-agent-improver-package-runtime-alignment/`](./005-sk-agent-improver-package-runtime-alignment/) | Complete | Stricter template fidelity for the agent-improver package, runtime mutator rename to `agent-improver`, command alignment, and `.agents` mirror sync. [Implementation summary](./005-sk-agent-improver-package-runtime-alignment/implementation-summary.md). |
| 6 | [`006-sk-agent-improver-command-rename/`](./006-sk-agent-improver-command-rename/) | Complete | Rename the command entrypoint itself to `/improve:agent-improver`, rename wrapper and YAML command assets, and sync packet history to the new command surface. [Implementation summary](./006-sk-agent-improver-command-rename/implementation-summary.md). |
| 7 | [`007-sk-agent-improver-wording-alignment/`](./007-sk-agent-improver-wording-alignment/) | Complete | Wording-only cleanup across the current agent-improver package, runtime mirrors, wrapper prompts, and active packet docs. [Implementation summary](./007-sk-agent-improver-wording-alignment/implementation-summary.md). |
| 8 | [`008-sk-agent-improver-holistic-evaluation/`](./008-sk-agent-improver-holistic-evaluation/) | Complete | Holistic 5-dimension evaluation: integration scanner, dynamic profile generator, refactored scorer/benchmark/reducer, any-agent support, manual testing playbook. Renamed skill from sk-recursive-agent to sk-agent-improver. [Implementation summary](./008-sk-agent-improver-holistic-evaluation/implementation-summary.md). |
| 9 | [`009-sk-agent-improver-self-test/`](./009-sk-agent-improver-self-test/) | Complete | Self-referential test: ran the full `/improve:agent` loop targeting `agent-improver.md` itself. 3 iterations, baseline 99→100 (systemFitness fix), plateau at 100 across all 5 dimensions. [Implementation summary](./009-sk-agent-improver-self-test/implementation-summary.md). |
| 10 | [`010-sk-agent-improver-self-test-fixes/`](./010-sk-agent-improver-self-test-fixes/) | Complete | Fix 5 issues from Phase 009 self-test: stale command path, reducer family hardcoding, configurable plateau window, accepted counting, and candidate promotion to canonical. [Spec](./010-sk-agent-improver-self-test-fixes/spec.md). |
| 11 | [`011-sk-agent-improver-advisor-readme-sync/`](./011-sk-agent-improver-advisor-readme-sync/) | Complete | Skill advisor routing for Phase 008+ capabilities (5D scoring, integration scanning, dynamic profiling, /improve:agent command), COMMAND_BRIDGES for all /improve: and /create: commands, README version bump to 1.0.0.0, Barter advisor sync. [Spec](./011-sk-agent-improver-advisor-readme-sync/spec.md). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The original `041-sk-agent-improver-loop` packet grew into a longer agent-improver program with seven explicit implementation phases. Keeping any of those phases out of the root packet would leave the program history incomplete and make the completion state harder to trust.

### Purpose
Keep `041-sk-agent-improver-loop` as the parent packet for the `sk-agent-improver` program so that completed work lives under explicit child phases and future work continues as `009-*` and later phases inside this same folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parent packet documentation for `041-sk-agent-improver-loop`
- Phase mapping for completed work in `001` through `008`
- Root research, memory, and external-source references that support both phases
- A clear continuation rule: future work extends `041` via additional child phases (`009-*` and beyond)

### Out of Scope
- Reopening completed phase implementation work
- Changing the shipped `sk-agent-improver` behavior beyond path and packet-structure alignment
- Creating a new sibling packet for the next step

### Files to Change
See phase-level specs for implementation scope:
- [Phase 1 scope](./001-sk-agent-improver-mvp/spec.md)
- [Phase 2 scope](./002-sk-agent-improver-full-skill/spec.md)
- [Phase 3 scope](./003-sk-agent-improver-doc-alignment/spec.md)
- [Phase 4 scope](./004-sk-agent-improver-promotion-verification/spec.md)
- [Phase 5 scope](./005-sk-agent-improver-package-runtime-alignment/spec.md)
- [Phase 6 scope](./006-sk-agent-improver-command-rename/spec.md)
- [Phase 7 scope](./007-sk-agent-improver-wording-alignment/spec.md)
- [Phase 8 scope](./008-sk-agent-improver-holistic-evaluation/spec.md)

Root packet assets retained as shared evidence:
- [`research/`](./research/)
- [`external/`](./external/)
- [`memory/`](./memory/)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `041` becomes the parent packet | Root docs exist and describe the child phase structure |
| REQ-002 | The old root implementation docs move into phase `001` | MVP docs and runtime evidence now live under `001-sk-agent-improver-mvp/` |
| REQ-003 | The former full-skill follow-up becomes phase `002` | Full-skill docs and evidence now live under `002-sk-agent-improver-full-skill/` |
| REQ-004 | Stale standalone-packet references are removed | Paths and packet references point to `001` and `002` rather than the old flat layout |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Shared research remains rooted at `041` | `research/`, `external/`, and `memory/` stay available from the parent packet |
| REQ-006 | Future continuation path is explicit | Root docs instruct operators to add future work as child phases under `041` |
| REQ-007 | The final doc-alignment closeout is represented as phase `003` | Root docs, phase lineage, and examples point to the completed `003` phase where appropriate |
| REQ-008 | The promotion-verification closeout is represented as phase `004` | Root docs, phase lineage, and examples point to the completed `004` phase where appropriate |
| REQ-009 | Parent packet and all child phases pass strict validation | `validate.sh --strict` passes for root `041` and phases `001` through `008` |
| REQ-010 | The package-and-runtime correction is represented as phase `005` | Root docs, phase lineage, and examples point to the completed `005` phase where appropriate |
| REQ-011 | The command-entrypoint rename is represented as phase `006` | Root docs, phase lineage, and examples point to the completed `006` phase where appropriate |
| REQ-012 | The wording-alignment cleanup is represented as phase `007` | Root docs, phase lineage, and examples point to the completed `007` phase where appropriate |
| REQ-013 | The holistic evaluation + rename is represented as phase `008` | Root docs, phase lineage, and examples point to the completed `008` phase. Skill renamed from sk-recursive-agent to sk-agent-improver. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `041` contains root packet docs plus phase folders `001` through `008`.
- **SC-002**: No stale references to `042-sk-agent-improver-full-skill` or the old flat `041/.../improvement/` layout remain, and operator examples point at the current child-phase path.
- **SC-003**: Root `041` and all phases `001` through `008` pass strict packet validation.
- **SC-004**: Operators can understand completed history and future continuation from the root packet alone.

### Acceptance Scenarios
1. **Given** a maintainer opens `041-sk-agent-improver-loop/`, **when** they read the root spec, **then** they can see exactly what phases `001` through `008` delivered.
2. **Given** a maintainer wants to continue the work, **when** they consult the root packet, **then** they are guided to add a new child phase under `041` instead of opening a new sibling packet.
3. **Given** validation is run on the root packet and all child phases, **when** the structure and references are correct, **then** all strict validations pass.
4. **Given** a maintainer follows a root-packet link into a child phase, **when** they inspect the child spec metadata, **then** they can see the parent spec and successor relationship directly.

### Source Research
- [`research/research.md`](./research/research.md) — Deep research foundation for the agent-improver work
- [`001-sk-agent-improver-mvp/`](./001-sk-agent-improver-mvp/) — MVP implementation packet
- [`002-sk-agent-improver-full-skill/`](./002-sk-agent-improver-full-skill/) — Full-skill expansion packet
- [`003-sk-agent-improver-doc-alignment/`](./003-sk-agent-improver-doc-alignment/) — sk-doc alignment and packet closeout packet
- [`004-sk-agent-improver-promotion-verification/`](./004-sk-agent-improver-promotion-verification/) — promotion-path and repeatability verification packet
- [`005-sk-agent-improver-package-runtime-alignment/`](./005-sk-agent-improver-package-runtime-alignment/) — stricter template-fidelity and runtime-parity correction packet
- [`006-sk-agent-improver-command-rename/`](./006-sk-agent-improver-command-rename/) — command-entrypoint rename and wrapper/YAML sync packet
- [`007-sk-agent-improver-wording-alignment/`](./007-sk-agent-improver-wording-alignment/) — wording-only cleanup across current agent-improver surfaces
- [`008-sk-agent-improver-holistic-evaluation/`](./008-sk-agent-improver-holistic-evaluation/) — 5-dimension evaluation, integration scanner, dynamic profiling, any-agent support, rename to sk-agent-improver
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Root shared research and external analysis | Both phases depend on the same evidence base | Keep `research/` and `external/` at the parent root |
| Risk | Stale path references survive the move | Medium | Run repo sweeps for old `042` and old flat `041/improvement` paths |
| Risk | Future operators reopen a new sibling packet | Medium | Document the child-phase continuation rule in root docs |
| Risk | Root docs drift from child-phase reality | Low | Keep phase map and completion summary simple and link directly to child packet docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The packet hierarchy is settled: `041` is the parent, and future work continues through new child phases starting at `009-*`.
<!-- /ANCHOR:questions -->

---
