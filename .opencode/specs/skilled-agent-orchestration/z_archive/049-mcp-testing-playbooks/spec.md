---
title: "Feature Specification: MCP Testing Playbooks for Four Skills"
description: "Three of the four MCP skills (mcp-chrome-devtools, mcp-clickup, mcp-code-mode) currently ship without any deterministic, operator-facing test surface. This spec authors testing playbooks for those three plus a coverage audit on mcp-coco-index, using the canonical sk-doc playbook contract."
trigger_phrases:
  - "mcp testing playbook"
  - "mcp playbook"
  - "playbook for mcp"
  - "manual_testing_playbook mcp"
  - "049 mcp"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/049-mcp-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Initialized Level-3 spec scaffold with 4-skill matrix and CM-first sequencing"
    next_safe_action: "Author mcp-code-mode playbook (CM, 7 categories, ~26 scenarios)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-bootstrap-2026-04-26"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Filename casing: lowercase manual_testing_playbook.md (matches all 5 in-tree precedents)"
      - "Smoke-run scope: all 4 against real env (CM-001 local, BDG-001 real Chrome, CU-001 live ClickUp, CCC-001 existing index)"
---

# Feature Specification: MCP Testing Playbooks for Four Skills

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Three of the four MCP skills (`mcp-chrome-devtools`, `mcp-clickup`, `mcp-code-mode`) currently ship without any deterministic operator-facing test surface — operators have no shared way to verify install health or to confirm a regression. This spec authors three new manual testing playbooks (BDG ~22 scenarios, CU ~25 scenarios, CM ~26 scenarios) plus a coverage audit of the existing `mcp-coco-index` playbook. All playbooks follow the canonical sk-doc playbook contract: per-skill `manual_testing_playbook/` folder containing a root `manual_testing_playbook.md` plus numbered category folders with one per-feature file per scenario.

**Key Decisions**: CM-first sequencing because it defines the cross-skill vocabulary (`manual.tool` namespace, `call_tool_chain` semantics, env-prefixing) that BDG and CU scenarios reference; flat Level-3 spec packet (no phase folders) because the workflow is uniform across the four skills.

**Critical Dependencies**: `/create:testing-playbook` command (already implemented at `.opencode/command/create/testing-playbook.md`); sk-doc playbook templates at `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`; the existing `mcp-coco-index` playbook as the closest in-tree precedent for an mcp-* skill.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-26 |
| **Branch** | `main` (in-place, alongside ongoing 047/048 work) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three of the four MCP-* skills (`mcp-chrome-devtools`, `mcp-clickup`, `mcp-code-mode`) ship without a manual testing playbook. New operators have no deterministic "is my install healthy?" check; experienced operators have no shared evidence format to confirm regressions across CLI surfaces, MCP tool surfaces, recovery paths, and cross-skill integrations. The fourth, `mcp-coco-index`, already has a current playbook that needs only a coverage audit against the latest skill surface.

### Purpose

Ship a uniform, validator-clean playbook for each of `mcp-chrome-devtools`, `mcp-clickup`, `mcp-code-mode` (≈73 per-feature files total) and confirm `mcp-coco-index` coverage is current. Each playbook lives at `.opencode/skill/<skill>/manual_testing_playbook/` and follows the sk-doc 9-column scenario contract with deterministic prompts, exact command sequences, expected signals per step, and ≥2 failure-triage steps per scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Author `manual_testing_playbook/` package for `mcp-code-mode` (7 categories, ~26 scenarios) — **first**, because CM defines the cross-skill vocabulary
- Author `manual_testing_playbook/` package for `mcp-chrome-devtools` (6 categories, ~22 scenarios)
- Author `manual_testing_playbook/` package for `mcp-clickup` (6 categories, ~25 scenarios)
- Coverage audit of existing `mcp-coco-index/manual_testing_playbook/` — append per-feature files only if confirmed gaps exist; preserve all existing IDs
- Cross-reference resolution: every CM scenario referenced from BDG/CU resolves to an actual CM-NNN entry
- Smoke-run V7: execute one scenario per playbook end-to-end against real environment (CM-001, BDG-001, CU-001, CCC-001)
- Spec 049 governance: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research.md, implementation-summary.md, description.json, graph-metadata.json

### Out of Scope

- Automating playbook execution (the playbook is a manual reference; automation is a separate spec)
- Authoring playbooks for any other skill (cli-*, sk-*, doctor:*) — those are separate specs (047/048 cover cli-*; sk-* skills already have playbooks where needed)
- Refactoring the `mcp-coco-index` playbook root structure — audit-only; no rewrite (ADR-002)
- Updating the standards reference at `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md` to reconcile uppercase/lowercase guidance — deferred to a follow-on cleanup (ADR-001 records the divergence)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | Create | Root playbook (sections 1-6 global, 7-13 per-category, 14-15 indexes) |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/01--core-tools/{001..004}-*.md` | Create | 4 per-feature files |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/02--manual-namespace-contract/{001..003}-*.md` | Create | 3 per-feature files |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/03--env-var-prefixing/{001..003}-*.md` | Create | 3 per-feature files |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/{001..003}-*.md` | Create | 3 per-feature files |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/05--clickup-and-chrome-via-cm/{001..003}-*.md` | Create | 3 per-feature files |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/{001..004}-*.md` | Create | 4 per-feature files |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/07--recovery-and-config/{001..006}-*.md` | Create | 6 per-feature files |
| `.opencode/skill/mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md` | Create | Root playbook |
| `.opencode/skill/mcp-chrome-devtools/manual_testing_playbook/{01..06}--*/{001..NNN}-*.md` | Create | 22 per-feature files across 6 categories |
| `.opencode/skill/mcp-clickup/manual_testing_playbook/manual_testing_playbook.md` | Create | Root playbook |
| `.opencode/skill/mcp-clickup/manual_testing_playbook/{01..06}--*/{001..NNN}-*.md` | Create | 25 per-feature files across 6 categories |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/{01..07}--*/{NNN+1}-*.md` | Create (conditional) | 0-3 appended files only if audit identifies confirmed gaps |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/*` | Create | spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research.md, implementation-summary.md, description.json, graph-metadata.json |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each new playbook has a root `manual_testing_playbook.md` with the 6 global sections (OVERVIEW, GLOBAL PRECONDITIONS, GLOBAL EVIDENCE REQUIREMENTS, DETERMINISTIC COMMAND NOTATION, REVIEW PROTOCOL AND RELEASE READINESS, SUB-AGENT ORCHESTRATION AND WAVE PLANNING) plus per-category summary sections plus AUTOMATED TEST CROSS-REFERENCE plus FEATURE FILE INDEX | `python3 .opencode/skill/sk-doc/scripts/validate_document.py <root>` exits 0 |
| REQ-002 | Each per-feature file has frontmatter `title` + `description`, all 5 H2 sections (OVERVIEW, CURRENT REALITY, TEST EXECUTION, SOURCE FILES, SOURCE METADATA), and a deterministic prompt formatted "As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED}. Return {OUTPUT}." | Visual review + grep checks pass per skill |
| REQ-003 | Every scenario has ≥2 ordered failure-triage steps with specific file paths, command names, or signal references — no vague "check the logs" entries | `grep -A4 "Failure Triage" <files>` audit shows ≥2 enumerated steps per file |
| REQ-004 | Every Feature ID is unique within its skill's playbook (`PREFIX-NNN` format) | Awk dedup check returns 0 duplicates per playbook |
| REQ-005 | All cross-skill references (BDG/CU `→ CM-NNN`) resolve to an existing CM-NNN scenario in the CM playbook | Grep + lookup script returns no broken references |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | mcp-coco-index audit recorded in `research.md` with explicit gap inventory (`[]` if no gaps) | research.md `## CCC Audit` section present with dated audit notes |
| REQ-007 | V7 smoke runs executed for one scenario per playbook against real environment | Evidence captured in `implementation-summary.md` with PASS/FAIL/SKIP verdict per smoke run |
| REQ-008 | Spec 049 strict validate passes | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks --strict` exits 0 |
| REQ-009 | Memory save runs after implementation completes | `description.json` and `graph-metadata.json` refreshed by `generate-context.js`; spec discoverable via `memory_search` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 new playbook roots pass `validate_document.py` (exit 0); per-feature file count equals ID count in each root's FEATURE FILE INDEX
- **SC-002**: 100% of cross-skill references resolve (no broken `CM-NNN` links from BDG/CU)
- **SC-003**: V7 smoke runs return PASS for at least 3 of 4 selected scenarios; any SKIP carries a documented sandbox blocker
- **SC-004**: `mcp-coco-index` audit produces a dated research.md entry naming any confirmed gaps (or explicitly recording "no gaps found")
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc validate_document.py | Validator failure blocks REQ-001 | Run iteratively per root; fix structural issues before moving to next playbook |
| Dependency | ClickUp API token (CU-001 smoke) | Blocks REQ-007 V7 for CU | Mark CU-001 as SKIP with sandbox blocker if no token available; document in implementation-summary.md |
| Dependency | Real Chrome installed (BDG-001 smoke) | Blocks REQ-007 V7 for BDG | Verify `command -v google-chrome chromium-browser chromium` before V7; SKIP if absent |
| Risk | Standards-doc divergence (uppercase vs lowercase root filename) | Future contributors might apply uppercase per the standards reference | ADR-001 in decision-record.md documents the lowercase decision and the rationale |
| Risk | Cross-skill reference rot (CM scenario renumbered after BDG/CU author them) | Broken `CM-NNN` references | Author CM first; freeze IDs before authoring BDG/CU |
| Risk | Per-feature file count drift (root index vs filesystem mismatch) | Validator clean but content gap | Generate FEATURE FILE INDEX programmatically from filesystem after authoring; reconcile before validation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each per-feature file is ≤200 LOC (snippet template scaffold) so root playbook + all linked files are scannable

### Security
- **NFR-S01**: V7 smoke runs MUST NOT expose ClickUp API tokens, browser cookies, or other credentials in committed evidence; redact before saving

### Reliability
- **NFR-R01**: All deterministic command sequences MUST be replayable — no "use the most recent task" fuzzy lookups; require explicit IDs in commands

---

## 8. EDGE CASES

### Data Boundaries
- Empty MCP tool list: Code Mode playbook scenarios that call `list_tools()` must handle empty registry (sandbox/dev environments)
- Stale ClickUp task IDs: CU mutation scenarios must use freshly-created task IDs, not hard-coded IDs that may not exist on operator's workspace

### Error Scenarios
- Standards reference says uppercase root filename; all 5 in-tree precedents use lowercase. Resolution: lowercase per ADR-001
- mcp-coco-index already has 23 scenarios; risk of duplicating effort. Resolution: audit-only per ADR-002, append only if confirmed gaps

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~85, LOC: ~9000 (3 root playbooks ~600 LOC each + 73 per-feature files ~80-150 LOC each), Systems: 4 skills |
| Risk | 12/25 | Auth: Y (ClickUp token for V7), API: Y (live ClickUp/Chrome for V7), Breaking: N (additive only) |
| Research | 14/20 | Investigation needs: per-skill test surface inventory complete (Phase 1); CCC audit pending |
| Multi-Agent | 6/15 | Workstreams: 4 (one per skill), but uniform workflow |
| Coordination | 8/15 | Dependencies: CM → BDG/CU cross-references; spec 049 governance |
| **Total** | **62/100** | **Level 3 (within 50-79 band)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cross-skill `CM-NNN` reference rot if CM authored second-to-last | H | M | CM-first sequencing (D5); freeze IDs before BDG/CU |
| R-002 | Validator passes but per-feature files have placeholder content | M | M | Spot-review every 5th file; explicit "no Lorem Ipsum" rule in checklist.md |
| R-003 | Operator runs V7 smoke against production ClickUp workspace and corrupts data | H | L | Smoke-run instructions specify "test workspace only"; create-then-delete pattern |
| R-004 | Lowercase filename decision conflicts with future standards-doc enforcement | L | M | ADR-001 documents reasoning; standards-doc cleanup tracked as follow-on |

---

## 11. USER STORIES

### US-001: Operator verifies mcp-clickup install (Priority: P0)

**As a** new operator setting up mcp-clickup, **I want** a single playbook scenario I can run end-to-end, **so that** I can confirm `cu --version`, `cu auth`, and `cu spaces` all work before relying on the skill in real workflows.

**Acceptance Criteria**:
1. Given a fresh repo clone, When I run CU-001 step-by-step, Then I see the expected signals at each step or a deterministic failure with triage steps
2. Given my workspace has no spaces yet, When I run CU-005, Then the playbook tells me how to interpret an empty result vs an auth failure

---

### US-002: Operator verifies mcp-code-mode integration after upgrade (Priority: P0)

**As an** operator who just updated `.utcp_config.json`, **I want** a playbook category that walks me through the manual-namespace contract (`manual.tool` form), **so that** I can confirm tool naming hasn't drifted.

**Acceptance Criteria**:
1. Given an updated `.utcp_config.json`, When I run CM-005 → CM-007, Then I confirm correct/incorrect naming behaviors and `list_tools()` enumeration
2. Given a wrong-form call, When I run CM-006, Then I see the expected error and the failure-triage points me to the correct fix

---

### US-003: Operator validates mcp-chrome-devtools dual-instance behavior (Priority: P1)

**As an** operator running parallel browser tests, **I want** scenarios that exercise both `chrome_devtools_1` and `chrome_devtools_2` simultaneously, **so that** I can confirm the parallel-instance contract works in my environment.

**Acceptance Criteria**:
1. Given two configured instances, When I run BDG-015, Then both instances respond independently and screenshots from each match the navigation target
2. Given an instance crash mid-flow, When I run BDG-021, Then I can recover the session per the playbook triage

---

### US-004: Maintainer audits CCC playbook coverage (Priority: P1)

**As a** maintainer of mcp-coco-index, **I want** a recorded audit of the existing playbook against the latest skill surface, **so that** I know whether 23 scenarios still cover the contract or whether new scenarios are needed.

**Acceptance Criteria**:
1. Given the existing CCC playbook, When the audit runs, Then research.md records explicit gap findings with PASS/FAIL per inventory item
2. If gaps found, Then per-feature files are appended at the next free numeric slot in the matching category

---

## 12. OPEN QUESTIONS

(None — all resolved during plan-mode review. See decision-record.md ADR-001..ADR-003.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: See `research.md`
