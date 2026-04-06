---
title: "Decision Record: Cache-Warning Hook System [template:level_3/decision-record.md]"
description: "not \"A decision was required regarding the selection of an appropriate approach.\" -->"
trigger_phrases:
  - "decision"
  - "record"
  - "cache warning"
  - "ADR"
  - "replay isolation"
  - "decision record"
importance_tier: "normal"
contextType: "planning"
---
# Decision Record: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Sequential Build Order (No Parallel Phases)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to choose how to sequence six interlocking prototype features because each later phase relies on evidence or state created by earlier ones. Parallel delivery would create false confidence: the shared schema has to exist before fixtures can seed it, the harness has to exist before replay evidence is trustworthy, and the highest-risk send-flow behavior depends on the timestamp and seam already being proven [F4][F5][F6][F19][F20][F24] [SOURCE: research.md §4].

### Constraints

- `lastClaudeTurnAt` is the deterministic idle signal, so Phase A must land before Phases C, E, or F can validate idle-gap behavior [F19] [SOURCE: research.md §4].
- Replay evidence is unreliable without Phase B isolation, because autosave and temp-state writes can silently pollute the result set [F20][F24] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Run Phases A -> B -> C -> D -> E -> F strictly sequentially.

**How it works**: Phase A establishes the shared schema, Phase B establishes trustworthy validation, Phase C writes the timestamp, Phase D proves the shared seam, Phase E adds resume-only warning logic, and Phase F adds the highest-risk `UserPromptSubmit` behavior last. No phase starts until the previous phase has passed its stated acceptance criteria and replay validation [F4][F5][F6][F19][F20][F24] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sequential A -> F** | Preserves dependency order, keeps replay evidence trustworthy, and puts highest-risk UX last | Slower delivery cadence | 10/10 |
| Parallel A + B | Could shorten calendar time | Harness fixtures depend on the final schema shape, so failures would be ambiguous | 4/10 |
| Skip Phase D seam validation | Reduces interim test work | Removes the guard against schema drift before resume and send-flow behavior lands | 2/10 |
| Ship Phase F first behind a flag | Surfaces the visible warning earlier | Depends on timestamp capture from Phase C and trustworthy replay from Phase B | 1/10 |

**Why this one**: This order compounds confidence instead of spending it. Each phase creates the prerequisite state or evidence needed by the next one, which directly mitigates the research risks around hidden side effects and missing idle anchors [F19][F20][F24] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each phase can be validated against a stable contract before more visible behavior depends on it.
- The highest-risk UX change is delayed until schema, harness, and seam confidence are already in place.

**What it costs**:
- Delivery takes longer because no phase may leapfrog its prerequisites. Mitigation: keep each phase small, acceptance-driven, and replay-backed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Teams may feel pressure to parallelize once the harness exists | M | Keep the phase order documented in `plan.md` §4 and `tasks.md`, and treat dependency violations as scope failure |
| Late discovery in Phase F could still delay completion | H | Land Phase F last by design so the earlier phases remain independently valuable and verifiable |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F19 and F20 make schema and harness prerequisites, so sequence is required now [SOURCE: research.md §4] |
| 2 | **Beyond Local Maxima?** | PASS | Parallel, skipped-validation, and flag-first alternatives were considered and rejected |
| 3 | **Sufficient?** | PASS | Sequential delivery is the simplest way to make dependency order explicit without adding new coordination machinery |
| 4 | **Fits Goal?** | PASS | The plan exists to prototype safely, not to maximize throughput at the expense of evidence |
| 5 | **Open Horizons?** | PASS | The order preserves rollback and future iteration because later phases depend on earlier stable seams |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `tasks.md` and `checklist.md` track Phases A-F as a strict sequence with validation gates between them.
- `plan.md` §4 remains the source of truth for phase ordering and acceptance criteria.

**How to roll back**: Stop after the last validated phase, disable any enabled env flags, and do not begin the next phase until the dependency issue is resolved. If implementation has already started out of order, revert the out-of-order changes and re-run the previous phase validation before proceeding.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
### ADR-002: Reject `compact-inject.ts` as Warning Owner

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

We needed to decide where stale-cache warning ownership should live. The upstream discussion makes `/compact` tempting because it is already a cache-related surface, but the research explicitly rejects that move: `PreCompact` would still miss resumed sessions that never call `/compact`, and moving warning ownership there would blur an otherwise narrow responsibility boundary [F8 REJECTED] [SOURCE: research.md §4].

### Constraints

- `compact-inject.ts` already owns cache-builder and mitigation preparation behavior, not resume or pre-send warning UX [F8] [SOURCE: research.md §4].
- Resume and pre-send warning logic need access to session timing at points where `PreCompact` is not guaranteed to run [F5][F6] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` untouched as a warning owner.

**How it works**: Resume warning ownership lives in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, and pre-send warning ownership lives in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`. `compact-inject.ts` remains a mitigation surface only, which keeps responsibilities crisp and coverage complete [F6][F8] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep `compact-inject.ts` unchanged** | Preserves clear ownership and avoids overlap | Requires touching two other hook surfaces | 10/10 |
| Move warning logic into `compact-inject.ts` | Keeps warning near an existing cache-related command | Misses resumed sessions that never compact and blurs responsibility | 2/10 |
| Add a separate warning helper but route through compact | Centralizes formatting | Adds indirection without solving the missed-session problem | 3/10 |

**Why this one**: The best boundary is the one that matches when the user actually needs the warning. Resume and pre-send are the right moments; `PreCompact` is not.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Ownership stays aligned with actual hook timing: `session-prime.ts` for resume and `user-prompt-submit.ts` for pre-send.
- `compact-inject.ts` remains stable, which makes regression review easier and keeps the scope rule enforceable.

**What it costs**:
- Warning behavior spans two files instead of one. Mitigation: keep both on the same shared `HookState` seam and validate them with the replay harness.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Engineers may reintroduce warning logic into `compact-inject.ts` later because the file feels cache-adjacent | M | Keep the hard boundary in `spec.md`, `plan.md`, `tasks.md`, and this ADR |
| Split ownership could diverge in copy or thresholds | M | Centralize threshold values in env gates and validate behavior through shared fixtures |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F8 explicitly rejects `compact-inject.ts` as the warning owner [SOURCE: research.md §4] |
| 2 | **Beyond Local Maxima?** | PASS | We considered compact ownership and indirection, not just the default split |
| 3 | **Sufficient?** | PASS | Keeping the existing file unchanged is simpler than adding crossover logic |
| 4 | **Fits Goal?** | PASS | The goal is to warn at resume and pre-send time, not at compaction time |
| 5 | **Open Horizons?** | PASS | The clean boundary preserves room for later observability or copy tuning without reworking `compact-inject.ts` |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` gains resume-only stale-cache estimate behavior.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` owns pre-send warning and acknowledgement behavior.

**How to roll back**: Disable the resume and soft-block env gates, keep `compact-inject.ts` untouched, and remove warning logic only from `session-prime.ts` and `user-prompt-submit.ts` if the prototype is abandoned.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
### ADR-003: Replay Harness Isolation as a Hard Prerequisite

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-003-context -->
### Context

We needed to decide whether replay validation could share the normal temp-state and autosave behavior or whether isolation had to come first. The research is direct here: replay results can be silently polluted by Stop-hook autosave and shared temp writes, which makes any later prototype evidence untrustworthy unless the harness fences those side effects first [F20][F24] [SOURCE: research.md §4].

### Constraints

- Stop-hook autosave can write additional artifacts unless replay explicitly redirects or stubs it [F24] [SOURCE: research.md §4].
- Every later phase depends on replay evidence, so unreliable replay invalidates the whole prototype sequence [F20][F24] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Build replay isolation in Phase B before using replay evidence to validate Phases C-F.

**How it works**: The harness creates a per-run `TMPDIR`, stubs autosave via `SPECKIT_GENERATE_CONTEXT_SCRIPT`, detects writes outside the replay sandbox, and removes the temp directory in `finally`. Tests fail when isolation is violated instead of silently continuing [F20][F24] [SOURCE: research.md §4].
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Isolated replay harness first** | Produces trustworthy evidence for every later phase | Requires upfront scaffold work | 10/10 |
| Shared temp dir replay | Lower initial effort | Contaminates results and can hide autosave side effects | 1/10 |
| Mock every dependency per test | High control | Expensive to maintain and weaker as an end-to-end scaffold | 5/10 |

**Why this one**: One good scaffold is cheaper than repeatedly debugging bad evidence. Isolation pays for itself because every later phase reuses it.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Later replay assertions become credible because they run inside a bounded sandbox.
- The harness becomes reusable infrastructure for all four hook entry points instead of a one-off test trick.

**What it costs**:
- Phase B adds upfront complexity before any visible warning UX ships. Mitigation: keep the API small and fixture-driven so later phases only consume it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The harness could miss a side-effect path and still allow polluted evidence | H | Detect out-of-bound writes explicitly and treat them as hard test failures |
| Harness maintenance could sprawl beyond the prototype | M | Limit the API to replay essentials: stdin, env, final state, stdout, stderr, and side-effect reporting |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F24 says replay must isolate side effects, so this is a prerequisite not a nice-to-have [SOURCE: research.md §4] |
| 2 | **Beyond Local Maxima?** | PASS | We weighed shared-temp and heavy-mock alternatives before selecting the scaffold |
| 3 | **Sufficient?** | PASS | A small reusable harness is simpler than bespoke isolation logic in every test |
| 4 | **Fits Goal?** | PASS | The feature goal depends on trustworthy replay evidence across all phases |
| 5 | **Open Horizons?** | PASS | The harness supports future hook validation without locking the design to one warning implementation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts` provides `runHookReplay()` with isolated temp-state and side-effect reporting.
- `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/` stores replay fixtures that seed stdin, transcript, and optional state files.

**How to roll back**: Stop using replay evidence for new phases, remove the harness and related tests, and revert to direct hook tests only. If the harness itself is faulty, fix or revert it before any dependent phase result is considered valid.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
### ADR-004: Prototype-Only Gating via Env Kill-Switches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-004-context -->
### Context

We needed to decide how safely to ship prototype warning behavior that is explicitly unshipped in the source discussion and not net-costed as a remedy bundle. The research says both the `UserPromptSubmit` UX and the broader `/clear` plus plugin-memory remedy need cautious framing, which means operators must be able to disable new behavior immediately without recompiling code [F5][F22] [SOURCE: research.md §4; research.md §10].

### Constraints

- `UserPromptSubmit` warning UX is still prototype territory, so it must be easy to disable if it is noisy or disruptive [F5] [SOURCE: research.md §4].
- The remedy bundle is not locally net-costed, so always-on behavior would overclaim confidence and raise rollback friction [F22] [SOURCE: research.md §10].
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Gate every new behavior behind env keys with safe defaults.

**How it works**: `CACHE_WARNING_RESUME_ESTIMATE_ENABLED`, `CACHE_WARNING_SOFT_BLOCK_ONCE`, and `CACHE_WARNING_IDLE_THRESHOLD_MINUTES` control the new behavior without code changes. Defaults stay observe-only where possible, and any operator can disable the warning surfaces by changing environment values instead of editing hooks [F5][F6][F22] [SOURCE: research.md §4; research.md §10].
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Env kill-switches** | Instant rollback, no rebuild required, easy to document | Adds a small amount of config surface area | 10/10 |
| Compile-time flag only | Keeps runtime config smaller | Requires rebuild and redeploy to disable | 3/10 |
| Always-on behavior | Simplest code path | No safe rollback, too risky for an unshipped prototype | 1/10 |
| Per-session opt-in UX | Fine-grained control | Adds unnecessary complexity to a prototype flow | 4/10 |

**Why this one**: Runtime flags are the lowest-friction way to keep the prototype reversible while still exercising the real hook paths.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Operators can disable resume warnings or soft-block behavior immediately without patching code.
- The prototype can ship in a conservative posture that matches the research caveats instead of pretending the behavior is settled.

**What it costs**:
- There are more env keys to document and keep in sync. Mitigation: keep the set small and wire every key to one clear behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Config drift could leave one warning path enabled unintentionally | M | Document the exact keys in plan, tasks, checklist, and runtime settings guidance |
| Operators may assume the feature is production-proven because it is easy to enable | M | Preserve "prototype-only" wording in docs and avoid savings claims beyond heuristic warning copy |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F5 and F22 both point to prototype risk and the need for safe rollback [SOURCE: research.md §4; research.md §10] |
| 2 | **Beyond Local Maxima?** | PASS | We considered compile-time, always-on, and per-session alternatives |
| 3 | **Sufficient?** | PASS | Three focused env keys cover the new behavior without inventing a larger rollout system |
| 4 | **Fits Goal?** | PASS | The prototype goal is safe operator feedback, not permanent rollout infrastructure |
| 5 | **Open Horizons?** | PASS | Env gates preserve room for later rollout tuning or removal without architectural churn |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` reads `CACHE_WARNING_RESUME_ESTIMATE_ENABLED` and `CACHE_WARNING_IDLE_THRESHOLD_MINUTES`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` reads `CACHE_WARNING_SOFT_BLOCK_ONCE` and persists acknowledgement state through the shared seam.

**How to roll back**: Set `CACHE_WARNING_RESUME_ESTIMATE_ENABLED=false` and `CACHE_WARNING_SOFT_BLOCK_ONCE=false`, restore default idle-threshold behavior as needed, rebuild `dist` outputs if the runtime requires it, and leave the dormant code paths in place until a later cleanup decision is made.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
