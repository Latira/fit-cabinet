import './styles/style.css';

const app = document.getElementById('app');

if (app) {

  const heading = document.createElement('h1');

  heading.textContent = 'FitCabinet в разработке';

  app.append(heading);
}