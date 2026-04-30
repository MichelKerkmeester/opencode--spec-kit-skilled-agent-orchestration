---
name: sk-code
description: "Smart-routing umbrella skill for application code work — detects stack first (Webflow, React/Next.js, Go) then classifies intent and loads stack-aware resources. Three live stacks: WEBFLOW (Webflow / vanilla animation web), REACT (kerkmeester-style Next.js 14 + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI), GO (gin + sqlc + Postgres + golang-jwt). Cross-stack pairing doc captures the React↔Go API contract. Other stacks (Node.js, React Native, Swift) fall through to UNKNOWN disambiguation."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0
---

<!-- Keywords: sk-code, application-code, smart-router, stack-detection, multi-stack, webflow, frontend, react, nextjs, app-router, server-component, server-action, hydration, vanilla-extract, motion, untitled-ui, react-aria, react-hook-form, zod, go, golang, gin, sqlc, pgx, postgres, golang-jwt, golangci-lint, debugging-workflow, implementation-patterns, browser-verification, kerkmeester, fullstack -->

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
- **Stack-specific (React/Next.js)**: `react`, `nextjs`, `next.js`, `app router`, `server component`, `client component`, `server action`, `hydration`, `vanilla-extract`, `vanilla extract`, `recipe`, `motion v12`, `untitled ui`, `untitledui`, `tinacms`, `sonner`, `next-themes`, `react aria`, `react-aria`, `embla`, `recharts`, `kerkmeester`
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

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Stack Detection (FIRST — gates all downstream resource loading)

Stack detection is explicit and ordered. **First match wins.** Webflow / vanilla animation web is checked first because such projects often carry `package.json` for build tooling but should NOT route to NODEJS.

```bash
# 1. WEBFLOW stack — Webflow / vanilla animation-library web

# 1a. Webflow-specific markers (high confidence)
[ -d "src/2_javascript" ] && STACK="WEBFLOW"
ls *.webflow.js 2>/dev/null | head -1 && STACK="WEBFLOW"
grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null && STACK="WEBFLOW"

# 1b. Vanilla animation / scroll / video library signals
#     (motion.dev, GSAP, Lenis, HLS.js, Swiper, FilePond — common in vanilla
#     web projects but rare in React/Next bundles which use framer-motion etc.)
grep -lqE "from ['\"]motion['\"]|motion\.dev|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
  src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null && STACK="WEBFLOW"

# 1c. Cloudflare R2 / Wrangler deploy (static-site CDN pattern)
[ -f "wrangler.toml" ] && STACK="WEBFLOW"

# 1d. Generic vanilla web layout — CSS + HTML present without framework deps
( [ -d "src/css" ] || [ -d "css" ] || [ -d "styles" ] ) && \
  ( ls *.html 2>/dev/null | head -1 >/dev/null || [ -d "src/html" ] || [ -d "html" ] ) && \
  ( [ ! -f "package.json" ] || ! grep -Eq '"(react|vue|svelte|next|nuxt|angular|solid|qwik)"' package.json 2>/dev/null ) && \
  STACK="WEBFLOW"

# 2. Backend Go
[ -f "go.mod" ] && STACK="GO"

# 3. React / Next.js
[ -f "next.config.js" -o -f "next.config.mjs" -o -f "next.config.ts" ] && STACK="REACT"
[ -f "package.json" ] && grep -Eq '"next"|"react"' package.json && STACK="REACT"

# 4. None matched (Node.js / React Native / Swift / other) → UNKNOWN
STACK="UNKNOWN"
```

**Routes:**
- `WEBFLOW` — full live content under `references/webflow/`, `assets/webflow/`, `scripts/`
- `REACT` — full live content under `references/react/`, `assets/react/` (modeled on kerkmeester.com: Next.js 14 App Router + vanilla-extract + motion v12 + Untitled UI + react-hook-form/zod + react-aria + Sonner + next-themes + optional TinaCMS). Pairs with `GO` via `references/router/cross_stack_pairing.md`.
- `GO` — full live content under `references/go/`, `assets/go/` (gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt). Pairs with `REACT` via the same cross-stack pairing doc.
- `UNKNOWN` — anything else (Node.js without React/Next, React Native, Swift, etc.) — disambiguation prompt; this skill does not own those stacks

For deep-reference reads on the detection precedence, multi-marker edge cases, and test cases: `references/router/stack_detection.md`.

### Phase Detection

```
TASK CONTEXT
    │
    ├─ STEP 0: Detect stack from marker files (gates resource loading + verification commands)
    ├─ STEP 1: Weighted intent scoring (top-2 when ambiguity delta is small)
    ├─ STEP 2: Select load level (MINIMAL | DEBUGGING | FOCUSED | STANDARD)
    │
    ├─ Phase 0: Research      → references/universal/multi_agent_research.md
    ├─ Phase 1: Implementation → references/<stack>/ implementation patterns
    ├─ Phase 1.5: Code Quality → assets/universal/checklists + assets/<stack>/checklists
    ├─ Phase 2: Debugging     → references/webflow/debugging/ (WEBFLOW only) OR references/universal/error_recovery.md
    └─ Phase 3: Verification  → stack verification commands + verification checklist
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and applies intent scoring. Layout:

```text
references/universal/                       stack-agnostic core (decision trees, severity models, research methodology)
references/webflow/{implementation,debugging,verification,deployment,performance,standards}/  LIVE
references/react/{implementation,debugging,verification,deployment,standards}/   LIVE (kerkmeester-style)
references/go/{implementation,debugging,verification,deployment,standards}/      LIVE (gin + sqlc + Postgres)
references/{nodejs,react-native,swift}/     placeholder skeletons + _placeholder.md pointers
references/router/{stack_detection,intent_classification,resource_loading,phase_lifecycle,cross_stack_pairing}.md  routing internals + React↔Go contract

assets/universal/{checklists,patterns}/     stack-agnostic checklists + JS validation/wait patterns
assets/webflow/{checklists,patterns,integrations}/  WEBFLOW live: code quality, performance loading, lenis, hls
assets/react/{checklists,patterns,integrations}/    REACT live: code quality, server-action / form / motion / vanilla-extract patterns, untitled-ui + tinacms integration
assets/go/{checklists,patterns}/                    GO live: code quality, gin handler / service / sqlc repo / jwt middleware / table-driven test patterns
assets/{nodejs,react-native,swift}/_placeholder.md  pointer files

scripts/{minify-webflow,verify-minification,test-minified-runtime}.mjs  WEBFLOW build utilities (CWD-relative; portable)
```

### Resource Loading Levels

| Level       | When to Load             | Resources                                  |
| ----------- | ------------------------ | ------------------------------------------ |
| MINIMAL     | Verification only        | Verification checklist + stack commands    |
| DEBUGGING   | Debugging route          | Debugging workflow + error recovery        |
| FOCUSED     | Single-intent task       | Domain-specific references                 |
| STANDARD    | Implementation default   | Stack standards + universal core           |

For deep-reference reads on TASK_SIGNALS scoring, MULTI_SYMPTOM_TERMS, intent ranking, and load-level mapping: `references/router/intent_classification.md` and `references/router/resource_loading.md`.

### Stack Verification Commands

```python
STACK_VERIFICATION_COMMANDS = {
    "WEBFLOW":      ["node scripts/minify-webflow.mjs",
                     "node scripts/verify-minification.mjs",
                     "node scripts/test-minified-runtime.mjs",
                     "browser test (mobile+desktop+console clean)"],
    "GO":           ["go test ./...", "golangci-lint run", "go build ./..."],
    "NODEJS":       ["npm test", "npx eslint .", "npm run build"],
    "REACT":        ["npm test", "npx eslint .", "npm run build"],
    "REACT_NATIVE": ["npm test", "npx eslint .", "npx expo export"],
    "SWIFT":        ["swift test", "swiftlint", "swift build"],
}
```

### Smart Router (algorithm summary)

`LIVE_STACKS = {"WEBFLOW", "REACT", "GO"}` and `PLACEHOLDER_STACKS = {"NODEJS", "REACT_NATIVE", "SWIFT"}`. Live stacks return full intent → file maps; placeholders return their pointer file.

**Algorithm at a glance:**

1. `detect_stack()` — first match wins among Webflow → Go → Swift → React-Native → React → NodeJS → UNKNOWN
2. `score_intents()` — sum keyword weights from `TASK_SIGNALS` (12 intent categories) + `NOISY_SYNONYMS` bonuses + phase boosts (verification +5, debugging +5, testing +4)
3. `select_intents()` — rank by score; pick top-N where N=2 normally, N=3 when 3+ multi-symptom terms hit
4. `select_load_level()` — map primary intent → MINIMAL / DEBUGGING / FOCUSED / STANDARD
5. `resource_map_for(stack)` — return intent → file paths (see live maps below; placeholders return `_placeholder.md`)
6. `route_code_resources()` — orchestrate the above; load `ALWAYS_LOAD` (universal core) + intent-specific resources + WEBFLOW-only on-demand keywords (lenis, hls, deep dive, full checklist) + per-stack placeholder pointers + `references/router/cross_stack_pairing.md` when REACT or GO API/auth intents fire

**Returns:** `{stack, verification_commands, intents, intent_scores, load_level, resources}`

#### `resource_map_for(REACT)` — kerkmeester-style Next.js 14

```python
"REACT": {
    "IMPLEMENTATION": ["references/react/implementation/implementation_workflows.md"],
    "CODE_QUALITY":   ["assets/react/checklists/code_quality_checklist.md",
                       "references/react/standards/code_style.md"],
    "DEBUGGING":      ["assets/react/checklists/debugging_checklist.md",
                       "references/react/debugging/debugging_workflows.md",
                       "references/react/debugging/hydration_errors.md"],
    "VERIFICATION":   ["assets/react/checklists/verification_checklist.md",
                       "references/react/verification/verification_workflows.md"],
    "ANIMATION":      ["references/react/implementation/motion_animation.md"],
    "FORMS":          ["references/react/implementation/forms_validation.md",
                       "assets/react/patterns/form_pattern.tsx"],
    "API":            ["references/react/implementation/api_integration.md",
                       "references/router/cross_stack_pairing.md",
                       "assets/react/patterns/api_call_pattern.ts"],
    "DEPLOYMENT":     ["references/react/deployment/vercel_deploy.md"],
    "TESTING":        ["assets/react/checklists/verification_checklist.md"],
}
```

#### `resource_map_for(GO)` — gin + sqlc + Postgres backend

```python
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
}
```

The full Python pseudocode (STACK_FOLDERS, TASK_SIGNALS keyword tables, NOISY_SYNONYMS, score_intents, select_intents, route_code_resources, etc.) is captured in `references/router/intent_classification.md` + `references/router/resource_loading.md`. Cross-stack pairing for REACT↔GO API / JWT / CORS contracts: `references/router/cross_stack_pairing.md`.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
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

1. **Condition-based waiting** — replace arbitrary timeouts with condition polling; include timeout limits with clear errors. Stack examples: WEBFLOW DOM ready / library load; GO context cancellation; SWIFT async/await.
2. **Defense-in-depth validation** — Layer 1: entry-point validation; Layer 2: processing validation; Layer 3: output validation; Layer 4: safe-access patterns.
3. **Stack-specific bootstrap** —
   - **WEBFLOW**: CDN version management, IntersectionObserver gates, snake_case naming, file headers
   - **GO**: DI configuration, microservice bootstrap, validator registration
   - **REACT**: Component architecture, state management, data fetching, hooks rules
   - **NODEJS**: Express middleware patterns, async patterns, service architecture
   - **REACT_NATIVE**: Expo patterns, navigation, native modules
   - **SWIFT**: MVVM, SwiftUI patterns, persistence

For stack-specific workflows: `references/<stack>/`. Live entry-point docs:
- WEBFLOW: `references/webflow/implementation/implementation_workflows.md`
- REACT: `references/react/implementation/implementation_workflows.md` (kerkmeester-style Next.js 14)
- GO: `references/go/implementation/implementation_workflows.md` (gin + sqlc + Postgres)
- Cross-stack contract (REACT↔GO API/JWT/CORS): `references/router/cross_stack_pairing.md`

Placeholder stacks (NODEJS / REACT_NATIVE / SWIFT): `_placeholder.md` (canonical content retired; populate locally as needed).

### Phase 1.5: Code Quality Gate

**Before claiming implementation is complete, validate code against style standards.**

1. Identify file type and stack — load the matching checklist
   - WEBFLOW JavaScript: `assets/webflow/checklists/code_quality_checklist.md` (Sections 2-7 P0 items: file headers, section organization, snake_case, no commented-out code, CDN-safe init)
   - WEBFLOW CSS: `assets/webflow/checklists/code_quality_checklist.md` (Section 8 P0 items: semantic custom property prefixes, attribute selectors with `i` flag, BEM naming, GPU-accelerated animations only)
   - REACT: `assets/react/checklists/code_quality_checklist.md` (P0: TypeScript strict, no `any`, named exports, vanilla-extract recipes, server/client boundary, zod boundaries, no console.log, no dangerouslySetInnerHTML with unsanitized data)
   - GO: `assets/go/checklists/code_quality_checklist.md` (P0: gofmt clean, golangci-lint clean, error wrapping with `%w`, context propagation, no naked goroutines)
   - Placeholder stacks (NODEJS / REACT_NATIVE / SWIFT): `assets/<stack>/_placeholder.md` (canonical checklists retired; populate locally as needed)

2. Validate items by severity — P0 (blocker), P1 (required), P2 (optional)
3. Universal severity model: `references/universal/code_quality_standards.md`
4. Formal review belongs to `sk-code-review` (this skill produces overlay compliance evidence, not findings-first output)

**Gate Rule**: If ANY P0 item fails, completion is BLOCKED until fixed.

### Phase 2: Debugging

**Systematic 4-phase framework**: Root Cause Investigation → Pattern Analysis → Hypothesis Testing → Implementation. Test one change at a time. If 3+ fixes fail → question approach.

**Stack-specific debugging tooling:**
- **WEBFLOW**: `references/webflow/debugging/debugging_workflows.md` (DevTools Console, network panel, performance profiler) + `mcp-chrome-devtools` skill
- **REACT**: `references/react/debugging/debugging_workflows.md` + `references/react/debugging/hydration_errors.md` (Server vs Client Component bugs, hydration mismatches, network inspection)
- **GO**: `references/go/debugging/debugging_workflows.md` + `references/go/debugging/pprof_profiling.md` (dlv, structured logs via slog, race detector, pprof)
- **Placeholder stacks** (NODEJS / REACT_NATIVE / SWIFT): `references/<stack>/_placeholder.md` (stack debugging conventions retired; populate locally as needed)

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
- **REACT**: `references/react/verification/verification_workflows.md` (npm run type-check / lint / build + browser smoke matrix)
- **GO**: `references/go/verification/verification_workflows.md` (`go test ./...` + `golangci-lint run` + `go build ./...` + `-race` for race detector)
- **Placeholder stacks**: `references/<stack>/_placeholder.md` (stack-specific testing strategy retired; populate locally as needed).

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
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

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

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
| GO | `go test ./...` exits 0; `golangci-lint run` clean; `go build ./...` succeeds |
| NODEJS | `npm test` exits 0; `npx eslint .` clean; `npm run build` succeeds |
| REACT | `npm test` exits 0; `npx eslint .` clean; `npm run build` succeeds |
| REACT_NATIVE | `npm test` exits 0; `npx eslint .` clean; `npx expo export` succeeds |
| SWIFT | `swift test` exits 0; `swiftlint` clean; `swift build` succeeds |

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:external-resources -->
## 6. EXTERNAL RESOURCES

### Official Documentation (by stack)

| Stack | Resource | URL |
| --- | --- | --- |
| WEBFLOW | MDN Web Docs | developer.mozilla.org |
| WEBFLOW | Webflow University | university.webflow.com |
| WEBFLOW | Motion.dev | motion.dev/docs |
| WEBFLOW | HLS.js | github.com/video-dev/hls.js |
| WEBFLOW | Lenis | lenis.darkroom.engineering |
| GO | Go documentation | go.dev/doc |
| NODEJS | Node.js docs | nodejs.org/docs |
| REACT | React docs | react.dev |
| REACT | Next.js docs | nextjs.org/docs |
| REACT_NATIVE | Expo docs | docs.expo.dev |
| SWIFT | Apple Developer | developer.apple.com/documentation |

### Testing & Debugging

| Stack | Resource | Use For |
| --- | --- | --- |
| WEBFLOW | Chrome DevTools | Browser debugging |
| WEBFLOW | Can I Use | Browser compatibility |
| GO | `go test`, `go vet`, `dlv` | Unit tests, static analysis, debugger |
| REACT | React DevTools, Vitest | Component inspection, unit tests |
| SWIFT | Xcode Instruments, XCTest | Profiling, unit tests |

---

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

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

**For implementation tasks:** Confirm stack via marker files (this skill auto-detects); load Phase 1 resources from `references/<stack>/` (live for WEBFLOW / REACT / GO; placeholder for NODEJS / REACT_NATIVE / SWIFT); cite `references/universal/` for stack-agnostic principles. For React↔Go fullstack work also load `references/router/cross_stack_pairing.md`.

**For debugging tasks:** Load `assets/universal/checklists/debugging_checklist.md`; live stacks also load their `references/<stack>/debugging/` content (WEBFLOW: + `mcp-chrome-devtools`; REACT: hydration / Server vs Client / network inspection; GO: dlv + slog + pprof); placeholder stacks follow `_placeholder.md` (stack debugging conventions retired; populate locally as needed).

**For verification tasks:** Load `assets/universal/checklists/verification_checklist.md`; run `STACK_VERIFICATION_COMMANDS[stack]`; for WEBFLOW also run browser matrix (mobile + desktop + console clean); only claim "done" when all commands exit 0 + checklist passes.

---

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:where-am-i-phase-detection -->
## 8. WHERE AM I? (Phase Detection)

| Phase | You're here if... | Exit criteria |
| --- | --- | --- |
| **0: Research** | Complex issue, unfamiliar codebase, performance audit | Constraints documented, plan ready |
| **1: Implementation** | Writing/modifying code | Code written, builds locally |
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing |
| **2: Debugging** | Code has bugs / failing tests / runtime errors | All tests passing, errors resolved |
| **3: Verification** | Tests pass, final validation before claim | All `STACK_VERIFICATION_COMMANDS` exit 0; for WEBFLOW, multi-viewport browser clean |

**Transitions:** 0→1 (plan ready) | 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found). Always end with Phase 3.

---

<!-- /ANCHOR:where-am-i-phase-detection -->
<!-- ANCHOR:quick-reference -->
## 9. QUICK REFERENCE

### Stack Detection (single command)

```bash
# Run from project root — first match wins
([ -d "src/2_javascript" ] || ls *.webflow.js 2>/dev/null | head -1 >/dev/null) && echo WEBFLOW \
  || ([ -f "wrangler.toml" ] && echo WEBFLOW) \
  || ([ -f "go.mod" ] && echo GO) \
  || ([ -f "Package.swift" ] && echo SWIFT) \
  || ([ -f "app.json" ] && grep -q expo app.json && echo REACT_NATIVE) \
  || ([ -f "package.json" ] && grep -Eq "react-native|expo" package.json && echo REACT_NATIVE) \
  || (ls next.config.* 2>/dev/null | head -1 >/dev/null && echo REACT) \
  || ([ -f "package.json" ] && grep -Eq '"next"|"react"' package.json && echo REACT) \
  || ([ -f "package.json" ] && echo NODEJS) \
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

# GO
go test ./... && golangci-lint run && go build ./...
# NODEJS / REACT
npm test && npx eslint . && npm run build
# REACT_NATIVE
npm test && npx eslint . && npx expo export
# SWIFT
swift test && swiftlint && swift build
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

For routing trace examples and full pseudocode invocation: `references/router/main_router.md`.

<!-- /ANCHOR:quick-reference -->
