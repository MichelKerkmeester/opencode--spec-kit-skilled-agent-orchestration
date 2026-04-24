---
title: "Checklist: Resource Map Template"
description: "P0/P1/P2 verification for the resource-map.md template and its wiring across every discovery surface."
trigger_phrases:
  - "026/012 checklist"
  - "resource-map checklist"
importance_tier: "normal"
contextType: "checklist"
---
# Checklist: Resource Map Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-level2 | v2.2 -->

---

## P0 — Blockers

- [ ] `.opencode/skill/system-spec-kit/templates/resource-map.md` exists [EVIDENCE: file path]
- [ ] Template frontmatter contains `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` [EVIDENCE: `head -20 templates/resource-map.md`]
- [ ] Template body contains 10 category sections (READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta) [EVIDENCE: `grep '^## [0-9]' templates/resource-map.md | wc -l`]
- [ ] `SPEC_DOCUMENT_FILENAMES` in `mcp_server/lib/config/spec-doc-paths.ts` includes `'resource-map.md'` [EVIDENCE: `grep resource-map.md mcp_server/lib/config/spec-doc-paths.ts`]
- [ ] `cd mcp_server && npm run typecheck` exits 0 [EVIDENCE: command output]

---

## P1 — Required

- [ ] `templates/README.md` Structure table includes a `resource-map.md` row [EVIDENCE: grep]
- [ ] `templates/level_1/README.md` mentions `resource-map.md` as optional [EVIDENCE: grep]
- [ ] `templates/level_2/README.md` mentions `resource-map.md` as optional [EVIDENCE: grep]
- [ ] `templates/level_3/README.md` mentions `resource-map.md` as optional [EVIDENCE: grep]
- [ ] `templates/level_3+/README.md` mentions `resource-map.md` as optional [EVIDENCE: grep]
- [ ] `SKILL.md` references `resource-map.md` in at least one of §3 / §9 / distributed governance blocks [EVIDENCE: grep]
- [ ] `.opencode/skill/system-spec-kit/README.md` references `resource-map.md` [EVIDENCE: grep]
- [ ] `references/templates/level_specifications.md` §9 has a resource-map row [EVIDENCE: grep]
- [ ] Each Level N section in `level_specifications.md` mentions `resource-map.md (optional)` [EVIDENCE: grep]
- [ ] `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` exists with neighbor-matching format [EVIDENCE: `ls -la`]
- [ ] `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` exists with neighbor-matching format [EVIDENCE: `ls -la`]
- [ ] `CLAUDE.md` mentions `resource-map.md` as optional cross-cutting doc [EVIDENCE: grep]
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-resource-map-template --strict` exits 0 [EVIDENCE: exit code]
- [ ] `description.json` + `graph-metadata.json` exist for this phase folder [EVIDENCE: `ls`]

---

## P2 — Nice to Have

- [ ] Parent `026` `description.json` / `graph-metadata.json` updated to include `012-resource-map-template` child [EVIDENCE: diff]
- [ ] `../changelog/012-resource-map-template.md` created using packet-local changelog template [EVIDENCE: file exists]
- [ ] `implementation-summary.md` finalized with Files Changed + Verification tables [EVIDENCE: file sections]

---

## DEFERRED

- Optional `scripts/resource-map/emit-from-diff.sh` auto-generator (future work — not required for this packet).
- Backfilling `resource-map.md` into historical packets (explicit non-goal).
