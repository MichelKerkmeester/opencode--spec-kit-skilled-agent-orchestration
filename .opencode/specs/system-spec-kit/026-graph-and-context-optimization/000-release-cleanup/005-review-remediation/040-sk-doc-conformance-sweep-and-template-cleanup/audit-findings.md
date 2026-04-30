---
title: "Audit Findings: sk-doc Conformance Sweep"
description: "Per-surface audit verdicts from 7 parallel cli-codex gpt-5.5 high fast agents covering 15 manual_testing_playbook directories, 7 feature_catalog directories, 33 system-spec-kit references, and 8 sk-code-review references."
trigger_phrases:
  - "040-sk-doc-conformance-sweep-and-template-cleanup audit findings"
  - "sk-doc audit findings"
importance_tier: "important"
contextType: "implementation"
---

# Audit Findings: sk-doc Conformance Sweep

<!-- SPECKIT_LEVEL: 3 -->

Per-surface verdicts from 7 parallel cli-codex gpt-5.5 high fast agents (audit batches A/B/C playbooks, FC catalogs, ssk-refs batch 1+2, skcr-refs).

---

## 1. AUDIT METHODOLOGY

- 7 parallel cli-codex gpt-5.5 high fast agents dispatched
- Each agent given canonical sk-doc reference templates as ground truth
- Per-surface contract criteria provided in dispatch prompt
- Output format: `VERDICT: COMPLIANT | PARTIAL | DRIFT`, key deviations, remediation effort
- Dispatch wall time: 7-9 min per agent
- Total audit coverage: 15 playbooks + 7 catalogs + 41 references = 63 surfaces

---

## 2. MANUAL TESTING PLAYBOOKS (15 audited)

| Directory | Verdict | Effort | Key drift |
|---|---|---|---|
| `system-spec-kit/manual_testing_playbook/` (canonical) | PARTIAL | high | 320/321 use `## 4. REFERENCES` not `SOURCE FILES`; only 3/321 include `Real user request`; only 2/321 include `Expected execution process`; 284/321 RCAF-shaped but no explicit `RCAF Prompt` label |
| `cli-claude-code/manual_testing_playbook/` | PARTIAL | low | Root final section uses `FEATURE FILE INDEX` not `FEATURE CATALOG CROSS-REFERENCE INDEX`; per-feature `Prompt` label not `RCAF Prompt`; prompts RCAF-like but not exact form |
| `cli-codex/manual_testing_playbook/` | PARTIAL | low | Same pattern |
| `cli-gemini/manual_testing_playbook/` | PARTIAL | low | Same pattern |
| `cli-copilot/manual_testing_playbook/` | PARTIAL | low | Same pattern |
| `cli-opencode/manual_testing_playbook/` | PARTIAL | low | Same pattern + some prompts start `You are Codex...` (drifted further) |
| `mcp-chrome-devtools/manual_testing_playbook/` | PARTIAL | low | `FEATURE FILE INDEX` vs canonical |
| `mcp-clickup/manual_testing_playbook/` | DRIFT | high | DIRECTORY MISSING ENTIRELY |
| `mcp-coco-index/manual_testing_playbook/` | DRIFT | medium | Most per-feature files miss SCENARIO CONTRACT fields; use `REFERENCES` not `SOURCE FILES`; some prompts mechanically generated |
| `mcp-code-mode/manual_testing_playbook/` | PARTIAL | low | `FEATURE FILE INDEX` vs canonical |
| `sk-improve-agent/manual_testing_playbook/` | DRIFT | high | All 31 per-feature files in old `Prompt/Commands/Expected/Pass Criteria` shape; missing canonical numbered sections, `SOURCE FILES`, `SOURCE METADATA`; root missing automated test cross-ref + feature catalog cross-ref |
| `sk-deep-research/manual_testing_playbook/` | PARTIAL | low | 36/36 use `Desired user-facing outcome` not `user-visible`; some prompts return operator-facing verdicts |
| `sk-deep-review/manual_testing_playbook/` | PARTIAL | medium | Missing root `REVIEW PROTOCOL AND RELEASE READINESS`; missing root `FEATURE CATALOG CROSS-REFERENCE INDEX`; duplicate playbook IDs (`DRV-015`, `DRV-021`) |
| `system-spec-kit/mcp_server/code_graph/manual_testing_playbook/` (USER-FLAGGED) | DRIFT | medium | Older compact section names; no RCAF prompts; per-feature scenario contract missing `Real user request`, `Expected execution process`, `Desired user-visible outcome`, explicit pass/fail; no automated-test cross-ref |
| `system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/` (USER-FLAGGED) | DRIFT | high | 42/43 per-feature files use old `SCENARIO/SETUP/STEPS/EXPECTED/FAILURE MODES/RELATED` shape; most have no scenario prompt at all (begin with prose); root lacks canonical sections; category `09--` skipped |

---

## 3. FEATURE CATALOGS (7 audited)

| Directory | Verdict | Effort | Key drift |
|---|---|---|---|
| `system-spec-kit/feature_catalog/` (canonical) | PARTIAL | high | 292 files have packet-history references (`Phase 017`, `phase_018_change`, `Source spec`, `Graduated via`); 272/302 missing canonical source line; many use `### Tests` not `### Validation And Tests`; duplicate `14--` directory; non-feature `14--stress-testing/README.md` |
| `mcp-coco-index/feature_catalog/` | COMPLIANT | low | None material |
| `sk-improve-agent/feature_catalog/` | PARTIAL | low | All 13 per-feature files include extra `## TABLE OF CONTENTS` (root-style, not snippet-style) |
| `sk-deep-research/feature_catalog/` | PARTIAL | low | Validation table label `### Tests` not canonical `### Validation And Tests` |
| `sk-deep-review/feature_catalog/` | COMPLIANT | low | None material |
| `system-spec-kit/mcp_server/code_graph/feature_catalog/` | PARTIAL | medium | 17/17 per-feature files missing `### Validation And Tests` heading |
| `system-spec-kit/mcp_server/skill_advisor/feature_catalog/` | PARTIAL | low | One phase-history reference (`pre-Phase-027`); category number gap (`05--` skipped) |

---

## 4. SYSTEM-SPEC-KIT REFERENCES (33 audited)

### COMPLIANT (8)
- `structure/folder_routing.md`
- `structure/folder_structure.md`
- `structure/phase_definitions.md`
- `validation/five_checks.md`
- `validation/template_compliance_contract.md`
- `debugging/universal_debugging_methodology.md`
- `memory/embedding_resilience.md`
- `workflows/rollback_runbook.md`

### PARTIAL (18) — mostly mechanical fixes (anchors, OVERVIEW first, horizontal rule)
- `structure/sub_folder_versioning.md`
- `templates/level_selection_guide.md`
- `templates/level_specifications.md`
- `templates/template_guide.md`
- `templates/template_style_guide.md`
- `validation/decision_format.md`
- `validation/phase_checklists.md`
- `debugging/troubleshooting.md`
- `memory/epistemic_vectors.md`
- `memory/memory_system.md`
- `memory/save_workflow.md`
- `memory/trigger_config.md`
- `workflows/execution_methods.md`
- `workflows/quick_reference.md`
- `workflows/worked_examples.md`
- `config/environment_variables.md`
- `config/hook_system.md`
- `hooks/skill-advisor-hook-validation.md`

### DRIFT (7) — need ANCHOR comments + restructure to start with OVERVIEW
- `validation/path_scoped_rules.md`
- `validation/validation_rules.md`
- `intake-contract.md`
- `workflows/nested_changelog.md`
- `cli/memory_handback.md`
- `cli/shared_smart_router.md`
- `hooks/skill-advisor-hook.md`

---

## 5. SK-CODE-REVIEW REFERENCES (8 audited)

### COMPLIANT (5)
- `code_quality_checklist.md`
- `removal_plan.md`
- `security_checklist.md`
- `solid_checklist.md`
- `test_quality_checklist.md`

### PARTIAL (1)
- `quick_reference.md` (missing horizontal rule between H1 summary and first anchor)

### DRIFT (2) — no ANCHOR comments; first H2 is not OVERVIEW
- `review_core.md`
- `review_ux_single_pass.md`

---

## 6. OTHER SURFACES (direct read)

| Surface | Verdict | Notes |
|---|---|---|
| `.opencode/plugins/README.md` | PARTIAL | 17 lines; comment block, lacks sk-doc README structure (Quick Start, scannable sections) |
| `templates/sharded/` | DELETE | Legacy multi-file spec format (5 files) |
| `templates/stress-test/` | RENAME + README | 3 files; folder name uses hyphen vs `stress_test` snake_case sibling convention; missing README |
| `templates/changelog/` | KEEP-ALIGN | Serves nested packet-local changelogs; needs frontmatter alignment, not deletion |
| `templates/addendum/level3plus-govern/` | RENAME | → `level3-plus-govern/` for consistent dash convention |

---

## 7. DRIFT PATTERNS

Recurring patterns across surfaces:

1. **Section naming drift**: `FEATURE FILE INDEX` (cli-* family + mcp-* family) instead of canonical `FEATURE CATALOG CROSS-REFERENCE INDEX`
2. **Prompt label drift**: `Prompt:` instead of `RCAF Prompt:`; prompts close to RCAF form but not exact
3. **REFERENCES vs SOURCE FILES**: per-feature files use older `## 4. REFERENCES` heading
4. **Tests vs Validation And Tests**: feature_catalog per-feature files use shorter `### Tests` heading
5. **Missing scenario contract fields**: `Real user request`, `Expected execution process`, `Desired user-visible outcome` frequently absent
6. **Reference frontmatter**: extra `trigger_phrases`, `importance_tier`, `contextType` fields (these belong on top-level skill manifests, not references)
7. **Anchor absence**: many references missing `<!-- ANCHOR:slug --> ... <!-- /ANCHOR:slug -->` markers
8. **Packet-history language**: feature catalogs cite `Phase 017`, `phase_018_change`, `Source spec`, `Graduated via` — should be source-file + line citations

---

## 8. CONFIDENCE NOTES

- All audits used cli-codex gpt-5.5 high fast in `--sandbox read-only` mode
- Each agent had access to canonical sk-doc reference templates
- Per-surface sampling: 2-3 random files per directory
- Group A (cli-* playbooks) had near-uniform drift — consistent with shared family origin
- system-spec-kit canonical drift was the surprise finding — the reference itself fails its own contract
- mcp-clickup playbook absence was unexpected — likely relates to recent skill manifest changes
