# Review Iteration 1: Infrastructure Reuse Mapping

## Focus
Q1: How much existing sk-deep-research infrastructure can be reused for review mode?

## Findings

### Part 1: Component Classification Table

| Component | Current Purpose (Research) | Review Mode Purpose | Classification | Adaptation Notes |
|---|---|---|---|---|
| 1. YAML workflow | Runs the 4-phase loop: init, iterate, synthesize, save | Run the same 4 phases for review target setup, per-dimension review passes, report synthesis, memory save | ADAPT | The phase graph is reusable, but the current workflow hardcodes `research_topic`, `research/research.md`, research phrasing, and WebFetch-oriented behavior. Reuse the shape, not the phase bodies. [SKILL.md L128] [loop_protocol.md L13] [spec_kit_deep-research_auto.yaml L89] |
| 2. Config JSON | Stores loop parameters, budgets, mode, protections | Stores review target, dimensions, iteration limits, convergence settings, protections | ADAPT | Keep `maxIterations`, thresholds, budgets, `executionMode`, and `fileProtection`; add `mode`, `reviewTarget`, `reviewDimensions`, maybe `reportPath`. Current `topic` is too research-specific. [state_format.md L32] [deep_research_config.json L1] |
| 3. JSONL state log | Append-only machine log of iterations and events | Append-only log of review passes, dimensions, new findings, severity counts, recovery events | ADAPT | The append-only/event model is excellent for review mode. Add review-native fields such as `dimension`, `severityCounts`, `reviewedArtifacts`, and maybe `newFindingsRatio` aliasing the current novelty signal. [state_format.md L97] |
| 4. Strategy file | Persistent brain: questions, worked/failed paths, next focus | Persistent review plan: dimensions remaining, findings themes, reviewed areas, next lens | ADAPT | The structure already matches iterative review work well. Replace question-centric wording with dimension/scope wording and keep `What Worked`, `What Failed`, `Exhausted Approaches`, and `Next Focus`. [state_format.md L314] [deep_research_strategy.md L27] |
| 5. Iteration files | Write-once findings for one research pass | Write-once findings for one review dimension/pass | ADAPT | Keep the write-once `iteration-NNN.md` contract. Swap `Sources Consulted` toward `Files/Specs Reviewed`, and make findings explicitly P0/P1/P2 with file-line evidence. [state_format.md L344] |
| 6. Dashboard | Human-readable progress summary from JSONL + strategy | Findings dashboard by dimension, severity, coverage, and stale/no-new-findings trend | ADAPT | The dashboard mechanism is reusable, but the content should pivot from question coverage to review coverage and finding distribution. [loop_protocol.md L182] [state_format.md L404] [deep_research_dashboard.md L6] |
| 7. Convergence algorithm | Stops on diminishing research return using rolling avg, MAD noise, question entropy, plus guards | Stops when review coverage is saturated and recent passes stop producing novel findings | ADAPT | Keep `shouldContinue()` and the weighted-signal pattern, but redefine the signals. `question entropy` should become dimension/scope coverage, and research guards should become review-evidence guards. [convergence.md L21] |
| 8. Stuck recovery protocol | Escapes repetitive or shallow research loops | Escapes repetitive/no-yield review loops by switching dimension, artifact slice, or comparison lens | ADAPT | The classify-then-recover structure is worth keeping, but current failure modes are research/source specific. Review mode needs recovery strategies like "follow cross-reference links", "switch from correctness to spec alignment", or "audit untouched files". [loop_protocol.md L252] [convergence.md L325] |
| 9. `research/research.md` synthesis | Produces canonical research output in research format | Produces findings-first review report (`review-report.md`) with severity, evidence, gaps, and recommendations | REPLACE | This is the one component not preserved semantically. The current synthesis contract is explicitly for `research/research.md` and a 17-section research output, which does not fit a review report. [loop_protocol.md L412] [state_format.md L389] [spec_kit_deep-research_auto.yaml L332] |
| 10. Memory save phase | Saves session context through `generate-context.js` | Same | REUSE-AS-IS | This phase is spec-folder based and not research-specific. [loop_protocol.md L444] [spec_kit_deep-research_auto.yaml L399] |
| 11. Setup phase | Captures topic, limits, convergence threshold, prior memory context | Captures review target, scope, dimensions, limits, prior memory context | ADAPT | The init contract is reusable, but the inputs must shift from `research_topic` to `review_target` plus optional dimension filters and output mode. [spec_kit_deep-research_auto.yaml L28] [spec_kit_deep-research_confirm.yaml L177] |
| 12. Agent dispatch mechanism | Injects state summary + file paths into a LEAF research agent | Injects review target, dimension, prior findings, and file paths into a LEAF review agent | ADAPT | Fresh-context dispatch is one of the best reusable pieces. The mechanism stays; the prompt and likely the leaf agent identity should change from `@deep-research` to a review-oriented leaf. [SKILL.md L169] [loop_protocol.md L143] [spec_kit_deep-research_auto.yaml L262] |
| 13. Pause sentinel | Graceful between-iteration pause via `research/.deep-research-pause` | Same | REUSE-AS-IS | The behavior is content-agnostic. Only the user-facing copy/file name is arguably cosmetic. [loop_protocol.md L109] [spec_kit_deep-research_auto.yaml L209] |
| 14. `research-ideas.md` backlog | Parking lot for deferred research directions | Parking lot for deferred review angles and follow-up audits | ADAPT | The backlog idea is still useful, but the artifact name and examples should shift to review language. [loop_protocol.md L225] |
| 15. Progressive synthesis flag | Allows incremental update of `research/research.md` before final consolidation | Allows incremental update of `review-report.md` before final consolidation | ADAPT | The flag itself is reusable; the target artifact and synthesis rules are not. [SKILL.md L203] [state_format.md L51] [loop_protocol.md L436] |

**Classification summary:** 2 REUSE-AS-IS, 12 ADAPT, 1 REPLACE

### Part 2: Architecture Decision

**Question:** Can review mode be a config-level switch (e.g., `"mode": "review"`) that changes behavior within the SAME YAML workflow, or does it require PARALLEL YAML workflows?

**Config-switch inside the same YAML:**
- Pros: maximum reuse of the 4-phase skeleton, one place for loop-state semantics, easier parity for convergence/save behavior.
- Cons: the current YAML is saturated with research-specific nouns, inputs, prompts, artifact names, and tool expectations from top to bottom, so a `mode: review` branch would end up touching nearly every phase anyway. [spec_kit_deep-research_auto.yaml L6, L262]
- Cons: the project already chose parallel YAMLs for `auto` and `confirm`, which is evidence that workflow-level branching is preferred when user interaction and control flow differ materially. [spec_kit_deep-research_auto.yaml L9] [spec_kit_deep-research_confirm.yaml L9]
- Cons: confirm mode already has its own approval gates, and even notes that wave behavior conflicts with those gates; that is a sign this system prefers workflow specialization over many conditional branches. [spec_kit_deep-research_confirm.yaml L401]

**Parallel `deep-review` YAMLs:**
- Pros: clearer contracts and prompts per mode, easier to swap tool bias from `WebFetch` toward `Read/Grep/Glob`, easier to produce `review-report.md` without polluting research synthesis instructions, easier to test and audit.
- Pros: matches the existing architecture pattern of separate auto/confirm workflows.
- Cons: some duplication across the two review YAMLs and some duplication with deep-research.

**Recommendation:** Use parallel workflows: `spec_kit_deep-review_auto.yaml` and `spec_kit_deep-review_confirm.yaml`. Also add a lightweight config/state field such as `mode: "review"` so shared downstream consumers can tell research and review sessions apart. This gives the cleanest split: workflow contracts stay readable, while config/state/dashboard/report tooling can still share structure. This is an inference from the current workflow shape and specialization pattern.

### Part 3: Adaptation Complexity Estimate

Assumption: new review-mode YAMLs are added in parallel, while shared docs/assets/state contracts are updated rather than replaced.

| ADAPT Component | Estimated LOC to Change | Risk | Dependencies |
|---|---:|---|---|
| 1. YAML workflow | 250-450 | Medium | Config schema, dispatch prompt, convergence, synthesis output |
| 2. Config JSON | 15-35 | Low | Setup inputs, JSONL parser, synthesis/report path |
| 3. JSONL state log | 40-80 | Medium | Convergence, dashboard, synthesis, any recovery logic |
| 4. Strategy file | 40-90 | Low-Medium | Setup/init, per-iteration agent behavior, next-focus logic |
| 5. Iteration files | 30-70 | Low-Medium | Agent prompt, synthesis, JSONL reconstruction/recovery |
| 6. Dashboard | 30-60 | Low | JSONL schema, strategy sections, convergence metrics |
| 7. Convergence algorithm | 60-120 | Medium-High | JSONL fields, strategy coverage model, dashboard reporting |
| 8. Stuck recovery protocol | 40-90 | Medium | Strategy structure, dispatch prompt, ideas backlog |
| 11. Setup phase | 25-60 | Low-Medium | Config, strategy template, memory-context injection |
| 12. Agent dispatch mechanism | 80-180 | Medium | New leaf-agent prompt, iteration file contract, tool allowlist |
| 14. Ideas backlog | 15-35 | Low | Strategy, stuck recovery |
| 15. Progressive synthesis flag | 10-25 | Low | Report output path/template, synthesis phase |

### Part 4: Ruled Out Approaches

1. **Reusing `research/research.md` with a cosmetic rename only.** Rejected because the current synthesis contract is research-shaped, not findings-first review-shaped. [loop_protocol.md L412]

2. **Replacing the externalized-state loop with a one-shot review command.** Rejected because the fresh-context iteration model, JSONL log, dashboard, and resume/recovery behavior are the strongest parts of the current infrastructure. [SKILL.md L128] [state_format.md L13]

3. **Keeping the research convergence guards unchanged.** Rejected because `source_diversity`, `focus_alignment`, and `single_weak_source` are tuned for external evidence gathering, not code-review evidence quality. [convergence.md L110]

4. **A single mega-YAML handling research/review plus auto/confirm via conditionals.** Rejected because the current system already specialized by execution mode, and adding a second axis would make the workflow harder to reason about than two clear review YAMLs. [spec_kit_deep-research_auto.yaml L9] [spec_kit_deep-research_confirm.yaml L9]

### Notable Inconsistencies Found

1. `spec_kit_deep-research_confirm.yaml` says wave mode is auto-only and points to the auto YAML for wave steps, but the auto YAML keeps wave orchestration in a `reference_only_appendix`, not executable `workflow.steps`. [confirm L401] [auto L467]

2. `state_format.md` omits `maxToolCallsPerIteration` and `maxMinutesPerIteration`, but the config template and strategy template use them. [state_format.md L36] [config.json L7] [strategy.md L119]

3. `state_format.md` says the dashboard includes a Source Diversity section, but the actual dashboard template does not. [state_format.md L415] [dashboard.md L41]

4. `loop_protocol.md` requires charter validation for `Non-Goals` and `Stop Conditions`, but neither YAML has an explicit validation step for that contract. [loop_protocol.md L55] [auto L156] [confirm L159]

5. The convergence reference excludes `thought` iterations from signal computation, but the YAML summary only reflects that nuance in stuck-count tracking, not in the signal pseudocode itself. [convergence.md L61] [auto L221]

### Net Assessment

The infrastructure is strongly reusable, but mostly at the pattern level. Keep the loop/state/save spine, adapt almost everything user-facing and iteration-facing, and replace only the final synthesis artifact/contract.

## Assessment
newFindingsRatio: 1.0 (first iteration, all findings new)

## Recommended Next Focus
Q2: What are the exact review dimensions (correctness, security, patterns, spec alignment, completeness, cross-reference integrity) and how do they map to the convergence signals? This would define the review-specific convergence model and quality guards that replace the research-oriented ones.
