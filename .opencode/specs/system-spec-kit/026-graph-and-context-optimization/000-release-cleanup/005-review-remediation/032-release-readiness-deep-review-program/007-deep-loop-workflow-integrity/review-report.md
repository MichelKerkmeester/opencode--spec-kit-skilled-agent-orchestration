---
title: "Review Report: Deep Loop Workflow Integrity"
description: "Release-readiness deep-review report for deep-loop convergence, JSONL state, lineage, validation, prompt-pack, and reducer integrity."
trigger_phrases:
  - "045-007-deep-loop-workflow-integrity"
  - "deep-loop audit"
  - "convergence detection review"
  - "JSONL state log integrity"
importance_tier: "important"
contextType: "review"
---
# Review Report: Deep Loop Workflow Integrity

## 1. Executive Summary

**Verdict: FAIL.** Active findings: P0=1, P1=2, P2=1. `hasAdvisories=true`.

The deep-loop stack has several solid pieces: lineage reducers restrict review mode to `new`, `resume`, and `restart`; malformed JSONL fails closed by default; graph `STOP_BLOCKED` is wired into the review blocked-stop path; current prompt templates use flat state-path variables that the prompt-pack renderer can substitute; and the research auto YAML has the newer audited executor wrappers.

The release blocker is the max-iteration stop path. Both deep-review and deep-research can turn a configured hard cap into a blocked or continue outcome when legal-stop or quality gates fail. That defeats the hard ceiling and creates runaway-loop risk exactly where the operator expects the loop to stop and synthesize with unresolved blockers recorded.

## 2. Planning Trigger

Route to remediation planning before release. The P0 should be fixed first because it affects both deep-review and deep-research control flow: `maxIterationsReached` must be terminal, not gate-blockable.

The P1s should be handled in the same remediation packet if possible. They are adjacent: align deep-review dispatch with the audited executor wrapper pattern, make failure reasons match the shared validator, and tighten review iteration JSONL schema validation so bad records cannot pass by field presence only.

## 3. Active Finding Registry

### P0-001: Max-iteration hard stops can be converted into BLOCKED or CONTINUE paths

**Severity: P0.** Runaway-loop risk.

**Evidence:** The review convergence reference calls max iterations a hard stop: "Hard stops are evaluated first and override all other signals" and `len(iterations) >= config.maxIterations` returns `STOP` with `maxIterationsReached` `.opencode/skill/sk-deep-review/references/convergence.md:112` and `.opencode/skill/sk-deep-review/references/convergence.md:119`. It also names `maxIterations` a "Hard iteration ceiling" `.opencode/skill/sk-deep-review/references/convergence.md:715`.

The deep-review YAML weakens that guarantee. It says hard stops are "still subject to step 5 legal-stop gates" `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:445`, including the `max_iterations_reached` branch `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:446`. If any gate fails, the STOP candidate becomes `decision = "BLOCKED"` `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:476`, and the convergence handler continues rather than synthesizing `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:551`. The confirm workflow carries the same shape: max iterations promotes a STOP candidate `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:459`, any failing gate turns it into BLOCKED `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:489`, and blocked handling continues `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:564`.

Research has the same class of bug. The research reference says max iterations returns `STOP` with `maxIterationsReached` `.opencode/skill/sk-deep-research/references/convergence.md:979`, but the auto YAML applies quality guard override to any `decision == "STOP"` `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:451`; a failed guard sets `decision = "CONTINUE"` `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:453`. The confirm workflow also sets the composite reason to legacy `composite_converged` and uses the same guardable STOP shape `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:455`.

**Impact:** A loop can exceed the configured cap when dimensions remain uncovered, P0s remain active, claim adjudication is missing, graph blockers exist, or quality guards fail. That is the opposite of a hard ceiling. The safe behavior at the cap is to stop, synthesize, and persist unresolved blockers in the report and terminal JSONL, not keep dispatching.

**Concrete fix:** Split terminal hard caps from legal convergence. `maxIterationsReached`, `userPaused`, `manualStop`, and unrecoverable `error` should bypass legal-stop/quality gate vetoes. They may record failed gates as terminal evidence, but they must still emit `synthesis_complete` with `stopReason:"maxIterationsReached"` and exit to synthesis. Add regression fixtures for review and research where the cap is reached with missing coverage and active blockers.

### P1-001: Deep-review post-dispatch validation taxonomy drifts from the shared validator and research wrappers

**Severity: P1.** Workflow contract drift and orphan failure modes.

**Evidence:** The shared validator can return eleven failure reasons, including `executor_missing` and `dispatch_failure_logged` `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:27`. Research auto enumerates all eleven in `failure_reasons_reference` `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:787`.

Deep-review confirm enumerates only nine reasons and omits `executor_missing` and `dispatch_failure_logged` `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:754`. Deep-review auto does not enumerate `failure_reasons` at all; it only declares the validator and generic `on_failure` action `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:764`. That directly contradicts the release-readiness question asking whether every enumerated failure reason is reachable and whether any failure modes are orphaned.

The dispatch implementation is also uneven. Research auto wraps non-native executors with `runAuditedExecutorCommand`, which emits typed `dispatch_failure` events on timeout or crash `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:167`. Deep-review auto still runs raw CLI commands for `cli-codex`, `cli-gemini`, and `cli-claude-code` `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:655` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:730`. The validator knows how to classify a last-line `dispatch_failure` event `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:106`, but the deep-review raw branches do not produce that event on executor crash.

**Impact:** Some failure modes are code-reachable but not YAML-enumerated; others are YAML-relevant but not emitted by the deep-review dispatch path. Operators can see generic schema mismatch instead of the actionable cause, and provenance can be missing exactly on non-native executor failures.

**Concrete fix:** Port the audited executor wrapper shape from deep-research auto into both deep-review auto and confirm. Enumerate the same eleven validator reasons everywhere, including `executor_missing` and `dispatch_failure_logged`, or deliberately remove unreachable reasons from the shared validator. Pass `executorKind` into validation for non-native paths and assert provenance before reducer refresh.

### P1-002: Review prompt pack asks agents to write schema-incomplete JSONL that post-dispatch validation still accepts

**Severity: P1.** JSONL state-log integrity drift.

**Evidence:** The review state-format contract requires iteration records to include `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, and `durationMs` `.opencode/skill/sk-deep-review/references/state_format.md:195`. It also declares `filesReviewed` as `string[]` `.opencode/skill/sk-deep-review/references/state_format.md:203`.

The review prompt pack's JSON example omits most of those required fields and shows `filesReviewed` as `<n>` rather than an array `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:70`. Its delta example repeats the numeric shape `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:79`. Deep-review YAML post-dispatch validation only checks for six fields: `type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, and `newFindingsRatio` `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:768`. The TypeScript validator checks field presence only with `field in parsedRecord`, not field type or the full required schema `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:135`.

**Impact:** A review iteration can pass post-dispatch validation while lacking lineage fields, status, focus, timestamp, duration, and an array-valued `filesReviewed`. That weakens replay, synthesis audit, and traceability. It also makes the reducer compensate for malformed records instead of enforcing the append-only state contract at the boundary.

**Concrete fix:** Update the prompt pack examples to match `.opencode/skill/sk-deep-review/references/state_format.md`, including `mode:"review"`, `run`, `status`, `focus`, lineage fields, and array-valued `filesReviewed`. Extend `validateIterationOutputs` with per-mode schema validation or a caller-provided Zod schema, not just required-field presence.

### P2-001: The packet target references a non-existent deep-loop coverage-graph file

**Severity: P2.** Traceability friction.

**Evidence:** The requested target surface includes `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/coverage-graph.ts`, but the scoped inventory under `mcp_server/lib/deep-loop/` contains only `executor-audit.ts`, `executor-config.ts`, `post-dispatch-validate.ts`, and `prompt-pack.ts`. Repository search found coverage-graph material under `mcp_server/code_graph/feature_catalog/05--coverage-graph/` and handlers/tests, not a `lib/deep-loop/coverage-graph.ts` file.

**Impact:** Reviewers can waste time looking for a file that no longer exists at the requested path. The actual graph convergence behavior is still auditable through YAML and code_graph references, but the brief path is stale.

**Concrete fix:** Update release-readiness target lists to point at the live coverage graph handlers or feature catalog paths, or add a compatibility note that graph convergence lives under code_graph rather than `lib/deep-loop`.

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Hard-cap semantics | P0-001 | Make `maxIterationsReached` terminal in research and review, while still recording failed gates as terminal evidence. |
| Dispatch failure audit | P1-001 | Port audited executor wrappers to deep-review and align failure reason enumerations with the shared validator. |
| JSONL schema enforcement | P1-002 | Align prompt-pack examples with state format and validate field types/full required schemas. |
| Target list cleanup | P2-001 | Fix stale coverage-graph path in future release-readiness packet briefs. |

## 5. Spec Seed

Title: Deep Loop Hard-Cap and Dispatch Integrity Remediation.

Problem: Deep-loop release readiness is blocked because max-iteration hard stops can be gate-blocked into continued dispatch, and deep-review post-dispatch validation/provenance is weaker than the shared validator and research wrapper contract.

Requirements:
- `maxIterationsReached` must always exit to synthesis for both research and review.
- Terminal synthesis must preserve failed legal-stop gates, graph blockers, active findings, and unresolved questions as evidence.
- Deep-review auto and confirm must use audited executor wrappers for non-native CLI dispatches.
- Deep-review failure reasons must match the shared post-dispatch validator.
- Review iteration JSONL prompt examples and validation must match `.opencode/skill/sk-deep-review/references/state_format.md`.

Out of scope:
- Changing convergence thresholds unless empirical stress evidence shows a need.
- Reintroducing deferred lineage modes.

## 6. Plan Seed

1. Add tests for review and research sessions that hit max iterations with incomplete coverage and active blockers.
2. Update convergence YAML so max-iteration terminal stops bypass legal-stop and quality-gate vetoes.
3. Emit terminal `synthesis_complete` with `stopReason:"maxIterationsReached"` and attach failed gates/blockers as report evidence.
4. Port `runAuditedExecutorCommand` wrappers to deep-review auto and confirm CLI branches.
5. Align `failure_reasons` lists across research/review auto/confirm with the shared validator.
6. Update review prompt-pack JSON examples and add schema validation for required fields and field types.
7. Run targeted deep-loop tests plus strict spec validation.

## 7. Traceability Status

Question: Does the inline 3-signal vote correctly fall back when fewer than 3 iterations have completed?

Answer: Partially. Research docs say fewer than 3 iterations skip convergence threshold checks and only max/stuck apply `.opencode/skill/sk-deep-research/references/convergence.md:868`, but the research YAML still includes question entropy from iteration one and redistributes weights when rolling/MAD are unavailable `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:421`. Review is more internally consistent: rolling needs 2 iterations, MAD needs 3, dimension coverage can be active immediately, and weights are redistributed `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:455`. The fallback itself is explicit, but the max-cap bug means the terminal path is not safe.

Question: Does `step_graph_convergence` correctly veto premature inline STOP when blockers are present?

Answer: Yes for deep-review's `STOP_BLOCKED` path. The graph step records `CONTINUE | STOP_ALLOWED | STOP_BLOCKED` before inline convergence `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410`, and the combined rule maps `STOP_BLOCKED` to BLOCKED with full blocker detail preserved `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:497`. `step_emit_blocked_stop` then writes `blocked_stop` with `graphBlockerDetail` `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:538`. Caveat: max-iteration STOP can still be entangled with legal-stop blocking, which is P0-001.

Question: Lineage modes `new`, `resume`, and `restart` are live; `fork` and `completed-continue` are deferred. Does the workflow honor that?

Answer: Mostly yes. Deep-review YAML exposes `auto|resume|restart` as operator intent and explicitly says `fork` and `completed-continue` are deferred `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33`. Resume and restart emit typed lifecycle events with `parentSessionId`, `lineageMode`, `continuedFromRun`, `generation`, and `archivedPath` `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:206` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:215`. The review reducer enforces live modes with `LIVE_LINEAGE_MODES = new,resume,restart` and normalizes anything else to null `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:23`. Research loop docs carry the same contract `.opencode/skill/sk-deep-research/references/loop_protocol.md:82`.

Question: Post-dispatch validation: are all failure reasons enumerated in YAML reachable in code? Any orphan failure modes?

Answer: No. The shared validator returns eleven reasons `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:27`; research auto enumerates them all `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:787`; deep-review confirm lists only nine `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:754`; deep-review auto lists none around its validator block `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:764`. `dispatch_failure_logged` is especially weak on review CLI branches because those branches are raw shell commands rather than audited wrappers.

Question: Does prompt-pack rendering correctly substitute variables, especially `{state_paths.*}` and `{config.lineage.*}`?

Answer: Current prompt-pack templates are safe because they use flat variables such as `{state_paths_config}` and `{state_paths_state_log}` `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:45`. `renderPromptPack` only recognizes flat token names matching `[a-zA-Z_][a-zA-Z0-9_]*` `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts:10`, so a literal `{state_paths.config}` or `{config.lineage.sessionId}` inside a prompt template would not be substituted by this renderer. In YAML command strings, dotted placeholders are a separate workflow interpolation concern, not `renderPromptPack`.

Security question: Does prompt-pack rendering leak credentials?

Answer: No credential leak path found in the renderer. It reads a template file and replaces only supplied variable values `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts:36`; it does not read environment variables, config files, or credential stores. The risk is missing or malformed variable substitution, not secret exfiltration.

Question: For each failure mode, what is the recovery path?

Answer: For `malformed_delta`, reducer JSONL parsing fails closed by default through `parseJsonlDetailed` and throws unless `--lenient` is used `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1184` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1211`. For `missing_iteration_file`, post-dispatch validation returns `iteration_file_missing` `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:117`, and YAML routes validation failure to `schema_mismatch` with escalation after three failures `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:772`. For `schema_mismatch`, YAML declares a canonical conflict event and three-failure stuck recovery `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:764`. The recovery paths are declared, but P1-001 means the taxonomy is not consistently enumerable across review workflows.

Question: Convergence threshold defaults: 0.05 research vs 0.10 review. Is this the right calibration?

Answer: Reasonable as a default split, not the release blocker. Research's lower threshold fits information-yield loops where stopping too early risks shallow synthesis; review's higher threshold fits severity-weighted findings plus dimension coverage and legal-stop gates. The problem is not the 0.05/0.10 defaults; it is that hard caps and validation gates are not enforced consistently enough to make either threshold safe.

## 8. Deferred Items

- Fix stale packet target path for `coverage-graph.ts`.
- Add prompt-pack validation that rejects dotted template variables if they appear in prompt templates.
- Decide whether native executor dispatches need explicit provenance records, since current skill docs treat native provenance as recoverable from YAML.

## 9. Audit Appendix

### Coverage

Reviewed surfaces:
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-research/references/{loop_protocol,convergence,state_format,spec_check_protocol}.md`
- `.opencode/skill/sk-deep-review/references/{loop_protocol,convergence,state_format}.md`
- Packet 028 implementation summary and sibling 045 packet format.

### Specific Question Matrix

| Question | Result |
|----------|--------|
| Fewer-than-3 iteration fallback | Partial: fallback is explicit, but research docs and YAML differ on early entropy voting. |
| Graph veto with blockers | PASS for deep-review `STOP_BLOCKED` path. |
| Live lineage modes | PASS for persisted `new/resume/restart`; deferred modes are documented and reducer-normalized away. |
| Post-dispatch failure reasons | FAIL: validator has eleven reasons; deep-review YAML enumerations are incomplete or absent. |
| Prompt-pack state path substitution | PASS for current flat prompt templates; dotted template variables would not render. |
| Recovery for malformed/missing/schema mismatch | Partial: declared paths exist, but taxonomy drift weakens operator actionability. |
| Threshold calibration | PASS as defaults; not the blocker. |

### Failure Reason Coverage

| Reason | Validator | Research Auto YAML | Review Confirm YAML | Review Auto YAML |
|--------|-----------|--------------------|---------------------|------------------|
| `iteration_file_missing` | Yes | Yes | Yes | Not enumerated |
| `iteration_file_empty` | Yes | Yes | Yes | Not enumerated |
| `jsonl_not_appended` | Yes | Yes | Yes | Not enumerated |
| `jsonl_missing_fields` | Yes | Yes | Yes | Not enumerated |
| `jsonl_parse_error` | Yes | Yes | Yes | Not enumerated |
| `jsonl_wrong_type` | Yes | Yes | Yes | Not enumerated |
| `delta_file_missing` | Yes | Yes | Yes | Not enumerated |
| `delta_file_empty` | Yes | Yes | Yes | Not enumerated |
| `delta_file_missing_iteration_record` | Yes | Yes | Yes | Not enumerated |
| `executor_missing` | Yes | Yes | No | Not enumerated |
| `dispatch_failure_logged` | Yes | Yes | No | Not enumerated |

### Convergence Evidence

All four review dimensions were covered:
- Correctness: max-cap semantics, graph-assisted STOP, convergence fallback, threshold defaults.
- Security: prompt-pack secret exposure and executor provenance.
- Traceability: JSONL required fields, synthesis events, failure-reason enumerations, target path accuracy.
- Maintainability: research/review YAML parity, prompt template shape, reducer fail-closed behavior.

Convergence is blocked by one active P0 and two active P1 findings. Release readiness for deep-loop workflow integrity is not achieved.
