---
title: "sk-improve-agent: Feature Catalog"
description: "Unified reference combining the evaluation loop, integration scanning, and scoring surfaces that currently ship in sk-improve-agent."
---

# sk-improve-agent: Feature Catalog

This document combines the current feature inventory for the `sk-improve-agent` system into a single reference. The root catalog acts as the system-level directory: it summarizes the evaluation loop, the integration scanner, and the deterministic scoring stack, then points to the per-feature files that carry the deeper implementation and validation anchors.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. EVALUATION LOOP](#2--evaluation-loop)
- [3. INTEGRATION SCANNING](#3--integration-scanning)
- [4. SCORING SYSTEM](#4--scoring-system)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `sk-improve-agent` feature surface. The numbered sections below group the skill by runtime responsibility so readers can move from a top-level summary into per-feature reference files without losing the current code and operator-contract context behind each claim.

| Category | Coverage | Primary Runtime Surface |
|---|---:|---|
| Evaluation loop | 6 features | `.opencode/command/improve/agent.md`, improve-agent YAML workflows, `scripts/*.cjs` |
| Integration scanning | 3 features | `scan-integration.cjs`, `/improve:agent`, `.opencode/agent/improve-agent.md` |
| Scoring system | 4 features | `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs` |

---

## 2. EVALUATION LOOP

These entries cover the session lifecycle from fresh runtime setup through proposal-only candidate generation, scoring dispatch, guarded promotion, rollback, and the stop logic that decides when the loop should stop asking for more iterations.

### Initialization

#### Description

Sets up a fresh packet-local improve-agent session before any candidate work begins.

#### Current Reality

The shipped workflow only supports fresh `new` sessions. Both YAML workflows create `{spec_folder}/improvement/`, scan the target integration surface, generate a dynamic profile when requested, copy the config, strategy, charter, and manifest templates, record baseline state, and emit a `session_start` journal row before iteration one.

#### Source Files

See [`01--evaluation-loop/01-initialization.md`](01--evaluation-loop/01-initialization.md) for full implementation and validation file listings.

---

### Candidate generation

#### Description

Writes one bounded packet-local candidate without mutating the canonical target.

#### Current Reality

Candidate generation is delegated to the `improve-agent` subagent. That agent must read the copied charter and manifest first, must write only under the packet-local runtime area, returns structured metadata, and stops before scoring, benchmarking, promotion, or mirror synchronization begins.

#### Source Files

See [`01--evaluation-loop/02-candidate-generation.md`](01--evaluation-loop/02-candidate-generation.md) for full implementation and validation file listings.

---

### Scoring dispatch

#### Description

Routes a generated candidate through scoring, evidence recording, and state reduction.

#### Current Reality

The loop dispatches `score-candidate.cjs`, records mutation coverage, writes journal events, and refreshes the dashboard with `reduce-state.cjs`. Benchmark stability and trade-off checks are wired as concrete commands, while the benchmark runner itself still appears as an action placeholder in the YAML workflows, so fully automatic benchmark execution depends on operator wiring or wrapper logic outside the YAML text.

#### Source Files

See [`01--evaluation-loop/03-scoring-dispatch.md`](01--evaluation-loop/03-scoring-dispatch.md) for full implementation and validation file listings.

---

### Promotion gates

#### Description

Defines the narrow conditions under which a packet-local candidate can become promotion-eligible.

#### Current Reality

The policy surface requires explicit approval, benchmark pass, repeatability pass, manifest compliance, and a meaningful improvement threshold. The promotion helper is stricter than the current scorer output: it still requires `candidate-better` plus `score.delta`, while `score-candidate.cjs` currently emits `candidate-acceptable` or `needs-improvement` and does not add a delta field.

#### Source Files

See [`01--evaluation-loop/04-promotion-gates.md`](01--evaluation-loop/04-promotion-gates.md) for full implementation and validation file listings.

---

### Rollback

#### Description

Restores the archived canonical target after a guarded promotion has already happened.

#### Current Reality

Rollback is a separate helper, not an implicit part of promotion. The shipped rollback script validates the runtime config target and the single canonical target in the manifest, then copies the saved backup over the canonical file; journal emission, mirror review, and post-rollback re-scoring remain separate orchestration steps.

#### Source Files

See [`01--evaluation-loop/05-rollback.md`](01--evaluation-loop/05-rollback.md) for full implementation and validation file listings.

---

### Plateau detection

#### Description

Stops the loop when repeated runs no longer produce useful movement.

#### Current Reality

Two stop models are live. `reduce-state.cjs` can stop when all tracked dimensions plateau with exact repeated scores across the configured plateau window, while `mutation-coverage.cjs`, `trade-off-detector.cjs`, and `benchmark-stability.cjs` separately gate convergence, trade-off analysis, and replay stability behind a minimum of three scored samples.

#### Source Files

See [`01--evaluation-loop/06-plateau-detection.md`](01--evaluation-loop/06-plateau-detection.md) for full implementation and validation file listings.

---

## 3. INTEGRATION SCANNING

These entries describe how sk-improve-agent discovers the full agent surface across the repo, evaluates runtime mirrors, and wires command-driven orchestration through the improve-agent command and YAML workflows.

### Surface discovery

#### Description

Builds the inventory of files and references that define an agent beyond its canonical markdown file.

#### Current Reality

`scan-integration.cjs` scans the canonical agent file, three runtime mirrors, improve command markdown, YAML workflow assets, skill references, global docs, and a skill-advisor path constant. That path now points at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`, so the consolidated skill-advisor surface is included in the integration map.

#### Source Files

See [`02--integration-scanning/01-surface-discovery.md`](02--integration-scanning/01-surface-discovery.md) for full implementation and validation file listings.

---

### Runtime mirrors

#### Description

Checks whether the runtime-specific mirrors still reflect the canonical agent body closely enough.

#### Current Reality

Mirror parity is signal-based, not byte-for-byte. The scanner strips frontmatter, extracts up to three emphasized signal strings from the canonical body, and marks a mirror `aligned` when at least two signals appear in the mirror body; it currently checks `.claude/agents`, `.codex/agents`, and `.agents/agents`, but not `.gemini/agents`.

#### Source Files

See [`02--integration-scanning/02-runtime-mirrors.md`](02--integration-scanning/02-runtime-mirrors.md) for full implementation and validation file listings.

---

### Command dispatch

#### Description

Owns the command-driven orchestration path that turns the improve-agent skill into a runnable loop.

#### Current Reality

The `/improve:agent` command collects setup inputs, selects `:auto` or `:confirm` execution, and points the operator at the matching YAML workflow. The actual loop dispatch lives in the YAML assets, which rescan integration, dispatch `@improve-agent`, emit journal events, and call score and reducer helpers, while the command markdown explicitly says not to dispatch agents from the command file itself.

#### Source Files

See [`02--integration-scanning/03-command-dispatch.md`](02--integration-scanning/03-command-dispatch.md) for full implementation and validation file listings.

---

## 4. SCORING SYSTEM

These entries describe the dynamic scoring stack that derives evaluation structure from the target agent, applies the five-dimension rubric, records deterministic score outputs, and turns repeated runs into dimensional progress and stop-state summaries.

### Five-dimension rubric

#### Description

Defines the weighted evaluation model used to judge prompt-surface quality.

#### Current Reality

Dynamic scoring uses five weighted dimensions: structural integrity, rule coherence, integration consistency, output quality, and system fitness. Each dimension has a concrete checker in `score-candidate.cjs`, with integration itself delegated to the integration scanner and output quality penalized when placeholder strings remain in the candidate.

#### Source Files

See [`03--scoring-system/01-five-dimension-rubric.md`](03--scoring-system/01-five-dimension-rubric.md) for full implementation and validation file listings.

---

### Dynamic profiling

#### Description

Generates a target-specific evaluation profile directly from the agent being scored.

#### Current Reality

No static evaluation profiles ship in the current release. `generate-profile.cjs` parses frontmatter, sections, rules, output checklists, related-resource tables, and denied permissions to build a derived profile on the fly, while `target_manifest.jsonc` keeps `targets` empty and points runtime consumers at the dynamic-profile script instead of a fixed catalog.

#### Source Files

See [`03--scoring-system/02-dynamic-profiling.md`](03--scoring-system/02-dynamic-profiling.md) for full implementation and validation file listings.

---

### Deterministic scoring

#### Description

Produces the score and benchmark evidence that later gates consume.

#### Current Reality

`score-candidate.cjs` always runs in `dynamic-5d` mode, regenerates the profile every run, allows optional weight overrides, and emits structured dimension details plus `candidate-acceptable` or `needs-improvement`. `run-benchmark.cjs` is also deterministic, but it still expects a profile JSON and fixture directory under `assets/target-profiles`, so benchmark gating only becomes runnable when that profile-specific artifact set exists.

#### Source Files

See [`03--scoring-system/03-deterministic-scoring.md`](03--scoring-system/03-deterministic-scoring.md) for full implementation and validation file listings.

---

### Dimensional progress

#### Description

Reduces raw run records into trends, best-known state, and operator-facing stop guidance.

#### Current Reality

`reduce-state.cjs` aggregates the JSONL ledger into `experiment-registry.json` and `agent-improvement-dashboard.md`, records latest and best values per dimension, adds sample-quality, journal, lineage, and mutation-coverage summaries, and computes stop status. It treats both `candidate-acceptable` and `candidate-better` as accepted candidates when building the registry.

#### Source Files

See [`03--scoring-system/04-dimensional-progress.md`](03--scoring-system/04-dimensional-progress.md) for full implementation and validation file listings.
