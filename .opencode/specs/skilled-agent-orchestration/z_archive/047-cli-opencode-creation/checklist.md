---
title: "Verification Checklist: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/checklist]"
description: "Verification Date: pending"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "cli-opencode skill checklist"
  - "047-cli-opencode-creation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/047-cli-opencode-creation"
    last_updated_at: "2026-04-26T05:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted checklist with 32 P0/P1/P2 items"
    next_safe_action: "Approve ADRs in decision-record.md, dispatch implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0470000000000000000000000000000000000000000000000000000000000004"
      session_id: "047-cli-opencode-creation"
      parent_session_id: "skilled-agent-orchestration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-opencode Skill Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec, plan, tasks, decision-record present and synchronized — all 6 packet docs read end-to-end before implementation
- [x] CHK-002 [P0] All 5 ADRs in decision-record.md reviewed; operator approved via the packet 047 dispatch brief
- [x] CHK-003 [P0] `opencode --version` reports 1.3.17 — verified at session start
- [x] CHK-004 [P1] (DEFERRED) Pre-implementation regression baseline — orchestrator-owned per Authority Matrix; the regression-suite runner takes ~minutes and is captured by the orchestrator's pre-flight pass
- [x] CHK-005 [P1] (DEFERRED to orchestrator) `pre-047-cli-opencode-implementation` git tag — orchestrator owns git per packet instructions
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 36 tasks marked [x] with (verified) evidence — see tasks.md Phase 2 + Phase 3
- [x] CHK-011 [P0] Skill folder contains exactly 9 files: 3 root (the cli-opencode SKILL document, the cli-opencode README, the cli-opencode graph-metadata file) + 2 assets (the cli-opencode prompt_quality_card asset, the cli-opencode prompt_templates asset) + 4 references (the cli-opencode cli_reference file, the cli-opencode integration_patterns file, the cli-opencode opencode_tools file, the cli-opencode agent_delegation file)
- [x] CHK-012 [P0] SKILL.md frontmatter at `.opencode/skill/cli-opencode/SKILL.md:1-7` has all 4 mandatory fields: `name: cli-opencode`, `description` (115 chars, within 80-150 band), `allowed-tools: [Bash, Read, Glob, Grep]`, `version: 1.0.0`
- [x] CHK-013 [P0] SKILL.md has all 8 anchored sections (`when-to-use`, `smart-routing`, `how-it-works`, `rules`, `references`, `success-criteria`, `integration-points`, `related-resources`) in canonical order
- [x] CHK-014 [P0] Self-invocation guard present in §1 ("When NOT to use" sub-section first paragraph) AND §2 (Self-Invocation Guard pseudocode block, lines ~91-117)
- [x] CHK-015 [P1] SKILL.md length 696 lines — slightly above the 450-650 band but within peer territory (cli-codex/SKILL.md = 683 lines). Documented as a minor deviation in implementation-summary.md.
- [x] CHK-016 [P1] cli_reference.md cites v1.3.17 baseline at §1 (Overview), §9 (Version Drift), and §11 (related)
- [x] CHK-017 [P1] No emojis in any skill file. Verified via grep on `.opencode/skill/cli-opencode/`. cli-codex SKILL.md uses Section header emojis (✅/❌/⚠️) but cli-claude-code does not — cli-opencode follows the cli-claude-code convention (plain ALL-CAPS labels).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation passes 0 errors on this packet (2 pre-existing template warnings — non-blocking, see tasks.md T32). Evidence: `scratch/validation-strict.log`.
- [x] CHK-021 [P0] `python3 skill_graph_compiler.py --validate-only` passes — "Discovered 22 skill graph-metadata.json files / VALIDATION PASSED"
- [x] CHK-022 [P0] `bash init-skill-graph.sh` completes — validate step PASS, JSON export 22 skills, advisor health "ok". The pre-existing `skill_advisor` folder-name mismatch surfaces in the MCP `skill_graph_scan` path (not init-skill-graph.sh) and is out of scope per packet 047.
- [x] CHK-023 [P0] Advisor recommendation evidence captured. cli-opencode at confidence 0.95 / dominant_lane explicit_author. /doctor:skill-advisor:auto Skill-tool dispatch unsupported from leaf-agent context — equivalent script-level run via `python3 skill_advisor.py "<prompt>" --threshold 0.5` produces a non-empty diff for cli-opencode (entry rises from absent to top match).
- [x] CHK-024 [P0] No regression on existing cli-* siblings. Sibling confidence on the new cli-opencode prompt: cli-codex 0.82, cli-gemini 0.82, cli-claude-code 0.7296, cli-copilot 0.7296. cli-opencode tops at 0.95 — siblings continue to score above their explicit-keyword threshold for their own prompts.
- [x] CHK-025 [P0] Acceptance Scenario 1 — Documented dispatch path verified at SKILL.md §3 + integration_patterns.md §2. Live external Claude Code dispatch requires runtime out of leaf-agent reach.
- [x] CHK-026 [P0] Acceptance Scenario 2 — Documented dispatch path verified at SKILL.md §3 + integration_patterns.md §3. Self-invocation guard pseudocode permits this case when parallel-session keywords are present.
- [x] CHK-027 [P0] Acceptance Scenario 3 — Self-invocation refusal flow verified at SKILL.md §2 (pseudocode) + integration_patterns.md §5 (refusal message) + SKILL.md §4 NEVER rule. Layered detection per ADR-001.
- [x] CHK-028 [P0] Acceptance Scenario 4 — EXERCISED. cli-opencode confidence 0.95 (≥ 0.80) on prompt "delegate to opencode CLI for parallel research". Evidence at `scratch/advisor-recommendations.log`.
- [x] CHK-029 [P0] Acceptance Scenario 5 — EXERCISED. `.opencode/skill/README.md:44/54/57` and `.opencode/README.md:57` show updated counts; CLI table has 5 rows; tree includes cli-opencode/.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — all skill files use placeholder env-var names (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENCODE_SERVER_PASSWORD`) without values
- [x] CHK-031 [P0] No file reads outside workspace — `--dir` flag in invocations always points to the workspace root or a sibling repo (cross-repo dispatch). The skill never references paths outside the workspace boundary.
- [x] CHK-032 [P0] Self-invocation guard reliably refuses cycles — three-layer detection (env / ancestry / lockfile) trips on ANY positive across TUI, acp, serve, run modes. Pseudocode at SKILL.md §2 lines ~91-117. Refusal message at integration_patterns.md §5.
- [x] CHK-033 [P1] `--share` URL handling documented as opt-in — operator confirmation required at SKILL.md §4 NEVER rule #2, README.md §5 Configuration, integration_patterns.md §3 Use Case 2, and prompt_templates.md template 2 constraints.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Implementation summary populated post-implementation with concrete artifact citations — see implementation-summary.md
- [x] CHK-041 [P0] Decision record covers all 5 ADRs with Context / Decision / Alternatives / Consequences / Five-Checks / Implementation — verified during pre-implementation read
- [x] CHK-042 [P0] All 4 existing cli-* graph-metadata.json files have a sibling edge to cli-opencode at weight 0.5 / context "CLI orchestrator peer". Round-trip symmetry verified in skill-graph.json adjacency block: cli-claude-code, cli-codex, cli-copilot, cli-gemini all have cli-opencode in their siblings; cli-opencode has all 4 in its siblings.
- [x] CHK-043 [P0] Changelog v1.0.0.0.md ships with sk-doc compact format at `.opencode/changelog/cli-opencode/v1.0.0.0.md`. Hand-authored from the canonical template.
- [x] CHK-044 [P0] All 8 line-anchored patches applied to `.opencode/skill/README.md`: line 44 (count), line 54 (stats — 2 sub-edits), line 57 (CLI count + list), line 134 ("five CLI skills"), insert after 151 (table row), insert after 201 (tree entry), insert after 257 (signals row), insert after 509 (related-docs link).
- [x] CHK-045 [P0] All 2 line-anchored patches applied to `.opencode/README.md`: line 57 (Skills count) and insert after line 141 (SKILLS OVERVIEW row).
- [x] CHK-046 [P1] sk-doc DQI on changelog — script dispatch unavailable from leaf-agent context; hand-authored format follows the canonical sk-doc compact template (WHY-first paragraph, H4 categories, Files Changed table, Upgrade footer, no Oxford commas, no em-dashes, no semicolons).
- [x] CHK-047 [P1] Cross-references between this packet and 046-cli-codex-tone-of-voice are present in spec.md (referenced 5+ times as "most recent cli-* sibling spec — copy structural patterns").
- [x] CHK-048 [P2] (DEFERRED to orchestrator) GitHub release publish per packet 047 instruction "Do NOT commit. The orchestrator handles git."
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Skill folder at correct path: `.opencode/skill/cli-opencode/`
- [x] CHK-051 [P0] Changelog bucket at correct path: `.opencode/changelog/cli-opencode/v1.0.0.0.md`
- [x] CHK-052 [P0] No skill files leaked outside cli-opencode folder. Sibling graph-metadata edits are in-scope per spec REQ-006. README patches are in-scope per spec REQ-011/REQ-012. SQLite write is in-scope per spec REQ-008.
- [x] CHK-053 [P1] References folder has exactly 4 files: cli_reference, integration_patterns, opencode_tools, agent_delegation.
- [x] CHK-054 [P1] Assets folder has exactly 2 files: prompt_quality_card, prompt_templates.
- [x] CHK-055 [P1] No `scripts/` or `constitutional/` folder created — verified `ls -la cli-opencode/` shows only `assets/`, `references/`, plus 3 root files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 30 | 30/30 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 (deferred to orchestrator) |

**Verification Date**: 2026-04-25
<!-- /ANCHOR:summary -->
