/**
 * ROLLZONE - Script Principal
 * Funcionalidades interactivas:
 * - Menú responsive móvil (drawer)
 * - Navbar fija con sombreado al hacer scroll y enlace activo
 * - Filtro de productos por categoría en vivo
 * - Calculadora de talla interactiva
 * - Modal dinámico de consulta de producto con WhatsApp
 * - Validación accesible de formulario de contacto con notificación Toast
 * - Animaciones sutiles de Scroll Reveal (IntersectionObserver)
 * - Botón volver arriba
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. NAVEGACIÓN Y MENÚ MÓVIL
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header sombreado al hacer scroll
  const handleScrollNavbar = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // Abrir / Cerrar Menú Móvil
  const toggleMobileMenu = (open) => {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.add('open');
      menuOverlay.classList.add('active');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('open');
      menuOverlay.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  }
  if (menuOverlay) {
    menuOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Cerrar menú al hacer clic en enlaces y resaltar enlace activo
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Indicador de sección activa en scroll
  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // =========================================================================
  // 2. FILTRADO DE PRODUCTOS POR CATEGORÍA
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  const filterProducts = (category) => {
    // Actualizar botones de filtro
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mostrar/ocultar tarjetas con animación
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.classList.add('hidden');
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      filterProducts(category);
    });
  });

  // Enlaces de tarjetas de categorías y footer que activan el filtro
  const categoryJumpLinks = document.querySelectorAll('[data-filter], [data-footer-filter]');
  categoryJumpLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.getAttribute('data-filter') || link.getAttribute('data-footer-filter');
      if (cat && cat !== 'all') {
        filterProducts(cat);
      }
    });
  });

  // =========================================================================
  // 3. CALCULADORA INTERACTIVA DE TALLAS
  // =========================================================================
  const btnCalculate = document.getElementById('btnCalculateSize');
  const footLengthInput = document.getElementById('footLengthInput');
  const skateTypeSelect = document.getElementById('skateTypeSelect');
  const calcResult = document.getElementById('calcResult');
  const resultSize = document.getElementById('resultSize');
  const resultTip = document.getElementById('resultTip');
  const resultWhatsAppBtn = document.getElementById('resultWhatsAppBtn');

  // Conversión de cm a talla de patín con amortiguación
  const calculateSkateSize = (cm, type) => {
    // Tabla de correspondencia base
    let euSize = 36;
    let usSize = 5.0;

    if (cm <= 23.0) { euSize = 36; usSize = 4.5; }
    else if (cm <= 23.5) { euSize = 37; usSize = 5.5; }
    else if (cm <= 24.2) { euSize = 38; usSize = 6.0; }
    else if (cm <= 24.8) { euSize = 39; usSize = 7.0; }
    else if (cm <= 25.5) { euSize = 40; usSize = 7.5; }
    else if (cm <= 26.2) { euSize = 41; usSize = 8.5; }
    else if (cm <= 27.0) { euSize = 42; usSize = 9.0; }
    else if (cm <= 27.8) { euSize = 43; usSize = 10.0; }
    else if (cm <= 28.5) { euSize = 44; usSize = 11.0; }
    else { euSize = 45; usSize = 12.0; }

    let tip = '';
    if (type === 'quad') {
      tip = `Para Quads: Tu talla ideal es EU ${euSize}. Si tienes empeine ancho o usarás calcetín grueso deportivo, la horma bota alta se adaptará con los primeros usos.`;
    } else if (type === 'inline') {
      tip = `Para En Línea (Freeskate): Tu talla ideal es EU ${euSize}. La carcasa rígida protege el tobillo y el botín interno acolchado cederá aproximadamente 3 mm tras 2 o 3 sesiones de uso.`;
    } else if (type === 'velocidad') {
      tip = `Para Velocidad (Speed): Tu talla ideal es EU ${euSize} (ajuste termo-moldeable ceñido). No debe haber holgura en el talón para transmitir el 100% de potencia al chasis.`;
    }

    return { euSize, usSize, tip };
  };

  if (btnCalculate && footLengthInput) {
    btnCalculate.addEventListener('click', () => {
      const cm = parseFloat(footLengthInput.value);
      if (isNaN(cm) || cm < 18 || cm > 34) {
        alert('Por favor ingresa una medida de longitud de pie válida (entre 20 cm y 32 cm).');
        footLengthInput.focus();
        return;
      }

      const type = skateTypeSelect ? skateTypeSelect.value : 'inline';
      const result = calculateSkateSize(cm, type);

      resultSize.textContent = `EU ${result.euSize} / US ${result.usSize} (${cm} cm)`;
      resultTip.textContent = result.tip;
      calcResult.style.display = 'block';

      if (resultWhatsAppBtn) {
        const msg = encodeURIComponent(`Hola RollZone! Medí mi pie en su web (${cm} cm) y mi talla recomendada es EU ${result.euSize} para patines ${type}. ¿Tienen modelos en stock?`);
        resultWhatsAppBtn.href = `https://wa.me/59177890123?text=${msg}`;
      }
    });
  }

  // =========================================================================
  // 4. MODAL DINÁMICO DE CONSULTA DE PRODUCTO
  // =========================================================================
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const modalProductPrice = document.getElementById('modalProductPrice');
  const modalWhatsAppLink = document.getElementById('modalWhatsAppLink');
  const consultBtns = document.querySelectorAll('.btn-consultar');

  const openProductModal = (name, price) => {
    if (!productModal) return;
    modalProductTitle.textContent = name;
    modalProductPrice.textContent = price;

    const message = encodeURIComponent(`Hola RollZone! Me interesa consultar por el producto: *${name}* (${price}). ¿Tienen disponibilidad y asesoría de mi talla?`);
    modalWhatsAppLink.href = `https://wa.me/59177890123?text=${message}`;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    if (!productModal) return;
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  consultBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.getAttribute('data-product-name') || 'Patines RollZone';
      const price = btn.getAttribute('data-product-price') || 'Consultar';
      openProductModal(name, price);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }

  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      toggleMobileMenu(false);
    }
  });

  // =========================================================================
  // 5. VALIDACIÓN DE FORMULARIO DE CONTACTO Y NOTIFICACIÓN TOAST
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactCity = document.getElementById('contactCity');
  const contactMessage = document.getElementById('contactMessage');
  const btnSubmit = document.getElementById('btnSubmit');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  let toastTimeout;
  const showToast = (message) => {
    if (!toastNotification) return;
    if (toastMessage && message) {
      toastMessage.textContent = message;
    }
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (contactForm) {
    // Limpieza de estados de error al escribir
    [contactName, contactEmail, contactMessage].forEach(field => {
      if (!field) return;
      field.addEventListener('input', () => {
        field.parentElement.classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      // Validar Nombre
      if (!contactName.value.trim() || contactName.value.trim().length < 2) {
        contactName.parentElement.classList.add('has-error');
        hasError = true;
      } else {
        contactName.parentElement.classList.remove('has-error');
      }

      // Validar Email
      if (!validateEmail(contactEmail.value.trim())) {
        contactEmail.parentElement.classList.add('has-error');
        hasError = true;
      } else {
        contactEmail.parentElement.classList.remove('has-error');
      }

      // Validar Mensaje
      if (!contactMessage.value.trim() || contactMessage.value.trim().length < 8) {
        contactMessage.parentElement.classList.add('has-error');
        hasError = true;
      } else {
        contactMessage.parentElement.classList.remove('has-error');
      }

      if (hasError) {
        // Enfoque en el primer campo inválido
        const firstError = contactForm.querySelector('.has-error input, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Simular envío con feedback
      const originalText = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span>Enviando mensaje...</span>`;

      setTimeout(() => {
        const userName = contactName.value.trim();
        const userCity = contactCity.value;
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
        contactForm.reset();

        showToast(`¡Excelente ${userName}! Recibimos tu consulta para ${userCity}. Un asesor de RollZone te contactará enseguida.`);
      }, 750);
    });
  }

  // =========================================================================
  // 6. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Respaldo para navegadores antiguos
    revealElements.forEach(el => el.classList.add('active'));
  }

  // =========================================================================
  // 7. BOTÓN VOLVER ARRIBA
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
