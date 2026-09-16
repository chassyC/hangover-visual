'use strict';
window.HangoverMotion = (() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const transitions = new Set();
  const images = new Map();
  const enabled = () => !preference.matches && !document.body.classList.contains('paused');
  function animate(node, frames, duration = 340) {
    if (!enabled() || !node.animate) return Promise.resolve();
    const animation = node.animate(frames, {duration, easing:'cubic-bezier(.22,1,.36,1)'});
    transitions.add(animation);
    return animation.finished.catch(() => {}).finally(() => transitions.delete(animation));
  }
  function finish() { transitions.forEach(animation => animation.finish()); }
  preference.addEventListener('change', e => { if (e.matches) finish(); });
  function loadImage(src) {
    if (images.has(src)) return images.get(src);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => image.decode().catch(() => {}).then(() => resolve(image));
      image.onerror = () => { images.delete(src); reject(new Error('Image unavailable')); };
      image.src = src;
    });
    images.set(src, promise);
    // Keep only the recent decoded images; the browser manages its HTTP cache.
    if (images.size > 12) images.delete(images.keys().next().value);
    return promise;
  }

  // Axis locking leaves native vertical scrolling and pinch zoom available.
  function swipe(surface, {start=()=>{}, move=()=>{}, end=()=>{}, cancel=()=>{}}) {
    const controller = new AbortController();
    const options = {signal:controller.signal};
    let gesture = null, suppressClickUntil = 0;
    const reset = () => {
      const old = gesture;
      gesture = null;
      surface.classList.remove('is-dragging');
      if (old && surface.hasPointerCapture(old.id)) surface.releasePointerCapture(old.id);
      return old;
    };
    surface.addEventListener('pointerdown', e => {
      if (!e.isPrimary || e.button !== 0 || gesture) return;
      gesture = {id:e.pointerId, x:e.clientX, y:e.clientY, lastX:e.clientX, lastTime:e.timeStamp, velocity:0, dx:0, horizontal:false};
    }, options);
    surface.addEventListener('pointermove', e => {
      if (!gesture || e.pointerId !== gesture.id) return;
      const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
      if (!gesture.horizontal) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 9) return;
        if (Math.abs(dy) >= Math.abs(dx) * .85) { reset(); return; }
        gesture.horizontal = true;
        surface.setPointerCapture(e.pointerId);
        surface.classList.add('is-dragging');
        start();
      }
      e.preventDefault();
      const elapsed = e.timeStamp - gesture.lastTime;
      if (elapsed > 0) gesture.velocity = (e.clientX - gesture.lastX) / elapsed;
      gesture.lastX = e.clientX; gesture.lastTime = e.timeStamp; gesture.dx = dx;
      move(dx);
    }, {...options, passive:false});
    surface.addEventListener('pointerup', e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const old = reset();
      if (!old.horizontal) return;
      suppressClickUntil = performance.now() + 420;
      const velocity = e.timeStamp - old.lastTime < 110 ? old.velocity : 0;
      const threshold = Math.min(72, surface.clientWidth * .16);
      const crossed = Math.abs(old.dx) > threshold || (Math.abs(old.dx) > 20 && Math.abs(velocity) > .45);
      end(crossed ? (old.dx < 0 ? 1 : -1) : 0, old.dx);
    }, options);
    const abort = event => {
      const old = reset();
      if (old?.horizontal) { suppressClickUntil = performance.now() + 420; cancel(); }
    };
    surface.addEventListener('pointercancel', abort, options);
    surface.addEventListener('lostpointercapture', e => { if (e.target === surface && gesture) abort(e); }, options);
    surface.addEventListener('pointerleave', () => { if (gesture && !gesture.horizontal) reset(); }, options);
    surface.addEventListener('click', e => {
      if (performance.now() < suppressClickUntil && e.detail !== 0) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, {...options, capture:true});
    surface.addEventListener('dragstart', e => e.preventDefault(), options);
    return {cancel:abort, destroy:() => { abort(); controller.abort(); }};
  }

  function deck(surface) {
    const cards = Array.from(surface.querySelectorAll('[data-image]'));
    if (!cards.length) return () => {};
    const controller = new AbortController(), options = {signal:controller.signal};
    const middle = (cards.length - 1) / 2;
    let active = Math.floor(middle), frame = 0, pointerX = 0, bounds, step;
    let hovering = false, down = false, leaveTimer = 0;
    surface.classList.add('interactive-deck');
    cards.forEach((card, i) => {
      card.style.setProperty('--slot', i - middle);
      card.style.setProperty('--rank', cards.length - Math.abs(i - middle));
      card.querySelector('img').draggable = false;
    });
    function select(index) {
      active = (index + cards.length) % cards.length;
      cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
    }
    const measure = () => { bounds = surface.getBoundingClientRect(); step = parseFloat(getComputedStyle(surface).getPropertyValue('--deck-step')); };
    select(active);
    surface.addEventListener('pointerenter', e => {
      clearTimeout(leaveTimer); measure(); hovering = e.pointerType === 'mouse';
    }, options);
    surface.addEventListener('pointerdown', () => { down = true; clearTimeout(leaveTimer); }, options);
    surface.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || down || !hovering) return;
      pointerX = e.clientX;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const position = (pointerX - bounds.left - bounds.width / 2) / step + middle;
        const index = Math.max(0, Math.min(cards.length - 1, Math.round(position)));
        // Stable zones plus a small dead band avoid hover oscillation at overlapping edges.
        if (index !== active && Math.abs(position - active) > .62) select(index);
      });
    }, options);
    ['pointerup','pointercancel'].forEach(type => surface.addEventListener(type, e => {
      down = false;
      hovering = e.pointerType === 'mouse' && type === 'pointerup';
      if (hovering) measure();
    }, options));
    surface.addEventListener('pointerleave', e => {
      hovering = false;
      if (e.pointerType !== 'mouse') return;
      if (!surface.classList.contains('is-dragging')) {
        down = false;
        leaveTimer = setTimeout(() => { if (!surface.contains(document.activeElement)) select(Math.floor(middle)); }, 140);
      }
    }, options);
    cards.forEach((card, i) => {
      card.addEventListener('focus', () => select(i), options);
      card.addEventListener('keydown', e => {
        if (!['ArrowLeft','ArrowRight'].includes(e.key)) return;
        e.preventDefault(); select(active + (e.key === 'ArrowRight' ? 1 : -1)); cards[active].focus({preventScroll:true});
      }, options);
    });
    const drag = swipe(surface, {
      start:() => { hovering = false; },
      move:dx => surface.style.setProperty('--drag-x', Math.max(-75, Math.min(75, dx * .32)) + 'px'),
      end:direction => { surface.style.removeProperty('--drag-x'); if (direction) select(active + direction); },
      cancel:() => surface.style.removeProperty('--drag-x')
    });
    return () => { clearTimeout(leaveTimer); cancelAnimationFrame(frame); drag.destroy(); controller.abort(); };
  }
  return {animate, finish, enabled, loadImage, swipe, deck};
})();
