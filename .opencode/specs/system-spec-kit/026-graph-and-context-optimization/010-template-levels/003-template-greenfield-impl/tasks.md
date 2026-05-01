---
title: "Tasks: Template Greenfield Implementation — 4 Phases, Gated"
description: "Task list mirroring plan.md phases 1-4. Each task references resource-map.md for affected file paths."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "012 tasks"
  - "template impl tasks"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl"
    last_updated_at: "2026-05-01T15:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 4 split into 4A/4B/4C"
    next_safe_action: "Begin T-101 (ADD spec-kit-docs.json manifest)"
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
# Tasks: Template Greenfield Implementation — 4 Phases, Gated

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` — file paths reference `resource-map.md` for full context
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
**(ADD private infrastructure + CI guardrail + leak fixes)**

**Goal**: purely additive. Nothing existing breaks. **Gate 1**: workflow-invariance test green; existing validate.sh still works.

- [ ] T-101 ADD `templates/manifest/spec-kit-docs.json` — concrete manifest from packet-011 iter-8 dry-run
- [ ] T-102 ADD `templates/manifest/spec.md.tmpl` (with inline `<!-- IF level:N -->` gates migrated from current core+addendum content)
- [ ] T-103 [P] ADD `templates/manifest/plan.md.tmpl`
- [ ] T-104 [P] ADD `templates/manifest/tasks.md.tmpl`
- [ ] T-105 [P] ADD `templates/manifest/implementation-summary.md.tmpl`
- [ ] T-106 [P] ADD `templates/manifest/checklist.md.tmpl` (capability-gated)
- [ ] T-107 [P] ADD `templates/manifest/decision-record.md.tmpl` (capability-gated)
- [ ] T-108 [P] ADD `templates/manifest/phase-parent.spec.md.tmpl` (lean trio)
- [ ] T-109 [P] ADD `templates/manifest/resource-map.md.tmpl` (optional author addon)
- [ ] T-110 [P] ADD `templates/manifest/context-index.md.tmpl` (optional author addon)
- [ ] T-111 [P] ADD `templates/manifest/handover.md.tmpl` (lazy command-owned)
- [ ] T-112 [P] ADD `templates/manifest/debug-delegation.md.tmpl` (lazy agent-owned)
- [ ] T-113 [P] ADD `templates/manifest/research.md.tmpl` (lazy workflow-owned)
- [ ] T-114 ADD `mcp_server/lib/templates/level-contract-resolver.ts` — full TS API per ADR-005
- [ ] T-115 ADD `scripts/templates/inline-gate-renderer.ts` — EBNF-driven gate stripper
- [ ] T-116 ADD `scripts/templates/inline-gate-renderer.sh` — shell wrapper
- [ ] T-117 ADD `scripts/lib/template-utils.sh::resolve_level_contract` (NEW function)
- [ ] T-117a ADD `templates/manifest/README.md` — internal maintainer docs explaining the manifest design (NOT user-facing; allowlisted by workflow-invariance test)
- [ ] T-118 ADD `scripts/tests/workflow-invariance.vitest.ts` — CI guardrail per ADR-005 + packet 002 §18.8 binding scope **+ audit-D extension**: 8 surface categories — (a) live script outputs, (b) generated fixture snapshots, (c) template sources, (d) command docs + YAML assets, (e) agent prompts, (f) skill/root policy docs, **(g) feature_catalog/**, **(h) manual_testing_playbook/**. Banned regex `\b(preset|capabilit(y|ies)|\bkind\b|manifest)\b` case-insensitive. Allowlist: historical research references + maintainer-facing `templates/manifest/README.md` + source-path symbol identifiers (e.g., `capability-flags.ts`).
- [ ] T-119 [P] ADD `scripts/tests/level-contract-resolver.vitest.ts`
- [ ] T-120 [P] ADD `scripts/tests/inline-gate-renderer.vitest.ts`
- [ ] T-121 [P] ADD `scripts/tests/scaffold-golden-snapshots.vitest.ts` (6 cases)
- [ ] T-122 FIX leak (per packet 002 §18.8): replace `[capability]` with `[needed behavior]` in user-story syntax + addendum frontmatter title/description + keyword `"capability"` → `"needed behavior"` (applied to NEW manifest templates)
- [ ] T-123 FIX leak (per packet 002 §18.8): replace phase-parent wording with `Sub-phase list: which child phase folders exist and what each one does`
- [ ] T-124 [P] REWRITE `scripts/tests/fixtures/phase-detection/phase-blocked-by-level/` for new manifest output
- [ ] T-125 [P] REWRITE `scripts/tests/fixtures/phase-validation/mixed-levels/` for new manifest output
- [ ] T-126 GATE 1: verify (a) all new files exist, (b) all 4 new vitest cases pass, (c) workflow-invariance test fails on a deliberately-injected leak fixture, (d) existing `validate.sh --strict` against any current packet has same exit code as before
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
**(MODIFY scaffolder)**

**Goal**: switch `create.sh` to consume resolver. Public `--level N` flag stays exactly as today. **Gate 2**: scaffold-comparison test passes for all 5 levels.

- [ ] T-201 MODIFY `scripts/spec/create.sh` lines ~538-661: replace level→files matrix with `resolve_level_contract <level>` call (~30-line diff)
- [ ] T-202 MODIFY `scripts/spec/create.sh` `--help` text: drop any `--preset` references (per ADR-005)
- [ ] T-203 MODIFY `scripts/lib/template-utils.sh::copy_template`: replace direct `cp` from `level_N/` with resolver-driven copy + inline-gate stripping
- [ ] T-204 MODIFY `scripts/spec/scaffold-debug-delegation.sh`: switch source to `templates/manifest/debug-delegation.md.tmpl`
- [ ] T-205 [P] AUDIT `scripts/spec/recommend-level.sh`: verify level vocabulary preserved (likely no edit)
- [ ] T-206 [P] AUDIT `scripts/spec/upgrade-level.sh`: verify; small refactor if it reads template paths directly
- [ ] T-207 GATE 2: scaffold-comparison test (old vs new) for all 5 levels (1/2/3/3+/phase-parent); only INTENDED diffs (absence of stale stubs) appear
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
**(MODIFY validators)**

**Goal**: switch validators to consume resolver. Error messages stay level-only (per ADR-005). **Gate 3**: zero validator regressions against 868 existing packets.

- [ ] T-301 MODIFY `scripts/rules/check-files.sh`: replace level→required-files matrix with `resolve_level_contract` call (~20-line diff). Error messages stay level-only.
- [ ] T-302 [P] MODIFY `scripts/rules/check-sections.sh`: read section gates from resolver; render gates before assertions
- [ ] T-303 [P] MODIFY `scripts/rules/check-template-headers.sh`: read header expectations from resolver
- [ ] T-304 [P] MODIFY `scripts/rules/check-section-counts.sh`: read count thresholds from resolver
- [ ] T-305 [P] AUDIT `scripts/rules/check-level.sh`: verify level vocabulary preserved
- [ ] T-306 [P] AUDIT `scripts/rules/check-level-match.sh`: verify
- [ ] T-307 AUDIT `scripts/rules/check-template-source.sh`: decide simplify-or-remove given markers become descriptive
- [ ] T-308 MODIFY `scripts/spec/check-template-staleness.sh`: compare against manifest-rendered output via resolver
- [ ] T-309 MODIFY `scripts/utils/template-structure.js`: read manifest-rendered output via resolver (largest single-file refactor)
- [ ] T-310 MODIFY `mcp_server/lib/validation/spec-doc-structure.ts`: consume resolver via `level-contract-resolver.ts`
- [ ] T-311 GATE 3: `validate.sh --strict` against all 868 existing spec folders shows zero new errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
**(Phase 4: DELETE legacy + UPDATE docs)**

**Goal**: remove obsolete dirs + composer + tests. Update doc references. **Gate 4A/4B/4C (final)**: complete blast radius from `resource-map.md` §3 and §2.5 verified.

### Phase 4A — Legacy removal (T-401 to T-415)

- [ ] T-401 DELETE `templates/level_1/` (5 .md files)
- [ ] T-402 [P] DELETE `templates/level_2/` (6 .md files)
- [ ] T-403 [P] DELETE `templates/level_3/` (7 .md files)
- [ ] T-404 [P] DELETE `templates/level_3+/` (7 .md files)
- [ ] T-405 [P] DELETE `templates/core/` (5 .md files)
- [ ] T-406 [P] DELETE `templates/addendum/` (17 .md files across 4 subdirs)
- [ ] T-407 [P] DELETE `templates/phase_parent/` (1 .md file)
- [ ] T-408 DELETE `scripts/templates/compose.sh`
- [ ] T-409 [P] DELETE `scripts/templates/wrap-all-templates.ts` + `wrap-all-templates.sh` (if present)
- [ ] T-410 [P] DELETE `scripts/tests/test-template-comprehensive.js`
- [ ] T-411 [P] DELETE `scripts/tests/test-template-system.js`
- [ ] T-412 DELETE `scripts/templates/README.md` AND its parent `scripts/templates/` dir (composer obsolete; folder empty after compose.sh + wrap-all-templates deletion). New maintainer-facing docs live in `templates/manifest/README.md` (created Phase 1 T-117a).
- [ ] T-413 DELETE `scripts/tests/template-mustache-sections.vitest.ts` (mustache-section logic absorbed into `inline-gate-renderer.ts` per Phase 1 T-115; per-section gating tests now live in `inline-gate-renderer.vitest.ts`)
- [ ] T-414 MODIFY `scripts/tests/template-structure.vitest.ts`: refactor to test manifest output
- [ ] T-415 MODIFY `scripts/tests/memory-template-contract.vitest.ts`: verify parser-contract probe still passes

### Phase 4B — AI-facing cleanup (T-416 to T-429)

- [ ] T-416 MODIFY `.opencode/skill/system-spec-kit/SKILL.md`: remove file-path references; KEEP level vocabulary
- [ ] T-417 [P] MODIFY `CLAUDE.md`: remove file-path references; KEEP Level 1/2/3/3+ vocabulary
- [ ] T-418 [P] MODIFY `AGENTS.md`: mirror CLAUDE.md edits
- [ ] T-419 [P] MODIFY `AGENTS_Barter.md` + `AGENTS_example_fs_enterprises.md`: mirror per `feedback_agents_md_sync_triad.md`

Audit-surfaced cleanup (per resource-map §2.5):

- [ ] T-421 [P] MODIFY 10 `.opencode/agent/*.md` files: rename `CAPABILITY SCAN` → `ROUTING SCAN` heading (per §2.5a)
- [ ] T-422 MODIFY `.opencode/agent/improve-agent.md` deeper edits: replace 11 `manifest` occurrences with `control file` / `run contract` / `approved scope` (lines 36/52/60/62/76/98/108/122/124/189/234)
- [ ] T-423 MODIFY `.opencode/agent/orchestrate.md` deeper edits: replace `templates/level_N/` references with resolver wording (lines 337/357/377/389)
- [ ] T-424 [P] MODIFY 5 `.opencode/command/spec_kit/*.md` files: rename `config.executor.kind` → `config.executor.type` in deep-research.md + deep-review.md; `Optimizer manifest` → `Optimizer configuration`; `child manifest` → `child list` in resume.md; replace deleted-path refs in plan.md + complete.md (per §2.5b)
- [ ] T-425 MODIFY 12 `.opencode/command/spec_kit/assets/*.yaml` files: refactor `executor.kind`→`type` schema in deep-research/deep-review YAMLs (10+ occurrences each); replace deleted-path refs in plan/implement/complete YAMLs; rename `child manifest` → `child list` in resume YAMLs (per §2.5c)
- [ ] T-426 MODIFY `system-spec-kit/SKILL.md` per §2.5d: 16 finding rows — drop "CORE+ADDENDUM v2.2" wording, deleted paths, banned vocabulary; preserve Level vocabulary throughout
- [ ] T-427 MODIFY `system-spec-kit/README.md` per §2.5d: 16 finding rows — heavy architecture rewrite at lines 498-539 (entire CORE+ADDENDUM section → manifest-driven description)
- [ ] T-428 MODIFY 18 `system-spec-kit/references/*.md` files per §2.5e (heaviest in `templates/`, `structure/`, `validation/`, `workflows/` subdirs)
- [ ] T-429 [P] MODIFY 4 `system-spec-kit/assets/*.md` files per §2.5f: complexity_decision_matrix.md, level_decision_matrix.md, parallel_dispatch_config.md, template_mapping.md (last is largest — full rewrite as Level-to-file contract map)

### Phase 4C — Catalog/playbook + final proof (T-430a to T-435)

- [ ] T-430a DECISION — `capability-flags.ts` source-path: ADD allowlist entry to `workflow-invariance.vitest.ts` allowing the literal symbol/path `capability-flags` in source-code identifiers (TS file names + import statements only). Rationale: renaming the source file is a separate refactor with broader callers (per ADR-005 maintainer-facing exemption). Doc references in `feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` (line 80-83/137) still get prose cleanup per T-431.
- [ ] T-431 MODIFY `system-spec-kit/feature_catalog/` per §2.5g — **22 MODIFY files**:
  - HEAVY: `feature_catalog.md` master (10 line ranges), `16--tooling-and-scripts/30-template-composition-system.md` (full rewrite for greenfield), `22--context-preservation-and-code-graph/25-resource-map-template.md` (repoint root-template ref)
  - MODERATE: `19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` + `11-memory-roadmap-capability-flags.md` (banned-vocab retitle), `14--pipeline-architecture/22-mcp-server-public-api-barrel.md`, `16--tooling-and-scripts/{37-cli-matrix-adapter-runners, 36-copilot-target-authority-helper}.md`, `05--lifecycle/01-checkpoint-creation-checkpointcreate.md`
  - MECHANICAL (banned-word only): 13 files in 01--retrieval, 02--mutation, 09, 11, 14, 16, 17, 18, 21, 22 subdirs
- [ ] T-432 MODIFY `system-spec-kit/manual_testing_playbook/` per §2.5g — **8 MODIFY files**:
  - HEAVY: `manual_testing_playbook.md` master (3 line refs + 1 stale link), `16--tooling-and-scripts/244-template-composition-system.md` (full rewrite — replaces `compose.sh`/composer-drift validation with Level generation/invariance checks against new flow), `22--context-preservation-and-code-graph/270-resource-map-template.md`, `19--feature-flag-reference/125-memory-roadmap-capability-flags.md`
  - MODERATE: `14--stress-testing/01-run-stress-cycle.md` (line 129 "phase manifest" → "phase map"), `16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` (lines 96/105), `22--context-preservation-and-code-graph/250-session-start-startup.md` (lines 20/23/63/72 `kind=startup` wording), `02--mutation/192-correction-tracking-with-undo.md` (line 44)
- [ ] T-433 (NO-OP per audit-D) `templates/stress_test/` — all 4 files (README, findings-rubric.schema, findings-rubric.template.json, findings.template.md) confirmed UNTOUCHED by audit-D. No edits needed.
- [ ] T-434 (NO-OP per audit-D) `mcp_server/stress_test/` — all 6 scenario subdirs + README confirmed UNTOUCHED. `kind` hits are internal TS fixture object fields, not user/AI-facing docs.

- [ ] T-435 GATE 4 (FINAL — supersedes the original T-420 GATE 4): all checklist items in plan.md §4 Gate 4A/4B/4C green; `rg "CAPABILITY SCAN"` returns 0 hits in `agent/`; `rg "config\.executor\.kind"` returns 0 hits in `command/spec_kit/`; `rg "CORE \+ ADDENDUM v2\.2"` returns 0 hits in `system-spec-kit/{SKILL.md, README.md, references/, assets/}`; `rg "compose\.sh"` returns 0 hits in catalog/playbook composer docs; `rg -i "memory roadmap capability flags"` returns 0 hits in feature_catalog/19 + manual_testing_playbook/19; T-430a allowlist entry present in workflow-invariance test; `git revert` dry-run on worktree branch restores cleanly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan (phase-by-phase steps)**: See `plan.md`
- **Resource Map (file-by-file ledger)**: See `resource-map.md` ← authoritative
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source design**: `../002-template-greenfield-redesign/research/research.md`
- **ADRs (inherited)**: `../002-template-greenfield-redesign/decision-record.md`
<!-- /ANCHOR:cross-refs -->
