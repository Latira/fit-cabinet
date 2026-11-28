import { el } from '../../utils/tags';

export const WISHLIST_MESSAGES = {
  EMPTY: 'Your wishlist is empty. Add something!',
  NO_MATCH: 'No items match your current filter.',
} as const;

export function createWishlistEmptyState(message: string): HTMLElement {
  return el('div', 'gear-wish-list__empty', message);
}
