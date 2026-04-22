import { useEffect, useRef, useState } from "react";

/* ── Scroll-reveal: fires once when element enters viewport ── */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Counter: counts up from 0 to target quickly ── */
export function useCounter(target, active, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (isNaN(numTarget)) return;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.round((numTarget * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    return () => clearInterval(timer);
  }, [target, active, duration]);
  return count;
}

/* ── Typewriter: types text character by character ── */
export function useTypewriter(text, active, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, active, speed]);
  return displayed;
}
