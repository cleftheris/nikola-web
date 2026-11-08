// Progressive enhancements only — all content works without JavaScript.
(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  // Mobile navigation
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  // Header shadow once the page is scrolled
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Google Maps loads only after explicit consent (no third-party requests by default)
  document.querySelectorAll('[data-map-src]').forEach((card) => {
    const btn = card.querySelector('.map-load');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = card.dataset.mapSrc;
      iframe.title = card.dataset.mapTitle || 'Google Maps';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      card.querySelector('.map-consent')?.remove();
      card.appendChild(iframe);
      iframe.focus();
    });
  });

  // Opening hours: highlight today and show open/closed status (Europe/Athens time)
  const table = document.querySelector('.hours');
  const status = document.querySelector('.open-status');
  if (table) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Athens',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type)?.value;
    const dayIndex = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[get('weekday')];
    const nowMinutes = Number(get('hour')) * 60 + Number(get('minute'));
    const toMinutes = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    };

    const row = table.querySelector(`tr[data-day="${dayIndex}"]`);
    if (row) {
      row.classList.add('is-today');
      row.setAttribute('aria-current', 'date');
      if (status) {
        const { open, close } = row.dataset;
        const isOpen = Boolean(open && close) && nowMinutes >= toMinutes(open) && nowMinutes < toMinutes(close);
        status.textContent = isOpen ? status.dataset.openText : status.dataset.closedText;
        status.classList.add(isOpen ? 'is-open' : 'is-closed');
        status.hidden = false;
      }
    }
  }

  // Current year in footer
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
