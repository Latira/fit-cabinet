import './styles/style.scss';
import { createHeader } from './components/header';
import { renderRoute } from './utils/router';
import { el } from './utils/tags';

document.addEventListener('DOMContentLoaded', () => {
  const headerElement = createHeader();
  const pageContainer = el('div', 'app-content');

  document.body.append(headerElement, pageContainer);

  renderRoute(pageContainer);

  window.addEventListener('popstate', () => {
    renderRoute(pageContainer);
  });
});