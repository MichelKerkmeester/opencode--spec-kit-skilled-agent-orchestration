---
title: "Implementation Plan: /memory:save Planner-First Default"
description: "Milestoned delivery (M1-M10) for the planner-first /memory:save contract: audit + retirement of the legacy [spec]/memory/*.md write path, 20-iteration relevance research, planner contract + fallback implementation, routing/quality/reconsolidation/enrichment trim, follow-up API extraction, verification, release alignment, and deep-review remediation."
trigger_phrases:
  - "implementation plan"
  - "memory save planner first"
  - "planner-first memory save plan"
  - "save flow trim plan"
  - "retirement audit to planner-first"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Folder renamed; plan rewritten as M1-M10 planner-first delivery"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:014-planner-first-plan-2026-04-15"
      session_id: "014-planner-first-plan-2026-04-15"
      parent_session_id: "014-planner-first-seed"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The planner-first default + explicit fallback architecture preserves the canonical writer while eliminating the default-path overreach."
      - "Delivery spanned M1-M10 across audit, research, implementation, verification, release alignment, and deep-review remediation."
---
# Implementation Plan: /memory:save Planner-First Default

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language or Stack** | TypeScript save-flow handlers, CLI wrapper, routing, validation, indexing, and follow-up APIs; markdown packet docs + release notes |
| **Framework** | system-spec-kit MCP server + spec-folder workflow |
| **Storage** | Canonical spec docs, vector DB, routed record identity, graph metadata, optional follow-up indexing |
| **Testing** | `validate_document.py`, `validate.sh --strict`, vitest suites, transcript prototypes, env-flag orthogonality tests |
| **Runtime Surface** | TypeScript save-flow handlers, CLI wrapper, routing, validation, indexing, and follow-up APIs described in `spec.md §3` |

### Overview

The plan delivers a planner-first default for `/memory:save` while preserving the canonical atomic writer as an explicit fallback. It retires the legacy `[spec]/memory/*.md` write path end-to-end, gates four previously default-on save-path behaviors behind explicit env flags, and extracts freshness into three explicit follow-up APIs. Delivery runs through 10 sequential milestones: audit surface + classification, retirement cutover, relevance research, planner contract build-out, routing + quality trim, verification + transcript prototypes, release alignment, and deep-review remediation.

### Full Delivery Summary

| Milestone | Theme | Main Output | Why It Matters |
|-----------|-------|-------------|----------------|
| M1 | Audit kickoff | Classification rules + iteration plan | Establishes the audit frame |
| M2 | Audit convergence | 25-finding audit report + half-migrated diagnosis | Proves the default contract is broken |
| M3 | Retirement cutover | v3.4.1.0 removes legacy memory-file write path + aligns docs | Bridges audit to planner work |
| M4 | Research kickoff | Q1-Q10 relevance questions | Sets the classification scope |
| M5 | Research convergence | 15-subsystem classification + trim-targeted verdict | Decides what survives the default path |
| M6 | Planner contract | Planner-first default + flag plumbing + type surface + shared types | Ships the new operator contract |
| M7 | Routing and quality trim | Tier 3 + quality-loop + reconsolidation + enrichment leave the default path | Aligns runtime to verdict |
| M8 | Verification + transcripts | Targeted tests, transcript prototypes, packet validation | Grounds planner behavior in real operator flows |
| M9 | Release alignment | v3.4.1.0 release note + env reference + template updates | Runtime contract documented honestly |
| M10 | Deep-review remediation | 9-finding closure (3 P0, 5 P1, 1 P2) | Closes the last correctness + honesty gaps |

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Audit classification rules and dimension plan defined before iteration started.
- [x] Q1-Q10 relevance questions agreed before M4 kickoff.
- [x] Load-bearing core and candidate trim targets defined before M6 kickoff.
- [x] Packet scope limited to the planner contract, retirement of legacy write path, subsystem gating, follow-up APIs, and docs alignment.

### Definition of Done

- [x] Packet canonical docs exist and agree on the planner-first contract.
- [x] Audit, research, deep-review, and transcript snapshots copied into the packet.
- [x] Every copied Markdown file begins with the required snapshot note.
- [x] `description.json`, `graph-metadata.json`, and packet-local nested changelog exist.
- [x] All primary docs pass `validate_document.py`.
- [x] Packet passes `validate.sh --strict` with no blocking errors.
- [x] Planner-default runtime tests prove the default path is non-mutating.
- [x] Full-auto fallback tests prove atomic mutation + rollback + `POST_SAVE_FINGERPRINT` parity.
- [x] Follow-up APIs (`refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`) have execution-level coverage.
- [x] Deep-review findings F001-F009 closed.

---

<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Planner-first wrapper around the preserved canonical atomic writer. The default path computes route + legality + advisory data and returns structured planner output without mutating files. An explicit fallback path activates the canonical writer with full atomic semantics intact. Freshness work lives in callable follow-up APIs.

### Key Components

- **Planner-first handler (`memory-save.ts`)**: Default execution path returning planner output (routes, blockers, advisories, follow-up actions). No mutation on default.
- **Canonical atomic writer (preserved: `create-record.ts`, `atomic-index-memory.ts`, `thin-continuity-record.ts`, `post-insert.ts`)**: Fallback path when `SPECKIT_SAVE_PLANNER_MODE=full-auto`. Rollback, promotion, same-path identity, `POST_SAVE_FINGERPRINT` parity intact.
- **Content router (`content-router.ts`)**: Eight-category contract preserved. Scoped exception: Tier 3 default-disable + manual-review guard.
- **Quality gate (`quality-loop.ts`, `save-quality-gate.ts`)**: Hard blockers preserved. Auto-fix retries gated behind `SPECKIT_QUALITY_AUTO_FIX=true`.
- **Reconsolidation (`reconsolidation-bridge.ts`)**: Gated behind `SPECKIT_RECONSOLIDATION_ENABLED=true` or explicit fallback.
- **Post-insert enrichment (`post-insert.ts`)**: Gated behind `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED=true` or follow-up API.
- **Follow-up indexing APIs (`api/indexing.ts`, `graph-metadata-parser.ts`)**: `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`.
- **Env reference + command docs + release notes**: Aligned to describe default/opt-in/reserved/fallback consistently.

### Data Flow

```text
Caller invokes /memory:save
    |
    v
Resolve SPECKIT_SAVE_PLANNER_MODE
    |
    |-- default or plan-only or hybrid(reserved) -->
    |       Compute route + legality + advisories
    |       Respect env flags for deferred helpers
    |       Return structured planner output (no mutation)
    |
    +-- full-auto -->
            Canonical atomic writer
            Promotion + rollback + same-path identity
            POST_SAVE_FINGERPRINT parity
            Gated subsystems run only when their env flag is true
```

### File-Level Change Map

See `spec.md §3 Files to Change` for the consolidated table covering legacy write-path retirement, planner contract core, canonical writer preservation, content router scoped exception, quality gate updates, reconsolidation gating, enrichment deferral, freshness APIs, command + reference + env docs, release notes, test surfaces, and packet metadata.

### Runtime Surface Summary

| Area | Files | Role |
|------|-------|------|
| Legacy write path retirement | `directory-setup.ts`, `workflow.ts`, `file-writer.ts`, `memory-indexer.ts`, `memory-metadata.ts` | Removed from runtime |
| Load-bearing core preserved | `memory-save.ts`, `create-record.ts`, `atomic-index-memory.ts`, `thin-continuity-record.ts`, `content-router.ts`, `post-insert.ts`, `reconsolidation-bridge.ts`, `workflow.ts` | Writer core + continuity + routing |
| Planner contract | `types.ts`, `response-builder.ts`, `validation-responses.ts`, `generate-context.ts`, `/memory:save` docs | Default non-mutating output |
| Follow-up APIs | `api/indexing.ts`, `graph-metadata-parser.ts` | Deferred freshness + enrichment |
| Remediation surfaces | `content-router.ts`, `memory-save.ts`, `post-insert.ts`, `../../../../skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` | Deep-review closure + honesty fixes |

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Milestone Flow

```text
M1 Audit kickoff
  -> M2 Audit convergence
  -> M3 Retirement closure (v3.4.1.0 legacy write-path removal)
  -> M4 Research kickoff
  -> M5 Research convergence (15-subsystem classification + trim-targeted verdict)
  -> M6 Planner contract
  -> M7 Routing + quality + reconsolidation + enrichment trim
  -> M8 Verification and transcripts
  -> M9 Release alignment
  -> M10 Deep-review remediation
```

### M1 — Audit kickoff

Open the audit with a narrow question: does any active file still write, read, or assume `[spec]/memory/*.md` in contradiction to the retirement claim? Define classification rules and the iteration plan. Evidence: `research/013-audit-snapshot/primary-docs/spec.md`, `research/013-audit-snapshot/deep-review-strategy.md`.

### M2 — Audit convergence

Run the audit to convergence across 7 iterations. Document the half-migrated state in concrete families: runtime write path, runtime read path, doc contradiction, phantom dedup contract, test drift, and template drift. 25 active findings across 9 P0, 9 P1, and 7 P2 produce three closure paths (A retire, B rescind, C dedup redesign). Evidence: `research/013-audit-snapshot/iterations/`, `research/013-audit-snapshot/review-report.md`.

### M3 — Retirement closure

Remove the live memory-file write path, clean up templates and docs, and align the runtime with the intended canonical-doc model. v3.4.1.0 records the cutover. Evidence: `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`.

### M4 — Research kickoff

After the retirement cutover, open relevance research with Q1-Q10 covering load-bearing core, planner-first feasibility, quality-check classification, reindex vs freshness, graph-metadata refresh, entity extraction, reconsolidation cost, router classifier overfitting, trigger harmonization, and continuity ownership. Evidence: `research/014-research-snapshot/primary-docs/spec.md`, `research/014-research-snapshot/deep-research-strategy.md`.

### M5 — Research convergence

Run 20 iterations of relevance research. Classify 15 subsystems into load-bearing (canonical atomic writer, routed record identity, content-router core, thin continuity validation), candidate trim targets (Tier 3 routing, reconsolidation-on-save, heavy quality-loop auto-fix, post-insert enrichment), and other categories. Reach the `trim-targeted` verdict: keep the writer, trim the oversized default-path stack. Evidence: `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json`.

### M6 — Planner contract

Build the planner-first default, CLI defaults, docs, and type surfaces:

- [x] T001-T005 Add planner-default and fallback flag definitions; planner response interfaces; response serialization helpers; planner blocker and advisory response helpers.
- [x] T006-T008 Make `generate-context.ts` request planner-first behavior by default; update `/memory:save` docs; make `memory-save.ts` return planner output by default with explicit fallback.
- [x] T009-T012 Update aggregate and handler tests for planner-default behavior; focused planner-first regression coverage.

### M7 — Routing and quality trim

Trim Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, and post-insert enrichment from the default hot path while preserving the category contract and hard blockers:

- [x] T013-T017 Trim default Tier 3 participation while preserving category contract; reduce Tier 2 prototype library; update content-router tests for Tier 1/Tier 2 deterministic default; update runtime routing + intent-routing tests.
- [x] T018-T022 Retire default-path auto-fix retries; preserve hard structural blockers; update quality-loop + save-quality-gate + pipeline-enforcement tests.
- [x] T023-T026 Gate reconsolidation behind explicit flag/fallback; move default-path enrichment to explicit follow-up behavior; preserve same-path lineage; keep chunking as size-driven fallback.
- [x] T027-T034 Move unconditional graph refresh + spec-doc reindex out of planner-default saves; expose explicit follow-up indexing entry points; keep graph refresh callable as explicit follow-up; update reconsolidation-bridge, reconsolidation, assistive-reconsolidation, chunking, graph-refresh tests.

### M8 — Verification and transcripts

Prove the planner-first model holds up against real session evidence:

- [x] T035-T037 Memory-save integration tests for planner-default plus fallback end-to-end; planner UX regression tests for readable output; thin-continuity tests for normalization + upsert parity.
- [x] T038 Prototype planner-first behavior against three real session transcripts. Evidence: `scratch/transcripts-snapshot/`.
- [x] T039-T040 Run per-file doc validation + strict packet validation; capture follow-on defects.
- [x] T041-T043 Review structural parity between `/memory:save` + `AGENTS.md` + system-spec-kit skill doc; review fallback safety against `atomic-index-memory.ts` + `create-record.ts`; review transcript mismatches and convert unresolved issues into follow-on tasks.

### M9 — Release alignment

Document the shipped contract in `v3.4.1.0` release notes and closeout docs, including the explicit follow-up APIs, the scoped router exception, and the reserved state of `hybrid`. Evidence: `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`.

### M10 — Deep-review remediation

Close the 9 findings from the deep-review pass (3 P0, 5 P1, 1 P2):

- **F001 [P0]**: router-preservation contradiction → resolved by documenting the scoped `content-router.ts` exception (ADR-007).
- **F002 [P0]**: fallback safety parity → resolved by reinstating `POST_SAVE_FINGERPRINT`.
- **F003 [P0]**: template-contract failures hidden as advisories → resolved by promoting them to planner blockers.
- **F004 [P1]**: deferred enrichment returning success-shaped status → resolved by returning explicit `deferred` status.
- **F005 [P2]**: `hybrid` assumed live → resolved by marking reserved and documenting `plan-only`-equivalent behavior.
- **F006 [P1]**: follow-up API coverage → resolved by adding execution-level coverage for `refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`.
- **F007 [P1]**: follow-up tool names in packet docs → resolved by aligning docs to shipped names.
- **F008 [P1]**: env reference drift → resolved by documenting `hybrid` honestly in `ENV_REFERENCE.md`.
- **F009 [P1]**: release-note honesty → resolved by describing router scope and `hybrid` state accurately in `v3.4.1.0.md`.

---

<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Source |
|-----------|-------|-------|--------|
| Audit validation | Verify runtime + doc contradictions | Deep-review iterations + synthesis report | `research/013-audit-snapshot/**` |
| Research convergence | Verify Q1-Q10 answers + 15-subsystem verdicts | Deep-research iterations + findings registry | `research/014-research-snapshot/**` |
| Runtime contract tests | Planner-default + fallback parity + router + quality + follow-up APIs | Vitest suites + targeted sweeps | `review/015-deep-review-snapshot/primary-docs/tasks.md`, `review/015-deep-review-snapshot/primary-docs/checklist.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md` |
| Transcript validation | Planner-first behavior against real sessions | Transcript markdown + planner-output JSON + transcript reviews | `scratch/transcripts-snapshot/` |
| Review convergence | Deep-review isolation of real defect set | Review report + findings registry + iteration ledger | `review/015-deep-review-snapshot/**` |
| Remediation confirmation | All 9 review findings resolved | Remediated docs + tests + changelog + implementation summary | `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Packet validation | Packet structural soundness | `validate_document.py`, `validate.sh --strict` | This packet |

### Audit Approach (M1-M3)

- Focused deep-review loop over runtime, docs, tests, and templates.
- Classification rule applied each iteration.
- Convergence threshold tracked and documented.
- Retirement cutover delivered as part of v3.4.1.0; docs aligned to the canonical-doc model.

### Research Approach (M4-M5)

- 20 iterations with explicit subsystem questions.
- Research document and findings registry used as the canonical synthesis.
- Minimal replacement design evaluated against live code surfaces.
- Final report explicitly ruled out a full writer redesign.

### Implementation Approach (M6-M8)

- Planner-first contract built before trim work.
- Routing, quality, reconsolidation, enrichment, and follow-up APIs covered by targeted tests.
- Transcript prototypes used to validate real operator narratives.
- Packet-local doc validation and strict packet validation used as release gates.

### Remediation Approach (M10)

- Deep review split concerns into runtime correctness, follow-up API integrity, coverage, and documentation honesty.
- Remediation closed all 9 findings and aligned packet docs and release notes.
- Packet docs reflect the remediated state as the final truth.

---

<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Audit evidence | Documentation source | Ready | Audit truth cannot be grounded |
| Research synthesis | Documentation source | Ready | Verdicts and Q1-Q10 would be underspecified |
| Canonical atomic writer | Runtime core | Preserved | Fallback path depends on it |
| Eight-category router contract | Runtime core | Preserved | Target authority depends on it |
| Vitest suites | Verification tooling | Ready | Runtime contract evidence |
| Transcript fixtures | Verification input | Ready | Real-operator-flow evidence |
| v3.4.1.0 changelog | Release artifact | Ready | Release-state truth |
| `validate_document.py` | Tooling | Pass recorded | Docs could ship with structural defects |
| `validate.sh --strict` | Tooling | Pass recorded | Packet could ship with blocking issues |
| `generate-description.js` | Tooling | Run | Packet metadata complete |
| Nested changelog generator | Tooling | Run | Packet-local change trace complete |

---

<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Planner-default mutates under some branch, fallback loses atomic safety parity, router preservation claim contradicts code, or remediation reopens a closed finding.
- **Procedure**: Revert runtime changes + docs + env reference + release note as one batch. Re-run vitest suites + strict validation + transcript prototypes.
- **Data reversal**: No data migrations. Vector DB schema unchanged; saves still use the canonical atomic writer when fallback is active.

### Per-Milestone Rollback

| Milestone | Trigger | Rollback Action | Data Reversal |
|-----------|---------|-----------------|---------------|
| M3 retirement cutover | Legacy memory-file surface regression | Revert the retirement commit; re-run audit fixtures | None |
| M6 planner contract | Planner output schema drift or default mutation | Revert planner commits; re-enable prior handler default | None |
| M7 trim milestones | Opt-in flag cascade activates unintended subsystems | Revert trim commits for affected subsystem | None |
| M8 verification | Transcript prototype breaks unexpectedly | Patch surface; re-run validator | None |
| M9 release alignment | Release notes drift from runtime | Patch release notes + env reference | None |
| M10 remediation | Reopened finding | Apply targeted patch; re-run closure tests | None |

### Consolidated Rollback Note

Because the canonical atomic writer is preserved, rollback means reverting the planner-first wrapper + env-flag gates + follow-up API exports. Fallback behavior continues to work with full atomic semantics intact.

---

<!-- /ANCHOR:rollback -->
## L2: PHASE DEPENDENCIES

```text
M1 Audit kickoff
  -> M2 Audit convergence
  -> M3 Retirement closure
  -> M4 Research kickoff
  -> M5 Research convergence
  -> M6 Planner contract
  -> M7 Routing and quality trim
  -> M8 Verification and transcripts
  -> M9 Release alignment
  -> M10 Remediation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| M1 | None | M2-M10 |
| M2 | M1 | M3-M10 |
| M3 | M2 | M4-M10 |
| M4 | M3 | M5-M10 |
| M5 | M4 | M6-M10 |
| M6 | M5 | M7-M10 |
| M7 | M6 | M8-M10 |
| M8 | M7 | M9-M10 |
| M9 | M8 | M10 |
| M10 | M9 | Packet closeout |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit + retirement | High | 1-2 days |
| Research convergence | High | 1 day |
| Planner contract | High | 0.5-1 day |
| Routing + quality + reconsolidation + enrichment trim | High | 1-1.5 days |
| Verification + transcripts | Medium | 0.5 day |
| Release alignment | Medium | 0.5 day |
| Deep-review remediation (9 findings) | High | 0.5-1 day |
| **Total** | **High** | **~5-7 implementation days** |

### Historical Effort Context

| Area | Effort Shape | Why It Matters |
|------|--------------|----------------|
| Audit loop | Multi-iteration review + release alignment | Explains depth of the original contradiction |
| Research loop | 20-iteration classification | Explains trim-targeted verdict trustworthiness |
| Implementation | 43 tasks across planner + trim + verification | Explains why the contract cannot be summarized as a small one-line change |

---

## L2: ENHANCED ROLLBACK

### Pre-release Checks

- [x] Snapshot tree complete (audit + research + review + transcripts)
- [x] Planner-default runtime tests pass
- [x] Full-auto fallback tests pass with `POST_SAVE_FINGERPRINT` parity
- [x] Follow-up API coverage in place
- [x] Release notes + env reference aligned to runtime

### Rollback Procedure

1. Revert planner commits atomically; fallback behavior continues via canonical writer.
2. Revert env-flag gates for any subsystem that regressed.
3. Re-run vitest suites + strict validation + transcript prototypes.
4. If v3.4.1.0 release note needs adjustment, patch the release note and env reference.

### Data Reversal

- **Has data migration?** No
- **Reversal procedure**: Runtime-level revert only

---

## L3: DEPENDENCY GRAPH

```text
┌──────────────┐
│ Audit (M1-M2)│
└──────┬───────┘
       v
┌──────────────┐
│ Retirement   │
│ cutover (M3) │
└──────┬───────┘
       v
┌──────────────┐
│ Research     │
│ (M4-M5)      │
└──────┬───────┘
       v
┌──────────────┐
│ Planner +    │
│ trim (M6-M7) │
└──────┬───────┘
       v
┌──────────────┐
│ Verification │
│ (M8)         │
└──────┬───────┘
       v
┌──────────────┐
│ Release      │
│ alignment M9 │
└──────┬───────┘
       v
┌──────────────┐
│ Remediation  │
│ (M10)        │
└──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Audit | None | Half-migrated evidence | Retirement cutover |
| Retirement cutover | Audit | Canonical-doc-aligned runtime | Research |
| Research | Retirement cutover | Trim-targeted verdict | Planner contract |
| Planner contract | Research | Non-mutating default + fallback | Trim milestones |
| Trim milestones | Planner contract | Gated subsystems + follow-up APIs | Verification |
| Verification | Trim milestones | Targeted tests + transcript evidence | Release |
| Release alignment | Verification | v3.4.1.0 + env reference + templates | Remediation |
| Remediation | Release alignment | 9-finding closure + honest router scope | Closeout |

---

## L3: CRITICAL PATH

1. **Audit the half-migrated state** — critical because every later claim depends on grounded evidence.
2. **Retire the legacy write path** — critical so research and implementation do not inherit the contradiction.
3. **Classify the 15 subsystems** — critical so the trim targets are objective.
4. **Ship the planner-first default + full-auto fallback** — critical because it is the operator-facing contract.
5. **Gate Tier 3 + quality + reconsolidation + enrichment** — critical so the default path actually trims.
6. **Expose follow-up APIs** — critical so deferred work remains callable.
7. **Align docs + release notes + env reference** — critical so the shipped contract is documented honestly.
8. **Close all 9 deep-review findings** — critical because the first review verdict was remediation-required.

**Total Critical Path**: Audit → Retirement → Research → Planner + Trim → Verification → Release → Remediation

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit kickoff | Classification rules + iteration plan published | Audit spec + strategy |
| M2 | Audit convergence | 25-finding audit report + half-migrated diagnosis | Audit synthesis |
| M3 | Retirement cutover | Legacy memory-file write path removed | v3.4.1.0 release |
| M4 | Research kickoff | Q1-Q10 published | Research spec + strategy |
| M5 | Research convergence | 15-subsystem classification + trim-targeted verdict | Research synthesis |
| M6 | Planner contract | Planner-first default + fallback + shared types | Runtime handler |
| M7 | Routing + quality trim | Four subsystems behind env flags | Runtime handlers |
| M8 | Verification + transcripts | Targeted tests + transcript prototypes + packet validation | Vitest + transcripts |
| M9 | Release alignment | v3.4.1.0 + `/memory:save` docs + env reference + templates | Release artifacts |
| M10 | Remediation | 9 findings closed | Review report + ADR-007 |

---

### Architecture Decision Record Summary

| ADR | Summary |
|-----|---------|
| ADR-001 | Trim-targeted verdict: keep the core writer, trim the oversized default-path stack |
| ADR-002 | Planner-first output becomes the default `/memory:save` contract |
| ADR-003 | Reconsolidation-on-save becomes explicit opt-in |
| ADR-004 | Post-insert enrichment becomes deferred or standalone |
| ADR-005 | Router categories stay while Tier 2 or Tier 3 scope narrows |
| ADR-006 | Hard checks remain while quality-loop auto-fix leaves the default path |
| ADR-007 | Router preservation claim becomes "core preserved with one scoped exception" |

---

## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist

- [x] Confirm the canonical atomic writer stays intact
- [x] Confirm env flags stay orthogonal
- [x] Confirm planner default stays non-mutating

### Task Execution Rules

| Rule | Description |
|------|-------------|
| EXEC-SEQ | Ship planner contract before trim work |
| EXEC-EVIDENCE | Every trim target maps to an audit/research finding |
| EXEC-SCOPE | Do not touch canonical atomic writer internals |

### Status Reporting Format

Report task state as `P###-ID [x] - description` using the packet-prefixed IDs in `tasks.md`.

### Blocked Task Protocol

If a runtime change regresses fallback safety, revert and patch the specific subsystem before re-running the verification sweep.

### Tier 1: Runtime Core

**Files**
- `memory-save.ts`, `types.ts`, `response-builder.ts`, `validation-responses.ts`, `generate-context.ts`
- `content-router.ts`, `quality-loop.ts`, `save-quality-gate.ts`
- `reconsolidation-bridge.ts`, `post-insert.ts`
- `api/indexing.ts`, `graph-metadata-parser.ts`

**Goal**
- Preserve the canonical atomic writer + routing + continuity; move default-path overreach behind env flags; expose follow-up APIs.

### Tier 2: Docs + Release

| Workstream | Output | Notes |
|------------|--------|-------|
| Runtime contract docs | `/memory:save` docs + `ENV_REFERENCE.md` + templates | Align to shipped contract |
| Release notes | `v3.4.1.0.md` | Scoped exception + reserved `hybrid` honestly |
| Packet docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` | Tell the end-to-end story |

### Tier 3: Validation

**Goal**
- Packet behaves like a normal spec packet: validators pass, metadata generated, packet-local changelog emitted.

**Actions**
- Run `validate_document.py`
- Run `validate.sh --strict`
- Generate `description.json`
- Author or verify `graph-metadata.json`
- Generate nested changelog

---

## L3+: WORKSTREAM COORDINATION

| ID | Name | Scope | Output |
|----|------|-------|--------|
| W-A | Audit + retirement | Half-migrated evidence + legacy write-path removal | `research/013-audit-snapshot/**` + v3.4.1.0 retirement |
| W-B | Research | 15-subsystem classification + trim-targeted verdict | `research/014-research-snapshot/**` |
| W-C | Planner contract + trim | Runtime handlers + env flags + follow-up APIs | Runtime TypeScript |
| W-D | Verification + transcripts | Targeted tests + three transcript prototypes | Vitest + `scratch/transcripts-snapshot/` |
| W-E | Docs + release alignment | `/memory:save` docs + env reference + release notes + packet docs | Docs surface |
| W-F | Remediation | 9-finding closure + ADR-007 | `review/015-deep-review-snapshot/**` |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Audit complete | W-A + W-B | Research grounded in audit reality |
| SYNC-002 | Research complete | W-B + W-C | Trim targets objective |
| SYNC-003 | Runtime complete | W-C + W-D | Tests cover default + fallback + gated subsystems |
| SYNC-004 | Verification complete | W-D + W-E | Docs + release + env reference aligned to runtime |
| SYNC-005 | Release aligned | W-E + W-F | Remediation targets documented findings |

---

## L3+: COMMUNICATION PLAN

### Checkpoints

- **Checkpoint 1**: Audit truth grounded.
- **Checkpoint 2**: Retirement cutover shipped.
- **Checkpoint 3**: Research verdict published.
- **Checkpoint 4**: Planner + trim + follow-up APIs merged.
- **Checkpoint 5**: Verification + transcripts validated.
- **Checkpoint 6**: v3.4.1.0 released with aligned docs.
- **Checkpoint 7**: All 9 deep-review findings closed.

### Escalation Path

1. If audit findings conflict with research, prefer audit evidence over summary.
2. If release-note wording conflicts with the remediated state, preserve the remediated state and adjust the release note.
3. If validation rules conflict with the shipped structure, preserve validation compliance and document the exact warning.

### Governance Notes

- The packet is a runtime change with documented operator-facing contract; changelog honesty matters.
- The canonical atomic writer is the single mutation mechanism; fallback preserves atomic semantics.
- The deep-review pass is part of the delivery record; remediation closure is load-bearing.

---

### Governance and Compliance Notes

### Governance Sign-Off Targets

| Sign-Off | Status | Basis |
|----------|--------|-------|
| Runtime correctness | Complete | Planner default non-mutating + fallback atomic parity |
| Documentation alignment | Complete | `/memory:save` docs + env reference + release notes agree |
| Spec-packet compliance | Complete | `validate.sh --strict` pass |
| Metadata completeness | Complete | `description.json`, `graph-metadata.json`, nested changelog |

### Compliance Notes

- No secrets, credentials, or third-party systems involved.
- Packet stores only copied internal project artifacts plus new documentation and runtime changes.
- Canonical atomic writer unchanged outside the scoped router Tier 3 guard.
