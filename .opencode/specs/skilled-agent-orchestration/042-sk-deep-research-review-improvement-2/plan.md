---
title: "Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Deliver the eight deep-loop improvements in dependency order, starting with shared runtime truth and ending with optional advanced orchestration modes."
trigger_phrases:
  - "042"
  - "implementation plan"
  - "deep research"
  - "deep review"
  - "runtime truth"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown contracts, YAML workflows, JSON/JSONL artifacts, CommonJS reducer logic, Vitest suites |
| **Framework** | Spec Kit deep-loop products: Command -> YAML workflow -> LEAF agent -> packet-local artifacts |
| **Storage** | Packet-local `research/` and `review/` artifacts, append-only JSONL, generated dashboards, reducer-owned summaries |
| **Testing** | Vitest contract/reducer/behavior suites plus strict packet validation |

### Overview

This implementation plan ships the deep-loop improvements in five phases. The first two phases harden runtime truth: stop reasons, legal done gates, journals, resume semantics, dashboards, and ledgers. Later phases add research-quality overlays, review parity, behavior-first tests, and the two optional advanced modes: council synthesis and coordination boards.

The ordering is deliberate. Optional orchestration features should not land until the core loop substrate is easier to trust, recover, and verify. This follows the consolidated report's themes around runtime truth, shared loop mechanics, and extension-layer discipline.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The eight scoped improvements are fixed by this packet and traceable to consolidated research findings.
- [x] Canonical deep-loop assets, YAML workflows, agents, reducer/test surfaces, and templates have been inventoried in `spec.md`.
- [x] Optional features are separated from foundational runtime work.
- [x] No implementation work is mixed into this planning packet.

### Definition of Done

- [ ] Stop-reason taxonomy and legal done-gate design are applied consistently to both deep-loop products.
- [ ] Resume/start-from-run semantics are documented across commands, workflows, state contracts, and agents.
- [ ] Journals, dashboards, and claim-ledger artifacts are defined and behavior-tested where applicable.
- [ ] Research-quality add-ons are designed without bloating default execution.
- [ ] Council synthesis and coordination-board features remain explicit opt-ins.
- [ ] Contract, reducer, and behavior test plans are updated with concrete file-level targets.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared loop-runtime hardening with explicit product overlays.

### Key Components

- **Command layer**: `.opencode/command/spec_kit/deep-research.md` and `.opencode/command/spec_kit/deep-review.md`
- **Workflow layer**: auto/confirm YAML assets for deep research and deep review
- **Skill layer**: current contracts, references, config/strategy/dashboard assets
- **Agent layer**: canonical `.opencode/agent/` deep-loop workers plus parity mirrors if still hand-authored
- **Runtime substrate**: reducer logic and state contracts
- **Verification layer**: reducer, parity, and new behavior-first Vitest suites

### Data Flow

```text
Phase 1-2 foundations
  -> define stop reasons, legal done gates, resume cursor, journal schema
  -> update state formats, workflow steps, dashboards, and reducers

Phase 3 research/review overlays
  -> add claim ledger, publication critique, runtime inventory, promotion checkpoints
  -> expand review metrics and dashboard depth

Phase 4 verification
  -> behavior-first tests, reducer/parity test expansion, integration fixtures

Phase 5 optional advanced modes
  -> council synthesis profile
  -> packet-level coordination board
```

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shared Runtime Truth Foundation

**Scope**: REQ-001, REQ-002, REQ-003, REQ-014

**Why first**: Every other improvement depends on a trusted answer to three questions: why did the loop stop, was STOP legal, and where can a session resume.

**Files to change**:
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
- `.opencode/skill/sk-deep-review/SKILL.md`
- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
- `.opencode/skill/sk-deep-review/references/convergence.md`
- `.opencode/skill/sk-deep-review/references/state_format.md`
- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`

**Estimated complexity**: High

**Verification strategy**:
- Extend parity tests first so stop-reason and resume fields are enforced across skills, agents, and commands.
- Add fixture-based cases that prove blocked-stop behavior when convergence math passes but quality gates fail.
- Verify auto and confirm YAML parity for both loops.

### Phase 2: Journals, Dashboards, and Research Trust Surfaces

**Scope**: REQ-004, REQ-005, REQ-007, REQ-008, REQ-009

**Why second**: Journals, ledgers, critique, and dashboard depth all rely on the Phase 1 state contract.

**Files to change**:
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-review/references/state_format.md`
- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`

**Estimated complexity**: High

**Verification strategy**:
- Reducer fixtures prove append-only journal rollups and dashboard regeneration remain idempotent.
- Ledger fixtures prove `verified`, `contradicted`, and `unresolved` claims render into synthesis metadata.
- Dashboard tests assert liveness, stop reason, timing/tokens, coverage depth, and severity trends.

### Phase 3: Review Parity and Shared Runtime Mirror Alignment

**Scope**: REQ-012, REQ-013

**Why third**: Once the canonical contracts are updated, parity and mirror alignment can move as one bounded follow-on.

**Files to change**:
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-review/references/quick_reference.md`
- `.claude/agents/deep-research.md`
- `.gemini/agents/deep-research.md`
- `.codex/agents/deep-research.toml`
- `.agents/agents/deep-research.md`
- `.claude/agents/deep-review.md`
- `.gemini/agents/deep-review.md`
- `.codex/agents/deep-review.toml`

**Estimated complexity**: Medium

**Verification strategy**:
- Contract parity tests must fail before mirror drift can land.
- Operator-facing command examples should remain compact while advanced modes are discoverable.
- Confirm-mode and auto-mode docs should describe the same artifacts and lifecycle terms.

### Phase 4: Behavior-First Verification Stack

**Scope**: REQ-006 plus supporting coverage for REQ-001 through REQ-009 and REQ-012 through REQ-013

**Why fourth**: Once the contracts and artifacts are defined, behavior tests can lock them in without writing against unstable interim surfaces.

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts`

**Estimated complexity**: High

**Verification strategy**:
- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, convergence stop, and stop-reason persistence.
- Review behavior tests should assert dimension rotation, citation presence, claim-adjudication gate enforcement, severity trends, and stop-reason persistence.
- Existing reducer/parity tests should be extended, not bypassed.

### Phase 5: Optional Advanced Orchestration Modes

**Scope**: REQ-010, REQ-011

**Why last**: Council synthesis and coordination boards are useful only after the default runtime path is trustworthy.

**Files to change**:
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/agent/deep-research.md`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`

**Estimated complexity**: Medium

**Verification strategy**:
- Default deep-research flows must behave exactly as before when the advanced mode is not enabled.
- Council mode must show perspective isolation and explicit synthesis reconciliation.
- Coordination-board mode must remain packet-local and optional.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract parity | Skills, commands, agents, runtime mirrors | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` |
| Reducer and schema | Research reducer, review reducer contract/schema | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` |
| Behavioral | Research/review runtime behavior, stop reasons, journals, ledgers, dashboard metrics | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
| Integration | Auto and confirm YAML flows across resume/blocked-stop/optional-mode scenarios | Workflow fixtures plus targeted `pnpm vitest` integration cases added in this packet's implementation phase |
| Documentation | Packet structure and markdown validity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 --strict` |

### Integration Test Plan

| Scenario | Goal | Evidence |
|----------|------|----------|
| Research blocked-stop path | Prove convergence math alone cannot terminate the loop | JSONL event with blocked stop, dashboard status, behavior test fixture |
| Review all-dimensions-clean path | Prove review can stop only after dimension coverage and quality gates pass | JSONL stop reason, dashboard coverage section, behavior test fixture |
| Resume-from-run path | Prove a run can continue from a named prior iteration/segment | Config/state cursor fields, command docs, behavior test fixture |
| Claim-ledger path | Prove research claims become verified/contradicted/unresolved with evidence refs | Ledger artifact plus synthesis excerpt |
| Audit-journal path | Prove reads/searches/evidence extraction and convergence math are recorded append-only | Journal artifact plus reducer summary |
| Council mode path | Prove the advanced mode is explicit and does not change default behavior | Command flag/profile, packet artifacts, behavior test fixture |
| Coordination-board path | Prove the large-run board is optional, packet-local, and conflict-aware | Board artifact plus fixture data for conflict/dedupe/resource suggestions |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Consolidated research packet `999-agentic-system-upgrade/001-research-agentic-systems` | Internal | Green | Requirements lose evidence basis |
| Existing deep-loop contracts and assets | Internal | Green | No canonical baseline to modify |
| Existing reducer/parity tests | Internal | Green | Runtime changes land without guardrails |
| Runtime mirrors for deep agents | Internal | Yellow | Scope depends on whether mirrors remain hand-authored |
| Runtime token/time availability | Internal | Yellow | May require approximate metrics fallback |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A proposed runtime change makes STOP/legal completion behavior less explainable, breaks resume semantics, or requires hidden state outside packet artifacts.
- **Procedure**:
  1. Revert optional advanced-mode work first and keep the foundational runtime-truth changes isolated.
  2. Roll back stop/journal/ledger changes by feature group, not as a single monolith, so trusted baseline behavior can be restored incrementally.
  3. Keep reducer/parity/behavior tests as the last step in rollback to verify the restored baseline contract.
  4. Preserve packet-local artifact schemas in documentation so a partially reverted implementation can still be diagnosed.

<!-- /ANCHOR:rollback -->
---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the task stays inside the files listed in `spec.md`.
- Confirm whether the task is foundational runtime truth or an optional advanced mode.
- Confirm the verification command or fixture that will prove the task before editing.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `FOUNDATION-FIRST` | Do not start council or coordination-board work before the shared stop/done/resume substrate is stable. |
| `PACKET-LOCAL` | Keep journals, ledgers, dashboards, and coordination artifacts packet-local and auditable. |
| `PARITY-SAME-WAVE` | Move canonical docs/assets and parity tests together so runtime drift does not land mid-phase. |
| `BEHAVIOR-PROOF` | Treat behavior-first tests as the primary runtime proof for loop changes. |

### Status Reporting Format
- `in-progress`: name the active phase, requirement cluster, and target files.
- `blocked`: record the missing artifact, schema mismatch, or failing test that stops progress.
- `completed`: record changed files, passing checks, and whether optional-mode behavior stayed opt-in.

### Blocked Task Protocol
- If a foundational stop/resume contract is unresolved, do not proceed to journals, ledgers, or optional modes.
- If parity tests disagree with canonical docs, fix the contract drift before adding more features.
- If behavior tests cannot express a requirement clearly, revise the contract first instead of weakening the test target.

## L2: PHASE DEPENDENCIES

```text
Phase 1 (Runtime foundation)
  -> Phase 2 (Journals, dashboards, research trust)
  -> Phase 3 (Parity and mirror alignment)
  -> Phase 4 (Behavior-first verification)
  -> Phase 5 (Optional advanced modes)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phases 2-5 |
| Phase 2 | Phase 1 | Phases 4-5 |
| Phase 3 | Phase 1 | Phase 4 |
| Phase 4 | Phases 1-3 | Phase 5 closeout |
| Phase 5 | Phases 1-4 | Final release of optional advanced modes |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 | High | 2-3 focused implementation sessions |
| Phase 2 | High | 2-3 focused implementation sessions |
| Phase 3 | Medium | 1-2 focused implementation sessions |
| Phase 4 | High | 2 focused implementation sessions |
| Phase 5 | Medium | 1-2 focused implementation sessions |
| **Total** | | **8-12 focused implementation sessions** |

---

## L3: DEPENDENCY GRAPH

```text
┌─────────────────────────────┐
│ Phase 1: Runtime Foundation │
└──────────────┬──────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌───────────────┐  ┌──────────────────┐
│ Phase 2: Trust│  │ Phase 3: Parity  │
│ Surfaces      │  │ Alignment        │
└──────┬────────┘  └─────────┬────────┘
       │                     │
       └──────────┬──────────┘
                  ▼
      ┌────────────────────────────┐
      │ Phase 4: Behavior Testing  │
      └──────────────┬─────────────┘
                     ▼
      ┌────────────────────────────┐
      │ Phase 5: Optional Advanced │
      │ Modes                      │
      └────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shared stop/runtime contract | None | Stop reasons, done-gate rules, resume cursor | All downstream phases |
| Journals and trust artifacts | Shared stop/runtime contract | Journals, ledgers, richer dashboards | Behavior testing, optional modes |
| Parity alignment | Shared stop/runtime contract | Mirror-safe docs/contracts | Behavior testing |
| Behavior-first tests | Shared stop/runtime contract, trust artifacts, parity alignment | Runtime proof, regression guardrails | Optional advanced modes closeout |
| Optional advanced modes | All prior phases | Council profile and coordination board | None |

---

## L3: CRITICAL PATH

1. **Shared stop/done/resume contract** - critical because every later artifact depends on it.
2. **Journal/ledger/dashboard schema and reducer support** - critical because behavior tests need stable packet artifacts.
3. **Parity alignment across command/skill/agent surfaces** - critical because contract drift would invalidate later tests.
4. **Behavior-first test suite** - critical because it becomes the proof that runtime truth has moved beyond structure-only validation.

**Total Critical Path**: Four implementation waves before optional advanced modes can be considered release-ready.

**Parallel Opportunities**:
- Research trust-surface drafting and review trust-surface drafting can proceed in parallel after Phase 1 is stable.
- Runtime mirror updates can proceed in parallel with reducer/dashboard work if parity tests are authoritative.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Runtime truth contract locked | Shared stop reasons, legal done gate, and resume cursor planned and implemented | End of Phase 1 |
| M2 | Trust surfaces operational | Journals, ledgers, and richer dashboards are wired into reducers/workflows | End of Phase 2 |
| M3 | Parity and tests stable | Contract, reducer, and behavior suites all pass | End of Phase 4 |
| M4 | Optional advanced modes ready | Council and coordination-board modes ship as opt-in only | End of Phase 5 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-PLAN-001: Ship Optional Advanced Modes After Runtime Truth

**Status**: Proposed

**Context**: Council synthesis and coordination boards are valuable, but the consolidated report treats them as optional extensions rather than baseline fixes.

**Decision**: Phases 1-4 focus on runtime truth, trust surfaces, and behavior testing. Phase 5 handles optional advanced modes only after the substrate is stable.

**Consequences**:
- Positive: We avoid shipping expensive optional modes on top of untrusted stop/resume behavior.
- Negative: Some desired orchestration features land later. Mitigation: keep their interfaces planned in this packet so they do not need a second design cycle.

**Alternatives Rejected**:
- Ship all eight improvements in one mixed wave: rejected because it would blur blockers and optional extensions.
