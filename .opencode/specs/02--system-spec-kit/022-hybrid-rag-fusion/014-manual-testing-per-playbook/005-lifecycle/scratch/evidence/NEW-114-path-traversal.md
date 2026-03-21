# 114 — Path Traversal Validation Evidence

## Preconditions
- MCP server healthy (v1.7.2)
- Sandbox spec folder `test-sandbox-lifecycle` with valid seed files
- Path validation active in ingest handler

## Execution Transcript

### Step 1: Traversal path rejection (`../` segments)
```
memory_ingest_start({ paths: ["../../etc/passwd"] })
```
**Response (ERROR):**
```json
{
  "summary": "Error: Invalid arguments for \"memory_ingest_start\". Parameter \"paths.0\" is invalid: Path must not contain traversal sequences",
  "data": {
    "error": "Invalid arguments for \"memory_ingest_start\". Parameter \"paths.0\" is invalid: Path must not contain traversal sequences",
    "code": "E030",
    "details": {
      "tool": "memory_ingest_start",
      "issues": ["paths.0: Path must not contain traversal sequences"]
    }
  }
}
```
- Traversal segments `../` rejected at input validation layer (E030)
- Rejection happens before any file system access

### Step 2: Out-of-base absolute path rejection
```
memory_ingest_start({ paths: ["/tmp/outside-base/file.md"] })
```
**Response (ERROR):**
```json
{
  "summary": "Error: Invalid path(s) rejected: \"/tmp/outside-base/file.md\" (is outside allowed memory roots)",
  "data": {
    "error": "Invalid path(s) rejected: \"/tmp/outside-base/file.md\" (is outside allowed memory roots)",
    "code": "E_VALIDATION",
    "details": {
      "allowedBasePathCount": 3,
      "allowedPathPolicy": "configured-memory-roots",
      "rejectedCount": 1
    }
  }
}
```
- Absolute path outside allowed base directories rejected (E_VALIDATION)
- System reports 3 allowed memory roots with `configured-memory-roots` policy

### Step 3: Valid sandbox path acceptance
```
memory_ingest_start({
  paths: [".../specs/test-sandbox-lifecycle/memory/seed-file-1.md"],
  specFolder: "test-sandbox-lifecycle"
})
```
**Response:**
```json
{
  "jobId": "job_0lfiYAob57Fo",
  "state": "queued",
  "filesTotal": 1
}
```
- Valid path within allowed memory roots accepted, job created

## Expected Signals Checklist
- [x] Traversal paths (`../`) rejected with validation error (E030)
- [x] Absolute paths outside allowed base rejected with E_VALIDATION error
- [x] Valid paths within allowed directories accepted and job created
- [x] Error codes present for invalid inputs (E030, E_VALIDATION)
- [x] Allowed base directory policy enforced (3 configured roots)

## Observations
- Two-layer validation: schema-level traversal check (E030) + path-security base-directory check (E_VALIDATION)
- Traversal rejection happens at parameter validation (before handler logic)
- Out-of-base rejection happens at handler level with clear policy information
- Valid paths create jobs immediately without issues

## Verdict: **PASS**
All acceptance checks satisfied. Traversal and out-of-base paths rejected with appropriate error codes. Valid sandbox paths create jobs successfully.
