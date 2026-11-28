import { signInWithPopup } from 'firebase/auth';
import { el, createBtn, createInput } from '../../utils/tags';
import {
  getCurrentUser,
  updateUserProviders,
  type AuthProviderType,
} from '../../components/authModal';
import { auth, githubProvider, googleProvider } from '../../utils/firebase';
import { createModal } from '../../components/modal';

const ALL_PROVIDERS: { id: AuthProviderType; label: string }[] = [
  { id: 'google', label: 'GOOGLE' },
  { id: 'github', label: 'GITHUB' },
  { id: 'email', label: 'EMAIL' },
];

export function createSecurityTab(): HTMLElement {
  const security = el('div', 'settings-security');

  const renderSecurityContent = () => {
    security.replaceChildren();
    const user = getCurrentUser();

    const signInRow = el('div', 'settings-security__row');
    const signInLabel = el('span', 'settings-security__label', 'Sign-in method:');
    const primaryMethod = user ? user.provider.toUpperCase() : 'NOT SIGNED IN';
    const signInValue = el('span', 'settings-security__value', primaryMethod);
    signInRow.append(signInLabel, signInValue);
    security.append(signInRow);

    if (!user) return;

    const linkedList: AuthProviderType[] = user.linkedProviders || [user.provider];

    ALL_PROVIDERS.forEach((item) => {
      if (item.id === user.provider) return;

      const isLinked = linkedList.includes(item.id);
      const row = el('div', 'settings-security__row');
      const label = el(
        'span',
        'settings-security__label',
        isLinked ? 'Linked account:' : 'Link account:'
      );

      if (isLinked) {
        const statusBadge = el('span', 'settings-security__value', `${item.label} ✓`);
        row.append(label, statusBadge);
      } else {
        const actionBtn = createBtn('settings-security__action', item.label);
        actionBtn.type = 'button';
        actionBtn.addEventListener('click', () => handleLinkProvider(item.id, actionBtn));
        row.append(label, actionBtn);
      }

      security.append(row);
    });
  };

  const openLinkEmailModal = () => {
    if (document.querySelector('.link-email-modal')) return;

    const footer = el('div', 'wishlist-modal__footer');
    const cancelBtn = createBtn('wishlist-modal__btn wishlist-modal__btn--cancel', 'Cancel');
    const saveBtn = createBtn(
      'wishlist-modal__btn wishlist-modal__btn--save',
      'Link Email',
      'submit'
    );
    saveBtn.setAttribute('form', 'link-email-form');
    footer.append(cancelBtn, saveBtn);

    const { modal, contentArea } = createModal({
      title: 'Link Email & Password',
      footerContent: footer,
    });
    modal.classList.add('link-email-modal');

    const form = el('form', 'wishlist-modal__form');
    form.id = 'link-email-form';

    const emailInput = createInput('wishlist-modal__input', 'email', 'you@example.com', 'email');
    emailInput.required = true;
    const passInput = createInput(
      'wishlist-modal__input',
      'password',
      'Create password (min 4 chars)',
      'password'
    );
    passInput.minLength = 4;
    passInput.required = true;

    form.append(emailInput, passInput);
    contentArea.append(form);

    cancelBtn.addEventListener('click', () => modal.remove());
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = emailInput.value.trim();
      if (!emailVal || passInput.value.length < 4) return;

      updateUserProviders('email', emailVal);
      modal.remove();
      renderSecurityContent();
    });

    document.body.append(modal);
    emailInput.focus();
  };

  const handleLinkProvider = async (providerId: AuthProviderType, btn: HTMLButtonElement) => {
    if (providerId === 'email') {
      openLinkEmailModal();
      return;
    }

    const originalText = btn.textContent;
    try {
      btn.disabled = true;
      btn.textContent = 'CONNECTING...';
      const fbProvider = providerId === 'google' ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth, fbProvider);
      updateUserProviders(providerId, result.user.email || undefined);
      renderSecurityContent();
    } catch {
      btn.textContent = originalText;
    } finally {
      btn.disabled = false;
    }
  };

  renderSecurityContent();
  return security;
}
