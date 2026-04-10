# README Release Alignment Map

This phase document maps the README-style entrypoints across the repo that are the most plausible post-026 update targets.

It replaces the earlier broad audit with a curated release-alignment view focused on live README surfaces, current-reality wording, and commit-backed drift risk.

## Scope and Method

- Analysis window: 2026-04-01 through 2026-04-10.
- Evidence base:
  - Git history for repo README surfaces and README-like entrypoints (`README.md`, `README.txt`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`).
  - Live README-style files under `.opencode/`, `.opencode/skill/system-spec-kit/`, and related repo entrypoints.
  - 026 packet commit history to identify where release behavior changed.
- Included:
  - Root repo README entrypoints.
  - Command group README indexes.
  - Core `system-spec-kit` README surfaces.
  - MCP server README surfaces closely tied to 026.
  - Adjacent README surfaces that explain graph/code-search integration.
- Excluded:
  - Non-README command docs and agent docs.
  - Cache/generated/vendor files.
  - Most packet-local README files unless they were directly touched as part of 026 release behavior.

## 026 README-Relevant Work Summary

| Workstream | Evidence | Why it matters for READMEs |
| --- | --- | --- |
| Code-graph and runtime documentation alignment | `eeb283f` `docs(spec-kit): Code Graph documentation alignment` | README surfaces describing MCP tools, graph behavior, and routing can easily drift. |
| Compact save contract and memory-quality fixes | `7f0c057` `feat(026-memory-redundancy)`, `eb1f49c`, `03d26e2` | README wording around memory save, indexing, and quality-review behavior may now be stale. |
| Graph-first routing and runtime upgrades | `33823d0` `feat(026-graph-context)`, `2837e15` `feat(026-014)` | Search, graph, session-start, and recovery descriptions should match the shipped runtime. |
| Context-prime cleanup | `c01db61` `fix(026)` and `a2522ec` `docs: remove remaining context-prime references from 5 README files` | README entrypoints should consistently reflect the current context/recovery model. |
| Global release/readme refresh waves | `25b6af3` `feat(spec-kit): v3.3.0.0` and `da60644` `feat(spec-kit): v3.2.0.0` | Several top-level READMEs were already touched in adjacent release trains and remain likely drift surfaces. |

## Priority Legend

- `HIGH`: public entrypoint or authoritative README likely to mislead operators if stale.
- `MEDIUM`: supporting README that should be checked when nearby `HIGH` docs are updated.
- `LOW`: packet-local or historical README not worth release-alignment churn unless explicitly requested.

## Priority Review Map

### 1. Root Repo Entry Points

- `HIGH` `README.md`
  Why: primary top-level repo entrypoint; already part of the context-prime cleanup and release wording surface.
- `HIGH` `.opencode/README.md`
  Why: the main OpenCode operator README; contains command catalogs, MCP overview, and feature/system summaries that overlap heavily with 026.
- `MEDIUM` `.opencode/install_guides/README.md`
  Why: onboarding flow lists available commands and first-step usage; counts and command families can drift.
- `MEDIUM` `.opencode/skill/README.md`
  Why: skill-index overview should remain consistent with current system-spec-kit positioning and repo structure.

### 2. Command Group README Indexes

- `HIGH` `.opencode/command/spec_kit/README.txt`
  Why: canonical README-style index for the 8-command `spec_kit` family.
- `HIGH` `.opencode/command/memory/README.txt`
  Why: canonical README-style index for the 4-command `memory` family.
- `MEDIUM` `.opencode/command/README.txt`
  Why: global command directory overview can drift when subcommand families evolve.
- `LOW` `.opencode/command/create/README.txt`
  Why: not central to 026, but adjacent if repo-wide command catalogs are refreshed.
- `LOW` `.opencode/command/improve/README.txt`
  Why: not central to 026, but touched in the same context-prime cleanup wave.

### 3. Core System-Spec-Kit README Surfaces

- `HIGH` `.opencode/skill/system-spec-kit/README.md`
  Why: top-level skill overview; directly adjacent to graph/context, save-contract, and command-surface changes.
- `HIGH` `.opencode/skill/system-spec-kit/mcp_server/README.md`
  Why: canonical runtime README for the memory MCP server; highly exposed to graph/search/bootstrap drift.
- `HIGH` `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
  Why: installation guide needs to match the current runtime setup and capability set.
- `HIGH` `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
  Why: environment reference is part README, part contract surface for runtime toggles affected by 026.
- `MEDIUM` `.opencode/skill/system-spec-kit/constitutional/README.md`
  Why: constitutional index may need parity if routing/guardrail narratives changed.
- `MEDIUM` `.opencode/skill/system-spec-kit/templates/README.md`
  Why: template architecture overview should stay aligned with the current release reality.

### 4. MCP Server Subsystem READMEs

- `HIGH` `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
  Why: directly implicated by graph-first routing, FTS remediation, and search behavior changes.
- `HIGH` `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md`
  Why: directly adjacent to code-graph upgrades and graph-query/readiness behavior.
- `MEDIUM` `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md`
  Why: result contracts and subsystem interfaces can drift when search/runtime behavior changes.
- `MEDIUM` `.opencode/skill/system-spec-kit/mcp_server/database/README.md`
  Why: data layout and storage explanations should stay aligned if graph storage/query changed.
- `MEDIUM` `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md`
  Why: extraction docs were touched in adjacent runtime/search work and deserve a parity check.

### 5. Supporting Script and Template READMEs

- `MEDIUM` `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md`
  Why: packet creation and alignment workflows touched description discovery and release closeout behavior.
- `MEDIUM` `.opencode/skill/system-spec-kit/scripts/memory/README.md`
  Why: save/index/review behavior changed in the 026 memory-quality lanes.
- `MEDIUM` `.opencode/skill/system-spec-kit/scripts/spec/README.md`
  Why: spec lifecycle and validation docs are adjacent to strict release-alignment workflows.
- `MEDIUM` `.opencode/skill/system-spec-kit/scripts/templates/README.md`
  Why: template composition docs may need parity if command-driven packet generation wording changed.
- `LOW` `.opencode/skill/system-spec-kit/templates/level_3/README.md`
  Why: touched in adjacent doc-alignment history but less central than the root template README.

### 6. Adjacent Integration READMEs

- `MEDIUM` `.opencode/skill/mcp-coco-index/README.md`
  Why: graph-first routing and CocoIndex interplay make this a reasonable follow-up review surface.

### 7. Direct 026 Packet README Surfaces

These are packet-local README files touched during 026. They are not global entrypoints, but they are valid release-alignment targets if the task expands from repo entrypoints into packet README parity.

- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/README.md`
- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/002-single-owner-metadata/README.md`
- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/README.md`
- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/README.md`
- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/README.md`
- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/README.md`
- `MEDIUM` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/007-skill-catalog-sync/README.md`
- `LOW` `.opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/README.md`
  Why: adjacent to 026 memory-save release wording, but not a primary 026 entrypoint.

## Suggested Review Order

1. `.opencode/README.md`
2. `.opencode/skill/system-spec-kit/README.md`
3. `.opencode/skill/system-spec-kit/mcp_server/README.md`
4. `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
5. `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
6. `.opencode/command/spec_kit/README.txt`
7. `.opencode/command/memory/README.txt`
8. `README.md`
9. `.opencode/install_guides/README.md`
10. subsystem READMEs under `mcp_server/lib/`

## Release-Alignment Notes

- The previous version of this phase file mixed README targets with non-README docs and line-level guesses.
- This curated version intentionally narrows the phase to:
  - current live README entrypoints,
  - high-traffic operator docs,
  - commit-backed drift surfaces from the 026 train.
- If a later pass asks for actual README rewrites, the `HIGH` paths above are the intended first-pass scope.

## Canonical Outcome

This file is now the canonical release-alignment README map for `016-release-alignment/003-readme-alignment`.
