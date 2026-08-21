"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { memories } from "../data/memories";
import FloatingDecor from "./FloatingDecor";
import { createPortal } from "react-dom";
import HandwritingText from "./HandwritingText";

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
     PHOTO VIEWER STATE
  ========================================= */

  const [viewerOpen, setViewerOpen] = useState(false);

  const [viewerIndex, setViewerIndex] = useState(0);

  /* =========================================
     ALBUM TYPING STATE
  ========================================= */

  const [albumTypingStarted, setAlbumTypingStarted] = useState(false);
  const [albumTypingStep, setAlbumTypingStep] = useState(0);

  /* =========================================
     REFS
  ========================================= */

  const sceneRef = useRef(null);

  // Animation lật trang bằng button
  const turnRef = useRef(null);

  // Swipe mobile
  const bookRef = useRef(null);

  // Viewer
  const photoViewerRef = useRef(null);

  const viewerImageRef = useRef(null);

  // Album typing
  const albumTitleRef = useRef(null);
  const albumNoteRef = useRef(null);
  const albumSignatureRef = useRef(null);

  /* =========================================
     TOUCH / SWIPE REFS
  ========================================= */

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const touchCurrentX = useRef(0);
  const touchCurrentY = useRef(0);

  /*
    null
    horizontal
    vertical
  */

  const gestureDirection = useRef(null);

  /* =========================================
     CURRENT MEMORY
  ========================================= */

  const memory = memories[index];

  /* =========================================
     IMAGE DATA
  ========================================= */

  const imageList = Array.isArray(memory.images)
    ? memory.images.filter(Boolean)
    : [];

  const imageCount = imageList.length;

  /*
    Nếu chỉ có 1 ảnh trong images
    thì coi như ảnh đơn
  */

  const hasMultipleImages = imageCount > 1;

  const singleImageSrc = imageCount === 1 ? imageList[0] : memory.image;

  /* =========================================
     VIEWER IMAGES
  ========================================= */

  const viewerImages =
    imageList.length > 0 ? imageList : singleImageSrc ? [singleImageSrc] : [];

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
     ALBUM TYPING
     Mỗi lần sang memory mới:
     - reset chữ
     - chờ hiệu ứng lật trang ổn định
     - bắt đầu viết title -> note -> signature
  ========================================= */

  useEffect(() => {
    setAlbumTypingStarted(false);
    setAlbumTypingStep(0);

    const timer = window.setTimeout(() => {
      setAlbumTypingStarted(true);
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [memory.id]);

  /* =========================================
     PHOTO VIEWER OPEN ANIMATION
  ========================================= */

  useEffect(() => {
    if (!viewerOpen || !photoViewerRef.current) {
      return;
    }

    gsap.fromTo(
      photoViewerRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.84,
        rotation: -2,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,

        duration: 0.48,

        ease: "back.out(1.45)",
      },
    );
  }, [viewerOpen]);

  /* =========================================
     PHOTO CHANGE ANIMATION
  ========================================= */

  useEffect(() => {
    if (!viewerOpen || !viewerImageRef.current) {
      return;
    }

    gsap.fromTo(
      viewerImageRef.current,
      {
        opacity: 0,
        scale: 0.97,
      },
      {
        opacity: 1,
        scale: 1,

        duration: 0.3,

        ease: "power2.out",
      },
    );
  }, [viewerIndex, viewerOpen]);

  /* =========================================
     PHOTO VIEWER KEYBOARD
  ========================================= */

  useEffect(() => {
    if (!viewerOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;

    const handleKeyboard = (event) => {
      /* ESC */

      if (event.key === "Escape") {
        closePhotoViewer();

        return;
      }

      /* LEFT */

      if (event.key === "ArrowLeft" && viewerImages.length > 1) {
        previousPhoto();

        return;
      }

      /* RIGHT */

      if (event.key === "ArrowRight" && viewerImages.length > 1) {
        nextPhoto();
      }
    };

    /*
      Không scroll website
      khi đang xem ảnh lớn
    */

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      document.body.style.overflow = previousBodyOverflow;

      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [viewerOpen, viewerIndex, viewerImages.length]);

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
     OPEN PHOTO VIEWER
  ========================================= */

  const openPhotoViewer = (photoIndex = 0) => {
    if (viewerImages.length === 0) {
      return;
    }

    setViewerIndex(photoIndex);

    setViewerOpen(true);
  };

  /* =========================================
     CLOSE PHOTO VIEWER
  ========================================= */

  const closePhotoViewer = () => {
    if (!photoViewerRef.current) {
      setViewerOpen(false);

      return;
    }

    gsap.to(photoViewerRef.current, {
      opacity: 0,

      y: 20,

      scale: 0.92,

      rotation: 1,

      duration: 0.22,

      ease: "power2.in",

      onComplete: () => {
        setViewerOpen(false);
      },
    });
  };

  /* =========================================
     PREVIOUS PHOTO
  ========================================= */

  const previousPhoto = () => {
    if (viewerImages.length <= 1) {
      return;
    }

    setViewerIndex((current) =>
      current === 0 ? viewerImages.length - 1 : current - 1,
    );
  };

  /* =========================================
     NEXT PHOTO
  ========================================= */

  const nextPhoto = () => {
    if (viewerImages.length <= 1) {
      return;
    }

    setViewerIndex((current) =>
      current === viewerImages.length - 1 ? 0 : current + 1,
    );
  };

  /* =========================================
     GO TO PAGE
     BUTTON / DOTS
  ========================================= */

  const goToPage = (targetIndex) => {
    if (turning || viewerOpen) {
      return;
    }

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
       NEXT
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
       PREVIOUS
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
       PAGE TURN
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

    if (!book) {
      return;
    }

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
     SWIPE PAGE CHANGE
  ========================================= */

  const animateSwipePage = (targetIndex, direction) => {
    if (turning || viewerOpen) {
      return;
    }

    /* =====================================
       OUT OF RANGE
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

    const exitX = direction > 0 ? -150 : 150;

    const enterX = direction > 0 ? 105 : -105;

    const exitRotation = direction > 0 ? -1.5 : 1.5;

    const enterRotation = direction > 0 ? 1 : -1;

    /* =====================================
       CURRENT PAGE OUT
    ===================================== */

    gsap.to(book, {
      x: exitX,

      rotation: exitRotation,

      scale: 0.985,

      opacity: 0,

      duration: 0.22,

      ease: "power2.in",

      onComplete: () => {
        setIndex(targetIndex);

        scrollAlbumToTop();

        requestAnimationFrame(() => {
          /* =============================
                 NEW PAGE START POSITION
              ============================= */

          gsap.set(book, {
            x: enterX,

            rotation: enterRotation,

            scale: 0.985,

            opacity: 0,
          });

          /* =============================
                 NEW PAGE ENTER
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
    if (turning || viewerOpen) {
      return;
    }

    const touch = event.touches[0];

    touchStartX.current = touch.clientX;

    touchStartY.current = touch.clientY;

    touchCurrentX.current = touch.clientX;

    touchCurrentY.current = touch.clientY;

    gestureDirection.current = null;

    if (bookRef.current) {
      gsap.killTweensOf(bookRef.current);
    }
  };

  /* =========================================
     TOUCH MOVE
  ========================================= */

  const handleTouchMove = (event) => {
    if (turning || viewerOpen) {
      return;
    }

    const touch = event.touches[0];

    touchCurrentX.current = touch.clientX;

    touchCurrentY.current = touch.clientY;

    const distanceX = touch.clientX - touchStartX.current;

    const distanceY = touch.clientY - touchStartY.current;

    /* =====================================
         DETECT DIRECTION
      ===================================== */

    if (gestureDirection.current === null) {
      if (Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10) {
        return;
      }

      if (Math.abs(distanceY) > Math.abs(distanceX)) {
        gestureDirection.current = "vertical";

        return;
      }

      gestureDirection.current = "horizontal";
    }

    if (gestureDirection.current !== "horizontal") {
      return;
    }

    const book = bookRef.current;

    if (!book) {
      return;
    }

    /* =====================================
         RESISTANCE
      ===================================== */

    let resistance = 0.44;

    if (
      (index === 0 && distanceX > 0) ||
      (index === memories.length - 1 && distanceX < 0)
    ) {
      resistance = 0.14;
    }

    let moveX = distanceX * resistance;

    moveX = Math.max(
      -100,

      Math.min(100, moveX),
    );

    const rotation = moveX * 0.012;

    const scale =
      1 -
      Math.min(
        Math.abs(moveX) / 6500,

        0.015,
      );

    const opacity =
      1 -
      Math.min(
        Math.abs(moveX) / 700,

        0.1,
      );

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
    if (turning || viewerOpen) {
      return;
    }

    if (gestureDirection.current !== "horizontal") {
      gestureDirection.current = null;

      return;
    }

    const distanceX = touchCurrentX.current - touchStartX.current;

    const distanceY = touchCurrentY.current - touchStartY.current;

    gestureDirection.current = null;

    const minimumSwipeDistance = 65;

    const isValidSwipe =
      Math.abs(distanceX) > minimumSwipeDistance &&
      Math.abs(distanceX) > Math.abs(distanceY) * 1.15;

    /* =====================================
         SWIPE LEFT
         NEXT
      ===================================== */

    if (isValidSwipe && distanceX < 0 && index < memories.length - 1) {
      animateSwipePage(index + 1, 1);

      return;
    }

    /* =====================================
         SWIPE RIGHT
         PREVIOUS
      ===================================== */

    if (isValidSwipe && distanceX > 0 && index > 0) {
      animateSwipePage(index - 1, -1);

      return;
    }

    resetBookPosition();
  };

  /* =========================================
     TOUCH CANCEL
  ========================================= */

  const handleTouchCancel = () => {
    gestureDirection.current = null;

    if (!turning && !viewerOpen) {
      resetBookPosition();
    }
  };

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
      <FloatingDecor variant="album" />
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

            {/* =================================
                POLAROID
            ================================= */}

            <div className="album-polaroid">
              {/* =================================
                  MULTIPLE IMAGES
              ================================= */}

              {hasMultipleImages ? (
                <div className={`album-photo-grid ${getGridClass()}`}>
                  {imageList.map((img, imgIndex) => (
                    <div
                      key={`${memory.id}-${imgIndex}`}
                      className="album-grid-cell"
                    >
                      <button
                        type="button"
                        className="album-grid-image photo-clickable"
                        aria-label={`Xem ảnh ${imgIndex + 1} lớn hơn`}
                        onClick={() => openPhotoViewer(imgIndex)}
                      >
                        <MemoryImage
                          src={img}
                          alt={`${memory.title} - ảnh ${imgIndex + 1}`}
                          number={imgIndex + 1}
                        />

                        <span className="photo-zoom-hint" aria-hidden="true">
                          ⤢
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* =================================
                   SINGLE IMAGE
                ================================= */

                <div className="album-photo">
                  <button
                    type="button"
                    className="single-photo-clickable photo-clickable"
                    aria-label="Xem ảnh lớn"
                    onClick={() => openPhotoViewer(0)}
                  >
                    <MemoryImage
                      src={singleImageSrc}
                      alt={memory.title}
                      number={index + 1}
                    />

                    <span className="photo-zoom-hint" aria-hidden="true">
                      ⤢
                    </span>
                  </button>
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

            <div className="memory-copy" key={`memory-copy-${memory.id}`}>
              {/* =================================
                  MEMORY NUMBER
                  Hiện cố định ngay từ đầu
              ================================= */}

              <span className="memory-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* =================================
                  TITLE
                  Giữ sẵn vị trí cuối cùng,
                  sau đó viết từng ký tự
              ================================= */}

              <HandwritingText
                key={`album-title-${memory.id}`}
                ref={albumTitleRef}
                as="h3"
                text={memory.title}
                speed={48}
                delay={120}
                reserveSpace
                start={albumTypingStarted && albumTypingStep >= 0}
                showCursor={albumTypingStarted && albumTypingStep === 0}
                onComplete={() => {
                  setAlbumTypingStep(1);
                }}
              />

              <div className="mini-rule" />

              {/* =================================
                  NOTE
              ================================= */}

              <HandwritingText
                key={`album-note-${memory.id}`}
                ref={albumNoteRef}
                as="p"
                className="memory-typing-note"
                text={memory.note}
                speed={21}
                delay={260}
                reserveSpace
                start={albumTypingStarted && albumTypingStep >= 1}
                showCursor={albumTypingStarted && albumTypingStep === 1}
                onComplete={() => {
                  setAlbumTypingStep(2);
                }}
              />

              {/* =================================
                  HANDWRITING END
              ================================= */}

              <HandwritingText
                key={`album-signature-${memory.id}`}
                ref={albumSignatureRef}
                as="p"
                className="handwritten font-handwriting"
                text="— một mẩu ký ức của chúng ta ♡"
                speed={42}
                delay={320}
                reserveSpace
                start={albumTypingStarted && albumTypingStep >= 2}
                showCursor={albumTypingStarted && albumTypingStep === 2}
                onComplete={() => {
                  setAlbumTypingStep(3);
                }}
              />
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

        {/* DOTS */}

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
      {/* =====================================
    PHOTO VIEWER
    PORTAL RA BODY
===================================== */}

      {viewerOpen &&
        viewerImages.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="photo-viewer-overlay" onClick={closePhotoViewer}>
            <div
              ref={photoViewerRef}
              className="photo-viewer"
              onClick={(event) => event.stopPropagation()}
            >
              {/* CLOSE */}

              <button
                type="button"
                className="photo-viewer-close"
                aria-label="Đóng ảnh"
                onClick={closePhotoViewer}
              >
                ×
              </button>

              {/* PHOTO STAGE */}

              <div className="photo-viewer-stage">
                {/* PREVIOUS */}

                {viewerImages.length > 1 && (
                  <button
                    type="button"
                    className="photo-viewer-nav photo-viewer-prev"
                    aria-label="Ảnh trước"
                    onClick={previousPhoto}
                  >
                    ‹
                  </button>
                )}

                {/* POLAROID */}

                <div className="photo-viewer-polaroid">
                  <div className="photo-viewer-image-wrap">
                    <img
                      key={viewerImages[viewerIndex]}
                      ref={viewerImageRef}
                      src={viewerImages[viewerIndex]}
                      alt={`${memory.title} - ảnh ${viewerIndex + 1}`}
                      draggable={false}
                    />
                  </div>

                  {/* CAPTION */}

                  <p className="photo-viewer-caption">
                    {memory.caption || "our memory ♡"}
                  </p>
                </div>

                {/* NEXT */}

                {viewerImages.length > 1 && (
                  <button
                    type="button"
                    className="photo-viewer-nav photo-viewer-next"
                    aria-label="Ảnh tiếp theo"
                    onClick={nextPhoto}
                  >
                    ›
                  </button>
                )}
              </div>

              {/* INFO */}

              <div className="photo-viewer-info">
                {viewerImages.length > 1 && (
                  <span className="photo-viewer-counter">
                    {viewerIndex + 1} / {viewerImages.length}
                  </span>
                )}

                <span className="photo-viewer-hint">
                  Chạm bên ngoài để đóng ♡
                </span>
              </div>
            </div>
          </div>,

          document.body,
        )}
    </section>
  );
}
