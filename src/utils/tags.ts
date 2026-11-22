export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = ''
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

export const createBtn = (
  className: string,
  text = '',
  type: 'button' | 'submit' | 'reset' = 'button'
): HTMLButtonElement => {
  const btn = el('button', className, text);
  btn.type = type;
  return btn;
};

export const createImg = (
  className: string,
  src: string,
  alt = ' '
): HTMLImageElement => {
  const img = el('img', className);
  img.src = src;
  img.alt = alt;
  return img;
}

type InputType = 'text' | 'number' | 'password' | 'email' | 'file' | 'checkbox' | 'radio' | 'time';

export const createInput = (
  className: string,
  type: InputType = 'text',
  placeholder = '',
  name = ''
): HTMLInputElement => {
  const input = el('input', className);
  input.type = type;
  if (placeholder) input.placeholder = placeholder;
  if (name) input.name = name;
  return input;
};

export function createSvgIcon(markup: string, className: string): SVGSVGElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup.trim(), 'image/svg+xml');
    const svg = document.importNode(doc.documentElement, true) as unknown as SVGSVGElement;

    svg.classList.add(...className.split(' ').filter(Boolean));
    return svg;
}

export function isToday(isoDate: string): boolean {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return false;

    const now = new Date();
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}
