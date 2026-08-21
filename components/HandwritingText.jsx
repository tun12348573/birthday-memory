"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";

const HandwritingText = forwardRef(function HandwritingText(
  {
    text = "",
    speed = 32,
    delay = 0,
    className = "",
    start = true,
    as: Tag = "span",
    showCursor = false,
    onComplete,
    onProgress,

    // true = giữ sẵn vị trí cuối cùng của đoạn chữ
    reserveSpace = true,
  },
  ref,
) {
  const [visibleCount, setVisibleCount] = useState(0);

  const [finished, setFinished] = useState(false);

  /* =====================================================
       SPLIT UNICODE / VIETNAMESE CHARACTERS
    ===================================================== */

  const characters = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("vi", {
        granularity: "grapheme",
      });

      return Array.from(segmenter.segment(text), (item) => item.segment);
    }

    return Array.from(text);
  }, [text]);

  /* =====================================================
       TYPEWRITER
    ===================================================== */

  useEffect(() => {
    setVisibleCount(0);
    setFinished(false);

    if (!start || !text) {
      return;
    }

    let typingTimer = null;
    let startTimer = null;

    let currentIndex = 0;

    const beginTyping = () => {
      typingTimer = window.setInterval(() => {
        currentIndex += 1;

        setVisibleCount(currentIndex);

        onProgress?.(currentIndex, characters.length);

        if (currentIndex >= characters.length) {
          window.clearInterval(typingTimer);

          setFinished(true);

          onComplete?.();
        }
      }, speed);
    };

    startTimer = window.setTimeout(beginTyping, delay);

    return () => {
      window.clearTimeout(startTimer);

      if (typingTimer) {
        window.clearInterval(typingTimer);
      }
    };
  }, [text, speed, delay, start, characters.length]);

  const visibleText = characters.slice(0, visibleCount).join("");

  /* =====================================================
       NORMAL MODE
    ===================================================== */

  if (!reserveSpace) {
    return (
      <Tag
        ref={ref}
        className={`
            handwriting-typewriter
            ${className}
          `}
      >
        {visibleText}

        {showCursor && start && visibleCount > 0 && !finished && (
          <span className="handwriting-cursor">♡</span>
        )}
      </Tag>
    );
  }

  /* =====================================================
       FIXED POSITION MODE

       Ghost text:
       - vô hình
       - giữ đúng chiều cao cuối cùng

       Live text:
       - nằm đè lên ghost
       - chữ xuất hiện từ từ
    ===================================================== */

  return (
    <Tag
      ref={ref}
      className={`
          handwriting-typewriter
          handwriting-fixed-layout
          ${className}
        `}
      aria-label={text}
    >
      {/* Giữ sẵn layout cuối cùng */}
      <span className="handwriting-layout-ghost" aria-hidden="true">
        {text}
      </span>

      {/* Chữ thật đang được viết */}
      <span className="handwriting-live-text" aria-hidden="true">
        {visibleText}

        {showCursor && start && visibleCount > 0 && !finished && (
          <span className="handwriting-cursor">♡</span>
        )}
      </span>
    </Tag>
  );
});

export default HandwritingText;
