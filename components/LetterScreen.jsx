"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LetterScreen({ onOpenAlbum }) {
  const wrapRef = useRef(null);
  const letterRef = useRef(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, y: 70, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.3)" },
    );
  }, []);

  const openLetter = () => {
    if (opened) return;
    setOpened(true);

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
      });
  };

  return (
    <section ref={wrapRef} className="letter-scene">
      <p className="eyebrow center">A LETTER FOR YOU</p>
      <h1 className="letter-main-title font-handwriting">
        Chúc mừng sinh nhật em yêu...
      </h1>

      <div className="paper-stack" onClick={openLetter}>
        <div className="paper paper-back back-two" />
        <div className="paper paper-back back-one" />

        <article
          ref={letterRef}
          className={`paper main-letter ${opened ? "opened" : ""}`}
        >
          {!opened ? (
            <div className="letter-cover">
              <span className="wax-seal">♥</span>
              <h3 className="letter-card-title">
                Gửi đến cô gái đặc biệt nhất của anh
              </h3>
              <p>Chạm vào lá thư để mở món quà nhỏ này</p>
            </div>
          ) : (
            <div className="letter-content">
              <p className="script font-handwriting">Gửi Mimi,</p>

              <p>
                Anh mong tuổi mới của em sẽ có thật nhiều niềm vui, thật nhiều
                tiếng cười và những điều tốt đẹp mà em xứng đáng có được ♡.
              </p>

              <p>
                Cảm ơn em vì đã xuất hiện trong cuộc sống của anh thêm một lần
                nữa. Cảm ơn em vì những cuộc trò chuyện, những lần cùng nhau đi
                đâu đó, những khoảnh khắc rất bình thường nhưng khi có em bên
                cạnh lại trở thành những kỷ niệm thật đặc biệt.
              </p>

              <p>
                Anh mong rằng trong tuổi mới, em sẽ luôn khỏe mạnh, bình an, tự
                tin với những điều mình lựa chọn và từng bước thực hiện được
                những điều mà em mong muốn. Những ngày vui thì anh muốn được vui
                cùng em, còn những ngày mệt mỏi thì anh cũng mong mình có thể ở
                bên cạnh em.
              </p>

              <p>
                Anh đã chuẩn bị một món quà nhỏ ở phía sau lá thư này. Không
                phải điều gì quá lớn lao, chỉ là một nơi để anh giữ lại những
                bức ảnh, những câu chuyện và những khoảnh khắc của chúng ta.
              </p>

              <p>
                Hy vọng rằng sau sinh nhật năm nay, chúng ta sẽ còn có thêm thật
                nhiều kỷ niệm để tiếp tục lấp đầy những trang tiếp theo em nhé.
                ♡
              </p>

              <p className="signature">
                — Happy birthday, Mimi ♡. <br />
              </p>
              <button
                className="open-album-button"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenAlbum();
                }}
              >
                Mở món quà của em
                <span> →</span>
              </button>
            </div>
          )}
        </article>
      </div>

      {!opened && (
        <div className="next-note">Chạm vào lá thư để đọc lời nhắn.</div>
      )}
    </section>
  );
}
