// Performance Optimization Hook for Ocean-themed IPO Platform
import { useEffect, useRef, useCallback } from 'react'

export interface PerformanceConfig {
  enableAnimations: boolean
  reducedMotion: boolean
  animationDuration: number
  throttleDelay: number
}

export function usePerformanceOptimization() {
  const animationFrames = useRef<Set<number>>(new Set())
  const intersectionObserver = useRef<IntersectionObserver | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)
  const isReducedMotion = useRef(false)

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      isReducedMotion.current = mediaQuery.matches
      
      const handleChange = (e: MediaQueryListEvent) => {
        isReducedMotion.current = e.matches
        if (e.matches) {
          cancelAllAnimations()
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Setup Intersection Observer for performance
  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      intersectionObserver.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement
            
            if (entry.isIntersecting) {
              element.style.willChange = 'transform, opacity'
              element.dataset.visible = 'true'
            } else {
              element.style.willChange = 'auto'
              element.dataset.visible = 'false'
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      )
    }

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect()
      }
    }
  }, [])

  // Setup Resize Observer
  useEffect(() => {
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver.current = new ResizeObserver(
        debounce((entries) => {
          entries.forEach((entry: { target: HTMLElement; contentRect: { width: any; height: any } }) => {
            const element = entry.target as HTMLElement
            element.dispatchEvent(new CustomEvent('optimizedResize', {
              detail: { 
                width: entry.contentRect.width, 
                height: entry.contentRect.height 
              }
            }))
          })
        }, 100)
      )
    }

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [])

  // Debounce utility
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(null, args), wait)
    }
  }, [])

  // Throttle utility
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }, [])

  // Optimized requestAnimationFrame wrapper
  const requestOptimizedFrame = useCallback((callback: FrameRequestCallback): number => {
    if (isReducedMotion.current) {
      callback(performance.now())
      return 0
    }

    const frameId = requestAnimationFrame(callback)
    animationFrames.current.add(frameId)
    return frameId
  }, [])

  // Cancel animation frame
  const cancelOptimizedFrame = useCallback((frameId: number): void => {
    cancelAnimationFrame(frameId)
    animationFrames.current.delete(frameId)
  }, [])

  // Cancel all running animations
  const cancelAllAnimations = useCallback((): void => {
    animationFrames.current.forEach(frameId => {
      cancelAnimationFrame(frameId)
    })
    animationFrames.current.clear()
  }, [])

  // Observe element for intersection
  const observeElement = useCallback((element: HTMLElement | null): void => {
    if (element && intersectionObserver.current) {
      intersectionObserver.current.observe(element)
    }
  }, [])

  // Unobserve element
  const unobserveElement = useCallback((element: HTMLElement | null): void => {
    if (element && intersectionObserver.current) {
      intersectionObserver.current.unobserve(element)
    }
  }, [])

  // Observe element for resize
  const observeResize = useCallback((element: HTMLElement | null): void => {
    if (element && resizeObserver.current) {
      resizeObserver.current.observe(element)
    }
  }, [])

  // Get optimized animation duration
  const getAnimationDuration = useCallback((baseDuration: number): number => {
    return isReducedMotion.current ? 0 : baseDuration
  }, [])

  // Check if reduced motion is preferred
  const prefersReducedMotion = useCallback((): boolean => {
    return isReducedMotion.current
  }, [])

  return {
    // Animation utilities
    requestOptimizedFrame,
    cancelOptimizedFrame,
    cancelAllAnimations,
    
    // Observer utilities
    observeElement,
    unobserveElement,
    observeResize,
    
    // Performance utilities
    throttle,
    debounce,
    prefersReducedMotion,
    getAnimationDuration,
  }
}

// Ocean Animation Utilities
export class OceanAnimationUtils {
  private static wavePhase = 0
  private static ripples: Array<{ 
    x: number
    y: number
    time: number
    intensity: number 
  }> = []

  // Generate wave displacement for ocean effect
  static getWaveDisplacement(x: number, y: number, time: number): number {
    const wave1 = Math.sin(x * 0.1 + time * 0.5) * Math.cos(y * 0.1 + time * 0.3) * 0.5
    const wave2 = Math.sin(x * 0.05 + time * 0.3) * Math.sin(y * 0.05 + time * 0.4) * 0.3
    const wave3 = Math.sin(x * 0.02 + time * 0.2) * Math.cos(y * 0.02 + time * 0.25) * 0.2
    
    return wave1 + wave2 + wave3
  }

  // Create ripple effect
  static createRipple(x: number, y: number, intensity: number = 1): void {
    this.ripples.push({
      x,
      y,
      time: 0,
      intensity
    })

    // Limit number of ripples for performance
    if (this.ripples.length > 10) {
      this.ripples.shift()
    }
  }

  // Update ripples animation
  static updateRipples(deltaTime: number): void {
    this.ripples = this.ripples.filter(ripple => {
      ripple.time += deltaTime
      return ripple.time < 4 // Remove ripples after 4 seconds
    })
  }

  // Get ripple effect at position
  static getRippleEffect(x: number, y: number): number {
    let totalEffect = 0

    this.ripples.forEach(ripple => {
      const distance = Math.sqrt(Math.pow(x - ripple.x, 2) + Math.pow(y - ripple.y, 2))
      const rippleRadius = ripple.time * 8
      const rippleFade = Math.max(0, 1 - ripple.time * 0.25)

      if (distance < rippleRadius + 2) {
        const effect = Math.sin((distance - rippleRadius) * Math.PI * 2) 
                      * ripple.intensity 
                      * rippleFade 
                      * Math.exp(-distance * 0.1)
        totalEffect += effect
      }
    })

    return totalEffect
  }

  // Get current wave phase
  static getWavePhase(): number {
    return this.wavePhase
  }

  // Update wave phase
  static updateWavePhase(deltaTime: number): void {
    this.wavePhase += deltaTime * 0.01
  }
}

// GPU Performance Monitor
export class GPUPerformanceMonitor {
  private static fpsHistory: number[] = []
  private static lastFrameTime = 0

  static startFrame(): void {
    this.lastFrameTime = performance.now()
  }

  static endFrame(): void {
    const now = performance.now()
    const frameDuration = now - this.lastFrameTime
    const fps = 1000 / frameDuration

    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > 60) { // Keep last 60 frames
      this.fpsHistory.shift()
    }
  }

  static getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
  }

  static isPerformanceGood(): boolean {
    return this.getAverageFPS() > 30
  }

  static shouldReduceQuality(): boolean {
    return this.getAverageFPS() < 20
  }

  static getPerformanceLevel(): 'high' | 'medium' | 'low' {
    const avgFPS = this.getAverageFPS()
    if (avgFPS > 50) return 'high'
    if (avgFPS > 30) return 'medium'
    return 'low'
  }
}

// Memory Management Utilities for Three.js
export class MemoryManager {
  private static caches = {
    textures: new Map<string, any>(),
    geometries: new Map<string, any>(),
    materials: new Map<string, any>()
  }

  // Cache management for Three.js resources
  static cacheTexture(key: string, texture: any): void {
    this.caches.textures.set(key, texture)
  }

  static getTexture(key: string): any {
    return this.caches.textures.get(key)
  }

  static cacheGeometry(key: string, geometry: any): void {
    this.caches.geometries.set(key, geometry)
  }

  static getGeometry(key: string): any {
    return this.caches.geometries.get(key)
  }

  static cacheMaterial(key: string, material: any): void {
    this.caches.materials.set(key, material)
  }

  static getMaterial(key: string): any {
    return this.caches.materials.get(key)
  }

  // Clear all caches
  static clearAllCaches(): void {
    // Dispose of Three.js resources properly
    this.caches.textures.forEach(texture => {
      if (texture.dispose) texture.dispose()
    })
    this.caches.geometries.forEach(geometry => {
      if (geometry.dispose) geometry.dispose()
    })
    this.caches.materials.forEach(material => {
      if (material.dispose) material.dispose()
    })

    Object.values(this.caches).forEach(cache => cache.clear())
  }

  // Memory usage monitoring
  static getMemoryUsage(): any {
    if ('memory' in performance) {
      return (performance as any).memory
    }
    return null
  }
}

// React Hook for Ocean Theme
export function useOceanTheme() {
  const wavePhase = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  
  const { requestOptimizedFrame, cancelOptimizedFrame, prefersReducedMotion } = usePerformanceOptimization()

  // Animate wave phase
  useEffect(() => {
    if (prefersReducedMotion()) return

    const animate = () => {
      wavePhase.current += 0.01
      OceanAnimationUtils.updateWavePhase(0.01)
      animationFrameId.current = requestOptimizedFrame(animate)
    }

    animationFrameId.current = requestOptimizedFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelOptimizedFrame(animationFrameId.current)
      }
    }
  }, [requestOptimizedFrame, cancelOptimizedFrame, prefersReducedMotion])

  const createRipple = useCallback((x: number, y: number, intensity = 1) => {
    OceanAnimationUtils.createRipple(x, y, intensity)
  }, [])

  const getWaveDisplacement = useCallback((x: number, y: number) => {
    return OceanAnimationUtils.getWaveDisplacement(x, y, wavePhase.current)
  }, [])

  return {
    createRipple,
    getWaveDisplacement,
    wavePhase: wavePhase.current
  }
}