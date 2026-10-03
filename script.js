const menuButton = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const modal = document.querySelector('#booking-modal');
const modalConfiguration = document.querySelector('#modal-configuration');
const toast = document.querySelector('#toast');
let toastTimer;

function setMenu(open) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function openBooking(configuration = '550 Sq Ft') {
  modalConfiguration.value = configuration;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('input').focus(), 0);
}

function closeBooking() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

function showSuccess() {
  clearTimeout(toastTimer);
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
}

menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.querySelectorAll('.open-booking').forEach((button) => button.addEventListener('click', () => openBooking()));
document.querySelectorAll('.request-details').forEach((button) => button.addEventListener('click', () => openBooking(button.dataset.config)));
document.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeBooking));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeBooking(); });
document.querySelectorAll('.js-inquiry-form').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  closeBooking();
  showSuccess();
}));
