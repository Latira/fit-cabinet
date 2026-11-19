import { el } from '../utils/tags';

export function createFooter(): HTMLElement {
    const footer = el('footer');
    const footerWrapper = el('div', 'wrapper');
    const footerLogo = el('div', 'footer__logo');
    const footerCopyright = el('h3', 'footer__copyright', 'ⓒ FitCabinet 2026');
    const footerContent = el('div', 'footer__content');
    const footerIcon = el('div', 'footer__social-icon');
    const footerLinks = el('div', 'footer-link');
    const footerLinkLatira = el('a', 'footer-link', 'Latira');
    const footerLinkDarya = el('a', 'footer-link', 'DaryaDudkova');
    footerLinks.append(footerLinkLatira, footerLinkDarya);
    footerContent.append(footerIcon, footerLinks);    
    footerWrapper.append(footerLogo, footerCopyright, footerContent);
    footer.append(footerWrapper);
    return footer;
}