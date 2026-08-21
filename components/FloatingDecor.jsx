"use client";

const DECOR_PRESETS = {
  lock: [
    {
      symbol: "♡",
      x: "7%",
      y: "18%",
      size: "28px",
      delay: "0s",
      duration: "6s",
      rotate: "-8deg",
    },
    {
      symbol: "✦",
      x: "18%",
      y: "80%",
      size: "18px",
      delay: "1s",
      duration: "7s",
      rotate: "10deg",
    },
    {
      symbol: "✿",
      x: "86%",
      y: "22%",
      size: "26px",
      delay: "2s",
      duration: "6.5s",
      rotate: "-10deg",
    },
    {
      symbol: "♡",
      x: "92%",
      y: "73%",
      size: "18px",
      delay: "1.5s",
      duration: "7.5s",
      rotate: "8deg",
    },
    {
      symbol: "✦",
      x: "50%",
      y: "12%",
      size: "16px",
      delay: "0.8s",
      duration: "6.2s",
      rotate: "0deg",
    },
  ],

  letter: [
    {
      symbol: "♡",
      x: "8%",
      y: "16%",
      size: "28px",
      delay: "0s",
      duration: "6.5s",
      rotate: "-8deg",
    },
    {
      symbol: "✧",
      x: "20%",
      y: "84%",
      size: "18px",
      delay: "1.2s",
      duration: "8s",
      rotate: "10deg",
    },
    {
      symbol: "✿",
      x: "86%",
      y: "20%",
      size: "28px",
      delay: "0.7s",
      duration: "6.8s",
      rotate: "-12deg",
    },
    {
      symbol: "♡",
      x: "90%",
      y: "77%",
      size: "18px",
      delay: "2s",
      duration: "8.2s",
      rotate: "12deg",
    },
    {
      symbol: "✦",
      x: "52%",
      y: "10%",
      size: "16px",
      delay: "0.4s",
      duration: "5.8s",
      rotate: "0deg",
    },
    {
      symbol: "✧",
      x: "6%",
      y: "70%",
      size: "14px",
      delay: "1.8s",
      duration: "7.2s",
      rotate: "6deg",
    },
  ],

  album: [
    {
      symbol: "♡",
      x: "6%",
      y: "15%",
      size: "24px",
      delay: "0.5s",
      duration: "7s",
      rotate: "0deg",
    },
    {
      symbol: "✦",
      x: "15%",
      y: "85%",
      size: "16px",
      delay: "1.1s",
      duration: "8.5s",
      rotate: "-6deg",
    },
    {
      symbol: "✿",
      x: "88%",
      y: "14%",
      size: "26px",
      delay: "0s",
      duration: "7.5s",
      rotate: "8deg",
    },
    {
      symbol: "♡",
      x: "92%",
      y: "76%",
      size: "18px",
      delay: "1.8s",
      duration: "8s",
      rotate: "5deg",
    },
    {
      symbol: "✧",
      x: "48%",
      y: "92%",
      size: "16px",
      delay: "0.9s",
      duration: "6.8s",
      rotate: "0deg",
    },
    {
      symbol: "❀",
      x: "76%",
      y: "84%",
      size: "20px",
      delay: "1.5s",
      duration: "7.8s",
      rotate: "-10deg",
    },
    {
      symbol: "♡",
      x: "30%",
      y: "12%",
      size: "14px",
      delay: "2.2s",
      duration: "7.4s",
      rotate: "10deg",
    },
  ],

  openwhen: [
    {
      symbol: "✉",
      x: "10%",
      y: "22%",
      size: "24px",
      delay: "0s",
      duration: "6.5s",
      rotate: "-6deg",
    },
    {
      symbol: "♡",
      x: "20%",
      y: "82%",
      size: "18px",
      delay: "1.3s",
      duration: "8s",
      rotate: "8deg",
    },
    {
      symbol: "✉",
      x: "86%",
      y: "26%",
      size: "22px",
      delay: "0.8s",
      duration: "7s",
      rotate: "10deg",
    },
    {
      symbol: "✦",
      x: "90%",
      y: "74%",
      size: "16px",
      delay: "1.6s",
      duration: "7.7s",
      rotate: "-10deg",
    },
    {
      symbol: "♡",
      x: "50%",
      y: "10%",
      size: "16px",
      delay: "0.5s",
      duration: "6.2s",
      rotate: "0deg",
    },
  ],

  counter: [
    {
      symbol: "♡",
      x: "9%",
      y: "18%",
      size: "22px",
      delay: "0s",
      duration: "7s",
      rotate: "-8deg",
    },
    {
      symbol: "✦",
      x: "18%",
      y: "82%",
      size: "15px",
      delay: "1.4s",
      duration: "8s",
      rotate: "10deg",
    },
    {
      symbol: "✿",
      x: "86%",
      y: "20%",
      size: "24px",
      delay: "0.6s",
      duration: "7.2s",
      rotate: "-8deg",
    },
    {
      symbol: "♡",
      x: "91%",
      y: "78%",
      size: "16px",
      delay: "2s",
      duration: "8.4s",
      rotate: "9deg",
    },
    {
      symbol: "✧",
      x: "50%",
      y: "12%",
      size: "14px",
      delay: "0.3s",
      duration: "6s",
      rotate: "0deg",
    },
  ],

  final: [
    {
      symbol: "♡",
      x: "7%",
      y: "18%",
      size: "28px",
      delay: "0s",
      duration: "5.8s",
      rotate: "-8deg",
    },
    {
      symbol: "♡",
      x: "16%",
      y: "84%",
      size: "20px",
      delay: "1s",
      duration: "7.6s",
      rotate: "8deg",
    },
    {
      symbol: "✦",
      x: "30%",
      y: "15%",
      size: "16px",
      delay: "0.7s",
      duration: "7s",
      rotate: "-10deg",
    },
    {
      symbol: "✿",
      x: "85%",
      y: "20%",
      size: "28px",
      delay: "0.4s",
      duration: "6.5s",
      rotate: "10deg",
    },
    {
      symbol: "♡",
      x: "92%",
      y: "75%",
      size: "18px",
      delay: "1.8s",
      duration: "8.4s",
      rotate: "-6deg",
    },
    {
      symbol: "✧",
      x: "70%",
      y: "88%",
      size: "16px",
      delay: "0.9s",
      duration: "7.4s",
      rotate: "8deg",
    },
    {
      symbol: "♡",
      x: "52%",
      y: "10%",
      size: "16px",
      delay: "0.2s",
      duration: "5.9s",
      rotate: "0deg",
    },
  ],
};

export default function FloatingDecor({ variant = "album" }) {
  const items = DECOR_PRESETS[variant] || DECOR_PRESETS.album;

  return (
    <div
      className={`floating-decor floating-decor-${variant}`}
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <span
          key={`${variant}-${index}`}
          className="floating-decor-item"
          style={{
            left: item.x,
            top: item.y,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration,
            transform: `rotate(${item.rotate})`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
