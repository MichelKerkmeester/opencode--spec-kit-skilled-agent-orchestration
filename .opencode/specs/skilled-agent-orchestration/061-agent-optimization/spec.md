<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Phase Parent Spec: 061 — Agent Fleet Optimization"
description: "Phase-parent root spec. Apply the validated sk-improve-agent v2 substrate (proven in packet 060 → final composite PASS 6/0/0) to the remaining 9 agents in the fleet. One sub-phase per agent. Sub-phase 006 also renames @ultra-think → @multi-ai-council across all 4 runtime mirrors and every reference."
trigger_phrases:
  - "061 root"
  - "061 phase parent"
  - "agent optimization"
  - "agent fleet improvement"
  - "improve agents"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-agent-optimization"
    last_updated_at: "2026-05-02T17:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded 9-phase parent + per-agent sub-phase specs"
    next_safe_action: "Pick a sub-phase and dispatch /improve:agent against the named target"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/061-agent-optimization/spec.md
    completion_pct: 0
    open_questions:
      - "Sequencing: improve LEAF agents first (@context, @deep-research, @deep-review) before orchestrators that dispatch them?"
      - "Should @improve-prompt go through /improve:agent or through /improve:prompt itself (companion command)?"
    answered_questions: []
---

# Phase Parent Spec: 061 — Agent Fleet Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_PHASE_PARENT: true -->

---

<!-- ANCHOR:purpose -->
## ROOT PURPOSE

The sk-improve-agent triad was empirically validated in packet 060 — final composite **PASS 6 / PARTIAL 0 / FAIL 0** against a substrate built across 5 sub-phases. The methodology, rubric, and tooling are now production-ready.

This packet applies that proven substrate to the **remaining 9 agents** in the fleet. One sub-phase per agent. Each sub-phase is a single application of the `/improve:agent` command-flow against its named target, followed by 4-runtime mirror sync (`.opencode/`, `.claude/`, `.gemini/`, `.codex/`).

**Excluded** (already optimized via this lineage):
- `@code` — packet 059 (5/2/1 → 6/2/0 → 8/0/0)
- `@improve-agent` — packet 060 (0/2/4 → 5/1/0 → 6/0/0)

**Special case:** sub-phase 006 also renames `@ultra-think` → `@multi-ai-council` across canonical + 3 runtime mirrors + every skill / command / README / MEMORY reference.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phases -->
## PHASES

| # | Folder | Target | LOC | Improvement focus | Status |
|---|---|---|---|---|---|
| **001** | `001-agent-context/` | `@context` | 444 | LEAF retrieval discipline; no-dispatch invariant; CocoIndex/grep routing fidelity | planned |
| **002** | `002-agent-debug/` | `@debug` | 506 | 5-phase root-cause discipline; user-invoked-only constraint; debug-delegation.md write boundary | planned |
| **003** | `003-agent-write/` | `@write` | 399 | Doc generation; sk-doc template alignment; DQI scoring discipline | planned |
| **004** | `004-agent-review/` | `@review` | 477 | Read-only review discipline; severity scoring; pattern enforcement | planned |
| **005** | `005-agent-orchestrate/` | `@orchestrate` | 855 | Multi-agent coordination; sub-agent dispatch authority; quality evaluation; unified delivery | planned |
| **006** | `006-agent-multi-ai-council/` | `@ultra-think` → `@multi-ai-council` | 526 | **RENAME + improve.** Multi-strategy planning architect; cross-runtime rename across 4 mirrors + every reference (skill/command/README/MEMORY/CLAUDE.md/AGENTS.md) | planned |
| **007** | `007-agent-improve-prompt/` | `@improve-prompt` | 271 | Prompt engineering; framework selection; CLEAR validation | planned |
| **008** | `008-agent-deep-review/` | `@deep-review` | 579 | LEAF autonomous review loop; P0/P1/P2 severity discipline; convergence detection | planned |
| **009** | `009-agent-deep-research/` | `@deep-research` | 476 | LEAF autonomous research loop; iteration state; convergence detection | planned |

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:approach -->
## APPROACH (per sub-phase)

Each sub-phase follows the same shape — single linear iteration, no R1/R2/R3 stress rounds (the substrate is already validated):

1. **Read target** — load the canonical `.opencode/agent/<name>.md` and identify integration surface via `scan-integration.cjs`
2. **Profile** — run `generate-profile.cjs` to derive the dynamic 5-dimension scoring profile for that target
3. **Dispatch** — invoke `/improve:agent .opencode/agent/<name>.md :auto` (or `:confirm` for the higher-stakes targets like @orchestrate)
4. **Score** — `score-candidate.cjs` produces 5-dimension scoring against profile
5. **Benchmark** — `run-benchmark.cjs` against the static fixtures (the fixture contract holds for any agent body)
6. **Legal-stop** — verify all 5 gate bundles (contractGate, behaviorGate, integrationGate, evidenceGate, improvementGate) pass
7. **Promote** — if gates pass, `promote-candidate.cjs` writes to canonical
8. **Mirror sync** — propagate to `.claude/`, `.gemini/`, `.codex/` (per memory rule — discipline-floor)
9. **Verify** — diff against pre-improvement baseline; check for regressions; commit

Sub-phase **006** has additional rename steps interleaved between 7 and 8 (rename canonical + 3 mirrors before the standard mirror sync).
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:reference -->
## REFERENCE PACKETS

- `../060-sk-agent-improver-test-report-alignment/` — methodology + substrate source. The `/improve:agent` command-flow that all 9 sub-phases will dispatch was finalized here.
- `../059-agent-implement-code/` — original stress-test methodology that 060 generalized.
<!-- /ANCHOR:reference -->

---

<!-- ANCHOR:success-criteria -->
## CAMPAIGN SUCCESS CRITERIA

- All 9 sub-phases report `complete` with `completion_pct=100` in `graph-metadata.json`
- Each canonical `.opencode/agent/<name>.md` shows a measurable score uplift on at least 3 of the 5 dimensions vs pre-improvement baseline
- All 4 runtime mirrors are byte-aligned (modulo runtime-specific frontmatter shape)
- Sub-phase 006: `@ultra-think` is fully renamed — zero remaining references in skills/commands/READMEs/MEMORY/CLAUDE.md/AGENTS.md after grep audit
- No regressions in dependent skills/commands (smoke-test by re-running representative scenarios from sk-improve-agent's manual_testing_playbook)
<!-- /ANCHOR:success-criteria -->
