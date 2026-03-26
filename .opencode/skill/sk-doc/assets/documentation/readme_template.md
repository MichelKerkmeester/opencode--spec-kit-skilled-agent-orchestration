---
title: README Creation - Templates and Standards
description: Templates for creating comprehensive, AI-optimized README files with consistent structure and progressive disclosure.
---

# README Creation - Templates and Standards

Templates for creating README files with scannable structure and progressive disclosure.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Purpose**: README files are the entry point to any project, component, or feature. They answer "What is this?" and "How do I use it?" in a scannable, progressive format.

**Key Characteristics**:
- **Entry point**: First document users encounter
- **Scannable**: Designed for quick evaluation, not linear reading
- **Progressive disclosure**: Quick Start first, details later
- **Self-contained**: Can be understood without reading other docs
- **Multi-audience**: Serves evaluators, users and troubleshooters

**Location**: Project root (`README.md`) or component/feature directories

**Core Philosophy**: "Help users succeed in under 2 minutes, then provide depth for those who need it."

A good README lets someone:
1. Understand what this is (10 seconds)
2. Decide if it's relevant (30 seconds)
3. Get it working (2 minutes)
4. Find advanced details (when needed)

**Benefits**:
- Reduces "what is this?" questions
- Enables self-service onboarding
- AI assistants can parse and extract information reliably
- Consistent experience across all project documentation

### How READMEs Compare to Other Documents

| Aspect | README | Install Guide | SKILL.md |
|--------|--------|---------------|----------|
| **Primary purpose** | Orientation + navigation | Step-by-step setup | AI agent instructions |
| **Reading pattern** | Scanned, non-linear | Sequential, phased | Referenced during execution |
| **Key metric** | Time to understand | Time to working install | Agent task success rate |
| **Primary audience** | Humans evaluating/using | Humans installing | AI agents executing |
| **Tone** | Welcoming, explanatory | Precise, imperative | Instructional, rule-based |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-readmes -->
## 2. WHEN TO CREATE READMEs

**Create READMEs when**:
- Starting a new project (root-level README is mandatory)
- Creating a reusable component or module
- Building a user-facing feature that needs documentation
- Supplementing a SKILL.md with user-oriented context
- Any directory that someone might "land in" and need orientation

**Keep minimal when**:
- Simple utility scripts (inline comments may suffice)
- Internal implementation details (code comments better)
- Content already well-documented elsewhere (link instead)
- Temporary or experimental code



**Decision Tree**:
```
Is this a project root?
├─ YES → Create comprehensive README (all sections)
└─ NO → Is this a reusable component?
        ├─ YES → Create component README (Overview, Quick Start, Usage, Troubleshooting)
        └─ NO → Is someone likely to "land here"?
                ├─ YES → Create minimal README (Overview, Quick Start)
                └─ NO → Skip README, use inline comments
```

---

<!-- /ANCHOR:when-to-create-readmes -->
<!-- ANCHOR:readme-types -->
## 3. README TYPES

| Type | Purpose | Location | Audience | Voice | Key Focus |
|------|---------|----------|----------|-------|-----------|
| **Project** | Root-level documentation for the entire project | `/README.md` | New contributors, evaluators, users | Two-tier (narrative + reference) | What is this project? How do I get started? |
| **Skill** | Supplementary documentation for an AI skill | `.opencode/skill/[skill-name]/README.md` | Humans who want to understand the skill | Two-tier (narrative + reference) | What does this skill do? When should I use it? |
| **Feature** | Documentation for a specific feature or system | `/docs/features/[feature]/README.md` | Developers implementing or maintaining | Two-tier (narrative + reference) | How does this feature work? How do I configure it? |
| **Component** | Documentation for a reusable module or library | `/src/components/[component]/README.md` | Developers using the component | Technical (reference only) | What does this do? API surface, options, examples |
| **Code Folder** | Orientation for a code directory | `[code-dir]/README.md` | Developers reading or modifying code | Technical (reference only) | Module purpose, exports, dependencies, architecture |

### Section Requirements by Type

| Section | Project | Skill | Feature | Component | Code Folder |
|---------|---------|-------|---------|-----------|-------------|
| 1. Overview | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| 2. Quick Start | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| 3. Features | ⚠️ Optional | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| 4. Structure | ✅ Required | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional | ✅ Required |
| 5. Configuration | ⚠️ Optional | ⚠️ Optional | ✅ Required | ⚠️ Optional | ❌ Skip |
| 6. Usage Examples | ⚠️ Optional | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| 7. Troubleshooting | ✅ Required | ✅ Required | ✅ Required | ✅ Required | ❌ Skip |
| 8. FAQ | ⚠️ Optional | ✅ Required | ⚠️ Optional | ⚠️ Optional | ❌ Skip |
| 9. Related Documents | ✅ Required | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional | ⚠️ Optional |

### Voice by Type

**Two-tier voice** (narrative + reference) applies to **Project, Skill and Feature** READMEs. These serve mixed audiences (newcomers through experts) and benefit from analogies in explanations alongside precise reference tables.

**Technical voice** (reference only) applies to **Component and Code Folder** READMEs. These serve developers who are already in the codebase. Use direct technical language: module purpose, exports, dependencies, architecture notes. No analogies needed. Keep it terse and precise.

---

<!-- /ANCHOR:readme-types -->
<!-- ANCHOR:standard-readme-structure -->
## 4. STANDARD README STRUCTURE

Every README follows a 9-section structure. Use what's needed, remove what's not.

| # | Section | Purpose | Key Content |
|---|---------|---------|-------------|
| 1 | **Overview** | Establish context | What is this, statistics, features, requirements |
| 2 | **Quick Start** | Enable fast success | 30-second setup, verification, first use |
| 3 | **Features** | Document capabilities | Feature groups, options, comparisons |
| 4 | **Structure** | Aid navigation | Directory tree, key files table |
| 5 | **Configuration** | Reference settings | Config files, options, env vars |
| 6 | **Usage Examples** | Show patterns | 3+ examples, common patterns table |
| 7 | **Troubleshooting** | Enable self-service | Common issues, quick fixes, diagnostics |
| 8 | **FAQ** | Answer common questions | Q&A format, general + technical |
| 9 | **Related Documents** | Guide to more info | Internal docs, external resources |



---

<!-- /ANCHOR:standard-readme-structure -->
<!-- ANCHOR:section-deep-dives -->
## 5. SECTION DEEP DIVES

> See §14 Complete Template for the copy-paste scaffold.

**Universal Writing Tips**:
- Test every command before documenting
- Show expected output for verification
- Use tables for scannable data
- Order content by frequency (most common first)

### Overview Section (1)

**Purpose**: Establish what this is, why it exists, and key metrics at a glance.

**Must include**:
- Brief description (2-3 sentences, plain language, lead with what it does for the user)
- Key statistics table (if metrics exist)
- "How This Compares" table (what you get vs. the alternative without this project)
- Key features table (3-8 items)
- Requirements/prerequisites

**Writing Tips**:
- Lead with the user's problem, then how this solves it ("Your AI assistant has amnesia. This server fixes that.")
- Keep descriptions action-oriented ("enables X" not "is designed for X")
- Statistics build credibility. Include if available.
- The comparison table is the single most persuasive element. Show concrete differences, not marketing claims.

### Additional Overview Patterns

These patterns appear in mature project READMEs:

**Badge Shields**: Display project status badges above the H1 title using a left-aligned wrapper:
```markdown
<div align="left">

[![Stars](https://img.shields.io/github/stars/org/repo)](https://github.com/org/repo)
[![License](https://img.shields.io/github/license/org/repo)](./LICENSE)

</div>
```

**Architecture Diagrams**: Use ASCII box diagrams to show system connections (beyond directory trees):
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Server  │────▶│ Database │
└──────────┘     └────┬─────┘     └──────────┘
                      │
                 ┌────▼─────┐
                 │  Cache   │
                 └──────────┘
```

**Innovation/Differentiator Tables**: Showcase what makes the project unique:
```markdown
| Innovation | Impact | Description |
|------------|--------|-------------|
| **[Name]** | [Metric] | [What it does differently] |
```

**Before/After Comparisons**: Persuasive two-column layout for positioning:
```markdown
| Without [PROJECT] | With [PROJECT] |
|--------------------|----------------|
| Manual config for each file | Zero-config with smart defaults |
| Errors discovered in production | Caught at build time |
| 30-minute onboarding | 2-minute Quick Start |
```

### Quick Start Section (2)

**Purpose**: Get users to a working state in under 2 minutes.

**Must include**:
- Numbered setup steps with copy-paste commands
- Verification command to confirm success
- Simplest possible first use example

**Writing Tips**:
- Assume nothing is installed (or state prerequisites clearly)
- "30-Second Setup" is aspirational. Aim for it.

### Features Section (3)

**Purpose**: Comprehensive feature documentation. For complex systems, split into a narrative tier and a reference tier.

**Must include**:
- Numbered subsections (3.1, 3.2, etc.) separated by `---` dividers for scannable navigation
- Feature groupings by category
- Usage examples for key features
- Options/flags tables where applicable

**Two-Tier Structure** (recommended for complex systems):
- **Narrative subsection** (e.g., `### 3.1 HOW IT WORKS`): Plain-language explanations with analogies. Explain the "why" before the "how." No parameter tables here.
- **Reference subsection** (e.g., `### 3.2 API REFERENCE`): Precise parameter tables, configuration options, technical specifics. Terse and scannable.

Newcomers read the narrative. Power users jump to the reference. Both tiers live in the same Features section.

**Subsection Numbering**: Use `#### 3.1.1 TOPIC NAME` (ALL CAPS) for sub-subsections within a Feature subsection. Add `---` horizontal rules between subsections for visual separation. All numbered headings (H3 and H4) use ALL CAPS to match H2 section headings.

**Writing Tips**:
- Each subsection should open with 1-2 sentences explaining what this capability does in plain language
- Bold key term names on first use (e.g., **Reciprocal Rank Fusion**)
- Use tables for structured data (parameters, comparisons, options)
- Show before/after or input/output examples
- Include comparison tables when multiple options exist

### Structure Section (4)

**Purpose**: Help users navigate the project/component.

**Must include**:
- ASCII directory tree
- Purpose annotations for key directories/files
- Key files table

**Writing Tips**:
- Only show relevant structure (not every file)
- Annotate with `# Purpose` comments in tree
- 2-3 levels deep is usually sufficient

### Configuration Section (5)

**Purpose**: Complete configuration reference.

**Must include**:
- Config file location and format
- All options with types, defaults, descriptions
- Environment variables

**Writing Tips**:
- Show complete example config (not fragments)
- Document ALL defaults
- Explain the "why" not the "what"

### Usage Examples Section (6)

**Purpose**: Real-world usage patterns users can copy.

**Must include**:
- 3+ examples from simple to advanced
- Common patterns table
- Expected results for each example

**Writing Tips**:
- Build complexity progressively (basic to advanced)
- Use realistic examples, not toy data

### Troubleshooting Section (7)

**Purpose**: Self-service problem resolution.

**Must include**:
- Common issues using "What you see / Common causes / Fix" format
- Quick fixes table (one-liner solutions for frequent problems)
- Diagnostic commands

**Writing Tips**:
- Lead with what the user sees in their own words, not internal error names
- Provide copy-paste solutions (commands they can run immediately)
- Separate issues with `---` dividers for scannable navigation
- Keep each issue self-contained (do not reference other issues)

### FAQ Section (8)

**Purpose**: Answer frequently asked questions.

**Must include**:
- General questions (what/why)
- Technical questions (how)
- Bold Q: with A: format

**Writing Tips**:
- Keep answers concise (2-3 sentences max)
- Answer the question asked

### Related Documents Section (9)

**Purpose**: Guide users to additional resources.

**Must include**:
- Internal documentation links
- External resource links
- Purpose description for each

**Writing Tips**:
- Use relative paths for internal docs
- Verify all links work

---

<!-- /ANCHOR:section-deep-dives -->
<!-- ANCHOR:writing-patterns -->
## 6. WRITING PATTERNS

### Two-Tier Voice

For **Project, Skill and Feature** READMEs, use two writing voices in the same document. (Component and Code Folder READMEs use technical voice only -- skip the narrative tier.)

**Narrative tier** -- explains what things do and why they matter. Uses analogies, plain language and active voice. Appears in section intros, Overview, Quick Start and the narrative half of Features (e.g., "4.1 How It Works"). The goal is that someone with no prior knowledge can understand the system.

**Reference tier** -- precise parameter tables, configuration flags, tool signatures. Terse and scannable. Appears in the reference half of Features (e.g., "4.2 Tool Reference"), Configuration and Related Documents. No analogies needed here.

The two tiers complement each other. The narrative explains the "why." The reference answers the "what exactly."

**Example -- narrative tier:**
> When you search for something, the system does not just look in one place. It checks several sources at once, like a librarian who checks the card catalog, the shelf labels and the reading room sign-out sheet all at the same time.

**Example -- reference tier:**

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search query |
| `limit` | number | 1-100 results (default 10) |

### Analogy Patterns

Analogies make technical concepts stick. Use them in narrative sections of **Project, Skill and Feature** READMEs. Do not use analogies in Component or Code Folder READMEs. Keep them grounded in everyday experience.

**Effective analogy patterns**:
- **Librarian** -- for search, retrieval, filing, organization
- **Filing cabinet** -- for storage, folders, organization, hierarchy
- **Bouncer at the door** -- for quality gates, validation, rejection
- **Save point in a video game** -- for checkpoints, snapshots, rollback
- **Triage nurse** -- for routing, classification, priority
- **Assembly line** -- for pipelines, stages, sequential processing
- **Corkboard with string** -- for graphs, connections, relationships
- **Phone autocomplete** -- for trigger matching, fast lookup
- **Dress rehearsal** -- for dry runs, previews, validation without commitment

**Rules for analogies**:
- One analogy per concept (do not stack multiple analogies for the same thing)
- Place the analogy after the technical statement, not before
- Do not use analogies in parameter tables or configuration sections
- Drop the analogy if the concept is already clear from plain language

### Progressive Disclosure

Essential information first, details on demand: title + one-line (10s), then overview (30s), then quick start (2m), then full docs (as needed).

### Table-First Approach

Tables are scannable. Use them for feature comparisons, configuration options, file listings, requirements and quick reference.

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| npm | 9+ | 10+ |

### Code Block Standards

Always specify language for syntax highlighting:

```bash
# Install dependencies
npm install

npm --version
# Expected: 10.2.0 or higher
```

### Placeholder Conventions

Use `[PLACEHOLDER]` format with descriptive names:

```markdown
[PROJECT_NAME]      # Name of the project
[DESCRIPTION]       # Brief description
[COMMAND]           # Actual command to run
[VERSION]           # Version number
[PATH]              # File or directory path
```

For optional content:
```markdown
<!-- Optional: Remove if not applicable -->
[Optional section content]
```

---

<!-- /ANCHOR:writing-patterns -->
<!-- ANCHOR:style-reference -->
## 7. STYLE REFERENCE

### Heading Format

| Element | Rule | Example |
|---------|------|---------|
| H1 | Plain title | `# Project Name` |
| H2 | Numbered, ALL CAPS | `## 1. OVERVIEW` |
| H3 (numbered) | Numbered, ALL CAPS | `### 3.1 SPEC KIT DOCUMENTATION` |
| H3 (unnumbered) | Title case | `### Configuration` |
| H4 (numbered) | Numbered, ALL CAPS | `#### 3.1.1 HYBRID SEARCH` |
| H4 (unnumbered) | Title case | `#### Options` |

**Standard Section Names**:
- OVERVIEW
- QUICK START
- STRUCTURE
- FEATURES
- CONFIGURATION
- USAGE EXAMPLES
- TROUBLESHOOTING
- FAQ
- RELATED DOCUMENTS

### Formatting Conventions

| Element | Format | Example |
|---------|--------|---------|
| File paths | Backticks | \`path/to/file.md\` |
| Commands | Fenced code blocks | \`\`\`bash ... \`\`\` |
| Options/flags | Backticks | \`--flag\` |
| Key terms | Bold | **term** |
| Variables | Backticks + caps | \`VAR_NAME\` |
| Placeholders | Brackets | `[PLACEHOLDER]` |

### Section Numbering

- Always use `N. ` prefix: `## 1. OVERVIEW`
- Maintain sequential numbering
- Update TOC links when removing sections
- Link format: `#n--section-name` (number + double-dash + lowercase-hyphenated)

### TOC Link Format

```markdown
- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
```

Note the double-dash after the number in the anchor.

### Badge Placement

Badges go above H1 in a `<div align="left">` wrapper. The blockquote tagline goes immediately after H1, before the first horizontal rule (`---`).

---

<!-- /ANCHOR:style-reference -->
<!-- ANCHOR:readme-checklist -->
## 8. README CHECKLIST

Before finalizing a README, verify all applicable items:

### Structure
- [ ] Title with one-line description (blockquote)
- [ ] Table of contents with working anchor links
- [ ] All included sections have content (no empty sections)
- [ ] Section numbers are sequential
- [ ] Horizontal rules between major sections
- [ ] TOC entries match actual H2 headings (no phantom links)
- [ ] Section numbers in H2 headings match TOC order

### Content
- [ ] All `[PLACEHOLDER]` markers replaced with actual content
- [ ] Overview explains what AND why
- [ ] Quick Start achievable in <2 minutes
- [ ] All commands tested and working
- [ ] Expected outputs shown for verification commands
- [ ] At least 3 usage examples (simple to advanced)
- [ ] At least 3 troubleshooting entries

### Quality
- [ ] All code blocks specify language
- [ ] All internal links verified working
- [ ] All external links verified working
- [ ] Tables are properly formatted
- [ ] No spelling or grammar errors
- [ ] Consistent terminology throughout

### Style
- [ ] H2 headings use numbered ALL CAPS format
- [ ] Numbered H3/H4 subsections use ALL CAPS format (e.g. `### 3.1 HYBRID SEARCH`)
- [ ] Unnumbered H3/H4 use title case (e.g. `### Configuration`)
- [ ] TOC links match section headers exactly
- [ ] File paths in backticks
- [ ] Commands in fenced code blocks
- [ ] Key terms bolded consistently

### Human Voice Rules (HVR)
- [ ] No em dashes. Use commas, periods, or colons instead.
- [ ] No semicolons. Split into two sentences or use "and".
- [ ] No Oxford commas. Remove comma before final "and/or" in 3+ item lists.
- [ ] No "not just X, but also Y" patterns
- [ ] No exactly three-item inline lists. Use 2, 4, or 5 items instead (tables and bullet lists are exempt).
- [ ] No setup language ("Let's explore", "dive in", "when it comes to", "at its core")
- [ ] No banned words: leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable
- [ ] No banned phrases: "It's important to", "It's worth noting", "When it comes to", "Dive into", "That being said", "Having said that", "The reality is", "Here's the thing", "Moving forward", "At the end of the day"
- [ ] No banned metaphors: "deep dive", "bridge the gap", "at the heart of", "game-changer", "pave the way"
- [ ] Active voice throughout. Direct address. Simple words.
- [ ] Soft deduction words minimized: very, really, truly, absolutely, incredibly, just, actually, basically, simply, obviously, clearly
- [ ] "However" used max 2 times per file
- [ ] Max 1 ellipsis per file

---

<!-- /ANCHOR:readme-checklist -->
<!-- ANCHOR:human-voice-rules-hvr -->
## 9. HUMAN VOICE RULES (HVR)

All README content must follow Human Voice Rules. The full ruleset lives in a standalone reference file. This section provides a quick reference for writing.

**Full HVR Reference**: [`hvr_rules.md`](../../references/global/hvr_rules.md)

### Quick Reference

| Category | Rule | Action |
|----------|------|--------|
| Punctuation | No em dashes | Replace with commas, periods or colons |
| Punctuation | No semicolons | Split into two sentences or use "and" |
| Punctuation | No Oxford commas | Remove comma before final "and/or" in 3+ item lists |
| Structure | No "not just X, but also Y" | Rewrite as direct statement |
| Structure | No 3-item inline lists | Use 2, 4 or 5 items (tables and bullet lists exempt) |
| Structure | No setup language | Remove "Let's explore", "dive in", "when it comes to" |
| Voice | Active voice | "The script validates" not "Structure is validated" |
| Voice | Direct address | "Run the command" not "The command should be run" |
| Voice | Simple words | Prefer short, common words over formal ones |
| Voice | Cut fluff | Remove unnecessary modifiers (very, really, just, basically) |

### Banned Words (Top 10)

| Banned | Use Instead |
|--------|-------------|
| leverage | use |
| robust | strong, reliable |
| seamless | smooth |
| utilize | use |
| holistic | complete, whole |
| empower | enable |
| delve | look at, examine |
| groundbreaking | new, first |
| cutting-edge | latest, advanced |
| innovative | new |

For the complete banned words list, banned phrases, banned metaphors and soft deductions, see [`hvr_rules.md`](../../references/global/hvr_rules.md).

---

<!-- /ANCHOR:human-voice-rules-hvr -->
<!-- ANCHOR:patterns-from-existing-readmes -->
## 10. PATTERNS FROM EXISTING READMES

### Effective Overview Pattern

From well-structured project READMEs:

```markdown
## 1. OVERVIEW

### What is [Project]?

[Project] is a [category] that [primary action]. It provides [key benefit 1] 
and [key benefit 2] for [target audience].

### Key Statistics

| Metric | Value | Notes |
|--------|-------|-------|
| Components | 42 | Across 8 categories |
| Test coverage | 94% | Unit + integration |
| Install time | <2 min | Via npm |

### Key Features

| Feature | Description |
|---------|-------------|
| **Fast Setup** | Working in under 2 minutes |
| **Zero Config** | Sensible defaults, optional customization |
| **Type Safe** | Full TypeScript support |
```

**Additional patterns** (Quick Start, Troubleshooting, Showcase, Before/After) follow the same principles demonstrated above. See §5 for section-specific writing tips.

For the complete README creation workflow with quality criteria and pre-publish checklist, see [readme_creation.md](../../references/specific/readme_creation.md).

---

<!-- /ANCHOR:patterns-from-existing-readmes -->
<!-- ANCHOR:readme-maintenance -->
## 11. README MAINTENANCE

### When to Update

| Trigger | Update Timing |
|---------|---------------|
| New features added | Immediately |
| Breaking changes introduced | Immediately |
| Installation process changes | Immediately |
| Dependencies change significantly | Immediately |
| Version number bumps | Periodically |
| Link rot (broken external links) | Periodically |
| Outdated screenshots or examples | Periodically |
| User-reported confusion | Periodically |

### Version Tracking

Include version info in major READMEs:

```markdown
---
*Documentation version: 2.1 | Last updated: 2025-01-15 | Project version: 1.4.0*
```

### Link Maintenance

Regularly verify:
- Internal links still resolve
- External links haven't moved
- Anchor links match section headers

```bash
# Check for broken links (if using markdown-link-check)
markdown-link-check README.md
```

### Deprecation

If deprecating a project/component:

1. Add notice at top:
```markdown
> ⚠️ **DEPRECATED**: This project is no longer maintained. 
> See [Alternative](./path/to/alternative) for a replacement.
```

2. Keep README available for existing users
3. Update "Related Documents" to point to replacement

---

<!-- /ANCHOR:readme-maintenance -->
<!-- ANCHOR:yaml-frontmatter-schema -->
## 12. YAML FRONTMATTER SCHEMA

README files can include YAML frontmatter at the very top for consistent metadata across tooling and documentation workflows.

### Frontmatter Format

```yaml
---
title: "Human-readable title"
description: "Brief description of this document"
trigger_phrases:
  - "phrase that should surface this document"
  - "another trigger phrase"
---
```

### Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | string | Human-readable title for document discovery and display |
| `description` | Yes | string | Brief summary (1-2 sentences) for quick scanning |
| `trigger_phrases` | No | string[] | Optional phrases that improve retrieval and routing |

### When Frontmatter is Needed

| Context | Needed? | Reason |
|---------|---------|--------|
| README inside `.opencode/skill/` with reusable conventions | ✅ Recommended | Improves consistency across skills |
| Document contains decision rationale or architectural context | ✅ Recommended | Improves discoverability and maintainability |
| Specific trigger phrases should surface during prompt matching | ✅ Recommended | Better routing and context surfacing |
| Standard project root `README.md` | ⚠️ Optional | Useful when extra metadata adds value |
| File is inside `scratch/` directory (temporary) | ⚠️ Optional | Temporary by nature |
| For human-only consumption with no retrieval intent | ❌ Not needed | Metadata adds little value |
| One-off guide unlikely to be referenced again | ❌ Not needed | Can stay minimal |

### Example: Skill README with Frontmatter

```markdown
---
title: "Chrome DevTools Workflow"
description: "Instructions for browser debugging via CLI and MCP approaches"
trigger_phrases:
  - "debug in browser"
  - "chrome devtools"
  - "inspect element"
  - "console errors"
---

# Chrome DevTools Workflow

> Browser debugging orchestrator for CLI and MCP approaches.

...
```

---

<!-- /ANCHOR:yaml-frontmatter-schema -->
<!-- ANCHOR:anchor-templates-for-structured-retrieval -->
## 13. ANCHOR TEMPLATES FOR STRUCTURED RETRIEVAL

Structured documents can use standardized **retrieval anchors** for fine-grained context extraction. These anchors enable tooling to pull specific sections without loading entire files.

### Memory Anchor Format

```markdown
<!-- ANCHOR:summary -->
Content for this section...
<!-- /ANCHOR:summary -->
```

### Standard Memory Anchors

These anchor names are commonly used for targeted retrieval:

| Anchor | Purpose | Typical Content |
|--------|---------|-----------------|
| `summary` | Brief overview of the document | 2-3 sentence description of purpose and key content |
| `state` | Current status | Implementation progress, what's done vs remaining |
| `decisions` | Decision rationale | Why choices were made, alternatives considered |
| `context` | Background information | Prerequisites, assumptions, environmental context |
| `artifacts` | Files and outputs | List of files created, modified, or referenced |
| `next-steps` | Planned future work | What to do next, continuation instructions |
| `blockers` | Issues preventing progress | Problems encountered, dependencies, open questions |

### Anchor Template

Use this skeleton when creating structured documents:

```markdown
<!-- ANCHOR:summary -->
Brief overview of this document's purpose and key content.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:state -->
Current status and implementation state.
- Completed: [what's done]
- Remaining: [what's left]
<!-- /ANCHOR:state -->

<!-- ANCHOR:decisions -->
Key decisions and their rationale.
- Decision: [what was decided]
  - Reason: [why]
  - Alternatives considered: [what else was evaluated]
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:context -->
Background information needed to understand this work.
<!-- /ANCHOR:context -->

<!-- ANCHOR:artifacts -->
Files created or modified:
- `path/to/file.ts` - [purpose]
<!-- /ANCHOR:artifacts -->

<!-- ANCHOR:next-steps -->
What to do next:
1. [First priority]
2. [Second priority]
<!-- /ANCHOR:next-steps -->

<!-- ANCHOR:blockers -->
Issues preventing progress:
- [Blocker description and any known workarounds]
<!-- /ANCHOR:blockers -->
```

### Anchor Rules

- **Format**: `<!-- ANCHOR: name -->` to open, `<!-- /ANCHOR: name -->` to close (note the space after `ANCHOR:`)
- **IDs**: Lowercase with hyphens only (e.g., `next-steps`, not `NextSteps`)
- **No nesting**: Anchors must not overlap or nest inside each other
- **Include only what applies**: Not every document needs all seven anchors. Use what's relevant.
- **Minimum**: `summary` anchor is strongly recommended for structured documents
- **Retrieval**: Use your retrieval tooling with anchor filters (for example `["state", "next-steps"]`)

### README Anchor Conventions

README files typically use **section-based anchor names** like `overview`, `quick-start`, `features`, and `troubleshooting` (matching H2 sections). These differ from **stateful anchors** (`summary`, `state`, `decisions`, `next-steps`) used in session/context documents.

**README Anchor Conventions**:
- Match H2 section names (e.g., `<!-- ANCHOR:overview --> ... <!-- /ANCHOR:overview -->` for the Overview section)
- Lowercase, alphanumeric with hyphens only (e.g., `quick-start`, not `Quick Start`)
- No session IDs (unlike memory files)
- Minimum: Every README should have at least an `overview` anchor

<!-- /ANCHOR:anchor-templates-for-structured-retrieval -->
<!-- ANCHOR:complete-template -->
## 14. COMPLETE TEMPLATE

Copy and customize this template. Replace all `[PLACEHOLDER]` markers with actual content. Remove sections that don't apply (keep minimum: Overview, Quick Start, Troubleshooting).

```markdown
<!-- Optional: frontmatter
---
title: "[PROJECT_NAME]"
description: "[Brief description]"
---
-->

<!-- Optional: GitHub badges
<div align="left">

[![Stars](https://img.shields.io/github/stars/org/repo)](https://github.com/org/repo)
[![License](https://img.shields.io/github/license/org/repo)](./LICENSE)

</div>
-->

# [PROJECT_NAME]

> [One-sentence description of what this is and its primary purpose. Keep under 150 characters.]

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->
---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is [PROJECT_NAME]?

[2-3 sentences explaining what this is and why it exists.]

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| [Category 1] | [N] | [Brief detail] |
| [Category 2] | [N] | [Brief detail] |

### How This Compares

| Capability | Without [PROJECT_NAME] | With [PROJECT_NAME] |
|------------|------------------------|---------------------|
| [Capability 1] | [What users do today] | [What they get instead] |
| [Capability 2] | [Current limitation] | [How this solves it] |
| [Capability 3] | [Pain point] | [Improvement] |

### Key Features

| Feature | Description |
|---------|-------------|
| **[Feature 1]** | [What it does and why it matters] |
| **[Feature 2]** | [What it does and why it matters] |
| **[Feature 3]** | [What it does and why it matters] |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| [Runtime/Tool] | [Version] | [Version] |

<!-- /ANCHOR:overview -->
---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 30-Second Setup

```bash
# 1. [First step description]
[command]

# 2. [Second step description]
[command]

# 3. [Third step description]
[command]
```

### Verify Installation

```bash
# Confirm everything is working
[verification command]

# Expected output:
# [example output]
```

### First Use

```bash
# Basic usage
[minimal usage command or code]
```

<!-- /ANCHOR:quick-start -->
---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 [NARRATIVE SUBSECTION: HOW IT WORKS]

[1-2 paragraphs in plain language explaining what this system does and why it matters. Use an analogy if it helps.]

---

#### 3.1.1 [TOPIC NAME]

[Plain-language explanation of this capability. Lead with what it does for the user.]

| [Column 1] | [Column 2] | [Column 3] |
|-------------|------------|------------|
| [Data] | [Data] | [Data] |

**[Key concept name]** -- [short explanation of how it works and why it matters].

---

#### 3.1.2 [TOPIC NAME]

[Next capability explained in simple terms.]

---

### 3.2 [REFERENCE SUBSECTION: TECHNICAL REFERENCE]

[Brief intro: what this section covers, who it is for.]

#### [Category 1]

##### `[tool_or_api_name]`

[1-2 sentence plain-language description.]

| Parameter | Type | Notes |
|-----------|------|-------|
| `[param]` | [type] | [description] |

```[language]
# Example usage
[code example]
```

<!-- /ANCHOR:features -->
---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
[root-directory]/
├── [dir-or-file-1]/          # [Purpose]
│   ├── [subitem-1]           # [Purpose]
│   └── [subitem-2]           # [Purpose]
├── [dir-or-file-2]/          # [Purpose]
└── [dir-or-file-3]           # [Purpose]
```

### Key Files

| File | Purpose |
|------|---------|
| `[filename-1]` | [What it does] |
| `[filename-2]` | [What it does] |

<!-- /ANCHOR:structure -->
---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Configuration File

**Location**: `[path/to/config.file]`

```[format]
# Example configuration
[key]: [value]
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `[option-1]` | [type] | `[default]` | [What it controls] |
| `[option-2]` | [type] | `[default]` | [What it controls] |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `[VAR_NAME]` | [Yes/No] | [What it controls] |

<!-- /ANCHOR:configuration -->
---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: [Use Case Name]

```bash
# [Description of what this example does]
[command or code]
```

**Result**: [What happens / expected output]

### Example 2: [Use Case Name]

```bash
# [Description]
[command or code]
```

### Example 3: [Advanced Use Case]

```bash
# [Description]
[command or code]
```

### Common Patterns

| Pattern | Command/Code | When to Use |
|---------|--------------|-------------|
| [Pattern 1] | `[code]` | [Scenario] |
| [Pattern 2] | `[code]` | [Scenario] |

<!-- /ANCHOR:usage-examples -->
---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Common Issues

#### [Issue 1: Descriptive Name]

**What you see**: [What the user experiences in their own words]

**Common causes**: [Why this happens, in plain language]

**Fix**: [Direct action to take]

```bash
[fix command]
```

---

#### [Issue 2: Descriptive Name]

**What you see**: [What the user sees]

**Common causes**: [Why this happens]

**Fix**: [Step-by-step solution]

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| [Problem 1] | `[command or action]` |
| [Problem 2] | `[command or action]` |

### Diagnostic Commands

```bash
# Check status
[diagnostic command 1]

# View logs
[diagnostic command 2]
```

<!-- /ANCHOR:troubleshooting -->
---

<!-- ANCHOR:faq -->
## 8. FAQ

### General Questions

**Q: [Common question about what this is or does]?**

A: [Clear, concise answer. 2-3 sentences max.]

---

**Q: [Common question about usage]?**

A: [Answer with example if helpful.]

---

### Technical Questions

**Q: [Technical question]?**

A: [Answer with code if applicable.]

```bash
[example]
```

<!-- /ANCHOR:faq -->
---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Document Name](./path/to/doc.md) | [What it covers] |

### External Resources

| Resource | Description |
|----------|-------------|
| [Resource Name](https://url) | [What it provides] |

<!-- /ANCHOR:related-documents -->
---

*[Optional: Footer with version info or maintainer contact]*
```

---

<!-- /ANCHOR:complete-template -->
<!-- ANCHOR:related-resources -->
## 15. RELATED RESOURCES

### Templates
- [skill_asset_template.md](../opencode/skill_asset_template.md) - Pattern reference for this document
- [install_guide_template.md](./install_guide_template.md) - For installation documentation
- [frontmatter_templates.md](./frontmatter_templates.md) - YAML frontmatter examples

### Standards
- [core_standards.md](../../references/global/core_standards.md) - Document formatting rules
- [validation.md](../../references/global/validation.md) - Quality scoring (DQI)
- [readme_creation.md](../../references/specific/readme_creation.md) - README creation workflow and standards

### Examples
- Project READMEs in `/specs/` folders
- Skill READMEs in `.opencode/skill/` folders
- [Spec Kit Memory MCP Server README](../../system-spec-kit/mcp_server/README.md) - Reference implementation of two-tier voice, numbered Feature subsections, comparison tables and analogy patterns
- [Feature Catalog in Simple Terms](../../system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md) - Voice and tone calibration reference for plain-language technical writing

### Skill Reference
- [sk-doc SKILL.md](../../SKILL.md) - Parent skill documentation
<!-- /ANCHOR:related-resources -->
