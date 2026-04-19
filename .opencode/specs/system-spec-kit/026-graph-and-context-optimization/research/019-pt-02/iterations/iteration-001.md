# Iteration 001

## Focus

Read the three sanitizer surfaces in current main, map their real normalization paths, and start Q1/Q2 with runtime-verified Node.js `NFKC` behavior.

## Actions

1. Read the phase config and strategy to anchor scope and stop conditions.
2. Read `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`.
3. Traced the immediate downstream consumers for recovered-payload sanitization and trigger-phrase sanitization.
4. Probed the live runtime with local `node` to capture actual `NFKC` outcomes for representative character classes under Node `v25.6.1`, ICU `78.2`, Unicode `17.0`.

## Initial NFKC Call-Site Map

| Surface | Current normalization path | Downstream filter / validation chain | Initial risk note |
| --- | --- | --- | --- |
| Gate 3 classifier | `normalizePrompt()` calls `foldUnicodeConfusablesToAscii()` then lowercases, collapses whitespace, and tokenizes. `foldUnicodeConfusablesToAscii()` applies `NFKC`, strips `[\u00AD\u200B-\u200F\uFEFF]`, then `NFD` + combining-mark strip + explicit Cyrillic/Greek confusable folding. Evidence: `shared/gate-3-classifier.ts:148-157`, `hooks/shared-provenance.ts:33-82`. | `classifyPrompt()` evaluates memory-save, resume, file-write, and read-only vocab matches over the ASCII-folded token stream. Evidence: `shared/gate-3-classifier.ts:186-239`. | Strongest normalization of the three surfaces. It covers compatibility forms plus a curated confusable table, but only for the Gate 3 routing problem. |
| Recovered payload sanitizer | `sanitizeRecoveredPayload()` splits per line, runs `normalizeRecoveredPayloadLine()` (`NFKC` + hidden-char strip), then runs regex stripping against `normalizeRecoveredPayloadLineForMatching()` (`NFKC` + hidden-char strip + `NFD` + combining-mark strip + explicit confusable folding). Evidence: `hooks/shared-provenance.ts:66-96`. | Sanitized payload is wrapped and injected into Claude/Gemini/Copilot recovery surfaces. Immediate consumers are `session-prime` and `compact-inject`, not a nearby Zod gate. Evidence: `mcp_server/hooks/claude/session-prime.ts:67-79`, `mcp_server/hooks/gemini/compact-inject.ts:52-61`. | Similar normalization strength to Gate 3 for line-prefix stripping, but the current iteration has not yet traced the later contract/schema boundary where sanitized content becomes structured state again. |
| Trigger phrase sanitizer | `normalizeUnicodeForm()` uses `NFC`, not `NFKC`. `normalizePhrase()` trims, lowercases, and collapses spaces; no hidden-char strip, no compatibility folding, no confusable folding. Evidence: `scripts/lib/trigger-phrase-sanitizer.ts:110-120`. | `sanitizeTriggerPhrase()` applies contamination, path, suspicious-prefix, synthetic-bigram, and stopword filters; consumers include semantic extraction, fallback trigger generation, and post-save review counts. Evidence: `scripts/lib/trigger-phrase-sanitizer.ts:126-183`, `scripts/lib/semantic-signal-extractor.ts:300-322`, `scripts/core/frontmatter-editor.ts:141-167`, `scripts/core/post-save-review.ts:428-447`. | This is currently the weakest surface. The strategy file assumes phase 016 added NFKC here, but current main still uses `NFC`, creating a normalization asymmetry with the other two surfaces. |

## Q1 Partial Draft

### Runtime baseline

- Local runtime is Node `v25.6.1` with ICU `78.2` and Unicode `17.0`.
- This matters because the research question is specifically about the behavior of the current repo runtime, not a generic Unicode table.

### Character classes confirmed to collapse under `NFKC` in the live runtime

| Class | Example | Observed `NFKC` result |
| --- | --- | --- |
| Fullwidth Latin | `Ａ`, `ｓｙｓｔｅｍ ｐｒｏｍｐｔ` | `A`, `system prompt` |
| Ligatures | `ﬀ` | `ff` |
| Mathematical alphanumerics | `𝐀`, `𝐢𝐠𝐧𝐨𝐫𝐞 𝐩𝐫𝐞𝐯𝐢𝐨𝐮𝐬` | `A`, `ignore previous` |
| Enclosed / circled forms | `①` | `1` |
| Roman numerals | `Ⅳ` | `IV` |
| Superscripts | `⁵` | `5` |
| Halfwidth Katakana | `ｶﾞ` | `ガ` |
| Compatibility ideographs / enclosed CJK | `㈱` | `(株)` |

### Classes that did not collapse to plain ASCII under `NFKC` alone

| Class | Example | Observed `NFKC` result | Why it matters |
| --- | --- | --- | --- |
| Zero-width / format chars | `fi\u200Ble` | unchanged | `NFKC` alone does not remove them; only Gate 3 / shared-provenance strip them explicitly. |
| Soft hyphen | `fi\u00ADle` | unchanged | Same issue: survives `NFKC`; downstream behavior depends on explicit stripping, not normalization. |
| Cyrillic/Latin lookalikes | `syst\u0435m` | unchanged | Requires the extra confusable map in `foldUnicodeConfusablesToAscii()`. |
| Greek/Latin lookalikes | `syst\u03B5m` | unchanged | Same. `NFKC` is insufficient by itself. |

### Partial answer status

Q1 is partially answered: the current runtime collapses compatibility forms aggressively, but practical attack analysis must treat three buckets separately:

1. Compatibility forms that `NFKC` collapses on its own.
2. Hidden / format characters that survive `NFKC` and only disappear where code explicitly strips them.
3. Cross-script lookalikes that survive `NFKC` and only collapse because this repo adds an explicit confusable table.

## Q2 Bypass Hypothesis

No end-to-end P0 exploit is proven yet, but current main suggests several realistic bypass drafts against `trigger-phrase-sanitizer` because it only applies `NFC`.

### H1: Fullwidth compatibility-form contamination bypass

- Draft phrase: `ｓｙｓｔｅｍ ｐｒｏｍｐｔ` or `ｉｇｎｏｒｅ ｐｒｅｖｉｏｕｓ`
- Why it likely bypasses today:
  - `sanitizeTriggerPhrase()` normalizes with `NFC`, so the phrase remains fullwidth.
  - `CONTAMINATION_PATTERN` only looks for ASCII `system prompt` / `ignore previous`.
  - Any later surface that applies `NFKC` would recover the dangerous ASCII phrase.

### H2: Mathematical-alphanumeric contamination bypass

- Draft phrase: `𝐢𝐠𝐧𝐨𝐫𝐞 𝐩𝐫𝐞𝐯𝐢𝐨𝐮𝐬`
- Why it likely bypasses today:
  - `NFC` preserves mathematical styled letters.
  - The contamination regex therefore never sees the ASCII string.
  - Live runtime confirmed `NFKC` collapses it to `ignore previous`.

### H3: Suspicious-prefix bypass via compatibility digits

- Draft phrase: `phase ① cocoindex` or `f２１ arithmetic inconsistency`
- Why it likely bypasses today:
  - `SUSPICIOUS_PREFIX_PATTERN` requires ASCII digits (`\\d+`).
  - `NFC` preserves circled/fullwidth digits, so the prefix likely escapes.
  - Live runtime confirmed `NFKC` would later collapse `① -> 1` and `２ -> 2`.

### H4: Hidden-character bypass that survives `NFKC`

- Draft phrase: `ignore\u200B previous` or `sys\u00ADtem prompt`
- Why it matters:
  - Local runtime confirmed zero-width space and soft hyphen survive `NFKC`.
  - `trigger-phrase-sanitizer` does not strip them.
  - Gate 3 / shared-provenance do strip them, so the repo already acknowledges these code points as risky elsewhere.
  - This creates a surface mismatch: phrases can be accepted into trigger-phrase flows in a form later surfaces would interpret differently.

## Next Focus

1. Trace the exact producer/consumer path where trigger phrases and recovered compact payloads hit Zod or other schema validation boundaries.
2. Convert the Q2 hypotheses above into repo-local proof cases against existing tests.
3. Start Q3 by mapping whether sanitized recovered payload can still inject unintended structured content after wrapping, parsing, or repair.
