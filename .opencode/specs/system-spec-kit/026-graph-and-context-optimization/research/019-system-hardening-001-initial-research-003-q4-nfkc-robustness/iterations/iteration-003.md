# Iteration 003

## Focus

Quantify the practical severity of the Q2-F1 trigger-phrase bypass, trace `sanitizeRecoveredPayload()` through its consumer and Zod boundary, and start the Q4 round-trip stability check.

## Actions

1. Re-read iteration 001 and iteration 002 to anchor the already-proven surface mismatch and prior blocker.
2. Re-read the live implementations of:
   - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
3. Re-ran a local Node probe against the current-main normalization rules for the active PoC corpus:
   - `ｓｙｓｔｅｍ ｐｒｏｍｐｔ`
   - `𝐢𝐠𝐧𝐨𝐫𝐞 𝐩𝐫𝐞𝐯𝐢𝐨𝐮𝐬`
   - `ignore\u200B previous`
   - `sys\u00ADtem prompt`
   - `ignοre previous`
   - `phase ① cocoindex`
   - `f２１ arithmetic inconsistency`
4. Compared three boundaries:
   - trigger-phrase extraction sanitization (`NFC`, no hidden-char strip)
   - recovered-payload sanitization (`NFKC` + hidden-char strip + combining-mark strip + curated confusable fold)
   - persisted hook-state schema validation (`payload: z.string()` only)

## Findings

### Q2 severity: Q2-F1 stays P1, not a new P0

**Conclusion:** the compatibility-form / hidden-character trigger-phrase bypass is a **P1 metadata/filter bypass**, not a practical arbitrary-instruction delivery path on current main.

**Why it is not P0 in the trigger-phrase path**

- `sanitizeTriggerPhrase()` still uses `normalize('NFC')` and accepts visually disguised instruction strings such as `ｓｙｓｔｅｍ ｐｒｏｍｐｔ`, `𝐢𝐠𝐧𝐨𝐫𝐞 𝐩𝐫𝐞𝐯𝐢𝐨𝐮𝐬`, `ignore\u200B previous`, and `sys\u00ADtem prompt` (`trigger-phrase-sanitizer.ts:110-178`).
- Those phrases are used as trigger metadata, not as recovered compact payload content. The code path here is extraction/filtering/indexing quality, not prompt injection into hook output. Iteration 001 already traced the main consumers to semantic extraction, fallback trigger generation, and post-save review counts rather than direct model-context delivery.
- In the local runtime probe, every tested Q2-F1 payload still returned `triggerKeep: true`, while the same strings collapsed or stripped under the stronger recovered-payload normalization.

**Concrete attack scenario**

1. An attacker plants a visually disguised instruction phrase in text that later contributes extracted trigger phrases, for example `ｓｙｓｔｅｍ ｐｒｏｍｐｔ`.
2. `sanitizeTriggerPhrase()` accepts it because the trigger path only normalizes with `NFC` and matches ASCII contamination patterns against the still-fullwidth string.
3. The phrase survives as indexed metadata / quality-review input even though other hardening surfaces interpret the same glyph sequence as `system prompt`.
4. The unintended effect is poisoned metadata and inconsistent filtering semantics, not arbitrary model instruction execution through this path alone.

**Severity call**

- **P1** is the correct severity for Q2-F1 on current main.
- The practical P0 remains the separate recovered-payload bypass from iteration 002 (`ignοre previous` with Greek omicron), because that one survives sanitization and reaches hook output.

### Q3 trace: `sanitizeRecoveredPayload()` only meets a shape-level Zod gate

`sanitizeRecoveredPayload()` does not flow into a content-aware schema boundary.

- Claude SessionStart reads `pendingCompactPrime.payload`, computes `sanitizedPayload` for logging, and then emits the wrapped recovered payload into the output sections (`session-prime.ts:67-79`).
- Gemini compact inject performs the same sanitize-then-wrap pattern before writing recovered context to stdout (`compact-inject.ts:52-69`).
- The persisted hook-state schema only requires `pendingCompactPrime.payload` to be a string (`hook-state.ts:48-55`), and the later parse/load path applies `HookStateSchema.parse` / `safeParse` to the container object, not to the semantic content of the payload (`hook-state.ts:254`, `hook-state.ts:337`, `hook-state.ts:432`).

**Implication**

- Unicode-confusable payloads either:
  - pass through as ordinary strings if the sanitizer misses them, or
  - get stripped before output if the sanitizer catches them.
- There is no downstream Zod rule that says "this string must not contain instruction-like text after normalization."

**Severity**

- This is **P1 as a missing validation boundary** by itself.
- In combination with iteration 002's Q2-F3 (`ignοre previous`), it explains why the recovered-payload bypass is practical: the sanitizer miss is not corrected later by validation.

### Q4 start: JSON round-trip is stable for the tested corpus

The initial round-trip check did **not** find instability in the current runtime for the tested corpus.

- For each tested sample, `input.normalize('NFKC') === JSON.parse(JSON.stringify(input)).normalize('NFKC')`.
- That includes the active bypass strings and the suspicious-prefix PoCs:
  - `ｓｙｓｔｅｍ ｐｒｏｍｐｔ`
  - `𝐢𝐠𝐧𝐨𝐫𝐞 𝐩𝐫𝐞𝐯𝐢𝐨𝐮𝐬`
  - `ignore\u200B previous`
  - `sys\u00ADtem prompt`
  - `ignοre previous`
  - `phase ① cocoindex`
  - `f２１ arithmetic inconsistency`

**Current interpretation**

- The active risk is caused by **surface mismatch in normalization/sanitization**, not by JSON serialization changing the payload between write and read.
- Q4 should now look for non-JSON round trips next: wrapping, line splitting, markdown framing, or other write/read transforms above the plain `JSON.stringify` boundary.

## Evidence Summary

- Trigger path stays on `NFC` and checks ASCII contamination/prefix patterns against that weaker normalization: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:34-36,110-178`
- Recovered-payload path performs stronger normalization and strip logic: `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts:23-105`
- Claude consumer emits wrapped recovered payload after sanitization: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67-79`
- Gemini consumer does the same: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:52-69`
- Hook-state schema only validates payload shape as `z.string()`: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:48-55,254,337,432`

## Next Focus

1. Carry Q4 beyond JSON round-trip into wrap / unwrap / line-splitting stability.
2. Convert the Q3 observation into hardening guidance: if sanitizer misses are the real boundary, the next phase should decide whether to strengthen the confusable map, add a content-aware validation rule, or both.
3. Preserve the P0/P1 distinction:
   - Q2-F1 remains metadata/filter asymmetry.
   - Q2-F3 remains the practical recovered-payload blocker.
