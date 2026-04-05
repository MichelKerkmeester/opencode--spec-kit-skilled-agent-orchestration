/* ─────────────────────────────────────────────────────────────
   Service Patterns - Generic Service Implementation Templates

   Production-ready templates for service layer implementation including:
   - Generic service pattern (Service[T])
   - Repository pattern with CRUD operations
   - Transaction management (WithTx)
   - Error handling patterns
   - Context propagation

   Usage: Copy and adapt these patterns for your domain services.
──────────────────────────────────────────────────────────────── */

package patterns

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

/* ─────────────────────────────────────────────────────────────
   1. COMMON INTERFACES
──────────────────────────────────────────────────────────────── */

// Entity represents a base entity with common fields.
// All domain entities should embed this struct.
type Entity struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// Identifiable interface for entities with UUID identifiers.
type Identifiable interface {
	GetID() uuid.UUID
}

// GetID returns the entity's unique identifier.
func (e Entity) GetID() uuid.UUID {
	return e.ID
}

/* ─────────────────────────────────────────────────────────────
   2. TRANSACTION MANAGEMENT
──────────────────────────────────────────────────────────────── */

// Transaction represents a database transaction interface.
type Transaction interface {
	Commit() error
	Rollback() error
}

// TxFunc is a function that executes within a transaction.
type TxFunc func(tx *gorm.DB) error

// TransactionManager provides transaction management capabilities.
type TransactionManager interface {
	// WithTx executes a function within a transaction.
	// Automatically commits on success, rolls back on error.
	WithTx(ctx context.Context, fn TxFunc) error

	// WithTxIsolation executes with specific isolation level.
	WithTxIsolation(ctx context.Context, level sql.IsolationLevel, fn TxFunc) error
}

// GormTransactionManager implements TransactionManager using GORM.
type GormTransactionManager struct {
	db *gorm.DB
}

// NewGormTransactionManager creates a new transaction manager.
func NewGormTransactionManager(db *gorm.DB) *GormTransactionManager {
	return &GormTransactionManager{db: db}
}

// WithTx executes fn within a transaction with automatic commit/rollback.
func (tm *GormTransactionManager) WithTx(ctx context.Context, fn TxFunc) error {
	return tm.db.WithContext(ctx).Transaction(fn)
}

// WithTxIsolation executes fn with specified isolation level.
func (tm *GormTransactionManager) WithTxIsolation(ctx context.Context, level sql.IsolationLevel, fn TxFunc) error {
	return tm.db.WithContext(ctx).Transaction(fn, &sql.TxOptions{
		Isolation: level,
	})
}

/* ─────────────────────────────────────────────────────────────
   3. REPOSITORY PATTERN
──────────────────────────────────────────────────────────────── */

// Repository defines the interface for data access operations.
// T is the entity type, K is the primary key type.
type Repository[T any, K comparable] interface {
	// Create inserts a new entity.
	Create(ctx context.Context, entity *T) error

	// GetByID retrieves an entity by its primary key.
	GetByID(ctx context.Context, id K) (*T, error)

	// GetAll retrieves all entities with optional pagination.
	GetAll(ctx context.Context, opts ...QueryOption) ([]T, error)

	// Update modifies an existing entity.
	Update(ctx context.Context, entity *T) error

	// Delete removes an entity (soft delete if supported).
	Delete(ctx context.Context, id K) error

	// HardDelete permanently removes an entity.
	HardDelete(ctx context.Context, id K) error

	// Exists checks if an entity exists.
	Exists(ctx context.Context, id K) (bool, error)

	// Count returns the total number of entities.
	Count(ctx context.Context, opts ...QueryOption) (int64, error)

	// WithTx returns a repository instance using the provided transaction.
	WithTx(tx *gorm.DB) Repository[T, K]
}

// QueryOption represents a query modifier.
type QueryOption func(*gorm.DB) *gorm.DB

// WithLimit adds a limit to the query.
func WithLimit(limit int) QueryOption {
	return func(db *gorm.DB) *gorm.DB {
		return db.Limit(limit)
	}
}

// WithOffset adds an offset to the query.
func WithOffset(offset int) QueryOption {
	return func(db *gorm.DB) *gorm.DB {
		return db.Offset(offset)
	}
}

// WithOrder adds ordering to the query.
func WithOrder(order string) QueryOption {
	return func(db *gorm.DB) *gorm.DB {
		return db.Order(order)
	}
}

// WithPreload adds eager loading for associations.
func WithPreload(association string) QueryOption {
	return func(db *gorm.DB) *gorm.DB {
		return db.Preload(association)
	}
}

// WithWhere adds a where condition.
func WithWhere(query interface{}, args ...interface{}) QueryOption {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where(query, args...)
	}
}

/* ─────────────────────────────────────────────────────────────
   4. GENERIC REPOSITORY IMPLEMENTATION
──────────────────────────────────────────────────────────────── */

// GormRepository is a generic GORM-based repository implementation.
type GormRepository[T any, K comparable] struct {
	db *gorm.DB
}

// NewGormRepository creates a new generic repository.
func NewGormRepository[T any, K comparable](db *gorm.DB) *GormRepository[T, K] {
	return &GormRepository[T, K]{db: db}
}

// Create inserts a new entity into the database.
func (r *GormRepository[T, K]) Create(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

// GetByID retrieves an entity by its primary key.
func (r *GormRepository[T, K]) GetByID(ctx context.Context, id K) (*T, error) {
	var entity T
	err := r.db.WithContext(ctx).First(&entity, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrNotFound
	}
	return &entity, err
}

// GetAll retrieves all entities with optional query options.
func (r *GormRepository[T, K]) GetAll(ctx context.Context, opts ...QueryOption) ([]T, error) {
	var entities []T
	query := r.db.WithContext(ctx)

	for _, opt := range opts {
		query = opt(query)
	}

	err := query.Find(&entities).Error
	return entities, err
}

// Update modifies an existing entity.
func (r *GormRepository[T, K]) Update(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

// Delete performs a soft delete on the entity.
func (r *GormRepository[T, K]) Delete(ctx context.Context, id K) error {
	var entity T
	return r.db.WithContext(ctx).Delete(&entity, "id = ?", id).Error
}

// HardDelete permanently removes an entity from the database.
func (r *GormRepository[T, K]) HardDelete(ctx context.Context, id K) error {
	var entity T
	return r.db.WithContext(ctx).Unscoped().Delete(&entity, "id = ?", id).Error
}

// Exists checks if an entity with the given ID exists.
func (r *GormRepository[T, K]) Exists(ctx context.Context, id K) (bool, error) {
	var count int64
	var entity T
	err := r.db.WithContext(ctx).Model(&entity).Where("id = ?", id).Count(&count).Error
	return count > 0, err
}

// Count returns the total number of entities matching the query options.
func (r *GormRepository[T, K]) Count(ctx context.Context, opts ...QueryOption) (int64, error) {
	var count int64
	var entity T
	query := r.db.WithContext(ctx).Model(&entity)

	for _, opt := range opts {
		query = opt(query)
	}

	err := query.Count(&count).Error
	return count, err
}

// WithTx returns a new repository instance using the provided transaction.
func (r *GormRepository[T, K]) WithTx(tx *gorm.DB) Repository[T, K] {
	return &GormRepository[T, K]{db: tx}
}

/* ─────────────────────────────────────────────────────────────
   5. GENERIC SERVICE PATTERN
──────────────────────────────────────────────────────────────── */

// Service provides generic CRUD operations for any entity type.
// It wraps a repository and adds transaction support.
type Service[T any, K comparable] struct {
	repo Repository[T, K]
	txm  TransactionManager
}

// NewService creates a new generic service.
func NewService[T any, K comparable](repo Repository[T, K], txm TransactionManager) *Service[T, K] {
	return &Service[T, K]{
		repo: repo,
		txm:  txm,
	}
}

// Create creates a new entity within a transaction.
func (s *Service[T, K]) Create(ctx context.Context, entity *T) error {
	return s.txm.WithTx(ctx, func(tx *gorm.DB) error {
		return s.repo.WithTx(tx).Create(ctx, entity)
	})
}

// GetByID retrieves an entity by its primary key.
func (s *Service[T, K]) GetByID(ctx context.Context, id K) (*T, error) {
	return s.repo.GetByID(ctx, id)
}

// GetAll retrieves all entities with optional query options.
func (s *Service[T, K]) GetAll(ctx context.Context, opts ...QueryOption) ([]T, error) {
	return s.repo.GetAll(ctx, opts...)
}

// Update modifies an existing entity within a transaction.
func (s *Service[T, K]) Update(ctx context.Context, entity *T) error {
	return s.txm.WithTx(ctx, func(tx *gorm.DB) error {
		return s.repo.WithTx(tx).Update(ctx, entity)
	})
}

// Delete removes an entity within a transaction.
func (s *Service[T, K]) Delete(ctx context.Context, id K) error {
	return s.txm.WithTx(ctx, func(tx *gorm.DB) error {
		return s.repo.WithTx(tx).Delete(ctx, id)
	})
}

/* ─────────────────────────────────────────────────────────────
   6. ERROR HANDLING PATTERNS
──────────────────────────────────────────────────────────────── */

// Sentinel errors for common service operations.
var (
	ErrNotFound           = errors.New("entity not found")
	ErrAlreadyExists      = errors.New("entity already exists")
	ErrValidation         = errors.New("validation failed")
	ErrUnauthorized       = errors.New("unauthorized")
	ErrForbidden          = errors.New("forbidden")
	ErrConflict           = errors.New("conflict")
	ErrInternalError      = errors.New("internal error")
	ErrBadRequest         = errors.New("bad request")
	ErrServiceUnavailable = errors.New("service unavailable")
)

// DomainError represents a domain-specific error with context.
type DomainError struct {
	Code       string                 `json:"code"`
	Message    string                 `json:"message"`
	Details    map[string]interface{} `json:"details,omitempty"`
	Underlying error                  `json:"-"`
}

// Error implements the error interface.
func (e *DomainError) Error() string {
	if e.Underlying != nil {
		return fmt.Sprintf("%s: %s (caused by: %v)", e.Code, e.Message, e.Underlying)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Unwrap returns the underlying error for errors.Is/As support.
func (e *DomainError) Unwrap() error {
	return e.Underlying
}

// NewDomainError creates a new domain error.
func NewDomainError(code, message string) *DomainError {
	return &DomainError{
		Code:    code,
		Message: message,
		Details: make(map[string]interface{}),
	}
}

// WithDetail adds a detail to the error.
func (e *DomainError) WithDetail(key string, value interface{}) *DomainError {
	e.Details[key] = value
	return e
}

// WithCause sets the underlying cause of the error.
func (e *DomainError) WithCause(err error) *DomainError {
	e.Underlying = err
	return e
}

// WrapError wraps an error with additional context.
func WrapError(err error, message string) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", message, err)
}

// IsNotFoundError checks if the error is a not found error.
func IsNotFoundError(err error) bool {
	return errors.Is(err, ErrNotFound) || errors.Is(err, gorm.ErrRecordNotFound)
}

/* ─────────────────────────────────────────────────────────────
   7. CONTEXT PROPAGATION
──────────────────────────────────────────────────────────────── */

// ContextKey is a type for context keys to avoid collisions.
type ContextKey string

// Common context keys.
const (
	ContextKeyUserID    ContextKey = "user_id"
	ContextKeyRequestID ContextKey = "request_id"
	ContextKeyTraceID   ContextKey = "trace_id"
	ContextKeyTenantID  ContextKey = "tenant_id"
)

// WithUserID adds a user ID to the context.
func WithUserID(ctx context.Context, userID uuid.UUID) context.Context {
	return context.WithValue(ctx, ContextKeyUserID, userID)
}

// UserIDFromContext retrieves the user ID from context.
func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(ContextKeyUserID).(uuid.UUID)
	return userID, ok
}

// WithRequestID adds a request ID to the context.
func WithRequestID(ctx context.Context, requestID string) context.Context {
	return context.WithValue(ctx, ContextKeyRequestID, requestID)
}

// RequestIDFromContext retrieves the request ID from context.
func RequestIDFromContext(ctx context.Context) (string, bool) {
	requestID, ok := ctx.Value(ContextKeyRequestID).(string)
	return requestID, ok
}

// WithTraceID adds a trace ID to the context.
func WithTraceID(ctx context.Context, traceID string) context.Context {
	return context.WithValue(ctx, ContextKeyTraceID, traceID)
}

// TraceIDFromContext retrieves the trace ID from context.
func TraceIDFromContext(ctx context.Context) (string, bool) {
	traceID, ok := ctx.Value(ContextKeyTraceID).(string)
	return traceID, ok
}

// WithTenantID adds a tenant ID to the context.
func WithTenantID(ctx context.Context, tenantID string) context.Context {
	return context.WithValue(ctx, ContextKeyTenantID, tenantID)
}

// TenantIDFromContext retrieves the tenant ID from context.
func TenantIDFromContext(ctx context.Context) (string, bool) {
	tenantID, ok := ctx.Value(ContextKeyTenantID).(string)
	return tenantID, ok
}

/* ─────────────────────────────────────────────────────────────
   8. LAYER LIFECYCLE PATTERNS
──────────────────────────────────────────────────────────────── */

// HealthResponse represents a health check response.
type HealthResponse struct {
	Healthy bool
	Err     error
	Details map[string]interface{}
}

// Layer defines the lifecycle interface for service layers.
type Layer interface {
	// InitLayer performs initialization on startup.
	InitLayer(ctx context.Context) error

	// Health returns the current health status.
	Health(ctx context.Context) HealthResponse

	// Defer performs cleanup on shutdown.
	Defer()
}

// BaseLayer provides a default implementation of the Layer interface.
type BaseLayer struct {
	name string
}

// NewBaseLayer creates a new base layer.
func NewBaseLayer(name string) *BaseLayer {
	return &BaseLayer{name: name}
}

// InitLayer performs default initialization (no-op).
func (l *BaseLayer) InitLayer(_ context.Context) error {
	return nil
}

// Health returns a healthy status by default.
func (l *BaseLayer) Health(_ context.Context) HealthResponse {
	return HealthResponse{
		Healthy: true,
		Details: map[string]interface{}{
			"layer": l.name,
		},
	}
}

// Defer performs default cleanup (no-op).
func (l *BaseLayer) Defer() {}

/* ─────────────────────────────────────────────────────────────
   9. DATA LAYER PATTERN
──────────────────────────────────────────────────────────────── */

// DataLayer provides database access with lifecycle management.
type DataLayer struct {
	*BaseLayer
	db *gorm.DB
}

// NewDataLayer creates a new data layer.
func NewDataLayer(db *gorm.DB, name string) *DataLayer {
	return &DataLayer{
		BaseLayer: NewBaseLayer(name),
		db:        db,
	}
}

// Health checks database connectivity.
func (l *DataLayer) Health(ctx context.Context) HealthResponse {
	sqlDB, err := l.db.DB()
	if err != nil {
		return HealthResponse{
			Healthy: false,
			Err:     err,
		}
	}

	if err := sqlDB.PingContext(ctx); err != nil {
		return HealthResponse{
			Healthy: false,
			Err:     err,
		}
	}

	return HealthResponse{
		Healthy: true,
		Details: map[string]interface{}{
			"layer": l.name,
		},
	}
}

// Defer closes the database connection.
func (l *DataLayer) Defer() {
	if l.db != nil {
		sqlDB, err := l.db.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}

// DB returns the underlying GORM database instance.
func (l *DataLayer) DB() *gorm.DB {
	return l.db
}

/* ─────────────────────────────────────────────────────────────
   10. BUSINESS LAYER PATTERN
──────────────────────────────────────────────────────────────── */

// BusinessLayer orchestrates domain logic across multiple services.
type BusinessLayer struct {
	*BaseLayer
	dataLayer *DataLayer
}

// NewBusinessLayer creates a new business layer.
func NewBusinessLayer(dataLayer *DataLayer, name string) *BusinessLayer {
	return &BusinessLayer{
		BaseLayer: NewBaseLayer(name),
		dataLayer: dataLayer,
	}
}

// Defer delegates to the data layer for cleanup.
func (l *BusinessLayer) Defer() {
	if l.dataLayer != nil {
		l.dataLayer.Defer()
	}
}

// Health delegates health checking to the data layer.
func (l *BusinessLayer) Health(ctx context.Context) HealthResponse {
	return l.dataLayer.Health(ctx)
}

// WithTransaction executes a function within a database transaction.
func (l *BusinessLayer) WithTransaction(ctx context.Context, fn TxFunc) error {
	return l.dataLayer.DB().WithContext(ctx).Transaction(fn)
}
