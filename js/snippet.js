/*!
 * comingsoon_06 - Colorlib. No jQuery, no framework.
 * Behaviours: validate-form, flipclock
 */
(function () {
  'use strict';

  /* Required-field and email checks, shown as the design's own bubbles. */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function fieldOk(input) {
    var v = input.value.trim();
    if (input.type === 'email' || input.name === 'email') return EMAIL.test(v);
    return v !== '';
  }
  document.querySelectorAll('.validate-form').forEach(function (form) {
    var fields = form.querySelectorAll('.validate-input .input100, .validate-input input, .validate-input textarea');
    form.addEventListener('submit', function (event) {
      var ok = true;
      fields.forEach(function (f) {
        if (fieldOk(f)) return;
        (f.closest('.validate-input') || f.parentElement).classList.add('alert-validate');
        ok = false;
      });
      if (!ok) event.preventDefault();
    });
    fields.forEach(function (f) {
      f.addEventListener('focus', function () {
        (f.closest('.validate-input') || f.parentElement).classList.remove('alert-validate');
      });
    });
  });

  /* Flip clock: count down, flipping each card that changes. */
  var FLIP = {"D":35,"h":18};
  document.querySelectorAll('.flip-clock-wrapper').forEach(function (w) {
    var cards = [].slice.call(w.querySelectorAll('ul.flip'));
    if (!cards.length) return;
    var end = Date.now() + FLIP.D * 864e5 + FLIP.h * 36e5;
    function digits() {
      var t = Math.max(0, end - Date.now());
      var d = Math.floor(t / 864e5), h = Math.floor(t / 36e5) % 24, m = Math.floor(t / 6e4) % 60, s = Math.floor(t / 1e3) % 60;
      var p = function (n) { return ('0' + n).slice(-2); };
      var all = String(d).padStart(Math.max(2, cards.length - 6), '0') + p(h) + p(m) + p(s);
      return all.slice(-cards.length).split('');
    }
    function paint() {
      digits().forEach(function (n, i) {
        var ul = cards[i];
        var active = ul.querySelector('.flip-clock-active'), before = ul.querySelector('.flip-clock-before');
        var shown = active && active.querySelector('.inn');
        if (!shown || shown.textContent === n) return;
        if (before) before.querySelectorAll('.inn').forEach(function (x) { x.textContent = shown.textContent; });
        active.querySelectorAll('.inn').forEach(function (x) { x.textContent = n; });
        ul.classList.remove('play'); void ul.offsetWidth; ul.classList.add('play');
      });
    }
    paint();
    setInterval(paint, 1000);
  });
})();
