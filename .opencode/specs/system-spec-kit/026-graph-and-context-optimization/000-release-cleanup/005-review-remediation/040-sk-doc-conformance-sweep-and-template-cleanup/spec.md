---
title: "Feature Specification: sk-doc Conformance Sweep and Template Cleanup"
description: "Multiple sk-doc-governed surfaces have drifted from canonical format and the templates folder needs legacy cleanup; this packet runs a coordinated conformance sweep so sk-doc remains the single source-of-truth for documentation shape."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "040-sk-doc-conformance-sweep-and-template-cleanup"
  - "sk-doc conformance sweep"
  - "manual testing playbook conformance"
  - "feature catalog conformance"
  - "skill reference conformance"
  - "template cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/040-sk-doc-conformance-sweep-and-template-cleanup"
    last_updated_at: "2026-04-30T08:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec docs rewritten to Level 3 canonical"
    next_safe_action: "Run validate.sh --strict; dispatch Tier 2a wave"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:040-sk-doc-conformance-sweep-and-template-cleanup"
      session_id: "040-sk-doc-conformance-sweep-and-template-cleanup"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 8
    open_questions: []
    answered_questions:
      - "Phase 040 collision resolved naturally (prior 040 renumbered to 027)."
      - "skill_advisor playbook = Reclassify."
      - "system-spec-kit canonical playbook drift = Full remediation."
---
# Feature Specification: sk-doc Conformance Sweep and Template Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Multiple sk-doc-governed surfaces across the OpenCode tree have drifted from the canonical format the sk-doc skill itself defines: 14 of 15 manual_testing_playbook directories drift in some way, 5 of 7 feature_catalogs drift, 25 of 33 system-spec-kit references drift, and 3 of 8 sk-code-review references drift. Templates folder also needs cleanup (delete `templates/sharded`, rename `stress-test` → `stress_test`, rename `addendum/level3plus-govern` → `level3-plus-govern`, align `templates/changelog`). This packet runs a single coordinated conformance sweep so sk-doc remains the single source-of-truth.

**Key Decisions**: skill_advisor playbook reclassified (move existing 42/43 files to `operator_runbook/`, create new canonical `manual_testing_playbook/` alongside); system-spec-kit's own canonical playbook fully remediated despite being the reference example.

**Critical Dependencies**: sk-doc skill (canonical format definitions); sk-improve-prompt (RCAF prompt generation); cli-codex CLI (parallel gpt-5.5 high fast content rewrites).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-30 |
| **Branch** | `main` (stay-on-main rule) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user spotted format drift in two cited manual_testing_playbook examples (`system-spec-kit/mcp_server/skill_advisor/` and `.../code_graph/`). Seven parallel cli-codex gpt-5.5 high fast audits revealed a far wider pattern: most playbooks, catalogs, and references across the tree drift from the canonical sk-doc shape, including the canonical `system-spec-kit/manual_testing_playbook/` itself (320/321 per-feature files use `## 4. REFERENCES` instead of `## 4. SOURCE FILES`). On top of that, the templates folder carries a legacy `templates/sharded/`, a hyphenated `templates/stress-test/` missing its README, and a custom `templates/changelog/` that drifts from sk-doc shape.

### Purpose
Bring every sk-doc-governed surface into strict conformance with the canonical sk-doc reference templates, delete legacy template artifacts, apply renames, and sweep all path references — so sk-doc remains the single authoritative source-of-truth for documentation shape, and no surface fails strict validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Manual testing playbook conformance for 14 of 15 directories (one trivially compliant excluded)
- Feature catalog conformance for 5 of 7 directories (two compliant excluded)
- Skill reference conformance for 28 of 41 reference files (drift + partial cases)
- `.opencode/plugins/README.md` rewrite per sk-doc README template
- Templates cleanup: delete `templates/sharded/`, rename `templates/stress-test/` → `templates/stress_test/` (with new README), align `templates/changelog/` frontmatter, rename `templates/addendum/level3plus-govern/` → `level3-plus-govern/`
- Cross-repo path-reference sweep for renamed/deleted paths
- Validation pass via `validate_document.py` and `validate.sh --strict`
- Memory + graph reindex post-renames

### Out of Scope
- Refactoring sk-doc itself - sk-doc is treated as authoritative
- New playbooks for skills without one (except mcp-clickup which is missing entirely)
- Changes to skill behavior (only documentation shape)
- The `054-sk-code-merger` deprecation work on sk-code-web/sk-code-full-stack - separate concern, already shipped

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 14 `manual_testing_playbook/` directories | Modify | Per-feature files + roots; ~400+ files |
| 5 `feature_catalog/` directories | Modify | Per-feature files + roots; ~50+ files |
| 28 reference markdown files | Modify | 20 ssk + 3 skcr drift; 5 partial mechanical fixes |
| `.opencode/plugins/README.md` | Modify | Rewrite per sk-doc README template |
| `.opencode/skill/system-spec-kit/templates/sharded/` | Delete | 5 legacy files |
| `.opencode/skill/system-spec-kit/templates/stress-test/` | Rename | → `stress_test/` plus new README |
| `.opencode/skill/system-spec-kit/templates/changelog/` | Modify | Align frontmatter to sk-doc shape |
| `.opencode/skill/system-spec-kit/templates/addendum/level3plus-govern/` | Rename | → `level3-plus-govern/` |
| ~10 path-reference files | Modify | system-spec-kit/{README.md,SKILL.md}, references/{workflows,templates,structure}, feature_catalog and manual_testing_playbook 14--stress-testing entries, feature_catalog 16--tooling-and-scripts/30-template-composition-system.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every modified manual_testing_playbook root passes `validate_document.py` | Exit 0 per root |
| REQ-002 | Every modified feature_catalog root passes `validate_document.py` | Exit 0 per root |
| REQ-003 | mcp-clickup/manual_testing_playbook/ exists with canonical structure | Directory + root + at least one category folder + at least one per-feature file |
| REQ-004 | skill_advisor reclassification complete | Existing 42/43 files moved to `operator_runbook/`; new canonical `manual_testing_playbook/` exists alongside |
| REQ-005 | templates/sharded/ deleted | `git status` confirms deletion; zero callers |
| REQ-006 | templates/stress-test/ renamed to stress_test/ with new README | New folder name + README per sk-doc; all path refs updated |
| REQ-007 | templates/addendum/level3plus-govern/ renamed to level3-plus-govern/ | All path refs updated |
| REQ-008 | Zero path-reference hits for deprecated names | `grep -rIn "level3plus-govern\|templates/stress-test\|templates/sharded" .opencode/` returns zero hits in active code paths |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | RCAF prompts in canonical sentence form | 5 random per-feature playbook spot-checks pass |
| REQ-011 | Per-feature catalog files have OVERVIEW/CURRENT REALITY/SOURCE FILES/SOURCE METADATA | 5 random spot-checks pass |
| REQ-012 | Reference files have title+description-only frontmatter, ANCHOR comments, OVERVIEW first | 5 random spot-checks pass |
| REQ-013 | .opencode/plugins/README.md rewritten | Passes sk-doc README template structure check |
| REQ-014 | templates/changelog/ frontmatter aligned to sk-doc shape | Without losing nested-packet purpose |
| REQ-015 | Memory + graph reindexed post-renames | `code_graph_status` reports fresh; `memory_search` resolves canonical triggers |
| REQ-016 | No skill_advisor recommendation regressions | Routing for "manual testing playbook" / "feature catalog" / "skill reference" still resolves correctly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every modified spec folder passes `validate.sh --strict` (exit 0)
- **SC-002**: Every modified document passes `validate_document.py` (exit 0)
- **SC-003**: Zero hits across `.opencode/` for `templates/sharded`, `templates/stress-test`, or unprefixed `level3plus-govern`
- **SC-004**: 5 random per-feature playbook spot-checks have RCAF prompts in canonical sentence form
- **SC-005**: 5 random per-feature catalog spot-checks have canonical 4-section structure + canonical source line
- **SC-006**: 5 random reference spot-checks have title+description-only frontmatter, ANCHOR comments, OVERVIEW first
- **SC-007**: skill_advisor recommendations for playbook/catalog/reference triggers still resolve correctly post-sweep
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc skill canonical templates | Required for all rewrites | Pinned at current state; treat as authoritative |
| Dependency | sk-improve-prompt skill | RCAF prompt generation | Direct skill reference; tolerant fallback to manual RCAF authoring |
| Dependency | cli-codex CLI binary | Parallel content rewrites | Verified available (codex-cli 0.125.0); stdin fix discovered + applied |
| Risk | Tier 2c high-effort dispatches produce inconsistent rewrites at scale | High | Single-file scope per dispatch; manual spot-check + recovery iterations |
| Risk | Path-reference sweep misses generated files (graph metadata, advisor data) | Medium | Run `code_graph_scan` + advisor rebuild post-sweep |
| Risk | system-spec-kit canonical full remediation produces ~321 file diffs at once | Medium | Batch by category folder; validate per batch |
| Risk | mcp-clickup playbook creation requires inventing scenarios | Medium | Bootstrap with the most critical scenarios; full coverage as follow-on |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Tier 2 dispatch wave wall time ≤45 minutes per wave (8-12 parallel cli-codex agents per wave)
- **NFR-P02**: Validation pass on full packet ≤5 minutes for all modified surfaces

### Security
- **NFR-S01**: All cli-codex dispatches run in `--sandbox read-only` for audit phase, `--sandbox workspace-write` for rewrite phase only
- **NFR-S02**: No secrets or credentials embedded in any rewritten document

### Reliability
- **NFR-R01**: Failed cli-codex dispatches are diagnosed + re-dispatched within the wave; do not block subsequent waves
- **NFR-R02**: All renames use `git mv` (reversible); all deletions reviewed for active callers before commit

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: per-feature file with only frontmatter and H1 → mark as `[B]` blocked, surface in remediation-log.md
- Maximum length: per-feature files >5000 LOC → split into multiple per-feature files in same category if scope creep is detected

### Error Scenarios
- cli-codex dispatch returns non-conformant output: re-dispatch with refined prompt; if 2 retries fail, halt the wave and escalate
- Path-reference sweep encounters a binary file: skip with warning; verify no binary contains the renamed path string
- Graph reindex fails post-rename: roll back the rename, investigate, retry

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Files: 150-300, LOC: 5000+, Systems: 4 (sk-doc, system-spec-kit, sk-code-review, sk-improve-prompt) |
| Risk | 18/25 | Auth: N, API: N, Breaking: documentation only |
| Research | 8/20 | Audit complete via 7 parallel cli-codex agents |
| Multi-Agent | 14/15 | Workstreams: ~25-35 cli-codex parallel dispatches |
| Coordination | 12/15 | Dependencies: spec folder shell + canonical templates + sk-improve-prompt + cli-codex |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | system-spec-kit canonical full remediation produces inconsistent rewrites across 321 files | H | M | Tier 2c batch by category folder; validate per batch; spot-check 5+ random files per dispatch |
| R-002 | mcp-clickup playbook scenarios need invention | M | H | Bootstrap with critical scenarios; full coverage as follow-on packet |
| R-003 | Path-reference sweep misses generated/binary refs | M | M | Run `code_graph_scan` + advisor rebuild post-sweep; verify with broader grep |
| R-004 | Tier 2c skill_advisor reclassification breaks skill_advisor own routing data | H | L | Move files via `git mv` (preserves history); regenerate `graph-metadata.json` post-rename |
| R-005 | cli-codex stdin gotcha causes silent dispatch hang | M | L | Already mitigated: pipe prompt files via `< /tmp/prompt.txt -` syntax verified |

---

## 11. USER STORIES

### US-001: Validator-Pass Conformance Sweep (Priority: P0)

**As a** sk-doc maintainer, **I want** every modified surface to pass strict validation, **so that** sk-doc remains the trusted single source-of-truth for documentation shape.

**Acceptance Criteria**:
1. Given the conformance sweep is complete, when `validate.sh --strict` runs on every modified spec folder, then exit code is 0.
2. Given any cli-codex dispatch fails validation, when the dispatch is re-run with a refined prompt, then the wave continues without blocking subsequent waves.

---

### US-002: User-Flagged Cases Resolved (Priority: P0)

**As a** documentation reader, **I want** the user-flagged playbooks (`skill_advisor`, `code_graph`) to follow canonical format, **so that** I can navigate them with the same mental model as any other manual_testing_playbook.

**Acceptance Criteria**:
1. Given skill_advisor playbook reclassification is complete, when I look at `.../skill_advisor/manual_testing_playbook/`, then I see a canonical 5-section structure (OVERVIEW / SCENARIO CONTRACT / TEST EXECUTION / SOURCE FILES / SOURCE METADATA) with RCAF prompts.
2. Given the original operator-runbook content is preserved, when I look at `.../skill_advisor/operator_runbook/`, then I see the original SCENARIO/SETUP/STEPS files unchanged.
3. Given code_graph playbook is remediated, when I look at any per-feature file, then RCAF prompt is present, all SCENARIO CONTRACT fields are filled, Pass/Fail and Failure Triage subsections are populated.

---

### US-003: Templates Cleanup (Priority: P1)

**As a** spec-kit user, **I want** the templates folder to be free of legacy artifacts, **so that** I never see deprecated paths cited from active code.

**Acceptance Criteria**:
1. Given the cleanup is complete, when I `grep -rIn "templates/sharded\|templates/stress-test\|level3plus-govern" .opencode/`, then zero hits in active code paths.
2. Given the renames are complete, when I list `.opencode/skill/system-spec-kit/templates/`, then I see `stress_test/` (with README) and `addendum/level3-plus-govern/`.

---

### US-004: Memory + Graph Consistency (Priority: P1)

**As a** developer, **I want** memory_search and code_graph_query to resolve correctly post-sweep, **so that** advisor recommendations and resume flows are not regressed.

**Acceptance Criteria**:
1. Given the sweep + reindex is complete, when I run `memory_search({ query: "manual testing playbook" })`, then canonical playbook entries are returned.
2. Given the renames are complete, when I run `code_graph_status`, then freshness reports `live` (not `stale` for any of the renamed paths).

---

### US-005: skill_advisor Reclassification Preserves Operator Runbook (Priority: P0)

**As a** skill_advisor operator, **I want** the existing operator-runbook content preserved, **so that** I can still detect and recover from a degraded daemon state.

**Acceptance Criteria**:
1. Given the reclassification is complete, when I list `.../skill_advisor/operator_runbook/`, then I see all 42/43 original SCENARIO/SETUP/STEPS/EXPECTED/FAILURE MODES files unchanged.
2. Given the reclassification is complete, when I open `OP-001-degraded-daemon.md`, then content is identical to the pre-rename file (verified via git history).

---

### US-006: mcp-clickup Playbook Bootstrap (Priority: P0)

**As a** mcp-clickup operator, **I want** at least one canonical manual_testing_playbook scenario, **so that** I have a starting point for feature validation.

**Acceptance Criteria**:
1. Given the mcp-clickup playbook is created from scratch, when I list `.../mcp-clickup/manual_testing_playbook/`, then I see `manual_testing_playbook.md` root + at least one `NN--category/NNN-feature.md` file.
2. Given the bootstrap scenario exists, when I open the per-feature file, then it has full canonical 5-section structure with RCAF prompt.

---

## 12. OPEN QUESTIONS

- None at this time. All 3 architectural decisions resolved (D-001 through D-006). Strict validation gating + Tier 2 wave structure defined.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:ai-protocol -->
## 13. AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before each cli-codex dispatch in Tier 2:
1. Read canonical sk-doc reference template for the target document class
2. Confirm target surface paths exist (or are intentionally absent for create-from-scratch dispatches)
3. Pipe prompt via `< /tmp/<prompt-file>.txt -` to avoid the codex stdin gotcha
4. Use `--sandbox read-only` for audit dispatches; `--sandbox workspace-write` only for rewrite dispatches
5. Save dispatch ID; expect 3-5 min wall time per dispatch

### Execution Rules

| Phase | Concurrency | Sandbox | Validation Gate |
|-------|-------------|---------|-----------------|
| Tier 1 (foundation) | Serial | read-only / workspace-write | `validate.sh --strict` exit 0 |
| Tier 2a (low effort) | 8 parallel | workspace-write | `validate_document.py` per root |
| Tier 2b (medium effort) | 12 parallel | workspace-write | `validate_document.py` + spot-check |
| Tier 2c (high effort) | Up to 5 parallel, single-file scope | workspace-write | `validate_document.py` + 5+ random spot-checks per dispatch |
| Tier 3 (cleanup + sweep) | Serial git ops | direct | grep returns zero hits |
| Tier 4 (validation) | Serial | direct | All P0 + ≥90% P1 checked with evidence |

### Status Reporting Format

Each dispatch wave reports:
```
Wave: <2a|2b|2c> | Dispatched: N | Completed: N | Failed: N
Failed dispatches: <list with error reason>
Verification: <validate_document.py results>
Wall time: <minutes>
```

### Blocked Task Protocol

If any task is blocked (`[B]`):
1. Mark `[B]` in tasks.md with reason
2. Document in remediation-log.md (or scratch/ if not yet created)
3. If 3+ tasks blocked in same wave, halt the wave and escalate
4. Re-dispatch with refined prompt OR escalate to manual remediation
5. Never silently skip — always document

<!-- /ANCHOR:ai-protocol -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Audit Findings**: See `audit-findings.md`
- **Approved Plan**: `/Users/michelkerkmeester/.claude/plans/not-all-manual-testing-prancy-biscuit.md`
