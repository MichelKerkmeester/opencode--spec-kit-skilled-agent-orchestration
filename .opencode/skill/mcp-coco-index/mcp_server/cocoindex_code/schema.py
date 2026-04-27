"""Data models for CocoIndex Code."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from dataclasses import dataclass
from typing import Any


@dataclass
class CodeChunk:
    """Represents an indexed code chunk stored in SQLite."""

    id: int
    file_path: str
    source_realpath: str
    language: str
    content: str
    content_hash: str
    path_class: str
    start_line: int
    end_line: int
    embedding: Any  # NDArray - type hint relaxed for compatibility


@dataclass
class QueryResult:
    """Result from a vector similarity query."""

    file_path: str
    language: str
    content: str
    start_line: int
    end_line: int
    score: float
    raw_score: float
    path_class: str
    rankingSignals: list[str]
