---
title: "Implementation Plan: MCP Testing Playbooks for Four Skills"
description: "Authors three new MCP-skill playbooks (CM, BDG, CU) plus a coverage audit on CCC. CM-first sequencing because CM defines the cross-skill vocabulary referenced by BDG and CU."
trigger_phrases:
  - "049 plan"
  - "mcp playbook plan"
  - "playbook implementation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/049-mcp-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored Level-3 plan with 3 phases and CM→BDG→CU→CCC sequence"
    next_safe_action: "Author tasks.md task breakdown"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-bootstrap-2026-04-26"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Implementation Plan: MCP Testing Playbooks for Four Skills

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON metadata |
| **Framework** | sk-doc playbook templates (root + per-feature snippet) |
| **Storage** | Filesystem at `.opencode/skill/<skill>/manual_testing_playbook/` |
| **Testing** | `validate_document.py` (sk-doc) + `validate.sh --strict` (system-spec-kit) |

### Overview

Author three manual testing playbooks (mcp-code-mode, mcp-chrome-devtools, mcp-clickup) using the canonical sk-doc playbook contract. Drive scaffolding via `/create:testing-playbook <skill> create :auto` per skill, then hand-fill per-feature scenario content using the test-data inventory captured in `research.md`. CM is authored first because its scenarios define the manual-namespace contract, env-prefixing, and `call_tool_chain` semantics that BDG and CU per-feature files reference.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-§3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (spec.md §6)
- [x] Phase 1 test-data inventory complete (`research.md`)
- [x] Open questions resolved (ADR-001 filename casing; ADR-002 CCC audit-only; ADR-003 flat Level-3)

### Definition of Done
- [ ] All P0 acceptance criteria met (spec.md §4)
- [ ] `validate_document.py` exits 0 for CM, BDG, CU root playbooks
- [ ] V7 smoke runs executed for one scenario per playbook with evidence
- [ ] CCC audit recorded in research.md
- [ ] Spec docs updated (tasks.md `[x]` with evidence; implementation-summary.md filled)
- [ ] Memory save run via `generate-context.js`

---

## 3. ARCHITECTURE

### Pattern

Documentation-as-code using the sk-doc playbook contract:

- One canonical root playbook per skill at `manual_testing_playbook/manual_testing_playbook.md`
- Per-feature files at `manual_testing_playbook/NN--category-name/NNN-feature-name.md`
- All scenario IDs in `PREFIX-NNN` format, unique within the playbook

### Key Components

- **Root playbook**: 10 H2 sections — OVERVIEW (1), GLOBAL PRECONDITIONS (2), GLOBAL EVIDENCE REQUIREMENTS (3), DETERMINISTIC COMMAND NOTATION (4), REVIEW PROTOCOL AND RELEASE READINESS (5), SUB-AGENT ORCHESTRATION AND WAVE PLANNING (6), per-category summary sections (7..N), AUTOMATED TEST CROSS-REFERENCE (N+1), FEATURE FILE INDEX (N+2)
- **Per-feature file**: 5 H2 sections — OVERVIEW (1), CURRENT REALITY (2), TEST EXECUTION (3 with H3 subsections Prompt/Commands/Expected/Evidence/Pass-Fail/Failure Triage), SOURCE FILES (4), SOURCE METADATA (5)
- **9-column scenario table**: Feature ID, Feature Name, Scenario, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage

### Data Flow

```
operator runs scenario
    │
    ▼
reads root playbook → finds Feature ID in FEATURE FILE INDEX
    │
    ▼
opens per-feature file → reads Prompt + Commands + Expected
    │
    ▼
executes commands → captures Evidence
    │
    ▼
grades against Pass/Fail criteria → records verdict
    │
    ├─ PASS → moves to next scenario
    └─ FAIL → walks Failure Triage steps
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold (spec 049 governance)
- [x] Spec scaffold created (spec.md, plan.md drafted)
- [ ] tasks.md, checklist.md, decision-record.md, research.md authored
- [ ] description.json + graph-metadata.json generated
- [ ] Spec strict-validate passes

### Phase 2: Author CM playbook (foundational vocabulary)
- [ ] Create folder structure: 7 categories under `mcp-code-mode/manual_testing_playbook/`
- [ ] Write root `manual_testing_playbook.md` (sections 1-6 global; 7-13 per-category)
- [ ] Write 26 per-feature files
- [ ] Run `validate_document.py` until clean
- [ ] Freeze CM IDs (CM-001..CM-026) before Phase 3-4

### Phase 3: Author BDG playbook
- [ ] Create folder structure: 6 categories under `mcp-chrome-devtools/manual_testing_playbook/`
- [ ] Write root + 22 per-feature files (cross-reference CM-005..CM-007 in MCP scenarios)
- [ ] Validate

### Phase 4: Author CU playbook
- [ ] Create folder structure: 6 categories under `mcp-clickup/manual_testing_playbook/`
- [ ] Write root + 25 per-feature files (cross-reference CM bulk + chain scenarios)
- [ ] Validate

### Phase 5: CCC audit (audit-only)
- [ ] Read existing CCC root + per-feature files
- [ ] Diff against Phase-1 inventory in research.md
- [ ] Record findings; append per-feature files only if confirmed gaps
- [ ] Preserve all 23 existing IDs

### Phase 6: Verification
- [ ] All 4 cross-reference resolutions verified
- [ ] V7 smoke runs (CM-001 local, BDG-001 real Chrome, CU-001 live ClickUp, CCC-001 existing index)
- [ ] Spec strict-validate passes
- [ ] implementation-summary.md filled with evidence
- [ ] Memory save via generate-context.js

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | Each root playbook structure | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| Strict spec validate | Spec 049 metadata + structure | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Per-feature contract | Frontmatter + 5 H2 sections + ≥2 triage steps | Manual review + grep checks |
| Cross-reference | `CM-NNN` references from BDG/CU resolve | Grep + lookup |
| V7 smoke | One scenario per playbook end-to-end | Real environment (CM local, BDG Chrome, CU live ClickUp, CCC index) |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc playbook templates | Internal | Green | Cannot scaffold; would block REQ-001 |
| `/create:testing-playbook` command | Internal | Green | Slows scaffolding (could hand-author from templates) |
| ClickUp API token | External | Yellow (per operator) | V7 CU-001 marked SKIP if absent |
| Chrome / Chromium binary | External | Yellow (per operator) | V7 BDG-001 marked SKIP if absent |
| `validate_document.py` | Internal | Green | Cannot mark V1 PASS |
| `generate-context.js` | Internal | Green | Cannot complete Phase 6 memory save |

---

## 7. ROLLBACK PLAN

- **Trigger**: A playbook root validator fails repeatedly OR cross-reference resolution shows >5% broken links OR V7 smoke runs all FAIL
- **Procedure**: Move authored playbook contents to `scratch/` inside spec 049, leave `.opencode/skill/<skill>/manual_testing_playbook/` empty, document rollback in implementation-summary.md, escalate to user before re-attempting

---

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Scaffold) ──► Phase 2 (CM) ──► Phase 3 (BDG) ──► Phase 5 (CCC audit)
                              │              │                     │
                              └──────────────┴──► Phase 4 (CU) ────┴──► Phase 6 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Scaffold | None | All |
| 2 CM | 1 | 3, 4 (cross-refs) |
| 3 BDG | 2 (for CM-NNN refs) | 6 |
| 4 CU | 2 (for CM-NNN refs) | 6 |
| 5 CCC audit | 1 | 6 |
| 6 Verify | 2, 3, 4, 5 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Scaffold | Low | 30-45 min |
| 2 CM | High | 2-3 hours (~26 per-feature files) |
| 3 BDG | Med-High | 1.5-2.5 hours (~22 per-feature files) |
| 4 CU | High | 2-3 hours (~25 per-feature files) |
| 5 CCC audit | Low | 30-60 min (audit only) |
| 6 Verify | Med | 1-1.5 hours (validator + smoke + memory save) |
| **Total** | | **8-12 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations (markdown only)
- [ ] Existing CCC playbook unchanged (verify byte-equality after Phase 5)
- [ ] No git push until V7 smoke runs complete

### Rollback Procedure
1. Move authored playbook directory to `specs/.../049-mcp-testing-playbooks/scratch/<skill>-rollback-YYYYMMDD/`
2. Verify skill folder back to pre-049 state via `git status`
3. Note rollback in implementation-summary.md with rationale
4. Escalate to user before re-attempting

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — markdown files only; git revert sufficient

---

---

## L3: DEPENDENCY GRAPH

```
┌─────────────┐
│  Phase 1    │  scaffold spec 049
│  Scaffold   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Phase 2    │  CM playbook (foundational)
│  CM         │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│  Phase 3    │  │  Phase 4    │  parallel-safe after CM frozen
│  BDG        │  │  CU         │
└──────┬──────┘  └──────┬──────┘
       │                │
       │     ┌──────────┘
       │     │
       │     │   ┌─────────────┐
       │     │   │  Phase 5    │  CCC audit (parallel with 3-4)
       │     │   │  CCC audit  │
       │     │   └──────┬──────┘
       │     │          │
       └─────┴──────────┘
                  │
                  ▼
           ┌─────────────┐
           │  Phase 6    │  validate + smoke + memory save
           │  Verify     │
           └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 | None | spec 049 scaffold | 2, 3, 4, 5 |
| Phase 2 | 1 | CM root + 26 per-feature files | 3, 4 (cross-refs) |
| Phase 3 | 2 | BDG root + 22 per-feature files | 6 |
| Phase 4 | 2 | CU root + 25 per-feature files | 6 |
| Phase 5 | 1 | research.md CCC audit section | 6 |
| Phase 6 | 2, 3, 4, 5 | implementation-summary, memory save | None |

---

## L3: CRITICAL PATH

1. **Phase 1 Scaffold** - 30-45 min - CRITICAL
2. **Phase 2 CM** - 2-3 hours - CRITICAL (blocks BDG/CU)
3. **Phase 3 BDG OR Phase 4 CU** - 2-3 hours each - CRITICAL (one is on path; other is parallel)
4. **Phase 6 Verify** - 1-1.5 hours - CRITICAL

**Total Critical Path**: ~6-7.5 hours (CM + larger of BDG/CU + verify; phase 5 CCC audit and the smaller of BDG/CU run in parallel)

**Parallel Opportunities**:
- Phases 3 (BDG) and 4 (CU) parallel after Phase 2 CM frozen
- Phase 5 (CCC audit) parallel with phases 3-4 (no dependency)

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Spec 049 scaffold complete | All 9 spec files present + strict validate exits 0 | End of Phase 1 |
| M2 | CM playbook validator-clean | `validate_document.py` exits 0; CM-001..CM-026 IDs frozen | End of Phase 2 |
| M3 | All 3 new playbooks shipped | All 3 root validators exit 0; cross-refs resolve | End of Phase 4 |
| M4 | Release ready | V7 smoke runs done; spec strict validate clean; memory saved | End of Phase 6 |

---

## L3: ARCHITECTURE DECISION RECORD

(See `decision-record.md` for full ADRs. Summary:)

- **ADR-001**: Root filename lowercase `manual_testing_playbook.md` (matches all 5 in-tree precedents; diverges from standards-doc reference)
- **ADR-002**: CCC playbook audit-only — no rewrite; preserve existing 23 IDs
- **ADR-003**: Spec 049 flat Level-3 (no phase folders)
- **ADR-004**: CM-first authoring sequence (CM defines cross-skill vocabulary)
- **ADR-005**: V7 smoke runs against real environments (per user Q2 answer)
