**1) P1-03 / P1-04 / P1-09 with exact locations and real-world impact**

1. `P1-03` (`assistant pairing chooses first child`)  
Location: [opencode-capture.ts:808](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:808), [opencode-capture.ts:812](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:812), [opencode-capture.ts:832](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:832).  
Verdict: **runtime risk**. In branched assistant replies, `assistant_message_id` is bound to first child, not terminal/best child, so exchange linkage metadata can be wrong.

2. `P1-04` (`multi-part assistant text not reassembled`)  
Location: text parts emitted per part in [opencode-capture.ts:649](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:649), [opencode-capture.ts:652](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:652), reassembly logic in [opencode-capture.ts:818](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:818).  
Verdict: **runtime risk (partial)**. Direct-child text parts are joined, but continuation chains (`assistant -> assistant`) are still missed because matching only uses `parent_id === userMsg.id`.

3. `P1-09` (`file-format detection heuristic ambiguous`)  
Location: fast-path detection in [input-normalizer.ts:409](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:409)-[input-normalizer.ts:434](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:434).  
Verdict: **runtime risk**. Presence of any one “normalized-ish” field can short-circuit full normalization, so mixed-shape payloads can produce semantically wrong/incomplete output.

**2) Categorization of the 67 remaining items**

Note: current manifest no longer contains per-ID definitions for `P2-01..30` and `P3-01..34`, only grouped themes. So this is a full **67-item bucket classification by remaining themes**.

- `RUNTIME_RISK` (14)  
`P1-03`, `P1-04`, `P1-09` + 11 P2 items in timestamp correctness, file dedup correctness, relevance-filter correctness, and tool-output structural handling.
- `QUALITY_DEGRADATION` (25)  
16 P2 items (decision extraction precision, quality scoring consistency, non-corrupting type/design issues) + 9 P3 items (truncation correctness, duration edge checks, silent-failure visibility).
- `PURE_POLISH` (28)  
3 P2 hygiene/design items + 25 P3 hygiene items (magic numbers, unused imports, low-impact type cleanups).

**3) Minimum set for “production quality”**

Minimum meaningful set is **runtime-correctness first**:

1. Fix `P1-03`.
2. Fix `P1-04`.
3. Fix `P1-09`.
4. Fix all P2 timestamp-validation correctness items.
5. Fix all P2 file-dedup correctness items.
6. Fix P2 relevance-filter correctness items that can leak cross-spec content.
7. Fix P2 tool-output handling items that can drop/garble extracted evidence.

That is the smallest set that materially improves correctness and avoids corrupt/misleading memory output; the rest can be phased.

**4) New bugs/risks found (not clearly represented in remaining manifest)**

1. **Frontmatter can be displaced by prepended warnings, breaking downstream quality extraction**  
Prepend points: [workflow.ts:2082](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2082), [workflow.ts:2089](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2089), [workflow.ts:2165](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2165).  
Parsers require frontmatter at start: [quality-extractors.ts:5](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:5), [memory-template-contract.ts:5](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:5).  
Indexer consumes these fields: [memory-indexer.ts:123](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:123).  
Observed file with warning before `---`: [17-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md:1](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/memory/17-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md:1).

2. **`continuationCount` has no numeric type guard before arithmetic**  
[collect-session-data.ts:591](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:591), [collect-session-data.ts:611](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:611).  
If non-number sneaks in, `NEXT_CONTINUATION_COUNT` can be wrong (`"2" + 1 => "21"`).
