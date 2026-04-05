# CHK-210 Evidence - 2026-02-19

## Scope

- Check: `CHK-210 [P1] SC-013: 100% of new memories include quality_score and quality_flags`
- Spec: `.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag`
- Database: `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`

## DB Query Evidence (After Remediation)

Command:

```bash
sqlite3 -header -column ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite" "SELECT COUNT(*) AS recent_rows, SUM(CASE WHEN quality_score IS NOT NULL THEN 1 ELSE 0 END) AS quality_score_non_null, SUM(CASE WHEN quality_flags IS NOT NULL THEN 1 ELSE 0 END) AS quality_flags_non_null FROM (SELECT id, quality_score, quality_flags FROM memory_index WHERE spec_folder LIKE 'system-spec-kit/020-mcp-working-memory-hybrid-rag%' AND document_type='memory' ORDER BY datetime(updated_at) DESC, id DESC LIMIT 10);"
```

Output:

```text
recent_rows  quality_score_non_null  quality_flags_non_null
-----------  ----------------------  ----------------------
10           10                      10
```

## 10-File Spot Check Summary

Method:

- Selected top 10 recent `document_type='memory'` records for `spec_folder LIKE 'system-spec-kit/020-mcp-working-memory-hybrid-rag%'`.
- Verified both DB non-null fields and file-level YAML metadata key presence (`quality_score`, `quality_flags`) in each memory file.

Results (from command output):

- DB `quality_score IS NOT NULL`: **10/10**
- DB `quality_flags IS NOT NULL`: **10/10**
- File has `quality_score:` key: **10/10**
- File has `quality_flags:` key: **10/10**

Representative table:

```text
id|db_quality_score_non_null|db_quality_flags_non_null|file_quality_score_key|file_quality_flags_key
3437|True|True|True|True
3436|True|True|True|True
3435|True|True|True|True
3434|True|True|True|True
3433|True|True|True|True
3432|True|True|True|True
3431|True|True|True|True
3430|True|True|True|True
3429|True|True|True|True
3428|True|True|True|True
```

## Conclusion

- `CHK-210` closure criterion is **met** for the tracked recent sample.
- Root cause remediated for this slice: DB `quality_flags` now non-null for 10/10 recent rows, and file metadata keys present for 10/10 files.
