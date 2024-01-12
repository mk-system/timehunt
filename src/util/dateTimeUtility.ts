import {
  format,
  isSameHour,
  isWithinInterval,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import ja from 'date-fns/locale/ja';
import en from 'date-fns/locale/en-US';
import { calendar_v3 } from 'googleapis';
import i18next from 'i18next';
import { getLanguage } from '../lib/env';

export type Element = [string, calendar_v3.Schema$Event[]];
export type GroupEvents = Element[];

const isFullDay = (start: Date, end: Date) => {
  const startOfBusinessDay = setSeconds(setMinutes(setHours(start, 9), 0), 0);
  const endOfBusinessDay = setSeconds(setMinutes(setHours(end, 19), 0), 0);
  return (
    isSameHour(start, startOfBusinessDay) && isSameHour(end, endOfBusinessDay)
  );
};

export const convertToJapaneseDateFormat = (
  date: Date,
  formatStr: string,
  locale: Locale = ja
) => {
  return format(date, formatStr, { locale });
};

const convertTo12HourFormat = (date: Date, locale: Locale = ja) => {
  return format(date, 'h:mm a', { locale });
};

export const getTimeStr = (start: string, end: string, locale: Locale = ja) => {
  const allDay = i18next.t('ALL_DAY');
  if (start === end) {
    return allDay;
  } else {
    const convertedStartTime = parseISO(start);
    const convertedEndTime = parseISO(end);

    if (isFullDay(convertedStartTime, convertedEndTime)) {
      return allDay;
    } else {
      const startTimeStr = convertTo12HourFormat(convertedStartTime, locale);
      const endTimeStr = isSameHour(convertedEndTime, 19)
        ? ''
        : `～${convertTo12HourFormat(convertedEndTime, locale)}`;
      return `${startTimeStr}${endTimeStr}`;
    }
  }
};

export const displayDateTimeRange = async (groupedEvents: GroupEvents) => {
  for (const [date, eventsOnDate] of groupedEvents) {
    const eventStrs = eventsOnDate.map((event: calendar_v3.Schema$Event) => {
      const { start, end } = getTimeStrFromEvent(event);
      return getTimeStr(start, end, getLanguage() == 'ja' ? ja : en);
    });
    console.log(
      `${convertToJapaneseDateFormat(
        parseISO(date),
        i18next.t('DATE_FORMAT')
      )} : ${eventStrs.join(' or ')}`
    );
  }
};

export const dividedDateTimeRange = (dateTimeRange: string) => {
  const [date, range] = dateTimeRange.split(' ');
  const [start, end] = range.split('-');
  const targetStartDateTime = parseISO(`${date}T${start}:00+09:00`);
  const targetEndDateTime = parseISO(`${date}T${end}:00+09:00`);
  return [targetStartDateTime, targetEndDateTime];
};

const getTimeStrFromEvent = (event: calendar_v3.Schema$Event) => {
  const start = event.start?.dateTime ?? event.start?.date ?? '';
  const end = event.end?.dateTime ?? event.end?.date ?? '';
  return { start, end };
};

const getMaxMinDates = (events: calendar_v3.Schema$Event[]) => {
  try {
    return events.reduce(
      (acc, event) => {
        const { start, end } = getTimeStrFromEvent(event);
        if (start && end) {
          const startDateTime = parseISO(start);
          const endDateTime = parseISO(end);
          return {
            minDate: startDateTime < acc.minDate ? startDateTime : acc.minDate,
            maxDate: endDateTime > acc.maxDate ? endDateTime : acc.maxDate,
          };
        }
        return acc;
      },
      {
        minDate: parseISO('9999-12-31T23:59:59'),
        maxDate: parseISO('0000-01-01T00:00:00'),
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const isInRange = (
  targetStartDateTime: Date,
  targetEndDateTime: Date,
  events: calendar_v3.Schema$Event[]
) => {
  const dates = getMaxMinDates(events);
  if (dates) {
    return (
      isWithinInterval(targetStartDateTime, {
        start: dates.minDate,
        end: dates.maxDate,
      }) &&
      isWithinInterval(targetEndDateTime, {
        start: dates.minDate,
        end: dates.maxDate,
      })
    );
  }
};

export const groupEventsByDate = (events: calendar_v3.Schema$Event[]) => {
  return events.reduce((acc, event) => {
    const { start } = getTimeStrFromEvent(event);
    if (start) {
      const key = format(parseISO(start), 'yyyy-MM-dd');
      const previous = acc[acc.length - 1];
      if (!previous) {
        acc.push([key, [event]]);
      } else {
        const [previousKey, previousEvents] = previous;
        if (previousKey !== key) {
          acc.push([key, [event]]);
        } else {
          previousEvents.push(event);
        }
      }
    }
    return acc;
  }, [] as GroupEvents);
};
