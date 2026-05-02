---
title: "sk-improve-agent"
description: "Evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, packet-local candidates, and guarded promotion or rollback."
trigger_phrases:
  - "sk-improve-agent"
  - "recursive agent"
  - "agent improvement loop"
  - "bounded agent improvement"
  - "5-dimension scoring"
  - "integration scanner"
---

# sk-improve-agent

Evaluator-first workflow for improving agents across their full integration surface. Instead of editing the canonical target first, it scans all surfaces an agent touches, derives a scoring profile from the agent's own rules, writes packet-local candidates, scores them across 5 deterministic dimensions, and only allows promotion when evidence and approval gates are both satisfied.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. 5-DIMENSION EVALUATION](#4-5-dimension-evaluation)
- [5. STRUCTURE](#5-structure)
- [6. SCRIPTS](#6-scripts)
- [7. CONFIGURATION](#7-configuration)
- [8. USAGE EXAMPLES](#8-usage-examples)
- [9. RUNTIME PARITY](#9-runtime-parity)
- [10. TROUBLESHOOTING](#10-troubleshooting)
- [11. FAQ](#11-faq)
- [12. RELATED DOCUMENTS](#12-related-documents)

---

## 1. OVERVIEW

`sk-improve-agent` helps operators improve agent surfaces safely by proving improvement before mutation. It treats agent improvement as a measurable optimization problem — not ad-hoc prompt tweaking — by scanning integration surfaces, deriving scoring profiles, and maintaining an append-only evidence trail.

For packet recovery around an improvement run, `/spec_kit:resume` remains the canonical surface. Continuity still comes from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts remain supporting only.

| Item | Value |
| --- | --- |
| Primary mode | Proposal-only by default |
| Evaluation | 5-dimension integration-aware scoring |
| Target support | Any agent in `.opencode/agent/` (dynamic profiling is the only mode) |
| Runtime area | `{spec_folder}/improvement/` |
| Evidence style | Append-only JSONL ledger + reducer dashboard |

### What Changes With This Skill

| Without sk-improve-agent | With sk-improve-agent |
| --- | --- |
| Prompt edits are ad hoc and untracked | Every candidate is packet-local and evidence-backed |
| Quality is judged by reading the prompt file | Quality is scored across 5 deterministic dimensions |
| Integration drift goes undetected | Scanner checks mirrors, commands, skills, and routing |
| Promotion risk is hard to audit | Promotion, rollback, and drift review produce explicit artifacts |
| Only specific agents can be evaluated | Any agent can be evaluated via dynamic profiling |

### Key Capabilities

| Capability | What It Gives You |
| --- | --- |
| Integration scanning | Maps every surface an agent touches across the repo |
| Dynamic profiling | Derives scoring rules from any agent's own ALWAYS/NEVER/ESCALATE IF sections |
| 5-dimension scoring | Measures structural integrity, rule coherence, integration consistency, output quality, and system fitness |
| Fixture benchmarks | Output-based proof using target-specific fixture sets |
| Dimensional tracking | Per-dimension progress in dashboard with plateau detection |
| Mutation coverage graph | Tracks explored dimensions and tried mutation types via a coverage graph with `loop_type: "improvement"` namespace, preventing re-exploration of exhausted mutations |
| Trade-off detection | Detects when a mutation improves one dimension at the cost of another, using Pareto-aware analysis with configurable thresholds and minimum 3 data points |
| Candidate lineage | Maintains a directed graph of candidate proposals across iterations, tracking session-id, wave-index, spawning mutation type, and parent references |
| Guarded promotion | Canonical mutation only after approval and passing evidence |
| Rollback | Explicit restore with post-rollback dimensional verification |

### Requirements

- An existing spec folder for the improvement run
- Node.js 18+ (for running `.cjs` scripts)
- A target agent file in `.opencode/agent/` (any agent)
- Packet-local runtime write access

---

## 2. QUICK START

### 30-Second Setup

1. Choose or create the phase spec folder where the run will live
2. Pick the target agent you want to evaluate
3. Run the loop command

```text
# Evaluate any agent (dynamic profile is the only mode)
/improve:agent ".opencode/agent/debug.md" :confirm --spec-folder={spec_folder}
```

### Standalone Script Usage

Run individual scripts without the full loop:

```text
# Scan integration surfaces
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug

# Generate dynamic profile from any agent
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md

# Score with 5 dimensions (dynamic mode, the only supported path)
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate=.opencode/agent/debug.md
```

### Verify the Runtime Area

After initialization, the runtime folder should contain:

```text
{spec_folder}/improvement/
  agent-improvement-config.json
  agent-improvement-state.jsonl
  agent-improvement-strategy.md
  agent-improvement-dashboard.md
  integration-report.json
  candidates/
  benchmark-runs/
```

### First Successful Outcome

A healthy first iteration produces:
- An integration scan report (JSON)
- A packet-local candidate under `candidates/`
- A score JSON artifact with 5-dimension breakdown
- A benchmark JSON artifact with fixture results
- A refreshed dashboard showing dimensional progress

---

## 3. FEATURES

### 3.1 INTEGRATION-AWARE EVALUATION

The skill evaluates agents across their full system integration surface, not just the `.md` file. The integration scanner discovers all surfaces an agent touches: canonical definition, runtime mirrors (Claude, Codex, .agents), command dispatch references, YAML workflow references, skill mentions, and global doc references.

### 3.2 DYNAMIC PROFILING

Any agent in `.opencode/agent/` can be evaluated without writing a custom profile. The profile generator parses the agent's own frontmatter, ALWAYS/NEVER/ESCALATE IF rules, output verification checklist, capability scan, anti-patterns, and related resources to derive a scoring profile automatically.

### 3.3 5-DIMENSION SCORING

Each candidate is scored across 5 weighted dimensions (see Section 4). This replaces the original keyword-presence checks with integration-aware evaluation that measures structural compliance, rule-workflow alignment, mirror parity, output quality, and system fitness.

### 3.4 PROPOSAL-FIRST IMPROVEMENT

All candidates are written to packet-local runtime areas, never to the canonical target. Experiments are reversible, auditable, and easy to compare. The original target file stays untouched until guarded promotion is explicitly triggered.

### 3.5 GUARDED PROMOTION AND ROLLBACK

Promotion requires passing prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval. Rollback restores the pre-promotion backup and records a post-rollback dimensional snapshot for audit continuity.

### 3.6 DIMENSIONAL PROGRESS TRACKING

The reducer tracks per-dimension scores across iterations, rendering a Dimensional Progress table in the dashboard. It detects when all dimensions have plateaued (3+ identical scores) and triggers a stop condition, preventing endless loops without improvement.

### 3.8 LEGAL-STOP EVENTS AND SESSION-BOUNDARY GATE

Both auto and confirm workflows now emit `legal_stop_evaluated` and `blocked_stop` events to the JSONL ledger, matching the deep-research and deep-review runtime-truth contract. A session-boundary gate enforces fresh-session isolation before initialization — if prior improvement state exists, the workflow halts until the operator archives, resumes, or aborts.

### 3.9 PLATEAU STOP REASON

The stop-reason taxonomy includes a dedicated `plateau` reason so plateau exits are recorded truthfully instead of being falsified as `converged`. The journal validator accepts `plateau` as a first-class stop type.

### 3.10 MIRROR DRIFT AS PACKAGING WORK

Runtime mirrors are downstream packaging surfaces. The skill treats them as follow-up parity work, not as proof that the benchmark result was real. The integration scanner reports drift status so it can be addressed separately.

---

## 4. 5-DIMENSION EVALUATION

The scorer evaluates candidates across 5 weighted dimensions. All checks are deterministic (regex, string matching, file existence) — no LLM-as-judge scoring.

| Dimension | Weight | What It Measures | How |
| --- | --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance | Checks for required sections (CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with content | Extracts rules from the agent, checks keyword presence in workflow instructions |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent | Runs `scan-integration.cjs`, scores: mirror parity (60%), command coverage (20%), skill coverage (20%) |
| Output Quality | 0.15 | Output contract compliance | Checks output verification items present in instructions, penalizes placeholder content |
| System Fitness | 0.15 | Permission-capability alignment | Verifies tools listed in capability scan match permission model, resource references exist, frontmatter complete |

### Scoring Modes

| Mode | Profiles | Use When |
| --- | --- | --- |
| Dynamic (only mode) | Any agent (generated on-the-fly) | All agent evaluations, including promotion workflows |

### Weighted Score

The weighted score is computed as:

```text
score = structural * 0.20 + ruleCoherence * 0.25 + integration * 0.25 + outputQuality * 0.15 + systemFitness * 0.15
```

A weighted score >= 70 produces a `candidate-acceptable` recommendation. Below 70 produces `needs-improvement`.

---

## 5. STRUCTURE

```text
.opencode/skill/sk-improve-agent/
|-- SKILL.md                          Skill router and core instructions
|-- README.md                         Human-facing overview (this file)
|-- references/
|   |-- quick_reference.md            Command and dimension reminder
|   |-- loop_protocol.md              End-to-end operator workflow
|   |-- evaluator_contract.md         Scoring and benchmark contract
|   |-- benchmark_operator_guide.md   Fixture benchmark execution
|   |-- promotion_rules.md            Keep, reject, promote decisions
|   |-- rollback_runbook.md           Promotion rollback procedure
|   |-- mirror_drift_policy.md        Mirror packaging policy
|   |-- no_go_conditions.md           Stop and expansion blockers
|   |-- target_onboarding.md          Adding new bounded targets
|   `-- integration_scanning.md       Integration scanner documentation
|-- assets/
|   |-- improvement_charter.md        Fixed policy charter template
|   |-- improvement_strategy.md       Mutable runtime strategy template
|   |-- improvement_config.json       Runtime configuration
|   |-- improvement_config_reference.md  Config field documentation
|   `-- target_manifest.jsonc         Surface classification manifest
|-- scripts/
|   |-- scan-integration.cjs          Integration surface scanner
|   |-- generate-profile.cjs          Dynamic target profile generator
|   |-- score-candidate.cjs           5-dimension candidate scorer
|   |-- run-benchmark.cjs             Fixture + integration benchmark runner
|   |-- reduce-state.cjs              Ledger reducer + dimensional dashboard
|   |-- promote-candidate.cjs         Guarded canonical promotion
|   |-- rollback-candidate.cjs        Canonical rollback helper
|   `-- check-mirror-drift.cjs        Mirror drift report
|-- feature_catalog/
|   |-- feature_catalog.md            Root catalog (subsection format)
|   |-- 01--evaluation-loop/          Init, candidates, scoring, promotion, rollback
|   |-- 02--integration-scanning/     Surface discovery, runtime mirrors, dispatch
|   `-- 03--scoring-system/           5-dim rubric, dynamic profiling, plateau detection
`-- manual_testing_playbook/
    |-- manual_testing_playbook.md     Test matrix root (21 scenarios)
    |-- 01--integration-scanner/       Scanner test scenarios
    |-- 02--profile-generator/         Profile generator tests
    |-- 03--5d-scorer/                 5-dimension scoring tests
    |-- 04--benchmark-integration/     Benchmark integration tests
    |-- 05--reducer-dimensions/        Reducer dimensional tests
    `-- 06--end-to-end-loop/           Full pipeline tests
```

---

## 6. SCRIPTS

| Script | Purpose | Key Flags |
| --- | --- | --- |
| `scan-integration.cjs` | Discover all surfaces an agent touches | `--agent=NAME [--output=PATH]` |
| `generate-profile.cjs` | Derive scoring profile from any agent | `--agent=PATH [--output=PATH]` |
| `score-candidate.cjs` | Score candidate across 5 dimensions (dynamic mode only) | `--candidate=PATH [--target=PATH] [--manifest=PATH]` |
| `run-benchmark.cjs` | Run fixture tests + integration checks | `--profile=ID --outputs-dir=PATH --output=PATH [--integration-report=PATH]` |
| `reduce-state.cjs` | Refresh dashboard + registry from ledger | `RUNTIME_ROOT` (positional) |
| `promote-candidate.cjs` | Guarded canonical promotion | `--candidate=PATH --target=PATH --score=PATH --approve` |
| `rollback-candidate.cjs` | Restore pre-promotion backup | `--target=PATH --backup=PATH` |
| `check-mirror-drift.cjs` | Report declared-surface alignment status | `--output=PATH [--canonical=PATH] [--mirrors=A,B,C] [--manifest=PATH]` |

---

## 7. CONFIGURATION

| File | Purpose |
| --- | --- |
| `assets/improvement_config.json` | Runtime config: scoring weights, stop rules, feature flags |
| `assets/improvement_config_reference.md` | Field-level config documentation |
| `assets/target_manifest.jsonc` | Target classification, mutability, and dynamic profile settings |

### Key Configuration

| Setting | Default | Effect |
| --- | --- | --- |
| `proposalOnly` | `true` | Candidates cannot be promoted until flipped |
| `dynamicProfileEnabled` | `true` | Required; dynamic mode is the sole scoring path |
| `dimensionWeights` | `{structural: 0.20, ruleCoherence: 0.25, ...}` | Weights for 5D scoring |
| `stopOnDimensionPlateau` | `true` | Stop when all dimensions plateau |
| `thresholdDelta` | `2` | Minimum score improvement for candidate-better |
| `minimumAggregateScore` | `85` | Benchmark pass threshold |

---

## 8. USAGE EXAMPLES

### Example 1: Evaluate Any Agent (Dynamic Mode)

```text
/improve:agent ".opencode/agent/debug.md" :confirm --spec-folder={spec_folder}
```

Generates a scoring profile on-the-fly from the debug agent's own rules and structure, then produces 5-dimension scores. Dynamic mode is the only evaluation path; promotion requires explicit per-target approval.

### Example 2: Quick Integration Health Check

```text
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug
```

Discovers all surfaces the target agent touches and reports mirror sync status, command coverage, and skill references.

### Example 3: Score Without Running the Full Loop

```text
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate=.opencode/agent/review.md
```

Produces a 5-dimension score for the review agent without initializing a full improvement packet.

### Example 4: Inspect Runtime Evidence

After running the loop, inspect:
- `{spec_folder}/improvement/agent-improvement-dashboard.md` — Dimensional progress and stop status
- `{spec_folder}/improvement/experiment-registry.json` — Per-profile metrics and best-known state
- `{spec_folder}/improvement/integration-report.json` — Integration surface inventory

---

## 9. RUNTIME PARITY

The skill runs across all supported runtimes. Path resolution uses the active runtime profile:

| Runtime | Agent Path | Command Path |
| --- | --- | --- |
| OpenCode/Copilot | `.opencode/agent/` | `.opencode/command/spec_kit/` |
| Claude | `.claude/agents/` | (uses agent mirror) |
| Codex | `.codex/agents/` | (uses agent mirror) |
| .agents | `.agents/agents/` | `.agents/commands/spec_kit/` |

The `@improve-agent` agent and `/improve:agent` command are mirrored across all runtimes. The integration scanner checks mirror parity automatically.

---

## 10. TROUBLESHOOTING

| Problem | Likely Cause | Fix |
| --- | --- | --- |
| Candidate scores but benchmark fails | Output contract is weaker than the prompt | Read the target profile fixtures and rerun |
| Benchmark scores drift across repeats | Fixtures are unstable or non-deterministic | Stop and treat run as untrustworthy until repeatability is fixed |
| Promotion is refused | One of the promotion gates is missing | Check score delta, benchmark report, repeatability, target, and approval |
| Mirrors differ after promotion | Packaging drift not handled yet | Run `scan-integration.cjs` and record follow-up sync work |
| Dynamic scorer returns 0 on all dimensions | Profile generation failed | Run `generate-profile.cjs` directly and check for parse errors |
| Integration dimension scores low | Mirrors diverged or missing | Run `scan-integration.cjs`, sync diverged mirrors, then rescore |
| All dimensions plateaued | Improvement loop has exhausted current hypothesis | Stop, reassess the hypothesis in `improvement_strategy.md` |
| Scorer produces `infra_failure` | Agent file not found or unreadable | Verify the `--candidate` path exists and is a valid agent `.md` file |

---

## 11. FAQ

### Why not edit the canonical target directly?

The point of the skill is to prove improvement before mutation. Ad-hoc edits skip the evidence trail that makes promotion decisions auditable and rollbacks possible.

### How is promotion eligibility decided?

Promotion is a per-target decision made under dynamic mode. A candidate becomes promotion-eligible only when prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval all pass for that specific target.

### What does the integration scanner check?

It discovers all files that reference a given agent: canonical definition, 3 runtime mirrors, command dispatch files, YAML workflow references, skill SKILL.md mentions, global docs (CLAUDE.md), and skill_advisor routing entries.

### How are agents evaluated?

Dynamic mode is the only path. The profile generator derives scoring checks from the agent's own ALWAYS/NEVER rules, output verification checklist, capability scan, and anti-patterns. Any agent in `.opencode/agent/` is a valid target.

### What happens when all dimensions plateau?

When all 5 dimensions have 3+ consecutive identical scores, the reducer triggers `stopOnDimensionPlateau`. This means the current improvement hypothesis is exhausted. Update the strategy and candidate focus before continuing.

### How is the weighted score computed?

Each dimension score (0-100) is multiplied by its weight, then summed: `structural * 0.20 + ruleCoherence * 0.25 + integration * 0.25 + outputQuality * 0.15 + systemFitness * 0.15`. A score >= 70 is `candidate-acceptable`.

---

## 12. RELATED DOCUMENTS

### Core References

- [SKILL.md](./SKILL.md) — Skill router and core instructions
- [feature_catalog.md](./feature_catalog/feature_catalog.md) — Canonical feature inventory across evaluation loop, integration scanning, and scoring system
- [quick_reference.md](./references/quick_reference.md) — Short command and dimension reminder
- [loop_protocol.md](./references/loop_protocol.md) — End-to-end operator workflow
- [evaluator_contract.md](./references/evaluator_contract.md) — 5-dimension scoring and benchmark contract

### Operations

- [benchmark_operator_guide.md](./references/benchmark_operator_guide.md) — Fixture benchmark execution
- [promotion_rules.md](./references/promotion_rules.md) — Keep, reject, promote decisions
- [rollback_runbook.md](./references/rollback_runbook.md) — Promotion and rollback procedure
- [mirror_drift_policy.md](./references/mirror_drift_policy.md) — Mirror packaging policy

### Onboarding

- [target_onboarding.md](./references/target_onboarding.md) — Adding new bounded targets
- [integration_scanning.md](./references/integration_scanning.md) — Integration scanner documentation
- [improvement_config_reference.md](./assets/improvement_config_reference.md) — Config field documentation

### Testing

- [manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) — 21-scenario validation matrix
