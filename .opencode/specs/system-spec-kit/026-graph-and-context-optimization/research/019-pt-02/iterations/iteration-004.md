# Iteration 004

## Focus

Deepen Q3 by tracing `sanitizeRecoveredPayload()` into downstream consumers and checking for any content-sensitive amplification, extend Q4 round-trip stability with explicit Unicode cases, and draft Q5 hardening proposals.

## Actions

1. Re-read iteration 003 and the iteration-4 prompt pack for the active packet.
2. Re-read the live implementations of:
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts`
3. Ran a local Node probe against the current runtime for explicit Q4 cases:
   - `sys\u200Dtem: x` / `sys\u200Ctem: y`
   - `System\uFF1A hidden`
   - `Syste\u0301m: hidden`
4. Compared the sanitize boundary, hook-state schema boundary, prompt-output wrappers, and the compact-cache anti-feedback pipeline.

## Findings

### Q3 — downstream consumers are prompt-shaping and transcript-reprocessing surfaces, not shell/file/SQL sinks

`sanitizeRecoveredPayload()` still crosses only a shape-level schema boundary, but iteration 004 clarifies what happens after that string is accepted.

- Claude SessionStart, Gemini SessionStart, and Gemini compact inject all take the recovered payload string, wrap it with provenance markers, and emit it as prompt/context output. That is string-sensitive because the model will read the content, but the code path does not reinterpret the payload as a command, filesystem authority, or query language (`session-prime.ts`, `compact-inject.ts`).
- Claude, Gemini, and Copilot compact-cache builders later re-read transcript lines and run regex-based anti-feedback stripping plus regex extractors over those lines:
  - `COMPACT_FEEDBACK_GUARDS`
  - `stripRecoveredCompactLines(...)`
  - `extractFilePaths(...)`
  - `extractTopics(...)`
- That means a sanitizer miss can be re-ingested as:
  - persistent "recent context" text,
  - false-positive topic/file metadata if the line happens to match those regexes,
  - repeated compact-context contamination across later turns.

**What I did not find**

- No shell command construction from recovered payload content.
- No dynamic filesystem path construction where recovered payload becomes authority for reads/writes.
- No SQL-like query construction from recovered payload text.

**Severity**

- Q3-F1 remains **P1**.
- The downstream amplification is real, but it is still prompt-shaping / metadata persistence, not a high-severity code-execution sink on current main.

### Q4 — round-trip stability holds for the tested cases, but the important result is what NFKC does and does not normalize

The local runtime probe on `node v25.6.1` (`icu 78.2`, `unicode 17.0`) showed:

- **ZWJ/ZWNJ case:** stable across `NFKC -> JSON.stringify -> JSON.parse -> NFKC`, but the joiners remain present. `NFKC` does not remove U+200D/U+200C by itself.
- **Fullwidth colon case:** stable across the round-trip, but the prompt-pack note "no change" is incorrect on this runtime. `U+FF1A` normalizes to ASCII `:` under `NFKC`, then stays stable after JSON round-trip.
- **Combining-mark case:** stable across the round-trip. `Syste\u0301m` becomes the composed `Systém` under `NFKC` and remains in that canonical form after JSON serialization/deserialization.

**Interpretation**

- I still do not see JSON round-trip drift as the driver of the active risk.
- The active risk remains normalization-policy mismatch across surfaces and incomplete post-normalization filtering.
- Cross-version ICU drift remains **open** because only the current Node runtime was available in this iteration.

### Q5 — hardening proposals

1. **Unify normalization chains across all relevant surfaces.**
   Move trigger-phrase sanitization onto the same `NFKC + hidden-char strip + combining-mark strip + confusable fold` pipeline already used by `shared-provenance`.

2. **Add a post-normalization deny-list pass for instruction-equivalent classes.**
   After canonicalization, re-run contamination checks against the folded string so `system prompt`, `ignore previous`, and related families are blocked consistently even when introduced via compatibility forms.

3. **Add semantic validation for recovered payload content, not just `z.string()`.**
   Keep `payload: z.string()` for transport shape, but add a second validator before output/wrapping that can reject or quarantine payloads whose normalized content still contains dangerous instruction-like lines.

4. **Assert round-trip invariants in tests.**
   Add explicit tests for:
   - ZWJ/ZWNJ persistence,
   - fullwidth punctuation folding,
   - combining-mark composition,
   - wrapper/transcript re-ingestion parity across Claude/Gemini/Copilot compact-cache paths.

5. **Record runtime Unicode/ICU fingerprints in the test surface.**
   At minimum, log or assert the active `process.version`, `process.versions.icu`, and `process.versions.unicode` in the NFKC regression tests so future drift is detectable instead of silent.

## Evidence Summary

- Recovered payload is still only shape-validated as `z.string()` in hook state:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:26-47`
- Prompt-output consumers wrap and emit recovered payload text:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67-79`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73-84`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:52-64`
- Regex-based reprocessing exists in all compact-cache builders:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:25-31,70-71,211-213,318-320`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:24-30,45-58,86-94,139-141`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:55-59,103-117,151-158,227-229`
- Trigger-sanitizer still uses weaker `NFC` normalization:
  - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:95-110,114-178`
- Shared-provenance still owns the stronger normalization chain:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts:32-105`

## Next Focus

1. Decide whether Q5 proposal #3 should be framed as a quarantine/fail-closed rule or as a telemetry-only detector first.
2. Expand the adversarial corpus with ZWJ/ZWNJ + punctuation combinations now that round-trip behavior is characterized.
3. If a future iteration wants a stronger escalation argument, it should target re-ingestion persistence and feedback-loop poisoning, not command/file/query execution, because those higher-severity sinks were not present here.
