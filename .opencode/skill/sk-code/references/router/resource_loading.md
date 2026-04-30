---
title: Router Reference — Resource Loading
description: Load levels (MINIMAL/DEBUGGING/FOCUSED/STANDARD) and resource resolution logic for the sk-code smart router.
keywords: [routing, resource-loading, load-levels, sk-code]
---

# Router Reference — Resource Loading

After stack + intent are determined, resource loading selects the right files. The merged router preserves the tiered LOAD_LEVELS model.

> Authoritative source: `SKILL.md §2 — SMART ROUTING`. This doc is a deep-reference extract.

---

## Load Levels

| Level | When Selected | Resource Volume |
|---|---|---|
| MINIMAL | Primary intent = VERIFICATION | Minimal — just verification checklist + stack commands |
| DEBUGGING | Primary intent = DEBUGGING | Debugging workflow + error recovery |
| FOCUSED | Primary intent = TESTING / DATABASE / API / DEPLOYMENT / VIDEO | Single-domain references |
| STANDARD | Primary intent = IMPLEMENTATION / CODE_QUALITY / ANIMATION / FORMS / PERFORMANCE | Full Phase 1 references + standards |

Mapping table:

```python
LOAD_LEVELS = {
    "VERIFICATION":   "MINIMAL",
    "DEBUGGING":      "DEBUGGING",
    "TESTING":        "FOCUSED",
    "DATABASE":       "FOCUSED",
    "API":            "FOCUSED",
    "DEPLOYMENT":     "FOCUSED",
    "VIDEO":          "FOCUSED",
    "IMPLEMENTATION": "STANDARD",
    "CODE_QUALITY":   "STANDARD",
    "ANIMATION":      "STANDARD",
    "FORMS":          "STANDARD",
    "PERFORMANCE":    "STANDARD",
}
```

## Resource Resolution (per stack)

The router builds a stack-specific resource map.

- `LIVE_STACKS = {"WEBFLOW", "REACT", "GO"}` — return full live intent → file maps
- `PLACEHOLDER_STACKS = {"NODEJS", "REACT_NATIVE", "SWIFT"}` — return their `_placeholder.md` for every intent
- `UNKNOWN` — empty map; surface `UNKNOWN_FALLBACK_CHECKLIST`

```python
def resource_map_for(stack):
    if stack == "WEBFLOW":
        return {
            "IMPLEMENTATION": ["references/webflow/implementation/implementation_workflows.md"],
            "DEBUGGING":      ["assets/universal/checklists/debugging_checklist.md",
                               "references/webflow/debugging/debugging_workflows.md"],
            # ... see SKILL.md §2 for complete WEBFLOW map
        }
    elif stack == "REACT":
        return {
            "IMPLEMENTATION": ["references/react/implementation/implementation_workflows.md"],
            "API":            ["references/react/implementation/api_integration.md",
                               "references/router/cross_stack_pairing.md"],
            "FORMS":          ["references/react/implementation/forms_validation.md"],
            "ANIMATION":      ["references/react/implementation/motion_animation.md"],
            # ... see SKILL.md §2 for complete REACT map
        }
    elif stack == "GO":
        return {
            "IMPLEMENTATION": ["references/go/implementation/implementation_workflows.md"],
            "API":            ["references/go/implementation/api_design.md",
                               "references/router/cross_stack_pairing.md"],
            "DATABASE":       ["references/go/implementation/database_sqlc_postgres.md"],
            # ... see SKILL.md §2 for complete GO map
        }
    elif stack in PLACEHOLDER_STACKS:
        return {intent: [f"references/{folder}/_placeholder.md"]
                for intent in TASK_SIGNALS}
    else:  # UNKNOWN
        return {}
```

## Always-Loaded Resources

Regardless of stack or intent, the router always loads:

```python
ALWAYS_LOAD = [
    "references/universal/code_quality_standards.md",  # P0/P1/P2 severity model
]
```

Plus, for placeholder stacks, the router additionally loads:
- `references/<stack>/_placeholder.md` (the migration pointer)
- `assets/<stack>/_placeholder.md` (the asset pointer)

## On-Demand Resources (WEB only)

When the WEBFLOW stack is detected AND the task text contains specific keywords, additional resources are surfaced:

```python
ON_DEMAND_KEYWORDS = ["deep dive", "full checklist", "full performance plan",
                      "browser", "viewport", "routing dashboard",
                      "database migration", "api endpoint", "deployment pipeline"]

# WEB-specific on-demand:
# - assets/webflow/checklists/code_quality_checklist.md
# - assets/universal/checklists/verification_checklist.md
```

Plus integration-specific:
- `lenis` keyword → `references/webflow/implementation/animation_workflows.md`
- `hls` keyword → `references/webflow/implementation/implementation_workflows.md`

## Disambiguation Fallback

Two cases trigger the UNKNOWN_FALLBACK surface:
1. Stack = UNKNOWN (no marker files)
2. Sum of intent scores < 0.5 (low-signal task)

In both cases, the router surfaces `UNKNOWN_FALLBACK_CHECKLIST` (5 disambiguation questions) and skips stack-specific resource loading.

## Verification Commands by Stack

```python
STACK_VERIFICATION_COMMANDS = {
    "WEBFLOW":          ["node scripts/minify-webflow.mjs",
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

## See Also

- `references/router/stack_detection.md` — what determines the stack
- `references/router/intent_classification.md` — what determines the intents
- `references/router/phase_lifecycle.md` — how intents map to lifecycle phases
- `SKILL.md §2` — full routing pseudocode + main router function
