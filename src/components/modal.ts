import { el, createBtn } from '../utils/tags';

export interface ModalOptions {
    title: string;
    onClose?: () => void;
    footerContent?: HTMLElement;
}

export function createModal({ title, onClose, footerContent }: ModalOptions): {
    modal: HTMLElement;
    contentArea: HTMLElement;
} {
    const modal = el('div', 'modal-overlay');
    const modalContent = el('div', 'modal-window');

    const header = el('div', 'modal-window__header');
    const titleEl = el('h2', 'modal-window__title', title);
    const closeBtn = createBtn('modal-window__close', '×');
    header.append(titleEl, closeBtn);

    const contentArea = el('div', 'modal-window__body');

    const footer = el('div', 'modal-window__footer');
    if (footerContent) {
        footer.append(footerContent);
    }

    modalContent.append(header, contentArea);
    if (footerContent) modalContent.append(footer);
    modal.append(modalContent);

    const closeModal = () => {
        modal.remove();
        if (onClose) onClose();
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    return { modal, contentArea };
}