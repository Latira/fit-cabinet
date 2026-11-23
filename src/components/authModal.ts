import { signInWithPopup, signOut } from 'firebase/auth';
import { el, createBtn, createInput } from '../utils/tags';
import { createModal } from './modal';
import { auth, githubProvider, googleProvider } from '../utils/firebase';
import googleIconSvg from '../img/icon--google.svg?raw';
import githubIconSvg from '../img/icon--github.svg?raw';

export type AuthProviderType = 'email' | 'google' | 'github';

export interface AuthUser {
    name: string;
    email: string;
    provider: AuthProviderType;
    linkedProviders?: AuthProviderType[];
}

const AUTH_STORAGE_KEY = 'fit_cabinet_user';

function createInlineIcon(svgRaw: string): HTMLElement {
    const iconWrap = el('span', 'auth-modal__social-icon');
    iconWrap.innerHTML = svgRaw;
    return iconWrap;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

export function updateUserProviders(newProvider: AuthProviderType, email?: string): AuthUser | null {
    const user = getCurrentUser();
    if (!user) return null;

    const currentLinked = user.linkedProviders || [user.provider];
    const updatedLinked = currentLinked.includes(newProvider)
        ? currentLinked
        : [...currentLinked, newProvider];

    const updatedUser: AuthUser = {
        ...user,
        email: email || user.email,
        linkedProviders: updatedLinked,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
}

export function logoutUser(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    signOut(auth).catch(() => {});
}

export function openAuthModal(onSuccess: () => void, onCancel?: () => void): void {
    if (document.querySelector('.auth-modal')) return;

    let isRegisterMode = false;

    const { modal, contentArea } = createModal({
        title: 'Welcome back',
        onClose: () => {
            if (!isAuthenticated() && onCancel) {
                onCancel();
            }
        },
    });

    modal.classList.add('auth-modal');

    const titleEl = modal.querySelector('.modal-window__title') as HTMLElement | null;
    const subtitle = el(
        'p',
        'auth-modal__subtitle',
        'Sign in to track your workouts, nutrition, and daily habits.'
    );

    const socialWrap = el('div', 'auth-modal__socials');

    const googleBtn = createBtn('auth-modal__social-btn');
    googleBtn.append(
        createInlineIcon(googleIconSvg),
        el('span', '', 'Continue with Google')
    );

    const githubBtn = createBtn('auth-modal__social-btn');
    githubBtn.append(
        createInlineIcon(githubIconSvg),
        el('span', '', 'Continue with GitHub')
    );

    socialWrap.append(googleBtn, githubBtn);

    const divider = el('div', 'auth-modal__divider');
    divider.append(el('span', 'auth-modal__divider-text', 'or with email'));

    const form = el('form', 'auth-modal__form');
    form.noValidate = true;

    const nameField = el('div', 'auth-modal__field');
    const nameLabel = el('label', 'auth-modal__label', 'Your name');
    nameLabel.htmlFor = 'auth-name';
    const nameInput = createInput('auth-modal__input', 'text', 'Alex Mercer', 'name');
    nameInput.id = 'auth-name';
    nameField.append(nameLabel, nameInput);
    nameField.hidden = true;

    const emailField = el('div', 'auth-modal__field');
    const emailLabel = el('label', 'auth-modal__label', 'Email address');
    emailLabel.htmlFor = 'auth-email';
    const emailInput = createInput('auth-modal__input', 'email', 'you@example.com', 'email');
    emailInput.id = 'auth-email';
    emailInput.required = true;
    emailField.append(emailLabel, emailInput);

    const passField = el('div', 'auth-modal__field');
    const passLabel = el('label', 'auth-modal__label', 'Password');
    passLabel.htmlFor = 'auth-password';
    const passInput = createInput('auth-modal__input', 'password', 'Minimum 4 characters', 'password');
    passInput.id = 'auth-password';
    passInput.minLength = 4;
    passInput.required = true;
    passField.append(passLabel, passInput);

    const errorMsg = el('p', 'auth-modal__error');
    errorMsg.hidden = true;

    const submitBtn = createBtn('auth-modal__submit', 'Sign In', 'submit');

    form.append(nameField, emailField, passField, errorMsg, submitBtn);

    const switchWrap = el('div', 'auth-modal__switch');
    const switchHint = el('span', 'auth-modal__switch-hint', "Don't have an account?");
    const switchBtn = createBtn('auth-modal__switch-btn', 'Create one');

    switchBtn.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        nameField.hidden = !isRegisterMode;
        nameInput.required = isRegisterMode;
        errorMsg.hidden = true;

        if (titleEl) {
            titleEl.textContent = isRegisterMode ? 'Create account' : 'Welcome back';
        }
        subtitle.textContent = isRegisterMode
            ? 'Start your fitness journey and save all progress locally.'
            : 'Sign in to track your workouts, nutrition, and daily habits.';
        submitBtn.textContent = isRegisterMode ? 'Sign Up' : 'Sign In';
        switchHint.textContent = isRegisterMode ? 'Already have an account?' : "Don't have an account?";
        switchBtn.textContent = isRegisterMode ? 'Sign In' : 'Create one';
    });

    switchWrap.append(switchHint, switchBtn);

    const completeLogin = (user: AuthUser) => {
        const userWithProviders: AuthUser = {
            ...user,
            linkedProviders: user.linkedProviders || [user.provider],
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithProviders));
        modal.remove();
        onSuccess();
    };

    const showError = (message: string) => {
        errorMsg.textContent = message;
        errorMsg.hidden = false;
    };

    emailInput.addEventListener('input', () => {
        if (!errorMsg.hidden) errorMsg.hidden = true;
    });

    passInput.addEventListener('input', () => {
        if (!errorMsg.hidden) errorMsg.hidden = true;
    });

    googleBtn.addEventListener('click', async () => {
        errorMsg.hidden = true;
        try {
            googleBtn.disabled = true;
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            completeLogin({
                name: user.displayName || 'Google User',
                email: user.email || 'user@gmail.com',
                provider: 'google',
            });
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Google sign-in failed.');
        } finally {
            googleBtn.disabled = false;
        }
    });

    githubBtn.addEventListener('click', async () => {
        errorMsg.hidden = true;
        try {
            githubBtn.disabled = true;
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;

            completeLogin({
                name: user.displayName || 'GitHub User',
                email: user.email || 'user@github.com',
                provider: 'github',
            });
        } catch (err) {
            showError(err instanceof Error ? err.message : 'GitHub sign-in failed.');
        } finally {
            githubBtn.disabled = false;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMsg.hidden = true;

        const email = emailInput.value.trim();

        if (!email) {
            showError('Please enter your email address.');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address (e.g. name@example.com).');
            emailInput.focus();
            return;
        }

        if (passInput.value.length < 4) {
            showError('Password must be at least 4 characters long.');
            passInput.focus();
            return;
        }

        const customName = nameInput.value.trim();
        const nameFromEmail = email.slice(0, email.indexOf('@')) || 'Athlete';

        completeLogin({
            name: isRegisterMode && customName ? customName : nameFromEmail,
            email,
            provider: 'email',
        });
    });

    contentArea.append(subtitle, socialWrap, divider, form, switchWrap);
    document.body.append(modal);
    emailInput.focus();
}
