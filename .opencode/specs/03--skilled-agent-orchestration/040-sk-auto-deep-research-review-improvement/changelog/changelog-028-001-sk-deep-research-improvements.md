# Changelog: 028/001-sk-deep-research-improvements

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 001-sk-deep-research-improvements — 2026-04-03

This phase took the deep-research packet from a partly aligned documentation pass to a fully executable and verified contract. It tightened lineage and reducer semantics, synchronized all runtime mirrors and workflow assets to the same packet model, added the missing machine-readable helper surfaces, and closed the phase packet with passing focused tests plus strict validation.

> Spec folder: `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/001-sk-deep-research-improvements/`

---

## Research Contract and State Model (3)

### Canonical packet state is now explicit instead of inferred

**Problem:** The research loop was still relying on scattered wording for lineage, pause behavior, canonical artifact names, and reducer ownership, which made the packet harder to reason about and easier to drift across references and runtime mirrors.

**Fix:** The phase aligned the live contract around `deep-research-config.json`, `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, and `research/.deep-research-pause`. It also made lifecycle branches such as `resume`, `restart`, `fork`, and `completed-continue` explicit in the docs, config, and mirrors.

### Reducer-owned surfaces are now treated as system outputs

**Problem:** Strategy, registry, and dashboard behavior could still read as if agents were directly owning those files, which is exactly the kind of ambiguity that creates packet drift later.

**Fix:** The phase clarified that iteration files and JSONL records are the primary agent outputs, while the workflow reducer owns synchronized refreshes of `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`.

### The runtime capability matrix now exists in both human and machine-readable forms

**Problem:** Runtime parity was described in prose, but there was no authoritative helper surface an implementation or test could consume directly.

**Fix:** The phase added a human-readable capability matrix reference plus a machine-readable runtime matrix, and wired the deep-research config and docs to point at the same source-of-truth paths.

---

## Executable Helpers and Verification (3)

### The missing helper layer now actually exists

**Problem:** The earlier pass still left two real executable gaps open: a reducer surface that could regenerate synchronized packet outputs, and a runtime capability lookup surface that could resolve parity data programmatically.

**Fix:** The phase added `runtime-capabilities.cjs` and `reduce-state.cjs`, giving the packet a live capability resolver and an idempotent reducer that reads packet state and writes synchronized outputs.

### Packaging now matches the repo's ESM boundary

**Problem:** The first implementation of those helpers used CommonJS syntax inside the `.opencode` package, which is loaded as ESM by default and therefore failed under Node and Vitest.

**Fix:** The helpers were moved to `.cjs`, every reference was updated, and the command/runtime contract now points to the executable helper names that actually work in this package boundary.

### Contract drift is now guarded by focused tests

**Problem:** Without targeted tests, doc parity and reducer behavior could drift back out of sync while still looking plausible on a manual read.

**Fix:** The phase added focused Vitest coverage for deep-research contract parity and reducer idempotency, then used those tests to drive the final packaging and schema fixes to green.

---

## Runtime and Packet Closeout (3)

### Runtime mirrors now agree on the same lifecycle model

**Problem:** OpenCode, Claude, Gemini, Codex, and the legacy `.agents` wrapper can quietly diverge if lifecycle and packet-file expectations are patched separately.

**Fix:** All runtime mirrors were updated together so they point at the same state log, findings registry, reducer-owned surfaces, and lifecycle branch vocabulary.

### Workflow YAML and operator docs now teach the same behavior

**Problem:** A packet is hard to operate safely when the command YAML, quick references, and manual testing playbook describe slightly different reducer, pause, or lifecycle rules.

**Fix:** The phase synchronized the auto/confirm YAML assets, references, README, SKILL, and the relevant DR-008 playbook scenario so they all describe the same deep-research packet behavior.

### The phase packet now closes with evidence, not deferrals

**Problem:** The packet originally recorded reducer-test and portability work as follow-on tasks, which meant the phase could validate structurally while still not being truly done.

**Fix:** The packet docs were updated after the executable surfaces passed. `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` now reflect a fully complete Phase 1 with all tasks marked done and strict validation passing cleanly.

---

<details>
<summary>Files Changed (full scoped list)</summary>

### Deep-Research Skill, References, and Assets

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-research/README.md` | Reframed the skill around the canonical packet contract and machine-readable capability paths. |
| `.opencode/skill/sk-deep-research/SKILL.md` | Locked lifecycle vocabulary, reducer ownership, and helper-surface references to the live contract. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Tied convergence guidance to the reducer-owned contract. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Documented lifecycle branches, reducer sequencing, and parity source-of-truth references. |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Added canonical pause-sentinel, lifecycle, and capability-matrix guidance. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Added lineage schema, reducer contract details, and explicit machine-readable parity references. |
| `.opencode/skill/sk-deep-research/references/capability_matrix.md` | Added the runtime parity matrix and packet-file invariants. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Added lineage mode enum, pause sentinel path, helper paths, and machine-readable capability metadata. |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Aligned the dashboard contract to reducer-owned synchronization. |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Clarified machine-owned sections and capability-resolver references. |
| `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json` | Added the machine-readable runtime capability matrix. |

### Executable Helper Surfaces

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs` | Added a CommonJS helper that resolves runtime capability records from the machine-readable matrix. Aligned to sk-code--opencode standards (box header, section dividers, JSDoc). |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Added the reducer helper that regenerates findings registry, strategy, and dashboard outputs from packet state. Aligned to sk-code--opencode standards (box header, section dividers, JSDoc, regex fix). |

### Workflow and Runtime Mirrors

| File | What changed |
|------|--------------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Updated reducer step execution, lifecycle handling, and helper-script references for auto mode. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Mirrored the same reducer and lifecycle contract in confirm mode. |
| `.opencode/agent/deep-research.md` | Aligned the OpenCode runtime mirror to the reducer-owned packet model and lifecycle branches. |
| `.claude/agents/deep-research.md` | Aligned the Claude runtime mirror to the same packet model. |
| `.gemini/agents/deep-research.md` | Aligned the Gemini runtime mirror to the same packet model and restored the correct runtime-path convention. |
| `.codex/agents/deep-research.toml` | Aligned the Codex runtime mirror to the same packet model. |
| `.agents/agents/deep-research.md` | Aligned the compatibility wrapper to the same packet model. |

### Manual Testing Playbook

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md` | Updated DR-008 summary wording to the reducer-refresh contract. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md` | Updated the concrete DR-008 scenario to the reducer-refresh contract and `.cjs` helper path. |

### Focused Verification

| File | What changed |
|------|--------------|
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Added parity coverage for docs, runtime mirrors, command assets, and capability-matrix surfaces. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Added reducer idempotency and packet-integrity coverage. |

### Phase Packet

| File | What changed |
|------|--------------|
| `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/001-sk-deep-research-improvements/spec.md` | Updated scope, requirements, status, and success criteria to reflect true Phase 1 completion. |
| `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/001-sk-deep-research-improvements/plan.md` | Updated the plan and test strategy to include helper surfaces and focused Vitest verification. |
| `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/001-sk-deep-research-improvements/tasks.md` | Marked all tasks complete and closed the completion criteria. |
| `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/001-sk-deep-research-improvements/implementation-summary.md` | Recorded the final completion narrative and verification evidence. |

</details>

---

## sk-code--opencode Alignment (2)

### Executable helpers now follow OpenCode JavaScript style standards

**Problem:** Both `.cjs` helper scripts (`reduce-state.cjs`, `runtime-capabilities.cjs`) were missing the P0-required box-drawing file header and numbered section dividers. Exported functions had no JSDoc documentation.

**Fix:** Added box-drawing headers, numbered section dividers (`IMPORTS`, `HELPERS`/`CONSTANTS`, `PARSERS`/`CORE LOGIC`, `CLI ENTRY POINT`, `EXPORTS`), and JSDoc on all exported functions. The alignment verifier, Vitest suites, and CLI entry points all pass after the changes.

### Dead regex syntax in extractSection was replaced with a correct JS pattern

**Problem:** `reduce-state.cjs` used `\Z` (a Perl/Ruby end-of-string anchor) in a JavaScript regex where it is treated as a literal 'Z'. This meant the last section of any markdown file could not be extracted — the bug was masked because fallback logic covered the affected call sites.

**Fix:** Replaced the regex with `(?:^|\n)##\s+HEADING\s*\n([\s\S]*?)(?=\n##\s|$)` using the `i` flag only (no `m` flag), so `$` correctly anchors to end-of-string and the last section is now extractable.

---

## Manual Testing Playbook Alignment (2)

### Automated test cross-reference section now maps to the live Vitest suites

**Problem:** Section 13 of the root playbook still stated "no dedicated automated test suite was found," even though Phase 1 added two focused Vitest suites covering contract parity and reducer behavior.

**Fix:** Replaced the placeholder text with a table mapping `deep-research-contract-parity.vitest.ts` and `deep-research-reducer.vitest.ts` to the scenarios they cover (DR-007, DR-008, DR-024), including the exact run command.

### DR-024 now references the reducer as the dashboard implementation path

**Problem:** The DR-024 scenario (dashboard generation after iteration) only searched for `step_generate_dashboard` in the YAML workflows and did not reference the reducer script that actually generates the dashboard content.

**Fix:** Added `reduce-state.cjs` and the reducer Vitest suite to DR-024's implementation anchors. Extended the command sequence to verify `step_reduce_state` in the YAML and `renderDashboard` in the reducer script. Updated expected signals to note dashboard generation is reducer-owned and idempotent.

---

<details>
<summary>Files Changed — sk-code--opencode and playbook alignment</summary>

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Box header, section dividers, JSDoc on exports, regex bug fix in `extractSection` |
| `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs` | Box header, section dividers, JSDoc on exports |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md` | Section 13 updated with automated test cross-reference table |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md` | Added reducer script and Vitest suite to anchors and command sequence |

</details>

---

## Upgrade

No migration is required for consumers of the shipped deep-research packet. The main practical change is that the packet contract is now both clearer and safer to maintain: helper execution, reducer refresh, runtime parity, and packet closeout all point at the same live surfaces.
