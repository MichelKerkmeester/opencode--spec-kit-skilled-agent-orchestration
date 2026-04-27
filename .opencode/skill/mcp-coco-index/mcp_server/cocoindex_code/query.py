"""Query implementation for codebase search."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from __future__ import annotations

import heapq
import hashlib
import sqlite3
from pathlib import Path
from typing import Any

from .schema import QueryResult
from .shared import EMBEDDER, SQLITE_DB, query_prompt_name


def _l2_to_score(distance: float) -> float:
    """Convert L2 distance to cosine similarity (exact for unit vectors)."""
    return 1.0 - distance * distance / 2.0


class QueryResults(list[QueryResult]):
    """List of query results with response-level dedup telemetry."""

    dedupedAliases: int
    uniqueResultCount: int

    def __init__(
        self,
        results: list[QueryResult],
        *,
        deduped_aliases: int,
        unique_result_count: int,
    ) -> None:
        super().__init__(results)
        self.dedupedAliases = deduped_aliases
        self.uniqueResultCount = unique_result_count


IMPLEMENTATION_INTENT_KEYWORDS = [
    "implementation",
    "function",
    "handler",
    "class ",
    "method",
    "callers",
    "caller",
    "called by",
    "calls ",
    "implements ",
    "code for",
    "source for",
    "definition of",
]


def _has_implementation_intent(query: str) -> bool:
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in IMPLEMENTATION_INTENT_KEYWORDS)


def _normalize_chunk_content(content: str) -> str:
    return " ".join(content.strip().split())


def _hash_content(content: str) -> str:
    return hashlib.sha256(_normalize_chunk_content(content).encode()).hexdigest()


def _chunk_columns(conn: sqlite3.Connection) -> set[str]:
    rows = conn.execute("PRAGMA table_info(code_chunks_vec)").fetchall()
    return {row[1] for row in rows}


def _select_chunk_columns(conn: sqlite3.Connection) -> str:
    columns = _chunk_columns(conn)
    source_realpath = "source_realpath" if "source_realpath" in columns else "NULL"
    content_hash = "content_hash" if "content_hash" in columns else "NULL"
    path_class = "path_class" if "path_class" in columns else "'implementation'"
    return (
        "file_path, "
        f"{source_realpath} AS source_realpath, "
        "language, content, "
        f"{content_hash} AS content_hash, "
        f"{path_class} AS path_class, "
        "start_line, end_line"
    )


def _knn_query(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    k: int,
    language: str | None = None,
) -> list[tuple[Any, ...]]:
    """Run a vec0 KNN query, optionally constrained to a language partition."""
    if language is not None:
        select_columns = _select_chunk_columns(conn)
        return conn.execute(
            f"""
            SELECT {select_columns}, distance
            FROM code_chunks_vec
            WHERE embedding MATCH ? AND k = ? AND language = ?
            ORDER BY distance
            """,
            (embedding_bytes, k, language),
        ).fetchall()
    select_columns = _select_chunk_columns(conn)
    return conn.execute(
        f"""
        SELECT {select_columns}, distance
        FROM code_chunks_vec
        WHERE embedding MATCH ? AND k = ?
        ORDER BY distance
        """,
        (embedding_bytes, k),
    ).fetchall()


def _full_scan_query(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    limit: int,
    offset: int,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
) -> list[tuple[Any, ...]]:
    """Full scan with SQL-level distance computation and filtering."""
    select_columns = _select_chunk_columns(conn)
    conditions: list[str] = []
    params: list[Any] = [embedding_bytes]

    if languages:
        placeholders = ",".join("?" for _ in languages)
        conditions.append(f"language IN ({placeholders})")
        params.extend(languages)

    if paths:
        path_clauses = " OR ".join("file_path GLOB ?" for _ in paths)
        conditions.append(f"({path_clauses})")
        params.extend(paths)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    params.extend([limit, offset])

    return conn.execute(
        f"""
        SELECT {select_columns},
               vec_distance_L2(embedding, ?) as distance
        FROM code_chunks_vec
        {where}
        ORDER BY distance
        LIMIT ? OFFSET ?
        """,
        params,
    ).fetchall()


def _dedup_key(row: tuple[Any, ...]) -> tuple[str, str, int, int]:
    (
        _file_path,
        source_realpath,
        _language,
        content,
        content_hash,
        _path_class,
        start_line,
        end_line,
        _distance,
    ) = row
    if source_realpath:
        return ("source_realpath", str(source_realpath), start_line, end_line)
    fallback_hash = content_hash or _hash_content(content)
    return ("content_hash", str(fallback_hash), start_line, end_line)


def _ranked_result(
    row: tuple[Any, ...],
    *,
    implementation_intent: bool,
) -> QueryResult:
    (
        file_path,
        _source_realpath,
        language,
        content,
        _content_hash,
        path_class,
        start_line,
        end_line,
        distance,
    ) = row
    raw_score = _l2_to_score(distance)
    score = raw_score
    ranking_signals: list[str] = []

    if implementation_intent:
        if path_class == "implementation":
            score += 0.05
            ranking_signals.append("implementation_boost")
        elif path_class == "spec_research":
            score -= 0.05
            ranking_signals.append("spec_research_penalty")
        elif path_class == "docs":
            score -= 0.05
            ranking_signals.append("docs_penalty")

    return QueryResult(
        file_path=file_path,
        language=language,
        content=content,
        start_line=start_line,
        end_line=end_line,
        score=score,
        raw_score=raw_score,
        path_class=path_class or "implementation",
        rankingSignals=ranking_signals,
    )


def _dedup_and_rank_rows(
    rows: list[tuple[Any, ...]],
    *,
    query: str,
    limit: int,
    offset: int,
) -> QueryResults:
    implementation_intent = _has_implementation_intent(query)
    ranked = [
        (_ranked_result(row, implementation_intent=implementation_intent), row)
        for row in rows
    ]
    ranked.sort(key=lambda item: item[0].score, reverse=True)

    seen: set[tuple[str, str, int, int]] = set()
    unique: list[QueryResult] = []
    deduped_aliases = 0
    for result, row in ranked:
        key = _dedup_key(row)
        if key in seen:
            deduped_aliases += 1
            continue
        seen.add(key)
        unique.append(result)

    window = unique[offset : offset + limit]
    return QueryResults(
        window,
        deduped_aliases=deduped_aliases,
        unique_result_count=len(window),
    )


async def query_codebase(
    query: str,
    target_sqlite_db_path: Path,
    env: Any,
    limit: int = 10,
    offset: int = 0,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
) -> QueryResults:
    """
    Perform vector similarity search using vec0 KNN index.

    Uses sqlite-vec's vec0 virtual table for indexed nearest-neighbor search.
    Language filtering uses vec0 partition keys for exact index-level filtering.
    Path filtering triggers a full scan with distance computation.
    """
    if not target_sqlite_db_path.exists():
        raise RuntimeError(
            f"Index database not found at {target_sqlite_db_path}. "
            "Please run a query with refresh_index=True first."
        )

    db = env.get_context(SQLITE_DB)
    embedder = env.get_context(EMBEDDER)

    # Generate query embedding.
    query_embedding = await embedder.embed(query, query_prompt_name)

    embedding_bytes = query_embedding.astype("float32").tobytes()
    unique_k = max(limit + offset, 1)
    fetch_k = unique_k * 4

    with db.readonly() as conn:
        if paths:
            rows = _full_scan_query(conn, embedding_bytes, fetch_k, 0, languages, paths)
        elif not languages or len(languages) == 1:
            lang = languages[0] if languages else None
            rows = _knn_query(conn, embedding_bytes, fetch_k, lang)
        else:
            rows = heapq.nsmallest(
                fetch_k,
                (
                    row
                    for lang in languages
                    for row in _knn_query(conn, embedding_bytes, fetch_k, lang)
                ),
                key=lambda r: r[8],
            )

    return _dedup_and_rank_rows(rows, query=query, limit=limit, offset=offset)
