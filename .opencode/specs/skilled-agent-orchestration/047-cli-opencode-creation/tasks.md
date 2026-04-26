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

- [ ] T01 [P0] Confirm `opencode` v1.3.17+ at `/Users/michelkerkmeester/.superset/bin/opencode`. Confirm 4 ADRs (ADR-001 self-invocation guard, ADR-003 token-boost weight, ADR-004 sibling edge symmetry, ADR-005 hook-contract scope) approved by operator. Capture pre-implementation advisor regression baseline: `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression_cases.jsonl > scratch/baseline-regression.log`. Tag pre-implementation commit `pre-047-cli-opencode-implementation`. Deps: none.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2.1: Stream A — Skill folder scaffolding

- [ ] T02 [P0] [P] Create directory structure: `mkdir -p .opencode/skill/cli-opencode/{references,assets}`. Deps: T01.
- [ ] T03 [P0] [P] Author the cli-opencode cli_reference file. Mirror cli-codex/references/cli_reference.md structure. Document: opencode CLI flags (run/serve/web/agent/mcp/debug subcommands), models (`-m provider/model`), `--variant` reasoning effort, `--format json` event stream, `--share` URL, `--port`, `--dir`, `-c` continue-session, `-s session-id`, `--thinking` blocks. Pin v1.3.17 baseline. Deps: T02.
- [ ] T04 [P0] [P] Author the cli-opencode opencode_tools file. Document the unique value props: full plugin/skill/MCP runtime context (vs raw model dispatch), parallel detached sessions via `--share` + `--port`, agent dispatch via `--agent` flag (loads agents from `.opencode/agent/`), structured event stream via `--format json`, cross-repo dispatch via `--dir`. Document the SQLite/state location (`~/.opencode/state/`) and how it differs from the per-session ephemeral context the four sibling CLIs use. Deps: T02.
- [ ] T05 [P0] [P] Author the cli-opencode integration_patterns file. Document 3 use cases: (1) external Claude Code → opencode for full plugin runtime, (2) in-OpenCode parallel detached session for ablation/workers, (3) cross-AI orchestration (Codex/Copilot/Gemini → opencode for spec-kit workflows). Each use case includes a copy-paste prompt template + the matching `opencode run` invocation. Deps: T02.
- [ ] T06 [P0] [P] Author the cli-opencode agent_delegation file. List the agents available via `opencode debug skill` + `opencode debug agent <name>`. Document the `cli "As @<agent>: prompt"` invocation pattern. Mirror the orchestration principle from sibling skills: calling AI decides WHAT, agent shapes HOW. Deps: T02.
- [ ] T07 [P0] [P] Author the cli-opencode prompt_quality_card asset. Copy the 7-framework table + task-to-framework map + CLEAR 5-check from a sibling (cli-claude-code is the closest analog). Adapt task-framework map for opencode-specific tasks. Add the escalation rule (complexity ≥ 7/10 → `@improve-prompt`). Deps: T02.
- [ ] T08 [P0] [P] Author the cli-opencode prompt_templates asset. ~13 numbered templates covering generation, review, research, architecture, parallel detached sessions, ablation, worker farms, cross-AI handback. Include "Memory Epilogue" template if the skill is to participate in memory continuity. Deps: T02.
- [ ] T09 [P0] Author the cli-opencode SKILL document. Eight anchored sections in canonical order. Frontmatter: `name: cli-opencode`, `description` (80-150 chars), `allowed-tools: [Bash, Read, Glob, Grep]`, `version: 1.0.0`. Inline keywords line. Section 1 (WHEN TO USE) includes the self-invocation guard from ADR-001. Section 2 (SMART ROUTING) pseudocode mirrors cli-claude-code shape. Section 3 (HOW IT WORKS) documents `opencode run` invocation, model table, agent delegation, prerequisites check. Section 4 (RULES) — ALWAYS / NEVER / ESCALATE IF. Sections 5-8 — references, success criteria, integration points, related resources. ~550 lines target. Deps: T03, T04, T05, T06, T07, T08.
- [ ] T10 [P0] Author the cli-opencode README. 9 sections (overview, quick-start, features, structure, config, usage, troubleshooting, FAQ, related). Mirror cli-claude-code/README.md shape. Deps: T09.
- [ ] T11 [P0] Author the cli-opencode graph-metadata file. schema_version=2, skill_id `cli-opencode`, family `cli`, category `cli-orchestrator`, sibling edges (weight 0.5) to all 4 existing cli-* skills, domains include `["cli", "delegation", "cross-ai", "spec-kit-runtime", "parallel-sessions"]`, intent_signals include `["opencode cli", "opencode run", "delegate to opencode"]`, derived block left empty (daemon populates on reindex). Deps: T09, T10.

### Phase 2.2: Stream B — Sibling edges + advisor wiring

- [ ] T12 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-claude-code/graph-metadata.json` (weight 0.5, context "CLI orchestrator peer"). Deps: T11.
- [ ] T13 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-codex/graph-metadata.json` (same shape). Deps: T11.
- [ ] T14 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-copilot/graph-metadata.json` (same shape). Deps: T11.
- [ ] T15 [P0] [P] Add cli-opencode sibling edge to `.opencode/skill/cli-gemini/graph-metadata.json` (same shape). Deps: T11.
- [ ] T16 [P1] (OPTIONAL per ADR-003) Add `opencode: [['cli-opencode', W]]` entry to `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:15` TOKEN_BOOSTS table. Weight per ADR-003 (0.4-0.6 conservative). Skip entirely if ADR-003 selected the "no boost" alternative. Deps: T11.
- [ ] T17 [P0] Run `bash .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` to validate every graph-metadata.json, regen `skill-graph.json` fallback, and reindex `skill-graph.sqlite`. Deps: T12, T13, T14, T15, T16.
- [ ] T18 [P0] Run `/doctor:skill-advisor:auto` to retune scoring tables. Verify cli-opencode is recommended for the 5 acceptance-scenario prompts at confidence ≥ 0.80. Verify no regression on the 4 existing cli-* siblings via `python3 skill_advisor_regression.py --dataset skill_advisor_regression_cases.jsonl > scratch/post-doctor-regression.log` and diff vs baseline. Deps: T17.

### Phase 2.3: Stream C — Changelog + READMEs

- [ ] T19 [P0] Run `/create:changelog cli-opencode --bump=major` to create the cli-opencode v1.0.0.0 changelog file. Use sk-doc compact format (single-skill initial release, <10 changes). Reference packet 047. Deps: T18.
- [ ] T20 [P1] (OPTIONAL) Run `/create:changelog cli-opencode --release` to publish GitHub release with annotated tag. Operator confirmation required for the `gh release create`. Deps: T19.
- [ ] T21 [P0] [P] Patch `.opencode/skill/README.md:44`: change "20 skill folders" → "21 skill folders". Deps: T11.
- [ ] T22 [P0] [P] Patch `.opencode/skill/README.md:54`: increment Key Statistics total "20" → "21". Deps: T11.
- [ ] T23 [P0] [P] Patch `.opencode/skill/README.md:57`: change CLI orchestrator skills row from "4 | cli-claude-code, cli-codex, cli-copilot, cli-gemini" to "5 | cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode". Deps: T11.
- [ ] T24 [P0] [P] Patch `.opencode/skill/README.md:134`: change "The four CLI skills" → "The five CLI skills" and add cli-opencode to the parenthetical list. Deps: T11.
- [ ] T25 [P0] [P] Patch `.opencode/skill/README.md` after line 151: insert new row in CLI Orchestrator Skills table — `| \`cli-opencode\` | 1.0.0 | Invokes OpenCode CLI for full plugin/skill/MCP runtime dispatch, parallel detached sessions, and cross-AI orchestration |`. Deps: T11.
- [ ] T26 [P0] [P] Patch `.opencode/skill/README.md` after line 201: insert tree entry — `├── cli-opencode/         # OpenCode CLI orchestrator` (alphabetical position between cli-gemini/ and mcp-chrome-devtools/). Deps: T11.
- [ ] T27 [P0] [P] Patch `.opencode/skill/README.md` after line 257: add row to Skill Folder Signals table — `| \`cli-opencode\` | Yes | Yes | No |`. Deps: T11.
- [ ] T28 [P0] [P] Patch `.opencode/skill/README.md` after line 509: add link in Related Documents section — `[cli-opencode SKILL.md](cli-opencode/SKILL.md)` matching existing pattern. Deps: T11.
- [ ] T29 [P0] [P] Patch `.opencode/README.md:57`: increment "Skills | 20" → "Skills | 21". Deps: T11.
- [ ] T30 [P0] [P] Patch `.opencode/README.md` after line 141: insert SKILLS OVERVIEW row — `| \`cli-opencode\` | OpenCode CLI orchestration for full plugin/skill/MCP runtime dispatch, parallel detached sessions, and cross-AI orchestration (v1.0.0) |`. Deps: T11.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T31 [P0] Run all 5 acceptance scenarios from spec.md §4.1 against the live runtime. Capture pass/fail per scenario in scratch/acceptance-scenarios.log. Deps: T18, T28, T30.
- [ ] T32 [P0] Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/ --strict`. Must exit 0 / 0 errors / 0 warnings. Deps: all prior.
- [ ] T33 [P0] Run `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py --validate-only`. Must exit 0. Deps: T18.
- [ ] T34 [P1] Run sk-doc DQI on the cli-opencode v1.0.0.0 changelog file. Score must be ≥ 90. Deps: T19.
- [ ] T35 [P0] Mark all 35 tasks `[x]` in this file with (verified) evidence. Mark all checklist items in checklist.md `[x]`. Populate implementation-summary.md from the stub. Deps: T31, T32, T33.
- [ ] T36 [P0] Final commit + push to main: spec packet docs (already there) + skill folder + sibling-edge patches + advisor patches + changelog + README patches. Tag `v047-cli-opencode-shipped`. Deps: T35.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 36 tasks marked `[x]` with `(verified)` evidence
- [ ] Strict spec validation 0/0 on this packet
- [ ] `python3 skill_graph_compiler.py --validate-only` passes
- [ ] `/doctor:skill-advisor:auto` retune produces non-empty diff for cli-opencode + no regression on the 4 existing cli-* siblings
- [ ] All 5 acceptance scenarios pass
- [ ] Changelog v1.0.0.0.md DQI ≥ 90
- [ ] Both READMEs verified at all 10 edit points
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
