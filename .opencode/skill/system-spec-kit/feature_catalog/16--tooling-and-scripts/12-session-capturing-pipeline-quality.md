# Session Capturing Pipeline Quality

## 1. Overview

Session capturing pipeline quality is the closure feature for spec `010-perfect-session-capturing`. It now covers the full shipped session-capture path for `generate-context.js`:

1. Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits.
2. Stateless enrichment from spec-folder and git context.
3. Numeric quality-score calibration so thin stateless saves score lower than rich saves.
4. Native stateless fallback support for all supported local CLI ecosystems:
   - `OpenCode`
   - `Claude Code`
   - `Codex CLI`
   - `Copilot CLI`
   - `Gemini CLI`
5. One shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing.
6. One shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index.
7. A fully refreshed canonical verification, remediation, and manual-testing record.

---

## 2. Current Reality

The shipped session-capture pipeline enforces the following behavior:

1. `session-extractor.ts` uses crypto-backed session IDs and prefers live observations over synthetic enrichment when deriving project-state snapshots.
2. `file-writer.ts` uses random temp-file suffixes and rolls back partial batch writes.
3. `workflow.ts` keeps alignment blocking, insufficiency blocking, and low-quality abort behavior in place for stateless saves.
4. `spec-folder-extractor.ts` and `git-context-extractor.ts` provide relevance-aware stateless enrichment.
5. `quality-scorer.ts` penalizes generic file descriptions, generic summaries, and repetitive observation titles more aggressively without changing boolean `qualityValidation`.
6. `data-loader.ts` now tries native capture in this order:
   - `OpenCode`
   - `Claude Code`
   - `Codex CLI`
   - `Copilot CLI`
   - `Gemini CLI`
   - explicit `NO_DATA_AVAILABLE`
7. Every native backend remains stateless-only and must exactly match the active workspace identity before its transcript can be used.
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
21. Direct-path mode can prefer the calling CLI's native capture source with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=opencode|claude|codex|copilot|gemini`, then resume the documented fallback order if that hinted source is empty.
22. Explicit JSON mode accepts the documented snake_case save contract as well as the existing camelCase fields.
23. Literal Mustache tokens and literal anchor examples from captured operator text are treated as content, not structural leakage.
24. Rendered output is now validated against a shared template contract before successful write/index:
   - required frontmatter keys must exist
   - mandatory section anchors and HTML ids must exist
   - raw Mustache leakage is rejected
   - duplicate top-of-body separators are rejected
25. Historical active-memory remediation now uses that same template contract and moves non-repairable files out of active `memory/` use.
26. The H1 body heading (`# title`) is derived from the content slug via `slugToTitle(contentSlug)` — the same slug used for the filename — instead of `pickBestContentName()`. A blank line separates the frontmatter close `---` from the H1 to satisfy the `missing_blank_line_after_frontmatter` contract rule.

Status: Implemented, verified, and documentation-clean as of 2026-03-15.

---

## 3. Feature Breakdown

The closure feature consists of these distinct shipped capabilities:

### 3.1 JSON-mode authority

- Explicit JSON input still wins immediately.
- Native capture is enrichment-oriented fallback behavior, not an authoritative replacement for structured input.
- This preserves compatibility with existing save flows and keeps caller intent unambiguous.
- JSON-mode now accepts the documented snake_case fields such as `user_prompts`, `recent_context`, and `trigger_phrases` in addition to the existing camelCase keys.

### 3.2 OpenCode precedence

- `OpenCode` remains the first native fallback source.
- When a usable OpenCode capture exists, later native backends are not consulted.
- This preserves the original stateless behavior while keeping later sources additive.

### 3.2a Caller-aware direct-mode preference

- Direct-path mode can prefer the calling CLI's backend before the standard fallback chain.
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

### 3.8 Shared stateless safety rules

- All native backends remain stateless-only.
- All native backends normalize into the same `OpencodeCapture`-compatible shape.
- Out-of-workspace file hints are dropped before downstream `FILES` and observation generation.
- Workspace identity is necessary for backend discovery, but not sufficient for save-path alignment.
- Same-workspace captures must still prove spec affinity through target-file hits, exact spec id/slug matches, or strong target-spec language.
- Same-workspace generic infrastructure sessions now fail `ALIGNMENT_BLOCK` instead of proceeding warning-only.
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

### 3.11 Render-quality hardening

- Post-render cleanup preserves real `<!-- ANCHOR:id -->` comments while still stripping non-anchor workflow comments.
- Trigger phrases are rendered from one workflow-built YAML block so frontmatter and trailing metadata cannot drift or leak raw Mustache control tags.
- Literal template syntax or anchor examples quoted in captured session text are escaped or ignored by validation rules unless they appear as real rendered structure.
- The final rendered file must also satisfy the shared template contract before a save is allowed to complete.
- Historical active memories can be audited against that same contract with `historical-memory-remediation.ts`.

### 3.10 Operator expectations

- Backend discovery order does not guarantee save success.
- `OpenCode` may still be selected first and then fail `ALIGNMENT_BLOCK`.
- `Claude`, `Codex`, `Copilot`, or `Gemini` may be selected correctly and still fail later if the captured content is foreign-spec dominated or insufficient.
- A successful save now means all of the following were satisfied:
  - discovery
  - workspace identity
  - target-spec affinity
  - contamination safety
  - semantic sufficiency

### 3.12 Historical memory remediation policy

- The current `generate-context.js` output is the compliance baseline for active `memory/` folders.
- Historical memory cleanup is handled as corpus remediation, not by silently relaxing validators.
- Useful historical memories may be repaired in place with narrow mechanical frontmatter fixes only.
- Memories that are too malformed for honest repair should be regenerated only from authoritative evidence through the supported pipeline.
- Memories that are low-signal, misleading, or not honestly repairable are moved out of active `memory/` into preserved spec-local quarantine so they stop participating in indexing.

---

## 4. Source Files

### Implementation

| File | Role |
|------|------|
| `scripts/loaders/data-loader.ts` | Authoritative fallback chain and usable-content gating |
| `scripts/memory/generate-context.ts` | CLI help text and direct-mode capture preference guidance |
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
| `scripts/extractors/spec-folder-extractor.ts` | Spec-folder enrichment |
| `scripts/extractors/git-context-extractor.ts` | Git-context enrichment |
| `scripts/core/workflow.ts` | Alignment blocking, insufficiency blocking, template-contract blocking, enrichment insertion, quality abort, and stateless tool-count recovery |
| `scripts/memory/historical-memory-remediation.ts` | Historical corpus audit/repair/quarantine against the current rendered-memory contract |
| `scripts/utils/validation-utils.ts` | Render validation helpers that ignore literal template syntax inside code spans |
| `scripts/memory/validate-memory-quality.ts` | V5 and V6 quality checks for rendered memory output |
| `scripts/utils/slug-utils.ts` | Memory title and filename normalization after captured operator/debug text |
| `scripts/core/quality-scorer.ts` | Legacy quality-score calibration and insufficiency caps |
| `scripts/extractors/quality-scorer.ts` | V2 quality-score calibration and insufficiency flags |
| `scripts/extractors/session-extractor.ts` | Session identity and project-state snapshot behavior |
| `scripts/core/file-writer.ts` | Atomic writes and rollback |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/claude-code-capture.vitest.ts` | Claude parser and contamination-safe matching |
| `scripts/tests/codex-cli-capture.vitest.ts` | Codex parser and reasoning exclusion |
| `scripts/tests/copilot-cli-capture.vitest.ts` | Copilot workspace/event parsing |
| `scripts/tests/gemini-cli-capture.vitest.ts` | Gemini project mapping and thought exclusion |
| `scripts/tests/workspace-identity.vitest.ts` | `.opencode` workspace identity equivalence and rejection |
| `scripts/tests/spec-affinity.vitest.ts` | Target-spec anchor detection and same-workspace rejection |
| `scripts/tests/runtime-memory-inputs.vitest.ts` | Full native fallback ordering |
| `scripts/tests/memory-sufficiency.vitest.ts` | Shared insufficiency contract |
| `scripts/tests/memory-template-contract.vitest.ts` | Rendered-memory structural contract coverage |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Rich vs thin score differentiation |
| `scripts/tests/stateless-enrichment.vitest.ts` | Stateless enrichment correctness |
| `scripts/tests/task-enrichment.vitest.ts` | Task and summary enrichment behavior |
| `scripts/tests/memory-render-fixture.vitest.ts` | Rendered-memory regression coverage |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage |
| `scripts/tests/historical-memory-remediation.vitest.ts` | Historical active-memory repair/quarantine contract coverage |
| `scripts/tests/test-extractors-loaders.js` | Dist/export regression suite for extractors and loader |
| `scripts/tests/test-bug-fixes.js` | Bug-fix verification stack |
| `scripts/tests/test-integration.js` | End-to-end script workflows |

---

## 5. Verification Sources

- `npm run lint`
- `npm run build`
- `npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts`
- `node test-extractors-loaders.js`
- `node test-bug-fixes.js`
- `node test-integration.js`
- `node test-memory-quality-lane.js`
- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing`

---

## 6. Manual Coverage Map

Manual coverage lives in `M-007` and is expected to explicitly cover:

1. Rich JSON-mode save success and indexing.
2. Thin JSON insufficiency detection and lower score behavior, including the documented snake_case JSON contract.
3. Alignment blocking or earlier guard precedence for mis-scoped stateless saves.
4. Git/spec-folder enrichment output.
5. OpenCode precedence over later native backends, while still hard-failing same-workspace off-spec captures.
6. Claude fallback behavior, including early alignment blocking when a matching workspace transcript has no target-spec anchor.
7. Codex fallback behavior, including tool-rich sparse-file saves that no longer false-fail `V7`.
8. Copilot fallback behavior, including explicit proof that save success depends on real durable evidence rather than backend selection alone.
9. Gemini fallback behavior, including explicit proof that save success depends on real durable evidence rather than backend selection alone.
10. Final `NO_DATA_AVAILABLE` behavior when every native backend is unavailable.
11. Canonical `.opencode` workspace identity behavior across repo-root and `.opencode` artifacts.
12. Rendered-memory anchor preservation and frontmatter trigger-phrase quality.
13. Direct-mode `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` preference behavior.
14. Cross-reference to `NEW-133` for MCP `memory_save` dry-run and insufficiency verification.
15. Cross-reference to `NEW-149` for rendered-memory contract and active-corpus remediation verification.

---

## 7. Source Metadata

- Group: Tooling and scripts
- Source feature title: Session capturing pipeline quality
- Source spec: `010-perfect-session-capturing`
- Manual playbook cross-reference: `M-007`
