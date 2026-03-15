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
5. A fully refreshed canonical verification and manual-testing record.

---

## 2. Current Reality

The shipped session-capture pipeline enforces the following behavior:

1. `session-extractor.ts` uses crypto-backed session IDs and prefers live observations over synthetic enrichment when deriving project-state snapshots.
2. `file-writer.ts` uses random temp-file suffixes and rolls back partial batch writes.
3. `workflow.ts` keeps alignment blocking and low-quality abort behavior in place for stateless saves.
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

Status: Implemented, verified, and documentation-clean as of 2026-03-15.

---

## 3. Feature Breakdown

The closure feature consists of these distinct shipped capabilities:

### 3.1 JSON-mode authority

- Explicit JSON input still wins immediately.
- Native capture is enrichment-oriented fallback behavior, not an authoritative replacement for structured input.
- This preserves compatibility with existing save flows and keeps caller intent unambiguous.

### 3.2 OpenCode precedence

- `OpenCode` remains the first native fallback source.
- When a usable OpenCode capture exists, later native backends are not consulted.
- This preserves the original stateless behavior while keeping later sources additive.

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

---

## 4. Source Files

### Implementation

| File | Role |
|------|------|
| `scripts/loaders/data-loader.ts` | Authoritative fallback chain and usable-content gating |
| `scripts/utils/workspace-identity.ts` | Canonical `.opencode` workspace identity and path equivalence |
| `scripts/utils/spec-affinity.ts` | Shared target-spec anchor evaluation for stateless alignment and normalization |
| `scripts/utils/input-normalizer.ts` | `DataSource` typing, safe stateless fallback, and tool-evidence shaping |
| `scripts/extractors/opencode-capture.ts` | Native OpenCode capture |
| `scripts/extractors/claude-code-capture.ts` | Native Claude transcript parsing |
| `scripts/extractors/codex-cli-capture.ts` | Native Codex transcript parsing |
| `scripts/extractors/copilot-cli-capture.ts` | Native Copilot workspace/event parsing |
| `scripts/extractors/gemini-cli-capture.ts` | Native Gemini history/tmp session parsing |
| `scripts/extractors/spec-folder-extractor.ts` | Spec-folder enrichment |
| `scripts/extractors/git-context-extractor.ts` | Git-context enrichment |
| `scripts/core/workflow.ts` | Alignment blocking, enrichment insertion, quality abort, and stateless tool-count recovery |
| `scripts/core/quality-scorer.ts` | Numeric quality-score calibration |
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
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Rich vs thin score differentiation |
| `scripts/tests/stateless-enrichment.vitest.ts` | Stateless enrichment correctness |
| `scripts/tests/task-enrichment.vitest.ts` | Task and summary enrichment behavior |
| `scripts/tests/memory-render-fixture.vitest.ts` | Rendered-memory regression coverage |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage |
| `scripts/tests/test-extractors-loaders.js` | Dist/export regression suite for extractors and loader |
| `scripts/tests/test-bug-fixes.js` | Bug-fix verification stack |
| `scripts/tests/test-integration.js` | End-to-end script workflows |

---

## 5. Verification Sources

- `npm run lint`
- `npm run build`
- `npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts`
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
2. Thin JSON scorer differentiation and, if applicable, low-quality abort behavior.
3. Alignment blocking or earlier guard precedence for mis-scoped stateless saves.
4. Git/spec-folder enrichment output.
5. OpenCode precedence over later native backends, while still hard-failing same-workspace off-spec captures.
6. Claude fallback behavior, including early alignment blocking when a matching workspace transcript has no target-spec anchor.
7. Codex fallback behavior, including tool-rich sparse-file saves that no longer false-fail `V7`.
8. Copilot fallback behavior, including thin but exact-spec sessions that may pass honestly.
9. Gemini fallback behavior, including thin but exact-spec sessions that may pass honestly.
10. Final `NO_DATA_AVAILABLE` behavior when every native backend is unavailable.
11. Canonical `.opencode` workspace identity behavior across repo-root and `.opencode` artifacts.

---

## 7. Source Metadata

- Group: Tooling and scripts
- Source feature title: Session capturing pipeline quality
- Source spec: `010-perfect-session-capturing`
- Manual playbook cross-reference: `M-007`
