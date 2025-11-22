// Product detail logic — uses shared `productData` from `CategoryPage.js`.
// This file expects `assets/js/CategoryPage.js` to be included before it.

// Get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
}

// Get product by name from shared productData
function getProduct(productName) {
    const decodedName = decodeURIComponent(productName);

    if (typeof productData === 'undefined') return null;

    for (const category in productData) {
        const products = productData[category];
        for (const product of products) {
            if (product.name === decodedName) {
                return product;
            }
        }
    }

    return null;
}

// Normalize product name into a slug-like filename (remove diacritics and spaces)
function slugFileName(name) {
    return name.normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9_.-]/g, '');
}

// Try to find an HSVM image by slug and supported extensions
function findHsImageForProduct(productName, callback) {
    const slug = slugFileName(productName);
    const hsFolder = 'assets/images/List_Image_HSVM/';
    const exts = ['png', 'jpg', 'jpeg', 'webp'];

    (function tryExt(i) {
        if (i >= exts.length) {
            callback(null);
            return;
        }
        const candidate = hsFolder + slug + '.' + exts[i];
        const probe = new Image();
        probe.onload = function() { callback(candidate); };
        probe.onerror = function() { tryExt(i + 1); };
        probe.src = candidate;
    })(0);
}

// Load and display product details
function loadProductDetails() {
    const productId = getQueryParam('id');

    if (!productId) {
        document.getElementById('product-name').innerHTML = '<div class="alert alert-danger">Sản phẩm không được tìm thấy</div>';
        return;
    }

    const product = getProduct(productId);
    if (!product) {
        document.getElementById('product-name').innerHTML = '<div class="alert alert-danger">Sản phẩm không được tìm thấy</div>';
        return;
    }

    document.title = product.name;

    const mainImageEl = document.getElementById('main-image');

    // Prefer HSVM image when available
    findHsImageForProduct(product.name, function(found) {
        const useSrc = found || product.image || '';
        if (mainImageEl) {
            mainImageEl.src = useSrc;
            mainImageEl.alt = product.name;
        }
        // update product.image for cart/wishlist usage
        product.image = useSrc;

        // Update thumbnail gallery (replace existing thumbnails with same image if no separate images available)
        const thumbnails = document.querySelectorAll('.thumbnail img');
        thumbnails.forEach(img => {
            img.src = useSrc;
            img.alt = product.name;
        });
    });

    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = product.price.toLocaleString('vi-VN') + '₫';
    document.getElementById('product-description').textContent = product.description || '';

    const qtyInput = document.getElementById('quantity-input');
    if (qtyInput) qtyInput.value = 1;
}

// Change main image when thumbnail is clicked
function changeMainImage(thumbnailElement) {
    const img = thumbnailElement.querySelector('img');
    if (!img) return;
    const imageSrc = img.src;
    const mainImage = document.getElementById('main-image');
    if (mainImage) mainImage.src = imageSrc;

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
    thumbnailElement.classList.add('active');
}

// Quantity controls
function increaseQuantity() {
    const input = document.getElementById('quantity-input');
    if (input) input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantity-input');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Cart / wishlist actions
function addToCart() {
    const productId = getQueryParam('id');
    const quantityEl = document.getElementById('quantity-input');
    const quantity = quantityEl ? parseInt(quantityEl.value) : 1;

    if (!productId || quantity < 1) {
        alert('Vui lòng chọn số lượng hợp lệ');
        return;
    }

    const product = getProduct(productId);
    if (!product) {
        alert('Sản phẩm không được tìm thấy');
        return;
    }

    // Allow guests to add to cart locally; they will be prompted to login at checkout.

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name: product.name, price: product.price, image: product.image, quantity: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Debug log to help diagnose missing items
    try{ console.debug('cart after add:', JSON.parse(localStorage.getItem('cart')||'[]')); }catch(e){ console.error(e); }

    // Ensure cart panel exists before rendering (create if necessary)
    try{ if(window.ensureCartPanel) window.ensureCartPanel(); }catch(e){ console.warn('ensureCartPanel failed', e); }

    // Update UI: render and update count synchronously so user sees change immediately
    try{ if(window.renderCart) window.renderCart(); }catch(err){ console.warn('renderCart failed:', err); }
    try{ if(window.updateCartCount) window.updateCartCount(); }catch(err){ console.warn('updateCartCount failed:', err); }

    // Dispatch a cross-script event so other loaders (if not yet initialized) will re-render
    try{
        if(window && window.dispatchEvent){
            var ev = new CustomEvent('cartUpdated', { detail: cart });
            window.dispatchEvent(ev);
        }
    }catch(e){ console.warn('dispatch cartUpdated failed', e); }

    // Show success toast centered-top
    showCartToast('Đã thêm vào giỏ hàng!');

    // Open cart drawer so user sees the item immediately
    try{ if(window.openCartPanel) window.openCartPanel(); }catch(err){ console.warn('openCartPanel failed', err); }

    // If the cart UI wasn't ready at the moment (some pages load components slightly later),
    // try again shortly to ensure the drawer opens with fresh data.
    setTimeout(function(){
        try{ if(window.ensureCartPanel) window.ensureCartPanel(); }catch(e){}
        try{ if(window.renderCart) window.renderCart(); }catch(e){}
        try{ if(window.updateCartCount) window.updateCartCount(); }catch(e){}
        try{ if(window.openCartPanel) window.openCartPanel(); }catch(e){}
    }, 180);
}

// Small toast helper (inserts into body)
function showCartToast(message){
    var id = 'cart-toast';
    var existing = document.getElementById(id);
    if(existing) existing.remove();
    var div = document.createElement('div');
    div.id = id;
    div.style.position = 'fixed';
    div.style.left = '50%';
    div.style.top = '24px';
    div.style.transform = 'translateX(-50%)';
    div.style.background = '#6cb03f';
    div.style.color = '#fff';
    div.style.padding = '12px 18px';
    div.style.borderRadius = '6px';
    div.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
    div.style.zIndex = '10010';
    div.style.maxWidth = '90%';
    div.style.textAlign = 'center';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(function(){ div.style.transition='opacity 0.4s'; div.style.opacity='0'; setTimeout(function(){ div.remove(); },400); }, 1800);
}

function addToWishlist() {
    const productId = getQueryParam('id');
    if (!productId) { alert('Sản phẩm không được tìm thấy'); return; }
    const product = getProduct(productId);
    if (!product) { alert('Sản phẩm không được tìm thấy'); return; }

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.find(item => item.name === product.name)) {
        wishlist.push({ name: product.name, price: product.price, image: product.image });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Đã thêm vào danh sách yêu thích!');
    } else {
        alert('Sản phẩm đã có trong danh sách yêu thích!');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
});
// Duplicate product data and redundant functions removed.
// productData is provided by `assets/js/CategoryPage.js` and shared across pages.

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
});
