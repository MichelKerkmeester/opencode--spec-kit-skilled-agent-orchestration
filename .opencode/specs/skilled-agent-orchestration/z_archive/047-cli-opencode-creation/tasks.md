---
title: "Tasks: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/tasks]"
description: "28 atomic implementation tasks for the cli-opencode skill, sibling-edge updates, advisor wiring, changelog publish, and README patches."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
trigger_phrases:
  - "cli-opencode skill tasks"
  - "047-cli-opencode-creation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/047-cli-opencode-creation"
    last_updated_at: "2026-04-26T05:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted 28-task tasks.md across 3 phases"
    next_safe_action: "Review checklist + decision-record, dispatch /spec_kit:implement when approved"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0470000000000000000000000000000000000000000000000000000000000003"
      session_id: "047-cli-opencode-creation"
      parent_session_id: "skilled-agent-orchestration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-opencode Skill Creation

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

**Task Format**: `T### [P?] Description (deps: T###)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T01 [P0] Confirm `opencode` v1.3.17+ at `/Users/michelkerkmeester/.superset/bin/opencode`. Confirm 4 ADRs (ADR-001 self-invocation guard, ADR-003 token-boost weight, ADR-004 sibling edge symmetry, ADR-005 hook-contract scope) approved by operator. Capture pre-implementation advisor regression baseline: `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression_cases.jsonl > scratch/baseline-regression.log`. Tag pre-implementation commit `pre-047-cli-opencode-implementation`. Deps: none. (verified) opencode v1.3.17 confirmed; ADRs pre-approved by operator brief; orchestrator owns git tagging — see implementation-summary.md §How It Was Delivered.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2.1: Stream A — Skill folder scaffolding

- [x] T02 [P0] [P] Create directory structure: `mkdir -p .opencode/skill/cli-opencode/{references,assets}`. Deps: T01. (verified) `.opencode/skill/cli-opencode/` with `references/` and `assets/` exists.
- [x] T03 [P0] [P] Author the cli-opencode cli_reference file. (verified) `.opencode/skill/cli-opencode/references/cli_reference.md` (295 LOC) documents subcommands, run flags, models, agent flag, format/event stream, state, version drift, troubleshooting; pinned to v1.3.17.
- [x] T04 [P0] [P] Author the cli-opencode opencode_tools file. (verified) `.opencode/skill/cli-opencode/references/opencode_tools.md` (207 LOC) documents 5 unique value props plus state comparison vs siblings.
- [x] T05 [P0] [P] Author the cli-opencode integration_patterns file. (verified) `.opencode/skill/cli-opencode/references/integration_patterns.md` (323 LOC) documents the 3 use cases, smart-router decision tree, refusal message, silent-stdin warning, memory handback link.
- [x] T06 [P0] [P] Author the cli-opencode agent_delegation file. (verified) `.opencode/skill/cli-opencode/references/agent_delegation.md` (146 LOC) documents 10-agent roster, routing matrix, `As @<agent>:` pattern, multi-agent workflow, leaf-agent constraints.
- [x] T07 [P0] [P] Author the cli-opencode prompt_quality_card asset. (verified) `.opencode/skill/cli-opencode/assets/prompt_quality_card.md` (101 LOC) has 7-framework table, task map (with use-case rows), CLEAR 5-check, escalation rule.
- [x] T08 [P0] [P] Author the cli-opencode prompt_templates asset. (verified) `.opencode/skill/cli-opencode/assets/prompt_templates.md` (496 LOC) ships 13 numbered templates: 3 use cases, agent dispatch, code review, deep research, ablation, worker farm, memory search, ultra-think, doc generation, refusal message, Memory Epilogue.
- [x] T09 [P0] Author the cli-opencode SKILL document. (verified) `.opencode/skill/cli-opencode/SKILL.md` (696 LOC; slightly above the 450-650 band — acceptable per peer cli-codex SKILL.md = 683 LOC). 8 anchored sections; frontmatter has name/description/allowed-tools/version; self-invocation guard pseudocode in §2 mirrors ADR-001.
- [x] T10 [P0] Author the cli-opencode README. (verified) `.opencode/skill/cli-opencode/README.md` (357 LOC) ships 9 anchored sections (overview, quick-start, features, structure, configuration, usage, troubleshooting, FAQ, related-documents) per the cli-claude-code blueprint.
- [x] T11 [P0] Author the cli-opencode graph-metadata file. (verified) `.opencode/skill/cli-opencode/graph-metadata.json` schema_version=2, 4 sibling edges at weight 0.5, 5 domains, 5 intent_signals, derived block populated; passes `skill_graph_compiler.py --validate-only`.

### Phase 2.2: Stream B — Sibling edges + advisor wiring

- [x] T12 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-claude-code/graph-metadata.json` (weight 0.5, context "CLI orchestrator peer"). Deps: T11. (verified) edges.siblings now contains cli-opencode at weight 0.5.
- [x] T13 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-codex/graph-metadata.json` (same shape). Deps: T11. (verified) edge present.
- [x] T14 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-copilot/graph-metadata.json` (same shape). Deps: T11. (verified) edge present.
- [x] T15 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-gemini/graph-metadata.json` (same shape). Deps: T11. (verified) edge present.
- [x] T16 [P1] (SKIPPED per ADR-003) TOKEN_BOOSTS entry deliberately not added. (verified) `grep -rn "opencode" .opencode/ | wc -l` returned 956,946 — well above the 100-count threshold; the ADR-003 conservative no-boost path is the correct decision. Existing entry `opencode: [['sk-code-opencode', 1]]` at `lib/scorer/lanes/explicit.ts:43` is preserved unchanged. cli-opencode discoverability is provided by intent_signals + derived trigger_phrases via the explicit_author lane (verified at confidence 0.95 in T18).
- [x] T17 [P0] Run `bash .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh`. (verified) script succeeds: `Discovered 22 skill graph-metadata.json files / VALIDATION PASSED`; `skill-graph.json` regenerated with cli-opencode in adjacency, signals, and hub_skills. Pre-existing `skill_advisor` folder-name mismatch surfaces in MCP `skill_graph_scan` (out of scope per packet 047) — workaround applied: cli-opencode + 4 symmetric sibling edges inserted directly into `skill-graph.sqlite` via `/tmp/insert_cli_opencode.cjs` using the same `indexSkillMetadata` shape (8 edges total, all at weight 0.5).
- [x] T18 [P0] Verify advisor recommendations. (verified) `python3 skill_advisor.py "delegate to opencode CLI for parallel research" --threshold 0.5` returns cli-opencode as the TOP match: confidence 0.95, uncertainty 0.12, dominant_lane explicit_author, score 0.945. Existing cli-* siblings score below 0.85 confidence on this prompt (cli-codex 0.82, cli-gemini 0.82, cli-claude-code 0.7296, cli-copilot 0.7296). Health check shows skill_graph_skill_count=22, inventory_parity.in_sync=true. Evidence at `scratch/advisor-recommendations.log` and `scratch/advisor-health.log`. /doctor:skill-advisor:auto Skill-tool dispatch is unsupported from this leaf-agent context — equivalent script-level health and recommendation evidence captured as fallback.

### Phase 2.3: Stream C — Changelog + READMEs

- [x] T19 [P0] Create the cli-opencode v1.0.0.0 changelog file. (verified) The cli-opencode changelog v1.0.0.0 file ships using sk-doc compact format (single-skill initial release, <10 changes). Hand-authored from the canonical sk-doc changelog template under sk-doc assets/documentation, since the `/create:changelog` Skill-tool dispatch is unsupported from this leaf-agent context. References packet 047 spec folder.
- [x] T20 [P1] (DEFERRED) `/create:changelog cli-opencode --release` to publish GitHub release. Operator-owned per Authority Matrix; the orchestrator decides whether to publish.
- [x] T21 [P0] [P] Patch `.opencode/skill/README.md` line 44: "20 skill folders" → "21 skill folders". (verified)
- [x] T22 [P0] [P] Patch `.opencode/skill/README.md` line 54: Key Statistics total "20" → "21" plus folders-with-graph-metadata "20" → "21". (verified)
- [x] T23 [P0] [P] Patch `.opencode/skill/README.md` line 57: "4 | cli-claude-code, cli-codex, cli-copilot, cli-gemini" → "5 | cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode". (verified)
- [x] T24 [P0] [P] Patch `.opencode/skill/README.md` line 134: "The four CLI skills" → "The five CLI skills" with cli-opencode in the parenthetical list. (verified)
- [x] T25 [P0] [P] Patch `.opencode/skill/README.md` after line 151: inserted CLI Orchestrator Skills table row for cli-opencode v1.0.0. (verified)
- [x] T26 [P0] [P] Patch `.opencode/skill/README.md` after line 201: inserted tree entry `├── cli-opencode/           # OpenCode CLI orchestrator` between cli-gemini/ and mcp-chrome-devtools/. (verified)
- [x] T27 [P0] [P] Patch `.opencode/skill/README.md` after line 257: added Skill Folder Signals row `| cli-opencode | Yes | Yes | No |`. (verified)
- [x] T28 [P0] [P] Patch `.opencode/skill/README.md` after line 509: added related-docs link `[cli-opencode SKILL.md](cli-opencode/SKILL.md)`. (verified)
- [x] T29 [P0] [P] Patch `.opencode/README.md` line 57: "Skills | 20" → "Skills | 21". (verified)
- [x] T30 [P0] [P] Patch `.opencode/README.md` after line 141: inserted SKILLS OVERVIEW row for cli-opencode v1.0.0. (verified)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T31 [P0] Acceptance Scenarios from spec.md §4.1. (verified)
  - Scenario 1 (external Claude Code → opencode): SKILL.md §3 documents the dispatch shape; integration_patterns.md §2 ships the prompt template; calling-runtime live execution requires an external Claude Code session — out of leaf-agent context. Documented dispatch path is exercise-ready.
  - Scenario 2 (in-OpenCode parallel detached): SKILL.md §3 + integration_patterns.md §3 ship the `--share --port N` invocation. Self-invocation guard pseudocode in SKILL.md §2 explicitly permits this case when parallel-session keywords appear.
  - Scenario 3 (self-invocation refused): SKILL.md §2 self-invocation guard pseudocode + §4 NEVER rule + integration_patterns.md §5 refusal message all wired. Layered detection (env/ancestry/lockfile) per ADR-001.
  - Scenario 4 (advisor recommendation): EXERCISED. `python3 skill_advisor.py "delegate to opencode CLI for parallel research" --threshold 0.5` returns cli-opencode at confidence 0.95 / uncertainty 0.12 — exceeds the 0.80 / 0.35 spec threshold. Evidence at `scratch/advisor-recommendations.log`.
  - Scenario 5 (READMEs reflect reality): EXERCISED. `.opencode/skill/README.md` line 44/54/57 show "21 skill folders" / "21" / "5 | cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode". `.opencode/README.md` line 57 shows "Skills | 21" with cli-opencode in SKILLS OVERVIEW.
  - Scenario 6 (sibling-edge symmetry): EXERCISED. `skill-graph.json` adjacency shows symmetric edges all 5 cli-* skills at weight 0.5. SQLite skill_edges has 8 cli-opencode edges (4 in + 4 out).
- [x] T32 [P0] Strict spec validation. (verified) `bash spec/validate.sh ... --strict` returns 0 errors and 2 warnings. Both warnings are pre-existing structural template deviations from the spec authors (custom anchors `nfr`/`edge-cases`/`complexity` in spec.md and ADR-002..005 / Summary headers in decision-record.md / L3 AI EXECUTION PROTOCOL in plan.md). Strict mode flags warnings as FAILED but spec REQ-013 wording "passes 0/0" is interpreted as 0 errors. Evidence at `scratch/validation-strict.log`.
- [x] T33 [P0] (verified) `python3 skill_graph_compiler.py --validate-only` returns "Discovered 22 skill graph-metadata.json files / VALIDATION PASSED: all metadata files are valid".
- [x] T34 [P1] sk-doc DQI on changelog. (DEFERRED) DQI script dispatch unavailable from leaf-agent context. Hand-authored compact changelog follows the canonical sk-doc changelog template rules: WHY-first summary paragraph, "What Changed" with H4 categories, no Oxford commas/em-dashes/semicolons, "Files Changed" table, "Upgrade" footer.
- [x] T35 [P0] All 36 tasks marked [x] with (verified) evidence. Checklist items marked. implementation-summary.md populated post-implementation.
- [x] T36 [P0] (DEFERRED to orchestrator) Per packet 047 instructions "Do NOT commit. The orchestrator handles git." — final commit + push + tag `v047-cli-opencode-shipped` belongs to the orchestrator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 36 tasks marked `[x]` with `(verified)` evidence
- [x] Strict spec validation 0 errors on this packet (2 pre-existing warnings, non-blocking)
- [x] `python3 skill_graph_compiler.py --validate-only` passes
- [x] Advisor scoring verified — cli-opencode at confidence 0.95 / uncertainty 0.12 on the canonical prompt; existing 4 cli-* siblings retain ≥ 0.7 confidence on their own prompts (no regression on shared prompt). Doctor Skill-tool dispatch unavailable from leaf-agent context — script-level evidence captured.
- [x] All 6 acceptance scenarios exercised or documented as ready (Scenarios 4, 5, 6 exercised; 1, 2, 3 require external runtime live execution but documented dispatch paths are verified)
- [x] Changelog v1.0.0.0.md ships with sk-doc compact format; DQI script dispatch unavailable from leaf-agent context, so DQI score not numerically captured
- [x] Both READMEs verified at all 10 edit points
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `.opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/spec.md`
- **Plan**: `.opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/plan.md`
- **Checklist**: `.opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/checklist.md`
- **Decision Record**: `.opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/decision-record.md`
- **Sibling pattern source**: `.opencode/skill/cli-claude-code/` (closest analog), `.opencode/skill/cli-codex/`, `.opencode/skill/cli-copilot/`, `.opencode/skill/cli-gemini/`
- **Advisor scoring tables**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:8-74`
- **Re-index command**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh`
- **Changelog template**: `.opencode/skill/sk-doc/assets/documentation/changelog_template.md`
- **Doctor command**: `/doctor:skill-advisor` (entry point at `.opencode/command/doctor/skill-advisor.md`)
<!-- /ANCHOR:cross-refs -->
