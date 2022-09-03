import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ReactComponent as Arrow } from "../img/arrow.svg";
import { add, format, differenceInCalendarDays } from "date-fns";
import Calendar from "./Calendar";
import Result from "./Result";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DotSpinner } from "@uiball/loaders";

import {
  icons,
  ok,
  cancel,
  log,
  contact,
  pay,
  flow,
  close,
  imgArrow,
} from "./img";

const swal = withReactContent(Swal);
const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/room/";
const errorMessage = { code: 404, message: "room taken" };

const Room = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [booking, setBooking] = useState([]);
  const [position, setPosition] = useState(1);
  const [isImgContainer, setIsImgContainer] = useState(false);
  const [bgImg, setBgImg] = useState(0);
  const [isForm, setIsForm] = useState(false);
  const [singleCalendar, setSingleCalendar] = useState({
    popCheckIn: false,
    popCheckOut: false,
  });
  const [customer, setCustomer] = useState({
    name: "",
    tel: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const today = new Date();
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calcPrice = (startDate, endDate) => {
    if (endDate === 0) return numberWithCommas(info.normalDayPrice);
    const [startInfoYear, startInfoMonth, startInfoDate] = startDate.split("-");
    const [endInfoYear, endInfoMonth, endInfoDate] = endDate.split("-");
    let start = new Date(startInfoYear, startInfoMonth, startInfoDate);
    let end = new Date(endInfoYear, endInfoMonth, endInfoDate);

    let total = 0;
    while (start < end) {
      const day = start.getDay();
      if (day === 0 || day === 6 || day === 5) {
        total += info.holidayPrice;
      } else {
        total += info.normalDayPrice;
      }
      start = add(start, { days: 1 });
    }
    return numberWithCommas(total);
  };

  const calcNight = (startDate, endDate) => {
    if (endDate === 0) return 1;
    let [startInfoYear, startInfoMonth, startInfoDate] = startDate.split("-");
    let [endInfoYear, endInfoMonth, endInfoDate] = endDate.split("-");
    return differenceInCalendarDays(
      new Date(endInfoYear, endInfoMonth, endInfoDate),
      new Date(startInfoYear, startInfoMonth, startInfoDate)
    );
  };

  const calcDays = (startDate, endDate) => {
    if (endDate === 0) return "";
    const [startInfoYear, startInfoMonth, startInfoDate] = startDate.split("-");
    const [endInfoYear, endInfoMonth, endInfoDate] = endDate.split("-");
    let start = new Date(startInfoYear, startInfoMonth, startInfoDate);
    let end = new Date(endInfoYear, endInfoMonth, endInfoDate);

    let normalDay = 0;
    let holiday = 0;
    while (start < end) {
      const day = start.getDay();
      if (day === 0 || day === 6 || day === 5) {
        holiday += 1;
      } else {
        normalDay += 1;
      }
      start = add(start, { days: 1 });
    }

    if (holiday === 0) return `${normalDay}晚平日`;
    else return `${normalDay}晚平日・${holiday}晚假日`;
  };

  const fetchInfo = async () => {
    try {
      const rawData = await fetch(url + id, {
        headers: {
          Authorization:
            "Bearer bWy7TZEGzadpOP4XuSzwl15ae3sYtR4GvQHTTo431uDWu9yvrMrHkXXm5nsB",
        },
      });
      const roomInfo = await rawData.json();
      setInfo(roomInfo.room[0]);
      setBooking(roomInfo.booking.map((item) => item.date));
    } catch (err) {
      alert(err);
    }
  };

  const changeImg = (move) => {
    let position = bgImg;
    if (move === "increase") {
      position += 1;
      setBgImg(position > 2 ? 2 : position);
    } else if (move === "decrease") {
      position -= 1;
      setBgImg(position < 0 ? 0 : position);
    }
  };

  const checkGuestLimit = (min, max) => {
    if (min === 1 && max === 1) return "1人";
    return `${min}～${max}人`;
  };

  const checkBed = (bed) => {
    if (bed.length > 1) {
      const level = bed[0];
      if (level === "Double") return `${bed.length}張雙人床`;
      if (level === "Queen") return `${bed.length}張加大雙人床`;
    } else {
      const level = bed[0];
      if (level === "Single") return "單人床";
      else if (level === "Small Double") return "小型雙人床";
      else if (level === "Double") return "雙人床";
      else if (level === "Queen") return "加大雙人床";
    }
  };

  const selected = (startDate, endDate) => {
    if (startDate !== 0 && endDate !== 0) return "visible";
    else return "invisible";
  };

  const openForm = (startDate, endDate) => {
    if (startDate === 0 || endDate === 0) {
      swal.fire({
        icon: "error",
        title: "請選擇入房及退房時間",
      });
      return;
    }
    setIsForm(true);
    window.scrollTo(0, 0);
  };

  const handleCalendar = (position) => {
    if (position === 1) {
      setSingleCalendar({
        popCheckOut: false,
        popCheckIn: !singleCalendar.popCheckIn,
      });
    } else if (position === 2) {
      setSingleCalendar({
        popCheckIn: false,
        popCheckOut: !singleCalendar.popCheckOut,
      });
    }
  };

  const enterCustomer = (e) => {
    const name = e.target.getAttribute("name");
    const value = e.target.value;
    setCustomer((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const submit = (e, startDate, endDate) => {
    e.preventDefault();
    const rule = /^09\d{2}-?\d{3}-?\d{3}$/;
    const [startInfoYear, startInfoMonth, startInfoDate] = startDate.split("-");
    const [endInfoYear, endInfoMonth, endInfoDate] = endDate.split("-");
    let start = new Date(startInfoYear, startInfoMonth, startInfoDate);
    let end = new Date(endInfoYear, endInfoMonth, endInfoDate);
    const takenDays = booking.join("");
    const between = [];
    let includeTakenDays = false;
    while (start < end) {
      const standardDay = format(start, "yyyy-MM-dd");
      if (takenDays.includes(standardDay)) includeTakenDays = true;
      between.push(standardDay);
      start = add(start, { days: 1 });
    }

    if (customer.name.length < 1) {
      swal.fire({
        icon: "error",
        title: "請填寫姓名",
      });
    } else if (!rule.test(customer.tel)) {
      swal.fire({
        icon: "error",
        title: "請填寫正確的電話號碼",
      });
    } else if (includeTakenDays) {
      swal.fire({
        icon: "error",
        title: "所選日期已被預約，請更改日期",
      });
    } else if (
      start < new Date() ||
      format(
        new Date(startInfoYear, startInfoMonth, startInfoDate),
        "yyyy-MM-dd"
      ) === format(new Date(), "yyyy-MM-dd")
    ) {
      swal.fire({
        icon: "error",
        title: "無法預約今天及過去的日期",
      });
    } else {
      setIsSending(true);
      const sendData = {
        name: customer.name,
        tel: customer.tel,
        date: between,
      };
      fetch(url + id, {
        method: "POST",
        headers: {
          Authorization:
            "Bearer bWy7TZEGzadpOP4XuSzwl15ae3sYtR4GvQHTTo431uDWu9yvrMrHkXXm5nsB",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success !== true) throw errorMessage;
          booking !== []
            ? setBooking([
                ...booking,
                ...result.booking.map((date) => date.date),
              ])
            : setBooking([...result.booking.map((date) => date.date)]);

          setIsSuccess(true);
          setCustomer({ name: "", tel: "" });
          setIsSending(false);
          setIsForm(false);
          setIsResult(true);
        })
        .catch((err) => {
          console.log(err);
          setIsSuccess(false);
          setCustomer({ name: "", tel: "" });
          setIsSending(false);
          setIsForm(false);
          setIsResult(true);
        });
    }
  };

  const dateToHuman = (date) => {
    const [targetYear, targetMonth, targetDate] = date.split("-");
    return `${targetYear}-${
      parseInt(targetMonth) + 1 < 10
        ? "0" + (parseInt(targetMonth) + 1).toString()
        : parseInt(targetMonth) + 1
    }-${parseInt(targetDate) < 10 ? "0" + targetDate : targetDate}`;
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    const changePosition = setTimeout(() => {
      setPosition(() => {
        let nextPosition = position + 1;
        if (nextPosition > 3) nextPosition = 1;
        return nextPosition;
      });
    }, 6000);
    return () => {
      clearTimeout(changePosition);
    };
  }, [position]);

  return (
    <>
      {info === null ? (
        <div className="w-full h-screen flex justify-center items-center bg-white">
          <DotSpinner size={100} speed={0.9} color="#38470B" />
        </div>
      ) : (
        <div className="flex text-primary h-full relative">
          <div className="relative w-4/12 h-info-img-height mr-7">
            {info.imageUrl.map((img, index) => {
              return (
                <div
                  key={img}
                  className={`absolute inset-0 bg-cover ease-in-out duration-500 cursor-pointer ${
                    position !== index + 1 && "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    backgroundImage: `url(${info.imageUrl[index]})`,
                  }}
                  onClick={() => {
                    setIsImgContainer(true);
                    setBgImg(index);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="absolute inset-0 bg-transparent-bottom"></div>
                </div>
              );
            })}

            <div className="absolute left-32 top-22">
              <Link to={"/"} className="flex items-center py-3 cursor-pointer">
                <Arrow className="mr-2.5" />
                <p>查看其它房型</p>
              </Link>
            </div>

            <div className="absolute bottom-12 left-0 right-0 flex flex-col justify-center">
              <div className="text-4xl text-center mb-2.5">
                ${calcPrice(startDate, endDate)}
                <span className="text-xl px-5">/</span>
                <span className="text-xl">
                  {calcNight(startDate, endDate)}晚
                </span>
              </div>
              <button
                className={`bg-primary text-white text-xl py-2 w-64 mx-auto mb-12 ${selected(
                  startDate,
                  endDate
                )}`}
                onClick={() => {
                  openForm(startDate, endDate);
                }}
              >
                Booking now
              </button>
              <ol className="flex justify-center gap-3">
                {info.imageUrl.map((img, index) => {
                  return (
                    <li
                      className={`w-3 h-3 border border-primary rounded-full cursor-pointer ${
                        position === index + 1 && "bg-primary"
                      }`}
                      onClick={() => {
                        setPosition(index + 1);
                      }}
                      key={img}
                    ></li>
                  );
                })}
              </ol>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-end justify-between mt-28 mb-9">
              <h2 className="text-4xl">{info.name}</h2>
              <div>
                {checkGuestLimit(
                  info.descriptionShort.GuestMin,
                  info.descriptionShort.GuestMax
                )}
                ・{checkBed(info.descriptionShort.Bed)}・ 附
                {info.amenities.Breakfast && "早餐・"}衛浴
                {info.descriptionShort["Private-Bath"]}間・
                {info.descriptionShort.Footage}
                平方公尺
              </div>
            </div>
            <div className="mb-9">
              平日（一～四）價格：{info.normalDayPrice} / 假日（五〜日）價格：
              {info.holidayPrice}
              <br />
              入住時間：{info.checkInAndOut.checkInEarly}（最早）/{" "}
              {info.checkInAndOut.checkInLate}（最晚）
              <br />
              退房時間：{info.checkInAndOut.checkOut}
            </div>
            <ol className="mb-12">
              {info.description.split(". ").map((description, index) => (
                <li className="flex" key={index}>
                  <span>・</span>
                  <span>{description}</span>
                </li>
              ))}
            </ol>
            <ol className="grid grid-cols-7 gap-9 text-xxs mb-7">
              {icons.map((icon) => {
                return (
                  <li
                    className={`flex items-start gap-1 ${
                      info.amenities[icon.amenities] || "opacity-20"
                    }`}
                    key={icon.src}
                  >
                    <div className="flex flex-col items-center justify-between h-full w-full">
                      <img src={icon.src} alt="breakfast" className="mb-1.5" />
                      <p className="mt-auto">{icon.info}</p>
                    </div>
                    <img
                      src={info.amenities[icon.amenities] ? ok : cancel}
                      alt="status"
                    />
                  </li>
                );
              })}
            </ol>
            <Calendar
              today={today}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              booking={booking}
              calendarId="1"
            />
          </div>
          {isImgContainer && (
            <div
              className="absolute inset-0 bg-black/50 px-32"
              onClick={(e) => {
                if (e.target.nodeName === "DIV") {
                  setIsImgContainer(false);
                }
              }}
            >
              <div className="h-screen flex items-center justify-between">
                <img
                  className={`h-fit p-4 cursor-pointer ${
                    bgImg < 1 && "opacity-20 cursor-default"
                  }`}
                  src={imgArrow}
                  alt="left-arrow"
                  onClick={() => {
                    changeImg("decrease");
                  }}
                />
                <img
                  src={info.imageUrl[bgImg]}
                  alt="demo-img"
                  className="h-5/6 "
                />
                <img
                  className={`h-fit p-4 rotate-180 cursor-pointer ${
                    bgImg > 1 && "opacity-20 cursor-default"
                  }`}
                  src={imgArrow}
                  alt="right-arrow"
                  onClick={() => {
                    changeImg("increase");
                  }}
                />
              </div>
            </div>
          )}
          {isForm && (
            <div className="absolute inset-0 flex justify-center bg-white/50">
              <div className="relative flex h-form-height mt-form-padding border border-primary animate-pop">
                <form className="flex flex-col w-form-width text-sm bg-primary px-16">
                  <label
                    className="flex flex-col mb-2 pt-12 text-white"
                    htmlFor="name"
                  >
                    姓名
                  </label>
                  <input
                    type="text"
                    className="h-9 px-2.5 py-2 mb-4"
                    onChange={(e) => {
                      enterCustomer(e);
                    }}
                    id="name"
                    name="name"
                    value={customer.name}
                  />
                  <label
                    className="flex flex-col mb-2 text-white"
                    htmlFor="phone"
                  >
                    手機號碼
                  </label>
                  <input
                    type="text"
                    className="h-9 px-2.5 py-2 mb-4"
                    onChange={(e) => {
                      enterCustomer(e);
                    }}
                    id="phone"
                    name="tel"
                    value={customer.tel}
                  />
                  <label
                    className="flex flex-col mb-2 text-white"
                    htmlFor="checkIn"
                  >
                    入住日期
                  </label>
                  <div className="relative z-10">
                    <div
                      type="text"
                      className="w-full h-9 bg-white text-form px-2.5 py-2 mb-4 cursor-pointer"
                      onClick={() => handleCalendar(1)}
                    >
                      {dateToHuman(startDate)}
                    </div>
                    <div className="absolute w-0 h-0 border-t-6 border-x-6 border-x-white border-t-primary right-2.5 top-4 pointer-events-none"></div>
                    {singleCalendar.popCheckIn && (
                      <Calendar
                        today={today}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        booking={booking}
                        singleCalendar={singleCalendar}
                        setSingleCalendar={setSingleCalendar}
                        calendarId="2"
                      />
                    )}
                  </div>
                  <label
                    className="flex flex-col mb-2 text-white"
                    htmlFor="checkOut"
                  >
                    退房日期
                  </label>
                  <div className="relative">
                    <div
                      type="text"
                      className="w-full h-9 bg-white text-form px-2.5 py-2 mb-4 cursor-pointer"
                      onClick={() => handleCalendar(2)}
                      disabled
                    >
                      {dateToHuman(endDate)}
                    </div>
                    {singleCalendar.popCheckOut && (
                      <Calendar
                        today={today}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        booking={booking}
                        singleCalendar={singleCalendar}
                        setSingleCalendar={setSingleCalendar}
                        calendarId="3"
                      />
                    )}
                    <div className="absolute w-0 h-0 border-t-6 border-x-6 border-x-white border-t-primary right-2.5 top-4 pointer-events-none"></div>
                  </div>
                  <p className="text-secondary mb-3.5">
                    {calcNight(startDate, endDate) + 1}天，
                    {calcDays(startDate, endDate)}
                  </p>
                  <hr className="bg-secondary mb-2.5" />
                  <p className="text-right text-white">總計</p>
                  <p className="text-right text-white text-2xl mb-5">
                    ${calcPrice(startDate, endDate)}
                  </p>
                  <button
                    className="text-white text-lg border border-white py-2 mb-4"
                    onClick={(e) => submit(e, startDate, endDate)}
                  >
                    確認送出
                  </button>
                  <p className="text-center text-xs text-white mb-7">
                    此預約系統僅預約功能，並不會對您進行收費
                  </p>
                </form>
                <div className="pl-7 pr-24 bg-white">
                  <div className="mb-7">
                    <h3 className="text-2xl font-bold mt-12 mb-2">
                      Single Room
                    </h3>
                    <p className="mb-7">
                      1人・ 單人床・附早餐・ 衛浴1間・18平方公尺
                      <br />
                      平日（一～四）價格：1380 / 假日（五〜日）價格：1500
                    </p>
                    <div className="grid grid-cols-7 gap-y-8 max-w-icon-width flex-wrap text-xxs">
                      {icons
                        .filter((icon) => {
                          return info.amenities[icon.amenities];
                        })
                        .map((icon, index) => {
                          return (
                            <div
                              className="flex flex-col justify-center items-center"
                              key={index}
                            >
                              <div className="flex items-center justify-center w-8 h-8 mb-2">
                                <img
                                  src={icon.src}
                                  alt="icon"
                                  className="max-h-full"
                                />
                              </div>
                              <span className="text-center text-secondary mt-auto">
                                {icon.info}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h4 className="font-bold mb-3">訂房資訊</h4>
                    <p className="text-xs">
                      ・入住時間：最早{info.checkInAndOut.checkInEarly}，最晚
                      {info.checkInAndOut.checkInLate}；退房時間：
                      {info.checkInAndOut.checkOut}，請自行確認行程安排。
                      <br />
                      ・平日定義週一至週四；假日定義週五至週日及國定假日。
                      <br />
                      ・好室旅店全面禁止吸菸。 <br />
                      ・若您有任何問題，歡迎撥打 03-8321155 ( 服務時間
                      週一至週六 10:00 - 18:00 )。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-5">預約流程</h4>
                    <div className="flex">
                      <div className=" w-40">
                        <div className="flex justify-center items-center h-12 bg-secondary">
                          <img src={log} alt="log" />
                        </div>
                        <div className="border border-secondary rounded-b-lg h-flow-height">
                          <p className="text-primary text-xs text-center mt-3">
                            送出線上預約單
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center h-12 mx-3">
                        <img src={flow} alt="flow" />
                      </div>
                      <div className=" w-40">
                        <div className="flex justify-center items-center h-12 bg-secondary">
                          <img src={contact} alt="contact" />
                        </div>
                        <div className="border border-secondary rounded-b-lg h-flow-height">
                          <p className="text-primary text-xs text-center mt-3">
                            系統立即回覆是否預訂成功
                            <br />
                            並以簡訊發送訂房通知
                            <br />
                            (若未收到簡訊請來電確認)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center h-12 mx-3">
                        <img src={flow} alt="flow" />
                      </div>
                      <div className=" w-40">
                        <div className="flex justify-center items-center h-12 bg-secondary">
                          <img src={pay} alt="pay" />
                        </div>
                        <div className="border border-secondary rounded-b-lg h-flow-height">
                          <p className="text-primary text-xs text-center mt-3">
                            入住當日憑訂房通知
                            <br />
                            以現金或刷卡付款即可
                            <br />
                            (僅接受VISA.JCB.銀聯卡)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  src={close}
                  alt="close"
                  className="absolute right-8 top-8 p-2 cursor-pointer"
                  onClick={() => {
                    setIsForm(false);
                    setCustomer({ name: "", tel: "" });
                    setSingleCalendar({
                      popCheckIn: false,
                      popCheckOut: false,
                    });
                  }}
                />
                {isSending && (
                  <div className="absolute flex items-center justify-center bg-white inset-0 z-10">
                    <DotSpinner size={100} speed={0.9} color="#38470B" />
                  </div>
                )}
              </div>
            </div>
          )}
          {isResult && (
            <Result setIsResult={setIsResult} isSuccess={isSuccess} />
          )}
        </div>
      )}
    </>
  );
};

export default Room;
