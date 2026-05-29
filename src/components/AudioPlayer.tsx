"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Audio player with progress bar. Works in two modes:
 *  - HTML5 `<audio>` if `src` is provided
 *  - Web Speech API (TTS) fallback using `text`; progress is estimated from text length
 *
 * Clicking the progress bar seeks (HTML5 mode) or restarts (TTS mode).
 */
export function AudioPlayer({ src, text, lang = "ja-JP", rate = 0.95 }: {
  src?: string | null;
  text?: string;
  lang?: string;
  rate?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [current, setCurrent] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds

  // ===== HTML5 audio mode =====
  useEffect(() => {
    if (!src) return;
    const a = new Audio(src);
    audioRef.current = a;
    const onMeta = () => setDuration(a.duration || 0);
    const onTime = () => {
      setCurrent(a.currentTime);
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    };
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrent(0); };
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.pause();
      audioRef.current = null;
    };
  }, [src]);

  // ===== TTS mode =====
  const ttsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ttsStartRef = useRef<number>(0);
  const ttsDurationRef = useRef<number>(0);

  function estimateTtsDuration(t: string, rateFactor: number): number {
    // Japanese is ~6-8 mora/sec at normal rate. Estimate by char count adjusted for rate.
    const charsPerSecond = 6 * rateFactor;
    return Math.max(1, t.length / charsPerSecond);
  }

  function startTts() {
    if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    const dur = estimateTtsDuration(text, rate);
    ttsDurationRef.current = dur;
    setDuration(dur);
    u.onstart = () => {
      setPlaying(true);
      ttsStartRef.current = Date.now();
      if (ttsTimerRef.current) clearInterval(ttsTimerRef.current);
      ttsTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - ttsStartRef.current) / 1000;
        setCurrent(Math.min(elapsed, ttsDurationRef.current));
        setProgress(Math.min(elapsed / ttsDurationRef.current, 1));
      }, 50);
    };
    u.onend = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
      if (ttsTimerRef.current) clearInterval(ttsTimerRef.current);
    };
    u.onerror = () => {
      setPlaying(false);
      if (ttsTimerRef.current) clearInterval(ttsTimerRef.current);
    };
    window.speechSynthesis.speak(u);
  }

  function stopTts() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimerRef.current) clearInterval(ttsTimerRef.current);
    setPlaying(false);
  }

  // ===== Controls =====
  function toggle() {
    if (src && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    } else if (text) {
      if (playing) stopTts();
      else startTts();
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!src || !audioRef.current) {
      // TTS can't seek — restart from start
      if (text && playing) {
        stopTts();
        startTts();
      }
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  }

  function restart() {
    if (src && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!playing) audioRef.current.play();
      setPlaying(true);
    } else if (text) {
      stopTts();
      startTts();
    }
  }

  useEffect(() => () => stopTts(), []);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-soft border border-primary-soft-2">
      <button
        onClick={toggle}
        className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-xs font-mono text-muted shrink-0 tabular-nums">{fmt(current)}</span>
        <div
          onClick={seek}
          className="relative flex-1 h-2 bg-primary-soft-2 rounded-full overflow-hidden cursor-pointer group"
        >
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-100"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
            )}
            style={{ left: `calc(${Math.min(100, progress * 100)}% - 6px)` }}
          />
        </div>
        <span className="text-xs font-mono text-muted shrink-0 tabular-nums">{fmt(duration)}</span>
      </div>
      <button
        onClick={restart}
        className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-foreground hover:bg-primary-soft-2 transition-colors"
        aria-label="Replay"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}

function fmt(s: number): string {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}
