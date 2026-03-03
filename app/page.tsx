'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Nav background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal on scroll (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#EDEDED]">
      {/* ── Grain overlay ── */}
      <svg className="pointer-events-none fixed inset-0 z-[200] h-full w-full" style={{ opacity: 0.025 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Navigation ── */}
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-[400ms] ${
          scrolled
            ? 'border-b border-[rgba(255,255,255,0.03)] bg-[#0A0A0Bee]'
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{ backdropFilter: 'blur(16px)' }}
      >
        <div className="mx-auto flex h-[58px] max-w-[1080px] items-center justify-between px-6">
          <span className="font-serif text-lg italic text-[#E8C547]">Court · Finder</span>
          <a
            href="#cta"
            className="rounded-[6px] bg-[#3ECF8E] px-5 py-2.5 font-dm-mono text-sm font-medium text-[#0A0A0B] transition-opacity hover:opacity-90"
          >
            Accès anticipé
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════
          HERO
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8C547] opacity-[0.04] blur-[120px]" />

        <div className="relative z-10 max-w-[720px] text-center">
          {/* Label */}
          <p
            className="hero-seq mb-6 font-dm-mono text-[11px] uppercase tracking-[0.2em] text-[#3ECF8E]"
            style={{ animationDelay: '0.2s' }}
          >
            Bientôt disponible
          </p>

          {/* Title */}
          <h1
            className="hero-seq mb-6 font-sans font-semibold tracking-[-0.02em]"
            style={{ fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1.08, animationDelay: '0.4s' }}
          >
            Ton court-métrage
            <br />
            mérite d&apos;être{' '}
            <span className="relative inline-block font-serif italic text-[#E8C547]">
              financé
              <span className="absolute bottom-0 left-0 h-px w-full bg-[#E8C547] opacity-30" />
            </span>{' '}
            et <span className="font-serif italic text-[#E8C547]">vu</span>.
          </h1>

          {/* Subtitle */}
          <p
            className="hero-seq mx-auto mb-10 max-w-[520px] font-newsreader font-light leading-[1.7] text-[#888888]"
            style={{ fontSize: 'clamp(15px, 2.2vw, 19px)', animationDelay: '0.6s' }}
          >
            Toutes les aides et tous les festivals de courts-métrages au même endroit.
            Matching intelligent, calendrier des deadlines, suivi des soumissions.
          </p>

          {/* Email form */}
          <div className="hero-seq" style={{ animationDelay: '0.8s' }}>
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mb-4 flex max-w-[440px] flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="flex-1 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-[18px] py-[14px] font-dm-mono text-sm text-[#EDEDED] placeholder-[rgba(255,255,255,0.2)] transition-colors focus:border-[rgba(62,207,142,0.5)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-[6px] bg-[#3ECF8E] px-7 py-[14px] font-dm-mono text-sm font-medium text-[#0A0A0B] transition-opacity hover:opacity-90"
                >
                  Je veux l&apos;accès →
                </button>
              </form>
            ) : (
              <div className="mx-auto mb-4 max-w-[440px] rounded-xl border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.08)] px-6 py-4">
                <p className="mb-1 font-medium text-[#34D399]">C&apos;est noté !</p>
                <p className="font-dm-mono text-sm text-[#888888]">
                  On te prévient dès que Court · Finder ouvre ses portes.
                </p>
              </div>
            )}

            <Link href="/app" className="text-sm text-[#888888] transition-colors hover:underline">
              Voir la démo →
            </Link>

            <p className="mt-4 font-dm-mono text-[11px] text-[rgba(255,255,255,0.15)]">
              Gratuit. Pas de spam. On te contacte uniquement pour le lancement.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-dm-mono text-[10px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.15)]">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          LE PROBLÈME
         ════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1080px] px-6 py-24">
        <div className="reveal mx-auto mb-16 h-px w-10 bg-[#F472B6] opacity-30" />

        <div className="reveal mb-12">
          <p className="mb-4 font-dm-mono text-[11px] uppercase tracking-[0.15em] text-[#F472B6]">
            Le problème
          </p>
          <h2
            className="mb-4 max-w-[600px] font-sans font-semibold tracking-[-0.02em]"
            style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}
          >
            Trouver les bons financements et les bons festivals, c&apos;est un{' '}
            <span className="font-serif italic text-[#F472B6]">métier en soi</span>.
          </h2>
          <p className="max-w-[560px] font-newsreader font-light leading-[1.7] text-[#888888]">
            Les infos sont éclatées entre des dizaines de sites. Les deadlines changent chaque année.
            Les critères d&apos;éligibilité sont opaques. Résultat : les cinéastes ratent des
            opportunités ou perdent un temps fou.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              num: '47',
              label: "dispositifs d'aide au court-métrage en France",
              sub: 'Éparpillés sur des dizaines de sites différents',
            },
            {
              num: '120+',
              label: 'festivals catégorie A dans le monde',
              sub: 'Chacun avec ses règles, deadlines et exigences de première',
            },
            {
              num: '6h',
              label: 'perdues par dossier en moyenne',
              sub: 'À chercher les bonnes infos, les bons formulaires, les bonnes dates',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="reveal rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141415] p-7 transition-all duration-200 hover:scale-[1.01] hover:border-[rgba(255,255,255,0.12)]"
              style={{ '--delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <p
                className="mb-2 font-sans font-semibold text-[#F472B6]"
                style={{ fontSize: 'clamp(32px, 5vw, 44px)' }}
              >
                {card.num}
              </p>
              <p className="mb-2 text-sm font-medium text-[#EDEDED]">{card.label}</p>
              <p className="font-dm-mono text-xs text-[rgba(255,255,255,0.2)]">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          LA SOLUTION
         ════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1080px] px-6 py-24">
        <div className="reveal mx-auto mb-16 h-px w-10 bg-[#3ECF8E] opacity-30" />

        <div className="reveal mb-12">
          <p className="mb-4 font-dm-mono text-[11px] uppercase tracking-[0.15em] text-[#3ECF8E]">
            La solution
          </p>
          <h2
            className="mb-4 max-w-[600px] font-sans font-semibold tracking-[-0.02em]"
            style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}
          >
            Un copilote pour chaque étape,{' '}
            <span className="font-serif italic text-[#3ECF8E]">de l&apos;écriture au festival</span>.
          </h2>
          <p className="max-w-[560px] font-newsreader font-light leading-[1.7] text-[#888888]">
            Court · Finder centralise tout ce dont tu as besoin. Tu décris ton projet, on te montre
            le chemin. Simple.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              icon: '◎',
              title: 'Matching intelligent',
              desc: 'Décris ton projet, on te montre exactement les aides et festivals auxquels tu es éligible. Plus de recherche manuelle.',
            },
            {
              icon: '◉',
              title: 'Calendrier unifié',
              desc: 'Toutes tes deadlines au même endroit. Alertes email à J-30, J-14, J-7. Tu ne rates plus rien.',
            },
            {
              icon: '◈',
              title: 'Suivi complet',
              desc: "De l'écriture aux festivals : suis l'avancement de tes dossiers, tes soumissions, tes sélections.",
            },
            {
              icon: '◇',
              title: 'Conseils stratégiques',
              desc: 'Pour chaque aide et chaque festival : les pièces à fournir, les taux de sélection, les tips de pros.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="reveal rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141415] p-7 transition-all duration-200 hover:scale-[1.01] hover:border-[rgba(255,255,255,0.12)]"
              style={{ '--delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <span className="mb-3 block font-dm-mono text-2xl text-[#3ECF8E]">{card.icon}</span>
              <p className="mb-2 text-sm font-semibold text-[#EDEDED]">{card.title}</p>
              <p className="font-newsreader text-sm font-light leading-[1.7] text-[#888888]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
         ════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1080px] px-6 py-24">
        <div className="reveal mx-auto mb-16 h-px w-10 bg-[#A78BFA] opacity-30" />

        <div className="reveal mb-14 text-center">
          <p className="mb-4 font-dm-mono text-[11px] uppercase tracking-[0.15em] text-[#A78BFA]">
            Comment ça marche
          </p>
          <h2
            className="mx-auto max-w-[600px] font-sans font-semibold tracking-[-0.02em]"
            style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}
          >
            Trois étapes,{' '}
            <span className="font-serif italic text-[#A78BFA]">zéro prise de tête</span>.
          </h2>
        </div>

        <div className="mx-auto flex max-w-[640px] flex-col gap-10">
          {[
            {
              num: '01',
              color: '#A78BFA',
              borderColor: 'rgba(167,139,250,0.2)',
              title: 'Décris ton projet',
              desc: 'Genre, étape, profil, budget. En 2 minutes c\u2019est fait.',
            },
            {
              num: '02',
              color: '#E8C547',
              borderColor: 'rgba(232,197,71,0.2)',
              title: 'Découvre tes opportunités',
              desc: 'Aides éligibles, festivals qui matchent, classés par pertinence. Avec les deadlines, les pièces à fournir, et des conseils de pros.',
            },
            {
              num: '03',
              color: '#34D399',
              borderColor: 'rgba(52,211,153,0.2)',
              title: 'Suis tout au même endroit',
              desc: 'Calendrier unifié, alertes email, suivi des soumissions. Ton film avance, tu gardes le contrôle.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="reveal flex items-start gap-5"
              style={{ '--delay': `${i * 150}ms` } as React.CSSProperties}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-dm-mono text-sm"
                style={{ border: `1px solid ${step.borderColor}`, color: step.color }}
              >
                {step.num}
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-[#EDEDED]">{step.title}</p>
                <p className="font-newsreader text-sm font-light leading-[1.7] text-[#888888]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          POUR QUI
         ════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1080px] px-6 py-24">
        <div className="reveal mx-auto mb-16 h-px w-10 bg-[#34D399] opacity-30" />

        <div className="reveal mb-12 text-center">
          <p className="mb-4 font-dm-mono text-[11px] uppercase tracking-[0.15em] text-[#34D399]">
            Pour qui
          </p>
          <h2
            className="mx-auto max-w-[500px] font-sans font-semibold tracking-[-0.02em]"
            style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
          >
            Pour tous ceux qui font des courts-métrages et veulent{' '}
            <span className="font-serif italic text-[#34D399]">se donner toutes les chances</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Réalisateurs premiers films',
              desc: 'Tu ne sais pas par où commencer ? On te guide vers les aides accessibles et les festivals tremplins.',
            },
            {
              title: 'Cinéastes émergents',
              desc: 'Tu connais le système mais tu perds du temps ? On automatise la veille et le suivi pour toi.',
            },
            {
              title: 'Étudiants en cinéma',
              desc: 'Ton film de fin d\u2019études mérite une vie en festival. On te montre lesquels et quand candidater.',
            },
            {
              title: 'Producteurs de courts',
              desc: 'Gère le suivi de plusieurs projets, optimise tes plans de financement, ne rate aucune commission.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="reveal rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141415] p-7 transition-all duration-200 hover:scale-[1.01] hover:border-[rgba(255,255,255,0.12)]"
              style={{ '--delay': `${i * 100}ms` } as React.CSSProperties}
            >
              <p className="mb-2 text-sm font-semibold text-[#EDEDED]">{card.title}</p>
              <p className="font-newsreader text-sm font-light leading-[1.7] text-[#888888]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PREMIERS RETOURS
         ════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1080px] px-6 py-24">
        <div className="reveal mx-auto mb-16 h-px w-10 bg-[#888888] opacity-30" />

        <div className="reveal mb-12 text-center">
          <p className="font-dm-mono text-[11px] uppercase tracking-[0.15em] text-[#888888]">
            Premiers retours
          </p>
        </div>

        <div className="mx-auto flex max-w-[800px] flex-col gap-4">
          {[
            {
              quote:
                "Exactement ce qui manquait. J\u2019ai raté 3 deadlines CNC l\u2019an dernier par manque d\u2019organisation.",
              author: '— Margaux, réalisatrice premier film',
            },
            {
              quote:
                'Je passe des heures à croiser les infos entre les sites de chaque fond régional. Vivement que ça existe.',
              author: '— Thomas, producteur de courts',
            },
            {
              quote:
                "Pour mon film de fin d\u2019études, j\u2019avais aucune idée des festivals accessibles. J\u2019aurais tué pour un outil comme ça.",
              author: '— Inès, étudiante La Fémis',
            },
          ].map((t, i) => (
            <div
              key={i}
              className="reveal rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141415] px-7 py-6 transition-all duration-200 hover:border-[rgba(255,255,255,0.12)]"
              style={{ '--delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <p className="mb-3 font-serif text-base italic leading-[1.7] text-[#EDEDED]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="font-dm-mono text-xs text-[#888888]">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CTA FINAL
         ════════════════════════════════════════════════════════════════ */}
      <section id="cta" className="mx-auto max-w-[1080px] px-6 py-28">
        <div className="reveal mx-auto mb-16 h-px w-10 bg-[#3ECF8E] opacity-30" />

        <div className="reveal mx-auto max-w-[600px] text-center">
          <h2
            className="mb-5 font-sans font-semibold tracking-[-0.02em]"
            style={{ fontSize: 'clamp(26px, 5vw, 42px)' }}
          >
            Sois parmi les{' '}
            <span className="font-serif italic text-[#3ECF8E]">premiers</span>.
          </h2>

          <p className="mx-auto mb-10 max-w-[520px] font-newsreader font-light leading-[1.7] text-[#888888]">
            Court · Finder lance bientôt. Inscris-toi pour un accès anticipé gratuit et contribue à
            façonner l&apos;outil.
          </p>

          {/* Shared state — shows confirmation if already submitted in hero */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mb-4 flex max-w-[440px] flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="flex-1 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-[18px] py-[14px] font-dm-mono text-sm text-[#EDEDED] placeholder-[rgba(255,255,255,0.2)] transition-colors focus:border-[rgba(62,207,142,0.5)] focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-[6px] bg-[#3ECF8E] px-7 py-[14px] font-dm-mono text-sm font-medium text-[#0A0A0B] transition-opacity hover:opacity-90"
              >
                Je veux l&apos;accès →
              </button>
            </form>
          ) : (
            <div className="mx-auto mb-4 max-w-[440px] rounded-xl border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.08)] px-6 py-4">
              <p className="mb-1 font-medium text-[#34D399]">C&apos;est noté !</p>
              <p className="font-dm-mono text-sm text-[#888888]">
                On te prévient dès que Court · Finder ouvre ses portes.
              </p>
            </div>
          )}

          <Link href="/app" className="text-sm text-[#888888] transition-colors hover:underline">
            Voir la démo →
          </Link>

          <p className="mt-4 font-dm-mono text-[11px] text-[rgba(255,255,255,0.15)]">
            Accès anticipé gratuit · Pas de spam · Tu pourras te désinscrire à tout moment
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] px-6 py-8 text-center">
        <span className="font-serif text-lg italic text-[rgba(232,197,71,0.5)]">
          Court · Finder
        </span>
        <p className="mt-3 font-dm-mono text-[11px] text-[rgba(255,255,255,0.15)]">
          Chaque court-métrage mérite sa chance. On t&apos;aide à la saisir.
        </p>
        <p className="mt-2 font-dm-mono text-[10px] text-[rgba(255,255,255,0.1)]">
          Un projet Sad Pictures · Paris, 2026
        </p>
      </footer>
    </div>
  );
}
