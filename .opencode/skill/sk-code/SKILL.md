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

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards paths, checks `inventory`, and de-duplicates with `seen`.
- Pattern 3: Extensible Routing Key - stack marker plus intent labels select stack-specific resource trees.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` disambiguates unsupported stacks and missing routes fall back to universal resources.

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
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
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

Application development flows through: Research when needed, Implementation, Code Quality Gate, Debugging if issues appear, and mandatory Verification. Full lifecycle detail lives in `references/router/phase_lifecycle.md`.

### Phase 0: Research

Use for complex performance issues, unfamiliar codebases, architecture decisions, or multi-system features. For WEBFLOW performance work, capture baseline PageSpeed/Lighthouse and network evidence before changing code.

### Phase 1: Implementation

Load `references/<stack>/implementation/`. Apply condition-based waiting, defense-in-depth validation, safe access, and stack-specific bootstrap rules. For React-Go work, also load `references/router/cross_stack_pairing.md`.

### Phase 1.5: Code Quality Gate

Load the stack checklist, validate P0/P1/P2 items, and fix every P0 before proceeding. Formal findings-first review belongs to `sk-code-review`; this skill produces stack overlay evidence.

### Phase 2: Debugging

Use root-cause investigation, pattern analysis, hypothesis testing, and one-change-at-a-time fixes. Load stack debugging resources and `references/universal/error_recovery.md`. WEBFLOW routes to `mcp-chrome-devtools`; NEXTJS focuses on hydration and server/client boundaries; GO uses tests, logs, race detector, dlv, and pprof.

### Phase 3: Verification

Run `STACK_VERIFICATION_COMMANDS[stack]`. WEBFLOW also requires real browser checks at mobile and desktop viewports with a clean console. Do not claim completion until the command or browser evidence proves the claim.

---

## 4. RULES

### ALWAYS

1. Wait for actual conditions with bounded timeouts.
2. Validate inputs and external data.
3. Sanitize before storing or displaying user-controlled content.
4. Load the code quality checklist before completion claims.
5. Trace debugging from symptom to root cause.
6. Run stack verification commands; for WEBFLOW, also test browser and console.
7. Update WEBFLOW CDN versions after JS changes.

### NEVER

1. Use arbitrary sleeps without a documented reason.
2. Trust data exists without checking.
3. Skip the quality gate for "simple" changes.
4. Claim completion with P0 violations or without verification evidence.
5. Leave commented-out code or production console logging.
6. Use this skill for unsupported stacks without disambiguation.

### ESCALATE IF

1. A required condition never becomes true.
2. Security-sensitive validation becomes unclear.
3. A P0 cannot be fixed without broader design changes.
4. A bug only reproduces in production or cannot be traced.
5. Required runtime/browser/device verification is unavailable.

---

## 5. REFERENCES

The router discovers references and assets dynamically. Start with universal standards, then stack-specific `implementation`, `debugging`, `verification`, `deployment`, and `standards` resources. Router internals and cross-stack pairing live under `references/router/`. WEBFLOW scripts are `scripts/minify-webflow.mjs`, `scripts/verify-minification.mjs`, and `scripts/test-minified-runtime.mjs`.

---

## 6. SUCCESS CRITERIA

Implementation follows stack patterns, quality gate P0s pass, debugging documents root cause, and verification commands/browser checks pass.

WEBFLOW performance targets: FCP <1.8s, LCP <2.5s, CLS <0.1, 60fps, console errors 0. NEXTJS target: type-check, lint, build, and browser smoke pass. GO target: tests, lint, and build pass.

Related skills: `sk-code-review` for formal review, `sk-code-opencode` for `.opencode/` code, `sk-doc` for docs, `sk-git` for git, `system-spec-kit` for packets/memory, and `mcp-chrome-devtools` for browser inspection.

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

Quick check: stack detected, arbitrary waits avoided, inputs validated, WEBFLOW CDN versions updated when needed, P0 items pass, stack verification commands exit 0, and browser evidence is recorded where required. Routing detail lives in `references/router/`.
