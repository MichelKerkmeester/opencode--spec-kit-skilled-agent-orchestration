---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), Level contract template architecture, validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.3.1.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.

## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md, and implementation-summary.md when work is complete) plus optional support folders such as `scratch/`, `research/`, or `review/`

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze, phase

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.
Status: ✅ This requirement applies immediately once file edits are requested.

### Distributed Governance Rule

Any agent writing authored spec folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `review-report.md`, `debug-delegation.md`, `resource-map.md` (optional)) MUST use contract-backed templates through `create.sh` or the inline renderer. This is a workflow-required gate, not a runtime hook: run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after authored spec-doc writes and before completion claims, then route continuity updates through /memory:save. Deep-research workflow-owned packet markdown (`research/iterations/*.md`, `research/deep-research-*.md`, and progressive `research/research.md` loop updates) is exempt from that generic per-write rule; `/spec_kit:deep-research` must instead run targeted strict validation after every `spec.md` mutation it performs. @deep-research retains exclusive write access for `research/research.md`; @debug retains exclusive write access for `debug-delegation.md`.

- `handover.md` stays in the canonical recovery ladder and is maintained through `/memory:save` handover_state routing using the handover template for initial creation.
- `review-report.md` remains owned by `@deep-review` when deep review workflows synthesize findings.
- `resource-map.md` is a peer cross-cutting template under `.opencode/skill/system-spec-kit/templates/`; it remains optional at any level and gives reviewers a lean file ledger alongside `implementation-summary.md`.

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest `/memory:save` handover maintenance |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest Task-tool debug delegation |

**Rule:** When detected, proactively suggest the appropriate action.

---

## 2. SMART ROUTING


### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template selection, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/config/` for runtime environment configuration.

### Template and Script Sources of Truth

- Level definitions and template size guidance: level specifications reference
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use the Level contract for operational templates; `create.sh` and the Level contract resolver share the same template index.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `mcp_server/lib/templates/level-contract-resolver.ts`

CLI exit codes:
- `0`: success.
- `1`: user error such as bad flags or invalid input.
- `2`: validation error.
- `3`: system error such as missing folders, missing manifests, or file I/O failures.

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, including `/spec_kit:plan --intake-only` as the standalone intake entry, `/spec_kit:plan` and `/spec_kit:complete` smart delegation notes, and the pointer from `/spec_kit:deep-research` to `../sk-deep-research/references/spec_check_protocol.md`, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, de-duplicates with `seen`, and checks `inventory`.
- Pattern 3: Extensible Routing Key - command and intent signals select routing labels without static file inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` asks for disambiguation and missing-resource cases return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
                "references/templates/template_guide.md",
        "references/validation/template_compliance_contract.md",
    ],
    "RESEARCH": [
        "references/workflows/quick_reference.md",
        "references/workflows/worked_examples.md",
        "references/memory/epistemic_vectors.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation_rules.md",
        "references/validation/template_compliance_contract.md",
        "references/templates/template_guide.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/workflows/quick_reference.md",
        "manual_testing_playbook/manual_testing_playbook.md",
    ],
    "COMPLETE": [
        "references/validation/validation_rules.md",
        "references/workflows/nested_changelog.md",
    ],
    "MEMORY": [
        "references/memory/memory_system.md",
        "references/memory/save_workflow.md",
        "references/memory/trigger_config.md",
    ],
    "HANDOVER": [
        "references/workflows/quick_reference.md",
    ],
    "PHASE": [
        "references/structure/phase_definitions.md",
        "references/structure/sub_folder_versioning.md",
        "references/validation/phase_checklists.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedding_resilience.md",
        "references/memory/trigger_config.md",
    ],
    "EVALUATION": [
        "references/memory/epistemic_vectors.md",
        "references/config/environment_variables.md",
        "manual_testing_playbook/manual_testing_playbook.md",
    ],
    "SCORING_CALIBRATION": [
        "references/config/environment_variables.md",
    ],
    "ROLLOUT_FLAGS": [
        "references/config/environment_variables.md",
        "feature_catalog/19--feature-flag-reference/",
    ],
    "GOVERNANCE": [
        "references/config/environment_variables.md",
    ],
}

COMMAND_BOOSTS = {
    "/spec_kit:plan": "PLAN",
    "/spec_kit:implement": "IMPLEMENT",
    "/spec_kit:complete": "COMPLETE",
    "/spec_kit:plan :with-phases": "PHASE",
    "/memory:search": "MEMORY",
    "/memory:save": "MEMORY",
    "/memory:manage": "MEMORY",
    "/memory:learn": "MEMORY",
    "/spec_kit:resume": "MEMORY",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full validation", "full checklist", "full template", "save context", "/memory:save", "/spec_kit:resume", "implementation-summary", "tasks.md", "spec folder", "phase folder", "description metadata"],
    "ON_DEMAND": [
        "references/validation/phase_checklists.md",
        "references/templates/template_guide.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is planning, memory, validation, phase, debug, or completion work",
    "Confirm the target spec folder or command surface",
    "Provide one concrete file, error, or expected output",
    "Confirm which verification gate must pass",
]

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    """Allow markdown loads only within this skill folder."""
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    """Recursively discover routable markdown docs for this skill only."""
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted scoring from request text, keywords, and explicit command boosts."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}

    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]

    command = str(getattr(task, "command", "")).lower()
    for prefix, intent in COMMAND_BOOSTS.items():
        if command.startswith(prefix):
            scores[intent] += 6

    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    """Return primary intent and secondary intent when scores are close."""
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["IMPLEMENT"]

    selected = [ranked[0][0]]
    if len(ranked) > 1:
        primary_score = ranked[0][1]
        secondary_intent, secondary_score = ranked[1]
        if secondary_score > 0 and (primary_score - secondary_score) <= ambiguity_delta:
            selected.append(secondary_intent)

    return selected[:max_intents]

def route_speckit_resources(task):
    """Scoped, recursive, weighted, ambiguity-aware routing."""
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

    # ALWAYS: base references for every invocation
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

    # CONDITIONAL: intent-scored resources
    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    # ON_DEMAND: explicit deep-dive requests
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

### Core Workflow

1. Gate 3 selects an existing, new, related, skipped, or phase spec folder before file changes.
2. For new folders, estimate level from LOC, risk, affected systems, and verification needs; create from contract-backed templates.
3. Keep phase parents lean: parent folders hold `spec.md`, `description.json`, and `graph-metadata.json`; child phases hold working docs.
4. Use checklist priority as the completion gate: P0 cannot defer, P1 requires completion or approved deferral, and P2 is optional.
5. Preserve continuity in `implementation-summary.md` or through canonical `/memory:save` with `generate-context.js`.

### Spec Kit Memory

Spec Kit Memory provides context retrieval, search, save, checkpoint, health, and indexing surfaces. Use `memory_context()` or `/spec_kit:resume` for recovery; use `memory_search()` for targeted retrieval; use `generate-context.js` for canonical saves. Detailed behavior, flags, scoring, and MCP tool reference live in `references/memory/memory_system.md`, `references/memory/save_workflow.md`, and `mcp_server/ENV_REFERENCE.md`.

### Validation and Recovery

Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` before completion claims. Validation errors block completion; warnings must be addressed or documented. Startup, resume, hook, code graph, and CocoIndex readiness details live in `references/config/hook_system.md`, `mcp_server/hooks/copilot/README.md`, and the code graph references.

### Code Graph and Search Routing

Use CocoIndex for semantic discovery, Code Graph for structural relationships, and Spec Kit Memory for prior decisions and continuity. `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, and `detect_changes` share the readiness contract and return blocked/degraded payloads rather than silent empty answers when graph state is stale.

---

## 4. RULES

### ✅ ALWAYS

1. **Determine level (1/2/3/3+) before ANY file changes** - Count LOC, assess complexity/risk
2. **Scaffold from contract-backed templates** - Use `create.sh` or `inline-gate-renderer`, NEVER create from scratch
3. **Fill ALL placeholders** - Remove placeholder markers and sample content
4. **Ask A/B/C/D/E when file modification detected** - Present options, wait for selection
5. **Check for related specs before creating new folders** - Search keywords, review status
6. **Get explicit user approval before changes** - Show level, path, templates, approach
7. **Use consistent folder naming** - `specs/###-short-name/` format
8. **Use checklist.md to verify (Level 2+)** - Load before claiming done
9. **Mark items `[x]` with evidence** - Include links, test outputs, screenshots
10. **Complete P0/P1 before claiming done** - No exceptions
11. **Suggest handover.md on session-end keywords** - "continue later", "next session"
12. **Run validate.sh before completion** - Completion Verification requirement
13. **Create implementation-summary.md at end of implementation phase (Level 1+)** - Document what was built
14. **Suggest /memory:save when session-end keywords detected OR after extended work (15+ tool calls)** - Proactive context preservation
15. **Suggest Task-tool debug delegation after 3+ failed fix attempts on same error** - Do not continue without offering a fresh debugging pass
16. **Suggest /spec_kit:plan :with-phases when task requires multi-phase decomposition** - Complex specs spanning multiple sessions or workstreams
17. **Route all code creation/updates through `sk-code-opencode`** - Full alignment is mandatory before claiming completion
18. **Route all documentation creation/updates through `sk-doc`** - Full alignment is mandatory before claiming completion
19. **Enforce ToC policy from validation rules** - Only `research/research.md` may include a Table of Contents section; remove ToC headings from standard spec artifacts

### ❌ NEVER

1. **Create documentation from scratch** - Use templates only
2. **Skip spec folder creation** - Unless user explicitly selects D
3. **Make changes before spec + approval** - Spec folder is prerequisite
4. **Leave placeholders in final docs** - All must be replaced
5. **Decide autonomously update vs create** - Always ask user
6. **Claim done without checklist verification** - Level 2+ requirement
7. **Proceed without spec folder confirmation** - Wait for A/B/C/D/E
8. **Skip validation before completion** - Completion Verification hard block
9. **Add ToC sections to standard spec artifacts** - `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`, and `resource-map.md` must not contain ToC headings

### ⚠️ ESCALATE IF

1. **Scope grows during implementation** - Run `upgrade-level.sh` to add higher-level templates (recommended), then auto-populate all placeholder content:
   - Read all existing spec files (spec.md, plan.md, tasks.md, implementation-summary.md) for context
   - Replace every placeholder marker pattern in newly injected sections with content derived from that context
   - For sections without sufficient source context, write "N/A - insufficient source context" instead of fabricating content
   - Run `check-placeholders.sh <spec-folder>` to verify zero placeholders remain (see level specifications reference for the full procedure)
   - Document the level change in changelog
2. **Uncertainty about level <80%** - Present level options to user, default to higher
3. **Template doesn't fit requirements** - Adapt closest template, document modifications
4. **User requests skip (Option D)** - Warn about tech debt, explain debugging challenges, confirm consent
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

---

## 5. SUCCESS CRITERIA

Success means the selected spec folder uses the right template set, placeholders and sample content are removed, links between packet docs work, continuity is saved or updated, Level 2+ checklist P0/P1 items are verified with evidence, and `validate.sh --strict` has no blocking errors.

---

## 6. INTEGRATION POINTS

P0 blocks, P1 requires completion or approved deferral, and P2 is optional. Code updates route through `sk-code-opencode`; documentation updates route through `sk-doc`; git handoff routes through `sk-git`.

### Quick Reference Commands

| Command | Usage |
| --- | --- |
| Canonical intake | `/spec_kit:plan --intake-only "Description"` |
| Create spec folder | `./scripts/spec/create.sh "Description" --short-name name --level 2` |
| Validate | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/007-feature/` |
| Verify code alignment drift | `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` |
| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/007-feature/` |
| Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
| Upgrade level | `bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh specs/007-feature/ --to 2` |
| Completeness | `.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh specs/007-feature/` |

Canonical command lifecycle: `/spec_kit:plan --intake-only` establishes or repairs the packet when standalone intake is needed, `/spec_kit:deep-research` follows `../sk-deep-research/references/spec_check_protocol.md` when research needs bounded `spec.md` anchoring, and `/spec_kit:plan` or `/spec_kit:complete` continue from the same folder while reusing the shared intake contract (`.opencode/skill/system-spec-kit/references/intake-contract.md`) only when the local `folder_state` still needs repair. When intake runs, the returned `start_state` is the canonical downstream field.

---

## 7. RELATED RESOURCES

Related resources: contract templates, validation at `scripts/spec/validate.sh`, canonical save at `scripts/dist/memory/generate-context.js`, memory server at `mcp_server/context-server.ts`, and current-reality docs in `feature_catalog/` plus `manual_testing_playbook/`.

---

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and workflow-required validation for all file modifications. Every conversation that modifies files MUST have a spec folder.
