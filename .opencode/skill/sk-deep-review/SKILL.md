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
- Manage iteration state outside the resolved local review packet under `{spec_folder}/review/`

**ALWAYS:**
- Invoke via `/spec_kit:deep-review :auto` or `/spec_kit:deep-review :confirm`
- Let the command's YAML workflow own dispatch (auto: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`)
- Let `scripts/reduce-state.cjs` be the SINGLE state writer
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'review')` from `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical review root

### Executor Selection Contract

Executor settings are owned by the YAML workflow and rendered prompt pack. Do not bypass the workflow by hand-dispatching review iterations. Each iteration must stay LEAF-only and produce the required markdown plus JSONL delta.

**Invariants** every executor path MUST satisfy:

1. Produce an iteration markdown file at `{state_paths.iteration_pattern}` (non-empty).
2. Append a JSONL delta record to `{state_paths.state_log}` with required fields: `type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`.
3. Respect the LEAF-agent constraint: no sub-dispatch, no nested loops. Max 12 tool calls per iteration.

**Failure modes**:

- Missing iteration file → `iteration_file_missing` from `post-dispatch-validate.ts`, emits `schema_mismatch` conflict event.
- Empty iteration file → `iteration_file_empty`, same downstream.
- JSONL not appended → `jsonl_not_appended`.
- JSONL missing required fields → `jsonl_missing_fields`.
- JSONL malformed → `jsonl_parse_error`.
- 3 consecutive failures → existing `stuck_recovery` event (unchanged).

**JSONL audit field**: Non-native executor runs append an `executor` block with model and runtime settings to the iteration's JSONL record via `executor-audit.ts`. Native runs are recoverable from YAML alone.

**Template**: The executor-agnostic iteration prompt lives at `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`. It is rendered by `prompt-pack.ts` before dispatch and either (a) injected as the agent's context (native) or (b) piped to `codex exec` stdin (cli-codex).

**Config surface**: Defined in `assets/deep_review_config.json` under the `executor` key. Schema is in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. CLI flag precedence is: `--executor/--model/--reasoning-effort/--service-tier/--executor-timeout > config file > schema default`.

**What NEVER changes regardless of executor route**:

- YAML owns state (`deep-review-state.jsonl`, strategy.md, registry, dashboard).
- `reduce-state.cjs` is the single state writer.
- Convergence detection, lifecycle events (new/resume/restart), review dimensions pass (correctness, security, traceability, maintainability), and stuck_recovery all stay YAML-driven.
- The `@deep-review` LEAF agent definition is untouched — it is the native executor, not the only one.

### Code-Graph Readiness TrustState Surface

On this skill surface, the live code-graph readiness contract only reaches four TrustState values: `live`, `stale`, `absent`, and `unavailable`.

`cached`, `imported`, `rebuilt`, and `rehomed` remain declared in the shared TrustState type for compatibility and downstream schema stability, but the seven code-graph handlers and readiness helpers used here do not emit them today.

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

## 2. SMART ROUTING


### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards markdown paths, checks `inventory`, and uses `seen`.
- Pattern 3: Extensible Routing Key - `get_routing_key()` derives the review phase from dispatch context.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns review disambiguation and missing phases return a "no review resources" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
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

# RESOURCE_MAP: local markdown assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/loop_protocol.md",
        "references/state_format.md",
        "assets/deep_review_strategy.md",
    ],
    "REVIEW_ITERATION":   [
        "references/loop_protocol.md",
        "references/convergence.md",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence.md",
    ],
    "REVIEW_REPORT":      [
        "references/state_format.md",
        "assets/deep_review_dashboard.md",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference", "resume deep review", "deep-review wave", "review artifact", "release-readiness audit", "convergence-tracked", "same session lineage", "P0"],
    "ON_DEMAND":         [
        "references/loop_protocol.md",
        "references/state_format.md",
        "references/convergence.md",
    ],
}

PHASE_RESOURCE_MAP = {
    "init": ["references/loop_protocol.md", "references/state_format.md"],
    "iteration": ["references/loop_protocol.md", "references/convergence.md"],
    "stuck": ["references/convergence.md", "references/loop_protocol.md"],
    "synthesis": ["references/state_format.md", "assets/deep_review_dashboard.md"],
}

NON_MARKDOWN_REFERENCES = {
    "review_contract": "assets/review_mode_contract.yaml",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the review target or spec folder",
    "Confirm the review phase",
    "Provide one concrete file, diff range, or expected finding class",
    "Confirm the verification command set before final review",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(dispatch_context) -> str:
    phase = str(getattr(dispatch_context, "phase", "")).strip().lower()
    if phase:
        return phase
    text = str(getattr(dispatch_context, "text", "")).lower()
    if "recovery" in text:
        return "stuck"
    if "convergence" in text or "synthesis" in text:
        return "synthesis"
    if "iteration" in text or "dimension" in text:
        return "iteration"
    return "init"

def route_review_resources(task, dispatch_context):
    inventory = discover_markdown_resources()
    routing_key = get_routing_key(dispatch_context)
    scores = score_intents(task, INTENT_SIGNALS, NOISY_SYNONYMS)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    phase_resources = PHASE_RESOURCE_MAP.get(routing_key, [])
    if routing_key == "unknown" or not phase_resources:
        return {
            "routing_key": routing_key,
            "notice": f"No review resources found for routing key '{routing_key}'",
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    for relative_path in phase_resources:
        load_if_available(relative_path)

    task_text = str(getattr(task, "text", "")).lower()
    if any(keyword in task_text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    return {
        "routing_key": routing_key,
        "intents": intents,
        "resources": loaded,
        "non_markdown_references": NON_MARKDOWN_REFERENCES,
    }
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

## 3. HOW IT WORKS

### Resource Map Coverage Gate

When `{spec_folder}/resource-map.md` exists at init, deep review treats it as a first-class audit input instead of optional prompt wiring.

- Persist `resource_map_present: true` in `deep-review-config.json`.
- Add a resource-map snapshot to `Known Context` so later iterations inherit the packet inventory baseline.
- Promote `Resource Map Coverage` to a first-class audit angle alongside correctness, regression risk, test coverage, cross-runtime parity, observability, and docs-vs-code drift.
- Reserve at least one loop iteration to cross-check `target_files` from `{spec_folder}/applied/T-*.md` against `resource-map.md`.
- Treat that pass as mandatory coverage work, not an optional traceability extra.
- Classify results into three buckets: entries touched, entries not touched (`expected-by-scope` vs `gap`), and implementation paths absent from the map.
- Findings emitted from that audit use the `resource-map-coverage` category.
- Synthesis inserts `## Resource Map Coverage Gate` into `review-report.md` when the map was present at init.
- Convergence also emits `{artifact_dir}/resource-map.md` from review delta evidence unless the operator passes `--no-resource-map`.

When `{spec_folder}/resource-map.md` is absent at init:

- Persist `resource_map_present: false`.
- Log `resource-map.md not present; skipping coverage gate` in `Known Context`.
- Skip the coverage-gate pass and omit the report section without failing the loop.

### Architecture

`/spec_kit:deep-review` owns the loop. The YAML workflow initializes state, dispatches one LEAF review iteration at a time, evaluates convergence, synthesizes `review-report.md`, and saves continuity. The LEAF agent reads state, reviews one dimension, writes `iteration-NNN.md`, updates strategy, and appends JSONL.

### State Packet Location

The review state packet always lives under the target spec's local `review/` folder. Root-spec targets use `{spec_folder}/review/` directly. Child-phase and sub-phase targets use **flat-first**: a first run with an empty `review/` directory writes flat at `{spec_folder}/review/`. A `pt-NN` subfolder (`{basename(spec_folder)}-pt-{NN}`) is allocated only when prior content already exists in `review/` for a non-matching target (continuation runs reuse the existing flat artifact or matching `pt-NN` packet). This avoids the unnecessary `pt-01` wrapper on first runs.

Example (first run on a child phase): `.../026-graph.../006-continuity-refactor-gates/003-gate-c-writer-ready/` → `003-gate-c-writer-ready/review/` (flat, no subfolder).

Example (subsequent run with prior content for a different target): `003-gate-c-writer-ready/review/003-gate-c-writer-ready-pt-02/` (pt-NN allocated as a sibling to the prior content).

Core artifacts: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `.deep-review-pause`, `resource-map.md`, `review-report.md`, and `iterations/iteration-NNN.md`.

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Data Flow

Init creates config, strategy, and JSONL state. Each loop reads state, checks convergence, dispatches one dimension, records findings, and reduces state. Synthesis compiles the final report and saves continuity.

### Review Dimensions

The four primary review dimensions (configured in `assets/review_mode_contract.yaml`):

| Dimension | Focus | Key Questions |
|-----------|-------|---------------|
| **Correctness** | Logic, behavior, error handling | Does the code do what it claims? Are edge cases handled? |
| **Security** | Vulnerabilities, exposure, trust boundaries | Are inputs validated? Are credentials exposed? |
| **Spec-Alignment / Traceability** | Spec vs. implementation fidelity | Does code match spec.md? Are all planned items present? |
| **Completeness / Maintainability** | Coverage, dead code, documentation | Are TODOs resolved? Is the code self-documenting? |

### Lifecycle + Reducer Contract

Review mode is lineage-aware. Supported lifecycle modes are `new`, `resume`, and `restart`; required lineage fields include `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, and `releaseReadinessState`. The reducer consumes the latest JSONL delta, the new iteration file, and prior reduced state, then emits finding registry, dashboard metrics, and strategy updates.

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

## 4. RULES

### ALWAYS

1. Read JSONL and strategy before review action.
2. Review one dimension per iteration and write findings to `iteration-NNN.md`.
3. Append JSONL with severity counts, finding detail, and `newInfoRatio`.
4. Cite every finding with `[SOURCE: file:line]`; reject inference-only findings.
5. Re-read cited code before recording any P0.
6. Keep target files read-only.
7. Use `generate-context.js` for continuity saves.
8. Emit setup `BINDING:` lines before workflow output.
9. Refuse nested dispatch with: `REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.`

### NEVER

1. **Dispatch sub-agents** — `@deep-review` is LEAF-only; it cannot dispatch additional agents. When dispatch is requested, use the canonical REFUSE wording (ALWAYS rule 14).
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

## 5. REFERENCES

The router discovers markdown references dynamically. Primary docs: `references/quick_reference.md`, `references/loop_protocol.md`, `references/state_format.md`, and `references/convergence.md`. Local assets provide config, strategy, dashboard, and review contract templates.

---

## 6. SUCCESS CRITERIA

### Loop Completion

- Review loop ran to convergence or max iterations
- All configured review dimensions have at least one iteration of coverage
- All state files present and consistent (`config.json`, `state.jsonl`, `strategy.md`)
- `review/resource-map.md` produced from converged deltas unless `config.resource_map.emit == false` (operator flag: `--no-resource-map`)
- `review/review-report.md` produced with all 9 core sections, plus `## Resource Map Coverage Gate` when `resource_map_present == true`
- Canonical continuity surfaces updated via `generate-context.js`

Quality gates require valid config, initialized strategy, state log, per-iteration markdown and JSONL, final report, evidence completeness, scope alignment, severity coverage, and P0 adversarial recheck.

The final report records stop reason, iteration count, dimension coverage, severity counts, verdict, and release-readiness state.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md, AGENTS.md, CODEX.md, or GEMINI.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: deep review, code audit, iterative review)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3; the spec folder determines the `{spec_folder}/review/` state packet location
- **Continuity**: `/spec_kit:resume` is the operator-facing recovery surface; canonical packet continuity is written via `generate-context.js`
- **Command**: `/spec_kit:deep-review` is the primary invocation point

### Continuity Integration

Recover context via `/spec_kit:resume` in the order `handover.md -> _memory.continuity -> spec docs`. During review, the agent writes iteration, strategy, and JSONL state. After synthesis, run `generate-context.js`.

### CocoIndex Integration

`mcp__cocoindex_code__search` is available to `@deep-review` for semantic code search when Grep/Glob exact matching is insufficient. Use for:
- Finding all usages of a pattern by concept/intent
- Locating implementations when exact symbol names are unknown
- Cross-referencing behavior across unfamiliar code paths

---

## 8. RELATED RESOURCES

Related skills: use `sk-deep-research` for investigation and `sk-code-review` for simple single-pass review. For a one-page cheat sheet, see [quick_reference.md](references/quick_reference.md).
