import { WEEKDAYS } from '../constants';

export const DateTool = {
  /**
   *
   * @param disparity - A numeric value for the disparity of the week counted from the current week.
   * @param disparity - There can be a positive numeric value for the future weeks and a negative numeric value for the past weeks.
   */
  calculateWeekRange(disparity: number = 0): {
    startDate?: Date;
    endDate?: Date;
  } {
    if (Math.abs(disparity * 10) % 10 > 0) {
      disparity = Math.ceil(disparity);
    }
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    return {
      startDate: new Date(
        startDate.setDate(
          startDate.getDay() !== WEEKDAYS.Sunday
            ? startDate.getDate() + (7 * disparity - startDate.getDay() + 1)
            : startDate.getDate() +
                (7 * (disparity - 1) + startDate.getDay() + 1),
        ),
      ),
      endDate: new Date(
        endDate.setDate(
          endDate.getDay() !== WEEKDAYS.Sunday
            ? endDate.getDate() + (7 * disparity - endDate.getDay() + 7)
            : endDate.getDate() + (7 * (disparity - 1) + endDate.getDay() + 7),
        ),
      ),
    };
  },
};
