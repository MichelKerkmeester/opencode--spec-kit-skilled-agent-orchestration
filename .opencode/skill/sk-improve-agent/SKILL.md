---
name: sk-improve-agent
description: "Evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, packet-local candidates, and guarded promotion or rollback."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.2.0
triggers:
  - sk-improve-agent
  - agent improvement loop
  - bounded agent improvement
  - 5-dimension scoring
  - integration scanner
  - dynamic profiling
---

<!-- Keywords: sk-improve-agent, improve-agent, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- You want to test whether an agent prompt or instruction surface can be improved
- The mutation boundary is explicit and narrow
- You need packet-local evidence instead of ad hoc prompt tweaking
- You need target-specific benchmark or scoring rules before any canonical mutation
- Promotion must stay gated behind independent evidence plus operator approval

### Primary Use Cases

#### Bounded Agent Improvement

Use this skill to set up a proposal-first loop for any bounded agent file, write packet-local candidates, and record append-only evidence.

#### Benchmark-Backed Evaluation

Use this skill when candidate quality must be judged by produced artifacts and repeatability reports, not just by how a prompt file reads in isolation.

#### Promotion and Rollback Verification

Use this skill when you need to prove that guarded promotion, validation, rollback, and post-rollback comparison all work end to end without leaving hidden drift behind.

### When NOT to Use

Do not use this skill for:
- Open-ended prompt rewrites across multiple agent families at once
- Direct canonical edits without a packet-local candidate and evaluator evidence
- Broad runtime-mirror synchronization work presented as benchmark truth
- General packet planning that belongs in `/spec_kit:plan` or implementation that does not need an improvement loop

---

## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring so only the guidance that matches the current task is loaded.

- `references/` for operator workflows, evaluator policy, promotion or rollback rules, target onboarding, and quick-reference guidance
- `assets/` for reusable runtime templates such as the charter and strategy markdown files
- `scripts/` for deterministic benchmark, scoring, reduction, promotion, rollback, and drift-check helpers

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Workflow, policy, or onboarding references |
| ON_DEMAND | Only on explicit request or full setup | Markdown runtime templates in `assets/` |

### Smart Router Pseudocode

The authoritative routing logic for scoped markdown loading and explicit runtime-asset loading.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "QUICK_REFERENCE": {"weight": 3, "keywords": ["quick reference", "short reminder", "command example"]},
    "LOOP_EXECUTION": {"weight": 4, "keywords": ["run loop", "proposal", "candidate", "score candidate", "benchmark"]},
    "EVALUATION_POLICY": {"weight": 4, "keywords": ["evaluator", "rubric", "contract", "repeatability", "no-go"]},
    "PROMOTION_OPERATIONS": {"weight": 4, "keywords": ["promote", "rollback", "mirror drift", "approval gate"]},
    "TARGET_ONBOARDING": {"weight": 4, "keywords": ["new target", "target profile", "onboarding", "second target"]},
    "INTEGRATION_SCAN": {"weight": 4, "keywords": ["integration", "scan surfaces", "mirror sync", "dynamic profile", "5-dimension"]},
    "FULL_SETUP": {"weight": 3, "keywords": ["full setup", "initialize runtime", "charter", "strategy"]},
}

RESOURCE_MAP = {
    "QUICK_REFERENCE": ["references/quick_reference.md"],
    "LOOP_EXECUTION": ["references/loop_protocol.md", "references/benchmark_operator_guide.md"],
    "EVALUATION_POLICY": ["references/evaluator_contract.md", "references/no_go_conditions.md", "references/promotion_rules.md"],
    "PROMOTION_OPERATIONS": ["references/rollback_runbook.md", "references/mirror_drift_policy.md", "references/promotion_rules.md"],
    "TARGET_ONBOARDING": ["references/target_onboarding.md"],
    "INTEGRATION_SCAN": ["references/integration_scanning.md", "references/evaluator_contract.md"],
    "FULL_SETUP": ["assets/improvement_charter.md", "assets/improvement_strategy.md"],
}

RUNTIME_ASSETS = {
    "ALWAYS": ["assets/improvement_config.json", "assets/target_manifest.jsonc"],
}

ON_DEMAND_KEYWORDS = ["target profile", "score candidate", "proposal loop", "benchmark", "promotion gate", "mirror drift"]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_markdown(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routed here: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUICK_REFERENCE"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_recursive_agent_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task))
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_markdown(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    runtime_assets = list(RUNTIME_ASSETS["ALWAYS"])

    return {"intents": intents, "resources": loaded, "runtime_assets": runtime_assets}
```

---

## 3. HOW IT WORKS

### Mode 1: Runtime Initialization

1. Confirm the spec folder, target path, execution mode, and active target profile.
2. Create `{spec_folder}/improvement/` plus the packet-local `candidates/`, `benchmark-runs/`, and `archive/` directories when needed.
3. Copy in the runtime config, charter, strategy, and manifest templates.
4. Record baseline state in the append-only ledger before the first candidate run.

### Mode 2: Proposal and Evaluation

1. Read the charter, manifest, target profile, and canonical target surface.
2. Run `scripts/scan-integration.cjs` to discover all surfaces the target agent touches.
3. Write exactly one bounded candidate under the packet-local `candidates/` directory.
4. Run `scripts/score-candidate.cjs` to evaluate the candidate via dynamic-mode 5-dimension scoring (the sole supported path).
5. Run `scripts/run-benchmark.cjs` to measure produced outputs against the active fixture set.
6. Append score and benchmark results to the packet-local ledger.
7. Run `scripts/reduce-state.cjs` to refresh the dashboard and experiment registry.

### Mode 2A: Stress-Test Failure Paths Before Promotion Claims

For changes that alter agent discipline, run at least one same-task A/B stress scenario before recommending promotion:

1. Call A: a generic improvement attempt against an isolated sandbox copy of the target.
2. Reset the sandbox to its baseline copy.
3. Call B: the disciplined `/improve:agent` path against the identical prompt and files.
4. Judge only grep/file/diff/exit-code signals: helper invocation, packet-local candidate boundary, no canonical or mirror mutation before promotion, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness.

Do not treat `Read(SKILL.md)` or `skill(sk-improve-agent)` as evidence that this protocol executed.

### 5-Dimension Evaluation Framework

Dynamic mode is the only scoring path. Scoring evaluates five dimensions:

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (required sections present) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent, skills reference agent |
| Output Quality | 0.15 | Output verification items present, no placeholder content |
| System Fitness | 0.15 | Permission-capability alignment, resource references valid, frontmatter complete |

Profiles are generated on the fly from any agent file via `scripts/generate-profile.cjs`. No static profiles are shipped; every target is evaluated against its own derived structure and rules.

### Mode 3: Promotion and Recovery

1. Promote only when prompt scoring, benchmark status, repeatability, manifest boundary, and approval gates all pass.
2. Use `scripts/promote-candidate.cjs` for guarded canonical mutation.
3. Use `scripts/rollback-candidate.cjs` plus direct comparison evidence when the canonical target must be restored.
4. Treat mirror drift as downstream packaging work and review it separately with `scripts/check-mirror-drift.cjs`.

---

## 4. SUCCESS CRITERIA

- The loop stays proposal-first unless an explicit guarded promotion path is requested
- Benchmark evidence, prompt scoring, and mirror-sync evidence remain separate
- Reducer outputs make the best-known state, rejected runs, infrastructure failures, and stop conditions easy to review
- Operators can onboard a bounded target without weakening manifest or evaluator guardrails

---

## 4B. RUNTIME TRUTH CONTRACTS (Phase 005)

### Stop-Reason Taxonomy

Every improvement session termination MUST produce both a `stopReason` (why) and a `sessionOutcome` (what happened).

**stopReason** (WHY the session ended):

| Reason | Trigger Condition |
| --- | --- |
| `converged` | All legal-stop gate bundles pass and dimension trajectory is stable |
| `maxIterationsReached` | Iteration counter equals `maxIterations` config |
| `blockedStop` | One or more legal-stop gate bundles fail when convergence math would otherwise trigger stop |
| `manualStop` | Operator cancels the session |
| `error` | Infra failure, script crash, or unrecoverable condition |
| `stuckRecovery` | Session detected stuck state and exhausted recovery options |

**sessionOutcome** (WHAT happened to the candidate):

| Outcome | When Used |
| --- | --- |
| `keptBaseline` | Baseline was retained because candidate did not improve |
| `promoted` | Candidate was promoted to canonical target |
| `rolledBack` | Promoted candidate was rolled back to prior state |
| `advisoryOnly` | Session completed for assessment only; no mutation attempted |

### Audit Journal Protocol

All journal emission is orchestrator-only (ADR-001). The journal (`improvement-journal.jsonl`) is an append-only JSONL file capturing lifecycle events. Separate from the existing `agent-improvement-state.jsonl` which tracks proposal/evaluation data.

**Script**: `scripts/improvement-journal.cjs`

Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`

### Static Benchmark Assets

The reusable benchmark contract ships with the skill, not with each spec packet:

- Profile: `assets/benchmark-profiles/default.json`
- Fixtures: `assets/benchmark-fixtures/*.json`
- Materializer: `scripts/materialize-benchmark-fixtures.cjs`
- Runner: `scripts/run-benchmark.cjs`

The command workflow first materializes static fixture JSON into packet-local markdown under `{spec_folder}/improvement/benchmark-outputs/{fixture.id}.md`, then runs `run-benchmark.cjs --profile .opencode/skill/sk-improve-agent/assets/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs`. The runner writes `{spec_folder}/improvement/benchmark-outputs/report.json` with `status:"benchmark-complete"` and appends a `benchmark_run` row to `{spec_folder}/improvement/agent-improvement-state.jsonl`.

`benchmark_completed` may be emitted only after `benchmark-outputs/report.json` exists. Repeatability output from `benchmark-stability.cjs` is separate evidence and does not by itself prove benchmark completion.

### Legal-Stop Gate Bundles

A session may NOT claim `converged` unless ALL gate bundles pass:

| Gate Bundle | Conditions | Required Evidence |
| --- | --- | --- |
| `contractGate` | structural >= 90 AND systemFitness >= 90 | score/legal-stop artifact includes both dimension values |
| `behaviorGate` | ruleCoherence >= 85 AND outputQuality >= 85 | score/legal-stop artifact includes both dimension values |
| `integrationGate` | integration >= 90 AND no drift ambiguity | integration report includes the expected runtime mirror manifest and no ambiguous drift |
| `evidenceGate` | benchmark pass AND repeatability pass | `benchmark_completed` journal event plus repeatability output |
| `improvementGate` | weighted delta >= `scoring.thresholdDelta` | `baselineScore`, current `score`, numeric `delta`, and `thresholdDelta` |

The orchestrator MUST emit `legal_stop_evaluated` with all five gate keys before any `session_end` event. The required journal shape is nested:

```json
{
  "eventType": "legal_stop_evaluated",
  "details": {
    "gateResults": {
      "contractGate": "...",
      "behaviorGate": "...",
      "integrationGate": "...",
      "evidenceGate": "...",
      "improvementGate": "..."
    },
    "stopReason": "blockedStop"
  }
}
```

Flat fields such as `details.gateName`, `details.gateResult`, or top-level `details.contractGate` are not the command-flow contract. If any gate fails, the orchestrator MUST emit `blocked_stop` with `failedGates[]` and use `stopReason:"blockedStop"`, not `converged`.

### Resume/Continuation Semantics (current release)

Sessions support a single lineage mode today: `new`. Every invocation of the `/improve:agent` workflow starts a fresh session with a new session id and generation 1. Multi-generation lineage modes (`resume`, `restart`, `fork`, `completed-continue`) were described in earlier drafts but have no shipped runtime wiring in the improve-agent workflow, reducer, or journal consumer.

Operators who want to continue evaluating an agent after a prior session SHOULD archive the prior session folder (e.g. move `improve/` to `improve_archive/{timestamp}/`) and re-invoke the command, which starts a new `new`-mode session. The reducer treats each session independently and does not carry ancestry across sessions.

If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `improve_improve-agent_{auto,confirm}.yaml`, reducer ancestry handling in `sk-improve-agent/scripts/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.

### Mutation Coverage Graph

**Script**: `scripts/mutation-coverage.cjs`

Tracks explored dimensions, tried mutation types per dimension, and exhausted mutation sets using `loop_type: "improvement"` namespace isolation (ADR-002). The orchestrator skips mutation types already in the exhausted log.

### Dimension Trajectory

Trajectory data records per-iteration dimension scores. Convergence requires minimum 3 data points (ADR-003) with all dimension deltas within +/-2 across the last 3 points.

### Trade-Off Detection

**Script**: `scripts/trade-off-detector.cjs`

Detects Pareto trade-offs: flags when improvement > +3 in one dimension causes regression < -3 in hard dimensions (structural, integration, systemFitness) or < -5 in soft dimensions (ruleCoherence, outputQuality). Blocks promotion for Pareto-dominated candidates.

### Parallel Candidate Waves (Optional)

**Script**: `scripts/candidate-lineage.cjs`

Disabled by default (`parallelWaves.enabled: false` in config, ADR-004). When enabled, spawns 2-3 candidates with different mutation strategies. Activation requires: exploration-breadth score above threshold, 3+ unresolved mutation families, and 2 consecutive tie/plateau iterations.

### Weight Optimizer (Advisory Only)

**Script**: `scripts/benchmark-stability.cjs`

Reads historical session data and emits a weight-recommendation report. Recommendations do NOT auto-apply (ADR-005). Requires minimum session count threshold before producing recommendations.

---

## Journal Wiring Contract

Journal emission is orchestrator-only. The target agent being evaluated never writes journal rows directly; only the visible YAML workflow or an operator-side wrapper invokes `scripts/improvement-journal.cjs`.

The CLI contract is:

```bash
node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit <eventType> --journal <journal_path> --details '<json>'
```

The helper validates event type plus `session_end` or `session_ended` details, and the CLI entrypoint stores boundary context under `details`. Top-level `iteration` and `candidateId` fields are available only through the JS API, not through the CLI wrapper used by the YAML workflows.

### Boundary Points

| Boundary | When It Fires | Event Types | Required Details |
| --- | --- | --- | --- |
| `session_start` | Once after baseline setup is recorded and before the first loop iteration begins | `session_start` | `sessionId`, `target`, `charter`, `startedAt` |
| `iteration_boundary` | On every iteration after candidate generation, after candidate scoring, and after gate evaluation | `candidate_generated`, `candidate_scored`, `gate_evaluation` | Per-iteration context such as `sessionId`, `iteration`, `candidateId`, `candidatePath`, `scoreOutputPath`, `weightedScore`, and gate decision details |
| `session_end` | Once after synthesis completes or the session reaches a terminal stop | `session_end` | `stopReason`, `sessionOutcome`, `endedAt`, `totalIterations` |

### Frozen Helper Enums

`improvement-journal.cjs` currently exports and validates the following enums:

- `STOP_REASONS`: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`
- `SESSION_OUTCOMES`: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`

Keep session-end emissions aligned to those helper-owned values until the helper contract itself changes. Labels such as `convergedImprovement`, `plateau`, `benchmarkPlateau`, `rejected`, `deferred`, `blocked`, or `errored` are not accepted by the current CLI validator. Plateau detection is a reducer/stop-rule condition; it must reconcile to one of the canonical stop reasons above when emitted as `details.stopReason`.

### Orchestrator Ownership

- Auto mode emits `session_start` after `step_record_baseline`, then emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop iteration, and finally emits `session_end` after synthesis.
- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.
- Operators invoking the helper manually must use the same boundary order so replay and reducer consumers see a consistent journal shape.

### Reducer Consumer Side

The reducer is the consumer for replay artifacts on refresh. Every `scripts/reduce-state.cjs` pass now attempts to read:

- `improvement-journal.jsonl`
- `candidate-lineage.json`
- `mutation-coverage.json`

These inputs remain optional. Missing files do not fail the reducer; the corresponding registry field is set to `null` so dashboard and registry refreshes still complete.

For legal-stop replay, the reducer consumes `details.gateResults` from the latest `legal_stop_evaluated` event and surfaces it as `journalSummary.latestLegalStop.gateResults` in `experiment-registry.json` plus the dashboard's latest legal-stop table.

## ADR-002: Journal Replay Consumer

ADR-002 is implemented in the reducer via replay consumers instead of a separate orchestrator-only synthesis step. During each refresh pass, `scripts/reduce-state.cjs` now reads the following artifacts when present:

- `improvement-journal.jsonl` to summarize last session boundaries, total replayed events, per-event counts, and terminal `stopReason` / `sessionOutcome`
- `candidate-lineage.json` to summarize lineage depth, total candidate count, and the latest candidate leaf
- `mutation-coverage.json` to summarize mutation coverage ratio and uncovered mutations

The reducer writes these summaries into new top-level registry fields:

- `journalSummary`
- `candidateLineage`
- `mutationCoverage`

Graceful degradation is required: if any artifact is missing, unreadable, or not yet generated for the current runtime, the reducer preserves the rest of the registry and records `null` for that field instead of throwing.

The dashboard now also includes a dedicated **Sample Quality** section. This separates replay/stability sample sufficiency from benchmark failures so operators can tell the difference between a true regression and an iteration that simply lacked enough data for trade-off or replay-stability trust.

## 5. RULES

### ✅ ALWAYS

- Read the charter, manifest, and target profile before creating a candidate
- Keep the ledger append-only
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work
- Require integration evidence to name each expected runtime mirror path explicitly (`.claude/agents`, `.codex/agents`, `.gemini/agents`, plus any manifest-declared extra mirrors) before trusting `integrationGate`

### ❌ NEVER

- Mutate the canonical target during proposal-only mode
- Broaden scope beyond the active manifest boundary
- Treat runtime mirrors as experiment truth in the same phase as canonical evaluation
- Treat a stale placeholder mirror path as equivalent to a real runtime mirror
- Hide rejected runs, weak benchmark results, or infra failures
- Promote non-canonical targets even if they benchmark well

### ⚠️ ESCALATE IF

- The target profile and manifest disagree about mutability or target family
- The benchmark runner cannot produce stable repeatability results
- Promotion evidence is incomplete but canonical mutation is still being requested
- Documentation edits would change the trust boundary rather than clarify it

---

## 6. REFERENCES

| Resource | Purpose |
| --- | --- |
| `README.md` | Human-facing skill overview and operating guide |
| `references/quick_reference.md` | Short command and runtime reminder |
| `references/loop_protocol.md` | End-to-end operator workflow |
| `references/evaluator_contract.md` | Deterministic scoring and benchmark contract |
| `references/benchmark_operator_guide.md` | Repeatable fixture-benchmark workflow |
| `references/promotion_rules.md` | Keep, reject, and promote policy |
| `references/rollback_runbook.md` | Promotion rollback and recovery steps |
| `references/mirror_drift_policy.md` | Packaging drift handling after canonical mutation |
| `references/no_go_conditions.md` | Explicit stop and expansion blockers |
| `references/target_onboarding.md` | Safe onboarding of new bounded targets |
| `assets/improvement_charter.md` | Fixed policy charter template |
| `assets/improvement_strategy.md` | Mutable runtime strategy template |
| `assets/improvement_config.json` | Runtime configuration template |
| `assets/improvement_config_reference.md` | Field-level config documentation |
| `assets/target_manifest.jsonc` | Surface classification and guardrail manifest |
| `assets/benchmark-profiles/default.json` | Static benchmark profile consumed by materializer and runner |
| `assets/benchmark-fixtures/*.json` | Static benchmark fixture definitions |
| `scripts/materialize-benchmark-fixtures.cjs` | Converts static benchmark fixture JSON into packet-local markdown outputs |
| `scripts/run-benchmark.cjs` | Deterministic benchmark runner |
| `scripts/score-candidate.cjs` | Deterministic prompt-surface scorer |
| `scripts/reduce-state.cjs` | Ledger reducer and dashboard generator |
| `scripts/promote-candidate.cjs` | Guarded canonical promotion helper |
| `scripts/rollback-candidate.cjs` | Canonical rollback helper |
| `scripts/scan-integration.cjs` | Full integration surface scanner |
| `scripts/generate-profile.cjs` | Dynamic target profile generator |
| `scripts/check-mirror-drift.cjs` | Derived-surface drift report helper |
| `scripts/improvement-journal.cjs` | Append-only JSONL event emitter for improvement session audit journals |
| `scripts/mutation-coverage.cjs` | Coverage graph reader/writer for explored dimensions and mutation tracking |
| `scripts/trade-off-detector.cjs` | Cross-dimension regression detector using trajectory and Pareto analysis |
| `scripts/candidate-lineage.cjs` | Lineage graph for optional parallel candidate wave sessions |
| `scripts/benchmark-stability.cjs` | Benchmark replay stability measurement and advisory weight optimization |
| `references/integration_scanning.md` | Integration scanner documentation |

---

## 7. INTEGRATION POINTS

- `/improve:agent` initializes and runs the bounded workflow
- `.opencode/agent/improve-agent.md` provides the mutator surface for improve-agent runs
- `sk-doc` validators enforce package-shape, README, and markdown document consistency
- `system-spec-kit` packet validation proves phase records remain truthful

---

## 8. RELATED RESOURCES

- `references/quick_reference.md` for the shortest operator refresher
- `references/benchmark_operator_guide.md` for repeatable benchmark execution
- `references/target_onboarding.md` for adding future bounded targets safely
- `references/rollback_runbook.md` for promotion and rollback proof
