---
title: Integration Scanning
description: How the integration scanner discovers all surfaces an agent touches across the repo.
---

# Integration Scanning

How `scan-integration.cjs` discovers the full integration surface of any agent across the repository.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides a complete inventory of every file and surface that references or depends on a given agent, so the evaluator can measure integration consistency rather than just prompt-file quality.

### When to Use

Use this reference when:
- Setting up a new agent as an evaluation target
- Understanding why the integration dimension scored low
- Debugging mirror drift or missing command references
- Onboarding a new agent into the improve-agent loop

### Core Principle

An agent is not just its `.md` file. It exists across canonical, mirrors, commands, YAML workflows, skills, and global docs. Improving one surface while others drift is not real improvement.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:surfaces -->
## 2. SCANNED SURFACES

| Surface | Location Pattern | What It Checks |
| --- | --- | --- |
| Canonical | `.opencode/agent/{name}.md` | Exists, frontmatter parsed |
| Claude mirror | `.claude/agents/{name}.md` | Exists, sync status vs canonical |
| Codex mirror | `.codex/agents/{name}.toml` | Exists, sync status vs canonical |
| .agents mirror | `.agents/agents/{name}.md` | Exists, sync status vs canonical |
| Commands | `.opencode/command/**/*.md` | Files containing `@{name}` dispatch |
| YAML workflows | `.opencode/command/**/assets/*.yaml` | Files referencing `@{name}` |
| Skills | `.opencode/skill/*/SKILL.md` | Files referencing the agent |
| Global docs | `CLAUDE.md`, `.claude/CLAUDE.md` | Agent name references |
| Skill advisor | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Routing entries |

---

<!-- /ANCHOR:surfaces -->
<!-- ANCHOR:sync-detection -->
## 3. MIRROR SYNC DETECTION

Mirror sync is determined by signal matching, not byte-identical comparison:

1. Strip frontmatter from both canonical and mirror
2. Extract 3 key signal strings from the canonical body (first 3 emphasized lines over 20 characters)
3. Count how many signals appear in the mirror body
4. 2/3 or 3/3 matches = `aligned`, 0/3 or 1/3 = `diverged`, file missing = `missing`

---

<!-- /ANCHOR:sync-detection -->
<!-- ANCHOR:usage -->
## 4. USAGE

```bash
node scripts/scan-integration.cjs --agent={agent-name} [--repo-root=.] [--output=path.json]
```

The output JSON includes a `summary` with `totalSurfaces`, `existingCount`, `missingCount`, `mirrorSyncStatus`, `commandCount`, and `skillCount`.

### Example Output

```json
{
  "status": "complete",
  "agent": "{agent-name}",
  "surfaces": {
    "canonical": { "path": ".opencode/agent/{agent-name}.md", "exists": true },
    "mirrors": [
      { "path": ".claude/agents/{agent-name}.md", "syncStatus": "aligned" },
      { "path": ".codex/agents/{agent-name}.toml", "syncStatus": "aligned" },
      { "path": ".agents/agents/{agent-name}.md", "syncStatus": "aligned" }
    ],
    "commands": [{ "path": ".opencode/command/spec_kit/{agent-name}.md", "references": ["@{agent-name}"] }],
    "skills": [{ "path": ".opencode/skill/sk-improve-agent/SKILL.md", "referenceCount": 2 }]
  },
  "summary": {
    "totalSurfaces": 27,
    "existingCount": 27,
    "mirrorSyncStatus": "all-aligned",
    "commandCount": 5,
    "skillCount": 3
  }
}
```

---

<!-- /ANCHOR:usage -->
<!-- ANCHOR:related-resources -->
## 5. RELATED RESOURCES

- `evaluator_contract.md` for the 5-dimension scoring rubric
- `../scripts/scan-integration.cjs` for the implementation
- `../scripts/check-mirror-drift.cjs` for the original mirror-only scanner

<!-- /ANCHOR:related-resources -->
