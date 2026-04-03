---
title: Validation Rules Reference
description: Complete reference for all validation rules used by the SpecKit validation system.
---

# Validation Rules Reference - Complete Rule Reference

Complete reference for all validation rules used by the SpecKit validation system.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Is This Reference?

This document provides comprehensive documentation for every validation rule enforced by the SpecKit system. It covers rule behavior, severity levels, detection patterns, and remediation steps for each validation check.

**Core Purpose**:
- **Rule Documentation** - Complete specifications for all validation checks
- **Fix Instructions** - Clear remediation steps when validation fails
- **Configuration Guide** - Environment variables and usage patterns

### Core Principle

> Validation ensures spec folders meet quality standards before claiming completion—preventing incomplete documentation from passing the Completion Verification Rule.

### Severity Levels

| Severity | Exit Code | Strict Mode | Description                       |
| -------- | --------- | ----------- | --------------------------------- |
| ERROR    | 2         | 2           | Validation failed, must fix       |
| WARNING  | 1         | 2           | Passed with issues, should fix    |
| INFO     | 0         | 0           | Informational, no action required |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:rule-summary -->
## 2. RULE SUMMARY

| Rule ID              | Severity | Applies To    | Description                                    |
| -------------------- | -------- | ------------- | ---------------------------------------------- |
| `FILE_EXISTS`        | ERROR    | All levels    | Required files present for documentation level |
| `PLACEHOLDER_FILLED` | ERROR    | Core files    | No unfilled template placeholders              |
| `SECTIONS_PRESENT`   | WARNING  | All templates | Required markdown sections exist               |
| `LEVEL_DECLARED`     | INFO     | spec.md       | Level explicitly stated in metadata            |
| `PRIORITY_TAGS`      | WARNING  | checklist.md  | P0/P1/P2 priority tags properly formatted      |
| `EVIDENCE_CITED`     | WARNING  | checklist.md  | Non-P2 items cite supporting evidence          |
| `ANCHORS_VALID`      | ERROR    | memory/*.md   | ANCHOR pairs properly opened and closed        |
| `FOLDER_NAMING`      | ERROR    | Folder path   | Folder follows ###-short-name convention       |
| `FRONTMATTER_VALID`  | WARNING  | spec/plan.md  | YAML frontmatter properly structured           |
| `COMPLEXITY_MATCH`   | WARNING  | All levels    | Content metrics match declared level           |
| `AI_PROTOCOL`        | WARNING  | Level 3/3+    | AI execution protocols present                 |
| `LEVEL_MATCH`        | ERROR    | All files     | Level consistent across all spec files         |
| `SECTION_COUNTS`     | WARNING  | All levels    | Section counts within expected ranges          |
| `PHASE_LINKS`        | WARNING  | Phased specs  | Parent-child phase references valid            |

---

<!-- /ANCHOR:rule-summary -->
<!-- ANCHOR:file-exists -->
## 3. FILE_EXISTS

**Severity:** ERROR  
**Description:** Validates that all required files exist for the detected documentation level.

### Required Files by Level

| Level | Required Files                                                 |
| ----- | -------------------------------------------------------------- |
| 1     | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`  |
| 2     | Level 1 + `checklist.md`                                       |
| 3     | Level 2 + `decision-record.md`                                 |

### Implementation Summary (All Levels)

All spec folders require an implementation summary that captures what was built:

| File                        | Created When                | Purpose                                        |
| --------------------------- | --------------------------- | ---------------------------------------------- |
| `implementation-summary.md` | End of implementation phase | Captures what was built, deviations, results   |

**Note:** This file is validated as part of the FILE_EXISTS rule. If missing for any spec folder, validation will fail with an ERROR.

### Nested Packet Changelog (Recommended for phased work)

Packet-local changelogs are not part of the required FILE_EXISTS contract, but they are recommended whenever a spec root or phase child needs a durable packet history beside `implementation-summary.md`.

| Artifact | Typical Path | Created When |
| --- | --- | --- |
| Root nested changelog | `changelog/changelog-<packet>-root.md` | End of root-packet completion |
| Phase nested changelog | `../changelog/changelog-<packet>-<phase-folder>.md` | End of phase completion |

### Examples

✅ **Pass (Level 1):**
```
specs/007-feature/
├── spec.md                   ✓
├── plan.md                   ✓
├── tasks.md                  ✓
└── implementation-summary.md ✓
```

✅ **Pass (Level 2):**
```
specs/008-complex-feature/
├── spec.md                   ✓
├── plan.md                   ✓
├── tasks.md                  ✓
├── checklist.md              ✓
└── implementation-summary.md ✓
```

❌ **Fail (Level 1 - missing core file):**
```
specs/007-feature/
├── plan.md                   ✓
├── tasks.md                  ✓
└── implementation-summary.md ✓
                              ✗ Missing: spec.md
```

❌ **Fail (Level 1 - missing implementation summary):**
```
specs/007-feature/
├── spec.md         ✓
├── plan.md         ✓
└── tasks.md        ✓
                    ✗ Missing: implementation-summary.md
```

### How to Fix

Create the missing file(s) using the appropriate template:

```bash
# Core files
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/007-feature/

# Implementation summary (required for all levels)
# Create at end of implementation phase
cp .opencode/skill/system-spec-kit/templates/implementation-summary.md specs/007-feature/
```

**Workflow:**
1. Complete implementation phase → create `implementation-summary.md`
2. Run validation to confirm all requirements are met

---

<!-- /ANCHOR:file-exists -->
<!-- ANCHOR:placeholder-filled -->
## 4. PLACEHOLDER_FILLED

**Severity:** ERROR  
**Description:** Detects unfilled template placeholders that should be replaced with actual content.

### Patterns Detected

| Pattern                      | Status  | Action Required           |
| ---------------------------- | ------- | ------------------------- |
| `<YOUR_VALUE_HERE: ...>`     | FLAGGED | Replace with actual value |
| `<NEEDS_CLARIFICATION: ...>` | FLAGGED | Resolve and replace       |
| `<OPTIONAL: ...>`            | IGNORED | Optional content          |

### Files Scanned

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md` (if exists)
- `decision-record.md` (if exists)

### Excluded Paths

- `**/scratch/**` - Scratch files are never scanned
- `**/memory/**` - Memory files use different validation (ANCHORS_VALID)
- `**/templates/**` - Template files are expected to have placeholders

### Examples

❌ **Fail:**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | [YOUR_VALUE_HERE: Feature type] |  ← FLAGGED
```

✅ **Pass:**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Feature |
```

### How to Fix

Replace placeholder text with actual content:

1. Find the flagged line in the output
2. Replace `[YOUR_VALUE_HERE: description]` with the actual value
3. Remove the entire `[...]` block, not just the inner text

---

<!-- /ANCHOR:placeholder-filled -->
<!-- ANCHOR:sections-present -->
## 5. SECTIONS_PRESENT

**Severity:** WARNING  
**Description:** Validates that required markdown sections exist in each file type.

### Required Sections

| File                | Required Sections                               |
| ------------------- | ----------------------------------------------- |
| `spec.md`           | Problem Statement, Requirements, Scope          |
| `plan.md`           | Technical Context, Architecture, Implementation |
| `checklist.md`      | P0, P1 (section headers)                        |
| `decision-record.md`| Context, Decision, Consequences                 |

### Matching Rules

- Case-insensitive matching
- Partial match (e.g., "Implementation Phases" matches "Implementation")
- Matches `##` or `###` headers

### Examples

⚠️ **Warning:**
```markdown
# My Spec

## Overview           ← Does not match "Problem Statement"
## What We Need       ← Does not match "Requirements"
## Scope Match
```

✅ **Pass:**
```markdown
# My Spec

\## 1. Problem Statement 
\## 2. Requirements 
\## 3. Scope 
```

### How to Fix

Add the missing section headers. You can use numbered prefixes:

```markdown
\## 1. Problem Statement

[Content here]

\## 2. Requirements

[Content here]
```

---

<!-- /ANCHOR:sections-present -->
<!-- ANCHOR:level-declared -->
## 6. LEVEL_DECLARED

**Severity:** INFO  
**Description:** Checks if the documentation level is explicitly declared in spec.md metadata.

### Detection Method

1. **Explicit (preferred):** Look for `| **Level** | N |` in spec.md metadata table
2. **Inferred (fallback):** Based on file presence:
   - Has `decision-record.md` → Level 3
   - Has `checklist.md` → Level 2
   - Otherwise → Level 1

### Examples

✅ **Explicit (no INFO):**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
```

⚠️ **Inferred (INFO logged):**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Feature |
                        ← No Level field, will be inferred
```

### How to Fix

Add the Level field to your spec.md metadata table:

```markdown
| **Level** | 2 |
```

---

<!-- /ANCHOR:level-declared -->
<!-- ANCHOR:priority-tags -->
## 7. PRIORITY_TAGS

**Severity:** WARNING  
**Description:** Validates that checklist items use proper P0/P1/P2 priority tagging format.

### Priority Definitions

| Priority | Meaning       | Deferral Rules                             |
| -------- | ------------- | ------------------------------------------ |
| **P0**   | HARD BLOCKER  | Must complete, cannot defer                |
| **P1**   | Must complete | Can defer only with explicit user approval |
| **P2**   | Can defer     | Can defer without approval                 |

### Recognized Formats

**Section Headers (preferred):**
```markdown
## P0 - Critical Items

- [ ] Item one
- [ ] Item two

## P1 - Required Items

- [ ] Item three
```

**Inline Tags:**
```markdown
- [ ] [P0] This is a critical item
- [ ] [P1] This must be done
- [ ] [P2] This can be deferred
```

### Context Reset Behavior

Priority tags apply to items **until the next priority header or end of file**:

```markdown
## P0 - Critical

- [ ] Item A          ← P0 (from header)
- [ ] Item B          ← P0 (from header)

## P1 - Required

- [ ] Item C          ← P1 (context reset)
- [ ] [P0] Item D     ← P0 (inline override)
- [ ] Item E          ← P1 (back to header context)
```

### Examples

✅ **Pass:**
```markdown
## P0 - Blockers

- [x] Database migration complete
- [ ] API endpoints deployed

## P1 - Required

- [ ] Documentation updated
```

⚠️ **Warning (no priority context):**
```markdown
## Tasks

- [ ] Do something      ← No priority assigned
- [ ] Do another thing  ← No priority assigned
```

### How to Fix

Add priority headers or inline tags to all checklist items:

1. Group items under `## P0`, `## P1`, `## P2` headers, OR
2. Add inline tags: `- [ ] [P1] Task description`

---

<!-- /ANCHOR:priority-tags -->
<!-- ANCHOR:evidence-cited -->
## 8. EVIDENCE_CITED

**Severity:** WARNING  
**Description:** Validates that non-P2 checklist items include evidence citations to support claims.

### Why Evidence Matters

Evidence citations:
- Prevent "works on my machine" claims
- Enable verification by reviewers
- Create audit trail for decisions
- Support future debugging

### Recognized Evidence Patterns

| Pattern              | Description              | Example                          |
| -------------------- | ------------------------ | -------------------------------- |
| `[Source: ...]`      | General source citation  | `[Source: API docs v2.1]`        |
| `[File: ...]`        | File path reference      | `[File: src/auth.ts:45-67]`      |
| `[Test: ...]`        | Test execution reference | `[Test: npm run test:auth]`      |
| `[Commit: ...]`      | Git commit reference     | `[Commit: abc1234]`              |
| `[Screenshot: ...]`  | Visual evidence          | `[Screenshot: ./evidence/login.png]` |

### Priority Exemptions

| Priority | Evidence Required | Rationale                          |
| -------- | ----------------- | ---------------------------------- |
| **P0**   | YES               | Critical items need strong proof   |
| **P1**   | YES               | Required items need verification   |
| **P2**   | NO (exempt)       | Deferrable items may be incomplete |

### Examples

✅ **Pass:**
```markdown
## P0 - Critical

- [x] Auth flow working [Test: npm run test:auth - all 12 passing]
- [x] Database migrated [Commit: abc1234]

## P1 - Required

- [x] Docs updated [File: docs/api.md]

## P2 - Optional

- [ ] Refactor utils      ← No evidence needed (P2 exempt)
```

⚠️ **Warning:**
```markdown
## P0 - Critical

- [x] Auth flow working   ← WARNING: No evidence cited
```

### Case Sensitivity

Evidence patterns are **case-insensitive**:
- `[Source: ...]` ✓
- `[source: ...]` ✓
- `[SOURCE: ...]` ✓

### How to Fix

Add evidence to non-P2 items:

```markdown
## Before
- [x] Feature implemented

## After
- [x] Feature implemented [Test: npm test - 15/15 passing]
```

---

<!-- /ANCHOR:evidence-cited -->
<!-- ANCHOR:anchors-valid -->
## 9. ANCHORS_VALID

**Severity:** ERROR  
**Description:** Validates that memory files use proper ANCHOR format with matching open/close pairs.

### What Are Anchors?

Anchors are structured markers that define semantic boundaries in memory files. They enable:
- Targeted memory retrieval
- Section-specific context loading
- Semantic search indexing

### Anchor Format

```markdown
Content goes here...
```

### Rules

1. **Every ANCHOR must have a closing /ANCHOR**
2. **Names must match exactly** (case-sensitive)
3. **No nesting** - anchors cannot contain other anchors
4. **Scope:** Only `memory/*.md` files are validated

### Examples

✅ **Pass:**
```markdown
## Project Context

This feature adds authentication...

## Key Decisions

We chose JWT because...
```

❌ **Error (unclosed anchor):**
```markdown
## Project Context

This feature adds authentication...

<!-- ANCHOR:decisions -->        ← ERROR: 'context' never closed
## Key Decisions
```

❌ **Error (mismatched names):**
```markdown
## Content
<!-- /ANCHOR:Context -->         ← ERROR: 'context' ≠ 'Context'
```

### Pair Matching Logic

The validator tracks anchor state:

```
Open "context"     → Stack: [context]
Open "decisions"   → ERROR: "context" still open
Close "context"    → Stack: []
Open "decisions"   → Stack: [decisions]
Close "decisions"  → Stack: [] ✓
```

### How to Fix

1. Find the unclosed anchor in the error message
2. Add the matching close tag: `<!-- /ANCHOR:name -->`
3. Ensure name casing matches exactly

```markdown
## Before (broken)
Content here...
(missing close tag)

## After (fixed)
Content here...
```

---

<!-- /ANCHOR:anchors-valid -->
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:folder-naming -->
## 10. FOLDER_NAMING

**Severity:** ERROR
**Description:** Validates that the spec folder follows the `###-short-name` naming convention.

### Naming Rules

| Rule              | Valid                     | Invalid                   |
| ----------------- | ------------------------- | ------------------------- |
| 3-digit prefix    | `001-`, `042-`, `999-`    | `1-`, `01-`, `1234-`      |
| Lowercase only    | `007-auth-feature`        | `007-Auth-Feature`        |
| Hyphens only      | `007-my-feature`          | `007_my_feature`          |
| No spaces         | `007-login-flow`          | `007-login flow`          |

### Examples

**Pass:**
```
specs/001-initial-setup/
specs/042-user-authentication/
specs/007-api-refactor/
```

**Fail:**
```
specs/1-setup/                  ← Missing 3-digit prefix
specs/001-User-Auth/            ← Contains uppercase
specs/001_login_flow/           ← Uses underscores
specs/feature-without-number/   ← Missing numeric prefix
```

### How to Fix

Rename the folder to follow the pattern `###-short-name`:

```bash
# From invalid
mv specs/1-setup specs/001-setup
mv specs/001_login_flow specs/001-login-flow
mv specs/Feature specs/001-feature
```

---

<!-- /ANCHOR:folder-naming -->
<!-- ANCHOR:frontmatter-valid -->
## 11. FRONTMATTER_VALID

**Severity:** WARNING
**Description:** Validates YAML frontmatter structure in markdown files and checks for template source markers.

### Validation Checks

| Check                     | Files Scanned    | Description                             |
| ------------------------- | ---------------- | --------------------------------------- |
| Frontmatter closure       | spec.md, plan.md | Opening `---` has matching closing `---`|
| Template source marker    | spec.md, plan.md | Contains `SPECKIT_TEMPLATE_SOURCE`      |

### Examples

**Pass:**
```markdown
---
title: My Feature Spec
SPECKIT_TEMPLATE_SOURCE: level_1/spec.md
---

# Content here
```

**Warning (unclosed frontmatter):**
```markdown
---
title: My Feature Spec
                          ← Missing closing ---

# Content here
```

**Warning (missing template marker):**
```markdown
---
title: My Feature Spec
---                       ← No SPECKIT_TEMPLATE_SOURCE

# Content here
```

### How to Fix

1. Ensure frontmatter has both opening and closing `---` markers
2. Use templates from `.opencode/skill/system-spec-kit/templates/` which include the source marker

```bash
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/007-feature/
```

---

<!-- /ANCHOR:frontmatter-valid -->
<!-- ANCHOR:complexity-match -->
## 12. COMPLEXITY_MATCH

**Severity:** WARNING
**Description:** Validates that declared complexity level matches actual content metrics (user stories, phases, tasks).

### Expected Ranges by Level

| Level | User Stories | Phases  | Tasks     |
| ----- | ------------ | ------- | --------- |
| 1     | 1-2          | 2-3     | 5-15      |
| 2     | 2-4          | 3-5     | 15-50     |
| 3/3+  | 4-15         | 5-12    | 50-200    |

### Detection Patterns

| Metric       | Pattern Searched                           |
| ------------ | ------------------------------------------ |
| User Stories | `### User Story` headers in spec.md        |
| Phases       | `### Phase` headers in plan.md             |
| Tasks        | `- [ ] T##` or `- [ ] TASK-` in tasks.md   |

### Examples

**Warning (under-scoped for Level 2):**
```
Declared Level: 2
Found: 1 user story, 2 phases, 8 tasks
Expected: 2-4 stories, 3-5 phases, 15-50 tasks
```

**Warning (over-scoped for Level 1):**
```
Declared Level: 1
Found: 5 user stories, 6 phases, 45 tasks
Expected: 1-2 stories, 2-3 phases, 5-15 tasks
```

### How to Fix

Either adjust the declared level or modify content to match:

1. **Upgrade level:** If content is complex, change `| **Level** | 1 |` to `| **Level** | 2 |`
2. **Reduce scope:** Split complex specs into multiple smaller specs
3. **Add content:** For sparse specs, add missing user stories, phases, or tasks

---

<!-- /ANCHOR:complexity-match -->
<!-- ANCHOR:ai-protocol -->
## 13. AI_PROTOCOL

**Severity:** WARNING
**Description:** Validates that Level 3 and 3+ specs include AI execution protocol sections for agent guidance.

### Required for Level 3+

| Component             | Location        | Purpose                           |
| --------------------- | --------------- | --------------------------------- |
| AI Execution section  | plan/tasks.md   | Main protocol header              |
| Pre-Task Checklist    | plan/tasks.md   | Steps before starting any task    |
| Execution Rules       | plan/tasks.md   | TASK-SEQ, TASK-SCOPE constraints  |
| Status Format         | plan/tasks.md   | How to report progress            |
| Blocked Protocol      | plan/tasks.md   | What to do when stuck             |

### Scoring

- Level 3: Should have protocol section (warning if missing)
- Level 3+: Must have at least 3/4 components (error if fewer)

### Detection Patterns

```markdown
## AI EXECUTION PROTOCOL         ← Main section
### Pre-Task Checklist           ← Component 1
### Execution Rules              ← Component 2
### Status Reporting Format      ← Component 3
### Blocked Task Protocol        ← Component 4
```

### Examples

**Pass (Level 3+):**
```markdown
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read relevant files
- [ ] Verify preconditions

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in order |
| TASK-SCOPE | Only modify files in scope |

### Status Reporting Format
After each task: "Task T## complete. Files modified: [list]"

### Blocked Task Protocol
If blocked: Stop, document blocker, request help
```

### How to Fix

Add the AI Execution Protocol section to plan.md or tasks.md. Reference the Level 3 templates:

```bash
# See protocol examples in templates
cat .opencode/skill/system-spec-kit/templates/level_3/plan.md
```

---

<!-- /ANCHOR:ai-protocol -->
<!-- ANCHOR:level-match -->
## 14. LEVEL_MATCH

**Severity:** ERROR
**Description:** Validates that the declared level is consistent across all spec folder files and required files exist.

### Consistency Checks

| Check                  | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| Cross-file consistency | Level in spec.md matches level in plan.md, checklist  |
| Required files         | All files required for declared level exist           |
| File presence hints    | Warns if files suggest higher level than declared     |

### Required Files by Level

| Level | Required Files                                               |
| ----- | ------------------------------------------------------------ |
| 1     | spec.md, plan.md, tasks.md                                   |
| 2     | Level 1 + checklist.md                                       |
| 3/3+  | Level 2 + decision-record.md                                 |

### Examples

**Error (missing required file):**
```
Declared: Level 2
Missing: checklist.md
```

**Error (inconsistent levels):**
```
spec.md declares: Level 2
plan.md declares: Level 1
```

**Warning (file suggests higher level):**
```
Declared: Level 1
Present: decision-record.md (suggests Level 3)
```

### How to Fix

1. **Add missing files:** Create required files for your level
2. **Fix level declarations:** Ensure all files declare the same level
3. **Upgrade level:** If you have Level 3 files, declare Level 3

```bash
# Add checklist for Level 2
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/007-feature/
```

---

<!-- /ANCHOR:level-match -->
<!-- ANCHOR:section-counts -->
## 15. SECTION_COUNTS

**Severity:** WARNING
**Description:** Validates that section counts are within expected ranges for the declared documentation level.

### Expected Minimums by Level

| Level | spec.md H2s | plan.md H2s | Requirements | Acceptance Scenarios |
| ----- | ----------- | ----------- | ------------ | -------------------- |
| 1     | 5           | 4           | 3            | 2                    |
| 2     | 8           | 6           | 5            | 4                    |
| 3/3+  | 10          | 8           | 8            | 6                    |

### Detection Patterns

| Metric               | Pattern                          |
| -------------------- | -------------------------------- |
| H2 sections          | Lines starting with `## `        |
| Requirements         | `REQ-FUNC-`, `REQ-DATA-`, `REQ-` |
| Acceptance Scenarios | `**Given**` blocks               |

### Examples

**Warning (sparse for Level 2):**
```
Level: 2
spec.md: 4 sections (expected 8)
plan.md: 3 sections (expected 6)
Requirements: 2 (expected 5)
Scenarios: 1 (expected 4)
```

### How to Fix

Either expand content or reduce declared level:

1. **Add sections:** Fill in missing spec sections (Problem Statement, Requirements, etc.)
2. **Add requirements:** Define more `REQ-FUNC-###` identifiers
3. **Add scenarios:** Write more `**Given**/**When**/**Then**` acceptance tests
4. **Reduce level:** If spec is intentionally minimal, declare Level 1

---

<!-- /ANCHOR:section-counts -->
<!-- ANCHOR:phase-links -->
## 16. PHASE_LINKS

**Severity:** WARNING
**Description:** Validates the integrity of parent-child phase relationships in phase-decomposed spec folders.

### When Active

This rule only applies when a spec folder contains numbered child folders (matching `[0-9][0-9][0-9]-*/` pattern) that represent phases. Standard (non-phased) spec folders skip this rule entirely.

### Checks Performed

| Check | Severity | Description |
|-------|----------|-------------|
| Phase Documentation Map | WARNING | Parent spec.md should contain a Phase Documentation Map section |
| Child back-reference | WARNING | Direct-child spec.md should include a metadata table with Parent Spec, Predecessor, and Successor references |
| Child folder naming | ERROR | Phase child folders must follow `###-name/` naming convention |
| Status consistency | WARNING | Phase status in parent map should match child spec.md status |

### Examples

**Pass (complete phase links):**
```
specs/042-payment-system/
├── spec.md                     # Contains Phase Documentation Map
│                                 with entries for 009, 010, and 011
├── 009-session-capturing/
├── 010-phase-links/
│   └── spec.md                 # Includes metadata table with Parent Spec,
│                               # Predecessor, and Successor links
└── 011-skill-alignment/
    └── spec.md                 # Includes metadata table with Parent Spec,
                                # Predecessor, and Successor links
```

**Warning (missing map):**
```
specs/042-payment-system/
├── spec.md                     # No Phase Documentation Map section
├── 009-session-capturing/
├── 010-phase-links/            ← WARNING: parent has no phase map
└── 011-skill-alignment/
```

**Warning (missing back-reference):**
```
specs/042-payment-system/010-phase-links/
└── spec.md                     # No metadata table with Parent Spec,
                                # Predecessor, and Successor references
                                   ← WARNING: no phase navigation back-reference
```

### How to Fix

**Add Phase Documentation Map to parent spec.md:**
```markdown
## Phase Documentation Map

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 9 | `009-session-capturing/` | done | Session capture and handoff flow |
| 10 | `010-phase-links/` | active | Phase-link validation guidance |
| 11 | `011-skill-alignment/` | draft | Skill alignment follow-up work |
```

**Add phase navigation metadata table to child spec.md:**
```markdown
| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../009-session-capturing/spec.md` |
| **Successor** | `../011-skill-alignment/spec.md` |
```

### Recursive Validation

To validate phase links across parent and all children:

```bash
./scripts/spec/validate.sh specs/042-payment-system/ --recursive
```

---

<!-- /ANCHOR:phase-links -->
<!-- ANCHOR:configuration -->
## 17. CONFIGURATION

### Environment Variables

| Variable             | Default | Description                       |
| -------------------- | ------- | --------------------------------- |
| `SPECKIT_VALIDATION` | true    | Set to `false` to skip validation |
| `SPECKIT_STRICT`     | false   | Set to `true` to fail on warnings |
| `SPECKIT_JSON`       | false   | Set to `true` for JSON output     |
| `SPECKIT_VERBOSE`    | false   | Set to `true` for verbose output  |

### Usage Examples

**Run validation on a spec folder:**
```bash
./scripts/spec/validate.sh specs/007-feature/
```

**Run in strict mode (fail on warnings):**
```bash
SPECKIT_STRICT=true ./scripts/spec/validate.sh specs/007-feature/
```

**Get JSON output for automation:**
```bash
SPECKIT_JSON=true ./scripts/spec/validate.sh specs/007-feature/
```

---

<!-- /ANCHOR:configuration -->
<!-- ANCHOR:related-resources -->
## 18. RELATED RESOURCES

### Reference Files

- [level_specifications.md](../templates/level_specifications.md) - Documentation level requirements
- [template_guide.md](../templates/template_guide.md) - Template usage guide
- [path_scoped_rules.md](../validation/path_scoped_rules.md) - Path scoping overview
- [phase_definitions.md](../structure/phase_definitions.md) - Phase decomposition system

### Scripts

- `../../scripts/spec/validate.sh` - Main validation script
- `../../scripts/rules/` - Individual rule implementations
<!-- /ANCHOR:related-resources -->
