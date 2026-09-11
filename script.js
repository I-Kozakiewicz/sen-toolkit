/* Keep purchase routing separate from presentation. Replace null resource URLs
   with verified listing URLs; a future checkout integration can use the same IDs.
   Digital delivery and payments must be implemented by a secure provider/backend. */
const commerce = Object.freeze({
  provider: 'etsy',
  shopUrl: 'https://www.etsy.com/shop/TheSENandCoToolkit',
  resources: { 'daily-living': null, communication: null, routines: null }
});
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
menu.hidden = false;
function closeMenu() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu';
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
});
window.matchMedia('(max-width: 760px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-purchase]').forEach(link => {
  link.href = commerce.resources[link.dataset.purchase] || commerce.shopUrl;
});
document.querySelector('#year').textContent = new Date().getFullYear();
const form = document.querySelector('#contact-form');
const request = document.querySelector('#request-copy');
const status = document.querySelector('#form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  const idea = form.elements.message.value.trim();
  if (!idea) { form.elements.message.setCustomValidity('Please describe your idea.'); form.elements.message.reportValidity(); return; }
  const name = form.elements.name.value.trim();
  request.value = `Hello SEN & Co,\n\nI would like to discuss: ${form.elements.resource.value}.\n\n${idea}${name ? `\n\nFrom ${name}` : ''}`;
  document.querySelector('#request-result').hidden = false;
  const emailLink = document.querySelector('#open-email');
  emailLink.href = 'mailto:thesenandcotoolkitstudio@hotmail.com?subject=' + encodeURIComponent('Custom design request: ' + form.elements.resource.value) + '&body=' + encodeURIComponent(request.value);
  status.textContent = 'Your email is ready. Choose Open email app to review and send it. If you use webmail, copy the request and email thesenandcotoolkitstudio@hotmail.com.';
  request.focus();
});
form.elements.message.addEventListener('input', () => form.elements.message.setCustomValidity(''));
document.querySelector('#copy-request').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(request.value); status.textContent = 'Copied. Paste your request into an email to thesenandcotoolkitstudio@hotmail.com.'; }
  catch { request.focus(); request.select(); status.textContent = 'Your request is selected. Use your device’s Copy command, then paste it into your email.'; }
});
