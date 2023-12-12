import { format, isSameHour, isWithinInterval, parseISO } from 'date-fns';
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

export const displayDateTimeRange = async (groupedEvents: GroupEvents) => {
  for (const [date, eventsOnDate] of groupedEvents) {
    const eventStrs = eventsOnDate.map((event: calendar_v3.Schema$Event) => {
      const start = event.start?.dateTime ?? event.start?.date ?? '';
      const end = event.end?.dateTime ?? event.end?.date ?? '';
      return getTimeStr(start, end);
    });
    console.log(
      `${convertToJapaneseDateFormat(
        parseISO(date),
        'yyyy年M月d日(E)'
      )} : ${eventStrs.join(' or ')}`
    );
  }
};

export const isInRange = (
  dateTimeRange: string,
  events: calendar_v3.Schema$Event[]
) => {
  const [date, range] = dateTimeRange.split(' ');
  const [start, end] = range.split('-');
  const targetStartDateTime = parseISO(`${date}T${start}:00+09:00`);
  const targetEndDateTime = parseISO(`${date}T${end}:00+09:00`);

  return events.some((event) => {
    const start = event.start!.dateTime || event.start!.date;
    const end = event.end!.dateTime || event.end!.date;

    if (start && end) {
      const startDate = parseISO(start);
      const endDate = parseISO(end);

      return (
        isWithinInterval(targetStartDateTime, {
          start: startDate,
          end: endDate,
        }) &&
        isWithinInterval(targetEndDateTime, {
          start: startDate,
          end: endDate,
        })
      );
    }

    return false;
  });
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
