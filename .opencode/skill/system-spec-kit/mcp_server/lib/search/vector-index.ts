// ---------------------------------------------------------------
// MODULE: Vector Index Facade
// AI-WHY: Backward-compatible export surface across split modules.
// ---------------------------------------------------------------

export * from './vector-index-types';
export * from './vector-index-schema';
export * from './vector-index-mutations';
export * from './vector-index-queries';
export * from './vector-index-aliases';

// Re-export store items that aren't re-exported by other modules
export {
  initializeDb,
  initialize_db,
  closeDb,
  close_db,
  getDb,
  get_db,
  getDbPath,
  get_db_path,
  clearConstitutionalCache,
  validateFilePath,
  isVectorSearchAvailable,
  SQLiteVectorStore,
  getConfirmedEmbeddingDimension,
  getEmbeddingDim,
  validateEmbeddingDimension,
  EMBEDDING_DIM,
  DEFAULT_DB_PATH,
  search_weights,
  safe_read_file_async,
  safe_parse_json,
  validate_file_path_local,
  get_embedding_dim,
  get_confirmed_embedding_dimension,
  validate_embedding_dimension,
  is_vector_search_available,
  clear_constitutional_cache,
  get_constitutional_memories,
  init_prepared_statements,
  clear_prepared_statements,
  refresh_interference_scores_for_folder,
  sqlite_vec_available,
} from './vector-index-store';

// Snake_case aliases for store exports used by legacy callers
export {
  isVectorSearchAvailable as is_vector_search_available_alias,
} from './vector-index-store';
