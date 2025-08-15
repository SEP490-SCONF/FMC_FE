import React, { useEffect, useState } from "react";

// Countdown component nhận targetDate là props
const Countdown = ({ targetDate }) => {
  const getTimeLeft = () => {
    const now = new Date();
    const diff = new Date(targetDate) - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <>
      {/* Dòng chữ thu hút */}
      <div className="mb-6 text-center">
        <span className="text-[22px] font-semibold text-purple-700 tracking-wide">
          Don’t miss your chance to join the most inspiring conference of the
          year!
        </span>
      </div>

      {/* Khung countdown */}
      <div className="bg-white rounded-lg p-6 shadow min-h-[180px] flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 text-sm">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              <div className="grid text-center gap-1">
                <span className="text-gray-900 font-bold">{item.label}</span>
                <span className="border-b-2 border-dashed border-gray-900 mb-1"></span>
                <span className="text-purple-700 font-bold text-lg">
                  {item.value.toString().padStart(2, "0")}
                </span>
              </div>
              {idx < 3 && (
                <span className="text-gray-900 font-bold text-lg">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

const Schedule = ({ conference }) => {
  if (!conference) {
    return (
      <section className="bg-slate-100 py-20">
        <div className="container mx-auto text-center py-5">
          <h5 className="text-lg">Please select a conference to view the schedule.</h5>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-100 py-20">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Start & End date */}
          <div className="flex flex-col gap-4">
            <div className="bg-purple-700 text-white rounded p-6 font-semibold text-lg">
              <div>Start Date</div>
              <div className="font-normal text-base mt-2">
                {new Date(conference.startDate).toLocaleString()}
              </div>
            </div>
            <div className="bg-purple-700 text-white rounded p-6 font-semibold text-lg">
              <div>End Date</div>
              <div className="font-normal text-base mt-2">
                {new Date(conference.endDate).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {conference.startDate && (
              <Countdown targetDate={conference.startDate} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
