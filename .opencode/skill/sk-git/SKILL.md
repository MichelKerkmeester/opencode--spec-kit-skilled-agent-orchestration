---
name: sk-git
description: "Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain]
argument-hint: "[worktree|commit|finish]"
version: 1.1.0.0
---

<!-- Keywords: git-workflow, git-worktree, conventional-commits, pull-request, commit-hygiene, workspace-isolation, version-control, github, issues, pr-review -->

# Git Workflows - Git Development Orchestrator

Unified workflow guidance across workspace isolation, commit hygiene, and work completion.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Orchestrator

Use this orchestrator when:
- Starting new git-based work
- Unsure which git skill to use
- Following complete git workflow (setup → work → complete)
- Looking for git best practices (branch naming, commit conventions)

### When NOT to Use

- Simple `git status` or `git log` queries (use Bash directly)
- Non-git version control systems

### Keyword Triggers

`worktree`, `branch`, `commit`, `merge`, `pr`, `pull request`, `git workflow`, `conventional commits`, `finish work`, `integrate changes`, `github`, `issue`, `review`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                  |
| ----------- | ------------------------ | -------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline   |
| CONDITIONAL | If intent signals match  | Setup/commit/finish docs   |
| ON_DEMAND   | Only on explicit request | Extended patterns/templates|

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "WORKSPACE_SETUP": {"weight": 4, "keywords": ["worktree", "workspace", "parallel work"]},
    "COMMIT": {"weight": 4, "keywords": ["commit", "staged", "message", "conventional commit"]},
    "FINISH": {"weight": 4, "keywords": ["finish", "merge", "pr", "pull request", "integrate"]},
    "SHARED_PATTERNS": {"weight": 3, "keywords": ["convention", "pattern", "reference", "branch naming"]},
}

NOISY_SYNONYMS = {
    "WORKSPACE_SETUP": {"dirty workspace": 2.2, "unclean": 1.4, "mixed changes": 1.5},
    "COMMIT": {"half-staged": 2.0, "boundary": 1.4, "split commit": 1.4},
    "FINISH": {"ship": 1.5, "hotfix": 1.6, "trunk": 1.8, "minimal risk": 1.4},
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm base branch (main/master/trunk)",
    "Confirm whether staged/unstaged changes should be split",
    "Provide required PR policy (squash, template fields, checks)",
    "Confirm hotfix urgency versus cleanup tolerance",
]

RESOURCE_MAP = {
    "WORKSPACE_SETUP": ["references/worktree_workflows.md", "assets/worktree_checklist.md"],
    "COMMIT": ["references/commit_workflows.md", "assets/commit_message_template.md"],
    "FINISH": ["references/finish_workflows.md", "assets/pr_template.md", "references/github_mcp_integration.md"],
    "SHARED_PATTERNS": ["references/shared_patterns.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full git flow", "all templates", "full reference"],
    "ON_DEMAND": ["references/shared_patterns.md", "assets/commit_message_template.md"],
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
    """Weighted intent scoring from request text and workflow flags."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    for intent, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if term in text:
                scores[intent] += weight
    if getattr(task, "needs_isolated_workspace", False):
        scores["WORKSPACE_SETUP"] += 4
    if getattr(task, "has_staged_changes", False):
        scores["COMMIT"] += 4
    if getattr(task, "ready_to_integrate", False):
        scores["FINISH"] += 4
    return scores

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 1.0, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SHARED_PATTERNS"]

    noisy_hits = sum(1 for term in ["dirty workspace", "half-staged", "hotfix", "minimal risk", "trunk"] if term in (task_text or ""))
    max_intents = adaptive_max_intents if noisy_hits >= 2 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break
    return selected[:max_intents]

def route_git_resources(task):
    inventory = discover_markdown_resources()
    task_text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, task_text, ambiguity_delta=1.0)
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

    if sum(scores.values()) < 0.5:
        load_if_available("references/shared_patterns.md")
        return {
            "intents": ["SHARED_PATTERNS"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Workspace Choice Enforcement

**MANDATORY**: The AI must NEVER autonomously decide between creating a git worktree or using the current branch.

The AI must NEVER create a new branch directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`.

When git workspace triggers are detected (new feature, worktree, isolated workspace, etc.), the AI MUST ask the user to explicitly choose:

| Option                        | Description                              | Best For                        |
| ----------------------------- | ---------------------------------------- | ------------------------------- |
| **A) Create a git worktree**  | Isolated workspace in separate directory | Parallel work, complex features |
| **B) Work on current branch** | No new worktree created                  | Trivial changes, exploration    |

**AI Behavior**: ASK before proceeding, WAIT for explicit selection (A/B), NEVER assume, RESPECT choice throughout. Once chosen, reuse preference for the session unless the user requests a change. If a new branch is needed, create it only through `git worktree add -b ...`.

### Git Development Lifecycle Map

Git development flows through 3 phases:

**Phase 1: Workspace Setup** (Isolate your work)
- **git-worktrees** - Create isolated workspace with short-lived temp branches
- Prevents: Branch juggling, stash chaos, context switching
- Output: Clean workspace ready for focused development
- **See**: [worktree_workflows.md](./references/worktree_workflows.md)

**Phase 2: Work & Commit** (Make clean commits)
- **git-commit** - Analyze changes, filter artifacts, write Conventional Commits
- Prevents: Accidental artifact commits, unclear commit history
- Output: Professional commit history following conventions
- **See**: [commit_workflows.md](./references/commit_workflows.md)

**Phase 3: Complete & Integrate** (Finish the work)
- **git-finish** - Merge, create PR, or discard work (with tests gate)
- Prevents: Incomplete work merged, untested code integrated
- Output: Work successfully integrated or cleanly discarded
- **See**: [finish_workflows.md](./references/finish_workflows.md)

### Phase Transitions
- Setup → Work: Worktree created, ready to code
- Work → Complete: Changes committed, tests passing
- Complete → Setup: Work integrated, start next task

### Skill Selection Decision Tree

**Workspace Setup (Phase 1)**:
- Starting new feature/fix? → **git-worktrees** (isolated workspace)
- Quick fix on current branch? → Skip to Phase 2

**Work & Commit (Phase 2)**:
- Ready to commit? → **git-commit** (analyze, filter, write Conventional Commits)
- No changes yet? → Continue coding

**Complete & Integrate (Phase 3)**:
- Tests pass? → **git-finish** (merge, PR, keep, or discard)
- Tests failing? → Return to Phase 2

### Common Workflow Patterns

**Full Workflow** (new feature):
```
git-worktrees (create workspace) → Code → git-commit (commit changes) → git-finish (integrate)
```

**Quick Fix** (current branch):
```
Code → git-commit (commit fix) → git-finish (integrate)
```

**Parallel Work** (multiple features):
```
git-worktrees (feature A) → Code → git-commit
git-worktrees (feature B) → Code → git-commit
git-finish (feature A) → git-finish (feature B)
```

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

1. **Use deterministic conventional commit format** - All commits must follow `type(scope): description` using the commit-message logic defined below
2. **Create worktree for parallel work** - Never work on multiple features in the same worktree
3. **Verify branch is up-to-date** - Pull latest changes before creating PR
4. **Use descriptive worktree-created branch names** - Format: `type/short-description` (e.g., `feat/add-auth`, `fix/login-bug`)
5. **Reference spec folder in commits** - Include spec folder path in commit body when applicable
6. **Clean up after merge** - Delete local and remote feature branches after successful merge
7. **Squash commits for clean history** - Use squash merge for feature branches with many WIP commits

### Commit Message Logic (AI-Scannable)

Use this logic whenever the AI writes or rewrites commit messages.

1. **Subject format (required)**: `type(scope): summary`
2. **Type selection order (first match wins)**:
   - `merge`: merge commits (`Merge ...`)
   - `release`: version or release subjects (`vX.Y.Z`, `release`)
   - `docs`: docs-only changes or README/CHANGELOG-focused updates
   - `fix`: bug/security/hotfix/error correction
   - `feat`: new behavior, support, or capability
   - `refactor`: internal restructuring without behavior change
   - `test`: test-only updates
   - `chore`: fallback for operational or mixed maintenance work
3. **Scope selection order (first match wins)**:
   - `.opencode/skill/<name>/...` -> `<name>`
   - `AGENTS.md` changes -> `agents`
   - `README.md`-only changes -> `readme`
   - `opencode.json` or `.utcp_config.json` -> `config`
   - `.opencode/agent/...` -> `agents`
   - `.opencode/command/...` -> `commands`
   - docs-only set -> `docs`
   - fallback -> dominant top-level path or `repo`
4. **Summary normalization**:
   - Keep concise and specific
   - Remove duplicate prefixes like `feat(scope):` from legacy subjects
   - Avoid trailing period
   - Preserve key context tokens (version, skill name, issue id) when relevant
5. **Body format (optional)**:
   - Add only when context is non-obvious
   - Prefer:
     - `Context: <why>`
     - `Changes:` with 1-3 bullets
     - `Refs: <spec-folder|issue|PR>` when available
6. **Determinism rule**:
   - The same diff + metadata should produce the same commit subject every time.

### ❌ NEVER

1. **Force push to main/master** - Protected branches must never receive force pushes
2. **Never create branches directly** - Use `git worktree add -b ...`; never use `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`
3. **Commit directly to protected branches** - Always use feature branches and PRs
4. **Leave worktrees uncleaned** - Remove worktree directories after merge
5. **Commit secrets or credentials** - Use environment variables or secret management
6. **Create PRs without description** - Always include context, changes, and testing notes
7. **Merge without CI passing** - Wait for all checks to complete
8. **Rebase public/shared branches** - Only rebase local, unpushed commits

### ⚠️ ESCALATE IF

1. **Merge conflicts cannot be auto-resolved** - Complex conflicts require human decision on which changes to keep
2. **GitHub MCP returns authentication errors** - Token may be expired or permissions insufficient
3. **Worktree directory is locked or corrupted** - May require manual cleanup with `git worktree prune`
4. **Force push to protected branch is requested** - This requires explicit approval and understanding of consequences
5. **CI/CD pipeline fails repeatedly** - May indicate infrastructure issues beyond code problems
6. **Branch divergence exceeds 50 commits** - Large divergence suggests need for incremental merging strategy
7. **Submodule conflicts detected** - Submodule updates require careful coordination

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core Workflows
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [worktree_workflows.md](references/worktree_workflows.md) | 7-step workspace creation | Directory selection, branch strategies |
| [commit_workflows.md](references/commit_workflows.md) | 6-step commit workflow | Artifact filtering, Conventional Commits |
| [finish_workflows.md](references/finish_workflows.md) | 5-step completion flow | PR creation, cleanup, merge |
| [shared_patterns.md](references/shared_patterns.md) | Reusable git patterns | Error recovery, conflict resolution |
| [quick_reference.md](references/quick_reference.md) | Command cheat sheet | Common operations |
| [github_mcp_integration.md](references/github_mcp_integration.md) | GitHub MCP remote ops | PRs, issues, CI/CD via Code Mode |

### Assets
| Asset | Purpose | Usage |
|-------|---------|-------|
| [worktree_checklist.md](assets/worktree_checklist.md) | Worktree creation checklist | Pre-flight verification |
| [commit_message_template.md](assets/commit_message_template.md) | Commit format guide | Conventional Commits |
| [pr_template.md](assets/pr_template.md) | PR description template | Consistent PR format |

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Workspace Setup Complete
- Workspace prepared in the selected mode (`git worktree` or current branch)
- If a worktree was selected, it was created in the correct directory (`.worktrees/` or user-specified)
- Any worktree-created branch naming follows convention (`type/short-description`)
- User confirmed workspace choice (worktree/current branch)

### Commit Complete
- All changes reviewed and categorized
- Artifacts filtered out (build files, coverage, etc.)
- Commit message follows Conventional Commits format
- Only public-value files staged

### Integration Complete
- Tests pass before merge/PR
- PR description includes context, changes, and testing notes
- Branch up-to-date with base branch
- Worktree cleaned up after merge (if used)
- Local and remote feature branches deleted

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-commit** | Artifacts excluded, message formatted | Yes |
| **Pre-merge** | Tests pass, branch up-to-date | Yes |
| **Pre-PR** | Description complete, CI passing | Yes |
| **Post-merge** | Worktree removed, branches cleaned | No |

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Gate 3**: File modifications require spec folder question per AGENTS.md Gate 3 (HARD BLOCK)
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Memory Integration

Use Spec Kit Memory MCP for context recovery and preservation:

```javascript
// Find prior git work in a spec folder
memory_search({ query: "git workflow", specFolder: "007-feature-name" })

// Search for related decisions across all specs
memory_search({ query: "branch strategy decisions", includeContent: true })

// After major commits or workflow completion
// Save context with: /memory:save or "save context to [spec-folder]"
```

**Best Practices**:
- Use `memory_search()` at session start to recover prior git context
- Save context after significant commits or before ending a session
- Reference spec folder in commit messages for traceability

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Worked Examples

**New Authentication Feature**:
1. git-worktrees → `.worktrees/auth-feature` with `temp/auth`
2. Code OAuth2 flow → Run tests
3. git-commit → `feat(auth): add OAuth2 login flow`
4. git-finish → Merge to main → Cleanup worktree

**Quick Hotfix**:
1. Fix null reference bug on current branch
2. git-commit → `fix(api): handle null user response`
3. git-finish → Create PR → Link to issue #123

**Parallel Features**:
1. git-worktrees → `.worktrees/feature-a` and `.worktrees/feature-b`
2. Code both features in separate terminals
3. git-commit each → git-finish each sequentially

### Git Workflow Principles

```
ISOLATION: Use worktrees for parallel work
CLARITY:   Write conventional commits with clear descriptions
QUALITY:   Run tests before integration (git-finish gate)
CLEANUP:   Remove worktrees after completion
```

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)
<!-- /ANCHOR:related-resources -->
