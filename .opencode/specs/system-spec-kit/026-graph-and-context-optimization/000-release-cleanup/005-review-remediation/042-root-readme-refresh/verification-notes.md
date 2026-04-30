---
title: "Verification Notes: 042 root README refresh"
description: "Canonical count evidence for the root README refresh."
trigger_phrases:
  - "042-root-readme-refresh"
  - "tool count refresh"
importance_tier: "normal"
contextType: "general"
---

# Verification Notes: 042 Root README Refresh

## Count Evidence

| Surface | Verified Count | Command / Source |
|---------|---------------:|------------------|
| `spec_kit_memory` tools | 54 | `TOOL_DEFINITIONS` array in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` counted with a local Node parser. |
| Local `name: '` descriptors in `tool-schemas.ts` | 50 | `grep -c "name: '" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` |
| Imported Skill Advisor descriptors | 4 | `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate` imported from `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/index.ts`. |
| Advisor input schema entries | 4 | `AdvisorToolInputSchemas` in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`. |
| Native MCP total | 63 | 54 `spec_kit_memory` + 7 `code_mode` + 1 `cocoindex_code` + 1 `sequential_thinking`. Bindings verified in `opencode.json`. |
| OpenCode agent definitions | 10 | `find .opencode/agent -maxdepth 1 -type f -name '*.md' \| wc -l`; excludes `README.txt`. |
| Claude agent definitions | 10 | `find .claude/agents -maxdepth 1 -type f -name '*.md' \| wc -l`; excludes `README.txt`. |
| Codex agent definitions | 10 | `.codex/agents/*.toml`; excludes `README.txt`. |
| Gemini agent definitions | 10 | `.gemini/agents/*.md`; excludes `README.txt`. |
| Visible skills | 21 | `find .opencode/skill -maxdepth 1 -mindepth 1 -type d` excluding dot-directories and `README.md`. |
| Command markdown entry points | 23 | `find .opencode/command -name '*.md' -type f \| wc -l`. |

## Raw Command Results

```text
grep -c "name: '" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
50

grep -c "name: '" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts
0

node parser over TOOL_DEFINITIONS array
54

ls .opencode/agent/ | wc -l
11

ls .claude/agents/ | wc -l
11

find .opencode/agent -maxdepth 1 -type f -name '*.md' | wc -l
10

find .claude/agents -maxdepth 1 -type f -name '*.md' | wc -l
10

find .opencode/skill -maxdepth 1 -mindepth 1 -type d | grep -v '/\\.' | wc -l
21

find .opencode/command -name '*.md' -type f | wc -l
23
```

## Count Decision

The root README now uses 54 as the canonical `spec_kit_memory` count because `TOOL_DEFINITIONS.length` is the registration source. The advisor schema grep result of 0 is not used as a public tool count because that file defines Zod schemas; the public advisor MCP descriptors are the four imported tool definitions.
