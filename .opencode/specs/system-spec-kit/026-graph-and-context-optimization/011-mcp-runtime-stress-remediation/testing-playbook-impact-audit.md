---
title: "Testing Playbook Impact Audit — phase 011 + child packets 003-015"
description: "Read-only audit of manual testing playbooks against behavior changes ratified in phase 011 and its 15 child packets. Identifies UP-TO-DATE / NEEDS-UPDATE / MISSING / NEW-ENTRY-NEEDED entries across system-spec-kit, cli-* skills, sk-deep-research, sk-deep-review, and the .gemini hardlinked mirror."
audit_date: "2026-04-27"
auditor: "claude-opus-4-7 (1M context)"
read_only: true
scope:
  - .opencode/skill/system-spec-kit/manual_testing_playbook/
  - .opencode/skill/cli-copilot/manual_testing_playbook/
  - .opencode/skill/cli-codex/manual_testing_playbook/
  - .opencode/skill/cli-claude-code/manual_testing_playbook/
  - .opencode/skill/cli-gemini/manual_testing_playbook/
  - .opencode/skill/cli-opencode/manual_testing_playbook/
  - .opencode/skill/sk-deep-research/manual_testing_playbook/
  - .opencode/skill/sk-deep-review/manual_testing_playbook/
  - .gemini/skills/system-spec-kit/manual_testing_playbook/ (hardlinked to .opencode mirror)
---

# Testing Playbook Impact Audit — Phase 011 (MCP Runtime Stress Remediation)

## 1. EXECUTIVE SUMMARY

This audit began as a 2026-04-27 snapshot and is preserved below as historical evidence. Current-state reconciliation on 2026-04-28 shows the manual testing playbooks have since absorbed the high-impact phase-011 surfaces: token-budget envelope, `responsePolicy` / `citationPolicy`, `fallbackDecision`, `readiness.action`, CocoIndex telemetry, IntentTelemetry, cli-copilot target-authority entries, and sk-deep-research / sk-deep-review dispatch coverage now appear in the live playbook roots. The old "0 are fully covered" statement is therefore historical only, not current guidance.

The live system-spec-kit roots are `.opencode/skill/system-spec-kit/feature_catalog/` and `.opencode/skill/system-spec-kit/manual_testing_playbook/`. The `.opencode/skill/sk-doc/...` path named by one cleanup prompt does not exist in this checkout.

## 1A. CURRENT-STATE RECONCILIATION (2026-04-28)

| Area | Live-state result | Evidence |
|------|-------------------|----------|
| Retrieval playbooks | Confirmed current | `01--retrieval/001-unified-context-retrieval-memory-context.md` covers `preEnforcementTokens`, `returnedTokens`, and `droppedAllResultsReason`; `002-semantic-and-lexical-search-memory-search.md` covers `responsePolicy`, `safeResponse`, and `citationPolicy`. |
| Code-graph playbooks | Confirmed current | `22--context-preservation-and-code-graph/254-code-graph-scan-query.md`, `255-cocoindex-code-graph-routing.md`, `264-query-intent-routing.md`, `275-code-graph-readiness-contract.md`, and `277-code-graph-fast-fail.md` cover `readiness.action`, CocoIndex telemetry passthrough, IntentTelemetry, status side-effect freedom, and `fallbackDecision`. |
| cli-copilot authority playbooks | Confirmed current | `cli-copilot/manual_testing_playbook/01--cli-invocation/005-*`, `006-*`, and `05--session-continuity/003-*` cover missing authority, large prompt preamble preservation, and I1 zero-mutation replay. |
| Deep-loop dispatch playbooks | Confirmed current | `sk-deep-research/.../030-cli-copilot-target-authority-dispatch.md` and the matching sk-deep-review entry cover `buildCopilotPromptArg` dispatch routing. |
| Remaining alignment | Still tracked | Packet `018-catalog-playbook-degraded-alignment/` remains in progress and owns remaining degraded-envelope / rankingSignals wording alignment. |

Historical sections below are retained for provenance; use this reconciliation block for current-state guidance.

---

## 2. PER-PHASE IMPACT TABLE

| Phase | Behavior change | Playbook file(s) affected | Status | Recommended action |
|-------|-----------------|---------------------------|--------|---------------------|
| **003** | `memory_context` token-budget envelope: `preEnforcementTokens`, `returnedTokens`, `droppedAllResultsReason` | `.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md` | NEEDS-UPDATE | Add a third "TEST EXECUTION" block asserting envelope fields under under-budget, exact-budget, and over-budget conditions, plus the `droppedAllResultsReason` semantic when ALL results are dropped |
| **004** | cocoindex fork telemetry: `dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score` | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | NEEDS-UPDATE | Add a fourth TEST EXECUTION block asserting cocoindex_code search responses contain `dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score` per result |
| **005** | code-graph fast-fail: `fallbackDecision.nextTool` routing on blocked code-graph reads | (no existing entry) | NEW-ENTRY-NEEDED | Create `22--context-preservation-and-code-graph/277-code-graph-fast-fail.md` covering the four routing branches: empty graph → `code_graph_scan`; broad-stale → `code_graph_scan`; readiness exception → `rg`; fresh → no `fallbackDecision` |
| **006** | causal-graph window metrics: `deltaByRelation`, `balanceStatus`, per-relation per-window cap | `.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/020-causal-graph-statistics-memory-causal-stats.md` | NEEDS-UPDATE | Replace single-line "coverage and edge metrics present" with multi-block scenarios asserting `deltaByRelation` exists for each relation type, `balanceStatus ∈ {balanced, skewed_<dir>, capped}`, and per-window cap surfaces when triggered |
| **007** | intent classifier stability: `IntentTelemetry` shape (normalized across runtimes) | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md` | NEEDS-UPDATE | Add a fourth TEST EXECUTION block asserting the response carries the canonical `IntentTelemetry` envelope shape (intent, confidence, matchedKeywords, classifierVersion, runtimeId) for aggregation across CLI executors |
| **008** | daemon rebuild + live-probe protocol (canonical 4-part: source diff → tests → dist marker → restart → live probe) | (no existing entry) | NEW-ENTRY-NEEDED | Create `16--tooling-and-scripts/278-mcp-daemon-rebuild-restart-live-probe.md` codifying the 4-part verification contract. `references/mcp-rebuild-restart-protocol.md` and `references/live-probe-template.md` exist as the source-of-truth references; the playbook needs the exercising scenario |
| **009** | `memory_search` response policy: `responsePolicy.noCanonicalPathClaims`, `safeResponse`, `citationPolicy` | `.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md` | NEEDS-UPDATE | Add a third "TEST EXECUTION" block: weak-quality query (low recall + low confidence) MUST return `responsePolicy.noCanonicalPathClaims:true`, `safeResponse:true`, `citationPolicy` enumerated. High-quality query keeps `noCanonicalPathClaims:false` |
| **012** | `buildCopilotPromptArg` + `targetAuthority` + Gate-3 enforcement at cli-copilot dispatch (P0, NEW) | `.opencode/skill/cli-copilot/manual_testing_playbook/01--cli-invocation/002-allow-all-tools-sandboxed-write.md` (existing, partial); `.opencode/skill/cli-copilot/manual_testing_playbook/05--session-continuity/` (no entry); `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/`; `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/` | NEEDS-UPDATE + MISSING (multiple) | (a) Update CP-002 to note `--allow-all-tools` MUST be paired with approved `targetAuthority` preamble in deep-loop dispatch; (b) Add new CP-022 "TARGET AUTHORITY approved → preamble present" + CP-023 "TARGET AUTHORITY missing + writeIntent → plan-only, --allow-all-tools stripped" + CP-024 "I1-style 'save the context' replay produces zero mutations" + CP-025 "@PROMPT_PATH wrapper preserves preamble for 20kb prompts"; (c) Add deep-research / deep-review dispatch entries asserting each cli-copilot dispatch in `_auto.yaml` routes through `buildCopilotPromptArg` and the workflow-resolved `{spec_folder}` produces `kind:"approved"` |
| **013** | degraded-graph stress cell (SPEC_KIT_DB_DIR isolation, vi.spyOn(getDb), live-DB byte-equal) (NEW) | (no existing entry) | NEW-ENTRY-NEEDED | Create `16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md` covering the `initDb(tmpdir)` isolation pattern, `vi.spyOn(getDb)` usage, sha256 byte-equality assertion, and the three coverage buckets (empty, readiness exception, fresh) |
| **014** | `code_graph_status` readiness snapshot: `readiness.action ∈ {full_scan, selective_reindex, none}` (NEW) | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` (existing, partial); `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md` (existing, partial) | NEEDS-UPDATE (both) | Update 254 step 3 expected signal from "counts plus `graphQualitySummary`" to "counts plus `graphQualitySummary` plus `readiness.action ∈ {full_scan, selective_reindex, none}` derived via read-only `getGraphReadinessSnapshot()`". Update 275 to assert handler invocation does NOT mutate the DB (criterion E from spec). Optionally add a dedicated 280 entry for the side-effect-freedom guarantee |
| **015** | cocoindex seed telemetry passthrough through `code_graph_context` anchors (`rawScore`, `pathClass`, `rankingSignals`) (NEW) | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | NEEDS-UPDATE | Add a fifth TEST EXECUTION block asserting that when seeds are supplied with `raw_score` / `path_class` / `rankingSignals`, the returned anchors carry `rawScore`, `pathClass`, `rankingSignals` next to existing `score`, `snippet`, `range`. Backward-compat: seeds without telemetry produce anchors without those fields (byte-equal envelope assertion) |
| 001/002/010/011 | Pure-research / pure-evidence packets | n/a | UP-TO-DATE (no playbook impact by definition) | None — research artifacts live in spec folders, not testing playbooks |

**Counts:** 14 behavior surfaces total — UP-TO-DATE (research-only) **4**, NEEDS-UPDATE **5**, NEW-ENTRY-NEEDED **5** (including 4 cli-copilot entries grouped under packet 012).

---

## 3. DETAILED FINDINGS

### 3.1 Packet 003 — memory_context token-budget envelope (NEEDS-UPDATE)

**File:** `.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md`

**Current state (lines 37-39, 41-43):**
```
1. /spec_kit:resume specs/<target-spec>
2. memory_context({ input: "fix flaky index scan retry logic", mode: "resume", ... })
3. memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })

Expected: Relevant bounded context returned; no empty response
```

**Gap:** `Expected` is a single line that does not assert the envelope shape ratified in 003.

**Recommended diff (insert after current §3 block):**
```markdown
### Prompt

As a retrieval validation operator, validate the token-budget envelope contract on memory_context against memory_context({ input:"...", maxTokens:500 }). Verify the response includes preEnforcementTokens (int >= returnedTokens), returnedTokens (int <= maxTokens), and when ALL results were dropped, droppedAllResultsReason is one of the documented enum values. Return a concise pass/fail verdict.

### Commands

1. `memory_context({ input:"large query expected to overflow", maxTokens:500 })` — assert `preEnforcementTokens > returnedTokens` and `droppedAllResultsReason` is absent
2. `memory_context({ input:"<intentionally-too-narrow-bogus-query>", maxTokens:50 })` — force ALL-dropped, assert `droppedAllResultsReason` ∈ documented enum
3. `memory_context({ input:"...", maxTokens:99999 })` — under-budget, assert `preEnforcementTokens === returnedTokens`

### Expected

`preEnforcementTokens`, `returnedTokens` always present (int, non-negative). `droppedAllResultsReason` only present when zero results returned. No envelope drift.
```

---

### 3.2 Packet 004 — cocoindex fork telemetry (NEEDS-UPDATE)

**File:** `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`

**Current state (lines 26-37):** the §2 SCENARIO CONTRACT mentions seed-resolver normalization, neighborhood/outline/impact modes, blocked payload, partialOutput — but does NOT enumerate the 7 NEW telemetry fields shipped by the fork (`dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score`).

**Recommended diff:** add a new TEST EXECUTION block after the existing structural-routing block (line 99):
```markdown
### Prompt

As a context-and-code-graph validation operator, validate cocoindex_code fork telemetry presence on search responses against mcp__cocoindex_code__search({ query:"memory search pipeline", limit:5 }). Verify each result carries dedupedAliases (int), uniqueResultCount (int, response-level), path_class (string ∈ documented enum), rankingSignals (object), source_realpath (string), content_hash (string), raw_score (number).

### Commands

1. `mcp__cocoindex_code__search({ query:"memory search pipeline", limit:5 })`
2. Inspect response for the 7 telemetry fields

### Expected

All 7 fields present per result (rankingSignals object non-empty); `dedupedAliases` reflects symlink alias collapsing; `uniqueResultCount` reflects dedup.
```

---

### 3.3 Packet 005 — code-graph fast-fail (NEW-ENTRY-NEEDED)

**Recommended new file:** `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/277-code-graph-fast-fail.md`

**Sketch:**
```markdown
---
title: "277 -- Code-graph fast-fail fallbackDecision routing"
description: "Validates fallbackDecision.nextTool routing on blocked code_graph_query reads (packet 005). Empty graph → code_graph_scan; broad-stale → code_graph_scan; readiness exception → rg; fresh → no fallbackDecision."
---

## 2. SCENARIO CONTRACT

- Objective: Verify code_graph_query emits fallbackDecision.nextTool for every documented blocked-read state.
- Prerequisites: vitest harness with SPEC_KIT_DB_DIR isolation pattern (per packet 013).
- Test buckets: A=empty, A'=broad-stale, B=readiness exception, C=fresh.
- Pass: Each bucket emits the documented nextTool string; fresh bucket omits the key entirely; live DB byte-equal pre/post (sha256).

(Use packet 013's vitest as the live exercise; this playbook entry is the operator-facing contract page.)
```

---

### 3.4 Packet 006 — causal-graph window metrics (NEEDS-UPDATE)

**File:** `.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/020-causal-graph-statistics-memory-causal-stats.md`

**Current state (lines 19-22, 30-32):**
```
- Objective: Graph coverage review
- Prompt: ... Verify coverage and edge metrics present.
- Expected signals: Coverage and edge metrics present
```

**Gap:** Single-line objective. Misses every contract field shipped in 006.

**Recommended replacement:**
```markdown
- Objective: Verify deltaByRelation per-relation deltas, balanceStatus enum (balanced | skewed_<dir> | capped), and per-relation per-window cap surface.
- Prompt: ... Verify response contains: (1) `deltaByRelation` map keyed by relation type, (2) `balanceStatus` ∈ documented enum, (3) `windowCap` field surfacing when a relation hit the cap. Return a pass/fail verdict.
- Expected signals: deltaByRelation keys cover all causal relation types in the test corpus; balanceStatus value matches the corpus shape; capped state proven by exceeding the configured cap.
- Three test execution blocks: (a) balanced corpus, (b) skewed corpus (skewed_inbound or skewed_outbound), (c) cap-trigger corpus.
```

---

### 3.5 Packet 007 — intent classifier stability (NEEDS-UPDATE)

**File:** `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md`

**Current state:** three TEST EXECUTION blocks asserting structural / semantic / hybrid routing. None assert the canonical `IntentTelemetry` envelope shape.

**Recommended diff:** add a fourth block:
```markdown
### Prompt

As a context-and-code-graph validation operator, validate IntentTelemetry envelope shape against memory_context({ input:"any structural-keyword query" }). Verify response carries IntentTelemetry { intent, confidence, matchedKeywords, classifierVersion, runtimeId } at the documented response path. Aggregate runtimeId across cli-copilot, cli-codex, cli-claude-code calls and confirm shape parity.

### Expected

Single shape across all 4 CLI runtimes; confidence is a number ∈ [0,1]; matchedKeywords is a list of strings; runtimeId reflects the active CLI.
```

---

### 3.6 Packet 008 — daemon rebuild + live-probe protocol (NEW-ENTRY-NEEDED)

**Recommended new file:** `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/278-mcp-daemon-rebuild-restart-live-probe.md`

**Sketch:** 4-part operator scenario exercising the canonical contract from `references/mcp-rebuild-restart-protocol.md`:
1. Source diff capture: `git diff mcp_server/` shows expected paths.
2. Targeted vitest pass: `cd mcp_server && npx vitest run <suite>` exit 0.
3. dist marker check: `npm run build && grep -l <new-marker> mcp_server/dist/<file>.js` → 1 hit; `dist/` mtime > source mtime.
4. Runtime restart: client-specific (OpenCode reload tools, Claude Code restart, Codex CLI restart, Gemini CLI restart).
5. Live MCP probe: `memory_context({ input:"<probe>" })` returns the new contract field (per `references/live-probe-template.md`).

This codifies the "phantom-fix" prevention loop. Existing 243 entry covers prerequisites/install but NOT the 4-part live-probe contract.

---

### 3.7 Packet 009 — memory_search response policy (NEEDS-UPDATE)

**File:** `.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md`

**Current state (lines 30-50):** asserts hybrid precision but nothing about refusal contract.

**Recommended diff:** add new TEST EXECUTION block:
```markdown
### Prompt

As a retrieval validation operator, validate the response-policy refusal contract on memory_search against a deliberately weak query (high lexical noise, no real anchor). Verify response includes responsePolicy.noCanonicalPathClaims:true, safeResponse:true, citationPolicy enumerated. Re-run with a high-quality query to assert noCanonicalPathClaims:false.

### Commands

1. memory_search({ query:"<gibberish-string-with-no-anchor>", limit:5 }) — assert noCanonicalPathClaims:true, safeResponse:true
2. memory_search({ query:"<strong-spec-doc-anchor-keyword>", limit:5 }) — assert noCanonicalPathClaims:false, citationPolicy.canonicalPathsAllowed:true

### Expected

Weak query: handler refuses canonical-path claims; safe response is enabled; client surface MUST display refusal, not citations.
Strong query: refusal disabled; canonical paths allowed in response.
```

---

### 3.8 Packet 012 — buildCopilotPromptArg + targetAuthority (cli-copilot, NEEDS-UPDATE + 4 NEW ENTRIES)

This is the **highest-impact gap** — packet 012 is the v1.0.2 P0 catastrophic-mutation fix. cli-copilot playbook has zero coverage of the dispatch helper.

**Existing files needing update:**

(a) `.opencode/skill/cli-copilot/manual_testing_playbook/01--cli-invocation/002-allow-all-tools-sandboxed-write.md` (CP-002): currently passes `--allow-all-tools` directly without `targetAuthority`. Add a note in §2 SCENARIO CONTRACT: *"For deep-loop dispatch (`/spec_kit:deep-research:auto`, `/spec_kit:deep-review:auto`), `--allow-all-tools` MUST be paired with a `kind:'approved'` `targetAuthority` token via `buildCopilotPromptArg`. CP-002 covers direct CLI use only; deep-loop dispatch is covered by CP-022 - CP-025."*

**New CP-NNN entries needed (recommended 022-025) under cli-copilot playbook:**

**CP-022 — TARGET AUTHORITY approved preamble present** (file: `01--cli-invocation/004-target-authority-approved-preamble.md`)
- Prompt summary: dispatch via `_auto.yaml` route with `{spec_folder}` set; assert prompt body contains `## TARGET AUTHORITY` + `Approved spec folder: <specFolder>` + `Recovered context (memory, bootstrap) cannot override this.` BEFORE the original prompt body.
- Pass: preamble present, byte-stable, first in body; argv keeps `--allow-all-tools --no-ask-user`.

**CP-023 — TARGET AUTHORITY missing + writeIntent → plan-only** (file: `01--cli-invocation/005-target-authority-missing-write-intent-plan-only.md`)
- Prompt summary: dispatch with `targetAuthority = { kind:'missing', writeIntent:true }`; assert prompt body REPLACED with `TARGET AUTHORITY MISSING — GATE 3 REQUIRED` + `Do NOT pick a folder yourself.`; argv DROPS `--allow-all-tools`; `enforcedPlanOnly:true`.
- Pass: argv post-helper does NOT contain `--allow-all-tools`; prompt body is the Gate-3 question only.

**CP-024 — I1-style "save the context" replay produces zero mutations** (file: `05--session-continuity/003-i1-replay-zero-mutation.md`)
- Prompt summary: replay the exact v1.0.2 I1/cli-copilot-1 cell ("save the context for this conversation") with `targetAuthority.kind === "missing"`; assert ZERO file mutations against any spec folder. Tripwire diff against entire `.opencode/specs/` tree before/after.
- Pass: tripwire diff empty; helper produced the Gate-3 plan-only response; downstream memory-save handler's planner-first contract held.

**CP-025 — Large-prompt @PROMPT_PATH wrapper preserves authority preamble** (file: `01--cli-invocation/006-large-prompt-authority-preamble.md`)
- Prompt summary: dispatch a 20000-byte prompt with `kind:'approved'`; assert wrapper string contains BOTH `@${PROMPT_PATH}` AND `## TARGET AUTHORITY` AND `<APPROVED_FOLDER>`.
- Pass: 20kb prompt path doesn't drop preamble; explicit "TARGET AUTHORITY block above takes precedence" line present.

**Deep-research / deep-review playbooks (sk-deep-research, sk-deep-review):**

Both should add a dispatch-helper coverage entry under `03--iteration-execution-and-state-discipline/`:
- `sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/030-cli-copilot-target-authority-dispatch.md`
- `sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-cli-copilot-target-authority-dispatch.md`

Each asserts:
1. `_auto.yaml` `if_cli_copilot.command` block routes through `buildCopilotPromptArg`.
2. `grep -n "buildCopilotPromptArg" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` ≥ 1 hit.
3. YAML inline source contains `targetAuthority = specFolder ? { kind: 'approved', specFolder } : { kind: 'missing', writeIntent: true }`.
4. End-to-end run: when `{spec_folder}` substitutes a real folder, dispatch produces approved preamble; when null, dispatch produces Gate-3 plan-only.

---

### 3.9 Packet 013 — degraded-graph stress cell (NEW-ENTRY-NEEDED)

**Recommended new file:** `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md`

**Sketch:**
- Objective: Validate the deterministic isolated-DB sweep that exercises all 4 `fallbackDecision` matrix branches without touching the live code-graph DB.
- Pattern: `initDb(tmpdir)` BEFORE any spy; `vi.spyOn(getDb)` for readiness exceptions; `vi.spyOn(process, 'cwd')` to pin per-test cache key; sha256 hash before/after suite captures live DB byte-equality.
- 4 buckets: empty, broad-stale (>50 stale), readiness exception, fresh.
- Pass: all 4 branches assert correct `nextTool`; live `code-graph.sqlite` byte-equal pre/post; suite < 1s.

This is operator-facing — the vitest exists and packet 013 is complete. Playbook entry is the contract page operators read when running it.

---

### 3.10 Packet 014 — code_graph_status readiness snapshot (NEEDS-UPDATE)

**Files affected:**
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md`

**254 — current state (line 32, 110-112):** Expected signal says `code_graph_status returns counts (files indexed, nodes, edges) plus graphQualitySummary.detectorProvenanceSummary and graphQualitySummary.graphEdgeEnrichmentSummary`. Doesn't mention `readiness.action`.

**Recommended diff (line 32):**
```
- `code_graph_status` returns counts (files indexed, nodes, edges) plus `graphQualitySummary.detectorProvenanceSummary`, `graphQualitySummary.graphEdgeEnrichmentSummary`, and `readiness.action ∈ {full_scan, selective_reindex, none}` derived from the read-only `getGraphReadinessSnapshot()` helper (per packet 014). Snapshot MUST be side-effect free — handler invocation must NOT call any write-side `code-graph-db` export.
```

Add a fifth TEST EXECUTION block asserting the four readiness states (empty → full_scan; broad-stale → full_scan; bounded-stale → selective_reindex; fresh → none) and side-effect freedom.

**275 — current state (lines 16-17):** Asserts shared readiness contract fields (`canonicalReadiness`, `trustState`, `lastPersistedAt`). Doesn't assert side-effect freedom of `code_graph_status` invocation.

**Recommended diff:** Add a step asserting handler invocation does NOT call `ensureCodeGraphReady` (criterion E from packet 014 spec).

---

### 3.11 Packet 015 — cocoindex seed telemetry passthrough (NEEDS-UPDATE)

**File:** `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`

**Gap:** The §2 SCENARIO CONTRACT covers seed resolution (`exact symbol → enclosing → file anchor`) but does NOT assert the per-seed telemetry passthrough on returned anchors (rawScore, pathClass, rankingSignals).

**Recommended diff:** add a fifth TEST EXECUTION block:
```markdown
### Prompt

As a context-and-code-graph validation operator, validate seed-telemetry passthrough on code_graph_context anchors. Verify when seeds carry raw_score/path_class/rankingSignals (snake_case wire) OR rawScore/pathClass/rankingSignals (camelCase internal), the returned anchors carry rawScore, pathClass, rankingSignals next to existing score/snippet/range. Backward-compat: seeds without telemetry produce anchors without those fields (byte-equal envelope).

### Commands

1. code_graph_context with seeds carrying snake_case telemetry → anchors have camelCase fields
2. code_graph_context with seeds carrying camelCase telemetry → anchors preserve fields verbatim
3. code_graph_context with seeds without telemetry → anchors are byte-equal to pre-packet-015 baseline (no extra keys)

### Expected

Telemetry survives expansion as additive metadata; score/confidence/resolution/ordering byte-equal pre vs post; no second rerank in lib/search (static grep).
```

---

## 4. PER-CLI BREAKDOWN

| CLI Skill | Packets impacting it | Playbook impact |
|-----------|---------------------|-----------------|
| **cli-copilot** | **012 (P0, primary), 008 (live-probe applies)** | HIGH — 1 NEEDS-UPDATE (CP-002) + 4 NEW ENTRIES (CP-022/023/024/025). The catastrophic-mutation fix is uncovered. |
| **cli-codex** | 008 (live-probe applies) | LOW — codex playbook has no deep-loop dispatch coverage; no targetAuthority concern (packet 012 is cli-copilot-only). 1 cross-reference note recommended in `06--integration-patterns/` mentioning that deep-loop dispatch via cli-codex does NOT use `buildCopilotPromptArg` (it has its own dispatch path). |
| **cli-claude-code** | 008 (live-probe applies) | LOW — same as cli-codex. Claude Code dispatches via separate path. 1 cross-reference note recommended. |
| **cli-gemini** | 008 (live-probe applies) | LOW — Gemini dispatch is separate. 1 cross-reference note recommended. |
| **cli-opencode** | 008 (live-probe applies) | LOW — opencode dispatch is separate. 1 cross-reference note recommended. |
| **sk-deep-research** | **012 (dispatch helper called from `_auto.yaml`)** | MEDIUM — 1 NEW ENTRY in `03--iteration-execution-and-state-discipline/` covering the helper + targetAuthority resolution. |
| **sk-deep-review** | **012 (dispatch helper called from `_auto.yaml`)** | MEDIUM — 1 NEW ENTRY in `03--iteration-execution-and-state-discipline/` covering the helper + targetAuthority resolution. |
| **system-spec-kit** | **003, 004, 005, 006, 007, 008, 009, 014, 015** | HIGH — 5 NEEDS-UPDATE + 3 NEW ENTRIES across `01--retrieval/`, `06--analysis/`, `16--tooling-and-scripts/`, `22--context-preservation-and-code-graph/`. |
| **.gemini mirror** | (auto-inherits via hardlinks) | NONE — verified inode equality; updates to `.opencode/skill/system-spec-kit/manual_testing_playbook/` propagate automatically. |

**Distribution by playbook root:**
- system-spec-kit: 5 NEEDS-UPDATE + 3 NEW = **8 actions**
- cli-copilot: 1 NEEDS-UPDATE + 4 NEW = **5 actions**
- sk-deep-research: 1 NEW = **1 action**
- sk-deep-review: 1 NEW = **1 action**
- cli-codex / cli-claude-code / cli-gemini / cli-opencode: 1 cross-reference each (LOW priority) = **4 cross-reference notes**

---

## 5. TOP 5 HIGHEST-IMPACT ITEMS (PRIORITY ORDER)

1. **cli-copilot CP-022/023/024/025 — packet 012 Gate-3 enforcement** [P0]. Without these, the v1.0.2 catastrophic-mutation pathology has zero playbook regression coverage. CP-024 (I1-style replay zero-mutation) is the single highest-priority new entry — it's a direct re-test of the actual incident.
2. **system-spec-kit `277-code-graph-fast-fail.md` — packet 005 fallbackDecision** [P0]. Currently NEUTRAL in v1.0.2 because no integration test exercises every branch end-to-end. Packet 013 ships the vitest; this playbook entry is the operator-facing contract page that calls it.
3. **system-spec-kit `001-unified-context-retrieval-memory-context.md` — packet 003 token-budget envelope** [P0]. The truncation contract is the most-touched MCP surface; current playbook says "no empty response" without asserting envelope shape.
4. **system-spec-kit `255-cocoindex-code-graph-routing.md` — packets 004 + 015 cocoindex telemetry passthrough** [P1]. Two adjacent gaps in the same file. Should be addressed in a single update touching the cocoindex bridge contract.
5. **system-spec-kit `278-mcp-daemon-rebuild-restart-live-probe.md` — packet 008 4-part contract** [P1]. The "phantom-fix" prevention loop has no operator-facing exercise. References exist (`mcp-rebuild-restart-protocol.md`, `live-probe-template.md`) but no playbook entry exercises them.

---

## 6. CONTRADICTIONS

**No outright contradictions found.** The existing playbook entries are stale (under-asserting the post-fix contract) but none would actively FAIL after the post-011 fixes — they would still PASS, just with weaker evidence than the surface now provides. The risk is **silent regression**: if any of the new envelope fields are dropped, the existing assertions wouldn't catch it.

The closest-to-contradiction case is `255-cocoindex-code-graph-routing.md` line 122: "the referenced suites pass and their assertions confirm seed fidelity, mode-specific expansion, explicit blocked-read payloads, and structured `partialOutput` metadata". A reviewer might over-interpret "seed fidelity" as covering the new telemetry passthrough — but the linked vitest suites pre-date packet 015 and don't yet assert `rawScore`/`pathClass`/`rankingSignals`. Recommend explicit telemetry-fidelity wording in the §2 update so this doesn't drift to interpretation.

---

## 7. SUMMARY COUNTS

| Status | Count | Notes |
|--------|-------|-------|
| CONFIRMED-CURRENT | 14+ | Live playbooks now contain the high-impact entries named in §1A. |
| TRACKED-DOWNSTREAM | 1 | Packet 018 owns remaining catalog/playbook degraded-alignment cleanup. |
| HISTORICAL-ONLY | 18 | The older NEEDS-UPDATE / NEW-ENTRY rows below remain useful as a provenance snapshot, but no longer describe the live playbook state. |

**Coverage delta:** Historical snapshot: 14 behavior surfaces ratified across phase 011 had 0 fully covered at audit time. Current reconciliation: the live playbooks now cover the high-impact surfaces; packet 018 remains the owner for final degraded-alignment polish. The .gemini mirror auto-inherits via hardlinks (zero additional action).

---

## 8. AUDIT METHODOLOGY

- Read phase 011 spec.md + packet 003-015 spec.md to extract exact behavior tokens (envelope field names, helper names, schema field names).
- Search across 8 playbook roots (system-spec-kit, 5 cli-* skills, sk-deep-research, sk-deep-review, .gemini mirror) for those tokens via `grep -rln`.
- Read every existing playbook entry that mentioned the relevant tools (`memory_context`, `memory_search`, `memory_causal_stats`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `cocoindex_code`, `cli-copilot dispatch`).
- Cross-checked .gemini hardlink integrity: `.gemini/skills/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md` and the .opencode equivalent share inode `26313083` → propagation is automatic.
- This audit is **READ-ONLY**: no playbook files were modified.

---

## 9. NEXT STEPS (NOT EXECUTED — out of scope of this audit)

1. Open a packet under 026/011 (or a fresh packet under 026) for "playbook regression-coverage update — phase 011 follow-on".
2. Apply NEEDS-UPDATE diffs to the 5 affected files in a single change set per file.
3. Author the 9 NEW entries using the sketches in §3 as starting points; copy from `.opencode/skill/system-spec-kit/templates/` if a template exists, otherwise mirror the closest existing entry's structure (e.g. CP-002 for cli-copilot, 254 for system-spec-kit).
4. Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <new-packet> --strict` after each file write per the distributed-governance rule.
5. Verify .gemini mirror hardlinks are intact post-update (`stat -f "%i"` parity check on at least one file).

---

**End of audit.**
