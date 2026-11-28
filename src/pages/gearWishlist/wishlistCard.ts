import { el, createBtn, createImg } from '../../utils/tags';
import { type WishItem } from './types';

export function createWishCard(
  item: WishItem,
  onEdit: (item: WishItem) => void,
  onDelete: (id: number) => void
): HTMLElement {
  const cardItem = el('div', 'gear-wish-list__card-item');

  if (item.image) {
    const imgWrap = el('div', 'gear-wish-list__card-img-wrap');
    const img = createImg('gear-wish-list__card-img', item.image, item.title);
    imgWrap.append(img);
    cardItem.append(imgWrap);
  }

  const title = el('h3', 'gear-wish-list__card-title', item.title);
  cardItem.append(title);

  if (item.price || item.link) {
    const metaWrap = el('div', 'gear-wish-list__card-meta');

    if (item.price) {
      metaWrap.append(el('span', 'gear-wish-list__card-price', item.price));
    }

    if (item.link) {
      const storeLink = document.createElement('a');
      storeLink.className = 'gear-wish-list__card-link';
      storeLink.href = item.link;
      storeLink.target = '_blank';
      storeLink.rel = 'noopener noreferrer';
      storeLink.textContent = 'Open link ↗';
      metaWrap.append(storeLink);
    }

    cardItem.append(metaWrap);
  }

  const cardActions = el('div', 'gear-wish-list__card-actions');
  const changeBtn = createBtn('gear-wish-list__change-btn', 'Change');
  const deleteBtn = createBtn('gear-wish-list__delete-btn', 'Delete');

  changeBtn.addEventListener('click', () => onEdit(item));
  deleteBtn.addEventListener('click', () => onDelete(item.id));

  cardActions.append(changeBtn, deleteBtn);
  cardItem.append(cardActions);

  return cardItem;
}
