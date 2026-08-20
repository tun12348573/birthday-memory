"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEMS = ["♡", "✦", "❀", "♥", "✧", "♡", "❀"];

export default function FloatingDecor() {
  const refs = useRef([]);

  useEffect(() => {
    refs.current.forEach((item, index) => {
      if (!item) return;
      gsap.to(item, {
        y: index % 2 === 0 ? -18 : 18,
        x: index % 3 === 0 ? 10 : -10,
        rotate: index % 2 === 0 ? 8 : -8,
        duration: 2.6 + index * 0.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <div className="floating-layer" aria-hidden="true">
      {ITEMS.map((item, index) => (
        <span
          key={index}
          ref={(el) => (refs.current[index] = el)}
          className={`float-item float-${index + 1}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
