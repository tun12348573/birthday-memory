"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { memories } from "../data/memories";

/* =========================================
   IMAGE COMPONENT
========================================= */

function MemoryImage({ src, alt, number }) {
  const [error, setError] = useState(false);

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
      draggable={false}
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

  /* =========================================
     REFS
  ========================================= */

  const sceneRef = useRef(null);

  // Tờ giấy dùng cho animation khi nhấn nút
  const turnRef = useRef(null);

  // Toàn bộ quyển album dùng cho swipe mobile
  const bookRef = useRef(null);

  /* =========================================
     TOUCH / SWIPE REFS
  ========================================= */

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const touchCurrentX = useRef(0);
  const touchCurrentY = useRef(0);

  /*
    null
    "horizontal"
    "vertical"
  */
  const gestureDirection = useRef(null);

  /* =========================================
     CURRENT MEMORY
  ========================================= */

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
     SCROLL VỀ ĐẦU ALBUM
  ========================================= */

  const scrollAlbumToTop = () => {
    setTimeout(() => {
      sceneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  /* =========================================
     GO TO PAGE
     Dùng cho:
     - Trang trước
     - Trang sau
     - Dots
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

    /* =====================================
       FALLBACK
    ===================================== */

    if (!page) {
      setIndex(targetIndex);

      setTurning(false);

      scrollAlbumToTop();

      return;
    }

    /* =====================================
       NEXT PAGE
       phải -> trái
    ===================================== */

    if (direction > 0) {
      gsap.set(page, {
        left: "auto",
        right: 0,

        rotateY: 0,

        transformOrigin: "left center",

        opacity: 1,
      });
    } else {
      /* =====================================
       PREVIOUS PAGE
       trái -> phải
    ===================================== */
      gsap.set(page, {
        left: 0,
        right: "auto",

        rotateY: 0,

        transformOrigin: "right center",

        opacity: 1,
      });
    }

    /* =====================================
       PAGE TURN TIMELINE
    ===================================== */

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
      Đổi nội dung khi tờ giấy
      đi qua giữa album
    */

    timeline.call(
      () => {
        setIndex(targetIndex);

        scrollAlbumToTop();
      },
      [],
      0.43,
    );
  };

  /* =========================================
     NEXT / PREVIOUS BUTTON
  ========================================= */

  const changePage = (direction) => {
    goToPage(index + direction);
  };

  /* =========================================
     RESET BOOK POSITION
  ========================================= */

  const resetBookPosition = () => {
    const book = bookRef.current;

    if (!book) return;

    gsap.killTweensOf(book);

    gsap.to(book, {
      x: 0,

      rotation: 0,

      scale: 1,

      opacity: 1,

      duration: 0.35,

      ease: "back.out(2.2)",
    });
  };

  /* =========================================
     SWIPE PAGE CHANGE ANIMATION
  ========================================= */

  const animateSwipePage = (targetIndex, direction) => {
    if (turning) return;

    /* =====================================
       KHÔNG CÓ TRANG ĐỂ CHUYỂN
    ===================================== */

    if (targetIndex < 0 || targetIndex >= memories.length) {
      resetBookPosition();

      return;
    }

    const book = bookRef.current;

    if (!book) {
      setIndex(targetIndex);

      scrollAlbumToTop();

      return;
    }

    setTurning(true);

    gsap.killTweensOf(book);

    /*
      direction = 1
      → Trang sau
      → album bay sang trái

      direction = -1
      → Trang trước
      → album bay sang phải
    */

    const exitX = direction > 0 ? -150 : 150;

    const enterX = direction > 0 ? 105 : -105;

    const exitRotation = direction > 0 ? -1.5 : 1.5;

    const enterRotation = direction > 0 ? 1 : -1;

    /* =====================================
       ALBUM HIỆN TẠI BAY RA
    ===================================== */

    gsap.to(book, {
      x: exitX,

      rotation: exitRotation,

      scale: 0.985,

      opacity: 0,

      duration: 0.22,

      ease: "power2.in",

      onComplete: () => {
        /* ===============================
           ĐỔI MEMORY
        =============================== */

        setIndex(targetIndex);

        /* Cuộn về đầu album */

        scrollAlbumToTop();

        /*
          Chờ React render memory mới
        */

        requestAnimationFrame(() => {
          /* =============================
             ĐẶT MEMORY MỚI
             Ở PHÍA ĐỐI DIỆN
          ============================= */

          gsap.set(book, {
            x: enterX,

            rotation: enterRotation,

            scale: 0.985,

            opacity: 0,
          });

          /* =============================
             MEMORY MỚI TRƯỢT VÀO
          ============================= */

          gsap.to(book, {
            x: 0,

            rotation: 0,

            scale: 1,

            opacity: 1,

            duration: 0.4,

            ease: "power3.out",

            onComplete: () => {
              setTurning(false);
            },
          });
        });
      },
    });
  };

  /* =========================================
     TOUCH START
  ========================================= */

  const handleTouchStart = (event) => {
    if (turning) return;

    const touch = event.touches[0];

    touchStartX.current = touch.clientX;

    touchStartY.current = touch.clientY;

    touchCurrentX.current = touch.clientX;

    touchCurrentY.current = touch.clientY;

    /*
      Chưa biết người dùng muốn
      scroll hay swipe
    */

    gestureDirection.current = null;

    /*
      Nếu đang có animation đàn hồi
      thì dừng lại ngay
    */

    if (bookRef.current) {
      gsap.killTweensOf(bookRef.current);
    }
  };

  /* =========================================
     TOUCH MOVE
     ALBUM ĐI THEO NGÓN TAY
  ========================================= */

  const handleTouchMove = (event) => {
    if (turning) return;

    const touch = event.touches[0];

    touchCurrentX.current = touch.clientX;

    touchCurrentY.current = touch.clientY;

    const distanceX = touch.clientX - touchStartX.current;

    const distanceY = touch.clientY - touchStartY.current;

    /* =====================================
       XÁC ĐỊNH HƯỚNG GESTURE
    ===================================== */

    if (gestureDirection.current === null) {
      /*
        Ngón tay mới di chuyển nhẹ
        → chưa xử lý
      */

      if (Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10) {
        return;
      }

      /*
        Nếu di chuyển dọc nhiều hơn
        → người dùng đang scroll
      */

      if (Math.abs(distanceY) > Math.abs(distanceX)) {
        gestureDirection.current = "vertical";

        return;
      }

      /*
        Ngược lại:
        → swipe ngang
      */

      gestureDirection.current = "horizontal";
    }

    /* =====================================
       SCROLL DỌC
       KHÔNG LÀM GÌ
    ===================================== */

    if (gestureDirection.current !== "horizontal") {
      return;
    }

    const book = bookRef.current;

    if (!book) return;

    /* =====================================
       RESISTANCE
    ===================================== */

    let resistance = 0.44;

    /*
      Trang đầu:
      kéo sang phải

      Trang cuối:
      kéo sang trái

      → tăng lực cản
    */

    if (
      (index === 0 && distanceX > 0) ||
      (index === memories.length - 1 && distanceX < 0)
    ) {
      resistance = 0.14;
    }

    /* =====================================
       ALBUM DI CHUYỂN
    ===================================== */

    let moveX = distanceX * resistance;

    /*
      Không cho kéo quá xa
    */

    moveX = Math.max(-100, Math.min(100, moveX));

    /*
      Album nghiêng nhẹ
      theo hướng tay
    */

    const rotation = moveX * 0.012;

    /*
      Thu nhỏ cực nhẹ
    */

    const scale = 1 - Math.min(Math.abs(moveX) / 6500, 0.015);

    /*
      Giảm opacity rất nhẹ
    */

    const opacity = 1 - Math.min(Math.abs(moveX) / 700, 0.1);

    gsap.set(book, {
      x: moveX,

      rotation,

      scale,

      opacity,
    });
  };

  /* =========================================
     TOUCH END
  ========================================= */

  const handleTouchEnd = () => {
    if (turning) return;

    /* =====================================
       KHÔNG PHẢI SWIPE NGANG
    ===================================== */

    if (gestureDirection.current !== "horizontal") {
      gestureDirection.current = null;

      return;
    }

    const distanceX = touchCurrentX.current - touchStartX.current;

    const distanceY = touchCurrentY.current - touchStartY.current;

    gestureDirection.current = null;

    /* =====================================
       KHOẢNG CÁCH SWIPE
    ===================================== */

    const minimumSwipeDistance = 65;

    const isValidSwipe =
      Math.abs(distanceX) > minimumSwipeDistance &&
      Math.abs(distanceX) > Math.abs(distanceY) * 1.15;

    /* =====================================
       SWIPE LEFT
       ←
       TRANG SAU
    ===================================== */

    if (isValidSwipe && distanceX < 0 && index < memories.length - 1) {
      animateSwipePage(index + 1, 1);

      return;
    }

    /* =====================================
       SWIPE RIGHT
       →
       TRANG TRƯỚC
    ===================================== */

    if (isValidSwipe && distanceX > 0 && index > 0) {
      animateSwipePage(index - 1, -1);

      return;
    }

    /* =====================================
       KHÔNG ĐỦ XA
       → ĐÀN HỒI VỀ
    ===================================== */

    resetBookPosition();
  };

  /* =========================================
     TOUCH CANCEL
  ========================================= */

  const handleTouchCancel = () => {
    gestureDirection.current = null;

    if (!turning) {
      resetBookPosition();
    }
  };

  /* =========================================
     IMAGE DATA
  ========================================= */

  const imageList = Array.isArray(memory.images)
    ? memory.images.filter(Boolean)
    : [];

  const imageCount = imageList.length;

  /*
    Nếu chỉ có một ảnh trong images
    → coi như ảnh đơn
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

  /* =========================================
     JSX
  ========================================= */

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
          BOOK WRAPPER
          SWIPE CHỈ HOẠT ĐỘNG Ở ĐÂY
      ===================================== */}

      <div
        className="album-book-wrap"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div ref={bookRef} className="album-book">
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
              DÙNG KHI NHẤN BUTTON
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
        {/* =================================
            PREVIOUS
        ================================= */}

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
            Một số lá thư nhỏ của anh →
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
