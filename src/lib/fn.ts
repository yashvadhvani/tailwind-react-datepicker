export const usePreviousDate = (date: any) => {
  const display = [];
  for (let i = 0; i <= date.date(0).day(); i += 1) {
    display.push(date.date(0).subtract(i, 'day'));
  }
  return display.sort((a, b) => a.date() - b.date());
};

export const useCurrentDate = (date: any) =>
  Array.from(
    {
      length: date.daysInMonth(),
    },
    (v, k) => {
      if (v || k) {
        return date.date(k + 1);
      }
      return date.date(k + 1);
    },
  );

export const useNextDate = (date: any) => {
  const display = [];
  for (let i = 1; i <= 42 - (usePreviousDate(date).length + date.daysInMonth()); i += 1) {
    display.push(date.date(i).month(date.month()).add(1, 'month'));
  }
  return display;
};

export const useDisableDate = (date: any, { disableDate }: any) => {
  if (typeof disableDate === 'function') {
    return disableDate(date.toDate());
  }
  return false;
};

export const useBetweenRange = (date: any, { previous, next }: any) => {
  let pattern;
  if (previous.isAfter(next, 'date')) {
    pattern = '(]';
  } else {
    pattern = '[)';
  }
  return !!(date.isBetween(previous, next, 'date', pattern) && !date.off);
};

export const useToValueFromString = (date: any, { formatter }: any) => date.format(formatter.date);

export const useToValueFromArray = ({ previous, next }: any, { formatter, separator }: any) =>
  `${previous.format(formatter.date)}${separator}${next.format(formatter.date)}`;

export const useVisibleViewport = (el: any) => {
  const { right } = el.getBoundingClientRect();
  const vWidth = window.innerWidth || document.documentElement.clientWidth;

  return right < vWidth;
};
