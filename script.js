// Buy the Way - Advanced JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION FUNCTIONALITY =====
    
    // Mobile menu toggle
    function toggleMenu() {
        const sideMenu = document.getElementById('sideMenu');
        const currentLeft = sideMenu.style.left;
        sideMenu.style.left = currentLeft === '0px' ? '-250px' : '0px';
        
        // Add overlay when menu is open
        if (currentLeft !== '0px') {
            createOverlay();
        } else {
            removeOverlay();
        }
    }
    
    // Create overlay for mobile menu
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        // Fade in overlay
        setTimeout(() => overlay.style.opacity = '1', 10);
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', toggleMenu);
    }
    
    // Remove overlay
    function removeOverlay() {
        const overlay = document.getElementById('menu-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }
    
    // Make toggleMenu globally accessible
    window.toggleMenu = toggleMenu;
    
    // ===== SEARCH FUNCTIONALITY =====
    
    const searchForm = document.querySelector('.search-container form');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    // Enhanced search with suggestions
    const searchSuggestions = [
        'Running Shoes', 'Basketball Shoes', 'Casual Sneakers', 
        'Sports Footwear', 'Nike', 'Adidas', 'Athletic Shoes',
        'Outdoor Boots', 'Training Shoes', 'Lifestyle Sneakers'
    ];
    
    // Create search suggestions dropdown
    function createSearchSuggestions() {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 20px 20px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(suggestionsContainer);
        
        return suggestionsContainer;
    }
    
    const suggestionsContainer = createSearchSuggestions();
    
    // Show search suggestions
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const filteredSuggestions = searchSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(query)
        );
        
        if (filteredSuggestions.length > 0) {
            suggestionsContainer.innerHTML = filteredSuggestions
                .map(suggestion => `
                    <div class="suggestion-item" style="
                        padding: 12px 20px;
                        cursor: pointer;
                        border-bottom: 1px solid #eee;
                        transition: background-color 0.2s ease;
                    " onmouseover="this.style.backgroundColor='#f5f5f5'" 
                       onmouseout="this.style.backgroundColor='white'">
                        ${suggestion}
                    </div>
                `).join('');
            
            suggestionsContainer.style.display = 'block';
            
            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    searchInput.value = this.textContent.trim();
                    suggestionsContainer.style.display = 'none';
                    performSearch(this.textContent.trim());
                });
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    // Perform search function
    function performSearch(query) {
        // Add loading state to search button
        const originalText = searchButton.textContent;
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;
        
        // Simulate search delay
        setTimeout(() => {
            // Filter products based on search query
            filterProducts(query);
            
            // Reset search button
            searchButton.textContent = originalText;
            searchButton.disabled = false;
            
            // Show search results notification
            showNotification(`Showing results for "${query}"`);
            
            // Scroll to products section
            document.querySelector('.product-slider').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 1000);
    }
    
    // ===== PRODUCT FUNCTIONALITY =====
    
    // Enhanced product card interactions
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Add product data
        const productData = {
            id: index + 1,
            name: card.querySelector('h3').textContent,
            price: card.querySelector('p').textContent,
            image: card.querySelector('img').src,
            inCart: false,
            quantity: 0
        };
        
        card.dataset.productId = productData.id;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.1)';
        });
        
        // Buy Now button functionality
        const buyButton = card.querySelector('button');
        buyButton.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(productData);
            animateAddToCart(this);
        });
        
        // Add quick view functionality
        card.addEventListener('click', function(e) {
            if (!e.target.matches('button')) {
                showQuickView(productData);
            }
        });
    });
    
    // Shopping cart functionality
    let cart = JSON.parse(localStorage.getItem('buyTheWayCart')) || [];
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1, inCart: true });
        }
        
        localStorage.setItem('buyTheWayCart', JSON.stringify(cart));
        updateCartUI();
        showNotification(`${product.name} added to cart!`);
    }
    
    function updateCartUI() {
        const cartButton = document.querySelector('.b');
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount > 0) {
            cartButton.innerHTML = `Cart (${cartCount})`;
            cartButton.style.background = 'linear-gradient(135deg, #8b5cf6, #06b6d4)';
            cartButton.style.color = 'white';
            cartButton.style.border = 'none';
        } else {
            cartButton.innerHTML = 'Cart';
            cartButton.style.background = 'transparent';
            cartButton.style.color = 'white';
            cartButton.style.border = '1px solid white';
        }
    }
    
    // Animate add to cart
    function animateAddToCart(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#10b981';
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#222';
            button.style.transform = 'scale(1)';
        }, 1500);
    }
    
    // Quick view modal
    function showQuickView(product) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="quick-view-content" style="
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            ">
                <button class="close-modal" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
                
                <img src="${product.image}" alt="${product.name}" style="
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                    border-radius: 15px;
                    margin-bottom: 1rem;
                ">
                
                <h2 style="color: #333; margin-bottom: 0.5rem;">${product.name}</h2>
                <p style="color: #8b5cf6; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${product.price}</p>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #333; margin-bottom: 0.5rem;">Product Features:</h4>
                    <ul style="color: #666; line-height: 1.6;">
                        <li>Premium quality materials</li>
                        <li>Comfortable all-day wear</li>
                        <li>Durable construction</li>
                        <li>Stylish modern design</li>
                        <li>Available in multiple sizes</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button class="add-to-cart-modal" style="
                        flex: 1;
                        padding: 1rem;
                        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    ">Add to Cart</button>
                    
                    <button class="buy-now-modal" style="
                        flex: 1;
                        padding: 1rem;
                        background: #222;
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    ">Buy Now</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.quick-view-content').style.transform = 'scale(1)';
        }, 10);
        
        // Close modal functionality
        function closeModal() {
            modal.style.opacity = '0';
            modal.querySelector('.quick-view-content').style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        }
        
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        // Modal button functionality
        modal.querySelector('.add-to-cart-modal').addEventListener('click', function() {
            addToCart(product);
            closeModal();
        });
        
        modal.querySelector('.buy-now-modal').addEventListener('click', function() {
            addToCart(product);
            showCheckout();
            closeModal();
        });
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Restore body scroll when modal closes
        modal.addEventListener('transitionend', function() {
            if (modal.style.opacity === '0') {
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Filter products based on search
    function filterProducts(query) {
        const products = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productDescription = product.querySelector('.card-back p').textContent.toLowerCase();
            
            if (productName.includes(query.toLowerCase()) || 
                productDescription.includes(query.toLowerCase())) {
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.5s ease forwards';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        if (visibleCount === 0) {
            showNoResultsMessage(query);
        } else {
            removeNoResultsMessage();
        }
    }
    
    function showNoResultsMessage(query) {
        removeNoResultsMessage();
        
        const noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 1.1rem;
        `;
        noResults.innerHTML = `
            <h3>No products found for "${query}"</h3>
            <p>Try searching for different keywords or browse our full collection.</p>
            <button onclick="clearSearch()" style="
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #8b5cf6;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Show All Products</button>
        `;
        
        document.querySelector('.product-slider').appendChild(noResults);
    }
    
    function removeNoResultsMessage() {
        const noResults = document.getElementById('no-results');
        if (noResults) noResults.remove();
    }
    
    // Clear search function
    window.clearSearch = function() {
        searchInput.value = '';
        document.querySelectorAll('.product-card').forEach(product => {
            product.style.display = 'block';
        });
        removeNoResultsMessage();
    };
    
    // ===== HEADER BUTTONS FUNCTIONALITY =====
    
    // Buy Now button (main header)
    document.querySelector('.a').addEventListener('click', function() {
        if (cart.length > 0) {
            showCheckout();
        } else {
            showNotification('Your cart is empty. Add some products first!');
            document.querySelector('.product-slider').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
    
    // Cart button (main header)
    document.querySelector('.b').addEventListener('click', function() {
        showCartModal();
    });
    
    // Show cart modal
    function showCartModal() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const cartItems = cart.map(item => `
            <div class="cart-item" style="
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #eee;
                gap: 1rem;
            ">
                <img src="${item.image}" alt="${item.name}" style="
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                ">
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: #333;">${item.name}</h4>
                    <p style="margin: 0; color: #666;">${item.price}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="
                        width: 30px;
                        height: 30px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                    ">-</button>
                    <span style="min-width: 20px; text-align: center; color: #333;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="
                        width: 30px;
                        height: 30px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                    ">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" style="
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 0.5rem;
                    border-radius: 5px;
                    cursor: pointer;
                ">Remove</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        modal.innerHTML = `
            <div class="cart-content" style="
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: #333; margin: 0;">Shopping Cart</h2>
                    <button class="close-cart" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                
                <div class="cart-items">
                    ${cartItems}
                </div>
                
                <div style="
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 2px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="color: #333; margin: 0;">Total: $${total.toFixed(2)}</h3>
                    <button onclick="proceedToCheckout()" style="
                        padding: 1rem 2rem;
                        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Checkout</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => modal.style.opacity = '1', 10);
        
        modal.querySelector('.close-cart').addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }
    
    // Cart management functions
    window.updateQuantity = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                localStorage.setItem('buyTheWayCart', JSON.stringify(cart));
                updateCartUI();
                // Refresh cart modal if open
                const cartModal = document.querySelector('.cart-modal');
                if (cartModal) {
                    cartModal.remove();
                    showCartModal();
                }
            }
        }
    };
    
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('buyTheWayCart', JSON.stringify(cart));
        updateCartUI();
        
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
            if (cart.length === 0) {
                cartModal.remove();
                showNotification('Cart is now empty');
            } else {
                cartModal.remove();
                showCartModal();
            }
        }
    };
    
    window.proceedToCheckout = function() {
        document.querySelector('.cart-modal').remove();
        showCheckout();
    };
    
    // Checkout functionality
    function showCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        modal.innerHTML = `
            <div class="checkout-content" style="
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: #333; margin: 0;">Checkout</h2>
                    <button class="close-checkout" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                
                <form class="checkout-form">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">Full Name</label>
                        <input type="text" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">Email</label>
                        <input type="email" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">Phone</label>
                        <input type="tel" required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 600;">Address</label>
                        <textarea required style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                            min-height: 80px;
                            resize: vertical;
                        "></textarea>
                    </div>
                    
                    <div style="
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 8px;
                        margin-bottom: 1.5rem;
                    ">
                        <h4 style="color: #333; margin: 0 0 0.5rem 0;">Order Summary</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #666;">Items (${cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                            <span style="color: #333;">$${total.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #666;">Shipping</span>
                            <span style="color: #333;">Free</span>
                        </div>
                        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #ddd;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span style="color: #333;">Total</span>
                            <span style="color: #333;">$${total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button type="submit" style="
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    ">Place Order</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.style.opacity = '1', 10);
        
        // Close functionality
        modal.querySelector('.close-checkout').addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Form submission
        modal.querySelector('.checkout-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate order processing
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Clear cart
                cart = [];
                localStorage.removeItem('buyTheWayCart');
                updateCartUI();
                
                // Close modal
                modal.remove();
                
                // Show success message
                showOrderSuccess();
            }, 2000);
        });
    }
    
    function showOrderSuccess() {
        const successModal = document.createElement('div');
        successModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        successModal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 3rem;
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #10b981, #06b6d4);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    color: white;
                    font-size: 2rem;
                ">✓</div>
                
                <h2 style="color: #333; margin-bottom: 1rem;">Order Placed Successfully!</h2>
                <p style="color: #666; margin-bottom: 2rem;">
                    Thank you for your purchase. You will receive a confirmation email shortly.
                </p>
                
                <button onclick="this.closest('div').parentElement.remove()" style="
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                ">Continue Shopping</button>
            </div>
        `;
        
        document.body.appendChild(successModal);
    }
    
    // ===== NOTIFICATION SYSTEM =====
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8b5cf6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ===== SCROLL ANIMATIONS =====
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const bgimg = document.querySelector('.bgimg');
        if (bgimg) {
            bgimg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature, .offer, .product-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== FORM ENHANCEMENTS =====
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            }
        });
    }
    
    // ===== KEYBOARD NAVIGATION =====
    
    document.addEventListener('keydown', function(e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.quick-view-modal, .cart-modal, .checkout-modal');
            modals.forEach(modal => modal.remove());
            
            // Close mobile menu
            const sideMenu = document.getElementById('sideMenu');
            if (sideMenu.style.left === '0px') {
                toggleMenu();
            }
        }
        
        // Search with Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // ===== INITIALIZATION =====
    
    // Initialize cart UI
    updateCartUI();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-card {
            transition: all 0.3s ease;
        }
        
        .search-suggestions {
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification {
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Performance optimization
    let ticking = false;
    
    function updateOnScroll() {
        // Throttled scroll updates
        if (!ticking) {
            requestAnimationFrame(function() {
                // Scroll-based updates here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
    
    console.log('Buy the Way - Advanced functionality loaded successfully! 🚀');
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Local storage helpers
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};
