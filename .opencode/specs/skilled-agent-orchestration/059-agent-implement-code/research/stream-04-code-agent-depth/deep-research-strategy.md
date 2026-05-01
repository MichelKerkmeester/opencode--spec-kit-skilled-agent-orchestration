---
title: Stream-04 Deep Research Strategy — @code Agent Depth/Structure
description: Strategy for stream-04 — translate @review's rich structural depth into a CODER perspective for .opencode/agent/code.md
---

# Deep Research Strategy — Stream-04 (@code Agent Depth)

Tracks research progress for stream-04: structural deepening of `.opencode/agent/code.md` to mirror `.opencode/agent/review.md` (~478 lines) from a coder/implementation perspective.

## 1. OVERVIEW

### Purpose

Investigate how each section of `@review.md` translates to a CODER perspective, producing a drop-in expanded `.opencode/agent/code.md` body proposal (target 400-500 lines). Cite line ranges from `review.md`, `write.md`, `debug.md`, `sk-code/SKILL.md`, `sk-code-review/SKILL.md`, AGENTS.md, and the existing Phase 2 synthesis from streams 01/02/03.

### Usage

- **Init:** populated with the 10 priority questions below.
- **Per iteration:** cli-codex (gpt-5.5 high fast) writes iteration-NNN.md + state-log + delta. We patch executor block + machine-owned sections inline.
- **Mutability:** strategy is mutable; reducer's machine-owned sections refreshed by us inline.

---

## 2. TOPIC

Translate @review.md's rich structure (§0-§13, ~478 lines) into a CODER analog for .opencode/agent/code.md:
- §0 ILLEGAL NESTING (already present)
- §1 CORE WORKFLOW (8 steps in review → 6 steps in current code; consider expanding to mirror rigor)
- §2 FAST PATH & CONTEXT PACKAGE (low-complexity skip)
- §3 CAPABILITY SCAN (Skills + Tools tables)
- §4 REVIEW MODES → IMPLEMENTATION MODES
- §5 QUALITY RUBRIC → CODER ACCEPTANCE RUBRIC
- §6 REVIEW CHECKLIST → CODER CHECKLISTS (pre/during/post)
- §7 ORCHESTRATOR INTEGRATION (gate protocol; circuit breaker)
- §8 OUTPUT FORMAT → RETURN format expansion
- §9 RULES (✅ Always / ❌ Never / ⚠️ Escalate-If)
- §10 OUTPUT VERIFICATION (Pre-Report Verification, Iron Law, Adversarial Self-Check)
- §11 ANTI-PATTERNS
- §12 RELATED RESOURCES
- §13 SUMMARY (ASCII box)

---

## 3. KEY QUESTIONS (remaining)

- [x] Q1 — Quality rubric for code work: dimensions, points, bands, severity classification (resolved iter 1, ratio 0.74)
- [ ] Q2 — Coder-side dispatch modes (full-implementation, surgical-fix, refactor-only, test-add, scaffold-new-file, rename-move, dependency-bump)
- [ ] Q3 — Pre/During/Post-implementation checklists: universal items + stack-aware ones via sk-code
- [ ] Q4 — Output verification protocol for coders: self-checks before claiming done; coder-side Iron Law
- [ ] Q5 — Adversarial self-check (Builder/Critic/Verifier) — coder analog of Hunter/Skeptic/Referee
- [ ] Q6 — Coder-specific anti-patterns (silent retry, scope creep, premature abstraction, cargo culting, "while we're here", bash bypass, partial-success returns, claim-without-verify)
- [ ] Q7 — Confidence levels (HIGH/MEDIUM/LOW) — what evidence per band?
- [ ] Q8 — Orchestrator integration — RETURN contract refinement (extend `<files> | <verification> | <escalation>`)
- [ ] Q9 — Skill loading precedence — mirror @review's "sk-code baseline + one overlay" precedence rule for coder
- [ ] Q10 — Summary box (ASCII) — coder-side analog of @review §13

---

## 4. NON-GOALS

- Do NOT mutate `.opencode/agent/code.md` directly — that's the parent's job after reviewing this synthesis.
- Do NOT re-investigate streams 01/02 externals — pull existing findings.
- Do NOT introduce stack-specific content in the proposed code.md body (must stay codebase-agnostic; sk-code owns stack-specific rules).
- Do NOT invent caller-restriction frontmatter fields (D3 already locked: convention-floor).

---

## 5. STOP CONDITIONS

- All 10 key questions resolved with ≥1 cited finding each (quality guard).
- 10-iteration ceiling reached.
- 3-signal weighted vote convergence: rolling_avg(3) < 0.05 ∨ MAD floor at 4+ iters ∨ coverage ≥ 0.85; weighted score > 0.60 = stop.
- Stuck count ≥ 3 → recovery (widen focus, reset).

---

## 6. ANSWERED QUESTIONS

- **Q1** (iter 1, ratio 0.74): Coder Acceptance Rubric — Correctness 30, Scope-Adherence 20, Verification-Evidence 20, Stack-Pattern-Compliance 15, Integration 15. Quality bands EXCELLENT/ACCEPTABLE/NEEDS REVISION/REJECTED. Severity P0/P1/P2 with P0 hard-block on completion regardless of total score, P1 must-fix unless orchestrator approves deferral, P2 non-blocking. Per-dimension Full/Good/Weak/Critical matrix. Security/correctness held as hard P0/P1 overrides inside Correctness + Integration (not separate scoring dim because review owns risk-finding; coder owns authoring acceptance). See `iterations/iteration-001.md`.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

- Iter 1: Pulling structural template directly from @review.md §5 (lines 116-152) and grounding coder dimensions in sk-code Phase 1.5 + sk-code-review baseline minimums + AGENTS.md scope discipline produced a clean coder-side rubric with cited justification for each dimension's weight.

---

## 8. WHAT FAILED

[None yet — populated after iteration 1]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]

---

## 10. RULED OUT DIRECTIONS

[None yet]

---

## 11. NEXT FOCUS

**Stream-04 COMPLETE.** All 10 priority questions resolved with cited evidence. Convergence STOP signal met (zero remaining + each Q has ≥1 cited finding) at iteration 8 of 10. Phase 3 synthesis authored at `research.md` with the drop-in expanded `.opencode/agent/code.md` body proposal (~440 lines, target 400-500 met). Parent should review and apply per `research.md` §Recommendations + §Next Steps.

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

**Phase 2 cross-stream synthesis already authored** (see `../synthesis.md`):
- Streams 01 (oh-my-opencode-slim), 02 (opencode-swarm-main), 03 (internal `.opencode/agent/*`) all converged on:
  - D3 caller-restriction = **convention-floor** (no harness field exists in any source)
  - Stack detection lives in skills, not agents — `@code` MUST delegate to `sk-code`
  - Bash/interpreter writes bypass every hook — explicit warning required in agent body
  - Skill auto-loading is orchestrator-side (Skills: line in dispatch payload + body Skills table)
- D3 final answer = convention-floor + LEAF enforcement (frontmatter `mode: subagent` + `permission.task: deny`)

**Anchor files for stream-04** (mirroring perspective):
- `.opencode/agent/review.md` (478 lines, §0-§13) — structural template to mirror
- `.opencode/agent/write.md` (400 lines) — write-capable LEAF analog (workflow shape, scope discipline)
- `.opencode/agent/debug.md` (507 lines) — 5-phase methodology with rich structure (good coder-adjacent pattern)
- `.opencode/agent/code.md` (current, 102 lines) — shallow version to expand
- `.opencode/skill/sk-code/SKILL.md` (717 lines) — what @code invokes; stack routing; Phase 1.5 Code Quality Gate (P0/P1/P2 severity); Iron Law line 62
- `.opencode/skill/sk-code-review/SKILL.md` (392 lines) — coder-side baseline (mirror of sk-code-review used by @review; adapt for coder)
- `AGENTS.md` (384 lines) — Confidence Framework §4, Quality Principles §1, Anti-Patterns table, Analysis Lenses
- `CLAUDE.md` — Iron Law, scope-lock, fail-closed verify principles

**External findings already extracted (do not re-research):**
- Slim's `fixer.ts` — coder-equivalent agent prompt shape (stream-01 captured)
- Swarm's `coder.ts:111-125` — STOP/BLOCKED/NEED protocol (stream-02 captured); `coder.ts:77+` residual stack-leak gap

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- Lifecycle branches: new (live)
- Machine-owned sections: reducer-equivalent maintains 7-11 inline
- Capability matrix: not used (cli-codex executor)
- Current generation: 1
- Started: 2026-05-01T17:30:09.000Z
- Stack-agnostic constraint: proposed code.md body must NOT bake stack-specific examples (no Webflow/Go/Next.js mentions in body except illustrative `e.g.` if absolutely needed)
- Iron Law preservation: mirror @review §10 "NEVER CLAIM COMPLETION WITHOUT VERIFICATION EVIDENCE"
