# Iteration 9: Edge case content drafts (status: insight)

## Focus

Draft 5 concrete micro-payloads for implementation-phase artifacts so PR-author can copy-paste. Track: **edge-case-content-prep**.

## Findings

### Finding 1 — `LegacyMemoryNameTelemetry` event payload schema (PR1)

```typescript
export interface LegacyMemoryNameTelemetryEvent {
  event: 'legacy-memory-name-call';
  timestamp: string;          // ISO-8601 UTC
  legacyName: string;         // e.g. 'memory_search'
  newName: string;            // e.g. 'continuity_search'
  tier: 'T1' | 'T2' | 'T3';   // permanent / 2-release / 1-release
  callContext: 'mcp-handler' | 'cli' | 'agent-tool' | 'slash-command' | 'unknown';
  sessionId: string;          // session-scoped correlation id
  // Optional context (best-effort):
  specFolder?: string | null; // resolved if call carries spec-folder arg
  agentName?: string | null;  // e.g. '@deep-research', '@review'
  providerHint?: 'claude' | 'gpt' | 'gemini' | 'opencode' | 'unknown';
}
```

**Example payload**:
```json
{"event":"legacy-memory-name-call","timestamp":"2026-04-26T08:48:00.000Z","legacyName":"memory_search","newName":"continuity_search","tier":"T1","callContext":"mcp-handler","sessionId":"e3fb01be-3a22-481a-be85-76d57a297857","specFolder":"system-spec-kit/026-...","agentName":"@deep-research","providerHint":"claude"}
```

Channel: `mcp_server/lib/telemetry/legacy-memory-name-telemetry.ts`. T1 emits info-level; T2 emits warn-level; T3 emits warn-level with stronger CLI deprecation banner.

**Iter-grounding**: iter-2 #8 (3-tier alias matrix); iter-6 R2 (telemetry sequencing); iter-7 PR1 (channel registration), PR2 (channel activation).

### Finding 2 — PR1 dual-fixture parser test content

Two fixture files at `mcp_server/test/fixtures/parser-dual-key-fixture/`:

**`legacy.md`** (legacy `_memory:` frontmatter):
```yaml
---
title: "Test fixture - legacy _memory key"
_memory:
  continuity:
    last_updated_at: "2026-04-26T08:00:00.000Z"
    recent_action: "Drafted parser dual-fixture test"
    next_safe_action: "Run vitest to verify both fixtures parse identically"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
---
# Legacy fixture body
```

**`new.md`** (new `_continuity:` frontmatter):
```yaml
---
title: "Test fixture - new _continuity key"
_continuity:
  last_updated_at: "2026-04-26T08:00:00.000Z"
  recent_action: "Drafted parser dual-fixture test"
  next_safe_action: "Run vitest to verify both fixtures parse identically"
  blockers: []
  key_files:
    - "spec.md"
    - "implementation-summary.md"
---
# New fixture body
```

**Vitest assertion** (`mcp_server/test/parser-fallback.test.ts`):
```typescript
import { describe, it, expect } from 'vitest';
import { extractContinuityBlock } from '../lib/resume/resume-ladder';
import { readFileSync } from 'node:fs';

describe('parser dual-key fallback', () => {
  it('legacy _memory.continuity and new _continuity produce identical resume-ladder output', () => {
    const legacy = readFileSync('mcp_server/test/fixtures/parser-dual-key-fixture/legacy.md', 'utf8');
    const newKey = readFileSync('mcp_server/test/fixtures/parser-dual-key-fixture/new.md', 'utf8');
    expect(extractContinuityBlock(legacy)).toEqual(extractContinuityBlock(newKey));
  });

  it('legacy fixture emits LegacyMemoryNameTelemetry; new fixture does not', () => {
    // assert telemetry channel state via spy
  });

  it('both fixtures yield expected continuity fields (last_updated_at, recent_action, etc.)', () => {
    // assert canonical continuity contract preserved across both forms
  });
});
```

**Iter-grounding**: iter-3 #2 (yaml.load + property access); iter-3 #3 (regex extractor at `resume-ladder.js:65-90`); iter-7 PR1 #6 (regression test fixture spec); iter-6 R1 mitigation.

### Finding 3 — `glossary-drift-lint.ts` regex patterns (PR3)

Four lint rules with typed `LintRule` shape:

```typescript
interface LintRule {
  id: string;
  pattern: RegExp;
  severityForExisting: 'warn' | 'fail';
  severityForNew: 'fail';
  allowlist: RegExp[];   // file-path patterns where the pattern is permitted
  message: string;
}

const RULES: LintRule[] = [
  {
    id: 'TOOL_NAME_DRIFT',
    pattern: /\bmemory_(context|search|quick_search|match_triggers|save|list|stats|health|delete|update|validate|bulk_delete|drift_why|causal_link|causal_stats|causal_unlink|index_scan|get_learning_history|ingest_start|ingest_status|ingest_cancel)\b/g,
    severityForExisting: 'warn',
    severityForNew: 'fail',
    allowlist: [/^\.opencode\/specs\/.*\.md$/, /^\.opencode\/skill\/system-spec-kit\/manual_testing_playbook\//, /^\.opencode\/skill\/system-spec-kit\/feature_catalog\//, /^\.opencode\/skill\/system-spec-kit\/references\/glossary\.md$/],
    message: 'Legacy memory_* tool name; prefer continuity_* (see glossary §5)',
  },
  {
    id: 'MEMORY_ID_CANARY',
    pattern: /\bmemory_id\b/g,
    severityForExisting: 'warn',
    severityForNew: 'fail',
    allowlist: [/^.*\/lib\/cognitive\//, /^.*\/lib\/storage\//, /^.*\/lib\/search\//, /^\.opencode\/skill\/system-spec-kit\/references\/glossary\.md$/],
    message: 'memory_id reference outside cognitive/storage/search canary boundary; see glossary §6 cross-link rule',
  },
  {
    id: 'FRONTMATTER_KEY_DRIFT',
    pattern: /^_memory:\s*$/m,
    severityForExisting: 'warn',
    severityForNew: 'fail',
    allowlist: [/^\.opencode\/specs\//, /^\.opencode\/skill\/system-spec-kit\/templates\/.*\.md$/], // existing corpus tolerated; new templates must use _continuity:
    message: 'Legacy _memory: frontmatter key; new templates and docs must use _continuity:',
  },
  {
    id: 'SLASH_COMMAND_DRIFT',
    pattern: /\/memory:(save|search|learn|manage)\b/g,
    severityForExisting: 'warn',
    severityForNew: 'fail',
    allowlist: [/^\.opencode\/specs\/.*\.md$/, /^\.opencode\/skill\/system-spec-kit\/references\/glossary\.md$/],
    message: 'Legacy /memory: slash command; prefer /continuity:',
  },
];
```

**Iter-grounding**: iter-3 #8 (severity rules), iter-6 R5 (memory_id canary), iter-7 PR3 (lint registration).

### Finding 4 — Mixed-mode warning CLI output

Output template for `npm run validate:continuity-frontmatter-mixed-mode`:

```
[validate:continuity-frontmatter-mixed-mode] Scanning .opencode/specs/**/*.md ...

WARN: spec folder mixes _memory: and _continuity: frontmatter keys across sibling docs
  spec_folder: system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/
  legacy (_memory:): spec.md, plan.md, tasks.md
  new (_continuity:): implementation-summary.md
  resolution: parser-fallback supports mixed mode; this is a warn, not an error.
              See glossary §3 (L3 Generated metadata) for migration guidance.
              Optional one-shot: npm run migrate:continuity-key -- {spec_folder}
              (rewrites all _memory: → _continuity: across the spec folder.)

INFO: spec folder uses only _memory: (legacy)
  spec_folder: system-spec-kit/022-hybrid-rag-fusion/...
  count: 12 files (all legacy)
  resolution: no action needed; parser-fallback covers them.

ERROR: spec folder has a single doc with BOTH keys in same frontmatter
  spec_folder: system-spec-kit/.../broken-doc.md
  resolution: pick one form; remove the other. The dual-key form is invalid YAML
              even though our parser-fallback reads either alone.

INFO: spec folder has no continuity frontmatter at all
  spec_folder: system-spec-kit/...
  resolution: not subject to migration; skipped.

Summary: scanned N spec folders. M warn, K error, J info, S skipped.
Glossary §3 documents the migration path.
```

**Iter-grounding**: iter-6 R3 (templates-vs-corpus mixed-mode risk); iter-7 PR3 (script registration).

### Finding 5 — `triad-parity-check.sh` failure modes (PR4)

Pre-commit hook at `scripts/git/triad-parity-check.sh`. Four failure scenarios:

**Mode A: AGENTS.md modified alone**:
```
[triad-parity-check] FAIL
Modified: AGENTS.md
NOT MODIFIED: AGENTS_Barter.md, AGENTS_example_fs_enterprises.md
Per MEMORY.md sync rule "AGENTS.md updates must sync the Barter + fs-enterprises siblings",
all three docs must be co-modified for shared gates / runtime contracts.
Either:
  (a) co-modify AGENTS_Barter.md and AGENTS_example_fs_enterprises.md, OR
  (b) bypass with SKIP_TRIAD_PARITY=1 git commit (logs an audit warning)
Aborting commit.
```

**Mode B: 3-of-4 with cross-repo orphan**:
```
[triad-parity-check] FAIL
Modified in this repo: AGENTS.md, AGENTS_example_fs_enterprises.md
NOT MODIFIED: AGENTS_Barter.md (cross-repo symlink)
Note: AGENTS_Barter.md resolves to a file in a SEPARATE Barter repo.
The edit must commit in BOTH this repo AND the Barter repo for triad parity.
Either:
  (a) follow the symlink and edit AGENTS_Barter.md in the Barter repo, then commit BOTH, OR
  (b) bypass with SKIP_TRIAD_PARITY=1 (logs an audit warning).
Aborting commit.
```

**Mode C: Barter-only orphan**:
```
[triad-parity-check] FAIL
Modified in this repo: AGENTS_Barter.md (cross-repo symlink target)
NOT MODIFIED: AGENTS.md, AGENTS_example_fs_enterprises.md
The Barter sibling has changed but the canonical AGENTS.md and the fs-enterprises sibling
have not. This is the inverse of Mode A and indicates a Barter-side commit that did not
propagate back to the canonical triad.
Either:
  (a) propagate the change to AGENTS.md + AGENTS_example_fs_enterprises.md, OR
  (b) bypass with SKIP_TRIAD_PARITY=1.
Aborting commit.
```

**Mode D: --no-verify bypass attempt**:
```
[triad-parity-check] WARN: Hook bypass attempted
Detected --no-verify or SKIP_TRIAD_PARITY=1 with triad doc(s) in commit.
Logging audit entry to scripts/git/triad-parity-bypass-audit.log:
  timestamp=2026-04-26T08:48:00.000Z
  user=michelkerkmeester
  modified=[AGENTS.md]
  reason=user-supplied or empty
Proceeding with commit (this WARN is non-blocking).
Per MEMORY.md sync rule, the audit log is reviewed during release cleanup.
```

**Iter-grounding**: iter-2 #3 (synced triad line numbers); iter-6 R4 (cross-repo symlink risk); iter-7 PR4 (hook spec); MEMORY.md AGENTS.md sync rule.

## Ruled Out

- **Telemetry payload using string union for callContext** without a fallback `'unknown'` value — would lose data when call site can't be resolved
- **Lint allowlist as a single regex** — separate allowlists per rule give clearer per-rule semantics
- **Pre-commit hook hard-failing on `--no-verify`** — Git gives users the bypass; a hard fail is technically impossible. Audit-log warn is the correct posture
- **Single-fixture parser test** — must test BOTH legacy and new forms produce identical output to verify fallback equivalence
- **Glossary lint with no allowlist** — historical spec docs would all fail; allowlist for `.opencode/specs/**` and the glossary itself is required

## Dead Ends

None — pure synthesis polish.

## Sources Consulted

- iter-2 #3 (synced triad line numbers); iter-2 #8 (alias matrix)
- iter-3 #1, #2, #3, #8 (parser sites + severity rules)
- iter-6 R1, R2, R3, R4, R5 (risk register)
- iter-7 PR1, PR3, PR4 (atomicity + lint + hook specs)
- MEMORY.md AGENTS.md sync rule
- spec.md REQ-002 + REQ-008

## Assessment

- **New information ratio**: 0.15 (synthesis polish; +0.10 simplicity bonus for canonical schemas + audit-log audit-bypass posture)
- **Questions answered**: none new (all 10 closed at iter-5; this is implementation-content polish)

## Reflection

- **What worked**: Treating each micro-payload as "what concrete content does the PR-author need?" gave clean copy-paste outputs. The audit-log + warn posture for `--no-verify` is the correct compromise (Git can't be hard-blocked; audit-log is the forensic equivalent).
- **What I'd do differently**: Iter-10 should produce the synthesis-prep deliverable (research.md outline + handover note) so the workflow exits cleanly into the synthesis phase.

## Recommended Next Focus

**Iter-10 — Synthesis prep + final convergence verdict.** Draft `research.md` outline (17-section template structure) anchored on the 6-row Q3 contract + 4-PR sequencing plan + 5-risk register + glossary content drafts. Plus a final STOP verdict for the workflow reducer.
