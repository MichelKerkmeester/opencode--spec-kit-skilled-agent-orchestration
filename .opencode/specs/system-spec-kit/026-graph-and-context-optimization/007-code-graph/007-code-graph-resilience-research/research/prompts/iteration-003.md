You are running iteration 3 of 7 in a deep-research loop on code-graph resilience.

# Iteration 3 — SQLite Corruption Recovery Procedures

## Research Questions
- Q4: SQLite corruption recovery — what does `sqlite3 .recover` produce on a damaged code-graph DB? What's the cleanest pre/post sequence?

## Required reads
1. Strategy + iterations 1 and 2 outputs
2. Code-graph DB schema location and on-disk path (likely `.opencode/skill/system-spec-kit/mcp_server/data/...sqlite` or similar — locate via grep)
3. `sqlite3` man pages / .recover documentation patterns
4. Existing recovery hints in the mcp_server README or code-graph scan source

## What to look for
- DB file paths and naming conventions
- Schema dump procedure (`sqlite3 db.sqlite .schema`)
- Backup-before-recovery best practices
- `sqlite3 db.sqlite .recover | sqlite3 db-recovered.sqlite` flow
- Reindex-after-recovery requirements (FTS5 indexes need reindex; sqlite-vec indexes may need rebuild)
- What information is unrecoverable from a corrupt DB
- How to verify recovered DB integrity (`PRAGMA integrity_check`)

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-003.md`

Required sections: Summary, Recovery Procedures (3 ordered procedures: corruption / partial-scan-failure / bad-apply-rollback), Verification Steps, Limitations (what cannot be recovered), Files Reviewed, Convergence Signals.

### 2. Delta JSON
Path: `research/deltas/iteration-003.json`. Mirror schema with `research_questions_answered: ["Q4"]`.

### 3. State log append
JSONL line to `research/deep-research-state.jsonl` with iteration:3.

## Constraints
- Read-only on existing files.
- Procedures must be idempotent.
- Cite specific sqlite commands with version-safe flags.
