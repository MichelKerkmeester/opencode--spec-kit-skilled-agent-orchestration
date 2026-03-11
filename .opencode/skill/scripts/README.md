---
title: "Scripts"
description: "Shell and Python automation scripts for the OpenCode framework, including the skill routing engine used by Gate 2 in AGENTS.md."
trigger_phrases:
  - "scripts"
  - "automation"
  - "skill advisor"
  - "skill routing"
  - "gate 2"
---

# Scripts

> Automation scripts for the OpenCode framework: skill routing, build tooling, developer utilities and project automation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. QUICK START](#3--quick-start)
- [4. SKILL ADVISOR](#4--skill-advisor)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is this directory?

`.opencode/skill/scripts/` contains automation scripts used by the OpenCode framework. The primary script is `skill_advisor.py`, the routing engine that powers Gate 2 in AGENTS.md. It analyzes user requests and recommends the most appropriate skill with a confidence score.

### Scripts Inventory

| Script | Language | Purpose |
|--------|----------|---------|
| `skill_advisor.py` | Python 3.6+ | Main advisor engine with intent normalization, dual-threshold filtering, command-bridge separation, and batch mode. |
| `skill_advisor_runtime.py` | Python 3.6+ | Runtime helpers for cached skill discovery, mtime invalidation, and fast frontmatter parsing. |
| `skill_advisor_regression.py` | Python 3.6+ | Permanent regression harness with routing quality and safety gates. |
| `skill_advisor_bench.py` | Python 3.6+ | Latency and throughput benchmark harness for one-shot, warm, and batch modes. |

### Supporting Files

| File | Purpose |
|------|---------|
| `SET-UP_GUIDE.md` | Customization guide for adapting `skill_advisor.py` to your project |
| `README.md` | This documentation |

### Key Statistics

| Component | Count | Description |
|-----------|-------|-------------|
| Stop Words | 106 | Filtered from queries for cleaner matching |
| Synonym Mappings | 89 | Expand user intent to technical terms |
| Intent Boosters | 150 | Direct keyword-to-skill mappings |
| Multi-Skill Boosters | 32 | Ambiguous keywords mapped to multiple skills |
| Phrase Intent Boosters | 83 | Multi-token phrases with high-signal routing boosts |
| Command Bridges | 2 | Slash commands exposed as pseudo-skills |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Python | 3.6+ | 3.10+ |
| `.opencode/skill/` | At least one `.opencode/skill/<skill-name>/SKILL.md` file | All project skills installed |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
.opencode/skill/scripts/
├── skill_advisor.py                            # Skill routing engine (Gate 2)
├── skill_advisor_runtime.py                    # Cache + metadata runtime helpers
├── skill_advisor_regression.py                 # Quality regression harness
├── skill_advisor_bench.py                      # Performance benchmark harness
├── fixtures/
│   └── skill_advisor_regression_cases.jsonl    # Versioned routing fixture set
├── SET-UP_GUIDE.md                             # Customization guide
└── README.md                                   # This file
```

### How It Fits in the Framework

```
.opencode/
└── skill/
    ├── scripts/
    │   └── skill_advisor.py     ← This directory
    ├── sk-git/
    │   └── .opencode/skill/sk-git/SKILL.md         # Parsed for name/description
    ├── sk-code--web/
    │   └── .opencode/skill/sk-code--web/SKILL.md
    ├── system-spec-kit/
    │   └── .opencode/skill/system-spec-kit/SKILL.md
    └── ...
```

<!-- /ANCHOR:structure -->

---

## 3. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. Verify Python is installed
python3 --version
# Expected: Python 3.6+

# 2. Test skill advisor from project root
python3 .opencode/skill/scripts/skill_advisor.py "test"
# Expected: JSON array (may be empty for generic queries)

# 3. Analyze a real request
python3 .opencode/skill/scripts/skill_advisor.py "help me commit my changes"
# Expected: JSON with sk-git at ~0.92 confidence
```

### Verify Installation

```bash
# Check that skill discovery works
python3 .opencode/skill/scripts/skill_advisor.py "help me commit my changes"

# Expected output:
# [
#   {
#     "skill": "sk-git",
#     "confidence": 0.92,
#     "reason": "Matched: !commit, git(name)"
#   }
# ]
```

### Integration with AI Agents

In your AI agent workflow (e.g., AGENTS.md Gate 2):

```bash
# Run skill advisor and capture output
RESULT=$(python .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST")

# Parse first recommendation
SKILL=$(echo $RESULT | python -c "import sys,json; r=json.load(sys.stdin); print(r[0]['skill'] if r else '')")
CONFIDENCE=$(echo $RESULT | python -c "import sys,json; r=json.load(sys.stdin); print(r[0]['confidence'] if r else 0)")
UNCERTAINTY=$(echo $RESULT | python -c "import sys,json; r=json.load(sys.stdin); print(r[0]['uncertainty'] if r else 1)")

# Route based on dual threshold
if (( $(echo "$CONFIDENCE >= 0.8" | bc -l) )) && (( $(echo "$UNCERTAINTY <= 0.35" | bc -l) )); then
    echo "Invoking skill: $SKILL"
fi
```

<!-- /ANCHOR:quick-start -->

---

## 4. SKILL ADVISOR
<!-- ANCHOR:skill-advisor -->

### How It Integrates with AGENTS.md

```
┌──────────────────────────────────────────────────────────────────┐
│                         GATE 2                                   │
│               Skill Routing (MANDATORY)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Request: "help me commit my changes"                       │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────┐                     │
│  │ python skill_advisor.py "$USER_REQUEST" │                     │
│  └────────────────────┬────────────────────┘                     │
│                       │                                          │
│                       ▼                                          │
│  ┌─────────────────────────────────────────┐                     │
│  │ [                                       │                     │
│  │   {                                     │                     │
│  │     "skill": "sk-git",           │                      │
│  │     "confidence": 0.92,                 │                      │
│  │     "reason": "Matched: !commit, git"   │                     │
│  │   }                                     │                     │
│  │ ]                                       │                     │
│  └────────────────────┬────────────────────┘                     │
│                       │                                          │
│                       ▼                                          │
│  IF confidence >= 0.8 AND uncertainty <= 0.35 → invoke skill      │
│  ELSE → Proceed with manual tool selection                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                      skill_advisor.py                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐    │
│  │ STOP_WORDS  │    │ SYNONYM_MAP │    │  INTENT_BOOSTERS    │    │
│  │ (~60 words) │    │ (~25 maps)  │    │  (~80 mappings)     │    │
│  └──────┬──────┘    └──────┬──────┘    └──────────┬──────────┘    │
│         │                  │                      │               │
│         └──────────────────┼──────────────────────┘               │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                   analyze_request()                          │ │
│  │                                                              │ │
│  │  1. Tokenize user input                                      │ │
│  │  2. Filter stop words                                        │ │
│  │  3. Expand with synonyms                                     │ │
│  │  4. Apply intent boosters                                    │ │
│  │  5. Score against skill descriptions                         │ │
│  │  6. Calculate confidence                                      │ │
│  │  7. Return sorted recommendations                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    get_skills()                              │ │
│  │                                                              │ │
│  │  • Uses runtime cache + mtime invalidation                   │ │
│  │  • Parses frontmatter-only metadata (fast path)              │ │
│  │  • Adds command bridges with kind separation                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Matching Algorithm Flow

```
User Input: "help me fix the authentication bug"
         │
         ▼
┌─────────────────────────────────────┐
│ 1. TOKENIZE                         │
│    ["help", "me", "fix", "the",      │
│     "authentication", "bug"]        │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 2. FILTER STOP WORDS                │
│    Remove: "help", "me", "the"      │
│    Keep: ["fix", "authentication",   │
│           "bug"]                    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 3. EXPAND SYNONYMS                  │
│    "fix" → ["debug", "correct",      │
│             "resolve", "code"]      │
│    "bug" → ["debug", "error",       │
│             "issue", "defect"]      │
│                                     │
│    Expanded: ["fix", "authentication │
│    "bug", "debug", "correct",       │
│    "resolve", "code", "error",      │
│    "issue", "defect", ...]          │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 4. APPLY INTENT BOOSTERS            │
│    "debug" → mcp-chrome-             │
│              devtools (+0.5)        │
│                                     │
│    Pre-calculated boost for         │
│    mcp-chrome-devtools: 0.5    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 5. SCORE AGAINST SKILLS             │
│                                     │
│    For each skill:                  │
│    • Name match: +1.5               │
│    • Description match: +1.0        │
│    • Substring match (4+ chars):    │
│      +0.5                           │
│    • Intent booster: +boost_amount  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 6. CALCULATE CONFIDENCE             │
│                                     │
│    Two-tiered formula:              │
│                                     │
│    IF intent boost matched:         │
│      confidence = min(0.50 + score   │
│                       * 0.15, 0.95) │
│    ELSE (corpus only):              │
│      confidence = min(0.25 + score   │
│                       * 0.15, 0.95) │
│                                     │
│    • With boost: score=2 → 0.80     │
│    • Without: score=2 → 0.55        │
│    • Cap: 0.95                      │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 7. RETURN SORTED RECOMMENDATIONS    │
│                                     │
│    [                                │
│      { "skill": "sk-code--web",    │
│        "confidence": 0.85,           │
│        "reason": "Matched: debug,   │
│                   code, fix" }       │
│    ]                                │
└─────────────────────────────────────┘
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Cached Skill Discovery** | Discovers skills once per process, invalidates by SKILL.md mtime changes |
| **Fast Frontmatter Parsing** | Reads only frontmatter block instead of full SKILL.md contents |
| **Precomputed Metadata** | Stores normalized name/corpus/variant sets for faster matching |
| **Synonym Expansion** | Maps user language to technical terms |
| **Intent Normalization** | Lightweight canonical intent boosts before detailed scoring |
| **Intent Boosting** | High-confidence keywords directly map to specific skills |
| **Multi-Skill Boosters** | Ambiguous keywords boost multiple skills simultaneously |
| **Confidence Calibration** | Applies margin-aware and ambiguity-aware confidence adjustment |
| **Dual-Threshold Default** | Confidence + uncertainty gating is default, even when `--threshold` is set |
| **Explicit Confidence Override** | `--confidence-only` opt-in bypasses uncertainty checks |
| **Command Bridge Separation** | Command bridges are tagged as `kind: command` and deprioritized unless slash intent is explicit |
| **Batch Structural Mode** | `--batch-file` and `--batch-stdin` reduce repeated subprocess overhead |
| **JSON Output** | Machine-readable output for automation |

### Cached Skill Discovery

The script loads skill metadata via runtime helpers with cache invalidation:

```python
skills = get_cached_skill_records(
    skills_dir=SKILLS_DIR,
    stop_words=STOP_WORDS,
    force_refresh=False,
)

# Runtime cache refreshes automatically when any SKILL.md mtime changes.
```

**SKILL.md Frontmatter Format:**
```yaml
---
name: sk-git
description: Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion
---
```

### Synonym Expansion

Maps user-friendly terms to technical vocabulary:

| User Says | Expands To |
|-----------|------------|
| "fix" | debug, correct, resolve, code, implementation |
| "create" | implement, build, generate, new, add, scaffold |
| "doc" / "docs" | documentation, explain, describe, markdown |
| "commit" | git, version, push, branch, changes |
| "search" | find, locate, explore, query, lookup |

### Intent Boosters

High-confidence keywords that directly map to specific skills:

| Keyword | Skill | Boost |
|---------|-------|-------|
| `worktree` | sk-git | +1.2 |
| `devtools` | mcp-chrome-devtools | +1.0 |
| `rebase` | sk-git | +0.8 |
| `flowchart` | sk-doc | +0.7 |
| `checkpoint` | system-spec-kit | +0.6 |

### Multi-Skill Boosters

For ambiguous keywords that could apply to multiple skills:

```python
MULTI_SKILL_BOOSTERS = {
    "code": [("sk-code--web", 0.2)],
    "changes": [("sk-git", 0.4), ("system-spec-kit", 0.2)],
    ...
}
```

These boost multiple skills simultaneously when the keyword is detected. The `(multi)` suffix appears in the reason output to indicate multi-skill boosting was applied.

### Confidence Scoring

The script uses a two-stage approach:

1. Base confidence formula (intent-boost aware)
2. Margin-aware + ambiguity-aware calibration

| Condition | Formula | Purpose |
|-----------|---------|---------|
| Intent booster matched | `min(0.50 + score * 0.15, 0.95)` | Higher confidence for explicit signals |
| No intent booster | `min(0.25 + score * 0.15, 0.95)` | Conservative for corpus-only matches |

After base confidence, calibration adjusts values when ranking margins are weak or ambiguity is high.

### Threshold Behavior

| Mode | Behavior |
|------|----------|
| Default | Dual threshold (`confidence >= --threshold` AND `uncertainty <= --uncertainty`) |
| `--confidence-only` | Confidence-only filtering (explicit opt-in) |

Default values:
- `--threshold 0.8`
- `--uncertainty 0.35`

This keeps uncertainty guarding active unless confidence-only mode is explicitly requested.

### Command Bridges

Slash commands are exposed as command-bridge recommendations (`kind: command`) and ranked separately from real skills (`kind: skill`).

Rules:
- Non-slash natural language prompts prefer real skills.
- Explicit slash markers (for example `/spec_kit:` or `/memory:save`) allow command bridges to rank first.

| Command Bridge | Description |
|----------------|-------------|
| `command-spec-kit` | Create specifications using `/spec_kit` slash command |
| `command-memory-save` | Save conversation context using `/memory:save` |

<!-- /ANCHOR:skill-advisor -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

### Customization Points

The script requires customization for each project. See [SET-UP_GUIDE.md](./SET-UP_GUIDE.md) for detailed instructions.

| Component | Location | Purpose |
|-----------|----------|---------|
| `SCRIPT_DIR`, `SKILLS_DIR` | Constant definitions | Resolve script and skills directory paths |
| `STOP_WORDS` | Constant definition | Words filtered from queries |
| `SYNONYM_MAP` | Constant definition | User intent to technical terms |
| `INTENT_BOOSTERS` | Constant definition | Keyword-to-skill direct mappings |
| `MULTI_SKILL_BOOSTERS` | Constant definition | Ambiguous keywords mapped to multiple skills |
| `PHRASE_INTENT_BOOSTERS` | Constant definition | Multi-token phrase routing boosts |
| `parse_frontmatter` | Function definition | YAML frontmatter parser |
| `get_skills` | Function definition | Skill discovery function |
| `analyze_request` | Function definition | Main analysis function |

### SKILLS_DIR Configuration

```python
# Resolve from this script's real filesystem location
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.dirname(SCRIPT_DIR)
```

**Note:** The script resolves paths from its own location, so it does not require running from project root.

### Adding Custom Synonyms

```python
SYNONYM_MAP = {
    # Add your domain-specific synonyms
    "deploy": ["release", "publish", "ship", "launch"],
    "api": ["endpoint", "route", "rest", "graphql"],
    # ...
}
```

### Adding Custom Intent Boosters

```python
INTENT_BOOSTERS = {
    # Format: "keyword": ("skill-name", boost_amount)
    "kubernetes": ("devops-k8s", 0.8),
    "docker": ("devops-containers", 0.7),
    # ...
}
```

### Adding Command Bridges

```python
# In get_skills() function
skills["command-deploy"] = {
    "description": "Deploy application using /deploy slash command.",
    "weight": 1.0
}
```

<!-- /ANCHOR:configuration -->

---

## 6. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Git Operations

```bash
$ python skill_advisor.py "help me commit my changes and push to remote"

[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "reason": "Matched: !commit, !push, git(name), changes"
  }
]
```

### Example 2: Documentation

```bash
$ python skill_advisor.py "create a flowchart for the authentication process"

[
  {
    "skill": "sk-doc",
    "confidence": 0.88,
    "reason": "Matched: !flowchart, documentation(name), create"
  }
]
```

### Example 3: Code Search

```bash
$ python skill_advisor.py "search for how authentication works in the codebase"

[
  {
    "skill": "sk-code--web",
    "confidence": 0.72,
    "reason": "Matched: !implement, code(multi)"
  }
]
```

### Example 4: Memory Operations

```bash
$ python skill_advisor.py "save this conversation context for later"

[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.87,
    "reason": "Matched: !intent:memory, !memory, !save(multi), context"
  }
]
```

### Example 5: No Strong Match

```bash
$ python skill_advisor.py "hello"

[]
```

### Example 6: External MCP Tools

```bash
$ python skill_advisor.py "use webflow to update site"
# → mcp-code-mode (0.95) - !webflow + !site + !update(multi) boost

$ python skill_advisor.py "call figma api"
# → mcp-code-mode (0.95) - !figma + api(multi) boost
```

### Example 7: Explicit confidence-only override

```bash
$ python skill_advisor.py "api chain mcp" --threshold 0.8
[]

$ python skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
[
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.39,
    "passes_threshold": false
  }
]
```

### Example 8: Batch mode (structural)

```bash
$ cat prompts.txt
create a pull request on github
save this conversation context to memory
/spec_kit:plan create docs

$ python3 .opencode/skill/scripts/skill_advisor.py --batch-file prompts.txt
# => JSON array with per-prompt recommendation lists
```

### Example 9: Regression and benchmark harnesses

```bash
python3 .opencode/skill/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/scripts/out/regression-report.json

python3 .opencode/skill/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/scripts/out/benchmark-report.json
```

### Common Patterns

| User Intent | Expected Skill | Key Terms |
|-------------|----------------|-----------|
| Git operations | sk-git | commit, push, branch, merge, worktree, github, pr, issue |
| Browser debugging | mcp-chrome-devtools | devtools, chrome, browser, debug, console |
| Documentation | sk-doc | markdown, flowchart, diagram, readme |
| Code implementation | sk-code--web | implement, fix, bug, refactor, verification |
| Memory/context | system-spec-kit | remember, save, context, checkpoint |
| Specifications | system-spec-kit (or command bridge for explicit slash) | spec, checklist, plan, specification, /spec_kit |
| External MCP tools | mcp-code-mode | webflow, figma, clickup, notion |

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### No Skills Found

**Symptom:** Empty array returned for all queries

**Causes:**
1. `SKILLS_DIR` path is incorrect
2. No SKILL.md files in skills directory
3. SKILL.md files missing frontmatter

**Solution:**
```bash
# Check SKILLS_DIR exists
ls -la .opencode/skill/

# Verify SKILL.md files exist
find .opencode/skill -name "SKILL.md"

# Check frontmatter format
head -10 .opencode/skill/sk-git/SKILL.md
# Should show:
# ---
# name: sk-git
# description: ...
# ---
```

### Low Confidence Scores

**Symptom:** Correct skill recommended but default mode returns no result

**Causes:**
1. Confidence below `--threshold` (default `0.8`)
2. Uncertainty above `--uncertainty` (default `0.35`)
3. Missing synonyms/intent boosters for user vocabulary

**Solution:**
1. Inspect rejected candidates with `--show-rejections`
2. Compare with explicit override using `--confidence-only`
3. Add synonyms/intent boosters and improve skill descriptions

### Wrong Skill Recommended

**Symptom:** Incorrect skill has highest confidence

**Causes:**
1. Overly broad synonyms causing false matches
2. Intent booster boost value too high
3. Multiple skills with overlapping descriptions

**Solution:**
1. Make synonyms more specific
2. Adjust boost values (0.3-0.5 for moderate, 0.6-1.0 for strong)
3. Differentiate skill descriptions

### Script Not Found

**Symptom:** `No such file or directory: skill_advisor.py`

**Solution:**
```bash
# Run from project root
cd /path/to/project
python .opencode/skill/scripts/skill_advisor.py "test"
```

### JSON Parse Errors

**Symptom:** Output is not valid JSON

**Causes:**
1. Python print statements in the script
2. Error messages mixed with output

**Solution:** Ensure only JSON is printed to stdout. Errors should go to stderr.

<!-- /ANCHOR:troubleshooting -->

---

## 8. FAQ
<!-- ANCHOR:faq -->

### General Questions

**Q: What happens if no skill matches?**

A: An empty array `[]` is returned. The AI agent should proceed with manual tool selection.

---

**Q: Can I have multiple skills recommended?**

A: Yes, the script returns ranked recommendations. In default mode, downstream routing should enforce both confidence and uncertainty gates.

---

**Q: How do I add a new skill?**

A: Create a new folder in `.opencode/skill/` with a SKILL.md file containing proper frontmatter. The script will automatically discover it.

---

### Technical Questions

**Q: Why is the confidence capped at 0.95?**

A: To maintain uncertainty and prevent over-confidence. Even the best matches should allow for human judgment.

---

**Q: What's the difference between synonyms and intent boosters?**

A:
- **Synonyms** expand the query vocabulary (bidirectional, used in matching)
- **Intent boosters** directly increase a skill's score when specific keywords appear (unidirectional, bypass matching)

---

**Q: How do I debug the matching logic?**

A: Add debug output to the script:
```python
# In analyze_request(), after line 230
print(f"DEBUG: tokens={tokens}, expanded={search_terms}", file=sys.stderr)
```

---

**Q: Can I use regex in queries?**

A: No, the script uses word tokenization. Regex patterns will be treated as literal text.

<!-- /ANCHOR:faq -->

---

## 9. RELATED DOCUMENTS
<!-- ANCHOR:related-documents -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [skill_advisor.py](./skill_advisor.py) | Source implementation for routing and scoring logic |
| [SET-UP_GUIDE.md](./SET-UP_GUIDE.md) | Step-by-step customization guide for `skill_advisor.py` |
| [Changelog](../../changelog/05--skill-advisor/) | Version history and changes |
| [AGENTS.md](../../../AGENTS.md) | Framework rules including Gate 2 skill routing |

### Skill System

| Resource | Purpose |
|----------|---------|
| `.opencode/skill/*/SKILL.md` | Individual skill definitions parsed by the advisor |
| [system-spec-kit README](../system-spec-kit/README.md) | Documentation and memory framework |
| [sk-doc SKILL.md](../sk-doc/SKILL.md) | Documentation standards and templates |

<!-- /ANCHOR:related-documents -->
