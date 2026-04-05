/* ─────────────────────────────────────────────────────────────
   Persistence Patterns - SwiftData, UserDefaults, Keychain

   PURPOSE: Production-ready data persistence patterns for iOS 17+
   USAGE: Copy and adapt these patterns for your data storage needs
──────────────────────────────────────────────────────────────── */

import SwiftUI
import SwiftData
import Security

/* ─────────────────────────────────────────────────────────────
   1. SWIFTDATA MODEL TEMPLATES
──────────────────────────────────────────────────────────────── */

/// Basic SwiftData model with common attributes
@Model
final class Product {
    // MARK: - Properties
    @Attribute(.unique) var id: String
    var name: String
    var productDescription: String
    var price: Decimal
    var imageURL: String?
    var createdAt: Date
    var updatedAt: Date

    // MARK: - Relationships
    @Relationship(deleteRule: .cascade) var variants: [ProductVariant] = []
    @Relationship(inverse: \Category.products) var category: Category?

    // MARK: - Computed
    var formattedPrice: String {
        price.formatted(.currency(code: "USD"))
    }

    // MARK: - Init
    init(
        id: String = UUID().uuidString,
        name: String,
        productDescription: String,
        price: Decimal,
        imageURL: String? = nil,
        category: Category? = nil
    ) {
        self.id = id
        self.name = name
        self.productDescription = productDescription
        self.price = price
        self.imageURL = imageURL
        self.category = category
        self.createdAt = Date()
        self.updatedAt = Date()
    }

    // MARK: - Methods
    func update(name: String? = nil, description: String? = nil, price: Decimal? = nil) {
        if let name { self.name = name }
        if let description { self.productDescription = description }
        if let price { self.price = price }
        self.updatedAt = Date()
    }
}

/// Related model with relationships
@Model
final class ProductVariant {
    @Attribute(.unique) var id: String
    var sku: String
    var name: String
    var price: Decimal
    var stockQuantity: Int

    @Relationship var product: Product?

    init(
        id: String = UUID().uuidString,
        sku: String,
        name: String,
        price: Decimal,
        stockQuantity: Int = 0
    ) {
        self.id = id
        self.sku = sku
        self.name = name
        self.price = price
        self.stockQuantity = stockQuantity
    }
}

/// Category model with hierarchical structure
@Model
final class Category {
    @Attribute(.unique) var id: String
    var name: String
    var sortOrder: Int

    // Self-referential relationship for subcategories
    @Relationship(deleteRule: .cascade) var subcategories: [Category] = []
    @Relationship var parent: Category?

    // Products in this category
    @Relationship(deleteRule: .nullify) var products: [Product] = []

    init(
        id: String = UUID().uuidString,
        name: String,
        sortOrder: Int = 0,
        parent: Category? = nil
    ) {
        self.id = id
        self.name = name
        self.sortOrder = sortOrder
        self.parent = parent
    }
}

/// User model with secure attributes
@Model
final class UserProfile {
    @Attribute(.unique) var id: String
    var email: String
    var firstName: String
    var lastName: String
    var avatarURL: String?
    @Attribute(.externalStorage) var avatarData: Data?
    var preferences: UserPreferences
    var createdAt: Date
    var lastLoginAt: Date?

    var fullName: String {
        "\(firstName) \(lastName)"
    }

    init(
        id: String = UUID().uuidString,
        email: String,
        firstName: String,
        lastName: String
    ) {
        self.id = id
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.preferences = UserPreferences()
        self.createdAt = Date()
    }
}

/// Codable struct for complex nested data
struct UserPreferences: Codable {
    var theme: Theme = .system
    var notificationsEnabled: Bool = true
    var language: String = "en"

    enum Theme: String, Codable, CaseIterable {
        case system, light, dark
    }
}

/* ─────────────────────────────────────────────────────────────
   2. SWIFTDATA CRUD OPERATIONS
──────────────────────────────────────────────────────────────── */

/// Repository pattern for SwiftData operations
@MainActor
final class ProductRepository {
    private let modelContext: ModelContext

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    // MARK: - Create
    func create(_ product: Product) throws {
        modelContext.insert(product)
        try modelContext.save()
    }

    func createBatch(_ products: [Product]) throws {
        for product in products {
            modelContext.insert(product)
        }
        try modelContext.save()
    }

    // MARK: - Read
    func fetchAll(
        sortBy: SortDescriptor<Product> = SortDescriptor(\.name),
        limit: Int? = nil
    ) throws -> [Product] {
        var descriptor = FetchDescriptor<Product>(sortBy: [sortBy])
        descriptor.fetchLimit = limit
        return try modelContext.fetch(descriptor)
    }

    func fetch(
        predicate: Predicate<Product>? = nil,
        sortBy: [SortDescriptor<Product>] = [],
        limit: Int? = nil
    ) throws -> [Product] {
        var descriptor = FetchDescriptor<Product>(
            predicate: predicate,
            sortBy: sortBy
        )
        descriptor.fetchLimit = limit
        return try modelContext.fetch(descriptor)
    }

    func fetchById(_ id: String) throws -> Product? {
        let predicate = #Predicate<Product> { $0.id == id }
        var descriptor = FetchDescriptor(predicate: predicate)
        descriptor.fetchLimit = 1
        return try modelContext.fetch(descriptor).first
    }

    func search(query: String) throws -> [Product] {
        let predicate = #Predicate<Product> { product in
            product.name.localizedStandardContains(query) ||
            product.productDescription.localizedStandardContains(query)
        }
        let descriptor = FetchDescriptor(predicate: predicate)
        return try modelContext.fetch(descriptor)
    }

    func fetchByCategory(_ category: Category) throws -> [Product] {
        let categoryId = category.id
        let predicate = #Predicate<Product> { product in
            product.category?.id == categoryId
        }
        let descriptor = FetchDescriptor(
            predicate: predicate,
            sortBy: [SortDescriptor(\.name)]
        )
        return try modelContext.fetch(descriptor)
    }

    func fetchByPriceRange(min: Decimal, max: Decimal) throws -> [Product] {
        let predicate = #Predicate<Product> { product in
            product.price >= min && product.price <= max
        }
        let descriptor = FetchDescriptor(
            predicate: predicate,
            sortBy: [SortDescriptor(\.price)]
        )
        return try modelContext.fetch(descriptor)
    }

    func count(predicate: Predicate<Product>? = nil) throws -> Int {
        let descriptor = FetchDescriptor<Product>(predicate: predicate)
        return try modelContext.fetchCount(descriptor)
    }

    // MARK: - Update
    func update(_ product: Product) throws {
        product.updatedAt = Date()
        try modelContext.save()
    }

    // MARK: - Delete
    func delete(_ product: Product) throws {
        modelContext.delete(product)
        try modelContext.save()
    }

    func deleteById(_ id: String) throws {
        if let product = try fetchById(id) {
            modelContext.delete(product)
            try modelContext.save()
        }
    }

    func deleteAll() throws {
        try modelContext.delete(model: Product.self)
        try modelContext.save()
    }

    // MARK: - Batch Operations
    func deleteWhere(predicate: Predicate<Product>) throws {
        try modelContext.delete(model: Product.self, where: predicate)
        try modelContext.save()
    }
}

/* ─────────────────────────────────────────────────────────────
   3. SWIFTDATA CONTAINER SETUP
──────────────────────────────────────────────────────────────── */

/// Model container configuration
enum DataContainer {
    /// Production container
    static var production: ModelContainer {
        let schema = Schema([
            Product.self,
            ProductVariant.self,
            Category.self,
            UserProfile.self
        ])

        let config = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: false,
            allowsSave: true
        )

        do {
            return try ModelContainer(for: schema, configurations: [config])
        } catch {
            fatalError("Failed to create model container: \(error)")
        }
    }

    /// In-memory container for previews and testing
    static var preview: ModelContainer {
        let schema = Schema([
            Product.self,
            ProductVariant.self,
            Category.self,
            UserProfile.self
        ])

        let config = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: true
        )

        do {
            let container = try ModelContainer(for: schema, configurations: [config])

            // Seed with preview data
            Task { @MainActor in
                let context = container.mainContext
                seedPreviewData(context: context)
            }

            return container
        } catch {
            fatalError("Failed to create preview container: \(error)")
        }
    }

    @MainActor
    private static func seedPreviewData(context: ModelContext) {
        // Create categories
        let electronics = Category(name: "Electronics", sortOrder: 0)
        let clothing = Category(name: "Clothing", sortOrder: 1)

        context.insert(electronics)
        context.insert(clothing)

        // Create products
        let products = [
            Product(name: "iPhone 15 Pro", productDescription: "Latest iPhone", price: 999.99, category: electronics),
            Product(name: "MacBook Air", productDescription: "M3 Chip", price: 1099.99, category: electronics),
            Product(name: "T-Shirt", productDescription: "Cotton t-shirt", price: 29.99, category: clothing)
        ]

        for product in products {
            context.insert(product)
        }
    }
}

/// App entry point with SwiftData
@main
struct MyApp: App {
    let container: ModelContainer

    init() {
        #if DEBUG
        container = DataContainer.preview
        #else
        container = DataContainer.production
        #endif
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
    }
}

/* ─────────────────────────────────────────────────────────────
   4. SWIFTDATA MIGRATIONS
──────────────────────────────────────────────────────────────── */

/// Version 1 schema
enum SchemaV1: VersionedSchema {
    static var versionIdentifier: Schema.Version = Schema.Version(1, 0, 0)

    static var models: [any PersistentModel.Type] {
        [ProductV1.self]
    }

    @Model
    final class ProductV1 {
        var id: String
        var name: String
        var price: Double // Old type

        init(id: String, name: String, price: Double) {
            self.id = id
            self.name = name
            self.price = price
        }
    }
}

/// Version 2 schema with Decimal price
enum SchemaV2: VersionedSchema {
    static var versionIdentifier: Schema.Version = Schema.Version(2, 0, 0)

    static var models: [any PersistentModel.Type] {
        [ProductV2.self]
    }

    @Model
    final class ProductV2 {
        @Attribute(.unique) var id: String
        var name: String
        var price: Decimal // New type
        var createdAt: Date // New field

        init(id: String, name: String, price: Decimal) {
            self.id = id
            self.name = name
            self.price = price
            self.createdAt = Date()
        }
    }
}

/// Migration plan
enum MigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] {
        [SchemaV1.self, SchemaV2.self]
    }

    static var stages: [MigrationStage] {
        [migrateV1toV2]
    }

    static let migrateV1toV2 = MigrationStage.custom(
        fromVersion: SchemaV1.self,
        toVersion: SchemaV2.self,
        willMigrate: nil,
        didMigrate: { context in
            // Post-migration cleanup or data transformation
            let products = try context.fetch(FetchDescriptor<SchemaV2.ProductV2>())
            for product in products {
                // Any additional transformations
            }
            try context.save()
        }
    )
}

/* ─────────────────────────────────────────────────────────────
   5. USERDEFAULTS WRAPPER
──────────────────────────────────────────────────────────────── */

/// Type-safe UserDefaults property wrapper
@propertyWrapper
struct UserDefault<Value> {
    let key: String
    let defaultValue: Value
    let container: UserDefaults

    init(
        wrappedValue: Value,
        key: String,
        container: UserDefaults = .standard
    ) {
        self.key = key
        self.defaultValue = wrappedValue
        self.container = container
    }

    var wrappedValue: Value {
        get {
            container.object(forKey: key) as? Value ?? defaultValue
        }
        set {
            container.set(newValue, forKey: key)
        }
    }
}

/// Property wrapper for Codable types
@propertyWrapper
struct CodableUserDefault<Value: Codable> {
    let key: String
    let defaultValue: Value
    let container: UserDefaults

    init(
        wrappedValue: Value,
        key: String,
        container: UserDefaults = .standard
    ) {
        self.key = key
        self.defaultValue = wrappedValue
        self.container = container
    }

    var wrappedValue: Value {
        get {
            guard let data = container.data(forKey: key),
                  let value = try? JSONDecoder().decode(Value.self, from: data) else {
                return defaultValue
            }
            return value
        }
        set {
            if let data = try? JSONEncoder().encode(newValue) {
                container.set(data, forKey: key)
            }
        }
    }
}

/// App settings using UserDefaults
@Observable
final class AppSettings {
    static let shared = AppSettings()

    private let defaults = UserDefaults.standard

    // MARK: - Keys
    private enum Keys {
        static let isOnboardingComplete = "isOnboardingComplete"
        static let selectedTheme = "selectedTheme"
        static let lastSyncDate = "lastSyncDate"
        static let notificationsEnabled = "notificationsEnabled"
        static let appLaunchCount = "appLaunchCount"
        static let userPreferences = "userPreferences"
    }

    // MARK: - Properties
    var isOnboardingComplete: Bool {
        get { defaults.bool(forKey: Keys.isOnboardingComplete) }
        set { defaults.set(newValue, forKey: Keys.isOnboardingComplete) }
    }

    var selectedTheme: Theme {
        get {
            guard let rawValue = defaults.string(forKey: Keys.selectedTheme),
                  let theme = Theme(rawValue: rawValue) else {
                return .system
            }
            return theme
        }
        set { defaults.set(newValue.rawValue, forKey: Keys.selectedTheme) }
    }

    var lastSyncDate: Date? {
        get { defaults.object(forKey: Keys.lastSyncDate) as? Date }
        set { defaults.set(newValue, forKey: Keys.lastSyncDate) }
    }

    var notificationsEnabled: Bool {
        get { defaults.bool(forKey: Keys.notificationsEnabled) }
        set { defaults.set(newValue, forKey: Keys.notificationsEnabled) }
    }

    var appLaunchCount: Int {
        get { defaults.integer(forKey: Keys.appLaunchCount) }
        set { defaults.set(newValue, forKey: Keys.appLaunchCount) }
    }

    var userPreferences: UserPreferences {
        get {
            guard let data = defaults.data(forKey: Keys.userPreferences),
                  let prefs = try? JSONDecoder().decode(UserPreferences.self, from: data) else {
                return UserPreferences()
            }
            return prefs
        }
        set {
            if let data = try? JSONEncoder().encode(newValue) {
                defaults.set(data, forKey: Keys.userPreferences)
            }
        }
    }

    // MARK: - Theme
    enum Theme: String, CaseIterable {
        case system, light, dark

        var colorScheme: ColorScheme? {
            switch self {
            case .system: return nil
            case .light: return .light
            case .dark: return .dark
            }
        }
    }

    // MARK: - Methods
    func incrementLaunchCount() {
        appLaunchCount += 1
    }

    func resetAll() {
        let domain = Bundle.main.bundleIdentifier!
        defaults.removePersistentDomain(forName: domain)
        defaults.synchronize()
    }

    private init() {}
}

/* ─────────────────────────────────────────────────────────────
   6. KEYCHAIN ACCESS
──────────────────────────────────────────────────────────────── */

/// Secure keychain wrapper
final class KeychainManager {
    static let shared = KeychainManager()

    private let service: String

    init(service: String = Bundle.main.bundleIdentifier ?? "com.app.keychain") {
        self.service = service
    }

    // MARK: - Save
    func save(_ data: Data, for key: String, accessibility: CFString = kSecAttrAccessibleWhenUnlocked) throws {
        // Delete existing item first
        try? delete(key: key)

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: accessibility
        ]

        let status = SecItemAdd(query as CFDictionary, nil)

        guard status == errSecSuccess else {
            throw KeychainError.saveFailed(status)
        }
    }

    func save(_ string: String, for key: String) throws {
        guard let data = string.data(using: .utf8) else {
            throw KeychainError.encodingFailed
        }
        try save(data, for: key)
    }

    func save<T: Codable>(_ value: T, for key: String) throws {
        let data = try JSONEncoder().encode(value)
        try save(data, for: key)
    }

    // MARK: - Read
    func read(key: String) throws -> Data {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess else {
            throw KeychainError.itemNotFound
        }

        guard let data = result as? Data else {
            throw KeychainError.unexpectedData
        }

        return data
    }

    func readString(key: String) throws -> String {
        let data = try read(key: key)
        guard let string = String(data: data, encoding: .utf8) else {
            throw KeychainError.decodingFailed
        }
        return string
    }

    func read<T: Codable>(key: String, type: T.Type) throws -> T {
        let data = try read(key: key)
        return try JSONDecoder().decode(T.self, from: data)
    }

    // MARK: - Delete
    func delete(key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]

        let status = SecItemDelete(query as CFDictionary)

        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status)
        }
    }

    // MARK: - Delete All
    func deleteAll() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service
        ]

        let status = SecItemDelete(query as CFDictionary)

        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status)
        }
    }

    // MARK: - Check Existence
    func exists(key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: false
        ]

        let status = SecItemCopyMatching(query as CFDictionary, nil)
        return status == errSecSuccess
    }
}

/// Keychain errors
enum KeychainError: LocalizedError {
    case saveFailed(OSStatus)
    case itemNotFound
    case unexpectedData
    case encodingFailed
    case decodingFailed
    case deleteFailed(OSStatus)

    var errorDescription: String? {
        switch self {
        case .saveFailed(let status):
            return "Failed to save to keychain: \(status)"
        case .itemNotFound:
            return "Item not found in keychain"
        case .unexpectedData:
            return "Unexpected data format in keychain"
        case .encodingFailed:
            return "Failed to encode data"
        case .decodingFailed:
            return "Failed to decode data"
        case .deleteFailed(let status):
            return "Failed to delete from keychain: \(status)"
        }
    }
}

/* ─────────────────────────────────────────────────────────────
   7. SECURE TOKEN STORAGE
──────────────────────────────────────────────────────────────── */

/// Authentication token storage
@Observable
final class TokenStorage {
    static let shared = TokenStorage()

    private let keychain = KeychainManager.shared

    private enum Keys {
        static let accessToken = "accessToken"
        static let refreshToken = "refreshToken"
        static let tokenExpiry = "tokenExpiry"
    }

    // MARK: - Properties
    private(set) var accessToken: String?
    private(set) var refreshToken: String?
    private(set) var tokenExpiry: Date?

    var isAuthenticated: Bool {
        accessToken != nil && !isTokenExpired
    }

    var isTokenExpired: Bool {
        guard let expiry = tokenExpiry else { return true }
        return Date() >= expiry
    }

    // MARK: - Init
    private init() {
        loadTokens()
    }

    // MARK: - Methods
    func saveTokens(access: String, refresh: String?, expiresIn: TimeInterval) throws {
        try keychain.save(access, for: Keys.accessToken)
        if let refresh {
            try keychain.save(refresh, for: Keys.refreshToken)
        }

        let expiry = Date().addingTimeInterval(expiresIn)
        try keychain.save(expiry, for: Keys.tokenExpiry)

        // Update in-memory state
        accessToken = access
        refreshToken = refresh
        tokenExpiry = expiry
    }

    func clearTokens() throws {
        try keychain.delete(key: Keys.accessToken)
        try keychain.delete(key: Keys.refreshToken)
        try keychain.delete(key: Keys.tokenExpiry)

        accessToken = nil
        refreshToken = nil
        tokenExpiry = nil
    }

    private func loadTokens() {
        accessToken = try? keychain.readString(key: Keys.accessToken)
        refreshToken = try? keychain.readString(key: Keys.refreshToken)
        tokenExpiry = try? keychain.read(key: Keys.tokenExpiry, type: Date.self)
    }
}

/* ─────────────────────────────────────────────────────────────
   8. FILE STORAGE MANAGER
──────────────────────────────────────────────────────────────── */

/// File storage for documents, caches, and temp files
final class FileStorageManager {
    static let shared = FileStorageManager()

    private let fileManager = FileManager.default

    // MARK: - Directories
    var documentsDirectory: URL {
        fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    var cachesDirectory: URL {
        fileManager.urls(for: .cachesDirectory, in: .userDomainMask)[0]
    }

    var temporaryDirectory: URL {
        fileManager.temporaryDirectory
    }

    // MARK: - Save
    func save(_ data: Data, filename: String, in directory: URL? = nil) throws -> URL {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)

        try data.write(to: fileURL)
        return fileURL
    }

    func save<T: Codable>(_ value: T, filename: String, in directory: URL? = nil) throws -> URL {
        let data = try JSONEncoder().encode(value)
        return try save(data, filename: filename, in: directory)
    }

    // MARK: - Read
    func read(filename: String, from directory: URL? = nil) throws -> Data {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)
        return try Data(contentsOf: fileURL)
    }

    func read<T: Codable>(filename: String, type: T.Type, from directory: URL? = nil) throws -> T {
        let data = try read(filename: filename, from: directory)
        return try JSONDecoder().decode(T.self, from: data)
    }

    // MARK: - Delete
    func delete(filename: String, from directory: URL? = nil) throws {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)
        try fileManager.removeItem(at: fileURL)
    }

    func deleteAll(in directory: URL) throws {
        let contents = try fileManager.contentsOfDirectory(
            at: directory,
            includingPropertiesForKeys: nil
        )

        for fileURL in contents {
            try fileManager.removeItem(at: fileURL)
        }
    }

    // MARK: - Check
    func exists(filename: String, in directory: URL? = nil) -> Bool {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)
        return fileManager.fileExists(atPath: fileURL.path)
    }

    // MARK: - Size
    func fileSize(filename: String, in directory: URL? = nil) -> Int64? {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)

        guard let attributes = try? fileManager.attributesOfItem(atPath: fileURL.path),
              let size = attributes[.size] as? Int64 else {
            return nil
        }

        return size
    }

    func directorySize(_ directory: URL) -> Int64 {
        guard let contents = try? fileManager.contentsOfDirectory(
            at: directory,
            includingPropertiesForKeys: [.fileSizeKey],
            options: .skipsHiddenFiles
        ) else {
            return 0
        }

        return contents.reduce(0) { total, fileURL in
            let size = (try? fileURL.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? 0
            return total + Int64(size)
        }
    }

    // MARK: - Subdirectory
    func createSubdirectory(name: String, in directory: URL? = nil) throws -> URL {
        let dir = directory ?? documentsDirectory
        let subdirectory = dir.appendingPathComponent(name, isDirectory: true)

        if !fileManager.fileExists(atPath: subdirectory.path) {
            try fileManager.createDirectory(
                at: subdirectory,
                withIntermediateDirectories: true
            )
        }

        return subdirectory
    }

    private init() {}
}

/* ─────────────────────────────────────────────────────────────
   9. CACHE MANAGER
──────────────────────────────────────────────────────────────── */

/// In-memory and disk cache manager
actor CacheManager<Key: Hashable, Value> {
    private var memoryCache: [Key: CacheEntry<Value>] = [:]
    private let maxMemoryCount: Int
    private let defaultExpiration: TimeInterval

    struct CacheEntry<T> {
        let value: T
        let expirationDate: Date

        var isExpired: Bool {
            Date() > expirationDate
        }
    }

    init(maxMemoryCount: Int = 100, defaultExpiration: TimeInterval = 300) {
        self.maxMemoryCount = maxMemoryCount
        self.defaultExpiration = defaultExpiration
    }

    // MARK: - Set
    func set(_ value: Value, for key: Key, expiration: TimeInterval? = nil) {
        let exp = expiration ?? defaultExpiration
        let entry = CacheEntry(
            value: value,
            expirationDate: Date().addingTimeInterval(exp)
        )

        memoryCache[key] = entry

        // Evict if over capacity
        if memoryCache.count > maxMemoryCount {
            evictExpiredEntries()
        }
    }

    // MARK: - Get
    func get(_ key: Key) -> Value? {
        guard let entry = memoryCache[key] else {
            return nil
        }

        if entry.isExpired {
            memoryCache.removeValue(forKey: key)
            return nil
        }

        return entry.value
    }

    // MARK: - Remove
    func remove(_ key: Key) {
        memoryCache.removeValue(forKey: key)
    }

    func removeAll() {
        memoryCache.removeAll()
    }

    // MARK: - Eviction
    private func evictExpiredEntries() {
        memoryCache = memoryCache.filter { !$0.value.isExpired }
    }

    // MARK: - Info
    var count: Int {
        memoryCache.count
    }
}

/// Image cache specialized for URL-based images
actor ImageCache {
    static let shared = ImageCache()

    private let memoryCache = NSCache<NSURL, UIImage>()
    private let fileStorage = FileStorageManager.shared
    private let cacheDirectory: URL

    init() {
        memoryCache.countLimit = 100
        memoryCache.totalCostLimit = 50 * 1024 * 1024 // 50MB

        cacheDirectory = (try? fileStorage.createSubdirectory(
            name: "ImageCache",
            in: fileStorage.cachesDirectory
        )) ?? fileStorage.cachesDirectory
    }

    // MARK: - Get/Set
    func image(for url: URL) async -> UIImage? {
        // Check memory cache
        if let cached = memoryCache.object(forKey: url as NSURL) {
            return cached
        }

        // Check disk cache
        let filename = url.absoluteString.data(using: .utf8)!.base64EncodedString()
        if let data = try? fileStorage.read(filename: filename, from: cacheDirectory),
           let image = UIImage(data: data) {
            memoryCache.setObject(image, forKey: url as NSURL)
            return image
        }

        return nil
    }

    func setImage(_ image: UIImage, for url: URL) async {
        memoryCache.setObject(image, forKey: url as NSURL)

        // Save to disk
        let filename = url.absoluteString.data(using: .utf8)!.base64EncodedString()
        if let data = image.jpegData(compressionQuality: 0.8) {
            _ = try? fileStorage.save(data, filename: filename, in: cacheDirectory)
        }
    }

    // MARK: - Clear
    func clearMemory() {
        memoryCache.removeAllObjects()
    }

    func clearDisk() async {
        try? fileStorage.deleteAll(in: cacheDirectory)
    }

    func clearAll() async {
        clearMemory()
        await clearDisk()
    }
}

/* ─────────────────────────────────────────────────────────────
   10. SUPPORTING VIEWS
──────────────────────────────────────────────────────────────── */

/// Example: SwiftData query in a view
struct ProductListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Product.name) private var products: [Product]

    var body: some View {
        List(products) { product in
            VStack(alignment: .leading) {
                Text(product.name)
                    .font(.headline)
                Text(product.formattedPrice)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

/// Example: Filtered query
struct FilteredProductListView: View {
    @Query private var products: [Product]

    init(minPrice: Decimal) {
        let predicate = #Predicate<Product> { product in
            product.price >= minPrice
        }
        _products = Query(
            filter: predicate,
            sort: [SortDescriptor(\Product.price)]
        )
    }

    var body: some View {
        List(products) { product in
            Text("\(product.name) - \(product.formattedPrice)")
        }
    }
}

// Placeholder for UIImage since we're using SwiftUI
#if canImport(UIKit)
import UIKit
#endif

// Placeholder ContentView for compilation
struct ContentView: View {
    var body: some View {
        Text("Content")
    }
}
