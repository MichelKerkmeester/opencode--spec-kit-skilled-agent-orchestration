# Shared-memory rollout, deny-by-default membership, and kill switch

## 1. OVERVIEW

Shared-memory rollout controls access to shared spaces through deny-by-default membership and an immediate kill switch for incident response.

Shared memory spaces let multiple users or agents access the same pool of knowledge. This feature makes sure nobody gets access unless they are explicitly granted membership, and it includes an emergency "off" switch that immediately blocks everyone if something goes wrong. It is like a shared office with a keycard lock: you only get in if your name is on the list, and building management can lock it down instantly in an emergency.

---

## 2. CURRENT REALITY

Phase 6 introduced shared-memory spaces with governance-first rollout controls. Access is deny-by-default: a caller can use a shared space only when explicit membership exists for the current identity.

Rollout is controlled per space and supports immediate kill-switch behavior. Even previously authorized members are blocked when the kill switch is enabled, providing a hard operational stop for incident response or controlled rollback.

Shared-memory handlers and lifecycle tools use the same membership and rollout checks so save, search and status flows enforce one consistent governance boundary.

---

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
| `mcp_server/tests/shared-spaces.vitest.ts` | Deny-by-default membership, membership grant flow and kill-switch enforcement |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Shared-memory rollout, deny-by-default membership, and kill switch
- Current reality source: Phase 015 implementation

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-123
