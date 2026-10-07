const galleryButtons = [...document.querySelectorAll('.toilet-gallery button')];
galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
 const hero = document.querySelector('#toilet-hero');
 hero.src = button.dataset.image; hero.alt = button.dataset.alt;
 galleryButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 document.querySelector('#gallery-status').textContent = `Image ${index + 1} of 10: ${button.dataset.alt}`;
}));