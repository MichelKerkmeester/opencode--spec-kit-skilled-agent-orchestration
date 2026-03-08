# Agent 1: Shell Standards Verification — recommend-level.sh

**File under review:** `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` (776 lines)
**Standards reference:** `sk-code--opencode` SKILL.md + `references/shell/style_guide.md` + `references/shell/quality_standards.md`
**Focus area:** `determine_phasing()` function (lines 349-445) and phase-related scoring code

---

## Check Results

### 1. Box-Drawing Header

**Result: PARTIAL**

The script uses a line-drawing header block, but it uses the lightweight `───` horizontal-line variant rather than the prescribed box-drawing format with corner characters (`╔`, `╗`, `╚`, `╝`).

**Evidence — actual (lines 1-4):**
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPEC-KIT: RECOMMEND LEVEL
# ───────────────────────────────────────────────────────────────
```

**Evidence — standard template (SKILL.md Quick Reference, Shell template):**
```bash
#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ [Script Name]                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
```

**Analysis:** The `style_guide.md` (Section 2, "File Header") documents two acceptable formats — the standard `───` divider format AND the detailed box-drawing format. The `───` variant is shown as the primary pattern with `# COMPONENT: [NAME]` inside. The `╔═╗/║/╚═╝` box variant is shown in the SKILL.md Quick Reference. Both appear in evidence files. The script uses the `───` format consistently, which aligns with the style_guide.md primary template. However, it labels itself `SPEC-KIT: RECOMMEND LEVEL` rather than using the `COMPONENT:` prefix keyword.

**Remediation (optional):** Either form is acceptable per style_guide.md. To fully align with the primary template, add the `COMPONENT:` prefix: `# COMPONENT: SPEC-KIT RECOMMEND LEVEL`. Alternatively, adopt the `╔═╗` box variant if the project standardizes on that going forward.

---

### 2. Shebang + Strict Mode

**Result: PASS**

**Evidence — shebang (line 1):**
```bash
#!/usr/bin/env bash
```

**Evidence — strict mode (line 63):**
```bash
set -euo pipefail
```

Both are present and correct. The strict mode appears after the header comment block, which is the prescribed position per `style_guide.md` Section 2 ("ALWAYS enable strict mode immediately after the shebang/header") and `quality_standards.md` P0 Section.

No remediation needed.

---

### 3. Numbered ALL-CAPS Sections

**Result: PASS**

The script uses numbered ALL-CAPS section headers throughout, with consistent `───` divider formatting:

| Line(s)    | Section Header           |
|-----------|--------------------------|
| 65-67     | `# 1. CONFIGURATION`     |
| 111-113   | `# 2. GLOBALS`           |
| 143-145   | `# 3. HELPER FUNCTIONS`  |
| 501-503   | `# 4. OUTPUT FUNCTIONS`  |
| 650-652   | `# 5. MAIN SCRIPT`       |
| 743-745   | `# 6. CALCULATE SCORES`  |
| 765-767   | `# 7. OUTPUT RESULTS`    |

**Evidence (line 65-67):**
```bash
# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
```

All 7 sections are sequentially numbered and use ALL-CAPS naming. This fully complies with the standard: "Organize code into numbered sections" (style_guide.md Section 2, "Section Organization") and "Numbered ALL-CAPS section headers are preserved" (quality_standards.md P0, shell_checklist.md P0).

No remediation needed.

---

### 4. snake_case Naming

**Result: PASS**

All functions use `lowercase_with_underscores` per standard:

| Line | Function Name              |
|------|----------------------------|
| 149  | `_json_escape()`           |
| 161  | `show_help()`              |
| 215  | `calculate_loc_score()`    |
| 252  | `calculate_files_score()`  |
| 289  | `calculate_risk_score()`   |
| 314  | `calculate_complexity_score()` |
| 331  | `determine_level()`        |
| 356  | `determine_phasing()`      |
| 449  | `calculate_confidence()`   |
| 507  | `output_text()`            |
| 561  | `output_json()`            |

All function names are snake_case. The private helper `_json_escape()` uses the underscore prefix convention per style_guide.md Section 3 ("Single underscore prefix for helpers").

All global variables use `UPPER_SNAKE_CASE`:
- `WEIGHT_LOC`, `WEIGHT_FILES`, `WEIGHT_RISK`, `WEIGHT_COMPLEXITY` (lines 70-73)
- `POINTS_AUTH`, `POINTS_API`, `POINTS_DB`, `POINTS_ARCHITECTURAL` (lines 76-81)
- `PHASE_POINTS_ARCHITECTURAL`, `PHASE_POINTS_MANY_FILES`, etc. (lines 85-91)
- `LOC`, `FILES`, `HAS_AUTH`, `HAS_API`, `HAS_DB`, `HAS_ARCHITECTURAL` (lines 115-120)
- `PHASE_SCORE`, `PHASE_RECOMMENDED`, `PHASE_REASON`, `SUGGESTED_PHASE_COUNT` (lines 138-141)

All local variables in functions use `snake_case`:
- `local loc`, `local score`, `local range`, `local offset` (e.g., lines 216-217)
- `local reasons`, `local risk_flag_count` (lines 362-363)
- `local risk_names` (line 399)
- `local base_confidence`, `local bonus`, `local risk_factors` (lines 450-463)

No camelCase or PascalCase violations found anywhere in the script.

No remediation needed.

---

### 5. AI-Intent Comments

**Result: PARTIAL**

The commenting approach is mixed. The script uses descriptive "what" comments alongside "why/intent" comments. None of the comments use the formal AI-intent prefix tags (`AI-WHY`, `AI-GUARD`, `AI-INVARIANT`, `AI-TRACE`, `AI-RISK`). However, many comments do convey intent/reasoning rather than narrating mechanics.

**Comment density analysis for `determine_phasing()` (lines 356-445 = 90 lines of code):**

Comments found within the function body:
1. Line 365: `# Signal 1: Architectural flag (+15)` — describes what signal is being scored
2. Line 371: `# Signal 2: Many files (+10) — Files > 15` — describes what + threshold
3. Line 381: `# Signal 3: Large LOC (+10) — LOC > 800` — describes what + threshold
4. Line 391: `# Signal 4: Multi-domain risk (+10) — 2+ risk flags` — describes what + threshold
5. Line 398: `# Build risk factor description` — describes what
6. Line 414: `# Signal 5: Extreme scale bonus (+5) — Files > 30 OR LOC > 2000` — describes what + threshold
7. Line 424: `# Cap at max score` — describes what
8. Line 431: `# Phase recommendation requires BOTH score threshold AND level >= 3` — explains **why** (invariant)
9. Line 435: `# Determine suggested phase count based on score ranges` — describes what
10. Line 441: `# Score 25-34` — contextual note

That is 10 comments in ~90 lines = ~1.1 per 10 lines. Well under the maximum of 3 per 10 lines.

**Quality assessment:** Comments 1-5, 7, 9 describe "what" is happening rather than "why." They function as section labels within the algorithm, which is a legitimate structural use (similar to numbered section headers). Comment 8 (line 431) is the strongest — it explains an invariant (both conditions required). The "Signal N" comments serve as documentation of the scoring algorithm's design, which has justifiable value for maintainability.

**Formal prefix tags:** No `AI-WHY`, `AI-GUARD`, `AI-INVARIANT`, `AI-TRACE`, or `AI-RISK` prefixes are used anywhere in the 776-line script. The quality_standards.md and shell_checklist.md list AI-intent tags as P0 ("Inline comments follow AI-intent policy") with allowed prefixes.

**Adversarial self-check:**

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| No AI-intent prefix tags used | P1 | The "Signal N" comments serve as algorithmic documentation markers, similar to section headers. The comment *content* often conveys intent (thresholds, invariants). Requiring `AI-WHY:` on every such comment could reduce clarity. The standard says "AI-intent comments only" but the shell_checklist marks it P0 while the quality_standards.md places "WHY comments" at P0 and AI-intent policy at P1. | Confirmed as PARTIAL compliance — content is mostly acceptable, but formal prefix tags are absent | P2 |

**Remediation:** Consider adding AI-intent prefixes to the most meaningful comments. For example:
- Line 431: `# AI-INVARIANT: Phase recommendation requires BOTH score threshold AND level >= 3`
- Line 424: `# AI-GUARD: Cap at max score to prevent overflow`

The "Signal N" comments could remain as-is since they function as structural documentation markers for the algorithm.

---

### 6. Guard Clauses

**Result: PASS**

Input validation uses early-return guard patterns rather than deeply nested if/else structures.

**Evidence — argument validation (lines 658-716):**
The argument parser uses a flat `while/case` structure with early `exit 1` for invalid inputs:
```bash
--loc)
  if [[ -z "${2:-}" ]] || [[ "$2" =~ ^-- ]]; then
    echo "ERROR: --loc requires a numeric value" >&2
    exit 1
  fi
```

**Evidence — post-parse validation (lines 720-741):**
```bash
if ! [[ "$LOC" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --loc must be a positive integer" >&2
  exit 1
fi

if ! [[ "$FILES" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --files must be a positive integer" >&2
  exit 1
fi

if ! [[ "$PHASE_THRESHOLD" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --phase-threshold must be a positive integer" >&2
  exit 1
fi
```

These are sequential guard clauses — each validates one condition and exits early on failure. No deep nesting is present.

**Evidence — `determine_phasing()` (lines 356-445):**
The function uses flat sequential if-blocks for each signal dimension. The deepest nesting is 2 levels (checking if `reasons` is non-empty inside a signal block), which is acceptable. The overall control flow is linear — each signal block is independent and accumulates score additively.

No remediation needed.

---

### 7. Readonly Constants

**Result: PASS**

All constants are declared with `readonly`.

**Evidence (lines 70-108):**
```bash
readonly WEIGHT_LOC=35
readonly WEIGHT_FILES=20
readonly WEIGHT_RISK=25
readonly WEIGHT_COMPLEXITY=20

readonly POINTS_AUTH=10
readonly POINTS_API=8
readonly POINTS_DB=7

readonly POINTS_ARCHITECTURAL=20

readonly PHASE_POINTS_ARCHITECTURAL=15
readonly PHASE_POINTS_MANY_FILES=10
readonly PHASE_POINTS_LARGE_LOC=10
readonly PHASE_POINTS_MULTI_RISK=10
readonly PHASE_POINTS_EXTREME_SCALE=5
readonly PHASE_MAX_SCORE=50
readonly PHASE_DEFAULT_THRESHOLD=25

readonly LOC_THRESHOLD_LOW=50
readonly LOC_THRESHOLD_MED=150
readonly LOC_THRESHOLD_HIGH=400
readonly LOC_THRESHOLD_MAX=1000

readonly FILES_THRESHOLD_LOW=3
readonly FILES_THRESHOLD_MED=8
readonly FILES_THRESHOLD_HIGH=15
readonly FILES_THRESHOLD_MAX=30

readonly LEVEL_0_MAX=24
readonly LEVEL_1_MAX=44
readonly LEVEL_2_MAX=69
```

All 23 constants in the CONFIGURATION section use `readonly`. The phase-specific constants (`PHASE_POINTS_*`, `PHASE_MAX_SCORE`, `PHASE_DEFAULT_THRESHOLD`) at lines 85-91 are correctly declared with `readonly`, fully consistent with the existing constant pattern.

No remediation needed.

---

## Summary Table

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Box-drawing header | **PARTIAL** | Uses `───` divider (accepted variant per style_guide.md) but missing `COMPONENT:` prefix and not using `╔═╗` box variant |
| 2 | Shebang + strict mode | **PASS** | `#!/usr/bin/env bash` (line 1) + `set -euo pipefail` (line 63) |
| 3 | Numbered ALL-CAPS sections | **PASS** | 7 sequentially numbered ALL-CAPS sections with consistent dividers |
| 4 | snake_case naming | **PASS** | All functions, locals, and globals follow convention; `_` prefix for private helper |
| 5 | AI-intent comments | **PARTIAL** | Density is well within limits (max ~1.1/10 lines). Content is acceptable but formal AI-intent prefix tags (`AI-WHY`, `AI-GUARD`, etc.) are not used |
| 6 | Guard clauses | **PASS** | Sequential early-exit guards for input validation; flat control flow throughout |
| 7 | Readonly constants | **PASS** | All 23 constants (including 7 phase-specific) declared with `readonly` |

## Phase-Specific Code Assessment

The `determine_phasing()` function and all phase-related additions (constants at lines 83-91, globals at lines 123-141, CLI flags at lines 689-704, validation at lines 731-734, output sections in `output_text()` and `output_json()`) follow the same coding patterns as the existing level-scoring code. Specifically:

- **Naming consistency:** Phase constants (`PHASE_POINTS_*`) mirror existing constants (`POINTS_*`, `LOC_THRESHOLD_*`). Phase globals (`PHASE_SCORE`, `PHASE_RECOMMENDED`) mirror existing globals (`TOTAL_SCORE`, `RECOMMENDED_LEVEL`).
- **Structural consistency:** `determine_phasing()` follows the same pattern as `determine_level()`, `calculate_risk_score()`, and `calculate_complexity_score()` — flat conditionals that accumulate score, cap at maximum, and set global result variables.
- **Integration consistency:** Phase CLI flags (`--recommend-phases`, `--no-recommend-phases`, `--phase-threshold`) follow the same `while/case` parsing pattern as existing flags.
- **Output consistency:** Phase fields in both text and JSON output follow the same formatting patterns as existing level output.

## Overall Verdict

**5 of 7 checks PASS. 2 checks PARTIAL.**

The two PARTIAL findings are low-severity style observations (P2), not blockers. The header format uses an accepted variant documented in the style guide. The comment content is reasonable but lacks formal AI-intent prefix tags. The phase-related code additions are well-integrated and follow all existing patterns in the script.
