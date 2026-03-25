# Review Findings: Wave 3, Agent A3

## Metadata
- Dimension: security
- Files Reviewed: 7 (all 6 memory commands + README.txt)
- Model: gpt-5.3-codex
- Effort: xhigh
- Wave: 3 of 5

## Findings

### [F-024] [P1] Unsafe filename-to-shell delete path in `/memory:learn remove`
- **File**: learn.md:3, learn.md:385-387, learn.md:419-420
- **Evidence**: `remove <filename>` input drives `rm "<path>"` via Bash, no basename constraint.
- **Impact**: Path traversal or arbitrary file deletion possible.
- **Fix**: Enforce basename-only filenames from pre-enumerated allowlist; reject `/`, `..`, absolute paths.

### [F-025] [P1] Conversation content can reach shell heredoc in `/memory:save`
- **File**: save.md:179-185, save.md:276-279, save.md:309-315
- **Evidence**: User/assistant exchange content included in JSON, written via shell heredoc before running `node`.
- **Impact**: Heredoc boundary breaking or command-injection if escaping mishandled.
- **Fix**: Make Write-tool JSON file creation the only allowed path; disallow heredoc for untrusted content.

### [F-026] [P1] Governance/provenance parameters explicitly not strictly validated
- **File**: save.md:644-660, save.md:669
- **Evidence**: Security-boundary fields (tenantId, userId, agentId) documented but not all validated in strict mode.
- **Impact**: Boundary/provenance spoofing risk in governed deployments.
- **Fix**: Require strict schema validation for all governance/provenance fields.

### [F-027] [P1] `/memory:shared status` supports principal probing without actor binding
- **File**: shared.md:260-270, shared.md:352
- **Evidence**: `status` allows --user/--agent queries but doesn't require actor identity.
- **Impact**: Potential enumeration of other principals' shared-space visibility.
- **Fix**: Require caller identity for status queries; enforce self-or-owner visibility.

### [F-028] [P1] Constitutional memory mutation lacks command-level authorization model
- **File**: learn.md:4, learn.md:77, learn.md:332, learn.md:385
- **Evidence**: High-impact global rules writable/editable/removable with no actor/ownership checks.
- **Impact**: Any caller with command access can alter always-surfaced rules.
- **Fix**: Add actor identity + policy checks for create/edit/remove on constitutional tier.

### [F-029] [P2] Checkpoint delete can execute without explicit second confirmation
- **File**: manage.md:727-731, manage.md:735
- **Evidence**: Flow directly calls delete with confirmName=name; no explicit WAIT gate.
- **Fix**: Add mandatory interactive confirmation before tool invocation.

### [F-030] [P2] TOCTOU window in checkpoint restore
- **File**: manage.md:637, manage.md:648
- **Evidence**: Existence checked via list, restore by mutable checkpoint name.
- **Fix**: Pin immutable checkpoint identity at check time; verify before restore.

### [F-031] [P2] `/memory:continue` consumes CONTINUE_SESSION.md without integrity checks
- **File**: continue.md:186-199, continue.md:288-289
- **Evidence**: File used as enrichment with no signature/hash validation.
- **Fix**: Validate session ID/hash/timestamp linkage before trusting enrichment.

### [F-032] [P2] Ingest accepts arbitrary absolute paths with weak scope controls
- **File**: manage.md:757-763, manage.md:768
- **Evidence**: Only min/max path count constrained; no repo-root allowlist or file-size limits.
- **Fix**: Restrict ingest roots, enforce file-size limits, add pre-ingest scope validation.

### [F-033] [P2] Internal DB path disclosure + destructive manual recovery guidance
- **File**: save.md:559
- **Evidence**: Documentation recommends deleting specific SQLite DB files by path.
- **Fix**: Replace with controlled maintenance commands, not raw file deletion.

## Summary
- Total findings: 10 (P0=0, P1=5, P2=5)
- newFindingsRatio: 0.30
