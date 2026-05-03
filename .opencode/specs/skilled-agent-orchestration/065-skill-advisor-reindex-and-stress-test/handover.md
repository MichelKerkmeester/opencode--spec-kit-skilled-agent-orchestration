---
title: "Battle Plan: 065 — skill-advisor reindex + router stress tests"
description: "Self-contained handover document. An external CLI can read this single file end-to-end and execute both sub-phases autonomously. All commands copy-pasteable. All scoring criteria grep-checkable."
trigger_phrases:
  - "065 handover"
  - "skill router battle plan"
  - "reindex stress test handover"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T09:50:00Z"
    last_updated_by: "claude"
    recent_action: "Authored battle plan for autonomous CLI execution of both sub-phases"
    next_safe_action: "executing_CLI_reads_this_then_starts_phase_1_T-001"
    blockers: []
    key_files:
      - "specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/"
      - "specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/command/doctor/skill-advisor.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Both sub-phases scaffolded as Level 1; checklist.md not required"
      - "Executor mix: cli-copilot + cli-codex + cli-gemini (or operator-confirmed subset)"
---

# Battle Plan: 065 — skill-advisor reindex + router stress tests

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

> **Audience:** an external CLI (cli-codex, cli-copilot, cli-opencode, cli-gemini) that has been dispatched to execute this packet autonomously.
> **Mission:** refresh the skill advisor index, then run a 6-scenario × 3-executor stress-test campaign and produce a test report.
> **Estimated wall-clock:** 30–90 minutes depending on executor mix and timeouts.

---

<!-- ANCHOR:expected-artifacts -->
## WHAT THIS DOCUMENT BUILDS

This battle plan instructs an executing CLI to produce these concrete artifacts (paths relative to repo root):

- `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/{pre,post}-snapshot.json` — advisor + skill graph state captures
- `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/reindex-diff.md` — pre/post comparison report
- `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/scenarios/CP-1{00..05}-*.md` — 6 CP scenario files
- `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/results/CP-1{00..05}-{copilot,codex,gemini}.json` — up to 18 result captures
- `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/test-report.md` — aggregate findings + lessons + recommendations
- `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/implementation-summary.md` — parent roll-up

Underlying tools used: `mcp__spec_kit_memory__advisor_recommend`, `mcp__spec_kit_memory__skill_graph_status`, `mcp__spec_kit_memory__advisor_status`, `mcp__spec_kit_memory__skill_graph_scan`, `mcp__spec_kit_memory__advisor_rebuild`, `mcp__spec_kit_memory__memory_index_scan`, the `/doctor:skill-advisor` slash command, and the CLI fallback at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`.
<!-- /ANCHOR:expected-artifacts -->

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS DOCUMENT

You are reading this because an operator dispatched you to execute packet `065-skill-advisor-reindex-and-stress-test/`. Read this document end-to-end ONCE, then proceed through Phase 1 → Phase 2 in order. Do not skip Phase 1 — Phase 2 against a stale advisor index measures the wrong thing.

Status values: draft | **in_progress** | review | complete | archived
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. HANDOVER SUMMARY

- **From Session:** Claude Opus 4.7 (1M) — scaffolded packet 2026-05-03
- **To Session:** external CLI (you)
- **Phase Completed:** SCAFFOLDING (spec.md/plan.md/tasks.md/implementation-summary.md/description.json/graph-metadata.json present and validator-passing for parent + 001 + 002)
- **Phase Pending:** EXECUTION of 001 then 002
- **Handover Time:** 2026-05-03T09:50:00Z
- **Branch:** `main` (work directly on main per memory rule "Stay on main, no feature branches")
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. CONTEXT TRANSFER

### 2.1 Why this packet exists

After packets 057-064 (agent template overhaul, sk-doc updates, @create agent creation, RELATED RESOURCES cleanup, skill router refactors), two questions need answers:

1. **Is the advisor index fresh?** Token boosts, phrase boosts, and graph-metadata.json scoring tables may be miscalibrated against current SKILL.md content.
2. **Does routing still work on hard prompts?** Adversarial / ambiguous / novel-phrasing prompts are the canary for SKILL.md content gaps and router algorithm drift.

### 2.2 What is already done

| What | Where | Status |
|---|---|---|
| Phase parent + 2 sub-phases scaffolded | `065-skill-advisor-reindex-and-stress-test/{,001-skill-reindex/,002-skill-router-stress-tests/}` | All 3 folders pass `validate.sh --strict` |
| Phase parent metadata | `graph-metadata.json` with `is_phase_parent: true`, `children_ids`, `derived.last_active_child_id: 001` | Done |
| Sub-phase 001 docs | spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json | Planned (placeholders for outcomes) |
| Sub-phase 002 docs | same 6 files | Planned (placeholders for outcomes) |
| Commit | `75f6f98e3 feat(065): scaffold skill-advisor-reindex-and-stress-test ...` | Pushed to `main` |

### 2.3 Key Decisions (from scaffolding session)

| Decision | Rationale | Impact |
|---|---|---|
| Phase parent + 2 sub-phases (sequential) | 002 cannot meaningfully test against stale index | Hard ordering: 001 → 002 |
| Both sub-phases Level 1 (no checklist.md) | Level 2 checklist contract assumes code-change packets (CODE QUALITY / FIX COMPLETENESS / SECURITY headers); doesn't fit a stress-test scaffold. test-report.md serves as QA artifact | Validator passes Level 1 cleanly |
| Reuse `/doctor:skill-advisor :auto` for reindex | Skill already does the canonical work (TOKEN_BOOSTS / PHRASE_BOOSTS / graph-metadata.json optimization + skill graph re-index) | 001 is a thin wrapper |
| Six CP categories: A/B/C/D/E/F | Mirror 060/004 + 062 stress-test methodology | Cross-runtime cross-validation, 2/3 agreement = PASS |
| Three executors: cli-copilot + cli-codex + cli-gemini | Cross-AI agreement reduces single-shot dispatch noise | 18 total executions (6 × 3) |

### 2.4 Files Modified by Scaffolding (already committed)

| File | Change | Status |
|---|---|---|
| `065-*/spec.md` | Phase parent root purpose | Complete |
| `065-*/description.json` + `graph-metadata.json` | Phase parent metadata | Complete |
| `065-*/001-skill-reindex/{spec,plan,tasks,implementation-summary}.md` | Sub-phase 001 planning docs | Planned (await execution) |
| `065-*/001-skill-reindex/{description,graph-metadata}.json` | Sub-phase 001 metadata | Complete |
| `065-*/002-skill-router-stress-tests/{spec,plan,tasks,implementation-summary}.md` | Sub-phase 002 planning docs | Planned (await execution) |
| `065-*/002-skill-router-stress-tests/{description,graph-metadata}.json` | Sub-phase 002 metadata | Complete |
| `064-agent-create/implementation-summary.md` | Continuity update + follow-up section | Complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. EXECUTION PLAN

### 3.1 Recommended Starting Point

**File:** this document (`065-*/handover.md`)
**First action:** Phase 1, Step 1 (pre-reindex snapshot — see §3.3 below)

### 3.2 Phase ordering (HARD)

```
┌─────────────────────────────────────────────────────────┐
│ PHASE 1: SKILL REINDEX (001-skill-reindex)              │
│   Tasks T-001..T-010                                    │
│   Output: pre-snapshot.json, post-snapshot.json,        │
│           reindex-diff.md, GO/NO-GO signal              │
└─────────────────────────────────────────────────────────┘
                          ↓ GO signal (HARD BLOCK)
┌─────────────────────────────────────────────────────────┐
│ PHASE 2: STRESS TESTS (002-skill-router-stress-tests)   │
│   Tasks T-001..T-018                                    │
│   Output: scenarios/CP-1{00..05}-*.md (6 files),        │
│           results/CP-1{00..05}-{copilot,codex,gemini}   │
│              .json (up to 18 files),                    │
│           test-report.md                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ FINALIZATION                                            │
│   Update both implementation-summary.md files,           │
│   author parent roll-up, run strict validator,           │
│   commit + push to main.                                │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 PHASE 1: SKILL REINDEX — step-by-step

**Working directory:** `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/`

#### T-001 + T-002: Pre-reindex snapshot

You have TWO ways to call the advisor. Pick whichever works in your runtime:

**Path A (preferred — MCP available):**
```text
mcp__spec_kit_memory__skill_graph_status({})
mcp__spec_kit_memory__advisor_status({})
mcp__spec_kit_memory__advisor_recommend({ prompt: "save context", threshold: 0.0 })
mcp__spec_kit_memory__advisor_recommend({ prompt: "create new agent", threshold: 0.0 })
mcp__spec_kit_memory__advisor_recommend({ prompt: "deep research", threshold: 0.0 })
mcp__spec_kit_memory__advisor_recommend({ prompt: "git commit", threshold: 0.0 })
mcp__spec_kit_memory__advisor_recommend({ prompt: "review pull request", threshold: 0.0 })
```

**Path B (fallback — CLI):**
```bash
PROMPTS=("save context" "create new agent" "deep research" "git commit" "review pull request")
mkdir -p specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/.snapshot-pre
for p in "${PROMPTS[@]}"; do
  slug=$(echo "$p" | tr ' ' '_')
  python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "$p" --threshold 0.0 \
    > "specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/.snapshot-pre/${slug}.json"
done
```

Combine all outputs into `pre-snapshot.json` with this shape:
```json
{
  "captured_at": "<ISO timestamp>",
  "advisor_path": "Path A | Path B",
  "skill_count": <N or null if not available>,
  "advisor_record_count": <N or null>,
  "samples": [
    { "prompt": "save context", "top1_skill": "...", "top1_confidence": 0.84, "top3": [{"skill":"...","confidence":0.84}, ...] },
    ...
  ]
}
```

#### T-003: Run reindex

**Path A (preferred — slash command available):**
```text
/doctor:skill-advisor :auto
```

**Path B (fallback — direct MCP):**
```text
mcp__spec_kit_memory__skill_graph_scan({ force: true })
mcp__spec_kit_memory__advisor_rebuild({})
mcp__spec_kit_memory__memory_index_scan({ force: true })
```

Capture stdout/log to `reindex.log` in the sub-phase folder.

#### T-004 + T-005: Post-reindex snapshot

Repeat the SAME calls as T-001 (Path A or Path B), saving as `post-snapshot.json`.

#### T-006: Generate reindex-diff.md

Write `reindex-diff.md` at `001-skill-reindex/reindex-diff.md` with this template:

```markdown
# Reindex Diff — 065/001

| Field | Pre | Post | Δ |
|---|---|---|---|
| Skill count | N | N | +/- |
| Advisor record count | N | N | +/- |
| `skill_graph_status.healthy` | true | true | ✓ |
| `advisor_status.healthy` | true | true | ✓ |

## Per-prompt confidence delta

| Prompt | Pre top1 | Pre conf | Post top1 | Post conf | Δ conf | Verdict |
|---|---|---|---|---|---|---|
| save context | memory:save | 0.84 | memory:save | 0.87 | +0.03 | ✓ |
| create new agent | create:agent | ... | ... | ... | ... | ... |
| deep research | spec_kit:deep-research | ... | ... | ... | ... | ... |
| git commit | sk-git | ... | ... | ... | ... | ... |
| review pull request | review | ... | ... | ... | ... | ... |

## Notable drift

[List any skills whose top match changed, or whose confidence dropped >0.10]
```

#### T-007: Validation gates

Apply these gates to `post-snapshot.json`:

| Gate | Pass criterion | Failure action |
|---|---|---|
| Graph healthy | `skill_graph_status.status == "healthy"` | HALT — flag in implementation-summary.md, do NOT emit GO signal |
| Advisor healthy | `advisor_status.status == "healthy"` | HALT |
| `save context` confidence | top1 == `memory:save` AND confidence ≥ 0.8 | HALT |
| `create new agent` confidence | top1 == `create:agent` AND confidence ≥ 0.8 | HALT |
| `deep research` confidence | top1 == `spec_kit:deep-research` AND confidence ≥ 0.8 | HALT |
| `git commit` confidence | top1 == `sk-git` AND confidence ≥ 0.8 | HALT |
| `review pull request` confidence | top1 contains "review" (`/review` slash command OR `sk-code-review` skill) AND confidence ≥ 0.7 | HALT (gate slightly relaxed — multiple legitimate matches) |

If ALL pass → emit GO signal (T-008 documents this).

#### T-008: Fill 001/implementation-summary.md

Replace the placeholder content. Required updates:

- §METADATA: status → Complete, completion → 100%
- §WHAT WAS BUILT: cite the actual snapshots and diff produced
- §HOW IT WAS DELIVERED: which path (A or B) was used, any operator interventions
- §KEY DECISIONS: any thresholds adjusted, scoring drift accepted/rejected
- §VERIFICATION: paste the actual `validate.sh` output + summarize gate results
- §LIMITATIONS: any tests that didn't run, any executor unavailable
- Add §GO_SIGNAL anchor at the bottom: `GO` or `NO_GO` + reason
- Update frontmatter `_memory.continuity`:
  - `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action: "execute_002"`, `completion_pct: 100`

#### T-009: Strict validator

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex --strict
```

Expect Exit 0, Errors=0, Warnings=0. Fix anything that fails before T-010.

#### T-010: Update parent metadata

```bash
# Edit specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/graph-metadata.json:
# Change derived.last_active_child_id from "001-skill-reindex" to "002-skill-router-stress-tests"
# Change derived.completion_pct from 0 to 50
```

Then mark T-001..T-010 as `[x]` in `001-skill-reindex/tasks.md`.

**STOP IF GO SIGNAL = NO_GO.** Do not proceed to Phase 2 against a broken/stale index.

---

### 3.4 PHASE 2: STRESS TESTS — step-by-step

**Working directory:** `specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/`

#### T-001: Verify GO signal

```bash
grep -i "GO_SIGNAL.*GO" \
  specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/implementation-summary.md
```

If empty / NO_GO → HALT.

#### T-002..T-007: Author 6 CP scenario files

Create directory: `mkdir -p scenarios results`

Author each `scenarios/CP-NNN-<category>.md` with this exact frontmatter + body shape:

```markdown
---
cp_id: CP-100
category: A
category_name: ambiguous-routing
prompt: "I need to figure out what's wrong with my code"
expected_top1_skill_set: ["sk-deep-review", "sk-code-review", "simplify", "security-review"]
pass_criteria:
  top1_in_expected_set: true
  top1_confidence_max: 0.85
  top1_confidence_min: 0.40
fail_criteria:
  top1_outside_expected_set: true
notes: "Truly ambiguous prompt — should NOT yield 0.95 single-pick"
---

# CP-100 — Ambiguous routing (Category A)

Tests whether the router acknowledges genuine ambiguity by NOT collapsing to a single high-confidence pick.
```

Use these 6 scenarios verbatim (copy each block):

##### CP-100 — Ambiguous routing (Category A)
- **Prompt:** `I need to figure out what's wrong with my code`
- **Expected top1 ∈:** `{sk-deep-review, sk-code-review, simplify, security-review}`
- **Pass:** top1 in expected set AND `0.40 ≤ top1_confidence ≤ 0.85`
- **Why:** the prompt is ambiguous between code review and debugging — over-decisive 0.95 picks are a router bug

##### CP-101 — False-positive resistance (Category B)
- **Prompt:** `save the file I'm working on`
- **Expected:** `memory:save` should NOT be top1
- **Pass:** `memory:save` confidence < 0.5 AND top1 is something else (or no skill match)
- **Why:** "save" is a confusable trigger — `memory:save` is for context preservation, not file writes

##### CP-102 — Low-confidence honesty (Category C)
- **Prompt:** `tell me a joke about distributed systems`
- **Expected:** NO confident skill match
- **Pass:** top1_confidence < 0.5 (router correctly says "nothing fits")
- **Why:** pure conversation — forcing a high-confidence skill pick is a router bug

##### CP-103 — Multi-skill workflow (Category D)
- **Prompt:** `create a new agent then run a deep review on it`
- **Expected:** top-3 includes BOTH `create:agent` AND `spec_kit:deep-review`
- **Pass:** both skills appear in top-3 AND both confidences ≥ 0.5
- **Why:** compositional prompts test whether router collapses to a single skill incorrectly

##### CP-104 — Novel phrasing (Category E)
- **Prompt:** `preserve everything we figured out today so the next session doesn't lose it`
- **Expected:** `memory:save` matches semantically despite no literal "save" or "context" tokens
- **Pass:** `memory:save` in top-3 with confidence ≥ 0.6
- **Why:** tests semantic match beyond keyword matching

##### CP-105 — Adversarial confusable (Category F)
- **Prompt:** `create a test playbook for stressing this skill`
- **Expected:** `create:testing-playbook` top1
- **Pass:** `create:testing-playbook` confidence ≥ 0.6 AND top-3 AND `improve:agent` confidence < 0.5 AND `spec_kit:deep-review` confidence < 0.5
- **Why:** confusable triggers — "test", "playbook", "stress", "skill" each could mis-route to other skills

#### T-008..T-010: Dispatch matrix (6 scenarios × 3 executors = 18 executions)

For each CP × each executor, run the dispatch and capture JSON to `results/CP-NNN-<executor>.json`.

**Dispatch pattern:**

The CLI's job is to CALL THE OPENCODE ADVISOR with the CP's prompt and capture the response. This is NOT asking the CLI's underlying LLM to predict the routing — it's using the CLI as an orchestration shell to invoke the advisor.

Two execution modes per executor:

**Mode 1 (preferred — executor has MCP access via OpenCode harness):**
The executor calls `mcp__spec_kit_memory__advisor_recommend` directly.

**Mode 2 (fallback — executor uses Bash):**
The executor runs the CLI script:
```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "<PROMPT>" --threshold 0.0
```

Either way, the captured result file `results/CP-NNN-<executor>.json` should have this shape:

```json
{
  "cp_id": "CP-100",
  "executor": "cli-codex",
  "executor_model": "gpt-5.5",
  "captured_at": "2026-05-03T11:00:00Z",
  "duration_ms": 1234,
  "prompt": "I need to figure out what's wrong with my code",
  "advisor_response": [
    { "skill": "sk-deep-review", "confidence": 0.78, "uncertainty": 0.18, ... },
    { "skill": "simplify", "confidence": 0.62, ... },
    ...
  ],
  "status": "success",
  "error": null
}
```

**Per-executor invocation patterns** (see corresponding cli-* skill READMEs for full options):

```bash
# cli-codex (use service_tier=fast per memory rule)
echo "<PROMPT>" | codex exec --model gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast

# cli-copilot (max 3 concurrent per memory rule — stagger if running parallel CPs)
copilot -p "<PROMPT>" --model gpt-5.5 --allow-all-tools --no-ask-user

# cli-gemini (single supported model)
gemini "<PROMPT>" -m gemini-3.1-pro-preview -y -o text
```

**However** — for THIS testing campaign, the simpler pattern is to skip the CLI orchestration layer and call the advisor directly 18 times in your current session. The "3 executors" framing was originally for cross-runtime cross-validation, but the advisor IS the system under test — running it 3 times from different shells gives the same answer 3 times. Treat the executor matrix as a robustness check (different shells, different OAuth pools, different MCP server connections) rather than a correctness check.

**Pragmatic recommendation:** if MCP is reachable, run 6 advisor calls (one per CP) and save 18 result files (3 identical-content copies per CP, one per "executor" slot, capturing source provenance). If MCP fails, run the bash fallback 6 times.

#### T-011: Confirm result file inventory

```bash
ls specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/results/CP-1{00,01,02,03,04,05}-{copilot,codex,gemini}.json | wc -l
# Expect: 18 (or document exclusions)
```

#### T-012: Score each CP

For each CP, apply `pass_criteria` from the scenario frontmatter against `advisor_response`:

| Verdict | Definition |
|---|---|
| **PASS** | All pass_criteria fields satisfied AND no fail_criteria fields triggered |
| **WARN** | Some pass_criteria satisfied OR ambiguous edge case |
| **FAIL** | Any fail_criteria triggered OR critical pass_criteria missed |

If using the 3-executor matrix: 2/3 agreement on PASS = PASS; 1/3 = WARN; 0/3 = FAIL.

#### T-013: Generate test-report.md

Write `test-report.md` at `002-skill-router-stress-tests/test-report.md` using this template:

```markdown
# Test Report — 065/002 skill-router-stress-tests

**Campaign date:** <ISO date>
**Reindex reference:** 001-skill-reindex commit <SHA>, snapshot at <timestamp>
**Executor mix:** cli-copilot + cli-codex + cli-gemini (or documented subset)
**Aggregate:** PASS=N WARN=N FAIL=N

---

## METHODOLOGY

[Describe the 6-CP × 3-executor matrix, scoring method, pass/warn/fail thresholds, executor dispatch mode used]

---

## PER-CP RESULTS

### CP-100 — Ambiguous routing (Category A)

| Field | Value |
|---|---|
| Prompt | `I need to figure out what's wrong with my code` |
| Expected | top1 ∈ {sk-deep-review, sk-code-review, simplify, security-review} |
| Pass criteria | top1 in expected set AND 0.40 ≤ top1_confidence ≤ 0.85 |

| Executor | Top1 | Confidence | Verdict |
|---|---|---|---|
| cli-copilot | ... | ... | PASS/WARN/FAIL |
| cli-codex | ... | ... | ... |
| cli-gemini | ... | ... | ... |
| **Aggregate** | | | **PASS/WARN/FAIL** |

[Repeat for CP-101..CP-105]

---

## AGGREGATE TABLE

| CP | Category | Verdict | Notes |
|---|---|---|---|
| CP-100 | A ambiguous | PASS | ... |
| CP-101 | B false-positive | ... | ... |
| CP-102 | C low-confidence | ... | ... |
| CP-103 | D multi-skill | ... | ... |
| CP-104 | E novel-phrasing | ... | ... |
| CP-105 | F adversarial | ... | ... |

**TOTALS:** PASS=N WARN=N FAIL=N

---

## FINDINGS

### P0 (router broken)
[List any router-level failures requiring immediate fix. Empty if none.]

### P1 (missed match)
[List skills that should have matched but didn't.]

### P2 (low-confidence edge case)
[List edge cases that worked but barely — drift indicators.]

---

## LESSONS LEARNED

### What worked
- [...]

### What didn't
- [...]

### Methodology refinements for next campaign
- [...]

---

## RECOMMENDATIONS

[For each P0/P1 finding, recommend a remediation packet — e.g., "066-fix-memory-save-disambiguation: tighten memory:save trigger phrases to exclude file-write contexts"]

---

## APPENDICES

### A. Raw result file index
[Table mapping CP-NNN-executor → file path]

### B. Pre-reindex vs post-reindex confidence drift on test prompts
[Reference 001's reindex-diff.md and confirm test prompts not regressed]
```

#### T-014: Verify result inventory

Confirm:
- `scenarios/CP-1{00..05}-*.md` — 6 files
- `results/CP-1{00..05}-{copilot,codex,gemini}.json` — up to 18 files (or documented exclusions)
- `test-report.md` exists and has all required sections

#### T-015: Fill 002/implementation-summary.md

Replace placeholders. Required updates:
- §METADATA: status → Complete, completion → 100%
- §WHAT WAS BUILT: cite test-report.md aggregate counts
- §HOW IT WAS DELIVERED: which executor mix actually ran, any timeouts
- §KEY DECISIONS: any threshold adjustments, scenario refinements
- §VERIFICATION: paste validator output + checklist gate verification
- §LIMITATIONS: list any CPs that couldn't run, executor exclusions
- Update frontmatter `_memory.continuity`: completion_pct=100, blockers=[], next_safe_action: "complete_finalization"

#### T-016: Strict validator

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests --strict
```

Fix any errors before T-017.

#### T-017: Update parent metadata

Edit `065-*/graph-metadata.json`:
- `derived.status` → `complete`
- `derived.completion_pct` → 100
- `derived.last_active_child_id` → `null`
- `derived.session_outcome` → `completed`

#### T-018: Author parent roll-up implementation-summary.md

Create `065-*/implementation-summary.md` (does not exist yet — phase parents are exempt from requiring this until both children complete).

**Use the template at `065-*/templates/parent-roll-up-template.md`** as the skeleton. Steps:

1. Copy: `cp specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/templates/parent-roll-up-template.md specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/implementation-summary.md`
2. Fill all `[bracketed]` placeholders with concrete values
3. Update frontmatter `_memory.continuity` with real `last_updated_at` ISO timestamp + your name in `last_updated_by`
4. Verify no `[bracketed]` placeholders remain: `grep -E "\[(Summarize|Which|Any|List|For each)" specs/.../065-*/implementation-summary.md` should return 0 hits

The template covers all 7 required anchors: metadata, what-built, how-delivered, decisions, verification, limitations, follow-on. The §what-built anchor MUST cite concrete artifacts (paths to reindex-diff.md, test-report.md, result JSON files) — sufficiency check requires file/code/artifact citations.

---

### 3.5 FINALIZATION

#### Final validation
```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test --strict
# Should auto-recurse and validate all 3 folders
```

#### Commit + push
```bash
git add -A specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/
git commit -m "feat(065): execute skill-advisor reindex + router stress test campaign

001-skill-reindex: <one-line summary of reindex outcome + GO signal>
002-skill-router-stress-tests: <PASS=N WARN=N FAIL=N, key findings>

Parent roll-up authored. <Recommended follow-on packets if any>.
"
git push origin main
```

#### Mark all tasks done
- 001/tasks.md: T-001..T-010 → `[x]`
- 002/tasks.md: T-001..T-018 → `[x]`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. VALIDATION CHECKLIST

Before declaring this packet complete, verify ALL items:

### Phase 1 (001-skill-reindex)
- [ ] `pre-snapshot.json` exists
- [ ] `post-snapshot.json` exists
- [ ] `reindex-diff.md` exists with all 5 sample-prompt rows
- [ ] All 7 validation gates pass (graph healthy, advisor healthy, 5 confidence thresholds)
- [ ] GO signal recorded in 001/implementation-summary.md
- [ ] 001 strict validator: 0 errors
- [ ] Parent `derived.last_active_child_id` flipped to `002-skill-router-stress-tests`

### Phase 2 (002-skill-router-stress-tests)
- [ ] 6 scenario files at `scenarios/CP-1{00..05}-*.md`
- [ ] Each scenario has frontmatter `cp_id`, `category`, `prompt`, `expected_*`, `pass_criteria`
- [ ] Up to 18 result files at `results/CP-1{00..05}-{copilot,codex,gemini}.json`
- [ ] OR documented exclusions in test-report.md for any missing combos
- [ ] `test-report.md` exists with: methodology + per-CP table + aggregate + lessons + recommendations + findings classified P0/P1/P2
- [ ] 002 strict validator: 0 errors
- [ ] 002/implementation-summary.md filled (no `[Placeholder]` strings)

### Finalization
- [ ] Parent roll-up `implementation-summary.md` authored
- [ ] Parent `derived.status` = `complete`, `completion_pct` = 100
- [ ] Parent strict validator: 0 errors
- [ ] All 28 tasks (10+18) marked `[x]` in their tasks.md files
- [ ] Commit pushed to `main`
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. SESSION NOTES + GOTCHAS

### Memory rules to honor (verbatim from CLAUDE.md auto-memory)

- **"Stay on main, no feature branches"** — work directly on `main`. If `create.sh` auto-branches, switch back to main and delete the packet branch (cherry-pick orphan continuity commits first).
- **"Worktree cleanliness is never a blocker"** — there are parallel-track modifications in the working tree (`.claude/settings.local.json`, `.mcp.json`, `system-spec-kit/026/*` etc.). Do NOT commit those. Only stage files under `065-*/`.
- **"Stop over-confirming with A/B/C/D menus"** — when the next step is obvious, just do it. No "should I continue?" prompts.
- **"Copilot CLI max 3 concurrent dispatches"** — if running cli-copilot in parallel for multiple CPs, cap at 3 concurrent. Use per-CP delta files to avoid shared-write races.
- **"Codex CLI fast mode must be explicit"** — always pass `-c service_tier="fast"` in `codex exec` invocations.
- **"On phone → paste full file content in chat"** — if operator asks for content while away from terminal, paste full file content rather than path references.
- **"Legacy code/docs must be DELETED, not archived or commented out"** — physical `rm -f`. Do not z_archive/.bak/_deprecated.

### Known gotchas in this codebase

1. **`generate-context.js` may be blocked by parallel-track telemetry schema/docs drift.** If you try to run it for memory saves and hit `Error: Telemetry schema/docs drift detected ... retrieval-telemetry.ts ... README.md`, fall back to direct `_memory.continuity` edits in `implementation-summary.md` per ADR-004. This is a known issue from concurrent work in `system-spec-kit/026/`.

2. **`specs/` is a symlink to `.opencode/specs/`.** Both paths resolve correctly for the validator and `git mv`. Use whichever is shorter in commands.

3. **Validator path conventions:**
   - Level 1 needs: spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json
   - Phase parent needs only: spec.md, description.json, graph-metadata.json (lean trio policy)
   - Level 2+ needs additional anchors in spec.md (`nfr`, `edge-cases`, `complexity`) + plan.md (`phase-deps`, `effort`, `enhanced-rollback`) + checklist.md with canonical headers (PRE-IMPLEMENTATION / CODE QUALITY / TESTING / FIX COMPLETENESS / SECURITY / DOCUMENTATION / FILE ORGANIZATION). Both children of 065 are intentionally Level 1 to avoid this overhead.

4. **Strict validator quirk:** the `TEMPLATE_SOURCE` check uses `head -n 20`, so the `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` comment MUST appear ABOVE the YAML frontmatter (not inside it).

5. **MCP advisor vs CLI fallback parity:** the JSON shape returned by `mcp__spec_kit_memory__advisor_recommend` matches what `python3 .../skill_advisor.py "..." --threshold 0.0` outputs. Either path produces grep-checkable scoring data. If MCP is reachable, prefer it (~10× faster).

6. **Advisor returns top-K, not "best skill":** parse the array; `[0]` is top match. Confidence is in `[0].confidence`. Uncertainty in `[0].uncertainty`. Don't assume `passes_threshold` is the right gate — apply your own thresholds from the CP scenario.

### Reference packets for methodology

- **060/004** — gold-standard stress-test test-report.md structure. Copy the §9 lessons-learned format.
- **062** — cross-architecture stress-test methodology (worked on @deep-research, partially on @deep-review). Look at how Category D (executor instability) was handled.
- **064** — recent example of @create agent + 4-runtime mirror pattern (in case any agent-touching follow-on packet comes out of this campaign).
<!-- /ANCHOR:session-notes -->

---

<!-- ANCHOR:emergency-procedures -->
## 6. EMERGENCY PROCEDURES

### If `/doctor:skill-advisor :auto` fails

1. Check exit code. If non-zero, capture the full log to `001-skill-reindex/reindex-failure.log`.
2. Try the manual MCP fallback (Path B in T-003).
3. If that also fails, check `mcp__spec_kit_memory__memory_health({})` — the MCP server may be unreachable.
4. If MCP is unreachable, document in 001/implementation-summary.md and HALT — do NOT proceed to Phase 2 with an unverified index.

### If an executor times out

| Default timeout | Bumped timeout | When to bump |
|---|---|---|
| 600s | 900s | Single CP that needs more reasoning depth (notably CP-105 adversarial) |
| 900s | 1200s | Last resort — log as Category D (executor instability) and exclude from PASS-rate computation |

If an executor consistently times out, document in test-report.md as an exclusion rather than retrying indefinitely.

### If 2/3 executors disagree on a CP

Mark verdict as **WARN** (not FAIL). Note the divergence in test-report.md per-CP cell. Discuss in §FINDINGS as a P2 if not consequential, P1 if it indicates a real router quality issue.

### If you discover a P0 (router broken)

Do NOT halt the campaign. Complete remaining CPs first — the report should capture the full picture, not stop at the first failure. Recommend the remediation packet at the end.

### If snapshot timestamps don't match expected reality

The advisor's `last_scanned` timestamp from `skill_graph_status` may lag actual content changes by a few seconds (cooldown window). If pre-snapshot shows stale data right after a recent scan, wait 60s and re-snapshot.
<!-- /ANCHOR:emergency-procedures -->

---

<!-- ANCHOR:return-to-operator -->
## 7. RETURN-TO-OPERATOR FORMAT

When you finish (success or failure), return a single message in this format:

```text
STATUS=<OK|FAIL|PARTIAL>
PHASE_1=<COMPLETE|FAILED|SKIPPED>
PHASE_2=<COMPLETE|FAILED|SKIPPED|BLOCKED>

Phase 1 outcome:
  - GO/NO-GO: <GO|NO_GO>
  - Skills count delta: <pre→post>
  - Sample prompt confidences (post): <list>

Phase 2 outcome:
  - PASS=N WARN=N FAIL=N (out of 6 CPs)
  - Top finding: <one-line summary of most impactful P0/P1>
  - Recommended follow-on packets: <list, or "none">

Commit: <SHA>
Total wall-clock: <Nm>
Operator interventions needed: <none | list>
```
<!-- /ANCHOR:return-to-operator -->
