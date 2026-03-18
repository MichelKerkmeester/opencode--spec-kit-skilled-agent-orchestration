# Wave 1B: Cross-Runtime Agent Definition Audit

## Files Analyzed

| # | Runtime | File Path | Lines | Format |
|---|---------|-----------|-------|--------|
| 1 | Claude | `.claude/agents/deep-research.md` | 433 | YAML frontmatter + Markdown |
| 2 | Codex | `.codex/agents/deep-research.toml` | 426 | TOML wrapper + Markdown body |
| 3 | OpenCode/Copilot | `.opencode/agent/deep-research.md` | 438 | YAML frontmatter + Markdown |
| 4 | ChatGPT | `.opencode/agent/chatgpt/deep-research.md` | 438 | YAML frontmatter + Markdown |

---

## Divergence Matrix

| Dimension | Claude | Codex | OpenCode | ChatGPT | Aligned? |
|-----------|--------|-------|----------|---------|----------|
| Model | `opus` | `gpt-5.4` | (none specified) | (none specified) | **NO** |
| Reasoning effort | (none) | `high` | (none) | (none) | **NO** |
| Format | YAML frontmatter MD | TOML `developer_instructions` | YAML frontmatter MD | YAML frontmatter MD | **NO** |
| Sandbox/Mode | (none) | `workspace-write` | `subagent` | `subagent` | **NO** |
| Temperature | (none) | (none) | `0.1` | `0.1` | **NO** |
| Permissions (explicit) | (none -- implicit via `tools:` list) | (none -- implicit via sandbox) | 12 explicit permission entries | 12 explicit permission entries | **NO** |
| Tools (frontmatter) | Read, Write, Edit, Bash, Grep, Glob, WebFetch | (none declared in frontmatter) | read, write, edit, bash, grep, glob, webfetch, memory, list, external_directory (+ denies: chrome_devtools, task, patch) | Identical to OpenCode | **NO** |
| MCP Servers (frontmatter) | `spec_kit_memory` | (none declared) | (none declared) | (none declared) | **NO** |
| Path Convention | `.claude/agents/*.md` | `.codex/agents/*.toml` | `.opencode/agent/*.md` | `.opencode/agent/chatgpt/*.md` | Expected (runtime-specific) |
| Core Workflow (7 steps) | Identical | Identical | Identical | Identical | **YES** |
| Tool Budget (target/max) | 8-11 / 12 | 8-11 / 12 | 8-11 / 12 | 8-11 / 12 | **YES** |
| Budget wording (Step 3) | "within an overall budget of" | "within an overall budget of" | "Recommended overall budget:" | "Recommended overall budget:" | **NO** |
| Error Handling (Tiers 1-3) | Identical | Identical | Identical | Identical | **YES** |
| Output Format | Identical | Identical | Identical | Identical | **YES** |
| Recovery Mode | Identical | Identical | Identical | Identical | **YES** |
| Iteration File Template | Identical | Identical | Identical | Identical | **YES** |
| newInfoRatio Calculation | Identical | Identical | Identical | Identical | **YES** |
| Simplicity Bonus | Identical | Identical | Identical | Identical | **YES** |
| Write Safety Rules | Identical | Identical | Identical | Identical | **YES** |
| ALWAYS/NEVER/ESCALATE Rules | Identical | Identical | Identical | Identical | **YES** |
| Anti-Patterns Table | Identical | Identical | Identical | Identical | **YES** |
| Verification Checklist | Identical | Identical | Identical | Identical | **YES** |
| Summary ASCII Art | Identical | Identical | Identical | Identical | **YES** |
| Related Resources - Skills | `sk-deep-research` + `system-spec-kit` | `system-spec-kit` + `sk-deep-research` | `sk-deep-research` + `system-spec-kit` | `sk-deep-research` + `system-spec-kit` | **YES** (content same, order varies) |
| Related Resources - Agents | orchestrate only | orchestrate + `research` | orchestrate only | orchestrate only | **NO** |

---

## Detailed Divergences

### Divergence 1: Model Specification

- **Files**: All 4 differ
- **Claude** (line 12): `model: opus`
- **Codex** (line 4): `model = "gpt-5.4"` with `model_reasoning_effort = "high"` (line 5)
- **OpenCode** (lines 1-20 frontmatter): No model field specified at all
- **ChatGPT** (lines 1-20 frontmatter): No model field specified at all
- **Impact**: Claude always dispatches to Opus. Codex always dispatches to GPT-5.4 at high reasoning effort. OpenCode and ChatGPT rely on whatever the runtime default is -- meaning the model used is unpredictable and may vary between sessions.
- **Recommendation**: All runtimes should explicitly declare a model. OpenCode and ChatGPT should specify their intended model in their frontmatter to avoid ambiguity. The canonical specification pattern should follow Claude's approach (model in frontmatter).

### Divergence 2: Frontmatter Structure (Metadata Schema)

- **Files**: Claude vs Codex vs OpenCode/ChatGPT
- **Claude** (lines 1-15): YAML frontmatter with `name`, `description`, `tools` (list), `model`, `mcpServers`
- **Codex** (lines 1-6): TOML with `sandbox_mode`, `model`, `model_reasoning_effort`, then `developer_instructions` string containing the full Markdown body
- **OpenCode** (lines 1-20): YAML frontmatter with `name`, `description`, `mode`, `temperature`, `permission` (object with 12 entries)
- **ChatGPT** (lines 1-20): Identical to OpenCode
- **Impact**: Each runtime uses a fundamentally different metadata schema. This is expected since each CLI has its own agent format. However, the *semantic fields* differ -- Claude declares tools as a list, OpenCode declares granular permissions, and Codex wraps everything in TOML.
- **Recommendation**: This is an expected divergence driven by runtime format requirements. No action needed, but a mapping document showing which Claude field maps to which Codex/OpenCode field would aid maintenance.

### Divergence 3: Mode / Sandbox Configuration

- **Files**: Claude (absent), Codex, OpenCode, ChatGPT
- **Claude**: No `mode` or `sandbox_mode` field. Permissions are implicit from the `tools:` list.
- **Codex** (line 3): `sandbox_mode = "workspace-write"` -- sandboxed to workspace writes only
- **OpenCode** (line 4): `mode: subagent` -- runs as a subagent
- **ChatGPT** (line 4): `mode: subagent` -- runs as a subagent
- **Impact**: Claude's agent has no explicit sandboxing declaration. Codex uses workspace-scoped write sandboxing. OpenCode/ChatGPT use `subagent` mode. These reflect different isolation models but the behavioral intent (restricted, non-interactive agent) is the same.
- **Recommendation**: Expected divergence. No alignment needed.

### Divergence 4: Temperature Setting

- **Files**: OpenCode and ChatGPT have it; Claude and Codex do not
- **OpenCode** (line 5): `temperature: 0.1`
- **ChatGPT** (line 5): `temperature: 0.1`
- **Claude**: No temperature field (uses provider default)
- **Codex**: No temperature field (uses provider default)
- **Impact**: OpenCode and ChatGPT explicitly request low-temperature (deterministic) behavior. Claude and Codex rely on defaults, which may be higher. For research tasks, low temperature is generally preferred for consistency.
- **Recommendation**: If Claude and Codex support temperature configuration, they should also set `0.1` for consistency. If not configurable, document that this is a known variance.

### Divergence 5: Explicit Permission Grants vs Tool Lists

- **Files**: Claude vs OpenCode/ChatGPT
- **Claude** (lines 4-11): Declares 7 tools as a flat list: `Read, Write, Edit, Bash, Grep, Glob, WebFetch`
- **OpenCode** (lines 6-19): Declares 12 permissions with allow/deny granularity: `read: allow, write: allow, edit: allow, bash: allow, grep: allow, glob: allow, webfetch: allow, memory: allow, chrome_devtools: deny, task: deny, list: allow, patch: deny, external_directory: allow`
- **ChatGPT** (lines 6-19): Identical to OpenCode
- **Codex**: No explicit tool declarations in TOML frontmatter
- **Impact**: OpenCode/ChatGPT explicitly grant `memory`, `list`, and `external_directory` access which Claude does not list in `tools:`. OpenCode/ChatGPT also explicitly deny `chrome_devtools`, `task`, and `patch`. Claude's `tools:` list omits `memory` but compensates via `mcpServers: spec_kit_memory`. Codex has no tool declarations at all -- it relies on the sandbox mode and whatever tools the Codex runtime provides by default.
- **Recommendation**: Align the *semantic capabilities*. Claude should consider adding `memory` to its tools list (or note that `mcpServers` covers this). Codex should declare tools or document that sandbox_mode governs access.

### Divergence 6: MCP Server Declaration

- **Files**: Only Claude declares MCP servers
- **Claude** (lines 13-14): `mcpServers: - spec_kit_memory`
- **Codex**: No MCP server declaration
- **OpenCode**: No MCP server declaration (but has `memory: allow` in permissions)
- **ChatGPT**: No MCP server declaration (but has `memory: allow` in permissions)
- **Impact**: Claude explicitly connects to the `spec_kit_memory` MCP server. Other runtimes rely on the `memory: allow` permission or runtime-level MCP configuration to provide memory tools. The agent body references `memory_search` and `memory_context` MCP tools in all four files, so they are expected to be available everywhere -- but only Claude's frontmatter explicitly ensures this.
- **Recommendation**: OpenCode/ChatGPT should either add an MCP server declaration or document that `memory: allow` is sufficient to enable memory_search/memory_context. Codex should document how MCP tools become available.

### Divergence 7: Budget Wording Variance (Step 3)

- **Files**: Claude + Codex vs OpenCode + ChatGPT
- **Claude** (line 104): `"Target 3-5 research actions within an overall budget of 8-11 tool calls per iteration."`
- **Codex** (line 95): Same as Claude: `"within an overall budget of"`
- **OpenCode** (line 109): `"Target 3-5 research actions. Recommended overall budget: 8-11 tool calls per iteration."`
- **ChatGPT** (line 109): Same as OpenCode: `"Recommended overall budget:"`
- **Impact**: Semantic difference. "within an overall budget of" reads as a harder constraint than "Recommended overall budget:" which sounds advisory. The hard max of 12 is stated identically in all four files, so the practical impact is minimal -- but a less capable model might interpret "recommended" as optional.
- **Recommendation**: Standardize to "within an overall budget of" (the Claude/Codex phrasing) across all runtimes. This is the stricter, less ambiguous wording.

### Divergence 8: Related Resources -- Extra Agent Reference in Codex

- **Files**: Codex only
- **Codex** (lines 393-394): Lists two agents: `orchestrate` and `research` ("Standard 9-step research (non-iterative)")
- **Claude** (line 402): Lists only `orchestrate`
- **OpenCode** (line 406): Lists only `orchestrate`
- **ChatGPT** (line 406): Lists only `orchestrate`
- **Impact**: Codex references a `research` agent that the other three runtimes do not mention. This could be a stale reference (the `research` agent may have been removed from other runtimes) or Codex may have an additional agent not present elsewhere.
- **Recommendation**: Verify whether the `research` agent still exists in the Codex runtime. If deprecated, remove the reference. If it exists, consider adding it to the other runtimes' related resources for completeness.

### Divergence 9: Related Resources -- Skill Listing Order in Codex

- **Files**: Codex
- **Codex** (lines 386-387): Lists `system-spec-kit` first, then `sk-deep-research`
- **Claude** (lines 395-396): Lists `sk-deep-research` first, then `system-spec-kit`
- **OpenCode** (lines 400-401): Same as Claude
- **ChatGPT** (lines 400-401): Same as Claude
- **Impact**: Cosmetic only. No behavioral difference.
- **Recommendation**: Standardize order across all runtimes for consistency. Minor.

### Divergence 10: Conversion Comment in Codex

- **Files**: Codex only
- **Codex** (line 2): Contains the comment `# Converted from: .opencode/agent/chatgpt/deep-research.md`
- **Impact**: Documents provenance -- the Codex definition was converted from the ChatGPT version. This means the ChatGPT version may be the actual source-of-truth for the Codex runtime, explaining why their body content is nearly identical.
- **Recommendation**: Maintain this provenance comment. Consider adding similar comments to other runtime-specific files.

---

## Alignment Summary by Category

### Fully Aligned (no divergence across all 4 runtimes)
- Core 7-step workflow
- Tool budget numbers (target 8-11, max 12)
- Error handling tiers (1-3)
- Output format (iteration completion report)
- Recovery mode protocol
- Iteration file template structure
- newInfoRatio calculation formula
- Simplicity bonus rules
- Write safety rules (JSONL append, Edit for strategy, etc.)
- ALWAYS / NEVER / ESCALATE rule lists
- Anti-patterns table
- Pre-delivery verification checklist
- Summary ASCII art block
- State management file paths and operations
- Illegal nesting (LEAF-only) enforcement
- Focus selection decision tree

### Intentionally Divergent (runtime-specific by design)
- File format (YAML frontmatter MD vs TOML)
- Path convention references
- Mode/sandbox configuration
- Metadata schema structure

### Unintentionally Divergent (should be standardized)
1. **Model specification** -- Claude and Codex specify; OpenCode and ChatGPT do not
2. **Temperature** -- OpenCode and ChatGPT set 0.1; Claude and Codex do not
3. **MCP server declaration** -- Only Claude declares `spec_kit_memory`
4. **Tool/permission granularity** -- Claude uses tool list; OpenCode/ChatGPT use allow/deny map; Codex declares nothing
5. **Budget wording** -- "within an overall budget of" vs "Recommended overall budget:"
6. **Stale `research` agent reference** -- Present only in Codex
7. **Reasoning effort** -- Only Codex specifies `high`

---

## Recommended Canonical Source

The **OpenCode/Copilot** version (`.opencode/agent/deep-research.md`) should be the canonical source:
1. It has the most complete permission model (explicit allow/deny)
2. It sets temperature explicitly
3. Its body content is identical to ChatGPT (which was the Codex source per the conversion comment)
4. The Claude version and Codex version should be derived from it with runtime-specific adaptations

**Critical actions for alignment:**
1. Add explicit model declarations to OpenCode and ChatGPT frontmatter
2. Standardize budget wording to "within an overall budget of" across all 4 files
3. Remove or verify the stale `research` agent reference in Codex
4. Document MCP server availability expectations for non-Claude runtimes
5. Consider adding temperature to Claude/Codex if supported
