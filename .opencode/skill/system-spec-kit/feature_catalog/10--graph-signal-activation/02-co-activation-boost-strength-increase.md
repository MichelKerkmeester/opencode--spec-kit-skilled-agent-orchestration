# Co-activation boost strength increase

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Describes the co-activation boost multiplier increase from 0.1x to 0.25-0.3x, making graph signal contribution visible in retrieval results at 15% or higher effective contribution.

## 2. CURRENT REALITY

The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.

The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Co-activation boost strength increase
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

When two memories are connected in the knowledge graph, finding one should help surface the other. The original boost from these connections was too weak to make a noticeable difference. This change turned up the volume so that graph connections actually influence what shows up in your search results, making the relationship map between memories useful rather than decorative.
