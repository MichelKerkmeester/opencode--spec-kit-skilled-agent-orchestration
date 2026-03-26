---
title: "sk-doc: Unified Markdown and Component Specialist"
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, DQI scoring, component creation workflows (skills, agents, commands), ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks."
trigger_phrases:
  - "documentation quality enforcement"
  - "opencode component creation workflow"
  - "markdown DQI scoring validation"
  - "create a skill"
  - "create an agent"
  - "create a command"
  - "ascii flowchart"
  - "install guide creation"
  - "feature catalog"
  - "manual testing playbook"
---

# sk-doc

> The unified markdown and OpenCode component specialist: quality enforcement, DQI scoring, component scaffolding, ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks.

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

sk-doc is the central documentation engine for OpenCode projects. It operates in five modes: Document Quality (structure enforcement, DQI scoring, content optimization), Component Creation (skills, agents, and commands with templates and full validation), Flowchart Creation (ASCII diagrams for workflows and decision trees), Install Guide Creation (phase-based setup documentation), and Catalog/Playbook Creation (feature catalogs and manual testing playbooks for inventory and validation packages).

The skill follows a script-assisted AI analysis model. Python scripts handle deterministic parsing and metrics extraction. The AI handles quality judgment and recommendations. The core principle is structure first, then content, then quality. Document type auto-detection applies the correct enforcement level automatically, ranging from strict (SKILL.md, Commands) to flexible (README) to loose (Spec files).

All documentation output produced through this skill must follow Human Voice Rules (HVR): no em dashes, no semicolons, no Oxford commas, no banned words (leverage, robust, seamless, utilize, delve, and others), and active voice throughout. HVR violations count against the Style component of the DQI score. The full ruleset lives in `references/global/hvr_rules.md`.

### Key Statistics

| Metric | Value |
| --- | --- |
| Skill version | 1.3.0.0 |
| Operating modes | 5 |
| Script count | 6 automation scripts |
| Template count | 10+ templates across 4 asset categories |
| Reference files | 11 (6 global, 5 specific) |
| Flowchart patterns | 7 core patterns |
| DQI scale | 0-100 (four quality bands) |

### How This Compares

| Capability | sk-doc | system-spec-kit | sk-git |
| --- | --- | --- | --- |
| Markdown quality enforcement | Yes | No | No |
| DQI scoring | Yes | No | No |
| Skill/Agent/Command creation | Yes | No | No |
| Spec folder lifecycle | No | Yes | No |
| ASCII flowcharts | Yes | No | No |
| Install guides | Yes | No | No |
| Feature catalogs and playbooks | Yes | No | No |
| Git workflow orchestration | No | No | Yes |

### Key Features

| Feature | Description |
| --- | --- |
| DQI scoring | 0-100 score across Structure (40), Content (30), Style (30) |
| Document type detection | Auto-detects README, SKILL, Knowledge, Command, Spec, Generic |
| HVR enforcement | Human Voice Rules applied to all output, with score deduction for violations |
| Component scaffolding | `init_skill.py` creates properly structured skill directories |
| Packaging and validation | `package_skill.py` runs full validation before distribution |
| Smart routing | Intent-scored resource loading, avoids loading irrelevant templates |
| 7 flowchart patterns | Linear, decision, parallel, nested, approval gate, loop, pipeline |
| Install guide phases | 5-phase template with per-phase validation checkpoints |
| Feature catalogs | Rooted inventory with numbered categories and per-feature files |
| Manual testing playbooks | 9-column scenario tables, deterministic prompts, cross-reference index |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Invoke the skill.**
The skill is routed automatically via Gate 2 when documentation tasks are detected. To invoke manually, read the SKILL.md file directly.

**Step 2: Check document quality.**
Run `extract_structure.py` on any markdown file to get a DQI score, checklist results, and recommendations. Exit 0 means the document parses cleanly. The JSON output shows component scores and flagged violations.

```bash
python3 .opencode/skill/sk-doc/scripts/extract_structure.py path/to/document.md
```

**Step 3: Create a new component.**
Use `init_skill.py` to scaffold a skill directory, then populate the templates. Run `package_skill.py` to validate and package when complete.

```bash
python3 .opencode/skill/sk-doc/scripts/init_skill.py my-skill --path .opencode/skill
python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill
```

**Step 4: Validate a README before delivery.**
For README files, `validate_document.py` checks TOC format, anchor syntax, H2 emojis, and required sections. Exit 0 is required before delivery.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py README.md
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The Document Quality mode is the most frequently used entry point. It runs `extract_structure.py` to produce a JSON snapshot of any markdown file, including frontmatter, heading structure, checklist pass/fail results, and the three-component DQI score. The AI then reviews that snapshot and generates ranked recommendations. Safe auto-fixes (H2 case normalization, missing separators, filename convention corrections) apply immediately. Critical violations (missing frontmatter, wrong section order) are flagged for human review before proceeding.

Component Creation covers the full lifecycle for skills, agents, and commands. Skill creation follows a six-step process: understand the use case with concrete examples, plan bundled resources, scaffold with `init_skill.py`, populate templates, package with `package_skill.py`, and iterate based on test results. Agent creation uses a template-first workflow that defines YAML frontmatter with explicit tool permissions (true/false per tool, not a loose allowed-tools array) and requires both a CORE WORKFLOW section and an ANTI-PATTERNS section. Command creation focuses on clear trigger definition and copy-paste ready usage examples.

The Flowchart mode provides seven ASCII patterns for documenting processes visually inside markdown. Each pattern has a dedicated reference file with worked examples. The patterns cover the most common documentation needs: linear step sequences, binary and multi-way decision branches, concurrent task execution, nested sub-workflows, approval and revision cycles, repeat-until loops, and multi-stage pipelines with gates. The validator (`validate_flowchart.sh`) checks alignment, consistent box styles, labeled decision branches, and complete entry/exit paths.

Install Guide creation applies a five-phase structure (Prerequisites, Installation, Configuration, Verification, Troubleshooting) with a per-phase validation checkpoint. Each guide includes an AI-first install prompt at the top, platform-specific configurations for OpenCode, Claude Code, and Claude Desktop, and an Error/Cause/Fix troubleshooting section. All commands must be copy-paste ready and tested before delivery.

Feature Catalog and Manual Testing Playbook creation handle package-level documentation for skills and systems. A feature catalog inventories current behavior with source-file anchors and stable slugs, organized in numbered category folders with one per-feature file per catalog entry. A manual testing playbook uses nine-column scenario tables with deterministic prompts, unique Feature IDs (PREFIX-NNN format), Global Preconditions, Evidence Requirements, and a Feature Catalog Cross-Reference Index. Both packages follow a root-document-plus-per-feature-file structure where the root owns the canonical surface (directory, review guidance, orchestration blocks) and the per-feature files hold full execution detail.

### 3.2 FEATURE REFERENCE

**Document Quality (Mode 1)**

| Feature | Detail |
| --- | --- |
| DQI scoring | Structure 40 pts, Content 30 pts, Style 30 pts |
| Quality bands | Excellent (90-100), Good (75-89), Acceptable (60-74), Needs Work (<60) |
| Document types | README, SKILL, Knowledge, Command, Spec, Generic |
| Enforcement levels | Strict (SKILL/Command), Flexible (README), Moderate (Knowledge), Loose (Spec) |
| Safe auto-fixes | H2 case, section separators, filename convention |
| Critical violations | Missing frontmatter, wrong section order (escalate, do not auto-fix) |
| HVR compliance | Style score deduction for banned words, em dashes, semicolons |

**Component Creation (Mode 2)**

| Component | Key Rule | Scaffolding Tool |
| --- | --- | --- |
| Skill | SKILL.md must stay under 5k words | `init_skill.py` |
| Skill | Must have a REFERENCES section for packaging | `package_skill.py` |
| Agent | Explicit true/false tool permissions required | `agent_template.md` |
| Agent | CORE WORKFLOW and ANTI-PATTERNS sections required | `agent_template.md` |
| Command | Frontmatter required for discovery | `command_template.md` |
| Command | Trigger phrases must be unique | Manual validation |

**Flowchart Creation (Mode 3)**

| Pattern | Use Case | Reference File |
| --- | --- | --- |
| 1: Linear Sequential | Step-by-step without branching | `simple_workflow.md` |
| 2: Decision Branch | Binary or multi-way decisions | `decision_tree_flow.md` |
| 3: Parallel | Multiple tasks run together | `parallel_execution.md` |
| 4: Nested | Embedded sub-workflows | `user_onboarding.md` |
| 5: Approval Gate | Review/approval required | `approval_workflow_loops.md` |
| 6: Loop/Iteration | Repeat until condition met | `approval_workflow_loops.md` |
| 7: Pipeline | Sequential stages with gates | `system_architecture_swimlane.md` |

**Install Guide Creation (Mode 4)**

| Phase | Purpose | Validation |
| --- | --- | --- |
| Prerequisites | List and verify dependencies | Checklist checkpoint |
| Installation | Step-by-step install commands | Checklist checkpoint |
| Configuration | Platform-specific config blocks | Checklist checkpoint |
| Verification | Confirm install works | Checklist checkpoint |
| Troubleshooting | Error/Cause/Fix entries | Checklist checkpoint |

**Catalog and Playbook Creation (Mode 5)**

| Artifact | Root Document | Per-Feature Files |
| --- | --- | --- |
| Feature Catalog | `FEATURE_CATALOG.md` | One file per catalog entry, numbered categories |
| Testing Playbook | `MANUAL_TESTING_PLAYBOOK.md` | One file per Feature ID, numbered categories |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
sk-doc/
├── SKILL.md                                         # Entry point with routing logic
├── README.md                                        # This file
├── assets/
│   ├── documentation/                               # Document templates
│   │   ├── frontmatter_templates.md                 # Frontmatter validation (11 types)
│   │   ├── install_guide_template.md                # 5-phase install guide template
│   │   ├── llmstxt_templates.md                     # llms.txt generation templates
│   │   ├── readme_template.md                       # README structure with HVR rules
│   │   ├── feature_catalog/
│   │   │   ├── feature_catalog_template.md          # Root catalog scaffold
│   │   │   └── feature_catalog_snippet_template.md  # Per-feature catalog file
│   │   └── testing_playbook/
│   │       ├── manual_testing_playbook_template.md  # Root playbook scaffold
│   │       └── manual_testing_playbook_snippet_template.md  # Per-feature scenario file
│   ├── flowcharts/                                  # ASCII flowchart patterns (7 types)
│   │   ├── simple_workflow.md                       # Linear sequential
│   │   ├── decision_tree_flow.md                    # Branching logic
│   │   ├── parallel_execution.md                    # Concurrent tasks
│   │   ├── user_onboarding.md                       # Nested sub-processes
│   │   ├── approval_workflow_loops.md               # Review cycles and loops
│   │   └── system_architecture_swimlane.md          # Multi-stage pipelines
│   ├── skill/                                       # Skill creation templates
│   │   ├── skill_md_template.md                     # Canonical SKILL.md template
│   │   ├── skill_reference_template.md              # Reference file template
│   │   └── skill_asset_template.md                  # Asset file template
│   ├── agents/                                      # Agent and command templates
│   │   ├── agent_template.md                        # Agent creation template
│   │   └── command_template.md                      # Command creation template
│   └── template_rules.json                          # Template enforcement rules
├── references/
│   ├── global/                                      # Shared standards
│   │   ├── core_standards.md                        # Filename conventions, structure rules
│   │   ├── hvr_rules.md                             # Human Voice Rules full ruleset
│   │   ├── optimization.md                          # AI-friendly content transforms
│   │   ├── validation.md                            # DQI scoring criteria
│   │   ├── workflows.md                             # Execution modes by task type
│   │   └── quick_reference.md                       # One-page command and gate cheat sheet
│   └── specific/                                    # Component and document-family guides
│       ├── skill_creation.md                        # 6-step skill creation workflow
│       ├── agent_creation.md                        # Agent authority and creation workflow
│       ├── readme_creation.md                       # README creation workflow
│       ├── install_guide_creation.md                # Install guide standards and workflow
│       ├── feature_catalog_creation.md              # Feature catalog standards and workflow
│       └── manual_testing_playbook_creation.md      # Playbook standards and workflow
└── scripts/                                         # Automation scripts
    ├── extract_structure.py                         # Parse document to JSON + DQI score
    ├── validate_document.py                         # README format validation (exit 0/1/2)
    ├── init_skill.py                                # Scaffold new skill directory
    ├── package_skill.py                             # Validate + package skill to zip
    ├── quick_validate.py                            # Fast validation checks
    ├── validate_flowchart.sh                        # Flowchart alignment and style check
    └── audit_readmes.py                             # Batch README audit across directories
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

No configuration is required to use this skill. Document type detection is automatic and drives the enforcement level applied.

**Enforcement levels by document type**

| Document Type | Enforcement | Frontmatter | Notes |
| --- | --- | --- | --- |
| SKILL.md | Strict | Required | No structural checklist failures permitted |
| README.md | Flexible | None | Focus on quick-start usability |
| Knowledge file | Moderate | Forbidden | Consistent, scannable reference format |
| Command | Strict | Required | Must be executable and discoverable |
| Spec | Loose | Optional | Working docs, avoid blocking on violations |
| Generic | Flexible | Optional | Best-effort structure enforcement |

Template enforcement rules are defined in `assets/template_rules.json`. This file governs which checklist items are required, advisory, or skipped per document type. Modify this file to adjust enforcement for custom document types.

**HVR enforcement** applies to all output from all modes. There is no opt-out. Violations against HVR (banned words, em dashes, semicolons, Oxford commas, passive voice) count against the Style component of the DQI score and appear in the checklist output of `extract_structure.py`.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Score a document and review recommendations**

```bash
# Run extract_structure.py and parse the JSON output
python3 .opencode/skill/sk-doc/scripts/extract_structure.py path/to/document.md

# Example output (truncated):
# {
#   "dqi": { "total": 82, "band": "good", "components": { "structure": 35, "content": 22, "style": 25 } },
#   "checklist": { "passed": 9, "failed": 2, "skipped": 1 },
#   "documentType": "README",
#   "violations": ["missing_toc_anchor", "h2_missing_emoji"]
# }
```

**Scaffold, populate, and package a new skill**

```bash
# Step 1: scaffold the directory
python3 .opencode/skill/sk-doc/scripts/init_skill.py my-skill --path .opencode/skill

# Step 2: populate SKILL.md and bundled resources using templates
# assets/skill/skill_md_template.md  →  .opencode/skill/my-skill/SKILL.md
# assets/skill/skill_reference_template.md  →  references/
# assets/skill/skill_asset_template.md      →  assets/

# Step 3: run quick validation during editing
python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/my-skill --json

# Step 4: package and validate for distribution
python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill

# Step 5: final DQI check on SKILL.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/my-skill/SKILL.md
```

**Validate a README before delivery**

```bash
# validate_document.py checks TOC anchors, H2 emojis, required sections
python3 .opencode/skill/sk-doc/scripts/validate_document.py README.md

# Exit codes:
# 0 = valid, proceed to delivery
# 1 = blocking errors (fix and re-run)
# 2 = file read or parse error (check path and input)
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**DQI score below 60**

What you see: `extract_structure.py` returns a `"needs_work"` band with a total score under 60.

Common causes: Missing required sections, no frontmatter on a SKILL or Command file, very low word count, no code examples, H2 headers missing emoji or numbers, or multiple HVR violations.

Fix: Review the `checklist` array in the JSON output. Address failed items in priority order: (1) frontmatter and section order, (2) missing required sections, (3) content density (word count, examples, links), (4) style issues (HVR, H2 format, separators). Re-run `extract_structure.py` after each batch of fixes to track progress.

---

**`validate_document.py` exits with code 1**

What you see: The script reports blocking errors and refuses to pass the document.

Common causes: TOC missing or using single-dash anchor format instead of double-dash (e.g., `#1-overview` instead of `#1--overview`), H2 headers missing emojis, required sections absent, or section numbering is non-sequential.

Fix: Read the error output line by line. The most common fix is correcting TOC anchor format to use double dashes. Check that every H2 has the correct emoji from the template, that sections are numbered 1, 2, 3 (not 1, 2.5, 3), and that no required section is absent. Re-run after each correction.

---

**`package_skill.py` fails**

What you see: The packaging script reports errors and does not produce a zip output.

Common causes: SKILL.md exceeds 5,000 words, a required section is missing (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES), frontmatter is absent or malformed, or the skill directory is missing expected subdirectories.

Fix: Run `extract_structure.py` on SKILL.md first to identify the specific failures. If the word count is over 5,000, move detailed content to `references/` files and replace it with concise navigation links in SKILL.md. Ensure the REFERENCES section (or combined SMART ROUTING and REFERENCES section) is present. Re-run `package_skill.py` after corrections.

---

**HVR violations appear in DQI output**

What you see: The Style component score is lower than expected. The checklist flags `hvr_banned_words`, `hvr_em_dash`, or `hvr_semicolon` violations.

Common causes: Writing that uses banned words (leverage, robust, seamless, utilize, delve, cutting-edge, and others), em dashes used as clause separators, semicolons between independent clauses, or passive-voice constructions.

Fix: Read `references/global/hvr_rules.md` for the complete banned word list and prohibited punctuation patterns. Search the document for each violation type using Grep, then rewrite affected sentences. Replace em dashes with commas or parentheses. Replace semicolons with periods or commas. Replace banned words with plain alternatives.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: When should I use sk-doc vs. system-spec-kit?**

A: Use sk-doc for any task involving markdown quality, document creation (READMEs, install guides, catalogs, playbooks), or OpenCode component scaffolding (skills, agents, commands). Use system-spec-kit for spec folder lifecycle management: creating spec.md, plan.md, tasks.md, checklist.md, and related spec folder documents. The two skills do not overlap. sk-doc must not write inside spec folders, and system-spec-kit does not handle DQI scoring, flowcharts, or component scaffolding.

**Q: Does `validate_document.py` check everything that `extract_structure.py` checks?**

A: No. They serve different purposes. `validate_document.py` is a fast format validator for README files specifically. It checks TOC presence, anchor format, H2 emoji rules, and required section presence. It exits 0 or 1. `extract_structure.py` is the full DQI analysis tool. It parses any markdown document type, produces a JSON report with three component scores, a checklist with pass/fail/skip per item, detected violations, and quality band. Use `validate_document.py` as a pre-delivery gate for READMEs and `extract_structure.py` for broader quality analysis and iteration tracking.

**Q: What is the difference between a Feature Catalog and a Manual Testing Playbook?**

A: A feature catalog documents current behavior. It inventories what a skill or system can do, organized by numbered categories, with source-file anchors and stable slugs. A testing playbook defines how to test that behavior manually. It contains deterministic prompts (exact text to type), expected signals, failure triage steps, and evidence requirements. The two are complementary: the catalog provides the stable capability reference, and the playbook links back to catalog entries via a Cross-Reference Index. Build the catalog first, then use it as the source of truth when writing playbook scenarios.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource | Path | Purpose |
| --- | --- | --- |
| SKILL.md | `.opencode/skill/sk-doc/SKILL.md` | Entry point with routing logic and mode rules |
| HVR rules | `references/global/hvr_rules.md` | Complete Human Voice Rules ruleset |
| Validation rules | `references/global/validation.md` | DQI scoring criteria and blocking rules |
| Core standards | `references/global/core_standards.md` | Filename conventions and structure rules |
| Workflows | `references/global/workflows.md` | Execution workflows by mode |
| Quick reference | `references/global/quick_reference.md` | One-page command and gate cheat sheet |
| Skill creation guide | `references/specific/skill_creation.md` | 6-step skill creation workflow |
| Agent creation guide | `references/specific/agent_creation.md` | Agent authority, permissions, creation workflow |
| README creation guide | `references/specific/readme_creation.md` | README creation workflow |
| Install guide creation | `references/specific/install_guide_creation.md` | Install guide standards and workflow |
| Feature catalog creation | `references/specific/feature_catalog_creation.md` | Catalog package standards and workflow |
| Playbook creation | `references/specific/manual_testing_playbook_creation.md` | Playbook standards and workflow |
| system-spec-kit | `.opencode/skill/system-spec-kit/SKILL.md` | Spec folder lifecycle and context preservation |
| sk-git | `.opencode/skill/sk-git/SKILL.md` | Git workflow orchestration |
| CommonMark spec | https://spec.commonmark.org/ | Markdown rendering standard |
| llms.txt spec | https://llmstxt.org/ | LLM navigation format |

<!-- /ANCHOR:related-documents -->
