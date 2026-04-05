---
title: "Decision Record: sk-deep-research Path [03--commands-and-skills/035-sk-deep-research-path-migration/decision-record]"
description: "Architectural decisions for moving deep-research into a packet-rooted research/ layout and review iterations into review/iterations/ while preserving the review report at the review packet root."
trigger_phrases:
  - "deep-research path migration adr"
  - "research packet adr"
importance_tier: "important"
contextType: "general"
---
# Decision Record: sk-deep-research Path Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat `research/` and `review/` as canonical packet roots with dedicated `iterations/` folders

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-28 |
| **Deciders** | Spec author, request owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Deep research still carries an older mixed contract where the final synthesis can be conceptualized as a root research document while iterations historically lived in `research/iterations/iteration-*`. Review mode already uses a dedicated `review/` packet for the final report, but compatibility logic still has to normalize legacy direct `review/iterations/iteration-*` layouts. That split makes it harder to explain, validate, and migrate the packet structure consistently across commands, skills, runtime helpers, runtime agents, and tracked packets.

### Constraints

- The user explicitly requested `research/` as the canonical research packet root.
- The user explicitly rejected any `output/` folder.
- The review report must remain at the `review/` packet root.
- `scratch/` must stay available for general disposable work rather than being deleted from the repository vocabulary.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: make `{spec_folder}/research/` the canonical research packet root and require dedicated `iterations/` folders for both research and review packets.

**How it works**: Research mode stores config, JSONL state, strategy, dashboard, ideas, pause sentinel, and the final research synthesis document inside `{spec_folder}/research/`, with iteration artifacts inside `{spec_folder}/research/iterations/`. Review mode keeps its packet root at `{spec_folder}/review/`, preserves the review report at that packet root, and moves all iteration artifacts into `{spec_folder}/review/iterations/`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Packet-rooted `research/` and `review/` with `iterations/` folders** | One predictable structure, easy helper logic, clear migration target, no mixed root-plus-scratch contract | Requires broad repo migration across workflows, docs, helpers, agents, tests, and tracked packets | 9/10 |
| Keep the former root research document and move only iterations | Smaller implementation surface | Leaves the research packet split between root docs and packet state, which preserves the main source of drift | 5/10 |
| Add `output/` folders under research and review | Clear separation between final synthesis and runtime state | Violates the user’s explicit direction and adds unnecessary folder depth | 2/10 |
| Rename the review report during the same migration | Could make names more symmetric | Expands scope and risks breaking review consumers while solving a different problem | 4/10 |

**Why this one**: It solves the actual problem, which is inconsistent packet roots, without layering in a separate naming refactor or an unwanted extra folder.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Research and review packets become easy to locate and explain.
- Path-sensitive helper logic can classify canonical docs and working artifacts more reliably.
- The tracked packet corpus can be migrated deterministically instead of relying on mixed historical conventions.

**What it costs**:
- The migration touches a wide surface across commands, skills, runtime helpers, runtime agents, tests, and tracked packets. Mitigation: land the change as one contract migration with explicit verification.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Some surfaces still advertise old canonical paths after migration | H | Require repo-wide path sweeps and packet validation before closeout |
| Helper logic keeps indexing iteration files as spec docs | H | Add shared path helpers and targeted tests |
| Corpus migration duplicates canonical packet roots | H | Add a deterministic migration utility and post-migration checks |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Mixed packet roots are the direct cause of path drift across commands, skills, helpers, and tracked packets |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were considered and rejected because they preserved drift or expanded scope |
| 3 | **Sufficient?** | PASS | Packet-root migration plus dedicated iteration folders solves the contract issue without a broader naming redesign |
| 4 | **Fits Goal?** | PASS | The goal is canonical deep-research path migration with no `output/` folder |
| 5 | **Open Horizons?** | PASS | This leaves future cleanup of legacy tolerance or naming symmetry available as separate, smaller packets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The four deep-research workflows, command docs, `sk-deep-research`, `system-spec-kit`, runtime agents, tests, fixtures, and tracked packet corpus all move to the packet-rooted contract.
- A migration utility rehomes tracked legacy research and review artifacts into the new packet structure.

**How to roll back**: Revert the workflow, skill, helper, runtime agent, and corpus path changes together; preserve migrated packet folders for inspection rather than deleting them blindly.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
