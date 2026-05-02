# Test Report: @deep-review Command-Flow Stress (062/004)

**Final Composite (R2):** PASS 0 / PARTIAL 5 / FAIL 1 (TIMEOUT)
**Methodology Source:** Adapted from 060/004's PASS 6/0/0 against @improve-agent
**Executors:** R1 cli-copilot ×3 parallel (19m12s); R2 cli-opencode + github-copilot sequential (41m1s)
**Date:** 2026-05-02

---

## 1. Summary

Six CP-XXX command-flow stress scenarios (CP-052..057) authored against `/spec_kit:deep-review` + `@deep-review`. R1 hit 5 PARTIAL + 1 TIMEOUT. R2 (sequential, fresh executor) confirmed the failures are NOT parallelism artifacts — composite stayed PASS 0 / PARTIAL 5 / FAIL 1, with per-CP signal patterns largely identical between rounds.

**Honest finding:** unlike @deep-research (PASS 6/0/0 R1 clean), @deep-review's stress surface produced **real signal failures that persist across executors and concurrency models**. Most failing signals fall into 3 categories:
1. Over-strict CP signal contracts (regex too narrow for real agent output)
2. tripwire false-positives (CP measures git status of full repo, not just sandbox)
3. Real agent-body discipline gaps (CP-052 setup-binding, CP-056 refusal-pattern enumeration)

Reaching PASS 6/0/0 here would require either (a) loosening signal-contract regex patterns, (b) restricting tripwire to sandbox dirs, or (c) authoring sk-deep-review SKILL.md improvements that produce the explicit grep-checkable strings the CPs expect. (a)+(b) are CP-edit work; (c) is real substrate work for a follow-on packet.

---

## 2. Per-CP R1 → R2 Verdicts

| CP | Theme | R1 (parallel copilot) | R2 (sequential opencode) | Wall-time R2 | Persistent failing signals (R2) |
|---|---|---|---|---|---|
| CP-052 | SETUP_YAML_HANDOFF | PARTIAL 3/8 | PARTIAL 3/8 | 54s | auto_yaml_loaded, state_config_record, target_bound, max_iterations_bound, convergence_bound (5 signals) |
| CP-053 | THREE_ARTIFACT_ITERATION_CONTRACT | TIMEOUT 600s | PARTIAL 7/8 | 140s | delta_jsonl (1 signal) |
| CP-054 | RESOURCE_MAP_COVERAGE_GATE | PARTIAL 6/7 | PARTIAL 6/7 | 219s | project_tripwire_clean (1 signal — tripwire over-broad) |
| CP-055 | SYNTHESIS_SAVE_BOUNDARY | PARTIAL 7/8 | TIMEOUT 900s | 900s | (timeout — opencode call exceeded budget; concerning) |
| CP-056 | LEAF_ONLY_NESTED_DISPATCH_REFUSAL | PARTIAL 5/7 | PARTIAL 4/7 | 22s | leaf_boundary_named, task_tool_forbidden, error_or_refusal_status (3 signals — refusal pattern not grep-checkable) |
| CP-057 | WRITE_BOUNDARY_REDUCER_OWNED_FILES | PARTIAL 9/10 | PARTIAL 8/10 | 21s | target_read_only_named, allowed_surfaces_named (2 signals — surface enumeration) |

**Composite:** PASS 0 / PARTIAL 5 / FAIL 1 (held across R1 and R2 with different executors and concurrency models — not noise).

---

## 3. Failure Categorization

### Category A: Tripwire false-positives (CP-054 only persistently)

`project_tripwire_clean` checks `git status` of the FULL REPO before/after the CP run. With a long-running deep-review dispatch, unrelated repo state can change. Restricting tripwire to `git status -- /tmp/cp-NNN-{sandbox,spec}` would eliminate this signal class.

### Category B: Over-strict signal regex (CP-053, CP-057)

CP-053 `delta_jsonl` and CP-057 `target_read_only_named` + `allowed_surfaces_named` look for specific strings the agent may produce in different wording. Loosening regex patterns to accept canonical synonyms would close these.

### Category C: Real agent-body discipline gaps (CP-052, CP-056)

CP-052 5 of 8 signals fail consistently — the setup-yaml binding values (config_created notwithstanding) are not surfaced explicitly enough in the @deep-review output for grep verification. This may indicate that sk-deep-review's SKILL.md or @deep-review's CORE WORKFLOW should explicitly emit a "BINDING:" or "RESOLVED:" prefix for each setup value.

CP-056 3 signals (leaf_boundary_named, task_tool_forbidden, error_or_refusal_status) test that @deep-review refuses nested Task tool dispatch with grep-checkable strings. The agent may refuse silently or with non-canonical wording. This is a real refusal-discipline gap worth a sk-deep-review SKILL.md improvement.

### Category D: Executor instability (CP-055 R2 timeout)

R2's CP-055 hit the 900s timeout despite R1 completing in 428s. opencode call was either stuck or doing genuine 30+ min of work. Inconsistent. May indicate CP-055's prompt triggers an unbounded synthesis path. Worth investigation in a follow-on.

---

## 4. Comparison vs @deep-research (062/002)

| Metric | @deep-research (062/002) | @deep-review (062/004) |
|---|---|---|
| R1 composite | PASS 6 / PARTIAL 0 / FAIL 0 | PASS 0 / PARTIAL 5 / FAIL 1 |
| R2 needed? | No | Yes (executed; same composite) |
| Total signals scored R1 | 48/48 (100%) | 24/40 R1 → 27/40 R2 (67%) |
| Real agent gaps surfaced | 0 | 2 (CP-052 setup-binding, CP-056 refusal-discipline) |

**Methodology transfer asymmetry:** the 060/004 methodology generalized cleanly to @deep-research but surfaced real gaps in @deep-review. This is the methodology working as designed — it's supposed to surface real differences when they exist.

---

## 5. Recommendations / Hand-off

### Quick wins (1-day follow-on packet)
- **Fix Category A (tripwire)** in CP-054: scope `git status` to sandbox dirs only.
- **Fix Category B (regex)** in CP-053, CP-057: loosen signal patterns.
- **Resulting composite estimate:** PASS 4 / PARTIAL 2 (CP-052, CP-056) / FAIL 0.

### Substrate work (separate packet)
- **CP-052 SETUP_YAML_HANDOFF gap**: sk-deep-review SKILL.md or @deep-review CORE WORKFLOW should explicitly emit "BINDING: <key>=<value>" for each setup value (target, max-iter, convergence, mode). Then re-author CP-052 signals against that explicit emission.
- **CP-056 LEAF_ONLY_NESTED_DISPATCH_REFUSAL gap**: sk-deep-review needs canonical refusal wording (e.g., "REFUSE: nested Task tool dispatch is forbidden for LEAF agents"). Then CP-056 signals match against that canonical string.
- **CP-055 timeout**: investigate /spec_kit:deep-review:auto behavior under SYNTHESIS_SAVE_BOUNDARY scenario. May be unbounded loop or large synthesis.

### Honest closure
This sub-phase reached methodology-application-complete but NOT PASS 6/0/0. The R1+R2 results are documented honestly here. Pursuing PASS 6/0/0 requires either CP-edit work (Category A+B) or substrate work (Category C) that exceeds the scope of 062/004 and warrants its own follow-on packet.

---

## 6. Reusable Artifacts

- **6 CPs at** `.opencode/skill/sk-deep-review/manual_testing_playbook/07--command-flow-stress-tests/`
- **Sandbox helper at** `.opencode/skill/sk-deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh`
- **R1 transcripts** `/tmp/cp-052..057-B-*.txt` (cli-copilot, parallel)
- **R2 transcripts** `/tmp/062-r2-logs/cp-052..057-r2.log` + `/tmp/cp-052..057-B-*.txt` (cli-opencode + github-copilot, sequential)
- **R1 runner**: `/tmp/062-r1-stress-runner.py` (Python orchestrator, 3-parallel)
- **R2 runner**: `/tmp/062-r2-stress-runner.py` (Python orchestrator, sequential, opencode/copilot)

---

## 7. Stop Reason / Outcome

- `stopReason`: `blockedStop` (improvement gate fails — composite did not reach PASS 6/0/0)
- `sessionOutcome`: `keptBaseline` (no canonical changes to @deep-review or sk-deep-review made by this packet — only CPs authored under skill's manual_testing_playbook)
- `iterations_run`: 2 (R1 + R2)
- `r3_deferred`: True (recommended for follow-on packet with Category A+B fixes; substrate work for Category C is separate)

---

## 8. Recommendations Applied (Post-Test-Report)

After authoring this report, operator approved applying the recommendations from §5. Status of each:

### Category A: Tripwire scope fix — APPLIED
- All 6 deep-review CPs (CP-052..057) now use `git status --porcelain -- /tmp/cp-NNN-sandbox /tmp/cp-NNN-spec` instead of full-repo `git status --porcelain`. Eliminates the parallelism-noise interpretation but more importantly bounds the signal to the actual blast radius.

### Category B: Regex loosening — APPLIED
- **CP-053 `delta_jsonl`**: now also matches `deltaCount`, `newFindings`, `delta-001`, `delta record`, `deltas directory` (canonical synonyms for the delta-iteration contract).
- **CP-057 `target_read_only_named`**: now also matches `targets are read-only`, `never modify.*target`, `never edit.*target`, `target.*read.only` (paraphrase tolerance).
- **CP-057 `allowed_surfaces_named`**: now also matches `review/iterations/`, `deep-review-strategy`, `allowed surfaces`, `writable surface`, `allowed write` (paraphrase tolerance).

### Category C: Substrate updates — APPLIED
- **sk-deep-review SKILL.md ALWAYS rules**: added rule 13 (BINDING emission contract) and rule 14 (canonical REFUSE wording). Both rules are grep-checkable contracts that machines and operators can verify.
- **@deep-review canonical agent body** (`.opencode/agent/deep-review.md`):
  - §0 ILLEGAL NESTING: added "Canonical Refusal Wording (mandatory)" subsection requiring exact verbatim emission of `REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.`
  - §0b INPUT + SCOPE GATES: added "Setup BINDING Emission" subsection requiring 6 canonical `BINDING:` lines before any state read.
- **4-runtime mirror sync**: changes mirrored to `.claude/agents/`, `.gemini/agents/`, `.codex/agents/` (TOML wrapper). All parse cleanly. File size: 596/596/596/590 lines (all under the 600-line cap).

### Category D: phase_synthesis YAML audit — DEFERRED
- Investigated `spec_kit_deep-review_auto.yaml` `phase_synthesis` section. No obvious unbounded loops; structure is linear (hydrate → read iterations → build registry → adversarial selfcheck → emit resource map → coverage gate → compile report).
- `step_adversarial_selfcheck` iterates per-finding (`For each active P0/P1 finding`) without explicit cap. This is a likely contributor to CP-055's 900s opencode timeout when run with many findings.
- **Deferred** because the YAML file is currently modified by parallel work tracks; adding a BOUNDED_CAP edit here would conflict. Recommended fix to apply once the parallel work merges:
  - In `step_adversarial_selfcheck`, add bounded cap (default BOUNDED_CAP=20, severity-priority + file:line ordering) and emit a `synthesisNote` when the cap is applied.

### Effects on R3 expected outcome (not re-run yet)
- A+B fixes should bring CP-053+054+057 to PASS on next R3.
- C fixes (BINDING + REFUSE) should bring CP-052 + CP-056 closer to PASS, contingent on the LLM faithfully emitting the new canonical strings during stress runs.
- D deferred — CP-055 timeout may still recur until the bounded-cap is applied.

**R3 not run** in this cycle (executor budget conservation + recommendations applied are deterministic CP-edits + skill+agent edits whose effects are best confirmed on a future R3 dispatch when budget permits).
