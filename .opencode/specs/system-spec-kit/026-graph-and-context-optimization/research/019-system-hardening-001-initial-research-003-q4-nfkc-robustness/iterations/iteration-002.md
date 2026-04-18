# Iteration 002

## Focus

Build concrete Q2 proof-of-concept strings for the normalization-surface mismatch between `trigger-phrase-sanitizer` and the stronger Gate 3 / shared-provenance chain, then start Q3 by tracing `sanitizeRecoveredPayload()` into its consumer and schema boundary.

## Actions

1. Re-read iteration 001 to anchor the known surface mismatch and active hypotheses.
2. Read the current implementations of:
   - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`
   - `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
3. Reproduced the source logic locally in Node with the exact normalization and regex rules copied from current main. Direct TS import of `gate-3-classifier.ts` was blocked by an unresolved `.js` dependency in this sandbox, so the probe mirrored the live source instead of importing the wrapper.
4. Compared candidate payloads across three effective behaviors:
   - trigger-phrase sanitizer (`NFC`, no hidden-char strip, no confusable fold)
   - shared-provenance recovered-payload sanitizer (`NFKC` + hidden-char strip + `NFD` mark strip + explicit confusable fold)
   - Gate 3 effective normalization (same fold primitive as shared-provenance, then lowercase/whitespace collapse)

## PoC Bypass Constructions

### Q2-F1 - Trigger-phrase sanitizer accepts instruction-shaped compatibility forms that the stronger surfaces collapse and reject - P1

**Evidence:** `sanitizeTriggerPhrase()` only applies `normalize('NFC')` before contamination / suspicious-prefix checks (`trigger-phrase-sanitizer.ts:110-116,126-178`). Gate 3 and shared-provenance instead flow through `foldUnicodeConfusablesToAscii()` which applies `NFKC`, strips hidden characters, then removes combining marks and folds a curated Cyrillic/Greek confusable set (`shared-provenance.ts:33-96`).

Verified PoCs:

| Input | Trigger phrase result | Shared-provenance result | Gate/shared normalized form |
| --- | --- | --- | --- |
| `ｓｙｓｔｅｍ ｐｒｏｍｐｔ` | `keep: true` | stripped to empty | `system prompt` |
| `𝐢𝐠𝐧𝐨𝐫𝐞 𝐩𝐫𝐞𝐯𝐢𝐨𝐮𝐬` | `keep: true` | stripped to empty | `ignore previous` |
| `ignore\u200B previous` | `keep: true` | stripped to empty | `ignore previous` |
| `sys\u00ADtem prompt` | `keep: true` | stripped to empty | `system prompt` |
| `assistant\uFF1A hidden instruction` | `keep: true` | stripped to empty | `assistant: hidden instruction` |
| `ＳＹＳＴＥＭ: hidden instruction` | `keep: true` | stripped to empty | `system: hidden instruction` |
| `𝐒𝐘𝐒𝐓𝐄𝐌: hidden instruction` | `keep: true` | stripped to empty | `system: hidden instruction` |

**Impact:** extracted trigger phrases can preserve visually non-ASCII instruction strings that later NFKC-aware surfaces interpret as dangerous ASCII. This is the exact surface mismatch iteration 001 predicted.

### Q2-F2 - Suspicious-prefix checks can be bypassed with compatibility digits - P2

**Evidence:** suspicious-prefix blocking depends on ASCII `\d+` after the `NFC`-only normalization path (`trigger-phrase-sanitizer.ts:34,110-116,170-172`).

Verified PoCs:

| Input | Trigger phrase result | Shared/Gate normalized form |
| --- | --- | --- |
| `phase ① cocoindex` | `keep: true` | `phase 1 cocoindex` |
| `f２１ arithmetic inconsistency` | `keep: true` | `f21 arithmetic inconsistency` |

**Impact:** not a direct prompt-injection payload by itself, but it proves extracted trigger phrases are filtered on a weaker visible-form basis than the rest of the hardening stack.

### Q2-F3 - Greek omicron bypass survives both trigger sanitization and shared-provenance stripping - P0 blocker

**Evidence:** the shared confusable map covers Cyrillic `О/о` but not Greek omicron `Ο/ο` (`shared-provenance.ts:35-64`), while the strip pattern still expects ASCII `ignore previous` (`shared-provenance.ts:25-30`). The tested payload `ignοre previous` (Greek omicron `ο`, U+03BF) survives:

- trigger phrase sanitizer: `keep: true`
- shared-provenance sanitizer: line preserved unchanged
- Gate/shared normalized form: still `ignοre previous`

**Why this matters:** this is no longer just a cross-surface mismatch. It is a practical recovered-payload bypass against the shared-provenance hardening itself. `handleCompact()` and Gemini `compact-inject` both emit the wrapped recovered payload directly into hook output after sanitization (`session-prime.ts:67-76`, `compact-inject.ts:52-60`). A cached payload line that visually reads like `ignore previous` but uses Greek omicron will survive sanitization and reach the next model turn.

**Blocker note:** per this phase's contract, a practical bypass is a blocker-level result. This one should halt the assumption that phase 016's recovered-payload hardening fully closed instruction-style Unicode variants.

## Q3 Progress

### Q3-A - `sanitizeRecoveredPayload()` does not feed into a content-aware Zod validator

The nearest Zod boundary is the hook-state container, not the sanitized payload content itself:

- `PendingCompactPrimeSchema.payload` is only `z.string()` with no content constraint (`hook-state.ts:48-53`).
- `HookStateSchema.pendingCompactPrime` simply nests that object (`hook-state.ts:55-73`).

I did **not** find a downstream `safeParse()` / `parse()` that re-validates `sanitizedPayload` or `wrappedPayload` semantically before output. The consumers instead sanitize, wrap, and emit:

- Claude SessionStart: `sanitizeRecoveredPayload(payload)` for logging, `wrapRecoveredCompactPayload(payload, ...)`, then `sections[{ title: 'Recovered Context (Post-Compaction)', content: wrappedPayload }]` (`session-prime.ts:67-76`).
- Gemini BeforeAgent: `sanitizeRecoveredPayload(payload)`, then `wrapRecoveredCompactPayload(sanitizedPayload, ...)`, then append that text block to the agent prompt (`compact-inject.ts:52-60`).

### Q3-B - Unexpected pass/fail shape

Because there is no content-aware schema after sanitization:

- **Unexpected pass:** any line that survives `sanitizeRecoveredPayload()` remains opaque prompt text and flows through even if it is instruction-shaped by human reading, as shown by `ignοre previous`.
- **Unexpected fail:** if sanitization strips every line, the wrapper still emits a valid `[SOURCE: ...] ... [/SOURCE]` block with an empty body. There is no nearby Zod guard that rejects the empty sanitized content because validation occurs on the pre-sanitized cached payload container, not on the emitted text.

### Q3 status

Partial answer: the downstream contract is weaker than the question framing implied. This is mostly **not** a "sanitize then Zod catches it" pipeline. It is a "sanitize, then ship opaque text" pipeline, with only coarse hook-state object validation upstream.

## Next Focus

1. Expand the direct shared-provenance bypass corpus beyond Greek omicron: test other unmapped Greek letters and mixed-script instruction strings against the strip patterns.
2. Trace whether any later hook or transcript-recovery surface re-parses wrapped recovered payload as structured data, or whether it remains opaque text end to end.
3. Start Q4 round-trip work by checking whether compact-cache serialization / recovery changes these Unicode payloads across write-read cycles on the current runtime.
