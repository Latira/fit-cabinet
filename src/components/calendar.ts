import { el, createBtn } from '../utils/tags';

interface ICalendarOptions {
  onChangeDate?: (date: Date) => void;
}

export function createCalendar(options?: ICalendarOptions): HTMLElement {
  let currentDate = new Date();

  const calendarBlock = el('div', 'food-diary__calendar calendar');

  function getWeekDays(date: Date): Date[] {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + i);
      days.push(nextDay);
    }
    return days;
  }

  function renderCalendar() {
    calendarBlock.innerHTML = '';
    const weekDays = getWeekDays(currentDate);
    const monthYearOptions: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const monthYearString = weekDays[0].toLocaleDateString('en-US', monthYearOptions).toUpperCase();
    const header = el('div', 'calendar__header');
    const prevBtn = createBtn('calendar__arrow calendar__arrow--prev', '◀');
    const nextBtn = createBtn('calendar__arrow calendar__arrow--next', '▶');
    const title = el('span', 'calendar__title', monthYearString);
    header.append(prevBtn, title, nextBtn);
    const grid = el('div', 'calendar__grid');
    const weekShortNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    weekDays.forEach((dayDate, index) => {
      const dayCell = el('div', 'calendar__day');
      const isSelected = dayDate.toDateString() === currentDate.toDateString();
      if (isSelected) {
        dayCell.classList.add('calendar__day--active');
      }
      const dayName = el('span', 'calendar__day-name', weekShortNames[index]);
      const dayNum = el('span', 'calendar__day-number', dayDate.getDate().toString());
      dayCell.append(dayName, dayNum);
      grid.append(dayCell);
      dayCell.addEventListener('click', () => {
        currentDate = dayDate;
        renderCalendar();
        if (options?.onChangeDate) {
          options.onChangeDate(dayDate);
        }
      });
    });
    calendarBlock.append(header, grid);
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentDate.setDate(currentDate.getDate() - 7);
      renderCalendar();
      if (options?.onChangeDate) {
        options.onChangeDate(currentDate);
      }
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentDate.setDate(currentDate.getDate() + 7);
      renderCalendar();
      if (options?.onChangeDate) {
        options.onChangeDate(currentDate);
      }
    });
  }
  renderCalendar();
  return calendarBlock;
}
