# Test Results: DR-028 through DR-030

**Operator:** Claude Opus 4.6 (manual test operator)
**Date:** 2026-03-24
**Playbook version:** v1.1.0
**Spec folder:** `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/`

---

## DR-028: Focus Track Labels in Dashboard
**Status:** PASS

**Evidence:**

1. **state_format.md defines focusTrack as optional on iteration records:**
   - `state_format.md:117` -- status enum includes all 6 values; field table at line 129 defines:
     `| focusTrack | string | No | Post-hoc grouping label, e.g. "browser-support". Not used for orchestration |`
   - `state_format.md:174-182` -- dedicated "Focus Track Labels" section describes the field as free-form, optional, used for filtering/grouping in dashboards, not for orchestration or convergence.

2. **Dashboard template includes a Track column in the Progress table:**
   - `deep_research_dashboard.md:43`:
     `| # | Focus | Track | Ratio | Findings | Status |`
   - The Track column is the third column, positioned between Focus and Ratio, matching the JSONL focusTrack field.

3. **Agent files instruct the agent to include focusTrack in JSONL records:**
   - `.opencode/agent/deep-research.md:171` -- JSONL template includes `"focusTrack":"optional-track-label"`
   - `.opencode/agent/deep-research.md:187` -- Documents focusTrack as an optional v1.1.0 field
   - `.opencode/agent/deep-research.md:214` -- Dashboard Awareness section confirms focusTrack feeds into dashboard visualization
   - Same contract in `.claude/agents/deep-research.md:166,182,209` and `.opencode/agent/chatgpt/deep-research.md:171,187,214`

4. **Secondary confirmation:**
   - `loop_protocol.md:161` -- Dispatch context may include a suggested focusTrack label
   - `README.md:256` -- Feature listed: "Track labels: Free-form focusTrack labels on iterations for grouping and dashboard filtering"

**Issues:** None. The focusTrack field is consistently defined across all three layers (schema, agent contract, dashboard template) with no contradictions.

**Gaps Found:** None.

---

## DR-029: Insight Status Prevents False Stuck Detection
**Status:** FAIL

**Evidence:**

1. **state_format.md defines "insight" as a valid iteration status:**
   - `state_format.md:117` -- Status field accepts: `complete, timeout, error, stuck, insight, thought`
   - `state_format.md:206` -- `insight` defined as: "Low newInfoRatio but contains an important conceptual breakthrough worth preserving"
   - `state_format.md:209` -- Explicitly states: "The insight status prevents premature convergence when a conceptually significant iteration would otherwise trigger the stuck counter."

2. **SKILL.md confirms the status taxonomy:**
   - `SKILL.md:245` -- Iteration Status Enum: `complete | timeout | error | stuck | insight | thought`
   - `SKILL.md:247` -- `insight`: Low newInfoRatio but important conceptual breakthrough

3. **convergence.md countConsecutiveStuck does NOT exclude "insight":**
   - `convergence.md:208-215` -- The pseudocode is:
     ```
     function countConsecutiveStuck(iterations):
       count = 0
       for i in reversed(iterations):
         if i.newInfoRatio < config.convergenceThreshold or i.status == "stuck":
           count += 1
         else:
           break
       return count
     ```
   - This function only checks two conditions: `newInfoRatio < threshold` OR `status == "stuck"`.
   - An "insight" iteration with low newInfoRatio (which is the defining characteristic of insight -- line 206: "Low newInfoRatio but contains an important conceptual breakthrough") WILL satisfy `newInfoRatio < convergenceThreshold` and WILL increment stuckCount.
   - There is **no exclusion** for `status == "insight"` in this pseudocode.

4. **YAML workflow stuck_count logic also does NOT exclude "insight":**
   - `spec_kit_deep-research_auto.yaml:321`:
     `stuck_count: "if newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"`
   - `spec_kit_deep-research_confirm.yaml:394` -- identical logic.
   - Both YAML workflows compute stuck_count purely from newInfoRatio vs threshold, with no status-based exclusion.

5. **No mention of "insight" anywhere in convergence.md** except in an unrelated context ("buried insights" at line 369 in the Audit Low-Value recovery strategy).

**Issues:** Contract inconsistency. state_format.md:209 promises that "The insight status prevents premature convergence when a conceptually significant iteration would otherwise trigger the stuck counter," but convergence.md's `countConsecutiveStuck` pseudocode (lines 208-215) and both YAML workflow files do not implement this exclusion. An insight iteration with low newInfoRatio will be counted as stuck.

**Gaps Found:**

1. **GAP (Critical): convergence.md `countConsecutiveStuck` missing insight exclusion.** The pseudocode at convergence.md:208-215 needs a condition like `if i.status == "insight": continue` (or equivalently, the stuck condition should be: `if i.status != "insight" and (i.newInfoRatio < threshold or i.status == "stuck")`).

2. **GAP (Critical): YAML workflow `step_update_tracking` missing insight exclusion.** Both `spec_kit_deep-research_auto.yaml:321` and `spec_kit_deep-research_confirm.yaml:394` need the stuck_count logic to exclude insight iterations, e.g.:
   `stuck_count: "if status == 'insight': stuck_count (unchanged), elif newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"`

3. **GAP (Medium): Rolling average in composite convergence also affected.** The rolling average signal at convergence.md:66-71 computes `mean(i.newInfoRatio for i in recent)` over the last 3 iterations without excluding insight iterations. An insight iteration's low newInfoRatio will drag down the rolling average, potentially triggering composite convergence stop. state_format.md:209 says insight "should not trigger the stuck counter" but does not address the rolling average. This is an ambiguity in the contract.

---

## DR-030: Thought Status Convergence Handling
**Status:** FAIL

**Evidence:**

1. **state_format.md defines "thought" as a valid iteration status:**
   - `state_format.md:117` -- Status field accepts: `complete, timeout, error, stuck, insight, thought`
   - `state_format.md:207` -- `thought` defined as: "Analytical-only iteration with reasoning or synthesis but no evidence gathering"
   - `state_format.md:209` -- Explicitly states: "The thought status marks planning or meta-reasoning iterations that should not affect convergence signals."

2. **SKILL.md confirms the status taxonomy:**
   - `SKILL.md:245` -- Iteration Status Enum: `complete | timeout | error | stuck | insight | thought`
   - `SKILL.md:248` -- `thought`: Analytical-only iteration, no evidence gathering

3. **convergence.md countConsecutiveStuck does NOT exclude "thought":**
   - `convergence.md:208-215` -- Same pseudocode as analyzed in DR-029. A thought iteration is analytical-only and by definition has low newInfoRatio (no evidence gathering means no new info). This WILL trigger `newInfoRatio < convergenceThreshold` and WILL increment stuckCount.
   - There is **no exclusion** for `status == "thought"`.

4. **convergence.md rolling average does NOT exclude "thought":**
   - `convergence.md:66-71` -- Rolling average: `mean(i.newInfoRatio for i in recent)` uses the last 3 iterations without any status-based filtering.
   - A thought iteration's low/zero newInfoRatio will drag down the rolling average.
   - state_format.md:209 explicitly says thought "should not affect convergence signals" -- this includes the rolling average.

5. **convergence.md MAD noise floor does NOT exclude "thought":**
   - `convergence.md:74-81` -- MAD computation: `[i.newInfoRatio for i in iterations]` uses ALL iterations.
   - A thought iteration's low newInfoRatio will distort the MAD calculation.

6. **YAML workflow stuck_count logic does NOT exclude "thought":**
   - `spec_kit_deep-research_auto.yaml:321` and `spec_kit_deep-research_confirm.yaml:394`:
     `stuck_count: "if newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"`
   - No status-based exclusion.

7. **No mention of "thought" anywhere in convergence.md.**

**Issues:** Contract inconsistency. state_format.md:209 promises that thought iterations "should not affect convergence signals," but convergence.md does not implement any thought-status exclusion in:
- `countConsecutiveStuck` (lines 208-215)
- Rolling average computation (lines 66-71)
- MAD noise floor computation (lines 74-81)

Both YAML workflow files also lack thought-status exclusion.

**Gaps Found:**

1. **GAP (Critical): convergence.md `countConsecutiveStuck` missing thought exclusion.** Same fix needed as DR-029: the pseudocode must skip iterations where `status == "thought"` so they do not increment stuckCount.

2. **GAP (Critical): convergence.md rolling average missing thought exclusion.** The rolling average at convergence.md:66-71 should filter out thought iterations before computing the mean. e.g.: `recent = [i for i in iterations[-N:] if i.status != "thought"]` (and adjust the window to still take 3 non-thought iterations).

3. **GAP (Critical): convergence.md MAD noise floor missing thought exclusion.** The MAD computation at convergence.md:74-81 should exclude thought iterations from `allRatios`, since their zero/low newInfoRatio is by design and would skew the noise floor calculation.

4. **GAP (Critical): YAML workflow `step_update_tracking` missing thought exclusion.** Both YAML files need stuck_count logic that excludes thought status, e.g.:
   `stuck_count: "if status == 'thought': stuck_count (unchanged), elif newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"`

5. **GAP (Medium): No guidance on how thought iterations affect the iteration count for rolling average window sizing.** convergence.md:66 requires `len(iterations) >= 3` for the rolling average. If 2 of the last 3 iterations are "thought," should the window expand to find 3 non-thought iterations, or should those 2 thought iterations simply be skipped and the rolling average deferred until 3 eligible iterations exist? The contract is silent on this.

---

## Summary

| Scenario | Status | Critical Gaps |
|----------|--------|---------------|
| DR-028 | PASS | None |
| DR-029 | FAIL | convergence.md and YAML workflows do not exclude "insight" from stuck counting, contradicting state_format.md:209 |
| DR-030 | FAIL | convergence.md and YAML workflows do not exclude "thought" from stuck counting, rolling average, or MAD computation, contradicting state_format.md:209 |

### Root Cause

The `insight` and `thought` statuses were added to state_format.md and SKILL.md with documented behavioral semantics (insight prevents stuck counting; thought does not affect convergence signals), but the convergence.md pseudocode and YAML workflow files were never updated to implement those semantics. The convergence algorithm operates purely on `newInfoRatio` values and the literal `status == "stuck"` check, with no awareness of the insight or thought status values.

### Recommended Fix

1. **convergence.md `countConsecutiveStuck`**: Add exclusion for insight and thought:
   ```
   function countConsecutiveStuck(iterations):
     count = 0
     for i in reversed(iterations):
       if i.status in ("insight", "thought"):
         continue  // skip, do not break streak
       if i.newInfoRatio < config.convergenceThreshold or i.status == "stuck":
         count += 1
       else:
         break
     return count
   ```

2. **convergence.md composite signals**: Filter out thought iterations before computing rolling average and MAD:
   ```
   eligible = [i for i in iterations if i.status != "thought"]
   ```

3. **YAML workflows**: Update `step_update_tracking` in both auto and confirm YAMLs to exclude insight and thought from stuck_count incrementing.

4. **Clarify insight vs. rolling average**: Decide whether insight iterations (which do have findings, just low-ratio ones) should be included or excluded from the rolling average and MAD, and document the decision in convergence.md.
