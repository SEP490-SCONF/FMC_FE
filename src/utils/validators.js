import dayjs from "dayjs";

export const rangePickerValidator = (options = {}) => {
  const { noPast = false, maxDays } = options;
  return (_, value) => {
    if (!value || value.length !== 2) {
      return Promise.reject(new Error("Please select both start and end dates"));
    }

    const [start, end] = value;

    if (end.isBefore(start, "day")) return Promise.reject(new Error("End date cannot be before start date"));
    if (start.isSame(end, "day")) return Promise.reject(new Error("Start date and end date cannot be the same"));
    if (noPast && start.isBefore(dayjs(), "day")) return Promise.reject(new Error("Start date cannot be in the past"));
    if (maxDays && end.diff(start, "day") > maxDays) return Promise.reject(new Error(`Date range cannot exceed ${maxDays} days`));

    return Promise.resolve();
  };
};


export const timelineDateValidator = (existingTimelines = [], editingId = null) => {
  return async (_, value) => {
    if (!value) return Promise.reject("Please select date & time");

    const newDate = dayjs(value);

    const conflict = existingTimelines.some((tl) => {
      if (editingId && tl.timeLineId === editingId) return false;
      const diffHours = Math.abs(newDate.diff(dayjs(tl.date), "hour", true)); 
      return diffHours < 24; // nếu nhỏ hơn 24h thì báo lỗi
    });

    if (conflict) {
      return Promise.reject(
        new Error("Timelines must be at least 24 hours apart")
      );
    }

    return Promise.resolve();
  };
};

export const scheduleTimeValidator = (schedules, editingId = null) => {
  return async (_, value) => {
    if (!value || !value.presentationStartTime || !value.presentationEndTime) {
      return Promise.reject(new Error("Please select start and end time"));
    }

    const start = dayjs(value.presentationStartTime);
    const end = dayjs(value.presentationEndTime);

    // 1️⃣ Rule: start < end
    if (!start.isBefore(end)) {
      return Promise.reject(new Error("Start time must be before end time"));
    }

    // 2️⃣ Rule: không overlap với schedule khác
    const conflict = schedules.some((sch) => {
      if (editingId && sch.scheduleId === editingId) return false;

      const s = dayjs(sch.presentationStartTime);
      const e = dayjs(sch.presentationEndTime);

      // nếu có overlap thì fail
      return start.isBefore(e) && end.isAfter(s);
    });

    if (conflict) {
      return Promise.reject(
        new Error("Schedule time overlaps with another schedule")
      );
    }

    return Promise.resolve();
  };
};
