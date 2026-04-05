---
title: MVVM Architecture
description: A comprehensive guide to implementing MVVM architecture with SwiftUI, including @Observable patterns, ViewModel design, dependency injection, protocol-oriented design, and Combine integration for iOS 17+ applications.
---

# MVVM Architecture

A comprehensive guide to implementing MVVM architecture with SwiftUI, including @Observable patterns, ViewModel design, dependency injection, protocol-oriented design, and Combine integration for iOS 17+ applications.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on MVVM architecture including:

- **MVVM fundamentals** - Model-View-ViewModel separation
- **@Observable pattern** - Modern iOS 17+ observable state
- **ViewModel design** - Clean, testable view models
- **Dependency injection** - Flexible, testable dependencies
- **Protocol-oriented design** - Abstraction and testability
- **Combine integration** - Reactive programming patterns

### When to Use

- Structuring SwiftUI applications
- Creating testable view models
- Managing complex business logic
- Integrating with services and APIs
- Building scalable iOS applications

### Core Principle

Clear separation of concerns + testable view models + dependency injection = maintainable, scalable SwiftUI applications.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:mvvm-fundamentals -->
## 2. MVVM FUNDAMENTALS

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           VIEW                                   │
│    SwiftUI Views - Display UI, handle user interactions         │
│    No business logic - Only presentation and input handling     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Observes / Calls actions
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        VIEWMODEL                                 │
│    @Observable classes - Business logic, state management       │
│    Transforms Model data for View consumption                   │
│    Handles user actions and coordinates with services           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Uses / Updates
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          MODEL                                   │
│    Data structures - Domain entities, DTOs                      │
│    Services - Network, persistence, business rules              │
│    Pure data and logic - No UI concerns                         │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibilities | Contains |
|-------|-----------------|----------|
| **View** | Display UI, handle gestures | SwiftUI Views, UI components |
| **ViewModel** | Business logic, state | @Observable classes, computed properties |
| **Model** | Data, services | Structs, services, repositories |

### File Organization

```
Features/
├── Products/
│   ├── Views/
│   │   ├── ProductListView.swift
│   │   ├── ProductDetailView.swift
│   │   └── ProductRowView.swift
│   ├── ViewModels/
│   │   ├── ProductListViewModel.swift
│   │   └── ProductDetailViewModel.swift
│   ├── Models/
│   │   └── Product.swift
│   └── Services/
│       └── ProductService.swift
```

---

<!-- /ANCHOR:mvvm-fundamentals -->
<!-- ANCHOR:observable-pattern-ios-17 -->
## 3. @OBSERVABLE PATTERN (iOS 17+)

### Basic @Observable ViewModel

```swift
import Observation
import Foundation

@Observable
class ProductListViewModel {
    // MARK: - State

    var products: [Product] = []
    var isLoading = false
    var errorMessage: String?
    var searchQuery = ""

    // MARK: - Computed Properties

    var filteredProducts: [Product] {
        if searchQuery.isEmpty {
            return products
        }
        return products.filter {
            $0.name.localizedCaseInsensitiveContains(searchQuery)
        }
    }

    var hasError: Bool {
        errorMessage != nil
    }

    var isEmpty: Bool {
        !isLoading && products.isEmpty
    }

    // MARK: - Dependencies

    private let productService: ProductServiceProtocol

    // MARK: - Initialization

    init(productService: ProductServiceProtocol = ProductService()) {
        self.productService = productService
    }

    // MARK: - Actions

    func loadProducts() async {
        isLoading = true
        errorMessage = nil

        do {
            products = try await productService.fetchProducts()
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func refresh() async {
        await loadProducts()
    }

    func deleteProduct(_ product: Product) async {
        do {
            try await productService.deleteProduct(product.id)
            products.removeAll { $0.id == product.id }
        } catch {
            errorMessage = "Failed to delete product"
        }
    }
}
```

### Using @Observable in Views

```swift
struct ProductListView: View {
    // ViewModel injected or created
    var viewModel: ProductListViewModel

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Products")
                .searchable(text: $viewModel.searchQuery)
                .refreshable {
                    await viewModel.refresh()
                }
                .task {
                    await viewModel.loadProducts()
                }
        }
    }

    @ViewBuilder
    private var content: some View {
        if viewModel.isLoading && viewModel.products.isEmpty {
            ProgressView("Loading...")
        } else if viewModel.isEmpty {
            ContentUnavailableView(
                "No Products",
                systemImage: "shippingbox",
                description: Text("Products will appear here")
            )
        } else if let error = viewModel.errorMessage {
            ContentUnavailableView(
                "Error",
                systemImage: "exclamationmark.triangle",
                description: Text(error)
            )
        } else {
            productList
        }
    }

    private var productList: some View {
        List {
            ForEach(viewModel.filteredProducts) { product in
                NavigationLink(value: product) {
                    ProductRowView(product: product)
                }
            }
            .onDelete { offsets in
                Task {
                    for index in offsets {
                        await viewModel.deleteProduct(
                            viewModel.filteredProducts[index]
                        )
                    }
                }
            }
        }
        .navigationDestination(for: Product.self) { product in
            ProductDetailView(
                viewModel: ProductDetailViewModel(product: product)
            )
        }
    }
}
```

### @Bindable for Two-Way Binding

```swift
@Observable
class ProfileViewModel {
    var name: String = ""
    var email: String = ""
    var bio: String = ""
    var isNotificationsEnabled = true

    var isValid: Bool {
        !name.isEmpty && email.contains("@")
    }

    private let userService: UserServiceProtocol

    init(userService: UserServiceProtocol = UserService()) {
        self.userService = userService
    }

    func save() async throws {
        let profile = UserProfile(
            name: name,
            email: email,
            bio: bio,
            notificationsEnabled: isNotificationsEnabled
        )
        try await userService.updateProfile(profile)
    }
}

struct ProfileEditView: View {
    @Bindable var viewModel: ProfileViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var isSaving = false

    var body: some View {
        Form {
            Section("Personal Info") {
                TextField("Name", text: $viewModel.name)
                TextField("Email", text: $viewModel.email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                TextField("Bio", text: $viewModel.bio, axis: .vertical)
                    .lineLimit(3...6)
            }

            Section("Preferences") {
                Toggle("Notifications", isOn: $viewModel.isNotificationsEnabled)
            }
        }
        .navigationTitle("Edit Profile")
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Save") {
                    Task {
                        isSaving = true
                        try? await viewModel.save()
                        isSaving = false
                        dismiss()
                    }
                }
                .disabled(!viewModel.isValid || isSaving)
            }
        }
    }
}
```

### Creating ViewModels with @State

```swift
struct ProductListScreen: View {
    @State private var viewModel = ProductListViewModel()

    var body: some View {
        ProductListView(viewModel: viewModel)
    }
}

// For previews and testing
#Preview {
    ProductListScreen()
}

#Preview("With Mock Data") {
    let viewModel = ProductListViewModel(
        productService: MockProductService()
    )
    return ProductListView(viewModel: viewModel)
}
```

---

<!-- /ANCHOR:observable-pattern-ios-17 -->
<!-- ANCHOR:viewmodel-patterns -->
## 4. VIEWMODEL PATTERNS

### Form ViewModel Pattern

```swift
@Observable
class CreateProductViewModel {
    // MARK: - Form Fields

    var name = ""
    var description = ""
    var priceText = ""
    var category: ProductCategory = .electronics
    var imageData: Data?

    // MARK: - State

    var isSubmitting = false
    var validationErrors: [String: String] = [:]
    var submitError: String?

    // MARK: - Computed Properties

    var price: Decimal? {
        Decimal(string: priceText)
    }

    var isValid: Bool {
        validate()
        return validationErrors.isEmpty
    }

    var canSubmit: Bool {
        isValid && !isSubmitting
    }

    // MARK: - Dependencies

    private let productService: ProductServiceProtocol

    init(productService: ProductServiceProtocol = ProductService()) {
        self.productService = productService
    }

    // MARK: - Validation

    @discardableResult
    func validate() -> Bool {
        validationErrors = [:]

        if name.trimmingCharacters(in: .whitespaces).isEmpty {
            validationErrors["name"] = "Name is required"
        } else if name.count < 3 {
            validationErrors["name"] = "Name must be at least 3 characters"
        }

        if description.count > 500 {
            validationErrors["description"] = "Description too long"
        }

        if price == nil || price! <= 0 {
            validationErrors["price"] = "Valid price is required"
        }

        return validationErrors.isEmpty
    }

    // MARK: - Actions

    func submit() async -> Product? {
        guard validate() else { return nil }

        isSubmitting = true
        submitError = nil
        defer { isSubmitting = false }

        do {
            let product = try await productService.createProduct(
                name: name,
                description: description,
                price: price!,
                category: category,
                imageData: imageData
            )
            return product
        } catch {
            submitError = error.localizedDescription
            return nil
        }
    }

    func reset() {
        name = ""
        description = ""
        priceText = ""
        category = .electronics
        imageData = nil
        validationErrors = [:]
        submitError = nil
    }
}
```

### Detail ViewModel Pattern

```swift
@Observable
class ProductDetailViewModel {
    // MARK: - State

    var product: Product
    var isLoading = false
    var isAddingToCart = false
    var isFavorite = false
    var quantity = 1
    var errorMessage: String?

    // MARK: - Computed Properties

    var totalPrice: Decimal {
        product.price * Decimal(quantity)
    }

    var formattedPrice: String {
        totalPrice.formatted(.currency(code: "USD"))
    }

    var canAddToCart: Bool {
        !isAddingToCart && quantity > 0 && product.inStock
    }

    // MARK: - Dependencies

    private let cartService: CartServiceProtocol
    private let favoriteService: FavoriteServiceProtocol

    // MARK: - Initialization

    init(
        product: Product,
        cartService: CartServiceProtocol = CartService(),
        favoriteService: FavoriteServiceProtocol = FavoriteService()
    ) {
        self.product = product
        self.cartService = cartService
        self.favoriteService = favoriteService
    }

    // MARK: - Actions

    func loadDetails() async {
        isLoading = true
        defer { isLoading = false }

        // Load additional details, check favorite status
        isFavorite = await favoriteService.isFavorite(product.id)
    }

    func addToCart() async {
        isAddingToCart = true
        defer { isAddingToCart = false }

        do {
            try await cartService.addItem(product.id, quantity: quantity)
        } catch {
            errorMessage = "Failed to add to cart"
        }
    }

    func toggleFavorite() async {
        do {
            if isFavorite {
                try await favoriteService.removeFavorite(product.id)
            } else {
                try await favoriteService.addFavorite(product.id)
            }
            isFavorite.toggle()
        } catch {
            errorMessage = "Failed to update favorite"
        }
    }

    func incrementQuantity() {
        quantity = min(quantity + 1, 99)
    }

    func decrementQuantity() {
        quantity = max(quantity - 1, 1)
    }
}
```

### List with Selection ViewModel

```swift
@Observable
class SelectableListViewModel<Item: Identifiable> {
    var items: [Item] = []
    var selectedIDs: Set<Item.ID> = []
    var isSelectionMode = false
    var isLoading = false

    var selectedItems: [Item] {
        items.filter { selectedIDs.contains($0.id) }
    }

    var selectedCount: Int {
        selectedIDs.count
    }

    var allSelected: Bool {
        !items.isEmpty && selectedIDs.count == items.count
    }

    func toggleSelection(for item: Item) {
        if selectedIDs.contains(item.id) {
            selectedIDs.remove(item.id)
        } else {
            selectedIDs.insert(item.id)
        }
    }

    func selectAll() {
        selectedIDs = Set(items.map { $0.id })
    }

    func deselectAll() {
        selectedIDs.removeAll()
    }

    func toggleSelectionMode() {
        isSelectionMode.toggle()
        if !isSelectionMode {
            selectedIDs.removeAll()
        }
    }
}
```

---

<!-- /ANCHOR:viewmodel-patterns -->
<!-- ANCHOR:dependency-injection -->
## 5. DEPENDENCY INJECTION

### Protocol-Based Dependencies

```swift
// Define service protocol
protocol ProductServiceProtocol {
    func fetchProducts() async throws -> [Product]
    func fetchProduct(id: String) async throws -> Product
    func createProduct(
        name: String,
        description: String,
        price: Decimal,
        category: ProductCategory,
        imageData: Data?
    ) async throws -> Product
    func updateProduct(_ product: Product) async throws -> Product
    func deleteProduct(_ id: String) async throws
}

// Concrete implementation
class ProductService: ProductServiceProtocol {
    private let networkClient: NetworkClient

    init(networkClient: NetworkClient = .shared) {
        self.networkClient = networkClient
    }

    func fetchProducts() async throws -> [Product] {
        try await networkClient.request(
            endpoint: .products,
            method: .get
        )
    }

    func fetchProduct(id: String) async throws -> Product {
        try await networkClient.request(
            endpoint: .product(id: id),
            method: .get
        )
    }

    // ... other implementations
}

// Mock for testing
class MockProductService: ProductServiceProtocol {
    var products: [Product] = []
    var shouldFail = false
    var delay: Duration = .zero

    func fetchProducts() async throws -> [Product] {
        try await Task.sleep(for: delay)
        if shouldFail {
            throw ServiceError.networkError
        }
        return products
    }

    // ... other mock implementations
}
```

### Environment-Based Injection

```swift
// Environment key for service
private struct ProductServiceKey: EnvironmentKey {
    static let defaultValue: ProductServiceProtocol = ProductService()
}

extension EnvironmentValues {
    var productService: ProductServiceProtocol {
        get { self[ProductServiceKey.self] }
        set { self[ProductServiceKey.self] = newValue }
    }
}

// View extension for convenience
extension View {
    func productService(_ service: ProductServiceProtocol) -> some View {
        environment(\.productService, service)
    }
}

// Using environment injection
struct ProductListScreen: View {
    @Environment(\.productService) private var productService
    @State private var viewModel: ProductListViewModel?

    var body: some View {
        Group {
            if let viewModel {
                ProductListView(viewModel: viewModel)
            } else {
                ProgressView()
            }
        }
        .onAppear {
            if viewModel == nil {
                viewModel = ProductListViewModel(productService: productService)
            }
        }
    }
}

// App setup
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .productService(ProductService())
        }
    }
}
```

### Container-Based Injection

```swift
// Dependency container
@Observable
class DependencyContainer {
    // Services
    let productService: ProductServiceProtocol
    let cartService: CartServiceProtocol
    let userService: UserServiceProtocol
    let favoriteService: FavoriteServiceProtocol

    // Shared state
    var currentUser: User?

    init(
        productService: ProductServiceProtocol = ProductService(),
        cartService: CartServiceProtocol = CartService(),
        userService: UserServiceProtocol = UserService(),
        favoriteService: FavoriteServiceProtocol = FavoriteService()
    ) {
        self.productService = productService
        self.cartService = cartService
        self.userService = userService
        self.favoriteService = favoriteService
    }

    // Factory methods
    func makeProductListViewModel() -> ProductListViewModel {
        ProductListViewModel(productService: productService)
    }

    func makeProductDetailViewModel(product: Product) -> ProductDetailViewModel {
        ProductDetailViewModel(
            product: product,
            cartService: cartService,
            favoriteService: favoriteService
        )
    }

    func makeCartViewModel() -> CartViewModel {
        CartViewModel(cartService: cartService)
    }
}

// Environment key
private struct ContainerKey: EnvironmentKey {
    static let defaultValue = DependencyContainer()
}

extension EnvironmentValues {
    var container: DependencyContainer {
        get { self[ContainerKey.self] }
        set { self[ContainerKey.self] = newValue }
    }
}

// Usage
struct ProductListScreen: View {
    @Environment(\.container) private var container
    @State private var viewModel: ProductListViewModel?

    var body: some View {
        Group {
            if let viewModel {
                ProductListView(viewModel: viewModel)
            }
        }
        .onAppear {
            viewModel = container.makeProductListViewModel()
        }
    }
}
```

---

<!-- /ANCHOR:dependency-injection -->
<!-- ANCHOR:protocol-oriented-design -->
## 6. PROTOCOL-ORIENTED DESIGN

### Repository Pattern

```swift
// Repository protocol
protocol ProductRepositoryProtocol {
    func getAll() async throws -> [Product]
    func get(id: String) async throws -> Product?
    func save(_ product: Product) async throws
    func delete(id: String) async throws
    func search(query: String) async throws -> [Product]
}

// Network repository
class NetworkProductRepository: ProductRepositoryProtocol {
    private let networkClient: NetworkClient

    init(networkClient: NetworkClient) {
        self.networkClient = networkClient
    }

    func getAll() async throws -> [Product] {
        try await networkClient.request(endpoint: .products, method: .get)
    }

    func get(id: String) async throws -> Product? {
        try await networkClient.request(endpoint: .product(id: id), method: .get)
    }

    // ... other implementations
}

// Local/cached repository
class LocalProductRepository: ProductRepositoryProtocol {
    private let storage: StorageProtocol

    init(storage: StorageProtocol) {
        self.storage = storage
    }

    func getAll() async throws -> [Product] {
        try await storage.fetch(Product.self)
    }

    // ... other implementations
}

// Combined repository with caching
class CachingProductRepository: ProductRepositoryProtocol {
    private let remote: ProductRepositoryProtocol
    private let local: ProductRepositoryProtocol

    init(remote: ProductRepositoryProtocol, local: ProductRepositoryProtocol) {
        self.remote = remote
        self.local = local
    }

    func getAll() async throws -> [Product] {
        // Try local first
        let localProducts = try await local.getAll()
        if !localProducts.isEmpty {
            // Refresh in background
            Task {
                if let remoteProducts = try? await remote.getAll() {
                    for product in remoteProducts {
                        try? await local.save(product)
                    }
                }
            }
            return localProducts
        }

        // Fetch from remote
        let products = try await remote.getAll()
        for product in products {
            try? await local.save(product)
        }
        return products
    }

    // ... other implementations
}
```

### Use Case Pattern

```swift
// Use case protocol
protocol UseCaseProtocol {
    associatedtype Input
    associatedtype Output

    func execute(_ input: Input) async throws -> Output
}

// Concrete use case
struct FetchProductsUseCase: UseCaseProtocol {
    typealias Input = FetchProductsInput
    typealias Output = [Product]

    struct FetchProductsInput {
        let category: ProductCategory?
        let sortBy: ProductSortOption
        let limit: Int?
    }

    private let repository: ProductRepositoryProtocol

    init(repository: ProductRepositoryProtocol) {
        self.repository = repository
    }

    func execute(_ input: FetchProductsInput) async throws -> [Product] {
        var products = try await repository.getAll()

        if let category = input.category {
            products = products.filter { $0.category == category }
        }

        switch input.sortBy {
        case .name:
            products.sort { $0.name < $1.name }
        case .price:
            products.sort { $0.price < $1.price }
        case .newest:
            products.sort { $0.createdAt > $1.createdAt }
        }

        if let limit = input.limit {
            products = Array(products.prefix(limit))
        }

        return products
    }
}

// Use in ViewModel
@Observable
class ProductListViewModel {
    private let fetchProductsUseCase: FetchProductsUseCase

    var products: [Product] = []
    var selectedCategory: ProductCategory?
    var sortOption: ProductSortOption = .newest

    init(fetchProductsUseCase: FetchProductsUseCase) {
        self.fetchProductsUseCase = fetchProductsUseCase
    }

    func loadProducts() async {
        let input = FetchProductsUseCase.FetchProductsInput(
            category: selectedCategory,
            sortBy: sortOption,
            limit: nil
        )

        do {
            products = try await fetchProductsUseCase.execute(input)
        } catch {
            // Handle error
        }
    }
}
```

---

<!-- /ANCHOR:protocol-oriented-design -->
<!-- ANCHOR:combine-integration -->
## 7. COMBINE INTEGRATION

### ViewModel with Combine (Legacy Pattern)

For iOS 16 and earlier, or when Combine integration is needed:

```swift
import Combine

class SearchViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var searchText = ""
    @Published var results: [SearchResult] = []
    @Published var isSearching = false
    @Published var errorMessage: String?

    // MARK: - Private Properties

    private let searchService: SearchServiceProtocol
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization

    init(searchService: SearchServiceProtocol = SearchService()) {
        self.searchService = searchService
        setupSearchPipeline()
    }

    // MARK: - Private Methods

    private func setupSearchPipeline() {
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .filter { !$0.isEmpty }
            .sink { [weak self] query in
                Task {
                    await self?.performSearch(query: query)
                }
            }
            .store(in: &cancellables)

        // Clear results when search text is cleared
        $searchText
            .filter { $0.isEmpty }
            .sink { [weak self] _ in
                self?.results = []
            }
            .store(in: &cancellables)
    }

    @MainActor
    private func performSearch(query: String) async {
        isSearching = true
        defer { isSearching = false }

        do {
            results = try await searchService.search(query: query)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

### Combining @Observable with Combine Publishers

```swift
import Observation
import Combine

@Observable
class RealTimeDataViewModel {
    var currentPrice: Double = 0
    var priceHistory: [Double] = []
    var isConnected = false
    var errorMessage: String?

    private let dataService: RealTimeDataService
    private var cancellables = Set<AnyCancellable>()

    init(dataService: RealTimeDataService = RealTimeDataService()) {
        self.dataService = dataService
        setupSubscriptions()
    }

    private func setupSubscriptions() {
        dataService.pricePublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] price in
                self?.currentPrice = price
                self?.priceHistory.append(price)
                // Keep last 100 prices
                if self?.priceHistory.count ?? 0 > 100 {
                    self?.priceHistory.removeFirst()
                }
            }
            .store(in: &cancellables)

        dataService.connectionStatePublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                self?.isConnected = state == .connected
            }
            .store(in: &cancellables)
    }

    func connect() {
        dataService.connect()
    }

    func disconnect() {
        dataService.disconnect()
        cancellables.removeAll()
    }
}
```

### AsyncSequence as Alternative to Combine

```swift
@Observable
class NotificationViewModel {
    var notifications: [Notification] = []
    var unreadCount: Int = 0

    private let notificationService: NotificationServiceProtocol
    private var streamTask: Task<Void, Never>?

    init(notificationService: NotificationServiceProtocol) {
        self.notificationService = notificationService
    }

    func startListening() {
        streamTask = Task {
            do {
                for try await notification in notificationService.notificationStream() {
                    await MainActor.run {
                        notifications.insert(notification, at: 0)
                        if !notification.isRead {
                            unreadCount += 1
                        }
                    }
                }
            } catch {
                // Handle stream error
            }
        }
    }

    func stopListening() {
        streamTask?.cancel()
        streamTask = nil
    }

    func markAsRead(_ notification: Notification) async {
        do {
            try await notificationService.markAsRead(notification.id)
            if let index = notifications.firstIndex(where: { $0.id == notification.id }) {
                notifications[index].isRead = true
                unreadCount = max(0, unreadCount - 1)
            }
        } catch {
            // Handle error
        }
    }
}
```

---

<!-- /ANCHOR:combine-integration -->
<!-- ANCHOR:testing-viewmodels -->
## 8. TESTING VIEWMODELS

### Unit Testing @Observable ViewModels

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

    func testLoadProducts_Success() async {
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
        XCTAssertFalse(sut.isLoading)
        XCTAssertNil(sut.errorMessage)
    }

    func testLoadProducts_Failure() async {
        // Given
        mockService.shouldFail = true

        // When
        await sut.loadProducts()

        // Then
        XCTAssertTrue(sut.products.isEmpty)
        XCTAssertFalse(sut.isLoading)
        XCTAssertNotNil(sut.errorMessage)
    }

    func testFilteredProducts_WithSearchQuery() {
        // Given
        sut.products = [
            Product(id: "1", name: "Apple", price: 10),
            Product(id: "2", name: "Banana", price: 20),
            Product(id: "3", name: "Apricot", price: 15)
        ]

        // When
        sut.searchQuery = "Ap"

        // Then
        XCTAssertEqual(sut.filteredProducts.count, 2)
        XCTAssertTrue(sut.filteredProducts.contains { $0.name == "Apple" })
        XCTAssertTrue(sut.filteredProducts.contains { $0.name == "Apricot" })
    }

    func testDeleteProduct_Success() async {
        // Given
        let product = Product(id: "1", name: "Product", price: 10)
        sut.products = [product]

        // When
        await sut.deleteProduct(product)

        // Then
        XCTAssertTrue(sut.products.isEmpty)
    }
}
```

### Testing with Async/Await

```swift
final class FormViewModelTests: XCTestCase {
    var sut: CreateProductViewModel!
    var mockService: MockProductService!

    override func setUp() {
        super.setUp()
        mockService = MockProductService()
        sut = CreateProductViewModel(productService: mockService)
    }

    func testValidation_EmptyName_ReturnsError() {
        // Given
        sut.name = ""
        sut.priceText = "10.00"

        // When
        let isValid = sut.validate()

        // Then
        XCTAssertFalse(isValid)
        XCTAssertEqual(sut.validationErrors["name"], "Name is required")
    }

    func testValidation_ValidInput_ReturnsTrue() {
        // Given
        sut.name = "Valid Product"
        sut.priceText = "10.00"

        // When
        let isValid = sut.validate()

        // Then
        XCTAssertTrue(isValid)
        XCTAssertTrue(sut.validationErrors.isEmpty)
    }

    func testSubmit_ValidInput_ReturnsProduct() async {
        // Given
        sut.name = "New Product"
        sut.description = "Description"
        sut.priceText = "25.00"

        let expectedProduct = Product(id: "1", name: "New Product", price: 25)
        mockService.createProductResult = expectedProduct

        // When
        let result = await sut.submit()

        // Then
        XCTAssertEqual(result?.id, expectedProduct.id)
        XCTAssertNil(sut.submitError)
    }
}
```

---

<!-- /ANCHOR:testing-viewmodels -->
<!-- ANCHOR:rules -->
## 9. RULES

### ✅ ALWAYS

1. **Use @Observable for iOS 17+** - Modern, efficient observation
2. **Inject dependencies via init** - Enables testing and flexibility
3. **Keep ViewModels focused** - Single responsibility principle
4. **Use protocols for services** - Abstraction for testability
5. **Handle all states** - Loading, success, empty, error
6. **Validate input in ViewModel** - Before service calls
7. **Use computed properties** - For derived state
8. **Test ViewModels thoroughly** - Business logic is critical
9. **Use @MainActor when needed** - For UI-related properties
10. **Document public APIs** - Clear contracts

### ❌ NEVER

1. **Put business logic in Views** - Views are for presentation only
2. **Skip dependency injection** - Makes testing impossible
3. **Force unwrap in ViewModels** - Handle optionals safely
4. **Ignore error handling** - Always handle potential failures
5. **Mix @StateObject with @Observable** - Use @State for @Observable
6. **Access ViewModel from multiple views without care** - Consider data flow
7. **Create singletons for services** - Use proper DI instead
8. **Block the main thread** - Use async/await
9. **Store View-specific state in ViewModel** - Keep presentation state in View
10. **Skip validation** - Always validate before operations

### ⚠️ ESCALATE IF

1. **Architecture decisions needed** - ViewModel boundaries, data flow
2. **State management complexity** - Multiple sources of truth
3. **Performance issues** - Observation causing excessive updates
4. **Cross-cutting concerns** - Logging, analytics, error handling

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

| File | Purpose |
|------|---------|
| [swift_standards.md](./swift_standards.md) | Swift project structure and naming conventions |
| [swiftui_patterns.md](./swiftui_patterns.md) | SwiftUI view composition and state management |
| [async_patterns.md](./async_patterns.md) | Swift concurrency and async/await patterns |
| [testing_strategy.md](./testing_strategy.md) | XCTest and testing best practices |
| [persistence_patterns.md](./persistence_patterns.md) | SwiftData, Core Data, and storage patterns |
<!-- /ANCHOR:related-resources -->
