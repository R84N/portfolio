import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null

/** Lenis smooth scroll wired into GSAP's ticker, like the old site (desktop only). */
export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger)
  if (lenis || window.innerWidth < 1080) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(time => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function scrollToTarget(target: string) {
  const el = document.querySelector<HTMLElement>(target)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' })
}
