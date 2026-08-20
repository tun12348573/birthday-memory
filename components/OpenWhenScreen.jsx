"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const openWhenLetters = [
  {
    id: 1,
    icon: "☁",
    title: "Mở khi em buồn",
    subtitle: "for your rainy days",
    message: (
      <>
        <p className="openwhen-script">Gửi em,</p>

        <p>
          Nếu em đang đọc lá thư này thì chắc hôm nay không phải là một ngày
          thật sự vui với em.
        </p>

        <p>
          Anh không biết chính xác điều gì đang khiến em buồn, nhưng anh muốn em
          nhớ rằng em không cần phải lúc nào cũng mạnh mẽ.
        </p>

        <p>
          Nếu muốn khóc thì cứ khóc một chút. Nếu mệt thì nghỉ một chút. Đừng ép
          bản thân phải ổn ngay lập tức.
        </p>

        <p>
          Và khi em cảm thấy tốt hơn một chút, hãy nhớ rằng vẫn luôn có một
          người rất thương em và mong em có thật nhiều ngày vui.
        </p>

        <p className="openwhen-signature">— Anh ở đây ♡</p>
      </>
    ),
  },

  {
    id: 2,
    icon: "♡",
    title: "Mở khi em nhớ anh",
    subtitle: "when you miss me",
    message: (
      <>
        <p className="openwhen-script">Nếu em nhớ anh...</p>

        <p>
          Thì anh cũng muốn nói rằng có rất nhiều lúc anh đang làm một việc hoàn
          toàn bình thường nhưng tự nhiên lại nhớ tới em.
        </p>

        <p>
          Có thể là một bài hát, một món ăn, một nơi chúng ta từng đi qua, hay
          đơn giản chỉ là một khoảnh khắc khiến anh nghĩ: “Ước gì em đang ở
          đây.”
        </p>

        <p>
          Nếu lúc này chúng ta không ở cạnh nhau, hãy coi lá thư này như một cái
          ôm nhỏ anh gửi đến em nhé.
        </p>

        <p className="openwhen-signature">— Nhớ em nhiều ♡</p>
      </>
    ),
  },

  {
    id: 3,
    icon: "☕",
    title: "Mở khi em mệt",
    subtitle: "take a little rest",
    message: (
      <>
        <p className="openwhen-script">Nghỉ một chút nha em,</p>

        <p>
          Em không cần phải hoàn thành mọi thứ trong một ngày và cũng không cần
          phải lúc nào cũng chạy thật nhanh.
        </p>

        <p>
          Anh biết em đã cố gắng rất nhiều rồi. Có những điều người khác không
          nhìn thấy, nhưng anh biết phía sau chúng là rất nhiều thời gian và
          năng lượng của em.
        </p>

        <p>
          Hôm nay nếu mệt quá thì cho phép bản thân chậm lại một chút nhé. Ăn gì
          đó ngon, uống nước, nằm nghỉ và để ngày mai tiếp tục.
        </p>

        <p className="openwhen-signature">— Anh vẫn luôn tự hào về em ♡</p>
      </>
    ),
  },

  {
    id: 4,
    icon: "✦",
    title: "Mở khi em không tự tin",
    subtitle: "a reminder for you",
    message: (
      <>
        <p className="openwhen-script">Một lời nhắc nhỏ,</p>

        <p>
          Có thể có những lúc em nhìn bản thân và chỉ thấy những điều mình chưa
          làm tốt.
        </p>

        <p>
          Nhưng từ góc nhìn của anh, em có rất nhiều điều đáng yêu và đáng tự
          hào hơn em nghĩ.
        </p>

        <p>
          Anh thích cách em cố gắng, cách em quan tâm đến những người mình
          thương và cả những lúc em chẳng hoàn hảo chút nào.
        </p>

        <p>
          Vì vậy đừng quá khắt khe với bản thân nhé. Em vẫn đang trưởng thành
          từng chút một và như vậy đã rất tuyệt rồi.
        </p>

        <p className="openwhen-signature">— Tin vào bản thân nha ♡</p>
      </>
    ),
  },

  {
    id: 5,
    icon: "☾",
    title: "Mở khi em không ngủ được",
    subtitle: "for a quiet night",
    message: (
      <>
        <p className="openwhen-script">Chúc em ngủ ngon,</p>

        <p>
          Nếu đầu óc em đang có quá nhiều suy nghĩ thì tạm để chúng lại cho ngày
          mai nha.
        </p>

        <p>Không phải chuyện gì cũng cần có câu trả lời ngay trong tối nay.</p>

        <p>
          Nhắm mắt lại, hít một hơi thật chậm và tưởng tượng anh đang ở cạnh,
          kéo chăn lên cho em rồi nói:
        </p>

        <p className="openwhen-highlight">“Ngủ đi em, mai mình tính tiếp.”</p>

        <p className="openwhen-signature">— Good night, em yêu ♡</p>
      </>
    ),
  },

  {
    id: 6,
    icon: "♥",
    title: "Mở khi em cần được yêu thương",
    subtitle: "just because i love you",
    message: (
      <>
        <p className="openwhen-script">Không cần lý do đâu,</p>

        <p>
          Anh chỉ muốn để lại ở đây một lời nhắc rằng em là một người rất đặc
          biệt đối với anh.
        </p>

        <p>
          Cảm ơn em vì đã bước vào cuộc sống của anh và biến rất nhiều ngày bình
          thường trở thành những ngày mà anh muốn nhớ lại.
        </p>

        <p>
          Anh không biết tương lai sẽ có bao nhiêu trang nữa, nhưng anh mong
          rằng chúng ta vẫn sẽ tiếp tục có thật nhiều câu chuyện để kể.
        </p>

        <p className="openwhen-highlight">Anh yêu em. ♡</p>

        <p className="openwhen-signature">— Always yours</p>
      </>
    ),
  },
];

export default function OpenWhenScreen({ onBack, onContinue }) {
  const screenRef = useRef(null);
  const gridRef = useRef(null);
  const modalRef = useRef(null);

  const [openedLetter, setOpenedLetter] = useState(null);

  /* =========================================
     SCREEN ENTER
  ========================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".openwhen-header",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".openwhen-envelope",
        {
          opacity: 0,
          y: 45,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.09,
          duration: 0.6,
          delay: 0.15,
          ease: "back.out(1.4)",
        },
      );
    }, screenRef);

    return () => ctx.revert();
  }, []);

  /* =========================================
     OPEN MODAL ANIMATION
  ========================================= */

  useEffect(() => {
    if (!openedLetter || !modalRef.current) {
      return;
    }

    gsap.fromTo(
      modalRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.88,
        rotate: -1.5,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: "back.out(1.45)",
      },
    );
  }, [openedLetter]);

  /* =========================================
     ESC TO CLOSE
  ========================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && openedLetter) {
        closeLetter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openedLetter]);

  /* =========================================
     OPEN LETTER
  ========================================= */

  const openLetter = (letter) => {
    setOpenedLetter(letter);
  };

  /* =========================================
     CLOSE LETTER
  ========================================= */

  const closeLetter = () => {
    if (!modalRef.current) {
      setOpenedLetter(null);
      return;
    }

    gsap.to(modalRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.94,
      duration: 0.25,
      ease: "power2.in",

      onComplete: () => {
        setOpenedLetter(null);
      },
    });
  };

  return (
    <section ref={screenRef} className="openwhen-screen">
      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="openwhen-topbar">
        <button type="button" className="text-button" onClick={onBack}>
          ← Album
        </button>

        <span className="openwhen-small-title">FOR YOU ♡</span>
      </div>

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="openwhen-header">
        <p className="eyebrow center">OPEN WHEN...</p>

        <h2 className="openwhen-title">Những lá thư dành cho em</h2>

        <p className="openwhen-description">
          Có những lúc anh không thể ở cạnh em, nên anh để lại vài lá thư nhỏ ở
          đây.
          <br />
          Chỉ mở chúng khi em cần nhé ♡
        </p>
      </header>

      {/* =====================================
          ENVELOPES
      ===================================== */}

      <div ref={gridRef} className="openwhen-grid">
        {openWhenLetters.map((letter, letterIndex) => (
          <button
            key={letter.id}
            type="button"
            className="openwhen-envelope"
            onClick={() => openLetter(letter)}
          >
            {/* PAPER */}

            <span className="envelope-paper">
              <span className="envelope-number">
                {String(letterIndex + 1).padStart(2, "0")}
              </span>

              <span className="envelope-icon">{letter.icon}</span>

              <span className="envelope-title">{letter.title}</span>

              <span className="envelope-subtitle">{letter.subtitle}</span>
            </span>

            {/* ENVELOPE */}

            <span className="envelope-body">
              <span className="envelope-flap" />

              <span className="envelope-heart">♥</span>
            </span>
          </button>
        ))}
      </div>

      {/* =====================================
          HINT
      ===================================== */}

      <p className="openwhen-hint">Chạm vào một phong thư để mở ✉</p>

      {/* =====================================
          CONTINUE
      ===================================== */}

      <button type="button" className="openwhen-continue" onClick={onContinue}>
        Xem thời gian của chúng ta
        <span> →</span>
      </button>

      {/* =====================================
          LETTER MODAL
      ===================================== */}

      {openedLetter && (
        <div className="openwhen-overlay" onClick={closeLetter}>
          <article
            ref={modalRef}
            className="openwhen-letter-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* TAPE */}

            <span className="openwhen-tape" aria-hidden="true" />

            {/* DECOR */}

            <span className="modal-heart modal-heart-one">♡</span>

            <span className="modal-heart modal-heart-two">✦</span>

            {/* CLOSE */}

            <button
              type="button"
              className="openwhen-close"
              onClick={closeLetter}
              aria-label="Đóng lá thư"
            >
              ×
            </button>

            {/* HEADER */}

            <div className="openwhen-modal-header">
              <span className="modal-icon">{openedLetter.icon}</span>

              <p>OPEN WHEN...</p>

              <h3>{openedLetter.title}</h3>
            </div>

            {/* MESSAGE */}

            <div className="openwhen-message">{openedLetter.message}</div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="openwhen-done"
              onClick={closeLetter}
            >
              Gấp lá thư lại ♡
            </button>
          </article>
        </div>
      )}
    </section>
  );
}
