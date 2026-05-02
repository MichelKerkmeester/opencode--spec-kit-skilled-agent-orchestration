---
title: "Implementation Plan: sk-deep-research Path [skilled-agent-orchestration/035-sk-deep-research-path-migration/plan]"
description: "Plan the repo-wide migration from a root research document plus scratch iterations to a research packet root plus dedicated iteration folders, while standardizing review iterations under review/iterations/ and preserving the review report at the review packet root."
trigger_phrases:
  - "deep-research migration plan"
  - "research packet implementation plan"
  - "review iterations migration"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/035-sk-deep-research-path-migration"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: sk-deep-research Path Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML, Markdown, TOML, TypeScript, Shell, JSON |
| **Framework** | OpenCode command workflows, skill docs, `system-spec-kit` runtime and shell helpers, canonical `.codex/agents/*.toml` plus mirrored runtime agents |
| **Storage** | Git working tree, tracked `.opencode/specs/` packet corpus, packet-local research and review folders |
| **Testing** | Path sweeps, strict spec validation, `system-spec-kit` typecheck/build, targeted Vitest suites, command workflow checks, and migration smoke verification |

### Overview
Implementation will land this as one contract migration rather than incremental cleanup. The work starts by freezing the target research and review packet layouts, then updates command workflows and runtime contracts, then updates `system-spec-kit` path-sensitive logic, then migrates the tracked spec corpus, and finally verifies the repo no longer advertises the old canonical paths except for deliberate legacy-tolerance code paths. The plan keeps the review report stable at the `review/` packet root, adds no `output/` folder, and preserves `scratch/` only as generic temporary workspace.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The target packet layout is frozen in `spec.md`.
- [x] Research and review scope boundaries are explicit: `research/` packet root, `review/iterations/`, no `output/`, keep the review report at the `review/` packet root.
- [x] The migration surfaces are enumerated across commands, skills, runtime agents, `system-spec-kit`, tests, and tracked spec packets.
- [x] The packet explicitly preserves `scratch/` for temporary work instead of deleting it from the repo model entirely.
- [x] Canonical runtime references are pinned to `.codex/agents/*.toml`, with mirrored runtime parity called out as a required follow-on.

### Definition of Done
- [ ] Research auto and confirm workflows create and synthesize against `{spec_folder}/research/`.
- [ ] Review auto and confirm workflows normalize legacy review iterations into `{spec_folder}/review/iterations/`.
- [ ] `sk-deep-research`, `system-spec-kit`, and runtime agent definitions all describe the same packet structure.
- [ ] `system-spec-kit` runtime and shell helpers resolve the new research paths and exclude iteration folders from canonical spec-doc indexing.
- [ ] The migration utility moves tracked spec packets into the new layout without duplicating canonical packet roots.
- [ ] Targeted verification proves the repo no longer advertises old canonical paths outside deliberate tolerance logic or history.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first path migration with bounded legacy tolerance and one-shot corpus rehoming.

### Key Components
- **Command contract**:
  - `.opencode/command/spec_kit/deep-research.md`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`
- **Canonical runtime contract**:
  - `.codex/agents/deep-research.toml`
  - `.codex/agents/deep-review.toml`
  - mirrored runtime agent files in `.opencode`, `.claude`, and `.gemini`
- **Skill and docs contract**:
  - `.opencode/skill/sk-deep-research/`
  - `.opencode/skill/system-spec-kit/`
- **Path-sensitive runtime helpers**:
  - `mcp_server` parsing, storage, type inference, discovery, tool schema, and tests
  - shell helpers under `scripts/common.sh` and `scripts/setup/check-prerequisites.sh`
- **Corpus migration**:
  - `.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts`
  - tracked `.opencode/specs/` packets

### Data Flow
1. Research-mode setup resolves the research packet root as `{spec_folder}/research/` and writes config, JSONL state, strategy, and the final synthesis target there.
2. Each research iteration writes only to the dedicated `research/iterations/` folder.
3. Review-mode setup keeps `{spec_folder}/review/` as the review packet root, but standardizes legacy direct review iterations into `{spec_folder}/review/iterations/`.
4. `system-spec-kit` helpers resolve packet paths using shared path logic so indexing, parsing, artifact routing, and shell outputs agree with the workflow contract.
5. The migration utility rehomes tracked legacy packet artifacts into the new structure and rewrites tracked textual references.

### Target Layout

```text
{spec_folder}/research/
├── deep-research-config.json
├── deep-research-state.jsonl
├── deep-research-strategy.md
├── deep-research-dashboard.md
├── research-ideas.md
├── .deep-research-pause
├── research synthesis document
└── iterations/
    └── iteration-NNN.md

{spec_folder}/review/
├── deep-research-config.json
├── deep-research-state.jsonl
├── deep-review-strategy.md
├── deep-review-dashboard.md
├── .deep-research-pause
├── review report document
└── iterations/
    └── iteration-NNN.md
```

### Migration Rules
- Move the former root research document into the `research/` packet root.
- Move research runtime files that belong to the packet out of `scratch/` into `research/`.
- Move `research/iterations/iteration-*.md` into `research/iterations/`.
- Move direct `review/iterations/iteration-*.md` into `review/iterations/`.
- Leave the review report at the review packet root.
- Exclude `research/iterations/` and `review/iterations/` from canonical spec-doc indexing.
- Allow lightweight legacy recognition only where generic filename or path tolerance already exists; do not document old paths as canonical after this migration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freeze the packet contract
- [ ] Confirm the exact research and review packet trees in command docs, skills, and runtime agent contracts.
- [ ] Freeze the no-`output/` rule and the preserved review-report location.
- [ ] Define the legacy path whitelist for research and review migration.
- [ ] Confirm the tracked corpus root and any path exclusions before running automated migration.

### Phase 2: Update command and runtime contracts
- [ ] Update research auto and confirm YAML workflows to use the `research/` packet root and `research/iterations/`.
- [ ] Update review auto and confirm YAML workflows to normalize iteration files into `review/iterations/`.
- [ ] Update the command Markdown entrypoint to match the landed packet contract.
- [ ] Update canonical `.codex/agents/*.toml` definitions and mirrored runtime agent files so they advertise the same packet paths and permissions.

### Phase 3: Update `sk-deep-research` and `system-spec-kit`
- [ ] Update `sk-deep-research` skill docs, references, diagrams, playbooks, and packet examples to the new structure.
- [ ] Update `system-spec-kit` shell helpers to expose `RESEARCH_DIR` and the new `RESEARCH` path.
- [ ] Update path-sensitive parsing, storage, discovery, indexing, extraction, validation, and artifact-routing logic so iteration folders are treated as working artifacts.
- [ ] Update test fixtures and targeted tests to assert the new packet layout.

### Phase 4: Migrate the tracked spec corpus
- [ ] Implement the migration utility for deep-research packet paths.
- [ ] Run the migration utility against tracked `.opencode/specs/`.
- [ ] Rewrite internal links and packet-local references to the new canonical paths.
- [ ] Verify migrated packets keep a single canonical research and review packet root.

### Phase 5: Verify, document residual tolerance, and close
- [ ] Run targeted path sweeps across commands, skills, runtime agents, system-spec-kit docs, tests, and tracked specs.
- [ ] Run `system-spec-kit` typecheck, build, and targeted tests affected by path-sensitive logic.
- [ ] Validate a representative migrated packet and the 035 packet itself.
- [ ] Record any residual legacy-tolerance logic and explicitly reject any new docs that still advertise old canonical paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Workflow contract verification | The four deep-research YAML workflows and command entrypoint | `rg`, YAML inspection, command-specific tests if available |
| Runtime parity verification | Canonical `.codex/agents/*.toml` and mirrored runtime agent files | `rg`, TOML parse checks, direct inspection |
| Path-helper verification | `system-spec-kit` shell and runtime helper outputs | shell commands, targeted unit tests, strict packet validation |
| Artifact-routing and indexing verification | `mcp_server` parsing, discovery, and artifact-routing logic | targeted Vitest suites |
| Corpus migration verification | Migration utility plus tracked `.opencode/specs/` packets | migration script output, `find`, `rg`, representative validator runs |
| Packet validation | This packet and representative migrated packets | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |

### Planned Verification Queries

- `rg -n '(^|/)(research\\.md|research/iterations/iteration-|review/iterations/iteration-)'` over first-party command, skill, agent, and spec-packet surfaces should return only deliberate tolerance logic or archived history after migration.
- `rg -n 'research/iterations/|review/iterations/|review/'` over the same surfaces should show the new canonical packet contract.
- `npm run --workspaces=false typecheck` and `npm run --workspaces=false build` under `system-spec-kit` must pass after helper changes.
- Targeted Vitest suites for path-sensitive behavior must pass, especially artifact-routing, memory-types, and spec-doc indexing coverage.
- A representative migrated spec packet must pass strict validation after the migration utility runs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-research command workflows | Internal | Available | The packet contract cannot change safely if any workflow keeps the old paths |
| `sk-deep-research` skill package | Internal | Available | User guidance and playbooks will drift from runtime behavior |
| `system-spec-kit` runtime and shell helpers | Internal | Available | Packet discovery, indexing, and setup output may remain inconsistent |
| Canonical `.codex/agents/*.toml` definitions plus mirrored runtimes | Internal | Available | Runtime drift will reappear if only one runtime is updated |
| Migration utility | Internal | Pending implementation | Manual corpus migration would be error-prone and hard to verify |
| Tracked `.opencode/specs/` corpus | Internal | Available | The repo will keep advertising stale canonical paths if the corpus is not migrated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Path-sensitive runtime behavior breaks, packet discovery regresses, migration duplicates or strands artifacts, or docs and runtime contracts drift in a release-blocking way.
- **Procedure**:
  1. Revert the command, skill, runtime helper, and canonical runtime agent changes together.
  2. Preserve migrated packet folders for inspection rather than deleting them blindly.
  3. Restore the previous path contract only if verification proves the migration cannot ship safely in the current wave.
  4. Record the regression cause in the packet before any second rollout attempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Contract Freeze -> Command and Runtime Updates -> System-Spec-Kit Helper Updates -> Corpus Migration -> Verification and Closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Freeze | None | All later phases |
| Command and Runtime Updates | Contract Freeze | Helper updates, docs sync |
| System-Spec-Kit Helper Updates | Command and Runtime Updates | Corpus migration, verification |
| Corpus Migration | Helper updates | Final verification |
| Verification and Closeout | All prior phases | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Freeze | Medium | 45-75 minutes |
| Command and Runtime Updates | High | 2-3 hours |
| `system-spec-kit` Helper Updates | High | 2-4 hours |
| Corpus Migration | High | 1.5-3 hours |
| Verification and Closeout | Medium | 1.5-2.5 hours |
| **Total** | | **7.75-13.75 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Canonical packet diagrams are frozen in docs and runtime contracts
- [ ] Iteration-folder exclusions are covered by tests
- [ ] The migration utility has been dry-run or exercised on a representative packet
- [ ] A grep plan exists for identifying stale old-path references after rollback if needed

### Rollback Procedure
1. Revert the path-contract changes across workflows, skills, runtime helpers, and runtime agents together.
2. Stop using the migration utility until the regression cause is understood.
3. Restore packet references only for the affected canonical paths rather than doing another broad rewrite blindly.
4. Re-run path sweeps and targeted tests before reattempting rollout.

### Data Reversal
- **Has migration behavior?** Yes
- **Reversal procedure**: Preserve migrated packet artifacts, compare canonical and legacy locations, and move only the affected deep-research packet files back if a full rollback is required.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
spec.md + decision-record.md
        |
        v
command workflows + command entrypoint
        |
        +----> canonical .codex runtime definitions ----> mirrored runtime agents
        |
        +----> sk-deep-research docs and playbooks
        |
        +----> system-spec-kit helpers and tests
                              |
                              v
                     migration utility + corpus rehome
                              |
                              v
                         final verification
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet contract | None | Frozen target paths | All implementation work |
| Command workflows | Packet contract | Runtime path behavior | Helper updates, docs sync |
| Canonical runtime definitions | Command workflows | Stable agent contract | Mirrored runtime parity |
| `sk-deep-research` docs | Command workflows | User-facing packet guidance | Final verification |
| `system-spec-kit` helpers | Command workflows | Stable parsing, indexing, shell output | Corpus migration |
| Migration utility | Helper updates | Rehomed tracked packet corpus | Final verification |
| Verification | All prior components | Release confidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze packet contract** - 45-75 minutes - CRITICAL
2. **Update workflows and canonical runtime definitions** - 2-3 hours - CRITICAL
3. **Update `system-spec-kit` helper logic and tests** - 2-4 hours - CRITICAL
4. **Run corpus migration and path rewrites** - 1.5-3 hours - CRITICAL
5. **Execute targeted verification and closeout** - 1.5-2.5 hours - CRITICAL

**Total Critical Path**: 7.75-13.75 hours

**Parallel Opportunities**:
- Mirrored runtime agent updates can run in parallel once the canonical `.codex` contract is frozen.
- `sk-deep-research` docs sync can run in parallel with parts of the `system-spec-kit` helper update once the workflow contract is stable.
- Representative packet validation can be prepared while corpus migration finishes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract Frozen | Spec, plan, and ADR lock the target packet layout and boundaries | Packet readiness |
| M2 | Runtime and Docs Aligned | Workflows, canonical runtime definitions, mirrored runtimes, and skills all describe the same paths | Mid-implementation |
| M3 | Helpers and Tests Updated | `system-spec-kit` resolves new paths and excludes iteration folders correctly | Pre-migration |
| M4 | Corpus Migrated | Tracked `.opencode/specs/` packets moved into canonical packet folders | Pre-closeout |
| M5 | Release Ready | Grep sweeps, validator runs, typecheck, build, and targeted tests all pass with honest residual-risk notes | Closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Treat `research/` and `review/` as packet roots, not mixed root-plus-scratch contracts

**Status**: Accepted

**Context**: The existing mixed layout creates drift across workflows, docs, helpers, and tracked packets.

**Decision**: Canonicalize research state under `{spec_folder}/research/` and review state under `{spec_folder}/review/`, with iteration artifacts in dedicated `iterations/` folders and no `output/` directory.

**Consequences**:
- Packet structure becomes more predictable and easier to validate.
- Migration work expands across commands, skills, runtime helpers, and tracked packet corpus.

**Alternatives Rejected**:
- Keep the former root research document and only move iterations: rejected because the packet root would still be split.
- Add `output/` folders: rejected because the user explicitly ruled that out.
<!-- /ANCHOR:architecture -->
