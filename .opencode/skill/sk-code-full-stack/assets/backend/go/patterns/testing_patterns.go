/* ─────────────────────────────────────────────────────────────
   Testing Patterns - Go Test Templates and Utilities

   Production-ready templates for testing in Go including:
   - Table-driven test templates
   - Mock generation patterns
   - Test fixtures and setup
   - Integration test infrastructure
   - Benchmark templates

   Usage: Copy and adapt these patterns for your test files.
──────────────────────────────────────────────────────────────── */

package patterns

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

/* ─────────────────────────────────────────────────────────────
   1. TABLE-DRIVEN TEST TEMPLATES
──────────────────────────────────────────────────────────────── */

// TestCase represents a generic test case structure.
type TestCase[TInput any, TExpected any] struct {
	Name        string
	Input       TInput
	Expected    TExpected
	ExpectError bool
	ErrorMsg    string
	Setup       func()
	Teardown    func()
}

// Example: Table-driven test for a service method
//
//	func TestUserService_GetByID(t *testing.T) {
//	    tests := []TestCase[uuid.UUID, *User]{
//	        {
//	            Name:     "valid user ID returns user",
//	            Input:    validUserID,
//	            Expected: &User{ID: validUserID, Name: "John"},
//	        },
//	        {
//	            Name:        "invalid ID returns error",
//	            Input:       invalidUserID,
//	            ExpectError: true,
//	            ErrorMsg:    "not found",
//	        },
//	    }
//
//	    for _, tc := range tests {
//	        t.Run(tc.Name, func(t *testing.T) {
//	            // Setup
//	            if tc.Setup != nil {
//	                tc.Setup()
//	            }
//	            defer func() {
//	                if tc.Teardown != nil {
//	                    tc.Teardown()
//	                }
//	            }()
//
//	            // Execute
//	            result, err := service.GetByID(ctx, tc.Input)
//
//	            // Assert
//	            if tc.ExpectError {
//	                require.Error(t, err)
//	                if tc.ErrorMsg != "" {
//	                    assert.Contains(t, err.Error(), tc.ErrorMsg)
//	                }
//	            } else {
//	                require.NoError(t, err)
//	                assert.Equal(t, tc.Expected, result)
//	            }
//	        })
//	    }
//	}

/* ─────────────────────────────────────────────────────────────
   2. MOCK REPOSITORY PATTERN
──────────────────────────────────────────────────────────────── */

// MockRepository provides a mock implementation of Repository interface.
// Use testify/mock for flexible expectations.
type MockRepository[T any, K comparable] struct {
	mock.Mock
}

// Create mocks entity creation.
func (m *MockRepository[T, K]) Create(ctx context.Context, entity *T) error {
	args := m.Called(ctx, entity)
	return args.Error(0)
}

// GetByID mocks entity retrieval by ID.
func (m *MockRepository[T, K]) GetByID(ctx context.Context, id K) (*T, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*T), args.Error(1)
}

// GetAll mocks retrieval of all entities.
func (m *MockRepository[T, K]) GetAll(ctx context.Context, opts ...QueryOption) ([]T, error) {
	args := m.Called(ctx, opts)
	return args.Get(0).([]T), args.Error(1)
}

// Update mocks entity update.
func (m *MockRepository[T, K]) Update(ctx context.Context, entity *T) error {
	args := m.Called(ctx, entity)
	return args.Error(0)
}

// Delete mocks entity deletion.
func (m *MockRepository[T, K]) Delete(ctx context.Context, id K) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

// HardDelete mocks permanent entity deletion.
func (m *MockRepository[T, K]) HardDelete(ctx context.Context, id K) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

// Exists mocks existence check.
func (m *MockRepository[T, K]) Exists(ctx context.Context, id K) (bool, error) {
	args := m.Called(ctx, id)
	return args.Bool(0), args.Error(1)
}

// Count mocks entity count.
func (m *MockRepository[T, K]) Count(ctx context.Context, opts ...QueryOption) (int64, error) {
	args := m.Called(ctx, opts)
	return args.Get(0).(int64), args.Error(1)
}

// WithTx mocks transaction wrapping.
func (m *MockRepository[T, K]) WithTx(tx *gorm.DB) Repository[T, K] {
	args := m.Called(tx)
	return args.Get(0).(Repository[T, K])
}

/* ─────────────────────────────────────────────────────────────
   3. MOCK TRANSACTION MANAGER
──────────────────────────────────────────────────────────────── */

// MockTransactionManager provides a mock implementation of TransactionManager.
type MockTransactionManager struct {
	mock.Mock
	// ExecuteInline when true, executes the TxFunc immediately without mock behavior
	ExecuteInline bool
}

// WithTx mocks transaction execution.
func (m *MockTransactionManager) WithTx(ctx context.Context, fn TxFunc) error {
	if m.ExecuteInline {
		// For simple tests, execute the function with a nil transaction
		return fn(nil)
	}
	args := m.Called(ctx, fn)
	return args.Error(0)
}

// WithTxIsolation mocks transaction execution with isolation level.
func (m *MockTransactionManager) WithTxIsolation(ctx context.Context, level sql.IsolationLevel, fn TxFunc) error {
	if m.ExecuteInline {
		return fn(nil)
	}
	args := m.Called(ctx, level, fn)
	return args.Error(0)
}

/* ─────────────────────────────────────────────────────────────
   4. TEST FIXTURES
──────────────────────────────────────────────────────────────── */

// Fixture provides test data generators.
type Fixture struct {
	rng      *deterministicRNG
	sequence int64
	mu       sync.Mutex
}

// deterministicRNG provides deterministic random numbers for tests.
type deterministicRNG struct {
	seed int64
}

func (r *deterministicRNG) Int63() int64 {
	r.seed = (r.seed*6364136223846793005 + 1) & 0x7FFFFFFFFFFFFFFF
	return r.seed
}

// NewFixture creates a new fixture generator with a seed.
func NewFixture(seed int64) *Fixture {
	return &Fixture{
		rng: &deterministicRNG{seed: seed},
	}
}

// NextID generates a deterministic UUID for testing.
func (f *Fixture) NextID() uuid.UUID {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.sequence++
	// Use a deterministic pattern based on sequence
	return uuid.MustParse(fmt.Sprintf("00000000-0000-0000-0000-%012d", f.sequence))
}

// NextString generates a deterministic string.
func (f *Fixture) NextString(prefix string) string {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.sequence++
	return fmt.Sprintf("%s_%d", prefix, f.sequence)
}

// NextEmail generates a deterministic email.
func (f *Fixture) NextEmail() string {
	return f.NextString("user") + "@example.com"
}

// NextInt generates a deterministic integer in range [min, max).
func (f *Fixture) NextInt(min, max int) int {
	f.mu.Lock()
	defer f.mu.Unlock()
	if min >= max {
		return min
	}
	return min + int(f.rng.Int63()%int64(max-min))
}

/* ─────────────────────────────────────────────────────────────
   5. TEST SUITE BASE
──────────────────────────────────────────────────────────────── */

// BaseTestSuite provides common test suite functionality.
type BaseTestSuite struct {
	suite.Suite
	Ctx     context.Context
	Cancel  context.CancelFunc
	Fixture *Fixture
}

// SetupSuite runs before all tests in the suite.
func (s *BaseTestSuite) SetupSuite() {
	s.Fixture = NewFixture(12345)
}

// SetupTest runs before each test.
func (s *BaseTestSuite) SetupTest() {
	s.Ctx, s.Cancel = context.WithTimeout(context.Background(), 30*time.Second)
}

// TearDownTest runs after each test.
func (s *BaseTestSuite) TearDownTest() {
	if s.Cancel != nil {
		s.Cancel()
	}
}

/* ─────────────────────────────────────────────────────────────
   6. INTEGRATION TEST DATABASE SETUP
──────────────────────────────────────────────────────────────── */

// TestDB provides integration test database utilities.
type TestDB struct {
	DB          *gorm.DB
	CleanupFunc func()
}

// NewTestDB creates a new test database connection.
// Requires TEST_DATABASE_URL environment variable.
func NewTestDB(t *testing.T) *TestDB {
	t.Helper()

	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("TEST_DATABASE_URL not set, skipping integration test")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	require.NoError(t, err, "failed to connect to test database")

	return &TestDB{
		DB: db,
		CleanupFunc: func() {
			sqlDB, _ := db.DB()
			if sqlDB != nil {
				sqlDB.Close()
			}
		},
	}
}

// Cleanup closes the database connection.
func (tdb *TestDB) Cleanup() {
	if tdb.CleanupFunc != nil {
		tdb.CleanupFunc()
	}
}

// Migrate runs migrations for the given models.
func (tdb *TestDB) Migrate(t *testing.T, models ...interface{}) {
	t.Helper()
	err := tdb.DB.AutoMigrate(models...)
	require.NoError(t, err, "failed to run migrations")
}

// Truncate clears all data from the given tables.
func (tdb *TestDB) Truncate(t *testing.T, tables ...string) {
	t.Helper()
	for _, table := range tables {
		err := tdb.DB.Exec(fmt.Sprintf("TRUNCATE TABLE %s CASCADE", table)).Error
		require.NoError(t, err, "failed to truncate table %s", table)
	}
}

/* ─────────────────────────────────────────────────────────────
   7. INTEGRATION TEST SUITE
──────────────────────────────────────────────────────────────── */

// IntegrationTestSuite extends BaseTestSuite with database support.
type IntegrationTestSuite struct {
	BaseTestSuite
	TestDB *TestDB
}

// SetupSuite initializes the test database.
func (s *IntegrationTestSuite) SetupSuite() {
	s.BaseTestSuite.SetupSuite()
	s.TestDB = NewTestDB(s.T())
}

// TearDownSuite cleans up the test database.
func (s *IntegrationTestSuite) TearDownSuite() {
	if s.TestDB != nil {
		s.TestDB.Cleanup()
	}
}

// DB returns the test database instance.
func (s *IntegrationTestSuite) DB() *gorm.DB {
	return s.TestDB.DB
}

/* ─────────────────────────────────────────────────────────────
   8. BENCHMARK TEMPLATES
──────────────────────────────────────────────────────────────── */

// BenchmarkSetup provides common benchmark setup utilities.
type BenchmarkSetup struct {
	db      *gorm.DB
	fixture *Fixture
}

// NewBenchmarkSetup creates a benchmark setup with optional database.
func NewBenchmarkSetup(db *gorm.DB) *BenchmarkSetup {
	return &BenchmarkSetup{
		db:      db,
		fixture: NewFixture(time.Now().UnixNano()),
	}
}

// Example benchmark function template:
//
//	func BenchmarkUserService_GetByID(b *testing.B) {
//	    // Setup
//	    setup := NewBenchmarkSetup(nil)
//	    repo := &MockRepository[User, uuid.UUID]{}
//	    service := NewService[User, uuid.UUID](repo, &MockTransactionManager{ExecuteInline: true})
//
//	    userID := setup.fixture.NextID()
//	    user := &User{ID: userID, Name: "Test User"}
//	    repo.On("GetByID", mock.Anything, userID).Return(user, nil)
//
//	    ctx := context.Background()
//
//	    // Reset timer after setup
//	    b.ResetTimer()
//
//	    // Run benchmark
//	    for i := 0; i < b.N; i++ {
//	        _, _ = service.GetByID(ctx, userID)
//	    }
//	}

// BenchmarkWithDatabase runs a benchmark function with database setup.
func BenchmarkWithDatabase(b *testing.B, dsn string, fn func(b *testing.B, db *gorm.DB)) {
	b.Helper()

	if dsn == "" {
		dsn = os.Getenv("TEST_DATABASE_URL")
	}
	if dsn == "" {
		b.Skip("TEST_DATABASE_URL not set, skipping benchmark")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		b.Fatalf("failed to connect to database: %v", err)
	}

	defer func() {
		sqlDB, _ := db.DB()
		if sqlDB != nil {
			sqlDB.Close()
		}
	}()

	fn(b, db)
}

/* ─────────────────────────────────────────────────────────────
   9. ASSERTION HELPERS
──────────────────────────────────────────────────────────────── */

// AssertEqualUUID compares two UUIDs with a clear error message.
func AssertEqualUUID(t *testing.T, expected, actual uuid.UUID) {
	t.Helper()
	assert.Equal(t, expected.String(), actual.String(), "UUIDs should match")
}

// AssertErrorIs checks if err matches target using errors.Is.
func AssertErrorIs(t *testing.T, err, target error, msgAndArgs ...interface{}) {
	t.Helper()
	if target == nil {
		assert.NoError(t, err, msgAndArgs...)
		return
	}
	assert.ErrorIs(t, err, target, msgAndArgs...)
}

// AssertEventuallyTrue polls until condition is true or timeout.
func AssertEventuallyTrue(t *testing.T, condition func() bool, timeout, interval time.Duration, msgAndArgs ...interface{}) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if condition() {
			return
		}
		time.Sleep(interval)
	}
	t.Fatalf("condition not met within %v: %v", timeout, msgAndArgs)
}

// RequireNoDBError checks for no error and provides DB-specific context.
func RequireNoDBError(t *testing.T, err error, operation string) {
	t.Helper()
	require.NoError(t, err, "database operation failed: %s", operation)
}

/* ─────────────────────────────────────────────────────────────
   10. TEST CONTEXT UTILITIES
──────────────────────────────────────────────────────────────── */

// TestContext creates a test context with timeout.
func TestContext(t *testing.T, timeout time.Duration) (context.Context, context.CancelFunc) {
	t.Helper()
	return context.WithTimeout(context.Background(), timeout)
}

// TestContextWithUser creates a test context with a user ID.
func TestContextWithUser(t *testing.T, timeout time.Duration, userID uuid.UUID) (context.Context, context.CancelFunc) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	ctx = WithUserID(ctx, userID)
	return ctx, cancel
}

// TestContextWithRequestID creates a test context with a request ID.
func TestContextWithRequestID(t *testing.T, timeout time.Duration, requestID string) (context.Context, context.CancelFunc) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	ctx = WithRequestID(ctx, requestID)
	return ctx, cancel
}

/* ─────────────────────────────────────────────────────────────
   11. MOCK SERVICE PATTERN
──────────────────────────────────────────────────────────────── */

// MockService provides a generic mock service for testing.
type MockService[T any, K comparable] struct {
	mock.Mock
}

// Create mocks service Create method.
func (m *MockService[T, K]) Create(ctx context.Context, entity *T) error {
	args := m.Called(ctx, entity)
	return args.Error(0)
}

// GetByID mocks service GetByID method.
func (m *MockService[T, K]) GetByID(ctx context.Context, id K) (*T, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*T), args.Error(1)
}

// GetAll mocks service GetAll method.
func (m *MockService[T, K]) GetAll(ctx context.Context, opts ...QueryOption) ([]T, error) {
	args := m.Called(ctx, opts)
	return args.Get(0).([]T), args.Error(1)
}

// Update mocks service Update method.
func (m *MockService[T, K]) Update(ctx context.Context, entity *T) error {
	args := m.Called(ctx, entity)
	return args.Error(0)
}

// Delete mocks service Delete method.
func (m *MockService[T, K]) Delete(ctx context.Context, id K) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}
