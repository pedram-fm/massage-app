declare module 'moment-jalaali' {
  import moment from 'moment';

  interface MomentJalaali extends moment.Moment {
    jYear(): number;
    jYear(year: number): MomentJalaali;
    jMonth(): number;
    jMonth(month: number): MomentJalaali;
    jDate(): number;
    jDate(date: number): MomentJalaali;
    jDayOfYear(): number;
    jDayOfYear(day: number): MomentJalaali;
    jWeek(): number;
    jWeek(week: number): MomentJalaali;
    jWeekYear(): number;
    jWeekYear(year: number): MomentJalaali;
    format(format?: string): string;
    startOf(unit: moment.unitOfTime.StartOf): MomentJalaali;
    endOf(unit: moment.unitOfTime.StartOf): MomentJalaali;
    add(amount: moment.DurationInputArg1, unit?: moment.DurationInputArg2): MomentJalaali;
    subtract(amount: moment.DurationInputArg1, unit?: moment.DurationInputArg2): MomentJalaali;
    clone(): MomentJalaali;
  }

  interface MomentJalaaliStatic extends moment.MomentStatic {
    (inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): MomentJalaali;
    unix(timestamp: number): MomentJalaali;
    utc(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): MomentJalaali;
    loadPersian(config?: { usePersianDigits?: boolean; dialect?: string }): void;
    jDaysInMonth(year: number, month: number): number;
  }

  const momentJalaali: MomentJalaaliStatic;
  export default momentJalaali;
}
