---
title: Execution Methods Reference
description: How to execute spec folder operations - validation, completion checking, context saving, and template selection
---

# Execution Methods Reference

How to execute spec folder operations - validation, completion checking, context saving, and template selection.

---

## 1. OVERVIEW

This document covers validation, completion checking, context saving, folder creation, and template selection operations.

---

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
| 0 | Success |
| 1 | User error such as bad flags or invalid input |
| 2 | Validation error |
| 3 | System error such as a missing folder or file I/O failure |

---

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

## 4. CONTEXT SAVING

### generate-context.js runtime entrypoint

Updates the target packet's canonical continuity surfaces from conversation context so future recovery can rebuild from `handover.md -> _memory.continuity -> spec docs`.

**Usage:**
```bash
# JSON file mode (preferred) - pass structured JSON data file
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/001-feature/

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

The direct script acquires a packet-local `.canonical-save.lock` before mutating canonical continuity surfaces. A concurrent save fails fast while a stale lock older than the configured timeout is removed with a warning.

---

## 5. SPEC FOLDER CREATION

### spec/create.sh

Creates new spec folders with appropriate templates.

**Usage:**
```bash
# Interactive mode
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh

# With arguments
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 2 --name "feature-name"

# With explicit path
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 2 --path specs/###-name --name "feature-name"

# Sub-folder mode
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --subfolder specs/001-parent/ --topic "iteration-2"
```

`--path` resolves and validates the target before writing; traversal outside the repository is rejected.

Set `SPECKIT_POST_VALIDATE=1` to opt into immediate post-create `validate.sh --quiet` checks.

**Phase creation**: `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase --phases 3 --phase-names 'foundation,implementation,integration' 'OAuth2 flow'`
**Append phases**: `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase --parent specs/022-feature --phases 2 --phase-names 'stabilization,rollout' 'OAuth2 flow'`
**Recursive validation**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/022-feature/ --recursive`
These commands create/validate direct-child phase packets
under a coordination root.

**Flags:**
| Flag | Purpose |
|------|---------|
| `--level N` | Set documentation level (1-3) |
| `--name NAME` | Feature name for folder |
| `--path PATH` | Create at an explicit validated path |
| `--subfolder PATH` | Create as sub-folder of existing spec |
| `--topic NAME` | Topic name for sub-folder |
| `--phase` | Create or append phase folders |
| `--phases N` | Set phase count |
| `--phase-names A,B` | Set comma-separated phase folder names |
| `--parent PATH` | Append phases to an existing parent |
| `--sharded` | Create sharded sections (Level 3) |

---

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

## 7. TEMPLATE COMPOSITION

### Level contract resolver

The resolver is the library that reads `templates/manifest/spec-kit-docs.json` for `create.sh`, `validate.sh`, and tests. For manual rendering, use the inline renderer.

**Usage:**
```bash
bash .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
  --level 3 \
  --out-dir /tmp/spec-kit-render \
  .opencode/skill/system-spec-kit/templates/manifest/spec.md.tmpl \
  .opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl
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
- After modifying Level contract templates
- After modifying Level contract templates
- To verify template consistency in CI/CD
- Before releasing template updates

---

## 8. MEMORY WORKFLOW (12 STEPS)

The `generate-context.js` script orchestrates a 12-step workflow via `workflow.ts`:

### Workflow Steps

| Step | Name | Description |
|------|------|-------------|
| **1** | Load Data | Load collected data from JSON file or preloaded data |
| **2** | Detect Spec Folder | Find target spec folder with alignment validation |
| **3** | Resolve Target Packet | Lock onto the explicit root-spec or phase-folder target |
| **4-7** | Parallel Extraction | Extract session data, conversations, decisions, diagrams, and workflow flowchart (parallel execution) |
| **7.5** | Semantic Summary | Generate implementation summary with file change analysis |
| **8** | Populate Continuity Payload | Shape routed packet updates and continuity metadata |
| **9** | Write Canonical Surfaces | Apply atomic packet updates with rollback on failure |
| **9.5** | State Embedding | Embed `_memory.continuity` into the routed packet docs |
| **10** | Success Confirmation | Log summary of saved content |
| **11** | Semantic Indexing | Re-index the updated packet docs in the vector database |
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
| `implementation-summary.md` | Carries the `_memory.continuity` frontmatter sub-block and routed continuity narrative |
| Target packet docs | Canonical spec/plan/tasks/checklist/decision/summary surfaces updated in-place as routed |

### Quality Scoring

The workflow calculates a quality score (0-100) based on:
- Content length and depth
- Number of anchors
- Recency factors
- Message statistics

Low quality sessions (<20 score) receive a warning header in the output.

### Post-Save Quality Review

After the workflow completes, a **POST-SAVE QUALITY REVIEW** is emitted. This review checks the saved canonical continuity surfaces and reports issues at three severity levels:

| Severity | Action |
|----------|--------|
| **HIGH** | MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier) |
| **MEDIUM** | Patch when practical |
| **PASSED** | No action needed |

**Save quality gate exceptions:** Short decision-type memories may bypass the content-length gate when `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true` and at least two structural signals (title, specFolder, or anchor) are present. This prevents legitimate short decisions from being rejected by the 0.4 signal density threshold.

---

## 9. RELATED RESOURCES

- [Validation Rules](../validation/validation_rules.md)
- [Folder Routing](../structure/folder_routing.md)
- [Quick Reference](../workflows/quick_reference.md)
- [Template Guide](../templates/template_guide.md)

---
