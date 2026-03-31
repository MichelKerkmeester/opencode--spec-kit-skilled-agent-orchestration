---
title: "Session Capturing Pipeline Quality"
description: "Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the shipped JSON-primary save path for `generate-context.js`, continued positional JSON file support on the same structured path, and the associated quality gates, sufficiency enforcement, and template-contract validation."
---

# Session Capturing Pipeline Quality

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. FEATURE BREAKDOWN](#3--feature-breakdown)
- [4. SOURCE FILES](#4--source-files)
- [5. VERIFICATION SOURCES](#5--verification-sources)
- [6. MANUAL COVERAGE MAP](#6--manual-coverage-map)
- [7. SOURCE METADATA](#7--source-metadata)

## 1. OVERVIEW

Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`:

1. Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits.
2. Spec-folder and git context enrichment for JSON-mode saves.
3. Numeric quality-score calibration so thin saves score lower than rich ones.
4. One shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing.
5. Phase 017-018 runtime-contract hardening plus Phase 019 reality-alignment follow-through, including metadata-driven write/index dispositions, `--stdin` / `--json` structured input, and typed source capabilities for contamination policy.
6. Phase 018 output-quality hardening, including decision-field deduplication, completion-status recovery, blocker tightening, trigger cleanup, separator parsing, tree-thinning safeguards, and structured-data conversation synthesis.
7. One shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index, while successful flows stay free of template-data warning noise.
8. A refreshed canonical verification, remediation, and manual-testing record that separates automated parity from retained live CLI proof.

---

## 2. CURRENT REALITY

The shipped session-capture pipeline enforces the following behavior:

1. `session-extractor.ts` uses crypto-backed session IDs and prefers live observations over synthetic enrichment when deriving project-state snapshots.
2. `file-writer.ts` uses random temp-file suffixes and rolls back partial batch writes.
3. `workflow.ts` keeps alignment enforcement, insufficiency blocking, low-quality abort behavior, and an explicit write/index disposition contract in place for every save.
4. `spec-folder-extractor.ts` and `git-context-extractor.ts` provide relevance-aware spec-folder and git context enrichment.
5. `quality-scorer.ts` penalizes generic file descriptions, generic summaries, and repetitive observation titles more aggressively without changing boolean `qualityValidation`.
6. `data-loader.ts` routes all saves through the structured JSON path; native transcript capture is not invoked.
7. The active workspace identity is the nearest repo-local `.opencode` directory.
8. Workspace-scoped file hints are normalized during enrichment into downstream `FILES` and observation content.
9. JSON saves that stay aligned but preserve too little durable evidence now fail with `INSUFFICIENT_CONTEXT_ABORT`.
17. The sufficiency contract requires:
   - a specific title
   - at least one primary evidence item
   - at least two total evidence items
   - enough semantic substance to stand alone later
18. `generate-context.js` diagnostic scores now reflect insufficiency explicitly instead of letting thin memories look healthy.
19. Rendered memory files preserve `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` comments through post-render cleanup while still stripping non-anchor workflow comments.
20. Frontmatter `trigger_phrases` now render the same session-specific values as the trailing metadata block and fall back to `[]` instead of generic placeholders.
21. Explicit JSON mode accepts the documented snake_case save contract as well as the existing camelCase fields.
22. Structured JSON mode accepts both `generate-context.js --stdin` and `generate-context.js --json <string>` as the preferred AI-composed save paths.
22a. Positional JSON file input remains supported and routes through the same structured loader path.
24. The structured JSON contract explicitly preserves summary fields such as `toolCalls` and `exchanges`, while older payloads that omit them remain backward compatible.
25. File-backed JSON remains on the authoritative structured path and does not reopen the abandoned runtime-derived enrichment branch.
25a. Decision confidence and truncated outcome handling respect explicit input values; template assembly preserves explicit session-level message and tool counts when conversation arrays are sparse.
25b. `git_changed_file_count` follows a stable 3-tier priority chain: explicit count > enrichment-derived count > provenance-based count.
26. In structured-input modes, an explicit CLI target still outranks payload `specFolder`, and the payload target is used only when no explicit override is present.
27. `validate-memory-quality.ts` now owns a first-class rule metadata registry with per-rule severity, write blocking, index blocking, source applicability, and rationale.
28. The workflow now resolves every save into one explicit disposition:
   - `abort_write`
   - `write_skip_index`
   - `write_and_index`
29. V1, V3, V8, V9, and V11 remain hard blockers; V4, V5, V6, V7, and V10 remain soft diagnostics that can still write and index when the upstream template, sufficiency, and score gates pass.
30. V2 now remains writeable but intentionally skips semantic indexing, which makes the write-only path explicit instead of coupling it to the old `qualityValidation.valid` boolean.
31. Contamination severity policy now uses typed source capabilities instead of a raw source-name exception; only capability profiles that expect transcript-style tool titles get the `tool title with path` downgrade.
32. Phase 018 output-quality fixes now keep rendered decisions non-duplicative, recover completed status from normalized `Next Steps` observations, avoid blocker false positives from generic words, suppress generic trigger/code-pattern filler, parse `key_files` separators beyond plain hyphens, keep tree thinning from over-merging, and synthesize richer conversations from structured JSON when prompts are sparse.
33. Literal Mustache tokens and literal anchor examples from captured operator text are treated as content, not structural leakage.
34. Rendered output is now validated against a shared template contract before successful write/index:
   - required frontmatter keys must exist
   - mandatory section anchors and HTML ids must exist
   - raw Mustache leakage is rejected
   - duplicate top-of-body separators are rejected
35. Historical active-memory remediation now uses that same template contract and moves non-repairable files out of active `memory/` use.
36. The H1 body heading (`# title`) is derived from the content slug via `slugToTitle(contentSlug)`, which is the same slug used for the filename, instead of `pickBestContentName()`. A blank line separates the frontmatter close `---` from the H1 to satisfy the `missing_blank_line_after_frontmatter` contract rule.
37. API error content is blocked at 5 pipeline layers:
   - `claude-code-capture.ts` skips events with `isApiErrorMessage: true`
   - `input-normalizer.ts` treats API error strings as placeholder responses
   - `contamination-filter.ts` detects error prefixes, JSON error payloads, and request ID leaks (high severity)
   - `collect-session-data.ts` guards SUMMARY derivation against error text in the `learning` field
   - `validate-memory-quality.ts` V11 rule rejects memories with error-dominated descriptions, titles, or trigger phrases

Status: Implemented and strongly verified for the shared runtime contract. The automated scripts lane covers rule metadata, capability-driven contamination handling, structured-input parity, V10 write-and-index behavior, write-only indexing policy, same-minute filename stability, renderer-noise suppression, and the currently supported legacy JS compatibility suites.

---

## 3. FEATURE BREAKDOWN

The closure feature consists of these distinct shipped capabilities:

### 3.1 JSON-mode authority

- `--stdin` and `--json` are the preferred save paths for AI-composed input. Positional JSON file input remains supported on the same structured path.
- JSON-mode accepts the documented snake_case fields such as `user_prompts`, `recent_context`, and `trigger_phrases` in addition to the existing camelCase keys.
- Structured JSON summaries also preserve shipped fields such as `toolCalls` and `exchanges`.
- File-backed JSON remains on the structured path and does not fall back into hybrid reconstruction.

### 3.2 Canonical workspace identity

- The repo-local `.opencode` directory is the canonical workspace identity used for enrichment.
- Workspace-scoped file hints are normalized during enrichment before downstream `FILES` and observation generation.

### 3.9 Shared memory sufficiency gate

- After normalization, `generate-context.js` evaluates one shared semantic sufficiency snapshot before writing or indexing.
- The save aborts with `INSUFFICIENT_CONTEXT_ABORT` when the content does not preserve enough durable evidence.
- The gate does not count:
  - workspace match by itself
  - generic titles
  - placeholder file descriptions
  - single anchored prompts with no other substance
  - synthetic/provenance enrichment unless it is clearly target-spec-specific
- The gate does count:
  - meaningful file roles
  - meaningful tool results
  - concrete decisions, blockers, next actions, or outcomes
  - substantive observations with non-generic titles and useful narrative

### 3.9a Phase 017 quality-gate fixes

- `generate-context.js --stdin` reads structured JSON from stdin and routes it through the same workflow contract as file input.
- `generate-context.js --json <string>` does the same for inline structured JSON payloads.
- Positional JSON file input still routes through `loadCollectedData()` and preserves the same structured contract.
- Explicit CLI target authority still outranks payload `specFolder` in those structured-input modes.
- `workflow.ts` now resolves validation outcomes into explicit `abort_write`, `write_skip_index`, and `write_and_index` dispositions instead of treating `qualityValidation.valid` as the only indexing gate.
- `QUALITY_GATE_WARN` preserves V10 diagnostic visibility without causing false-positive aborts or write-only saves for V10-only saves.
- `contamination-filter.ts` now uses typed source capabilities, so the `tool title with path` downgrade is driven by capability policy rather than a hardcoded source-name special case.

### 3.9b Phase 018 output-quality hardening

- Decision rendering now keeps `CONTEXT`, `RATIONALE`, and chosen-option details distinct instead of duplicating the same rationale text.
- Completion-status inference now recovers correctly when normalized `nextSteps` content has already moved into observations.
- Blocker extraction now requires blocker-shaped phrasing rather than broad keywords like `error` or `failed`.
- Generic implementation-pattern and trigger-phrase filler is filtered more aggressively so saved output stays specific.
- `key_files` parsing now accepts em dash, en dash, and colon separators in addition to the basic hyphen form.
- Tree thinning now protects memory-save quality with a `150`-token merge threshold and a maximum of `3` children per merged parent.
- Structured JSON runs can synthesize richer assistant conversation content from `sessionSummary`, key decisions, and next steps when prompt arrays are sparse.

### 3.11 Render-quality hardening

- Post-render cleanup preserves real `<!-- ANCHOR:id -->` comments while still stripping non-anchor workflow comments.
- Trigger phrases are rendered from one workflow-built YAML block so frontmatter and trailing metadata cannot drift or leak raw Mustache control tags.
- Literal template syntax or anchor examples quoted in captured session text are escaped or ignored by validation rules unless they appear as real rendered structure.
- The final rendered file must also satisfy the shared template contract before a save is allowed to complete.

### 3.10 Operator expectations

- `--stdin` / `--json` is the preferred save path for routine structured saves. Positional JSON file input remains supported, and there is no transcript fallback.
- Operator-facing guidance in SKILL.md and the save command documents a JSON-primary save contract rather than an exclusive JSON-only ban on positional file input.
- A successful save requires all of the following:
  - target-spec affinity
  - contamination safety
  - write/index disposition policy
  - semantic sufficiency

### 3.13 Current proof boundary

- Automated parity now proves the shared runtime contract for:
  - structured `--stdin`
  - structured `--json`
  - V10-only write-and-index
  - write-only indexing policy
  - same-minute filename uniqueness
- Fresh live proof remains a separate bar from automated parity.

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/loaders/data-loader.ts` | Structured-input routing enforcement |
| `scripts/memory/generate-context.ts` | CLI entrypoint; `--stdin`, `--json`, and positional JSON file input all resolve through the structured-input contract |
| `scripts/types/session-types.ts` | Structured JSON contract types for fields such as `toolCalls` and `exchanges` |
| `scripts/utils/workspace-identity.ts` | Canonical `.opencode` workspace identity and path equivalence |
| `scripts/utils/spec-affinity.ts` | Shared target-spec anchor evaluation for alignment and normalization |
| `shared/parsing/memory-sufficiency.ts` | Shared semantic sufficiency evaluator used by `generate-context.js` and `memory_save` |
| `shared/parsing/memory-template-contract.ts` | Shared rendered-memory structural contract validator |
| `scripts/utils/input-normalizer.ts` | `DataSource` typing, snake_case JSON compatibility, and tool-evidence shaping |
| `scripts/extractors/collect-session-data.ts` | Template-field assembly, completion-status recovery, and structured summary preservation |
| `scripts/extractors/decision-extractor.ts` | Decision-field deduplication and string-form decision splitting |
| `scripts/extractors/implementation-guide-extractor.ts` | Generic-pattern suppression for saved memory output |
| `scripts/extractors/conversation-extractor.ts` | Structured-data conversation synthesis when prompt arrays are sparse |
| `scripts/extractors/contamination-filter.ts` | Source-aware contamination severity, including the Claude-only tool-path downgrade |
| `scripts/extractors/spec-folder-extractor.ts` | Spec-folder enrichment |
| `scripts/extractors/git-context-extractor.ts` | Git-context enrichment |
| `scripts/core/workflow.ts` | Alignment warnings/blocks, insufficiency blocking, template-contract blocking, contamination-source threading, enrichment insertion, quality abort, and tool-count recovery |
| `scripts/core/tree-thinning.ts` | Tree-thinning safeguards used by session capturing before downstream rendering and scoring |
| `scripts/utils/validation-utils.ts` | Render validation helpers that ignore literal template syntax inside code spans |
| `scripts/memory/validate-memory-quality.ts` | V1-V11 post-render quality gate for rendered memory output, including exported `HARD_BLOCK_RULES` |
| `scripts/utils/slug-utils.ts` | Memory title and filename normalization after captured operator/debug text |
| `scripts/core/quality-scorer.ts` | Legacy quality-score calibration and insufficiency caps |
| `scripts/extractors/quality-scorer.ts` | V2 quality-score calibration and insufficiency flags |
| `scripts/extractors/session-extractor.ts` | Session identity and project-state snapshot behavior |
| `scripts/core/file-writer.ts` | Atomic writes and rollback |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/contamination-filter.vitest.ts` | Contamination denylist severity tracking, Claude-only tool-path downgrade, and API error pattern detection |
| `scripts/tests/workspace-identity.vitest.ts` | `.opencode` workspace identity equivalence and rejection |
| `scripts/tests/spec-affinity.vitest.ts` | Target-spec anchor detection |
| `scripts/tests/validation-rule-metadata.vitest.ts` | Rule metadata registry and explicit write/index disposition coverage |
| `scripts/tests/memory-sufficiency.vitest.ts` | Shared insufficiency contract |
| `scripts/tests/memory-template-contract.vitest.ts` | Rendered-memory structural contract coverage |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Rich vs thin score differentiation |
| `scripts/tests/task-enrichment.vitest.ts` | Task and summary enrichment behavior |
| `scripts/tests/memory-render-fixture.vitest.ts` | Rendered-memory regression coverage |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage plus `--stdin`, `--json`, and positional JSON file-input structured-path behavior |
| `scripts/tests/semantic-signal-golden.vitest.ts` | Trigger-phrase quality regression coverage for the phase-018 output-quality fixes |
| `scripts/tests/test-extractors-loaders.js` | Dist/export regression suite for extractors and loader |
| `scripts/tests/test-bug-fixes.js` | Bug-fix verification stack |
| `scripts/tests/test-integration.vitest.ts` | End-to-end script workflows; legacy `test-integration.js` test file removed |
| `scripts/tests/workflow-e2e.vitest.ts` | Real save-pipeline E2E coverage with temp-repo factory and the failed-embedding harness regression |
| `scripts/tests/test-memory-quality-lane.js` | **[LEGACY]** v2 diagnostic quality and insufficiency regression suite (kept for regression coverage only) |

---

## 5. VERIFICATION SOURCES

- `cd .opencode/skill/system-spec-kit/scripts && npm run check`
- `cd .opencode/skill/system-spec-kit/scripts && npm run build`
- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-extractors-loaders.js`
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-bug-fixes.js`
- `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/test-integration.vitest.ts tests/workflow-e2e.vitest.ts`
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-memory-quality-lane.js`
- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint`
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run test:core -- tests/handler-memory-save.vitest.ts tests/recovery-hints.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts tests/preflight.vitest.ts tests/integration-save-pipeline.vitest.ts`
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run test`
- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing --json`

### Latest verification snapshot

- Treat the commands in this section as the canonical reproducible baseline and capture fresh output each time; do not reuse historical test counts as evidence.
- The current supported scripts baseline for this feature is: `npm run check`, `npm run build`, the targeted Vitest lanes above, and `npm run test:legacy` after build.
- The current supported MCP baseline for this feature is the targeted `memory_save` quality lanes plus the package-level `npm run check`.
- Source/dist alignment should report zero violations for both `mcp_server/dist/lib` and `scripts/dist`.
- Live-proof claims require fresh per-save-mode artifacts generated during the same verification run. No retained `research/` artifact is currently treated as canonical by this catalog.

---

## 6. MANUAL COVERAGE MAP

Manual coverage lives in `M-007` and is expected to explicitly cover:

1. Rich JSON-mode save success and indexing.
2. Thin JSON insufficiency detection and lower score behavior, including the documented snake_case JSON contract plus shipped structured-summary fields such as `toolCalls` and `exchanges`.
3. Git/spec-folder enrichment output.
4. Rendered-memory anchor preservation and frontmatter trigger-phrase quality.
5. Cross-reference to `133` for MCP `memory_save` dry-run and insufficiency verification.
6. Cross-reference to `149` for rendered-memory contract and active-corpus remediation verification.
7. Phase 017 V10-only saves that continue with `QUALITY_GATE_WARN`.
8. Phase 017 V8/V9 contamination that aborts with `QUALITY_GATE_ABORT`.
9. `generate-context.js --stdin` with structured JSON, explicit CLI target precedence, and preserved `toolCalls` / `exchanges`.
10. `generate-context.js --json <string>` with payload-target fallback when no explicit CLI override exists and file-backed JSON authority preserved.
11. Claude `tool title with path` downgrade proof, paired with the unchanged non-Claude capped path.
12. Phase 018 output-quality hardening for decision deduplication, completion-status recovery, blocker filtering, trigger cleanup, separator parsing, tree-thinning safeguards, and structured-data conversation synthesis.
13. Positional JSON file input that remains on the structured file-backed path alongside `--stdin` and `--json`.

---

## 7. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Session capturing pipeline quality
- Source spec: `009-perfect-session-capturing`
- Manual playbook cross-reference: `M-007`
<!-- /ANCHOR:id -->
