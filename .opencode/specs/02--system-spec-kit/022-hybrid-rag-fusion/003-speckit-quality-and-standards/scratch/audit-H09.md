# H09 TypeScript Quality Audit

Scope: exact file list provided by user under `.opencode/skill/system-spec-kit/mcp_server/lib/.`
Checks: P0 (header, any-in-exports, PascalCase types, commented-out code, AI-prefixed WHY comments) and P1 (return types, named object params, non-null assertion justification, TSDoc on exports, catch unknown/instanceof).

## Summary
- Files audited: 35
- Total findings: 175

## cache/embedding-cache.ts
- ✅ No findings

## cache/tool-cache.ts
- ✅ No findings

## chunking/anchor-chunker.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-4] Export missing TSDoc at L12: export interface AnchorChunk {
- [P1-4] Export missing TSDoc at L23: export interface ChunkingResult {

## chunking/chunk-thinning.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-4] Export missing TSDoc at L14: export interface ChunkScore {
- [P1-4] Export missing TSDoc at L22: export interface ThinningResult {

## config/memory-types.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-4] Export missing TSDoc at L10: export interface MemoryTypeConfig {
- [P1-4] Export missing TSDoc at L17: export type MemoryTypeName =
- [P1-4] Export missing TSDoc at L42: export const MEMORY_TYPES: Readonly<Record<MemoryTypeName, MemoryTypeConfig>> = {
- [P1-4] Export missing TSDoc at L100: export const HALF_LIVES_DAYS: Readonly<Record<string, number | null>> = Object.fromEntries(
- [P1-4] Export missing TSDoc at L120: export const PATH_TYPE_PATTERNS: readonly PathTypePattern[] = [
- [P1-4] Export missing TSDoc at L176: export const KEYWORD_TYPE_MAP: Readonly<Record<string, MemoryTypeName>> = {
- [P1-4] Export missing TSDoc at L247: export function isValidType(type: string | null | undefined): boolean {
- [P1-4] Export missing TSDoc at L274: export function getDefaultType(): MemoryTypeName {
- [P1-4] Export missing TSDoc at L300: export type DocumentType =
- [P1-4] Export missing TSDoc at L312: export interface SpecDocumentConfig {

## config/type-inference.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-4] Export missing TSDoc at L71: export function inferTypeFromPath(filePath: string | null | undefined): MemoryTypeName | null {
- [P1-4] Export missing TSDoc at L92: export function extractExplicitType(content: string | null | undefined): MemoryTypeName | null {
- [P1-4] Export missing TSDoc at L109: export function inferTypeFromTier(content: string | null | undefined): MemoryTypeName | null {
- [P1-4] Export missing TSDoc at L136: export function inferTypeFromKeywords(
- [P1-4] Export missing TSDoc at L195: export function inferMemoryType(params: InferMemoryTypeParams): InferenceResult {

## errors/core.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P0-4] Possible commented-out code at L168: // try/catch pattern is appropriate here since the project is CommonJS.
- [P1-4] Export missing TSDoc at L22: export interface ErrorResponseData {
- [P1-4] Export missing TSDoc at L28: export interface ErrorResponseMeta {
- [P1-4] Export missing TSDoc at L34: export interface ErrorResponse {
- [P1-4] Export missing TSDoc at L48: export const ErrorCodes = {
- [P1-4] Export missing TSDoc at L70: export type LegacyErrorCodeKey = keyof typeof ErrorCodes;
- [P1-4] Export missing TSDoc at L76: export class MemoryError extends Error {
- [P1-4] Export missing TSDoc at L100: export function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
- [P1-4] Export missing TSDoc at L131: export function userFriendlyError(error: Error): string {

## errors/index.ts
- ✅ No findings

## errors/recovery-hints.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-4] Export missing TSDoc at L10: export type Severity = 'low' | 'medium' | 'high' | 'critical';
- [P1-4] Export missing TSDoc at L12: export interface RecoveryHint {
- [P1-4] Export missing TSDoc at L19: export type RecoveryHintMap = Record<string, RecoveryHint>;
- [P1-4] Export missing TSDoc at L21: export type ToolSpecificHintMap = Record<string, Record<string, RecoveryHint>>;
- [P1-4] Export missing TSDoc at L30: export const ERROR_CODES = {
- [P1-4] Export missing TSDoc at L106: export type ErrorCodeKey = keyof typeof ERROR_CODES;
- [P1-4] Export missing TSDoc at L107: export type ErrorCodeValue = (typeof ERROR_CODES)[ErrorCodeKey];
- [P1-4] Export missing TSDoc at L116: export const RECOVERY_HINTS: RecoveryHintMap = {
- [P1-4] Export missing TSDoc at L624: export const DEFAULT_HINT: RecoveryHint = {
- [P1-4] Export missing TSDoc at L639: export const TOOL_SPECIFIC_HINTS: ToolSpecificHintMap = {

## extraction/entity-denylist.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## extraction/entity-extractor.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## extraction/extraction-adapter.ts
- ✅ No findings

## extraction/redaction-gate.ts
- ✅ No findings

## graph/community-detection.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-3] Non-null assertion without AI-prefixed justification at L72: adj.get(s)!.add(t);
- [P1-3] Non-null assertion without AI-prefixed justification at L73: adj.get(t)!.add(s);
- [P1-3] Non-null assertion without AI-prefixed justification at L213: const cid = community.get(node)!;
- [P1-3] Non-null assertion without AI-prefixed justification at L223: const currentCommunity = community.get(node)!;
- [P1-3] Non-null assertion without AI-prefixed justification at L224: const ki = degree.get(node)!;
- [P1-3] Non-null assertion without AI-prefixed justification at L231: const nc = community.get(neighbor)!;
- [P1-4] Export missing TSDoc at L558: export const __testables = {

## graph/graph-signals.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-3] Non-null assertion without AI-prefixed justification at L215: adjacency.get(source)!.push(target);

## interfaces/vector-store.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## learning/corrections.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-3] Non-null assertion without AI-prefixed justification at L363: const stmt = db!.prepare(`
- [P1-3] Non-null assertion without AI-prefixed justification at L392: const causal_table_exists = db!.prepare(`
- [P1-3] Non-null assertion without AI-prefixed justification at L417: db!.prepare(`
- [P1-3] Non-null assertion without AI-prefixed justification at L513: db!.prepare(`
- [P1-3] Non-null assertion without AI-prefixed justification at L523: db!.prepare(`
- [P1-3] Non-null assertion without AI-prefixed justification at L619: const as_original = db!.prepare(`
- [P1-3] Non-null assertion without AI-prefixed justification at L638: const as_correction = db!.prepare(`
- [P1-4] Export missing TSDoc at L12: export interface CorrectionTypes {
- [P1-4] Export missing TSDoc at L19: export interface StabilityChanges {
- [P1-4] Export missing TSDoc at L32: export interface CorrectionResult {
- [P1-4] Export missing TSDoc at L43: export interface CorrectionRecord {
- [P1-4] Export missing TSDoc at L59: export interface CorrectionChainEntry extends CorrectionRecord {
- [P1-4] Export missing TSDoc at L64: export interface CorrectionWithTitles extends CorrectionRecord {
- [P1-4] Export missing TSDoc at L69: export interface CorrectionChain {
- [P1-4] Export missing TSDoc at L77: export interface CorrectionStats {
- [P1-4] Export missing TSDoc at L86: export interface RecordCorrectionParams {
- [P1-4] Export missing TSDoc at L94: export interface UndoResult {
- [P1-4] Export missing TSDoc at L108: export interface SchemaResult {
- [P1-4] Export missing TSDoc at L121: export const CORRECTION_TYPES: CorrectionTypes = Object.freeze({
- [P1-4] Export missing TSDoc at L128: export function get_correction_types(): string[] {
- [P1-4] Export missing TSDoc at L132: export const CORRECTION_STABILITY_PENALTY: number = 0.5;
- [P1-4] Export missing TSDoc at L133: export const REPLACEMENT_STABILITY_BOOST: number = 1.2;
- [P1-4] Export missing TSDoc at L157: export function init(database: Database.Database): SchemaResult {
- [P1-4] Export missing TSDoc at L165: export function get_db(): Database.Database | null {
- [P1-4] Export missing TSDoc at L169: export function is_enabled(): boolean {
- [P1-4] Export missing TSDoc at L221: export function ensure_schema(): SchemaResult {
- [P1-4] Export missing TSDoc at L295: export function record_correction(params: RecordCorrectionParams): CorrectionResult {
- [P1-4] Export missing TSDoc at L469: export function undo_correction(correction_id: number): UndoResult {
- [P1-4] Export missing TSDoc at L562: export function get_corrections_for_memory(
- [P1-4] Export missing TSDoc at L600: export function get_correction_chain(
- [P1-4] Export missing TSDoc at L671: export function get_corrections_stats(): CorrectionStats {
- [P1-4] Export missing TSDoc at L726: export function deprecate_memory(memory_id: number, reason: string = 'Deprecated'): CorrectionResult {
- [P1-4] Export missing TSDoc at L736: export function supersede_memory(
- [P1-4] Export missing TSDoc at L750: export function refine_memory(
- [P1-4] Export missing TSDoc at L764: export function merge_memories(
- [P1-5] catch block missing instanceof check (first ~500 chars) at L240
- [P1-5] catch block missing instanceof check (first ~500 chars) at L262
- [P1-5] catch block missing instanceof check (first ~500 chars) at L285
- [P1-5] catch block missing instanceof check (first ~500 chars) at L428
- [P1-5] catch block missing instanceof check (first ~500 chars) at L459
- [P1-5] catch block missing instanceof check (first ~500 chars) at L531
- [P1-5] catch block missing instanceof check (first ~500 chars) at L552
- [P1-5] catch block missing instanceof check (first ~500 chars) at L594
- [P1-5] catch block missing instanceof check (first ~500 chars) at L664
- [P1-5] catch block missing instanceof check (first ~500 chars) at L708
- [P1-5] catch block missing instanceof check (first ~500 chars) at L786

## learning/index.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## manage/pagerank.ts
- [P0-5] WHY comment lacks AI prefix at L91: // WHY: inLinks.set(targetId, []) on the preceding line guarantees the key exists
- [P1-3] Non-null assertion without AI-prefixed justification at L92: inLinks.get(targetId)!.push(node.id);

## ops/file-watcher.ts
- [P1-4] Export missing TSDoc at L9: export interface WatcherConfig {
- [P1-4] Export missing TSDoc at L16: export interface FSWatcher {
- [P1-4] Export missing TSDoc at L102: export function startFileWatcher(config: WatcherConfig): FSWatcher {
- [P1-4] Export missing TSDoc at L332: export const __testables = {
- [P1-5] catch block missing instanceof check (first ~500 chars) at L91
- [P1-5] catch block missing instanceof check (first ~500 chars) at L209
- [P1-5] catch block missing instanceof check (first ~500 chars) at L221
- [P1-5] catch block missing instanceof check (first ~500 chars) at L241

## ops/job-queue.ts
- [P1-2] Inline object param type; use named interface at L200
- [P1-3] Non-null assertion without AI-prefixed justification at L448: const jobId = pendingQueue.shift()!;
- [P1-4] Export missing TSDoc at L10: export type IngestJobState =
- [P1-4] Export missing TSDoc at L19: export interface IngestJobError {
- [P1-4] Export missing TSDoc at L25: export interface IngestJob {
- [P1-4] Export missing TSDoc at L355: export function getIngestProgressPercent(job: Pick<IngestJob, 'filesProcessed' | 'filesTotal'>): number {
- [P1-5] catch block missing instanceof check (first ~500 chars) at L91
- [P1-5] catch block missing instanceof check (first ~500 chars) at L108
- [P1-5] catch block missing instanceof check (first ~500 chars) at L127
- [P1-5] catch block missing instanceof check (first ~500 chars) at L413
- [P1-5] catch block missing instanceof check (first ~500 chars) at L451
- [P1-5] catch block missing instanceof check (first ~500 chars) at L458

## parsing/content-normalizer.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## parsing/entity-scope.ts
- [P0-1] Missing exact 3-line MODULE header at file top
- [P1-2] Inline object param type; use named interface at L88

## parsing/memory-parser.ts
- [P1-4] Export missing TSDoc at L89: export const MAX_CONTENT_LENGTH: number = parseInt(process.env.MCP_MAX_CONTENT_LENGTH || '250000', 10);
- [P1-4] Export missing TSDoc at L91: export const CONTEXT_TYPE_MAP: Record<string, ContextType> = {

## parsing/trigger-matcher.ts
- [P1-3] Non-null assertion without AI-prefixed justification at L148: const regex = regexLruCache.get(phrase)!;
- [P1-3] Non-null assertion without AI-prefixed justification at L448: matchesByMemory.get(key)!.matchedPhrases.push(entry.phrase);
- [P1-5] catch block missing instanceof check (first ~500 chars) at L219

## providers/embeddings.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## providers/retry-manager.ts
- [P1-3] Non-null assertion without AI-prefixed justification at L428: results.details!.push({ id: memory.id, success: false, error: 'Could not load content (counted as retry)' });
- [P1-3] Non-null assertion without AI-prefixed justification at L443: results.details!.push({ id: memory.id, ...result } as RetryDetailEntry);
- [P1-5] catch block missing instanceof check (first ~500 chars) at L538
- [P1-5] catch block missing instanceof check (first ~500 chars) at L548

## response/envelope.ts
- [P1-4] Export missing TSDoc at L11: export interface ResponseMeta {
- [P1-4] Export missing TSDoc at L22: export interface MCPEnvelope<T = unknown> {
- [P1-4] Export missing TSDoc at L29: export interface CreateResponseOptions<T = unknown> {
- [P1-4] Export missing TSDoc at L39: export interface CreateEmptyResponseOptions {
- [P1-4] Export missing TSDoc at L47: export interface RecoveryInfo {
- [P1-4] Export missing TSDoc at L54: export interface CreateErrorResponseOptions {
- [P1-4] Export missing TSDoc at L67: export interface DefaultHints {
- [P1-4] Export missing TSDoc at L77: export const DEFAULT_HINTS: DefaultHints = {
- [P1-4] Export missing TSDoc at L94: export function createResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T> {
- [P1-4] Export missing TSDoc at L129: export function createSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T> {
- [P1-4] Export missing TSDoc at L136: export function createEmptyResponse(options: CreateEmptyResponseOptions): MCPEnvelope<{ count: number; results: never[]; [key: string]: unknown }> {
- [P1-4] Export missing TSDoc at L158: export function createErrorResponse(options: CreateErrorResponseOptions): MCPEnvelope<{ error: string; code: string; details: Record<string, unknown> }> {
- [P1-4] Export missing TSDoc at L199: export function wrapForMCP<T>(envelope: MCPEnvelope<T>, isError: boolean = false): MCPResponse {
- [P1-4] Export missing TSDoc at L212: export function createMCPResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {
- [P1-4] Export missing TSDoc at L217: export function createMCPSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {
- [P1-4] Export missing TSDoc at L222: export function createMCPEmptyResponse(options: CreateEmptyResponseOptions): MCPResponse {
- [P1-4] Export missing TSDoc at L227: export function createMCPErrorResponse(options: CreateErrorResponseOptions): MCPResponse {

## session/session-manager.ts
- ✅ No findings

## utils/canonical-path.ts
- ✅ No findings

## utils/format-helpers.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## utils/logger.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## utils/path-security.ts
- [P0-1] Missing exact 3-line MODULE header at file top

## validation/preflight.ts
- [P1-2] Inline object param type; use named interface at L236
- [P1-2] Inline object param type; use named interface at L442
- [P1-2] Inline object param type; use named interface at L504
- [P1-4] Export missing TSDoc at L179: export const PREFLIGHT_CONFIG: PreflightConfig = {
- [P1-4] Export missing TSDoc at L201: export class PreflightError extends Error {
- [P1-4] Export missing TSDoc at L236: export function validateAnchorFormat(content: string, options: { strict?: boolean } = {}): AnchorValidationResult {
- [P1-4] Export missing TSDoc at L343: export function computeContentHash(content: string): string {
- [P1-4] Export missing TSDoc at L347: export function checkDuplicate(params: DuplicateCheckParams, options: DuplicateCheckOptions = {}): DuplicateCheckResult {
- [P1-4] Export missing TSDoc at L436: export function estimateTokens(content: string | unknown): number {
- [P1-4] Export missing TSDoc at L442: export function checkTokenBudget(content: string, options: {
- [P1-4] Export missing TSDoc at L504: export function validateContentSize(content: string, options: {
- [P1-4] Export missing TSDoc at L563: export function runPreflight(params: PreflightParams, options: PreflightOptions = {}): PreflightResult {

## validation/save-quality-gate.ts
- [P1-2] Inline object param type; use named interface at L151
- [P1-2] Inline object param type; use named interface at L306
- [P1-2] Inline object param type; use named interface at L463

## Cross-cutting error hierarchy
Exported error classes in `errors/`: MemoryError
- ⚠️ `MemoryError` has no usage outside `errors/` in audited scope
