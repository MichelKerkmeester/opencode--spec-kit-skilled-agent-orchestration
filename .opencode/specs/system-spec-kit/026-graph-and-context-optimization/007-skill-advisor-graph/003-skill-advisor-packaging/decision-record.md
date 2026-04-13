---
title: "Decision Record: Skill Advisor Packaging"
description: "Decisions on folder rename, feature catalog scope, and reference update strategy."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "packaging decisions"
importance_tier: "important"
contextType: "decisions"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created decision record"
    next_safe_action: "Implement feature catalog"
    key_files: ["decision-record.md"]
---
# Decision Record: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: Rename scripts/ to skill-advisor/

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User |

---

### Context

The skill advisor code originally lived in a shared scripts directory directly under `.opencode/skill`, which did not reflect its purpose as a skill package. The user considered `system-skill-advisor` but settled on `skill-advisor` for conciseness.

### Constraints

- All Python scripts use `SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))` for self-relative paths
- CLAUDE.md references `scripts/` in Gate 2 invocation
- No other skill references `scripts/` as a dependency

### Decision

**We chose**: Rename to `.opencode/skill/skill-advisor/` to match the naming convention of other skill folders.

**How it works**: `mv scripts/ skill-advisor/`. All Python scripts use self-relative paths, so no code changes needed. CLAUDE.md and spec docs need path updates.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **skill-advisor** | Concise, matches naming convention | Shorter than other `system-` prefixed skills | 8/10 |
| system-skill-advisor | Matches system-spec-kit prefix | Verbose, user rejected | 5/10 |
| Keep scripts/ | No changes needed | Generic name, unclear purpose | 3/10 |

**Why this one**: User explicitly chose `skill-advisor` after considering alternatives.

### Consequences

**What improves**:
- Folder name reflects its purpose as a skill package
- Consistent with other skill folder naming

**What it costs**:
- CLAUDE.md, spec docs, and root playbook need path updates. Mitigation: grep sweep after rename.

---

## ADR-002: Feature Catalog Scope — 18 Features Across 4 Categories

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User, Claude Opus 4.6 |

---

### Context

The user requested a feature catalog "regarding everything skill advisor." The skill advisor has multiple subsystems: routing pipeline, graph system, semantic search integration, and testing infrastructure. These need to be cataloged comprehensively for operator reference.

### Decision

**We chose**: 18 features across 4 categories, matching the playbook's category structure for consistency.

**How it works**: Each feature gets its own file following the sk-doc catalog snippet template (4 sections: Overview, Current Reality, Source Files, Source Metadata). The root FEATURE_CATALOG.md provides summary tables linking to per-feature files.

| Category | Features | Rationale |
|----------|----------|-----------|
| 01--routing-pipeline | 6 | Core advisor stages from discovery through filtering |
| 02--graph-system | 8 | All graph components from metadata through evidence separation |
| 03--semantic-search | 2 | CocoIndex integration and auto-triggers |
| 04--testing | 2 | Regression harness and health check |

### Consequences

**What improves**:
- Complete feature reference for the skill advisor system
- Category alignment with playbook enables cross-referencing

**What it costs**:
- 18 files to create and maintain. Mitigation: features are stable; catalog updates needed only when skill_advisor.py changes significantly.
