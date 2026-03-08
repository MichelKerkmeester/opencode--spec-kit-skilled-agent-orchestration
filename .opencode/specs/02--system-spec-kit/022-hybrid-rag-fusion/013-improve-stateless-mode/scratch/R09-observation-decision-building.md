# R09 Observation and decision building for stateless mode

## Scope

Research target: how to build richer observations, decisions, synthetic learning metrics, and session characteristics when stateless mode only has OpenCode capture plus repository/spec-folder signals.

Primary source files reviewed:

- `scripts/extractors/collect-session-data.ts` (`collectSessionData()`, preflight/postflight handling)
- `scripts/extractors/session-extractor.ts` (interfaces, context/importance/phase/tool detection)
- `scripts/utils/input-normalizer.ts` (`transformOpencodeCapture()`)
- `scripts/extractors/opencode-capture.ts` (`buildExchanges()`, raw OpenCode capture shape)
- `scripts/extractors/decision-extractor.ts`
- `scripts/extractors/implementation-guide-extractor.ts`
- existing spec artifacts and templates for `plan.md`, `decision-record.md`, and `implementation-summary.md`

## Current gaps

Stateless mode loses quality mainly because the OpenCode transform emits only `userPrompts`, `observations`, `recentContext`, and `FILES`, while skipping structured fields such as `SPEC_FOLDER`, `_manualDecisions`, `_manualTriggerPhrases`, `preflight`, and `postflight` (`scripts/utils/input-normalizer.ts:353-482`, `scripts/extractors/collect-session-data.ts:725-758`).

The remaining observations are thin:

- assistant exchanges become generic `feature` observations with an 80-char title and no structured facts (`scripts/utils/input-normalizer.ts:398-425`)
- tool-call observations keep only tool name, title, status, and maybe one file path (`scripts/utils/input-normalizer.ts:430-451`)
- `detectSessionCharacteristics()` currently depends only on observations, prompts, and extracted files, so sparse observations directly degrade `decisionCount`, `toolCounts`, `contextType`, and `importanceTier` (`scripts/extractors/session-extractor.ts:426-437`)
- implementation-guide output is only as good as the observation/file stream feeding it (`scripts/extractors/collect-session-data.ts:741-743`, `scripts/extractors/implementation-guide-extractor.ts:68-80`)

OpenCode capture itself still has useful latent signals that are mostly discarded today:

- full commit-worthy assistant text is already captured up to `TOOL_OUTPUT_MAX_LENGTH` during exchange building (`scripts/extractors/opencode-capture.ts:483-497`)
- tool executions carry `input`, `output`, `duration`, `call_id`, `status`, `messageId`, and `title`, but transform currently throws most of that away (`scripts/extractors/opencode-capture.ts:55-66`, `scripts/utils/input-normalizer.ts:430-451`)

## Recommendation: add a stateless enrichment phase before `collectSessionData()`

Add a repository-aware enrichment stage between `transformOpencodeCapture()` and `collectSessionData()`:

1. Preserve raw OpenCode capture evidence.
2. Mine git commits, git status, and spec-folder docs.
3. Synthesize additional observations, decisions, preflight/postflight, and characteristics.
4. Write enriched fields back into the normalized collected-data object so downstream extractors can keep using the existing interfaces.

This is the lowest-risk integration point because `collectSessionData()` already knows how to consume:

- `observations`
- `FILES`
- `_manualDecisions`
- `preflight`
- `postflight`
- `SPEC_FOLDER`

That means stateless quality can improve without redesigning the rendering layer.

---

## 1. Observation synthesis from git commits

### Why git commits are the strongest stateless signal

Git history provides exactly the evidence stateless mode is missing:

- intentional summaries in commit subjects
- rationale in commit bodies
- changed-file associations via diff
- chronology and session progression

The recent history in this repository already shows commit subjects with strong semantic signal and conventional prefixes such as `fix(spec-kit):`, `feat(system-spec-kit):`, `refactor(...)`, `docs(...)`, and `release(...)` from `git log` on the extractor/loaders paths during this research.

### Proposed observation mapping

Treat each relevant commit as one high-confidence observation:

```ts
interface GitObservationSeed {
  sha: string;
  subject: string;
  body: string;
  timestamp: string;
  files: string[];
  stats: { added: number; deleted: number; fileCount: number };
}
```

Transform to the existing observation shape:

```ts
{
  type: inferObservationTypeFromCommit(subject, body),
  title: subject,
  narrative: buildCommitNarrative(subject, body, stats),
  facts: [
    `Commit: ${shortSha}`,
    `Files changed: ${fileCount}`,
    `Additions: ${added}`,
    `Deletions: ${deleted}`,
    ...bodyBulletFacts,
    ...conventionalCommitFacts
  ],
  timestamp,
  files
}
```

### Type inference rules

Use subject-first classification, then fall back to body keywords:

| Pattern | Observation type |
|---|---|
| `fix:` / `fix(` / `bug` / `hotfix` | `bugfix` |
| `feat:` / `feature` / `implement` | `feature` |
| `refactor:` / `cleanup` / `restructure` | `refactor` |
| `docs:` / `readme` / `documentation` | `documentation` or `observation` |
| `test:` | `verification` or `observation` |
| `release:` / `publish` / `ship` | `milestone` or `feature` |
| no prefix but contains decision cues | `decision` |
| otherwise | reuse `detectObservationType()` on combined subject/body |

This aligns with existing lexical classification in `file-extractor.ts:83-98` and avoids inventing a second incompatible type system.

### Narrative construction

Build the narrative from:

1. the full commit subject
2. the first 2-4 non-empty body lines
3. a compact diff summary

Example template:

```text
fix(spec-kit): refine Opencode capture transformation with spec-folder relevance filtering.
Changed 2 files (+46/-4). Key details: refine OpenCode capture transformation; preserve spec-folder relevance filtering.
```

If the body contains bullet points, keep them as `facts` instead of flattening them into one paragraph.

### File association

Associate files from commit diff, not just current working tree:

- `git show --name-only --format=... <sha>`
- or `git log --name-only --follow -- <path>`

This is stronger than current stateless `FILES`, which only sees `edit`/`write` tool calls (`scripts/utils/input-normalizer.ts:458-472`).

### Relevance strategy

For stateless mode, prefer soft scoring over hard dropping:

- keep commits touching the target spec folder directly
- keep commits touching code files named in current `FILES`
- keep commits whose subject/body mention spec keywords
- annotate each commit with `relevanceScore`
- drop only clearly unrelated commits below threshold

This avoids the same over-filtering problem already identified in the current OpenCode relevance filter.

### Implementation notes

- Limit to the last 5-15 commits or last 24-72 hours for performance.
- Deduplicate against existing OpenCode observations by matching normalized subject/title text.
- Mark commit-derived observations with `facts += ['Source: git commit']`.

---

## 2. Decision extraction from multiple sources

### Current state

`decision-extractor.ts` already knows how to produce rich `DecisionRecord` objects with:

- `OPTIONS`
- `CHOSEN`
- `RATIONALE`
- `CONFIDENCE`
- evidence/caveats/follow-up placeholders

But in stateless mode the upstream data almost never includes `_manualDecisions`, and assistant-response observations are not structured as decisions (`scripts/extractors/decision-extractor.ts:111-260`).

### Proposal: multi-source decision pipeline

Build decisions from four ranked sources, then merge:

1. **Spec `decision-record.md`** - highest confidence
2. **Plan.md architectural sections** - medium/high confidence
3. **Git commit messages and bodies** - medium confidence
4. **OpenCode lexical decision cues** - fallback, lowest confidence

### A. Git commit message decisions

Mine decisions from commit subjects/bodies when they contain cues already similar to `DECISION_CUE_REGEX` (`scripts/extractors/decision-extractor.ts:36`):

- `chose`
- `decided to`
- `selected`
- `adopt`
- `use X instead of Y`
- `keep existing`
- conventional commit subjects that imply a chosen direction

Suggested parser:

```ts
interface SyntheticDecisionCandidate {
  source: 'git-commit';
  title: string;
  chosen: string;
  rationale: string;
  alternatives: string[];
  files: string[];
  confidence: number;
  evidence: string[];
}
```

Heuristics:

- subject with explicit cue -> confidence 75
- body with rationale markers (`because`, `to avoid`, `so that`, `instead of`) -> +10
- alternatives found (`instead of`, `rather than`, `vs`, `alternative`) -> +5
- files span multiple critical paths -> mark importance `high`

### B. `decision-record.md` parsing

The level-3 template is highly structured and easy to parse:

- `## ADR-001: [Decision Title]`
- metadata table with `Status`, `Date`, `Deciders`
- `### Context`
- `### Decision`
- `### Alternatives Considered`
- `### Consequences`
- `### Implementation`

Source shape confirmed in:

- template: `.agents/skills/system-spec-kit/templates/level_3/decision-record.md`
- real example: `.../011-feature-catalog/decision-record.md`

Recommended extraction:

| Decision field | Source section |
|---|---|
| `TITLE` | ADR heading |
| `CONTEXT` | Context section |
| `CHOSEN` | `**We chose**:` line |
| `RATIONALE` | `Why this one` and/or `How it works` |
| `OPTIONS` | alternatives table rows |
| `PROS` / `CONS` | alternatives table columns |
| `EVIDENCE` | Five Checks rows + implementation bullets |
| `TIMESTAMP` | metadata date |
| `CONFIDENCE` | 90 if status is Accepted, 60 if Proposed |

This should produce near-complete `DecisionRecord` objects with very little guesswork.

### C. `plan.md` decision extraction

`plan.md` is less explicit than an ADR, but the template still contains decision-bearing sections:

- `Technical Context`
- `Overview`
- `Pattern`
- `Key Components`
- `Data Flow`
- `Dependencies`
- `Rollback`

Real plans, such as `012-perfect-session-capturing/plan.md`, also contain phase structure and critical-file selections that represent choices.

Recommended parser:

- treat `### Pattern` as an architectural choice when not placeholder text
- treat named phase strategy as an execution decision
- extract `Critical Files` and `Verification` as rationale/evidence, not standalone decisions
- detect phrases like `we will`, `approach`, `strategy`, `deferred`, `keep`, `split`, `five-phase`, `two-stream`

Confidence guidance:

- explicit strategy statement -> 70
- inferred from section structure only -> 55

### D. Implementation-summary extraction

User noted implementation-guide data is currently absent in stateless mode. The best stateless source is often `implementation-summary.md`, which contains:

- overview of what changed
- modified files
- fix categories
- build verification
- remaining work

This should not create primary decisions often, but it is excellent:

- rationale evidence for decisions
- postflight evidence
- implementation guide enrichment

### Merge strategy

Decisions from multiple sources should merge on normalized title or chosen approach:

1. Parse all candidates.
2. Group by normalized decision key.
3. Prefer higher-confidence source as primary.
4. Merge in additional evidence, alternatives, files, and rationale fragments.

Confidence order:

`decision-record.md` > plan.md explicit decision > git commit cue > OpenCode lexical cue

### Suggested output contract

Produce both:

- rich `DecisionRecord[]` for downstream rendering
- lightweight decision observations for `detectSessionCharacteristics()` and topic extraction

That prevents decisions from being invisible to collectors that only inspect observations.

---

## 3. Synthetic preflight and postflight

### Current state

`collect-session-data.ts` already supports rich preflight/postflight fields and a Learning Index formula:

`LI = (deltaKnow * 0.4) + (deltaUncert * 0.35) + (deltaContext * 0.25)`

But stateless mode never populates `preflight` or `postflight`, so every field falls back to null/defaults (`scripts/extractors/collect-session-data.ts:198-304`).

### A. Synthetic preflight from spec-folder state

Estimate baseline readiness from documentation completeness at session start.

#### Input signals

- `spec.md` exists
- `plan.md` exists
- `tasks.md` exists
- `checklist.md` exists
- `decision-record.md` exists
- `implementation-summary.md` absent/present
- scratch research already present
- spec status from frontmatter / metadata table

#### Proposed scoring

```ts
knowledgeScore =
  20 if spec.md exists +
  20 if plan.md exists +
  15 if tasks.md exists +
  10 if checklist.md exists +
  10 if decision-record.md exists +
  10 if prior scratch/research exists +
  15 if spec metadata status is Planning/Implementation and non-placeholder

contextScore =
  25 if SPEC_FOLDER resolved +
  20 if related docs detected +
  20 if prior scratch docs exist +
  15 if recent commits touch target area +
  20 if files under target path already tracked by git

uncertaintyScore = 100 - weightedReadinessScore
confidence = clamp((knowledgeScore * 0.45) + (contextScore * 0.35) + docCompletenessBonus, 0, 100)
```

#### Readiness label

| Condition | Readiness |
|---|---|
| spec only | `low` |
| spec + plan + tasks | `medium` |
| plus checklist/decision docs | `high` |
| plus implementation summary or verified outputs | `very-high` |

#### Gaps

Populate `gaps` with specific missing artifacts:

- `Missing plan.md`
- `Missing tasks.md`
- `Missing decision-record.md for architecture-heavy task`
- `No implementation summary from prior iteration`

This makes preflight useful even when heuristic.

### B. Synthetic postflight from git + spec evidence

Estimate completed work from repository state after the session.

#### Input signals

- `git status --short`
- current diff stats
- recent commits touching the target scope
- presence/updates of `implementation-summary.md`
- build/test evidence found in commit bodies or summary docs
- newly created scratch outputs or related docs

#### Proposed postflight scoring

```ts
knowledgeScore =
  preflight.knowledgeScore +
  10 if new commit exists +
  10 if commit body explains rationale +
  10 if implementation-summary.md exists or changed +
  5  if decision-record.md added/updated +
  5  if tests/build evidence found

contextScore =
  preflight.contextScore +
  15 if changed files mapped to observations +
  10 if related docs now detectable +
  10 if implementation guide can name key files and roles +
  5  if blockers reduced or next actions clarified

uncertaintyScore =
  preflight.uncertaintyScore
  - 15 if explicit decisions captured
  - 10 if test/build evidence present
  - 10 if file/workflow evidence confirms implementation
```

Clamp all values to 0-100.

#### Gaps closed / new gaps

Use artifact comparisons:

- `Missing plan.md` -> closed when file appears
- `No changed files associated with session` -> closed when git diff exists
- `No verification evidence` -> still open or new if tests absent after changes

#### Tests passing heuristic

Do not guess. Mark test success only when evidence exists, for example:

- commit body contains `tests pass`, `all tests passing`, `npx tsc --build PASS`
- implementation summary has a build-verification section
- tracked scratch output contains verification notes

Otherwise:

- leave as unknown
- optionally add `NEW_GAPS += ['Verification evidence not found']`

### C. Learning delta

The Learning Index formula can stay unchanged. What changes is feeding it synthetic but evidence-backed inputs.

This preserves compatibility with downstream expectations and learning-history tooling.

---

## 4. Session characteristics enrichment

### Current state

`detectSessionCharacteristics()` only uses:

- tool counts inferred from observations/prompts
- decision count inferred from observation types/titles
- files list for importance tier

This is too weak in stateless mode because the observation stream is weak.

### A. Enrich from git activity patterns

Add git-derived characteristics before calling `detectContextType()`:

#### Commit cadence

| Pattern | Interpretation |
|---|---|
| many small commits (3+ commits, low file count each) | iterative/debugging session |
| one large commit | batch implementation or cleanup |
| docs-only commits | documentation/research session |
| fix + test commits adjacent | bugfix/verification session |

Derived fields:

- `commitCount`
- `avgFilesPerCommit`
- `avgChurnPerCommit`
- `activityPattern: 'iterative' | 'batch' | 'mixed'`

#### File-scope intensity

- many files across `/core/`, `/schema/`, `/security/`, `/config/` -> keep existing `critical` boost
- mostly spec/docs files -> documentation/planning boost
- mostly tests + few source files -> verification/review boost

### B. Better tool-count estimation

Current `countToolsByType()` only sees explicit tool strings in facts/prompts (`scripts/extractors/session-extractor.ts:248-277`).

In stateless mode, estimate tool counts from raw OpenCode tool executions and git patterns:

- raw capture tool executions -> direct counts, highest confidence
- commit touching many files with no explicit edit tool records -> infer write/edit work, low confidence
- commits with search-heavy titles or scratch audit reports -> infer `Read/Grep/Glob`, very low confidence

Recommended approach:

1. If raw OpenCode `toolCalls` exist, count them directly.
2. Fall back to observation facts.
3. Use git-derived estimates only for broad bucket correction, not exact totals.

Example:

```ts
estimated.Edit += numberOfEditWriteToolCalls;
estimated.Bash += numberOfBashToolCalls;
estimated.Read += commitCount > 0 && fileCount > editCount ? 1 : 0; // weak correction only
```

### C. Decision count enrichment

Count decisions from:

- parsed `decision-record.md` ADRs
- plan strategy statements
- commit decisions
- OpenCode lexical decision observations

Use unique merged decisions, not raw mentions.

### D. Context-type enrichment

Feed enriched counts into `detectContextType()` and optionally add one extra branch:

- if docs dominate and decisions > 0 -> `planning`
- if verification evidence dominates -> `review`
- if commits are mostly docs/specs and write counts low -> `research` or `planning`

This would make stateless sessions classify more realistically than the current "generic feature observations imply research/implementation" bias.

---

## 5. Additional stateless enrichments worth doing now

### Set `SPEC_FOLDER` during stateless normalization

This is a near-zero-risk fix with big upside.

If `specFolderHint` is supplied, write it into normalized data as `SPEC_FOLDER`. That enables:

- `specFolderPath` construction
- `detectRelatedDocs()`
- `SPEC_FILES`
- better project-state snapshots

Current code already has the hint but does not store it (`scripts/utils/input-normalizer.ts:353-482`, `scripts/extractors/collect-session-data.ts:725-739`).

### Preserve raw tool-call evidence

Keep a hidden field such as `_rawToolCalls` in normalized stateless data:

```ts
_rawToolCalls: Array<{
  tool: string;
  title?: string;
  status?: string;
  duration?: number | null;
  input?: Record<string, unknown>;
  outputPreview?: string;
  timestamp?: string;
  messageId?: string;
}>
```

That unlocks:

- direct tool counts
- better file extraction
- implementation-guide detail
- verification evidence from tool outputs

### Preserve capture metadata

The raw capture includes message/tool counts and session timing metadata, but transform discards it. Keep:

- `_sessionId`
- `_capturedAt`
- `_captureMeta.total_messages`
- `_captureMeta.total_tool_calls`
- `_captureMeta.session_updated`

These are cheap wins for session characterization.

---

## 6. Proposed stateless enrichment pipeline

```text
OpenCode capture
  -> normalized stateless data
  -> attach SPEC_FOLDER from hint
  -> preserve raw tool calls + capture metadata
  -> mine recent git commits/status for target scope
  -> parse spec docs (spec/plan/tasks/checklist/decision-record/implementation-summary)
  -> synthesize:
       - observations
       - decisions
       - FILES enrichments
       - preflight/postflight
       - session characteristic hints
  -> dedupe/merge
  -> existing collectSessionData()
  -> existing downstream renderers/scorers
```

## 7. Concrete object proposals

### Synthetic decision object

```ts
interface StatelessDecisionSeed {
  source: 'decision-record' | 'plan' | 'implementation-summary' | 'git-commit' | 'opencode';
  title: string;
  context: string;
  chosen: string;
  rationale: string;
  alternatives: Array<{
    label: string;
    description: string;
    pros?: string[];
    cons?: string[];
  }>;
  confidence: number;
  evidence: string[];
  files: string[];
  timestamp?: string;
}
```

### Synthetic pre/post object

```ts
interface SyntheticLearningState {
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  confidence?: number;
  uncertaintyRaw?: number;
  readiness?: 'low' | 'medium' | 'high' | 'very-high';
  timestamp?: string;
  gaps?: string[];
  gapsClosed?: string[];
  newGaps?: string[];
  evidence?: string[];
}
```

---

## 8. Priority order

### Highest ROI, lowest risk

1. **Persist `SPEC_FOLDER` from `specFolderHint`**
2. **Synthesize observations from recent git commits**
3. **Parse `decision-record.md` when present**
4. **Build synthetic preflight from spec-folder completeness**
5. **Preserve raw tool calls for direct tool counts**

### Next layer

6. Parse `plan.md` into decision candidates
7. Build synthetic postflight from git status + verification evidence
8. Use `implementation-summary.md` to enrich implementation guide and postflight
9. Add git activity pattern features to session characteristics

### Last

10. Infer approximate tool counts from git patterns when no raw tool calls exist

This ordering matters because items 1-5 improve stateless quality immediately without requiring major redesign.

## Bottom line

The best stateless upgrade is not "try harder with OpenCode text." It is to treat stateless mode as a multi-signal reconstruction problem. Git commits, spec-folder docs, implementation summaries, and raw tool-call metadata can be fused into the existing `observations`, `decisions`, `preflight/postflight`, and `session characteristics` contracts, producing much richer memories while staying compatible with the current extractor pipeline.
