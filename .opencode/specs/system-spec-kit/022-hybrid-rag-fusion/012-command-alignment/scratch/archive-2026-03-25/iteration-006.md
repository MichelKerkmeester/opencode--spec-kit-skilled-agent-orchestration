# Review Findings: Wave 3, Agent B3

## Metadata
- Dimension: security + correctness
- Files Reviewed: 7 command docs + supporting YAMLs, validators, templates
- Model: gpt-5.4
- Effort: high
- Wave: 3 of 5

## Findings

### [F-034] [P1] Crash-recovery breadcrumb location inconsistent across commands
- **File**: resume.md:75-77, handover.md:210, continue.md:186-198, session-manager.ts:1177-1185
- **Evidence**: resume/handover say CONTINUE_SESSION.md in project root; continue.md expects it in spec folder; implementation writes to spec folder.
- **Impact**: Crash breadcrumb silently skipped, weakening emergency resume path.
- **Fix**: Standardize all docs on spec-folder location.

### [F-035] [P1] Phase-link validation doesn't actually validate predecessor/successor fields
- **File**: spec_kit_phase_auto.yaml:237-246, check-phase-links.sh:87-117
- **Evidence**: Validator only greps for phase names anywhere in spec.md, doesn't parse Predecessor/Successor metadata rows.
- **Impact**: Wrong phase adjacency metadata passes validation, encoding wrong execution order.
- **Fix**: Parse child metadata table and assert exact predecessor/successor values.

### [F-036] [P1] Debug delegation forwards raw diagnostics without redaction
- **File**: debug.md:63-66, spec_kit_debug_auto.yaml:165-193, debug-delegation.md:44-47
- **Evidence**: Workflow includes error_message, reproduction_steps, stack traces in sub-agent prompts and persists to spec memory with no masking.
- **Impact**: Secrets in logs/traces get copied to another agent context and persisted.
- **Fix**: Redact common secret patterns before report generation/dispatch.

### [F-037] [P1] Handover auto-persists conversation context without secret-scrub gate
- **File**: spec_kit_handover_full.yaml:37-39, spec_kit_handover_full.yaml:218-229
- **Evidence**: Auto-gathers session_context, extracts tool calls/file changes, writes handover.md. Only protection is non-enforced "NEVER: Include sensitive information" rule.
- **Impact**: Credentials/tokens can persist into repo-visible spec files.
- **Fix**: Add blocking redaction/secret-scan gate before writing handover.md.

### [F-038] [P2] Claude runtime agent path rooted at `/` instead of repository
- **File**: debug.md:33-35, handover.md:29-31
- **Evidence**: Commands map Claude to `/.claude/agents` (filesystem root). Convention elsewhere uses `.claude/agents/`.
- **Impact**: Agent file resolution from filesystem root instead of workspace.
- **Fix**: Change both path tables to `.claude/agents`.

## Summary
- Total findings: 5 (P0=0, P1=4, P2=1)
- newFindingsRatio: 0.13
