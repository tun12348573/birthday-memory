"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import FloatingDecor from "./FloatingDecor";

export default function FinalScreen({ onBack, onRestart }) {
  const screenRef = useRef(null);
  const introRef = useRef(null);
  const endingRef = useRef(null);

  const [revealed, setRevealed] = useState(false);

  /* =========================================
     SCREEN ENTER
  ========================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ending-main-heart",
        {
          opacity: 0,
          scale: 0.4,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "back.out(1.8)",
        },
      );

      gsap.fromTo(
        ".ending-intro-content > *:not(.ending-main-heart)",
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.35,
          ease: "power3.out",
        },
      );
    }, screenRef);

    return () => ctx.revert();
  }, []);

  /* =========================================
     REVEAL FINAL MESSAGE
  ========================================= */

  const revealEnding = () => {
    if (revealed) return;

    const intro = introRef.current;

    if (!intro) {
      setRevealed(true);
      return;
    }

    gsap.to(intro, {
      opacity: 0,
      y: -25,
      scale: 0.96,
      filter: "blur(8px)",
      duration: 0.55,
      ease: "power2.inOut",

      onComplete: () => {
        setRevealed(true);
      },
    });
  };

  /* =========================================
     ENDING ANIMATION
  ========================================= */

  useEffect(() => {
    if (!revealed || !endingRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline.fromTo(
        ".ending-final-glow",
        {
          opacity: 0,
          scale: 0.7,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.3,
          ease: "power2.out",
        },
      );

      timeline.fromTo(
        ".ending-small-label",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        "-=0.75",
      );

      timeline.fromTo(
        ".ending-final-line",
        {
          opacity: 0,
          y: 28,
          filter: "blur(7px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.55,
          ease: "power3.out",
        },
      );

      timeline.fromTo(
        ".ending-final-heart",
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(2)",
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".ending-after-message",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "+=0.15",
      );
    }, endingRef);

    return () => ctx.revert();
  }, [revealed]);

  return (
    <section
      ref={screenRef}
      className={`ending-screen ${revealed ? "ending-revealed" : ""}`}
    >
      <FloatingDecor variant="final" />

      {/* =====================================
          BACK
      ===================================== */}

      {!revealed && (
        <button type="button" className="ending-back-button" onClick={onBack}>
          ← Quay lại
        </button>
      )}

      {/* =====================================
          FIRST ENDING
      ===================================== */}

      {!revealed && (
        <div ref={introRef} className="ending-intro">
          <div className="ending-intro-content">
            <div className="ending-main-heart" aria-hidden="true">
              ♥
            </div>

            <p className="ending-eyebrow">ONE LAST PAGE</p>

            <h1 className="ending-title">Happy Birthday, em.</h1>

            <p className="ending-description">
              Cảm ơn em vì đã xem hết
              <br />
              món quà nhỏ này của anh.
            </p>

            <p className="ending-little-note">
              Anh đã gom những điều anh muốn nhớ
              <br />
              vào một nơi nhỏ dành riêng cho em ♡
            </p>

            <button
              type="button"
              className="ending-reveal-button"
              onClick={revealEnding}
            >
              Một điều cuối cùng
              <span> ♡</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================
          FINAL REVEAL
      ===================================== */}

      {revealed && (
        <div ref={endingRef} className="ending-final">
          <div className="ending-final-glow" aria-hidden="true" />

          <div className="ending-final-content">
            <p className="ending-small-label">BEFORE YOU GO...</p>

            <p className="ending-final-line ending-line-one">
              Anh mong năm sau,
            </p>

            <p className="ending-final-line ending-line-main">
              người chúc em sinh nhật đầu tiên
            </p>

            <p className="ending-final-line ending-line-three">vẫn là anh.</p>

            <div className="ending-final-heart" aria-hidden="true">
              ♥
            </div>

            <p className="ending-after-message">Và cả những năm sau nữa. ♡</p>

            <div className="ending-final-actions">
              <button
                type="button"
                className="ending-restart-button"
                onClick={() => onRestart?.()}
              >
                ↻ Xem lại từ đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
