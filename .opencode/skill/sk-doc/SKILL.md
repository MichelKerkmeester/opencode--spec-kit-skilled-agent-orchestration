---
name: sk-doc
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.3.0.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows, (4) Install guide creation for setup documentation and (5) Feature catalog and manual testing playbook creation for inventory and validation packages.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.


## 1. WHEN TO USE

### Use Case: Document Quality Management

Enforce markdown structure, optimize content for AI assistants, validate quality through script-assisted AI analysis.

**README Creation** - Use `readme_template.md` + `readme_creation.md` when:
- Creating new README for any folder or project
- User requests "create a README", "add documentation", "write a README"
- Folder needs comprehensive documentation
- Workflow: [readme_creation.md](./references/specific/readme_creation.md) | Template: [readme_template.md](./assets/documentation/readme_template.md)

**Frontmatter Validation** - Use `frontmatter_templates.md` when:
- Validating YAML frontmatter in any document
- Checking required fields for document types
- Fixing frontmatter syntax errors

**Validation Workflow** - Apply after Write/Edit operations:
- Auto-correct filename violations (ALL CAPS to lowercase, hyphens to underscores)
- Fix safe violations (separators, H2 case)
- Check critical violations (missing frontmatter, wrong section order)

**Manual Optimization** - Run when:
- README needs optimization for AI assistants
- Creating critical documentation (specs, knowledge, skills)
- Pre-release quality checks
- Generating llms.txt for LLM navigation

### Use Case: OpenCode Component Creation

Create and manage OpenCode components (skills, agents, commands). Each component type has templates and validation with quality standards.

**Component Types:**
- **Skills** (.opencode/skill/) - Knowledge bundles with workflows → [skill_creation.md](./references/specific/skill_creation.md)
- **Agents** (.opencode/agent/) - AI personas with tool permissions → [agent_creation.md](./references/specific/agent_creation.md)
- **Commands** (.opencode/command/) - Slash commands for user invocation → [command_template.md](./assets/agents/command_template.md)

For larger skills, split deep content into focused reference files and keep concise navigation in `SKILL.md` or `README.md`. When a skill has both cross-cutting standards and document-family guides, prefer `references/global/` for shared rules and `references/specific/` for creation-specific workflows.

Start with: [skill_creation.md](./references/specific/skill_creation.md) (Section 9)
Primary templates:
- [skill_md_template.md](./assets/skill/skill_md_template.md)
- [skill_reference_template.md](./assets/skill/skill_reference_template.md)
- [skill_asset_template.md](./assets/skill/skill_asset_template.md)

**Use when**:
- User requests skill creation ("create a skill", "make a new skill")
- User requests agent creation ("create an agent", "make a new agent")
- User requests command creation ("create a command", "add a slash command")
- Scaffolding component structure
- Validating component quality
- Packaging skill for distribution

**Skill Process (6 steps)**: Understanding (examples) → Planning (resources) → Initialization (`init_skill.py`) → Editing (populate) → Packaging (`package_skill.py`) → Iteration (test/improve)

**Agent Process**: Load `agent_creation.md` and `agent_template.md` → Define frontmatter (mode, permissions) → Create sections (workflow, capabilities, anti-patterns) → Validate → Test

**Command Process**: Load `command_template.md` → Define frontmatter (name, description) → Create execution logic → Add to command registry → Test

### Use Case: Flowchart Creation

Create ASCII flowcharts for visualizing workflows, user journeys and decision trees.

For styled HTML visuals (interactive diagrams, dashboard pages, or polished data-table renders), use a dedicated HTML workflow instead of forcing ASCII or markdown flowcharts.

**Use when**:
- Documenting multi-step processes with branching
- Creating decision trees with multiple outcomes
- Showing parallel execution with sync points
- Visualizing approval gates and revision cycles

**See**: [assets/flowcharts/](./assets/flowcharts/)

### Use Case: Install Guide Creation

Create and validate installation documentation for MCP servers, plugins and tools using phase-based templates.

**Use when**:
- Creating documentation for MCP server installation
- Documenting plugin setup procedures
- Standardizing tool installation across platforms
- Need phase-based validation checkpoints

**5-Phase Process**: Overview → Prerequisites → Installation → Configuration → Verification

**See**: [install_guide_creation.md](./references/specific/install_guide_creation.md)

### Use Case: Manual Testing Playbook Creation

Create manual testing playbooks with deterministic scenarios, structured evidence collection, and multi-agent execution planning.

**Manual Testing Playbook** - Use `testing_playbook/manual_testing_playbook_template.md` when:
- Creating manual testing scenarios for a skill
- Standardizing test evidence and verdict criteria
- Setting up multi-agent test execution planning

**Canonical Package**: Root `MANUAL_TESTING_PLAYBOOK.md` plus numbered category folders with one per-feature file per feature ID.

**See**:
- [manual_testing_playbook_creation.md](./references/specific/manual_testing_playbook_creation.md)
- [manual_testing_playbook_template.md](./assets/documentation/testing_playbook/manual_testing_playbook_template.md)

### Use Case: Feature Catalog Creation

Create feature catalogs with a rooted capability inventory, numbered category sections, and per-feature reference files.

**Feature Catalog** - Use `feature_catalog/feature_catalog_template.md` when:
- Creating a canonical current-state feature inventory for a skill or system
- Linking manual playbooks back to a stable capability reference
- Documenting current behavior with source-file anchors and stable slugs

**Canonical Package**: Root `FEATURE_CATALOG.md` plus numbered category folders with one per-feature file per catalog entry.

**See**:
- [feature_catalog_creation.md](./references/specific/feature_catalog_creation.md)
- [feature_catalog_template.md](./assets/documentation/feature_catalog/feature_catalog_template.md)

### When NOT to Use (All Modes)

- Non-markdown files (only `.md` supported)
- Simple typo fixes (use Edit tool directly)
- Internal notes or drafts
- Auto-generated API docs
- Short 2-3 step processes (use bullet points)

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing-references -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/global/` for documentation standards, validation rules, optimization guidance, voice rules, and shared execution workflows.
- `references/specific/` for document-family and component creation guides such as skill creation, agent creation, install guides, feature catalogs, and manual testing playbooks.
- `assets/documentation/` for README, frontmatter, llms.txt, and install-guide templates.
- `assets/skill/` for skill creation templates and `assets/agents/` for agent and command creation templates.
- `assets/flowcharts/` for reusable ASCII flowchart patterns and diagram examples.

### Resource Loading Levels

| Level       | When to Load             | Resources                   |
| ----------- | ------------------------ | --------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline    |
| CONDITIONAL | If intent signals match  | Mode-specific docs/templates|
| ON_DEMAND   | Only on explicit request | Extended standards/template |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/global/quick_reference.md"

INTENT_SIGNALS = {
    "DOC_QUALITY": {"weight": 4, "keywords": ["dqi", "quality", "validate", "extract_structure"]},
    "OPTIMIZATION": {"weight": 3, "keywords": ["optimize", "llms.txt", "ai context"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["skill creation", "new skill", "init_skill", "package_skill"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["create agent", "create command", "agent template", "command template"]},
    "FLOWCHART": {"weight": 3, "keywords": ["flowchart", "ascii diagram", "decision tree", "swimlane"]},
    "INSTALL_GUIDE": {"weight": 3, "keywords": ["install guide", "setup instructions", "prerequisite"]},
    "HVR": {"weight": 4, "keywords": ["human voice", "hvr", "voice rules", "banned words", "writing style"]},
    "PLAYBOOK": {"weight": 4, "keywords": ["playbook", "manual testing", "test scenarios", "manual test", "testing playbook"]},
    "FEATURE_CATALOG": {"weight": 4, "keywords": ["feature catalog", "feature inventory", "capability inventory", "catalog snippet"]},
    "README_CREATION": {"weight": 3, "keywords": ["create readme", "readme creation", "write readme", "add documentation", "folder readme"]},
}

RESOURCE_MAP = {
    "DOC_QUALITY": ["references/global/validation.md", "references/global/workflows.md", "references/global/core_standards.md"],
    "OPTIMIZATION": ["references/global/optimization.md", "assets/documentation/llmstxt_templates.md"],
    "SKILL_CREATION": ["references/specific/skill_creation.md", "assets/skill/skill_md_template.md", "assets/skill/skill_reference_template.md"],
    "AGENT_COMMAND": ["references/specific/agent_creation.md", "assets/agents/agent_template.md", "assets/agents/command_template.md"],
    "FLOWCHART": ["assets/flowcharts/simple_workflow.md", "assets/flowcharts/decision_tree_flow.md"],
    "INSTALL_GUIDE": ["assets/documentation/install_guide_template.md", "references/specific/install_guide_creation.md"],
    "HVR": ["references/global/hvr_rules.md"],
    "PLAYBOOK": ["references/specific/manual_testing_playbook_creation.md", "assets/documentation/testing_playbook/manual_testing_playbook_template.md"],
    "FEATURE_CATALOG": ["references/specific/feature_catalog_creation.md", "assets/documentation/feature_catalog/feature_catalog_template.md"],
    "README_CREATION": ["references/specific/readme_creation.md", "assets/documentation/readme_template.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full standards", "all templates", "deep dive"],
    "ON_DEMAND": ["assets/documentation/frontmatter_templates.md"],
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and documentation modes."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["DOC_QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_documentation_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing-references -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Mode 1: Document Quality

**Script-Assisted AI Analysis**:

```bash
# 1. Extract document structure to JSON
scripts/extract_structure.py path/to/document.md

# 2. AI receives JSON with:
#    - Frontmatter, structure, metrics
#    - Checklist results, DQI score
#    - Evaluation questions

# 3. AI reviews and provides recommendations
```

**Document Type Detection** (auto-applies enforcement):

| Type      | Enforcement | Frontmatter | Notes                            |
| --------- | ----------- | ----------- | -------------------------------- |
| README    | Flexible    | None        | Focus on quick-start usability   |
| SKILL     | Strict      | Required    | No structural checklist failures |
| Knowledge | Moderate    | Forbidden   | Consistent, scannable reference  |
| Command   | Strict      | Required    | Must be executable               |
| Spec      | Loose       | Optional    | Working docs. Avoid blocking.    |
| Generic   | Flexible    | Optional    | Best-effort structure            |

### Mode 2: OpenCode Component Creation

#### Skill Creation

**Progressive Disclosure Design**:
1. Metadata (name + description) - Always in context (~100 words)
2. SKILL.md body - When skill triggers (<5k words)
3. Bundled resources - As needed (unlimited)

1. Define scope using [skill_creation.md](./references/specific/skill_creation.md) (Section 9)
4. Use [skill_reference_template.md](./assets/skill/skill_reference_template.md) to keep supplemental docs consistent

**After packaging**: Run `extract_structure.py` on SKILL.md for final quality review.

**Typical Workflow**:
```bash
# 1. Initialize skill structure
scripts/init_skill.py my-skill --path .opencode/skill

# 2. Edit SKILL.md and bundled resources
# [User populates templates with content]

# 3. Quick validation check
scripts/quick_validate.py .opencode/skill/my-skill --json

# 4. Package with full validation
scripts/package_skill.py .opencode/skill/my-skill

# 5. Quality assurance (DQI scoring)
scripts/extract_structure.py .opencode/skill/my-skill/SKILL.md
```

#### Agent Creation

**Template-First Workflow**:
1. Load `agent_template.md` for structure reference
2. Create agent file in `.opencode/agent/`
3. Define YAML frontmatter (name, tools, permissions)
4. Create required sections (workflow, capabilities, anti-patterns)
5. Validate frontmatter syntax
6. Test with real examples

**Key Difference from Skills**: Agents have tool permissions (true/false per tool) and action permissions (allow/deny), not an allowed-tools array.

#### Command Creation

**Template-First Workflow**:
1. Load `command_template.md` for structure reference
2. Create command file in `.opencode/command/`
3. Define YAML frontmatter (name, description, triggers)
4. Create execution logic and examples
5. Add to command registry
6. Test invocation

### Mode 3: Flowchart Creation

**Building Blocks**:
```text
Process Box:        Decision Diamond:     Terminal:
┌─────────────┐         ╱──────╲           ╭─────────╮
│   Action    │        ╱ Test?  ╲          │  Start  │
└─────────────┘        ╲        ╱          ╰─────────╯
                        ╲──────╱
```

**Flow Control**:
```text
Standard Flow:      Branch:           Parallel:         Merge:
     │              │   │   │         ┌────┬────┐         │
     ▼              ▼   ▼   ▼         │    │    │      ───┴───
                                      ▼    ▼    ▼         │
```

**7 Core Patterns**:

| Pattern              | Use Case                       | Reference File                    |
| -------------------- | ------------------------------ | --------------------------------- |
| 1: Linear Sequential | Step-by-step without branching | `simple_workflow.md`              |
| 2: Decision Branch   | Binary or multi-way decisions  | `decision_tree_flow.md`           |
| 3: Parallel          | Multiple tasks run together    | `parallel_execution.md`           |
| 4: Nested            | Embedded sub-workflows         | `user_onboarding.md`              |
| 5: Approval Gate     | Review/approval required       | `approval_workflow_loops.md`      |
| 6: Loop/Iteration    | Repeat until condition met     | `approval_workflow_loops.md`      |
| 7: Pipeline          | Sequential stages with gates   | `system_architecture_swimlane.md` |

**Workflow**: Select pattern → Build with components → Validate (`validate_flowchart.sh`) → Document

### Mode 5: Playbook Creation

**Template-First Workflow**:
1. Load `testing_playbook/manual_testing_playbook_template.md` for structure reference
2. Plan categories and Feature ID prefixes (Section 3 of template)
3. Create `manual_testing_playbook/` directory in the skill folder
4. Copy and fill the main playbook scaffold (Section 5 of template)
5. Create one per-feature file per feature under the numbered category directories at the playbook root
6. Fold the integrated review/release block into the main playbook (Section 7 of template)
7. Fold the integrated orchestration block into the main playbook (Section 8 of template)
8. Validate using the playbook checklist (Section 10 of template)

**Key Deliverables**: Root directory playbook with integrated review/orchestration sections and a per-feature file tree.

**See**:
- [manual_testing_playbook_creation.md](./references/specific/manual_testing_playbook_creation.md)
- [manual_testing_playbook_template.md](./assets/documentation/testing_playbook/manual_testing_playbook_template.md)

### Companion Pattern: Feature Catalog Creation

Use the feature-catalog reference when the task is to inventory current behavior rather than define manual execution scenarios.

**Workflow**:
1. Load [feature_catalog_creation.md](./references/specific/feature_catalog_creation.md) for package and content rules
2. Use [feature_catalog_template.md](./assets/documentation/feature_catalog/feature_catalog_template.md) for the root scaffold
3. Create numbered category folders and one per-feature file per catalog entry
4. Keep current-reality inventory in the root catalog and source anchors in the per-feature files

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ Mode 1: Document Quality

#### ✅ ALWAYS

1. **ALWAYS validate filename conventions** (snake_case, preserve README.md/SKILL.md)
2. **ALWAYS detect document type first** (applies correct enforcement level)
3. **ALWAYS verify frontmatter** for SKILL.md and Command types
4. **NEVER add TOC** (only allowed in README files)
5. **ALWAYS ask about llms.txt generation** (never auto-generate)
6. **ALWAYS apply safe auto-fixes** (H2 case, separators, filenames)
7. **ALWAYS validate before completion** (structure + content + style)
8. **ALWAYS provide metrics** (before/after counts from script output)
9. **ALWAYS run `validate_document.py` before delivery** (exit 0 required for READMEs)
10. **ALWAYS enforce Human Voice Rules (HVR)** on all documentation output. Full ruleset: [hvr_rules.md](./references/global/hvr_rules.md). Quick reference: `readme_template.md` §9.

#### ❌ NEVER

1. **NEVER modify spec files during active development** (loose enforcement)
2. **NEVER delete original content without approval**
3. **NEVER block for safe violations** (only block: missing frontmatter, wrong order)
4. **NEVER generate llms.txt without asking**
5. **NEVER apply wrong enforcement level**
6. **NEVER use banned HVR words** (leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable)

#### ⚠️ ESCALATE IF

1. Document type ambiguous
2. Critical violations detected
3. Major restructuring needed
4. Style guide missing
5. Conflicts with user intent

### Mode 2: OpenCode Component Creation

#### Skills

##### ✅ ALWAYS

1. **ALWAYS start with concrete examples** (validate understanding)
2. **ALWAYS run init_skill.py** (proper scaffolding)
3. **ALWAYS identify bundled resources** (scripts/references/assets)
4. **ALWAYS include a `REFERENCES` section** (or combined `SMART ROUTING & REFERENCES`) for packaging compatibility
5. **ALWAYS use third-person** ("Use when..." not "You should use...")
6. **ALWAYS keep SKILL.md <5k words** (move details to references/)
7. **ALWAYS delete unused examples** (keep lean)
8. **ALWAYS validate before packaging**
9. **ALWAYS recommend final review** (run `extract_structure.py`)

##### ❌ NEVER

1. **NEVER use second-person** (imperative/infinitive only)
2. **NEVER duplicate SKILL.md/references/** (progressive disclosure)
3. **NEVER create without examples**
4. **NEVER skip validation**
5. **NEVER include excessive detail** (SKILL.md is orchestrator)
6. **NEVER use vague descriptions**

##### ⚠️ ESCALATE IF

1. Skill purpose unclear
2. No concrete examples
3. Validation fails repeatedly
4. Unsupported features
5. User input required (brand assets, API docs)

#### Agents

##### ✅ ALWAYS

1. **ALWAYS load agent_template.md first** (template-first workflow)
2. **ALWAYS validate frontmatter** (name, mode, temperature, tools, permission)
3. **ALWAYS include CORE WORKFLOW section** (numbered steps)
4. **ALWAYS include ANTI-PATTERNS section** (what NOT to do)
5. **ALWAYS set explicit tool permissions** (true/false for each tool)
6. **ALWAYS test with real examples** before deployment

##### ❌ NEVER

1. **NEVER create agents without @write agent** (bypasses quality gates)
2. **NEVER skip frontmatter validation** (causes discovery failures)
3. **NEVER use vague tool permissions** (be explicit: true or false)
4. **NEVER omit anti-patterns** (agents need clear boundaries)

##### ⚠️ ESCALATE IF

1. Agent purpose overlaps with existing agent
2. Tool permissions unclear
3. Behavioral rules conflict with AGENTS.md

#### Commands

##### ✅ ALWAYS

1. **ALWAYS load command_template.md first** (template-first workflow)
2. **ALWAYS define clear triggers** (what invokes the command)
3. **ALWAYS include usage examples** (copy-paste ready)
4. **ALWAYS validate command name** (lowercase, colon-separated)

##### ❌ NEVER

1. **NEVER create commands without frontmatter** (required for discovery)
2. **NEVER use ambiguous triggers** (must be unique)
3. **NEVER skip testing** (commands must work on first invocation)

##### ⚠️ ESCALATE IF

1. Command conflicts with existing command
2. Trigger phrase is ambiguous
3. Command requires special permissions

### Mode 3: Flowchart Creation

#### ✅ ALWAYS

1. **ALWAYS use consistent box styles** (single-line process, rounded terminals, diamond decisions)
2. **ALWAYS label all decision branches** (Yes/No or specific outcomes)
3. **ALWAYS align elements** (no diagonal lines, consistent spacing)
4. **ALWAYS show complete paths** (every box has entry/exit)
5. **ALWAYS validate readability**

#### ❌ NEVER

1. **NEVER create ambiguous arrow connections**
2. **NEVER leave decision outcomes unlabeled**
3. **NEVER exceed 40 boxes** (break into sub-workflows)
4. **NEVER mix box styles inconsistently**
5. **NEVER skip spacing and alignment**

#### ⚠️ ESCALATE IF

1. Process exceeds ~40 boxes
2. Interactive/exportable format needed
3. Collaborative editing required
4. Pattern unclear

### Mode 4: Install Guide Creation

#### ✅ ALWAYS

1. **ALWAYS include AI-first install prompt** at the top
2. **ALWAYS use phase validation checkpoints** (phase_N_complete pattern)
3. **ALWAYS provide platform-specific configurations** (OpenCode, Claude Code, Claude Desktop)
4. **ALWAYS include troubleshooting section** with Error → Cause → Fix format
5. **ALWAYS verify commands are copy-paste ready**

#### ❌ NEVER

1. **NEVER skip validation checkpoints** (each phase must validate)
2. **NEVER assume prerequisites** (always list and verify)
3. **NEVER mix platform instructions** (separate clearly)
4. **NEVER use relative paths** in command examples

#### ⚠️ ESCALATE IF

1. Multi-platform complexity requires testing
2. External dependencies unavailable
3. Installation requires special permissions

### Mode 5: Playbook Creation

#### ✅ ALWAYS

1. **ALWAYS use the root playbook as the canonical package surface** for directory, review, and orchestration guidance
2. **ALWAYS use the 9-column table format** for snippet scenario definitions
3. **ALWAYS assign unique Feature IDs** across the entire playbook (PREFIX-NNN format)
4. **ALWAYS include Global Preconditions, Evidence Requirements, and Command Notation**
5. **ALWAYS include a Feature Catalog Cross-Reference Index** at the end
6. **ALWAYS mark destructive scenarios** in preconditions and the integrated root review section
7. **ALWAYS create one per-feature file per feature** under numbered category directories at the playbook root
8. **ALWAYS treat the root playbook plus per-feature files as the canonical package**, with root summaries in `MANUAL_TESTING_PLAYBOOK.md` and full execution detail in the per-feature files

#### ❌ NEVER

1. **NEVER use vague prompts** in the Exact Prompt column ("test it" is not deterministic)
2. **NEVER omit step references** in Expected Signals (must reference step numbers)
3. **NEVER leave Failure Triage empty** (every scenario needs 2+ debugging steps)
4. **NEVER reuse Feature IDs** across categories
5. **NEVER claim the current validator traverses per-feature files** or verifies cross-file playbook links
6. **NEVER describe separate review or ledger files as canonical** when documenting the current playbook contract

#### ⚠️ ESCALATE IF

1. Scenario count exceeds 200 (consider splitting into sub-playbooks)
2. Destructive scenarios affect shared production resources
3. Category boundaries overlap or are unclear

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

#### Global

- [core_standards.md](./references/global/core_standards.md) - markdown structure standards and naming conventions
- [validation.md](./references/global/validation.md) - validation pipeline and blocking criteria
- [workflows.md](./references/global/workflows.md) - execution workflows by documentation mode
- [quick_reference.md](./references/global/quick_reference.md) - fast reference for commands, gates, and file layout
- [hvr_rules.md](./references/global/hvr_rules.md) - Human Voice Rules for all documentation output

#### Specific

- [skill_creation.md](./references/specific/skill_creation.md) - skill lifecycle and packaging guidance
- [agent_creation.md](./references/specific/agent_creation.md) - agent authority, permissions, and creation workflow
- [install_guide_creation.md](./references/specific/install_guide_creation.md) - install guide standards and workflow
- [manual_testing_playbook_creation.md](./references/specific/manual_testing_playbook_creation.md) - playbook standards and workflow
- [feature_catalog_creation.md](./references/specific/feature_catalog_creation.md) - feature catalog standards and workflow

### Templates

- [skill_md_template.md](./assets/skill/skill_md_template.md) - canonical SKILL.md template
- [readme_template.md](./assets/documentation/readme_template.md) - README structure and quality rules
- [install_guide_template.md](./assets/documentation/install_guide_template.md) - install guide template
- [feature_catalog_template.md](./assets/documentation/feature_catalog/feature_catalog_template.md) - feature catalog template
- [feature_catalog_snippet_template.md](./assets/documentation/feature_catalog/feature_catalog_snippet_template.md) - feature catalog snippet template
- [manual_testing_playbook_template.md](./assets/documentation/testing_playbook/manual_testing_playbook_template.md) - manual testing playbook template
- [manual_testing_playbook_snippet_template.md](./assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md) - manual testing playbook snippet template

### Validation Scripts

- `scripts/validate_document.py`
- `scripts/extract_structure.py`
- `scripts/package_skill.py`

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Document Quality Index (DQI)

The `extract_structure.py` script computes a **DQI** (0-100) based on measurable attributes:

| Component     | Max | Measures                                          |
| ------------- | --- | ------------------------------------------------- |
| **Structure** | 40  | Checklist pass rate (type-specific)               |
| **Content**   | 30  | Word count, heading density, code examples, links |
| **Style**     | 30  | H2 formatting, dividers, intro paragraph, HVR compliance |

**HVR Compliance in DQI**: Human Voice Rules violations count against the Style component. Documents with em dashes, semicolons, banned words or banned phrases receive deductions in the Style score. Full HVR ruleset: [hvr_rules.md](./references/global/hvr_rules.md).

**Quality Bands**:

| Band           | Score  | Action                            |
| -------------- | ------ | --------------------------------- |
| **Excellent**  | 90-100 | None needed                       |
| **Good**       | 75-89  | Minor improvements                |
| **Acceptable** | 60-74  | Several areas need attention      |
| **Needs Work** | <60    | Significant improvements required |

**Example DQI Output** (from `extract_structure.py`):
```json
{
  "dqi": {
    "total": 96,
    "band": "excellent",
    "components": {
      "structure": 40,
      "content": 26,
      "style": 30
    }
  },
  "checklist": { "passed": 12, "failed": 0, "skipped": 2 },
  "documentType": "SKILL"
}
```

### Completion Checklists

**Document Quality Complete**:
- ✅ `extract_structure.py` executed, JSON parsed
- ✅ Document type detected, checklist reviewed
- ✅ Evaluation questions answered, recommendations generated
- ✅ All critical issues addressed
- ✅ HVR compliance verified (no banned words, punctuation or structure violations)

**Skill Creation Complete**:
- ✅ YAML frontmatter with name + description (third-person, specific)
- ✅ SKILL.md under 5k words, bundled resources organized
- ✅ Unused examples deleted, passes `package_skill.py`
- ✅ Final AI review completed, tested on real examples

**Agent Creation Complete**:
- ✅ YAML frontmatter with name, mode, temperature, tools, permission
- ✅ Tool permissions explicitly set (true/false for each)
- ✅ CORE WORKFLOW section with numbered steps
- ✅ ANTI-PATTERNS section with clear boundaries
- ✅ RELATED RESOURCES section with links
- ✅ Tested with real examples

**Command Creation Complete**:
- ✅ YAML frontmatter with name, description, triggers
- ✅ Clear usage examples (copy-paste ready)
- ✅ Execution logic defined
- ✅ Added to command registry
- ✅ Tested invocation works

**Flowchart Complete**:
- ✅ All paths clear, decisions labeled, parallel blocks resolve
- ✅ Spacing consistent, understandable without explanation
- ✅ Size limits: ≤40 boxes, ≤8 depth levels, ≤200 lines

**Install Guide Complete**:
- ✅ AI-first prompt included, copy-paste ready
- ✅ All 5 phases have validation checkpoints
- ✅ Platform configurations provided (at least OpenCode)
- ✅ Troubleshooting covers common errors
- ✅ Commands tested and working

**Playbook Creation Complete**:
- ✅ Root `MANUAL_TESTING_PLAYBOOK.md` exists and owns review/orchestration guidance
- ✅ Numbered category directories exist at the playbook root
- ✅ All scenario tables use 9-column format
- ✅ Every Feature ID is unique across the playbook
- ✅ Feature Catalog Cross-Reference Index matches all scenario rows
- ✅ Per-feature file links resolve from the root playbook
- ✅ Destructive scenarios identified and isolated in wave planning
- ✅ Current validator limitations are documented honestly

### Document-Type Gates

| Type      | Structure               | Content              | Required                    |
| --------- | ----------------------- | -------------------- | --------------------------- |
| SKILL.md  | Strict (no failures)    | High AI-friendliness | Frontmatter, WHEN/SMART/HOW/RULES/REFERENCES |
| README.md | Flexible                | High AI-friendliness | Quick Start, examples       |
| Knowledge | Strict (no frontmatter) | Good AI-friendliness | Numbered H2s                |

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Scripts

| Script                  | Purpose                   | Usage                                       |
| ----------------------- | ------------------------- | ------------------------------------------- |
| `validate_document.py`  | README format validation  | `scripts/validate_document.py doc.md`       |
| `extract_structure.py`  | Parse document to JSON    | `scripts/extract_structure.py doc.md`       |
| `init_skill.py`         | Scaffold skill structure  | `scripts/init_skill.py <name> --path <dir>` |
| `package_skill.py`      | Validate + package to zip | `scripts/package_skill.py <skill-path>`     |
| `quick_validate.py`     | Fast validation checks    | `scripts/quick_validate.py <skill-path>`    |
| `validate_flowchart.sh` | Flowchart validation      | `scripts/validate_flowchart.sh <file>`      |

### Tool Usage

| Tool      | Purpose                                  |
| --------- | ---------------------------------------- |
| **Read**  | Examine files before optimization        |
| **Write** | Create optimized versions or llms.txt    |
| **Edit**  | Apply specific transformations           |
| **Bash**  | Execute scripts                          |
| **Glob**  | Find markdown files for batch processing |
| **Grep**  | Search for patterns/violations           |

### Related Skills

| Skill               | Integration                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| **system-spec-kit** | Context files can be optimized. Validates spec folder documentation structure. |
| **sk-git**   | Uses documentation quality for commit/PR descriptions                         |

### Workflow Integration

**Skill Creation → Document Quality**:
1. Initialize (`init_skill.py`)
2. Edit SKILL.md and resources
3. Package (`package_skill.py`)
4. Quality validation (`extract_structure.py`)
5. Iterate if needed

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:external-resources -->
## 8. EXTERNAL RESOURCES

- **llms.txt specification**: https://llmstxt.org/
- **Context7 (external docs benchmark)**: https://context7.ai/
- **Anthropic documentation**: https://docs.anthropic.com/
- **CommonMark specification**: https://spec.commonmark.org/

---

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### For Document Quality

1. Read Sections 1-4 for activation, routing, workflow and rules.
2. Use Section 5 for canonical references and templates.
3. Navigate: [workflows.md](./references/global/workflows.md) for execution modes.
4. Run enforcement, optimization, or validation as needed.

### For Skill Creation

1. Read Sections 1-4 for activation, routing, workflow and rules.
2. Use Section 5 for canonical references and templates.
3. Navigate: [skill_creation.md](./references/specific/skill_creation.md) for workflow.
4. For layered skills, use [skill_creation.md](./references/specific/skill_creation.md) (Section 9).
5. Use templates: [skill_md_template.md](./assets/skill/skill_md_template.md), [skill_reference_template.md](./assets/skill/skill_reference_template.md), [skill_asset_template.md](./assets/skill/skill_asset_template.md).
6. Use scripts: `init_skill.py` -> edit -> `package_skill.py`.
7. Validate: run Document Quality validation on SKILL.md.

### Quick Reference

Need fast navigation? See [quick_reference.md](./references/global/quick_reference.md)

---

**Remember**: This skill operates in five modes: Document Quality, Skill Creation, Flowchart Creation, Install Guide Creation and Playbook Creation. All modes integrate smoothly for creating and validating high-quality documentation and skills.
<!-- /ANCHOR:related-resources -->
