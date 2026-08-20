"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MusicPlayer({
  audioRef,
  isPlaying,
  setIsPlaying,
  visible = true,
}) {
  const discRef = useRef(null);

  useEffect(() => {
    if (!discRef.current) return;

    if (isPlaying) {
      gsap.to(discRef.current, {
        rotate: "+=360",
        duration: 5,
        ease: "none",
        repeat: -1,
      });
    } else {
      gsap.killTweensOf(discRef.current);
    }

    return () => {
      if (discRef.current) {
        gsap.killTweensOf(discRef.current);
      }
    };
  }, [isPlaying]);

  const toggleMusic = async () => {
    const audio = audioRef?.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Không thể phát nhạc:", error);
      setIsPlaying(false);
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className={`music-player ${isPlaying ? "playing" : ""}`}
      onClick={toggleMusic}
      aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
      title={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
    >
      <span ref={discRef} className="vinyl-disc">
        <span className="vinyl-ring vinyl-ring-one" />
        <span className="vinyl-ring vinyl-ring-two" />

        <span className="vinyl-label">
          <span className="vinyl-heart">♥</span>
        </span>
      </span>

      <span className="music-status">{isPlaying ? "Ⅱ" : "▶"}</span>

      <span className="music-waves" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
