---
title: "Deep Research v2 — Iteration 008"
focus: "Q9 final: source-capabilities concrete interaction map"
newInfoRatio: 0.22
timestamp: "2026-03-20T14:00:00Z"
---

# Iteration 008

## Q9: Source-Capabilities Complete Interaction Map (ANSWERED)

### Capability Field Effects

| Field | Consumer | Concrete Effect |
|-------|----------|----------------|
| toolTitleWithPathExpected | contamination-filter.ts:111 | Downgrades "tool title with path" severity from high→low. Saves 0.20-0.25 quality penalty. Only claude-code-capture=true. |
| inputMode | workflow.ts:2244 | Warning text only ("Stateless save" vs "Structured save"). Does NOT drive mode selection. |
| prefersStructuredSave | NONE (defined but unconsumed) | Zero runtime effect. |

### Key Finding: `prefersStructuredSave` is dead code
Defined in source-capabilities.ts:10,13 but no runtime consumer exists in scripts/.

### Validation Rule Applicability
All V1-V12 rules use `appliesToSources: 'all'` — the per-source rule filtering infrastructure exists but is not yet leveraged.

### Raw Source-Name Checks (Still Present)
- `_source === 'file'` at workflow.ts:1240, :1855, task-enrichment.ts:27 — for enrichment/routing, not policy
- Stateless mode decision at workflow.ts:1415 uses input presence, not capabilities
