---
title: "Feature Specification: Template Backend Greenfield Redesign — Eliminate Levels, Lazy Addons, Capability-Flag Manifest"
description: "Greenfield redesign of the spec-kit template system. Drops backward-compat constraint with 868 existing folders (provenance markers are descriptive comments). Goal: simplest possible backend, eliminate level taxonomy in favor of capability flags, lazy command-owned addons, single manifest driving both scaffold + validator."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "template greenfield"
  - "capability flags"
  - "lazy addons"
  - "kill levels"
  - "template backend redesign"
  - "spec-kit greenfield"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign"
    last_updated_at: "2026-05-01T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet; spec.md authored from claude+copilot merged scope"
    next_safe_action: "Dispatch deep-research loop iter 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-11-00-template-greenfield"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: Template Backend Greenfield Redesign

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Sibling packet `010-template-levels/` ran a 10-iteration deep-research loop and recommended PARTIAL consolidation with backward-compat preservation for ~868 existing spec folders. The user explicitly rejected that framing: "We want to change the template system itself and not focus research on fixing stuff retroactively." Existing spec folders are immutable git history — their provenance markers are descriptive comments, nothing re-renders them. They do NOT constrain a new template system.

This packet runs a focused 6-iteration loop on the **greenfield design problem**: simplest possible template backend, eliminate the Level 1/2/3/3+ taxonomy in favor of capability flags, distinguish human-authored scaffold docs from command/agent-owned workflow state, drive both scaffolder AND validator from a single manifest. Scope merged from independent analyses by claude-opus-4-7 (sequential thinking) and gpt-5.5 (cli-copilot).

**Key Decisions** to be made: (a) whether levels are eliminated or just reframed; (b) which addons are scaffolded upfront vs lazy-on-first-write; (c) whether a single manifest can drive scaffold + validator + presets; (d) the minimum parser contract for anchors and frontmatter.

**Critical Dependencies**: memory-frontmatter parsers, validator (`check-files.sh`, `template-structure.js`), `create.sh::copy_template`, phase-parent detection (`isPhaseParent()`), deep-research workflow's `research.md` ownership.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current template system maintains 86 files (~13K LOC) split across `core/`, `addendum/`, four materialized `level_N/` outputs, `phase_parent/`, cross-cutting templates, plus a build-time composer (`compose.sh`) and an anchor wrapper (`wrap-all-templates.ts`). The Level 1/2/3/3+ taxonomy bundles two independent concerns: which doc files a packet needs AND which sections within those docs apply. The four addon docs (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`) are scaffolded as starter templates today, but several are actually written exclusively by automation (e.g. `handover.md` by `/memory:save`, `research.md` by `/spec_kit:deep-research`, `debug-delegation.md` by `@debug` agent). Scaffolding them creates stale empty stubs.

### Purpose
Design the simplest greenfield template backend that:
- Eliminates the level taxonomy in favor of orthogonal capability flags
- Distinguishes author-scaffolded docs (edited at scaffold time) from command/agent-owned docs (created lazily on first write by their owner)
- Drives both scaffolder and validator from one manifest (no separate hardcoded level matrix)
- Preserves the parser contracts (anchors, frontmatter) memory tooling depends on — and identifies the MINIMUM contract, not the current incidental shape
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design a capability-flag system that replaces Level 1/2/3/3+ (e.g., flags like `verify`, `architecture`, `governance`, `phase-parent`)
- Classify every current addon doc as `author-scaffolded` / `command-owned-lazy` / `workflow-owned-packet`
- Define the manifest schema that drives BOTH scaffold AND validator
- Identify the minimum parser contract (anchor formatting, frontmatter shape) memory tooling actually requires
- Produce a final recommendation across 5 candidate designs (F / C+F hybrid / B / D / G — see Open Questions)
- Define the lifecycle for each command-owned addon (when created, by whom, on what trigger)

### Out of Scope (this packet)
- Implementing the redesign — this packet ends with a chosen design + concrete plan; implementation is a follow-on packet
- Migrating existing 868 spec folders — they are immutable history, no migration needed (provenance markers are descriptive comments)
- The PARTIAL plan from `010-template-levels/001-template-consolidation-investigation/research/research.md` — that framing is REJECTED

### Files Under Investigation

| File Path | Role | Investigation Focus |
|-----------|------|---------------------|
| `.opencode/skill/system-spec-kit/templates/core/` | Source-of-truth candidate | What's irreducible? |
| `.opencode/skill/system-spec-kit/templates/addendum/` | Today's "level extensions" | Map to capability flags |
| `.opencode/skill/system-spec-kit/templates/{level_1,level_2,level_3,level_3+}/` | Materialized outputs | Eliminate? |
| `.opencode/skill/system-spec-kit/templates/{handover,debug-delegation,research,resource-map,context-index}.md` | Addon templates | Classify lifecycle |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Scaffolder | Refactor to read manifest |
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | Validator | Refactor to read same manifest |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` | Parser | Document MINIMUM contract |
| `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts` | Parser | Document MINIMUM contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research loop converges on ONE chosen design from {F, C+F hybrid, B, D, G} | `research/research.md` declares chosen design with cited reasoning + rejection rationale for the other 4 |
| REQ-002 | Capability-flag schema replaces Level taxonomy | Schema reproduces today's required-file matrix without any hardcoded level lookup table; phase-parent representable as a flag/kind |
| REQ-003 | Addon docs classified by ownership lifecycle | Every addon (handover, debug-delegation, research, resource-map, context-index) labeled `author-scaffolded` / `command-owned-lazy` / `workflow-owned-packet` with the trigger that creates it |
| REQ-004 | Minimum parser contract documented | Probe-based output: smallest frontmatter + anchor shape that doesn't break `template-structure.js`, `spec-doc-health.ts`, memory parsers, deep-research reducer |
| REQ-005 | Single manifest drives scaffold + validator | Manifest schema with concrete example covering 4 packet shapes (simple-bug-fix, arch-change, phase-parent, investigation); both `create.sh` and `check-files.sh` consume it |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preset shorthand defined | 5-7 named presets covering 90% of real packets |
| REQ-007 | Risk register populated with greenfield-specific risks | Top 3 risks from copilot analysis (false simplicity / parser fragility / addon ownership confusion) addressed with mitigations |
| REQ-008 | Refactor plan with implementable steps | Files to add/modify/delete, ordered phases, CI gates, rollback procedure |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Loop converges within ≤6 iterations OR hits convergence threshold 0.10
- **SC-002**: 8/10 research questions answered with cited evidence
- **SC-003**: Final design eliminates the level taxonomy (or justifies why it must stay)
- **SC-004**: Every addon doc has a documented lifecycle owner + creation trigger
- **SC-005**: Manifest schema example provided with 4 packet shapes verified
- **SC-006**: `decision-record.md` ADR-001 finalized with chosen design + 5/5 Five Checks
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False simplicity — removing levels may push complexity into validators / user decisions | High | REQ-005 forces manifest to drive both scaffold + validator; if it can't, the simplification didn't actually simplify |
| Risk | Parser fragility — undocumented assumptions in `template-structure.js`, `spec-doc-health.ts` may break under any restructure | High | REQ-004 mandates probe-based minimum-contract documentation BEFORE design finalization |
| Risk | Addon ownership confusion — treating workflow state as templates produces stale stubs | Medium | REQ-003 forces explicit classification with creation trigger documentation |
| Risk | Preset sprawl — too many named presets recreate the level-bundle problem | Medium | REQ-006 caps presets at 5-7 covering 90% of real packets |
| Dependency | Memory-frontmatter parsers | Cannot break existing 868 spec folders' READABILITY (they're git history) | Minimum-contract probe (REQ-004) ensures backward-readable parser output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Adding a new capability flag requires changes in ≤2 files (manifest + optionally one new addon template)
- **NFR-M02**: Source surface ≤30 files (down from 86); preferably ≤15

### Performance
- **NFR-P01**: `create.sh --kind X --traits Y,Z` end-to-end ≤500ms

### Reliability
- **NFR-R01**: Manifest is single source of truth; scaffolder and validator MUST agree by construction (impossible to drift)

---

## 8. EDGE CASES

### Phase-parent semantics
Today's `isPhaseParent()` detects parent based on directory contents. New design must produce phase-parent behavior either via `kind: phase-parent` OR via `is_phase_parent: true` capability flag. Pick one and justify.

### Investigation-only packets
Packets like 010 + 011 themselves (research-driven, no implementation). Should `kind: investigation` be a distinct kind, or `kind: implementation + traits: [research]`?

### Cross-cutting templates that aren't level-variant
`handover.md`, `debug-delegation.md`, `research.md` — none are level-variant. They live outside the kind/trait system. Confirm.

### Migration from old packets
Existing 868 packets stay valid as git history. Their `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` markers become descriptive provenance, not resolver keys. Validator must NOT enforce marker presence on new packets if the design eliminates them.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Greenfield design only; touches ~10 source files investigation-wise |
| Risk | 18/25 | Affects every future spec folder; parser breakage = silent corruption |
| Research | 16/20 | 10 focused questions, 5 candidate designs |
| Multi-Agent | 6/15 | Single deep-research loop + cross-validation already done by cli-copilot |
| Coordination | 8/15 | Follow-on implementation packet implied |
| **Total** | **64/100** | **Level 3 confirmed** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | False simplicity (complexity migrates instead of disappears) | H | M | REQ-005 manifest-drives-both forcing function |
| R-002 | Parser contract fragility (silent breakage) | H | M | REQ-004 probe-based minimum-contract documentation |
| R-003 | Addon ownership confusion (stale stubs) | M | H | REQ-003 explicit lifecycle classification |
| R-004 | Preset sprawl (level system reinvented) | M | M | REQ-006 caps at 5-7 presets |
| R-005 | Phase-parent edge case forces special-case code | M | L | Edge case 1 — pick representation explicitly |

---

## 11. USER STORIES

### US-001: Maintainer adds a new section to all "arch" packets (Priority: P0)

**As a** spec-kit maintainer, **I want** to add a Risk Matrix subsection that appears whenever a packet declares the `arch` capability flag, **so that** I edit ONE source location and every future arch packet gets the section automatically.

**Acceptance Criteria**:
1. Given I add a section gated on `arch`, When I scaffold a packet with `--traits arch`, Then the section appears in the output

### US-002: Author scaffolds an investigation packet without empty addon stubs (Priority: P0)

**As a** packet author, **I want** to scaffold an investigation-kind packet without getting empty `handover.md`, `debug-delegation.md`, `research.md` stubs that I'll never edit, **so that** my packet is clean from day one and `/memory:save` or `@debug` or `/spec_kit:deep-research` create those docs lazily on their first write.

**Acceptance Criteria**:
1. Given I run `create.sh --kind investigation`, When the scaffold completes, Then no addon docs are present until their owning command/agent runs

### US-003: Validator and scaffolder cannot disagree (Priority: P0)

**As a** spec-kit maintainer, **I want** the validator and scaffolder to read from the same manifest, **so that** "scaffold creates X but validator demands Y" is structurally impossible.

**Acceptance Criteria**:
1. Given I edit the manifest to add a new required file for the `arch` flag, When I rerun scaffold AND validate against an existing arch packet, Then both reflect the change without code edits

### US-004: Existing 868 packets continue to read correctly (Priority: P1)

**As a** developer using `/spec_kit:resume` on a pre-existing spec folder, **I want** the memory parsers and validators to keep reading frontmatter + anchors correctly, **so that** the redesign doesn't break in-flight work.

**Acceptance Criteria**:
1. Given an existing spec folder created under the OLD level system, When parsers read its frontmatter and anchors, Then they extract the same fields as before (the minimum parser contract identified in REQ-004 must be a SUPERSET of what existing folders provide)

---

## 12. OPEN QUESTIONS

1. What is the **irreducible core** every packet needs? (Hypothesis: spec.md + description.json + graph-metadata.json — nothing else.)
2. Can level → trait/capability flags reproduce today's required-file matrix without new edge cases?
3. Which addon docs are **author-scaffolded** vs **command/agent-owned-on-first-write**? Classify each.
4. What's the **minimum anchor/frontmatter contract** memory parsers actually need? (Probe, don't guess.)
5. Should the trait→requirement mapping live in one manifest that BOTH the scaffolder AND the validator read?
6. How does `phase-parent` compose — distinct kind, capability flag, or template profile?
7. If `handover.md`/`research.md`/`debug-delegation.md` are command-owned, what's the lifecycle contract? When are they created? Who writes them? What does the validator say about absence?
8. What's the smallest set of "presets" (UX shorthand) that covers 90% of real packets, vs forcing users to think in raw kind+traits?
9. What golden-snapshot or scaffold-smoke-test gives maintainers confidence that template edits don't regress parsers?
10. Where does inline section-gating (`<!-- IF arch -->...<!-- /IF -->`) belong vs splitting sections into separate fragment files?

### Candidate designs to score (5)

- **Design F (copilot)**: Minimal scaffold + command-owned addons. Most radical, smallest source surface.
- **Design C+F hybrid (claude+copilot synthesis)**: Capability flags drive scaffold for human-authored docs; command/agent-owned addons stay lazy.
- **Design B**: Single manifest + full-document templates per doc-type. Simplest mental model.
- **Design D**: Section-fragment library with renderer. Maximum reuse.
- **Design G**: Schema-first (data → markdown). Most powerful, likely over-engineered.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Research Artifacts**: See `research/research.md` (produced by `/spec_kit:deep-research`)
- **Prior framing (REJECTED)**: `../001-template-consolidation-investigation/001-template-consolidation-investigation/research/research.md`
- **Cross-validation analysis**: `../001-template-consolidation-investigation/001-template-consolidation-investigation/research/cross-validation/copilot-response.md`
- **Parent Spec**: `../spec.md` (026-graph-and-context-optimization theme)
