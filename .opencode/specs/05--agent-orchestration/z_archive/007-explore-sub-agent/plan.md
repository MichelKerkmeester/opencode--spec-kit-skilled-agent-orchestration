---
title: "Plan: Context Loader Sub-Agent (@context_loader) [007-explore-sub-agent/plan]"
description: "Create a single agent definition file following the established agent structural patterns. The file defines the @context_loader agent as a fast, read-only context scout with thr..."
trigger_phrases:
  - "plan"
  - "context"
  - "loader"
  - "sub"
  - "agent"
  - "007"
  - "explore"
importance_tier: "important"
contextType: "decision"
---
# Plan: Context Loader Sub-Agent (@context_loader)

> **Spec Folder:** `.opencode/specs/05--agent-orchestration/z_archive/007-explore-sub-agent/`
> **Created:** 2026-02-10
> **Note:** Originally scoped as `@explore`, renamed to `@context_loader` during implementation.

---

<!-- ANCHOR:summary -->
## 1. Approach

Create a single agent definition file following the established agent structural patterns. The file defines the @context_loader agent as a fast, read-only context scout with three thoroughness levels, structured output format, and Active Dispatch capability.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:architecture -->
### Architecture Decision

**Decision**: Create `context_loader.md` as an ENHANCEMENT of the built-in `explore` subagent_type, not a replacement.

**Rationale**: The built-in `subagent_type: "explore"` provides fast Glob/Grep/Read access. The agent definition file adds an INTELLIGENCE LAYER on top: memory retrieval, structured output, thoroughness levels, pattern analysis, and Active Dispatch capability.

**Alternative Considered**: Creating a new subagent_type — rejected because the existing "explore" type already provides the right tool access (fast search without write permissions).

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 2. Implementation Strategy

### Phase 1: Agent Definition (Single File)

Create `.opencode/agent/context_loader.md` with these sections (following peer agent patterns):

| Section | Content | Based On |
|---------|---------|----------|
| Frontmatter | YAML config with model, permissions, mode | All existing agents |
| §1 Core Identity | Agent mission, model, key properties | research.md §1 |
| §2 Core Workflow | 6-step retrieval workflow (RECEIVE→MEMORY→CODEBASE→DISPATCH→SYNTHESIZE→DELIVER) | research.md §1 |
| §3 Capability Scan | Available tools and MCP integrations | research.md §2, write.md §3 |
| §4 Retrieval Modes | quick/medium/thorough definitions | Custom (new) |
| §5 Agent Dispatch Protocol | Active Dispatch: @explore + @research sub-delegation | Custom (new, added during T5) |
| §6 Retrieval Strategy | 3-layer approach (Memory→Codebase→Deep) | Custom (new) |
| §7 Output Format | Context Package template | research.md output format |
| §8 Integration with Orchestrator | Dispatch patterns, CWB compliance, Two-Tier Model | orchestrate.md §27-28 |
| §9 Rules & Constraints | READ-ONLY enforcement, boundaries | review.md rules |
| §10 Anti-Patterns | What NOT to do | All existing agents |
| §11 Related Resources | Links to skills, tools, agents | All existing agents |

### Phase 2: Verification

- Validate structural consistency with peer agents
- Confirm frontmatter follows the permission pattern
- Verify all Memory MCP tool references are correct
- Check orchestrator compatibility

### Phase 3: Ecosystem Integration (Added During Implementation)

- Update `orchestrate.md` with @context_loader references and Two-Tier Dispatch Model
- Update all 3 `AGENTS.md` files with @context_loader row
- Audit all skill directories for agent references
- Audit all command/YAML files for agent references
- Update `SET-UP - Opencode Agents.md` install guide
- Create symlink at `.claude/agents/context_loader.md`
- Update spec folder documentation (tasks.md, checklist.md, spec.md, plan.md)

<!-- /ANCHOR:phases -->

## 3. Technical Details

### Frontmatter Configuration

```yaml
---
name: explore
description: Fast, read-only context retrieval agent for codebase exploration and memory surfacing
model: github-copilot/gpt-5.2-think-medium
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: deny      # READ-ONLY — critical safety property
  edit: deny        # READ-ONLY — critical safety property
  bash: deny        # No shell access needed
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow     # Spec Kit Memory MCP access
  chrome_devtools: deny
  task: allow       # Active Dispatch (§5) — dispatches @explore and @research only
  list: allow
  patch: deny
  external_directory: allow
---
```

**Implementation Note**: Model was changed from `claude-sonnet-4.5` to `github-copilot/gpt-5.2-think-medium` during implementation because the context retrieval role benefits from reasoning capabilities.

### Three Retrieval Layers

**Layer 1 — Memory Check (ALWAYS first)**
- `memory_match_triggers(prompt)` → Quick trigger phrase matching
- `memory_context({ input, mode: "quick" })` → Fast context surfacing

**Layer 2 — Codebase Discovery**
- `Glob(pattern)` → File structure discovery
- `Grep(pattern)` → Code pattern search
- `Read(file)` → File content inspection

**Layer 3 — Deep Memory (if needed)**
- `memory_search({ query, includeContent: true })` → Semantic vector search
- `memory_context({ input, mode: "deep" })` → Comprehensive retrieval

### Thoroughness Levels

| Level | Layers Used | Time Budget | Output Size | Use Case |
|-------|------------|-------------|-------------|----------|
| `quick` | Layer 1 only | ~30 seconds | ~500 tokens | Quick fact check, trigger matching |
| `medium` | Layers 1+2 | ~2 minutes | ~2K tokens | Standard pre-implementation scan |
| `thorough` | All 3 layers | ~5 minutes | ~4K tokens | Comprehensive context before complex work |

## 4. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Overlap with @research | Medium | Medium | Clear differentiation table in spec.md §6 |
| Output too verbose | Low | High | Strict output format with token limits per thoroughness level |
| Memory MCP unavailable | Low | Medium | Graceful fallback to codebase-only retrieval |
| Inconsistent with peer agents | Low | Medium | Structural pattern analysis completed before creation |
| Active Dispatch misuse | Low | High | Strict allowlist (@explore, @research only), hard dispatch limits (quick=0, medium=2, thorough=3) |

<!-- ANCHOR:rollback -->
## 5. Rollback Plan

If the agent definition causes issues:
1. Delete `.opencode/agent/context_loader.md` and `.claude/agents/context_loader.md` symlink
2. Orchestrator falls back to built-in `subagent_type: "explore"` (no breakage)
3. Revert orchestrate.md, AGENTS.md files, agent_template.md, and install guide changes

<!-- /ANCHOR:rollback -->
