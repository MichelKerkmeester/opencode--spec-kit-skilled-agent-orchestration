---
title: "Feature Specification: sk-deep-research Path Migration"
description: "Deep research still mixes canonical output between a root research document and scratch iteration artifacts, while legacy review packets can also leave iteration files directly under review/. This packet freezes the repo-wide migration to a research packet root plus dedicated iteration folders without adding an output folder."
trigger_phrases:
  - "deep-research path migration"
  - "research packet layout"
  - "review iterations folder"
  - "research packet root"
  - "review/iterations"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: sk-deep-research Path Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The deep-research contract is now split across a former root research document, `research/iterations/iteration-*`, and a newer review packet that still has to normalize legacy `review/iterations/iteration-*` layouts. The migration defined here makes `research/` the canonical research packet, keeps `review/` as the canonical review packet, and standardizes iteration artifacts into dedicated `iterations/` folders with no `output/` folder. [SOURCE: .opencode/command/spec_kit/deep-research.md:211-242] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:187-201]

This is a repo-wide contract migration. The implementation must update command workflows, the `sk-deep-research` skill, `system-spec-kit` path-sensitive logic, canonical `.codex/agents/*.toml` runtime definitions plus the mirrored runtime agent files, tests, fixtures, and tracked spec packets so new work stops advertising the old root-plus-scratch layout.

**Key Decisions**: research mode moves to a dedicated `research/` packet root plus `research/iterations/`, review mode keeps the review report at the `review/` packet root while moving iteration artifacts to `review/iterations/`, and `scratch/` remains available only for generic temporary work rather than canonical deep-research state.

**Critical Dependencies**: all four deep-research YAML workflows, `sk-deep-research`, `system-spec-kit` runtime and shell helpers, the canonical `.codex/agents/*.toml` agent definitions plus mirrored runtimes, migration tooling, and the tracked `.opencode/specs/` corpus.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Approved |
| **Created** | 2026-03-28 |
| **Branch** | `035-sk-deep-research-path-migration` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep research has an inconsistent packet contract. Research mode now centers on a synthesis document under `research/`, but older workflow guidance and supporting documentation still refer to a former root research document, while iteration artifacts historically lived under `research/iterations/iteration-*`. Review mode already centers on a report document at the `review/` packet root, yet compatibility logic still has to rehome legacy `review/iterations/iteration-*` and scratch-based review artifacts into the canonical review packet. [SOURCE: .opencode/command/spec_kit/deep-research.md:211-242] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:127-146] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml:127-146]

That mixed layout causes three durable problems. First, operators cannot infer a single packet root for research mode the way they can for review mode. Second, path-sensitive runtime helpers and validators risk classifying iteration artifacts as first-class docs unless the exclusions are explicit. Third, repo docs, fixtures, templates, and tracked spec packets drift whenever some surfaces mention the old root-plus-scratch contract and others describe the newer packet layout. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:233-247] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:70-70] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:751-793]

### Purpose
Define the Level 3 migration packet that makes `research/` the canonical research packet, standardizes review iterations under `review/iterations/`, preserves the review report at the `review/` packet root, keeps `scratch/` available only for disposable temp work, and updates the repo-wide implementation and documentation surfaces in one controlled migration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the canonical research packet from a root research document plus `research/iterations/iteration-*` to:
  - a synthesis document at the `research/` packet root
  - research iteration files inside `research/iterations/`
  - packet-root research state files under `research/`
- Change review iteration placement from direct `review/iterations/iteration-*` to `review/iterations/` while preserving the review report at the `review/` packet root.
- Update the four deep-research YAML workflows and the Markdown command entrypoint so all research and review packet paths follow the new contract.
- Update `sk-deep-research` docs, references, playbooks, and packet diagrams to the new folder layout.
- Update `system-spec-kit` runtime path helpers, shell scripts, parsers, discovery logic, validators, and test fixtures that currently assume a root research document, `research/iterations/iteration-*`, or direct `review/iterations/iteration-*`.
- Update the canonical `.codex/agents/*.toml` deep-research and deep-review definitions plus mirrored runtime agent files in other runtimes so they describe the same packet contract.
- Add and run a migration utility over tracked spec packets so existing `.opencode/specs/` content uses the new layout.
- Rewrite internal links and path mentions in tracked packet docs, fixtures, playbooks, and generated examples so new first-party guidance no longer advertises the old contract.

### Out of Scope
- Adding a `research/output/` or `review/output/` folder.
- Changing the review report filename or moving it away from the `review/` packet root.
- Reinterpreting the review report as a core spec document for indexing beyond existing behavior.
- Broad redesign of scratch semantics outside the deep-research and deep-review contract.
- Any unrelated cleanup of historical temp artifacts that are not part of the defined migration whitelist.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Route research outputs and iteration artifacts into `research/` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Mirror the same research packet contract in confirm mode |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | Modify | Normalize legacy review iteration artifacts into `review/iterations/` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` | Modify | Mirror the same review iteration contract in confirm mode |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Update command-level packet explanations and output summaries |
| `.opencode/skill/sk-deep-research/` | Modify | Update the skill, references, assets, README, and manual testing playbook to the new packet structure |
| `.opencode/skill/system-spec-kit/` | Modify | Update path-sensitive runtime logic, shell helpers, docs, fixtures, and tests for the new canonical locations |
| `.codex/agents/deep-research.toml`, `.codex/agents/deep-review.toml` plus mirrored runtime agent files | Modify | Keep runtime agent contracts aligned across all runtimes |
| `.opencode/specs/` tracked packets | Migrate | Move legacy research and review packet artifacts into canonical packet folders |
| `.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts` | Create | Provide a deterministic repo migration utility |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonicalize research packet root | Fresh research runs write synthesis to the `research/` packet root and no first-party workflow advertises a former root research document as canonical |
| REQ-002 | Canonicalize research iterations | Fresh research runs write research iteration artifacts inside `research/iterations/` rather than `research/iterations/iteration-*` |
| REQ-003 | Canonicalize review iterations | Fresh review runs and legacy rehome logic place review iteration artifacts in `{spec_folder}/review/iterations/iteration-NNN.md` |
| REQ-004 | Preserve review report location | Review synthesis remains at the `review/` packet root and no `output/` folder is introduced |
| REQ-005 | Keep packet-root state files stable | Research config, JSONL state, strategy, dashboard, ideas, and pause sentinel live at `{spec_folder}/research/`; review config, JSONL state, strategy, dashboard, and pause sentinel live at `{spec_folder}/review/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update command and skill docs together | The command entrypoint, `sk-deep-research`, and `system-spec-kit` all describe the same research and review packet layout |
| REQ-007 | Update canonical runtime agent definitions and mirrors | `.codex/agents/*.toml` plus mirrored runtime agent files describe the same packet paths and permissions |
| REQ-008 | Update runtime and shell helpers | `RESEARCH` resolves to the research synthesis document at the `research/` packet root, `RESEARCH_DIR` resolves to `{spec_folder}/research`, and path-sensitive discovery logic excludes `research/iterations/` and `review/iterations/` from canonical spec-doc indexing |
| REQ-009 | Provide repo migration tooling | A migration utility moves tracked legacy packet artifacts into the new layout and rewrites tracked text references accordingly |
| REQ-010 | Migrate tracked spec corpus | Existing tracked `.opencode/specs/` packets move legacy research and review artifacts into the new packet structure without introducing duplicate canonical homes |
| REQ-011 | Keep backward tolerance bounded | Lightweight legacy recognition is acceptable where generic path matching already supports it, but no new first-party docs or workflows advertise old canonical paths |
| REQ-012 | Preserve scratch as temporary workspace | `scratch/` remains valid for generic disposable work but is no longer part of the deep-research or deep-review canonical contract |
| REQ-013 | Keep review indexing semantics stable | Review iteration artifacts remain excluded working artifacts and the review report does not become a newly promoted spec-doc type unless a consumer proves that necessary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh research run creates the research synthesis document at the `research/` packet root and research iteration files under `research/iterations/`.
- **SC-002**: A fresh review run creates the review report at the `review/` packet root and review iteration files under `review/iterations/`.
- **SC-003**: `system-spec-kit` runtime helpers and shell setup output the new research packet paths and exclude iteration folders from spec-doc indexing.
- **SC-004**: Canonical `.codex/agents/*.toml`, mirrored runtime agent files, command docs, skill docs, fixtures, and playbooks all describe the same packet contract.
- **SC-005**: The tracked `.opencode/specs/` corpus is migrated so first-party packets no longer keep a former root research document or `research/iterations/iteration-*` artifacts as canonical state.
- **SC-006**: A repo-wide search over tracked first-party files finds no newly advertised old canonical paths except deliberate legacy-tolerance logic or archival history.

### Acceptance Scenarios

1. **Given** a new research session, **when** `/spec_kit:deep-research` initializes the packet, **then** the packet root is `{spec_folder}/research/` and the final synthesis target is the research document kept at that packet root.
2. **Given** a new research iteration, **when** the loop dispatches `@deep-research`, **then** the findings file is written under `{spec_folder}/research/iterations/`.
3. **Given** a new review session, **when** `/spec_kit:deep-research:review` initializes the packet, **then** iteration files are written under `{spec_folder}/review/iterations/` and the final report stays at the `review/` packet root.
4. **Given** a spec folder with a legacy root research document and `research/iterations/iteration-*`, **when** the migration utility runs, **then** the canonical files move into `research/` and internal path references are rewritten.
5. **Given** a spec folder with legacy `review/iterations/iteration-*`, **when** review migration logic or the migration utility runs, **then** the iteration artifacts move into `{spec_folder}/review/iterations/` without creating a second canonical review packet.
6. **Given** the memory and indexing pipeline scans spec docs, **when** it encounters `research/iterations/` or `review/iterations/`, **then** those files are treated as working artifacts rather than canonical spec documents.
7. **Given** an operator reads the command entrypoint, skill docs, runtime agent definitions, and playbook, **when** they look for canonical deep-research paths, **then** each surface points to the same packet layout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Deep-research YAML workflows | Packet creation or migration will drift if any of the four workflows keep old path assumptions | Update all four workflows in the same change and verify them together |
| Dependency | `sk-deep-research` docs and assets | Operators will keep seeing mixed guidance if packet diagrams and references lag behind | Treat docs and asset sync as in-scope, not cleanup |
| Dependency | `system-spec-kit` parsers, helpers, and shell scripts | Runtime behavior and setup output may still point to legacy paths | Update path helpers, shell variables, parsing, and test fixtures together |
| Dependency | Runtime agent definitions | Cross-runtime contract drift will reappear if only one runtime is updated | Use `.codex/agents/*.toml` as canonical definitions and sync mirrored runtimes in the same wave |
| Risk | Corpus migration creates duplicate packet roots | A bad migration could leave both old and new canonical paths in tracked specs | Add a deterministic migration utility and run post-migration grep sweeps |
| Risk | Iteration folders get indexed as spec docs | Search and memory behavior may degrade if iteration artifacts are treated as canonical docs | Explicitly exclude `research/iterations/` and `review/iterations/` in path-sensitive discovery and parsing logic |
| Risk | Review report behavior broadens accidentally | Consumers may start treating the review report as a core spec doc if the migration overreaches | Keep review indexing semantics frozen and only widen if a proven consumer requires it |
| Risk | Docs reference the wrong runtime path conventions | Maintainers may patch one runtime and miss others | Make the canonical `.codex/agents/*.toml` references explicit in the packet and require mirrored runtime parity |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Packet discovery and classification must use bounded path checks rather than repository-wide expensive scans for each request.
- **NFR-P02**: The migration utility must walk the corpus once and avoid recursive re-migration of newly created `research/` or `review/` folders.

### Security
- **NFR-S01**: Migration logic must move only the deep-research packet whitelist and must not relocate unrelated temporary files in `scratch/`.
- **NFR-S02**: Path rewrites must stay within tracked spec packets and must not touch unrelated working-tree files outside the declared migration scope.

### Reliability
- **NFR-R01**: Both research and review workflows must converge on a single canonical packet root after migration, even when legacy packet artifacts are present.
- **NFR-R02**: The shell helper surface must expose stable path variables so follow-on scripts do not infer packet structure independently.

---

## 8. EDGE CASES

### Data Boundaries
- A spec folder already contains both the canonical research synthesis document under `research/` and a legacy root research document; the migration must not overwrite the canonical file silently.
- A research packet contains runtime files in `scratch/` that are not part of the deep-research contract; the migration must leave them untouched.
- A review packet contains both `review/iterations/` and direct `review/iterations/iteration-*` files; the migration must consolidate iterations into one canonical folder.
- A tracked spec packet has relative markdown links pointing at a root research document; the migration must rewrite them to the canonical research packet layout.

### Error Scenarios
- Path-sensitive discovery still classifies a research iteration file under `research/iterations/` as a canonical doc after migration; tests must fail until the exclusion logic is fixed.
- A migration pass descends into newly created `research/` or `review/` folders and attempts to move canonical files again; the implementation must guard against recursive re-entry.
- The command and skill docs advertise different packet layouts; verification must treat that as a blocker rather than a documentation follow-up.
- Review-mode compatibility logic still assumes direct `review/iterations/iteration-*`; the implementation must normalize those artifacts before packet classification.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Four workflows, command docs, two skills, runtime agents, path-sensitive runtime code, migration tooling, tests, fixtures, and tracked packet corpus |
| Risk | 18/25 | Canonical path changes can break packet discovery, state recovery, and indexing if any surface drifts |
| Research | 13/20 | Requires evidence across commands, skills, runtime helpers, and tracked packet structure |
| Multi-Agent | 4/15 | Cross-runtime parity matters, but the implementation can still be executed as one coordinated workstream |
| Coordination | 15/15 | Command, skill, runtime, migration, and corpus updates must land together to avoid contract drift |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A workflow still advertises a former root research document or `research/iterations/iteration-*` as canonical | H | M | Update all four YAML workflows and the command entrypoint together |
| R-002 | `system-spec-kit` still indexes iteration files as canonical docs | H | M | Add shared path helpers and targeted tests for artifact routing and doc discovery |
| R-003 | Runtime agent definitions drift across runtimes | M | M | Freeze `.codex/agents/*.toml` as the canonical references and verify mirrored runtime parity |
| R-004 | Corpus migration duplicates or strands packet artifacts | H | M | Add a deterministic migration utility, run it once, and follow with grep and validator sweeps |
| R-005 | Review-report behavior changes unintentionally | M | L | Keep the review report fixed at the `review/` packet root and document that review indexing semantics are unchanged |

---

## 11. USER STORIES

### US-001: Find the research packet in one place (Priority: P0)

**As a** deep-research operator, **I want** the research packet to live under `research/`, **so that** I can find synthesis, iterations, and state files without mixing them with root docs or scratch artifacts.

**Acceptance Criteria**:
1. Given a new research run, When initialization completes, Then the packet root is `{spec_folder}/research/`.
2. Given a completed research loop, When I inspect the packet, Then the final synthesis document lives at the `research/` packet root.

---

### US-002: Keep review packets internally consistent (Priority: P0)

**As a** deep-review operator, **I want** review iteration artifacts grouped under `review/iterations/`, **so that** review packets have one predictable structure and legacy direct-review iteration files are normalized.

**Acceptance Criteria**:
1. Given a new review run, When an iteration finishes, Then the iteration file is saved under `{spec_folder}/review/iterations/`.
2. Given legacy direct `review/iterations/iteration-*` files, When migration or compatibility logic runs, Then the canonical packet becomes `review/iterations/` plus the review report at the `review/` packet root.

---

### US-003: Trust repo docs and helpers (Priority: P1)

**As a** maintainer, **I want** commands, skills, runtime helpers, and tests to agree on the packet layout, **so that** future changes do not reintroduce path drift.

**Acceptance Criteria**:
1. Given I read the command entrypoint, skill docs, and runtime agent definitions, When I look for canonical paths, Then each surface describes the same layout.
2. Given the helper and indexing tests run, When they inspect packet files, Then iteration directories are excluded from canonical spec-doc classification.

---

### US-004: Migrate existing tracked packets safely (Priority: P1)

**As a** repo maintainer, **I want** tracked `.opencode/specs/` packets moved to the new structure automatically, **so that** the migration is reproducible and the corpus does not keep advertising stale canonical paths.

**Acceptance Criteria**:
1. Given tracked legacy packets exist, When the migration utility runs, Then legacy research artifacts and `research/iterations/iteration-*` files move into the canonical `research/` packet.
2. Given tracked legacy review iterations exist, When the migration utility runs, Then they move into `review/iterations/` and the packet keeps the review report at the `review/` packet root.

---

## 12. OPEN QUESTIONS

- Do any downstream tools outside the scanned first-party surfaces still assume a former root research document and need an explicit compatibility note?
- Are there any generated artifacts outside `.opencode/specs/` that should be migrated in the same change, or should this packet stay limited to tracked first-party spec packets?
- If legacy-tolerant classification remains in runtime helpers, what is the exact threshold for removing that tolerance in a future cleanup packet once the corpus migration is complete?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
