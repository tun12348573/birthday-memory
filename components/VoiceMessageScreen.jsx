"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import FloatingDecor from "./FloatingDecor";

const WAVE_BAR_COUNT = 32;
const WHITE_KEY_COUNT = 12;

/*
  Vị trí phím đen.
  Số đại diện cho phím trắng nằm ngay trước phím đen.
*/
const BLACK_KEY_AFTER = [0, 1, 3, 4, 5, 7, 8, 10];

const FLOATING_NOTES = [
  {
    symbol: "♪",
    left: "8%",
    delay: "0s",
    duration: "4.6s",
  },
  {
    symbol: "♫",
    left: "18%",
    delay: "1.2s",
    duration: "5.2s",
  },
  {
    symbol: "♡",
    left: "31%",
    delay: "2.1s",
    duration: "4.8s",
  },
  {
    symbol: "♩",
    left: "58%",
    delay: "0.7s",
    duration: "5.4s",
  },
  {
    symbol: "♪",
    left: "73%",
    delay: "1.8s",
    duration: "4.7s",
  },
  {
    symbol: "♬",
    left: "89%",
    delay: "2.6s",
    duration: "5.1s",
  },
];

export default function VoiceMessageScreen({ onBack, onContinue }) {
  /* =========================================================
     REFS
  ========================================================= */

  const screenRef = useRef(null);
  const cardRef = useRef(null);
  const audioRef = useRef(null);

  /*
    Web Audio API
  */

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);

  const animationFrameRef = useRef(null);

  /*
    DOM waveform
  */

  const waveBarRefs = useRef([]);

  /*
    Piano white keys
  */

  const pianoKeyRefs = useRef([]);

  /* =========================================================
     STATE
  ========================================================= */

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  /*
    Nếu trình duyệt không hỗ trợ
    Web Audio API thì dùng CSS fallback.
  */

  const [visualizerFallback, setVisualizerFallback] = useState(false);

  /* =========================================================
     SCREEN ENTER
  ========================================================= */

  useEffect(() => {
    if (!screenRef.current) return;

    const ctx = gsap.context(() => {
      /*
        Card
      */

      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.94,
          rotation: -1.5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.95,
          ease: "back.out(1.35)",
        },
      );

      /*
        Heading
      */

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

      /*
        Piano
      */

      gsap.fromTo(
        ".mini-piano-pro",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay: 0.65,
          ease: "power2.out",
        },
      );
    }, screenRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /* =========================================================
     BACKGROUND MUSIC DUCK
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
     RESET VISUALIZER
  ========================================================= */

  const resetVisualizer = () => {
    waveBarRefs.current.forEach((bar, index) => {
      if (!bar) return;

      /*
          Wave tĩnh đẹp hơn
          tất cả cùng một chiều cao.
        */

      const pattern = [12, 19, 15, 27, 20, 34, 22, 16];

      bar.style.height = `${pattern[index % pattern.length]}px`;

      bar.style.opacity = "0.48";

      bar.style.transform = "scaleY(1)";
    });

    pianoKeyRefs.current.forEach((key) => {
      if (!key) return;

      key.classList.remove("audio-active");
    });
  };

  /* =========================================================
     STOP VISUALIZER
  ========================================================= */

  const stopVisualizer = (shouldReset = true) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }

    if (shouldReset) {
      resetVisualizer();
    }
  };

  /* =========================================================
     INIT WEB AUDIO
  ========================================================= */

  const initAudioVisualizer = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      /*
          Safari cũ / browser
          không có Web Audio
        */

      if (!AudioContextClass) {
        setVisualizerFallback(true);

        return false;
      }

      /*
          AudioContext chỉ tạo 1 lần
        */

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const context = audioContextRef.current;

      /*
          Analyser chỉ tạo 1 lần
        */

      if (!analyserRef.current) {
        const analyser = context.createAnalyser();

        analyser.fftSize = 128;

        analyser.smoothingTimeConstant = 0.82;

        analyser.minDecibels = -90;

        analyser.maxDecibels = -10;

        analyserRef.current = analyser;
      }

      /*
          MediaElementSource cũng chỉ
          được phép tạo một lần cho
          cùng audio element.
        */

      if (!audioSourceRef.current) {
        const source = context.createMediaElementSource(audio);

        audioSourceRef.current = source;

        source.connect(analyserRef.current);

        analyserRef.current.connect(context.destination);
      }

      /*
          iPhone / Safari yêu cầu
          resume sau interaction.
        */

      if (context.state === "suspended") {
        await context.resume();
      }

      setVisualizerFallback(false);

      return true;
    } catch (error) {
      console.warn("Audio visualizer fallback:", error);

      setVisualizerFallback(true);

      return false;
    }
  };

  /* =========================================================
     REAL AUDIO VISUALIZER
  ========================================================= */

  const startVisualizer = () => {
    stopVisualizer(false);

    const analyser = analyserRef.current;

    if (!analyser) {
      return;
    }

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      analyser.getByteFrequencyData(frequencyData);

      /* =====================================================
         REAL WAVEFORM
      ===================================================== */

      waveBarRefs.current.forEach((bar, index) => {
        if (!bar) return;

        const normalized = index / Math.max(WAVE_BAR_COUNT - 1, 1);

        /*
            Bỏ qua frequency index 0
            vì bass quá mạnh dễ làm
            waveform thành một cục.
          */

        const frequencyIndex = Math.min(
          frequencyData.length - 1,
          Math.max(1, Math.floor(normalized * (frequencyData.length - 2) + 1)),
        );

        const energy = frequencyData[frequencyIndex] / 255;

        /*
            Thanh giữa hơi cao hơn
            → waveform nhìn mềm mại.
          */

        const center = Math.abs(index - (WAVE_BAR_COUNT - 1) / 2);

        const centerBoost = 1 - center / (WAVE_BAR_COUNT / 2);

        const height = 8 + energy * 48 + Math.max(0, centerBoost) * 4;

        bar.style.height = `${Math.min(height, 60)}px`;

        bar.style.opacity = `${0.28 + energy * 0.72}`;

        bar.style.transform = `scaleY(${0.92 + energy * 0.12})`;
      });

      /* =====================================================
         PIANO KEYS REACT TO AUDIO
      ===================================================== */

      pianoKeyRefs.current.forEach((key, keyIndex) => {
        if (!key) return;

        /*
            Chia phổ âm thành nhiều vùng.
          */

        const usableLength = Math.floor(frequencyData.length * 0.75);

        const startIndex = Math.floor(
          (keyIndex / WHITE_KEY_COUNT) * usableLength,
        );

        const endIndex = Math.max(
          startIndex + 1,

          Math.floor(((keyIndex + 1) / WHITE_KEY_COUNT) * usableLength),
        );

        let total = 0;

        for (let i = startIndex; i < endIndex; i += 1) {
          total += frequencyData[i] || 0;
        }

        const average = total / Math.max(endIndex - startIndex, 1);

        const energy = average / 255;

        /*
            Chỉ sáng khi năng lượng
            đủ lớn để tránh tất cả phím
            nhấp nháy cùng lúc.
          */

        key.classList.toggle(
          "audio-active",

          energy > 0.34,
        );
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    /* =====================================================
       PLAY
    ===================================================== */

    if (audio.paused) {
      try {
        /*
          Nhạc nền giảm trước.
        */

        duckBackgroundMusic(true);

        /*
          Setup analyser trong chính
          interaction click.
        */

        await initAudioVisualizer();

        /*
          Nếu audio đã kết thúc,
          phát lại từ đầu.
        */

        if (audio.ended || audio.currentTime >= audio.duration) {
          audio.currentTime = 0;
        }

        await audio.play();

        setIsPlaying(true);

        startVisualizer();
      } catch (error) {
        console.error("Không thể phát piano:", error);

        duckBackgroundMusic(false);
      }

      return;
    }

    /* =====================================================
       PAUSE
    ===================================================== */

    audio.pause();

    setIsPlaying(false);

    stopVisualizer();

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

  const handlePlay = () => {
    setIsPlaying(true);

    startVisualizer();
  };

  const handlePause = () => {
    setIsPlaying(false);

    stopVisualizer();

    duckBackgroundMusic(false);
  };

  const handleEnded = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = 0;
    }

    setIsPlaying(false);

    setCurrentTime(0);

    stopVisualizer();

    duckBackgroundMusic(false);
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
     STOP AUDIO
  ========================================================= */

  const stopAudio = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);

    stopVisualizer();

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
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
      }

      stopVisualizer();

      duckBackgroundMusic(false);

      /*
        Giải phóng AudioContext
        khi rời màn.
      */

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <section
      ref={screenRef}
      className="voice-message-screen piano-message-screen"
    >
      <FloatingDecor variant="letter" />

      {/* =====================================================
          FLOATING MUSIC NOTES
      ===================================================== */}

      <div
        className={`piano-floating-notes ${isPlaying ? "is-playing" : ""}`}
        aria-hidden="true"
      >
        {FLOATING_NOTES.map((note, index) => (
          <span
            key={index}
            style={{
              "--note-left": note.left,

              "--note-delay": note.delay,

              "--note-duration": note.duration,
            }}
          >
            {note.symbol}
          </span>
        ))}
      </div>

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
          Một bản nhạc dành riêng cho em...
        </h1>

        <p className="voice-message-description">
          Có những lời chúc anh muốn gửi đến em
          <br />
          không bằng lời nói, mà bằng những phím đàn này ♡
        </p>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div
        ref={cardRef}
        className={`piano-gift-card ${isPlaying ? "is-playing" : ""}`}
      >
        {/* PAPER CLIP */}

        <div className="piano-paperclip" aria-hidden="true" />

        {/* TOP LABEL */}

        <div className="piano-gift-top">
          <span className="piano-for-label">FOR MIMI</span>

          <span className="piano-played-by">played by Tún ♡</span>
        </div>

        {/* =================================================
            SHEET MUSIC
        ================================================= */}

        <div className="piano-sheet">
          {/* TAPE */}

          <span className="piano-sheet-tape" aria-hidden="true" />

          {/* STAFF */}

          <div className="piano-score-area" aria-hidden="true">
            <span className="piano-clef">𝄞</span>

            <div className="piano-staff-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="piano-score-notes">
              <span>♪</span>
              <span>♩</span>
              <span>♫</span>
              <span>♪</span>
              <span>♬</span>
            </div>
          </div>

          {/* TITLE */}

          <div className="piano-sheet-title">
            <p>birthday piece no. 01</p>

            <h2>Romantic Happy Birthday</h2>

            <small>a little piano message for your special day</small>
          </div>

          {/* =================================================
              REAL AUDIO WAVEFORM
          ================================================= */}

          <div
            className={`
              piano-audio-waveform

              ${isPlaying ? "is-playing" : ""}

              ${visualizerFallback ? "fallback-wave" : ""}
            `}
            aria-hidden="true"
          >
            {Array.from({
              length: WAVE_BAR_COUNT,
            }).map((_, index) => (
              <span
                key={index}
                ref={(element) => {
                  waveBarRefs.current[index] = element;
                }}
                className="piano-wave-bar"
              />
            ))}
          </div>

          {/* =================================================
              PLAYER
          ================================================= */}

          <div className="piano-player-row">
            <button
              type="button"
              className={`piano-play-button ${isPlaying ? "playing" : ""}`}
              onClick={togglePlay}
              aria-label={isPlaying ? "Tạm dừng bản piano" : "Phát bản piano"}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>

            <div className="piano-player-content">
              <div className="piano-player-title">
                <div>
                  <strong>Romantic Happy Birthday</strong>

                  <small>piano version by Tún ♡</small>
                </div>

                <span className={`voice-live-dot ${isPlaying ? "active" : ""}`}>
                  ●
                </span>
              </div>

              {/* PROGRESS */}

              <div className="voice-progress-area">
                <input
                  type="range"
                  className="voice-progress piano-progress"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Tiến độ bản piano"
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
              MINI PIANO
          ================================================= */}

          <div
            className={`mini-piano-pro ${isPlaying ? "is-playing" : ""}`}
            aria-hidden="true"
          >
            {/* WHITE KEYS */}

            <div className="piano-white-keys-pro">
              {Array.from({
                length: WHITE_KEY_COUNT,
              }).map((_, index) => (
                <span
                  key={`white-${index}`}
                  ref={(element) => {
                    pianoKeyRefs.current[index] = element;
                  }}
                  className="piano-white-key-pro"
                />
              ))}
            </div>

            {/* BLACK KEYS */}

            <div className="piano-black-keys-pro">
              {BLACK_KEY_AFTER.map((keyIndex, index) => (
                <span
                  key={`black-${index}`}
                  className="piano-black-key-pro"
                  style={{
                    left: `calc(${
                      ((keyIndex + 1) / WHITE_KEY_COUNT) * 100
                    }% - 11px)`,
                  }}
                />
              ))}
            </div>

            {/* SMALL HEART */}

            <span className="piano-key-heart">♡</span>
          </div>

          {/* MESSAGE */}

          <p className="piano-sheet-note">
            Anh đã chơi bản này để dành riêng cho sinh nhật của em.
            <br />
            Nghe đến cuối nhé ♡
          </p>
        </div>

        {/* =================================================
            AUDIO
        ================================================= */}

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
      </div>

      {/* =====================================================
          CONTINUE
      ===================================================== */}

      <button
        type="button"
        className="voice-continue-button piano-continue-button"
        onClick={handleContinue}
      >
        Tiếp theo
        <span> →</span>
      </button>
    </section>
  );
}
