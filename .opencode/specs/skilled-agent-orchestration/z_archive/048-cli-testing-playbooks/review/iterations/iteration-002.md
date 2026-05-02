---
title: "Iteration 002 — Security Review"
description: "Security audit of destructive scenario isolation, self-invocation guards, ADR-004 handback isolation, secret surfaces, concurrency caps, and Codex fast-tier enforcement across the five cli-* manual testing playbooks and spec 048 docs."
---

# Iteration 002: Security Review

## Metadata
- Dimension: security
- Executor: cli-copilot/gpt-5.5/high
- Files inspected: 126
- Spot-checks per playbook: 6

## Findings

### P0 (Blockers)

- [P0] [CO-026:.opencode/skill/cli-opencode/manual_testing_playbook/08--parallel-detached/001-parallel-detached-session.md:51] The destructive `--share --port 4096` command is executable as written, targets the operator's real project tree via `--dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, and does not require a pre-dispatch CHK-033 operator-confirmation evidence file in the command sequence or Pass/Fail Criteria. This contradicts the root playbook claim that `--share` URLs are never published without explicit approval and violates the destructive-scenario sandbox boundary. Remediation: move the runnable command into a disposable `/tmp/co-026-repo` copy or sandboxed `OPENCODE_CONFIG_DIR`, add a mandatory pre-step that records explicit operator confirmation before any `--share` invocation, require that evidence in Pass/Fail Criteria, and document cleanup/recovery of the created session/state.
- [P0] [CO-027:.opencode/skill/cli-opencode/manual_testing_playbook/08--parallel-detached/002-worker-farm-loop.md:52] The worker-farm loop starts three real `opencode run --share --port` sessions against the operator project tree with no per-worker confirmation gate and no recovery/cleanup path for the share sessions or state directories. Because this is a multi-dispatch destructive share flow, a single copy/paste can publish multiple session URLs without CHK-033 evidence. Remediation: make the default worker-farm command non-sharing unless explicit confirmation evidence exists, run against `/tmp/co-027-repo` plus sandboxed state, and require teardown instructions for all worker state/log/share artifacts.
- [P0] [CO-028:.opencode/skill/cli-opencode/manual_testing_playbook/08--parallel-detached/003-ablation-suite.md:50] The ablation scenario launches two parallel `opencode run --share --port` sessions against the operator project tree and grades only exit status, distinct session ids, and byte-count ratio. It does not gate URL publication, does not sandbox the working tree/state, and does not document recovery if a shared session contains sensitive project context. Remediation: split share-publication validation from ablation validation, default to non-share detached runs or require recorded operator confirmation before `--share`, and run the ablation in a disposable `/tmp/` repo/state sandbox with explicit cleanup.

### P1 (Required)

- [P1] [CP-020:.opencode/skill/cli-copilot/manual_testing_playbook/08--cloud-delegation/001-delegate-explicit-cloud.md:48] The scenario is marked `DESTRUCTIVE — cloud write`, but its runnable command delegates with `--allow-all-tools` from the operator project context and only tripwires local git status; it does not document recovery for GitHub-side delegation receipts/logs or state written by the cloud agent. Remediation: add a cloud-state recovery/cleanup note, require capturing and redacting/disposing the delegation receipt when possible, and make Pass/Fail Criteria include a bounded cloud-write audit trail rather than only local tripwire checks.
- [P1] [CP-021:.opencode/skill/cli-copilot/manual_testing_playbook/08--cloud-delegation/002-ampersand-inline-cloud-shorthand.md:48] The `&prompt` destructive cloud-write scenario has the same gap as CP-020: it sends a live cloud delegation from the operator project context with no explicit recovery procedure for cloud-side receipts/logs and no sandboxed credential/state boundary beyond local transcript files in `/tmp/`. Remediation: add explicit operator acknowledgement for cloud-state creation, document how to capture/remove or quarantine the delegation receipt, and require that recovery evidence in Pass/Fail Criteria.
- [P1] [CP-008:.opencode/skill/cli-copilot/manual_testing_playbook/03--autopilot-mode/001-autopilot-autonomous-build.md:48] The Autopilot destructive scenario uses `/tmp/cp-008-sandbox/` and tripwires the project tree, but it never documents recovery if Copilot mutates the project tree or leaves the sandbox dirty; the Failure Triage diagnoses autonomy/import/prompt regressions only. Remediation: add explicit cleanup (`rm -rf /tmp/cp-008-sandbox` after evidence capture) plus a recovery branch for non-empty project diffs (stop, preserve transcript, revert only test-created files, and file a security defect).
- [P1] [CP-013:.opencode/skill/cli-copilot/manual_testing_playbook/05--session-continuity/001-repository-memory-recall.md:48] The repository-memory destructive scenario correctly uses `HOME=/tmp/cp-013-home` and tripwires the real `~/.copilot/`, but it does not document recovery if the real-state SHA changes or if the sandboxed memory files need cleanup after evidence capture. Remediation: add post-run sandbox deletion/quarantine guidance and a real-state recovery branch that halts the wave, preserves pre/post hashes, identifies changed files, and restores only test-created Copilot memory artifacts.
- [P1] [CX-007:.opencode/skill/cli-codex/manual_testing_playbook/02--sandbox-modes/003-danger-full-access-sandbox.md:50] The `danger-full-access` destructive scenario has approval and `/tmp/` scoping, but no explicit recovery plan after the most permissive Codex sandbox mode runs; the triage checks approval, stderr, and git diff but never says how to restore if files outside `/tmp/cli-codex-playbook-cx007/` changed. Remediation: add a mandatory recovery section for external-path mutation, including preserving the transcript, stopping further destructive tests, and restoring only verified test-created changes.
- [P1] [CX-004:.opencode/skill/cli-codex/manual_testing_playbook/01--cli-invocation/004-explicit-fast-service-tier.md:48] The playbook includes a live negative-control `codex exec` invocation that intentionally omits `-c service_tier="fast"`, despite the same scenario stating the auto-memory rule applies to every `codex exec` invocation. This normalizes a runnable no-fast command and violates the requested invariant. Remediation: replace the negative control with a non-executed `echo`/static command-string lint sample, or keep every runnable `codex exec` command on `-c service_tier="fast"` and validate omission through text inspection only.

### P2 (Suggestions)

- [P2] [.opencode/skill/cli-opencode/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:86] The root cli-opencode playbook hard-codes the personal path `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` as the Public repo path. Even though it says to adapt the path, the per-feature command rows copy the same path into executable commands, increasing accidental execution in the operator project tree. Remediation: define `REPO_ROOT="$(pwd)"` or `<repo-root>` once and use that placeholder in all non-sandbox examples.

## Evidence

Commands run:

```bash
rg "DESTRUCTIVE|--share|danger-full-access|bypass|--allow-all-tools|--no-ask-user|delegate|cloud" .opencode/skill/cli-*/manual_testing_playbook
rg "GH_TOKEN|GITHUB_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY|GEMINI_API_KEY|ghp_|github_pat_|AIza|sk-[A-Za-z0-9]{16,}|/Users/michelkerkmeester|~/.copilot/state|\\.copilot/state" <playbooks + spec docs>
rg "parallel `copilot -p`|[4-9] parallel|4 parallel|five parallel|5 parallel|four parallel|concurrent `copilot" .opencode/skill/cli-copilot/manual_testing_playbook
rg "companion CLI execution is out of scope|out of scope for this scenario|cross-AI handback|companion CLI" .opencode/skill/cli-opencode/manual_testing_playbook .opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks
python3 - <<'PY'
# Enumerated 115 per-feature files + 5 root playbooks + 6 spec docs,
# summarized destructive markers, checked Codex `codex exec` backticked
# command strings for service_tier="fast", and scanned secret/path patterns.
PY
```

Relevant output snippets:

```text
file_count 126 per_feature 115 roots 5 spec_docs 6
```

```text
== cli-copilot destructive marker summary ==
CP-002 recovery=False sandbox=True confirm=False
CP-007 recovery=False sandbox=True confirm=False
CP-008 recovery=False sandbox=True confirm=False
CP-013 recovery=False sandbox=True confirm=False
CP-017 recovery=False sandbox=True confirm=False
CP-020 recovery=False sandbox=True confirm=False
CP-021 recovery=False sandbox=True confirm=False

== cli-opencode destructive/share marker summary ==
CO-020 recovery=False sandbox=True confirm=True
CO-026 recovery=False sandbox=True confirm=True
CO-027 recovery=False sandbox=True confirm=False
CO-028 recovery=False sandbox=True confirm=False
```

```text
cli-opencode root invariant:
MANUAL_TESTING_PLAYBOOK.md:58 Destructive scenarios are limited to operator-confirmed `--share` flows (CHK-033). The playbook never publishes share URLs without explicit operator approval.
MANUAL_TESTING_PLAYBOOK.md:87 Destructive scenarios involving `--share` (CO-026, CO-027, CO-028) MUST NOT actually publish the share URL to anyone. The test only validates the session-creation path. Operator confirmation per CHK-033 is required before any real publication.
MANUAL_TESTING_PLAYBOOK.md:102 For destructive `--share` scenarios, capture explicit operator confirmation per CHK-033 (or notation that the share URL was NOT published).
```

```text
CO-026 command row: opencode run --share --port 4096 ... --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ...
CO-027 command row: for n in 1 2 3; do ... opencode run --share --port "$port" ... --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ...
CO-028 command row: opencode run --share --port 4200 ... --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ... & opencode run --share --port 4201 ... --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ...
```

```text
Codex fast-tier scan:
CX-004 command row includes one compliant invocation and one runnable negative-control invocation:
codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --sandbox read-only ...
codex exec --model gpt-5.5 -c model_reasoning_effort="low" --sandbox read-only ...
```

```text
Secret and credential scan:
No concrete ghp_, github_pat_, AIza, or sk-* token values were found in the 126 target files.
Matches were env-var names/placeholders such as GH_TOKEN, GITHUB_TOKEN, OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, and hard-coded local path examples.
```

```text
Self-invocation guard spot-checks:
CO-008 PASS criteria require OPENCODE_CONFIG_DIR layer-1 detection and no real opencode run.
CO-031 PASS criteria require cross-repo NOT to bypass the guard and no real opencode run.
cli-copilot root precondition documents self-invocation refusal on COPILOT_SESSION_ID / GH_COPILOT_* / ancestry / ~/.copilot/state/<id>/lock.
```

```text
ADR-004 handback isolation spot-check:
decision-record.md:320-322 requires companion CLI execution out of scope.
CO-021 line 20 says Codex does NOT need to be installed and companion CLI execution is out of scope.
CO-021 line 34 PASS depends on opencode memory_search, not Codex execution.
Root playbook lines 557-568 summarize opencode-side signals only.
```

```text
Copilot concurrency cap:
MANUAL_TESTING_PLAYBOOK.md:82 caps routine automation at 3 parallel copilot -p calls.
MANUAL_TESTING_PLAYBOOK.md:621 says wave plans enforce the 3-process cap.
No cli-copilot scenario text proposing 4+ concurrent copilot invocations was found.
```

## newFindingsRatio
1.0

## Convergence Signal
Security review should continue. The highest-risk class is concentrated in destructive execution contracts, especially `--share` publication flows that are runnable against the operator project tree without command-level confirmation evidence. Self-invocation guard documentation, ADR-004 companion-CLI isolation for CO-021/CO-022, and the cli-copilot three-dispatch cap are comparatively strong, but the destructive recovery/sandbox story needs another pass after remediation because several scenarios rely on tripwires without explicit recovery procedures.
