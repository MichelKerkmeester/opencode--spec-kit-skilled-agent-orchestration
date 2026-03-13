# Shared-memory rollout, deny-by-default membership, and kill switch

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Shared-memory rollout, deny-by-default membership, and kill switch.

## 2. CURRENT REALITY

Phase 6 introduced shared-memory spaces with governance-first rollout controls. Access is deny-by-default: a caller can use a shared space only when explicit membership exists for the current identity.

Rollout is controlled per space and supports immediate kill-switch behavior. Even previously authorized members are blocked when the kill switch is enabled, providing a hard operational stop for incident response or controlled rollback.

Shared-memory handlers and lifecycle tools use the same membership and rollout checks so save, search, and status flows enforce one consistent governance boundary.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/collab/shared-spaces.ts` | Lib | Shared-space definitions, membership checks, rollout and kill-switch controls |
| `mcp_server/handlers/shared-memory.ts` | Handler | Shared-memory save/search/status enforcement |
| `mcp_server/tools/lifecycle-tools.ts` | Tool | Shared-space lifecycle operations |
| `mcp_server/tool-schemas.ts` | Core | Shared-space tool contracts and validation surface |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/shared-spaces.vitest.ts` | Deny-by-default membership, membership grant flow, and kill-switch enforcement |

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Shared-memory rollout, deny-by-default membership, and kill switch
- Current reality source: Phase 015 implementation

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-123
