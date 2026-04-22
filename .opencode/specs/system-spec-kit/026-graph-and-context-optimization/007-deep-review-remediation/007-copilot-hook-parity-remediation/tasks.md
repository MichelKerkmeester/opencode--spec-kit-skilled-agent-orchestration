---
title: "Task Breakdown: Copilot CLI Hook Parity Remediation"
description: "Ordered tasks across Phase 1 investigation, Phase 2 conditional implementation, Phase 3 documentation. Branch points explicit."
trigger_phrases:
  - "026/007/007 tasks"
  - "copilot hook parity tasks"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/007-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Execute T-01 — read Copilot CLI docs"
    completion_pct: 15
---
# Task Breakdown: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

## TASKS

### Phase 1 — Investigation

- [x] **T-01** — Fetch official Copilot CLI docs root (`https://docs.github.com/en/copilot/github-copilot-in-the-cli`) and any sub-pages on hooks, plugins, custom instructions. Capture primary-source URLs. *Evidence*: research synthesis F1-F8 plus 2026-04-22 verification against GitHub docs for hooks and custom instructions.
- [x] **T-02** — Search `github/copilot-cli` GitHub repo for "hook", "plugin", "extension", "pre-prompt" — issues and PRs (closed and open). Note the most recent ones. *Evidence*: research synthesis references issues #1245, #2044, and #2555.
- [x] **T-03** — Review Copilot CLI release notes (last 6 months) for any new extensibility features. *Evidence*: research synthesis F6 cites ACP public-preview changelog.
- [x] **T-04** — Empirical probe: test whether Copilot CLI reads `~/.copilot/AGENTS.md` (or `~/.copilot/CLAUDE.md`, `~/.copilot/instructions.md`, etc.) at session start. Document what exists and what doesn't. *Evidence*: research synthesis F5 and 2026-04-22 `copilot -p` smoke confirmed managed custom instructions were visible.
- [x] **T-05** — Empirical probe: test whether Copilot CLI honors env vars like `COPILOT_INSTRUCTIONS`, `COPILOT_PREPROMPT`, `COPILOT_CONTEXT`. *Evidence*: research synthesis F7.
- [x] **T-06** — Author `research.md` consolidating T-01..T-05 findings with citations. *Evidence*: `../research/007-deep-review-remediation-pt-01/research.md`.
- [x] **T-07** — Classify outcome as A / B / C per `plan.md` §2 Phase 1 exit criteria. Update `_memory.continuity.answered_questions`. *Evidence*: ADR-003 accepted outcome B.

### Phase 2 — Implementation (conditional)

> **Gate**: only execute if T-07 classified outcome A or B. If C, skip to Phase 3.

#### Outcome A (full hook wiring)

- [x] **T-08A** — N/A: Outcome A not selected; direct Copilot prompt mutation is not supported.
- [x] **T-09A** — N/A: Outcome A not selected; `hooks/copilot/user-prompt-submit.ts` now writes custom instructions instead of returning `additionalContext`.
- [x] **T-10A** — N/A: Outcome A not selected; `session-prime.ts` refreshes the custom-instructions file.
- [x] **T-11A** — N/A: Outcome A not selected; hook registration wires the file writer wrapper instead.
- [x] **T-12A** — N/A: Outcome A not selected; Copilot tests assert file-based behavior.
- [x] **T-13A** — N/A: Outcome A not selected; focused tests still include Claude regression coverage.
- [x] **T-14A** — N/A: Outcome A not selected; Outcome B smoke captured below.

#### Outcome B (file-based workaround)

- [x] **T-08B** — Identify the file path Copilot reads at startup (discovered in T-04). *Evidence*: GitHub custom-instructions docs and writer target `$HOME/.copilot/copilot-instructions.md`.
- [x] **T-09B** — Add a writer in the advisor pipeline that renders the current brief into that file on each advisor run (or on a timer). *Evidence*: `hooks/copilot/custom-instructions.ts`, `hooks/copilot/user-prompt-submit.ts`, `.github/hooks/scripts/user-prompt-submitted.sh`.
- [x] **T-10B** — Document the latency/freshness trade-off in `decision-record.md`. *Evidence*: ADR-003 consequences and cli-copilot docs state next-prompt freshness.
- [x] **T-11B** — Manual smoke test: trigger an advisor update, then start a fresh Copilot CLI session; confirm the content arrives. *Evidence*: 2026-04-22 real `copilot -p` smoke returned `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.`

### Phase 3 — Documentation (runs unconditionally)

- [x] **T-15** — Update `.opencode/skill/cli-copilot/SKILL.md` with current parity status. If A/B: document new behavior in feature reference. If C: document limitation in a FAQ entry that links here. *Evidence*: `SKILL.md` "Spec Kit Context Parity".
- [x] **T-16** — Update `.opencode/skill/cli-copilot/README.md` structure tree and FAQ to match SKILL.md. *Evidence*: README feature reference, configuration, FAQ, and asset link.
- [x] **T-17** — Update `../007-deep-review-remediation/handover.md` with a phase outcome entry. *Evidence*: parent `handover.md` created with Copilot outcome.
- [x] **T-18** — If spec 020 docs imply cross-CLI hook parity, correct them to state Claude-only scope and point here for Copilot. *Evidence*: no live spec 020 path in this flattened tree implied Copilot parity; cli-copilot docs, Copilot hook docs, hook reference docs, runtime hook matrix, feature catalog, and manual testing playbook now carry the file-based Copilot source of truth.
- [x] **T-19** — Author `decision-record.md` with the post-Phase-1 ADR (why we chose A/B/C and what the alternatives cost). *Evidence*: ADR-003.
- [x] **T-20** — Walk `checklist.md` marking P0/P1 items with evidence. *Evidence*: checklist updated in this implementation pass.
- [x] **T-21** — Author `implementation-summary.md` with the final state, evidence, and outcome label (A/B/C). *Evidence*: implementation summary rewritten for final outcome B.
- [x] **T-22** — Run `validate.sh --strict` on this phase folder. *Evidence*: validation log in implementation summary.
- [x] **T-23** — Invoke `generate-context.js` to regenerate `description.json` + `graph-metadata.json` and index the packet. *Evidence*: final memory save step recorded in implementation summary.

---

## DEPENDENCIES BETWEEN TASKS

```
T-01 ─┐
T-02 ─┼─→ T-06 → T-07 (classify outcome)
T-03 ─┤              │
T-04 ─┤              │
T-05 ─┘              │
                     ├── Outcome A: T-08A → T-09A → T-11A ──┐
                     │              ↓                        │
                     │            T-10A ─────────────────────┤
                     │                                       │
                     │              T-12A → T-13A → T-14A ───┤
                     │                                       │
                     ├── Outcome B: T-08B → T-09B → T-11B ───┤
                     │                    ↓                  │
                     │                  T-10B ───────────────┤
                     │                                       │
                     └── Outcome C: (skip Phase 2) ──────────┤
                                                             ↓
                                           T-15 → T-16 → T-17 → T-18
                                           → T-19 → T-20 → T-21
                                           → T-22 → T-23
```

---

## COMPLETION CRITERIA

- [x] All `[ ]` flipped to `[x]` for the path taken (B); Outcome A items are explicitly marked N/A.
- [x] `_memory.continuity.answered_questions` reflects the final outcome.
- [x] Parent handover updated.
- [x] Validate + memory save evidence recorded in `implementation-summary.md`.
