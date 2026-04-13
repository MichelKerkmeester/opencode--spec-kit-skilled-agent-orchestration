---
title: Memory Save Workflow
description: Complete guide to saving conversation context including execution methods, output format, and retrieval.
---

# Memory Save Workflow - Context Preservation Methods

Complete guide to saving conversation context, execution methods, and retrieval.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Execute save operations through whichever method fits your workflow - slash commands for convenience, direct scripts for control. All paths feed the same canonical save entrypoint, update the target packet's continuity surfaces, and reindex the resulting packet docs for retrieval.

When direct CLI mode includes an explicit spec-folder argument, that target is authoritative. Session-learning matches, JSON `SPEC_FOLDER` fields, and auto-detect may inform diagnostics, but they must not reroute the save to another folder.

Direct phase-folder targets are supported. If the explicit CLI target resolves to a policy-defined phase folder, `generate-context.js` preserves that target and updates the selected phase folder's canonical continuity surfaces instead of rerouting elsewhere.

### Governed Save Boundaries

The save workflow stays compatible with private and agent-scoped operation. When the surrounding runtime enables governance, save and follow-up retrieval flows may carry `tenantId`, `userId`, and `agentId` so memory capture stays inside the intended boundary.

### Execution Paths

The memory system supports **2 independent execution paths**. Any method can be used standalone.

### Method Comparison

| Method            | AI Agent Required | Best For                           | Effort | Token Cost |
| ----------------- | ----------------- | ---------------------------------- | ------ | ---------- |
| **Slash Command** | Yes               | Interactive saves, manual triggers | Low    | ~200       |
| **Direct Script** | No                | Testing, debugging, CI/CD          | Medium | 0          |

### Execution Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    MEMORY SAVE PATHWAYS                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   Slash Command                    Direct Script               │
│   ┌──────────┐                    ┌──────────┐                 │
│   │ /memory: │                    │  node    │                 │
│   │  save    │                    │ script.ts│                 │
│   └────┬─────┘                    └────┬─────┘                 │
│        │                               │                       │
│        ▼                               ▼                       │
│   ┌──────────┐                    ┌──────────┐                 │
│   │ AI Agent │                    │   JSON   │                 │
│   │ Analysis │                    │   Input  │                 │
│   └────┬─────┘                    └────┬─────┘                 │
│        │                               │                       │
│        └───────────────────────────────┘                       │
│                              │                                 │
│                              ▼                                 │
│                    ┌─────────────────┐                         │
│                    │ generate-context│                         │
│                    │      .ts        │                         │
│                    └────────┬────────┘                         │
│                             │                                  │
│                             ▼                                  │
│                    ┌─────────────────┐                         │
│                    │ canonical packet│                         │
│                    │ continuity docs │                         │
│                    └─────────────────┘                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:method-selection -->
## 2. METHOD SELECTION

### Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│              WHICH METHOD SHOULD I USE?                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ Is an AI agent active in      │
              │ the current conversation?     │
              └───────────────┬───────────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
              YES                           NO
               │                             │
               ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│ Need automatic          │   │ Prepare JSON, then use  │
│ conversation analysis?  │   │ Direct Script method    │
└────────────┬────────────┘   └─────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
     YES           NO
      │             │
      ▼             ▼
┌───────────┐ ┌───────────┐
│   SLASH   │ │  DIRECT   │
│  COMMAND  │ │  SCRIPT   │
│           │ │ (custom   │
│ /memory:  │ │  JSON)    │
│   save    │ │           │
└───────────┘ └───────────┘
```

### Quick Selection Guide

| Scenario                                  | Recommended Method |
| ----------------------------------------- | ------------------ |
| End of work session, want AI to summarize | **Slash Command**  |
| CI/CD pipeline, automated saves           | **Direct Script**  |
| Quick manual save, no AI available        | **Direct Script**  |
| Testing memory system functionality       | **Direct Script**  |
| Batch processing multiple saves           | **Direct Script**  |
| Interactive session with full context     | **Slash Command**  |

---

<!-- /ANCHOR:method-selection -->
<!-- ANCHOR:slash-commands -->
## 3. SLASH COMMANDS

**When to Use:** Manual save with AI-powered conversation analysis
**Requirement:** Slash command files exist in `.opencode/command/memory/`

### Available Commands

```
/memory:save       # Save current conversation context
/memory:search  # Unified retrieval + analysis: search, epistemic baselines, causal graph, evaluation
```

### Execution Flow

1. Slash command expands to full prompt
2. AI agent analyzes conversation history
3. AI agent creates structured JSON summary (any agent can invoke generate-context.js for memory — this is an exception to the @speckit exclusivity rule)
4. AI agent calls `generate-context.js` with JSON data
5. Canonical continuity updated inside the active root-spec or phase packet

### Validation Checkpoints

| Checkpoint       | Verification                   | Action on Failure         |
| ---------------- | ------------------------------ | ------------------------- |
| Command exists   | `ls .opencode/command/memory/` | Create command file       |
| AI agent active  | Check response capability      | Use Direct Script instead |
| Spec folder arg  | Passed via CLI argument        | Specify folder manually   |
| Write permission | `test -w specs/###/`           | Check packet permissions  |

### Example Output

```
✓ Context analyzed (12 exchanges detected)
✓ Spec folder: 049-anchor-context-retrieval
✓ Continuity surfaces updated for: 049-anchor-context-retrieval
✓ Primary continuity block: implementation-summary.md::_memory.continuity
✓ Packet docs reindexed
```

---

<!-- /ANCHOR:slash-commands -->
<!-- ANCHOR:direct-script -->
## 4. DIRECT SCRIPT

**When to Use:** Testing, debugging, custom workflows, CI/CD pipelines
**Requirement:** Node.js installed

### Usage Pattern

```bash
# Create minimal JSON data file
cat > /tmp/test-save-context.json << 'EOF'
{
  "SPEC_FOLDER": "049-anchor-context-retrieval",
  "recent_context": [{
    "request": "Test save-context execution",
    "completed": "Verified system works standalone",
    "learning": "Direct script execution requires minimal JSON",
    "duration": "5m",
    "date": "2025-11-28T18:30:00Z"
  }],
  "observations": [{
    "type": "discovery",
    "title": "Standalone execution test",
    "narrative": "Testing direct script invocation",
    "timestamp": "2025-11-28T18:30:00Z",
    "files": [],
    "facts": ["Standalone execution works", "Minimal data sufficient"]
  }],
  "user_prompts": [{
    "prompt": "Test save-context standalone",
    "timestamp": "2025-11-28T18:30:00Z"
  }]
}
EOF

# Execute script directly
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  /tmp/test-save-context.json \
  "049-anchor-context-retrieval"

# Inline JSON mode (preferred for routine saves)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"049-anchor-context-retrieval","sessionSummary":"Implemented anchor retrieval..."}' \
  "049-anchor-context-retrieval"

# Stdin mode (preferred for routine saves)
echo '{"specFolder":"049-anchor-context-retrieval","sessionSummary":"..."}' | \
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin

```

### Required JSON Fields

| Field            | Type   | Required | Description               |
| ---------------- | ------ | -------- | ------------------------- |
| `SPEC_FOLDER`    | string | Yes      | Target spec folder name   |
| `recent_context` | array  | Yes      | Array of context objects  |
| `observations`   | array  | No       | Discoveries and learnings |
| `user_prompts`   | array  | No       | Original user requests    |

If both the JSON payload and the CLI provide a spec folder, the explicit CLI argument wins.

If that explicit CLI argument resolves to a phase folder, the command keeps that explicit target and updates the selected phase folder's own canonical continuity surfaces.

### Validation Checkpoints

| Checkpoint         | Verification                                           | Action on Failure        |
| ------------------ | ------------------------------------------------------ | ------------------------ |
| Node.js installed  | `node --version`                                       | Install Node.js          |
| Script exists      | `test -f .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Check skill installation |
| JSON valid         | `jq . < input.json`                                    | Fix JSON syntax          |
| Spec folder exists | `test -d specs/###/`                                   | Create spec folder       |
| Target exists under specs roots | Use the exact root-spec or phase-folder path you want to save into | Re-run with an explicit CLI target |

---

<!-- /ANCHOR:direct-script -->
<!-- ANCHOR:output-format -->
## 5. OUTPUT FORMAT

### Canonical Output Surfaces

The Phase 018 save path is packet-first. `generate-context.js` no longer treats a standalone timestamped `memory/*.md` file as the primary continuity artifact. Instead it updates continuity inside the selected packet and reindexes the affected docs.

| Surface | Role |
|---------|------|
| `implementation-summary.md` | Primary continuity document carrying `_memory.continuity` in frontmatter |
| Routed packet docs | Canonical narrative updates applied in-place to spec/plan/tasks/checklist/decision/summary surfaces as appropriate |
| `handover.md` | Separate first-class recovery surface created by `/spec_kit:handover`, not by routine `/memory:save` |

### Continuity Block Shape

```yaml
_memory:
  continuity:
    packet_pointer: "026/.../007-018-sk-system-speckit-revisit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Aligned save/recovery docs to packet-first continuity"
    next_safe_action: "Run strict packet validation"
    key_files:
      - "implementation-summary.md"
      - "spec.md"
```

### Output Location

```
specs/###-feature-name/
├── implementation-summary.md    # carries _memory.continuity
├── spec.md / plan.md / tasks.md # canonical packet docs
└── handover.md                  # optional, separate command-managed surface
```

---

<!-- /ANCHOR:output-format -->
<!-- ANCHOR:document-structure -->
## 6. DOCUMENT STRUCTURE

### Canonical Continuity Expectations

The save path updates packet docs rather than creating a separate primary session note. In practice that means:

- `implementation-summary.md` carries the thin `_memory.continuity` block.
- packet narrative remains in canonical docs rather than a parallel memory note.
- recovery begins with `handover.md`, then `_memory.continuity`, then the rest of the packet docs.

### Canonical Save Router

The routed save path classifies each canonical chunk into exactly 8 categories:

| Category | Typical target | Notes |
|----------|----------------|-------|
| `narrative_progress` | `implementation-summary.md::what-built` | Substantive system or packet delta |
| `narrative_delivery` | `implementation-summary.md::how-delivered` | Sequencing, gating, rollout, and verification path |
| `decision` | `decision-record.md::adr-NNN` on L3/L3+ or `implementation-summary.md::decisions` on L1/L2 | Choice, tradeoff, rationale |
| `handover_state` | `handover.md::session-log` | Recent action, blocker, resume order, next safe action |
| `research_finding` | `research/research.md::findings` | Investigation result or cited evidence |
| `task_update` | `tasks.md::<phase-anchor>` | Task or checklist mutation |
| `metadata_only` | `_memory.continuity` | Machine-owned continuity payloads |
| `drop` | `scratch/pending-route-<hash>.json` via refusal | Transcript/tooling noise that must not merge |

Routing contract highlights:

- Tier 1 handles structured routes and strong heuristics.
- Tier 2 uses routing-prototype similarity.
- Tier 3 is now live in the save handler by default and `LLM_REFORMULATION_ENDPOINT` is configured. If Tier 3 is disabled or unavailable, the save path falls back to Tier 2 with a confidence penalty when safe, otherwise it refuses to route.
- Delivery cues are intentionally stronger when the chunk mentions sequencing, gating, rollout, or verification.
- Handover and drop now split hard transcript/tool telemetry wrappers from softer operational phrases like `git diff`, `list memories`, or `force re-index`.
- `routeAs` can force a category and keeps the natural decision for audit if the override crosses a natural `drop`.
- Router context passes `packet_kind` derived from spec metadata first (`type`, `title`, `description`), with parent-phase fallback only when metadata is silent.

### Anchor Tags

Packet docs should continue to use HTML comment anchors for targeted retrieval:

```html
Content here...
```

**Categories**: `implementation`, `decision`, `guide`, `architecture`, `files`, `discovery`, `integration`

### All Indexed Content Sources (3)

The canonical save path updates packet docs first. During `memory_index_scan()`, the memory system indexes three supporting source families:

| Content Type | Location | Weight | Indexed By |
|-------------|----------|--------|------------|
| Spec documents | `.opencode/specs/**/*.md` and `specs/**/*.md` | Per-type multiplier | `findSpecDocuments()` |
| Constitutional rules | `.opencode/skill/*/constitutional/*.md` | 1.0 | `findConstitutionalFiles()` |
| Legacy memory artifacts | `specs/*/memory/*.{md,txt}` when present | 0.5 | `findMemoryFiles()` |

Spec documents are controlled by the `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. Spec documents use per-document scoring multipliers (e.g., spec: 1.4x, plan: 1.3x, constitutional: 2.0x) and schema v23 fields (`document_type`, `spec_level`).

For retrieval, `memory_context()` routes queries across 7 intents (including `find_spec` and `find_decision`) and applies intent-aware weighting.

> **Tip:** Add `<!-- ANCHOR:name -->` tags to spec documents and continuity-rich packet sections so targeted retrieval can pull only the sections you need.

---

<!-- /ANCHOR:document-structure -->
<!-- /ANCHOR:name -->

<!-- ANCHOR:metadata -->
## 7. METADATA

### JSON Structure

```json
{
  "timestamp": "2025-12-07T14:30:00Z",
  "specFolder": "049-oauth-implementation",
  "messageCount": 45,
  "decisionCount": 3,
  "diagramCount": 2,
  "duration": "2h 15m",
  "topics": ["oauth", "jwt", "authentication"]
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 | Save time in UTC |
| `specFolder` | string | Associated spec folder name |
| `messageCount` | number | Total conversation messages |
| `decisionCount` | number | Documented decisions |
| `diagramCount` | number | ASCII diagrams included |
| `duration` | string | Human-readable session length |
| `topics` | array | Extracted topic keywords |

### Timestamp Formats

| Context | Format | Example |
|---------|--------|---------|
| Filename date | DD-MM-YY | 07-12-25 |
| Filename time | HH-MM | 14-30 |
| JSON timestamp | ISO 8601 | 2025-12-07T14:30:00Z |
| Conversation flow | HH:MM:SS | 14:30:45 |

**Timezone Handling:**
- **Filenames**: Local timezone (user's system)
- **JSON metadata**: Always UTC (ISO 8601 with Z suffix)
- **Conversation flow**: Local timezone with optional offset notation

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:anchor-retrieval -->
## 8. ANCHOR RETRIEVAL

### Token Efficiency Comparison

| Approach | Tokens | Savings | Use Case |
|----------|--------|---------|----------|
| Full packet-doc read | ~12,000 | - | Need complete context |
| Anchor extraction | ~800 | ~58-90% | Targeted retrieval |

### Quick Commands

```bash
# Find anchors by keyword in packet docs
grep -r "ANCHOR:.*decision.*auth" .opencode/specs/*/implementation-summary.md .opencode/specs/*/handover.md .opencode/specs/*/spec.md

# List all anchors in a file
grep "<!-- ANCHOR:" .opencode/specs/049-*/*.md

# Extract specific section
sed -n '/<!-- ANCHOR:decision-jwt-049 -->/,/<!-- \/ANCHOR:decision-jwt-049 -->/p' file.md
```

---

<!-- /ANCHOR:anchor-retrieval -->
<!-- /ANCHOR:decision-jwt-049 -->

<!-- ANCHOR:context-recovery -->
## 9. CONTEXT RECOVERY

**CRITICAL:** Before implementing ANY changes in a spec folder, rebuild context from canonical packet continuity first: `handover.md -> _memory.continuity -> spec docs`.

### Recovery Protocol

```
┌─────────────────────────────────────────────────────────────────┐
│               CONTEXT RECOVERY PROTOCOL                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │  STEP 1: Extract Keywords              │
         │  Identify 2-4 key terms from task      │
         └───────────────────┬────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │  STEP 2: Search Anchors                │
         │  grep -r "ANCHOR:.*keyword" specs/     │
         └───────────────────┬────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
          MATCHES                       NO MATCHES
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  STEP 3a: Load Context  │   │  STEP 3b: Acknowledge   │
│  Extract relevant       │   │  "No prior context      │
│  sections via script    │   │   found for [keywords]" │
└────────────┬────────────┘   └────────────┬────────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
         ┌────────────────────────────────────────┐
         │  STEP 4: Proceed with Implementation   │
         │  Reference loaded context as needed    │
         └────────────────────────────────────────┘
```

### Search Commands

```bash
# Search within current spec folder
grep -r "ANCHOR:.*keyword" .opencode/specs/###-current-spec/*.md .opencode/specs/###-current-spec/**/**/*.md

# Cross-spec search if broader context needed
grep -r "ANCHOR:.*keyword" .opencode/specs/**/*.md

# Extract specific anchor directly (UPPERCASE format)
sed -n '/<!-- ANCHOR:decision-auth-049 -->/,/<!-- \/ANCHOR:decision-auth-049 -->/p' file.md
```

### Response Templates

**When context found:**
> "Based on `handover.md` / `_memory.continuity` / packet docs, I see that [summary]. I'll build on this by..."

**When no context found:**
> "No prior context found for [task keywords] - proceeding with fresh implementation."

---

<!-- /ANCHOR:context-recovery -->
<!-- /ANCHOR:decision-auth-049 -->

<!-- ANCHOR:validation-checklists -->
## 10. VALIDATION CHECKLISTS

### File Naming

```
□ Date format: DD-MM-YY (not YYYY-MM-DD)
□ Time format: HH-MM (24-hour, no seconds)
□ Double underscore separator between time and topic
□ Topic in kebab-case (no spaces, no special characters)
□ Extension: .md
```

### Output Location

```
□ `_memory.continuity` updated in `implementation-summary.md`
□ Canonical packet docs reflect the saved continuity state
□ No manual continuity artifact was created outside the packet docs
```

### Document Structure

```
□ All required sections present (Overview, Key Decisions, Conversation Flow, Metadata)
□ Anchor tags properly formatted with opening and closing comments
□ Category keywords match allowed list
□ Spec folder number included in anchor IDs
```

---

<!-- /ANCHOR:validation-checklists -->
<!-- ANCHOR:post-save-quality-review -->
## 10.5. POST-SAVE QUALITY REVIEW (026 Calibration)

After `generate-context.js` completes, it emits a **POST-SAVE QUALITY REVIEW** block. This review checks the saved canonical continuity surfaces for common issues that degrade retrieval quality.

### Issue Severities

| Severity | Action Required |
|----------|----------------|
| **HIGH** | MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier) |
| **MEDIUM** | Patch when practical |
| **PASSED/SKIPPED** | No action needed |

### Common HIGH Issues

- Generic or missing `title` in frontmatter (degrades search ranking)
- Overly broad `trigger_phrases` that cause false-positive surfacing
- Incorrect `importance_tier` assignment (e.g., normal when constitutional is warranted)

### 026 Heuristic Calibration

- Save quality gate threshold calibrated to 0.4 signal density
- Short decision-type memories bypass content-length gate when `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true` and at least two structural signals (title, specFolder, or anchor) are present
- Trigger phrase sanitization strips overly generic single-word triggers during save-time validation
- Lineage handling preserves parent-child spec folder relationships in metadata when saving to nested packet paths

### Context Template Expectations

The context template (`templates/context_template.md`) defines the expected output structure. The post-save quality review validates against this template, checking for:
- Required ANCHOR pairs (opening and closing)
- PROJECT STATE SNAPSHOT section presence
- Proper frontmatter fields (title, specFolder, importance_tier)
- Minimum content density per section

---

<!-- /ANCHOR:post-save-quality-review -->
<!-- ANCHOR:troubleshooting -->
## 11. TROUBLESHOOTING

### Common Issues

| Issue                   | Cause               | Solution                           |
| ----------------------- | ------------------- | ---------------------------------- |
| "Spec folder not found" | Invalid folder name | Check `ls specs/` for correct name |
| "Permission denied"     | File permissions    | `chmod -R u+rw specs/###/`         |
| "JSON parse error"      | Malformed input     | Validate with `jq . < input.json`  |
| "No anchors found"      | Empty or new memory | Normal for new specs               |
| "Script not found"      | Wrong path          | Verify skill installation          |
| `Invalid date format`   | Wrong separator/order | Use DD-MM-YY with hyphens        |
| `Topic contains spaces` | Space in filename   | Convert to kebab-case              |
| `Missing anchor closing`| Incomplete anchor   | Add `<!-- /ANCHOR:... -->`         |
| "Saved to wrong folder" | Non-authoritative invocation path | Re-run with explicit CLI target; direct CLI mode does not reroute |
| "Saved to wrong folder" | Explicit CLI target was omitted or too broad | Re-run with the exact root-spec or phase-folder CLI target you intend to save into |

### Debug Commands

```bash
# Verify memory system installation
ls -la .opencode/skill/system-spec-kit/scripts/

# Check spec folder structure
tree specs/###-name/

# Validate JSON input
cat input.json | jq .

# Test script execution
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
```

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Reference Files
- [SKILL.md](../../SKILL.md) - Main workflow-memory skill documentation
- [troubleshooting.md](../debugging/troubleshooting.md) - Troubleshooting guide for memory operations

### Templates
- [context_template.md](../../templates/context_template.md) - Context document template structure
<!-- /ANCHOR:related-resources -->
