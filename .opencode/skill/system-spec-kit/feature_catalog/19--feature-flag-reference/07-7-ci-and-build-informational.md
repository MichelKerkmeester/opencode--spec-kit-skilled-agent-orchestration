# 7. CI and Build (informational)

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational).

## 2. CURRENT REALITY
These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

| Name | Source | Description |
|---|---|---|
| `BRANCH_NAME` | `lib/storage/checkpoints.ts` | Git branch name as set by some CI environments (e.g. Jenkins). Used as a fallback when `GIT_BRANCH` is absent. |
| `CI_COMMIT_REF_NAME` | `lib/storage/checkpoints.ts` | Git branch or tag name as set by GitLab CI. Third fallback in the branch-detection chain. |
| `GIT_BRANCH` | `lib/storage/checkpoints.ts` | Git branch name. Primary source used to annotate checkpoint records with the active branch at creation time. |
| `VERCEL_GIT_COMMIT_REF` | `lib/storage/checkpoints.ts` | Git branch name as set by Vercel deployments. Last fallback in the branch-detection chain. |

## 3. IN SIMPLE TERMS
These are informational CI metadata variables, not feature toggles. They annotate records with branch context for traceability but do not change retrieval, scoring, or storage behavior.
## 4. SOURCE FILES
Source file references are included in the flag table above.

## 5. SOURCE METADATA
- Group: Feature Flag Reference
- Source feature title: 7. CI and Build (informational)
- Current reality source: feature_catalog.md
