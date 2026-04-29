---
title: "Deep Review Report: Documentation Truth"
description: "Read-only release-readiness audit of documentation truth. CONDITIONAL verdict: 0 P0, 6 P1, 1 P2 across correctness, security, traceability, and maintainability."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v2.2 -->"
trigger_phrases:
  - "045-009-documentation-truth"
  - "docs truth audit"
  - "stale claims review"
  - "evergreen rule self-check"
importance_tier: "important"
contextType: "review"
---
# Deep Review Report: Documentation Truth

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v2.2 -->

---

## 1. Executive Summary

Verdict: **CONDITIONAL**. The target documentation is not release-blocked by a P0, but it is not yet truth-clean. The strongest issues are stale public tool-surface claims, missing catalog/playbook coverage for registered tools, broken local links, and remaining evergreen packet-history references.

Security posture is clean in this pass: the install docs use placeholder API-key examples and do not publish live secrets or obviously insecure defaults. The automation trigger tables in AGENTS, CLAUDE, the system-spec-kit skill file, and the MCP README all have non-empty trigger columns for their automation rows.

---

## 2. Planning Trigger

Plan remediation before calling this documentation surface release-ready. The active P1 findings are documentation drift, not runtime defects, so the follow-up should be a doc-only remediation pass covering evergreen cleanup, catalog/playbook completion, and count/link repair.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence |
|----|----------|-----------|-------|----------|
| DOC-TRUTH-001 | P1 | Traceability | Evergreen docs still contain unexempted packet-history references | `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md:68`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:128-130`, `.opencode/skill/system-spec-kit/ARCHITECTURE.md:404-406` |
| DOC-TRUTH-002 | P1 | Correctness | Tool-count references still cite older totals beside the current 54-tool surface | `.opencode/skill/system-spec-kit/references/memory/memory_system.md:101`, `.opencode/skill/system-spec-kit/references/config/environment_variables.md:30`, `.opencode/skill/system-spec-kit/SKILL.md:571-575` |
| DOC-TRUTH-003 | P1 | Traceability | Four registered Skill Graph MCP tools lack feature catalog entries | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:680-719` |
| DOC-TRUTH-004 | P1 | Traceability | Operator-facing playbook coverage misses registered Skill Graph and coverage-graph read tools | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:692-719`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:851-865` |
| DOC-TRUTH-005 | P1 | Correctness | Skill Advisor overview and install docs omit `advisor_rebuild` from the public native tool list | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md:38-42`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md:180-185`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/INSTALL_GUIDE.md:26-28`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:7-10` |
| DOC-TRUTH-006 | P1 | Maintainability | Local markdown cross-references are broken in root and generated catalog/playbook indexes | `README.md:1318`, `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:539`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2146` |
| DOC-TRUTH-007 | P2 | Maintainability | Evergreen grep remains too noisy to use as a clean release gate without a stable-ID allowlist | `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md:29-35` |

---

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Evergreen cleanup | DOC-TRUTH-001, DOC-TRUTH-007 | Replace packet-history prose with current runtime anchors, and record stable artifact ID exceptions in an allowlist or audit note. |
| Tool count repair | DOC-TRUTH-002 | Update old `43` and `47` count references to the current count model: 50 local descriptors plus 4 Skill Advisor descriptors. |
| Catalog coverage | DOC-TRUTH-003 | Add per-tool feature catalog entries for `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`. |
| Playbook coverage | DOC-TRUTH-004 | Add manual scenarios for `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, and `deep_loop_graph_query`. |
| Advisor docs sync | DOC-TRUTH-005 | Include `advisor_rebuild` in Skill Advisor public tool lists and registration examples. |
| Link repair | DOC-TRUTH-006 | Fix or remove broken links in root README and generated catalog/playbook indexes. |

---

## 5. Spec Seed

### Problem
Evergreen docs and generated documentation indexes no longer fully match the live MCP registration surface.

### Scope
- Update stale tool totals.
- Add missing catalog/playbook entries for registered tools.
- Repair broken local links.
- Re-run the evergreen reference self-check after removing packet-history references.

### Acceptance Criteria
- Canonical public count is described consistently as 54 `spec_kit_memory` tools.
- Every registered MCP tool has either a root or package-local feature catalog entry.
- Every operator-facing tool has a manual playbook entry or an explicit non-operator classification.
- Local markdown link scan returns zero actionable broken links in the target surface.

---

## 6. Plan Seed

1. Patch evergreen docs with current-runtime wording and file anchors.
2. Patch stale count references in the memory reference, environment variable reference, and system-spec-kit skill file.
3. Add Skill Graph feature catalog entries.
4. Add missing playbook scenarios.
5. Update Skill Advisor README/install guide lists to include `advisor_rebuild`.
6. Regenerate or patch generated catalog/playbook root links.
7. Re-run the same grep, count, coverage, and link checks.

---

## 7. Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| Evergreen self-check | Partial | Grep produced many hits; examples include `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:128-130` and `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md:68`. |
| Tool counts | Partial | `grep -c "name: '"` found 50 local descriptors; `AdvisorToolInputSchemas` lists 4 advisor schema entries at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:268-273`. Some docs still say 43 or 47. |
| Feature catalog completeness | Partial | Registered Skill Graph tools exist at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:680-719`; catalog search found no matching entries. |
| Manual playbook completeness | Partial | Playbook search found no entries for `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, or `deep_loop_graph_query`. |
| Automation trigger columns | Pass | `AGENTS.md:94-100`, `CLAUDE.md:94-100`, `.opencode/skill/system-spec-kit/SKILL.md:758-763`, and `.opencode/skill/system-spec-kit/mcp_server/README.md:544-552` use non-empty trigger columns plus caveats. |
| Security posture | Pass | API key guidance uses placeholders such as `README.md:140-143`; install guide uses placeholder paths at `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:334-348` and warns Codex users about writable DB placement at `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:310-313`. |

---

## 8. Deferred Items

- Stable generated scenario IDs and category names match the evergreen grep. Those are not all violations, but the current grep output is too noisy to be a binary release gate without classification.
- Security review was documentation-only. It did not execute install flows or inspect private environment files.
- The link scan was a local markdown resolver; it did not validate external URLs.

---

## 9. Audit Appendix

### Commands Run

| Check | Result |
|-------|--------|
| Evergreen reference grep | Non-empty; top hit groups included generated playbook root, validation references, system-spec-kit README/SKILL, MCP README, and feature catalog root. |
| Tool count | `tool-schemas.ts` local descriptor grep: 50. Skill Advisor schema entries: 4. Current combined public surface: 54. |
| Feature catalog coverage | Missing: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`. |
| Manual playbook coverage | Missing: `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, `deep_loop_graph_query`. |
| Link scan | 644 markdown files checked; 64 local markdown links did not resolve. |
| Security scan | No live secrets found; examples use placeholders. |

### Count Evidence

| Source | Evidence |
|--------|----------|
| Local tool descriptors | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:48-884` contains 50 `name: '` descriptors by grep. |
| Advisor schema entries | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:268-273` lists `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`. |
| Root README current count | `README.md:1289` explains 54 as 50 local descriptors plus 4 imported Skill Advisor descriptors. |

### Verdict

CONDITIONAL: 0 P0, 6 P1, 1 P2. Release readiness should wait for a doc-only remediation pass and a clean rerun of the audit checks above.
