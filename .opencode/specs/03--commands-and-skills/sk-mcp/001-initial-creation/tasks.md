---
title: "Tasks: Figma MCP Install Guide & Skill Creation [001-initial-creation/tasks]"
description: "Priority: P0 | Estimate: 15 min | Status: Pending"
trigger_phrases:
  - "tasks"
  - "figma"
  - "mcp"
  - "install"
  - "guide"
  - "013"
  - "initial"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks: Figma MCP Install Guide & Skill Creation

> **Spec:** [spec.md](./spec.md) | **Plan:** [plan.md](./plan.md) | **Checklist:** [checklist.md](./checklist.md)

---

<!-- ANCHOR:notation -->
## Phase 1: Install Guide

### Task 1.1: Create Install Guide File
**Priority:** P0 | **Estimate:** 15 min | **Status:** Pending

**Description:**
Create the main install guide file with complete 11-section structure.

**File:** `.opencode/install_guides/MCP/MCP - Figma.md`

**Acceptance Criteria:**
- [ ] H1 title with 2-4 sentence description
- [ ] AI Install Guide section (Section 0)
- [ ] Table of Contents with anchor links
- [ ] All 11 sections (0-10) present
- [ ] Horizontal rules between sections

**Dependencies:** None

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
### Task 1.2: Write Prerequisites Section
**Priority:** P0 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Document prerequisites including Node.js, Figma PAT, and Code Mode.

**Content:**
- Node.js 18+ requirement
- Figma Personal Access Token generation (brief + link)
- Code Mode MCP configured
- Validation checkpoint: `phase_1_complete`

**Acceptance Criteria:**
- [ ] Version requirements specified
- [ ] Token generation steps included
- [ ] Verification commands provided
- [ ] STOP condition present

**Dependencies:** Task 1.1

---

### Task 1.3: Write Installation & Configuration Sections
**Priority:** P0 | **Estimate:** 15 min | **Status:** Pending

**Description:**
Document .utcp_config.json setup and platform configurations.

**Content:**
- .utcp_config.json entry for Figma
- .env file setup for token
- OpenCode configuration
- Claude Code configuration
- Claude Desktop configuration
- Validation checkpoints: `phase_2_complete`, `phase_3_complete`

**Acceptance Criteria:**
- [ ] JSON configs are valid and copy-pasteable
- [ ] All 3 platforms documented
- [ ] Security warning about tokens
- [ ] STOP conditions present

**Dependencies:** Task 1.1

---

### Task 1.4: Write Verification Section
**Priority:** P0 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Document how to verify Figma MCP is working.

**Content:**
- Tool discovery via `search_tools()`
- List tools via `list_tools()`
- Test call to `figma.figma_get_file`
- Success criteria: `phase_4_complete`

**Acceptance Criteria:**
- [ ] Step-by-step verification
- [ ] Expected output shown
- [ ] Success criteria checklist
- [ ] STOP condition present

**Dependencies:** Task 1.3

---

### Task 1.5: Write Usage Section
**Priority:** P0 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Document the naming pattern and basic workflow.

**Content:**
- Critical naming pattern: `figma.figma_{tool_name}`
- Common mistakes table
- Basic workflow (discover → info → call)
- Code Mode invocation pattern

**Acceptance Criteria:**
- [ ] Naming pattern emphasized
- [ ] Wrong vs correct examples
- [ ] Workflow steps clear

**Dependencies:** Task 1.1

---

### Task 1.6: Write Features Section (18 Tools)
**Priority:** P0 | **Estimate:** 20 min | **Status:** Pending

**Description:**
Document all 18 Figma tools with parameters and descriptions.

**Content:**
- File Management tools (4)
- Image tools (2)
- Comment tools (3)
- Team & Project tools (2)
- Component tools (4)
- Style tools (3)

**Acceptance Criteria:**
- [ ] All 18 tools documented
- [ ] Parameters listed for each
- [ ] Brief description for each
- [ ] Organized by category

**Dependencies:** Task 1.1

---

### Task 1.7: Write Examples Section
**Priority:** P1 | **Estimate:** 20 min | **Status:** Pending

**Description:**
Create 5-6 practical example scenarios.

**Examples:**
1. Get design file structure
2. Export component as PNG
3. Get design system components
4. Add review comment
5. Multi-tool workflow (file → components → images)
6. Get file styles

**Acceptance Criteria:**
- [ ] 5+ examples present
- [ ] Code blocks have language tags
- [ ] Examples are copy-pasteable
- [ ] Progress from simple to complex

**Dependencies:** Task 1.6

---

### Task 1.8: Write Troubleshooting Section
**Priority:** P1 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Document common errors and fixes.

**Errors to Cover:**
- Tool not found (naming pattern)
- Authentication failed (token)
- File not found (fileKey)
- Rate limiting
- Timeout errors

**Acceptance Criteria:**
- [ ] 5+ errors documented
- [ ] Error → Cause → Fix format
- [ ] Actionable fixes provided

**Dependencies:** Task 1.1

---

### Task 1.9: Write Resources Section
**Priority:** P1 | **Estimate:** 5 min | **Status:** Pending

**Description:**
Document file locations, links, and references.

**Content:**
- Configuration file paths
- Figma API documentation link
- mcp-figma package link
- Related skill references

**Acceptance Criteria:**
- [ ] All paths accurate
- [ ] Links working
- [ ] Cross-references to skill

**Dependencies:** Task 1.1

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Skill Structure

### Task 2.1: Create Skill Folder Structure
**Priority:** P0 | **Estimate:** 5 min | **Status:** Pending

**Description:**
Create the folder structure for mcp-figma skill.

**Structure:**
```
.opencode/skill/mcp-figma/
├── references/
└── assets/
```

**Acceptance Criteria:**
- [ ] Folder created at correct path
- [ ] references/ subfolder exists
- [ ] assets/ subfolder exists

**Dependencies:** None

---

### Task 2.2: Write SKILL.md
**Priority:** P0 | **Estimate:** 25 min | **Status:** Pending

**Description:**
Create main skill file following mcp-narsil pattern.

**Sections:**
1. Frontmatter (name, description, allowed-tools, version)
2. Keywords comment
3. Overview (when to use, use cases)
4. Smart Routing
5. How It Works
6. Rules (ALWAYS/NEVER/ESCALATE)
7. Success Criteria
8. Integration Points
9. Related Resources

**Acceptance Criteria:**
- [ ] Valid YAML frontmatter
- [ ] Keywords for discoverability
- [ ] All 7 sections present
- [ ] Pattern matches mcp-narsil

**Dependencies:** Task 2.1

---

### Task 2.3: Write tool_reference.md
**Priority:** P0 | **Estimate:** 20 min | **Status:** Pending

**Description:**
Create complete tool reference with all 18 tools.

**File:** `.opencode/skill/mcp-figma/references/tool_reference.md`

**Content:**
- Overview with tool count
- HIGH priority tools (5)
- MEDIUM priority tools (7)
- LOW priority tools (6)
- Tool selection decision tree

**Acceptance Criteria:**
- [ ] All 18 tools documented
- [ ] TypeScript interfaces included
- [ ] Priority classification applied
- [ ] Examples for key tools

**Dependencies:** Task 2.1

---

### Task 2.4: Write quick_start.md
**Priority:** P1 | **Estimate:** 15 min | **Status:** Pending

**Description:**
Create 5-minute getting started guide.

**File:** `.opencode/skill/mcp-figma/references/quick_start.md`

**Content:**
- Prerequisites check
- First commands (3-4 examples)
- Common workflows
- Troubleshooting quick fixes

**Acceptance Criteria:**
- [ ] Achievable in 5 minutes
- [ ] Copy-paste commands
- [ ] Expected output shown
- [ ] Links to full reference

**Dependencies:** Task 2.1

---

### Task 2.5: Write tool_categories.md
**Priority:** P1 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Create priority classification asset.

**File:** `.opencode/skill/mcp-figma/assets/tool_categories.md`

**Content:**
- Priority definitions
- HIGH priority tools (5)
- MEDIUM priority tools (7)
- LOW priority tools (6)
- Summary statistics

**Acceptance Criteria:**
- [ ] All 18 tools classified
- [ ] Rationale for each priority
- [ ] Summary table

**Dependencies:** Task 2.1

---

### Task 2.6: Write README.md
**Priority:** P1 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Create GitHub-visible overview.

**File:** `.opencode/skill/mcp-figma/README.md`

**Content:**
- Brief description
- Tool count and categories
- Quick start snippet
- Links to SKILL.md and references

**Acceptance Criteria:**
- [ ] Concise overview
- [ ] Links to detailed docs
- [ ] Installation reference

**Dependencies:** Task 2.2

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Validation

### Task 3.1: Run DQI Validation on Install Guide
**Priority:** P1 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Validate install guide meets DQI standards.

**Command:**
```bash
python3 .opencode/skill/sk-doc/scripts/extract_structure.py \
  ".opencode/install_guides/MCP/MCP - Figma.md"
```

**Acceptance Criteria:**
- [ ] DQI score ≥90 (Excellent)
- [ ] All checklist items pass
- [ ] No structural issues

**Dependencies:** Tasks 1.1-1.9

---

### Task 3.2: Validate SKILL.md Frontmatter
**Priority:** P1 | **Estimate:** 5 min | **Status:** Pending

**Description:**
Verify SKILL.md frontmatter parses correctly.

**Command:**
```bash
python3 -c "import yaml; yaml.safe_load(open('.opencode/skill/mcp-figma/SKILL.md').read().split('---')[1])"
```

**Acceptance Criteria:**
- [ ] YAML parses without errors
- [ ] Required fields present (name, description, allowed-tools, version)

**Dependencies:** Task 2.2

---

### Task 3.3: Test Skill Advisor Discovery
**Priority:** P1 | **Estimate:** 5 min | **Status:** Pending

**Description:**
Verify skill is discoverable by skill advisor.

**Command:**
```bash
python3 .opencode/scripts/skill_advisor.py "figma design components"
```

**Acceptance Criteria:**
- [ ] mcp-figma appears in results
- [ ] Confidence score reasonable

**Dependencies:** Task 2.2

---

### Task 3.4: Test Code Mode Examples
**Priority:** P1 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Verify at least one example works via Code Mode.

**Test:**
```typescript
call_tool_chain({
  code: `
    const tools = await list_tools();
    const figmaTools = tools.tools.filter(t => t.includes('figma'));
    console.log('Figma tools found:', figmaTools.length);
    return figmaTools;
  `
});
```

**Acceptance Criteria:**
- [ ] Tool discovery works
- [ ] Returns 18 Figma tools
- [ ] No errors

**Dependencies:** Tasks 1.7, 2.2

---

### Task 3.5: Update Checklist with Evidence
**Priority:** P0 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Mark checklist items complete with evidence.

**Acceptance Criteria:**
- [ ] All P0 items marked complete
- [ ] All P1 items marked complete or deferred
- [ ] Evidence provided for key items

**Dependencies:** Tasks 3.1-3.4

---

### Task 3.6: Create Implementation Summary
**Priority:** P0 | **Estimate:** 10 min | **Status:** Pending

**Description:**
Create implementation-summary.md documenting what was done.

**File:** `.opencode/specs/03--commands-and-skills/sk-mcp/001-initial-creation/implementation-summary.md`

**Content:**
- Files created
- Key decisions made
- Validation results
- Known limitations

**Acceptance Criteria:**
- [ ] All deliverables listed
- [ ] Validation results included
- [ ] Any deferred items noted

**Dependencies:** Tasks 3.1-3.5

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Task Summary

| Phase | Tasks | P0 | P1 | Total Est. |
|-------|-------|----|----|------------|
| Phase 1: Install Guide | 9 | 6 | 3 | 115 min |
| Phase 2: Skill Structure | 6 | 3 | 3 | 85 min |
| Phase 3: Validation | 6 | 2 | 4 | 50 min |
| **Total** | **21** | **11** | **10** | **~4 hours** |

<!-- /ANCHOR:completion -->

---

## Execution Order

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 1.8 → 1.9
                                                   ↓
2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 ──────────────────┤
                                                   ↓
                              3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6
```

**Critical Path:** 1.1 → 1.6 → 2.2 → 3.1 → 3.5 → 3.6
