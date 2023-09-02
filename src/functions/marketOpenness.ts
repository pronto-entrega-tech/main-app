import { BusinessHours, Market, weekDayArray } from '~/core/models';
import { omit } from './converter';
import { range } from './range';

type NormalizedBHs = Omit<BusinessHours, 'days'> & {
  day: number;
};

export const marketOpenness = (market: Market) => {
  const { isOpen, nextHour, tomorrow } = isMarketOpen(market.business_hours);

  const openMsg = isOpen ? 'Aberto' : 'Fechado';
  const tomorrowMsg = tomorrow ? ' de amanhã' : '';

  return !nextHour ? openMsg : `${openMsg} até ${nextHour}${tomorrowMsg}`;
};

export const isMarketOpen = (
  business_hours: BusinessHours[],
  intervalDaysQuantity = 1,
) => {
  const removeZero = (text: string) => text.replace(/^.{0}0/, '');

  const date = new Date();
  const min = date.getMinutes();
  const hour = date.getHours();
  const weekday = date.getDay();

  const normalizeBH = (day: number) => (v: BusinessHours) => ({
    ...omit(v, 'days'),
    day,
  });
  const futureBHs = (() => {
    if (intervalDaysQuantity <= 1) return [];

    const intervalDays = range(1, intervalDaysQuantity - 1).map(
      (n) => (n + weekday) % 7,
    );

    return intervalDays.reduce((list, intervalDay) => {
      const bh = business_hours
        .filter(({ days }) => days.includes(weekDayArray[intervalDay]))
        .map(normalizeBH(intervalDay));

      return list.concat(bh);
    }, [] as NormalizedBHs[]);
  })();

  const todayBHs = business_hours.filter(({ days, close_time }) => {
    const [closeHour, closeMin] = close_time.split(':');
    const closeInSec = +closeHour * 60 + +closeMin;
    const nowInSec = hour * 60 + min;

    const isToday = days.includes(weekDayArray[weekday]);
    const isPast = closeInSec <= nowInSec;

    return isToday && !isPast;
  });
  if (todayBHs.length) {
    const [{ open_time, close_time }] = todayBHs;
    const openHour = +open_time.split(':')[0];

    const isOpen = hour >= openHour;
    return {
      isOpen,
      tomorrow: false,
      nextHour: removeZero(isOpen ? close_time : open_time),
      intervals: todayBHs.map(normalizeBH(weekday)).concat(futureBHs),
    };
  }

  const tomorrowWeekday = (weekday + 1) % 7;
  const tomorrowBHs = business_hours.filter(({ days }) =>
    days.includes(weekDayArray[tomorrowWeekday]),
  );
  if (tomorrowBHs.length) {
    const [{ open_time }] = tomorrowBHs;

    return {
      isOpen: false,
      tomorrow: true,
      nextHour: removeZero(open_time),
      intervals: futureBHs,
    };
  }

  return {
    isOpen: false,
    tomorrow: false,
    intervals: futureBHs,
  };
};
