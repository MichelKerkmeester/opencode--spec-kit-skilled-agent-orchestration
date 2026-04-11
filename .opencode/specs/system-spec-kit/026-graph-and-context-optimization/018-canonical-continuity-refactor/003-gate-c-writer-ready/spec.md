---
title: "Gate C — Writer Ready"
description: "Gate C defines the writer-critical path for phase 018: validator, routed save path, merge engine, template continuity rollout, and shadow-only activation."
trigger_phrases:
  - "gate c"
  - "writer ready"
  - "phase 018"
  - "canonical continuity"
  - "memory-save rewrite"
importance_tier: "critical"
contextType: "implementation"
level: "3+"
gate: "C"
parent: "018-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Gate C — Writer Ready

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Gate C is the code-critical path of phase 018. It replaces standalone memory-file writes with canonical spec-doc writes by delivering the five-rule validator bridge, the 3-tier `contentRouter`, the five-mode `anchorMergeOperation`, the `atomicIndexMemory` drop-in for `atomicSaveMemory`, and the XL `memory-save.ts` rewrite that keeps `withSpecFolderLock` unchanged. Grounding: `../implementation-design.md`; resource-map F-4/F-5/F-6/F-7; rows B1, C1, C10, C11, D1-D30; iterations 001-005, 021-024, 029, 031-034, 038.

**Key Decisions**: split the writer into four new modules instead of re-inlining more logic into `memory-save.ts`; keep Gate C at `S1 shadow_only` until parity and rollback evidence are boring.

**Critical Dependencies**: Gate B closure remains intact, routing prototypes and validator codes are implemented exactly, and template/frontmatter updates land before canonical writer traffic is enabled.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-11 |
| **Branch** | `018-canonical-continuity-refactor/003-gate-c-writer-ready` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate B established schema, archive state, and ranking, but the writer still assumes `memory/*.md` as the canonical save target. That leaves phase 018 blocked on the highest-risk rewrite: `memory-save.ts` cannot safely route content into spec-doc anchors, validate `_memory.continuity`, or prove shadow parity until Gate C lands the new writer surfaces (resource-map rows B1, C1, C11; iterations 002, 003, 022, 024, 032, 034).

### Purpose
Deliver an implementation-ready, governed plan for the canonical writer so phase 018 can ship spec-doc writes without reopening Gate B or leaking reader-ready work into Gate C.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `spec-doc-structure.ts` with `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, and `POST_SAVE_FINGERPRINT`, then expose them through `validate.sh`.
- Deliver `contentRouter`, `anchorMergeOperation`, `atomicIndexMemory`, and the `memory-save.ts` rewrite that adapts six stages, rewrites two, and keeps eight pass-through stages unchanged.
- Refactor `generate-context.ts`, adapt the save helpers and schemas, roll `_memory.continuity` into all level templates, and activate `shadow_only` plus routing/shadow telemetry.

### Out of Scope
- Gate D reader-path rewrites (`memory-search.ts`, `memory-context.ts`, `session-resume.ts`) - handled in the next gate.
- Gate E command, agent, skill, and top-level doc sync - runtime-closeout work, not writer-ready scope.
- Legacy cleanup or permanence decisions - deferred to Gates E/F after D0 evidence exists.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | XL rewrite around routed saves and `atomicIndexMemory` (row B1) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Create | Node validator bridge for the five new rules (row D1, iter 022) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Create | 3-tier classifier using iter 002, 021, and 031 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts` | Create | Five canonical merge modes modeled after `nested-changelog.ts` (row C10, iter 023) |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | Create | Atomic index commit that replaces `atomicSaveMemory` without changing the folder lock |
| `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` | Create | Typed reader/writer for the `_memory.continuity` YAML sub-block with 14-field schema + 2048-byte budget enforcement (iter 005, iter 024) |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Routed save wrapper over the new writer path (row C1) |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Shell exposure for new rule aliases and debug hooks (rows C11, D1) |
| `.opencode/skill/system-spec-kit/templates/level_{1,2,3,3+}/*.md` | Modify | `_memory.continuity` rollout across the 30 template surfaces (rows D9-D30) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The validator stack must gain the five Gate C rules in the iter 022 order. | `spec-doc-structure.ts` exists, `validate.sh` exposes the rules, and fixtures prove hard-fail vs warn behavior for all five rules. |
| REQ-002 | The writer core must ship as four explicit modules plus the `memory-save.ts` rewrite. | `contentRouter`, `anchorMergeOperation`, `thinContinuityRecord`, and `atomicIndexMemory` all exist as first-class modules with passing unit tests; `withSpecFolderLock` remains unchanged. |
| REQ-003 | Canonical spec-doc writes must replace standalone writer assumptions without changing Gate B storage guarantees. | `atomicSaveMemory` is replaced by `atomicIndexMemory`, `generate-context.ts` uses the routed path, and the six adapted stages keep their documented behavior (rows B2-B16, C1). |
| REQ-004 | Gate C must prove shadow safety before any reader-path promotion. | `shadow_only` is active via the iter 034 state machine, routing/shadow spans follow iter 033/038, parity is >=95 percent on the golden set, and auto-disable never fires during the required window. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Template and frontmatter contracts must carry the thin continuity layer. | All level templates carry the 14-field `_memory.continuity` block, each block stays <=2048 bytes after normalization, and malformed writes fail closed per iter 024. |
| REQ-006 | The classifier contract must be implementation-ready, not hand-wavy. | Tier 1 rules, Tier 2 prototypes, Tier 3 strict JSON contract, `--route-as` behavior, refusal behavior, and routing audit outputs are documented and wired to code surfaces. |
| REQ-007 | The 243-test catalog must be traceable to concrete workstreams. | Routing 120, merge 50, validator 25, resume 10, integration 25, and regression 13 tests are mapped into tasks and checklist gates. |
| REQ-008 | Multi-agent governance must remain explicit. | Workstream ownership, sync points, sign-off roles, and rollback authority are documented across plan/checklist/decision-record. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four new components exist and each clears >80 percent unit coverage.
- **SC-002**: The 243-test catalog is green, including the 13 regressions and 25 integration cases from iter 029.
- **SC-003**: Shadow compare reaches >=95 percent parity on the golden set and `trigger_match` remains exact-match clean.
- **SC-004**: `memory-save.ts` rewrite, `generate-context.ts` parity, and 30 template continuity updates all land without reopening Gate B assumptions.
- **SC-005**: `S1 shadow_only` runs for 7+ days with `validator.rollback.fingerprint rate = 0`, no severe iter 032 breach, and multi-agent sign-off recorded.

### Acceptance Scenarios

- **Given** a well-formed session chunk whose top Tier 1 rule match exceeds 0.80 confidence, **when** `contentRouter.classifyContent()` runs, **then** the chunk is routed to the deterministic rule target and never escalated to Tier 2 or Tier 3.
- **Given** a chunk that Tier 1 cannot classify but whose nearest Tier 2 prototype similarity is >=0.70, **when** the classifier runs, **then** the chunk is routed to the prototype's target anchor and the routing audit log records `tier_used=2` with the similarity score.
- **Given** a chunk that survives Tier 1+2 with <0.50 confidence and Tier 3 LLM output below the refusal floor, **when** the classifier completes, **then** the writer refuses to route, the chunk is preserved to `scratch/pending-route-<ts>.json`, and `memory-save.ts` returns a structured refusal payload without mutating spec docs.
- **Given** two concurrent `/memory:save` calls targeting different anchors in the same spec folder, **when** both reach `anchorMergeOperation`, **then** `withSpecFolderLock` serializes them, the second save re-reads the updated doc, both chunks land, and post-save fingerprint verification passes on both writes.
- **Given** a Gate B schema state with `is_archived=1` on 155 legacy memory rows, **when** `S1 shadow_only` runs the dual-write shadow-compare, **then** golden-set parity is >=95 percent across all query classes, `validator.rollback.fingerprint rate = 0`, and the feature-flag state machine never auto-demotes to S0.
- **Given** a fresh Level 3 spec doc written by the refactored `generate-context.ts`, **when** `validate.sh --strict` runs with the new spec-doc-structure rules active, **then** `ANCHORS_VALID`, `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, and `POST_SAVE_FINGERPRINT` all pass, and the embedded `_memory.continuity` block measures <=2048 bytes after normalization.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gate B schema/archive/ranking state stays authoritative | Reopening schema work would invalidate the writer plan | Treat rows A1-A10 as closed inputs; Gate C only consumes them |
| Dependency | `nested-changelog.ts` remains the canonical read-transform-write pattern | Reinventing merge logic increases corruption risk | Reuse the proven split between read, transform, render, and atomic write (row C10; iter 023) |
| Risk | Classifier misroutes narrative into the wrong anchor | Silent spec-doc pollution | Use Tier 1 -> Tier 2 -> Tier 3, refuse low-confidence writes, and run routing audit reducer rules (iters 002, 021, 031, 038) |
| Risk | Merge or fingerprint validation fails under contention | Canonical docs become untrustworthy | Keep the per-folder mutex, run post-save fingerprint verification, and rollback immediately on mismatch (iters 003, 022, 034) |
| Risk | Template rollout creates drift between runtime and packet docs | Writer passes but packet scaffolding stays invalid | Update all level templates in the same gate and pin the new rule aliases in `validate.sh` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `save.path.total p95 <= 2000ms` during Gate C proving; `save.lock.wait p99 <= 200ms` in healthy windows and never `>500ms` for two windows (iter 033, iter 034).

### Security
- **NFR-S01**: Transcript, tool-call, and generic recovery boilerplate content must resolve to `drop` or explicit refusal and never merge into canonical docs (iters 002, 021, 038).

### Reliability
- **NFR-R01**: All writer updates are idempotent, fingerprint-verified, and fail closed; no post-save mismatch or rollback failure can be ignored (iters 022, 024, 034).

---

## 8. EDGE CASES

### Data Boundaries
- Empty or near-empty anchor bodies: legal only when the merge mode explicitly initializes them; otherwise `SPEC_DOC_SUFFICIENCY` or `MERGE_LEGALITY` fails.
- Maximum continuity payload: `_memory.continuity` normalizes, compacts, and then hard-fails at `MEMORY_017` when the fragment still exceeds 2048 bytes.

### Error Scenarios
- Missing target doc or anchor: fail with `SPECDOC_MERGE_001/002`; do not invent a destination.
- Concurrent edit after lock queueing: retryable merge failure with snapshot rollback and no continuity fingerprint update.
- Mixed-signality chunk: fall through Tier 1 and Tier 2, then use Tier 3 or refuse to route; never guess.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | XL rewrite plus 4 new modules, 30 template edits, and multiple save-path adapters |
| Risk | 23/25 | Canonical-doc mutation, rollback correctness, and parity-sensitive shadow rollout |
| Research | 20/20 | Gate C depends on 14 critical research iterations and 3 resource-map surfaces |
| Multi-Agent | 14/15 | Parallel workstreams for validator, writer core, templates, and telemetry |
| Coordination | 14/15 | Gate B dependency, Gate D handoff, paired approvals, and 7-day proving window |
| **Total** | **96/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `memory-save.ts` rewrite leaks reader-path scope into Gate C | H | M | Keep reader-ready work out of this gate and constrain tasks to writer-critical files |
| R-002 | Tier 3 classifier or prototypes drift from the canonical categories | H | M | Lock the iter 031 JSON schema, audit disagreements, and refresh Tier 2 from confirmed corrections |
| R-003 | Template rollout lands without validator parity | H | M | Ship template changes and `validate.sh` rule aliases in the same PR train |
| R-004 | Shadow metrics look healthy but rollback signals are incomplete | H | L | Require iter 033 spans, iter 032 thresholds, and iter 034 state-machine events before gate close |

---

## 11. USER STORIES

### US-001: Safe Canonical Save (Priority: P0)

**As a** packet operator, **I want** `/memory:save` to route implementation content into the correct spec-doc anchor, **so that** canonical packet docs stay current without spawning redundant memory files.

**Acceptance Criteria**:
1. Given a progress chunk, When the save runs, Then it lands in the correct anchor with the correct merge mode and a validated fingerprint.

### US-002: Governed Writer Rollout (Priority: P0)

**As a** runtime owner, **I want** Gate C to stay in `shadow_only` until parity, rollback, and telemetry evidence are healthy, **so that** canonical writes do not become default before they are trustworthy.

**Acceptance Criteria**:
1. Given live writer traffic, When shadow compare or fingerprint safety regresses, Then the state machine demotes the rollout without manual guesswork.

### US-003: Resume-Safe Metadata (Priority: P1)

**As a** future Gate D implementer, **I want** `_memory.continuity` to be compact, validated, and indexed consistently, **so that** the resume ladder can trust the writer output it inherits from Gate C.

**Acceptance Criteria**:
1. Given a malformed or oversized continuity block, When the validator runs, Then the save fails closed before any canonical file write completes.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Packet owner + runtime owner | Pending | 2026-04-11 |
| Design Review | Validator/merge reviewers | Pending | 2026-04-11 |
| Implementation Review | Gate C workstream leads | Pending | TBD |
| Launch Approval | Incident commander + paired approvers | Pending | TBD |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [ ] Drop/transcript handling proven through routing tests
- [ ] Fail-closed continuity validation proved through fixtures
- [ ] Rollback events and override actions auditable in control-plane storage

### Code Compliance
- [ ] Writer changes stay within Gate C scope
- [ ] Template and validator surfaces stay source-of-truth aligned

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Packet owner | Scope/governance | High | Daily packet review |
| Runtime owner | Writer correctness and rollout | High | Milestone syncs |
| Validation owner | Rule ordering and fixture coverage | High | Rule-review checkpoints |
| QA/on-call | Parity and rollback evidence | High | Shadow dashboard + incident channel |

---

## 15. CHANGE LOG

### v1.0 (2026-04-11)
**Initial Gate C writer-ready packet population from parent packet grounding**

---

## 16. OPEN QUESTIONS

- Should addendum template source files carry `_memory.continuity` directly, or should final composed templates remain the only validator-scoped targets?
- Are changelog and sharded template surfaces explicitly exempt from the Gate C memory block, or do they need anchors before they can join merge legality?

---

## RELATED DOCUMENTS

- **Implementation Design**: See `../implementation-design.md`
- **Resource Map**: See `../resource-map.md` and `../scratch/resource-map/{02-handlers,03-scripts,04-templates}.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC (~200 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->
<!-- /ANCHOR:questions -->
