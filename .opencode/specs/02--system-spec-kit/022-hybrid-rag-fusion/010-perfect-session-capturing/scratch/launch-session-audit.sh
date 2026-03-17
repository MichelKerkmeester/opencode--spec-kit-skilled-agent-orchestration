#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: PERFECT SESSION CAPTURING AUDIT LAUNCHER
# ───────────────────────────────────────────────────────────────
# Scratch operator helper for the parallel audit sweep.
# Stream 1: X01-X05 (GPT-5.4 via codex, cross-cutting analysis)
# Stream 2: C01-C20 (GPT-5.3-Codex via codex, file-level verification)
#
# Usage: bash launch-session-audit.sh [--stream1-only] [--stream2-only] [--dry-run]
# Scratch operator helper only. Do not treat launcher output as canonical closure proof.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
SCRIPTS_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/scripts"
TEMPLATES_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/templates"

DRY_RUN=false
STREAM1=true
STREAM2=true
PIDS=()
FAILED=0

for arg in "$@"; do
  case $arg in
    --stream1-only) STREAM2=false ;;
    --stream2-only) STREAM1=false ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

log() { echo "[$(date +%H:%M:%S)] $*"; }

launch_codex() {
  local id="$1"
  local model="$2"
  local output_file="$3"
  local prompt="$4"
  local extra_flags="${5:-}"
  local -a extra_args=()

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $output_file (model=$model)"
    return
  fi

  if [[ -n "$extra_flags" ]]; then
    read -r -a extra_args <<< "$extra_flags"
  fi

  log "Launching $id → $(basename "$output_file")"
  (
    cd "$PROJECT_ROOT"
    codex exec "$prompt" \
      --model "$model" \
      --sandbox read-only \
      "${extra_args[@]}" \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

# Common output format for all agents
FINDING_FORMAT='

OUTPUT FORMAT — repeat this block for EACH finding:

### FINDING-[NN]: [Title]
- **File:** [path:lines]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** BUG / QUALITY / PERFORMANCE / SECURITY / DESIGN
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Root Cause:** [why it is wrong]
- **Suggested Fix:** [concrete code change or pseudocode]
- **Effort:** TRIVIAL (<5 min) / SMALL (<30 min) / MEDIUM (<2 hr) / LARGE (>2 hr)

End with:

### SUMMARY
- Total findings: [N]
- Critical: [N], High: [N], Medium: [N], Low: [N]
- Top 3 recommendations: [...]

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or spawn child tasks. Complete ALL work with direct tool calls only.
Depth: 1'

# ═══════════════════════════════════════════════════════════════
# STREAM 1: DEEP ANALYSIS AGENTS (X01-X05) — GPT-5.4 xhigh
# ═══════════════════════════════════════════════════════════════

if $STREAM1; then
  log "=== STREAM 1: Deep Analysis Agents (X01-X05) ==="

  # X01: Data Flow & Architecture
  launch_codex "X01" "gpt-5.4" "$SCRATCH_DIR/analysis-X01.md" \
    "You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: DATA FLOW & ARCHITECTURE.

The pipeline converts AI conversation state (from OpenCode/Copilot JSON storage) into indexed memory files (.md). The entry point is $SCRIPTS_DIR/memory/generate-context.ts which calls the workflow in $SCRIPTS_DIR/core/workflow.ts.

TASK: Map the COMPLETE data flow from OpenCode session storage → memory file output. Read these files in order:
1. $SCRIPTS_DIR/memory/generate-context.ts (CLI entry, 502 lines)
2. $SCRIPTS_DIR/loaders/data-loader.ts (data loading, 195 lines)
3. $SCRIPTS_DIR/utils/input-normalizer.ts (data transformation, 499 lines)
4. $SCRIPTS_DIR/core/workflow.ts (orchestration, 950 lines)
5. $SCRIPTS_DIR/extractors/opencode-capture.ts (OpenCode capture, 539 lines)
6. $SCRIPTS_DIR/extractors/collect-session-data.ts (session data collection, 836 lines)
7. $SCRIPTS_DIR/renderers/template-renderer.ts (output rendering, 201 lines)
8. $SCRIPTS_DIR/core/file-writer.ts (file writing, 97 lines)

For each stage, identify:
- What data enters and exits
- What information is LOST or DROPPED during transformation
- Where type narrowing discards useful fields
- Any unnecessary intermediate representations
- Dead code paths or unreachable branches
- Missing error propagation

Draw an ASCII data flow diagram showing all stages and their inputs/outputs. $FINDING_FORMAT" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X02: Quality & Scoring
  launch_codex "X02" "gpt-5.4" "$SCRATCH_DIR/analysis-X02.md" \
    "You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: QUALITY & SCORING.

The pipeline has TWO quality scoring systems that evaluate generated memory files.

TASK: Audit both quality scorers for correctness, calibration, and usefulness. Read:
1. $SCRIPTS_DIR/core/quality-scorer.ts (v1 legacy scorer, 146 lines) — 6-dimension scoring
2. $SCRIPTS_DIR/extractors/quality-scorer.ts (v2 scorer, 127 lines) — rule-based V1-V9
3. $SCRIPTS_DIR/core/workflow.ts (how scorers are invoked, 950 lines)
4. $SCRIPTS_DIR/core/config.ts (quality thresholds, 273 lines)

For each scorer, analyze:
- Are the scoring dimensions meaningful and non-redundant?
- Are thresholds calibrated correctly? (What score does a perfect session get? An empty session?)
- Do quality gates actually catch real problems?
- What false positives exist? (Good content flagged as bad)
- What false negatives exist? (Bad content passes)
- Is the QUALITY_GATE_FAIL threshold correct?
- Do the two scorers agree? Can they contradict?
- Are penalty/bonus calculations mathematically sound?
- Edge cases: 0 messages, 1 message, all-tool messages, very long sessions $FINDING_FORMAT" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X03: Error Handling & Edge Cases
  launch_codex "X03" "gpt-5.4" "$SCRATCH_DIR/analysis-X03.md" \
    "You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: ERROR HANDLING & EDGE CASES.

TASK: Systematically test error handling across the entire pipeline. Read ALL .ts files in these directories:
- $SCRIPTS_DIR/extractors/ (11 files)
- $SCRIPTS_DIR/core/ (9 files)
- $SCRIPTS_DIR/loaders/ (2 files)
- $SCRIPTS_DIR/renderers/ (2 files)
- $SCRIPTS_DIR/utils/ (12 files)
- $SCRIPTS_DIR/memory/generate-context.ts

For each file, analyze what happens when:
1. Session has 0 messages (empty conversation)
2. Session has 1000+ messages (very long conversation)
3. JSON is corrupted or malformed
4. Files referenced in session don't exist on disk
5. Disk is full during file write
6. Permission denied on output directory
7. Concurrent writes to the same memory file
8. Input contains extremely long strings (>1MB per field)
9. Timestamps are in wrong format or timezone
10. Spec folder path doesn't exist or is a symlink

Map every try/catch block. For each one:
- Does it catch the right exception types?
- Does it log useful information?
- Does it re-throw or swallow errors?
- Is there a fallback behavior, and is it correct?
- Are there unhandled promise rejections? $FINDING_FORMAT" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X04: Template & Output Quality
  launch_codex "X04" "gpt-5.4" "$SCRATCH_DIR/analysis-X04.md" \
    "You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: TEMPLATE & OUTPUT QUALITY.

TASK: Compare the template expectations with actual rendering behavior. Read:
1. $TEMPLATES_DIR/context_template.md (the Mustache template, ~27KB)
2. $SCRIPTS_DIR/renderers/template-renderer.ts (rendering logic, 201 lines)
3. $SCRIPTS_DIR/core/file-writer.ts (post-render validation, 97 lines)
4. $SCRIPTS_DIR/core/tree-thinning.ts (content reduction, 248 lines)

Then read 5+ real memory files to compare template vs output:
- Find memory files: look for .md files in any memory/ subdirectory under $PROJECT_ROOT/.opencode/specs/

For EACH section in the template, verify:
- Is the placeholder correctly populated by the renderer?
- What happens when the data for that section is empty?
- Are there placeholder strings (like {{variable}}) leaking into output?
- Is the section omitted cleanly when empty, or does it leave artifacts?
- Is whitespace handling correct (no double blank lines, no trailing spaces)?
- Does tree-thinning preserve essential content or remove too aggressively?
- Are there sections in the template that are NEVER populated by the pipeline?
- Are there data fields extracted but NEVER rendered in the template?

Also check: markdown formatting correctness, heading hierarchy, list formatting, code block integrity in generated files. $FINDING_FORMAT" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X05: Security & Reliability
  launch_codex "X05" "gpt-5.4" "$SCRATCH_DIR/analysis-X05.md" \
    "You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: SECURITY & RELIABILITY.

TASK: Audit security and reliability across the full pipeline. Read:
1. $SCRIPTS_DIR/loaders/data-loader.ts (path handling, 195 lines)
2. $SCRIPTS_DIR/utils/path-utils.ts (path sanitization)
3. $SCRIPTS_DIR/core/file-writer.ts (file writing, 97 lines)
4. $SCRIPTS_DIR/extractors/session-extractor.ts (session ID generation, 478 lines)
5. $SCRIPTS_DIR/core/config.ts (configuration loading, 273 lines)
6. $SCRIPTS_DIR/memory/generate-context.ts (CLI argument parsing, 502 lines)
7. $SCRIPTS_DIR/extractors/contamination-filter.ts (input filtering, 61 lines)

Check for:
SECURITY:
- Path traversal: Can '../' in session data escape intended directories?
- Session ID: Is Math.random() used? Should use crypto.randomBytes()
- Input validation: Are user-controlled strings sanitized before file operations?
- Sensitive data: Could API keys, tokens, or credentials leak into memory files?
- Template injection: Could session content inject Mustache directives?

RELIABILITY:
- File writing atomicity: Is write-then-rename used? What if process crashes mid-write?
- TOCTOU races: Any check-then-act patterns on file existence?
- Resource leaks: File handles, streams not properly closed?
- Infinite loops: Any loop that could run forever on malformed input?
- Memory usage: Could processing a large session OOM the process?

Rate each finding by severity (CRITICAL/HIGH/MEDIUM/LOW) with concrete exploit/failure scenarios. $FINDING_FORMAT" \
    '-c model_reasoning_effort="xhigh"'
fi

# ═══════════════════════════════════════════════════════════════
# STREAM 2: FILE-LEVEL VERIFICATION (C01-C20) — GPT-5.3-Codex
# ═══════════════════════════════════════════════════════════════

if $STREAM2; then
  log "=== STREAM 2: File-Level Verification Agents (C01-C20) ==="
  sleep 5

  # C01: opencode-capture.ts
  launch_codex "C01" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C01.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/opencode-capture.ts (539 lines).

This file captures OpenCode/Copilot session data and builds exchange objects from messages.

Audit specifically:
1. TIMESTAMP MATCHING: There is a 5-second tolerance for matching messages to exchanges. Is 5s too loose? Could it match wrong messages? What about timezone handling?
2. OUTPUT TRUNCATION: Tool outputs are truncated to ~500 chars. Is this too aggressive? Are important details lost? Is the truncation boundary safe (could it cut mid-UTF8)?
3. buildExchanges(): Does it correctly pair user/assistant messages? What about interleaved tool calls?
4. PROMPT HISTORY PARSING: How are previous prompts extracted? Are they correctly associated with the right exchange?
5. ERROR HANDLING: What happens if the session JSON is malformed? Missing fields? Wrong types?
6. HARDCODED VALUES: List every magic number or hardcoded string with its purpose.

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C02: collect-session-data.ts (lines 1-400)
  launch_codex "C02" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C02.md" \
    "You are a code auditor. Read lines 1-400 of $SCRIPTS_DIR/extractors/collect-session-data.ts (836 total lines).

This file collects and structures session data from AI conversations.

Audit the first 400 lines specifically:
1. CONFIG/TYPES: Are type definitions complete? Any 'any' types that should be specific?
2. LEARNING INDEX FORMULA: How is the learning index calculated? Are weights reasonable? Is the formula documented? Edge cases (division by zero, negative values)?
3. PREFLIGHT/POSTFLIGHT: How are preflight and postflight data extracted? Can they be confused with regular messages?
4. IMPORTS: Are all imports used? Any circular dependencies?
5. CONSTANTS: Are magic numbers documented? Could they be in config?
6. TYPE SAFETY: Any type assertions (as any, as unknown) that bypass safety?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C03: collect-session-data.ts (lines 400-837)
  launch_codex "C03" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C03.md" \
    "You are a code auditor. Read lines 400-837 of $SCRIPTS_DIR/extractors/collect-session-data.ts (836 total lines).

Audit the second half specifically:
1. collectSessionData(): Is the main function logic correct? Any missing steps?
2. TASK EXTRACTION REGEX: What patterns are used to extract tasks? False positive rate? What formats does it miss?
3. CONTINUE SESSION LOGIC: How does it detect continued sessions? Can it incorrectly merge separate sessions?
4. COMPLETION PERCENTAGE: How is completion % calculated? Is it meaningful? Edge cases?
5. DATA AGGREGATION: Are counts and summaries accurate? Any off-by-one errors?
6. RETURN VALUE: Is the returned object complete? Any fields that could be undefined but aren't marked optional?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C04: data-loader.ts
  launch_codex "C04" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C04.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/loaders/data-loader.ts (195 lines).

This file loads session data from various sources (OpenCode storage, file system).

Audit specifically:
1. PRIORITY CHAIN: In what order are data sources tried? Is the priority correct?
2. PATH SANITIZATION: How are file paths constructed? Any traversal risks?
3. ERROR HANDLING: What happens when a source is unavailable? Does it fall through correctly?
4. LAZY LOADING: Is data loaded eagerly or lazily? Could it load unnecessary data?
5. FILE FORMAT DETECTION: How does it determine the format of loaded data? Any ambiguity?
6. CACHING: Is loaded data cached? Could stale data be returned?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C05: input-normalizer.ts
  launch_codex "C05" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C05.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/utils/input-normalizer.ts (499 lines).

This file normalizes input data from different AI session formats into a common structure. A recent bug was fixed in transformOpencodeCapture() where irrelevant session content was leaking into memory files due to missing spec-folder relevance filtering.

Audit specifically:
1. transformOpencodeCapture(): VERIFY the recent fix is complete. Does the spec-folder relevance filtering work correctly? Are there remaining edge cases?
2. DECISION REGEX: How are decisions extracted? Are the regex patterns robust? What do they miss?
3. CONFIDENCE VALUES: Are confidence scores hardcoded or computed? Are they meaningful?
4. FORMAT DETECTION: How does it distinguish between OpenCode, Copilot, and other formats?
5. DATA MAPPING: Are all source fields correctly mapped to target fields? Any data loss?
6. NORMALIZATION: Are strings trimmed? Are arrays deduplicated? Are dates normalized?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C06: workflow.ts (lines 1-300)
  launch_codex "C06" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C06.md" \
    "You are a code auditor. Read lines 1-300 of $SCRIPTS_DIR/core/workflow.ts (950 total lines).

This is the main orchestration file for the session-to-memory pipeline.

Audit the first 300 lines specifically:
1. runWorkflow(): How is the workflow initiated? Are preconditions checked?
2. DATA LOADING: How is session data loaded? Error handling for missing/corrupt data?
3. SESSION COLLECTION: How is the session data collected and structured?
4. ENHANCEMENT STEPS: What enhancement/enrichment steps are applied? Order dependencies?
5. CONFIG INTEGRATION: How is the config used? Any config values ignored?
6. TYPE SAFETY: Are intermediate results properly typed?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C07: workflow.ts (lines 300-600)
  launch_codex "C07" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C07.md" \
    "You are a code auditor. Read lines 300-600 of $SCRIPTS_DIR/core/workflow.ts (950 total lines).

Audit this middle section specifically:
1. SEMANTIC SUMMARY: How is the semantic summary generated? Is it accurate?
2. TREE THINNING INTEGRATION: How is tree-thinning invoked? Are parameters correct?
3. TEMPLATE RENDERING: How is the template rendered? Are all variables populated?
4. EXTRACTOR ORCHESTRATION: How are the various extractors called? Order dependencies?
5. DATA MERGING: How are results from different extractors merged? Any overwrite risks?
6. INTERMEDIATE STATE: Is intermediate state properly managed between steps?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C08: workflow.ts (lines 600+)
  launch_codex "C08" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C08.md" \
    "You are a code auditor. Read lines 600 to the end of $SCRIPTS_DIR/core/workflow.ts (950 total lines).

Audit this final section specifically:
1. QUALITY SCORING INTEGRATION: How are quality scores computed and used? Do they gate output?
2. FILE WRITING: How is the final memory file written? Atomic? Error recovery?
3. INDEXING: How is the memory file indexed after writing? What if indexing fails?
4. ERROR RECOVERY: What happens when any step fails? Is the pipeline recoverable?
5. CLEANUP: Are temporary files/state cleaned up on failure?
6. RETURN VALUE: What does the workflow return? Is it informative enough for callers?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C09: session-extractor.ts
  launch_codex "C09" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C09.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/session-extractor.ts (478 lines).

This file extracts session metadata: tool counts, context type, importance tier, project phase, session ID.

Audit specifically:
1. SESSION ID GENERATION: How is the session ID created? Does it use Math.random() (insecure) or crypto.randomBytes() (secure)? If Math.random(), flag as CRITICAL.
2. TOOL COUNTING: How are tools counted? Are all tool types recognized? Any missed?
3. CONTEXT TYPE DETECTION: How is the context type determined? Are the categories exhaustive?
4. IMPORTANCE TIER: How is importance calculated? Are the tier boundaries reasonable?
5. PROJECT PHASE: How is the project phase detected? Regex-based? Robust?
6. EDGE CASES: What happens with 0 messages, 1 message, tool-only messages?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C10: file-extractor.ts
  launch_codex "C10" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C10.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/file-extractor.ts (338 lines).

This file extracts file information from session data (files read, modified, created).

Audit specifically:
1. FOUR SOURCES: What are the 4 sources of file information? Are they all correctly parsed?
2. DEDUP LOGIC: How are duplicate files removed? Is the dedup actually effective?
3. OBSERVATION TYPE: How is the observation type (read/write/create) determined? Any ambiguity?
4. MAX_FILES LIMIT: What is the MAX_FILES limit? Is it configurable? What happens when exceeded — are important files dropped?
5. PATH NORMALIZATION: Are file paths normalized? Relative vs absolute? Platform differences?
6. METADATA: What metadata is extracted per file? Lines changed? Size? Purpose?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C11: decision-extractor.ts
  launch_codex "C11" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C11.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/decision-extractor.ts (400 lines).

This file extracts architectural decisions from conversation text.

Audit specifically:
1. DECISION CUE REGEX: What patterns trigger decision detection? Are they comprehensive? False positives?
2. SENTENCE EXTRACTION: How are decision sentences extracted from surrounding text? Boundary detection?
3. OPTION/RATIONALE PARSING: How are options and rationales identified? Accuracy?
4. CONFIDENCE SCORING: Is the confidence score hardcoded (e.g., always 75)? Should it be computed?
5. DEDUP: Can the same decision be extracted multiple times? How are duplicates handled?
6. CONTEXT: How much surrounding context is captured with each decision?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C12: conversation-extractor.ts
  launch_codex "C12" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C12.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/conversation-extractor.ts (253 lines).

This file extracts structured conversation data from messages.

Audit specifically:
1. MESSAGE ASSEMBLY: How are messages assembled into a coherent conversation? Any ordering issues?
2. PHASE CLASSIFICATION: How are conversation phases detected (exploration, implementation, etc.)? Accuracy?
3. TOOL DETECTION IN FACTS: How are tool-use facts distinguished from regular conversation? Reliable?
4. CONFIDENCE FILTERING: How is low-confidence content filtered? Threshold?
5. KEY INSIGHT EXTRACTION: How are key insights identified? Are they actually insightful?
6. SUMMARY GENERATION: How is the conversation summary generated? Length/quality?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C13: diagram-extractor.ts
  launch_codex "C13" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C13.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/diagram-extractor.ts (236 lines).

This file extracts diagrams and flowcharts from conversation content.

Audit specifically:
1. PHASE EXTRACTION: How are phases extracted for diagram generation? Accuracy?
2. ASCII ART DETECTION: How is existing ASCII art detected in messages? False positives/negatives?
3. FLOWCHART GENERATION: How are flowcharts generated from non-diagram content? Quality?
4. DEDUP: How are duplicate diagrams handled? By content hash? By structure?
5. RENDERING: Are generated diagrams valid ASCII art? Formatting issues?
6. INTEGRATION: How do extracted diagrams integrate with the template? Section placement?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C14: quality-scorer.ts (v1 legacy)
  launch_codex "C14" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C14.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/core/quality-scorer.ts (146 lines).

This is the v1 (legacy) quality scorer with 6-dimension scoring.

Audit specifically:
1. SIX DIMENSIONS: What are the 6 scoring dimensions? Are they meaningful and non-redundant?
2. THRESHOLD CALIBRATION: What thresholds trigger warnings/failures? Are they well-calibrated?
3. SCORING MATH: Is the scoring formula mathematically sound? Weights balanced?
4. EDGE CASES: What scores does it give for: empty session, perfect session, tool-only session?
5. WARNING TRIGGERS: What conditions trigger warnings? Are they actionable?
6. INTERACTION WITH V2: Does this scorer conflict with the v2 scorer? Are both needed?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C15: quality-scorer.ts (v2)
  launch_codex "C15" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C15.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/extractors/quality-scorer.ts (127 lines).

This is the v2 quality scorer with rule-based V1-V9 scoring.

Audit specifically:
1. RULES V1-V9: What does each rule check? Are they well-defined?
2. PENALTY/BONUS MATH: How are penalties and bonuses calculated? Can they result in negative or >100 scores?
3. FLAG EMISSION: What quality flags are emitted? Are flag names consistent?
4. EDGE CASES: Score for: empty data, minimal data, perfect data, data with only penalties?
5. RULE OVERLAP: Do any rules overlap with v1 scorer dimensions?
6. CONFIGURABILITY: Are thresholds hardcoded or configurable?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C16: template-renderer.ts
  launch_codex "C16" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C16.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/renderers/template-renderer.ts (201 lines).
Also read $TEMPLATES_DIR/context_template.md to understand what the renderer targets.

Audit specifically:
1. MUSTACHE RENDERING: Is the Mustache rendering configured correctly? Escaping?
2. OPTIONAL PLACEHOLDER SUPPRESSION: How are empty/optional sections removed? Complete?
3. WHITESPACE CLEANUP: How is whitespace normalized after rendering? Double blank lines?
4. SECTION VISIBILITY: Are conditional sections ({{#section}}/{{/section}}) handled correctly?
5. SPECIAL CHARACTERS: How are special characters in content handled? Markdown escaping?
6. TEMPLATE LOADING: How is the template loaded? Cached? Error handling for missing template?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C17: file-writer.ts
  launch_codex "C17" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C17.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/core/file-writer.ts (97 lines).

This file writes the final memory file to disk.

Audit specifically:
1. ATOMIC WRITE: Is the write atomic (write-to-temp-then-rename)? Or direct write?
2. PLACEHOLDER VALIDATION: How are remaining placeholders detected? Are all caught?
3. SUBSTANCE CHECK: How is 'substantial content' verified? What passes? What fails?
4. DUPLICATE DETECTION: How are duplicate memory files detected? By filename? By content?
5. DIRECTORY CREATION: Are parent directories created if missing? Permissions?
6. ERROR RECOVERY: What happens on write failure? Is partial content cleaned up?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C18: tree-thinning.ts
  launch_codex "C18" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C18.md" \
    "You are a code auditor. Read EVERY LINE of $SCRIPTS_DIR/core/tree-thinning.ts (248 lines).

This file reduces content size when memory files exceed token limits.

Audit specifically:
1. TOKEN ESTIMATION: How are tokens estimated? Is the estimation accurate?
2. MERGE THRESHOLD: What determines when sections are merged? Is the threshold correct?
3. CONTENT-AS-SUMMARY: When full content is used as summary, is this correct?
4. DATA PRESERVATION: What data is preserved vs discarded during thinning? Priority correct?
5. SECTION ORDERING: Does thinning respect section importance hierarchy?
6. EDGE CASES: What happens when ALL content must be thinned? Minimum viable output?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C19: config.ts + contamination-filter.ts
  launch_codex "C19" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C19.md" \
    "You are a code auditor. Read EVERY LINE of these TWO files:
1. $SCRIPTS_DIR/core/config.ts (273 lines) — configuration management
2. $SCRIPTS_DIR/extractors/contamination-filter.ts (61 lines) — content filtering

Audit specifically:
CONFIG:
1. CONFIG LOADING: How is config loaded? JSONC parsing correct? Fallback defaults?
2. SCHEMA VALIDATION: Is the config schema validated? What happens with unknown keys?
3. ENVIRONMENT OVERRIDES: Can config be overridden via environment variables?
4. MISSING VALUES: What happens when optional config values are missing?

CONTAMINATION FILTER:
5. DENYLIST PATTERNS: How many patterns are in the denylist? List them all. Are they sufficient?
6. FALSE POSITIVE RATE: Could the denylist incorrectly filter legitimate content?
7. CONTEXT AWARENESS: Does the filter consider context or just string matching?
8. COVERAGE: What common AI chatter patterns are MISSING from the denylist?
   Think about: 'I hope this helps', 'Let me know if', 'As an AI', 'I cannot', 'Here is', 'Sure!', 'Great question', session metadata, system prompts, tool scaffolding.

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
  sleep 3

  # C20: generate-context.ts + spec folder detection
  launch_codex "C20" "gpt-5.3-codex" "$SCRATCH_DIR/audit-C20.md" \
    "You are a code auditor. Read EVERY LINE of these files:
1. $SCRIPTS_DIR/memory/generate-context.ts (502 lines) — CLI entry point
2. Look for a folder-detector.ts or spec-folder detection logic in $SCRIPTS_DIR/core/ or $SCRIPTS_DIR/utils/ or $SCRIPTS_DIR/loaders/

Audit specifically:
1. CLI PARSING: How are CLI arguments parsed? Validation? Error messages?
2. SPEC FOLDER RESOLUTION: How is the spec folder path resolved? Relative/absolute handling?
3. JSON INPUT MODE: How does Mode 1 (JSON from /tmp) work? Security implications of reading from /tmp?
4. DIRECT MODE: How does Mode 2 (direct path) work? Path validation?
5. SUB-FOLDER SEARCH: How does bare subfolder ID auto-search work? Ambiguity handling?
6. ALIGNMENT VALIDATION: How is alignment between spec folder and session validated?
7. EXIT CODES: What exit codes are used? Are they documented and consistent?

Report every issue, no matter how small. $FINDING_FORMAT" \
    '-c model_reasoning_effort="high"'
fi

# ═══════════════════════════════════════════════════════════════
# WAIT FOR ALL AGENTS
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "=== Waiting for ${#PIDS[@]} agents to complete ==="
  for pid in "${PIDS[@]}"; do
    if ! wait "$pid"; then
      FAILED=$((FAILED + 1))
    fi
  done

  log "=== All agents complete. Failed: $FAILED/${#PIDS[@]} ==="

  # Report results
  echo ""
  echo "=== OUTPUT FILES ==="
  for f in "$SCRATCH_DIR"/analysis-X*.md "$SCRATCH_DIR"/audit-C*.md; do
    if [[ -f "$f" ]]; then
      size=$(wc -c < "$f")
      lines=$(wc -l < "$f")
      echo "  $(basename "$f"): ${lines} lines, ${size} bytes"
    fi
  done
fi
