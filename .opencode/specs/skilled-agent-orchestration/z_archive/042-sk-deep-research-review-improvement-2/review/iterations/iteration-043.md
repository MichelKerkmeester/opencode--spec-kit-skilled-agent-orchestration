---
iteration: 43
dimension: correctness
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T17:55:32Z
completedAt: 2026-04-12T18:03:02Z
---

# Deep Review Iteration 043 — correctness (Round 3)

**Focus:** CONTRACT: Verify the coverage-graph DB schema and migration path. Check coverage-graph-db.ts for v2 composite primary keys, drop-and-recreate migration safety, and that the documented schema matches the actual CREATE TABLE statements.

---

● skill(sk-deep-review)

● Search (glob)
  │ "**/coverage-graph-db.ts"
  └ 1 file found

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 43 correctness audi…
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (grep)
  │ "coverage-graph|deep_loop_graph|deep-loop graph|coverage graph" in **/*.{md,json,yaml,yml,ts,js}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

I’ve narrowed this to the schema source plus the 042 docs and tests that describe or exercise it. Next I’m checking whether the migration behavior and documented contract actually match the SQL the runtime creates.

● Read coverage-graph-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
  └ 1 line read

● Search (grep)
  │ "composite primary key|PRIMARY
  │ KEY|schema|migration|coverage-graph-db|deep-loop-graph\.sqlite|sessionId|loopType|specFolder" in
  │ **/*.{md,json,yaml,yml,ts,js}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Search (grep)
  │ "coverage-graph-db|deep_loop_graph|deep-loop
  │ graph|coverage_graph|graph_upsert|graph_query|graph_convergence" in
  │ **/*.{ts,js,md,json,yml,yaml} (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/README.md
  └ 24 lines read

● Search (grep)
  │ "CREATE TABLE|PRIMARY KEY|schema_version|migration|DROP TABLE|ALTER
  │ TABLE|specFolder|loopType|sessionId|namespace|version"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts)
  └ 7 lines found

● Search (grep)
  │ "coverage-graph-db|coverage graph|composite|primary key|schema|migration|deep-loop-graph.sqlite"
  │ in **/*.{md,yml,yaml,json,ts,js}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

The schema file is the key source of truth here; I’m pulling its setup and migration sections directly, then I’ll cross-check them against the 042 docs and any coverage-graph tests.

● Read coverage-graph-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
  └ L1:260 (260 lines read)

● Search (glob)
  │ "**/*coverage*graph*.{ts,js,md}" in .opencode/skill/system-spec-kit
  └ 12 files found

● Search (grep)
  │ "coverage-graph-db\.ts|composite primary
  │ key|drop-and-recreate|deep-loop-graph\.sqlite|schemaVersion|schema version|PRIMARY KEY" in
  │ **/*.{md,yml,yaml,json,ts,js}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 5 lines found

● Read coverage-graph-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
  └ L261:520 (260 lines read)

● Read coverage-graph-db.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts
  └ 237 lines read

● Search (grep)
  │ "v2|composite|drop the v1 tables|drop-and-recreate|deep-loop-graph\.sqlite|coverage_nodes|covera
  │ ge_edges|coverage_snapshots" in **/*.{md,yml,yaml,json,ts,js}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Read coverage-graph-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
  └ L521:820 (210 lines read)

● Search (grep)
  │ "coverage_nodes|coverage_edges|coverage_snapshots|schema_version|SCHEMA_VERSION|deep-loop-graph.
  │ sqlite" in **/*coverage-graph*.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ No matches found

● Search (grep)
  │ "coverage_nodes|coverage_edges|coverage_snapshots|composite primary key|drop the v1
  │ tables|REQ-028|F004" in **/*.{md,ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 82 lines found

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L35:85 (51 lines read)

● Search (grep)
  │ "coverage graph|deep-loop-graph\.sqlite|coverage_nodes|coverage_edges|coverage_snapshots|session
  │ Id|composite|primary key|drop-and-recreate|migration|REQ-028|F004" in
  │ **/{spec,plan,implementation-summary,decision-record,checklist}.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Read coverage-graph-core.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts
  └ L1:260 (257 lines read)

● Read coverage-graph-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
  └ L1:280 (279 lines read)

● Search (grep)
  │ "deep-loop-graph.sqlite|coverage_nodes|coverage_edges|coverage_snapshots|schema_version|composit
  │ e primary key|drop-and-recreate|REQ-028|REQ-029" in
  │ **/{implementation-summary,plan,spec,decision-record,checklist}.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 27 lines found

● Search (grep)
  │ "session isolation|shared-ID|composite primary key|schema
  │ version|migration|drop-and-recreate|SCHEMA_VERSION|getLatestSnapshot|getStats|coverage graph db"
  │ in **/*coverage-graph*.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ No matches found

● Search (glob)
  │ "**/*session*isolation*.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

I found one likely migration seam already: the upgrade only drops old tables when `schema_version` exists, so I’m checking whether the original v1 database always had that table. If not, the code can stamp a legacy schema as v2 without actually migrating it.

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semant
  │ ic-coverage-graph/spec.md
  └ L190:270 (81 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semant
  │ ic-coverage-graph/implementation-summary.md
  └ L38:90 (53 lines read)

● Read session-isolation.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts
  └ 472 lines read

● Show coverage graph db history (shell)
  │ git --no-pager log --follow --oneline --
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts | head -n 20
  └ 4 lines...

● Show lane 2 coverage graph db schema (shell)
  │ git --no-pager show
  │ be79ed0a0:.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts |
  │ sed -n '145,290p'
  └ 147 lines...

● Show initial coverage graph db schema (shell)
  │ git --no-pager show
  │ ffb3ecf11:.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts |
  │ sed -n '145,280p'
  └ 136 lines...

● Show initial coverage graph db header (shell)
  │ git --no-pager show
  │ ffb3ecf11:.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts |
  │ sed -n '1,144p'
  └ 145 lines...

● Read coverage-graph-query.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts
  └ L1:260 (260 lines read)

● Read status.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
  └ L1:220 (101 lines read)

● Read query.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
  └ L1:160 (160 lines read)

● Read convergence.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
  └ L1:180 (180 lines read)

● Search (grep)
  │ "function computeScopedStats|function computeScopedSignals|function
  │ computeScopedMomentum|getNodes\(|getEdges\(|getSnapshots\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts)
  └ 11 lines found

● Search (grep)
  │ "session_id = \?|spec_folder = \?|loop_type =
  │ \?|buildCompositeNodeJoin|getNodeById|getEdgesFromNode"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts)
  └ 9 lines found

● Show coverage graph db changes since v1 (shell)
  │ git --no-pager diff ffb3ecf11..HEAD --
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts | sed -n
  │ '1,220p'
  └ 221 lines...

The v1 history confirms the original schema *did* create `schema_version`, so the basic upgrade trigger isn’t dead code. I’m now checking whether the migration itself is actually exercised anywhere and whether the 042 spec was ever updated to the shipped v2 schema.

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semant
  │ ic-coverage-graph/spec.md
  └ L336:346 (11 lines read)

● Search (grep)
  │ "SCHEMA_VERSION|schema version|migrat|drop-and-recreate|shared-ID collisions|session isolation"
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/scripts/tests)
  └ 46 lines found

● Search (grep)
  │ "SCHEMA_VERSION|schema version|migrat|drop-and-recreate|shared-ID collisions|session isolation"
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 76 lines found

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semant
  │ ic-coverage-graph/spec.md
  └ L116:126 (11 lines read)

I have a stronger migration concern now: if a legacy DB reached `CREATE TABLE schema_version` but never inserted a version row, the v2 initializer skips the drop and still stamps the DB as version 2. I’m reproducing that state rather than relying on inference alone.

✗ Create legacy coverage graph db with empty schema_version row (shell)
  │ node -e "const fs=require('fs');const os=require('os');const path=require('path');const
  │ Database=require('better-sqlite3');const
  │ tmp=fs.mkdtempSync(path.join(os.tmpdir(),'covg-mig-'));const
  │ dbPath=path.join(tmp,'deep-loop-graph.sqlite');const db=new Database(dbPath);db.exec(`CREATE
  │ TABLE coverage_nodes (id TEXT PRIMARY KEY,spec_folder TEXT NOT NULL,loop_type TEXT NOT NULL …
  └ Command blocked: contains dangerous shell expansion patterns (e.g., parameter transformation,
    indirect expansion, or nested command substitution) that could enable arbitrary code execution.
    Please rewrite the command without these expansion patterns.

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ 51 lines read

● Search (glob)
  │ "**/coverage-graph-db.js" in .opencode/skill/system-spec-kit
  └ No matches found

I’ve got enough static evidence for the empty-version-row migration hole, but I’m running a tiny SQLite-only reproduction so the finding is grounded in the exact branch behavior rather than just code inspection.

● Reproduce empty-row migration behavior (shell)
  │ python3 - <<'PY'
  │ import os, sqlite3, tempfile
  │
  │ tmpdir = tempfile.mkdtemp(prefix='covg-migration-')
  │ db_path = os.path.join(tmpdir, 'deep-loop-graph.sqlite')…
  └ 136 lines...

**Found 2 correctness issues** in the coverage-graph schema/migration slice: **0 P0, 2 P1, 0 P2**.

## Findings

1. **Finding ID:** F-043-001  
   **Severity:** P1  
   **Dimension:** correctness  
   **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`  
   **Line:** 246  
   **Title:** Empty `schema_version` tables bypass the v1->v2 migration but still get stamped as v2  
   **Description:** The migration only drops/recreates legacy v1 tables when `SELECT version FROM schema_version` returns a row and that row is `< 2`. If the table exists but is empty, the code skips the drop branch, runs `CREATE TABLE IF NOT EXISTS` against the old v1 tables, and then inserts version `2`. That leaves the single-column-PK v1 schema in place while reporting the DB as migrated.  
   **Evidence:** `coverage-graph-db.ts:243-264` only migrates when `existing && existing.version < SCHEMA_VERSION`; `coverage-graph-db.ts:267-274` then inserts/updates schema version after `SCHEMA_SQL`. A SQLite replay of this exact branch produced `schema_version=2` while `coverage_nodes` still had PK `['id']` and `coverage_snapshots` still lacked `session_id`, which is incompatible with the intended v2 schema at `coverage-graph-db.ts:156-217`.  
   **Recommendation:** Treat a missing version row as legacy state that must be dropped/recreated, or validate the actual table shape before stamping version 2. Add a regression that seeds a v1 DB with an empty `schema_version` table and verifies upgrade to composite PKs plus `session_id` snapshots.

2. **Finding ID:** F-043-002  
   **Severity:** P1  
   **Dimension:** correctness  
   **File:** `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md`  
   **Line:** 199  
   **Title:** Canonical Phase 2 schema spec still documents the old v1 DDL instead of the shipped v2 schema  
   **Description:** The spec still says `coverage_nodes.id TEXT PRIMARY KEY`, `coverage_edges.id TEXT PRIMARY KEY`, edge FKs reference `coverage_nodes(id)`, the edge weight cap is `<= 1.5`, and snapshots are unique on `(spec_folder, loop_type, iteration)`. The shipped DDL now uses composite primary keys `(spec_folder, loop_type, session_id, id)`, composite foreign keys, a `<= 2.0` weight cap, and `UNIQUE(spec_folder, loop_type, session_id, iteration)`. That directly violates the packet’s own “exact schema described in this spec” contract.  
   **Evidence:** Spec claims old schema at `002-semantic-coverage-graph/spec.md:199-261`, and REQ-002 requires exact schema fidelity at `002-semantic-coverage-graph/spec.md:340`. Actual CREATE TABLE statements differ at `coverage-graph-db.ts:156-217`. The packet root summary already describes the v2 composite-key migration at `implementation-summary.md:72`.  
   **Recommendation:** Update the Phase 2 spec’s schema section and REQ-002 acceptance text to match the shipped v2 DDL exactly, or explicitly mark the current section as superseded historical v1 schema.

## ITERATION SUMMARY

Reviewed the v2 DDL, migration branch, phase-002 schema contract, packet summary, and session-isolation coverage. The **current v2 CREATE TABLE definitions themselves look internally consistent**, but the **migration path has a real empty-version-row hole**, and the **canonical phase spec still describes the superseded v1 schema**.

## COVERAGE ASSESSMENT

Covered:
1. `coverage-graph-db.ts` schema, migration, and namespace-scoped CRUD paths  
2. Phase 002 schema documentation in `002-semantic-coverage-graph/spec.md`  
3. Packet-level change summary in `implementation-summary.md`  
4. Session isolation regression coverage in `scripts/tests/session-isolation.vitest.ts`

Notably, the shared-ID regression verifies **fresh v2 behavior**, but it does **not** exercise an on-disk live upgrade from a preexisting v1 file.

## CONFIDENCE

**High.** The findings come from direct DDL/code inspection plus a concrete SQLite replay of the migration branch logic.

## NEXT PRIORITIES

1. Fix `initDb()` so empty/malformed `schema_version` state is treated as legacy and migrated safely.  
2. Add a real seeded v1->v2 upgrade regression.  
3. Reconcile `002-semantic-coverage-graph/spec.md` with the shipped v2 schema.


Changes   +0 -0
Requests  1 Premium (7m 28s)
Tokens    ↑ 1.4m • ↓ 16.6k • 1.3m (cached) • 9.8k (reasoning)
