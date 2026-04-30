---
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
title: "Implementation Plan: Stress-Test Rerun v1.0.2"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Pre-flight attestation → 30-cell dispatch → score under v1.0.1 rubric → per-packet verdict synthesis. Reuses v1.0.1 corpus + rubric + dispatch matrix verbatim; adds fork-telemetry assertions + delta classification."
trigger_phrases:
  - "010 stress-test rerun plan"
  - "v1.0.2 sweep plan"
  - "stress-test rerun architecture"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2"
    last_updated_at: "2026-04-28T20:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validator hygiene update"
    next_safe_action: "Run recursive strict validator"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Stress-Test Rerun v1.0.2

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet runs a single-iteration sweep with a pre-flight gate, three dispatch loops (one per CLI), one ablation loop (cli-opencode-pure on S1/S2/S3), per-cell scoring under the frozen v1.0.1 rubric, fork-telemetry assertions per REQ-008..013, and a synthesis pass that aggregates per-cell deltas into per-packet verdicts. The technical context is identical to v1.0.1 (same Bash + Markdown + JSON; same per-cell `{prompt.md, output.txt, meta.json, score.md}` output schema; same concurrency guards). The architectural delta is the v1.0.1 baseline → v1.0.2 delta classification step plus the per-packet verdict aggregation, both authored at synthesis time in `findings.md`.

The MCP advantage signal that v1.0.1 surfaced (cli-opencode topping the rank order via memory_search + cocoindex MCP routing) is the primary thing the v1.0.2 fork-telemetry assertions are designed to make observable rather than just inferable from score deltas. After v1.0.2 ships, every score.md will carry both the rubric-derived score AND the assertion record showing whether the fork-specific contract fields fired.


### Technical Context

This retrospective plan uses the existing packet stack and artifacts already named in the summary. No new implementation surface is introduced by this validator-hygiene update.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- v1.0.1 baseline frozen and readable at `../001-search-intelligence-stress-test/002-scenario-execution/findings.md`
- All three remediation contract specs (003, 004, 005, 006, 007, 008, 009) shipped + dist rebuilt + live probes recorded in their `implementation-summary.md` verification rows
- Daemon online at `0.2.3+spec-kit-fork.0.2.0` (verifiable by `ccc --version`)
- Cocoindex index up-to-date (run `ccc reset && ccc index` once if upgrading from a pre-fork binary; otherwise no-op)
- Three CLIs installed + authenticated: `codex`, `copilot`, `opencode`

### Definition of Done — packet root
- All 6 packet files authored: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`
- `validate.sh --strict` passes on this packet (zero blocking errors, same profile as the other leaf packets in 011)
- 011 parent metadata updated: `spec.md` PHASE DOCUMENTATION MAP row, `description.json` `migration.child_phase_folders`, `graph-metadata.json` `derived.children_ids`, resource-map.md Specs section, HANDOVER-deferred.md §2.1 status
- v1.0.1 baseline preserved with one-line forward pointer at file end

### Definition of Done — sweep execution (downstream of this scaffold)
- Pre-flight (T001-T003) PASSED with all four daemon-attestation probes captured to `./runs/preflight.log`
- All 30 cells produce `{prompt.md, output.txt, meta.json, score.md}` quartets with `meta.json.exit_code = 0`
- Each score.md carries the v1.0.1 4-dim table + Fork-Telemetry Assertions sub-section + Delta-vs-v1.0.1 classification
- Per-packet verdict table populated for packets 003-009 in `findings.md`
- Zero unresolved REGRESSION cells; if any REGRESSION exists, an explanation or escalation accompanies it
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern: Pre-flight gate → parallel dispatch loops → sequential synthesis

```
┌──────────────────────────────────────────────────────────────────┐
│ Pre-flight (T001-T003) — daemon-restart attestation              │
│   ccc --version → +spec-kit-fork.0.2.0                          │
│   memory_context smoke probe → preEnforcementTokens populated   │
│   code_graph_status → freshnessAuthority:"live"                 │
│   memory_causal_stats → all 6 by_relation keys                  │
│   ABORT if any probe stale; otherwise → runs/preflight.log      │
└────────────────────────────┬─────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                              │
   ┌──────────▼──────────┐       ┌───────────▼──────────┐
   │ Dispatch loops       │       │ Concurrency guards   │
   │ (T101-T130)         │       │  cli-copilot ≤ 3      │
   │  cli-codex × 9       │       │  cli-codex fast tier  │
   │  cli-copilot × 9     │       │  cli-opencode general │
   │  cli-opencode × 9    │       └──────────────────────┘
   │  + cli-opencode-pure │
   │    × 3 ablation      │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────────┐
   │ Per-cell artifacts:      │
   │  prompt.md  output.txt   │
   │  meta.json  score.md     │
   └──────────┬──────────────┘
              │
   ┌──────────▼──────────────────────────────────────┐
   │ Scoring (T201-T209)                             │
   │  For each cell:                                  │
   │   1. Score under v1.0.1 4-dim rubric             │
   │   2. Fork-Telemetry Assertions (REQ-008..013)    │
   │   3. Delta vs v1.0.1 baseline → WIN/NEUTRAL/REG  │
   └──────────┬──────────────────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────────┐
   │ Synthesis (T301-T305) → findings.md             │
   │  Executive summary                               │
   │  Per-scenario comparison (v1.0.1 vs v1.0.2)      │
   │  Per-CLI averages side-by-side                   │
   │  Per-packet verdict (packets 003-009)            │
   │  Cross-reference to remediation packets          │
   │  Recommendations (incl. potential v1.0.3 dims)   │
   └──────────────────────────────────────────────────┘
```

### Components

| Component | Purpose | Source |
|-----------|---------|--------|
| Pre-flight probe runner | Validates daemon is loading post-fix dist before sweep starts | New (this packet); reuses probe shapes from `../008-mcp-daemon-rebuild-protocol/references/live-probe-template.md` |
| Dispatch scripts | Per-CLI invocation wrappers + concurrency guards | Mirrored at execution time from `../001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-{codex,copilot,opencode}.sh` |
| Prompt corpus | 9 scenario prompts (S1-S3, Q1-Q3, I1-I3) | Verbatim from `../001-search-intelligence-stress-test/001-scenario-design/scripts/prompts/{S,Q,I}*.md` |
| Run orchestrator | Dispatch loop + per-cell artifact capture | Mirrored at execution time from `../001-search-intelligence-stress-test/001-scenario-design/scripts/run-all.sh` |
| Score template | v1.0.1 4-dim rubric + Fork-Telemetry Assertions + Delta classification | New score.md template lives in this packet's `tasks.md` T201 description |
| Findings synthesizer | Aggregates per-cell scores into per-CLI averages + per-packet verdicts | Authored at synthesis time (T301) |

### Data Flow

```
v1.0.1 corpus (9 prompts)  →  dispatch-cli-{codex,copilot,opencode}.sh  →  CLI subprocess
                                                                              │
                                                                              ▼
                                              {prompt.md, output.txt, meta.json}
                                                              │
                                                              ▼
                                              Per-cell scoring (rubric + assertions + delta)
                                                              │
                                                              ▼
                                                          score.md
                                                              │
                                                              ▼
                                              findings.md synthesis (per-CLI + per-packet)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

This packet executes in 4 sequenced phases; the scaffold pass authors the docs that drive phases 1-4 but does not run them.

### Phase 0: Scaffold (THIS PASS — completed at packet creation)
- Author 6 packet files (spec.md, plan.md, tasks.md, checklist.md, description.json, graph-metadata.json)
- Update parent metadata + HANDOVER + resource-map
- Validate clean

### Phase 1: Pre-flight (T001-T003)
- Run all four daemon-attestation probes
- Capture verbatim probe output to `./runs/preflight.log`
- ABORT if any probe is stale; otherwise continue
- **Hard gate**: no cells dispatch unless pre-flight is green

### Phase 2: Dispatch (T101-T130)
- Mirror dispatch scripts + prompts from v1.0.1 (`../001/001-scenario-design/scripts/`) into this packet's `./scripts/`
- Run 30 cells: 27 base (3 CLIs × 9 scenarios) + 3 ablation (cli-opencode-pure on S1/S2/S3)
- Capture per-cell `{prompt.md, output.txt, meta.json, score.md-skeleton}` to `./runs/{cell}/{cli-N}/`
- Honor cli-copilot concurrency cap 3 + cli-codex `service_tier="fast"` REQUIRED constants

### Phase 3: Score (T201-T209)
- For each cell, populate score.md with:
  - v1.0.1 4-dim rubric table (Correctness 0-2, Tool Selection 0-2, Latency 0-2, Hallucination 0-2; total /8)
  - Fork-Telemetry Assertions sub-section per REQ-008..013 (PASS / FAIL / N-A based on `output.txt` evidence)
  - Delta-vs-v1.0.1 line: cite the v1.0.1 score from ../001/.../findings.md Per-Scenario Comparison + classify WIN / NEUTRAL / REGRESSION
  - Narrative paragraph (free-text observable behavior)

### Phase 4: Synthesize (T301-T305)
- Author `./findings.md` mirroring v1.0.1 findings.md shape:
  - Executive summary
  - Per-scenario comparison table with v1.0.1 baseline + v1.0.2 score + delta + classification columns
  - Per-CLI averages (v1.0.1 vs v1.0.2 side-by-side)
  - Cross-reference table mapping cells back to packets 003-009
  - Per-packet verdict table (PROVEN / NEUTRAL-CEILING / NEUTRAL-FLOOR / NEGATIVE)
  - Novel findings (anything v1.0.2 surfaces that v1.0.1 didn't see)
  - Recommendations (potential v1.0.3 rubric calibration if saturation observed; client-side hallucination guard scope per HANDOVER-deferred §2.4)
- Append 1-line forward-pointer to v1.0.1 findings.md
- Update HANDOVER-deferred §2.1 from `Scaffolded` → `Closed` with closure evidence
- Run `memory_index_scan` for this packet path
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Type | When | Pass Criteria |
|------|------|------|---------------|
| Spec validator strict | Static | Phase 0 (scaffold) | `validate.sh --strict` returns Errors: 0 Warnings: 0 |
| Pre-flight probe smoke | Live MCP | Phase 1 (T001-T003) | All four probes return live values matching post-fix contract |
| Dispatch script smoke | Bash | Phase 2 entry | Each `dispatch-cli-*.sh` runs against a 1-token "hello" prompt and returns exit_code=0 |
| Concurrency guard test | Bash | Phase 2 entry | Trigger 4 simulated cli-copilot invocations; confirm 4th waits until pgrep count drops below 3 |
| Per-cell artifact integrity | Static | Phase 2 exit | All 30 cells have all 4 artifact files (prompt.md, `output.txt`, `meta.json`, score.md-skeleton); no zero-byte outputs |
| Per-cell rubric scoring | Manual | Phase 3 | Each score.md has 4-dim table summing 0-8; no missing dim |
| Fork-telemetry assertion record | Manual | Phase 3 | Each score.md Fork-Telemetry Assertions sub-section has PASS/FAIL/N-A for every applicable REQ-008..013 |
| Delta classification | Manual | Phase 3 | Each score.md cites v1.0.1 baseline + delta + classification (WIN/NEUTRAL/REGRESSION) |
| Per-packet verdict aggregation | Manual | Phase 4 | findings.md per-packet verdict table has 7 rows (003-009) with verdict per row |
| Frozen-baseline invariant | Static | Phase 4 exit | `git diff ../001/.../findings.md` shows insertions only; zero deletions or modifications above the trailing forward-pointer line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### External
- **cli-codex**: `codex exec` binary, configured for model `gpt-5.5`, `service_tier="fast"` REQUIRED
- **cli-copilot**: `copilot` binary, model `gpt-5.4`, max 3 concurrent (REQUIRED guard)
- **cli-opencode**: `opencode` binary, agent `general` (`context` for ablation), model `opencode-go/deepseek-v4-pro`
- **cocoindex daemon**: running at `0.2.3+spec-kit-fork.0.2.0` with index up-to-date

### Internal (this repo)
- **Rubric**: `../001-search-intelligence-stress-test/001-scenario-design/spec.md` §Scoring Rubric v1.0.1 (frozen reference)
- **Corpus**: `../001-search-intelligence-stress-test/001-scenario-design/spec.md` §Scenario Corpus (frozen reference)
- **Dispatch matrix**: `../001-search-intelligence-stress-test/001-scenario-design/spec.md` §Dispatch Matrix (frozen reference)
- **Dispatch scripts + prompts**: `../001-search-intelligence-stress-test/001-scenario-design/scripts/` (template; mirrored at execution time)
- **Live-probe template**: `../008-mcp-daemon-rebuild-protocol/references/live-probe-template.md`
- **v1.0.1 baseline scores**: `../001-search-intelligence-stress-test/002-scenario-execution/findings.md` Per-Scenario Comparison table (rows 23-31)
- **Per-packet contract specs**: `../003-…/`, `../004-…/`, `../005-…/`, `../006-…/`, `../007-…/`, `../008-…/`, `../009-…/`

### Memory (existing rules)
- `feedback_codex_cli_fast_mode`: cli-codex MUST pass `-c service_tier="fast"`
- `feedback_copilot_concurrency_override`: cli-copilot max 3 concurrent
- `feedback_worktree_cleanliness_not_a_blocker`: parallel-track files in working tree are not blockers for this packet
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Trigger conditions
- Pre-flight (T001-T003) detects daemon stale, version mismatch, or any of the four probes fails
- Mid-sweep, ≥3 consecutive cells fail with non-zero exit code (suggests CLI installation regression)
- Synthesis discovers ≥3 REGRESSION cells across packets that share no common cause (suggests rubric drift in the scoring pass, not actual regressions)

### Procedure
1. **Pause the sweep**: `pkill -f dispatch-cli` to terminate any in-flight CLI subprocesses
2. **Capture the partial state**: copy `./runs/` to `./runs.partial-{YYYYMMDD-HHMMSS}/` so artifacts are preserved
3. **Triage**:
   - Daemon issue → re-run `bash .opencode/skill/mcp-coco-index/scripts/install.sh`, restart MCP-owning client, retry T001-T003
   - CLI installation issue → reinstall the offending binary; retry the failing cells only
   - Scoring drift → second-reviewer pass on the affected cells; if ≥2 reviewers disagree, escalate to user with the disagreement evidence
4. **Resume from last green cell**: dispatch only the cells whose score.md is missing or marked `partial`. Do NOT re-dispatch already-scored cells (single-scorer variance would be confounded).
5. **Document the rollback** in `findings.md` Methodology section: which cells were re-dispatched, why, and whether the partial run is included or excluded from the final aggregation.

### Non-rollback escape (graceful failure)
If pre-flight fails AND a fix is not available in this session: ABORT this packet's execution, leave the scaffold in place (Status remains `Draft (scaffold; execution pending)`), update `_memory.continuity.next_safe_action` in spec.md to point at the unblocking action, and surface the issue to the user. The scaffold is durable — execution can resume in a future session once the daemon is verifiably live.
<!-- /ANCHOR:rollback -->
