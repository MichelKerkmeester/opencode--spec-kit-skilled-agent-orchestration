---
title: "sk-code-web: Frontend Development Orchestrator"
description: "Unified workflow guidance for frontend development across implementation, debugging, and verification phases, with code quality gates, performance optimization, and CDN deployment for Webflow and vanilla JS projects."
trigger_phrases:
  - implement
  - build
  - create
  - webflow
  - animation
  - debug
  - fix
  - error
  - not working
  - broken
  - done
  - complete
  - works
  - fixed
  - verify
  - performance
  - pagespeed
  - lighthouse
  - tbt
  - inp
  - deferred loading
  - cdn
  - minify
---

# sk-code-web

> Frontend development orchestrator that guides implementation, debugging, and mandatory browser verification through a structured lifecycle with quality gates at every phase.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`sk-code-web` is the frontend development orchestrator for the `sk-code` skill family. It covers the full lifecycle of frontend work from pre-implementation research through code quality gating, debugging, and mandatory browser verification. The skill operates on a strict principle: no completion claim ("works", "fixed", "done") is valid without fresh browser verification evidence from an actual browser session.

The skill routes to domain-specific reference files using weighted keyword scoring. Implementation tasks load async handling and validation workflows. Debugging tasks load root-cause tracing workflows and the DevTools checklist. Performance tasks load Core Web Vitals remediation, interaction-gated loading patterns, and resource loading references. Verification tasks load the browser testing matrix and multi-viewport requirements. This scoped loading keeps each invocation focused rather than pulling the entire reference library.

For spec-driven frontend work, resume context through `/spec_kit:resume` and the canonical packet chain `handover.md` -> `_memory.continuity` -> spec docs. Generated memory artifacts support retrieval, but they do not replace the packet docs as continuity source-of-truth.

For formal code review output with severity-ranked findings, `sk-code-web` acts as the web overlay for `sk-code-review`. The baseline skill owns the severity model (P0/P1/P2), the output contract, and the security minimums. This skill owns the frontend-specific quality gate, browser verification evidence, and implementation standards for JavaScript and CSS.

### Key Statistics

| Attribute           | Value                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| Version             | 1.1.0.0                                                                |
| Allowed tools       | Bash, Edit, Glob, Grep, Read, Task, Write                              |
| Development phases  | 5 (Research, Implementation, Code Quality Gate, Debugging, Verification) |
| Reference domains   | 7 (implementation, debugging, verification, standards, performance, deployment, research) |
| Asset types         | Checklists, patterns, integrations, scripts                            |
| Performance targets | FCP < 1.8s, LCP < 2.5s, TTI < 3.8s, CLS < 0.1, 60fps, 0 console errors |

### How This Compares

| Skill                   | Role                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `sk-code-web`          | Frontend implementation, debugging, and verification        |
| `sk-code-review`       | Formal findings-first review baseline and severity model    |
| `sk-code-opencode`     | OpenCode system code overlay (JS, TS, Python, Shell)        |
| `sk-code-full-stack`   | General multi-stack overlay for backend and mixed codebases |

### Key Features

| Feature                         | Description                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------- |
| 5-phase development lifecycle   | Research, Implementation, Code Quality Gate, Debugging, Verification            |
| Mandatory browser verification  | No completion claim valid without actual browser evidence                       |
| Code quality gate (Phase 1.5)   | P0/P1/P2 enforcement for JavaScript and CSS before any completion claim         |
| Weighted keyword routing        | Loads domain-specific references based on task signal scoring                   |
| Performance optimization        | CWV remediation, interaction-gated loading, Core Web Vitals targets             |
| CDN deployment pipeline         | Minification (Terser), AST verification, Cloudflare R2 deployment               |
| Validated timing constants      | 64ms pointer throttle, 180ms validation debounce, 200ms resize debounce         |
| Multi-agent research methodology| Parallel 10-agent analysis for complex performance audits                       |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

1. **Activate the skill.** Gate 2 routes to `sk-code-web` automatically when implementation, debugging, verification, or performance keywords appear in the request. To invoke manually: `Read(".opencode/skill/sk-code-web/SKILL.md")`.

2. **Identify your phase.** Ask: am I writing code (Phase 1), running the quality checklist (Phase 1.5), fixing a bug (Phase 2), or verifying in a browser (Phase 3)? Phase 0 (research) applies to complex performance issues or unfamiliar codebases before any code is written.

3. **Load the right reference.** The skill's routing logic selects references automatically based on your task. For implementation, the always-loaded resource is `references/implementation/implementation_workflows.md`. For debugging, `assets/checklists/debugging_checklist.md` loads first. For performance, the PERFORMANCE intent group loads CWV remediation, interaction-gated loading, and resource loading references.

4. **Follow the Iron Law.** Before claiming completion, open an actual browser, test at mobile (375px) and desktop (1920px), check the DevTools console for errors, and record what you tested. The skill blocks any completion claim that lacks browser verification evidence.

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:features -->
## 3. FEATURES

---

### 3.1 FEATURE HIGHLIGHTS

The five-phase lifecycle is the organizing structure of this skill. Phases flow in order: Research (optional) to Implementation to Code Quality Gate to Debugging (if issues arise) to Verification (always mandatory). Each phase has a defined entry condition, exit criteria, and checklist. A phase cannot be skipped to reach Verification. The Code Quality Gate (Phase 1.5) sits between implementation and debugging precisely because it catches standards violations before they compound into harder-to-trace bugs.

The Code Quality Gate enforces distinct rule sets for JavaScript and CSS. JavaScript P0 items include file header format with box-drawing characters, IIFE and section organization, no commented-out code, snake_case naming, and CDN-safe initialization patterns. CSS P0 items include semantic custom property prefixes, case-insensitivity flags on data attribute selectors, BEM naming, and GPU-accelerated-only animation properties (transform, opacity, scale). A P0 violation blocks all progression. P1 violations require either a fix or a documented deferral. P2 violations can be deferred with a reason.

Condition-based waiting replaces arbitrary setTimeout calls throughout the implementation phase. Rather than waiting for a fixed number of milliseconds and hoping the target condition is true, the skill's patterns poll for actual conditions with timeout limits and clear error messages. This applies to DOM readiness, library loading, image and video readiness, and animation completion. The wait patterns are available as reusable JavaScript files in `assets/patterns/wait_patterns.js`.

Interaction-gated loading defers non-critical resources until after the first user interaction, viewport entry, or browser idle time. This pattern directly addresses Total Blocking Time (TBT) and Interaction to Next Paint (INP) by moving startup work out of the critical path. The skill includes a complete playbook in `references/performance/interaction_gated_loading.md` and reusable gate patterns in `assets/patterns/interaction_gate_patterns.js`.

The browser verification phase enforces a specific sequence before any completion claim. The minimum matrix requires Chrome desktop at 1920px, mobile emulation at 375px, and a clean DevTools console. Production work adds tablet emulation at 991px. Lighthouse runs three times in Incognito with mobile emulation, using median scores. The verification checklist in `assets/checklists/verification_checklist.md` lists every required step.

### 3.2 FEATURE REFERENCE

**Development Phases**

| Phase               | Trigger                                        | Exit Criteria                                      |
| ------------------- | ---------------------------------------------- | -------------------------------------------------- |
| 0: Research         | Complex performance issues, unfamiliar codebase | Constraints documented, implementation plan ready |
| 1: Implementation   | Writing or modifying code                      | Code written and builds without errors             |
| 1.5: Code Quality   | Implementation done                            | All P0 items passing for applicable file types     |
| 2: Debugging        | Console errors or unexpected behavior          | Root cause documented, fix at source               |
| 3: Verification     | Before any "done", "works", or "fixed" claim   | Browser tested, multi-viewport, console clean      |

**Code Quality Gate: P0 Items by File Type**

| File Type  | P0 Requirement                                                         |
| ---------- | ---------------------------------------------------------------------- |
| JavaScript | File header with box-drawing characters (three-line format)            |
| JavaScript | Section organization with IIFE and numbered headers                    |
| JavaScript | No commented-out code (delete it, do not annotate)                     |
| JavaScript | snake_case for all variable and function names                         |
| JavaScript | CDN-safe initialization pattern                                        |
| CSS        | Custom property names with semantic prefixes (--font-*, --vw-*, etc.)  |
| CSS        | Attribute selectors include case-insensitivity flag `i`                |
| CSS        | BEM naming convention (.block--element, .block-modifier)               |
| CSS        | Animate only GPU-accelerated properties (transform, opacity, scale)    |

**Performance Targets**

| Metric | Target  | Measurement Tool |
| ------ | ------- | ---------------- |
| FCP    | < 1.8s  | Lighthouse       |
| LCP    | < 2.5s  | Lighthouse       |
| TTI    | < 3.8s  | Lighthouse       |
| CLS    | < 0.1   | Lighthouse       |
| FPS    | 60fps   | DevTools         |
| Errors | 0       | Console          |

**Browser Testing Matrix**

| Level    | Viewports Required                         | Applies To       |
| -------- | ------------------------------------------ | ---------------- |
| Minimum  | Chrome 1920px desktop, Chrome 375px mobile, console clean | All work |
| Standard | Add Chrome 991px tablet emulation          | Production work  |

**Intent Scoring: Top Signals**

| Intent        | Key Trigger Keywords                                                 |
| ------------- | -------------------------------------------------------------------- |
| VERIFICATION  | verify, done, complete, works                                        |
| DEBUGGING     | bug, fix, error, broken                                              |
| PERFORMANCE   | performance, core web vitals, tbt, inp, pagespeed, deferred loading  |
| IMPLEMENTATION| implement, build, create, feature                                    |
| ANIMATION     | animation, gsap, lenis, swiper                                       |
| DEPLOYMENT    | deploy, minify, cdn, r2                                              |

---

<!-- /ANCHOR:features -->

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
.opencode/skill/sk-code-web/
├── SKILL.md                              # Entry point with routing logic and phase rules
├── README.md                             # This file
├── changelog/
│   └── CHANGELOG.md                      # Canonical release history
├── references/
│   ├── implementation/
│   │   ├── implementation_workflows.md   # Condition-based waiting, validation, CDN versioning
│   │   ├── animation_workflows.md        # CSS vs Motion.dev, scroll triggers, GSAP patterns
│   │   ├── async_patterns.md             # RAF, requestIdleCallback, async scheduling
│   │   ├── css_patterns.md               # Custom properties, responsive patterns
│   │   ├── focus_management.md           # Keyboard navigation, accessibility
│   │   ├── form_upload_workflows.md      # Form validation, file uploads
│   │   ├── observer_patterns.md          # IntersectionObserver, MutationObserver, SharedObservers
│   │   ├── performance_patterns.md       # Throttle, debounce, RAF patterns
│   │   ├── security_patterns.md          # XSS, CSRF, injection prevention
│   │   ├── swiper_patterns.md            # Carousel and slider integration
│   │   ├── third_party_integrations.md   # External libraries, CDN loading
│   │   └── webflow_patterns.md           # Platform limitations, collection lists
│   ├── debugging/
│   │   ├── debugging_workflows.md        # 4-phase systematic debugging, root cause tracing
│   │   └── error_recovery.md             # CDN, minification, and version mismatch recovery
│   ├── verification/
│   │   ├── verification_workflows.md     # Browser testing matrix and completion requirements
│   │   └── performance_checklist.md      # Before and after verification checklist
│   ├── deployment/
│   │   ├── minification_guide.md         # Terser configuration, AST verification
│   │   └── cdn_deployment.md             # Cloudflare R2 upload and versioning
│   ├── performance/
│   │   ├── cwv_remediation.md            # Core Web Vitals patterns and fixes
│   │   ├── interaction_gated_loading.md  # First-interaction, viewport, and idle gate playbook
│   │   ├── resource_loading.md           # Preconnect, preload, async resource strategies
│   │   ├── third_party.md               # GTM, analytics, and third-party optimization
│   │   └── webflow_constraints.md        # Platform-specific performance limitations
│   ├── research/
│   │   └── multi_agent_patterns.md       # 10-agent parallel analysis methodology
│   └── standards/
│       ├── code_quality_standards.md     # Initialization, validation, async standards
│       ├── code_style_enforcement.md     # Remediation instructions for P0/P1/P2 violations
│       ├── code_style_guide.md           # Naming conventions, formatting, comments
│       ├── quick_reference.md            # One-page cheat sheet for all standards
│       └── shared_patterns.md            # Common patterns across all workflows
├── assets/
│   ├── checklists/
│   │   ├── code_quality_checklist.md     # P0/P1/P2 quality gate items for JS and CSS
│   │   ├── debugging_checklist.md        # Step-by-step debugging workflow checklist
│   │   ├── performance_loading_checklist.md  # TBT, INP, and Lighthouse verification
│   │   └── verification_checklist.md     # Mandatory browser verification steps
│   ├── patterns/
│   │   ├── interaction_gate_patterns.js  # Load-once, interaction, viewport, idle helpers
│   │   ├── performance_patterns.js       # Throttle, debounce, RAF implementations
│   │   ├── validation_patterns.js        # Defense-in-depth validation helpers
│   │   └── wait_patterns.js              # Condition-based waiting with timeout limits
│   └── integrations/
│       ├── hls_patterns.js               # HLS.js video streaming patterns
│       └── lenis_patterns.js             # Lenis smooth scroll patterns
└── scripts/
    ├── minify-webflow.mjs                # Batch JS minification with Terser
    ├── test-minified-runtime.mjs         # Runtime testing for minified output
    └── verify-minification.mjs           # AST verification for minified files
```

---

<!-- /ANCHOR:structure -->

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

**Resource loading levels** control which references load for a given task. The always-loaded resource is `references/implementation/implementation_workflows.md`. Conditional resources load when intent scoring matches. On-demand resources load only when "deep dive", "full checklist", or "full performance plan" keywords appear.

**Code quality violation thresholds:**

| Priority | Behavior                                                       |
| -------- | -------------------------------------------------------------- |
| P0       | Hard block. Must fix before claiming implementation complete   |
| P1       | Fix or document an approved deferral with a reason             |
| P2       | Can defer with a documented reason                             |

**Browser testing minimums** apply to every piece of work. Chrome desktop at 1920px and mobile emulation at 375px with a clean DevTools console are non-negotiable. Production work adds tablet emulation at 991px.

**Validated timing constants** apply to all event handling code. Use 64ms for pointer event throttling, 180ms for input validation debouncing, 200ms for resize debouncing, and 0.1 as the IntersectionObserver visibility threshold for animation control. Do not invent new timing values without documenting the reason.

**Webflow context** is the primary platform target for this skill. The skill includes specific references for Webflow collection lists, CMS limitations, attribute selectors, and platform-generated code constraints that must not be modified.

---

<!-- /ANCHOR:configuration -->

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: CDN minification and deployment workflow**

```bash
# After modifying JavaScript source files:

# Step 1: Minify all JS files with Terser
node .opencode/skill/sk-code-web/scripts/minify-webflow.mjs

# Step 2: Verify minified output via AST analysis
node .opencode/skill/sk-code-web/scripts/verify-minification.mjs

# Step 3: Run runtime tests against minified files
node .opencode/skill/sk-code-web/scripts/test-minified-runtime.mjs

# Step 4: Deploy to Cloudflare R2 CDN
wrangler r2 object put project-cdn/js/file.min.js \
  --file src/javascript/z_minified/file.min.js

# Step 5: Update CDN version parameter in HTML
# Pattern: src="https://cdn.example.com/js/file.js?v=X.Y.Z"
# Increment Z for patches, Y for features, X for breaking changes
```

**Example 2: Phase detection for an active debugging session**

```bash
# Determine which phase applies before taking action:

# Phase 1.5 check: has the code quality gate run?
# Load assets/checklists/code_quality_checklist.md
# Verify all P0 items for the file type (JS: sections 2-7, CSS: section 8)

# Phase 2 check: are there console errors?
# Open DevTools before attempting any fix
# Read complete stack traces before changing code
# Test one change at a time

# Phase 3 check: is this a completion claim?
# Open actual browser (not just code inspection)
# Test Chrome 1920px desktop + Chrome 375px mobile emulation
# Confirm DevTools console shows zero errors at both viewports
```

**Example 3: Performance audit using the 10-agent research methodology**

```
Complex performance issue: TBT is 800ms on mobile, LCP is 4.2s.

# Dispatch parallel research agents:
# Agent 1: HTML loading strategy and script placement
# Agent 2: JavaScript bundle inventory (size, parse time)
# Agent 3: Third-party scripts (GTM, analytics, chat widgets)
# Agent 4: CSS blocking resources
# Agent 5: LCP image identification and optimization
# Agent 6: Above-fold critical resource analysis
# Agent 7: Animation library initialization (GSAP, Lenis)
# Agent 8: Custom initialization patterns and DOMContentLoaded handlers
# Agent 9: External CDN libraries and load order
# Agent 10: Network waterfall from PageSpeed Insights

# Synthesize findings into a prioritized remediation plan.
# Reference: references/research/multi_agent_patterns.md
```

---

<!-- /ANCHOR:usage-examples -->

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**What you see:** Skill not activating via Gate 2 routing.
**Common causes:** The task description did not contain enough keyword signals for the router to score above the threshold.
**Fix:** Run `python3 .opencode/skill/scripts/skill_advisor.py "your task description" --threshold 0.8` to check the routing score. Add explicit keywords (implement, debug, verify, performance) to your request, or invoke the skill directly with `Read(".opencode/skill/sk-code-web/SKILL.md")`.

---

**What you see:** P0 code quality violation is unclear and you do not know how to fix it.
**Common causes:** The error message references a rule ID but does not explain the remediation.
**Fix:** Load `references/standards/code_style_enforcement.md`. This file contains remediation instructions for every P0 and P1 item in the code quality checklist, organized by file type and rule.

---

**What you see:** Minification script fails with a parse error.
**Common causes:** Source JavaScript contains a syntax error that Terser cannot parse. This sometimes surfaces during minification even when the browser runs the source file without errors.
**Fix:** See `references/debugging/error_recovery.md` for CDN, minification, and version mismatch recovery procedures. Fix the syntax error in the source file before re-running the minification script.

---

**What you see:** Console errors persist after a fix, but only at one viewport size.
**Common causes:** The fix was tested at desktop only. Some errors are viewport-specific, particularly those related to element visibility, IntersectionObserver thresholds, or touch event handlers.
**Fix:** Test at all three viewports (375px, 991px, 1920px) with DevTools open at each. Record the console state at each viewport. Fix the root cause at the source, not the symptom.

---

**What you see:** Three or more debugging attempts have not resolved the bug.
**Common causes:** The approach is targeting a symptom rather than the root cause, or the root cause is in a third-party library or Webflow-generated code.
**Fix:** Stop making changes. Escalate via `/spec_kit:debug` to get a fresh perspective. Provide the full DevTools console output, the stack trace, and a description of all three failed attempts. If the root cause is in Webflow-generated code, escalate immediately since that code cannot be modified.

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why is browser verification mandatory even for small changes?**

A: Small changes cause large failures more often than expected in frontend code. A one-line event handler change can break mobile scroll. A CSS variable rename can cause layout shifts at specific breakpoints. Code inspection cannot surface these because browsers apply platform-specific rendering, touch handling, and font metrics that do not exist in the source files. The verification phase exists because the browser is the ground truth, not the code.

**Q: Can I skip Phase 1.5 (Code Quality Gate) for a quick hotfix?**

A: No. P0 violations in a hotfix become the next bug. The gate exists to prevent violations from accumulating. The checklist is not long for a simple change: if you modified one JavaScript file, check the five P0 items for JavaScript. It takes less than two minutes. Document any P1/P2 deferrals with a reason so they do not disappear.

**Q: When should I use the 10-agent research methodology instead of just implementing a fix?**

A: Use it when you have a performance problem with multiple contributing factors and no clear single root cause. A TBT above 500ms or an LCP above 3s on mobile almost always has three or more contributing causes. Fixing one without understanding the others produces temporary improvement. The 10-agent methodology maps the full picture before any code changes. Skip it for isolated bugs with a clear stack trace.

**Q: How do I handle a bug that only reproduces in production?**

A: This is an explicit escalation condition. Production-only bugs require real device testing, network condition simulation, or access to production error monitoring that is not available during local debugging. Escalate immediately rather than making speculative changes. Document the reproduction conditions precisely (device, browser, network, user action sequence) before escalating.

---

<!-- /ANCHOR:faq -->

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource                                                                                           | Purpose                                                             |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [SKILL.md](./SKILL.md)                                                                             | Full skill definition with routing logic and phase rules            |
| [references/implementation/implementation_workflows.md](./references/implementation/implementation_workflows.md) | Condition-based waiting, validation, CDN versioning |
| [references/debugging/debugging_workflows.md](./references/debugging/debugging_workflows.md)       | 4-phase systematic debugging and root cause tracing                 |
| [references/verification/verification_workflows.md](./references/verification/verification_workflows.md) | Browser testing matrix and completion requirements           |
| [references/performance/interaction_gated_loading.md](./references/performance/interaction_gated_loading.md) | Interaction-gated loading playbook for TBT and INP         |
| [references/standards/code_style_enforcement.md](./references/standards/code_style_enforcement.md) | Remediation instructions for P0/P1/P2 violations                   |
| [assets/checklists/code_quality_checklist.md](./assets/checklists/code_quality_checklist.md)       | P0/P1/P2 quality gate items for JavaScript and CSS                  |
| [assets/checklists/verification_checklist.md](./assets/checklists/verification_checklist.md)       | Mandatory browser verification steps                                |
| [changelog/CHANGELOG.md](./changelog/CHANGELOG.md)                                                 | Canonical release history                                           |
| [sk-code-review SKILL.md](../sk-code-review/SKILL.md)                                            | Findings-first review baseline and severity model                   |
| [sk-code-full-stack SKILL.md](../sk-code-full-stack/SKILL.md)                                    | Multi-stack overlay for backend and mixed codebases                 |

---

<!-- /ANCHOR:related-documents -->
