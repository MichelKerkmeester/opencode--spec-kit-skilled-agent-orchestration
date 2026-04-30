---
title: "Implementation Summary: Remove mcp-clickup skill"
description: "Decommissioned the mcp-clickup skill: deleted the skill folder, its changelog, all advisor scoring entries, skill-graph nodes/edges, repo-wide README counts, and stale playbook anchor rows — preserving service-level ClickUp/UTCP references that flow through Code Mode."
trigger_phrases: ["053 implementation summary", "mcp-clickup removed"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup"
    last_updated_at: "2026-04-30T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed skill folder + 38 references; spec validates strict"
    next_safe_action: "Optional: run /memory:save to refresh description.json + indexed continuity"
    blockers: []
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `mcp-clickup` skill is gone from the repo. The skill folder and its changelog are deleted, and every internal reference that pointed at the skill (advisor scoring tables, skill-graph nodes and edges, README listings, install-guide skill counts, dead manual-test anchor rows, and a regression test case) has been pruned. The skill set drops from 22 to 21 skills (advisor count) and 18 to 17 (install-guide-visible count). ClickUp-as-a-service references that flow through Code Mode (UTCP `clickup` manual, the upstream `mcp-clickup` npm package args, ClickUp env-var conventions, AGENTS.md naming examples) are intentionally preserved — they describe the upstream tool, not the orchestrator skill.

### Files Changed

| Path | Change | Notes |
|---|---|---|
| `.opencode/skill/mcp-clickup/` | **Deleted** | 37 files (whole skill tree) |
| `.opencode/changelog/mcp-clickup/` | **Deleted** | 1 file |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Edited | Removed `'mcp-clickup'` category-hint entry |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Edited | Removed `clickup` and `sprint` token-boost entries |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Edited | Removed 4 INTENT routing entries (`clickup`, `cu`, `sprint`, `standup`), 2 hyphenated-token entries (`clickup-cli`, `task-management`), and the `mcp-clickup` boost from the `tooling` category (3 dicts touched) |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Edited (Python json round-trip) | `skill_count` 22→21; dropped `families.mcp[mcp-clickup]`, `adjacency.mcp-clickup`, `mcp-code-mode.prerequisite_for[mcp-clickup]`, `skill-advisor.enhances[mcp-clickup]`, `signals.mcp-clickup` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | Edited | Removed routing edge `enhances[mcp-clickup]` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Edited | Removed `P1-GRAPH-003` regression case (expected mcp-clickup) |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl` | Edited | Removed 3 ClickUp-routing labels (`rr-iter2-056`, `rr-iter3-181`, `rr-iter3-197`) that asserted `mcp-clickup` as the correct top-1 routing |
| `.opencode/skill/.smart-router-telemetry/compliance.jsonl` | Edited | Removed 3 telemetry rows downstream of the deleted labels (same `promptId`s) |
| `mcp_server/database/code-graph.sqlite` | Edited (SQL DELETE) | Removed 1 stale `code_files` row (`mcp-clickup/scripts/install.sh`) and 10 cascade `code_nodes` rows that survived the file-system delete |
| `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` | Edited (SQL DELETE) | Purged 12 historical `memory_index` rows + 12 matching `memory_lineage` rows (memory IDs 167, 185, 190, 705, 813–818, 955, 1026) — voyage-embedded snapshots of past spec packets that mentioned mcp-clickup; will reappear on next `memory_ingest` of those packets |
| `.opencode/skill/mcp-code-mode/graph-metadata.json` | Edited | Removed `prerequisite_for[mcp-clickup]` cross-link |
| `.opencode/skill/README.md` | Edited (4 lines) | Total 21→20, MCP integration count 5→4, table row dropped, tree line dropped, runtime-coverage row dropped |
| `.opencode/install_guides/README.md` | Edited (2 lines) | Skill table row dropped, "Skills 18 → 17" + name list updated |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Edited (1 line) | "Skills 18 → 17" + name list updated |
| `README.md` (root) | Edited (1 block) | Removed the `**mcp-clickup**` skill section |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/01--core-tools/003-tool-info-schema.md` | Edited | Removed dead-anchor row for `mcp-clickup/SKILL.md` |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/02--manual-namespace-contract/001-correct-manual-tool-form.md` | Edited | Same |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/001-sequential-chain.md` | Edited | Same |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/002-promise-all-parallel.md` | Edited | Same |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/05--clickup-and-chrome-via-cm/001-clickup-create-read-delete.md` | Edited | Same |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/05--clickup-and-chrome-via-cm/003-sibling-pair-handover.md` | Edited | Same |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/07--recovery-and-config/005-partial-chain-rollback.md` | Edited | Same |

Total: 38 files deleted (skill + changelog) + 21 files edited + 2 SQLite databases pruned (35 rows total: 11 in code-graph, 24 in voyage memory index).

**Historical artifacts deliberately left untouched** (62 files): `mcp-clickup` mentions inside other `.opencode/specs/...` packets (research iterations, deep-review state, decision records, scratch notes, prior implementation summaries — frozen records of past work that *was about* the skill) and `.opencode/skill/system-spec-kit/scripts/observability/` reports (timestamped historical performance data). Editing these would falsify the audit trail; they remain as accurate snapshots of what the repo looked like when mcp-clickup existed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work split into three phases. Phase A deleted the two trees (`.opencode/skill/mcp-clickup/`, `.opencode/changelog/mcp-clickup/`) via `rm -rf`. Phase B pruned the advisor surface using surgical text edits on three TS/Python files plus a Python `json.load → modify → json.dump` round-trip on `skill-graph.json` (the safe path for a single-line JSON with multiple cross-cutting nodes). Phase C swept user-facing docs (READMEs, install guides, the root README, mcp-code-mode graph metadata, and seven manual-testing-playbook anchor rows) plus a stale regression-fixture line. JSON parse-validity, Python AST parse-validity, and `validate.sh --strict` were the gates after each phase.

A dangling skill name in advisor data, skill graphs, or README listings would surface broken recommendations to operators (Gate 2 routing pointing at a non-existent skill). This sweep keeps the skill set internally consistent: every name that appears in an advisor table, graph node, or doc list now resolves to a real skill folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Service references kept**: `clickup`-as-a-service mentions in `mcp-code-mode/SKILL.md`, `mcp-code-mode/README.md`, AGENTS.md siblings, and install-guide UTCP examples were preserved. Rationale: those describe how Code Mode talks to the *upstream* `clickup` MCP server, which still works without the local orchestrator skill.
- **`args: ["mcp-clickup"]` left in `mcp-code-mode/README.md`**: that string names the upstream npm package (a different `mcp-clickup`), not the local skill folder. Removing it would damage the documented UTCP wiring example.
- **Skill-graph edits via Python, not Edit**: the file is a single line of JSON with mcp-clickup appearing in `families.mcp`, `adjacency`, multiple `prerequisite_for`/`enhances` maps, `signals`, and `skill_count`. A Python round-trip kept the structure consistent and decremented the count atomically. Output style matches the original (compact dict with spaces).
- **Stayed on `main`, no feature branch**: per durable user policy, packet-local branches are not used here.
- **Removed regression case `P1-GRAPH-003`**: with `mcp-clickup` gone from the advisor, the case "expect mcp-clickup as top match for 'clickup create task via mcp'" can no longer pass. Removing the case is correct because the routing it asserts has been intentionally removed.

### Edge Cases Handled

- **Service vs. skill distinction**: `clickup`-the-service references that travel through Code Mode (UTCP manual, env vars, `cu` CLI examples in install guides, AGENTS.md naming examples, the upstream `mcp-clickup` npm package in `args: ["mcp-clickup"]`) were preserved. Only references that named *the local skill folder* were removed.
- **Skill-graph orphan edges**: `mcp-code-mode.prerequisite_for` and `skill-advisor.enhances` both contained `mcp-clickup` — both were pruned in the same Python pass that decremented `skill_count`.
- **Stale playbook anchors**: 7 manual-testing-playbook scenarios in `mcp-code-mode` had a "Related files" row pointing at `.opencode/skill/mcp-clickup/SKILL.md` (now a dead path) — those rows were removed; the test scenarios still work because they invoke `clickup.clickup_*` calls via Code Mode, which doesn't depend on the local skill catalog.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Repo-wide reference scan**: `grep -rn "mcp-clickup" --include="*.md" --include="*.json" --include="*.ts" --include="*.py" --include="*.sh" --include="*.yaml" --include="*.toml"` excluding `.opencode/specs/`, observability reports, and advisor-fixtures returns **one match**: `mcp-code-mode/README.md:238 args: ["mcp-clickup"]` — the upstream npm package name (different `mcp-clickup`), intentionally preserved.
- **JSON parse round-trip**: `python3 -m json.tool` passes on `skill-graph.json`, `skill_advisor/graph-metadata.json`, `mcp-code-mode/graph-metadata.json`, plus the 053 spec's own `description.json` and `graph-metadata.json`.
- **Python AST parse**: `ast.parse()` passes on `skill_advisor.py` (no syntactic damage from removed entries).
- **Skill graph counts**: post-edit `skill_count=21`, `families.mcp=['mcp-chrome-devtools', 'mcp-coco-index', 'mcp-code-mode', 'mcp-figma']`, no `mcp-clickup` key in `adjacency` or `signals`, `mcp-code-mode.prerequisite_for=['mcp-figma', 'mcp-chrome-devtools']`.
- **Spec validator**: `validate.sh --strict` passes core rules (TEMPLATE_SOURCE, TEMPLATE_HEADERS, FILE_EXISTS, COMPLEXITY_MATCH, FOLDER_NAMING, GRAPH_METADATA_PRESENT, SPEC_DOC_INTEGRITY). Two non-blocking warnings remain (EVIDENCE_CITED on items pre-marked complete, SECTION_COUNTS expecting acceptance scenarios in a deletion-only spec) — neither blocks the cleanup.
- **Database state**: post-cleanup `mcp-clickup` mention counts — `skill-graph.sqlite=0`, `code-graph.sqlite=0`, `voyage-context-index=0`, `deep-loop-graph=0`, `speckit-eval=0`. The lone surviving DB hits are 19 rows across 6 tables in `context-index.sqlite`, all tagged `spec_folder=skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup` — they index *this* packet's spec docs and are expected to be there.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No automatic re-routing for "clickup" prompts**: with mcp-clickup gone from the advisor, a user typing "clickup task" no longer gets a high-confidence skill recommendation. The `tooling` category in `skill_advisor.py` still boosts `mcp-code-mode` and `mcp-chrome-devtools` for tooling-shaped prompts, which is the natural surviving path, but no rule explicitly steers `clickup` → `mcp-code-mode`. Add such a mapping if that routing is desired.
- **Compiled artifacts not regenerated**: if `skill-graph.json` is consumed by a downstream compiled artifact (`skill_graph_compiler.py` outputs, advisor cache, etc.), those will need a rebuild before they reflect the 21-skill state.
- **Single-line JSON formatting**: the rewritten `skill-graph.json` keeps the original compact-with-spaces shape. Diffs against history will look noisy because the entire payload is one line; this is the upstream convention, not an artifact of this change.
<!-- /ANCHOR:limitations -->

