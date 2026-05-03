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

**Changelog & Release Notes** - Use `changelog_template.md` when:
- Authoring a global component changelog at `.opencode/changelog/{NN--component}/v{VERSION}.md`
- Composing GitHub release notes that mirror the changelog body
- Choosing between compact (under 10 changes) and expanded (10+ changes or major) formats
- Template: [changelog_template.md](./assets/documentation/changelog_template.md). Used by `/create:changelog` (auto + confirm). Nested packet-local changelogs use the spec-kit templates at `.opencode/skill/system-spec-kit/templates/changelog/` instead.

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

**Canonical Package**: Root `manual_testing_playbook.md` plus numbered category folders with one per-feature file per feature ID.

**See**:
- [manual_testing_playbook_creation.md](./references/specific/manual_testing_playbook_creation.md)
- [manual_testing_playbook_template.md](./assets/documentation/testing_playbook/manual_testing_playbook_template.md)

### Use Case: Feature Catalog Creation

Create feature catalogs with a rooted feature inventory, numbered category sections, and per-feature reference files.

**Feature Catalog** - Use `assets/documentation/feature_catalog/feature_catalog_template.md` when:
- Creating a canonical current-state feature inventory for a skill or system
- Linking manual playbooks back to a stable feature reference
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

## 2. SMART ROUTING

> Pattern: see [sk-doc smart-router resilience template](./assets/skill/skill_smart_router.md).

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/global/` for documentation standards, validation rules, optimization guidance, voice rules, and shared execution workflows.
- `references/specific/` for document-family and component creation guides such as skill creation, agent creation, install guides, feature catalogs, and manual testing playbooks.
- `assets/documentation/` for README, frontmatter, llms.txt, install-guide, and changelog/release-notes templates.
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

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, checks `inventory`, and suppresses repeats with `seen`.
- Pattern 3: Extensible Routing Key - intent labels route to document families without static inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests disambiguation and missing families return a "no knowledge base" notice.

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
    "FEATURE_CATALOG": {"weight": 4, "keywords": ["feature catalog", "feature inventory", "catalog snippet"]},
    "README_CREATION": {"weight": 3, "keywords": ["create readme", "readme creation", "write readme", "add documentation", "folder readme"]},
    "CHANGELOG": {"weight": 4, "keywords": ["changelog", "release notes", "changelog template", "release template", "create changelog", "github release"]},
}

RESOURCE_MAP = {
    "DOC_QUALITY": ["references/global/validation.md", "references/global/workflows.md", "references/global/core_standards.md", "references/global/evergreen_packet_id_rule.md"],
    "OPTIMIZATION": ["references/global/optimization.md", "assets/documentation/llmstxt_templates.md"],
    "SKILL_CREATION": ["references/specific/skill_creation.md", "assets/skill/skill_md_template.md", "assets/skill/skill_reference_template.md"],
    "AGENT_COMMAND": ["references/specific/agent_creation.md", "assets/agents/agent_template.md", "assets/agents/command_template.md"],
    "FLOWCHART": ["assets/flowcharts/simple_workflow.md", "assets/flowcharts/decision_tree_flow.md"],
    "INSTALL_GUIDE": ["assets/documentation/install_guide_template.md", "references/specific/install_guide_creation.md"],
    "HVR": ["references/global/hvr_rules.md"],
    "PLAYBOOK": ["references/specific/manual_testing_playbook_creation.md", "assets/documentation/testing_playbook/manual_testing_playbook_template.md"],
    "FEATURE_CATALOG": ["references/specific/feature_catalog_creation.md", "assets/documentation/feature_catalog/feature_catalog_template.md"],
    "README_CREATION": ["references/specific/readme_creation.md", "assets/documentation/readme_template.md"],
    "CHANGELOG": ["assets/documentation/changelog_template.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full standards", "all templates", "deep dive", "readme", "documentation", "manual testing playbook", "feature catalog", "release notes", "corpus/readme", "corpus documentation"],
    "ON_DEMAND": ["assets/documentation/frontmatter_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is document quality, component creation, flowchart, install guide, playbook, or catalog work",
    "Confirm the expected output file or component type",
    "Provide one example input or target document",
    "Confirm whether full templates or a quick reference are needed",
]

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
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)
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

    if max(scores.values() or [0]) < 0.5:
        return {
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    result = {"intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```

---

## 3. HOW IT WORKS

### Mode 1: Document Quality

**Evergreen packet-ID rule**: Runtime-state docs such as README, INSTALL_GUIDE, ARCHITECTURE, SKILL, AGENTS, CLAUDE, references, feature catalogs, manual testing playbooks, and ENV_REFERENCE must not cite mutable spec or phase packet numbers. Use current feature names, file paths, commands, and source anchors instead. See [evergreen_packet_id_rule.md](./references/global/evergreen_packet_id_rule.md).

Run `scripts/extract_structure.py` for structure, metrics, DQI, and checklist data. Detect document type first, then apply the right enforcement level: SKILL and command docs are strict, README docs are usability-focused, knowledge docs are moderately strict, and active spec docs are loose unless the task explicitly asks for enforcement.

### Mode 2: OpenCode Component Creation

#### Skill Creation

Use progressive disclosure: metadata stays in frontmatter, SKILL.md stays concise, and deep details move to references or assets. Define scope with [skill_creation.md](./references/specific/skill_creation.md) and use the skill templates under `assets/skill/`.

#### Smart Router (Resilience Pattern)

Newly scaffolded skills include the resilient smart-router skeleton by default. Fill in the skill-specific intent model, resource map, loading levels, and routing key while preserving runtime markdown discovery, `_guard_in_skill()` path sandboxing, `load_if_available()` existence checks, `UNKNOWN_FALLBACK` disambiguation, and a helpful notice when keyed resources are absent. Full reference: [skill_smart_router.md](./assets/skill/skill_smart_router.md).

**After packaging**: Run `extract_structure.py` on SKILL.md for final quality review.

#### Agent Creation

Load `agent_template.md`, define explicit tool and action permissions, include workflow/scope/anti-pattern sections, validate frontmatter, and test with examples. Agents use permission fields, not a skill-style allowed-tools array.

#### Command Creation

Load `command_template.md`, define name/description/triggers, write executable logic, add registry wiring where required, and test invocation.

### Mode 3: Flowchart Creation

Select a pattern from `assets/flowcharts/`, build with consistent ASCII components, label decisions, and validate readability with `validate_flowchart.sh` when available.

### Mode 5: Playbook Creation

Use [manual_testing_playbook_creation.md](./references/specific/manual_testing_playbook_creation.md) and the testing playbook template. The root playbook owns package guidance; per-feature files live under numbered category folders.

### Companion Pattern: Feature Catalog Creation

Use [feature_catalog_creation.md](./references/specific/feature_catalog_creation.md) when inventorying current behavior. Keep summary inventory in the root catalog and source anchors in per-feature files.

---

## 4. RULES

### ✅ ALWAYS

1. Detect document/component type before enforcement.
2. Load the relevant template or reference before creating components.
3. Keep SKILL.md concise; move deep detail into references or assets.
4. Validate frontmatter for SKILL, agent, and command docs.
5. Validate before delivery with the appropriate sk-doc script.
6. Preserve README.md/SKILL.md casing and enforce snake_case elsewhere.
7. Keep playbooks rooted in `manual_testing_playbook.md` with per-feature files under numbered categories.

### ❌ NEVER

1. Delete original content without approval.
2. Generate llms.txt without explicit request.
3. Add a ToC outside README/research surfaces.
4. Use ambiguous agent permissions, command triggers, or playbook prompts.
5. Duplicate long guidance in SKILL.md when a reference or asset can carry it.

### ⚠️ ESCALATE IF

1. Document type, component purpose, or category boundary is unclear.
2. Critical frontmatter or structure validation fails repeatedly.
3. Brand assets, API docs, destructive test scope, or external permissions are required.
4. Flowcharts exceed practical ASCII size or need an interactive/exportable format.

---

## 5. REFERENCES

The router discovers available markdown resources dynamically; do not maintain exhaustive file inventories here. Start with [quick_reference.md](./references/global/quick_reference.md), then load routed references and templates through the smart router.

Primary scripts: `scripts/validate_document.py`, `scripts/extract_structure.py`, `scripts/init_skill.py`, `scripts/package_skill.py`, `scripts/quick_validate.py`, and `scripts/validate_flowchart.sh`.

---

## 6. SUCCESS CRITERIA

### Completion Checks

- Document quality: structure extracted, document type detected, critical issues addressed, validation script passes.
- Skill creation: frontmatter is specific, SKILL.md is concise, resources are organized, packaging validation passes.
- Agent/command creation: frontmatter is valid, permissions or triggers are explicit, examples are tested.
- Flowcharts: paths are clear, decisions are labeled, spacing is readable, size limits are respected.
- Install guides/playbooks/catalogs: required templates are filled, links resolve, and known validator limits are stated honestly.

### Document-Type Gates

| Type      | Structure               | Content              | Required                    |
| --------- | ----------------------- | -------------------- | --------------------------- |
| SKILL.md  | Strict (no failures)    | High AI-friendliness | Frontmatter, WHEN/SMART/HOW/RULES/REFERENCES |
| README.md | Flexible                | High AI-friendliness | Quick Start, examples       |
| Knowledge | Strict (no frontmatter) | Good AI-friendliness | Numbered H2s                |

---

## 7. INTEGRATION POINTS

This skill works with `system-spec-kit` for packet documentation and `sk-git` for commit/PR text quality. Treat spec docs as canonical continuity surfaces and use `/spec_kit:resume` recovery order: `handover.md -> _memory.continuity -> spec docs`.

Need fast navigation? See [quick_reference.md](./references/global/quick_reference.md).

---

**Remember**: This skill operates in five modes: Document Quality, Skill Creation, Flowchart Creation, Install Guide Creation and Playbook Creation.
