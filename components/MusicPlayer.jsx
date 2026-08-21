"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function MusicPlayer({
  audioRef,
  isPlaying,
  setIsPlaying,
  visible = true,
}) {
  const discRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    let animationFrame = null;

    const animateVolume = (targetVolume, duration = 400) => {
      if (!audio) return;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      const startVolume = audio.volume;

      const startTime = performance.now();

      const updateVolume = (currentTime) => {
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const nextVolume =
          startVolume + (targetVolume - startVolume) * progress;

        audio.volume = Math.max(0, Math.min(1, nextVolume));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateVolume);
        }
      };

      animationFrame = requestAnimationFrame(updateVolume);
    };

    const handleVoiceDuck = (event) => {
      const active = event.detail?.active;

      /*
      Voice đang phát
      -> nhạc nền 3%

      Voice dừng
      -> nhạc nền 55%
    */

      animateVolume(active ? 0.03 : 0.55, 450);
    };

    window.addEventListener("voice-message-duck", handleVoiceDuck);

    return () => {
      window.removeEventListener("voice-message-duck", handleVoiceDuck);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

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
