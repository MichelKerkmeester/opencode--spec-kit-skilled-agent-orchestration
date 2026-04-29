## Packet 037/002: feature-catalog-trio — Tier B doc updates

You are cli-codex (gpt-5.5 high fast) implementing **037/002-feature-catalog-trio**.

### Goal

Update the feature catalogs for THREE skills/subsystems to reflect new MCP tools, handlers, and runtime surfaces shipped in packets 031-036:

1. **system-spec-kit feature catalog**
2. **skill_advisor feature catalog**
3. **code_graph feature catalog**

### Discovery (do this first)

Feature catalogs may live in different locations. Discover the actual paths via:

```bash
find .opencode/skill -type d -name 'feature_catalog*' -or -type d -name 'feature-catalog*'
find .opencode/skill -type f -name 'feature_catalog.md'
find .opencode/skill -type f -iname 'features.md'
find .opencode/skill -type f -name '*feature*catalog*'
```

Per sk-doc skill standards, feature catalogs have a defined template. Confirm the template location:

```bash
find .opencode/skill/sk-doc -name '*feature*catalog*'
```

Read at least one existing feature catalog (e.g., system-spec-kit's) before editing to understand the format.

### Specific entries to add

#### system-spec-kit catalog

New tools/surfaces from 031-036:
- `memory_retention_sweep` MCP tool (from 033) — closes delete_after rows
- `advisor_rebuild` MCP tool (from 034) — explicit advisor cache rebuild
- CLI matrix adapter runners (from 036) — `mcp_server/matrix_runners/`
- `freshness-smoke-check` library (from 034) — codex hook freshness probe
- Updated tool count: 51 → 54 (correct count after 033, 034, 036 additions)

#### skill_advisor catalog

- `advisor_rebuild` (NEW; from 034) — moved out of advisor_status diagnostic
- `advisor_status` (UPDATED; from 034) — now strictly diagnostic, JSDoc updated

#### code_graph catalog

- Confirm code_graph_query / code_graph_scan / code_graph_status / code_graph_verify entries are accurate
- Note read-path/manual freshness contract from 032's retraction (no watcher; selective self-heal via `ensure-ready.ts`)
- Reference 035's matrix execution status for code_graph cells

### Source-of-truth references

For each entry, cite source file:line:
- 033 retention sweep: `mcp_server/handlers/memory-retention-sweep.ts:1-NN`, `mcp_server/lib/governance/memory-retention-sweep.ts:1-NN`
- 034 advisor_rebuild: `mcp_server/skill_advisor/handlers/advisor-rebuild.ts:1-NN`
- 034 freshness-smoke-check: `mcp_server/hooks/codex/lib/freshness-smoke-check.ts:1-NN`
- 036 CLI adapters: `mcp_server/matrix_runners/adapter-cli-*.ts:1-NN` (if 036 has merged)

If 036 has NOT merged at the time of this packet's execution, note CLI adapters as "shipping in packet 036; entry deferred to next catalog refresh" rather than fabricating refs.

### Implementation phases

#### Phase 1: Discover catalog locations
Run the find commands above. Note actual paths. Write a `discovery-notes.md` in packet root listing the catalog locations found.

#### Phase 2: Read templates
Read sk-doc's feature-catalog template. Confirm format conventions (entry structure, frontmatter, anchors).

#### Phase 3: Add entries
For each catalog, add the new entries listed above using sk-doc template format. Be surgical — add only new entries; do not refactor existing entries.

#### Phase 4: Validate sk-doc compliance
For each catalog modified, verify it still passes any sk-doc validation (if a validator exists for these catalogs).

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/002-feature-catalog-trio/`.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit"]`.

**Trigger phrases**: `["037-002-feature-catalog-trio","feature catalog updates","catalog refresh 031-036","system-spec-kit catalog","skill_advisor catalog","code_graph catalog"]`.

**Causal summary**: `"Updates 3 feature catalogs (system-spec-kit, skill_advisor, code_graph) with new tools/handlers from packets 031-036. Doc-only; sk-doc template-aligned."`.

**Frontmatter**: compact rules.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0 on this packet.
- Cite file:line in entries.
- DO NOT commit; orchestrator will commit.
- If a catalog doesn't exist at expected paths, document the gap in discovery-notes.md and skip that catalog (don't fabricate one).

When done, last action is strict validator passing. No narration; just write files and exit.
