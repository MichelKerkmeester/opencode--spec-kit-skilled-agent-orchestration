# Iteration 007 — Focus: Concrete Diff Hunks and REQ Coverage Matrix

## Focus
Express the previously proposed `research/.deep-research.lock`, pre-init approval gate, and post-synthesis `spec.md` write-back as minimal deltas against the live markdown and YAML command surfaces, then map those deltas against `REQ-001` through `REQ-010` so an implementer can apply them with minimal interpretation.

## Findings
1. The smallest safe lock delta is to make the live lock path explicit in the command assets and keep the lock advisory, exclusive, and fail-closed. The current deep-research assets already centralize research packet paths under `state_paths`, and macOS/BSD local man pages confirm both `flock()` and `fcntl()` record locking are advisory rather than mandatory. That means iteration-006's direction is sound: add `{spec_folder}/research/.deep-research.lock`, acquire it before session classification, fail with non-blocking lock contention, and reserve stale-lock override for explicit recovery or confirm-mode approval rather than attempting mandatory locking. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:87-89] [SOURCE: local `man 2 flock` output captured in this iteration] [SOURCE: local `man 2 fcntl` output captured in this iteration]

2. The pre-init spec check should stay late in `phase_init`, after the durable research packet exists but before loop entry. That placement preserves the append-only JSONL sink and the existing init gate shape, while still satisfying the spec requirement that `spec.md` creation or update happens before any iteration dispatch. The exact slots remain the same as iteration 006: auto mode inserts the spec-check steps after `step_enrich_strategy_context` and before `step_init_complete`, while confirm mode inserts the same steps in that slot and then adds a dedicated approval gate before the existing `gate_init_approval`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:207-215] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:215-244] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-124] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-006.md:6-19]

3. Post-synthesis `spec.md` write-back belongs in synthesis, not save, and confirm mode needs a distinct approval gate for it. The packet spec already treats post-synthesis write-back as part of the deep-research mutation contract, and the strategy's exhausted approaches explicitly rule out moving it into `phase_save`. The concrete consequence is: insert a `step_write_spec_findings` immediately after the research synthesis step and before config completion, then in confirm mode present a `gate_post_synthesis_spec_writeback` before the existing memory-save approval. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:123-125] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md:257-260] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:615-674] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-006.md:20-48]

4. The markdown command card needs only a small contract expansion, not a rewrite. Today `deep-research.md` still describes outputs as `research/research.md` plus state files and says nothing about spec-bound mutation, lock ownership, or confirm-mode spec approvals. A minimal doc patch can update the phase table and "After Completing" guidance so the YAML changes are discoverable without inventing new sections or renaming the command lifecycle. [SOURCE: .opencode/command/spec_kit/deep-research.md:149-154] [SOURCE: .opencode/command/spec_kit/deep-research.md:170-173] [SOURCE: .opencode/command/spec_kit/deep-research.md:207-209] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:78-81]

5. `plan.md` and `complete.md` need only reservation-level documentation deltas in this iteration, not full delegated `/start` runtime wiring. The live setup prompts and parsed-field lists do not yet reserve any fields for inline `/start` outcomes, so the minimal change is to document the extra values that parent commands must carry once the actual `/start` YAML work lands. This supports `REQ-006` framing, but the full runtime behavior still depends on follow-on asset deltas in `spec_kit_plan_*.yaml`, `spec_kit_complete_*.yaml`, and the new `/spec_kit:start` files. [SOURCE: .opencode/command/spec_kit/plan.md:78-130] [SOURCE: .opencode/command/spec_kit/complete.md:81-134] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:125-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:24-35]

6. The current packet can now distinguish which requirements these deltas satisfy directly versus which remain blocked on `/start` implementation work. The deep-research lock, pre-init branch, and post-synthesis gate cover `REQ-001`, `REQ-002`, `REQ-003`, `REQ-004`, and `REQ-010` at the contract level, while `REQ-005`, `REQ-007`, `REQ-008`, and most of `REQ-009` still require `/spec_kit:start` markdown/YAML assets. `REQ-006` is only partially covered here because the parent command cards can reserve fields, but delegation cannot be proven until the plan/complete YAML assets are patched too. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:11-22] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-006.md:6-48]

## Exact Insertion Points
1. `D1` — `.opencode/command/spec_kit/deep-research.md` after line 153, inside the phase table.

```md
150 | Phase | Name | Purpose | Outputs |
151 |-------|------|---------|---------|
152 | Init | Initialize | Create config, strategy (with research charter), state files | State files in `research/` |
153 | Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, deep-research-dashboard.md |
154 | Synth | Synthesize | Compile final research/research.md | research/research.md (17 sections) |
155 | Save | Preserve | Refresh continuity support artifact | support artifact generated via `generate-context.js` |
156 |
157 | ### Execution Modes
```

2. `D2` — `.opencode/command/spec_kit/deep-research.md` after line 208, inside "After Completing".

```md
205 - Inject discovered code patterns into strategy.md "Known Context" section alongside memory findings
206 
207 ### After Completing
208 - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`
209 - Verify that `{spec_folder}/memory/` contains the generated memory artifact
210 
211 ---
212 
```

3. `D3` — `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` after line 85, inside `state_paths`.

```yaml
82   strategy: "{spec_folder}/research/deep-research-strategy.md"
83   registry: "{spec_folder}/research/findings-registry.json"
84   dashboard: "{spec_folder}/research/deep-research-dashboard.md"
85   pause_sentinel: "{spec_folder}/research/.deep-research-pause"
86   archive_root: "{spec_folder}/research/archive"
87   synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
88   iteration_pattern: "{spec_folder}/research/iterations/iteration-{NNN}.md"
89   research_output: "{spec_folder}/research/research.md"
```

4. `D4` — `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` between lines 126 and 128, then again between lines 211 and 213.

```yaml
123         migration_policy: "dual-read / single-write for 4 weeks"
124         on_legacy_read:
125           append_jsonl: '{"type":"event","event":"migration","legacyPath":"{legacy_path}","canonicalPath":"{canonical_path}","timestamp":"{ISO_8601_NOW}"}'
126
127       step_classify_session:
128         action: "Classify the session before writing files"
129         inspect:
```

```yaml
208         action: "Ensure Known Context is written only after strategy.md exists"
209         condition: "prior_context_found"
210         edit: "{spec_folder}/research/deep-research-strategy.md"
211         note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
212
213       step_init_complete:
214         log: "Initialization complete. Config, state, and strategy files created."
215         set: { current_iteration: 1, current_segment: 1, stuck_count: 0 }
```

5. `D5` — `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` in the synthesis seam around the current `step_compile_research -> step_update_config_status` region, currently line-backed by the key scan at approximately lines 620-651.

```yaml
615       step_read_all_iterations:
616         action: "Read all iteration files and strategy"
617         read_pattern: "{spec_folder}/research/iterations/iteration-*.md"
618         read_also: "{spec_folder}/research/deep-research-strategy.md"
619
620       step_compile_research:
621         action: "Compile or finalize research/research.md"
...
649         append_to_jsonl: '{"type":"event","event":"synthesis_complete",...}'
650
651       step_update_config_status:
652         action: "Mark config as complete"
```

6. `D6` — `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` after line 89, inside `state_paths`.

```yaml
86   archive_root: "{spec_folder}/research/archive"
87   synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
88   iteration_pattern: "{spec_folder}/research/iterations/iteration-{NNN}.md"
89   research_output: "{spec_folder}/research/research.md"
90
91 # ─────────────────────────────────────────────────────────────────
92 # WORKFLOW
93 # ─────────────────────────────────────────────────────────────────
```

7. `D7` — `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` between lines 126 and 128, then again between lines 219 and 221.

```yaml
123         migration_policy: "dual-read / single-write for 4 weeks"
124         on_legacy_read:
125           append_jsonl: '{"type":"event","event":"migration","legacyPath":"{legacy_path}","canonicalPath":"{canonical_path}","timestamp":"{ISO_8601_NOW}"}'
126
127       step_classify_session:
128         action: "Classify the session before writing files"
129         inspect:
```

```yaml
216         action: "Ensure Known Context is written only after strategy.md exists"
217         condition: "prior_context_found"
218         edit: "{spec_folder}/research/deep-research-strategy.md"
219         note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
220
221       # ─── APPROVAL GATE: Post-Init ───
222       gate_init_approval:
223         type: approval_gate
```

8. `D8` — `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` between lines 649 and 651, then again between lines 655 and 657.

```yaml
646         - Last 3 iteration summaries: {last_3_summaries}
647         - Convergence threshold: {convergence_threshold}
648         - Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
649       append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
650
651       step_update_config_status:
652         action: "Mark config as complete"
653         edit: "{spec_folder}/research/deep-research-config.json"
```

```yaml
653         edit: "{spec_folder}/research/deep-research-config.json"
654         set_field: { status: "complete" }
655
656       # ─── APPROVAL GATE: Post-Synthesis ───
657       gate_post_synthesis:
658         type: approval_gate
659         purpose: "Show synthesis results and get approval"
```

9. `D9` — `.opencode/command/spec_kit/plan.md` after line 123 in the parsed-response list, and `.opencode/command/spec_kit/complete.md` after line 129 in the corresponding list.

```md
116 8. Parse response and store ALL results:
117    - feature_description = [from Q0 or $ARGUMENTS]
118    - spec_choice = [A/B/C/D/E from Q1]
119    - spec_path = [derived path or null if D]
120    - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
121    - dispatch_mode = [single/multi_small/multi_large from Q3]
122    - memory_choice = [A/B/C from Q4, or N/A]
123    - research_intent = [add_feature/fix_bug/refactor/understand from Q5]
124
125 9. Execute background operations:
```

```md
119 8. Parse response and store ALL results:
120    - feature_description = [from Q0 or $ARGUMENTS]
121    - spec_choice = [A/B/C/D/E from Q1]
122    - spec_path = [derived path or null if D]
123    - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
124    - dispatch_mode = [single/multi_small/multi_large from Q3]
125    - memory_choice = [A/B/C from Q4, or N/A]
126    - research_intent = [add_feature/fix_bug/refactor/understand from Q5]
127    - phase_decomposition = [TRUE/FALSE]
128    - phase_count = [from Q6 or --phases, default 3]
129    - phase_names = [from Q7 or --phase-names, or null for auto-generate]
130
131 9. Execute background operations:
```

## REQ x DELTA Coverage Matrix
| REQ | Delta IDs | Coverage | Notes |
|-----|-----------|----------|-------|
| REQ-001 | D3, D4, D6, D7 | Full | Adds explicit `lock_file`, spec-check branch placement, and pre-loop detection contract. |
| REQ-002 | D4, D7 | Full | Auto and confirm init seams now have a concrete place for seed-create before loop entry. |
| REQ-003 | D4, D7 | Full | Existing-spec update becomes a named pre-init mutation branch with fail-closed conflict handling. |
| REQ-004 | D1, D2, D5, D8 | Full | Markdown surface plus synthesis seams define post-synthesis write-back before save. |
| REQ-005 | none | Gap | `/spec_kit:start` files are still required. |
| REQ-006 | D9 | Partial | Parent command docs can reserve fields, but runtime delegation still needs plan/complete YAML asset work. |
| REQ-007 | none | Gap | Manual relationship capture remains `/start`-owned. |
| REQ-008 | none | Gap | Level recommendation/override is still `/start`-owned. |
| REQ-009 | D6, D7, D9 | Partial | Confirms mode-parity approach, but full `/start:auto` and `/start:confirm` assets are still missing. |
| REQ-010 | D4, D5, D7, D8 | Full | Generated markers plus conflict exits give a concrete idempotent mutation shape. |

## Concrete Diff Hunks
### D1 — phase table advertises spec-bound mutation
```diff
--- a/.opencode/command/spec_kit/deep-research.md
+++ b/.opencode/command/spec_kit/deep-research.md
@@
-| Init | Initialize | Create config, strategy (with research charter), state files | State files in `research/` |
-| Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, deep-research-dashboard.md |
-| Synth | Synthesize | Compile final research/research.md | research/research.md (17 sections) |
+| Init | Initialize | Create config, strategy, state files, and pre-loop spec-check contract | State files in `research/` plus spec-check audit events |
+| Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, deep-research-dashboard.md |
+| Synth | Synthesize | Compile final research/research.md and perform bounded post-synthesis spec write-back | research/research.md plus anchor-bounded `spec.md` findings block |
 | Save | Preserve | Refresh continuity support artifact | support artifact generated via `generate-context.js` |
```

### D2 — command card calls out lock ownership and spec mutation before memory save
```diff
--- a/.opencode/command/spec_kit/deep-research.md
+++ b/.opencode/command/spec_kit/deep-research.md
@@
 ### After Completing
+- Release `{spec_folder}/research/.deep-research.lock` only after post-synthesis `spec.md` write-back and any memory-save or cancel path has resolved.
+- Verify that `spec.md` reflects either the seed-create path or the generated "Research Findings" block before treating synthesis as complete.
 - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`
 - Verify that `{spec_folder}/memory/` contains the generated memory artifact
```

### D3 — auto YAML gets an explicit lock path
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
@@
   dashboard: "{spec_folder}/research/deep-research-dashboard.md"
   pause_sentinel: "{spec_folder}/research/.deep-research-pause"
+  lock_file: "{spec_folder}/research/.deep-research.lock"
   archive_root: "{spec_folder}/research/archive"
   synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
   iteration_pattern: "{spec_folder}/research/iterations/iteration-{NNN}.md"
```

### D4 — auto YAML acquires the lock and performs pre-init spec check before loop entry
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
@@
       step_resolve_canonical_names:
         action: "Resolve canonical research packet artifact names before classification"
         inspect_legacy:
           - "{spec_folder}/research/config.json"
           - "{spec_folder}/research/state.jsonl"
           - "{spec_folder}/research/strategy.md"
+
+      step_acquire_deep_research_lock:
+        action: "Acquire advisory exclusive lock for this research packet"
+        command: "open {state_paths.lock_file} with LOCK_EX|LOCK_NB; on contention fail closed with STATUS=BLOCKED"
+        append_jsonl: '{"type":"event","event":"lock_acquired","path":"{state_paths.lock_file}","run":0,"timestamp":"{ISO_8601_NOW}"}'
@@
       step_enrich_strategy_context:
         action: "Ensure Known Context is written only after strategy.md exists"
         condition: "prior_context_found"
         edit: "{spec_folder}/research/deep-research-strategy.md"
         note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
+
+      step_detect_spec_present:
+        action: "Inspect spec.md and classify pre-loop spec mutation path"
+        inspect:
+          - "{spec_folder}/spec.md"
+        outputs:
+          - spec_present: "true | false"
+          - spec_mutation_mode: "seed_create | preinit_update | conflict"
+        append_jsonl: '{"type":"event","event":"spec_check_result","specPath":"{spec_folder}/spec.md","specPresent":{spec_present},"mode":"{spec_mutation_mode}","run":0,"timestamp":"{ISO_8601_NOW}"}'
+
+      step_seed_or_update_spec:
+        action: "Create or update spec.md before loop entry"
+        on_seed_create: "Create Level 1 spec.md from research topic with TODO placeholders in Scope and Requirements"
+        on_preinit_update: "Append normalized topic to questions anchor and add fenced Research Context note under Purpose"
+        on_conflict: "Halt with STATUS=BLOCKED and exact repair guidance"
 
       step_init_complete:
         log: "Initialization complete. Config, state, and strategy files created."
         set: { current_iteration: 1, current_segment: 1, stuck_count: 0 }
```

### D5 — auto YAML writes back findings during synthesis, before config completion
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
@@
       step_compile_research:
         action: "Compile or finalize research/research.md"
         output: "{spec_folder}/research/research.md"
+
+      step_write_spec_findings:
+        action: "Write bounded post-synthesis findings back to spec.md"
+        edit: "{spec_folder}/spec.md"
+        instructions: "Replace or create the generated Research Findings span under Risks & Dependencies, linking back to research/research.md; fail closed on marker drift"
+        append_to_jsonl: '{"type":"event","event":"spec_mutation","phase":"post_synthesis","specPath":"{spec_folder}/spec.md","mode":"write_findings","run":{current_iteration},"timestamp":"{ISO_8601_NOW}"}'
 
       step_update_config_status:
         action: "Mark config as complete"
```

### D6 — confirm YAML gets the same explicit lock path
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
@@
   synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
   iteration_pattern: "{spec_folder}/research/iterations/iteration-{NNN}.md"
   research_output: "{spec_folder}/research/research.md"
+  lock_file: "{spec_folder}/research/.deep-research.lock"
 
 # ─────────────────────────────────────────────────────────────────
 # WORKFLOW
```

### D7 — confirm YAML adds lock acquisition, pre-init mutation, and a dedicated approval gate
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
@@
       step_resolve_canonical_names:
         action: "Resolve canonical research packet artifact names before classification"
         inspect_legacy:
           - "{spec_folder}/research/config.json"
           - "{spec_folder}/research/state.jsonl"
+
+      step_acquire_deep_research_lock:
+        action: "Acquire advisory exclusive lock for this research packet"
+        command: "open {state_paths.lock_file} with LOCK_EX|LOCK_NB; if locked, stop and present recovery choices"
@@
       step_enrich_strategy_context:
         action: "Ensure Known Context is written only after strategy.md exists"
         condition: "prior_context_found"
         edit: "{spec_folder}/research/deep-research-strategy.md"
         note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
+
+      step_detect_spec_present:
+        action: "Inspect spec.md and prepare the pre-loop mutation plan"
+        outputs:
+          - spec_present: "true | false"
+          - spec_mutation_mode: "seed_create | preinit_update | conflict"
+
+      gate_pre_loop_spec_mutation_approval:
+        type: approval_gate
+        purpose: "Show planned spec.md mutation before any iteration starts"
+        present: |
+          ## Pre-Loop Spec Mutation
+          **Spec path**: {spec_folder}/spec.md
+          **Mode**: {spec_mutation_mode}
+          **Lock file**: {state_paths.lock_file}
+          Options:
+          A) Approve mutation and continue
+          B) Adjust mutation mode / topic wording
+          C) Cancel
+        on_A: { proceed_to: step_seed_or_update_spec }
+        on_B: { action: "Revise mutation inputs", return_to: gate_pre_loop_spec_mutation_approval }
+        on_C: { action: "Cancel workflow", status: "CANCELLED" }
+
+      step_seed_or_update_spec:
+        action: "Create or update spec.md before loop entry"
+        on_conflict: "Stop and surface exact anchor or semantic conflict"
 
       # ─── APPROVAL GATE: Post-Init ───
       gate_init_approval:
```

### D8 — confirm YAML adds a distinct post-synthesis write-back gate before save approval
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
@@
       step_convergence_report:
         action: "Generate and append convergence report"
         append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
+
+      step_write_spec_findings:
+        action: "Prepare bounded post-synthesis findings write-back"
+        edit: "{spec_folder}/spec.md"
+        instructions: "Replace or create the generated Research Findings span under Risks & Dependencies; fail closed on marker drift"
+
+      gate_post_synthesis_spec_writeback:
+        type: approval_gate
+        purpose: "Approve spec.md write-back before memory save"
+        present: |
+          ## Post-Synthesis Spec Update
+          **Source of truth**: `{spec_folder}/research/research.md`
+          **Target**: `{spec_folder}/spec.md`
+          Options:
+          A) Approve spec.md update
+          B) Revise research/research.md first
+          C) Skip spec.md update and keep synthesis partial
+        on_A: { proceed_to: step_update_config_status }
+        on_B: { action: "Apply synthesis revisions", return_to: gate_post_synthesis_spec_writeback }
+        on_C: { append_to_jsonl: '{"type":"event","event":"spec_synthesis_deferred","specPath":"{spec_folder}/spec.md","reason":"user_skipped_writeback","run":{current_iteration},"timestamp":"{ISO_8601_NOW}"}', proceed_to: gate_post_synthesis }
 
       step_update_config_status:
         action: "Mark config as complete"
@@
       # ─── APPROVAL GATE: Post-Synthesis ───
       gate_post_synthesis:
         type: approval_gate
         purpose: "Show synthesis results and get approval"
```

### D9 — parent command cards reserve delegated `/start` outputs without changing the question count yet
```diff
--- a/.opencode/command/spec_kit/plan.md
+++ b/.opencode/command/spec_kit/plan.md
@@
    - memory_choice = [A/B/C from Q4, or N/A]
    - research_intent = [add_feature/fix_bug/refactor/understand from Q5]
+   - delegated_start_state = [none/no-spec/partial-folder/repair-mode/unresolved-todo-reentry]
+   - selected_level = [recommendation or override from delegated /start]
+   - manual_relationships = [depends_on[]/related_to[]/supersedes[] or null]
 
 9. Execute background operations:
```

```diff
--- a/.opencode/command/spec_kit/complete.md
+++ b/.opencode/command/spec_kit/complete.md
@@
    - research_intent = [add_feature/fix_bug/refactor/understand from Q5]
    - phase_decomposition = [TRUE/FALSE]
    - phase_count = [from Q6 or --phases, default 3]
    - phase_names = [from Q7 or --phase-names, or null for auto-generate]
+   - delegated_start_state = [none/no-spec/partial-folder/repair-mode/unresolved-todo-reentry]
+   - selected_level = [recommendation or override from delegated /start]
+   - manual_relationships = [depends_on[]/related_to[]/supersedes[] or null]
 
 9. Execute background operations:
```

## Gap Analysis
| REQ | Gap Type | Why the gap remains | Recommendation |
|-----|----------|---------------------|----------------|
| REQ-005 | No delta yet | `/spec_kit:start` markdown and both YAML variants do not exist in the current command surface. | (a) New delta: create `start.md`, `spec_kit_start_auto.yaml`, and `spec_kit_start_confirm.yaml`. |
| REQ-006 | Partial | `plan.md` and `complete.md` can reserve fields, but inline `/start` delegation still lacks the actual YAML branches in `spec_kit_plan_*` and `spec_kit_complete_*`. | (a) New delta: add parent-command asset branches; do not downgrade. |
| REQ-007 | No delta yet | Manual relationship capture is entirely `/start`-owned, so these deep-research and parent-command card changes cannot satisfy it. | (a) New delta in `/start` assets; keep as P1. |
| REQ-008 | No delta yet | Level recommendation and override live in `/start` interview flow, not in the deep-research or parent command cards. | (a) New delta in `/start` assets; keep as P1. |
| REQ-009 | Partial | This iteration only proves mode parity for deep-research confirm vs auto and parent field carry-through. The actual `/start:auto` and `/start:confirm` assets are still missing. | (c) Reword acceptance criteria temporarily to distinguish "deep-research parity" from "`/start` parity", or keep as partial until `/start` assets land. |
| REQ-010 | Small residual gap | The diff hunks define generated spans and conflict exits, but the exact normalization rule for "same topic" is still only implied. | (a) New delta: add `normalized_topic` field and dedupe rule to `spec_check_protocol.md`; keep P1/P0 status unchanged. |

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
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-006.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/complete.md`
- Local `man 2 flock`
- Local `man 2 fcntl`

## Assessment
- `findingsCount`: `6`
- `newInfoRatio`: `0.18`
- Main novelty: this pass did not change the selected protocol, but it converted it into line-anchored hunks, a REQ-by-REQ coverage matrix, and a concrete statement that advisory locking on macOS/BSD is the right fit for this workflow.
- Next focus: turn the remaining `/start`-owned gaps into a similarly line-anchored delta plan for `start.md`, `spec_kit_start_auto.yaml`, `spec_kit_start_confirm.yaml`, and the missing `plan` / `complete` asset branches.
