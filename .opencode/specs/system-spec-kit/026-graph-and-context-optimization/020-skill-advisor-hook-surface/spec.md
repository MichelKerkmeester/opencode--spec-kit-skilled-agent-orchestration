---
title: "Feature Specification: Skill-Advisor Hook Surface (cross-runtime, context-efficient)"
description: "Research-first umbrella for proactive skill-advisor integration across all CLI runtimes (Claude, Codex, Copilot, Gemini). Goal: run advisor on every relevant prompt via hook infrastructure (not explicit AI invocation), surface minimal context (top-1 skill + confidence only), cache within session to avoid redundant calls. Follows the code-graph buildStartupBrief pattern."
trigger_phrases:
  - "020 skill advisor hook"
  - "skill advisor hook surface"
  - "proactive skill routing"
  - "cross-runtime skill advisor"
  - "skill advisor context injection"
  - "skill advisor brief"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T06:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Phase 020 charter scaffolded — skill-advisor hook surface across all CLI runtimes"
    next_safe_action: "Scaffold 020/001-initial-research for hook architecture + context-budget investigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"

---
# Feature Specification: Skill-Advisor Hook Surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessor** | 019-system-hardening (shipped 2026-04-19, includes routing-accuracy hardening 019/004) |
| **Successor** | (future per-cluster remediation children once research converges) |

Today's skill-advisor (Gate 2) runs **only** when the AI explicitly invokes `skill_advisor.py` in a shell command. That limits its impact to three ways: (1) the AI remembering to call it, (2) a Claude Code harness running it before turns, (3) manual developer invocation. Codex, Gemini, and Copilot runtimes don't benefit from proactive routing at all — even when they're perfectly positioned to use the same skill catalog. Meanwhile the advisor's full JSON output is verbose (often 200-400 tokens with multiple candidates, uncertainty fields, graph-boost explanations). If it ran on every prompt and dumped full output, context would balloon quickly.

The 019/004 routing-accuracy hardening that just landed (Gate 3 F1 68.6%→97.66%, advisor 53.5%→60.0%) proves the advisor is worth running more often — but only if we can make the surface lightweight. That's what this phase solves.

**Design inspiration**: the code-graph `buildStartupBrief()` pattern from phase 017/018. That function produces a compact structural snapshot (~50 tokens) surfaced by the session-prime hook in all three runtimes (claude, gemini, copilot). Trust-state vocabulary (live/stale/absent/unavailable) and shared-payload envelope (phase 018 R4) make the output transport-neutral.

**Key Decisions**: Research-first — no implementation child created until `001-initial-research` produces actionable findings on hook trigger points, cache invalidation model, and context budget curves. Each finding cluster becomes a sibling child (`020/002-*`, `020/003-*`). The umbrella packet owns sequencing; cluster-local behavior stays in each child.

**Critical Dependencies**: skill_advisor.py must already be Python-fast-path invokable (it is). Hook infrastructure must accept arbitrary producers (shared-payload envelope does — phase 018). No new runtime dependencies; piggyback on existing session-prime + compact-inject hooks.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (major UX improvement + cross-runtime equality; not release-blocking) |
| **Status** | Spec Ready, Awaiting Plan/Research Approval |
| **Created** | 2026-04-19 |
| **Branch** | `main` |
| **Parent Packet** | `../` (026-graph-and-context-optimization) |
| **Immediate Predecessor** | `019-system-hardening/` (shipped 2026-04-19, incl. 019/004 routing-accuracy Gate 3 F1 97.66%) |
| **Effort Estimate** | Research wave ~20-30h wall clock; implementation ~3-5 days per cluster child |
| **Child Layout** | `001-initial-research` (research wave), `002+` reserved for per-cluster remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**Current state** — skill-advisor invocation and context cost:

1. **Invocation surface is manual-only.** `skill_advisor.py --threshold 0.8 "<prompt>"` is called by:
   - Claude Code when the harness's Gate 2 pre-hook fires (typically only on initial turn / after memory rotate)
   - The AI, when CLAUDE.md's Gate 2 instruction reminds it to run it (variable adherence)
   - Never by Codex, Gemini, or Copilot runtimes — their CLIs don't have the Gate 2 pre-hook
2. **Full advisor output is verbose.** Typical output: 200-400 tokens with top-5 candidates, `confidence`, `uncertainty`, `_graph_boost_count`, `reason`, per-match phrase list. If dumped on every prompt, context scales poorly.
3. **Cross-runtime gap.** Code-graph surfaces via `buildStartupBrief()` on all 3 runtimes. Advisor output has no equivalent path. Gemini/Codex/Copilot users get no proactive skill recommendations even when they'd benefit from the same skill catalog.
4. **No session-level cache.** Even when the AI does invoke the advisor, subsequent similar prompts in the same session re-run it from scratch. For a 30-turn session with 10 similar-shaped prompts, that's 10 redundant advisor runs.
5. **No proactive freshness model.** When a skill's SKILL.md is edited mid-session, the in-memory advisor graph stays stale. Code-graph has a `getGraphFreshness()` signal (live/stale/absent/unavailable). Advisor has nothing equivalent.

Concrete 019/004 evidence that justifies fixing this now:
- Advisor accuracy jumped 53.5%→60.0% after 019/004 normalization + deep-loop markers
- Gate 3 F1 jumped 68.6%→97.66% after deep-loop markers — these are shared between advisor and Gate 3
- Joint error rate dropped 63.5%→43.5% (FF cell 31→1, a 97% reduction)
- The routing-accuracy corpus has 200 labeled prompts now — a concrete regression fixture

So the advisor is MORE useful per invocation than it used to be, AND we have a regression fixture to verify behavior. But it still runs rarely because invocation is manual.

### Purpose

Make the skill-advisor a **proactive, low-cost, cross-runtime signal** that fires on every relevant prompt without the AI having to call it, without bloating context, and without re-running redundantly. Mirror the code-graph hook pattern that already works for all runtimes.

Concrete goals:
1. **Trigger on prompt entry** — via session-prime hook (first turn) + a new user-prompt-submit hook (every subsequent turn) for all 3 runtimes
2. **Minimal surface** — one line per prompt: `Skill: <top-1-name> (confidence=<n>, uncertainty=<n>)` or `Skill: none (below-threshold, passthrough)`
3. **Session cache** — store last advisor result in hook-state; short-circuit when prompt fingerprint matches recent prior (TTL tuned during research)
4. **Freshness signal** — same vocabulary as code-graph: `live | stale | absent | unavailable` based on skill-graph SQLite mtime vs SKILL.md mtimes
5. **Cross-runtime parity** — all 3 CLIs (claude, gemini, copilot) get identical brief surface; shared-payload envelope transports it

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build `buildSkillAdvisorBrief()` in `mcp_server/lib/skill-advisor/` parallel to `lib/code-graph/startup-brief.ts`. Returns `{ topSkill, confidence, uncertainty, freshness, cached, brief, sharedPayload }`.
- Define cache-key + TTL model for session-scoped advisor-result memoization (hook-state key).
- Wire into existing session-prime hooks for all 3 runtimes (claude, gemini, copilot) alongside existing startup-brief call.
- Add new **user-prompt-submit** hook (or equivalent per-runtime trigger) that fires `buildSkillAdvisorBrief()` on every incoming prompt and injects the one-line brief.
- Add `getAdvisorFreshness()` freshness probe (analogous to `getGraphFreshness()`) based on skill-graph SQLite file mtime + per-skill SKILL.md mtimes.
- Surface envelope via **shared-payload** contract from phase 018 R4 (trustState, provenance, sections).
- Reuse the 019/004 200-prompt labeled corpus as regression fixture for hook-produced advisor results — verify they match the direct-CLI output within tolerance.
- Honor existing `--threshold` / `--uncertainty` CLI flags via hook-side env or config.
- Document the hook surface contract in a new reference doc under `.opencode/skill/system-spec-kit/references/hooks/` (file created by implementation child 020/008).

### Out of Scope

- Rewriting the advisor's ranking algorithm. 019/004 shipped the current accuracy targets; this phase packages the result differently, not recomputes it.
- Adding new trigger-phrase categories to Gate 3 or skill metadata. Belongs to a separate phase.
- Server-side (LLM-backed) skill classification. Advisor stays local-Python.
- Replacing the explicit Gate 2 invocation for Claude Code. The hook is additive; the explicit path still works for scripted use.
- Cross-repo skill discovery. The advisor scope remains the current `.opencode/skill/` tree.
- Multi-turn conversation analysis (e.g., "what skill has been active across last N turns"). Per-prompt only.

### Files to Change

See research output for full file list. Architectural anchors:

| File | Change Type | Description |
|------|-------------|-------------|
| `mcp_server/lib/skill-advisor/skill-advisor-brief.ts` | NEW | Core `buildSkillAdvisorBrief()` + cache logic |
| `mcp_server/lib/skill-advisor/freshness.ts` | NEW | `getAdvisorFreshness()` analogous to code-graph ensure-ready |
| `mcp_server/hooks/claude/session-prime.ts` | EDIT | Append advisor brief to existing startup-brief surface |
| `mcp_server/hooks/gemini/session-prime.ts` | EDIT | Same |
| `mcp_server/hooks/copilot/session-prime.ts` | EDIT | Same |
| `mcp_server/hooks/claude/user-prompt-submit.ts` | NEW (or edit existing equivalent) | Per-prompt advisor brief injection |
| `mcp_server/hooks/gemini/user-prompt-submit.ts` | NEW | Per-prompt advisor brief for Gemini transport |
| `mcp_server/hooks/copilot/user-prompt-submit.ts` | NEW | Per-prompt advisor brief for Copilot transport |
| `mcp_server/hooks/claude/hook-state.ts` | EDIT | Add `advisorCache` field with { fingerprint, result, updatedAt, ttlSecs } |
| New hook-surface contract doc under `.opencode/skill/system-spec-kit/references/hooks/` | NEW | Hook surface contract doc (created by 020/008) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers (MUST complete)

- **R1**: `buildSkillAdvisorBrief()` returns a compact brief (≤ 80 tokens) with topSkill + confidence + uncertainty + freshness + cached-bool
- **R2**: Hook wired into session-prime for all 3 runtimes; verified injection on session start
- **R3**: Hook wired into per-prompt-submit hook for all 3 runtimes; verified injection on every turn
- **R4**: Session cache prevents redundant advisor invocations when prompt fingerprint matches recent prior (within TTL)
- **R5**: Freshness signal (live/stale/absent/unavailable) populated correctly based on skill-graph + SKILL.md mtimes
- **R6**: Zero regression on the 019/004 200-prompt labeled corpus: hook-produced top-1 must equal direct-CLI top-1 for all 200 prompts

### 4.2 P1 - Required (complete OR user-approved deferral)

- **R7**: Shared-payload envelope (from phase 018 R4) carries the brief with correct trustState vocabulary
- **R8**: Cache TTL is data-driven (based on research-phase empirical measurement)
- **R9**: `--no-advisor-hook` env flag to disable the hook per-session (escape hatch)
- **R10**: Regression fixture suite for the 3 runtime hooks

### 4.3 Acceptance Scenarios

1. **Given** a Claude Code session starts with an active spec folder, **when** the first turn's prompt arrives, **then** the session-prime hook surfaces a one-line advisor brief naming the top-1 skill + confidence.
2. **Given** the user types two prompts with identical prompt text in the same session, **when** the second prompt arrives, **then** the advisor brief is served from cache (marked `cached=true`) with no new `skill_advisor.py` subprocess.
3. **Given** a user edits `.opencode/skill/sk-code-opencode/SKILL.md` mid-session, **when** the next prompt arrives, **then** the advisor brief shows `freshness=stale` and prompts a background refresh.
4. **Given** a Gemini CLI session is running, **when** the user types a prompt, **then** the same one-line advisor brief appears in Gemini's context prime (via the shared-payload envelope).
5. **Given** a Copilot CLI session is running, **when** the user types a prompt, **then** the same brief appears in Copilot's compact-cache surface.
6. **Given** the skill-advisor Python subprocess is unavailable (binary missing, dependency error), **when** a prompt arrives, **then** the hook returns `freshness=unavailable` and the brief omits the skill recommendation rather than blocking the turn.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] All 6 acceptance scenarios pass in per-runtime integration tests
- [ ] 019/004 200-prompt corpus: hook top-1 matches direct-CLI top-1 on 100% of prompts (no regression)
- [ ] Per-prompt overhead: hook adds ≤ 50ms latency (p95) over baseline, ≤ 80 additional tokens surfaced
- [ ] Session-scoped cache reduces redundant advisor subprocess calls by ≥ 60% on a typical 30-turn session
- [ ] Freshness signal correctly flips `live`→`stale` when any SKILL.md mtime exceeds skill-graph SQLite mtime
- [ ] Hook failure mode: advisor unavailable → brief degrades to `freshness=unavailable` without turn interruption
- [ ] All 3 runtime hooks ship with identical brief format (verified via snapshot tests)
- [ ] Documentation: new hook-surface reference doc covers contract, failure modes, cache invalidation, cross-runtime semantics (location under `.opencode/skill/system-spec-kit/references/hooks/`, created by 020/008)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Advisor subprocess latency degrades per-turn response time | Medium | Session cache + fire-and-forget async invocation on subsequent turns |
| Stale advisor graph in long-running sessions | Medium | Freshness signal + background refresh trigger on SKILL.md edit |
| Cross-runtime brief format drift | Medium | Snapshot tests + shared-payload envelope enforcement |
| Hook failure blocks turn completion | High | Fail-open contract — advisor errors return `unavailable` freshness, not turn abort |
| Context bloat if brief grows over time | Low | Tokens capped at 80 in R1; regression test asserts cap |
| Cache invalidation bugs cause stale recommendations | Medium | Cache key = prompt fingerprint + skill-graph mtime + SKILL.md mtime-bundle hash |
| Codex CLI doesn't support custom hooks | High | Research confirms whether Codex has equivalent hook surface or needs wrapper |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- Per-prompt hook latency: p50 ≤ 15ms, p95 ≤ 50ms, p99 ≤ 120ms
- Brief size: ≤ 80 tokens (hard cap)
- Cache hit rate: ≥ 60% on typical sessions

### Security
- Advisor subprocess runs with same permissions as hook runtime (no escalation)
- No user prompt content logged to persistent storage outside hook-state TTL
- Shared-payload envelope uses phase 018 provenance contract (sanitizerVersion + runtimeFingerprint)

### Reliability
- Hook fail-open: advisor errors never block the turn
- Cache TTL: research-determined (initially propose 5 minutes)
- Freshness polling: O(1) stat calls, not O(N) content parsing

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Prompt length 0 (empty): skip advisor, return `freshness=absent` brief
- Prompt length > 10KB: truncate to 2KB fingerprint window before hashing
- Skill-graph SQLite missing: `freshness=absent`, hook stays out of the way

### Error Scenarios
- Python 3 not available in PATH: `freshness=unavailable`, graceful skip
- Advisor subprocess timeout (> 2s): abort, `freshness=unavailable`
- Advisor output unparseable JSON: log warning, `freshness=unavailable`

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score (0-20) | Note |
|-----------|--------------|------|
| Scope breadth | 14 | 3 runtimes × 2 hook points + new lib module |
| Integration depth | 12 | Shared-payload envelope, hook-state, code-graph freshness model analogue |
| Test surface | 10 | Cross-runtime snapshot + corpus regression |
| Runtime risk | 8 | Fail-open contract bounds blast radius |
| **Total** | **44** | Level 3 appropriate |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk | Severity | Likelihood | Mitigation reference |
|------|----------|------------|---------------------|
| Advisor subprocess latency degrades turn response | Medium | Medium | §6 row 1 — session cache |
| Stale advisor graph mid-session | Medium | Medium | §6 row 2 — freshness signal |
| Cross-runtime brief drift | Medium | Low | §6 row 3 — snapshot tests |
| Hook failure blocks turn | High | Low | §6 row 4 — fail-open contract |
| Context bloat from growing brief | Low | Low | §6 row 5 — 80-token hard cap |
| Cache invalidation bugs | Medium | Medium | §6 row 6 — multi-input fingerprint |
| Codex CLI hook gap | High | Unknown | §6 row 7 — research-question Q1 |

---

## 11. USER STORIES

### US-001: Cross-runtime proactive routing (Priority: P0)
**As a** user running Gemini CLI on a complex coding task
**I want** the skill-advisor to automatically surface the most relevant skill at prompt time
**So that** I get the same routing quality as Claude Code users without having to manually invoke the advisor

### US-002: Lightweight context footprint (Priority: P0)
**As a** heavy-session user approaching context limits
**I want** the advisor brief to stay small (≤ 80 tokens) per prompt
**So that** proactive routing doesn't consume context budget that would otherwise go to actual work

### US-003: Cached recommendations (Priority: P1)
**As a** developer iterating on similar prompts in one session
**I want** repeat advisor queries to be answered from cache
**So that** the 50ms p95 advisor overhead doesn't multiply across turns

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Q1: Does Codex CLI expose a prompt-submit hook surface equivalent to Claude's `UserPromptSubmit`? If not, research must propose a wrapper.
- Q2: What's the right cache TTL? 5 min baseline, but empirical measurement in research phase should refine.
- Q3: Should the brief include a "confidence trend" across the session (rising, falling, stable) or just the latest value?
- Q4: What's the correct trust-state value when skill-graph SQLite exists but is older than some-but-not-all SKILL.md files?
- Q5: Do we want a "suggested skill invocation" hint (e.g., `Run /sk-git`) or just the skill name, leaving invocation to the AI?
- Q6: Should the hook fire on ALL user prompts or only prompts above a length threshold (e.g., > 20 chars)?
- Q7: Is there a privacy concern with sending prompt fingerprints through hook-state persistence? Phase 018 provenance contract should cover this; research must verify.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md` (026-graph-and-context-optimization)
- Predecessor: `../019-system-hardening/004-routing-accuracy-hardening/spec.md`
- Reference pattern: `../../../../skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- Reference contract: `../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` (phase 018 R4)
- Advisor source: `../../../../skill/skill-advisor/scripts/skill_advisor.py`
- Routing corpus: `../../../../specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
