"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import FloatingDecor from "./FloatingDecor";

const PASSWORD = "0609";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "♡"];

export default function LockScreen({ onUnlocked }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const cardRef = useRef(null);

  /* =========================================
     ENTER ANIMATION
  ========================================= */

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "back.out(1.4)",
      },
    );
  }, []);

  /* =========================================
     CHECK PASSWORD
  ========================================= */

  const submitIfReady = (next) => {
    if (next.length !== PASSWORD.length) {
      return;
    }

    if (next === PASSWORD) {
      setTimeout(() => {
        onUnlocked?.();
      }, 250);

      return;
    }

    /* Sai mật khẩu */

    setError(true);

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          x: -9,
        },
        {
          x: 9,
          duration: 0.07,
          repeat: 5,
          yoyo: true,
          clearProps: "x",
        },
      );
    }

    setTimeout(() => {
      setValue("");
      setError(false);
    }, 700);
  };

  /* =========================================
     KEYPAD
  ========================================= */

  const handleKey = (key) => {
    /* DELETE */

    if (key === "⌫") {
      setValue((prev) => prev.slice(0, -1));
      return;
    }

    /* HEART BUTTON */

    if (key === "♡") {
      return;
    }

    /* Không cho nhập quá 4 số */

    if (value.length >= PASSWORD.length) {
      return;
    }

    const next = value + key;

    setValue(next);

    submitIfReady(next);
  };

  /* =========================================
     JSX
  ========================================= */

  return (
    <section className="lock-layout">
      {/* =====================================
          FLOATING DECOR
      ===================================== */}

      <FloatingDecor variant="lock" />

      {/* =====================================
          POLAROID PHOTO
      ===================================== */}

      <div className="photo-panel">
        <div className="photo-frame">
          <div className="photo-placeholder" />
        </div>

        <div className="polaroid-note">our little universe ♡</div>
      </div>

      {/* =====================================
          PASSWORD CARD
      ===================================== */}

      <div ref={cardRef} className="lock-card">
        <div className="mini-heart">♥</div>

        <p className="eyebrow">PRIVATE MEMORY</p>

        <h1>Vui lòng nhập mật mã</h1>

        <p className="hint">Gợi ý: một ngày thật đặc biệt.</p>

        {/* =================================
            PASSWORD DOTS
        ================================= */}

        <div className="pin-row" aria-label="password length">
          {Array.from({
            length: PASSWORD.length,
          }).map((_, index) => (
            <span
              key={index}
              className={`
                pin-dot
                ${index < value.length ? "filled" : ""}
                ${error ? "error" : ""}
              `}
            />
          ))}
        </div>

        {/* =================================
            KEYPAD
        ================================= */}

        <div className="keypad">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`
                key
                ${key === "♡" ? "ghost-key" : ""}
              `}
              onClick={() => handleKey(key)}
            >
              {key}
            </button>
          ))}
        </div>

        {/* =================================
            ERROR MESSAGE
        ================================= */}

        <p
          className={`
            status-text
            ${error ? "show" : ""}
          `}
        >
          Mật mã chưa đúng rồi, hãy thử lại nhé ♡
        </p>
      </div>
    </section>
  );
}
