---
title: "Implementation Summary: Template Backend Greenfield Redesign — C+F Hybrid Manifest-Driven"
description: "Investigation packet ended with a converged design recommendation (C+F hybrid, 86 → 15 source files). Body fields populated post-convergence."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "template greenfield summary"
  - "C+F hybrid summary"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign"
    last_updated_at: "2026-05-01T12:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Outcome populated post-convergence"
    next_safe_action: "User triggers follow-on implementation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-11-00-template-greenfield"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Template Backend Greenfield Redesign — C+F Hybrid Manifest-Driven

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-template-greenfield-redesign |
| **Completed** | 2026-05-01 (deep-research convergence) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

A 9-iteration autonomous deep-research loop converged on a **C+F hybrid manifest-driven greenfield template system** that takes the spec-kit template surface from **86 source files to 15** while eliminating the Level 1/2/3/3+ taxonomy entirely. The chosen design replaces the level scalar with three orthogonal axes (`kind` + `capabilities` + `presets`), gives every addon doc an explicit lifecycle owner so stale empty stubs never appear in fresh packets, and drives both the scaffolder and the validator from a single manifest so they cannot drift. The synthesis is in `research/research.md` (40.9 KB, 17 sections); concrete refactor phases are in `plan.md`; ADR-001 + ADR-002/003/004 capture the decisions in `decision-record.md`.

### Investigation Outcome

The greenfield framing replaced sibling packet `010-template-levels`'s PARTIAL recommendation, which had been driven by backward-compat constraints the user explicitly rejected. The 9-iter loop ran cli-codex / gpt-5.5 / reasoning=high / service-tier=fast with externalized state per iteration. Convergence hit at iter 9 (newInfoRatio **0.06** < threshold 0.10) after a clean monotonic decline: 0.78 → 0.82 → 0.74 → 0.67 → 0.58 → 0.47 → 0.41 → 0.38 → 0.06.

The headline insight: the level scalar **conflates two independent concerns** — which doc files a packet needs AND which sections within those docs apply. Decomposing them into orthogonal axes collapses the entire taxonomy without losing any validation power. Capability flags (`qa-verification`, `architecture-decisions`, `governance-expansion`) reproduce today's level matrix totally and minimally. Presets (`simple-change`, `validated-change`, `arch-change`, `governed-change`, `phase-parent`, `investigation`) preserve UX shorthand without forcing tier ordering.

The second insight: **addon docs aren't all the same kind of thing**. `handover.md` is written by `/memory:save`. `debug-delegation.md` by `@debug` only. `research.md` by `/spec_kit:deep-research` (and lives in `research/` subfolder). Treating them as author-scaffolded starter templates produces stale empty stubs nobody touches. C+F hybrid makes lifecycle ownership explicit per addon, scaffolds nothing for command/agent/workflow-owned docs, and lets the owners create them lazily on first write.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

9 iterations of cli-codex / gpt-5.5 / high reasoning / fast service-tier ran end-to-end with externalized state. After each iteration the reducer (`scripts/reduce-state.cjs`) refreshed `findings-registry.json`, `deep-research-strategy.md`, `deep-research-dashboard.md`. The loop was extended from 6 to 9 iterations mid-run after iter 5 closed all design questions early — extra iters added depth (inline-gate EBNF formalization, manifest evolution policy, integration probe with concrete diffs, end-to-end dry-run of 3 preset shapes) instead of breadth. Total wall-clock for the loop: ~75 min across 9 codex subprocesses. Two cross-validation surfaces fed the design: claude-opus-4-7 sequential-thinking (10-thought analysis) AND independent gpt-5.5 cli-copilot run (`010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md`) — copilot's analysis materially changed claude's design (introduced lazy-addon distinction).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Chose **C+F hybrid manifest-driven greenfield** | Only design that admits docs aren't all the same kind of thing. Capability flags replace levels cleanly (no tier ordering needed); lazy command-owned addons eliminate stale empty stubs; single manifest eliminates scaffold/validator drift. Scored 35/35-relative against the 7-criterion rubric vs F:16, B:24, D:26, G:31. |
| Eliminate Level 1/2/3/3+ taxonomy entirely | Levels conflate two concerns (file requirements + section variance). Decomposing them into orthogonal axes (kind + capabilities) reduces conceptual surface AND validator complexity. |
| Inline gates over fragment files (Q10) | Inline gates preserve whole-document markdown authoring; section reuse across docs is rare in practice (verified iter 4); fragment-file indirection adds composer complexity without justification. EBNF grammar formalized iter 6. |
| Lazy command/agent/workflow-owned addons NOT scaffolded | `handover.md` written by `/memory:save`. `debug-delegation.md` by `@debug` only. `research.md` by `/spec_kit:deep-research`. Scaffolding them creates stale stubs nobody touches. Owners create them on first write instead. |
| Single manifest drives BOTH scaffolder + validator | Eliminates the largest drift surface in today's system (level→files matrix exists in both `create.sh` and `check-files.sh`). Both load via same canonical loader = structurally cannot disagree. |
| `manifestVersion` exact match for greenfield (ADR-002) | YAGNI — no real migration scenario exists yet. Adapter machinery deferred until first migration arrives. |
| Template-contract frontmatter only on `spec.md` (ADR-003) | spec.md is canonical packet identity per resume ladder. Duplicating contract block in plan/tasks/checklist/decision-record/impl-summary creates 5× drift surface for zero gain. |
| Phase-parent scaffolds parent only (ADR-004) | Children added incrementally via `create.sh --subfolder` (matches existing UX). Keeps `--level phase` (or kind=phase-parent internally) minimal. |
| **`Level 1/2/3/3+` is SOLE public/AI-facing vocabulary (ADR-005)** | User constraint: AI behavior + conversation flow must stay byte-identical. The `--level N` flag, `<!-- SPECKIT_LEVEL: N -->` markers, and validator error messages stay level-only forever. Preset/capability/kind names live ONLY in the private manifest. CI test (`workflow-invariance.vitest.ts`) fails the build if banned vocabulary leaks to public surfaces. Iters 10-13 audited 11 surfaces + 5 AI-conversation scenarios; design survives the constraint with explicit mitigations. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Deep-research convergence | PASS — converged at iter 9, newInfoRatio 0.06 < threshold 0.10 |
| 17-section synthesis written | PASS — `research/research.md` 40.9 KB |
| Resource map emitted | PASS — `research/resource-map.md` 11.5 KB |
| All 10 design questions answered | PASS — Q1-Q10 closed with cited evidence per question |
| 5 candidate designs scored | PASS — F/B/D/G eliminated with reasoning; C+F hybrid winner |
| 3 final open items resolved | PASS — ADR-002 (manifest version) + ADR-003 (template-contract location) + ADR-004 (phase-parent scaffolding) |
| ADR-001 finalized + Five Checks | PASS — 5/5 PASS |
| Workflow-invariant constraint pass (iters 10-14) | PASS — converged at iter 14 newInfoRatio 0.08; ADR-005 added (5/5 Five Checks PASS) |
| 11 public surfaces audited (iter 12) | PASS — only 2 minor leaks; both fixed in Phase 1 implementation |
| 5 AI-conversation scenarios dry-run (iter 13) | PASS — all 5 preserve level-only vocabulary in AI's user-visible turns |
| Cross-validation by independent agent | PASS — cli-copilot gpt-5.5 analysis materially refined the design |
| `validate.sh --strict` final pass | (run after these spec-doc edits land) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **No code changed in this packet.** Investigation only. Phases 1-4 (manifest + loader + scaffolder + validator + delete) live in a follow-on implementation packet which has NOT been scaffolded yet. User must trigger that next.
2. **Inline-gate renderer is greenfield code.** EBNF grammar is formalized but not implemented. Phase 1 of follow-on adds `scripts/templates/inline-gate-renderer.ts` (~100 LOC) with golden tests against the grammar.
3. **Manifest evolution policy is "exact match" until first migration.** ADR-002 explicitly defers adapter machinery. When the first manifest version bump arrives, that scenario will design its own adapter — at that point the adapter pattern is informed by what actually changed, not speculation.
4. **Existing 868 packets are intentionally NOT migrated.** They remain valid as git history. The new system applies to packets created after the implementation lands. ADR-001 §Consequences.
5. **`compose.sh` byte-equivalence repair from sibling 010 packet is OBSOLETE.** Old PARTIAL plan is REJECTED. New design has no composer (no build step) — manifest + renderer at scaffold time replaces it.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
