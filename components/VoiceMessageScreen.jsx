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
          scale: 0.95,
          rotate: -1.5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
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
          delay: 0.2,
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
        console.error("Không thể phát piano message:", error);
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

  const stopAudio = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);
    duckBackgroundMusic(false);
  };

  const handleBack = () => {
    stopAudio();
    onBack?.();
  };

  const handleContinue = () => {
    stopAudio();
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
        <p className="eyebrow center">A LITTLE PIANO FOR YOU</p>

        <h1 className="voice-message-title">
          Một bản nhạc anh chơi dành riêng cho em...
        </h1>

        <p className="voice-message-description">
          Không chỉ là một món quà,
          <br />
          mà là một lời chúc sinh nhật anh muốn gửi đến em bằng những nốt nhạc ♡
        </p>
      </div>

      {/* =====================================================
          MUSIC SHEET CARD
      ===================================================== */}

      <div ref={cardRef} className="music-sheet-card">
        {/* HEADER */}

        <div className="music-sheet-top">
          <span className="sheet-tag">FOR MIMI</span>
          <span className="sheet-tag-hand">played by Tun ♡</span>
        </div>

        {/* SHEET PAPER */}

        <div className="sheet-paper">
          <div className="sheet-staff">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="sheet-title-wrap">
            <h2 className="sheet-title">Romantic Happy Birthday</h2>
            <p className="sheet-subtitle">
              A little piano message for your special day
            </p>
          </div>

          <div className="sheet-notes-row">
            <span>♪</span>
            <span>♩</span>
            <span>♫</span>
            <span>♪</span>
            <span>♬</span>
          </div>

          {/* WAVEFORM */}

          <div className={`piano-waveform ${isPlaying ? "playing" : ""}`}>
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={index}
                className="wave-bar"
                style={{
                  animationDelay: `${index * 0.06}s`,
                }}
              />
            ))}
          </div>

          {/* PLAYER ROW */}

          <div className="sheet-player-row">
            <button
              type="button"
              className={`sheet-play-button ${isPlaying ? "playing" : ""}`}
              onClick={togglePlay}
              aria-label={isPlaying ? "Tạm dừng bản nhạc" : "Phát bản nhạc"}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>

            <div className="sheet-player-info">
              <div className="sheet-player-title">
                <div>
                  <strong>Romantic Happy Birthday</strong>
                  <small>piano version by Tun ♡</small>
                </div>

                <span className={`voice-live-dot ${isPlaying ? "active" : ""}`}>
                  ●
                </span>
              </div>

              <div className="voice-progress-area">
                <input
                  type="range"
                  className="voice-progress"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Tiến độ bản nhạc piano"
                  style={{
                    "--voice-progress": `${progress}%`,
                  }}
                />
              </div>

              <div className="voice-time-row">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* PIANO KEYS */}

          <div className="mini-piano">
            <div className="piano-white-keys">
              {Array.from({ length: 10 }).map((_, index) => (
                <span key={`white-${index}`} className="white-key" />
              ))}
            </div>

            <div className="piano-black-keys">
              <span className="black-key key-1" />
              <span className="black-key key-2" />
              <span className="black-key key-4" />
              <span className="black-key key-5" />
              <span className="black-key key-6" />
              <span className="black-key key-8" />
              <span className="black-key key-9" />
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="/music/romantic-happy-birthday.mp3"
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPause={handlePause}
          onPlay={handlePlay}
        />

        <p className="voice-small-note">
          Bản này anh tự chơi để chúc mừng sinh nhật em ♡
        </p>
      </div>

      {/* =====================================================
          CONTINUE
      ===================================================== */}

      <button
        type="button"
        className="voice-continue-button"
        onClick={handleContinue}
      >
        Tiếp theo
        <span> →</span>
      </button>
    </section>
  );
}
