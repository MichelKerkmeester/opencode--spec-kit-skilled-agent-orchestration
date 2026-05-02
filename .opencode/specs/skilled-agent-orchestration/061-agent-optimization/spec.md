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
- Sub-phase 006: `@ultra-think` is fully renamed — zero remaining references in skills/commands/READMEs/MEMORY/CLAUDE.md/AGENTS.md after grep audit (active surfaces only; spec-folder + changelog history left frozen)
- No regressions in dependent skills/commands (smoke-test by re-running representative scenarios from sk-improve-agent's manual_testing_playbook)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:preflight -->
## PRE-FLIGHT VERIFICATION (2026-05-02)

Substrate sanity-checked end-to-end before any sub-phase dispatch.

### Substrate scripts (all 9 present + executable)

| Script | Bytes | Purpose |
|---|---|---|
| `scan-integration.cjs` | 11,157 | Surface scanner — works against all 9 targets, returns dict-shaped surfaces with canonical + 4 mirrors + syncStatus |
| `generate-profile.cjs` | 12,981 | Dynamic 5-dim profile generator — works against all 9 targets, emits `derivedChecks.structural[]` per target |
| `score-candidate.cjs` | 18,128 | 5-dimension candidate scorer |
| `run-benchmark.cjs` | 14,312 | Static fixture runner — uses generic fixtures (artifact-format checks); profile.targetPath is metadata only, not a scoring input |
| `reduce-state.cjs` | 34,456 | Ledger reducer + dimensional dashboard; emits nested `legal_stop_evaluated.details.gateResults` (5 gates) |
| `promote-candidate.cjs` | 8,474 | Guarded canonical promotion |
| `rollback-candidate.cjs` | 4,090 | Pre-promotion backup restore |
| `materialize-benchmark-fixtures.cjs` | 3,552 | Materializes static fixtures into packet-local benchmark-outputs |
| `check-mirror-drift.cjs` | 6,015 | 4-runtime drift detector (used in verification phase) |

### 4-runtime mirror presence (all 9 × 4 = 36 mirror files verified)

`@context`, `@debug`, `@write`, `@review`, `@orchestrate`, `@ultra-think`, `@improve-prompt`, `@deep-review`, `@deep-research` — each has all 4 runtime mirrors (`.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`).

### Dry-run results (per-target, 2026-05-02)

- `scan-integration.cjs --agent=<each>` → returns valid surfaces dict with canonical+mirrors syncStatus for all 9
- `generate-profile.cjs --agent=.opencode/agent/<each>.md` → produces dynamic profile with structural+behavioral+integration check arrays for all 9; default `promotionEligible: false` (set true downstream by guard logic)

Saved at `/tmp/061-preflight/scan-*.json` and `/tmp/061-preflight/profile-*.json` for reference.

### Substrate caveats

| Caveat | Detail | Impact |
|---|---|---|
| Benchmark profile `targetPath` hardcoded | `assets/benchmark-profiles/default.json` says `targetPath: ".opencode/agent/improve-agent.md"` | Metadata only — used in report.target + JSONL emission, not scoring. Per-agent runs will mis-label `report.target` but score correctly. Non-blocking. |
| `generate-profile.cjs` defaults `promotionEligible: false` | Set true downstream in guard logic when conditions met | Confirm guard logic fires for non-@improve-agent targets when running first sub-phase |
| `--profiles-dir` default | `assets/target-profiles` (doesn't exist) vs `assets/benchmark-profiles/` (does) | Only matters if a target-specific profile is preferred over `default.json`. Non-blocking for default-profile use. |

### Sub-phase 006 — @ultra-think rename audit

Grep across all `*.md`, `*.json`, `*.txt`, `*.toml`, `*.yaml` for `ultra-think|@ultra-think|ultrathink|ultra_think`:

**ACTIVE surfaces — must rename (~50 files):**
- 4 runtime agent files (`.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`) → 3-4 each (target file + orchestrate.md cross-ref + README.txt)
- CLI runtime skills referring to @ultra-think for delegation: `cli-claude-code/`, `cli-codex/`, `cli-gemini/`, `cli-opencode/` (~30 files combined)
- `system-spec-kit/` references in skill body (count timed out at 20s; estimate 5-10)
- 2 install_guide files
- Top-level `CLAUDE.md` + `AGENTS.md` (1 line each)

**HISTORICAL surfaces — leave frozen (~285 files):**
- `.opencode/specs/` — frozen spec packets and research iterations document `@ultra-think` as the agent name AT THAT TIME
- `.opencode/changelog/` — historical version-tagged entries (5 files)

Rename strategy: rewrite ACTIVE only; leave HISTORICAL untouched as accurate audit trail.

### Sequencing recommendation

Suggested order to minimize cross-agent disruption:

1. **LEAFs first** (no other agents depend on their behavior): `001-context`, `008-deep-review`, `009-deep-research`
2. **Single-purpose specialists** (low coupling): `002-debug`, `003-write`, `007-improve-prompt`
3. **Read-only review** (uses many agents but writes none): `004-review`
4. **Cross-agent rename** (changes the dispatch table): `006-multi-ai-council` (rename @ultra-think first so subsequent agents reference the new name)
5. **Orchestrator last** (highest coupling to all others): `005-orchestrate`

Rationale: `005-orchestrate` references all the other agents in its dispatch tables. If we improve it FIRST, then improve `@context`/`@debug`/etc., the orchestrate body might end up referencing stale agent contracts. Doing orchestrate last means it sees all the freshly-improved agent contracts. Same logic for putting the rename (006) before orchestrate.
<!-- /ANCHOR:preflight -->
