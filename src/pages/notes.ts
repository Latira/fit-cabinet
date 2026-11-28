import { el } from '../utils/tags';

export function createNotes(): HTMLElement {
  const notes = el('main', 'notes');
  const title = el('h1', 'notes__title', 'notes');

  notes.append(title);
  return notes;
}
