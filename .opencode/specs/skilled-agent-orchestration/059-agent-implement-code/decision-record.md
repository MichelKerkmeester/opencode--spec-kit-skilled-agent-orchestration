<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
---
title: "Decision Record: @code Sub-Agent Architecture [template:level_3/decision-record.md]"
description: "ADR-style record for D1–D10 with rationale, alternatives considered, consequences, and post-research validation status."
trigger_phrases:
  - "code agent decisions"
  - "@code adr"
  - "caller restriction mechanism"
  - "task deny LEAF enforcement"
  - "phase parent tolerance"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code"
    last_updated_at: "2026-05-01T14:35:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Decision record authored with D1-D10 captured pre-research"
    next_safe_action: "Update D3 row after research streams converge with research-validated mechanism"
    blockers: []
    key_files:
      - .opencode/agent/review.md
      - .opencode/agent/orchestrate.md
      - .opencode/skill/sk-code/SKILL.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-01-spec-scaffold"
      parent_session_id: null
    completion_pct: 16
    open_questions:
      - "D3 final form depends on research findings"
    answered_questions: []
---

# Decision Record: @code Sub-Agent Architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

Each decision is captured ADR-style: **Status / Context / Decision / Alternatives Considered / Consequences / Validation**.

---

<!-- ANCHOR:adr-1 -->
## ADR-1: D1 — Filename `code.md` (agent name `@code`)

**Status:** Accepted

**Context:** User said verbatim "dedicated 'code' agent." Need an agent file name that maps cleanly to the orchestrator-dispatched alias.

**Decision:** File at `.opencode/agent/code.md`; agent reference `@code`.

**Alternatives Considered:**
- `implement.md` — verb-first; avoids cosmetic collision with `sk-code` skill name
- `code-implement.md` — explicit composite; verbose

**Consequences:**
- Pro: Matches user's verbatim language; routing reads cleanly as `@code`
- Con: Cosmetic collision with `sk-code` skill (different namespaces — `.opencode/agent/` vs `.opencode/skill/` — but a reader scanning routing rules "@code uses sk-code" may trip)
- Acceptable cost; verbatim-language win dominates per pressure-test (Plan agent verdict: PARTIAL agree, accept)

**Validation:** Authored at `.opencode/agent/code.md` (post-research).

<!-- /ANCHOR:adr-1 -->

---

<!-- ANCHOR:adr-2 -->
## ADR-2: D2 — Permission profile — write/edit/patch/bash/grep/glob/memory ALLOW; task DENY; rest deny

**Status:** Accepted

**Context:** Need a write-capable LEAF agent. Permission fields are runtime-enforced by harness. `review.md` declares `write: deny, edit: deny, patch: deny`; `@code` flips these. The load-bearing question is `task` permission.

**Decision:**
```yaml
permission:
  read: allow
  write: allow
  edit: allow
  patch: allow
  bash: allow
  grep: allow
  glob: allow
  memory: allow
  task: deny
  webfetch: deny
  chrome_devtools: deny
  list: allow
  external_directory: deny
```

**Alternatives Considered:**
- `task: allow` — would let @code dispatch other agents. Rejected: re-introduces unbounded nesting that LEAF-depth-1 was designed to prevent
- `external_directory: allow` — would let @code touch out-of-repo paths. Rejected: scope-lock principle (CLAUDE.md Iron Law)
- `webfetch: allow` — would let @code pull external docs. Rejected: out of scope; @code implements code, not docs research

**Consequences:**
- Pro: `task: deny` enforces LEAF-depth-1 by blocking nested @-agent dispatch. `sk-code` is Skill-invoked (not Task-invoked), so denying task does NOT impede stack detection.
- Pro: Bash needed for verification (test runners, builds, git status). Memory needed for pattern recall.
- Con: If a task genuinely requires sub-dispatch, @code must escalate to orchestrator instead of self-delegating

**Validation:** Frontmatter check at code.md authoring time (T027 + checklist gate).

<!-- /ANCHOR:adr-2 -->

---

<!-- ANCHOR:adr-3 -->
## ADR-3: D3 — Caller restriction is convention-based with three layers; research finalized as convention-floor

**Status:** Accepted (post-research, Phase 2 complete 2026-05-01)

**Context:** User stated `@code` "should only be called by orchestrate and cant be used in other ways." Existing `.opencode/agent/` survey: NO native frontmatter mechanism for caller restriction. Phase 2 deep research across three streams (`oh-my-opencode-slim`, `opencode-swarm-main`, internal `.opencode/agent/` + AGENTS.md + sk-code) confirmed: NO machine-readable caller-restriction frontmatter field exists in any source, and NO local dispatch validator gates "callable only by orchestrator". See `research/synthesis.md` §1 Q3 + §3 for full evidence.

**Decision (final / post-research):** Convention-floor with three layers, matching the precedent set by `@deep-research`/`@deep-review`/`@improve-agent` and documented in `cli-opencode/SKILL.md:296-300` and `AGENTS.md:223`:

1. Frontmatter `description` field states: "Dispatched ONLY by @orchestrate (orchestrator-only convention; not harness-enforced)."
2. Body §0 **DISPATCH GATE** refuses with explicit message when invoked without an orchestrator-context marker (the orchestrator-injected `Depth: 1` line per `.opencode/agent/orchestrate.md` §2 NDP). REFUSE, do not warn-and-proceed.
3. `.opencode/agent/orchestrate.md` §2 routing-table entry adds `@code` as the implementation specialist (orchestrator-side referencing).

**Reinforcing harness mechanism (LEAF, distinct from caller-restriction):**
- Frontmatter `mode: subagent` (registry classification; prevents `@code` from being a primary/user-invocable target).
- Frontmatter `permission.task: deny` (blocks the Task tool fan-out at the OpenCode runtime; matches 8/9 of our existing agents).

**Anti-patterns (DO NOT):**
- Invent frontmatter keys like `caller`, `dispatchableBy`, `restricted_callers`, `allowed_callers`, `callerRestriction`, `isOrchestrator` — none have schema or runtime support across any of the three researched sources, and adding them would create silent dead-code (precedent: `SUBAGENT_DELEGATION_RULES` constant in oh-my-opencode-slim is declared but never read; `src/config/constants.ts:25-66`).
- Treat `permission.task: deny` as caller restriction. It prevents the callee from fanning out; it does NOT restrict who can invoke the callee.
- Rely on `agent_config.leaf_only: true`-style declarations alone — `executor-config.ts:21` does not parse the field; informational only.

**Alternatives Considered:**
- Warn-and-proceed instead of refuse — Plan-agent recommendation. Rejected: doesn't satisfy user's absolute "cant be used in other ways."
- Custom env-var enforcement — feasible but novel; research surfaced no precedent and would require harness changes outside scope.
- Suffix-classifier pattern (opencode-swarm-main `name.endsWith("_architect")`) — Rejected: stream-02 adversarial test (`architect-permission.adversarial.test.ts:123`) showed it overmatches `_architect`, `__architect`, `not_an_architect`. Caveat informed our agent-name choice (we named the file `code.md`, NOT `code_architect.md`).

**Consequences:**
- Pro: Strongest convention-floor available; aligns with existing precedent (no novel pattern); zero harness changes required.
- Pro: Combines with `mode: subagent` + `permission.task: deny` for layered defense (LEAF dimension covered by harness; caller-restriction by convention).
- Con: Direct calls still execute the agent body; only the agent's own gate refuses. A user with file-edit permissions can technically force-bypass by editing the agent file. Acceptable — this is a correctness convention, not a security boundary.
- Trade-off: Refuse breaks debugging workflows (can't directly invoke @code to test). Acceptable per spec — debugging goes through orchestrator anyway.

**Validation:** Smoke tests T032/T033 — direct-call refusal observed via canonical REFUSE message; orchestrator-dispatched call observed completing the workflow. Live behavioral tests documented in `implementation-summary.md` §Verification (post-merge execution).

**Citations:**
- Stream-01 (oh-my-opencode-slim): `src/agents/index.ts:428-442`, `src/agents/index.ts:172-181`, `src/tools/council.ts:52-69`, `src/config/constants.ts:25-66` (SUBAGENT_DELEGATION_RULES dead-code anti-pattern).
- Stream-02 (opencode-swarm-main): `src/agents/index.ts:651`, `src/agents/architect-permission.adversarial.test.ts:43,55,104,123` (suffix-classifier overmatch caveat).
- Stream-03 (internal): `.opencode/skill/cli-opencode/SKILL.md:296-300`, `AGENTS.md:223`, `.opencode/agent/orchestrate.md:147,151,208`, `.opencode/agent/write.md:30` (closest write-capable LEAF analog).

<!-- /ANCHOR:adr-3 -->

---

<!-- ANCHOR:adr-4 -->
## ADR-4: D4 — Stack detection delegated to sk-code; @code does NOT pre-detect

**Status:** Accepted

**Context:** sk-code already owns marker-file detection (Webflow → `src/2_javascript/`/`*.webflow.js`/`wrangler.toml`; Go → `go.mod`; Next.js → `next.config.*` or `package.json` + react/next; UNKNOWN otherwise). @code pre-detecting would duplicate this.

**Decision:** @code passes raw task to `sk-code` via Skill tool; sk-code returns stack + intent-conditional resources; @code applies. UNKNOWN/ambiguous returns escalate to orchestrator.

**Alternatives Considered:**
- @code re-implements stack detection — Rejected: duplication, drift over time
- @code reads `package.json` / `go.mod` itself before calling sk-code — Rejected: unnecessary; sk-code already does this

**Consequences:**
- Pro: Single-source-of-truth for stack detection
- Pro: Cleaner agent body; less coupling
- Con: One round-trip (Skill invocation) before implementation begins. Acceptable

**Validation:** §4 STACK DELEGATION present in code.md body.

<!-- /ANCHOR:adr-4 -->

---

<!-- ANCHOR:adr-5 -->
## ADR-5: D5 — Workflow shape — 6 steps; VERIFY is fail-closed (no silent loop-fix)

**Status:** Accepted

**Context:** Mirror `review.md` body structure. Critical question: when verification fails (e.g., test breaks), does @code retry internally or return to orchestrator?

**Decision:** 6-step workflow. Step 5 VERIFY is fail-closed — failure returns summary to orchestrator. NO internal retry.

```
1. RECEIVE scope from orchestrator
2. Read packet docs (spec.md, plan.md, tasks.md if available)
3. INVOKE sk-code Skill (stack detection + resources)
4. IMPLEMENT bounded by sk-code guidance (no free-form deviation)
5. VERIFY (sk-code returns the stack-appropriate verification command; @code runs it as-given)
6. RETURN summary to orchestrator
```

**Alternatives Considered:**
- Retry-once on verification failure — Rejected: per Plan-agent pressure-test, "Loop-fix inside @code re-introduces the unbounded-iteration problem LEAF-depth-1 was designed to prevent"
- Retry-with-different-approach — Same rejection; orchestrator owns retry policy

**Consequences:**
- Pro: Bounded behavioral surface; orchestrator retains retry control
- Pro: Matches LEAF philosophy
- Con: Trivial fixes (e.g., missing semicolon) require a full orchestrator round-trip. Acceptable; orchestrator can dispatch a focused retry quickly

**Validation:** §1 + §5 in code.md body; smoke test gate (T032/T033) confirms behavior.

<!-- /ANCHOR:adr-5 -->

---

<!-- ANCHOR:adr-6 -->
## ADR-6: D6 — Documentation Level 3 (decision-record required)

**Status:** Accepted

**Context:** Architectural impact: modifies orchestrator routing, sets first-write-capable-LEAF-agent precedent, establishes caller-restriction convention.

**Decision:** Level 3.

**Alternatives Considered:**
- Level 2 (no decision-record) — Rejected: precedent value is in the rationale, not the LOC
- Level 3+ (governance) — Rejected: no enterprise-governance workflow needed; multi-agent parallel research already captured in tasks.md

**Consequences:**
- Pro: D2/D3/D5 rationale captured for future maintainers (the "why" lives somewhere durable)
- Con: More upfront authoring. Acceptable for the precedent value

**Validation:** This file (decision-record.md) exists and validates.

<!-- /ANCHOR:adr-6 -->

---

<!-- ANCHOR:adr-7 -->
## ADR-7: D7 — Single packet — design + research + implementation co-located

**Status:** Accepted

**Context:** Should design + implementation split into two child packets (e.g., 059-design + 060-implement) or stay together?

**Decision:** Single packet `059-agent-implement-code`.

**Alternatives Considered:**
- Split design vs implementation — Rejected: tight coupling. Permission profile can't be validated without authoring + dispatching the agent. Cross-packet refs add coordination cost without independence benefit
- Three-packet split (design / research / impl) — Rejected: research is a means to design, not a separable artifact

**Consequences:**
- Pro: One review, one validation, one continuity ledger
- Pro: Decision-record + research synthesis live in same packet — natural cross-references
- Con: Larger packet. Acceptable

**Validation:** This packet exists with research/, decision-record.md, and (post-implementation) the agent file modifications.

<!-- /ANCHOR:adr-7 -->

---

<!-- ANCHOR:adr-8 -->
## ADR-8: D8 — Research streams = 3 × 10 iters via cli-copilot gpt-5.5 high

**Status:** Accepted

**Context:** User specified "10 iterations per folder" for external + "let them check ours" for internal. Two external folders (oh-my-opencode-slim, opencode-swarm-main) + one internal sweep (.opencode/agent/) = 3 streams. Memory: cli-copilot caps at 3 concurrent.

**Decision:** 3 streams × 10 iters each = 30 iters total. All 3 dispatched in parallel (matches concurrency cap exactly).

**Alternatives Considered:**
- 2 external × 10 + internal folded into synthesis — Rejected: lighter but loses dedicated convergence-detection on internal sweep
- 3 streams × 5 iters — Rejected: user specified 10
- Sequential dispatch — Rejected unless throttling forces fallback

**Consequences:**
- Pro: Each stream has dedicated convergence detection; tight scope per stream
- Pro: Parallel execution minimizes wall time
- Con: 30 iters at gpt-5.5 high is expensive. Acceptable per user's stated effort budget

**Validation:** Stream artifacts in `research/stream-NN-*/iterations/` post-Phase 2.

<!-- /ANCHOR:adr-8 -->

---

<!-- ANCHOR:adr-9 -->
## ADR-9: D9 — Number 059 accepted as user-specified

**Status:** Accepted

**Context:** Parent 022 currently has 0 children. User picked 059, reserving 058 future slots.

**Decision:** Use 059. Trust user's topology.

**Alternatives Considered:**
- 001 (first child) — Rejected: user specified 059
- Negotiate with user — Rejected per memory feedback "Stop over-confirming"

**Consequences:**
- Pro: Respects user's stated topology
- Con: Number gaps may seem irregular. Acceptable; user knows their reservation strategy

**Validation:** Folder path includes `059-agent-implement-code/`.

<!-- /ANCHOR:adr-9 -->

---

<!-- ANCHOR:adr-10 -->
## ADR-10: D10 — AGENTS.md sibling sync required

**Status:** Accepted

**Context:** Per memory rule "AGENTS.md updates must sync the Barter sibling — port shared gates/runtime contracts, not skill-specific names." Adding `@code` to the routing reference is a shared-runtime contract.

**Decision:** Update §5 Agent Routing in both: `AGENTS.md` (canonical) and `AGENTS_Barter.md` (symlink to separate Barter repo). Skip skill-specific names (sk-code overlay details stay project-local).

**Alternatives Considered:**
- Update only canonical AGENTS.md — Rejected: violates explicit memory rule
- Update both with skill-specific names too — Rejected: memory rule specifies "shared gates/runtime contracts, not skill-specific names"

**Consequences:**
- Pro: Sibling stays consistent; future maintainers see @code in either doc
- Con: Two-file edit. Acceptable

**Validation:** Diff check on both files after T029-T030.

<!-- /ANCHOR:adr-10 -->

---

## SUMMARY TABLE

| ADR | Decision | Status | Validation Trigger |
|-----|----------|--------|-------------------|
| D1 | Filename `code.md` | Accepted | T027 (file authored) |
| D2 | Permission profile (task: deny) | Accepted | T027 + checklist gate |
| D3 | Caller restriction convention | Pending research | T025-T026 + smoke test |
| D4 | Stack delegated to sk-code | Accepted | code.md §4 |
| D5 | Verify fail-closed | Accepted | code.md §1, §5 + smoke test |
| D6 | Level 3 docs | Accepted | This file exists |
| D7 | Single packet | Accepted | Folder structure |
| D8 | 3 streams × 10 iters | Accepted | Phase 2 artifacts |
| D9 | Number 059 | Accepted | Folder path |
| D10 | AGENTS.md triad sync | Accepted | T029-T031 diff |
