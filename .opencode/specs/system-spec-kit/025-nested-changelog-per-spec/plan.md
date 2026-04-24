---
title: "Implementation Plan: Nested Changelog Per Spec [system-spec-kit/025-nested-changelog-per-spec/plan]"
description: "Implements packet-local nested changelog generation in system-spec-kit by adding a dedicated script, canonical templates, and command/documentation updates that route packet-aware workflows to the new output mode."
trigger_phrases:
  - "implementation plan"
  - "nested changelog"
  - "025"
  - "phase changelog"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/025-nested-changelog-per-spec"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Nested Changelog Per Spec

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, YAML |
| **Framework** | System Spec Kit command + template workflow |
| **Storage** | Filesystem packet docs under `.opencode/specs/**` |
| **Testing** | TypeScript build plus focused Vitest coverage |

### Overview
The implementation adds a new packet-local changelog workflow that can derive nested changelog output for spec roots and phase child folders. Delivery centers on one generator script, two canonical templates, and command/skill/reference updates so packet-aware completion flows can produce changelog history in a consistent location.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing packet changelog patterns reviewed from packet `024-compact-code-graph`
- [x] Scope limited to nested changelog workflow, not general packet validator enforcement
- [x] Verification targets identified: scripts build and focused nested changelog tests

### Definition of Done
- [x] Nested changelog generator supports root and phase modes
- [x] Command, template, skill, and reference docs are synchronized
- [x] Build and focused tests pass for the new workflow
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generator plus template-driven rendering inside the existing System Spec Kit scripts package.

### Key Components
- **`nested-changelog.ts`**: Resolves the target spec folder, derives changelog data, and renders markdown.
- **Changelog templates**: Provide separate packet-root and phase-child output shapes.
- **Command surfaces**: Route `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` to nested mode when packet-aware conditions are true.

### Data Flow
The user or command resolves a packet root or child phase folder, the generator reads packet documents such as `spec.md`, `implementation-summary.md`, `tasks.md`, and `checklist.md`, derives summary/change/verification sections, and renders the result into the parent packet's `changelog/` directory using the correct template.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Analyze Existing Packet Changelog Behavior
- [x] Review packet `024-compact-code-graph/changelog` examples
- [x] Review `/create:changelog` release-note workflow
- [x] Define packet-root vs child-phase path rules

### Phase 2: Add Nested Changelog Runtime
- [x] Implement `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts`
- [x] Add `.opencode/skill/system-spec-kit/templates/changelog/root.md` and `.opencode/skill/system-spec-kit/templates/changelog/phase.md`
- [x] Export and document the generator in the scripts package

### Phase 3: Align Workflow Surfaces
- [x] Update `/create:changelog` docs and YAML assets for nested mode
- [x] Update `/spec_kit:implement` and `/spec_kit:complete` to generate nested changelogs when packet-aware
- [x] Update skill, references, template docs, and phase guidance

### Phase 4: Verify and Close Out
- [x] Fix template path resolution in the generator
- [x] Run scripts build
- [x] Run focused nested changelog Vitest coverage
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Scripts package compiles with the new generator | `cd .opencode/skill/system-spec-kit/scripts && npm run build` |
| Unit | Root and phase nested changelog generation paths | `npx vitest run tests/nested-changelog.vitest.ts --config ../mcp_server/vitest.config.ts --root .` |
| Manual | Command and packet-doc wording consistency | Direct file review across command, skill, template, and reference surfaces |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing packet structure under `.opencode/specs` | Internal | Green | Generator cannot resolve approved packet paths |
| System Spec Kit scripts package build | Internal | Green | Runtime change cannot ship safely without a clean compile |
| Packet docs (`spec.md`, `implementation-summary.md`, `tasks.md`, `checklist.md`) | Internal | Green | Generated changelog quality drops if source docs are incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Nested changelog mode writes to incorrect paths, renders broken markdown, or confuses the global release-note workflow.
- **Procedure**: Revert the nested generator, templates, and command-surface changes together so `/create:changelog` returns to release-note-only behavior and packet workflows keep using `implementation-summary.md` alone.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Packet analysis ──► Generator + templates ──► Command/docs alignment ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Analysis | None | Generator, docs |
| Generator + templates | Analysis | Command alignment, verification |
| Command/docs alignment | Generator + templates | Closeout |
| Verification | Generator + templates, command/docs alignment | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Analysis | Medium | 1-2 hours |
| Generator + templates | Medium | 2-4 hours |
| Command/docs alignment | Medium | 2-3 hours |
| Verification | Low | <1 hour |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Packet examples reviewed before standardizing output paths
- [x] Generator tested for both root and phase modes
- [x] Command docs updated at the same time as runtime changes

### Rollback Procedure
1. Revert `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts`
2. Revert the changelog templates and documentation updates
3. Revert `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` nested-mode wording
4. Re-run scripts build to confirm the package compiles after rollback

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Remove packet changelog files generated by the reverted workflow if any were created during testing
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Existing packet docs │
└──────────┬───────────┘
           ▼
┌────────────────────────────┐
│ nested-changelog.ts        │
│ path + content derivation  │
└──────────┬─────────────────┘
           ▼
┌────────────────────────────┐
│ changelog templates        │
│ root packet / phase packet │
└──────────┬─────────────────┘
           ▼
┌────────────────────────────┐
│ command + skill guidance   │
│ create / implement /       │
│ complete / references      │
└──────────┬─────────────────┘
           ▼
┌────────────────────────────┐
│ build + focused tests      │
└────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet analysis | Existing packet examples | Output rules | Generator |
| Generator | Packet analysis | Derived changelog payloads | Templates, commands |
| Templates | Generator contract | Renderable markdown | Commands, tests |
| Command/docs alignment | Generator + templates | Discoverable workflow | Completion |
| Verification | Generator + command/docs alignment | Release confidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Review packet `024` changelog behavior** - 1-2 hours - CRITICAL
2. **Implement nested generator and templates** - 2-4 hours - CRITICAL
3. **Align command and documentation surfaces** - 2-3 hours - CRITICAL
4. **Build and run focused tests** - <1 hour - CRITICAL

**Total Critical Path**: 5-10 hours

**Parallel Opportunities**:
- Skill/reference/template doc edits can be aligned while command assets are updated
- Packet documentation closeout can run after implementation is verified
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Output contract defined | Root and phase naming rules finalized | Analysis |
| M2 | Runtime shipped | Generator and templates added | Implementation |
| M3 | Workflow aligned | Commands and references describe nested mode accurately | Documentation alignment |
| M4 | Release confidence | Build and focused nested changelog tests pass | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

> **Note:** This section summarizes the key architectural decision. The authoritative source is [`decision-record.md`](./decision-record.md), which contains the full ADR-001 record including context, alternatives, consequences, and implementation details.

### ADR-001: Keep nested changelog additive and packet-scoped

**Status**: Accepted

**Summary**: Nested changelog generation is additive to `implementation-summary.md` and scoped per packet (root or nested phase folder). Output lands under the parent packet's `changelog/` directory with consistent `changelog-<packet>-root.md` / `changelog-<packet>-<phase-folder>.md` naming. See `decision-record.md` for the full decision record.
