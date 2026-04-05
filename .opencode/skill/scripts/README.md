---
title: "Skill Routing Scripts"
description: "Python automation for Gate 2 skill routing in the OpenCode framework, including the advisor engine, regression harness, and benchmark tooling."
trigger_phrases:
  - "skill routing scripts"
  - "skill advisor"
  - "gate 2 routing"
  - "skill advisor configuration"
  - "routing engine"
  - "confidence threshold"
  - "skill discovery"
  - "regression harness"
  - "benchmark harness"
---

# Skill Routing Scripts

> The Gate 2 routing engine and supporting tooling that matches user requests to skills with confidence scores.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`.opencode/skill/scripts/` contains the shared routing scripts used by the OpenCode framework. The primary script is `skill_advisor.py`, the routing engine that powers Gate 2 in AGENTS.md. It analyzes a user's request using token normalization, synonym expansion, intent boosting, and confidence calibration, then returns a ranked list of skill recommendations in JSON.

Three supporting scripts extend the core engine. `skill_advisor_runtime.py` provides cached skill discovery and fast frontmatter parsing so the advisor avoids re-reading SKILL.md files on every call. `skill_advisor_regression.py` runs a versioned fixture set to catch routing quality regressions before they ship. `skill_advisor_bench.py` measures latency and throughput in one-shot, warm, and batch modes.

The directory also holds `fixtures/` for versioned test cases and `out/` for report output. `SET-UP_GUIDE.md` covers project-specific customization.

### Key Statistics

| Component | Count | Notes |
| --- | --- | --- |
| Stop words | 106 | Filtered from queries before matching |
| Synonym mappings | 90 | Expand user language to technical terms |
| Intent boosters | 170 | Direct keyword-to-skill score mappings |
| Multi-skill boosters | 32 | Ambiguous keywords that boost multiple skills |
| Phrase intent boosters | 131 | Multi-token phrases with high-signal routing boosts |
| Command bridges | 2 | Slash commands exposed as pseudo-skills |
| Regression fixtures | 1 file | `skill_advisor_regression_cases.jsonl` |

### Scripts Inventory

| Script | Language | Purpose |
| --- | --- | --- |
| `skill_advisor.py` | Python 3.6+ | Main routing engine: intent normalization, dual-threshold filtering, command-bridge separation, batch mode |
| `skill_advisor_runtime.py` | Python 3.6+ | Cached skill discovery, mtime invalidation, fast frontmatter parsing |
| `skill_advisor_regression.py` | Python 3.6+ | Permanent regression harness for routing quality and safety gates |
| `skill_advisor_bench.py` | Python 3.6+ | Latency and throughput benchmarking for one-shot, warm, and batch modes |

### Requirements

| Requirement | Minimum | Recommended |
| --- | --- | --- |
| Python | 3.6+ | 3.10+ |
| Skill files | At least one `SKILL.md` in `.opencode/skill/` | All project skills present |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**1. Verify setup**

```bash
python3 --version
# Expected: Python 3.6+

python3 .opencode/skill/scripts/skill_advisor.py "test"
# Expected: JSON array (may be empty for generic queries)
```

**2. Run a real request**

```bash
python3 .opencode/skill/scripts/skill_advisor.py "help me commit my changes"
# Expected: sk-git at ~0.92 confidence
```

**3. Integrate in an agent workflow**

```bash
RESULT=$(python3 .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST" --threshold 0.8)
SKILL=$(echo "$RESULT" | python3 -c "import sys,json; r=json.load(sys.stdin); print(r[0]['skill'] if r else '')")
CONFIDENCE=$(echo "$RESULT" | python3 -c "import sys,json; r=json.load(sys.stdin); print(r[0]['confidence'] if r else 0)")

if python3 -c "exit(0 if float('$CONFIDENCE') >= 0.8 else 1)"; then
    echo "Invoking skill: $SKILL"
fi
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

**Routing pipeline.** The advisor runs every request through a seven-step pipeline: tokenize input, filter stop words, expand synonyms, apply intent boosters, score against skill descriptions, calibrate confidence, and return sorted recommendations. The pipeline is deterministic and fast enough for use in every Gate 2 check.

**Dual-threshold filtering.** By default, a result must pass two gates: confidence at or above the threshold (default 0.8) and uncertainty at or below the ceiling (default 0.35). This prevents confident-but-ambiguous matches from triggering skill invocation when the request is unclear. Passing `--confidence-only` opts out of the uncertainty check.

**Cached discovery.** `skill_advisor_runtime.py` caches skill metadata in memory and invalidates the cache only when a SKILL.md file's mtime changes. The advisor reads only the frontmatter block rather than the full file, keeping first-run latency low and subsequent calls near-instant.

**Command bridge separation.** Slash commands (for example `/spec_kit:plan` and `/memory:save`) are exposed as command bridges tagged `kind: command`. Natural language prompts deprioritize command bridges so they do not crowd out real skill results. Explicit slash syntax allows command bridges to rank first.

**Regression and benchmark tooling.** The regression harness runs against a versioned JSONL fixture set and writes a report to `out/regression-report.json`. The benchmark harness measures p50/p95 latency across one-shot, warm, and batch run modes.

**CocoIndex aliases and discovery routing.** `--semantic` and `--cocoindex` are equivalent aliases for built-in CocoIndex search. `--semantic-hits` and `--cocoindex-hits` are equivalent aliases for pre-computed JSON hits. Discovery prompts such as "find code that", "semantic code search", "code search", "where is the logic", and "how does X work" are optimized to favor `mcp-coco-index`.

**Autonomous review boundary.** Explicit autonomous workflows such as `autoresearch`, `/autoresearch`, `deep review`, `review loop`, `:review:auto`, and `auto review release readiness` route to `sk-deep-research`. Ordinary review requests such as `code review`, `review this PR`, and `auto review this PR` stay on `sk-code-review`.

### 3.2 FEATURE REFERENCE

**Matching Algorithm Steps**

| Step | Action | Example |
| --- | --- | --- |
| 1. Tokenize | Split input into word tokens | "help me commit my changes" -> ["help", "me", "commit", "my", "changes"] |
| 2. Filter stop words | Remove noise words | Remove "help", "me", "my" |
| 3. Expand synonyms | Map user terms to technical vocabulary | "commit" -> ["git", "version", "push", "branch", "changes"] |
| 4. Apply intent boosters | Add direct skill score boosts for high-signal keywords | "commit" -> sk-git +1.2 |
| 5. Score skills | Name match +1.5, description match +1.0, substring match +0.5 | sk-git scores 3.2 |
| 6. Calibrate confidence | Two-tier formula with margin and ambiguity adjustment | score 3.2 -> confidence 0.92 |
| 7. Return sorted results | JSON array ordered by confidence descending | [{"skill": "sk-git", "confidence": 0.92, ...}] |

**Confidence Formula**

| Condition | Formula | Example |
| --- | --- | --- |
| Intent booster matched | `min(0.50 + score * 0.15, 0.95)` | score 2 -> 0.80 |
| No intent booster (corpus only) | `min(0.25 + score * 0.15, 0.95)` | score 2 -> 0.55 |
| Cap | 0.95 | Preserves judgment margin |

**CLI Flags**

| Flag | Default | Description |
| --- | --- | --- |
| `--threshold` | `0.8` | Minimum confidence to include in results |
| `--uncertainty` | `0.35` | Maximum uncertainty to pass dual-threshold filter |
| `--confidence-only` | Off | Bypasses uncertainty gate (explicit opt-in) |
| `--show-rejections` | Off | Includes candidates that failed the threshold |
| `--health` | Off | Runs diagnostics on skill discovery |
| `--batch-file` | None | Path to a file with one request per line |
| `--batch-stdin` | Off | Reads batch requests from stdin |
| `--semantic`, `--cocoindex` | Off | Equivalent aliases that force built-in CocoIndex search |
| `--semantic-hits`, `--cocoindex-hits` | None | Equivalent aliases for pre-computed CocoIndex JSON hits |

**Synonym Expansion Examples**

| User says | Expands to |
| --- | --- |
| "fix" | debug, correct, resolve, code, implementation |
| "create" | implement, build, generate, new, add, scaffold |
| "doc" or "docs" | documentation, explain, describe, markdown |
| "commit" | git, version, push, branch, changes |
| "search" | find, locate, explore, query, lookup |

**Intent Booster Examples**

| Keyword | Skill | Boost |
| --- | --- | --- |
| `worktree` | sk-git | +1.2 |
| `devtools` | mcp-chrome-devtools | +1.0 |
| `rebase` | sk-git | +0.8 |
| `flowchart` | sk-doc | +0.7 |
| `checkpoint` | system-spec-kit | +0.6 |

**Command Bridges**

| Bridge Name | Description |
| --- | --- |
| `command-spec-kit` | Create specifications using `/spec_kit` slash command |
| `command-memory-save` | Save conversation context using `/memory:save` |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
.opencode/skill/scripts/
├── skill_advisor.py                         # Skill routing engine (Gate 2)
├── skill_advisor_runtime.py                 # Cache and metadata runtime helpers
├── skill_advisor_regression.py              # Quality regression harness
├── skill_advisor_bench.py                   # Latency and throughput benchmarks
├── fixtures/
│   └── skill_advisor_regression_cases.jsonl # Versioned routing fixture set
├── out/
│   ├── regression-report.json               # Latest regression run output
│   └── benchmark-report.json                # Latest benchmark run output
├── SET-UP_GUIDE.md                          # Customization guide for new projects
└── README.md                                # This file
```

### How It Fits in the Framework

```text
AGENTS.md (Gate 2)
    |
    v
python3 .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST"
    |
    v
skill_advisor_runtime.py (cached skill discovery)
    |
    v
.opencode/skill/*/SKILL.md (frontmatter parsed per skill)
    |
    v
JSON result: [{ "skill": "sk-git", "confidence": 0.92, "reason": "..." }]
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Path Resolution

The script resolves its own location at startup and does not require running from the project root:

```python
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.dirname(SCRIPT_DIR)
```

`SKILLS_DIR` points to `.opencode/skill/`. The advisor scans all subdirectories for SKILL.md files.

### SKILL.md Frontmatter Format

The advisor reads only the frontmatter block from each SKILL.md:

```yaml
---
name: sk-git
description: Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion
trigger_phrases:
  - "commit changes"
  - "create pull request"
  - "git workflow"
---
```

`name` and `description` are required. `trigger_phrases` improve matching accuracy for phrases the advisor's synonym system might not cover.

### Adding Synonyms

Add project-specific synonyms to the `SYNONYM_MAP` constant in `skill_advisor.py`:

```python
SYNONYM_MAP = {
    "deploy": ["release", "publish", "ship", "launch"],
    "api": ["endpoint", "route", "rest", "graphql"],
}
```

### Adding Intent Boosters

Add direct keyword-to-skill mappings for high-confidence routing:

```python
INTENT_BOOSTERS = {
    # "keyword": ("skill-name", boost_amount)
    "kubernetes": ("devops-k8s", 0.8),
    "docker": ("devops-containers", 0.7),
}
```

Boost values: 0.3-0.5 for moderate confidence, 0.6-1.0 for strong confidence.

### Regression Fixture Format

Each line in `fixtures/skill_advisor_regression_cases.jsonl` is a JSON object:

```json
{"prompt": "help me commit my changes", "expected_skill": "sk-git", "min_confidence": 0.8}
```

For full customization guidance, see [SET-UP_GUIDE.md](./SET-UP_GUIDE.md).

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Basic routing

```bash
# Git commit request -> sk-git at high confidence
python3 .opencode/skill/scripts/skill_advisor.py "help me commit my changes and push to remote"

# Expected:
# [
#   {
#     "skill": "sk-git",
#     "kind": "skill",
#     "confidence": 0.95,
#     "reason": "Matched: !commit, !push, git(name), changes"
#   }
# ]
```

### Documentation request

```bash
python3 .opencode/skill/scripts/skill_advisor.py "create a flowchart for the authentication process"

# Expected:
# [
#   {
#     "skill": "sk-doc",
#     "confidence": 0.88,
#     "reason": "Matched: !flowchart, documentation(name), create"
#   }
# ]
```

### Memory and context

```bash
python3 .opencode/skill/scripts/skill_advisor.py "save this conversation context for later"

# Expected:
# [
#   {
#     "skill": "system-spec-kit",
#     "confidence": 0.87,
#     "reason": "Matched: !intent:memory, !memory, !save(multi), context"
#   }
# ]
```

### No strong match

```bash
python3 .opencode/skill/scripts/skill_advisor.py "hello"
# Expected: []
```

### Confidence-only override (bypass uncertainty gate)

```bash
# Default mode: uncertainty gate active, result filtered
python3 .opencode/skill/scripts/skill_advisor.py "api chain mcp" --threshold 0.8
# []

# Confidence-only: uncertainty gate bypassed, result shown
python3 .opencode/skill/scripts/skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
# [{ "skill": "mcp-code-mode", "confidence": 0.85, "uncertainty": 0.39, ... }]
```

### Batch mode

```bash
cat prompts.txt
# create a pull request on github
# save this conversation context to memory
# /spec_kit:plan create docs

python3 .opencode/skill/scripts/skill_advisor.py --batch-file prompts.txt
# Returns a JSON array with per-prompt recommendation lists
```

### Run regression harness

```bash
python3 .opencode/skill/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/scripts/out/regression-report.json
```

### Run benchmark harness

```bash
python3 .opencode/skill/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/scripts/out/benchmark-report.json
```

### Common request patterns

| User Intent | Expected Skill | Key Terms |
| --- | --- | --- |
| Git operations | sk-git | commit, push, branch, merge, worktree, pr |
| Browser debugging | mcp-chrome-devtools | devtools, chrome, browser, debug, console |
| Documentation | sk-doc | markdown, flowchart, diagram, readme |
| Code implementation | sk-code-opencode | implement, fix, bug, refactor |
| Memory and context | system-spec-kit | remember, save, context, checkpoint |
| External MCP tools | mcp-code-mode | webflow, figma, clickup, notion |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Empty results for all queries

**Symptom.** Every request returns `[]`, even obvious matches like "commit changes".

**Cause.** The SKILLS_DIR path does not resolve to the skill directory, no SKILL.md files are present, or frontmatter is malformed.

**Fix.**

```bash
# Confirm SKILL.md files exist
ls .opencode/skill/*/SKILL.md

# Check frontmatter format on one file
head -10 .opencode/skill/sk-git/SKILL.md
# Should start with: ---\nname: sk-git\n...

# Run the health check
python3 .opencode/skill/scripts/skill_advisor.py "test" --health
```

### Correct skill returned but below threshold

**Symptom.** The right skill appears in `--show-rejections` output but not in the default result.

**Cause.** Confidence is below 0.8 or uncertainty is above 0.35. Missing synonyms or intent boosters for the request's vocabulary.

**Fix.**

```bash
# Inspect rejected candidates
python3 .opencode/skill/scripts/skill_advisor.py "my request" --show-rejections

# Verify the skill's description contains relevant terms
head -5 .opencode/skill/sk-git/SKILL.md

# Add a synonym or intent booster in skill_advisor.py for the missing term
```

### Wrong skill recommended

**Symptom.** An incorrect skill has the highest confidence score.

**Cause.** An intent booster or synonym match pulls an unrelated skill above the correct one. Skill descriptions may overlap too broadly.

**Fix.** Inspect the `reason` field in the output to identify which boost triggered. Reduce the boost value for the false-positive skill, or tighten its SKILL.md description to remove the overlapping term.

### Script not found

**Symptom.** `No such file or directory: skill_advisor.py` when running from a subdirectory.

**Fix.** Always run from the project root using the full relative path:

```bash
cd /path/to/project
python3 .opencode/skill/scripts/skill_advisor.py "my request"
```

### JSON output mixed with error text

**Symptom.** The output contains non-JSON lines, causing downstream parse failures.

**Cause.** A print statement or Python warning writing to stdout instead of stderr.

**Fix.** Redirect stderr when capturing output in automation:

```bash
RESULT=$(python3 .opencode/skill/scripts/skill_advisor.py "my request" 2>/dev/null)
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why does confidence cap at 0.95?**

The cap preserves a judgment margin so the calling AI does not treat the advisor's output as absolute. A score of 0.95 signals very high confidence while leaving room for the AI to apply context that the heuristic scorer cannot access.

**Q: What is the difference between synonyms and intent boosters?**

Synonyms expand the query vocabulary before scoring. They work bidirectionally: "fix" expands to include "debug" and "resolve", which then match against skill descriptions containing those words. Intent boosters work differently. They add a direct score boost to a specific skill when a keyword appears, regardless of description matching. Boosters are faster and more targeted but only fire in one direction.

**Q: How does the runtime cache work?**

`skill_advisor_runtime.py` stores parsed skill metadata in an in-memory dictionary keyed by skill name. The cache entry for each skill is invalidated when the file's mtime changes. On a warm run (same process), the advisor skips disk reads entirely for unchanged skills.

**Q: Can I use this routing engine in other projects?**

Yes. Copy `skill_advisor.py` and `skill_advisor_runtime.py` into any project that follows the `skill-name/SKILL.md` convention. Update SYNONYM_MAP, INTENT_BOOSTERS, and PHRASE_INTENT_BOOSTERS for your domain. See `SET-UP_GUIDE.md` for the full customization checklist.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [SET-UP_GUIDE.md](./SET-UP_GUIDE.md) | Step-by-step customization guide for adapting the advisor to a new project |
| [skill_advisor.py](./skill_advisor.py) | Source implementation for routing, scoring, and confidence calibration |
| [Skills Library README](../README.md) | Full catalog of all 19 skills and routing policy |
| [system-spec-kit SKILL.md](../system-spec-kit/SKILL.md) | Spec folder and memory foundation |
| [sk-doc SKILL.md](../sk-doc/SKILL.md) | Documentation standards and component templates |

<!-- /ANCHOR:related-documents -->
