---
title: "Iteration 024 — Thin continuity schema validation rules"
iteration: 24
band: A
timestamp: 2026-04-11T16:48:00Z
worker: codex-gpt-5.4
scope: q3_continuity_validation
status: complete
focus: "Define field-level validation rules for _memory.continuity, including 2KB budget enforcement, prose rejection, and legacy degradation behavior."
maps_to_questions: [Q3, Q7]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-024.md"]

---
# Iteration 024 — Q3 + Q7: Thin Continuity Validation Rules
## Goal
Turn the thin continuity schema from iterations 4 and 5 into an implementation-grade validator contract that is strict enough to preserve the "compact wrapper" boundary, but tolerant enough to hydrate legacy docs safely.

## Validation posture
- Validate after merge planning but before any file write.
- Normalize first, then validate field shape, then validate cross-field coherence, then measure byte size.
- Treat `_memory.continuity` as a bounded status record, not a narrative surface.
- Fail closed on malformed new writes.
- Degrade gracefully on legacy reads and first-touch backfills.

## Validation order
1. Parse YAML and isolate `_memory.continuity`.
2. Normalize key order, whitespace, and empty optionals.
3. Apply field validators below.
4. Apply cross-field rules.
5. Serialize the exact persisted YAML fragment.
6. Measure UTF-8 byte length.
7. Abort the save if the normalized block still exceeds 2048 bytes.

## Field rules
### Core fields
| Field | Type | Req | Validation rule | Default | Error | Edge cases |
|---|---|---|---|---|---|---|
| `packet_pointer` | `string` | yes | Relative packet path only; regex `^[a-z0-9._-]+(?:/[a-z0-9._-]+)+/?$`; reject absolute paths, `..`, backslashes, padding | derive from spec-folder in legacy mode | `MEMORY_003` | strip leading `.opencode/`; trailing slash removed |
| `last_updated_at` | `string` | yes | Parseable ISO-8601, then normalize to `YYYY-MM-DDTHH:MM:SSZ` | current save timestamp; legacy may use file mtime | `MEMORY_004` | offsets may normalize to `Z`; impossible dates fail |
| `last_updated_by` | `string` | yes | Actor slug only; regex `^[a-z0-9][a-z0-9._-]{1,63}$` | `legacy-backfill` during migration | `MEMORY_005` | trim outer whitespace; lowercase only if lossless |
| `recent_action` | `string` | yes | 1-96 chars, single line, max 16 tokens, no markdown/code/list markers, no URLs, max one sentence terminator | `Legacy continuity imported` in legacy hydration only | `MEMORY_006` | `Completed iteration 24 validation design` passes; multi-sentence prose fails |
| `next_safe_action` | `string` | yes | 1-96 chars, single line, max 16 tokens, imperative or status-verb phrase, no markdown/code/list markers | `Refresh continuity on next save` in legacy hydration only | `MEMORY_007` | `Inspect findings/validation-contract.md` passes; rationale clauses fail |
| `blockers` | `string[]` | no | Max 5 unique items; each item 1-72 chars, single line, max 10 tokens, no embedded bullets/headings | `[]` | `MEMORY_008` | `["none"]`, `["n/a"]`, blanks normalize to `[]` |
| `key_files` | `string[]` | no | Max 5 unique repo-relative paths; 1-160 chars; reject absolute paths, `..`, backslashes, empty segments | `[]` | `MEMORY_009` | repeated slashes normalize; missing path warns in migration, errors on new write |

### Session and progress fields
| Field | Type | Req | Validation rule | Default | Error | Edge cases |
|---|---|---|---|---|---|---|
| `session_dedup` | `object` | no | If present, must contain `fingerprint` and `session_id`; `parent_session_id` optional | omitted | `MEMORY_010` | empty object normalizes to omitted only in legacy mode |
| `session_dedup.fingerprint` | `string` | conditional | Regex `^sha256:[a-f0-9]{64}$` | omitted; legacy may synthesize from normalized payload | `MEMORY_011` | bare 64-char hex may auto-upgrade only in legacy mode |
| `session_dedup.session_id` | `string` | conditional | Regex `^[A-Za-z0-9][A-Za-z0-9._:-]{2,63}$` | omitted; legacy may borrow current session id | `MEMORY_012` | trim outer whitespace; reject embedded spaces |
| `session_dedup.parent_session_id` | `string \| null` | no | Null or same pattern as `session_id` | `null` | `MEMORY_013` | equal to `session_id` normalizes to `null` only in legacy mode |
| `completion_pct` | `integer` | no | Integer only, range `0..100` | `0` for new blocks; preserve omission on legacy reads when unknown | `MEMORY_014` | floats reject; strict mode ties `100` to no open blockers/questions |
| `open_questions` | `string[]` | no | Max 12 unique items; each item matches `^Q[1-9][0-9]*$` | `[]` | `MEMORY_015` | sort numerically; reject free-text labels |
| `answered_questions` | `string[]` | no | Max 12 unique items; each item matches `^Q[1-9][0-9]*$` | `[]` | `MEMORY_016` | sort numerically; overlap with `open_questions` is a hard coherence failure |

## Cross-field rules
- `open_questions` and `answered_questions` must be disjoint; overlap fails with `MEMORY_016`.
- `session_dedup.parent_session_id` may not exist without `session_dedup.session_id`; failure maps to `MEMORY_010`.
- `completion_pct = 100` with non-empty `open_questions` or `blockers` should fail strict mode with `MEMORY_014`.
- `key_files` should contain at least one path when `recent_action` mentions writing, validating, or reviewing a file-backed artifact; otherwise warn, do not block.

## Size budget enforcement
- Budget target: `_memory.continuity` serialized YAML fragment must be `<= 2048` UTF-8 bytes.
- Measurement unit: `Buffer.byteLength(serializedContinuityYaml, "utf8")`.
- Measure the exact persisted fragment, not the in-memory object and not a minified JSON proxy.
- Run one deterministic compaction pass before failing:
- Strip empty optional fields.
- Dedupe and sort arrays.
- Trim strings to their field max.
- Reduce `key_files` and `blockers` to their newest 3 entries if they exceed the soft cap after normalization.
- If the fragment still exceeds 2048 bytes, abort the save before file write with `MEMORY_017`.
- `MEMORY_017` should report actual byte size plus the three heaviest fields to make remediation obvious.
- No silent second-pass truncation beyond the deterministic caps above.

## Nested narrative detection
- Narrative detection is needed mainly for `recent_action`, `next_safe_action`, and `blockers[]`.
- Reject text containing `\n`, markdown headings, block quotes, code fences, numbered-list prefixes, or bullet-list prefixes.
- Reject text longer than the field cap or above the token caps defined above.
- Reject text with two or more sentence terminators or with discourse markers that imply narrative explanation:
- `because`
- `so that`
- `which means`
- `the reason`
- `details`
- `summary`
- A practical helper is `looksNarrative(text)` that combines regex checks plus token count.
- `recent_action: "Completed iteration 24 validation design"` passes.
- `recent_action: "Completed iteration 24 validation design. This clarified why legacy blocks should auto-hydrate."` fails with `MEMORY_006`.

## Graceful degradation for legacy blocks
- Legacy mode should run before strict validation and may synthesize missing sub-fields.
- Missing `packet_pointer` derives from the target spec-folder path.
- Missing `last_updated_at` derives from file mtime.
- Missing `last_updated_by` becomes `legacy-backfill`.
- Missing `recent_action` becomes `Legacy continuity imported`.
- Missing `next_safe_action` becomes `Refresh continuity on next save`.
- Missing optional arrays become empty arrays.
- Missing `session_dedup` stays omitted unless a current session is actively saving.
- Bare legacy fingerprint hashes may upgrade to `sha256:` form if length and charset match exactly.
- Unknown extra keys should warn and be preserved during read-only migration analysis, but stripped on the next canonical write.
- If a legacy block cannot be normalized into a valid post-write shape, fail the save rather than persisting ambiguous continuity.

## Error code summary
| Code | Meaning |
|---|---|
| `MEMORY_003` | invalid `packet_pointer` |
| `MEMORY_004` | invalid `last_updated_at` |
| `MEMORY_005` | invalid `last_updated_by` |
| `MEMORY_006` | invalid or narrative `recent_action` |
| `MEMORY_007` | invalid or narrative `next_safe_action` |
| `MEMORY_008` | invalid `blockers` payload |
| `MEMORY_009` | invalid `key_files` payload |
| `MEMORY_010` | malformed `session_dedup` object |
| `MEMORY_011` | invalid dedup fingerprint |
| `MEMORY_012` | invalid dedup session id |
| `MEMORY_013` | invalid parent session id |
| `MEMORY_014` | invalid `completion_pct` or completion coherence |
| `MEMORY_015` | invalid `open_questions` payload |
| `MEMORY_016` | invalid `answered_questions` payload or question-set overlap |
| `MEMORY_017` | continuity block exceeds 2KB after normalization |

## Findings
- **F24.1**: Field-level caps are enough to keep the thin continuity block operationally small without inventing a second storage layer.
- **F24.2**: The 2KB rule should fail only after normalization and exact YAML byte measurement; otherwise enforcement will be noisy and non-deterministic.
- **F24.3**: Narrative rejection needs explicit heuristics, not just character limits, because a one-line paragraph can still violate the thin-wrapper contract.
- **F24.4**: Legacy compatibility should synthesize missing required fields on read or first-touch upgrade, but fresh writes must still fail closed on malformed continuity.
- **F24.5**: `MEMORY_017` is the key guardrail that prevents `_memory.continuity` from turning back into the heavyweight narrative problem phase 018 is trying to remove.
