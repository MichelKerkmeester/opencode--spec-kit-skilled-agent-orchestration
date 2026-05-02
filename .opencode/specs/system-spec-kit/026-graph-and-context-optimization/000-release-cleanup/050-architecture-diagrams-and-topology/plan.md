---
title: "Implementation Plan: Architecture Diagrams & Topology"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Two-phase plan: first research each folder to understand its component relationships, then add diagram + tree to each target README."
importance_tier: "normal"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Architecture Diagrams & Topology

<!-- ANCHOR:approach -->
## Approach

Two phases:
1. **Research per folder** — read source files to understand module relationships
2. **Edit each README** — insert diagram and tree at the right location
<!-- /ANCHOR:approach -->

<!-- ANCHOR:phases -->
## Phases

### Phase 1: Research (parallel exploration)
For each target folder, read source files to understand:
- What modules exist
- Dependencies between modules
- External interfaces (what calls in, what the folder calls out to)
- How the folder relates to sibling folders

### Phase 2: Write Diagrams & Trees
For each target README:
- Insert architecture diagram after Overview heading
- Insert/update topology tree in Structure section
- Format: `<!-- ANCHOR:architecture -->` wrapper, box-art diagram, `<!-- /ANCHOR:architecture -->`
- Style: match `shared/README.md:46-78` box-drawing characters
<!-- /ANCHOR:phases -->