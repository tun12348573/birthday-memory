"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const PASSWORD = "0609";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "♡"];

export default function LockScreen({ onUnlocked }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.4)" },
    );
  }, []);

  const submitIfReady = (next) => {
    if (next.length !== PASSWORD.length) return;

    if (next === PASSWORD) {
      setTimeout(onUnlocked, 250);
      return;
    }

    setError(true);
    gsap.fromTo(
      cardRef.current,
      { x: -9 },
      { x: 9, duration: 0.07, repeat: 5, yoyo: true, clearProps: "x" },
    );
    setTimeout(() => {
      setValue("");
      setError(false);
    }, 700);
  };

  const handleKey = (key) => {
    if (key === "⌫") {
      setValue((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "♡") return;
    if (value.length >= PASSWORD.length) return;

    const next = value + key;
    setValue(next);
    submitIfReady(next);
  };

  return (
    <section className="lock-layout">
      <div className="photo-panel">
        <div className="photo-frame">
          <div className="photo-placeholder"></div>
        </div>
        <div className="polaroid-note">our little universe ♡</div>
      </div>

      <div ref={cardRef} className="lock-card">
        <div className="mini-heart">♥</div>
        <p className="eyebrow">PRIVATE MEMORY</p>
        <h1>Nhập mật mã của chúng ta</h1>
        <p className="hint">Gợi ý: một ngày thật đặc biệt.</p>

        <div className="pin-row" aria-label="password length">
          {Array.from({ length: PASSWORD.length }).map((_, index) => (
            <span
              key={index}
              className={`pin-dot ${index < value.length ? "filled" : ""} ${error ? "error" : ""}`}
            />
          ))}
        </div>

        <div className="keypad">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`key ${key === "♡" ? "ghost-key" : ""}`}
              onClick={() => handleKey(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <p className={`status-text ${error ? "show" : ""}`}>
          Mật mã chưa đúng, thử lại nhé ♡
        </p>
      </div>
    </section>
  );
}
