OpenAI Codex v0.116.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d23da-bf56-7842-b36b-b118c15a241b
--------
user
You are a security review agent. Perform a SECURITY audit of the Spec Kit Memory system code.

CONTEXT: This is an MCP server + scripts system for AI memory management. Prior v4 review found P2 advisories: eval scripts lack spec-root containment checks, and embedding provider config could theoretically exfiltrate content. No P0/P1 security issues.

SCOPE: Read key files in:
- .opencode/skill/system-spec-kit/mcp_server/ (MCP server handlers)
- .opencode/skill/system-spec-kit/scripts/dist/ (processing scripts)
- .opencode/skill/system-spec-kit/shared/ (shared utilities)

Focus on: SQL injection, path traversal, command injection, unsafe deserialization, data exposure, auth/permission issues, input validation, OWASP top 10.

OUTPUT FORMAT:
# Iteration 005: Security Audit
## Agent: codex / gpt-5.4 / high
## Dimension: security
## Files Reviewed
(list each file)
## Findings
### [SEVERITY]-[NNN]: [Title]
- Severity: P0|P1|P2
- Evidence: [file:line]
- Description: ...
- Impact: ...
- Fix: ...
## Summary
- Total findings: N (P0: N, P1: N, P2: N)
- newFindingsRatio: X.XX

Specifically check: parameterized queries in SQLite access, path.resolve/join safety, file write atomicity, error message sanitization, env var handling.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp: cocoindex_code ready
mcp startup: ready: code_mode, sequential_thinking, cocoindex_code; failed: spec_kit_memory
codex
Reviewing the Spec Kit Memory server and scripts with a security lens now. I’m starting by loading the review guidance, then I’ll map the scoped files and inspect the SQLite, path handling, script execution, and error-surfacing paths in detail.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Perform a SECURITY audit of the Spec Kit Memory system code in .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist .opencode/skill/system-spec-kit/shared focusing on SQL injection path traversal command injection unsafe deserialization data exposure auth permission issues input validation and OWASP top 10" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 2.57s:
2026-03-25 08:17:45.491 xcodebuild[75687:13831976]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:45.799 xcodebuild[75687:13831945] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-mV2cfYEk' (errno=Operation not permitted)
2026-03-25 08:17:46.602 xcodebuild[76218:13832981]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:46.831 xcodebuild[76218:13832955] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !audit(multi), !intent:memory, !memory, !spec"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
codex
The review baseline is loaded; next I’m mapping the scoped modules and then tracing the tainted-input paths into SQLite, filesystem operations, and subprocess boundaries. I’ll keep the audit tight to the requested directories and call out only concrete issues with file/line evidence.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/references/security_checklist.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/references/review_core.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: Security and Reliability Checklist
description: Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.
---

# Security and Reliability Checklist

Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Help reviewers prioritize exploitability and business impact, not just code style.

### Core Principle

 succeeded in 0ms:
---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

---

## 1. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.
codex
Skill routing: `system-spec-kit`, `sk-code--opencode`, `sk-code--review`, and `mcp-coco-index` all crossed threshold; I’m using `sk-code--review` for the findings contract, `sk-code--opencode` for OpenCode-specific review norms, and CocoIndex for semantic discovery before exact reads. Next step is enumerating the actual handlers and scripts in scope.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-wal
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-shm
.opencode/skill/system-spec-kit/shared/mcp_server/database/speckit_memory.db
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite-shm
.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite-wal
.opencode/skill/system-spec-kit/shared/chunking.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts
.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts
tool cocoindex_code.search({"query":"SQLite database access, SQL query construction, prepared statements, database writes in Spec Kit Memory MCP server and shared utilities","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts",".opencode/skill/system-spec-kit/scripts/dist/**/*.js"],"limit":10,"refresh_index":true})
cocoindex_code.search({"query":"SQLite database access, SQL query construction, prepared statements, database writes in Spec Kit Memory MCP server and shared utilities","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts",".opencode/skill/system-spec-kit/scripts/dist/**/*.js"],"limit":10,"refresh_index":true}) success in 16.62s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"path resolution safety, spec folder containment, preventing path traversal in filesystem helpers and script handlers","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts",".opencode/skill/system-spec-kit/scripts/dist/**/*.js"],"limit":10,"refresh_index":false})
cocoindex_code.search({"query":"path resolution safety, spec folder containment, preventing path traversal in filesystem helpers and script handlers","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts",".opencode/skill/system-spec-kit/scripts/dist/**/*.js"],"limit":10,"refresh_index":false}) success in 385ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"child_process subprocess exec spawn shell command building external command execution environment variables","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts",".opencode/skill/system-spec-kit/scripts/dist/**/*.js"],"limit":10,"refresh_index":false})
cocoindex_code.search({"query":"child_process subprocess exec spawn shell command building external command execution environment variables","paths":[".opencode/skill/system-spec-kit/mcp_server/**/*.ts",".opencode/skill/system-spec-kit/shared/**/*.ts",".opencode/skill/system-spec-kit/scripts/dist/**/*.js"],"limit":10,"refresh_index":false}) success in 477ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
codex
CocoIndex didn’t return scoped hits on the first pass, so I’m falling back to a narrower discovery loop: exact searches for database APIs, path guards, and subprocess use, then I’ll read the concrete files those searches point to. That still keeps the audit evidence-based and inside scope.
exec
/bin/zsh -lc "rg -n \"better-sqlite3|sqlite|prepare\\(|db\\.(exec|prepare|transaction|pragma|run|get|all)\\(\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts/dist" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"path\\.resolve|path\\.join|resolve\\(|join\\(|relative\\(|normalize\\(|realpath|mkdir|writeFile|rename|mkdtemp|open\\(|copyFile|unlink|rm\\(\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts/dist" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:483:      const row = (database.prepare('SELECT 1 FROM memory_index WHERE file_path = ?') as import('better-sqlite3').Statement).get(originalPath);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:688:    rows = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:695:    rows = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:917:    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63:  /** Get database path (legacy profile uses context-index.sqlite, others use slug) */
.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:68:      return `${baseDir}/context-index.sqlite`;
.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:70:    return `${baseDir}/context-index__${this.slug}.sqlite`;
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:6:  - "sqlite database location"
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:48:| `context-index.sqlite` | Legacy database created at runtime (HF Local, nomic, 768d) |
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:49:| `context-index__*__*__*.sqlite` | Per-profile databases created at runtime (provider, model, dimension in filename) |
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:51:Note: `.sqlite` files are generated at runtime. They are not committed to version control.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:228:    const result = db.transaction((): (
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:232:      const existingSpace = db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:303:      const savedSpace = db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:518:      const row = db.prepare('SELECT value FROM config WHERE key = ?')
.opencode/skill/system-spec-kit/shared/embeddings/README.md:158:├── context-index.sqlite                              # Legacy (hf-local + nomic + 768)
.opencode/skill/system-spec-kit/shared/embeddings/README.md:159:├── context-index__openai__text-embedding-3-small__1536.sqlite
.opencode/skill/system-spec-kit/shared/embeddings/README.md:160:├── context-index__openai__text-embedding-3-large__3072.sqlite
.opencode/skill/system-spec-kit/shared/embeddings/README.md:161:└── context-index__hf-local__custom-model__768.sqlite
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.js:51:const TEMPLATE_BASE = path.resolve(SCRIPT_DIR, '..', 'templates');
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.js:82:            fs.writeFileSync(filePath, result.content, 'utf-8');
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.js:90:            error: result.collisions.length > 0 ? `Collisions: ${result.collisions.join(', ')}` : undefined
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.js:117:            const filePath = path.join(TEMPLATE_BASE, level, filename);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:250:    `Search channels: ${channels.join(', ')}.`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:253:  ].filter(Boolean).join(' ');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:441:      ? path.resolve(process.cwd(), configuredMemoryRoot)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:447:          .map((root) => path.resolve(root))
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:453:      scanLocations.push(path.join(root, 'specs'));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:454:      scanLocations.push(path.join(root, '.opencode', 'specs'));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:457:      const skillDir = path.join(root, '.opencode', 'skill');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:463:              const constDir = path.join(skillDir, entry.name, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:662:      deadlineTimer = setTimeout(() => resolve(true), SHUTDOWN_DEADLINE_MS);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:677:/** Remove indexed rows for watcher delete and rename events. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:860:        resolve();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1045:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js:56:    const folderPath = path.resolve(args[0]);
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js:57:    const basePath = path.resolve(args[1]);
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js:59:    // Try/catch guards against crash on broken symlinks (realpathSync throws ENOENT).
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js:64:        realFolder = fs.realpathSync(folderPath);
exec
/bin/zsh -lc "rg -n \"child_process|exec\\(|execFile\\(|spawn\\(|spawnSync\\(|execSync\\(|shell:\\s*true|new Function|eval\\(\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts/dist" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:6:import { spawnSync } from 'child_process';
.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:10:const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:364:    db.exec(SCHEMA_SQL);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:366:      db.exec(indexSql);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:505:        db.exec('BEGIN IMMEDIATE');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:          db.exec('COMMIT');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:511:            db.exec('ROLLBACK');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:884:    db.exec(SESSION_STATE_SCHEMA_SQL);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:886:      db.exec(indexSql);
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:75:  while ((match = openPattern.exec(content)) !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:86:    const closeMatch = closingPattern.exec(afterOpen);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:201:  db.exec(`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:172:    database.exec(SCHEMA_SQL);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:173:    database.exec(INDEX_SQL);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:288:    db.exec(SCHEMA_SQL);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:292:      db.exec(index_sql);
.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:15:const child_process_1 = require("child_process");
.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:54:    return (0, child_process_1.execFileSync)('git', args, {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:21:  db.exec(`
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:384:            while ((match = pattern.exec(text)) !== null) {
codex
I’ve got the hotspots now. The next pass is reading the small set of files where untrusted input actually hits SQLite, the filesystem, or subprocesses so the report stays concrete instead of speculative.
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/shared -maxdepth 3 -type f \\( -name '*.ts' -o -name '*.js' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/mcp_server/handlers -maxdepth 2 -type f \\( -name '*.ts' -o -name '*.js' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/scripts/dist -maxdepth 2 -type f \\( -name '*.js' -o -name '*.ts' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/shared/algorithms/index.ts
.opencode/skill/system-spec-kit/shared/algorithms/mmr-reranker.ts
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
.opencode/skill/system-spec-kit/shared/chunking.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/rrf-fusion.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/rrf-fusion.js
.opencode/skill/system-spec-kit/shared/dist/chunking.d.ts
.opencode/skill/system-spec-kit/shared/dist/chunking.js
.opencode/skill/system-spec-kit/shared/dist/config.d.ts
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/config/index.d.ts
.opencode/skill/system-spec-kit/scripts/dist/config/index.js
.opencode/skill/system-spec-kit/scripts/dist/core/alignment-validator.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/alignment-validator.js
.opencode/skill/system-spec-kit/scripts/dist/core/config.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/config.js
.opencode/skill/system-spec-kit/scripts/dist/core/content-cleaner.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/content-cleaner.js
.opencode/skill/system-spec-kit/scripts/dist/core/file-writer.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/file-writer.js
.opencode/skill/system-spec-kit/scripts/dist/core/frontmatter-editor.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/frontmatter-editor.js
.opencode/skill/system-spec-kit/scripts/dist/core/index.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/index.js
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.d.ts
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js
exec
/bin/zsh -lc "rg -n \"SELECT .*\\"'$'"\\{|INSERT .*\\"'$'"\\{|UPDATE .*\\"'$'"\\{|DELETE .*\\"'$'"\\{|WHERE .*\\"'$'"\\{|ORDER BY .*\\"'$'"\\{|LIMIT \\"'$'"\\{|"'${|join'"\\(', '\\)|placeholders|IN \\(\\"'$'"\\{\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts/dist" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "rg -n \"process\\.env|API_KEY|OPENAI|VOYAGE|HF_|EMBED|provider|baseURL|baseUrl|endpoint|token|secret\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts/dist" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:68:import * as embeddings from './lib/providers/embeddings';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:92:import * as retryManager from './lib/providers/retry-manager';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:132:  provider?: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:160:const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:163:const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:350:    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:351:    // T205: Enforce per-layer token budgets with actual truncation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:366:          meta.tokenBudget = budget;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369:          if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:370:            console.error(`[token-budget] ${name} response (${meta.tokenCount} tokens) exceeds budget (${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:380:                // P1-06 FIX: Recalculate token count from the full envelope
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:383:                if (typeof meta.tokenCount === 'number' && meta.tokenCount <= budget) break;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:389:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:391:              meta.tokenBudgetTruncated = true;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:397:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:404:        // Non-JSON response, skip token budget injection
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:439:    const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:527:    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:755:  if (!process.env.EMBEDDING_DIM) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:756:    process.env.EMBEDDING_DIM = String(getStartupEmbeddingDimension());
exec
/bin/zsh -lc "rg -n \"JSON\\.parse\\(|yaml|js-yaml|deserialize|Function\\(|vm\\.|eval\\(|unsafe|frontmatter|gray-matter\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts/dist" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:207:    const parsed = JSON.parse(payload) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:354:        const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/scripts/dist/loaders/data-loader.js:57:        const rawData = JSON.parse(dataContent);
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:35:// 2. Content with no frontmatter -> score 0, flags [] (must NOT parse body text)
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:44:  assertEqual(extractQualityScore(content), 0, 'no frontmatter score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:45:  assertArrayEqual(extractQualityFlags(content), [], 'no frontmatter flags');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:48:// 3. Valid frontmatter with quality_score: 0.85 -> 0.85
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:75:// 7. quality_score in body text but NOT in frontmatter -> must return 0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:121:// 11. Multiline frontmatter with both score and flags
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:136:  assertEqual(extractQualityScore(content), 0.42, 'multiline frontmatter score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:137:  assertArrayEqual(extractQualityFlags(content), ['one', 'two'], 'multiline frontmatter flags');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:140:// 12. Windows-style \r\n line endings in frontmatter
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs:33:      '@typescript-eslint/no-unsafe-function-type': 'off',
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:87:      const marker: NodeVersionMarker = JSON.parse(raw);
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts:19:    return JSON.parse(str) as T;
.opencode/skill/system-spec-kit/shared/README.md:242:| `parsing/quality-extractors.ts` | Quality score and flags extraction from frontmatter |
.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:12:  | 'missing_frontmatter'
.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:13:  | 'malformed_frontmatter'
.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:14:  | 'missing_frontmatter_key'
.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:15:  | 'missing_blank_line_after_frontmatter'
codex
I’m checking the previously known weak spots explicitly now: the eval scripts’ path containment and the embedding-provider configuration path. In parallel, I’m reading the handlers that assemble SQL or persist files so we can separate “theoretical” risks from current, code-backed findings.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/utils/path-security.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Path Security
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/utils/path-security.js)

import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------
// 1. PATH VALIDATION
// ---------------------------------------------------------------

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 * Uses path.relative() containment check instead of startsWith() to prevent path confusion attacks.
 */
export function validateFilePath(filePath: string, allowedBasePaths: string[]): string | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/paths.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Paths
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import { getDbDir } from './config';

function findUp(startDir: string, predicate: (dir: string) => boolean): string | undefined {
  let dir = startDir;
  while (true) {
    if (predicate(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

function hasPackageJson(dir: string): boolean {
 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/** Get db dir. */
export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}

function findUp(filename: string, startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler
// ───────────────────────────────────────────────────────────────
// MCP handler layer for shared-space CRUD, membership assignment,
// and rollout status reporting with deny-by-default access.
import { requireDb } from '../utils';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope';
import type { MCPResponse } from './types';
import type { SharedSpaceUpsertArgs, SharedSpaceMembershipArgs, SharedMemoryStatusArgs } from '../tools/types';
import {
  assertSharedSpaceAccess,
  enableSharedMemory,
  ensureSharedCollabRuntime,
  getAllowedSharedSpaceIds,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';
import { recordGovernanceAudit } from '../lib/governance/scope-governance';

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Ingest Handlers
// ───────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core';
import { MAX_INGEST_PATHS } from '../schemas/tool-input-schemas';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import {
  createIngestJob,
  enqueueIngestJob,
  getIngestJob,
  cancelIngestJob,
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Bulk Delete
// ────────────────────────────────────────────────────────────────
// Tier-based bulk deletion of memories with safety gates.
// Eliminates the need for direct DB scripts when cleaning up
// Deprecated/temporary memories at scale.
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { recordHistory } from '../lib/storage/history';
import { MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS } from '../schemas/tool-input-schemas';
import { appendMutationLedgerSafe } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
              operationType: 'update',
            },
          });
          return {
            error: reason,
            msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
            operationType: 'update',
          };
        }
      }

      const definition = existingSpace
        ? {
          spaceId: args.spaceId,
          tenantId: args.tenantId,
          name: args.name,
          rolloutCohort: args.rolloutCohort,
          ...(args.rolloutEnabled !== undefined ? { rolloutEnabled: args.rolloutEnabled } : {}),
          ...(args.killSwitch !== undefined ? { killSwitch: args.killSwitch } : {}),
        }
exec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      dbAlreadyEnabled = row?.value === 'true';
    } catch (error: unknown) {
      // config table may not exist yet
      const message = error instanceof Error ? error.message : String(error);
      void message;
    }

    if (dbAlreadyEnabled) {
      await createSharedSpacesReadme();
      return createMCPSuccessResponse({
        tool: 'shared_memory_enable',
        summary: 'Shared memory is already enabled',
        data: { alreadyEnabled: true },
      });
    }

    ensureSharedCollabRuntime(db);
    enableSharedMemory(db);

    const readmeCreated = !await createSharedSpacesReadme();
exec
/bin/zsh -lc "sed -n '260,560p' .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    FROM shared_space_members m
    JOIN shared_spaces s ON s.space_id = m.space_id
    WHERE (? IS NULL OR s.tenant_id = ?)
  `).get(normalizedTenantId, normalizedTenantId) as { count: number };

  const conflictRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM shared_space_conflicts c
    JOIN shared_spaces s ON s.space_id = c.space_id
    WHERE (? IS NULL OR s.tenant_id = ?)
  `).get(normalizedTenantId, normalizedTenantId) as { count: number };

  return {
    tenantId: normalizedTenantId ?? undefined,
    totalSpaces: spaceCounts.total_spaces,
    rolloutEnabledSpaces: spaceCounts.rollout_enabled_spaces ?? 0,
    rolloutDisabledSpaces: spaceCounts.rollout_disabled_spaces ?? 0,
    killSwitchedSpaces: spaceCounts.kill_switched_spaces ?? 0,
    totalMemberships: membershipRow.count,
    totalConflicts: conflictRow.count,
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Spaces
// ───────────────────────────────────────────────────────────────
// Feature catalog: Shared-memory rollout, deny-by-default membership, and kill switch
// Shared-space definitions, membership management, rollout
// controls, conflict resolution, and collaboration metrics.
import type Database from 'better-sqlite3';

import {
  ensureSharedSpaceTables,
} from '../search/vector-index-schema';

import {
  isGovernanceGuardrailsEnabled,
  normalizeScopeContext,
  recordGovernanceAudit,
  type ScopeContext,
} from '../governance/scope-governance';

/**
exec
/bin/zsh -lc "sed -n '240,460p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
 * is not rolled back if the rename fails (extremely rare on local filesystems).
 */
function executeAtomicSave(
  filePath: string,
  content: string,
  dbOperation: () => void
): AtomicSaveResult {
  const pendingPath = getPendingPath(filePath);

  try {
    // Step 1: Write to pending path
    const dir = path.dirname(pendingPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(pendingPath, content, 'utf-8');

    // Flag-based rollback coordination.
    // The dbOperation callback runs synchronously (better-sqlite3 transaction). If it
    // Succeeds but the rename (Step 3) fails, the DB change is already committed and
exec
/bin/zsh -lc "sed -n '560,820p' .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      spaceTenantId: space.tenant_id ?? null,
    });
  }
  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
    return deny('shared_space_tenant_required');
  }

  const bypassAvailabilityChecks = requiredRole === 'owner';
  if (!bypassAvailabilityChecks && space.kill_switch === 1) {
    return deny('shared_space_kill_switch');
  }
  if (!bypassAvailabilityChecks && space.rollout_enabled !== 1) {
    return deny('shared_space_rollout_disabled');
  }

  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
  if (!allowed.has(spaceId) && !bypassAvailabilityChecks) {
    return deny('shared_space_membership_required');
  }

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Transaction Manager
// ───────────────────────────────────────────────────────────────
// Feature catalog: Transaction wrappers on mutation handlers
// Atomic file + index operations with pending file recovery
import type Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { resolveDatabasePaths } from '../../core/config';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const PENDING_SUFFIX = '_pending';
const TEMP_SUFFIX = '.tmp';
const PENDING_UNIQUE_SUFFIX_PATTERN = /^(?:[0-9a-f]{8}|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/i;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Store
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// SEARCH: VECTOR INDEX
// TypeScript port of the vector index implementation.
// DECAY STRATEGY (ADR-004): Search-time temporal decay uses an
// FSRS-preferred strategy. Memories with FSRS review data (last_review
// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
// R(t) = (1 + 0.2346 * t / S)^(-0.5)
// Memories without review data fall back to half-life exponential:
// Weight * 0.5^(days / half_life_days)
// This ensures backward compatibility while aligning reviewed
// Memories with the canonical FSRS algorithm.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Database from 'better-sqlite3';
exec
/bin/zsh -lc "sed -n '220,560p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
export function validate_file_path_local(file_path: unknown): string | null {
  if (typeof file_path !== 'string') {
    return null;
  }

  return validateFilePath(file_path, ALLOWED_BASE_PATHS);
}

// HIGH-004 FIX: Async version for non-blocking concurrent file reads
/**
 * Reads a file asynchronously after validating the path.
 * @param file_path - The file path to read.
 * @returns A promise that resolves to the file contents or an empty string.
 */
export async function safe_read_file_async(file_path: unknown): Promise<string> {
  const valid_path = validate_file_path_local(file_path);
  if (!valid_path) {
    return '';
  }

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/embeddings.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '560,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Embeddings
// ---------------------------------------------------------------
// Feature catalog: Hybrid search pipeline

// Node stdlib
import crypto from 'crypto';

// Internal modules
import {
  createEmbeddingsProvider,
  getProviderInfo,
  getStartupEmbeddingDimension,
  validateApiKey,
  VALIDATION_TIMEOUT_MS,
} from './embeddings/factory';
import { semanticChunk, MAX_TEXT_LENGTH, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } from './chunking';
import type {
  IEmbeddingProvider,
  EmbeddingCacheStats,
 succeeded in 0ms:
  const resolved_target = path.resolve(target_path);
  const cached_conn = db_connections.get(resolved_target);
  if (cached_conn) return cached_conn;

  const dir = path.dirname(target_path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  let new_db: Database.Database;
  try {
    new_db = new Database(target_path);
  } catch (db_error: unknown) {
    const errMsg = get_error_message(db_error);
    const errCode = get_error_code(db_error);
    if (errCode === 'ERR_DLOPEN_FAILED' || errMsg.includes('NODE_MODULE_VERSION') || errMsg.includes('was compiled against a different Node.js version')) {
      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
      console.error(`[vector-index] ${errMsg}`);
      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
      try {
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/shared/embeddings.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/embeddings/factory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/embeddings/profile.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Profile
// ---------------------------------------------------------------

import type { ParsedProfileSlug, ProfileJson } from '../types';

// ---------------------------------------------------------------
// 1. UTILITY FUNCTIONS
// ---------------------------------------------------------------

/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
export function createProfileSlug(provider: string, model: string, dim: number): string {
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();

  return `${provider}__${safeModel}__${dim}`;
}

 succeeded in 0ms:
  const key = getCacheKey(text);
  if (embeddingCache.size >= EMBEDDING_CACHE_MAX_SIZE) {
    const firstKey = embeddingCache.keys().next().value;
    if (firstKey !== undefined) {
      embeddingCache.delete(firstKey);
    }
  }
  embeddingCache.set(key, embedding);
}

function clearEmbeddingCache(): void {
  embeddingCache.clear();
}

function getEmbeddingCacheStats(): EmbeddingCacheStats {
  return {
    size: embeddingCache.size,
    maxSize: EMBEDDING_CACHE_MAX_SIZE,
  };
}
 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Factory
// ---------------------------------------------------------------

import { HfLocalProvider } from './providers/hf-local';
import { OpenAIProvider, MODEL_DIMENSIONS as OPENAI_MODEL_DIMENSIONS } from './providers/openai';
import { VoyageProvider, MODEL_DIMENSIONS as VOYAGE_MODEL_DIMENSIONS, resolveVoyageBaseUrl } from './providers/voyage';
import type {
  IEmbeddingProvider,
  ProviderResolution,
  ProviderInfo,
  CreateProviderOptions,
  ApiKeyValidationResult,
} from '../types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isAbortError(error: unknown): boolean {
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Openai
// ---------------------------------------------------------------

import { EmbeddingProfile } from '../profile';
import { retryWithBackoff } from '../../utils/retry';
import type { IEmbeddingProvider, ModelDimensions, ProviderMetadata, UsageStats } from '../../types';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

const DEFAULT_MODEL: string = 'text-embedding-3-small';
const DEFAULT_DIM: number = 1536;
const DEFAULT_BASE_URL: string = 'https://api.openai.com/v1';
const REQUEST_TIMEOUT: number = 30000;

/** Defines model dimensions. */
export const MODEL_DIMENSIONS: ModelDimensions = {
  'text-embedding-3-small': 1536,
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: HF Local
// ---------------------------------------------------------------

import { EmbeddingProfile } from '../profile';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking';
import type { IEmbeddingProvider, ProviderMetadata, TaskPrefixMap } from '../../types';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

const DEFAULT_MODEL: string = 'nomic-ai/nomic-embed-text-v1.5';
const EMBEDDING_DIM: number = 768;
// MAX_TEXT_LENGTH imported from chunking.ts (single source of truth)
const EMBEDDING_TIMEOUT: number = 30000;
const MODEL_LOAD_TIMEOUT: number = 120000; // 2 minutes (model is ~274MB)

// Task prefixes required by nomic-embed-text-v1.5
// See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/shared/embeddings/factory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Voyage
// ---------------------------------------------------------------

import { EmbeddingProfile } from '../profile';
import { retryWithBackoff } from '../../utils/retry';
import type { IEmbeddingProvider, ModelDimensions, ProviderMetadata, UsageStats } from '../../types';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

const DEFAULT_MODEL: string = 'voyage-4';
const DEFAULT_DIM: number = 1024;
const DEFAULT_BASE_URL: string = 'https://api.voyageai.com/v1';
const REQUEST_TIMEOUT: number = 30000;

// Config: honor VOYAGE_BASE_URL for startup validation, not just runtime
export function resolveVoyageBaseUrl(baseUrl?: string): string {
  if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Retry Manager
// ───────────────────────────────────────────────────────────────
// Feature catalog: Embedding retry orchestrator
// Node stdlib
import * as fsPromises from 'fs/promises';

// Internal modules
import * as vectorIndex from '../search/vector-index';
import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
import { normalizeContentForEmbedding } from '../parsing/content-normalizer';
import { generateDocumentEmbedding, getModelName } from './embeddings';

// Type imports
import type { MemoryDbRow } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

 succeeded in 0ms:
  try {
    switch (providerName) {
      case 'voyage':
        if (!process.env.VOYAGE_API_KEY && !options.apiKey) {
          throw new Error(
            'Voyage provider requires VOYAGE_API_KEY. ' +
            'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
          );
        }
        provider = new VoyageProvider({
          model: options.model,
          dim: options.dim,
          apiKey: options.apiKey,
          baseUrl: options.baseUrl,
          timeout: options.timeout,
        });
        if (options.maxTextLength) {
          console.warn('[factory] VoyageProvider does not support maxTextLength option — ignored');
        }
        break;
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  raw: unknown,
  options: SanitizeEmbeddingFailureOptions = {},
): string | null {
  const failure = sanitizeEmbeddingFailure(raw, options);
  return failure.publicMessage.length > 0 ? failure.publicMessage : null;
}

export function sanitizeAndLogEmbeddingFailure(
  context: string,
  raw: unknown,
  options: SanitizeEmbeddingFailureOptions = {},
): string | null {
  const failure = sanitizeEmbeddingFailure(raw, options);
  if (failure.publicMessage.length === 0) {
    return null;
  }

  if (failure.sanitized) {
    console.error(context, {
      sanitized: {
exec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/shared/embeddings/factory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      const isAuthError = response.status === 401 || response.status === 403;
      const isRateLimit = response.status === 429;

      if (isAuthError) {
        return {
          valid: false,
          provider: providerName,
          error: `API key invalid or unauthorized: ${errorMessage}`,
          errorCode: 'E050',
          httpStatus: response.status,
          actions: [
            `Verify API key is correct in ${providerName.toUpperCase()}_API_KEY`,
            `Check key validity at ${providerName === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
            'Ensure key has embedding permissions enabled',
          ],
        };
      }

      if (isRateLimit) {
        // Rate limit during validation still means the key is valid
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Save Handler
// ───────────────────────────────────────────────────────────────
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  evaluateMemorySufficiency,
  MEMORY_SUFFICIENCY_REJECTION_CODE,
  type MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import {
  validateMemoryTemplateContract,
  type MemoryTemplateContractResult,
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud List
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { safeJsonParseTyped } from '../utils/json-helpers';

import type { MCPResponse } from './types';
import type { ListArgs } from './memory-crud-types';

 succeeded in 0ms:
      if (errCode !== 'ENOENT') {
        throw backupErr;
      }
    }

    await fs.promises.writeFile(tempPath, content, 'utf-8');
    tempCreated = true;
    await fs.promises.rename(tempPath, filePath);
    tempCreated = false;
  } catch (writeErr: unknown) {
    if (tempCreated) {
      try {
        await fs.promises.unlink(tempPath);
      } catch {
        // Best-effort cleanup only.
      }
    }
    if (backupCreated) {
      try {
        await fs.promises.copyFile(backupPath, filePath);
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Update Handler
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { runInTransaction } from '../lib/storage/transaction-manager';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Delete
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { recordHistory } from '../lib/storage/history';
import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Mutations
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// Split from vector-index-store.ts — contains ALL mutation functions:
// Index, update, delete, and status/confidence updates.

import * as embeddingsProvider from '../providers/embeddings';
import { recordHistory } from '../storage/history';
import { getCanonicalPathKey } from '../utils/canonical-path';
import { createLogger } from '../utils/logger';
import * as bm25Index from './bm25-index';
import {
  clear_search_cache,
} from './vector-index-aliases';
import {
  get_error_message,
  to_embedding_buffer,
  VectorIndexError,
  VectorIndexErrorCode,
exec
/bin/zsh -lc "sed -n '320,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  } catch (_error: unknown) {
    // Best-effort for legacy databases that may not have lineage projection tables.
  }
  refresh_interference_scores_for_folder(database, specFolder);
  logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);

  return Number(row_id);
}

/**
 * Updates stored memory metadata and embeddings.
 * @param params - The memory values to update.
 * @returns The updated memory identifier.
 * @throws {VectorIndexError} When embedding validation fails or the mutation transaction cannot complete.
 * @example
 * ```ts
 * const id = update_memory({ id: 42, title: 'Updated title', embedding });
 * ```
 */
export function update_memory(params: UpdateMemoryParams): number {
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Create Record
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index';
import * as bm25Index from '../../lib/search/bm25-index';
import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate';
import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../../lib/storage/incremental-index';
import type * as memoryParser from '../../lib/parsing/memory-parser';
import { sanitizeEmbeddingFailureMessage } from '../../lib/providers/retry-manager';
import { getCanonicalPathKey } from '../../lib/utils/canonical-path';
import { recordLineageTransition } from '../../lib/storage/lineage-state';
import { toErrorMessage } from '../../utils';

import { recordHistory } from '../../lib/storage/history';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating';
import { detectSpecLevelFromParsed } from '../handler-utils';
codex
I’ve finished the main handler and shared-library pass. The last chunk is the compiled scripts layer: context generation, spec-folder detection, file writers, and the eval helpers, because that’s where path containment and subprocess boundaries tend to hide.
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/dist/utils/path-utils.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Path Utils
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePath = sanitizePath;
exports.getPathBasename = getPathBasename;
// ───────────────────────────────────────────────────────────────
// 1. PATH UTILS
// ───────────────────────────────────────────────────────────────
// Secure path sanitization and resolution with traversal protection (CWE-22)
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
// Node stdlib
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/scripts/dist/core/workflow-path-utils.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow Path Utils
// ───────────────────────────────────────────────────────────────
// File path normalization and spec folder file listing utilities.
// Named workflow-path-utils to avoid conflicts with any existing path-utils.
// Extracted from workflow.ts to reduce module size.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
exec
/bin/zsh -lc "sed -n '1,360p' .opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Generate Description
// ───────────────────────────────────────────────────────────────
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
 succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Folder Detector
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/dist/core/file-writer.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,620p' .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
function extractPayloadSpecFolder(data) {
    for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
        const value = data[key];
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }
    return null;
}
async function readAllStdin(stdin = process.stdin) {
    return await new Promise((resolve, reject) => {
        let buffer = '';
        stdin.setEncoding('utf8');
        stdin.on('data', (chunk) => {
            buffer += chunk;
        });
        stdin.on('end', () => resolve(buffer));
        stdin.on('error', reject);
    });
}
 succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: File Writer
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
exec
/bin/zsh -lc 'rg -n "validateArguments|validateFilePath|writeFileSync|savePerFolderDescription|specFolder|memory/" .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/skill/system-spec-kit/scripts/dist/core/workflow.js .opencode/skill/system-spec-kit/scripts/dist/core/file-writer.js .opencode/skill/system-spec-kit/scripts/dist/evals/*.js' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:20:    const [, , specFolder] = process.argv;
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:21:    if (!specFolder) {
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:24:    return { specFolder };
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:61:function writeReport(specFolder, cases) {
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:62:    const outputPath = path_1.default.join(specFolder, 'scratch', 'redaction-calibration.md');
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:104:    fs_1.default.writeFileSync(outputPath, `${content}\n`, 'utf8');
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:107:    const { specFolder } = parseArgs();
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:108:    const inputDir = path_1.default.join(specFolder, 'scratch', 'redaction-calibration-inputs');
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:117:    writeReport(specFolder, cases);
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:219:async function enrichCapturedSessionData(collectedData, specFolder, projectRoot) {
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:227:            (0, spec_folder_extractor_1.extractSpecFolderContext)(path.resolve(specFolder)).catch((err) => {
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:232:            (0, git_context_extractor_1.extractGitContext)(projectRoot, specFolder).catch((err) => {
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:326:        const { dataFile, specFolderArg, collectedData: preloadedData, loadDataFn, collectSessionDataFn, silent = false, } = options;
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:331:        const activeSpecFolderArg = specFolderArg ?? (hasDirectDataContext ? null : config_1.CONFIG.SPEC_FOLDER_ARG);
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:350:                specFolderArg: activeSpecFolderArg,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:399:        const specFolder = await (0, spec_folder_1.detectSpecFolder)(collectedData, {
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:400:            specFolderArg: activeSpecFolderArg,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:403:        const normalizedSpecFolder = path.resolve(specFolder).replace(/\\/g, '/');
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:410:        let specFolderName = '';
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:419:                specFolderName = relative;
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/scripts/dist/evals -maxdepth 1 -name '*.js' -print0 | xargs -0 rg -n \"process\\.argv|readFileSync|writeFileSync|path\\.resolve|realpathSync|validateFilePath|spawn|execFileSync|specFolder|PROJECT_ROOT|input\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:49:        path.resolve(__dirname, 'import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:51:        path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:53:        path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:54:        path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:68:            path.resolve(__dirname, 'import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:69:            path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:70:            path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:71:            path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:77:        const parsed = JSON.parse(fs.readFileSync(allowlistPath, 'utf-8'));
.opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js:64:const DB_DIR = path.resolve(__dirname, '../../mcp_server/database');
.opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js:67:const args = process.argv.slice(2);
.opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js:178:    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js:59:const DB_DIR = path.resolve(__dirname, '../../mcp_server/database');
.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js:62:const args = process.argv.slice(2);
.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js:171:    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
.opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js:52:        path.resolve(__dirname, '../../mcp_server/handlers'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js:54:        path.resolve(__dirname, '../../../mcp_server/handlers'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js:56:        path.resolve(process.cwd(), '../mcp_server/handlers'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js:57:        path.resolve(process.cwd(), 'mcp_server/handlers'),
.opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js:96:    const basePath = path.resolve(path.dirname(importingFile), importPath);
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Run Performance Benchmarks
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. RUN PERFORMANCE BENCHMARKS
// ───────────────────────────────────────────────────────────────
// USAGE: npx tsx scripts/evals/run-performance-benchmarks.ts <spec-folder>
//
// This script MUST be run with tsx (not compiled JS) because
// The cross-project imports rely on tsconfig path resolution.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const perf_hooks_1 = require("perf_hooks");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const api_1 = require("@spec-kit/mcp-server/api");
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Run Redaction Calibration
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. RUN REDACTION CALIBRATION
// ───────────────────────────────────────────────────────────────
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const NON_SECRET_FP_PATTERNS = [
    /^[0-9a-f]{40}$/,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    /^v?\d+\.\d+\.\d+$/,
];
function parseArgs() {
    const [, , specFolder] = process.argv;
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Collect Redaction Calibration Inputs
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. COLLECT REDACTION CALIBRATION INPUTS
// ───────────────────────────────────────────────────────────────
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function parseArgs() {
    const [, , specFolder] = process.argv;
    if (!specFolder) {
        throw new Error('Usage: ts-node scripts/evals/collect-redaction-calibration-inputs.ts <spec-folder-relative-path>');
    }
    return { specFolder };
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Git Context Extractor
// ───────────────────────────────────────────────────────────────
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveModificationMagnitude = deriveModificationMagnitude;
exports.extractGitContext = extractGitContext;
// ───────────────────────────────────────────────────────────────
// 1. GIT CONTEXT EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Mines git history for file changes and observations for captured-session enrichment
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const spec_folder_extractor_1 = require("./spec-folder-extractor");
/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Session Extractor
// ───────────────────────────────────────────────────────────────
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
exec
/bin/zsh -lc "sed -n '740,840p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    `Unhandled rejection at: ${String(promise)} reason: ${reason instanceof Error ? reason.stack ?? reason.message : String(reason)}`,
    1,
  );
});

/* ───────────────────────────────────────────────────────────────
   8. MAIN
──────────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  // Node version mismatch detection (non-blocking)
  detectNodeVersionMismatch();

  validateConfiguredEmbeddingsProvider();

  if (!process.env.EMBEDDING_DIM) {
    process.env.EMBEDDING_DIM = String(getStartupEmbeddingDimension());
  }

  console.error('[context-server] Initializing database...');
exec
/bin/zsh -lc "rg -n \"createMCPErrorResponse\\(|error:\\s*"'`|error:'"\\s*\\"'$'"\\{|sanitize|stack|message\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/response .opencode/skill/system-spec-kit/mcp_server/lib/providers .opencode/skill/system-spec-kit/shared/embeddings" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/api/providers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Providers
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not lib/ internals.
// ARCH-1 re-exports provider functions through a stable surface.

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
} from '../lib/providers/embeddings';

export * as retryManager from '../lib/providers/retry-manager';
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Envelope
// ───────────────────────────────────────────────────────────────
import { estimateTokens } from '../../formatters/token-metrics';

// Feature catalog: Provenance-rich response envelopes


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Describes the ResponseMeta shape.
 */
export interface ResponseMeta {
  tool: string;
  tokenCount: number;
  tokenBudget?: number;
  latencyMs?: number;
codex
One thing I’m validating carefully is whether shared-space authorization is real authorization or just identity-shaping. The code comments themselves hint at that boundary, so I’m checking whether any upstream transport layer actually proves the caller identity before these handlers trust `actorUserId` / `actorAgentId`.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tools/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
// Shared types for tool dispatch modules (T303).
// Re-export canonical MCPResponse from shared
export type { MCPResponse } from '@spec-kit/shared/types';

// Import for extension
import type { MCPResponse } from '@spec-kit/shared/types';
import { validateToolArgs } from '../schemas/tool-input-schemas';

/** Extended MCP response with auto-surfaced context (SK-004) */
export interface MCPResponseWithContext extends MCPResponse {
  autoSurfacedContext?: unknown;
}

/** Narrow pre-validated MCP tool args to a specific handler arg type.
 *  Centralises the single protocol-boundary cast so call sites stay clean. */
export function parseArgs<T>(args: Record<string, unknown>): T {
  // Guard against null/undefined/non-object
exec
/bin/zsh -lc "rg -n \"actorUserId|actorAgentId|resolveAdminActor|transport-level authentication|shared_space_upsert|shared_space_membership_set|assertSharedSpaceAccess\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:11:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:40:export function resolveAdminActor(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:41:  tool: 'shared_space_upsert' | 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:42:  actorUserId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:43:  actorAgentId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:45:  const normalizedUserId = typeof actorUserId === 'string' ? actorUserId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:46:  const normalizedAgentId = typeof actorAgentId === 'string' ? actorAgentId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:59:          hint: 'Provide actorUserId or actorAgentId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:74:          hint: 'Send only actorUserId or actorAgentId, not both.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:133:  tool: 'shared_space_upsert' | 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:143:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:168:  tool: 'shared_space_upsert' | 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:179:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:186:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:    const actorResult = resolveAdminActor('shared_space_upsert', args.actorUserId, args.actorAgentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:244:        const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:            msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:335:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:339:      tool: 'shared_space_upsert',
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Tool Schemas
// ───────────────────────────────────────────────────────────────
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
import {
  MAX_INGEST_PATHS,
  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
} from './schemas/tool-input-schemas';

/**
 * Re-export schema validation helpers used by the MCP tool entry points.
 */
export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas';
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────

import * as memorySearch from './memory-search';
import * as memoryTriggers from './memory-triggers';
import * as memorySave from './memory-save';
import * as memoryCrud from './memory-crud';
import * as memoryIndex from './memory-index';
import * as memoryBulkDelete from './memory-bulk-delete';
import * as checkpoints from './checkpoints';
import * as sessionLearning from './session-learning';
import * as causalGraph from './causal-graph';
import * as evalReporting from './eval-reporting';
import * as sharedMemory from './shared-memory';
// T061: L1 Orchestration - unified entry point
import * as memoryContext from './memory-context';
import * as memoryIngest from './memory-ingest';

// Feature catalog: Transaction wrappers on mutation handlers
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '410,490p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  memory_drift_why: memoryDriftWhySchema as unknown as ToolInputSchema,
  memory_causal_link: memoryCausalLinkSchema as unknown as ToolInputSchema,
  memory_causal_stats: memoryCausalStatsSchema as unknown as ToolInputSchema,
  memory_causal_unlink: memoryCausalUnlinkSchema as unknown as ToolInputSchema,
  eval_run_ablation: evalRunAblationSchema as unknown as ToolInputSchema,
  eval_reporting_dashboard: evalReportingDashboardSchema as unknown as ToolInputSchema,
  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
  memory_get_learning_history: memoryGetLearningHistorySchema as unknown as ToolInputSchema,
  memory_ingest_start: memoryIngestStartSchema as unknown as ToolInputSchema,
  memory_ingest_status: memoryIngestStatusSchema as unknown as ToolInputSchema,
  memory_ingest_cancel: memoryIngestCancelSchema as unknown as ToolInputSchema,
  shared_space_upsert: getSchema({
    spaceId: z.string(),
    tenantId: z.string(),
    name: z.string(),
    actorUserId: z.string().optional(),
    actorAgentId: z.string().optional(),
    rolloutEnabled: z.boolean().optional(),
    rolloutCohort: z.string().optional(),
    killSwitch: z.boolean().optional(),
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Lifecycle Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// Postflight, learning_history (T303).
import {
  handleMemoryIndexScan,
  handleMemoryIngestStart,
  handleMemoryIngestStatus,
  handleMemoryIngestCancel,
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  handleEvalRunAblation,
  handleEvalReportingDashboard,
  handleSharedMemoryEnable,
  handleSharedMemoryStatus,
  handleSharedSpaceMembershipSet,
  handleSharedSpaceUpsert,
} from '../handlers';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '30,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    30	
    31	export type AdminActorResult =
    32	  | { ok: true; actor: SharedAdminActor }
    33	  | { ok: false; response: MCPResponse };
    34	
    35	/**
    36	 * SECURITY: This function validates format only. Transport-level authentication
    37	 * MUST verify that the caller is the claimed actor before this handler is
    38	 * reached. See P1-1 review finding.
    39	 */
    40	export function resolveAdminActor(
    41	  tool: 'shared_space_upsert' | 'shared_space_membership_set',
    42	  actorUserId?: string,
    43	  actorAgentId?: string,
    44	): AdminActorResult {
    45	  const normalizedUserId = typeof actorUserId === 'string' ? actorUserId.trim() : '';
    46	  const normalizedAgentId = typeof actorAgentId === 'string' ? actorAgentId.trim() : '';
    47	  const hasUser = normalizedUserId.length > 0;
    48	  const hasAgent = normalizedAgentId.length > 0;
    49	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts | sed -n '50,90p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    50	  switch (name) {
    51	    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(validateToolArgs('memory_index_scan', args)));
    52	    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(validateToolArgs('task_preflight', args)));
    53	    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(validateToolArgs('task_postflight', args)));
    54	    case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs<LearningHistoryArgs>(validateToolArgs('memory_get_learning_history', args)));
    55	    case 'memory_ingest_start':        return handleMemoryIngestStart(parseArgs<IngestStartArgs>(validateToolArgs('memory_ingest_start', args)));
    56	    case 'memory_ingest_status':       return handleMemoryIngestStatus(parseArgs<IngestStatusArgs>(validateToolArgs('memory_ingest_status', args)));
    57	    case 'memory_ingest_cancel':       return handleMemoryIngestCancel(parseArgs<IngestCancelArgs>(validateToolArgs('memory_ingest_cancel', args)));
    58	    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
    59	    case 'eval_reporting_dashboard':   return handleEvalReportingDashboard(parseArgs<EvalReportingDashboardArgs>(validateToolArgs('eval_reporting_dashboard', args)));
    60	    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
    61	    case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs<SharedSpaceMembershipArgs>(validateToolArgs('shared_space_membership_set', args)));
    62	    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
    63	    case 'shared_memory_enable':       return handleSharedMemoryEnable(parseArgs<Record<string, unknown>>(validateToolArgs('shared_memory_enable', args)));
    64	    default: return null;
    65	  }
    66	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '700,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   700	  }
   701	
   702	  const governanceDecision = validateGovernedIngest({
   703	    tenantId,
   704	    userId,
   705	    agentId,
   706	    sessionId,
   707	    sharedSpaceId,
   708	    provenanceSource,
   709	    provenanceActor,
   710	    governedAt,
   711	    retentionPolicy,
   712	    deleteAfter,
   713	  });
   714	
   715	  if (!governanceDecision.allowed) {
   716	    recordGovernanceAudit(database, {
   717	      action: 'memory_save',
   718	      decision: 'deny',
   719	      tenantId,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts | sed -n '498,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   498	export function assertSharedSpaceAccess(
   499	  database: Database.Database,
   500	  scope: ScopeContext,
   501	  spaceId: string,
   502	  requiredRole: SharedRole = 'viewer',
   503	): { allowed: boolean; reason?: string } {
   504	  const normalizedScope = normalizeScopeContext(scope);
   505	  const auditAccessDecision = (
   506	    decision: 'allow' | 'deny',
   507	    reason: string,
   508	    metadata?: Record<string, unknown>,
   509	  ): void => {
   510	    try {
   511	      recordGovernanceAudit(database, {
   512	        action: 'shared_space_access',
   513	        decision,
   514	        reason,
   515	        tenantId: normalizedScope.tenantId,
   516	        userId: normalizedScope.userId,
   517	        agentId: normalizedScope.agentId,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts | sed -n '80,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    80	  };
    81	}
    82	
    83	/** Provides open aiprovider. */
    84	export class OpenAIProvider implements IEmbeddingProvider {
    85	  private readonly apiKey: string;
    86	  readonly baseUrl: string;
    87	  readonly modelName: string;
    88	  readonly dim: number;
    89	  readonly timeout: number;
    90	  isHealthy: boolean;
    91	  requestCount: number;
    92	  totalTokens: number;
    93	
    94	  constructor(options: OpenAIOptions = {}) {
    95	    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
    96	    this.baseUrl = options.baseUrl || process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
    97	    this.modelName = options.model || process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    98	    this.dim = options.dim || MODEL_DIMENSIONS[this.modelName] || DEFAULT_DIM;
    99	    this.timeout = options.timeout || REQUEST_TIMEOUT;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts | sed -n '12,40p;108,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    12	
    13	const DEFAULT_MODEL: string = 'voyage-4';
    14	const DEFAULT_DIM: number = 1024;
    15	const DEFAULT_BASE_URL: string = 'https://api.voyageai.com/v1';
    16	const REQUEST_TIMEOUT: number = 30000;
    17	
    18	// Config: honor VOYAGE_BASE_URL for startup validation, not just runtime
    19	export function resolveVoyageBaseUrl(baseUrl?: string): string {
    20	  if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
    21	    return baseUrl.trim();
    22	  }
    23	
    24	  if (typeof process.env.VOYAGE_BASE_URL === 'string' && process.env.VOYAGE_BASE_URL.trim().length > 0) {
    25	    return process.env.VOYAGE_BASE_URL.trim();
    26	  }
    27	
    28	  return DEFAULT_BASE_URL;
    29	}
    30	
    31	/** Defines model dimensions. */
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/embeddings/factory.ts | sed -n '432,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   432	 */
   433	export const VALIDATION_TIMEOUT_MS: number = 5000;
   434	
   435	/**
   436	 * Validate API key at startup before any tool usage.
   437	 * REQ-029: Pre-Flight API Key Validation
   438	 *
   439	 * This function should be called during MCP server startup to fail fast
   440	 * if the configured embedding provider has an invalid API key.
   441	 */
   442	export async function validateApiKey(options: { timeout?: number } = {}): Promise<ApiKeyValidationResult> {
   443	  const timeoutMs = options.timeout || VALIDATION_TIMEOUT_MS;
   444	  const resolution = resolveProvider();
   445	  const providerName = resolution.name;
   446	
   447	  // Local providers don't need API key validation
   448	  if (providerName === 'hf-local') {
   449	    return {
   450	      valid: true,
   451	      provider: providerName,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/paths.ts | sed -n '44,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    44	    return fromPackageJson;
    45	  }
    46	
    47	  const fromCwd = findUp(process.cwd(), hasPackageJson);
    48	  return fromCwd || path.resolve(__dirname, '..');
    49	}
    50	
    51	export function resolveDatabaseDir(): string {
    52	  const configuredDir = getDbDir();
    53	  if (configuredDir) {
    54	    return path.resolve(process.cwd(), configuredDir);
    55	  }
    56	  return path.join(resolvePackageRoot(), 'mcp_server', 'database');
    57	}
    58	
    59	const DEFAULT_DB_PATH = path.join(resolveDatabaseDir(), 'context-index.sqlite');
    60	
    61	/** Defines database path. */
    62	export const DB_PATH: string = (() => {
    63	  const configuredPath = process.env.MEMORY_DB_PATH?.trim();
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/config.ts | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Config
     3	// ---------------------------------------------------------------
     4	
     5	import fs from 'fs';
     6	import path from 'path';
     7	
     8	/** Get db dir. */
     9	export function getDbDir(): string | undefined {
    10	  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
    11	}
    12	
    13	function findUp(filename: string, startDir: string): string | undefined {
    14	  let dir = startDir;
    15	  while (true) {
    16	    if (fs.existsSync(path.join(dir, filename))) return dir;
    17	    const parent = path.dirname(dir);
    18	    if (parent === dir) return undefined;
    19	    dir = parent;
    20	  }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js | sed -n '24,90p;250,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '176,220p;560,650p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    24	const SESSION_SAMPLES = 800;
    25	const CAUSAL_SAMPLES = 800;
    26	const EXTRACTION_SAMPLES = 600;
    27	const BASELINE_COMPARE_SAMPLES = 700;
    28	const LOAD_TEST_CONCURRENCY = 1000;
    29	function parseArgs() {
    30	    const [, , specFolder] = process.argv;
    31	    if (!specFolder) {
    32	        throw new Error('Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/evals/run-performance-benchmarks.ts <spec-folder-relative-path>');
    33	    }
    34	    return { specFolder };
    35	}
    36	function resolveSpecFolderPath(specFolder) {
    37	    if (path_1.default.isAbsolute(specFolder)) {
    38	        return specFolder;
    39	    }
    40	    const direct = path_1.default.resolve(process.cwd(), specFolder);
    41	    if (fs_1.default.existsSync(direct)) {
    42	        return direct;
    43	    }
 succeeded in 0ms:
   176	  }
   177	}
   178	
   179	/* ───────────────────────────────────────────────────────────────
   180	   2. DATABASE PATH AND SECURITY
   181	----------------------------------------------------------------*/
   182	
   183	// F4.04/F8.02 fix: Use centralized DB path from core/config.ts
   184	// Legacy env vars (MEMORY_DB_DIR, MEMORY_DB_PATH) are still honored as overrides
   185	// for backward compatibility, but the canonical source is resolveDatabasePaths().
   186	const DEFAULT_DB_DIR = DATABASE_DIR;
   187	/** Default path for the vector-index database file. */
   188	export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH || DATABASE_PATH;
   189	const DB_PERMISSIONS = 0o600;
   190	
   191	function resolve_database_path() {
   192	  if (process.env.MEMORY_DB_PATH) {
   193	    return process.env.MEMORY_DB_PATH;
   194	  }
   195	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js | sed -n '16,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    16	    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    17	    /^v?\d+\.\d+\.\d+$/,
    18	];
    19	function parseArgs() {
    20	    const [, , specFolder] = process.argv;
    21	    if (!specFolder) {
    22	        throw new Error('Usage: ts-node scripts/evals/run-redaction-calibration.ts <spec-folder-relative-path>');
    23	    }
    24	    return { specFolder };
    25	}
    26	function tokenize(text) {
    27	    return text.split(/\s+/).map((t) => t.trim()).filter(Boolean);
    28	}
    29	function isLikelyFalsePositive(value) {
    30	    return NON_SECRET_FP_PATTERNS.some((pattern) => pattern.test(value));
    31	}
    32	function evaluateFile(filePath) {
    33	    const input = fs_1.default.readFileSync(filePath, 'utf8');
    34	    const result = loadRedactionGate()(input);
    35	    const tokens = tokenize(input);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js | sed -n '12,90p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    12	const fs_1 = __importDefault(require("fs"));
    13	const path_1 = __importDefault(require("path"));
    14	const child_process_1 = require("child_process");
    15	function parseArgs() {
    16	    const [, , specFolder] = process.argv;
    17	    if (!specFolder) {
    18	        throw new Error('Usage: ts-node scripts/evals/collect-redaction-calibration-inputs.ts <spec-folder-relative-path>');
    19	    }
    20	    return { specFolder };
    21	}
    22	function runCommand(spec) {
    23	    const result = (0, child_process_1.spawnSync)(spec.command, spec.args, {
    24	        cwd: spec.cwd,
    25	        encoding: 'utf8',
    26	        shell: false,
    27	    });
    28	    const stdout = result.stdout || '';
    29	    const stderr = result.stderr || '';
    30	    const code = typeof result.status === 'number' ? result.status : -1;
    31	    return [
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts | sed -n '150,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   150	      `[memory-ingest] Dropped ${paths.length - withinLength.length} path(s) longer than ${MAX_PATH_LENGTH} characters`,
   151	    );
   152	  }
   153	  paths = withinLength;
   154	
   155	  if (paths.length === 0) {
   156	    throw new Error('paths must be a non-empty array of file paths');
   157	  }
   158	
   159	  const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
   160	  const derivedAllowedBasePath = configuredMemoryRoot && configuredMemoryRoot.trim().length > 0
   161	    ? path.resolve(process.cwd(), configuredMemoryRoot)
   162	    : path.resolve(path.dirname(DATABASE_PATH));
   163	  const allowedBasePaths = Array.from(
   164	    new Set([derivedAllowedBasePath, ...ALLOWED_BASE_PATHS].map((basePath) => path.resolve(basePath))),
   165	  );
   166	
   167	  const normalizedPaths: string[] = [];
   168	  const invalidPaths: Array<{ input: string; reason: string }> = [];
   169	
