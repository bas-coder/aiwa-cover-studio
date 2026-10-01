"use client";

import { getToolcraftTimelineLoopProgress } from "@/toolcraft/runtime";
import {
  useToolcraftEvaluatedValues,
  useToolcraftSelector,
  useToolcraftViewportInteractionActive,
} from "@/toolcraft/runtime/react";

import { readPosterFrame } from "./poster-paint";
import styles from "./product-scene.module.css";

const restingProgress = 0;

export function ProductScene() {
  const values = useToolcraftEvaluatedValues();
  const progress = useToolcraftSelector((state) =>
    getToolcraftTimelineLoopProgress({
      currentTimeSeconds: state.timeline.currentTimeSeconds,
      durationSeconds: state.timeline.durationSeconds,
    }),
  );
  const interacting = useToolcraftViewportInteractionActive();
  const poster = readPosterFrame(values, interacting ? restingProgress : progress);
  const { boxes, motion } = poster;
  const claimShift = `${motion.claimOffsetY * 100}cqh`;
  const markShift = `${motion.markOffsetX * 100}cqw`;

  return (
    <article
      className={`${styles.stage} ${poster.theme === "paper" ? styles.paper : ""} ${poster.arrangement === "poster" ? styles.poster : ""}`}
      data-poster-layout={poster.arrangement}
      data-poster-theme={poster.theme}
      data-toolcraft-product-output=""
    >
      <div className={styles.mesh} style={{ transform: `translateX(${motion.wave * 1.5}%)` }} />
      {poster.arrangement === "split" ? <div className={styles.panel} /> : null}
      <div
        className={styles.pattern}
        style={{
          backgroundPositionX: `${motion.patternOffset}px`,
          height: `${boxes.mark.h * 100}%`,
          left: `${(boxes.mark.x + motion.markOffsetX) * 100}%`,
          top: `${boxes.mark.y * 100}%`,
          width: `${boxes.mark.w * 100}%`,
        }}
      />
      <div
        className={styles.mark}
        style={{
          height: `${boxes.mark.h * 100}%`,
          left: `${(boxes.mark.x + motion.markOffsetX) * 100}%`,
          top: `${boxes.mark.y * 100}%`,
          transform: `scale(${motion.markScale})`,
          width: `${boxes.mark.w * 100}%`,
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 200 200">
          <circle cx="100" cy="100" fill="none" r="78" stroke="currentColor" strokeWidth="2" />
          <path
            d="M46 132 A70 70 0 0 1 164 74"
            fill="none"
            stroke="#e86a1f"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <circle cx="156" cy="64" fill="#e86a1f" r="9" />
        </svg>
      </div>
      <img
        alt="AIWA"
        className={`${styles.logo} ${poster.theme === "ink" ? styles.inkLogo : ""}`}
        src="/brand/wordmark.svg"
        style={{
          left: `${boxes.logo.x * 100}%`,
          top: `${boxes.logo.y * 100}%`,
          width: `${boxes.logo.w * 100}%`,
        }}
      />
      <p
        className={styles.eyebrow}
        style={{
          left: `${boxes.eyebrow.x * 100}%`,
          top: `${boxes.eyebrow.y * 100}%`,
          width: `${boxes.eyebrow.w * 100}%`,
        }}
      >
        {poster.eyebrow}
      </p>
      <h1
        className={styles.claim}
        data-poster-claim=""
        data-toolcraft-product-text=""
        style={{
          fontSize: `${poster.claimScale * 100}cqi`,
          left: `${boxes.claim.x * 100}%`,
          top: `${boxes.claim.y * 100}%`,
          transform: `translateY(${claimShift})`,
          width: `${boxes.claim.w * 100}%`,
        }}
      >
        {poster.claim}
      </h1>
      {poster.proof ? (
        <p
          className={styles.proof}
          style={{
            left: `${boxes.proof.x * 100}%`,
            top: `${boxes.proof.y * 100}%`,
            width: `${boxes.proof.w * 100}%`,
          }}
        >
          {poster.proof}
        </p>
      ) : null}
      <p
        className={styles.ask}
        style={{
          left: `${boxes.ask.x * 100}%`,
          opacity: motion.askOpacity,
          top: `${boxes.ask.y * 100}%`,
          transform: `translateX(${markShift})`,
          width: `${boxes.ask.w * 100}%`,
        }}
      >
        {poster.ask}
      </p>
    </article>
  );
}
