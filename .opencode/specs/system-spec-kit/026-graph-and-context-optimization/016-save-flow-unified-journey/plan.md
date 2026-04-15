---
title: "Implementation Plan: Save-Flow Unified Journey"
description: "Execution and dependency map for the unified merge packet that consolidates the save-flow audit, research, implementation, and remediation story into one Level 3+ documentation surface."
trigger_phrases:
  - "implementation plan"
  - "save-flow unified journey"
  - "phase dependency graph"
  - "audit research implementation remediation"
  - "merge packet plan"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-save-flow-unified-journey"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Mapped the unified packet architecture and phase flow"
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
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-save-flow-unified-journey-merge"
      parent_session_id: "015-save-flow-planner-first-trim-seed"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A unified packet can preserve the full 013 -> 014 -> 015 -> remediation arc without moving source packets."
      - "Packet 016 adds no new code path. It consolidates history, artifacts, and source-backed delivery evidence."
---
# Implementation Plan: Save-Flow Unified Journey

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language or Stack** | Markdown packet docs plus copied JSON, JSONL, and changelog artifacts |
| **Framework** | system-spec-kit spec-folder workflow |
| **Storage** | Packet-local Markdown, JSON, JSONL, snapshot copies, and graph metadata |
| **Testing** | `validate_document.py`, `validate.sh --strict`, metadata generation scripts, nested changelog generation |
| **Historical Runtime Surface** | TypeScript save-flow handlers, CLI wrapper, routing, validation, indexing, and follow-up APIs described by source packets |

### Overview

Packet 016 is a documentation merge plan, not an implementation plan for new runtime behavior. Its job is to preserve a four-stage story that already happened:

1. Packet 013 audited the half-migrated memory-folder state.
2. Packet 014 researched what the save-flow still needed after retirement.
3. Packet 015 shipped planner-first default behavior.
4. Packet 015 remediation closed the remaining review findings.

The plan is therefore shaped around narrative integrity, artifact preservation, and validation discipline. The only files created in this packet are packet 016 docs, metadata, changelog, and copied snapshots. The only acceptable outcome is a self-contained packet that accurately mirrors the historical sequence while remaining faithful to the source artifacts.

### Full Journey Summary

| Stage | Historical Trigger | Main Output | Why Packet 016 Needs It |
|-------|--------------------|-------------|--------------------------|
| 013 audit | Runtime contradicted retirement claims | 25-finding audit report and path analysis | Establishes the original problem and explains why Phase 013 existed |
| Phase 013 release work | Need to retire the legacy memory-file write path honestly | v3.4.1.0 release notes and aligned docs | Explains the environment packet 014 inherited |
| 014 research | Need to decide what still earns cost after retirement | 20-iteration research synthesis and trim-targeted verdict | Explains why planner-first was the chosen shape |
| 015 implementation | Need to ship planner-first default behavior | 43-task implementation packet, ADR set, transcript evidence | Explains what changed in the runtime contract |
| 015 review and remediation | Need to close deep-review correctness and honesty gaps | 9-finding remediation closure | Explains why the final story differs from the first packet 015 review verdict |
| 016 merge | Need one unified artifact for future readers | Unified docs plus copied evidence | Prevents future packet-hopping and narrative drift |

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Required packet 013, 014, 015, and v3.4.1.0 sources were read before authoring packet 016.
- [x] Snapshot folder structure was defined before any copy operation.
- [x] Level 3+ documentation structure selected because the packet consolidates multi-phase work and 5+ ADRs.
- [x] The source-packet preservation rule was explicit before creating any files.
- [x] The packet scope was limited to packet 016 documentation and snapshot copies.

### Definition of Done

- [ ] Packet 016 contains the six primary docs requested by the user.
- [ ] Packet 016 contains the copied packet 013, 014, and 015 artifact snapshots.
- [ ] Every copied Markdown file begins with the required snapshot note.
- [ ] `description.json`, `graph-metadata.json`, and packet-local nested changelog exist.
- [ ] All primary docs pass `validate_document.py`.
- [ ] Packet 016 passes `validate.sh --strict` with no blocking errors.
- [ ] Packet 016 reports no new runtime work and clearly points back to the source packets as authoritative records.

### Merge-Specific Done Conditions

- [ ] Packet 013 remains represented as the audit phase, not rewritten as release-only history.
- [ ] Packet 014 remains represented as the research phase, not collapsed into implementation rationale only.
- [ ] Packet 015 remains represented as both implementation and remediation, not as a single undifferentiated packet.
- [ ] The unified packet names the final honest contract after remediation.

---

<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation merge packet with copied evidence snapshots and unified narrative surfaces.

### Key Components

- **Unified narrative docs**: `spec.md`, `plan.md`, `decision-record.md`, and `implementation-summary.md` tell the story.
- **Unified evidence docs**: `tasks.md` and `checklist.md` preserve completed work and verification evidence.
- **Audit snapshot**: `research/013-audit-snapshot/` holds the copied audit review artifacts.
- **Research snapshot**: `research/014-research-snapshot/` holds the copied research artifacts.
- **Review snapshot**: `review/015-deep-review-snapshot/` holds the copied deep-review artifacts.
- **Transcript snapshot**: `scratch/transcripts-snapshot/` holds the copied transcript and planner-output artifacts.
- **Metadata and changelog layer**: `description.json`, `graph-metadata.json`, and `changelog/`.

### Architectural Principle

Packet 016 is organized so a future reader can choose one of two modes:

1. **Story-first mode**: read the six primary docs and understand the entire journey.
2. **Evidence-first mode**: jump from a claim in the primary docs into a copied snapshot folder and inspect the underlying artifact.

That dual-mode design is why packet 016 needs both narrative docs and copied artifact trees.

### Data Flow

```text
Packet 013 audit truth
        |
        v
Packet 014 research verdict
        |
        v
Packet 015 implementation packet
        |
        v
Packet 015 deep-review findings
        |
        v
Packet 015 remediation closeout
        |
        v
Packet 016 unified docs + copied snapshots
        |
        v
Future reader / archive / memory tooling
```

### File-Level Change Map

| Component | Files | Purpose | Source Dependency |
|-----------|-------|---------|-------------------|
| Narrative core | `spec.md`, `plan.md` | Explain problem, architecture, dependencies, and phase sequencing | 013 + 014 + 015 + changelog |
| Evidence core | `tasks.md`, `checklist.md` | Preserve completed work and verification evidence | 013 review, 014 research, 015 tasks, 015 checklist, 015 review |
| Decision core | `decision-record.md` | Consolidate research and implementation ADRs into one packet | 014 findings registry, 015 decision record, 015 remediation |
| Delivery core | `implementation-summary.md` | Capture how the work was delivered and remediated | 015 implementation summary, 015 review, v3.4.1.0 |
| Audit snapshot | `research/013-audit-snapshot/**` | Self-contained audit proof | 013 review artifacts |
| Research snapshot | `research/014-research-snapshot/**` | Self-contained subsystem verdict proof | 014 research artifacts |
| Review snapshot | `review/015-deep-review-snapshot/**` | Self-contained review and remediation proof | 015 review artifacts |
| Transcript snapshot | `scratch/transcripts-snapshot/**` | Self-contained transcript evidence | 015 scratch artifacts |
| Metadata layer | `description.json`, `graph-metadata.json`, `changelog/**` | Packet discovery, graph relation, archive trace | Packet 016 content |

### Aggregate Historical Code Surface

| Historical Area | Files | Merge Narrative Use |
|-----------------|-------|---------------------|
| Legacy write path | `directory-setup.ts`, `workflow.ts`, `file-writer.ts`, `memory-indexer.ts`, `memory-metadata.ts` | Explain packet 013 findings and Phase 013 cutover |
| Research core | `memory-save.ts`, `create-record.ts`, `atomic-index-memory.ts`, `thin-continuity-record.ts`, `content-router.ts`, `post-insert.ts`, `reconsolidation-bridge.ts`, `workflow.ts` | Explain packet 014 verdicts |
| Planner contract | `types.ts`, `response-builder.ts`, `validation-responses.ts`, `generate-context.ts`, `/memory:save` docs | Explain packet 015 shipped contract |
| Follow-up actions | `api/indexing.ts`, `graph-metadata-parser.ts` | Explain deferred freshness and enrichment work |
| Remediation surfaces | `content-router.ts`, `memory-save.ts`, `post-insert.ts`, `../../../../skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` | Explain deep-review closure and honesty fixes |

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase Dependencies Diagram

```text
Packet 013 audit
    |
    v
Phase 013 retirement cutover in v3.4.1.0
    |
    v
Packet 014 research
    |
    v
Packet 015 implementation
    |
    v
Packet 015 remediation
    |
    v
Packet 016 unified merge packet
```

### M1 through M10 Unified Milestones

| Milestone | Phase | Description | Evidence Surface |
|-----------|-------|-------------|------------------|
| **M1** | Audit kickoff | Define packet 013 question, classification rules, and dimension plan | `../013-memory-folder-deprecation-audit/spec.md`, `research/013-audit-snapshot/deep-review-strategy.md` |
| **M2** | Audit convergence | Complete packet 013 review iterations and record the half-migrated state | `research/013-audit-snapshot/iterations/`, `research/013-audit-snapshot/review-report.md` |
| **M3** | Retirement closure | Execute the Phase 013 cutover that retires the legacy memory-file write path and aligns docs | `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`, packet 013 release notes |
| **M4** | Research kickoff | Open packet 014 and define the Q1-Q10 save-flow relevance questions | `../014-save-flow-backend-relevance-review/spec.md`, `research/014-research-snapshot/deep-research-strategy.md` |
| **M5** | Research convergence | Classify 15 save-flow subsystems and reach the trim-targeted verdict | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json` |
| **M6** | Planner contract | Build packet 015 planner-first default, fallback flags, and contract wiring | `../015-save-flow-planner-first-trim/tasks.md` T001-T012 |
| **M7** | Routing and quality trim | Trim Tier 3 routing, quality-loop auto-fix, and reconsolidation or enrichment hot-path work | `../015-save-flow-planner-first-trim/tasks.md` T013-T034 |
| **M8** | Verification and transcripts | Run transcript prototypes, targeted tests, and packet validation | `../015-save-flow-planner-first-trim/tasks.md` T035-T043, `scratch/transcripts-snapshot/` |
| **M9** | Release alignment | Capture the shipped contract in `v3.4.1.0` and packet 015 closeout docs | `../015-save-flow-planner-first-trim/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| **M10** | Remediation | Resolve deep-review findings F001-F009 and update docs, tests, and release claims honestly | `review/015-deep-review-snapshot/**`, `../015-save-flow-planner-first-trim/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |

### Phase Descriptions

#### M1 - Audit kickoff

Packet 013 opened as a Level 2 audit packet with a narrow but critical question: did any active file still write, read, or assume `[spec]/memory/*.md` in contradiction to the retirement claim? This milestone matters because packet 016 needs to preserve the audit frame, not just the result.

#### M2 - Audit convergence

The audit converged after 7 iterations and documented the half-migrated state in concrete families: runtime write path, runtime read path, doc contradiction, phantom dedup contract, test drift, and template drift. Packet 016 uses this milestone to explain why retirement was a prerequisite for the later trim.

#### M3 - Retirement closure

Phase 013 in v3.4.1.0 removed the live memory-file write path, cleaned up templates and docs, and aligned the runtime with the original intent. Packet 016 treats this as the bridge between audit and research.

#### M4 - Research kickoff

Packet 014 opened after the retirement cutover and deliberately avoided re-litigating the old artifact path. Instead, it asked whether the remaining save-flow backend was still proportionate to the reduced contract.

#### M5 - Research convergence

The 20-iteration research loop answered Q1 through Q10 and classified 15 subsystems. This milestone is the intellectual bridge from the audit world to the implementation world.

#### M6 - Planner contract

Packet 015 first built the planner contract, CLI defaults, docs, and type surfaces. This is where the implementation moved from research recommendation to operator-facing contract.

#### M7 - Routing and quality trim

Packet 015 then removed default-path Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, and post-insert enrichment from the hot path while preserving the core writer and routing contract.

#### M8 - Verification and transcripts

Packet 015 validated the new model with focused tests and transcript prototypes, giving packet 016 a narrative bridge between implementation intent and lived operator flows.

#### M9 - Release alignment

Packet 015 and v3.4.1.0 documented the shipped contract, including the explicit follow-up APIs and the reserved state of `hybrid`.

#### M10 - Remediation

Deep review then forced the packet to close honesty and equivalence gaps. This milestone matters because packet 016 must describe the final truthful state, not just the initial ship state.

---

<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Historical Source |
|-----------|-------|-------|-------------------|
| Audit validation | Verify that packet 013 identified real runtime and doc contradictions | Deep-review iterations and synthesis report | `research/013-audit-snapshot/**` |
| Research convergence | Verify that packet 014 answered Q1-Q10 and stabilized subsystem verdicts | Deep-research iterations and findings registry | `research/014-research-snapshot/**` |
| Runtime contract tests | Verify planner-first default, fallback parity, router behavior, quality behavior, and follow-up APIs | Vitest suites and targeted sweeps | `../015-save-flow-planner-first-trim/tasks.md`, `../015-save-flow-planner-first-trim/checklist.md`, `../015-save-flow-planner-first-trim/implementation-summary.md` |
| Transcript validation | Verify planner-first behavior against real session examples | Transcript markdown, planner-output JSON, transcript reviews | `scratch/transcripts-snapshot/` |
| Review convergence | Verify that packet 015 deep review isolated the real defect set | Review report, findings registry, and iteration ledger | `review/015-deep-review-snapshot/**` |
| Remediation confirmation | Verify that all 9 packet 015 review findings were resolved | Remediated docs, tests, changelog, and implementation summary | `../015-save-flow-planner-first-trim/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| Merge-packet validation | Verify that packet 016 docs are structurally sound | `validate_document.py`, `validate.sh --strict` | packet 016 |

### Packet 013 Testing and Review Approach

- Focused deep-review loop over runtime, docs, tests, and templates.
- Classification rule applied each iteration.
- Convergence threshold tracked and documented.
- Outcome was a historical truth surface, not a runtime patch inside the audit packet itself.

### Packet 014 Research Approach

- 20 iterations with explicit subsystem questions.
- Research document and findings registry used as the canonical synthesis.
- Minimal replacement design evaluated against live code surfaces.
- Final report explicitly ruled out a full writer redesign.

### Packet 015 Implementation Approach

- Planner-first contract built before trim work.
- Routing, quality, reconsolidation, enrichment, and follow-up APIs covered by targeted tests.
- Transcript prototypes used to validate real operator narratives.
- Packet-local doc validation and strict packet validation used as release gates.

### Packet 015 Remediation Approach

- Deep review split concerns into runtime correctness, follow-up API integrity, coverage, and documentation honesty.
- Remediation closed all 9 findings and aligned packet docs and release notes.
- Packet 016 uses the remediated state as the final truth.

### Packet 016 Validation Approach

- Validate the six primary docs individually.
- Run strict packet validation after metadata generation and changelog generation.
- Confirm copied artifact tree exists and that copied Markdown files include the required snapshot note.

---

<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 013 review artifacts | Documentation source | Ready | The original contradiction and audit truth cannot be preserved accurately |
| Packet 014 research artifacts | Documentation source | Ready | The trim-targeted verdict and Q1-Q10 answers would be underspecified |
| Packet 015 primary docs | Documentation source | Ready | The implementation and verification surfaces would be incomplete |
| Packet 015 review artifacts | Documentation source | Ready | Remediation closure would be missing |
| v3.4.1.0 changelog | Historical release surface | Ready | Release-state truth and known limitations would drift |
| `validate_document.py` | Tooling | Pending run | Docs could ship with avoidable structure defects |
| `validate.sh --strict` | Tooling | Pending run | Packet could ship with spec-folder blocking issues |
| `generate-description.js` | Tooling | Pending run | Packet metadata would be incomplete |
| Nested changelog generator | Tooling | Pending run | Packet-local change trace would be missing |

### Source Evidence Dependency Map

| Unified Section | Depends Most On |
|-----------------|-----------------|
| Problem statement | Packet 013 review report |
| Research requirements | Packet 014 research report and findings registry |
| Implementation sections | Packet 015 spec, plan, tasks, and implementation summary |
| Remediation sections | Packet 015 review report, findings registry, and changelog |
| Known limitations | Packet 015 implementation summary and v3.4.1.0 |

---

<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet 016 misstates source packet truth, validation fails, or copied artifacts are incomplete.
- **Procedure**: Fix packet 016 docs or copied snapshot tree only. Do not edit source packets.
- **Data reversal**: None outside packet 016. This packet is additive.

### Per-Phase Rollback

| Milestone | Trigger | Rollback Action | Data Reversal |
|-----------|---------|-----------------|---------------|
| M1 or M2 narrative capture | Audit language drifts from packet 013 | Correct packet 016 only | None |
| M3 historical bridge | v3.4.1.0 retirement story is misstated | Correct packet 016 only | None |
| M4 or M5 research capture | Subsystem verdict classes are wrong or incomplete | Correct packet 016 only | None |
| M6 through M9 implementation capture | Planner-first or fallback story drifts from packet 015 | Correct packet 016 only | None |
| M10 remediation capture | 9-finding closure story is inaccurate | Correct packet 016 only | None |
| Metadata generation | `description.json` or `graph-metadata.json` wrong | Regenerate or patch packet 016 metadata | None |
| Changelog generation | Packet-local changelog missing or stale | Re-run generator | None |

### Consolidated Rollback Note

Because packet 016 is a merge packet, rollback means removing or correcting packet 016 only. The source packets remain untouched and remain the authoritative recovery surface if packet 016 ever needs replacement.

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
| M10 | M9 | Packet 016 merge truth |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source grounding | High | 1.5 to 2.5 hours |
| Snapshot copy and packet shell | Medium | 15 to 30 minutes |
| Unified primary docs | High | 2.5 to 4 hours |
| Metadata and changelog generation | Medium | 15 to 30 minutes |
| Validation and warning resolution | Medium | 30 to 60 minutes |
| **Total** | **High** | **5 to 8 hours equivalent synthesis effort** |

### Historical Effort Context

| Historical Packet | Delivery Effort Shape | Why It Matters To 016 |
|-------------------|-----------------------|------------------------|
| 013 | Multi-iteration audit and release alignment | Explains the depth of the original contradiction |
| 014 | 20-iteration research loop | Explains why the verdict is trustworthy |
| 015 | 43 tasks, multiple task batches, transcript review, deep review, remediation | Explains why the final contract cannot be summarized as a small one-line change |

---

## L2: ENHANCED ROLLBACK

### Pre-merge Checks

- [ ] Snapshot tree complete
- [ ] Primary docs authored
- [ ] Metadata generated
- [ ] Validation complete
- [ ] Source packets untouched

### Rollback Procedure

1. If copied artifacts are wrong, delete and re-copy packet 016 snapshot folders only.
2. If primary docs are inaccurate, patch packet 016 docs only.
3. If metadata or changelog are wrong, regenerate packet 016 artifacts only.
4. If packet 016 must be abandoned, remove packet 016 and keep the source packets as the recovery surface.

### Data Reversal

- **Has data migration?** No
- **Reversal procedure**: Remove or patch packet 016 only

---

## L3: DEPENDENCY GRAPH

```text
┌──────────────┐
│ Packet 013   │
│ Audit truth  │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Packet 014   │
│ Research     │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Packet 015   │
│ Implement    │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Packet 015   │
│ Remediate    │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Packet 016   │
│ Merge        │
└──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Audit snapshot | Packet 013 review files | Historical contradiction evidence | Unified problem statement |
| Research snapshot | Packet 014 research files | Subsystem verdict evidence | Unified decision and requirements |
| Implementation summary | Packet 015 docs | Shipped planner-first contract | Unified delivery story |
| Review snapshot | Packet 015 review files | Remediation evidence | Honest final truth |
| Transcript snapshot | Packet 015 scratch files | Operator-flow proof | Unified verification story |
| Metadata and changelog | Packet 016 primary docs | Discoverability and archive trace | Final packet completion |

---

## L3: CRITICAL PATH

1. **Read and synthesize the source packets** - Critical because every unified claim depends on grounded source evidence.
2. **Create snapshot trees before writing unified docs** - Critical because the docs need to describe the packet structure that actually exists.
3. **Write primary docs in unified form** - Critical because packet 016 has no value without its narrative surfaces.
4. **Generate metadata and changelog** - Critical because packet 016 must behave like a normal spec packet.
5. **Run validation and fix blockers** - Critical because the packet cannot be delivered as complete otherwise.

**Total Critical Path**: Source grounding -> snapshot copy -> primary docs -> metadata -> validation

**Parallel Opportunities**

- Snapshot copying and initial primary-doc drafting can overlap after the source packet content is understood.
- Per-file doc validation can run in parallel once the primary docs exist.
- Metadata generation and changelog generation can run alongside doc validation.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Capture audit truth | Packet 013 contradiction and finding families preserved | Packet 016 spec and plan draft |
| M2 | Capture research verdict | Q1-Q10 and subsystem verdicts preserved | Packet 016 spec and decision draft |
| M3 | Capture implementation truth | Planner-first contract, fallback, and follow-up actions preserved | Packet 016 tasks and implementation draft |
| M4 | Capture remediation truth | F001-F009 closures preserved | Packet 016 checklist and decision draft |
| M5 | Snapshot tree complete | All requested artifacts copied with snapshot notes | Packet 016 packet shell |
| M6 | Metadata and changelog complete | `description.json`, `graph-metadata.json`, and nested changelog exist | Packet 016 final artifact pass |
| M7 | Validation complete | No blocking validator failures | Final delivery state |

---

### Architecture Decision Record Summary

| Unified ADR | Source | Summary |
|-------------|--------|---------|
| ADR-001 | Packet 014 | Trim-targeted verdict: keep the core writer, trim the oversized default-path stack |
| ADR-002 | Packet 015 | Planner-first output becomes the default `/memory:save` contract |
| ADR-003 | Packet 015 | Reconsolidation remains explicit opt-in |
| ADR-004 | Packet 015 | Post-insert enrichment becomes deferred or standalone |
| ADR-005 | Packet 015 | Router categories stay while Tier 2 or Tier 3 scope narrows |
| ADR-006 | Packet 015 | Hard checks remain while quality-loop auto-fix leaves the default path |
| ADR-007 | Packet 015 remediation | Router preservation claim becomes "core preserved with one scoped exception" |
| ADR-008 | Packet 016 | Merge packet exists to unify the narrative while preserving source packet authority |

---

## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist

- [x] Confirm packet 016 remains documentation-only
- [x] Confirm source packets stay unchanged
- [x] Confirm copied snapshots remain packet-local copies

### Task Execution Rules

| Rule | Description |
|------|-------------|
| EXEC-SEQ | Author unified docs after source grounding and snapshot copy |
| EXEC-EVIDENCE | Point every completed carry-over item to source or snapshot evidence |
| EXEC-SCOPE | Do not change runtime code or source packet content from packet 016 |

### Status Reporting Format

Report historical carry-over as `P###-ID [x] - source-backed completion`.

### Blocked Task Protocol

If packet 016 hits a validation blocker, patch only packet 016 docs or metadata, then rerun validation. Do not repair the source packets from inside this merge packet.

### Tier 1: Source Grounding

**Files**
- Packet 013 spec and review artifacts
- Packet 014 spec and research artifacts
- Packet 015 packet docs, review artifacts, scratch artifacts
- v3.4.1.0 changelog

**Goal**
- Replace assumptions with source-backed narrative inputs.

### Tier 2: Packet Construction

| Workstream | Output | Notes |
|------------|--------|-------|
| Snapshot workstream | copied artifact tree | Must preserve source authority and add snapshot headers |
| Narrative workstream | `spec.md`, `plan.md`, `implementation-summary.md` | Must tell the full story |
| Evidence workstream | `tasks.md`, `checklist.md` | Must cite source evidence and claim no new runtime work |
| Decision workstream | `decision-record.md` | Must preserve ADR lineage |

### Tier 3: Validation and Metadata

**Goal**
- Make packet 016 behave like a normal packet after authoring.

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
| W-A | Snapshot preservation | Copy source artifacts | `research/**`, `review/**`, `scratch/**` |
| W-B | Narrative synthesis | Write unified story | `spec.md`, `plan.md`, `implementation-summary.md` |
| W-C | Evidence synthesis | Preserve completed work and verification | `tasks.md`, `checklist.md` |
| W-D | Decision synthesis | Consolidate ADR set | `decision-record.md` |
| W-E | Tooling closeout | Metadata and changelog | `description.json`, `graph-metadata.json`, `changelog/**` |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Snapshot tree exists | W-A + W-B | Narrative can reference actual copied structure |
| SYNC-002 | Primary docs drafted | W-B + W-C + W-D | Cross-doc terminology alignment |
| SYNC-003 | Docs complete | W-E + validation | Final packet readiness |

### File Ownership Rules

- Snapshot folders are populated by copy only.
- Primary docs are authored for packet 016 only.
- Metadata files belong to packet 016.
- No file inside packets 013, 014, or 015 is modified by this plan.

---

## L3+: COMMUNICATION PLAN

### Checkpoints

- **Checkpoint 1**: Source packets read and summarized.
- **Checkpoint 2**: Snapshot packet shell created.
- **Checkpoint 3**: Primary docs authored.
- **Checkpoint 4**: Metadata and changelog generated.
- **Checkpoint 5**: Validation complete and warnings documented.

### Escalation Path

1. If source packet evidence conflicts, prefer the source packet artifact over memory or summary.
2. If release-note wording conflicts with the remediated packet state, preserve the remediated packet state and explain the changelog adjustment.
3. If validation rules conflict with the user-requested structure, preserve validation compliance and document the exact warning.

### Governance Notes

- Packet 016 is a merge packet and therefore must stay additive.
- Source packet authority is part of the governance model.
- Changelog honesty matters because packet 015 remediation explicitly fixed release-note drift.

---

### Governance and Compliance Notes

### Governance Sign-Off Targets

| Sign-Off | Status | Basis |
|----------|--------|-------|
| Source-packet preservation | Pending final verification | Source folders unchanged |
| Documentation quality | Pending validation run | `validate_document.py` |
| Spec-packet compliance | Pending validation run | `validate.sh --strict` |
| Metadata completeness | Pending generation | `description.json`, `graph-metadata.json`, nested changelog |

### Compliance Notes

- No secrets, credentials, or third-party systems are involved.
- Packet 016 stores only copied internal project artifacts plus new documentation.
- Source packet integrity is a hard compliance rule for this merge packet.
