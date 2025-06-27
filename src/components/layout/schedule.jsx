import React, { useEffect, useState } from 'react';
import '../../assets/styles/pages/_section.scss';

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
            {/* Dòng chữ thu hút đặt bên ngoài khung đếm */}
            <div style={{
                marginBottom: 24,
                textAlign: "center"
            }}>
                <span style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#5B2EBC",
                    letterSpacing: 0.5
                }}>
                    Don’t miss your chance to join the most inspiring conference of the year!
                </span>
            </div>
            <div style={{
                background: "#fff",
                borderRadius: 8,
                padding: "30px 0", // giảm padding
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
                width: "100%",
                minHeight: 180, // giảm chiều cao tối thiểu
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
            }}>
                <div
                    className="countdown d-center gap-3 gap-sm-4 gap-md-6 gap-lg-10 align-items-center"
                    style={{ fontSize: "0.9em" }} // thu nhỏ toàn bộ đồng hồ
                >
                    <div className="d-inline-grid text-center gap-1">
                        <span className="fs-six fw-bold" style={{ color: "#232323" }}>Days</span>
                        <span style={{ borderBottom: "2px dashed #232323", marginBottom: 6, display: "block" }}></span>
                        <span className="fs-four fw-bold" style={{ color: "#5B2EBC" }}>{timeLeft.days}</span>
                    </div>
                    <span className="fs-four fw-bold" style={{ color: "#232323" }}>:</span>
                    <div className="d-inline-grid text-center gap-1">
                        <span className="fs-six fw-bold" style={{ color: "#232323" }}>Hours</span>
                        <span style={{ borderBottom: "2px dashed #232323", marginBottom: 6, display: "block" }}></span>
                        <span className="fs-four fw-bold" style={{ color: "#5B2EBC" }}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="fs-four fw-bold" style={{ color: "#232323" }}>:</span>
                    <div className="d-inline-grid text-center gap-1">
                        <span className="fs-six fw-bold" style={{ color: "#232323" }}>Minutes</span>
                        <span style={{ borderBottom: "2px dashed #232323", marginBottom: 6, display: "block" }}></span>
                        <span className="fs-four fw-bold" style={{ color: "#5B2EBC" }}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="fs-four fw-bold" style={{ color: "#232323" }}>:</span>
                    <div className="d-inline-grid text-center gap-1">
                        <span className="fs-six fw-bold" style={{ color: "#232323" }}>Seconds</span>
                        <span style={{ borderBottom: "2px dashed #232323", marginBottom: 6, display: "block" }}></span>
                        <span className="fs-four fw-bold" style={{ color: "#5B2EBC" }}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

const ScheduleSection = ({ conference }) => (
    <section className="schedule-section position-relative s1-bg-color pt-120 pb-120">
        <div className="container">
            <div className="row gy-6 singleTab second">
                <div className="col-lg-3 col-xl-2">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{
                            background: "#5B2EBC",
                            color: "#fff",
                            borderRadius: 4,
                            padding: "24px 18px",
                            marginBottom: 8,
                            fontWeight: 600,
                            fontSize: 20
                        }}>
                            <div>Start Date</div>
                            <div style={{ fontWeight: 400, fontSize: 18, marginTop: 8 }}>
                                {conference
                                    ? new Date(conference.startDate).toLocaleString()
                                    : "--"}
                            </div>
                        </div>
                        <div style={{
                            background: "#5B2EBC",
                            color: "#fff",
                            borderRadius: 4,
                            padding: "24px 18px",
                            fontWeight: 600,
                            fontSize: 20
                        }}>
                            <div>End Date</div>
                            <div style={{ fontWeight: 400, fontSize: 18, marginTop: 8 }}>
                                {conference
                                    ? new Date(conference.endDate).toLocaleString()
                                    : "--"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-9 col-xl-10 d-flex flex-column gap-5">
                    {conference?.startDate && (
                        <Countdown targetDate={conference.startDate} label="Countdown to Start" />
                    )}
                </div>
            </div>
        </div>
    </section>
);

export default ScheduleSection;