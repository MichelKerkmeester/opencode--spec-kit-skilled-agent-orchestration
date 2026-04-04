---
title: "Changelog: sk-agent-improver program [041]"
description: "Chronological changelog for Packet 041 covering the full sk-agent-improver program across 11 phases — from evaluator-first MVP through holistic 5-dimension evaluation, self-test, fixes, and advisor routing sync."
importance_tier: "high"
contextType: "implementation"
---
# Changelog

## 2026-04-04 — Phase 011: Skill Advisor Routing + README Sync

### Changed
- Skill README: sk-agent-improver version bumped from 0.1.0.0 to 1.0.0.0 with updated description
- Skill advisor (Public): added 7 INTENT_BOOSTERS, 13 PHRASE_INTENT_BOOSTERS, 8 COMMAND_BRIDGES for Phase 008+ capabilities
- Skill advisor (Barter): added 7 COMMAND_BRIDGES and 2 PHRASE_INTENT_BOOSTERS for /improve:prompt and /create:* commands
- Root README.md: added Context-Prime and Agent-Improver to Agent Network section, rewrote Improve Agent command description
- 5 command README.txt files updated across all runtimes (root, spec_kit, create, improve, memory)

### Verification
- `skill_advisor.py "5-dimension evaluation"` → sk-agent-improver at 0.92 confidence
- `skill_advisor.py "/improve:agent"` → command-improve-agent at 0.95 confidence
- `skill_advisor.py "score agent"` → sk-agent-improver at 0.89 confidence
- All /create:* commands routed correctly

---

## 2026-04-04 — Phase 010: Self-Test Fixes + Reducer Improvements

### Fixed
- Stale command path in `agent-improver.md`: `/improve:agent-improver` → `/improve:agent`, `.opencode/command/spec_kit/agent-improver.md` → `.opencode/command/improve/agent.md`
- Reducer family hardcoding: `inferFamily()` no longer defaults everything to `session-handover` — uses profileId for non-handover/context-prime targets
- Accepted counting: `candidate-acceptable` and `candidate-better` recommendations now counted as accepted in dashboard
- Gemini mirror: wrong canonical path reference (`.agents/agents/*.md` → `.gemini/agents/*.md`)
- Codex TOML: wording inconsistency ("leaf-only mutator" → "leaf mutator")

### Added
- Configurable plateau window via `stopRules.plateauWindow` in config (default 3, backward compatible)
- `plateauWindow` field documented in `improvement_config_reference.md`

### Promoted (from Phase 009 candidates)
- HALT CONDITION block in Operating Rules (structured error JSON for missing inputs)
- Merged two checklist blocks into one unified verification list
- Self-Validation converted from numbered YES/NO to checkbox format with input-check first
- 4th anti-pattern: "Never proceed when required inputs are missing"
- Scan report provenance note in Step 2 body text
- Summary box Step 2 label updated to include integration scan report

### Verification
- Dynamic scorer on agent-improver: 100 across all 5 dimensions (resource-refs-valid: 4/4)
- Reducer family: `agent-improver` (not `session-handover`)
- Reducer accepted count: 3 (not 0)
- Integration scanner: all mirrors aligned
- All 8 scripts parse OK

---

## 2026-04-04 — Phase 009: Agent-Improver Self-Test

### Added
- First self-referential test run: `/improve:agent` targeting `agent-improver.md` itself
- 3-iteration improvement loop with dynamic 5D scoring in `:confirm` mode
- Runtime artifacts: ledger, dashboard, registry, 3 candidates, integration report, dynamic profile

### Observations
- Baseline score: 99 (systemFitness=93 due to invalid `/improve:agent-improver` resource ref)
- Iteration 2: fixed resource ref to `/improve:agent` → score 100 across all 5 dimensions
- Iteration 3: confirmed plateau at 100, loop exited via max-iterations
- Plateau detector did not fire: systemFitness had only 2 consecutive identical scores (93→100→100), not 3
- Integration scanner discovered 9 surfaces for agent-improver (canonical, 3 mirrors, 1 command, 2 YAML, 1 skill, skill advisor)
- Dynamic profile extracted 11 rules (6 always + 5 never), 7 output checks, 6 structural checks

### Verification
- All 8 scripts: parse OK against agent-improver target
- 3 candidates generated, scored, reduced
- Dashboard + registry present with dimensional progress
- No infra_failure in any script output

---

## 2026-04-04 — Phase 008: Holistic Agent Evaluation + Rename

### Added
- `scan-integration.cjs` — discovers all integration surfaces an agent touches (canonical, mirrors, commands, YAML, skills, global docs)
- `generate-profile.cjs` — derives scoring profile from any agent's own rules (ALWAYS/NEVER/ESCALATE IF, output verification, capability scan)
- 5-dimension scoring framework in `score-candidate.cjs` with `--dynamic` flag (structural 0.20, ruleCoherence 0.25, integration 0.25, outputQuality 0.15, systemFitness 0.15)
- Integration consistency scoring in `run-benchmark.cjs` via `--integration-report` flag
- Per-dimension tracking + plateau stop in `reduce-state.cjs`
- `integration_scanning.md` reference document
- `improvement_config_reference.md` field-level config documentation
- Manual testing playbook: 21 scenarios across 6 categories with verification one-liners
- `improve/README.txt` command group index in all 4 runtimes

### Changed
- SKILL.md: added 5-dimension framework to HOW IT WORKS, RULES emoji markers, integration scanning intent signal
- README.md: expanded from 231 to 416 lines with full Phase 008 coverage
- All 11 references enriched with Phase 008 content (dynamic profiling, 5D scoring, integration scanner)
- All assets updated (config dimension weights, manifest dynamic profile support, charter 5D principle, strategy dimensional scores)
- Agent `agent-improver.md`: title, CRITICAL/IMPORTANT callouts, dividers, ASCII summary box, integration-aware workflow
- Command `agent.md`: full rewrite to 430+ lines matching prompt.md quality (Phase 0, Setup, violations)
- YAML workflows: rewritten to spec_kit gold standard (user_inputs, field_handling, context_loading, approval gates)
- All 8 .cjs scripts aligned with sk-code--opencode (box headers, section separators)
- All 12 create command YAMLs aligned with spec_kit gold standard

### Renamed
- Skill: `sk-recursive-agent` -> `sk-agent-improver` (187+ files, 1129+ occurrences)
- Agent: `recursive-agent` -> `agent-improver` (all 5 runtimes)
- Command: `/spec_kit:recursive-agent` -> `/improve:agent`
- Dispatch: `@recursive-agent` -> `@agent-improver`
- YAMLs: `spec_kit_recursive-agent_*` -> `improve_agent-improver_*`

### Verification
- `package_skill.py --check`: PASS
- All 8 scripts parse: OK
- Dynamic scorer (handover): 100 across all 5 dimensions
- Rename audit: 25/25 checks pass, 0 stale references
- Runtime mirror audit: all 5 runtimes clean

---

## 2026-04-04 — Phase 007: Wording Alignment

### Changed
- Wording-only cleanup across skill docs, runtime mirrors, wrapper prompts, and active packet docs
- Historical research and memory artifacts renamed to current wording

---

## 2026-04-04 — Phase 006: Command Rename

### Changed
- Command entrypoint renamed to `/spec_kit:recursive-agent` (later renamed again in Phase 008)
- Canonical command markdown, YAML workflow assets, and wrapper TOMLs renamed
- Runtime docs and packet history updated to new command path

---

## 2026-04-03 — Phase 005: Package and Runtime Alignment

### Changed
- Stricter sk-doc template fidelity for the skill package
- Runtime mutator renamed from `agent-improvement-loop` to `recursive-agent` (later renamed again in Phase 008)
- `.agents` mirror resynchronized with script-parse verification

---

## 2026-04-03 — Phase 004: Promotion Verification

### Added
- Winning handover candidate score with explicit repeatability evidence
- Guarded promotion for canonical handover target (verification-only, immediately rolled back)

### Verification
- Promotion/validation/rollback cycle completed end-to-end

---

## 2026-04-03 — Phase 003: Documentation Alignment

### Changed
- SKILL.md, README, command, agent aligned with sk-doc template structure
- All markdown references and assets follow sk-doc OVERVIEW structure
- Package validation via `package_skill.py --check`

---

## 2026-04-03 — Phase 002: Full-Skill Expansion

### Added
- `run-benchmark.cjs` — fixture benchmark runner with profile-based scoring
- Target profiles for `handover` and `context-prime` with fixture catalogs
- Cross-target reducer reporting and stop status
- Repeatability-gated promotion checks

---

## 2026-04-03 — Phase 001: Evaluator-First MVP

### Added
- `score-candidate.cjs` — deterministic prompt-surface scorer
- `reduce-state.cjs` — ledger reducer and dashboard generator
- `promote-candidate.cjs` — guarded canonical promotion helper
- `rollback-candidate.cjs` — canonical rollback helper
- `check-mirror-drift.cjs` — derived-surface drift report
- Improvement charter, strategy, config, and manifest templates
- Proposal-only execution mode with append-only ledger
- Canonical handover target (`.opencode/agent/handover.md`)

### Files Changed (Phase 001)

| File | Action | Description |
| --- | --- | --- |
| `.opencode/skill/sk-agent-improver/` | Created | Full skill package |
| `.opencode/agent/agent-improver.md` | Created | Canonical mutator agent |
| `.opencode/command/improve/agent.md` | Created | Command entrypoint |

### Verification
- Skill advisor recognition: 0.95 confidence
- Proposal-only mode verified
- Guarded promotion/rollback proven
- Mirror drift report: 9/9 surfaces matched
