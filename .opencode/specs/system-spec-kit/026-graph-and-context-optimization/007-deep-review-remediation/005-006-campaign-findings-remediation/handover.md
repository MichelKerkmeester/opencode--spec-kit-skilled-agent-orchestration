---
title: "...ec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/handover]"
description: "Durable handover doc for a multi-phase remediation campaign. Survives context compaction. Lists campaign state, next steps, dispatch commands, exit criteria."
trigger_phrases:
  - "kit"
  - "026"
  - "graph"
  - "and"
  - "context"
  - "handover"
  - "005"
  - "006"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation"
    last_updated_at: "2026-04-22T06:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Campaign complete — all regressions closed"
    next_safe_action: "None — packet closed"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Handover: 007/005 — 006 Campaign Findings Remediation

**READ ME FIRST AFTER ANY CONTEXT COMPACTION.** This handover document contains the full state of an in-progress multi-phase remediation campaign. Follow the checklist below to resume autonomously.

## Session mandate (user directive, 2026-04-21 evening)

User directive verbatim:
> "Run 10 more iterations purely on implementation. If you see them returning almost nothing, broaden or change their review scope. Afterwards when all iterations are done synthesize them in the same doc of last 40 runs so they are all together. Than create subphases inside the remediation phase to tackle all findings in the final synthesis. use gpt 5.4 high fast agent for implementing fixes for it and use copilot only as emergency fallback. I will go to sleep soon so save this task in a way that it survives compaction and you will get all of this done in 1 go"

Operational translation:
1. Monitor the 006 impl-focused campaign already running
2. Broaden any phases that return almost nothing
3. After all 39 phases complete: merge impl findings INTO the existing consolidated-findings.md (don't create a separate doc)
4. Scaffold sub-phases inside 007/005 grouped by theme
5. Dispatch cli-codex gpt-5.4 high fast (primary) to implement; cli-copilot only as fallback
6. Single autonomous run — user will be asleep

## Current state (captured 2026-04-21T20:10Z)

### Campaigns running
- **006 impl campaign** (second pass, code-focused): driver at `/tmp/006-impl-driver.sh`, progress at `/tmp/006-impl-campaign-progress.log`
  - Status: 9/39 completed at checkpoint time
  - Concurrency gate: 3 (now working correctly — fixed pgrep pattern uses `^/opt/homebrew/bin/codex.*exec.*gpt-5.4`)
  - Per-phase output: `<phase>/review-impl/` (not `review/` — separate folder from first pass)
  - Log location: `/tmp/006-impl-campaign-logs/`
  - Estimated wall-clock remaining: ~3 hours

### Completed work (committed + pushed)
- `3768b59e0` Theme 1 scan-findings (3 findings)
- `3751acbe7` 029 scaffold
- `a663cbe78` Themes 2-7 scan-findings (34 findings)
- `9810ad65d` 029 Phases A-E (10 findings)
- `19eb09c3c` Policy deferral close
- `434e283db` Bulk 026 reorg
- `d8c3b7a8c` 009 deep-review (CONDITIONAL)
- `ba0dbea71` 009 5 P1 findings fix
- `7c8fadaf1` Vitest-triage close (578 files, 11,114 tests green)
- `2d2ebae06` + `0fbbaa79a` + `2635c319e` 006 campaign batch snapshots
- `12f2ad74d` First-pass consolidated-findings.md (274 findings, 10 themes)

### First-pass synthesis (already done)
Source report: the 006-campaign consolidated-findings (original file was at `006-search-routing-advisor/review/consolidated-findings` — deleted, no longer present; findings preserved in tasks.md).
Totals: 274 deduped findings (7 P0, 165 P1, 102 P2) across 39 phases.
Biased toward doc drift (~80% spec/metadata, ~20% real code).

### Working-tree state at checkpoint
~1400 pre-existing pending deletions from user's 026 reorg — **DO NOT TOUCH**. Check `git status --short` and skip any file showing ` D ` prefix that wasn't touched by our campaigns.

## RESUME CHECKLIST (run after compaction)

Execute these steps in order. Each step is idempotent.

### Step 1 — Confirm impl campaign completion

```bash
d=$(grep -c "DISPATCH" /tmp/006-impl-campaign-progress.log 2>/dev/null)
c=$(grep -c "COMPLETED \[" /tmp/006-impl-campaign-progress.log 2>/dev/null)
echo "$c / $d of 39"
pgrep -f "^/opt/homebrew/bin/codex.*exec.*gpt-5.4" | wc -l
# If c=39 and pgrep returns 0, campaign is done.
# If c<39 OR pgrep>0, campaign still running — go to Step 2.
```

### Step 2 — Monitor + broaden if needed

If any completed phase has review-impl/review-impl-report.md with 0-1 findings AND the packet's `graph-metadata.json.derived.key_files` lists real `.ts/.py` files:
1. Re-dispatch that phase with broadened scope:
   ```bash
   # See dispatch recipe in §DISPATCH RECIPES below
   ```

### Step 3 — Commit impl campaign artifacts

After all 39 complete:
```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/
git status --short | grep -c "^[AMDR]"
git commit -m "docs(006): impl campaign batch — N phases complete (code-focused second pass)"
git push origin main
```

### Step 4 — Synthesize IMPL into existing consolidated-findings.md

Dispatch codex with prompt in §DISPATCH RECIPES → `synthesize-impl-into-consolidated`.

Target: merge impl findings into the **existing** consolidated-findings.md (append a "Part 2: Implementation Review" section, keep Part 1 intact).

Output location: `006-search-routing-advisor/review/consolidated-findings (archived — findings now in 007/005 tasks.md)` (overwrite in-place, preserving Part 1).

### Step 5 — Scaffold sub-phases inside 007/005

After the merged consolidated-findings.md exists, dispatch codex with prompt in §DISPATCH RECIPES → `scaffold-007-005-subphases`.

Expected output: ~5-10 sub-phases under `007-deep-review-remediation/005-006-campaign-findings-remediation/`, one per theme. Each sub-phase is a Level 3 packet with spec/plan/tasks/checklist/description.json/graph-metadata.json.

### Step 6 — Dispatch remediation codex (parallel sub-phases)

Driver: create `/tmp/007-005-remediation-driver.sh` based on `/tmp/006-impl-driver.sh` pattern. Key settings:
- Concurrency: 3 (codex)
- Executor: `cli-codex --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast"`
- Fallback: cli-copilot ONLY if codex fails repeatedly
- Per-sub-phase: codex implements fixes, writes a summary, runs verification (typecheck + build + vitest)

### Step 7 — Verify + final commit

```bash
cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck
cd .opencode/skill/system-spec-kit/mcp_server && npm run build
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run --reporter=default
```

All green before final commit. Expected: Test Files 578+ / Tests 11,114+ green.

### Step 8 — Update this handover + close tasks

- Update `_memory.continuity.completion_pct` to 100
- Mark tasks #88 + #90 as completed
- Final commit + push

## DISPATCH RECIPES (copy-paste)

### Recipe A: Broaden an under-reviewed phase

```bash
cat > /tmp/codex-broaden-phase.txt <<'EOF'
Re-review phase: __PHASE_PATH__

The prior impl review produced 0-1 findings, but the packet claims real code was
modified. Broaden the scope. Focus on:
- Full source-code read of every file in graph-metadata.json.derived.key_files
- Trace data flow across imports
- Check untested branches via coverage analysis
- Review git history for the actual diff that this packet introduced
- Cross-phase: if this phase's code is consumed by other packets, flag interaction risks

Write to __PHASE_PATH__/review-impl/review-impl-broadened.md (new file).
Same severity + evidence rules as before (code file:line required).
EOF
# Dispatch via cli-codex gpt-5.4 high fast, background, single session
```

### Recipe B: Synthesize impl into existing consolidated-findings.md

```bash
cat > /tmp/codex-synthesize-impl.txt <<'EOF'
Merge findings from all 39 review-impl-report.md files INTO the existing
consolidated-findings.md at:
006-search-routing-advisor/review/consolidated-findings (archived — findings now in 007/005 tasks.md)

DO NOT overwrite Part 1 (original 274 doc-drift findings).
APPEND a new "## Part 2: Implementation-Focused Review (Second Pass)" section containing:
- Executive summary (total impl findings, verdict split)
- Top themes (may overlap Part 1 themes or surface new ones)
- Per-phase verdict table
- Findings by dimension (correctness / security / robustness / testing)
- Cross-phase patterns
- Updated grand-total summary at bottom: "Part 1 + Part 2 combined" with dedupe across both passes

EVIDENCE RULES: impl findings must cite code file:line, not spec docs.
DO NOT run git commit. Orchestrator commits.
AUTHORITY: READ anywhere, WRITE only to that consolidated-findings.md file.
EOF
# Dispatch via cli-codex gpt-5.4 high fast
```

### Recipe C: Scaffold 007/005 sub-phases

```bash
cat > /tmp/codex-scaffold-005.txt <<'EOF'
Read the merged consolidated-findings.md at:
006-search-routing-advisor/review/consolidated-findings (archived — findings now in 007/005 tasks.md)

Group findings by theme (use Part 1's existing themes as base, add new themes from Part 2 if needed). Typical expected: 5-10 themes.

For EACH theme, create a sub-phase folder inside:
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/

Numbering: 001-<theme-slug>, 002-<theme-slug>, ... (zero-padded, lowercase slug)

Each sub-phase is a Level 3 packet with:
- spec.md (Problem Statement, Goals, Non-Goals, Requirements P0/P1/P2 aligned with finding IDs, Acceptance Scenarios with REQUIRED validate.sh + vitest gates)
- plan.md (Phase Sequence, Technical Context, Architecture, per-step implementation notes)
- tasks.md (granular per-finding task list with [ ] checkboxes)
- checklist.md (P1 items with evidence slots, Verification Gates, Regression Guards)
- decision-record.md (cross-cutting ADRs if needed, else placeholder)
- description.json (per spec-kit schema)
- graph-metadata.json (derived.key_files from the finding evidence)

Follow the template structure from:
.opencode/skill/system-spec-kit/templates/level_3/

Key constraints:
- All 6 doc files must pass validate.sh --strict --no-recursive
- First 20 lines of each file MUST contain SPECKIT_TEMPLATE_SOURCE comment
- _memory.continuity block in every frontmatter with required fields (packet_pointer, last_updated_at, last_updated_by, recent_action, next_safe_action, completion_pct)
- ANCHOR tags in spec.md + plan.md + tasks.md + checklist.md + decision-record.md + implementation-summary.md (stub OK)

Also update 007/005's top-level parent docs:
- 007/005/spec.md (campaign overview, aggregate findings count, sub-phase list)
- 007/005/plan.md (phase sequencing, dependency graph)
- 007/005/tasks.md (high-level tasks referencing sub-phases)
- 007/005/checklist.md (aggregate checklist)
- 007/005/description.json
- 007/005/graph-metadata.json

Run validate.sh --strict --no-recursive on EACH created folder. All must pass.
DO NOT run git commit. Orchestrator commits.
EOF
# Dispatch via cli-codex gpt-5.4 high fast
```

### Recipe D: Implement remediation per sub-phase

For each sub-phase under 007/005:
```bash
cat > /tmp/codex-implement-subphase.txt <<'EOF'
Implement all findings in sub-phase: __SUBPHASE_PATH__

Read spec.md + tasks.md + checklist.md + consolidated-findings.md (source findings).

For each P0 then P1 finding in your sub-phase:
1. Read the cited code file(s)
2. Apply the fix per the finding's recommendation
3. Add/update vitest to prove the fix works
4. Run targeted vitest: cd mcp_server && ../scripts/node_modules/.bin/vitest run <test-file>
5. Mark the checklist item [x] with evidence

After all findings: run verification:
- npm run typecheck (exit 0)
- npm run build (exit 0)
- vitest run --reporter=default (baseline preserved + new tests green)
- validate.sh --strict --no-recursive __SUBPHASE_PATH__ (PASSED)

Write __SUBPHASE_PATH__/implementation-summary.md with:
- Status: complete
- What built (files modified)
- Verification output
- Proposed commit message

DO NOT run git commit / git add / git reset. Orchestrator commits.
AUTHORITY: READ anywhere, WRITE only to cited code files + their tests + __SUBPHASE_PATH__/**
EOF
# Dispatch via cli-codex gpt-5.4 high fast, concurrency 3 via /tmp/007-005-driver.sh
```

## Exit criteria (campaign complete)

All of these must hold:
- [ ] 006 impl campaign: 39/39 phases with review-impl-report.md
- [ ] Merged consolidated-findings.md has Part 1 + Part 2 sections, grand total documented
- [ ] 007/005 sub-phases created, all pass `validate.sh --strict --no-recursive`
- [ ] Every sub-phase has an `implementation-summary.md` status=complete
- [ ] Every checklist item marked [x] with evidence
- [ ] Full workspace vitest: ≥578 files, ≥11,114 tests green (baseline preserved)
- [ ] Every sub-phase commit pushed to origin/main
- [ ] This handover updated: completion_pct=100
- [ ] Tasks #88 + #90 marked completed

## Fallback decisions

| Scenario | Action |
|---|---|
| Impl campaign has hung phase (running >30 min) | Kill that codex child; re-dispatch with broadened scope |
| codex rate-limited on remediation | Fall back to cli-copilot: `copilot -p "<prompt>" --model gpt-5.4 --allow-all-tools --no-ask-user --effort high` |
| Sub-phase verification fails after 3 retries | Write blocker.md in sub-phase; continue other sub-phases; surface at final report |
| Compaction mid-campaign | Read this handover + `_memory.continuity`; resume from §RESUME CHECKLIST |
| Test regression introduced | Revert that sub-phase's commit; re-dispatch with explicit regression-guard instruction |

## Quick reference paths

| What | Where |
|---|---|
| Impl driver | `/tmp/006-impl-driver.sh` |
| Impl progress log | `/tmp/006-impl-campaign-progress.log` |
| Impl per-phase logs | `/tmp/006-impl-campaign-logs/` |
| First-pass synthesis | 006-search-routing-advisor/review/consolidated-findings (archived — findings now in 007/005 tasks.md) |
| Prompt templates | `/tmp/006-impl-review-prompt-template.txt` (first impl template) |
| Phase queue (same 39) | `/tmp/006-phase-queue.txt` |
| 006 parent | `.../006-search-routing-advisor/` |
| 007/005 packet root | `.../007-deep-review-remediation/005-006-campaign-findings-remediation/` |
| CLAUDE.md rules | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md` |
| Spec-kit templates | `.../system-spec-kit/templates/level_3/` |
| Validator | `bash .../system-spec-kit/scripts/spec/validate.sh <folder> --strict --no-recursive` |

## Post-compaction read order

After compaction fires, read in this order before making decisions:
1. **This file (handover.md)** — full state
2. `_memory.continuity` block above — machine-readable status
3. `/tmp/006-impl-campaign-progress.log` — live campaign state
4. consolidated-findings.md (Part 1 at minimum) - what problems exist
5. Last 5 git commits — what's already been done

After reading: jump to §RESUME CHECKLIST Step 1 and proceed.
