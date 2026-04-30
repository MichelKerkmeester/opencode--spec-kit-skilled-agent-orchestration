---
title: "RT-027 -- Fresh-Session Continuation After Archive"
description: "Manual validation scenario for RT-027: Fresh-Session Continuation After Archive."
feature_id: "RT-027"
category: "Runtime Truth"
---

# RT-027 -- Fresh-Session Continuation After Archive

This document captures the canonical manual-testing contract for `RT-027`.

---

## 1. OVERVIEW

This scenario validates that the current release uses standalone `new`-mode sessions, so continuation happens by archiving the previous run and starting a fresh `/improve:improve-agent` session.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Fresh-Session Continuation After Archive for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that the current release uses standalone `new`-mode sessions, so continuation happens by archiving the previous run and starting a fresh `/improve:improve-agent` session. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate current-release continuation guidance against the sk-improve-agent session model and journal behavior. Verify archived evidence stays intact, each new invocation starts in `new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`improvement/` directory is preserved under `improvement_archive/` before the next run begins. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the improvement-journal helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: The archived `improvement/` directory is preserved under `improvement_archive/` before the next run begins; The fresh run creates a new `improvement/` directory instead of reusing the archived one; The fresh session starts in `new` mode with a new session id and generation `1`; Iteration numbering restarts from `1` in the fresh session journal; No unsupported lineage flags or multi-generation session behaviors are required or documented as shipped
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: After archiving the prior runtime folder and starting a fresh session, the repository preserves the old evidence separately, the new session journal starts in `new` mode with generation `1`, and the fresh run begins again at iteration `1` without claiming unshipped continuation semantics.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RT-027 | Fresh-Session Continuation After Archive | Validate Fresh-Session Continuation After Archive | `` As a manual-testing orchestrator, validate current-release continuation guidance against the sk-improve-agent session model and journal behavior. Verify archived evidence stays intact, each new invocation starts in `new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`improvement/` directory is preserved under `improvement_archive/` before the next run begins. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | Step 1 -- Run the initial session (2 iterations):<br><br><br>/improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Step 2 -- Archive the previous session folder:<br><br><br>ARCHIVE_ROOT=&quot;{spec}/improvement_archive/$(date +%Y%m%d-%H%M%S)&quot;<br>mkdir -p &quot;{spec}/improvement_archive&quot;<br>mv &quot;{spec}/improvement&quot; &quot;$ARCHIVE_ROOT&quot;<br><br><br>Step 3 -- Start a fresh session against the same target:<br><br><br>/improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>ARCHIVE_ROOT=&quot;$(ls -dt {spec}/improvement_archive/* &#124; head -1)&quot;<br>test -d &quot;$ARCHIVE_ROOT&quot;<br><br><br>node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>starts = [e for e in events if e[&#x27;eventType&#x27;] == &#x27;session_start&#x27;]<br>assert len(starts) &gt;= 1, f&#x27;Expected at least 1 session_start event in the fresh session, got {len(starts)}&#x27;<br>details = starts[0].get(&#x27;details&#x27;, {})<br>assert details.get(&#x27;lineageMode&#x27;, &#x27;new&#x27;) == &#x27;new&#x27;, f&quot;Expected lineageMode new, got {details.get(&#x27;lineageMode&#x27;)}&quot;<br>assert details.get(&#x27;generation&#x27;, 1) == 1, f&quot;Expected generation 1, got {details.get(&#x27;generation&#x27;)}&quot;<br>print(&#x27;PASS — fresh session starts in new mode after archive&#x27;)<br>&quot; | The archived `improvement/` directory is preserved under `improvement_archive/` before the next run begins; The fresh run creates a new `improvement/` directory instead of reusing the archived one; The fresh session starts in `new` mode with a new session id and generation `1`; Iteration numbering restarts from `1` in the fresh session journal; No unsupported lineage flags or multi-generation session behaviors are required or documented as shipped | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | After archiving the prior runtime folder and starting a fresh session, the repository preserves the old evidence separately, the new session journal starts in `new` mode with generation `1`, and the fresh run begins again at iteration `1` without claiming unshipped continuation semantics. | If the archive step fails: verify the spec folder path is correct and `improvement/` exists before moving it<br>If the fresh run reuses the archived directory: inspect the init phase to confirm it always creates a new runtime folder<br>If lineage metadata is not `new` / generation `1`: compare the emitted `session_start` details against the current-release session model in `SKILL.md`<br>If docs still mention unsupported lineage flags or multi-generation continuation modes: remove the stale wording from the playbook and command examples |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste the archive path plus the fresh `session_start` event showing `lineageMode: "new"` and `generation: 1`]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/027-resume-continuation.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/improvement-journal.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/tests/improvement-journal.vitest.ts` | Automated regression test anchor for the runtime script |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/027-resume-continuation.md`
