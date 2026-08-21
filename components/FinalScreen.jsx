"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import FloatingDecor from "./FloatingDecor";

export default function FinalScreen({ onRestart, onBack }) {
  const screenRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".final-heart",
        {
          opacity: 0,
          scale: 0,
          rotate: -15,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
      );

      gsap.fromTo(
        ".final-copy > *",
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.13,
          delay: 0.25,
          ease: "power2.out",
        },
      );

      gsap.to(".final-heart", {
        scale: 1.06,
        duration: 1.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".final-sparkle", {
        y: -12,
        rotate: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
        ease: "sine.inOut",
      });
    }, screenRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={screenRef} className="final-screen">
      <FloatingDecor variant="final" />
      <span className="final-sparkle sparkle-one">✦</span>
      <span className="final-sparkle sparkle-two">♡</span>
      <span className="final-sparkle sparkle-three">✿</span>
      <span className="final-sparkle sparkle-four">✧</span>

      <div className="final-card">
        <div className="final-heart">♥</div>

        <div className="final-copy">
          <p className="eyebrow center">THE END... FOR NOW</p>

          <h2>Cảm ơn em vì đã xem hết câu chuyện này</h2>

          <p className="final-handwriting">
            Nhưng câu chuyện của chúng ta thì vẫn còn tiếp tục...
          </p>

          <p className="final-message">
            Anh mong rằng sau này chúng ta sẽ còn có thật nhiều khoảnh khắc để
            thêm vào nơi này. Những chuyến đi mới, những bức ảnh mới và thật
            nhiều ngày bình thường nhưng đáng nhớ.
          </p>

          <div className="final-love">Anh yêu em ♡</div>

          <div className="final-actions">
            <button
              type="button"
              className="final-secondary-button"
              onClick={onBack}
            >
              ← Xem lại đồng hồ
            </button>

            <button
              type="button"
              className="final-primary-button"
              onClick={onRestart}
            >
              Xem lại từ đầu ↻
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
