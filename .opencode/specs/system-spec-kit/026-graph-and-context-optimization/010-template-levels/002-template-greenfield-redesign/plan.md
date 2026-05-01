---
title: "Implementation Plan: Template Backend Greenfield Redesign — C+F Hybrid Manifest-Driven"
description: "Investigation packet ended with chosen design (C+F hybrid). Concrete refactor phases for the follow-on implementation packet are documented here. Phases 1-4 take 86 → 15 source files, eliminate the level taxonomy, and migrate validators + scaffolder to consume a single manifest."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "template greenfield plan"
  - "C+F hybrid plan"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign"
    last_updated_at: "2026-05-01T12:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan updated post-convergence with concrete refactor phases"
    next_safe_action: "User triggers follow-on implementation packet to execute Phases 1-4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-11-00-template-greenfield"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Template Backend Greenfield Redesign — C+F Hybrid Manifest-Driven

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (manifest-loader, inline-gate-renderer) + Bash (scaffolder integration) |
| **Framework** | Node.js for TS modules; pure shell for orchestration; reuse existing test harness (vitest) |
| **Storage** | Filesystem only — `.opencode/skill/system-spec-kit/templates/manifest/` |
| **Testing** | Golden-snapshot tests per preset (5+1 cases from iter 4); existing `validate.sh --strict`; new manifest-loader unit tests |

### Overview
This packet completed Phase 0 (deep-research investigation, 9 iters, converged). The chosen design (C+F hybrid manifest-driven greenfield) collapses the spec-kit template system from 86 files to 15 by eliminating the Level 1/2/3/3+ taxonomy and replacing it with three orthogonal axes (kind + capabilities + presets) plus explicit addon-doc lifecycle ownership. Phases 1-4 below execute in a follow-on implementation packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear (`spec.md` §2)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Dependencies identified (`spec.md` §6)
- [x] Deep-research convergence achieved (iter 9 newInfoRatio 0.06)

### Definition of Done
- [x] `research/research.md` produced (40.9 KB, 17 sections)
- [x] `research/resource-map.md` produced (11.5 KB)
- [x] `decision-record.md` ADR-001 finalized; ADR-002/003/004 added for synthesis open items
- [x] All 10 design questions Q1-Q10 answered with cited evidence
- [ ] `validate.sh --strict` exits 0 or 1 (post these spec-doc edits)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Manifest-driven scaffolder + validator with inline-gated single-document templates.** Single source of truth (`spec-kit-docs.json`) drives both the scaffolder (`create.sh`) and the validators (`check-files.sh`, `check-sections.sh`, etc.). Templates are full markdown docs with inline `<!-- IF capability:X -->...<!-- /IF -->` gates for variant sections.

### Key Components
- **`templates/manifest/spec-kit-docs.json`** — Single manifest. Declares kinds, capabilities, presets, per-doc-template ownership/trigger/absence-behavior, section profiles.
- **`templates/manifest/*.md.tmpl`** — 12 markdown templates (4 author-core + 3 capability-gated + 2 author-optional + 3 lazy command/agent/workflow-owned).
- **`mcp_server/lib/templates/manifest-loader.ts`** — TS loader exposing `loadManifest()`, `resolveTemplate(level, name)`, `getRequiredDocs(kind, capabilities)`.
- **`scripts/templates/inline-gate-renderer.ts`** — Strips ungated sections per EBNF grammar (defined in research.md §7).
- **`scripts/lib/template-utils.sh::scaffold_from_manifest()`** — Shell wrapper sourcing the loader's compiled JS.

### Data Flow
```
User: create.sh --preset arch-change --name "Foo" .opencode/specs/foo/
  ↓
create.sh resolves preset → kind=implementation, capabilities=[qa-verification, architecture-decisions]
  ↓
scaffold_from_manifest() reads spec-kit-docs.json + computes file list
  ↓
For each authored doc: copy_template + inline-gate-renderer (strip ungated sections)
  ↓
Emit description.json + graph-metadata.json with kind+capabilities+manifestVersion embedded
  ↓
(later) validate.sh reads packet's frontmatter → looks up manifest → checks required files + sections
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Deep Research ✅ COMPLETE (this packet)
- [x] 9-iter loop converged at newInfoRatio 0.06
- [x] research.md (40.9 KB) + resource-map.md (11.5 KB)
- [x] ADR-001 (chosen design) + ADR-002/003/004 (open-item resolutions)

### Phase 1: ADD private manifest + level-contract resolver + renderer + workflow-invariance test (follow-on packet)
**Goal**: ship the new internal infrastructure additively. Nothing breaks because nothing reads it yet. Workflow-invariance test added FIRST so any future leak gets caught.
- [ ] ADD `templates/manifest/spec-kit-docs.json` — PRIVATE manifest (per ADR-005 — never AI-readable)
- [ ] ADD 12 `templates/manifest/*.md.tmpl` files — author-core + capability-gated + lazy (with `[capability]`/"Sub-phase manifest" leak fixes from iter-12)
- [ ] ADD `mcp_server/lib/templates/level-contract-resolver.ts` — TS API: `resolveLevelContract(level): LevelContract` (renamed from manifest-loader per ADR-005)
- [ ] ADD `scripts/templates/inline-gate-renderer.ts` — EBNF-driven gate stripper
- [ ] ADD `scripts/lib/template-utils.sh::resolve_level_contract` — shell wrapper returning JSON via stdout
- [ ] ADD `scripts/tests/workflow-invariance.vitest.ts` — CI test that greps every public surface for banned vocabulary (`preset|capability|kind|manifest`); fails build on leak (per ADR-005)
- [ ] ADD vitest cases: resolver unit tests + inline-gate-renderer EBNF tests + 6 golden-snapshot scaffold tests + workflow-invariance test
- [ ] FIX leaks identified iter 12: replace `[capability]` placeholder text in level_3/level_3+ templates with `[applicable]`; replace "Sub-phase manifest" in phase-parent template with "Sub-phase list"
- **GATE**: all new tests pass; workflow-invariance test green; existing `validate.sh --strict` still works against existing packets (we haven't touched it yet)

### Phase 2: MODIFY scaffolder (follow-on packet)
**Goal**: switch `create.sh` to consume the private level-contract resolver. Public CLI flag stays `--level N` (ADR-005); no `--preset` flag exposed.
- [ ] MODIFY `scripts/spec/create.sh` lines ~538-661: replace level→files matrix with `resolve_level_contract <level>` call (~30-line diff from iter-7-revised)
- [ ] KEEP `--level N` as the public flag (ADR-005); DROP any reference to `--preset` from `--help` text
- [ ] Verify scaffolder log lines stay level-only ("scaffolding Level 3 spec folder", NOT "scaffolding arch-change preset")
- [ ] Verify generated `description.json` + `graph-metadata.json` keep `level: N` field; do NOT add `preset`/`capabilities`/`manifestVersion` to AI-readable metadata
- **GATE**: scaffold-comparison test (old vs new) shows identical file lists for every level; CLI help text contains zero banned vocabulary; workflow-invariance test still green

### Phase 3: MODIFY validators (follow-on packet)
**Goal**: switch validators to consume the same private resolver. Public error messages stay level-only.
- [ ] MODIFY `scripts/rules/check-files.sh`: replace level→files matrix with `resolve_level_contract` call (~20-line diff from iter-7-revised)
- [ ] MODIFY `scripts/rules/check-sections.sh` + `check-template-headers.sh` + `check-section-counts.sh`: read section gates via resolver; render gates before assertions
- [ ] MODIFY `mcp_server/lib/validation/spec-doc-structure.ts` (if exists): consume same resolver
- [ ] Verify error messages stay level-only (per ADR-005): "Level 3 packet missing required file: decision-record.md" — NEVER "capability=architecture-decisions missing"
- [ ] Verify validators produce same exit codes for existing packets (regression test against all 868 existing folders)
- **GATE**: zero regressions in `validate.sh --strict` against any existing packet; new packets validate cleanly; workflow-invariance test still green

### Phase 4: DELETE legacy template trees (follow-on packet)
**Goal**: remove the obsolete level dirs + composer.
- [ ] DELETE `templates/{level_1,level_2,level_3,level_3+,addendum,phase_parent}/` — entire trees
- [ ] DELETE `scripts/templates/compose.sh` + `wrap-all-templates.{ts,sh}` — composer obsolete
- [ ] UPDATE `SKILL.md`, `CLAUDE.md`, `AGENTS.md` — keep level vocabulary, remove file-path references to deleted dirs
- [ ] Final end-to-end verification: scaffold one packet per level (1/2/3/3+/phase-parent), validate each
- **GATE**: `rg "templates/level_"` returns zero hits outside historical fixtures + git log; final scaffolds + validates pass; one-commit `git revert` rollback verified; workflow-invariance test still green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | [Components/functions] | [Jest/pytest/etc.] |
| Integration | [API endpoints/flows] | [Tools] |
| Manual | [User journeys] | Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: [Conditions requiring rollback]
- **Procedure**: [How to revert changes]
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| [Component A] | None | [Output] | B, C |
| [Component B] | A | [Output] | D |
| [Component C] | A | [Output] | D |
| [Component D] | B, C | [Final] | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **[Phase/Task]** - [Duration estimate] - CRITICAL
2. **[Phase/Task]** - [Duration estimate] - CRITICAL
3. **[Phase/Task]** - [Duration estimate] - CRITICAL

**Total Critical Path**: [Sum of durations]

**Parallel Opportunities**:
- [Task A] and [Task B] can run simultaneously
- [Task C] and [Task D] can run after Phase 1
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [Setup Complete] | [All dependencies ready] | [Date/Phase] |
| M2 | [Core Done] | [Main features working] | [Date/Phase] |
| M3 | [Release Ready] | [All tests pass] | [Date/Phase] |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: [Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [What problem we're solving]

**Decision**: [What we decided]

**Consequences**:
- [Positive outcome 1]
- [Negative outcome + mitigation]

**Alternatives Rejected**:
- [Option B]: [Why rejected]

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
