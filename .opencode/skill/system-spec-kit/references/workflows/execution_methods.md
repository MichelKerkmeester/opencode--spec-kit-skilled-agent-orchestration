---
title: Execution Methods Reference
description: How to execute spec folder operations - validation, completion checking, context saving, and template composition
---

# Execution Methods Reference

How to execute spec folder operations - validation, completion checking, context saving, and template composition.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This document covers validation, completion checking, context saving, folder creation, and template composition operations.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:validation -->
## 2. VALIDATION

### validate.sh

Validates spec folder structure and content against level requirements.

**Usage:**
```bash
# Basic validation
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/001-feature/

# Quiet mode (suppress non-essential output)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --quiet specs/001-feature/

# JSON output
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --json specs/001-feature/
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Validation passed |
| 1 | Warnings found (non-blocking) |
| 2 | Errors found (blocking) |

---

<!-- /ANCHOR:validation -->
<!-- ANCHOR:completion-checking -->
## 3. COMPLETION CHECKING

### check-completion.sh

Verifies all checklist items are marked complete before claiming "done".

**Usage:**
```bash
# Check completion status
bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh specs/001-feature/

# JSON output for automation
bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh --json specs/001-feature/
```

**Requirements:**
- All `[x]` items must have evidence
- P0 items are hard blockers
- P1 items require completion OR user-approved deferral
- P2 items can be deferred without approval

---

<!-- /ANCHOR:completion-checking -->
<!-- ANCHOR:context-saving -->
## 4. CONTEXT SAVING

### generate-context.ts

Generates memory files from conversation context for future session recovery.

**Usage:**
```bash
# JSON file mode (preferred) - pass structured JSON data file
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context-data.json specs/001-feature/

# Inline JSON mode - pass structured JSON directly
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/

# Stdin mode - pipe structured JSON
echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
```

**Environment Variables:**
| Variable | Default | Purpose |
|----------|---------|---------|
| DEBUG | false | Enable debug logging |
| AUTO_SAVE_MODE | false | Skip alignment check |
| SPECKIT_QUIET | false | Suppress non-essential output |

---

<!-- /ANCHOR:context-saving -->
<!-- ANCHOR:spec-folder-creation -->
## 5. SPEC FOLDER CREATION

### spec/create.sh

Creates new spec folders with appropriate templates.

**Usage:**
```bash
# Interactive mode
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh

# With arguments
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 2 --name "feature-name"

# Sub-folder mode
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --subfolder specs/001-parent/ --topic "iteration-2"
```

**Phase creation**: `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase specs/022-feature/ --topic 'skill-review'`
**Recursive validation**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/022-feature/ --recursive`
These commands create/validate direct-child phase packets
under a coordination root.

**Flags:**
| Flag | Purpose |
|------|---------|
| `--level N` | Set documentation level (1-3) |
| `--name NAME` | Feature name for folder |
| `--subfolder PATH` | Create as sub-folder of existing spec |
| `--topic NAME` | Topic name for sub-folder |
| `--sharded` | Create sharded sections (Level 3) |

---

<!-- /ANCHOR:spec-folder-creation -->
<!-- ANCHOR:level-recommendation -->
## 6. LEVEL RECOMMENDATION

### recommend-level.sh

Recommends appropriate documentation level based on feature characteristics.

**Usage:**
```bash
# Basic recommendation
bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh "Add user authentication"

# With feature flags
bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --auth --api "Add OAuth login"
```

**Feature Flags:**
| Flag | Effect |
|------|--------|
| `--auth` | Increases level (security-sensitive) |
| `--api` | Increases level (API changes) |
| `--db` | Increases level (database changes) |
| `--architectural` | Forces Level 3 |

---

<!-- /ANCHOR:level-recommendation -->
<!-- ANCHOR:template-composition -->
## 7. TEMPLATE COMPOSITION

### compose.sh

Composes level-specific templates from core + addendum source components. Ensures consistency between source templates and composed outputs.

**Usage:**
```bash
# Compose all level templates
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh

# Preview changes without writing files
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --dry-run

# Verbose output during composition
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verbose

# Verify composed templates match sources
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify

# Compose specific levels only
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh 2 3
```

**Flags:**
| Flag | Purpose |
|------|---------|
| `--dry-run, -n` | Preview changes without writing files |
| `--verbose, -v` | Show detailed output during composition |
| `--force, -f` | Overwrite existing files without prompting |
| `--verify` | Verify composed templates match sources |
| `--help, -h` | Show help message |

**Composition Rules:**
| Level | Components |
|-------|------------|
| Level 1 | Core only |
| Level 2 | Core + level2-verify addendum |
| Level 3 | Core + level2-verify + level3-arch addendums |
| Level 3+ | Core + all addendums |

**When to Use:**
- After modifying `core/` templates
- After modifying `addendum/` templates
- To verify template consistency in CI/CD
- Before releasing template updates

---

<!-- /ANCHOR:template-composition -->
<!-- ANCHOR:memory-workflow-12-steps -->
## 8. MEMORY WORKFLOW (12 Steps)

The `generate-context.js` script orchestrates a 12-step workflow via `workflow.ts`:

### Workflow Steps

| Step | Name | Description |
|------|------|-------------|
| **1** | Load Data | Load collected data from JSON file or preloaded data |
| **2** | Detect Spec Folder | Find target spec folder with alignment validation |
| **3** | Setup Context Directory | Create memory directory structure |
| **4-7** | Parallel Extraction | Extract session data, conversations, decisions, diagrams, and workflow flowchart (parallel execution) |
| **7.5** | Semantic Summary | Generate implementation summary with file change analysis |
| **8** | Populate Template | Fill context template with extracted data |
| **9** | Write Files | Atomic file writes with rollback on failure |
| **9.5** | State Embedding | Embed state in memory file (V13.0 format) |
| **10** | Success Confirmation | Log summary of saved content |
| **11** | Semantic Indexing | Generate embeddings and index in vector database |
| **12** | Retry Processing | Process any pending embeddings from retry queue |

### Parallel Extraction (Steps 4-7)

Steps 4-7 run in parallel for performance:

```
┌─────────────────────────────────────────────────┐
│              PARALLEL EXTRACTION                │
├─────────────────────────────────────────────────┤
│  📋 Session data collection                     │
│  💬 Conversation extraction                     │
│  🧠 Decision extraction                         │
│  📊 Diagram extraction                          │
│  🔀 Workflow flowchart generation               │
└─────────────────────────────────────────────────┘
```

### Output Files

| File | Purpose |
|------|---------|
| `{date}_{time}__{topic}.md` | Main memory file with ANCHOR format |
| `metadata.json` | Statistics and embedding info |

### Quality Scoring

The workflow calculates a quality score (0-100) based on:
- Content length and depth
- Number of anchors
- Recency factors
- Message statistics

Low quality sessions (<20 score) receive a warning header in the output.

---

<!-- /ANCHOR:memory-workflow-12-steps -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

- [Validation Rules](../validation/validation_rules.md)
- [Folder Routing](../structure/folder_routing.md)
- [Quick Reference](../workflows/quick_reference.md)
- [Template Guide](../templates/template_guide.md)
<!-- /ANCHOR:related-resources -->
