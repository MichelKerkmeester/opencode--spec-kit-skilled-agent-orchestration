---
title: "Implementation Summary: Remove sk-code-full-stack and sk-code-web"
description: "Hard-removed both deprecated skills from disk, neutralized sk-code's 10 placeholder pointers, and swept ~50 reference files plus 3 SQLite databases across the repo. ~36 markdown files of canonical non-web stack guidance retired (per user decision)."
trigger_phrases: ["055 implementation summary", "sk-code-merger deprecated removed"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated"
    last_updated_at: "2026-04-30T11:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Both skills removed; repo-wide reference scan returns zero outside specs/observability"
    next_safe_action: "Optional: run /memory:save and doctor:skill-advisor"
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

The two skills soft-deprecated by `054-sk-code-merger` are gone. The skill folders were deleted, every cross-reference across advisor data, skill graphs, READMEs, install guides, AGENTS siblings, eval / telemetry JSONL, sk-code's own placeholder pointers, four runtime agent-definition files, and three SQLite indexes was pruned. Skill counts dropped 22→20 (advisor) and 17→15 (install-guide-visible). The user's accepted trade-off — retiring ~36 markdown files of canonical React / Node / Go / Swift / React Native guidance — is reflected in the 10 neutralized `_placeholder.md` files under `sk-code/{references,assets}/<stack>/`.

### Files Changed

| Path | Change | Notes |
|---|---|---|
| `.opencode/skill/sk-code-full-stack/` | **Deleted** | 82 files (whole tree) |
| `.opencode/skill/sk-code-web/` | **Deleted** | 46 files (whole tree, including internal `changelog/CHANGELOG.md`) |
| `.opencode/skill/sk-code/{references,assets}/{react,nodejs,go,swift,react-native}/_placeholder.md` (10) | Rewritten | Neutralized: `canonical_source: null`, body points at git history |
| `.opencode/skill/sk-code/SKILL.md` | Edited (9 surgical replacements) | Description, routing pseudocode, related-skills table all stripped of deprecated names |
| `.opencode/skill/sk-code/README.md` | Edited (5 surgical replacements) | Stack-detection table, structure inventory, troubleshooting, migration notes |
| `.opencode/skill/sk-code/graph-metadata.json` | Edited (Python json round-trip) | Dropped `supersedes` array, dropped sibling adjacency edges, rewrote `causal_summary` |
| `.opencode/skill/sk-code/description.json` | Edited (Python json round-trip) | Dropped `supersedes`, rewrote `description` |
| `.opencode/skill/sk-code/CHANGELOG.md` | Rewritten | Added [1.0.1] entry for the 055 cleanup; rewrote [1.0.0] entry without deprecated names |
| `.opencode/skill/sk-code/changelog/v1.0.0.0.md` | Edited (1 line) | Mechanical rewording |
| `.opencode/skill/sk-code/references/{router,universal,webflow}/*.md` and `assets/{universal,webflow}/checklists/*.md` (13 files) | Edited (Python sed pass) | Stripped deprecated names from inline narrative + retargeted 25 `sk-code-web/scripts/` paths to `sk-code/scripts/` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Edited | Removed stale comment line referencing deprecated skill |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Edited (Python json round-trip) | `skill_count` 22→20, dropped both from `families.sk-code`, removed `adjacency.sk-code-web` + `adjacency.sk-code-full-stack`, pruned peer adjacency entries, removed from `signals` if present |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Edited | Retargeted P1-WEB-001, P1-WEB-002, P1-FULLSTACK-001, P1-PHRASE-008 to expect `sk-code` |
| `.opencode/skill/.smart-router-telemetry/compliance.jsonl` | Edited | Deleted 3 `selectedSkill:"sk-code-web"` rows |
| `README.md` (root) | Edited | Replaced two skill sections with one consolidated `**sk-code**` section |
| `AGENTS.md` (root) | Edited (1 line) | Replaced "→ placeholder + sk-code-full-stack pointer" with neutral text |
| `CLAUDE.md` (root) | Edited (1 line) | Same edit as AGENTS.md |
| `.opencode/skill/README.md` | Edited (5 lines) | Skill counts (20→18, overlays 4→3), table row consolidated, tree line, runtime matrix |
| `.opencode/install_guides/README.md` | Edited (9 replacements) | Skill rows removed/merged, frontend/backend role rows, count cell |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Edited (11 replacements) | Section header, table rows, routing examples, skills count |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Edited (4 replacements) | Skill examples and table |
| `.opencode/skill/sk-code-review/SKILL.md` + `README.md` + `graph-metadata.json` + `references/*.md` (10 files) | Edited (32 replacements) | Overlay-target swap to `sk-code-opencode` and `sk-code` |
| `.opencode/skill/sk-code-opencode/{SKILL.md, README.md}` | Edited (12 replacements) | Cosmetic cross-skill mentions |
| `.opencode/skill/mcp-chrome-devtools/{SKILL.md, README.md, examples/README.md}` | Edited (9 replacements) | Path-style cross-refs |
| `.opencode/skill/cli-{claude-code, codex, gemini}/SKILL.md` + `cli-opencode/assets/prompt_templates.md` | Edited (7 replacements) | Narrative cross-refs |
| `.opencode/skill/sk-doc/assets/skill/skill_md_template.md`, `sk-git/README.md`, `sk-improve-prompt/SKILL.md` | Edited (4 replacements) | Cross-refs |
| `.opencode/skill/system-spec-kit/{assets/level_decision_matrix.md, references/**/*.md}` (5 files) | Edited (5+ replacements) | Reference doc cross-refs |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/shadow-sink.vitest.ts` + `mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts` | Edited | Test fixture skill names |
| `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.gemini/agents/deep-review.md`, `.opencode/agent/deep-review.md` | Edited | Overlay listings retargeted to `sk-code-opencode / sk-code` |
| `mcp_server/database/skill-graph.sqlite` | Edited (SQL DELETE + Python UPDATE) | Removed 2 nodes + 4 cascade/orphan edges; refreshed stale `derived` JSON in sk-code and sk-code-review nodes from disk; final state: 20 nodes, 73 edges |
| `mcp_server/database/code-graph.sqlite` | Edited (SQL DELETE) | Removed 28 `code_files` rows + 1910 `code_nodes` rows under deprecated skill paths |
| `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` | Edited (SQL DELETE) | Purged 25 `memory_index` rows + 25 `memory_lineage` rows + 25 `memory_history` rows tied to historical content |

Total: 128 files deleted (skill + changelog) + ~50 files edited + 3 SQLite databases pruned (~2000 rows total).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work split into three phases mirroring the just-completed 053 (mcp-clickup) precedent. Phase A deleted both skill trees via `rm -rf` (128 files). Phase B (Implementation) used a mix of surgical Edit calls and a Python sed-style pass for mechanical replacements: 25 path retargets (`sk-code-web/scripts/` → `sk-code/scripts/`) and ~30 narrative scrubs across sk-code's references/, assets/, CHANGELOG, description.json, and graph-metadata.json. Cross-skill files (sk-code-review, sk-code-opencode, mcp-chrome-devtools, the four cli-* orchestrators, sk-doc, sk-git, sk-improve-prompt, system-spec-kit references, two vitest tests, four runtime deep-review agent definitions, three install guides, and the root README/AGENTS/CLAUDE) were swept in a single 30-file Python text-replacement pass with an ordered replacement table (longer/more-specific patterns first). Phase C (SQLite) used `sqlite3 DELETE FROM` against skill-graph (cascade-deleted 4 orphan edges and refreshed 2 stale `derived` JSON columns from the cleaned graph-metadata.json files via Python UPDATE), code-graph (DELETE rows under deprecated paths), and the voyage memory index (purged 75 rows across memory_index/memory_lineage/memory_history). After each phase, JSON parse-validity, Python AST parse-validity, and a repo-wide grep gated progress.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Hard-delete with content loss accepted (user decision)**: The user explicitly chose Option B from the planning AskUserQuestion — delete both skills today and accept the loss of the ~36 markdown files of non-web stack canonical guidance hosted by sk-code-full-stack. The placeholder pointers in sk-code that had named the deprecated skill were neutralized to "canonical content retired (consult git history)" stubs.
- **Stripped `supersedes` historical metadata** in `sk-code/graph-metadata.json` and `description.json` — the user wanted ALL references gone, not preserved as historical residual (departure from 053 precedent where `supersedes` arrays were kept as audit trail; 053 had a single skill being removed and the `supersedes` array was elsewhere).
- **Webflow scripts retargeted, not stripped**: All `sk-code-web/scripts/{minify-webflow,verify-minification,test-minified-runtime}.mjs` references in `sk-code/references/webflow/deployment/*.md` were retargeted to `sk-code/scripts/` rather than removed — the merger had already copied the scripts into the new location, so retargeting preserves working command examples.
- **CHANGELOG.md rewritten with [1.0.1] entry**: Rather than preserving the [1.0.0] entry verbatim with deprecated names scrubbed (would read awkwardly as "merged from two skills... (names removed)"), the file was restructured: [1.0.1] documents the 055 cleanup explicitly; [1.0.0] was rewritten in neutral language describing the merger origin without naming the predecessors.
- **Stale `derived` JSON in skill-graph.sqlite refreshed via Python UPDATE**: Rather than leaving stale derived data and waiting for `doctor:skill-advisor` to rebuild, the sk-code and sk-code-review node `derived` columns were updated in-place from their cleaned graph-metadata.json files. This keeps the live SQLite consistent with disk without requiring a follow-up rebuild.
- **Stayed on `main`**: per durable user policy `feedback_stay_on_main_no_feature_branches`.
- **AGENTS_Barter.md / AGENTS_example_fs_enterprises.md not touched**: pre-edit grep confirmed zero hits; durable-rule triad-sync was a no-op for this packet.

### Edge Cases Handled

- **`families.sk-code` shrunk 5 → 3**: after deleting the two deprecated skill nodes, `families.sk-code` contains only `sk-code`, `sk-code-opencode`, `sk-code-review` — non-empty, no special-case needed.
- **Orphan skill_edges with deprecated source/target**: SQLite ON DELETE CASCADE didn't fire because the connection didn't have `PRAGMA foreign_keys=ON`. Caught the orphans (4 rows: 2 inbound + 2 outbound siblings) on post-state grep and DELETEd explicitly.
- **`memory_history` orphans**: Deleting `memory_index` rows in voyage doesn't cascade to `memory_history` (no FK). Found 25 orphan history rows referencing the deleted memory IDs; DELETEd in the same pass.
- **`vec_memories_*` virtual table**: Same as 053 precedent — sqlite3 CLI lacks `vec0` extension, so vec rows can't be DELETEd. The voyage `vec_memories_rowids` showed 0 entries for the purged memory IDs, so no orphan vec embeddings exist.
- **Runtime advisor banner cached**: The runtime skill registry shown in the system reminders still names the deprecated skills in `sk-code-review`'s overlay description ("with sk-code-opencode, sk-code-web, and sk-code-full-stack standards"). The on-disk file was updated to "sk-code-opencode and sk-code"; the banner refreshes on next session start.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Repo-wide reference scan**: `grep -rln "sk-code-web\|sk-code-full-stack"` excluding `.opencode/specs/`, `observability/`, `055-cli-skill-removal-sk-code-merger-deprecated/`, `.git/`, `node_modules/`, `z_archive/`, `z_future/` returns **zero hits**.
- **JSON parse**: `python3 -m json.tool` passes on `sk-code/description.json`, `sk-code/graph-metadata.json`, `sk-code-review/graph-metadata.json`, advisor `skill-graph.json`, plus the 055 packet's own `description.json` + `graph-metadata.json`.
- **Python AST parse**: `ast.parse()` passes on `skill_advisor.py`.
- **Database state**: post-cleanup mention counts — `skill-graph.sqlite=0`, `code-graph.sqlite=0`, `voyage-context-index=0`, `context-index.sqlite=0`, `deep-loop-graph=0`, `memory.db=0`, `speckit-eval.db=0`. skill-graph.sqlite final shape: 20 nodes (was 22), 73 edges.
- **Skill graph counts converge**: `skill-graph.json` declares `skill_count: 20` ↔ `skill-graph.sqlite` SELECT COUNT(*) FROM skill_nodes returns 20. ↔ `families.sk-code` lists exactly the 3 surviving siblings (sk-code, sk-code-opencode, sk-code-review).
- **Spec validator**: `validate.sh --strict` against this spec folder — to be run next.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Non-web stack guidance retired**: Operators querying React, Node.js, Go, Swift, or React Native guidance via `sk-code` now hit a neutralized placeholder ("canonical content retired; consult git history"). To restore guidance, populate `sk-code/references/<stack>/` and `sk-code/assets/<stack>/` from git history at a commit before 2026-04-30, or author fresh content. This was the user's explicit choice during planning.
- **Vec virtual-table orphans (voyage)**: As with 053, the bare sqlite3 CLI can't touch the vec0 virtual table; orphan vec embeddings would be tolerable but in this case `vec_memories_rowids` had zero entries for the purged IDs (no orphans created).
- **Single-line JSON formatting in skill-graph.json**: Diffs against history will look noisy because the entire payload is one line; this matches the upstream convention from packet 053.
- **Backup files left in place**: `.bak-055` snapshots of the three edited SQLite databases remain at `mcp_server/database/*.sqlite.bak-055`. Can be deleted after verification confirms stability.
- **Runtime advisor cache**: The skill registry banner shown to AI runtimes is cached from session start; the updated SKILL.md descriptions take effect on the next session restart.
<!-- /ANCHOR:limitations -->
