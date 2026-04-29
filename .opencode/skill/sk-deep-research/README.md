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

The packet is now lineage-aware. Every run carries `sessionId`, `parentSessionId`, `lineageMode`, `generation`, and `continuedFromRun`, so the workflow can distinguish an active resume from a restart. `fork` and `completed-continue` are reserved for a future release and are not runtime-supported today — see `references/loop_protocol.md §Lifecycle Branches` for the canonical one-session contract.

The packet is also reducer-synchronized. The agent writes the iteration file plus the JSONL record. The workflow reducer then updates the machine-owned packet surfaces so `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, and synthesis metadata cannot drift apart.

The workflow also anchors every run to a real `spec.md`. During late INIT it follows [`references/spec_check_protocol.md`](references/spec_check_protocol.md): acquire `research/.deep-research.lock`, classify `folder_state` as `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`, and then either seed a Level 1 spec or append bounded context before LOOP starts.

During SYNTHESIS the same contract replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block under the chosen host anchor while keeping `research/research.md` canonical.

Outside the research loop itself, `/spec_kit:resume` remains the canonical recovery surface for packet work. Continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay supporting only.

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

What the workflow creates under the resolved `{artifact_dir}`:

- `deep-research-config.json`
- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `iterations/iteration-NNN.md`
- `research.md`

The artifact directory always lives under the target spec's local `research/` folder. First runs with an empty local folder use `{spec_folder}/research/` directly, including child-phase and sub-phase targets. A `{spec_folder}/research/{ownerSlug}-pt-NN/` packet is allocated only when prior local content already exists for a different target. Pause a running loop by creating `.deep-research-pause` inside the resolved `{artifact_dir}`, then delete it to let the workflow continue from the next lifecycle check.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

| Feature | Description |
|---------|-------------|
| Fresh context per iteration | Each iteration uses a fresh LEAF agent dispatch. |
| Lineage-aware lifecycle | Supports `new`, `resume`, and `restart`. `fork` and `completed-continue` are deferred — see `references/loop_protocol.md §Lifecycle Branches`. |
| Reducer synchronization | Strategy, dashboard, registry, and synthesis metadata are updated from canonical iteration outputs. |
| Packet-first recovery | Hook and non-hook runtimes derive the same next action from packet files. |
| Runtime capability matrix | One documented and machine-readable source of truth for provider quirks and parity expectations. |
| `spec.md` anchoring | Late INIT follows `references/spec_check_protocol.md` to seed or sync bounded packet context before LOOP begins. |
| Folder-state contract | `folder_state` resolves to `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected` before any `spec.md` mutation branch runs. |
| Advisory lock + generated fence | The workflow holds `research/.deep-research.lock` through synthesis and replaces one `BEGIN/END GENERATED` findings block in `spec.md`. |
| Progressive synthesis | `research.md` can be updated incrementally and is finalized during synthesis. |
| Negative knowledge | Ruled-out directions and dead ends are preserved as first-class outputs. |
| Quality guards | Source diversity, focus alignment, and weak-source checks must pass before STOP is accepted. |
| 3-signal convergence model | Composite stop decision uses three weighted signals: Rolling Average (0.45), MAD Noise Floor (0.30), and Coverage/Age (0.25). STOP requires weighted score > 0.60 threshold. |
| Graph-aware legal-stop checks | When `graphEvents` exist, structural graph signals add extra STOP-blocking evidence on top of the standard convergence math. |
| Semantic coverage graph | Each iteration emits `graphEvents` (nodes + edges) in JSONL, building an in-memory coverage graph with relation types (ANSWERS, SUPPORTS, CONTRADICTS, SUPERSEDES, DERIVED_FROM, COVERS, CITES). |
| Graph convergence guards | STOP-blocking guards: sourceDiversity (>= 0.4) and evidenceDepth (>= 1.5) must pass before convergence is accepted, preventing premature termination from single-source or shallow-evidence research. |
| Question coverage tracking | Graph tracks which research questions have ANSWERS edges, computing an answerCoverage ratio that contributes to the convergence score. |
| Fail-closed corruption handling | The reducer throws a structured error before writing any derived files when JSONL corruption is detected in non-lenient mode. |
| Graph convergence fallback | When `blendedScore` is absent from `graph_convergence` events, the reducer uses a numeric fallback instead of collapsing to zero. |
| Terminal stop metadata | The reducer parses `synthesis_complete` events to derive authoritative dashboard status rather than relying on stale config. |
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
  feature_catalog/
    feature_catalog.md
    01--loop-lifecycle/
    02--state-management/
    03--convergence/
    04--research-output/
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
  {ownerSlug}-pt-NN/                 # Conditional: prior non-matching content exists
```

Ownership model:

- Agent-owned writes: `iteration-NNN.md`, JSONL iteration/event append, optional progressive synthesis content.
- Reducer-owned writes: `deep-research-strategy.md` machine-owned sections, `findings-registry.json`, `deep-research-dashboard.md`.
- Workflow-owned output: `research.md` and lifecycle snapshot files such as `synthesis-v{generation}.md`.
- Protocol-owned packet mutations: bounded `spec.md` seeding, context append, advisory lock lifecycle, and generated-fence replacement defined in `references/spec_check_protocol.md`.
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:lifecycle-modes -->
## 5. LIFECYCLE MODES

| Mode | Meaning |
|------|---------|
| `new` | First run against this spec folder. No prior state. |
| `resume` | Continue the active lineage with the same `sessionId`. Persisted as a `resumed` JSONL event. |
| `restart` | Start a new generation with explicit parent linkage and archive the prior `research/` tree under `research_archive/{timestamp}/`. Persisted as a `restarted` JSONL event. |
| `fork` (deferred) | Reserved. Earlier drafts described this as a sibling-lineage branch; the runtime does not emit lineage events for `fork` today. Do not expose it in user-facing workflows. |
| `completed-continue` (deferred) | Reserved. Earlier drafts described snapshotting the prior synthesis as immutable `synthesis-v{generation}.md`; the runtime does not emit lineage events for `completed-continue` today. |

See `references/loop_protocol.md §Lifecycle Branches` for the canonical event contract. Legacy artifact names remain read-only migration aliases for a 4-week window. The workflow writes only canonical `deep-research-*` names and emits migration events when it consumes a legacy alias.
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
| `spec.md` write is blocked | Inspect `folder_state`, `research/.deep-research.lock`, and the conflict details defined in `references/spec_check_protocol.md`. |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Does the agent still edit `deep-research-strategy.md` directly?**
A: Not as the source of truth. The reducer owns the machine-managed sections so packet state stays synchronized.

**Q: What is the difference between `resume` and `restart`?**
A: `resume` continues the same `sessionId` and generation, leaving the `research/` tree in place; the workflow appends a `resumed` JSONL event. `restart` archives the existing `research/` tree under `research_archive/{timestamp}/`, mints a fresh `sessionId`, increments `generation`, and appends a `restarted` JSONL event. Both events share the full lineage-contract field set documented in `references/loop_protocol.md §Lifecycle Branches`.

**Q: What happened to `fork` and `completed-continue`?**
A: Both were described in earlier drafts but never shipped as runtime branches. They are deferred and the workflow no longer exposes them as options. If the long-form lineage feature is implemented later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat each run as a standalone session or use `restart` to archive the prior one.

**Q: Can non-hook runtimes use the same workflow safely?**
A: Yes. Packet files are the authority. Hooks only improve startup ergonomics.

**Q: What can `/spec_kit:deep-research` change in `spec.md`?**
A: Only the bounded mutations in `references/spec_check_protocol.md`: seed markers or pre-init context during INIT, plus one machine-owned `BEGIN GENERATED` / `END GENERATED` findings block during SYNTHESIS.

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
| `references/spec_check_protocol.md` | Bounded `spec.md` anchoring, `folder_state` rules, advisory lock lifecycle, and generated-fence write-back |
| `references/state_format.md` | Canonical config, JSONL, registry, and dashboard schemas |
| `references/convergence.md` | Stop and recovery logic, including graph-aware legal-stop behavior |
| `manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Operator test case for graph stop guards and blocked-stop behavior |
| `references/capability_matrix.md` | Runtime parity source of truth |
| `feature_catalog/feature_catalog.md` | Canonical feature inventory across loop lifecycle, state management, convergence, and research output |
| `sk-deep-review` | Dedicated iterative code review skill |
<!-- /ANCHOR:related-documents -->
