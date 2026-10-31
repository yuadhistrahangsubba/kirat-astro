"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import styles from "../kirat-calendar.module.css";

interface DropdownOption {
  value: number;
  label: string;
}

interface DropdownProps {
  value: number;
  options: readonly DropdownOption[];
  onChange: (value: number) => void;
  ariaLabel: string;
}

/**
 * A fully custom-styled dropdown, replacing a plain native `<select>`.
 * Built for the year picker specifically — a 51-entry native `<select>`
 * pops open as a huge, unstyled OS list with no way to jump to the
 * current year quickly — but used for month too so the two controls
 * look and behave identically side by side.
 */
export function Dropdown({ value, options, onChange, ariaLabel }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Center the current value in the list immediately — most useful for
    // the year list, where the selection can be decades away from the top
    // of a freshly-opened, otherwise-empty-looking list. Set `scrollTop`
    // directly rather than calling `scrollIntoView`, which walks up and
    // scrolls every scrollable ancestor it finds — including the page
    // itself — causing a jarring jump on the whole viewport just from
    // opening the dropdown.
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[data-selected="true"]');
    if (list && selected) {
      list.scrollTop = selected.offsetTop - list.clientHeight / 2 + selected.clientHeight / 2;
      // Move keyboard focus onto the current value (listbox pattern).
      selected.focus({ preventScroll: true });
    }
  }, [open]);

  // ↑/↓ move between options, Home/End jump to the ends, Tab closes the
  // list. Options use a roving tabindex so the list is a single Tab stop
  // instead of one per year.
  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    if (event.key === "ArrowDown") next = current + 1;
    else if (event.key === "ArrowUp") next = current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    items[Math.max(0, Math.min(items.length - 1, next))]?.focus();
  }

  return (
    <div ref={wrapperRef} className={styles.selectWrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.select}
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.label ?? value}
      </button>
      <motion.span
        className={styles.selectIcon}
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.18 }}
      >
        <ChevronDown size={16} aria-hidden="true" />
      </motion.span>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={styles.dropdownList}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  className={styles.dropdownOption}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {option.label}
                  {isSelected && <span aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
