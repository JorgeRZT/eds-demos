export default async function decorate(block) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch('/nav.plain.html');
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections = doc.querySelectorAll(':scope > body > div');

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  // Section 1: Brand (logo)
  const brandSection = sections[0];
  if (brandSection) {
    const brand = document.createElement('div');
    brand.className = 'nav-brand';
    brand.innerHTML = brandSection.innerHTML;
    nav.append(brand);
  }

  // Hamburger button
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  nav.append(hamburger);

  // Section 2: Navigation links
  const navSection = sections[1];
  if (navSection) {
    const navLinks = document.createElement('div');
    navLinks.className = 'nav-sections';
    navLinks.innerHTML = navSection.innerHTML;

    // Add chevron to items with sub-menus
    navLinks.querySelectorAll(':scope > ul > li').forEach((li) => {
      const subMenu = li.querySelector('ul');
      if (subMenu) {
        li.classList.add('has-submenu');
        const toggle = document.createElement('span');
        toggle.className = 'nav-chevron';
        toggle.setAttribute('aria-hidden', 'true');
        li.querySelector(':scope > a').after(toggle);
      }
    });

    nav.append(navLinks);
  }

  // Section 3: Tools (phone, agencias, centro de ayuda)
  const toolsSection = sections[2];
  if (toolsSection) {
    const tools = document.createElement('div');
    tools.className = 'nav-tools';
    tools.innerHTML = toolsSection.innerHTML;
    nav.append(tools);
  }

  // Login button (built in JS per contract)
  const loginBtn = document.createElement('button');
  loginBtn.className = 'nav-login';
  loginBtn.textContent = 'Iniciar sesión';
  nav.append(loginBtn);

  // Hamburger toggle behavior
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
    hamburger.setAttribute('aria-expanded', String(!expanded));
  });

  // Sub-menu toggle on mobile (chevron click)
  nav.querySelectorAll('.has-submenu .nav-chevron').forEach((chevron) => {
    chevron.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const li = chevron.closest('li');
      li.classList.toggle('is-open');
    });
  });

  // Desktop hover for sub-menus
  nav.querySelectorAll('.has-submenu').forEach((li) => {
    li.addEventListener('mouseenter', () => {
      li.classList.add('is-open');
    });
    li.addEventListener('mouseleave', () => {
      li.classList.remove('is-open');
    });
  });

  // Close menu on resize to desktop
  const mql = window.matchMedia('(min-width: 900px)');
  mql.addEventListener('change', (e) => {
    if (e.matches) {
      nav.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-expanded', 'false');
      nav.querySelectorAll('.is-open').forEach((el) => el.classList.remove('is-open'));
    }
  });

  block.textContent = '';
  block.append(nav);
}
