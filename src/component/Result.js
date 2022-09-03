import { result, success, fail } from "./img";

const Result = ({ setIsResult, isSuccess }) => {
  return (
    <div className="absolute inset-0 flex justify-center bg-white/50">
      <div className="relative flex justify-center items-center flex-col w-result-width h-result-height bg-primary h-form-height mt-form-padding text-white text-center">
        <div className="relative flex justify-center items-center w-full h-40 mb-10">
          <img src={result} alt="result" className="absolute" />
          {isSuccess ? (
            <img src={success} alt="success" className="absolute inset-auto" />
          ) : (
            <img
              src={fail}
              alt="fail"
              className="absolute h-9 w-9 inset-auto translate-y-2"
            />
          )}
        </div>
        <h4 className="text-5xl mb-10">
          {isSuccess ? "預約成功" : "預約失敗"}
        </h4>
        {isSuccess ? (
          <p className="text-lg">
            請留意簡訊發送訂房通知，入住當日務必出示此訂房通知，
            <br />
            若未收到簡訊請來電確認，謝謝您
          </p>
        ) : (
          <p className="text-lg">
            哎呀！晚了一步！您預約的日期已經被預約走了，
            <br />
            再看看其它房型吧
          </p>
        )}

        <img
          src={fail}
          alt="close"
          className="absolute right-8 top-8 p-2 cursor-pointer"
          onClick={() => {
            setIsResult(false);
          }}
        />
      </div>
    </div>
  );
};

export default Result;
