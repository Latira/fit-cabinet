import './styles/style.scss';
import { createHeader } from './components/header';
import { createFooter } from './components/footer';
import { renderRoute } from './utils/router';
import { el } from './utils/tags';
import { getInitialTheme, applyTheme } from './components/theme';

applyTheme(getInitialTheme());

document.addEventListener('DOMContentLoaded', () => {
  const headerElement = createHeader();
  const footerElement = createFooter();
  const pageContainer = el('div', 'app-content');

  document.body.append(headerElement, pageContainer, footerElement);

  renderRoute(pageContainer);

  window.addEventListener('popstate', () => {
    renderRoute(pageContainer);
  });

  document.body.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.getAttribute('href')?.startsWith('/')) {
      event.preventDefault();
      
      const path = link.getAttribute('href')!;
      
      window.history.pushState({}, '', path);
      renderRoute(pageContainer);
    }
  });
});
