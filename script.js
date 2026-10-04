(function () {
  'use strict';

  var ACCESS_KEY = '32343feb-57e8-4ac8-9581-4066c2ef7762';
  var ENDPOINT = 'https://api.web3forms.com/submit';

  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var modal = document.getElementById('booking-modal');
  var modalConfig = document.getElementById('modal-configuration');
  var toast = document.getElementById('toast');
  var toastTimer;

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.setAttribute('hidden', '');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isClosed = mobileMenu.hasAttribute('hidden');
      if (isClosed) {
        mobileMenu.removeAttribute('hidden');
      } else {
        mobileMenu.setAttribute('hidden', '');
      }
      menuToggle.setAttribute('aria-expanded', String(isClosed));
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Booking popup ---------- */
  function openModal(config) {
    if (!modal) return;
    if (config && modalConfig) modalConfig.value = config;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    var firstField = modal.querySelector('input');
    if (firstField) firstField.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-booking').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeMenu();
      openModal();
    });
  });

  document.querySelectorAll('.request-details').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-config'));
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Notification message ---------- */
  function showToast(title, message, isError) {
    if (!toast) {
      alert(title + '\n' + message);
      return;
    }
    var strong = toast.querySelector('strong');
    var span = toast.querySelector('span');
    if (strong) strong.textContent = title;
    if (span) span.textContent = message;
    toast.classList.toggle('error', !!isError);
    toast.removeAttribute('hidden');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      toast.setAttribute('hidden', '');
    }, 6000);
  }

  /* ---------- Inquiry forms (main form + popup form) ---------- */
  function isValidPhone(value) {
    var cleaned = value.replace(/[\s\-()]/g, '');
    return /^(\+?91)?[6-9]\d{9}$/.test(cleaned);
  }

  document.querySelectorAll('.js-inquiry-form').forEach(function (form) {
    // Hidden spam trap: real visitors never see or tick this
    var trap = document.createElement('input');
    trap.type = 'checkbox';
    trap.name = 'botcheck';
    trap.tabIndex = -1;
    trap.autocomplete = 'off';
    trap.style.display = 'none';
    form.appendChild(trap);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var phoneField = form.querySelector('[name="phone"]');
      if (phoneField && !isValidPhone(phoneField.value)) {
        showToast('Please check your phone number', 'Enter a valid 10-digit mobile number.', true);
        phoneField.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending…';
      submitBtn.disabled = true;

      var formData = new FormData(form);
      formData.append('access_key', ACCESS_KEY);
      formData.append('subject', 'New inquiry – Vrindavan Dham Housing');
      formData.append('from_name', 'Vrindavan Dham Website');

      fetch(ENDPOINT, { method: 'POST', body: formData })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            form.reset();
            closeModal();
            showToast(
              'Your inquiry has been received',
              'Our team will contact you shortly. Radhe Radhe!',
              false
            );
          } else {
            showToast(
              'Could not send your inquiry',
              'Please try again, or contact us on WhatsApp at 9619099639.',
              true
            );
          }
        })
        .catch(function () {
          showToast(
            'Could not send your inquiry',
            'Please check your internet and try again, or contact us on WhatsApp at 9619099639.',
            true
          );
        })
        .then(function () {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        });
    });
  });
})();
