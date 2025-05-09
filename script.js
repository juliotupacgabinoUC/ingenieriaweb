document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Animate hamburger icon
    this.classList.toggle('active');
  });
  

  //INICIA EL PROCESO DEL CARRO
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });
  
  // Shopping cart functionality
  const cartToggle = document.getElementById('cart-toggle');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const totalElement = document.getElementById('total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');
  const addToCartBtns = document.querySelectorAll('.btn-card');
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Toggle cart modal
  cartToggle.addEventListener('click', function() {
    cartModal.classList.add('active');
    document.body.classList.add('no-scroll');
  });
  
  closeCart.addEventListener('click', function() {
    cartModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
  
  // Close modal when clicking outside
  cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
      cartModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Add to cart
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const product = this.dataset.product;
      const price = parseFloat(this.dataset.price);
      const productCard = this.closest('.product-card');
      const imgSrc = productCard.querySelector('img').src;
      
      addToCart(product, price, imgSrc);
    });
  });
  
  function addToCart(product, price, imgSrc) {
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product,
        price,
        quantity: 1,
        imgSrc
      });
    }
    
    updateCart();
    showAddedToCartMessage(product);
  }
  
  function updateCart() {
    renderCartItems();
    updateCartCount();
    updateTotal();
    saveCartToLocalStorage();
  }
  
  function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
      return;
    }
    
    cart.forEach((item, index) => {
      const cartItem = document.createElement('li');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.product}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.product}</h4>
          <p class="cart-item-price">S/${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="cart-item-actions">
          <button class="remove-item" data-index="${index}">×</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        removeItemFromCart(index);
      });
    });
  }
  
  function removeItemFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }
  
  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
  }
  
  function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total.toFixed(2);
  }
  
  function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function showAddedToCartMessage(product) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
      <p>¡${product} agregado al carrito!</p>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  }
  
  // Clear cart
  clearCartBtn.addEventListener('click', function() {
    cart = [];
    updateCart();
  });
  
  // Checkout
  //checkoutBtn.addEventListener('click', function() {
    //if (cart.length === 0) {
      //alert('Tu carrito está vacío');
      //return;
    //}
    
    //alert('Gracias por tu compra! Total: S/' + totalElement.textContent);
    //cart = [];
    //updateCart();
    //cartModal.classList.remove('active');
    //document.body.classList.remove('no-scroll');
  //});
  

  // ===== PRODUCT FILTERING FUNCTIONALITY =====
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.dataset.category;
      
      // Filter products with animation
      productCards.forEach(card => {
        if (filterValue === 'all') {
          card.classList.remove('hidden');
        } else {
          if (card.dataset.category === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
      
      // Animate grid reorganization
      const productGrid = document.querySelector('.product-grid');
      productGrid.style.display = 'none';
      setTimeout(() => {
        productGrid.style.display = 'grid';
      }, 300);
    });
  });

  // Initialize with all products showing
  productCards.forEach(card => card.classList.remove('hidden'));

  // Initialize cart
  updateCart();

  // ===== LOGIN FUNCTIONALITY =====
  const loginToggle = document.getElementById('login-toggle');
  const loginModal = document.getElementById('login-modal');
  const closeLogin = document.getElementById('close-login');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userGreeting = document.getElementById('user-greeting');

  // Check if user is logged in (from localStorage)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  updateAuthUI(currentUser);

  // Toggle login modal
  if (loginToggle) {
    loginToggle.addEventListener('click', function() {
      loginModal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  }

  if (closeLogin) {
    closeLogin.addEventListener('click', function() {
      loginModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

  // Close modal when clicking outside
  if (loginModal) {
    loginModal.addEventListener('click', function(e) {
      if (e.target === loginModal) {
        loginModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      // Basic validation
      if (!email || !password) {
        showLoginError('Por favor ingresa email y contraseña');
        return;
      }
      
      // In a real app, you would check against your backend/database
      // This is just a simulation with hardcoded users
      const users = [
        { email: 'user@example.com', password: 'password123', name: 'Usuario' },
        { email: 'admin@example.com', password: 'admin123', name: 'Administrador' }
      ];
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Successful login
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI(user);
        loginModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        showLoginSuccess(`Bienvenido, ${user.name}!`);
      } else {
        showLoginError('Email o contraseña incorrectos');
      }
    });
  }

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      updateAuthUI(null);
      showLoginSuccess('Has cerrado sesión correctamente');
    });
  }

  // Helper functions
  function updateAuthUI(user) {
    if (user) {
      // User is logged in
      if (loginToggle) loginToggle.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
      if (userGreeting) {
        userGreeting.textContent = `Hola, ${user.name}`;
        userGreeting.style.display = 'block';
      }
    } else {
      // User is logged out
      if (loginToggle) loginToggle.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (userGreeting) userGreeting.style.display = 'none';
    }
  }

  function showLoginError(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 3000);
    }
  }

  function showLoginSuccess(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'login-message';
    messageElement.innerHTML = `<p>${message}</p>`;
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      messageElement.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, 300);
    }, 3000);
  }

});