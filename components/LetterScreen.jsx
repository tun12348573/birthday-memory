"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

import FloatingDecor from "./FloatingDecor";
import HandwritingText from "./HandwritingText";

export default function LetterScreen({ onOpenAlbum }) {
  const wrapRef = useRef(null);
  const letterRef = useRef(null);

  /*
    Ref từng đoạn để biết đoạn nào
    hiện đang được viết.
  */

  const greetingRef = useRef(null);
  const paragraph1Ref = useRef(null);
  const paragraph2Ref = useRef(null);
  const paragraph3Ref = useRef(null);
  const paragraph4Ref = useRef(null);
  const paragraph5Ref = useRef(null);
  const signatureRef = useRef(null);

  /*
    Giới hạn số lần auto scroll
    tránh scroll liên tục mỗi ký tự.
  */

  const lastScrollRef = useRef(0);

  const [opened, setOpened] = useState(false);

  const [typingStarted, setTypingStarted] = useState(false);

  const [typingStep, setTypingStep] = useState(0);

  /* =========================================================
     ENTER SCREEN
  ========================================================= */

  useEffect(() => {
    if (!wrapRef.current) return;

    gsap.fromTo(
      wrapRef.current,
      {
        opacity: 0,
        y: 70,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.3)",
      },
    );
  }, []);

  /* =========================================================
     AUTO SCROLL WHILE TYPING
  ========================================================= */

  const keepTextVisible = (elementRef, currentIndex, totalLength) => {
    if (!elementRef.current) {
      return;
    }

    /*
      Chủ yếu bật auto-scroll trên điện thoại/tablet.
    */

    const isMobile = window.matchMedia("(max-width: 820px)").matches;

    if (!isMobile) {
      return;
    }

    /*
      Không kiểm tra mỗi ký tự.
      8 ký tự mới kiểm tra một lần.
    */

    if (currentIndex % 8 !== 0 && currentIndex !== totalLength) {
      return;
    }

    /*
      Tránh gọi smooth scroll quá nhanh liên tục.
    */

    const now = Date.now();

    if (now - lastScrollRef.current < 180) {
      return;
    }

    lastScrollRef.current = now;

    window.requestAnimationFrame(() => {
      const element = elementRef.current;

      if (!element) return;

      const rect = element.getBoundingClientRect();

      /*
        Chừa khoảng trống phía dưới:
        - music player
        - nút trình duyệt mobile
        - tạo cảm giác đọc thoáng hơn
      */

      const safeBottom = window.innerHeight - 125;

      /*
        Chỉ scroll nếu chữ đang chạy
        xuống gần / vượt khỏi viewport.
      */

      if (rect.bottom > safeBottom) {
        const scrollAmount = rect.bottom - safeBottom + 24;

        window.scrollBy({
          top: scrollAmount,
          left: 0,
          behavior: "smooth",
        });
      }
    });
  };

  /* =========================================================
     SCROLL TO NEW PARAGRAPH
  ========================================================= */

  const revealNextParagraph = (elementRef) => {
    window.setTimeout(() => {
      if (!elementRef.current) {
        return;
      }

      const isMobile = window.matchMedia("(max-width: 820px)").matches;

      if (!isMobile) {
        return;
      }

      const rect = elementRef.current.getBoundingClientRect();

      const safeBottom = window.innerHeight - 150;

      if (rect.top > safeBottom) {
        window.scrollBy({
          top: rect.top - window.innerHeight * 0.58,
          behavior: "smooth",
        });
      }
    }, 180);
  };

  /* =========================================================
     OPEN LETTER
  ========================================================= */

  const openLetter = () => {
    if (opened) return;

    setOpened(true);

    setTypingStarted(false);
    setTypingStep(0);

    gsap
      .timeline()

      .to(letterRef.current, {
        y: -22,
        rotate: -1,
        duration: 0.45,
        ease: "power2.out",
      })

      .to(letterRef.current, {
        scale: 1.03,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",

        onComplete: () => {
          /*
            Nghỉ một chút sau khi mở thư
            rồi mới bắt đầu viết.
          */

          window.setTimeout(() => {
            setTypingStarted(true);
          }, 220);
        },
      });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section ref={wrapRef} className="letter-scene">
      {/* =====================================================
          FLOATING DECOR
      ===================================================== */}

      <FloatingDecor variant="letter" />

      {/* =====================================================
          TITLE
      ===================================================== */}

      <p className="eyebrow center">A LETTER FOR YOU</p>

      <h1 className="letter-main-title font-handwriting">
        Chúc mừng sinh nhật em yêu...
      </h1>

      {/* =====================================================
          PAPER
      ===================================================== */}

      <div className="paper-stack" onClick={openLetter}>
        <div className="paper paper-back back-two" />

        <div className="paper paper-back back-one" />

        <article
          ref={letterRef}
          className={`paper main-letter ${opened ? "opened" : ""}`}
        >
          {/* =================================================
              CLOSED LETTER
          ================================================= */}

          {!opened ? (
            <div className="letter-cover">
              <span className="wax-seal">♥</span>

              <h3 className="letter-card-title">
                Gửi đến cô gái đặc biệt nhất của anh
              </h3>

              <p>Chạm vào lá thư để mở món quà nhỏ này</p>
            </div>
          ) : (
            /* =================================================
               LETTER CONTENT
            ================================================= */

            <div className="letter-content">
              {/* =============================================
                  GREETING
              ============================================= */}

              <HandwritingText
                ref={greetingRef}
                as="p"
                className="script font-handwriting"
                text="Gửi Mimi,"
                speed={65}
                delay={150}
                showCursor
                start={typingStarted && typingStep >= 0}
                onProgress={(current, total) =>
                  keepTextVisible(greetingRef, current, total)
                }
                onComplete={() => {
                  setTypingStep(1);

                  revealNextParagraph(paragraph1Ref);
                }}
              />

              {/* =============================================
                  PARAGRAPH 1
              ============================================= */}

              <HandwritingText
                ref={paragraph1Ref}
                as="p"
                text="Anh mong tuổi mới của em sẽ có thật nhiều niềm vui, thật nhiều tiếng cười và những điều tốt đẹp mà em xứng đáng có được ♡."
                speed={24}
                delay={250}
                start={typingStarted && typingStep >= 1}
                showCursor={typingStep === 1}
                onProgress={(current, total) =>
                  keepTextVisible(paragraph1Ref, current, total)
                }
                onComplete={() => {
                  setTypingStep(2);

                  revealNextParagraph(paragraph2Ref);
                }}
              />

              {/* =============================================
                  PARAGRAPH 2
              ============================================= */}

              <HandwritingText
                ref={paragraph2Ref}
                as="p"
                text="Cảm ơn em vì đã xuất hiện trong cuộc sống của anh thêm một lần nữa. Cảm ơn em vì những cuộc trò chuyện, những lần cùng nhau đi đâu đó, những khoảnh khắc rất bình thường nhưng khi có em bên cạnh lại trở thành những kỷ niệm thật đặc biệt."
                speed={20}
                delay={300}
                start={typingStarted && typingStep >= 2}
                showCursor={typingStep === 2}
                onProgress={(current, total) =>
                  keepTextVisible(paragraph2Ref, current, total)
                }
                onComplete={() => {
                  setTypingStep(3);

                  revealNextParagraph(paragraph3Ref);
                }}
              />

              {/* =============================================
                  PARAGRAPH 3
              ============================================= */}

              <HandwritingText
                ref={paragraph3Ref}
                as="p"
                text="Anh mong rằng trong tuổi mới, em sẽ luôn khỏe mạnh, bình an, tự tin với những điều mình lựa chọn và từng bước thực hiện được những điều mà em mong muốn. Những ngày vui thì anh muốn được vui cùng em, còn những ngày mệt mỏi thì anh cũng mong mình có thể ở bên cạnh em."
                speed={20}
                delay={300}
                start={typingStarted && typingStep >= 3}
                showCursor={typingStep === 3}
                onProgress={(current, total) =>
                  keepTextVisible(paragraph3Ref, current, total)
                }
                onComplete={() => {
                  setTypingStep(4);

                  revealNextParagraph(paragraph4Ref);
                }}
              />

              {/* =============================================
                  PARAGRAPH 4
              ============================================= */}

              <HandwritingText
                ref={paragraph4Ref}
                as="p"
                text="Anh đã chuẩn bị một món quà nhỏ ở phía sau lá thư này. Không phải điều gì quá lớn lao, chỉ là một nơi để anh giữ lại những bức ảnh, những câu chuyện và những khoảnh khắc của chúng ta."
                speed={21}
                delay={300}
                start={typingStarted && typingStep >= 4}
                showCursor={typingStep === 4}
                onProgress={(current, total) =>
                  keepTextVisible(paragraph4Ref, current, total)
                }
                onComplete={() => {
                  setTypingStep(5);

                  revealNextParagraph(paragraph5Ref);
                }}
              />

              {/* =============================================
                  PARAGRAPH 5
              ============================================= */}

              <HandwritingText
                ref={paragraph5Ref}
                as="p"
                text="Hy vọng rằng sau sinh nhật năm nay, chúng ta sẽ còn có thêm thật nhiều kỷ niệm để tiếp tục lấp đầy những trang tiếp theo em nhé. ♡"
                speed={22}
                delay={300}
                start={typingStarted && typingStep >= 5}
                showCursor={typingStep === 5}
                onProgress={(current, total) =>
                  keepTextVisible(paragraph5Ref, current, total)
                }
                onComplete={() => {
                  setTypingStep(6);

                  revealNextParagraph(signatureRef);
                }}
              />

              {/* =============================================
                  SIGNATURE
              ============================================= */}

              <HandwritingText
                ref={signatureRef}
                as="p"
                className="signature font-handwriting"
                text="— Happy birthday, Mimi ♡."
                speed={55}
                delay={400}
                start={typingStarted && typingStep >= 6}
                showCursor={typingStep === 6}
                onProgress={(current, total) =>
                  keepTextVisible(signatureRef, current, total)
                }
                onComplete={() => {
                  setTypingStep(7);

                  /*
                    Scroll xuống một chút để
                    nút hiện trọn vẹn.
                  */

                  window.setTimeout(() => {
                    if (window.matchMedia("(max-width: 820px)").matches) {
                      window.scrollBy({
                        top: 110,
                        behavior: "smooth",
                      });
                    }
                  }, 350);
                }}
              />

              {/* =============================================
                  OPEN ALBUM
              ============================================= */}

              {typingStep >= 7 && (
                <button
                  className="open-album-button letter-button-reveal"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    onOpenAlbum?.();
                  }}
                >
                  Mở món quà của em
                  <span> →</span>
                </button>
              )}
            </div>
          )}
        </article>
      </div>

      {/* =====================================================
          CLOSED HINT
      ===================================================== */}

      {!opened && (
        <div className="next-note">Chạm vào lá thư để đọc lời nhắn.</div>
      )}
    </section>
  );
}
