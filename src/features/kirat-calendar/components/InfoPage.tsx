"use client";

import { motion } from "motion/react";

import { PAGE_CONTENT } from "../data/page-content";
import styles from "../kirat-calendar.module.css";
import type { InfoPageKey } from "../types";

export function InfoPage({ pageKey, onBack }: { pageKey: InfoPageKey; onBack: () => void }) {
  const data = PAGE_CONTENT[pageKey];

  return (
    <div className={styles.pageContent}>
      <div className={styles.pageContentInner}>
        <h2>{data.title}</h2>
        <p>{data.body}</p>
        <motion.button whileTap={{ scale: 0.96 }} className={styles.backBtn} onClick={onBack}>
          ◀ Back to Calendar
        </motion.button>
      </div>
    </div>
  );
}
