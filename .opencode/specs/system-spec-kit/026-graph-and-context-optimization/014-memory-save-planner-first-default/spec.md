---
title: "Feature Specification: /memory:save Planner-First Default"
description: "Make /memory:save planner-first (non-mutating) by default while preserving full-auto as an explicit fallback, retire the legacy [spec]/memory/*.md write path, and decouple freshness (graph-metadata refresh, spec-doc reindex, enrichment) from the hot save path via explicit follow-up APIs."
trigger_phrases:
  - "014-memory-save-planner-first-default"
  - "memory save planner first"
  - "planner-first memory save"
  - "full-auto fallback"
  - "SPECKIT_SAVE_PLANNER_MODE"
  - "memory folder retirement"
  - "content-router scoped exception"
  - "refreshGraphMetadata reindexSpecDocs runEnrichmentBackfill"
  - "v3.4.1.0 save flow"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-gov | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Folder renamed; spec rewritten under planner-first framing"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "research/013-audit-snapshot/review-report.md"
      - "research/014-research-snapshot/research.md"
      - "review/015-deep-review-snapshot/review-report.md"
    session_dedup:
      fingerprint: "sha256:014-planner-first-default-2026-04-15"
      session_id: "014-planner-first-default-2026-04-15"
      parent_session_id: "014-planner-first-default-closeout"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The runtime was half-migrated: the legacy [spec]/memory/*.md write path was still live even after v3.4.0.0 docs claimed retirement."
      - "Research classified 15 save-flow subsystems and concluded that the writer core earns its cost while Tier 3 routing, reconsolidation, heavy quality automation, and enrichment do not."
      - "Implementation shipped planner-first default with explicit full-auto fallback; freshness work moved to explicit follow-up APIs."
      - "Deep review found 9 issues (3 P0, 5 P1, 1 P2); all resolved."
---
# Feature Specification: /memory:save Planner-First Default

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-gov | v2.2 -->

---

## EXECUTIVE SUMMARY

`/memory:save` was doing too much on every invocation. The runtime still created, wrote, indexed, and read `[spec]/memory/*.md` even though v3.4.0.0 docs claimed that artifact was retired; on top of that legacy write path, every save triggered Tier 3 routing, a heavy quality-loop auto-fix, reconsolidation-on-save, post-insert enrichment, unconditional graph-metadata refresh, and unconditional spec-doc reindex — regardless of whether the caller actually wanted mutation. Auditing the code proved the system was half-migrated, turning vague drift into 25 concrete findings. Classifying the remaining 15 save-flow subsystems proved which ones still earned runtime cost (the canonical atomic writer, routed record identity, the content-router category contract, and thin continuity validation) and which ones did not belong on the default path.

This packet delivers the end state implied by that analysis. `/memory:save` is planner-first by default: the handler computes the same route and legality data as before but stops short of mutation and returns structured planner output instead. `full-auto` is preserved as an explicit fallback via `SPECKIT_SAVE_PLANNER_MODE=full-auto`, with canonical atomic mutation, `POST_SAVE_FINGERPRINT` safety parity, same-path identity, and rollback intact. The legacy `[spec]/memory/*.md` write path is retired. Four previously default-on behaviors become explicit opt-in: `SPECKIT_ROUTER_TIER3_ENABLED`, `SPECKIT_QUALITY_AUTO_FIX`, `SPECKIT_RECONSOLIDATION_ENABLED`, `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED`. Freshness becomes follow-up work via three new APIs: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`. `hybrid` is documented as reserved and currently behaves like `plan-only`. The content-router category contract is preserved with one honest, scoped exception: a Tier 3 default-disable and manual-review guard inside `content-router.ts`. 43 implementation tasks shipped under v3.4.1.0. A deep-review pass flagged 3 P0, 5 P1, and 1 P2 findings on router honesty, fallback safety parity, blocker classification, deferred-helper coverage, and changelog accuracy; all 9 were resolved before closeout.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-14 |
| **Completed** | 2026-04-15 |
| **Branch** | `026-014-memory-save-planner-first-default` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Release Context** | `v3.4.1.0` |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/memory:save` mutated by default, did work that had nothing to do with the caller's intent, and still honored an artifact family that had supposedly been retired. The audit produced 25 concrete findings across runtime write path, runtime read path, indexing, documentation contradictions, template drift, test drift, and a phantom save-side dedup contract. Relevance research then classified the remaining 15 save-flow subsystems and showed that four core pieces earned their cost (canonical atomic writer, routed record identity, content-router category contract, thin continuity validation) while four others (Tier 3 routing, reconsolidation-on-save, heavy quality-loop auto-fix, post-insert enrichment) did not belong on the default path. That combined picture made the default contract untenable: operators got mutation they didn't ask for, freshness work they didn't need, and an artifact surface docs claimed was gone.

### Purpose

Ship a `/memory:save` contract that matches the evidence: planner-first by default so operators see the plan before anything changes, full-auto preserved as an explicit fallback for the cases that still need it, and freshness work moved to callable follow-up APIs so every save doesn't pay for work it doesn't need. Retire the legacy `[spec]/memory/*.md` write path end-to-end. Make four previously default-on behaviors opt-in via per-subsystem env flags, preserve `hybrid` as a reserved value, and record the scoped router exception honestly so docs match the code.

---

<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Make `/memory:save` planner-first by default: the default path computes route + legality data, returns structured planner output, does not mutate files.
- Preserve the `full-auto` writer path as an explicit fallback activated via `SPECKIT_SAVE_PLANNER_MODE=full-auto` with canonical atomic mutation, promotion, rollback, and same-path identity intact.
- Retire the legacy `[spec]/memory/*.md` write and read path runtime-wide: remove the write path, update dedup and causal-link behavior to use canonical docs + the routed record, stop indexing `memory/*.md` into the vector DB.
- Introduce three explicit follow-up APIs for freshness: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`. Remove their unconditional participation in every save.
- Gate four previously default-on save-path behaviors behind explicit env flags: `SPECKIT_ROUTER_TIER3_ENABLED` (default OFF), `SPECKIT_QUALITY_AUTO_FIX` (default OFF), `SPECKIT_RECONSOLIDATION_ENABLED` (default OFF), `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` (default OFF).
- Preserve the content-router eight-category contract. Record the single scoped exception inside `content-router.ts`: Tier 3 default-disable + manual-review return behavior.
- Preserve hard legality checks and structural blockers in the save-quality gate; remove default-path quality-loop auto-fix retries while keeping advisory output.
- Reserve `hybrid` as a valid value for `SPECKIT_SAVE_PLANNER_MODE` that currently behaves like `plan-only`; document it as reserved honestly.
- Restore `POST_SAVE_FINGERPRINT` parity on the full-auto path.
- Promote template-contract failures from advisories to planner blockers.
- Make deferred helpers return explicit deferred status when skipped (no success-shaped status when nothing ran).
- Update packet docs, `ENV_REFERENCE.md`, release notes, and test fixtures so the documented contract matches the shipped behavior (router scope, hybrid reserved state, follow-up tool names, freshness as explicit follow-up).
- Update tests across `memory-save`, `content-router`, `quality-loop`, `save-quality-gate`, reconsolidation-bridge, reconsolidation, assistive-reconsolidation, chunking, graph-refresh, thin-continuity, planner UX, CLI target authority, and memory-save integration to prove planner-default + fallback end-to-end behavior.
- Validate planner-first behavior against three real session transcripts before closeout.

### Out of Scope

- Changes to the canonical atomic writer internals; reuse as-is.
- Changes to the eight-category router contract; reuse as-is.
- Replacing the save system with a new planner service; the existing handler owns the contract.
- Changes to embedding backends, vector-DB schemas, or checkpoint/restore internals.
- Packet 012's canonical intake work or packet 013's advisor phrase-booster work — unrelated scope.

### Files to Change

| Surface | File Path | Change Type | Why It Matters |
|---------|-----------|-------------|----------------|
| Legacy write path retirement | `workflow.ts`, `file-writer.ts`, `memory-indexer.ts`, `memory-metadata.ts`, `directory-setup.ts` | Retire | Audit proved the runtime still created, wrote, indexed, and read `[spec]/memory/*.md` in contradiction to v3.4.0.0 retirement claim |
| Planner contract core | `memory-save.ts`, `types.ts`, `response-builder.ts`, `validation-responses.ts`, `generate-context.ts` | Modify | Introduce planner-first default + shared types + blocker/advisory separation |
| Canonical writer reuse | `create-record.ts`, `atomic-index-memory.ts`, `thin-continuity-record.ts`, `post-insert.ts` | Reuse/preserve | Core writer earns its cost; fallback path depends on stable interfaces |
| Content router | `content-router.ts` | Modify (scoped) | Preserve eight-category contract; add Tier 3 default-disable + manual-review guard |
| Quality gate | `quality-loop.ts`, `save-quality-gate.ts` | Modify | Preserve hard blockers; retire default-path auto-fix retries; keep advisory output |
| Reconsolidation | `reconsolidation-bridge.ts` | Gate | Move behind explicit opt-in or fallback |
| Freshness API | `api/indexing.ts`, `graph-metadata-parser.ts` | Create/expose | Follow-up APIs: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill` |
| Command docs | `../../../../command/memory/save.md`, `../../../../command/memory/manage.md` | Modify | Document planner-first default, fallback, and follow-up freshness actions |
| Reference docs | `../../../../skill/system-spec-kit/references/memory/save_workflow.md`, `../../../../skill/system-spec-kit/references/memory/memory_system.md`, templates | Modify | Align operator-facing references with shipped contract |
| Env reference | `../../../../skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document `SPECKIT_SAVE_PLANNER_MODE`, per-subsystem flags, reserved `hybrid` honestly |
| Release notes | `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` | Author | Record shipped contract, router scoped exception, reserved `hybrid`, follow-up APIs |
| Test surfaces | See tasks.md §Testing — broad vitest + transcript prototype sweep | Modify | Prove planner-default, fallback parity, gate behavior, continuity upserts |
| Packet metadata | `description.json`, `graph-metadata.json`, packet-local changelog | Generate | Packet discovery + graph visibility |
| Packet docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` | Create | Tell the complete story end-to-end |

### Research and Review Evidence

The packet carries packet-local snapshots of the audit report, research synthesis, deep-review report, and planner-first transcript prototypes so a reader can inspect the most important artifacts without leaving the folder. Those snapshots live under `research/013-audit-snapshot/`, `research/014-research-snapshot/`, `review/015-deep-review-snapshot/`, and `scratch/transcripts-snapshot/` respectively.

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default `/memory:save` path must be planner-first and non-mutating. | Default invocation returns structured planner output (route, legality, blockers, advisories, follow-up actions) and mutates no files on disk. |
| REQ-002 | Explicit `full-auto` must remain available as fallback. | Setting `SPECKIT_SAVE_PLANNER_MODE=full-auto` runs the canonical atomic writer with promotion, rollback, and same-path identity intact. |
| REQ-003 | The legacy `[spec]/memory/*.md` write path must be retired. | `workflow.ts`, `file-writer.ts`, `memory-indexer.ts`, `memory-metadata.ts`, and `directory-setup.ts` no longer create, write, index, or read that surface. |
| REQ-004 | Tier 3 routing must be default-off with a scoped, auditable exception. | `SPECKIT_ROUTER_TIER3_ENABLED=false` is default; `content-router.ts` contains the scoped default-disable + manual-review guard; the eight-category contract is otherwise unchanged. |
| REQ-005 | Quality-loop auto-fix must leave the default path while hard blockers remain. | Default path emits advisory output only; structural/legality blockers still fail the save; `SPECKIT_QUALITY_AUTO_FIX=false` is default. |
| REQ-006 | Reconsolidation-on-save must be explicit opt-in. | Default path never triggers reconsolidation; `SPECKIT_RECONSOLIDATION_ENABLED=false` is default; opt-in via env flag or fallback execution. |
| REQ-007 | Post-insert enrichment must leave the default save path. | Default path emits no enrichment calls; `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=false` is default; opt-in via env flag or follow-up API. |
| REQ-008 | Unconditional graph refresh and spec-doc reindex must leave planner-default saves. | Planner-default saves no longer trigger these; explicit follow-up APIs handle the work when wanted. |
| REQ-009 | `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill` must exist as explicit follow-up APIs. | All three are callable independently of the save path; each has execution-level test coverage. |
| REQ-010 | Fallback safety parity must be preserved. | `POST_SAVE_FINGERPRINT` parity is restored on the full-auto path; fallback tests prove atomic mutation + rollback semantics match the pre-packet writer. |
| REQ-011 | Template-contract failures must be planner blockers. | Template-contract misses surface as `blocker` entries in planner output, not as advisories. |
| REQ-012 | Deferred helpers must return explicit deferred status. | When default-path skips reconsolidation, enrichment, Tier 3 routing, or quality auto-fix, the planner response records `deferred` rather than success-shaped output. |
| REQ-013 | `hybrid` must be documented as reserved. | `SPECKIT_SAVE_PLANNER_MODE=hybrid` is recognized; current behavior matches `plan-only`; docs and env reference describe it as reserved for future behavior. |
| REQ-014 | Shipped documentation must match the runtime contract. | `/memory:save` docs, `ENV_REFERENCE.md`, release notes, and templates describe planner-first default, explicit fallback, follow-up APIs, reserved `hybrid`, and the scoped router exception honestly. |
| REQ-015 | Canonical atomic writer, routed record identity, content-router category contract, and thin continuity validation must remain intact. | Fallback path plus continuity upserts still run through the preserved core; tests prove no behavior regression outside the documented gated flags. |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-016 | Planner output must preserve blocker/advisory separation. | Types and helpers distinguish `blocker` entries (must fix) from `advisory` entries (informational) in all code paths and tests. |
| REQ-017 | CLI target authority must stay deterministic. | Planner-default CLI tests prove the same target selection as full-auto for identical inputs. |
| REQ-018 | Same-path identity must remain deterministic after the refactor. | Record identity tests confirm identical path semantics for the same-target save case across planner and full-auto paths. |
| REQ-019 | `/spec_kit:resume` recovery ladder must stay intact. | Recovery ladder tests show no regression when the save path is planner-first. |
| REQ-020 | Transcript prototypes must ground planner behavior. | Three real session transcripts are exercised; no unexpected drops, wrong-anchor outcomes, or unsafe target exposures are produced. |
| REQ-021 | Planner output must not expose unsafe file targets. | Target authority tests verify the planner emits only caller-authorized paths. |
| REQ-022 | Fallback flags must not silently widen mutation scope. | Env-flag documentation + tests prove that enabling any single opt-in flag does not cascade other opt-ins. |
| REQ-023 | Continuity upserts must still use validated helpers. | Thin continuity + upsert tests pass unchanged expectations. |
| REQ-024 | Follow-up APIs must be execution-level test-covered. | `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill` have vitest suites covering at least happy-path + one failure branch each. |
| REQ-025 | Four trim targets must stay aligned across packet docs. | Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, and post-insert enrichment are each documented consistently as default-off + opt-in. |

### P2 — Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-026 | Transcript backlog captured. | If a transcript prototype surfaces an issue that is not fixed in this packet, it is logged rather than lost. |
| REQ-027 | No new network dependency on the default path. | Planner-default never depends on new network calls introduced by this packet. |
| REQ-028 | Env reference diagrams and tables stay readable. | Env reference uses consistent wording for default/opt-in, reserved, and fallback. |
| REQ-029 | Chunking stays a size-driven fallback. | Chunking remains a fallback behavior for oversized inputs; not a default dependency. |
| REQ-030 | Follow-up actions surface consistently. | Planner output surfaces follow-up actions in a single consistent schema across router, quality, reconsolidation, enrichment, and indexing scenarios. |

---

<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/memory:save` with no env override returns structured planner output and mutates no files.
- **SC-002**: `SPECKIT_SAVE_PLANNER_MODE=full-auto` runs the canonical atomic writer with `POST_SAVE_FINGERPRINT` parity, promotion, and rollback intact.
- **SC-003**: `[spec]/memory/*.md` is no longer created, written, indexed, or read at runtime; audit evidence (F001-F007) resolved.
- **SC-004**: `SPECKIT_ROUTER_TIER3_ENABLED=false` is the default; Tier 3 routing only runs when explicitly enabled; `content-router.ts` Tier 3 guard is the single documented exception.
- **SC-005**: `SPECKIT_QUALITY_AUTO_FIX=false` is the default; hard blockers still fire on malformed saves; advisory output remains available.
- **SC-006**: `SPECKIT_RECONSOLIDATION_ENABLED=false` is the default; reconsolidation is available via opt-in or fallback.
- **SC-007**: `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=false` is the default; enrichment is available via opt-in or follow-up API.
- **SC-008**: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill` are callable APIs with execution-level test coverage.
- **SC-009**: `hybrid` is recognized as reserved for `SPECKIT_SAVE_PLANNER_MODE`; documented as currently behaving like `plan-only`.
- **SC-010**: Deferred helpers return explicit `deferred` status instead of success-shaped output when the default path skips them.
- **SC-011**: Template-contract failures produce `blocker` entries in planner output.
- **SC-012**: Docs (`/memory:save`, `ENV_REFERENCE.md`, release notes, templates) match the shipped contract; router scope is described honestly.
- **SC-013**: 43 of 43 implementation tasks completed; 0 blocked tasks at closeout.
- **SC-014**: Deep-review findings F001-F009 (3 P0, 5 P1, 1 P2) are resolved.
- **SC-015**: Canonical atomic writer, routed record identity, content-router category contract, and thin continuity validation are unchanged outside the documented Tier 3 guard.
- **SC-016**: Packet 016 primary docs pass `validate_document.py`.
- **SC-017**: Packet passes `validate.sh --strict`.
- **SC-018**: `description.json`, `graph-metadata.json`, and packet-local changelog exist.
- **SC-019**: Three real session transcripts validate planner-first behavior with no wrong-anchor or unsafe-target outcomes.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical atomic writer stability | High | Preserve as-is; fallback path relies on it |
| Dependency | Eight-category router contract | High | Preserve; record scoped Tier 3 exception only |
| Dependency | Vitest + transcript fixtures | High | Broad test sweep covers planner, fallback, router, quality, reconsolidation, enrichment, follow-up APIs, continuity |
| Dependency | `ENV_REFERENCE.md` + release notes alignment | High | Update both in the same packet as the runtime changes |
| Risk | Default path still mutates on some branch | High | Planner-default tests assert non-mutation; CI catches regression |
| Risk | Full-auto fallback loses `POST_SAVE_FINGERPRINT` parity | High | Explicit remediation (P015-R002) restores parity; fallback tests prove it |
| Risk | Docs drift from runtime after release | High | Changelog honesty remediation (P015-R009) aligns release notes to the scoped router exception and reserved `hybrid` state |
| Risk | Borderline router cases silently widen Tier 3 use | Medium | Tier 3 is default-disable + manual-review guard inside `content-router.ts`; env flag is opt-in only |
| Risk | Deferred helpers appear to have "succeeded" when they ran nothing | Medium | Explicit `deferred` status in planner output (P015-R004) |
| Risk | Template-contract misses hide as advisories | Medium | Promote to planner blockers (P015-R003) |
| Risk | `hybrid` mode assumed to be a live mixed-flow behavior | Medium | Reserved state documented explicitly in docs and release notes |
| Risk | Follow-up APIs ship without execution-level coverage | Medium | Remediation (P015-R006) adds coverage before closeout |
| Risk | Packet docs understate what the deep review caught | Medium | Implementation summary records 9-finding remediation closeout with status per finding |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness

- **NFR-C01**: The planner-default path must not mutate any file on disk.
- **NFR-C02**: The full-auto fallback must match pre-packet writer behavior for atomic mutation and rollback.
- **NFR-C03**: Router target authority must be identical between planner and fallback paths for the same inputs.

### Safety

- **NFR-SA01**: Hard legality blockers must still fire on malformed saves regardless of mode.
- **NFR-SA02**: Planner output must expose only caller-authorized file targets.
- **NFR-SA03**: `POST_SAVE_FINGERPRINT` parity must be restored on the full-auto path.

### Traceability

- **NFR-T01**: Every planner output item must map to a typed entry (`blocker` or `advisory` or `deferred`) with a source reason.
- **NFR-T02**: Env flags must be named consistently across code, docs, and env reference.
- **NFR-T03**: Deferred helpers must name the gated subsystem explicitly when skipping.

### Maintainability

- **NFR-M01**: The canonical atomic writer must remain the single mutation mechanism used by the fallback path.
- **NFR-M02**: The eight-category router contract must remain the single route-target mapping.
- **NFR-M03**: Opt-in flags must be orthogonal so enabling one does not cascade others.

### Governance

- **NFR-G01**: Level 3+ structure with governance and compliance sections present.
- **NFR-G02**: Packet passes `validate_document.py` and `validate.sh --strict`.
- **NFR-G03**: Release notes, `/memory:save` docs, and `ENV_REFERENCE.md` must agree on the same default/opt-in/reserved vocabulary.

### Usability

- **NFR-U01**: Planner output must be human-readable and action-oriented.
- **NFR-U02**: Operator docs must describe planner-first default, explicit fallback, and follow-up APIs in consistent language.
- **NFR-U03**: Follow-up action names must match the shipped tool names in packet docs.

### Reliability

- **NFR-R01**: The default path must not introduce any new network dependency.
- **NFR-R02**: Known limitations carried from the release and remediation pass must be preserved in packet docs.
- **NFR-R03**: Packet metadata must support packet discovery and graph traversal.

---

## 8. EDGE CASES

### Runtime Edge Cases

- Caller invokes `/memory:save` with no args → planner-default; returns plan; does not mutate.
- Caller explicitly requests `full-auto` → atomic mutation + rollback path.
- Caller explicitly enables `SPECKIT_ROUTER_TIER3_ENABLED` → Tier 3 routing participates; manual-review return flag is surfaced when triggered.
- Caller enables any single opt-in flag → only that subsystem activates; no cascade.
- Malformed template-contract save → planner output contains at least one `blocker` entry.
- Default-path call that would otherwise run reconsolidation → planner returns a `deferred` entry naming reconsolidation explicitly.
- `SPECKIT_SAVE_PLANNER_MODE=hybrid` → behaves like `plan-only`; documented as reserved.
- Follow-up API called independently → executes without touching the save path.

### Documentation Edge Cases

- A reader assumes "planner-first" means `full-auto` was deleted → docs must be explicit that `full-auto` remains available as fallback.
- A reader assumes "content-router preserved" means zero file-level edits → docs must surface the scoped Tier 3 guard honestly.
- A reader assumes `hybrid` is a live mixed-flow mode → docs must describe it as reserved with current `plan-only` behavior.
- A reader expects every save to reindex docs → docs must describe `reindexSpecDocs` as an explicit follow-up action.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | 15-subsystem save-flow audit, 43-task implementation, 9-finding deep-review remediation, plus docs + env reference + release note alignment |
| Risk | 21/25 | High narrative + correctness risk because the packet changes the default save contract and must preserve fallback safety parity |
| Research | 18/20 | Requires grounding on audit evidence, research classification, implementation scope, deep-review findings, and release notes |
| Multi-Agent | 12/15 | cli-codex led the main build-out; cli-copilot finished late-stage M5 closeout; parallel Opus agents for remediation |
| Coordination | 14/15 | Runtime changes + docs + env reference + release notes + packet metadata must all stay aligned |
| **Total** | **88/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default path mutates under a hidden branch | High | Low | Planner-default non-mutation tests |
| R-002 | Fallback loses atomic safety parity | High | Low | `POST_SAVE_FINGERPRINT` restored (ADR-007) |
| R-003 | Router preservation claim contradicts code | High | Medium | Scoped exception documented (ADR-007) |
| R-004 | Remediation underplayed after deep review | High | Low | 9-finding closure section in tasks, checklist, implementation summary |
| R-005 | Release notes drift from runtime contract | Medium | Medium | Changelog honesty remediation P015-R009 |
| R-006 | Opt-in flag cascade activates unintended subsystems | High | Low | Env reference + orthogonality tests |
| R-007 | Template-contract failures hide as advisories | Medium | Medium | Promoted to blockers (P015-R003) |
| R-008 | Deferred helpers appear "successful" when skipped | Medium | Medium | Explicit `deferred` status (P015-R004) |

---

## 11. USER STORIES

### US-001: Planner-first default

**As an** operator running `/memory:save`, **I want** the default path to show me a plan before anything changes, **so that** I can review routing, legality, and follow-up actions without committing to mutation.

**Acceptance Criteria**
1. Given a caller invokes `/memory:save` with no args, when the handler runs, then it returns structured planner output and mutates nothing.
2. Given a caller sees a planner blocker, when they correct the blocker, then a subsequent planner call shows the blocker resolved.

### US-002: Full-auto fallback

**As an** operator who still wants mutation, **I want** `SPECKIT_SAVE_PLANNER_MODE=full-auto` to run the canonical writer, **so that** automation workflows that depended on in-save mutation keep working.

**Acceptance Criteria**
1. Given `SPECKIT_SAVE_PLANNER_MODE=full-auto`, when the handler runs, then canonical atomic mutation + rollback + same-path identity behave exactly as before.
2. Given a full-auto run fails mid-write, when rollback fires, then `POST_SAVE_FINGERPRINT` parity is preserved.

### US-003: Explicit freshness follow-up

**As an** operator who wants freshness on demand, **I want** `refreshGraphMetadata`, `reindexSpecDocs`, and `runEnrichmentBackfill` as callable APIs, **so that** I only pay for that work when I actually need it.

**Acceptance Criteria**
1. Given a planner-default save completes, when I call `refreshGraphMetadata`, then graph metadata refreshes without mutating saved records.
2. Given an explicit follow-up action surfaces `reindexSpecDocs`, when I invoke the API, then spec docs reindex independently of the save path.

### US-004: Reserved `hybrid`

**As an** operator reading env docs, **I want** `hybrid` described as reserved, **so that** I don't assume it is a live mixed-flow behavior that I should rely on.

**Acceptance Criteria**
1. Given `SPECKIT_SAVE_PLANNER_MODE=hybrid`, when the handler runs, then behavior matches `plan-only`.
2. Given I read `ENV_REFERENCE.md`, when I look up `hybrid`, then the doc describes it as reserved with current `plan-only` behavior.

### US-005: Honest router scope

**As a** reviewer or release historian, **I want** the content-router preservation claim to match the code, **so that** future refactors don't assume bit-for-bit preservation when the Tier 3 guard exists.

**Acceptance Criteria**
1. Given I diff `content-router.ts` against the prior release, when I look at the changes, then I see the scoped Tier 3 default-disable + manual-review guard documented in ADR-007.
2. Given I read release notes, when I look for router scope, then the notes describe the scoped exception rather than claiming zero edits.

### US-006: Blocker classification

**As a** save caller with a malformed save, **I want** template-contract failures surfaced as blockers, **so that** I can't silently ship content that misses the contract.

**Acceptance Criteria**
1. Given a template-contract miss, when the planner runs, then the output contains at least one `blocker` entry naming the contract.
2. Given a `blocker` entry, when I fix the miss and rerun, then the blocker is gone and the advisory tier is empty (or names non-blocking issues only).

### US-007: Deferred status honesty

**As an** operator reading planner output, **I want** `deferred` status on skipped subsystems, **so that** I don't misread the result as "everything ran and succeeded."

**Acceptance Criteria**
1. Given `SPECKIT_RECONSOLIDATION_ENABLED=false`, when the planner runs, then reconsolidation shows `deferred` in the output (not success-shaped).
2. Given multiple subsystems are deferred, when the planner returns, then each appears as its own `deferred` entry naming the subsystem.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Audit scope review | Auditor | Complete | 2026-04-14 |
| Research verdict review | Researcher | Complete | 2026-04-14 |
| Implementation scope review | Implementation author | Complete | 2026-04-15 |
| Deep review | Reviewer | Complete | 2026-04-15 |
| Remediation closure review | Remediation author | Complete | 2026-04-15 |
| Archive-readiness review | Orchestrator | Complete | 2026-04-15 |

---

## 13. COMPLIANCE CHECKPOINTS

### Documentation Governance

- [x] Level 3+ packet structure present.
- [x] Snapshot notes added to copied Markdown files that carry source evidence.
- [x] Primary docs authored as unified narrative rather than copied duplicates.
- [x] Runtime contract described consistently across `/memory:save` docs, `ENV_REFERENCE.md`, release notes, and templates.

### Accuracy Governance

- [x] Audit truth preserved: runtime was half-migrated before this packet shipped.
- [x] Research verdict preserved: trim-targeted path classified four subsystems as default-off.
- [x] Implementation truth preserved: planner-first default + explicit fallback + follow-up APIs.
- [x] Remediation closure preserved: 9 deep-review findings resolved.

### Tooling Governance

- [x] `validate_document.py` pass recorded for the six primary docs.
- [x] `validate.sh --strict` pass recorded.
- [x] `description.json` and `graph-metadata.json` generated.

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication Need |
|-------------|------|----------|--------------------|
| Save-flow maintainers | Runtime and docs owners | High | Need one accurate packet for future change planning |
| Release maintainers | Changelog and archive owners | High | Need packet-level alignment with v3.4.1.0 |
| Future reviewers | Audit and remediation readers | High | Need source-backed narrative without packet hopping |
| Tooling operators | `/memory:save` users | Medium | Need clear default, fallback, and follow-up behavior |
| AI orchestrators | Session continuity readers | High | Need the planner-first contract documented end-to-end |

---

## 15. CHANGE LOG

### v1.0 (2026-04-15)

- Shipped planner-first default for `/memory:save` with explicit `full-auto` fallback.
- Retired legacy `[spec]/memory/*.md` write path.
- Gated Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, and post-insert enrichment behind per-subsystem env flags.
- Introduced `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill` as explicit follow-up APIs.
- Documented `hybrid` as reserved with current `plan-only` behavior.
- Recorded the scoped `content-router.ts` Tier 3 guard as ADR-007.
- Remediated all 9 deep-review findings (3 P0, 5 P1, 1 P2).

---

### Acceptance Scenarios

### Scenario 1: Planner-first default is the shipped contract

**Given** the reader opens packet docs
**When** they read the executive summary, implementation summary, and checklist
**Then** they understand that `/memory:save` now returns a structured planner response by default and no longer mutates files on the default path.

### Scenario 2: Full-auto fallback remains available

**Given** the reader wants to know whether automation was removed entirely
**When** they inspect the unified requirements and implementation summary
**Then** they see that `SPECKIT_SAVE_PLANNER_MODE=full-auto` still preserves canonical atomic mutation, promotion, rollback, and same-path identity.

### Scenario 3: Deferred enrichment is not removal

**Given** the reader looks for graph refresh, reindex, and enrichment behavior
**When** they read the packet docs
**Then** they understand that these behaviors moved to explicit follow-up actions or fallback mode rather than disappearing.

### Scenario 4: `SPECKIT_SAVE_PLANNER_MODE` is the primary planner flag

**Given** a maintainer is checking the rollout model
**When** they inspect the implementation and verification sections
**Then** they see `plan-only` as default, `full-auto` as explicit fallback, and `hybrid` as reserved.

### Scenario 5: `SPECKIT_ROUTER_TIER3_ENABLED` stays opt-in

**Given** a reader wants to know whether Tier 3 routing still participates by default
**When** they inspect the acceptance and decision sections
**Then** they see that Tier 3 routing is default-off and guarded as a scoped exception inside `content-router.ts`.

### Scenario 6: `SPECKIT_QUALITY_AUTO_FIX` stays opt-in

**Given** a reader wants to know what happened to quality-loop auto-fix
**When** they read the requirements and ADR set
**Then** they see that hard checks remain blockers while auto-fix retries moved behind explicit opt-in behavior.

### Scenario 7: `SPECKIT_RECONSOLIDATION_ENABLED` stays opt-in

**Given** a reader wants to know what happened to reconsolidation-on-save
**When** they inspect the implementation and verification sections
**Then** they see that reconsolidation remains available only through explicit opt-in or fallback behavior.

### Scenario 8: `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` stays opt-in

**Given** a reader wants to know whether post-insert enrichment still exists
**When** they inspect the requirement, decision, and summary sections
**Then** they see that post-insert enrichment remains available but is no longer part of the default save path.

---

<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
### Questions

| Area | Question | Answer | Evidence |
|------|----------|--------|----------|
| Audit | Was the legacy memory-file surface truly retired when the audit began? | No. The audit found the runtime still created, wrote, indexed, and read `[spec]/memory/*.md`. | `research/013-audit-snapshot/review-report.md`, `research/013-audit-snapshot/iterations/iteration-001.md` |
| Audit | Was the contradiction limited to docs? | No. The contradiction existed in runtime code, docs, templates, and tests. | `research/013-audit-snapshot/review-report.md` |
| Audit | How large was the original active finding set? | 25 active findings across 9 P0, 9 P1, and 7 P2. | `research/013-audit-snapshot/review-report.md` |
| Audit | What closure paths did the audit identify? | Path A retire, Path B rescind, Path C dedup redesign. | `research/013-audit-snapshot/review-report.md` |
| Audit | Which outcome became historical truth in v3.4.1.0? | The retirement path landed and release notes aligned the runtime with the intended canonical-doc model. | `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`, `research/013-audit-snapshot/deep-review-strategy.md` |
| Research | Which save-flow pieces remained load-bearing? | Canonical atomic writer, routed record identity, content-router core, thin continuity validation. | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json` |
| Research | Which save-flow pieces were over-engineered on the default path? | Tier 3 routing, reconsolidation-on-save, heavy quality-loop auto-fix, post-insert enrichment. | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json` |
| Research | Could the save system be redesigned without replacing the core writer? | Yes. The research recommended a planner-first wrapper around the existing canonical prep and fallback writer. | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/iterations/iteration-020.md` |
| Research | Did the research support decoupling reindex and graph refresh? | Yes. Both were classified as freshness or derived-state concerns rather than write-core correctness. | `research/014-research-snapshot/research.md` |
| Research | Did the research require deleting the CLI wrapper? | No. The wrapper retained partial value for explicit target authority and structured input normalization. | `research/014-research-snapshot/iterations/iteration-001.md`, `research/014-research-snapshot/findings-registry.json` |
| Implementation | What became the new default operator contract? | Planner-first `/memory:save` with structured non-mutating output. | `review/015-deep-review-snapshot/primary-docs/spec.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Implementation | Was the old full-auto path deleted? | No. It remained available as explicit `full-auto` fallback. | `review/015-deep-review-snapshot/primary-docs/spec.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Implementation | How many implementation tasks shipped? | 43 of 43 tasks. | `review/015-deep-review-snapshot/primary-docs/tasks.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Implementation | Which follow-up APIs became explicit? | `refreshGraphMetadata`, `reindexSpecDocs`, and `runEnrichmentBackfill`. | `review/015-deep-review-snapshot/primary-docs/tasks.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Review | What did the first deep-review pass find? | 3 P0, 5 P1, and 1 P2 findings across router honesty, fallback parity, blocker classification, coverage, and doc drift. | `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/deep-review-findings-registry.json` |
| Remediation | Did the packet close every deep-review finding? | Yes. All 9 findings were resolved. | `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `review/015-deep-review-snapshot/deep-review-findings-registry.json` |
| Remediation | What became the honest router story after remediation? | Router core preserved with one scoped Tier 3 default-disable and manual-review exception recorded in the ADR set. | `review/015-deep-review-snapshot/primary-docs/decision-record.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Release | What does `hybrid` mean after remediation? | It remains reserved and currently behaves like `plan-only`. | `review/015-deep-review-snapshot/review-report.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |

---

## 16. OPEN QUESTIONS

None. The packet records the shipped and remediated state of `/memory:save` as of 2026-04-15.

---

<!-- /ANCHOR:questions -->
## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Inventory**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Audit Evidence Snapshot**: `research/013-audit-snapshot/`
- **Research Evidence Snapshot**: `research/014-research-snapshot/`
- **Deep-Review Evidence Snapshot**: `review/015-deep-review-snapshot/`
- **Transcript Evidence Snapshot**: `scratch/transcripts-snapshot/`
