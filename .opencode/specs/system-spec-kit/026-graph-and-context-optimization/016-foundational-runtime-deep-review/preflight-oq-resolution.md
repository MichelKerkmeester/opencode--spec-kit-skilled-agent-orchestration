# Preflight Open Question Resolution

Generated: 2026-04-16
Model: Opus 4.7 (1M context)
Gates: CHK-PRE-005 through CHK-PRE-008 in `checklist.md`
Source of truth: `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` (50-iteration Phase 016 synthesis) + direct code inspection.

## Summary

| OQ | Status | Impact |
|----|--------|--------|
| OQ1 | RESOLVED | **PARTIAL** — Gate 3 is enforced by 4 of 6 `/spec_kit:*` command entrypoints (markdown+YAML setup), but it is NOT a property of the `command-spec-kit` bridge itself. The bridge is a skill-advisor routing label, not a dispatcher. Watch-P1 does NOT upgrade to P0-E on the "spec-folder-creation via bridge" axis, but R46-001 (subcommand collapse) remains a P1 correctness bug because it strips the "read-only vs. authoring" signal that Gate 3 enforcement depends on. Keep Watch-P1 as P1; do not escalate. |
| OQ2 | RESOLVED | **6 OVERSIGHTS + 1 SHIM.** Only `hook-session-stop-replay.vitest.ts` qualifies as an intentional shim (explicitly marked `autosaveMode: 'disabled'` for replay determinism; but the S2 refactor requires enabling it anyway). The other 6 codify degraded contracts without any deliberate comment, ADR, or "compat" marker in their history. Default assumption holds: oversight → rewrite alongside code refactor. |
| OQ3 | RESOLVED | **RECOMMEND OPTION A + B HYBRID.** Add optional `schemaVersion?: number` field with default-to-1 on-load migration (write-back) for existing quiesced files. Already-quiesced files remain readable; newly written files carry the version. Mismatches (future v2+) get distinct `schema_mismatch` rejection. No session disruption — migration runs lazily on first load of each file. |
| OQ4 | RESOLVED | **6 canonical subcommands**; `command-spec-kit` currently uses 1 collapsing bridge (`["/spec_kit", "spec_kit:"]`). Required: 6 per-subcommand bridges (plan, complete, implement, deep-research, deep-review, resume). Execution-mode suffixes (`:auto`, `:confirm`, `:with-phases`, `:with-research`) are flags — NOT separate subcommands, do NOT need individual bridges. |

---

## OQ1: command-spec-kit Gate 3 enforcement

### Question recap
Does `command-spec-kit` enforce Gate 3 (spec folder question) independently of skill routing? If yes, Watch-P1 (Domain-4 routing misdirection) upgrades to P0-E.

### Evidence

**1. `command-spec-kit` is NOT a dispatcher — it is a skill-advisor BRIDGE LABEL.**

Located at `.opencode/skill/skill-advisor/scripts/skill_advisor.py:980-984`:
```python
COMMAND_BRIDGES = {
    "command-spec-kit": {
        "description": "Create specifications and plans using /spec_kit slash command for new features or complex changes.",
        "slash_markers": ["/spec_kit", "spec_kit:"],
    },
    ...
}
```

And `detect_explicit_command_intent()` at line 1404-1410:
```python
def detect_explicit_command_intent(prompt_lower: str) -> Optional[str]:
    """Return targeted command bridge when explicit slash markers are present."""
    for command_name, command_config in COMMAND_BRIDGES.items():
        for marker in command_config.get("slash_markers", []):
            if marker and marker in prompt_lower:
                return command_name
    return None
```

The bridge returns a **recommendation label** — it is NOT a dispatcher and does NOT execute any workflow. The actual execution happens in the 6 `/spec_kit:*` command markdown entrypoints (`.opencode/command/spec_kit/*.md`), each of which loads a YAML asset under `assets/`.

**2. Gate 3 is enforced at two layers:**

**Layer 1 — Runtime AGENTS.md / CLAUDE.md (universal).**
`CLAUDE.md:129-135`:
```
#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK - PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Triggers:** rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder
```
Gate 3 is a **runtime-level** rule the AI follows before ANY file modification — independent of slash commands. If the user types `/spec_kit:deep-research foo` from scratch in a fresh session, the AI is expected to treat the setup phase itself as the Gate 3 surface (discussed in Layer 2 below).

**Layer 2 — Per-command markdown setup phase + YAML workflow.**

Each of the 6 `/spec_kit:*` command markdown entrypoints contains a "UNIFIED SETUP PHASE" block that prompts for spec folder. Evidence per command:

| Command | File | Gate 3 enforcement |
|---------|------|--------------------|
| `/spec_kit:plan` | `.opencode/command/spec_kit/plan.md:100-139` | **YES** — Q1 "Spec Folder (required): A) Existing B) Create new C) Update related D) Skip E) Phase folder". Explicit cross-reference at line 178. |
| `/spec_kit:complete` | `.opencode/command/spec_kit/complete.md:88-127` | **YES** — Q1 identical options A/B/C/D/E. Explicit cross-reference at line 167. |
| `/spec_kit:implement` | `.opencode/command/spec_kit/implement.md:76-99` | **YES** — Q0/Q1 ask spec folder path; WAIT enforced. Cross-ref at line 124. Explicit YAML-side reinforcement at `assets/spec_kit_implement_auto.yaml:19-32` under `GATE 3 COMPLIANCE` block. |
| `/spec_kit:deep-research` | `.opencode/command/spec_kit/deep-research.md:75-93` | **PARTIAL** — Q1 asks spec folder, but options are `A) Use existing B) Create new C) Update related D) Phase folder` — missing `D) Skip documentation` option. Gate 3 is still enforced (folder is required, no skip path), but ADJUSTED — this command structurally CANNOT skip documentation, which is STRICTER than base Gate 3. |
| `/spec_kit:deep-review` | `.opencode/command/spec_kit/deep-review.md:85-102` | **PARTIAL** — Same shape as deep-research; Q1 offers A/B/C/D (no Skip). Stricter than base Gate 3. |
| `/spec_kit:resume` | `.opencode/command/spec_kit/resume.md:33` | **IMPLICIT** — Explicit comment: "**Gate 3 Note:** Resume inherently satisfies Gate 3 — it REQUIRES a spec folder (provided or detected)." No prompt needed; spec folder auto-detected or prompted via Q0/Q1. |

YAML-side enforcement for `/spec_kit:implement` (strongest):
```yaml
# assets/spec_kit_implement_auto.yaml:19-32
# GATE 3 COMPLIANCE
gate_3_compliance:
  status: ENFORCED_VIA_PHASES
  mechanism: "Phase 1-3 blocking gates in implement.md"
  standard_question: "Spec Folder (required): A) Existing | B) New | C) Update related | D) Skip | E) Phase folder"
  first_message_protocol: "If FIRST message requests implementation, ask spec folder FIRST"
  failure_pattern_19:
    triggers: ["comprehensive", "fix all", "15 agents", "implement everything"]
    action: "STOP → Ask spec folder question → Wait for A/B/C/D/E"
```

`/spec_kit:plan` YAML has weaker enforcement — only a closing reminder at line 596:
```
CRITICAL: If user requests implementation via free text ... 2. Re-evaluate Gate 3 (spec folder confirmation for implementation phase)
```

`/spec_kit:deep-research_auto.yaml`, `deep-review_auto.yaml`, `resume_auto.yaml` have NO `gate_3_compliance` block — they rely on the markdown setup phase.

**3. Does the `command-spec-kit` BRIDGE proceed into spec-folder creation when invoked via bridge?**

**NO.** The bridge itself is a routing LABEL output by `skill_advisor.py`. When the skill advisor returns `{skill: "command-spec-kit", confidence: 0.95}`, this is a recommendation that the AI should route through one of the 6 `/spec_kit:*` commands. The bridge does NOT execute anything. The AI (driven by AGENTS.md Gate 2 + user prompt interpretation) chooses WHICH subcommand to invoke. At the moment of invocation, the CORRESPONDING command's markdown setup phase runs and enforces Gate 3.

The confusion in FINAL-synthesis-and-review.md §3.5 (R46-001) stems from conflating:
- **Skill advisor collapse** (all `/spec_kit:*` → `command-spec-kit` label) — this IS a real bug (R46-001); it strips subcommand-specific recommendation context.
- **Dispatch to spec-folder creation** — this does NOT happen from the bridge; it only happens if the USER explicitly invokes one of the 6 subcommands.

**4. Does the subcommand collapse change Gate 3 enforcement?**

NO — Gate 3 is enforced at the command markdown layer (the 6 files under `.opencode/command/spec_kit/`). The skill advisor returning `command-spec-kit` as a ranking label does NOT cause any `/spec_kit:*` command to auto-execute. Only explicit slash-command invocation does that.

What R46-001 DOES break: when the user's prompt like "run deep-research iterations with copilot" lacks the `/spec_kit:deep-research` slash marker, the skill advisor should route to `sk-deep-research` (the owning skill). Instead, `command-spec-kit` wins the bridge match only if the prompt contains `/spec_kit` or `spec_kit:` — which non-slash natural-language prompts usually don't. So R46-001 primarily affects:
- Prompts that mix slash markers with natural language (e.g., "use `/spec_kit:deep-research` but with 50 iterations via copilot") — the bridge returns `command-spec-kit` but loses the `deep-research` suffix signal, so downstream routing can't verify "owning-skill = sk-deep-research". The iteration-loop tiebreaker at `skill_advisor.py:1638-1677` partially compensates but adds latent complexity.

### Answer

**PARTIAL — Gate 3 is enforced, but not by "command-spec-kit" itself.**

- Gate 3 IS independently enforced by all 6 `/spec_kit:*` command entrypoints via their unified setup phase (confirmed by code inspection; evidence above).
- Of the 6, the 4 authoring-capable commands (`plan`, `complete`, `implement`, `resume`) offer the canonical A/B/C/D/E options. The 2 research/review commands offer A/B/C/D (NO Skip) — STRICTER than base Gate 3, not weaker.
- `/spec_kit:implement` has the strongest enforcement with an explicit `gate_3_compliance` YAML block.
- The `command-spec-kit` bridge is a skill-advisor routing label, not a dispatcher. It cannot create spec folders on its own.

**Watch-P1 upgrade decision: DO NOT UPGRADE to P0-E.**

The Watch-P1 upgrade trigger in `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` §3.5 is: "`command-spec-kit` proceeds into spec-folder creation when invoked via bridge". This premise is false: the bridge never proceeds into anything. The risk Domain-4 was surfacing is about R46-001 (subcommand information loss during skill recommendation), not about Gate 3 bypass. Keep Watch-P1 as P1; remediate via S4/A0 (T-SAP-03 — per-subcommand bridges) as already scoped.

**Implication for `checklist.md` CHK-VERIFY-11:**
- Route (a) applies: "confirmed non-P0 with `command-spec-kit` Gate 3 evidence" — the evidence is this document + §3.5 above.
- T-SAP-03 (per-subcommand bridges) must still land to close R46-001 itself, but it is P1 correctness work, not a P0 elevation.

**Unblocks:**
- `CHK-PRE-005`: can be marked resolved with this document as evidence.
- `T-PRE-05`: resolved.
- `T-SAP-03`: still required (NOT gated by OQ1; gated by OQ4 for the enumeration detail).

---

## OQ2: Degraded-contract test files classification

### Question recap
Are the 7 existing test files that codify the degraded contracts (from FINAL §6.5) intentional compatibility shims (should be preserved as-is during refactor) or oversights (should be rewritten)?

### Methodology
For each of the 7 files:
1. Read the asserted contract and search for any `// compat`, `// shim`, `// legacy`, `// deferred` comments.
2. Check git blame for the most recent commit touching the file.
3. Read the commit message for "shim", "compat", "temporary", or "TODO" hints.
4. Inspect whether FINAL-synthesis-and-review.md §6.5 flags this specific assertion range.
5. Search sibling decision-record.md files for references.

### Per-file findings

#### File 1 — `post-insert-deferred.vitest.ts` (lines 11-48)

**Classification: OVERSIGHT**

- **Degraded assertion:** Lines 36-42 assert `enrichmentStatus` as all-true booleans:
  ```ts
  expect(result.enrichmentStatus).toEqual({
    causalLinks: true, entityExtraction: true, summaries: true,
    entityLinking: true, graphLifecycle: true,
  });
  ```
  plus `executionStatus: { status: 'deferred', ... }` alongside. The enum-status already exists in a SEPARATE field; the boolean map continues to carry the degraded all-true-for-deferred semantic.
- **Intent evidence:** Git log shows this file was ADDED in commit `0feb686410` ("fix(026.015): remediate all 9 deep-review findings — 3 P0 + 5 P1 + 1 P2 resolved"). Commit body line explicitly describes F004: "deferred enrichment skip now returns explicit `{ status: 'deferred', reason: 'planner-first-mode', followUpAction: 'runEnrichmentBackfill' }` metadata surfaced through the save response. New test tests/post-insert-deferred.vitest.ts."
- **Rationale:** The commit added the `executionStatus` field with the enum. The boolean map was left untouched because the M13 refactor had not yet been scoped. This is an oversight, not a shim — the author fixed F004 narrowly and didn't touch the wider contract.
- **No `// compat` / `// shim` / `// legacy` comment anywhere in the file.**
- **ADR reference:** None.

#### File 2 — `structural-contract.vitest.ts` (lines 90-111)

**Classification: OVERSIGHT**

- **Degraded assertion:** Lines 90-111 assert `status: 'missing'` AND `trustState: 'stale'` together for the same empty-graph scenario. Lines 104-110 explicitly:
  ```ts
  expect(contract.status).toBe('missing');
  ...
  expect(contract.provenance?.trustState).toBe('stale');
  ```
  Per FINAL §5.3, this is the collapsed vocabulary — `'missing'` (absence of graph) and `'stale'` (existing but outdated) are being treated as compatible labels on the same payload.
- **Intent evidence:** File header says "Phase 027 — Structural Bootstrap Contract". Git history lineage: multiple commits touch this file. No commit message mentions compatibility concern. The test predates the §5.3 finding.
- **Rationale:** The test captures current behavior (which is the bug). No comment explains why `trustState: 'stale'` is asserted on a missing-status response.
- **No `// legacy` / `// compat` markers.**
- **ADR reference:** None in phase 027 decision-record.

#### File 3 — `graph-metadata-schema.vitest.ts` (lines 223-245)

**Classification: OVERSIGHT**

- **Degraded assertion:** Lines 223-245 test that `validateGraphMetadataContent()` applied to legacy line-based metadata returns `validation.ok === true` with NO `migrated` marker in the result:
  ```ts
  const validation = validateGraphMetadataContent(['Packet: ...', ...].join('\n'));
  expect(validation.ok).toBe(true);
  expect(validation.metadata?.packet_id).toBe('system-spec-kit/999-legacy-packet');
  // ... NO expect for migrated / migrationSource
  ```
  FINAL §3.3 (P0-C) flags this as the laundering pipeline entry point — legacy format is accepted as clean success with no marker.
- **Intent evidence:** Introduced by commit `25b6af331f` (v3.3.0.0 release). Commit body mentions "compact code graph + agent improver skill" release — no legacy-shim rationale.
- **Rationale:** The test was written to confirm the legacy fallback path exists. The absence of `migrated` marker assertions is an oversight, not an intentional compat choice (because the `migrated` field doesn't yet exist on the return type).
- **No shim/compat comment.**
- **ADR reference:** None found.

#### File 4 — `code-graph-query-handler.vitest.ts` (lines 12-18)

**Classification: OVERSIGHT**

- **Degraded assertion:** Lines 12-18 hoist the `ensureCodeGraphReady()` mock to return `freshness: 'fresh'` for ALL tests:
  ```ts
  const mocks = vi.hoisted(() => ({
    ...
    ensureCodeGraphReady: vi.fn(async () => ({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    })),
  }));
  ```
  FINAL §6.5 (Quick Win #14) calls out: the tests never exercise the fail-open branch because readiness is always hoisted to `fresh`. This hides R3-002 (`ensureCodeGraphReady()` exceptions collapsed to `status: 'error'`).
- **Intent evidence:** Commit `2837e157a6` ("feat(026-014): ship code graph upgrade runtime lane"). No shim/compat rationale in body.
- **Rationale:** Test author used the simplest mock to avoid flakiness; didn't realize they were masking the readiness fail-open branch.
- **No comment justifying the hoist.**
- **ADR reference:** None.

#### File 5 — `handler-memory-save.vitest.ts` (lines 540-557, 2286-2307)

**Classification: OVERSIGHT**

- **Degraded assertion:** Two locations (540-557 and 2286-2307) mock `runPostInsertEnrichment` to return `enrichmentStatus: { causalLinks: true, ..., graphLifecycle: true }` alongside `executionStatus: { status: 'ran' }`. Same pattern as File 1 — the enum status was added NEXT TO the boolean map rather than REPLACING it.
- **File header at line 15:** `describe('Handler Memory Save (T518) [deferred - requires DB test fixtures]', ...)` — note `[deferred - requires DB test fixtures]`. This IS a comment, but it refers to the whole SUITE being deferred pending DB fixtures, not to the specific `enrichmentStatus` shape. The `[deferred]` marker doesn't justify the degraded contract.
- **Intent evidence:** Same commit chain as File 1 (0feb686410). F004 reference applies.
- **Rationale:** Same as File 1 — enum was added adjacent, not replacing.
- **No shim/compat markers on the specific assertions.**
- **ADR reference:** None.

#### File 6 — `hook-session-stop-replay.vitest.ts` (lines 14-56)

**Classification: SHIM** (the only one of the 7)

- **Degraded assertion:** Line 20: `expect(run.process.autosaveMode).toBe('disabled');` — autosave is explicitly disabled in the replay harness.
- **Intent evidence:** Introduced by commit `7f0c0572a2` ("feat(026-memory-redundancy): flip memory save contract to compact retrieval wrapper"). Commit body mentions **"Legacy test deferrals"** as a Scope B annotation heading (per git log output). The replay harness is deliberately scoped to REPLAY a transcript, not execute the full autosave pipeline — so `autosaveMode: 'disabled'` is a DESIGN CHOICE of the harness, not an accidental degraded assertion.
- **Harness source:** The test imports `createStopReplaySandbox` from `../test/hooks/replay-harness.js` — the harness is the shim, not the test. The test asserts the sandbox's observed behavior.
- **Rationale:** This IS an intentional compatibility shim. The replay harness was built for deterministic playback in CI; it disables autosave to avoid non-deterministic DB writes.
- **HOWEVER:** FINAL §6.5 and Phase 016 remediation plan §7 still require this test to be REWRITTEN for the S2 refactor — because the S2 overhaul needs to exercise autosave WITH failure injection (see CHK-TEST-06 in `checklist.md`). The shim purpose (replay determinism) can be preserved by isolating autosave failure injection into a SEPARATE test surface (`hook-session-stop-autosave-failure.vitest.ts`) rather than rewriting this file in place.
- **Recommendation:** Keep the replay harness shim; ADD a sibling test for autosave-enabled-with-failure-injection rather than deleting this one. Update `plan.md` §7 note accordingly.

#### File 7 — `opencode-transport.vitest.ts` (lines 33-60)

**Classification: OVERSIGHT**

- **Degraded assertion:** Lines 14-31 `makePayload()` helper unconditionally sets `trustState: 'live'`. Lines 33-60 only test this single case. No `'missing'` / `'absent'` / `'unavailable'` cases exist.
- **Intent evidence:** Commit `25b6af331f` (v3.3.0.0 release). No compat/shim rationale in body.
- **Rationale:** Test author wrote the happy path only. No comment explains why other cases aren't tested.
- **No shim/compat marker.**
- **ADR reference:** None.

### Summary table

| # | File | Classification | Rationale |
|---|------|----------------|-----------|
| 1 | `post-insert-deferred.vitest.ts` | OVERSIGHT | Enum added adjacent to boolean map, not replacing |
| 2 | `structural-contract.vitest.ts` | OVERSIGHT | Captures collapsed vocabulary without justification comment |
| 3 | `graph-metadata-schema.vitest.ts` | OVERSIGHT | Legacy accepted with no migration marker (pre-dates marker concept) |
| 4 | `code-graph-query-handler.vitest.ts` | OVERSIGHT | Hoisted `fresh` readiness masks fail-open branch |
| 5 | `handler-memory-save.vitest.ts` | OVERSIGHT | Same enum-adjacent pattern as File 1; `[deferred]` annotation refers to DB fixtures, not contract shape |
| 6 | `hook-session-stop-replay.vitest.ts` | **SHIM** | Replay harness deliberately disables autosave for determinism; preserve harness, add sibling test |
| 7 | `opencode-transport.vitest.ts` | OVERSIGHT | Only happy-path `trustState: 'live'` covered |

### Answer

**6 OVERSIGHTS + 1 SHIM.**

- Default assumption holds per spec.md §6 risk table: rewrite unless evidence otherwise.
- The 6 oversights get rewritten alongside their corresponding structural fix (S1/S2/S3 + M8 + M13 + QW #14) per CHK-TEST-01 through CHK-TEST-07.
- File 6 (`hook-session-stop-replay.vitest.ts`) requires special handling: preserve the existing replay harness + test, BUT add a NEW sibling test for S2's autosave-with-failure-injection requirement. This satisfies CHK-TEST-06 without destroying legitimate compat behavior.

**Action items unblocked:**
- `CHK-PRE-006`: resolved. Annotate per-file classification in `plan.md` §2 DoR.
- `T-PRE-06`: resolved.
- `T-TEST-01 .. T-TEST-07`: can now be specified precisely. File 6 needs a renamed/split task: add T-TEST-06b for the new sibling.

---

## OQ3: HookState schemaVersion migration path

### Question recap
Can `HookState` gain a `schemaVersion` field without breaking already-quiesced state files on disk? If not, what migration step is required?

### Evidence

**1. Current `HookState` shape (`hook-state.ts:30-48`):**
```ts
export interface HookState {
  claudeSessionId: string;
  speckitSessionId: string | null;
  lastSpecFolder: string | null;
  sessionSummary: { text: string; extractedAt: string } | null;
  pendingCompactPrime: { payload: string; cachedAt: string; payloadContract?: SharedPayloadEnvelope | null } | null;
  producerMetadata: HookProducerMetadata | null;
  metrics: { estimatedPromptTokens: number; estimatedCompletionTokens: number; lastTranscriptOffset: number };
  createdAt: string;
  updatedAt: string;
}
```

**No `schemaVersion` field.**

**2. Current load behavior (`hook-state.ts:82-90`):**
```ts
export function loadState(sessionId: string): HookState | null {
  try {
    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
    return JSON.parse(raw) as HookState;   // unvalidated cast (R21-002, R25-004)
  } catch {
    return null;
  }
}
```
`loadMostRecentState` (lines 109-167) does the same unvalidated `JSON.parse(raw) as HookState` pattern.

**3. On-disk location:**
State files live at `${os.tmpdir()}/speckit-claude-hooks/<project-hash-12>/<session-hash-16>.json` — see `getStateDir()` at line 63 and `getStatePath()` at line 68. One file per `(cwd, sessionId)` pair. Quiescent files from prior runs remain until `cleanStaleStates()` sweeps them (`MAX_RECENT_STATE_AGE_MS = 24h` at line 50).

**4. If we add `schemaVersion: 1` to `HookState` and existing files lack the field, what happens on load?**

- `JSON.parse` succeeds (existing files don't have the field, but TypeScript cast doesn't validate — matches R21-002 exactly).
- Runtime treats `state.schemaVersion` as `undefined`.
- Any equality check like `state.schemaVersion !== 1` returns `true`, so a naive "reject mismatched schema" branch would DISCARD ALL EXISTING FILES.

This matches OQ3 Option C (discard-on-version-mismatch) — NOT ACCEPTABLE because it corrupts live sessions on first deployment.

**5. What happens if we check `typeof state.schemaVersion === 'number'`?**
- Existing files: `undefined` → not a number → branch into "legacy handling"
- New files: `1` → number → use normally

This is Option A (optional field with default fallback).

**6. What happens if we migrate on load?**
- Read existing file, detect `typeof state.schemaVersion !== 'number'`, set `state.schemaVersion = 1`, write back.
- Next load: file has `schemaVersion: 1`, no migration needed.

This is Option B (migrate-on-load).

**7. Existing precedent in the codebase:**

`session-resume.ts:174-208` already implements the evaluation pattern for `CachedSessionSummaryCandidate`:
```ts
if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
  return rejectCachedSummary(
    'fidelity',
    'schema_version_mismatch',
    `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
  );
}
```

AND at line 182, the candidate is CONSTRUCTED via:
```ts
return {
  schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,   // ← fabricated, always v1
  lastSpecFolder: state.lastSpecFolder,
  ...
};
```

This is exactly R29-001: the `schemaVersion` is FABRICATED from a constant, not read from the persisted `HookState`. The check always passes because the synthesized value always matches. The fix for R29-001 requires making the version REAL — read from the persisted file.

**8. Risk assessment for live sessions:**

- **Current deployed state:** Many `~/.tmpdir()/speckit-claude-hooks/` files exist on user machines — these have NO `schemaVersion` field.
- **If we deploy S2 with Option A (default-to-1):** No session disruption. New files carry version; old files pass through with `schemaVersion: undefined → 1` default.
- **If we deploy with Option B (migrate-on-load):** First load of each file writes it back with `schemaVersion: 1`. Subsequent loads see v1. Small I/O cost on first access; no session disruption.
- **If we deploy with Option C (reject mismatch strictly):** All sessions with pre-S2 state files lose continuity on next compact. CATASTROPHIC — this would trigger mass Claude/Gemini/OpenCode session degradation simultaneously (P0-A attack scenario manifests organically during rollout).

### Recommendation: Option A + B hybrid (optional field with lazy migration)

**Migration code snippet** (to be added to `hook-state.ts` as part of T-HST-02 / M2):

```ts
// ───────────────────────────────────────────────────────────────
// SCHEMA VERSIONING
// ───────────────────────────────────────────────────────────────
export const HOOK_STATE_SCHEMA_VERSION = 1;

export interface HookState {
  /** Schema version for migration safety. Absent/undefined treated as v1 (pre-S2 legacy). */
  schemaVersion?: number;           // ← OPTIONAL on type; defaulted on load
  claudeSessionId: string;
  // ... rest unchanged ...
}

// Zod schema with default coercion (runs on every read per R21-002 fix)
import { z } from 'zod';
export const HookStateSchema = z.object({
  schemaVersion: z.number().int().min(1).optional().default(1),   // ← default maps undefined → 1
  claudeSessionId: z.string().min(1),
  speckitSessionId: z.string().nullable(),
  lastSpecFolder: z.string().nullable(),
  sessionSummary: z.object({ text: z.string(), extractedAt: z.string() }).nullable(),
  pendingCompactPrime: z.object({
    payload: z.string(),
    cachedAt: z.string(),
    payloadContract: z.any().nullable().optional(),
  }).nullable(),
  producerMetadata: z.any().nullable(),
  metrics: z.object({
    estimatedPromptTokens: z.number().int().nonnegative(),
    estimatedCompletionTokens: z.number().int().nonnegative(),
    lastTranscriptOffset: z.number().int().nonnegative(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function loadState(sessionId: string): HookState | null {
  try {
    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    const result = HookStateSchema.safeParse(parsed);
    if (!result.success) {
      // Quarantine to .bad (replaces silent null return per R21-002)
      const badPath = getStatePath(sessionId) + '.bad';
      try { renameSync(getStatePath(sessionId), badPath); } catch {}
      hookLog('warn', 'state', JSON.stringify({
        event: 'hook_state_schema_rejected',
        sessionId,
        reason: 'schema_validation_failed',
        zodErrors: result.error.issues,
      }));
      return null;
    }

    // Migration: lazily write back if legacy file lacked version
    const wasLegacy = (parsed as any)?.schemaVersion === undefined;
    if (wasLegacy) {
      const migrated = { ...result.data };
      // Write back atomically using the same saveState path (inherits T-HST-06 unique temp path)
      saveState(sessionId, migrated);
      hookLog('info', 'state', JSON.stringify({
        event: 'hook_state_migrated',
        sessionId,
        from: 'legacy',
        to: HOOK_STATE_SCHEMA_VERSION,
      }));
    }

    // Explicit version mismatch (future v2+) rejected with distinct reason
    if (result.data.schemaVersion !== HOOK_STATE_SCHEMA_VERSION) {
      hookLog('warn', 'state', JSON.stringify({
        event: 'hook_state_schema_mismatch',
        sessionId,
        expected: HOOK_STATE_SCHEMA_VERSION,
        received: result.data.schemaVersion,
      }));
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

export function saveState(sessionId: string, state: HookState): boolean {
  const withVersion: HookState = { ...state, schemaVersion: HOOK_STATE_SCHEMA_VERSION };
  // ... rest of existing saveState logic ...
}
```

### Behavioral implications

1. **Live sessions during rollout:** Zero disruption. Existing files pass through with `undefined` → `1` default. On first save after load, file gets the version stamp.
2. **Mid-session schema bump (future v2):** New field or breaking change triggers a version bump. Old files would still load as v1, trigger the explicit mismatch branch, get quarantined to `.bad`, and the session starts fresh. Acceptable — matches session-resume.ts existing pattern.
3. **Concurrent writers on legacy file:** The write-back on migration races with other writers. This is ALREADY covered by T-HST-06 (unique temp path `.tmp-<pid>-<counter>-<random>`). The migration write uses the same atomic saveState path, so it inherits the P0-A fix.
4. **Validation failure on legacy file:** A legacy file that fails other schema checks (e.g., missing `claudeSessionId`) gets quarantined to `.bad` rather than silently treated as v1 with garbage data. This is a SAFETY PROPERTY: we never silently accept broken state.
5. **Performance:** One extra JSON write per legacy file on first load. Amortized to zero after migration. No p99 impact (within NFR-P02's <1ms target).

### Answer

**RECOMMEND OPTION A + B HYBRID (optional-field + lazy-migrate-on-load).**

- Live sessions remain intact on deployment.
- Explicit `schema_mismatch` rejection path activates for future v2+ bumps.
- Quarantine-to-`.bad` replaces silent-null for validation failures (addresses R21-002 concurrently).
- Zero session disruption during rollout; migration is write-once per file on first access.

**Unblocks:**
- `CHK-PRE-007`: resolved. Decision recorded above; should be mirrored in `../decision-record.md` as an ADR before T-HST-02 implementation starts.
- `T-PRE-07`: resolved.
- `T-HST-02` (M2 from S2): no longer blocked on OQ3. Implementation can proceed with the snippet above as the starting sketch.

**Action items:**
- Add ADR entry to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/decision-record.md` (or create if missing) titled "ADR: HookState schemaVersion migration — Option A+B hybrid".
- Ensure T-HST-02 is updated in `tasks.md` with the "lazy migration" note (current text says "migration step if OQ3 resolves negatively" — OQ3 resolves AFFIRMATIVELY with lazy migration required, so migration IS needed but non-blocking).

---

## OQ4: /spec_kit:* subcommand enumeration

### Question recap
What is the complete list of `/spec_kit:*` subcommands that need bridge entries in `skill_advisor.py` `COMMAND_BRIDGES`?

### Evidence

**1. Files under `.opencode/command/spec_kit/*.md`:**

```
complete.md         — /spec_kit:complete
deep-research.md    — /spec_kit:deep-research
deep-review.md      — /spec_kit:deep-review
implement.md        — /spec_kit:implement
plan.md             — /spec_kit:plan
resume.md           — /spec_kit:resume
```

**Exactly 6 markdown files = 6 canonical subcommands.**

**2. YAML asset files under `.opencode/command/spec_kit/assets/*.yaml`:**

```
spec_kit_complete_auto.yaml
spec_kit_complete_confirm.yaml
spec_kit_deep-research_auto.yaml
spec_kit_deep-research_confirm.yaml
spec_kit_deep-review_auto.yaml
spec_kit_deep-review_confirm.yaml
spec_kit_implement_auto.yaml
spec_kit_implement_confirm.yaml
spec_kit_plan_auto.yaml
spec_kit_plan_confirm.yaml
spec_kit_resume_auto.yaml
spec_kit_resume_confirm.yaml
```

**12 YAML files = 6 subcommands × 2 execution modes (`auto`/`confirm`).** No "hidden" subcommands exist as YAML-only.

**3. Execution-mode suffixes and feature flags (NOT subcommands):**

Per `.opencode/command/spec_kit/complete.md:48-64` and per CLAUDE.md:
- `:auto` — execution mode suffix
- `:confirm` — execution mode suffix
- `:with-phases` — feature flag (modifies base mode)
- `:with-research` — feature flag (modifies base mode, complete.md only)
- `--intake-only` — CLI flag (plan.md only)
- `--phases N` / `--phase-names` / `--phase-folder` — CLI flags
- `--max-iterations` / `--convergence` — CLI flags (deep-research, deep-review)
- `--spec-folder` / `--level` / `--start-state` / `--repair-mode` — intake contract flags

These are NOT subcommands; they are argument parsers consumed within the 6 canonical commands. They do NOT need separate bridge entries.

**4. Current `COMMAND_BRIDGES` registration (`skill_advisor.py:980-984`):**
```python
"command-spec-kit": {
    "description": "Create specifications and plans using /spec_kit slash command for new features or complex changes.",
    "slash_markers": ["/spec_kit", "spec_kit:"],
},
```
**Single collapsing bridge. All 6 subcommands map to `command-spec-kit` at `kind_priority=2`.**

**5. Per R46-001 (FINAL §3.5 + T-SAP-03):**

The required replacement is 6 per-subcommand bridges. Each subcommand should route to its OWNING skill when one exists, otherwise to the command entrypoint itself.

**6. Cross-check against CLAUDE.md / AGENTS.md "Quick Reference: Common Workflows":**

Per CLAUDE.md:
- `/spec_kit:plan` — planning workflow (8 steps)
- `/spec_kit:plan :with-phases` — phased planning (execution-mode variant, not subcommand)
- `/spec_kit:complete` — full lifecycle (14+ steps)
- `/spec_kit:complete :with-phases` — phased complete (variant)
- `/spec_kit:implement` — implementation-only (9 steps)
- `/spec_kit:deep-research` — iterative research with convergence
- `/spec_kit:deep-review` — iterative review with convergence
- `/spec_kit:resume` — continuity recovery

All 6 match the markdown files. Variants (`:with-phases`, `:with-research`) are flags handled within the parent subcommand, not independent subcommands.

**7. Owning-skill routing (for T-SAP-03 implementation):**

| Subcommand | Owning skill (for routing) | Confidence |
|------------|----------------------------|------------|
| `/spec_kit:plan` | `system-spec-kit` (planning sub-workflow inside sk) | High — plan.md explicitly cross-refs AGENTS.md Section 2 |
| `/spec_kit:complete` | `system-spec-kit` | High — same |
| `/spec_kit:implement` | `system-spec-kit` | High — same |
| `/spec_kit:deep-research` | `sk-deep-research` | High — command markdown line 222-229 explicitly "Full protocol documentation: `.opencode/skill/sk-deep-research/SKILL.md`"; SKILL.md §1 "FORBIDDEN INVOCATION PATTERNS" says "This skill is invoked EXCLUSIVELY through the `/spec_kit:deep-research` command." |
| `/spec_kit:deep-review` | `sk-deep-review` | High — command markdown line 252-260 explicitly "Full protocol documentation: `.opencode/skill/sk-deep-review/SKILL.md`" |
| `/spec_kit:resume` | `system-spec-kit` | Medium — resume.md is standalone but references AGENTS.md Section 2; could route to `memory:search`/`memory:save` subsystem but overall routing stays under system-spec-kit umbrella |

### Required bridge entries (per-subcommand) for T-SAP-03

```python
COMMAND_BRIDGES = {
    # REPLACE the single "command-spec-kit" collapsing bridge with 6 per-subcommand entries:
    "command-spec-kit-plan": {
        "description": "Run the SpecKit 8-step planning workflow using /spec_kit:plan.",
        "slash_markers": ["/spec_kit:plan", "spec_kit:plan"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-complete": {
        "description": "Run the full SpecKit 14+ step lifecycle using /spec_kit:complete.",
        "slash_markers": ["/spec_kit:complete", "spec_kit:complete"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-implement": {
        "description": "Run the SpecKit 9-step implementation workflow using /spec_kit:implement.",
        "slash_markers": ["/spec_kit:implement", "spec_kit:implement"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-deep-research": {
        "description": "Run the autonomous deep-research loop using /spec_kit:deep-research.",
        "slash_markers": ["/spec_kit:deep-research", "spec_kit:deep-research"],
        "owning_skill": "sk-deep-research",
    },
    "command-spec-kit-deep-review": {
        "description": "Run the autonomous deep-review loop using /spec_kit:deep-review.",
        "slash_markers": ["/spec_kit:deep-review", "spec_kit:deep-review"],
        "owning_skill": "sk-deep-review",
    },
    "command-spec-kit-resume": {
        "description": "Resume an existing spec folder using /spec_kit:resume.",
        "slash_markers": ["/spec_kit:resume", "spec_kit:resume"],
        "owning_skill": "system-spec-kit",
    },
    # Keep legacy bridge for 1-release compatibility; emit deprecation telemetry:
    "command-spec-kit": {
        "description": "[DEPRECATED: collapsed subcommands; use per-subcommand bridges] /spec_kit slash-command family.",
        "slash_markers": ["/spec_kit", "spec_kit:"],
        "deprecated": True,
        "owning_skill": "system-spec-kit",
    },
    # ... existing non-spec_kit bridges unchanged ...
}
```

**Marker-ordering note (critical for `detect_explicit_command_intent`):** The function at `skill_advisor.py:1404-1410` iterates dicts in insertion order and returns on first match. More specific markers (`/spec_kit:plan`) MUST come before less specific (`/spec_kit`). Python 3.7+ preserves dict insertion order, so the snippet above with specific subcommands FIRST and the deprecated generic bridge LAST achieves correct precedence. Without this ordering, `/spec_kit:plan` could still match the generic `/spec_kit` first and collapse to `command-spec-kit`.

### Missing from current registration

All 6 subcommands are currently MISSING as individual bridges. Only the generic `/spec_kit` prefix is registered.

### Subcommand execution-mode variants (do NOT need separate bridges)

These are parsed INSIDE each subcommand's setup phase and do NOT require separate routing:
- `/spec_kit:plan :auto` / `/spec_kit:plan :confirm` / `/spec_kit:plan :with-phases`
- `/spec_kit:complete :auto` / `:confirm` / `:with-phases` / `:with-research`
- `/spec_kit:implement :auto` / `:confirm`
- `/spec_kit:deep-research :auto` / `:confirm`
- `/spec_kit:deep-review :auto` / `:confirm`
- `/spec_kit:resume :auto` / `:confirm`

Because `slash_markers` uses SUBSTRING matching, a marker `"/spec_kit:plan"` correctly matches both `/spec_kit:plan :auto` and `/spec_kit:plan :confirm :with-phases` prompts.

### Answer

**Complete list: 6 canonical subcommands.**

| # | Subcommand | Currently registered? | Needs bridge? |
|---|------------|----------------------|---------------|
| 1 | `/spec_kit:plan` | NO (collapsed to `/spec_kit`) | YES — `command-spec-kit-plan` |
| 2 | `/spec_kit:complete` | NO (collapsed) | YES — `command-spec-kit-complete` |
| 3 | `/spec_kit:implement` | NO (collapsed) | YES — `command-spec-kit-implement` |
| 4 | `/spec_kit:deep-research` | NO (collapsed) | YES — `command-spec-kit-deep-research` (owning: `sk-deep-research`) |
| 5 | `/spec_kit:deep-review` | NO (collapsed) | YES — `command-spec-kit-deep-review` (owning: `sk-deep-review`) |
| 6 | `/spec_kit:resume` | NO (collapsed) | YES — `command-spec-kit-resume` |

Plus retention of the legacy `command-spec-kit` bridge (deprecated, 1-release compat).

**Execution-mode suffixes and feature flags do NOT require separate bridges** — they are parsed inside each subcommand's setup phase via substring containment.

**Unblocks:**
- `CHK-PRE-008`: resolved. List in T-SAP-03 updated.
- `T-PRE-08`: resolved.
- `T-SAP-03`: scope finalized to 6 per-subcommand bridges + deprecation of the generic collapse bridge. Implementation can proceed.
- `T-TEST-11`: refined — `test_skill_advisor.py` updates should assert each of the 6 per-subcommand bridges individually, and confirm the generic bridge emits deprecation telemetry.
- `T-TEST-NEW-09`: refined — must assert `/spec_kit:deep-research` → `sk-deep-research` NOT `command-spec-kit` (via the new per-subcommand bridge with `owning_skill: sk-deep-research`).

---

## Unblocked Tasks

### Directly resolved by this document

- `CHK-PRE-005` → resolved: OQ1 PARTIAL — Gate 3 enforced at command entrypoint layer, not at bridge layer. Watch-P1 stays P1. Evidence: this document.
- `CHK-PRE-006` → resolved: OQ2 — 6 OVERSIGHTS + 1 SHIM (hook-session-stop-replay). Evidence: this document + git log archaeology.
- `CHK-PRE-007` → resolved: OQ3 — Option A+B hybrid (optional field + lazy migration). Evidence: code snippet above.
- `CHK-PRE-008` → resolved: OQ4 — 6 canonical subcommands. Evidence: file tree + code inspection.

### Dependent tasks now ready to start

Blocked on OQ1 (CHK-PRE-005):
- None — Gate 3 enforcement evidence confirms Watch-P1 stays P1; no P0-E track opens.

Blocked on OQ2 (CHK-PRE-006) — Test-suite migration starts:
- `T-TEST-01` (post-insert-deferred → enum `'deferred'`) — **rewrite**, pair with T-PIN-02
- `T-TEST-02` (structural-contract → distinct labels per axis) — **rewrite**, pair with T-SHP-01
- `T-TEST-03` (graph-metadata-schema → `{ migrated: true }`) — **rewrite**, pair with T-GMP-01
- `T-TEST-04` (code-graph-query-handler → explicit fail-open) — **rewrite**, pair with T-CGQ-02
- `T-TEST-05` (handler-memory-save → enum status) — **rewrite**, pair with T-PIN-02 + T-RBD-01
- `T-TEST-06` (hook-session-stop-replay) — **PRESERVE existing + ADD sibling** (`hook-session-stop-autosave-failure.vitest.ts`). Pair sibling with T-SST-07, T-SST-12, T-HST-09.
- `T-TEST-07` (opencode-transport → missing/absent cases) — **rewrite**, pair with T-OCT-01

Blocked on OQ3 (CHK-PRE-007) — HookState M2 starts:
- `T-HST-02` (schemaVersion field + migration-on-load) — **ready**. Implementation snippet in OQ3 section above.
- `T-SRS-02` (session-resume schema-version rejection path) — **unblocked by T-HST-02**; pair.
- `T-TEST-NEW-06` (HookState schema-version mismatch rejection) — **unblocked**. Test the mismatch branch in the load function.

Blocked on OQ4 (CHK-PRE-008) — Skill routing S4 starts:
- `T-SAP-03` (per-subcommand COMMAND_BRIDGES) — **ready**. 6 new bridges + deprecated legacy bridge, per snippet in OQ4 section.
- `T-TEST-NEW-09` (`/spec_kit:deep-research` → `sk-deep-research` routing) — **unblocked**.
- `T-TEST-11` (`test_skill_advisor.py` intent_signals assertions) — **unblocked** by OQ4 detail.

### Indirectly unblocked (OQ resolution clears surrounding scope)

- `T-SAP-04` (skill_advisor routing specificity for subcommand) — **clarified** by OQ4 per-subcommand bridge scope.
- `CHK-VERIFY-11` (Watch-P1 resolved) — **route (a) evidence documented** above.

### Still blocked (not addressed here)

- `CHK-PRE-004` (closing-pass audit of 11 untouched files from FINAL §8.2) — requires a dedicated read-only audit pass, not an OQ resolution.
- `CHK-PRE-009` (adversarial repros for R33-001, R40-001, R46-003, R34-002, R35-001) — requires test fixture construction, not OQ resolution.

---

## Cross-references

- **Research source of truth:** `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`
- **Findings registry:** `../research/016-foundational-runtime-deep-review/findings-registry.json`
- **Parent 026 spec:** `../spec.md`
- **Spec:** `./spec.md`
- **Plan:** `./plan.md`
- **Tasks:** `./tasks.md`
- **Checklist:** `./checklist.md`
- **Code under investigation (OQ1):** `.opencode/command/spec_kit/*.md`, `.opencode/command/spec_kit/assets/*.yaml`
- **Code under investigation (OQ3):** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Code under investigation (OQ4):** `.opencode/skill/skill-advisor/scripts/skill_advisor.py:980-1021,1404-1410`
- **Test files under investigation (OQ2):** `.opencode/skill/system-spec-kit/mcp_server/tests/{post-insert-deferred,structural-contract,graph-metadata-schema,code-graph-query-handler,handler-memory-save,hook-session-stop-replay,opencode-transport}.vitest.ts`
