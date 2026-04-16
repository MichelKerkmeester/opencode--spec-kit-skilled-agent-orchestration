# Iteration 1: marketplace discovery and versioning

## Focus
This iteration examined Claudest's marketplace structure before any plugin internals. The goal was to trace how discovery works from the root marketplace manifest into per-plugin manifests, then separate source-proven versioning facts from README-only auto-update claims.

## Findings
- `external/.claude-plugin/marketplace.json` is the discovery root: it defines marketplace identity (`name`, `description`, `owner`) plus a `plugins` array whose entries carry `name`, `description`, `version`, and relative `source` paths such as `./plugins/claude-memory`; `external/plugins/` contains the same eight plugin folders named in that catalog, so discovery is registry-first rather than filesystem-autodiscovery. For `Code_Environment/Public`, a comparable layer would mean adding one explicit marketplace or catalog manifest above `.opencode/skill/` or any future plugin surface so tools can enumerate curated packages without hard-coded folder scans; this is source-proven from the JSON and directory inventory, while `external/README.md` only demonstrates install commands against that catalog. (prototype later)
- `external/plugins/claude-memory/.claude-plugin/plugin.json` and `external/plugins/claude-skills/.claude-plugin/plugin.json` show that per-plugin manifests are intentionally thin package descriptors: each carries plugin identity and metadata (`name`, `version`, `description`, `author`, `keywords`) but no install graph, update policy, or marketplace membership rules. That means the flow is root marketplace for discovery plus plugin-local manifest for package identity, which would map cleanly to `Code_Environment/Public` if we ever expose distributable bundles: keep local manifests minimal and let a single top-level catalog decide what is installable. This is source-proven from the manifest files themselves, not from README language. (adopt now)
- `external/.claude-plugin/marketplace.json`, `external/plugins/claude-memory/.claude-plugin/plugin.json`, and the manifest sweep across `external/plugins/*/.claude-plugin/plugin.json` show version parity in this checkout: marketplace versions match the local plugin manifest versions for all eight listed plugins, including `claude-memory` `0.8.56`, `claude-skills` `0.5.15`, `claude-coding` `0.2.18`, and the rest of the catalog. For `Code_Environment/Public`, the practical lesson is not the specific versions but the need for a validation rule if a catalog plus per-package manifests are introduced, because duplicated version fields are only safe when continuously cross-checked. This is source-proven from JSON files, not README copy. (adopt now)
- `external/README.md` documents the user-facing installation and update flow with `/plugin marketplace add gupsammy/claudest`, `/plugin install <plugin>@claudest`, and a Marketplaces-tab toggle for auto-update, but neither `external/.claude-plugin/marketplace.json` nor the inspected per-plugin `plugin.json` files contain any auto-update flag, channel, cadence, or policy. So the repository metadata supports discovery and version declaration, while auto-update appears to be owned by the Claude `/plugin` runtime outside this repo. For `Code_Environment/Public`, that means a marketplace manifest could be borrowed, but the auto-update behavior should not be copied as if it were repo-native unless Public also builds an installer/runtime layer that owns update semantics. This is source-proven for the absence of update metadata in JSON, with the positive update behavior only README-level. (reject)

## Ruled Out
- Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls.

## Dead Ends
- The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`.

## Sources Consulted
- external/.claude-plugin/marketplace.json
- external/plugins/claude-memory/.claude-plugin/plugin.json
- external/plugins/claude-skills/.claude-plugin/plugin.json
- external/README.md
- external/plugins/

## Reflection
- What worked and why: Reading the root marketplace first made the rest of the evidence easy to interpret because it established the catalog schema and exact plugin set before comparing local manifests.
- What did not work and why: The prompt's example plugin path for `get-token-insights` did not exist in this checkout, so it could not serve as the comparison manifest.
- What I would do differently: I would jump straight from the marketplace catalog into `claude-memory` internals next, because the discovery and versioning layer is already structurally clear after one pass.

## Recommended Next Focus
Iteration 2 should move into `claude-memory` storage and retrieval internals, specifically Q2 and Q4. The strongest next step is to inspect the SQLite schema and recall pipeline in `skills/recall-conversations/scripts/memory_lib/db.py`, `scripts/search_conversations.py`, and `scripts/recent_chats.py` so we can judge whether branch-level aggregation plus BM25/FTS5 are portable to `Code_Environment/Public`.

## JSONL RECORD TO APPEND (exactly one line)
{"type":"iteration","run":1,"status":"insight","focus":"marketplace discovery + versioning","findingsCount":4,"newInfoRatio":0.95,"answeredQuestions":["Q1: How does Claudest's plugin discovery model actually work from `external/.claude-plugin/marketplace.json` through per-plugin `external/plugins/*/.claude-plugin/plugin.json`, and what would a comparable marketplace layer mean for `Code_Environment/Public`?","Q9: How do plugin versioning and auto-update work in practice, including root marketplace manifests, per-plugin manifests, and the `/plugin` marketplace auto-update flow? Preserve any version discrepancies between root and plugin-local manifests."],"sourcesQueried":["external/.claude-plugin/marketplace.json","external/plugins/claude-memory/.claude-plugin/plugin.json"],"focusTrack":"marketplace","convergenceSignals":{"compositeStop":0.10},"timestamp":"PENDING_APPEND_TIMESTAMP","iterationAgent":"cli-codex:gpt-5.4:high"}
