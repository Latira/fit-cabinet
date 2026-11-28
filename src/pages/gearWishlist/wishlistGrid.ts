import { type RenderGridOptions } from './types';
import { createWishCard } from './wishlistCard';
import { createWishlistEmptyState, WISHLIST_MESSAGES } from './wishlistEmptyState';

export function renderWishlistGrid({
  gridContainer,
  cardAdd,
  showMoreBtn,
  totalItemsCount,
  filteredItems,
  isExpanded,
  visibleLimit,
  onEdit,
  onDelete,
}: RenderGridOptions): void {
  gridContainer.replaceChildren();
  gridContainer.append(cardAdd);

  if (totalItemsCount === 0) {
    gridContainer.append(createWishlistEmptyState(WISHLIST_MESSAGES.EMPTY));
    showMoreBtn.hidden = true;
    return;
  }

  if (filteredItems.length === 0) {
    gridContainer.append(createWishlistEmptyState(WISHLIST_MESSAGES.NO_MATCH));
    showMoreBtn.hidden = true;
    return;
  }

  const visibleItems = isExpanded ? filteredItems : filteredItems.slice(0, visibleLimit);
  const fragment = document.createDocumentFragment();

  visibleItems.forEach((item) => {
    fragment.append(createWishCard(item, onEdit, onDelete));
  });

  gridContainer.append(fragment);

  if (filteredItems.length > visibleLimit) {
    showMoreBtn.hidden = false;
    showMoreBtn.textContent = isExpanded ? 'Show less' : 'Show more';
  } else {
    showMoreBtn.hidden = true;
  }
}
