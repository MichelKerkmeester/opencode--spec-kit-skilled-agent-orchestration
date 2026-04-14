# Iteration 005 — Focus: Acceptance Criteria, State Machines, and Q1 Failure Modes

## Focus
Translate iteration-004's delegation and interview-shape answer into packet-ready acceptance criteria and explicit state-machine language, with special attention to inline `/spec_kit:start` field names, repair-mode branching, unresolved-TODO re-entry from deep-research placeholder specs, and the exact audit events needed to keep `REQ-006`, `REQ-007`, and `REQ-009` enforceable. Close `Q1` briefly by checking whether common CLI interview failure modes introduce any new risk class beyond the packet's existing edge cases. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-135]

## Findings
1. `REQ-001` through `REQ-010` split cleanly into state-machine requirements vs one-shot functional checks, and the gaps are now specific enough to write acceptance-language deltas instead of broad "add edge cases" notes. The best local precedent for making stateful behavior explicit is the repo's YAML state/circuit-breaker pattern, while the packet spec already names the branch-heavy paths: empty folder, repair mode, interrupted synthesis, delegated `/start`, and deep-research placeholders. Recommendation: classify `REQ-001`, `REQ-002`, `REQ-003`, `REQ-004`, `REQ-006`, `REQ-007`, `REQ-009`, and `REQ-010` as STATE-MACHINE requirements; keep `REQ-005` and `REQ-008` as FUNCTIONAL requirements with transactional assertions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:200-214] [SOURCE: .opencode/command/create/assets/create_sk_skill_auto.yaml:464-474]

   Acceptance-criteria deltas:

   | REQ | Semantic class | Delta needed to make it testable |
   |-----|----------------|----------------------------------|
   | `REQ-001` | STATE-MACHINE | Detection happens only after folder scan and lock/lease acquisition; result must classify `folder_state` as `no-spec`, `partial-folder`, `repair-mode`, or `spec-present` before INIT continues. |
   | `REQ-002` | STATE-MACHINE | `no-spec -> spec-seeded` transition must emit the placeholder anchors created, and LOOP entry is blocked until `spec.md` exists plus the metadata transaction either succeeds or fails closed with recovery output. |
   | `REQ-003` | STATE-MACHINE | Existing-spec pre-init update must define the conflict exit: missing/duplicate `<!-- ANCHOR:questions -->`, semantic-purpose conflict, or machine-block drift sends the run to `conflict-detected` instead of heuristic repair. |
   | `REQ-004` | STATE-MACHINE | Post-synthesis write-back must require exactly one generated findings span and fail closed on marker drift; success criteria must include `spec_mutation` audit payload and a deferred state when synthesis ends before write-back. |
   | `REQ-005` | FUNCTIONAL | Keep the three-artifact contract, but add a transactional acceptance check: either all three canonical artifacts exist at exit or the command surfaces the exact repair step and leaves `start_state=partial-folder`. |
   | `REQ-006` | STATE-MACHINE | Parent commands must inject `/start` only when `folder_state` is `no-spec`, `partial-folder`, `repair-mode`, or `unresolved-todo-reentry`; success is not "questions asked" but "parent resumes with `feature_description`, `spec_path`, `selected_level`, `repair_mode`, and `manual_relationships` populated". |
   | `REQ-007` | STATE-MACHINE | The relationship branch needs explicit yes/no gating, dedupe rules, and repair/resume semantics so repeated delegated runs do not duplicate `manual.*` entries. |
   | `REQ-008` | FUNCTIONAL | Keep recommendation/override behavior, but acceptance should assert the stored pair: `level_recommendation` and `selected_level`, plus a fallback record when `recommend-level.sh` fails. |
   | `REQ-009` | STATE-MACHINE | `:auto` and `:confirm` must share the same state graph and differ only in question gating plus approval checkpoints; auto cannot skip repair/conflict detection, only optional prompts. |
   | `REQ-010` | STATE-MACHINE | Idempotency must cover rerun branches: same normalized topic, same generated block label, same relationship targets, and same placeholder re-entry reason do not duplicate output. |

2. The inline `/start` intake block can reuse the parent command vocabulary if it returns a narrow packet-creation schema instead of inventing a second command-local namespace. `plan.md` and `complete.md` already normalize `feature_description`, `spec_path`, `execution_mode`, and `dispatch_mode`, while iteration-004 already narrowed `/start` ownership to packet-creation inputs. Recommendation: the injected `/start` block should write into existing parent fields where they already exist and add only a small set of start-specific fields: `start_state`, `repair_mode`, `selected_level`, `manual_relationships`, `resume_question_id`, and `reentry_reason`. [SOURCE: .opencode/command/spec_kit/plan.md:117-121] [SOURCE: .opencode/command/spec_kit/plan.md:141-142] [SOURCE: .opencode/command/spec_kit/complete.md:120-124] [SOURCE: .opencode/command/spec_kit/complete.md:147-148] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md]

   Proposed inline field contract:

   | Prompt slot | Captured field(s) | Notes |
   |-------------|-------------------|-------|
   | `QS0` | `feature_description` | Ask only when the parent command did not already collect it. |
   | `QS1` | `spec_path`, `start_state`, `repair_mode` | Chooses `create`, `repair`, `resume_partial`, `upgrade_placeholders`, or `abort`. |
   | `QS2` | `level_recommendation`, `selected_level` | `selected_level` may equal the recommendation or an override. |
   | `QS3` | `collect_relationships` | Boolean gate only. |
   | `QS4+` | `manual_relationships.depends_on[]`, `manual_relationships.related_to[]`, `manual_relationships.supersedes[]` | Each entry stores `target`, `reason`, and `source`. |
   | Re-entry only | `resume_question_id`, `reentry_reason` | Used when a prior run aborted or deep-research placeholders are still unresolved. |

3. `/spec_kit:start` needs a real state machine, not just a list of edge cases, because repair-mode and deep-research placeholder upgrade are entry states, not exceptions. The packet spec already distinguishes `repair mode`, `partial state`, `user aborts mid-interview`, and "deep-research-authored placeholders"; the missing piece is to define entry/exit conditions so `/plan` and `/complete` can reuse the same branch logic. The most important rule is that unresolved TODOs from a deep-research-seeded Level 1 spec must be treated as `repair-mode` re-entry, not as a healthy populated folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:159-160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:200-214] [SOURCE: .opencode/command/spec_kit/complete.md:306-311]

   Proposed `/spec_kit:start` state machine:

   ```text
   scan_folder
     -> empty-folder
        entry: no canonical artifacts except optional scratch/ or memory/
        on start/create -> partial-folder
     -> partial-folder
        entry: some but not all canonical artifacts exist, or prior intake checkpoint exists
        on resume -> partial-folder
        on explicit repair selection -> repair-mode
     -> repair-mode
        entry: spec.md exists but metadata missing, OR deep-research placeholders/TODO anchors unresolved
        on metadata-only repair -> populated-folder
        on placeholder-upgrade interview -> populated-folder
     -> populated-folder
        entry: spec.md + description.json + graph-metadata.json present and no unresolved TODO sentinels
        on overwrite declined -> terminal/no-op
        on explicit repair request -> repair-mode
     -> aborted-mid-interview
        entry: prior run recorded resume checkpoint without successful artifact commit
        on resume -> partial-folder
        on discard -> empty-folder or repair-mode (depending on surviving artifacts)
   ```

   Re-entry rule for deep-research placeholders:
   - If `spec.md` contains the deep-research seed markers or unresolved TODO placeholders in Scope/Requirements, set `start_state=repair-mode`, `repair_mode=upgrade_placeholders`, and `reentry_reason=deep_research_placeholders`.
   - Resume at `resume_question_id=QS2` only if `selected_level` is still unset; otherwise resume at the first unresolved placeholder anchor rather than replaying `QS0` or parent workflow questions.
   - Exit to `populated-folder` only when placeholder sentinels are cleared or intentionally replaced with `"N/A - insufficient source context"`; otherwise the parent command must keep treating the folder as re-entry-required. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:214] [SOURCE: .opencode/command/spec_kit/complete.md:306-311]

4. Deep-research's spec-check also needs an explicit state machine so `REQ-001` through `REQ-004` stop depending on informal phrasing like "if spec_present". The current command already normalizes `research_topic`, `spec_path`, and `execution_mode`, while the packet spec distinguishes empty-folder create, existing-spec append, synthesis interruption, and semantic conflict. Recommendation: model spec-check as four states with a single fail-closed branch: `no-spec`, `spec-present`, `spec-just-created-by-this-run`, and `conflict-detected`. [SOURCE: .opencode/command/spec_kit/deep-research.md:93-96] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:29-43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-124] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:208-214]

   Proposed deep-research spec-check machine:

   ```text
   pre_init_spec_check
     -> no-spec
        on seed-create success -> spec-just-created-by-this-run
        on create failure -> conflict-detected
     -> spec-present
        on anchor/context append success -> spec-present
        on semantic conflict or anchor drift -> conflict-detected
     -> spec-just-created-by-this-run
        on loop-start -> LOOP allowed
        on interrupted synthesis -> spec-just-created-by-this-run (post-synthesis pending)
        on successful synthesis sync -> spec-present
     -> conflict-detected
        exit: halt in confirm mode or emit blocking repair message in auto mode
   ```

   Required deep-research audit events:
   - `spec_check_result`: `{ spec_path, folder_state, spec_present, lock_status, run }`
   - `spec_seed_created`: `{ spec_path, research_topic, placeholder_anchors, run }`
   - `spec_preinit_context_added`: `{ spec_path, anchors_touched, normalized_topic, run }`
   - `spec_mutation_conflict`: `{ spec_path, phase, reason, anchors_touched, run }`
   - `spec_synthesis_deferred`: `{ spec_path, reason: "interrupted_before_post_synthesis", run }`

5. The exact audit events needed for `REQ-006`, `REQ-007`, and `REQ-009` are now clear: the system needs to log delegation, mode resolution, re-entry, and relationship capture as separate typed events rather than burying them in prose. Without those events, tests can only assert final files, not whether the parent command took the correct inline `/start` branch or silently skipped required repair logic. Recommendation: add a structured intake audit contract, preferably as a new non-functional requirement, with these minimum event names and payloads. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:125-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:183-189] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md]

   Required intake/delegation audit events:

   | Event | When emitted | Minimum payload | Enforces |
   |-------|--------------|-----------------|----------|
   | `start_intake_delegated` | `/plan` or `/complete` decides to inline `/start` | `parent_command`, `spec_path`, `start_state`, `reentry_reason`, `execution_mode` | `REQ-006` |
   | `start_mode_resolved` | After `:auto` / `:confirm` pruning is applied | `mode`, `required_question_ids`, `skipped_question_ids`, `defaults_applied` | `REQ-009` |
   | `start_reentry_detected` | Partial folder, repair mode, or deep-research placeholders trigger resume | `start_state`, `repair_mode`, `resume_question_id`, `reentry_reason`, `placeholder_anchors` | `REQ-006`, `REQ-009` |
   | `manual_relationships_recorded` | User answered `QS4+` with one or more relationship entries | `counts_by_type`, `targets`, `dedupe_applied`, `source="user-interview"` | `REQ-007` |
   | `manual_relationships_skipped` | User said no, or auto mode suppressed the optional branch | `mode`, `reason`, `source_context` | `REQ-007`, `REQ-009` |
   | `start_artifacts_committed` | Canonical artifact transaction exits successfully | `spec_path`, `files_written`, `repair_mode`, `selected_level` | `REQ-006`, `REQ-009`, `REQ-005` |

6. `Q1` closes without introducing a new risk category: interview-driven CLI tools mainly fail by leaving partial filesystem state, stale local config, or rerun collisions after an interrupted scaffold, which is the same failure family already present in this packet's edge cases. Cookiecutter-style prompt generators risk partial renders when cancelled mid-template, Yeoman-style generators risk stale generator state plus partially written config, and Create-React-App-style bootstraps risk half-created directories that block the next "fresh" run. That means the packet does not need a new UX philosophy; it needs the already-identified repair/resume rules promoted into requirements. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:205-214] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md] [SOURCE: pre-training knowledge - Cookiecutter, Yeoman, and Create React App generator failure modes]

   New requirement suggestions if the packet wants those failure modes to be explicit rather than implied:
   - `REQ-011` — Intake resume contract: standalone and delegated `/start` runs persist enough state to resume after `aborted-mid-interview`, `partial-folder`, or `deep_research_placeholders` re-entry without replaying already-accepted answers.
   - `NFR-S04` — Structured intake audit contract: `/start`, `/plan`, and `/complete` emit the stable event types listed above so delegation, relationship capture, and mode parity can be verified from machine-readable traces rather than final files only.

## Ruled Out
- Treating deep-research-seeded TODOs as a healthy `populated-folder` and letting `/plan` continue without re-entry.
- Creating a second parallel field namespace for delegated `/start` when `feature_description` and `spec_path` already exist in the parent command contract.
- Collapsing auditability into a single generic "start completed" event; that would not prove whether relationship capture, re-entry, or mode pruning behaved correctly.

## Dead Ends
- `rg -n "state|machine|transition|FSM" .opencode/command/ .opencode/skill/system-spec-kit/ | head -20` found only indirect precedent; the explicit state-machine wording still has to be synthesized from adjacent YAML state/circuit-breaker patterns plus packet-local edge cases.
- The repo still does not expose a live `/spec_kit:start` implementation, so the state graph and audit schema remain contract proposals rather than confirmed runtime behavior.
- Iteration-004's external generator evidence is strong enough to close `Q1` at the risk-class level, but it does not answer storage details for the eventual intake audit log.

## Sources
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/findings-registry.json`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/create/assets/create_sk_skill_auto.yaml`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Pre-training knowledge: Cookiecutter, Yeoman, and Create React App interview/scaffold failure modes

## Assessment
- `findingsCount`: `6`
- `newInfoRatio`: `0.29`
- Questions addressed: `Q1`, `Q4`, `Q5`, `Q7`
- Questions answered: `Q1`
- Main deltas: the packet now has a REQ-by-REQ semantic split, a concrete inline field contract, explicit `/start` and deep-research state machines, and a typed audit-event list for delegated intake behavior.

## Reflection
- What worked: anchoring the acceptance-language pass in the parent command field names (`feature_description`, `spec_path`, `execution_mode`) prevented the design from drifting into a second schema that implementation would later have to reconcile.
- What failed: the current packet only implies intake resume/audit behavior through edge cases and NFR-S02, so I still had to propose `REQ-011` and `NFR-S04` instead of mapping everything cleanly onto existing requirement IDs.
- What to do differently: the next pass should test whether the recommended events belong in YAML reducer state, command transcript traces, or a packet-local runtime log so the proposal does not stop at naming.

## Next Focus
Q6 follow-through: convert this state-machine contract into a concrete `spec_check_protocol.md` shape and exact YAML step ordering for auto vs confirm mode, especially lock acquisition order, generated-block conflict exits, and where the intake/delegation audit events live at runtime.
