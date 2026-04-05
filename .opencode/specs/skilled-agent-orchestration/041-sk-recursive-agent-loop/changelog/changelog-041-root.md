# Changelog: 041-sk-recursive-agent-loop (Root)

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 041-sk-recursive-agent-loop — 2026-04-04

This packet delivered the sk-agent-improver skill across 11 phases, starting from a proposal-only evaluator-first MVP and ending with a holistic 5-dimension integration-aware scoring framework, a self-referential test pass, fixes promoted from that test, and full skill advisor routing. The skill can now evaluate any agent across structural integrity, rule coherence, integration consistency, output quality, and system fitness without LLM-as-judge scoring. The work also included a repo-wide rename from `sk-recursive-agent` to `sk-agent-improver` and from `/spec_kit:recursive-agent` to `/improve:agent`, touching 187+ files and 1129+ occurrences.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/` (Level 3)

---

## Evaluator-First Architecture (4)

These phases built the core loop: scorer, reducer, promoter, rollback, benchmarks, and the first verified promotion cycle.

### Proposal-only loop with deterministic scoring

**Problem:** There was no systematic way to evaluate or improve agent prompt files. Manual review was inconsistent and could not track improvement over time.

**Fix:** Phase 001 created the evaluator-first MVP with `score-candidate.cjs`, `reduce-state.cjs`, `promote-candidate.cjs`, `rollback-candidate.cjs`, and `check-mirror-drift.cjs`. The loop operates in proposal-only mode by default so the evaluator must prove itself before any canonical prompt mutation is allowed.

### Multi-target benchmark runner

**Problem:** The MVP only evaluated one target. Expanding to additional agents required a runner that could handle target-specific profiles and fixtures.

**Fix:** Phase 002 added `run-benchmark.cjs` with profile-based scoring, target profiles for `handover` and `context-prime`, cross-target reducer reporting, and repeatability-gated promotion checks.

### Documentation alignment

**Problem:** The new skill package did not yet follow sk-doc template structure for SKILL.md, README, command docs, and reference assets.

**Fix:** Phase 003 aligned all markdown and package surfaces with sk-doc template standards, verified by `package_skill.py --check`.

### Guarded promotion verification

**Problem:** Promotion needed end-to-end proof before the skill could be trusted to touch canonical files.

**Fix:** Phase 004 ran a full promotion/validation/rollback cycle with explicit repeatability evidence, confirming the guarded path works as designed.

---

## 5-Dimension Holistic Evaluation (1)

The single largest phase in the program, transforming evaluation coverage from roughly 15-20% to full integration-aware scoring.

### Integration-aware 5-dimension scoring framework

**Problem:** The original scorer only checked structural keywords on the prompt surface, covering roughly 15-20% of what makes an agent correct. Integration consistency, rule coherence, output quality, and system fitness were invisible.

**Fix:** Phase 008 added `scan-integration.cjs` (discovers all surfaces an agent touches), `generate-profile.cjs` (derives scoring profile from any agent's own rules), and a 5-dimension framework in `score-candidate.cjs` with structural (0.20), ruleCoherence (0.25), integration (0.25), outputQuality (0.15), and systemFitness (0.15) weights. The reducer gained per-dimension tracking and dimension plateau stop rules.

### Repo-wide rename to sk-agent-improver

**Problem:** The original name `sk-recursive-agent` described the mechanism, not the purpose. The command lived under `spec_kit` instead of its own namespace.

**Fix:** Phase 008 renamed the skill to `sk-agent-improver`, the agent to `agent-improver`, the command to `/improve:agent`, and the dispatch to `@agent-improver` across 187+ files. A fresh audit confirmed zero stale references.

### Documentation and testing rewrite

**Problem:** Skill docs, command files, YAML workflows, and the testing playbook had not been updated for 5-dimension scoring, dynamic profiling, or the rename.

**Fix:** Phase 008 rewrote the command to 430+ lines, expanded the README from 231 to 416 lines, enriched all 11 references and all assets, created a 21-scenario manual testing playbook, and aligned all 12 create command YAMLs with spec_kit gold standard.

---

## Self-Test and Fixes (2)

The skill evaluated itself and then fixed the issues it found.

### Self-referential test of the skill on itself

**Problem:** The skill had never been tested against its own agent file, leaving a gap in confidence about edge cases and self-referential correctness.

**Fix:** Phase 009 ran `/improve:agent` targeting `agent-improver.md` in `:confirm` mode for 3 iterations. The baseline scored 99 (systemFitness=93 due to an invalid resource reference). Iteration 2 fixed the reference and reached 100 across all 5 dimensions. The self-test also surfaced 5 actionable issues and confirmed the proposal-only boundary works correctly when the mutator reads its own definition.

### Promoted fixes from self-test findings

**Problem:** The self-test discovered 5 concrete issues: a stale command path, reducer family hardcoding, accepted-count miscounting, a wrong Gemini mirror path, and a Codex TOML wording inconsistency.

**Fix:** Phase 010 fixed all 5 issues, added a configurable `plateauWindow` setting (default 3), and promoted 6 candidate improvements from Phase 009 including structured error JSON for missing inputs, merged checklist blocks, checkbox-format self-validation, and updated summary box labels. Post-fix dynamic scoring confirmed 100 across all 5 dimensions.

---

## Skill Advisor and README Sync (1)

### Routing and discovery updates

**Problem:** The skill advisor and root README had not been updated for Phase 008+ capabilities. The new 5-dimension evaluation, dynamic profiling, and integration scanning were not routable.

**Fix:** Phase 011 added 7 intent boosters, 13 phrase intent boosters, and 8 command bridges to the skill advisor. The skill README was version-bumped from 0.1.0.0 to 1.0.0.0, and the root README gained Agent-Improver entries in the Agent Network section. Verification confirmed routing at 0.89-0.95 confidence across representative queries.

---

## Package and Runtime Alignment (3)

These phases handled template fidelity, command path changes, and wording consistency.

### Package and runtime alignment

**Problem:** The skill package had template fidelity gaps, and the runtime mutator name did not match the evolving naming convention.

**Fix:** Phase 005 enforced stricter sk-doc template fidelity and renamed the runtime mutator from `agent-improvement-loop` to `recursive-agent`, resynchronizing the `.agents` mirror with script-parse verification.

### Command entrypoint rename

**Problem:** The command entrypoint needed to move to a more discoverable path.

**Fix:** Phase 006 renamed the command entrypoint to `/spec_kit:recursive-agent`, updating canonical markdown, YAML workflow assets, and wrapper TOMLs across all runtimes.

### Wording alignment

**Problem:** Inconsistent wording across skill docs, runtime mirrors, wrapper prompts, and active packet docs after the earlier renames.

**Fix:** Phase 007 cleaned up wording across all surfaces and renamed historical research and memory artifacts to match current terminology.

---

<details>
<summary>Technical Details: Files Changed (representative areas)</summary>

### Scripts

| File | Changes |
| ---- | ------- |
| `sk-agent-improver/scripts/score-candidate.cjs` | Deterministic scorer, later 5-dimension framework with `--dynamic` flag |
| `sk-agent-improver/scripts/reduce-state.cjs` | Ledger reducer, dashboard, later per-dimension tracking and plateau stop |
| `sk-agent-improver/scripts/promote-candidate.cjs` | Guarded canonical promotion helper |
| `sk-agent-improver/scripts/rollback-candidate.cjs` | Canonical rollback helper |
| `sk-agent-improver/scripts/check-mirror-drift.cjs` | Derived-surface drift report |
| `sk-agent-improver/scripts/run-benchmark.cjs` | Fixture benchmark runner with profile-based scoring |
| `sk-agent-improver/scripts/scan-integration.cjs` | Integration surface scanner (Phase 008) |
| `sk-agent-improver/scripts/generate-profile.cjs` | Dynamic profile generator (Phase 008) |

### Agent and Command

| File | Changes |
| ---- | ------- |
| `.opencode/agent/agent-improver.md` | Canonical mutator agent, later 5D workflow and integration-aware steps |
| `.opencode/command/improve/agent.md` | Command entrypoint, later full rewrite to 430+ lines |
| `.opencode/command/improve/assets/*.yaml` | Auto and confirm YAML workflows |

### Skill Package

| File | Changes |
| ---- | ------- |
| `sk-agent-improver/SKILL.md` | Skill definition with 5D framework, emoji rule markers, integration scanning |
| `sk-agent-improver/README.md` | Expanded from 231 to 416 lines with full Phase 008 coverage |
| `sk-agent-improver/references/*.md` | 11 reference documents enriched across all phases |
| `sk-agent-improver/assets/*.json` | Config, manifest, charter, strategy templates |

</details>

---

## Upgrade

No migration required. The rename from `sk-recursive-agent` to `sk-agent-improver` was completed within Phase 008 with zero stale references remaining. All runtime mirrors, commands, YAML workflows, and skill advisor routing were updated atomically.
