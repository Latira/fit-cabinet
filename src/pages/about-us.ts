import { el } from '../utils/tags';

export function createAbout(): HTMLElement {
  const about = el('main', 'about');
  const title = el('h1', 'about__title', 'about us');
  const aboutTeam = el('div', 'about__list');

  const aboutCardDarya = el('div', 'about__card');
  const cardDaryaName = el('h2', 'about__name', 'DARYA');
  const cardDaryaLink = el('a', 'about__github-link', 'DARYADUDKOVA98');
  cardDaryaLink.setAttribute('href', 'https://github.com/DaryaDudkova98');
  cardDaryaLink.setAttribute('target', '_blank');
  const cardDaryaBio = el('p', 'about__bio', 'Реализация модального окна авторизации (Firebase: Google, Github) и email/пароль, за страницу настроек, тренировок и упражнений (с API фильтрацией по группам мышц и кэшированием в локальное хранилище), а также вишлиста.');
  aboutCardDarya.append(cardDaryaName, cardDaryaLink, cardDaryaBio);

  const divider = el('div', 'about__divider');

  const aboutCardTanya = el('div', 'about__card');
  const cardTanyaName = el('h2', 'about__name', 'TANYA');
  const cardTanyaLink = el('a', 'about__github-link', 'LATIRA');
  cardTanyaLink.setAttribute('href', 'https://github.com/Latira');
  cardTanyaLink.setAttribute('target', '_blank');
  const cardTanyaBio = el('p', 'about__bio', 'Реализация страниц Dashboard, About Us и Food Diary, компонентов header и footer, настройка логики калькулятора калорий и хранения данных о питании в LocalStorage по датам (HTML5, CSS3, TypeScript, Vite, Vitest)');
  aboutCardTanya.append(cardTanyaName, cardTanyaLink, cardTanyaBio);

  aboutTeam.append(aboutCardDarya, divider, aboutCardTanya);

  const aboutProject = el('div', 'about__project');
  const aboutProjectIntro = el('p', 'about__project__intro', 'FitCabinet - это единый центр привычек для спортсменов-любителей.');
  const projectProblem = `Проблема: Спортсмен-любитель вынужден держать 5-7 приложений: в одном он считает шаги, в другом — калории, в третьем ведет дневник тренировок, в четвертом ставит будильник для медитации. В итоге он бросает всё, потому что это отнимает слишком много времени.`;
  const projectSolution = `Решение: Наше приложение собирает все ключевые привычки для спорта в одном месте. Но вместо сложных графиков и профессиональных таблиц, оно предлагает простую форму наблюдения. Пользователь не «управляет данными», а просто наблюдает за собой: отмечает, выпил ли воду, выспался ли, сделал ли зарядку.`;
  const aboutProjectText = el('p', 'about__project__text', `${projectProblem}\n\n${projectSolution}`);
  
  aboutProject.append(aboutProjectIntro, aboutProjectText);

  about.append(title, aboutTeam, aboutProject); 
  return about;
}