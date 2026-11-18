import './styles/style.scss';
import { createHeader } from './components/header';

document.addEventListener('DOMContentLoaded', () => {
  const headerElement = createHeader();
  document.body.appendChild(headerElement);
});