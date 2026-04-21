---
title: "Feature Specification: System Hardening (Post-Consolidation Research + Remediation Train)"
description: "Research-first umbrella packet for the post-026-consolidation hardening train. Coordinates the Tier 1 research/review items surfaced in scratch/deep-review-research-suggestions.md: three 026 close-out candidates (015 delta-review, Q4 NFKC robustness, description.json regen strategy) and three system-spec-kit-wide candidates (Gate 3 + skill-advisor routing accuracy, template v2.2 + validator joint audit, canonical-save pipeline invariants). Child 001-initial-research runs the investigation; future children 002+ carry the resulting implementation waves."
trigger_phrases:
  - "019 system hardening"
  - "post-consolidation hardening train"
  - "026 post-ship research wave"
  - "tier 1 research and remediation"
  - "system-spec-kit hardening charter"
  - "019 research umbrella"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening"
    last_updated_at: "2026-04-18T20:47:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "AUTONOMOUS RUN COMPLETE. All 6 sub-packet research iterations converged (001-006). All 6 remediation children implemented via cli-codex gpt-5.4 high fast: 002 canonical-save (3 waves, 2 P0s + 5 validator rules), 003 NFKC unification (6 HPs, 91/91 adversarial tests), 004 routing accuracy (Gate 3 F1 68.6%->97.66%, advisor 53.5%->60.0%, joint FF 31->1), 005 description regen (field-level merge, 117/117 tests), 006 015-residuals (19 findings across 6 clusters in 4 waves), 007 template-validator (rule registry + semantic frontmatter + anchor parity)."
    next_safe_action: "019 system-hardening umbrella is IMPLEMENTATION-COMPLETE. Residual work: resolve pre-existing unrelated baseline test failures (out of scope for this umbrella). Future 019/00N children reserved for any surprise regressions."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "001-initial-research/spec.md"
      - "001-initial-research/findings-registry.json"

---
# Feature Specification: System Hardening (Post-Consolidation Research + Remediation Train)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|

Packet `019-system-hardening` is the research-first umbrella for the post-026-consolidation hardening train. The 2026-04-18 consolidation that collapsed the former 015-020 range into four thematic packets (015, 016, 017, 018) left six high-leverage investigation items unaddressed: three 026 close-out candidates (`DR-1` 015 delta-review, `RR-1` Q4 NFKC robustness, `RR-2` description.json regen strategy) and three system-spec-kit-wide candidates (`SSK-RR-1` Gate 3 + skill-advisor routing accuracy, `SSK-DR-1` template v2.2 + validator joint audit, `SSK-RR-2` canonical-save pipeline invariants). This packet coordinates them as one research wave plus follow-on implementation children.

**Key Decisions**: Research-first ordering — no implementation child is created until `001-initial-research` produces actionable findings. Each finding cluster becomes a sibling child (`019/002-*`, `019/003-*`, ...) with its own spec + plan + remediation scope. The umbrella packet owns sequencing and cross-cluster coordination only; cluster-local behavior stays in each child.

**Critical Dependencies**: Source of truth is `../scratch/deep-review-research-suggestions.md` (this repository). The 026 root spec/plan/tasks/checklist/implementation-summary/decision-record (`../spec.md` through `../implementation-summary.md`) must be refreshed to reference 019 as a sibling phase. All six Tier 1 items are dispatched through `/spec_kit:deep-research :confirm` or `/spec_kit:deep-review :confirm` — the skill-owned workflow is mandatory per Gate 4 HARD-block.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (foundational hardening; no release-blocking defect gates this packet) |
| **Status** | Spec Ready, Awaiting Plan/Implement Approval |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` |
| **Immediate Predecessor** | `018-cli-executor-remediation/` (shipped 2026-04-18) |
| **Source Document** | `../scratch/deep-review-research-suggestions.md` (Tier 1 candidates §3 and §6) |
| **Effort Estimate** | Research wave ~60-90h wall clock (dispatched iterations); implementation effort deferred until findings converge |
| **Child Layout** | `001-initial-research` (research wave — CONVERGED), `002-canonical-save-hardening`, `003-nfkc-unification-hardening`, `004-routing-accuracy-hardening`, `005-description-regen-contract`, `006-residual-015-backlog`, `007-template-validator-contract-alignment` (all scaffolded 2026-04-18, implementation in flight) |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../002-sk-deep-cli-runtime-execution/spec.md |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 2026-04-18 consolidation that shipped `016-foundational-runtime`, `017-sk-deep-cli-runtime-execution`, and `018-cli-executor-remediation` closed the 026 train's core runtime and executor work. Six follow-on candidates surfaced during that consolidation remain unaddressed:

**026 close-out candidates (from scratch/deep-review-research-suggestions.md §3):**

- **DR-1** — Delta-review of the 243 findings produced by `015-deep-review-and-remediation` against current `main` (see the 015 review report). 015 shipped the review, not the remediation; 016/017/018 likely addressed a non-trivial subset incidentally. Without a delta-review, any Workstream 0 restart risks redoing work that already landed.
- **RR-1** — Q4 NFKC robustness research. `018/spec.md §3.2 Out of Scope` deferred this explicitly. Canonical-equivalence attack surface on `sanitizeRecoveredPayload`, `trigger-phrase-sanitizer`, and the Gate 3 classifier remains unmapped.
- **RR-2** — description.json rich-content regen strategy. Root `implementation-summary.md §Known Limitations #4` flags that `generate-description.js` auto-regen overwrites hand-authored fields — observed on 017's own `description.json` during implementation. Phase 018 Wave B added parse/schema split + merge-preserving repair but did not solve the regen-overwrite root cause.

**System-spec-kit-wide candidates (from scratch/deep-review-research-suggestions.md §6):**

- **SSK-RR-1** — Gate 3 classifier + skill-advisor routing accuracy research. Both classifiers are HARD-block gates with no offline accuracy evaluation. CLAUDE.md admits false-positive tokens (`analyze`, `decompose`, `phase`) but the residual error surface is unquantified.
- **SSK-DR-1** — Template v2.2 + validator ruleset joint audit. Templates under `templates/level_{1,2,3}/` and validator rules in `scripts/spec/validate.sh` are coupled by design but evolve separately. Recent root-packet validator output already surfaces `PHASE_LINKS` warnings that reveal the gap.
- **SSK-RR-2** — Canonical-save pipeline invariant research. Post-H-56-1, `/memory:save` writes across four state layers with no invariant spec. Validator already classifies observed drift as "benign clock skew" — is that correct, or masking real divergence?

### Purpose

Coordinate all six Tier 1 investigation items through one research wave (`001-initial-research`), then spawn implementation children (`002+`) based on findings. Keep the charter research-first so implementation scope is grounded in evidence rather than speculation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Dispatch the six Tier 1 research/review iterations listed in `../scratch/deep-review-research-suggestions.md` §3 (DR-1, RR-1, RR-2) and §6 (SSK-RR-1, SSK-DR-1, SSK-RR-2) through the canonical `/spec_kit:deep-research :confirm` and `/spec_kit:deep-review :confirm` commands.
- Consolidate findings into a single convergence report at `001-initial-research/implementation-summary.md` §Findings Registry.
- Plan follow-on implementation children (`019/002-*`, `019/003-*`, ...) only after research converges. Each implementation child owns one remediation cluster.
- Maintain packet-local strict validation across the umbrella packet and its children.

### Out of Scope

- Any implementation work in the 001 research wave itself. `001-initial-research` produces findings + remediation proposals only; actual code and doc changes belong to future siblings.
- Tier 2 and Tier 3 candidates from `../scratch/deep-review-research-suggestions.md` — those remain backlog unless promoted by Tier 1 findings.
- 026-packet-local implementation work that belongs to existing children. For example: 015 Workstream 0 execution, 016 post-ship hotfixes, 017/002-runtime-matrix review (Tier 2 candidate DR-2). Those stay in their respective packets.
- Retry-budget empirical calibration (Tier 3 `RR-3`) — blocked on telemetry collection window, cannot run today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This file. Umbrella charter. |
| `plan.md` | Create | Coordination plan for the research wave and future children. |
| `tasks.md` | Create | Task breakdown. |
| `checklist.md` | Create | Verification checklist. |
| `decision-record.md` | Create | ADRs for research-first ordering and cluster-per-child layout. |
| `implementation-summary.md` | Create | Placeholder; filled after children complete. |
| `001-initial-research/*` | Create | Research-wave child packet. |
| `../spec.md` | Modify | Add phase 19 row to PHASE DOCUMENTATION MAP + handoff from 018. |
| `../implementation-summary.md` | Modify | Note 019 addition to the child train. |
| `../graph-metadata.json` | Regenerate | Add `019-system-hardening` to `children_ids`. Regenerated via `generate-context.js`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. `001-initial-research` runs first. Children `002+` are reserved for implementation waves and are **not** created until research converges.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-initial-research/` | Research wave: dispatch 6 Tier 1 iterations, consolidate findings, produce remediation proposals | Planned |
| 2+ | `002-*`, `003-*`, ... | Implementation children, one per remediation cluster surfaced by 001 | Reserved (TBD after 001 converges) |

### Phase Transition Rules

- `001-initial-research` MUST converge and pass `validate.sh --strict` before any `002+` sibling is created.
- Each implementation child MUST cite its originating research finding(s) in `spec.md §2 Problem Statement` and link back to `001-initial-research/implementation-summary.md`.
- The umbrella packet `implementation-summary.md` is filled only after all planned children complete or are explicitly deferred.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `018-cli-executor-remediation` | `019-system-hardening` | 018 shipped R1-R11 (R12 deferred), Tier 1 candidates surfaced in scratch doc | `../scratch/deep-review-research-suggestions.md` exists; 018 `implementation-summary.md` verdict PASS |
| `019-system-hardening` | `019-system-hardening/001-initial-research` | Charter approved, dispatch blocks copied from scratch doc | Child `spec.md` exists with 6 scoped iterations |
| `001-initial-research` | `019/002-*` (first implementation child) | Research converges, findings registry written | `001-initial-research/implementation-summary.md` lists remediation clusters with proposed scope |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The umbrella packet must list every Tier 1 candidate from the scratch doc as in-scope for the 001 research child. | `spec.md §3 In Scope` enumerates all six items (DR-1, RR-1, RR-2, SSK-RR-1, SSK-DR-1, SSK-RR-2). |
| REQ-002 | The research-first ordering must be enforced structurally. | No `002+` sibling is created until `001-initial-research/implementation-summary.md` converges. |
| REQ-003 | The 026 root docs must be updated to register 019 as a sibling phase. | `../spec.md` phase map includes row 19; `../implementation-summary.md` notes the addition. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each Tier 1 iteration must use the canonical skill-owned command surface per Gate 4. | Dispatch blocks in `001-initial-research/plan.md` use `/spec_kit:deep-research :confirm` or `/spec_kit:deep-review :confirm`. No direct `@deep-research` or `@deep-review` agent invocation for iteration loops. |
| REQ-005 | Findings must be consolidated into a single registry for the umbrella packet to coordinate follow-on work. | `001-initial-research/implementation-summary.md §Findings Registry` lists all converged findings with severity, source iteration, and proposed remediation cluster. |
| REQ-006 | Future implementation children must cite originating findings. | Each `019/00N-*/spec.md` includes a `| **Originating Research** | ../001-initial-research/implementation-summary.md#finding-<id> |` row. |
| REQ-007 | The umbrella packet must remain coordination-only; implementation content belongs in child packets. | `spec.md §3 Out of Scope` explicitly excludes implementation work from the umbrella; `decision-record.md ADR-001` enforces this structurally. |
| REQ-008 | Tier 2 and Tier 3 candidates from the scratch doc stay out of scope unless Tier 1 findings explicitly promote them. | If a Tier 1 iteration produces evidence promoting a Tier 2/3 item, the promotion is recorded in `001-initial-research/implementation-summary.md` before the item is added to the wave. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** the umbrella packet is open, **when** a reviewer checks the child layout, **then** they see `001-initial-research/` is the only defined child and `002+` are reserved.

**Given** research converges with N findings across M clusters, **when** the next implementation child is created, **then** its spec cites the originating research finding(s) and links back to `001-initial-research/implementation-summary.md`.

**Given** one research iteration finds zero issues, **when** the registry is written, **then** that item is recorded as `NO-ACTION-REQUIRED` with evidence rather than silently dropped.

**Given** a user dispatches iteration work, **when** they check Gate 4 compliance, **then** every dispatch goes through `/spec_kit:deep-research :confirm` or `/spec_kit:deep-review :confirm` — never directly through the corresponding agent.

**Given** a Tier 2 or Tier 3 candidate from the scratch doc becomes relevant mid-wave, **when** it is promoted into the research scope, **then** the promotion is recorded explicitly in `001-initial-research/implementation-summary.md` rather than silently adopted.

**Given** the umbrella packet is filled with research findings, **when** an implementation child `019/00N-*` is scaffolded, **then** its spec cites the originating finding ID(s) and links back to the umbrella-owned findings registry.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six Tier 1 iterations complete with convergence verdicts written to `001-initial-research/implementation-summary.md`.
- **SC-002**: The findings registry is structured enough that each finding maps to exactly one proposed remediation cluster (or an explicit defer reason).
- **SC-003**: The umbrella packet validates cleanly under `validate.sh --strict` after the 001 research wave converges.
- **SC-004**: At least one implementation child is created for every remediation cluster the research proposes, unless the user explicitly defers it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../scratch/deep-review-research-suggestions.md` source doc | High | Keep the scratch doc as the canonical reference; update 001 research spec if scratch evolves |
| Dependency | Canonical `/spec_kit:deep-research` and `/spec_kit:deep-review` commands | High | Gate 4 mandates these; no workaround |
| Risk | Research never converges across one or more items | Medium | Cap iterations per item (default 10-15, see child spec); if no convergence, defer explicitly |
| Risk | Research surfaces too many clusters to remediate | Medium | Prioritize remediation children by severity × leverage; Tier 3 items from scratch doc remain valid triage templates |
| Risk | Scratch doc Tier 1 selection drifts during research | Low | The scratch doc is authoritative at research-start time; later revisions must be explicitly reconciled with the findings registry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Each individual research/review iteration should complete within its configured iteration budget; no unbounded loops.

### Security

- **NFR-S01**: RR-1 (Q4 NFKC) and SSK-RR-1 (routing classifiers) must not produce exploitable artifacts during research — iteration evidence stays in `research/` and is not published externally.

### Reliability

- **NFR-R01**: The umbrella packet must remain coordination-only; it must not accumulate implementation content that belongs in child packets.
- **NFR-R02**: The findings registry must be machine-parseable (structured markdown tables + optional `findings-registry.json`) so that remediation children can automate scope extraction.

---

## 8. EDGE CASES

### Data Boundaries

- If the scratch doc is modified after 001 research starts, the research spec MUST record the source revision hash/timestamp and reconcile explicitly rather than silently adopting changes.
- If a Tier 1 iteration surfaces a P0 finding, the umbrella packet MUST escalate immediately — P0 findings interrupt the research wave in favor of a hotfix child.

### Error Scenarios

- If one research iteration fails to converge within its budget, the packet MUST document the failure, propose an extended budget or scope narrowing, and get user approval before re-dispatching.
- If the canonical command infrastructure itself is broken (SSK-RR-2 could surface this), the research registry MUST still be written — degraded evidence is better than no evidence.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Six coordinated research iterations plus reserved implementation children |
| Risk | 14/25 | Findings may expose production data-integrity issues (especially SSK-RR-2 canonical-save) |
| Research | 18/20 | Research-first charter by design |
| Multi-Agent | 6/15 | Cross-command dispatch coordination but no multi-agent runtime |
| Coordination | 12/15 | Umbrella plus child packets plus root-doc sync |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Research produces too many findings to remediate in reasonable horizon | M | M | Prioritize by severity × leverage; explicit defer for low-leverage findings |
| R-002 | Scratch-doc Tier 1 selection is incomplete or misprioritized | M | L | Update scratch doc mid-research if evidence demands; document the reconciliation |
| R-003 | A Tier 1 iteration surfaces a P0 data-integrity defect | H | L | Pause research wave, dispatch hotfix child, resume afterward |
| R-004 | The umbrella packet accumulates implementation content | M | M | Enforce scope via ADR-001 coordination-only constraint; route any implementation to a child packet |

---

## 11. USER STORIES

### US-001: Researcher needs one coordinated entry point (Priority: P0)

**As a** researcher executing the post-consolidation hardening wave, **I want** one umbrella packet that lists every Tier 1 candidate, **so that** I can dispatch iterations sequentially without losing track of scope.

**Acceptance Criteria**:
1. Given the umbrella spec is open, When I check §3 In Scope, Then I see all six Tier 1 items enumerated.
2. Given I complete an iteration, When I update the findings registry, Then the umbrella packet recognizes it as progress toward convergence.

---

### US-002: Implementer needs research-grounded scope (Priority: P1)

**As an** implementer opening a remediation child, **I want** each child's scope cited against specific research findings, **so that** I can justify the work and verify completion evidence.

**Acceptance Criteria**:
1. Given a `019/00N-*/spec.md`, When I read §2 Problem Statement, Then I see the originating finding ID(s) and a link to `001-initial-research/implementation-summary.md`.

---

## 12. OPEN QUESTIONS

- **Q-001**: Should the research wave include any Tier 2 candidates (DR-2 runtime-matrix review, DR-3 018 adversarial, SSK-DR-2 boundary audit)? Default: no, keep 019 tight on Tier 1 unless evidence from 001 research demands broader scope.
- **Q-002**: Should the implementation children follow a fixed numbering convention (one child per Tier 1 item) or a cluster-based layout (one child per remediation cluster that may span multiple findings)? Proposal: cluster-based; see `decision-record.md §ADR-002`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Document**: `../scratch/deep-review-research-suggestions.md`
