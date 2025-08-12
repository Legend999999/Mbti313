const menu = document.createElement('div');
menu.className = 'menu-dots';

menu.innerHTML = `
  <div id="hamburger" tabindex="0" aria-label="Menu button" role="button">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="dropdown-menu" aria-hidden="true">
    <div class="dropdown-item">Option 1</div>
    <div class="dropdown-item">Option 2</div>
 
  </div>
`;

document.body.appendChild(menu);

const hamburger = menu.querySelector('#hamburger');
const dropdown = menu.querySelector('.dropdown-menu');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  const isActive = menu.classList.contains('active');
  dropdown.setAttribute('aria-hidden', !isActive);
});

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target)) {
    menu.classList.remove('active');
    dropdown.setAttribute('aria-hidden', 'true');
  }
});
