# Iteration 006 — Focus: Q6 Protocol Draft and YAML Step Ordering

## Focus
Convert iteration-005's proposed deep-research state machine into a concrete draft for `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`, then pin the exact auto-vs-confirm YAML insertion points for pre-init spec detection, lock handling, and post-synthesis `spec.md` write-back. The goal for this pass is not a new risk class; it is turning the prior contract into implementation-ready section headings, step IDs, and fail-closed exits. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:71-107] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:78-81]

## Findings
1. `step_detect_spec_present` should be inserted late in `phase_init`, after the runtime packet exists and just before INIT hands off to the loop, not near preflight. The current auto workflow only has a durable audit sink after `step_create_state_log`, and confirm mode's existing `gate_init_approval` assumes `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, and `findings-registry.json` already exist. That makes the clean insertion slot:
   - auto: after `step_enrich_strategy_context` and before `step_init_complete`
   - confirm: after `step_enrich_strategy_context` and before `gate_init_approval`

   This keeps spec detection inside INIT, but avoids leaving a half-created research packet if pre-init mutation fails. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:185-215] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:193-244] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:13-18]

2. The concrete single-writer contract should acquire the lock before session classification, hold it through pre-init mutation plus post-synthesis write-back, and release it only after save/completion cleanup. Iteration-005 already made lock acquisition a precondition for folder-state detection, and the older refinement proposal only differed on where to store the lock. Because the live YAML already creates `{spec_folder}/research/iterations` and `{spec_folder}/research/archive` but does not provision `scratch/` during init, the concrete draft should place the live lock at `{spec_folder}/research/.deep-research.lock` and insert `step_acquire_deep_research_lock` between `step_resolve_canonical_names` and `step_classify_session`, then `step_release_deep_research_lock` after `step_verify_save` (plus the matching early-failure cleanup path). A second live writer exits blocked; stale-lock override remains confirm-only or explicit recovery. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:112-164] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:13-16] [SOURCE: .opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md:188-198]

3. Generated-block conflicts should fail closed before config completion and before any memory save, and the authoritative audit sink is `research/deep-research-state.jsonl`. The packet spec already requires JSONL audit records for `spec.md` mutations, and both auto and confirm workflows already append lifecycle events to the JSONL log during init and synthesis. Combined with iteration-002's generated-block contract and iteration-003's fail-closed edge cases, the exact exit conditions are now clear:
   - missing or duplicate host anchor
   - missing, duplicate, or mismatched `BEGIN GENERATED` / `END GENERATED` markers
   - human edits inside the machine-owned block
   - semantic-purpose conflict detected during pre-init append

   Auto mode should append `spec_mutation_conflict` and halt `PARTIAL` before `step_update_config_status` or `phase_save`. Confirm mode should append the same event, surface a write-back approval/conflict gate, and refuse silent merge logic. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:158-160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:183-185] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:124-126] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:141-152] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:533-545] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-002.md:7-11] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md:7-10]

4. `step_update_spec_writeback` belongs in `phase_synthesis`, immediately after convergence reporting and before config completion, with confirm-mode approval inserted ahead of the write step. In auto mode, the current phase boundary is `step_convergence_report` -> `step_update_config_status` -> `phase_save`; the new write-back step should sit in the middle so the spec sync is treated as part of synthesis completion, not as a memory-save side effect. Confirm mode needs the same positional slot, but because the packet spec requires confirmation around every `spec.md` mutation, it also needs a dedicated `gate_spec_writeback_approval` between `step_convergence_report` and `step_update_spec_writeback`, leaving the existing `gate_post_synthesis` as the save-to-memory decision gate. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:533-572] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:638-697] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-125] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:143-145]

5. The protocol file can now be drafted as eight sections that map directly onto the step ordering above and keep Q6 bounded to deep-research's own contract rather than bleeding into `/start` or parent-command setup behavior. The resulting outline below is concrete enough to hand to implementation without inventing new abstractions, and it matches the packet scope that already calls for a new `spec_check_protocol.md` reference under `sk-deep-research`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:78-81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:151-159]

### DRAFT: `spec_check_protocol.md`

1. **Preflight detection**
   - Define inputs: `research_topic`, `spec_folder`, `execution_mode`, active session lineage.
   - Require canonical path resolution first, then lock acquisition, then folder/session classification.
   - State that `step_detect_spec_present` runs only after config, JSONL, strategy, and registry exist.

2. **Create branch**
   - `folder_state = no-spec`
   - Seed Level 1 `spec.md` from research topic.
   - Emit `spec_check_result` then `spec_seed_created`.

3. **Update branch**
   - `folder_state = spec-present`
   - Append only the pre-init research question/context note.
   - Emit `spec_check_result` then `spec_preinit_context_added`.

4. **Write-back contract**
   - Host anchor: existing `spec.md` anchor only.
   - Machine-owned span: one fenced generated subsection for research findings.
   - Source of truth remains `research/research.md`; write-back is abridged sync only.

5. **Idempotency guards**
   - Normalize topic before pre-init append.
   - Require exactly one findings block label.
   - Same normalized topic and same generated block content resolve to no-op, not duplicate output.

6. **Lock file semantics**
   - Live file: `{spec_folder}/research/.deep-research.lock`
   - Acquire before `step_classify_session`.
   - Hold through synthesis write-back and release after `phase_save` / completion cleanup.
   - Stale-lock override is confirm/recovery only.

7. **Conflict exits**
   - Missing or duplicate anchor
   - Marker drift or human edits inside generated block
   - Semantic-purpose conflict during pre-init append
   - Temp-write / rename failure during write-back
   - All conflict paths append JSONL audit events and fail closed.

8. **Audit events**
   - Runtime sink: `research/deep-research-state.jsonl`
   - Minimum events: `spec_check_result`, `spec_seed_created`, `spec_preinit_context_added`, `spec_mutation`, `spec_mutation_conflict`, `spec_synthesis_deferred`
   - Explicitly note that `/start` / `/plan` / `/complete` delegation events are sibling command concerns, not owned by this deep-research protocol file.

### Exact YAML Step Ordering

**Auto mode**

`phase_init`
1. `step_preflight_contract` [.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:103-110]
2. `step_create_directories` [112-114]
3. `step_resolve_canonical_names` [116-126]
4. `step_acquire_deep_research_lock` [NEW, insert here]
5. `step_classify_session` [128-164]
6. `step_create_config` [165-183]
7. `step_create_state_log` [185-188]
8. `step_create_strategy` [190-200]
9. `step_create_registry` [202-205]
10. `step_enrich_strategy_context` [207-211]
11. `step_detect_spec_present` [NEW, insert here]
12. `step_seed_spec_from_topic` or `step_append_spec_preinit_context` [NEW]
13. `step_init_complete` [213-215]

`phase_synthesis`
1. `step_hydrate_summary_metrics` [.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:489-508]
2. `step_read_all_iterations` [510-513]
3. `step_compile_research` [515-531]
4. `step_convergence_report` [533-545]
5. `step_update_spec_writeback` [NEW, insert here]
6. `step_update_config_status` [546-549]
7. `phase_save` unchanged starts at [554-572]
8. `step_release_deep_research_lock` [NEW, append after `step_verify_save`]

**Confirm mode**

`phase_init`
1. `step_preflight_contract` [.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:103-110]
2. `step_create_directories` [112-114]
3. `step_resolve_canonical_names` [116-126]
4. `step_acquire_deep_research_lock` [NEW, insert here]
5. `step_classify_session` [128-171]
6. `step_create_config` [173-191]
7. `step_create_state_log` [193-196]
8. `step_create_strategy` [198-208]
9. `step_create_registry` [210-213]
10. `step_enrich_strategy_context` [215-219]
11. `step_detect_spec_present` [NEW, insert here]
12. `gate_spec_preinit_approval` [NEW, confirm-only]
13. `step_seed_spec_from_topic` or `step_append_spec_preinit_context` [NEW]
14. `gate_init_approval` [221-244]

`phase_synthesis`
1. `step_hydrate_summary_metrics` [.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:571-590]
2. `gate_pre_synthesis` [592-613]
3. `step_read_all_iterations` [615-618]
4. `step_compile_research` [620-636]
5. `step_convergence_report` [638-649]
6. `gate_spec_writeback_approval` [NEW, confirm-only]
7. `step_update_spec_writeback` [NEW, insert here]
8. `step_update_config_status` [651-654]
9. `gate_post_synthesis` [656-674]
10. `phase_save` unchanged starts at [679-697]
11. `step_release_deep_research_lock` [NEW, append after `step_verify_save`]

## Ruled Out
- Inserting `step_detect_spec_present` before JSONL creation and forcing pre-init mutation to run without a durable audit sink.
- Keeping the older `scratch/.deep-research.lock` location as-is when the live init workflow now guarantees `research/` but not `scratch/`.
- Treating post-synthesis write-back as a save-phase side effect after config completion instead of a synthesis-phase success criterion.

## Dead Ends
- The live repo still has no ready-made `spec.md` mutator in `/spec_kit:deep-research`, so the protocol shape had to be synthesized from the current YAML lifecycle plus prior packet findings rather than copied from an implementation.
- Existing parent-command intake/delegation audit events remain a sibling concern; this pass could only pin the deep-research-side runtime sink, not a finished `/start` or `/plan` logging surface.
- Older lock guidance referenced now-obsolete `step_initialize` / `step_finalize` names, so it was useful for semantics but not for exact step IDs.

## Sources
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md`

## Assessment
- `findingsCount`: `5`
- `newInfoRatio`: `0.23`
- Questions addressed: `Q3`, `Q5`, `Q6`
- Questions answered: `[]`
- Main delta: this pass converts the earlier state-machine proposal into a concrete protocol outline, exact insertion indices, and explicit auto-vs-confirm conflict exits.

## Reflection
- What worked: reading the live YAML step order end-to-end made it obvious that auditability and packet consistency matter more than pushing spec detection as early as possible.
- What failed: the current command surfaces only expose deep-research JSONL logging, so the broader `/start` / parent-command audit sink still has to be specified elsewhere in the packet.
- What to do differently: the next pass should test whether the proposed confirm-only gates can reuse existing approval-gate phrasing patterns without bloating the command transcript.

## Next Focus
Check whether the proposed `research/.deep-research.lock`, pre-init approval gate, and post-synthesis write-back gate can be expressed as small deltas against the current YAML/markdown command docs, then map any remaining gaps back onto `REQ-001` through `REQ-010` before implementation work starts.
