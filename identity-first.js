'use strict';
(() => {
  const input = document.getElementById('typeSample');
  const samples = document.querySelectorAll('[data-type-live]');
  const count = document.getElementById('typeCount');
  function update() {
    const text = input.value || 'Hangover, all night.';
    samples.forEach(sample => { sample.textContent = text; });
    count.textContent = input.value.length + ' / 28';
  }
  input.addEventListener('input', update);
  update();
})();
