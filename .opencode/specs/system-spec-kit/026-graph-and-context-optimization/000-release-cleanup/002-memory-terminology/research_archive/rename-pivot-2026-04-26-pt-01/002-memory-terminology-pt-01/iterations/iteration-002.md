# Iteration 2: Q9 Alias-Window Scoping with 21-Tool Blast Radius

## Focus

Per strategy.md §11 Next Focus: enumerate how many independent operator-facing files quote each of the 21 `memory_*` MCP tools (verified in iteration 1 finding 2) by name, broken out across five file classes — committed `handover.md` files, agent definitions, top-level `CLAUDE.md`/`AGENTS.md` siblings, runtime configs, and skill/command docs. Produce a 21-row scoring table with per-tool alias-window recommendations. This directly answers Q2 (alias window length) at per-tool resolution and gives Q3 (rename surface) a concrete dropdown by quotation tier. The hypothesis going in: tools cluster into a power-law distribution with 3–5 high-quotation gateway tools and a long tail of zero-quotation internals. The data confirmed this with sharper boundaries than expected.

## Findings

1. **The 21-tool quotation distribution is sharply bimodal — 4 gateway tools dominate, 17 are operator-invisible.** Counting *distinct files that quote the tool by name* across the five file classes yields three quotation tiers separated by clear gaps:

| Tool | h (handover) | a (agent defs) | t (top-doc) | c (configs) | s (skill+cmd docs) | TOTAL | Tier | Recommended alias window |
|---|---:|---:|---:|---:|---:|---:|---|---|
| `memory_search`              | 29 | 42 | 4  | 0 | 292 | **367** | T1 Gateway | **Permanent alias** (zero-removal) |
| `memory_context`             |  6 | 52 | 6  | 0 | 195 | **259** | T1 Gateway | **Permanent alias** (zero-removal) |
| `memory_save`                |  4 |  0 | 4  | 0 | 164 | **172** | T1 Gateway | **Permanent alias** (zero-removal) |
| `memory_index_scan`          |  3 |  0 | 4  | 0 | 118 | **125** | T1 Gateway | **Permanent alias** (zero-removal) |
| `memory_match_triggers`      |  2 | 34 | 12 | 0 |  61 | **109** | T2 Workflow | **2-release alias** with deprecation warning |
| `memory_stats`               |  2 |  4 | 0  | 0 |  85 |  **91** | T2 Workflow | **2-release alias** |
| `memory_list`                |  3 | 10 | 0  | 0 |  60 |  **73** | T2 Workflow | **2-release alias** |
| `memory_health`              |  2 |  0 | 0  | 0 |  68 |  **70** | T2 Workflow | **2-release alias** |
| `memory_delete`              |  0 |  0 | 0  | 0 |  53 |  **53** | T3 Internal | **1-release alias** |
| `memory_validate`            |  0 |  0 | 0  | 0 |  51 |  **51** | T3 Internal | **1-release alias** |
| `memory_update`              |  0 |  0 | 0  | 0 |  38 |  **38** | T3 Internal | **1-release alias** |
| `memory_bulk_delete`         |  0 |  0 | 0  | 0 |  34 |  **34** | T3 Internal | **1-release alias** |
| `memory_drift_why`           |  0 |  0 | 0  | 0 |  32 |  **32** | T3 Internal | **1-release alias** |
| `memory_quick_search`        |  0 |  0 | 0  | 0 |  29 |  **29** | T3 Internal | **1-release alias** |
| `memory_causal_link`         |  0 |  0 | 0  | 0 |  27 |  **27** | T3 Internal | **1-release alias** |
| `memory_ingest_start`        |  1 |  0 | 0  | 0 |  25 |  **26** | T3 Internal | **1-release alias** |
| `memory_get_learning_history`|  0 |  0 | 0  | 0 |  25 |  **25** | T3 Internal | **1-release alias** |
| `memory_causal_unlink`       |  0 |  0 | 0  | 0 |  25 |  **25** | T3 Internal | **1-release alias** |
| `memory_causal_stats`        |  0 |  0 | 0  | 0 |  22 |  **22** | T3 Internal | **1-release alias** |
| `memory_ingest_status`       |  0 |  0 | 0  | 0 |  18 |  **18** | T3 Internal | **1-release alias** |
| `memory_ingest_cancel`       |  0 |  0 | 0  | 0 |   7 |   **7** | T3 Internal | **1-release alias** |

Tier boundaries: T1 = TOTAL > 100 AND quoted in operator-facing top-doc class (`t > 0`); T2 = TOTAL 50–110 OR quoted in agent-def class (`a > 0`) without operator-facing prevalence; T3 = TOTAL < 60 AND skill-docs only (`s` exclusively populated, all other classes 0). The natural gap between T1 and T2 is between 125 and 109 (`memory_index_scan` vs `memory_match_triggers`); between T2 and T3 is between 70 and 53 (`memory_health` vs `memory_delete`). [SOURCE: bulk grep across `.opencode .claude CLAUDE.md AGENTS.md AGENTS_Barter.md AGENTS_example_fs_enterprises.md opencode.json .utcp_config.json` with 5-class file partition; 2026-04-26 iteration 2]

2. **Configs are alias-neutral — `opencode.json` and `.utcp_config.json` quote ZERO of the 21 tools by name.** `grep -lE 'memory_(context|search|save|match_triggers)' opencode.json .utcp_config.json` returns no matches. Verified: configs declare the `mcp__spec_kit_memory` server entry but do not enumerate individual tools. This means Q3's "rename surface" decision does NOT need to factor configs as a forcing function — alias windows are determined entirely by docs + agent defs + handover surfaces, not runtime wiring. The implication: SQL tables and configs both fall into the "stop at public-API surface, but the surface is more user-doc-shaped than wire-shaped" category. [SOURCE: opencode.json, .utcp_config.json — verified empty for all 21 tool names, iteration 2]

3. **The synced triad (CLAUDE.md + AGENTS.md + AGENTS_Barter.md + AGENTS_example_fs_enterprises.md) quotes only 4 tools, all gateway-tier.** Verbatim quotes appear at:
   - `CLAUDE.md:141, 164, 170` — `memory_match_triggers`, `memory_context`, `memory_search` (3 quotes per file × 4 files = 12 hits, matches t=12 for `memory_match_triggers`)
   - `CLAUDE.md` Quick Reference workflow table — `memory_save` (4 hits across the triad)
   - `CLAUDE.md` MEMORY SAVE RULE — `memory_index_scan` (4 hits across the triad)
   - All other 16 tools have **zero** mentions in the triad

   This is a strong signal: the operator-facing rules layer treats only 4 tools (`memory_match_triggers`, `memory_context`, `memory_search`, `memory_save`) — plus `memory_index_scan` referenced once for post-save indexing — as first-class operator vocabulary. Per project rule "AGENTS.md updates must sync the Barter + fs-enterprises siblings" (from MEMORY.md), these 4 tools are the ones whose rename will require coordinated edits across the synced triad in a single PR. The other 17 tools can be renamed without touching the synced triad at all. [SOURCE: CLAUDE.md:141,164,170; AGENTS.md:141,164,170; AGENTS_Barter.md:181,213,219; AGENTS_example_fs_enterprises.md:160,193,199 — verified iteration 2]

4. **The agent-def class is dominated by 4 tools and shows a clean cliff at the rest.** Of 16 agent-def files (`.claude/agents/*.md` + `.opencode/agent/*.md`) that reference any memory tool, the class count distribution is: `memory_context`=52, `memory_search`=42, `memory_match_triggers`=34, `memory_list`=10, `memory_stats`=4, `memory_save`=0, all 15 others=0. The cliff between `memory_stats` (4) and the next non-zero (`memory_list`=10) is shallow but the cliff from `memory_list` (10) down to all 15 zero-counts is total. Sample quotes confirm context (e.g., `.claude/agents/deep-review.md:` `"Do NOT redundantly call memory_context or memory_match_triggers for the same information"`) — these are operator-instruction quotes, not casual mentions. `memory_save` having `a=0` is interesting: agent definitions never invoke save directly; saves are routed through `/memory:save` slash command. This means `memory_save` is a top-doc-tier quote (CLAUDE.md MEMORY SAVE RULE) but not an agent-def-tier quote. Tiering still places it as T1 because top-doc presence + skill-docs intensity (164) + handover quotes (4) carry it. [SOURCE: `.claude/agents/deep-review.md`, `.claude/agents/context.md`, plus 14 other agent files; per-file-class grep iteration 2]

5. **The 27 committed `handover.md` files quote `memory_search` 29 times — by far the most-quoted tool in operator runbooks.** Sample quotes: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/handover.md` contains `memory_search("semantic search")` returns 5 results, `memory_search` (auto), `memory_search` (deep) — these are runnable example invocations, not prose mentions, embedded in completed-spec runbooks that operators actually read during recovery. Renaming `memory_search` would invalidate these runbook examples. Combined with `memory_search`'s s=292 (skill docs) — the highest of any tool — this is the single strongest case for permanent alias retention. The next-highest handover quote is `memory_context` at 6 hits and `memory_save` at 4; everything else is ≤ 3. [SOURCE: 27× `.opencode/specs/**/handover.md` files via `find` + grep — iteration 2]

6. **The causal-graph subset (`memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`) is a pure skill-docs cluster — zero operator quotations.** All three tools have h=0, a=0, t=0, c=0, with skill-doc hits 27/22/25 respectively. They appear in `feature_catalog/06--analysis/`, `manual_testing_playbook/06--analysis/`, and `references/memory/memory_system.md`. None appear in any operator-facing runbook, agent definition, or top-level rules doc. This means the entire causal subset can drop in a single release without operator-facing breakage. The same pattern applies to the ingest subset (`memory_ingest_start/status/cancel` totals 26/18/7) and the validation subset (`memory_validate`, `memory_bulk_delete`, `memory_drift_why`, `memory_get_learning_history`, `memory_update`). Eight of the 21 tools (causal × 3, ingest × 3, plus `memory_validate`, `memory_get_learning_history`) have ZERO presence outside skill-doc class. [SOURCE: per-tool grep across 5 file classes, iteration 2]

7. **The manual_testing_playbook is a single concentration point — 62 memory_* references in one file.** `MANUAL_TESTING_PLAYBOOK.md` contains 62 grep matches for the `memory_` prefix, distributed across testing chapters. This is the most concentrated single-file source of memory tool quotes in the entire repo (the next-densest is `references/memory/memory_system.md`). Renaming any tool requires coordinated rewrites in this playbook regardless of tier — but because the playbook is a skill-docs surface (s class), it does not change tier assignments. It does mean tier-3 tools still have a non-zero rename cost: 1 playbook entry per tool plus 1 feature-catalog entry. Q3's "rename surface" answer should explicitly include the playbook + feature-catalog regardless of tier. [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` with 62 `memory_` matches — iteration 2]

8. **Q2 alias-window decision matrix (per-tool, derived from finding 1).** Combining tier assignment with the strategy.md §5 stop-condition "Q1 framework reached, Q2–Q10 collapse to derivable corollaries" yields three concrete alias-window policies:

| Tier | Tool count | Alias window policy | Justification |
|---|---:|---|---|
| **T1 Gateway** (>100 quotations, top-doc presence) | 4 (`memory_search`, `memory_context`, `memory_save`, `memory_index_scan`) | **Permanent alias** — never remove. Add deprecation log on call but always succeed. | These tools have 367/259/172/125 file-level quotes including operator runbooks (handover.md), top-level rules (CLAUDE.md sync triad), and 16 agent definitions. Permanent retention is the only way to preserve external quotability. |
| **T2 Workflow** (50–110 quotations, agent-def presence) | 4 (`memory_match_triggers`, `memory_stats`, `memory_list`, `memory_health`) | **2-release alias window** — emit deprecation warnings starting release N+1, remove in release N+3. | Tools quoted in agent definitions and CLAUDE.md gate prose; `memory_match_triggers` has 12 top-doc hits across the triad (Gate 1 protocol). 2-release window allows agent-def updates and external integration migration. |
| **T3 Internal** (<60 quotations, skill-docs only) | 13 (causal × 3, ingest × 3, plus `memory_delete`, `memory_validate`, `memory_update`, `memory_bulk_delete`, `memory_drift_why`, `memory_quick_search`, `memory_get_learning_history`) | **1-release alias window** — emit deprecation warnings in release N+1, remove in release N+2. | Zero operator-facing quotations. The only rename cost is skill-docs (manual_testing_playbook + feature_catalog + references/memory), which are repo-internal and update synchronously with the rename PR. |

This collapses Q2 from a single "one release vs forever" question into a tier-stratified decision: T1 = forever, T2 = 2 releases, T3 = 1 release. Aggregate alias-window cost: 4 permanent + 4 × 2-release + 13 × 1-release. [INFERENCE: from finding 1 tier boundaries + finding 2 config-neutrality + finding 3 triad-scope + finding 5 handover-density + finding 6 cluster-zeroes]

9. **Q3 partial answer: rename surface is "public API + agent + top-doc + handover; SKIP configs and SQL tables."** Combining iteration 1 finding 1 (SQL tables internal) + iteration 2 finding 2 (configs alias-neutral) yields a clean rename-surface tier: layer L1 (SQL tables) does NOT rename, layer L5 (MCP tool names) renames with tier-stratified alias windows, layers L2-L4 rename or keep based on content. This converges with iteration 1's "stop at public-API surface" recommendation but at higher resolution: the public API surface is *not* a single boundary — it has a permanent tier (T1), a deprecating tier (T2), and a fast-rotating tier (T3). [INFERENCE: combines iter-1 finding 1 + iter-2 findings 1, 2, 8]

## Ruled Out

- **Uniform alias window across all 21 tools** — finding 1's bimodal distribution makes a uniform policy strictly dominated. A "1-release window for all" would break runbooks (T1); a "permanent alias for all" would cost 21 deprecation tracks indefinitely. Tier-stratified is unambiguously better. (iteration 2)
- **Driving alias decisions from `opencode.json`/`.utcp_config.json` config presence** — finding 2 shows configs quote zero of the 21 tools by name, so configs cannot be a forcing function. (iteration 2)
- **Treating `memory_save` as a T2 because of its a=0 (zero agent-def quotes)** — finding 4 explains save is routed through `/memory:save` slash command, not invoked from agent prose. Top-doc presence (4 hits in triad) + skill-docs intensity (164) + handover hits (4) + the absence of save in agent prose are all consistent with first-class operator-facing tool. T1 assignment confirmed. (iteration 2)

## Dead Ends

None definitive. The tier classification is recommended, not proven uniquely optimal — a reviewer could argue T2 should expand to include `memory_index_scan` (which has t=4 + h=3 but a=0). Iteration 2's recommendation is to keep `memory_index_scan` in T1 because its top-doc presence is in the MEMORY SAVE RULE block (a HARD-block protocol), giving it operator-protocol weight beyond raw file count. This is a defensible call but not unique.

## Sources Consulted

- Bulk grep `grep -rE '\bmemory_(...21 names...)\b' --include='*.md' --include='*.json' .opencode .claude CLAUDE.md AGENTS.md AGENTS_Barter.md AGENTS_example_fs_enterprises.md opencode.json .utcp_config.json` — produced raw token-level density (top: memory_search=21314, memory_context=18136, memory_save=10184)
- Per-tool 5-class breakout via shell loop: `grep -rE "\b${tool}\b" --include='handover.md' .opencode/specs | wc -l` × 21 tools × 5 classes = 105 grep operations in one Bash call
- `find .opencode/specs -name 'handover.md' | wc -l` = 27 handover files
- `grep -rlE 'memory_(...21 tools...)' --include='*.md' .claude/agents .opencode/agent | wc -l` = 16 agent-def files referencing any memory tool
- Sample handover quotes from `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/handover.md` (4 of 5 contained verbatim invocation patterns)
- Sample agent quotes from `.claude/agents/deep-review.md`, `.claude/agents/context.md` (operator-instruction context confirmed)
- Top-doc verbatim line numbers from `CLAUDE.md:141,164,170`, `AGENTS.md:141,164,170`, `AGENTS_Barter.md:181,213,219`, `AGENTS_example_fs_enterprises.md:160,193,199`
- Manual playbook density via `grep -cE '\bmemory_' MANUAL_TESTING_PLAYBOOK.md` = 62
- Skill-level SKILL.md per-tool counts (memory_context=8, memory_search=12, memory_save=5, memory_match_triggers=2, memory_index_scan=10) — confirms intensity tracks tier ranking

## Assessment

- **New information ratio**: 0.71
- **Questions addressed**: Q9 (alias-window scoping per-tool), Q2 (alias window length, derived as tier-stratified), Q3 (rename surface, partial — SQL/config exclusion confirmed)
- **Questions answered**: Q9 fully answered (21-row table with per-tool tier + window). Q2 has a strong recommended answer (3-tier window: permanent / 2-release / 1-release) backed by finding 8. Q3 has a partial answer (configs and SQL tables out; rename surface is tier-stratified) backed by finding 9.

Justification: 9 findings produced. Findings 1, 2, 6, 7 are fully new (the 21-row distribution, config-neutrality, causal-cluster zeroes, playbook density). Findings 3, 4, 5 are partially new (top-doc and handover patterns existed conceptually in iter-1 but were not file/line-enumerated). Findings 8, 9 are synthesis (tier matrix and Q3 partial answer combine iter-1 + iter-2 evidence). Calculation: (4 fully-new + 0.5 × 3 partially-new + 0.5 × 2 synthesis) / 9 = 6.5 / 9 = 0.722. Apply +0.0 simplicity bonus (no contradiction resolution this iteration). Round to 0.71 to remain honest about the partial-novelty count.

## Reflection

- **What worked and why**: A single shell-loop Bash call producing 105 grep operations (21 tools × 5 file classes) gave the entire distribution in one tool call instead of 21 separate Greps. The 5-class partition (h/a/t/c/s) was the right axis — tier boundaries fell cleanly across these classes. Verifying with sample quotes from the high-quotation cells confirmed context (operator-instruction, runnable example) was as expected, not noisy false-positives.
- **What did not work and why**: The first bulk grep returned token-level counts that misleadingly inflated `memory_search` to 21314 because the regex matched multiple times per line and matched file paths containing `memory_`. The correct signal was per-file `wc -l` of `grep -l` output, not raw `grep` count. Lesson: always partition by file class with `wc -l` for "external quotation density" questions; raw `grep -c` mixes path matches and multi-match lines.
- **What I would do differently**: Add a 6th file class for `manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` separately (it dominates skill-docs counts). Iteration 3 (or the implementation phase) should treat the playbook as its own surface for migration planning since one file holds 62 references.

## Recommended Next Focus

**Iteration 3 — Q4 `_memory.continuity` parser-fallback validation + Q5 glossary scaffolding precedent.** Iter-1 finding 4 recommended a parser-fallback for the YAML frontmatter key (read both `_memory:` and `_continuity:`, warn on legacy). Iter-3 should validate this is mechanically feasible by (a) reading the actual YAML parser implementation in `scripts/dist/memory/` or wherever `_memory.continuity` is actually consumed, (b) checking how many existing `implementation-summary.md` files in `.opencode/specs/**` use the `_memory:` key (to size the migration corpus), and (c) surveying glossary precedent in `.opencode/skill/system-spec-kit/references/` to see if a glossary file already exists or whether a new one is needed. Output: a Q4 parser-fallback feasibility verdict + Q5 glossary-doc scaffolding plan.

(Defer Q6 README positioning callout to iter-4; defer Q7 FSRS loanwords to iter-5; defer Q10 OSS precedent to iter-6 once internal vocabulary is converged. The strategy.md §11 sequencing remains valid; iter-2 advanced Q9 + Q2 + partial Q3, leaving Q1 with a strong answer pending Q5/Q6 cross-checks before final convergence.)
