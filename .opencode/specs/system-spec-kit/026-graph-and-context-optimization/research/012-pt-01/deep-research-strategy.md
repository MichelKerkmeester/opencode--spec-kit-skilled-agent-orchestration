---
title: Deep Research Strategy — Spec Kit Command Intake Refactor
description: Runtime strategy file for session 2026-04-14_spec-kit-commands-012_gen1
session_id: 2026-04-14_spec-kit-commands-012_gen1
generation: 1
---

# Deep Research Strategy — Session Tracking

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Validate and refine the combined spec in `spec.md` that introduces `/spec_kit:start` (an interactive intake command producing spec.md + description.json + graph-metadata.json) and requires `/spec_kit:deep-research` to anchor every run to a real `spec.md` (create-if-absent, update-if-present, write-findings-back post-synthesis). Surface contradictions, gaps, edge cases, and best practices before `/spec_kit:plan` turns the spec into tasks.

### Usage

- **Init**: Orchestrator populated Topic, Key Questions, Known Context, Research Boundaries from config.
- **Per iteration**: cli-codex agent (gpt-5.4 xhigh fast) reads Next Focus, writes iteration evidence; reducer refreshes machine-owned sections after each iteration.
- **Mutability**: Mutable; analyst-owned sections stable, machine-owned sections rewritten by reducer.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Validate and refine the `/spec_kit:start` command design and `/spec_kit:deep-research` ↔ `spec.md` integration contract specified in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`. Research existing patterns, edge cases, best practices, and surface contradictions or gaps.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1. What existing interactive-interview patterns (in CLI tools, spec-driven systems, or prior speckit work) would `/spec_kit:start` reuse or avoid, and what failure modes have been documented?
- [ ] Q2. How do other spec-driven systems (GitHub spec-kit, ADR tools, RFC workflows, Notion/Obsidian AI) handle the "intake-before-plan" ritual, and what anti-patterns should we copy-proof against?
- [ ] Q3. What concrete edge cases arise when a research tool mutates a user-authored `spec.md` (trust violations, idempotency, rollback, merge conflicts across parallel sessions)?
- [ ] Q4. Is the "smart delegation" from `/plan` and `/complete` → `/start` actually orthogonal, or does it create hidden coupling, double round-trips, or surprise prompt ordering that breaks `:auto` flows?
- [ ] Q5. Do the 10 requirements (REQ-001..REQ-010) in spec.md have latent contradictions, missing acceptance criteria, or gaps when checked against concrete user scenarios (empty folder, partial folder, phase-child, repair mode)?
- [ ] Q6. How should post-synthesis write-back to `spec.md` actually work — anchor-bounded append-only, fenced research section, or full anchor rewriting? What patterns exist elsewhere and which are safest?
- [ ] Q7. What should `/spec_kit:start` ask (minimum viable interview) vs. defer, and what's the right manual-graph-relationship capture shape (depends_on / related_to / supersedes) to avoid prompting fatigue?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Not researching `spec.md` Level 1/2/3/3+ template structure (fixed inputs).
- Not researching `create.sh`, `generate-description.js`, or `generate-context.js` internals (reuse-only).
- Not researching graph-metadata backfill algorithms (unchanged).
- Not designing `plan.md` or `tasks.md` content for this spec (that's `/spec_kit:plan`'s job).
- Not evaluating alternative architectures (e.g., "what if we removed deep-research entirely" — out of scope).

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Max iterations reached (10).
- All 7 key questions have at least 2 findings with independent sources.
- newInfoRatio rolling average drops below convergence threshold (0.05) for 3 consecutive iterations.
- All P0 requirements (REQ-001..REQ-006) have at least one validation or identified gap.
- A blocking contradiction is surfaced that invalidates the current spec approach.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `rg -n "ANCHOR:" .opencode/skill/ .opencode/command/ --type md` surfaced many anchor examples, but most were retrieval or documentation patterns rather than direct write-back contracts. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `rg -n "ANCHOR:" .opencode/skill/ .opencode/command/ --type md` surfaced many anchor examples, but most were retrieval or documentation patterns rather than direct write-back contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg -n "ANCHOR:" .opencode/skill/ .opencode/command/ --type md` surfaced many anchor examples, but most were retrieval or documentation patterns rather than direct write-back contracts.

### `rg -n "interview|intake" .opencode/command/ .opencode/skill/` produced almost no direct command-surface precedent, so local evidence was indirect rather than a ready-made pattern. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `rg -n "interview|intake" .opencode/command/ .opencode/skill/` produced almost no direct command-surface precedent, so local evidence was indirect rather than a ready-made pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg -n "interview|intake" .opencode/command/ .opencode/skill/` produced almost no direct command-surface precedent, so local evidence was indirect rather than a ready-made pattern.

### `rg -n "lock|concurrent|parallel|race" .opencode/skill/sk-deep-research/ .opencode/skill/system-spec-kit/ | head -30` did not reveal a live `spec.md` single-writer contract in the current command surfaces; most hits were adjacent or reference-only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `rg -n "lock|concurrent|parallel|race" .opencode/skill/sk-deep-research/ .opencode/skill/system-spec-kit/ | head -30` did not reveal a live `spec.md` single-writer contract in the current command surfaces; most hits were adjacent or reference-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg -n "lock|concurrent|parallel|race" .opencode/skill/sk-deep-research/ .opencode/skill/system-spec-kit/ | head -30` did not reveal a live `spec.md` single-writer contract in the current command surfaces; most hits were adjacent or reference-only.

### `rg -n "spec.md" .opencode/command/spec_kit/assets/*.yaml` mostly exposed template-loading and strict-validation constraints, not a ready-made `spec.md` mutation implementation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `rg -n "spec.md" .opencode/command/spec_kit/assets/*.yaml` mostly exposed template-loading and strict-validation constraints, not a ready-made `spec.md` mutation implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg -n "spec.md" .opencode/command/spec_kit/assets/*.yaml` mostly exposed template-loading and strict-validation constraints, not a ready-made `spec.md` mutation implementation.

### `rg -n "state|machine|transition|FSM" .opencode/command/ .opencode/skill/system-spec-kit/ | head -20` found only indirect precedent; the explicit state-machine wording still has to be synthesized from adjacent YAML state/circuit-breaker patterns plus packet-local edge cases. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `rg -n "state|machine|transition|FSM" .opencode/command/ .opencode/skill/system-spec-kit/ | head -20` found only indirect precedent; the explicit state-machine wording still has to be synthesized from adjacent YAML state/circuit-breaker patterns plus packet-local edge cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg -n "state|machine|transition|FSM" .opencode/command/ .opencode/skill/system-spec-kit/ | head -20` found only indirect precedent; the explicit state-machine wording still has to be synthesized from adjacent YAML state/circuit-breaker patterns plus packet-local edge cases.

### A quick `MEMORY.md` keyword pass did not return extra hits beyond the sibling packets already named in the strategy file. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A quick `MEMORY.md` keyword pass did not return extra hits beyond the sibling packets already named in the strategy file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A quick `MEMORY.md` keyword pass did not return extra hits beyond the sibling packets already named in the strategy file.

### A second free-form metadata interview just for relationships, or a new top-level `relationships` object outside `manual.*`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A second free-form metadata interview just for relationships, or a new top-level `relationships` object outside `manual.*`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second free-form metadata interview just for relationships, or a new top-level `relationships` object outside `manual.*`.

### A visible chained-command UX where `/plan` or `/complete` tells the user to stop and run `/start` separately before resuming. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A visible chained-command UX where `/plan` or `/complete` tells the user to stop and run `/start` separately before resuming.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A visible chained-command UX where `/plan` or `/complete` tells the user to stop and run `/start` separately before resuming.

### Adding a new primary top-level generated section ahead of canonical anchored sections when the existing template/validator contract expects the required anchors and headers to stay in order. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adding a new primary top-level generated section ahead of canonical anchored sections when the existing template/validator contract expects the required anchors and headers to stay in order.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new primary top-level generated section ahead of canonical anchored sections when the existing template/validator contract expects the required anchors and headers to stay in order.

### Auto-healing duplicate or missing generated markers by scanning nearby prose and "best guessing" the intended replaceable span. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Auto-healing duplicate or missing generated markers by scanning nearby prose and "best guessing" the intended replaceable span.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auto-healing duplicate or missing generated markers by scanning nearby prose and "best guessing" the intended replaceable span.

### CocoIndex semantic search was attempted twice for generated-block/rollback/lock precedents, but both tool calls were cancelled before returning results, so this iteration relied on exact local evidence plus pre-training patterns. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: CocoIndex semantic search was attempted twice for generated-block/rollback/lock precedents, but both tool calls were cancelled before returning results, so this iteration relied on exact local evidence plus pre-training patterns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CocoIndex semantic search was attempted twice for generated-block/rollback/lock precedents, but both tool calls were cancelled before returning results, so this iteration relied on exact local evidence plus pre-training patterns.

### Collapsing auditability into a single generic "start completed" event; that would not prove whether relationship capture, re-entry, or mode pruning behaved correctly. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Collapsing auditability into a single generic "start completed" event; that would not prove whether relationship capture, re-entry, or mode pruning behaved correctly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Collapsing auditability into a single generic "start completed" event; that would not prove whether relationship capture, re-entry, or mode pruning behaved correctly.

### Copying `adr-tools` literally as a title-only command. Our command has to emit three linked artifacts, so it needs slightly more structure than `adr new`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Copying `adr-tools` literally as a title-only command. Our command has to emit three linked artifacts, so it needs slightly more structure than `adr new`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `adr-tools` literally as a title-only command. Our command has to emit three linked artifacts, so it needs slightly more structure than `adr new`.

### Copying GitHub Spec Kit's current phase model literally. Its precedent is useful, but it does not expose a standalone intake command analogous to `/spec_kit:start`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Copying GitHub Spec Kit's current phase model literally. Its precedent is useful, but it does not expose a standalone intake command analogous to `/spec_kit:start`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying GitHub Spec Kit's current phase model literally. Its precedent is useful, but it does not expose a standalone intake command analogous to `/spec_kit:start`.

### Creating a second parallel field namespace for delegated `/start` when `feature_description` and `spec_path` already exist in the parent command contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Creating a second parallel field namespace for delegated `/start` when `feature_description` and `spec_path` already exist in the parent command contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating a second parallel field namespace for delegated `/start` when `feature_description` and `spec_path` already exist in the parent command contract.

### Existing packet `graph-metadata.json` examples only show empty manual arrays, so the object-entry recommendation is spec-compatible but not yet runtime-proven by a populated packet example. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Existing packet `graph-metadata.json` examples only show empty manual arrays, so the object-entry recommendation is spec-compatible but not yet runtime-proven by a populated packet example.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing packet `graph-metadata.json` examples only show empty manual arrays, so the object-entry recommendation is spec-compatible but not yet runtime-proven by a populated packet example.

### Existing parent-command intake/delegation audit events remain a sibling concern; this pass could only pin the deep-research-side runtime sink, not a finished `/start` or `/plan` logging surface. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Existing parent-command intake/delegation audit events remain a sibling concern; this pass could only pin the deep-research-side runtime sink, not a finished `/start` or `/plan` logging surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing parent-command intake/delegation audit events remain a sibling concern; this pass could only pin the deep-research-side runtime sink, not a finished `/start` or `/plan` logging surface.

### External generator docs are strong on minimum-input scaffolding and automation defaults, but they do not model this repo's repair-mode or deep-research placeholder-upgrade edge cases. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: External generator docs are strong on minimum-input scaffolding and automation defaults, but they do not model this repo's repair-mode or deep-research placeholder-upgrade edge cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: External generator docs are strong on minimum-input scaffolding and automation defaults, but they do not model this repo's repair-mode or deep-research placeholder-upgrade edge cases.

### Full rewrite of any existing `spec.md` anchor body during post-synthesis. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Full rewrite of any existing `spec.md` anchor body during post-synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Full rewrite of any existing `spec.md` anchor body during post-synthesis.

### I could not retrieve a reliable primary source for `rfcs/rfcs` or "OpenRFC" within this iteration budget, so RFC evidence here leans on IETF and RFC Editor primary process pages instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: I could not retrieve a reliable primary source for `rfcs/rfcs` or "OpenRFC" within this iteration budget, so RFC evidence here leans on IETF and RFC Editor primary process pages instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I could not retrieve a reliable primary source for `rfcs/rfcs` or "OpenRFC" within this iteration budget, so RFC evidence here leans on IETF and RFC Editor primary process pages instead.

### Inserting `step_detect_spec_present` before JSONL creation and forcing pre-init mutation to run without a durable audit sink. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Inserting `step_detect_spec_present` before JSONL creation and forcing pre-init mutation to run without a durable audit sink.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inserting `step_detect_spec_present` before JSONL creation and forcing pre-init mutation to run without a durable audit sink.

### Iteration-004's external generator evidence is strong enough to close `Q1` at the risk-class level, but it does not answer storage details for the eventual intake audit log. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Iteration-004's external generator evidence is strong enough to close `Q1` at the risk-class level, but it does not answer storage details for the eventual intake audit log.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Iteration-004's external generator evidence is strong enough to close `Q1` at the risk-class level, but it does not answer storage details for the eventual intake audit log.

### Keeping the older `scratch/.deep-research.lock` location as-is when the live init workflow now guarantees `research/` but not `scratch/`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Keeping the older `scratch/.deep-research.lock` location as-is when the live init workflow now guarantees `research/` but not `scratch/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keeping the older `scratch/.deep-research.lock` location as-is when the live init workflow now guarantees `research/` but not `scratch/`.

### Lock-free concurrent deep-research writes to the same spec folder, even if the content diff would appear idempotent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Lock-free concurrent deep-research writes to the same spec folder, even if the content diff would appear idempotent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lock-free concurrent deep-research writes to the same spec folder, even if the content diff would appear idempotent.

### Moving execution mode, dispatch mode, or phase decomposition into `/start`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Moving execution mode, dispatch mode, or phase decomposition into `/start`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving execution mode, dispatch mode, or phase decomposition into `/start`.

### Older lock guidance referenced now-obsolete `step_initialize` / `step_finalize` names, so it was useful for semantics but not for exact step IDs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Older lock guidance referenced now-obsolete `step_initialize` / `step_finalize` names, so it was useful for semantics but not for exact step IDs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Older lock guidance referenced now-obsolete `step_initialize` / `step_finalize` names, so it was useful for semantics but not for exact step IDs.

### Pure append-only findings inside an existing anchor without machine-owned generated markers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Pure append-only findings inside an existing anchor without machine-owned generated markers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pure append-only findings inside an existing anchor without machine-owned generated markers.

### The current repo exposes strong generated-marker precedent (`sk-deep-review`) and rollback commentary (`loop_protocol.md`), but not a ready-made `spec.md` mutation implementation that could be copied directly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The current repo exposes strong generated-marker precedent (`sk-deep-review`) and rollback commentary (`loop_protocol.md`), but not a ready-made `spec.md` mutation implementation that could be copied directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current repo exposes strong generated-marker precedent (`sk-deep-review`) and rollback commentary (`loop_protocol.md`), but not a ready-made `spec.md` mutation implementation that could be copied directly.

### The live repo still has no ready-made `spec.md` mutator in `/spec_kit:deep-research`, so the protocol shape had to be synthesized from the current YAML lifecycle plus prior packet findings rather than copied from an implementation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The live repo still has no ready-made `spec.md` mutator in `/spec_kit:deep-research`, so the protocol shape had to be synthesized from the current YAML lifecycle plus prior packet findings rather than copied from an implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The live repo still has no ready-made `spec.md` mutator in `/spec_kit:deep-research`, so the protocol shape had to be synthesized from the current YAML lifecycle plus prior packet findings rather than copied from an implementation.

### The repo still does not expose a live `/spec_kit:start` implementation, so the state graph and audit schema remain contract proposals rather than confirmed runtime behavior. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The repo still does not expose a live `/spec_kit:start` implementation, so the state graph and audit schema remain contract proposals rather than confirmed runtime behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The repo still does not expose a live `/spec_kit:start` implementation, so the state graph and audit schema remain contract proposals rather than confirmed runtime behavior.

### The repo still has no live `/spec_kit:start` command implementation to copy, so the answer has to be inferred from adjacent command and YAML contracts rather than lifted from an existing command surface. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The repo still has no live `/spec_kit:start` command implementation to copy, so the answer has to be inferred from adjacent command and YAML contracts rather than lifted from an existing command surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The repo still has no live `/spec_kit:start` command implementation to copy, so the answer has to be inferred from adjacent command and YAML contracts rather than lifted from an existing command surface.

### Treating deep-research write-back as permission to rewrite user-authored `spec.md` sections wholesale. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating deep-research write-back as permission to rewrite user-authored `spec.md` sections wholesale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating deep-research write-back as permission to rewrite user-authored `spec.md` sections wholesale.

### Treating deep-research-seeded TODOs as a healthy `populated-folder` and letting `/plan` continue without re-entry. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating deep-research-seeded TODOs as a healthy `populated-folder` and letting `/plan` continue without re-entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating deep-research-seeded TODOs as a healthy `populated-folder` and letting `/plan` continue without re-entry.

### Treating optional checkpoint commits as the primary rollback contract for `spec.md` mutation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating optional checkpoint commits as the primary rollback contract for `spec.md` mutation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating optional checkpoint commits as the primary rollback contract for `spec.md` mutation.

### Treating post-synthesis write-back as a save-phase side effect after config completion instead of a synthesis-phase success criterion. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating post-synthesis write-back as a save-phase side effect after config completion instead of a synthesis-phase success criterion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating post-synthesis write-back as a save-phase side effect after config completion instead of a synthesis-phase success criterion.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `rg -n "interview|intake" .opencode/command/ .opencode/skill/` produced almost no direct command-surface precedent, so local evidence was indirect rather than a ready-made pattern. (iteration 1)
- A quick `MEMORY.md` keyword pass did not return extra hits beyond the sibling packets already named in the strategy file. (iteration 1)
- Copying `adr-tools` literally as a title-only command. Our command has to emit three linked artifacts, so it needs slightly more structure than `adr new`. (iteration 1)
- Copying GitHub Spec Kit's current phase model literally. Its precedent is useful, but it does not expose a standalone intake command analogous to `/spec_kit:start`. (iteration 1)
- I could not retrieve a reliable primary source for `rfcs/rfcs` or "OpenRFC" within this iteration budget, so RFC evidence here leans on IETF and RFC Editor primary process pages instead. (iteration 1)
- Treating deep-research write-back as permission to rewrite user-authored `spec.md` sections wholesale. (iteration 1)
- `rg -n "ANCHOR:" .opencode/skill/ .opencode/command/ --type md` surfaced many anchor examples, but most were retrieval or documentation patterns rather than direct write-back contracts. (iteration 2)
- `rg -n "spec.md" .opencode/command/spec_kit/assets/*.yaml` mostly exposed template-loading and strict-validation constraints, not a ready-made `spec.md` mutation implementation. (iteration 2)
- Adding a new primary top-level generated section ahead of canonical anchored sections when the existing template/validator contract expects the required anchors and headers to stay in order. (iteration 2)
- Full rewrite of any existing `spec.md` anchor body during post-synthesis. (iteration 2)
- Pure append-only findings inside an existing anchor without machine-owned generated markers. (iteration 2)
- `rg -n "lock|concurrent|parallel|race" .opencode/skill/sk-deep-research/ .opencode/skill/system-spec-kit/ | head -30` did not reveal a live `spec.md` single-writer contract in the current command surfaces; most hits were adjacent or reference-only. (iteration 3)
- Auto-healing duplicate or missing generated markers by scanning nearby prose and "best guessing" the intended replaceable span. (iteration 3)
- CocoIndex semantic search was attempted twice for generated-block/rollback/lock precedents, but both tool calls were cancelled before returning results, so this iteration relied on exact local evidence plus pre-training patterns. (iteration 3)
- Lock-free concurrent deep-research writes to the same spec folder, even if the content diff would appear idempotent. (iteration 3)
- The current repo exposes strong generated-marker precedent (`sk-deep-review`) and rollback commentary (`loop_protocol.md`), but not a ready-made `spec.md` mutation implementation that could be copied directly. (iteration 3)
- Treating optional checkpoint commits as the primary rollback contract for `spec.md` mutation. (iteration 3)
- A second free-form metadata interview just for relationships, or a new top-level `relationships` object outside `manual.*`. (iteration 4)
- A visible chained-command UX where `/plan` or `/complete` tells the user to stop and run `/start` separately before resuming. (iteration 4)
- Existing packet `graph-metadata.json` examples only show empty manual arrays, so the object-entry recommendation is spec-compatible but not yet runtime-proven by a populated packet example. (iteration 4)
- External generator docs are strong on minimum-input scaffolding and automation defaults, but they do not model this repo's repair-mode or deep-research placeholder-upgrade edge cases. (iteration 4)
- Moving execution mode, dispatch mode, or phase decomposition into `/start`. (iteration 4)
- The repo still has no live `/spec_kit:start` command implementation to copy, so the answer has to be inferred from adjacent command and YAML contracts rather than lifted from an existing command surface. (iteration 4)
- `rg -n "state|machine|transition|FSM" .opencode/command/ .opencode/skill/system-spec-kit/ | head -20` found only indirect precedent; the explicit state-machine wording still has to be synthesized from adjacent YAML state/circuit-breaker patterns plus packet-local edge cases. (iteration 5)
- Collapsing auditability into a single generic "start completed" event; that would not prove whether relationship capture, re-entry, or mode pruning behaved correctly. (iteration 5)
- Creating a second parallel field namespace for delegated `/start` when `feature_description` and `spec_path` already exist in the parent command contract. (iteration 5)
- Iteration-004's external generator evidence is strong enough to close `Q1` at the risk-class level, but it does not answer storage details for the eventual intake audit log. (iteration 5)
- The repo still does not expose a live `/spec_kit:start` implementation, so the state graph and audit schema remain contract proposals rather than confirmed runtime behavior. (iteration 5)
- Treating deep-research-seeded TODOs as a healthy `populated-folder` and letting `/plan` continue without re-entry. (iteration 5)
- Existing parent-command intake/delegation audit events remain a sibling concern; this pass could only pin the deep-research-side runtime sink, not a finished `/start` or `/plan` logging surface. (iteration 6)
- Inserting `step_detect_spec_present` before JSONL creation and forcing pre-init mutation to run without a durable audit sink. (iteration 6)
- Keeping the older `scratch/.deep-research.lock` location as-is when the live init workflow now guarantees `research/` but not `scratch/`. (iteration 6)
- Older lock guidance referenced now-obsolete `step_initialize` / `step_finalize` names, so it was useful for semantics but not for exact step IDs. (iteration 6)
- The live repo still has no ready-made `spec.md` mutator in `/spec_kit:deep-research`, so the protocol shape had to be synthesized from the current YAML lifecycle plus prior packet findings rather than copied from an implementation. (iteration 6)
- Treating post-synthesis write-back as a save-phase side effect after config completion instead of a synthesis-phase success criterion. (iteration 6)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q6 — determine the safest post-synthesis `spec.md` write-back contract: anchor-bounded append, fenced addendum, or constrained anchor updates, using local command/YAML evidence plus document-mutator precedents.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

Auto-surfaced via `memory_context({ input: "spec_kit start command interactive intake interview deep-research spec.md integration", mode: "focused", intent: "understand" })` on 2026-04-14T08:02:28Z. Constitutional results were unrelated (mnemosyne chunks). Triggered results worth checking:

| memory_id | spec_folder | matched phrases | relevance |
|-----------|-------------|-----------------|-----------|
| 532 | `skilled-agent-orchestration/024-sk-deep-research-refinement` | deep, research, spec | Prior refinement of the deep-research skill — possibly documents spec.md integration attempts |
| 580 | `skilled-agent-orchestration/037-cmd-merge-spec-kit-phase` | spec, kit | Similar "merge one command into another" pattern worth studying for delegation design |
| 323 | `system-spec-kit/024-compact-code-graph/005-command-agent-alignment` | command, spec | Command/agent alignment for speckit commands — directly relevant to `/start` ↔ plan/complete delegation |
| 1082 | `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/010-integration-testing` | spec, integration | Integration-testing patterns possibly reusable for validating `/start` + smart-delegation |
| 988 | `system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features` | spec, kit | "Implement and remove deprecated features" — precedent for migration/back-compat concerns |

Fresh `spec.md` was authored this session at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md` (Level 2, 10 REQs, 6 SCs, 3 open questions). Iteration agents should treat it as the primary artifact under review.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7–11
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex gpt-5.4 xhigh fast (`codex exec --model gpt-5.4 -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`)
- Current generation: 1
- Started: 2026-04-14T08:05:00Z
<!-- /ANCHOR:research-boundaries -->
