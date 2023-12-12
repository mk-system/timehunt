import { format, isSameHour, parseISO } from 'date-fns';
import ja from 'date-fns/locale/ja';
import { calendar_v3 } from 'googleapis';

export type Element = [string, calendar_v3.Schema$Event[]];
export type GroupEvents = Element[];

const isFullDay = (start: Date, end: Date) => {
  return isSameHour(start, 9) && isSameHour(end, 19);
};

export const convertToJapaneseDateFormat = (
  date: Date,
  formatStr: string,
  locale: Locale = ja
) => {
  return format(date, formatStr, { locale });
};

const formatTime = (date: Date) => {
  return convertToJapaneseDateFormat(date, 'HH:mm');
};

export const getTimeStr = (start: string, end: string) => {
  if (start === end) {
    return '終日';
  } else {
    const convertedStartTime = parseISO(start);
    const convertedEndTime = parseISO(end);

    if (isFullDay(convertedStartTime, convertedEndTime)) {
      return '終日';
    } else {
      const startTimeStr = formatTime(convertedStartTime);
      const endTimeStr = isSameHour(convertedEndTime, 19)
        ? ''
        : `～${formatTime(convertedEndTime)}`;
      return `${startTimeStr}${endTimeStr}`;
    }
  }
};

export const displayDateTimeRange = async (
  events: calendar_v3.Schema$Event[]
) => {
  events.map((beforeEvent: calendar_v3.Schema$Event) => {
    const start =
      (beforeEvent.start?.dateTime as string) ||
      (beforeEvent.start?.date as string);
    const end =
      (beforeEvent.end?.dateTime as string) ||
      (beforeEvent.end?.date as string);
    const timeStr = getTimeStr(start, end);
    console.log(
      `${convertToJapaneseDateFormat(
        parseISO(start),
        'yyyy年M月d日(E)'
      )} : ${timeStr}`
    );
  });
};

export const isInRange = (
  dateTimeRange: string,
  events: calendar_v3.Schema$Event[]
) => {
  events.map(() => {
    const [startRange, endRange] = dateTimeRange
      .split('-')
      .map((d) => new Date(d.trim()));

    return events.some((event) => {
      const start = new Date(event.start?.dateTime as string);
      const end = new Date(event.end?.dateTime as string);
      return (
        (start >= startRange && start <= endRange) ||
        (end >= startRange && end <= endRange)
      );
    });
  });
  return false;
};

export const groupEventsByDate = (events: calendar_v3.Schema$Event[]) => {
  return events.reduce((acc, event) => {
    const start = event.start?.dateTime || event.start?.date;
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
