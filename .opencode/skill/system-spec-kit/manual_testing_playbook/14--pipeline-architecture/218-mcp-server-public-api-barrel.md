---
title: "218 -- MCP Server Public API Barrel"
description: "This scenario validates MCP Server Public API Barrel for `218`. It focuses on verifying the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary."
---

# 218 -- MCP Server Public API Barrel

## 1. OVERVIEW

This scenario validates MCP Server Public API Barrel for `218`. It focuses on verifying the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `218` and confirm the expected signals without contradicting evidence.

- Objective: Verify the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary
- Prompt: `Validate the MCP server public API barrel. Capture the evidence needed to prove external consumers can import approved evaluation, indexing, search, provider, storage, helper, and rollout-metadata surfaces from \`mcp_server/api\` without deep-linking into internal \`lib/\`, \`core/\`, or \`handlers/\` modules, and that the README reinforces this contract. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel
- Pass/fail: PASS if the barrel centralizes the approved public import contract and the docs steer consumers to `api/`; FAIL if required exports are missing, helper surfaces require internal imports, or the docs contradict the barrel policy

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 218 | MCP Server Public API Barrel | Verify the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary | `Validate the MCP server public API barrel. Capture the evidence needed to prove external consumers can import approved evaluation, indexing, search, provider, storage, helper, and rollout-metadata surfaces from \`mcp_server/api\` without deep-linking into internal \`lib/\`, \`core/\`, or \`handlers/\` modules, and that the README reinforces this contract. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect `mcp_server/api/index.ts` and capture the top-level export groups and promoted helper surfaces 2) Cross-check those exports against `api/eval.ts`, `api/indexing.ts`, `api/search.ts`, `api/providers.ts`, and `api/storage.ts` plus the curated internal helper modules named in the catalog 3) Inspect `mcp_server/api/README.md` and confirm consumer guidance points to `api/` as the supported boundary 4) Run a barrel import smoke test or equivalent script check that accesses representative symbols from each export family through `mcp_server/api` only | `mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel | Barrel export capture + README policy snippet + cross-check notes against sub-barrels and curated helper sources + import smoke-test transcript or equivalent proof | PASS if the barrel centralizes the approved public import contract and the docs steer consumers to `api/`; FAIL if required exports are missing, helper surfaces require internal imports, or the docs contradict the barrel policy | Inspect `mcp_server/api/index.ts` for stale or missing re-exports -> verify renamed helper symbols still match the barrel contract -> check `mcp_server/api/README.md` for outdated consumer guidance -> confirm callers are not forced back to internal paths for metadata or rollout helpers |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/22-mcp-server-public-api-barrel.md](../../feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 218
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/218-mcp-server-public-api-barrel.md`
