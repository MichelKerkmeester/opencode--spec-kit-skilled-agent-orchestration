# Iteration 002 — security

## Dispatcher
- iteration: 2 of 7
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-23T00:00:00Z
- session: 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)

## Summary
Threat-model review focused on SQL injection, path traversal, DoS, privilege boundaries, log injection, supply chain, and race conditions. No pre-auth RCE or P0-grade exploit found on the primary surfaces (SQL is fully parameterized; DB path is URL-resolved and not CLI-controllable). Three new P1 findings: (a) log-injection risk in the save-time downgrade warning (file_path goes straight into a structured console.warn field with no newline/control-char stripping), (b) threat-model divergence — the save-time guard silently downgrades `constitutional` → `important` and continues indexing content, rather than rejecting, which still leaks a file's content into the index with no audit trail; and (c) walker DoS via unbounded readdirSync recursion and per-directory whole-file `.gitignore` reads, giving an attacker who can write files into any scanned path (e.g., via a malicious PR) an easy local resource exhaustion vector. Three new P2 findings around cleanup log disclosure, cleanup output non-machine-readability, and supply-chain trust of `sqlite-vec` dynamic extension load. Most iter-1 correctness findings also have security dimensions (symlink bypass = privilege escalation; LIKE pattern divergence = cleanup miss; no-idempotence = audit confusion) but I do not re-report them; I flag the stronger security framing in Cross-reference.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (guard + entry path)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` (walker)
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` (README/isMemoryFile)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` (code-graph walker, specificFiles)
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`

## Findings - New

### P0 Findings
- None. No exploitable pre-auth RCE, SQL injection, or unauthenticated data exposure. The cleanup script DB_PATH is resolved via `import.meta.url` (not CLI-controllable), all DB access is via `better-sqlite3` prepared statements with placeholders, and the save-time guard is unconditional on the canonical resolved path.

### P1 Findings

1. **Log-injection in save-time downgrade WARN** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:311-313` — `console.warn('[memory-save] importance_tier=constitutional rejected for non-constitutional path; downgrading to important', { file_path: parsed.filePath })` logs the raw parser-supplied path. `parsed.filePath` originates from user-controlled frontmatter / caller input and is not newline/control-char stripped before logging. A `file_path` containing `"\n[memory-save] IMPORTANT: fake log line"` forges a log entry that security tooling may parse as a separate event. Ditto for the `[memory]` warnings at 319-320 (`path.basename(parsed.filePath)` — basename limits to last segment so partial mitigation, but basename still permits newlines inside a filename component on POSIX). Fix: `filePath.replace(/[\r\n\x00-\x1f]/g, '?')` before logging, or use a structured logger that encodes control chars.

```json
{
  "claim": "The save-time downgrade WARN logs parser-controlled file_path verbatim; a path containing newline / control characters can inject forged log lines, undermining log-based audit.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:311", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:319"],
  "counterevidenceSought": "Checked for a central sanitizer wrapper around console.warn — none in scope. Checked whether validateFilePathLocal strips newlines — it validates against ALLOWED_BASE_PATHS (prefix check) and only accepts strings, but does not assert [\\r\\n\\x00] are absent.",
  "alternativeExplanation": "If the downstream log shipper always JSON-encodes the payload (e.g., pino/winston), the injection is neutralized at the shipper. Local `console.warn` writes to stderr as plain text by default and is the observed path here.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "Evidence that all console.warn output is piped through a JSON-encoding shipper before any persistent storage or SIEM."
}
```

2. **Silent tier downgrade still indexes attacker-declared-constitutional content** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:310-315` — The user-stated invariant is "Only documents placed in the dedicated constitutional folder can be marked as constitutional." The current guard downgrades `tier=constitutional` → `important` and continues saving. For the narrow invariant "no constitutional tier outside /constitutional/" this is sufficient. But the broader threat — a compromised spec file declaring itself constitutional to elevate its visibility — is only half-addressed: the file's **content still gets indexed** at tier=`important`, where it will surface in search at a lower auto-rank. If the policy intent is "reject files that declared constitutional outside the folder," downgrade-and-continue silently violates it; if the policy intent is "downgrade silently," there's no governance_audit row, no explicit rejection code, and no way for an operator to distinguish "legitimately important" from "attempted constitutional-tier elevation that was downgraded." Fix options: (a) reject with a structured error carrying a `policy_violation` code, (b) emit a `governance_audit` row with `policy=tier_downgrade, original_tier=constitutional, file_path=<sanitized>`, so the downgrade is auditable and non-silent.

```json
{
  "claim": "The save-time guard downgrades tier silently and continues indexing; an attacker-declared-constitutional file still has its content indexed at tier=important, and no governance audit record is written, leaving the policy violation invisible after the fact.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:310", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:314"],
  "counterevidenceSought": "Searched memory-save.ts for governance_audit insert on this path — none. Searched for a policy-violation exception type — only the generic indexing-excluded Error at 308, which is a different case.",
  "alternativeExplanation": "If the product design intentionally treats tier=constitutional on non-constitutional paths as a benign author mistake (not a security event), downgrading without audit is acceptable. The user-directed invariant in strategy.md frames this as a policy-grade invariant, which argues against silent downgrade.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "A spec-level decision record explicitly stating silent downgrade is preferred to rejection, plus a policy sign-off."
}
```

3. **Walker DoS: unbounded readdirSync recursion + per-directory full .gitignore read** — `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1153-1172`, `1190-1238` — `loadGitignore` calls `readFileSync(gitignorePath, 'utf-8')` for every directory visited and stores matchers in a per-invocation `Map` (no size bound). `findFiles.walk` recurses via `readdirSync({ withFileTypes: true })` with no depth bound and no node-count bound. Attack: place one 50MB `.gitignore` at a deep path or 100k zero-byte files under `specs/test/`, then trigger a code-graph scan. The synchronous I/O blocks the event loop and the Map grows unboundedly. `memory-index-discovery.ts:findGraphMetadataFiles` and `findSpecDocuments` have the same unbounded-recursion pattern minus the .gitignore amplifier. Fix: (a) cap `.gitignore` read size (e.g., 1MB max), (b) cap max-files-per-scan and max-depth with a graceful early-exit, (c) switch to `async` walkers or yield to the event loop.

```json
{
  "claim": "The structural walker performs synchronous recursive readdirSync with no depth / node-count bound and loads whole .gitignore files per directory into an unbounded cache, allowing a local attacker (e.g., malicious PR committer) to exhaust memory or block the event loop.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1162", ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1206", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:68"],
  "counterevidenceSought": "Grepped for max-files / max-depth / size-limit constants — no caps on the walker. The only limit is `maxSize` per-file (skips files larger than threshold). That does not bound directory entry counts or .gitignore content length.",
  "alternativeExplanation": "In a trusted-workspace model where the repo is entirely under operator control, this is a stability concern, not a security one. If the walker is ever run against user-supplied content (PR, untrusted submodule, mounted scratch), it becomes a security bug.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Evidence of a hard cap on walker node count + max .gitignore read size at the call site, or documented trust boundary restricting walker input to first-party content only."
}
```

### P2 Findings

1. **Cleanup console.log reveals full absolute DB path in error message** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:407` — `console.error('[cleanup-index-scope-violations] Error:', error instanceof Error ? error.message : String(error))` can leak the absolute DB path if the error is a better-sqlite3 I/O failure (message embeds the filesystem path). Not a strong data-leak surface (operator-facing), but a CI log published to a public channel would disclose the repo layout under `.opencode/skill/system-spec-kit/mcp_server/database/`. Mostly informational.

2. **Cleanup produces no machine-readable report** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:337-361, 378-405` — `printSummary` / `printApplySummary` write key=value lines to stdout. No JSON output option, no exit-code-distinguishable "clean" vs "applied" beyond `--verify`'s 0/1. Downstream monitoring and compliance-audit pipelines cannot parse this reliably. Fix: add `--json` flag emitting `{ before, plan, applied, after, invariantsHold: boolean }`.

3. **Supply-chain trust: sqlite-vec loaded unconditionally in cleanup** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:6, 374` — `loadSqliteVec(database)` loads the `sqlite-vec` native extension with no integrity check. If the npm package is compromised, running `cleanup-index-scope-violations --apply` executes attacker native code against the live memory DB. Standard npm trust boundary, but worth documenting: this script runs with the same privileges as the MCP server process and touches the canonical DB. Fix: document the trust assumption, and consider gating `--apply` behind a confirmation prompt or env flag.

## Traceability Checks
- **spec_code** protocol: partial — security claims in spec.md (if any) re: downgrade-vs-reject are not yet re-checked against the guard implementation. Deferred to iteration 3 (traceability dimension).
- **checklist_evidence** protocol: not executed — deferred to iteration 3.

## Cross-reference to iter-1
- **P1-003 (symlink bypass, iter-1)** — this is a privilege-escalation vector as well, not just correctness. Any unprivileged writer who can create a symlink inside `specs/` pointing into `/external/` or `/z_future/` defeats the invariant and causes the target to be indexed. Stronger security framing than iter-1's correctness framing. Severity unchanged (P1), but note: if the repo is ever mounted with a user-writable `specs/` (e.g., shared dev container), this is exploitable.
- **P1-001 (TOCTOU, iter-1)** — also a concurrent-write race, not just a single-process correctness issue. No escalation; security adds nothing new beyond iter-1's framing.
- **P1-002 (unverified FTS trigger, iter-1)** — security angle: an attacker with write access to the SQLite file (not trivial, but possible on shared hosts) could drop the trigger, then `--apply` cleanup would leave FTS residue, and subsequent search queries would still surface deleted content. The script should assert trigger existence before trusting it.
- **P1-004 (LIKE divergence, iter-1)** — security angle: a malicious caller storing a row with `file_path = 'z_future/evil.md'` (relative, no leading slash) would bypass cleanup queries while still matching the runtime regex guard. This is an unlikely path today, but it is a cleanup-evasion vector. Severity unchanged; note in Cross-reference.
- **P2-002 (README.md rejection by coincidence)** — security angle: adding `readme.md` to `SPEC_DOCUMENT_FILENAMES_SET` in a future PR would silently open a constitutional-tier ingestion path. Worth pinning with an explicit `basename !== 'readme.md'` guard at the top of `isMemoryFile` (iter-1 already recommends this).

## Confirmed-Clean Surfaces
- **SQL injection**: all cleanup SQL uses `?` placeholders via `database.prepare(...).run(...params)`. No string concatenation of user input into SQL. `placeholders(values)` generates only `?, ?, ?, ...` — no injection vector. `deleteRows` and `deleteRowsByTextMemoryId` use parameterized queries end-to-end.
- **DB_PATH**: resolved via `fileURLToPath(new URL('../../../mcp_server/database/...', import.meta.url))` at cleanup-index-scope-violations.ts:57-59. Not CLI-controllable, not env-controllable. An attacker cannot redirect cleanup against a different DB via CWD or args.
- **Save-time guard reach**: confirmed at both entrypoints (memory-save.ts:2695 pre-validation AND :306 deep path). Defense-in-depth holds for a relative-path caller with no `z_future/external` substring before resolve.
- **README case-sensitivity**: `findConstitutionalFiles` (memory-index-discovery.ts:189) uses `file.name.toLowerCase() === 'readme.md'` — case-insensitive whole-name match. No `readme.MD` / `README.txt` bypass. `memory-parser.ts:957, 974` uses `basename === 'readme.md'` after `.toLowerCase()`. Both case-safe.
- **README.md-as-directory attack**: if an attacker creates `/foo/constitutional/README.md/evil.md`, the walker at `findConstitutionalFiles` treats `README.md` as a directory (it is one). The loop only considers `file.isFile()` entries (line 190), so the attacker's `README.md/` directory is never added as a file; its children would only be considered if the walker recursed into it, but `findConstitutionalFiles` reads a single level of `constitutional/` — no recursion. Clean.
- **Walker exclusion precedence over frontmatter parse**: for `findSpecDocuments` and `findGraphMetadataFiles`, `shouldIndexForMemory(fullPath)` is checked BEFORE the file is added to results; no parser / memory-save call is made for excluded paths. No cache writes, no embedding calls, no trace on z_future/external. Clean.
- **Regex DoS (ReDoS) in index-scope.ts**: `compileSegmentPattern` produces fixed-shape `(^|/)<literal>(/|$)` with no `*`/`+` on nested groups and no backtracking potential. Even with pathological input (5MB string of alternating slashes), execution is linear. No ReDoS. The patterns are compiled from hardcoded segment names (no dynamic user input), eliminating ReDoS-via-input-pattern entirely.

## Coverage
- Dimension: security — covered
- Files reviewed: 6 (see Files Reviewed)
- Remaining dimensions: traceability, maintainability

## Next Focus
**traceability** — map spec.md + checklist.md + decision-record.md claims to code evidence, verify iter-1 and iter-2 findings are reflected in checklist items, confirm spec-level policy statements (e.g., "silent downgrade" vs "reject") match implementation reality. Cross-validate that research.md references the three invariants and any threat-model decisions are recorded in decision-record.md.
