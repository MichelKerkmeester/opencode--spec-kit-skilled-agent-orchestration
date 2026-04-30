---
title: Router Reference — Resource Loading
description: Load levels (ALWAYS / CONDITIONAL / ON_DEMAND) and per-stack resource resolution that runs after stack detection and intent classification.
---

# Router Reference — Resource Loading

Load-level mapping and per-stack `RESOURCE_MAPS` resolution that turns a (stack, intents) pair into the concrete file paths the smart router loads.

---

## 1. OVERVIEW

### Purpose

Documents the third stage of the smart router: after `detect_stack()` and `select_intents()` decide which stack and which intents fired, `route_code_resources()` resolves the actual file paths to load. This file captures the load-level model and the per-stack `RESOURCE_MAPS` shape so operators can debug "why did the router load this file?" decisions.

### Core Principle

Three load tiers — ALWAYS (universal core), CONDITIONAL (per-stack intent maps), ON_DEMAND (keyword-triggered extras) — keep the routed resource set tight while ensuring the universal severity model and error-recovery decision tree are always present.

### When to Use

- An advisor result loaded the wrong file set and you need to trace which tier fired which path.
- You are adding a new intent and need to know where to register its `RESOURCE_MAPS` entry.
- You are debugging an UNKNOWN-stack disambiguation surface.
- You want to confirm the `STACK_VERIFICATION_COMMANDS` for a stack.

### Key Sources

- Authoritative pseudocode: `SKILL.md` §2 SMART ROUTING (`RESOURCE_MAPS`, `LOADING_LEVELS`, `route_code_resources`).
- Companion router refs: `stack_detection.md`, `intent_classification.md`.

---

## 2. LOAD LEVELS

| Level       | When selected                                                                          | Resources                                                       |
| ----------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| ALWAYS      | Every skill invocation                                                                 | Universal core (severity model + error recovery)                |
| CONDITIONAL | Top-1 / top-2 intents (`select_intents`) match an entry in `RESOURCE_MAPS[stack]`        | Per-stack intent → file maps                                    |
| ON_DEMAND   | Task text contains an `ON_DEMAND_KEYWORDS` trigger                                     | Extended checklists, cross-stack pairing, vendor-specific guides |

```python
LOADING_LEVELS = {
    "ALWAYS": [
        "references/universal/code_quality_standards.md",
        "references/universal/error_recovery.md",
    ],
    "ON_DEMAND_KEYWORDS": [
        "full checklist", "deep dive", "browser matrix", "full performance plan",
        "lenis", "hls", "filepond", "swiper",
        "cross-stack pairing", "next.js go pairing", "nextjs go pairing",
    ],
    "ON_DEMAND": [
        "assets/universal/checklists/debugging_checklist.md",
        "assets/universal/checklists/verification_checklist.md",
        "references/router/cross_stack_pairing.md",
    ],
}
```

---

## 3. RESOURCE RESOLUTION (per stack)

The router builds a stack-specific resource map keyed by intent. `LIVE_STACKS = {"WEBFLOW"}` plus `STUB_STACKS = {"NEXTJS", "GO"}` together form `ROUTABLE_STACKS`. Anything else returns `UNKNOWN` and surfaces a disambiguation prompt — this skill does not own Node.js / React Native / Swift / other stacks.

```python
def resource_map_for(stack):
    if stack == "WEBFLOW":
        return {
            "IMPLEMENTATION": ["references/webflow/implementation/implementation_workflows.md"],
            "DEBUGGING":      ["assets/universal/checklists/debugging_checklist.md",
                               "references/webflow/debugging/debugging_workflows.md"],
            # ... see SKILL.md §2 for complete WEBFLOW map
        }
    elif stack == "NEXTJS":
        return {
            "IMPLEMENTATION": ["references/nextjs/implementation/implementation_workflows.md"],
            "API":            ["references/nextjs/implementation/api_integration.md",
                               "references/router/cross_stack_pairing.md"],
            "FORMS":          ["references/nextjs/implementation/forms_validation.md"],
            "ANIMATION":      ["references/nextjs/implementation/motion_animation.md"],
            # ... see SKILL.md §2 for complete NEXTJS map
        }
    elif stack == "GO":
        return {
            "IMPLEMENTATION": ["references/go/implementation/implementation_workflows.md"],
            "API":            ["references/go/implementation/api_design.md",
                               "references/router/cross_stack_pairing.md"],
            "DATABASE":       ["references/go/implementation/database_sqlc_postgres.md"],
            # ... see SKILL.md §2 for complete GO map
        }
    else:  # UNKNOWN
        return {}
```

---

## 4. ALWAYS-LOADED RESOURCES

Regardless of stack or intent, the router always loads the universal core:

```python
ALWAYS_LOAD = [
    "references/universal/code_quality_standards.md",  # P0/P1/P2 severity model
    "references/universal/error_recovery.md",          # recover-in-place / rollback / escalate
]
```

For UNKNOWN stacks (Node.js without React/Next, React Native, Swift, etc.), the router loads only `ALWAYS_LOAD` and surfaces a disambiguation prompt — `sk-code` does not own those stacks.

---

## 5. ON-DEMAND RESOURCES

When the task text contains specific keywords, additional resources are surfaced regardless of stack or top-intent:

| Trigger                | Surface                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `full checklist`       | `assets/universal/checklists/debugging_checklist.md`          |
| `deep dive`            | `assets/universal/checklists/debugging_checklist.md`          |
| `browser matrix`       | `assets/universal/checklists/verification_checklist.md`       |
| `cross-stack pairing`  | `references/router/cross_stack_pairing.md`                    |
| `next.js go pairing`   | `references/router/cross_stack_pairing.md`                    |
| `nextjs go pairing`    | `references/router/cross_stack_pairing.md`                    |
| `lenis` (WEBFLOW)      | `references/webflow/implementation/animation_workflows.md`    |
| `hls` (WEBFLOW)        | `references/webflow/implementation/implementation_workflows.md` |
| `filepond` (WEBFLOW)   | `references/webflow/implementation/form_upload_workflows.md`  |
| `swiper` (WEBFLOW)     | `references/webflow/implementation/swiper_patterns.md`        |

---

## 6. DISAMBIGUATION FALLBACK

Two cases trigger the `UNKNOWN_FALLBACK_CHECKLIST` surface:

1. Stack = UNKNOWN (no marker files matched).
2. Sum of intent scores < 0.5 (low-signal task).

In both cases, the router surfaces a 4-question disambiguation checklist and skips stack-specific resource loading. The user picks the stack manually or rephrases the request.

---

## 7. VERIFICATION COMMANDS BY STACK

```python
STACK_VERIFICATION_COMMANDS = {
    "WEBFLOW": ["node scripts/minify-webflow.mjs",
                "node scripts/verify-minification.mjs",
                "node scripts/test-minified-runtime.mjs",
                "browser test (mobile + desktop + console clean)"],
    "NEXTJS":  ["npm run type-check", "npm run lint", "npm run build"],
    "GO":      ["go test ./...", "golangci-lint run", "go build ./..."],
}
```

These are the commands that must all exit 0 before any "done" claim. The Phase 3 Verification gate enforces this.

---

---

## 8. RELATED RESOURCES

- `references/router/stack_detection.md` - what determines the stack (runs first).
- `references/router/intent_classification.md` - what determines the intents (runs second).
- `references/router/phase_lifecycle.md` - how loaded resources map to Phase 0-3 lifecycle.
- `references/router/cross_stack_pairing.md` - canonical Next.js ↔ Go contract surfaced when API/auth intents fire.
- `SKILL.md` §2 — full smart-routing pseudocode and main router function.
