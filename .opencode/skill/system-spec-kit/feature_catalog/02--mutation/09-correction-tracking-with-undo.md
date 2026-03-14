# Correction tracking with undo

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Covers the corrections module that records inter-memory relationship signals and adjusts stability scores during learning.

## 2. CURRENT REALITY

The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.

Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/learning/corrections.ts` | Lib | Correction tracking and stability adjustment |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/corrections.vitest.ts` | Correction tracking tests |

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Correction tracking with undo
- Current reality source: audit-D04 gap backfill

## 5. IN SIMPLE TERMS

When a newer memory replaces or refines an older one, the system records what changed and why. The old memory gets a lower confidence score while the new one gets a boost. This creates a paper trail of corrections so you can see how your knowledge evolved over time and understand why older information was updated.
