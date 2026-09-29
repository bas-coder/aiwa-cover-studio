"use client";

import { useToolcraftEvaluatedValues } from "@/toolcraft/runtime/react";
import { directCreative, type CreativeIntensity } from "./creative-director";
import styles from "./product-scene.module.css";

const text = (values: Record<string, unknown>, target: string, fallback: string) =>
  typeof values[target] === "string" ? String(values[target]) : fallback;

export function ProductScene() {
  const values = useToolcraftEvaluatedValues();
  const direction = directCreative({
    category: text(values, "brief.category", "brand"),
    intensity: text(values, "brief.intensity", "balanced") as CreativeIntensity,
    seed: Number(values["variation.seed"] ?? 1),
  });
  const unlocked = values["composition.unlocked"] === true;
  const showGuides = values["composition.guides"] !== false;
  const showCrop = values["composition.cropPreview"] === true;
  const visualStyle = text(values, "composition.visualStyle", "focus-card");
  const accentClass = direction.accent === "#ffb64d" ? styles.accentGold : direction.accent === "#f47a28" ? styles.accentDeep : direction.accent === "#ffd08a" ? styles.accentSoft : styles.accentOrange;
  const scaleClass = direction.titleScale < 0.9 ? styles.scaleSafe : direction.titleScale > 1.1 ? styles.scaleBold : "";
  return (
    <article
      className={`${styles.stage} ${accentClass} ${scaleClass} ${unlocked ? styles.unlocked : ""}`}
    >
      <div className={styles.orb} />
      <div className={`${styles.visual} ${visualStyle === "workflow" ? styles.workflow : visualStyle === "product-object" ? styles.productObject : styles.focusCard}`} aria-hidden="true">
        <div className={styles.visualGlow} />
        <div className={styles.visualPanel}>
          <span className={styles.visualIcon}>A</span>
          <span className={styles.visualLine} />
          <span className={styles.visualLineShort} />
          <span className={styles.visualAction}>→</span>
        </div>
        <i className={styles.nodeOne}>01</i>
        <i className={styles.nodeTwo}>02</i>
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <img className={styles.logo} src="/brand/wordmark.svg" alt="AIWA" />
          <span className={styles.profile}>{text(values, "brief.platform", "Open Graph")}</span>
        </header>
        <main className={styles.body}>
          <p className={styles.eyebrow}>{text(values, "copy.eyebrow", "AIWA intelligence")}</p>
          <h1 className={styles.title}>{text(values, "copy.title", "A better way to build what matters")}</h1>
          <p className={styles.subtitle}>{text(values, "copy.subtitle", "Turn focused ideas into high-quality experiences with an AI-assisted creative system built for your brand.")}</p>
        </main>
        <footer className={styles.footer}>
          <span className={styles.cta}>{text(values, "copy.cta", "Explore the story")}</span>
          <span className={styles.meta}>AIWA / {text(values, "brief.category", "Brand")}</span>
        </footer>
      </div>
      {showGuides ? <div className={styles.guides} /> : null}
      {showCrop ? <div className={styles.crop} /> : null}
    </article>
  );
}
