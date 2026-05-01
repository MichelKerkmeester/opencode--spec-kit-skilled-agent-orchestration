---
title: "Resource Map: Template Greenfield Implementation — All Affected system-spec-kit Files"
description: "Comprehensive blast-radius inventory for the C+F hybrid manifest-driven greenfield implementation per packet 002's recommendation. Lists every file in .opencode/skill/system-spec-kit/ that gets ADDED, MODIFIED, DELETED, or LEFT UNTOUCHED across the 4 implementation phases."
template_source: "SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1"
trigger_phrases:
  - "012 resource map"
  - "template greenfield blast radius"
  - "system-spec-kit affected files"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl"
    last_updated_at: "2026-05-01T15:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 4 split into 4A/4B/4C"
    next_safe_action: "Phase 1 implementation reads §1 for ADD list"
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
# Resource Map: Template Greenfield Implementation

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total file references**: ~180
- **By action**: Created=21, Modified=**80** (18 original + 32 from audits A/B/C in §2.5a-f + 30 from audit D in §2.5g: 22 feature_catalog + 8 manual_testing_playbook + 0 stress_test), Deleted=57, Cited=27, Untouched=many (16 validators enumerated; 14 references untouched; ALL stress_test files untouched; 659 catalog/playbook files untouched per audit-D)
- **By category**: Templates=49, Scripts=18, MCP Server=4, Tests=13, Docs=6, Manifests/Config=3, **Agents=10**, **Commands=17 (5 markdown + 12 YAML)**, **Skill docs=2 (SKILL.md + README.md)**, **References=18**, **Assets=4**, **Feature catalog=22**, **Manual testing playbook=8**, **Stress test=0** (all clean)
- **Scope**: every file under `.opencode/skill/system-spec-kit/` AND `.opencode/agent/` AND `.opencode/command/spec_kit/` that the 4-phase implementation touches OR that an auditor needs to verify is intentionally left alone
- **Generated**: 2026-05-01 (revised post review-fix-pass + 4 audit syntheses A/B/C/D)

> **Action vocabulary**: `Created` (new file) · `Modified` (existing file edited) · `Deleted` (removed) · `Cited` (referenced by spec docs but not edited) · `Untouched` (intentionally not edited despite being adjacent)
> **Status vocabulary**: `OK` (exists today) · `PLANNED` (will be created by this packet) · `WILL_DELETE` (planned removal in Phase 4)
<!-- /ANCHOR:summary -->

---

## §1. ADDED FILES (Phase 1) — 21 new files (incl. internal manifest README)

### Manifest + private templates (the new source of truth)

| Path | Action | Status | Phase | Purpose |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json` | Created | PLANNED | 1 | The PRIVATE manifest. Declares kinds, capabilities, presets, per-doc-template ownership, section profiles. Drives both scaffolder + validator. NEVER AI-readable per ADR-005. |
| `.opencode/skill/system-spec-kit/templates/manifest/spec.md.tmpl` | Created | PLANNED | 1 | Author core template — full markdown with `<!-- IF level:N -->` inline gates for level-variant sections |
| `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl` | Created | PLANNED | 1 | Author core template — implementation plan |
| `.opencode/skill/system-spec-kit/templates/manifest/tasks.md.tmpl` | Created | PLANNED | 1 | Author core template — task list |
| `.opencode/skill/system-spec-kit/templates/manifest/implementation-summary.md.tmpl` | Created | PLANNED | 1 | Author core template — post-implementation summary with `_memory.continuity` block |
| `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl` | Created | PLANNED | 1 | Capability-gated template — appears for Level 2+ packets |
| `.opencode/skill/system-spec-kit/templates/manifest/decision-record.md.tmpl` | Created | PLANNED | 1 | Capability-gated template — appears for Level 3+ packets |
| `.opencode/skill/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl` | Created | PLANNED | 1 | Lean phase-parent template (replaces today's `phase_parent/spec.md`) |
| `.opencode/skill/system-spec-kit/templates/manifest/README.md` | Created | PLANNED | 1 | Internal maintainer-facing docs explaining the manifest design (created Phase 1 per T-117a; allowlisted by workflow-invariance test as maintainer-facing). NOT user/AI-facing. |
| `.opencode/skill/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Created | PLANNED | 1 | Optional author addon |
| `.opencode/skill/system-spec-kit/templates/manifest/context-index.md.tmpl` | Created | PLANNED | 1 | Optional author addon (rare migration bridge) |
| `.opencode/skill/system-spec-kit/templates/manifest/handover.md.tmpl` | Created | PLANNED | 1 | Lazy template — used by `/memory:save` content-router on first write |
| `.opencode/skill/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` | Created | PLANNED | 1 | Lazy template — used by `@debug` agent + `scaffold-debug-delegation.sh` |
| `.opencode/skill/system-spec-kit/templates/manifest/research.md.tmpl` | Created | PLANNED | 1 | Lazy template — used by `/spec_kit:deep-research` (lives in `research/` subdir at scaffold time) |

### New runtime code (resolver + renderer + shell wrapper)

| Path | Action | Status | Phase | Purpose |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts` | Created | PLANNED | 1 | TS API: `resolveLevelContract(level: '1'\|'2'\|'3'\|'3+'\|'phase'): LevelContract`. Returns required core docs, capability-gated docs, lazy addon docs, section gates, frontmatter marker level. NEVER exposes preset/capability/kind names to callers. |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts` | Created | PLANNED | 1 | EBNF-driven gate stripper. Strips `<!-- IF level:N -->...<!-- /IF -->` blocks at scaffold time. Handles `IF`/`IF NOT`/`AND`/nested gates per iter-6 grammar. |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` (NEW FUNCTION `resolve_level_contract`) | Modified | OK | 1 | Add new function `resolve_level_contract <level>` that sources compiled JS resolver and returns JSON via stdout. Existing functions (`copy_template`, etc.) stay until Phase 2. |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh` | Created | PLANNED | 1 | Shell wrapper around the TS renderer for use inside `create.sh` |

### CI tests (workflow-invariance + golden snapshots)

| Path | Action | Status | Phase | Purpose |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts` | Created | PLANNED | 1 | **Per ADR-005**: greps every public surface (CLI help, log lines, validator messages, generated doc content, AI-facing markdown) for banned vocabulary `\b(preset\|capabilit(y\|ies)\|\bkind\b\|manifest)\b`. Fails build on leak. Allowlist: developer/maintainer docs only. |
| `.opencode/skill/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts` | Created | PLANNED | 1 | Unit tests for resolver. Covers 5 levels (1/2/3/3+/phase) × required-docs check + section-gate check + lazy-doc-list check. |
| `.opencode/skill/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts` | Created | PLANNED | 1 | EBNF grammar tests per iter-6 spec. Covers IF, IF NOT, AND, nested gates, mid-section gates, malformed input. |
| `.opencode/skill/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` | Created | PLANNED | 1 | 6 snapshots: scaffold one packet per level (1/2/3/3+/phase) + minimum-viable spec. Asserts byte-equivalence (modulo timestamps + ADR-002/003 cleanups) against today's scaffolder output. |

---

## §2. MODIFIED FILES (Phases 2-3) — 18 existing files edited

### Scaffolder (Phase 2)

| Path | Action | Status | Phase | Edit summary |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modified | OK | 2 | Lines ~538-661: replace level→files matrix with `resolve_level_contract <level>` call. Drop any `--preset` references from `--help`. Log lines stay level-only ("scaffolding Level 3 spec folder"). ~30-line diff. |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` (`copy_template` rewrite) | Modified | OK | 2 | Replace direct `cp` from `level_N/` with resolver-driven copy. Pipe each copied template through `inline-gate-renderer.sh` to strip ungated sections. |
| `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Modified | OK | 2 | Switch from copying `templates/debug-delegation.md` to using `templates/manifest/debug-delegation.md.tmpl` via resolver. Behavior + log output unchanged. |
| `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | Modified | OK | 2 | Verify level vocabulary preserved (just an audit; likely no functional change). |
| `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` | Modified | OK | 2 | Same — audit + verify level vocabulary; may need small refactor if it reads template paths directly. |

### Validators (Phase 3)

| Path | Action | Status | Phase | Edit summary |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | Modified | OK | 3 | Replace level→required-files matrix with `resolve_level_contract <level>` call. Error messages stay level-only ("Level 3 packet missing required file: decision-record.md"). ~20-line diff. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` | Modified | OK | 3 | Read section gates from resolver. Render gates before assertion. Stay level-only in error output. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` | Modified | OK | 3 | Read header expectations from resolver. Today depends on `template-structure.js` — keep that dependency, just retarget at manifest-rendered output. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` | Modified | OK | 3 | Read count thresholds per level from resolver. Stay level-only in error output. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-level.sh` | Modified | OK | 3 | Verify level marker in frontmatter. May need no edit; audit during Phase 3. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh` | Modified | OK | 3 | Verify level consistency across spec docs. Audit + verify level vocabulary. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh` | Modified | OK | 3 | Today checks `<!-- SPECKIT_TEMPLATE_SOURCE -->` marker. New design may simplify or remove this check (markers become descriptive). Audit + decide in Phase 3. |
| `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh` | Modified | OK | 3 | Today compares spec-folder docs against `templates/level_N/`. New design: compare against manifest-rendered output. Refactor needed. |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` | Modified | OK | 3 | Today reads `templates/level_N/` for header/anchor contracts. New: read manifest-rendered output via resolver. Largest single-file refactor. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Modified | OK | 3 | Today encodes level structure for validation. New: consume resolver via `level-contract-resolver.ts`. |

### Documentation (Phases 3-4)

| Path | Action | Status | Phase | Edit summary |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/SKILL.md` | Modified | OK | 4 | Update template-system architecture section: remove references to deleted `level_N/`, `addendum/`, `phase_parent/` directories. Keep level taxonomy vocabulary. |
| `CLAUDE.md` | Modified | OK | 4 | §3 "Spec Folder Documentation" — keep Level 1/2/3/3+ vocabulary; remove file-path references to deleted dirs. Section "CORE + ADDENDUM template architecture (v2.2)" reference updated to "manifest-driven (v3.0)" or similar internal note. |
| `AGENTS.md` | Modified | OK | 4 | Mirror CLAUDE.md edits. Per `feedback_agents_md_sync_triad.md`, also sync `AGENTS_Barter.md` and `AGENTS_example_fs_enterprises.md` if present. |

---

## §2.5. ADDITIONAL MODIFICATIONS (post-audit) — 32 files surfaced by parallel cli-codex audit (A/B/C)

**Audit context**: 3 parallel cli-codex / gpt-5.5 / high / fast agents audited every file under `.opencode/agent/`, `.opencode/command/spec_kit/`, `system-spec-kit/SKILL.md`, `README.md`, `references/`, `assets/` for impact under ADR-005 + manifest design. Full audit responses live in `review/audit-{A,B,C}-response.md`.

### §2.5a — `.opencode/agent/` (10 MODIFY)

All AI-facing agent definitions. Most need a single heading rename (`CAPABILITY SCAN` → `ROUTING SCAN`); some have deeper edits.

| Path | Specific edits |
|---|---|
| `.opencode/agent/context.md` | Line 59 heading rename |
| `.opencode/agent/debug.md` | Line 57 heading rename |
| `.opencode/agent/deep-research.md` | Line 220 heading rename |
| `.opencode/agent/deep-review.md` | Line 241 heading rename |
| `.opencode/agent/improve-agent.md` | Line 46 heading rename + lines 36/52/60/62/76/98/108/122/124/189/234 replace `manifest` with `control file` / `run contract` / `approved scope` |
| `.opencode/agent/improve-prompt.md` | Line 46 heading rename |
| `.opencode/agent/orchestrate.md` | Line 87 heading rename + lines 337/357/377/389 replace `templates/level_N/` and `templates/level_3/spec.md` with resolver-based "Level template source resolved by the system-spec-kit template resolver" |
| `.opencode/agent/review.md` | Line 70 heading rename |
| `.opencode/agent/ultra-think.md` | Line 64 heading rename |
| `.opencode/agent/write.md` | Lines 159 + 167 heading rename |

### §2.5b — `.opencode/command/spec_kit/` markdown (5 MODIFY)

| Path | Specific edits |
|---|---|
| `.opencode/command/spec_kit/deep-research.md` | Lines 68/74/81/139 rename `config.executor.kind` → `config.executor.type`; line 336 `Optimizer manifest` → `Optimizer configuration` |
| `.opencode/command/spec_kit/deep-review.md` | Lines 66/72/79/151 same; line 386 `Optimizer manifest` → `Optimizer configuration` |
| `.opencode/command/spec_kit/resume.md` | Line 66 `child manifest` → `child list` |
| `.opencode/command/spec_kit/plan.md` | Line 433 replace lean-parent paragraph with resolver-based phrasing |
| `.opencode/command/spec_kit/complete.md` | Line 248 replace `templates/phase_parent/spec.md` with "phase-parent Level template contract" |

### §2.5c — `.opencode/command/spec_kit/assets/` YAML workflows (12 MODIFY)

These are the workflow definitions the AI runtime executes step-by-step. Heavy refactoring: deleted-path references + `executor.kind` schema rename.

| Path | Edit summary |
|---|---|
| `assets/spec_kit_resume_auto.yaml` + `_confirm.yaml` | `child manifest`/`listing` → `child list` |
| `assets/spec_kit_plan_auto.yaml` + `_confirm.yaml` | Replace explicit deleted paths with Level contract resolver outputs (12+ lines each) |
| `assets/spec_kit_implement_auto.yaml` + `_confirm.yaml` | Deleted phase-parent + level/root template path refs |
| `assets/spec_kit_complete_auto.yaml` + `_confirm.yaml` | Deleted addendum + level + root template paths (15+ lines each) |
| `assets/spec_kit_deep-research_auto.yaml` + `_confirm.yaml` | Rename executor `kind` → `type` (10+ occurrences each) |
| `assets/spec_kit_deep-review_auto.yaml` + `_confirm.yaml` | Same `kind` rename + `Playbook vs Capability` → `Playbook vs Support` |

### §2.5d — `system-spec-kit/SKILL.md` + `README.md` (2 MODIFY)

| Path | Lines | Theme |
|---|---|---|
| `SKILL.md` | 3, 61, 63, 65, 85, 95, 96, 108, 358-362, 364, 377, 688, 693-694, 829, 979 | AI-facing — drop "CORE+ADDENDUM v2.2" wording, deleted template-folder paths, banned vocabulary; preserve Level vocabulary throughout |
| `README.md` | 3, 72, 93, 267, 326, 498-539 (entire architecture section), 545-548, 610, 625-628, 629-632, 636, 671, 808, 1083, 1111 | Maintainer-facing — banned terms allowed but heavy architecture rewrite needed: replace "CORE + ADDENDUM v2.2" with manifest-driven description; remove deleted file paths + composer references |

### §2.5e — `system-spec-kit/references/` (18 MODIFY, 14 UNTOUCHED)

**Most-impacted (heavy edits):**
- `references/templates/level_specifications.md` — lines 3, 8, 14-45, 90-93, 142-151, 225-234, 335-345, 470-480, 565-567, 738-741, 807-827
- `references/templates/template_guide.md` — lines 48-70, 84-87, 135, 174, 214-223, 339, 437, 464, 492, 773, 1083, 1135-1155
- `references/templates/level_selection_guide.md` — lines 107, 124-128, 200-213
- `references/structure/folder_structure.md` — lines 14-36
- `references/validation/template_compliance_contract.md` — lines 223, 225, 231, 268
- `references/validation/validation_rules.md` — lines 139, 155, 172, 178, 673, 784, 838
- `references/workflows/quick_reference.md` — lines 41, 56-91, 143-153, 190, 489, 692-724
- `references/workflows/execution_methods.md` — lines 3, 8, 14, 156-184

**Smaller edits (banned vocab or single-path replacement):** `intake-contract.md`, `structure/phase_definitions.md`, `validation/{decision_format,five_checks,phase_checklists}.md`, `config/{environment_variables,hook_system}.md`, `hooks/skill-advisor-hook.md`, `memory/{embedding_resilience,epistemic_vectors,memory_system,save_workflow}.md`

**UNTOUCHED (14 files)**: `cli/memory_handback.md`, `cli/shared_smart_router.md`, `debugging/{troubleshooting,universal_debugging_methodology}.md`, `hooks/skill-advisor-hook-validation.md`, `memory/trigger_config.md`, `structure/{folder_routing,phase_system,sub_folder_versioning}.md`, `templates/template_style_guide.md`, `validation/path_scoped_rules.md`, `workflows/{nested_changelog,rollback_runbook,worked_examples}.md`

### §2.5f — `system-spec-kit/assets/` (4 MODIFY — all)

| Path | Edit |
|---|---|
| `assets/complexity_decision_matrix.md` (lines 157, 238) | Replace `templates/level_N` + `compose.sh` refs with Level selection output |
| `assets/level_decision_matrix.md` (lines 131, 338) | Same |
| `assets/parallel_dispatch_config.md` (line 156) | Remove `compose.sh` link |
| `assets/template_mapping.md` (lines 48-71, 100-105, 111-145, 357-389, 430-461) | Rewrite as Level-to-file contract map; remove deleted-folder/composer/`phase_parent` refs + banned `manifest` |

### §2.5g — `system-spec-kit/feature_catalog/` + `manual_testing_playbook/` + `stress_test/` (30 MODIFY, 0 DELETE)

**Audit context**: 4th cli-codex audit covered AI-readable catalog/playbook surfaces and stress-test rubric/scenario fixtures.

**Headline result**: stress_test surfaces (`templates/stress_test/` 4 files + `mcp_server/stress_test/` 6 subdirs) are **ALL UNTOUCHED** — no deleted-path or banned-vocabulary leaks. `kind` hits in mcp_server/stress_test/ are internal TS fixture object fields, not user/AI-facing docs.

#### feature_catalog (22 MODIFY)

**Heaviest edits (architecture/path content):**
- `feature_catalog/feature_catalog.md` (master) — lines 42, 141, 255, 1469, 1873, 2995, 3298, 3899, 4160, 4446-4449. Replace banned vocab with `feature area`, `retrieval defaults`, `planned feature`, `roadmap flags`, `type`, `Level`.
- `feature_catalog/16--tooling-and-scripts/30-template-composition-system.md` — lines 19, 25, 29-31, 41 describe obsolete composer/build-time composition. Full rewrite around C+F greenfield generation.
- `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` — lines 10, 18, 28 reference root `templates/resource-map.md` + `templates/level_*`. Repoint at generated Level packet output.
- `feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` — lines 80-83, 137 expose `capability-flags.ts`. Rename to roadmap flag/default resolvers; CI exemption may be needed if source path keeps name.
- `feature_catalog/19--feature-flag-reference/11-memory-roadmap-capability-flags.md` — lines 2/3/6/8/14/24-29/42 leak capability vocab throughout. Retitle to "Memory roadmap flags".
- `feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md` — lines 20/34/56/63-64.
- `feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` — lines 3/32/45/47.
- `feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md` — lines 18-19/23-25/27/29/33 expose `kind` contract.
- `feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md` — line 18.

**Mechanical wording cleanup (banned-word-only hits):**
- `feature_catalog/01--retrieval/{07-ast-level-section-retrieval-tool, 12-search-api-surface}.md`
- `feature_catalog/02--mutation/09-correction-tracking-with-undo.md`
- `feature_catalog/09--evaluation-and-measurement/17-memory-roadmap-baseline-snapshot.md`
- `feature_catalog/11--scoring-and-calibration/{04-classification-based-decay, 24-skill-advisor-affordance-evidence}.md`
- `feature_catalog/14--pipeline-architecture/{04-template-anchor-optimization, 20-7-layer-tool-architecture-metadata}.md`
- `feature_catalog/16--tooling-and-scripts/{09-migration-checkpoint-scripts, 12-session-capturing-pipeline-quality, 25-memory-maintenance-and-migration-clis}.md`
- `feature_catalog/17--governance/01-feature-flag-governance.md`
- `feature_catalog/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md`
- `feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md`
- `feature_catalog/22--context-preservation-and-code-graph/06-runtime-detection.md`

#### manual_testing_playbook (8 MODIFY)

| Path | Lines | Theme |
|---|---|---|
| `manual_testing_playbook/manual_testing_playbook.md` (master) | 2458, 2471, 3727 | Capability wording + 1 stale `125-hydra...` link |
| `manual_testing_playbook/16--tooling-and-scripts/244-template-composition-system.md` | 18-19, 23, 32, 37-40, 48, 52, 57 | Validates `compose.sh` + composer drift + generated `templates/level_*`. Replace with Level generation/invariance checks against new flow. |
| `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | 18-20, 22, 38 | Repoint at Level packet resource-map output, not deleted root template |
| `manual_testing_playbook/19--feature-flag-reference/125-memory-roadmap-capability-flags.md` | 2-5, 8, 10, 16, 56-59, 76, 80, 87, 93, 103 | Retitle to roadmap flags |
| `manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md` | 129 | "phase manifest" → "phase map" |
| `manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` | 96, 105 | "manifest" → "matrix definition applicability rule/file" |
| `manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md` | 20, 23, 63, 72 | `kind=startup` → "startup payload type/status" (unless transport field renamed) |
| `manual_testing_playbook/02--mutation/192-correction-tracking-with-undo.md` | 44 | "library capability" → "library behavior/API" |

#### stress_test (0 MODIFY)

| Path | Action | Reason |
|---|---|---|
| `templates/stress_test/{README.md, findings.template.md, findings-rubric.schema.md, findings-rubric.template.json}` | UNTOUCHED | No deleted Level template paths or banned C+F vocab |
| `mcp_server/stress_test/README.md` | UNTOUCHED | Public README is clean |
| `mcp_server/stress_test/{code-graph, matrix, memory, search-quality, session, skill-advisor}/` | UNTOUCHED | `kind` hits are internal TS fixture object fields, not user/AI-facing |

#### §2.5g audit-trail provenance

Full per-finding detail with replacement guidance lives in `review/audit-D-response.md`.

### §2.5 audit-trail provenance (all 4 audits)

Full per-finding detail with replacement guidance lives in:
- `review/audit-A-response.md` — agent + command audit
- `review/audit-B-response.md` — SKILL.md + README.md audit
- `review/audit-C-response.md` — references + assets audit
- `review/audit-D-response.md` — feature_catalog + manual_testing_playbook + stress_test audit

---

## §3. DELETED FILES (Phase 4) — 57 files removed (6 added per review fix)

### Per-level rendered output dirs (the headline deletion)

| Path | Action | Status | Phase | Reason |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/templates/level_1/` (5 .md files) | Deleted | WILL_DELETE | 4 | Per ADR-001: rendered outputs replaced by manifest + on-demand resolver |
| `.opencode/skill/system-spec-kit/templates/level_2/` (6 .md files) | Deleted | WILL_DELETE | 4 | Same |
| `.opencode/skill/system-spec-kit/templates/level_3/` (7 .md files) | Deleted | WILL_DELETE | 4 | Same |
| `.opencode/skill/system-spec-kit/templates/level_3+/` (7 .md files) | Deleted | WILL_DELETE | 4 | Same |
| **Subtotal** | | | | **25 files (matches iter-9 measured deletion budget)** |

### CORE + ADDENDUM source tree (no longer needed under manifest)

| Path | Action | Status | Phase | Reason |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/templates/core/` (5 .md files) | Deleted | WILL_DELETE | 4 | Per ADR-001: replaced by `templates/manifest/*.md.tmpl` files. Content migrated, not lost. |
| `.opencode/skill/system-spec-kit/templates/addendum/` (17 .md files across 4 subdirs) | Deleted | WILL_DELETE | 4 | Same — addendum sections become inline `<!-- IF level:N -->` gates inside manifest templates |
| `.opencode/skill/system-spec-kit/templates/phase_parent/` (1 .md file) | Deleted | WILL_DELETE | 4 | Replaced by `templates/manifest/phase-parent.spec.md.tmpl` |
| **Subtotal** | | | | **23 files** |

### Root-level cross-cutting templates (move to `manifest/`)

| Path | Action | Status | Phase | Reason |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/templates/handover.md` | Deleted | WILL_DELETE | 4 | Content migrated to `templates/manifest/handover.md.tmpl` (lazy command-owned, written by `/memory:save`) |
| `.opencode/skill/system-spec-kit/templates/debug-delegation.md` | Deleted | WILL_DELETE | 4 | Content migrated to `templates/manifest/debug-delegation.md.tmpl` (lazy agent-owned, written by `@debug`) |
| `.opencode/skill/system-spec-kit/templates/research.md` | Deleted | WILL_DELETE | 4 | Content migrated to `templates/manifest/research.md.tmpl` (lazy workflow-owned, written by `/spec_kit:deep-research`) |
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Deleted | WILL_DELETE | 4 | Content migrated to `templates/manifest/resource-map.md.tmpl` (optional author addon) |
| `.opencode/skill/system-spec-kit/templates/context-index.md` | Deleted | WILL_DELETE | 4 | Content migrated to `templates/manifest/context-index.md.tmpl` (optional author addon, rare migration bridge) |
| `.opencode/skill/system-spec-kit/templates/README.md` | Deleted | WILL_DELETE | 4 | Top-level template README. Replaced by a developer-facing README in `templates/manifest/README.md` (NEW, internal docs only — explains the manifest design to maintainers). |
| **Subtotal** | | | | **6 files** |

### Composer + anchor wrapper (obsolete with manifest design)

| Path | Action | Status | Phase | Reason |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` | Deleted | WILL_DELETE | 4 | Composer obsolete — manifest-driven design has no build step (composition happens at scaffold time via resolver + gate renderer) |
| `.opencode/skill/system-spec-kit/scripts/templates/wrap-all-templates.ts` (if present) | Deleted | WILL_DELETE | 4 | ANCHOR injection moves into manifest templates directly (sections include their own anchor comment tags) |
| `.opencode/skill/system-spec-kit/scripts/templates/wrap-all-templates.sh` (if present) | Deleted | WILL_DELETE | 4 | Same |
| `.opencode/skill/system-spec-kit/scripts/templates/README.md` | Modified or Deleted | OK | 4 | Either delete (folder gone) OR keep + rewrite to describe manifest design. Decide in Phase 4. |

### Stale tests (obsolete with manifest design)

| Path | Action | Status | Phase | Reason |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js` | Deleted | WILL_DELETE | 4 | Tests `level_N/` folder layout — obsolete |
| `.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js` | Deleted | WILL_DELETE | 4 | Same |
| `.opencode/skill/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts` | Modified or Deleted | OK | 4 | If today's mustache-section logic moved into the gate renderer, delete; otherwise refactor. Decide in Phase 4. |
| `.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts` | Modified | OK | 4 | Refactor to test manifest-rendered output instead of `level_N/` |
| `.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts` | Modified | OK | 4 | Verify the parser-contract probe from iter 1 still passes against new manifest output |

### Stale fixtures (rewritten in Phase 1 per iter-13 decision)

| Path | Action | Status | Phase | Reason |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-detection/phase-blocked-by-level/` | Modified | OK | 1 | Rewrite fixture to use manifest-rendered output; preserve test intent |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/mixed-levels/` | Modified | OK | 1 | Same |

---

## §4. UNTOUCHED — intentionally NOT edited (don't accidentally edit these)

### Cross-cutting templates (out of scope per packet 002 spec.md)

| Path | Action | Status | Phase | Why untouched |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/templates/changelog/` | Untouched | OK | — | Out of scope per 011 §3 — independent system, not level-variant |
| `.opencode/skill/system-spec-kit/templates/examples/` | Untouched | OK | — | Out of scope — example reference packets, not runtime templates |
| `.opencode/skill/system-spec-kit/templates/scratch/` | Untouched | OK | — | Workspace, never touched |
| `.opencode/skill/system-spec-kit/templates/stress_test/` | Untouched | OK | — | Out of scope — stress-test eval templates |
| `.opencode/skill/system-spec-kit/templates/.hashes/` (if present) | Deleted (stale) | OK | 4 | Pipeline composition artifact — obsolete with composer deletion |

### MCP server modules NOT touching template structure

| Path | Action | Status | Phase | Why untouched |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` | Cited | OK | — | Detects phase-parent based on directory contents (children + spec.md presence). Not affected by template restructure — `phase-parent` kind in manifest derives from same heuristic. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` | Cited | OK | — | Validates `_memory.continuity` block shape. Independent of template taxonomy. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | Cited | OK | — | Reads `handover.md → impl-summary → spec docs`. New design preserves same files. |

### Validators NOT touching templates (full enumeration — every `check-*.sh` accounted for)

| Path | Action | Status | Phase | Why untouched |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/rules/check-ai-protocols.sh` | Untouched | OK | — | AI protocol section check; level-agnostic |
| `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh` | Untouched | OK | — | Anchors stay the same (manifest templates contain own anchors) |
| `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh` | Untouched | OK | — | Canonical save invariants unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-complexity.sh` | Untouched | OK | — | Complexity scoring; reads spec.md content, not template paths |
| `.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh` | Untouched | OK | — | Evidence-marker lint; level-agnostic |
| `.opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh` | Untouched | OK | — | Folder naming convention unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` | Untouched | OK | — | Frontmatter contract unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-graph-metadata.sh` | Untouched | OK | — | graph-metadata.json schema unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-links.sh` | Untouched | OK | — | Wikilink validation; level-agnostic |
| `.opencode/skill/system-spec-kit/scripts/rules/check-normalizer-lint.sh` | Untouched | OK | — | Local declarations lint; level-agnostic |
| `.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh` | Untouched | OK | — | Phase-link semantics unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh` | Untouched | OK | — | Phase-parent content rule unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-placeholders.sh` | Untouched | OK | — | Placeholder fill check; level-agnostic |
| `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh` | Untouched | OK | — | P0/P1/P2 tag check; level-agnostic |
| `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` | Untouched | OK | — | Spec-doc cross-refs unchanged |
| `.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh` | Untouched | OK | — | TOC policy; level-agnostic |
<!-- That's all 23 check-*.sh files: 7 modified in §2 (check-files, check-sections, check-template-headers, check-section-counts, check-level, check-level-match, check-template-source) + 16 untouched here. -->

### Test fixtures + observability data referencing legacy paths (preserved as historical / fixture content)

| Path | Action | Status | Phase | Why untouched |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts` lines ~156-167 | Untouched | OK | — | Test FIXTURE strings asserting normalization of legacy `templates/level_N/spec.md` paths (testing path-normalizer behavior, not testing live templates). Fixture data stays valid as it tests historical input handling. |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` lines ~30-45 | Untouched | OK | — | Historical observability snapshot (frozen advisor measurements with embedded `templates/level_N/` paths). Append-only log; pre-impl entries preserved. |

### Scaffolder helpers NOT touching templates

| Path | Action | Status | Phase | Why untouched |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Untouched | OK | — | Just orchestrates validators; no template paths |
| `.opencode/skill/system-spec-kit/scripts/spec/archive.sh` | Untouched | OK | — | Archives spec folders; no template paths |
| `.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh` | Untouched | OK | — | Reads spec docs; level-aware via existing helpers |
| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Untouched | OK | — | Same |
| `.opencode/skill/system-spec-kit/scripts/spec/quality-audit.sh` | Untouched | OK | — | Same |

### 868 existing spec folders

| Path | Action | Status | Phase | Why untouched |
|---|---|---|---|---|
| `.opencode/specs/**/spec.md` (868 markers) | Untouched | OK | — | Per ADR-001 + ADR-005: existing folders are immutable git history. Their `<!-- SPECKIT_TEMPLATE_SOURCE -->` markers become descriptive comments. Their `<!-- SPECKIT_LEVEL: N -->` markers stay valid (level vocabulary preserved). NO migration script. |

---

## §5. CITED-ONLY (referenced by spec docs, not edited)

| Path | Why cited |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md` | The 51.4 KB synthesis driving this implementation |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md` | ADR-001 through ADR-005 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/plan.md` | The 4-phase plan structure inherited by this packet |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md` | Prior PARTIAL-recommendation framing (REJECTED but cited for factual carryover) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md` | Independent gpt-5.5 analysis that materially refined the design |

---

## §6. PHASE-BY-PHASE FILE COUNT SUMMARY

| Phase | Created | Modified | Deleted | Net change |
|---|---|---|---|---|
| Phase 1: ADD infrastructure + tests + leak fixes | 21 | 2 (template-utils.sh + 2 fixture rewrites) | 0 | +21 |
| Phase 2: MODIFY scaffolder | 0 | 5 (create.sh, template-utils.sh::copy_template, scaffold-debug-delegation.sh, recommend-level.sh, upgrade-level.sh) | 0 | 0 |
| Phase 3: MODIFY validators | 0 | 11 (check-files, check-sections, check-template-headers, check-section-counts, check-level, check-level-match, check-template-source, check-template-staleness, template-structure.js, spec-doc-structure.ts, plus README updates) | 0 | 0 |
| Phase 4A: legacy removal + test retargeting | 0 | 2 (template-structure.vitest.ts, memory-template-contract.vitest.ts) | 57 | -57 |
| Phase 4B: AI-facing prompt + workflow cleanup | 0 | 29 (deduped AI-facing docs, agents, commands, references, assets) | 0 | 0 |
| Phase 4C: catalog/playbook + final proof | 0 | 31 (workflow-invariance allowlist + 22 feature_catalog + 8 manual_testing_playbook; stress_test NO-OP) | 0 | 0 |
| **TOTAL** | **21** | **80** | **57** | **−16 net files**; templates folder specifically: ~74 → 14 = 13 .md.tmpl + 1 internal README (created Phase 1 per T-117a) |
| **Audit-surfaced impact** | (none new) | **62** (32 from A/B/C in §2.5a-f + 30 from D in §2.5g) | (none new) | Stress_test surfaces ALL clean (audit-D); catalog/playbook impact concentrated in 14--pipeline-architecture, 16--tooling-and-scripts, 19--feature-flag-reference, 22--context-preservation subdirs |

---

## §7. VERIFICATION CHECKLIST POINTERS

After Phase 4 completion, verify:
- [ ] `find .opencode/skill/system-spec-kit/templates/manifest/ -name '*.md.tmpl' \| wc -l` returns 12
- [ ] `find .opencode/skill/system-spec-kit/templates/manifest/ -name 'README.md' \| wc -l` returns 1 (internal maintainer docs)
- [ ] `find .opencode/skill/system-spec-kit/templates/level_* -type f` returns 0 results
- [ ] `find .opencode/skill/system-spec-kit/templates/{core,addendum,phase_parent} -type f` returns 0 results
- [ ] `find .opencode/skill/system-spec-kit/templates/ -maxdepth 1 -type f -name '*.md'` returns 0 results (root cross-cutting templates moved to manifest/)
- [ ] `rg "templates/level_" .opencode/skill/system-spec-kit/scripts/ .opencode/skill/system-spec-kit/mcp_server/` returns 0 results outside historical fixtures
- [ ] `bash scripts/tests/workflow-invariance.vitest.ts` passes (no banned vocabulary in public surfaces)
- [ ] `bash validate.sh --strict` passes against all 868 existing spec folders + 6 freshly-scaffolded sample packets
- [ ] One-commit `git revert <impl-commit>` rollback restores all deleted files cleanly

---

## §8. ROLLBACK BLAST RADIUS

Single revert commit covers all 4 phases. Files restored on revert:
- 57 deleted files come back from git
- 80 modified files revert to pre-impl content (18 original + 62 audit-surfaced from §2.5a-g)
- 21 added files get removed (incl. internal manifest README)
- Existing 868 spec folders unaffected (never modified)
- 0 data migration to undo (filesystem only)

Rollback time: <2 minutes.
