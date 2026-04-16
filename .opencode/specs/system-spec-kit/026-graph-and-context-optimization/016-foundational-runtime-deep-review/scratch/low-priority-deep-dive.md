# Low-Priority Deep Dive

Line numbers below refer to the current repository state for each source file.

## L1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-graph-context-systems/recommendations.md`

### Architecture Assessment

This is a ranked research recommendations artifact, not runtime code. It packages ten recommendations with score, rationale, dependencies, and acceptance criteria. Its importance comes from downstream phases treating it as a governance baseline even though it has no executable enforcement.

### Contract Surface

Each recommendation promises a rank, a rationale, inline source citations, and an acceptance criterion. That makes the document a de facto requirements surface for later implementation packets, especially around measurement honesty, trust-axis separation, and graph payload validation.

### Failure Modes

Acceptance criteria are prose-only and often refer to conceptual surfaces rather than file paths. Relative citations can drift if the referenced research packets move. Strong recommendations that were demoted in rank still retain strong language, which can create ordering ambiguity for implementers.

### Concurrency & State

None. This is static documentation.

### Drift Risk

The closeout note at the top is prose rather than structured metadata, so later tooling may miss it. Acceptance criteria around measurement and trust contracts are the likeliest to drift because they require ongoing behavioral conformance with no direct guard.

### Test Coverage Assessment

None directly. At best, some recommendations are partially reflected in later tests, but the document itself has no cross-walk to automated enforcement.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `1-3` | closeout note is unstructured prose and not in a machine-parsable anchor block. | P2 |
| `8-13` | R1 mandates blocking behavior for headline-savings claims without naming an enforcement gate or file. | P2 |
| `21-23` | R2 cites relative research paths that can drift or archive without detection. | P2 |
| `40-43` | R4 references informal layer names instead of stable file paths. | P2 |
| `49-53` | R5 assumes trust-metadata validators exist without linking them concretely. | P2 |
| `100-103` | R10 encodes a behavioral prohibition with no linked structural guard. | P2 |

### Recommended Deep-Review Focus

1. Cross-walk recommendation acceptance criteria against actual tests and runtime guards.
2. Resolve which recommendations are still prose-only governance.
3. Add file-path anchors or explicit implementation references for the most important criteria.

## L2. `AGENTS.md`

### Architecture Assessment

`AGENTS.md` is the universal runtime governance contract. It combines safety rules, gate ordering, workflow routing, memory-save instructions, and agent definitions in one long operational specification. Complexity is high for a document because small factual drift here materially changes agent behavior.

### Contract Surface

The strongest promises are Gate 3 file-modification blocking, Gate 2 skill routing, the memory-save workflow, and runtime agent directory mapping. The file also encodes numeric thresholds for confidence/uncertainty and claims session persistence rules for Gate 3.

### Failure Modes

The save-context guidance still relies on a shared `/tmp/save-context-data.json` path. Gate 3 trigger words are an incomplete enumerated list and can miss synonymous file-modification requests. Session-persistence claims depend on model context retention rather than durable storage. The agent-definition section can drift away from actual runtime agent rubrics.

### Concurrency & State

The document prescribes stateful behavior without backing durable state, especially for Gate 3 session carry-over. Its `/tmp` guidance introduces a real cross-run collision surface.

### Drift Risk

The deepest current drift is the `@deep-review` definition: the document still describes a 4-dimension review agent while current Phase 016 deep review uses a 5-dimension rubric. Command names, template paths, and workflow shortcuts can all age silently.

### Test Coverage Assessment

No automated tests verify this document's gate semantics or factual parity with runtime agents.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `171` | confidence/uncertainty thresholds are stated without provenance or calibration evidence. | P2 |
| `184` | Gate 3 trigger list omits common edit verbs such as `patch`, `insert`, `append`, and `replace`. | P1 |
| `186-188` | Gate 3 session persistence is an LLM-context promise, not a durable mechanism. | P1 |
| `205-206` | memory-save flow uses a shared `/tmp/save-context-data.json` path. | P1 |
| `296-303` | `@deep-review` description is factually out of sync with the current 5-dimension review rubric. | P1 |

### Recommended Deep-Review Focus

1. Bring the deep-review definition back into parity with active runtime agents.
2. Replace the shared `/tmp` guidance with a session-scoped temp path.
3. Revisit Gate 3 trigger coverage and decide whether keyword lists should remain explicit or be replaced by broader intent rules.

## L3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/implementation-summary.md`

### Architecture Assessment

This is a Level 2 implementation summary whose main operational value is its `_memory.continuity` block. The markdown body is concise and packet-scoped; the frontmatter is the more important contract because resume tooling can trust it directly.

### Contract Surface

The file promises packet pointer, last-updated metadata, next safe action, key files, and anchored sections for indexing. It also asserts `status: complete`, so readers expect the continuity block to be aligned with a finished packet.

### Failure Modes

The most obvious contradiction is `status: complete` alongside `next_safe_action: "Run strict validation"`. `key_files` only names the summary itself even though this is a multi-child coordination packet. Known limitations explicitly admit stale historical narrative in related artifacts, which can contaminate later retrieval if not filtered.

### Concurrency & State

Static document only.

### Drift Risk

This file is vulnerable to frontmatter/body divergence because packet-closeout documents are often patched lightly after the main work is done. The timestamp and actor metadata will also age unless every edit refreshes them consistently.

### Test Coverage Assessment

There is no direct test of semantic correctness. At most, template/anchor validation can catch structural drift.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `11`, `21` | `status: complete` conflicts with `next_safe_action: "Run strict validation"`. | P1 |
| `22` | `key_files` contains only the summary, which is too narrow for a six-child coordination packet. | P2 |
| `76-83` | decisions record the rename outcome but not the full old-to-new folder mapping needed by tools. | P2 |
| `100-103` | stale "phase 018" narrative in related artifacts is acknowledged but not scheduled for cleanup. | P2 |

### Recommended Deep-Review Focus

1. Resolve the frontmatter contradiction between completion and next action.
2. Expand recovery hints so resume flows can rediscover the actual child packets.
3. Decide whether open historical-language cleanup deserves its own tracked follow-up.

## L4. `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`

### Architecture Assessment

This is a large markdown-driven test orchestrator. It discovers playbook files, parses table or prose scenario definitions, classifies unautomatable scenarios, invokes handler functions directly, compares returned facts to expected signals, and writes JSON/JSONL reports. Complexity is high because parsing, execution, scoring, and reporting are all co-located in one file.

### Contract Surface

The file promises direct-handler automation for scenarios it can parse. It depends on the compiled `../../mcp_server/dist/handlers/index.js` artifact, a shared report root, and a permissive object-literal evaluator for tool arguments. Expected-signal matching is majority-based rather than exact.

### Failure Modes

`evaluateObjectLiteral()` uses `Function(...)()` on repository content, creating a latent code-execution surface. The default report root still points at the older `006-canonical-continuity-refactor` path and will happily create orphaned output directories. Dist import failures are opaque. The pass threshold only requires a simple majority of expected signals, which can hide substantial scenario regression.

### Concurrency & State

Runs sequentially per process, but report-root files are global and unprotected across parallel runs. It writes results inside the loop and again after the loop, causing redundant final writes.

### Drift Risk

Hardcoded path fragments in `preclassifiedUnautomatableReason()` will silently go stale as playbook files move. Handler-dispatch maps and default args are manual and will drift behind MCP tool growth. Regex-driven prose parsing is template-fragile.

### Test Coverage Assessment

No dedicated direct test suite was found for the runner itself; current tests target adjacent handlers and fixtures, not the runner's parsing/scoring logic.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `74-77` | default report root still points at the older `006-canonical-continuity-refactor` path. | P1 |
| `193`, `438-445` | argument evaluation uses `Function(...)()` on repository-owned playbook content. | P1 |
| `319-376` | unautomatable classification depends on hardcoded file-path fragments that will drift with renames. | P2 |
| `945-960` | short tokens are dropped from expected-signal matching, weakening assertions. | P2 |
| `1143-1144` | scenarios pass on majority signal matches, not exact matches. | P1 |
| `1245`, `1252` | results are written both during and after the loop. | P2 |

### Recommended Deep-Review Focus

1. Replace `Function(...)()` with a safer parser or heavily restricted evaluator.
2. Fix the stale report path and align it with current packet names.
3. Tighten signal matching and add direct tests for parser/scoring helpers.
4. Consider splitting parsing, execution, and scoring into separately testable modules.
