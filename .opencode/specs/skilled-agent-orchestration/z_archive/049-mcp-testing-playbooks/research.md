---
title: "Research: MCP Testing Playbooks Phase-1 Inventory + CCC Audit Findings"
description: "Phase-1 test-data inventory captured for each of the four MCP skills (CM, BDG, CU, CCC), plus the CCC audit findings against the existing playbook."
trigger_phrases:
  - "049 research"
  - "mcp playbook research"
  - "phase-1 inventory"
  - "ccc audit findings"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/049-mcp-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Captured Phase-1 test-data inventory for all 4 MCP skills"
    next_safe_action: "Run generate-description.js for spec 049 metadata"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-bootstrap-2026-04-26"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---

# Research: MCP Testing Playbooks Phase-1 Inventory

This document captures the per-skill test-data inventory gathered during plan-mode Phase 1 (2026-04-26). It is the source of truth for scenario authoring in Phases 2-5. The CCC audit findings will be appended in Phase 5.

---

## 1. mcp-code-mode (CM) — foundational orchestrator

### Identity
- Skill location: `.opencode/skill/mcp-code-mode`
- Mode: hybrid orchestrator wrapping all external MCP servers
- Foundational: defines the cross-skill vocabulary (manual-namespace, env-prefixing, call_tool_chain) that BDG, CU, and other MCP skills reference

### Surfaces under test

**Core tools (always available, ~1.6k tokens context):**
- `call_tool_chain({code: "TypeScript", timeout?: number})` — execute TypeScript with tool access
- `search_tools({task_description: string, limit?: number})` — progressive discovery
- `list_tools()` — list all available tools
- `tool_info({tool_name: string})` — get tool interface details

**External MCP tools accessed via Code Mode (159+ across 6 manuals):**
- webflow (42 tools)
- figma (18 tools)
- chrome_devtools_1 + chrome_devtools_2 (26 tools each, parallel instances)
- clickup (21 tools)
- github (26 tools)
- notion (varies)

### Setup / preflight
- Configuration file: `.utcp_config.json` at project root
- Environment file: `.env` at project root with **prefixed** variables (`{manual_name}_{VAR_NAME}`)
- Node.js: 18+
- Validation script: `python3 scripts/validate_config.py <config-path> --check-env <env-path>`

### Critical contract — manual namespace
Tool naming MUST follow `{manual}.{manual}_{tool}`:
- ✅ `clickup.clickup_create_task`
- ❌ `clickup.create_task` (missing manual prefix)
- ❌ `clickupCreateTask` (camelCase)
- `list_tools()` returns `a.b.c` format; calling syntax uses underscore `a.b_c`

### Critical contract — env-var prefixing
ALL env vars in Code Mode get a manual-name prefix:
- For manual `clickup`: `CLICKUP_API_KEY` → `clickup_CLICKUP_API_KEY` in `.env`
- For manual `webflow`: `WEBFLOW_TOKEN` → `webflow_WEBFLOW_TOKEN` in `.env`
- Unprefixed vars are NOT visible to the wrapped MCP server

### Edge cases / known limits
- Token budget: ~1.6k tokens for all 200+ tools vs 141k+ traditional MCP exposure
- Timeouts: simple 30s, complex 60s, very complex 120s+
- Sequential Thinking is NOT in `.utcp_config.json` (it's native MCP in `.mcp.json`); called directly, not via Code Mode
- MCP server stability: auto-restart on version mismatch or settings change

### Recovery / failure modes
- "Tool not found" → check naming pattern, verify `.utcp_config.json` entry
- "Env var not found" → check `.env` uses prefixed name; verify with `echo $clickup_CLICKUP_API_KEY`
- MCP server fails to start → check `.utcp_config.json` command/args; verify npx; check Node ≥18
- Disabled server → check `.utcp_config.json` for `"disabled": true`
- Execution timeout → increase timeout parameter or break workflow into smaller chunks

### Diagnostic commands
```bash
cat .utcp_config.json | jq '.'
list_tools()  # via Code Mode
search_tools({task_description: "task management"})
tool_info({tool_name: "clickup.clickup_create_task"})
python3 .opencode/skill/mcp-code-mode/scripts/validate_config.py .utcp_config.json --check-env .env
```

---

## 2. mcp-chrome-devtools (BDG) — CLI primary, MCP fallback

### Identity
- Skill location: `.opencode/skill/mcp-chrome-devtools`
- Mode: CLI-prioritized (`bdg`), MCP fallback via Code Mode for parallel instances
- Browser-required: Chrome / Chromium / Edge

### Surfaces under test

**CLI commands (`bdg`, primary):**
```
bdg --version
bdg <url>                        # start session
bdg status 2>&1
bdg stop
bdg cdp --list                   # list CDP domains
bdg cdp --describe <domain>
bdg cdp --search <term>
bdg dom screenshot <path>
bdg dom query "<selector>"
bdg dom eval "<expr>"
bdg console --list
bdg network getCookies
bdg network har <path>
```

**MCP tools (Code Mode, naming `chrome_devtools_N.chrome_devtools_N_*`):**
- `navigate_page`, `take_screenshot`, `list_console_messages`, `click`, `fill`, `hover`, `press_key`, `wait_for`, `new_page`, `close_page`, `select_page`
- Parallel instances supported: `chrome_devtools_1` and `chrome_devtools_2` simultaneously

### Setup / preflight
- Install: `npm install -g browser-debugger-cli@alpha`
- No env vars required (bdg is self-contained)
- Browser must be installed: `which google-chrome chromium-browser chromium`
- MCP config: `.utcp_config.json` entry with `npx chrome-devtools-mcp@latest --isolated=true`

### Edge cases / known limits
- CDP method availability: 300+ methods across 53 domains; signatures vary between Chrome versions
- Session cleanup: browser leaks if `bdg stop` not called (use trap pattern)
- Concurrency: CLI is sequential; MCP with `--isolated=true` supports parallel instances
- Browser requirement: Chrome/Chromium/Edge on macOS/Linux; Windows requires WSL

### Recovery / failure modes
- bdg not found → reinstall, verify npm global bin in PATH
- Chrome not detected → set `CHROME_PATH` env var
- Session won't start → `bdg status 2>&1` for diagnostic; may indicate Chrome not on CDP port
- MCP tool not found → verify manual name matches `.utcp_config.json` (e.g., `chrome_devtools_1`); check naming pattern `{manual}.{manual}_{tool}` (per CM-005)
- Screenshots blank → verify page loaded with `bdg status`; debug with `bdg dom eval "document.body.innerHTML"`

### Cross-skill integrations
- Depends on **mcp-code-mode** for MCP approach (Code Mode wraps bdg MCP server)
- Used by **sk-code-web** for Phase 3 browser verification

---

## 3. mcp-clickup (CU) — CLI primary, MCP for enterprise

### Identity
- Skill location: `.opencode/skill/mcp-clickup`
- Mode: CLI-prioritized (`cu`), MCP for enterprise features (docs, goals, webhooks, time tracking)
- Auth: ClickUp API token + workspace ID required

### Surfaces under test

**CLI commands (`cu`, primary):**
```
cu --version                     # MUST NOT show "Taylor UUCP"
cu auth
cu init
cu spaces
cu lists <spaceId>
cu tasks
cu assigned
cu sprint
cu sprints
cu summary                       # CLI-only standup summary
cu search <query>
cu task <id>
cu subtasks <id>
cu comments <id>
cu activity <id>
cu inbox
cu overdue
cu open <query>
cu create -n "name" -l <listId>
cu update <id> --status "done"
cu comment <id> -m "text"
cu assign <id> --to me
cu depend <id> --on <otherId>
cu move <id> --to <listId>
cu field <id> --set "Field" value
cu tag <id> --add "bug,frontend"
cu delete <id> --confirm         # destructive; --confirm required
```

**MCP tools (Code Mode, naming `clickup.clickup_*`, 46 tools):**
- `create_task`, `get_task`, `update_task`, `delete_task`, `search_tasks`
- `create_bulk_tasks`, `update_bulk_tasks` (bulk)
- `manage_comments`, `manage_custom_fields`
- `create_document` (MCP-only)
- `manage_goals`, `manage_time_entries`, `manage_webhooks`, `manage_chat_messages` (all MCP-only)

### Setup / preflight
- Install: `npm install -g @krodak/clickup-cli` (Node ≥22.0.0)
- Auth: `cu init` (interactive); ClickUp API token from Settings > Apps > API Token (starts with `pk_`); team ID from Settings > Workspaces (numeric)
- MCP config: `.utcp_config.json` with `npx -y @taazkareem/clickup-mcp-server@latest`
- MCP env (in `.env`, prefixed): `clickup_CLICKUP_API_KEY=pk_xxx`, `clickup_CLICKUP_TEAM_ID=xxx`

### Critical install conflict — system `cu` (UUCP)
On macOS/Linux, system `cu` may exist (Taylor UUCP, the Unix-to-Unix Copy utility). Verify:
```bash
cu --version 2>&1 | head -1   # Must show ClickUp, not "Taylor UUCP"
```
Fix if conflict: add npm bin to PATH first: `echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc`

### Edge cases / known limits
- CLI vs MCP parity: Sprint/standup CLI-only; Documents/Goals/Webhooks/Time tracking MCP-only
- Rate limits: ClickUp API enforces; 429 → wait per retry-after header
- Task ID ambiguity: CLI may do fuzzy name lookup; verify with `cu task <id>` before destructive ops
- Custom fields: CLI basic, MCP full CRUD
- Enterprise features: Guests, audit logs require Enterprise plan

### Recovery / failure modes
- CLI not found → install with `npm install -g @krodak/clickup-cli`; verify Node ≥22
- AUTH FAILS → `cu init` reconfigure; check token in ClickUp Settings
- System `cu` conflict → check `which cu`; if UUCP, fix PATH order
- "Tool not found" in MCP → verify manual name `clickup` (not typo); check `.utcp_config.json` entry; test via `list_tools()` (per CM-005..CM-007)
- MCP env vars missing → check `.env` uses prefixed names: `clickup_CLICKUP_API_KEY` (per CM-008..CM-010)
- Rate limited → ClickUp returns 429; wait per retry-after; reduce request frequency

### Cross-skill integrations
- Depends on **mcp-code-mode** for MCP enterprise features (CM-014 wraps cu via Code Mode)
- Cross-tool: design-to-task workflow — Figma → cu task creation via Code Mode

---

## 4. mcp-coco-index (CCC) — semantic code search (audit only)

### Identity (existing playbook is current)
- Skill location: `.opencode/skill/mcp-coco-index`
- Mode: hybrid CLI (`ccc`) + single MCP `search` tool
- **Existing playbook**: `manual_testing_playbook/` with 23 scenarios across 7 categories (CCC-001..CCC-005, MCP-001..MCP-007, CFG-001..CFG-003, DMN-001..DMN-002, ADV-001..ADV-002, ERR-001, INT-001..INT-003)

### Phase-1 test-data inventory for audit comparison

**Surfaces in current Phase-1 inventory not yet in existing playbook:**

| Inventory item | In existing playbook? | Notes |
|---|---|---|
| `ccc search "query" --lang typescript` filter | YES (CCC-004 covers `--lang` repeatable + `--limit`) | OK |
| `ccc search "query" --path "src/**"` filter | YES via MCP-004 (path filter); CLI variant absent | Possible gap if CLI path-filter behavior differs from MCP |
| Concurrent `refresh_index=true` race (ComponentContext error) | NO explicit scenario | Possible gap — known issue per Phase-1 inventory |
| Daemon socket health (`~/.cocoindex_code/daemon.sock`) | Partially via DMN-002 (daemon.pid + daemon.sock files exist) | Adequate |
| Daemon log inspection (`~/.cocoindex_code/daemon.log`) | NO explicit scenario | Minor; covered by Recovery section in SKILL.md |
| Env-var precedence (`COCOINDEX_CODE_ROOT_PATH` override) | NO explicit scenario | Possible gap — root-path override is documented |
| Voyage-code-3 reset cycle (model change requires `ccc reset && ccc index`) | Partially via CCC-005 (destructive reset), CFG-001 (model verification) | Adequate as composite |
| `doctor.sh` and `ensure_ready.sh` wrapper scripts | NO explicit scenario | Possible gap — these are documented helper scripts |
| Similarity score threshold guidance (>0.5 actionable, <0.3 noise) | NO explicit scenario | Possible gap — heuristic stated in SKILL.md |

**CCC Audit Findings**: To be recorded in §5 below after Phase 5 audit task (T070-T075).

---

## 5. CCC Audit Findings

### CCC Audit (2026-04-26)

- **Auditor**: claude-opus-4.7 (write sub-agent dispatched from main session)
- **Existing scenarios reviewed**: 23 (CCC-001..CCC-005, MCP-001..MCP-007, CFG-001..CFG-003, DMN-001..DMN-002, ADV-001..ADV-002, ERR-001, INT-001..INT-003)
- **Inventory items checked**: 9 (per §4 table)
- **Decision rule applied**: ADR-002 (audit-only, append per-feature files only on confirmed gaps, do not renumber existing IDs, do not rewrite root)

#### Per-item findings

| Inventory item | Coverage | Action |
|---|---|---|
| `--lang` filter | YES — CCC-004 covers `--lang python --lang typescript --limit 3` (repeatable + limit composition); MCP-002/003 cover `languages` single + multi | no action |
| `--path` filter | PARTIAL — MCP-004 covers MCP `paths` parameter; CLI `--path` (per SKILL.md §3) has no direct scenario but is exercised transitively via search-with-filters in CCC-004 and through helper scripts | no action — composite coverage adequate per ADR-002 audit-only intent |
| Concurrent `refresh_index=true` race (ComponentContext) | NO — MCP-007 covers the `refresh_index=false` happy path; the documented race in SKILL.md §4 ("Concurrent Query Sessions") has no scenario | append PER-FEATURE file as MCP-008 |
| Daemon socket health (`~/.cocoindex_code/daemon.sock`) | YES — DMN-002 explicitly checks `ls ~/.cocoindex_code/daemon.pid ~/.cocoindex_code/daemon.sock` for both files | no action |
| Daemon log inspection (`~/.cocoindex_code/daemon.log`) | PARTIAL — referenced in MCP-007 + DMN-002 failure-triage steps; no first-class scenario, but covered as recovery aid in adjacent scenarios | no action — adequate via failure-triage references |
| Env-var precedence (`COCOINDEX_CODE_ROOT_PATH` override) | NO — SKILL.md §3 documents the 4-priority resolution order with the env var at priority #1, but no scenario validates env-var-wins-over-marker-discovery | append PER-FEATURE file as CFG-004 |
| Voyage-code-3 reset cycle | YES — CCC-005 (destructive reset + rebuild) + CFG-001 (model-field check) compose the documented model-change flow | no action |
| `doctor.sh` and `ensure_ready.sh` wrapper scripts | NO — SKILL.md §4 ALWAYS rule #7 mandates the helper scripts; no scenario validates their `--strict --require-config` paths or idempotency | append PER-FEATURE file as DMN-003 |
| Similarity score threshold (>0.5 actionable, <0.3 noise) | PARTIAL — SKILL.md §4 NEVER rule #5 documents the threshold; MCP-001 captures `score` field shape but not score-band semantics | no action — heuristic is doc-only and would be brittle to assert deterministically |

#### Confirmed gaps

3 confirmed gaps (at the ADR-002 ceiling of 3):

1. **MCP-008** (Concurrent refresh_index race) — fills the documented `ComponentContext` race callout in SKILL.md §4 with a deterministic two-call concurrent test plus `refresh_index=false` fallback verification.
2. **CFG-004** (Root-path env-var override) — fills the SKILL.md §3 root-resolution priority chain by asserting that `COCOINDEX_CODE_ROOT_PATH` wins over marker-directory discovery when both are present.
3. **DMN-003** (Helper-script readiness) — fills the SKILL.md §4 ALWAYS rule #7 mandate by exercising both `doctor.sh` and `ensure_ready.sh` on positive (healthy project) and negative (`--require-config` against a directory without `.cocoindex_code/`) paths plus idempotency.

The 3 PARTIAL items (`--path` CLI, daemon log, similarity threshold) are explicitly NOT promoted to gaps: composite coverage and failure-triage references are deemed adequate per ADR-002 "audit-only, no rewrite" framing, and the similarity threshold is a heuristic that resists deterministic assertion.

#### Files appended

- `.opencode/skill/mcp-coco-index/manual_testing_playbook/02--mcp-search-tool/008-concurrent-refresh-race.md` (MCP-008)
- `.opencode/skill/mcp-coco-index/manual_testing_playbook/03--configuration/004-root-path-env-var-override.md` (CFG-004)
- `.opencode/skill/mcp-coco-index/manual_testing_playbook/04--daemon-lifecycle/003-helper-script-readiness.md` (DMN-003)

#### Root-playbook edits (append-only)

- `manual_testing_playbook.md` §8 MCP SEARCH TOOL: appended `MCP-008` scenario summary block after the existing `MCP-007` block; existing `MCP-001..MCP-007` blocks unchanged.
- `manual_testing_playbook.md` §9 CONFIGURATION: appended `CFG-004` scenario summary block after the existing `CFG-003` block; existing `CFG-001..CFG-003` blocks unchanged.
- `manual_testing_playbook.md` §10 DAEMON LIFECYCLE: appended `DMN-003` scenario summary block after the existing `DMN-002` block; existing `DMN-001..DMN-002` blocks unchanged.
- `manual_testing_playbook.md` §15 FEATURE FILE INDEX: appended one entry per new scenario (MCP-008, CFG-004, DMN-003) under the respective category lists; existing entries unchanged.
- `manual_testing_playbook.md` §1 OVERVIEW count ("23 deterministic scenarios across 7 categories") intentionally NOT modified per the strict ADR-002 append-only constraint; the audit findings document the new 3 scenarios explicitly.

#### Existing-ID preservation verification

All 23 existing IDs (CCC-001..CCC-005, MCP-001..MCP-007, CFG-001..CFG-003, DMN-001..DMN-002, ADV-001..ADV-002, ERR-001, INT-001..INT-003) preserved verbatim — no renumbering, no per-feature-file modifications. Only 3 new files added at next-free numeric slots in the matching existing categories: MCP-008 (slot 008 in `02--mcp-search-tool/`), CFG-004 (slot 004 in `03--configuration/`), DMN-003 (slot 003 in `04--daemon-lifecycle/`). Verified via git diff scoping in the audit reporting step.

---

## 6. Sources for Phase-1 inventory

- `.opencode/skill/mcp-chrome-devtools/SKILL.md` (CLI surface, MCP surface, recovery commands)
- `.opencode/skill/mcp-clickup/SKILL.md` and `references/install_guides/INSTALL_GUIDE.md` (full CLI + MCP catalogs, system-cu conflict, auth flow)
- `.opencode/skill/mcp-coco-index/SKILL.md` and existing `manual_testing_playbook/` (current contract; Phase-5 audit baseline)
- `.opencode/skill/mcp-code-mode/SKILL.md` and `references/install_guides/INSTALL_GUIDE.md` (manual-namespace contract, env-prefixing rule, validation script, tool counts)
- `.opencode/command/create/testing-playbook.md` (workflow contract for `/create:testing-playbook`)
- `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` (root + snippet templates)
- 5 in-tree precedent playbooks: mcp-coco-index, sk-deep-research, sk-improve-agent, sk-deep-review, system-spec-kit
