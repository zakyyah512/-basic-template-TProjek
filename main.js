document.addEventListener("DOMContentLoaded", () => {
  const cartItemCount = document.querySelector(".cart-icon span"); // Menampilkan jumlah item dalam keranjang
  const cartItemsList = document.querySelector(".cart-items"); // Daftar item dalam keranjang
  const cartTotal = document.querySelector(".cart-total"); // Total harga keranjang
  const cartIcon = document.querySelector(".cart-icon"); // Ikon keranjang
  const sidebar = document.getElementById("sidebar"); // Sidebar untuk keranjang
  const sidebarClose = document.querySelector(".sidebar-close"); // Tombol tutup sidebar
  const paymentMethodSelect = document.getElementById("paymentMethod"); // Pilihan metode pembayaran

  // Mengambil data keranjang dari localStorage jika ada
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let totalAmount = 0;

  // Fungsi untuk mengupdate tampilan keranjang
  function updateCart() {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency", // secara otomatis menambahkan rp
      currency: "IDR",
      minimumFractionDigits: 0, // Tidak menampilkan desimal
    });

    cartItemsList.innerHTML = cartItems
      .map(
        (item, index) => `
        <div class="individual-cart-items">
          <!-- Nama Menu -->
          <div class="item-header">
            <span class="item-name">${item.name}</span>
          </div>
          <!-- Harga dan Kontrol Kuantitas -->
          <div class="item-footer">
            <span class="item-total">Rp ${item.price * item.quantity}</span>
            <div class="item-controls">
              <button class="decrease-quantity" data-index="${index}">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="increase-quantity" data-index="${index}">+</button>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    // Menghitung total harga
    totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cartTotal.textContent = formatter.format(totalAmount);
    cartItemCount.textContent = cartItems.length; // Update jumlah item di ikon keranjang

    // Simpan data keranjang ke localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  // Menangani klik pada tombol "Tambah ke Keranjang"
  document.addEventListener("click", function (event) {
    if (event.target && event.target.matches(".add-to-cart")) {
      const card = event.target.closest(".card");
      const item = {
        name: card.querySelector(".card-title").textContent,
        price: parseFloat(card.querySelector(".price").textContent.replace("k", "")), // Menghapus "K" dari harga
        quantity: 1,
      };

      // Jika item sudah ada di keranjang, tambahkan kuantitasnya
      const existingItem = cartItems.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push(item); // Jika item belum ada, tambahkan ke keranjang
      }

      updateCart(); // Update tampilan keranjang
    }
  });

  // Menangani penghapusan item dari keranjang
  cartItemsList.addEventListener("click", function (event) {
    event.stopPropagation(); // Cegah klik di dalam sidebar menutupnya
    if (event.target && event.target.matches(".remove-item")) {
      const index = event.target.getAttribute("data-index");
      cartItems.splice(index, 1);
      updateCart();
    }

    if (event.target && event.target.matches(".decrease-quantity")) {
      const index = event.target.getAttribute("data-index");
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
      } else {
        cartItems.splice(index, 1);
      }
      updateCart();
    }

    if (event.target.matches(".increase-quantity")) {
      const index = event.target.getAttribute("data-index");
      cartItems[index].quantity++;
      updateCart();
    }
  });

  // Toggle sidebar keranjang
  cartIcon.addEventListener("click", (event) => {
    sidebar.classList.toggle("open");
    event.stopPropagation(); // Mencegah klik di luar sidebar menutupnya
  });

  // Menutup sidebar keranjang
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // Menutup sidebar ketika klik di luar sidebar
  document.addEventListener("click", (event) => {
    if (!sidebar.contains(event.target) && !cartIcon.contains(event.target)) {
      sidebar.classList.remove("open");
    }
  });

  // Menangani pembayaran dan checkout
  document.querySelector(".checkout-btn").addEventListener("click", (event) => {
    event.stopPropagation();
    const selectedPaymentMethod = paymentMethodSelect.value;
    if (!selectedPaymentMethod) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }

    // Mengarahkan ke halaman pembayaran dengan parameter yang sesuai
    const itemsParam = encodeURIComponent(JSON.stringify(cartItems));
    const totalParam = totalAmount;
    window.location.href = `payment.html?paymentMethod=${selectedPaymentMethod}&total=${totalParam}&items=${itemsParam}`;
  });

  // Inisialisasi tampilan keranjang saat pertama kali dimuat
  updateCart();
});
