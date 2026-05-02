# Iteration 006 — Multi-Skill Architecture Fit Analysis

**Focus:** How well does Dual-Graph fit our multi-skill, multi-agent repo?
**Status:** complete
**newInfoRatio:** 0.40
**Novelty:** Dual-Graph's flat project scanning model fundamentally mismatches our nested skill/spec architecture.

---

## Findings

### 1. Architecture Mismatch: Flat vs Hierarchical

**Dual-Graph assumes:** A flat project with source files in conventional locations
**Our repo has:** A hierarchical multi-component structure:
```
.opencode/
  skill/           (16+ skills, each with SKILL.md, references/, assets/)
  agent/           (agent definitions)
  command/         (command definitions)
  specs/           (spec folders with Level 1-3+ documentation)
specs/             (alias root for spec folders)
.claude/           (Claude-specific agents, settings)
.codex/            (Codex-specific agents)
```

Dual-Graph would scan ALL of this into a single graph, which:
- Doesn't understand skill boundaries
- Can't distinguish SKILL.md from other markdown
- Would include spec folder documentation as "code" files
- Would not understand the Gate system, memory protocols, etc.

### 2. Specific Incompatibilities

| Our Feature | Dual-Graph Impact |
|------------|-------------------|
| **16+ skills** | Would scan all skill files into one flat graph — no skill routing |
| **Spec folders** | Would treat spec.md, plan.md, checklist.md as regular files |
| **Gate system** | Conflicts with mandatory `graph_continue` first |
| **Memory MCP** | Separate MCP server — no integration with graph |
| **CocoIndex Code** | Overlapping functionality — semantic search already available |
| **Agent routing** | Dual-Graph has no concept of multi-agent orchestration |
| **Session continuity** | Our working memory + attention decay is more sophisticated |
| **Constitutional memories** | Dual-Graph has no equivalent concept |

### 3. CocoIndex Code Already Provides Similar Value

Our CocoIndex Code MCP (`.opencode/skill/mcp-coco-index/`) already offers:
- Semantic code search via vector embeddings
- Natural language query → relevant code discovery
- MCP integration (native stdio transport)
- No proprietary dependencies
- Works with our existing architecture

**What CocoIndex lacks** (that Dual-Graph adds):
- Import/dependency graph awareness
- File ranking by structural proximity
- Session activity tracking (which files were read/edited)

### 4. What Would Actually Help

Instead of Dual-Graph, our architecture would benefit from:
1. **Code graph layer in our Memory MCP** — Add import/dependency tracking as a new search channel
2. **Enhanced CocoIndex** — Add structural awareness to existing semantic search
3. **Skill-aware context injection** — Context loader that understands skill boundaries
4. **Token budget management** — Track and optimize context window usage

### 5. Fit Score: 2/10

Dual-Graph is designed for a simple project structure where:
- One AI tool works on one project
- Files are the primary organizational unit
- The AI needs help finding relevant files

Our repo is a meta-framework where:
- Multiple AI tools and agents collaborate
- Skills, specs, and agents are the organizational units
- Context is preserved across sessions, not just within one

---

## Dead Ends
- Looked for Dual-Graph configuration to handle nested structures — none found
- Checked if graph_scan accepts path filters — not documented

## Sources
- [SOURCE: .opencode/skill/README.md] — Skill catalog (16+ skills)
- [SOURCE: CLAUDE.md] — Gate system, agent routing
- [SOURCE: .opencode/skill/mcp-coco-index/] — Existing semantic code search
