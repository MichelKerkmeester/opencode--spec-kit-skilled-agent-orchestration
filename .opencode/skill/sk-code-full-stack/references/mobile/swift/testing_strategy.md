---
title: Testing Strategy
description: A comprehensive guide to testing Swift and SwiftUI applications including XCTest fundamentals, unit testing ViewModels, UI testing with XCUITest, mocking and stubbing patterns, test doubles, and snapshot testing.
---

# Testing Strategy

A comprehensive guide to testing Swift and SwiftUI applications including XCTest fundamentals, unit testing ViewModels, UI testing with XCUITest, mocking and stubbing patterns, test doubles, and snapshot testing.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on testing including:

- **XCTest fundamentals** - Core testing framework patterns
- **Unit testing** - Testing ViewModels and business logic
- **UI testing** - XCUITest for end-to-end testing
- **Mocking and stubbing** - Test doubles for isolation
- **Async testing** - Testing async/await code
- **Snapshot testing** - Visual regression testing

### When to Use

- Writing unit tests for business logic
- Testing ViewModels and services
- Creating UI automation tests
- Building mock implementations
- Testing async operations
- Verifying UI appearance

### Core Principle

Fast feedback + isolated tests + comprehensive coverage = confidence in code quality.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:xctest-fundamentals -->
## 2. XCTEST FUNDAMENTALS

### Test Structure

```swift
import XCTest
@testable import MyApp

final class UserServiceTests: XCTestCase {

    // MARK: - Properties

    var sut: UserService!  // System Under Test
    var mockNetworkClient: MockNetworkClient!
    var mockCache: MockUserCache!

    // MARK: - Setup and Teardown

    override func setUp() {
        super.setUp()
        mockNetworkClient = MockNetworkClient()
        mockCache = MockUserCache()
        sut = UserService(
            networkClient: mockNetworkClient,
            cache: mockCache
        )
    }

    override func tearDown() {
        sut = nil
        mockNetworkClient = nil
        mockCache = nil
        super.tearDown()
    }

    // MARK: - Tests

    func testFetchUser_WhenCached_ReturnsCachedUser() async throws {
        // Given
        let expectedUser = User(id: "123", name: "John")
        mockCache.cachedUsers["123"] = expectedUser

        // When
        let user = try await sut.fetchUser(id: "123")

        // Then
        XCTAssertEqual(user, expectedUser)
        XCTAssertFalse(mockNetworkClient.fetchUserCalled)
    }

    func testFetchUser_WhenNotCached_FetchesFromNetwork() async throws {
        // Given
        let expectedUser = User(id: "123", name: "John")
        mockNetworkClient.userToReturn = expectedUser

        // When
        let user = try await sut.fetchUser(id: "123")

        // Then
        XCTAssertEqual(user, expectedUser)
        XCTAssertTrue(mockNetworkClient.fetchUserCalled)
        XCTAssertEqual(mockCache.cachedUsers["123"], expectedUser)
    }
}
```

### Naming Conventions

```swift
// Pattern: test[Method]_[Scenario]_[ExpectedResult]
func testFetchUser_WhenUserExists_ReturnsUser() { }
func testFetchUser_WhenUserNotFound_ThrowsError() { }
func testFetchUser_WhenNetworkFails_UsesCache() { }

// Alternative: test[Behavior]
func testUserIsFetchedFromCache() { }
func testNetworkErrorTriggersRetry() { }
func testInvalidInputThrowsValidationError() { }
```

### Assertions

```swift
// Equality
XCTAssertEqual(actual, expected)
XCTAssertEqual(actual, expected, accuracy: 0.001) // For floating point
XCTAssertNotEqual(actual, notExpected)

// Boolean
XCTAssertTrue(condition)
XCTAssertFalse(condition)

// Nil
XCTAssertNil(optional)
XCTAssertNotNil(optional)

// Comparisons
XCTAssertGreaterThan(a, b)
XCTAssertLessThan(a, b)
XCTAssertGreaterThanOrEqual(a, b)
XCTAssertLessThanOrEqual(a, b)

// Errors
XCTAssertThrowsError(try throwingFunction()) { error in
    XCTAssertEqual(error as? MyError, MyError.specific)
}
XCTAssertNoThrow(try nonThrowingFunction())

// Collections
XCTAssertEqual(array.count, 5)
XCTAssertTrue(array.contains(element))
XCTAssertTrue(array.isEmpty)

// Custom messages
XCTAssertEqual(user.name, "John", "User name should be 'John'")
```

### Test Organization

```swift
// Tests/
// ├── UnitTests/
// │   ├── Services/
// │   │   ├── UserServiceTests.swift
// │   │   └── CartServiceTests.swift
// │   ├── ViewModels/
// │   │   ├── ProductListViewModelTests.swift
// │   │   └── CartViewModelTests.swift
// │   └── Models/
// │       └── UserTests.swift
// ├── IntegrationTests/
// │   └── APIIntegrationTests.swift
// └── UITests/
//     └── ProductFlowUITests.swift

// Group related tests with MARK comments
final class CartServiceTests: XCTestCase {
    // MARK: - Add Item Tests

    func testAddItem_WhenCartEmpty_AddsItem() { }
    func testAddItem_WhenItemExists_IncrementsQuantity() { }

    // MARK: - Remove Item Tests

    func testRemoveItem_WhenItemExists_RemovesItem() { }
    func testRemoveItem_WhenItemNotFound_DoesNothing() { }

    // MARK: - Total Calculation Tests

    func testTotal_WithMultipleItems_CalculatesCorrectly() { }
    func testTotal_WithDiscount_AppliesDiscount() { }
}
```

---

<!-- /ANCHOR:xctest-fundamentals -->
<!-- ANCHOR:unit-testing-viewmodels -->
## 3. UNIT TESTING VIEWMODELS

### Testing @Observable ViewModels

```swift
import XCTest
@testable import MyApp

final class ProductListViewModelTests: XCTestCase {
    var sut: ProductListViewModel!
    var mockService: MockProductService!

    override func setUp() {
        super.setUp()
        mockService = MockProductService()
        sut = ProductListViewModel(productService: mockService)
    }

    override func tearDown() {
        sut = nil
        mockService = nil
        super.tearDown()
    }

    // MARK: - Loading Tests

    func testLoadProducts_SetsLoadingState() async {
        // Given
        mockService.delay = .milliseconds(100)
        mockService.products = [Product.mock()]

        // When
        let task = Task {
            await sut.loadProducts()
        }

        // Then - Check loading state
        try? await Task.sleep(for: .milliseconds(10))
        XCTAssertTrue(sut.isLoading)

        // Cleanup
        await task.value
        XCTAssertFalse(sut.isLoading)
    }

    func testLoadProducts_Success_UpdatesProducts() async {
        // Given
        let expectedProducts = [
            Product(id: "1", name: "Product 1", price: 10),
            Product(id: "2", name: "Product 2", price: 20)
        ]
        mockService.products = expectedProducts

        // When
        await sut.loadProducts()

        // Then
        XCTAssertEqual(sut.products, expectedProducts)
        XCTAssertNil(sut.errorMessage)
        XCTAssertFalse(sut.isLoading)
    }

    func testLoadProducts_Failure_SetsErrorMessage() async {
        // Given
        mockService.shouldFail = true

        // When
        await sut.loadProducts()

        // Then
        XCTAssertTrue(sut.products.isEmpty)
        XCTAssertNotNil(sut.errorMessage)
        XCTAssertFalse(sut.isLoading)
    }

    // MARK: - Filtering Tests

    func testFilteredProducts_WithEmptyQuery_ReturnsAll() {
        // Given
        sut.products = [
            Product(id: "1", name: "Apple", price: 1),
            Product(id: "2", name: "Banana", price: 2)
        ]
        sut.searchQuery = ""

        // When
        let filtered = sut.filteredProducts

        // Then
        XCTAssertEqual(filtered.count, 2)
    }

    func testFilteredProducts_WithQuery_FiltersCorrectly() {
        // Given
        sut.products = [
            Product(id: "1", name: "Apple", price: 1),
            Product(id: "2", name: "Banana", price: 2),
            Product(id: "3", name: "Apricot", price: 3)
        ]
        sut.searchQuery = "Ap"

        // When
        let filtered = sut.filteredProducts

        // Then
        XCTAssertEqual(filtered.count, 2)
        XCTAssertTrue(filtered.contains { $0.name == "Apple" })
        XCTAssertTrue(filtered.contains { $0.name == "Apricot" })
        XCTAssertFalse(filtered.contains { $0.name == "Banana" })
    }

    // MARK: - Computed Property Tests

    func testIsEmpty_WhenNoProducts_ReturnsTrue() {
        // Given
        sut.products = []
        sut.isLoading = false

        // Then
        XCTAssertTrue(sut.isEmpty)
    }

    func testIsEmpty_WhenLoading_ReturnsFalse() {
        // Given
        sut.products = []
        sut.isLoading = true

        // Then
        XCTAssertFalse(sut.isEmpty)
    }
}
```

### Testing Form ViewModels

```swift
final class CreateProductViewModelTests: XCTestCase {
    var sut: CreateProductViewModel!
    var mockService: MockProductService!

    override func setUp() {
        super.setUp()
        mockService = MockProductService()
        sut = CreateProductViewModel(productService: mockService)
    }

    // MARK: - Validation Tests

    func testValidate_EmptyName_ReturnsError() {
        // Given
        sut.name = ""
        sut.priceText = "10.00"

        // When
        let isValid = sut.validate()

        // Then
        XCTAssertFalse(isValid)
        XCTAssertEqual(sut.validationErrors["name"], "Name is required")
    }

    func testValidate_ShortName_ReturnsError() {
        // Given
        sut.name = "AB"
        sut.priceText = "10.00"

        // When
        let isValid = sut.validate()

        // Then
        XCTAssertFalse(isValid)
        XCTAssertEqual(
            sut.validationErrors["name"],
            "Name must be at least 3 characters"
        )
    }

    func testValidate_InvalidPrice_ReturnsError() {
        // Given
        sut.name = "Valid Name"
        sut.priceText = "not a number"

        // When
        let isValid = sut.validate()

        // Then
        XCTAssertFalse(isValid)
        XCTAssertEqual(sut.validationErrors["price"], "Valid price is required")
    }

    func testValidate_ValidInput_ReturnsTrue() {
        // Given
        sut.name = "Valid Product"
        sut.priceText = "25.99"

        // When
        let isValid = sut.validate()

        // Then
        XCTAssertTrue(isValid)
        XCTAssertTrue(sut.validationErrors.isEmpty)
    }

    // MARK: - Submit Tests

    func testSubmit_ValidInput_ReturnsProduct() async {
        // Given
        sut.name = "New Product"
        sut.priceText = "25.00"
        let expectedProduct = Product(id: "new", name: "New Product", price: 25)
        mockService.productToCreate = expectedProduct

        // When
        let result = await sut.submit()

        // Then
        XCTAssertEqual(result?.id, expectedProduct.id)
        XCTAssertNil(sut.submitError)
        XCTAssertFalse(sut.isSubmitting)
    }

    func testSubmit_InvalidInput_ReturnsNil() async {
        // Given
        sut.name = ""
        sut.priceText = "25.00"

        // When
        let result = await sut.submit()

        // Then
        XCTAssertNil(result)
        XCTAssertFalse(mockService.createProductCalled)
    }

    func testSubmit_ServiceError_SetsError() async {
        // Given
        sut.name = "Valid Product"
        sut.priceText = "25.00"
        mockService.shouldFail = true

        // When
        let result = await sut.submit()

        // Then
        XCTAssertNil(result)
        XCTAssertNotNil(sut.submitError)
    }
}
```

---

<!-- /ANCHOR:unit-testing-viewmodels -->
<!-- ANCHOR:mocking-and-stubbing -->
## 4. MOCKING AND STUBBING

### Protocol-Based Mocks

```swift
// Protocol definition
protocol ProductServiceProtocol {
    func fetchProducts() async throws -> [Product]
    func fetchProduct(id: String) async throws -> Product
    func createProduct(_ product: Product) async throws -> Product
    func deleteProduct(id: String) async throws
}

// Mock implementation
class MockProductService: ProductServiceProtocol {
    // Stubbed return values
    var products: [Product] = []
    var productToReturn: Product?
    var productToCreate: Product?

    // Configuration
    var shouldFail = false
    var errorToThrow: Error = NSError(domain: "Test", code: -1)
    var delay: Duration = .zero

    // Call tracking
    var fetchProductsCalled = false
    var fetchProductCalled = false
    var fetchProductId: String?
    var createProductCalled = false
    var createdProduct: Product?
    var deleteProductCalled = false
    var deletedProductId: String?

    func fetchProducts() async throws -> [Product] {
        fetchProductsCalled = true

        if delay != .zero {
            try await Task.sleep(for: delay)
        }

        if shouldFail {
            throw errorToThrow
        }

        return products
    }

    func fetchProduct(id: String) async throws -> Product {
        fetchProductCalled = true
        fetchProductId = id

        if delay != .zero {
            try await Task.sleep(for: delay)
        }

        if shouldFail {
            throw errorToThrow
        }

        guard let product = productToReturn else {
            throw ProductError.notFound
        }

        return product
    }

    func createProduct(_ product: Product) async throws -> Product {
        createProductCalled = true
        createdProduct = product

        if shouldFail {
            throw errorToThrow
        }

        return productToCreate ?? product
    }

    func deleteProduct(id: String) async throws {
        deleteProductCalled = true
        deletedProductId = id

        if shouldFail {
            throw errorToThrow
        }
    }

    // Reset for reuse
    func reset() {
        products = []
        productToReturn = nil
        productToCreate = nil
        shouldFail = false
        delay = .zero
        fetchProductsCalled = false
        fetchProductCalled = false
        fetchProductId = nil
        createProductCalled = false
        createdProduct = nil
        deleteProductCalled = false
        deletedProductId = nil
    }
}
```

### Spy Pattern

```swift
class SpyAnalyticsService: AnalyticsServiceProtocol {
    // Recorded events
    var trackedEvents: [(name: String, parameters: [String: Any])] = []
    var screenViews: [String] = []
    var userProperties: [String: Any] = [:]

    func trackEvent(_ name: String, parameters: [String: Any]) {
        trackedEvents.append((name: name, parameters: parameters))
    }

    func trackScreenView(_ screenName: String) {
        screenViews.append(screenName)
    }

    func setUserProperty(_ name: String, value: Any) {
        userProperties[name] = value
    }

    // Verification helpers
    func didTrackEvent(_ name: String) -> Bool {
        trackedEvents.contains { $0.name == name }
    }

    func eventParameters(for name: String) -> [String: Any]? {
        trackedEvents.first { $0.name == name }?.parameters
    }

    func reset() {
        trackedEvents.removeAll()
        screenViews.removeAll()
        userProperties.removeAll()
    }
}

// Usage in tests
func testAddToCart_TracksAnalyticsEvent() async {
    // Given
    let spy = SpyAnalyticsService()
    let sut = CartViewModel(analyticsService: spy)
    let product = Product(id: "123", name: "Test", price: 10)

    // When
    await sut.addToCart(product)

    // Then
    XCTAssertTrue(spy.didTrackEvent("add_to_cart"))
    let params = spy.eventParameters(for: "add_to_cart")
    XCTAssertEqual(params?["product_id"] as? String, "123")
    XCTAssertEqual(params?["price"] as? Decimal, 10)
}
```

### Fake Implementation

```swift
// Fake in-memory database
class FakeUserRepository: UserRepositoryProtocol {
    private var users: [String: User] = [:]

    func save(_ user: User) async throws {
        users[user.id] = user
    }

    func get(id: String) async throws -> User? {
        return users[id]
    }

    func delete(id: String) async throws {
        users.removeValue(forKey: id)
    }

    func getAll() async throws -> [User] {
        return Array(users.values)
    }

    func search(query: String) async throws -> [User] {
        return users.values.filter {
            $0.name.localizedCaseInsensitiveContains(query)
        }
    }

    // Test helpers
    func seed(with users: [User]) {
        for user in users {
            self.users[user.id] = user
        }
    }

    func clear() {
        users.removeAll()
    }
}
```

### Test Fixtures

```swift
// Product+Mock.swift
extension Product {
    static func mock(
        id: String = UUID().uuidString,
        name: String = "Test Product",
        price: Decimal = 9.99,
        description: String = "Test description",
        category: ProductCategory = .electronics,
        inStock: Bool = true
    ) -> Product {
        Product(
            id: id,
            name: name,
            price: price,
            description: description,
            category: category,
            inStock: inStock
        )
    }

    static func mockList(count: Int = 5) -> [Product] {
        (0..<count).map { index in
            Product.mock(
                id: "product-\(index)",
                name: "Product \(index)",
                price: Decimal(index * 10 + 9.99)
            )
        }
    }
}

// User+Mock.swift
extension User {
    static func mock(
        id: String = UUID().uuidString,
        name: String = "Test User",
        email: String = "test@example.com"
    ) -> User {
        User(id: id, name: name, email: email)
    }
}
```

---

<!-- /ANCHOR:mocking-and-stubbing -->
<!-- ANCHOR:async-testing -->
## 5. ASYNC TESTING

### Testing Async Functions

```swift
final class AsyncServiceTests: XCTestCase {
    var sut: DataService!

    override func setUp() {
        super.setUp()
        sut = DataService()
    }

    // Basic async test
    func testFetchData_ReturnsData() async throws {
        // When
        let data = try await sut.fetchData()

        // Then
        XCTAssertFalse(data.isEmpty)
    }

    // Testing async errors
    func testFetchData_InvalidID_ThrowsError() async {
        // When/Then
        do {
            _ = try await sut.fetchData(id: "invalid")
            XCTFail("Expected error to be thrown")
        } catch {
            XCTAssertEqual(error as? DataError, DataError.notFound)
        }
    }

    // Alternative using XCTAssertThrowsError
    func testFetchData_InvalidID_ThrowsNotFoundError() async throws {
        await XCTAssertThrowsErrorAsync(
            try await sut.fetchData(id: "invalid")
        ) { error in
            XCTAssertEqual(error as? DataError, DataError.notFound)
        }
    }
}

// Helper for async error assertions
func XCTAssertThrowsErrorAsync<T>(
    _ expression: @autoclosure () async throws -> T,
    _ errorHandler: (Error) -> Void = { _ in },
    file: StaticString = #file,
    line: UInt = #line
) async {
    do {
        _ = try await expression()
        XCTFail("Expected error to be thrown", file: file, line: line)
    } catch {
        errorHandler(error)
    }
}
```

### Testing with Expectations

```swift
final class NotificationTests: XCTestCase {

    func testNotificationReceived() {
        // Given
        let expectation = expectation(description: "Notification received")
        var receivedValue: String?

        let observer = NotificationCenter.default.addObserver(
            forName: .dataUpdated,
            object: nil,
            queue: .main
        ) { notification in
            receivedValue = notification.userInfo?["value"] as? String
            expectation.fulfill()
        }

        // When
        NotificationCenter.default.post(
            name: .dataUpdated,
            object: nil,
            userInfo: ["value": "test"]
        )

        // Then
        waitForExpectations(timeout: 1.0)
        XCTAssertEqual(receivedValue, "test")

        // Cleanup
        NotificationCenter.default.removeObserver(observer)
    }

    func testMultipleAsyncOperations() async {
        // Given
        let expectation1 = expectation(description: "Operation 1")
        let expectation2 = expectation(description: "Operation 2")

        // When
        Task {
            await performOperation1()
            expectation1.fulfill()
        }

        Task {
            await performOperation2()
            expectation2.fulfill()
        }

        // Then
        await fulfillment(of: [expectation1, expectation2], timeout: 5.0)
    }
}
```

### Testing Task Cancellation

```swift
final class CancellationTests: XCTestCase {

    func testTaskCancellation_StopsProcessing() async {
        // Given
        let viewModel = DataViewModel()
        var processedCount = 0

        // When
        let task = Task {
            await viewModel.processItems { _ in
                processedCount += 1
            }
        }

        // Let some processing happen
        try? await Task.sleep(for: .milliseconds(100))

        // Cancel
        task.cancel()

        // Allow cancellation to propagate
        try? await Task.sleep(for: .milliseconds(50))

        let countAtCancellation = processedCount

        // Wait a bit more
        try? await Task.sleep(for: .milliseconds(100))

        // Then - no more processing after cancellation
        XCTAssertEqual(processedCount, countAtCancellation)
    }
}
```

---

<!-- /ANCHOR:async-testing -->
<!-- ANCHOR:ui-testing-with-xcuitest -->
## 6. UI TESTING WITH XCUITEST

### Basic UI Tests

```swift
import XCTest

final class ProductListUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app = XCUIApplication()

        // Set up test environment
        app.launchArguments = ["--uitesting"]
        app.launchEnvironment = ["MOCK_API": "true"]

        app.launch()
    }

    override func tearDown() {
        app = nil
        super.tearDown()
    }

    func testProductList_DisplaysProducts() {
        // Given - app launched on product list

        // Then
        XCTAssertTrue(app.navigationBars["Products"].exists)
        XCTAssertTrue(app.cells.count > 0)
    }

    func testProductList_TapProduct_ShowsDetail() {
        // Given
        let firstProduct = app.cells.firstMatch

        // When
        firstProduct.tap()

        // Then
        XCTAssertTrue(app.navigationBars.element.exists)
        XCTAssertTrue(app.buttons["Add to Cart"].exists)
    }

    func testSearch_FiltersResults() {
        // Given
        let searchField = app.searchFields.firstMatch

        // When
        searchField.tap()
        searchField.typeText("iPhone")

        // Then
        let cells = app.cells
        XCTAssertTrue(cells.count > 0)
        XCTAssertTrue(cells.firstMatch.staticTexts["iPhone"].exists)
    }
}
```

### Page Object Pattern

```swift
// Page objects for cleaner UI tests

protocol Page {
    var app: XCUIApplication { get }
}

struct ProductListPage: Page {
    let app: XCUIApplication

    var navigationTitle: XCUIElement {
        app.navigationBars["Products"]
    }

    var searchField: XCUIElement {
        app.searchFields.firstMatch
    }

    var productCells: XCUIElementQuery {
        app.cells
    }

    var firstProduct: XCUIElement {
        productCells.firstMatch
    }

    func search(for query: String) {
        searchField.tap()
        searchField.typeText(query)
    }

    func tapProduct(at index: Int) -> ProductDetailPage {
        productCells.element(boundBy: index).tap()
        return ProductDetailPage(app: app)
    }

    func waitForProducts(timeout: TimeInterval = 5) -> Bool {
        productCells.firstMatch.waitForExistence(timeout: timeout)
    }
}

struct ProductDetailPage: Page {
    let app: XCUIApplication

    var addToCartButton: XCUIElement {
        app.buttons["Add to Cart"]
    }

    var favoriteButton: XCUIElement {
        app.buttons["Favorite"]
    }

    var productName: XCUIElement {
        app.staticTexts["productName"]
    }

    var productPrice: XCUIElement {
        app.staticTexts["productPrice"]
    }

    func addToCart() -> Self {
        addToCartButton.tap()
        return self
    }

    func toggleFavorite() -> Self {
        favoriteButton.tap()
        return self
    }

    func goBack() -> ProductListPage {
        app.navigationBars.buttons.firstMatch.tap()
        return ProductListPage(app: app)
    }
}

// Using page objects in tests
final class ProductFlowUITests: XCTestCase {
    var app: XCUIApplication!
    var productListPage: ProductListPage!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["--uitesting"]
        app.launch()
        productListPage = ProductListPage(app: app)
    }

    func testAddToCartFlow() {
        // Given
        XCTAssertTrue(productListPage.waitForProducts())

        // When
        let detailPage = productListPage.tapProduct(at: 0)
        detailPage.addToCart()

        // Then
        XCTAssertTrue(app.alerts["Added to Cart"].exists)
    }

    func testSearchAndSelect() {
        // Given
        XCTAssertTrue(productListPage.waitForProducts())

        // When
        productListPage.search(for: "iPhone")

        // Then
        XCTAssertTrue(productListPage.productCells.count > 0)
    }
}
```

### Accessibility Identifiers

```swift
// In production code - add identifiers
struct ProductDetailView: View {
    let product: Product

    var body: some View {
        VStack {
            Text(product.name)
                .accessibilityIdentifier("productName")

            Text(product.price, format: .currency(code: "USD"))
                .accessibilityIdentifier("productPrice")

            Button("Add to Cart") {
                // action
            }
            .accessibilityIdentifier("addToCartButton")
        }
    }
}

// In tests - use identifiers
func testProductDetail_DisplaysCorrectInfo() {
    let productName = app.staticTexts["productName"]
    let productPrice = app.staticTexts["productPrice"]
    let addButton = app.buttons["addToCartButton"]

    XCTAssertTrue(productName.exists)
    XCTAssertTrue(productPrice.exists)
    XCTAssertTrue(addButton.exists)
}
```

---

<!-- /ANCHOR:ui-testing-with-xcuitest -->
<!-- ANCHOR:snapshot-testing -->
## 7. SNAPSHOT TESTING

### Using swift-snapshot-testing

```swift
import XCTest
import SnapshotTesting
@testable import MyApp

final class ProductCardSnapshotTests: XCTestCase {

    func testProductCard_DefaultState() {
        // Given
        let product = Product.mock(name: "Test Product", price: 29.99)
        let view = ProductCardView(product: product)
            .frame(width: 300)

        // Then
        assertSnapshot(of: view, as: .image)
    }

    func testProductCard_LongTitle() {
        // Given
        let product = Product.mock(
            name: "This is a very long product name that should wrap",
            price: 29.99
        )
        let view = ProductCardView(product: product)
            .frame(width: 300)

        // Then
        assertSnapshot(of: view, as: .image)
    }

    func testProductCard_DarkMode() {
        // Given
        let product = Product.mock()
        let view = ProductCardView(product: product)
            .frame(width: 300)
            .environment(\.colorScheme, .dark)

        // Then
        assertSnapshot(of: view, as: .image)
    }

    func testProductCard_MultipleDevices() {
        // Given
        let product = Product.mock()
        let view = ProductCardView(product: product)

        // Then - test on multiple sizes
        assertSnapshot(of: view, as: .image(layout: .device(config: .iPhone13)))
        assertSnapshot(of: view, as: .image(layout: .device(config: .iPhone13Pro)))
        assertSnapshot(of: view, as: .image(layout: .device(config: .iPadPro11)))
    }
}
```

### SwiftUI Preview Testing

```swift
import XCTest
import SnapshotTesting
import SwiftUI
@testable import MyApp

final class ViewSnapshotTests: XCTestCase {

    func testProductListView_EmptyState() {
        let view = ProductListView(viewModel: ProductListViewModel())
            .frame(width: 375, height: 667)

        assertSnapshot(of: view, as: .image)
    }

    func testProductListView_WithProducts() {
        let viewModel = ProductListViewModel()
        viewModel.products = Product.mockList(count: 5)

        let view = ProductListView(viewModel: viewModel)
            .frame(width: 375, height: 667)

        assertSnapshot(of: view, as: .image)
    }

    func testProductListView_LoadingState() {
        let viewModel = ProductListViewModel()
        viewModel.isLoading = true

        let view = ProductListView(viewModel: viewModel)
            .frame(width: 375, height: 667)

        assertSnapshot(of: view, as: .image)
    }

    func testProductListView_ErrorState() {
        let viewModel = ProductListViewModel()
        viewModel.errorMessage = "Network error occurred"

        let view = ProductListView(viewModel: viewModel)
            .frame(width: 375, height: 667)

        assertSnapshot(of: view, as: .image)
    }
}
```

---

<!-- /ANCHOR:snapshot-testing -->
<!-- ANCHOR:test-organization -->
## 8. TEST ORGANIZATION

### Test Categories

```swift
// Use test plans or schemes to organize

// Fast unit tests - run frequently
final class QuickUnitTests: XCTestCase {
    func testCalculation() { }
    func testValidation() { }
}

// Slower integration tests - run less frequently
final class IntegrationTests: XCTestCase {
    func testAPIIntegration() async { }
    func testDatabaseIntegration() async { }
}

// UI tests - run on CI
final class UITests: XCTestCase {
    func testUserFlow() { }
}
```

### Shared Test Utilities

```swift
// TestHelpers/XCTestCase+Async.swift
extension XCTestCase {
    func wait(for duration: Duration) async {
        try? await Task.sleep(for: duration)
    }

    func waitUntil(
        timeout: TimeInterval = 5,
        condition: () async -> Bool
    ) async -> Bool {
        let deadline = Date().addingTimeInterval(timeout)

        while Date() < deadline {
            if await condition() {
                return true
            }
            try? await Task.sleep(for: .milliseconds(100))
        }

        return false
    }
}

// TestHelpers/MockHelpers.swift
func createTestContainer() -> DependencyContainer {
    DependencyContainer(
        productService: MockProductService(),
        cartService: MockCartService(),
        userService: MockUserService()
    )
}
```

---

<!-- /ANCHOR:test-organization -->
<!-- ANCHOR:rules -->
## 9. RULES

### ✅ ALWAYS

1. **Use descriptive test names** - Clear naming convention
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **One assertion focus per test** - Test one thing at a time
4. **Use test doubles** - Mock, stub, fake as appropriate
5. **Test edge cases** - Empty, nil, error states
6. **Clean up in tearDown** - Prevent test pollution
7. **Use accessibility identifiers** - For UI testing
8. **Keep tests fast** - Unit tests should run in milliseconds
9. **Test async code properly** - Use async/await, not sleep
10. **Maintain test fixtures** - Keep mock data up to date

### ❌ NEVER

1. **Test implementation details** - Test behavior, not internals
2. **Share state between tests** - Each test should be independent
3. **Use sleep for timing** - Use expectations or async
4. **Skip error path testing** - Errors are important behavior
5. **Commit failing tests** - Fix or skip with explanation
6. **Mock everything** - Only mock external dependencies
7. **Write tests after the fact only** - TDD when possible
8. **Ignore flaky tests** - Fix or quarantine them
9. **Hard-code test data inline** - Use fixtures and factories
10. **Test third-party code** - Trust but verify at boundaries

### ⚠️ ESCALATE IF

1. **Test coverage drops significantly** - Investigate cause
2. **Tests become slow** - May need restructuring
3. **Flaky tests persist** - Need root cause analysis
4. **Integration test failures** - May indicate real issues

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

| File | Purpose |
|------|---------|
| [swift_standards.md](./swift_standards.md) | Swift project structure and naming conventions |
| [swiftui_patterns.md](./swiftui_patterns.md) | SwiftUI view composition and state management |
| [mvvm_architecture.md](./mvvm_architecture.md) | MVVM architecture patterns with SwiftUI |
| [async_patterns.md](./async_patterns.md) | Swift concurrency and async/await patterns |
| [persistence_patterns.md](./persistence_patterns.md) | SwiftData, Core Data, and storage patterns |
<!-- /ANCHOR:related-resources -->
