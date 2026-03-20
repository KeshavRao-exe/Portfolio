"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Github,
  Instagram,
  Linkedin,
  Mail,
  X,
} from "lucide-react";
import resumeData from "../../data/resume.json";

const sectionLabelStyle = "text-[11px] uppercase tracking-[0.2em] text-zinc-500";

function getBadgeText(label: string) {
  if (label.includes("Southern California")) return "USC";
  if (label.includes("SRM")) return "SRM";
  if (label.includes("Asia University")) return "AU";
  if (label.includes("Dataflix")) return "DF";
  if (label.includes("École")) return "ETS";
  if (label.includes("My Equation")) return "ME";
  const words = label.split(" ").filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function getBadgeTone(label: string) {
  if (label.includes("Southern California")) return "bg-[#990000] text-white";
  if (label.includes("SRM")) return "bg-[#f8b133] text-zinc-900";
  if (label.includes("Asia University")) return "bg-[#0d9488] text-white";
  if (label.includes("Dataflix")) return "bg-[#0f766e] text-white";
  if (label.includes("École")) return "bg-[#1d4ed8] text-white";
  if (label.includes("My Equation")) return "bg-[#7c3aed] text-white";
  return "bg-zinc-900 text-white";
}

function getUniversityBadgeSrc(label: string) {
  if (label.includes("Southern California")) return "/assets/images/USC.png";
  if (label.includes("SRM")) return "/assets/images/SRM.png";
  if (label.includes("Asia University")) return "/assets/images/AU.png";
  return null;
}

function parseRgbChannels(color: string): [number, number, number] | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isDarkSurface(target: HTMLElement | null): boolean {
  let node: HTMLElement | null = target;
  while (node) {
    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
      const rgb = parseRgbChannels(bg);
      if (!rgb) return false;
      const [r, g, b] = rgb;
      // Relative luminance approximation: lower means darker background.
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance < 0.42;
    }
    node = node.parentElement;
  }
  return false;
}

export default function Portfolio() {
  const [isBooting, setIsBooting] = useState(true);
  const [photoError, setPhotoError] = useState(false);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState<number | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorInViewport, setCursorInViewport] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [hoveringDarkSurface, setHoveringDarkSurface] = useState(false);
  const [focusTab, setFocusTab] = useState<"aiml" | "fullstack">("aiml");
  const [activeNavSection, setActiveNavSection] = useState<"projects" | "about">("projects");
  const reduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 500, damping: 36, mass: 0.12 });
  const smoothY = useSpring(cursorY, { stiffness: 500, damping: 36, mass: 0.12 });
  const heroRef = useRef<HTMLElement>(null);
  const experienceTimelineRef = useRef<HTMLDivElement>(null);
  const emailCopyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: experienceTimelineProgress } = useScroll({
    target: experienceTimelineRef,
    offset: ["start 0.75", "end 0.25"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const timelineFillScale = useSpring(experienceTimelineProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });

  const firstName = "Keshav";
  const lastName = "Rao";
  const profileImageSrc = "/assets/images/Photo.jpg";
  const aiMlFocusAreas = [
    "Distributed Systems",
    "AI Agents",
    "RAG Platforms",
    "LLM Applications",
    "Model Optimization",
    "MLOps",
    "Prompt Engineering",
  ];
  const fullStackFocusAreas = [
    "React",
    "TypeScript",
    "Node.js",
    "REST APIs",
    "Microservices",
    "Cloud Architecture",
    "API Orchestration",
    "Docker",
  ];
  const focusAreas = [...aiMlFocusAreas, ...fullStackFocusAreas];
  const selectedFocusAreas = focusTab === "aiml" ? aiMlFocusAreas : fullStackFocusAreas;
  const activeExperience =
    activeExperienceIndex !== null ? resumeData.experience[activeExperienceIndex] : null;
  const publication = resumeData.extra.find((item) => item.type === "Publication")?.content;
  const linkedInUrl =
    resumeData.basics.links.find((link) => link.platform.toLowerCase() === "linkedin")?.url ??
    "https://linkedin.com/in/keshav-rao-127ks/";
  const githubUrl =
    resumeData.basics.links.find((link) => link.platform.toLowerCase() === "github")?.url ??
    "https://github.com/KeshavRao-exe/KeshavRao-exe.github.io";
  const instagramUrl =
    resumeData.basics.links.find((link) => link.platform.toLowerCase() === "instagram")?.url ??
    "https://www.instagram.com/kesh.av_rao/";

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.setItem("theme", "light");
  }, []);

  useEffect(() => {
    const projects = document.getElementById("projects");
    const about = document.getElementById("about");
    if (!projects || !about) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = [...entries].sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio,
        )[0];
        if (!mostVisible) return;
        if (mostVisible.target.id === "projects") setActiveNavSection("projects");
        if (mostVisible.target.id === "about") setActiveNavSection("about");
      },
      { threshold: [0.25, 0.45, 0.65] },
    );
    observer.observe(projects);
    observer.observe(about);
    return () => observer.disconnect();
  }, []);

  const handleSectionScroll = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.basics.email);
      setEmailCopied(true);
      if (emailCopyResetRef.current) {
        clearTimeout(emailCopyResetRef.current);
      }
      emailCopyResetRef.current = setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      // Keep UX silent on clipboard failures; user can still read the email text.
      setEmailCopied(false);
    }
  };

  const handleEmailLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const mailtoUrl = `mailto:${resumeData.basics.email}`;
    // Trigger email compose reliably across browsers/webviews.
    window.location.href = mailtoUrl;
  };

  useEffect(() => {
    if (activeExperienceIndex === null) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveExperienceIndex(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activeExperienceIndex]);

  useEffect(() => {
    return () => {
      if (emailCopyResetRef.current) {
        clearTimeout(emailCopyResetRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const updatePointerMode = () => setShowCursor(finePointer.matches);
    updatePointerMode();
    finePointer.addEventListener("change", updatePointerMode);

    const handleMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setCursorInViewport(true);
      const target = event.target as HTMLElement | null;
      const interactiveTarget = target?.closest(
        'a, button, [role="button"], [data-clickable="true"]',
      );
      setHoveringInteractive(Boolean(interactiveTarget));
      const inMarkedDarkSection = Boolean(target?.closest('[data-dark-surface="true"]'));
      setHoveringDarkSurface(inMarkedDarkSection || isDarkSurface(target));
    };

    const handleLeaveViewport = () => {
      setCursorInViewport(false);
      setHoveringInteractive(false);
      setHoveringDarkSurface(false);
    };

    const handleEnterViewport = () => {
      setCursorInViewport(true);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeaveViewport);
    window.addEventListener("mouseenter", handleEnterViewport);
    window.addEventListener("blur", handleLeaveViewport);

    return () => {
      finePointer.removeEventListener("change", updatePointerMode);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeaveViewport);
      window.removeEventListener("mouseenter", handleEnterViewport);
      window.removeEventListener("blur", handleLeaveViewport);
    };
  }, [cursorX, cursorY]);

    return (
    <main className="h-screen overflow-y-auto scroll-smooth bg-[#ececec] text-zinc-900 transition-colors duration-500">
      {showCursor && cursorInViewport && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[199] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ x: smoothX, y: smoothY, backgroundColor: "rgba(132,255,55,0.18)" }}
            animate={{
              opacity: hoveringInteractive ? 1 : 0,
              scale: hoveringInteractive ? 1 : 0.6,
              boxShadow: hoveringInteractive
                ? "0 0 0 8px rgba(132,255,55,0.14), 0 0 26px rgba(132,255,55,0.45)"
                : "0 0 0 0 rgba(132,255,55,0), 0 0 0 rgba(132,255,55,0)",
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[200] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2"
            style={{
              x: smoothX,
              y: smoothY,
              backgroundColor: hoveringDarkSurface ? "#ffffff" : hoveringInteractive ? "#84ff37" : "#111111",
            }}
            animate={{
              scale: hoveringInteractive ? 1.25 : 1,
              clipPath: hoveringInteractive
                ? "polygon(50% 6%, 8% 94%, 92% 94%)"
                : "circle(50% at 50% 50%)",
            }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#ececec]"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3.3, ease: "linear" }}
                  className="absolute h-24 w-24 border border-zinc-700 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 5.2, ease: "linear" }}
                  className="absolute h-32 w-32"
                >
                  <motion.span
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-zinc-600"
                  />
                  <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-800" />
          </motion.div>
                <motion.div
                  animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="h-2.5 w-2.5 rounded-full bg-zinc-800"
                />
              </div>
            <motion.div
                animate={{ scaleX: [0.25, 1, 0.25], opacity: [0.2, 0.75, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
                className="mt-2 h-px w-24 bg-zinc-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_100%_0%,rgba(255,255,255,0.75),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-85 [background:repeating-radial-gradient(ellipse_at_112%_-8%,rgba(255,255,255,0.9)_0px,rgba(255,255,255,0.9)_3px,transparent_3px,transparent_66px)]" />

        <motion.header
          initial={reduceMotion ? undefined : { opacity: 0, y: -14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-3 z-30 px-4 py-4 md:px-8 lg:px-12"
        >
          <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white/55 px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl md:px-7">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-lime-400 text-lg font-black text-zinc-900">K</div>
            </div>

            <nav className="hidden items-center gap-4 text-[22px] font-medium tracking-[-0.03em] lg:flex">
              <a
                href="#projects"
                onClick={(event) => {
                  setActiveNavSection("projects");
                  handleSectionScroll(event, "projects");
                }}
                className="relative rounded-full px-5 py-2 transition-opacity hover:opacity-90"
              >
                {activeNavSection === "projects" && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-zinc-900 text-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.55 }}
                  />
                )}
                <span className={`relative z-10 ${activeNavSection === "projects" ? "text-white" : ""}`}>
                  Projects
                </span>
              </a>
              <a
                href="#about"
                onClick={(event) => {
                  setActiveNavSection("about");
                  handleSectionScroll(event, "about");
                }}
                className="relative rounded-full px-5 py-2 transition-opacity hover:opacity-90"
              >
                {activeNavSection === "about" && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-zinc-900 text-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.55 }}
                  />
                )}
                <span className={`relative z-10 ${activeNavSection === "about" ? "text-white" : ""}`}>
                  About & Contact
                </span>
              </a>
            </nav>

            <div className="hidden items-center gap-6 lg:flex">
              <p className="text-sm text-zinc-600">Email: {resumeData.basics.email}</p>
              <a
                href="#internet"
                onClick={(event) => handleSectionScroll(event, "internet")}
                className="smooth-hover-green rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Contact me
              </a>
            </div>
          </div>
        </motion.header>

        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto grid min-h-[calc(100svh-118px)] w-full max-w-[1320px] items-start gap-8 px-6 pb-10 pt-14 md:px-10 lg:grid-cols-12 lg:gap-12 lg:px-14 lg:pt-24"
        >
          <motion.aside
            initial={reduceMotion ? undefined : { opacity: 0, x: -26 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-2 lg:order-1 lg:col-span-3 lg:pt-36"
          >
            <div>
              <div className="mb-5 flex items-center gap-5">
                <div className="flex items-center gap-1">
                  <span className="h-16 w-6 rounded-l-full bg-zinc-900" />
                  <span className="h-16 w-6 rounded-l-full bg-zinc-900/85" />
                  <span className="h-16 w-6 rounded-l-full bg-zinc-900/70" />
                </div>
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-300/70 bg-zinc-900">
                  {!photoError ? (
                    <Image
                      src={profileImageSrc}
                      alt="Keshav Rao portrait"
                      fill
                      className="scale-[1.34] object-cover object-[center_32%]"
                      sizes="96px"
                      priority
                      onLoad={() => setPhotoError(false)}
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl font-bold text-white">
                      KR
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[30px] font-semibold leading-none tracking-[-0.03em]">{firstName} {lastName}</p>
              <p className="mt-1 text-base text-zinc-500">AI/ML engineer, developer</p>
              <div className="mt-4 flex items-center gap-3 text-zinc-500">
                <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-800"><Github size={19} /></a>
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-800"><Instagram size={19} /></a>
                <a href={linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-800"><Linkedin size={18} /></a>
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="order-1 lg:order-2 lg:col-span-9"
          >
            <p className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600">
              <span className="h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_20px_rgba(132,255,55,0.55)]" />
              Available for opportunities
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[930px] text-[clamp(2.6rem,5.2vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.05em] text-zinc-900"
            >
              <span className="block">
                Hi I&apos;m{" "}
                <span className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-1 text-[0.55em] align-[0.12em]">
                  {firstName} {lastName}
                </span>
              </span>
              <span className="block">
                a{" "}
                <span className="inline-flex items-center rounded-full bg-zinc-900 px-6 py-1 text-[0.55em] text-white align-[0.12em]">
                  AI Engineer
                </span>
                {" "}from{" "}
                <span className="inline-flex items-center rounded-full border border-zinc-300 bg-[#f1f1f1] px-6 py-1 text-[0.55em] align-[0.12em]">
                  Los Angeles
                </span>
              </span>
              <span className="mt-1 block">
                turning your ideas into pixel-perfect realities
              </span>
          </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.6 }}
              className="mt-8 max-w-3xl text-[clamp(1.05rem,1.7vw,1.55rem)] leading-[1.4] tracking-[-0.02em] text-zinc-600"
            >
              I build reliable software and AI systems that move from concept to deployment with clear business impact.
            </motion.p>

          <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                onClick={(event) => handleSectionScroll(event, "projects")}
                className="smooth-hover-green group inline-flex items-center gap-3 rounded-full bg-lime-400 px-8 py-4 text-[28px] font-medium tracking-[-0.03em] text-zinc-900 shadow-[0_12px_40px_rgba(132,255,55,0.4)]"
              >
                See what I can do
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/80 transform-gpu rotate-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45"><ArrowUpRight size={18} /></span>
              </a>
              <a
                href={`mailto:${resumeData.basics.email}`}
                className="smooth-hover-green inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm text-zinc-700"
              >
                <Mail size={16} />
                {resumeData.basics.email}
              </a>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>

      <motion.section
        id="focus"
        data-dark-surface="true"
        className="relative min-h-screen overflow-hidden border-t border-zinc-800 bg-[#07090d] px-6 py-16 text-white md:px-10 lg:px-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-10%] top-[20%] h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute left-[18%] top-[60%] h-[300px] w-[300px] rounded-full border border-white/8" />
        </div>

        <div className="relative mx-auto w-full max-w-[1320px]">
          <div className="mb-12 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
            <motion.div
              className="flex w-max items-center gap-10 px-6 py-5"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
            >
              {[...focusAreas, ...focusAreas].map((item, idx) => (
                <div key={`${item}-${idx}`} className="flex items-center gap-6 whitespace-nowrap text-[42px] font-semibold tracking-[-0.03em]">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="text-lime-400"
                  >
                    ✶
                  </motion.span>
                  <span className="text-zinc-100">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400">{`{01} - Areas I work in`}</p>
          <h2 className="max-w-4xl text-[clamp(2.4rem,5.2vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.04em]">
            Building reliable systems across AI, cloud, and distributed architecture.
          </h2>

          <div className="mt-7 inline-flex rounded-full border border-zinc-700 bg-zinc-900/55 p-1">
            <button 
              type="button"
              onClick={() => setFocusTab("aiml")}
              className="relative rounded-full px-5 py-2 text-sm font-medium"
            >
              {focusTab === "aiml" && (
                <motion.span
                  layoutId="focus-selector-pill"
                  className="absolute inset-0 rounded-full bg-lime-400 shadow-[0_0_24px_rgba(132,255,55,0.35)]"
                  transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.55 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  focusTab === "aiml" ? "text-zinc-900" : "text-zinc-300 hover:text-white"
                }`}
              >
                AI/ML
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFocusTab("fullstack")}
              className="relative rounded-full px-5 py-2 text-sm font-medium"
            >
              {focusTab === "fullstack" && (
                <motion.span
                  layoutId="focus-selector-pill"
                  className="absolute inset-0 rounded-full bg-lime-400 shadow-[0_0_24px_rgba(132,255,55,0.35)]"
                  transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.55 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  focusTab === "fullstack" ? "text-zinc-900" : "text-zinc-300 hover:text-white"
                }`}
              >
                Full Stack Development
              </span>
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {selectedFocusAreas.map((area, i) => (
              <motion.div 
                key={area}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
              >
                <p className="text-xl font-medium tracking-[-0.02em] text-zinc-100">{area}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="education"
        className="min-h-screen border-t border-zinc-300/80 bg-[#efefef] px-6 py-20 md:px-10 lg:flex lg:items-center lg:px-14"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="mx-auto grid w-full max-w-[1120px] gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-zinc-300 bg-white p-7">
            <p className={sectionLabelStyle}>{"{04} - Education"}</p>
            <div className="mt-6 space-y-6">
              {resumeData.education.map((edu) => (
                <div key={`${edu.institution}-${edu.degree}`} className="flex items-start gap-3">
                  {getUniversityBadgeSrc(edu.institution) ? (
                    <span className="relative mt-1 h-12 w-20 shrink-0 overflow-hidden border border-zinc-200 bg-white p-1">
                      <Image
                        src={getUniversityBadgeSrc(edu.institution) as string}
                        alt={`${edu.institution} badge`}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </span>
                  ) : (
                    <span className={`mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-bold ${getBadgeTone(edu.institution)}`}>
                      {getBadgeText(edu.institution)}
                    </span>
                  )}
                  <span>
                    <p className="text-xl font-semibold tracking-[-0.02em]">{edu.institution}</p>
                    <p className="mt-1 text-sm text-zinc-600">{edu.degree}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{edu.dates} | {edu.location}</p>
                    {edu.bullets.length > 0 && (
                      <p className="mt-2 text-sm text-zinc-500">{edu.bullets[0]}</p>
                    )}
                  </span>
                </div>
            ))}
            </div>
          </div>

          <a
            href="https://ieeexplore.ieee.org/document/9783592"
            target="_blank"
            rel="noreferrer"
            className="block rounded-[28px] border border-zinc-300 bg-white p-7 transition-colors hover:border-lime-400"
          >
            <p className={sectionLabelStyle}>{"{05} - Publication"}</p>
            <div className="mt-6">
              <p className="mb-3 flex items-center gap-2 text-xl font-semibold tracking-[-0.02em]">
                <BookOpen size={18} className="text-lime-400" />
                IEEE Publication
              </p>
              <p className="text-sm leading-relaxed text-zinc-600">
                {publication}
              </p>
            </div>
          </a>
        </div>
      </motion.section>

      <motion.section
        id="projects"
        data-dark-surface="true"
        className="relative min-h-screen border-t border-zinc-800 bg-[#07090d] px-6 py-20 text-white md:px-10 lg:px-14"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.18 }}
      >
              <motion.div 
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-20 h-24 bg-gradient-to-b from-zinc-200/10 to-transparent blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        />
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="sticky top-4 z-20 bg-[#07090d]/95 pb-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{"{02} - Featured projects"}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">I blend research and engineering</h2>
          </div>
          <div className="relative mt-12 pb-[24vh]">
            {resumeData.projects.map((project, i) => (
              <motion.article
                key={project.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className={`sticky flex h-[56vh] flex-col justify-between rounded-[28px] border border-lime-400/35 bg-zinc-900/92 p-8 shadow-[0_0_0_1px_rgba(132,255,55,0.14),0_0_36px_rgba(132,255,55,0.12)] backdrop-blur-sm transition-[box-shadow,border-color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-lime-400/55 hover:shadow-[0_0_0_1px_rgba(132,255,55,0.24),0_0_56px_rgba(132,255,55,0.2)] ${
                  i === 0 ? "mt-0" : "mt-[30vh]"
                }`}
                style={{
                  zIndex: 40 + i,
                  top: "250px",
                }}
              >
                <motion.div
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <motion.h3
                    initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="text-3xl font-semibold tracking-[-0.03em]"
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, delay: 0.12 }}
                    className="mt-3 text-base text-zinc-400"
                  >
                    {project.stack}
                  </motion.p>
                  <ul className="mt-7 space-y-3 text-zinc-300">
                    {project.bullets.map((point, bulletIndex) => (
                      <motion.li
                        key={point}
                        initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.4, delay: 0.16 + bulletIndex * 0.05 }}
                        className="text-lg leading-relaxed"
                      >
                        - {point}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <div className="inline-flex w-fit items-center rounded-full border border-zinc-700 px-4 py-2 text-xs uppercase tracking-[0.16em] text-zinc-400">
                  Project {i + 1} / {resumeData.projects.length}
                </div>
              </motion.article>
            ))}
          </div>
                </div>
      </motion.section>

      <motion.section
        id="experience"
        className="relative min-h-screen overflow-hidden border-t border-zinc-300/80 bg-[#ececec] px-6 py-20 md:px-10 lg:px-14"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.12 }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-20 h-24 bg-gradient-to-b from-zinc-300/25 to-transparent blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute right-0 top-0 h-80 w-80 border border-zinc-200/90" />
          <div className="absolute left-[18%] top-[45%] h-80 w-80 border border-zinc-200/90" />
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(24,24,24,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,24,0.04)_1px,transparent_1px)] [background-size:150px_150px]" />
            </div>

        <div className="relative z-10 mx-auto w-full max-w-[1320px]">
          <p className={sectionLabelStyle + ""}>{"{02} - Experience"}</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Systems, products, and research shipped in production
          </h2>

          <div ref={experienceTimelineRef} className="relative mt-12 pb-4">
            <span className="pointer-events-none absolute bottom-0 left-4 top-0 w-1 rounded-full bg-zinc-300 md:left-1/2 md:-translate-x-1/2" />
            <motion.span
              className="pointer-events-none absolute bottom-0 left-4 top-0 w-1 origin-top rounded-full bg-zinc-800 md:left-1/2 md:-translate-x-1/2"
              style={{ scaleY: timelineFillScale }}
            />

            {resumeData.experience.map((exp, i) => {
              const isRight = i % 2 === 1;
              return (
                <motion.button
                  type="button"
                  key={`${exp.company}-${exp.role}`}
                  onClick={() => setActiveExperienceIndex(i)}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 28, x: isRight ? 84 : -84, scale: 0.98 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, x: 0, scale: 1 }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -3,
                          boxShadow:
                            "0 0 0 1px rgba(132,255,55,0.35), 0 18px 40px rgba(132,255,55,0.22)",
                        }
                  }
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.58, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative mb-8 block w-full rounded-2xl border border-lime-300 bg-white p-6 text-left shadow-[0_8px_22px_rgba(15,23,42,0.08)] transform-gpu will-change-transform transition-[background-color,border-color,color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-lime-400 md:mb-10 md:w-[calc(50%-3.1rem)] ${
                    isRight ? "md:ml-auto" : ""
                  }`}
                >
                  {isRight ? (
                    <span className="pointer-events-none absolute left-[-12px] top-1/2 hidden h-6 w-6 -translate-y-1/2 rotate-45 border-l border-b border-lime-300 bg-white transition-colors duration-500 md:block group-hover:border-lime-400" />
                  ) : (
                    <span className="pointer-events-none absolute right-[-12px] top-1/2 hidden h-6 w-6 -translate-y-1/2 rotate-45 border-r border-t border-lime-300 bg-white transition-colors duration-500 md:block group-hover:border-lime-400" />
                  )}
                  {isRight ? (
                    <span className="pointer-events-none absolute left-[-52px] top-1/2 hidden h-px w-10 -translate-y-1/2 bg-lime-400 md:block" />
                  ) : (
                    <span className="pointer-events-none absolute right-[-52px] top-1/2 hidden h-px w-10 -translate-y-1/2 bg-lime-400 md:block" />
                  )}
                  {isRight ? (
                    <span className="pointer-events-none absolute left-[-62px] top-1/2 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-zinc-100 md:grid">
                      <motion.span
                        initial={reduceMotion ? undefined : { scale: 0.8, opacity: 0.7 }}
                        whileInView={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.9] }}
                        viewport={{ once: false, amount: 0.7 }}
                        transition={{ duration: 1.1, ease: "easeInOut", delay: i * 0.04 }}
                        className="h-3 w-3 rounded-full bg-lime-400"
                      />
                    </span>
                  ) : (
                    <span className="pointer-events-none absolute right-[-62px] top-1/2 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-zinc-100 md:grid">
                      <motion.span
                        initial={reduceMotion ? undefined : { scale: 0.8, opacity: 0.7 }}
                        whileInView={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.9] }}
                        viewport={{ once: false, amount: 0.7 }}
                        transition={{ duration: 1.1, ease: "easeInOut", delay: i * 0.04 }}
                        className="h-3 w-3 rounded-full bg-lime-400"
                      />
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${getBadgeTone(exp.company)}`}
                    >
                      {getBadgeText(exp.company)}
                    </span>
                    <span className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{exp.dates}</p>
                      <p className="text-xl font-semibold tracking-[-0.02em] text-zinc-900">{exp.role}</p>
                      <p className="text-sm text-zinc-600">{exp.company} | {exp.location}</p>
                    </span>
            </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="about"
        className="relative min-h-screen overflow-hidden border-t border-zinc-300/80 bg-[#ececec] px-6 py-20 md:px-10 lg:px-14"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.12 }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-20 h-24 bg-gradient-to-b from-zinc-300/25 to-transparent blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -left-8 top-20 h-80 w-80 border border-zinc-200/90" />
          <div className="absolute left-[20%] top-[44%] h-80 w-80 border border-zinc-200/90" />
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(24,24,24,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,24,0.04)_1px,transparent_1px)] [background-size:150px_150px]" />
          </div>

        <div className="relative z-10 mx-auto w-full max-w-[1320px]">
          <div className="mx-auto w-full max-w-[980px] rounded-[28px] border border-zinc-300 bg-white p-7">
            <p className={sectionLabelStyle + ""}>{"{03} - Skills"}</p>
            <div className="mt-6 space-y-4">
              {resumeData.skills.map((group, i) => (
                <motion.div
                  key={group.category}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-600">{group.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.slice(0, 8).map((skill) => (
                      <span key={skill} className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div id="internet" className="mt-8 w-full">
          <div className="p-8 md:p-12">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-3xl font-medium text-zinc-500">
                <span className="h-3 w-3 rounded-full bg-lime-400" />
                <span className={sectionLabelStyle}>{`{06} - Contact me`}</span>
              </p>
              <h3 className="max-w-5xl text-[58px] font-medium leading-[0.95] tracking-[-0.04em] text-zinc-900 md:text-[88px]">
                I&apos;m all over the internet
              </h3>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="smooth-hover-green group rounded-3xl border border-zinc-200 bg-white p-8"
                >
                  <p className="text-4xl font-medium tracking-[-0.02em]">GitHub</p>
                  <div className="mt-20 flex justify-end">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-lime-400 text-zinc-900 transform-gpu rotate-0 transition-transform duration-900 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[360deg]">
                      <Github size={22} />
                    </span>
                  </div>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="smooth-hover-green group rounded-3xl border border-zinc-200 bg-white p-8"
                >
                  <p className="text-4xl font-medium tracking-[-0.02em]">Instagram</p>
                  <div className="mt-20 flex justify-end">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-lime-400 text-zinc-900 transform-gpu rotate-0 transition-transform duration-900 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[360deg]">
                      <Instagram size={22} />
                    </span>
                  </div>
                </a>

                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="smooth-hover-green group rounded-3xl border border-zinc-200 bg-white p-8"
                >
                  <p className="text-4xl font-medium tracking-[-0.02em]">LinkedIn</p>
                  <div className="mt-20 flex justify-end">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-lime-400 text-zinc-900 transform-gpu rotate-0 transition-transform duration-900 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[360deg]">
                      <Linkedin size={22} />
                    </span>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="smooth-hover-green group rounded-3xl bg-lime-400 p-8 text-zinc-900"
                >
                  <p className="text-4xl font-medium tracking-[-0.02em]">
                    {emailCopied ? "Email copied" : "Get in touch"}
                  </p>
                  <p className="mt-4 text-lg">{resumeData.basics.email}</p>
                  <div className="mt-14 flex justify-end">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white/85 transform-gpu scale-100 rotate-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:rotate-45">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="final-contact"
        data-dark-surface="true"
        className="relative min-h-screen border-t border-zinc-800 bg-[#07090d] px-6 py-10 text-white md:px-10 lg:px-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        viewport={{ once: true, amount: 0.18 }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-20 h-24 bg-gradient-to-b from-white/10 to-transparent blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
        />
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-5">
            <p className="inline-flex items-center gap-2 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
              Available for opportunities
            </p>
            <button
              type="button"
              onClick={() => {
                const container = document.querySelector("main");
                if (container) {
                  container.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="smooth-hover-green-soft group inline-flex items-center gap-3 rounded-full border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 pl-5 text-zinc-300 backdrop-blur-sm hover:text-white"
            >
              Back to top
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-zinc-900 transform-gpu scale-100 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                <ArrowUpRight size={18} className="rotate-[-45deg]" />
              </span>
            </button>
          </div>

          <div className="relative grid gap-10 lg:grid-cols-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-0 top-0 h-80 w-80 rounded-full border border-white/8" />
              <div className="absolute left-[22%] top-[45%] h-96 w-96 rounded-full border border-white/8" />
              <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:185px_185px]" />
            </div>

            <div className="relative lg:col-span-6">
              <h3 className="max-w-xl text-[clamp(2.4rem,5.8vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.04em]">
                Let&apos;s build something extraordinary together
                <span className="text-lime-400">.</span>
              </h3>
              <p className="mt-8 text-3xl font-medium text-zinc-400">Let&apos;s make an impact</p>
            </div>

            <div className="relative lg:col-span-6">
              <div className="mb-9 flex items-start gap-4">
                <div className="flex items-center gap-1 pt-1">
                  <span className="h-14 w-5 rounded-l-full bg-lime-200/20" />
                  <span className="h-14 w-5 rounded-l-full bg-lime-200/15" />
                  <span className="h-14 w-5 rounded-l-full bg-lime-200/10" />
                </div>
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-900">
                  {!photoError ? (
                    <Image
                      src={profileImageSrc}
                      alt="Keshav Rao portrait"
                      fill
                      className="scale-[1.28] object-cover object-[center_32%]"
                      sizes="80px"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xl font-bold text-white">KR</div>
                  )}
                </div>
                <div>
                  <p className="text-4xl font-semibold tracking-[-0.03em]">{firstName} {lastName}</p>
                  <p className="text-xl text-zinc-400">Software Engineer | AI Systems</p>
                  <div className="mt-3 flex items-center gap-3 text-zinc-400">
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-lime-400"><Github size={20} /></a>
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-lime-400"><Instagram size={20} /></a>
                    <a href={linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-lime-400"><Linkedin size={20} /></a>
                  </div>
                </div>
              </div>

              <p className="text-xl text-zinc-400">Contact me</p>
              <a
                href={`mailto:${resumeData.basics.email}`}
                onClick={handleEmailLinkClick}
                className="mt-1 block text-[clamp(1.45rem,3vw,2.85rem)] font-semibold tracking-[-0.03em] hover:text-lime-400"
              >
                {resumeData.basics.email}
              </a>
              <p className="mt-5 max-w-xl text-2xl leading-relaxed text-zinc-300">
                Reach out if you&apos;re looking for a fast, reliable engineer who can take AI products from idea to production!
              </p>

            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {activeExperience && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-4 backdrop-blur-[2px] md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveExperienceIndex(null)}
          >
            <motion.div
              initial={{ y: 64, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 52, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 165, damping: 24, mass: 0.7 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl border border-zinc-300 bg-white p-7 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-bold ${getBadgeTone(activeExperience.company)}`}>
                      {getBadgeText(activeExperience.company)}
                    </span>
                    <span>
                      <p className="text-2xl font-semibold tracking-[-0.02em] text-zinc-900">
                        {activeExperience.role}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {activeExperience.company} | {activeExperience.location}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {activeExperience.dates}
                      </p>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveExperienceIndex(null)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-lime-400 hover:text-zinc-900"
                  aria-label="Close experience details"
                >
                  <X size={16} />
                </button>
      </div>
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
                }}
                className="space-y-3"
              >
                {activeExperience.bullets.map((bullet) => (
                  <motion.li
                    key={bullet}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.35 }}
                    className="text-sm leading-relaxed text-zinc-600"
                  >
                    - {bullet}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

