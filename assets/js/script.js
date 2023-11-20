// Produk diarray
    const products = [
        { id: 1, name: 'Beras Fortune', price: 10000, stock: 6, image: 'Beras.webp' },
        { id: 2, name: 'Minyak Bimoli', price: 5000, stock: 15, image: 'Minyak.webp' },
        { id: 3, name: 'Garam Cap Kapal', price: 5000, stock: 15, image: 'Garam.webp' },
        { id: 4, name: 'Gulaku', price: 3000, stock: 20, image: 'Gula.webp' }
    ];

    // Keranjang
    let cart = [];

    // Fungsi untuk menambah jumlah produk di keranjang
    function increaseQuantityInCart(productId) {
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            // Cek apakah menambah satu quantity di keranjang melebihi stok yang tersedia
            if (cartItem.quantity + 1 <= cartItem.stock) {
                cartItem.quantity++;

                // Kurangkan stok produk di keranjang
                cartItem.stock--;

                renderCart();
                calculateTotal();
                
                // Update the displayed stock in the product cards
                updateProductCardStock(productId);
            } else {
                alert('Cannot add more of this item to the cart. Insufficient stock.');
                return;
            }
        }
    }

    // Fungsi untuk mengurangkan jumlah produk di keranjang
    function decreaseQuantityInCart(productId) {
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem && cartItem.quantity > 1) {
            // Tambahkan stok produk di keranjang
            cartItem.stock++;

            // Kurangi satu quantity di keranjang
            cartItem.quantity--;

            renderCart();
            calculateTotal();
            
            // Update the displayed stock in the product cards
            updateProductCardStock(productId);
        }
    }

    // Penambahan barang ke keranjang
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);

        if (product) {
            if (product.stock > 0) {
                const existingCartItem = cart.find(item => item.id === productId);

                if (existingCartItem) {
                    if (existingCartItem.stock > 0) {
                        existingCartItem.quantity++;

                        // Reduce the stock in the cart by one unit
                        const updatedCartItem = cart.find(item => item.id === productId);
                        updatedCartItem.stock--;

                        renderCart();
                        calculateTotal();
                        
                        // Update the displayed stock in the product cards
                        updateProductCardStock(productId);

                        renderProducts(); // Update the displayed stock in the product cards
                    } else {
                        alert('Cannot add more of this item to the cart. Insufficient stock.');
                    }
                } else {
                    cart.push({ ...product, quantity: 1, stock: product.stock });

                    // Reduce the stock in the cart by one unit
                    const updatedCartItem = cart.find(item => item.id === productId);
                    updatedCartItem.stock--;

                    renderCart();
                    calculateTotal();
                    
                    // Update the displayed stock in the product cards
                    updateProductCardStock(productId);

                    renderProducts(); // Update the displayed stock in the product cards
                }
            } else {
                alert('This item is out of stock.');
            }
        } else {
            alert('Product not found.');
        }
    }

    // Hapus barang dari keranjang
    function removeFromCart(productId) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            // Increase the stock in the cart by the quantity of the item being removed
            cartItem.stock += cartItem.quantity;

            // Remove the item from the cart
            cart = cart.filter(item => item.id !== productId);

            renderCart();
            calculateTotal();
            
            // Update the displayed stock in the product cards
            updateProductCardStock(productId);

            renderProducts(); // Update the displayed stock in the product cards
        }
    }

    // Fungsi untuk merender keranjang
    function renderCart() {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = '';

        cart.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        ${product.name} - Rp${product.price.toLocaleString()} - Jumlah: ${product.quantity} - Stock yang tersedia: ${product.stock}
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${product.id})">Hapus Semua</button>
                        <button class="btn btn-sm btn-primary" onclick="increaseQuantityInCart(${product.id})">+</button>
                        <button class="btn btn-sm btn-primary" onclick="decreaseQuantityInCart(${product.id})">-</button>
                    </div>
                </div>
            `;
            cartList.appendChild(listItem);
        });
    }

    // Fungsi untuk menghitung dan merender total harga
    function calculateTotal() {
        const totalSpan = document.getElementById('total');
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        totalSpan.textContent = total.toLocaleString();
    }

    // Fungsi untuk merender kartu produk
    function renderProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.id = `product-card-${product.id}`;
            card.className = 'col-sm-4 col-md-6 mb-4';
            card.innerHTML = `
                <div class="card">
                    <img src="assets/images/${product.image}" class="card-img-top img-fluid" style="max-height: 150px; object-fit: cover" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Price: Rp${product.price.toLocaleString()}</p>
                        <p class="card-text stock">Stock: ${product.stock}</p>
                        <div class="card-buttons">
                            <button class="btn btn-danger d-flex w-100 justify-content-center" onclick="addToCart(${product.id})">Masukan <i class="bi bi-cart-plus-fill"></i></button>
                        </div>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    // Fungsi untuk mengupdate stok yang ditampilkan pada kartu produk
    function updateProductCardStock(productId) {
        const productCard = document.getElementById(`product-card-${productId}`);
        const product = products.find(p => p.id === productId);

        if (productCard && product) {
            const stockElement = productCard.querySelector('.card-text.stock');
            if (stockElement) {
                stockElement.textContent = `Stock: ${product.stock}`;
            }
        }
    }

    // Fungsi untuk mensimulasikan pembelian dan memperbarui tabel pembelian
    function buyItems() {
        if (cart.length > 0) {
            const purchaseTableBody = document.getElementById('purchase-table-body');

            cart.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>Rp${product.price.toLocaleString()}</td>
                    <td>${product.quantity}</td>
                    <td><img src="assets/images/${product.image}" alt="${product.name}" style="max-width: 50px;"></td>
                    <td>Rp${(product.price * product.quantity).toLocaleString()}</td>
                `;
                purchaseTableBody.appendChild(row);

                // Update stock in the products array
                const originalProduct = products.find(p => p.id === product.id);
                originalProduct.stock -= product.quantity;
            });

            cart = [];
            renderCart();
            calculateTotal();
            renderProducts(); // Update the displayed stock in the product cards
        } else {
            alert('Your cart is empty. Add items before buying.');
        }
    }

    // Inisialisasi aplikasi
    document.addEventListener('DOMContentLoaded', () => {
        renderProducts();
    });

    