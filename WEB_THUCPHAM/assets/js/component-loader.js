// Component Loader - Load header, footer, and modals from separate files
function loadComponents() {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = html;
                // After inserting header, ensure auth area reflects current user (if any)
                updateAuthUI();
                initializeHeader();
                try{ if(window.ensureChatWidget) window.ensureChatWidget(); }catch(e){}
            }
        })
        .catch(error => console.warn('Could not load header component:', error));

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(error => console.warn('Could not load footer component:', error));

    // Load modals
    fetch('components/modals.html')
        .then(response => response.text())
        .then(html => {
            const modalsContainer = document.getElementById('modals-container');
            if (modalsContainer) {
                // If a user is already logged in, do not inject login/register modals
                try{
                    var current = JSON.parse(localStorage.getItem('currentUser')||'null');
                    if(current){
                        modalsContainer.innerHTML = ''; // keep modals out for logged-in users
                    } else {
                        modalsContainer.innerHTML = html;
                        initializeModals();
                    }
                }catch(e){
                    modalsContainer.innerHTML = html;
                    initializeModals();
                }
            }
        })
        .catch(error => console.warn('Could not load modals component:', error));
}

// Update the header auth area for logged-in users across all pages
function updateAuthUI(){
    try{
        var current = JSON.parse(localStorage.getItem('currentUser')||'null');
        if(!current) return;
        // Wait for header to be present
        var authEl = document.querySelector('.auth_input');
        if(!authEl) return;
        var name = current.username || current.phoneOrEmail || 'Khách hàng';
        var avatar = current.avatar || './assets/images/img_Logo.png';
        authEl.innerHTML = '';

        // Container for avatar + dropdown
        var container = document.createElement('div');
        container.className = 'auth-dropdown';
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.style.cursor = 'pointer';

        var img = document.createElement('img');
        img.src = avatar;
        img.alt = 'avatar';
        img.style.width = '36px'; img.style.height = '36px'; img.style.borderRadius = '50%'; img.style.marginRight = '8px';
        img.style.verticalAlign = 'middle';

        var span = document.createElement('span');
        span.textContent = name;
        span.style.fontWeight = '600';
        span.style.color = '#2b2b2b';
        span.style.verticalAlign = 'middle';

        // Dropdown menu
        var menu = document.createElement('div');
        menu.className = 'auth-menu';
        menu.style.position = 'absolute';
        menu.style.top = 'calc(100% + 8px)';
        menu.style.right = '0';
        menu.style.minWidth = '160px';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #eee';
        menu.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
        menu.style.borderRadius = '6px';
        menu.style.padding = '8px 0';
        menu.style.display = 'none';
        menu.style.zIndex = '10001';

        var items = [
            { text: 'Tài khoản', href: 'account.html' },
            { text: 'Địa chỉ', href: 'addresses.html' },
            { text: 'Đơn hàng', href: 'orders.html' }
        ];

        items.forEach(function(it){
            var a = document.createElement('a');
            a.href = it.href;
            a.textContent = it.text;
            a.style.display = 'block';
            a.style.padding = '10px 14px';
            a.style.color = '#333';
            a.style.textDecoration = 'none';
            a.addEventListener('mouseover', function(){ a.style.background = '#f6f6f6'; });
            a.addEventListener('mouseout', function(){ a.style.background = 'transparent'; });
            menu.appendChild(a);
        });

        // Logout link
        var logout = document.createElement('a');
        logout.href = '#';
        logout.textContent = 'Đăng xuất';
        logout.style.display = 'block';
        logout.style.padding = '10px 14px';
        logout.style.color = '#b33';
        logout.style.textDecoration = 'none';
        logout.addEventListener('click', function(e){ e.preventDefault(); localStorage.removeItem('currentUser'); window.location.href = 'HomePage.html'; });
        menu.appendChild(logout);

        container.appendChild(img);
        container.appendChild(span);
        container.appendChild(menu);
        authEl.appendChild(container);

        // Toggle menu on click
        // Toggle menu on click and support keyboard activation
        container.setAttribute('tabindex', '0');
        container.addEventListener('click', function(e){
            e.stopPropagation();
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        });
        container.addEventListener('keydown', function(e){
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                e.stopPropagation();
                menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
            }
        });

        // Close menu when clicking outside — install a single global listener once
        if(!window._authMenuCloseListenerAdded){
            window.addEventListener('click', function(evt){
                // hide all auth-menu elements when clicking outside
                var openMenus = document.querySelectorAll('.auth-menu');
                openMenus.forEach(function(m){ if(m) m.style.display = 'none'; });
            });
            window._authMenuCloseListenerAdded = true;
        }
    }catch(e){ /* ignore */ }
}

// CART PANEL: markup, rendering and open/close helpers
function ensureCartPanel(){
    // If cart panel already present, return
    if(document.getElementById('cart-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'cart-panel';
    panel.innerHTML = `
        <div class="cart-overlay" id="cartOverlay" style="display:none"></div>
        <div class="cart-drawer" id="cartDrawer" style="right:-420px;">
            <div class="cart-header" style="background:#fff;padding:20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
                <h4 style="margin:0;color:#2b2b2b">GIỎ HÀNG</h4>
                <button id="closeCartBtn" style="background:transparent;border:none;font-size:22px;">&times;</button>
            </div>
            <div class="cart-body" id="cartBody" style="padding:20px;background:#fff;min-height:200px;">
                <!-- items injected here -->
            </div>
            <div class="cart-footer" style="padding:20px;background:#fff;border-top:1px solid #eee;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <strong>Tổng số phụ:</strong>
                    <strong id="cartTotal">0₫</strong>
                </div>
                <button id="viewCartBtn" class="btn" style="width:100%;background:#7a2d1d;color:#fff;border:none;padding:12px;border-radius:6px;margin-bottom:8px;">XEM GIỎ HÀNG</button>
                <button id="checkoutBtn" class="btn" style="width:100%;background:#6cb03f;color:#fff;border:none;padding:12px;border-radius:6px;">THANH TOÁN</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    console.debug('ensureCartPanel: panel appended');

    // Styles for overlay and drawer (kept minimal)
    var style = document.createElement('style');
    style.innerHTML = `
        #cart-panel .cart-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998}
        /* drawer is full viewport height and scrollable vertically */
        #cart-panel .cart-drawer{position:fixed;top:0;right:0;width:420px;height:100vh;z-index:9999;box-shadow:-8px 0 24px rgba(0,0,0,0.2);transition:right 0.28s ease;display:flex;flex-direction:column}
        #cart-panel .cart-body{overflow-y:auto;flex:1;padding-right:12px}
        #cart-panel .cart-item{display:flex;gap:12px;align-items:center;margin-bottom:12px}
        #cart-panel .cart-item img{width:64px;height:64px;object-fit:cover;border-radius:6px}
        #cart-panel .cart-item .item-info{flex:1}
        #cart-panel .cart-item .item-remove{cursor:pointer;color:#999}
    `;
    document.head.appendChild(style);
    console.debug('ensureCartPanel: styles injected');

    // Bind close button
    document.getElementById('closeCartBtn').addEventListener('click', closeCartPanel);
    document.getElementById('cartOverlay').addEventListener('click', closeCartPanel);

    document.getElementById('viewCartBtn').addEventListener('click', function(){
        // For now, simply close drawer (placeholder)
        closeCartPanel();
        window.location.href = 'ProductDetail.html';
    });
}

function openCartPanel(){
    ensureCartPanel();
    var current = JSON.parse(localStorage.getItem('currentUser')||'null');
    // If user is not logged in, do not open the cart drawer. Prompt to login instead.
    if(!current){
        try{
            var loginModal = document.getElementById('loginModal');
            if(loginModal){
                // open login modal (component modals use simple show/display logic)
                loginModal.style.display = 'block';
                loginModal.classList.add('show');
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = scrollbarWidth + 'px';
            } else {
                alert('Vui lòng đăng nhập để xem giỏ hàng.');
            }
        }catch(e){ alert('Vui lòng đăng nhập để xem giỏ hàng.'); }
        return;
    }
    // Allow opening cart for guests as well — they can add/view items locally.
    var overlay = document.getElementById('cartOverlay');
    var drawer = document.getElementById('cartDrawer');
    console.debug('openCartPanel: overlay=', !!overlay, 'drawer=', !!drawer);
    if(overlay) overlay.style.display = 'block';
    if(drawer) drawer.style.right = '0';
    renderCart();
    try{ _debugCartState('openCartPanel after render'); }catch(e){}
    // If guest, show small notice in drawer header/body
    try{
        var notice = document.getElementById('cartGuestNotice');
        if(!current){
            if(!notice){
                var body = document.getElementById('cartBody');
                var n = document.createElement('div');
                n.id = 'cartGuestNotice';
                n.style.padding = '8px 12px';
                n.style.background = '#fff7e6';
                n.style.border = '1px solid #ffe3b8';
                n.style.marginBottom = '12px';
                n.style.color = '#7a4d00';
                n.textContent = 'Bạn chưa đăng nhập — giỏ hàng sẽ được lưu tạm trên thiết bị.';
                if(body) body.insertBefore(n, body.firstChild);
                console.debug('openCartPanel: inserted guest notice');
            }
        } else {
            if(notice) notice.remove();
        }
    }catch(e){/*ignore*/}
}

function closeCartPanel(){
    var overlay = document.getElementById('cartOverlay');
    var drawer = document.getElementById('cartDrawer');
    if(overlay) overlay.style.display = 'none';
    if(drawer) drawer.style.right = '-420px';
}

function renderCart(){
    ensureCartPanel();
    var cart = JSON.parse(localStorage.getItem('cart')||'[]');
    var body = document.getElementById('cartBody');
    console.debug('renderCart: cart length=', cart.length, 'body=', !!body);
    console.debug('renderCart: cart contents=', cart);
    // Visual aid for debugging: add temporary border so it's obvious where cart-body is
    try{ if(body) body.style.outline = '1px dashed rgba(0,0,0,0.06)'; }catch(e){}
    var totalEl = document.getElementById('cartTotal');
    if(body) body.innerHTML = '';
    var total = 0;
    if(cart.length === 0){
        if(body) body.innerHTML = '<p style="color:#333;margin:0">Giỏ hàng trống</p>';
        console.debug('renderCart: cart is empty — wrote fallback message into body');
        if(totalEl) totalEl.textContent = '0₫';
        updateCartCount();
        return;
    }

    cart.forEach(function(item, idx){
        var itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        var img = document.createElement('img'); img.src = item.image || './assets/images/img_Logo.png';
        var info = document.createElement('div'); info.className = 'item-info';
        info.innerHTML = '<div style="font-weight:600;color:#2b2b2b">'+ escapeHtml(item.name) +'</div>' +
            '<div style="color:#6b6b6b">'+ item.quantity + ' × ' + item.price.toLocaleString('vi-VN') + '₫</div>';
        var remove = document.createElement('div'); remove.className = 'item-remove'; remove.innerHTML = '&#10005;';
        remove.addEventListener('click', function(){ removeCartItem(idx); });

        itemEl.appendChild(img); itemEl.appendChild(info); itemEl.appendChild(remove);
        body.appendChild(itemEl);

        total += item.price * item.quantity;
    });
    if(totalEl) totalEl.textContent = total.toLocaleString('vi-VN') + '₫';
    updateCartCount();
    // ensure body scrolls to top to show newest items
    try{ if(body) body.scrollTop = 0; }catch(e){}
}

// Extra diagnostics helper: log detailed cart and DOM status
function _debugCartState(tag){
    try{
        var cart = JSON.parse(localStorage.getItem('cart')||'[]');
        var body = document.getElementById('cartBody');
        var overlay = document.getElementById('cartOverlay');
        var drawer = document.getElementById('cartDrawer');
        console.debug('_debugCartState', tag, 'cart=', cart, 'body=', !!body, 'bodyInnerLen=', body?body.innerHTML.length:0, 'overlay=', !!overlay, 'drawer=', !!drawer);
    }catch(e){ console.warn('_debugCartState failed', e); }
}

function updateCartCount(){
    var cart = JSON.parse(localStorage.getItem('cart')||'[]');
    var countEl = document.querySelector('.cart-count');
    if(countEl) countEl.textContent = cart.reduce(function(sum,i){ return sum + (i.quantity||0); },0);
}

function removeCartItem(index){
    var cart = JSON.parse(localStorage.getItem('cart')||'[]');
    if(index >=0 && index < cart.length){ cart.splice(index,1); localStorage.setItem('cart', JSON.stringify(cart)); renderCart(); }
}

// expose renderCart globally for other scripts
window.openCartPanel = openCartPanel;
window.renderCart = renderCart;
window.updateCartCount = updateCartCount;
window.ensureCartPanel = ensureCartPanel;

// CHAT WIDGET: floating chat button + small drawer (only for logged-in users)
function ensureChatWidget(){
    try{
        var current = JSON.parse(localStorage.getItem('currentUser')||'null');
        // Only show for logged-in users
        if(!current) return;
        if(document.getElementById('chat-widget-panel')) return;

        var panel = document.createElement('div');
        panel.id = 'chat-widget-panel';
        panel.innerHTML = '\n            <div id="chatFloatingBtn" style="position:fixed;right:18px;bottom:18px;z-index:10020;">' +
                '<button id="openChatBtn" title="Chat Bot" style="width:56px;height:56px;border-radius:50%;border:none;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0">' +
                    '<img id="chatBtnImg" src="assets/images/ChatBot.png" onerror="this.onerror=null;this.src=\'data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'36\\\' height=\\\'36\\\'><circle cx=\\\'18\\\' cy=\\\'18\\\' r=\\\'18\\\' fill=\\\'%236cb03f\\\'/><text x=\\\'50%\\\' y=\\\'55%\\\' font-size=\\\'18\\\' text-anchor=\\\'middle\\\' fill=\\\'#fff\\\'>💬</text></svg>\'" style="width:44px;height:44px;border-radius:50%">' +
                '</button>' +
            '</div>' +
            '<div id="chatDrawer" style="position:fixed;right:18px;bottom:86px;width:360px;height:460px;background:#fff;box-shadow:0 12px 36px rgba(0,0,0,0.18);border-radius:10px;overflow:hidden;z-index:10019;transform:translateY(12px);opacity:0;pointer-events:none;transition:opacity 0.22s ease, transform 0.22s ease">' +
                '<div style="background:#0b8a4a;color:#fff;padding:12px 14px;display:flex;align-items:center;justify-content:space-between">' +
                    '<div style="display:flex;align-items:center;gap:10px">' +
                        '<img src="assets/images/ChatBot.png" onerror="this.onerror=null;this.src=\'data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'36\\\' height=\\\'36\\\'><circle cx=\\\'18\\\' cy=\\\'18\\\' r=\\\'18\\\' fill=\\\'%23fff\\\'/></svg>\'" style="width:36px;height:36px;border-radius:50%;background:#fff">' +
                        '<strong>Chat Bot</strong>' +
                    '</div>' +
                    '<button id="closeChatBtn" style="background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer">&times;</button>' +
                '</div>' +
                '<div id="chatBody" style="height:320px;overflow:auto;padding:12px;background:#f7fbf8"></div>' +
                '<div style="padding:10px;border-top:1px solid #eee;display:flex;gap:8px;align-items:center">' +
                    '<input id="chatInput" placeholder="Gửi tin nhắn ..." style="flex:1;padding:10px;border-radius:20px;border:1px solid #ddd">' +
                    '<button id="chatSend" style="background:#6cb03f;border:none;color:#fff;padding:8px 12px;border-radius:20px;cursor:pointer">Gửi</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(panel);

        // handlers
        document.getElementById('openChatBtn').addEventListener('click', function(e){ e.preventDefault(); openChatDrawer(); });
        document.getElementById('closeChatBtn').addEventListener('click', function(e){ e.preventDefault(); closeChatDrawer(); });
        document.getElementById('chatSend').addEventListener('click', function(){ sendChatMessage(); });
        document.getElementById('chatInput').addEventListener('keypress', function(e){ if(e.key === 'Enter'){ e.preventDefault(); sendChatMessage(); } });

        // small unread badge when closed
        var badge = document.createElement('span'); badge.id = 'chatUnreadBadge'; badge.style.position = 'absolute'; badge.style.right = '4px'; badge.style.top = '4px'; badge.style.background = '#ff3b30'; badge.style.color = '#fff'; badge.style.borderRadius = '50%'; badge.style.padding = '4px 6px'; badge.style.fontSize = '12px'; badge.style.display = 'none';
        document.getElementById('chatFloatingBtn').appendChild(badge);

        // initial bot welcome
        addChatBubble('bot', 'Xin chào! Tôi là Chat Bot hỗ trợ. Bạn cần giúp gì?');
    }catch(e){ console.warn('ensureChatWidget failed', e); }
}

function openChatDrawer(){
    try{
        var drawer = document.getElementById('chatDrawer');
        if(!drawer) return;
        drawer.style.opacity = '1'; drawer.style.transform = 'translateY(0)'; drawer.style.pointerEvents = 'auto';
        // clear unread
        var badge = document.getElementById('chatUnreadBadge'); if(badge) badge.style.display = 'none';
        var body = document.getElementById('chatBody'); if(body) body.scrollTop = body.scrollHeight;
    }catch(e){ console.warn(e); }
}

function closeChatDrawer(){
    try{ var drawer = document.getElementById('chatDrawer'); if(!drawer) return; drawer.style.opacity='0'; drawer.style.transform='translateY(12px)'; drawer.style.pointerEvents='none'; }catch(e){}
}

function addChatBubble(who, text){
    try{
        var body = document.getElementById('chatBody'); if(!body) return;
        var el = document.createElement('div');
        el.style.margin = '8px 0';
        if(who === 'me'){
            el.style.textAlign = 'right';
            el.innerHTML = '<div style="display:inline-block;background:#dff7e1;color:#0b8a4a;padding:10px 12px;border-radius:12px;max-width:78%;">'+ escapeHtml(text) +'</div>';
        } else {
            el.style.textAlign = 'left';
            el.innerHTML = '<div style="display:inline-block;background:#fff;padding:10px 12px;border-radius:12px;max-width:78%;border:1px solid #e6efe9;">'+ escapeHtml(text) +'</div>';
        }
        body.appendChild(el);
        body.scrollTop = body.scrollHeight;
    }catch(e){ console.warn('addChatBubble failed', e); }
}

function sendChatMessage(){
    try{
        var input = document.getElementById('chatInput'); if(!input) return; var v = input.value.trim(); if(!v) return; input.value = '';
        addChatBubble('me', v);
        // simple bot echo with delay
        setTimeout(function(){ addChatBubble('bot', 'Cám ơn bạn đã gửi: "' + v + '". Đây là phản hồi tự động.');
            // show unread if drawer closed
            var drawer = document.getElementById('chatDrawer'); if(drawer && drawer.style.opacity !== '1'){ var badge = document.getElementById('chatUnreadBadge'); if(badge) badge.style.display='inline-block'; }
        }, 700);
    }catch(e){ console.warn('sendChatMessage failed', e); }
}

// expose chat open/close
window.ensureChatWidget = ensureChatWidget;
window.openChatDrawer = openChatDrawer;
window.closeChatDrawer = closeChatDrawer;

// If other scripts dispatch a `cartUpdated` event, re-render the cart and update count
window.addEventListener('cartUpdated', function(e){
    try{
        if(window.ensureCartPanel) ensureCartPanel();
        if(window.renderCart) renderCart();
        if(window.updateCartCount) updateCartCount();
        console.debug('component-loader: received cartUpdated event, re-rendered cart');
    }catch(err){ console.warn('cartUpdated handler failed', err); }
});


function initializeHeader() {
    // Re-initialize dropdown menus after header is loaded
    const dropdownMenus = document.querySelectorAll('.dropdown-list');
    
    if (dropdownMenus.length > 0) {
        dropdownMenus.forEach(menu => {
            const parent = menu.parentElement;
            
            parent.addEventListener('mouseenter', function() {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
            });
            
            parent.addEventListener('mouseleave', function() {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
        });
    }

    // Initialize search functionality after header is loaded
    initializeSearch();

    // Initialize modals after header loads
    initializeModals();
    
    // Attach cart open handler to header cart button
    var cartBtn = document.getElementById('bet_shoppingCart');
    if(cartBtn){
        cartBtn.addEventListener('click', function(e){
            e.preventDefault();
            try{ if(window.renderCart) window.renderCart(); }catch(e){}
            openCartPanel();
        });
    }
    // Update cart count on header init
    try{ updateCartCount(); }catch(e){}
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    function performSearch() {
        const searchQuery = searchInput ? searchInput.value.trim() : '';
        if (searchQuery) {
            window.location.href = 'SearchPage.html?q=' + encodeURIComponent(searchQuery);
        }
    }
}

function initializeModals() {
    // Handle login/register modal triggers
    const loginLinks = document.querySelectorAll('a[href="#loginModal"]');
    const registerLinks = document.querySelectorAll('a[href="#registerModal"]');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginCloseBtn = document.querySelector('#loginModal .close-modal');
    const registerCloseBtn = document.querySelector('#registerModal .close-modal');

    // Handle login modal opening
    loginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) {
                loginModal.style.display = 'block';
                loginModal.classList.add('show');
                // Prevent scrollbar shift
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = scrollbarWidth + 'px';
            }
        });
    });

    // Handle register modal opening
    registerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) {
                registerModal.style.display = 'block';
                registerModal.classList.add('show');
                // Prevent scrollbar shift
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = scrollbarWidth + 'px';
            }
        });
    });

    // Handle close buttons
    if (loginCloseBtn && loginModal) {
        loginCloseBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            loginModal.classList.remove('show');
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        });
    }

    if (registerCloseBtn && registerModal) {
        registerCloseBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
            registerModal.classList.remove('show');
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        });
    }

    // Close modal when clicking outside
    if (loginModal) {
        loginModal.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
                loginModal.classList.remove('show');
                document.body.style.overflow = 'auto';
                document.body.style.paddingRight = '0';
            }
        });
    }

    if (registerModal) {
        registerModal.addEventListener('click', function(event) {
            if (event.target === registerModal) {
                registerModal.style.display = 'none';
                registerModal.classList.remove('show');
                document.body.style.overflow = 'auto';
                document.body.style.paddingRight = '0';
            }
        });
    }

    // Toggle between login and register
    const toggleRegisterLinks = document.querySelectorAll('.btn-create-account');
    
    toggleRegisterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            if (loginModal && registerModal) {
                loginModal.style.display = 'none';
                loginModal.classList.remove('show');
                registerModal.style.display = 'block';
                registerModal.classList.add('show');
            }
        });
    });
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}
