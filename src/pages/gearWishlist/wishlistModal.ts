import { el, createBtn, createInput, createImg } from '../../utils/tags';
import { createModal } from '../../components/modal';
import { type WishItem } from './types';

export function openWishItemModal(
    onSave: (itemData: Omit<WishItem, 'id'>, existingId?: number) => void,
    itemToEdit?: WishItem
): void {
    const isEdit = Boolean(itemToEdit);
    let uploadedImageBase64 = itemToEdit?.image || '';

    const footerActions = el('div', 'wishlist-modal__footer');
    const cancelBtn = createBtn('wishlist-modal__btn wishlist-modal__btn--cancel', 'Cancel');
    const submitBtn = createBtn(
        'wishlist-modal__btn wishlist-modal__btn--save',
        isEdit ? 'Save' : 'Add item',
        'submit'
    );
    submitBtn.setAttribute('form', 'wishlist-item-form');
    footerActions.append(cancelBtn, submitBtn);

    const { modal, contentArea } = createModal({
        title: isEdit ? 'Edit gear item' : 'Add new gear item',
        footerContent: footerActions,
    });

    const form = el('form', 'wishlist-modal__form');
    form.id = 'wishlist-item-form';

    const titleLabel = el('label', 'wishlist-modal__label', 'Item name *');
    titleLabel.htmlFor = 'wishlist-item-title';
    const titleInput = createInput(
        'wishlist-modal__input',
        'text',
        'e.g., Running Shoes, Yoga Mat...',
        'title'
    );
    titleInput.id = 'wishlist-item-title';
    titleInput.required = true;
    if (itemToEdit) titleInput.value = itemToEdit.title;

    const priceLabel = el('label', 'wishlist-modal__label', 'Price (optional)');
    priceLabel.htmlFor = 'wishlist-item-price';
    const priceInput = createInput(
        'wishlist-modal__input',
        'text',
        'e.g., $120 or 350 BYN',
        'price'
    );
    priceInput.id = 'wishlist-item-price';
    if (itemToEdit?.price) priceInput.value = itemToEdit.price;

    const linkLabel = el('label', 'wishlist-modal__label', 'Store link (optional)');
    linkLabel.htmlFor = 'wishlist-item-link';
    const linkInput = createInput(
        'wishlist-modal__input',
        'text',
        'https://...',
        'link'
    );
    linkInput.type = 'url';
    linkInput.id = 'wishlist-item-link';
    if (itemToEdit?.link) linkInput.value = itemToEdit.link;

    const imgLabel = el('label', 'wishlist-modal__label', 'Image (optional)');
    imgLabel.htmlFor = 'wishlist-item-image';

    const fileWrapper = el('div', 'wishlist-modal__file-wrap');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'wishlist-item-image';
    fileInput.className = 'wishlist-modal__file-input';

    const previewWrap = el('div', 'wishlist-modal__preview');
    const renderPreview = () => {
        previewWrap.replaceChildren();
        if (!uploadedImageBase64) return;

        const previewImg = createImg('wishlist-modal__preview-img', uploadedImageBase64, 'Preview');
        const removeImgBtn = createBtn('wishlist-modal__remove-img', 'Remove image');
        removeImgBtn.addEventListener('click', () => {
            uploadedImageBase64 = '';
            fileInput.value = '';
            renderPreview();
        });
        previewWrap.append(previewImg, removeImgBtn);
    };

    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            uploadedImageBase64 = String(reader.result || '');
            renderPreview();
        };
        reader.readAsDataURL(file);
    });

    renderPreview();
    fileWrapper.append(fileInput, previewWrap);

    form.append(
        titleLabel, titleInput,
        priceLabel, priceInput,
        linkLabel, linkInput,
        imgLabel, fileWrapper
    );
    contentArea.append(form);

    cancelBtn.addEventListener('click', () => modal.remove());

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleVal = titleInput.value.trim();
        if (!titleVal) {
            titleInput.focus();
            return;
        }

        onSave(
            {
                title: titleVal,
                price: priceInput.value.trim() || undefined,
                link: linkInput.value.trim() || undefined,
                image: uploadedImageBase64 || undefined,
            },
            itemToEdit?.id
        );

        modal.remove();
    });

    document.body.append(modal);
    titleInput.focus();
}
