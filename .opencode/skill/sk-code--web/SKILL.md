---
name: sk-code--web
description: "Orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)"
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.0.0
---

<!-- Keywords: sk-code--web, development-orchestrator, frontend-development, browser-verification, debugging-workflow, implementation-patterns, webflow-integration -->

# Code Workflows - Development Orchestrator

Unified workflow guidance across 6 specialized code quality skills for frontend development.

**Core Principle**: Implementation → Debugging (if needed) → Verification (MANDATORY) = reliable frontend code.


## 1. WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Starting frontend development work
- Implementing forms, APIs, DOM manipulation
- Integrating external libraries or media
- JavaScript files have been modified
- Encountering console errors or unexpected behavior
- Deep call stack issues or race conditions
- Multiple debugging attempts needed
- Need root cause identification
- Before ANY completion claim ("works", "fixed", "done", "complete", "passing")
- After implementing or debugging frontend code

**Keyword triggers:**
- Implementation: "implement", "build", "create", "add feature", "async", "validation", "CDN", "animation", "webflow", "performance", "interaction", "defer", "deferred loading", "PageSpeed", "Lighthouse", "TBT", "INP", "security"
- Debugging: "debug", "fix", "error", "not working", "broken", "issue", "bug", "console error"
- Verification: "done", "complete", "works", "fixed", "finished", "verify", "test"

### When NOT to Use

**Do NOT use this skill for:**
- Non-frontend tasks (backend, infrastructure, DevOps)
- Documentation-only changes
- Pure research without implementation
- Git/version control operations (use sk-git instead)
- Skill creation/editing (use sk-doc instead)

### Phase Overview

This orchestrator operates in four primary phases:

| Phase                       | Purpose                                                     | Trigger                                  |
| --------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| **Phase 0: Research**       | Systematic analysis before complex implementation           | Performance issues, unfamiliar codebases |
| **Phase 1: Implementation** | Writing code with async handling, validation, cache-busting | Starting new code, modifying existing    |
| **Phase 1.5: Code Quality** | Validate against style standards                            | P0 items pass                            |
| **Phase 2: Debugging**      | Fixing issues systematically using DevTools                 | Console errors, unexpected behavior      |
| **Phase 3: Verification**   | Browser testing before completion claims                    | Before ANY "done" or "works" claim       |

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT FRESH BROWSER VERIFICATION EVIDENCE

### Review Baseline Contract

`sk-code--web` owns frontend implementation patterns, web-specific quality gates, and browser verification steps.

For formal findings-first code review output, use `sk-code--review` as the baseline:
- Severity model and review output contract: `sk-code--review/references/quick_reference.md`
- Baseline security/quality/test review checks: `sk-code--review` references
- This skill: web-specific overlay rules and browser verification evidence

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/implementation/` for feature implementation patterns, async workflows, and integration guidance.
- `references/debugging/` for root-cause workflows, error recovery, and troubleshooting methodology.
- `references/verification/` for browser-based verification workflows and completion validation.
- `references/standards/` for style enforcement, quality expectations, and compliance guidance.
- `references/performance/` for optimization strategies and performance diagnostics.
- `references/deployment/` for minification and CDN deployment workflows.
- `references/research/` for structured pre-implementation analysis patterns.
- `assets/checklists/` for implementation, debugging, quality, and verification gates.
- `assets/integrations/` for external integration patterns (for example Lenis and HLS).
- `assets/patterns/` for reusable implementation snippets and validation/waiting patterns.

### Resource Loading Levels

| Level       | When to Load             | Resources                          |
| ----------- | ------------------------ | ---------------------------------- |
| ALWAYS      | Every phase invocation   | Core workflow + essential patterns |
| CONDITIONAL | If task keywords match   | Domain-specific references         |
| ON_DEMAND   | Only on explicit request | Deep-dive optimization guides      |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/implementation/implementation_workflows.md"

TASK_SIGNALS = {
    "VERIFICATION": {"verify": 2.4, "done": 2.1, "complete": 2.0, "works": 1.8},
    "DEBUGGING": {"bug": 2.3, "fix": 2.0, "error": 2.4, "broken": 1.8},
    "CODE_QUALITY": {"style check": 2.2, "quality check": 2.2, "check standards": 2.0},
    "IMPLEMENTATION": {"implement": 2.0, "build": 1.7, "create": 1.5, "feature": 1.5},
    "ANIMATION": {"animation": 2.1, "gsap": 2.3, "lenis": 2.1, "swiper": 2.1},
    "FORMS": {"form": 2.0, "validation": 1.7, "submit": 1.5},
    "VIDEO": {"video": 2.0, "hls": 2.4, "streaming": 2.1},
    "DEPLOYMENT": {"deploy": 2.2, "minify": 2.1, "cdn": 2.0, "r2": 1.8},
    "PERFORMANCE": {
        "performance": 2.2,
        "optimize": 1.7,
        "core web vitals": 2.4,
        "interaction": 1.4,
        "first interaction": 2.2,
        "defer": 1.5,
        "deferred": 1.5,
        "deferred loading": 2.3,
        "pagespeed": 2.2,
        "lighthouse": 2.2,
        "tbt": 2.4,
        "inp": 2.4,
        "main thread": 1.8,
        "long task": 1.8,
        "long tasks": 1.9,
    },
}

NOISY_SYNONYMS = {
    "DEBUGGING": {"unstable": 1.4, "janky": 1.6, "freeze": 1.6, "stutter": 1.5, "regression": 1.3},
    "PERFORMANCE": {
        "cls": 1.7,
        "layout shift": 1.7,
        "main thread": 1.4,
        "main-thread": 1.4,
        "stuck frame": 1.4,
        "blocking time": 1.8,
        "interaction delay": 1.8,
    },
    "FORMS": {"duplicate submit": 1.9, "double submit": 1.9, "slow network": 1.2},
    "VERIFICATION": {"before claiming": 1.6, "prove": 1.4, "evidence": 1.3},
}

MULTI_SYMPTOM_TERMS = ["janky", "stutter", "freeze", "cls", "duplicate", "flaky", "intermittent", "regression"]

UNKNOWN_FALLBACK_CHECKLIST = [
    "Identify primary failing surface (animation, forms, layout, network)",
    "Capture one reproducible browser trace (console + performance profile)",
    "Confirm target environment (mobile/desktop and browser)",
    "State expected completion evidence (Lighthouse, lint, runtime checks)",
]

RESOURCE_MAP = {
    "IMPLEMENTATION": ["references/implementation/implementation_workflows.md"],
    "CODE_QUALITY": ["assets/checklists/code_quality_checklist.md", "references/standards/code_style_enforcement.md"],
    "DEBUGGING": ["assets/checklists/debugging_checklist.md", "references/debugging/debugging_workflows.md"],
    "VERIFICATION": ["assets/checklists/verification_checklist.md", "references/verification/verification_workflows.md"],
    "ANIMATION": ["references/implementation/animation_workflows.md", "references/implementation/observer_patterns.md"],
    "FORMS": ["references/implementation/form_upload_workflows.md", "references/implementation/implementation_workflows.md"],
    "VIDEO": ["references/implementation/implementation_workflows.md"],
    "DEPLOYMENT": ["references/deployment/minification_guide.md", "references/deployment/cdn_deployment.md"],
    "PERFORMANCE": [
        "references/performance/interaction_gated_loading.md",
        "assets/checklists/performance_loading_checklist.md",
        "references/performance/cwv_remediation.md",
        "references/performance/resource_loading.md",
        "references/performance/third_party.md",
        "references/performance/webflow_constraints.md",
        "references/implementation/performance_patterns.md",
        "references/implementation/async_patterns.md",
    ],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full checklist", "full performance plan"],
    "ON_DEMAND": ["assets/checklists/code_quality_checklist.md", "assets/checklists/verification_checklist.md"],
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "description", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

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
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task):
    """Weighted intent scoring from request text and phase signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in TASK_SIGNALS}
    for intent, terms in TASK_SIGNALS.items():
        for term, weight in terms.items():
            if term in text:
                scores[intent] += weight
    for intent, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if term in text:
                scores[intent] += weight
    if getattr(task, "phase", "") == "verification" or getattr(task, "claiming_complete", False):
        scores["VERIFICATION"] += 5
    if getattr(task, "phase", "") == "debugging":
        scores["DEBUGGING"] += 5
    return scores

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 0.8, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["IMPLEMENTATION"]

    noisy_hits = sum(1 for term in MULTI_SYMPTOM_TERMS if term in (task_text or ""))
    max_intents = adaptive_max_intents if noisy_hits >= 3 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break
    return selected[:max_intents]

def route_frontend_resources(task):
    inventory = discover_markdown_resources()
    task_text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, task_text, ambiguity_delta=0.8)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if sum(scores.values()) < 0.5:
        load_if_available("assets/checklists/debugging_checklist.md")
        load_if_available("assets/checklists/verification_checklist.md")
        return {
            "intents": ["IMPLEMENTATION"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = task_text
    if "lenis" in text:
        load_if_available("references/implementation/animation_workflows.md")
    if "hls" in text:
        load_if_available("references/implementation/implementation_workflows.md")
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Development Lifecycle

Frontend development flows through phases with a mandatory quality gate:

```
Research (optional) → Implementation → Code Quality Gate → Debugging (if issues) → Verification (MANDATORY)
```

### Phase 0: Research (Optional)

**When to Use:** Complex performance issues, unfamiliar codebases, architectural decisions.

#### Performance Audit Workflow

Before implementing performance fixes, conduct systematic analysis:

1. **Capture Baseline Metrics**
   - Run PageSpeed Insights (Mobile + Desktop)
   - Record: LCP, FCP, TBT, CLS, Speed Index
   - Screenshot the waterfall diagram

2. **Identify Root Cause**
   - Use 10-agent research methodology for comprehensive analysis
   - Map the critical rendering path
   - Identify blocking resources

3. **Document Constraints**
   - Platform limitations (Webflow, CMS, etc.)
   - Third-party dependencies
   - Business requirements

#### 10-Agent Research Methodology

For complex codebase analysis, dispatch parallel agents:

| Agent | Focus Area                  |
| ----- | --------------------------- |
| 1     | HTML loading strategy       |
| 2     | JavaScript bundle inventory |
| 3     | Third-party scripts         |
| 4     | CSS performance             |
| 5     | LCP/Images analysis         |
| 6     | Above-fold resources        |
| 7     | Animation performance       |
| 8     | Initialization patterns     |
| 9     | External libraries          |
| 10    | Network waterfall           |

See: `references/research/multi_agent_patterns.md`

#### Skip Phase 0 When
- Simple, isolated fixes
- Clear requirements with known solution
- Time-critical hotfixes

### Phase 1: Implementation

**Implementation involves three specialized workflows:**

1. **Condition-Based Waiting** - Replace arbitrary setTimeout with condition polling
   - Wait for actual conditions, not timeouts
   - Includes timeout limits with clear errors
   - Handles: DOM ready, library loading, image/video ready, animations

2. **Defense-in-Depth Validation** - Validate at every layer data passes through
   - Layer 1: Entry point validation
   - Layer 2: Processing validation
   - Layer 3: Output validation
   - Layer 4: Safe access patterns

3. **CDN Version Management** - Update version parameters after JS changes
   - Manual version increment workflow (see Section 4)
   - Updates all HTML files referencing changed JS
   - Forces browser cache refresh

4. **Animation Visibility Gates** - Use IntersectionObserver for animation control
   - 0.1 threshold for animation start/stop (10% visibility)
   - Controls video autoplay and Swiper pagination
   - Prefer SharedObservers (`window.SharedObservers.observe()`) with raw IO fallback
   - See [observer_patterns.md](./references/implementation/observer_patterns.md) for patterns

See [implementation_workflows.md](./references/implementation/implementation_workflows.md) for complete workflows.

### Phase 1.5: Code Quality Gate

**Before claiming implementation is complete, validate code against style standards:**

1. **Identify File Type** - Determine which checklist sections apply:
   - **JavaScript (`.js`)**: Sections 2-7 (13 P0 items)
   - **CSS (`.css`)**: Section 8 (4 P0 items)
   - **Both**: All sections (17 P0 items)

2. **Load Checklist** - Load [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md)

3. **Validate P0 Items** - Check all P0 (blocking) items for the file type:
   
   **JavaScript P0 Items:**
   - File header format (three-line with box-drawing characters)
   - Section organization (IIFE, numbered headers)
   - No commented-out code
   - snake_case naming conventions
   - CDN-safe initialization pattern
   
   **CSS P0 Items:**
   - Custom property naming (semantic prefixes: `--font-*`, `--vw-*`, etc.)
   - Attribute selectors use case-insensitivity flag `i`
   - BEM naming convention (`.block--element`, `.block-modifier`)
   - GPU-accelerated animation properties only (`transform`, `opacity`, `scale`)

4. **Validate P1 Items** - Check all P1 (required) items for the file type

5. **Fix or Document** - For any failures:
   - P0 violations: MUST fix before proceeding
   - P1 violations: Fix OR document approved deferral
   - P2 violations: Can defer with documented reason

6. **Only Then** - Proceed to verification or claim completion

Formal review output remains baseline-owned: use `sk-code--review` for severity-ranked findings and treat this phase as overlay compliance evidence.

**Gate Rule**: If ANY P0 item fails, completion is BLOCKED until fixed.

See [code_style_enforcement.md](./references/standards/code_style_enforcement.md) for remediation instructions.

### Phase 2: Debugging

**Systematic Debugging** uses a 4-phase framework: Root Cause Investigation → Pattern Analysis → Hypothesis Testing → Implementation. Key principle: Test one change at a time; if 3+ fixes fail → question approach.

**Root Cause Tracing**: Trace backward from symptom → immediate cause → source. Fix at source, not symptom.

See [debugging_workflows.md](./references/debugging/debugging_workflows.md) for complete workflows.

### Phase 3: Verification

**The Gate Function** - BEFORE claiming any status:

1. IDENTIFY: What command/action proves this claim?
2. OPEN: Launch actual browser
3. TEST: Execute the interaction
4. VERIFY: Does browser show expected behavior?
5. VERIFY: Multi-viewport check (mobile + desktop)
6. VERIFY: Cross-browser check (if critical)
7. RECORD: Note what you saw
8. ONLY THEN: Make the claim

**Browser Testing Matrix:**

**Minimum** (ALWAYS REQUIRED):
- Chrome Desktop (1920px)
- Mobile emulation (375px)
- DevTools Console - No errors

**Standard** (Production work):
- Chrome Desktop (1920px)
- Chrome Tablet emulation (991px)
- Chrome Mobile emulation (375px)
- DevTools console clear at all viewports

See [verification_workflows.md](./references/verification/verification_workflows.md) for complete requirements.

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### Phase 1: Implementation

#### ✅ ALWAYS
- Wait for actual conditions, not arbitrary timeouts (include timeout limits)
- Validate all inputs: function parameters, API responses, DOM elements
- Sanitize user input before storing or displaying
- Update CDN versions after JavaScript modifications
- Use optional chaining (`?.`) and try/catch for safe access
- Log meaningful success/error messages
- Use validated timing constants: 64ms throttle (pointer), 180ms debounce (validation), 200ms debounce (resize), 0.1 IntersectionObserver threshold

#### ❌ NEVER
- Use `setTimeout` without documenting WHY
- Assume data exists without checking
- Trust external data without validation
- Use innerHTML with unsanitized data
- Skip CDN version updates after JS changes

#### ⚠️ ESCALATE IF
- Condition never becomes true (infinite wait)
- Validation logic becoming too complex
- Security concerns with XSS or injection attacks
- Script reports no HTML files found
- CDN version cannot be determined

See [implementation_workflows.md](./references/implementation/implementation_workflows.md) for detailed rules.

### Phase 1.5: Code Quality Gate (MANDATORY for all code files)

#### ✅ ALWAYS
- Load code_quality_checklist.md before claiming implementation complete
- Identify file type (JavaScript → Sections 2-7, CSS → Section 8)
- Validate all P0 items for the applicable file type
- Fix P0 violations before proceeding
- Document any P1/P2 deferrals with reasons
- Use code_style_enforcement.md for remediation guidance
- Use `sk-code--review` baseline for formal findings-first review output

#### ❌ NEVER (JavaScript)
- Skip the quality gate for "simple" changes
- Claim completion with P0 violations
- Use commented-out code (delete it)
- Use camelCase for variables/functions (use snake_case)
- Skip file headers or section organization

#### ❌ NEVER (CSS)
- Use generic custom property names without semantic prefixes
- Omit case-insensitivity flag `i` on data attribute selectors
- Use inconsistent BEM naming (mix snake_case, camelCase)
- Animate layout properties (width, height, top, left, padding, margin)
- Set `will-change` permanently in CSS (set dynamically via JS)

#### ⚠️ ESCALATE IF
- Cannot fix a P0 violation
- Standard conflicts with existing code patterns
- Unclear whether code is compliant

See [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md) and [code_style_enforcement.md](./references/standards/code_style_enforcement.md) for detailed rules.

### Phase 2: Debugging

#### ✅ ALWAYS
- Open DevTools console BEFORE attempting fixes
- Read complete error messages and stack traces
- Test across multiple viewports (375px, 768px, 1920px)
- Test one change at a time
- Trace backward from symptom to root cause
- Document root cause in comments
- Remember: RAF auto-throttles to ~1fps in background tabs (no manual visibility checks needed)

#### ❌ NEVER
- Skip console error messages
- Change multiple things simultaneously
- Proceed with 4th fix without questioning approach
- Fix only symptoms without tracing root cause
- Leave production console.log statements

#### ⚠️ ESCALATE IF
- Bug only occurs in production
- Issue requires changing Webflow-generated code
- Cross-browser compatibility cannot be achieved
- Bug intermittent despite extensive logging
- Cannot trace backward (dead end)
- Root cause in third-party library

See [debugging_workflows.md](./references/debugging/debugging_workflows.md) for detailed rules.

### ✅ Phase 3: Verification (MANDATORY)

#### ✅ ALWAYS
- Open actual browser to verify (not just code review)
- Test mobile viewport (375px minimum)
- Check DevTools console for errors
- Test interactive elements by clicking them
- Note what you tested in your claim

#### ❌ NEVER
- Claim "works" without opening browser
- Say "should work" or "probably works" - test it
- Test only at one viewport size
- Assume desktop testing covers mobile
- Express satisfaction before verification

#### ⚠️ ESCALATE IF
- Cannot test in required browsers
- Real device testing required but unavailable
- Issue only reproduces in production
- Performance testing requires specialized tools

See [verification_workflows.md](./references/verification/verification_workflows.md) for detailed rules.

### Error Recovery

See [error_recovery.md](./references/debugging/error_recovery.md) for CDN upload, minification, and version mismatch recovery procedures.

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Phase Completion Checklists

| Phase                   | Checklist                                                                              | Key Criteria                                           |
| ----------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Phase 1: Implementation | [implementation_workflows.md](./references/implementation/implementation_workflows.md) | No arbitrary setTimeout, inputs validated, CDN updated |
| Phase 1.5: Code Quality | [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md)             | P0 items passing, snake_case, file headers             |
| Phase 2: Debugging      | [debugging_workflows.md](./references/debugging/debugging_workflows.md)                | Root cause documented, fix at source                   |
| Phase 3: Verification   | [verification_checklist.md](./assets/checklists/verification_checklist.md)             | Browser tested, multi-viewport, console clean          |

### Performance Targets

| Metric | Target | Tool       | Metric | Target | Tool       |
| ------ | ------ | ---------- | ------ | ------ | ---------- |
| FCP    | < 1.8s | Lighthouse | CLS    | < 0.1  | Lighthouse |
| LCP    | < 2.5s | Lighthouse | FPS    | 60fps  | DevTools   |
| TTI    | < 3.8s | Lighthouse | Errors | 0      | Console    |

Run Lighthouse 3× in Incognito with mobile emulation, use median scores.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:external-resources -->
## 6. EXTERNAL RESOURCES

### Official Documentation

| Resource           | URL                         | Use For                   |
| ------------------ | --------------------------- | ------------------------- |
| MDN Web Docs       | developer.mozilla.org       | JavaScript, DOM, Web APIs |
| Webflow University | university.webflow.com      | Webflow platform patterns |
| Motion.dev         | motion.dev/docs             | Animation library         |
| HLS.js             | github.com/video-dev/hls.js | Video streaming           |
| Lenis              | lenis.darkroom.engineering  | Smooth scroll             |

### Testing & Debugging

| Resource        | URL                                | Use For               |
| --------------- | ---------------------------------- | --------------------- |
| Chrome DevTools | developer.chrome.com/docs/devtools | Browser debugging     |
| Can I Use       | caniuse.com                        | Browser compatibility |

---

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Related Skills

| Skill                         | Use For                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| **sk-code--review**    | Findings-first review baseline, severity model, risk reporting |
| **sk-doc**   | Documentation quality, skill creation, markdown validation  |
| **sk-git**             | Git workflows, commit hygiene, PR creation                  |
| **system-spec-kit**           | Spec folder management, memory system, context preservation |
| **mcp-chrome-devtools** | Browser debugging, screenshots, console access              |

### Navigation Guide

**For Implementation Tasks:**
1. Start with Section 1 (When to Use) to confirm this skill applies
2. Follow Implementation phase from Section 3 (How It Works)
3. Load ALWAYS/CONDITIONAL resources from `references/implementation/`

**For Debugging Tasks:**
1. Load [debugging_checklist.md](./assets/checklists/debugging_checklist.md)
2. Follow systematic debugging workflow in Section 3
3. Use mcp-chrome-devtools skill for DevTools reference

**For Verification Tasks:**
1. Load [verification_checklist.md](./assets/checklists/verification_checklist.md)
2. Complete all applicable checks
3. Only claim "done" when checklist passes

---

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:where-am-i-phase-detection -->
## 8. WHERE AM I? (Phase Detection)

| Phase                 | You're here if...                      | Exit criteria                      |
| --------------------- | -------------------------------------- | ---------------------------------- |
| **0: Research**       | Complex issue, unfamiliar codebase     | Constraints documented, plan ready |
| **1: Implementation** | Writing/modifying code                 | Code written, builds               |
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing               |
| **2: Debugging**      | Code has bugs/failing tests            | All tests passing                  |
| **3: Verification**   | Tests pass, final validation           | Verified in browser                |

**Transitions:** 0→1 (plan ready) | 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found). Always end with Phase 3.

---

<!-- /ANCHOR:where-am-i-phase-detection -->
<!-- ANCHOR:quick-reference -->
## 9. QUICK REFERENCE

### CDN Version Update

```bash
# After JS changes, update version in HTML
# Pattern: src="https://cdn.example.com/js/file.js?v=X.Y.Z"
# Increment Z for patches, Y for features, X for breaking changes
```

### Common Commands

```bash
# Minification workflow (scripts located in .opencode/skill/sk-code--web/scripts/)
node .opencode/skill/sk-code--web/scripts/minify-webflow.mjs          # Batch minify all JS
node .opencode/skill/sk-code--web/scripts/verify-minification.mjs     # AST verification
node .opencode/skill/sk-code--web/scripts/test-minified-runtime.mjs   # Runtime testing

# Single file minification
npx terser src/javascript/[folder]/[file].js --compress --mangle \
  -o src/javascript/z_minified/[folder]/[file].js

# CDN deployment (after minification)
wrangler r2 object put project-cdn/js/[file].min.js --file src/javascript/z_minified/[file].min.js

# Version check
grep -n "v=" src/html/global.html | head -5
```

### Success Criteria Checklist (Quick)

```
Implementation:
□ No arbitrary setTimeout (condition-based waiting instead)
□ All inputs validated
□ CDN versions updated

Code Quality:
□ P0 items passing
□ snake_case naming
□ File headers present

Verification:
□ Actual browser opened
□ Mobile + Desktop tested
□ Console errors: 0
□ Documented what was tested
```
<!-- /ANCHOR:quick-reference -->
