## Packet 042: root-readme-refresh — Tier B doc-only

You are cli-codex (gpt-5.5 high fast) implementing **042-root-readme-refresh**.

### Goal

Update the root `README.md` to reflect the current runtime state after this session's 18+ commits. Honor the evergreen-doc no-packet-IDs rule (defined at `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md`).

### Read these first

- `README.md` (the root README, ~1312 lines)
- `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` (the new rule — README is evergreen-class)
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (canonical TOOL_DEFINITIONS for spec_kit_memory tool count)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` (skill advisor's separate tool schemas)
- `opencode.json` (live MCP server bindings)
- `.opencode/skill/system-spec-kit/SKILL.md` (recently updated; tool counts there reflect current state)
- `.opencode/skill/system-spec-kit/mcp_server/README.md` (recently updated mcp_server README; cross-link target)
- Listing of `.opencode/agent/` and `.claude/agents/` to verify agent count
- Listing of `.opencode/skill/` to verify skill count (currently 21 visible: README, cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode, mcp-chrome-devtools, mcp-clickup, mcp-coco-index, mcp-code-mode, mcp-figma, sk-code-full-stack, sk-code-opencode, sk-code-review, sk-code-web, sk-deep-research, sk-deep-review, sk-doc, sk-git, sk-improve-agent, sk-improve-prompt, system-spec-kit)
- Listing of `.opencode/command/**/*.md` to verify command count

### Issues to fix

#### Issue 1: Stale spec_kit_memory tool count
- Line 56: `spec_kit_memory (51)`
- Line 1101 region: `47`
- Line 1273: `51 spec_kit_memory tools`
- Line 1293: `51 tools, 7 layers`
- Line 1312: `60 MCP tools (51 spec_kit_memory + 7 code mode + 1 CocoIndex + 1 sequential thinking`

Verify the actual count by reading `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` and counting top-level entries in `TOOL_DEFINITIONS`. Also count skill-advisor tools in `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`. Replace ALL occurrences with the correct numbers.

If the README distinguishes "spec_kit_memory tool surface" from "skill_advisor tools", state the breakdown explicitly. If they're aggregated, use a single canonical number with the breakdown formula in the FAQ.

#### Issue 2: Internal agent count inconsistency
- Line 7: `10 agents`
- Line 1312: `12 agents`

Resolve by reading the actual agent file count from runtime directories (`.opencode/agent/` for OpenCode/Codex/Copilot/Gemini, `.claude/agents/` for Claude). Pick the right number; reconcile both lines.

#### Issue 3: Stale "Last updated"
- Line 1312: `Last updated: 2026-04-25`

Update to today's date. If the version field needs bumping (e.g., 4.4 → 4.5), bump it; otherwise leave as 4.4.

#### Issue 4: Missing feature mentions

The current README does not surface these recently-added runtime capabilities. Add brief mentions in appropriate sections (FEATURES → MEMORY ENGINE / SKILL ADVISOR / CODE GRAPH / etc.):

- **Memory retention sweep**: hourly automatic sweep of expired memory_index rows; `memory_retention_sweep` MCP tool for manual/dry-run; controlled by `SPECKIT_RETENTION_SWEEP` and `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` env vars; defined at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts`
- **Advisor rebuild**: explicit `advisor_rebuild` MCP tool (vs `advisor_status` diagnostic); use when status reports stale; defined at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`
- **Codex hook freshness smoke check**: cold-start fallback with `stale: true, reason: "timeout-fallback"` marker; helper at `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts`
- **CLI matrix runners**: 5 per-CLI adapter runners (codex/copilot/gemini/claude-code/opencode) + manifest + meta-runner at `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/`; supports running F1-F14 features × CLI executors as a stress matrix
- **Dedicated stress folder**: `npm run stress` from `mcp_server/` runs the full stress suite at `.opencode/skill/system-spec-kit/mcp_server/stress_test/`; subsystems: search-quality (the harness), memory, skill-advisor, code-graph, session, matrix
- **Code graph runtime feature catalog + manual testing playbook**: at `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/` and `.../manual_testing_playbook/`

Keep additions BRIEF — one or two sentences each in the relevant section, with file-path links. Don't bloat the README; it's already 1312 lines.

#### Issue 5: Evergreen-doc rule violation

Per the rule (root README is evergreen-class, packet IDs forbidden):
- **Line 514** has a hardlink to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/` — replace with a feature-description + path pattern. E.g., "Patches authored as part of the cocoindex overfetch dedup work; see `.opencode/skill/mcp-coco-index/changelog/CHANGELOG.md` for the per-release patch list" — and remove the explicit packet-folder URL.

Other "packet-shaped" matches in the README that are NOT violations (per the rule's exemption for instructional template content):
- Lines 230-238: `022-big-feature/`, `001-data-model/`, `002-api-endpoints/`, `003-frontend/` — these are illustrative spec-folder examples in a code block, not real packet refs. Keep as-is.

#### Issue 6: Self-check

After fixes, run the evergreen-rule grep on README.md:

```bash
grep -nE '\b0[0-9]{2}-[a-z-]+|\bpacket [0-9]{3}|\b03[0-9]/00[0-9]|\bF-013-[0-9]+|\bP1-[0-9]+|\bphase [0-9]{3}|\bin packet|\bvia packet' README.md
```

Document any remaining hits in audit-findings.md as exempt (template/instructional context only). Goal: zero packet-history references in narrative content.

### Implementation phases

#### Phase 1: Verify counts

```bash
grep -c "name: '" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
grep -c "name: '" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts
ls .opencode/agent/ | wc -l
ls .claude/agents/ | wc -l
ls .opencode/skill/ | grep -v '^README' | wc -l
find .opencode/command -name '*.md' -type f | wc -l
```

Write the verified canonical numbers in `verification-notes.md` at packet root.

#### Phase 2: Apply fixes

Use Edit tool surgically. Don't rewrite paragraphs that are already current.

#### Phase 3: Self-check + validation

- Run the evergreen grep above
- Run strict validator on the packet (which will pick up README.md indirectly via spec-doc-integrity)
- Confirm no broken markdown wiki-links

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/`.

PLUS: `verification-notes.md` and `audit-findings.md` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal","system-spec-kit/026-graph-and-context-optimization/038-stress-test-folder-completion","system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook"]`.

**Trigger phrases**: `["042-root-readme-refresh","root readme update","framework readme refresh","tool count refresh"]`.

**Causal summary**: `"Refreshes root README.md after this session's 18+ commits. Verifies tool/agent/skill/command counts against canonical sources. Adds brief mentions of memory_retention_sweep, advisor_rebuild, freshness-smoke-check, matrix-runners, stress_test/, code_graph runtime catalog/playbook. Fixes one evergreen-rule violation (packet-folder hardlink at L514)."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0.
- Don't bloat the README; surgical additions only.
- Don't rewrite sections that are already current.
- Cite canonical sources for verified counts.
- DO NOT commit; orchestrator will commit.

When done, last action is strict validator passing + evergreen-grep showing zero unexempted hits in README.md. No narration; just write files and exit.
