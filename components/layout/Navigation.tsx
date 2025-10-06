"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { gsap } from "gsap"
import { Menu, X, TrendingUp, Sparkles, Zap, Waves, Calendar, Brain } from "lucide-react"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const navItems = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/allotment", label: "Allotment", icon: TrendingUp },
    { href: "/upcoming", label: "IPOs", icon: Calendar },
    { href: "/monitoring", label: "Monitor", icon: Zap },
    { href: "/quiz", label: "Quiz", icon: Brain },
  ]

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    
    // Update scrolled state
    setScrolled(currentScrollY > 20)
    
    // Hide/show navigation based on scroll direction
    if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }
  }, [])

  // Optimized mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion || !logoRef.current) return
    
    const rect = logoRef.current.getBoundingClientRect()
    const logoX = rect.left + rect.width / 2
    const logoY = rect.top + rect.height / 2
    const distance = Math.sqrt(Math.pow(e.clientX - logoX, 2) + Math.pow(e.clientY - logoY, 2))
    
    if (distance < 100) {
      const angle = Math.atan2(e.clientY - logoY, e.clientX - logoX)
      const force = (100 - distance) / 100
      const offsetX = Math.cos(angle) * force * 15
      const offsetY = Math.sin(angle) * force * 15
      
      gsap.to(logoRef.current, {
        x: offsetX,
        y: offsetY,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(logoRef.current, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    // Throttled scroll listener
    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 16)
    }

    // Debounced mouse move listener
    let mouseMoveTimeout: NodeJS.Timeout
    const debouncedMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = setTimeout(() => handleMouseMove(e), 10)
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    window.addEventListener("mousemove", debouncedMouseMove, { passive: true })
    
    // Initial animation
    if (!prefersReducedMotion && navRef.current) {
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out",
        }
      )
    }

    return () => {
      window.removeEventListener("scroll", throttledScroll)
      window.removeEventListener("mousemove", debouncedMouseMove)
      clearTimeout(scrollTimeout)
      clearTimeout(mouseMoveTimeout)
    }
  }, [handleScroll, handleMouseMove, prefersReducedMotion])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          !isVisible ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled 
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo with Ocean Theme */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div 
                ref={logoRef}
                className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-400 to-teal-400 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300"
              >
                {/* Ocean wave effect inside logo */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Animated wave icon */}
                <div className="relative z-10 flex items-center justify-center">
                  <Waves className="w-5 h-5 text-white animate-bounce" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white/70" />
                  </div>
                </div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 bg-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 animate-ping" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Binduv UI
                </span>
                <span className="text-xs text-cyan-400/60 font-medium tracking-wider">
                  IPO PLATFORM
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.href}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
                    animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? undefined : { delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`relative px-6 py-3 rounded-full transition-all duration-300 group ${
                        isActive 
                          ? "text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 shadow-lg shadow-cyan-500/25" 
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center space-x-2 relative z-10">
                        <Icon className={`w-4 h-4 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'group-hover:text-cyan-400'
                        }`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      
                      {/* Ocean ripple effect for non-active items */}
                      {!isActive && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-600/10 scale-0 group-hover:scale-110 group-hover:opacity-0 transition-all duration-500" />
                        </>
                      )}
                      
                      {/* Active state background */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600"
                          layoutId="activeTab"
                          style={{ zIndex: -1 }}
                          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Wave animation for active item */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              className="md:hidden p-3 text-gray-300 hover:text-white transition-colors relative"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-6 h-6">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
                      animate={prefersReducedMotion ? false : { rotate: 0, opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={prefersReducedMotion ? false : { rotate: 90, opacity: 0 }}
                      animate={prefersReducedMotion ? false : { rotate: 0, opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Ocean glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full blur opacity-50 animate-pulse" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
              animate={prefersReducedMotion ? false : { opacity: 1, height: "auto" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="container mx-auto px-6 py-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.href}
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? false : { opacity: 1, x: 0 }}
                        transition={prefersReducedMotion ? undefined : { delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                            isActive 
                              ? "text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 shadow-lg" 
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className={`w-5 h-5 z-10 relative ${
                            isActive ? 'text-white' : 'group-hover:text-cyan-400'
                          }`} />
                          <span className="font-medium z-10 relative">{item.label}</span>
                          
                          {/* Ocean wave effect for mobile */}
                          {!isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                          )}
                          
                          {/* Active state wave animation */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
                
                {/* Mobile menu decoration */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-cyan-400/60">
                    <Waves className="w-4 h-4 animate-bounce" />
                    <span className="text-sm font-medium">Ocean-Powered Platform</span>
                    <Waves className="w-4 h-4 animate-bounce" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Ocean-themed background overlay when mobile menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation