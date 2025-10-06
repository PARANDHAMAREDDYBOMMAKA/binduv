"use client"

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Single optimized animation loop
    let animationId: number
    const animate = (time: number) => {
      lenis.raf(time)
      ScrollTrigger.update()
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    // Optimized resize handler
    const handleResize = () => {
      lenis.resize()
    }
    
    window.addEventListener('resize', handleResize, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      lenisRef.current?.destroy()
    }
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0, { duration: 1 })
  }

  // Scroll to element function (unused, safe to remove)

  return (
    <>
      {children}
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}