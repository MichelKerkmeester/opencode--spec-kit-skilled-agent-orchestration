# Iteration 004 — A4: Silent error recovery patterns

## Focus
Audited broad `try/catch` recovery in `skill_advisor/lib` and `code_graph/lib`, looking specifically for catches that convert corruption or failed storage reads into ordinary fallback behavior without diagnostics.

## Actions Taken
- Ran `rg -n "\btry\b|\bcatch\b"` across `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib`.
- Reviewed catch contexts in advisor projection, freshness, generation counters, daemon watcher, subprocess, metrics, and JSON guard helpers.
- Reviewed catch contexts in code graph database, context builder, readiness, startup brief, structural indexer, parser, runtime detection, verifier, phase runner, seed resolver, and workspace path helpers.
- Traced concerning sites to their callers where needed: `scoreAdvisorPrompt()`, `buildContext()`, `ensureCodeGraphReady()`, `buildGraphOutline()`, and `discoverWatchTargets()`.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-004-A4-01 | P1 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:237-240 | `loadAdvisorProjection()` catches any SQLite projection failure and silently returns `loadFilesystemProjection()`. That hides malformed SQLite, schema drift, and row-shape failures from `scoreAdvisorPrompt()`, while losing graph edge data and changing routing behavior without a diagnostic. Freshness only fingerprints artifact presence/signature; it does not prove the projection was read successfully. | Catch only the expected absent-DB case, or return/emit a diagnostic when SQLite exists but fails. Prefer wiring `checkSqliteIntegrity()` / rebuild diagnostics into this path, or make the advisor fail-open with an explicit unavailable/stale reason instead of silently using filesystem mode. |
| F-004-A4-02 | P2 | .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:501-526 | `resolveSubjectToRef()` swallows all DB errors as “DB not available” and returns `null`; `buildContext()` then emits the ordinary empty-anchor fallback. A corrupt or locked graph DB can therefore look like an unresolved subject and tell the operator to scan/provide seeds rather than surfacing storage failure. | Return a typed resolution failure or include an unavailable/error reason in `ContextResult.metadata`, at least when `graphDb.getDb()` or the query throws. |
| F-004-A4-03 | P2 | .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:253-296 | `getLastDetectorProvenanceSummary()`, `getLastGraphEdgeEnrichmentSummary()`, and `getLastGoldVerification()` all convert malformed metadata JSON to `null`. This is tolerable for optional display fields, but `getLastGoldVerification()` feeds `ensureCodeGraphReady()`'s `verificationGate`; a corrupt stored verification record becomes indistinguishable from an absent gate. | Split optional quality summaries from verification-gate state. For `last_gold_verification`, return a corrupt/error state or clear it through an explicit repair path instead of reporting absence. |
| F-004-A4-04 | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:155-172 | `parseDerivedKeyFiles()` catches malformed `graph-metadata.json` and returns `[]`, so `discoverWatchTargets()` still watches the metadata file but silently drops all derived key-file watch targets. Changes to those key files can stop triggering advisor reindex until another watched file changes. | Record a watcher diagnostic or quarantine malformed metadata similarly to malformed `SKILL.md`; do not silently treat corrupt metadata as “no derived key files.” |

## Questions Answered
- Which catch-and-recover blocks in the requested directories can hide corrupt or malformed persisted state?
- Which catch blocks are legitimate? Most parser/readiness paths either attach parse errors, return typed unavailable/error state, log warnings, retry busy SQLite, or perform best-effort cleanup where the original error remains authoritative.
- Does the earlier sa-004 pattern recur? Yes, but in narrower forms: silent projection fallback, subject-resolution fallback, metadata JSON nulling, and watcher target omission.

## Questions Remaining
- Whether `loadAdvisorProjection()` should hard-fail when SQLite exists but is unreadable, or should run a rebuild and expose stale/unavailable advisor freshness.
- Whether code-graph metadata tables need a common typed JSON parser that distinguishes absent, malformed, and invalid-shape values.
- Whether watcher diagnostics should be operator-visible through the advisor status surface or only daemon logs/state.

## Next Focus
Follow-on iteration should inspect persisted metadata validation boundaries: code-graph metadata writes, advisor `graph-metadata.json` readers, and any status surfaces that collapse `corrupt` into `absent`.
