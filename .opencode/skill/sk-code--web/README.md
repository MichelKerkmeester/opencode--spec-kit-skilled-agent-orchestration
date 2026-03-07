---
title: "Code Workflows - Web Development Orchestrator"
description: "Orchestrator guiding developers through implementation, debugging, and verification phases for web development projects (Webflow, vanilla JS)"
trigger_phrases:
  - "web development workflow"
  - "webflow code orchestrator"
  - "frontend implementation debugging verification"
---

# Code Workflows - Web Development Orchestrator

> Orchestrator guiding developers through implementation, debugging, and verification phases for web development projects (Webflow, vanilla JS).

---

#### TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [STRUCTURE](#3--structure)
4. [FEATURES](#4--features)
5. [CONFIGURATION](#5--configuration)
6. [EXAMPLES](#6--examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [RELATED](#8--related)
9. [CHANGELOG](#9--changelog)

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This skill provides unified workflow guidance across specialized code quality domains for frontend development. It enforces a mandatory development lifecycle: Research (optional) -> Implementation -> Code Quality Gate -> Debugging (if needed) -> Verification (MANDATORY).

The core principle is that no completion claim ("works", "fixed", "done") is valid without fresh browser verification evidence. The skill routes to domain-specific references based on task keywords, loading resources at multiple levels from always-loaded to on-demand (see Configuration for details).

For formal findings-first code review output, pair this skill with `sk-code--review` (baseline severity + risk reporting). This skill remains the web-specific overlay.

It covers the full frontend development spectrum including async handling, form validation, animation workflows, CSS architecture, accessibility, performance optimization, CDN deployment and minification. All of this operates within a Webflow-centric development context.

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

This skill activates automatically via Gate 2 skill routing when frontend development tasks are detected.

**Manual invocation:**
```
skill_advisor.py "implement form validation" --threshold 0.8
```

**Keyword triggers:**
- Implementation: `implement`, `build`, `create`, `async`, `validation`, `webflow`, `animation`
- Performance: `interaction`, `first interaction`, `defer`, `deferred loading`, `pagespeed`, `lighthouse`, `tbt`, `inp`, `main thread`, `long tasks`
- Debugging: `debug`, `fix`, `error`, `not working`, `broken`, `bug`
- Verification: `done`, `complete`, `works`, `fixed`, `verify`

**Lifecycle flow:**
```
Phase 0: Research (optional) -> Phase 1: Implementation -> Phase 1.5: Code Quality Gate
    -> Phase 2: Debugging (if needed) -> Phase 3: Verification (MANDATORY)
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
.opencode/skill/sk-code--web/
├── SKILL.md                          # Entry point with routing logic
├── README.md                         # This file
├── changelog/
│   └── CHANGELOG.md                  # Canonical release history
├── references/
│   ├── implementation/
│   │   ├── implementation_workflows.md   # Async waiting, validation, CDN versioning
│   │   ├── animation_workflows.md        # CSS vs Motion.dev, scroll triggers
│   │   ├── css_patterns.md               # Custom properties, responsive patterns
│   │   ├── swiper_patterns.md            # Carousel/slider integration
│   │   ├── focus_management.md           # Keyboard navigation, a11y
│   │   ├── webflow_patterns.md           # Platform limits, collection lists
│   │   ├── security_patterns.md          # XSS, CSRF, injection prevention
│   │   ├── performance_patterns.md       # Throttle, debounce, RAF
│   │   ├── observer_patterns.md          # MutationObserver, IntersectionObserver
│   │   ├── async_patterns.md             # RAF, requestIdleCallback, scheduling
│   │   └── third_party_integrations.md   # External libraries, CDN loading
│   ├── debugging/
│   │   ├── debugging_workflows.md        # Systematic debugging, root cause tracing
│   │   └── error_recovery.md             # CDN, minification, version recovery
│   ├── verification/
│   │   ├── verification_workflows.md     # Browser testing requirements
│   │   └── performance_checklist.md      # Before/after verification
│   ├── deployment/
│   │   ├── minification_guide.md         # Terser, AST verification
│   │   └── cdn_deployment.md             # Cloudflare R2, versioning
│   ├── performance/
│   │   ├── cwv_remediation.md            # Core Web Vitals patterns
│   │   ├── interaction_gated_loading.md  # Interaction, viewport, idle gate playbook
│   │   ├── resource_loading.md           # Preconnect, preload, async
│   │   ├── webflow_constraints.md        # Platform limitations
│   │   └── third_party.md               # GTM, analytics optimization
│   ├── research/
│   │   └── multi_agent_patterns.md       # Multi-agent research methodology
│   └── standards/
│       ├── code_quality_standards.md     # Initialization, validation, async
│       ├── code_style_guide.md           # Naming, formatting, comments
│       ├── code_style_enforcement.md     # Remediation instructions
│       ├── shared_patterns.md            # Common patterns across workflows
│       └── quick_reference.md            # One-page cheat sheet
├── assets/
│   ├── checklists/
│   │   ├── code_quality_checklist.md     # P0/P1/P2 quality gate items
│   │   ├── debugging_checklist.md        # Step-by-step debug workflow
│   │   ├── performance_loading_checklist.md # TBT/INP/Lighthouse verification
│   │   └── verification_checklist.md     # Mandatory verification steps
│   ├── patterns/
│   │   ├── interaction_gate_patterns.js  # Load-once, interaction, viewport, idle helpers
│   │   ├── wait_patterns.js              # Condition-based waiting
│   │   ├── validation_patterns.js        # Defense-in-depth validation
│   │   └── performance_patterns.js       # Throttle, debounce, RAF
│   └── integrations/
│       ├── lenis_patterns.js             # Smooth scroll patterns
│       └── hls_patterns.js               # HLS.js video patterns
└── scripts/
    ├── minify-webflow.mjs                # Batch JS minification
    ├── verify-minification.mjs           # AST verification
    └── test-minified-runtime.mjs         # Runtime testing
```

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

- **Smart routing:** Keyword-based resource loading at multiple levels (ALWAYS, CONDITIONAL, ON_DEMAND)
- **5-stage lifecycle:** Research, Implementation, Code Quality Gate, Debugging and Verification
- **Code quality gate:** P0/P1/P2 priority enforcement for JavaScript and CSS standards
- **Browser verification:** Mandatory multi-viewport testing (375px, 991px, 1920px) before completion claims
- **Domain coverage:** Animation, forms, video, accessibility, performance, observers, CSS architecture
- **Interaction-gated loading:** First-interaction, viewport, and idle fallback patterns for deferred startup
- **Deployment pipeline:** Minification (Terser), AST verification, CDN deployment (Cloudflare R2)
- **Performance targets:** FCP < 1.8s, LCP < 2.5s, CLS < 0.1, 60fps animations, 0 console errors
- **Timing constants:** Validated defaults: 64ms pointer throttle, 180ms validation debounce, 200ms resize debounce
- **Multi-agent research:** Parallel analysis methodology for complex performance audits
- **Review baseline alignment:** delegate formal severity/findings contract to `sk-code--review`

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

**Version:** 1.1.0.0

**Allowed tools:** Bash, Edit, Glob, Grep, Read, Task, Write

**Resource loading levels:**

| Level       | Behavior                         | Example                        |
| ----------- | -------------------------------- | ------------------------------ |
| ALWAYS      | Loaded every phase invocation    | `implementation_workflows.md`  |
| CONDITIONAL | Loaded when keywords match       | `animation_workflows.md`       |
| ON_DEMAND   | Loaded on explicit request only  | `performance_patterns.md`      |

**Code quality thresholds:**
- P0 violations: HARD BLOCK. Must fix before proceeding.
- P1 violations: Fix or document approved deferral
- P2 violations: Can defer with documented reason

**Browser testing matrix:**
- Minimum (always): Chrome Desktop 1920px, Mobile 375px, Console clean
- Standard (production): Add Tablet 991px emulation

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Common minification workflow:**
```bash
node .opencode/skill/sk-code--web/scripts/minify-webflow.mjs
node .opencode/skill/sk-code--web/scripts/verify-minification.mjs
node .opencode/skill/sk-code--web/scripts/test-minified-runtime.mjs
```

**CDN deployment after minification:**
```bash
wrangler r2 object put project-cdn/js/file.min.js \
  --file src/javascript/z_minified/file.min.js
```

**Phase detection: where am I?**

| Phase               | You're here if...                    | Exit criteria              |
| ------------------- | ------------------------------------ | -------------------------- |
| 0: Research         | Complex issue, unfamiliar codebase   | Plan ready                 |
| 1: Implementation   | Writing/modifying code               | Code written, builds       |
| 1.5: Code Quality   | Running checklist after implementation | All P0 items passing     |
| 2: Debugging        | Code has bugs/failing tests          | All tests passing          |
| 3: Verification     | Final validation                     | Verified in browser        |

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue                                  | Resolution                                          |
| -------------------------------------- | --------------------------------------------------- |
| Skill not activating                   | Check Gate 2 routing via `skill_advisor.py`         |
| P0 violation unclear                   | Load `code_style_enforcement.md` for remediation    |
| Minification fails                     | See `error_recovery.md` for recovery procedures     |
| CDN version mismatch                   | Grep HTML files for `v=` and increment manually     |
| Console errors persist after fix       | Test across all viewports. Some errors are viewport-specific. |
| 3+ debugging attempts failed           | Escalate via `/spec_kit:debug` for fresh perspective |

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

| Resource                        | Relationship                                      |
| ------------------------------- | ------------------------------------------------- |
| `sk-code--review`        | Findings-first review baseline and severity model  |
| `mcp-chrome-devtools`     | Browser debugging companion (CLI-first via bdg)   |
| `sk-doc`       | Documentation quality, skill creation             |
| `sk-git`                 | Git workflows, commit hygiene, PR creation        |
| `system-spec-kit`               | Spec folder management, memory, context           |
| `sk-code--full-stack`    | Multi-stack variant (Go, Node, React, Swift)      |
| `AGENTS.md`                     | Parent behavioral framework                       |

<!-- /ANCHOR:related -->

---

## 9. CHANGELOG
<!-- ANCHOR:changelog -->

Canonical changelog: `changelog/CHANGELOG.md`

Latest release: `1.1.0.0` on `2026-03-07`
- Expanded PERFORMANCE routing vocabulary for interaction-gated loading, Lighthouse/PageSpeed, TBT, INP, and main-thread prompts.
- Added `interaction_gated_loading.md`, `interaction_gate_patterns.js`, and `performance_loading_checklist.md`.
- Aligned the new checklist and pattern assets with the `sk-doc` asset-template conventions.

<!-- /ANCHOR:changelog -->
