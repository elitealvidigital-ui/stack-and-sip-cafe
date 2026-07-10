import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, Flame, Leaf, Sparkles, Wheat } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 120;
const stages = [
  {
    eyebrow: "STACK & SIP · AHMEDABAD CONCEPT",
    title: <>Freshly stacked.<br /><em>Made to order.</em></>,
    copy: "Gourmet smash burgers, bright sides and specialty coffee built with intent, layer by layer.",
    fact: "Scroll to pull the stack apart",
    icon: Sparkles,
  },
  {
    eyebrow: "01 · THE BUN",
    title: <>Small batch.<br /><em>Big structure.</em></>,
    copy: "Glossy sesame brioche, baked in small runs so every stack starts warm and resilient.",
    fact: "Baked fresh through the day",
    icon: Wheat,
  },
  {
    eyebrow: "02 · THE GARDEN",
    title: <>Cold, crisp,<br /><em>cut daily.</em></>,
    copy: "Lettuce, tomato and pickles bring the snap that keeps every rich layer in balance.",
    fact: "Fresh prep every morning",
    icon: Leaf,
  },
  {
    eyebrow: "03 · THE MELT",
    title: <>Cheese with<br /><em>perfect timing.</em></>,
    copy: "Cheddar hits the patty on the grill, melting into the crust instead of sitting on top.",
    fact: "Melted on the grill",
    icon: Sparkles,
  },
  {
    eyebrow: "04 · THE SMASH",
    title: <>Hot steel.<br /><em>Hard sear.</em></>,
    copy: "Fresh patties are pressed only when the ticket lands for a lacy edge and a juicy centre.",
    fact: "Never pre-cooked",
    icon: Flame,
  },
  {
    eyebrow: "05 · THE COMPLETE STACK",
    title: <>Every layer<br /><em>earns its place.</em></>,
    copy: "One balanced bite: hot, cool, crisp, rich and ready before the coffee loses its crema.",
    fact: "Your table is waiting",
    icon: Sparkles,
  },
];

const stageFromProgress = (progress) => {
  if (progress < 0.21) return 0;
  if (progress < 0.37) return 1;
  if (progress < 0.5) return 2;
  if (progress < 0.63) return 3;
  if (progress < 0.77) return 4;
  return 5;
};

export default function FrameSequence({ activeStage, onStageChange, onMenuClick }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Map());
  const currentFrameRef = useRef(0);
  const stageRef = useRef(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const stage = stages[activeStage] || stages[0];
  const Icon = stage.icon;

  const frameUrl = (index) => `${import.meta.env.BASE_URL}frames/burger/frame-${String(index + 1).padStart(3, "0")}.webp`;

  const loadFrame = (index) => {
    const bounded = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    if (imagesRef.current.has(bounded)) return imagesRef.current.get(bounded);
    const image = new Image();
    const promise = new Promise((resolve) => {
      image.onload = () => {
        imagesRef.current.set(bounded, image);
        if (bounded === 0) setFirstFrameReady(true);
        resolve(image);
      };
      image.onerror = () => resolve(null);
    });
    imagesRef.current.set(bounded, promise);
    image.src = frameUrl(bounded);
    return promise;
  };

  const draw = async (index = currentFrameRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    const loaded = imagesRef.current.get(index);
    const image = loaded instanceof HTMLImageElement ? loaded : await loadFrame(index);
    if (!image || currentFrameRef.current !== index) return;

    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(cssWidth * ratio));
    const height = Math.max(1, Math.round(cssHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.fillStyle = "#080908";
    context.fillRect(0, 0, width, height);

    const scale = window.matchMedia("(max-width: 760px)").matches
      ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
      : Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;
    context.drawImage(image, x, y, drawWidth, drawHeight);
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all(Array.from({ length: 12 }, (_, index) => loadFrame(index))).then(() => {
      if (!cancelled) draw(0);
    });
    const onResize = () => draw();
    const resizeObserver = new ResizeObserver(onResize);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useGSAP(() => {
    const frameState = { value: 0 };
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 761px)", mobile: "(max-width: 760px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { mobile, reduce } = context.conditions;
      const trigger = ScrollTrigger.create({
        id: "burger-story",
        trigger: sectionRef.current,
        start: "top top",
        end: reduce ? "+=180%" : mobile ? "+=430%" : "+=520%",
        pin: true,
        scrub: reduce ? true : 1.15,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          frameState.value = Math.round(self.progress * (FRAME_COUNT - 1));
          if (frameState.value !== currentFrameRef.current) {
            currentFrameRef.current = frameState.value;
            const nearby = [-4, -2, -1, 0, 1, 2, 4, 7];
            nearby.forEach((offset) => loadFrame(frameState.value + offset));
            draw(frameState.value);
          }
          const nextStage = stageFromProgress(self.progress);
          if (nextStage !== stageRef.current) {
            stageRef.current = nextStage;
            onStageChange(nextStage);
          }
          sectionRef.current?.style.setProperty("--story-progress", self.progress);
        },
      });

      const idle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 500));
      idle(() => {
        for (let index = 12; index < FRAME_COUNT; index += 3) loadFrame(index);
      });
      return () => trigger.kill();
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section className="cinematic-story" ref={sectionRef} aria-label="Burger ingredient story">
      <div className="sequence-backdrop" aria-hidden="true" />
      <canvas ref={canvasRef} className={firstFrameReady ? "is-ready" : ""} aria-label="Burger separates into ingredients and comes back together as you scroll" />
      <div className="sequence-vignette" aria-hidden="true" />

      <div className="sequence-copy" key={activeStage}>
        <span className="eyebrow">{stage.eyebrow}</span>
        <h1>{stage.title}</h1>
        <p>{stage.copy}</p>
        {activeStage === 0 ? (
          <div className="hero-buttons">
            <button type="button" onClick={onMenuClick}>Explore the menu <ArrowRight size={18} /></button>
            <a href="#story">Why we stack it</a>
          </div>
        ) : activeStage === 5 ? (
          <div className="hero-buttons"><button type="button" onClick={onMenuClick}>Build your order <ArrowRight size={18} /></button></div>
        ) : null}
      </div>

      <aside className="sequence-fact" key={`fact-${activeStage}`}>
        <span><Icon size={20} /></span>
        <small>STACK NOTE</small>
        <strong>{stage.fact}</strong>
      </aside>

      <div className="story-progress" aria-hidden="true"><span /></div>
      <div className="scroll-cue" aria-hidden="true"><ArrowDown size={16} /><span>SCROLL TO UNSTACK</span></div>
    </section>
  );
}
