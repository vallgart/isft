// == helpers =================================================================
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

// Плавный скролл к якорю с учётом фикс-хедера
const scrollToAnchor = (hash, header) => {
  const target = document.querySelector(hash);
  if (!target) return;
  const offset = (header?.offsetHeight || 0) + 8;
  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

// == FAQ (делегирование) ======================================================
on(document, 'click', (e) => {
  const btn = e.target.closest('.faq-question');
  if (!btn) return;

  const item = btn.closest('.faq-item');
  const wasActive = item.classList.contains('active-state');

  $$('.faq-item').forEach(i => i.classList.remove('active-state'));
  if (!wasActive) item.classList.add('active-state');
});

// == Мобильное меню ===========================================================
document.addEventListener('DOMContentLoaded', () => {
  const header      = $('header');
  const menuBtn     = $('#open-mobile-menu');
  const mobileMenu  = $('#mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  let opened = false;

  const openMenu = () => {
    if (opened) return;
    opened = true;
    mobileMenu.style.display = 'block';
    document.body.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    if (!opened) return;
    opened = false;
    mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => (opened ? closeMenu() : openMenu());

  on(menuBtn, 'click', toggleMenu);

  // клик вне контента меню — закрыть
  on(mobileMenu, 'click', (e) => {
    if (!e.target.closest('.header-mobile__section')) closeMenu();
  });

  // якорные ссылки внутри меню: закрыть и прокрутить
  on(mobileMenu, 'click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();
    closeMenu();
    // дождёмся перерисовки и скроллим
    requestAnimationFrame(() => scrollToAnchor(href, header));
  });
});

// == Горизонтальный скролл для всех .staff ===================================
const attachHScroll = (el) => {
  // колесо: вертикаль → горизонталь
  on(el, 'wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  }, { passive: false });

  // drag через Pointer Events (мышь + тач в одном)
  let dragging = false, startX = 0, startLeft = 0;

  const pointerDown = (e) => {
    dragging = true;
    startX = e.clientX;
    startLeft = el.scrollLeft;
    el.classList.add('is-dragging');
    el.setPointerCapture?.(e.pointerId);
  };
  const pointerMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const dx = e.clientX - startX;
    el.scrollLeft = startLeft - dx;
  };
  const pointerUp = () => {
    dragging = false;
    el.classList.remove('is-dragging');
  };

  on(el, 'pointerdown', pointerDown);
  on(el, 'pointermove', pointerMove);
  on(el, 'pointerup', pointerUp);
  on(el, 'pointercancel', pointerUp);
  on(window, 'pointerup', pointerUp);

  // клавиатура
  el.tabIndex = 0;
  on(el, 'keydown', (e) => {
    if (e.key === 'ArrowRight') el.scrollBy({ left: 200, behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  el.scrollBy({ left: -200, behavior: 'smooth' });
  });
};

// навешиваем на все списки staff
$$('.staff').forEach(attachHScroll);
