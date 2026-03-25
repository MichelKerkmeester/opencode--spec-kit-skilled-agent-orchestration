---
title: Folder Routing & Alignment
description: Structured-first spec folder routing with alignment scoring for context preservation.
---

# Folder Routing & Alignment

Structured-first spec folder routing with alignment scoring for context preservation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The memory system uses a **structured-first architecture**. Routine saves pass structured JSON plus an explicit target spec folder, and all saves go through alignment scoring.

### Core Principle

Spec folder is passed explicitly as a CLI argument with alignment validation to ensure accurate routing.

### Architecture

| Aspect                  | Structured-First (Current)              |
| ----------------------- | --------------------------------------- |
| **Spec folder source**  | Explicit CLI target or payload override |
| **State persistence**   | JSON payload authored by the caller     |
| **Routine save mode**   | Structured input only                   |
| **Cleanup required**    | Temp JSON cleanup when used             |

### Key Benefits

- **Simplicity**: No marker file management
- **Reliability**: No stale state issues
- **Portability**: Works across environments
- **Transparency**: Explicit folder selection
- **Accuracy**: Alignment scoring prevents misrouting

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:detection-logic -->
## 2. DETECTION LOGIC

### Complete Routing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPEC FOLDER ROUTING                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ STEP 1: CLI Argument Check    │
              │ Was spec folder passed?       │
              └───────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               [PROVIDED]          [NOT PROVIDED]
                    │                   │
                    ▼                   ▼
           ┌──────────────┐   ┌───────────────────────────┐
           │ Validate     │   │ STEP 2: User Prompt       │
           │ Path Exists  │   │ Ask for spec folder       │
           └──────────────┘   └───────────────────────────┘
                    │                   │
              [VALID]             [USER PROVIDES]
                    │                   │
                    └─────────┬─────────┘
                              ▼
               ┌───────────────────────────────┐
               │ STEP 3: Calculate             │
               │ Alignment Score               │
               └───────────────────────────────┘
                               │
                      ┌────────┴────────┐
                      │   Score ≥70%?   │
                      └────────┬────────┘
                         yes/  \no
                           /    \
                          ▼      ▼
             ┌──────────────┐  ┌────────────────┐
             │ PROCEED      │  │ Score ≥50%?    │
             │ (good align) │  └───────┬────────┘
             └──────────────┘     yes/  \no
                                   /    \
                                  ▼      ▼
                     ┌──────────────┐  ┌───────────────────┐
                     │ WARN USER    │  │ INTERACTIVE       │
                     │ (proceed)    │  │ PROMPT + OPTIONS  │
                     └──────────────┘  └───────────────────┘
```

### Detection Steps Summary

| Step | Action              | Mechanism                                     |
| ---- | ------------------- | --------------------------------------------- |
| 1    | Check CLI argument  | `node .opencode/.../scripts/dist/memory/generate-context.js data.json [spec-folder]` |
| 2    | Prompt if missing   | AI agent asks user for folder                 |
| 3    | Validate path       | Confirm `specs/###-name/` exists              |
| 4    | Calculate alignment | Score against conversation context            |
| 5    | Proceed or warn     | Low score triggers warning only               |

---

<!-- /ANCHOR:detection-logic -->
<!-- ANCHOR:alignment-scoring -->
## 3. ALIGNMENT SCORING

When saving context, the system calculates an **alignment score** (0-100%) to determine which spec folder best matches the conversation topic.

### How It Works

The alignment score uses **topic matching** to compare conversation keywords against the spec folder name:

1. **Extract conversation topics**: Keywords from user requests and observation titles
2. **Parse spec folder topic**: Split the folder name (minus number prefix) into words
3. **Calculate overlap**: Count how many spec folder words appear in conversation topics
4. **Score**: `(matches / spec_folder_words) * 100`

### Calculation Logic

```typescript
function calculateAlignmentScore(conversationTopics: string[], specFolderName: string): number {
  // Parse folder name: "007-auth-system" → ["auth", "system"]
  const specTopics = specFolderName.replace(/^\d+-/, '').split(/[-_]/);

  // Count matches using substring matching
  let matches = 0;
  for (const specTopic of specTopics) {
    if (conversationTopics.some(ct =>
      ct.includes(specTopic) || specTopic.includes(ct)
    )) {
      matches++;
    }
  }

  return Math.round((matches / specTopics.length) * 100);
}
```

### Topic Sources

Topics are extracted from:
- **User request**: First conversation request in `recent_context`
- **Observation titles**: Titles from recent observations (top 3-10)
- **File names**: Parsed from file paths in observations

Stopwords are filtered: `the`, `this`, `that`, `with`, `for`, `and`, `from`, `fix`, `update`, `add`, `remove`

---

<!-- /ANCHOR:alignment-scoring -->
<!-- ANCHOR:threshold-behavior -->
## 4. THRESHOLD BEHAVIOR

| Score      | Tier     | Action                                           |
| ---------- | -------- | ------------------------------------------------ |
| **≥70%**   | Good     | Proceed automatically (no user action)           |
| **50-69%** | Moderate | Proceed with caution warning                     |
| **<50%**   | Low      | Interactive prompt + top 3 alternatives          |

### Threshold Configuration

These thresholds are defined in `generate-context.ts`:

```typescript
interface AlignmentConfig {
  THRESHOLD: number;
  WARNING_THRESHOLD: number;
}

const ALIGNMENT_CONFIG: AlignmentConfig = {
  THRESHOLD: 70,           // Good alignment - proceed automatically
  WARNING_THRESHOLD: 50,   // Below this = interactive prompt with alternatives
};
```

---

<!-- /ANCHOR:threshold-behavior -->
<!-- ANCHOR:keyword-extraction -->
## 5. KEYWORD EXTRACTION

Keywords are extracted from:

1. **Conversation request** - Initial user ask
2. **Observation titles** - Event summaries
3. **File names** - Modified files
4. **Technical terms** - Domain-specific language

### Extraction Process

```
Input: "Fix the tab menu border not showing on hover state"

Step 1: Tokenize
  ["Fix", "the", "tab", "menu", "border", "not", "showing", "on", "hover", "state"]

Step 2: Remove stop words
  ["Fix", "tab", "menu", "border", "showing", "hover", "state"]

Step 3: Normalize
  ["fix", "tab", "menu", "border", "showing", "hover", "state"]

Step 4: Extract meaningful terms
  ["tab", "menu", "border", "hover", "state"]

Output: Primary keywords for matching
```

### Stop Words (excluded)

```
the, a, an, is, are, was, were, be, been, being,
have, has, had, do, does, did, will, would, could,
should, may, might, must, shall, can, need, dare,
ought, used, to, of, in, for, on, with, at, by,
from, as, into, through, during, before, after,
above, below, between, under, again, further, then,
once, here, there, when, where, why, how, all, each,
few, more, most, other, some, such, no, nor, not,
only, own, same, so, than, too, very, just, also
```

---

<!-- /ANCHOR:keyword-extraction -->
<!-- ANCHOR:usage -->
## 6. USAGE

### Command Format

```bash
# Explicit spec folder with JSON input (recommended)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "006-opencode/014-stateless-alignment"

# With sub-folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-skill-standardization/002-api-refactor"
```

### AI Agent Workflow

1. User says "save context" or `/memory:save`
2. AI agent determines spec folder from conversation context
3. AI agent calls script with explicit path:
   ```bash
   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context.json "014-stateless-alignment"
   ```
4. Memory file written to `specs/014-stateless-alignment/memory/`

### Fallback Detection

When no spec folder is provided, the AI agent:

1. **Checks recent memory files** - `ls -t specs/*/memory/*.{md,txt} | head -1`
2. **Asks user** - "Which spec folder should I save to?"
3. **Suggests phase-aware path** - When the target is a phased packet tree, prefer the explicit root packet or an explicit child phase path. For phased packets like `022-hybrid-rag-fusion`, navigate to the specific child phase (e.g., `022-hybrid-rag-fusion/011-skill-alignment/`) rather than the root.

---

<!-- /ANCHOR:usage -->
<!-- ANCHOR:sub-folder-routing -->
## 7. SUB-FOLDER ROUTING

### Sub-Folder Structure Example

```
specs/122-skill-standardization/
├── 001-api-integration/
│   └── memory/
│       └── 23-11-25_10-03__api-integration.md
├── 002-system-spec-kit/
│   └── memory/
│       └── 23-11-25_10-06__spec-kit.md
└── 003-spec-folder-versioning/  ← Pass this path via CLI
    └── memory/
        └── 23-11-25_15-30__versioning.md  ← Writes here
```

### Path Formats

| Format              | Example                                                      |
| ------------------- | ------------------------------------------------------------ |
| **Parent only**     | `122-skill-standardization`                                  |
| **With sub-folder** | `122-skill-standardization/003-spec-folder-versioning`       |
| **Full path**       | `specs/122-skill-standardization/003-spec-folder-versioning` |

### Routing Logic

| Step | Action             | Details                           |
| ---- | ------------------ | --------------------------------- |
| 1    | Parse CLI argument | Extract spec folder path          |
| 2    | Normalize path     | Remove `specs/` prefix if present |
| 3    | Validate exists    | `test -d specs/${path}`           |
| 4    | Determine target   | Full path including sub-folder    |
| 5    | Create memory dir  | `mkdir -p specs/${path}/memory/`  |
| 6    | Write context      | Save to memory folder             |

---

<!-- /ANCHOR:sub-folder-routing -->
<!-- ANCHOR:interactive-prompt -->
## 8. INTERACTIVE PROMPT

When alignment **< 50%**, user sees an interactive prompt:

```
⚠️  LOW ALIGNMENT WARNING
    Selected folder: 020-page-loader
    Alignment score: 25%

📋 Top 3 alternative folders:
    1. 018-auth-improvements (85%)
    2. 017-authentication-refactor (82%)
    3. 019-login-flow (78%)

Choose: [1-3] select alternative | [c] continue anyway | [n] cancel
```

**Note:** When alignment is **50-69%** (moderate), the script shows a warning but proceeds automatically without prompting.

### Archive Filtering

Folders matching these patterns are automatically excluded:

- `z_*` (archive prefix)
- `*archive*` (contains "archive")
- `old*` (excluded naming pattern)

---

<!-- /ANCHOR:interactive-prompt -->
<!-- ANCHOR:bypass-options -->
## 9. BYPASS OPTIONS

### Environment Variable

```bash
# Skip alignment prompts, use most recent folder
AUTO_SAVE_MODE=true node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json
```

### Explicit Folder Argument

```bash
# Bypass scoring, use specified folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-specific-folder"
```

### Session Preferences

Users can set preferences that persist within a session:

| Phrase         | Effect                                   |
| -------------- | ---------------------------------------- |
| `"auto-select"`| Skip prompts, use highest-scoring folder |
| `"always ask"` | Prompt even for high-confidence matches  |
| `"new folder"` | Always create new spec folder            |

---

<!-- /ANCHOR:bypass-options -->
<!-- ANCHOR:usage-examples -->
## 10. USAGE EXAMPLES

Three practical examples demonstrating each alignment tier and the expected behavior.

### Example 1: Good Alignment (>=70%) - Auto-Proceed

**Scenario:** Conversation about fixing memory alignment validation

```
Conversation Topic: "Fix memory alignment validation"
Target Folder:      specs/016-memory-alignment-fix/
```

**Keyword Analysis:**

```
Conversation keywords: ["memory", "alignment", "validation", "fix"]
Folder keywords:       ["memory", "alignment", "fix"]
Overlap:               3/3 folder words match
Score:                 (3/3) × 100 = 100%
```

**Console Output:**

```
📊 Alignment check: 016-memory-alignment-fix (100% match)
✓ Good alignment with selected folder
```

**Result:** Auto-proceed without user intervention.

---

### Example 2: Moderate Alignment (50-69%) - Warning + Proceed

**Scenario:** Conversation about semantic memory search saved to memory alignment folder

```
Conversation Topic: "Improve semantic memory search"
Target Folder:      specs/016-memory-alignment-fix/
```

**Keyword Analysis:**

```
Conversation keywords: ["semantic", "memory", "search", "improve"]
Folder keywords:       ["memory", "alignment", "fix"]
Overlap:               1/3 ("memory" matches)
Score:                 (1/3) × 100 = 33%
```

**Console Output:**

```
📊 Alignment check: 016-memory-alignment-fix (33% match)
⚠️  Moderate alignment - proceeding with caution
```

**Result:** Warning displayed but proceeds automatically.

---

### Example 3: Low Alignment (<50%) - Interactive Prompt

**Scenario:** Conversation about CSS styling saved to unrelated folder

```
Conversation Topic: "Add CSS hover animation to buttons"
Target Folder:      specs/016-memory-alignment-fix/
```

**Keyword Analysis:**

```
Conversation keywords: ["css", "hover", "animation", "buttons"]
Folder keywords:       ["memory", "alignment", "fix"]
Overlap:               0/3 (no matches)
Score:                 (0/3) × 100 = 0%
```

**Console Output:**

```
📊 Alignment check: 016-memory-alignment-fix (0% match)

⚠️  LOW ALIGNMENT WARNING (0% match)
The selected folder "016-memory-alignment-fix" may not match conversation content.

Better matching alternatives:
  1. 003-btn-download-alignment (67% match)
  2. 006-css-components (50% match)
  3. Continue with "016-memory-alignment-fix" anyway
  4. Abort and specify different folder

Select option (1-4):
```

**Result:** Interactive prompt requires user decision.

---

<!-- /ANCHOR:usage-examples -->
<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

### No Spec Folder Provided

**Behavior:** AI agent prompts user for selection.

**Resolution:** User provides folder name or selects from list.

### Spec Folder Doesn't Exist

**Behavior:** Script fails with clear error message.

**Error Output:**
```
ERROR: Spec folder not found: specs/999-nonexistent/
Available folders:
  - 006-opencode
  - 007-project-name
  - 122-skill-standardization
```

**Resolution:** Create spec folder or correct the path.

### Alignment Score Below Threshold

**Behavior (three tiers):**
- **≥70%**: Proceed automatically with "Good alignment" message
- **50-69%**: Log "Moderate alignment - proceeding with caution" warning, proceed anyway
- **<50%**: Display interactive prompt with top 3 alternative folders

**Reasoning:** 
- High scores (≥70%) indicate confident match - no user intervention needed
- Moderate scores (50-69%) suggest possible mismatch - warn but trust user's explicit choice
- Low scores (<50%) require user confirmation - prevents accidental misrouting

### Sub-Folder Specified But Missing

**Behavior:** Create the sub-folder automatically.

**Example:**
```bash
# Folder 003-new-work doesn't exist yet
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-feature/003-new-work"
# Creates: specs/122-feature/003-new-work/memory/
```

---

<!-- /ANCHOR:edge-cases -->
<!-- ANCHOR:validation-checkpoints -->
## 12. VALIDATION CHECKPOINTS

### Pre-Save Validation

| Check                     | Action on Failure                    |
| ------------------------- | ------------------------------------ |
| CLI argument provided     | Prompt user for folder               |
| Spec folder exists        | Error with available folders         |
| Memory directory writable | Error with permission details        |
| Alignment score ≥70%      | Proceed (good alignment)             |
| Alignment score 50-69%    | Log warning, proceed anyway          |
| Alignment score <50%      | Interactive prompt with alternatives |

### Post-Save Validation

| Check                     | Action on Failure      |
| ------------------------- | ---------------------- |
| File written successfully | Retry once, then error |
| File not empty            | Error with debug info  |
| ANCHOR format valid       | Warning in log         |

### Health Check Commands

```bash
# List all spec folders
ls -d specs/[0-9][0-9][0-9]-*/

# Find most recently modified memory file
ls -t specs/*/memory/*.{md,txt} 2>/dev/null | head -1

# Count memories per spec folder
for d in specs/*/memory/; do
  echo "$(ls "$d" 2>/dev/null | wc -l) $d"
done | sort -rn

# Verify memory directory exists
test -d specs/###-name/memory/ && echo "OK" || echo "MISSING"
```

---

<!-- /ANCHOR:validation-checkpoints -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

### Reference Files
- [execution_methods.md](../workflows/execution_methods.md) - Save context workflows
- [memory_system.md](../memory/memory_system.md) - MCP tool reference

### Related Skills
- `system-spec-kit` - Spec folder creation and template management
- `system-spec-kit` - Main skill documentation

---

*Last Updated: 2026-03-22 | Architecture: Structured-First with Alignment Scoring*
<!-- /ANCHOR:related-resources -->
