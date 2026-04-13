---
title: "Decision Record: Skill Advisor Packaging"
description: "Accepted decisions covering package naming, feature-catalog scope, and the move into the scripts/ runtime subfolder."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "packaging decisions"
  - "skill-advisor scripts adr"
importance_tier: "important"
contextType: "decisions"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-13T13:52:38Z"
    last_updated_by: "gpt-5.4"
    recent_action: "ADR set updated"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]
---
# Decision Record: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Rename the shared routing package to skill-advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User |

---

<!-- ANCHOR:adr-001-context -->
### Context

The advisor code originally lived as a loose shared package under `.opencode/skill/`. That layout made the routing system look like a generic script bucket instead of a first-class skill package.

### Constraints

- The package name had to stay short enough for routine path references in docs and commands.
- Existing repo docs already used the `skill-` naming pattern for peer packages.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Rename the package root to `.opencode/skill/skill-advisor/`.

**How it works**: The routing package now sits under a dedicated skill folder with its own README, setup guide, content directories, runtime scripts, and graph metadata.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **skill-advisor** | Clear purpose, short path, matches peer naming | Requires doc updates | 9/10 |
| system-skill-advisor | More explicit | Too verbose for routine use | 5/10 |
| Keep a generic shared package root | No rename needed | Hides package purpose | 3/10 |

**Why this one**: It gives the routing system a clean, durable package identity without adding path noise.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The routing system is now discoverable as a first-class skill package.
- Peer documentation and metadata can refer to one stable package root.

**What it costs**:
- Existing packet docs had to be updated to the new package root. Mitigation: keep packet references concrete and validate them strictly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stale docs keep the retired package description | Medium | Re-read the live package tree before packet updates |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The package root is `.opencode/skill/skill-advisor/`.
- Packet docs and metadata refer to the new package root explicitly.

**How to roll back**: Restore the prior package root name and update dependent docs, but this is not planned.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Keep the feature catalog as 18 per-feature files plus one root index

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User, Claude Opus 4.6 |

#### Context

The skill-advisor package needed a stable feature inventory that operators and future agents could inspect without reading every runtime file. The package already had natural capability groups for routing, graph behavior, semantic search, and testing.

#### Constraints

- Per-feature files needed to stay small and consistent.
- The root catalog still needed a broader summary format than the snippet files.

---

#### Decision

**We chose**: Keep 18 per-feature catalog files and a separate root feature-catalog index.

**How it works**: Each per-feature file follows the 4-section snippet contract, while the root catalog keeps a multi-section overview format that links the categories together.

---

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **18 snippet files + root index** | Easy to scan, stable linking model, matches current package | More files to maintain | 9/10 |
| One large catalog document | Single file | Harder to scan and update | 4/10 |
| Fewer broader category files | Smaller tree | Loses per-feature precision | 5/10 |

**Why this one**: It preserves fine-grained feature references without forcing the root catalog to mimic the snippet format.

---

#### Consequences

**What improves**:
- Operators get stable per-feature references.
- The root catalog can stay a directory-style summary instead of a forced snippet clone.

**What it costs**:
- The checklist must describe the root-catalog exception explicitly. Mitigation: record that rule in the packet checklist and review notes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reviewers assume the root catalog must match the snippet section count | Medium | Keep the exception explicit in packet docs |

---

#### Implementation

**What changes**:
- The root catalog remains `../../../../../skill/skill-advisor/feature_catalog/feature_catalog.md`.
- The 18 per-feature files remain split under the numbered category folders.

**How to roll back**: Collapse the catalog into a different format and update every cross-reference, which is not planned.

---

### ADR-003: Move runtime scripts into a dedicated scripts/ subfolder

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User, Copilot GPT-5.4 |

#### Context

After the package root became `.opencode/skill/skill-advisor/`, the runtime Python files still sat at the package root alongside documentation and content directories. That left the package root cluttered and inconsistent with other skill folders that keep executable content under a dedicated `scripts/` subfolder.

#### Constraints

- Existing runtime entrypoints needed to stay grouped together with their fixtures and generated graph artifact.
- The package root needed to remain readable as a documentation-and-content surface first.

---

#### Decision

**We chose**: Move the runtime scripts into `.opencode/skill/skill-advisor/scripts/`.

**How it works**: The runtime Python files, supporting fixtures, and generated graph artifact live under `scripts/`, while the package root keeps only `../../../../../skill/skill-advisor/README.md`, the package setup guide, and the content directories visible at the top level.

---

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use a scripts/ subfolder** | Clean root, matches peer conventions, keeps runtime files together | Requires path updates in docs and metadata | 10/10 |
| Keep runtime files at the package root | No follow-up path changes | Clutters the package root and mixes content with runtime code | 4/10 |
| Split files across multiple subfolders | More granularity | Adds unnecessary complexity for a small runtime surface | 3/10 |

**Why this one**: It keeps the package root clean and convention-aligned without adding a deeper hierarchy than the runtime needs.

---

#### Consequences

**What improves**:
- The package root now reads cleanly as docs plus content directories.
- Runtime files, fixtures, and the compiled graph live in one predictable place.

**What it costs**:
- Packet docs, metadata, and command examples must reference `skill-advisor/scripts/`. Mitigation: keep those references concrete and validate the packet strictly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A packet doc keeps the pre-reorg runtime path | Medium | Replace stale references during packet remediation and rerun strict validation |

---

#### Implementation

**What changes**:
- Runtime entrypoints now live at `.opencode/skill/skill-advisor/scripts/skill_advisor.py` and `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`.
- The root package layout keeps `../../../../../skill/skill-advisor/README.md`, the package setup guide, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, and `graph-metadata.json` visible and easy to scan.

**How to roll back**: Move the runtime files back to the package root and update every packet, README, and command reference that now points at `scripts/`, which is not planned.
