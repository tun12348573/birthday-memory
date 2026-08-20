"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { memories } from "../data/memories";

/* =========================================
   IMAGE COMPONENT
========================================= */

function MemoryImage({ src, alt, number }) {
  const [error, setError] = useState(false);

  // Khi chuyển sang ảnh khác thì reset trạng thái lỗi
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className="photo-fallback">
        <span>Ảnh {number}</span>

        <small>{src || "Chưa có đường dẫn ảnh"}</small>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="memory-image"
      onError={() => setError(true)}
    />
  );
}

/* =========================================
   ALBUM SCREEN
========================================= */

export default function AlbumScreen({ onBack, onFinish }) {
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState(false);

  const sceneRef = useRef(null);
  const turnRef = useRef(null);

  const memory = memories[index];

  /* =========================================
     ENTER ANIMATION
  ========================================= */

  useEffect(() => {
    gsap.fromTo(
      sceneRef.current,
      {
        opacity: 0,
        y: 55,
        scale: 0.94,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.95,
        ease: "back.out(1.25)",
      },
    );
  }, []);

  /* =========================================
     GO TO PAGE
  ========================================= */

  const goToPage = (targetIndex) => {
    if (turning) return;

    if (
      targetIndex < 0 ||
      targetIndex >= memories.length ||
      targetIndex === index
    ) {
      return;
    }

    const direction = targetIndex > index ? 1 : -1;

    setTurning(true);

    const page = turnRef.current;

    if (!page) {
      setIndex(targetIndex);
      setTurning(false);
      return;
    }

    /* =========================
       NEXT PAGE
       phải -> trái
    ========================= */

    if (direction > 0) {
      gsap.set(page, {
        left: "auto",
        right: 0,
        rotateY: 0,
        transformOrigin: "left center",
        opacity: 1,
      });
    } else {

    /* =========================
       PREVIOUS PAGE
       trái -> phải
    ========================= */
      gsap.set(page, {
        left: 0,
        right: "auto",
        rotateY: 0,
        transformOrigin: "right center",
        opacity: 1,
      });
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(page, {
          opacity: 0,
          rotateY: 0,
          left: "auto",
          right: 0,
        });

        setTurning(false);
      },
    });

    timeline.to(page, {
      rotateY: direction > 0 ? -180 : 180,

      duration: 0.9,

      ease: "power2.inOut",
    });

    /*
      Đổi nội dung khi trang
      đi qua giữa quyển sách
    */

    timeline.call(
      () => {
        setIndex(targetIndex);
      },
      [],
      0.43,
    );
  };

  /* =========================================
     NEXT / PREVIOUS
  ========================================= */

  const changePage = (direction) => {
    goToPage(index + direction);
  };

  /* =========================================
     IMAGE DATA
  ========================================= */

  const imageList = Array.isArray(memory.images)
    ? memory.images.filter(Boolean)
    : [];

  const imageCount = imageList.length;

  /*
    Nếu chỉ có 1 phần tử trong images
    thì vẫn hiển thị như ảnh đơn.
  */

  const hasMultipleImages = imageCount > 1;

  const singleImageSrc = imageCount === 1 ? imageList[0] : memory.image;

  /* =========================================
     GRID CLASS
  ========================================= */

  const getGridClass = () => {
    if (imageCount === 2) {
      return "two-images";
    }

    if (imageCount === 3) {
      return "three-images";
    }

    return "four-images";
  };

  return (
    <section ref={sceneRef} className="album-scene">
      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="album-topbar">
        <button className="text-button" type="button" onClick={onBack}>
          ← Lá thư
        </button>

        <p className="album-kicker">OUR LITTLE STORY</p>

        <span className="album-counter">
          {String(index + 1).padStart(2, "0")}

          {" / "}

          {String(memories.length).padStart(2, "0")}
        </span>
      </div>

      {/* =====================================
          HEADING
      ===================================== */}

      <div className="album-heading">
        <p className="eyebrow center">MEMORY ALBUM</p>

        <h2>Những trang mình muốn giữ lại</h2>
      </div>

      {/* =====================================
          BOOK
      ===================================== */}

      <div className="album-book-wrap">
        <div className="album-book">
          {/* BOOK SPINE */}

          <div className="book-spine" aria-hidden="true" />

          {/* =================================
              LEFT PAGE
          ================================= */}

          <article className="album-leaf album-left-page">
            <span className="page-corner corner-left">♡</span>

            <p className="album-date">{memory.date}</p>

            {/* ===============================
                POLAROID
            =============================== */}

            <div className="album-polaroid">
              {/* =============================
                  MULTIPLE IMAGES
                  2 / 3 / 4
              ============================= */}

              {hasMultipleImages ? (
                <div className={`album-photo-grid ${getGridClass()}`}>
                  {imageList.map((img, imgIndex) => (
                    <div
                      key={`${memory.id}-${imgIndex}`}
                      className="album-grid-cell"
                    >
                      <div className="album-grid-image">
                        <MemoryImage
                          src={img}
                          alt={`${memory.title} - ảnh ${imgIndex + 1}`}
                          number={imgIndex + 1}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ===========================
                   SINGLE IMAGE
                =========================== */

                <div className="album-photo">
                  <MemoryImage
                    src={singleImageSrc}
                    alt={memory.title}
                    number={index + 1}
                  />
                </div>
              )}

              {/* CAPTION */}

              <p>{memory.caption}</p>
            </div>

            {/* =================================
                DECORATION
            ================================= */}

            <span className="tape tape-one" aria-hidden="true" />

            <span className="tiny-doodle doodle-one" aria-hidden="true">
              ✦
            </span>

            <span className="tiny-doodle doodle-two" aria-hidden="true">
              ♡
            </span>
          </article>

          {/* =================================
              RIGHT PAGE
          ================================= */}

          <article className="album-leaf album-right-page">
            <span className="page-corner corner-right">✿</span>

            <div className="memory-copy">
              <span className="memory-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{memory.title}</h3>

              <div className="mini-rule" />

              <p>{memory.note}</p>

              <p className="handwritten">— một mẩu ký ức của chúng ta ♡</p>
            </div>

            {/* STAMP */}

            <span className="stamp">
              LOVE
              <br />
              MEMORY
            </span>

            <span className="tiny-doodle doodle-three" aria-hidden="true">
              ❀
            </span>
          </article>

          {/* =================================
              PAGE TURN ANIMATION
          ================================= */}

          <div ref={turnRef} className="turning-sheet" aria-hidden="true">
            <div className="turning-sheet-front" />

            <div className="turning-sheet-back" />
          </div>
        </div>
      </div>

      {/* =====================================
          CONTROLS
      ===================================== */}

      <div className="album-controls">
        {/* PREVIOUS */}

        <button
          type="button"
          className="album-nav"
          disabled={index === 0 || turning}
          onClick={() => changePage(-1)}
        >
          ← Trang trước
        </button>

        {/* =================================
            DOTS
        ================================= */}

        <div className="album-dots" aria-label="Vị trí trang">
          {memories.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Trang ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "page" : undefined}
              disabled={turning}
              className={`album-dot ${dotIndex === index ? "active" : ""}`}
              onClick={() => goToPage(dotIndex)}
            />
          ))}
        </div>

        {/* =================================
            LAST PAGE
        ================================= */}

        {index === memories.length - 1 ? (
          <button
            type="button"
            className="album-nav album-finish-button"
            disabled={turning}
            onClick={onFinish}
          >
            Xem thời gian của chúng ta →
          </button>
        ) : (
          /* =============================
             NEXT PAGE
          ============================= */

          <button
            type="button"
            className="album-nav"
            disabled={turning}
            onClick={() => changePage(1)}
          >
            Trang sau →
          </button>
        )}
      </div>
    </section>
  );
}
