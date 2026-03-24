# Deep Research Strategy — 013 Memory Generation Quality

## 2. Topic
Root cause analysis and fix architecture for generate-context.js JSON mode memory file quality issues: path fragment trigger phrases, thin content, truncated titles, key topic contamination, and reactive-only detection.

---

## 3. Key Questions (remaining)
- [x] Q1: Where exactly do path fragment tokens enter the trigger/topic pipeline, what filters exist, and which tokens leak through to the final memory file?
- [x] Q2: Why does JSON mode produce thin content in the semantic summarizer, and what input fields could be leveraged for enrichment?
- [x] Q3: What is the optimal fix architecture (centralized vs distributed vs combined), and what regressions must each approach guard against?

---

## 4. Non-Goals
- Implementing fixes (read-only investigation)
- Captured session mode quality (only JSON mode)
- Embeddings/vector search pipeline
- MCP server-side memory_save indexing behavior

---

## 5. Stop Conditions
- All 3 questions answered with file:line evidence
- Max 3 iterations reached
- Fix architecture ADR produced with regression test plan

---

## 6. Answered Questions
- Q2 answered in iteration 002: JSON mode thinness is caused by a channel mismatch, not an input-schema shortage. `normalizeInputData()` converts the common scalar JSON payload into one synthetic `userPrompt` plus observations/metadata, while Step 7.5 builds `allMessages` only from `userPrompts`. Best enrichment candidates are `exchanges`, `toolCalls`, `nextSteps`, `technicalContext`, and file-change text because they currently bypass the summarizer's main message stream. See `scratch/iteration-002.md` for the field-by-field gap table and evidence chain.

---

## 7. What Worked
- Reading the exact JSON entrypoint, normalizer, workflow, and title-builder line ranges in one trace made the lossiness visible end to end.
- Treating the problem as a channel-consumption audit worked better than treating it as a missing-schema problem; most needed fields already exist in raw JSON mode.
- Comparing slow-path vs fast-path normalization clarified that rich summaries are already possible when callers provide `userPrompts`; thinness mainly affects the documented scalar JSON shape.

---

## 8. What Failed
- Looking for a prior `scratch/iteration-001.md` artifact failed because it is not present in this spec folder, so Q1 status could not be recovered from scratch history alone.
- Assuming `toolCalls` and `exchanges` already enrich the semantic summarizer was incorrect; they are currently used only for counts and compact template rendering, not for `allMessages`.

---

## 9. Exhausted Approaches (do not retry)

### CocoIndex semantic search -- BLOCKED (prior sessions, 10+ attempts)
- What was tried: mcp__cocoindex_code__search with various TypeScript queries
- Why blocked: Returns 0 results for TypeScript files
- Do NOT retry: Use Grep/Glob/Read instead

### spec_kit_memory MCP -- BLOCKED (prior sessions)
- What was tried: All memory_* tool calls from codex agents
- Why blocked: MCP handshake failed from codex CLI context
- Do NOT retry: Not available in codex sandbox

---

## 10. Ruled Out Directions
- Title truncation is a secondary quality issue, not the root cause of thin semantic body content. Title generation has richer candidates than Step 7.5 body generation.
- Adding more raw JSON fields alone will not fix Q2 unless those fields are promoted into the message stream consumed by `generateImplementationSummary()`.

---

## 11. Next Focus
Iteration 3: Fix architecture ADR (Q3) — compare centralized normalization enrichment vs workflow-side message synthesis vs distributed consumer updates, then enumerate regression guards for titles, trigger phrases, decisions, files, and template rendering.

---

## 12. Known Context
5 root causes identified from 012 pre-release audit:
1. **buildSpecTokens()** (memory-frontmatter.ts:50-57): Splits folder path "02--system-spec-kit/022-hybrid-rag-fusion/..." into tokens ["system","spec","kit","hybrid","fusion"...], mixes with semantic content
2. **filterTriggerPhrases()** (workflow.ts:122-165): Catches "/" separators but not normalized multi-word path fragments like "kit 022"
3. **generateImplementationSummary()** (semantic-summarizer.ts:468-610): Needs messages[]/observations[] but JSON mode provides only scalar fields
4. **extractKeyTopics()** (topic-extractor.ts:29-34): Adds spec folder tokens as high-priority weighted segments
5. **post-save-review.ts:184-198**: PATH_FRAGMENT_PATTERNS detect AFTER write, no prevention feedback loop

All source files under: .opencode/skill/system-spec-kit/scripts/

---

## 13. Research Boundaries
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current segment: 2
- Started: 2026-03-24T13:00:00.000Z
