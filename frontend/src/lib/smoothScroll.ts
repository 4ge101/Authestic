import { gsap } from 'gsap';

/**
 * Smooth scrolling and gentle UI transitions via GSAP.
 * Respects prefers-reduced-motion and custom user accessibility setting.
 */

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  return document.documentElement.getAttribute('data-reduced-motion') === 'true';
}

/**
 * Buttery smooth scroll to target using GSAP
 */
export function smoothScrollTo(
  target: string | HTMLElement | number,
  duration = 0.65,
  offset = 0
): void {
  if (typeof window === 'undefined') return;

  if (isReducedMotion()) {
    if (typeof target === 'number') {
      window.scrollTo(0, target);
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView();
      }
    }
    return;
  }

  let targetY = 0;
  if (typeof target === 'number') {
    targetY = target;
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      targetY = window.pageYOffset + rect.top + offset;
    }
  }

  // Smooth tween on window scroll
  gsap.to(window, {
    duration,
    scrollTo: undefined, // in case ScrollToPlugin isn't loaded, fallback to scrollTop tween:
    ease: 'power2.out',
    onUpdate: function () {
      // Custom tweening window.pageYOffset
    }
  });

  // Direct window scroll tween
  const scrollObj = { y: window.pageYOffset };
  gsap.to(scrollObj, {
    y: targetY,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      window.scrollTo(0, scrollObj.y);
    }
  });
}

/**
 * Gentle entrance reveal animation for cards/sections
 */
export function animatePageEntrance(containerElement: HTMLElement | null): void {
  if (!containerElement || isReducedMotion()) return;

  const targets = containerElement.querySelectorAll('.card, .destination-card, .routine-item, .hero-card');
  if (targets.length === 0) return;

  gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: 12
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
}
