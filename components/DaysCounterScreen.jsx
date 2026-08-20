"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ĐỔI NGÀY NÀY thành ngày hai bạn bắt đầu.
// Format: YYYY-MM-DDTHH:mm:ss
const START_DATE = "2026-03-13T20:00:00";

function getElapsedTime() {
  const start = new Date(START_DATE).getTime();
  const now = Date.now();

  const diff = Math.max(0, now - start);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function DaysCounterScreen({ onContinue, onBack }) {
  const screenRef = useRef(null);

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTime(getElapsedTime());

    const timer = setInterval(() => {
      setTime(getElapsedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".days-counter-card",
        {
          opacity: 0,
          y: 55,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.25)",
        },
      );

      gsap.fromTo(
        ".counter-unit",
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.25,
          ease: "power2.out",
        },
      );
    }, screenRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={screenRef} className="days-counter-screen">
      <button className="counter-back-button" type="button" onClick={onBack}>
        ← Album
      </button>

      <div className="days-counter-card">
        <p className="eyebrow center">OUR TIME TOGETHER</p>

        <h2 className="counter-title">Chúng ta đã bên nhau</h2>

        <div className="big-day-number">{time.days}</div>

        <p className="day-label">ngày</p>

        <div className="counter-grid">
          <div className="counter-unit">
            <strong>{pad(time.hours)}</strong>
            <span>Giờ</span>
          </div>

          <div className="counter-divider">:</div>

          <div className="counter-unit">
            <strong>{pad(time.minutes)}</strong>
            <span>Phút</span>
          </div>

          <div className="counter-divider">:</div>

          <div className="counter-unit">
            <strong>{pad(time.seconds)}</strong>
            <span>Giây</span>
          </div>
        </div>

        <p className="counter-message">
          Và từng giây trôi qua vẫn đang trở thành một phần trong câu chuyện của
          chúng ta ♡
        </p>

        <button
          className="counter-continue-button"
          type="button"
          onClick={onContinue}
        >
          Đi đến lời cuối
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
