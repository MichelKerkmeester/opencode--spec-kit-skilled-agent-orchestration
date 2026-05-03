---
title: "Decision Record: sk-code-opencode-merger"
description: "Architectural decision record for using sk-code as the sole multi-stack code skill and absorbing sk-code-opencode into it."
trigger_phrases:
  - "sk-code-opencode merger adr"
  - "single sk-code decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/066-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T15:00:00Z"
    last_updated_by: "multi-ai-council"
    recent_action: "ADR updated with final route name, two-axis detection, and artifact decisions"
    next_safe_action: "Confirm decision before implementation"
    blockers:
      - "Decision remains proposed until implementation approval"
    key_files:
      - ".opencode/skill/sk-code/SKILL.md"
      - ".opencode/skill/sk-code-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660664"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "One `sk-code` is the desired user-facing end state."
      - "Route name resolved: opencode/OPENCODE."
      - "Detection architecture: two-axis context-aware (Code Surface → Intent)."
      - "Changelogs: DELETE; Telemetry: REGENERATE."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use one route-based `sk-code` instead of sibling `sk-code-*` overlays

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (deep-analysis complete, route name and detection architecture resolved) |
| **Date** | 2026-05-03 |
| **Deciders** | User, maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-code-opencode` currently owns OpenCode system-code standards as a separate sibling skill. `sk-code` currently owns application-code routing and includes Webflow plus Go and React/NextJS placeholder branches. The desired end state is simpler for users: one `sk-code` that shows how to build a multi-stack skill by merging route branches into the same skill tree.

The existing sibling model leaks across the repository. Agents, commands, review docs, advisor scoring, fixtures, generated skill graphs, READMEs, and install guides reference `sk-code-opencode` or the `sk-code-*` overlay contract.

### Constraints

- The current turn is plan-only. No implementation edits outside the spec folder.
- The merge must preserve OpenCode standards for JavaScript, TypeScript, Python, Shell, and JSON/JSONC.
- The Go and React/NextJS branches in `sk-code` are placeholder content and should be removed.
- Runtime agents exist in OpenCode, Claude, Codex, and Gemini variants.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: build a two-axis context-aware `sk-code` router. Code Surface detection (Webflow/OpenCode/Unknown) gates Intent Classification, which drives per-surface resource loading. OpenCode standards merge into `sk-code` as the `opencode` surface route with language sub-detection.

**How it works**:
1. **Code Surface Detection** (first gate): CWD + changed files determine Webflow (HTML/CSS/JS + vanilla animation libs) or OpenCode (files under `.opencode/`) or Unknown (fallback).
2. **Intent Classification** (second gate): weighted keyword scoring selects Implementation/Debug/Verify/CodeQuality/etc.
3. **Per-surface resource loading**: Webflow loads from `references/webflow/`, OpenCode loads from `references/opencode/` with language sub-detection (file extension → JS/TS/Python/Shell/Config standards).
4. OpenCode gains the full 5-phase lifecycle (Research → Implementation → Code Quality Gate → Debugging → Verification) that it currently lacks.
5. Go and NextJS placeholder surfaces are removed entirely.
6. Historical changelogs (13 files) are deleted; telemetry JSONL is regenerated.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merge `sk-code-opencode` into `sk-code`** | One user-facing code skill, clear multi-stack example, reduces advisor ambiguity | Requires broad reference rewrite | 9/10 |
| Keep `sk-code-opencode` as sibling | Lowest immediate change, current tests stay closer | Preserves overlay model the user wants removed | 4/10 |
| Keep sibling but alias it to `sk-code` | Easier migration window | Leaves two visible skills and still teaches the wrong pattern | 5/10 |
| Delete Go/React only, leave OpenCode separate | Removes placeholder branches | Does not solve single-skill goal | 3/10 |

**Why this one**: The chosen approach matches the requested product shape and turns the repository itself into the migration example: multi-stack means route branches inside `sk-code`, not more sibling `sk-code-*` skills.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Users see one canonical code skill.
- Advisor routing has fewer adjacent `sk-code-*` candidates.
- `sk-code` becomes a concrete example of merging a new stack or code domain into one router.

**What it costs**:
- Many references must be updated together. Mitigation: use the resource map and exact search gates before deletion.
- Historical artifacts may continue to mention the old skill. Mitigation: classify them as historical or regenerate them deliberately.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deleted skill remains in advisor scoring | High | Update scorer lanes, skill graph, fixtures, and tests in one phase |
| Runtime agents drift | High | Update all runtime copies from the same wording source |
| Verifier path breaks | Medium | Move script and update all examples before deleting old path |
| Placeholder branch removal surprises agents | Medium | Update supported-stack wording and UNKNOWN behavior |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly requested one `sk-code` and removal of Go/React material |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include sibling retention and aliasing |
| 3 | **Sufficient?** | PASS | Route-based merge solves the stated user-facing shape without inventing new skill families |
| 4 | **Fits Goal?** | PASS | Directly supports "show end users how to make a multi-stack sk-code" |
| 5 | **Open Horizons?** | PASS | Future stacks can be added as route branches inside `sk-code` |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `sk-code` gains two-axis detection and OpenCode surface resources (language standards, checklists, verifier scripts).
- `sk-code-opencode` is deleted after all references are rewritten.
- Go and React/NextJS placeholder resources are removed from `sk-code`.
- Historical changelogs are deleted; telemetry JSONL is regenerated.
- Agents, commands, review contracts, advisor tests, and docs stop using `sk-code-opencode` as a live skill.
- `sk-code-review` overlay contract is rewritten to single-skill model: baseline + surface evidence.

**How to roll back**: Revert the implementation patch, restore `sk-code-opencode` from git, restore Go/NextJS folders if removed in the same patch, regenerate skill graph metadata, and rerun exact reference checks.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
