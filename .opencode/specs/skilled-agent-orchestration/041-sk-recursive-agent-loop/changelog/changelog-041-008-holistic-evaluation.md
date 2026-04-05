# Changelog: 041/008-holistic-evaluation

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 008-holistic-evaluation — 2026-04-04

Transformed the sk-agent-improver evaluation from structural keyword-checking (~15-20% coverage) to a 5-dimension integration-aware scoring framework. Added two new scripts (integration scanner, dynamic profile generator), refactored three existing scripts for dimensional scoring, executed a repo-wide rename from `sk-recursive-agent` to `sk-agent-improver`, and rewrote all documentation and command surfaces to match the new capabilities.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/008-sk-recursive-agent-holistic-evaluation/`

---

## New Features (4)

### Integration surface scanner

**Problem:** The scorer had no awareness of how an agent connects to the rest of the system. Mirrors, commands, YAML workflows, skill references, and global docs were invisible to evaluation.

**Fix:** Added `scan-integration.cjs` (~240 lines) to discover all surfaces an agent touches: canonical file, runtime mirrors, commands, YAML workflows, skills, global docs, and skill advisor entries.

### Dynamic profile generator

**Problem:** Scoring profiles were hardcoded per target family. Adding a new target required manually writing a new profile.

**Fix:** Added `generate-profile.cjs` (~260 lines) to derive a scoring profile from any agent's own structure, extracting ALWAYS/NEVER/ESCALATE rules, output verification items, and capability/permission alignment checks.

### 5-dimension scoring framework

**Problem:** The original scorer checked only structural keywords on the prompt surface, missing rule coherence, integration consistency, output quality, and system fitness.

**Fix:** Extended `score-candidate.cjs` with a 5-dimension framework: structural integrity (0.20), rule coherence (0.25), integration consistency (0.25), output quality (0.15), and system fitness (0.15). Activated via `--dynamic` flag, backward compatible with legacy `--profile` mode.

### Per-dimension tracking and plateau stop

**Problem:** The reducer tracked only a single aggregate score. Dimensional regressions were invisible, and the stop condition could not detect per-dimension plateaus.

**Fix:** Extended `reduce-state.cjs` with per-dimension score tracking, dimensional dashboard sections, and a dimension plateau stop rule that fires when all dimensions show N consecutive identical scores.

---

## Changed (5)

### Repo-wide rename

**Problem:** The name `sk-recursive-agent` described the mechanism, not the purpose.

**Fix:** Renamed to `sk-agent-improver` across 187+ files and 1129+ occurrences. Agent renamed to `agent-improver`, command moved to `/improve:agent`, dispatch changed to `@agent-improver`. Zero stale references verified by fresh audit.

### Command rewrite

**Problem:** The command markdown was minimal and lacked the quality level of other spec_kit commands.

**Fix:** Rewrote `.opencode/command/improve/agent.md` to 430+ lines with Phase 0 verification, unified setup prompt, 5-dimension reference, workflow steps, and violation self-detection.

### YAML workflow rewrite

**Problem:** The auto and confirm YAML workflows did not follow spec_kit gold standard.

**Fix:** Rewrote both `improve_agent-improver_auto.yaml` and `_confirm.yaml` with user_inputs, field_handling, context_loading, evaluation_philosophy, phase descriptions, and approval gates.

### Agent file overhaul

**Problem:** The canonical agent definition lacked callout formatting, clear dividers, and integration-aware workflow steps.

**Fix:** Updated `.opencode/agent/agent-improver.md` with title rename, CRITICAL/IMPORTANT callouts, dividers, ASCII summary box, and integration-aware workflow step.

### sk-code-opencode script alignment

**Problem:** The 8 `.cjs` scripts did not follow sk-code-opencode JavaScript standard for headers and section separators.

**Fix:** Aligned all 8 scripts with box comment headers and numbered ALL-CAPS section separators.

---

## Documentation (3)

### Reference and asset enrichment

**Problem:** The 11 references and all assets predated the 5-dimension framework.

**Fix:** Enriched all 11 references with dynamic profiling, 5D scoring, and integration scanner content. Updated config, manifest, charter, and strategy assets. Created new `improvement_config_reference.md` and `integration_scanning.md` references.

### README expansion

**Problem:** The README covered only the Phase 001 capabilities.

**Fix:** Expanded README from 231 to 416 lines with full Phase 008 coverage including 5-dimension framework, dynamic profiling, integration scanning, and HVR compliance.

### Manual testing playbook

**Problem:** No testing playbook existed for the skill's 8 scripts and new capabilities.

**Fix:** Created 21 per-feature test scenarios across 6 categories with copy-pasteable verification commands and a root `MANUAL_TESTING_PLAYBOOK.md` with test matrix and failure triage.

---

<details>
<summary>Files Changed (40+)</summary>

| File | What changed |
| --- | --- |
| `sk-agent-improver/scripts/scan-integration.cjs` | New integration surface scanner. |
| `sk-agent-improver/scripts/generate-profile.cjs` | New dynamic profile generator. |
| `sk-agent-improver/scripts/score-candidate.cjs` | 5-dimension framework with `--dynamic` flag. |
| `sk-agent-improver/scripts/reduce-state.cjs` | Per-dimension tracking, dimensional dashboard, plateau stop. |
| `sk-agent-improver/scripts/run-benchmark.cjs` | `--integration-report` flag for integration consistency scoring. |
| `.opencode/agent/agent-improver.md` | Title, callouts, dividers, ASCII summary box, integration-aware workflow. |
| `.opencode/command/improve/agent.md` | Full rewrite to 430+ lines. |
| `.opencode/command/improve/assets/*.yaml` | Both workflows rewritten to spec_kit gold standard. |
| `sk-agent-improver/SKILL.md` | 5D framework, emoji rule markers, integration scanning. |
| `sk-agent-improver/README.md` | Expanded from 231 to 416 lines. |
| `sk-agent-improver/references/*.md` | All 11 references enriched. |
| `sk-agent-improver/assets/*.json` | Config, manifest, charter, strategy updated. |
| 187+ files | Repo-wide rename from sk-recursive-agent to sk-agent-improver. |

</details>

---

## Upgrade

No migration required. The rename was atomic and verified with zero stale references. Legacy `--profile` scoring mode remains backward compatible.
