---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.2.0.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md) plus optional memory/ and scratch/ subdirectories

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

### Agent Exclusivity

**⛔ CRITICAL:** `@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files).

- **Requires @speckit:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other *.md in spec folders
- **Exceptions:**
  - `memory/` → uses generate-context.js script
  - `scratch/` → temporary workspace, any agent
  - `handover.md` → @handover agent only
  - `research/research.md` → @deep-research agent only
  - `debug-delegation.md` → @debug agent only

Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |

**Rule:** When detected, proactively suggest the appropriate action.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template composition, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/config/` for runtime environment configuration.

### Template and Script Sources of Truth

- Level definitions and template size guidance: [level_specifications.md](./references/templates/level_specifications.md)
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use `templates/level_N/` for operational templates; `core/` and `addendum/` remain composition inputs.
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
- `templates/compose.sh`

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

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
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "shared memory", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/templates/level_specifications.md",
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
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
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
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
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
    "/spec_kit:debug": "DEBUG",
    "/spec_kit:complete": "COMPLETE",
    "/spec_kit:handover": "HANDOVER",
    "/spec_kit:plan :with-phases": "PHASE",
    "/memory:search": "MEMORY",
    "/memory:save": "MEMORY",
    "/memory:manage": "MEMORY",
    "/memory:learn": "MEMORY",
    "/spec_kit:resume": "MEMORY",
    "/memory:manage shared": "GOVERNANCE",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full validation", "full checklist", "full template"],
    "ON_DEMAND": [
        "references/validation/phase_checklists.md",
        "references/templates/template_guide.md",
    ],
}

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
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
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

    # CONDITIONAL: intent-scored resources
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    # ON_DEMAND: explicit deep-dive requests
    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Gate 3 Integration

> **See AGENTS.md Section 2** for the complete Gate 3 flow. This skill implements that gate.

When file modification detected, AI MUST ask:

```
**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., specs/NNN-name/001-phase/)
```

| Option          | Description                        | Best For                        |
| --------------- | ---------------------------------- | ------------------------------- |
| **A) Existing** | Continue in related spec folder    | Iterative work, related changes |
| **B) New**      | Create `specs/###-name/`           | New features, unrelated work    |
| **C) Update**   | Add to existing documentation      | Extending existing docs         |
| **D) Skip**     | No spec folder (creates tech debt) | Trivial changes only            |

**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`.

**Coordination Roots**: For large multi-phase efforts, the root `spec.md` serves as a coordination document with point-in-time snapshots of directory counts and phase status.
Current tree truth takes precedence over historical synthesis (ref: ADR-001 pattern).

### Complexity Detection (Option B Flow)

When user selects **B) New**, AI estimates complexity and recommends a level:

1. Estimate LOC, files affected, risk factors
2. Recommend level (1, 2, 3, or 3+) with rationale
3. User accepts or overrides
4. Run `./scripts/spec/create.sh --level N`

**Level Guidelines:**

| LOC     | Level | Template Folder       |
| ------- | ----- | --------------------- |
| <100    | 1     | `templates/level_1/`  |
| 100-499 | 2     | `templates/level_2/`  |
| ≥500    | 3     | `templates/level_3/`  |
| Complex | 3+    | `templates/level_3+/` |

**See:** [quick_reference.md](./references/workflows/quick_reference.md) for detailed examples.

**CLI Tool:**
```bash
# Create spec folder with level 2 templates
./scripts/spec/create.sh "Add OAuth2 with MFA" --level 2

# Create spec folder with level 3+ (extended) templates
./scripts/spec/create.sh "Major platform migration" --level 3+
```

### 3-Level Progressive Enhancement (CORE + ADDENDUM v2.2)

Higher levels ADD VALUE, not just length. Each level builds on the previous:

```
Level 1 (Core):         Essential what/why/how (~455 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~875 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs, risk matrix (~1090 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~1075 LOC)
```

| Level  | LOC Guidance | Required Files                                        | What It ADDS                                |
| ------ | ------------ | ----------------------------------------------------- | ------------------------------------------- |
| **1**  | <100         | spec.md, plan.md, tasks.md, implementation-summary.md | Essential what/why/how                      |
| **2**  | 100-499      | Level 1 + checklist.md                                | Quality gates, verification, NFRs           |
| **3**  | ≥500         | Level 2 + decision-record.md                          | Architecture decisions, ADRs                |
| **3+** | Complex      | Level 3 + extended content                            | Governance, approval workflow, AI protocols |

**Level Selection Examples:**

| Task                 | LOC Est. | Level | Rationale                      |
| -------------------- | -------- | ----- | ------------------------------ |
| Fix CSS alignment    | 10       | 1     | Simple, low risk               |
| Add form validation  | 80       | 1-2   | Borderline, low complexity     |
| Modal component      | 200      | 2     | Multiple files, needs QA       |
| Auth system refactor | 600      | 3     | Architecture change, high risk |
| Database migration   | 150      | 3     | High risk overrides LOC        |

**Override Factors (can push to higher level):**
- High complexity or architectural changes
- Risk (security, config cascades, authentication)
- Multiple systems affected (>5 files)
- Integration vs unit test requirements

**Decision rule:** When in doubt → choose higher level. Better to over-document than under-document.

### Checklist as Verification Tool (Level 2+)

The `checklist.md` is an **ACTIVE VERIFICATION TOOL**, not passive documentation:

| Priority | Meaning      | Deferral Rules                          |
| -------- | ------------ | --------------------------------------- |
| **P0**   | HARD BLOCKER | MUST complete, cannot defer             |
| **P1**   | Required     | MUST complete OR user-approved deferral |
| **P2**   | Optional     | Can defer without approval              |

**AI Workflow:**
1. Load checklist.md at completion phase
2. Verify items in order: P0 → P1 → P2
3. Mark `[x]` with evidence for each verified item
4. Cannot claim "done" until all P0/P1 items verified

**Evidence formats:**
- `[Test: npm test - all passing]`
- `[File: src/auth.ts:45-67]`
- `[Commit: abc1234]`
- `[Screenshot: evidence/login-works.png]`
- `(verified by manual testing)`
- `(confirmed in browser console)`

**Example checklist entry:**
```markdown
## P0 - Blockers
- [x] Auth flow working [Test: npm run test:auth - 12/12 passing]
- [x] No console errors [Screenshot: evidence/console-clean.png]

## P1 - Required  
- [x] Unit tests added [File: tests/auth.test.ts - 8 new tests]
- [ ] Documentation updated [DEFERRED: Will complete in follow-up PR]
```

### Folder Naming Convention

**Format:** `specs/###-short-name/`

**Rules:**
- 2-3 words (shorter is better)
- Lowercase, hyphen-separated
- Action-noun structure
- 3-digit padding: `001`, `042`, `099` (no padding past 999)

**Good examples:** `fix-typo`, `add-auth`, `mcp-code-mode`, `cli-codex`
**Bad examples:** `new-feature-implementation`, `UpdateUserAuthSystem`, `fix_bug`

**Find next number:**
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

### Sub-Folder Versioning

When reusing spec folders with existing content:
- Trigger: Option A selected + root-level content exists
- Pattern: `001-original/`, `002-new-work/`, `003-another/`
- Memory: Each sub-folder has independent `memory/` directory
- Tracking: Saves pass the target spec folder alongside structured JSON via the generate-context script

**Example structure:**
```
specs/007-auth-system/
├── 001-initial-implementation/
│   ├── spec.md
│   ├── plan.md
│   └── memory/
├── 002-oauth-addition/
│   ├── spec.md
│   ├── plan.md
│   └── memory/
└── 003-security-audit/
    ├── spec.md
    └── memory/
```

**Full documentation:** See [sub_folder_versioning.md](./references/structure/sub_folder_versioning.md)

### Context Preservation

**Manual context save (MANDATORY workflow):**
- Trigger: `/memory:save`, "save context", or "save memory"
- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- **NEVER:** Create memory files manually via Write/Edit (AGENTS.md Memory Save Rule)
- **JSON mode (PREFERRED):** AI composes structured JSON → pass via `--json`, `--stdin`, or temp file. The AI has strictly better information about its own session than any DB query.
- **Structured JSON fields:** The JSON payload supports optional structured summary fields that improve memory quality:
  - `toolCalls[]` — AI-composed tool call records (`tool`, `inputSummary`, `outputSummary`, `status`)
  - `exchanges[]` — Key conversation turns (`userInput`, `assistantResponse`, `timestamp`)
  - `preflight` / `postflight` — Epistemic baseline snapshots (`knowledgeScore`, `uncertaintyScore`, `contextScore`, `gaps[]`, `confidence`)
  - `sessionSummary` — Free-text session narrative (used for conversation synthesis when conversation prompts are sparse)
  - The AI has strictly better information about its own session than any DB extraction; these fields provide richer context at source.
- Location: `specs/###-folder/memory/`
- Filename: `DD-MM-YY_HH-MM__topic.md` (auto-generated by script)
- Content includes: PROJECT STATE SNAPSHOT with Phase, Last Action, Next Action, Blockers

**Subfolder Support:**

The generate-context script supports nested spec folder paths (parent/child format):

```bash
# Full nested path (parent/child)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"02--system-spec-kit/121-script-audit","sessionSummary":"..."}' 02--system-spec-kit/121-script-audit

# Bare child name (auto-searches all parents for unique match)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"121-script-audit","sessionSummary":"..."}' 121-script-audit

# With specs/ prefix
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"specs/02--system-spec-kit/121-script-audit","sessionSummary":"..."}' specs/02--system-spec-kit/121-script-audit

# Flat folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"02--system-spec-kit","sessionSummary":"..."}' 02--system-spec-kit
```

Memory files are always saved to the child folder's `memory/` directory (e.g., `specs/02--system-spec-kit/121-script-audit/memory/`). If a bare child name matches multiple parents, the script reports an error and requires the full `parent/child` path.

**Memory File Structure:**
```markdown
## Project Context
[Auto-generated summary of conversation and decisions]

## Project State Snapshot
- Phase: Implementation
- Last Action: Completed auth middleware
- Next Action: Add unit tests for login flow
- Blockers: None

## Key Artifacts
- Modified: src/middleware/auth.ts
- Created: src/utils/jwt.ts
```

### Spec Kit Memory System (Integrated)

Context preservation across sessions via 5-channel hybrid retrieval (vector, FTS5, BM25, graph, and degree) with Reciprocal Rank Fusion, intent-aware routing, and post-fusion reranking/filtering.

**Server:** `@spec-kit/mcp-server` v1.7.2 — `context-server.ts` with 43 MCP tools across 7 layers. The tool surface is defined in `mcp_server/tool-schemas.ts`.

**Memory Commands:** 4 memory slash commands (`/memory:save`, `/memory:manage`, `/memory:learn`, `/memory:search`) cover the memory command surface, with shared-memory operations available under `/memory:manage shared`, while `/spec_kit:resume` owns session recovery through the broader memory/session recovery stack. The `/memory:search` command covers all analysis and retrieval workflows. See `.opencode/command/memory/` and `.opencode/command/spec_kit/resume.md` for command documentation.

**MCP Tools (18 most-used of 43 total — see [memory_system.md](./references/memory/memory_system.md) for full reference):**

| Tool                            | Layer | Purpose                                           |
| ------------------------------- | ----- | ------------------------------------------------- |
| `memory_context()`              | L1    | Unified entry point — modes: auto, quick, deep, focused, resume |
| `memory_search()`               | L2    | 5-channel hybrid retrieval with intent-aware routing, channel normalization, graph/degree signals, reranking, and filtered output |
| `memory_quick_search()`         | L2    | Simplified search (query + optional spec folder)  |
| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
| `memory_save()`                 | L2    | Index a memory file with pre-flight validation    |
| `memory_list()`                 | L3    | Browse stored memories with pagination (parent rows by default) |
| `memory_delete()`               | L4    | Delete memories by ID or spec folder              |
| `checkpoint_create()`           | L5    | Create gzip-compressed checkpoint snapshot        |
| `checkpoint_restore()`          | L5    | Transaction-wrapped restore with rollback         |
| `memory_stats()`                | L3    | System statistics and memory counts                |
| `memory_health()`              | L3    | Diagnostics: orphan detection, index consistency   |
| `shared_memory_status()`        | L5    | Shared-memory subsystem status check               |
| `memory_index_scan()`          | L7    | Workspace scanning and re-indexing                 |
| `checkpoint_list()`            | L5    | List available checkpoint snapshots                |
| `checkpoint_delete()`          | L5    | Delete checkpoint by name (with confirmName safety)|
| `shared_memory_enable()`        | L5    | Enable shared-memory collaboration subsystem       |
| `shared_space_upsert()`         | L5    | Create or update shared collaboration space        |
| `shared_space_membership_set()` | L5    | Set membership for shared collaboration space      |

> **Search architecture:** The search pipeline uses a 4-stage architecture (candidate generation → fusion → reranking → filtering). Current retrieval uses five channels, normalizes fallback thresholds correctly, keeps disabled channels disabled through fallback, defers irreversible confidence truncation until after reranking, and enforces token budgets using actual post-truncation counts. See [search/README.md](./mcp_server/lib/search/README.md) for pipeline details, scoring algorithms, and graph signal features.

**memory_context() — Mode Routing:**

| Mode | Token Budget | When `mode=auto`: Intent Routing |
| --- | --- | --- |
| `quick` | 800 | — |
| `deep` | 3500 | `add_feature`, `refactor`, `security_audit` |
| `focused` | 3000 | `fix_bug`, `understand` |
| `resume` | 1200 | — |

**memory_search() — Key Rules:**
- **REQUIRED:** `query` (string) OR `concepts` (2-5 strings). `specFolder` alone causes E040 error.
- Use `anchors` with `includeContent: true` for token-efficient section retrieval (~90% savings).
- Intent weights auto-adjust scoring: `fix_bug` boosts recency, `security_audit` boosts importance, `refactor`/`understand` boost similarity.
- **Full parameter reference:** See [memory_system.md](./references/memory/memory_system.md)

**memory_save() — Save-Time Processing:**
- Runs a pre-storage quality gate (threshold 0.4 signal density). Low-quality saves receive warnings or rejection when strict. See `SPECKIT_SAVE_QUALITY_GATE` flag.
- An exception path allows short decision-type memories to bypass the length gate when SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true and at least two structural signals are present.
- Similar existing memories are auto-merged via reconsolidation (≥0.88 similarity). The save may update an existing memory instead of creating a new one. See `SPECKIT_RECONSOLIDATION` flag.
- A verify-fix-verify loop auto-corrects trigger phrases, anchors, and token budget (up to 2 retries).
- Preflight parses are revalidated inside the write lock when file contents change, and duplicate short-circuits verify stored content before trusting a stale hash hit.
- Delete and replacement paths now treat vector cleanup and projection replacement as integrity-critical instead of best-effort, so stale vector/projection rows do not silently survive successful writes.
- Entities are extracted and linked cross-document at save time. See `SPECKIT_AUTO_ENTITIES` and `SPECKIT_ENTITY_LINKING` flags.
- Governed save and retrieval flows can carry `tenantId`, `userId`, `agentId`, and `sharedSpaceId` so private, agent-scoped, and shared-space memory boundaries stay aligned end to end.
- Shared-memory collaboration is opt-in: use `/memory:manage shared` to enable rollout, create spaces, and manage deny-by-default memberships before relying on shared-space save or retrieval flows.

**Epistemic Learning:** Use `task_preflight()` before and `task_postflight()` after implementation to measure knowledge gains. Learning Index: `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`. Review trends via `memory_get_learning_history()`. See [epistemic_vectors.md](./references/memory/epistemic_vectors.md).

**Key Concepts:**
- **Constitutional tier** — 3.0x search boost + 2.0x importance multiplier; merged into normal scoring pipeline
- **Document-type scoring** — 10 indexed document types with multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), scratch (0.6x), checklist (1.0x), handover (1.0x), memory (1.0x). README files and skill-doc trees (`sk-*`, including `references/` and `assets/`) are excluded from memory indexing.
- **Decay scoring** — FSRS v4 power-law model; recent memories rank higher
- **Import-path hardening** — MCP import paths are validated for memory runtime modules (context server and attention decay wiring)
- **Metadata preservation** — `memory_save` update/reinforce paths preserve `document_type` and `spec_level` with synchronized vector-index metadata
- **Descriptive memory titles** — `MEMORY_TITLE` is derived from the content slug via `generateContentSlug()` and `slugToTitle()`, producing unique and deterministic H1 headings. The parser falls back to feature/overview content when the top heading is generic
- **Causal edge stability** — conflict-update semantics maintain stable causal edge IDs during re-link and graph maintenance
- **Real-time sync** — Use `memory_save` or `memory_index_scan` after creating files
- **Checkpoints** — Gzip-compressed JSON snapshots of memory_index + working_memory; max 10 stored; transaction-wrapped restore
- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility
- **Artifact routing** — 9 artifact classes (spec, plan, tasks, checklist, decision-record, implementation-summary, memory, research, unknown) with per-type retrieval strategies applied at query time
- **Adaptive fusion** — Intent-aware weighted RRF with 7 task-type profiles (fix_bug, add_feature, understand, refactor, security_audit, find_spec, find_decision), plus corrected channel fallback and normalization behavior in the live hybrid pipeline
- **Adaptive ranking** — Feedback-driven shadow ranking that accumulates access/outcome/correction signals and applies bounded score deltas (±0.08 max) per memory. Each signal event carries an optional `query` field for per-query attribution. Runs silently in shadow mode by default; promote to active ranking via `SPECKIT_MEMORY_ADAPTIVE_MODE=promoted`. Thresholds persist to SQLite with `last_tune_watermark` idempotency. Enable with `SPECKIT_MEMORY_ADAPTIVE_RANKING=true`.
- **Causal graph diagnostics** — `memory_drift_why()` now wraps traversal reads in a read transaction and returns truncation metadata when per-node edge caps make lineage incomplete
- **Eval guardrails** — Ablation reporting preserves per-channel dashboard breakdowns, treats missing query IDs explicitly, and avoids persisting synthetic zeroed token-usage snapshots as if they were measured results
- **Runtime-resolved flags** — Long-lived MCP processes re-read rollout and scoring flags at runtime for graph-walk rollout, co-activation, relation handling, and related search toggles instead of freezing values at import time
- **Retrieval trace** — Typed ContextEnvelope wraps every retrieval response with pipeline stages and a DegradedModeContract describing fallback behavior
- **Mutation ledger** — Append-only audit trail for all memory mutations (create, update, delete, reinforce); implemented via SQLite triggers; queryable for compliance and rollback
- **Retrieval telemetry** — 4-dimension metrics (latency, retrieval mode, fallback activation, quality score) plus Hydra architecture metadata. Enabled only when `SPECKIT_EXTENDED_TELEMETRY=true` (default: off)
- **Hydra roadmap metadata** — `SPECKIT_MEMORY_ROADMAP_PHASE` / `SPECKIT_HYDRA_PHASE` plus canonical `SPECKIT_MEMORY_*` and legacy `SPECKIT_HYDRA_*` capability flags annotate telemetry, eval baselines, and migration checkpoint sidecars. Note: `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` does affect live retrieval (shadow or promoted ranking stage); the remaining roadmap flags are metadata-only.
- **Feature catalog** — 291 documented features across 22 categories (`feature_catalog/01--retrieval/` through `22--context-preservation-and-code-graph/`) document every MCP server feature with current-reality status, source files, and catalog references. Use for audit, alignment checks, and understanding what exists. See [feature_catalog/](./feature_catalog/)
- **Manual testing playbook** — Operator-facing validation matrix covering existing (`EX-*`) and new (`NEW-*`) features with deterministic prompts, execution sequences, and pass/fail triage. Includes review protocol and subagent utilization ledger. See [manual_testing_playbook/](./manual_testing_playbook/)
- **Validation scoring** — `wasUseful=false` applies a demotion penalty to memory scores; 5+ positive validations may promote a memory's importance tier
- **Tree-thinning threshold** — 150 tokens with merge group cap of 3 for improved file visibility in memory context
- **JSON-mode conversation synthesis** — When conversation prompts are sparse (e.g., JSON-mode captures with minimal exchange data), conversation content is synthesized from `sessionSummary` field
- **Decision deduplication** — String-form decisions produce deduplicated CONTEXT/RATIONALE/CHOSEN values in memory output
- **Structural blocker detection** — Structural pattern detection identifies blockers (avoiding false positives from broad keyword matching)

**Feature Flags:**

Flags below describe live runtime behavior. Several retrieval and scoring controls are resolved at call time rather than captured once at module import, so changing `process.env` affects long-running MCP processes without a code reload.

| Flag                          | Default | Effect                                                                                      |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `SPECKIT_ADAPTIVE_FUSION`     | on      | Enables intent-aware weighted RRF with 7 task-type profiles in `memory_search()` (set `false` to disable) |
| `SPECKIT_EXTENDED_TELEMETRY`  | off     | Emits 4-dimension retrieval metrics (latency, mode, fallback, quality) plus architecture metadata when explicitly set to `true` |
| `SPECKIT_INDEX_SPEC_DOCS`    | on      | Gates spec document indexing in `memory_index_scan()`. When enabled, discovers and indexes spec folder documents (specs, plans, tasks, etc.) with document-type scoring multipliers. Set `SPECKIT_INDEX_SPEC_DOCS=false` to disable. |
| `SPECKIT_SAVE_QUALITY_GATE`  | on      | Pre-storage quality gate rejects content below 0.4 signal density (14-day warn-only period after activation) |
| `SPECKIT_RECONSOLIDATION`    | off     | Auto-merges similar memories on save when similarity ≥0.88; supersedes at 0.75-0.88 when explicitly enabled |
| `SPECKIT_NEGATIVE_FEEDBACK`  | on      | `wasUseful=false` applies score demotion with 30-day recovery window |
| `SPECKIT_LEARN_FROM_SELECTION` | on    | Tracks which search results are used and boosts them in future searches |
| `SPECKIT_EMBEDDING_EXPANSION` | on     | Expands queries with semantic neighbors before vector search |
| `SPECKIT_AUTO_ENTITIES`      | on      | Extracts entities at save time for cross-document linking |
| `SPECKIT_ENTITY_LINKING`     | on      | Links memories sharing extracted entities during search |
| `SPECKIT_QUALITY_LOOP`       | off     | Enables verify-fix-verify quality loop on save with up to 2 autofix retries |
| `SPECKIT_RELATIONS`          | on      | Correction tracking with undo semantics (superseded/deprecated/refined/merged). Graduated to default ON |
| `SPECKIT_STRICT_SCHEMAS`     | on      | Strict Zod validation for all 43 MCP tools; rejects hallucinated parameters |
| `SPECKIT_DEGREE_BOOST`       | on      | Typed weighted-degree channel in graph signal scoring |
| `SPECKIT_GRAPH_SIGNALS`      | on      | Graph momentum and causal depth scoring signals |
| `SPECKIT_COMMUNITY_DETECTION` | on     | Community detection clustering for graph-aware retrieval |
| `SPECKIT_CAUSAL_BOOST`       | on      | Causal neighbor boost and injection in scoring |
| `SPECKIT_GRAPH_UNIFIED`      | on      | Unified graph retrieval with deterministic ranking and explainability |
| `SPECKIT_SCORE_NORMALIZATION` | on     | Min-max score normalization across channels |
| `SPECKIT_CLASSIFICATION_DECAY` | on    | Classification-based decay rates by memory type |
| `SPECKIT_INTERFERENCE_SCORE` | on      | Interference detection scoring between similar memories |
| `SPECKIT_FOLDER_SCORING`     | on      | Folder-level relevance scoring boost |
| `SPECKIT_SHADOW_SCORING`     | off     | Shadow attribution logging (comparison path disabled; attribution tracking only) |
| `SPECKIT_DASHBOARD_LIMIT`    | 100     | Row cap for reporting dashboard queries |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | on | Calibrated overlap bonus with query-aware scaling |
| `SPECKIT_RRF_K_EXPERIMENTAL` | on      | Per-intent NDCG@10-maximizing K selection over sweep grid |
| `SPECKIT_TYPED_TRAVERSAL`    | on      | Sparse-first policy + intent-aware edge traversal in graph scoring |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | on | Structured recovery payloads for empty/weak search results |
| `SPECKIT_RESULT_CONFIDENCE_V1` | on    | Per-result calibrated confidence from 4 weighted factors |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | on  | Weekly batch feedback learning pipeline with shadow scoring |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | on | Three-tier assistive reconsolidation: auto-merge, review, keep-separate |
| `SPECKIT_RESULT_EXPLAIN_V1`  | on      | Two-tier result explainability with signal detection |
| `SPECKIT_RESPONSE_PROFILE_V1` | on     | Mode-aware response profiles: quick, research, resume, debug |

**Roadmap & Capabilities**

| Flag | Default | Effect |
| ---- | ------- | ------ |
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | Canonical roadmap phase selector used for telemetry, evaluation baselines, and migration checkpoints |
| `SPECKIT_HYDRA_PHASE` | `shared-rollout` | Legacy alias for the roadmap phase selector |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | Canonical capability flag for the lineage-state milestone |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | Canonical capability flag for the unified-graph milestone |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | Enables shadow adaptive ranking (feedback-driven score adjustments, SQLite-persisted thresholds). Set `true` for shadow mode; combine with `SPECKIT_MEMORY_ADAPTIVE_MODE=promoted` to apply to live results. |
| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | Ranking mode when `SPECKIT_MEMORY_ADAPTIVE_RANKING=true`: `shadow` (silent proposals) or `promoted` (applied to live ranking). No effect when ranking is disabled. |
| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | `false` | Canonical capability flag for scope-enforcement rollout tracking |
| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | `false` | Canonical capability flag for governance-guardrail rollout tracking |
| `SPECKIT_MEMORY_SHARED_MEMORY` | `false` | Shared-memory capability flag; default OFF, requires opt-in via `/memory:manage shared` or explicit env enablement |
| `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | Legacy alias for `SPECKIT_MEMORY_LINEAGE_STATE` |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | Legacy alias for `SPECKIT_MEMORY_GRAPH_UNIFIED` |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `false` | Legacy alias for `SPECKIT_MEMORY_ADAPTIVE_RANKING`; accepts same `true`/`false` values |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `false` | Legacy alias for `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `false` | Legacy alias for `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` |
| `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | Legacy alias for `SPECKIT_MEMORY_SHARED_MEMORY`; default OFF |

> **48 flags total across both tables.** Set via environment variable before starting the MCP server (e.g., `SPECKIT_ADAPTIVE_FUSION=1`).

> **Token budgets per layer:** L1:3500, L2:3500, L3:800, L4:500, L5:600, L6:1200, L7:1000 (enforced via `chars/4` approximation).

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md) for tool behavior, importance tiers, and configuration.

### Validation Workflow

Automated validation of spec folder contents via `validate.sh`.

**Usage:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder>`

**Exit Codes:**

| Code | Meaning                         | Action                       |
| ---- | ------------------------------- | ---------------------------- |
| 0    | Passed (no errors, no warnings) | Proceed with completion      |
| 1    | Passed with warnings            | Address or document warnings |
| 2    | Failed (errors found)           | MUST fix before completion   |

**Completion Verification:**
1. Run validation: `./scripts/spec/validate.sh <spec-folder>`
2. Exit 2 → FIX errors
3. Exit 1 → ADDRESS warnings or document reason
4. For code changes, run alignment verifier: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`
5. Exit 0 from both checks → Proceed with completion claim

**Full documentation:** See [validation_rules.md](./references/validation/validation_rules.md) for all rules, configuration, and troubleshooting.

---

### Hook System (Claude Code Lifecycle)

Automated context preservation via Claude Code hooks. Hooks are transport reliability — they call the same retrieval primitives that other runtimes call explicitly via CLAUDE.md instructions.

**Hooks registered in `.claude/settings.local.json`:**

| Hook | Script | Behavior |
|------|--------|----------|
| PreCompact | `dist/hooks/claude/compact-inject.js` | Precomputes context from transcript, caches to temp state |
| SessionStart | `dist/hooks/claude/session-prime.js` | Injects context via stdout (routes by source: compact/startup/resume/clear) |
| Stop | `dist/hooks/claude/session-stop.js` | Parses transcript for token usage, stores snapshots (async) |

**Lifecycle flow:** PreCompact → cache → SessionStart(compact) → inject cached context. On startup: primes with tool overview + CocoIndex status. On resume: loads prior session state.

**Cross-runtime handling:** Hook-capable runtimes use runtime-specific adapters where available. OpenCode remains the primary non-hook runtime and should recover with `session_bootstrap()` on fresh start or after `/clear`, then `session_resume()` after reconnect when needed.

**Token budgets:** Compaction injection: 4000 tokens. Session priming: 2000 tokens. Hook timeout: 1800ms (<2s hard cap).

**Source:** `mcp_server/hooks/claude/` | **Reference:** `references/config/hook_system.md`

### Code Graph (Structural Code Analysis)

4 MCP tools for structural code analysis via tree-sitter WASM indexing (default, with regex fallback) and SQLite storage:

| Tool | Purpose |
|------|---------|
| `code_graph_scan` | Index workspace files, build structural graph |
| `code_graph_query` | Query relationships: outline, calls_from/to, imports_from/to |
| `code_graph_status` | Report graph health and statistics |
| `code_graph_context` | LLM-oriented compact graph neighborhoods (neighborhood/outline/impact modes) |

**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this system) maps imports, calls, hierarchy. Memory (session, existing MCP) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.

**Budget allocator floors:** constitutional 700, codeGraph 1200, cocoIndex 900, triggered 400, overflow pool 800.

**Source:** `mcp_server/lib/code-graph/` | `mcp_server/handlers/code-graph/`

**Parser:** Tree-sitter WASM is the default structural parser for JS/TS/Python/Shell. Set `SPECKIT_PARSER=regex` for regex fallback. Parser adapter pattern allows future language additions.

**Edge types:** CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, DECORATES, OVERRIDES, TYPE_OF.

**Auto-trigger:** `ensureCodeGraphReady()` runs on branch switch, session start, and stale detection. Checks graph freshness and triggers incremental scan if needed.

**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.

**CocoIndex seed bridge:** CocoIndex search results (file + line range) are accepted as seeds by `code_graph_context`, which resolves them to graph nodes and expands structurally. This combines "what resembles what" (CocoIndex) with "what connects to what" (Code Graph).

**CCC tools** (CocoIndex lifecycle):

| Tool | Purpose |
|------|---------|
| `ccc_status` | Check CocoIndex availability and index status |
| `ccc_reindex` | Trigger incremental or full CocoIndex re-indexing |
| `ccc_feedback` | Submit quality feedback on search results |

**Session tools** (lifecycle orchestration):

| Tool | Purpose |
|------|---------|
| `session_health` | Check session readiness, graph freshness, context drift |
| `session_resume` | Combined memory + code graph + CocoIndex resume in one call |
| `session_bootstrap` | Complete session bootstrap (resume + health) in one call |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

1. **Determine level (1/2/3/3+) before ANY file changes** - Count LOC, assess complexity/risk
2. **Copy templates from `templates/level_N/`** - Use level folders, NEVER create from scratch
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
14. **Suggest /spec_kit:handover when session-end keywords detected OR after extended work (15+ tool calls)** - Proactive context preservation
15. **Suggest /spec_kit:debug after 3+ failed fix attempts on same error** - Do not continue without offering debug delegation
16. **Suggest /spec_kit:plan :with-phases when task requires multi-phase decomposition** - Complex specs spanning multiple sessions or workstreams
17. **Route all code creation/updates through `sk-code--opencode`** - Full alignment is mandatory before claiming completion
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
9. **Add ToC sections to standard spec artifacts** - `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, and `debug-delegation.md` must not contain ToC headings

### ⚠️ ESCALATE IF

1. **Scope grows during implementation** - Run `upgrade-level.sh` to add higher-level templates (recommended), then auto-populate all placeholder content:
   - Read all existing spec files (spec.md, plan.md, tasks.md, implementation-summary.md) for context
   - Replace every placeholder marker pattern in newly injected sections with content derived from that context
   - For sections without sufficient source context, write "N/A — insufficient source context" instead of fabricating content
   - Run `check-placeholders.sh <spec-folder>` to verify zero placeholders remain (see [level_specifications.md](./references/templates/level_specifications.md) for the full procedure)
   - Document the level change in changelog
2. **Uncertainty about level <80%** - Present level options to user, default to higher
3. **Template doesn't fit requirements** - Adapt closest template, document modifications
4. **User requests skip (Option D)** - Warn about tech debt, explain debugging challenges, confirm consent
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Documentation Created

- [ ] Spec folder exists at `specs/###-short-name/`
- [ ] Folder name follows convention (2-3 words, lowercase, hyphen-separated)
- [ ] Number is sequential (no gaps or duplicates)
- [ ] Correct level templates copied (not created from scratch)
- [ ] All placeholders replaced with actual content
- [ ] Sample content and instructional comments removed
- [ ] Cross-references to sibling documents work (spec.md ↔ plan.md ↔ tasks.md)
- [ ] No ToC heading in non-research spec artifacts (ToC allowed only in `research/research.md`)

### User Approval

- [ ] Asked user for A/B/C/D/E choice when file modification detected
- [ ] Documentation level presented with rationale
- [ ] Spec folder path shown before creation
- [ ] Templates to be used listed
- [ ] Explicit approval ("yes", "go ahead", "proceed") received before file changes

### Context Preservation

- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
- [ ] Memory files contain PROJECT STATE SNAPSHOT section
- [ ] Manual saves triggered via `/memory:save` or keywords
- [ ] Anchor pairs properly formatted and closed

### Checklist Verification (Level 2+)

- [ ] Loaded checklist.md before claiming completion
- [ ] Verified items in priority order (P0 → P1 → P2)
- [ ] All P0 items marked `[x]` with evidence
- [ ] All P1 items marked `[x]` with evidence
- [ ] P2 items either verified or deferred with documented reason
- [ ] No unchecked P0/P1 items remain

### Validation Passed

- [ ] Ran `validate.sh` on spec folder
- [ ] Exit code is 0 (pass) or 1 (warnings only)
- [ ] All ERROR-level issues resolved
- [ ] WARNING-level issues addressed or documented

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

### Priority System

| Priority | Level    | Deferral                                 |
| -------- | -------- | ---------------------------------------- |
| **P0**   | Blocker  | Cannot proceed without resolution        |
| **P1**   | Warning  | Must address or defer with user approval |
| **P2**   | Optional | Can defer without approval               |

### Validation Triggers

- **AGENTS.md Gate 3** → Validates spec folder existence and template completeness
- **AGENTS.md Completion Verification** → Runs validate.sh before completion claims
- **Manual `/memory:save`** → Context preservation on demand
- **Template validation** → Checks placeholder removal and required field completion

### Cross-Skill Workflows

| Workflow | Flow |
| --- | --- |
| **Spec → Implementation** | system-spec-kit → sk-code--opencode (mandatory for code changes) → sk-git → Spec Kit Memory |
| **Documentation Quality** | system-spec-kit → sk-doc (mandatory for documentation changes; validate, score) → Iterate if <90 |
| **Validation** | Implementation complete → validate.sh → Fix errors → Address warnings → Claim completion |

### Quick Reference Commands

| Command | Usage |
| --- | --- |
| Create spec folder | `./scripts/spec/create.sh "Description" --short-name name --level 2` |
| Validate | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/007-feature/` |
| Verify code alignment drift | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` |
| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/` |
| Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
| Upgrade level | `bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh specs/007-feature/ --to 2` |
| Completeness | `.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh specs/007-feature/` |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Related Skills

| Direction      | Skill                   | Integration                                           |
| -------------- | ----------------------- | ----------------------------------------------------- |
| **Upstream**   | None                    | This is the foundational workflow                     |
| **Downstream** | sk-code--opencode | Mandatory alignment for all code changes              |
| **Downstream** | sk-git           | References spec folders in commit messages and PRs    |
| **Downstream** | sk-doc | Mandatory alignment for all documentation changes     |
| **Integrated** | Spec Kit Memory         | Context preservation via MCP (merged into this skill) |

### External Dependencies

| Resource          | Location                                                                   | Purpose                           |
| ----------------- | -------------------------------------------------------------------------- | --------------------------------- |
| Templates         | `templates/level_1/` through `level_3+/` (see Resource Inventory above)    | Pre-merged level templates        |
| Validation        | `scripts/spec/validate.sh`                                                 | Automated validation              |
| Gates             | `AGENTS.md` Section 2                                                      | Gate definitions                  |
| Memory gen        | `scripts/memory/generate-context.ts` → `scripts/dist/`                     | Memory file creation              |
| MCP Server        | `mcp_server/context-server.ts`                                             | Spec Kit Memory MCP (~1073 lines) |
| Database          | `mcp_server/dist/database/context-index.sqlite`                            | Vector search index (canonical runtime path) |
| Constitutional    | `constitutional/`                                                          | Always-surface rules              |
| Feature Catalog   | `feature_catalog/` (22 categories, 291 documented features)                | Per-feature current-reality docs  |
| Testing Playbook  | `manual_testing_playbook/` (22 categories, 311 scenario files)             | Manual validation matrix          |

---

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and validation for all file modifications. Every conversation that modifies files MUST have a spec folder.
<!-- /ANCHOR:related-resources -->
