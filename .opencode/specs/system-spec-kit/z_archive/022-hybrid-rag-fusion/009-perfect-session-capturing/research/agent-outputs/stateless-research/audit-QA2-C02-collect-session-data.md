## Audit QA2-C02: collect-session-data.ts — Copilot Cross-Validation
### P0 Blockers: 1 — collect-session-data.ts identity/backfill corruption in stateless nested-spec runs
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:627-665,721-724,733-735,791-795` — `folderName` is taken directly from the CLI/detected spec path and later backfilled into `collectedData.SPEC_FOLDER` without reducing it to the leaf spec slug. In the spec 013 stateless path, that value can be a nested path such as `system-spec-kit/022-hybrid-rag-fusion/013-improve-stateless-mode`; the collector then feeds that raw path into anchor generation before normalization and also returns it as `TITLE`/`SPEC_FOLDER`. Result: anchors fall back to spec `000`, titles become path-shaped strings, and downstream extractors consume the wrong spec identity.

### P1 Required: 1 — collect-session-data.ts defaults that overwrite valid sparse payload values
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:580,592-595` — `recentContext?.[0]?.continuationCount || 1` treats a valid `0` as missing and rewrites it to `1`, which also shifts `NEXT_CONTINUATION_COUNT` to `2`. This is a real data-loss/default-safety bug for first-run or explicitly reset continuation metadata in stateless payloads; `?? 1` is needed here.

### P2 Suggestions: 2 — collect-session-data.ts safe-fallback tightening
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:582-585` — `LAST_ACTIVITY_TIMESTAMP` falls back to `new Date().toISOString()` whenever the last prompt is missing. For sparse stateless captures, that silently fabricates recency instead of surfacing "unknown" or deriving from other timestamps, which can mislead downstream ranking/debugging.
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:697-699` — `SUMMARY` ultimately defaults to `'Session focused on implementing and testing features.'` when sparse payloads lack `recentContext.learning` and narrative text. That default is too opinionated for a primary collector: it hides extraction gaps and injects an implementation bias into naming/retrieval instead of preserving an explicit "summary unavailable" state.

### Score: 72
