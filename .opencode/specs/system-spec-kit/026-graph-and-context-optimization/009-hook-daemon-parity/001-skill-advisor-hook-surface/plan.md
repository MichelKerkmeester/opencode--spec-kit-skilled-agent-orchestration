---
title: "Implementation Plan: Skill-Advisor Hook Surface"
description: "Research-first plan for cross-runtime skill-advisor hook integration. Phase 1 scaffolds 001-initial-research for architecture investigation; Phase 2+ spawns remediation children per cluster."
trigger_phrases:
  - "020 skill advisor hook plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T06:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Create 001-initial-research sub-packet"

---
# Implementation Plan: Skill-Advisor Hook Surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server hooks, shared-payload envelope) + Python (skill_advisor.py subprocess) |
| **Storage** | Hook-state cache (`pendingCompactPrime`-adjacent field), skill-graph SQLite freshness probe |
| **Runtimes Targeted** | Claude Code, Codex (pending research), Copilot, Gemini |
| **Pattern Reference** | `lib/code-graph/startup-brief.ts` — same architectural shape |

### Overview

Phase 020 runs research-first. `001-initial-research` investigates (a) hook trigger-point availability per runtime, (b) empirical cache-TTL / latency budget, (c) freshness-signal semantics analogous to code-graph. Implementation children (`002-*`, `003-*`) land per finding cluster after convergence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec scope defined with 6 acceptance scenarios
- [ ] Research umbrella sub-packet (001) scaffolded
- [ ] User approval for research dispatch

### Definition of Done (umbrella)
- [ ] 001-initial-research converges with ranked proposals
- [ ] All proposed remediation children spawned and implemented
- [ ] 019/004 200-prompt corpus passes as regression fixture
- [ ] Zero context-budget regression on typical sessions
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Producer/envelope/surface** — same three-layer pattern as code-graph:
1. **Producer**: `buildSkillAdvisorBrief()` wraps `skill_advisor.py` subprocess + cache layer. Returns compact `SkillAdvisorBriefResult`.
2. **Envelope**: shared-payload envelope (phase 018 R4) with `{ kind: 'skill-advisor', sections, provenance, trustState }`.
3. **Surface**: per-runtime hooks (session-prime + user-prompt-submit) inject the envelope into the runtime's prompt context.

### Key Components

```
mcp_server/
  lib/
    skill-advisor/                      (NEW)
      skill-advisor-brief.ts             buildSkillAdvisorBrief()
      freshness.ts                       getAdvisorFreshness()
      cache.ts                           fingerprint + TTL logic
  hooks/
    claude/
      session-prime.ts                   EDIT — append advisor brief
      user-prompt-submit.ts              NEW — per-prompt injection
      hook-state.ts                      EDIT — advisorCache field
    gemini/
      session-prime.ts                   EDIT
      user-prompt-submit.ts              NEW (or equivalent)
    copilot/
      session-prime.ts                   EDIT
      user-prompt-submit.ts              NEW (or wrapper)
references/
  hooks/
    skill-advisor-hook.md                NEW — surface contract
```

### Data Flow

```
user prompt
   │
   ▼
runtime's prompt-submit trigger
   │
   ▼
buildSkillAdvisorBrief(prompt)
   ├─ fingerprint = hash(prompt + skill-graph-mtime + skill-md-bundle-hash)
   ├─ cache-hit? ──► return cached result (marked cached=true)
   ├─ cache-miss? ─► skill_advisor.py subprocess (with 2s timeout)
   ├─ freshness probe (compare mtimes)
   ├─ wrap in shared-payload envelope
   └─ store in hook-state advisorCache
   │
   ▼
surface injection (1 line: "Skill: <name> (conf=<n>, unc=<n>, freshness=<state>)")
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research (001-initial-research)
- [ ] Scaffold 001-initial-research Level 2 sub-packet
- [ ] Dispatch `/spec_kit:deep-research :auto` on hook architecture + context budget + runtime parity
- [ ] Converge with ranked proposals per cluster

### Phase 2: Implementation Children (002-009) — finalized post-convergence

Research-converged train (wave-1 + wave-2 agree; see `001-initial-research/` + extended wave):

```
001 (converged)
  -> 002-shared-payload-advisor-contract          (envelope vocabulary gate)
  -> 003-advisor-freshness-and-source-cache       (freshness authority)
  -> 004-advisor-brief-producer-cache-policy      (buildSkillAdvisorBrief orchestrator)
  -> 005-advisor-renderer-and-regression-harness  [HARD GATE — no runtime adapter ships before this converges]
  -> 006-claude-hook-wiring                       (first user-visible runtime slice)
  -> 007-gemini-copilot-hook-wiring               (parity expansion; parallel with 008 after 006)
  -> 008-codex-integration-and-hook-policy        (parity expansion; parallel with 007 after 006)
  -> 009-documentation-and-release-contract       (final; reference doc + CLAUDE.md + release checklist)
```

- [ ] 002-shared-payload-advisor-contract (producer/source enums + `AdvisorEnvelopeMetadata` + privacy rejection rules)
- [ ] 003-advisor-freshness-and-source-cache (`getAdvisorFreshness()` + per-skill fingerprints + generation-tagged snapshots + 15-min source cache)
- [ ] 004-advisor-brief-producer-cache-policy (`buildSkillAdvisorBrief()` + prompt policy + HMAC exact cache + fail-open contract)
- [ ] 005-advisor-renderer-and-regression-harness (pure renderer + 200-prompt parity + 4 timing lanes + observability + privacy) — **HARD GATE**
- [ ] 006-claude-hook-wiring (`hooks/claude/user-prompt-submit.ts` via JSON `hookSpecificOutput.additionalContext`)
- [ ] 007-gemini-copilot-hook-wiring (Gemini JSON `additionalContext` + Copilot SDK + wrapper fallback)
- [ ] 008-codex-integration-and-hook-policy (Codex `UserPromptSubmit` + dynamic hook-policy detection + Bash-only `PreToolUse deny`)
- [ ] 009-documentation-and-release-contract (hook-surface reference doc + CLAUDE.md §Gate 2 + runtime READMEs + release checklist)

Each child carries its own `plan.md` dispatch details. 005 is a **hard gate**: runtime adapters (006/007/008) do not merge before 005 converges at 200/200 corpus parity + cache hit p95 ≤ 50 ms + privacy audit green.

### Phase 3: Verification
- [ ] 019/004 200-prompt regression corpus passes at 100%
- [ ] Cross-runtime snapshot tests pass
- [ ] Performance budget (p95 ≤ 50ms, ≤ 80 tokens) verified
- [ ] Documentation published
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command (for 020/001 research)

```
/spec_kit:deep-research :auto "Skill-advisor hook surface architecture research. Investigate: (a) per-runtime hook trigger-point availability (Claude UserPromptSubmit, Codex equivalent, Copilot equivalent, Gemini equivalent); (b) empirical latency + cache-TTL curve using the 019/004 200-prompt corpus; (c) freshness signal semantics analogous to code-graph getGraphFreshness; (d) context-budget tradeoffs for brief-length (40/60/80/120 tokens) vs routing-quality retention; (e) failure mode + fail-open contract for subprocess errors. Recommend implementation cluster decomposition with child spec folders under 020/." --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildSkillAdvisorBrief` cache + fingerprint | vitest |
| Unit | `getAdvisorFreshness` mtime comparison | vitest |
| Integration | Hook injection into each runtime's session-prime output | vitest + snapshot |
| Regression | 019/004 200-prompt corpus — hook vs direct CLI | pytest + vitest |
| Performance | Per-prompt overhead measurement | benchmark harness |
| Cross-runtime | Snapshot tests confirming identical brief format across 3 runtimes | vitest snapshot |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| skill_advisor.py | Python subprocess | Live (Phase 019/004 hardened) |
| Shared-payload envelope | Phase 018 R4 primitive | Live |
| Hook-state schema | Phase 016 primitive | Live (would add `advisorCache` field) |
| 019/004 200-prompt corpus | Regression fixture | Live, available at `.../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl` |
| Code-graph startup-brief pattern | Architectural reference | Live — direct adaptation source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: Hook adds > 150ms p95 latency OR the corpus regression shows accuracy drop > 5%.

**Procedure**:
1. Ship env flag `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=true` that short-circuits the hook
2. Set flag in affected deployments
3. Re-run research to identify the regression cause
4. Ship fix OR revert hook wiring commits while keeping the producer library
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research | None | Contract children |
| Shared payload | Research | Freshness and producer |
| Freshness | Shared payload | Producer |
| Producer | Freshness | Renderer |
| Renderer hard gate | Producer | Runtime adapters |
| Runtime adapters | Renderer | Release docs |
| Release docs | Runtime adapters | Sign-off |
<!-- /ANCHOR:phase-deps -->

### AI Execution Protocol

#### Pre-Task Checklist

- Confirm active child packet and parent phase map.
- Read predecessor child summaries before dispatch.
- Keep runtime adapter edits behind the renderer hard gate.

#### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow research, contract, producer, renderer, adapter, release order. |
| TASK-SCOPE | Keep each child implementation inside its child packet scope. |
| TASK-VERIFY | Run child tests and strict validation before release sign-off. |

#### Status Reporting Format

Status Format: child, gate, verification evidence, blocker, and next safe action.

#### Blocked Task Protocol

If a predecessor is not signed off, mark the child blocked and do not dispatch downstream runtime adapters.
