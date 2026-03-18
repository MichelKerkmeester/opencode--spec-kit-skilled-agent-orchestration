---
title: "Decision Record: Create Commands Codex Compatibility [012-create-codex-compatibility/decision-record]"
description: "level: 3"
trigger_phrases:
  - "decision"
  - "record"
  - "create"
  - "commands"
  - "codex"
  - "decision record"
  - "012"
importance_tier: "important"
contextType: "decision"
completed: 2026-02-17
created: 2026-02-17
level: 3
status: done
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Decision Record: Create Commands Codex Compatibility

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse Three-Pronged Approach from Spec 010

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team |

---

### Context

Create command files exhibit the same Codex compatibility issues as spec_kit command files: `## Agent Routing` sections with `@agent` names in tables, `dispatch:` fields with imperative language, and weak `<!-- REFERENCE ONLY -->` HTML comment guards. Spec 010 already solved these issues for spec_kit commands using a three-pronged approach (strip, constrain, restructure). We need to decide whether to apply the same approach to create commands or develop a create-specific strategy.

### Constraints
- Must be consistent with spec 010 approach for cross-command maintainability
- Must handle two complexity tiers (3-agent and 1-agent .md files)
- Must preserve agent availability metadata in YAML workflows
- Must not break existing command functionality
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Apply the identical three-pronged strategy from spec 010 to all 20 create command files.

**Details**:
- **Change A**: Strip `## Agent Routing` sections and `<!-- REFERENCE ONLY/END -->` guards from all 6 .md files
- **Change B**: Add `## CONSTRAINTS` section with explicit anti-dispatch rules to all 6 .md files
- **Change C**: Restructure YAML `agent_routing:` to `agent_availability:` across all 14 YAML files -- remove `dispatch:` and `agent:` fields, add `condition:` and `not_for:` fields
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse Spec 010 Approach** | Consistent, proven, low risk, same verification patterns | Does not optimize for create-specific structure | 9/10 |
| Create-Specific Approach | Could leverage per-step embedding of agent_routing | Unnecessary divergence, higher risk, harder to verify, harder to maintain | 4/10 |
| Minimal Changes (guards only) | Least effort | Does not address root causes (agent_routing and dispatch fields) | 3/10 |

**Why Chosen**: The three-pronged approach from spec 010 is proven, verified, and directly applicable. Create commands have the same root causes. Using the same approach ensures consistency across the entire command infrastructure and allows the same 7 grep verification checks to work for both spec_kit and create commands.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Consistent approach across spec_kit and create command families
- Proven pattern reduces implementation risk to near-zero
- Same verification methodology works (7 grep checks)
- Easier long-term maintenance (one pattern to understand)

**Negative**:
- Does not optimize for create commands' per-step agent_routing embedding -- Mitigation: The generic approach works correctly regardless of embedding location

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Pattern does not translate to create structure | L | Tested incrementally per phase; create's per-step embedding is a subset of spec_kit's patterns |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Codex dispatches agents prematurely when reading create command files |
| 2 | **Beyond Local Maxima?** | PASS | Considered create-specific approach and minimal guards; three-pronged is most thorough |
| 3 | **Sufficient?** | PASS | Addresses all three root causes (routing sections, dispatch fields, weak guards) |
| 4 | **Fits Goal?** | PASS | Directly prevents Codex from misinterpreting agent metadata as dispatch instructions |
| 5 | **Open Horizons?** | PASS | Does not lock in; future command families can apply same or different approach |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/create/*.md` (6 files) -- Changes A and B
- `.opencode/command/create/assets/*.yaml` (14 files) -- Change C

**Rollback**: Git revert commits that modified create command files; verify with 7 grep checks
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Bundle Emoji Cleanup (Change D)

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team |

---

### Context

Spec 011 established that emoji enforcement should be removed from the `/create` command infrastructure. Create command files still contain stale emoji optionality language (e.g., "emojis are optional", `emoji_conventions:` YAML fields). Since this spec (012) is already touching all 14 YAML files and all 6 .md files for Codex compatibility, we need to decide whether to clean up emoji language now or in a separate pass.

### Constraints
- All 20 target files are already being modified for Changes A-C
- Emoji optionality language exists in both .md and .yaml files
- `emoji_conventions:` needs renaming to `section_icons:` in folder_readme YAMLs specifically
- Must not remove cosmetic emojis already present in templates
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Bundle emoji cleanup (Change D) into this spec rather than creating a separate pass.

**Details**: Remove all emoji optionality language from all 20 create command files during the same editing pass. Rename `emoji_conventions:` to `section_icons:` in the 2 folder_readme YAML files. Leave existing cosmetic emojis in template content untouched. Add verification check #7 (`[Ee]moji` returns 0 matches) to confirm completeness.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bundle in This Spec** | Single pass over all files, efficient, no revisiting | Slightly larger scope for spec 012 | 9/10 |
| Separate Spec | Cleaner scope isolation | Would re-edit the same 14 YAML files, doubling touch points | 4/10 |
| Defer Indefinitely | Zero effort | Stale emoji language persists, contradicts spec 011 policy | 2/10 |

**Why Chosen**: Since all 20 files are already open for editing, bundling emoji cleanup is the most efficient approach. Creating a separate spec would require touching the same 14 YAML files again, which doubles the risk of merge conflicts and review overhead. The additional scope (Change D) is minor compared to Changes A-C.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Single editing pass over all 20 files (maximum efficiency)
- Aligned with spec 011 emoji policy immediately
- All create command files are clean in one operation
- No future re-editing needed for emoji cleanup

**Negative**:
- Slightly larger scope for spec 012 -- Mitigation: Change D is minor (string removal and one field rename)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Emoji cleanup accidentally removes content emojis | L | Only remove optionality language, not decorative emojis; verify with targeted grep |
| Scope creep | L | Change D is well-defined and bounded (grep-verifiable) |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Stale emoji language contradicts spec 011 policy; files are already being edited |
| 2 | **Beyond Local Maxima?** | PASS | Considered separate spec; bundling is more efficient and reduces total touch points |
| 3 | **Sufficient?** | PASS | Removes all emoji references (verified by grep check #7) |
| 4 | **Fits Goal?** | PASS | Aligns with spec 011 goal of removing emoji enforcement from create commands |
| 5 | **Open Horizons?** | PASS | Does not prevent future emoji-related changes; cosmetic emojis preserved |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/create/*.md` (6 files) -- emoji optionality language removal
- `.opencode/command/create/assets/*.yaml` (14 files) -- emoji language removal + `emoji_conventions:` rename in folder_readme variants

**Rollback**: Git revert; emoji language can be restored from git history if needed
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record
Two ADRs documented with full five-checks evaluation
Both decisions: Accepted (2026-02-17)
-->
