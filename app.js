// Telegram WebApp API integration
const tg = window.Telegram.WebApp;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize Telegram WebApp
    tg.ready();
    tg.expand();
    
    // Set up event listeners
    setupNavigation();
    setupSearch();
    setupFilters();
    setupCreateForm();
    setupProfile();
    setupModal();
    setupCategories();
    
    // Load initial data
    loadListings();
    loadProfile();
    
    // Show main button for listing creation
    tg.MainButton.text = "Создать объявление";
    tg.MainButton.show();
    tg.MainButton.onClick(showCreateSection);
}

// Sample data for demonstration
let listings = [
    {
        id: 1,
        title: "AK-47 Калашников",
        price: 2500,
        category: "weapons",
        server: "1",
        description: "Отличное оружие для PvP, полная модификация",
        image: "🔫",
        seller: "Player123",
        created: new Date(),
        views: 45
    },
    {
        id: 2,
        title: "BMW M5 F90",
        price: 15000,
        category: "vehicles",
        server: "2",
        description: "Максимальная прокачка, все улучшения",
        image: "🚗",
        seller: "CarDealer",
        created: new Date(),
        views: 78
    },
    {
        id: 3,
        title: "Аккаунт 85 LVL",
        price: 5000,
        category: "accounts",
        server: "1",
        description: "Высокий уровень, много денег и имущества",
        image: "👤",
        seller: "AccountSeller",
        created: new Date(),
        views: 123
    },
    {
        id: 4,
        title: "1,000,000 BR$",
        price: 1000,
        category: "money",
        server: "3",
        description: "Быстрая передача игровой валюты",
        image: "💰",
        seller: "MoneyExchange",
        created: new Date(),
        views: 89
    }
];

const categories = {
    weapons: { name: "Оружие", icon: "🔫", count: 15 },
    vehicles: { name: "Транспорт", icon: "🚗", count: 23 },
    items: { name: "Предметы", icon: "📦", count: 34 },
    services: { name: "Услуги", icon: "🛠️", count: 12 },
    accounts: { name: "Аккаунты", icon: "👤", count: 8 },
    money: { name: "Валюта", icon: "💰", count: 19 }
};

let currentUser = null;
let currentFilters = {
    category: '',
    server: '',
    sort: 'newest',
    search: ''
};

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            // Update main button based on section
            updateMainButton(targetSection);
        });
    });
}

function updateMainButton(section) {
    switch(section) {
        case 'create':
            tg.MainButton.text = "Опубликовать";
            tg.MainButton.show();
            tg.MainButton.onClick(() => {
                document.getElementById('createForm').dispatchEvent(new Event('submit'));
            });
            break;
        case 'profile':
            tg.MainButton.hide();
            break;
        default:
            tg.MainButton.text = "Создать объявление";
            tg.MainButton.show();
            tg.MainButton.onClick(showCreateSection);
    }
}

function showCreateSection() {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-section="create"]').classList.add('active');
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById('create').classList.add('active');
    updateMainButton('create');
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-btn');
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchButton.addEventListener('click', handleSearch);
    
    function handleSearch() {
        currentFilters.search = searchInput.value.toLowerCase();
        loadListings();
    }
}

// Filters
function setupFilters() {
    const serverFilter = document.getElementById('serverFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    serverFilter.addEventListener('change', () => {
        currentFilters.server = serverFilter.value;
        loadListings();
    });
    
    sortFilter.addEventListener('change', () => {
        currentFilters.sort = sortFilter.value;
        loadListings();
    });
}

// Categories
function setupCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            currentFilters.category = category;
            
            // Switch to home section and filter
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-section="home"]').classList.add('active');
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            document.getElementById('home').classList.add('active');
            
            loadListings();
        });
    });
    
    // Load categories list
    loadCategoriesList();
}

function loadCategoriesList() {
    const categoriesList = document.querySelector('.categories-list');
    categoriesList.innerHTML = '';
    
    Object.keys(categories).forEach(key => {
        const category = categories[key];
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-item-icon">${category.icon}</div>
            <div class="category-item-info">
                <div class="category-item-name">${category.name}</div>
                <div class="category-item-count">${category.count} объявлений</div>
            </div>
        `;
        
        categoryItem.addEventListener('click', () => {
            currentFilters.category = key;
            // Switch to home section
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-section="home"]').classList.add('active');
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            document.getElementById('home').classList.add('active');
            loadListings();
        });
        
        categoriesList.appendChild(categoryItem);
    });
}

// Listings
function loadListings() {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '<div class="loading">Загрузка объявлений...</div>';
    
    // Simulate API call
    setTimeout(() => {
        let filteredListings = [...listings];
        
        // Apply filters
        if (currentFilters.category) {
            filteredListings = filteredListings.filter(listing => 
                listing.category === currentFilters.category);
        }
        
        if (currentFilters.server) {
            filteredListings = filteredListings.filter(listing => 
                listing.server === currentFilters.server);
        }
        
        if (currentFilters.search) {
            filteredListings = filteredListings.filter(listing => 
                listing.title.toLowerCase().includes(currentFilters.search) ||
                listing.description.toLowerCase().includes(currentFilters.search));
        }
        
        // Apply sorting
        switch(currentFilters.sort) {
            case 'price-asc':
                filteredListings.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredListings.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filteredListings.sort((a, b) => b.views - a.views);
                break;
            default:
                filteredListings.sort((a, b) => b.created - a.created);
        }
        
        renderListings(filteredListings);
    }, 500);
}

function renderListings(listings) {
    const listingsContainer = document.getElementById('listings');
    
    if (listings.length === 0) {
        listingsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">Объявления не найдены</div>
                <button class="empty-state-btn" onclick="showCreateSection()">
                    Создать первое объявление
                </button>
            </div>
        `;
        return;
    }
    
    listingsContainer.innerHTML = listings.map(listing => `
        <div class="listing-card" onclick="showListingDetails(${listing.id})">
            <div class="listing-image">${listing.image}</div>
            <div class="listing-content">
                <div class="listing-title">${listing.title}</div>
                <div class="listing-price">${listing.price.toLocaleString()} ₽</div>
                <div class="listing-meta">
                    <span class="listing-seller">@${listing.seller}</span>
                    <span class="listing-server">Сервер ${listing.server}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal
function setupModal() {
    const modal = document.getElementById('listingModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showListingDetails(id) {
    const listing = listings.find(l => l.id === id);
    if (!listing) return;
    
    const modal = document.getElementById('listingModal');
    const detailsContainer = document.getElementById('listingDetails');
    
    detailsContainer.innerHTML = `
        <div class="listing-detail">
            <div class="listing-image" style="height: 200px; font-size: 64px; margin-bottom: 20px;">
                ${listing.image}
            </div>
            <h2 style="margin-bottom: 10px;">${listing.title}</h2>
            <div class="listing-price" style="font-size: 24px; margin-bottom: 15px;">
                ${listing.price.toLocaleString()} ₽
            </div>
            <div class="listing-meta" style="margin-bottom: 20px;">
                <span class="listing-server">Сервер ${listing.server}</span>
                <span style="margin-left: 10px;">👁️ ${listing.views} просмотров</span>
            </div>
            <div style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px;">Описание:</h3>
                <p style="color: var(--tg-theme-hint-color, #666); line-height: 1.6;">
                    ${listing.description}
                </p>
            </div>
            <div style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px;">Продавец:</h3>
                <p style="color: var(--tg-theme-button-color, #3498db);">@${listing.seller}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="submit-btn" style="flex: 1;" onclick="contactSeller('${listing.seller}')">
                    Связаться с продавцом
                </button>
                <button class="action-btn" style="flex: 1;" onclick="addToFavorites(${listing.id})">
                    ❤️ В избранное
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Update views
    listing.views++;
}

function contactSeller(sellerUsername) {
    tg.openTelegramLink(`https://t.me/${sellerUsername}`);
}

function addToFavorites(listingId) {
    // Implementation for favorites
    showMessage('Объявление добавлено в избранное!', 'success');
}

// Create form
function setupCreateForm() {
    const createForm = document.getElementById('createForm');
    
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(createForm);
        const newListing = {
            id: Date.now(),
            title: formData.get('title'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            server: formData.get('server'),
            description: formData.get('description'),
            image: categories[formData.get('category')].icon,
            seller: currentUser?.username || 'Unknown',
            created: new Date(),
            views: 0
        };
        
        listings.unshift(newListing);
        
        // Reset form
        createForm.reset();
        
        // Show success message
        showMessage('Объявление успешно создано!', 'success');
        
        // Switch to home section
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-section="home"]').classList.add('active');
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById('home').classList.add('active');
        
        // Reload listings
        loadListings();
    });
}

// Profile
function setupProfile() {
    const myListingsBtn = document.getElementById('myListings');
    const settingsBtn = document.getElementById('settings');
    
    myListingsBtn.addEventListener('click', () => {
        showMyListings();
    });
    
    settingsBtn.addEventListener('click', () => {
        showSettings();
    });
}

function loadProfile() {
    // Get user data from Telegram
    const user = tg.initDataUnsafe?.user;
    
    if (user) {
        currentUser = user;
        
        const profileName = document.querySelector('.profile-name');
        const profileUsername = document.querySelector('.profile-username');
        const profileAvatar = document.querySelector('.profile-avatar');
        
        profileName.textContent = `${user.first_name} ${user.last_name || ''}`.trim();
        profileUsername.textContent = user.username ? `@${user.username}` : `ID: ${user.id}`;
        profileAvatar.textContent = user.first_name.charAt(0);
        
        // Update stats
        updateProfileStats();
    }
}

function updateProfileStats() {
    const userListings = listings.filter(l => l.seller === currentUser?.username);
    const totalViews = userListings.reduce((sum, listing) => sum + listing.views, 0);
    
    document.querySelector('.stat-number:nth-child(1)').textContent = userListings.length;
    document.querySelector('.stat-number:nth-child(2)').textContent = totalViews;
}

function showMyListings() {
    const userListings = listings.filter(l => l.seller === currentUser?.username);
    
    // Switch to home and filter by user
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-section="home"]').classList.add('active');
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById('home').classList.add('active');
    
    // Render user listings
    renderListings(userListings);
}

function showSettings() {
    showMessage('Настройки в разработке', 'info');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Telegram WebApp specific functions
function sendData(data) {
    tg.sendData(JSON.stringify(data));
}

function hapticFeedback() {
    tg.HapticFeedback.impactOccurred('medium');
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
} 