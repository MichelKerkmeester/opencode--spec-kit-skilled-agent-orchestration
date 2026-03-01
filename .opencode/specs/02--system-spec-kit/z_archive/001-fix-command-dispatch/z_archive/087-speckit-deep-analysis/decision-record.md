---
title: "Decision Record: System-Spec-Kit Deep Analysis & Remediation [087-speckit-deep-analysis/decision-record]"
description: "Three different documentation sources give conflicting template file counts and LOC estimates for the same template levels. This causes confusion for agents loading different fi..."
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "spec"
  - "kit"
  - "decision record"
  - "087"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: System-Spec-Kit Deep Analysis & Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Standardize on SKILL.md Section 4 for Template File Counts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-05 |
| **Deciders** | AI Agent |

---

### Context

Three different documentation sources give conflicting template file counts and LOC estimates for the same template levels. This causes confusion for agents loading different files.

- speckit.md: Level 1 = "4 files (~270 LOC)"
- SKILL.md Section 4: Level 1 = "5 files (~450 LOC)"
- SKILL.md Section 7: Level 1 = "4 files (~270 LOC)"
- README.md: Level 1 = "4 files (~270 LOC)"
- Actual filesystem: Level 1 = 5 files (including README.md)

### Constraints
- Template files include a README.md that is arguably metadata, not a template
- LOC estimates are approximations and change when templates are updated
- Multiple consumers of this information (agents, docs, scripts)

---

### Decision

**Summary**: Use SKILL.md Section 4 counts as the canonical source of truth, counting README.md as a template file.

**Details**: Updated speckit.md, SKILL.md Section 7, and README.md to all match SKILL.md Section 4: Level 1 = 5 files (~450 LOC), Level 2 = 6 files (~890 LOC), Level 3 = 7 files (~890 LOC), Level 3+ = 7 files (~1080 LOC).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **SKILL.md Section 4 (Chosen)** | Matches filesystem count, includes all files | README may not be a "template" | 8/10 |
| Exclude README.md | Cleaner template-only count | Doesn't match ls output, confusing | 5/10 |
| Add footnote to each | Explains both counts | More text to maintain | 4/10 |

**Why Chosen**: Matches actual filesystem `ls` output, reducing confusion for agents verifying template counts.

---

### Consequences

**Positive**:
- Single source of truth eliminates confusion
- All documentation now consistent

**Negative**:
- README.md counted as template file (minor semantic inaccuracy)

---

## ADR-002: Lower Debug Boost Instead of Adding New Booster

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-05 |
| **Deciders** | AI Agent |

---

### Context

The "debug" keyword in skill_advisor.py routes to mcp-chrome-devtools with a boost of 1.0, but AGENTS.md Failure Pattern #17 says "3+ failed attempts -> /spec_kit:debug". These conflict: an agent asking for help debugging would be routed to chrome devtools instead of the spec-kit debug delegation workflow.

### Constraints
- INTENT_BOOSTERS match on individual words (no compound phrase support)
- The /spec_kit:debug command is a behavioral instruction in AGENTS.md, not a skill
- "debug" is genuinely ambiguous between browser debugging and general debugging

---

### Decision

**Summary**: Lower the "debug" boost for chrome-devtools from 1.0 to 0.6 so it falls below the 0.8 threshold for ambiguous queries.

**Details**: Explicit chrome-devtools keywords ("debugger" at 1.0, "devtools" at 1.2, "chrome" at 1.0, "browser" at 1.2) remain high. Only the ambiguous "debug" is lowered. This means "debug this issue" won't auto-route to chrome-devtools, but "debug in chrome devtools" still will (multiple keywords compound).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lower boost (Chosen)** | Simple, preserves explicit routing | "debug in browser" needs extra context | 8/10 |
| Add spec_kit_debug booster | Directly routes debug to spec-kit | Creates routing conflict between two skills | 4/10 |
| Add compound phrase matching | Most precise | Requires code changes to matching algorithm | 6/10 |

**Why Chosen**: Minimal change, lets AGENTS.md behavioral rules handle ambiguous cases as designed.

---

### Consequences

**Positive**:
- Ambiguous "debug" queries correctly fall through to general approach
- AGENTS.md Pattern #17 can now guide to /spec_kit:debug as intended

**Negative**:
- "debug" alone doesn't route to chrome-devtools anymore
- Mitigation: "debugger", "devtools", "chrome", "inspect" still route correctly

---

## ADR-003: Document Shared-DB Rather Than Create Project-Local DB

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-05 |
| **Deciders** | AI Agent |

---

### Context

The SPEC_KIT_DB_DIR environment variable is not set in opencode.json, so the SQLite database lives in the symlink target at `.opencode/skill/system-spec-kit/mcp_server/database/`. This means all projects sharing the `.opencode` symlink share one memory database. The MEMORY.md notes `.opencode-local/database/` as the intended project-local path, but this directory doesn't exist.

### Constraints
- Creating a new project-local DB would start empty (no existing memories)
- Migrating memories between databases is non-trivial
- Multiple projects may benefit from shared context
- The user has not requested project isolation

---

### Decision

**Summary**: Document the shared-DB architecture in opencode.json with a `_NOTE_0_SHARED_DB` field explaining how to enable project isolation.

**Details**: Added note: "Database is shared across all projects using the .opencode symlink. Set SPEC_KIT_DB_DIR to .opencode-local/database for project-local isolation." This preserves existing behavior while documenting the opt-in path.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document as intentional (Chosen)** | No data loss, preserves status quo | Shared DB remains default | 8/10 |
| Create project-local DB | True isolation | Loses all existing memories | 3/10 |
| Migrate + create local | Best of both | Complex migration, risk of data loss | 5/10 |

**Why Chosen**: Safest approach with no risk of data loss. User can opt in to isolation later.

---

## Session Decision Log

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 10:30 | Gate 3 | PASS (D - Skip, work already started) | HIGH | 0.10 | Implementation was in progress before spec folder created |
| 10:35 | Gate 2 | PASS (system-spec-kit) | HIGH | 0.05 | Direct user instruction to implement analysis plan |
| 11:00 | ADR-001 | Accepted | HIGH | 0.15 | SKILL.md Section 4 matches filesystem |
| 11:05 | ADR-002 | Accepted | HIGH | 0.20 | Verified with threshold tests |
| 11:10 | ADR-003 | Accepted | HIGH | 0.10 | Safest approach, no data loss |
