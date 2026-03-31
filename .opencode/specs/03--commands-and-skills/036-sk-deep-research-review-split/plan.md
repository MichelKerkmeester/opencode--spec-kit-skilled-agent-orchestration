---
title: "Implementation Plan: Split sk-deep-research review mode [03--commands-and-skills/036-sk-deep-research-review-split/plan]"
description: "Separates review mode into a dedicated skill and command while simplifying sk-deep-research back to investigation-only behavior."
trigger_phrases:
  - "deep-review split plan"
  - "review mode split implementation"
  - "036 plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Split sk-deep-research Review Mode into sk-deep-review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TOML, YAML, Python routing metadata |
| **Framework** | OpenCode command and skill documentation system |
| **Storage** | File-based documentation and runtime wrappers only |
| **Testing** | Manual read-through, changelog review, and workflow verification |

### Overview

This change splits the former review-mode half of `sk-deep-research` into a dedicated `sk-deep-review` skill and command. The work touches skill references, YAML workflows, agent/runtime wrappers, routing metadata, and top-level documentation so review and research are routed independently.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Split objective documented and bounded
- [x] Existing shipped behavior summarized from changelog and handover artifacts
- [x] Target command, skill, wrapper, and documentation surfaces identified

### Definition of Done
- [ ] New review command and skill surfaces exist together
- [ ] Research skill no longer presents review mode as part of its primary workflow
- [ ] Routing, wrappers, and docs point users to the correct capability
- [ ] Spec, plan, tasks, checklist, and implementation summary remain internally consistent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation and runtime-wrapper split. One conceptual capability becomes two explicit skill/command packages with shared cross-references.

### Key Components

- **`sk-deep-review` skill package**: Holds review contract, references, assets, test playbook, and dedicated command entrypoint
- **`sk-deep-research` skill package**: Keeps investigation workflows and links to deep-review for auditing
- **Skill advisor + runtime wrappers**: Route review requests to the new command and wrapper names
- **Top-level docs + changelog**: Explain the split and the breaking rename

### Data Flow

User asks for iterative review
→ skill advisor matches review keywords
→ runtime wrapper resolves `/spec_kit:deep-review`
→ `sk-deep-review` references and assets load

User asks for research
→ skill advisor keeps routing to `sk-deep-research`
→ research-only references load
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish the split surface
- [ ] Identify all review-specific command, skill, wrapper, and documentation entrypoints
- [ ] Create the standalone `sk-deep-review` package and command entrypoint
- [ ] Preserve the review contract and supporting reference set during the move

### Phase 2: Narrow `sk-deep-research`
- [ ] Remove review triggers, review-mode guidance, and review examples from the research skill
- [ ] Add cross-references from research docs to the new review skill where needed
- [ ] Keep research-only behavior intact after review content is removed

### Phase 3: Update routing and wrappers
- [ ] Point advisor keyword routing to `sk-deep-review`
- [ ] Update OpenCode and other runtime wrappers to the new command/skill names
- [ ] Rename or refresh review YAML workflow assets to the deep-review naming

### Phase 4: Verify published surfaces
- [ ] Update top-level docs and package indexes
- [ ] Publish changelog and upgrade guidance for the breaking rename
- [ ] Confirm spec-folder documentation reflects the shipped split accurately
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual documentation audit | Review command docs, skill references, README/index surfaces | Read tool |
| Routing verification | Confirm review keywords map to `sk-deep-review` and research keywords stay with `sk-deep-research` | Source inspection |
| Wrapper consistency check | Compare runtime wrapper names and references across supported runtimes | Read tool |
| Release verification | Confirm changelog/upgrade guidance documents the command rename | Changelog review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing review-mode references and assets | Internal | Green | Needed to reconstruct the split accurately |
| Skill advisor routing metadata | Internal | Green | Wrong mapping would leave review requests on the old path |
| Top-level documentation surfaces | Internal | Green | Users could miss the rename if only package-local docs change |
| Changelog publication | Internal | Green | Breaking command rename would lack upgrade guidance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Split leaves commands, wrappers, or docs in an inconsistent mixed state
- **Procedure**: Revert the command, wrapper, advisor, and doc changes together so research and review return to one known routing model
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Split surface) ───────┐
                               ├──► Phase 2 (Narrow research skill) ──┐
                               └──► Phase 3 (Routing + wrappers) ──────┼──► Phase 4 (Published verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Split surface | None | Narrowing, routing, verification |
| Narrow research skill | Split surface | Published verification |
| Routing + wrappers | Split surface | Published verification |
| Published verification | Phases 2 and 3 | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Split surface | Medium | 1-2 hours |
| Narrow research skill | Medium | 1-2 hours |
| Routing + wrappers | Medium | 1-2 hours |
| Published verification | Low | 30-60 minutes |
| **Total** | | **3.5-6.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Review command and skill names finalized
- [ ] Runtime wrapper rename/update completed everywhere
- [ ] Top-level docs and changelog prepared together

### Rollback Procedure
1. Revert `sk-deep-review` command and wrapper additions
2. Restore review-mode guidance in `sk-deep-research`
3. Restore previous advisor routing and YAML workflow names
4. Revert documentation and changelog entries together

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - this split changes documentation, wrappers, and routing metadata only
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
