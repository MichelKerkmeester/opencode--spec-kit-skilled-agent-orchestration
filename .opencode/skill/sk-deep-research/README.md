---
title: sk-deep-research
description: Autonomous deep research loop with lineage-aware lifecycle branches, reducer-owned packet synchronization, and runtime parity guidance.
trigger_phrases:
  - "deep research loop"
  - "autonomous iterative research"
  - "lineage aware research"
  - "fresh context research"
  - "reducer synchronized research packet"
---

# sk-deep-research

> Autonomous multi-iteration research loop for topics that need repeated investigation, fresh context per iteration, and durable packet state on disk.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [LIFECYCLE MODES](#5--lifecycle-modes)
6. [RUNTIME PARITY](#6--runtime-parity)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`sk-deep-research` is research-only. It runs repeated investigation cycles through `/spec_kit:deep-research`, dispatching a fresh `@deep-research` agent for each iteration while keeping continuity in packet files instead of live conversation memory.

The packet is now lineage-aware. Every run carries `sessionId`, `parentSessionId`, `lineageMode`, `generation`, and `continuedFromRun`, so the workflow can distinguish an active resume from a restart, a fork, or a completed lineage that is being reopened.

The packet is also reducer-synchronized. The agent writes the iteration file plus the JSONL record. The workflow reducer then updates the machine-owned packet surfaces so `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, and synthesis metadata cannot drift apart.

For iterative code review, use `sk-deep-review`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"
/spec_kit:deep-research:confirm "Distributed cache invalidation patterns"
/spec_kit:deep-research:auto "API backpressure patterns" --max-iterations 6 --convergence 0.03
```

What the workflow creates under `{spec_folder}/research/`:

- `deep-research-config.json`
- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `iterations/iteration-NNN.md`
- `research.md`

Pause a running loop by creating `research/.deep-research-pause`. Delete that file to let the workflow continue from the next lifecycle check.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

| Feature | Description |
|---------|-------------|
| Fresh context per iteration | Each iteration uses a fresh LEAF agent dispatch. |
| Lineage-aware lifecycle | Supports `resume`, `restart`, `fork`, and `completed-continue`. |
| Reducer synchronization | Strategy, dashboard, registry, and synthesis metadata are updated from canonical iteration outputs. |
| Packet-first recovery | Hook and non-hook runtimes derive the same next action from packet files. |
| Runtime capability matrix | One documented and machine-readable source of truth for provider quirks and parity expectations. |
| Progressive synthesis | `research.md` can be updated incrementally and is finalized during synthesis. |
| Negative knowledge | Ruled-out directions and dead ends are preserved as first-class outputs. |
| Quality guards | Source diversity, focus alignment, and weak-source checks must pass before STOP is accepted. |
| 3-signal convergence model | Composite stop decision uses three weighted signals: Rolling Average (0.45), MAD Noise Floor (0.30), and Coverage/Age (0.25). STOP requires weighted score > 0.60 threshold. |
| Graph-aware legal-stop checks | When `graphEvents` exist, structural graph signals add extra STOP-blocking evidence on top of the standard convergence math. |
| Semantic coverage graph | Each iteration emits `graphEvents` (nodes + edges) in JSONL, building an in-memory coverage graph with relation types (ANSWERS, SUPPORTS, CONTRADICTS, SUPERSEDES, DERIVED_FROM, COVERS, CITES). |
| Graph convergence guards | STOP-blocking guards: sourceDiversity (>= 0.4) and evidenceDepth (>= 1.5) must pass before convergence is accepted, preventing premature termination from single-source or shallow-evidence research. |
| Question coverage tracking | Graph tracks which research questions have ANSWERS edges, computing an answerCoverage ratio that contributes to the convergence score. |
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
.opencode/skill/sk-deep-research/
  SKILL.md
  README.md
  references/
    capability_matrix.md
    convergence.md
    loop_protocol.md
    quick_reference.md
    state_format.md
  assets/
    deep_research_config.json
    deep_research_dashboard.md
    deep_research_strategy.md
```

Runtime packet layout:

```text
{spec_folder}/research/
  deep-research-config.json
  deep-research-state.jsonl
  deep-research-strategy.md
  findings-registry.json
  deep-research-dashboard.md
  .deep-research-pause
  research.md
  archive/
    {sessionId}/
  iterations/
    iteration-001.md
    iteration-002.md
```

Ownership model:

- Agent-owned writes: `iteration-NNN.md`, JSONL iteration/event append, optional progressive synthesis content.
- Reducer-owned writes: `deep-research-strategy.md` machine-owned sections, `findings-registry.json`, `deep-research-dashboard.md`.
- Workflow-owned output: `research.md` and lifecycle snapshot files such as `synthesis-v{generation}.md`.
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:lifecycle-modes -->
## 5. LIFECYCLE MODES

| Mode | Meaning |
|------|---------|
| `resume` | Continue the active lineage with the same `sessionId`. |
| `restart` | Start a new generation with explicit parent linkage and archive the prior packet state. |
| `fork` | Create a sibling lineage from the current packet state. |
| `completed-continue` | Reopen a completed lineage only after snapshotting the prior synthesis as immutable `synthesis-v{generation}.md`. |

Legacy artifact names remain read-only migration aliases for a 4-week window. The workflow writes only canonical `deep-research-*` names and emits migration events when it consumes a legacy alias.
<!-- /ANCHOR:lifecycle-modes -->

---

<!-- ANCHOR:runtime-parity -->
## 6. RUNTIME PARITY

The workflow resolves the runtime mirror from the active CLI, but every mirror must preserve the same packet contract:

| Runtime | Mirror |
|---------|--------|
| OpenCode / Copilot | `.opencode/agent/deep-research.md` |
| Claude | `.claude/agents/deep-research.md` |
| Codex | `.codex/agents/deep-research.toml` |
| Gemini | `.gemini/agents/deep-research.md` |

Read `.opencode/skill/sk-deep-research/references/capability_matrix.md` for the parity checklist and `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json` plus `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs` for the machine-readable lookup path.
<!-- /ANCHOR:runtime-parity -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| Problem | Check |
|---------|-------|
| Packet resumes when you expected a new run | Inspect `config.lineage` and the latest lifecycle event in `deep-research-state.jsonl`. |
| Strategy/dashboard drift | Confirm the reducer ran and regenerated `findings-registry.json` and `deep-research-dashboard.md`. |
| JSONL parse failure | Run `cat research/deep-research-state.jsonl | jq .` and fall back to iteration-file reconstruction if needed. |
| Runtime mirror behaves differently | Compare the mirror against `references/capability_matrix.md`. |
| Loop will not continue after pause | Remove `research/.deep-research-pause` and restart the command so the lifecycle check can emit `resumed`. |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Does the agent still edit `deep-research-strategy.md` directly?**
A: Not as the source of truth. The reducer owns the machine-managed sections so packet state stays synchronized.

**Q: What is the difference between `restart` and `completed-continue`?**
A: `restart` begins a new generation from an active or inactive packet and archives prior state. `completed-continue` reopens a completed lineage after snapshotting the old synthesis boundary.

**Q: Can non-hook runtimes use the same workflow safely?**
A: Yes. Packet files are the authority. Hooks only improve startup ergonomics.

**Q: Where should review work go now?**
A: Use `sk-deep-review` and `/spec_kit:deep-review`.
<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource | Purpose |
|----------|---------|
| `SKILL.md` | Full protocol and rules |
| `references/loop_protocol.md` | Detailed lifecycle and reducer sequencing |
| `references/state_format.md` | Canonical config, JSONL, registry, and dashboard schemas |
| `references/convergence.md` | Stop and recovery logic, including graph-aware legal-stop behavior |
| `manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Operator test case for graph stop guards and blocked-stop behavior |
| `references/capability_matrix.md` | Runtime parity source of truth |
| `sk-deep-review` | Dedicated iterative code review skill |
<!-- /ANCHOR:related-documents -->
