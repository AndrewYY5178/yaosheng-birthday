import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════
   Happy Birthday · XuYaoSheng · 2026.07.08
   Mint green #C1E7D7 × Ink #111
   ═══════════════════════════════════════════ */

const MINT = '#C1E7D7';
const IMAGES = Array.from({ length: 14 }, (_, i) => `/memories/${String(i + 1).padStart(2, '0')}.jpg`);

/* ═══════════════ SECTION 1: COUNTDOWN ═══════════════ */
function CountdownSection({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const words = ['Growth', 'Transformation', 'Surprise', 'Anticipation'];

  useEffect(() => {
    const start = performance.now();
    const dur = 6000;
    const tick = () => {
      const p = Math.min((performance.now() - start) / dur, 1);
      setCount(Math.floor(p * 19));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(onDone, 600);
    };
    requestAnimationFrame(tick);
    const wordInterval = setInterval(() => setWordIdx((i) => (i + 1) % words.length), 900);
    return () => clearInterval(wordInterval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#111] flex items-center justify-center font-[family-name:var(--font-body)]">
      <span className="absolute top-6 left-6 text-xs uppercase tracking-[0.3em] text-white/30">Loading...</span>
      <div className="text-center flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          <motion.span key={wordIdx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-[family-name:var(--font-heading)] italic text-3xl md:text-5xl text-[#C1E7D7]/70">
            {words[wordIdx]}
          </motion.span>
        </AnimatePresence>
        <div className="font-[family-name:var(--font-heading)] text-6xl md:text-8xl lg:text-9xl tabular-nums"
          style={{ color: MINT }}>{String(count).padStart(2, '0')}</div>
        <div className="h-[3px] bg-white/10 mt-4 rounded-full overflow-hidden w-40">
          <div className="h-full transition-all duration-100 rounded-full" style={{
            width: `${(count / 19) * 100}%`,
            background: `linear-gradient(90deg, ${MINT}, #fff)`,
            boxShadow: `0 0 8px rgba(193,231,215,0.4)`,
          }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SECTION 2: BIRTHDAY ═══════════════ */
function BirthdaySection() {
  const [showParticles, setShowParticles] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showParticles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string; }
    const particles: Particle[] = [];
    const cx = canvas.width / 2, cy = canvas.height / 2;

    const burst = (count: number, spread: number, speed: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const s = speed * (0.4 + Math.random() * 0.6);
        const isSparkle = Math.random() < 0.3;
        particles.push({
          x: cx + (Math.random() - 0.5) * spread,
          y: cy + (Math.random() - 0.5) * spread * 0.6,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s - 1.5,
          life: 1, maxLife: 2.5 + Math.random() * 3,
          size: isSparkle ? 3 + Math.random() * 6 : 1.5 + Math.random() * 3,
          color: isSparkle ? `rgba(255,255,255,${0.6 + Math.random() * 0.4})` : `rgba(193,231,215,${0.5 + Math.random() * 0.5})`,
        });
      }
    };

    // 3 waves of bursts
    burst(180, 300, 8);
    setTimeout(() => burst(100, 400, 10), 600);
    setTimeout(() => burst(80, 350, 7), 1200);

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= 0.005;
        if (p.life > 0) {
          alive = true;
          // Glow circle
          const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * p.life * 2);
          glow.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.life * 0.9})`));
          glow.addColorStop(1, 'rgba(193,231,215,0)');
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
          ctx!.fillStyle = glow;
          ctx!.fill();
          // Core dot
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size * p.life * 0.5, 0, Math.PI * 2);
          ctx!.fillStyle = p.color.replace(/[\d.]+\)$/, `${Math.min(1, p.life * 1.2)})`);
          ctx!.fill();
        }
      }
      if (alive) animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [showParticles]);

  const text = "Happy Birthday XuYaoSheng".split('');

  return (
    <section className="relative min-h-screen bg-[#111] flex items-center justify-center overflow-hidden">
      {showParticles && <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(40px,10vw,100px)] leading-[0.95] tracking-[-0.03em]">
          {text.map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
              style={{
                background: `linear-gradient(90deg, ${MINT} 20%, #fff 50%, ${MINT} 80%)`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                color: 'transparent',
                animation: c === ' ' ? 'none' : `shinyBirthday 6s linear ${i * 0.04}s infinite`,
              }}>
              {c === ' ' ? ' ' : c}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="font-[family-name:var(--font-heading)] text-lg md:text-2xl text-[#C1E7D7]/50 mt-6 italic">
          — 2026.07.08 —
        </motion.p>
      </div>
      <style>{`@keyframes shinyBirthday { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }`}</style>
    </section>
  );
}

/* ═══════════════ SECTION 3A: MARQUEE ═══════════════ */
function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const row1 = IMAGES.slice(0, 7);
  const row2 = IMAGES.slice(7);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const top = sectionRef.current.getBoundingClientRect().top;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#111] pt-16 pb-10 overflow-hidden">
      <div className="flex gap-3 mb-3" style={{ willChange: 'transform', transform: `translateX(${offset - 200}px)` }}>
        {[...row1, ...row1, ...row1].map((src, i) => (
          <img key={i} src={src} loading="lazy" alt="" className="w-[300px] h-[200px] rounded-2xl object-cover shrink-0" />
        ))}
      </div>
      <div className="flex gap-3" style={{ willChange: 'transform', transform: `translateX(${-offset + 200}px)` }}>
        {[...row2, ...row2, ...row2].map((src, i) => (
          <img key={i} src={src} loading="lazy" alt="" className="w-[300px] h-[200px] rounded-2xl object-cover shrink-0" />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ SECTION 3B: STICKY CARDS ═══════════════ */
function StickyCardsSection() {
  return (
    <section className="relative bg-[#111] pb-20">
      {IMAGES.map((src, i) => {
        const total = IMAGES.length;
        const scale = 1 - (total - 1 - i) * 0.015;
        return (
          <div key={i} className="sticky mx-auto rounded-2xl overflow-hidden border-2 border-[#C1E7D7]/20"
            style={{ top: `${80 + i * 28}px`, width: `calc(80% - ${i * 8}px)`, height: '55vh', zIndex: i, background: '#1a1a1a', transform: `scale(${scale})` }}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        );
      })}
      <div className="h-[15vh]" />
    </section>
  );
}

/* ═══════════════ BLESSING MOMENT ═══════════════ */
function BlessingMomentDivider() {
  return (
    <section className="bg-[#111] py-16 md:py-20 text-center">
      <p className="font-[family-name:var(--font-heading)] text-[clamp(2rem,6vw,4rem)] italic text-[#C1E7D7]">
        <span className="inline-block animate-[pullUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">Blessing</span>{' '}
        <span className="inline-block animate-[pullUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.08s_forwards]" style={{ opacity: 0 }}>Moment</span>
      </p>
      <style>{`@keyframes pullUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </section>
  );
}

/* ═══════════════ SECTION 4: WISHES ═══════════════ */
const WISHES = [
  "First of all，还是祝你身体健康。尽管现在是奋斗、拼搏的年纪，但是拥有健康的身体仍然是一切的前提。愿一切病痛远离你",
  "希望在你的 19 岁里，你的未来愈加清晰与明朗，虽然迷茫可能不会消失，但是希望你走的每一步都是在向理想与梦想靠近。",
  "我想，没有哪一段旅程是一帆风顺的，所以，与其祝你一切顺利与完美，我更想说，希望你可以尽情拥抱 19 岁的生活，无论是暖阳或是风雨，尽情体验，无论是错是对，都会很精彩",
  "压力、焦虑注定是这个年纪的随礼，但是忙碌之余，别忘了让自己喘口气，也不妨允许自己犯点错",
  "最后，祝你在 19 岁里，以顽强且坚韧的心态迎接一切未知，世界的绮丽都向你绽开，19 岁的生活像薄荷绿一样清新而活力！",
];

function WishesSection() {
  return (
    <section className="bg-[#111] py-10 md:py-14 px-6">
      <div className="max-w-2xl mx-auto">
        {WISHES.map((wish, i) => (
          <div key={i}>
            <WishBlock text={wish} />
            {i < WISHES.length - 1 && (
              <div className="flex flex-col items-center justify-center gap-3 py-10" style={{ minHeight: '70vh' }}>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
                <div className="w-px h-12 bg-white/10 relative overflow-hidden">
                  <div className="w-full h-1/3 absolute top-0" style={{
                    background: `linear-gradient(to bottom, transparent, ${MINT}40, transparent)`,
                    animation: 'scrollDown 1.5s ease-in-out infinite',
                  }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes scrollDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }`}</style>
    </section>
  );
}

function WishBlock({ text }: { text: string }) {
  const chars = text.split('');
  return (
    <p className="text-base md:text-lg leading-[2] text-[#C1E7D7]/80 text-center max-w-lg mx-auto font-[family-name:var(--font-body)]">
      {chars.map((c, i) => (
        <motion.span key={i} initial={{ opacity: 0.2 }}
          whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: i * 0.015, duration: 0.3 }}>
          {c}
        </motion.span>
      ))}
    </p>
  );
}

/* ═══════════════ SECTION 5: ENDING ═══════════════ */
function EndingSection() {
  const words = "Happy Birthday XuYaoSheng".split(' ');
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Background image — low opacity, like Mindloop */}
      <div className="absolute inset-0 z-0">
        <img src="/ending-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
      </div>
      {/* Gradient fade to black at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#111] to-transparent z-10" />
      <div className="relative z-20">
        <h2 className="font-[family-name:var(--font-heading)] text-[clamp(3rem,10vw,8rem)] leading-[1.05] tracking-[-0.03em]">
          {words.map((w, i) => (
            <motion.span key={i} initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.25em]"
              style={{
                background: `linear-gradient(90deg, ${MINT} 20%, #fff 50%, ${MINT} 80%)`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                color: 'transparent',
                animation: `shinyEnd 6s linear ${i * 0.12}s infinite`,
              }}>
              {w}
            </motion.span>
          ))}
        </h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="font-[family-name:var(--font-heading)] text-xl md:text-3xl text-[#C1E7D7]/40 italic mt-8">
          2026.07.08
        </motion.p>
      </div>
      <style>{`@keyframes shinyEnd { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }`}</style>
    </section>
  );
}

/* ═══════════════ MAIN ═══════════════ */
export default function App() {
  const [showSite, setShowSite] = useState(false);
  return (
    <div className="bg-[#111]">
      {!showSite && <CountdownSection onDone={() => setShowSite(true)} />}
      {showSite && (
        <>
          <BirthdaySection />
          <MarqueeSection />
          <StickyCardsSection />
          <BlessingMomentDivider />
          <div className="flex flex-col items-center justify-center py-10" style={{ minHeight: '50vh' }}>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
            <div className="w-px h-12 bg-white/10 relative overflow-hidden mt-2">
              <div className="w-full h-1/3 absolute top-0" style={{
                background: `linear-gradient(to bottom, transparent, ${MINT}40, transparent)`,
                animation: 'scrollDown 1.5s ease-in-out infinite',
              }} />
            </div>
          </div>
          <WishesSection />
          <EndingSection />
        </>
      )}
    </div>
  );
}
