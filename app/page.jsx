"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import LockScreen from "../components/LockScreen";
import LetterScreen from "../components/LetterScreen";
import AlbumScreen from "../components/AlbumScreen";
import OpenWhenScreen from "../components/OpenWhenScreen";
import DaysCounterScreen from "../components/DaysCounterScreen";
import FinalScreen from "../components/FinalScreen";
import FloatingDecor from "../components/FloatingDecor";
import MusicPlayer from "../components/MusicPlayer";

export default function Home() {
  const [stage, setStage] = useState("lock");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stageRef = useRef(null);
  const audioRef = useRef(null);

  /*
   * Đồng bộ trạng thái Play/Pause với audio thật.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  /*
   * Animation xuất hiện mỗi khi stage thay đổi.
   */
  useEffect(() => {
    if (!stageRef.current) return;

    const element = stageRef.current;

    gsap.killTweensOf(element);

    gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 1.025,
        y: 18,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.72,
        ease: "power3.out",
        clearProps: "filter",
        onComplete: () => {
          setIsTransitioning(false);
        },
      },
    );
  }, [stage]);

  /*
   * Bắt đầu nhạc sau khi người dùng nhập đúng mật khẩu.
   */
  const startMusic = async () => {
    const audio = audioRef.current;

    if (!audio || !audio.paused) return;

    try {
      audio.volume = 0.55;
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.log("Trình duyệt chưa cho phép phát nhạc tự động.");
    }
  };

  /*
   * Hàm chuyển màn hình dùng chung cho toàn bộ website.
   *
   * 1. Khóa click.
   * 2. Fade + blur màn hình hiện tại.
   * 3. Đổi stage.
   * 4. useEffect(stage) chạy animation màn hình mới.
   */
  const transitionTo = (nextStage) => {
    if (isTransitioning || nextStage === stage) return;

    const element = stageRef.current;

    if (!element) {
      setStage(nextStage);
      return;
    }

    setIsTransitioning(true);

    gsap.killTweensOf(element);

    gsap.to(element, {
      opacity: 0,
      scale: 0.975,
      y: -14,
      filter: "blur(10px)",
      duration: 0.42,
      ease: "power2.inOut",

      onComplete: () => {
        setStage(nextStage);

        /*
         * Khi qua màn hình mới thì đưa scroll về đầu.
         * Quan trọng khi đi từ album dài sang counter/final.
         */
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      },
    });
  };

  const handleUnlocked = () => {
    startMusic();
    transitionTo("letter");
  };

  return (
    <main className="app-shell">
      {/* Audio nằm ngoài stage nên không reset khi chuyển màn hình */}
      <audio ref={audioRef} src="/music/background.mp3" preload="auto" loop />

      <MusicPlayer
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        visible={stage !== "lock"}
      />

      <div className="soft-orb orb-one" />
      <div className="soft-orb orb-two" />

      <FloatingDecor />

      {/* Lớp ánh sáng chạy qua khi chuyển cảnh */}
      <div
        className={`cinematic-transition-glow ${
          isTransitioning ? "active" : ""
        }`}
        aria-hidden="true"
      />

      {/* Chặn double click trong lúc animation */}
      {isTransitioning && (
        <div className="transition-click-blocker" aria-hidden="true" />
      )}

      <div
        ref={stageRef}
        key={stage}
        className={`screen-layer cinematic-stage stage-${stage}`}
      >
        {stage === "lock" && <LockScreen onUnlocked={handleUnlocked} />}

        {stage === "letter" && (
          <LetterScreen onOpenAlbum={() => transitionTo("album")} />
        )}

        {stage === "album" && (
          <AlbumScreen
            onBack={() => transitionTo("letter")}
            onFinish={() => transitionTo("openwhen")}
          />
        )}
        {stage === "openwhen" && (
          <OpenWhenScreen
            onBack={() => transitionTo("album")}
            onContinue={() => transitionTo("counter")}
          />
        )}
        {stage === "counter" && (
          <DaysCounterScreen
            onBack={() => transitionTo("openwhen")}
            onContinue={() => transitionTo("final")}
          />
        )}

        {stage === "final" && (
          <FinalScreen
            onBack={() => transitionTo("counter")}
            onRestart={() => transitionTo("lock")}
          />
        )}
      </div>
    </main>
  );
}
