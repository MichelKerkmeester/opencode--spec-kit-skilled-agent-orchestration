---
title: "Iteration 023 — Merge-mode pseudocode details"
iteration: 23
band: A
timestamp: 2026-04-11T16:32:00Z
worker: codex-gpt-5.4
scope: q2_merge_pseudocode
status: complete
focus: "Detailed language-agnostic pseudocode for the five canonical merge modes, including regex, idempotency, edge cases, and atomic-envelope hooks."
maps_to_questions: [Q2]
---
# Iteration 023 — Q2: Merge-Mode Pseudocode
## Goal
Turn iteration 003's five merge modes into implementation-grade pseudocode. Keep the logic language-agnostic, scoped to anchor-body mutation, and explicitly grounded in the existing `withSpecFolderLock(specFolder, fn)` envelope.
## Normalization note
`findings/routing-rules.md` still names `append-new-session` for `handover_state`. This iteration treats that as a routing alias that must normalize to one of the five canonical Q2 modes before dispatch.
## Shared contract
- Dispatcher inputs: `specFolder`, `docPath`, `anchorId`, `mergeMode`, `payload`, `dedupeFingerprint`
- Shared return:
```text
MergeOutcome = {
  changed: boolean
  updatedAnchorBody: string
  idempotentReason: string | null
  warnings: list of string
}
```
- Shared regex:
  - `ANCHOR_OPEN(anchorId) = (?m)^<!-- ANCHOR:` + escape(anchorId) + ` -->\s*$`
  - `ANCHOR_CLOSE(anchorId) = (?m)^<!-- /ANCHOR:` + escape(anchorId) + ` -->\s*$`
  - `ANCHOR_BLOCK(anchorId) = (?ms)^<!-- ANCHOR:` + escape(anchorId) + ` -->\n(?<body>.*?)\n<!-- /ANCHOR:` + escape(anchorId) + ` -->`
## Shared atomic envelope
```text
function runMerge(request):
  return withSpecFolderLock(request.specFolder, function():
    originalText = readFile(request.docPath)
    originalStat = statFile(request.docPath)
    parsed = splitFrontmatterFromBody(originalText)
    anchorMatch = regexFind(ANCHOR_BLOCK(request.anchorId), parsed.body)
    if anchorMatch is null: raise MergeError("target anchor missing")
    modeOutcome = dispatchByMergeMode(request.mergeMode, anchorMatch.body, request.payload, request.dedupeFingerprint)
    if modeOutcome.changed is false: return modeOutcome
    rebuiltBody = replaceAnchorBody(parsed.body, request.anchorId, modeOutcome.updatedAnchorBody)
    rebuiltDoc = joinFrontmatterAndBody(parsed.frontmatter, rebuiltBody)
    validateAnchorPairs(rebuiltDoc)
    validateFrontmatterStillParses(rebuiltDoc)
    validateNoCrossAnchorMutation(parsed.body, rebuiltBody, request.anchorId)
    currentStat = statFile(request.docPath)
    if currentStat.mtime != originalStat.mtime: raise RetryableMergeError("doc changed while lock was queued")
    writePendingFile(request.docPath, rebuiltDoc)
    renamePendingToFinal(request.docPath)
    persisted = readFile(request.docPath)
    verifyPersistedBytesMatch(rebuiltDoc, persisted)
    return modeOutcome
  )
```
## Mode 1 — `append-as-paragraph`
Inputs: `anchorBody`, `newParagraphText`, `dedupeFingerprint`; returns `MergeOutcome`
Regex: `FP_COMMENT = (?m)^<!-- CONTINUITY-FP: (?<fp>[a-z0-9_-]+) -->\s*$`
```text
function mergeAppendAsParagraph(anchorBody, payload, dedupeFingerprint):
  incoming = trim(payload.newParagraphText)
  if incoming is empty: return noOp("incoming paragraph empty")
  if regexFind(FP_COMMENT matching dedupeFingerprint, anchorBody): return noOp("fingerprint already present")
  if normalizeParagraphWhitespace(anchorBody) contains normalizeParagraphWhitespace(incoming):
    return noOp("equivalent paragraph already present")
  if containsLiteralAnchorMarker(anchorBody): raise MergeError("corrupted anchor body")
  fingerprintLine = "<!-- CONTINUITY-FP: " + dedupeFingerprint + " -->"
  if trim(anchorBody) is empty:
    updated = fingerprintLine + "\n" + incoming
  else:
    updated = rstrip(anchorBody) + "\n\n" + fingerprintLine + "\n" + incoming
  return changed(updated)
```
Idempotency: fingerprint first, normalized paragraph containment second.
Edge cases: empty anchor initializes; embedded literal anchor markers fail closed; already-present content returns no-op.
Envelope hook: mutate only `anchorBody`; envelope revalidates anchor pairs after reinsertion.
## Mode 2 — `insert-new-adr`
Inputs: `anchorBody`, `decisionTitle`, `decisionContext`, `decisionText`, `dedupeFingerprint`
Returns: `MergeOutcome`
Regex:
- `ADR_ANCHOR = (?m)^<!-- ANCHOR:adr-(?<n>\d{3}) -->\s*$`
- `ADR_TITLE = (?m)^## ADR-(?<n>\d{3}): (?<title>.+)$`
```text
function mergeInsertNewAdr(anchorBody, payload, dedupeFingerprint):
  title = trim(payload.decisionTitle)
  context = trim(payload.decisionContext)
  decision = trim(payload.decisionText)
  if title is empty or decision is empty: return noOp("adr missing required text")
  for each existingTitle in regexFindAll(ADR_TITLE, anchorBody):
    if normalizeTitle(existingTitle.title) == normalizeTitle(title):
      return noOp("adr title already present")
  if fingerprintAlreadyPresent(anchorBody, dedupeFingerprint): return noOp("adr fingerprint already present")
  adrNumbers = regexFindAll(ADR_ANCHOR, anchorBody)
  if duplicateAdrNumbersExist(adrNumbers): raise MergeError("existing adr structure corrupted")
  nextNumber = zeroPad(max(adrNumbers.n, default=0) + 1, 3)
  newAdr = renderAdrBlock("adr-" + nextNumber, nextNumber, title, context, decision, dedupeFingerprint)
  if trim(anchorBody) is empty:
    updated = newAdr
  else:
    updated = rstrip(anchorBody) + "\n\n" + newAdr
  return changed(updated)
```
Idempotency: normalized ADR title first, fingerprint second.
Edge cases: empty anchor starts at ADR-001; duplicate or malformed ADR numbering fails closed; replayed decision becomes no-op.
Envelope hook: this mode introduces nested anchors, so envelope must revalidate the whole rebuilt doc.
## Mode 3 — `append-table-row`
Inputs: `anchorBody`, `rowValues`, `dedupeKey`, `dedupeColumn`
Returns: `MergeOutcome`
Regex:
- `TABLE_HEADER = (?m)^\|(?<header>.+)\|\s*$`
- `TABLE_DIVIDER = (?m)^\|(?:\s*:?-{3,}:?\s*\|)+\s*$`
- `TABLE_ROW = (?m)^\|(?<cells>.+)\|\s*$`
```text
function mergeAppendTableRow(anchorBody, payload, dedupeFingerprint):
  lines = splitLines(anchorBody)
  headerIndex = findFirstLineMatching(lines, TABLE_HEADER)
  dividerIndex = findNextLineMatching(lines, TABLE_DIVIDER, start = headerIndex + 1)
  if headerIndex is null or dividerIndex is null: raise MergeError("table structure missing")
  headers = parseTableHeaders(lines[headerIndex])
  if tableDividerWidthDoesNotMatch(headers, lines[dividerIndex]): raise MergeError("table divider corrupted")
  rows = parseMarkdownRows(lines after dividerIndex)
  for each row in rows:
    if canonicalize(row[payload.dedupeColumn]) == canonicalize(payload.dedupeKey):
      return noOp("table row already present")
  newCells = []
  for each header in headers:
    newCells.push(escapeMarkdownCell(payload.rowValues[header] or ""))
  newRow = "| " + join(newCells, " | ") + " |"
  insertAt = findLastContiguousTableRow(lines, dividerIndex + 1)
  updatedLines = insertLine(lines, insertAt + 1, newRow)
  return changed(joinLines(updatedLines))
```
Idempotency: compare canonical value in the configured dedupe column.
Edge cases: empty anchor fails because schema is unknown; corrupted header/divider or short rows fail closed; existing logical row returns no-op.
Envelope hook: mode adds no anchors, but envelope should confirm header and divider still exist after reinsertion.
## Mode 4 — `update-in-place`
Inputs: `anchorBody`, `targetItemId`, `newCheckedState`, `evidenceText`
Returns: `MergeOutcome`
Regex:
- `TASK_LINE = (?m)^(?<indent>\s*)- \[(?<state>[ x])\] (?<id>T\d{3}|CHK-\d{3})(?<rest>.*)$`
- `EVIDENCE_SUFFIX = \s+\[Evidence: (?<evidence>[^\]]+)\]$`
```text
function mergeUpdateInPlace(anchorBody, payload, dedupeFingerprint):
  lines = splitLines(anchorBody)
  matches = []
  for each index, line in lines:
    taskMatch = regexMatch(TASK_LINE, line)
    if taskMatch is not null and taskMatch.id == payload.targetItemId:
      matches.push({ index, taskMatch })
  if size(matches) == 0: raise MergeError("target item missing")
  if size(matches) > 1: raise MergeError("target item duplicated")
  current = matches[0]
  desiredState = payload.newCheckedState ? "x" : " "
  desiredEvidence = normalizeEvidence(payload.evidenceText)
  currentEvidence = normalizeEvidence(extractEvidence(current.taskMatch.rest))
  if current.taskMatch.state == desiredState and currentEvidence == desiredEvidence:
    return noOp("item already in desired state")
  rebuiltRest = stripEvidenceSuffix(current.taskMatch.rest)
  if desiredEvidence is not empty:
    rebuiltRest = rebuiltRest + " [Evidence: " + desiredEvidence + "]"
  lines[current.index] = current.taskMatch.indent + "- [" + desiredState + "] " + payload.targetItemId + rebuiltRest
  return changed(joinLines(lines))
```
Idempotency: compare checkbox state and normalized evidence together.
Edge cases: empty anchor fails; duplicate IDs fail; already-matching item returns no-op.
Envelope hook: envelope should verify exactly one structured item changed and the previous unmatched form does not remain elsewhere in the same anchor.
## Mode 5 — `append-section`
Inputs: `anchorBody`, `sectionTitle`, `sectionBody`, `dedupeFingerprint`
Returns: `MergeOutcome`
Regex:
- `SECTION_HEADING = (?m)^## (?<title>.+)$`
- `FP_COMMENT = (?m)^<!-- CONTINUITY-FP: (?<fp>[a-z0-9_-]+) -->\s*$`
```text
function mergeAppendSection(anchorBody, payload, dedupeFingerprint):
  title = trim(payload.sectionTitle)
  body = trim(payload.sectionBody)
  if title is empty or body is empty: return noOp("section title or body empty")
  if regexFind(FP_COMMENT matching dedupeFingerprint, anchorBody): return noOp("section fingerprint already present")
  for each heading in regexFindAll(SECTION_HEADING, anchorBody):
    if normalizeTitle(heading.title) == normalizeTitle(title):
      if normalizeParagraphWhitespace(anchorBody) contains normalizeParagraphWhitespace(body):
        return noOp("equivalent section already present")
  if malformedHeadingHierarchyDetected(anchorBody): raise MergeError("section structure corrupted")
  newSection = "## " + title + "\n\n" + "<!-- CONTINUITY-FP: " + dedupeFingerprint + " -->\n" + body
  if trim(anchorBody) is empty:
    updated = newSection
  else:
    updated = rstrip(anchorBody) + "\n\n" + newSection
  return changed(updated)
```
Idempotency: fingerprint first, then normalized heading-title plus body equivalence.
Edge cases: empty anchor initializes; malformed heading hierarchy fails closed; already-present section returns no-op.
Envelope hook: envelope swaps only the target body, then verifies the new terminal heading exists in the persisted anchor.
## Findings
- **F23.1**: All five merge modes can share one outer lock-and-validate envelope if each mode is a pure anchor-body transform.
- **F23.2**: Idempotency must be two-layered: explicit fingerprint comments for new writes and normalization-based fallbacks for legacy content.
- **F23.3**: `insert-new-adr` is the only mode that expands the nested anchor graph, so it needs the strictest full-document revalidation.
- **F23.4**: `append-table-row` and `update-in-place` should fail closed on structural corruption because "best effort" repair would silently damage canonical docs.
- **F23.5**: The routing-layer `append-new-session` label should normalize before dispatch so the implementation stays constrained to the five canonical Q2 modes.
