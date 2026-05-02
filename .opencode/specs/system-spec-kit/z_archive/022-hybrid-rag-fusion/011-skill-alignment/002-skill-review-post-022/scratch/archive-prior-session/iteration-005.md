# Iteration 005 — Security, references/memory/ + config/

**Agent**: A5 (codex 5.3, xhigh)
**Dimension**: Security
**Model**: gpt-5.3-codex
**Duration**: ~12m 25s

## Findings

### Finding 005-F1
- **Severity**: P1
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:320`
- **Title**: Full-dialogue snapshot guidance lacks redaction controls
- **Evidence**: Requires `## Conversation Flow` with "Full dialogue with timestamps" as required
- **Expected**: Redaction/sanitization of secrets before persistence; summary-first default
- **Impact**: Point-in-time snapshots can persist API keys/tokens/credentials
- **Fix**: Add mandatory redaction policy; mark raw full-dialogue as opt-in

### Finding 005-F2
- **Severity**: P1
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/references/memory/memory_system.md:161`
- **Title**: Governance scope parameters omitted from memory_search() reference
- **Evidence**: No tenantId, userId, agentId, sharedSpaceId in parameter list
- **Expected**: Document governed retrieval parameters for shared/multi-actor deployments
- **Impact**: Users perform unscoped retrieval; cross-scope data exposure risk
- **Fix**: Add governance parameter rows with secure usage examples

### Finding 005-F3
- **Severity**: P1
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/references/config/environment_variables.md:27`
- **Title**: MEMORY_ALLOWED_PATHS default documentation understates actual read boundary
- **Evidence**: Default shown as `specs/,.opencode/` only
- **Expected**: Document effective default including runtime roots (process.cwd(), ~/.claude)
- **Impact**: Operators assume tighter filesystem boundaries than enforced
- **Fix**: Update default to full effective set; add hardening note

### Finding 005-F4
- **Severity**: P2
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/references/config/environment_variables.md:339`
- **Title**: Shared-memory governance env docs stale/incomplete
- **Evidence**: SPECKIT_MEMORY_SHARED_MEMORY shown as ON; missing admin identity env vars
- **Expected**: Reflect default-off state; document SPECKIT_SHARED_MEMORY_ADMIN_USER_ID/AGENT_ID
- **Impact**: Misconfigured governance rollout/admin controls
- **Fix**: Correct defaults and add admin identity variable section

### Finding 005-F5
- **Severity**: P2
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/references/memory/trigger_config.md:195`
- **Title**: Root-level fallback save location contradicts governed save boundary
- **Evidence**: Fallback to `memory/ (workspace root)`
- **Expected**: Spec/phase-folder scoped only
- **Impact**: Unscoped storage of sensitive session data outside governed boundaries
- **Fix**: Remove workspace-root fallback; align with spec-folder-only save policy

**Note**: Tool count (33) verified as accurate — no finding.

## Summary
- P0: 0, P1: 3, P2: 2
- newFindingsRatio: 0.198
