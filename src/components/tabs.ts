import { el, createBtn } from '../utils/tags';

export interface TabItem {
  id: string;
  label: string;
  content: HTMLElement;
}

export function createTabs(baseClass: string, items: TabItem[]): HTMLElement {
  const container = el('div', baseClass);
  const nav = el('nav', `${baseClass}__nav`);
  const panelsContainer = el('div', `${baseClass}__panels`);

  const buttons: HTMLButtonElement[] = [];
  const panels: HTMLElement[] = [];

  const setActiveTab = (activeIndex: number) => {
    buttons.forEach((btn, idx) => {
      btn.classList.toggle(`${baseClass}__tab--active`, idx === activeIndex);
    });

    panels.forEach((panel, idx) => {
      const isActive = idx === activeIndex;
      panel.hidden = !isActive;
      panel.style.display = isActive ? '' : 'none';
    });
  };

  items.forEach((item, index) => {
    const btn = createBtn(`${baseClass}__tab`, item.label);
    const panel = el('div', `${baseClass}__panel`);
    panel.append(item.content);

    btn.addEventListener('click', () => setActiveTab(index));

    buttons.push(btn);
    panels.push(panel);
    nav.append(btn);
    panelsContainer.append(panel);
  });

  if (items.length > 0) {
    setActiveTab(0);
  }

  container.append(nav, panelsContainer);
  return container;
}
