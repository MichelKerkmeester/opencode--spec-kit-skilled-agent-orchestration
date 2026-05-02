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

The YAML workflow supports executor selection via `config.executor.kind`. Current shipped kinds:

| Kind | Dispatch | Required fields | Status |
|------|----------|----------------|--------|
| `native` | `@deep-review` agent via Task tool, `model: opus` | none (default) | Shipped. Default. |
| `cli-codex` | `codex exec` via stdin-piped rendered prompt | `model` (e.g. gpt-5.4) | Shipped (spec 018). |
| `cli-copilot` | Reserved | — | Shipped (spec 019). |
| `cli-gemini` | Reserved | — | Shipped (spec 019). |
| `cli-claude-code` | Reserved | — | Shipped (spec 019). |

#### Cross-CLI Delegation

Each CLI executor operates inside its own sandbox / permissions layer (codex `workspace-write`, copilot `allow-all-tools`, gemini `-y -s none`, claude-code `acceptEdits`). Within that sandbox, a running iteration CAN, in theory, shell out to other CLIs.

**What is possible**:
- A `cli-codex` iteration can invoke `gemini "..."`, `copilot -p ...`, or `claude -p ...` via its shell.
- A `cli-gemini` iteration can invoke `codex exec ...`, `copilot -p ...`, or `claude -p ...`.
- A `cli-copilot` iteration can invoke other CLIs through its tool-execution layer.
- A `cli-claude-code` iteration (with `acceptEdits` permission mode) can invoke other CLIs via shell.

**Anti-patterns** (each CLI's own SKILL.md warns against these):
- **Self-recursion**: do NOT invoke `codex` from within a `cli-codex` iteration; do NOT invoke `copilot` from within a `cli-copilot` iteration; same for gemini and claude-code. Each CLI's orchestration skill warns that self-invocation is circular and wasteful.
- **Auth propagation assumptions**: do NOT assume the parent executor's environment has credentials for child CLIs. Each CLI uses its own authentication layer (OPENAI_API_KEY for codex, GitHub OAuth for copilot, Google credentials for gemini, Anthropic API key for claude). Auth is a user-responsibility; the deep-loop workflow does not mediate.

**Runtime enforcement**: NONE. This is documented design intent, not a code path. If a user wires a recursive invocation, the `post_dispatch_validate` step will eventually catch repeated failures through the existing `schema_mismatch` → `stuck_recovery` flow, but the workflow does not detect or block cross-CLI delegation at dispatch time.

**Invariants** the executor MUST satisfy regardless of kind:

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

**JSONL audit field**: Non-native executor runs append an `executor: {kind, model, reasoningEffort, serviceTier}` block to the iteration's JSONL record via `executor-audit.ts`. Native runs are NOT audited (the default path is recoverable from YAML alone).

**Template**: The executor-agnostic iteration prompt lives at `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`. It is rendered by `prompt-pack.ts` before dispatch and either (a) injected as the agent's context (native) or (b) piped to `codex exec` stdin (cli-codex).

**Config surface**: Defined in `assets/deep_review_config.json` under the `executor` key. Schema is in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. CLI flag precedence is: `--executor/--model/--reasoning-effort/--service-tier/--executor-timeout > config file > schema default`.

**What NEVER changes regardless of executor kind**:

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

> Pattern: see [sk-doc smart-router resilience template](../sk-doc/assets/skill/skill_smart_router.md).

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

### Architecture: 3-Layer Integration

```text
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

The review state packet always lives under the target spec's local `review/` folder. Root-spec targets use `{spec_folder}/review/` directly. Child-phase and sub-phase targets use **flat-first**: a first run with an empty `review/` directory writes flat at `{spec_folder}/review/`. A `pt-NN` subfolder (`{basename(spec_folder)}-pt-{NN}`) is allocated only when prior content already exists in `review/` for a non-matching target (continuation runs reuse the existing flat artifact or matching `pt-NN` packet). This avoids the unnecessary `pt-01` wrapper on first runs.

Example (first run on a child phase): `.../026-graph.../006-continuity-refactor-gates/003-gate-c-writer-ready/` → `003-gate-c-writer-ready/review/` (flat, no subfolder).

Example (subsequent run with prior content for a different target): `003-gate-c-writer-ready/review/003-gate-c-writer-ready-pt-02/` (pt-NN allocated as a sibling to the prior content).

```text
{spec_folder}/review/
  [packet-dir/]                      # Present only when the target spec is a nested child phase
    deep-review-config.json          # Immutable after init: review parameters
    deep-review-state.jsonl          # Append-only review iteration log
    deep-review-strategy.md          # Review dimensions, findings, next focus
    deep-review-dashboard.md         # Auto-generated review dashboard
    .deep-review-pause               # Pause sentinel checked between iterations
    resource-map.md                  # Convergence-time coverage map from review deltas
    review-report.md                 # Final review report (synthesis output)
    iterations/
      iteration-NNN.md               # Write-once review findings per iteration
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Data Flow

```text
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
Synthesize --> Compile review/review-report.md (9 core sections + conditional Resource Map Coverage Gate, verdict)
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
11. **Report severity counts and finding detail in every JSONL record** — `findingsSummary` (cumulative), `findingsNew` (this iteration), and `findingDetails` (per-finding `findingClass`, `scopeProof`, and `affectedSurfaceHints`) are required fields.
12. **Quality guards must pass before convergence** — Evidence completeness, scope alignment, no inference-only findings, severity coverage, and cross-reference checks must all pass (see `references/convergence.md` Section 10.4) before STOP can trigger.
13. **Emit explicit setup BINDINGs** — At the start of every iteration's stdout, emit one line per resolved setup value in canonical form: `BINDING: target=<value>`, `BINDING: maxIterations=<N>`, `BINDING: convergence=<F>`, `BINDING: mode=review`, `BINDING: dimensions=<comma-list>`. These bindings make setup-resolution grep-checkable for stress tests and operator audit. The bindings MUST appear before any other workflow step output.
14. **Use canonical refusal wording for nested dispatch** — When asked or instructed to dispatch a sub-agent, invoke the Task tool, or delegate work outside the LEAF boundary, emit the EXACT canonical refusal string: `REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.` followed by the partial work the agent was able to complete within the LEAF boundary. Silent refusal is non-compliant.

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

## 6. SUCCESS CRITERIA

### Loop Completion

- Review loop ran to convergence or max iterations
- All configured review dimensions have at least one iteration of coverage
- All state files present and consistent (`config.json`, `state.jsonl`, `strategy.md`)
- `review/resource-map.md` produced from converged deltas unless `config.resource_map.emit == false` (operator flag: `--no-resource-map`)
- `review/review-report.md` produced with all 9 core sections, plus `## Resource Map Coverage Gate` when `resource_map_present == true`
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
| Report completeness | `{spec_folder}/review/review-report.md` has all 9 core sections, plus `## Resource Map Coverage Gate` when `resource_map_present == true` |
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

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md, AGENTS.md, CODEX.md, or GEMINI.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: deep review, code audit, iterative review)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3; the spec folder determines the `{spec_folder}/review/` state packet location
- **Continuity**: `/spec_kit:resume` is the operator-facing recovery surface; canonical packet continuity is written via `generate-context.js`
- **Command**: `/spec_kit:deep-review` is the primary invocation point

### Continuity Integration

```text
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
