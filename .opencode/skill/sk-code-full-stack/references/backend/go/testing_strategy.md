---
title: Testing Strategy - Go Testing Patterns for Backend Systems
description: Go testing patterns, test types, mocking, and best practices for backend systems including unit tests, integration tests, table-driven tests, and E2E infrastructure.
---

# Testing Strategy - Go Testing Patterns for Backend Systems

Go testing patterns, test types, mocking, and best practices for backend systems including unit tests, integration tests, and E2E infrastructure.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document defines testing patterns and best practices for Go backend codebases. Understanding these patterns ensures consistent, maintainable, and effective tests across all domains.

### Progressive Disclosure

| If you need to... | Read section... |
|-------------------|-----------------|
| Write a simple unit test | 3 (Test Structure) |
| Mock dependencies | 4 (Mocking Patterns) |
| Test database operations | 5 (Integration Tests) |
| Set up test fixtures | 6 (Setup & Teardown) |
| Choose the right test type | 2 (Test Types) |
| Set up E2E tests with embedded postgres | 10 (E2E Test Infrastructure) |
| Create service mocks for E2E | 11 (E2E Mock Patterns) |
| Use E2E test utilities | 12 (E2E Utilities) |

### File Relationships

```
testing_strategy.md (this file)
    |- Uses patterns from -> go_standards.md
    |- Tests layers from -> domain_layers.md
    +- Database tests -> database_patterns.md
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:test-types -->
## 2. TEST TYPES

### How do I decide which test type to write?

| Test Type | Speed | Isolation | When to Use |
|-----------|-------|-----------|-------------|
| Unit Test | Fast (<100ms) | Full (mocked deps) | Individual functions, business logic |
| Integration Test | Medium (1-5s) | Partial (real DB) | Database queries, API calls |
| E2E Test | Slow (10s+) | None | Complete user flows |

### Unit Tests

Test individual functions and methods in isolation.

**Characteristics:**
- Mock all external dependencies
- Fast execution (milliseconds)
- Located next to source: `user_service_test.go`
- High coverage target: 80%+

**Example location:**
```
internal/domain/auth/auth_services/
|- token_service.go
+- token_service_test.go    <- Unit tests here
```

### Integration Tests

Test component interactions with real dependencies.

**Characteristics:**
- Use real database (test instance)
- May require setup/teardown
- Test database queries, repositories
- Located in `_test.go` files or `e2e_tests/` directory

**Example location:**
```
internal/e2e_tests/
|- e2e_payments_tests/
|   |- payment_provider_integration_test.go
|   +- wallet_service_test.go
+- e2e_media_tests/
    +- upload_process_test.go
```

### End-to-End Tests

Test complete user flows against deployed environment.

**Characteristics:**
- Run against deployed environment
- Fewer in number, higher value
- Test critical paths only
- May involve multiple microservices

---

<!-- /ANCHOR:test-types -->
<!-- ANCHOR:test-structure -->
## 3. TEST STRUCTURE

### How do I write a table-driven test?

Table-driven tests are the **standard pattern** for Go testing. They provide clear test cases, easy extension, and consistent structure.

**Template:**

```go
func TestServiceName_MethodName(t *testing.T) {
    tests := []struct {
        name    string       // Descriptive test case name
        input   InputType    // Test input(s)
        want    OutputType   // Expected output
        wantErr bool         // Whether error is expected
        errType error        // Specific error type (optional)
    }{
        {
            name:    "success case description",
            input:   validInput,
            want:    expectedOutput,
            wantErr: false,
        },
        {
            name:    "error case description",
            input:   invalidInput,
            want:    nil,
            wantErr: true,
            errType: ErrNotFound,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Arrange
            service := setupService(t)

            // Act
            got, err := service.Method(context.Background(), tt.input)

            // Assert
            if (err != nil) != tt.wantErr {
                t.Errorf("Method() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if tt.errType != nil && !errors.Is(err, tt.errType) {
                t.Errorf("Method() error = %v, want %v", err, tt.errType)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("Method() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### How do I name my test functions?

Follow the pattern: `TestTypeName_MethodName_Scenario`

```go
// Function tests
func TestUserService_GetUser(t *testing.T) {}
func TestUserService_GetUser_NotFound(t *testing.T) {}
func TestUserService_CreateUser_DuplicateEmail(t *testing.T) {}

// Method tests with receiver
func TestTokenService_Validate(t *testing.T) {}
func TestTokenService_Validate_Expired(t *testing.T) {}
```

### How do I use subtests for organization?

```go
func TestUserService(t *testing.T) {
    t.Run("GetUser", func(t *testing.T) {
        t.Run("returns user when exists", func(t *testing.T) {
            // test implementation
        })
        t.Run("returns error when not found", func(t *testing.T) {
            // test implementation
        })
    })

    t.Run("CreateUser", func(t *testing.T) {
        t.Run("creates user successfully", func(t *testing.T) {
            // test implementation
        })
        t.Run("fails on duplicate email", func(t *testing.T) {
            // test implementation
        })
    })
}
```

---

<!-- /ANCHOR:test-structure -->
<!-- ANCHOR:mocking-patterns -->
## 4. MOCKING PATTERNS

### How do I create interface-based mocks?

Define mock structs that implement the interface with configurable behavior:

```go
// Mock for UserRepository interface
type mockUserRepository struct {
    getUserFunc    func(ctx context.Context, id string) (*User, error)
    createUserFunc func(ctx context.Context, user *User) error
    updateUserFunc func(ctx context.Context, user *User) error
}

func (m *mockUserRepository) GetUser(ctx context.Context, id string) (*User, error) {
    if m.getUserFunc != nil {
        return m.getUserFunc(ctx, id)
    }
    return nil, errors.New("not implemented")
}

func (m *mockUserRepository) CreateUser(ctx context.Context, user *User) error {
    if m.createUserFunc != nil {
        return m.createUserFunc(ctx, user)
    }
    return errors.New("not implemented")
}

func (m *mockUserRepository) UpdateUser(ctx context.Context, user *User) error {
    if m.updateUserFunc != nil {
        return m.updateUserFunc(ctx, user)
    }
    return errors.New("not implemented")
}
```

### How do I use mocks in tests?

```go
func TestUserService_GetUser(t *testing.T) {
    tests := []struct {
        name     string
        userID   string
        mockFunc func(ctx context.Context, id string) (*User, error)
        want     *User
        wantErr  bool
    }{
        {
            name:   "existing user",
            userID: "user_123",
            mockFunc: func(ctx context.Context, id string) (*User, error) {
                return &User{ID: id, Name: "John"}, nil
            },
            want:    &User{ID: "user_123", Name: "John"},
            wantErr: false,
        },
        {
            name:   "user not found",
            userID: "user_999",
            mockFunc: func(ctx context.Context, id string) (*User, error) {
                return nil, ErrNotFound
            },
            want:    nil,
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Create mock repository
            repo := &mockUserRepository{
                getUserFunc: tt.mockFunc,
            }

            // Create service with mock
            service := NewUserService(repo)

            // Execute
            got, err := service.GetUser(context.Background(), tt.userID)

            // Assert
            if (err != nil) != tt.wantErr {
                t.Errorf("GetUser() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("GetUser() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### Which mocking libraries should I use?

| Library | Use Case | Import |
|---------|----------|--------|
| testify/assert | Assertions | `github.com/stretchr/testify/assert` |
| testify/mock | Complex mocks | `github.com/stretchr/testify/mock` |
| testify/require | Fatal assertions | `github.com/stretchr/testify/require` |

**Using testify assertions:**

```go
import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestUserService_CreateUser(t *testing.T) {
    service := setupService(t)
    user := &User{Name: "John", Email: "john@example.com"}

    // require stops test on failure (use for setup)
    err := service.CreateUser(context.Background(), user)
    require.NoError(t, err, "CreateUser should not fail")

    // assert continues test on failure (use for assertions)
    assert.NotEmpty(t, user.ID, "User should have an ID")
    assert.Equal(t, "John", user.Name)
    assert.Equal(t, "john@example.com", user.Email)
}
```

---

<!-- /ANCHOR:mocking-patterns -->
<!-- ANCHOR:integration-tests -->
## 5. INTEGRATION TESTS

### How do I set up database tests?

Use `TestMain` for database setup and teardown:

```go
var testDB *gorm.DB

func TestMain(m *testing.M) {
    // Setup
    var err error
    testDB, err = setupTestDB()
    if err != nil {
        log.Fatalf("Failed to setup test database: %v", err)
    }

    // Run tests
    code := m.Run()

    // Teardown
    cleanupTestDB(testDB)

    os.Exit(code)
}

func setupTestDB() (*gorm.DB, error) {
    // Use test database connection string
    dsn := os.Getenv("TEST_DATABASE_URL")
    if dsn == "" {
        dsn = "postgres://test:test@localhost:5432/test_db?sslmode=disable"
    }

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }

    // Run migrations
    err = db.AutoMigrate(&User{}, &Order{})
    if err != nil {
        return nil, err
    }

    return db, nil
}

func cleanupTestDB(db *gorm.DB) {
    sqlDB, _ := db.DB()
    sqlDB.Close()
}
```

### How do I isolate database tests?

Use transactions that rollback after each test:

```go
func TestUserRepository_Create(t *testing.T) {
    // Start transaction
    tx := testDB.Begin()
    defer tx.Rollback() // Always rollback, even on success

    // Create repository with transaction
    repo := NewUserRepository(tx)

    // Run test
    user := &User{Name: "Test User", Email: "test@example.com"}
    err := repo.Create(context.Background(), user)

    require.NoError(t, err)
    assert.NotEmpty(t, user.ID)

    // Verify in database
    var found User
    err = tx.First(&found, "id = ?", user.ID).Error
    require.NoError(t, err)
    assert.Equal(t, "Test User", found.Name)
}
```

### How do I test repository queries?

```go
func TestOrderRepository_FindByVendor(t *testing.T) {
    tx := testDB.Begin()
    defer tx.Rollback()

    repo := NewOrderRepository(tx)

    // Setup test data
    vendor := createTestVendor(t, tx)
    order1 := createTestOrder(t, tx, vendor.ID, "Order 1")
    order2 := createTestOrder(t, tx, vendor.ID, "Order 2")

    // Execute query
    orders, err := repo.FindByVendor(context.Background(), vendor.ID)

    // Assert
    require.NoError(t, err)
    assert.Len(t, orders, 2)
    assert.Contains(t, []string{orders[0].Title, orders[1].Title}, "Order 1")
    assert.Contains(t, []string{orders[0].Title, orders[1].Title}, "Order 2")
}

// Helper to create test data
func createTestVendor(t *testing.T, db *gorm.DB) *Vendor {
    t.Helper()
    vendor := &Vendor{
        ID:   uid.New(),
        Name: "Test Vendor",
    }
    require.NoError(t, db.Create(vendor).Error)
    return vendor
}

func createTestOrder(t *testing.T, db *gorm.DB, vendorID uid.UID, title string) *Order {
    t.Helper()
    order := &Order{
        ID:       uid.New(),
        VendorID: vendorID,
        Title:    title,
        Status:   "live",
    }
    require.NoError(t, db.Create(order).Error)
    return order
}
```

---

<!-- /ANCHOR:integration-tests -->
<!-- ANCHOR:setup-teardown -->
## 6. SETUP & TEARDOWN

### How do I use test helpers?

Use `t.Helper()` for cleaner stack traces:

```go
func newTestService(t *testing.T) *UserService {
    t.Helper() // Marks this as helper function

    repo := &mockUserRepository{}
    logger := logger.NewSilentLogger()

    return NewUserService(repo, logger)
}

func assertUserEquals(t *testing.T, expected, actual *User) {
    t.Helper()

    if expected.ID != actual.ID {
        t.Errorf("ID mismatch: expected %s, got %s", expected.ID, actual.ID)
    }
    if expected.Name != actual.Name {
        t.Errorf("Name mismatch: expected %s, got %s", expected.Name, actual.Name)
    }
}
```

### How do I use t.Cleanup for automatic teardown?

```go
func TestUserService_WithExternalResource(t *testing.T) {
    // Setup resource
    server := startMockServer(t)

    // Register cleanup - runs when test completes
    t.Cleanup(func() {
        server.Close()
    })

    // Test runs...
    client := NewClient(server.URL)
    result, err := client.DoSomething()

    assert.NoError(t, err)
    // server.Close() called automatically after test
}
```

### How do I skip tests conditionally?

```go
func TestIntegration_ExternalAPI(t *testing.T) {
    if testing.Short() {
        t.Skip("Skipping integration test in short mode")
    }

    apiKey := os.Getenv("EXTERNAL_API_KEY")
    if apiKey == "" {
        t.Skip("EXTERNAL_API_KEY not set")
    }

    // Integration test...
}
```

---

<!-- /ANCHOR:setup-teardown -->
<!-- ANCHOR:best-practices -->
## 7. BEST PRACTICES

### Test Design Principles

| Principle | Description |
|-----------|-------------|
| **Test behavior, not implementation** | Test what the code does, not how |
| **One assertion per test** | When possible, focus each test case |
| **Test edge cases** | nil, empty, boundary values |
| **Make tests deterministic** | No randomness, no time dependencies |
| **Fast tests** | Mock external services, use in-memory databases |
| **Clean up after tests** | Restore state, close resources |

### Naming Conventions

```go
// GOOD: Descriptive names
func TestUserService_GetUser_ReturnsNilWhenNotFound(t *testing.T) {}
func TestOrderRepository_FindByStatus_FiltersCorrectly(t *testing.T) {}

// BAD: Vague names
func TestGetUser(t *testing.T) {}
func TestFind(t *testing.T) {}
```

### Test Data Guidelines

```go
// GOOD: Use realistic test data
user := &User{
    ID:    uid.New(),
    Name:  "John Smith",
    Email: "john.smith@example.com",
}

// BAD: Generic test data
user := &User{
    ID:    uid.UID{},
    Name:  "test",
    Email: "test@test.com",
}
```

---

<!-- /ANCHOR:best-practices -->
<!-- ANCHOR:code-coverage -->
## 8. CODE COVERAGE

### How do I run tests with coverage?

```bash
# Run all tests with coverage
go test -cover ./...

# Generate coverage profile
go test -coverprofile=coverage.out ./...

# View coverage in browser
go tool cover -html=coverage.out

# View coverage by function
go tool cover -func=coverage.out
```

### Coverage Targets

| Component Type | Target Coverage |
|----------------|-----------------|
| Business logic | 80%+ |
| Critical paths (auth, payments) | 90%+ |
| Utils/helpers | 70%+ |
| Data layer | 70%+ |

### Running Specific Tests

```bash
# Run single test
go test -run TestUserService_GetUser ./internal/domain/auth/...

# Run tests matching pattern
go test -run "TestUserService.*" ./...

# Run with verbose output
go test -v -run TestUserService_GetUser ./...

# Run with race detection
go test -race ./...
```

---

<!-- /ANCHOR:code-coverage -->
<!-- ANCHOR:rules -->
## 9. RULES

### ✅ ALWAYS

- Use table-driven tests for multiple scenarios
- Mock external dependencies in unit tests
- Use `t.Helper()` in test helper functions
- Use `require` for setup, `assert` for assertions
- Clean up resources with `t.Cleanup()` or `defer`
- Name tests descriptively: `TestType_Method_Scenario`
- Run tests before committing: `go test ./...`

### ❌ NEVER

- Write tests that depend on execution order
- Use real external services in unit tests
- Ignore test failures in CI
- Skip writing tests for "trivial" code
- Use global state between tests
- Hard-code time-dependent values

### ⚠️ ESCALATE IF

- Test coverage drops below 70%
- Tests are flaky (pass/fail randomly)
- Integration tests take longer than 30 seconds
- You're unsure how to test complex business logic

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:e2e-test-infrastructure -->
## 10. E2E TEST INFRASTRUCTURE

End-to-end tests in this codebase use embedded infrastructure to create realistic testing environments without external dependencies. All E2E tests are located in `internal/e2e_tests/`.

### How is E2E testing structured?

```
internal/e2e_tests/
|- e2e_payments_tests/              # Payment domain E2E tests
|   |- main_test.go                 # TestMain with cleanup + test mutex
|   |- configuration.go             # Test configuration builder
|   |- ms_payment_boostrap_test.go  # Microservice bootstrap tests
|   |- ms_payment_webhooks_test.go
|   |- mock_payment_provider.go
|   +- mock_provider.go
|- e2e_notifications_tests/         # Notifications domain E2E tests
|- e2e_cronjobs_tests/              # Cronjobs domain E2E tests
|- e2e_media_tests/                 # Media domain E2E tests
|- e2e_utils/                       # Shared utilities
|   |- clean_embeded.go             # Cleanup embedded postgres data
|   +- kill_process.go              # Kill process on port utility
+- sqs_test.go                      # SQS integration tests
```

### How do I set up embedded Postgres for E2E tests?

Use `github.com/fergusstrange/embedded-postgres` to run a real PostgreSQL instance:

```go
import (
    embeddedpostgres "github.com/fergusstrange/embedded-postgres"
    "github.com/example/backend/internal/e2e_tests/e2e_utils"
)

func TestWithEmbeddedPostgres(t *testing.T) {
    testMutex.Lock()
    defer testMutex.Unlock()
    defer os.Unsetenv("DATABASE_DSN")

    // Set locale to avoid issues
    os.Setenv("LANG", "C")
    os.Setenv("LC_ALL", "C")

    // Clean up any stale processes
    port := uint32(54351)
    err := e2e_utils.KillProcessOnPort(port)
    t.Logf("Killed process on port %d; %+v", port, err)

    // Start embedded postgres
    database := embeddedpostgres.NewDatabase(embeddedpostgres.DefaultConfig().Port(port))
    dsn := fmt.Sprintf("host=localhost port=%d user=postgres password=postgres dbname=postgres sslmode=disable", port)
    err = database.Start()
    if err != nil {
        t.Fatalf("Failed to start embedded postgres: %v", err)
    }
    defer database.Stop()

    time.Sleep(100 * time.Millisecond) // Allow postgres to fully initialize

    // Use dsn for database connections...
}
```

### How do I set up Miniredis for E2E tests?

Use `github.com/alicebob/miniredis/v2` for in-memory Redis mocking:

```go
import "github.com/alicebob/miniredis/v2"

func TestWithMiniredis(t *testing.T) {
    // Start miniredis
    mr, err := miniredis.Run()
    assert.NoError(t, err)
    defer mr.Close()

    redisAddress := mr.Addr() // e.g. "127.0.0.1:6379"

    // Use redisAddress in configuration...
}
```

### How do I use TestMain for E2E test setup?

`TestMain` handles package-level setup and cleanup:

```go
// internal/e2e_tests/e2e_payments_tests/main_test.go
package e2e_payments_tests

import (
    "log"
    "os"
    "sync"
    "testing"

    "github.com/example/backend/internal/e2e_tests/e2e_utils"
)

var testMutex sync.Mutex  // Prevent parallel test interference

func TestMain(m *testing.M) {
    // Clean up any corrupted embedded postgres extracted directory
    if err := e2e_utils.CleanupEmbeddedPostgresData(); err != nil {
        log.Fatalf("Failed to cleanup embedded postgres data: %v", err)
    }

    // Run all tests
    exitCode := m.Run()

    // Exit with the test result code
    os.Exit(exitCode)
}
```

### How do I bootstrap a microservice in E2E tests?

Use the DI system to create and run the actual microservice:

```go
func TestMicroserviceBootstrap(t *testing.T) {
    testMutex.Lock()
    defer testMutex.Unlock()
    defer os.Unsetenv("DATABASE_DSN")
    defer os.Unsetenv("REDIS_ADDRESS")

    // Setup embedded infrastructure (postgres, redis)...
    // dsn := ...
    // redisAddress := ...

    // Build configuration
    var cfg ms_payments.PaymentsMicroserviceConfiguration
    _, err := paymentsConfiguration(dsn, redisAddress, &cfg)
    assert.NoError(t, err)

    // Create cancellable context for graceful shutdown
    ictx, cancel := context.WithCancel(context.Background())
    ctx := di.NewContext(ictx, &cfg)

    // Create microservice via DI
    ms, err := di.Create[*ms_payments.PaymentsMicroservice](ctx)
    assert.NoError(t, err)
    assert.NotNil(t, ms)

    // Setup panic handler and start async
    defer ms.PanicHandler()
    microservice.StartAsync(ctx, ms)

    // Run test with timeout
    ticker := time.NewTicker(time.Second * 2)
    defer ticker.Stop()

    go func() {
        for {
            select {
            case <-ticker.C:
                cancel()
                return
            }
        }
    }()

    <-ctx.Done()
}
```

### How do I create test configurations for E2E tests?

Create a configuration builder that embeds JSON with environment variable substitution:

```go
// internal/e2e_tests/e2e_payments_tests/configuration.go
package e2e_payments_tests

func paymentsConfiguration(
    dsn string,
    redisAddress string,
    paymentsMSConfig *ms_payments.PaymentsMicroserviceConfiguration,
) ([]byte, error) {
    const cfgRaw = `{
      "#ref": {
        "database_orm": {
          "driver": "gorm_db_driver",
          "values": {
            "driver": "psql_db_driver",
            "dsn": "${env.DATABASE_DSN}"
          }
        },
        "payment_provider": {
          "site_name": "test",
          "api_key": "test",
          "timeout": "12000"
        }
      },
      "listen_addr": ":8080",
      "payments_business_layer": {
        "payments_data_layer": {
          "database_orm": "${#ref.database_orm}"
        }
        // ... more nested configuration
      },
      "sqs_consumer_disabled": true
    }`

    // Set environment variables for substitution
    os.Setenv("DATABASE_DSN", dsn)
    os.Setenv("REDIS_ADDRESS", redisAddress)

    return configuration.StructFromJSONBytesWithEnvReplace(
        []byte(cfgRaw),
        &paymentsMSConfig,
        logger.Logger,
    )
}
```

**Key patterns:**
- Use `${env.VAR_NAME}` for environment variable substitution
- Use `${#ref.key}` for internal configuration references
- Disable external services: `"sqs_consumer_disabled": true`
- Use test credentials: `"api_key": "test"`

---

<!-- /ANCHOR:e2e-test-infrastructure -->
<!-- ANCHOR:e2e-mock-patterns -->
## 11. E2E MOCK PATTERNS

### How do I create service-level mocks for E2E tests?

Create mock structs that implement service interfaces:

```go
// internal/e2e_tests/e2e_payments_tests/mock_payment_provider.go
type mockPaymentProvider struct{}

func (p mockPaymentProvider) CreateBillableItem(
    ctx context.Context,
    itemID string,
    itemPriceID string,
    // ... parameters
) error {
    return nil  // Success stub
}

func (p mockPaymentProvider) GetCheckoutURL(
    ctx context.Context,
    customerID string,
    // ... parameters
) (string, error) {
    return "", nil  // Return empty/default values
}

// For methods not needed in tests
func (p mockPaymentProvider) GetUpgradedCheckoutURL(
    ctx context.Context,
    subscriptionID string,
    // ... parameters
) (string, error) {
    panic("Not implemented")  // Fail fast if unexpectedly called
}
```

### How do I create stateful mocks for E2E tests?

For complex scenarios, create mocks that maintain state:

```go
type mockSubscriptionProvider struct {
    subscriptions map[string]payments.Subscription
    customers     map[string]payments.Customer
}

func newMockSubscriptionProvider(events ...[]byte) (mockSubscriptionProvider, error) {
    subscriptionMap := make(map[string]payments.Subscription, len(events))
    customerMap := make(map[string]payments.Customer, len(events))

    // Parse webhook events to populate initial state
    for _, event := range events {
        var webhookEvent payments.WebhookEvent
        if err := json.Unmarshal(event, &webhookEvent); err != nil {
            return mockSubscriptionProvider{}, err
        }
        // Extract and store subscription/customer data...
    }

    return mockSubscriptionProvider{
        subscriptions: subscriptionMap,
        customers:     customerMap,
    }, nil
}

func (p mockSubscriptionProvider) GetSubscription(
    ctx context.Context,
    subscriptionID string,
) (payments.Subscription, payments.Customer, *payments.Card, error) {
    subscription, ok := p.subscriptions[subscriptionID]
    if !ok {
        return payments.Subscription{}, payments.Customer{}, nil,
            errors.New("Subscription %s does not exist", subscriptionID)
    }
    return subscription, payments.Customer{Id: subscription.CustomerId}, nil, nil
}
```

### How do I register mocks with the DI system?

Use `di.Register` with tokens to override production registrations:

```go
func init() {
    // Register mock services to override production implementations
    errors.Must(di.Register(
        mockRegistryPaymentService,
        di.WithToken(coredi.RegistryTokenPaymentService),
    ))
    errors.Must(di.Register(
        mockRegistryWalletSubscriptionService,
        di.WithToken(coredi.RegistryTokenWalletSubscriptionService),
    ))
}

func mockRegistryPaymentService(
    ctx di.Context,
    opts *di.RegistryOpts,
) (*payments_services.PaymentService, error) {
    // Get configuration
    config, err := di.CreateConfiguration[*payments_services.PaymentServiceConfiguration](
        ctx, di.WithOpts(opts),
    )
    if err != nil {
        return nil, err
    }

    // Get real dependencies that don't need mocking
    datalayer, err := di.Create[*payments_data_layer.PaymentsDataLayer](
        ctx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenPaymentsDataLayer),
    )
    if err != nil {
        return nil, err
    }

    // Create mock provider
    mockProvider, err := newMockSubscriptionProvider(subscriptionCreatedEvent)
    if err != nil {
        return nil, err
    }

    // Create service with mock provider
    service := payments_services.NewPaymentService(
        ctx,
        *config,
        mockProvider,  // <- Mock injected here
        *datalayer,
        // ... other dependencies
    )

    return &service, nil
}
```

---

<!-- /ANCHOR:e2e-mock-patterns -->
<!-- ANCHOR:e2e-utilities -->
## 12. E2E UTILITIES

### How do I clean up embedded Postgres data?

Use the utility to remove stale embedded postgres data:

```go
// internal/e2e_tests/e2e_utils/clean_embeded.go
package e2e_utils

import (
    "os"
    "path/filepath"
)

// CleanupEmbeddedPostgresData removes embedded postgres extracted directory
func CleanupEmbeddedPostgresData() error {
    // Skip in CI - GitHub Actions handles cleanup differently
    if os.Getenv("GITHUB_ACTIONS") == "true" {
        return nil
    }

    homeDir, err := os.UserHomeDir()
    if err != nil {
        return errors.New("failed to get user home directory: %v", err)
    }

    extractedDir := filepath.Join(homeDir, ".embedded-postgres-go", "extracted")
    if _, err := os.Stat(extractedDir); os.IsNotExist(err) {
        return nil  // Already clean
    }

    return os.RemoveAll(extractedDir)
}
```

### How do I kill stale processes on ports?

Use the cross-platform utility:

```go
// internal/e2e_tests/e2e_utils/kill_process.go
package e2e_utils

func KillProcessOnPort(port uint32) error {
    // Skip in CI
    if os.Getenv("GITHUB_ACTIONS") == "true" {
        return nil
    }

    // Also cleanup embedded postgres data
    err := CleanupEmbeddedPostgresData()
    if err != nil {
        logger.With("cleanup_error", err).Error("failed to cleanup embedded postgres data")
    }

    // Platform-specific process killing
    switch runtime.GOOS {
    case "darwin": // macOS
        return killProcessOnPortMacOS(port)
    case "linux":
        return killProcessOnPortLinux(port)
    default:
        return errors.New("unsupported operating system: %s", runtime.GOOS)
    }
}
```

---

<!-- /ANCHOR:e2e-utilities -->
<!-- ANCHOR:e2e-testing-best-practices -->
## 13. E2E TESTING BEST PRACTICES

### Test Isolation

| Practice | Description |
|----------|-------------|
| **Use test mutex** | `sync.Mutex` to prevent parallel test interference |
| **Use unique ports** | Each test file uses different embedded postgres ports |
| **Clean environment** | `defer os.Unsetenv()` for all set environment variables |
| **Defer cleanup** | `defer database.Stop()`, `defer mr.Close()` |

### Infrastructure Management

| Practice | Description |
|----------|-------------|
| **Cleanup before start** | Call `e2e_utils.KillProcessOnPort()` before starting embedded postgres |
| **Sleep after start** | `time.Sleep(100ms)` to allow postgres to fully initialize |
| **Skip CI-specific logic** | Check `GITHUB_ACTIONS` env var for CI-specific behavior |
| **Use embedded services** | Miniredis for Redis, embedded-postgres for PostgreSQL |

### Configuration Patterns

| Practice | Description |
|----------|-------------|
| **Disable external services** | `"sqs_consumer_disabled": true` |
| **Use test credentials** | `"api_key": "test"` for external APIs |
| **Environment substitution** | `${env.VAR_NAME}` for dynamic values |
| **Reference sharing** | `${#ref.key}` for reusable config blocks |

---

<!-- /ANCHOR:e2e-testing-best-practices -->
<!-- ANCHOR:rules-2 -->
## 14. RULES

### ✅ ALWAYS

- Use table-driven tests for multiple scenarios
- Mock external dependencies in unit tests
- Use `t.Helper()` in test helper functions
- Use `require` for setup, `assert` for assertions
- Clean up resources with `t.Cleanup()` or `defer`
- Name tests descriptively: `TestType_Method_Scenario`
- Run tests before committing: `go test ./...`
- **Use `sync.Mutex` in E2E tests to prevent parallel interference**
- **Use `e2e_utils.KillProcessOnPort()` before starting embedded postgres**
- **Defer all cleanup: `database.Stop()`, `mr.Close()`, `os.Unsetenv()`**

### ❌ NEVER

- Write tests that depend on execution order
- Use real external services in unit tests
- Ignore test failures in CI
- Skip writing tests for "trivial" code
- Use global state between tests
- Hard-code time-dependent values
- **Run E2E tests in parallel without mutex protection**
- **Leave stale embedded postgres processes running**
- **Skip CI environment checks in utilities**

### ⚠️ ESCALATE IF

- Test coverage drops below 70%
- Tests are flaky (pass/fail randomly)
- Integration tests take longer than 30 seconds
- You're unsure how to test complex business logic
- **Embedded postgres fails to start consistently**
- **E2E tests pass locally but fail in CI**

---

<!-- /ANCHOR:rules-2 -->
<!-- ANCHOR:related-resources -->
## 15. RELATED RESOURCES

| Topic | Document | Section |
|-------|----------|---------|
| Go coding standards | [go_standards.md](./go_standards.md) | Error handling, naming |
| Domain layer testing | [domain_layers.md](./domain_layers.md) | Service, repository patterns |
| Database test patterns | [database_patterns.md](./database_patterns.md) | GORM testing |
| DI for testing | [di_configuration.md](./di_configuration.md) | Injecting mocks |
| DI token registration | [di_configuration.md](./di_configuration.md) | Registry tokens for mock injection |
<!-- /ANCHOR:related-resources -->
