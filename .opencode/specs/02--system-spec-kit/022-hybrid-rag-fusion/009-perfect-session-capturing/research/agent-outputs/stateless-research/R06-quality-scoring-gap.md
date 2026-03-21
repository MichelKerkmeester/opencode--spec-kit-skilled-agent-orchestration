# R06 - Quality scoring gap analysis

## Executive summary

The current code does **not** strongly penalize stateless mode the way the problem statement suggests. In today's implementation, the legacy scorer is heavily backstopped by `ensureMinTriggerPhrases()`, `ensureMinSemanticTopics()`, a very lenient file-description check, and the fact that rendered memories are always long enough to max out content length; the v2 scorer is even more lenient because it mostly checks structural validity, not richness. If you are observing stateless saves that *feel* like `30-40/100`, that is coming from **thin source data / poor semantic usefulness**, not from a scorer that is currently calibrated to punish that thinness very hard.

## Evidence chain

- Legacy scorer dimensions and thresholds: `scripts/core/quality-scorer.ts:66-145`
- V2 scorer penalties/bonuses: `scripts/extractors/quality-scorer.ts:36-115`
- V1-V9 validation rules: `scripts/memory/validate-memory-quality.ts:192-292`
- Stateless load order: data file -> OpenCode capture -> simulation fallback: `scripts/loaders/data-loader.ts:76-187`
- OpenCode capture transformation: `scripts/utils/input-normalizer.ts:353-482`
- Stateless summary/files/tool counts assembly: `scripts/extractors/collect-session-data.ts:673-817`
- Trigger/topic floors that prevent collapse: `scripts/core/workflow.ts:93-139`, `scripts/core/workflow.ts:653-699`
- Repeated tool-title pattern that hurts dedup: `scripts/utils/input-normalizer.ts:430-450`, `scripts/core/quality-scorer.ts:130-141`

## 1. Legacy scorer (0-100) by dimension

### Trigger phrases (0-20)

**How triggers are produced in stateless mode**
- Trigger extraction runs on a concatenated source made from:
  - `sessionData.SUMMARY`
  - decision titles / rationales / chosen values
  - effective file paths and file descriptions
  - spec-folder-name tokens
- Source: `scripts/core/workflow.ts:659-699`
- Even when extraction is sparse, `ensureMinTriggerPhrases()` forces a floor of at least **2 phrases** using file-name tokens or the spec-folder slug.
- Source: `scripts/core/workflow.ts:113-139`

**Typical counts in stateless mode**
- **OpenCode capture available:** usually **2-6**, occasionally **8+** if assistant responses or filenames are rich.
- **Simulation fallback:** usually **2-4**, often dominated by spec-folder tokens plus generic "simulation/fallback" language.

**Legacy impact**
- `0` phrases -> `0/20`
- `1-3` phrases -> `10/20`
- `4-7` phrases -> `15/20`
- `8+` phrases -> `20/20`
- Source: `scripts/core/quality-scorer.ts:66-75`

**What actually hurts stateless here**
- Assistant/user content is often generic (`Development session`, `Implementation and updates`).
- OpenCode relevance filtering can discard unrelated-but-informative history, leaving only a few file/title tokens.
- Simulation produces semantically weak phrases that still count numerically.

**Bottom line:** stateless rarely bottoms out here because workflow floors rescue it; this dimension is **partially weak, not catastrophic**.

### Key topics (0-15)

**How topics are produced in stateless mode**
- Topics come from `extractKeyTopics(summary, decisions, specFolderName)`.
- The extractor ignores placeholder-like summaries containing `SIMULATION MODE`, `[response]`, `placeholder`, or summaries shorter than 20 chars.
- If no topics survive, `ensureMinSemanticTopics()` forces at least **1 topic** from the folder slug or file basenames.
- Sources: `scripts/extractors/session-extractor.ts:368-419`, `scripts/core/workflow.ts:93-111`, `scripts/core/workflow.ts:653-655`

**Typical counts in stateless mode**
- **OpenCode capture available:** usually **1-3** topics; richer cases reach **4-5**.
- **Simulation fallback:** organically **0**, but forced to **1** by the floor helper.

**Legacy impact**
- `0` topics -> `0/15`
- `1` topic -> `5/15`
- `2-4` topics -> `10/15`
- `5+` topics -> `15/15`
- Source: `scripts/core/quality-scorer.ts:77-86`

**What actually hurts stateless here**
- Stateless summaries are often too generic to generate topic diversity.
- Simulated summaries are explicitly treated as placeholders and therefore do not contribute.
- Decisions are often absent, so there is no second semantic source to lift topic count.

**Bottom line:** this is a **real stateless weakness**; typical stateless mode lives in the `5-10/15` band, not `15/15`.

### File descriptions (0-20)

**How file descriptions are produced in stateless mode**
- `transformOpencodeCapture()` only builds `FILES` from `edit`/`write` tool calls, using either `tool.title` or a generic fallback like `Edited via edit tool`.
- `extractFilesFromData()` also discovers files from observations/facts and fills missing descriptions with `Modified during session`.
- Sources: `scripts/utils/input-normalizer.ts:458-470`, `scripts/extractors/file-extractor.ts:104-181`

**Are file descriptions populated?**
- **Yes, usually.**
- **Quality is often poor.** They are frequently generic, tool-shaped, or boilerplate.

**Important scorer mismatch**
- Legacy scoring only asks whether the description is:
  - present
  - longer than 5 chars
  - not equal to `description pending`
- So even weak strings like `Modified during session` or `Edited via edit tool` get full credit.
- Source: `scripts/core/quality-scorer.ts:31-42`, `scripts/core/quality-scorer.ts:88-99`

**Typical legacy impact**
- **OpenCode capture available:** often **15-20/20**, sometimes full `20/20`, despite mediocre descriptions.
- **Simulation fallback:** often also **20/20** because the single simulated file has a non-empty description.

**Bottom line:** file descriptions are **semantically weak but numerically over-rewarded**. This dimension is **not a good explanation for low stateless scores** under the current scorer.

### Content length (0-15)

**How many lines does stateless output produce?**
- The rendered context template is very large and includes many always-on sections plus frontmatter.
- Even sparse stateless runs still render **well over 100 lines**; in practice they are usually **several hundred lines**.
- Evidence: the template itself spans hundreds of lines and always emits metadata, project state, overview, conversation, and memory-metadata blocks (`templates/context_template.md`, especially around lines `140-176`, `321-339`, `467-575`, `783-835`).

**Legacy impact**
- `>=100` lines -> `15/15`
- Source: `scripts/core/quality-scorer.ts:101-111`

**Bottom line:** content length is **effectively maxed in every mode** and does **not explain low stateless quality**.

### noLeakedTags (0-15)

- This is largely mode-independent.
- Workflow strips leaked HTML before scoring, preserving code blocks.
- Sources: `scripts/core/workflow.ts:800-813`, `scripts/core/quality-scorer.ts:113-128`
- In normal runs, all modes usually get **15/15**.

**Bottom line:** not a stateless-specific problem.

### Observation deduplication (0-15)

**What observations look like in stateless OpenCode mode**
- Every tool call becomes an observation with titles like `Tool: read`, `Tool: edit`, `Tool: bash`.
- Source: `scripts/utils/input-normalizer.ts:430-450`
- The file extractor does deduplicate consecutive identical title+file pairs, but the **legacy scorer ignores files and only compares titles**.
- Source: `scripts/extractors/file-extractor.ts:281-339`, `scripts/core/quality-scorer.ts:130-141`

**Typical stateless behavior**
- A session with 8 tool observations may have only 2-4 unique titles (`Tool: read`, `Tool: bash`, `Tool: edit`, `Tool: glob`).
- That produces dedup ratios like:
  - `4/8 = 0.50` -> about `8/15`
  - `3/8 = 0.375` -> about `6/15`
  - `2/6 = 0.33` -> about `5/15`

**Stateful behavior**
- Rich JSON/manual data tends to have human-specific titles (`Validate memory quality content`, `Fix stateless naming regression`, etc.), so ratios are much higher.

**Simulation fallback**
- Simulation session data contains no observations, so legacy scorer gives the N/A full-credit path: **`15/15`**.
- Source: `scripts/core/quality-scorer.ts:132-138`, `scripts/lib/simulation-factory.ts:191-207`

**Bottom line:** this is the **largest genuine legacy penalty in OpenCode stateless mode**.

## 2. V2 scorer (0.0-1.0) and validator rules

## Important framing

The v2 scorer is mainly a **structural validity** scorer, not a semantic richness scorer.

Formula:
- start at `1.0`
- subtract `0.25` for each failed V-rule
- add bonuses:
  - `+0.05` if `messageCount > 0`
  - `+0.05` if `toolCount > 0`
  - `+0.10` if `decisionCount >= 1`
- clamp to `[0,1]`
- Source: `scripts/extractors/quality-scorer.ts:36-115`

That means stateless mode only scores badly in v2 when it **fails structural rules**, not merely because it is semantically thin.

### Which V-rules typically fail in stateless mode?

| Rule | What it checks | Stateless OpenCode | Stateless simulation | Notes |
|---|---|---:|---:|---|
| V1 | `[TBD]` in required fields | Rare | Rare | Only fails if template placeholders leak. |
| V2 | `[N/A]` with `tool_count > 0` | Rare | Rare | Current template/tests are built to avoid this. |
| V3 | malformed `spec_folder` | Rare | Rare | Mostly input corruption, not normal stateless behavior. |
| V4 | fallback decision prose (`No specific decisions were made`) | Rare/none | Rare/none | Current template emits `decision_count: 0`, not that phrase. |
| V5 | `tool_count >= 5` and empty `trigger_phrases` | Rare | Rare | `ensureMinTriggerPhrases()` makes empty triggers unlikely. |
| V6 | leaked placeholder/template artifacts | Occasional edge case | Occasional edge case | More likely when pre/postflight fields or template banners leak. |
| V7 | `tool_count == 0` but execution evidence exists | Occasional edge case | Possible | Could happen if rendered execution signals survive but tool counting misses them. |
| V8 | foreign spec ids dominate content | **Most plausible stateless-specific failure** | Uncommon | OpenCode sessions can include mixed-spec residue; relevance filtering tries to prevent it. |
| V9 | contaminated/generic title | Occasional edge case | Occasional edge case | Guardrails exist, but generic/captured titles are still a stateless risk. |

### Practical read on V-rules

For **normal current stateless runs**, most V-rules **pass**.

The biggest realistic stateless-specific v2 risks are:
1. **V8**: cross-spec contamination from long OpenCode sessions.
2. **V9**: generic or contaminated titles when stateless naming falls back badly.
3. **V6/V7**: placeholder/tool-state edge cases if capture and rendering drift out of sync.

### What bonuses are earned?

| Bonus | Condition | OpenCode stateless | Simulation fallback | Notes |
|---|---|---:|---:|---|
| message bonus | `messageCount > 0` | Usually **+0.05** | Often **0** | Simulation fallback usually has no real prompts/observations in the stateless path. |
| tool bonus | `toolCount > 0` | Usually **+0.05** | Usually **0** | OpenCode tool observations usually count; simulation session data sets `TOOL_COUNT = 0`. |
| decision bonus | `decisionCount >= 1` | Sometimes **+0.10**, often **0** | Usually **0** | Stateless rarely extracts strong decisions unless the transcript explicitly says "chose/decided/implemented". |

**Typical v2 outcome by mode today**
- **Stateful:** usually `1.00`
- **OpenCode stateless:** usually `0.85-1.00`
- **Simulation fallback:** usually `0.75-1.00`

Again: v2 is **not the current source of low stateless scores** unless one of the V-rules is actually firing.

## 3. Comparison table

## Requested expectation vs code-derived reality

The requested bands (`70-85`, `30-40`, `15-25`) do **not** match what the current scorer implementations would usually produce. Below is a comparison between the requested expectation and what today's code is more likely to output.

| Mode | Requested/observed expectation | Code-derived legacy today | Code-derived v2 today | Why |
|---|---:|---:|---:|---|
| Stateful JSON with rich data | `~70-85/100` | `~75-90/100` | `~0.95-1.00` | Rich summaries, more unique observations, real decisions, abundant triggers/topics. |
| Stateless with OpenCode capture | `~30-40/100` | `~55-75/100` | `~0.85-1.00` | Thin semantics hurt topics/dedup, but floors/backfills keep triggers/topics alive and length/html nearly max out. |
| Stateless with simulation fallback | `~15-25/100` | `~45-65/100` | `~0.75-1.00` | Simulation is low-value, but current scorer still awards length, HTML cleanliness, and often file-description credit; v2 only drops if structural rules fail. |

## If you want the requested low stateless bands to be *real*

You would need either:
1. a **stricter legacy scorer** that punishes generic file descriptions, generic summaries, and simulated content, or
2. a **richer v2 validator** that checks semantic density rather than only structural validity.

## 4. Dimension-by-dimension legacy score expectations

| Dimension | Stateful JSON | Stateless OpenCode | Stateless simulation | Main driver |
|---|---:|---:|---:|---|
| triggerPhrases (20) | `15-20` | `10-15` | `10-15` | Floors prevent collapse; real richness only in stateful. |
| keyTopics (15) | `10-15` | `5-10` | `5` | Stateless has fewer meaningful semantic sources. |
| fileDescriptions (20) | `15-20` | `15-20` | `20` | Current scorer is overly lenient here. |
| contentLength (15) | `15` | `15` | `15` | Template size dominates. |
| noLeakedTags (15) | `15` | `15` | `15` | Workflow strips tags before scoring. |
| observationDedup (15) | `10-15` | `5-9` | `15` | Repeated `Tool: <name>` titles punish OpenCode stateless. |
| **Total** | **`80-95`** | **`65-84`** | **`80-85` on paper, but semantically misleading** | This is why the current legacy scorer is poorly calibrated for stateless quality. |

## 5. Top 5 improvements with the biggest scoring impact

Ranked by practical score impact across both scorers.

### 1. Make stateless observation titles unique and semantic
**Impact:** up to **+5 to +10 legacy points** immediately.

Today, stateless OpenCode observations collapse into repeated titles like `Tool: read` and `Tool: bash`, which tanks `observationDedup`. Build titles from `tool + file basename + action summary` instead.

Example:
- current: `Tool: read`
- better: `Read workflow.ts for trigger extraction audit`

### 2. Prevent V8/V9 validator failures in stateless mode
**Impact:** **+25 v2 points each** whenever these fail.

These are the largest single-step v2 recoveries:
- **V8**: cross-spec contamination
- **V9**: contaminated/generic title

If stateless mode is pulling from long-lived OpenCode sessions, better relevance trimming and title hardening are high leverage.

### 3. Extract real decisions from stateless transcripts
**Impact:** **+0.10 v2**, plus roughly **+5 to +10 legacy points** via triggers/topics.

Stateless often misses decisions entirely. Better lexical extraction from assistant responses, tool narratives, git commit messages, or spec/task docs would:
- earn the v2 decision bonus
- increase key topics
- improve trigger phrase richness

### 4. Replace generic summaries with semantically specific summaries
**Impact:** roughly **+5 legacy topic points** and **+5 legacy trigger points**.

Generic summaries like `Development session` or `Implementation and updates` are poisonous for stateless usefulness. Pull summary text from:
- last meaningful assistant response
- recent tool titles
- spec title
- changed file roles
- git diff / task list context

### 5. Stop over-relying on generic file-description fallbacks and generate true per-file roles
**Impact:** small immediate legacy gain today, but large calibration gain if scorer is tightened.

Current file-description scoring is too lenient, so this will not move today's raw score as much as it should. But it is still one of the most important quality fixes because it creates future room for a **stricter, more honest file-description dimension**.

## Final conclusion

The current **legacy scorer overestimates stateless quality**, and the current **v2 scorer barely measures semantic richness at all**. The real stateless gap is not that the present scoring logic harshly punishes stateless mode; it is that stateless mode produces shallow inputs, while the scorers still hand out easy points for length, cleanliness, and generic placeholders that happen to look structurally valid.
