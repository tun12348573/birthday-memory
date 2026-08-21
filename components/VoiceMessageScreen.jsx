"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import FloatingDecor from "./FloatingDecor";

export default function VoiceMessageScreen({ onBack, onContinue }) {
  const screenRef = useRef(null);
  const cardRef = useRef(null);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  /* =========================================================
     SCREEN ENTER
  ========================================================= */

  useEffect(() => {
    if (!screenRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 45,
          scale: 0.94,
          rotation: -1.5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: "back.out(1.35)",
        },
      );

      gsap.fromTo(
        ".voice-message-heading > *",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.25,
          ease: "power2.out",
        },
      );
    }, screenRef);

    return () => ctx.revert();
  }, []);

  /* =========================================================
     DUCK BACKGROUND MUSIC
  ========================================================= */

  const duckBackgroundMusic = (active) => {
    window.dispatchEvent(
      new CustomEvent("voice-message-duck", {
        detail: {
          active,
        },
      }),
    );
  };

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      /*
        Khi rời khỏi màn Voice:
        - dừng voice
        - trả volume nhạc nền về bình thường
      */

      const audio = audioRef.current;

      if (audio) {
        audio.pause();
      }

      duckBackgroundMusic(false);
    };
  }, []);

  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        duckBackgroundMusic(true);

        await audio.play();

        setIsPlaying(true);
      } catch (error) {
        console.error("Không thể phát voice message:", error);

        duckBackgroundMusic(false);
      }

      return;
    }

    audio.pause();

    setIsPlaying(false);

    duckBackgroundMusic(false);
  };

  /* =========================================================
     AUDIO EVENTS
  ========================================================= */

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;

    if (!audio) return;

    setCurrentTime(audio.currentTime);

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);

    setCurrentTime(0);

    duckBackgroundMusic(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  /* =========================================================
     SEEK
  ========================================================= */

  const handleSeek = (event) => {
    const audio = audioRef.current;

    if (!audio) return;

    const nextTime = Number(event.target.value);

    audio.currentTime = nextTime;

    setCurrentTime(nextTime);
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const stopVoice = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);

    duckBackgroundMusic(false);
  };

  const handleBack = () => {
    stopVoice();

    onBack?.();
  };

  const handleContinue = () => {
    stopVoice();

    onContinue?.();
  };

  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section ref={screenRef} className="voice-message-screen">
      <FloatingDecor variant="letter" />

      {/* =====================================================
          BACK
      ===================================================== */}

      <button type="button" className="voice-back-button" onClick={handleBack}>
        ← Quay lại
      </button>

      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="voice-message-heading">
        <p className="eyebrow center">A LITTLE VOICE FOR YOU</p>

        <h1 className="voice-message-title">Một món quà nho nhỏ...</h1>

        <p className="voice-message-description">
          Anh muốn gửi em một bài nhạc đặc biệt
          <br />
          để chúc mừng ngày sinh nhật của em ♡
        </p>
      </div>

      {/* =====================================================
          CASSETTE CARD
      ===================================================== */}

      <div ref={cardRef} className="voice-cassette-card">
        {/* TAPE LABEL */}

        <div className="voice-tape-label">
          <span>FOR MIMI</span>

          <small>one little song ♡</small>
        </div>

        {/* CASSETTE */}

        <div className={`voice-cassette ${isPlaying ? "voice-playing" : ""}`}>
          <div className="cassette-top-line">
            <span>OUR MEMORY</span>

            <span>SIDE A</span>
          </div>

          {/* WINDOW */}

          <div className="cassette-window">
            {/* LEFT REEL */}

            <div className="cassette-reel">
              <div className="reel-inner">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            {/* TAPE MIDDLE */}

            <div className="cassette-middle">
              <span className="cassette-heart">♡</span>

              <small>play me</small>
            </div>

            {/* RIGHT REEL */}

            <div className="cassette-reel">
              <div className="reel-inner">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          {/* CASSETTE BOTTOM */}

          <div className="cassette-bottom">
            <span />

            <div className="cassette-bottom-window">
              <i />

              <i />
            </div>

            <span />
          </div>
        </div>

        {/* =================================================
            PLAYER
        ================================================= */}

        <div className="voice-player">
          <button
            type="button"
            className={`voice-play-button ${isPlaying ? "playing" : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Tạm dừng lời nhắn" : "Phát lời nhắn"}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          <div className="voice-player-content">
            <div className="voice-player-title">
              <div>
                <strong>Bài nhạc dành cho em</strong>

                <small>from Tun ♡</small>
              </div>

              <span className={`voice-live-dot ${isPlaying ? "active" : ""}`}>
                ●
              </span>
            </div>

            {/* PROGRESS */}

            <div className="voice-progress-area">
              <input
                type="range"
                className="voice-progress"
                min="0"
                max={duration || 0}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
                aria-label="Tiến độ lời nhắn"
                style={{
                  "--voice-progress": `${progress}%`,
                }}
              />
            </div>

            {/* TIME */}

            <div className="voice-time-row">
              <span>{formatTime(currentTime)}</span>

              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* =================================================
            AUDIO
        ================================================= */}

        <audio
          ref={audioRef}
          src="/music/voice-message.mp3"
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPause={handlePause}
          onPlay={handlePlay}
        />

        {/* =================================================
            NOTE
        ================================================= */}

        <p className="voice-small-note">Nhấn play rồi nghe đến cuối nhé ♡</p>
      </div>

      {/* =====================================================
          CONTINUE
      ===================================================== */}

      <button
        type="button"
        className="voice-continue-button"
        onClick={handleContinue}
      >
        Một điều cuối cùng
        <span> →</span>
      </button>
    </section>
  );
}
