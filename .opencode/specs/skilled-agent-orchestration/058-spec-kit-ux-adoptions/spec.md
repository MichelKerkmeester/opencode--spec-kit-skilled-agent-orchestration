---
title: "Feature Specification: spec-kit UX adoptions from SPAR-Kit research"
description: "Implement the 5 approved UX adoptions surfaced by packet 057's deep-research run: gate copy + question budget, phase-boundary headers, four-axis command taxonomy doc, template inventory + source-layer manifest, and persona evaluation fixtures."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "058 spec kit ux"
  - "spec kit ux adoptions"
  - "spec kit ux implementation"
  - "spar adoptions"
  - "058 ux upgrade"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/058-spec-kit-ux-adoptions"
    last_updated_at: "2026-05-01T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Bootstrap implementation packet from 057 approved recs"
    next_safe_action: "Phase 1 gate copy and question budget edits"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../057-cmd-spec-kit-ux-upgrade/research/research.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: spec-kit UX adoptions from SPAR-Kit research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` (no feature branch — per-user policy) |
| **Builds On** | `skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade` (research, converged) |
| **Rejected From 057** | 061 ownership manifest, 062 tool ledger, 064 runtime target manifest, 066 ledger authority boundary |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 057's 10-iteration deep-research run produced 12 ranked findings comparing external SPAR-Kit against our internal `system-spec-kit`. The user reviewed the recommendations and approved 5 for adoption (rejecting the higher-risk structural changes 061/062/064 and the now-orphaned boundary doc 066). The approved set is concentrated in copy/inventory work — low-to-medium risk, high operator-clarity payoff — but spans gate UX, command framing, taxonomy documentation, template classification, and doc-review fixtures. Without an implementation packet, the research findings sit in `research/research.md` with no execution path.

### Purpose
Land the 5 approved UX adoptions as 5 sequential phases inside a single Level 2 packet. Each phase produces a concrete, verifiable artifact (edited file, new manifest, new fixture set) without touching the validator, advisor, memory, or runtime contracts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Phase 1 — Gate copy + question budget** (was 058)
- Rewrite consolidated-question prompts in command setup phases to split **Required to proceed** vs **Optional refinements**
- Cap optional questions when budget is tight
- Targets: `command/spec_kit/{plan,implement,deep-research,deep-review,resume,complete}.md` setup phases; matching `assets/*.yaml` consolidated-prompt copy

**Phase 2 — Phase boundary copy pass** (was 059)
- Add **Specify / Plan / Act / Retain** headers above the existing command list
- Targets: `command/spec_kit/README.txt`, top-level `command/README.md` (if present), AGENTS.md command-reference section
- Preserve every existing command and flag — copy-only change

**Phase 3 — Four-axis command taxonomy doc** (was 060)
- Author a new reference doc that documents the 4 independent axes: execution mode, feature flag, lifecycle intent, executor/provenance
- Build a compatibility matrix (which axes each command surface supports)
- Targets: new file `command/spec_kit/references/command-taxonomy.md`; cross-link from command READMEs

**Phase 4 — Template inventory + source-layer manifest** (was 063)
- Classify all `system-spec-kit/templates/` files into 5 roles: source / generated / validation-critical / example / optional asset
- Author a JSON or YAML manifest documenting the source-layer ownership (read-only at this stage)
- Targets: new file `system-spec-kit/templates/INVENTORY.md` + `system-spec-kit/templates/source-manifest.yaml` (or `.json`)
- Strict-validation baseline sample run on the corpus before manifest authoring

**Phase 5 — Persona evaluation fixtures** (was 065)
- Author 6 persona fixture files (Vibe Vera, Promptwright Pete, Terminal Tess, Manager Maya, Maintainer Max, Consultant Cass) as doc-review checklists
- Each fixture asks: "does THIS doc/command work for THIS operator?"
- Targets: new directory `system-spec-kit/references/personas/` with 6 markdown fixtures + 1 README

**Reject-rationale records (cross-cutting docs, no implementation)**
- 067 generated-block budget — write design-decision doc only
- 068 runtime persona boundary — write design-decision doc only
- 069 template compression boundary — write design-decision doc only

### Out of Scope
- **Declarative ownership manifest (was 061)** — rejected per user call; high-overhead, marginal-gain
- **Operator-visible tool ledger (was 062)** — rejected per user call; routing stays in skill-advisor + MCP
- **Runtime target manifest (was 064)** — rejected per user call; depended on 061
- **Tool ledger authority boundary doc (was 066)** — orphaned by 062 rejection
- **Changing the validator, skill advisor, memory MCP, or any runtime command behavior** — copy + inventory + fixtures only
- **Auto-mutating instruction files** — Phase 4 manifest is read-only inspection metadata, no mutation
- **Public package distribution** (npm/install) — explicit reject from 057 research

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `command/spec_kit/plan.md` | Modify | Phase 1 — Required vs Optional split in setup prompt |
| `command/spec_kit/implement.md` | Modify | Phase 1 |
| `command/spec_kit/deep-research.md` | Modify | Phase 1 |
| `command/spec_kit/deep-review.md` | Modify | Phase 1 |
| `command/spec_kit/resume.md` | Modify | Phase 1 |
| `command/spec_kit/complete.md` | Modify | Phase 1 |
| `command/spec_kit/assets/*.yaml` | Modify | Phase 1 — match question-budget copy |
| `command/spec_kit/README.txt` | Modify | Phase 2 — phase-boundary headers |
| `command/README.md` | Modify | Phase 2 (if file exists) |
| `AGENTS.md` | Modify | Phase 2 — command-reference subsection only |
| `command/spec_kit/references/command-taxonomy.md` | Create | Phase 3 — new taxonomy reference |
| `system-spec-kit/templates/INVENTORY.md` | Create | Phase 4 — template inventory |
| `system-spec-kit/templates/source-manifest.yaml` | Create | Phase 4 — source-layer ownership manifest |
| `system-spec-kit/references/personas/README.md` | Create | Phase 5 — fixture index |
| `system-spec-kit/references/personas/{vera,pete,tess,maya,max,cass}.md` | Create | Phase 5 — 6 fixture files |
| `system-spec-kit/references/decisions/067-generated-block-budget.md` | Create | Reject-rationale record |
| `system-spec-kit/references/decisions/068-runtime-persona-boundary.md` | Create | Reject-rationale record |
| `system-spec-kit/references/decisions/069-template-compression-boundary.md` | Create | Reject-rationale record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 1 question-budget split lands across all 6 spec_kit commands | Every consolidated setup prompt visibly separates Required-to-proceed from Optional-refinements; Gate 3 answer keys (A/B/C/D/E) preserved verbatim |
| REQ-002 | Phase 2 phase-boundary headers added to command README | Specify / Plan / Act / Retain section headers visible above command list; every existing command preserved |
| REQ-003 | Phase 3 taxonomy doc authored with full 4-axis matrix | New file at `command/spec_kit/references/command-taxonomy.md` documents each axis with examples and lists which commands support which axes |
| REQ-004 | Phase 4 template inventory complete | `INVENTORY.md` classifies all 99 templates into the 5 roles; `source-manifest.yaml` lists source-of-truth files; baseline strict-validation sample run captured in inventory |
| REQ-005 | Phase 5 persona fixtures authored | 6 persona files + 1 README; each fixture is a doc-review checklist usable against any spec-kit doc |
| REQ-006 | No runtime behavior changed | `validate.sh --strict` on this packet exits 0 or 1; no edits to `validate.sh`, `skill-advisor.py`, `mcp_server/`, `agent/*.md` runtime contracts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | 3 reject-rationale records (067/068/069) authored | One markdown file each under `system-spec-kit/references/decisions/`, brief and link-able from future packet rejections |
| REQ-008 | Each phase has a verification step proving zero behavior drift | Phase 1: gate-3 classifier still parses answers; Phase 2: command list still complete; Phase 3: cross-links resolve; Phase 4: no source files moved; Phase 5: fixtures load as plain markdown |
<!-- /ANCHOR:requirements -->

---

## 4A. ACCEPTANCE SCENARIOS

1. **Given** a user invokes `/spec_kit:plan` after Phase 1, when the consolidated prompt renders, then they see two clearly labelled sections: Required to proceed and Optional refinements.
2. **Given** a user opens `command/spec_kit/README.txt` after Phase 2, when they scan the file, then four section headers (Specify, Plan, Act, Retain) appear above the existing command list with every command preserved.
3. **Given** Phase 3 is complete, when a contributor reads `command-taxonomy.md`, then they can identify a command's execution mode, feature flags, lifecycle intent, and executor/provenance from the matrix without consulting other files.
4. **Given** Phase 4 is complete, when `INVENTORY.md` is opened, then every file under `system-spec-kit/templates/` has exactly one role label, and `source-manifest.yaml` lists only the source-layer files.
5. **Given** Phase 5 is complete, when a contributor reviews any spec-kit doc, then they can pick one persona fixture and run through it as a checklist.
6. **Given** the entire packet is complete, when `validate.sh --strict` runs against the spec folder, then it exits 0 or 1, never 2.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 spec_kit commands ship the Required-vs-Optional split (Phase 1)
- **SC-002**: Phase headers visible in `command/spec_kit/README.txt` (Phase 2)
- **SC-003**: Command taxonomy doc exists with full 4-axis matrix (Phase 3)
- **SC-004**: Template inventory categorizes all 99 files; source manifest lists single-source-of-truth files (Phase 4)
- **SC-005**: 6 persona fixtures + README exist (Phase 5)
- **SC-006**: 3 reject-rationale records authored (P1)
- **SC-007**: `validate.sh --strict` exits 0 or 1 on this packet
- **SC-008**: Zero edits to `validate.sh`, `skill-advisor.py`, `mcp_server/`, agent runtime files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Phase 1 copy edits accidentally break Gate-3 answer-key matching | High | Preserve A/B/C/D/E single-letter keys verbatim; only edit prose around them |
| Risk | Phase 2 header reorganization changes link anchors users have bookmarked | Low | Use new header text without removing existing anchor names |
| Risk | Phase 4 inventory misclassifies a validation-critical file as optional | Med | Cross-check against `validate.sh --strict` invocations and `is_phase_parent()` consumers before finalizing |
| Risk | Phase 5 personas drift into runtime use over time | Med | Each fixture file ships an explicit "evaluation only — do not import into runtime prompts" disclaimer |
| Dependency | Strict-validation baseline sample data | Med | Phase 4 first task; gate Phase 4 inventory on baseline run completing |
| Dependency | Decision on personas directory location | Low | Default: `system-spec-kit/references/personas/`; override if user prefers `system-spec-kit/fixtures/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Phase 1 prompt edits do not increase consolidated-prompt latency
- **NFR-P02**: Phase 4 manifest file size under 50KB

### Security
- **NFR-S01**: No new file writes to runtime instruction files outside the explicit Phase 2 header section
- **NFR-S02**: No secrets, tokens, or PII in any new file

### Reliability
- **NFR-R01**: Each phase is independently revertible via `git revert`
- **NFR-R02**: `validate.sh --strict` exits 0 or 1 after every phase
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty consolidated-prompt sections (rare but possible) → Phase 1 gracefully labels both Required and Optional sections even if one is empty
- Template files without clear classification → Phase 4 marks them `unknown` rather than guessing; flagged for follow-up review

### Error Scenarios
- Strict-validation baseline reveals corpus drift → halt Phase 4, surface drift before manifest authoring
- Persona fixture conflicts with existing voice policy → Phase 5 fixture file ships scope disclaimer

### State Transitions
- Mid-packet pause → each phase has independent commit boundary; resume reads `_memory.continuity` next_safe_action
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 5 phases, 18+ files, but mostly copy/inventory |
| Risk | 9/25 | Low-to-medium; no runtime contracts touched; Phase 4 has the highest risk |
| Research | 5/20 | Already done in 057; this packet is execution |
| **Total** | **28/70** | **Level 2** (5-phase implementation, low blast radius) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should Phase 5 personas live at `system-spec-kit/references/personas/` or `system-spec-kit/fixtures/personas/`?
- Should Phase 4 source-manifest be YAML or JSON? (default: YAML for human readability; JSON if a tool needs to consume it)
- Should reject-rationale records (067/068/069) live alongside personas in `references/decisions/` or in a separate `references/rejected/` directory?
<!-- /ANCHOR:questions -->
