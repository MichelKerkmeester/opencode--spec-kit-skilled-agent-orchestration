# Iteration 4 — Maintainability

## Dimension

D4 Maintainability: daemon lifecycle pattern consistency, scorer fusion change surface, compatibility shim contract clarity, MCP response shape coherence, plugin bridge boundaries, fixture reuse, ADR coverage, and phase-merge artifact hygiene.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/daemon-probe.vitest.ts`
- `decision-record.md`

## Findings — P0

None.

## Findings — P1

None.

## Findings — P2

### DR-008-D4-P2-001 — Daemon watcher has one retry boundary, but adjacent SQLite mutation paths bypass it

The daemon package has a named busy-retry helper, but only the main `reindexSkill()` call uses it. Quarantine mutations and quarantine status reads open the same daemon state database directly. That means future mutation paths have to know by convention which SQLite writes deserve retry/lease protection.

Evidence:

- `withBusyRetry()` is defined as the SQLite busy boundary in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:111`.
- Quarantine writes and reads open/close SQLite directly in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:239`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:256`, and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:269`.
- The retry helper is applied only around `reindexSkill()` in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:407`.
- Tests assert retry behavior for `reindexSkill()` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:187`, while quarantine behavior is tested separately without busy contention at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:215`.

Concrete fix:

Extract a small daemon-state DB mutation helper that owns busy retry and use it for quarantine insert, recover, count, and any later daemon-state writes.

### DR-008-D4-P2-002 — Adding a scorer lane requires edits across too many hand-maintained lists

The scorer has useful lane modules, but the lane registry is not yet a single descriptor table. Adding or renaming a lane requires synchronized edits in type unions, score containers, imports, build order, weights, schema enums, docs, and status exposure.

Evidence:

- `ScorerLane` and `LaneScores` hard-code all lanes in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:7` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:58`.
- `emptyLaneScores()` repeats the same lane keys in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:53`.
- `buildLaneScores()` imports and invokes each lane directly in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:14` through `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:18` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:153`.
- Weights and lane order are separate constants in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:8` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:22`.
- Public schemas duplicate the lane enum in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:8`.

Concrete fix:

Move lane id, weight, scorer function, live/shadow policy, and public-schema metadata into one typed lane descriptor registry, then derive `SCORER_LANES`, empty scores, schema enum input, and fusion execution order from it.

### DR-008-D4-P2-003 — Native/Python/plugin compat contracts are duplicated instead of generated from one adapter contract

The README documents the broad boundary, but the executable contract is spread across TypeScript, an inline JavaScript string embedded in Python, and the OpenCode bridge. This makes a future runtime adapter likely to copy field shapes by inspection rather than implement one stable contract.

Evidence:

- The TS daemon probe exposes `available`, `freshness`, `trustState`, `generation`, optional `daemonPid`, and `reason` in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts:16`.
- The Python shim embeds a separate Node bridge string that recreates `unavailable()`, `probe()`, and the status/recommend output envelope in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:91`.
- The OpenCode plugin bridge defines its own status vocabulary and response envelope in `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:5` and `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:11`.
- Plugin-side parsing repeats the expected bridge fields in `.opencode/plugins/spec-kit-skill-advisor.js:215`.
- Docs describe the entrypoint and current runtimes at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md:153`, but they do not give a machine-readable adapter schema for Codex/Gemini/next-runtime implementers.

Concrete fix:

Add a shared compat adapter schema or fixture-driven contract test that covers `probe`, `recommend`, `disabled`, `forceNative`, and `forceLocal`, then make Python and plugin bridge tests consume the same contract fixture.

### DR-008-D4-P2-004 — Skill-graph MCP handlers still hand-roll response envelopes while advisor handlers use schemas

The advisor handler side has Zod output schemas and parsed public contracts. The skill-graph handler side repeats local `HandlerResponse`, `okResponse()`, and `errorResponse()` helpers per file, with no canonical `SkillGraphResponse` schema. That raises the cost of making response shape, redaction, and error policy consistent after the active security findings are fixed.

Evidence:

- Advisor outputs are schema-defined in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:60` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:91`.
- `advisor_recommend` parses the output before returning it in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:221`.
- `skill_graph_query` defines local envelope helpers in `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:37`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:206`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:215`.
- `skill_graph_scan` repeats its own envelope helpers in `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:19`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:65`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:74`.
- `skill_graph_status` repeats them again in `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:25`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:216`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:225`.

Concrete fix:

Create a shared MCP response helper plus `SkillGraphQuery/Scan/Status` schemas, then route all skill-graph handlers through the same sanitizer and envelope parser used by tests.

### DR-008-D4-P2-005 — Skill-graph SQLite fixtures are duplicated across advisor and server test roots

The test suite has some shared fixtures, but the skill-graph SQLite setup is copied between at least two suites. That makes future schema or metadata fixture changes easy to update in one test root and miss in the other.

Evidence:

- Advisor DB tests define `writeGraphMetadata()` locally in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:11`.
- Skill-graph handler tests define another local `writeGraphMetadata()` with the same shape in `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:11`.
- The advisor test tree has a lifecycle fixture helper in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/fixtures/lifecycle/index.ts:9`, but no equivalent shared SQLite skill-graph helper for these suites.
- `rg` found two local skill-graph metadata writers in the reviewed roots, both paired with direct `mkdtempSync()` and `initDb()` setup.

Concrete fix:

Add `mcp_server/tests/fixtures/skill-graph-db.ts` or `skill_advisor/tests/fixtures/skill-graph/index.ts` with `createSkillGraphWorkspace()`, `writeGraphMetadata()`, and cleanup helpers, then migrate both suites to it.

### DR-008-D4-P2-006 — The decision record collapses seven architectural sub-tracks into one ADR

This packet has seven substantial architectural tracks, but the decision record has a single ADR. That is enough for a high-level summary, but not enough for maintainers who need to understand why freshness, schema migration, native scoring, MCP public surfaces, compat shims, and promotion gates each took their current shape.

Evidence:

- `implementation-summary.md` lists seven shipped children in dependency order at `implementation-summary.md:70` through `implementation-summary.md:76`.
- `decision-record.md` contains only `ADR-001: Unified Advisor Architecture` at `decision-record.md:27`.
- That ADR packs freshness, derived metadata, native scoring, MCP tools, compatibility shims, and promotion gates into one context sentence at `decision-record.md:35`.
- Its implementation notes compress Chokidar, lease, five-lane fusion, schema migration, and Python parity into five bullets at `decision-record.md:57`.

Concrete fix:

Keep ADR-001 as the umbrella, then add child ADRs for daemon freshness/lease, derived metadata/schema migration, native scorer fusion, MCP public surface and authority, compat shims, and promotion gates.

## Traceability Checks

| Check | Status | Notes |
| --- | --- | --- |
| M1 daemon lease/retry consistency | partial | Main reindex path uses `withBusyRetry`; quarantine DB mutations bypass the same helper. |
| M2 scorer fusion clarity | partial | Lane modules are clear, but lane addition requires scattered edits across types, weights, fusion, schema, and docs. |
| M3 compat shim clarity | partial | README documents the intent; executable field contracts are duplicated across TS, Python inline JS, plugin bridge, and plugin parser. |
| M4 MCP tool surface coherence | partial | Advisor tools have schemas; skill-graph handlers hand-roll response envelopes. |
| M5 plugin bridge architecture | pass | README names OpenCode as plugin plus bridge and points consumers at `dist/skill_advisor/compat/index.js`; bridge uses that stable compat entrypoint. |
| M6 test fixture consistency | partial | Some shared fixtures exist, but SQLite skill-graph setup is duplicated between advisor and server test roots. |
| M7 ADR coverage | fail | Seven sub-tracks are collapsed into one umbrella ADR. |
| M8 phase-merge artifact hygiene | partial | No orphaned import was proven in this pass; path drift remains a prior finding and one plugin source-signature path uses the already-known hyphen form. |

Summary: required=8, executed=8, pass=1, partial=6, fail=1, blocked=0, notApplicable=0, gatingFailures=0.

## Claim Adjudication Packets

### DR-008-D4-P2-001

- Claim: The daemon lifecycle has one consistent lease/busy-retry pattern for mutation paths.
- Evidence for claim: `withBusyRetry()` exists and protects `reindexSkill()`.
- Counter-evidence: Quarantine insert/recover/count write or read the daemon SQLite state directly.
- Adjudication: partial. P2 maintainability finding; not a new correctness blocker.

### DR-008-D4-P2-002

- Claim: The scorer fusion architecture is easy to extend with another lane.
- Evidence for claim: Scorer lanes are split into individual modules and lane order exists in `SCORER_LANES`.
- Counter-evidence: Lane ids are repeated across `types.ts`, `fusion.ts`, `weights-config.ts`, and public schemas.
- Adjudication: partial. P2 maintainability finding.

### DR-008-D4-P2-003

- Claim: Future runtime adapters can implement the advisor by following a clear contract.
- Evidence for claim: README documents the compatibility intent and stable compiled entrypoint.
- Counter-evidence: TS daemon probe, Python inline bridge, OpenCode bridge, and plugin parser all define compatible but separate field shapes.
- Adjudication: partial. P2 maintainability finding.

### DR-008-D4-P2-004

- Claim: MCP handler response shapes are coherent across advisor and skill-graph surfaces.
- Evidence for claim: Both families return JSON text with `status` and data/error.
- Counter-evidence: Advisor handlers use Zod schemas; skill-graph handlers duplicate untyped envelope helpers per file.
- Adjudication: partial. P2 maintainability finding.

### DR-008-D4-P2-005

- Claim: 008/008 test fixtures share SQLite skill-graph setup helpers.
- Evidence for claim: The advisor tree has a fixtures folder and some shared lifecycle data.
- Counter-evidence: Skill-graph DB and handler tests each define their own `writeGraphMetadata()` and temp DB setup.
- Adjudication: partial. P2 maintainability finding.

### DR-008-D4-P2-006

- Claim: Major architectural choices are ADR-covered.
- Evidence for claim: ADR-001 records the umbrella architecture.
- Counter-evidence: Seven shipped sub-tracks are collapsed into one ADR section.
- Adjudication: partial. P2 maintainability finding.

## Verdict

CONDITIONAL.

Cumulative findings after iteration 4: P0=0, P1=3, P2=15. No new maintainability-class blocker was found. The loop is still conditional because the three prior P1s remain active.

## Next Dimension

STOP candidate — all 4 dimensions covered.
