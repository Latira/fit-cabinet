import { el } from '../utils/tags';

export function createAbout(): HTMLElement {
  const about = el('main', 'about-team');
  const title = el('h1', 'about__title', 'about us'); 
  about.append(title); 
  return about;
}