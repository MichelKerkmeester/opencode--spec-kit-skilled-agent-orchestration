# Deep Research Synthesis: Spec Kit Command Intake Refactor

<!-- ANCHOR:overview -->
## Overview
This synthesis consolidates the converged design guidance for Phase 012: a thin `/spec_kit:start` intake surface, late-INIT `spec.md` anchoring for `/spec_kit:deep-research`, bounded generated-fence write-back, and inline `/start` absorption inside `/spec_kit:plan` and `/spec_kit:complete` when folder state is not yet healthy. It reflects the final state of the ten-iteration research loop captured in this packet's research artifacts. [SOURCE: deep-research-strategy.md:Overview] [SOURCE: iteration-010.md:Final Findings]
<!-- /ANCHOR:overview -->

## 1. Executive Summary
Research converged on a clear split of responsibilities. `/spec_kit:start` should be a thin intake command that creates or repairs the canonical trio (`spec.md`, `description.json`, `graph-metadata.json`) and then hands off to `/spec_kit:plan` or `/spec_kit:complete`; it should not absorb planning, dispatch, or phase-decomposition concerns. `/spec_kit:deep-research` should anchor every run to a real `spec.md`, but it must do so with late-init detection, single-writer locking, append-only pre-init context, and a fenced generated findings block during synthesis rather than by rewriting human-authored sections. [SOURCE: iteration-001.md:Findings] [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-010.md:Final Findings]

The main blockers are no longer product-direction questions; they are packet-local wording contradictions and contract gaps. The current `spec.md` still overclaims atomic three-artifact writes, leaves marker conflict behavior implicit, treats empty-folder delegation too narrowly, and assumes `generate-context.js` can serve as a lightweight start-time repair primitive when runtime evidence says it is a memory-save pipeline with heavier failure modes. The implementation path is ready once `/spec_kit:plan` rewrites the affected anchors, adds `REQ-011`, adds `NFR-S04`, and applies the converged state-machine and idempotency rules captured below. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-009.md:Finding 1] [SOURCE: iteration-009.md:Finding 4] [SOURCE: iteration-010.md:Final Findings]

## 2. Research Question & Scope
The research question was: how should this packet introduce `/spec_kit:start`, wire `/spec_kit:deep-research` to a real `spec.md`, and let `/spec_kit:plan` plus `/spec_kit:complete` delegate start-intake without hidden coupling, trust violations, or runtime regressions? The goal was not to invent a new workflow family; it was to validate and refine the exact packet already described in `spec.md` before planning begins. [SOURCE: deep-research-strategy.md:Overview] [SOURCE: deep-research-strategy.md:Topic] [SOURCE: iteration-010.md:Focus]

Out of scope throughout the loop were changes to the Level 1/2/3/3+ templates, changes to helper internals as the primary design answer, changes to graph-metadata backfill, and broad architectural alternatives such as replacing deep-research or moving planning into `/start`. The loop instead focused on prior art, mutation safety, delegation shape, state machines, runtime helper pressure-tests, and exact packet-local spec deltas. [SOURCE: deep-research-strategy.md:Non-Goals] [SOURCE: iteration-001.md:Findings] [SOURCE: iteration-008.md:Findings] [SOURCE: iteration-010.md:Final Findings]

## 3. Methodology
This synthesis covers 10 completed iterations under session `2026-04-14_spec-kit-commands-012_gen1`, using the configured cli-codex GPT-5.4 xhigh fast execution path and the reducer-maintained deep-research packet structure. Each iteration focused on a bounded question cluster, wrote an iteration report, and fed the next pass through the strategy, state, registry, and dashboard artifacts. [SOURCE: deep-research-strategy.md:Overview] [SOURCE: iteration-001.md:Assessment] [SOURCE: iteration-010.md:Assessment]

The convergence method was explicit and cumulative rather than impressionistic. The loop tracked `newInfoRatio` by iteration, refined unanswered questions into narrower design tests, pressure-tested draft contracts against live repo surfaces, and stopped after the ratio fell from `0.75` to `0.08` across ten runs: `0.75 -> 0.46 -> 0.38 -> 0.34 -> 0.29 -> 0.23 -> 0.18 -> 0.16 -> 0.12 -> 0.08`. The last three passes added implementation precision rather than new design branches, which is why the final stop reason is convergence rather than unresolved ambiguity. [SOURCE: iteration-001.md:Assessment] [SOURCE: iteration-002.md:Assessment] [SOURCE: iteration-003.md:Assessment] [SOURCE: iteration-004.md:Assessment] [SOURCE: iteration-005.md:Assessment] [SOURCE: iteration-006.md:Assessment] [SOURCE: iteration-007.md:Assessment] [SOURCE: iteration-008.md:Assessment] [SOURCE: iteration-009.md:Pressure-Test Matrix And Next Focus] [SOURCE: iteration-010.md:Focus]

## 4. Key Findings
1. `/spec_kit:start` should be a narrow artifact-creation ritual, not a replacement for planning. Comparable systems front-load scoping and clarify "what and why" before technical planning, and the strongest local precedent also keeps extra setup behind explicit branches rather than always-on prompts. [SOURCE: iteration-001.md:Findings]
2. Thin intake is the correct UX model. `/start` should ask only for irreducible packet-creation inputs, then materialize those into the canonical files so the richer thinking can continue in `spec.md`, planning, and research artifacts. [SOURCE: iteration-001.md:Findings] [SOURCE: iteration-004.md:Findings]
3. `/plan` and `/complete` should absorb `/start` inline inside their existing consolidated first prompt when folder state requires it; they should not visibly hand the user off to a separate chained command. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-008.md:Findings]
4. Parent commands must keep execution mode, dispatch mode, research intent, and phase controls; `/start` owns only packet-creation inputs such as missing feature text, target folder state, level confirmation, and optional manual relationships. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-005.md:Findings]
5. The safest deep-research write-back contract is `host anchor + generated fence + fail-closed replacement`, not free-floating append-only prose and not whole-anchor rewrite. [SOURCE: iteration-002.md:Findings] [SOURCE: iteration-003.md:Findings]
6. Marker drift, duplicate markers, manual edits inside the generated block, and semantic-purpose conflicts all need explicit fail-closed exits and audit events rather than heuristic repair. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-006.md:Findings]
7. Single-writer locking is mandatory before any spec detection or mutation. The converged live lock location is `{spec_folder}/research/.deep-research.lock`, held from early init through synthesis write-back and released only after save or cleanup. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-007.md:Findings]
8. Deep-research spec detection should happen late in INIT, after config, JSONL, strategy, and registry files exist, so conflicts can be audited into the canonical runtime packet before the run halts. [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-007.md:Findings]
9. Placeholder-upgrade must rely on explicit deep-research seed markers, not a generic `TODO` scan. Re-entry ends only when every tracked seed block is replaced with confirmed content or the explicit fallback `N/A - insufficient source context`. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-009.md:Finding 3] [SOURCE: iteration-010.md:Final Findings]
10. The final manual relationship schema should stay under `manual.depends_on`, `manual.related_to`, and `manual.supersedes`, but each entry must be an object with `packet_id`, `reason`, `source`, and optional denormalized hints such as `spec_folder` or `title`. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-009.md:Finding 2] [SOURCE: iteration-010.md:Final Findings]
11. The packet still contains a real contradiction around transactionality. Existing helpers do not currently provide true three-artifact atomicity, so `REQ-005` and `NFR-R02` must be rewritten around staged canonical commit or explicitly narrowed repair semantics. [SOURCE: iteration-009.md:Finding 1] [SOURCE: iteration-010.md:Final Findings] [SOURCE: iteration-010.md:Remaining Contradictions]
12. `generate-context.js` is not a safe default dependency for `/start` creation or metadata-only repair. It is a memory-save pipeline with structured-context requirements, so canonical trio creation must succeed independently from optional memory save. [SOURCE: iteration-009.md:Finding 4] [SOURCE: iteration-010.md:Final Findings] [SOURCE: iteration-010.md:Remaining Contradictions]
13. `recommend-level.sh` is reusable, but only after `/start` derives numeric `loc/files/risk` proxies and stores the recommendation separately from the user-confirmed level override. [SOURCE: iteration-009.md:Finding 5]
14. The packet now has exact diff seams for deep-research markdown/YAML and parent-command insertion points, so implementation ambiguity is low even though `/start` itself is not yet implemented. [SOURCE: iteration-007.md:Findings] [SOURCE: iteration-008.md:Exact Insertion Points]

## 5. Answers to Key Questions
### Q1. What interactive-interview patterns should `/spec_kit:start` reuse or avoid?
It should reuse the thin-scaffold pattern, not the long wizard pattern. The strongest precedent across ADR tools, generator tooling, and local packet history is: ask only for the few inputs that cannot be inferred, create the artifact early, and let refinement happen in the artifact rather than in a bloated pre-plan dialogue. That means `/start` should feel closer to a packet scaffold plus bounded confirmation than to a second planning workflow. [SOURCE: iteration-001.md:Findings] [SOURCE: iteration-004.md:Findings]

The main failure modes are not novel; they belong to the same partial-state family already identified in this packet: interrupted scaffolds, rerun collisions, stale state, and silent overwrite risk. The research closed Q1 by concluding that the product direction is sound, but only if repair/resume and audit semantics are made explicit in the requirements instead of left implicit in edge-case prose. [SOURCE: iteration-005.md:Findings]

### Q2. How do other spec-driven systems handle intake before planning, and what should this packet copy-proof against?
The consistent pattern is separation, not collapse. GitHub Spec Kit keeps clarification inside specification and only then moves into technical planning; RFC-style processes similarly establish scope, legitimacy, and review state before implementation detail. The right local analogue is therefore an intake step that creates and stabilizes the user-facing spec, not a generic wizard that tries to absorb all downstream thinking. [SOURCE: iteration-001.md:Findings]

The anti-patterns to copy-proof against are always-on setup expansion, title-only intake for a three-artifact command, and silent auto-rewriting of user-authored intent. `/start` should narrow the intake surface, preserve auditable progression, and keep planning separate. [SOURCE: iteration-001.md:Findings]

### Q3. What edge cases arise when a research tool mutates a user-authored `spec.md`?
The hard edge cases are marker drift, duplicate markers, manual edits inside the machine-owned block, partial file-write failure, and parallel writers. The research found that idempotency is not enough on its own; the command also needs exact ownership ranges, a single-writer contract, and explicit recovery output when replacement fails. [SOURCE: iteration-002.md:Findings] [SOURCE: iteration-003.md:Findings]

The practical answer is fail-closed mutation with audit, not heuristic merge logic. Pre-init append can stay narrow and anchor-scoped, but post-synthesis write-back must be fenced, replace only its exact generated block, and stop on any ambiguity. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-006.md:Findings]

### Q4. Does smart delegation from `/plan` and `/complete` to `/start` create hidden coupling?
It does if implemented as a visible handoff or if `/start` absorbs parent-owned workflow questions. It does not if implemented as inline absorption inside Step 1 request analysis, with the parent command retaining execution, dispatch, research, and phase controls while only borrowing `/start`'s packet-creation questions when the folder state requires it. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-008.md:Findings]

The no-regression rule is crucial. Healthy folders should behave exactly as they do today, while delegated intake should trigger only for `no-spec`, `partial-folder`, `repair-mode`, or unresolved placeholder re-entry. That preserves the existing first-message contract and avoids surprise prompt ordering. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:Final Findings]

### Q5. Do the ten original requirements contain contradictions or missing acceptance criteria?
Yes. The original REQ table describes the happy path more clearly than the failure path, especially for lock acquisition, anchor conflict exits, staged writes, placeholder re-entry, and mode parity. The most concrete contradiction is that `NFR-R02` promises a single transactional trio while the edge-case section still allows `spec.md` to remain after metadata failure. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-010.md:Final Findings] [SOURCE: iteration-010.md:Remaining Contradictions]

The loop resolved this by recommending a rewrite around `folder_state`, explicit seed markers, object-based relationship arrays, shared state-machine parity for `:auto` and `:confirm`, and a clean separation between canonical artifact emission and optional memory save. It also concluded that the packet should add `REQ-011` and `NFR-S04` rather than leaving resume and audit behavior implicit. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-009.md:Pressure-Test Matrix And Next Focus] [SOURCE: iteration-010.md:New REQ Suggestions]

### Q6. How should post-synthesis write-back to `spec.md` work?
It should use a stable host anchor plus a single fenced generated findings block, not a broad anchor rewrite and not a free-floating append. The host location can remain inside the existing risks section, but the machine-owned span itself must be clearly bracketed, replaced idempotently on rerun, and treated as mixed-ownership context containing one machine-owned subsection. [SOURCE: iteration-002.md:Findings] [SOURCE: iteration-003.md:Findings]

The exact mutation lifecycle is now clear: late-init detection after the research packet exists, narrow pre-init append under `<!-- ANCHOR:questions -->`, synthesis-time write-back before config completion, audit to `deep-research-state.jsonl`, and fail-closed exits for missing anchors, duplicate markers, marker drift, human edits inside the block, or semantic-purpose conflict. [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-007.md:Findings]

### Q7. What should `/spec_kit:start` ask, and how should manual relationships be captured?
The minimum viable interview is small: feature description only when missing, target-folder or repair choice, recommended-level confirm or override, and one optional grouped prompt asking whether to record packet relationships. If the answer is no, all three manual arrays remain empty; if yes, the command collects one or more entries under the existing relation types. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-005.md:Findings]

The research tightened two draft details while converging. An earlier draft used a generic `target` field and a generic save step; the pressure-test resolved both in favor of `packet_id` as the authoritative relationship key and optional memory save only after canonical artifact success. Those refinements strengthen provenance and avoid overloading `/start` with a session-save responsibility it cannot always satisfy safely. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-009.md:Finding 2] [SOURCE: iteration-009.md:Finding 4] [SOURCE: iteration-010.md:Final Findings]

## 6. Recommended Design: `/spec_kit:start`
`/spec_kit:start` should be implemented as a thin command card plus paired YAML assets, following the same repo pattern used by the existing `spec_kit` command surfaces: markdown owns setup, YAML owns execution, and the first user interaction stays consolidated. [SOURCE: iteration-008.md:Findings]

### Interview Shape
| Slot | Question | Captured fields | Notes |
|---|---|---|---|
| `Q0` | Feature description, only if missing | `feature_description` | Parent commands may pre-bind this during delegation. |
| `Q1` | Target folder state | `spec_path`, `start_state`, `repair_mode` | Supports create, repair, resume partial, and placeholder upgrade. |
| `Q2` | Documentation level | `level_recommendation`, `selected_level` | Recommendation and override must be stored separately. |
| `Q3` | Record relationships now? | `collect_relationships` | Boolean gate only. |
| `Q4+` | Relationship entries, only if `Q3=yes` | `manual_relationships.depends_on[]`, `manual_relationships.related_to[]`, `manual_relationships.supersedes[]` | One grouped follow-up, not a second free-form metadata interview. |
[SOURCE: iteration-004.md:Findings] [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-009.md:Finding 5]

### Returned Field Contract
- Reuse existing parent vocabulary where possible: `feature_description` and `spec_path` should not be duplicated under a second namespace. [SOURCE: iteration-005.md:Findings]
- Add only the packet-creation fields the parent workflow cannot infer: `start_state`, `repair_mode`, `selected_level`, `level_recommendation`, `manual_relationships`, `resume_question_id`, and `reentry_reason`. [SOURCE: iteration-005.md:Findings]
- Keep execution mode parent-owned during delegation. A direct `/start` invocation may bind `:auto` or `:confirm`, but delegated runs must inherit the parent's workflow mode instead of redefining it. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-008.md:Draft: .opencode/command/spec_kit/start.md]

### Auto vs Confirm Modes
- `:auto` and `:confirm` must share the same state graph and output contract; the difference is approval density, not artifact shape. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-008.md:Findings]
- `:auto` may skip optional prompts when flags or inherited context already supply the answer, but it must still honor repair-mode detection, placeholder-upgrade detection, conflict exits, and dedupe rules. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:REQ/NFR Crosswalk (Iterations 005, 007, 009)]
- `:confirm` should pause around folder-state review, interview summary, artifact emission, and optional save behavior, mirroring the structural parity pattern already used by `plan` and `complete`. [SOURCE: iteration-008.md:Findings]

### Manual Relationship Capture
- Keep the existing `manual.depends_on`, `manual.related_to`, and `manual.supersedes` arrays; do not add a new top-level `relationships` object. [SOURCE: iteration-004.md:Findings]
- Final object shape: `{ packet_id, reason, source, spec_folder?, title? }`. `packet_id` is authoritative; `spec_folder` and `title` are optional hints only. [SOURCE: iteration-009.md:Finding 2] [SOURCE: iteration-010.md:Final Findings]
- Dedupe by `packet_id` within each relation type so repeated repair or delegated reruns do not multiply edges. [SOURCE: iteration-010.md:Final Findings]

## 7. Recommended Design: Deep-Research `spec.md` Integration
The deep-research integration should be treated as a bounded `spec_check_protocol`, not a loose side effect. It belongs in late INIT and SYNTHESIS, not in preflight and not in the memory-save phase. [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-007.md:Findings]

### Preflight and Pre-Init Detection
- Acquire `{spec_folder}/research/.deep-research.lock` before session classification and before any spec detection. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-006.md:Findings]
- Run `step_detect_spec_present` after config, JSONL, strategy, and registry creation, but before loop entry. [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-007.md:Findings]
- Classify into `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-006.md:Findings]

### Pre-Init Branches
- `no-spec` -> seed a Level 1 `spec.md` from the research topic using explicit seed markers in the placeholder-bearing anchors. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:Final Findings]
- `spec-present` -> append only the research topic and context note inside the bounded pre-init locations, without broad prose rewrite. [SOURCE: iteration-002.md:Findings] [SOURCE: iteration-006.md:Findings]
- `conflict-detected` -> append a typed conflict audit event and halt fail closed. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-006.md:Findings]

### Post-Synthesis Write-Back
- Insert write-back in SYNTHESIS immediately after the compiled research step and before config completion; confirm mode gets a distinct approval gate for this mutation. [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-007.md:Findings]
- Write to one stable generated findings span, for example `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->`, nested under the chosen host anchor. [SOURCE: iteration-002.md:Findings] [SOURCE: iteration-010.md:Final Findings]
- Keep `research/research.md` as the source of truth and sync only an abridged findings summary back into `spec.md`. [SOURCE: iteration-002.md:Findings]

### Required Audit Events
- `spec_check_result`
- `spec_seed_created`
- `spec_preinit_context_added`
- `spec_mutation`
- `spec_mutation_conflict`
- `spec_synthesis_deferred`
[SOURCE: iteration-005.md:Findings] [SOURCE: iteration-006.md:Findings]

## 8. Recommended Design: `/plan` and `/complete` Smart Delegation
Parent-command delegation should follow one rule: inline absorption, never visible handoff. The delegated `/start` block belongs inside `step_1_request_analysis`, where the parent already normalizes folder state before document authoring or completion work begins. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-008.md:Findings]

### Consolidated-Prompt Merge Pattern
- Keep a single first-message prompt. When start-intake is needed, inject a compact `/start` block into the existing consolidated prompt instead of opening a second command flow. [SOURCE: iteration-004.md:Findings]
- Populate or return `feature_description`, `spec_path`, `selected_level`, `repair_mode`, and `manual_relationships`, then continue the parent workflow with those values bound. [SOURCE: iteration-005.md:Findings]
- Reserve documentation-level field space in the parent command cards, but do not claim runtime coverage until the plan/complete YAML assets are patched too. [SOURCE: iteration-007.md:Findings]

### Empty-Folder Detection and Re-Entry
Delegation should trigger for more than "spec missing." The converged folder-state model is `no-spec`, `partial-folder`, `repair-mode`, and unresolved placeholder re-entry, with deep-research-seeded TODO specs explicitly treated as repair or upgrade state rather than healthy populated folders. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:Final Findings]

### No-Regression Guarantees
- Healthy folders keep the current behavior: no extra prompts and no silent `/start` branch. [SOURCE: iteration-001.md:Findings] [SOURCE: iteration-010.md:Final Findings]
- Delegated intake must stay ahead of Step 1 confidence checkpoints so the resulting spec state is stable before planning or completion logic continues. [SOURCE: iteration-008.md:Findings]
- `:with-research`, `:with-phases`, and other parent-only extensions must remain parent-owned branches. `/start` cannot become a second phase router. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-008.md:Findings]

## 9. State Machines
The cleaned state machines below are the converged contract proposals that planning should adopt. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-006.md:Findings]

### `/spec_kit:start`
```text
scan_folder
  -> empty-folder
     on create -> partial-folder
  -> partial-folder
     on resume -> partial-folder
     on explicit repair selection -> repair-mode
  -> repair-mode
     entry: spec.md exists but metadata missing
     on metadata repair -> populated-folder
  -> placeholder-upgrade
     entry: deep-research seed markers or unresolved tracked placeholders remain
     on confirmed replacement of every tracked seed block -> populated-folder
  -> populated-folder
     on overwrite declined -> terminal/no-op
     on explicit repair request -> repair-mode
  -> aborted-mid-interview
     on resume -> partial-folder or placeholder-upgrade
     on discard -> empty-folder or repair-mode depending on surviving artifacts
```
[SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:Final Findings]

### Deep-Research Spec Check
```text
pre_init_spec_check
  -> no-spec
     on seed-create success -> spec-just-created-by-this-run
     on create failure -> conflict-detected
  -> spec-present
     on bounded pre-init append success -> spec-present
     on semantic conflict or anchor drift -> conflict-detected
  -> spec-just-created-by-this-run
     on loop-start -> LOOP allowed
     on interrupted synthesis -> spec-just-created-by-this-run (post-synthesis pending)
     on successful synthesis sync -> spec-present
  -> conflict-detected
     exit: halt in confirm mode or emit blocking repair output in auto mode
```
[SOURCE: iteration-005.md:Findings] [SOURCE: iteration-006.md:Findings]

## 10. Mutation Contract & Idempotency
The mutation contract is now specific enough to implement. [SOURCE: iteration-002.md:Findings] [SOURCE: iteration-006.md:Findings] [SOURCE: iteration-010.md:Final Findings]

1. Acquire the advisory deep-research lock before session classification or any `spec.md` mutation. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-007.md:Findings]
2. Use bounded pre-init updates only for narrow context insertion; do not rewrite the meaning of existing user-authored sections. [SOURCE: iteration-002.md:Findings]
3. Keep post-synthesis sync inside one machine-owned generated span under a stable host anchor. [SOURCE: iteration-002.md:Findings]
4. Require exactly one matching `BEGIN/END GENERATED` pair for the findings block and fail closed on missing or duplicate markers. [SOURCE: iteration-003.md:Findings]
5. Treat manual edits inside the generated span as `spec_mutation_conflict`, not as mergeable user content. [SOURCE: iteration-003.md:Findings]
6. Normalize the research topic before dedupe so reruns on the same topic no-op instead of duplicating Open Questions, context notes, or findings blocks. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:REQ/NFR Crosswalk (Iterations 005, 007, 009)]
7. Dedupe manual relationship objects by `packet_id` within each relation type. [SOURCE: iteration-009.md:Finding 2] [SOURCE: iteration-010.md:Final Findings]
8. Use staged temp-sibling writes plus final commit semantics for canonical artifact publication; existing helper reuse alone is not proof of atomic trio writes. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-009.md:Finding 1] [SOURCE: iteration-010.md:Final Findings]

## 11. Edge Cases & Error Scenarios
These are the edge cases the implementation must treat as first-class, not incidental cleanup. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-009.md:Pressure-Test Matrix And Next Focus]

- Missing host anchor for pre-init append or findings sync -> emit conflict audit and halt. [SOURCE: iteration-003.md:Findings]
- Duplicate or mismatched generated markers -> fail closed; do not "repair in place." [SOURCE: iteration-003.md:Findings]
- Human edits inside the machine-owned findings block -> conflict path requiring confirmation or explicit recovery. [SOURCE: iteration-003.md:Findings]
- Advisory lock contention -> block second writer; stale-lock override stays confirm or explicit recovery only. [SOURCE: iteration-003.md:Findings] [SOURCE: iteration-007.md:Findings]
- Generated-block replacement or rename failure -> surface exact recovery output; do not treat checkpoint commits as the primary runtime rollback. [SOURCE: iteration-003.md:Findings]
- Deep-research-created placeholder specs -> treat as upgrade-required state, not as healthy populated folders. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:Final Findings]
- Metadata-only repair -> skip `generate-context.js`; create or repair canonical metadata directly. [SOURCE: iteration-009.md:Finding 4]
- `recommend-level.sh` failure -> store fallback behavior explicitly and keep recommendation separate from user override. [SOURCE: iteration-009.md:Finding 5]

## 12. Implementation-Readiness Checklist
Current readiness, copied from iteration 010, remains entirely blocked until the packet rewrites the affected anchors in `spec.md`. [SOURCE: iteration-010.md:FINAL IMPLEMENTATION-READINESS CHECKLIST]

| ID | Ready | Why it is not yet implementation-ready |
|---|---|---|
| REQ-001 | ✗ | Detection still stops at `spec_present: bool`; it does not require post-lock `folder_state` classification. |
| REQ-002 | ✗ | Seed-create does not define exact seed markers, emitted placeholder anchors, or fail-closed create semantics. |
| REQ-003 | ✗ | Pre-init update does not define missing/duplicate anchor behavior, semantic conflict exits, or exact audit payloads. |
| REQ-004 | ✗ | Post-synthesis write-back lacks the generated-fence label, conflict handling, and deferred-write path. |
| REQ-005 | ✗ | Current wording overclaims transactionality and conflates canonical trio publication with later save behavior. |
| REQ-006 | ✗ | Delegation only describes absent-`spec.md` detection, not `partial-folder`, `repair-mode`, or placeholder re-entry. |
| REQ-007 | ✗ | The relationship branch still lacks the final object schema and dedupe rules. |
| REQ-008 | ✗ | The spec does not say how `/start` derives `recommend-level.sh` inputs or stores recommendation vs override. |
| REQ-009 | ✗ | Auto/confirm parity is still phrased as output parity only, not one shared state graph with different gates. |
| REQ-010 | ✗ | Idempotency is still semantic-only; it omits normalized topics, generated-block labels, relation-object dedupe, and placeholder markers. |
| REQ-011 | ✗ | Not yet present in `spec.md`. |

## 13. Spec.md Edit Plan
This edit plan was verified against the live `spec.md` line ranges before synthesis write-up. [SOURCE: iteration-010.md:SPEC.MD EDIT PLAN]

| Anchor | Current line range | Prose delta ready for `/spec_kit:plan` |
|---|---|---|
| `problem` | 64-68 | Split the purpose statement into two outcomes: `/start` guarantees the canonical trio, while memory save is optional and only runs when structured context exists; clarify that deep-research syncs back via a fenced findings block, not broad document rewriting. |
| `scope` | 78-81 | Expand in-scope wording so `/plan` and `/complete` delegate on `no-spec`, `partial-folder`, `repair-mode`, and unresolved placeholder re-entry, not only when `spec.md` is absent. |
| `scope` | 85-90 | Clarify that helper internals stay unchanged, but command-layer staged commit, seed-marker handling, and save-path branching are in scope. |
| `scope` | 96-109 | Update file descriptions so `/start` assets explicitly own canonical artifact emission plus optional memory-save mode, and `spec_check_protocol.md` explicitly owns lock, seed-marker, host-anchor, and generated-fence rules. |
| `requirements` | 121-135 | Rewrite all acceptance criteria. Key deltas: `REQ-001` adds post-lock `folder_state`; `REQ-002` adds `spec_seed_created` plus exact placeholder markers; `REQ-003` adds fail-closed anchor conflict semantics; `REQ-004` requires exactly one `BEGIN/END GENERATED: deep-research/spec-findings` block under the chosen host anchor; `REQ-005` distinguishes staged canonical commit from optional memory save; `REQ-006` expands delegation states and returned fields; `REQ-007` fixes the `manual.*` object schema; `REQ-008` stores `level_recommendation` and `selected_level`; `REQ-009` requires one shared state graph; `REQ-010` extends idempotency to markers, relation objects, and normalized topics; add `REQ-011` after `REQ-010`. |
| `success-criteria` | 143-148 | Remove "immediately visible via `memory_quick_search`" from baseline `/start` success. Add one criterion for placeholder-upgrade completion and one optional criterion for memory-save mode when sufficient structured context exists. |
| `risks` | 158-166 | Replace generic TODO and transaction wording with explicit risks for seed-marker drift, generated-fence conflicts, staged canonical commit failure, and accidental use of `generate-context.js` as a metadata-only repair tool. |
| `nfr` | 179-189 | Tighten `NFR-S03` around required object fields for `manual.*`; insert `NFR-S04` structured intake audit events; rewrite `NFR-R02` as staged canonical artifact commit plus pre-existing-file preservation; add one sentence that optional memory save is outside the canonical trio transaction. |
| `edge-cases` | 198-214 | Remove default `memory/` creation from the empty-folder rule. Replace generic TODO language with explicit seed-marker detection and clear conditions. Split repair outcomes into metadata-only repair, placeholder-upgrade, and optional memory-save modes. |
| `questions` | 232-238 | Close the now-resolved research questions. Replace them with either `No blocking open questions after iteration 010` or a very small residual note limited to implementation sequencing, not product direction. |

## 14. New REQ Suggestions
1. `REQ-011 - Intake resume and re-entry contract` [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:New REQ Suggestions]
   Acceptance criteria:
   - `/start`, delegated `/plan`, and delegated `/complete` normalize `start_state` into `empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, or `populated-folder`. [SOURCE: iteration-010.md:New REQ Suggestions]
   - Re-entry persists and returns `resume_question_id`, `repair_mode`, and `reentry_reason` so reruns resume at the first unresolved question or seed marker rather than replaying already accepted answers. [SOURCE: iteration-010.md:New REQ Suggestions]
   - Success is blocked until the canonical trio validates and any tracked seed markers are cleared or explicitly replaced with `N/A - insufficient source context`. [SOURCE: iteration-010.md:New REQ Suggestions]

Companion non-REQ delta: add `NFR-S04 - Structured intake audit contract` so delegated intake, mode resolution, re-entry, relationship capture, canonical artifact commit, and optional memory-save branching can be verified from typed events rather than from final files alone. [SOURCE: iteration-005.md:Findings] [SOURCE: iteration-010.md:New REQ Suggestions]

## 15. Ruled-Out Approaches
- Do not copy GitHub Spec Kit's phase flow literally; it does not expose a standalone `/start` analogue. [SOURCE: iteration-001.md:Ruled Out]
- Do not copy `adr-tools` as a title-only intake; this command has to emit three linked artifacts. [SOURCE: iteration-001.md:Ruled Out]
- Do not implement a visible chained-command handoff from `/plan` or `/complete` to `/start`. [SOURCE: iteration-004.md:Ruled Out]
- Do not move execution mode, dispatch mode, research intent, or phase decomposition into `/start`. [SOURCE: iteration-004.md:Ruled Out]
- Do not add a new top-level `relationships` object outside `manual.*`. [SOURCE: iteration-004.md:Ruled Out]
- Do not rewrite whole `spec.md` anchors during synthesis. [SOURCE: iteration-002.md:Ruled Out]
- Do not rely on plain anchor-bounded append without generated markers for post-synthesis findings. [SOURCE: iteration-002.md:Ruled Out]
- Do not auto-heal missing or duplicate markers by guessing nearby prose. [SOURCE: iteration-003.md:Ruled Out]
- Do not allow lock-free concurrent writers against the same spec folder. [SOURCE: iteration-003.md:Ruled Out]
- Do not treat current helper reuse as proof of atomic trio publication or use `generate-context.js` as the default repair path. [SOURCE: iteration-009.md:Ruled Out] [SOURCE: iteration-010.md:Final Findings]
- Do not use generic `TODO` scans as the placeholder-upgrade contract. [SOURCE: iteration-009.md:Ruled Out]

## 16. Open Questions / Deferred Work
No blocking product-direction questions remain after iteration 010; the remaining work is implementation sequencing and contract hardening, not design discovery. [SOURCE: iteration-010.md:Executive Summary and Final Recommendations]

Deferred implementation work:
- Choose the concrete staged-write wrapper or equivalent command-layer commit mechanism that will satisfy the rewritten `REQ-005` and `NFR-R02`. The research outcome is clear, but the helper or wrapper shape is still to be implemented. [SOURCE: iteration-009.md:Finding 1] [SOURCE: iteration-010.md:Final Findings]
- Decide where the `/start` and parent-command audit events live at runtime. The event names are converged, but the packet still needs to wire their actual sink. [SOURCE: iteration-005.md:Findings]
- Implement populated `manual.*` runtime examples. The schema is converged, but the repo still lacked a live populated example during research. [SOURCE: iteration-004.md:Dead Ends] [SOURCE: iteration-009.md:Finding 2]
- Verify exact helper reuse for graph-metadata regeneration after `/start` creation or repair. The research ruled out `generate-context.js` as the baseline path, but the final helper composition is still an implementation step. [SOURCE: iteration-009.md:Finding 4]

Resolved draft contradictions worth noting:
- Iteration 008 drafted `/start` with a `generate-context.js` save step; iteration 009 pressure-tested that and rejected it for start-only creation or repair. The final recommendation is canonical trio first, optional memory save second. [SOURCE: iteration-008.md:Draft: .opencode/command/spec_kit/assets/spec_kit_start_auto.yaml] [SOURCE: iteration-009.md:Finding 4] [SOURCE: iteration-010.md:Final Findings]
- Iteration 004 used a generic `target` relationship field in its minimal example; iteration 009 and iteration 010 tightened the final contract to `packet_id` as the authoritative identifier. [SOURCE: iteration-004.md:Findings] [SOURCE: iteration-009.md:Finding 2] [SOURCE: iteration-010.md:Final Findings]

## 17. Convergence Report
- Iterations completed: `10` [SOURCE: iteration-010.md:Assessment]
- Questions answered: `Q1`, `Q2`, `Q3`, `Q4`, `Q5`, `Q6`, `Q7` across the iteration set. [SOURCE: iteration-001.md:Assessment] [SOURCE: iteration-002.md:Assessment] [SOURCE: iteration-003.md:Assessment] [SOURCE: iteration-004.md:Assessment] [SOURCE: iteration-005.md:Assessment]
- NIR trajectory: `0.75 -> 0.46 -> 0.38 -> 0.34 -> 0.29 -> 0.23 -> 0.18 -> 0.16 -> 0.12 -> 0.08`. [SOURCE: iteration-001.md:Assessment] [SOURCE: iteration-002.md:Assessment] [SOURCE: iteration-003.md:Assessment] [SOURCE: iteration-004.md:Assessment] [SOURCE: iteration-005.md:Assessment] [SOURCE: iteration-006.md:Assessment] [SOURCE: iteration-007.md:Assessment] [SOURCE: iteration-008.md:Assessment] [SOURCE: iteration-009.md:Pressure-Test Matrix And Next Focus] [SOURCE: iteration-010.md:Assessment]
- Stop reason: `converged_at_08_below_implicit_threshold_0.10`. The final passes added implementation precision and contradiction cleanup, not new design branches. [SOURCE: iteration-009.md:Pressure-Test Matrix And Next Focus] [SOURCE: iteration-010.md:Executive Summary and Final Recommendations]
