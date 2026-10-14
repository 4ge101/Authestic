import { gsap } from 'gsap';

/**
 * Checks if the user or environment prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Smoothly scrolls the window or specific container to top
 */
export const smoothScrollToTop = (duration = 0.6) => {
  if (typeof window === 'undefined') return;

  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, 0);
  }
};

/**
 * Smoothly scrolls to a specific element by ID or selector
 */
export const smoothScrollToElement = (selector: string, offset = 80) => {
  if (typeof window === 'undefined') return;
  const target = document.querySelector(selector);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.pageYOffset - offset;

  if (prefersReducedMotion()) {
    window.scrollTo({ top: y, behavior: 'auto' });
    return;
  }

  try {
    window.scrollTo({ top: y, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, y);
  }
};

/**
 * Setup a subtle, calming floating micro-motion for characters/icons (sun, star, badges)
 * Returns a cleanup function to kill the tween on unmount.
 */
export const setupCalmFloat = (
  element: HTMLElement | null,
  options: {
    y?: number;
    rotation?: number;
    duration?: number;
    delay?: number;
    disabled?: boolean;
  } = {}
) => {
  if (!element || options.disabled || prefersReducedMotion()) return () => {};

  const yMove = options.y ?? 4;
  const duration = options.duration ?? 3.5;
  const rotation = options.rotation ?? 0;
  const delay = options.delay ?? 0;

  const tween = gsap.to(element, {
    y: -yMove,
    rotation: rotation,
    duration,
    delay,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  return () => {
    tween.kill();
  };
};

/**
 * Animate a staggered entrance for page sections or cards
 */
export const animateStaggerEntrance = (
  elements: (HTMLElement | null)[],
  options: {
    delay?: number;
    stagger?: number;
    y?: number;
    duration?: number;
    disabled?: boolean;
  } = {}
) => {
  const validElements = elements.filter(Boolean) as HTMLElement[];
  if (validElements.length === 0) return () => {};

  if (options.disabled || prefersReducedMotion()) {
    gsap.set(validElements, { opacity: 1, y: 0, clearProps: 'all' });
    return () => {};
  }

  const tween = gsap.fromTo(
    validElements,
    {
      opacity: 0,
      y: options.y ?? 18,
    },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? 0.65,
      delay: options.delay ?? 0.05,
      stagger: options.stagger ?? 0.1,
      ease: 'power2.out',
      clearProps: 'transform',
    }
  );

  return () => {
    tween.kill();
  };
};
