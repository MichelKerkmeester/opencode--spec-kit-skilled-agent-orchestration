---
name: sk-prompt-improver
description: "Prompt engineering specialist that transforms vague requests into structured, scored AI prompts using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH thinking methodology, and CLEAR scoring across text modes."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: prompt-engineering, prompt-improvement, DEPTH, RICCE, CLEAR-scoring, framework-selection, RCAF, COSTAR, CRAFT, TIDD-EC, CRISPE -->

# Prompt Engineering Specialist - Multi-Framework Enhancement with DEPTH Processing

Transforms vague or basic inputs into highly effective, structured AI prompts. Provides 7 text frameworks with automatic framework selection and CLEAR quality scoring.

**Core Principle**: Clarity, logic, expression, and reliability through structured methodology.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- Enhancing or improving an AI prompt for any purpose
- Evaluating prompt quality with CLEAR scoring
- Selecting the right prompt framework for a given task
- Transforming vague requests into structured, effective prompts

**Keyword Triggers**:
- `$improve`, `$text`, `$short`, `$refine`, `$json`, `$yaml`
- `$raw` (skip DEPTH, fast pass-through)
- "improve my prompt", "enhance this prompt", "prompt engineering"
- "create a prompt for", "optimize this prompt"

### Use Cases

#### Text Prompt Enhancement
Transform vague requests into structured prompts using RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, or CRAFT frameworks with CLEAR scoring (40+/50 threshold).

### When NOT to Use

**Skip this skill when:**
- Writing code or debugging (use sk-code skills instead)
- Creating documentation (use sk-doc instead)
- Simple text editing without prompt structure needs
- Direct API calls that do not need prompt optimization

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

<!-- CRITICAL: Keep one authoritative Smart Router Pseudocode block in this section.
     Detection context may appear before pseudocode. Do NOT duplicate routing logic in separate lookup tables. -->

### Primary Detection Signal

The primary routing signal is the **command prefix** (`$improve`, `$text`, `$refine`, `$short`, `$json`, `$yaml`, `$raw`). When present, the prefix determines the operating mode directly. When absent, the router falls back to **keyword-weighted intent scoring** against the request text, selecting the top-scoring intent (or top-2 when scores are close). A zero-score fallback defaults to `TEXT_ENHANCE` with a disambiguation checklist.

### Phase Detection

```text
USER REQUEST
    |
    +- STEP 0: Detect mode ($command prefix or keyword signals)
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Framework Selection (7 frameworks evaluated)
    +- Phase 2: DEPTH Processing (3-10 rounds based on mode)
    +- Phase 3: Scoring & Validation (CLEAR)
    +- Phase 4: Output Delivery (formatted prompt)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_MODEL`.

- `references/` for DEPTH methodology, framework definitions, and CLEAR scoring.
- `assets/` for format-specific deep-dives (Markdown, JSON, YAML).

```text
references/depth_framework.md     - DEPTH methodology, RICCE integration
references/patterns_evaluation.md - 7 frameworks, CLEAR scoring
assets/format_guide_markdown.md   - Markdown format deep-dive
assets/format_guide_json.md       - JSON format deep-dive
assets/format_guide_yaml.md       - YAML format deep-dive
```

### Resource Loading Levels

| Level       | When to Load             | Resources                                                                  |
| ----------- | ------------------------ | -------------------------------------------------------------------------- |
| ALWAYS      | Every skill invocation   | SKILL.md (this file)                                                       |
| CONDITIONAL | If intent signals match  | references/depth_framework.md, references/patterns_evaluation.md           |
| ON_DEMAND   | Only on explicit request | assets/format_guide_markdown.md, assets/format_guide_json.md, assets/format_guide_yaml.md |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/depth_framework.md"

INTENT_MODEL = {
    "TEXT_ENHANCE": {"keywords": [("improve", 4), ("enhance", 4), ("prompt", 3), ("text", 3), ("refine", 4)]},
    "FRAMEWORK": {"keywords": [("framework", 4), ("rcaf", 5), ("costar", 5), ("tidd-ec", 5), ("scoring", 3)]},
}

RESOURCE_MAP = {
    "TEXT_ENHANCE": ["references/depth_framework.md", "references/patterns_evaluation.md"],
    "FRAMEWORK": ["references/patterns_evaluation.md"],
}

ON_DEMAND_KEYWORDS = ["deep dive", "full template", "all frameworks", "format guide"]

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is this a prompt enhancement request or a different task?",
    "Does the user want a specific framework applied?",
    "Is the user asking about scoring or evaluation?",
    "Should this route to sk-doc or sk-code instead?",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _task_text(task) -> str:
    if isinstance(task, str):
        return task.lower()
    return " ".join(
        str(task.get(f, "")) for f in ("text", "query", "description", "keywords")
    ).lower()

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for keyword, weight in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight
    return scores

def select_intents(scores, ambiguity_delta=AMBIGUITY_DELTA, max_intents=2):
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("TEXT_ENHANCE", None)
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= ambiguity_delta:
        return (primary, secondary)
    return (primary, None)

def route_prompt_improver_resources(task):
    inventory = discover_markdown_resources()
    text = _task_text(task)
    scores = score_intents(task)
    primary, secondary = select_intents(scores)
    intents = [primary] + ([secondary] if secondary else [])
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    # Unknown fallback: when no keywords match at all
    if scores[primary] == 0:
        load_if_available(DEFAULT_RESOURCE)
        return {
            "intents": intents,
            "intent_scores": scores,
            "resources": loaded,
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        }

    # Standard routing: default + intent-mapped resources
    load_if_available(DEFAULT_RESOURCE)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    # ON_DEMAND: load all resource map paths when trigger keywords are present
    if any(kw in text for kw in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Enhancement Pipeline

Every prompt enhancement follows this pipeline:

```
STEP 1: Mode Detection
       ├─ Command prefix check ($text, $improve, $refine, $short, etc.)
       ├─ Keyword signal analysis (>=80% confidence = auto-route)
       └─ Ambiguous? Ask ONE comprehensive question
       ↓
STEP 2: Framework Selection
       ├─ Evaluate 7 frameworks against request characteristics
       ├─ Score: complexity, urgency, audience, creativity, precision
       └─ Select primary framework + alternative
       ↓
STEP 3: DEPTH Processing (5-10 rounds)
       ├─ Discover: 5 perspectives, assumption audit, RICCE Role & Context
       ├─ Engineer: Framework application, RICCE Constraints & Instructions
       ├─ Prototype: Template build, RICCE validation
       ├─ Test: Scoring (CLEAR), quality gates
       └─ Harmonize: Final polish, RICCE completeness
       ↓
STEP 4: Scoring & Delivery
       ├─ Apply context-appropriate scoring system
       ├─ Verify threshold met (CLEAR 40+/50)
       └─ Deliver enhanced prompt with transparency report
```

See the Smart Routing pseudocode (Section 2) for the complete routing logic.

### Operating Modes

| Mode | Command | DEPTH Rounds | Scoring | Use Case |
|------|---------|-------------|---------|----------|
| Interactive | (default) | 10 | CLEAR | Guided enhancement |
| Text | `$text` | 10 | CLEAR | Standard text prompt |
| Short | `$short` | 3 | CLEAR | Quick refinement |
| Improve | `$improve` | 10 | CLEAR | Standard enhancement |
| Refine | `$refine` | 10 | CLEAR | Maximum optimization |
| JSON | `$json` | 10 | CLEAR | API-ready format |
| YAML | `$yaml` | 10 | CLEAR | Config format |
| Raw | `$raw` | 0 | None | Skip DEPTH |

### Framework Selection Matrix

| Complexity | Primary Need | Framework | Success Rate |
|-----------|-------------|-----------|-------------|
| 1-3 | Speed | RACE | 88% |
| 1-4 | Clarity | RCAF | 92% |
| 3-6 | Audience | COSTAR | 94% |
| 4-6 | Instructions | CIDI | 90% |
| 5-7 | Creativity | CRISPE | 87% |
| 6-8 | Precision | TIDD-EC | 93% |
| 7-10 | Comprehensive | CRAFT | 91% |
See [patterns_evaluation.md](./references/patterns_evaluation.md) for complete framework details.
See [depth_framework.md](./references/depth_framework.md) for the DEPTH methodology.

### Scoring Systems

**CLEAR** (50-point scale): Correctness (10) + Logic (10) + Expression (15) + Arrangement (10) + Reusability (5). Threshold: 40+.

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

1. **ALWAYS ask ONE comprehensive question** before processing
   - Gather: What needs enhancement? Use case/goal? Requirements?
   - Exception: `$raw` mode skips questions entirely

2. **ALWAYS apply DEPTH processing** for the detected mode
   - 10 rounds for text modes, 3 for $short, 0 for $raw

3. **ALWAYS enforce minimum 3 perspectives** during DEPTH Discover phase
   - Target 5 perspectives; 3 is the blocking minimum
   - Perspectives: Prompt Engineering, AI Interpretation, User Clarity, Framework Selection, Token Efficiency

4. **ALWAYS validate with RICCE** before delivery
   - Role, Instructions, Context, Constraints, Examples must be present or justified

5. **ALWAYS apply scoring** and verify threshold met
   - CLEAR 40+/50

6. **ALWAYS provide a transparency report** after delivering the enhanced prompt
   - Framework selected, DEPTH rounds applied, score breakdown, assumptions flagged

### ❌ NEVER

1. **NEVER answer own questions**
   - Wait for user response before proceeding with enhancement

2. **NEVER skip framework evaluation**
   - Even for simple prompts, score at least 3 frameworks before selecting

3. **NEVER deliver without scoring**
   - Every enhanced prompt must have a CLEAR score (except $raw)

4. **NEVER use second-person voice in enhanced prompts**
   - Use imperative or third-person form in the output

5. **NEVER exceed context with full reference loading**
   - Load only the references needed for the detected mode

### ⚠️ ESCALATE IF

1. **ESCALATE IF mode detection confidence < 50%**
   - Ask: "What type of prompt are you creating? Can you describe the use case?"

2. **ESCALATE IF CLEAR score below threshold after DEPTH**
   - Suggest: "Score is below target. Options: A) Additional refinement round B) Switch framework C) Accept as-is"

3. **ESCALATE IF request conflicts with prompt engineering scope**
   - Redirect: "This appears to be a [code/doc/debug] task. Consider using [sk-code/sk-doc] instead."

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

- [depth_framework.md](./references/depth_framework.md) - DEPTH methodology (Discover, Engineer, Prototype, Test, Harmonize), RICCE integration
- [patterns_evaluation.md](./references/patterns_evaluation.md) - 7 framework definitions, CLEAR scoring

### Asset Files

- [format_guide_markdown.md](./assets/format_guide_markdown.md) - Markdown format deep-dive: fundamentals, delivery standards, RCAF/CRAFT structures, advanced patterns, validation, best practices
- [format_guide_json.md](./assets/format_guide_json.md) - JSON format deep-dive: fundamentals, data types, delivery standards, RCAF/CRAFT structures, advanced patterns, validation, best practices
- [format_guide_yaml.md](./assets/format_guide_yaml.md) - YAML format deep-dive: fundamentals, data types, delivery standards, RCAF/CRAFT structures, advanced patterns, templates, validation, best practices

### Reference Loading Notes

- Load only references needed for current intent
- Smart Routing (Section 2) is the single authority for loading rules
- SKILL.md (this file) is always loaded; conditionally load mode-specific references

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Enhancement Complete When

- ✅ Mode detected and framework selected with reasoning
- ✅ DEPTH rounds completed per mode specification
- ✅ Scoring applied and threshold verified
- ✅ RICCE validation passed
- ✅ Enhanced prompt delivered with transparency report
- ✅ User can iterate or accept

### Quality Targets

- **CLEAR Score**: 40+ out of 50
- **Framework Selection Accuracy**: Match task characteristics to framework with >85% alignment

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in AGENTS.md.

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` with prompt-related intent boosters
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Related Skills

| Skill | Integration |
|-------|-------------|
| **sk-doc** | Documentation outputs from prompt engineering may use sk-doc for formatting |
| **sk-doc-visual** | Visual HTML outputs from prompt documentation may route to sk-doc-visual |
| **sk-code--web** | Prompts for web development contexts may co-invoke with sk-code--web |

### Tool Usage Guidelines

- **Read**: Load reference files from references/ directory
- **Write**: Output enhanced prompts to user-specified location
- **Glob**: Discover available reference files in skill directory
- **Bash**: Run validation scripts if needed

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [depth_framework.md](./references/depth_framework.md) - DEPTH thinking methodology
- [patterns_evaluation.md](./references/patterns_evaluation.md) - Framework library and scoring

### Related Skills
- `sk-doc` - Documentation quality and component creation
- `sk-doc-visual` - Visual HTML outputs and interactive diagrams

---

<!-- /ANCHOR:related-resources -->
