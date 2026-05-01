<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
---
title: "Feature Specification: @code Sub-Agent for Stack-Agnostic Code Implementation [template:level_3/spec.md]"
description: "No write-capable code-implementation sub-agent exists in .opencode/agent/. Orchestrator must hand-author edits or route through @write (docs-only) or @debug (5-phase root-cause). Need a dedicated, repo-agnostic, sk-code-auto-loading agent that fills the gap between @write and @review."
trigger_phrases:
  - "code agent"
  - "implement agent"
  - "code subagent"
  - "@code"
  - "stack-agnostic implementation"
  - "sk-code auto-load"
  - "orchestrate-only sub-agent"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code"
    last_updated_at: "2026-05-01T14:20:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded spec"
    next_safe_action: "Dispatch research streams"
    blockers: []
    key_files:
      - .opencode/agent/review.md
      - .opencode/agent/orchestrate.md
      - .opencode/agent/write.md
      - .opencode/skill/sk-code/SKILL.md
      - .opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/
      - .opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-01-spec-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Does any external reference (oh-my-opencode-slim, opencode-swarm) provide a harness-level mechanism to enforce 'callable only by orchestrator' that we can adopt?"
      - "Should @code be allowed to call sk-code overlay skills directly (sk-code-webflow, sk-code-go) or must it always go through sk-code's internal routing?"
    answered_questions:
      - "Spec level → 3 (decision-record needed for precedent capture per pressure-test)"
      - "File name → code.md (per user's verbatim 'dedicated code agent')"
      - "task permission → deny (LEAF-depth-1 enforcement)"
      - "Number 059 → accepted as user-specified"
      - "Single packet for design+implementation → no split"
---

# Feature Specification: @code Sub-Agent for Stack-Agnostic Code Implementation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

Author a new write-capable code-implementation sub-agent at `.opencode/agent/code.md`, modeled on `review.md` but flipped to `write/edit/patch: allow`. The agent is codebase/repo-agnostic via auto-loading the `sk-code` skill (which owns stack detection internally), dispatchable only by `@orchestrate`, and enforces `task: deny` to keep it LEAF-depth-1. Packet-internal research dispatches three parallel `/spec_kit:deep-research:auto` streams (10 iters each, executed via `cli-copilot` with `gpt-5.5 high`) across two external multi-agent reference implementations (`oh-my-opencode-slim`, `opencode-swarm-main`) and our own `.opencode/agent/` inventory before authoring the agent file.

**Key Decisions**: D1 filename `code.md`; D2 permission profile (`task: deny` enforces LEAF); D3 caller restriction is convention-based with three layers; D5 verify is fail-closed; D6 Level 3.

**Critical Dependencies**: `sk-code` skill must remain the single source of truth for stack detection. `cli-copilot` must accept `--model gpt-5.5 --reasoning high` (or equivalent flag syntax) for research dispatch.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-01 |
| **Branch** | `main` (per memory: stay on main, no feature branches) |
| **Parent** | `specs/skilled-agent-orchestration/022-mcp-coco-integration/` (becomes phase parent on first child registration) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `.opencode/agent/` inventory has 10 agents (review, orchestrate, debug, write, context, deep-research, deep-review, improve-agent, improve-prompt, ultra-think) but **no write-capable code-implementation sub-agent**. Orchestrator workflows that need code edits currently fall back to either (a) hand-authored edits via the harness-default tool surface (no skill auto-loading, no stack awareness), (b) `@write` (which is documentation-scoped via `sk-doc`, not code-aware), or (c) `@debug` (5-phase root-cause loop, overkill for routine implementation). This gap forces orchestrator dispatch logic to either skip skill-routing or duplicate `sk-code` invocation in every implementation prompt.

### Purpose
Provide `@code` — a stack-agnostic, write-capable LEAF sub-agent that auto-loads `sk-code` for stack-aware patterns, accepts implementation tasks from `@orchestrate`, performs surgical edits, and returns fail-closed verification summaries. Establish precedent and convention for future write-capable LEAF agents.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New file: `.opencode/agent/code.md` (frontmatter per D2; body sections §0–§13 mirroring `review.md` structure)
- Routing-table update: `.opencode/agent/orchestrate.md` §3 adds `@code` row
- Sibling-doc sync: `AGENTS.md` (canonical), `AGENTS_Barter.md` (Barter symlink) §5 Agent Routing adds `@code` (per memory: shared-runtime contracts must mirror)
- Three `/spec_kit:deep-research:auto` streams (10 iters each) via `cli-copilot gpt-5.5 high`, results synthesized in `research/synthesis.md`
- `decision-record.md` capturing D1–D10 with research-validated D3 caller-restriction mechanism

### Out of Scope
- New `sk-code-*` overlay skills — this packet uses `sk-code` as-is; overlay authoring is a separate effort
- `@code` being callable directly by users (the user's "callable only by orchestrate" requirement; harness has no native enforcement, so this is convention + warn)
- Rewriting `orchestrate.md` dispatch logic — only adding a routing-table row
- Migrating 022's existing heavy docs into a sibling child (per plan: tolerance applied; existing docs stay at parent level alongside child 059)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/code.md` | Create | New write-capable LEAF agent |
| `.opencode/agent/orchestrate.md` | Modify | §3 routing table adds `@code` row |
| `AGENTS.md` | Modify | §5 Agent Routing adds `@code` |
| `AGENTS_Barter.md` | Modify | §5 Agent Routing adds `@code` (Barter sibling sync) |
| `.opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/graph-metadata.json` | Modify | `children_ids` adds `059-agent-implement-code`; `derived.last_active_child_id` set |
| `.opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/description.json` | Modify | Children registration |
| `.opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/context-index.md` | Create | Phase-parent transition note (heavy docs at parent are tolerated; new work goes to children) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `@code` agent file authored with frontmatter matching D2 | `.opencode/agent/code.md` exists; permission profile shows `write/edit/patch: allow`, `task: deny`; `mode: subagent`; `temperature: 0.1` |
| REQ-002 | Stack detection delegated to sk-code (no pre-detection in @code) | Body §4 explicitly delegates to `sk-code` Skill invocation; UNKNOWN/ambiguous returns escalate to orchestrator |
| REQ-003 | Verification is fail-closed (no silent loop-fix) | Body §5 specifies: verification failure returns summary to orchestrator; no internal retry loop |
| REQ-004 | Orchestrator routing table updated | `orchestrate.md` §3 includes `@code` row; placement between `@write` and `@review` |
| REQ-005 | AGENTS.md siblings in sync | Both (`AGENTS.md` canonical, `AGENTS_Barter.md` Barter symlink) §5 list `@code` |
| REQ-006 | All three deep-research streams complete or converge | `research/stream-NN-*/iterations/` contain 1–10 iteration files each; `research/synthesis.md` consolidates findings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Caller-restriction §0/§3 dispatch gate present | Body refuses (or warn-and-proceeds, depending on research finding) when orchestrator-context marker absent |
| REQ-008 | Decision-record updated with research-validated D3 mechanism | `decision-record.md` D3 row reflects whichever harness mechanism research surfaced (env var, context marker, hook), or documents that none exists and convention-only is the floor |
| REQ-009 | End-to-end smoke test: orchestrator-dispatched + direct-call refusal | Live dispatch from `@orchestrate` adds a comment to a file successfully; direct `@code` call without orchestrator context shows refusal/warning per D3 final form |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` exits 0 on `059-agent-implement-code/`
- **SC-002**: Three deep-research streams produce iteration artifacts and a consolidated `synthesis.md` with concrete diff recommendations
- **SC-003**: `@code` agent file exists, validates against existing agent schema, and dispatches successfully from `@orchestrate` for a trivial implementation task
- **SC-004**: AGENTS.md siblings (canonical + Barter) show `@code` in §5 routing
- **SC-005**: `checklist.md` fully `[x]`'d with evidence; `implementation-summary.md` filled post-implementation
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-code` skill stable | Stack-detection drift breaks `@code` | Pin `sk-code` invocation contract in `code.md` §2; if `sk-code` schema changes, `@code` must update |
| Dependency | `cli-copilot` accepts `gpt-5.5 high` | Research dispatch fails if model/reasoning flag syntax differs | Verify flag syntax at dispatch time; fall back to `cli-codex` per memory if cli-copilot rejects (memory: opencode provider fallback pattern) |
| Risk | Phase-parent tolerance backfires | If validator strict mode rejects parent's heavy docs alongside child, packet stalls | Re-run `validate.sh --strict` on parent after registering 059. If rejected, fall back to plan option B (move parent's heavy docs into a sibling child `001-cocoindex-install/`) |
| Risk | Caller-restriction has no harness enforcement | User stated "cant be used in other ways" but harness can't block direct calls | Document limit explicitly in code.md and decision-record.md. Layer (ii) refusal-on-missing-marker is the strongest convention-floor available |
| Risk | Concurrent cli-copilot dispatches throttled | Memory: cli-copilot caps at 3 concurrent per account | Plan exactly matches cap (3 streams). If throttled, sequence streams instead of parallel |
| Risk | Research streams diverge → no convergence | 10 iters might not converge if research scope is too broad | Per-stream research questions are scoped tightly (skill auto-loading, caller restriction, write-capable safety). Convergence detection in `/spec_kit:deep-research:auto` allows early termination |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `@code` cold-start dispatch latency dominated by sk-code Skill load — no additional overhead vs `@review`
- **NFR-P02**: Research streams in parallel — 3 cli-copilot processes; total wall time bounded by slowest stream (~2-6 hours estimated for 10 iters at gpt-5.5 high)

### Security
- **NFR-S01**: `@code` permission profile excludes `webfetch`, `chrome_devtools`, `external_directory: deny`. No exposure to external network or out-of-repo paths
- **NFR-S02**: `task: deny` enforces LEAF — no nested @-agent dispatch from inside @code, eliminating sub-dispatch escalation paths

### Reliability
- **NFR-R01**: Fail-closed verification — verification failure returns to orchestrator without silent retry. Bounds @code's behavioral surface
- **NFR-R02**: UNKNOWN/ambiguous stack from sk-code escalates to orchestrator — no guess-implement

---

## 8. EDGE CASES

### Stack-Detection Boundaries
- Empty repo (no marker files): sk-code returns UNKNOWN → @code escalates to orchestrator with "stack ambiguous, narrow scope or specify stack"
- Multi-stack repo (e.g., monorepo with both `go.mod` and `next.config.*`): sk-code returns ambiguous → @code escalates with "multi-stack detected, scope to one stack"
- Cross-stack pairing (Go ↔ Next.js API contract): sk-code's `references/router/cross_stack_pairing.md` resource — @code reads it as guidance, not as a stack to implement

### Caller-Restriction Boundaries
- Orchestrator dispatch with proper context marker: @code proceeds normally
- User direct call (no marker): per D3 final form (research-dependent), either refuse or warn-and-proceed
- Orchestrator dispatch WITH `Depth: 1+` (illegal nesting attempt): @code refuses per §0 ILLEGAL NESTING

### Verification Boundaries
- sk-code-prescribed verification fails: @code returns to orchestrator with verification-failure summary, no retry
- sk-code does not prescribe a verification (e.g., UNKNOWN stack): @code returns "no stack-appropriate verification available; manual verification needed"
- Verification command itself fails to run (e.g., `npm` not installed): @code returns "verification environment broken" — this is an environment issue, not implementation issue, escalate

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 8 (1 new agent + 4 modifications + 3 metadata + 1 context-index); LOC: ~600 (agent body); Systems: 1 (agent runtime) |
| Risk | 16/25 | Auth: N; API: N; Breaking: Y (orchestrator routing addition affects every future dispatch); Sets precedent for write-capable LEAF agents |
| Research | 18/20 | 30 deep-research iterations across 3 streams; external repo investigation; harness-mechanism discovery |
| Multi-Agent | 8/15 | 1 workstream (research dispatch is parallel but coordinated by single packet) |
| Coordination | 8/15 | Sibling-doc triad sync (3 AGENTS.md files); parent-child metadata registration |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | sk-code schema changes break @code | H | L | Pin invocation contract; version-tag |
| R-002 | cli-copilot flag syntax mismatch | M | M | Verify at dispatch; fall back to cli-codex |
| R-003 | Phase-parent validator rejects mixed-mode | M | M | Tolerance default; option B fallback |
| R-004 | Caller-restriction unenforceable | M | H | Document limit; convention-floor accepted |
| R-005 | Research streams don't converge | M | L | Tight scope per stream; convergence detection allows early stop |
| R-006 | Number 059 collides with later sibling work | L | L | User-specified; trusted |

---

## 11. USER STORIES

### US-001: Orchestrator-dispatched stack-agnostic implementation (Priority: P0)

**As an** orchestrator (`@orchestrate`), **I want** to dispatch a code implementation task to `@code` without pre-detecting the stack or pre-loading skills, **so that** I can route work without duplicating sk-code invocation logic in every dispatch prompt.

**Acceptance Criteria**:
1. **Given** an orchestrator-dispatched code-edit task with `Depth: 1` marker, **When** `@code`'s §0 DISPATCH GATE evaluates the prompt, **Then** the gate passes and §1 RECEIVE proceeds.
2. **Given** a project where `sk-code` recognizes the stack, **When** `@code` reads `sk-code/SKILL.md` and applies the protocol, **Then** the agent edits the named files and runs sk-code's returned verification command.
3. **Given** a stack-ambiguous task, **When** sk-code returns UNKNOWN, **Then** `@code` escalates with `RETURN: (none) | N/A | UNKNOWN_STACK ...` instead of guessing.

---

### US-002: Verification fails fast, no silent retry (Priority: P0)

**As an** orchestrator, **I want** `@code` to return verification-failure summaries promptly without internal retry loops, **so that** I retain control over the retry/escalation decision.

**Acceptance Criteria**:
1. **Given** an implementation that breaks the verification command, **When** `@code` runs the sk-code-returned verification and it exits non-zero, **Then** `@code` returns immediately with `RETURN: <files> | FAIL (...) | VERIFY_FAIL` — no second attempt inside `@code`.

---

### US-003: Direct user invocation surfaces convention warning (Priority: P1)

**As a** user typing `@code fix this`, **I want** clear feedback that `@code` is intended to be orchestrator-dispatched, **so that** I'm not silently routed through a path that lacks orchestrator-set context.

**Acceptance Criteria**:
1. **Given** a direct user invocation without an orchestrator-context marker, **When** `@code` evaluates §0 DISPATCH GATE, **Then** it returns the canonical `REFUSE: @code is orchestrator-only ...` message and stops (D3 convention-floor; per ADR-3 final).

---

### US-004: Future write-capable LEAF agents follow this precedent (Priority: P1)

**As a** future agent author adding a write-capable LEAF sub-agent (e.g., `@migrate`, `@refactor`), **I want** to copy the `@code` pattern with confidence, **so that** the agent system stays consistent.

**Acceptance Criteria**:
1. **Given** a future agent author adding a write-capable LEAF, **When** they read `decision-record.md`, **Then** ADR-2 (permission profile) and ADR-3 (caller restriction) are documented with cited rationale clear enough to apply.
2. **Given** a future maintainer auditing AGENTS.md sibling triad consistency, **When** they grep for `@code` across `AGENTS.md`, `AGENTS_Barter.md`, **Then** all three hits carry the same description (shared runtime contract; no skill-specific drift).

---

## 12. OPEN QUESTIONS

- Does any external reference (`oh-my-opencode-slim`, `opencode-swarm-main`) provide a harness-level mechanism (env var, context marker, hook) to enforce "callable only by orchestrator"? Research stream 01 + 02 to surface.
- Should `@code` invoke `sk-code` overlay skills directly (e.g., `sk-code-webflow`) or always go through `sk-code`'s internal routing? Default: through `sk-code` (single-source-of-truth).
- For phase-parent transition of 022, does validator strict mode tolerate heavy docs at parent + new child 059, or is option B (rename parent docs into sibling child `001-cocoindex-install/`) needed? Determined by `validate.sh --strict` after metadata registration.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Synthesis (post-research)**: See `research/synthesis.md`
- **Parent packet**: `../spec.md` (CocoIndex install — completed Level 2 work)
- **External research**: `../../z_future/improved-agent-orchestration/external/{oh-my-opencode-slim,opencode-swarm-main}/`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment: 64/100 Level 3
-->
