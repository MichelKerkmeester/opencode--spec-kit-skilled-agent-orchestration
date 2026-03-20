---
title: "Session Capturing Pipeline Quality"
description: "Session capturing pipeline quality is the closure feature for spec `010-perfect-session-capturing`. It now covers the shipped JSON-primary save path for `generate-context.js` plus explicit recovery-only fallback behavior:"
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

Session capturing pipeline quality is the closure feature for spec `010-perfect-session-capturing`. It now covers the full shipped session-capture path for `generate-context.js`:

1. Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits.
2. Recovery-mode stateless enrichment from spec-folder and git context.
3. Numeric quality-score calibration so thin recovery captures score lower than rich saves.
4. Explicit recovery-mode native fallback support for all supported local CLI ecosystems:
   - `OpenCode`
   - `Claude Code`
   - `Codex CLI`
   - `Copilot CLI`
   - `Gemini CLI`
5. One shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing.
6. Phase 017-020 runtime-contract hardening, including metadata-driven write/index dispositions, preferred `--stdin` / `--json` structured input, and typed source capabilities for contamination policy.
7. One shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index, while successful flows stay free of template-data warning noise.
8. A refreshed canonical verification, remediation, and manual-testing record that separates automated parity from retained live CLI proof.

---

## 2. CURRENT REALITY

The shipped session-capture pipeline enforces the following behavior:

1. `session-extractor.ts` uses crypto-backed session IDs and prefers live observations over synthetic enrichment when deriving project-state snapshots.
2. `file-writer.ts` uses random temp-file suffixes and rolls back partial batch writes.
3. `workflow.ts` keeps alignment enforcement, insufficiency blocking, low-quality abort behavior, and an explicit write/index disposition contract in place for every save.
4. `spec-folder-extractor.ts` and `git-context-extractor.ts` provide relevance-aware stateless enrichment.
5. `quality-scorer.ts` penalizes generic file descriptions, generic summaries, and repetitive observation titles more aggressively without changing boolean `qualityValidation`.
6. `data-loader.ts` tries native capture only when `--recovery` is explicitly enabled, in this order:
   - `OpenCode`
   - `Claude Code`
   - `Codex CLI`
   - `Copilot CLI`
   - `Gemini CLI`
   - explicit `NO_DATA_AVAILABLE`
7. Every native backend remains recovery-only and must exactly match the active workspace identity before its transcript can be used.
8. The active workspace identity is the nearest repo-local `.opencode` directory.
9. Backend-native repo-root, `.opencode`, and git-root path forms are accepted only when they normalize to that same workspace.
10. Native thought/reasoning content is stripped where applicable:
   - Claude `thinking`
   - Codex reasoning records
   - Gemini `thoughts`
11. Only workspace-scoped file hints survive normalization into downstream `FILES` and observation content.
12. Stateless save-path alignment now requires at least one spec-specific anchor beyond “same workspace”.
13. Generic `.opencode` or shared infrastructure paths do not count as sufficient evidence for saving into a specific spec.
14. Stateless tool evidence can now keep rendered `tool_count` above zero even when no file edits occurred.
15. Safe prompt fallback is only allowed when the capture already has a real target-spec anchor; otherwise generic residue is dropped instead of rescued.
16. Native or explicit JSON saves that stay aligned but preserve too little durable evidence now fail with `INSUFFICIENT_CONTEXT_ABORT`.
17. The sufficiency contract requires:
   - a specific title
   - at least one primary evidence item
   - at least two total evidence items
   - enough semantic substance to stand alone later
18. `generate-context.js` diagnostic scores now reflect insufficiency explicitly instead of letting thin memories look healthy.
19. Rendered memory files preserve `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` comments through post-render cleanup while still stripping non-anchor workflow comments.
20. Frontmatter `trigger_phrases` now render the same session-specific values as the trailing metadata block and fall back to `[]` instead of generic placeholders.
21. Recovery mode can prefer the calling CLI's native capture source with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=opencode|claude|codex|copilot|gemini`, then resume the documented fallback order if that hinted source is empty.
22. Explicit JSON mode accepts the documented snake_case save contract as well as the existing camelCase fields.
23. Structured JSON mode now accepts both `generate-context.js --stdin` and `generate-context.js --json <string>`, and those structured paths are the only routine-save contract.
24. In those structured-input modes, an explicit CLI target still outranks payload `specFolder`, and the payload target is used only when no explicit override is present.
25. `validate-memory-quality.ts` now owns a first-class rule metadata registry with per-rule severity, write blocking, index blocking, source applicability, and rationale.
26. The workflow now resolves every save into one explicit disposition:
   - `abort_write`
   - `write_skip_index`
   - `write_and_index`
27. V1, V3, V8, V9, and V11 remain hard blockers; V4, V5, V6, V7, and V10 remain soft diagnostics that can still write and index when the upstream template, sufficiency, and score gates pass.
28. V2 now remains writeable but intentionally skips semantic indexing, which makes the write-only path explicit instead of coupling it to the old `qualityValidation.valid` boolean.
29. Contamination severity policy now uses typed source capabilities instead of a raw source-name exception; only capability profiles that expect transcript-style tool titles get the `tool title with path` downgrade.
30. Literal Mustache tokens and literal anchor examples from captured operator text are treated as content, not structural leakage.
31. Rendered output is now validated against a shared template contract before successful write/index:
   - required frontmatter keys must exist
   - mandatory section anchors and HTML ids must exist
   - raw Mustache leakage is rejected
   - duplicate top-of-body separators are rejected
32. Historical active-memory remediation now uses that same template contract and moves non-repairable files out of active `memory/` use.
33. The H1 body heading (`# title`) is derived from the content slug via `slugToTitle(contentSlug)`, which is the same slug used for the filename, instead of `pickBestContentName()`. A blank line separates the frontmatter close `---` from the H1 to satisfy the `missing_blank_line_after_frontmatter` contract rule.
34. API error content is blocked at 5 pipeline layers:
   - `claude-code-capture.ts` skips events with `isApiErrorMessage: true`
   - `input-normalizer.ts` treats API error strings as placeholder responses
   - `contamination-filter.ts` detects error prefixes, JSON error payloads, and request ID leaks (high severity)
   - `collect-session-data.ts` guards SUMMARY derivation against error text in the `learning` field
   - `validate-memory-quality.ts` V11 rule rejects memories with error-dominated descriptions, titles, or trigger phrases

Status: Implemented and strongly verified for the runtime contract as of 2026-03-18, but not yet eligible for a blanket “flawless across every CLI” claim. The automated scripts lane now covers rule metadata, capability-driven contamination handling, structured-input parity, V10 write-and-index behavior, write-only indexing policy, same-minute filename stability, and renderer-noise suppression. Retained live proof still exists at `research/live-cli-proof-2026-03-17.json`, but per-CLI/per-mode artifacts should be refreshed before any universal live-verification claim is made.

---

## 3. FEATURE BREAKDOWN

The closure feature consists of these distinct shipped capabilities:

### 3.1 JSON-mode authority

- Explicit JSON input still wins immediately.
- Native capture is explicit recovery behavior, not an authoritative replacement for structured input.
- This preserves compatibility with existing save flows and keeps caller intent unambiguous.
- `--stdin` and `--json` are the documented preferred paths whenever a caller can provide curated session data directly.
- JSON-mode now accepts the documented snake_case fields such as `user_prompts`, `recent_context`, and `trigger_phrases` in addition to the existing camelCase keys.

### 3.2 OpenCode recovery precedence

- `OpenCode` remains the first native recovery source.
- When a usable OpenCode capture exists, later native backends are not consulted.
- This preserves explicit recovery behavior while keeping later sources additive.

### 3.2a Caller-aware recovery-mode preference

- Recovery mode can prefer the calling CLI's backend before the standard fallback chain.
- `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=opencode|claude|codex|copilot|gemini` is the explicit override for that preference.
- If the hinted backend yields no usable content, the loader resumes the documented fallback order instead of failing early.
- Explicit JSON input remains authoritative and bypasses native selection entirely.

### 3.3 Canonical workspace identity

- The repo-local `.opencode` directory is the canonical workspace identity for native capture.
- This identity is shared across `OpenCode`, `Claude`, `Codex`, `Copilot`, and `Gemini`.
- Backend-native stored paths may differ, but they only match when they resolve to the same `.opencode` anchor.

### 3.4 Claude Code fallback

- `Claude Code` remains the second native fallback source.
- Transcript discovery stays bounded to `~/.claude/projects/<sanitized-project>/`.
- Exact workspace/session preference, `thinking` exclusion, and workspace-scoped snapshot filtering remain active.

### 3.5 Codex CLI fallback

- `Codex CLI` is now a supported native fallback source.
- Transcript discovery scans recent `~/.codex/sessions/**/rollout-*.jsonl` files.
- Only transcripts whose embedded `session_meta.payload.cwd` resolves to the active workspace identity are accepted.
- Reasoning records are excluded while user/assistant messages and function-call tool telemetry are preserved.

### 3.6 Copilot CLI fallback

- `Copilot CLI` is now a supported native fallback source.
- Workspace discovery reads `~/.copilot/session-state/*/workspace.yaml` with sibling `events.jsonl`.
- Only workspaces whose `cwd` or `git_root` resolve to the active workspace identity are accepted.
- User messages, assistant messages, and tool execution events are normalized into the shared capture contract.

### 3.7 Gemini CLI fallback

- `Gemini CLI` is now a supported native fallback source.
- Project discovery uses `~/.gemini/history/*/.project_root` and paired `~/.gemini/tmp/<dir>/chats/session-*.json`.
- Only project-root mappings that resolve to the active workspace identity are accepted.
- `thoughts` are excluded while assistant text and tool-call telemetry remain available for normalization.

### 3.8 Shared recovery-only safety rules

- All native backends remain recovery-only.
- All native backends normalize into the same `OpencodeCapture`-compatible shape.
- Out-of-workspace file hints are dropped before downstream `FILES` and observation generation.
- Workspace identity is necessary for backend discovery, but not sufficient for save-path alignment.
- Same-workspace captures must still prove spec affinity through target-file hits, exact spec id/slug matches, or strong target-spec language.
- When the operator explicitly provides the target spec folder via CLI, missing spec-affinity anchors now emit `ALIGNMENT_WARNING` instead of a hard Block A abort.
- File-path overlap safety still hard-blocks at low overlap ratios, so same-workspace but mostly-foreign captures can still fail `ALIGNMENT_BLOCK`.
- The loader accepts tool-call-only native captures as usable content instead of discarding them.
- The workflow recovers rendered `tool_count` from structured native tool evidence, not only file edits.
- Prompt/context fallback keeps generic/current-spec content only when the capture already proves target-spec affinity and drops foreign-spec or anchorless fallback when unsafe.

### 3.9 Shared memory sufficiency gate

- Workspace identity and target-spec affinity are necessary, but no longer sufficient, conditions for a durable memory.
- After normalization, `generate-context.js` now evaluates one shared semantic sufficiency snapshot before writing or indexing.
- The save aborts with `INSUFFICIENT_CONTEXT_ABORT` when the content does not preserve enough durable evidence.
- This applies to:
  - native stateless capture
  - explicit JSON input
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

### 3.9a Phase 017 recovery-only quality-gate fixes

- `generate-context.js --stdin` reads structured JSON from stdin and routes it through the same workflow contract as file input.
- `generate-context.js --json <string>` does the same for inline structured JSON payloads.
- Explicit CLI target authority still outranks payload `specFolder` in those structured-input modes.
- `workflow.ts` now resolves validation outcomes into explicit `abort_write`, `write_skip_index`, and `write_and_index` dispositions instead of treating `qualityValidation.valid` as the only indexing gate.
- `QUALITY_GATE_WARN` preserves V10 diagnostic visibility without turning V10-only recovery-mode saves into false-positive aborts or write-only saves.
- `contamination-filter.ts` now uses typed source capabilities, so the `tool title with path` downgrade is driven by capability policy rather than a hardcoded source-name special case.

### 3.11 Render-quality hardening

- Post-render cleanup preserves real `<!-- ANCHOR:id -->` comments while still stripping non-anchor workflow comments.
- Trigger phrases are rendered from one workflow-built YAML block so frontmatter and trailing metadata cannot drift or leak raw Mustache control tags.
- Literal template syntax or anchor examples quoted in captured session text are escaped or ignored by validation rules unless they appear as real rendered structure.
- The final rendered file must also satisfy the shared template contract before a save is allowed to complete.
- Historical active memories can be audited against that same contract with `historical-memory-remediation.ts`.

### 3.10 Operator expectations

- Backend discovery order does not guarantee save success.
- Structured `--stdin` / `--json` input is the required routine-save path; transcript fallback exists only for explicit recovery.
- `OpenCode` may still be selected first and then either warn on missing spec anchors, fail later on file-overlap alignment, fail on hard-block contamination, or fail on insufficiency.
- `Claude`, `Codex`, `Copilot`, or `Gemini` may be selected correctly and still fail later if the captured content is foreign-spec dominated, too thin to preserve durable evidence, or blocked by a hard stateless quality rule.
- A successful save now means all of the following were satisfied:
  - discovery
  - workspace identity
  - target-spec affinity
  - contamination safety
  - write/index disposition policy
  - semantic sufficiency

### 3.13 Current proof boundary

- Automated parity now proves the shared runtime contract for:
  - direct fallback mode
  - structured `--stdin`
  - structured `--json`
  - V10-only write-and-index
  - write-only indexing policy
  - same-minute filename uniqueness
- Retained live proof remains a separate bar from automated parity.
- Do not claim “flawless across every CLI” until retained artifacts cover each supported CLI and each supported save mode for the current contract.

### 3.12 Historical memory remediation policy

- The current `generate-context.js` output is the compliance baseline for active `memory/` folders.
- Historical memory cleanup is handled as corpus remediation, not by silently relaxing validators.
- Useful historical memories may be repaired in place with narrow mechanical frontmatter fixes only.
- Memories that are too malformed for honest repair should be regenerated only from authoritative evidence through the supported pipeline.
- Memories that are low-signal, misleading, or not honestly repairable are moved out of active `memory/` into preserved spec-local quarantine so they stop participating in indexing.
- When `historical-memory-remediation.ts` runs with `--apply`, canonical report files describe the final post-apply state and preserved `*.pre-apply.*` files remain historical snapshots only.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/loaders/data-loader.ts` | Authoritative fallback chain and usable-content gating |
| `scripts/memory/generate-context.ts` | CLI help text, direct-mode capture preference guidance, and Phase 017 `--stdin` / `--json` structured-input authority |
| `scripts/utils/workspace-identity.ts` | Canonical `.opencode` workspace identity and path equivalence |
| `scripts/utils/spec-affinity.ts` | Shared target-spec anchor evaluation for stateless alignment and normalization |
| `shared/parsing/memory-sufficiency.ts` | Shared semantic sufficiency evaluator used by `generate-context.js` and `memory_save` |
| `shared/parsing/memory-template-contract.ts` | Shared rendered-memory structural contract validator |
| `scripts/utils/input-normalizer.ts` | `DataSource` typing, safe stateless fallback, snake_case JSON compatibility, and tool-evidence shaping |
| `scripts/extractors/opencode-capture.ts` | Native OpenCode capture |
| `scripts/extractors/claude-code-capture.ts` | Native Claude transcript parsing |
| `scripts/extractors/codex-cli-capture.ts` | Native Codex transcript parsing |
| `scripts/extractors/copilot-cli-capture.ts` | Native Copilot workspace/event parsing |
| `scripts/extractors/gemini-cli-capture.ts` | Native Gemini history/tmp session parsing |
| `scripts/extractors/contamination-filter.ts` | Source-aware contamination severity, including the Claude-only tool-path downgrade |
| `scripts/extractors/spec-folder-extractor.ts` | Spec-folder enrichment |
| `scripts/extractors/git-context-extractor.ts` | Git-context enrichment |
| `scripts/core/workflow.ts` | Alignment warnings/blocks, insufficiency blocking, template-contract blocking, Phase 017 stateless hard-block vs soft-warning gating, contamination-source threading, enrichment insertion, quality abort, and stateless tool-count recovery |
| `scripts/memory/historical-memory-remediation.ts` | Historical corpus audit/repair/quarantine against the current rendered-memory contract |
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
| `scripts/tests/claude-code-capture.vitest.ts` | Claude parser and contamination-safe matching |
| `scripts/tests/contamination-filter.vitest.ts` | Contamination denylist severity tracking, Claude-only tool-path downgrade, and API error pattern detection |
| `scripts/tests/codex-cli-capture.vitest.ts` | Codex parser and reasoning exclusion |
| `scripts/tests/copilot-cli-capture.vitest.ts` | Copilot workspace/event parsing |
| `scripts/tests/gemini-cli-capture.vitest.ts` | Gemini project mapping and thought exclusion |
| `scripts/tests/workspace-identity.vitest.ts` | `.opencode` workspace identity equivalence and rejection |
| `scripts/tests/spec-affinity.vitest.ts` | Target-spec anchor detection and same-workspace rejection |
| `scripts/tests/runtime-memory-inputs.vitest.ts` | Full native fallback ordering |
| `scripts/tests/memory-sufficiency.vitest.ts` | Shared insufficiency contract |
| `scripts/tests/memory-template-contract.vitest.ts` | Rendered-memory structural contract coverage |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Rich vs thin score differentiation plus Phase 017 Claude/non-Claude cap regression coverage |
| `scripts/tests/stateless-enrichment.vitest.ts` | Stateless enrichment correctness |
| `scripts/tests/task-enrichment.vitest.ts` | Task and summary enrichment behavior |
| `scripts/tests/memory-render-fixture.vitest.ts` | Rendered-memory regression coverage |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage plus Phase 017 `--stdin` / `--json` structured-input precedence |
| `scripts/tests/historical-memory-remediation.vitest.ts` | Historical active-memory repair/quarantine contract coverage |
| `scripts/tests/test-extractors-loaders.js` | Dist/export regression suite for extractors and loader |
| `scripts/tests/test-bug-fixes.js` | Bug-fix verification stack |
| `scripts/tests/test-integration.vitest.ts` | End-to-end script workflows (migrated from `test-integration.js`) |
| `scripts/tests/workflow-e2e.vitest.ts` | Real save-pipeline E2E coverage with temp-repo factory, Phase 017 Gate A tiering, and the failed-embedding harness regression |
| `scripts/tests/test-memory-quality-lane.js` | Legacy/v2 diagnostic quality and insufficiency regression suite |

---

## 5. VERIFICATION SOURCES

- `cd .opencode/skill/system-spec-kit/scripts && npm run check`
- `cd .opencode/skill/system-spec-kit/scripts && npm run build`
- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts tests/historical-memory-remediation.vitest.ts`
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
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/017-stateless-quality-gates --json`

### Latest verification snapshot

- On 2026-03-17, the root `system-spec-kit` `typecheck` plus scripts `check` and `build` reran cleanly.
- On 2026-03-17, the targeted scripts closure suite reran cleanly with `14` files and `150` tests.
- On 2026-03-17, `test-scripts-modules.js` reran cleanly with `384` passed, `5` skipped, and `389` total.
- On 2026-03-17, `test-extractors-loaders.js` reran cleanly with `307` passing tests.
- On 2026-03-17, the phase-016 parity lane reran cleanly with `45` tests.
- On 2026-03-17, the targeted MCP save-quality lane reran cleanly with `6` files and `298` tests.
- On 2026-03-17, package-clean MCP verification reran cleanly for `npm run lint`, `npm run build`, and `npm run test`, with the full MCP package suite reporting `283` files and `7822` total tests including skips and todo coverage.
- Alignment drift remains supported by the 2026-03-16 rerun, which reported `229` scanned files and `0` findings; it was not part of the March 17 rerun set.
- The March 17 automated reruns are not, by themselves, the live-proof evidence for every CLI; that proof comes from the retained artifact at `research/live-cli-proof-2026-03-17.json`, and any future universal live-verification claim should refresh equivalent primary evidence.
- On 2026-03-18, API error content defense was added: V11 validation rule in `validate-memory-quality.ts`, 3 contamination denylist patterns in `contamination-filter.ts`, 6 placeholder patterns in `input-normalizer.ts`, SUMMARY error guard in `collect-session-data.ts`, and `isApiErrorMessage` skip in `claude-code-capture.ts`. Test coverage expanded with `contamination-filter.vitest.ts`.
- On 2026-03-18, the affected Phase 017 scripts lane reran cleanly with `4` files and `39` passing tests after the `workflow-e2e.vitest.ts` failed-embedding harness was corrected.
- On 2026-03-18, phase-local spec validation for `017-stateless-quality-gates` was rerun with `0` errors and `2` warning-only template deviations so the phase pack and this downstream catalog could be reconciled to the shipped state.

---

## 6. MANUAL COVERAGE MAP

Manual coverage lives in `M-007` and is expected to explicitly cover:

1. Rich JSON-mode save success and indexing.
2. Thin JSON insufficiency detection and lower score behavior, including the documented snake_case JSON contract.
3. Explicit-CLI same-workspace off-spec stateless runs that warn on missing anchors, plus hard alignment blocking when file-path overlap remains too low.
4. Git/spec-folder enrichment output.
5. OpenCode precedence over later native backends, while still enforcing later alignment, contamination, and insufficiency gates.
6. Claude fallback behavior, including warning-only anchor-miss handling, hard overlap blocking when appropriate, and the Claude-only contamination downgrade.
7. Codex fallback behavior, including tool-rich sparse-file saves that no longer false-fail `V7`.
8. Copilot fallback behavior, including explicit proof that save success depends on real durable evidence rather than backend selection alone.
9. Gemini fallback behavior, including explicit proof that save success depends on real durable evidence rather than backend selection alone.
10. Final `NO_DATA_AVAILABLE` behavior when every native backend is unavailable.
11. Canonical `.opencode` workspace identity behavior across repo-root and `.opencode` artifacts.
12. Rendered-memory anchor preservation and frontmatter trigger-phrase quality.
13. Direct-mode `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` preference behavior.
14. Cross-reference to `NEW-133` for MCP `memory_save` dry-run and insufficiency verification.
15. Cross-reference to `NEW-149` for rendered-memory contract and active-corpus remediation verification.
16. Phase 017 V10-only stateless saves that continue with `QUALITY_GATE_WARN`.
17. Phase 017 V8/V9 stateless contamination that still aborts with `QUALITY_GATE_ABORT`.
18. `generate-context.js --stdin` with structured JSON and explicit CLI target precedence.
19. `generate-context.js --json <string>` with payload-target fallback when no explicit CLI override exists.
20. Claude `tool title with path` downgrade proof, paired with the unchanged non-Claude capped path.

---

## 7. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Session capturing pipeline quality
- Source spec: `010-perfect-session-capturing`
- Manual playbook cross-reference: `M-007`
