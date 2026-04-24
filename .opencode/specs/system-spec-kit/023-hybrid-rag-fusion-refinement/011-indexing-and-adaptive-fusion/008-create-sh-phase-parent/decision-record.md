---
title: "...pec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/008-create-sh-phase-parent/decision-record]"
description: "Record the path-resolution and flag-surface choices for nested phase append support in create.sh."
trigger_phrases:
  - "phase-parent adr"
  - "create sh nested append decision"
  - "parent-derived resolution adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/008-create-sh-phase-parent"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["decision-record.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Append Nested Child Phases in create.sh
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use the Validated Parent Folder as the Source of Truth for Phase Append Output

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-01 |
| **Deciders** | Current documentation session for Phase 008 |

---

<!-- ANCHOR:adr-001-context -->
### Context

`create.sh` currently uses `SPECS_DIR="$REPO_ROOT/specs"` and assumes that is the correct base tree for top-level creation and append behavior. That is wrong for nested work under `.opencode/specs/`. The script already resolves a parent folder path in append mode, so relying on a separate global root adds failure risk and makes nested parents behave incorrectly.

### Constraints

- The fix must preserve current `--phase --parent` behavior for flat trees.
- Nested parent paths must stay inside approved roots.
- The work should avoid broad refactors outside the phase append flow.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use the validated parent folder as the append source of truth and support `--phase-parent` as a public alias for that path input.

**How it works**: Both `--parent` and `--phase-parent` should feed the same internal parent variable. Once that parent is validated, child numbering, folder creation, and append placement should all use the resolved parent tree instead of `SPECS_DIR`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parent-derived append resolution** | Minimal surface area, works for flat and nested parents, easier to reason about | Requires careful regression checks in append mode | 9/10 |
| Global root switching based on current path | Centralized root logic | Harder to reason about, easier to break unrelated creation flows | 5/10 |
| Support nested append only for `.opencode/specs/` with special cases | Fastest patch | Adds branchy behavior and future maintenance cost | 4/10 |

**Why this one**: Append mode already knows which parent folder matters. Using that validated folder directly is the simplest safe fix and keeps the change local to the failing workflow.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Nested `.opencode/specs/` parents can be appended without writing to the wrong tree.
- Flat parents keep working through the same append logic.

**What it costs**:
- The script will have more explicit branch behavior in append mode. Mitigation: keep it limited to one internal parent variable and one resolution path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Alias precedence is unclear when both flags are passed | M | Define one precedence rule and error clearly on conflicts if needed |
| Validation stays too strict for nested paths | H | Validate the resolved leaf folder, not only the raw input string |
| Validation becomes too loose | H | Keep approved-root checks and reject bad leaf folder names |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current nested parent append flow is documented as broken |
| 2 | **Beyond Local Maxima?** | PASS | The approach solves the wrong-root issue instead of patching one narrow path case |
| 3 | **Sufficient?** | PASS | It targets append mode only and avoids a larger script redesign |
| 4 | **Fits Goal?** | PASS | The phase goal is safe nested append support with backward compatibility |
| 5 | **Open Horizons?** | PASS | The approach leaves room for later cleanup without blocking the immediate fix |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changed** (implemented 2026-04-01):
- `create.sh:157-168`: Added `--phase-parent` parser case (alias for `--parent`)
- `create.sh:218,264`: Help text and nested example added
- `create.sh:291`: Error message updated for both flags
- `create.sh:372,406-414`: `allow_nested_parent` parameter added to `resolve_and_validate_spec_path()` — validates leaf against spec/track folder pattern
- `create.sh:641`: Parent resolution passes `"true"` to skip basename validation

**How to roll back**: `git revert` the commit containing these changes. All 4 modifications are isolated to the phase append flow.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
