export const weekDayArray = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
] as const;
export type weekDay = typeof weekDayArray[number];

type HoursInterval = {
  open_time: string;
  close_time: string;
}[];

export type businessHours = {
  days: weekDay[];
  hours: HoursInterval;
}[];

export type dateHours = {
  date: string;
  reason_code: number;
  reason_name: string;
  hours?: HoursInterval;
};
