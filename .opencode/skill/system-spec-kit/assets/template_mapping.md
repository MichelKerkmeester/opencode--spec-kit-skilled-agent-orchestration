---
title: Template Mapping
description: Complete mapping of documentation levels to templates with copy commands.
---

# Template Mapping - Level to File Assignments

Maps documentation levels to required templates with ready-to-use copy commands.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This asset provides the definitive source for which templates are required at each documentation level. Use it to ensure spec folders contain all mandatory files before claiming completion.

For cross-phase campaigns, keep one template set per owning phase folder rather than trying to share one spec packet across unrelated branches. Shared-memory or multi-runtime sweeps can share research inputs, but each implementation or truth-reconciliation branch should still resolve to an explicit parent phase for template ownership.

### Usage

1. Determine your documentation level (1, 2, 3, or 3+)
2. Copy the required templates using the provided bash commands
3. Follow the step-by-step template usage guide for proper folder setup
4. Verify all placeholders are filled before proceeding
5. When work spans multiple phases or shared spaces, create or update the template set inside the owning phase folder and reference the sibling branches explicitly

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:template-location -->
## 2. TEMPLATE LOCATION

### Directory Structure

```text
templates/
├── core/                    # Source components (DO NOT USE DIRECTLY)
├── addendum/                # Level additions (DO NOT USE DIRECTLY)
├── level_1/                 # Composed Level 1 (ready to use)
├── level_2/                 # Composed Level 2 (ready to use)
├── level_3/                 # Composed Level 3 (ready to use)
└── level_3+/                # Composed Level 3+ (ready to use)
```

### Path Conventions

| Path | Purpose | When to Use |
|------|---------|-------------|
| `templates/level_N/` | Ready-to-use composed templates | **ALWAYS use this for new specs** |
| `templates/core/` | Source components | Reference only (compose script uses these) |
| `templates/addendum/` | Level-specific additions | Reference only (compose script uses these) |

**Primary Path:** `.opencode/skill/system-spec-kit/templates/level_N/` (where N is 1, 2, 3, or 3+)

**Critical Rule:** ALWAYS copy templates from `level_N/` directories - NEVER create documentation files from scratch.

### Compose Script

The compose script generates level-specific templates from core + addendum components:

```bash
# Location
.opencode/skill/system-spec-kit/scripts/templates/compose.sh

# Usage
compose.sh [OPTIONS] [LEVELS...]

# Examples
compose.sh                    # Compose all levels
compose.sh 2 3                # Compose only Level 2 and 3
compose.sh --dry-run          # Preview changes
compose.sh --verify           # Check if templates are current
```

**Composition Rules:**
- Level 1: Core only
- Level 2: Core + level2-verify addendum
- Level 3: Core + level2-verify + level3-arch addendums
- Level 3+: Core + all addendums

---

<!-- /ANCHOR:template-location -->
<!-- ANCHOR:required-templates-by-level-progressive-enhancement -->
## 3. REQUIRED TEMPLATES BY LEVEL (Progressive Enhancement)

```text
Level 1 (Baseline):     spec.md + plan.md + tasks.md + implementation-summary.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research/research.md
                              ↓
Level 3+ (Extended):    Level 3 + AI protocols + extended checklist + sign-offs
```

| Level               | Required Files                     | Adds To Previous        | Copy Commands              |
| ------------------- | ---------------------------------- | ----------------------- | -------------------------- |
| **1: Baseline**     | `spec.md` + `plan.md` + `tasks.md` + `implementation-summary.md` | (foundation)            | See Level 1 commands below |
| **2: Verification** | Level 1 + `checklist.md`           | QA checklist            | See Level 2 commands below |
| **3: Full**         | Level 2 + `decision-record.md`     | ADR + optional research | See Level 3 commands below |
| **3+: Extended**    | Level 3 + AI protocols + extended checklist + sign-offs | Governance + orchestration | See Level 3+ commands below |

**Level 1 Copy Commands (Baseline):**
```bash
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md ###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-name/implementation-summary.md
```

**Level 2 Copy Commands (complete set):**
```bash
cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_2/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_2/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/###-name/checklist.md
```

**Level 3 Copy Commands (complete set):**
```bash
cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-name/decision-record.md
# Optional:
mkdir -p specs/###-name/research && cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research/research.md
```

**Level 3+ Copy Commands (complete set):**
```bash
cp .opencode/skill/system-spec-kit/templates/level_3+/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3+/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3+/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3+/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3+/decision-record.md specs/###-name/decision-record.md
# Optional:
mkdir -p specs/###-name/research && cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research/research.md
```

---

<!-- /ANCHOR:required-templates-by-level-progressive-enhancement -->
<!-- ANCHOR:optional-templates-level-3-only -->
## 4. OPTIONAL TEMPLATES (Level 3 Only)

These templates are OPTIONAL and only apply to Level 3 documentation:

| Template File | Copy As       | When to Use                          | Copy Command                                                                          |
| ------------- | ------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `research/research.md` | `research/research.md` | Comprehensive research documentation | `mkdir -p specs/###-name/research && cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research/research.md` |

**Notes:**
- These are OPTIONAL - only copy when research is needed
- `decision-record.md` is REQUIRED at Level 3, not optional
- Topic-specific ADR files can be added as supplemental artifacts, but the required canonical file is always `decision-record.md`

---

<!-- /ANCHOR:optional-templates-level-3-only -->
<!-- ANCHOR:folder-structure-by-level-progressive-enhancement -->
## 5. FOLDER STRUCTURE BY LEVEL (Progressive Enhancement)

### Level 1: Baseline Documentation

```text
specs/043-add-email-validation/
├── spec.md                      (REQUIRED - from spec.md)
├── plan.md                      (REQUIRED - from plan.md)
├── tasks.md                     (REQUIRED - from tasks.md)
├── implementation-summary.md    (REQUIRED - from implementation-summary.md)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Content expectations:**
- **spec.md**: Problem statement, requirements, success criteria
- **plan.md**: Implementation approach, file changes, testing strategy
- **tasks.md**: Task breakdown by user story, ordered by dependencies

**Enforcement:** Hard block if any required file missing

---

### Level 2: Verification Added

```text
specs/044-modal-component/
├── spec.md                      (REQUIRED - from Level 1)
├── plan.md                      (REQUIRED - from Level 1)
├── tasks.md                     (REQUIRED - from Level 1)
├── implementation-summary.md    (REQUIRED - from Level 1)
├── checklist.md                 (REQUIRED - adds QA validation)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Additional expectations:**
- **checklist.md**: Pre-implementation checks, implementation validation, testing checklist, deployment verification

**Enforcement:** Hard block if `checklist.md` missing

---

### Level 3: Full Documentation

```text
specs/045-user-dashboard/
├── spec.md                      (REQUIRED - from Level 2)
├── plan.md                      (REQUIRED - from Level 2)
├── tasks.md                     (REQUIRED - from Level 2)
├── implementation-summary.md    (REQUIRED - from Level 2)
├── checklist.md                 (REQUIRED - from Level 2)
├── decision-record.md           (REQUIRED - architecture decisions)
├── research/research.md                  (OPTIONAL - comprehensive research)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Additional expectations:**
- **decision-record.md**: Context, options considered, decision made, rationale, consequences

**Enforcement:** Hard block if `decision-record.md` missing

---

### Level 3+: Extended Documentation

```text
specs/046-enterprise-migration/
├── spec.md                      (REQUIRED - from Level 3, +approval workflow, +compliance, +stakeholders)
├── plan.md                      (REQUIRED - from Level 3, +AI execution framework, +workstream coordination)
├── tasks.md                     (REQUIRED - from Level 3, +3-tier format, +AI protocol, +workstreams)
├── implementation-summary.md    (REQUIRED - from Level 3)
├── checklist.md                 (REQUIRED - from Level 3, +extended items 100-150, +sign-offs, +compliance)
├── decision-record.md           (REQUIRED - from Level 3, +decision authority, +review requirements)
├── research/research.md                  (OPTIONAL - comprehensive research)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Additional expectations:**
- **Extended checklist**: 100-150 items with P0/P1/P2 prioritization and sign-off tracking
- **AI execution framework**: Pre-task checklists, execution rules, status tracking for multi-agent work
- **Approval workflow**: Stakeholder matrix with sign-off tracking and compliance checkpoints

**Enforcement:** Hard block if any required file missing. All Level 3+ templates include `SPECKIT_LEVEL: 3+` frontmatter.

---

<!-- /ANCHOR:folder-structure-by-level-progressive-enhancement -->
<!-- ANCHOR:template-structure-requirements -->
## 6. TEMPLATE STRUCTURE REQUIREMENTS

All templates follow consistent structure:

### 1. Numbered H2 Sections

**Format:** `## N. EMOJI TITLE`

**Example:** `## 3. 🛠️ IMPLEMENTATION`

**Rules:**
- Keep numbering sequential
- Never remove emojis (visual scanning pattern)
- Maintain consistent formatting

### 2. Metadata Block

First section sets expectations:

**Level 1:** Metadata + Complexity + Success Criteria

**Level 2/3:** Category, Tags, Priority, Status

### 3. Placeholder Conventions

- `[PLACEHOLDER]` - Must be replaced with actual content
- `[NEEDS CLARIFICATION: ...]` - Unknown requirement (flag for user)
- `<!-- SAMPLE CONTENT -->` - Remove before delivery

### 4. Template Footer

Accountability reminder (remove after filling):

```html
<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
```

### 5. Memory File Anchors

Memory files in `memory/` folders MUST use paired anchors for semantic indexing:

**Required Format:**
```markdown
Content that will be indexed...
```

**Rules:**
- Every opening `<!-- ANCHOR:name -->` MUST have a closing `<!-- /ANCHOR:name -->`
- Anchor names must match exactly (case-sensitive)
- Content between anchors is indexed for semantic search
- Orphaned anchors (missing pair) will cause validation errors

**Common Anchor Names:**
- `summary` - Executive summary of the memory
- `decisions` - Key decisions made
- `blockers` - Current blockers or issues
- `next-steps` - Planned next actions
- `context` - Background context

**Generation:** Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/` to auto-generate properly formatted memory files.

---

<!-- /ANCHOR:template-structure-requirements -->
<!-- ANCHOR:template-adherence-rules -->
## 7. TEMPLATE ADHERENCE RULES

**Non-negotiable rules:**

1. **Always copy from `.opencode/skill/system-spec-kit/templates/`** - Never freehand documentation
2. **Preserve numbering and emojis** - Maintain visual scanning pattern
3. **Fill every placeholder** - Replace `[PLACEHOLDER]` with actual content
4. **Remove instructional comments** - Delete `<!-- SAMPLE -->` blocks
5. **Use canonical required filenames** - `decision-record.md` is required; topic-specific ADR files are supplemental artifacts, not replacements
6. **Keep sections relevant** - State "N/A" instead of deleting sections
7. **Link sibling documents** - Cross-reference spec.md ↔ plan.md ↔ tasks.md
8. **Document level changes** - Note upgrades/downgrades in changelog
9. **Keep history immutable** - Append to history, don't rewrite
10. **Validate before coding** - Complete pre-implementation checklist first
11. **Organize by priority** - Use P0/P1/P2 priority markers in checklists (P0=blocker, P1=must-do, P2=can-defer)
12. **Cite evidence** - Mark completed items with verification evidence (e.g., `[x] Item - verified via grep/test output`)

---

<!-- /ANCHOR:template-adherence-rules -->
<!-- ANCHOR:step-by-step-template-usage-progressive-enhancement -->
## 8. STEP-BY-STEP TEMPLATE USAGE (Progressive Enhancement)

### Step 1: Determine Level
Use LOC as soft guidance + complexity/risk factors

### Step 2: Find Next Number
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```
Add 1 to get next number.

### Step 3: Create Folder
```bash
mkdir -p specs/###-short-name/
```

### Step 4: Copy Required Templates (Complete Sets)

**Level 1 (Baseline) - ALL features start here:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-name/implementation-summary.md
```

**Level 2 (Verification) - Complete set:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_2/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_2/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/###-name/checklist.md
```

**Level 3 (Full) - Complete set:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-name/decision-record.md
```

**Level 3+ (Extended) - Complete set:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_3+/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3+/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3+/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3+/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3+/decision-record.md specs/###-name/decision-record.md
```

### Step 5: Copy Optional Templates (Level 3/3+ - If Needed)

```bash
# Comprehensive Research
mkdir -p specs/###-name/research && cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research/research.md
```

### Step 6: Fill Templates
- Replace ALL `[PLACEHOLDER]` text
- Remove sample/example sections
- Adapt to specific feature
- Remove instructional comments

### Step 7: Present to User
- Show level chosen
- Show folder path
- Show which templates used (required vs optional)
- Explain approach

### Step 8: Wait for Approval
Get explicit "yes/go ahead/proceed" before ANY file changes.

**Enforcement:** Verify required templates exist before claiming completion for the chosen level.

---

<!-- /ANCHOR:step-by-step-template-usage-progressive-enhancement -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Asset Files
- [parallel_dispatch_config.md](./parallel_dispatch_config.md) - Complexity scoring and agent dispatch
- [level_decision_matrix.md](./level_decision_matrix.md) - Level selection decision matrix

### Reference Files
- [template_guide.md](../references/templates/template_guide.md) - Template selection, adaptation, and quality standards
- [level_specifications.md](../references/templates/level_specifications.md) - Complete Level 1-3 requirements
- [quick_reference.md](../references/workflows/quick_reference.md) - Commands, checklists, and troubleshooting

### Scripts
- [compose.sh](../scripts/templates/compose.sh) - Template composition script

### Templates (Organized by Level)

**Level 1 Templates (Baseline):**
- [spec.md](../templates/level_1/spec.md) - Requirements and user stories template
- [plan.md](../templates/level_1/plan.md) - Technical implementation plan template
- [tasks.md](../templates/level_1/tasks.md) - Task breakdown template
- [implementation-summary.md](../templates/level_1/implementation-summary.md) - Completion summary template

**Level 2 Templates (Verification):**
- [spec.md](../templates/level_2/spec.md) - Requirements template with extended sections
- [plan.md](../templates/level_2/plan.md) - Implementation plan with verification
- [tasks.md](../templates/level_2/tasks.md) - Task breakdown template
- [implementation-summary.md](../templates/level_2/implementation-summary.md) - Completion summary template
- [checklist.md](../templates/level_2/checklist.md) - Validation checklist template

**Level 3 Templates (Full Documentation):**
- [spec.md](../templates/level_3/spec.md) - Comprehensive requirements template
- [plan.md](../templates/level_3/plan.md) - Full implementation plan template
- [tasks.md](../templates/level_3/tasks.md) - Detailed task breakdown template
- [implementation-summary.md](../templates/level_3/implementation-summary.md) - Completion summary template
- [checklist.md](../templates/level_3/checklist.md) - Full validation checklist template
- [decision-record.md](../templates/level_3/decision-record.md) - Architecture Decision Records template

**Level 3+ Templates (Extended/Enterprise):**
- [spec.md](../templates/level_3+/spec.md) - Requirements with approval workflow and compliance checkpoints
- [plan.md](../templates/level_3+/plan.md) - Implementation plan with AI execution framework and workstream coordination
- [tasks.md](../templates/level_3+/tasks.md) - Task breakdown with 3-tier format and AI execution protocol
- [implementation-summary.md](../templates/level_3+/implementation-summary.md) - Completion summary template
- [checklist.md](../templates/level_3+/checklist.md) - Extended checklist (100-150 items) with sign-offs and compliance
- [decision-record.md](../templates/level_3+/decision-record.md) - Decision records with authority and review requirements

**Optional Templates:**
- [research template](../templates/research.md) - Copy to `research/research.md` for Level 3 research packets

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `sk-doc` - Document quality and skill creation
<!-- /ANCHOR:related-resources -->
