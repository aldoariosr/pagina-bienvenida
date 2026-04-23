// Mostrar Validación de Edad al Cargar
document.addEventListener("DOMContentLoaded", () => {
  // Comprobar si ya se verificó en la sesión
  if (!sessionStorage.getItem('ageVerified')) {
    const modal = document.getElementById('age-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Evitar desplazamiento de la página
    }
  }
});

function confirmAge(isAdult) {
  if (isAdult) {
    const modal = document.getElementById('age-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
    document.body.style.overflow = 'auto'; // Restaurar desplazamiento de la página
    sessionStorage.setItem('ageVerified', 'true');
    showNotification("¡Bienvenido a Golden Cloud Pod!");
  } else {
    window.location.href = "https://www.google.com";
  }
}

// Función de WhatsApp centralizada para productos de index.html

function contactWhatsApp(productName) {
  const text = encodeURIComponent(`Hola, quisiera consultar características o stock sobre el producto: ${productName}`);
  const link = `https://wa.me/?text=${text}`;
  window.open(link, '_blank');
}


function handleContact(e) {
  e.preventDefault();
  const whatsappInput = document.getElementById('whatsapp-input');
  if (whatsappInput && whatsappInput.value) {
    showNotification(`¡Gracias! Un vendedor se pondrá en contacto pronto al ${whatsappInput.value}.`);
    whatsappInput.value = '';
  }
}

function handleSearch(e) {
  if (e.key === 'Enter' && e.target.value.trim() !== '') {
    const query = encodeURIComponent(e.target.value.trim());
    window.location.href = `busqueda.html?q=${query}`;
  }
}

function triggerSearch() {
  // Find the search input that is closest to the clicked icon
  const searchInput = document.querySelector('input[placeholder="Buscar"]');
  if (searchInput && searchInput.value.trim() !== '') {
    const query = encodeURIComponent(searchInput.value.trim());
    window.location.href = `busqueda.html?q=${query}`;
  } else {
    showNotification('Escribe algo para buscar.');
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function showNotification(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = "bg-black text-white px-6 py-3 rounded-md shadow-lg font-medium text-sm transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-3";

  toast.innerHTML = `
    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Animación de entrada
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  // Eliminar automáticamente después de 3 segundos
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// LÓGICA DE LA PÁGINA TIENDA
// ============================================

// Filtrar categorías
function filterCategory(category) {
  // Update active navigation button styles
  const buttons = document.querySelectorAll('.cat-btn');
  buttons.forEach(btn => {
    btn.classList.remove('text-black', 'active-cat', 'font-black');
    if (btn.innerText.includes(category === 'Todos' ? 'Todos' : category)) {
      btn.classList.add('text-black', 'active-cat', 'font-black');
    }
  });

  const products = document.querySelectorAll('.product-item');
  
  if (category === 'Todos') {
    // Show only 1 from each category (Preview effect)
    let seen = { V150: false, V80: false, V50: false, V35: false };
    products.forEach(p => {
      let cat = p.getAttribute('data-category');
      if (!seen[cat]) {
        p.style.display = 'flex';
        seen[cat] = true;
      } else {
        p.style.display = 'none';
      }
    });
  } else {
    // Show all from selected category
    products.forEach(p => {
      let cat = p.getAttribute('data-category');
      if (cat === category) {
        p.style.display = 'flex';
      } else {
        p.style.display = 'none';
      }
    });
  }
}

// Initial filter applied when page loads (if product-grid exists)
document.addEventListener("DOMContentLoaded", () => {
   if (document.getElementById('product-grid')) {
      filterCategory('Todos');
   }
});

// Modal Logic
function openProductModal(title, flavor, imgSrc, category) {
  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('product-modal-content');
  
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-flavor').innerText = flavor;
  document.getElementById('modal-badge').innerText = category;
  document.getElementById('modal-img').src = imgSrc;
  
  const wpText = encodeURIComponent(`Hola, quisiera consultar características o stock sobre el Device: ${title} con sabor: ${flavor}`);
  const wpLink = `https://wa.me/?text=${wpText}`;
  document.getElementById('modal-whatsapp-btn').onclick = () => window.open(wpLink, '_blank');
  
  modal.classList.remove('hidden');
  // Trick for smooth fade in
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('product-modal-content');
  
  modal.classList.add('opacity-0');
  modalContent.classList.add('scale-95');
  
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300); // Wait for transition
  
  // if not verified age modal is also there, check before setting auto
  if (sessionStorage.getItem('ageVerified')) {
    document.body.style.overflow = 'auto';
  }
}

// Close when clicking outside of modal
window.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (e.target === modal && !modal.classList.contains('hidden')) {
    closeProductModal();
  }
});

// ============================================
// FORMULARIOS DE CONTACTO Y MAYORISTA
// ============================================

function handleContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name')?.value || '';
  const email = document.getElementById('contact-email')?.value || '';
  showNotification(`¡Gracias ${name}! Tu mensaje fue enviado correctamente. Te responderemos a ${email} a la brevedad.`);
  e.target.reset();
}

function handleWholesaleForm(e) {
  e.preventDefault();
  showNotification('¡Solicitud mayorista enviada! Nuestro equipo comercial te contactará en las próximas 24 horas.');
  e.target.reset();
}
