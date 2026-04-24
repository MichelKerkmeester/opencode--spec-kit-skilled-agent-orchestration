---
title: "Imp [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation/plan]"
description: "Three-phase plan: investigate Copilot CLI extension surface, decide between wire-hooks vs document-gap, execute the chosen path. Implementation is conditional on Phase 1 findings."
trigger_phrases:
  - "026/009/004 plan"
  - "copilot hook parity plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented Copilot file workaround and updated operator docs"
    next_safe_action: "Begin Phase 1 — survey Copilot CLI extension surface"
    completion_pct: 100
---
# Implementation Plan: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

## 1. APPROACH

Investigation-first, implementation-conditional. Phase 1 establishes what's possible before Phase 2 commits to a path. This is deliberately cautious because the root cause could be "Copilot CLI has no hook API" (documentation outcome) or "Copilot CLI has a hook API we didn't use" (implementation outcome) — and the work required differs by an order of magnitude.

**Ordering rationale:**

1. **Investigate first** — the cheapest possible wrong outcome is starting to implement against a non-existent API. An hour of documentation-reading saves days of backtracking.
2. **Decide explicitly** — a written ADR in `decision-record.md` locks the chosen path so later phases don't re-litigate.
3. **Execute** — whether that means wiring hooks or writing docs, it's the same phase from a lifecycle standpoint.

---

## 2. PHASES

### Phase 1 — Investigate Copilot CLI's extension surface

**Goal**: establish empirically what Copilot CLI supports for context injection at session start and at prompt submit.

**Steps**:

1. Read the official Copilot CLI docs for: hooks, pre-prompt scripts, plugin/agent APIs, custom-instructions files, config directives, env-var injection.
2. Read the `github/copilot-cli` GitHub repo for any undocumented extension points (issues, PRs mentioning "hook", "plugin", "extension").
3. Check release notes for the last 6 months for any new extensibility features.
4. Test empirically: can Copilot read a file at `~/.copilot/AGENTS.md` or similar at startup? Does it honor any env-var like `COPILOT_INSTRUCTIONS`? Does it run a script referenced from config?
5. Document findings in a `research.md` in this folder (expected: 5-15 primary-source citations + 2-4 empirical test results).

**Exit criteria**: one of three clear outcomes:
- **A**: Copilot CLI has a usable hook/injection API → proceed to Phase 2 (implementation).
- **B**: Copilot CLI has no hook API but has a readable config/instructions path → proceed to Phase 2 with a reduced-scope workaround (file-based, not hook-based).
- **C**: Copilot CLI has no usable injection surface at all → proceed to Phase 3 (documentation only).

---

### Phase 2 — Implement parity (conditional on Phase 1 outcome A or B)

**Goal**: ship the chosen transport. Only runs if Phase 1 finds a viable mechanism.

**Steps (Outcome A — full hook wiring):**

1. Create `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/` mirror of the `claude/` structure.
2. Port `user-prompt-submit.ts` + any session-start handler, adapting to Copilot's hook contract.
3. Wire the Copilot hook registration wherever the Claude equivalent is registered (scan mcp_server for the registration point).
4. Create `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` mirroring Claude's test surface.
5. Manual smoke test: start a fresh Copilot CLI session; run the user's empirical test ("describe the startup context you were given" + "what skill did the advisor recommend"). Expect non-empty answers.

**Steps (Outcome B — file-based workaround):**

1. If Copilot reads a file at session start (e.g., `~/.copilot/AGENTS.md`): write a periodic job or hook in the advisor pipeline that writes the current brief to that file.
2. Document the latency/freshness trade-off (brief could be up to N seconds stale).
3. Manual smoke test: edit the file, start a session, confirm the content flows through.

**Exit criteria**: REQ-004 verified (Claude tests still pass); SC-002 verified (empirical test passes in Copilot); REQ-005 met (parity tests exist).

---

### Phase 3 — Document the gap (runs in all outcomes)

**Goal**: make the current state discoverable and prevent re-investigation.

**Steps**:

1. Update `.opencode/skill/cli-copilot/SKILL.md` + `README.md` with explicit parity status. If no hooks: document that in a FAQ entry. If hooks shipped: document the new behavior in the feature reference.
2. Update parent `009-hook-daemon-parity/implementation-summary.md` with a bulleted phase outcome entry.
3. Update spec 020's docs (if still relevant) to note that its hook wiring is Claude-scoped and point to this phase for Copilot parity status.
4. Write `implementation-summary.md` for this phase.
5. Run `generate-context.js` to regenerate `description.json` + `graph-metadata.json`.
6. Mark `checklist.md` P0/P1 items with evidence.

**Exit criteria**: SC-001 passes (5-minute discoverability); SC-003 passes (docs state the truth); REQ-007 met (parent summary updated).

---

## 3. DEPENDENCIES

| Dependency                                                                                    | Required for    | Status                    |
| --------------------------------------------------------------------------------------------- | --------------- | ------------------------- |
| Untracked `hooks/claude/user-prompt-submit.ts` + test committed                               | Phase 2 port    | Uncommitted (parallel work) |
| Access to Copilot CLI docs + GitHub repo                                                      | Phase 1         | Public                    |
| Ability to run Copilot CLI locally for empirical tests                                        | Phase 1 step 4 + Phase 2 smoke | Confirmed (user ran earlier) |
| Advisor brief generator stable (from spec 020)                                                | Phase 2         | Shipped                   |

---

## 4. ROLLBACK STRATEGY

- **Phase 1**: pure investigation, no code to roll back. Abandon by leaving `research.md` incomplete; no blast radius.
- **Phase 2 (Outcome A)**: `rm -rf hooks/copilot/` and revert any shared-code changes. Run Claude test to confirm no regression.
- **Phase 2 (Outcome B)**: remove the workaround file-writer job; restore previous advisor pipeline to pre-change state.
- **Phase 3**: docs only; `git revert` the documentation commit.

All three phases are individually reversible; the parent `009-hook-daemon-parity` spec is unaffected.

---

## 5. VALIDATION STRATEGY

**Automated:**
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <this-phase> --strict` passes.
- `vitest run` in the mcp_server directory — all tests green (Claude-unchanged + any new Copilot tests).

**Manual (user-executable):**
- Paste the original user test into a fresh Copilot CLI session:
  - "Describe the startup context you were given. Include the exact values you see for code graph file count, node count, edge count, and whether the graph is marked fresh or stale."
  - "I want to refactor the CSS in our landing page. What skill did the advisor recommend? Quote the advisor line verbatim."
- Outcome A expected response: non-empty startup metrics + verbatim advisor line.
- Outcome B expected response: whatever the file-based path can deliver (may be stale but non-empty).
- Outcome C expected response: "no startup context observed" / "no advisor brief observed" — matches pre-phase state; docs must explicitly acknowledge this.

---

## 6. RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md` (to be written at end of Phase 1)
- **Research artifact**: `research.md` (to be written during Phase 1)
