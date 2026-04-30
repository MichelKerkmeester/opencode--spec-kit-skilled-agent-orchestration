## Packet 037/006: readme-cascade-refresh — Tier B doc

You are cli-codex (gpt-5.5 high fast) implementing **037/006-readme-cascade-refresh**.

### Goal

Final README cascade refresh: ensure every README in `mcp_server/`, `mcp_server/` subdirs, parent skill docs, and related references reflects the current state of the codebase after packets 031-036 + the 037 children completed (001-005).

### Read these first

- `.opencode/skill/system-spec-kit/mcp_server/README.md` (mcp_server's own)
- `.opencode/skill/system-spec-kit/README.md` (parent — if exists)
- `.opencode/skill/system-spec-kit/SKILL.md` (parent skill doc)
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- AGENTS.md (project root)
- All sub-folder READMEs under `mcp_server/`:
  ```bash
  find .opencode/skill/system-spec-kit/mcp_server -name 'README.md' -type f
  ```
- All packets in 037/001 through 037/005 — read their implementation summaries to understand what changed

### Discovery (Phase 1)

```bash
# All README files in scope
find .opencode/skill/system-spec-kit -name 'README.md' -type f
find .opencode/specs/system-spec-kit/026-graph-and-context-optimization -maxdepth 3 -name 'README.md' -type f

# Recent commits affecting docs
git --no-pager log --oneline --since='2026-04-29' -- .opencode/skill/system-spec-kit/ | head -30
```

Build a target list. Write `target-list.md` at packet root.

### Refresh checklist (per README)

For each README, verify:
- **Tool count** — total MCP tool count is current (54 after 033 + 034 additions; check after 036 if it added tools)
- **File structure** — directory listings reflect actual file system (NEW: `matrix_runners/`, `stress_test/`; UPDATED locations from 037/005 migration)
- **Capability matrix** — feature × executor / behavior tables reflect current state
- **Cross-references** — links to other docs are accurate (no broken paths after 037/005's migration)
- **Operator commands** — example invocations work as documented
- **Version tags** — `@spec-kit/mcp-server` version, MCP protocol version, etc.
- **Recent changes section** — add a brief line about 031-036 + 037 if a changelog is convention

### Specific updates required

#### `.opencode/skill/system-spec-kit/mcp_server/README.md`

- Tool count: confirm 54 (or N after 036)
- Add reference to `mcp_server/matrix_runners/` (from 036 if shipped)
- Add reference to `mcp_server/stress_test/` (from 037/005)
- Update file structure tree
- Update capability matrix if it has one

#### Parent README (`.opencode/skill/system-spec-kit/README.md` if exists)

- Reflect new sub-modules / capabilities
- Cross-link to mcp_server/README.md for details

#### Sub-folder READMEs (`mcp_server/handlers/`, `mcp_server/lib/`, etc. if they exist)

- Add new entries for: memory-retention-sweep handler, advisor-rebuild handler, freshness-smoke-check helper, matrix_runners adapters

#### `.opencode/skill/system-spec-kit/ARCHITECTURE.md`

- Update CCC handler paths (already done by 031; verify still accurate)
- Add architecture notes for matrix_runners + stress_test/ if they're architecturally significant

### Implementation phases

#### Phase 1: Discovery
List all READMEs in scope. Write `target-list.md`.

#### Phase 2: Audit per README
For each, identify what's stale. Write findings inline in `target-list.md` (PASS / NEEDS_UPDATE).

#### Phase 3: Apply updates
Surgical edits per README. No rewrites; just refresh.

#### Phase 4: Cross-reference verification
Walk every link/reference. Confirm no broken paths.

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/006-readme-cascade-refresh/`.

PLUS: `target-list.md` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/002-feature-catalog-trio","system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/003-testing-playbook-trio","system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/004-sk-doc-template-alignment","system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration"]`.

**Trigger phrases**: `["037-006-readme-cascade-refresh","README cascade","README refresh","mcp_server README update","parent skill README"]`.

**Causal summary**: `"Cascade-refreshes all READMEs in mcp_server/, parent skill, and related docs to reflect current state after 031-036 + 037/001-005. Tool counts, file structure, capability matrix, cross-references all current."`.

**Frontmatter**: compact rules.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0 on this packet.
- Cross-references MUST resolve (no broken paths).
- DO NOT commit; orchestrator will commit.

When done, last action is strict validator passing. No narration; just write files and exit.
