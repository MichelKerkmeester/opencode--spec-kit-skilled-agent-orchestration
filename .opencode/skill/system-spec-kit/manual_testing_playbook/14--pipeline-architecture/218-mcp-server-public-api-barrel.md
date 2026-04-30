---
title: "218 -- MCP Server Public API Barrel"
description: "This scenario validates MCP Server Public API Barrel for `218`. It focuses on verifying the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary."
audited_post_018: true
---

# 218 -- MCP Server Public API Barrel

## 1. OVERVIEW

This scenario validates MCP Server Public API Barrel for `218`. It focuses on verifying the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary.
- Real user request: `` Please validate MCP Server Public API Barrel against mcp_server/api/index.ts and tell me whether the expected signals are present: `mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel. ``
- RCAF Prompt: `As a pipeline validation operator, validate MCP Server Public API Barrel against mcp_server/api/index.ts. Verify the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the barrel centralizes the approved public import contract and the docs steer consumers to `api/`; FAIL if required exports are missing, helper surfaces require internal imports, or the docs contradict the barrel policy

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, verify the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary against mcp_server/api/index.ts. Verify mcp_server/api/index.ts re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; mcp_server/api/README.md names api/ as the approved public surface; consumers can rely on one stable top-level barrel. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect `mcp_server/api/index.ts` and capture the top-level export groups and promoted helper surfaces
2. Cross-check those exports against `api/eval.ts`, `api/indexing.ts`, `api/search.ts`, `api/providers.ts`, and `api/storage.ts` plus the curated internal helper modules named in the catalog
3. Inspect `mcp_server/api/README.md` and confirm consumer guidance points to `api/` as the supported boundary
4. Run a barrel import smoke test or equivalent script check that accesses representative symbols from each export family through `mcp_server/api` only

### Expected

`mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel

### Evidence

Barrel export capture + README policy snippet + cross-check notes against sub-barrels and curated helper sources + import smoke-test transcript or equivalent proof

### Pass / Fail

- **Pass**: the barrel centralizes the approved public import contract and the docs steer consumers to `api/`
- **Fail**: required exports are missing, helper surfaces require internal imports, or the docs contradict the barrel policy

### Failure Triage

Inspect `mcp_server/api/index.ts` for stale or missing re-exports -> verify renamed helper symbols still match the barrel contract -> check `mcp_server/api/README.md` for outdated consumer guidance -> confirm callers are not forced back to internal paths for metadata or rollout helpers

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/22-mcp-server-public-api-barrel.md](../../feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 218
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/218-mcp-server-public-api-barrel.md`
