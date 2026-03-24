# Plan: Memory Generation Quality Deep Research

---

## Phase 1: Initialize (orchestrator)

- [x] Create 013 phase folder with Level 2+ spec files
- [x] Initialize deep research state (config, strategy, JSONL)
- [x] Populate strategy with known context (5 root causes from 012 audit)

---

## Phase 2: Deep Research (3 agents, parallel)

### Agent 1 — Path Fragment Contamination Tracing (Q1)

**Focus**: Trace complete data flow of spec folder path tokens through the pipeline.

**Files to investigate**:
- `lib/memory-frontmatter.ts:50-57` — `buildSpecTokens()` splits paths into tokens
- `lib/memory-frontmatter.ts:124-164` — `deriveMemoryTriggerPhrases()` mixes tokens with content
- `core/workflow.ts:122-165` — `filterTriggerPhrases()` incomplete filter
- `core/workflow.ts:1036-1133` — trigger merge logic, `FOLDER_STOPWORDS`
- `core/topic-extractor.ts:29-34` — `extractKeyTopics()` spec folder injection
- `core/trigger-extractor.ts` — `extractTriggerPhrases()` n-gram generation
- `lib/semantic-signal-extractor.ts` — tokenization and n-gram scoring

**Deliverable**: Contamination map: entry point → filter → escape path → impact

### Agent 2 — JSON Mode Content Thinness (Q2)

**Focus**: Analyze why JSON mode produces thin memory files.

**Files to investigate**:
- `utils/input-normalizer.ts` — `RawInputData` → `NormalizedData` transformation
- `lib/semantic-summarizer.ts:468-610` — `generateImplementationSummary()` message classification
- `core/workflow.ts:900-930` — Step 7.5 `allMessages` construction
- `core/title-builder.ts:23-47` — title generation and truncation
- `memory/generate-context.ts` — JSON input parsing entry point

**Deliverable**: Gap analysis: JSON input fields → normalized form → pipeline consumer → output quality

### Agent 3 — Fix Architecture Design (Q3)

**Focus**: Design optimal fix architecture with regression analysis.

**Approaches to evaluate**:
- Centralized: harden `filterTriggerPhrases()` as single choke point
- Distributed: fix each source (`buildSpecTokens`, `extractKeyTopics`, etc.)
- Combined: clean at source + centralized safety net
- Post-save promotion: make detection prevent (pre-save gating)
- JSON enrichment: synthesize richer `userPrompts`/`observations` from scalar fields

**Deliverable**: ADR with pros/cons/regression risks, recommended approach, test plan

---

## Phase 3: Synthesis (orchestrator)

Compile `research.md`:
1. Executive summary
2. Root cause map (from Agent 1)
3. JSON mode gap analysis (from Agent 2)
4. Fix recommendations by priority (from Agent 3)
5. Regression test plan
6. Implementation sequencing

---

## Phase 4: Save Context

`generate-context.js` → memory save → post-save review → patch if needed
