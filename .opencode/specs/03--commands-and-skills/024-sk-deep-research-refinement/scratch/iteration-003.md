# Iteration 3: Cross-Reference 18 v2 Proposals Against Actual Running Code

## Focus
Validate each of the 18 v2 proposals from spec 023's `improvement-proposals.md` against what our system ACTUALLY implements in its current source files (sk-deep-research skill, YAML workflow, agent definitions, convergence.md, state_format.md) and against code-level findings from iterations 1-2 about the reference repos. For each proposal, determine: IMPLEMENTED (already in our code), CONFIRMED (code evidence supports the proposal's direction), REVISED (code shows different/better approach than proposed), DEPRECATED (code shows it's unnecessary), or NEEDS-DATA (insufficient evidence).

## Findings

### Finding 1: 6 of 18 proposals are ALREADY IMPLEMENTED in current code (not just proposed)

Cross-referencing the proposals against our actual source files reveals that the implementation work done between spec 023 (proposals) and spec 024 (current state) has already shipped 6 proposals into the live system:

| Proposal | Status | Evidence |
|----------|--------|----------|
| **P1.1 Tiered Error Recovery** | IMPLEMENTED | `convergence.md` Section 5 contains full 5-tier protocol (lines 335-388) with Tier 1 (retry source, 2 attempts), Tier 2 (focus pivot), Tier 3 (state reconstruction), Tier 4 (direct mode fallback), Tier 5 (user escalation). The agent definition (`.claude/agents/deep-research.md`) also references Tier 1-2 explicitly in "Error-Aware Execution" section. |
| **P1.3 Exhausted Approaches Enhancement** | IMPLEMENTED | The agent definition has a "MANDATORY PRE-CHECK" section requiring agents to read strategy.md "Exhausted Approaches" before choosing focus. Strategy template includes `### [Category Name] -- BLOCKED` and `### [Category Name] -- PRODUCTIVE` entries. This matches the proposal's structured registry with category-level blocking. |
| **P1.5 JSONL Fault Tolerance** | IMPLEMENTED | `convergence.md` Section 2 "Reading JSONL State (Fault-Tolerant)" (lines 207-224) specifies per-line try/catch, skip malformed lines, apply defaults (`status ?? "complete"`, `newInfoRatio ?? 0.0`, etc.), and log warnings. `state_format.md` Section 3 "Fault Tolerance" (lines 176-191) provides the full specification with 5-step defensive reading protocol. |
| **P1.4 State Recovery Fallback** | IMPLEMENTED | `state_format.md` Section 3 "State Recovery from Iteration Files" (lines 195-211) specifies scanning `scratch/iteration-*.md`, parsing `## Assessment` sections, extracting run/focus/ratio, reconstructing JSONL with `status: "reconstructed"`. Also referenced in convergence.md Tier 3. |
| **P2.3 Iteration Reflection Section** | IMPLEMENTED | `state_format.md` Section 5 (lines 267-306) shows the iteration template with `## Reflection` section containing "What worked and why", "What did not work and why", "What I would do differently". The agent definition also includes this section. Iteration 001 and 002 both CONTAIN reflection sections, confirming active use. |
| **P2.6 Sentinel Pause File** | IMPLEMENTED | The YAML workflow `spec_kit_deep-research_auto.yaml` has `step_check_pause_sentinel` (lines 207-215) that checks for `{spec_folder}/scratch/.deep-research-pause` before each iteration dispatch. If present, logs a paused event and halts. |

[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:207-224, 335-388]
[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:176-211, 267-306]
[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:207-215]
[SOURCE: .claude/agents/deep-research.md:73-76 (exhausted pre-check), error-aware execution section]

### Finding 2: 5 of 18 proposals are PARTIALLY IMPLEMENTED (core concept present, full scope not yet reached)

| Proposal | Status | What's Implemented | What's Missing |
|----------|--------|-------------------|----------------|
| **P1.2 Composite Convergence** | PARTIALLY IMPLEMENTED | Full 3-signal composite algorithm exists in convergence.md Section 2.3 (rolling avg w=0.30, MAD w=0.35, entropy w=0.35, threshold 0.60). YAML workflow step_check_convergence references the composite. | The YAML workflow describes the algorithm but does not record convergenceSignals in JSONL records (state_format.md defines the schema for this at lines 127-141 but the workflow's step_evaluate_results does not populate it). Diagnostic visibility gap. |
| **P2.1 Enriched Stuck Recovery** | PARTIALLY IMPLEMENTED | convergence.md Section 4 has 3 explicit recovery strategies (Try Opposites, Combine Prior Findings, Audit Low-Value Iterations) with selection logic pseudocode (lines 251-321). | The YAML workflow's stuck recovery handling (step_handle_convergence) is simpler: "Widen scope. Try fundamentally different approach. Least-explored question: {least_explored}". The 3 strategies exist in the reference doc but the orchestrator dispatch does not select among them. |
| **P2.2 Ideas Backlog File** | PARTIALLY IMPLEMENTED | The agent definition's Step 1 (Read State) lists `scratch/research-ideas.md (if exists)` as a file to read. The agent's Step 2 says "Check `scratch/research-ideas.md` for deferred ideas that may provide escape from stuck state". | The YAML workflow does NOT reference research-ideas.md in its step_read_state or step_dispatch_iteration. The file exists in our current research session (spec 024 has one seeded by Wave 1) but the orchestrator does not inject its contents into dispatch context. |
| **P2.4 Segment Partitioning** | PARTIALLY IMPLEMENTED | state_format.md Section 3 defines the `segment` field on iteration records (default: 1) and `segment_start` event type. convergence.md has a "Segment Model (REFERENCE-ONLY)" section. YAML workflow extracts `current_segment` in step_read_state. | Explicitly marked as "REFERENCE-ONLY" throughout. No `:restart` mode exists. No orchestrator code triggers segment transitions. The segment field is defined but never actively used. |
| **P3.1 Statistical newInfoRatio Validation** | PARTIALLY IMPLEMENTED | convergence.md Section 6 (lines 390-447) contains full `validateNewInfoRatio()` pseudocode with MAD noise floor computation, advisory event logging (`ratio_within_noise`), and interpretation table. | Same gap as P1.2: the YAML workflow does not invoke this validation or record noise floor diagnostics. The algorithm is specified but the orchestrator does not call it. |

[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:60-101 (composite), 251-321 (stuck recovery), 390-447 (statistical validation)]
[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:186-238 (convergence check), 243-253 (stuck handling)]
[SOURCE: .claude/agents/deep-research.md:59-63 (Step 1 reads research-ideas.md)]

### Finding 3: 3 of 18 proposals are CONFIRMED but NOT yet implemented

| Proposal | Status | Evidence |
|----------|--------|----------|
| **P3.2 Compact State Summary Injection** | CONFIRMED, IMPLEMENTED | Actually, upon closer inspection, the YAML workflow's `step_dispatch_iteration` (lines 256-284) includes a `pre_dispatch: generate_summary` block that produces a "STATE SUMMARY (auto-generated)" with segment, iteration count, questions answered, last focus, last 2 ratios, stuck count, and next focus. This matches P3.2's 200-token compact summary concept. **REVISED to IMPLEMENTED.** |
| **P3.3 Git Commit Per Iteration** | CONFIRMED NOT IMPLEMENTED | The YAML workflow's `reference_only_appendix` (lines 453-458) contains the exact git add/commit commands described in P3.3, but explicitly notes: "Checkpoint commits are intentionally excluded from workflow.steps." This is a deliberate design choice to keep them reference-only. |
| **P4.1 File Mutability Declarations** | CONFIRMED, PARTIALLY IMPLEMENTED | `state_format.md` Section 2 (lines 63-89) defines a `fileProtection` map in config with 4 protection levels (immutable, append-only, mutable, write-once). The spec says "If no fileProtection map is present, the default protections from the table above apply implicitly." However, the config template does not include this field by default, and the orchestrator does not validate against it. |

[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:256-284 (state summary), 453-458 (checkpoint commits)]
[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:63-89 (file protection)]

### Finding 4: 4 of 18 proposals remain UNIMPLEMENTED (neither in code nor reference docs)

| Proposal | Status | Assessment |
|----------|--------|------------|
| **P2.5 Scored Branching with Pruning** | NOT IMPLEMENTED | The YAML workflow's reference_only_appendix mentions wave_orchestration (lines 459-465) with parallel dispatch, median newInfoRatio scoring, and top-branch promotion. State_format.md defines `wave_complete`, `wave_pruned`, and `breakthrough` event types. But all are explicitly "reference-only". No live workflow step implements scoring or pruning. The proposals's "score which parallel branches yielded the most information" logic does not exist in any runnable form. |
| **P4.2 Progress Visualization** | NOT IMPLEMENTED | No ASCII sparkline, progress bar, or convergence chart exists anywhere in the codebase. The closest is the state summary in dispatch (iteration count and ratio trend), but this is not a visualization. |
| **P4.3 True Context Isolation (claude -p)** | NOT IMPLEMENTED | The YAML workflow dispatches via Task tool (agent dispatch), not via `claude -p` shell command. The reference_only_appendix mentions "alternate claude -p dispatch" in the research boundaries section of strategy.md, but this is informational only. |
| **P4.4 Research Simplicity Criterion** | IMPLEMENTED | Actually, the agent definition DOES implement this. In Step 6 (Append State), there is a "Simplicity bonus" section: "If this iteration consolidates, simplifies, or resolves contradictions in prior findings -- even without new external information -- apply a +0.10 bonus to newInfoRatio (capped at 1.0)." Three specific triggers are listed: reducing open questions through synthesis, resolving contradictions, providing cleaner models. **REVISED to IMPLEMENTED.** |

[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:459-465 (wave reference)]
[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:153-156 (wave events)]
[SOURCE: .claude/agents/deep-research.md: Step 6 newInfoRatio calculation, simplicity bonus]

### Finding 5: Consolidated proposal status matrix (all 18)

| ID | Proposal | v2 Status | Current Implementation Status | Gap |
|----|----------|-----------|------------------------------|-----|
| P1.1 | Tiered Error Recovery | P1 Adopt Now | IMPLEMENTED | None -- 5-tier protocol in convergence.md |
| P1.2 | Composite Convergence | P1 Adopt Now | PARTIALLY IMPLEMENTED | Algorithm specified; convergenceSignals not recorded in JSONL |
| P1.3 | Exhausted Approaches Enhancement | P1 Adopt Now | IMPLEMENTED | None -- pre-check mandate + structured registry |
| P1.4 | State Recovery Fallback | P1 Adopt Now | IMPLEMENTED | None -- full recovery spec in state_format.md |
| P1.5 | JSONL Fault Tolerance | P1 Adopt Now | IMPLEMENTED | None -- fault-tolerant parsing in convergence.md + state_format.md |
| P2.1 | Enriched Stuck Recovery | P2 Adopt Next | PARTIALLY IMPLEMENTED | 3 strategies specified in convergence.md; orchestrator uses generic fallback |
| P2.2 | Ideas Backlog File | P2 Adopt Next | PARTIALLY IMPLEMENTED | Agent reads it; orchestrator does not inject into dispatch |
| P2.3 | Iteration Reflection | P1 (elevated) | IMPLEMENTED | None -- in template and actively used |
| P2.4 | Segment Partitioning | P2 Adopt Next | PARTIALLY IMPLEMENTED | Schema defined, marked reference-only, no runtime trigger |
| P2.5 | Scored Branching | P2 Adopt Next | NOT IMPLEMENTED | Reference-only event types defined, no live scoring |
| P2.6 | Sentinel Pause File | P2 Adopt Next | IMPLEMENTED | None -- pause check in YAML workflow |
| P3.1 | Statistical Validation | P3 Consider | PARTIALLY IMPLEMENTED | Algorithm in convergence.md; not invoked by orchestrator |
| P3.2 | Compact State Summary | P2 (elevated) | IMPLEMENTED | State summary generated in dispatch pre-prompt |
| P3.3 | Git Commit Per Iteration | P3 Consider | NOT IMPLEMENTED (deliberate) | Reference-only appendix, excluded by design choice |
| P4.1 | File Mutability Declarations | P4 Track | PARTIALLY IMPLEMENTED | Schema defined; not enforced at runtime |
| P4.2 | Progress Visualization | P3 (elevated) | NOT IMPLEMENTED | No visualization exists |
| P4.3 | True Context Isolation | P4 Track | NOT IMPLEMENTED | Task tool dispatch, not claude -p |
| P4.4 | Research Simplicity Criterion | P4 Track | IMPLEMENTED | Simplicity bonus in agent definition |

### Finding 6: The implementation gap pattern reveals a "spec-code gap" -- specifications written but orchestrator not wired

The dominant pattern across partially-implemented proposals is: **the algorithm/protocol is fully specified in the reference documents (convergence.md, state_format.md) but the YAML workflow orchestrator does not invoke or record the outputs.**

Specific instances of this gap:
- P1.2: Composite convergence algorithm is specified with pseudocode but convergenceSignals are not written to JSONL
- P2.1: Three recovery strategies with selection logic exist in convergence.md but the orchestrator uses a generic "widen scope" fallback
- P3.1: Statistical validation function is specified but never called
- P4.1: File protection schema is defined but not enforced

This suggests the next implementation phase should focus on **wiring the orchestrator to the existing specifications**, not writing new specifications.

[INFERENCE: based on systematic comparison of convergence.md/state_format.md specifications vs. YAML workflow step implementations]

## Sources Consulted
- `.opencode/skill/sk-deep-research/references/convergence.md` (local, full file)
- `.opencode/skill/sk-deep-research/references/state_format.md` (local, full file)
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` (local, full file)
- `.claude/agents/deep-research.md` (local, first 80 lines + system prompt content)
- `.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/scratch/improvement-proposals.md` (local, full file)
- `.opencode/specs/03--commands-and-skills/024-sk-deep-research-refinement/scratch/iteration-001.md` (local, for cross-referencing repo findings)

## Assessment
- New information ratio: 0.83
- Questions addressed: RQ3 (primary, fully answered), RQ4 (partial -- gap pattern discovery feeds into what we are missing)
- Questions answered: RQ3 is fully answered -- all 18 proposals have been cross-referenced against actual source code with status determination.

## Reflection
- What worked and why: Reading our OWN source files systematically (convergence.md, state_format.md, YAML workflow, agent definition) was the highest-yield approach. The proposals were written before implementation, so comparing them against current code reveals exactly what shipped and what didn't. This is a pure local-file research iteration -- no web fetches needed.
- What did not work and why: Nothing failed this iteration. The focus was well-scoped and all needed files were local.
- What I would do differently: For the reference repos, I would have done this cross-reference earlier (iteration 1 or 2) because it provides the ground truth baseline against which external repo findings become more meaningful.

## Recommended Next Focus
RQ4: Gap analysis -- what do the reference repos implement that our 18 proposals do NOT cover? Iteration 1 already identified pi-autoresearch's security hardening (prototype pollution prevention, command guard) as absent from our proposals. Iteration 2 identified AGR's variance-aware per-benchmark acceptance. Consolidate these into a list of "missing proposals" and assess whether any should become P1/P2 additions to the v3 proposal set. Also consider: the "spec-code gap" pattern suggests a new proposal category -- "wiring" proposals that close the gap between existing specs and orchestrator behavior.
