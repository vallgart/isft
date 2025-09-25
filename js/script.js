document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.closest('.faq-item');
      const active = item.classList.contains('active-state');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active-state'));
      if (!active) item.classList.add('active-state');
    });
  });
});
