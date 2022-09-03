import { useState } from "react";
import { isBefore, add } from "date-fns";
import arrow from "../img/arrow.svg";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Calendar({
  today,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  booking,
  calendarId,
  singleCalendar,
  setSingleCalendar,
}) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  const [time, setTime] = useState({
    thisYear: year,
    nextYear: month + 1 > 11 ? year + 1 : year,
    thisMonth: month,
    nextMonth: month + 1 > 11 ? 0 : month + 1,
  });

  const changeMonth = (change) => {
    let { thisMonth, nextMonth, thisYear, nextYear } = time;
    if (change === "increase") {
      thisMonth += 1;
      nextMonth += 1;
      setTime({
        thisYear: thisMonth > 11 ? thisYear + 1 : thisYear,
        nextYear: nextMonth > 11 ? nextYear + 1 : nextYear,
        thisMonth: thisMonth > 11 ? 0 : thisMonth,
        nextMonth: nextMonth > 11 ? 0 : nextMonth,
      });
    } else if (change === "decrease") {
      thisMonth -= 1;
      nextMonth -= 1;
      setTime({
        thisYear: thisMonth < 0 ? thisYear - 1 : thisYear,
        nextYear: nextMonth < 0 ? nextYear - 1 : nextYear,
        thisMonth: thisMonth < 0 ? 11 : thisMonth,
        nextMonth: nextMonth < 0 ? 11 : nextMonth,
      });
    }
  };

  const createDates = (month, year) => {
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return Array.from({ length: 30 }, (_, i) => i + 1);
    } else if (month === 1) {
      return year % 4 === 0
        ? Array.from({ length: 29 }, (_, i) => i + 1)
        : Array.from({ length: 28 }, (_, i) => i + 1);
    } else {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }
  };

  const calcDates = (year, month) => {
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return 30;
    } else if (month === 1) {
      return year % 4 === 0 ? 29 : 28;
    } else {
      return 31;
    }
  };

  const getFirstDayOfMonth = (year, month) => {
    const start = new Date(year, month, 1).getDay() + 1;
    if (start === 1) {
      return "col-start-1";
    } else if (start === 2) {
      return "col-start-2";
    } else if (start === 3) {
      return "col-start-3";
    } else if (start === 4) {
      return "col-start-4";
    } else if (start === 5) {
      return "col-start-5";
    } else if (start === 6) {
      return "col-start-6";
    } else if (start === 7) {
      return "col-start-7";
    }
  };

  const selectRange = (year, month, date) => {
    let [infoYear, infoMonth, infoDate] =
      startDate === 0 ? [] : startDate.split("-");
    if (startDate === 0) {
      setStartDate(`${year}-${month}-${date}`);
      setEndDate(0);
    } else if (
      `${infoYear}${infoMonth}${infoDate}` === `${year}${month}${date}` ||
      endDate !== 0
    ) {
      setStartDate(`${year}-${month}-${date}`);
      setEndDate(0);
    } else if (endDate === 0) {
      let newStartDate = new Date(infoYear, infoMonth, infoDate);
      let newEndDate = new Date(year, month, date);

      if (isBefore(newEndDate, newStartDate)) {
        setEndDate(`${infoYear}-${infoMonth}-${infoDate}`);
        setStartDate(`${year}-${month}-${date}`);
      } else {
        setEndDate(`${year}-${month}-${date}`);
      }
    }
  };

  const selectSingle = (year, month, date, calendarId) => {
    const [startInfoYear, startInfoMonth, startInfoDate] = startDate.split("-");
    const [endInfoYear, endInfoMonth, endInfoDate] = endDate.split("-");
    const start = new Date(startInfoYear, startInfoMonth, startInfoDate);
    const end = new Date(endInfoYear, endInfoMonth, endInfoDate);
    const selected = new Date(year, month, date);
    if (calendarId === "2") {
      if (`${year}-${month}-${date}` === startDate) {
        setSingleCalendar({ popCheckIn: false, popCheckOut: true });
        return;
      } else if (selected > end || `${year}-${month}-${date}` === endDate) {
        const newEnd = add(selected, { days: 1 });
        setStartDate(`${year}-${month}-${date}`);
        setEndDate(
          `${newEnd.getFullYear()}-${newEnd.getMonth()}-${newEnd.getDate()}`
        );
        setSingleCalendar({ popCheckIn: false, popCheckOut: true });
      } else {
        setStartDate(`${year}-${month}-${date}`);
        setSingleCalendar({ popCheckIn: false, popCheckOut: true });
      }
    } else if (calendarId === "3") {
      if (selected < start || `${year}-${month}-${date}` === startDate) {
        const newStart = add(selected, { days: -1 });
        setEndDate(`${year}-${month}-${date}`);
        setStartDate(
          `${newStart.getFullYear()}-${newStart.getMonth()}-${newStart.getDate()}`
        );
        setSingleCalendar({ popCheckIn: false, popCheckOut: false });
      } else {
        setEndDate(`${year}-${month}-${date}`);
        setSingleCalendar({ popCheckIn: false, popCheckOut: false });
      }
    }
  };

  const checkStartAndEnd = (targetYear, targetMonth, targetDate) => {
    const fullDate = `${targetYear}-${targetMonth}-${targetDate}`;
    if (startDate === fullDate) {
      return "border-primary rounded-full bg-primary text-white";
    } else if (endDate === fullDate) {
      return "border-secondary rounded-full bg-secondary text-white";
    } else {
      return "";
    }
  };

  const checkInvalid = (targetYear, targetMonth, targetDate) => {
    const fullDate = new Date(targetYear, targetMonth, targetDate);
    const today = new Date(year, month, date);
    const target = `${targetYear}-${
      targetMonth + 1 < 10
        ? "0" + (targetMonth + 1).toString()
        : targetMonth + 1
    }-${targetDate < 10 ? "0" + targetDate.toString() : targetDate}`;
    if (isBefore(fullDate, today) || booking.includes(target)) {
      return "line-through opacity-30 cursor-default pointer-events-none";
    } else {
      return "cursor-pointer";
    }
  };

  const checkSingleInvalid = (targetYear, targetMonth, targetDate) => {
    const fullDate = new Date(targetYear, targetMonth, targetDate);
    const today = new Date(year, month, date);
    if (isBefore(fullDate, today)) {
      return "line-through opacity-30 cursor-default pointer-events-none";
    } else {
      return "cursor-pointer";
    }
  };

  const checkDay = (year, month, date) => {
    return new Date(year, month, date).getDay();
  };

  const renderRange = (targetYear, targetMonth, targetDate) => {
    if (endDate === 0) return;
    const target = `${targetYear}-${targetMonth}-${targetDate}`;
    const [startInfoYear, startInfoMonth, startInfoDate] = startDate.split("-");
    const [endInfoYear, endInfoMonth, endInfoDate] = endDate.split("-");
    const startDay = checkDay(startInfoYear, startInfoMonth, startInfoDate);
    const endDay = checkDay(endInfoYear, endInfoMonth, endInfoDate);
    const start = new Date(startInfoYear, startInfoMonth, startInfoDate);
    const end = new Date(endInfoYear, endInfoMonth, endInfoDate);
    const between = new Date(targetYear, targetMonth, targetDate);
    if (
      startDate === target &&
      startDay !== 6 &&
      parseInt(startInfoDate) !==
        calcDates(parseInt(startInfoYear), parseInt(startInfoMonth))
    ) {
      return `relative after:absolute after:inset-0 after:bg-range after:translate-x-1/2 after:-z-10 opacity-100 no-underline`;
    }
    if (endDate === target && endDay !== 0 && targetDate !== 1) {
      return `relative before:absolute before:inset-0 before:bg-range before:-translate-x-1/2 before:-z-10 opacity-100 no-underline`;
    }
    if (between > start && between < end) {
      if (between.getDay() === 6 && between.getDate() === 1) {
        return `bg-secondary text-white rounded-full opacity-100 no-underline`;
      } else if (
        between.getDay() === 6 ||
        between.getDate() ===
          calcDates(between.getFullYear(), between.getMonth())
      ) {
        return `relative bg-secondary text-white rounded-full before:absolute before:inset-0 before:bg-range before:-translate-x-1/2 before:-z-10 opacity-100 no-underline`;
      } else if (between.getDay() === 0 || between.getDate() === 1) {
        return `relative bg-secondary text-white rounded-full after:absolute after:inset-0 after:bg-range after:translate-x-1/2 after:-z-10 opacity-100 no-underline`;
      } else {
        return `relative bg-secondary text-white rounded-full after:absolute after:inset-0 after:bg-range after:translate-x-1/2 after:-z-10 before:absolute before:inset-0 before:bg-range before:-translate-x-1/2 before:-z-10 opacity-100 no-underline`;
      }
    }
  };

  const resetTime = () => {
    setStartDate(0);
    setEndDate(0);
    setTime({
      thisYear: year,
      nextYear: month + 1 > 11 ? year + 1 : year,
      thisMonth: month,
      nextMonth: month + 1 > 11 ? 0 : month + 1,
    });
  };

  if (calendarId === "1") {
    return (
      <>
        <p className="text-sm mb-2">空房狀態查詢</p>
        <div className="flex items-center justify-center w-full calendar-height mr-auto">
          <div className="w-full h-calendar-height border border-primary text-primary">
            <div
              className="flex justify-between pt-5 px-5 mb-6"
              id="button-month-year"
            >
              <img
                src={arrow}
                alt="arrow"
                className="cursor-pointer"
                onClick={() => {
                  changeMonth("decrease");
                }}
              />
              <div className="flex flex-1 justify-evenly gap-40">
                <span>
                  {months[time.thisMonth]} {time.thisYear}
                </span>
                <span>
                  {months[time.nextMonth]} {time.nextYear}
                </span>
              </div>
              <img
                src={arrow}
                alt="arrow"
                className="rotate-180 cursor-pointer"
                onClick={() => {
                  changeMonth("increase");
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="ml-8" id="left-calendar">
                <div className="grid grid-cols-7 text-center">
                  {days.map((day) => {
                    return (
                      <span className="mb-2" key={"this" + day}>
                        {day}
                      </span>
                    );
                  })}
                  <hr className="bg-primary col-span-full opacity-50 mb-3.5" />
                  {createDates(time.thisMonth, time.thisYear).map((date) => {
                    return (
                      <div
                        className={`flex justify-center items-center mb-2.5 ${
                          date === 1 &&
                          getFirstDayOfMonth(time.thisYear, time.thisMonth)
                        }`}
                        key={"this" + date}
                      >
                        <div
                          className={`flex items-center justify-center w-7 h-7 hover:text-white hover:rounded-full hover:bg-secondary hover:border-secondary ${checkStartAndEnd(
                            time.thisYear,
                            time.thisMonth,
                            date
                          )} ${checkInvalid(
                            time.thisYear,
                            time.thisMonth,
                            date
                          )} ${renderRange(
                            time.thisYear,
                            time.thisMonth,
                            date
                          )}`}
                          onClick={() =>
                            selectRange(time.thisYear, time.thisMonth, date)
                          }
                        >
                          {date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mr-8" id="right-calendar">
                <div className="grid grid-cols-7 text-center">
                  {days.map((day) => {
                    return (
                      <span className="mb-2" key={"next" + day}>
                        {day}
                      </span>
                    );
                  })}
                  <hr className="bg-primary col-span-full opacity-50 mb-3.5" />
                  {createDates(time.nextMonth, time.nextYear).map((date) => {
                    return (
                      <div
                        className={`flex justify-center items-center mb-2.5 ${
                          date === 1 &&
                          getFirstDayOfMonth(time.nextYear, time.nextMonth)
                        }`}
                        key={"next" + date}
                      >
                        <div
                          className={`flex items-center justify-center w-7 h-7 cursor-pointer hover:text-white hover:rounded-full hover:bg-secondary hover:border-secondary ${checkStartAndEnd(
                            time.nextYear,
                            time.nextMonth,
                            date
                          )} ${renderRange(
                            time.nextYear,
                            time.nextMonth,
                            date
                          )} ${checkInvalid(
                            time.nextYear,
                            time.nextMonth,
                            date
                          )}`}
                          onClick={() =>
                            selectRange(time.nextYear, time.nextMonth, date)
                          }
                        >
                          {date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="self-start text-secondary cursor-pointer pr-3 py-1.5 mb-8"
          onClick={resetTime}
        >
          重新選取
        </button>
      </>
    );
  }
  if (calendarId !== "1") {
    return (
      <div className="flex items-center justify-center w-full calendar-height mr-auto bg-white absolute top-full -mt-4 z-0">
        <div className="w-full h-calendar-height border border-top-primary text-primary">
          <div
            className="flex justify-between pt-5 px-5 mb-6"
            id="button-month-year"
          >
            <img
              src={arrow}
              alt="arrow"
              className="cursor-pointer"
              onClick={() => {
                changeMonth("decrease");
              }}
            />
            <span>
              {months[time.thisMonth]} {time.thisYear}
            </span>
            <img
              src={arrow}
              alt="arrow"
              className="rotate-180 cursor-pointer"
              onClick={() => {
                changeMonth("increase");
              }}
            />
          </div>
          <div className="text-xs">
            <div className="px-2" id="left-calendar">
              <div className="grid grid-cols-7 text-center">
                {days.map((day) => {
                  return (
                    <span className="mb-2" key={"this" + day}>
                      {day}
                    </span>
                  );
                })}
                <hr className="bg-primary col-span-full opacity-10 mb-3.5" />
                {createDates(time.thisMonth, time.thisYear).map((date) => {
                  return (
                    <div
                      className={`flex justify-center items-center mb-2.5 ${
                        date === 1 &&
                        getFirstDayOfMonth(time.thisYear, time.thisMonth)
                      }`}
                      key={"single" + date}
                    >
                      <div
                        className={`flex items-center justify-center w-7 h-7 hover:text-white hover:rounded-full hover:bg-secondary hover:border-secondary ${checkStartAndEnd(
                          time.thisYear,
                          time.thisMonth,
                          date
                        )} ${checkSingleInvalid(
                          time.thisYear,
                          time.thisMonth,
                          date
                        )} ${renderRange(time.thisYear, time.thisMonth, date)}`}
                        onClick={() =>
                          selectSingle(
                            time.thisYear,
                            time.thisMonth,
                            date,
                            calendarId
                          )
                        }
                      >
                        {date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
