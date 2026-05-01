# Audit D — `feature_catalog/` + `manual_testing_playbook/` + `stress_test/` (templates + mcp_server)

You are a fresh agent doing a focused audit. No conversation context.

## Goal

The user is implementing the C+F hybrid manifest-driven greenfield template-system per the design in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`. The implementation plan + file-by-file blast radius live in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/` (especially `resource-map.md` §2.5).

A binding constraint (ADR-005 in `002/decision-record.md`): **`Level 1/2/3/3+` is the SOLE public/AI-facing vocabulary**. Banned terms on every public/AI-facing surface: `preset`, `capability`, `kind`, `manifest`. Workflow-invariance CI test will fail the build if those leak.

Three previous audits (A/B/C) covered `.opencode/agent/`, `.opencode/command/spec_kit/`, `system-spec-kit/SKILL.md`, `README.md`, `references/`, `assets/`. They surfaced 32 MODIFY targets (per `resource-map.md` §2.5).

## Your task: audit these surfaces for impact

Audit ALL files under:
- `.opencode/skill/system-spec-kit/feature_catalog/` (~22 subdirs + master `feature_catalog.md`)
- `.opencode/skill/system-spec-kit/manual_testing_playbook/` (~24 subdirs + master `manual_testing_playbook.md`)
- `.opencode/skill/system-spec-kit/templates/stress_test/` (4 files)
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/` (6 subdirs)

**Highest-impact candidates to check first** (read these end-to-end):
- `feature_catalog/14--pipeline-architecture/` (likely describes template-system architecture)
- `feature_catalog/19--feature-flag-reference/` (banned-vocab "feature flag/capability flag" usage)
- `feature_catalog/feature_catalog.md` (master catalog)
- `manual_testing_playbook/14--pipeline-architecture/` (test scenarios for template system)
- `manual_testing_playbook/14--stress-testing/`
- `manual_testing_playbook/manual_testing_playbook.md`
- `templates/stress_test/{README.md, findings-rubric.schema.md, findings-rubric.template.json, findings.template.md}` (rubric for stress tests — likely references `level_N/` outputs)
- `mcp_server/stress_test/` README + per-scenario READMEs in code-graph/, matrix/, memory/, search-quality/, session/, skill-advisor/

For EACH file, classify under one of:
- **MODIFY** — file has references to deleted paths (`templates/level_N/`, `templates/{core,addendum,phase_parent}/`, root cross-cutting templates `templates/{handover,debug-delegation,research,resource-map,context-index}.md`, `compose.sh`, `wrap-all-templates`) OR contains banned vocabulary (preset/capability/kind/manifest) on user/AI-facing surface OR describes build-time composition or CORE+ADDENDUM v2.2 architecture
- **DELETE** — file is OBSOLETE under the new design. Be conservative — prefer MODIFY over DELETE.
- **UNTOUCHED** — no impact

For each MODIFY/DELETE, give:
- Specific line(s) needing edit
- Replacement guidance (preserve Level vocabulary; describe manifest-driven design where it replaces composer/level-folder explanation)

**Note on feature_catalog + manual_testing_playbook**: These are MAINTAINER-FACING by default but some entries get surfaced to the AI runtime via the feature-catalog skill. Treat banned vocabulary as a leak only when the entry is part of an AI-readable index OR describes operational behavior (vs internal implementation notes). Use judgement.

**Note on stress_test**: `templates/stress_test/` is rubric content scored against scaffolded packets. Likely has references to `level_N/` outputs that need re-targeting at manifest output. `mcp_server/stress_test/` is fixture/scenario data — may have hardcoded paths.

## Output format

Plain markdown to stdout. Sections:
1. Feature Catalog Audit (per-subdir overview + per-file findings)
2. Manual Testing Playbook Audit (same)
3. Stress Test Audit (templates + mcp_server)
4. Summary count: MODIFY / DELETE / UNTOUCHED

Per-file row with `Path | Action | Reason | Replacement guidance (if MODIFY/DELETE)`. Under 1500 words. Be specific.

## Constraints

- Read-only audit. Do NOT edit any file.
- Use `Read`, `Grep`, `Glob` only.
- Write your output to stdout only.
- Don't recommend net-new scope.
