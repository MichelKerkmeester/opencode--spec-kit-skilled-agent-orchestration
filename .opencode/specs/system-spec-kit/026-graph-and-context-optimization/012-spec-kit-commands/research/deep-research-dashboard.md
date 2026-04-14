---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Validate and refine the /spec_kit:start command design and /spec_kit:deep-research spec.md integration contract specified in specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md — research existing patterns, edge cases, best practices, and surface contradictions or gaps
- Started: 2026-04-14T08:05:00.000Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-04-14_spec-kit-commands-012_gen1
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q2 prior art in spec-driven systems | prior-art | 0.75 | 5 | complete |
| 2 | Q6 post-synthesis spec.md write-back contract | mutation-contract | 0.46 | 5 | complete |
| 3 | Q3+Q5 edge cases & REQ gaps | edge-cases | 0.38 | 5 | complete |
| 4 | Q4+Q7 delegation UX & interview shape | interview-ux | 0.34 | 4 | complete |
| 5 | acceptance criteria + state machines + Q1 closure | refinement | 0.29 | 6 | complete |
| 6 | spec_check_protocol draft + YAML step ordering | protocol-draft | 0.23 | 5 | complete |
| 7 | concrete diff hunks + REQ coverage matrix | delta-plan | 0.18 | 6 | complete |
| 8 | /start YAML drafts + plan/complete delegation deltas | start-command-draft | 0.16 | 5 | complete |
| 9 | schema/runtime pressure-test of /start draft | pressure-test | 0.12 | 5 | complete |
| 10 | final spec deltas + implementation-readiness checklist | final-synthesis-prep | 0.08 | 6 | complete |

- iterationsCompleted: 10
- keyFindings: 143
- openQuestions: 7
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/7
- [ ] Q1. What existing interactive-interview patterns (in CLI tools, spec-driven systems, or prior speckit work) would `/spec_kit:start` reuse or avoid, and what failure modes have been documented?
- [ ] Q2. How do other spec-driven systems (GitHub spec-kit, ADR tools, RFC workflows, Notion/Obsidian AI) handle the "intake-before-plan" ritual, and what anti-patterns should we copy-proof against?
- [ ] Q3. What concrete edge cases arise when a research tool mutates a user-authored `spec.md` (trust violations, idempotency, rollback, merge conflicts across parallel sessions)?
- [ ] Q4. Is the "smart delegation" from `/plan` and `/complete` → `/start` actually orthogonal, or does it create hidden coupling, double round-trips, or surprise prompt ordering that breaks `:auto` flows?
- [ ] Q5. Do the 10 requirements (REQ-001..REQ-010) in spec.md have latent contradictions, missing acceptance criteria, or gaps when checked against concrete user scenarios (empty folder, partial folder, phase-child, repair mode)?
- [ ] Q6. How should post-synthesis write-back to `spec.md` actually work — anchor-bounded append-only, fenced research section, or full anchor rewriting? What patterns exist elsewhere and which are safest?
- [ ] Q7. What should `/spec_kit:start` ask (minimum viable interview) vs. defer, and what's the right manual-graph-relationship capture shape (depends_on / related_to / supersedes) to avoid prompting fatigue?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.16 -> 0.12 -> 0.08
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.08
- coverageBySources: {"code":14,"cookiecutter.readthedocs.io":2,"create-react-app.dev":1,"doc.rust-lang.org":2,"github.com":3,"other":52,"www.ietf.org":2,"www.rfc-editor.org":1,"yeoman.io":1}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q6 — determine the safest post-synthesis `spec.md` write-back contract: anchor-bounded append, fenced addendum, or constrained anchor updates, using local command/YAML evidence plus document-mutator precedents.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
