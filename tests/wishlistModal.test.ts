// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { openWishItemModal } from '../src/pages/gearWishlist/wishlistModal';
import { type WishItem } from '../src/pages/gearWishlist/types';

describe('openWishItemModal', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  test('renders create mode with empty inputs and Add item submit button', () => {
    const onSave = vi.fn();
    openWishItemModal(onSave);

    expect(document.querySelector('#wishlist-item-form')).not.toBeNull();
    expect(document.querySelector('.wishlist-modal__btn--save')?.textContent).toBe('Add item');
    expect(document.querySelector<HTMLInputElement>('#wishlist-item-title')?.value).toBe('');
    expect(document.querySelector<HTMLInputElement>('#wishlist-item-price')?.value).toBe('');
    expect(document.querySelector<HTMLInputElement>('#wishlist-item-link')?.value).toBe('');
    expect(document.querySelector('.wishlist-modal__preview')?.children).toHaveLength(0);
  });

  test('prevents submission and focuses title input when title is empty or whitespace', () => {
    const onSave = vi.fn();
    openWishItemModal(onSave);

    const titleInput = document.querySelector<HTMLInputElement>('#wishlist-item-title')!;
    const form = document.querySelector<HTMLFormElement>('#wishlist-item-form')!;

    titleInput.value = '   ';
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(onSave).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(titleInput);
    expect(document.querySelector('#wishlist-item-form')).not.toBeNull();
  });

  test('calls onSave with trimmed values and closes modal on valid creation', () => {
    const onSave = vi.fn();
    openWishItemModal(onSave);

    const titleInput = document.querySelector<HTMLInputElement>('#wishlist-item-title')!;
    const priceInput = document.querySelector<HTMLInputElement>('#wishlist-item-price')!;
    const linkInput = document.querySelector<HTMLInputElement>('#wishlist-item-link')!;
    const form = document.querySelector<HTMLFormElement>('#wishlist-item-form')!;

    titleInput.value = '  Running Shoes  ';
    priceInput.value = '  $120  ';
    linkInput.value = '';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      {
        title: 'Running Shoes',
        price: '$120',
        link: undefined,
        image: undefined,
      },
      undefined
    );
    expect(document.querySelector('#wishlist-item-form')).toBeNull();
  });

  test('pre-fills fields in edit mode, allows removing image and passes existingId to onSave', () => {
    const existingItem: WishItem = {
      id: 7,
      title: 'Yoga Mat',
      price: '150 BYN',
      link: 'https://shop.local',
      image: 'data:image/png;base64,FAKEIMAGE',
    };
    const onSave = vi.fn();

    openWishItemModal(onSave, existingItem);

    expect(document.querySelector('.wishlist-modal__btn--save')?.textContent).toBe('Save');
    expect(document.querySelector<HTMLInputElement>('#wishlist-item-title')?.value).toBe(
      'Yoga Mat'
    );
    expect(document.querySelector<HTMLInputElement>('#wishlist-item-price')?.value).toBe('150 BYN');

    const previewImg = document.querySelector<HTMLImageElement>('.wishlist-modal__preview-img');
    expect(previewImg).not.toBeNull();
    expect(previewImg?.src).toBe('data:image/png;base64,FAKEIMAGE');

    const removeImgBtn = document.querySelector<HTMLButtonElement>('.wishlist-modal__remove-img')!;
    removeImgBtn.click();
    expect(document.querySelector('.wishlist-modal__preview-img')).toBeNull();

    const titleInput = document.querySelector<HTMLInputElement>('#wishlist-item-title')!;
    titleInput.value = 'Pro Yoga Mat';

    const form = document.querySelector<HTMLFormElement>('#wishlist-item-form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(onSave).toHaveBeenCalledWith(
      {
        title: 'Pro Yoga Mat',
        price: '150 BYN',
        link: 'https://shop.local',
        image: undefined,
      },
      7
    );
  });

  test('reads uploaded image file via FileReader and closes modal without saving on Cancel', async () => {
    const onSave = vi.fn();
    openWishItemModal(onSave);

    const fileInput = document.querySelector<HTMLInputElement>('#wishlist-item-image')!;
    const file = new File(['dummy'], 'shoes.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    fileInput.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      const img = document.querySelector<HTMLImageElement>('.wishlist-modal__preview-img');
      expect(img).not.toBeNull();
      expect(img?.src).toContain('data:image/png;base64');
    });

    const cancelBtn = document.querySelector<HTMLButtonElement>('.wishlist-modal__btn--cancel')!;
    cancelBtn.click();

    expect(onSave).not.toHaveBeenCalled();
    expect(document.querySelector('#wishlist-item-form')).toBeNull();
  });
});
