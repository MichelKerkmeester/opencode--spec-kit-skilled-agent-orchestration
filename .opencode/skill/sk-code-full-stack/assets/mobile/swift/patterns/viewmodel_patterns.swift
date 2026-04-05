/* ─────────────────────────────────────────────────────────────
   ViewModel Patterns - @Observable ViewModels for SwiftUI

   PURPOSE: Production-ready ViewModel patterns using @Observable (iOS 17+)
   USAGE: Copy and adapt these patterns for your specific use cases
──────────────────────────────────────────────────────────────── */

import SwiftUI
import Observation

/* ─────────────────────────────────────────────────────────────
   1. BASIC @OBSERVABLE VIEWMODEL
──────────────────────────────────────────────────────────────── */

/// Basic ViewModel template with @Observable macro
/// - Replaces ObservableObject + @Published pattern
/// - Use @State in views to create ViewModel instances
@Observable
final class BasicViewModel {
    // MARK: - State
    private(set) var items: [Item] = []
    private(set) var isLoading = false
    private(set) var error: Error?

    // MARK: - Computed Properties
    var hasItems: Bool { !items.isEmpty }
    var itemCount: Int { items.count }

    // MARK: - Dependencies
    private let itemService: ItemServiceProtocol

    // MARK: - Init
    init(itemService: ItemServiceProtocol = ItemService()) {
        self.itemService = itemService
    }

    // MARK: - Actions
    @MainActor
    func loadItems() async {
        guard !isLoading else { return }

        isLoading = true
        error = nil

        do {
            items = try await itemService.fetchItems()
        } catch {
            self.error = error
        }

        isLoading = false
    }

    @MainActor
    func addItem(_ item: Item) async throws {
        let savedItem = try await itemService.create(item)
        items.append(savedItem)
    }

    @MainActor
    func deleteItem(at indexSet: IndexSet) async throws {
        let itemsToDelete = indexSet.map { items[$0] }

        for item in itemsToDelete {
            try await itemService.delete(item.id)
        }

        items.remove(atOffsets: indexSet)
    }
}

/* ─────────────────────────────────────────────────────────────
   2. LOADING/ERROR/SUCCESS STATE PATTERN
──────────────────────────────────────────────────────────────── */

/// Generic LoadingState enum for consistent state handling
enum LoadingState<T> {
    case idle
    case loading
    case loaded(T)
    case error(Error)

    var isLoading: Bool {
        if case .loading = self { return true }
        return false
    }

    var value: T? {
        if case .loaded(let value) = self { return value }
        return nil
    }

    var error: Error? {
        if case .error(let error) = self { return error }
        return nil
    }
}

/// ViewModel using LoadingState pattern
@Observable
final class ProductDetailViewModel {
    // MARK: - State
    private(set) var state: LoadingState<ProductDetail> = .idle
    private(set) var isFavorite = false
    private(set) var isAddingToCart = false

    // MARK: - Computed
    var product: ProductDetail? { state.value }
    var isLoading: Bool { state.isLoading }
    var error: Error? { state.error }

    // MARK: - Dependencies
    private let productService: ProductServiceProtocol
    private let cartService: CartServiceProtocol
    private let favoritesService: FavoritesServiceProtocol

    // MARK: - Product ID
    private let productId: String

    init(
        productId: String,
        productService: ProductServiceProtocol = ProductService(),
        cartService: CartServiceProtocol = CartService(),
        favoritesService: FavoritesServiceProtocol = FavoritesService()
    ) {
        self.productId = productId
        self.productService = productService
        self.cartService = cartService
        self.favoritesService = favoritesService
    }

    // MARK: - Actions
    @MainActor
    func loadProduct() async {
        state = .loading

        do {
            async let product = productService.fetchProduct(id: productId)
            async let favorite = favoritesService.isFavorite(productId: productId)

            let (loadedProduct, isFav) = try await (product, favorite)
            state = .loaded(loadedProduct)
            isFavorite = isFav
        } catch {
            state = .error(error)
        }
    }

    @MainActor
    func toggleFavorite() async {
        guard let product = product else { return }

        do {
            if isFavorite {
                try await favoritesService.removeFavorite(productId: product.id)
            } else {
                try await favoritesService.addFavorite(productId: product.id)
            }
            isFavorite.toggle()
        } catch {
            // Handle error - could show alert
        }
    }

    @MainActor
    func addToCart(quantity: Int) async throws {
        guard let product = product else { return }

        isAddingToCart = true
        defer { isAddingToCart = false }

        try await cartService.addItem(productId: product.id, quantity: quantity)
    }
}

/* ─────────────────────────────────────────────────────────────
   3. ASYNC DATA LOADING PATTERNS
──────────────────────────────────────────────────────────────── */

/// ViewModel with pagination support
@Observable
final class PaginatedListViewModel<T: Identifiable> {
    // MARK: - State
    private(set) var items: [T] = []
    private(set) var isLoading = false
    private(set) var isLoadingMore = false
    private(set) var error: Error?
    private(set) var hasMorePages = true

    private var currentPage = 0
    private let pageSize = 20

    // MARK: - Dependencies
    private let fetchPage: (Int, Int) async throws -> [T]

    init(fetchPage: @escaping (Int, Int) async throws -> [T]) {
        self.fetchPage = fetchPage
    }

    // MARK: - Actions
    @MainActor
    func loadInitial() async {
        guard !isLoading else { return }

        isLoading = true
        error = nil
        currentPage = 0

        do {
            let newItems = try await fetchPage(0, pageSize)
            items = newItems
            hasMorePages = newItems.count >= pageSize
            currentPage = 1
        } catch {
            self.error = error
        }

        isLoading = false
    }

    @MainActor
    func loadMoreIfNeeded(currentItem: T) async {
        guard let lastItem = items.last,
              lastItem.id as AnyHashable == currentItem.id as AnyHashable,
              !isLoadingMore,
              hasMorePages else {
            return
        }

        await loadMore()
    }

    @MainActor
    private func loadMore() async {
        isLoadingMore = true

        do {
            let newItems = try await fetchPage(currentPage, pageSize)
            items.append(contentsOf: newItems)
            hasMorePages = newItems.count >= pageSize
            currentPage += 1
        } catch {
            // Silent fail for pagination - user can retry
        }

        isLoadingMore = false
    }

    @MainActor
    func refresh() async {
        await loadInitial()
    }
}

/// ViewModel with search and debouncing
@Observable
final class SearchViewModel {
    // MARK: - State
    var searchText = "" {
        didSet {
            searchTask?.cancel()
            searchTask = Task {
                try? await Task.sleep(for: .milliseconds(300))
                await performSearch()
            }
        }
    }

    private(set) var results: [SearchResult] = []
    private(set) var isSearching = false
    private(set) var recentSearches: [String] = []

    // MARK: - Private
    private var searchTask: Task<Void, Never>?
    private let searchService: SearchServiceProtocol
    private let recentSearchesLimit = 10

    init(searchService: SearchServiceProtocol = SearchService()) {
        self.searchService = searchService
        loadRecentSearches()
    }

    // MARK: - Actions
    @MainActor
    private func performSearch() async {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)

        guard !query.isEmpty else {
            results = []
            return
        }

        isSearching = true

        do {
            results = try await searchService.search(query: query)
            addToRecentSearches(query)
        } catch {
            results = []
        }

        isSearching = false
    }

    func clearSearch() {
        searchText = ""
        results = []
        searchTask?.cancel()
    }

    func selectRecentSearch(_ query: String) {
        searchText = query
    }

    func clearRecentSearches() {
        recentSearches = []
        saveRecentSearches()
    }

    // MARK: - Private Helpers
    private func addToRecentSearches(_ query: String) {
        var searches = recentSearches.filter { $0 != query }
        searches.insert(query, at: 0)
        recentSearches = Array(searches.prefix(recentSearchesLimit))
        saveRecentSearches()
    }

    private func loadRecentSearches() {
        recentSearches = UserDefaults.standard.stringArray(forKey: "recentSearches") ?? []
    }

    private func saveRecentSearches() {
        UserDefaults.standard.set(recentSearches, forKey: "recentSearches")
    }
}

/* ─────────────────────────────────────────────────────────────
   4. FORM VALIDATION VIEWMODEL
──────────────────────────────────────────────────────────────── */

/// Form ViewModel with comprehensive validation
@Observable
final class RegistrationFormViewModel {
    // MARK: - Form Fields
    var email = ""
    var password = ""
    var confirmPassword = ""
    var firstName = ""
    var lastName = ""
    var acceptedTerms = false

    // MARK: - State
    private(set) var isSubmitting = false
    private(set) var submitError: Error?
    private(set) var isRegistered = false

    // Field-level validation touched state
    private var touchedFields: Set<FormField> = []

    enum FormField: String {
        case email, password, confirmPassword, firstName, lastName, acceptedTerms
    }

    // MARK: - Dependencies
    private let authService: AuthServiceProtocol

    init(authService: AuthServiceProtocol = AuthService()) {
        self.authService = authService
    }

    // MARK: - Validation Rules
    var emailError: String? {
        guard touchedFields.contains(.email), !email.isEmpty else { return nil }

        let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if email.wholeMatch(of: emailRegex) == nil {
            return "Please enter a valid email address"
        }
        return nil
    }

    var passwordError: String? {
        guard touchedFields.contains(.password), !password.isEmpty else { return nil }

        if password.count < 8 {
            return "Password must be at least 8 characters"
        }

        let hasUppercase = password.contains(where: { $0.isUppercase })
        let hasLowercase = password.contains(where: { $0.isLowercase })
        let hasNumber = password.contains(where: { $0.isNumber })

        if !hasUppercase || !hasLowercase || !hasNumber {
            return "Password must contain uppercase, lowercase, and number"
        }

        return nil
    }

    var confirmPasswordError: String? {
        guard touchedFields.contains(.confirmPassword), !confirmPassword.isEmpty else { return nil }

        if confirmPassword != password {
            return "Passwords do not match"
        }
        return nil
    }

    var firstNameError: String? {
        guard touchedFields.contains(.firstName), !firstName.isEmpty else { return nil }

        if firstName.count < 2 {
            return "First name must be at least 2 characters"
        }
        return nil
    }

    var lastNameError: String? {
        guard touchedFields.contains(.lastName), !lastName.isEmpty else { return nil }

        if lastName.count < 2 {
            return "Last name must be at least 2 characters"
        }
        return nil
    }

    // MARK: - Overall Validation
    var isValid: Bool {
        !email.isEmpty &&
        !password.isEmpty &&
        !confirmPassword.isEmpty &&
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        acceptedTerms &&
        emailError == nil &&
        passwordError == nil &&
        confirmPasswordError == nil &&
        firstNameError == nil &&
        lastNameError == nil
    }

    var passwordStrength: PasswordStrength {
        guard !password.isEmpty else { return .none }

        var score = 0
        if password.count >= 8 { score += 1 }
        if password.count >= 12 { score += 1 }
        if password.contains(where: { $0.isUppercase }) { score += 1 }
        if password.contains(where: { $0.isLowercase }) { score += 1 }
        if password.contains(where: { $0.isNumber }) { score += 1 }
        if password.contains(where: { "!@#$%^&*()_+-=[]{}|;:,.<>?".contains($0) }) { score += 1 }

        switch score {
        case 0...2: return .weak
        case 3...4: return .medium
        default: return .strong
        }
    }

    enum PasswordStrength {
        case none, weak, medium, strong

        var color: Color {
            switch self {
            case .none: return .clear
            case .weak: return .red
            case .medium: return .orange
            case .strong: return .green
            }
        }

        var label: String {
            switch self {
            case .none: return ""
            case .weak: return "Weak"
            case .medium: return "Medium"
            case .strong: return "Strong"
            }
        }
    }

    // MARK: - Actions
    func markFieldTouched(_ field: FormField) {
        touchedFields.insert(field)
    }

    func markAllFieldsTouched() {
        touchedFields = Set(FormField.allCases)
    }

    @MainActor
    func submit() async {
        markAllFieldsTouched()

        guard isValid else { return }

        isSubmitting = true
        submitError = nil

        do {
            try await authService.register(
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            )
            isRegistered = true
        } catch {
            submitError = error
        }

        isSubmitting = false
    }

    func reset() {
        email = ""
        password = ""
        confirmPassword = ""
        firstName = ""
        lastName = ""
        acceptedTerms = false
        touchedFields = []
        submitError = nil
        isRegistered = false
    }
}

extension RegistrationFormViewModel.FormField: CaseIterable {}

/* ─────────────────────────────────────────────────────────────
   5. NAVIGATION VIEWMODEL
──────────────────────────────────────────────────────────────── */

/// Centralized navigation state management
@Observable
final class NavigationViewModel {
    // MARK: - Navigation State
    var path = NavigationPath()
    var selectedTab: Tab = .home
    var presentedSheet: Sheet?
    var presentedFullScreenCover: FullScreenCover?
    var alertItem: AlertItem?

    // MARK: - Types
    enum Tab: String, CaseIterable {
        case home, search, favorites, cart, profile

        var title: String { rawValue.capitalized }

        var icon: String {
            switch self {
            case .home: return "house"
            case .search: return "magnifyingglass"
            case .favorites: return "heart"
            case .cart: return "cart"
            case .profile: return "person"
            }
        }
    }

    enum Sheet: Identifiable {
        case settings
        case filter(FilterOptions)
        case share(URL)
        case addItem

        var id: String {
            switch self {
            case .settings: return "settings"
            case .filter: return "filter"
            case .share: return "share"
            case .addItem: return "addItem"
            }
        }
    }

    enum FullScreenCover: Identifiable {
        case onboarding
        case imageViewer([URL], Int)
        case videoPlayer(URL)

        var id: String {
            switch self {
            case .onboarding: return "onboarding"
            case .imageViewer: return "imageViewer"
            case .videoPlayer: return "videoPlayer"
            }
        }
    }

    struct AlertItem: Identifiable {
        let id = UUID()
        let title: String
        let message: String
        var primaryButton: AlertButton = .ok
        var secondaryButton: AlertButton?

        struct AlertButton {
            let title: String
            let role: ButtonRole?
            let action: () -> Void

            static let ok = AlertButton(title: "OK", role: nil, action: {})
            static let cancel = AlertButton(title: "Cancel", role: .cancel, action: {})

            static func destructive(_ title: String, action: @escaping () -> Void) -> AlertButton {
                AlertButton(title: title, role: .destructive, action: action)
            }
        }
    }

    // MARK: - Navigation Actions
    func navigate(to destination: any Hashable) {
        path.append(destination)
    }

    func pop() {
        guard !path.isEmpty else { return }
        path.removeLast()
    }

    func popToRoot() {
        path = NavigationPath()
    }

    func switchTab(to tab: Tab) {
        if selectedTab == tab {
            popToRoot()
        } else {
            selectedTab = tab
        }
    }

    func present(_ sheet: Sheet) {
        presentedSheet = sheet
    }

    func presentFullScreen(_ cover: FullScreenCover) {
        presentedFullScreenCover = cover
    }

    func showAlert(
        title: String,
        message: String,
        primaryButton: AlertItem.AlertButton = .ok,
        secondaryButton: AlertItem.AlertButton? = nil
    ) {
        alertItem = AlertItem(
            title: title,
            message: message,
            primaryButton: primaryButton,
            secondaryButton: secondaryButton
        )
    }

    func dismissSheet() {
        presentedSheet = nil
    }

    func dismissFullScreen() {
        presentedFullScreenCover = nil
    }
}

/* ─────────────────────────────────────────────────────────────
   6. DEPENDENCY INJECTION
──────────────────────────────────────────────────────────────── */

/// Environment key for dependency container
struct DependencyContainerKey: EnvironmentKey {
    static let defaultValue = DependencyContainer.shared
}

extension EnvironmentValues {
    var dependencies: DependencyContainer {
        get { self[DependencyContainerKey.self] }
        set { self[DependencyContainerKey.self] = newValue }
    }
}

/// Dependency container for service injection
@Observable
final class DependencyContainer {
    static let shared = DependencyContainer()

    // MARK: - Services
    lazy var authService: AuthServiceProtocol = AuthService()
    lazy var productService: ProductServiceProtocol = ProductService()
    lazy var cartService: CartServiceProtocol = CartService()
    lazy var favoritesService: FavoritesServiceProtocol = FavoritesService()
    lazy var searchService: SearchServiceProtocol = SearchService()
    lazy var userService: UserServiceProtocol = UserService()

    // MARK: - State
    lazy var authState = AuthState()
    lazy var cartState = CartState()

    private init() {}

    // MARK: - Testing Support
    static func mock() -> DependencyContainer {
        let container = DependencyContainer()
        // Override with mock implementations for testing
        return container
    }
}

/// Authentication state observable
@Observable
final class AuthState {
    private(set) var currentUser: User?
    private(set) var isAuthenticated = false
    private(set) var isLoading = true

    @MainActor
    func setUser(_ user: User?) {
        currentUser = user
        isAuthenticated = user != nil
        isLoading = false
    }

    @MainActor
    func logout() {
        currentUser = nil
        isAuthenticated = false
    }
}

/// Cart state observable
@Observable
final class CartState {
    private(set) var items: [CartItem] = []

    var itemCount: Int { items.reduce(0) { $0 + $1.quantity } }
    var total: Decimal { items.reduce(0) { $0 + $1.subtotal } }

    @MainActor
    func setItems(_ items: [CartItem]) {
        self.items = items
    }

    @MainActor
    func addItem(_ item: CartItem) {
        if let index = items.firstIndex(where: { $0.productId == item.productId }) {
            items[index].quantity += item.quantity
        } else {
            items.append(item)
        }
    }

    @MainActor
    func removeItem(productId: String) {
        items.removeAll { $0.productId == productId }
    }

    @MainActor
    func clear() {
        items = []
    }
}

/* ─────────────────────────────────────────────────────────────
   7. VIEWMODEL WITH COMBINE BRIDGE (Legacy Support)
──────────────────────────────────────────────────────────────── */

import Combine

/// Bridge pattern for ViewModels that need Combine publishers
@Observable
final class CombineBridgeViewModel {
    // MARK: - State
    var searchQuery = "" {
        didSet { searchQuerySubject.send(searchQuery) }
    }
    private(set) var results: [SearchResult] = []
    private(set) var isSearching = false

    // MARK: - Combine Bridge
    private let searchQuerySubject = PassthroughSubject<String, Never>()
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupBindings()
    }

    private func setupBindings() {
        searchQuerySubject
            .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
            .removeDuplicates()
            .sink { [weak self] query in
                Task { @MainActor in
                    await self?.performSearch(query)
                }
            }
            .store(in: &cancellables)
    }

    @MainActor
    private func performSearch(_ query: String) async {
        guard !query.isEmpty else {
            results = []
            return
        }

        isSearching = true
        // Perform search...
        try? await Task.sleep(for: .seconds(1))
        results = [SearchResult(id: "1", title: "Result for: \(query)")]
        isSearching = false
    }
}

/* ─────────────────────────────────────────────────────────────
   8. SUPPORTING TYPES (for compilation)
──────────────────────────────────────────────────────────────── */

// Note: These protocols and types support the examples above.
// In a real app, these would be in separate files.

// MARK: - Protocols

protocol ItemServiceProtocol {
    func fetchItems() async throws -> [Item]
    func create(_ item: Item) async throws -> Item
    func delete(_ id: String) async throws
}

protocol ProductServiceProtocol {
    func fetchProducts() async throws -> [Product]
    func fetchProduct(id: String) async throws -> ProductDetail
}

protocol CartServiceProtocol {
    func addItem(productId: String, quantity: Int) async throws
    func removeItem(productId: String) async throws
    func getCart() async throws -> [CartItem]
}

protocol FavoritesServiceProtocol {
    func isFavorite(productId: String) async throws -> Bool
    func addFavorite(productId: String) async throws
    func removeFavorite(productId: String) async throws
}

protocol SearchServiceProtocol {
    func search(query: String) async throws -> [SearchResult]
}

protocol AuthServiceProtocol {
    func register(email: String, password: String, firstName: String, lastName: String) async throws
    func login(email: String, password: String) async throws -> User
    func logout() async throws
}

protocol UserServiceProtocol {
    func getCurrentUser() async throws -> User?
    func updateProfile(_ profile: UserProfile) async throws
}

// MARK: - Models

struct Item: Identifiable {
    let id: String
    var name: String
}

struct Product: Identifiable, Hashable {
    let id: String
    let name: String
    let price: Decimal
}

struct ProductDetail: Identifiable {
    let id: String
    let name: String
    let description: String
    let price: Decimal
    let images: [URL]
}

struct SearchResult: Identifiable {
    let id: String
    let title: String
}

struct FilterOptions {
    var minPrice: Decimal?
    var maxPrice: Decimal?
    var categories: [String] = []
}

struct User: Identifiable {
    let id: String
    let email: String
    let firstName: String
    let lastName: String
}

struct UserProfile {
    var firstName: String
    var lastName: String
    var email: String
}

struct CartItem: Identifiable {
    let id: String
    let productId: String
    var quantity: Int
    let price: Decimal

    var subtotal: Decimal { price * Decimal(quantity) }
}

// MARK: - Service Implementations (Stubs)

final class ItemService: ItemServiceProtocol {
    func fetchItems() async throws -> [Item] { [] }
    func create(_ item: Item) async throws -> Item { item }
    func delete(_ id: String) async throws {}
}

final class ProductService: ProductServiceProtocol {
    func fetchProducts() async throws -> [Product] { [] }
    func fetchProduct(id: String) async throws -> ProductDetail {
        ProductDetail(id: id, name: "", description: "", price: 0, images: [])
    }
}

final class CartService: CartServiceProtocol {
    func addItem(productId: String, quantity: Int) async throws {}
    func removeItem(productId: String) async throws {}
    func getCart() async throws -> [CartItem] { [] }
}

final class FavoritesService: FavoritesServiceProtocol {
    func isFavorite(productId: String) async throws -> Bool { false }
    func addFavorite(productId: String) async throws {}
    func removeFavorite(productId: String) async throws {}
}

final class SearchService: SearchServiceProtocol {
    func search(query: String) async throws -> [SearchResult] { [] }
}

final class AuthService: AuthServiceProtocol {
    func register(email: String, password: String, firstName: String, lastName: String) async throws {}
    func login(email: String, password: String) async throws -> User {
        User(id: "", email: email, firstName: "", lastName: "")
    }
    func logout() async throws {}
}

final class UserService: UserServiceProtocol {
    func getCurrentUser() async throws -> User? { nil }
    func updateProfile(_ profile: UserProfile) async throws {}
}
