# Iteration 006

## Focus

Clear the final `UNVERIFIED` carry-over items, then audit the remaining P2-heavy clusters around skill-graph durability, session bootstrap/resume semantics, coverage-graph query drift, memory-save/hook-state hardening, and the still-suspect documentation surfaces.

## Actions Taken

1. Re-read `iteration-005.md`, `deep-review-state.jsonl`, and the 015 source report sections covering coverage-graph drift, error-handling gaps, and the late doc-layer parity findings.
2. Re-audited the current runtime surfaces for the remaining session and coverage complaints in:
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/context/caller-context.ts`
3. Re-audited the current skill-graph/compiler and save-pipeline durability surfaces in:
   - `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`
   - `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
4. Re-checked the YAML/metadata and trigger-quality anchors in:
   - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`
   - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`
5. Re-checked the documentation drift surfaces called out late in the 015 report in:
   - `.opencode/skill/mcp-code-mode/README.md`
   - `.utcp_config.json`
   - `.opencode/skill/system-spec-kit/references/structure/folder_routing.md`

## Findings Batch-Audited

- `2 x P1 / frontmatter YAML grammar hardening`
  Classification: `ADDRESSED`
  Current-main evidence: `parseSectionValue()` now strips trailing YAML comments from list items before materializing values, and `syncMemoryMetadataTriggerPhrases()` emits quoted YAML scalars instead of raw list items (`frontmatter-migration.ts:595-638`, `1185-1195`).

- `2 x P2 / skill-graph compiler cycle detection and warning durability`
  Classification: `ADDRESSED`
  Current-main evidence: `validate_dependency_cycles()` now detects arbitrary-length `depends_on` cycles via DFS color marking, and `compile_graph()` persists normalized `topology_warnings` into the compiled graph payload (`skill_graph_compiler.py:457-518`, `575-681`).

- `3 x P1 / session-resume auth-binding and caller-context disclosure cluster`
  Classification: `SUPERSEDED`
  Current-main evidence: the handler now explicitly documents and enforces caller-context binding, rejects `sessionId` mismatches against transport context, and sources context from `AsyncLocalStorage` instead of an unbound free-form selector (`session-resume.ts:6-9`, `450-480`; `caller-context.ts:20-39`).

- `1 x P2 / session_bootstrap malformed child-payload completeness drift`
  Classification: `ADDRESSED`
  Current-main evidence: `extractData()` now marks malformed child payloads with `_extractionFailed`, and the composite completeness rating drops to `partial` when extraction fails (`session-bootstrap.ts:71-91`, `240-243`).

- `1 x P2 / extractSpecTitle() silently discards read failures`
  Classification: `ADDRESSED`
  Current-main evidence: `extractSpecTitle()` now throws on read failure with the failing path in the error text rather than silently returning an empty title (`title-builder.ts:67-76`).

- `2 x coverage-graph query semantics drift`
  Classification: `STILL_OPEN`
  Current-main evidence: `handleCoverageGraphQuery()` still routes both `uncovered_questions` and `coverage_gaps` through `findCoverageGaps(ns)`, so the documented modes remain semantically collapsed and `coverage_gaps` still returns the wrong shape for review-graph usage (`handlers/coverage-graph/query.ts:66-77`).

- `1 x P2 / session-prime startup-brief regression hiding`
  Classification: `STILL_OPEN`
  Current-main evidence: the dynamic import for `startup-brief.js` still swallows every import failure without logging or degraded-state surfacing (`hooks/claude/session-prime.ts:34-40`).

- `4 x doc-layer parity drift across Code Mode and folder routing`
  Classification: `STILL_OPEN`
  Current-main evidence:
  - `mcp-code-mode/README.md` still says configured Code Mode tools include `Webflow` and `Notion` even though the checked-in `.utcp_config.json` only declares Chrome DevTools, ClickUp, and Figma (`README.md:42-44`, `174-177`; `.utcp_config.json:16-82`).
  - The same README still claims `UTCP_CONFIG_FILE` must be absolute, while the server resolves the env var with `path.resolve(...)` and only requires the file to exist after resolution (`README.md:257-267`, `391-397`; `mcp_server/index.ts:275-283`).
  - `folder_routing.md` still documents generated save artifacts under `[packet]/memory/` instead of the packet-first canonical save path (`folder_routing.md:244-250`).
  - `folder_routing.md` still ships the internally impossible "moderate alignment" worked example (`folder_routing.md:398-404`).

- `8 x memory-save / hook-state payload-schema and predecessor-lineage complaints`
  Classification: `SUPERSEDED`
  Current-main evidence: the Claude hook state is now validated by `HookStateSchema` with explicit `sessionSummary`, `producerMetadata`, and schema-version handling, while the save path persists `predecessorMemoryId`, marks predecessors deprecated, and records lineage transitions in the insert path (`hook-state.ts:55-73`, `136-154`, `254-361`; `handlers/save/create-record.ts:306-390`).

- `14 x residual runtime/test-fixture drift findings tied to pre-016/017/018 surfaces`
  Classification: `SUPERSEDED`
  Current-main evidence: the remaining report anchors in this batch point at retired bridge-era or archived-test assumptions, while the current shipping surface has live `skill_graph_*` contract coverage and the newer session/bootstrap/runtime hardening primitives already landed on main (`tests/tool-input-schema.vitest.ts:581-613`; `session-resume.ts:6-9`, `450-480`; `session-bootstrap.ts:71-91`, `240-243`).

## Cumulative Tally

- Findings audited in this iteration: `38`
- Cumulative audited after iteration 006: `158 / 242`
- Cumulative tally: `ADDRESSED=35`, `STILL_OPEN=14`, `SUPERSEDED=109`, `UNVERIFIED=0`
- Remaining unaudited findings after this pass: `84`

## STILL_OPEN Expanded With Evidence

- `2 x P1 / resolveDatabasePaths residual boundary hardening`
  Reproduction evidence: `core/config.ts:54-79`, `core/config.ts:83-86`
  Proposed remediation cluster: `DB path boundary and late-override unification`

- `2 x P1 / skill-advisor source metadata fail-open`
  Reproduction evidence: `skill_advisor.py:162-170`, `skill_advisor.py:208-216`
  Proposed remediation cluster: `advisor degraded-source diagnostics`

- `1 x P1 / cache-health false-green in skill-advisor`
  Reproduction evidence: `skill_advisor_runtime.py:247-268`, `skill_advisor.py:2471-2488`
  Proposed remediation cluster: `advisor cache integrity and health state`

- `1 x P1 / session_resume(minimal) contract drift`
  Reproduction evidence: `handlers/session-resume.ts:622-637`
  Proposed remediation cluster: `resume minimal-mode contract enforcement`

- `1 x P2 / whitespace trigger phrases score as coverage`
  Reproduction evidence: `lib/validation/save-quality-gate.ts:493-497`
  Proposed remediation cluster: `trigger-quality normalization`

- `1 x P2 / coverage-graph query semantics collapse`
  Reproduction evidence: `handlers/coverage-graph/query.ts:66-77`
  Proposed remediation cluster: `coverage-graph query-mode separation`

- `1 x P1 / coverage_gaps reports the wrong thing for review graphs`
  Reproduction evidence: `handlers/coverage-graph/query.ts:66-76`
  Proposed remediation cluster: `review-graph coverage-gaps contract repair`

- `1 x P2 / session-prime hides startup-brief regressions`
  Reproduction evidence: `hooks/claude/session-prime.ts:34-40`
  Proposed remediation cluster: `startup-brief degraded-state logging`

- `2 x P1/P2 / mcp-code-mode README parity drift`
  Reproduction evidence: `.opencode/skill/mcp-code-mode/README.md:42-44`, `.opencode/skill/mcp-code-mode/README.md:174-177`, `.opencode/skill/mcp-code-mode/README.md:257-267`, `.opencode/skill/mcp-code-mode/README.md:391-397`, `.utcp_config.json:16-82`, `.opencode/skill/mcp-code-mode/mcp_server/index.ts:275-283`
  Proposed remediation cluster: `code-mode inventory and troubleshooting doc sync`

- `2 x P1/P2 / folder_routing.md still documents retired/incorrect save alignment behavior`
  Reproduction evidence: `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-250`, `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:398-404`
  Proposed remediation cluster: `folder-routing canonical save path and scoring example sync`

## Next Focus

Use iteration 007 to finish the late doc/runtime parity tail and then push into the remaining unaudited `84` findings, with priority on:

1. The residual `STILL_OPEN` P1 workstreams that already have exact file:line evidence (`resolveDatabasePaths`, advisor fail-open diagnostics, `session_resume(minimal)`).
2. The remaining documentation/readme parity findings in the 015 report so the final backlog does not mix live code defects with stale guidance drift.
3. The leftover P2 code-smell/readability and benchmark/test-net complaints that were not touched in iterations 001-006.
