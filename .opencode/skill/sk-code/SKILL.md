---
name: sk-code
description: "Smart-routing umbrella skill for application code work — detects stack first (Webflow, React/Next.js, Go) then classifies intent and loads stack-aware resources. Stacks: WEBFLOW (live — Webflow / vanilla animation web), NEXTJS (stub — Next.js 14 + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI; scaffolded for a future Next.js project), GO (stub — gin + sqlc + Postgres + golang-jwt; scaffolded for a future Go service). Cross-stack pairing doc captures the React↔Go API contract. Other stacks (Node.js, React Native, Swift) fall through to UNKNOWN disambiguation."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.3.0
---

<!-- Keywords: sk-code, application-code, smart-router, stack-detection, multi-stack, webflow, frontend, react, nextjs, app-router, server-component, server-action, hydration, vanilla-extract, motion, untitled-ui, react-aria, react-hook-form, zod, go, golang, gin, sqlc, pgx, postgres, golang-jwt, golangci-lint, debugging-workflow, implementation-patterns, browser-verification, fullstack -->

# Code Workflows — Stack-Aware Smart Router

Single umbrella skill for application code work. Detects the project stack from marker files, classifies intent, loads the right resources.

**Core Principle**: `Stack detection → Intent classification → Phase lifecycle (Implementation → Code Quality Gate → Debugging → Verification)` = correct guidance for the actual stack in front of you.

---

## 1. WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Starting application development work (Webflow / React-Next.js / Go)
- Implementing features, components, services, handlers, modules
- JavaScript / TypeScript / Go files have been modified
- Encountering errors, failing tests, or unexpected runtime behavior
- Multiple debugging attempts needed; need root cause identification
- Before ANY completion claim (`works`, `fixed`, `done`, `complete`, `passing`)
- After implementing or debugging code that needs verification evidence

**Keyword triggers:**
- **Implementation**: `implement`, `build`, `create`, `add feature`, `service`, `component`, `handler`, `async`, `validation`, `webflow`, `cdn`, `animation`, `interaction`, `defer`, `deferred loading`, `pagespeed`, `lighthouse`, `tbt`, `inp`
- **Testing**: `test`, `unit test`, `integration test`, `coverage`, `mock`
- **Debugging**: `debug`, `fix`, `error`, `broken`, `issue`, `bug`, `console error`, `failing`
- **Verification**: `done`, `complete`, `works`, `fixed`, `finished`, `verify`, `test`
- **Stack-specific (Webflow)**: `webflow`, `motion.dev`, `gsap`, `lenis`, `swiper`, `hls.js`, `filepond`
- **Stack-specific (React/Next.js)**: `react`, `nextjs`, `next.js`, `app router`, `server component`, `client component`, `server action`, `hydration`, `vanilla-extract`, `vanilla extract`, `recipe`, `motion v12`, `untitled ui`, `untitledui`, `tinacms`, `sonner`, `next-themes`, `react aria`, `react-aria`, `embla`, `recharts`
- **Stack-specific (Go)**: `go`, `golang`, `gin`, `echo`, `chi`, `fiber`, `sqlc`, `pgx`, `postgres`, `golang-migrate`, `go-playground/validator`, `validator`, `golang-jwt`, `dlv`, `pprof`, `golangci-lint`, `slog`

### When NOT to Use

**Do NOT use this skill for:**
- OpenCode harness/system code under `.opencode/` (use `sk-code-opencode`)
- Documentation-only changes (use `sk-doc`)
- Pure research without implementation (use `sk-deep-research`)
- Git/version-control workflows (use `sk-git`)
- Findings-first code review output (use `sk-code-review` as baseline)
- Browser inspection-only tasks (use `mcp-chrome-devtools`)

### Phase Overview

This orchestrator runs in a 5-phase lifecycle:

| Phase | Purpose | Trigger |
| --- | --- | --- |
| **Phase 0: Research** | Systematic analysis before complex implementation | Performance issues, unfamiliar codebases, architectural decisions |
| **Phase 1: Implementation** | Write code with stack-specific patterns | Starting new code, modifying existing |
| **Phase 1.5: Code Quality Gate** | Validate against style standards (P0/P1/P2 severity tiers) | Before claiming Phase 1 done |
| **Phase 2: Debugging** | Fix issues systematically using stack-appropriate tools | Errors, failing tests, unexpected behavior |
| **Phase 3: Verification** | Stack verification commands + browser/runtime evidence | Before ANY `done` or `works` claim |

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE FROM THE ACTUAL STACK.

### Review Baseline Contract

`sk-code` owns stack detection, implementation patterns, code quality gate, and stack-aware verification commands.

For formal findings-first code review output, use `sk-code-review` as the baseline:
- Severity model and review output contract: `.opencode/skill/sk-code-review/SKILL.md`
- Baseline security / quality / test review checks: `sk-code-review` references
- This skill: stack-specific overlay rules and verification evidence

---

## 2. SMART ROUTING

### Stack Detection (FIRST — gates all downstream resource loading)

Stack detection is explicit and ordered. **First match wins.** Webflow / vanilla animation web is checked first because such projects often carry `package.json` for build tooling but should NOT mistakenly route to NEXTJS.

```bash
# 1. WEBFLOW — Webflow / vanilla animation-library web (checked first)
[ -d "src/2_javascript" ] && STACK="WEBFLOW"
ls *.webflow.js 2>/dev/null | head -1 && STACK="WEBFLOW"
grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null && STACK="WEBFLOW"
grep -lqE "from ['\"]motion['\"]|motion\.dev|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
  src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null && STACK="WEBFLOW"
[ -f "wrangler.toml" ] && STACK="WEBFLOW"

# 2. GO — backend service
[ -f "go.mod" ] && STACK="GO"

# 3. NEXTJS — Next.js / React App Router frontend
[ -f "next.config.js" -o -f "next.config.mjs" -o -f "next.config.ts" ] && STACK="NEXTJS"
[ -f "package.json" ] && grep -Eq '"next"|"react"' package.json && STACK="NEXTJS"

# 4. UNKNOWN — Node.js / React Native / Swift / other (not owned)
STACK="UNKNOWN"
```

**Routes:**
- `WEBFLOW` — full live content under `references/webflow/`, `assets/webflow/`, `scripts/`
- `NEXTJS` — scaffolded **stub** content under `references/nextjs/`, `assets/nextjs/` (target: Next.js 14 App Router + vanilla-extract + motion v12 + Untitled UI + react-hook-form/zod + react-aria + Sonner + next-themes + optional TinaCMS). Pairs with `GO` via `references/router/cross_stack_pairing.md` (canonical contract — not a stub). Populate stubs when a real Next.js project is wired in.
- `GO` — scaffolded **stub** content under `references/go/`, `assets/go/` (target: gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt). Pairs with `NEXTJS` via the same cross-stack pairing doc. Populate stubs when a real Go service is wired in.
- `UNKNOWN` — anything else (Node.js without Next/React, React Native, Swift, etc.) — surface a disambiguation prompt; this skill does not own those stacks.

For detection precedence, multi-marker edge cases, and test cases: `references/router/stack_detection.md`.

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAPS`. Domains:

- `references/universal/` for stack-agnostic core (severity model, error recovery, multi-agent research, code style guide).
- `references/webflow/{implementation,debugging,verification,deployment,performance,standards}/` for the LIVE Webflow / vanilla-animation stack.
- `references/nextjs/{implementation,debugging,verification,deployment,standards}/` for the NEXTJS stub branch (Next.js 14 target).
- `references/go/{implementation,debugging,verification,deployment,standards}/` for the GO stub branch (gin + sqlc + Postgres target).
- `references/router/{stack_detection,intent_classification,resource_loading,phase_lifecycle,cross_stack_pairing}.md` for routing internals and the canonical Next.js ↔ Go contract.
- `assets/universal/{checklists,patterns}/` for stack-agnostic debugging + verification checklists and shared JS patterns.
- `assets/webflow/{checklists,patterns,integrations}/` for the LIVE Webflow checklists, patterns, and vendor integrations.
- `assets/nextjs/{checklists,patterns,integrations}/` for NEXTJS stub checklists, code patterns, and integrations.
- `assets/go/{checklists,patterns}/` for GO stub checklists and code patterns.
- `scripts/{minify-webflow,verify-minification,test-minified-runtime}.mjs` are CWD-relative Webflow build utilities.

### Resource Loading Levels

| Level       | When to Load                                  | Resources                                                 |
| ----------- | --------------------------------------------- | --------------------------------------------------------- |
| ALWAYS      | Every skill invocation                        | Universal core (severity model + error recovery)          |
| CONDITIONAL | If intent signals match (top-1 / top-2)       | Stack-specific intent → file maps from `RESOURCE_MAPS`    |
| ON_DEMAND   | Only on explicit request (keyword-triggered)  | Extended checklists + cross-stack pairing + vendor specifics |

### Smart Router Pseudocode

The authoritative routing logic for stack detection, weighted intent scoring, ambiguity handling, and per-stack resource loading.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/universal/code_quality_standards.md"

LIVE_STACKS = ("WEBFLOW",)
STUB_STACKS = ("NEXTJS", "GO")
ROUTABLE_STACKS = LIVE_STACKS + STUB_STACKS  # WEBFLOW, NEXTJS, GO

STACK_FOLDERS = {"WEBFLOW": "webflow", "NEXTJS": "nextjs", "GO": "go"}

STACK_VERIFICATION_COMMANDS = {
    "WEBFLOW": ["node scripts/minify-webflow.mjs",
                "node scripts/verify-minification.mjs",
                "node scripts/test-minified-runtime.mjs",
                "browser test (mobile + desktop + console clean)"],
    "NEXTJS":  ["npm run type-check", "npm run lint", "npm run build"],
    "GO":      ["go test ./...", "golangci-lint run", "go build ./..."],
}

INTENT_SIGNALS = {
    "IMPLEMENTATION": {"weight": 4, "keywords": ["implement", "build", "create", "add feature", "service", "component", "handler", "module"]},
    "CODE_QUALITY":   {"weight": 4, "keywords": ["lint", "format", "quality gate", "p0", "p1", "code style", "naming"]},
    "DEBUGGING":      {"weight": 5, "keywords": ["debug", "fix", "error", "bug", "broken", "console error", "hydration", "stack trace"]},
    "VERIFICATION":   {"weight": 5, "keywords": ["verify", "done", "complete", "works", "fixed", "passing", "type-check", "build", "browser test"]},
    "ANIMATION":      {"weight": 3, "keywords": ["animation", "motion", "transition", "scroll-trigger", "lenis", "gsap", "motion v12"]},
    "FORMS":          {"weight": 3, "keywords": ["form", "validation", "react-hook-form", "zod", "go-playground/validator"]},
    "API":            {"weight": 3, "keywords": ["api", "fetch", "endpoint", "jwt", "envelope", "cors", "cross-stack pairing"]},
    "DATABASE":       {"weight": 3, "keywords": ["postgres", "sqlc", "pgx", "migration", "transaction", "query"]},
    "DEPLOYMENT":     {"weight": 3, "keywords": ["deploy", "vercel", "railway", "fly.io", "docker", "cdn", "wrangler"]},
    "TESTING":        {"weight": 4, "keywords": ["test", "unit test", "integration test", "coverage", "table test", "race detector"]},
    "PERFORMANCE":    {"weight": 3, "keywords": ["lighthouse", "lcp", "tbt", "cls", "core web vitals", "pagespeed", "pprof"]},
    "VIDEO":          {"weight": 3, "keywords": ["hls", "video", "stream", "filepond"]},
}

RESOURCE_MAPS = {
    "WEBFLOW": {
        "IMPLEMENTATION": ["references/webflow/implementation/implementation_workflows.md"],
        "CODE_QUALITY":   ["assets/webflow/checklists/code_quality_checklist.md",
                           "references/webflow/standards/code_style_guide.md"],
        "DEBUGGING":      ["assets/webflow/checklists/debugging_checklist.md",
                           "references/webflow/debugging/debugging_workflows.md",
                           "references/webflow/debugging/error_recovery.md"],
        "VERIFICATION":   ["assets/webflow/checklists/verification_checklist.md",
                           "references/webflow/verification/verification_workflows.md"],
        "ANIMATION":      ["references/webflow/implementation/animation_workflows.md"],
        "FORMS":          ["references/webflow/implementation/form_upload_workflows.md"],
        "DEPLOYMENT":     ["references/webflow/deployment/cdn_deployment.md",
                           "references/webflow/deployment/minification_guide.md"],
        "PERFORMANCE":    ["references/webflow/performance/cwv_remediation.md",
                           "assets/webflow/checklists/performance_loading_checklist.md"],
        "VIDEO":          ["assets/webflow/integrations/hls_patterns.js"],
    },
    "NEXTJS": {
        "IMPLEMENTATION": ["references/nextjs/implementation/implementation_workflows.md"],
        "CODE_QUALITY":   ["assets/nextjs/checklists/code_quality_checklist.md",
                           "references/nextjs/standards/code_style.md"],
        "DEBUGGING":      ["assets/nextjs/checklists/debugging_checklist.md",
                           "references/nextjs/debugging/debugging_workflows.md",
                           "references/nextjs/debugging/hydration_errors.md"],
        "VERIFICATION":   ["assets/nextjs/checklists/verification_checklist.md",
                           "references/nextjs/verification/verification_workflows.md"],
        "ANIMATION":      ["references/nextjs/implementation/motion_animation.md"],
        "FORMS":          ["references/nextjs/implementation/forms_validation.md",
                           "assets/nextjs/patterns/form_pattern.tsx"],
        "API":            ["references/nextjs/implementation/api_integration.md",
                           "references/router/cross_stack_pairing.md",
                           "assets/nextjs/patterns/api_call_pattern.ts"],
        "DEPLOYMENT":     ["references/nextjs/deployment/vercel_deploy.md"],
        "TESTING":        ["assets/nextjs/checklists/verification_checklist.md"],
    },
    "GO": {
        "IMPLEMENTATION": ["references/go/implementation/implementation_workflows.md",
                           "references/go/implementation/gin_handler_patterns.md",
                           "references/go/implementation/service_layer.md"],
        "CODE_QUALITY":   ["assets/go/checklists/code_quality_checklist.md",
                           "references/go/standards/code_style.md"],
        "DEBUGGING":      ["assets/go/checklists/debugging_checklist.md",
                           "references/go/debugging/debugging_workflows.md",
                           "references/go/debugging/pprof_profiling.md"],
        "VERIFICATION":   ["assets/go/checklists/verification_checklist.md",
                           "references/go/verification/verification_workflows.md"],
        "DATABASE":       ["references/go/implementation/database_sqlc_postgres.md",
                           "assets/go/patterns/repository_sqlc.go"],
        "API":            ["references/go/implementation/api_design.md",
                           "references/go/implementation/error_envelopes.md",
                           "references/router/cross_stack_pairing.md",
                           "assets/go/patterns/handler_pattern.go"],
        "FORMS":          ["references/go/implementation/validation_patterns.md"],
        "DEPLOYMENT":     ["references/go/deployment/docker_railway.md"],
        "TESTING":        ["assets/go/patterns/table_test_pattern_test.go",
                           "assets/go/checklists/verification_checklist.md"],
        "PERFORMANCE":    ["references/go/debugging/pprof_profiling.md"],
    },
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE, "references/universal/error_recovery.md"],
    "ON_DEMAND_KEYWORDS": ["full checklist", "deep dive", "browser matrix", "full performance plan",
                           "lenis", "hls", "filepond", "swiper",
                           "cross-stack pairing", "next.js go pairing", "nextjs go pairing"],
    "ON_DEMAND": ["assets/universal/checklists/debugging_checklist.md",
                  "assets/universal/checklists/verification_checklist.md",
                  "references/router/cross_stack_pairing.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is this a Webflow / vanilla animation web project?",
    "Is this a Next.js / React App Router project?",
    "Is this a Go / gin / sqlc / Postgres service?",
    "Or is this a stack sk-code does not own (Node.js, React Native, Swift)?",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def detect_stack(cwd: Path = None) -> str:
    """First-match-wins stack detection. See references/router/stack_detection.md for full rules."""
    cwd = cwd or Path.cwd()
    if (cwd / "src/2_javascript").is_dir(): return "WEBFLOW"
    if (cwd / "wrangler.toml").exists() and not any((cwd / f).exists() for f in ("next.config.js", "next.config.mjs", "next.config.ts")):
        return "WEBFLOW"
    if (cwd / "go.mod").exists(): return "GO"
    if any((cwd / f).exists() for f in ("next.config.js", "next.config.mjs", "next.config.ts")):
        return "NEXTJS"
    pkg = cwd / "package.json"
    if pkg.exists() and any(dep in pkg.read_text() for dep in ('"next"', '"react"')):
        return "NEXTJS"
    return "UNKNOWN"

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["IMPLEMENTATION"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_code_resources(task, stack: str | None = None):
    """Orchestrates stack detection, intent scoring, and per-stack resource loading."""
    inventory = discover_markdown_resources()
    stack = stack or detect_stack()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    # ALWAYS load (universal core)
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    # UNKNOWN stack: surface fallback, skip stack-specific loading
    if stack == "UNKNOWN" or stack not in ROUTABLE_STACKS:
        return {
            "stack": stack,
            "intents": intents,
            "verification_commands": [],
            "resources": loaded,
            "fallback": UNKNOWN_FALLBACK_CHECKLIST,
        }

    # CONDITIONAL load (per-stack intent maps)
    stack_map = RESOURCE_MAPS.get(stack, {})
    for intent in intents:
        for relative_path in stack_map.get(intent, []):
            load_if_available(relative_path)

    # ON_DEMAND load (keyword-triggered)
    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {
        "stack": stack,
        "intents": intents,
        "verification_commands": STACK_VERIFICATION_COMMANDS.get(stack, []),
        "resources": loaded,
    }
```

For deeper reads on TASK_SIGNALS scoring, NOISY_SYNONYMS, and load-level mapping: `references/router/intent_classification.md` and `references/router/resource_loading.md`. Cross-stack pairing for NEXTJS ↔ GO (API / JWT / CORS contracts): `references/router/cross_stack_pairing.md`.

---

## 3. HOW IT WORKS

### Development Lifecycle

Application development flows through phases with a mandatory quality gate:

```
Research (optional) → Implementation → Code Quality Gate → Debugging (if issues) → Verification (MANDATORY)
```

For the full per-phase narrative (workflows, transitions, exit criteria, anti-patterns) see `references/router/phase_lifecycle.md`.

### Phase 0: Research (Optional)

**When to Use:** Complex performance issues, unfamiliar codebases, architectural decisions, multi-system features.

For WEBFLOW projects: Capture baseline metrics (PageSpeed Mobile + Desktop, LCP / FCP / TBT / CLS / Speed Index, waterfall) before implementing performance fixes. Use the 10-agent research methodology in `references/universal/multi_agent_research.md` for parallel codebase analysis (HTML loading, JS bundles, third-party, CSS, LCP/images, above-fold, animation, init patterns, libraries, network waterfall).

**Skip Phase 0** for simple isolated fixes, clear requirements with known solutions, or time-critical hotfixes.

### Phase 1: Implementation

Implementation patterns are stack-specific. The router loads from `references/<stack>/`.

**Universal principles** (apply across stacks):

1. **Condition-based waiting** — replace arbitrary timeouts with condition polling; include timeout limits with clear errors. Stack examples: WEBFLOW DOM ready / library load; NEXTJS useEffect with cancellation; GO context cancellation.
2. **Defense-in-depth validation** — Layer 1: entry-point validation; Layer 2: processing validation; Layer 3: output validation; Layer 4: safe-access patterns.
3. **Stack-specific bootstrap** —
   - **WEBFLOW**: CDN version management, IntersectionObserver gates, snake_case naming, file headers
   - **NEXTJS**: App Router (Server vs Client Components), vanilla-extract recipes, motion v12 transitions, react-hook-form + zod, react-aria a11y
   - **GO**: cmd/ + internal/ + pkg/ layout, gin handler + service + repository layers, sqlc-generated repositories, validator registration, golang-jwt issuance/verification

For stack-specific workflows: `references/<stack>/`. Live entry-point docs:
- WEBFLOW: `references/webflow/implementation/implementation_workflows.md`
- NEXTJS: `references/nextjs/implementation/implementation_workflows.md` (Next.js 14 target — currently a stub)
- GO: `references/go/implementation/implementation_workflows.md` (gin + sqlc + Postgres)
- Cross-stack contract (NEXTJS↔GO API/JWT/CORS): `references/router/cross_stack_pairing.md`

### Phase 1.5: Code Quality Gate

**Before claiming implementation is complete, validate code against style standards.**

1. Identify file type and stack — load the matching checklist
   - WEBFLOW JavaScript: `assets/webflow/checklists/code_quality_checklist.md` (Sections 2-7 P0 items: file headers, section organization, snake_case, no commented-out code, CDN-safe init)
   - WEBFLOW CSS: `assets/webflow/checklists/code_quality_checklist.md` (Section 8 P0 items: semantic custom property prefixes, attribute selectors with `i` flag, BEM naming, GPU-accelerated animations only)
   - NEXTJS: `assets/nextjs/checklists/code_quality_checklist.md` (P0: TypeScript strict, no `any`, named exports, vanilla-extract recipes, server/client boundary, zod boundaries, no console.log, no dangerouslySetInnerHTML with unsanitized data)
   - GO: `assets/go/checklists/code_quality_checklist.md` (P0: gofmt clean, golangci-lint clean, error wrapping with `%w`, context propagation, no naked goroutines)
   - UNKNOWN: this skill does not own checklists for unsupported stacks; surface disambiguation prompt

2. Validate items by severity — P0 (blocker), P1 (required), P2 (optional)
3. Universal severity model: `references/universal/code_quality_standards.md`
4. Formal review belongs to `sk-code-review` (this skill produces overlay compliance evidence, not findings-first output)

**Gate Rule**: If ANY P0 item fails, completion is BLOCKED until fixed.

### Phase 2: Debugging

**Systematic 4-phase framework**: Root Cause Investigation → Pattern Analysis → Hypothesis Testing → Implementation. Test one change at a time. If 3+ fixes fail → question approach.

**Stack-specific debugging tooling:**
- **WEBFLOW**: `references/webflow/debugging/debugging_workflows.md` (DevTools Console, network panel, performance profiler) + `mcp-chrome-devtools` skill
- **NEXTJS**: `references/nextjs/debugging/debugging_workflows.md` + `references/nextjs/debugging/hydration_errors.md` (Server vs Client Component bugs, hydration mismatches, network inspection)
- **GO**: `references/go/debugging/debugging_workflows.md` + `references/go/debugging/pprof_profiling.md` (dlv, structured logs via slog, race detector, pprof)
- **UNKNOWN stacks** (Node.js without React/Next, React Native, Swift, etc.): not owned by this skill; surface disambiguation prompt

**Universal error recovery**: `references/universal/error_recovery.md` (decision tree for rollback, recovery, escalation).

### Phase 3: Verification

**The Gate Function** — BEFORE claiming any status:

1. IDENTIFY: What command/action proves this claim?
2. RUN: Execute the stack's verification commands (see `STACK_VERIFICATION_COMMANDS`)
3. TEST: For WEBFLOW, also open browser; for non-WEBFLOW, run unit/integration suites
4. VERIFY: Does output match expected behavior?
5. VERIFY: For WEBFLOW, multi-viewport check (mobile + desktop)
6. VERIFY: For WEBFLOW, cross-browser check (if critical)
7. RECORD: Note what you saw / what command exited 0
8. ONLY THEN: Make the claim

**WEBFLOW Browser Testing Matrix:**

- **Minimum** (always required): Chrome Desktop (1920px), Mobile emulation (375px), DevTools Console — no errors
- **Standard** (production work): Chrome Desktop + Tablet (991px) + Mobile (375px); DevTools console clear at all viewports

**Non-WEBFLOW stacks**: run `STACK_VERIFICATION_COMMANDS[stack]`. All commands must exit 0 before claiming done.
- **NEXTJS**: `references/nextjs/verification/verification_workflows.md` (npm run type-check / lint / build + browser smoke matrix)
- **GO**: `references/go/verification/verification_workflows.md` (`go test ./...` + `golangci-lint run` + `go build ./...` + `-race` for race detector)

---

## 4. RULES

### Phase 1: Implementation

**ALWAYS:** Wait for actual conditions, not arbitrary timeouts (include timeout limits). Validate all inputs (function parameters, API responses, DOM/external data). Sanitize user input before storing or displaying. Use safe-access patterns appropriate to the stack (optional chaining + try/catch in JS/TS, error returns in Go, optionals in Swift). Log meaningful success/error messages.

**WEBFLOW additional ALWAYS:** Update CDN versions after JS modifications. Use validated timing constants (64ms throttle pointer, 180ms debounce validation, 200ms debounce resize, 0.1 IntersectionObserver threshold).

**NEVER:** Use `setTimeout` (or stack equivalent) without documenting WHY. Assume data exists without checking. Trust external data without validation. WEBFLOW: use `innerHTML` with unsanitized data; skip CDN version updates after JS changes.

**ESCALATE IF:** Condition never becomes true (infinite wait); validation logic becoming too complex; security concerns with XSS or injection attacks; WEBFLOW: script reports no HTML files found, CDN version cannot be determined.

### Phase 1.5: Code Quality Gate (MANDATORY for all code files)

**ALWAYS:** Load the stack's code quality checklist before claiming implementation complete. Validate all P0 items for the applicable file type and stack. Fix P0 violations before proceeding. Document any P1/P2 deferrals with reasons. Use `sk-code-review` baseline for formal findings-first review output.

**NEVER (universal):** Skip the quality gate for "simple" changes. Claim completion with P0 violations. Use commented-out code (delete it).

**NEVER (WEBFLOW JavaScript):** Use camelCase for variables/functions (use snake_case). Skip file headers or section organization.

**NEVER (WEBFLOW CSS):** Use generic custom property names without semantic prefixes. Omit case-insensitivity flag `i` on data attribute selectors. Animate layout properties (width, height, top, left, padding, margin). Set `will-change` permanently in CSS (set dynamically via JS).

**ESCALATE IF:** Cannot fix a P0 violation; standard conflicts with existing code patterns; unclear whether code is compliant.

### Phase 2: Debugging

**ALWAYS:** Open the stack's debugging tool BEFORE attempting fixes (DevTools for WEBFLOW; debugger / log viewer for backend; LLDB / Xcode for Swift). Read complete error messages and stack traces. WEBFLOW: test across multiple viewports (375px, 768px, 1920px). Test one change at a time. Trace backward from symptom to root cause. Document root cause in comments. WEBFLOW: remember RAF auto-throttles to ~1fps in background tabs (no manual visibility checks needed).

**NEVER:** Skip console / log error messages. Change multiple things simultaneously. Proceed with 4th fix without questioning approach. Fix only symptoms without tracing root cause. WEBFLOW: leave production console.log statements.

**ESCALATE IF:** Bug only occurs in production; issue requires changing third-party library or framework; cross-browser / cross-platform compatibility cannot be achieved; bug intermittent despite extensive logging; cannot trace backward (dead end).

### Phase 3: Verification (MANDATORY)

**ALWAYS:** Run the stack's verification commands (`STACK_VERIFICATION_COMMANDS[stack]`); all must exit 0. WEBFLOW: open actual browser to verify (not just code review); test mobile viewport (375px minimum); check DevTools console for errors. Non-WEBFLOW: run unit + integration tests + lint; do not skip a category. Note what you tested in your claim.

**NEVER:** Claim "works" without running verification commands. Say "should work" or "probably works" — test it. WEBFLOW: test only at one viewport size; assume desktop testing covers mobile. Express satisfaction before verification.

**ESCALATE IF:** Cannot test in required browsers / runtimes; real device testing required but unavailable; issue only reproduces in production; performance testing requires specialized tools.

### Error Recovery

See `references/universal/error_recovery.md` for the universal decision tree (recover-in-place / rollback / escalate). WEBFLOW-specific recovery for CDN upload, minification, version mismatch lives in `references/webflow/debugging/error_recovery.md`.

---

## 5. REFERENCES

### Core References

#### Universal (stack-agnostic core)

- [code_quality_standards.md](./references/universal/code_quality_standards.md) - severity model (P0/P1/P2) and universal checklist framework.
- [code_style_guide.md](./references/universal/code_style_guide.md) - language-agnostic conventions: naming, comments, structure, safety patterns.
- [error_recovery.md](./references/universal/error_recovery.md) - decision tree: recover-in-place / rollback / escalate for all stacks.
- [multi_agent_research.md](./references/universal/multi_agent_research.md) - 10-agent specialization model for performance audits and complex codebase analysis.

#### Router (routing internals + cross-stack contract)

- [stack_detection.md](./references/router/stack_detection.md) - marker-file precedence and detection edge cases.
- [intent_classification.md](./references/router/intent_classification.md) - TASK_SIGNALS scoring, NOISY_SYNONYMS, intent ranking.
- [resource_loading.md](./references/router/resource_loading.md) - load levels and per-stack resource resolution.
- [phase_lifecycle.md](./references/router/phase_lifecycle.md) - Phase 0-3 lifecycle narrative with exit criteria and transitions.
- [cross_stack_pairing.md](./references/router/cross_stack_pairing.md) - canonical Next.js ↔ Go API contract (REST envelope, JWT handoff, CORS, deploy topology).

#### WEBFLOW (live)

- [implementation/implementation_workflows.md](./references/webflow/implementation/implementation_workflows.md) - Phase 1 entry point.
- [debugging/debugging_workflows.md](./references/webflow/debugging/debugging_workflows.md) - DevTools console, network panel, performance profiles.
- [verification/verification_workflows.md](./references/webflow/verification/verification_workflows.md) - browser matrix and Lighthouse procedure.
- [deployment/cdn_deployment.md](./references/webflow/deployment/cdn_deployment.md) - CDN version management and Wrangler workflow.
- [standards/code_style_guide.md](./references/webflow/standards/code_style_guide.md) - WEBFLOW snake_case JS + BEM CSS conventions.

#### NEXTJS (stub)

- [README.md](./references/nextjs/README.md) - stack overview stub (Next.js 14 target).
- [implementation/implementation_workflows.md](./references/nextjs/implementation/implementation_workflows.md) - Phase 1 entry point stub.

#### GO (stub)

- [README.md](./references/go/README.md) - stack overview stub (gin + sqlc + Postgres target).
- [implementation/implementation_workflows.md](./references/go/implementation/implementation_workflows.md) - Phase 1 entry point stub.

### Templates and Assets

- [assets/universal/checklists/debugging_checklist.md](./assets/universal/checklists/debugging_checklist.md) - stack-agnostic 4-phase debugging workflow.
- [assets/universal/checklists/verification_checklist.md](./assets/universal/checklists/verification_checklist.md) - stack-agnostic 8-step verification gate.
- [assets/webflow/checklists/](./assets/webflow/checklists/) - WEBFLOW P0/P1/P2 code quality, performance loading, debugging, verification.
- [assets/webflow/integrations/](./assets/webflow/integrations/) - lenis and HLS.js vendor integration patterns.
- [assets/webflow/patterns/](./assets/webflow/patterns/) - wait, validation, interaction-gate, performance JS patterns.
- [assets/nextjs/checklists/](./assets/nextjs/checklists/), [assets/nextjs/patterns/](./assets/nextjs/patterns/), [assets/nextjs/integrations/](./assets/nextjs/integrations/) - NEXTJS stub assets.
- [assets/go/checklists/](./assets/go/checklists/), [assets/go/patterns/](./assets/go/patterns/) - GO stub assets.

### Build and Verification Scripts

- `scripts/minify-webflow.mjs` - WEBFLOW JS bundle minification (CWD-relative; portable).
- `scripts/verify-minification.mjs` - AST verification of minified output before CDN deploy.
- `scripts/test-minified-runtime.mjs` - runtime sandbox for minified bundles.

NEXTJS and GO stacks use standard `npm`/`go` CLIs natively — no skill-owned scripts needed.

---

## 6. SUCCESS CRITERIA

### Phase Completion Checklists

| Phase | Checklist | Key Criteria |
| --- | --- | --- |
| Phase 1: Implementation | `references/<stack>/` workflows | Stack patterns followed; inputs validated; safe-access |
| Phase 1.5: Code Quality | `assets/<stack>/checklists/code_quality_checklist.md` (or universal) | P0 items passing |
| Phase 2: Debugging | `references/webflow/debugging/debugging_workflows.md` (WEBFLOW) / `references/universal/error_recovery.md` | Root cause documented; fix at source |
| Phase 3: Verification | `assets/universal/checklists/verification_checklist.md` + stack commands | All commands exit 0; for WEBFLOW: multi-viewport browser test, console clean |

### Performance Targets (WEBFLOW)

| Metric | Target | Tool       | Metric | Target | Tool       |
| --- | --- | --- | --- | --- | --- |
| FCP | < 1.8s | Lighthouse | CLS | < 0.1 | Lighthouse |
| LCP | < 2.5s | Lighthouse | FPS | 60fps | DevTools |
| TTI | < 3.8s | Lighthouse | Errors | 0 | Console |

Run Lighthouse 3× in Incognito with mobile emulation, use median scores.

### Performance / Verification Targets (Non-WEBFLOW)

| Stack | Target |
| --- | --- |
| NEXTJS | `npm run type-check` clean; `npm run lint` clean; `npm run build` succeeds; browser smoke (mobile + desktop) console clean |
| GO | `go test ./...` exits 0; `golangci-lint run` clean; `go build ./...` succeeds |

---

## 7. EXTERNAL RESOURCES

### Official Documentation (by stack)

| Stack | Resource | URL |
| --- | --- | --- |
| WEBFLOW | MDN Web Docs | developer.mozilla.org |
| WEBFLOW | Webflow University | university.webflow.com |
| WEBFLOW | Motion.dev | motion.dev/docs |
| WEBFLOW | HLS.js | github.com/video-dev/hls.js |
| WEBFLOW | Lenis | lenis.darkroom.engineering |
| NEXTJS | React docs | react.dev |
| NEXTJS | Next.js docs | nextjs.org/docs |
| NEXTJS | vanilla-extract | vanilla-extract.style |
| NEXTJS | motion | motion.dev/docs |
| GO | Go documentation | go.dev/doc |
| GO | gin | gin-gonic.com/docs |
| GO | sqlc | docs.sqlc.dev |
| GO | pgx | github.com/jackc/pgx |

### Testing & Debugging

| Stack | Resource | Use For |
| --- | --- | --- |
| WEBFLOW | Chrome DevTools | Browser debugging |
| WEBFLOW | Can I Use | Browser compatibility |
| NEXTJS | React DevTools, Vitest, Chrome DevTools | Component inspection, unit tests, browser smoke |
| GO | `go test`, `go vet`, `dlv`, `pprof` | Unit tests, static analysis, debugger, profiler |

---

## 8. RELATED RESOURCES

### Related Skills

| Skill | Use For |
| --- | --- |
| **`sk-code-review`** | Findings-first review baseline, severity model, risk reporting |
| **`sk-code-opencode`** | OpenCode harness/system code (`.opencode/` directory) — sibling, not subsumed |
| **`sk-doc`** | Documentation quality, skill creation, markdown validation |
| **`sk-git`** | Git workflows, commit hygiene, PR creation |
| **`system-spec-kit`** | Spec folder management, memory system, context preservation |
| **`mcp-chrome-devtools`** | WEBFLOW stack browser debugging, screenshots, console access |

### Cross-Skill Linkage

- **`sk-code-review`** is invoked for formal findings-first review output. This skill produces overlay compliance evidence (Phase 1.5 checklists), not the review itself.
- **`sk-code-opencode`** covers OpenCode system code (the `.opencode/` directory itself — JS/TS/Python/Shell standards). It is intentionally NOT subsumed by sk-code; the two are siblings.
- **`mcp-chrome-devtools`** is the canonical browser-automation surface for the WEBFLOW Phase 2/3 routes.

### Navigation Guide

**For implementation tasks:** Confirm stack via marker files (this skill auto-detects WEBFLOW, NEXTJS, GO); load Phase 1 resources from `references/<stack>/`; cite `references/universal/` for stack-agnostic principles. For React↔Go fullstack work also load `references/router/cross_stack_pairing.md`. If detection returns UNKNOWN (Node.js without React/Next, React Native, Swift, etc.), this skill does not own the stack — surface a disambiguation prompt.

**For debugging tasks:** Load `assets/universal/checklists/debugging_checklist.md`; load `references/<stack>/debugging/` content (WEBFLOW: + `mcp-chrome-devtools`; NEXTJS: hydration / Server vs Client / network inspection; GO: dlv + slog + pprof).

**For verification tasks:** Load `assets/universal/checklists/verification_checklist.md`; run `STACK_VERIFICATION_COMMANDS[stack]`; for WEBFLOW also run browser matrix (mobile + desktop + console clean); only claim "done" when all commands exit 0 + checklist passes.

---

## 9. WHERE AM I? (Phase Detection)

| Phase | You're here if... | Exit criteria |
| --- | --- | --- |
| **0: Research** | Complex issue, unfamiliar codebase, performance audit | Constraints documented, plan ready |
| **1: Implementation** | Writing/modifying code | Code written, builds locally |
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing |
| **2: Debugging** | Code has bugs / failing tests / runtime errors | All tests passing, errors resolved |
| **3: Verification** | Tests pass, final validation before claim | All `STACK_VERIFICATION_COMMANDS` exit 0; for WEBFLOW, multi-viewport browser clean |

**Transitions:** 0→1 (plan ready) | 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found). Always end with Phase 3.

---

## 10. QUICK REFERENCE

### Stack Detection (single command)

```bash
# Run from project root — first match wins; sk-code only owns WEBFLOW / NEXTJS / GO
([ -d "src/2_javascript" ] || ls *.webflow.js 2>/dev/null | head -1 >/dev/null) && echo WEBFLOW \
  || ([ -f "wrangler.toml" ] && echo WEBFLOW) \
  || ([ -f "go.mod" ] && echo GO) \
  || (ls next.config.* 2>/dev/null | head -1 >/dev/null && echo NEXTJS) \
  || ([ -f "package.json" ] && grep -Eq '"next"|"react"' package.json && echo NEXTJS) \
  || echo UNKNOWN
```

### CDN Version Update (WEBFLOW)

```bash
# After JS changes, update version in HTML
# Pattern: src="https://cdn.example.com/js/file.js?v=X.Y.Z"
# Increment Z for patches, Y for features, X for breaking changes
```

### Common Commands by Stack

```bash
# WEBFLOW — minification workflow (scripts portable from new skill location)
node .opencode/skill/sk-code/scripts/minify-webflow.mjs          # Batch minify all JS
node .opencode/skill/sk-code/scripts/verify-minification.mjs     # AST verification
node .opencode/skill/sk-code/scripts/test-minified-runtime.mjs   # Runtime testing
# Single file: npx terser src/javascript/[folder]/[file].js --compress --mangle -o src/javascript/z_minified/[folder]/[file].js
# CDN deploy: wrangler r2 object put project-cdn/js/[file].min.js --file src/javascript/z_minified/[file].min.js
# Version check: grep -n "v=" src/html/global.html | head -5

# NEXTJS
npm run type-check && npm run lint && npm run build
# GO
go test ./... && golangci-lint run && go build ./...
```

### Success Criteria Checklist (Quick)

```
Implementation:
  □ Stack detected (or explicit hint provided)
  □ No arbitrary timeouts (condition-based waiting instead)
  □ All inputs validated
  □ WEBFLOW: CDN versions updated

Code Quality:
  □ P0 items passing (per stack checklist)
  □ WEBFLOW JS: snake_case naming, file headers
  □ WEBFLOW CSS: semantic custom properties, `i` flag, BEM, GPU-only animation

Verification:
  □ STACK_VERIFICATION_COMMANDS all exit 0
  □ WEBFLOW: actual browser opened, mobile + desktop tested, console errors: 0
  □ Documented what was tested
```

For routing detail (precedence, intent classification, resource loading, cross-stack pairing): see `references/router/`.
