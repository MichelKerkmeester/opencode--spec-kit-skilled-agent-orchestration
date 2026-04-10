---
title: "Feature Specification: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Plan the next improvement wave for sk-deep-research and sk-deep-review by turning the consolidated research findings into an implementation-ready Level 3 packet."
trigger_phrases:
  - "042"
  - "deep research"
  - "deep review"
  - "runtime improvement"
  - "claim verification ledger"
  - "coordination board"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet converts the consolidated agentic-systems research into one implementation plan for the two autonomous deep-loop products: `sk-deep-research` and `sk-deep-review`. The work is centered on runtime truth, not feature sprawl: real stop reasons, legal completion gates, resume-from-run semantics, auditability, claim verification, behavior-first tests, and richer dashboards that make loop state easier to trust and resume.

**Key Decisions**: keep research and review as explicit products instead of collapsing them into a generic workflow DSL; make council synthesis and coordination-board support opt-in instead of default; treat journals, ledgers, and behavior tests as first-class runtime artifacts.

**Critical Dependencies**: consolidated research findings `CF-004`, `CF-010`, `CF-014`, `CF-021`, `CF-027`, and `CF-030`; existing deep-loop reducer and parity tests; packet-local, append-only state discipline.

This revision also incorporates five newly identified packet gaps from `scratch/codex-gpt54-deep-research.md`: reducer snapshot/compaction, packet-local observability, large-target decomposition, semantic convergence signals, and deep-review reducer ownership for machine-managed sections, plus an upfront agent-instruction cleanup gate so field names and reducer ownership rules are normalized before broader runtime changes begin.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Dependencies** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md`; current deep-loop assets, YAML workflows, reducer/tests |
| **Predecessor** | Related background packets: `028-auto-deep-research-review-improvement`, `040-sk-auto-deep-research-review-improvement` |
| **Successor** | Follow-on implementation phases to be created from this packet after planning approval |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current deep-loop stack is functional, but it still treats "converged" as a mostly inferred state instead of a strongly explained runtime truth. Deep research and deep review already have JSONL state, dashboards, and reducer/parity coverage, yet the consolidated research shows clear gaps around stop-reason taxonomy, legal done gates, resume/start-from behavior, research claim verification, audit trails, richer dashboards, behavior-first test coverage, and large-run coordination.

Those gaps matter because the two deep-loop products are long-running, artifact-heavy workflows. When they stop, resume, or synthesize, operators need to know exactly why the system behaved that way and which evidence backs the outcome. Without that, the runtime remains auditable only for people willing to reverse-engineer JSONL logs and reducer behavior by hand.

### Purpose

Define an implementation-ready plan that upgrades deep research and deep review into better-audited, better-tested, and easier-to-resume loop products while keeping their explicit LEAF-worker architecture and packet-local artifact model intact.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Real completion-gate planning for both deep-loop products, including named stop reasons, binary done checks, and resume-from-run semantics.
- Research-quality runtime artifacts: claim-verification ledger, publication critique, runtime-surface inventory, and promotion checkpoints.
- Dashboard upgrades for both loops: liveness, convergence trends, timing/token visibility, coverage depth, and severity trends.
- Append-only audit-journal planning for both loops.
- Reducer durability for 100+ iteration packets, including delta replay, replay validation, and periodic snapshot/compaction policy.
- Packet-local observability and tracing surfaces: timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down.
- Large-target decomposition policies for 1000+ file review scopes and 50+ domain research scopes.
- Semantic convergence signals that combine novelty, contradiction density, and citation overlap with existing statistical checks.
- Behavior-first automated verification planning for reducers, workflows, and loop outputs.
- Optional, explicit advanced modes: council-style synthesis and packet-level coordination boards for large multi-phase research.
- Shared loop-runtime surfaces under `scripts/` and current contract/parity tests that must move with these runtime changes.

### Out of Scope

- Direct implementation of any skill, command, agent, reducer, or test changes.
- Changes outside the deep-research/deep-review skill families, their commands, their agents, and shared loop runtime/test infrastructure.
- Replacing research/review with a generic hidden workflow DSL. The consolidated report explicitly rejects that direction.
- Broader operator-shell compression, guided bootstrap, or memory-platform redesign work from other research bundles unless it is directly required by the scoped runtime improvements in this packet.
- A new `mcp_server/` implementation. No current `mcp_server/` surface was identified for these deep-loop products during packet discovery.

### Files to Change

#### Skills and Shared Runtime

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add the new completion-gate contract, ledger/journal behavior, optional council mode, and updated testing/runtime expectations. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, and resume-from-run lifecycle steps. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define stop-reason taxonomy, binary done gate, liveness, blocked-stop handling, and semantic convergence signals. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Modify | Keep operator-facing guidance aligned with the new defaults and opt-in modes. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and optional-mode configuration keys. |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add coverage/depth, domain clustering, promotion checkpoints, semantic convergence, and council/coordination planning sections. |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling convergence, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Extend reducer outputs for delta replay, snapshot/compaction, dashboard metrics, observability rollups, ledger rollups, journal rollups, and resume/stop metadata. |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Add the real done-gate contract, journal behavior, richer dashboard expectations, and behavior-test posture. |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define stop-reason taxonomy, all-dimensions-clean semantics, liveness, blocked-stop handling, and semantic convergence signals. |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, replay snapshots, observability events, decomposition metadata, time/token metrics, and coverage depth. |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Modify | Keep operator-facing review guidance aligned with the new defaults and optional modes. |
| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Make stop reasons, typed stop-decision events, done-gate conditions, reducer-owned machine sections, dashboard metrics, and audit-journal outputs canonical. |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and resume cursor fields. |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling severity trends, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |

#### Commands and Workflow Assets

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/deep-research.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, decomposition workflow steps, and resume-from-run handling. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, inventory/hotspot workflow steps, and resume-from-run handling. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |

#### Agents and Runtime Mirrors

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
| `.claude/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
| `.gemini/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
| `.codex/agents/deep-research.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
| `.agents/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
| `.claude/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
| `.gemini/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
| `.codex/agents/deep-review.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |

#### Tests

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Extend reducer coverage for journal, ledger, stop-reason, delta replay, snapshot/compaction, semantic convergence, and dashboard observability metrics. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | Modify | Extend schema/contract coverage for stop reasons, journals, reducer-owned machine sections, snapshot/compaction, observability metrics, decomposition metadata, and resume cursor fields. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Research Basis |
|----|-------------|---------------------|----------------|
| REQ-001 | Both deep-loop products MUST use a shared stop contract with two parts: a named `stopReason` enum plus a typed `legalStop` record, and the contract MUST include a mapping table from legacy stop labels. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy and a typed `legalStop` record with `blockedBy`, `gateResults`, and `replayInputs`; convergence docs include a mapping table from legacy stop labels into the new contract instead of silently dropping older reasons. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
| REQ-002a | Deep research and deep review MUST only treat STOP as legal when convergence math, coverage expectations, and binary quality gates all pass together. | The legal-stop design explicitly requires convergence, coverage, and quality gates to pass as one combined decision; STOP is never treated as legal based on novelty math alone, and the `legalStop.gateResults` record shows the full gate bundle. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
| REQ-002b | When a loop wants to STOP but cannot legally stop, it MUST persist a first-class blocked-stop event with reason, gate results, and recovery path, and that event MUST be replayable. | If convergence math votes STOP but coverage or quality gates fail, the workflow records a first-class `blockedStop` event with `stopReason`, `legalStop.gateResults`, and recovery metadata, leaves `status` non-terminal, and can replay the blocked-stop decision from packet-local artifacts without treating it as a mere continue side effect. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
| REQ-003 | Both loops MUST support `continuedFromRun` semantics consistently across both active resume and completed-continue flows, so a lineage can continue from an existing run boundary instead of reinitializing from run 1. | Config/state/workflow contracts define and preserve resume cursor data such as `continuedFromRun` or equivalent; command surfaces describe how resume, restart, fork, and completed-continue interact with start-from-run behavior, and active resume and completed-continue use the same continuation semantics instead of diverging by mode. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
| REQ-004 | Both loops MUST produce append-only audit journals as separate packet-local artifacts rather than cramming journal data into the iteration JSONL stream. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, the iteration JSONL remains focused on iteration events, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
| REQ-005 | Deep research MUST create a claim-verification ledger for major claims with quoted claim text, evidence references, verification status, and verification method/actor. | Research packets define a canonical ledger artifact, synthesis references it, and claims can be marked `verified`, `contradicted`, or `unresolved` with file/line evidence or explicit unresolved status. | `CF-014` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:212-221`] |
| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Research Basis |
|----|-------------|---------------------|----------------|
| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
| REQ-008 | Deep research MUST support publication critique annotations so synthesis distinguishes verified runtime code, README claims, marketing copy, and other weaker evidence classes. | Research iteration/synthesis surfaces include an explicit evidence-quality or publication-critique field that can be summarized in the dashboard or final research output without becoming mandatory for every minor observation. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
| REQ-010 | Council-style synthesis MUST be supported as an explicit opt-in profile for ambiguous research or architecture questions. | The plan defines named perspective iterations and a synthesis reconciliation iteration; default deep-research behavior remains unchanged unless the user or workflow explicitly selects council mode. | `CF-027` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:359-359`] |
| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
| REQ-012 | Command docs and YAML assets MUST surface the new lifecycle and optional-mode behavior without bloating the default operator path. | Default command examples remain compact; advanced behaviors are discoverable but explicitly marked as optional; confirm and auto workflows stay contract-compatible. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
| REQ-014 | Shared loop-runtime changes MUST preserve packet-local, explicit deep-loop products and avoid introducing a hidden generic DSL or non-auditable state channel. | The implementation plan keeps reducers, journals, ledgers, and dashboards explicit inside the research/review packets; shared helpers may be extracted, but domain-specific artifacts and LEAF semantics remain visible and testable. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:467-471`] |
| REQ-015 | Both loops MUST support delta replay plus periodic snapshots/compaction so reducer performance does not degrade on 100+ iteration packets. | Canonical state keeps authoritative append-only events while reducers consume latest deltas plus periodic snapshots; compaction policy is explicit, replay validation proves equivalent outputs before and after compaction, and packet durability remains packet-local. | Iteration 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:41-50`], Recommendation 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:211-214`] |
| REQ-016 | Both loops MUST expose packet-local observability surfaces with timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down. | Dashboards and reducers emit packet-local observability views sourced from runtime data such as `durationMs`, `toolsUsed`, and `sourcesQueried` or an explicit unknown fallback; stop-decision traces remain replayable and reducer-generated. | Iteration 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:143-152`], Recommendation 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:217-220`] |
| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |
| REQ-018 | Convergence detection MUST incorporate semantic novelty, contradiction density, and citation-graph overlap alongside the existing statistical and coverage signals. | Convergence docs and workflow/state contracts define a typed stop-decision trace that records novelty, contradiction, and citation-overlap inputs; blocked-stop events explain which semantic signals prevented or supported legal STOP. | Iteration 2 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:58-67`], Recommendation 5 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:215-218`] |
| REQ-019 | Deep-review machine-owned strategy sections MUST be reducer-owned, matching deep-research behavior. | Deep-review agent instructions stop editing machine-owned strategy/dashboard sections directly; reducer-owned sections are clearly labeled in review contracts, and parity/behavior coverage proves the boundary remains intact across runtimes. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |
| REQ-020 | Agent instruction cleanup MUST happen before broader runtime work begins: both deep-research and deep-review agent `.md` files must normalize field names, clarify reducer ownership boundaries, and fix strategy-edit expectations. | Canonical deep-research and deep-review agent docs use the same field names as the reducer/state contracts, spell out reducer-owned versus agent-owned sections, and deep-review no longer instructs agents to directly edit machine-owned strategy sections before later runtime phases begin. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet defines a single shared stop contract for both deep research and deep review with a `stopReason` enum, a typed `legalStop` record, and a legacy-reason mapping table.
- **SC-002**: The packet separates foundational runtime work from optional advanced modes, with council synthesis and coordination boards explicitly marked opt-in.
- **SC-003**: The packet lists all core implementation files, shared runtime surfaces, and verification files required to ship the scoped runtime improvements.
- **SC-004**: Every requirement maps to research evidence from the consolidated report and can be traced to at least one concrete file set.
- **SC-005**: The plan includes a dependency-ordered delivery path that ships runtime-truth foundations before optional orchestration features.
- **SC-006**: The task breakdown assigns concrete file targets and parent requirements for each planned change, with all tasks starting in `Pending`.
- **SC-007**: The checklist provides one verification item per requirement, with evidence format and test references.
- **SC-008**: The decision record captures the requested architecture choices, including the new durability, testing-order, semantic-convergence, and recovery-ladder ADRs, with rationale, alternatives, and rollback thinking.
- **SC-009**: `implementation-summary.md` exists as a placeholder only and does not over-claim implementation work.
- **SC-010**: `validate.sh --strict` passes for this packet after the planning documents are written.
- **SC-011**: The packet defines reducer snapshot/compaction and replay-validation requirements for both loops without weakening packet-local durability.
- **SC-012**: The packet defines packet-local observability surfaces and typed stop-decision drill-down for both dashboards.
- **SC-013**: The packet makes large-target decomposition explicit for both 1000+ file review scopes and 50+ domain research scopes.
- **SC-014**: The packet upgrades convergence from statistical-only signaling to a typed decision trace with semantic novelty, contradiction density, and citation overlap.
- **SC-015**: The packet moves deep-review machine-owned sections under reducer ownership and reflects that boundary in tasks, tests, and ADRs.
- **SC-016**: The packet requires agent-instruction cleanup before broader runtime work begins so field names, reducer ownership boundaries, and strategy-edit expectations are normalized early.

### Acceptance Scenarios

1. **Given** either loop finishes, **When** an operator opens the dashboard or synthesis output, **Then** the packet shows a named `stopReason` plus the typed `legalStop` detail that made STOP legal.
2. **Given** convergence math votes STOP but a quality gate fails, **When** the workflow evaluates completion, **Then** it persists a first-class blocked-stop event with gate results and recovery path and does not terminate as complete.
3. **Given** a valid prior packet state, **When** either active resume or completed-continue is selected, **Then** the workflow preserves the same `continuedFromRun` semantics and continues from a named run boundary instead of starting from run 1.
4. **Given** a major research claim, **When** the packet is synthesized, **Then** the claim appears with `verified`, `contradicted`, or `unresolved` status plus evidence refs.
5. **Given** a recommendation derived from mixed source quality, **When** the packet records it, **Then** publication critique, runtime inventory, and promotion-checkpoint context remain visible.
6. **Given** a normal loop run, **When** council synthesis or a coordination board is not explicitly requested, **Then** no advanced-mode artifacts are created.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Consolidated report remains the source of truth for the scoped runtime improvements | Mis-scoped implementation if packet drifts from research | Every requirement cites the consolidated report directly. |
| Dependency | Existing reducer/parity tests are the current runtime safety net | Behavior changes could drift from contracts | Plan behavior-first tests and parity updates in the same implementation wave. |
| Risk | Stop-gate logic becomes too complicated for operators | Medium | Keep default operator UX small and move advanced detail into generated artifacts and optional modes. |
| Risk | Journals and ledgers create maintenance overhead without adoption | Medium | Make journals canonical but reducer-driven; keep publication critique and promotion checkpoints lightweight. |
| Risk | Council mode or coordination board becomes a default-path distraction | Medium | Mark both features explicitly opt-in and put them in the last delivery phase. |
| Risk | Runtime mirror parity balloons the implementation scope | Medium | Keep `.opencode` files canonical and use parity tests to decide whether hand-authored mirrors still need edits. |
| Risk | The reducer cannot safely replay at least one older large packet | High | Seed replay fixtures from older large packets early and block compaction or stop-contract rollout until replay equivalence passes. |
| Risk | Review contract maturity is uneven across skill, workflow, and agent surfaces | Medium | Front-load agent instruction cleanup and parity checks before broader runtime changes land. |
| Risk | Token/time tracking is inconsistently available across runtimes | Low | Plan for exact metrics when available and documented approximations otherwise. |

<!-- /ANCHOR:risks -->
---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Default deep-research and deep-review iterations should not require extra manual review steps compared with current `:auto` flows.
- **NFR-P02**: Added runtime artifacts should remain reducer-friendly and packet-local, avoiding large per-iteration re-render costs beyond current dashboard regeneration.

### Reliability

- **NFR-R01**: New journal and ledger artifacts must remain append-only or reducer-rebuildable from canonical packet state.
- **NFR-R02**: Active resume and completed-continue flows must remain recoverable after interruption without needing hidden context or manual reconstruction, and `continuedFromRun` semantics must stay consistent across both.

### Maintainability

- **NFR-M01**: Shared runtime improvements must be documented once in canonical assets and enforced through parity/behavior tests rather than repeated prose-only edits.
- **NFR-M02**: Optional advanced features must not make the default workflow harder to understand or validate.

---

## 8. EDGE CASES

### Lifecycle and Stop-State Boundaries

- Convergence math says STOP, but quality gates fail: record blocked-stop event, surface reason in dashboard/journal, continue loop or recovery path.
- Convergence says STOP, quality gate fails, the blocked-stop decision must be persisted as a first-class event, not just a CONTINUE side effect.
- User explicitly stops a run mid-iteration: persist `user_stopped`, flush journal/ledger state safely, and keep resume cursor intact.
- Resume starts from a run whose ledger or journal is partially present: classify as recoverable only if canonical state can be reconciled from packet artifacts.
- Snapshot boundary is hit while a replay validation is still running: defer compaction finalization until reducer equivalence checks pass and the authoritative event log remains recoverable.

### Research Quality Boundaries

- Claim has contradictory evidence across README and runtime code: ledger must mark `contradicted`, not silently promote the stronger claim.
- Source type is marketing copy or a thin README: publication critique must make the evidence class explicit before promotion.
- Promotion checkpoint fails minimum evidence threshold: recommendation stays informative, not adoptive.

### Semantic and Decomposition Boundaries

- Semantic novelty falls to zero but contradiction density rises: convergence must remain blocked until the contradiction path is resolved or explicitly downgraded in the stop-decision trace.
- Citation overlap is high within one research cluster but low across the full source set: cluster saturation cannot be treated as global convergence for 50+ domain research packets.
- Review scope exceeds 1000 files with no hotspot ranking or stratified sampling plan: the workflow must force an inventory/decomposition step before claiming broad coverage.

### Optional Mode Boundaries

- Council mode perspectives disagree irreconcilably: synthesis iteration must surface unresolved conflict instead of forcing a false consensus.
- Coordination board is enabled for a small packet: implementation should degrade gracefully to a minimal board rather than forcing enterprise-scale fields.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Two loop products, shared runtime substrate, replay durability, observability, decomposition policy, semantic convergence, multiple assets, YAML workflows, reducer/tests |
| Risk | 21/25 | Runtime-stop behavior, resume semantics, snapshot/compaction correctness, observability fidelity, semantic convergence, and trust surfaces |
| Research | 17/20 | Consolidated research and packet-local deep research are available, but implementation choices still require ADRs and replay-harness scoping |
| Multi-Agent | 0/15 | This planning packet does not require parallel agent work |
| Coordination | 12/15 | Multiple file families, replay corpus seeding, and phased verification must move together; optional coordination-board mode adds design complexity |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Shared stop taxonomy drifts between research and review | High | Medium | Keep taxonomy canonical in shared planning and enforce via contract/parity tests. |
| R-002 | Journals and ledgers become write-heavy but not read-useful | Medium | Medium | Tie them to dashboards, synthesis, and troubleshooting paths from day one. |
| R-003 | Optional advanced modes are treated as default requirements | Medium | Medium | Phase them last and document them as explicit opt-ins only. |
| R-004 | Runtime mirrors drift from canonical `.opencode` agent contracts | Medium | High | Update or regenerate mirrors in the same delivery wave and keep parity tests authoritative. |
| R-005 | Behavior-first tests become brittle if they overfit wording instead of contract signals | Medium | Medium | Prefer structure-plus-semantics assertions over exact-string snapshots when feasible. |

---

## 11. USER STORIES

### US-001: Trust The Stop Condition (Priority: P0)

**As an** operator running autonomous deep research or deep review, **I want** the packet to explain exactly why a loop stopped and whether STOP was legally earned, **so that** I can trust the result without reverse-engineering the raw JSONL.

**Acceptance Criteria**:
1. Given a completed loop, when I inspect the dashboard or synthesis output, then I can see the named stop reason and the gate status that allowed STOP.
2. Given a blocked-stop case, when convergence math says stop but gates fail, then the loop records that state explicitly and continues or recovers instead of silently terminating.

### US-002: Resume Without Reinitializing (Priority: P0)

**As a** maintainer resuming a long-running research or review session, **I want** the workflow to continue from a known run boundary, **so that** I do not lose lineage or pay re-initialization overhead for already-completed work.

**Acceptance Criteria**:
1. Given a valid existing packet, when resume is selected, then the workflow continues from a specific prior run or segment instead of starting from run 1.

### US-003: Trust Research Claims (Priority: P1)

**As a** reader of deep-research outputs, **I want** large claims to carry verification status, evidence quality, and promotion thresholds, **so that** I can separate verified runtime truths from weaker source claims.

**Acceptance Criteria**:
1. Given a major adoption recommendation, when I inspect the packet, then I can see whether the claim was verified, contradicted, or unresolved and what evidence class supports it.

### US-004: Scale Up Deliberately (Priority: P1)

**As a** coordinator of ambiguous or large multi-phase research, **I want** optional council synthesis and coordination-board support, **so that** I can use them only when the packet genuinely needs the extra cost.

**Acceptance Criteria**:
1. Given a normal research packet, when I run the default mode, then neither council synthesis nor the coordination board is required.
2. Given an ambiguous or multi-phase packet, when I explicitly enable the advanced mode, then the added artifacts are created and tracked as packet-local state.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Q1: Should review token-consumption metrics be sourced from runtime envelopes only, or may the implementation ship an explicit "unknown/estimated" fallback field?
- Q2: Should the coordination board live under `research/` as a large-run overlay or at the packet root as a cross-phase artifact?
- Q3: If runtime mirrors remain hand-authored, do we want this packet to update them directly or to treat generated mirrors as a prerequisite follow-on?
- Q4: Should compaction trigger by run count, JSONL size, or wall-clock duration?
- Q5: What is the cheapest semantic-novelty implementation that stays packet-local and replayable?
- Q6: Which real packet families should seed the first replay corpus: `028`, `040`, or `042` fixtures?

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Basis**: `../../../system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md`

---
