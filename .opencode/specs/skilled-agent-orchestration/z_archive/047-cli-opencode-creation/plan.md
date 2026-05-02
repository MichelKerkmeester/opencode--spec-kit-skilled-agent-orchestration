---
title: "Implementation Plan: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/plan]"
description: "7-phase Level 3 plan landing the cli-opencode skill, advisor scoring updates, sibling graph edges, changelog bucket, and README touch-ups."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
trigger_phrases:
  - "cli-opencode skill plan"
  - "047-cli-opencode-creation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/047-cli-opencode-creation"
    last_updated_at: "2026-04-26T05:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted Level 3 plan from sibling-skill exploration"
    next_safe_action: "Review the decision-record ADRs, then dispatch /spec_kit:implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0470000000000000000000000000000000000000000000000000000000000002"
      session_id: "047-cli-opencode-creation"
      parent_session_id: "skilled-agent-orchestration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-opencode Skill Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The four existing cli-* skills follow an identical 9-file blueprint (3 root + 2 assets + 4 references). The skill advisor pulls skills from a dual filesystem-walk + SQLite-projection catalog (`projection.ts:188-233`). The changelog system uses flat folder buckets (no numeric prefix) auto-created by `/create:changelog`. The skill-folder README has 8 specific edit points; the root README has 2.

Three streams land in dependency order: (A) the skill folder itself, (B) advisor + sibling-graph integration, (C) changelog + READMEs. The decision-record covers 5 ADRs — the most consequential is ADR-001 (self-invocation guard signal) because the skill operates inside a repo where opencode IS the host runtime. Implementation runs autonomously via cli-codex gpt-5.4 high fast OR via the native general-purpose subagent (Opus) — the operator picks at dispatch time.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Pre-implementation

- All 5 ADRs in `decision-record.md` reviewed and approved by the operator.
- Strict spec validation passes 0/0 on this packet.
- `opencode` v1.3.17+ confirmed at `/Users/michelkerkmeester/.superset/bin/opencode`.

### Per-stream gates

- Stream A (skill folder): `python3 skill_graph_compiler.py --validate-only` passes after every graph-metadata.json change.
- Stream B (advisor + sibling edges): `bash init-skill-graph.sh` completes; `/doctor:skill-advisor:auto` reports no regression on the 4 existing cli-* siblings.
- Stream C (changelog + READMEs): manual visual verification on the 10 edit points; sk-doc DQI score ≥ 90 on the changelog v1.0.0.0.md file.

### Final gates

- All 13 functional requirements (REQ-001 → REQ-013) pass.
- All 5 acceptance scenarios pass against live runtime.
- Strict spec-folder validation 0/0 on this packet.
- `python3 skill_graph_compiler.py --validate-only` passes 0/0.
- `/doctor:skill-advisor:auto` retune produces a non-empty diff for cli-opencode entries and no regression on the existing 4 siblings.
- the cli-opencode v1.0.0.0 changelog file published with sk-doc compact format.
- Both READMEs verified at the 10 specific edit points.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Stream order

| Stream | Tasks | Why this order |
|--------|-------|---------------|
| A. Skill folder | T01-T09 | The 9 files must exist before any sibling edge or scoring table can reference them |
| B. Advisor + sibling edges | T10-T15 | Sibling edges are added AFTER the skill folder so the symmetric round-trip works; scoring tables tuned via `/doctor:skill-advisor` last |
| C. Changelog + READMEs | T16-T26 | Changelog references the live skill version; READMEs reflect final on-disk state |

### Canonical patch surface

| File | Action | Stream |
|------|--------|--------|
| the cli-opencode SKILL document | NEW | A |
| the cli-opencode README | NEW | A |
| the cli-opencode graph-metadata file | NEW | A |
| the cli-opencode prompt_quality_card asset | NEW | A |
| the cli-opencode prompt_templates asset | NEW | A |
| the cli-opencode cli_reference file | NEW | A |
| the cli-opencode integration_patterns file | NEW | A |
| the cli-opencode agent_delegation file | NEW | A |
| the cli-opencode opencode_tools file | NEW | A |
| `.opencode/skill/cli-claude-code/graph-metadata.json` | MOD (sibling edge) | B |
| `.opencode/skill/cli-codex/graph-metadata.json` | MOD (sibling edge) | B |
| `.opencode/skill/cli-copilot/graph-metadata.json` | MOD (sibling edge) | B |
| `.opencode/skill/cli-gemini/graph-metadata.json` | MOD (sibling edge) | B |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:15` | MOD (TOKEN_BOOSTS) | B (optional, ADR-003) |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | REGEN | B |
| `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite` | REGEN | B |
| the cli-opencode v1.0.0.0 changelog file | NEW | C |
| `.opencode/skill/README.md` | MOD (8 edit points) | C |
| `.opencode/README.md` | MOD (2 edit points) | C |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (T01)

Confirm prerequisites: opencode binary version, ADR approvals, baseline test pass on advisor regression suite.

### Phase 2: Skill folder scaffolding (T02-T09)

Create the 9 cli-opencode files matching the universal blueprint. SKILL.md authored last (depends on the four reference files being drafted first).

### Phase 3: Sibling edges + advisor wiring (T10-T15)

Patch the 4 existing cli-* graph-metadata.json files with sibling edges. Optionally add TOKEN_BOOTS entry per ADR-003. Run `init-skill-graph.sh`. Run `/doctor:skill-advisor:auto`.

### Phase 4: Changelog publish (T16-T18)

Run `/create:changelog cli-opencode --bump=major --release` to publish v1.0.0.0. Verify GitHub release if `--release` confirmed.

### Phase 5: README updates (T19-T26)

Apply 8 patches to skill README + 2 patches to root README. Update counts, tables, tree diagrams.

### Phase 6: Verification (T27-T28)

Run all acceptance scenarios. Run strict spec validation. Run advisor regression suite. Run sk-doc DQI on changelog file.

### Phase 7: Closeout

Mark all tasks/checklist items complete with evidence. Populate implementation-summary.md. Final commit + push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Per-stream

- **Stream A:** Smoke test the skill by invoking `Read(.opencode/skill/cli-opencode/SKILL.md)` and verifying advisor recommends it for "delegate to opencode CLI" prompts.
- **Stream B:** `python3 skill_graph_compiler.py --validate-only` after every sibling-edge patch. `/doctor:skill-advisor:auto` retune as the final integration test.
- **Stream C:** Manual visual diff on the 10 README edit points. sk-doc DQI score on changelog v1.0.0.0.md.

### Integration

- Acceptance Scenario 1 (external Claude Code → opencode): set up an isolated Claude Code session, ask it to dispatch via cli-opencode, verify `opencode run` invocation.
- Acceptance Scenario 2 (in-OpenCode parallel session): from inside opencode TUI, ask cli-opencode to spawn a `--share` session.
- Acceptance Scenario 3 (self-invocation refused): from inside opencode, ask for a self-dispatch and verify the smart router refuses with the documented error message.
- Acceptance Scenario 4 (advisor scoring): dispatch the prompt "delegate to opencode CLI for parallel research" and verify cli-opencode tops the scoring lane with confidence ≥ 0.80.
- Acceptance Scenario 5 (docs reflect reality): grep both READMEs and confirm "five CLI skills" / "Skills | 21" / table-row-count = 5.

### Block-final

- Strict spec validation 0/0.
- Advisor regression suite passes baseline (80.5% / 77.5%).
- skill_graph_compiler validate-only passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream:** None — sibling skills already exist.
- **Tooling:** `/create:changelog`, `/doctor:skill-advisor:auto`, `init-skill-graph.sh`, `skill_graph_compiler.py`, sk-doc changelog template.
- **External binary:** `opencode` v1.3.17+ at `/Users/michelkerkmeester/.superset/bin/opencode`.
- **Reference packets:** 046-cli-codex-tone-of-voice (most recent cli-* sibling spec).
- **No external network calls or external services.**
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Per task

Each task produces a focused diff. Failed tasks revert via `git checkout HEAD -- <files>`.

### Per stream

- Stream A rollback: delete `.opencode/skill/cli-opencode/` directory; the four sibling skills still work.
- Stream B rollback: revert sibling-edge patches + TOKEN_BOOTS patch; rerun `init-skill-graph.sh` to rebuild SQLite.
- Stream C rollback: revert README patches; delete `.opencode/changelog/cli-opencode/`; revert any GitHub tag via `git tag -d v1.0.0.0 && git push --delete origin v1.0.0.0` (optional, with operator confirmation).

### Whole packet

Tag the pre-implementation commit: `git tag pre-047-cli-opencode-implementation`. Disaster recovery: `git reset --hard pre-047-cli-opencode-implementation` (operator confirmation required).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
T01 (setup)
  └─ T02-T09 (skill folder scaffolding, mostly independent except SKILL.md depends on references)
       └─ T10-T13 (sibling edge patches, parallel)
            └─ T14 (init-skill-graph.sh)
                 └─ T15 (/doctor:skill-advisor:auto)
                      └─ T16-T18 (changelog publish)
                           └─ T19-T26 (README patches, parallel)
                                └─ T27-T28 (verification + closeout)
```

**Critical path:** T01 → T07 (SKILL.md) → T14 → T15 → T18 → T28 (8 sequential gates).
**Parallel opportunities:** T02-T06 (asset + reference files), T10-T13 (sibling edges), T19-T26 (README patches).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Task group | LOC | Time (autonomous) | Cumulative |
|-----------|-----|-------------------|-----------|
| T01 setup | 0 | 5 min | 5 min |
| T02-T09 skill folder (~600 LOC across 9 files) | 600 | 60 min | 65 min |
| T10-T13 sibling edges | 40 | 15 min | 80 min |
| T14-T15 init-skill-graph + doctor | 0 | 10 min | 90 min |
| T16-T18 changelog publish | 80 | 15 min | 105 min |
| T19-T26 README patches | 30 | 20 min | 125 min |
| T27-T28 verification + closeout | 0 | 15 min | 140 min |
| **Total** | **~750** | **~140 min (~2.5 hours)** | |

Implementation runs autonomously via cli-codex gpt-5.4 high fast (canonical) OR via native general-purpose subagent (Opus). Operator picks at dispatch time.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Failure modes + recovery

- **`opencode` binary missing or version mismatch**: SKILL.md prerequisite check catches before any dispatch. If the operator's machine has v1.4 with breaking flag changes, document drift in references/cli_reference.md and continue.
- **`init-skill-graph.sh` validate-only fails**: Fix the offending graph-metadata.json file based on the error message; rerun.
- **`/doctor:skill-advisor:auto` reports regression on existing cli-* siblings**: Revert the TOKEN_BOOTS entry (ADR-003 fallback) and rerun. If still regressing, lower sibling edge weights from 0.5 to 0.3.
- **`/create:changelog` cannot find sk-doc template**: Use the absolute path explicitly: `--template /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/assets/documentation/changelog_template.md`.
- **Both READMEs drift**: Re-run the patch script idempotently; the patches are line-anchored so they only apply once.
<!-- /ANCHOR:enhanced-rollback -->

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before dispatching the implementation:

- [ ] All 5 ADRs in `decision-record.md` have explicit operator approval
- [ ] Pre-implementation regression baseline captured under `scratch/baseline-regression.log`
- [ ] Pre-implementation commit tagged `pre-047-cli-opencode-implementation`
- [ ] `opencode` v1.3.17+ confirmed at `/Users/michelkerkmeester/.superset/bin/opencode`
- [ ] No active deep-research or deep-review loops blocking the working tree

### Execution Rules

| Stage | Rule |
|-------|------|
| Stream A authoring | Author references first (T03-T06), then assets (T07-T08), THEN SKILL.md (T09) so reference cross-links resolve |
| Stream B sibling-edge patches | Patch all 4 sibling graph-metadata.json files (T12-T15) in a single atomic commit so the round-trip symmetry holds at every reachable git state |
| Stream B advisor wiring | TOKEN_BOOSTS entry (T16) is OPTIONAL per ADR-003 — skip if `grep -rn "opencode" .opencode/ \| wc -l` exceeds 100 |
| Stream B reindex | Run `init-skill-graph.sh` (T17) BEFORE `/doctor:skill-advisor:auto` (T18) to populate the SQLite catalog before retune |
| Stream C changelog | Use `/create:changelog` workflow which auto-loads sk-doc compact template; do NOT hand-author |
| Stream C READMEs | Apply patches in the order documented in REQ-011 (top-to-bottom in the file) so line-anchored patches stay valid |
| Verification | Run all 6 acceptance scenarios end-to-end against live runtime; do NOT mock |

### Authority Matrix

| Decision | Owner |
|----------|-------|
| ADR-001 final detection signal | Implementer (chooses from the 3 layered options based on T01 setup probe) |
| ADR-003 final TOKEN_BOOSTS weight | Implementer (pins after running grep count + checking telemetry) |
| Skill-folder LOC budget | Implementer (band ~450-650 OK; outside requires operator approval) |
| Whether to publish GitHub release | Operator (T20 requires explicit confirmation) |
| Whether to ship hook_contract reference in v1.0 | Deferred per ADR-005 to v1.1.0 |

### Halt Conditions

Stop and ask the operator before proceeding if:

1. `opencode run env` does not expose any `OPENCODE_*` env var (ADR-001 layer 1 fails — need to choose layer 2 or 3 explicitly)
2. The advisor regression suite shows ≥ 2% accuracy drop on existing cli-* siblings after T18 retune
3. `init-skill-graph.sh` fails validation on a sibling graph-metadata.json (cycle, missing field, schema drift)
4. `/create:changelog` cannot find sk-doc template at the canonical path
5. Any of the 5 acceptance scenarios fails AND the failure is not traceable to a single fixable root cause

### Status Reporting Format

After each task in tasks.md completes, the implementer reports a single line:

```
T<NN> done rc=<0|1> next=T<NN+1> notes="<short reason on failure>"
```

After each phase completes, the implementer reports a one-paragraph phase summary:

```
PHASE <NAME> complete: <count> tasks done, <count> failed.
Build: PASS/FAIL. Tests: <pass/total>. Diff stat: <file count>, <line count>.
Next: <next phase> OR halt-and-ask <reason>.
```

After all phases complete, the implementer reports the closeout summary:

```
PACKET 047 SHIPPED: total tasks=<N>, P0/P1/P2 verified=<N>/<N>/<N>,
acceptance scenarios passed=<N>/6, advisor regression delta=<X>%,
DQI changelog=<score>, READMEs aligned=YES/NO.
```

### Blocked Task Protocol

When a task cannot proceed:

1. Mark the task `[B]` in tasks.md (blocked) and record the blocker reason inline.
2. Capture state in scratch/blocker-T<NN>.md with: what was tried, what failed, what input is needed.
3. If the blocker is in the implementer's authority (per Authority Matrix above), make a defensible choice and proceed; document in decision-record.md as an inline ADR amendment.
4. If the blocker is operator-owned (per Authority Matrix), halt the implementation and surface the blocker in the next status report. Do NOT proceed past a Halt Condition.
5. Re-evaluate blocker after every external change (advisor retune, opencode binary update, new ADR clarification).

---
