# Research: Cross-CLI Parity Verification

## 1. Metadata

| Field | Value |
|-------|-------|
| **Research ID** | RES-016-PARITY-2026-03-17 |
| **Status** | Complete |
| **Created** | 2026-03-17 |
| **Scope** | Session capturing pipeline parity across all 5 defined CLIs |
| **Spec Folder** | 000-dynamic-capture-deprecation/003-multi-cli-parity |
| **Parent Spec** | 010-perfect-session-capturing |

---

## 2. Investigation Report

### Request Summary

Verify that the session capturing pipeline works across ALL five defined CLIs: Claude Code, OpenCode (Copilot profile), Codex CLI, Copilot CLI, and Gemini CLI. Produce a detailed parity matrix covering capture modules, loaders, tests, session discovery, normalization, and edge cases.

### Findings Summary

The pipeline has **full architectural parity** across all five CLIs. Each CLI has a dedicated capture module, a matching test suite, integration in the data-loader fallback chain, shared normalization through `transformOpencodeCapture()`, and live proof captured on 2026-03-17. The parity is structural and behavioral, not just theoretical.

### Recommendation

The pipeline is production-ready for all five CLIs. Three areas warrant monitoring: (1) Windows path support is minimal (USERPROFILE fallback only, no path separator normalization), (2) session-ID-first selection is implemented only for Claude Code (other CLIs use mtime/freshness), and (3) source provenance metadata (`_sourceTranscriptPath`, `_sourceSessionId`, etc.) is only emitted by the Claude Code capture module.

---

## 3. Executive Overview

The session capturing pipeline is a five-layer architecture:

```
Layer 1: CLI-Specific Capture Modules (5 modules)
    |
Layer 2: Data Loader (fallback chain orchestrator)
    |
Layer 3: Input Normalizer (transformOpencodeCapture)
    |
Layer 4: Extractors (conversation, file, decision, diagram)
    |
Layer 5: Quality Scoring & Memory Output
```

All five CLIs are wired through the same normalization contract (`OpencodeCapture` interface) and share downstream extractors. The data loader implements a configurable fallback chain with environment detection.

---

## 4. Core Architecture

### 4.1 Capture Modules

Each CLI has a dedicated capture module at `scripts/extractors/`:

| CLI | Capture Module | Main Function | Session Storage |
|-----|---------------|---------------|-----------------|
| **OpenCode** | `opencode-capture.ts` | `captureConversation()` | `~/.local/share/opencode/storage/` |
| **Claude Code** | `claude-code-capture.ts` | `captureClaudeConversation()` | `~/.claude/projects/` |
| **Codex CLI** | `codex-cli-capture.ts` | `captureCodexConversation()` | `~/.codex/sessions/` |
| **Copilot CLI** | `copilot-cli-capture.ts` | `captureCopilotConversation()` | `~/.copilot/session-state/` |
| **Gemini CLI** | `gemini-cli-capture.ts` | `captureGeminiConversation()` | `~/.gemini/history/` + `~/.gemini/tmp/` |

[SOURCE: scripts/extractors/opencode-capture.ts:129-137, claude-code-capture.ts:26-31, codex-cli-capture.ts:25-29, copilot-cli-capture.ts:25-29, gemini-cli-capture.ts:25-30]

### 4.2 Data Loader Fallback Chain

The data loader at `scripts/loaders/data-loader.ts` orchestrates capture with a priority-ordered fallback:

1. Explicit JSON data file (when `dataFile` is provided)
2. Preferred native capture source (via `preferredCaptureSource` option or `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` env var)
3. Native capture fallback order: OpenCode -> Claude Code -> Codex CLI -> Copilot CLI -> Gemini CLI
4. Hard-stop with `NO_DATA_AVAILABLE` error

[SOURCE: scripts/loaders/data-loader.ts:224-230, 466-558]

### 4.3 Environment Auto-Detection

The loader infers the preferred capture source from environment variables:

| Env Variable | Inferred Source |
|-------------|-----------------|
| `CODEX_SHELL`, `CODEX_CI`, `CODEX_INTERNAL_ORIGINATOR_OVERRIDE` | `codex-cli-capture` |
| `COPILOT_SESSION` | `copilot-cli-capture` |
| `CLAUDECODE`, `CLAUDE_CODE`, `CLAUDE_CODE_SESSION`, `CLAUDE_CODE_ENTRYPOINT` | `claude-code-capture` |
| `GEMINI_CLI`, `GEMINI_SESSION_ID` | `gemini-cli-capture` |
| `OPENCODE_SESSION_ID`, `OPENCODE_RUNTIME` | `opencode-capture` |
| `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` (explicit) | Any of the above (normalized via alias map) |

[SOURCE: scripts/loaders/data-loader.ts:232-296]

### 4.4 Shared Normalization

All five capture modules return the same `OpencodeCapture` interface, which is then processed through `transformOpencodeCapture()` in `input-normalizer.ts`. This function:

- Normalizes exchanges into `UserPrompt[]` and `Observation[]`
- Extracts file references from tool calls with `_provenance: 'tool'`
- Normalizes tool names (e.g., Copilot `view` -> observation title `Read ...`)
- Builds session metadata consistently regardless of source CLI

[SOURCE: scripts/utils/input-normalizer.ts:733-736]

---

## 5. Technical Specifications

### 5.1 OpencodeCapture Interface

The canonical capture interface shared by all five CLIs:

```typescript
export interface OpencodeCapture {
  exchanges: CaptureExchange[];
  toolCalls?: CaptureToolCall[];
  metadata?: { ... };
  sessionId?: string;
  sessionTitle?: string;
  capturedAt?: string;
}
```

[SOURCE: scripts/utils/input-normalizer.ts:144-146]

### 5.2 DataSource Type

```typescript
export type DataSource =
  | 'file'
  | 'opencode-capture'
  | 'claude-code-capture'
  | 'codex-cli-capture'
  | 'copilot-cli-capture'
  | 'gemini-cli-capture'
  | 'simulation';
```

[SOURCE: scripts/utils/input-normalizer.ts:22-29]

---

## 6. Constraints & Limitations

### 6.1 Session Selection Asymmetry

Claude Code capture implements a four-step fallback chain for session selection:
1. Exact `expectedSessionId` match
2. Active task lock (`.claude/tasks/`)
3. History timestamp ranking (not mtime)
4. Time-window rejection for stale transcripts

The other four CLIs use simpler strategies: Codex and Copilot use mtime-based freshness, Gemini uses `lastUpdated` metadata, and OpenCode uses native CLI commands. None of the non-Claude captures accept session hints.

[SOURCE: claude-code-capture.ts:292-340, codex-cli-capture.ts:296-329, copilot-cli-capture.ts:159-206, gemini-cli-capture.ts:225-266]

### 6.2 Source Provenance Metadata

Only the Claude Code capture module emits the four provenance fields:
- `_sourceTranscriptPath`
- `_sourceSessionId`
- `_sourceSessionCreated`
- `_sourceSessionUpdated`

The other four CLIs do not populate these fields in their metadata output.

[SOURCE: claude-code-capture.ts:649-653]

### 6.3 Platform Path Handling

All five modules use `process.env.HOME || process.env.USERPROFILE || ''` for home directory resolution, providing basic Windows `USERPROFILE` fallback. However, no module performs explicit Windows path separator normalization (`\` vs `/`) or handles Windows-specific session paths.

[SOURCE: opencode-capture.ts:130, claude-code-capture.ts:27, codex-cli-capture.ts:26, copilot-cli-capture.ts:26, gemini-cli-capture.ts:26]

---

## 7. Integration Patterns

### 7.1 Lazy-Loading Pattern

The data loader uses lazy dynamic imports for all five capture modules, with error handling that returns `null` when a module is unavailable:

```typescript
async function getOpencodeCapture(): Promise<OpencodeCaptureMod | null> {
  if (_opencodeCapture === undefined) {
    try {
      _opencodeCapture = await import('../extractors/opencode-capture');
    } catch { _opencodeCapture = null; }
  }
  return _opencodeCapture;
}
```

This pattern is replicated identically for all five CLIs.

[SOURCE: scripts/loaders/data-loader.ts:97-170]

### 7.2 Workspace Identity Normalization

All five capture modules use `isSameWorkspacePath()` from `../utils` to match project roots. This allows matching when the requested directory is a subdirectory (e.g., `.opencode` inside the repo root).

[SOURCE: claude-code-capture.ts:127-128, codex-cli-capture.ts:323, copilot-cli-capture.ts:183-184, gemini-cli-capture.ts:214]

---

## 8. Implementation Guide

Not applicable (research only).

---

## 9. Code Examples

Not applicable (research only).

---

## 10. Testing & Debugging

### 10.1 Per-CLI Test Suites

| CLI | Test File | Test Count | Key Scenarios |
|-----|-----------|------------|---------------|
| **OpenCode** | `opencode-capture.vitest.ts` | 4 tests | Project selection, symlink anchors, nested directories, native CLI export mocking |
| **Claude Code** | `claude-code-capture.vitest.ts` | 6 tests | History-ranked selection, expectedSessionId hints, mtime immunity, active task lock, stale rejection, workspace identity |
| **Codex CLI** | `codex-cli-capture.vitest.ts` | 3 tests | Project matching, reasoning exclusion, workspace identity |
| **Copilot CLI** | `copilot-cli-capture.vitest.ts` | 3 tests | Workspace selection, event pairing, workspace identity |
| **Gemini CLI** | `gemini-cli-capture.vitest.ts` | 3 tests | Project-root mapping, thought exclusion, workspace identity |

[SOURCE: scripts/tests/opencode-capture.vitest.ts, claude-code-capture.vitest.ts, codex-cli-capture.vitest.ts, copilot-cli-capture.vitest.ts, gemini-cli-capture.vitest.ts]

### 10.2 Cross-Cutting Parity Tests

| Test File | Focus | Tests |
|-----------|-------|-------|
| `content-filter-parity.vitest.ts` | Copilot lifecycle markers, Codex reasoning markers, XML wrapper noise filtering | 4 tests |
| `phase-classification.vitest.ts` | Copilot `view` aliases score as canonical Research phase | Part of larger suite |
| `runtime-memory-inputs.vitest.ts` | CLI-derived FILES keep `_provenance: 'tool'`, Copilot `view` titles render as `Read ...` | Part of 28-test suite |

[SOURCE: scripts/tests/content-filter-parity.vitest.ts, phase-classification.vitest.ts, runtime-memory-inputs.vitest.ts]

### 10.3 Test Coverage by Concern

| Concern | Claude Code | OpenCode | Codex | Copilot | Gemini |
|---------|-------------|----------|-------|---------|--------|
| Session discovery (null case) | YES | YES | YES | YES | YES |
| Project-root matching | YES | YES | YES | YES | YES |
| Workspace identity (.opencode) | YES | YES | YES | YES | YES |
| Tool extraction | YES | YES | YES | YES | YES |
| Exchange pairing | YES | YES | YES | YES | YES |
| Noise/reasoning exclusion | YES (thinking blocks) | N/A (no reasoning) | YES (reasoning type) | YES (lifecycle events) | YES (thoughts) |
| Session hint preference | YES (3 tests) | N/A | N/A | N/A | N/A |
| Stale transcript rejection | YES | N/A | N/A | N/A | N/A |
| Active task lock priority | YES | N/A | N/A | N/A | N/A |
| Native CLI command mocking | N/A | YES | N/A | N/A | N/A |

---

## 11. Performance

Not directly applicable. All capture modules use filesystem reads and are bounded by the `maxExchanges` parameter (default 20).

---

## 12. Security

- All capture modules use `toWorkspaceRelativePath()` to sanitize tool input paths, preventing absolute path leakage in memory output.
- The data loader validates explicit data file paths against an allowlist of safe base directories (CWE-22 mitigation).
- No hardcoded secrets in any capture module.

[SOURCE: codex-cli-capture.ts:181-217, copilot-cli-capture.ts:114-132, gemini-cli-capture.ts:115-133, loaders/data-loader.ts:480-499]

---

## 13. Maintenance

### 13.1 Adding a New CLI

To add a sixth CLI:
1. Create `scripts/extractors/new-cli-capture.ts` returning `OpencodeCapture`
2. Add lazy-load getter in `data-loader.ts`
3. Add to `DEFAULT_NATIVE_CAPTURE_ORDER` array
4. Add env variable aliases to `NATIVE_CAPTURE_ENV_ALIASES`
5. Add `'new-cli-capture'` to `DataSource` union type in `input-normalizer.ts`
6. Add test file `scripts/tests/new-cli-capture.vitest.ts`

---

## 14. API Reference

### Capture Functions

| Function | Module | Signature |
|----------|--------|-----------|
| `captureConversation` | opencode-capture | `(maxMessages: number, directory: string) => Promise<ConversationCapture>` |
| `captureClaudeConversation` | claude-code-capture | `(maxExchanges: number, projectRoot: string, sessionHints?: ClaudeSessionHints) => Promise<OpencodeCapture \| null>` |
| `captureCodexConversation` | codex-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \| null>` |
| `captureCopilotConversation` | copilot-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \| null>` |
| `captureGeminiConversation` | gemini-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \| null>` |

---

## 15. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `NO_DATA_AVAILABLE` error | No CLI session found for project root | Check that the CLI has session data in its home directory; try `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=<cli>` |
| Wrong session captured | Claude Code uses history timestamp; others use mtime | For Claude Code, pass `expectedSessionId` via env; for others, ensure the correct session is the newest |
| Missing file provenance | Non-Claude captures do not emit `_sourceSessionId` | Expected behavior; use the `_source` field on the LoadedData result to identify the capture backend |

---

## 16. Acknowledgements

- Live proof artifact: `../../research/live-cli-proof-2026-03-17.json` -- all 5 CLIs captured same-day with exchanges and tool calls
- Phase 016 spec and implementation documentation
- Phase 011 session-source validation spec

---

## 17. Appendix & Changelog

### A. PARITY MATRIX

| Feature | Claude Code | OpenCode | Codex | Copilot | Gemini |
|---------|:-----------:|:--------:|:-----:|:-------:|:------:|
| **Capture module exists** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Returns OpencodeCapture** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Data loader integration** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Env auto-detection** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Fallback chain position** | 2nd | 1st | 3rd | 4th | 5th |
| **transformOpencodeCapture** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Session path discovery** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Workspace identity match** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **USERPROFILE fallback** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Tool extraction** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Exchange pairing** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Noise/reasoning filtering** | VERIFIED | N/A | VERIFIED | VERIFIED | VERIFIED |
| **Session hints (ID-first)** | VERIFIED | MISSING | MISSING | MISSING | MISSING |
| **Active task lock** | VERIFIED | MISSING | MISSING | MISSING | MISSING |
| **Stale rejection** | VERIFIED | MISSING | MISSING | MISSING | MISSING |
| **Source provenance metadata** | VERIFIED | MISSING | MISSING | MISSING | MISSING |
| **Unit test suite** | VERIFIED (6) | VERIFIED (4) | VERIFIED (3) | VERIFIED (3) | VERIFIED (3) |
| **Content-filter parity** | N/A | N/A | VERIFIED | VERIFIED | N/A |
| **Phase classification parity** | N/A | N/A | N/A | VERIFIED | N/A |
| **Runtime provenance test** | N/A | N/A | N/A | VERIFIED | N/A |
| **Live proof (2026-03-17)** | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| **Corrupted data handling** | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL |
| **Windows path normalization** | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL |

### B. EVIDENCE GRADES

| Finding | Grade | Rationale |
|---------|-------|-----------|
| All 5 capture modules exist and return OpencodeCapture | A | Direct code verification, file:line citations |
| Data loader wires all 5 CLIs with lazy loading | A | Direct code verification at data-loader.ts:97-170, 224-230, 316-463 |
| All 5 CLIs tested with dedicated test files | A | Direct test file verification |
| Live proof artifact covers all 5 CLIs | A | JSON artifact at research/live-cli-proof-2026-03-17.json |
| Session hints only for Claude Code | A | Direct code inspection, only claude-code-capture.ts accepts ClaudeSessionHints |
| Source provenance metadata only for Claude Code | A | Direct code inspection at claude-code-capture.ts:649-653 |
| Windows path support is minimal | B | USERPROFILE fallback present but no separator normalization; no Windows tests |
| Corrupted data handling is partial | B | JSONL parsing has try/catch in all modules but no explicit corruption-specific tests |

### C. GAPS AND RECOMMENDATIONS

| Gap | Severity | Recommendation | Confidence |
|-----|----------|----------------|------------|
| Session-ID-first selection only for Claude Code | Low | The other CLIs have simpler session models where mtime/freshness is sufficient. If wrong-session risk emerges for Codex/Copilot/Gemini, add session hints per CLI. No action needed now. | High |
| Source provenance metadata only for Claude Code | Low | The four provenance fields are useful for contamination detection. Consider adding them to other capture modules when their session models mature. | Medium |
| No explicit Windows path separator tests | Medium | All modules use Node.js `path.join()` which handles platform separators, but the home directory constants assume Unix-style paths. Add Windows CI or at minimum a `path.sep` test. | Medium |
| No explicit corrupted-data tests per CLI | Low | All JSONL parsers have try/catch for malformed lines. Add a test per CLI that feeds corrupted input and verifies graceful degradation. | Medium |
| mtime-based session selection in 3 CLIs | Low | Codex uses mtime for transcript ordering, Copilot uses workspace `updated_at` with mtime fallback, Gemini uses `lastUpdated` with mtime fallback. These are reasonable for their session models. | High |

### D. CHANGELOG

| Date | Change |
|------|--------|
| 2026-03-17 | Initial cross-CLI parity research completed |
| 2026-03-18 | Deep research: 5 memory save quality defects identified (see Appendix E) |

---

### E. DEEP RESEARCH: MEMORY SAVE QUALITY DEFECTS (2026-03-18)

**Research ID**: DR-016-MEMSAVE-2026-03-18
**Iterations**: 2 | **Stop reason**: All questions answered (5/5)

#### Defect Summary

| # | Defect | Root Cause | Severity | File:Line |
|---|--------|-----------|----------|-----------|
| Q1 | Decision title double-prefix `Decision: Decision:` | Regex `\d+` requires digits after "Decision", fails to strip `Decision:` without digit | High | `decision-extractor.ts:213` |
| Q2 | Decision text truncation on `--` | Single-character `[-]` in regex matches any hyphen including CLI flags | High | `decision-extractor.ts:213` |
| Q3 | technicalContext not surfaced | No dedicated template variable; routed through generic observation pipeline | Medium | `input-normalizer.ts:278-289` |
| Q4 | key_files missing files | `buildKeyFiles` uses post-tree-thinning files instead of raw list | Medium | `workflow.ts:639-648` |
| Q5 | Confidence hardcoded at 50% | String-form keyDecisions carry no signals for `buildDecisionConfidence` | Low | `decision-extractor.ts:77,88` |

#### Q1+Q2: Decision Title Regex (single fix)

Both bugs trace to one regex at `decision-extractor.ts:213`:
```typescript
/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i
```

**Q1**: `\d+` requires digits after "Decision". Input `"Decision: X"` (no digit) passes unstripped. Template prepends another `Decision {{INDEX}}:`.
**Q2**: `[-\u2013\u2014]` matches any single hyphen, splitting `--build` as a separator.

**Fix**: Make digits optional, require double-dash or em/en dash with whitespace:
```typescript
/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i
```

#### Q3: technicalContext Not Rendered

`buildTechnicalContextObservation` (`input-normalizer.ts:278-289`) converts to a generic observation. Rendering depends on `HAS_OBSERVATIONS` gate (`context_template.md:356`). No dedicated section exists.

**Fix**: Add dedicated `{{#TECHNICAL_CONTEXT}}` template section.

#### Q4: key_files Missing Files

`buildKeyFiles` (`workflow.ts:639-648`) uses post-tree-thinning `effectiveFiles`. Thinning merges small files into synthetic `(merged-small-files)` entries, which are filtered out.

**Fix**: Use pre-thinning file list for metadata indexing.

#### Q5: Confidence Defaults to 50%

`buildDecisionConfidence` (`decision-extractor.ts:77,88`) starts at 0.5, boosted by signals. String-form keyDecisions produce `manualObj = null`, zeroing all signals.

**Fix**: Accept object-form decisions with `confidence` field, or parse inline confidence from strings.

#### Recommended Fix Priority

1. **Q1+Q2** (single regex): Highest impact, simplest change, fixes 2 defects
2. **Q4** (buildKeyFiles source): Medium impact, straightforward
3. **Q3** (technicalContext section): Medium impact, template+workflow change
4. **Q5** (confidence docs/parsing): Low impact, design clarification
