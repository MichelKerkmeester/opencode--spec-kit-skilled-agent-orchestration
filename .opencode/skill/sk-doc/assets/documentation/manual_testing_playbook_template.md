---
title: Manual Testing Playbook Creation - Templates and Standards
description: Templates for creating consistent manual testing playbooks with deterministic scenarios, 9-column validation matrices, review protocols, and sub-agent execution planning.
---

# Manual Testing Playbook Creation - Templates and Standards

Templates for creating manual testing playbooks with deterministic scenarios, structured evidence collection, and multi-agent execution planning.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Purpose**: Manual testing playbooks provide operator-facing validation matrices for skills. They define deterministic scenarios with exact prompts, command sequences, expected signals, and pass/fail criteria so any operator (human or AI agent) can execute and grade tests consistently.

**Key Characteristics**:
- **Deterministic**: Every scenario has an exact prompt and exact command sequence (no interpretation needed)
- **9-column format**: Standardized table covering Feature ID through Failure Triage
- **3-file package**: Main playbook, review protocol, and sub-agent utilization ledger
- **Evidence-driven**: Every scenario requires captured evidence with explicit verdicts

**Location Convention**: `{SKILL_PATH}/manual_testing_playbook/`

Each playbook lives alongside its skill in a `manual_testing_playbook/` directory containing exactly 3 files:

| File | Purpose |
|------|---------|
| `manual_testing_playbook.md` | Scenario definitions with 9-column tables |
| `review_protocol.md` | Acceptance rules, verdict logic, release readiness |
| `subagent_utilization_ledger.md` | Wave planning for parallel agent execution |

**Existing Examples**:
- `.opencode/skill/system-spec-kit/manual_testing_playbook/` (194 scenarios, 4+ categories)
- `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/` (20 scenarios, 6 categories)

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-playbooks -->
## 2. WHEN TO CREATE PLAYBOOKS

**Create a playbook when**:
- A skill has 5+ distinct features that need manual validation
- Automated tests do not cover integration-level or end-to-end behavior
- Multiple operators (human or AI) will execute the same test suite
- Release readiness requires structured evidence collection

**Keep simple when**:
- Skill has fewer than 5 features (inline test notes suffice)
- All behavior is covered by automated tests (unit + integration)
- Single operator will run tests once (ad-hoc checklist is enough)

**Decision Tree**:
```
Skill has 5+ manually testable features?
  YES → Does it need structured evidence for release?
    YES → Create full playbook (3 files)
    NO  → Create lightweight checklist in spec folder
  NO  → Document test steps inline in spec folder tasks.md
```

**Size Thresholds**:

| Playbook Size | Scenarios | Typical Categories | Agent Waves |
|---------------|-----------|-------------------|-------------|
| Small | 5-25 | 2-6 | 1-2 |
| Medium | 25-75 | 5-10 | 2-4 |
| Large | 75-200 | 8-15 | 4-8 |

---

<!-- /ANCHOR:when-to-create-playbooks -->
<!-- ANCHOR:category-and-id-design -->
## 3. CATEGORY AND ID DESIGN

### Planning Your Categories

Before writing scenarios, plan category prefixes. Each category groups related features under a short (2-4 character) prefix.

| Category Purpose | Example Prefix | Example IDs |
|-----------------|----------------|-------------|
| Core CLI commands | `CCC` | CCC-001, CCC-002 |
| MCP tool operations | `MCP` | MCP-001, MCP-002 |
| Configuration | `CFG` | CFG-001, CFG-002 |
| Existing features | `EX` | EX-001, EX-002 |
| New features | `NEW` | NEW-001, NEW-002 |
| Error handling | `ERR` | ERR-001, ERR-002 |

### ID Format

```
{PREFIX}-{NNN}
```

- **PREFIX**: 2-4 uppercase letters identifying the category
- **NNN**: Zero-padded 3-digit sequence number starting at 001
- IDs are unique across the entire playbook (no two categories share an ID number space)
- Gaps in numbering are allowed (deleted scenarios leave gaps, do not renumber)

### Category Planning Table

Fill this table before writing scenarios:

| # | Category Name | Prefix | Planned ID Range | Estimated Scenarios |
|---|--------------|--------|------------------|---------------------|
| 1 | {CAT1_NAME} | {CAT1} | {CAT1}-001..{CAT1}-NNN | {COUNT} |
| 2 | {CAT2_NAME} | {CAT2} | {CAT2}-001..{CAT2}-NNN | {COUNT} |
| 3 | {CAT3_NAME} | {CAT3} | {CAT3}-001..{CAT3}-NNN | {COUNT} |

---

<!-- /ANCHOR:category-and-id-design -->
<!-- ANCHOR:nine-column-table-format -->
## 4. THE 9-COLUMN TABLE FORMAT

Every scenario row uses exactly 9 columns:

| # | Column | Content | Guidance |
|---|--------|---------|----------|
| 1 | **Feature ID** | `PREFIX-NNN` | Unique across playbook |
| 2 | **Feature Name** | Short name (2-5 words) | Human-readable, no ID repetition |
| 3 | **Scenario Name / Objective** | What this scenario proves | Start with "Verify" or "Confirm" |
| 4 | **Exact Prompt** | The natural-language prompt to give an AI agent | Copy-paste ready, no ambiguity |
| 5 | **Exact Command Sequence** | Numbered steps with `->` separators | Deterministic, executable as-is |
| 6 | **Expected Signals** | Observable outputs per step | Reference step numbers |
| 7 | **Evidence** | What to capture as proof | Terminal transcripts, tool outputs, file listings |
| 8 | **Pass/Fail Criteria** | Binary decision rules | "PASS if X AND Y; FAIL if Z" |
| 9 | **Failure Triage** | What to check when a scenario fails | Ordered debugging steps |

### Table Header (Copy-Paste)

```markdown
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
```

### Example Row

```markdown
| CCC-001 | Project initialization | Verify `ccc init` creates project config; second call reports already initialized | `Initialize a new CocoIndex Code project in the current directory` | 1. `bash: rm -rf .config/` -> 2. `bash: tool init` -> 3. Verify config exists: `bash: ls .config/settings.yml` | Step 2: output contains "Initialized"; Step 3: file exists | Terminal transcript of all 3 steps | PASS if all 3 steps produce expected signals; FAIL if config missing after init | Check binary path; verify runtime version; check write permissions |
```

### Common Pitfalls

- **Vague prompts**: "Test the search" is not deterministic. Use: "Search for 'fibonacci calculation' and verify results contain file paths and scores"
- **Missing step references**: Expected signals must reference step numbers ("Step 2: output contains...")
- **Unbounded criteria**: "PASS if it works" is not grading criteria. Use: "PASS if result count > 0 AND all files match filter"
- **Missing triage**: Every scenario needs at least 2-3 ordered debugging steps for when it fails

---

<!-- /ANCHOR:nine-column-table-format -->
<!-- ANCHOR:main-playbook-scaffold -->
## 5. MAIN PLAYBOOK SCAFFOLD

Copy this scaffold to create `{SKILL_PATH}/manual_testing_playbook/manual_testing_playbook.md`:

```markdown
# Manual Test Playbook -- {SKILL_NAME}

This playbook is the operator-facing manual validation matrix for the {SKILL_NAME} skill. It covers {COVERAGE_SUMMARY} with deterministic prompts, exact execution sequences, expected signals, and pass/fail triage guidance.

Canonical source artifacts:
- `{SKILL_PATH}/manual_testing_playbook/manual_testing_playbook.md`
- `{SKILL_PATH}/manual_testing_playbook/review_protocol.md`
- `{SKILL_PATH}/manual_testing_playbook/subagent_utilization_ledger.md`

## TABLE OF CONTENTS

- [OVERVIEW](#1-overview)
- [GLOBAL PRECONDITIONS](#global-preconditions)
- [GLOBAL EVIDENCE REQUIREMENTS](#global-evidence-requirements)
- [DETERMINISTIC COMMAND NOTATION](#deterministic-command-notation)
- [{CAT1_HEADING} (`{CAT1}-001..{CAT1}-NNN`)](#cat1-anchor)
- [{CAT2_HEADING} (`{CAT2}-001..{CAT2}-NNN`)](#cat2-anchor)
- [AUTOMATED TEST CROSS-REFERENCE](#automated-test-cross-reference)
- [FEATURE CATALOG CROSS-REFERENCE INDEX](#feature-catalog-cross-reference-index)

## 1. OVERVIEW

This playbook provides {SCENARIO_COUNT} deterministic scenarios across {CATEGORY_COUNT} categories validating the {SKILL_NAME} skill surface: {SURFACE_DESCRIPTION}.

Coverage note ({PLAYBOOK_DATE}): {COVERAGE_NOTE}.

## Global Preconditions
1. Working directory is project root (has `.git/`).
2. {PRECONDITION_2}
3. {PRECONDITION_3}
4. {PRECONDITION_4}
5. **Destructive scenario {DESTRUCTIVE_IDS}** MUST verify recovery is possible (non-production data only).

## Global Evidence Requirements
For every scenario, capture:
1. **Command transcript** -- full tool output or terminal output.
2. **Key output snippet** -- file paths, scores, counts, or other observable metrics.
3. **Scenario verdict** -- `PASS`, `PARTIAL`, or `FAIL` with one-line rationale.

## Deterministic Command Notation
- CLI commands shown as `{CLI_TOOL} <subcommand> [args]`.
- MCP tool calls shown as `{MCP_TOOL_PREFIX}({ key: value })`.
- Bash commands shown as `bash: <command>`.
- `->` separates sequential steps within a single scenario.
- All paths are relative to project root unless otherwise noted.

---

## {CAT1_HEADING} (`{CAT1}-001..{CAT1}-NNN`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| {CAT1}-001 | {FEATURE_NAME} | Verify {OBJECTIVE} | `{EXACT_PROMPT}` | 1. `{COMMAND}` -> 2. `{COMMAND}` | Step 1: {SIGNAL}; Step 2: {SIGNAL} | {EVIDENCE_DESCRIPTION} | PASS if {CRITERIA}; FAIL if {CRITERIA} | {TRIAGE_STEPS} |

---

## {CAT2_HEADING} (`{CAT2}-001..{CAT2}-NNN`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| {CAT2}-001 | {FEATURE_NAME} | Verify {OBJECTIVE} | `{EXACT_PROMPT}` | 1. `{COMMAND}` -> 2. `{COMMAND}` | Step 1: {SIGNAL}; Step 2: {SIGNAL} | {EVIDENCE_DESCRIPTION} | PASS if {CRITERIA}; FAIL if {CRITERIA} | {TRIAGE_STEPS} |

---

## Automated Test Cross-Reference

The playbook complements (not replaces) automated test suites:

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `{TEST_FILE}` | {TEST_COVERAGE} | {OVERLAP_IDS} |

---

## Feature Catalog Cross-Reference Index

| Feature ID | Feature Name | Category |
|---|---|---|
| {CAT1}-001 | {FEATURE_NAME} | {CAT1_HEADING} |
| {CAT2}-001 | {FEATURE_NAME} | {CAT2_HEADING} |
```

---

<!-- /ANCHOR:main-playbook-scaffold -->
<!-- ANCHOR:review-protocol-scaffold -->
## 6. REVIEW PROTOCOL SCAFFOLD

Copy this scaffold to create `{SKILL_PATH}/manual_testing_playbook/review_protocol.md`:

```markdown
---
title: Main-Agent Review Protocol
description: Scenario acceptance rules, feature verdict logic, and release readiness criteria for the {SKILL_NAME} manual testing playbook.
---

# Main-Agent Review Protocol

Acceptance rules and release readiness criteria for reviewing {SKILL_NAME} playbook execution results.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Inputs Required

1. `manual_testing_playbook.md`
2. Scenario execution evidence (logs, tool outputs, artifacts)
3. Feature-to-scenario coverage map
4. Triage notes for all non-pass outcomes

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:scenario-acceptance -->
## 2. SCENARIO ACCEPTANCE RULES

For each executed scenario, check:

1. Preconditions were satisfied
2. Prompt and command sequence were executed as written
3. Expected signals are present
4. Evidence is complete and readable
5. Outcome rationale is explicit

### Scenario Verdict

| Verdict | Criteria |
|---------|----------|
| `PASS` | All acceptance checks true |
| `PARTIAL` | Core behavior works but non-critical evidence or metadata is incomplete |
| `FAIL` | Expected behavior missing, contradictory output, or critical check failed |

<!-- /ANCHOR:scenario-acceptance -->

---

<!-- ANCHOR:feature-verdict -->
## 3. FEATURE VERDICT RULES

| Verdict | Criteria |
|---------|----------|
| `PASS` | All mapped scenarios for feature are `PASS` |
| `PARTIAL` | At least one mapped scenario is `PARTIAL`, none are `FAIL` |
| `FAIL` | Any mapped scenario is `FAIL` |

**Hard rule**: Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

<!-- /ANCHOR:feature-verdict -->

---

<!-- ANCHOR:release-readiness -->
## 4. RELEASE READINESS

Release is `READY` only when:

1. No feature verdict is `FAIL`
2. All critical scenarios are `PASS`
3. Coverage is 100% of features defined in `manual_testing_playbook.md` (`COVERED_FEATURES == TOTAL_FEATURES`)
4. No unresolved blocking triage item remains

Otherwise release is `NOT READY`.

### Deterministic Coverage Check

Run from repository root:

```bash
TOTAL_FEATURES=$(python3 - <<'PY'
from pathlib import Path
import re
path = Path('{SKILL_PATH}/manual_testing_playbook/manual_testing_playbook.md')
count = 0
in_catalog = False
pattern = re.compile(r'^\| ({FEATURE_ID_PATTERN}) \|')
for line in path.read_text().splitlines():
    if line.startswith('## Feature Catalog Cross-Reference Index'):
        in_catalog = True
    if not in_catalog and pattern.match(line):
        count += 1
print(count)
PY
)
```

Final verdict report must include `COVERED_FEATURES/TOTAL_FEATURES`.

<!-- /ANCHOR:release-readiness -->

---

<!-- ANCHOR:destructive-scenarios -->
## 5. DESTRUCTIVE SCENARIO RULES

- {DESTRUCTIVE_IDS} MUST run on non-production data only
- Before executing, verify the affected resource can be rebuilt from scratch
- Never run destructive scenarios in parallel with other scenarios that depend on the same resource

<!-- /ANCHOR:destructive-scenarios -->

---

<!-- ANCHOR:mandatory-flows -->
## 6. {SKILL_NAME}-SPECIFIC MANDATORY FLOWS

Use `manual_testing_playbook.md` as the single source of truth for all scenario definitions.

**Rule**: Do not duplicate or restate command text in this protocol; update playbook scenarios when commands change.

<!-- /ANCHOR:mandatory-flows -->


---

<!-- /ANCHOR:review-protocol-scaffold -->
<!-- ANCHOR:subagent-ledger-scaffold -->
## 7. SUB-AGENT UTILIZATION LEDGER SCAFFOLD

Copy this scaffold to create `{SKILL_PATH}/manual_testing_playbook/subagent_utilization_ledger.md`:

```markdown
---
title: Sub-Agent Utilization Ledger
description: Coordinator/worker wave planning and capacity guidance for executing the {SKILL_NAME} {SCENARIO_COUNT}-scenario manual testing playbook.
---

# Sub-Agent Utilization Ledger

Coordinator/worker utilization guidance for executing the {SKILL_NAME} manual testing playbook across parallel waves.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Records wave planning and capacity guidance for the {SCENARIO_COUNT}-scenario {SKILL_NAME} playbook. This is not a runtime support matrix -- it is pre-execution planning for agent orchestration.

### Scope

- **Playbook size**: {SCENARIO_COUNT} scenarios across {CATEGORY_COUNT} categories ({CAT_LIST})
- **Surface area**: {SIZE_LABEL} (small/medium/large per threshold table)
- **Recommendation**: {WAVE_RECOMMENDATION}

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:wave-planning -->
## 2. WAVE PLANNING

| Wave | Scenarios | Worker Count | Notes |
|------|-----------|--------------|-------|
| Wave 1 (non-destructive) | {NON_DESTRUCTIVE_IDS} | {WORKER_COUNT} | All non-destructive scenarios; safe to parallelize |
| Wave 2 (destructive) | {DESTRUCTIVE_IDS} | 1 | **Must run in isolation** -- modifies shared state; no other scenario may depend on affected resources during this wave |

### Capacity Notes

- {CAPACITY_NOTE_1}
- {CAPACITY_NOTE_2}
- **Destructive isolation**: {DESTRUCTIVE_IDS} MUST run after all non-destructive scenarios complete, in a dedicated wave

<!-- /ANCHOR:wave-planning -->

---

<!-- ANCHOR:operational-rules -->
## 3. OPERATIONAL RULES

1. Probe runtime capacity at start
2. Reserve one coordinator
3. Saturate remaining worker slots
4. Pre-assign explicit scenario IDs and ranges to each wave before execution
5. Run destructive scenarios in a dedicated sandbox-only wave
6. After each wave, save context and evidence, then begin the next wave
7. Record utilization table and evidence paths in final report

<!-- /ANCHOR:operational-rules -->
```

---

<!-- /ANCHOR:subagent-ledger-scaffold -->
<!-- ANCHOR:evidence-and-verdict-patterns -->
## 8. EVIDENCE AND VERDICT PATTERNS

### Standard Evidence Bundle

For each scenario execution, collect:

| Evidence Type | Format | Example |
|--------------|--------|---------|
| Command transcript | Full terminal or tool output | Copy of stdout/stderr |
| Key output snippet | Highlighted metrics or values | "Files: 1,204, Chunks: 105,432" |
| Screenshot/artifact | Visual proof when applicable | Browser screenshot, file listing |
| Timing data | Execution duration | "Completed in 3.2s" |

### Verdict Definitions

| Verdict | When to Use | Action Required |
|---------|-------------|-----------------|
| `PASS` | All expected signals present, all criteria met | None |
| `PARTIAL` | Core behavior works, but minor evidence gap or non-critical deviation | Document gap, no blocker |
| `FAIL` | Expected behavior absent, contradictory output, or critical criterion unmet | Triage required, blocks release |

### Triage Escalation

When a scenario fails:

1. **Check preconditions** -- Were all global preconditions satisfied?
2. **Isolate the step** -- Which specific step in the command sequence diverged?
3. **Check environment** -- Binary paths, versions, permissions, daemon status
4. **Reproduce** -- Run the failing step independently outside the playbook
5. **Escalate** -- If root cause is unclear after steps 1-4, file a bug with full evidence

---

<!-- /ANCHOR:evidence-and-verdict-patterns -->
<!-- ANCHOR:playbook-checklist -->
## 9. PLAYBOOK CHECKLIST

Before publishing a playbook, verify:

```markdown
Structure:
- [ ] All 3 files exist in `manual_testing_playbook/` directory
- [ ] Main playbook has TOC with anchor links
- [ ] Main playbook has Global Preconditions section
- [ ] Main playbook has Global Evidence Requirements section
- [ ] Main playbook has Deterministic Command Notation section
- [ ] Main playbook has Feature Catalog Cross-Reference Index
- [ ] Review protocol has all 6 sections (overview through mandatory flows)
- [ ] Sub-agent ledger has all 3 sections (overview, wave planning, operational rules)

Content:
- [ ] All scenario tables use 9-column format
- [ ] Every Feature ID is unique across the playbook
- [ ] Every scenario has an Exact Prompt (copy-paste ready)
- [ ] Every scenario has numbered Exact Command Sequence with `->` separators
- [ ] Every Expected Signals entry references step numbers
- [ ] Every Pass/Fail Criteria uses "PASS if X; FAIL if Y" format
- [ ] Every Failure Triage has 2+ ordered debugging steps
- [ ] Destructive scenarios are identified in preconditions

Quality:
- [ ] Feature Catalog Index matches all scenario rows (no orphans, no gaps)
- [ ] Review protocol coverage check regex matches all Feature ID prefixes
- [ ] Sub-agent ledger wave plan covers all scenario IDs
- [ ] Automated Test Cross-Reference maps playbook scenarios to test files

Cross-Reference Validation:
- [ ] Count of IDs in Feature Catalog == count of scenario rows in tables
- [ ] All destructive IDs in review protocol match those in main playbook
- [ ] All category prefixes in ledger match those in main playbook
```

---

<!-- /ANCHOR:playbook-checklist -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Existing Playbook Examples

- [system-spec-kit playbook](../../../../system-spec-kit/manual_testing_playbook/manual_testing_playbook.md) -- Large playbook (194 scenarios, 4+ categories)
- [mcp-cocoindex-code playbook](../../../../mcp-cocoindex-code/manual_testing_playbook/manual_testing_playbook.md) -- Small playbook (20 scenarios, 6 categories)

### Templates and Standards

- [template_rules.json](../template_rules.json) -- Machine-readable validation rules (includes `playbook` type)
- [core_standards.md](../../references/core_standards.md) -- Document formatting standards
- [install_guide_template.md](./install_guide_template.md) -- Closest structural analog (phase-based template)

### Skill Reference

- [sk-doc SKILL.md](../../SKILL.md) -- Mode 5: Playbook Creation

### Placeholder Variable Reference

| Placeholder | Purpose | Example |
|-------------|---------|---------|
| `{SKILL_NAME}` | Human-readable skill name | "CocoIndex Code" |
| `{SKILL_PATH}` | Filesystem path to skill | `.opencode/skill/mcp-cocoindex-code` |
| `{SCENARIO_COUNT}` | Total number of scenarios | "20" |
| `{CATEGORY_COUNT}` | Number of categories | "6" |
| `{CAT1}`, `{CAT2}`, etc. | Category ID prefixes | "CCC", "MCP" |
| `{CAT1_NAME}`, `{CAT2_NAME}` | Category display names | "Core CLI Commands" |
| `{CAT1_HEADING}`, `{CAT2_HEADING}` | H2 heading text | "Core CLI Commands" |
| `{CAT_LIST}` | Comma-separated prefix list | "CCC, MCP, CFG, DMN, ADV, ERR" |
| `{DESTRUCTIVE_IDS}` | Destructive scenario IDs | "CCC-005" |
| `{FEATURE_ID_PATTERN}` | Regex for coverage check | `CCC-\d{3}\|MCP-\d{3}` |
| `{PLAYBOOK_DATE}` | Coverage date | "2026-03-18" |
| `{CLI_TOOL}` | CLI binary name | "ccc" |
| `{MCP_TOOL_PREFIX}` | MCP tool call prefix | "mcp__cocoindex_code__search" |
| `{COVERAGE_SUMMARY}` | What the playbook covers | "CLI commands, MCP tool, configuration" |
| `{SURFACE_DESCRIPTION}` | Skill surface description | "1 MCP tool, 6 CLI commands, settings" |
| `{SIZE_LABEL}` | Playbook size classification | "Small" |
| `{WAVE_RECOMMENDATION}` | Execution recommendation | "Single-wave with one destructive isolation wave" |

<!-- /ANCHOR:related-resources -->
