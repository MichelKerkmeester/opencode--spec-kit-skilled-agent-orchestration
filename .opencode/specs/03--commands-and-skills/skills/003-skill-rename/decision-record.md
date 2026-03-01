---
title: "Decision Record: Skill Rename — workflows-* to sk-*/mcp-* [002-skill-rename/decision-record]"
description: "We needed to rename 7 skills across ~370 files, touching 10+ directories and shared configuration files. The core challenge: multiple skills are referenced in the same files (e...."
trigger_phrases:
  - "decision"
  - "record"
  - "skill"
  - "rename"
  - "workflows"
  - "decision record"
  - "038"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Per-Skill Phase Decomposition

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | User + AI Assistant |

---

### Context

We needed to rename 7 skills across ~370 files, touching 10+ directories and shared configuration files. The core challenge: multiple skills are referenced in the same files (e.g., `orchestrate.md` references 4+ skills, install guides reference all 7). Processing all renames simultaneously risked partial replacements and made verification difficult.

### Constraints

- Shared files (agent/orchestrate.md, install guides, root docs) reference multiple skills
- `workflows-code--*` has 3 variants with overlapping prefixes requiring careful ordering
- Each rename must be independently verifiable via grep
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Per-skill phase decomposition — one phase folder per skill rename, executed sequentially in longest-match-first order.

**How it works**: Each phase handles ALL changes for ONE skill (folder rename, internal files, external references, skill_advisor.py entries, agent files, etc.). Phases execute from longest old name to shortest to prevent partial substring matches. Each phase is independently verifiable: `grep -r "old-name"` should return 0 after completion.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-skill phases (Chosen)** | Independent verification, isolated failure, parallel planning | Sequential execution required, shared files touched multiple times | 9/10 |
| Monolithic single-pass | Fastest execution, single commit | Cannot verify incrementally, harder to debug failures, ~370 files in one operation | 5/10 |
| By-file-type grouping | Fewer passes over shared files | Cannot verify per-skill completeness, partial renames harder to detect | 4/10 |

**Why this one**: Per-skill phases scored highest because each phase produces an independently verifiable state. If Phase 3 completes, we know `sk-code--full-stack` is fully renamed, regardless of whether Phase 4 has started. This isolation makes debugging straightforward and allows safe stopping points between phases.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each phase is independently verifiable via a single grep command
- Failures are isolated to one skill, not spread across all 7
- Phase documentation (spec/plan/tasks) can be created in parallel

**What it costs**:
- Shared files are edited 7 times (once per phase) instead of once. Mitigation: Each phase only modifies its own skill's entries, so edits don't overlap.
- Sequential execution takes longer than a single batch operation. Mitigation: The planning phase (documentation) runs in parallel.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Partial replacement in shared file (e.g., renaming `workflows-code` catches `sk-code--full-stack`) | H | Longest-match-first execution order prevents this |
| Phase boundary confusion (which files belong to which phase) | M | Each phase's tasks.md enumerates every file explicitly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 7 skills need renaming; decomposition needed for ~370 files |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives evaluated; per-skill scored 9/10 |
| 3 | **Sufficient?** | PASS | Simplest approach that allows incremental verification |
| 4 | **Fits Goal?** | PASS | Directly enables safe, verifiable skill renaming |
| 5 | **Open Horizons?** | PASS | No lock-in; phases can be reordered if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Parent spec folder upgraded from L2 to L3+ with Phase Documentation Map
- 7 child spec folders created (001 through 007), each Level 2
- Execution order: Phase 3 → 1 → 2 → 7 → 4 → 6 → 5 (longest match first)

**How to roll back**: Delete phase folders (`rm -rf 001-* 002-* ... 007-*`), revert parent files via `git checkout -- spec.md plan.md checklist.md`, delete tasks.md and decision-record.md.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3+ Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
State decisions with certainty. Be honest about trade-offs.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
