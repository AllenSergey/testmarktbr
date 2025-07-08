// Black Russia Market - Advanced Telegram Mini App
class BlackRussiaMarket {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.initializeTelegram();
        this.initializeData();
        this.setupEventListeners();
        this.initializeApp();
    }

    initializeTelegram() {
        this.tg.ready();
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        // Theme support
        this.applyTheme();
        
        // User data
        this.user = {
            id: this.tg.initDataUnsafe?.user?.id || 123456,
            name: this.tg.initDataUnsafe?.user?.first_name || 'Игрок',
            username: this.tg.initDataUnsafe?.user?.username || 'player123',
            isPremium: this.tg.initDataUnsafe?.user?.is_premium || false,
            language: this.tg.initDataUnsafe?.user?.language_code || 'ru'
        };
        
        // Haptic feedback
        this.haptic = this.tg.HapticFeedback;
        
        // Setup main button
        this.tg.MainButton.text = "Создать объявление";
        this.tg.MainButton.show();
        this.tg.MainButton.onClick(() => this.showCreateSection());
    }

    applyTheme() {
        const theme = this.tg.colorScheme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Apply Telegram theme colors
        if (this.tg.themeParams) {
            const params = this.tg.themeParams;
            const root = document.documentElement;
            
            root.style.setProperty('--tg-bg-color', params.bg_color);
            root.style.setProperty('--tg-text-color', params.text_color);
            root.style.setProperty('--tg-button-color', params.button_color);
            root.style.setProperty('--tg-button-text-color', params.button_text_color);
            root.style.setProperty('--tg-secondary-bg-color', params.secondary_bg_color);
            root.style.setProperty('--tg-hint-color', params.hint_color);
            root.style.setProperty('--tg-link-color', params.link_color);
        }
    }

    initializeData() {
        this.currentListings = [];
        this.currentCategory = '';
        this.currentServer = '';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.favorites = JSON.parse(localStorage.getItem('br-favorites') || '[]');
        this.notifications = JSON.parse(localStorage.getItem('br-notifications') || '[]');
        this.searchHistory = JSON.parse(localStorage.getItem('br-search-history') || '[]');
        this.deals = JSON.parse(localStorage.getItem('br-deals') || '[]');
        
        // Enhanced sample data with realistic Black Russia items
        this.sampleData = {
            weapons: [
                { 
                    id: 1, 
                    title: 'AK-47 Калашников', 
                    price: 2500, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=AK-47',
                    seller: { 
                        name: 'WeaponDealer', 
                        rating: 4.8, 
                        verified: true, 
                        sales: 47,
                        id: 'wd001'
                    },
                    description: 'Мощный автомат Калашникова с высокой точностью стрельбы. Полная модификация, готов к бою.',
                    stats: { damage: 45, range: 85, stability: 70, ammo: 30 },
                    category: 'weapons',
                    featured: true,
                    views: 1247,
                    likes: 89,
                    condition: 'excellent',
                    delivery: 'instant',
                    warranty: true,
                    createdAt: new Date('2024-01-15T10:30:00'),
                    tags: ['автомат', 'пвп', 'модификация']
                },
                { 
                    id: 2, 
                    title: 'AWM Снайперка', 
                    price: 8000, 
                    server: 2, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=AWM',
                    seller: { 
                        name: 'SniperPro', 
                        rating: 4.9, 
                        verified: true, 
                        sales: 23,
                        id: 'sp002'
                    },
                    description: 'Элитная снайперская винтовка для дальних выстрелов. Идеальна для охоты и PvP.',
                    stats: { damage: 90, range: 95, stability: 85, ammo: 5 },
                    category: 'weapons',
                    featured: false,
                    views: 2156,
                    likes: 143,
                    condition: 'new',
                    delivery: 'fast',
                    warranty: true,
                    createdAt: new Date('2024-01-10T14:20:00'),
                    tags: ['снайперка', 'дальний бой', 'охота']
                },
                { 
                    id: 3, 
                    title: 'M4A4 Автомат', 
                    price: 3200, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=M4A4',
                    seller: { 
                        name: 'TacticalGear', 
                        rating: 4.7, 
                        verified: false, 
                        sales: 15,
                        id: 'tg003'
                    },
                    description: 'Надежный автомат с хорошей скорострельностью. Средняя дальность, универсальное оружие.',
                    stats: { damage: 42, range: 80, stability: 75, ammo: 30 },
                    category: 'weapons',
                    featured: false,
                    views: 567,
                    likes: 34,
                    condition: 'good',
                    delivery: 'normal',
                    warranty: false,
                    createdAt: new Date('2024-01-12T16:45:00'),
                    tags: ['автомат', 'универсал', 'средняя дальность']
                }
            ],
            vehicles: [
                { 
                    id: 4, 
                    title: 'BMW M5 F90', 
                    price: 150000, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=BMW+M5',
                    seller: { 
                        name: 'CarDealer', 
                        rating: 4.6, 
                        verified: true, 
                        sales: 89,
                        id: 'cd004'
                    },
                    description: 'Мощный спортивный седан с отличной динамикой. Полный тюнинг, максимальная скорость.',
                    stats: { speed: 320, acceleration: 85, handling: 80, fuel: 60 },
                    category: 'vehicles',
                    featured: true,
                    views: 3421,
                    likes: 256,
                    condition: 'excellent',
                    delivery: 'meeting',
                    warranty: true,
                    createdAt: new Date('2024-01-08T12:00:00'),
                    tags: ['спорт', 'седан', 'тюнинг', 'скорость']
                },
                { 
                    id: 5, 
                    title: 'Mercedes AMG GT', 
                    price: 200000, 
                    server: 2, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Mercedes+AMG',
                    seller: { 
                        name: 'LuxuryCars', 
                        rating: 4.8, 
                        verified: true, 
                        sales: 34,
                        id: 'lc005'
                    },
                    description: 'Элитный спортивный автомобиль премиум-класса. Роскошь и мощность в одном автомобиле.',
                    stats: { speed: 350, acceleration: 90, handling: 85, fuel: 55 },
                    category: 'vehicles',
                    featured: true,
                    views: 2987,
                    likes: 198,
                    condition: 'new',
                    delivery: 'meeting',
                    warranty: true,
                    createdAt: new Date('2024-01-05T09:30:00'),
                    tags: ['премиум', 'спорт', 'люкс', 'мощность']
                },
                { 
                    id: 6, 
                    title: 'Lamborghini Huracan', 
                    price: 350000, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Lamborghini',
                    seller: { 
                        name: 'SupercarDealer', 
                        rating: 4.9, 
                        verified: true, 
                        sales: 12,
                        id: 'sd006'
                    },
                    description: 'Легендарный итальянский суперкар. Невероятная скорость и уникальный дизайн.',
                    stats: { speed: 380, acceleration: 95, handling: 90, fuel: 45 },
                    category: 'vehicles',
                    featured: true,
                    views: 5432,
                    likes: 423,
                    condition: 'excellent',
                    delivery: 'special',
                    warranty: true,
                    createdAt: new Date('2024-01-01T15:15:00'),
                    tags: ['суперкар', 'эксклюзив', 'скорость', 'дизайн']
                }
            ],
            items: [
                { 
                    id: 7, 
                    title: 'Дом на Рублевке', 
                    price: 5000000, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Дом',
                    seller: { 
                        name: 'RealEstate', 
                        rating: 4.9, 
                        verified: true, 
                        sales: 67,
                        id: 're007'
                    },
                    description: 'Элитный дом в престижном районе с полной обстановкой. Максимальная защита и комфорт.',
                    stats: { rooms: 8, garage: 4, security: 95, location: 98 },
                    category: 'items',
                    featured: true,
                    views: 5432,
                    likes: 412,
                    condition: 'excellent',
                    delivery: 'keys',
                    warranty: true,
                    createdAt: new Date('2024-01-01T11:00:00'),
                    tags: ['элитное жилье', 'безопасность', 'комфорт', 'престиж']
                },
                { 
                    id: 8, 
                    title: 'Квартира в центре', 
                    price: 1500000, 
                    server: 2, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Квартира',
                    seller: { 
                        name: 'CityHomes', 
                        rating: 4.5, 
                        verified: true, 
                        sales: 45,
                        id: 'ch008'
                    },
                    description: 'Уютная квартира в центре города. Отличное расположение и развитая инфраструктура.',
                    stats: { rooms: 3, garage: 1, security: 75, location: 90 },
                    category: 'items',
                    featured: false,
                    views: 2156,
                    likes: 87,
                    condition: 'good',
                    delivery: 'keys',
                    warranty: false,
                    createdAt: new Date('2024-01-07T13:30:00'),
                    tags: ['центр', 'комфорт', 'инфраструктура']
                }
            ],
            services: [
                { 
                    id: 9, 
                    title: 'Прокачка персонажа', 
                    price: 5000, 
                    server: 0, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Прокачка',
                    seller: { 
                        name: 'ProGamer', 
                        rating: 4.7, 
                        verified: false, 
                        sales: 156,
                        id: 'pg009'
                    },
                    description: 'Быстрая и безопасная прокачка вашего персонажа. Гарантия результата.',
                    stats: { experience: 1000000, time: 24, safety: 100, efficiency: 95 },
                    category: 'services',
                    featured: false,
                    views: 876,
                    likes: 67,
                    condition: 'service',
                    delivery: 'online',
                    warranty: true,
                    createdAt: new Date('2024-01-14T08:00:00'),
                    tags: ['прокачка', 'быстро', 'безопасно', 'опыт']
                },
                { 
                    id: 10, 
                    title: 'Охрана на час', 
                    price: 800, 
                    server: 0, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Охрана',
                    seller: { 
                        name: 'SecurityTeam', 
                        rating: 4.8, 
                        verified: true, 
                        sales: 234,
                        id: 'st010'
                    },
                    description: 'Профессиональная охрана для ваших дел. Опытные бойцы, полная конфиденциальность.',
                    stats: { fighters: 5, weapons: 100, experience: 90, reliability: 95 },
                    category: 'services',
                    featured: false,
                    views: 1234,
                    likes: 98,
                    condition: 'service',
                    delivery: 'meeting',
                    warranty: true,
                    createdAt: new Date('2024-01-09T19:45:00'),
                    tags: ['охрана', 'защита', 'профессионалы', 'надежность']
                }
            ],
            accounts: [
                { 
                    id: 11, 
                    title: 'Аккаунт 50 LVL', 
                    price: 15000, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Аккаунт',
                    seller: { 
                        name: 'AccountSeller', 
                        rating: 4.5, 
                        verified: true, 
                        sales: 78,
                        id: 'as011'
                    },
                    description: 'Полностью прокачанный аккаунт с хорошими характеристиками. Много денег и имущества.',
                    stats: { level: 50, money: 500000, reputation: 80, skills: 75 },
                    category: 'accounts',
                    featured: false,
                    views: 1234,
                    likes: 89,
                    condition: 'excellent',
                    delivery: 'account',
                    warranty: true,
                    createdAt: new Date('2024-01-11T17:20:00'),
                    tags: ['прокачанный', 'деньги', 'имущество', 'репутация']
                },
                { 
                    id: 12, 
                    title: 'Аккаунт 100 LVL', 
                    price: 30000, 
                    server: 2, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=Аккаунт+100',
                    seller: { 
                        name: 'EliteAccounts', 
                        rating: 4.9, 
                        verified: true, 
                        sales: 23,
                        id: 'ea012'
                    },
                    description: 'Элитный аккаунт максимального уровня. Все навыки прокачаны, огромное состояние.',
                    stats: { level: 100, money: 2000000, reputation: 95, skills: 100 },
                    category: 'accounts',
                    featured: true,
                    views: 3456,
                    likes: 278,
                    condition: 'excellent',
                    delivery: 'account',
                    warranty: true,
                    createdAt: new Date('2024-01-03T20:10:00'),
                    tags: ['элитный', 'максимальный', 'навыки', 'состояние']
                }
            ],
            money: [
                { 
                    id: 13, 
                    title: '1,000,000 BR$', 
                    price: 500, 
                    server: 1, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=1M+BR$',
                    seller: { 
                        name: 'MoneyExchange', 
                        rating: 4.9, 
                        verified: true, 
                        sales: 567,
                        id: 'me013'
                    },
                    description: 'Безопасная покупка внутриигровой валюты. Мгновенная доставка, гарантия качества.',
                    stats: { amount: 1000000, delivery: 5, safety: 100, rate: 0.0005 },
                    category: 'money',
                    featured: true,
                    views: 8765,
                    likes: 654,
                    condition: 'currency',
                    delivery: 'instant',
                    warranty: true,
                    createdAt: new Date('2024-01-13T21:00:00'),
                    tags: ['валюта', 'быстро', 'безопасно', 'выгодно']
                },
                { 
                    id: 14, 
                    title: '5,000,000 BR$', 
                    price: 2000, 
                    server: 2, 
                    image: 'https://via.placeholder.com/300x200/333/fff?text=5M+BR$',
                    seller: { 
                        name: 'CurrencyPro', 
                        rating: 4.8, 
                        verified: true, 
                        sales: 234,
                        id: 'cp014'
                    },
                    description: 'Крупная сумма игровой валюты для серьезных покупок. Лучший курс на рынке.',
                    stats: { amount: 5000000, delivery: 10, safety: 100, rate: 0.0004 },
                    category: 'money',
                    featured: true,
                    views: 5432,
                    likes: 398,
                    condition: 'currency',
                    delivery: 'fast',
                    warranty: true,
                    createdAt: new Date('2024-01-06T18:30:00'),
                    tags: ['крупная сумма', 'выгодный курс', 'надежно']
                }
            ]
        };
        
        // Server data
        this.servers = [
            { id: 1, name: 'Сервер 1', players: 2400, status: 'online', load: 85 },
            { id: 2, name: 'Сервер 2', players: 1800, status: 'online', load: 64 },
            { id: 3, name: 'Сервер 3', players: 0, status: 'maintenance', load: 0 }
        ];
        
        this.loadAllListings();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.hidePreloader();
            this.setupNavigation();
            this.setupFilters();
            this.setupSearch();
            this.setupModals();
            this.setupCategoryCards();
            this.setupNotifications();
            this.setupFavorites();
            this.setupChat();
            this.setupDeals();
            this.setupProfile();
            this.setupViewToggle();
        });
    }

    initializeApp() {
        // Initialize market stats
        this.updateMarketStats();
        
        // Start periodic updates
        setInterval(() => {
            this.updateServerStatus();
            this.updateMarketStats();
        }, 30000);
        
        // Initialize notifications
        this.initializeNotifications();
        
        // Load initial data
        this.loadInitialData();
    }

    loadInitialData() {
        // Load based on URL hash
        const hash = window.location.hash.substring(1);
        if (hash) {
            const btn = document.querySelector(`[data-section="${hash}"]`);
            if (btn) {
                setTimeout(() => btn.click(), 100);
            }
        }
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 1500);
        }
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Haptic feedback
                this.haptic.impactOccurred('light');
                
                // Remove active class from all buttons and sections
                navBtns.forEach(b => b.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Show corresponding section with animation
                const sectionId = btn.dataset.section;
                const section = document.getElementById(sectionId);
                section.classList.add('active');
                
                // Update main button
                this.updateMainButton(sectionId);
                
                // Load specific content
                this.loadSectionContent(sectionId);
                
                // Update URL hash
                window.location.hash = sectionId;
            });
        });
        
        // Handle back button
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const btn = document.querySelector(`[data-section="${hash}"]`);
                if (btn && !btn.classList.contains('active')) {
                    btn.click();
                }
            }
        });
    }

    updateMainButton(sectionId) {
        switch (sectionId) {
            case 'create':
                this.tg.MainButton.text = "Опубликовать объявление";
                this.tg.MainButton.show();
                this.tg.MainButton.onClick(() => this.submitCreateForm());
                break;
            case 'deals':
                this.tg.MainButton.text = "Создать сделку";
                this.tg.MainButton.show();
                this.tg.MainButton.onClick(() => this.showCreateDeal());
                break;
            case 'profile':
                this.tg.MainButton.text = "Редактировать профиль";
                this.tg.MainButton.show();
                this.tg.MainButton.onClick(() => this.showEditProfile());
                break;
            default:
                this.tg.MainButton.text = "Создать объявление";
                this.tg.MainButton.show();
                this.tg.MainButton.onClick(() => this.showCreateSection());
        }
    }

    showCreateSection() {
        const createBtn = document.querySelector('[data-section="create"]');
        if (createBtn) {
            createBtn.click();
        }
    }

    loadSectionContent(sectionId) {
        switch (sectionId) {
            case 'home':
                this.loadAllListings();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'deals':
                this.loadDeals();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'create':
                this.setupCreateForm();
                break;
        }
    }

    // Data loading methods
    loadAllListings() {
        this.currentListings = [];
        Object.values(this.sampleData).forEach(categoryData => {
            this.currentListings = this.currentListings.concat(categoryData);
        });
        
        this.applyFilters();
    }

    applyFilters() {
        let filteredListings = [...this.currentListings];
        
        // Filter by category
        if (this.currentCategory) {
            filteredListings = filteredListings.filter(item => 
                item.category === this.currentCategory
            );
        }
        
        // Filter by server
        if (this.currentServer) {
            filteredListings = filteredListings.filter(item => 
                item.server == this.currentServer || item.server == 0
            );
        }
        
        // Filter by price range
        const minPrice = document.getElementById('minPrice')?.value;
        const maxPrice = document.getElementById('maxPrice')?.value;
        
        if (minPrice) {
            filteredListings = filteredListings.filter(item => 
                item.price >= parseInt(minPrice)
            );
        }
        
        if (maxPrice) {
            filteredListings = filteredListings.filter(item => 
                item.price <= parseInt(maxPrice)
            );
        }
        
        // Filter by seller type
        const sellerFilter = document.getElementById('sellerFilter')?.value;
        if (sellerFilter) {
            switch (sellerFilter) {
                case 'verified':
                    filteredListings = filteredListings.filter(item => item.seller.verified);
                    break;
                case 'premium':
                    filteredListings = filteredListings.filter(item => item.seller.rating >= 4.8);
                    break;
                case 'new':
                    filteredListings = filteredListings.filter(item => item.seller.sales < 10);
                    break;
            }
        }
        
        // Sort listings
        switch (this.currentSort) {
            case 'price-asc':
                filteredListings.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredListings.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filteredListings.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                filteredListings.sort((a, b) => b.seller.rating - a.seller.rating);
                break;
            default:
                filteredListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
        
        this.renderListings(filteredListings);
    }

    renderListings(listings) {
        const listingsContainer = document.getElementById('listings');
        if (!listingsContainer) return;
        
        if (listings.length === 0) {
            listingsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-text">Ничего не найдено</div>
                    <div class="empty-subtext">Попробуйте изменить фильтры поиска</div>
                    <button class="btn-primary" onclick="app.resetFilters()">Сбросить фильтры</button>
                </div>
            `;
            return;
        }
        
        const viewMode = this.currentView;
        const listingCards = listings.map(item => this.createListingCard(item, viewMode));
        
        listingsContainer.className = `listings ${viewMode}-view`;
        listingsContainer.innerHTML = listingCards.join('');
        
        // Add animation
        setTimeout(() => {
            listingsContainer.querySelectorAll('.listing-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }, 100);
    }

    createListingCard(item, viewMode = 'grid') {
        const isFavorite = this.favorites.includes(item.id);
        const conditionClass = this.getConditionClass(item.condition);
        const deliveryIcon = this.getDeliveryIcon(item.delivery);
        const serverInfo = this.getServerInfo(item.server);
        
        if (viewMode === 'list') {
            return `
                <div class="listing-card list-card" data-id="${item.id}" style="opacity: 0; transform: translateY(20px);">
                    <div class="listing-image">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                        ${item.featured ? '<div class="featured-badge">⭐ Топ</div>' : ''}
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="app.toggleFavorite(${item.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="listing-content">
                        <div class="listing-header">
                            <h3 class="listing-title">${item.title}</h3>
                            <div class="listing-price">${this.formatPrice(item.price)}</div>
                        </div>
                        <div class="listing-meta">
                            <div class="listing-server ${serverInfo.class}">${serverInfo.name}</div>
                            <div class="listing-condition ${conditionClass}">${this.getConditionText(item.condition)}</div>
                            <div class="listing-delivery">${deliveryIcon} ${this.getDeliveryText(item.delivery)}</div>
                        </div>
                        <div class="listing-seller">
                            <div class="seller-info">
                                <span class="seller-name">${item.seller.name}</span>
                                ${item.seller.verified ? '<span class="verified-badge">✓</span>' : ''}
                                <span class="seller-rating">⭐ ${item.seller.rating}</span>
                            </div>
                        </div>
                        <div class="listing-stats">
                            <span class="stat-item">👁 ${item.views}</span>
                            <span class="stat-item">❤️ ${item.likes}</span>
                            <span class="stat-item">📅 ${this.formatDate(item.createdAt)}</span>
                        </div>
                    </div>
                    <div class="listing-actions">
                        <button class="btn-primary" onclick="app.showListingDetails(${item.id})">Подробнее</button>
                        <button class="btn-secondary" onclick="app.contactSeller('${item.seller.id}')">Написать</button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="listing-card grid-card" data-id="${item.id}" style="opacity: 0; transform: translateY(20px);">
                <div class="listing-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    ${item.featured ? '<div class="featured-badge">⭐ Топ</div>' : ''}
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="app.toggleFavorite(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="listing-content">
                    <h3 class="listing-title">${item.title}</h3>
                    <div class="listing-price">${this.formatPrice(item.price)}</div>
                    <div class="listing-meta">
                        <div class="listing-server ${serverInfo.class}">${serverInfo.name}</div>
                        <div class="listing-condition ${conditionClass}">${this.getConditionText(item.condition)}</div>
                    </div>
                    <div class="listing-seller">
                        <span class="seller-name">${item.seller.name}</span>
                        ${item.seller.verified ? '<span class="verified-badge">✓</span>' : ''}
                        <span class="seller-rating">⭐ ${item.seller.rating}</span>
                    </div>
                    <div class="listing-stats">
                        <span class="stat-item">👁 ${item.views}</span>
                        <span class="stat-item">❤️ ${item.likes}</span>
                    </div>
                    <div class="listing-actions">
                        <button class="btn-primary" onclick="app.showListingDetails(${item.id})">Купить</button>
                        <button class="btn-secondary" onclick="app.contactSeller('${item.seller.id}')">💬</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Continue with more methods...
    setupFilters() {
        const serverFilter = document.getElementById('serverFilter');
        const sortFilter = document.getElementById('sortFilter');
        const sellerFilter = document.getElementById('sellerFilter');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const resetBtn = document.getElementById('resetFilters');
        
        [serverFilter, sortFilter, sellerFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', (e) => {
                    if (filter.id === 'serverFilter') {
                        this.currentServer = e.target.value;
                    } else if (filter.id === 'sortFilter') {
                        this.currentSort = e.target.value;
                    }
                    this.applyFilters();
                });
            }
        });
        
        [minPrice, maxPrice].forEach(input => {
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.applyFilters();
                }, 500));
            }
        });
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchClear = document.getElementById('searchClear');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.trim();
                this.searchListings(query);
                
                if (searchClear) {
                    searchClear.classList.toggle('visible', query.length > 0);
                }
            }, 300));
        }
        
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.classList.remove('visible');
                this.searchListings('');
            });
        }
    }

    searchListings(query) {
        if (!query) {
            this.loadAllListings();
            return;
        }
        
        const searchResults = this.currentListings.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.seller.name.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.renderListings(searchResults);
        
        // Save search history
        this.saveSearchHistory(query);
    }

    saveSearchHistory(query) {
        if (query.length < 2) return;
        
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.searchHistory.unshift(query);
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        localStorage.setItem('br-search-history', JSON.stringify(this.searchHistory));
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }

    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) return `${minutes} мин. назад`;
        if (hours < 24) return `${hours} ч. назад`;
        if (days < 7) return `${days} дн. назад`;
        
        return date.toLocaleDateString('ru-RU');
    }

    getConditionClass(condition) {
        const classes = {
            'new': 'condition-new',
            'excellent': 'condition-excellent',
            'good': 'condition-good',
            'fair': 'condition-fair',
            'service': 'condition-service',
            'currency': 'condition-currency'
        };
        return classes[condition] || 'condition-good';
    }

    getConditionText(condition) {
        const texts = {
            'new': 'Новое',
            'excellent': 'Отличное',
            'good': 'Хорошее',
            'fair': 'Удовлетворительное',
            'service': 'Услуга',
            'currency': 'Валюта'
        };
        return texts[condition] || 'Хорошее';
    }

    getDeliveryIcon(delivery) {
        const icons = {
            'instant': '⚡',
            'fast': '🚀',
            'normal': '📦',
            'meeting': '🤝',
            'keys': '🔑',
            'account': '👤',
            'online': '🌐',
            'special': '⭐'
        };
        return icons[delivery] || '📦';
    }

    getDeliveryText(delivery) {
        const texts = {
            'instant': 'Мгновенно',
            'fast': 'Быстро',
            'normal': 'Обычно',
            'meeting': 'Встреча',
            'keys': 'Ключи',
            'account': 'Аккаунт',
            'online': 'Онлайн',
            'special': 'Особая'
        };
        return texts[delivery] || 'Обычно';
    }

    getServerInfo(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) {
            return { name: 'Все сервера', class: 'server-all' };
        }
        
        return {
            name: server.name,
            class: `server-${server.status}`
        };
    }

    // More methods will be added in the following parts...
}

// Initialize the application
const app = new BlackRussiaMarket(); 