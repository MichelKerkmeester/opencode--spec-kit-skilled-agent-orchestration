---
title: "Dynamic profiling"
description: "Builds a target-specific scoring profile from the agent file being evaluated."
---

# Dynamic profiling

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Builds a target-specific scoring profile from the agent file being evaluated.

This feature replaces fixed evaluator profiles with a profile that is generated from the target agent's own frontmatter, sections, rules, and related-resource tables.

---

## 2. CURRENT REALITY

`generate-profile.cjs` reads the agent markdown, parses frontmatter and permission blocks, extracts numbered `##` sections, derives structural probes, ALWAYS and NEVER rule checks, output-verification checklist items, forbidden behaviors, related-resource integration points, and permission-capability mismatches, then emits a generated profile object with benchmark defaults and permission summaries.

The current release ships only this dynamic path. `target_manifest.jsonc` enables dynamic profiling, points to `generate-profile.cjs`, and keeps `targets` empty. The skill docs and onboarding guide both describe static profiles as gone, so every evaluated agent is treated as a derived dynamic target unless a wrapper adds extra runtime classification around it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs` | Profile builder | Parses agent markdown and emits the derived checks used by the scorer. |
| `.opencode/skill/sk-improve-agent/assets/target_manifest.jsonc` | Manifest | Declares dynamic profiling as the canonical path and leaves the static target catalog empty. |
| `.opencode/skill/sk-improve-agent/references/target_onboarding.md` | Operator reference | Requires dynamic-profile generation when new targets are onboarded. |
| `.opencode/skill/sk-improve-agent/references/evaluator_contract.md` | Contract reference | Defines dynamic mode as the only scoring surface. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/agent/improve-agent.md` | Consumed target example | Shows the section, rules, capability scan, and related-resource patterns that the generator is designed to parse. |
| `.opencode/skill/sk-improve-agent/README.md` | Package reference | Documents that no static profiles ship in the current release. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/02-dynamic-profiling.md`
