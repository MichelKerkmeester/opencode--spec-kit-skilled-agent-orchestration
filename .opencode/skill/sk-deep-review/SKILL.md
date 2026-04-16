---
name: sk-deep-review
description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search]
# Note: Task tool is for the command executor (loop management). The @deep-review agent itself does NOT have Task (LEAF-only).
# No WebFetch: review is code-only and read-only. No external resource fetching.
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.3.2.0
---

<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code-review` instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code-opencode` or `/spec_kit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/spec_kit:deep-review` command. The command's YAML workflow owns state, dispatch, and convergence.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize iterations
- Invoke cli-copilot / cli-codex / cli-gemini / cli-claude-code directly in a loop to simulate iterations
- Manually write iteration prompts to `/tmp` and dispatch them via `copilot -p`
- Dispatch the `@deep-review` LEAF agent via the Task tool for iteration loops (the agent is LEAF — a single iteration — and MUST be driven by the command's workflow)
- Skip the state machine: `deep-review-state.jsonl`, `deep-review-config.json`, `deltas/`, `prompts/`, `logs/`
- Manage iteration state outside `{spec_folder}/review/` or `{spec_tree_root}/review/{phase_subfolder}/`

**ALWAYS:**
- Invoke via `/spec_kit:deep-review :auto` or `/spec_kit:deep-review :confirm`
- Let the command's YAML workflow own dispatch (auto: `assets/spec_kit_deep-review_auto.yaml`)
- Let `scripts/reduce-state.cjs` be the SINGLE state writer
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'review')` from `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical review root

**If the user specifies an executor CLI** ("use cli-copilot gpt-5.4 high"), that selects the HOW — the executor still runs INSIDE the command's workflow. The CLI executor is a tool inside the command, not a replacement for the command.

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
LOCAL_REFS   = SKILL_ROOT / "references"
LOCAL_ASSETS = SKILL_ROOT / "assets"
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "code audit", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/loop_protocol.md",
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
        "assets/deep_review_strategy.md",
    ],
    "REVIEW_ITERATION":   [
        "references/loop_protocol.md",
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_REPORT":      [
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND":         [
        "references/loop_protocol.md",
        "references/state_format.md",
        "references/convergence.md",
    ],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active
```

### Phase Detection

Detect the current review phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists in `review/` | Loop protocol, state format, review contract |
| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, review contract |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Review contract, state format |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-review "target"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-review command  │  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (review-report)   │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-review (LEAF agent)    │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE review cycle    │
    │  - Writes: findings + state      │
    │  - Tools: Grep, Read, Glob, etc │
    │  - No WebFetch (code-only)      │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-review-config.json         │  Persists across iterations
    │  deep-review-state.jsonl        │
    │  deep-review-strategy.md        │
    │  deep-review-dashboard.md       │
    │  review/iterations/             │
    │    iteration-NNN.md             │
    │  review/review-report.md        │
    └─────────────────────────────────┘
```

### State Packet Location

The review state packet always lives in the spec tree root's `review/` folder. Root-spec targets use `{spec_folder}/review/`. Child-phase targets resolve `{spec_tree_root}/review/{phase-subfolder}/`, where `{phase-subfolder}` is the child phase path joined with hyphens.

```text
review/
  [phase-subfolder/]                 # Present only when the target spec is a nested child phase
    deep-review-config.json          # Immutable after init: review parameters
    deep-review-state.jsonl          # Append-only review iteration log
    deep-review-strategy.md          # Review dimensions, findings, next focus
    deep-review-dashboard.md         # Auto-generated review dashboard
    .deep-review-pause               # Pause sentinel checked between iterations
    review-report.md                 # Final review report (synthesis output)
    iterations/
      iteration-NNN.md               # Write-once review findings per iteration
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-review
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Select ONE dimension (from strategy "Next Focus")
  |                                         3. Review target code (read-only, 3-5 actions)
  |                                         4. Write iteration-NNN.md (P0/P1/P2 findings)
  |                                         5. Update deep-review-strategy.md
  |                                         6. Append deep-review-state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile review/review-report.md (9 sections, verdict)
  |
Save --> generate-context.js --> verify memory artifact
```

### Review Dimensions

The four primary review dimensions (configured in `assets/review_mode_contract.yaml`):

| Dimension | Focus | Key Questions |
|-----------|-------|---------------|
| **Correctness** | Logic, behavior, error handling | Does the code do what it claims? Are edge cases handled? |
| **Security** | Vulnerabilities, exposure, trust boundaries | Are inputs validated? Are credentials exposed? |
| **Spec-Alignment / Traceability** | Spec vs. implementation fidelity | Does code match spec.md? Are all planned items present? |
| **Completeness / Maintainability** | Coverage, dead code, documentation | Are TODOs resolved? Is the code self-documenting? |

### Lifecycle + Reducer Contract

Review mode is lineage-aware. Every packet uses canonical review-mode artifacts:
- `deep-review-config.json`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-strategy.md`
- `deep-review-dashboard.md`
- `.deep-review-pause`

Runtime-supported lifecycle modes:
- `new` — first run against the spec folder
- `resume` — continue the active lineage; appends a typed `resumed` JSONL event with `sessionId`, `parentSessionId`, `lineageMode`, `continuedFromRun`, `generation`, `archivedPath` (null), `timestamp`
- `restart` — archive the existing `review/` tree under `review_archive/{timestamp}/`, mint a fresh `sessionId`, increment `generation`, and append a typed `restarted` JSONL event with the same field set plus a non-null `archivedPath`

Deferred (reserved, not runtime-supported):
- `fork` — earlier drafts described a sibling-lineage branch; the workflow no longer exposes this option
- `completed-continue` — earlier drafts described snapshotting `review-report-v{generation}.md`; not runtime-wired

See `references/loop_protocol.md §Lifecycle Branches (current release)` for the canonical event contract and the rationale for the retraction.

Required lineage fields on config and iteration records:
- `sessionId`
- `parentSessionId`
- `lineageMode`
- `generation`
- `continuedFromRun`
- `releaseReadinessState`

Reducer contract:
- Inputs: `latestJSONLDelta`, `newIterationFile`, `priorReducedState`
- Outputs: `findingsRegistry`, `dashboardMetrics`, `strategyUpdates`
- Metrics: `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore`

### Severity Classification

| Severity | Criteria | Blocking |
|----------|----------|---------|
| **P0** | Correctness failure, security vulnerability, spec contradiction | Yes — blocks PASS verdict |
| **P1** | Degraded behavior, incomplete implementation, missing validation | Conditional — triggers CONDITIONAL verdict |
| **P2** | Style, naming, minor improvements, documentation gaps | No — PASS with advisories |

### Verdicts

| Verdict | Condition |
|---------|-----------|
| **PASS** | No P0/P1 findings; P2 findings recorded as advisories (`hasAdvisories: true`) |
| **CONDITIONAL** | P1 findings present; remediation plan included in report |
| **FAIL** | Any P0 finding confirmed after adversarial self-check |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. **Read state first** — Agent must read JSONL and strategy.md before any review action.
2. **One dimension focus per iteration** — Pick ONE review dimension from strategy.md "Next Focus"; never mix dimensions in a single iteration.
3. **Externalize findings** — Write to `iteration-NNN.md` with P0/P1/P2 classifications; never hold findings only in agent context.
4. **Update strategy** — Append dimension coverage to strategy.md "Covered" list, update "Next Focus" for the subsequent iteration.
5. **Report newInfoRatio** — Every iteration JSONL record must include `newInfoRatio`.
6. **Respect exhausted approaches** — Never re-review already-covered file+dimension combinations listed in strategy.md "Exhausted".
7. **Cite sources** — Every finding must cite `[SOURCE: file:line]` with actual code evidence; inference-only findings are not accepted.
8. **Use generate-context.js for memory saves** — Never manually create memory files; always use the script.
9. **Review target files are read-only** — Never modify any file under review; observation and reporting only.
10. **Run adversarial self-check on P0 findings** — Re-read the cited code before recording a P0 finding to confirm severity is genuine.
11. **Report severity counts in every JSONL record** — `findingsSummary` (cumulative) and `findingsNew` (this iteration) are required fields.
12. **Quality guards must pass before convergence** — Evidence completeness, scope alignment, no inference-only findings, severity coverage, and cross-reference checks must all pass (see `references/convergence.md` Section 10.4) before STOP can trigger.

### NEVER

1. **Dispatch sub-agents** — `@deep-review` is LEAF-only; it cannot dispatch additional agents.
2. **Hold findings in context** — Write everything to iteration files; context is discarded after each dispatch.
3. **Exceed TCB** — Target 8-11 tool calls per iteration (max 12); breadth over depth per cycle.
4. **Ask the user** — Autonomous execution; the agent makes best-judgment decisions without pausing.
5. **Skip convergence checks** — Every iteration must be evaluated against convergence criteria before the next dispatch.
6. **Modify config after init** — `deep-review-config.json` is read-only after initialization.
7. **Modify files under review** — The review loop is observation-only; no code changes during audit.
8. **Use WebFetch** — Review is code-only; no external resource fetching is permitted.

### Iteration Status Enum

`complete | timeout | error | stuck | insight`

- `insight`: Low newInfoRatio but important finding that changes the verdict trajectory.

### ESCALATE IF

1. **3+ consecutive timeouts** — Infrastructure issue; pause loop and report to user.
2. **State file corruption** — Cannot reconstruct iteration history from JSONL or iteration files.
3. **All dimensions covered with P0 findings remaining** — Human sign-off required before shipping.
4. **Security vulnerabilities discovered in production code** — Escalate immediately; do not defer to report synthesis.
5. **All recovery tiers exhausted** — No automatic recovery path remaining in convergence protocol.

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core Documentation

Local review-specific protocol documents:

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [loop_protocol.md](references/loop_protocol.md) | Review loop lifecycle | Init, iterate, synthesize, save |
| [state_format.md](references/state_format.md) | Review state schemas | JSONL + strategy + config |
| [convergence.md](references/convergence.md) | Review convergence | `shouldContinue_review()`, quality guards |
| [quick_reference.md](references/quick_reference.md) | Review cheat sheet | Commands, tuning, troubleshooting |

### Local Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [deep_review_config.json](assets/deep_review_config.json) | Review loop configuration | Copied to `{spec_folder}/review/` during init |
| [deep_review_strategy.md](assets/deep_review_strategy.md) | Strategy file template | Copied to `{spec_folder}/review/` during init |
| [deep_review_dashboard.md](assets/deep_review_dashboard.md) | Dashboard template | Auto-generated each review iteration |
| [review_mode_contract.yaml](assets/review_mode_contract.yaml) | Review contract | Dimensions, gates, verdicts, quality guards |

### Agent Runtime Paths

| Runtime | Path |
|---------|------|
| OpenCode / Copilot | `.opencode/agent/deep-review.md` |
| Claude | `.claude/agents/deep-review.md` |
| Codex | `.codex/agents/deep-review.toml` |

### Review YAML Workflows

| Mode | Path |
|------|------|
| Auto (unattended) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| Confirm (step-by-step) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Loop Completion

- Review loop ran to convergence or max iterations
- All configured review dimensions have at least one iteration of coverage
- All state files present and consistent (`config.json`, `state.jsonl`, `strategy.md`)
- `review/review-report.md` produced with all 9 sections
- Canonical continuity surfaces updated via `generate-context.js`

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|---------|
| **Pre-loop** | Config valid, strategy initialized, state log created | Yes |
| **Per-iteration** | `iteration-NNN.md` written, JSONL appended, strategy updated | Yes |
| **Post-loop** | `review-report.md` exists with verdict and all sections | Yes |
| **Quality guards** | Evidence completeness, scope alignment, no inference-only, severity coverage, cross-reference checks | Yes |
| **Adversarial recheck** | All P0 findings re-confirmed via adversarial self-check | Yes |
| **Continuity save** | Canonical packet continuity surfaces updated via `generate-context.js` | No |

### Review Mode Success Criteria

| Criteria | Requirement |
|----------|-------------|
| Dimension coverage | All configured review dimensions reviewed with file-cited evidence |
| Finding citations | All P0/P1 findings include `[SOURCE: file:line]` citations |
| Report completeness | `{spec_folder}/review/review-report.md` has all 9 sections |
| Verdict justification | PASS/CONDITIONAL/FAIL verdict justified with specific findings; PASS includes `hasAdvisories: true` metadata when P2 findings exist |
| Adversarial recheck | Every P0 finding confirmed via adversarial self-check before final report |

### Convergence Report

Every completed loop produces a convergence report (embedded in `review-report.md` and JSONL):
- Stop reason (`converged`, `max_iterations`, `all_dimensions_covered`, `stuck_unrecoverable`)
- Total iterations completed
- Dimension coverage ratio
- P0/P1/P2 finding counts at convergence
- Release-readiness state (`in-progress`, `converged`, `release-blocking`)

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md, AGENTS.md, CODEX.md, or GEMINI.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: deep review, code audit, iterative review)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3; the spec folder determines the `{spec_folder}/review/` state packet location
- **Continuity**: `/spec_kit:resume` is the operator-facing recovery surface; canonical packet continuity is written via `generate-context.js`
- **Command**: `/spec_kit:deep-review` is the primary invocation point

### Continuity Integration

```
Before review:
  /spec_kit:resume
  --> Recover packet context in this order:
      handover.md -> _memory.continuity -> spec docs
  --> Use memory_context() or memory_search() only after those canonical packet sources are exhausted

During review (each iteration):
  Agent writes resolved_review_packet/iterations/iteration-NNN.md
  Agent updates resolved_review_packet/deep-review-strategy.md
  Agent appends resolved_review_packet/deep-review-state.jsonl

After review:
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]
  # Updates canonical continuity surfaces directly.
```

### Command Integration

| Command | Relationship |
|---------|-------------|
| `/spec_kit:deep-review` | Primary invocation point (auto and confirm modes) |
| `/spec_kit:resume` | Canonical recovery surface before resuming or extending an active review packet |
| `/spec_kit:implement` | Next step after CONDITIONAL/FAIL verdict to resolve P0/P1 findings |
| `/memory:save` | Manual memory save (deep review auto-saves after synthesis) |

### CocoIndex Integration

`mcp__cocoindex_code__search` is available to `@deep-review` for semantic code search when Grep/Glob exact matching is insufficient. Use for:
- Finding all usages of a pattern by concept/intent
- Locating implementations when exact symbol names are unknown
- Cross-referencing behavior across unfamiliar code paths

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Worked Example: Spec Folder Audit

1. `/spec_kit:deep-review:auto "specs/042-mcp-server"`
2. Init creates `specs/042-mcp-server/review/` with config, strategy (4 dimensions), state log
3. **Iteration 1** (Correctness): Finds 2 P1 findings in handler logic; `iteration-001.md` written
4. **Iteration 2** (Security): Finds 1 P0 (unsanitized input path); adversarial self-check confirms; `iteration-002.md` written
5. **Iteration 3** (Spec-Alignment): Checks spec.md vs. implementation; finds 3 P1 misalignments
6. **Iteration 4** (Completeness): All TODOs resolved; 2 P2 naming advisories
7. Convergence: all dimensions covered, quality guards pass
8. Synthesis produces `review-report.md` with verdict FAIL (P0 from iteration 2)
9. Memory saved via `generate-context.js`

### Design Origins

| Innovation | Source | This Adaptation |
|------------|--------|-----------------|
| Autonomous loop | karpathy/autoresearch | YAML-driven review loop with convergence |
| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch = fresh context per dimension |
| STRATEGY.md persistent brain | AGR | `deep-review-strategy.md` (dimension tracking) |
| JSONL state | pi-autoresearch | `deep-review-state.jsonl` (append-only audit log) |
| Stuck detection | AGR | 3-consecutive-no-progress recovery |
| Severity classification | Standard code review | P0/P1/P2 with adversarial self-check for P0 |

### Agents

| Agent | Purpose |
|-------|---------|
| `@deep-review` | Single review iteration executor (LEAF, no sub-agent dispatch) |

### Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:deep-review` | Full review loop workflow (`:auto` or `:confirm` mode) |
| `/memory:save` | Manual context preservation |

### Related Skills

| Skill | When to Use Instead |
|-------|---------------------|
| `sk-deep-research` | For investigation and topic research, not code review; its bounded `spec.md` anchoring contract lives in `../sk-deep-research/references/spec_check_protocol.md` |
| `sk-code-review` | For simple single-pass code review without iteration |

**For one-page cheat sheet**: See [quick_reference.md](references/quick_reference.md)
<!-- /ANCHOR:related-resources -->
