---
title: "Feature Specification: CLI Testing Playbooks"
description: "Five CLI orchestrator skills (cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode) ship without manual testing playbooks, leaving operators no shipped contract for end-to-end validation of model selection, agent routing, sandbox/permission modes, output formats, and integration patterns."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
trigger_phrases:
  - "cli testing playbook"
  - "cli playbook"
  - "manual testing playbook"
  - "048-cli-testing-playbooks"
  - "cli playbook validation"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/048-cli-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Initialized Level 3 spec scaffolding for 5 CLI playbooks"
    next_safe_action: "Dispatch /create:testing-playbook via @write per CLI"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/decision-record.md"
      - ".opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md"
      - ".opencode/command/create/testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000048"
      session_id: "048-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Final per-CLI feature counts may shift during @write dispatch"
    answered_questions:
      - "Level 3 vs Level 2 — chose Level 3 to match sibling 043/046/047 precedent"
      - "Source strategy — manual scenario list (no feature_catalog/ exists for any CLI)"
---

# Feature Specification: CLI Testing Playbooks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Five CLI orchestrator skills ship without operator-facing manual testing playbooks while sibling skills (`system-spec-kit`, `mcp-coco-index`) have full packages. This spec creates one `manual_testing_playbook/` per CLI skill — all five conforming to the shipped `sk-doc` contract (root + per-feature scaffold, 9-column scenario tables, integrated review/orchestration guidance) and dispatched through the canonical `/create:testing-playbook` command via the `@write` agent.

**Key Decisions**: Level 3 spec (matches 043/046/047 sibling precedent); shared category schema across all five playbooks (ADR-001); dispatch via `/create:testing-playbook` rather than hand-craft (ADR-005).

**Critical Dependencies**: `@write` agent must be available; canonical command `/create:testing-playbook` must remain functional; templates at `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` must be unchanged through delivery.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Five CLI orchestrator skills (`cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-opencode`) lack manual testing playbooks. Operators have no shipped contract for validating model selection, agent routing, sandbox/permission modes, output formats, integration patterns, or prompt-template correctness. Sibling skills already follow the `manual_testing_playbook/` pattern; the CLI cluster is the gap.

### Purpose

Each CLI skill ships a complete `manual_testing_playbook/` package matching the canonical `sk-doc` contract, so any operator (human or AI) can validate the orchestrator behavior end-to-end with deterministic prompts, exact command sequences, and binary pass/fail criteria.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One `manual_testing_playbook/` per CLI skill at `<skill>/manual_testing_playbook/`
- Root MANUAL_TESTING_PLAYBOOK markdown file per playbook with the canonical base scaffold (overview, preconditions, evidence, notation, review, orchestration, automated test cross-reference, feature file index, cross-CLI invariant). The base scaffold is 10 numbered H2 sections plus one additional H2 per category, so a CLI with N categories has 10+N numbered H2 sections.
- Numbered category folders (`NN--category-name/`) following the shared taxonomy in plan.md
- Per-feature files (~103-118 across all 5 playbooks) with the 5-section scaffold and 9-column scenario table
- Cross-CLI taxonomy alignment (categories `01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates` invariant across all five — see ADR-001)
- Per-CLI feature ID prefixes (`CC-`, `CX-`, `CP-`, `CG-`, `CO-` — see ADR-002)
- Validation pipeline: `validate_document.py` + link integrity + feature-ID count + forbidden-sidecar scan per playbook

### Out of Scope

- Modifying the CLI skill SKILL.md / references / assets themselves — playbooks reference current behavior, not new behavior
- Creating `feature_catalog/` packages for the CLIs — would shift work to `/create:feature-catalog` (separate command) and lengthen this spec
- Automating playbook execution — the playbooks are operator-facing manual matrices; automation is a follow-up
- Modifying the canonical templates at `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`
- Playbooks for MCP skills — owned by sibling spec `049-mcp-testing-playbooks`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/cli-claude-code/manual_testing_playbook/` | Create | Root playbook + 7 category folders + ~18-20 per-feature files |
| `.opencode/skill/cli-codex/manual_testing_playbook/` | Create | Root playbook + 8 category folders + ~22-25 per-feature files |
| `.opencode/skill/cli-copilot/manual_testing_playbook/` | Create | Root playbook + 8 category folders + ~20-23 per-feature files |
| `.opencode/skill/cli-gemini/manual_testing_playbook/` | Create | Root playbook + 6 category folders + ~15-18 per-feature files |
| `.opencode/skill/cli-opencode/manual_testing_playbook/` | Create | Root playbook + 9 category folders + ~28-32 per-feature files |
| `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/*` | Create | Level 3 spec docs (this folder) |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each CLI skill has a `manual_testing_playbook/` rooted at the skill folder | `ls <skill>/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` returns the file for all 5 |
| REQ-002 | Root playbook structure matches the shipped `sk-doc` contract | `validate_document.py` exits 0 on all 5 root files |
| REQ-003 | Per-feature files use the 5-section scaffold and 9-column table | Manual spot-check of 2 per-feature files per CLI confirms scaffold + table |
| REQ-004 | Feature ID count in root cross-reference index equals per-feature file count | `grep` count matches `find` count for all 5 playbooks |
| REQ-005 | No forbidden sidecar files (review-protocol or subagent-utilization-ledger sidecar files, no snippets subtree) | `find` returns empty for forbidden patterns across all 5 playbooks |
| REQ-006 | Per-feature file links in root playbook resolve to existing files | Every `(NN--*/NNN-*.md)` link in each root playbook points to an existing file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Shared cross-CLI category taxonomy honoured (`01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates` invariant) | Manual review confirms category names + numeric position in all 5 root playbooks |
| REQ-011 | Per-CLI ID prefixes used as defined in ADR-002 (`CC-`, `CX-`, `CP-`, `CG-`, `CO-`) | Frontmatter + cross-reference index in each playbook uses the matching prefix |
| REQ-012 | Scenario prompts are realistic orchestrator-led prompts, not bare command paraphrases | Manual review of 5 scenarios per CLI confirms Role → Context → Action → Format pattern |
| REQ-013 | `implementation-summary.md` filled with paths, counts, validator results post-implementation | File contains non-placeholder content with concrete numbers |
| REQ-014 | `description.json` + `graph-metadata.json` present and current for the spec folder | `generate-context.js` invoked at end; both files exist and reference the spec |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 CLI playbooks pass `validate_document.py` with exit 0
- **SC-002**: ~103-118 per-feature files exist across the 5 playbooks, each linked from its root playbook
- **SC-003**: Cross-CLI taxonomy invariants (categories 01, 06, 07) hold in all 5 root playbooks
- **SC-004**: Spec folder validation passes for the canonical contract (file set + content + ADR coverage). Strict-mode anchor blocks and template-source-hint enforcement are documented as a known limitation in implementation-summary.md when residual validator-strict-mode artifacts remain.
- **SC-005**: Memory save (`generate-context.js`) refreshes `description.json` + `graph-metadata.json` and indexes the spec
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `@write` agent availability | Cannot dispatch `/create:testing-playbook` if missing | Verify @write agent before each Wave dispatch; fall back to hand-crafting to the same contract if unavailable |
| Dependency | `validate_document.py` script | Cannot run H4 validation | Confirmed present at `.opencode/skill/sk-doc/scripts/validate_document.py` |
| Risk | Per-feature file count balloons past ~120 | Scope creep, longer review window | Cap each CLI at the upper bound table in plan.md; defer edge cases to follow-up update |
| Risk | Taxonomy drift between Wave 1 and Wave 2 | Inconsistent playbooks make cross-CLI navigation painful | ADR-001 frozen before Wave 1 dispatch; @write briefs include exact category list |
| Risk | Validator misses per-feature file issues (documented limitation) | Per-feature files ship with structural defects | Manual spot-check 2 per-feature files per CLI after each Wave |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: Every per-feature file passes manual review against the 5-section scaffold + 9-column table
- **NFR-Q02**: Every scenario row has Exact Prompt + Exact Command Sequence + Pass/Fail Criteria + 2+ Failure Triage steps

### Consistency

- **NFR-C01**: Cross-CLI taxonomy invariants hold (categories 01/06/07 numbered identically across all 5 playbooks)
- **NFR-C02**: Per-CLI ID prefixes never collide across the 5 playbooks

### Maintainability

- **NFR-M01**: Playbooks generated through canonical command path so future template changes propagate via `/create:testing-playbook update`
- **NFR-M02**: Spec folder contains decision-record.md so future contributors understand category and prefix choices

---

## 8. EDGE CASES

### Source Material Boundaries

- CLI skill has no `feature_catalog/` (true for all 5): use Manual Scenario List source strategy, derive scenarios from SKILL.md + references/*
- CLI skill has fewer than 6 distinct features: collapse low-density categories rather than padding with synthetic scenarios

### Error Scenarios

- `/create:testing-playbook` Phase 0 hard-blocks (no @write context): re-dispatch through `Agent(subagent_type="write", ...)` rather than retry from main thread
- Validator fails on root playbook: enter fix-and-revalidate loop documented in the canonical command
- Per-feature file count mismatch: re-run feature-ID count check after every per-feature file write

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~115 per-feature + 5 roots + 6 spec docs = 126; LOC: ~10000+; Systems: 5 skills |
| Risk | 8/25 | Auth: N, API: N, Breaking: N (all additive) |
| Research | 6/20 | Investigation needs: per-CLI feature surface enumeration |
| Multi-Agent | 12/15 | Workstreams: 5 parallel @write dispatches in 2 waves |
| Coordination | 10/15 | Dependencies: shared taxonomy ADR must precede waves |
| **Total** | **54/100** | **Level 3** (qualitative override: cross-cutting taxonomy decisions) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Taxonomy drift between Wave 1 and Wave 2 | M | M | ADR-001 frozen before any Wave dispatch |
| R-002 | Per-feature file count exceeds 120 | L | M | Cap each CLI at upper bound; defer overflow |
| R-003 | `/create:testing-playbook` Phase 0 fails repeatedly | H | L | Hand-craft fallback path documented in plan.md |
| R-004 | Validator passes but per-feature files have structural defects | M | M | Mandatory spot-check 2 files per CLI per Wave |
| R-005 | ID prefix collision across playbooks | L | L | ADR-002 reserves disjoint prefixes; verified by grep |

---

## 11. USER STORIES

### US-001: Operator validates a CLI orchestrator end-to-end (Priority: P0)

**As an** operator (human or AI) tasked with confirming a CLI orchestrator works as documented, **I want** a deterministic playbook with exact prompts and command sequences, **so that** I can produce a binary pass/fail verdict per feature without inventing test scenarios.

**Acceptance Criteria**:
1. Given the playbook root, When I open the MANUAL_TESTING_PLAYBOOK file, Then I see the global preconditions, deterministic command notation, review protocol, orchestration guidance, and a category-indexed list of feature scenarios with links to per-feature files.
2. Given a feature ID, When I open the per-feature file, Then I see Exact Prompt + Exact Command Sequence + Expected Signals + Evidence + Pass/Fail + Failure Triage in a 9-column table.

### US-002: Operator confirms cross-CLI behavior consistency (Priority: P1)

**As an** operator working across multiple CLIs, **I want** the same category numbering for `01--cli-invocation`, `06--integration-patterns`, and `07--prompt-templates` across every CLI playbook, **so that** I can navigate and compare without relearning each playbook's structure.

**Acceptance Criteria**:
1. Given any of the 5 root playbooks, When I look at category 01, Then it is `01--cli-invocation`.
2. Given any of the 5 root playbooks, When I look at category 06, Then it is `06--integration-patterns`.
3. Given any of the 5 root playbooks, When I look at category 07, Then it is `07--prompt-templates`.

### US-003: Future contributor extends a playbook (Priority: P1)

**As a** contributor adding a new feature scenario to a CLI playbook, **I want** the playbook to have been generated through the canonical command, **so that** running `/create:testing-playbook <skill> update` propagates template changes without breaking my hand-edits.

**Acceptance Criteria**:
1. Given a CLI playbook, When I run `/create:testing-playbook <skill> update :confirm`, Then the YAML workflow recognises the existing root and per-feature shape and updates without rewriting unrelated sections.

### US-004: Spec author tracks delivery (Priority: P0)

**As the** spec author, **I want** validator results, file counts, and per-CLI scope captured in `implementation-summary.md`, **so that** the spec folder closes with verifiable evidence rather than placeholder text.

**Acceptance Criteria**:
1. Given the closed spec, When I read `implementation-summary.md`, Then it contains per-CLI counts, validator exit codes, and links to all 5 playbook roots.

---
<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should opencode's "cross-AI handback" scenarios exercise companion CLIs as integration tests, or remain isolated unit-style scenarios? (See ADR-004; recommendation: integration-tier with explicit dependency note.)
- Final per-CLI feature counts may shift slightly during @write dispatch; the spec records targets, not contracts. Document final counts in implementation-summary.md.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Sibling spec (MCP playbooks)**: `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/`
- **Canonical command**: `.opencode/command/create/testing-playbook.md`
- **Templates**: `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`
- **Reference playbook (mature)**: `.opencode/skill/system-spec-kit/manual_testing_playbook/`
- **Reference playbook (single-tool analog)**: `.opencode/skill/mcp-coco-index/manual_testing_playbook/`
