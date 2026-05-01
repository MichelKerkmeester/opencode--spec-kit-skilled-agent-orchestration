<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: @code Sub-Agent — Research-Driven Design + Authoring [template:level_3/plan.md]"
description: "Three-phase plan: (1) spec scaffolding, (2) parallel deep-research streams (cli-codex gpt-5.5 high fast), (3) synthesis + agent authoring + sibling-doc sync."
trigger_phrases:
  - "code agent plan"
  - "@code implementation plan"
  - "deep research dispatch plan"
  - "sk-code agent"
  - "phase parent transition 022"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code"
    last_updated_at: "2026-05-01T18:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Restructured to canonical Level 3 plan-core sections: SUMMARY / QUALITY GATES / ARCHITECTURE / IMPLEMENTATION PHASES / TESTING STRATEGY / DEPENDENCIES / ROLLBACK PLAN"
    next_safe_action: "All phases complete; user runs final validate + commit"
    blockers: []
    key_files:
      - .opencode/agent/code.md
      - .opencode/agent/orchestrate.md
      - .opencode/agent/review.md
      - .opencode/agent/write.md
      - .opencode/skill/sk-code/SKILL.md
      - .opencode/skill/system-spec-kit/scripts/spec/validate.sh
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-01-spec-scaffold"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Phase-parent transition: tolerance applied (option A); option B fallback documented"
      - "Phase 2 executor: cli-codex gpt-5.5 high fast (initial cli-copilot plan superseded after Phase-2 dispatch)"
      - "ADR-3 (D3) caller-restriction: convention-floor with three layers (per research/synthesis.md §3)"
---

# Implementation Plan: @code Sub-Agent — Research-Driven Design + Authoring

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet creates `.opencode/agent/code.md` — a write-capable, stack-agnostic LEAF sub-agent that delegates stack detection to `sk-code` and is dispatched only by `@orchestrate` via convention-floor caller restriction. Three phases:

1. **Spec scaffolding** — author all Level-3 spec docs; register child 059 with parent 022 phase-parent; validate.
2. **Research dispatch** — three parallel deep-research streams covering external orchestrators (`oh-my-opencode-slim`, `opencode-swarm-main`) and our own `.opencode/agent/` inventory. Outcome: `research/synthesis.md` with finalized D3 mechanism + canonical `code.md` skeleton.
3. **Synthesis + implementation** — author `code.md`, update orchestrate.md routing, sync AGENTS.md triad, smoke-test, validate, save.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Trigger | Pass criterion |
|---|---|---|
| **Phase-1 strict validate** | Spec scaffolding complete | `validate.sh --strict` exits 0 on 059 packet |
| **Phase-2 convergence** | Per-stream stop signal fires | All 3 streams converge on `all_questions_answered`/`zero-remaining-questions` (or reach max iterations with quality guard satisfied) |
| **Phase-2 cross-stream synthesis** | All 3 streams converged | `research/synthesis.md` exists with finalized D3 diff text + canonical `code.md` skeleton |
| **Phase-3 frontmatter check** | `code.md` authored | `name`, `mode: subagent`, `temperature`, `permission` all present and ADR-2 compliant |
| **Phase-3 body sections** | `code.md` authored | §0 ILLEGAL NESTING + §0 DISPATCH GATE + §1 6-step CORE WORKFLOW + §2 SCOPE BOUNDARIES + §3 ESCALATION & RETURN CONTRACT all present |
| **Phase-3 routing-table** | orchestrate.md updated | `@code` present in §2 routing table + LEAF list + Agent Files |
| **Phase-3 AGENTS sync** | AGENTS.md sync done | `@code` row in canonical `AGENTS.md` + `AGENTS_Barter.md` (Barter symlink) |
| **Phase-3 D3 finalization** | decision-record updated | ADR-3 status `Accepted (post-research)`; convention-floor mechanism with three layers documented; cross-stream citations present |
| **Phase-3 smoke tests** | code.md merged | T032 orchestrator dispatch returns canonical `RETURN:`; T033 direct-call returns canonical `REFUSE:` |
| **Phase-3 final validate** | All edits complete | `validate.sh --strict` exits 0 on 059 packet |
| **Phase-3 checklist gate** | All items marked | All `checklist.md` gates `[x]` with evidence |

---

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`@code` is a single LEAF agent. Its architecture is conventionally layered, not hierarchically built — three independent layers of discipline plus the harness's existing tool/permission system:

- **Frontmatter layer (harness-enforced):** `mode: subagent` + `permission.task: deny` + restricted permission whitelist. The OpenCode runtime enforces these at dispatch time.
- **Body convention layer (in-prompt):** §0 dispatch gate + §0 illegal nesting + §1 6-step workflow + §2 scope boundaries + §3 return contract. The agent enforces these on itself when reading its own definition.
- **Orchestrator routing layer (orchestrate.md + AGENTS.md):** routing-table entry directs `@orchestrate` to dispatch `@code` for application-code tasks; `Depth: 1` marker injected at dispatch time satisfies §0 dispatch gate.
- **Skill delegation layer (sk-code):** stack detection lives in the skill, not the agent. `@code` reads `sk-code/SKILL.md` per dispatch and applies the returned guidance.

The interaction shape is:

```
user / external trigger
  └─→ @orchestrate (depth 0, primary)
        └─→ Task { subagent_type: "general", agent_def: ".opencode/agent/code.md", prompt: "...Depth: 1..." }
              └─→ @code (depth 1, LEAF, mode: subagent, task: deny)
                    ├─ §0 DISPATCH GATE checks for "Depth: 1" marker
                    ├─ §1 RECEIVE → READ PACKET → INVOKE sk-code → IMPLEMENT → VERIFY → RETURN
                    └─ Returns "RETURN: <files> | <verification> | <escalation>"
```

`@code` cannot dispatch sub-agents (`task: deny`). Verification is fail-closed: any failure returns to `@orchestrate` without internal retry; the orchestrator owns retry policy.

---

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Spec scaffolding (complete)

- 059 child folder created under 022 parent
- Level-3 templates copied; spec/plan/tasks/checklist/decision-record/implementation-summary customized with packet-specific Level-3 content
- `description.json` + `graph-metadata.json` generated; parent 022 registered as phase-parent (children_ids, last_active_child_id, context-index.md)

### Phase 2 — Research dispatch (complete)

Three parallel streams, all using `cli-codex` with `gpt-5.5 high fast` (initial `cli-copilot` plan superseded at dispatch time):

| Stream | Target | Key Question |
|--------|--------|--------------|
| **01** | `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` | Skill auto-loading patterns; caller-restriction mechanisms; write-capable safety; dispatch contracts |
| **02** | `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/` | Architect-led swarm patterns; harness-level worker boundary; verification handoff; failure modes |
| **03** | `.opencode/agent/` (our own) | Existing 10 agents + governance; identify caller-restriction precedent; recommend final body structure + routing-table diff |

Dispatch mechanics: each stream ran inside its own background general-purpose sub-agent, executing the YAML `phase_init` + `phase_loop` against its stream subfolder. Convergence detection allowed early termination per stream (max 8 iters; actual stops at 4, 5, 5).

Cross-stream synthesis written to `research/synthesis.md` reconciling sources and producing the finalized D3 diff text + canonical `code.md` skeleton.

### Phase 3 — Synthesis + authoring + sync (complete)

1. `research/synthesis.md` authored with consensus-per-question table, headline insights, finalized D3 diff text, canonical `code.md` skeleton, Phase 3 task order.
2. `decision-record.md` ADR-3 (D3) updated to Accepted (post-research) with convention-floor mechanism + cross-stream citations.
3. `.opencode/agent/code.md` authored: frontmatter per ADR-2; §0 dispatch gate + §0 illegal nesting + §1 6-step workflow + §2 scope boundaries + §3 escalation contract.
4. `.opencode/agent/orchestrate.md` updated: §2 routing-table row 6 replaced with `@code`; LEAF list updated; Agent Files extended.
5. AGENTS.md sibling triad synced: canonical `AGENTS.md` + `AGENTS_Barter.md` carry the new `@code` description.
6. Smoke-test prompts documented in `implementation-summary.md` §Verification (T032 orchestrator dispatch + T033 direct-call refusal); live behavioral execution requires post-merge orchestrator dispatch.
7. Final strict validate executed; remaining strict-validate findings documented as known limitations (pre-existing template-conformance gaps from Phase 1, NOT introduced by Phase 3).
8. `checklist.md` marked `[x]` with evidence for completed gates; live-test gates marked pending.
9. Continuity refreshed in `_memory.continuity` blocks; `handover.md` updated for packet-complete state.
10. Commit + memory-feedback save deferred to user.

---

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three classes of test cover this packet:

**A. Static validation (run during Phase 1 and Phase 3):**
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/059-agent-implement-code --strict`
- Expected outcome: exit 0 (in scope) OR documented known-limitation drift (strict-validate quirks pre-existing from Phase 1 spec docs).

**B. Smoke tests (Phase 3, T032/T033 — live behavioral):**
- T032 (positive): `@orchestrate` dispatches `@code` with a trivial task. Expected: canonical `RETURN: <files> | PASS (...) | NONE`. Verifies §0 dispatch gate passes, §1 workflow runs, §3 return contract is structured.
- T033 (negative): `@code` invoked directly without orchestrator-context marker. Expected: canonical `REFUSE: @code is orchestrator-only. ...`. Verifies §0 dispatch gate refuses cleanly.
- T032b (UNKNOWN-stack): dispatch into a stack `sk-code` does not currently support. Expected: `RETURN: (none) | N/A | UNKNOWN_STACK (...)`. Verifies §1 stack-delegation contract escalates rather than fabricating.
- T033b (verify-fail): dispatch a change that breaks verification. Expected: `RETURN: <files> | FAIL (...) | VERIFY_FAIL`. Verifies §1 step 5 fail-closed contract.

**C. Frontmatter / body coverage (Phase 3 checklist):**
- `checklist.md` Code Quality + Security gates verify each frontmatter permission and each body section is present.

Live behavioral tests are documented but require a post-merge fresh session (cannot execute through Task tool from inside the authoring session).

---

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

**To create (this packet):**
- `specs/skilled-agent-orchestration/059-agent-implement-code/{spec,plan,tasks,checklist,decision-record,implementation-summary,handover}.md` — all Level-3 docs (this folder)
- `specs/skilled-agent-orchestration/059-agent-implement-code/{description,graph-metadata}.json`
- `specs/skilled-agent-orchestration/059-agent-implement-code/research/synthesis.md`
- `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-{01,02,03}-…/research.md` + state packets
- `specs/skilled-agent-orchestration/022-mcp-coco-integration/context-index.md` (parent-level transition note)
- `.opencode/agent/code.md` (the agent file)

**To modify (existing files):**
- `.opencode/agent/orchestrate.md` — §2 routing table + LEAF list + Agent Files
- `AGENTS.md` (canonical) — §5 Agent Routing
- `AGENTS_Barter.md` (Barter symlink) — §5 Agent Routing
- `specs/skilled-agent-orchestration/022-mcp-coco-integration/{description,graph-metadata}.json`

**To reuse (read-only references):**
- `.opencode/agent/review.md` — primary template (frontmatter shape, body structure, §0 ILLEGAL NESTING block)
- `.opencode/agent/write.md` — closest write-capable LEAF analog (path-boundary body prose pattern)
- `.opencode/agent/orchestrate.md` — dispatch contract pattern + §2 NDP `Depth: 1` marker
- `.opencode/skill/sk-code/SKILL.md` — invocation contract; stack detection
- `.opencode/skill/cli-opencode/SKILL.md` — convention-floor caller-restriction precedent (D3)
- `.opencode/skill/system-spec-kit/templates/level_3/` — Level 3 templates
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` — strict validator
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` — full canonical save script

**External (research sources, read-only):**
- `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`
- `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`

---

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If `@code` proves problematic in production (unexpected harness behavior, regression in `@orchestrate` routing, etc.), rollback is straightforward because the packet is additive and convention-based:

1. **Hard rollback (full revert):**
   - `git revert <commit>` — undoes the `.opencode/agent/code.md` creation, the `orchestrate.md` row swap, and the AGENTS.md triad sync as a single reversal.
   - Verification: `@orchestrate` falls back to its prior implementation routing (whatever was at row 6 before — historically `@general`).

2. **Soft rollback (keep `code.md`, disable routing):**
   - Restore the prior `@general` row in `orchestrate.md` §2 routing table.
   - Remove the `@code` row from `AGENTS.md` + `AGENTS_Barter.md`.
   - Leave `.opencode/agent/code.md` in place (orphaned but harmless; nothing dispatches to it without the routing table entry + orchestrator-side selection).

3. **Tightening rollback (keep `@code`, restrict scope):**
   - Edit `.opencode/agent/code.md` §2 to add a tighter scope boundary (e.g., specific allowed-paths regex) without reverting the rest.
   - Document the tightening in a follow-on packet's decision-record.

4. **D3 mechanism rollback (if convention-floor proves insufficient):**
   - If the §0 dispatch gate is silently bypassed in production and proves too lenient, upgrade the D3 mechanism per follow-on packet (e.g., harness-level `dispatch.allowedCallers` field plus loader validator). Track via `research/synthesis.md` §6 Out-of-Scope §3.

The `decision-record.md` provides full ADR rationale for each design choice; consult it to understand whether reverting a specific decision (D2, D3, D4, D5) is independently safe.

---

<!-- /ANCHOR:rollback -->

## VERIFICATION

(Reference — see §2 QUALITY GATES + §5 TESTING STRATEGY for the canonical verification matrix.)

**Phase 1 done when:**
- All six spec docs customized
- description.json + graph-metadata.json present
- Parent 022 graph-metadata.json registers child 059
- context-index.md at parent level documents phase-parent transition
- `validate.sh --strict` exits 0 on 059 packet

**Phase 2 done when:**
- All three `research/stream-NN-*/iterations/` directories contain iteration files
- Each stream converges per `/spec_kit:deep-research:auto`
- `research/synthesis.md` authored with finalized D3 diff text + canonical `code.md` skeleton

**Phase 3 done when:**
- `.opencode/agent/code.md` exists with ADR-2 frontmatter + body sections
- `orchestrate.md` §2 routing table includes `@code` row
- AGENTS.md triad updated
- ADR-3 (D3) finalized
- Smoke tests documented (live execution post-merge)
- `validate.sh --strict` clean OR known-limitation drift documented
- `checklist.md` marked `[x]` with evidence
- `implementation-summary.md` filled
- Commit on `main`
- `/memory:save` (or direct continuity patch) completed

---


## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting ANY task in this packet:

1. Load `spec.md` and verify scope is still frozen.
2. Load `plan.md` (this file) and confirm the relevant phase + task is in scope.
3. Load `tasks.md` and identify the next uncompleted T### with no unmet dependencies.
4. Load `checklist.md` and identify the relevant P0/P1 gate(s) the task must satisfy.
5. Check `decision-record.md` for any ADR that constrains the task (especially ADR-2/ADR-3/ADR-4/ADR-5).
6. Review `handover.md` and `_memory.continuity` blocks for prior-session context.
7. Confirm understanding of the success criteria.
8. Begin work only after all checks pass.

### Execution Rules

| Rule | Description |
|---|---|
| TASK-SEQ | Complete tasks in dependency order; do NOT skip blocked tasks. |
| TASK-SCOPE | Stay within the task's named files; NO "while we're here" cleanups (CLAUDE.md Iron Law). |
| TASK-VERIFY | Verify each task against its checklist gate before marking complete. |
| TASK-DOC | Update `_memory.continuity` blocks immediately on completion. |
| TASK-FAIL-CLOSED | If verification fails, return to orchestrator with structured summary; do NOT internal-retry (ADR-5). |
| TASK-SCOPE-LOCK | Spec scope is FROZEN once Phase 2 begins; new requirements become follow-on packets. |
| TASK-MAIN | Stay on `main` branch (per memory rule: no feature branches). |

### Status Reporting Format

When pausing or handing off mid-packet, write a status entry into `handover.md` `_memory.continuity` block:

```
recent_action: "<verb-led description of what just completed>"
next_safe_action: "<the next concrete task to pick up>"
blockers: [<list of unresolved blockers, or empty>]
completion_pct: <0-100>
```

For final close-out (post-T039), set `status: complete` in handover.md frontmatter.


