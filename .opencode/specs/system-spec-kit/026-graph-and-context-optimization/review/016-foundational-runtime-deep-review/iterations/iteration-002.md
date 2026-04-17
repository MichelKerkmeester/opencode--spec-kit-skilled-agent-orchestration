# Iteration 2 — Security

## Dispatcher

- iteration: 2 of 7
- dispatcher: task-tool / @deep-review / claude-opus-4-7
- session_id: 2026-04-17T120827Z-016-phase017-review
- timestamp: 2026-04-17T10:55:00Z

## Files Reviewed

- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
- `.opencode/skill/system-spec-kit/shared/predicates/boolean-expr.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`

## Investigation Thread

Targeted security pass against the six adversarial-input surfaces in this iteration's brief:

1. `gate-3-classifier.ts` prompt-injection surface — unicode normalization, read-only disqualifier bypass
2. `boolean-expr.ts` field lookup path — prototype pollution vectors (`__proto__`, `constructor`)
3. `escapeProvenanceField` adversarial corpus — confirmed `sanitizeRecoveredPayload` is the layer that handles control chars
4. `reconsolidation-bridge.ts` scope-guard — validated empty-string scope-writer behavior
5. `session-bootstrap/resume/health` trust boundaries — session-ID forgery for cross-session cache retrieval
6. `manual-playbook-runner.ts` injection defense — confirmed `lastJobId` sanitizer allowlist
7. Skill routing command bridges — case-sensitivity and unicode bypass

Cross-referenced Phase 017 remediation for completeness: `normalizeScopeMatchValue` (`types.ts:348-352`) and `normalizeScopeValue` (`reconsolidation-bridge.ts:228-234`) both collapse empty-string to `null` symmetrically, and `buildScopePostInsertMetadata` (`create-record.ts:158-172`) omits null-scope fields entirely. This narrows R1-P1-001's exposure: iteration 1's scope-CAS concern requires a writer that sets `tenant_id=''` at the DB layer directly, bypassing both normalizers — no such writer exists in this codebase (all writers flow through these normalizers). Downgrades R1-P1-001 confidence, but the defense-in-depth gap remains.

## Findings

### P0 Findings

None. No security-critical privilege escalation, remote code execution, or authentication bypass was found. The most severe finding (cross-session cache leakage) requires local filesystem access plus knowledge of a target session ID, which limits blast radius to a single multi-tenant box.

### P1 Findings

1. **`session_resume` accepts attacker-supplied `sessionId` that causes cross-session cached-summary leakage** — `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:455`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:459`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:493-593` — `handleSessionResume` takes `args.sessionId` verbatim from the MCP caller and passes it as `claudeSessionId` into `getCachedSessionSummaryDecision`, which calls `loadMatchingStates({ scope: { claudeSessionId: args.sessionId } })`. `loadMatchingStates` scans the full `${tmpdir()}/speckit-claude-hooks/<project-hash>/` directory and returns every state file whose persisted `state.claudeSessionId` field matches the scope (line 459). The file-lookup path is not used — matching is done by reading each `.json`'s contents and comparing the in-file `claudeSessionId` string. There is no authentication binding the caller's actual session to the requested `sessionId`. An attacker with local MCP access (e.g. a second Claude Code runtime on the same box, a compromised CLI process, or a multi-tenant sandbox breakout) who learns a target session ID can retrieve that session's `sessionSummary.text`, `producerMetadata.transcript.{path,fingerprint,sizeBytes}`, `pendingCompactPrime.payload`, and `lastSpecFolder`. The `transcriptPath` in particular is sensitive because it leaks the filesystem layout of the target session, and `pendingCompactPrime.payload` contains the compact-cached conversation context. The fail-closed scope guard at `hook-state.ts:501` correctly rejects calls with no scope, but explicitly accepts `claudeSessionId` alone — satisfying the guard requires only providing any session ID string.

    Severity rationale: this is NOT full session impersonation (the attacker cannot write state under the target session), but is a DATA DISCLOSURE class defect that leaks recoverable context for cross-session prompt reconstruction. On a shared-tenant host, this could allow a low-privileged MCP client to read a higher-privileged session's pending compact payload. Classified P1 (not P0) because: (a) requires filesystem locality to the MCP server's tmpdir, (b) requires knowing or guessing a 36-char Claude session UUID, (c) T-SRS-03 (R38-001 extension) documents the per-candidate fallback as an intentional feature, so the scope binding was an oversight rather than an active regression.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "handleSessionResume trusts args.sessionId without authentication, enabling cross-session retrieval of cached session summaries, producer metadata, and compact payloads via loadMatchingStates content-matching on state.claudeSessionId.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:443-456",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:369-375",
        ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:454-463",
        ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:493-593",
        ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:501"
      ],
      "counterevidenceSought": "Searched for authentication or session-binding logic in the MCP tool entrypoint (tools/lifecycle-tools.ts:67, context-server.ts:376-378). The caller's actual session is not passed into handleSessionResume; only args.sessionId is trusted. Searched for a capability-style sessionId validator — none exists.",
      "alternativeExplanation": "Filesystem ACL (mkdirSync mode 0o700 at line 179) limits cross-UID reads on POSIX, so the blast radius is same-UID processes only. On single-user dev machines, this is zero-impact. On multi-tenant hosts or containerized runtimes that share a UID, this is a real data leak.",
      "finalSeverity": "P1",
      "confidence": 0.82,
      "downgradeTrigger": "If the MCP server is documented to run only as single-user on single-tenant hosts, this downgrades to P2 defense-in-depth. If session-binding is added at the MCP transport layer, this resolves."
    }
    ```

2. **`gate-3-classifier.ts` `normalizePrompt` applies only `toLowerCase + whitespace collapse` — no Unicode normalization, enabling homoglyph + zero-width + soft-hyphen bypass of Gate 3 file-write triggers** — `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:145-152`, `:158-165`, `:180-234` — `normalizePrompt` returns `prompt.toLowerCase().replace(/\s+/g, ' ').trim()`. `tokenizePrompt` then splits on `/[^a-z0-9:/_-]+/`. Neither step applies `.normalize('NFKC')`, strips zero-width characters (`\u200B-\u200F`, `\uFEFF`), soft hyphens (`\u00AD`), or detects Cyrillic/Greek homoglyphs.

    Attack examples (all of which should trigger `file_write_match` but do NOT because the token comparison is bytewise after toLowerCase):
    - `"cr\u0435ate foo.md"` — Cyrillic 'е' (U+0435) replaces Latin 'e'. `tokenizePrompt` keeps `cr<U+0435>ate` as a single token; `tokens.includes('create')` returns false; Gate 3 is bypassed.
    - `"cre\u00ADate a new file"` — soft hyphen between 'cre' and 'ate'. `tokenizePrompt` splits on the non-alphanumeric soft hyphen and emits tokens `['cre', 'ate', 'a', 'new', 'file']`. `tokens.includes('create')` returns false; Gate 3 is bypassed.
    - `"c\u200Breate foo"` — zero-width space inside 'create'. Same split-bypass.

    Cross-reference: `trigger-matcher.ts:600-605` and `contamination-filter.ts:172` DO apply `.normalize('NFC')` / `.normalize('NFKC')` for trigger-phrase matching and content sanitization, so the codebase has the pattern. The Gate 3 classifier is an outlier. Because Gate 3 is the machine contract that CODEX.md, CLAUDE.md, AGENTS.md, and GEMINI.md cite as authoritative, an LLM (or a human writing a prompt) that emits a homoglyph or soft-hyphen-laced verb will skip the Gate 3 prompt entirely and proceed to Read/Edit/Write without the spec-folder question. This is a governance-bypass vector, not a code-exec vector, but it defeats the Four Laws gating for any attacker able to influence the prompt.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "gate-3-classifier.normalizePrompt lacks Unicode NFKC normalization and zero-width / soft-hyphen stripping, allowing crafted prompts using Cyrillic 'е' or U+00AD / U+200B to bypass file_write token detection and skip Gate 3.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:145-147",
        ".opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:150-152",
        ".opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:158-165",
        ".opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:600-605",
        ".opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:172"
      ],
      "counterevidenceSought": "Checked for a Unicode-normalization layer upstream of classifyPrompt — no such layer exists. classifyPrompt is the entry point called by runtime hooks with raw user text. The Gate 3 vocabulary is lowercased pattern matching only. Read-only disqualifiers ('review', 'audit', etc.) have the same gap, but those disqualifiers OVERRIDE file_write detection, so a homoglyph bypass here is one-sided: attacker can force Gate 3 to skip, but not to fire spuriously.",
      "alternativeExplanation": "The 'Gate 3' question is advisory (AI asks human to confirm spec folder). A runtime that uses classifyPrompt purely for deciding whether to ask a question, and the human still has ultimate control, would treat this as UX only. But the CLAUDE.md contract makes Gate 3 a HARD BLOCK on file modification, so an LLM that trusts the classifier will skip asking.",
      "finalSeverity": "P1",
      "confidence": 0.88,
      "downgradeTrigger": "If a higher-layer sanitizer normalizes all user input before it reaches classifyPrompt, this downgrades to P2. Adding .normalize('NFKC') + /[\\u00AD\\u200B-\\u200F\\uFEFF]/g stripping inside normalizePrompt would close the bypass."
    }
    ```

### P2 Findings

1. **`sanitizeRecoveredPayload` strip patterns match bytewise — Unicode/homoglyph-laced injection lines slip through** — `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:100-119`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:113-118` — The five regexes at lines 100-106 match the ASCII forms of `system:`, `developer:`, `assistant:`, `user:`, `You are`, `Ignore previous`, etc. They do NOT apply `.normalize('NFKC')` before matching. A cached compact payload that contains `"SYST\u0395M: hidden instruction"` (Greek capital Epsilon U+0395 in place of Latin 'E') will NOT be stripped by `RECOVERED_TRANSCRIPT_STRIP_PATTERNS[0]` (`/^\s*(?:system|developer|assistant|user)\s*:/i`) because the regex's `system` literal matches only ASCII bytes after case folding; the Greek epsilon remains. The line then passes through to `wrapRecoveredCompactPayload` and gets embedded inside the `[SOURCE: hook-cache, ...]` wrapper as legitimate recovered content. A downstream LLM consumer that tokenizes and honors the line as a system prompt gets prompt-injected.

    Impact bound: this only matters if attacker can write into the hook-state file at `${tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json`, which is mode 0o600 + 0o700 dir, so cross-UID writes are blocked on POSIX. However, a same-UID adversary (second runtime, compromised sibling process) can poison the state file and achieve cross-session prompt injection via the `pendingCompactPrime.payload`. Classified P2 because mode 0o600 blocks the cross-UID vector and same-UID attackers already have broader capabilities. P1 finding #1 above is the more exploitable sibling.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "sanitizeRecoveredPayload regexes match only ASCII forms of 'system'/'developer'/'assistant'/'user', so Unicode homoglyph-laced injection lines (e.g. Greek 'Ε' U+0395 replacing Latin 'E') are not stripped.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:100-106",
        ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:113-118",
        ".opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:53-76"
      ],
      "counterevidenceSought": "Regression test T-GSH-01 (lines 53-76 of hook-session-start.vitest.ts) exercises ASCII variants only: 'SYSTEM:', '[developer]:', 'You are a system prompt', 'Ignore previous instructions', etc. No test exercises homoglyph or RTL-override variants.",
      "alternativeExplanation": "If the upstream producer of pendingCompactPrime.payload (hook-session-stop.ts) writes only trusted content from the Claude transcript, homoglyph injection requires attacker-controlled transcript — a higher bar. On single-tenant dev machines the practical exposure is zero.",
      "finalSeverity": "P2"
    }
    ```

2. **`boolean-expr.evaluateBooleanExpr` field-lookup is correctly guarded against prototype-pollution, but `scalarsEqual` TRUE/FALSE-string coercion is a latent typing trap** — `.opencode/skill/system-spec-kit/shared/predicates/boolean-expr.ts:242`, `:372-379` — Line 242 uses `Object.prototype.hasOwnProperty.call(bindings, expr.field)` which correctly rejects lookups on `__proto__`, `constructor`, `toString` when they are inherited. Prototype-pollution from an attacker who sets `Object.prototype.tenantAdmin = true` globally WOULD be rejected by this guard (since `tenantAdmin` would not be own-property on `bindings`). Good.

    However, `scalarsEqual` at lines 376-378 coerces the ASCII strings `'TRUE'` and `'FALSE'` to equal the boolean primitives `true` and `false` for "forward compatibility with legacy string-literal payloads". This means a workflow binding value of the string `'TRUE'` (from e.g. a legacy YAML intake payload) compares equal to `true` in a predicate. If an author writes `when: { field: isAdmin, op: "==", value: true }` expecting a strict boolean check, and a legacy caller passes `isAdmin: 'TRUE'` (string), the predicate silently succeeds. Conversely, if the contract tightens and the legacy coercion is removed, predicates that relied on the string-to-bool equivalence will suddenly fail closed. This is not a current exploitable bug, but it is a typing-contract footgun that amplifies the blast radius of any future schema change. Classified P2.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "scalarsEqual's TRUE/FALSE-to-boolean coercion (lines 376-378) is an intentional compatibility shim but creates a silent predicate-success surface where string 'TRUE' equals boolean true, violating caller expectations of strict typed comparison.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/shared/predicates/boolean-expr.ts:372-379",
        ".opencode/skill/system-spec-kit/shared/predicates/boolean-expr.ts:242-245"
      ],
      "counterevidenceSought": "The `Object.prototype.hasOwnProperty.call` guard at line 242 correctly prevents prototype-pollution field reads. No RCE or privilege bypass was found in the predicate evaluator itself.",
      "alternativeExplanation": "The comment at line 374-375 explicitly describes this as forward-compat shim. If all current callers honor the convention, this is documentation-only. But the shim is asymmetric (only TRUE/FALSE, not 'true'/'True'/'false'/'False') which creates inconsistency with parseScalarLiteral's own casing rules (line 327-332) that reject lowercase variants.",
      "finalSeverity": "P2"
    }
    ```

3. **`gate-3-classifier.classifyPrompt` read-only disqualifier override accepts any readOnly match to suppress file_write — including spurious matches on `review` or `audit` appearing in unrelated context** — `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:223-231` — The logic at lines 226-231 flips `triggersGate3` to `false` whenever `readOnlyMatched.length > 0` AND `hasFileWrite` is true. The doc comment at lines 223-225 says this is intentional "when the file-write token appears alongside a read-only verb like 'review', 'audit', 'inspect'". But the matching is not coreference-aware: a prompt like `"fix the typo in the review comment on line 42"` contains both `fix` (file_write token) and `review` (read-only token). The classifier returns `triggersGate3: false, reason: 'read_only_override'` — but the user is asking for a fix (write), not a review (read). Gate 3 is skipped despite a real file modification being requested.

    Contrast with the `hasMemorySave`/`hasResume` branches at lines 216-221 which ALWAYS require Gate 3 (cannot be overridden). That asymmetry is correct for write-producing flows but leaves `file_write` over-broadly dismissible by unrelated vocabulary. A token-coreference or proximity check would narrow this — e.g. only override if the read-only token is within N tokens of the file_write verb, not just anywhere in the prompt. Classified P2 because the exposure is "user intent misclassification", not a privilege-escalation vector; the human can always manually re-ask Gate 3. Reinforces the sycophancy risk in AI flows that trust the classifier.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "classifyPrompt's read_only_override fires whenever any read-only token appears in the prompt, even when the read-only verb is unrelated to the actual file-write intent (e.g. 'fix the typo in the review comment'), leading to false-negative Gate 3 skips.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:223-231",
        ".opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:167-178",
        ".opencode/skill/system-spec-kit/shared/gate-3-classifier.ts:121-127"
      ],
      "counterevidenceSought": "Searched for a coreference or proximity check — none exists. The existing behavior is documented as intentional for prompts like 'review the code' or 'analyze the decomposition phase', but those should ideally be matched by the absence of file_write tokens entirely, not by superposition with them.",
      "alternativeExplanation": "Human operators routinely disambiguate by asking follow-up questions, and Gate 3 being skipped is recoverable (the AI can still ask 'which spec folder?' at Gate 1). Treating this as P0/P1 would over-penalize a UX choice.",
      "finalSeverity": "P2"
    }
    ```

## Traceability Checks

- **spec -> code (Gate 3 classifier)**: partial — T-DOC-02/T-DOC-03 (R41-002/R45-001/R47-001/R48-001) land the typed module and the classifier contract, but neither the spec nor T-TEST-NEW-* regression tests cover Unicode/NFKC input classes. Gate 3 is cited as "machine contract" in root docs without specifying the character-set contract. Documented as P1 finding #2 above.
- **spec -> code (boolean-expr grammar)**: pass — T-YML-PLN-02 / T-YML-PLN-04 / T-YML-CMP-01 define typed shape, and `validateBooleanExpr` + `parseBooleanExprString` enforce shape + operator allowlist correctly. The `hasOwnProperty.call` guard at line 242 is correct.
- **spec -> code (escapeProvenanceField)**: pass — T-GSH-01 (R45-003) requires `encodeURIComponent` on the three provenance fields; code at `shared.ts:108-110` implements it; test at `hook-session-start.vitest.ts:90-105` exercises the adversarial corpus `'hook_cache]\\n[FORGED: yes]'` and confirms percent-encoding. Sanitization of the payload BODY (not provenance) is separately handled by `sanitizeRecoveredPayload`; the P2 finding #1 above is about that layer, not the provenance layer.
- **spec -> code (reconsolidation scope-guard)**: pass — normalizers on both sides (`normalizeScopeMatchValue`, `normalizeScopeValue`) collapse empty-string to null symmetrically. `buildScopePostInsertMetadata` conditionally omits null fields. The R1-P1-001 empty-string-writer scenario requires bypassing BOTH normalizers at the DB layer, which no code path in this codebase does. R1-P1-001's exposure is narrower than iteration 1 assessed.
- **spec -> code (manual-playbook-runner injection defense)**: pass — T-MPR-RUN-04 (R46-003) requires allowlist sanitization on `lastJobId`; code at `manual-playbook-runner.ts:632-638` uses `/^[A-Za-z0-9_-]{1,64}$/` and throws a structured error on rejection (lines 646-656). Tokenizer cannot reach the substituted source. Confirmed clean.

## Confirmed-Clean Surfaces

- `manual-playbook-runner.ts:sanitizeJobIdForSubstitution` — allowlist correctly rejects newlines, quotes, spaces, shell metachars. The throw at line 651-656 surfaces adversarial payloads rather than silently dropping them.
- `boolean-expr.ts:evaluateBooleanExpr` field-lookup guard — `hasOwnProperty.call` correctly blocks prototype-walk reads; attacker-controlled `field` values like `__proto__` or `constructor` return `ok: false` instead of leaking inherited properties.
- `shared.ts:escapeProvenanceField` — `encodeURIComponent` is the correct primitive for the PROVENANCE marker field; it handles control chars, RTL overrides, null bytes, embedded brackets, and very long strings uniformly. Regression test T-GSH-01 confirms the adversarial corpus.
- `hook-state.ts:getStatePath` — sha256 hash of `sessionId` (line 172) eliminates path-traversal; the unhashed sessionId never reaches the filesystem as a path component.
- `hook-state.ts:loadMatchingStates` scope-unknown-fail-closed — line 501-518 correctly rejects zero-scope calls. However, the single-scope-dimension accept (either specFolder OR claudeSessionId is sufficient) is the surface that enables P1 finding #1.
- `reconsolidation-bridge.ts:findScopeFilteredCandidates` scope matching — `candidateMatchesRequestedScope` (line 286-293) uses `normalizeScopeValue` on BOTH sides symmetrically, so the empty-string-vs-null edge case cannot bypass scope in this code path. Iteration 1's R1-P1-001 over-estimated exposure.
- `create-record.ts:buildScopePostInsertMetadata` — conditionally omits null scope fields (lines 167-170), so a request with no tenant/user/agent/session does not write empty-string sentinels into the DB.
- `session-resume.ts:evaluateCachedSessionSummaryCandidate` transcript-identity check — stat-based sha256 fingerprint at line 149-158 and mismatch detection at line 269-279 correctly fail-closed on transcript tampering. Good.

## Confirmed Already-Known (cross-reference to iteration 1 + closing-pass-notes)

- R1-P1-001 (empty-string scope CAS bypass) — exposure NARROWED by this iteration: both normalizers collapse empty-to-null, and `buildScopePostInsertMetadata` omits null fields. No codepath writes empty-string scope. This is a defense-in-depth note, not an exploitable gap. Recommend downgrading to P2 in the synthesis pass.
- R1-P1-002 (partial_causal_link_unresolved infinite-retry pairing) — out of security scope for iteration 2; carry forward for iteration 3 or 4.
- R1-P2-001 (cleanStaleStates close->unlink TOCTOU window) — out of scope; security-adjacent but low blast radius, carry forward.
- CP-001..CP-004 — not re-reviewed this iteration.

## Convergence Signal

- Novel findings this iteration: 5 (2 P1, 3 P2)
- newFindingsRatio calculation (severity-weighted):
  - Prior cumulative weighted total = (2 P1 from iter 1) * 5.0 + (3 P2 from iter 1) * 1.0 = 13.0
  - New this iteration = (2 P1) * 5.0 + (3 P2) * 1.0 = 13.0
  - newFindingsRatio = 13.0 / (13.0 + 13.0) = 0.50
  - P0 override: no new P0, so no floor applied
- No convergence yet — iteration 2 added meaningful new P1 surfaces in a different dimension (security) with no overlap.
- ruledOut this iteration: ["sanitizeRecoveredPayload ASCII-injection coverage (pass)", "escapeProvenanceField adversarial corpus (pass via T-GSH-01 test)", "manual-playbook-runner lastJobId allowlist bypass (pass)", "boolean-expr prototype pollution via __proto__/constructor (pass - hasOwnProperty guard)", "reconsolidation-bridge empty-string scope writer (narrowed: symmetric normalization eliminates exposure)"]

## Next Iteration Angle

Iteration 3 should pivot to TRACEABILITY dimension:

- Re-verify iteration 1's R1-P1-001 with the narrowed exposure from this iteration — propose downgrade to P2 unless a direct-DB writer is found.
- Cross-reference the 27 fix(016) commits against the claimed T-* task IDs: are all T-YML-*, T-SST-*, T-RCB-*, T-SHP-*, T-SBS-* tasks actually landed in the cited files?
- Verify `graph-metadata.json` refresh path: do `description.json` + `graph-metadata.json` get produced for every spec-folder modification in Phase 017?
- Check `implementation-summary.md` presence and `checklist.md` completeness for Phase 017 (the meta-tasks `T-DOC-02` / `T-DOC-03` cited in Gate 3 classifier comments should trace back to checklist items).
- Audit closing-pass-notes CP-001..CP-004 against the actual remediation state (did CP-002 `graph-lifecycle.ts:onIndex()` ship, or is it deferred?).

Iteration 4 should pivot to MAINTAINABILITY:

- Assess code clarity of the 5 new security-hardening layers (gate-3-classifier, boolean-expr, escapeProvenanceField, sanitizeJobIdForSubstitution, loadMatchingStates).
- Look for over-complication or duplicated normalization logic between `normalizeScopeValue` and `normalizeScopeMatchValue`.
- Check that YAML predicate grammar (boolean-expr) docs match runtime behavior.

## Assessment

- Security posture of Phase 017 is solid on the P0 composites (input validation is present, allowlist-based, and fail-closed on the hot paths). The hardening added by T-GSH-01, T-MPR-RUN-04, and the Zod schemas is real and effective.
- The two P1 findings (session-ID-forgery cross-session leak, Gate 3 unicode bypass) are NEW exposures not caught by iteration 1. They represent different attack classes: one is local-MCP data disclosure, the other is governance-contract bypass.
- Three P2 findings reinforce the theme: sanitization is mostly-ASCII-only, and Unicode normalization is applied inconsistently across the codebase (trigger-matcher has it, gate-3 and sanitizeRecoveredPayload do not).
- R1-P1-001 from iteration 1 is NARROWED — the symmetric normalization closes the exposure at the normalizer layer, so the CAS-bypass claim requires a direct-DB writer that bypasses both normalizers. No such writer exists. Recommend downgrade.
- No new P0 surfaces found.
