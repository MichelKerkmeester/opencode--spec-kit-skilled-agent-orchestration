---
title: "Implementation Plan: Template Greenfield — 4 Phases, Gated, Single-Commit Rollback"
description: "Phase-by-phase execution of the C+F hybrid manifest-driven greenfield implementation. References resource-map.md for the file-by-file blast radius. Workflow-invariance preserved throughout."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "012 plan"
  - "template impl phases"
  - "manifest impl plan"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl"
    last_updated_at: "2026-05-01T15:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 4 split into 4A/4B/4C"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-14-10-template-impl"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Template Greenfield — 4 Phases, Gated, Single-Commit Rollback

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (resolver + renderer) + Bash (scaffolder + validator integration) |
| **Framework** | Node.js for TS modules; pure shell for orchestration; vitest for tests |
| **Storage** | Filesystem only (`templates/manifest/`) |
| **Testing** | New: workflow-invariance, level-contract-resolver, inline-gate-renderer, scaffold-golden-snapshots vitests. Existing: validate.sh --strict regression against 868 packets. |

### Overview
Execute 4 phases per packet 002's plan. Phase 1 is purely additive (new infrastructure + CI test gate). Phases 2-3 modify existing scaffolder/validators atomically. Phase 4 is internally split into 4A/4B/4C review chunks and deletes 57 obsolete files. All phases land via a single commit (or atomic PR) so `git revert <commit>` restores pre-impl state cleanly. **`resource-map.md` is the authoritative file-by-file ledger** — every phase below references its §X for affected paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `resource-map.md` written (this packet) — comprehensive file ledger
- [x] Source design converged (`002/research/research.md`)
- [x] ADRs accepted (`011/decision-record.md` ADR-001 through ADR-005)
- [ ] Phase 1 PR opened

### Definition of Done
- [ ] All phases landed, including Phase 4A/4B/4C internal review chunks
- [ ] Each phase's gate green
- [ ] Workflow-invariance CI test green throughout
- [ ] Scaffold-comparison test passes for all 5 levels
- [ ] Zero validator regressions against 868 existing packets
- [ ] One-commit `git revert` rollback verified manually
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per ADR-001 + ADR-005 (packet 002):

### Pattern
Manifest-driven scaffolder + validator with inline-gated single-document templates. Single source of truth (`spec-kit-docs.json`) drives both the scaffolder (`create.sh`) and the validators (`check-files.sh`, `check-sections.sh`, etc.). Templates are full markdown docs with inline `<!-- IF level:N -->...<!-- /IF -->` gates for level-variant sections. Public/AI-facing surface stays level-only; preset/capability/kind names are STRICTLY private.

### Key Components (all listed in `resource-map.md` §1-§2)
- **`templates/manifest/spec-kit-docs.json`** — private manifest
- **`templates/manifest/*.md.tmpl`** (12 files) — author + capability-gated + lazy templates
- **`mcp_server/lib/templates/level-contract-resolver.ts`** — TS API
- **`scripts/templates/inline-gate-renderer.{ts,sh}`** — gate stripper
- **`scripts/lib/template-utils.sh::resolve_level_contract`** — shell wrapper
- **`scripts/tests/workflow-invariance.vitest.ts`** — CI guardrail

### Data Flow
```
AI calls: create.sh --level 3 --short-name 'X' .opencode/specs/foo/
  ↓
create.sh resolves level → resolve_level_contract '3' → LevelContract{requiredCoreDocs, addonDocs, sectionGates, ...}
  ↓
For each doc in contract: copy_template (which pipes through inline-gate-renderer to strip ungated sections)
  ↓
Emit description.json + graph-metadata.json with `level: 3` field embedded
  ↓
(later) validate.sh reads packet's level frontmatter → resolve_level_contract '3' → check required files + sections
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: ADD private infrastructure + CI guardrail + leak fixes
**Goal**: ship the new infrastructure WITHOUT touching any production code path. The only existing-file modifications are (a) `template-utils.sh` gets a NEW function added (no existing function altered), (b) 2 test fixture dirs are rewritten (test-only, no production behavior). Production scaffolder, validators, and template files stay byte-identical.
**Affected files**: `resource-map.md` §1 (21 files created including internal manifest README + `template-utils.sh` function addition + 2 fixture rewrites)
**Estimated effort**: 10-15 hours (revised upward per review — see L2: EFFORT)

**Steps:**
1. ADD `templates/manifest/spec-kit-docs.json` — concrete manifest from packet 002 iter 8 dry-run
2. ADD 12 `templates/manifest/*.md.tmpl` files (spec/plan/tasks/impl-summary/checklist/decision-record/phase-parent.spec/resource-map/context-index/handover/debug-delegation/research). Migrate content from current `templates/core/`, `templates/addendum/`, `templates/level_N/` into single-file templates with inline `<!-- IF level:N -->` gates
3. ADD `mcp_server/lib/templates/level-contract-resolver.ts` — full API per ADR-005:
   ```typescript
   function resolveLevelContract(level: '1'|'2'|'3'|'3+'|'phase'): LevelContract;
   interface LevelContract {
     requiredCoreDocs: string[];
     requiredAddonDocs: string[];
     lazyAddonDocs: string[];
     sectionGates: Map<string, string[]>;
     frontmatterMarkerLevel: number;
   }
   ```
4. ADD `scripts/templates/inline-gate-renderer.ts` — EBNF-driven gate stripper per packet 002 iter-6 grammar
5. ADD `scripts/templates/inline-gate-renderer.sh` — shell wrapper for use inside `create.sh`
6. ADD `scripts/lib/template-utils.sh::resolve_level_contract` (NEW function, doesn't replace `copy_template` yet)
7. ADD `scripts/tests/workflow-invariance.vitest.ts` — per packet 002 §18.8 (binding scope) **+ audit-D extension**: scans **(a)** live script outputs (`create.sh --help`, `create.sh` stdout/stderr, `validate.sh` summary, all `check-*.sh` error messages, `scaffold-debug-delegation.sh` output), **(b)** generated fixture snapshots (every file in `scripts/tests/fixtures/`), **(c)** template sources (`templates/manifest/*.md.tmpl` and `templates/manifest/spec-kit-docs.json`), **(d)** command docs (`.opencode/command/spec_kit/*.md` + `assets/*.yaml`), **(e)** agent prompts (`.opencode/agent/*.md`), **(f)** skill/root policy docs (`CLAUDE.md`, `AGENTS.md`, `AGENTS_Barter.md`, `.opencode/skill/system-spec-kit/SKILL.md`), **(g) AI-readable feature catalog (`.opencode/skill/system-spec-kit/feature_catalog/**/*.md`)**, **(h) AI-readable manual testing playbook (`.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md`)**. Banned regex: `\b(preset|capabilit(y|ies)|\bkind\b|manifest)\b` case-insensitive, word-boundary. Allowlist: explicit path/section entries for historical research references (e.g., `002/research/research.md`, `003/decision-record.md`, `templates/manifest/README.md` — maintainer-facing only) AND for source-path identifiers that retain banned terms in symbol names (e.g., `capability-flags.ts` per audit-D — adds explicit allowlist entry per ADR-005 maintainer-facing exemption). Fails build on leak in any of the 8 surface categories.
8. ADD `scripts/tests/level-contract-resolver.vitest.ts` — unit tests for resolver
9. ADD `scripts/tests/inline-gate-renderer.vitest.ts` — EBNF grammar tests
10. ADD `scripts/tests/scaffold-golden-snapshots.vitest.ts` — 6 snapshots (1 per level + minimum-viable spec)
11. FIX 2 leaks per packet-011 §18.8 (CANONICAL WORDING): 
    - Replace `[capability]` with `[needed behavior]` in user-story syntax: `**As a** [user type], **I want** [needed behavior], **so that** [benefit].`
    - Also replace addendum frontmatter title/description: `As a [user type], I want [needed behavior], so that [benefit].`
    - Replace keyword entry `"capability"` with `"needed behavior"` in trigger-phrases lists.
    - Replace phase-parent wording: `Sub-phase list: which child phase folders exist and what each one does` (per 011 §18.8 — NOT generic "Sub-phase list").
    - All applied to NEW manifest templates, not legacy.
12. REWRITE 2 stale fixtures: `scripts/tests/fixtures/phase-detection/phase-blocked-by-level/` and `phase-validation/mixed-levels/` to use new manifest output

**GATE 1**: 
- [ ] All 21 added files exist (including `templates/manifest/README.md` internal-only maintainer docs)
- [ ] All 4 vitest cases pass
- [ ] Workflow-invariance test fails on a deliberately-injected leak fixture (proves it works)
- [ ] Workflow-invariance test scope verified to cover ALL surfaces from packet 002 §18.8: live script outputs, generated fixture snapshots, template sources, command docs, agent prompts, skill/root policy docs (CLAUDE.md, AGENTS.md, AGENTS_Barter.md, SKILL.md). Historical research references allowed only via explicit path/section allowlists.
- [ ] Existing `validate.sh --strict` against any current packet produces same exit code as before (zero regressions; only NON-PRODUCTION-PATH changes occurred: new function in `template-utils.sh`, 2 test fixture rewrites)

---

### Phase 2: MODIFY scaffolder
**Goal**: switch `create.sh` to consume the new resolver. Public `--level N` flag stays exactly as today.
**Affected files**: `resource-map.md` §2 (5 files modified)
**Estimated effort**: 4-6 hours

**Steps:**
1. MODIFY `scripts/spec/create.sh` lines ~538-661 (per packet 002 iter-7-revised diff): replace level→files matrix with `resolve_level_contract <level>` call. ~30-line diff. Drop any `--preset` references from `--help` text (per ADR-005). Keep all log lines level-only ("scaffolding Level 3 spec folder").
2. MODIFY `scripts/lib/template-utils.sh::copy_template`: replace direct `cp` from `level_N/` with resolver-driven copy. Pipe each copied template through `inline-gate-renderer.sh` to strip ungated sections.
3. MODIFY `scripts/spec/scaffold-debug-delegation.sh`: switch from copying `templates/debug-delegation.md` to using `templates/manifest/debug-delegation.md.tmpl` via resolver. Behavior + log output unchanged.
4. MODIFY `scripts/spec/recommend-level.sh`: audit + verify level vocabulary preserved (likely no functional change)
5. MODIFY `scripts/spec/upgrade-level.sh`: audit + verify; small refactor if it reads template paths directly

**GATE 2**:
- [ ] Scaffold-comparison test (old vs new) shows identical file lists for every level (1/2/3/3+/phase-parent); only INTENDED differences (absence of stale empty stubs) appear
- [ ] CLI help text contains zero banned vocabulary (`workflow-invariance.vitest.ts` green)
- [ ] Existing `validate.sh --strict` against any packet (old or freshly-scaffolded by new code) passes

---

### Phase 3: MODIFY validators
**Goal**: switch validators to consume the new resolver. Error messages stay level-only (per ADR-005).
**Affected files**: `resource-map.md` §2 (11 files modified including `template-structure.js` — the largest single-file refactor)
**Estimated effort**: 5-8 hours

**Steps:**
1. MODIFY `scripts/rules/check-files.sh`: replace level→required-files matrix with `resolve_level_contract <level>` call (~20-line diff per packet 002 iter-7-revised). Error messages stay level-only.
2. MODIFY `scripts/rules/check-sections.sh`: read section gates from resolver. Render gates before assertions.
3. MODIFY `scripts/rules/check-template-headers.sh`: read header expectations from resolver.
4. MODIFY `scripts/rules/check-section-counts.sh`: read count thresholds per level from resolver.
5. AUDIT `scripts/rules/check-level.sh`, `check-level-match.sh`: verify level vocabulary preserved; refactor only if needed.
6. AUDIT `scripts/rules/check-template-source.sh`: today checks `<!-- SPECKIT_TEMPLATE_SOURCE -->` marker. New design may simplify or remove this check (markers become descriptive). Decide here.
7. MODIFY `scripts/spec/check-template-staleness.sh`: today compares spec-folder docs against `templates/level_N/`. New: compare against manifest-rendered output via resolver.
8. MODIFY `scripts/utils/template-structure.js`: today reads `templates/level_N/` for header/anchor contracts. New: read manifest-rendered output via resolver. **Largest single-file refactor in this phase.**
9. MODIFY `mcp_server/lib/validation/spec-doc-structure.ts`: today encodes level structure for validation. New: consume resolver via `level-contract-resolver.ts`.

**GATE 3**:
- [ ] Validator regression test: `validate.sh --strict` against all 868 existing spec folders shows zero new errors (warnings may differ in non-substantive ways)
- [ ] Workflow-invariance test still green (validator error messages contain zero banned vocabulary)
- [ ] Freshly-scaffolded packets at all 5 levels validate cleanly

---

### Phase 4: DELETE legacy + UPDATE docs + AI-PROMPT VOCABULARY CLEANUP (audit-driven)
> **Internal split rationale**: Codex recommendation is `SPLIT_PHASE_4_ONLY`: review-chunk decomposition on one integration branch, not independent sibling packets or independently mergeable branches. Phase 4 stays inside this packet and runs strictly after Phase 3 as Phase 4A → Phase 4B → Phase 4C.

**Goal**: remove the obsolete level dirs + composer + obsolete tests, then update AI-facing surfaces, catalog/playbook docs, and final proof artifacts without converting this packet into a phase parent.
**Affected files**: `resource-map.md` §3 (57 deletions) + §2 (doc/test modifications) + **§2.5 (audit-surfaced AI-facing, catalog, and playbook files)**
**Estimated effort**: **8-13 hours** (revised again post-audit-D — original 2-3h → 6-10h after audits A/B/C added 32 files → now 8-13h after audit-D added 30 catalog/playbook files; stress_test confirmed NO-OP)

#### Phase 4A: Legacy removal + test retargeting
**Goal**: delete legacy template/composer assets and retarget the remaining template tests before AI-facing cleanup starts.
**Sub-phase effort estimate**: ~3-5 hours
**Validation gate**: CHK-G4-01 through CHK-G4-05

**Steps:**
1. DELETE `templates/level_1/`, `templates/level_2/`, `templates/level_3/`, `templates/level_3+/` — entire trees (25 .md files per resource-map subtotal)
2. DELETE `templates/core/`, `templates/addendum/`, `templates/phase_parent/` — entire trees (23 .md files)
3. DELETE `templates/handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`, `README.md` — root cross-cutting templates (6 files; content migrated to `templates/manifest/*.md.tmpl`)
4. DELETE `scripts/templates/compose.sh` — composer obsolete
5. DELETE `scripts/templates/wrap-all-templates.ts` + `wrap-all-templates.sh` (if present) — anchor wrapper obsolete (anchors live in manifest templates directly)
6. DELETE `scripts/templates/README.md` + parent dir (composer obsolete; new docs in `templates/manifest/README.md`)
7. DELETE `scripts/tests/test-template-comprehensive.js` + `test-template-system.js` — obsolete `level_N/` tests
8. DELETE `scripts/tests/template-mustache-sections.vitest.ts` — mustache logic absorbed into `inline-gate-renderer.ts`; retarget `template-structure.vitest.ts` and `memory-template-contract.vitest.ts` to manifest-rendered output / parser-contract probes

#### Phase 4B: AI-facing prompt + workflow cleanup
**Goal**: update AI-facing instructions, command workflows, agents, and system-spec-kit references after legacy paths are gone.
**Sub-phase effort estimate**: ~3-4 hours
**Validation gate**: CHK-G4-06 and CHK-G4-12

**Steps:**

9. MODIFY `.opencode/agent/` (10 files per §2.5a): rename `CAPABILITY SCAN` heading → `ROUTING SCAN` across context.md, debug.md, deep-research.md, deep-review.md, improve-agent.md, improve-prompt.md, orchestrate.md, review.md, ultra-think.md, write.md. Plus deeper edits in improve-agent.md (`manifest` → `control file`/`run contract`) and orchestrate.md (`templates/level_N/` → resolver-based wording).

10. MODIFY `.opencode/command/spec_kit/` markdown (5 files per §2.5b): `deep-research.md` + `deep-review.md` rename `config.executor.kind` → `config.executor.type` and `Optimizer manifest` → `Optimizer configuration`; `resume.md` line 66 `child manifest` → `child list`; `plan.md` line 433 phase-parent paragraph → resolver-based; `complete.md` line 248 `templates/phase_parent/spec.md` → "phase-parent Level template contract".

11. MODIFY `.opencode/command/spec_kit/assets/` YAML workflows (12 files per §2.5c): refactor `executor.kind` → `executor.type` schema across deep-research/deep-review YAMLs; replace deleted-path references in plan/implement/complete YAMLs with Level contract resolver outputs; rename `child manifest` → `child list` in resume YAMLs; `Playbook vs Capability` → `Playbook vs Support` in deep-review YAMLs.

12. MODIFY `.opencode/skill/system-spec-kit/SKILL.md` per §2.5d (16 finding rows): replace "CORE + ADDENDUM template architecture (v2.2)" wording, remove deleted template-folder paths, replace banned vocabulary occurrences. KEEP Level 1/2/3/3+ taxonomy throughout.

13. MODIFY `.opencode/skill/system-spec-kit/README.md` per §2.5d (16 finding rows): heavy architecture rewrite — replace lines 498-539 entire CORE+ADDENDUM section with manifest-driven description. Banned vocabulary allowed here (maintainer-facing per ADR-005) but architecture must reflect new design.

14. MODIFY `.opencode/skill/system-spec-kit/references/` (18 files per §2.5e): heaviest in `references/templates/` (level_specifications.md, template_guide.md, level_selection_guide.md), `references/structure/folder_structure.md`, `references/validation/{template_compliance_contract,validation_rules}.md`, `references/workflows/{quick_reference,execution_methods}.md`. Remove references to deleted paths + composer + banned vocabulary. Keep Level vocabulary.

15. MODIFY `.opencode/skill/system-spec-kit/assets/` (4 files per §2.5f — ALL): `complexity_decision_matrix.md`, `level_decision_matrix.md`, `parallel_dispatch_config.md`, `template_mapping.md` (largest — full rewrite as Level-to-file contract map).

16. MODIFY `CLAUDE.md` §3 "Spec Folder Documentation": remove file-path refs to deleted dirs; KEEP Level 1/2/3/3+ vocabulary

17. MODIFY `AGENTS.md`: mirror CLAUDE.md edits

18. MODIFY `AGENTS_Barter.md` + `AGENTS_example_fs_enterprises.md` (if present): mirror per `feedback_agents_md_sync_triad.md`

#### Phase 4C: Catalog/playbook + final proof
**Goal**: finish the catalog/playbook cleanup, add the `capability-flags.ts` allowlist exemption, confirm stress-test NO-OP scope, and run final validation/rollback proof.
**Sub-phase effort estimate**: ~2-4 hours focused
**Validation gate**: CHK-G4-07 through CHK-G4-11

**Steps:**

19. ADD workflow-invariance allowlist entry for the literal `capability-flags.ts` source-path/symbol identifier per T-430a, complete audit-D catalog/playbook cleanup (30 MODIFY files), confirm stress-test NO-OP scope, and run final validation + rollback dry-run.

   **Heaviest catalog/playbook edits**:
   - `feature_catalog/16--tooling-and-scripts/30-template-composition-system.md` (full rewrite for C+F greenfield)
   - `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` (repoint root-template refs)
   - `feature_catalog/19--feature-flag-reference/{01-1-search-pipeline-features-speckit, 11-memory-roadmap-capability-flags}.md` (banned-vocab retitle; CI exemption may be needed if `capability-flags.ts` source path keeps name)
   - `manual_testing_playbook/16--tooling-and-scripts/244-template-composition-system.md` (full rewrite — replaces `compose.sh` validation with Level generation/invariance checks)
   - `manual_testing_playbook/19--feature-flag-reference/125-memory-roadmap-capability-flags.md` (parallel retitle)
   - Plus 13 mechanical wording cleanups in feature_catalog and 4 moderate edits in manual_testing_playbook

**GATE 4A:**
- [ ] `find templates/manifest/ -name '*.md.tmpl' | wc -l` returns 12
- [ ] `find templates/{level_1,level_2,level_3,level_3+,core,addendum,phase_parent} -type f` returns 0 results
- [ ] `find templates/ -maxdepth 1 -type f -name '*.md'` returns 0 results (root cross-cutting templates moved)
- [ ] `rg "templates/level_" .opencode/skill/system-spec-kit/scripts/ .opencode/skill/system-spec-kit/mcp_server/ .opencode/agent/ .opencode/command/spec_kit/` returns 0 hits outside historical fixtures + git log
- [ ] `rg "compose\.sh"` returns 0 hits outside historical fixtures + git log

**GATE 4B:**
- [ ] `rg "CAPABILITY SCAN"` returns 0 hits in `.opencode/agent/` (heading rename complete per audit §2.5a)
- [ ] `rg "config\.executor\.kind"` returns 0 hits in `.opencode/command/spec_kit/` (renamed to `executor.type` per audit §2.5b/c)
- [ ] `rg "CORE \+ ADDENDUM v2\.2"` returns 0 hits in `system-spec-kit/{SKILL.md, README.md, references/, assets/}` (architecture rewrite complete per audit §2.5d/e/f)
- [ ] `bash scripts/tests/workflow-invariance.vitest.ts` passes (no banned vocabulary in any of the 8 surface categories)

**GATE 4C:**
- [ ] `rg "compose\.sh"` returns 0 hits in `system-spec-kit/{feature_catalog/16--tooling-and-scripts/30-template-composition-system.md, manual_testing_playbook/16--tooling-and-scripts/244-template-composition-system.md}` (full rewrites complete per audit §2.5g)
- [ ] `rg -i "memory roadmap capability flags"` returns 0 hits in feature_catalog/19 + manual_testing_playbook/19 (retitled to "roadmap flags" per audit §2.5g)
- [ ] Stress-test surfaces remain byte-identical to pre-impl state (`templates/stress_test/` and `mcp_server/stress_test/`)
- [ ] `bash validate.sh --strict` passes against all 868 existing spec folders + 6 freshly-scaffolded sample packets
- [ ] Squash-merge to main verified; `git revert <squash-commit>` dry-run on worktree branch restores cleanly
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Phase |
|-----------|-------|-------|-------|
| Unit | `level-contract-resolver.ts` per-level contract output | vitest | 1 |
| Unit | `inline-gate-renderer.ts` EBNF grammar | vitest | 1 |
| Snapshot | Scaffold one packet per level (5) + minimum-viable spec — assert byte-equivalence to today's output (modulo intended cleanups) | vitest | 1 |
| Invariance | Grep public surfaces for banned vocabulary | vitest + shell grep | 1 (then runs every CI) |
| Integration | `create.sh --level N` end-to-end | bash + validate.sh | 2 |
| Regression | All 868 existing spec folders validate | bash loop + validate.sh --strict | 3 |
| Manual | Final smoke: scaffold 1 of each level, eyeball output | manual | 4C |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 002 design + ADRs | Internal | Done | Cannot start without converged design |
| `resource-map.md` (this packet) | Internal | Done | Authoritative file ledger; updated atomically with scope changes |
| Working `validate.sh --strict` against existing 868 packets | Internal | Available | Required for Phase 3 regression test |
| Working vitest harness | Internal | Available | Required for Phase 1 tests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any phase gate fails AND fix isn't trivial within session
- **Procedure**: Phases run serially on one integration branch. For atomic rollback, the FINAL merge to `main` is a single squash-merge of that integration branch. The squash commit on main is the single rollback point: `git revert <squash-commit-hash>`.
- **Recovery time**: <5 minutes (squash revert + push); no data migration
- **Rollback test**: before merging the integration branch to main, dry-run `git revert` in a worktree branch + run `validate.sh --strict` against all 868 spec folders to confirm clean restoration
<!-- /ANCHOR:rollback -->

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the active branch is `main`.
- Read `plan.md`, `tasks.md`, `resource-map.md`, the packet 002 ADRs, and the referenced research sections before editing.
- Confirm every edit is inside Phase 1 scope before applying it.
- Record verification evidence before marking any Gate 1 checklist item complete.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Complete T-101 through T-126 in Phase 1 order unless a task is independent and test-only. |
| TASK-SCOPE | Do not modify scaffolder, validator, AI-facing docs, commands, agents, feature catalog, playbook, or legacy templates in Phase 1. |
| TASK-VERIFY | Run all four Phase 1 vitest suites and both packet validation checks before completion. |
| TASK-RECOVER | On a failing gate, fix the failing file and rerun the Phase 1 verification sequence from the top. |

### Status Reporting Format
- Report created file count, modified file count, vitest status, validation status, and checklist status.
- Include exact failing command and first actionable error when blocked.
- Keep Phase 1 status separate from future Phase 2-4 work.

### Blocked Task Protocol
- `BLOCKED: <command or file> — <exact error> — <attempted fix>` when the same gate still fails after five correction loops.
- Stop before editing any file outside Phase 1 scope.
- Preserve the existing worktree and do not revert unrelated user changes.

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (ADD infra + CI test) ──► Phase 2 (MODIFY scaffolder) ──► Phase 3 (MODIFY validators) ──► Phase 4A (legacy removal) ──► Phase 4B (AI-facing cleanup) ──► Phase 4C (catalog/playbook + final proof)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 | Packet 002 design | 2 |
| 2 | 1 | 3 |
| 3 | 2 | 4A |
| 4A | 3 | 4B |
| 4B | 4A | 4C |
| 4C | 4B | None |

Strict serial execution is intentional for this packet: Phase 4 is review-chunk decomposition on the same integration branch, and no 4A/4B/4C chunk is independently mergeable.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 | High (12 template migrations + resolver + renderer EBNF + 4 vitests + fixture rewrites + leak cleanup) | 10-15 hours |
| Phase 2 | Med | 4-6 hours |
| Phase 3 | High (template-structure.js + spec-doc-structure.ts refactors + 868-folder regression) | 7-12 hours |
| Phase 4A | Med (57 deletions + remaining template-test retargeting) | 3-5 hours |
| Phase 4B | Med-High (AI-facing prompts, commands, references, assets) | 3-4 hours |
| Phase 4C | Med (catalog/playbook, allowlist, stress-test NO-OP, final proof) | 2-4 hours focused |
| **Total** | | **29-46 hours of focused engineering work** (Phase 4 revised twice: original 2-3h → 6-10h post-audit-A/B/C → 8-13h post-audit-D; audit-D added 30 catalog/playbook files) |

Add buffer for review iterations: 45-65 hours total wall-clock.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Snapshot tag of pre-impl state (`git tag pre-template-greenfield`)
- [ ] Workflow-invariance CI test green on a leak fixture (proves it works)
- [ ] Phase 4 deletion list audited via `rg` against latest source

### Rollback Procedure
1. `git revert <impl-commit-hash>` — restores all 57 deleted files + reverts 80 modifications + removes 21 additions
2. `git push origin main`
3. `bash validate.sh --strict --all-packets` — confirms recovery
4. No notification needed (internal tooling)

### Data Reversal
- **Has data migrations?** No — filesystem only
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────────────┐
│  Packet 002 design (ADRs 1-5)    │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│  Phase 1: ADD infra + CI test    │
│  + leak fixes + fixtures         │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│  Phase 2: Scaffolder             │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│  Phase 3: Validators             │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│  Phase 4A: Legacy removal        │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│  Phase 4B: AI-facing cleanup     │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│  Phase 4C: Catalog + final proof │
└──────────────────────────────────┘
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1** — 10-15 hours (CRITICAL; blocks everything)
2. **Phase 2** — 4-6 hours (CRITICAL; scaffolder must move before validator migration)
3. **Phase 3** — 7-12 hours (CRITICAL; `template-structure.js` is the riskiest single refactor; blocks Phase 4A)
4. **Phase 4A** — 3-5 hours (CRITICAL; deletion and test retargeting)
5. **Phase 4B** — 3-4 hours (CRITICAL; AI-facing cleanup)
6. **Phase 4C** — 2-4 hours focused (CRITICAL; catalog/playbook + final proof)

**Total Critical Path**: ~29-46 hours for strictly serial execution. Aligns with §L2 EFFORT total of 29-46h focused.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 PR opened | All 21 added files + 4 vitest cases compile and pass | Day 1 |
| M2 | Phase 2 complete | Scaffolder consumes resolver; Gate 2 green | Day 2 |
| M3 | Phase 3 complete | Validators consume resolver; Gate 3 green | Day 3 |
| M4 | Phase 4A/4B/4C complete | Deletions, AI-facing cleanup, catalog/playbook, and Gate 4A/4B/4C green | Day 4 |
| M5 | Single-commit rollback verified | `git revert` dry-run on worktree branch restores cleanly | Day 4 |
| M6 | Final squash-merge to main | All serial phases land via single squash commit (the rollback point) | Day 4-5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

This packet INHERITS ADR-001 through ADR-005 from packet 002. No new ADRs unless implementation surfaces unforeseen design questions. If a new question arises, add ADR-006+ to this packet's `decision-record.md` (not to packet 002's).
