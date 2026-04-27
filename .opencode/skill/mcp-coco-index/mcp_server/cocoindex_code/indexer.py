"""CocoIndex app for indexing codebases."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from __future__ import annotations

import hashlib
import os
from collections.abc import Iterable
from pathlib import Path, PurePath

import cocoindex as coco
from cocoindex.connectors import localfs, sqlite
from cocoindex.connectors.sqlite import Vec0TableDef
from cocoindex.ops.text import RecursiveSplitter, detect_code_language
from cocoindex.resources.chunk import Chunk
from cocoindex.resources.file import FilePathMatcher, PatternFilePathMatcher
from cocoindex.resources.id import IdGenerator
from pathspec import GitIgnoreSpec

from .settings import PROJECT_SETTINGS
from .shared import (
    CODEBASE_DIR,
    EMBEDDER,
    EXT_LANG_OVERRIDE_MAP,
    GITIGNORE_SPEC,
    SQLITE_DB,
    CodeChunk,
)

# Chunking configuration
CHUNK_SIZE = 1000
MIN_CHUNK_SIZE = 250
CHUNK_OVERLAP = 150

# Chunking splitter (stateless, can be module-level)
splitter = RecursiveSplitter()


def _normalize_chunk_content(content: str) -> str:
    """Normalize whitespace so semantically identical chunks hash together."""
    return " ".join(content.strip().split())


def _path_parts(path: PurePath) -> tuple[str, ...]:
    return tuple(part.lower() for part in path.parts)


def _is_under_specs(path: PurePath) -> bool:
    return "specs" in _path_parts(path)


def classify_path(path: PurePath) -> str:
    """Classify a source path for bounded query-time reranking."""
    path_posix = path.as_posix()
    path_lower = path_posix.lower()
    parts = _path_parts(path)
    name = path.name.lower()
    suffix = path.suffix.lower()

    if any(part in {"vendor", "node_modules", ".venv"} for part in parts):
        return "vendor"
    if (
        any(part in {"dist", "build", ".next"} for part in parts)
        or path_lower.endswith(".min.js")
    ):
        return "generated"
    if "specs" in parts:
        specs_idx = parts.index("specs")
        specs_tail = parts[specs_idx + 1 :]
        if (
            "research" in specs_tail
            or name == "research.md"
            or "iterations" in specs_tail
        ):
            return "spec_research"
    if (
        (suffix == ".py" and "test" in name)
        or path_lower.endswith(".vitest.ts")
        or "tests" in parts
        or (suffix == ".py" and name.startswith("test_"))
        or "__tests__" in parts
    ):
        return "tests"
    if not _is_under_specs(path) and (
        (name.startswith("readme") and suffix == ".md")
        or (suffix == ".md" and "docs" in parts)
        or (suffix == ".md" and len(path.parts) == 1)
    ):
        return "docs"
    return "implementation"


def _normalize_gitignore_lines(lines: Iterable[str], directory: PurePath) -> list[str]:
    """Normalize .gitignore lines to root-relative gitignore patterns."""
    if directory in (PurePath("."), PurePath("")):
        prefix = ""
    else:
        prefix = f"{directory.as_posix().rstrip('/')}/"

    normalized: list[str] = []
    for raw_line in lines:
        line = raw_line.rstrip("\n\r")
        if not line:
            continue
        stripped = line.lstrip()
        if not stripped or stripped.startswith("#"):
            continue
        if line.startswith("\\#") or line.startswith("\\!"):
            line = line[1:]
        negated = line.startswith("!")
        if negated:
            line = line[1:]
        body = line.strip()
        if not body:
            continue
        anchor = body.startswith("/")
        if anchor:
            body = body.lstrip("/")
            pattern = f"{prefix}{body}" if prefix else body
        else:
            contains_slash = "/" in body
            base = prefix
            if contains_slash:
                pattern = f"{base}{body}"
            else:
                if base:
                    pattern = f"{base}**/{body}"
                else:
                    pattern = f"**/{body}"
        if negated:
            pattern = f"!{pattern}"
        normalized.append(pattern)
    return normalized


class GitignoreAwareMatcher(FilePathMatcher):
    """Wraps another matcher and applies .gitignore filtering."""

    def __init__(
        self,
        delegate: FilePathMatcher,
        root_spec: GitIgnoreSpec | None,
        project_root: Path,
    ) -> None:
        self._delegate = delegate
        self._root = project_root
        self._spec_cache: dict[PurePath, GitIgnoreSpec | None] = {PurePath("."): root_spec}

    def _spec_for(self, directory: PurePath) -> GitIgnoreSpec | None:
        if directory in self._spec_cache:
            return self._spec_cache[directory]

        parent_dir = directory.parent if directory != PurePath(".") else PurePath(".")
        parent_spec = self._spec_for(parent_dir)
        spec = parent_spec

        gitignore_path = (self._root / directory) / ".gitignore"
        if gitignore_path.is_file():
            try:
                lines = gitignore_path.read_text().splitlines()
            except (OSError, UnicodeDecodeError):
                lines = []
            normalized = _normalize_gitignore_lines(lines, directory)
            if normalized:
                new_spec = GitIgnoreSpec.from_lines(normalized)
                spec = new_spec if spec is None else spec + new_spec

        self._spec_cache[directory] = spec
        return spec

    def _is_ignored(self, path: PurePath, is_dir: bool) -> bool:
        directory = path if is_dir else path.parent
        if directory == PurePath(""):
            directory = PurePath(".")
        spec = self._spec_for(directory)
        if spec is None:
            return False
        match_path = path.as_posix()
        if is_dir and not match_path.endswith("/"):
            match_path = f"{match_path}/"
        return spec.match_file(match_path)

    def is_dir_included(self, path: PurePath) -> bool:
        if self._is_ignored(path, True):
            return False
        return self._delegate.is_dir_included(path)

    def is_file_included(self, path: PurePath) -> bool:
        if self._is_ignored(path, False):
            return False
        return self._delegate.is_file_included(path)


@coco.fn(memo=True)
async def process_file(
    file: localfs.File,
    table: sqlite.TableTarget[CodeChunk],
) -> None:
    """Process a single file: chunk, embed, and store."""
    embedder = coco.use_context(EMBEDDER)

    try:
        content = await file.read_text()
    except UnicodeDecodeError:
        return

    if not content.strip():
        return

    suffix = file.file_path.path.suffix
    ext_lang_override_map = coco.use_context(EXT_LANG_OVERRIDE_MAP)
    language = (
        ext_lang_override_map.get(suffix)
        or detect_code_language(filename=file.file_path.path.name)
        or "text"
    )
    file_path = file.file_path.path.as_posix()
    project_root = coco.use_context(CODEBASE_DIR)
    source_realpath = os.path.realpath(project_root / file.file_path.path)
    path_class = classify_path(file.file_path.path)

    chunks = splitter.split(
        content,
        chunk_size=CHUNK_SIZE,
        min_chunk_size=MIN_CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        language=language,
    )

    id_gen = IdGenerator()

    async def process(chunk: Chunk) -> None:
        normalized_content = _normalize_chunk_content(chunk.text)
        table.declare_row(
            row=CodeChunk(
                id=await id_gen.next_id(chunk.text),
                file_path=file_path,
                source_realpath=source_realpath,
                language=language,
                content=chunk.text,
                content_hash=hashlib.sha256(normalized_content.encode()).hexdigest(),
                path_class=path_class,
                start_line=chunk.start.line,
                end_line=chunk.end.line,
                embedding=await embedder.embed(chunk.text),
            )
        )

    await coco.map(process, chunks)


@coco.fn
async def indexer_main() -> None:
    """Main indexing function - walks files and processes each."""
    ps = coco.use_context(PROJECT_SETTINGS)
    gitignore_spec = coco.use_context(GITIGNORE_SPEC)
    project_root = coco.use_context(CODEBASE_DIR)

    table = await sqlite.mount_table_target(
        db=SQLITE_DB,
        table_name="code_chunks_vec",
        table_schema=await sqlite.TableSchema.from_class(
            CodeChunk,
            primary_key=["id"],
        ),
        virtual_table_def=Vec0TableDef(
            partition_key_columns=["language"],
            auxiliary_columns=[
                "file_path",
                "source_realpath",
                "content",
                "content_hash",
                "path_class",
                "start_line",
                "end_line",
            ],
        ),
    )

    base_matcher = PatternFilePathMatcher(
        included_patterns=ps.include_patterns,
        excluded_patterns=ps.exclude_patterns,
    )
    matcher: FilePathMatcher = GitignoreAwareMatcher(base_matcher, gitignore_spec, project_root)

    files = localfs.walk_dir(
        CODEBASE_DIR,
        recursive=True,
        path_matcher=matcher,
    )

    with coco.component_subpath(coco.Symbol("process_file")):
        await coco.mount_each(process_file, files.items(), table)
