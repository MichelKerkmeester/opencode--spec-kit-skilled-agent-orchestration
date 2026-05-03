---
title: "Implementation Plan: sk-code-opencode-merger"
description: "Plan-only consolidation approach for absorbing sk-code-opencode into sk-code, removing Go and React/NextJS branches, and updating all downstream references."
trigger_phrases:
  - "sk-code-opencode merger plan"
  - "single sk-code plan"
  - "resource map"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/066-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T11:04:06Z"
    last_updated_by: "codex"
    recent_action: "Drafted plan-only consolidation strategy"
    next_safe_action: "Await approval before implementation"
    blockers:
      - "DO NOT IMPLEMENT"
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660661"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Historical artifact handling remains undecided."
    answered_questions:
      - "Planning only for this turn."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, TypeScript advisor code/tests, Python verifier scripts, YAML command assets, TOML/Markdown agent files, JSON metadata |
| **Framework** | OpenCode skill and spec-kit framework |
| **Storage** | File-system skill inventory and generated skill graph metadata |
| **Testing** | `rg` reference checks, spec validation, advisor/hook vitest suites, verifier script tests |

### Overview

The implementation should merge `sk-code-opencode` into `sk-code` by adding a first-class OpenCode system-code route inside `sk-code`, moving or copying OpenCode standards resources into that route, and retiring the sibling skill after references are rewritten. In the same implementation, remove Go and React/NextJS placeholder branches from `sk-code` so the surviving multi-stack skill demonstrates a real route model: Webflow plus OpenCode system-code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.
- [x] Resource map created with active blast-radius paths.
- [ ] User approves moving from plan-only to implementation.

### Definition of Done

- [ ] `sk-code` exposes OpenCode system-code routing and resources.
- [ ] `sk-code-opencode` is removed, archived, or reduced to a historical pointer per approved decision.
- [ ] Go and React/NextJS placeholder branches are removed from `sk-code`.
- [ ] Runtime agents and command YAMLs no longer require `sk-code-*` overlays.
- [ ] Skill advisor code, fixtures, graph, and tests no longer emit `sk-code-opencode` as a live route.
- [ ] Exact searches for live `sk-code-opencode` references return only approved historical artifacts.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single skill router with explicit route branches.

### Key Components

- **`sk-code` root router**: owns route detection, resource loading, phase lifecycle, and verification guidance.
- **OpenCode system-code route**: absorbs JS, TS, Python, Shell, JSON/JSONC standards from `sk-code-opencode`.
- **Webflow route**: remains the live application-code route already present in `sk-code`.
- **Deleted placeholder routes**: `GO` and `NEXTJS` are removed until backed by real maintained content.
- **Skill advisor integration**: maps OpenCode/system-code prompts to `sk-code`, not `sk-code-opencode`.
- **Review contract**: `sk-code-review` remains the findings-first review baseline, with `sk-code` providing route-specific standards instead of a sibling overlay.

### Data Flow

Prompts enter the runtime skill advisor, which should recommend `sk-code` for code work. `sk-code` then detects whether the target surface is Webflow/application code or OpenCode system code, loads the corresponding route resources, and returns verification guidance. Review agents load `sk-code-review` for findings format and `sk-code` for route-specific standards evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code-opencode` skill tree | OpenCode standards sibling skill | Merge into `sk-code`, then remove/archive | `rg -n 'sk-code-opencode' .opencode/skill/sk-code .opencode/skill/sk-code-opencode` |
| `sk-code` Go/NextJS branches | Placeholder stacks | Remove folders and route entries | `find .opencode/skill/sk-code -path '*go*' -o -path '*nextjs*'` |
| Runtime agents | Dispatch and review instructions | Rewrite baseline/overlay references | `rg -n 'sk-code-\\*|sk-code-opencode|GO, NEXTJS' .opencode/agent .claude/agents .codex/agents .gemini/agents` |
| `spec_kit` command YAMLs | Auto/confirm workflow definitions | Remove overlay phase names | `rg -n 'sk-code-\\*|overlay' .opencode/command/spec_kit` |
| Skill advisor code/tests | Recommends and tests live skills | Replace `sk-code-opencode` with new `sk-code` route expectations | Targeted vitest and regression fixture checks |
| READMEs/install guides | User-facing inventory | Update skill count, table entries, and examples | `rg -n 'sk-code-opencode|sk-code-\\*' README.md .opencode/install_guides .opencode/skill/README.md` |
| Generated metadata | Skill graph and graph metadata | Regenerate or patch after content move | Compare `skill-graph.json`, `description.json`, `graph-metadata.json` |

Required inventories:
- Same-class producers: `rg -n 'sk-code-opencode|sk-code-\\*|GO|NEXTJS|React|Next\\.js' .opencode .codex .claude .gemini AGENTS.md README.md`.
- Consumers of changed skill ID: `rg -n 'sk-code-opencode' . --glob '!**/z_archive/**' --glob '!**/scratch/**'`.
- Matrix axes: runtime (`opencode`, `claude`, `codex`, `gemini`), surface (`agent`, `command`, `skill`, `advisor`, `doc`, `metadata`), artifact status (`live`, `generated`, `historical`), route (`webflow`, `opencode`, `unknown`).
- Algorithm invariant: after deletion, no live path should instruct agents or advisor code to load `sk-code-opencode`; historical references must be explicitly classified.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Freeze Scope

- [ ] Confirm user approval to implement.
- [ ] Re-run exact reference inventory from `resource-map.md`.
- [ ] Decide historical handling for changelogs, telemetry, and old specs.
- [ ] Create a temporary scratch inventory if needed.

### Phase 2: Merge OpenCode Route into `sk-code`

- [ ] Add OpenCode route language to `.opencode/skill/sk-code/SKILL.md`.
- [ ] Move or copy `sk-code-opencode/references/{shared,javascript,typescript,python,shell,config}` into a chosen `sk-code` route folder.
- [ ] Move or copy `sk-code-opencode/assets/checklists/*` into `sk-code`.
- [ ] Move `verify_alignment_drift.py` and `test_verify_alignment_drift.py` into `sk-code/scripts/` or an equivalent route-owned path.
- [ ] Update `sk-code/README.md`, `description.json`, and `graph-metadata.json`.

### Phase 3: Remove Go and React/NextJS Branches

- [ ] Remove `sk-code/references/go` and `sk-code/assets/go`.
- [ ] Remove `sk-code/references/nextjs` and `sk-code/assets/nextjs`.
- [ ] Remove Go/NextJS route constants, resource maps, keyword triggers, and verification commands from `SKILL.md`.
- [ ] Update `references/router/stack_detection.md`, `resource_loading.md`, `phase_lifecycle.md`, and `cross_stack_pairing.md`.
- [ ] Reword `@code` supported-stack docs to stop citing `GO, NEXTJS`.

### Phase 4: Rewrite Downstream Contracts

- [ ] Update four runtime `code`, `review`, `deep-review`, `orchestrate`, and `multi-ai-council` agent surfaces where they mention overlays or removed stacks.
- [ ] Update `spec_kit_complete_*` and `spec_kit_implement_*` YAML assets.
- [ ] Update CLI skills that teach baseline plus overlay dispatch.
- [ ] Update `sk-code-review` contract and references.
- [ ] Update READMEs and install guides.

### Phase 5: Advisor and Generated Metadata

- [ ] Update `skill_advisor` scorer lanes from `sk-code-opencode` to `sk-code` route-aware expectations.
- [ ] Update fixtures and tests that expect advisor briefs containing `sk-code-opencode`.
- [ ] Regenerate or patch `skill-graph.json`.
- [ ] Refresh skill graph metadata and descriptions.

### Phase 6: Verification

- [ ] Run exact reference checks.
- [ ] Run spec validation.
- [ ] Run targeted advisor/hook tests.
- [ ] Run moved verifier tests.
- [ ] Run skill packaging or metadata checks if available.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Exact reference | Removed skill ID and overlay contract | `rg -n 'sk-code-opencode|sk-code-\\*|overlay skill' ...` |
| Spec validation | This packet | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger --strict` |
| Advisor unit | Skill advisor scoring and hook brief output | Existing vitest tests under `.opencode/skill/system-spec-kit/mcp_server/**` |
| Verifier unit | Moved alignment verifier | Python test currently at `sk-code-opencode/scripts/test_verify_alignment_drift.py` |
| Runtime docs parity | Agent files across OpenCode, Claude, Codex, Gemini | `rg`, diff review, and synchronized wording checks |
| Manual | Skill routing behavior described to users | Read `sk-code/SKILL.md`, README, and `sk-code-review` report template as an end user |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| User approval to implement | Process | Red | This packet must remain plan-only |
| Skill advisor tests | Internal | Yellow | Deleted skill may stay in recommendations |
| Runtime agent parity | Internal | Yellow | Different runtimes may disagree on required skills |
| Historical artifact policy | Decision | Yellow | Exact search cleanup target remains ambiguous |
| Metadata generation scripts | Internal | Yellow | Skill graph and descriptions may drift if hand-edited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor or agent tests fail because `sk-code` route behavior is incomplete, or exact searches show live `sk-code-opencode` dependencies after deletion.
- **Procedure**: Revert runtime edits as one change set, restore `sk-code-opencode` folder if deleted, restore advisor skill graph and fixtures, then rerun exact search and targeted tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 Scope Decision
        |
        v
Phase 2 Merge OpenCode Route ---> Phase 3 Remove Go/NextJS
        |                                  |
        v                                  v
Phase 4 Rewrite Contracts --------> Phase 5 Advisor Metadata
        \                                  /
         +------------ Phase 6 Verify ----+
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User approval | All implementation phases |
| Merge OpenCode Route | Setup | Contract rewrite, advisor rewrite |
| Remove Go/NextJS | Setup | Agent supported-stack rewrite |
| Rewrite Contracts | Merge and removal decisions | Verification |
| Advisor Metadata | Merge route name | Verification |
| Verify | All implementation phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory refresh | Medium | 1-2 hours |
| Merge OpenCode route | High | 4-8 hours |
| Remove Go/NextJS placeholders | Medium | 2-4 hours |
| Rewrite downstream contracts | High | 4-8 hours |
| Advisor and metadata updates | High | 4-8 hours |
| Verification | High | 2-4 hours |
| **Total** | | **17-34 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Snapshot exact search output before implementation.
- [ ] Keep `sk-code-opencode` deletion as the last step.
- [ ] Do not regenerate metadata until content paths settle.

### Rollback Procedure

1. Revert the merge commit or implementation patch.
2. Restore `sk-code-opencode` folder if it was removed.
3. Restore advisor fixtures and skill graph.
4. Re-run exact references and targeted advisor tests.
5. Re-open this packet with the failing surface noted.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert plus metadata regeneration.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
sk-code-opencode resources
        |
        v
sk-code OpenCode route -----> skill advisor route/tests
        |                              |
        v                              v
agent and command contracts ----> exact reference verification
        ^
        |
Go/NextJS branch removal
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `sk-code` route merge | Route name decision | New OpenCode standards branch | Advisor rewrite |
| Go/NextJS removal | Scope approval | Smaller supported-stack set | Agent docs rewrite |
| Agent/command rewrite | New `sk-code` route contract | Runtime-safe instructions | Completion |
| Advisor rewrite | New skill graph shape | Correct recommendations | Completion |
| Docs rewrite | Skill inventory decision | User-facing single-skill story | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Approve implementation and historical policy** - 1 decision - CRITICAL
2. **Merge OpenCode resources into `sk-code`** - 4-8 hours - CRITICAL
3. **Rewrite skill advisor expectations** - 4-8 hours - CRITICAL
4. **Rewrite runtime agents and review contract** - 4-8 hours - CRITICAL
5. **Run reference and test verification** - 2-4 hours - CRITICAL

**Total Critical Path**: 15-29 hours after approval.

**Parallel Opportunities**:
- Go/NextJS removal can run in parallel with README/install guide updates after scope approval.
- Runtime-specific agent rewrites can be split by runtime if write ownership is carefully separated.
- Advisor tests and docs reference checks can run in parallel after the new route name is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Plan approved | User confirms implementation may begin |
| M2 Single-skill route exists | `sk-code` contains OpenCode route docs/resources |
| M3 Placeholder stacks removed | No `GO` or `NEXTJS` support claim remains in `sk-code` live docs |
| M4 Reference contracts updated | Agents, commands, review skill, and docs no longer require `sk-code-*` overlays |
| M5 Advisor aligned | Advisor code/tests no longer use `sk-code-opencode` as live expected skill |
| M6 Verified | Exact references and targeted tests pass or historical refs are documented |
<!-- /ANCHOR:milestones -->
