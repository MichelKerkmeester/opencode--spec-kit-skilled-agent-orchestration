I’m mapping the algorithmic core first, then I’ll cross-check for duplication against `shared/` and usage sites so the findings are concrete rather than speculative.

● Read semantic-summarizer.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts
  └ 1 line read

● Read content-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts
  └ 1 line read

● Read flowchart-generator.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/flowchart-generator.ts
  └ 1 line read

● Read frontmatter-migration.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts
  └ 1 line read

● Read simulation-factory.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts
  └ 1 line read

● Search (glob)
  │ "**/shared/**/*{chunk*,embed*,trigger*}*" in .opencode/skill/system-spec-kit
  └ 4 files found

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts
  └ 9 lines read

● Read semantic-signal-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts
  └ 422 lines read

● Read structure-aware-chunker.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts
  └ 222 lines read

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts
  └ 23 lines read

● Read topic-keywords.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts
  └ 45 lines read

● Read anchor-generator.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts
  └ 303 lines read

● Read decision-tree-generator.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts
  └ 213 lines read

● Read ascii-boxes.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts
  └ 236 lines read

I’ve confirmed some wrappers already: `embeddings.ts` is just a re-export, and `trigger-extractor.ts` is mostly a compatibility shim. Next I’m drilling into the larger generators/migration code and checking actual usage so dead-code findings are defensible.

● Explore Audit core libs
  └ Agent started in background with agent_id: lib-audit. You can use read_agent ...

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^(export\s+)?class\s+|^const\s+[A-Za-z0-9_]+\s*=\s*(async\s
  │ *)?\(" (.opencode/skill/system-spec-kit/scripts/lib/flowchart-generator.ts)
  └ 8 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^(export\s+)?class\s+|^const\s+[A-Za-z0-9_]+\s*=\s*(async\s
  │ *)?\(" (.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts)
  └ 13 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^(export\s+)?class\s+|^const\s+[A-Za-z0-9_]+\s*=\s*(async\s
  │ *)?\(" (.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts)
  └ 17 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^(export\s+)?class\s+|^const\s+[A-Za-z0-9_]+\s*=\s*(async\s
  │ *)?\(" (.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts)
  └ 38 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^(export\s+)?class\s+|^const\s+[A-Za-z0-9_]+\s*=\s*(async\s
  │ *)?\(" (.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts)
  └ 16 lines found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/564c442e-b8a7-485e-a9fa-dd7dd9cbc894/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 8 lines...

I’m into the heavier parts now. The main risk areas look like `semantic-summarizer`, `content-filter`, and `frontmatter-migration`; I’m reading those around their large functions and then I’ll validate whether the exported helpers are actually used anywhere.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ 1 line read

● Read chunking.ts
  │ .opencode/skill/system-spec-kit/shared/chunking.ts
  └ 110 lines read

● Read structure-aware-chunker.ts
  │ .opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts
  └ 221 lines read

● Read content-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts
  └ L1:260 (260 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L1:260 (260 lines read)

● Read semantic-summarizer.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts
  └ L1:260 (260 lines read)

● Read flowchart-generator.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/flowchart-generator.ts
  └ L1:240 (240 lines read)

● Read frontmatter-migration.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts
  └ L1:260 (259 lines read)

● Read simulation-factory.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts
  └ L1:260 (260 lines read)

● Count lines in target and shared files (shell)
  │ wc -l '.opencode/skill/system-spec-kit/scripts/lib/'*.ts
  │ '.opencode/skill/system-spec-kit/shared/'*.ts '.opencode/skill/system-spec-kit/shared/lib/'*.ts
  │ | sed 's#^#LINES #'
  └ 24 lines...

● Read frontmatter-migration.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts
  └ L761:1240 (480 lines read)

● Read simulation-factory.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts
  └ L261:555 (295 lines read)

● Read semantic-summarizer.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts
  └ L261:763 (503 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L261:660 (399 lines read)

● Read flowchart-generator.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/flowchart-generator.ts
  └ L241:406 (166 lines read)

● Read content-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts
  └ L261:653 (393 lines read)

● Read frontmatter-migration.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts
  └ L261:760 (500 lines read)

● Search (grep)
  │ "\b(generateAnchorId|generateSemanticSlug|generateShortHash|categorizeSection|validateAnchorUniq
  │ ueness|extractKeywords|slugify|extractSpecNumber|getCurrentDate|wrapSectionsWithAnchors|asciiBox
  │ esAvailable|generateDecisionTree|generateConversationFlowchart|generateWorkflowFlowchart|buildPh
  │ aseDetails|extractFlowchartFeatures|getPatternUseCases|classifyDiagramPattern|createSessionData|
  │ createConversationData|createDecisionData|createDiagramData|createSimulationFlowchart|createSimu
  │ lationPhases|createFullSimulation|requiresSimulation|addSimulationWarning|markAsSimulated|format
  │ Timestamp)\b" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

A few concrete issues are emerging: the chunker is effectively duplicated between `scripts/lib` and `shared/lib`, and `frontmatter-migration` has a hard line-count cutoff that can make valid frontmatter invisible. I’m validating the remaining “dead code” candidates via repo-wide usage now.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L1:120 (119 lines read)

● Search (grep)
  │ "\b(extractTriggerPhrasesWithStats|extractTriggerPhrases)\b" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/shared)
  └ 4 lines found

● Search (grep)
  │ "\b(extractTriggerPhrasesWithStats|extractTriggerPhrases|SemanticSignalExtractor)\b" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/scripts)
  └ 54 lines found

● Search (grep)
  │ "\b(resetStats|getFilterStats|createFilterPipeline|filterContent|isNoiseContent|stripNoiseWrappe
  │ rs|meetsMinimumRequirements|generateContentHash|calculateSimilarity|calculateQualityScore)\b" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 94 lines found

● Search (grep)
  │ "\b(generateDecisionTree|generateConversationFlowchart|generateWorkflowFlowchart|buildPhaseDetai
  │ ls|extractFlowchartFeatures|getPatternUseCases|classifyDiagramPattern|formatTimestamp|createSess
  │ ionData|createConversationData|createDecisionData|createDiagramData|createSimulationFlowchart|cr
  │ eateSimulationPhases|createFullSimulation|requiresSimulation|addSimulationWarning|markAsSimulate
  │ d)\b" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "\b(tokenizeTopicWords|createValidShortTerms|shouldIncludeTopicWord)\b" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 8 lines found

● Search (grep)
  │ "\b(generateAnchorId|generateShortHash|extractKeywords|slugify|extractSpecNumber|getCurrentDate|
  │ wrapSectionsWithAnchors)\b" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 74 lines found

● Diff shared and script chunkers (shell)
  │ diff -u '.opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts'
  │ '.opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts' | sed -n '1,200p'
  └ 66 lines...

The exploration pass finished, so I’m pulling that in now and doing one last validation sweep on usage-heavy helpers before I write up the audit.

● Read (Explore agent — Audit core libs)
  └ idle

● Search (grep)
  │ "\b(formatTimestamp|createSessionData|createConversationData|createDecisionData|createDiagramDat
  │ a|createSimulationFlowchart|createSimulationPhases|createFullSimulation|requiresSimulation|addSi
  │ mulationWarning|markAsSimulated)\b" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "\b(generateDecisionTree|asciiBoxesAvailable)\b" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 32 lines found

● Search (grep)
  │ "\b(generateConversationFlowchart|generateWorkflowFlowchart|buildPhaseDetails|extractFlowchartFe
  │ atures|getPatternUseCases|classifyDiagramPattern)\b" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 31 lines found

● Read message-utils.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts
  └ L1:220 (220 lines read)

● Read session-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
  └ L440:520 (81 lines read)

● Search (grep)
  │ "\b(tokenizeTopicWords)\b" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 1 line found

● Search (grep)
  │ "\b(createFullSimulation|requiresSimulation|addSimulationWarning|markAsSimulated|createSimulatio
  │ nFlowchart|generateSessionId|formatTimestamp)\b" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 95 lines found

● Search (grep)
  │ "\b(buildWeightedEmbeddingSections|generateImplementationSummary|formatSummaryAsMarkdown|extract
  │ FileChanges|extractDecisions)\b" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 88 lines found

# system-spec-kit `scripts/lib` audit

## Findings

### High severity

- **Valid frontmatter can be treated as “missing,” which can prepend a second frontmatter block**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`
  - **Lines:** `398-411`, `1213-1219`
  - **Why:** `detectFrontmatter()` returns `found: false` when the opening block exceeds **50 lines**, even if it is otherwise YAML-like. `buildFrontmatterContent()` then prepends new frontmatter.
  - **Risk:** duplicate frontmatter on large existing files.
  - **Recommendation:** treat over-limit blocks as `malformed`, or make the limit configurable and preserve existing blocks.

- **Flowchart generation misclassifies long sequential workflows as parallel and then drops phases**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/flowchart-generator.ts`
  - **Lines:** `97-100`, `167-170`, `195-197`, `220-245`
  - **Why:** `detectWorkflowPattern()` uses `phases.length > 4` as the sole signal for parallelism. In the parallel branch, only `phases.slice(1, Math.min(4, phases.length))` is rendered.
  - **Risk:** any 5+ phase sequential workflow is shown as parallel, and phases beyond the first four are omitted from the diagram.
  - **Recommendation:** infer parallelism from explicit structure, not count; render all phases.

### Medium severity

- **`scripts/lib/structure-aware-chunker.ts` is effectively a second copy of the shared implementation**
  - **Files:**  
    - `.opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts`  
    - `.opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts`
  - **Lines:** essentially the full implementation (`scripts: 62-221`, `shared: 60-220`)
  - **Why:** diff shows only banner/comment differences; logic is duplicated line-for-line.
  - **Risk:** future fixes can land in one copy and miss the other.
  - **Recommendation:** make `scripts/lib` re-export the shared implementation, like `embeddings.ts`.

- **Content deduplication is O(n²) and uses a weak similarity heuristic**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts`
  - **Lines:** `376-398`, `580-609`
  - **Why:** after hash misses, each item is compared against all prior content with `calculateSimilarity()`. That routine only compares same-position characters in the first 200 chars.
  - **Risk:** poor scaling on larger batches and false negatives/positives for near-duplicates.
  - **Recommendation:** bucket candidates first, or use a real normalized similarity metric.

- **Trigger extraction logic is duplicated between script and shared layers**
  - **Files:**  
    - `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts`  
    - `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts`
  - **Lines:** `scripts: 166-257, 260-287, 294-414`; `shared: 534-659`
  - **Why:** the script-side extractor rebuilds placeholder filtering, n-gram scoring, candidate merging, substring dedupe, and ranking on top of shared primitives.
  - **Risk:** behavior drift. The repo already has parity tests because these paths can diverge.
  - **Recommendation:** consolidate the ranking pipeline into one canonical implementation and keep wrappers thin.

### Low severity

- **Topic/phrase dedupe uses O(n²) `indexOf` filters**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts`
  - **Lines:** `243-255`, `270-286`
  - **Why:** `.filter((phrase, index, arr) => arr.indexOf(phrase) === index)` is used repeatedly.
  - **Recommendation:** replace with `Set`-based dedupe.

- **Message classification work is repeated multiple times**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts`
  - **Lines:** `171-189`, `200-312`, `424-463`, `468-604`
  - **Why:** `generateImplementationSummary()` classifies messages, then `extractFileChanges()` and `extractDecisions()` classify them again.
  - **Recommendation:** classify once and pass typed buckets through.

- **Regex patterns are recompiled unnecessarily inside the filter pipeline**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts`
  - **Lines:** `473`, `520-535`
  - **Why:** `customConfig.noise.patterns` are compiled during pipeline creation, then compiled again in `filterNoise()`.
  - **Recommendation:** compile once per pipeline and reuse.

- **Write-only / unused code**
  - **Files:**  
    - `.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts` — `asciiBoxesAvailable` only assigned (`34`, `46`)  
    - `.opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts` — `tokenizeTopicWords()` has no repo consumers (`26`)  
    - `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts` — `category` is computed but unused in `wrapSectionsWithAnchors()` (`241`)
  - **Recommendation:** remove or wire them through.

- **Large renderer functions should be decomposed**
  - **Files / lines:**  
    - `decision-tree-generator.ts: 82-208`  
    - `flowchart-generator.ts: 150-272`  
    - `semantic-summarizer.ts: 200-312`, `468-604`  
    - `frontmatter-migration.ts: 372-444`, `685-760`, `1066-1123`
  - **Why:** these functions mix parsing, classification, formatting, and policy.
  - **Recommendation:** extract helpers for layout, parsing, and policy decisions.

- **Magic widths and duplicated formatting policy**
  - **Files:** `.opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts`, `.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts`
  - **Lines:** `ascii-boxes.ts: 105, 157, 196, 212`; multiple hardcoded widths in `decision-tree-generator.ts`
  - **Recommendation:** centralize box widths/layout constants.

- **Simulation helpers intentionally fork common utilities**
  - **File:** `.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts`
  - **Lines:** `93-97`, `101-103`, `134-137`, `458-471`
  - **Why:** comments explicitly note duplication versus `utils/message-utils.ts`, `session-extractor.ts`, and flowchart generation. Invalid dates also silently fall back.
  - **Recommendation:** keep one shared formatter/id generator where possible; at minimum, centralize the UTC-vs-local policy.

## Duplication with `shared/`

- **Embeddings:** `.opencode/skill/system-spec-kit/scripts/lib/embeddings.ts:8-9` is a clean re-export of `.opencode/skill/system-spec-kit/shared/embeddings.ts`. No issue.
- **Chunking:** `scripts/lib/structure-aware-chunker.ts` is a near-exact duplicate of `shared/lib/structure-aware-chunker.ts`. This is the clearest duplication risk.
- **Triggers:** `scripts/lib/trigger-extractor.ts` is a thin compatibility wrapper, but `semantic-signal-extractor.ts` duplicates much of the shared trigger-ranking pipeline.

## File coverage notes

- **Thin/intended wrappers:** `embeddings.ts`, `trigger-extractor.ts`
- **Most concerning files:** `frontmatter-migration.ts`, `flowchart-generator.ts`, `content-filter.ts`
- **Mostly maintainability issues:** `decision-tree-generator.ts`, `ascii-boxes.ts`, `semantic-summarizer.ts`, `simulation-factory.ts`
- **Minor cleanup only:** `topic-keywords.ts`, `anchor-generator.ts`

