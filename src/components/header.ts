import { el } from '../utils/tags';

export function createHeader(): HTMLElement {
    const header = el('header');
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
    menu.append(menuText, menuBurger);
    logoBack.append(logoImg, logoTitle);
    header.append(logoBack, menu);

    menu.addEventListener('click', () => {
      menuBurger.classList.toggle('is-active');
    });

    return header;
}
