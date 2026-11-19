import './styles/style.scss';
import { createHeader } from './components/header';
import { createFooter } from './components/footer';
import { renderRoute } from './utils/router';
import { el } from './utils/tags';

document.addEventListener('DOMContentLoaded', () => {
  const headerElement = createHeader();
  const footerElement = createFooter();
  const pageContainer = el('div', 'app-content');

  document.body.append(headerElement, pageContainer, footerElement);

  renderRoute(pageContainer);

  window.addEventListener('popstate', () => {
    renderRoute(pageContainer);
  });
});