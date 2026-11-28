import { el } from '../utils/tags';
import { navigateTo } from '../utils/router';

export function createHeader(): HTMLElement {
  const header = el('header');
  const headerWrapper = el('div', 'wrapper');
  const logoLink = el('a', 'logo-link');
  const logoBack = el('div', 'logo');
  const logoImg = el('div', 'logo__img');
  const logoTitle = el('p', 'logo__title', 'fitcabinet');
  const menu = el('div', 'menu');
  const menuText = el('div', 'menu__text', 'Menu');
  const menuBurger = el('div', 'menu__burger');
  const line1 = el('span', 'menu__line');
  const line2 = el('span', 'menu__line');
  const line3 = el('span', 'menu__line');
  menuBurger.append(line1, line2, line3);
  logoBack.append(logoImg, logoTitle);
  logoLink.append(logoBack);

  const burgerMenu = el('div', 'burger-menu');
  const nav = el('nav', 'burger-menu__nav');
  const menuList = el('ul', 'burger-menu__list');

  const menuItems = [
    { name: 'About Us', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Food Diary', path: '/food-diary' },
    { name: 'Workouts', path: '/workouts' },
    { name: 'Notes', path: '/notes' },
    { name: 'Gearwishlist', path: '/wishlist' },
    { name: 'Settings', path: '/settings' },
    { name: 'Log Out', path: '/logout' },
  ];

  const pageContainer = document.querySelector('.app-content') as HTMLElement;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuBurger.classList.remove('is-active');
    burgerMenu.classList.remove('is-open');
    document.body.classList.remove('scroll-lock');
  };

  menuItems.forEach((item) => {
    const listItem = el('li', 'burger-menu__item');
    const link = el('a', 'burger-menu__link', item.name);
    link.setAttribute('href', item.path);

    if (window.location.pathname === item.path) {
      listItem.classList.add('is-active');
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      menuList.querySelectorAll('.burger-menu__item').forEach((el) => {
        el.classList.remove('is-active');
      });
      listItem.classList.add('is-active');

      closeMenu();

      const container = pageContainer || (document.querySelector('.app-content') as HTMLElement);
      if (container) {
        navigateTo(item.path, container);
      }
    });

    listItem.append(link);
    menuList.append(listItem);
  });

  nav.append(menuList);
  burgerMenu.append(nav);

  menu.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('.burger-menu')) return;
    const isOpen = menu.classList.toggle('is-open');
    menuBurger.classList.toggle('is-active');
    burgerMenu.classList.toggle('is-open');
    if (isOpen) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }
  });

  burgerMenu.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu') && burgerMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  logoLink.addEventListener('click', (event) => {
    event.preventDefault();

    menuList.querySelectorAll('.burger-menu__item').forEach((el) => {
      el.classList.remove('is-active');
    });
    closeMenu();

    const pageContainer = document.querySelector('.app-content') as HTMLElement;
    if (pageContainer) {
      navigateTo('/', pageContainer);
    }
  });

  menu.append(menuText, menuBurger, burgerMenu);
  headerWrapper.append(logoLink, menu);
  header.append(headerWrapper);
  return header;
}
